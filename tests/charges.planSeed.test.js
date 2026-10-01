/**
 * A plan made from a V7 answer carries the answer's fund and platform charge (research/charges-setting.md T9, rule 3):
 * the seed already holds the answer's checked inputs, so `inputs.charge` (percent a year) becomes the plan's
 * stressTool.settings.chargesPct; an answer without one (or an invalid one) gives the default, 0.5. Both plans of a
 * couple get the household's one charge. No seed version change: an older V7 tab's seed simply has no charge.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { seedToScenario, checkSeed } from '../src/services/PlanSeed.js';
import { DEFAULT_CHARGES_PCT } from '../src/services/Charges.js';
import { seedA, seedCNow, seedBCouple, NOW_MS } from './integration/fixtures/planSeeds.js';

const SAVED_ON = new Date(2026, 9, 2, 9, 30);
const withCharge = (seed, charge) => ({ ...seed, inputs: { ...seed.inputs, charge } });

describe('the plan made from an answer carries its charge', () => {
  it('the answer\'s charge, as typed (percent a year)', () => {
    for (const charge of [0, 0.05, 1.25, 3]) {
      const seed = withCharge(seedA(), charge);
      expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
      expect(seedToScenario(seed, SAVED_ON).yours.stressTool.settings.chargesPct).toBe(charge);
    }
  });
  it('no charge in the answer (an older tab, or C before 6.19.0): the default, 0.5', () => {
    expect(seedToScenario(seedA(), SAVED_ON).yours.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(seedToScenario(seedCNow(), SAVED_ON).yours.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });
  it('an invalid charge is not carried: the default', () => {
    for (const charge of [-1, 3.5, '1', null, NaN]) expect(seedToScenario(withCharge(seedA(), charge), SAVED_ON).yours.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });
  it('a couple: both plans carry the household\'s one charge; it never reaches the Decision settings', () => {
    const { yours, partner } = seedToScenario(withCharge(seedBCouple(), 0.85), SAVED_ON);
    expect(yours.stressTool.settings.chargesPct).toBe(0.85);
    expect(partner.stressTool.settings.chargesPct).toBe(0.85);
    expect(yours.decisionTool.settings).not.toHaveProperty('chargesPct');
    expect(partner.decisionTool.settings).not.toHaveProperty('chargesPct');
  });
});
