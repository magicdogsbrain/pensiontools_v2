/**
 * Step F2, fix round 2 (lead4.md D2, D6, G1): what the second check found.
 *
 * 1. The State Pension a week is ONE figure written by ONE rule (src/reading/format.js: pounds and pence, as the forecast
 *    letter gives it). Jo's (fictional) full new State Pension is £241.30 a week: the simple plan page says "£241.30 a week",
 *    never "£241".
 * 2. The full view draws the State Pension it counts in the simple income page's own words, its figures marked: the amount
 *    a year, the age it starts, and the week. So the gate compares them between the views.
 *      £241.30 a week x 52 = £12,547.60 → "£12,548 a year before tax".
 * 3. An assumed State Pension ("We assumed £12,000 a year before tax from age 67 ...") is drawn marked in the full view's
 *    summaries (startSummaryHtml), as the simple view marks it.
 * 4. A plan nobody gave an income: the full view says the simple view's "No income set yet" line under its empty box.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { planPage } from '../../src/answers/plan/read.js';
import { incomeOf } from '../../src/answers/plan/income.js';
import { statePensionOf, spLineHtml, spAssumedWords } from '../../src/reading/statePension.js';
import { contextFor } from '../../src/reading/context.js';
import { formatFact } from '../../src/reading/format.js';
import { unmarked } from '../../src/reading/mark.js';
import { startSummaryHtml } from '../../src/ui/startingPotsWords.js';
import { firstStepNoteOfPlan } from '../../src/ui/incomeStepBox.js';
import { INCOME } from '../../src/v7/copy/income.js';
import { SPEND } from '../../src/v7/copy/spend.js';
import { fill } from '../../src/v7/components/PlanFigures.jsx';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const subjectOf = (f) => { const plans = f.plans().map(up); return { plans, plan: plans.find((p) => p.id === f.subject), entries: plans.map((p) => ({ plan: p })) }; };
const fx = (key) => subjectOf(FIXTURES.find((f) => f.key === key));
const marked = (html, id) => [...String(html).matchAll(new RegExp('<span data-fact="' + id.replace('.', '\\.') + '">([^<]*)</span>', 'g'))].map((m) => m[1]);

describe('the State Pension a week: one rule, pounds and pence', () => {
  it('£241.30 a week is "£241.30" on the simple plan page (by hand: the forecast as given), never "£241"', () => {
    const { plan, entries } = fx('retired-draft');
    expect(+plan.stressTool.settings.spWeeklyAmount).toBe(241.3);
    const pg = planPage(entries, plan.id, 'plan', { today: PARITY_DAY });
    const sp = pg.steps.find((s) => s.id === 'plan').sections.find((s) => s.id === 'income').lines.find((l) => l.id === 'pots.statePension');
    expect(sp.sentence.text).toBe('£241.30 a week');
    expect(formatFact('statePension.week', 241.3)).toBe('£241.30');
  });
  it('every fixture with a weekly figure: the plan page writes it by the fact\'s rule', () => {
    let seen = 0;
    for (const f of FIXTURES) {
      const { plan, entries } = subjectOf(f);
      const sp = statePensionOf(plan, contextFor(plan, { now: NOW, today: PARITY_DAY }));
      const pg = planPage(entries, plan.id, 'plan', { today: PARITY_DAY });
      const inc = pg.steps.find((s) => s.id === 'plan').sections.find((s) => s.id === 'income');
      const line = inc && inc.lines.find((l) => l.id === 'pots.statePension');
      if (!line) continue;
      expect(line.sentence.text, f.key).toBe(formatFact('statePension.week', sp.week) + ' a week');
      seen += 1;
    }
    expect(seen).toBeGreaterThan(10);
  });
});

describe('the full view says the State Pension it counts in the simple view\'s words, marked', () => {
  it('£241.30 a week: £12,548 a year before tax from age 66, and the week, each marked (by hand: 241.30 x 52 = 12,547.60)', () => {
    const { plan } = fx('retired-draft');
    const html = spLineHtml(plan, contextFor(plan, { now: NOW, today: PARITY_DAY }));
    expect(marked(html, 'statePension.amount')).toEqual(['£12,548']);
    expect(marked(html, 'statePension.age')).toEqual(['66']);
    expect(marked(html, 'statePension.week')).toEqual(['£241.30']);
  });
  for (const f of FIXTURES) {
    it(f.key + ': the full view\'s line starts with the simple income page\'s line, figure for figure', () => {
      const { plan, entries } = subjectOf(f);
      const inc = incomeOf(entries, plan.id, { today: PARITY_DAY });
      const d = inc.derived[0];
      const simple = fill(INCOME.derived[d.id], d.slots);
      const html = spLineHtml(plan, contextFor(plan, { now: NOW, today: PARITY_DAY }));
      expect(unmarked(html).startsWith(simple), f.key + ': ' + unmarked(html) + ' / ' + simple).toBe(true);
      const sp = statePensionOf(plan, contextFor(plan, { now: NOW, today: PARITY_DAY }));
      if (sp.kind !== 'none') expect(marked(html, 'statePension.amount'), f.key).toEqual([formatFact('statePension.amount', sp.year)]);
      if (sp.week > 0 && sp.kind !== 'assumed') expect(marked(html, 'statePension.week'), f.key).toEqual([formatFact('statePension.week', sp.week)]);
      if (sp.assumed) expect(unmarked(html), f.key).toContain(INCOME.assumedNote.split('{yearly}')[0]);
    });
  }
});

describe('an assumed State Pension is drawn marked in the full view\'s summaries', () => {
  for (const key of ['age-only', 'wizard-defaults']) {
    it(key + ': "We assumed £12,000 ... from age 67" with the amount and the age marked, the words unchanged', () => {
      const { plan } = fx(key);
      const sp = statePensionOf(plan, contextFor(plan, { now: NOW, today: PARITY_DAY }));
      expect(sp.assumed).toBe(true);
      const html = startSummaryHtml(plan.stressTool.settings || {}, { sp });
      expect(marked(html, 'statePension.amount')).toEqual([formatFact('statePension.amount', sp.year)]);
      if (sp.startAge != null) expect(marked(html, 'statePension.age')).toEqual([String(sp.startAge)]);
      expect(unmarked(html)).toContain(spAssumedWords(sp));
    });
  }
});

describe('a plan nobody gave an income: the full view says so in the simple view\'s words', () => {
  for (const key of ['age-only', 'wizard-defaults']) {
    it(key, () => {
      const { plan } = fx(key);
      expect(unmarked(firstStepNoteOfPlan(plan, NOW))).toBe(SPEND.derived.notSet);
    });
  }
  it('the full view paints the State Pension line from the plan, marked (innerHTML, not text)', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toContain('spLineOfPlan(sc, todayOf())');
    expect(html).not.toContain('spAssumedNoteOf');
  });
});
