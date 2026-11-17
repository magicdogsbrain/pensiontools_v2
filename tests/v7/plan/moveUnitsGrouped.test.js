/**
 * The move page says units as the rest of the page does, with commas (7.12.0): "17,300 of 50,700 units held" sat above a
 * Buy table reading "33400" and a schedule reading "25165 units". Fictional Sam (tests/helpers/samMove.js): TA30's ladder
 * place is 40,000 units and 10,000 are held, so 40,000 − 10,000 = 30,000 to buy; TB31's 20,000 are not held, 20,000.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { moveOf } from '../../../src/answers/plan/move.js';
import { samMovePlan, SAM_MOVE_TODAY } from './_samMove.js';

describe('units on the move page', () => {
  const plan = samMovePlan();
  const V = moveOf([{ plan }], plan.id, { today: SAM_MOVE_TODAY });
  it('the Buy rows say units with commas', () => {
    const ta = V.buy.find((b) => /TA30/.test(b.ticker || b.label));
    const tb = V.buy.find((b) => /TB31/.test(b.ticker || b.label));
    expect(ta.units).toBe('30,000');
    expect(tb.units).toBe('20,000');
  });
  it('the schedule says units with commas', () => {
    const steps = V.schedule.steps.filter((s) => s.units != null && s.units !== '');
    expect(steps.length).toBeGreaterThan(0);
    for (const s of steps) expect(s.units).toMatch(/^\d{1,3}(,\d{3})*$/);
    expect(steps.some((s) => s.units.includes(','))).toBe(true);
  });
});
