import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({
  isFirebaseConfigured: () => false,
  isLoggedIn: () => false
}));

import {
  getDefaultDecisionSettings,
  getDefaultStressSettings,
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

