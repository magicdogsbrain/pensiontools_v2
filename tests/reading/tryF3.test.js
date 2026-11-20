/**
 * "Try a strategy" / "Try a change" (lead4.md D10, D6; step F3): both views fill the flat-income box from ONE reader (the
 * plan's current step, a month after tax: src/reading/tryIncome.js) and turn what is typed back into the year before tax
 * the run takes by ONE function, so the same typing hands each view's run the same input. A what-if never carries the plan's
 * marks.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tryIncomeStartOf, tryIncomeYearOf } from '../../src/reading/tryStart.js';
import { incomeStepsOf } from '../../src/reading/income.js';
import { ageToday } from '../../src/reading/timing.js';
import { tryBoxesOf, checkTry } from '../../src/answers/plan/lasts.js';
import { asWhatIf, markFact } from '../../src/reading/mark.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');
const now = new Date(PARITY_DAY + 'T12:00:00Z');
const ctx = { now };
const subjects = FIXTURES.map((f) => { const plans = f.plans(); const raw = plans.find((p) => p.id === f.subject) || plans[0]; return [f.key, upgradeScenario(JSON.parse(JSON.stringify(raw)), { now }).scenario]; });

describe('the flat-income box starts from the one reading in both views', () => {
  it.each(subjects)('%s: the current step, a month after tax; empty when no income was given', (key, plan) => {
    const r = incomeStepsOf(plan, ctx);
    const age = ageToday(plan, ctx);
    const got = tryIncomeStartOf(plan, ctx);
    if (!r.steps.length) { expect(got, key).toBe(null); expect(tryBoxesOf(plan, { today: PARITY_DAY })['try.income'], key).toBe(''); return; }
    const cur = [...r.steps].reverse().find((s) => age != null && s.fromAge != null && s.fromAge <= age) || r.steps[0];
    expect(got, key).toBe(cur.monthAfterTax);
    // the simple view's box is that figure
    expect(tryBoxesOf(plan, { today: PARITY_DAY })['try.income'], key).toBe(String(got));
  });
  it.each(subjects)('%s: the same typing hands the run the same year before tax in both views', (key, plan) => {
    const c = checkTry(plan, { 'try.incomeMode': 'flat', 'try.income': '2000' }, { today: PARITY_DAY });
    if (!c.ok) return;   // a plan whose other boxes do not check (no pension known) runs nothing
    expect(c.run.income, key).toBe(tryIncomeYearOf(2000, plan, ctx));
    expect(c.run.income, key).toBeGreaterThan(24000);   // a month after tax grossed up: more than twelve of them
  });
  it('the full view fills and reads its box by the same two functions, never the stored step a year before tax', () => {
    const html = read('index.html');
    expect(html).toMatch(/tryIncomeStartOf\(sc, contextFor\(sc, \{ now: todayOf\(\) \}\)\)/);
    expect(html).toMatch(/tryIncomeYearOf\(b\.income, sc,/);
    expect(html).not.toMatch(/getElementById\('tryIncome'\)\.value = s\.baseSalary/);
    expect(html).toMatch(/Flat income \(a month after tax, today's money\)/);
    expect(read('src/answers/plan/lasts.js')).not.toMatch(/monthlyNet\(first, bands\)/);
  });
});

describe('a what-if never carries the plan\'s marks', () => {
  it('asWhatIf takes every fact and table mark off, the figures left as they were', () => {
    const h = '<p>' + markFact('lasts.chance', '19 times in 20') + ' <td data-fact-table="years" data-row="0">£1</td></p>';
    expect(asWhatIf(h)).toBe('<p><span>19 times in 20</span> <td data-row="0">£1</td></p>');
  });
  it('the full view\'s Try a strategy and a way\'s own page run on its dials draw through it', () => {
    const html = read('index.html');
    expect(html).toMatch(/asWhatIf\(strategyResultCard\(r, p\)\)/);
    expect(html).toMatch(/\(docOwn \? card : asWhatIf\(card\)\)/);
    expect(html).toMatch(/\(fromDoc \? vb : asWhatIf\(vb\)\)/);
  });
});
