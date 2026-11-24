/**
 * "In November your plan takes £X before tax from your pension" (Month by month, before the tax year is set up) on a plan
 * locked part way through a tax year. The plan document's first row holds what the plan pays in the months that year has
 * (services/PaidYear.js: year 0 pays for its months), so the month is that row over its months, never over twelve.
 * Fictional person only (Kim, 66), the parity fixture's draft, locked here on 16 November 2026: 5 payments, November to March.
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { lockPatch } from '../../../src/answers/plan/lock.js';
import { runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { planMonthOf } from '../../../src/answers/plan/month.js';
import { pounds } from '../../../src/answers/plan/income.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };

function lockedKim() {
  const f = FIXTURES.find((x) => x.key === 'retired-draft');
  const plan = upgradeScenario(JSON.parse(JSON.stringify(f.plans()[0])), { now: noon(PARITY_DAY) }).scenario;
  const run = runForDocument(plan, { today: PARITY_DAY });
  const lock = lockPatch(plan, { now: noon(PARITY_DAY), run, entries: [{ plan }] });
  expect(lock.ok).toBe(true);
  return applyPatch(plan, lock.patch);
}

describe('a plan locked in November: the month is the first row over its five months', () => {
  const plan = lockedKim();
  const doc = plan.planDocument;
  const row0 = doc.timeline.find((r) => r.taxYear === '2026/27');
  const row1 = doc.timeline.find((r) => r.taxYear === '2027/28');

  it('the document says year 0 has 5 months, and its row is for those months', () => {
    expect(doc.strategy.p.year0Months).toBe(5);
    expect(row0.market + row0.contract).toBeGreaterThan(0);
    // a whole year's row is about 12 ÷ 5 of the part year's (the same draw, before prices move it)
    expect((row1.market + row1.contract) / (row0.market + row0.contract)).toBeGreaterThan(2);
  });

  it('November: the row over 5 months, about a twelfth of the next whole year', () => {
    const m = planMonthOf(plan, '26/27', '2026-11');
    expect(m.amount).toBe(pounds((row0.market + row0.contract) / 5));
    const amount = +m.amount.replace(/[£,]/g, '');
    expect(Math.abs(amount - (row1.market + row1.contract) / 12) / amount).toBeLessThan(0.06);
  });

  it('a whole year later: the row over 12', () => {
    const m = planMonthOf(plan, '27/28', '2027-05');
    expect(m.amount).toBe(pounds((row1.market + row1.contract) / 12));
  });
});
