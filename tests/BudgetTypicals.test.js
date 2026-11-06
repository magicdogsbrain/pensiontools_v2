import { describe, it, expect } from 'vitest';
import { TYPICAL_TIERS, PLSA_2024, typicalMonthlyFor } from '../src/services/BudgetModel.js';

describe('typical chips sum to the PLSA tier they are named after', () => {
  for (const tier of ['minimum', 'moderate', 'comfortable']) {
    for (const [key, who] of [['s', 'single'], ['c', 'couple']]) {
      it(tier + ' ' + who, () => {
        const budget = { plsaTier: tier, sharedWithPartner: key === 'c' };
        let sum = 0;
        for (const label of Object.keys(TYPICAL_TIERS)) sum += typicalMonthlyFor(label, budget) || 0;
        expect(Math.abs(sum * 12 - PLSA_2024[who][tier]) / PLSA_2024[who][tier]).toBeLessThan(0.02);
      });
    }
  }
});
