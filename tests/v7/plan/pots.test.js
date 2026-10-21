/**
 * T1 (research/v7/editing-in-v7.md 9.5): the pure reader and writer of "Your pots and tax".
 *  - potsOf on the 12 corpus plans × 3 dates; a plan as saved writes nothing; the lumpy plan's facts (an ordinary account at
 *    the higher rate, earnings) and the saver's (the planner's projection at the stop);
 *  - read∘write∘read is identity over random editable plans and random typed boxes (fast-check): only POTS_WRITES paths,
 *    every other byte unchanged, Undo byte for byte, a second write empty, the read-back equal to what was typed;
 *  - the written plan read by the planner's own readers — chargesPctOf, isaGrowthOf, bandsOf, sippTodayOf and
 *    createSimulationConfigFromSettings — shows what the screen showed;
 *  - absent keys stay absent when untouched; a locked plan from before charges or the ISA choice never gains either key;
 *  - the bought list is the planner's; the problems in their ids; a locked plan writes nothing; the stale rule; the
 *    sub-step, the address and the plan page's section and link.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { potsOf, potsPatch, applyPatch, boxesOf, savedPots, checkPots, splitTotal, sharesOf, notUsedBy, BOUGHT } from '../../../src/answers/plan/pots.js';
import { answerAge, bandsOf } from '../../../src/answers/plan/about.js';
import { POTS_FIELDS, POTS_WRITES, ALL_WRITES, ABOUT_WRITES, INCOME_WRITES, SPEND_WRITES, LASTS_WRITES, LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES, isPotsPath, isPlanEditPath, ISA_GROWTHS, ISA_USES, TAXABLE_MIXES, GIA_BANDS, TAX_MODES, TAX_FREES } from '../../../src/answers/plan/schema.js';
import { SUB_STEPS, ALL_SUB_STEPS } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { parse, format, screenName, PLAN_SUB_STEPS } from '../../../src/v7/router/routes.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { chargesPctOf, normaliseChargesPct } from '../../../src/services/Charges.js';
import { isaGrowthOf } from '../../../src/services/IsaGrowth.js';
import { sippTodayOf, potScaleOf } from '../../../src/services/PotsAtRetirement.js';
import { ISA_STRATEGIES } from '../../../src/services/IsaDrawdown.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { BOUGHT_STRATEGIES } from '../../../src/ui/strategySettingsUse.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { POTS } from '../../../src/v7/copy/pots.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, household, DATES, TODAY, noon } from './_plans.js';

const C = corpus();
const text = (v) => JSON.stringify(v);
const strip = (plan) => { const out = JSON.parse(JSON.stringify(plan)); for (const p of ALL_WRITES) { const parts = p.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return out; };
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const EDITABLE = Object.values(C).filter((p) => !isLocked(p));
const LUMPY = C['12-lumpy-db-gia'];
const SAVER = C['10-couple-b'];
const FRESH = C['01-fresh-default'];
const S = 'stressTool.settings.';

describe('T1 — the reading, on every corpus plan at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: found, every field has words, every derived line has words, a plan as saved writes nothing`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const a = potsOf(entries, e.plan.id, { today });
        expect(a.found).toBe(true);
        expect(a.fields.map((f) => f.path)).toEqual(POTS_FIELDS.map((f) => f.path));
        for (const f of a.fields) { expect(POTS.fields[f.path], f.path).toBeTruthy(); if (f.type === 'choice') for (const o of f.options) expect(POTS.fields[f.path].options[o], `${f.path}.${o}`).toBeTypeOf('string'); }
        for (const d of a.derived) { expect(POTS.derived[d.id], d.id).toBeTypeOf('string'); for (const v of Object.values(d.slots)) expect(v, d.id).not.toBeUndefined(); }
        for (const id of Object.values(a.useNotes)) expect(POTS.useNotes[id], id).toBeTypeOf('string');
        expect(a.errors, e.plan.id).toEqual({});
        expect(a.patch, e.plan.id).toEqual({});
        expect(a.locked).toBe(isLocked(e.plan));
        expect(a.editable).toBe(!a.locked);
        expect(a.savedLine).toMatchObject({ id: 'pots' });
        // every figure shown is the planner's own reading of the plan
        const s = savedPots(e.plan, { today });
        const ss = effectiveStressSettings(e.plan, { now: noon(today) });
        if (!a.locked) {
          expect(s.values.pension).toBe(sippTodayOf(ss));
          expect(s.values.charges).toBe(chargesPctOf(ss));
          expect(s.values.isaGrowth).toBe(isaGrowthOf(ss));
          expect({ pa: s.values.pa, brl: s.values.brl, hrl: s.values.hrl }).toEqual(bandsOf(ss));
        }
        expect(a.notUsed).toEqual(notUsedBy(s.strategyId));
      }
    });
  }
  it('the lumpy plan (12): an ordinary account at the higher rate, earnings, bed-and-ISA on; retired, so no pots at the stop', () => {
    const s = savedPots(entryOf(LUMPY).plan, { today: TODAY });
    expect(s.later).toBe(false);
    expect(s.values).toMatchObject({ pension: 440000, isa: 60000, isaGrowth: 'cash', isaUse: 'minimiseEarlyTax', taxable: 85000, taxableMix: 'balanced', giaBand: 'higher', earnings: 12000, bedAndIsa: 'yes', charges: 0.5, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', taxFree: 'drawdown', ufplsYears: null, ufplsThenIsa: 'no', bandFill: 'no' });
    expect(s.values.pots).toEqual({ equity: 280000, bond: 120000, cash: 40000, div: 0 });
    expect(boxesOf(entryOf(LUMPY).plan, { today: TODAY })).toEqual({ pension: '440000', isa: '60000', isaGrowth: 'cash', isaUse: 'minimiseEarlyTax', taxable: '85000', taxableMix: 'balanced', giaBand: 'higher', earnings: '12000', bedAndIsa: 'yes', charges: '0.5', pa: '12570', brl: '50270', hrl: '125140', taxMode: 'inflates', taxFree: 'drawdown', ufplsThenIsa: 'no', bandFill: 'no' });
    const v = potsOf(entriesAt(TODAY), LUMPY.id, { today: TODAY });
    expect(v.derived.map((d) => d.id)).toEqual(['pots.todayTaxable', 'pots.split', 'isa.cash', 'isa.use.minimiseEarlyTax', 'charges.some', 'tax.bands', 'tax.free.drawdown', 'tax.saves']);
    expect(v.derived[0].slots).toEqual({ pension: '£440,000', isa: '£60,000', taxable: '£85,000' });
    expect(v.derived[1].slots).toEqual({ shares: '£280,000', bonds: '£120,000', cash: '£40,000', div: '' });
    expect(v.fields.find((f) => f.path === 'stopSipp').applies).toBe(false);
    expect(v.fields.find((f) => f.path === 'taxableMix').applies).toBe(true);
    expect(v.fields.find((f) => f.path === 'ufplsYears').applies).toBe(false);
    expect(v.savedLine).toEqual({ id: 'pots', slots: { pension: '£440,000', isa: '£60,000', charges: '0.5' } });
    expect(v.useNotes).toEqual({});
    expect(v.notUsed).toEqual([]);
  });
  it('the saver (10): stopping later, the planner\'s own projection at the stop is shown and the boxes are blank; a fresh plan (01): no ordinary account, so its mix and band are not asked', () => {
    const s = savedPots(entryOf(SAVER).plan, { today: TODAY });
    expect(s.later).toBe(true);
    expect(s.values.stopSipp).toBe(null);
    expect(s.par).toEqual({ isa: 9955, sipp: 278542, source: 'accumulation' });
    const v = potsOf(entriesAt(TODAY), SAVER.id, { today: TODAY });
    expect(v.fields.find((f) => f.path === 'stopSipp').applies).toBe(true);
    expect(v.derived.find((d) => d.id === 'stop.projection').slots).toEqual({ sipp: '£278,542', isa: '£9,955' });
    const f = potsOf(entriesAt(TODAY), FRESH.id, { today: TODAY });
    expect(f.fields.find((f) => f.path === 'taxableMix').applies).toBe(false);
    expect(f.derived.map((d) => d.id)).toContain('pots.today');
    expect(f.derived.map((d) => d.id)).not.toContain('stop.projection');
  });
  it('a locked plan (03, a gilt ladder): the document\'s pots and assumptions, the dial it is sized on, the parts a bought strategy ignores; 06 (locked before charges and the ISA choice) says so and never gains a key', () => {
    const l = savedPots(entryOf(C['03-gilt-ladder-runup']).plan, { today: TODAY });
    expect(l.locked).toBe(true);
    expect(l.bought).toBe(true);
    expect(l.pinned).toEqual({ sipp: 1050000, isa: 80000 });
    expect(l.values).toMatchObject({ pension: 1050000, isa: 80000, isaUse: 'hold', charges: 0, pa: 12570 });
    const v = potsOf(entriesAt(TODAY), C['03-gilt-ladder-runup'].id, { today: TODAY });
    expect(v.notUsed).toEqual(['taxFree', 'ufplsYears', 'ufplsThenIsa', 'bandFill', 'earnings', 'bedAndIsa']);
    expect(v.useNotes).toMatchObject({ pension: 'pinned', isa: 'pinned', isaGrowth: 'isaGrowthLocked' });   // locked before the choice: that note wins over the bought one
    expect(v.derived.map((d) => d.id)).toContain('pots.pinned');
    expect(v.derived.map((d) => d.id)).toContain('isa.use.holdBought');   // a ladder never draws its held ISA: no "rescue" line
    const old = savedPots(entryOf(C['06-pre-6.4-no-timing']).plan, { today: TODAY });
    expect(old.hasChargesKey).toBe(false);
    expect(old.hasIsaGrowthKey).toBe(false);
    expect(old.values.charges).toBe(0);
    expect(old.values.isaGrowth).toBe(null);
    const ov = potsOf(entriesAt(TODAY), C['06-pre-6.4-no-timing'].id, { today: TODAY });
    expect(ov.useNotes).toMatchObject({ charges: 'chargesLocked', isaGrowth: 'isaGrowthLocked' });
    expect(ov.derived.map((d) => d.id)).toContain('charges.locked');
    expect(ov.derived.map((d) => d.id)).toContain('isa.fixed');
    expect(ov.fields.find((f) => f.path === 'charges').applies).toBe(false);
    expect(ov.fields.find((f) => f.path === 'isaGrowth').applies).toBe(false);
    expect(potsPatch(entryOf(C['06-pre-6.4-no-timing']).plan, { charges: '0.5', isaGrowth: 'cash' }, { today: TODAY })).toEqual({ ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} });
  });
  it('a plan whose pots come from its funds list (07): the pension box is not drawn and the line says where the figure comes from', () => {
    const v = potsOf(entriesAt(TODAY), C['07-pre-6.13-flat-params'].id, { today: TODAY });
    expect(v.fundsMode).toBe(true);
    expect(v.fields.find((f) => f.path === 'pension').applies).toBe(false);
    expect(v.derived.find((d) => d.id === 'pots.fromFunds').slots).toEqual({ pension: '£995,000' });
    expect(v.derived.map((d) => d.id)).toContain('isa.funds');
    expect(v.fields.find((f) => f.path === 'isaGrowth').applies).toBe(false);
    expect(potsPatch(entryOf(C['07-pre-6.13-flat-params']).plan, { pension: '1' }, { today: TODAY }).patch).toEqual({});
  });
});

describe('T1 — the write: the planner\'s keys, as its Save writes them', () => {
  const plan = entryOf(LUMPY).plan;
  it('the pension pot total is written as the three pots in the saved proportions, cash the remainder; the planner adds them back to the total', () => {
    const p = potsPatch(plan, { pension: '500,000' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch).sort()).toEqual([S + 'bondMin', S + 'cashTarget', S + 'equityMin']);
    expect(p.patch).toEqual({ [S + 'equityMin']: 318182, [S + 'bondMin']: 136364, [S + 'cashTarget']: 45454 });
    expect(p.previous).toEqual({ [S + 'equityMin']: 280000, [S + 'bondMin']: 120000, [S + 'cashTarget']: 40000 });
    const after = applyPatch(plan, p.patch);
    expect(sippTodayOf(effectiveStressSettings(after, { now: noon(TODAY) }))).toBe(500000);
    expect(savedPots(after, { today: TODAY }).values.pension).toBe(500000);
    expect(sharesOf(savedPots(after, { today: TODAY }).values.pots).equity).toBeCloseTo(280000 / 440000, 4);
    // the engine's starting pots are the written ones
    const cfg = createSimulationConfigFromSettings({}, effectiveStressSettings(after, { now: noon(TODAY) }));
    expect(cfg.equityStart + cfg.bondStart + cfg.cashStart).toBe(500000);
    expect(potsPatch(after, {}, { today: TODAY }).patch).toEqual({});
    // a pot with no saved split takes the balanced preset, the planner's own fallback
    expect(splitTotal(100000, sharesOf({ equity: 0, bond: 0, cash: 0, div: 0 }))).toEqual({ equity: 50000, bond: 40000, div: 0, cash: 10000 });
    expect(sharesOf({ equity: 0, bond: 0, cash: 0, div: 0 })).toEqual({ equity: RISK_PRESETS.balanced.equity, bond: RISK_PRESETS.balanced.bond, cash: RISK_PRESETS.balanced.cash, div: 0 });
    // with a diversifiers sleeve, the sleeve keeps its share
    const withDiv = JSON.parse(JSON.stringify(plan)); withDiv.stressTool.settings.diversifierStart = 40000;
    const q = potsPatch(withDiv, { pension: '960,000' }, { today: TODAY });
    expect(q.patch).toEqual({ [S + 'equityMin']: 560000, [S + 'bondMin']: 240000, [S + 'cashTarget']: 80000, [S + 'diversifierStart']: 80000 });
  });
  it('the ISA, how it grows and is used, the ordinary account, earnings, bed-and-ISA, charges, the bands, the tax-free part and band fill: read back by the planner\'s own readers', () => {
    const typed = { isa: '70,000', isaGrowth: 'invested', isaUse: 'maximiseLongevity', taxable: '90,000', taxableMix: 'gilt', giaBand: 'basic', earnings: '0', bedAndIsa: 'no', charges: '0.35', pa: '12,000', brl: '45,000', hrl: '120,000', taxMode: 'frozen', taxFree: 'ufpls', ufplsYears: '10', ufplsThenIsa: 'yes', bandFill: 'yes' };
    const p = potsPatch(plan, typed, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch).toEqual({
      [S + 'isaBalance']: 70000, [S + 'isaGrowth']: 'invested', [S + 'isaDrawdownStrategy']: 'maximiseLongevity',
      [S + 'taxableStart']: 90000, [S + 'taxableMix']: 'gilt', [S + 'giaTaxBand']: 'basic', [S + 'relevantEarnings']: 0, [S + 'bedAndIsa']: false,
      [S + 'chargesPct']: 0.35, [S + 'pa']: 12000, [S + 'brl']: 45000, [S + 'hrl']: 120000, [S + 'taxMode']: 'frozen',
      [S + 'accessMethod']: 'ufpls', [S + 'ufplsYears']: 10, [S + 'ufplsThenPcls']: true, [S + 'bandFillRecycle']: true
    });
    const after = applyPatch(plan, p.patch);
    const ss = effectiveStressSettings(after, { now: noon(TODAY) });
    expect(chargesPctOf(ss)).toBe(0.35);
    expect(isaGrowthOf(ss)).toBe('invested');
    expect(bandsOf(ss)).toEqual({ pa: 12000, brl: 45000, hrl: 120000 });
    const cfg = createSimulationConfigFromSettings({}, ss);
    expect(cfg).toMatchObject({ pa: 12000, brl: 45000, hrl: 120000, taxMode: 'frozen', accessMethod: 'ufpls', ufplsYears: 10, ufplsThenPcls: true, bandFillRecycle: true, taxableStart: 90000, taxableMix: 'gilt', giaTaxBand: 'basic', bedAndIsa: false, relevantEarnings: 0, isaBalance: 70000, isaDrawdownStrategy: 'maximiseLongevity', chargesPct: 0.35, isaGrowth: 'invested' });
    expect(savedPots(after, { today: TODAY }).values).toMatchObject({ isa: 70000, isaGrowth: 'invested', isaUse: 'maximiseLongevity', taxable: 90000, taxableMix: 'gilt', giaBand: 'basic', earnings: 0, bedAndIsa: 'no', charges: 0.35, pa: 12000, brl: 45000, hrl: 120000, taxMode: 'frozen', taxFree: 'ufpls', ufplsYears: 10, ufplsThenIsa: 'yes', bandFill: 'yes' });
    expect(potsPatch(after, {}, { today: TODAY }).patch).toEqual({});
    // a charge typed off the grid lands on it, as the planner's own Save puts it (normaliseChargesPct)
    expect(potsPatch(plan, { charges: '0.47' }, { today: TODAY }).patch).toEqual({ [S + 'chargesPct']: normaliseChargesPct(0.47) });
    expect(potsPatch(plan, { charges: '0.47' }, { today: TODAY }).patch[S + 'chargesPct']).toBe(0.45);
    // the ISA held: bed-and-ISA is not asked and not written
    const held = potsPatch(plan, { isaUse: 'hold', bedAndIsa: 'no' }, { today: TODAY });
    expect(held.patch).toEqual({ [S + 'isaDrawdownStrategy']: 'hold' });
    expect(checkPots(plan, { isaUse: 'hold' }, { today: TODAY }).applies.bedAndIsa).toBe(false);
    // the tax-free part kept separate: the years and the tick are left as stored
    const kept = potsPatch(after, { taxFree: 'drawdown' }, { today: TODAY });
    expect(kept.patch).toEqual({ [S + 'accessMethod']: 'drawdown' });
  });
  it('a key the plan lacks is written only on a value that differs from what the engines read for the absent key (01: no ordinary account, no tax-free choice, no charges box in the stored plan)', () => {
    const fresh = entryOf(FRESH).plan;
    expect(fresh.stressTool.settings.taxableStart).toBeUndefined();
    expect(fresh.stressTool.settings.accessMethod).toBeUndefined();
    expect(fresh.stressTool.settings.bedAndIsa).toBeUndefined();
    const same = potsPatch(fresh, { taxable: '0', bedAndIsa: 'yes', taxFree: 'drawdown', bandFill: 'no', earnings: '0' }, { today: TODAY });
    expect(same.patch).toEqual({});
    const chosen = potsPatch(fresh, { bedAndIsa: 'no', taxFree: 'ufpls', earnings: '20,000' }, { today: TODAY });
    expect(chosen.patch).toEqual({ [S + 'bedAndIsa']: false, [S + 'accessMethod']: 'ufpls', [S + 'relevantEarnings']: 20000 });
    expect(chosen.previous).toEqual({ [S + 'bedAndIsa']: undefined, [S + 'accessMethod']: undefined, [S + 'relevantEarnings']: undefined });
    // the migration gave the unlocked plan its charge and its ISA choice: the box shows them, and the same value writes nothing
    expect(fresh.stressTool.settings.chargesPct).toBe(0.5);
    expect(fresh.stressTool.settings.isaGrowth).toBe('cash');
    expect(potsPatch(fresh, { charges: '0.5', isaGrowth: 'cash' }, { today: TODAY }).patch).toEqual({});
    // Undo of a key that was absent puts it back as absent
    const after = applyPatch(fresh, chosen.patch);
    expect(text(applyPatch(after, chosen.previous))).toBe(text(fresh));
  });
  it('pots at the stop, typed: the planner\'s own object; blanked, a typed override goes back to null and the page says so; a projection is left alone', () => {
    const saver = entryOf(SAVER).plan;
    const p = potsPatch(saver, { stopSipp: '300,000' }, { today: TODAY });
    expect(p.patch).toEqual({ [S + 'potAtRetirement']: { sipp: 300000, isa: null, source: 'override' } });
    const after = applyPatch(saver, p.patch);
    expect(savedPots(after, { today: TODAY }).values).toMatchObject({ stopSipp: 300000, stopIsa: null });
    expect(boxesOf(after, { today: TODAY })).toMatchObject({ stopSipp: '300000' });
    expect(boxesOf(after, { today: TODAY }).stopIsa).toBeUndefined();
    // the engines scale today's pots to it, as the planner's Timing block does
    const ss = effectiveStressSettings(after, { now: noon(TODAY) });
    expect(potScaleOf(ss).sipp).toBeCloseTo(300000 / sippTodayOf(ss), 9);
    expect(potsOf([{ plan: after }], after.id, { today: TODAY }).derived.find((d) => d.id === 'stop.typed').slots).toEqual({ sipp: '£300,000', isa: 'none typed' });
    // both blank again: null (the planner's own fallback without a projection), and the line says what that means
    const back = potsPatch(after, { stopSipp: '' }, { today: TODAY });
    expect(back.patch).toEqual({ [S + 'potAtRetirement']: null });
    expect(potsOf([{ plan: after }], after.id, { today: TODAY, typed: { stopSipp: '' } }).derived.map((d) => d.id)).toContain('stop.blanked');
    // a stored projection with blank boxes is left exactly as it is
    expect(potsPatch(saver, { isa: '9000' }, { today: TODAY }).patch).toEqual({});
    expect(potsPatch(saver, { stopIsa: '12,000' }, { today: TODAY }).patch).toEqual({ [S + 'potAtRetirement']: { sipp: null, isa: 12000, source: 'override' } });
    // a plan that has stopped: the boxes are not drawn and nothing is written for them
    expect(potsPatch(plan, { stopSipp: '1' }, { today: TODAY }).patch).toEqual({});
  });
  it('a plan made from a preview answer shows the answer\'s own middling and bad-case pots at the stop, never computed here', () => {
    const seeded = JSON.parse(JSON.stringify(entryOf(SAVER).plan));
    seeded.fromAnswer = { savedOn: '2026-09-20T10:00:00.000Z', answer: { lasted: 9 }, who: 'you', people: [{ who: 'you', ageToday: 58, ageAtStop: 62, years: 32, stop: { kind: 'later', yearsFromNow: 4 }, pension: { today: 221000, atStop: { careful: 260000, middling: 300000 } }, savings: { today: 9000, atStop: { careful: 11000, middling: 14000 } } }] };
    const v = potsOf([{ plan: seeded }], seeded.id, { today: TODAY });
    expect(v.derived.find((d) => d.id === 'stop.answer').slots).toEqual({ sipp: '£300,000', sippBad: '£260,000', isa: '£14,000', isaBad: '£11,000' });
    expect(v.derived.map((d) => d.id)).not.toContain('stop.none');
  });
  it('a locked plan: no patch, whatever is typed', () => {
    expect(potsPatch(entryOf(C['03-gilt-ladder-runup']).plan, { pension: '1' }, { today: TODAY })).toEqual({ ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} });
  });
  it('the problems, in their ids', () => {
    const errs = (typed) => checkPots(plan, typed, { today: TODAY }).errors;
    expect(errs({ pension: '' })).toEqual({ pension: 'required' });
    expect(errs({ pension: 'abc' })).toEqual({ pension: 'notANumber' });
    expect(errs({ pension: '50,000,001' })).toEqual({ pension: 'tooHigh' });
    expect(errs({ isa: '' })).toEqual({});
    expect(errs({ isa: '-1' })).toEqual({ isa: 'notANumber' });
    expect(errs({ isaGrowth: 'gold' })).toEqual({ isaGrowth: 'notAnOption' });
    expect(errs({ isaGrowth: '' })).toEqual({ isaGrowth: 'required' });
    expect(errs({ isaUse: 'x' })).toEqual({ isaUse: 'notAnOption' });
    expect(errs({ taxableMix: 'x' })).toEqual({ taxableMix: 'notAnOption' });
    expect(errs({ taxable: '0', taxableMix: 'x' })).toEqual({});
    expect(errs({ charges: '' })).toEqual({ charges: 'required' });
    expect(errs({ charges: '3.5' })).toEqual({ charges: 'range' });
    expect(errs({ charges: 'x' })).toEqual({ charges: 'notANumber' });
    expect(errs({ pa: '' })).toEqual({ pa: 'required' });
    expect(errs({ brl: '12,000' })).toEqual({ brl: 'belowAllowance' });
    expect(errs({ hrl: '50,000' })).toEqual({ hrl: 'belowBasic' });
    expect(errs({ taxMode: 'x' })).toEqual({ taxMode: 'notAnOption' });
    expect(errs({ taxFree: 'ufpls', ufplsYears: '0' })).toEqual({ ufplsYears: 'tooLow' });
    expect(errs({ taxFree: 'ufpls', ufplsYears: '61' })).toEqual({ ufplsYears: 'tooHigh' });
    expect(errs({ taxFree: 'ufpls', ufplsYears: '' })).toEqual({});
    expect(errs({ taxFree: 'drawdown', ufplsYears: 'x' })).toEqual({});
    expect(errs({ bandFill: 'maybe' })).toEqual({ bandFill: 'notAnOption' });
    expect(errs({ stopSipp: '1' })).toEqual({});   // not drawn on a plan that has stopped
    expect(checkPots(entryOf(SAVER).plan, { stopSipp: '0' }, { today: TODAY }).errors).toEqual({ stopSipp: 'tooLow' });
    for (const [k, e] of Object.entries(errs({ pension: '', isaGrowth: '', charges: '3.5', brl: '12,000', hrl: '1', taxFree: 'ufpls', ufplsYears: '61' }))) expect(POTS.errors[k][e], k).toBeTypeOf('string');
    expect(potsPatch(plan, { pension: '' }, { today: TODAY }).patch).toEqual({});
  });
});

describe('T1 — the planner\'s own lists and rules, matched', () => {
  it('the bought strategies are the planner\'s; the choices are the planner\'s own values', () => {
    expect([...BOUGHT].sort()).toEqual([...BOUGHT_STRATEGIES].sort());
    expect(ISA_USES).toEqual([ISA_STRATEGIES.TAX_EFFICIENT, ISA_STRATEGIES.LONGEVITY, ISA_STRATEGIES.HOLD]);
    expect(ISA_GROWTHS).toEqual(['cash', 'invested']);
    expect(TAXABLE_MIXES).toEqual(['equity', 'gilt', 'bond', 'balanced', 'cash']);
    expect(GIA_BANDS).toEqual(['basic', 'higher']);
    expect(TAX_MODES).toEqual(['inflates', 'frozen']);
    expect(TAX_FREES).toEqual(['drawdown', 'ufpls']);
    expect(notUsedBy('pots-and-valves')).toEqual([]);
    expect(notUsedBy('buckets-in-order')).toEqual([]);
    for (const id of BOUGHT) expect(notUsedBy(id).length).toBeGreaterThan(0);
  });
  it('a total split in the saved shares adds back to the total, whatever the shares', () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 5000000 }), fc.integer({ min: 0, max: 1000 }), fc.integer({ min: 0, max: 1000 }), fc.integer({ min: 0, max: 1000 }), fc.integer({ min: 0, max: 1000 }), (total, e, b, c, d) => {
      const p = splitTotal(total, sharesOf({ equity: e, bond: b, cash: c, div: d }));
      expect(p.equity + p.bond + p.cash + p.div).toBe(total);
      expect(p.equity).toBeGreaterThanOrEqual(0); expect(p.bond).toBeGreaterThanOrEqual(0); expect(p.div).toBeGreaterThanOrEqual(0);
    }));
  });
});

/** Random typed boxes that pass the checks for a plan, as a person would type them. */
function validTyped(plan) {
  const s = savedPots(plan, { today: TODAY });
  const money = (max) => fc.integer({ min: 0, max }).map(String);
  const maybe = (arb) => fc.oneof(fc.constant(undefined), arb);
  return fc.record({
    pension: maybe(money(2000000)),
    stopSipp: s.later ? maybe(fc.oneof(fc.constant(''), fc.integer({ min: 1, max: 2000000 }).map(String))) : fc.constant(undefined),
    stopIsa: s.later ? maybe(fc.oneof(fc.constant(''), fc.integer({ min: 1, max: 500000 }).map(String))) : fc.constant(undefined),
    isa: maybe(money(500000)),
    isaGrowth: s.isaFunds ? fc.constant(undefined) : maybe(fc.constantFrom(...ISA_GROWTHS)),
    isaUse: maybe(fc.constantFrom(...ISA_USES)),
    taxable: maybe(money(300000)),
    taxableMix: maybe(fc.constantFrom(...TAXABLE_MIXES)),
    giaBand: maybe(fc.constantFrom(...GIA_BANDS)),
    earnings: maybe(money(100000)),
    bedAndIsa: maybe(fc.constantFrom('yes', 'no')),
    charges: maybe(fc.integer({ min: 0, max: 60 }).map((k) => (k * 0.05).toFixed(2))),
    pa: maybe(fc.integer({ min: 1, max: 20000 }).map(String)),
    brl: maybe(fc.integer({ min: 20001, max: 80000 }).map(String)),
    hrl: maybe(fc.integer({ min: 80001, max: 200000 }).map(String)),
    taxMode: maybe(fc.constantFrom(...TAX_MODES)),
    taxFree: maybe(fc.constantFrom(...TAX_FREES)),
    ufplsYears: maybe(fc.oneof(fc.constant(''), fc.integer({ min: 1, max: 60 }).map(String))),
    ufplsThenIsa: maybe(fc.constantFrom('yes', 'no')),
    bandFill: maybe(fc.constantFrom('yes', 'no'))
  }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
}

describe('T1 — properties: read∘write∘read is identity; only declared keys change; Undo puts the plan back exactly; the planner reads what the screen showed', () => {
  it('for random editable plans and random boxes', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped(plan).map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const c = checkPots(plan, typed, { today: TODAY });
      expect(c.errors).toEqual({});
      const p = potsPatch(plan, typed, { today: TODAY });
      expect(p.ok).toBe(true);
      for (const k of Object.keys(p.patch)) { expect(POTS_WRITES).toContain(k); expect(ABOUT_WRITES).not.toContain(k); expect(INCOME_WRITES).not.toContain(k); expect(SPEND_WRITES).not.toContain(k); }
      expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
      const after = applyPatch(plan, p.patch);
      expect(text(strip(after))).toBe(text(strip(plan)));
      // read again: every box holds what was typed (the saved value where nothing was typed)
      const read = savedPots(after, { today: TODAY });
      const bx = boxesOf(after, { today: TODAY });
      for (const [path, t] of Object.entries(typed)) {
        if (!c.applies[path]) continue;
        const f = POTS_FIELDS.find((x) => x.path === path);
        if (f.type === 'money') expect(bx[path] === undefined ? null : +bx[path], path).toBe(t === '' ? (f.default != null ? f.default : null) : +t);
        else if (f.type === 'count') expect(bx[path] === undefined ? null : +bx[path], path).toBe(t === '' ? null : +t);
        else if (f.type === 'percent') expect(+bx[path], path).toBe(normaliseChargesPct(+t));
        else expect(bx[path], path).toBe(t);
      }
      // the planner's own readers see the same
      const ss = effectiveStressSettings(after, { now: noon(TODAY) });
      expect(sippTodayOf(ss)).toBe(read.values.pension);
      expect(chargesPctOf(ss)).toBe(read.values.charges);
      expect(isaGrowthOf(ss)).toBe(read.values.isaGrowth);
      expect(bandsOf(ss)).toEqual({ pa: read.values.pa, brl: read.values.brl, hrl: read.values.hrl });
      const cfg = createSimulationConfigFromSettings({}, ss);
      expect(cfg.taxMode).toBe(read.values.taxMode);
      expect(cfg.accessMethod).toBe(read.values.taxFree);
      expect(cfg.bandFillRecycle).toBe(read.values.bandFill === 'yes');
      expect(cfg.bedAndIsa).toBe(read.values.bedAndIsa === 'yes');
      expect(cfg.taxableStart).toBe(read.values.taxable);
      expect(cfg.relevantEarnings).toBe(read.values.earnings);
      expect(cfg.isaDrawdownStrategy || 'minimiseEarlyTax').toBe(read.values.isaUse);
      // writing the read boxes again changes nothing; Undo: the previous values back, byte for byte
      expect(potsPatch(after, {}, { today: TODAY }).patch).toEqual({});
      expect(potsPatch(after, boxesOf(after, { today: TODAY }), { today: TODAY }).patch).toEqual({});
      expect(text(applyPatch(after, p.previous))).toBe(text(plan));
    }), { numRuns: 120 });
  });
});

describe('T1 — the stale-answer rule gains the pots when the record carries them', () => {
  const base = entryOf(SAVER).plan;
  const ss = base.stressTool.settings;
  const withAnswer = (extra = {}) => ({ ...JSON.parse(JSON.stringify(base)), lastModified: '2026-09-20T10:00:00.000Z', fromAnswer: { savedOn: '2026-09-20T10:00:00.000Z', answer: { lasted: 9 }, who: 'you', people: [{ who: 'you', ageToday: ss.currentAge, ageAtStop: ss.retireAge, years: ss.duration, stop: { kind: 'later', yearsFromNow: 4 }, ...extra }] } });
  const now = (p) => effectiveStressSettings(p, { now: noon(TODAY) });
  it('a record without pots is judged on the other facts; with them, a changed pension or ISA makes the answer older than its inputs; a £0 pension today seeded as the middling pot at the stop matches as the seed wrote it', () => {
    expect(answerAge(withAnswer(), now(withAnswer()))).toBe(null);
    const matching = withAnswer({ pension: { today: 221000, atStop: { careful: 250000, middling: 278542 } }, savings: { today: 9000, atStop: { careful: 9000, middling: 9955 } } });
    expect(answerAge(matching, now(matching))).toBe(null);
    const pot = applyPatch({ ...matching, lastModified: '2026-10-02T09:00:00.000Z' }, potsPatch(matching, { pension: '250,000' }, { today: TODAY }).patch);
    expect(answerAge(pot, now(pot))).toMatchObject({ diffs: ['pension'], changedOn: '2 October 2026' });
    expect(planPage([{ plan: pot }], pot.id, 'plan', { today: TODAY }).next.id).toBe('P.recheck');
    const isa = applyPatch({ ...matching, lastModified: '2026-10-02T09:00:00.000Z' }, potsPatch(matching, { isa: '10,000' }, { today: TODAY }).patch);
    expect(answerAge(isa, now(isa))).toMatchObject({ diffs: ['isa'] });
    // PlanSeed writes the middling pot at the stop as today's pots when today's was £0 on a plan stopping later
    const seededZero = withAnswer({ pension: { today: 0, atStop: { careful: 200000, middling: 221000 } }, savings: { today: 9000, atStop: { careful: 9000, middling: 9955 } } });
    expect(answerAge(seededZero, now(seededZero))).toBe(null);
  });
});

describe('T1 — the sub-step, the address and the plan page\'s section', () => {
  it('"pots" sits under "plan" beside the other three; the address parses and formats; the screen is plan.pots', () => {
    expect(SUB_STEPS.plan).toEqual(['about', 'income', 'spend', 'pots', 'lasts']);
    expect(ALL_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts']);
    expect(PLAN_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts']);
    const r = parse('#/plan/AboutPlan01/pots');
    expect(r).toEqual({ screen: 'plan', q: null, step: 'pots', planId: 'AboutPlan01', focus: null });
    expect(format(r)).toBe('#/plan/AboutPlan01/pots');
    expect(screenName(r)).toBe('plan.pots');
  });
  it('every corpus plan: the plan step\'s "Pots" section links to the step', () => {
    const entries = entriesAt(TODAY);
    for (const e of entries) {
      const pg = planPage(entries, e.plan.id, 'plan', { today: TODAY });
      const plan = pg.steps.find((s) => s.id === 'plan');
      expect(plan.sections.map((s) => s.id)).toEqual(['about', 'pays', 'pots', 'income', 'way']);
      const pots = plan.sections.find((s) => s.id === 'pots');
      expect(pots.href).toBe('#/plan/' + e.plan.id + '/pots');
      expect(pots.sub).toBe('pots');
      expect(pots.lines.length).toBeGreaterThan(0);
      for (const l of pots.lines) expect(PLAN.lines[l.id], l.id).toBeTypeOf('string');
    }
  });
  it('the fields and their words line up; the draft paths; the declared writes are the planner\'s Stress keys and nothing of the Decision settings', () => {
    for (const f of POTS_FIELDS) { expect(POTS.fields[f.path].label, f.path).toBeTypeOf('string'); expect(POTS.errors[f.path], f.path).toBeTruthy(); }
    for (const p of POTS_FIELDS.map((f) => f.path)) expect(isPotsPath(p), p).toBe(true);
    for (const p of ['pots', 'pension.x', 'equityMin', 'chargesPct', 'first.amount', 'steps.ids']) expect(isPotsPath(p), p).toBe(false);
    expect(isPlanEditPath('charges')).toBe(true);
    expect(isPlanEditPath('first.amount')).toBe(true);
    for (const p of POTS_WRITES) expect(p).toMatch(/^stressTool\.settings\.[a-zA-Z]+$/);
    expect(ALL_WRITES).toEqual([...new Set([...ABOUT_WRITES, ...INCOME_WRITES, ...SPEND_WRITES, ...POTS_WRITES, ...LASTS_WRITES, ...LOCK_WRITES, ...UNLOCK_WRITES, ...DOCUMENT_WRITES, 'lastModified'])]);
    expect(new Set(ALL_WRITES).size).toBe(ALL_WRITES.length);
  });
  it('a plan not in the list, and the partner link both ways', () => {
    expect(potsOf(entriesAt(TODAY), 'NoSuchPlan', { today: TODAY }).found).toBe(false);
    const { ladder, saver } = household();
    const entries = [entryOf(ladder), entryOf(saver)];
    expect(potsOf(entries, saver.id, { today: TODAY }).partners).toEqual([{ id: 'HouseLadder01', name: 'Ladder plan' }]);
    expect(potsOf(entries, ladder.id, { today: TODAY }).partners).toEqual([{ id: 'HouseSaver02', name: 'Saving plan' }]);
  });
});
