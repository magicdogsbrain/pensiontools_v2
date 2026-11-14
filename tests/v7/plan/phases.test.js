/**
 * The three phases and the one review (7.10.0; spec-7100 §1, §2; services/Phases.js). Synthetic plans and the committed
 * corpus; every example is fictional (Alex, Sam).
 *
 *   - the constants, in one place, and the off-course line one twentieth below the plan's level;
 *   - phasesOf reads every plan in the corpus at three dates and writes nothing (each plan deep-frozen, byte-compared after);
 *   - ONE writer: phasesPatch starts from the root as stored, sets one part, appends to the history or the log and stamps
 *     `of`; the stored keys after are the keys before plus that part (a derived default is never written), and the
 *     agreement appears only after an agreement;
 *   - belonging: a 7.9.0 copy or successor (a JSON clone that keeps `phases` and `tasks`) reads as a 7.10.0 copy does;
 *   - copies, successors and opened files: the choices go, the agreement goes only to a successor that moves on, the
 *     reviews, the history and the dismissals never go.
 */
import { describe, it, expect } from 'vitest';
import {
  WINDOW, OFF_COURSE, REVIEW_FROM, REVIEW_LOG_MAX, TASKS_MAX, LIVING_REVIEW_AFTER, SAVING_LEVELS, PHASE_PARTS, HISTORY_WHATS,
  phasesOf, phasesPatch, windowOf, windowYearsOf, agreementOf, storedAgreementOf, belongsTo, phasesAsTheyBelong, phasesForCopy,
  defaultFloorOf, defaultRuleOf, planLevelOf, derivedLevelOf, ruleOrNull, strategyIdOf, addMonths
} from '../../../src/services/Phases.js';
import { planLevelOf as lifePlanLevelOf } from '../../../src/answers/plan/life.js';
import { LEVEL_FAILS20 } from '../../../src/answers/shared/rules.js';
import { copyOf } from '../../../src/services/PlanCopy.js';
import { successorOf } from '../../../src/services/PlanClose.js';
import { stageOf, deriveStage, journeyAppend } from '../../../src/services/LifeStage.js';
import { planStage } from '../../../src/services/PlanReading.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { corpus, entriesAt, entryOf, noon, DATES, TODAY } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const deepFreeze = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
const AT = '2026-10-02T12:00:00.000Z';
const AT2 = '2026-11-02T12:00:00.000Z';
/** Every leaf path of a value ('a.b.c'; an array is one leaf). */
const paths = (v, p = '') => (v && typeof v === 'object' && !Array.isArray(v) ? Object.entries(v).flatMap(([k, x]) => paths(x, p ? p + '.' + k : k)) : [p]);
const entry = (phase, at, more = {}) => ({ at, phase, documentAt: null, pots: null, entered: { pots: false, took: false }, took: null, choice: null, reading: null, guardrail: null, drift: null, maxDrift: null, ...more });

describe('the constants, in one place', () => {
  it('the window, off course, the first due day, the caps and the six-month rule', () => {
    expect(WINDOW).toEqual({ min: 1, max: 5, def: 3 });
    expect(OFF_COURSE).toEqual({ floors: [0.65, 0.70, 0.75, 0.80, 0.85, 0.90], drift: 0.20, step: 0.10, readings: 2 });
    expect(REVIEW_FROM).toBe('2027-04-06');
    expect(REVIEW_LOG_MAX).toBe(120);
    expect(TASKS_MAX).toBe(50);
    expect(LIVING_REVIEW_AFTER).toBe(6);
    expect(SAVING_LEVELS).toEqual(['cautious', 'balanced', 'adventurous']);
    expect(HISTORY_WHATS).toEqual(['window', 'saving.level', 'review.every', 'review.rule', 'moving.agreed', 'moving.withdrawn']);
    for (const x of [WINDOW, OFF_COURSE, OFF_COURSE.floors, SAVING_LEVELS, PHASE_PARTS]) expect(Object.isFrozen(x)).toBe(true);
  });
  it('the default line is one twentieth below the plan\'s level: careful .90, balanced .85, bold .65 — each one of the floors', () => {
    expect(defaultFloorOf('careful')).toBe(0.90);
    expect(defaultFloorOf('balanced')).toBe(0.85);
    expect(defaultFloorOf('bold')).toBe(0.65);
    for (const level of Object.keys(LEVEL_FAILS20)) {
      expect(OFF_COURSE.floors).toContain(defaultFloorOf(level));
      expect(Math.round(20 * (1 - defaultFloorOf(level)))).toBe(LEVEL_FAILS20[level] + 1);
    }
    const bold = { fromAnswer: { answer: { level: 'bold', levelChosen: true } } };
    expect(planLevelOf(bold)).toBe('bold');
    expect(defaultRuleOf(bold)).toEqual({ kind: 'success', floor: 0.65 });
    expect(defaultRuleOf({})).toEqual({ kind: 'success', floor: 0.85 });
    // one rule: life.js reads the plan's level from here
    expect(lifePlanLevelOf).toBe(planLevelOf);
  });
  it('a rule as stored is checked: a floor of the list (in twentieths), or the guardrails at their constants', () => {
    expect(ruleOrNull({ kind: 'success', floor: 0.8 })).toEqual({ kind: 'success', floor: 0.80 });
    expect(ruleOrNull({ kind: 'success', floor: 0.6 })).toBe(null);
    expect(ruleOrNull({ kind: 'success', floor: 0.81 })).toBe(null);
    expect(ruleOrNull({ kind: 'guardrails' })).toEqual({ kind: 'guardrails', drift: 0.20, step: 0.10 });
    expect(ruleOrNull({ kind: 'other' })).toBe(null);
    expect(ruleOrNull(null)).toBe(null);
  });
});

describe('phasesOf reads, and writes nothing', () => {
  for (const today of DATES) {
    it(`every plan in the corpus at ${today}: every part derived, nothing stored, the plan byte-identical after`, () => {
      for (const e of entriesAt(today)) {
        const before = JSON.stringify(e.plan);
        deepFreeze(e.plan);
        const ph = phasesOf(e.plan, { now: noon(today) });
        expect(JSON.stringify(e.plan), e.plan.id).toBe(before);
        expect(Object.values(ph.stored).some(Boolean), e.plan.id).toBe(false);
        expect(SAVING_LEVELS).toContain(ph.saving.strategy.level);
        expect(ph.moving.window.years).toBe(WINDOW.def);
        expect(ph.moving.agreed).toBe(null);
        expect(ph.review.every).toBe('year');
        expect(ph.review.rule).toEqual(defaultRuleOf(e.plan));
        expect(ph.drawing.strategyId).toBe(strategyIdOf(e.plan));
        expect(['before', 'inside', 'after', 'none']).toContain(ph.moving.window.state);
      }
    });
  }
  it('the saving level a plan is read at: the mix held, then the saving mix kept from an answer, then Balanced (shown only)', () => {
    expect(derivedLevelOf({})).toBe('balanced');
    expect(derivedLevelOf({ accumulationTool: { settings: { savingMix: { equity: 0.8, bond: 0.15, cash: 0.05 } } } })).toBe('adventurous');
    expect(derivedLevelOf({ accumulationTool: { settings: { savingMix: { equity: 0.3, bond: 0.5, cash: 0.2 } } } })).toBe('cautious');
    const held = { holdings: { lines: [{ ticker: 'VWRP', wrapper: 'SIPP', value: 100000 }] }, accumulationTool: { settings: { savingMix: { equity: 0.3, bond: 0.5, cash: 0.2 } } } };
    expect(derivedLevelOf(held)).toBe('adventurous');   // all in shares, before the saving mix
  });
  it('a saver\'s review falls as the check-in chose; any other phase once a year until the person chooses', () => {
    const p = { accumulationTool: { checkInEvery: 'quarter' } };
    expect(phasesOf(p, { phase: 'saving' }).review.every).toBe('quarter');
    expect(phasesOf(p, { phase: 'moving' }).review.every).toBe('year');
    expect(phasesOf({}, { phase: 'saving' }).review.every).toBe('year');
    expect(phasesOf({ phases: { review: { every: 'month' } } }, { phase: 'drawing' }).review.every).toBe('month');
  });
});

describe('the window (Phases.windowOf)', () => {
  const plan = (years) => (years ? { phases: { moving: { window: { years, at: AT } } } } : {});
  it('to the stop, its years back from it; before, inside, after; none with no stop month', () => {
    const now = new Date(2027, 3, 15, 12);
    expect(windowOf(plan(), { now, stop: '2030-01' })).toEqual({ years: 3, from: '2027-01', to: '2030-01', monthsLeft: 33, windowMonths: 36, state: 'inside' });
    expect(windowOf(plan(2), { now, stop: '2030-01' })).toMatchObject({ from: '2028-01', state: 'before', monthsLeft: 33, windowMonths: 24 });
    expect(windowOf(plan(), { now, stop: '2027-04' })).toMatchObject({ state: 'after', monthsLeft: 0 });
    expect(windowOf(plan(), { now, stop: '2027-05' })).toMatchObject({ state: 'inside', monthsLeft: 1 });
    expect(windowOf(plan(), { now, stop: null })).toEqual({ years: 3, from: null, to: null, monthsLeft: null, windowMonths: null, state: 'none' });
  });
  it('only a whole 1 to 5 is read as chosen; anything else is the default', () => {
    for (const bad of [0, 6, 2.5, '3', null]) expect(windowYearsOf(plan(bad))).toBe(3);
    for (const y of [1, 2, 3, 4, 5]) expect(windowYearsOf(plan(y))).toBe(y);
  });
  it('widened back to the earliest Moving review, never more than five years before the stop', () => {
    const now = new Date(2027, 3, 15, 12);
    const withLog = (at) => ({ phases: { moving: { window: { years: 1, at: AT } }, review: { log: [entry('moving', at), entry('drawing', '2020-01-01T00:00:00.000Z')] } } });
    expect(windowOf(withLog('2027-06-01T00:00:00.000Z'), { now, stop: '2030-01' }).from).toBe('2027-06');
    expect(windowOf(withLog('2023-06-01T00:00:00.000Z'), { now, stop: '2030-01' }).from).toBe('2025-01');
    expect(windowOf(withLog('2029-06-01T00:00:00.000Z'), { now, stop: '2030-01' }).from).toBe('2029-01');
    expect(addMonths('2030-01', -60)).toBe('2025-01');
  });
});

describe('ONE writer: phasesPatch from the root as stored', () => {
  const base = () => deepFreeze({ id: 'AlexPlan1', createdAt: '2026-05-01T09:00:00.000Z', stressTool: { settings: { strategyId: 'pots-and-valves' } }, accumulationTool: { settings: { savingMix: { equity: 0.8, bond: 0.15, cash: 0.05 } } } });
  const WRITES = [
    ['window', 4, ['moving.window.years', 'moving.window.at']],
    ['saving.level', 'adventurous', ['saving.strategy.level', 'saving.strategy.endTarget', 'saving.strategy.at']],
    ['review.every', 'quarter', ['review.every']],
    ['review.rule', { kind: 'success', floor: 0.75 }, ['review.rule.kind', 'review.rule.floor']],
    ['review.rule', { kind: 'guardrails' }, ['review.rule.kind', 'review.rule.drift', 'review.rule.step']],
    ['review.log', entry('drawing', AT), ['review.log']],
    ['moving.agreed', { strategyId: 'pots-and-valves', how: 'asHeld', heldPct: 82, entryAt: AT, entry: entry('moving', AT) }, ['moving.agreed.at', 'moving.agreed.strategyId', 'moving.agreed.how', 'moving.agreed.heldPct', 'moving.agreed.entryAt', 'review.log']]
  ];
  for (const [part, value, added] of WRITES) {
    it(`${part}: the keys after are the keys before plus that part, the ${part === 'review.log' ? 'log' : 'history'} and \`of\` — never a derived default`, () => {
      for (const start of [undefined, { of: '2026-05-01T09:00:00.000Z', review: { every: 'month' } }]) {
        const plan = deepFreeze({ ...base(), ...(start ? { phases: start } : {}) });
        const beforeKeys = start ? paths(start) : [];
        const { phases, ...rest } = phasesPatch(plan, part, value, { at: AT });
        expect(rest).toEqual({});
        const want = new Set([...beforeKeys, ...added, 'of', ...(part === 'review.log' ? [] : ['history'])]);
        expect(new Set(paths(phases))).toEqual(want);
        expect(phases.of).toBe(plan.createdAt);
        // the derived level (adventurous from the saving mix) is never written by any other part
        if (part !== 'saving.level') expect(phases.saving).toBeUndefined();
        if (part !== 'moving.agreed') expect(phases.moving && phases.moving.agreed).toBeUndefined();
        if (part !== 'review.log') expect(phases.history).toEqual([expect.objectContaining({ at: AT, what: part })]);
      }
    });
  }
  it('a choice notes what it was and what it became (null when nothing was chosen before)', () => {
    let plan = base();
    plan = { ...plan, ...phasesPatch(plan, 'window', 2, { at: AT }) };
    plan = { ...plan, ...phasesPatch(plan, 'window', 5, { at: AT2 }) };
    expect(plan.phases.history).toEqual([{ at: AT, what: 'window', from: null, to: 2 }, { at: AT2, what: 'window', from: 2, to: 5 }]);
    expect(plan.phases.moving.window).toEqual({ years: 5, at: AT2 });
  });
  it('the agreement: once agreed, withdrawn in one write that leaves the window, the log and the history', () => {
    let plan = { ...base(), ...phasesPatch(base(), 'window', 2, { at: AT }) };
    const agreed = phasesPatch(plan, 'moving.agreed', { strategyId: 'pots-and-valves', how: 'done', heldPct: 100, entryAt: AT2, entry: entry('moving', AT2) }, { at: AT2 });
    expect(agreed.phases.moving.agreed).toEqual({ at: AT2, strategyId: 'pots-and-valves', how: 'done', heldPct: 100, entryAt: AT2 });
    plan = { ...plan, ...agreed };
    const out = phasesPatch(plan, 'moving.withdrawn', null, { at: '2026-12-01T12:00:00.000Z' });
    expect(out.phases.moving).toEqual({ window: { years: 2, at: AT } });
    expect(out.phases.review.log).toHaveLength(1);
    expect(out.phases.history.map((h) => [h.what, h.from, h.to])).toEqual([['window', null, 2], ['moving.agreed', null, 'done'], ['moving.withdrawn', 'done', null]]);
    expect(() => phasesPatch({ ...plan, ...out }, 'moving.withdrawn', null, { at: AT })).toThrow(/no agreement/);
    // nothing to read from: no record, nothing readable
    expect(phasesPatch(base(), 'moving.agreed', { strategyId: 'pots-and-valves', how: 'nothing', heldPct: null, entryAt: AT }, { at: AT }).phases.moving.agreed.heldPct).toBe(null);
  });
  it('refuses what is not a choice, and needs the moment', () => {
    expect(() => phasesPatch(base(), 'window', 0, { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'window', 6, { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'saving.level', 'bold', { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'review.every', 'week', { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'review.rule', { kind: 'success', floor: 0.5 }, { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'moving.agreed', { strategyId: 'pots-and-valves', how: 'maybe' }, { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'drawing', 'x', { at: AT })).toThrow();
    expect(() => phasesPatch(base(), 'window', 3, {})).toThrow(/moment/);
  });
  it('the log keeps the last 120 entries', () => {
    const log = Array.from({ length: REVIEW_LOG_MAX }, (_, i) => entry('drawing', new Date(Date.UTC(2020, 0, 1 + i)).toISOString()));
    const plan = deepFreeze({ ...base(), phases: { of: base().createdAt, review: { log } } });
    const out = phasesPatch(plan, 'review.log', entry('drawing', AT), { at: AT }).phases.review.log;
    expect(out).toHaveLength(REVIEW_LOG_MAX);
    expect(out[0]).toEqual(log[1]);
    expect(out[out.length - 1].at).toBe(AT);
  });
  it('a plan with no createdAt is written with no `of`', () => {
    const { createdAt, ...noStamp } = base();
    void createdAt;
    expect('of' in phasesPatch(noStamp, 'window', 3, { at: AT }).phases).toBe(false);
  });
});

/** A plan with every root the phases have: the agreement, a review, a history line, a dismissal. */
function withRoots(raw, { strategyId = 'pots-and-valves' } = {}) {
  const p = copy(raw);
  p.phases = {
    of: p.createdAt,
    saving: { strategy: { level: 'adventurous', endTarget: 'drawdown', at: AT } },
    moving: { window: { years: 4, at: AT }, agreed: { at: AT, strategyId, how: 'asHeld', heldPct: 70, entryAt: AT } },
    review: { every: 'quarter', rule: { kind: 'success', floor: 0.75 }, log: [entry('moving', AT)] },
    history: [{ at: AT, what: 'window', from: null, to: 4 }]
  };
  p.tasks = { of: p.createdAt, dismissed: { 'month.record@2026-10': { at: AT, until: '2026-11' } } };
  return p;
}
/** What a 7.9.0 tab made of a copy: a JSON clone that keeps every root, with its own new createdAt. */
const copy790 = (p, createdAt) => ({ ...copy(p), id: 'Copy790Plan1', createdAt, isActive: false });

describe('belonging: a 7.9.0 copy or successor reads as a 7.10.0 copy does', () => {
  it('a root made on another plan: the agreement, the reviews and the history read as absent; the choices are kept', () => {
    const raw = withRoots(C['10-couple-b']);
    const foreign = { ...raw, createdAt: '2026-11-01T10:00:00.000Z' };
    expect(belongsTo(raw.phases, raw)).toBe(true);
    expect(belongsTo(foreign.phases, foreign)).toBe(false);
    expect(belongsTo(foreign.phases, { ...foreign, createdAt: undefined })).toBe(true);   // no createdAt: read as stored
    expect(belongsTo({ moving: {} }, foreign)).toBe(true);                                 // no `of`: read as stored
    const ph = phasesOf(foreign, { now: noon(TODAY) });
    expect(ph.belongs).toBe(false);
    expect(ph.moving.agreed).toBe(null);
    expect(ph.review.log).toEqual([]);
    expect(ph.history).toEqual([]);
    expect(ph.stored).toMatchObject({ saving: true, window: true, every: true, rule: true, agreed: false, log: false, history: false });
    expect(agreementOf(foreign)).toBe(null);
    expect(storedAgreementOf(foreign)).toBe(null);
    expect(agreementOf(raw)).toMatchObject({ how: 'asHeld' });
  });
  it('the next write drops what does not belong and stamps the plan\'s own `of`', () => {
    const foreign = deepFreeze({ ...withRoots(C['10-couple-b']), createdAt: '2026-11-01T10:00:00.000Z' });
    const out = phasesPatch(foreign, 'review.every', 'month', { at: AT2 }).phases;
    expect(out.of).toBe('2026-11-01T10:00:00.000Z');
    expect(out.moving).toEqual({ window: { years: 4, at: AT } });
    expect(out.review).toEqual({ every: 'month', rule: { kind: 'success', floor: 0.75 } });
    expect(out.history).toEqual([{ at: AT2, what: 'review.every', from: 'quarter', to: 'month' }]);
    expect(out.saving).toEqual(foreign.phases.saving);
  });
  it('an agreement carried on by a successor (carriedFrom = the plan it carries on) still counts there', () => {
    const p = withRoots(C['10-couple-b']);
    p.createdAt = '2026-11-01T10:00:00.000Z';
    p.before = { kind: 'plan', planId: 'OldPlanAlex', from: '2026-11' };
    p.phases.moving.agreed.carriedFrom = 'OldPlanAlex';
    expect(agreementOf(p)).toMatchObject({ carriedFrom: 'OldPlanAlex' });
    expect(phasesAsTheyBelong(p).review.log).toBeUndefined();
    p.phases.moving.agreed.carriedFrom = 'SomeOtherPlan';
    expect(agreementOf(p)).toBe(null);
  });
  for (const today of DATES) {
    it(`a 7.9.0 copy and a 7.9.0 successor give the stage, the phases and the due list a 7.10.0 copy gives (${today})`, () => {
      const pairs = [];
      // a saver with an agreement (10, unlocked), and a plan lived on (13, locked): copies
      for (const name of ['10-couple-b', '13-stopped-drawing-since']) {
        const src = withRoots(C[name], { strategyId: (C[name].stressTool.settings.strategyId) || 'pots-and-valves' });
        const stamp = '2026-11-01T10:00:00.000Z';
        const made = { ...copyOf(entryOf(src, today).plan, 'Copy', { carryHistory: true, now: noon(today) }), id: 'Copy710Plan1', createdAt: stamp, lastModified: stamp };
        pairs.push([copy790(src, stamp), made]);
      }
      // the successor of a plan lived on, made by a 7.9.0 tab: the copy's clone, every root kept, nothing carried by name
      const src = withRoots(C['13-stopped-drawing-since'], { strategyId: 'full-il-gilt' });
      const plan = entryOf(src, TODAY).plan;
      const next = successorOf(plan, { month: '2026-10', name: 'Next', now: noon(TODAY) });
      const stamp = '2026-11-01T10:00:00.000Z';
      const old = { ...copy(next), phases: copy(src.phases), tasks: copy(src.tasks), id: 'Copy790Plan1', createdAt: stamp };
      const made = { ...copyOf(entryOf({ ...copy(next), id: 'x', createdAt: src.createdAt }, today).plan, 'Copy', { carryHistory: true, now: noon(today) }), before: next.before, previousPlanId: next.previousPlanId, id: 'Copy710Plan1', createdAt: stamp };
      delete made.phases.moving.agreed;
      pairs.push([old, made]);
      for (const [a, b] of pairs) {
        const ea = entryOf(a, today), eb = entryOf(b, today);
        const now = noon(today);
        const sa = stageOf(ea.plan, now, { placing: planStage(ea.plan, { now }) }), sb = stageOf(eb.plan, now, { placing: planStage(eb.plan, { now }) });
        expect(sa).toEqual(sb);
        const pa = phasesOf(ea.plan, { now }), pb = phasesOf(eb.plan, { now });
        for (const k of ['saving', 'moving', 'drawing', 'review', 'history']) expect(pa[k], k).toEqual(pb[k]);
        const da = planPage([ea], ea.plan.id, null, { today }).due.map((d) => d.id), db = planPage([eb], eb.plan.id, null, { today }).due.map((d) => d.id);
        expect(da).toEqual(db);
      }
    });
  }
});

describe('copies, successors and opened files', () => {
  it('a copy keeps the person\'s choices and `of`, never the agreement, the reviews, the history or the dismissals', () => {
    const src = entryOf(withRoots(C['10-couple-b']), TODAY).plan;
    const c = copyOf(src, 'Copy', { now: noon(TODAY) });
    expect(c.phases).toEqual({ of: src.createdAt, saving: src.phases.saving, moving: { window: { years: 4, at: AT } }, review: { every: 'quarter', rule: { kind: 'success', floor: 0.75 } } });
    expect('tasks' in c).toBe(false);
    // only what does not travel: nothing of the root is left
    const bare = { ...copy(src), phases: { of: src.createdAt, moving: { agreed: src.phases.moving.agreed }, review: { log: [] }, history: [] } };
    expect('phases' in copyOf(bare, 'Copy', { now: noon(TODAY) })).toBe(false);
    expect(phasesForCopy(null)).toBe(null);
    // the source is never changed
    expect(src.phases.moving.agreed).toBeTruthy();
  });
  it('a successor (a move to a new plan) carries the agreement, marked with the plan it carries on; back to work carries none', () => {
    const plan = entryOf(withRoots(C['13-stopped-drawing-since'], { strategyId: 'full-il-gilt' }), TODAY).plan;
    const next = successorOf(plan, { month: '2026-10', name: 'Next', now: noon(TODAY) });
    expect(next.phases.moving.agreed).toEqual({ ...plan.phases.moving.agreed, carriedFrom: plan.id });
    expect(next.phases.review).toEqual({ every: 'quarter', rule: { kind: 'success', floor: 0.75 } });
    expect(next.phases.history).toBeUndefined();
    expect('tasks' in next).toBe(false);
    // made later, with its own createdAt: the carried agreement still counts there, and nothing else of the old plan's reviews
    const made = { ...next, id: 'NextPlanAlex', createdAt: '2026-10-02T12:00:00.000Z' };
    expect(agreementOf(made)).toMatchObject({ carriedFrom: plan.id, strategyId: 'full-il-gilt' });
    // an agreement made on a plan for another strategy does not count, and is still carried as made
    const other = entryOf(withRoots(C['13-stopped-drawing-since'], { strategyId: 'pots-and-valves' }), TODAY).plan;
    expect(agreementOf(other)).toBe(null);
    expect(successorOf(other, { month: '2026-10', name: 'Next', now: noon(TODAY) }).phases.moving.agreed.strategyId).toBe('pots-and-valves');
    // a plan with no phases: nothing made up
    expect('phases' in successorOf(entryOf(C['13-stopped-drawing-since'], TODAY).plan, { month: '2026-10', name: 'Next', now: noon(TODAY) })).toBe(false);
  });
  it('back to work: the choices only', () => {
    const plan = entryOf(withRoots(C['13-stopped-drawing-since'], { strategyId: 'full-il-gilt' }), TODAY).plan;
    const next = successorOf(plan, { month: '2026-11', name: 'Saving again', now: noon(TODAY), reason: 'working', stop: { age: 66 } });
    expect(next.phases.moving).toEqual({ window: { years: 4, at: AT } });
    expect('tasks' in next).toBe(false);
  });
});

/**
 * The stage on the window and the agreement (spec-7100 §2): the truth table, on synthetic plans (Alex and Sam, fictional).
 * Every cell is deep-frozen and byte-compared after: reading the stage writes nothing, and deriveStage's placing is the
 * same with or without the agreement.
 */
describe('the stage: agreements first, then facts — the truth table, and not one cell writes', () => {
  const NOW = new Date(2027, 5, 15, 12);
  const CREATED = '2026-01-10T10:00:00.000Z';
  const sc = (stress, decision = {}, extra = {}) => ({ id: 'AlexTable1', createdAt: CREATED, stressTool: { settings: { strategyId: 'pots-and-valves', ...stress } }, decisionTool: { settings: decision, history: [], taxYears: {} }, ...extra });
  // the columns: the window's state on the stop (3 years, the default)
  const COLUMNS = {
    before: [sc({ currentAge: 58, currentAgeAsOf: '2027-06-15', retired: false, retireAge: 63 })],                       // stops June 2032
    inside: [sc({ currentAge: 61, currentAgeAsOf: '2027-06-15', retired: false, retireAge: 63 })],                       // stops June 2029
    'after, locked or retired': [
      sc({ currentAge: 62, currentAgeAsOf: '2026-03-10', retired: false, retireAge: 63 }, { locked: true }),             // stopped March 2027, locked
      sc({ currentAge: 64, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026, stoppedWork: '2026-09' }),   // retired, stopped September 2026
      sc({ currentAge: 64, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026, stoppedWork: '2026-09' }, { locked: true })
    ],
    'after, unlocked': [sc({ currentAge: 62, currentAgeAsOf: '2026-03-10', retired: false, retireAge: 63 })],            // future timing, never said it stopped
    none: [
      sc({ currentAge: 64, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026 }),                          // draft-retired, no stop month
      sc({ currentAge: 64, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026 }, { locked: true })         // running, no stop month
    ]
  };
  const agreed = (strategyId) => ({ of: CREATED, moving: { agreed: { at: '2027-05-01T12:00:00.000Z', strategyId, how: 'asHeld', heldPct: 80, entryAt: '2027-05-01T12:00:00.000Z' } } });
  const M = [{ date: '2027-05-12T19:00:00.000Z', taxYear: '27/28', monthlyNet: 1800 }];
  const ROWS = {
    'A, M': { phases: agreed('pots-and-valves'), months: true },
    'A, no M': { phases: agreed('pots-and-valves'), months: false },
    'A for another strategy, M': { phases: agreed('buckets-in-order'), months: true },
    'A for another strategy, no M': { phases: agreed('buckets-in-order'), months: false },
    'none, M': { phases: null, months: true },
    'none, no M': { phases: null, months: false }
  };
  // [key, by, confirmStop] — "drawing·agreement" is ['drawing', 'agreement', false]
  const D = ['drawing', 'facts', false], DA = ['drawing', 'agreement', false], MA = ['moving', 'agreement', false], MF = ['moving', 'facts', false], S = ['saving', 'facts', false], MC = ['moving', 'facts', true];
  const TABLE = {
    'A, M':                         { before: D, inside: D, 'after, locked or retired': DA, 'after, unlocked': DA, none: DA },
    'A, no M':                      { before: MA, inside: MA, 'after, locked or retired': DA, 'after, unlocked': DA, none: DA },
    'A for another strategy, M':    { before: D, inside: D, 'after, locked or retired': D, 'after, unlocked': D, none: D },
    'A for another strategy, no M': { before: S, inside: MF, 'after, locked or retired': D, 'after, unlocked': MC, none: D },
    'none, M':                      { before: D, inside: D, 'after, locked or retired': D, 'after, unlocked': D, none: D },
    'none, no M':                   { before: S, inside: MF, 'after, locked or retired': D, 'after, unlocked': MC, none: D }
  };
  const build = (base, row) => {
    const p = copy(base);
    if (row.phases) p.phases = copy(row.phases);
    if (row.months) p.decisionTool.history = copy(M);
    return deepFreeze(p);
  };
  /** The stage, with the plan byte-compared after and deriveStage's placing unchanged by the agreement. */
  const read = (plan, now = NOW, o = {}) => {
    const before = JSON.stringify(plan);
    const st = stageOf(plan, now, o);
    expect(JSON.stringify(plan)).toBe(before);
    // the agreement never moves the placing (the window, a choice, does: one clock)
    const bare = copy(plan);
    if (bare.phases && bare.phases.moving) delete bare.phases.moving.agreed;
    expect(deriveStage(plan, now).key).toBe(deriveStage(bare, now).key);
    return st;
  };
  for (const [row, cells] of Object.entries(TABLE)) {
    for (const [col, want] of Object.entries(cells)) {
      it(`${row} × ${col} → ${want[0]}${want[1] === 'agreement' ? '·agreement' : ''}${want[2] ? '·confirmStop' : ''}`, () => {
        for (const base of COLUMNS[col]) {
          const st = read(build(base, ROWS[row]));
          expect([st.key, st.by, st.confirmStop], JSON.stringify(base.stressTool.settings) + JSON.stringify(base.decisionTool.settings)).toEqual(want);
          // the window is said only with a stop month; the agreement only when it counts
          if (col === 'none') expect(st.window).toBe(null); else expect(st.window.state).toBe(col.startsWith('after') ? 'after' : col);
          expect(st.agreed != null).toBe(ROWS[row].phases != null && row.startsWith('A,'));
        }
      });
    }
  }
  const saver = (extra = {}) => sc({}, {}, { accumulationTool: { settings: { currentAge: 60, retirementAge: 62 } }, ...extra });
  it('a saver placed by the Accumulation tab\'s ages (no date: state none): Saving; with an agreement Moving by agreement; a month recorded, Drawing', () => {
    expect(deriveStage(saver(), NOW).fromAccumulation).toBe(true);
    const plain = read(deepFreeze(saver()));
    expect([plain.key, plain.window]).toEqual(['saving', null]);
    expect(read(build(saver(), ROWS['A, no M']))).toMatchObject({ key: 'moving', by: 'agreement', window: null, confirmStop: false });
    expect(read(build(saver(), ROWS['A, M']))).toMatchObject({ key: 'drawing', by: 'facts' });
    expect(read(build(saver(), ROWS['none, M']))).toMatchObject({ key: 'drawing', by: 'facts' });
  });
  it('the three cells more: closed × A is closed, unknown × A is none, and a plan closing ahead keeps its stage', () => {
    const closed = build({ ...COLUMNS['after, locked or retired'][0], closedAt: '2027-03', nextPlanId: 'NextPlanAlex' }, ROWS['A, no M']);
    expect(read(closed)).toMatchObject({ key: 'closed', agreed: null, by: 'facts' });
    const unknown = build(sc({}), ROWS['A, no M']);
    expect(deriveStage(unknown, NOW).key).toBe('unknown');
    expect(read(unknown)).toMatchObject({ key: null, agreed: null });
    const closing = build({ ...COLUMNS.inside[0], closedAt: '2027-12', nextPlanId: 'NextPlanAlex' }, ROWS['A, no M']);
    expect(read(closing)).toMatchObject({ key: 'moving', by: 'agreement' });
    const closingFacts = build({ ...COLUMNS['after, locked or retired'][0], closedAt: '2027-12', nextPlanId: 'NextPlanAlex' }, ROWS['none, no M']);
    expect(read(closingFacts)).toMatchObject({ key: 'drawing', by: 'facts' });
  });
  it('an agreement that does not belong to the plan (a 7.9.0 copy\'s) reads as none, in every column', () => {
    for (const [col, bases] of Object.entries(COLUMNS)) for (const base of bases) {
      const foreign = build({ ...base, createdAt: '2027-02-01T10:00:00.000Z' }, ROWS['A, no M']);
      const none = build(base, ROWS['none, no M']);
      const a = read(foreign), b = read(none);
      expect([a.key, a.by, a.confirmStop], col).toEqual([b.key, b.by, b.confirmStop]);
    }
  });
  it('the window follows the person\'s choice: Sam, stopping in 48 months, reads Saving at 3 years and Moving at 5', () => {
    const sam = sc({ currentAge: 62, currentAgeAsOf: '2027-06-15', retired: false, retireAge: 66 });
    expect(read(deepFreeze(sam)).key).toBe('saving');
    const five = deepFreeze({ ...copy(sam), phases: { of: CREATED, moving: { window: { years: 5, at: '2027-06-01T12:00:00.000Z' } } } });
    const st = read(five);
    expect(st).toMatchObject({ key: 'moving', by: 'facts', window: { years: 5, from: '2026-06', to: '2031-06', monthsLeft: 48, state: 'inside' } });
    expect(st.since).toBe('2026-06');
    // two years on, the clock inside the default window: 24 months left, no agreement
    expect(read(deepFreeze(sam), new Date(2029, 5, 15, 12))).toMatchObject({ key: 'moving', window: { monthsLeft: 24, state: 'inside' } });
  });
  for (const today of DATES) {
    it(`the corpus at ${today}: only 10 (2027) and 19-saving change word, to Moving; nothing is written`, () => {
      for (const e of entriesAt(today)) {
        const before = JSON.stringify(e.plan);
        const st = stageOf(e.plan, noon(today), { placing: planStage(e.plan, { now: noon(today) }) });
        expect(JSON.stringify(e.plan)).toBe(before);
        expect(st.by).toBe('facts');
        expect(st.agreed).toBe(null);
        const name = Object.keys(C).find((k) => C[k].id === e.plan.id);
        const moving = (name === '10-couple-b' && today !== '2026-10-02') || name === '19-back-to-work-saving';
        expect(st.key === 'moving', name).toBe(moving);
      }
    });
  }
});

/**
 * The classic page records the journey when the stage changes on open (index.html refreshLifeStage). Saving and approaching
 * are one stage there now, so no window — the default, or any the person chooses — and no release or rollback makes it
 * write a journey entry 7.9.0 did not (spec-7100 §2).
 */
describe('the classic journey: no window makes the planner write on open', () => {
  const old790 = (journey, stage) => { const last = journey[journey.length - 1]; const lastKey = last && last.stage === 'bridge' ? 'running' : last && last.stage; return !(last && lastKey === stage.key); };
  for (const today of ['2026-10-02', '2027-04-06', '2029-06-15', '2033-01-10']) {
    it(`every plan in the corpus at ${today}, with no window and with each of 1 to 5 years stored`, () => {
      const now = noon(today);
      for (const raw of Object.values(C)) {
        const decisions = [];
        for (const years of [null, 1, 2, 3, 4, 5]) {
          const r = copy(raw);
          if (years) r.phases = { of: r.createdAt, moving: { window: { years, at: AT } } };
          const plan = entryOf(r, today).plan;
          const j = Array.isArray(plan.journey) ? plan.journey : [];
          const stage = planStage(plan, { now });
          const writes = journeyAppend(j, stage, now) !== j;
          decisions.push(writes);
          // a write now is one 7.9.0 also made (its journey told saving and approaching apart, so it wrote more, never less)
          if (writes) expect(old790(j, stage), raw.id).toBe(true);
        }
        expect(new Set(decisions).size, raw.id).toBe(1);
      }
    });
  }
  it('saving and approaching are one stage; a real change after either is still recorded', () => {
    const at = new Date(2027, 0, 1);
    expect(journeyAppend([{ stage: 'saving' }], { key: 'approaching', label: 'Approaching retirement' }, at)).toEqual([{ stage: 'saving' }]);
    expect(journeyAppend([{ stage: 'approaching' }], { key: 'saving', label: 'Saving' }, at)).toEqual([{ stage: 'approaching' }]);
    expect(journeyAppend([{ stage: 'approaching' }], { key: 'committed-saving', label: 'Committed, still saving' }, at, 'lock')).toHaveLength(2);
    expect(journeyAppend([{ stage: 'bridge' }], { key: 'running', label: 'Running the plan' }, at)).toEqual([{ stage: 'bridge' }]);
  });
});
