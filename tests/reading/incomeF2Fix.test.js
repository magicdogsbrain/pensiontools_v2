/**
 * Step F2, fix round 1 (lead4.md D6, D2): what the check found.
 *
 * 1. The saver's aim ("Your plan's £X a year before tax ...", "Are you paying in enough?") is the income reading's first step,
 *    never a second sum on the raw settings. Jo (fictional) wants £2,000 a month after tax from the stop, on the 2026/27 bands
 *    (allowance £12,570, basic rate 20%):
 *      every pound taxed: 0.8G + 2,514 = 24,000 → G = £26,857.50 → £26,858 taken a year before tax
 *      a quarter of each payment tax-free (the one default rule when nothing is chosen): 0.85D + 2,514 = 24,000 →
 *      D = £25,277.65 → £25,278
 *    With no tax-free choice stored, the aim is £25,278 (the reading's rule), never £26,858.
 * 2. A plan nobody gave an income (PlanReading.withPensionToday's `incomeNotSet`: a plan with only an age, a plan straight
 *    from the full view's wizard) reads no income in either view: no step, no "a year before tax", no "a month after tax",
 *    and the simple view's first box is empty, as the full view's is. The planner's default is never shown as the person's.
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { incomeStepsOf } from '../../src/reading/income.js';
import { contextFor } from '../../src/reading/context.js';
import { saverVerdictOf } from '../../src/answers/plan/saving.js';
import { spendOf, boxesOf } from '../../src/answers/plan/spend.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fixture = (key) => FIXTURES.find((f) => f.key === key).plans();
const entriesOf = (plans) => plans.map((p) => ({ id: p.id, plan: p }));
const aimOf = (plan, plans) => { const v = saverVerdictOf(entriesOf(plans), plan.id, { today: PARITY_DAY }); return v && v.ok ? v.notes.aimYearly : null; };
const stepOf = (plan, plans) => incomeStepsOf(plan, contextFor(plan, { today: PARITY_DAY, plans })).steps[0];

describe('the saver\'s aim is the income reading\'s first step', () => {
  it('no tax-free choice stored: a quarter tax-free by the one rule, £25,278 (by hand), in the aim and the reading', () => {
    const plans = fixture('saver-draft');
    const plan = plans[0];
    delete plan.stressTool.settings.accessMethod;
    expect(stepOf(plan, plans).beforeTax).toBe(25278);
    expect(aimOf(plan, plans)).toBe('£25,278');
  });
  it('every pound taxed chosen: £26,858 (by hand), in the aim and the reading', () => {
    const plans = fixture('saver-draft');
    const plan = plans[0];
    plan.stressTool.settings.accessMethod = 'drawdown';
    expect(stepOf(plan, plans).beforeTax).toBe(26858);
    expect(aimOf(plan, plans)).toBe('£26,858');
  });
  it('on every saver fixture the aim is the reading\'s step 0, before and after tax', () => {
    let seen = 0;
    for (const f of FIXTURES) {
      const plans = f.plans();
      for (const plan of plans) {
        const v = saverVerdictOf(entriesOf(plans), plan.id, { today: PARITY_DAY });
        if (!v || !v.ok) continue;
        const st = stepOf(plan, plans);
        expect(v.notes.aimYearly, f.key).toBe('£' + st.beforeTax.toLocaleString('en-GB'));
        expect(v.notes.aimMonthly, f.key).toBe('£' + st.monthAfterTax.toLocaleString('en-GB'));
        seen += 1;
      }
    }
    expect(seen).toBeGreaterThan(4);
  });
  it('the second sum is gone: saving.js no longer works a year before tax itself', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/answers/plan/saving.js'), 'utf8');
    expect(src).not.toMatch(/takenOfTarget\(/);
  });
});

describe('a plan nobody gave an income reads none, in both views', () => {
  for (const key of ['age-only', 'wizard-defaults']) {
    it(`${key}: no step figures, an empty first box, and no step line on the spending page`, () => {
      const plans = fixture(key);
      const plan = plans[0];
      const r = incomeStepsOf(plan, contextFor(plan, { today: PARITY_DAY, plans }));
      expect(r.notSet).toBe(true);
      expect(r.steps).toEqual([]);
      expect(boxesOf(plan, { today: PARITY_DAY })['first.amount']).toBe('');
      const sp = spendOf(entriesOf(plans), plan.id, { today: PARITY_DAY });
      expect(sp.found).toBe(true);
      expect(sp.derived.filter((d) => /^(first|step)\./.test(d.id))).toEqual([]);
      expect(sp.derived.some((d) => d.id === 'notSet')).toBe(true);
      expect(sp.fields.find((f) => f.path === 'first.amount').shown).toBe('');
      expect(sp.fields.find((f) => f.path === 'first.amount').saved).toBe(null);   // nothing is said as saved beside it
      expect(sp.firstGross).toBe(null);
      expect(sp.suggestion).toBe(null);
    });
  }
  it('a plan with its own income still reads it', () => {
    const plans = fixture('retired-draft');
    const r = incomeStepsOf(plans[0], contextFor(plans[0], { today: PARITY_DAY, plans }));
    expect(r.notSet).toBe(false);
    expect(r.steps.length).toBeGreaterThan(0);
  });
});
