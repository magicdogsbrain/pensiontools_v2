import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({
  isFirebaseConfigured: () => false,
  isLoggedIn: () => false
}));

import {
  getDefaultDecisionSettings,
  getDefaultStressSettings,
  seedStressFromDecision
} from '../src/storage/ScenarioRepository.js';
import { ISA_DEFAULTS } from '../src/constants.js';

describe('ISA settings fields', () => {
  it('decision + stress defaults include the ISA pot fields', () => {
    for (const s of [getDefaultDecisionSettings(), getDefaultStressSettings()]) {
      expect(s.isaBalance).toBe(0);
      expect(s.isaReturn).toBe(ISA_DEFAULTS.RETURN);
      expect(s.isaMin).toBe(ISA_DEFAULTS.MIN);
      expect(s.isaDrawdownStrategy).toBe(ISA_DEFAULTS.DRAWDOWN_STRATEGY);
    }
  });
});

describe('seedStressFromDecision ("Copy from Decision")', () => {
  const decision = {
    ...getDefaultDecisionSettings(),
    equityMin: 600000, bondMin: 480000, cashTarget: 120000, duration: 30,
    baseSalary: 59450, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3,
    spStartDate: '21-4-2037', spWeeklyAmount: 230,
    isaBalance: 50000, isaReturn: 0.03, isaMin: 0, isaDrawdownStrategy: 'maximiseLongevity'
  };

  it('copies the shared plan basics from the decision plan', () => {
    const s = seedStressFromDecision(decision, {}, '2026-07-09T00:00:00Z');
    expect(s.equityMin).toBe(600000);
    expect(s.bondMin).toBe(480000);
    expect(s.cashTarget).toBe(120000);
    expect(s.duration).toBe(30);
    expect(s.baseSalary).toBe(59450);
    expect(s.spStartDate).toBe('21-4-2037');
    expect(s.spWeeklyAmount).toBe(230);
    expect(s.consecutiveLimit).toBe(3);
    expect(s.recoveryBuffer).toBe(15000);
  });

  it('translates the protection unit (Decision % → Stress multiplier)', () => {
    const s = seedStressFromDecision(decision, {}, '2026-07-09T00:00:00Z');
    expect(s.protectionMult).toBeCloseTo(0.8, 9); // 20% reduction → 0.8 multiplier
  });

  it('copies the ISA pot', () => {
    const s = seedStressFromDecision(decision, {}, '2026-07-09T00:00:00Z');
    expect(s.isaBalance).toBe(50000);
    expect(s.isaDrawdownStrategy).toBe('maximiseLongevity');
  });

  it('preserves Stress-specific play fields on the overlaid instance', () => {
    const currentStress = { ...getDefaultStressSettings(), taxMode: 'frozen', hodlEnabled: true, hodlValue: 99000 };
    const s = seedStressFromDecision(decision, currentStress, '2026-07-09T00:00:00Z');
    expect(s.taxMode).toBe('frozen');
    expect(s.hodlEnabled).toBe(true);
    expect(s.hodlValue).toBe(99000);
  });

  it('stamps provenance and is deterministic with a fixed timestamp', () => {
    const a = seedStressFromDecision(decision, {}, '2026-07-09T00:00:00Z');
    const b = seedStressFromDecision(decision, {}, '2026-07-09T00:00:00Z');
    expect(a.seededFrom).toBe('decision');
    expect(a.seededAt).toBe('2026-07-09T00:00:00Z');
    expect(a.decisionChecksum).toBe(b.decisionChecksum);
  });

  it('checksum changes when the decision plan changes (basis for the drift banner)', () => {
    const a = seedStressFromDecision(decision, {}, '2026-07-09T00:00:00Z');
    const b = seedStressFromDecision({ ...decision, baseSalary: 60000 }, {}, '2026-07-09T00:00:00Z');
    expect(a.decisionChecksum).not.toBe(b.decisionChecksum);
  });
});
