/**
 * L1 (research/v7/editing-in-v7.md 10.6): the pure reader and writer of "Does it last?", and the words of a result.
 *  - lastsOf on the 12 corpus plans × 3 dates; a plan as saved writes nothing; the dials are what the planner's own
 *    config builder reads; the lumpy plan's facts, a bought strategy's "not used", a locked plan's document figure;
 *  - read∘write∘read is identity over random editable plans and random typed boxes (fast-check): only LASTS_WRITES paths,
 *    every other byte unchanged, Undo byte for byte, a second write empty, the read-back equal to what was typed, and the
 *    written plan read by createSimulationConfigFromSettings shows what the screen showed;
 *  - absent keys stay absent when untouched, and gain a key only on a value the engine would read differently;
 *  - verdictOf and verdictWord over a made-up result: the words are OneAnswer's, yes/close/no at the bar, every row id
 *    and history row id has words; the run key moves with the stamp, the settings and the lock, and with nothing else;
 *  - the problems in their ids; a locked plan writes nothing; the sub-step, the address, the plan page's links.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { lastsOf, lastsPatch, applyPatch, boxesOf, savedLasts, checkLasts, runKeyOf, verdictOf, verdictWord, startRow, notUsedBy, cutPctOf, multOf, FAMILY, CONTRACT } from '../../../src/answers/plan/lasts.js';
import { LASTS_FIELDS, LASTS_WRITES, ALL_WRITES, ABOUT_WRITES, INCOME_WRITES, SPEND_WRITES, POTS_WRITES, isLastsPath, isPlanEditPath } from '../../../src/answers/plan/schema.js';
import { SUB_STEPS, ALL_SUB_STEPS } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { parse, format, screenName, PLAN_SUB_STEPS } from '../../../src/v7/router/routes.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { simulationConfigFromSettings } from '../../../src/services/SimulationConfig.js';
import { oneAnswer, futuresOutOfTen } from '../../../src/services/OneAnswer.js';
import { ON_COURSE_SHARE } from '../../../src/services/OnCourse.js';
import { BOUGHT_STRATEGIES } from '../../../src/ui/strategySettingsUse.js';
import { STRATEGY_NAMES } from '../../../src/strategies/stressTest.js';
import { LASTS } from '../../../src/v7/copy/lasts.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, household, DATES, TODAY, noon } from './_plans.js';

const C = corpus();
const strip = (plan) => { const out = JSON.parse(JSON.stringify(plan)); for (const p of ALL_WRITES) { const parts = p.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return out; };
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const EDITABLE = Object.values(C).filter((p) => !isLocked(p));
const LUMPY = C['12-lumpy-db-gia'];
const ROTATION = C['07-pre-6.13-flat-params'];
const LADDER = C['03-gilt-ladder-runup'];
const FRESH = C['01-fresh-default'];
const S = 'stressTool.settings.';
const KEYS = ['disableProtection', 'consecutiveLimit', 'protectionMult', 'protectionEscalateMonths', 'recoveryBuffer', 'hodlEnabled', 'hodlValue'];

/** A Pots & Valves result as stressTestStrategy returns it (the parts the words read), as tests/oneAnswer.test.js has it. */
const R = {
  strategyId: 'pots-and-valves', name: 'Pots & Valves', affordable: true,
  ruin: { hist: 0, mc: 4.1 }, n: { hist: 657, mc: 1000 }, coverage: 99.6,
  worst12: { min: 31000, median: 40000 }, terminal: { p10: 135978, p50: 1806699, p90: 4200000, histMedian: 1500000 },
  cones: { wealth: { p10: [1], p50: [1], p90: [1] }, income: { p10: [1], p50: [1], p90: [1] } },
  cuts: { futures: 1000, cutN: 190, cutPct: 19, ranOutN: 41, typicalCutPerYear: 4000, typicalCutYears: 3, typicalCutTotal: 12000, worstCutTotal: 31000 },
  guaranteedToAge: 'State Pension only (from age 67)'
};
const P = { durationYears: 39, startAge: 56, targetAnnual: 40000 };
const fakeResult = (strategyId = 'pots-and-valves', more = {}) => ({
  strategyId, ran: { family: FAMILY.includes(strategyId), cutsOn: FAMILY.includes(strategyId), cutPct: 20, months: 3 }, priced: FAMILY.includes(strategyId) ? null : 'bundled',
  a: oneAnswer({ ...R, strategyId, cuts: FAMILY.includes(strategyId) ? R.cuts : null }, P), reason: null,
  history: {
    worst: [{ year: 1929, month: 9, s: 704, failed: true, failAge: 84, terminal: 0, worst12: 31000, unfair: true }, { year: 1966, month: 1, s: 1140, failed: false, terminal: 20000, worst12: 33000, cutYears: 4, cutReal: 16000, unfair: true }],
    named: [{ year: 1929, label: 'the Great Depression', kind: 'pnv', available: true, failed: false, terminal: 240000, worst12: 31000, cutYears: 4, cutReal: 16000 }, { year: 2008, label: 'the 2008 crisis', kind: 'pnv', tooShort: true, lastStart: 1986, available: false }]
  },
  stored: null, basis: { today: TODAY, engine: 'one-test' }, ...more
});

describe('L1 — the reading, on every corpus plan at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: found, every field and derived line has words, a plan as saved writes nothing, the dials are what the planner's config reads, the run key is set`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const a = lastsOf(entries, e.plan.id, { today });
        expect(a.found).toBe(true);
        expect(a.fields.map((f) => f.path)).toEqual(LASTS_FIELDS.map((f) => f.path));
        for (const f of a.fields) { expect(LASTS.fields[f.path], f.path).toBeTruthy(); if (f.type === 'choice') for (const o of f.options) expect(LASTS.fields[f.path].options[o], `${f.path}.${o}`).toBeTypeOf('string'); }
        for (const d of a.derived) { expect(LASTS.derived[d.id], d.id).toBeTypeOf('string'); for (const v of Object.values(d.slots)) expect(v, d.id).not.toBeUndefined(); }
        expect(a.errors, e.plan.id).toEqual({});
        expect(a.patch, e.plan.id).toEqual({});
        expect(a.locked).toBe(isLocked(e.plan));
        expect(a.editable).toBe(!a.locked);
        expect(a.savedLine).toMatchObject({ id: expect.stringMatching(/^lasts(Off)?$/) });
        expect(a.runKey).toBe(runKeyOf(e.plan));
        expect(typeof a.runKey).toBe('string');
        expect(a.notUsed).toEqual(notUsedBy(a.strategyId));
        expect(a.family).toBe(FAMILY.includes(a.strategyId));
        // the dials are the planner's own reading: what createSimulationConfigFromSettings hands the engine
        const ss = effectiveStressSettings(e.plan, { now: noon(today) });
        const cfg = createSimulationConfigFromSettings({}, ss);
        const s = savedLasts(e.plan, { today });
        expect(s.values.cutsOn).toBe(cfg.disableProtection ? 'no' : 'yes');
        expect(s.values.cutAfterMonths).toBe(cfg.consecutiveLimit ?? 3);
        expect(s.values.cutPct).toBe(cutPctOf(cfg.protectionMult));
        expect(s.values.deeperAfterMonths).toBe(cfg.protectionEscalateMonths);
        expect(s.values.buffer).toBe(cfg.recoveryBuffer);
        expect(s.values.reserveOn).toBe(cfg.hodlEnabled ? 'yes' : 'no');
        // the end age the band says: the plan's start age and its length, the "About" step's own rule
        expect(s.endAge).toBe((s.timing.shapeAgeNow || 57) + (ss.duration || 35) - 1);
        // a locked plan carries its document's figure, read not run
        if (a.locked && e.plan.planDocument && e.plan.planDocument.strategy && e.plan.planDocument.strategy.r) {
          expect(a.document).not.toBe(null);
          expect(a.document.a.chancePct).toBe(oneAnswer(e.plan.planDocument.strategy.r, e.plan.planDocument.strategy.p).chancePct);
        }
      }
    });
  }
  it('the lumpy plan (12): cuts on, 3 months, 20%, half for 12 months, a £15,000 buffer, no reserve; the derived lines', () => {
    const s = savedLasts(entryOf(LUMPY).plan, { today: TODAY });
    expect(s.values).toEqual({ cutsOn: 'yes', cutAfterMonths: 3, cutPct: 20, deeperAfterMonths: 12, buffer: 15000, reserveOn: 'no', reserveAmount: 25000 });
    expect(boxesOf(entryOf(LUMPY).plan, { today: TODAY })).toEqual({ cutsOn: 'yes', cutAfterMonths: '3', cutPct: '20', deeperAfterMonths: '12', buffer: '15000', reserveOn: 'no', reserveAmount: '25000' });
    const v = lastsOf(entriesAt(TODAY), LUMPY.id, { today: TODAY });
    expect(v.derived.map((d) => d.id)).toEqual(['cuts.staged', 'reserve.off']);
    expect(v.derived[0].slots).toEqual({ months: '3', half: '10', first: '12', full: '20', buffer: '£15,000' });
    expect(v.fields.find((f) => f.path === 'reserveAmount').applies).toBe(false);
    expect(v.fields.find((f) => f.path === 'cutPct').applies).toBe(true);
    expect(v.notUsed).toEqual([]);
    expect(v.savedLine).toEqual({ id: 'lasts', slots: { pct: '20', months: '3', reserve: 'no reserve' } });
    expect(v.document).toBe(null);
  });
  it('a bought strategy (07, a gilt rotation): every dial says "not used", the derived line says why; a locked ladder (03): the document\'s figure, no write', () => {
    const r = lastsOf(entriesAt(TODAY), ROTATION.id, { today: TODAY });
    expect(r.bought).toBe(true);
    expect(r.notUsed).toEqual(LASTS_FIELDS.map((f) => f.path));
    expect(r.derived.map((d) => d.id)).toContain('notUsed.bought');
    const l = lastsOf(entriesAt(TODAY), LADDER.id, { today: TODAY });
    expect(l.locked).toBe(true);
    expect(l.editable).toBe(false);
    expect(l.document).toMatchObject({ lockedOn: '1 July 2026', ladder: true, ran: { family: false, cutsOn: false } });
    expect(l.document.a.chancePct).toBe(100);
    expect(lastsPatch(entryOf(LADDER).plan, { cutPct: '30' }, { today: TODAY })).toEqual({ ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} });
    expect(notUsedBy('pots-and-valves')).toEqual([]);
    expect(notUsedBy('buckets-in-order')).toEqual([]);
    for (const id of BOUGHT_STRATEGIES) expect(notUsedBy(id)).toEqual(LASTS_FIELDS.map((f) => f.path));
    expect([...FAMILY, ...BOUGHT_STRATEGIES].sort()).toEqual(Object.keys(STRATEGY_NAMES).sort());
    for (const id of CONTRACT) expect(BOUGHT_STRATEGIES).toContain(id);
  });
  it('a plan shown as saved is not run: no run key, read-only', () => {
    const entries = entriesAt(TODAY).map((e) => (e.plan.id === LUMPY.id ? { ...e, newer: true } : e));
    const v = lastsOf(entries, LUMPY.id, { today: TODAY });
    expect(v.readonly).toBe(true);
    expect(v.editable).toBe(false);
    expect(v.runKey).toBe(null);
  });
});

/** Random typed boxes a plan would accept. */
function validTyped() {
  const maybe = (arb) => fc.oneof(fc.constant(undefined), arb);
  return fc.record({
    cutsOn: maybe(fc.constantFrom('yes', 'no')),
    cutAfterMonths: maybe(fc.integer({ min: 1, max: 24 }).map(String)),
    cutPct: maybe(fc.integer({ min: 0, max: 95 }).map(String)),
    deeperAfterMonths: maybe(fc.integer({ min: 0, max: 60 }).map(String)),
    buffer: maybe(fc.integer({ min: 0, max: 1000000 }).map(String)),
    reserveOn: maybe(fc.constantFrom('yes', 'no')),
    reserveAmount: maybe(fc.integer({ min: 1, max: 5000000 }).map(String))
  }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
}

describe('L1 — properties: read∘write∘read is identity; only declared keys change; Undo puts the plan back exactly; the planner reads what the screen showed', () => {
  it('for random editable plans and random boxes', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped().map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const c = checkLasts(plan, typed, { today: TODAY });
      expect(c.errors).toEqual({});
      const p = lastsPatch(plan, typed, { today: TODAY });
      expect(p.ok).toBe(true);
      for (const k of Object.keys(p.patch)) { expect(LASTS_WRITES).toContain(k); expect(ABOUT_WRITES).not.toContain(k); expect(INCOME_WRITES).not.toContain(k); expect(SPEND_WRITES).not.toContain(k); expect(POTS_WRITES).not.toContain(k); }
      expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
      const written = applyPatch(plan, p.patch);
      // every other byte unchanged
      expect(JSON.stringify(strip(written))).toBe(JSON.stringify(strip(plan)));
      // the read-back equals what was typed, where the box applies
      const back = boxesOf(written, { today: TODAY });
      for (const f of LASTS_FIELDS) if (c.applies[f.path] && typed[f.path] !== undefined) expect(back[f.path], f.path).toBe(String(c.values[f.path]));
      // a second write is empty; Undo is byte for byte
      expect(lastsPatch(written, {}, { today: TODAY }).patch).toEqual({});
      expect(JSON.stringify(applyPatch(written, p.previous))).toBe(JSON.stringify(plan));
      // the planner's own config builder reads the written plan as the screen showed it
      const cfg = createSimulationConfigFromSettings({}, effectiveStressSettings(written, { now: noon(TODAY) }));
      const v = c.values;
      expect(!!cfg.disableProtection).toBe(v.cutsOn === 'no');
      if (c.applies.cutAfterMonths) {
        expect(cfg.consecutiveLimit).toBe(v.cutAfterMonths);
        expect(cutPctOf(cfg.protectionMult)).toBe(v.cutPct);
        expect(cfg.protectionEscalateMonths).toBe(v.deeperAfterMonths);
        expect(cfg.recoveryBuffer).toBe(v.buffer);
      }
      expect(!!cfg.hodlEnabled).toBe(v.reserveOn === 'yes');
      if (c.applies.reserveAmount) expect(cfg.hodlValue).toBe(v.reserveAmount);
      // the service and the repository's wrapper are the same function
      expect(simulationConfigFromSettings({}, effectiveStressSettings(written, { now: noon(TODAY) }))).toEqual(cfg);
    }), { numRuns: 150 });
  });
  it('the cut as a percent and the planner\'s multiplier round-trip on every whole percent', () => {
    for (let pct = 0; pct <= 95; pct++) expect(cutPctOf(multOf(pct))).toBe(pct);
    expect(multOf(20)).toBe(0.8);
    expect(multOf(15)).toBe(0.85);
    expect(cutPctOf(undefined)).toBe(20);
  });
  it('absent keys stay absent when untouched, and gain a key only on a value the engine would read differently', () => {
    const plan = entryOf(FRESH).plan;
    const bare = JSON.parse(JSON.stringify(plan));
    for (const k of KEYS) delete bare.stressTool.settings[k];
    expect(lastsPatch(bare, {}, { today: TODAY }).patch).toEqual({});
    expect(lastsPatch(bare, { cutPct: '20', cutAfterMonths: '3', deeperAfterMonths: '12', buffer: '15000', cutsOn: 'yes', reserveOn: 'no' }, { today: TODAY }).patch).toEqual({});
    expect(lastsPatch(bare, { cutPct: '30' }, { today: TODAY }).patch).toEqual({ [S + 'protectionMult']: 0.7 });
    expect(lastsPatch(bare, { cutsOn: 'no' }, { today: TODAY }).patch).toEqual({ [S + 'disableProtection']: true });
    expect(lastsPatch(bare, { reserveOn: 'yes', reserveAmount: '30,000' }, { today: TODAY }).patch).toEqual({ [S + 'hodlEnabled']: true, [S + 'hodlValue']: 30000 });
    // cuts off: the cut boxes are not written (the planner's boxes keep their values while "Disable Protection Mode" is ticked)
    expect(lastsPatch(bare, { cutsOn: 'no', cutPct: '30' }, { today: TODAY }).patch).toEqual({ [S + 'disableProtection']: true });
    // Undo on an absent key puts nothing back (the key is absent again)
    const p = lastsPatch(bare, { cutPct: '30' }, { today: TODAY });
    expect(p.previous).toEqual({ [S + 'protectionMult']: undefined });
    expect(JSON.stringify(applyPatch(applyPatch(bare, p.patch), p.previous))).toBe(JSON.stringify(bare));
  });
  it('the problems, in their ids', () => {
    const plan = entryOf(LUMPY).plan;
    const e = (typed) => checkLasts(plan, typed, { today: TODAY }).errors;
    expect(e({ cutAfterMonths: '0' })).toEqual({ cutAfterMonths: 'tooLow' });
    expect(e({ cutAfterMonths: '25' })).toEqual({ cutAfterMonths: 'tooHigh' });
    expect(e({ cutPct: 'abc' })).toEqual({ cutPct: 'notANumber' });
    expect(e({ cutPct: '96' })).toEqual({ cutPct: 'tooHigh' });
    expect(e({ cutPct: '' })).toEqual({ cutPct: 'required' });
    expect(e({ deeperAfterMonths: '61' })).toEqual({ deeperAfterMonths: 'tooHigh' });
    expect(e({ buffer: '2,000,000' })).toEqual({ buffer: 'tooHigh' });
    expect(e({ reserveOn: 'yes', reserveAmount: '' })).toEqual({ reserveAmount: 'required' });
    expect(e({ reserveOn: 'yes', reserveAmount: '0' })).toEqual({ reserveAmount: 'tooLow' });
    expect(e({ cutsOn: 'no', cutPct: 'abc' })).toEqual({});   // the cut boxes do not apply while cuts are off
    for (const [path, msgs] of Object.entries(LASTS.errors)) for (const id of Object.keys(msgs)) expect(typeof LASTS.errors[path][id]).toBe('string');
    expect(lastsPatch(plan, { cutPct: 'abc' }, { today: TODAY }).ok).toBe(false);
  });
});

describe('L1 — the words of a result, and the run key', () => {
  it('verdictWord: on course at the 9-in-10 bar, close from 85%, else not yet', () => {
    expect(ON_COURSE_SHARE).toBe(0.9);
    expect(verdictWord(1)).toBe('yes');
    expect(verdictWord(0.9)).toBe('yes');
    expect(verdictWord(0.899)).toBe('close');
    expect(verdictWord(0.85)).toBe('close');
    expect(verdictWord(0.849)).toBe('no');
    expect(verdictWord(0)).toBe('no');
    expect(verdictWord(NaN)).toBe('no');
  });
  it('verdictOf: the headline\'s words are OneAnswer\'s; the rows and the history rows have words; the figures are the planner\'s to the pound', () => {
    const saved = lastsOf(entriesAt(TODAY), LUMPY.id, { today: TODAY });
    const v = verdictOf(fakeResult(), saved);
    expect(v.ok).toBe(true);
    expect(v.verdict).toBe('yes');
    expect(v.slots.words).toBe(futuresOutOfTen(0.959).words);
    expect(v.slots.words).toBe('in more than 9 futures out of 10');
    expect(v.sub).toEqual({ id: 'lasts.sub', slots: { pct: '95.9', futures: '1,000', histories: '657', years: '39', toAge: String(saved.endAge) } });
    expect(v.rows.map((r) => r.id)).toEqual(['left', 'cuts.some', 'ran.cuts']);
    expect(v.rows[0].slots).toEqual({ typical: '£1,806,699', bad: '£135,978', good: '£4,200,000' });
    expect(v.rows[1].slots).toEqual({ n: '190', of: '1,000', ranOut: ' (41 of them later ran out)', perYear: '£4,000', years: '3', s: 's', total: '£12,000', worst: '£31,000' });
    expect(v.figures).toMatchObject({ chancePct: 95.9, typicalLeft: 1806699, badCaseLeft: 135978, goodCaseLeft: 4200000, futures: 1000, histories: 657, years: 39, cutN: 190, cutPerYear: 4000, cutYears: 3 });
    for (const r of v.rows) expect(LASTS.rows[r.id], r.id).toBeTypeOf('string');
    expect(LASTS.verdict[v.id]).toBeTypeOf('string');
    expect(LASTS.verdict[v.sub.id]).toBeTypeOf('string');
    expect(v.history.worst.map((r) => r.id)).toEqual(['hist.ranOut', 'hist.lastedCut']);
    expect(v.history.worst[0]).toMatchObject({ when: 'September 1929', unfair: true, lowest: '£31,000', left: '£0', slots: { age: '84' } });
    expect(v.history.named.map((r) => r.id)).toEqual(['hist.lastedCut', 'hist.tooShort']);
    expect(v.history.named[0]).toMatchObject({ when: '1929', label: 'the Great Depression', slots: { n: '4', s: 's', total: '£16,000' } });
    for (const r of [...v.history.worst, ...v.history.named]) expect(LASTS.history.rows[r.id], r.id).toBeTypeOf('string');
    // a bought strategy: no cuts row of its own, the bundled curve said; a contract strategy: its own sub line
    const b = verdictOf(fakeResult('ladder-and-ratchet'), saved);
    expect(b.rows.map((r) => r.id)).toEqual(['left', 'cuts.bought', 'ran.bundled']);
    const f = verdictOf(fakeResult('floor-and-flex'), saved);
    expect(f.rows.map((r) => r.id)).toEqual(['left', 'cuts.flex', 'ran.bundled']);
    const g = verdictOf(fakeResult('full-il-gilt'), saved);
    expect(g.sub.id).toBe('lasts.subContract');
    expect(g.history.contract).toBe(true);
    // the cuts switched off, as set
    const off = verdictOf(fakeResult('pots-and-valves', { ran: { family: true, cutsOn: false, cutPct: 20, months: 3 } }), saved);
    expect(off.rows.map((r) => r.id)).toEqual(['left', 'cuts.some', 'ran.cutsOff']);
    // not affordable: no figure, one sentence
    const u = verdictOf({ strategyId: 'ladder-and-ratchet', a: null, reason: 'the base ladder costs more than the pot' }, saved);
    expect(u.ok).toBe(false);
    expect(u.id).toBe('lasts.unaffordable');
    expect(verdictOf(null, saved)).toBe(null);
    // every verdict word has words, every history kind has words
    for (const w of ['yes', 'close', 'no']) expect(LASTS.verdict.word[w]).toBeTypeOf('string');
    for (const kind of [{ kind: 'contract' }, { kind: 'none' }, { kind: 'ladder', failed: true, failAge: 80, terminal: 0 }, { kind: 'ladder', secured: 1, terminal: 5 }, { kind: 'flex', worstYearFlex: 100, terminal: 5 }]) expect(LASTS.history.rows[startRow({ year: 1929, ...kind }).id]).toBeTypeOf('string');
  });
  it('the run key moves with the stamp, the Stress settings and the lock, and with nothing else', () => {
    const plan = entryOf(LUMPY).plan;
    const k = runKeyOf(plan);
    expect(k).toMatch(/^Yk7DvB4nQe9SxTg1LmCw\|2026-09-11T13:30:00\.000Z\|[0-9a-z]+\|U$/);
    expect(runKeyOf({ ...plan, lastModified: '2026-10-02T00:00:00.000Z' })).not.toBe(k);
    expect(runKeyOf({ ...plan, stressTool: { ...plan.stressTool, settings: { ...plan.stressTool.settings, protectionMult: 0.7 } } })).not.toBe(k);
    expect(runKeyOf({ ...plan, decisionTool: { ...plan.decisionTool, settings: { ...plan.decisionTool.settings, locked: true } } })).not.toBe(k);
    expect(runKeyOf({ ...plan, planDetails: { ...plan.planDetails, name: 'Another name' } })).toBe(k);
    expect(runKeyOf({ ...plan, budgetTool: { settings: { currentAge: 70 } } })).toBe(k);
    expect(runKeyOf(JSON.parse(JSON.stringify(plan)))).toBe(k);
    expect(runKeyOf(null)).toBe(null);
  });
});

describe('L1 — the sub-step, the address and the plan page\'s links', () => {
  it('"lasts" sits under "plan" beside the other four; the address parses and formats; the screen is plan.lasts', () => {
    expect(SUB_STEPS.plan).toEqual(['about', 'income', 'spend', 'pots', 'lasts']);
    expect(ALL_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts']);
    expect(PLAN_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts']);
    const r = parse('#/plan/abc/lasts');
    expect(r).toEqual({ screen: 'plan', q: null, step: 'lasts', planId: 'abc', focus: null });
    expect(format(r)).toBe('#/plan/abc/lasts');
    expect(screenName(r)).toBe('plan.lasts');
  });
  it('the fields and their words line up; the draft paths; the declared writes are the planner\'s Stress keys and nothing of the Decision settings', () => {
    for (const f of LASTS_FIELDS) { expect(LASTS.fields[f.path], f.path).toBeTruthy(); expect(isLastsPath(f.path)).toBe(true); expect(isPlanEditPath(f.path)).toBe(true); }
    expect(isLastsPath('pension')).toBe(false);
    expect(isLastsPath('cuts.0.pct')).toBe(false);
    for (const k of LASTS_WRITES) { expect(k.startsWith('stressTool.settings.')).toBe(true); expect(ALL_WRITES).toContain(k); }
    expect(LASTS_WRITES.map((k) => k.split('.')[2]).sort()).toEqual([...KEYS].sort());
    expect(ALL_WRITES).toEqual([...ABOUT_WRITES, ...INCOME_WRITES, ...SPEND_WRITES, ...POTS_WRITES, ...LASTS_WRITES, 'lastModified']);
    expect(new Set(ALL_WRITES).size).toBe(ALL_WRITES.length);
  });
  for (const today of DATES) {
    it(`every corpus plan at ${today}: the plan page carries the sub-step; an unlocked plan's step links into "Does it last?" (no hand-over to the run); a locked plan links too and keeps the planner's what-ifs`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const pg = planPage(entries, e.plan.id, 'plan', { today });
        expect(pg.subSteps.map((s) => s.id)).toContain('lasts');
        const step = pg.steps.find((s) => s.id === 'plan');
        const ids = step.buttons.map((b) => b.id);
        if (pg.locked) { expect(ids).toEqual(['openDocument', 'lastsLocked', 'testLocked']); expect(step.buttons[1].href).toBe('#/plan/' + e.plan.id + '/lasts'); }
        else { expect(ids).toEqual(['lasts']); expect(step.buttons[0].href).toBe('#/plan/' + e.plan.id + '/lasts'); expect(step.buttons[0].place).toBeUndefined(); }
        // the next sentence's button never hands over to the planner's run any more
        if (pg.next.button) expect(pg.next.button.place, pg.next.id).not.toBe('test');
        if (['P.draft', 'P.approaching', 'P.recheck'].includes(pg.next.id)) expect(pg.next.button.href).toBe('#/plan/' + e.plan.id + '/lasts');
      }
      expect(PLAN.buttons.lasts).toBe('Does it last?');
      expect(PLAN.buttons.recheck).toBe('Check it still lasts');
      expect(PLAN.buttons.lastsLocked).toBeTypeOf('string');
      expect(PLAN.next['P.draft']).not.toMatch(/planner/);
      expect(PLAN.next['P.approaching']).not.toMatch(/planner/);
    });
  }
  it('a plan shown as saved gets no link into the step; the partner link both ways', () => {
    const entries = entriesAt(TODAY).map((e) => (e.plan.id === LUMPY.id ? { ...e, newer: true } : e));
    expect(planPage(entries, LUMPY.id, 'plan', { today: TODAY }).steps.find((s) => s.id === 'plan').buttons).toEqual([]);
    const { ladder, saver } = household();
    const es = [entryOf(ladder), entryOf(saver)];
    expect(lastsOf(es, saver.id, { today: TODAY }).partners).toEqual([{ id: 'HouseLadder01', name: 'Ladder plan' }]);
    expect(lastsOf(es, ladder.id, { today: TODAY }).partners).toEqual([{ id: 'HouseSaver02', name: 'Saving plan' }]);
    expect(lastsOf(es, 'NoSuchPlan', { today: TODAY })).toEqual({ found: false, id: 'NoSuchPlan' });
  });
});
