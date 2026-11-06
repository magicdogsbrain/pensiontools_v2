import { describe, it, expect, vi } from 'vitest';
const calls = [];
vi.mock('../src/services/PlanLock.js', () => ({ lockPlanIfNeeded: async (why) => { calls.push(why); return true; } }));
vi.mock('../src/storage/DecisionRepository.js', () => ({
  getDecisionSettingsAsync: async () => ({ baseSalary: 1 }),
  addHistoryRecord: async () => {},
  recalculateIsaSavingsUsed: async () => {},
  decisionSettingsChecksum: () => 'x'
}));
import { saveDecision } from '../src/services/DecisionService.js';

describe('saving a decision locks a draft plan', () => {
  it('calls lockPlanIfNeeded after the record is stored', async () => {
    await saveDecision({ date: '2026-09', sippDraw: 100, taxYear: '26/27', equity: 1, bond: 1, cash: 1 });
    expect(calls).toEqual(['first monthly entry']);
  });
});
