/**
 * S1 (research/v7/editing-in-v7.md 8.5): the pure reader and writer of "What you spend".
 *  - spendOf on the 12 corpus plans × 3 dates; a plan as saved writes nothing; the lumpy plan's facts (3 steps with a glide,
 *    2 one-off costs) and a flat plan's (the first row from the flat figure);
 *  - read∘write∘read is identity over random editable plans and random typed boxes (fast-check): only SPEND_WRITES paths,
 *    every other byte unchanged, Undo byte for byte, the read-back equal to what was typed (a month after tax to the pound,
 *    falls and glides exactly, costs a year after tax to the pound), a second write empty;
 *  - every V6 shape feature round-trips: N steps, % falls, glides, and the planner's own reading
 *    (PlanDocument.shapeLayersFromSettings) shows the steps the screen showed; the schedule written is the planner's own
 *    compileSteps floored by its own floorVals; the suggestion is the planner's own suggestSteps;
 *  - the age↔year rule against the planner's own function; the problems, in their ids; a locked plan writes nothing;
 *  - the stale rule; the sub-step, the address and the plan page's section and link.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { spendOf, spendPatch, applyPatch, boxesOf, savedSpend, checkSpend, compiledSchedule, guaranteedAtYear, plannerSuggest, suggestion, monthlyNet, yearlyGross, stepLines } from '../../../src/answers/plan/spend.js';
import { answerAge, bandsOf, netOf, grossOf, firstStepGross } from '../../../src/answers/plan/about.js';
import { yearOfAge } from '../../../src/answers/plan/income.js';
import { SPEND_FIELDS, SPEND_LISTS, SPEND_WRITES, ALL_WRITES, ABOUT_WRITES, INCOME_WRITES, POTS_WRITES, LASTS_WRITES, LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES, WAY_WRITES, MIX_WRITES, isSpendPath, isPlanEditPath, THENS, PRICES, HOUSEHOLD_WRITES, PLANS_WRITES } from '../../../src/answers/plan/schema.js';
import { SUB_STEPS, ALL_SUB_STEPS } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { parse, format, screenName, PLAN_SUB_STEPS } from '../../../src/v7/router/routes.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { deriveTiming } from '../../../src/services/PlanTiming.js';
import { shapeLayersFromSettings } from '../../../src/services/PlanDocument.js';
import { compileSteps, amountAtAge, scheduleFromSteps } from '../../../src/services/IncomeSchedule.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { extraWithdrawalFor } from '../../../src/services/SimulationEngine.js';
import { suggestSteps } from '../../../src/ui/incomeShapeGraphic.js';
import { dbStartYearOfAge } from '../../../src/ui/dbStartSetting.js';
import { grossToNet } from '../../../src/services/TaxCalculator.js';
import { SPEND } from '../../../src/v7/copy/spend.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, household, DATES, TODAY, noon } from './_plans.js';

const C = corpus();
const text = (v) => JSON.stringify(v);
const strip = (plan) => { const out = JSON.parse(JSON.stringify(plan)); for (const p of ALL_WRITES) { const parts = p.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return out; };
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const EDITABLE = Object.values(C).filter((p) => !isLocked(p));
const LUMPY = C['12-lumpy-db-gia'];
const FLAT = C['10-couple-b'];

describe('S1 — the reading, on every corpus plan at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: found, every field and card has words, every derived line has words, a plan as saved writes nothing`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const a = spendOf(entries, e.plan.id, { today });
        expect(a.found).toBe(true);
        expect(a.fields.map((f) => f.path)).toEqual(SPEND_FIELDS.map((f) => f.path));
        for (const card of a.lists.steps.cards) for (const f of card.fields) expect(SPEND.steps.fields[f.path.split('.').pop()], f.path).toBeTruthy();
        for (const card of a.lists.costs.cards) for (const f of card.fields) expect(SPEND.costs.fields[f.path.split('.').pop()], f.path).toBeTruthy();
        for (const d of a.derived) { expect(SPEND.derived[d.id], d.id).toBeTypeOf('string'); for (const v of Object.values(d.slots)) expect(v, d.id).not.toBeUndefined(); }
        expect(a.errors, e.plan.id).toEqual({});
        expect(a.patch, e.plan.id).toEqual({});
        expect(a.locked).toBe(isLocked(e.plan));
        expect(a.editable).toBe(!a.locked);
        expect(a.savedLine).toMatchObject({ id: 'spend' });
        expect(typeof a.ageNow).toBe('number');
        expect(a.endAge).toBeGreaterThan(a.ageNow);
        // the picture: one bar a year of the plan, from the start age, each a figure a month
        const s = savedSpend(e.plan, { today });
        expect(a.chart.years.length).toBe(s.duration);
        expect(a.chart.years[0].age).toBe(s.ageNow);
        for (const y of a.chart.years) { expect(y.value).toBeGreaterThanOrEqual(0); expect(y.income).toBeLessThanOrEqual(y.value + 0.001); }
        expect(a.chart.list.length).toBeGreaterThan(0);
        expect(a.chart.list[0].fromAge).toBe(s.ageNow);
        // the first row: the saved before-tax figure shown, never re-derived
        expect(a.firstGross).toBe(a.firstGrossSaved);
      }
    });
  }
  it('the lumpy plan (12): three steps (the second gliding), two one-off costs — each a month after tax, by age, with the before-tax figure beside it', () => {
    const plan = entryOf(LUMPY).plan;
    const s = savedSpend(plan, { today: TODAY });
    expect(s.ageNow).toBe(60);
    expect(s.first).toMatchObject({ fromAge: 60, amount: 48000, then: 'level', fallsPct: null, monthly: monthlyNet(48000, s.bands), row: 0 });
    expect(s.steps.map((x) => [x.id, x.fromAge, x.amount, x.then, x.fallsPct, x.monthly])).toEqual([['0', 66, 42000, 'glides', null, monthlyNet(42000, s.bands)], ['1', 76, 34000, 'level', null, monthlyNet(34000, s.bands)]]);
    expect(s.costs.map((x) => [x.label, x.gross, x.atAge, x.years, x.prices])).toEqual([['New roof', 25000, 62, 1, 'rise'], ['Camper van', 36000, 66, 3, 'rise']]);
    // a cost a year after tax is the planner's own marginal sum on top of that year's figure
    const y2 = s.schedule[2];
    expect(s.costs[0].amount).toBe(Math.round(grossToNet(y2 + 25000, s.bands.pa, s.bands.brl, s.bands.hrl) - grossToNet(y2, s.bands.pa, s.bands.brl, s.bands.hrl)));
    expect(boxesOf(plan, { today: TODAY })).toMatchObject({ 'first.amount': String(s.first.monthly), 'first.then': 'level', 'steps.ids': '0,1', 'steps.0.fromAge': '66', 'steps.0.then': 'glides', 'steps.1.fromAge': '76', 'steps.1.then': 'level', 'costs.ids': '0,1', 'costs.0.label': 'New roof', 'costs.0.atAge': '62', 'costs.0.years': '1', 'costs.0.prices': 'rise', 'costs.1.years': '3' });
    const v = spendOf(entriesAt(TODAY), LUMPY.id, { today: TODAY });
    expect(v.derived.map((d) => d.id)).toEqual(['first.level', 'step.glides', 'step.level', 'cost.once', 'cost.years']);
    expect(v.derived[0].slots).toEqual({ age: 60, monthly: '£' + s.first.monthly.toLocaleString('en-GB'), yearly: '£48,000' });
    expect(v.derived[1].slots).toMatchObject({ age: 66, yearly: '£42,000', toAge: 76 });
    expect(v.derived[3].slots).toMatchObject({ label: 'New roof', age: 62, year: '2029/30', years: 1, gross: '£25,000', prices: 'rise' });
    expect(v.derived[4].slots).toMatchObject({ label: 'Camper van', age: 66, years: 3, gross: '£36,000' });
    expect(v.lists.steps.cards[0].gross).toBe('£42,000');
    expect(v.lists.steps.cards[0].ofStart).toBe(Math.round((s.steps[0].monthly / s.first.monthly) * 100));
    expect(v.lists.steps.cards[0].last).toBe(false);
    expect(v.lists.steps.cards[1].last).toBe(true);
    expect(v.budget.workedOut).toBe(false);
    expect(v.savedLine).toEqual({ id: 'spend', slots: { age: 60, monthly: '£' + s.first.monthly.toLocaleString('en-GB'), steps: 2, costs: 2 } });
  });
  it('a flat plan (10): the first row is the flat figure at the start age, no later step, no cost; a locked plan (03) reads its document\'s steps', () => {
    const s = savedSpend(entryOf(FLAT).plan, { today: TODAY });
    expect(s.flat).toBe(true);
    expect(s.first).toMatchObject({ fromAge: 62, amount: 18000, then: 'level', row: null });
    expect(s.steps).toEqual([]);
    expect(s.costs).toEqual([]);
    expect(s.schedule.length).toBe(s.duration + 1);
    const l = savedSpend(entryOf(C['03-gilt-ladder-runup']).plan, { today: TODAY });
    expect(l.locked).toBe(true);
    expect(l.first).toMatchObject({ fromAge: 58, amount: 52000 });
    expect(l.steps.map((x) => [x.fromAge, x.amount, x.then, x.fallsPct])).toEqual([[67, 44000, 'level', null], [78, 36000, 'falls', 1]]);
    expect(l.source.kind).toBe('locked');
    // the first row's "moves evenly" is offered only while there is a later step
    expect(spendOf(entriesAt(TODAY), FLAT.id, { today: TODAY }).fields.find((f) => f.path === 'first.then').options).toEqual(['level', 'falls']);
    expect(spendOf(entriesAt(TODAY), LUMPY.id, { today: TODAY }).fields.find((f) => f.path === 'first.then').options).toEqual(THENS);
  });
  it('the budget as a guide: the cached totals, read only; "Use" is an edit of the first row; nothing under budgetTool is ever written', () => {
    const plan = JSON.parse(JSON.stringify(entryOf(LUMPY).plan));
    plan.budgetTool.settings.lines = [{ label: 'Home', amount: 500 }];
    plan.budgetTool.settings.derived = { ...plan.budgetTool.settings.derived, allInComfortableMonthly: 2264, essentialMonthlyNet: 1610, essentialAnnualNet: 19320 };
    const v = spendOf([{ plan }], plan.id, { today: TODAY });
    expect(v.budget).toEqual({ workedOut: true, total: '£2,264', totalValue: 2264, essentials: '£1,610', at: '11 September 2026' });
    expect(v.chart.essentials).toBe(1610);
    expect(v.lists.steps.cards[1].ofBudget).toBe(Math.round((v.lists.steps.cards[1].fields.find((f) => f.path.endsWith('amount')).shown / 2264) * 100));
    const used = spendPatch(plan, { 'first.amount': '2264' }, { today: TODAY });
    expect(used.ok).toBe(true);
    expect(used.patch['stressTool.settings.baseSalary']).toBe(yearlyGross(2264, bandsOf(plan.stressTool.settings)));
    for (const k of Object.keys(used.patch)) expect(k.startsWith('budgetTool')).toBe(false);
    expect(SPEND_WRITES.some((p) => p.startsWith('budgetTool'))).toBe(false);
    // below the essentials: the first such year, a guide only
    const low = spendOf([{ plan }], plan.id, { today: TODAY, typed: { 'first.amount': '1500' } });
    expect(low.below).toEqual({ age: 60, amount: '£1,610' });
    expect(low.chart.years[0].below).toBe(true);
  });
});

describe('S1 — the write: the planner\'s keys, as its Save writes them', () => {
  const plan = entryOf(LUMPY).plan;
  const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
  const b = bandsOf(ss);
  it('a changed first figure: the steps (the untouched rows byte for byte), the schedule, the first figure, the Decision copies; nothing else', () => {
    const p = spendPatch(plan, { 'first.amount': '3000' }, { today: TODAY });
    expect(p.ok).toBe(true);
    const gross = yearlyGross(3000, b);
    expect(Object.keys(p.patch).sort()).toEqual(['decisionTool.settings.baseSalary', 'decisionTool.settings.targetSchedule', 'stressTool.settings.baseSalary', 'stressTool.settings.incomeSteps', 'stressTool.settings.targetSchedule']);
    expect(p.patch['stressTool.settings.incomeSteps']).toEqual([{ amount: gross, fromAge: 60 }, LUMPY.stressTool.settings.incomeSteps[1], LUMPY.stressTool.settings.incomeSteps[2]]);
    expect(p.patch['stressTool.settings.baseSalary']).toBe(gross);
    expect(p.patch['decisionTool.settings.baseSalary']).toBe(gross);
    expect(p.patch['stressTool.settings.targetSchedule'].length).toBe(ss.duration + 1);
    expect(p.patch['decisionTool.settings.targetSchedule']).toEqual(p.patch['stressTool.settings.targetSchedule']);
    expect(p.previous['stressTool.settings.incomeSteps']).toEqual(LUMPY.stressTool.settings.incomeSteps);
    // the planner's engine reads the new schedule (the saved one wins) and the planner's own step reading shows the new first figure
    const after = applyPatch(plan, p.patch);
    const ssA = effectiveStressSettings(after, { now: noon(TODAY) });
    expect(scheduleFromSteps(ssA)).toEqual(p.patch['stressTool.settings.targetSchedule']);
    expect(firstStepGross(ssA)).toBe(gross);
    expect(savedSpend(after, { today: TODAY }).first.monthly).toBe(3000);
    expect(spendPatch(after, {}, { today: TODAY }).patch).toEqual({});
  });
  it('a step with a fall, one that moves evenly, a removed step, and the first row\'s own fall — read back by the planner\'s own amountAtAge', () => {
    const typed = { 'steps.ids': '0,1,n1', 'steps.0.then': 'level', 'steps.1.then': 'falls', 'steps.1.fallsPct': '2.5', 'steps.n1.fromAge': '85', 'steps.n1.amount': '1500', 'steps.n1.then': 'level', 'first.then': 'falls', 'first.fallsPct': '1' };
    const p = spendPatch(plan, typed, { today: TODAY });
    expect(p.ok).toBe(true);
    const rows = p.patch['stressTool.settings.incomeSteps'];
    expect(rows.map((r) => [r.fromAge, r.amount, r.decline || 0, !!r.glideToNext])).toEqual([[60, 48000, 1, false], [66, 42000, 0, false], [76, 34000, 2.5, false], [85, yearlyGross(1500, b), 0, false]]);
    const after = applyPatch(plan, p.patch);
    const read = savedSpend(after, { today: TODAY });
    expect(read.first).toMatchObject({ then: 'falls', fallsPct: 1, amount: 48000 });
    expect(read.steps.map((x) => [x.fromAge, x.then, x.fallsPct])).toEqual([[66, 'level', null], [76, 'falls', 2.5], [85, 'level', null]]);
    // the schedule is the planner's own compileSteps floored by its own floor (every year but the State Pension's first, which the planner counts in full)
    const ssA = effectiveStressSettings(after, { now: noon(TODAY) });
    const t = deriveTiming(ssA, noon(TODAY));
    const layers = shapeLayersFromSettings(ssA, t, { now: noon(TODAY) });
    const plain = compileSteps({ ...ssA, targetSchedule: null }, t.shapeAgeNow);
    const sched = p.patch['stressTool.settings.targetSchedule'];
    for (let y = 0; y < ssA.duration; y++) if (!layers.sp || t.shapeAgeNow + y !== layers.sp.fromAge) expect(sched[y], 'year ' + y).toBe(Math.round(Math.max(plain[y], layers.floorVals[y])));
    expect(layers.steps.map((s) => [s.fromAge, s.amount, s.decline || 0, !!s.glideToNext])).toEqual(rows.map((r) => [r.fromAge, r.amount, r.decline || 0, !!r.glideToNext]));
    // a removed step
    const q = spendPatch(after, { 'steps.ids': '0' }, { today: TODAY });
    expect(q.patch['stressTool.settings.incomeSteps'].map((r) => r.fromAge)).toEqual([60, 66]);
    expect(savedSpend(applyPatch(after, q.patch), { today: TODAY }).steps.length).toBe(1);
  });
  it('one-off costs: a new cost is the planner\'s row at its plan year with the before-tax figure on top of that year; an edited card is merged; a removed one goes; an untouched one is byte for byte', () => {
    const withExtra = JSON.parse(JSON.stringify(plan));
    withExtra.stressTool.settings.extraWithdrawals[0].note = 'kept';
    const p = spendPatch(withExtra, { 'costs.ids': '0,n1', 'costs.n1.label': 'Car', 'costs.n1.amount': '15,000', 'costs.n1.atAge': '63', 'costs.n1.years': '2', 'costs.n1.prices': 'fixed' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['stressTool.settings.extraWithdrawals']);
    const rows = p.patch['stressTool.settings.extraWithdrawals'];
    expect(rows[0]).toEqual(withExtra.stressTool.settings.extraWithdrawals[0]);
    expect(rows[1]).toMatchObject({ label: 'Car', year: 3, years: 2, indexation: 'level' });
    const s = savedSpend(withExtra, { today: TODAY });
    const y3 = s.schedule[3];
    expect(rows[1].amount).toBe(Math.round(grossOf(netOf(y3, s.bands) + 15000, s.bands) - grossOf(netOf(y3, s.bands), s.bands)));
    expect(yearOfAge(63, 60)).toBe(3);
    expect(dbStartYearOfAge(63, 60)).toBe(3);
    const after = applyPatch(withExtra, p.patch);
    const read = savedSpend(after, { today: TODAY });
    expect(read.costs.map((x) => [x.label, x.amount, x.atAge, x.years, x.prices])).toEqual([['New roof', s.costs[0].amount, 62, 1, 'rise'], ['Car', 15000, 63, 2, 'fixed']]);
    // the planner's own engine adds the before-tax figure in that year, and for the years it runs
    const cfg = createSimulationConfigFromSettings({}, effectiveStressSettings(after, { now: noon(TODAY) }));
    expect(extraWithdrawalFor(cfg, 3)).toBe(25000 * 0 + rows[1].amount);
    expect(extraWithdrawalFor(cfg, 4)).toBe(rows[1].amount);
    expect(extraWithdrawalFor(cfg, 5)).toBe(0);
    expect(extraWithdrawalFor(cfg, 2)).toBe(25000);
    // the planner's layers draw it at the age
    const layers = shapeLayersFromSettings(effectiveStressSettings(after, { now: noon(TODAY) }), undefined, { now: noon(TODAY) });
    expect(layers.events.filter((e) => e.kind === 'out').map((e) => [e.label, e.age, e.years])).toEqual([['New roof', 62, 1], ['Car', 63, 2]]);
    // edited: merged onto its row; removed: gone
    const q = spendPatch(after, { 'costs.0.amount': '10000', 'costs.ids': '0' }, { today: TODAY });
    const qrows = q.patch['stressTool.settings.extraWithdrawals'];
    expect(qrows.length).toBe(1);
    expect(qrows[0]).toMatchObject({ label: 'New roof', year: 2, note: 'kept', years: 1, indexation: 'cpi' });
    expect(savedSpend(applyPatch(after, q.patch), { today: TODAY }).costs.map((x) => [x.label, x.amount])).toEqual([['New roof', 10000]]);
  });
  it('a flat plan gains the shape block the planner writes the first time its editor is used; an old "declining" plan has the profile set to flat with the steps, as the planner\'s Save does', () => {
    const flat = entryOf(FLAT).plan;
    const p = spendPatch(flat, { 'steps.ids': 'n1', 'steps.n1.fromAge': '75', 'steps.n1.amount': '1200' }, { today: TODAY });
    expect(p.patch['stressTool.settings.incomeShape']).toBe('phases');
    expect(p.patch['stressTool.settings.incomeSteps']).toEqual([{ fromAge: 62, amount: 18000 }, { fromAge: 75, amount: yearlyGross(1200, bandsOf(flat.stressTool.settings)) }]);
    expect(p.patch['stressTool.settings.baseSalary']).toBeUndefined();   // unchanged: 18,000 already
    expect(p.patch['stressTool.settings.spendingProfile']).toBeUndefined();   // absent reads as flat: no key for nothing
    expect(p.patch['stressTool.settings.targetSchedule'][0]).toBe(18000);
    const old = JSON.parse(JSON.stringify(flat));
    old.stressTool.settings.spendingProfile = 'declining';
    const q = spendPatch(old, { 'first.amount': '2000' }, { today: TODAY });
    expect(q.patch['stressTool.settings.spendingProfile']).toBe('flat');
    expect(q.previous['stressTool.settings.spendingProfile']).toBe('declining');
    // the baked-in steps (the planner's own reading) are what is kept, with the first changed
    const eff = effectiveStressSettings(old, { now: noon(TODAY) });
    expect(q.patch['stressTool.settings.incomeSteps'].slice(1)).toEqual(eff.incomeSteps.slice(1));
  });
  it('a locked plan: no patch, whatever is typed', () => {
    const locked = entryOf(C['03-gilt-ladder-runup']).plan;
    expect(spendPatch(locked, { 'first.amount': '3000' }, { today: TODAY })).toEqual({ ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} });
  });
  it('the problems, in their ids', () => {
    const errs = (typed) => checkSpend(plan, typed, { today: TODAY }).errors;
    expect(errs({ 'first.amount': '' })).toEqual({ 'first.amount': 'required' });
    expect(errs({ 'first.amount': 'abc' })).toEqual({ 'first.amount': 'notANumber' });
    expect(errs({ 'first.amount': '0' })).toEqual({ 'first.amount': 'tooLow' });
    expect(errs({ 'first.amount': '50,001' })).toEqual({ 'first.amount': 'tooHigh' });
    expect(errs({ 'first.then': 'falls' })).toEqual({ 'first.fallsPct': 'required' });
    expect(errs({ 'first.then': 'falls', 'first.fallsPct': '0.3' })).toEqual({ 'first.fallsPct': 'range' });
    expect(errs({ 'first.then': 'falls', 'first.fallsPct': '11' })).toEqual({ 'first.fallsPct': 'range' });
    expect(errs({ 'first.then': 'falls', 'first.fallsPct': '2.75' })).toEqual({});
    expect(errs({ 'first.then': 'glides', 'steps.ids': '' })).toEqual({ 'first.then': 'glidesLast' });
    expect(errs({ 'first.then': 'x' })).toEqual({ 'first.then': 'notAnOption' });
    expect(errs({ 'steps.1.then': 'glides' })).toEqual({ 'steps.1.then': 'glidesLast' });
    expect(errs({ 'steps.0.fromAge': '60' })).toEqual({ 'steps.0.fromAge': 'beforeStart' });
    expect(errs({ 'steps.0.fromAge': '92' })).toEqual({ 'steps.0.fromAge': 'afterEnd' });
    expect(errs({ 'steps.0.fromAge': '76' })).toEqual({ 'steps.0.fromAge': 'sameAge', 'steps.1.fromAge': 'sameAge' });
    expect(errs({ 'steps.0.amount': '' })).toEqual({ 'steps.0.amount': 'required' });
    expect(errs({ 'steps.0.then': 'falls', 'steps.0.fallsPct': '' })).toEqual({ 'steps.0.fallsPct': 'required' });
    expect(errs({ 'costs.0.atAge': '59' })).toEqual({ 'costs.0.atAge': 'beforeStart' });
    expect(errs({ 'costs.0.atAge': '92' })).toEqual({ 'costs.0.atAge': 'afterEnd' });
    expect(errs({ 'costs.0.years': '40' })).toEqual({ 'costs.0.years': 'tooManyYears' });
    expect(errs({ 'costs.0.years': '0' })).toEqual({ 'costs.0.years': 'tooLow' });
    expect(errs({ 'costs.0.amount': '1,000,001' })).toEqual({ 'costs.0.amount': 'tooHigh' });
    expect(errs({ 'costs.0.label': 'x'.repeat(61) })).toEqual({ 'costs.0.label': 'tooLong' });
    expect(errs({ 'costs.0.prices': 'gold' })).toEqual({ 'costs.0.prices': 'notAnOption' });
    expect(errs({ 'costs.ids': '0,1,n1', 'costs.n1.amount': '', 'costs.n1.atAge': '' })).toEqual({ 'costs.n1.amount': 'required', 'costs.n1.atAge': 'required' });
    expect(checkSpend(plan, { 'steps.ids': '0,0,zz' }, { today: TODAY }).lists.steps.ids).toEqual(['0']);
    // every error has words
    for (const [k, e] of Object.entries(errs({ 'first.amount': '', 'steps.0.fromAge': '60', 'steps.1.then': 'glides', 'costs.0.years': '40' }))) {
      const parts = k.split('.');
      const words = parts[0] === 'first' ? SPEND.errors[k] : SPEND[parts[0]].errors[parts[2]];
      expect(words[e], k).toBeTypeOf('string');
    }
    expect(spendPatch(plan, { 'costs.0.atAge': '59' }, { today: TODAY }).patch).toEqual({});
  });
});

describe('S1 — the planner\'s own rules, imported or matched function for function', () => {
  it('the suggestion is the planner\'s suggestSteps on the before-tax figures, said a month after tax', () => {
    fc.assert(fc.property(fc.integer({ min: 10000, max: 120000 }), fc.integer({ min: 55, max: 90 }), fc.integer({ min: 0, max: 40000 }), (first, ageNow, ess) => {
      expect(plannerSuggest(first, ageNow, ess)).toEqual(suggestSteps(first, ageNow, ess));
    }));
    const s = savedSpend(entryOf(LUMPY).plan, { today: TODAY });
    const sug = suggestion(48000, s);
    const rows = suggestSteps(48000, 60, 0);
    expect(sug.edits).toEqual([
      { path: 'steps.ids', value: 'n1,n2' },
      { path: 'steps.n1.fromAge', value: '75' }, { path: 'steps.n1.amount', value: String(monthlyNet(rows[1].amount, s.bands)) }, { path: 'steps.n1.then', value: 'level' },
      { path: 'steps.n2.fromAge', value: '85' }, { path: 'steps.n2.amount', value: String(monthlyNet(rows[2].amount, s.bands)) }, { path: 'steps.n2.then', value: 'level' }
    ]);
    expect(sug).toMatchObject({ age75: 75, age85: 85, floor: null });
    // with a budget: never below its essentials, grossed up as the planner grosses them; past 85: nothing
    const withBudget = { ...s, budget: { ...s.budget, workedOut: true, essentialsAnnualNet: 40000 } };
    const ess = Math.round(grossOf(40000, s.bands));
    expect(suggestion(48000, withBudget).edits.find((e) => e.path === 'steps.n2.amount').value).toBe(String(monthlyNet(suggestSteps(48000, 60, ess)[2].amount, s.bands)));
    expect(suggestion(48000, withBudget).floor).toBe(monthlyNet(ess, s.bands));
    expect(suggestion(48000, { ...s, ageNow: 86 })).toMatchObject({ edits: [{ path: 'steps.ids', value: '' }], age75: null, age85: null });
  });
  it('the floor is the planner\'s guaranteedAtYear: the State Pension from its plan year, other income, the final-salary pension, every stream in range', () => {
    const plan = entryOf(LUMPY).plan;
    const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
    const t = deriveTiming(ss, noon(TODAY));
    const layers = shapeLayersFromSettings(ss, t, { now: noon(TODAY) });
    // (the planner's floorVals are rounded for the picture; its guaranteedAtYear is not — the schedule rounds after the max)
    for (let y = 0; y < ss.duration; y++) if (t.shapeAgeNow + y !== layers.sp.fromAge) expect(Math.round(guaranteedAtYear(ss, t, t.shapeAgeNow, y, noon(TODAY))), 'year ' + y).toBe(layers.floorVals[y]);
    expect(guaranteedAtYear(ss, t, t.shapeAgeNow, 7, noon(TODAY))).toBeCloseTo(1200 + 9400 + 7200 + 224.9 * 52, 6);   // 67: SP, DB, the flat; the consulting ended at 63
    const sched = compiledSchedule(ss.incomeSteps, 48000, ss, t, t.shapeAgeNow, ss.duration, noon(TODAY));
    expect(sched.length).toBe(ss.duration + 1);
    for (let y = 0; y <= ss.duration; y++) expect(sched[y]).toBe(Math.round(Math.max(0, amountAtAge(ss.incomeSteps, t.shapeAgeNow + y, 48000), guaranteedAtYear(ss, t, t.shapeAgeNow, y, noon(TODAY)))));
  });
  it('a month after tax ↔ a year before tax: the planner\'s own two functions, and a figure typed reads back as typed', () => {
    const b = bandsOf({ pa: 12570, brl: 50270, hrl: 125140 });
    fc.assert(fc.property(fc.integer({ min: 1, max: 50000 }), (m) => {
      expect(monthlyNet(yearlyGross(m, b), b)).toBe(m);
    }));
    expect(yearlyGross(1000, b)).toBe(12000);   // within the allowance: exact, no tax
    expect(bandsOf({})).toEqual({ pa: 12570, brl: 50270, hrl: 125140 });
    expect(bandsOf({ pa: 10000, brl: 40000, hrl: 100000 })).toEqual({ pa: 10000, brl: 40000, hrl: 100000 });
  });
  it('the lines a sentence reads: the step in force at the start and each later one inside the plan, where a fall ends and where a glide arrives', () => {
    const b = bandsOf({});
    const rows = [{ fromAge: 60, amount: 48000 }, { fromAge: 66, amount: 42000, glideToNext: true }, { fromAge: 76, amount: 34000, decline: 1 }, { fromAge: 99, amount: 20000 }];
    const lines = stepLines(rows, 60, 32, b);
    expect(lines.map((l) => [l.fromAge, l.then, l.endAge])).toEqual([[60, 'level', undefined], [66, 'glides', 76], [76, 'falls', 91]]);
    expect(lines[1].endPerMonth).toBe(monthlyNet(34000, b));
    expect(lines[2].endPerMonth).toBe(monthlyNet(amountAtAge(rows, 91), b));
    // a step at or before the start is in force from it
    expect(stepLines([{ fromAge: 55, amount: 40000 }, { fromAge: 58, amount: 30000, decline: 2 }], 60, 10, b).map((l) => [l.fromAge, l.then])).toEqual([[60, 'falls']]);
  });
});

/** Random typed boxes that pass the checks for a plan, as a person would type them. */
function validTyped(plan) {
  const s = savedSpend(plan, { today: TODAY });
  const lo = s.first.fromAge + 1, hi = s.endAge;
  const money = (max) => fc.integer({ min: 1, max }).map(String);
  const then = fc.constantFrom('level', 'falls');
  const pct = fc.integer({ min: 1, max: 40 }).map((k) => String(k * 0.25));
  const step = fc.record({ keep: fc.boolean(), fromAge: fc.integer({ min: lo, max: hi }), amount: money(20000), then, fallsPct: pct });
  const cost = fc.record({ keep: fc.boolean(), label: fc.stringMatching(/^[A-Za-z][A-Za-z ]{0,20}$/), amount: money(200000), atAge: fc.integer({ min: s.ageNow, max: hi }), years: fc.integer({ min: 1, max: 3 }), prices: fc.constantFrom(...PRICES) });
  const steps = fc.tuple(fc.tuple(...s.steps.map(() => step)), fc.array(step, { maxLength: 2 })).map(([kept, added]) => {
    const typed = {}; const ids = []; const ages = new Set();
    const put = (id, k, saved) => {
      let age = k.fromAge; while (ages.has(age)) age++;
      if (age > hi) return;
      ages.add(age); ids.push(id);
      typed[`steps.${id}.fromAge`] = String(age); typed[`steps.${id}.amount`] = saved && !k.keep ? String(saved.monthly) : k.amount; typed[`steps.${id}.then`] = k.then; typed[`steps.${id}.fallsPct`] = k.then === 'falls' ? k.fallsPct : '';
    };
    s.steps.forEach((c, i) => { const k = kept[i]; if (k.keep || i % 2 === 0) put(c.id, k, c); });
    added.forEach((k, i) => put('n' + (i + 1), k, null));
    typed['steps.ids'] = ids.join(',');
    return typed;
  });
  const costs = fc.tuple(fc.tuple(...s.costs.map(() => cost)), fc.array(cost, { maxLength: 2 })).map(([kept, added]) => {
    const typed = {}; const ids = [];
    const put = (id, k) => {
      const years = Math.min(k.years, hi - k.atAge + 1);
      ids.push(id);
      typed[`costs.${id}.label`] = k.label; typed[`costs.${id}.amount`] = k.amount; typed[`costs.${id}.atAge`] = String(k.atAge); typed[`costs.${id}.years`] = String(years); typed[`costs.${id}.prices`] = k.prices;
    };
    s.costs.forEach((c, i) => { if (kept[i].keep) put(c.id, kept[i]); });
    added.forEach((k, i) => put('n' + (i + 1), k));
    typed['costs.ids'] = ids.join(',');
    return typed;
  });
  return fc.record({ first: fc.record({ amount: fc.oneof(fc.constant(String(s.first.monthly)), money(20000)), then, fallsPct: pct }), steps, costs })
    .map((r) => ({ 'first.amount': r.first.amount, 'first.then': r.first.then, 'first.fallsPct': r.first.then === 'falls' ? r.first.fallsPct : '', ...r.steps, ...r.costs }));
}

describe('S1 — properties: read∘write∘read is identity; only declared keys change; Undo puts the plan back exactly; the planner reads what the screen showed', () => {
  it('for random editable plans and random boxes', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped(plan).map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const c = checkSpend(plan, typed, { today: TODAY });
      expect(c.errors).toEqual({});
      const p = spendPatch(plan, typed, { today: TODAY });
      expect(p.ok).toBe(true);
      for (const k of Object.keys(p.patch)) { expect(SPEND_WRITES).toContain(k); expect(ABOUT_WRITES).not.toContain(k); expect(INCOME_WRITES).not.toContain(k); }
      expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
      const after = applyPatch(plan, p.patch);
      expect(text(strip(after))).toBe(text(strip(plan)));
      // read again: the first row and the steps hold what was typed, in age order; the costs in the order typed
      const read = savedSpend(after, { today: TODAY });
      expect(read.first.monthly).toBe(+typed['first.amount']);
      expect(read.first.then).toBe(typed['first.then']);
      if (typed['first.then'] === 'falls') expect(read.first.fallsPct).toBe(+typed['first.fallsPct']);
      const ids = typed['steps.ids'] ? typed['steps.ids'].split(',').filter(Boolean) : [];
      const wanted = ids.map((id) => ({ fromAge: +typed[`steps.${id}.fromAge`], monthly: +typed[`steps.${id}.amount`], then: typed[`steps.${id}.then`], fallsPct: typed[`steps.${id}.then`] === 'falls' ? +typed[`steps.${id}.fallsPct`] : null })).sort((x, y) => x.fromAge - y.fromAge);
      expect(read.steps.map((x) => ({ fromAge: x.fromAge, monthly: x.monthly, then: x.then, fallsPct: x.fallsPct }))).toEqual(wanted);
      const cids = typed['costs.ids'] ? typed['costs.ids'].split(',').filter(Boolean) : [];
      expect(read.costs.map((x) => [x.label, x.amount, x.atAge, x.years, x.prices])).toEqual(cids.map((id) => [typed[`costs.${id}.label`].trim(), +typed[`costs.${id}.amount`], +typed[`costs.${id}.atAge`], +typed[`costs.${id}.years`], typed[`costs.${id}.prices`]]));
      // writing the read boxes again changes nothing
      expect(spendPatch(after, {}, { today: TODAY }).patch).toEqual({});
      expect(spendPatch(after, boxesOf(after, { today: TODAY }), { today: TODAY }).patch).toEqual({});
      // Undo: the previous values back, byte for byte
      expect(text(applyPatch(after, p.previous))).toBe(text(plan));
      // the planner's own reading shows the steps the screen showed: age, before-tax amount, fall, glide
      const ssA = effectiveStressSettings(after, { now: noon(TODAY) });
      const tA = deriveTiming(ssA, noon(TODAY));
      const layers = shapeLayersFromSettings(ssA, tA, { now: noon(TODAY) });
      const shown = spendOf([{ plan: after }], after.id, { today: TODAY });
      const showed = [read.first, ...read.steps].map((x) => [x.fromAge, x.amount, x.then === 'falls' ? x.fallsPct : 0, x.then === 'glides']);
      expect(layers.steps.map((s) => [+s.fromAge, +s.amount, +s.decline || 0, !!s.glideToNext && layers.steps.indexOf(s) < layers.steps.length - 1])).toEqual(showed);
      expect(shown.chart.years.length).toBe(read.duration);
      if ('stressTool.settings.targetSchedule' in p.patch) expect(scheduleFromSteps(ssA)).toEqual(p.patch['stressTool.settings.targetSchedule']);
    }), { numRuns: 100 });
  });
});

describe('S1 — the stale-answer rule gains what is spent when the record has take-home rows', () => {
  const base = entryOf(FLAT).plan;
  const ss = base.stressTool.settings;
  const withAnswer = (extra = {}) => ({ ...JSON.parse(JSON.stringify(base)), lastModified: '2026-09-20T10:00:00.000Z', fromAnswer: { savedOn: '2026-09-20T10:00:00.000Z', answer: { lasted: 9 }, who: 'you', people: [{ who: 'you', ageToday: ss.currentAge, ageAtStop: ss.retireAge, years: ss.duration, stop: { kind: 'later', yearsFromNow: 4 }, ...extra }] } });
  it('a record without rows is judged on the other facts; with rows, a changed first figure (beyond £1 a month) makes the answer older than its inputs', () => {
    const now = (p) => effectiveStressSettings(p, { now: noon(TODAY) });
    expect(answerAge(withAnswer(), now(withAnswer()))).toBe(null);
    const monthly = monthlyNet(18000, bandsOf(ss));
    const matching = withAnswer({ takeHome: [{ fromAge: 62, perMonth: monthly + 0.4 }] });
    expect(answerAge(matching, now(matching))).toBe(null);
    const changed = applyPatch({ ...matching, lastModified: '2026-10-02T09:00:00.000Z' }, spendPatch(matching, { 'first.amount': String(monthly + 50) }, { today: TODAY }).patch);
    expect(answerAge(changed, now(changed))).toMatchObject({ diffs: ['spend'], changedOn: '2 October 2026' });
    const page = planPage([{ plan: changed }], changed.id, 'plan', { today: TODAY });
    expect(page.next.id).toBe('P.recheck');
  });
});

describe('S1 — the sub-step, the address and the plan page\'s section', () => {
  it('"spend" sits under "plan" beside "about" and "income"; the address parses and formats; the screen is plan.spend', () => {
    expect(SUB_STEPS.plan).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']);
    expect(ALL_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']);
    expect(PLAN_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix', 'household', 'hold', 'move', 'budget', 'saving']);   // the household, hold, move, budget and saving rail steps draw their own screens (road-to-7.md steps 9, 10, 11b)
    const r = parse('#/plan/AboutPlan01/spend');
    expect(r).toEqual({ screen: 'plan', q: null, step: 'spend', planId: 'AboutPlan01', focus: null });
    expect(format(r)).toBe('#/plan/AboutPlan01/spend');
    expect(screenName(r)).toBe('plan.spend');
  });
  it('every corpus plan: the plan step\'s "What the plan pays" section links to the step', () => {
    const entries = entriesAt(TODAY);
    for (const e of entries) {
      const pg = planPage(entries, e.plan.id, 'plan', { today: TODAY });
      const plan = pg.steps.find((s) => s.id === 'plan');
      expect(plan.sections.map((s) => s.id)).toEqual(['about', 'pays', 'pots', 'income', 'way', 'mix']);
      const pays = plan.sections.find((s) => s.id === 'pays');
      expect(pays.href).toBe('#/plan/' + e.plan.id + '/spend');
      expect(pays.sub).toBe('spend');
      expect(pays.lines.length).toBeGreaterThan(0);
      for (const l of pays.lines) expect(PLAN.lines[l.id], l.id).toBeTypeOf('string');
    }
  });
  it('the fields, the cards and their words line up; the draft paths; the declared writes are the planner\'s shape and cost keys', () => {
    for (const f of SPEND_FIELDS) expect(SPEND.errors[f.path], f.path).toBeTruthy();
    for (const [L, spec] of Object.entries(SPEND_LISTS)) for (const f of spec.fields) { expect(SPEND[L].fields[f.path].label, `${L}.${f.path}`).toBeTypeOf('string'); if (f.type === 'choice' && f.path !== 'then') for (const o of f.options) expect(SPEND[L].fields[f.path].options[o]).toBeTypeOf('string'); }
    for (const p of ['first.amount', 'first.then', 'first.fallsPct', 'steps.ids', 'steps.0.fromAge', 'steps.n12.then', 'steps.3.fallsPct', 'costs.ids', 'costs.n1.prices', 'costs.0.years']) expect(isSpendPath(p), p).toBe(true);
    for (const p of ['first', 'first.age', 'steps', 'steps.ids.x', 'steps.0.label', 'costs.a.amount', 'lumps.0.amount', 'steps.0.amount.x', 'costs.n1234.amount']) expect(isSpendPath(p), p).toBe(false);
    expect(isPlanEditPath('first.amount')).toBe(true);
    expect(isPlanEditPath('costs.0.atAge')).toBe(true);
    expect(isPlanEditPath('age')).toBe(true);
    for (const p of SPEND_WRITES) expect(p).toMatch(/^(stressTool|decisionTool)\.settings\.[a-zA-Z]+$/);
    expect(SPEND_WRITES).toContain('stressTool.settings.targetSchedule');
    expect(SPEND_WRITES).toContain('decisionTool.settings.targetSchedule');
    expect(ALL_WRITES).toEqual([...new Set([...ABOUT_WRITES, ...INCOME_WRITES, ...SPEND_WRITES, ...POTS_WRITES, ...LASTS_WRITES, ...LOCK_WRITES, ...UNLOCK_WRITES, ...DOCUMENT_WRITES, ...WAY_WRITES, ...MIX_WRITES, ...HOUSEHOLD_WRITES, 'holdings', 'transition', 'budgetTool.settings', 'accumulationTool.settings', 'accumulationTool.history', ...PLANS_WRITES, 'lastModified'])]);   // the record and the tick-offs, each one field (road-to-7.md step 10); the budget and the saver's settings and record list, each one field (step 11b); the plan menu's name and main flag (step 11)
  });
  it('a plan not in the list, and the partner link both ways', () => {
    expect(spendOf(entriesAt(TODAY), 'NoSuchPlan', { today: TODAY }).found).toBe(false);
    const { ladder, saver } = household();
    const entries = [entryOf(ladder), entryOf(saver)];
    expect(spendOf(entries, saver.id, { today: TODAY }).partners).toEqual([{ id: 'HouseLadder01', name: 'Ladder plan' }]);
    expect(spendOf(entries, ladder.id, { today: TODAY }).partners).toEqual([{ id: 'HouseSaver02', name: 'Saving plan' }]);
    // a Floor & Flex plan says its essentials are set with the way of drawing
    const ff = JSON.parse(JSON.stringify(entryOf(LUMPY).plan));
    ff.stressTool.settings.strategyId = 'floor-and-flex';
    const v = spendOf([{ plan: ff }], ff.id, { today: TODAY });
    expect(v.floorAndFlex).toBe(true);
    expect(v.derived[v.derived.length - 1].id).toBe('ff.note');
  });
});
