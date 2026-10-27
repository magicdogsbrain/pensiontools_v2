/**
 * Road step 11b's rows on the existing steps (research/v7/road-to-7.md step 11b), the pure parts:
 *   - timing.stale-draft: about.js staleOf is PlanTiming.staleDraft (the planner's rule) on the plan as read — a draft whose
 *     start year has passed, not locked, nothing recorded; "Update it" is the boxes the planner's update sets (stopped, this
 *     tax year) and the ordinary save moves the timing; "Leave it" (stalePatch) writes the planner's own key and nothing else,
 *     and the offer is not made again for that year; never on a locked plan or one with a month recorded;
 *   - inc.state-pension-date: the date box read by the planner's own parser (StatePensionUtils.validateStatePensionDate),
 *     written as the day; the saved text, typed back, writes nothing; the Decision tool's copy kept in step only where it
 *     already exists; a date of birth refused in its own words;
 *   - inc.lump-sums: where each lump sum lands, the planner's own rule (TaxableSleeve.routeWindfall with the plan's ISA policy
 *     and earnings), as line ids with their parts;
 *   - income.lump-to-steps: IncomeSchedule.lumpIntoSteps is the planner's spendLumpSum lifted (a hand case and the rules), and
 *     the spend step's edits make the cards equal the steps it makes, so Save writes them.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { aboutOf, aboutPatch, staleOf, stalePatch, applyPatch, checkAbout } from '../../../src/answers/plan/about.js';
import { incomeOf, incomePatch, checkIncome, boxesOf, landingOf, savedIncome } from '../../../src/answers/plan/income.js';
import { spendOf, checkSpend, spendPatch, lumpEdits, savedSpend, monthlyNet, yearlyGross, boxesOf as spendBoxesOf } from '../../../src/answers/plan/spend.js';
import { lumpIntoSteps, amountAtAge } from '../../../src/services/IncomeSchedule.js';
import { staleDraft, taxYearStartOf } from '../../../src/services/PlanTiming.js';
import { routeWindfall, GIA_DEFAULTS } from '../../../src/services/TaxableSleeve.js';
import { parseStatePensionDate } from '../../../src/utils/StatePensionUtils.js';
import { ABOUT_WRITES, INCOME_WRITES, SPEND_WRITES } from '../../../src/answers/plan/schema.js';
import { INCOME } from '../../../src/v7/copy/income.js';
import { corpus, entryOf, entriesAt, TODAY, noon } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const thisTY = taxYearStartOf(noon(TODAY));

/** A draft whose start year has passed: corpus 02 (unlocked, nothing recorded), set to start last tax year. */
function staleRaw() {
  const p = copy(C['02-pnv-draft']);
  p.stressTool.settings.firstTaxYear = thisTY - 1;
  p.stressTool.settings.retired = true;
  delete p.stressTool.settings.staleDraftDismissedFor;
  return p;
}
const planOf = (raw) => entryOf(raw, TODAY).plan;

describe('timing.stale-draft — "Update this draft to today" on the about step', () => {
  it('the planner\'s rule on the plan as read: offered on a draft whose start year has passed; the words of the years; the boxes the update sets', () => {
    const plan = planOf(staleRaw());
    const sd = staleOf(plan, { today: TODAY });
    expect(sd).not.toBe(null);
    expect(sd.savedYear).toBe(thisTY - 1);
    expect(sd.suggestedYear).toBe(thisTY);
    expect(sd.yearSaved).toBe(`${thisTY - 1}/${String(thisTY).slice(2)}`);
    expect(sd.year).toBe(`${thisTY}/${String(thisTY + 1).slice(2)}`);
    expect(sd.edits).toEqual([{ path: 'stopped', value: 'yes' }, { path: 'startWhen', value: 'now' }]);
    const theirs = staleDraft(plan.stressTool.settings, { locked: false, hasRecords: false, now: noon(TODAY) });
    expect(sd.savedYear).toBe(theirs.savedYear);
    expect(sd.mode).toBe(theirs.mode);
    const v = aboutOf([{ plan }], plan.id, { today: TODAY });
    expect(v.stale).toEqual(sd);
  });

  it('never on a plan as the corpus saves it (every start year ahead), on a locked plan, on a plan with a month recorded, or when "Leave it" was chosen for that year', () => {
    for (const e of entriesAt(TODAY)) expect(staleOf(e.plan, { today: TODAY }), e.plan.id).toBe(null);
    const locked = staleRaw(); locked.decisionTool.settings.locked = true;
    expect(staleOf(planOf(locked), { today: TODAY })).toBe(null);
    const recorded = staleRaw(); recorded.decisionTool.history = [{ date: '2026-09', income: 1000 }];
    expect(staleOf(planOf(recorded), { today: TODAY })).toBe(null);
    const left = staleRaw(); left.stressTool.settings.staleDraftDismissedFor = thisTY - 1;
    expect(staleOf(planOf(left), { today: TODAY })).toBe(null);
    const leftOther = staleRaw(); leftOther.stressTool.settings.staleDraftDismissedFor = thisTY - 2;
    expect(staleOf(planOf(leftOther), { today: TODAY }), 'another year left: offered again').not.toBe(null);
    // a plan shown as saved is not offered it
    expect(aboutOf([{ plan: planOf(staleRaw()), newer: true }], staleRaw().id, { today: TODAY }).stale).toBe(null);
  });

  it('"Leave it": ONE declared key, the planner\'s own, with the saved year; Undo\'s previous; the offer gone once it is written', () => {
    const plan = planOf(staleRaw());
    const p = stalePatch(plan, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch).toEqual({ 'stressTool.settings.staleDraftDismissedFor': thisTY - 1 });
    expect(p.previous).toEqual({ 'stressTool.settings.staleDraftDismissedFor': undefined });
    for (const k of Object.keys(p.patch)) expect(ABOUT_WRITES).toContain(k);
    expect(p.line).toEqual({ id: 'staleLeft', slots: { yearSaved: `${thisTY - 1}/${String(thisTY).slice(2)}` } });
    const after = applyPatch(plan, p.patch);
    expect(staleOf(after, { today: TODAY })).toBe(null);
    expect(stalePatch(after, { today: TODAY }).ok).toBe(false);
    expect(stalePatch(C['03-gilt-ladder-runup'], { today: TODAY }).ok, 'nothing on a locked plan').toBe(false);
  });

  it('"Update it": the boxes it sets, through the ordinary save, move the start to this tax year with the plan stopped — the planner\'s own keys; the offer gone', () => {
    const plan = planOf(staleRaw());
    const sd = staleOf(plan, { today: TODAY });
    const typed = Object.fromEntries(sd.edits.map((e) => [e.path, e.value]));
    const c = checkAbout(plan, typed, { today: TODAY });
    expect(c.ok).toBe(true);
    const p = aboutPatch(plan, typed, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch['stressTool.settings.firstTaxYear']).toBe(thisTY);
    expect(p.patch['decisionTool.settings.firstTaxYear']).toBe(thisTY);
    for (const k of Object.keys(p.patch)) expect(ABOUT_WRITES).toContain(k);
    const after = applyPatch(plan, p.patch);
    expect(after.stressTool.settings.retired).toBe(true);
    expect(staleOf(after, { today: TODAY })).toBe(null);
  });
});

describe('inc.state-pension-date — the date typed from the forecast letter', () => {
  const LUMPY = C['12-lumpy-db-gia'];   // a saved date in the planner's own words: "25 July 2034"

  it('the box starts from the saved text; read by the planner\'s own parser it is the same day, so a save writes nothing', () => {
    const plan = planOf(LUMPY);
    const boxes = boxesOf(plan, { today: TODAY });
    expect(boxes.spDate).toBe(plan.stressTool.settings.spStartDate);
    expect(boxes.spDate).toMatch(/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
    const c = checkIncome(plan, {}, { today: TODAY });
    expect(c.applies.spDate).toBe(true);
    expect(c.values.spDate).toBe('2034-07-25');
    expect(incomePatch(plan, {}, { today: TODAY }).patch).toEqual({});
    expect(incomePatch(plan, { spDate: '25 July 2034' }, { today: TODAY }).patch).toEqual({});
    expect(incomePatch(plan, { spDate: '2034-07-25' }, { today: TODAY }).patch, 'the same day in another form').toEqual({});
  });

  it('a new date: written as the day to the planner\'s Stress key, and to the Decision tool\'s copy only where that copy already exists; the derived State Pension line follows it', () => {
    const plan = planOf(LUMPY);
    expect('spStartDate' in plan.decisionTool.settings).toBe(true);
    const p = incomePatch(plan, { spDate: '6 May 2035' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch).toEqual({ 'stressTool.settings.spStartDate': '2035-05-06', 'decisionTool.settings.spStartDate': '2035-05-06' });
    expect(p.previous['stressTool.settings.spStartDate']).toBe('25 July 2034');
    for (const k of Object.keys(p.patch)) expect(INCOME_WRITES).toContain(k);
    const noCopy = copy(LUMPY); delete noCopy.decisionTool.settings.spStartDate;
    const q = incomePatch(planOf(noCopy), { spDate: '6 May 2035' }, { today: TODAY });
    expect(Object.keys(q.patch)).toEqual(['stressTool.settings.spStartDate']);
    // the planner's parser reads what was written, and the step reads the day back
    expect(parseStatePensionDate('2035-05-06').getFullYear()).toBe(2035);
    const after = applyPatch(plan, p.patch);
    expect(checkIncome(after, {}, { today: TODAY }).values.spDate).toBe('2035-05-06');
    expect(savedIncome(after, { today: TODAY }).sp.dateWords).toBe('6 May 2035');
    const v = incomeOf([{ plan: after }], after.id, { today: TODAY });
    expect(v.fields.find((f) => f.path === 'spDate').shown).toBe('2035-05-06');
    expect(v.derived.find((d) => d.id.startsWith('sp.')).slots.age).toBeGreaterThan(60);
  });

  it('a date of birth is refused in its own words, rubbish too, nothing written; blank keeps what is saved; the box is not asked with no State Pension', () => {
    const plan = planOf(LUMPY);
    expect(checkIncome(plan, { spDate: '1967-05-06' }, { today: TODAY }).errors.spDate).toBe('looksLikeBirth');
    expect(checkIncome(plan, { spDate: 'soon' }, { today: TODAY }).errors.spDate).toBe('notADate');
    expect(incomePatch(plan, { spDate: 'soon' }, { today: TODAY }).ok).toBe(false);
    expect(incomePatch(plan, { spDate: '' }, { today: TODAY }).patch).toEqual({});
    expect(checkIncome(plan, { spKind: 'none', spDate: 'soon' }, { today: TODAY }).applies.spDate).toBe(false);
    expect(checkIncome(plan, { spKind: 'none', spDate: 'soon' }, { today: TODAY }).errors.spDate).toBeUndefined();
    for (const id of ['notADate', 'looksLikeBirth']) expect(INCOME.errors.spDate[id]).toBeTypeOf('string');
    expect(INCOME.fields.spDate.label).toBeTypeOf('string');
  });

  it('a plan with no date that gains a State Pension still gets the day its State Pension age is reached (V7\'s own) unless a date is typed', () => {
    const fresh = copy(C['02-pnv-draft']);
    fresh.stressTool.settings.spStartDate = null;
    fresh.stressTool.settings.spWeeklyAmount = 0;
    const plan = planOf(fresh);
    expect(plan.stressTool.settings.spStartDate || null).toBe(null);
    const made = incomePatch(plan, { spKind: 'full' }, { today: TODAY });
    expect(made.patch['stressTool.settings.spStartDate']).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const typed = incomePatch(plan, { spKind: 'full', spDate: '14 March 2032' }, { today: TODAY });
    expect(typed.patch['stressTool.settings.spStartDate']).toBe('2032-03-14');
  });
});

describe('inc.lump-sums — where each lump sum lands, the planner\'s own rule', () => {
  const LUMPY = C['12-lumpy-db-gia'];

  it('12: the inherited pension joins the pension; the cash lump sum goes as routeWindfall sends it with the plan\'s earnings and mix; the words exist for every id', () => {
    const plan = planOf(LUMPY);
    const v = incomeOf([{ plan }], plan.id, { today: TODAY });
    const cards = v.lists.lumps.cards;
    expect(cards.length).toBe(2);
    expect(cards[0].landing).toEqual({ id: 'lump.pension', slots: {} });
    const ss = plan.stressTool.settings;
    const r = routeWindfall({ amount: 90000, wrapper: 'cash' }, { isaAllowanceLeft: GIA_DEFAULTS.ISA_ALLOWANCE, relevantEarnings: ss.relevantEarnings });
    expect(r.toIsa).toBe(GIA_DEFAULTS.ISA_ALLOWANCE);
    expect(r.toGia).toBeGreaterThan(0);
    expect(cards[1].landing.id).toBe('lump.cash.' + (r.toIsa > 0 ? 'i' : '') + (r.toSipp > 0 ? 'p' : '') + 't');
    expect(cards[1].landing.slots).toEqual({ isa: '£20,000', pension: '£' + r.toSipp.toLocaleString('en-GB'), taxable: '£' + r.toGia.toLocaleString('en-GB'), mix: 'balanced' });
    for (const id of Object.keys(INCOME.lists.lumps.landing)) expect(INCOME.lists.lumps.landing[id]).toBeTypeOf('string');
    for (const m of ['gilt', 'equity', 'bond', 'balanced', 'cash']) expect(INCOME.lists.lumps.mix[m]).toBeTypeOf('string');
  });

  it('the rule by case: an inherited ISA; the ISA on hold takes none; no earnings, nothing to the pension; a row\'s own mix and ISA choice kept; nothing without an amount', () => {
    const ss = { relevantEarnings: 0, taxableMix: 'equity', isaDrawdownStrategy: 'minimiseEarlyTax' };
    const idOf = (r) => 'lump.cash.' + ((r.toIsa > 0 ? 'i' : '') + (r.toSipp > 0 ? 'p' : '') + (r.toGia > 0 ? 't' : '') || 't');
    expect(landingOf(ss, { amount: 5000, wrapper: 'isa' })).toEqual({ id: 'lump.isa', slots: {} });
    // no earnings: the pension still takes the allowance anyone has (routeWindfall's own room), the ISA its allowance, the rest taxable
    const open = routeWindfall({ amount: 50000, wrapper: 'cash' }, { isaAllowanceLeft: GIA_DEFAULTS.ISA_ALLOWANCE, relevantEarnings: 0 });
    expect(landingOf(ss, { amount: 50000, wrapper: 'cash' }).id).toBe(idOf(open));
    expect(open.toIsa).toBe(GIA_DEFAULTS.ISA_ALLOWANCE);
    const held = routeWindfall({ amount: 50000, wrapper: 'cash' }, { isaAllowanceLeft: 0, relevantEarnings: 0 });
    expect(held.toIsa).toBe(0);
    expect(landingOf({ ...ss, isaDrawdownStrategy: 'hold' }, { amount: 50000, wrapper: 'cash' }).id).toBe(idOf(held));
    expect(landingOf(ss, { amount: 15000, wrapper: 'cash' })).toEqual({ id: 'lump.cash.i', slots: { isa: '£15,000', pension: '£0', taxable: '£0', mix: 'equity' } });
    expect(landingOf(ss, { amount: 50000, wrapper: 'cash', mix: 'gilt', toIsa: false }).slots.mix).toBe('gilt');
    expect(landingOf(ss, { amount: 50000, wrapper: 'cash', toIsa: false }).id).toBe(idOf(routeWindfall({ amount: 50000, wrapper: 'cash', toIsa: false }, { isaAllowanceLeft: GIA_DEFAULTS.ISA_ALLOWANCE, relevantEarnings: 0 })));
    expect(landingOf(ss, { amount: 50000, wrapper: 'cash', toIsa: false }).slots.isa, 'the row says no ISA').toBe('£0');
    expect(landingOf(ss, { amount: 0, wrapper: 'cash' })).toBe(null);
    expect(landingOf(ss, null)).toBe(null);
    // the typed amount is what lands: a card changed shows its new landing before the save
    const plan = planOf(LUMPY);
    const typed = incomeOf([{ plan }], plan.id, { today: TODAY, typed: { 'lumps.1.amount': '15,000' } });
    expect(typed.lists.lumps.cards[1].landing.id).toBe('lump.cash.i');
  });
});

describe('income.lump-to-steps — "Turn a lump sum into income"', () => {
  it('lumpIntoSteps is the planner\'s spendLumpSum: a hand case — one step, a lump sum four years in', () => {
    const r = lumpIntoSteps([{ fromAge: 57, amount: 40000 }], { ageNow: 57, duration: 35, amount: 120000, year: 4 });
    expect(r.age).toBe(61);
    expect(r.years).toBe(31);                      // 57 + 35 − 1 − 61 + 1
    expect(r.perYear).toBe(3900);                  // 120,000 / 31 to the nearest £100
    expect(r.steps).toEqual([{ fromAge: 57, amount: 40000 }, { fromAge: 61, amount: 43900, decline: 0 }]);
  });

  it('the rules: a step at that age is raised, not doubled; every later step rises the same; a falling step before keeps its fall for the new one; a step moving evenly into the new age stops moving; the lump stays untouched; nothing without steps', () => {
    const steps = [{ fromAge: 60, amount: 48000 }, { fromAge: 66, amount: 42000, glideToNext: true }, { fromAge: 76, amount: 34000 }];
    const at = lumpIntoSteps(steps, { ageNow: 60, duration: 32, amount: 120000, year: 6 });
    expect(at.steps.map((s) => [s.fromAge, s.amount])).toEqual([[60, 48000], [66, 42000 + at.perYear], [76, 34000 + at.perYear]]);
    const between = lumpIntoSteps(steps, { ageNow: 60, duration: 32, amount: 90000, year: 9 });
    const made = between.steps.find((s) => s.fromAge === 69);
    expect(made.amount).toBe(Math.round(amountAtAge(steps, 69, 48000)) + between.perYear);
    expect(made.decline).toBe(0);
    expect(between.steps.find((s) => s.fromAge === 66).glideToNext, 'no longer moving evenly into the new step').toBe(false);
    expect(between.steps.find((s) => s.fromAge === 76).amount).toBe(34000 + between.perYear);
    expect(steps[1].glideToNext, 'the steps given are untouched').toBe(true);
    const falling = lumpIntoSteps([{ fromAge: 60, amount: 48000, decline: 2 }], { ageNow: 60, duration: 30, amount: 30000, year: 5 });
    expect(falling.steps[1]).toEqual({ fromAge: 65, amount: Math.round(48000 * Math.pow(0.98, 5)) + falling.perYear, decline: 2 });
    expect(lumpIntoSteps([], { ageNow: 60, duration: 30, amount: 30000, year: 5 })).toBe(null);
    // at or after the last year: one year left, the whole lump a year
    const late = lumpIntoSteps([{ fromAge: 60, amount: 48000 }], { ageNow: 60, duration: 30, amount: 30000, year: 29 });
    expect(late.years).toBe(1); expect(late.perYear).toBe(30000);
  });

  it('12: the spend step offers each lump sum inside the plan\'s years with what it could support; the edits make the cards equal the steps the planner makes, and Save writes them to the pound', () => {
    const plan = planOf(C['12-lumpy-db-gia']);
    const s = savedSpend(plan, { today: TODAY });
    expect(s.lumps.map((l) => [l.label, l.amount, l.atAge])).toEqual([['Inherited pension', 120000, s.ageNow + 4], ['Downsizing', 90000, s.ageNow + 9]]);
    const v = spendOf([{ plan }], plan.id, { today: TODAY });
    expect(v.lumps.length).toBe(2);
    for (const l of v.lumps) {
      const r = lumpIntoSteps(s.plainSteps, { ageNow: s.ageNow, duration: s.duration, amount: s.lumps.find((x) => x.id === l.id).amount, year: l.age - s.ageNow });
      expect(l.perYearValue).toBe(r.perYear);
      expect(l.years).toBe(r.years);
      expect(l.perYear).toBe('£' + r.perYear.toLocaleString('en-GB'));
      expect(Array.isArray(l.edits)).toBe(true);
      // the cards after the edits: the planner's steps exactly — each box says the month after tax and the before-tax figure
      // rides beside it (first.gross, steps.<id>.gross), so the write is the planner's row to the pound, not the box grossed up
      const typed = Object.fromEntries(l.edits.map((e) => [e.path, e.value]));
      const c = checkSpend(plan, typed, { today: TODAY });
      expect(c.ok, JSON.stringify(c.errors)).toBe(true);
      const want = r.steps.slice().sort((a, b2) => a.fromAge - b2.fromAge);
      expect(c.shape.map((x) => [x.fromAge, x.amount, !!x.glideToNext])).toEqual(want.map((x) => [x.fromAge, x.amount, !!x.glideToNext]));
      const p = spendPatch(plan, typed, { today: TODAY });
      expect(p.ok).toBe(true);
      expect(Object.keys(p.patch).length).toBeGreaterThan(0);
      for (const k of Object.keys(p.patch)) expect(SPEND_WRITES).toContain(k);
      expect(p.patch['stressTool.settings.incomeSteps'].map((x) => [x.fromAge, x.amount])).toEqual(want.map((x) => [x.fromAge, x.amount]));
      // the figure beside the box on screen is the planner's row too
      const shown = spendOf([{ plan }], plan.id, { today: TODAY, typed });
      for (const card of shown.lists.steps.cards) { const fa = +card.fields.find((f) => /\.fromAge$/.test(f.path)).shown; const w = want.find((x) => x.fromAge === fa); if (w) expect(card.gross, `beside the box at ${fa}`).toBe('£' + w.amount.toLocaleString('en-GB')); }
      // a figure typed over a lifted box is grossed up as ever: the lift's figure no longer rides with it
      const lifted = l.edits.find((e) => /^steps\..+\.gross$/.test(e.path));
      if (lifted) {
        const id = lifted.path.split('.')[1];
        const box = `steps.${id}.amount`;
        const age = +(typed[`steps.${id}.fromAge`] != null ? typed[`steps.${id}.fromAge`] : spendBoxesOf(plan, { today: TODAY })[`steps.${id}.fromAge`]);
        const over = { ...typed, [box]: String(+typed[box] + 50) };
        const c2 = checkSpend(plan, over, { today: TODAY });
        expect(c2.ok, JSON.stringify(c2.errors)).toBe(true);
        expect(c2.shape.find((x) => x.fromAge === age).amount).toBe(yearlyGross(+typed[box] + 50, s.bands));
      }
    }
    // a lump sum at an age no step starts at makes a new card; at a step's own age it raises that step and makes none
    for (const l of v.lumps) expect(!!l.edits.find((e) => e.path === 'steps.ids'), `at ${l.age}`).toBe(!s.plainSteps.some((x) => x.fromAge === l.age));
    const onStep = copy(C['12-lumpy-db-gia']);
    onStep.stressTool.settings.windfalls = [{ label: 'At a step', amount: 50000, wrapper: 'cash', year: s.plainSteps[1].fromAge - s.ageNow }];
    const vs = spendOf([{ plan: planOf(onStep) }], onStep.id, { today: TODAY });
    expect(vs.lumps[0].edits.find((e) => e.path === 'steps.ids')).toBeUndefined();
    expect(vs.lumps[0].edits.some((e) => /^steps\.\d+\.amount$/.test(e.path))).toBe(true);
    // a locked plan or a plan shown as saved offers no edits; a plan with no lump sum has none
    expect(spendOf([{ plan: C['03-gilt-ladder-runup'] }], C['03-gilt-ladder-runup'].id, { today: TODAY }).lumps.every((l) => l.edits === null)).toBe(true);
    expect(spendOf([{ plan: C['01-fresh-default'] }], C['01-fresh-default'].id, { today: TODAY }).lumps).toEqual([]);
  });

  it('property: over random steps and lump sums, every step rises by the same amount after the lump\'s age, none before it, and the edits keep every path a spend path', () => {
    const plan = planOf(C['12-lumpy-db-gia']);
    const s = savedSpend(plan, { today: TODAY });
    fc.assert(fc.property(fc.integer({ min: 1000, max: 500000 }), fc.integer({ min: 0, max: s.duration - 1 }), (amount, year) => {
      const r = lumpIntoSteps(s.plainSteps, { ageNow: s.ageNow, duration: s.duration, amount, year });
      const age = s.ageNow + year;
      for (const st of r.steps) {
        const was = s.plainSteps.find((x) => x.fromAge === st.fromAge);
        if (st.fromAge > age) expect(st.amount).toBe(was.amount + r.perYear);
        else if (st.fromAge < age) expect(st.amount).toBe(was.amount);
      }
      const c = checkSpend(plan, {}, { today: TODAY });
      const edits = lumpEdits(c, r.steps, s.bands);
      for (const e of edits) expect(e.path).toMatch(/^(first\.(amount|gross|then)|steps\.(ids|[a-z0-9]+\.(fromAge|amount|gross|then|fallsPct)))$/);
      // every before-tax figure handed beside a box is that box's month after tax, and the steps the edits make are the planner's to the pound
      const typed = Object.fromEntries(edits.map((e) => [e.path, e.value]));
      for (const e of edits.filter((x) => /\.gross$/.test(x.path))) expect(String(monthlyNet(+e.value, s.bands))).toBe(typed[e.path.replace(/\.gross$/, '.amount')]);
      const after = checkSpend(plan, typed, { today: TODAY });
      expect(after.ok, JSON.stringify(after.errors)).toBe(true);
      expect(after.shape.map((x) => [x.fromAge, x.amount])).toEqual(r.steps.slice().sort((a, b) => a.fromAge - b.fromAge).map((x) => [x.fromAge, x.amount]));
    }), { numRuns: 40 });
  });
});
