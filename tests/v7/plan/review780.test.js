/**
 * 7.8.0 review fixes, the plan side, the classic planner and the new app's level words, while weighing:
 *   - the floor is what the run paid: its own State Pension (entered, or the one it assumes) and other income, after tax
 *   - one plan-to age on every page of a plan: the age in its last year ("Plan to age 98"), as About says it
 *   - what is left said once, to the nearest £1,000; no "£0 a year less" cuts where nothing was cut
 *   - "How careful?" on a plan's "Does it last?" (page memory only): the band judged at that level, the level named, Bold's
 *     consequence from the plan's own chance
 *   - the classic block's "How careful?" works (this.value), sits under the title; "Am I on course?" reads the plan's level
 *   - the new app's "How careful?" strip, the keys and the tiles say the levels as chances while weighing
 * Fictional figures only.
 */
import { describe, it, expect } from 'vitest';
import { floorAt, lifeOfSettings } from '../../../src/answers/plan/life.js';
import { runLasts, onCourseOptsOf, planFor } from '../../../src/answers/plan/lastsRun.js';
import { verdictOf, atLevel, boldConsequenceOf } from '../../../src/answers/plan/lasts.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { verdictBlockView, installChanceLevel, cutsRowHtml } from '../../../src/ui/oneAnswerView.js';
import { installInlineHandlers } from '../../../src/ui/inlineHandlers.js';
import { grossToNet } from '../../../src/services/TaxCalculator.js';
import { verdictAtLevel } from '../../../src/answers/shared/rules.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { LEVELS_WORDS, levelKeyOf } from '../../../src/v7/copy/common.js';
import { PICTURE } from '../../../src/v7/copy/picture.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const LIFE = lifeOfSettings({ currentAge: 66, currentAgeAsOf: '2026-05-01' }, now, { startAge: 66 });
const P = { startAge: 66, durationYears: 31, spAnnual: 12000, spStartYear: 1 };
const fake = (strategyId, fails, more = {}) => {
  const survivedMc = Array.from({ length: 20 }, (_, i) => i >= fails);
  return {
    strategyId, affordable: true, ruin: { mc: fails * 5, hist: 3.2 }, n: { mc: 20, hist: 600 }, coverage: 97.5, worst12: { min: 31000, median: 40000 },
    terminal: { p10: 0, p50: 153456, p90: 712600 }, failAges: [], survivedMc,
    futuresMc: { headYear: survivedMc.map((ok, i) => (ok ? null : 20 + i)), failYear: [] }, ...more
  };
};

describe('the floor is what the run paid', () => {
  it('the run\'s own State Pension from its year, and its other income, after tax', () => {
    const p = { spAnnual: 12000, spStartYear: 3, otherIncomeByYear: [4000, 4000, 4000, 4000, 4000] };
    expect(floorAt({}, p, 1)).toBe(Math.round(grossToNet(4000, 12570, 50270, 125140)));
    expect(floorAt({}, p, 3)).toBe(Math.round(grossToNet(16000, 12570, 50270, 125140)));
    // a year past the run's list reads its last year
    expect(floorAt({}, p, 30)).toBe(Math.round(grossToNet(16000, 12570, 50270, 125140)));
    expect(floorAt({}, { spAnnual: 0, spStartYear: 99, otherIncomeByYear: [] }, 5)).toBe(0);
  });

  it('a plan with its State Pension held as a yearly figure (the fresh default plan) has a floor once it starts', () => {
    const plan = entryOf(C['01-fresh-default']).plan;
    const s = effectiveStressSettings(plan, { now });
    const p = planFor(s, now);
    expect(p.spAnnual).toBeGreaterThan(0);
    expect(+s.spWeeklyAmount || 0).toBe(0);
    expect(floorAt(s, p, p.spStartYear + 1)).toBe(Math.round(grossToNet(p.spAnnual + (p.otherIncomeByYear[p.spStartYear + 1] || 0), s.pa ?? 12570, s.brl ?? 50270, s.hrl ?? 125140)));
    expect(floorAt(s, p, p.spStartYear + 1)).toBeGreaterThan(0);
  });

  it('says so when the State Pension is the one assumed (none entered)', () => {
    const a = oneAnswer(fake('pots-and-valves', 4), { ...P, spAssumed: true }, { life: LIFE, floorAt: () => 11000 });
    expect(a.words.floor).toBe('If the money ran out at 87, you would still have £11,000 a year after tax from the income you get anyway, with the State Pension we assumed (none is entered).');
  });
});

describe('one plan-to age; what is left said once and rounded', () => {
  it('the plan-to age is the age in the plan\'s last year, as About and the planner say it', () => {
    const a = oneAnswer(fake('pots-and-valves', 4), P, { life: LIFE });
    expect(a.planToAge).toBe(66 + 31 - 1);
    expect(a.words.fixed).toMatch(/^If you live to 96, /);
  });
  it('what is left: to the nearest £1,000, one line on the band', () => {
    const a = oneAnswer(fake('pots-and-valves', 4), P, { life: LIFE });
    expect(a.words.left).toBe('If you live to 96, what is typically left then is £153,000 at today\'s prices. In the best 1 in 10 futures it is £713,000 or more.');
    const v = verdictOf({ strategyId: 'pots-and-valves', a, ran: { family: true, cutsOn: false } }, { endAge: 96 });
    expect(v.rows.filter((r) => r.id === 'left' || r.id === 'leftW').map((r) => r.id)).toEqual(['leftW']);
  });
  it('no "£0 a year less" cuts: a run-out with nothing cut before it is not a cut, in either app', () => {
    const cuts = { futures: 1000, cutN: 429, cutPct: 42.9, ranOutN: 429, typicalCutPerYear: 0, typicalCutYears: 1, typicalCutTotal: 0, worstCutTotal: 0 };
    const a = { ...oneAnswer(fake('pots-and-valves', 4), P), cuts };
    const v = verdictOf({ strategyId: 'pots-and-valves', a, ran: { family: true, cutsOn: false } }, { endAge: 96 });
    expect(v.rows.map((r) => r.id)).toContain('cuts.untilOut');
    expect(v.rows.map((r) => r.id)).not.toContain('cuts.some');
    expect(cutsRowHtml({ cuts })).toContain('never cut: the plan is paid in full until the money runs out');
    const real = { ...cuts, typicalCutPerYear: 2400, typicalCutTotal: 4800, worstCutTotal: 30000 };
    expect(verdictOf({ strategyId: 'pots-and-valves', a: { ...a, cuts: real }, ran: { family: true, cutsOn: true, cutPct: 20, months: 3 } }, { endAge: 96 }).rows.map((r) => r.id)).toContain('cuts.some');
  });
});

describe('"How careful?" on a plan\'s "Does it last?"', () => {
  const a = oneAnswer(fake('pots-and-valves', 3), P, { life: LIFE });
  it('another level judges the same figures at that level; the level the plan has, nothing changes', () => {
    expect(atLevel(a, 'balanced')).toBe(a);
    for (const k of ['careful', 'bold']) {
      const b = atLevel(a, k);
      expect(b.level).toBe(k);
      expect(b.weighted).toBe(a.weighted);
      expect(b.verdict).toBe(verdictAtLevel(a.sumW, a.n, k, true));
    }
    const v = verdictOf({ strategyId: 'pots-and-valves', a, ran: {} }, { endAge: 96 }, { level: 'bold' });
    expect(v.level).toBe('bold');
    expect(v.slots.bold).toBe(' ' + boldConsequenceOf(a));
  });
  it('Bold\'s consequence from the plan\'s own chance', () => {
    expect(boldConsequenceOf({ weighted: 0.7, failKind: 'ran-out' })).toBe('About 6 times in 20 the money runs out while you are alive, and you would spend less from then on.');
    expect(boldConsequenceOf({ weighted: 0.97, failKind: 'ran-out' })).toBe('About once in 20 the money runs out while you are alive, and you would spend less from then on.');
    expect(boldConsequenceOf({ weighted: 0.99, failKind: 'ran-out' })).toBe('Less than once in 20 the money runs out while you are alive, and you would spend less from then on.');
    expect(boldConsequenceOf({ weighted: 0.8, failKind: 'cut' })).toBe('About 4 times in 20 your income falls short while you are alive, and you would spend less from then on.');
    expect(boldConsequenceOf({ weighted: 1, failKind: 'ran-out' })).toBe('In none of the futures we tried does the money run out while you are alive.');
  });
  it('page memory only: ui/level sets the page\'s level and nothing else', () => {
    const s0 = initialState({ today: TODAY });
    const s1 = reduce(s0, { type: 'ui/level', level: 'bold' });
    expect(s1.ui.level).toBe('bold');
    expect(s1.plans).toBe(s0.plans);
    expect(s1.draft).toBe(s0.draft);
    expect(reduce(s1, { type: 'ui/level', level: 'reckless' }).ui.level).toBe('bold');
  });
});

describe('the classic planner', () => {
  const r = fake('pots-and-valves', 2);
  it('"How careful?" sits under the title and changes the block (this.value, through the page\'s inline handlers)', () => {
    const o = { life: LIFE, level: 'balanced' };
    document.body.innerHTML = '<div id="card">' + verdictBlockView(r, P, o) + '</div>';
    const block = document.querySelector('[data-chance-block]');
    expect(block.children[1].matches('label.verdict-level')).toBe(true);
    const select = block.querySelector('select');
    expect(select.getAttribute('data-on-change')).toBe('setChanceLevel(this.value)');
    window._oneTest = { r, p: P, chance: o };
    installChanceLevel(window, document);
    installInlineHandlers(document);
    select.value = 'bold';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelector('.verdict-title').textContent).toMatch(/at Bold$/);
    expect(window._chanceLevel).toBe('bold');
    delete window._oneTest; delete window._chanceLevel; delete window.setChanceLevel;
  });

  it('"Am I on course?" reads the plan\'s kept level when the page has none, as the verdict block does', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const s = effectiveStressSettings(plan, { now });
    const p = planFor(s, now);
    const kept = { ...plan, fromAnswer: { answer: { level: 'bold', levelChosen: true } } };
    expect(onCourseOptsOf(s, p, 'pots-and-valves', now, { weighted: true, plan: kept }).level).toBe('bold');
    expect(onCourseOptsOf(s, p, 'pots-and-valves', now, { weighted: true, plan: kept, level: 'careful' }).level).toBe('careful');
    expect(onCourseOptsOf(s, p, 'pots-and-valves', now, { weighted: true }).level).toBe('balanced');
  });
});

describe('the new app says the levels as chances while weighing', () => {
  it('the strip\'s labels, the key, the tiles\' words', () => {
    expect(Object.values(LEVELS_WORDS.options).join(' ')).not.toMatch(/futures out of/);
    expect(levelKeyOf({ basis: { weighted: true }, inputs: {} }, 'x')).toBe('Careful = lasts as long as you do 19 times in 20 · Balanced = 18 times in 20 · Bold = 14 times in 20');
    expect(levelKeyOf({ basis: { weighted: true }, inputs: { household: 'couple' } }, 'x')).toMatch(/^Careful = lasts as long as one of you is alive 19 times in 20/);
    expect(levelKeyOf({ basis: {} }, 'the counts')).toBe('the counts');
    for (const k of ['carefulW', 'balancedW', 'boldW', 'couldCarefulW', 'couldBalancedW', 'couldBoldW']) expect(PICTURE.tiles[k], k).not.toMatch(/futures|\{age\}/);
    expect(PICTURE.pot.rows.dMiddlingW).not.toMatch(/futures/);
  });

  it('a plan weighing at its own level: the run carries the figures the band re-judges', { timeout: 240_000 }, () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const out = runLasts(plan, { today: TODAY, weighted: true });
    const v = verdictOf(out, { endAge: out.a.planToAge }, { level: 'careful' });
    expect(v.level).toBe('careful');
    if (out.a.floor && out.a.floor.age >= out.a.planToAge - 40 && out.p && out.p.spAnnual > 0) expect(out.a.floor.yearly).not.toBe(null);
  });
});

describe('A\'s chart key while weighing', () => {
  it('reads the level chosen, never "9 futures out of 10"', async () => {
    const { A } = await import('../../../src/v7/copy/a.js');
    expect(A.answer.chartKeyW).not.toMatch(/futures|9 in 10/);
    expect(A.answer.chartKeyW).toMatch(/How careful\?/);
  });
});
