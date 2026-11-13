/**
 * 7.8.0 second review, the answers side, while weighing (env.weighted):
 *   - D's long-plan warning names the cap the run used (60 years while weighing), as A, B and C do
 * Fictional households only (Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { answerD } from '../../../src/answers/d/answer.js';
import { RULES, drawYearsCap } from '../../../src/answers/shared/rules.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, weighted: true };
const OFF = { ...ENV, weighted: false };

describe('D: a run the cap stops short names the cap it used', () => {
  const ALEX = { stopped: 'yes', you: { pot: 0, age: 40, taxFreeTaken: 'yes' }, savings: 900000, spend: { kind: 'amount', amount: 2000 } };
  it('weighing: the long-plan warning and the capped line both say 60 years', () => {
    const r = answerD(ALEX, ENV);
    expect(r.chance.horizonRule).toBe('capped');
    const warn = r.warnings.find((w) => w.id === 'long-plan');
    expect(warn).toBeTruthy();
    expect(warn.text).toMatch(new RegExp(`^We can only test ${drawYearsCap(ENV)} years ahead`));
    expect(drawYearsCap(ENV)).toBe(RULES.maxDrawYears);
    const said = [...r.assumed, ...r.warnings].map((a) => a.text).join(' ');
    expect(said).not.toMatch(new RegExp(`only test ${RULES.maxYears} years`));
  });

  it('on the count (the rollback): 45 years, as before', () => {
    const r = answerD({ ...ALEX, endAge: 100 }, OFF);
    const warn = r.warnings.find((w) => w.id === 'long-plan');
    expect(warn).toBeTruthy();
    expect(warn.text).toMatch(new RegExp(`^We can only test ${RULES.maxYears} years ahead`));
  });
});
