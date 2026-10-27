/**
 * I1 (research/v7/editing-in-v7.md 7.5): the pure reader and writer of "Money that comes in anyway".
 *  - incomeOf on the 12 corpus plans × 3 dates; a plan as saved writes nothing; the saved facts of 12 (the lumpy plan);
 *  - read∘write∘read is identity over random plans, random cards in any order and random typed boxes (fast-check); a patch
 *    names only INCOME_WRITES paths; every other byte of the plan is unchanged; Undo puts it back exactly; rows the step
 *    does not show are kept byte for byte;
 *  - the age↔year rule against the planner's own functions (dbStartSetting.js; PlanDocument.shapeLayersFromSettings) and the
 *    written State Pension read back by the planner's own spSimConfigFromSettings at the typed age;
 *  - the State Pension choices: full, forecast, none, and "assumed" only while the plan has no figure; the date kept, or made;
 *  - the problems, in their ids; the 2028 rule; the sub-step and the plan page's section and link.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { incomeOf, incomePatch, applyPatch, boxesOf, savedIncome, checkIncome, derivedLines, note2028, derivedSpDate, yearOfAge, ageOfYear, FS_LABEL, pounds, poundsPence } from '../../../src/answers/plan/income.js';
import { answerAge, safeSettings, safeTiming } from '../../../src/answers/plan/about.js';
import { INCOME_FIELDS, INCOME_LISTS, INCOME_WRITES, SPEND_WRITES, POTS_WRITES, LASTS_WRITES, LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES, WAY_WRITES, MIX_WRITES, ALL_WRITES, ABOUT_WRITES, isIncomePath, isPlanEditPath, RISES, WRAPPERS, HOUSEHOLD_WRITES, PLANS_WRITES } from '../../../src/answers/plan/schema.js';
import { SUB_STEPS, ALL_SUB_STEPS } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { parse, format, screenName, PLAN_SUB_STEPS } from '../../../src/v7/router/routes.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { deriveTiming } from '../../../src/services/PlanTiming.js';
import { dbStartYearOfAge, dbStartAgeOf } from '../../../src/ui/dbStartSetting.js';
import { shapeLayersFromSettings } from '../../../src/services/PlanDocument.js';
import { spSimConfigFromSettings, parseStatePensionDate } from '../../../src/utils/StatePensionUtils.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { RULES } from '../../../src/answers/shared/rules.js';
import { INCOME } from '../../../src/v7/copy/income.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, household, DATES, TODAY, noon } from './_plans.js';

const C = corpus();
const text = (v) => JSON.stringify(v);
const strip = (plan) => { const out = JSON.parse(JSON.stringify(plan)); for (const p of ALL_WRITES) { const parts = p.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return out; };
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const EDITABLE = Object.values(C).filter((p) => !isLocked(p));
const LUMPY = C['12-lumpy-db-gia'];

describe('I1 — the reading, on every corpus plan at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: found, every field and card has words, every derived line has words, a plan as saved writes nothing`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const a = incomeOf(entries, e.plan.id, { today });
        expect(a.found).toBe(true);
        expect(a.fields.map((f) => f.path)).toEqual(INCOME_FIELDS.map((f) => f.path));
        for (const f of a.fields) expect(INCOME.fields[f.path], f.path).toBeTruthy();
        for (const L of Object.keys(INCOME_LISTS)) for (const card of a.lists[L].cards) for (const f of card.fields) expect(INCOME.lists[L].fields[f.path.split('.').pop()], f.path).toBeTruthy();
        for (const d of a.derived) { expect(INCOME.derived[d.id], d.id).toBeTypeOf('string'); for (const v of Object.values(d.slots)) expect(v, d.id).not.toBeUndefined(); }
        expect(a.errors, e.plan.id).toEqual({});
        expect(a.patch, e.plan.id).toEqual({});
        expect(a.locked).toBe(isLocked(e.plan));
        expect(a.editable).toBe(!a.locked);
        expect(a.savedLine).toMatchObject({ id: 'income' });
        expect(typeof a.ageNow).toBe('number');
        expect(a.endAge).toBeGreaterThan(a.ageNow);
      }
    });
  }
  it('the lumpy plan (12): the forecast, one final-salary pension at 65, other income, two incomes for some years, two lump sums — every plan year an age', () => {
    const s = savedIncome(entryOf(LUMPY).plan, { today: TODAY });
    expect(s.ageNow).toBe(60);
    expect(s.sp).toMatchObject({ kind: 'forecast', weekly: 224.9, yearly: 11694.8, date: '25 July 2034', fromAge: 67, taxYear: 2034, beforeStart: false, dated: true });
    expect(s.fs).toEqual([{ id: '0', amount: 9400, fromAge: 65, rises: 'lpi5', from: 'db', row: null }]);
    expect(s.other).toBe(1200);
    expect(s.streams.map((x) => [x.label, x.amount, x.fromAge, x.toAge, x.rises])).toEqual([['Rental flat', 7200, 60, 74, 'cpi'], ['Part-time consulting', 12000, 60, 63, 'level']]);
    expect(s.lumps.map((x) => [x.label, x.amount, x.atAge, x.wrapper])).toEqual([['Inherited pension', 120000, 64, 'pension'], ['Downsizing', 90000, 69, 'cash']]);
    expect(boxesOf(entryOf(LUMPY).plan, { today: TODAY })).toMatchObject({ spKind: 'forecast', spWeekly: '224.9', other: '1200', 'fs.ids': '0', 'fs.0.amount': '9400', 'fs.0.fromAge': '65', 'fs.0.rises': 'lpi5', 'streams.ids': '0,1', 'streams.1.toAge': '63', 'lumps.ids': '0,1', 'lumps.1.atAge': '69', 'lumps.0.wrapper': 'pension' });
    const v = incomeOf(entriesAt(TODAY), LUMPY.id, { today: TODAY });
    expect(v.derived).toEqual([
      { id: 'sp.paid', slots: { yearly: '£11,695', age: 67, year: '2034/35' } },
      { id: 'fs.line', slots: { n: 1, amount: '£9,400', age: 65, year: '2032/33', rises: 'lpi5' } },
      { id: 'other.line', slots: { amount: '£1,200' } },
      { id: 'stream.line', slots: { label: 'Rental flat', amount: '£7,200', from: 60, to: 74, years: '15 years', rises: 'cpi' } },
      { id: 'stream.line', slots: { label: 'Part-time consulting', amount: '£12,000', from: 60, to: 63, years: '4 years', rises: 'level' } },
      { id: 'lump.line', slots: { label: 'Inherited pension', amount: '£120,000', age: 64, year: '2031/32', what: 'pension' } },
      { id: 'lump.line', slots: { label: 'Downsizing', amount: '£90,000', age: 69, year: '2036/37', what: 'cash' } }
    ]);
    expect(v.savedLine).toEqual({ id: 'income', slots: { sp: 'paid', yearly: '£11,695', age: 67, fs: 1, streams: 2, lumps: 2 } });
    expect(v.fullYearly).toBe(pounds(RULES.fullStatePensionWeekly * 52));
    expect(poundsPence(230.25)).toBe('£230.25');
    expect(poundsPence(241.3)).toBe('£241.30');
  });
  it('the State Pension as saved: a forecast (10, 02), the planner\'s assumed figure with no date (01: £12,000 from 67; 11: from 68 by its own year), a locked plan from its document (03)', () => {
    expect(savedIncome(entryOf(C['10-couple-b']).plan, { today: TODAY }).sp).toMatchObject({ kind: 'forecast', weekly: 230.25, fromAge: 67, taxYear: 2034 });
    expect(savedIncome(entryOf(C['01-fresh-default']).plan, { today: TODAY }).sp).toMatchObject({ kind: 'assumed', yearly: 12000, fromAge: 67 });
    expect(savedIncome(entryOf(C['11-guest-demo']).plan, { today: TODAY }).sp).toMatchObject({ kind: 'assumed', yearly: 11973, fromAge: 68 });
    const l = savedIncome(entryOf(C['03-gilt-ladder-runup']).plan, { today: TODAY });
    expect(l.locked).toBe(true);
    expect(l.sp).toMatchObject({ kind: 'forecast', weekly: 230.25, date: '9 November 2036', fromAge: 67 });
    expect(l.source.kind).toBe('locked');
    // the planner's own words for the assumed figure: from the plan year IncomeSchedule.defaultSpYear gives
    const a = incomeOf(entriesAt(TODAY), C['01-fresh-default'].id, { today: TODAY });
    expect(a.assumed).toEqual({ yearly: '£12,000', age: 67 });
    expect(a.fields.find((f) => f.path === 'spKind').options).toEqual(['full', 'forecast', 'none', 'assumed']);
    expect(incomeOf(entriesAt(TODAY), LUMPY.id, { today: TODAY }).fields.find((f) => f.path === 'spKind').options).toEqual(['full', 'forecast', 'none']);
    expect(derivedLines({ sp: a.assumed ? savedIncome(entryOf(C['01-fresh-default']).plan, { today: TODAY }).sp : null, fs: [], other: 0, streams: [], lumps: [], ageNow: 57, timing: { firstTaxYear: 2027 }, note2028: false })[0].id).toBe('sp.assumed');
  });
});

describe('I1 — the write: the exact paths and values, as the planner\'s Save writes them', () => {
  const plan = entryOf(LUMPY).plan;
  it('"none": the weekly amount 0 and the old yearly figure 0 (else every run assumes £12,000); the date kept', () => {
    const p = incomePatch(plan, { spKind: 'none' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch).toEqual({ 'stressTool.settings.spWeeklyAmount': 0, 'stressTool.settings.statePension': 0 });
    expect(p.previous).toEqual({ 'stressTool.settings.spWeeklyAmount': 224.9, 'stressTool.settings.statePension': 12000 });
    const after = applyPatch(plan, p.patch);
    expect(after.stressTool.settings.spStartDate).toBe('25 July 2034');
    // the planner's engine then counts no State Pension at all
    const cfg = createSimulationConfigFromSettings({}, effectiveStressSettings(after, { now: noon(TODAY) }));
    expect(cfg.spStartYear).toBeUndefined();
    expect(cfg.statePension).toBe(0);
    expect(savedIncome(after, { today: TODAY }).sp.kind).toBe('none');
  });
  it('"the full amount": V7\'s own figure a week, the old yearly figure in step; a new forecast amount; the same choice writes nothing', () => {
    const full = incomePatch(plan, { spKind: 'full' }, { today: TODAY });
    expect(full.patch).toEqual({ 'stressTool.settings.spWeeklyAmount': RULES.fullStatePensionWeekly, 'stressTool.settings.statePension': Math.round(RULES.fullStatePensionWeekly * 52 * 100) / 100 });
    expect(savedIncome(applyPatch(plan, full.patch), { today: TODAY }).sp.kind).toBe('full');
    const fc1 = incomePatch(plan, { spWeekly: '£230.25' }, { today: TODAY });
    expect(fc1.patch).toEqual({ 'stressTool.settings.spWeeklyAmount': 230.25, 'stressTool.settings.statePension': 11973 });
    expect(incomePatch(plan, { spKind: 'forecast', spWeekly: '224.9' }, { today: TODAY }).patch).toEqual({});
  });
  it('a plan with no date that gains a State Pension gets the day its State Pension age is reached, counted from the day its age was recorded (the birthday the plan already uses)', () => {
    const fresh = entryOf(C['11-guest-demo']).plan;   // 57, no date, assumed
    const ss = effectiveStressSettings(fresh, { now: noon(TODAY) });
    const p = incomePatch(fresh, { spKind: 'forecast', spWeekly: '200' }, { today: TODAY });
    expect(p.patch['stressTool.settings.spWeeklyAmount']).toBe(200);
    expect(p.patch['stressTool.settings.statePension']).toBe(10400);
    const date = p.patch['stressTool.settings.spStartDate'];
    expect(date).toBe(derivedSpDate(ss, TODAY));
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // the day of the year is the recorded age's day, so no age moves; the year is the State Pension age's
    const asOf = String(ss.currentAgeAsOf).slice(0, 10);
    expect(date.slice(5)).toBe(asOf.slice(5));
    const after = applyPatch(fresh, p.patch);
    const t0 = deriveTiming(ss, noon(TODAY)), t1 = deriveTiming(effectiveStressSettings(after, { now: noon(TODAY) }), noon(TODAY));
    expect([t1.firstTaxYear, t1.shapeAgeNow, t1.currentAge]).toEqual([t0.firstTaxYear, t0.shapeAgeNow, t0.currentAge]);
    // and the planner's own rule reads it back: the State Pension lands in the tax year the date falls in
    const read = savedIncome(after, { today: TODAY });
    expect(read.sp.kind).toBe('forecast');
    expect(read.sp.fromAge).toBe(t1.shapeAgeNow + spSimConfigFromSettings({ ...effectiveStressSettings(after, { now: noon(TODAY) }), firstTaxYear: t1.firstTaxYear, shapeAgeNow: t1.shapeAgeNow }, noon(TODAY)).spStartYear);
    // the years between the recorded day and the date are the years to the State Pension age (67 for someone born in 1970)
    expect(parseStatePensionDate(date).getFullYear() - parseStatePensionDate(asOf).getFullYear()).toBe(67 - Math.floor(ss.currentAge));
    expect(read.sp.fromAge).toBe(67);
    // "assumed" is no longer offered once a choice is made
    expect(incomeOf([{ plan: after }], after.id, { today: TODAY }).fields.find((f) => f.path === 'spKind').options).toEqual(['full', 'forecast', 'none']);
    // "none" on an assumed plan: the old yearly figure to 0, nothing else
    expect(incomePatch(fresh, { spKind: 'none' }, { today: TODAY }).patch).toEqual({ 'stressTool.settings.statePension': 0 });
    // "assumed" itself writes nothing
    expect(incomePatch(fresh, { spKind: 'assumed' }, { today: TODAY }).patch).toEqual({});
  });
  it('the final-salary pension: the first card is the planner\'s own keys (the year from the age, the age beside it); a changed age; none', () => {
    const p = incomePatch(plan, { 'fs.0.fromAge': '67' }, { today: TODAY });
    // the year the engines read and the age asked, written beside it (the plan had none); the unchanged amount and rises are not sent
    expect(p.patch).toEqual({ 'stressTool.settings.dbStartYear': 7, 'stressTool.settings.dbStartAge': 67 });
    expect(p.previous).toEqual({ 'stressTool.settings.dbStartYear': 5, 'stressTool.settings.dbStartAge': undefined });
    expect(incomePatch(plan, { 'fs.0.fromAge': '67', 'fs.0.amount': '9,500', 'fs.0.rises': 'cpi' }, { today: TODAY }).patch).toEqual({ 'stressTool.settings.dbAmount': 9500, 'stressTool.settings.dbStartYear': 7, 'stressTool.settings.dbStartAge': 67, 'stressTool.settings.dbIndexation': 'cpi' });
    expect(dbStartYearOfAge(67, 60)).toBe(7);
    const after = applyPatch(plan, p.patch);
    expect(dbStartAgeOf(after.stressTool.settings, 60)).toBe(67);
    expect(savedIncome(after, { today: TODAY }).fs[0]).toMatchObject({ amount: 9400, fromAge: 67, rises: 'lpi5' });
    const none = incomePatch(plan, { 'fs.ids': '' }, { today: TODAY });
    expect(none.patch).toEqual({ 'stressTool.settings.dbAmount': 0 });
    expect(savedIncome(applyPatch(plan, none.patch), { today: TODAY }).fs).toEqual([]);
    // a start before the plan's first year is allowed and said; one after its end is refused as the planner refuses it
    expect(checkIncome(plan, { 'fs.0.fromAge': '58' }, { today: TODAY }).errors).toEqual({});
    expect(incomeOf([{ plan }], plan.id, { today: TODAY, typed: { 'fs.0.fromAge': '58' } }).derived[1]).toEqual({ id: 'fs.before', slots: { n: 1, amount: '£9,400', age: 58, ageNow: 60, rises: 'lpi5' } });
    expect(checkIncome(plan, { 'fs.0.fromAge': '92' }, { today: TODAY }).errors).toEqual({ 'fs.0.fromAge': 'afterEnd' });
  });
  it('a second final-salary pension goes into the planner\'s own list as income for the rest of the plan, labelled; removing the first makes the second the planner\'s own keys', () => {
    const p = incomePatch(plan, { 'fs.ids': '0,n1', 'fs.n1.amount': '3,000', 'fs.n1.fromAge': '66', 'fs.n1.rises': 'cpi' }, { today: TODAY });
    expect(Object.keys(p.patch)).toEqual(['stressTool.settings.extraIncomes']);
    const rows = p.patch['stressTool.settings.extraIncomes'];
    expect(rows.slice(0, 2)).toEqual(plan.stressTool.settings.extraIncomes);   // the planner's rows, byte for byte
    expect(rows[2]).toEqual({ label: FS_LABEL, annual: 3000, startYear: 6, endYear: null, indexation: 'cpi' });
    const after = applyPatch(plan, p.patch);
    const read = savedIncome(after, { today: TODAY });
    expect(read.fs.map((x) => [x.amount, x.fromAge, x.rises, x.from])).toEqual([[9400, 65, 'lpi5', 'db'], [3000, 66, 'cpi', 'row']]);
    expect(read.streams.length).toBe(2);
    // the planner reads it as taxable income for life, as it reads the first (PlanDocument.shapeLayersFromSettings)
    const layers = shapeLayersFromSettings(effectiveStressSettings(after, { now: noon(TODAY) }), undefined, { now: noon(TODAY) });
    expect(layers.other.find((o) => o.label === FS_LABEL)).toMatchObject({ annual: 3000, fromAge: 66, toAge: 999 });
    // the first removed: the second becomes the planner's own keys and its row goes
    const q = incomePatch(after, { 'fs.ids': '1' }, { today: TODAY });
    expect(q.patch).toEqual({ 'stressTool.settings.dbAmount': 3000, 'stressTool.settings.dbStartYear': 6, 'stressTool.settings.dbStartAge': 66, 'stressTool.settings.dbIndexation': 'cpi', 'stressTool.settings.extraIncomes': plan.stressTool.settings.extraIncomes });
    expect(savedIncome(applyPatch(after, q.patch), { today: TODAY }).fs.map((x) => [x.amount, x.fromAge, x.from])).toEqual([[3000, 66, 'db']]);
  });
  it('income for some years and lump sums: an edited card is merged onto its row (other keys kept), a removed card\'s row goes, a new card is appended; the planner reads the ages back as its years', () => {
    const withMix = JSON.parse(JSON.stringify(plan));
    withMix.stressTool.settings.windfalls[1].mix = 'gilt';
    withMix.stressTool.settings.windfalls[1].toIsa = false;
    const p = incomePatch(withMix, { 'lumps.1.atAge': '70', 'streams.ids': '1,n1', 'streams.n1.label': 'Rent', 'streams.n1.amount': '5000', 'streams.n1.fromAge': '70', 'streams.n1.rises': 'level', other: '' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch['stressTool.settings.windfalls']).toEqual([{ amount: 120000, label: 'Inherited pension', wrapper: 'pension', year: 4 }, { amount: 90000, label: 'Downsizing', wrapper: 'cash', year: 10, mix: 'gilt', toIsa: false }]);
    expect(p.patch['stressTool.settings.extraIncomes']).toEqual([plan.stressTool.settings.extraIncomes[1], { label: 'Rent', annual: 5000, startYear: 10, endYear: null, indexation: 'level' }]);
    expect(p.patch['stressTool.settings.other']).toBe(0);
    const after = applyPatch(withMix, p.patch);
    const layers = shapeLayersFromSettings(effectiveStressSettings(after, { now: noon(TODAY) }), undefined, { now: noon(TODAY) });
    expect(layers.events.filter((e) => e.kind === 'in').map((e) => [e.label, e.age])).toEqual([['Inherited pension', 64], ['Downsizing', 70]]);
    expect(layers.other.map((o) => [o.label, o.fromAge, o.toAge])).toEqual([['DB pension', 65, 999], ['Part-time consulting', 60, 63], ['Rent', 70, 999]]);
    const read = savedIncome(after, { today: TODAY });
    expect(read.streams.map((x) => [x.label, x.fromAge, x.toAge])).toEqual([['Part-time consulting', 60, 63], ['Rent', 70, null]]);
    expect(read.lumps.map((x) => [x.label, x.atAge])).toEqual([['Inherited pension', 64], ['Downsizing', 70]]);
    expect(incomeOf([{ plan: after }], after.id, { today: TODAY }).derived.find((d) => d.id === 'stream.life').slots).toEqual({ label: 'Rent', amount: '£5,000', from: 70, rises: 'level' });
  });
  it('rows the step does not show (nothing in them) are kept byte for byte through a write', () => {
    const odd = JSON.parse(JSON.stringify(plan));
    odd.stressTool.settings.extraIncomes.push({ label: 'Empty', annual: 0 });
    odd.stressTool.settings.windfalls.push({ label: 'No year', amount: 50000 });
    const p = incomePatch(odd, { 'lumps.ids': '0', 'streams.ids': '0' }, { today: TODAY });
    expect(p.patch['stressTool.settings.extraIncomes']).toEqual([odd.stressTool.settings.extraIncomes[0], { label: 'Empty', annual: 0 }]);
    expect(p.patch['stressTool.settings.windfalls']).toEqual([odd.stressTool.settings.windfalls[0], { label: 'No year', amount: 50000 }]);
  });
  it('a locked plan: no patch, whatever is typed', () => {
    const locked = entryOf(C['03-gilt-ladder-runup']).plan;
    const p = incomePatch(locked, { spKind: 'none' }, { today: TODAY });
    expect(p).toEqual({ ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} });
  });
  it('the problems, in their ids', () => {
    const errs = (typed) => checkIncome(plan, typed, { today: TODAY }).errors;
    expect(errs({ spKind: '' })).toEqual({ spKind: 'required' });
    expect(errs({ spKind: 'assumed' })).toEqual({ spKind: 'notAnOption' });   // not offered: the plan has a figure
    expect(errs({ spKind: 'forecast', spWeekly: '' })).toEqual({ spWeekly: 'required' });
    expect(errs({ spWeekly: 'abc' })).toEqual({ spWeekly: 'notANumber' });
    expect(errs({ spWeekly: '0.5' })).toEqual({ spWeekly: 'tooLow' });
    expect(errs({ spWeekly: '1001' })).toEqual({ spWeekly: 'tooHigh' });
    expect(errs({ spKind: 'full', spWeekly: 'abc' })).toEqual({});   // the box does not apply
    expect(errs({ other: '1,200,001' })).toEqual({ other: 'tooHigh' });
    expect(errs({ other: '12k' })).toEqual({ other: 'notANumber' });
    expect(errs({ 'fs.0.amount': '' })).toEqual({ 'fs.0.amount': 'required' });
    expect(errs({ 'fs.0.fromAge': '39' })).toEqual({ 'fs.0.fromAge': 'tooLow' });
    expect(errs({ 'fs.0.rises': 'x' })).toEqual({ 'fs.0.rises': 'notAnOption' });
    expect(errs({ 'streams.0.toAge': '59' })).toEqual({ 'streams.0.toAge': 'beforeFrom' });
    expect(errs({ 'streams.0.fromAge': '92' })).toEqual({ 'streams.0.fromAge': 'afterEnd' });
    expect(errs({ 'streams.0.label': 'x'.repeat(61) })).toEqual({ 'streams.0.label': 'tooLong' });
    expect(errs({ 'lumps.1.atAge': '59' })).toEqual({ 'lumps.1.atAge': 'beforeStart' });
    expect(errs({ 'lumps.1.atAge': '92' })).toEqual({ 'lumps.1.atAge': 'afterEnd' });
    expect(errs({ 'lumps.1.wrapper': 'gold' })).toEqual({ 'lumps.1.wrapper': 'notAnOption' });
    expect(errs({ 'lumps.ids': '0,1,n1', 'lumps.n1.amount': '', 'lumps.n1.atAge': '' })).toEqual({ 'lumps.n1.amount': 'required', 'lumps.n1.atAge': 'required' });
    // an id that is not a card id is ignored; a card id twice is one card
    expect(checkIncome(plan, { 'lumps.ids': '0,0,zz' }, { today: TODAY }).lists.lumps.ids).toEqual(['0']);
    // every error has words
    for (const [k, e] of Object.entries(errs({ spKind: '', 'fs.0.amount': '', 'streams.0.toAge': '59', 'lumps.1.atAge': '59' }))) {
      const parts = k.split('.');
      const words = parts.length === 1 ? INCOME.errors[k] : INCOME.lists[parts[0]].errors[parts[2]];
      expect(words[e], k).toBeTypeOf('string');
    }
    // a problem in a card leaves the patch empty
    expect(incomePatch(plan, { 'lumps.1.atAge': '59' }, { today: TODAY }).patch).toEqual({});
  });
});

describe('I1 — the one rule for ages, against the planner\'s own functions', () => {
  it('plan year = age − start age, both ways, as dbStartSetting.js and PlanDocument.js have it', () => {
    fc.assert(fc.property(fc.integer({ min: 40, max: 110 }), fc.integer({ min: 50, max: 75 }), (age, ageNow) => {
      expect(yearOfAge(age, ageNow)).toBe(dbStartYearOfAge(age, ageNow));
      expect(ageOfYear(yearOfAge(age, ageNow), ageNow)).toBe(age);
      expect(dbStartAgeOf({ dbStartYear: yearOfAge(age, ageNow) }, ageNow)).toBe(age);
    }));
  });
  it('the 2028 note: a pension pot, a stop before 6 April 2028, and 55 or 56 on that day — on the plan\'s own dated age', () => {
    const base = { currentAge: 55, currentAgeAsOf: '2026-10-01', retired: true, firstTaxYear: 2026, equityMin: 100000, bondMin: 0, cashTarget: 0 };
    const t = (ss, today = TODAY) => note2028(ss, safeTiming(ss, noon(today)), noon(today));
    expect(t(base)).toBe(true);                                          // 56 on 6 April 2028, drawing now
    expect(t({ ...base, currentAge: 54 })).toBe(true);                   // 55 on 6 April 2028: a pot opened before then
    expect(t({ ...base, currentAge: 53 })).toBe(false);                  // 54 on that day: cannot open one before it
    expect(t({ ...base, currentAge: 57 })).toBe(false);                  // 58: the rise does not touch them
    expect(t({ ...base, equityMin: 0 })).toBe(false);                    // no pension pot
    expect(t({ ...base, currentAge: 54, retired: false, retireAge: 60 })).toBe(false);   // stops after 6 April 2028
    expect(t({ ...base, currentAge: 55, retired: false, retireAge: 56 })).toBe(true);    // stops in 2027, 56 on the day
    expect(t(base, '2028-04-06')).toBe(false);                            // the day has come
    expect(t({ ...base, currentAge: null })).toBe(false);                 // no age: nothing to judge
    // 10's birthday is its State Pension date (17 January): 54 in September 2026 is 56 on 6 April 2028, stopping at 55 in January 2027
    const applies = JSON.parse(JSON.stringify(C['10-couple-b']));
    applies.stressTool.settings = { ...applies.stressTool.settings, currentAge: 54, retireAge: 55, currentAgeAsOf: '2026-09-01' };
    applies.budgetTool.settings = { ...applies.budgetTool.settings, currentAge: 54, currentAgeAsOf: '2026-09-01', retirementAge: 55 };   // the budget's newer age would win otherwise
    const v = incomeOf([{ plan: applies }], applies.id, { today: TODAY });
    expect(v.derived[v.derived.length - 1]).toEqual({ id: 'drawdown2028', slots: { from: 57, day: '5 April 2028' } });
    expect(INCOME.derived.drawdown2028).toContain('Move into drawdown what you will need before {from} by {day}');
    expect(incomeOf(entriesAt(TODAY), C['10-couple-b'].id, { today: TODAY }).derived.some((d) => d.id === 'drawdown2028')).toBe(false);
  });
});

/** Random cards and boxes that pass the checks for a plan, as a person would type them, in any order. */
function validTyped(plan) {
  const s = savedIncome(plan, { today: TODAY });
  const lo = s.ageNow, hi = s.endAge;
  const money = (max) => fc.integer({ min: 1, max }).map(String);
  const label = fc.stringMatching(/^[A-Za-z][A-Za-z ]{0,20}$/).filter((x) => !/final/i.test(x));
  const card = (L, saved) => (saved
    ? fc.record({ keep: fc.boolean(), amount: money(500000), fromAge: fc.integer({ min: 40, max: hi }), rises: fc.constantFrom(...RISES), atAge: fc.integer({ min: lo, max: hi }), toAge: fc.option(fc.integer({ min: 18, max: 110 }), { nil: null }), wrapper: fc.constantFrom(...WRAPPERS), label })
    : fc.record({ keep: fc.constant(true), amount: money(500000), fromAge: fc.integer({ min: 40, max: hi }), rises: fc.constantFrom(...RISES), atAge: fc.integer({ min: lo, max: hi }), toAge: fc.option(fc.integer({ min: 18, max: 110 }), { nil: null }), wrapper: fc.constantFrom(...WRAPPERS), label }));
  const list = (L) => fc.tuple(fc.tuple(...s[L].map(() => card(L, true))), fc.array(card(L, false), { maxLength: 2 }), fc.boolean()).map(([keptCards, newCards, shuffle]) => {
    const typed = {};
    const ids = [];
    s[L].forEach((c, i) => { const k = keptCards[i]; if (!k.keep) return; ids.push(c.id); if (shuffle) for (const f of INCOME_LISTS[L].fields) typed[`${L}.${c.id}.${f.path}`] = fieldText(L, f.path, k, c); });
    newCards.forEach((k, i) => { const id = 'n' + (i + 1); ids.push(id); for (const f of INCOME_LISTS[L].fields) typed[`${L}.${id}.${f.path}`] = fieldText(L, f.path, k, null); });
    if (shuffle) ids.reverse();
    typed[`${L}.ids`] = ids.join(',');
    return typed;
  });
  return fc.record({
    spKind: fc.constantFrom('full', 'forecast', 'none', ...(s.sp.kind === 'assumed' ? ['assumed'] : [])),
    spWeekly: fc.integer({ min: 100, max: 30000 }).map((p) => String(p / 100)),
    other: fc.constantFrom('', '0', '1200', '5,000'),
    fs: list('fs'), streams: list('streams'), lumps: list('lumps')
  }).map((r) => ({ spKind: r.spKind, spWeekly: r.spWeekly, other: r.other, ...r.fs, ...r.streams, ...r.lumps }));
}
function fieldText(L, f, k, savedCard) {
  if (f === 'toAge') return k.toAge == null ? '' : String(Math.max(k.toAge, k.fromAge));
  if (f === 'label') return savedCard ? savedCard.label : k.label;
  return String(k[f]);
}

describe('I1 — properties: read∘write∘read is identity; only declared keys change; Undo puts the plan back exactly', () => {
  it('for random editable plans, random cards in any order and random boxes', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped(plan).map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const c = checkIncome(plan, typed, { today: TODAY });
      expect(c.errors).toEqual({});
      const p = incomePatch(plan, typed, { today: TODAY });
      expect(p.ok).toBe(true);
      for (const k of Object.keys(p.patch)) { expect(INCOME_WRITES).toContain(k); expect(ABOUT_WRITES).not.toContain(k); }
      expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
      const after = applyPatch(plan, p.patch);
      // every byte outside the declared paths is the same
      expect(text(strip(after))).toBe(text(strip(plan)));
      // read again: the cards hold what was typed, in the order typed (ids renumbered by position)
      const read = savedIncome(after, { today: TODAY });
      for (const L of ['fs', 'streams', 'lumps']) {
        const ids = typed[`${L}.ids`] ? typed[`${L}.ids`].split(',').filter(Boolean) : [];
        expect(read[L].length, L).toBe(ids.length);
        ids.forEach((id, i) => {
          for (const f of INCOME_LISTS[L].fields) {
            const want = typed[`${L}.${id}.${f.path}`] !== undefined ? typed[`${L}.${id}.${f.path}`] : (c.lists[L].cards.find((x) => x.id === id).fields.find((x) => x.path === `${L}.${id}.${f.path}`).shown);
            const got = read[L][i][f.path];
            if (f.path === 'toAge' && want === '') expect(got).toBe(null);
            else if (f.type === 'text') expect(got).toBe(want.trim());
            else if (f.type === 'choice') expect(got).toBe(want);
            else expect(String(got), `${L}.${id}.${f.path}`).toBe(String(+String(want).replace(/[£,\s]/g, '')));
          }
        });
      }
      if (typed.spKind === 'none') expect(read.sp.kind).toBe('none');
      else if (typed.spKind === 'full') expect(read.sp.kind).toBe('full');
      else if (typed.spKind === 'forecast') { expect(['forecast', 'full']).toContain(read.sp.kind); expect(read.sp.weekly).toBe(+typed.spWeekly); }
      expect(read.other).toBe(typed.other === '' ? 0 : +typed.other.replace(/,/g, ''));
      // writing the read boxes again changes nothing
      expect(incomePatch(after, {}, { today: TODAY }).patch).toEqual({});
      expect(incomePatch(after, boxesOf(after, { today: TODAY }), { today: TODAY }).patch).toEqual({});
      // Undo: the previous values back, byte for byte
      expect(text(applyPatch(after, p.previous))).toBe(text(plan));
    }), { numRuns: 120 });
  });
  it('the plan written is read by the planner\'s own reading (effectiveStressSettings) with the cards at the typed ages', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped(plan).map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const after = applyPatch(plan, incomePatch(plan, typed, { today: TODAY }).patch);
      const ss = effectiveStressSettings(after, { now: noon(TODAY) });
      const t = deriveTiming(ss, noon(TODAY));
      const read = savedIncome(after, { today: TODAY });
      // the planner's layers (PlanDocument.shapeLayersFromSettings) put each row at the age the step shows
      const layers = shapeLayersFromSettings(ss, t, { now: noon(TODAY) });
      for (const st of read.streams) expect(layers.other.some((o) => o.annual === st.amount && o.fromAge === st.fromAge && (st.toAge == null ? o.toAge === 999 : o.toAge === st.toAge)), 'stream').toBe(true);
      for (const lp of read.lumps) expect(layers.events.some((e) => e.kind === 'in' && e.amount === lp.amount && e.age === lp.atAge), 'lump').toBe(true);
      if (read.fs[0]) expect(layers.other.some((o) => o.label === 'DB pension' && o.annual === read.fs[0].amount && o.fromAge === read.fs[0].fromAge)).toBe(true);
      for (const extra of read.fs.slice(1)) expect(layers.other.some((o) => o.label === FS_LABEL && o.annual === extra.amount && o.fromAge === extra.fromAge && o.toAge === 999)).toBe(true);
      // the State Pension, as the planner's own config reads it
      if (read.sp.kind === 'none') { expect(+ss.spWeeklyAmount || 0).toBe(0); expect(+ss.statePension || 0).toBe(0); }
      else if (read.sp.dated) { const cfg = spSimConfigFromSettings({ ...ss, firstTaxYear: t.firstTaxYear, shapeAgeNow: t.shapeAgeNow }, noon(TODAY)); expect(cfg).not.toBe(null); expect(t.shapeAgeNow + cfg.spStartYear).toBe(read.sp.fromAge); }
    }), { numRuns: 60 });
  });
});

describe('I1 — the stale-answer rule gains the State Pension and the final-salary pension when the record has them', () => {
  const base = entryOf(C['10-couple-b']).plan;
  const ss = base.stressTool.settings;
  const withAnswer = (extra = {}) => ({ ...JSON.parse(JSON.stringify(base)), lastModified: '2026-09-20T10:00:00.000Z', fromAnswer: { savedOn: '2026-09-20T10:00:00.000Z', answer: { lasted: 9 }, who: 'you', people: [{ who: 'you', ageToday: ss.currentAge, ageAtStop: ss.retireAge, years: ss.duration, stop: { kind: 'later', yearsFromNow: 4 }, ...extra }] } });
  it('a record without them is judged on the timing facts alone; with them, a changed State Pension or final-salary pension makes the answer older than its inputs', () => {
    const now = (p) => effectiveStressSettings(p, { now: noon(TODAY) });
    expect(answerAge(withAnswer(), now(withAnswer()))).toBe(null);
    const matching = withAnswer({ statePension: { yearly: 11973, fromAge: 67, fromDate: '2035-01-17' }, finalSalary: null });
    expect(answerAge(matching, now(matching))).toBe(null);
    const spChanged = applyPatch({ ...matching, lastModified: '2026-10-02T09:00:00.000Z' }, incomePatch(matching, { spKind: 'none' }, { today: TODAY }).patch);
    expect(answerAge(spChanged, now(spChanged))).toMatchObject({ diffs: ['statePension'], changedOn: '2 October 2026' });
    const fsChanged = applyPatch({ ...matching, lastModified: '2026-10-02T09:00:00.000Z' }, incomePatch(matching, { 'fs.ids': 'n1', 'fs.n1.amount': '5000', 'fs.n1.fromAge': '65' }, { today: TODAY }).patch);
    expect(answerAge(fsChanged, now(fsChanged))).toMatchObject({ diffs: ['finalSalary'] });
    const page = planPage([{ plan: fsChanged }], fsChanged.id, 'plan', { today: TODAY });
    expect(page.next.id).toBe('P.recheck');
  });
});

describe('I1 — the sub-step, the address and the plan page\'s section', () => {
  it('"income" sits under "plan" beside "about"; the address parses and formats; the screen is plan.income', () => {
    expect(SUB_STEPS.plan).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']);
    expect(ALL_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']);
    expect(PLAN_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix', 'household', 'hold', 'move']);   // the household, hold and move rail steps draw their own screens (road-to-7.md steps 9, 10)
    const r = parse('#/plan/AboutPlan01/income');
    expect(r).toEqual({ screen: 'plan', q: null, step: 'income', planId: 'AboutPlan01', focus: null });
    expect(format(r)).toBe('#/plan/AboutPlan01/income');
    expect(screenName(r)).toBe('plan.income');
  });
  it('every corpus plan: the plan step has a "Money that comes in anyway" section linking to the step, and "Pots" links to its own step (editing-in-v7.md 9)', () => {
    const entries = entriesAt(TODAY);
    for (const e of entries) {
      const pg = planPage(entries, e.plan.id, 'plan', { today: TODAY });
      const plan = pg.steps.find((s) => s.id === 'plan');
      expect(plan.sections.map((s) => s.id)).toEqual(['about', 'pays', 'pots', 'income', 'way', 'mix']);
      const income = plan.sections.find((s) => s.id === 'income');
      expect(income.href).toBe('#/plan/' + e.plan.id + '/income');
      expect(income.sub).toBe('income');
      expect(income.lines.length).toBeGreaterThan(0);
      for (const l of income.lines) expect(PLAN.lines[l.id], l.id).toBeTypeOf('string');
      expect(plan.sections.find((s) => s.id === 'pots').href).toBe('#/plan/' + e.plan.id + '/pots');
      expect(plan.sections.find((s) => s.id === 'pots').lines.some((l) => /statePension|finalSalary|pots\.other/.test(l.id))).toBe(false);
    }
    const lumpy = planPage(entries, LUMPY.id, 'plan', { today: TODAY }).steps.find((s) => s.id === 'plan').sections.find((s) => s.id === 'income');
    expect(lumpy.lines.map((l) => l.id)).toEqual(['pots.statePension', 'pots.finalSalary', 'pots.other', 'income.stream', 'income.stream', 'income.lump', 'income.lump']);
    expect(lumpy.lines[3].slots).toEqual({ label: 'Rental flat', from: '60', to: '74' });
    expect(lumpy.lines[5].slots).toEqual({ label: 'Inherited pension', age: '64', what: 'pension' });
    expect(lumpy.lines[1].slots).toEqual({ from: 'age 65' });
  });
  it('the fields, the cards and their words line up; the draft paths; the declared writes are the planner\'s income keys', () => {
    for (const f of INCOME_FIELDS) { expect(INCOME.fields[f.path].label).toBeTypeOf('string'); if (f.type === 'choice') for (const o of f.options) expect(INCOME.fields[f.path].options[o], `${f.path}.${o}`).toBeTypeOf('string'); }
    for (const [L, spec] of Object.entries(INCOME_LISTS)) for (const f of spec.fields) { expect(INCOME.lists[L].fields[f.path].label, `${L}.${f.path}`).toBeTypeOf('string'); if (f.type === 'choice') for (const o of f.options) expect(INCOME.lists[L].fields[f.path].options[o]).toBeTypeOf('string'); }
    for (const p of ['spKind', 'spWeekly', 'other', 'fs.ids', 'fs.0.amount', 'fs.n12.rises', 'streams.3.toAge', 'lumps.n1.wrapper']) expect(isIncomePath(p), p).toBe(true);
    for (const p of ['age', 'fs', 'fs.ids.x', 'fs.0.toAge', 'lumps.a.amount', 'pots.0.amount', 'fs.0.amount.x', 'streams.n1234.amount']) expect(isIncomePath(p), p).toBe(false);
    expect(isPlanEditPath('age')).toBe(true);
    expect(isPlanEditPath('lumps.0.atAge')).toBe(true);
    for (const p of INCOME_WRITES) expect(p).toMatch(/^stressTool\.settings\.[a-zA-Z]+$/);
    expect(INCOME_WRITES.some((p) => p.startsWith('decisionTool'))).toBe(false);
    expect(ALL_WRITES).toEqual([...new Set([...ABOUT_WRITES, ...INCOME_WRITES, ...SPEND_WRITES, ...POTS_WRITES, ...LASTS_WRITES, ...LOCK_WRITES, ...UNLOCK_WRITES, ...DOCUMENT_WRITES, ...WAY_WRITES, ...MIX_WRITES, ...HOUSEHOLD_WRITES, 'holdings', 'transition', ...PLANS_WRITES, 'lastModified'])]);   // the record and the tick-offs, each one field (road-to-7.md step 10); the plan menu's name and main flag (step 11)
  });
  it('a plan not in the list, and the partner link both ways', () => {
    expect(incomeOf(entriesAt(TODAY), 'NoSuchPlan', { today: TODAY }).found).toBe(false);
    const { ladder, saver } = household();
    const entries = [entryOf(ladder), entryOf(saver)];
    expect(incomeOf(entries, saver.id, { today: TODAY }).partners).toEqual([{ id: 'HouseLadder01', name: 'Ladder plan' }]);
    expect(incomeOf(entries, ladder.id, { today: TODAY }).partners).toEqual([{ id: 'HouseSaver02', name: 'Saving plan' }]);
    expect(safeSettings(ladder, noon(TODAY)).currentAge).toBe(56);
  });
});
