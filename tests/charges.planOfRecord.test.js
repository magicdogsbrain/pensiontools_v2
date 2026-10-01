/**
 * The Decision tool's plan of record (PlanLock.buildPlanOfRecord) keeps its figures (research/charges-setting.md D6,
 * rule 4): it is built from the Decision settings, which never carry the Stress tester's charge — and even if a charge
 * were handed to it, the yardstick "plan vs actual" reads does not take it off in this release.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/storage/DecisionRepository.js', () => ({
  getDecisionSettingsAsync: async () => ({}),
  saveDecisionSettings: async () => {},
  getHistoryAsync: async () => [],
  getAllTaxYearsAsync: async () => ({}),
  decisionSettingsChecksum: (s) => JSON.stringify(s || {})
}));
vi.mock('../src/storage/ScenarioRepository.js', () => ({
  getActivePlanOfRecord: async () => null,
  saveActivePlanOfRecord: async () => {},
  archivePlanOfRecord: async () => {},
  archivePlanDocument: async () => {}
}));

import { buildPlanOfRecord } from '../src/services/PlanLock.js';

describe('the plan of record ignores the charge', () => {
  it('the drawdown and glidepath of the plan of record are the same with or without a charge in the settings', async () => {
    const s = { baseSalary: 70000, isaBalance: 150000, duration: 25, equityMin: 400000, bondMin: 200000, cashTarget: 50000, accessMethod: 'drawdown' };
    const a = await buildPlanOfRecord(s);
    const b = await buildPlanOfRecord({ ...s, chargesPct: 2 });
    expect(b.drawdown).toEqual(a.drawdown);
    expect(b.glidepath).toEqual(a.glidepath);
    expect(a.drawdown.length).toBeGreaterThan(10);
  });
});
