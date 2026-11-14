/**
 * The review's runs (7.10.0; spec-7100 §3.3, §4.4): only on a press, in the worker's stress lane, never written but as the
 * reading a saved review keeps — and only when it was run on what is being saved (its key). Fictional plans only (Alex).
 *
 *   - the held row `whole`: the pension as held, whole; with no keeps the four pots move.js heldMixSettings gives; the default
 *     leaves every 7.9.0 row as it was;
 *   - the run-only settings of 'today' (reviewSettingsOf): the pots entered in the plan's own proportions, from today; never in
 *     a plan, a document or a review entry;
 *   - the rows a press runs, the key they are held under, what they say; a reading kept only for its own inputs;
 *   - the runner: on a press only, each row's env, stopped when the page leaves;
 *   - off course on the home: two saved reviews below the line, never one; nothing written on open.
 */
import { describe, it, expect } from 'vitest';
import { heldSettingsOf } from '../../../src/answers/plan/keepTest.js';
import { heldMixSettings } from '../../../src/answers/plan/move.js';
import { reviewOf, reviewSettingsOf, reviewSavePatch, savedReadingOf, readingOf, runInputsOf, reviewRunKeyOf, documentReadingOf } from '../../../src/answers/plan/review.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { normaliseHoldings } from '../../../src/services/HoldingsRecord.js';
import { POTS_TODAY } from '../../../src/services/PlanFromToday.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { startReviewRunner, rowEnv } from '../../../src/v7/effects/review.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { parse } from '../../../src/v7/router/routes.js';
import { WEIGHT_ONE } from '../../../src/answers/shared/rules.js';
import { corpus, entryOf, entriesAt, noon, stateWith } from './_plans.js';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const DAY = '2026-10-02';
const POTS = ['equityMin', 'bondMin', 'cashTarget', 'diversifierStart'];
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
// Alex's pension, as a platform lists it: a LifeStrategy 60, gold, a world tracker
const ALEX = [
  { wrapper: 'SIPP', ticker: 'VLS60', name: 'Vanguard LifeStrategy 60% Equity', value: 100000 },
  { wrapper: 'SIPP', ticker: 'SGLN', name: 'iShares Physical Gold', value: 10000 },
  { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', value: 50000 }
];
/** A run's result as runStressRow gives it, with the figures a reading keeps. */
const result = ({ weighted = 0.9, fixedAge = 0.85, n = 1000, age = 95, left = 120000 } = {}) => ({ id: 'x', key: 'k', runs: 1, na: null, a: { weighted, sumW: Math.round((1 - weighted) * n * WEIGHT_ONE), n, fixedAge, futures: n, planToAge: age, typicalLeft: left }, shortfall: { when: null } });

describe('the held row, whole', () => {
  it('with no keeps it is the pots heldMixSettings gives; the default leaves the settings as they are', () => {
    for (const lines of [null, ALEX]) {
      const raw = copy(C['19-back-to-work-saving']);
      if (lines) raw.holdings = { lines, updatedAt: '2026-09-30' };
      const plan = entryOf(raw, DAY).plan;
      const s = effectiveStressSettings(plan, { now: noon(DAY) });
      const rec = normaliseHoldings(plan.holdings);
      const whole = heldSettingsOf(s, rec, { now: noon(DAY), whole: true });
      const mix = heldMixSettings(plan, { today: DAY });
      for (const k of POTS) expect(whole[k], k).toBe(mix.settings[k]);
      // nothing kept, not whole: the settings as they were (7.9.0)
      const before = heldSettingsOf(s, rec, { now: noon(DAY) });
      for (const k of POTS) expect(before[k], k).toBe(s[k]);
    }
  });
  it('Alex\'s record is read in its parts: the LifeStrategy 60 split, the gold as other investments', () => {
    const raw = copy(C['19-back-to-work-saving']);
    raw.holdings = { lines: ALEX, updatedAt: '2026-09-30' };
    const plan = entryOf(raw, DAY).plan;
    const s = effectiveStressSettings(plan, { now: noon(DAY) });
    const w = heldSettingsOf(s, normaliseHoldings(plan.holdings), { now: noon(DAY), whole: true });
    const T = POTS.reduce((t, k) => t + s[k], 0);
    expect(POTS.reduce((t, k) => t + w[k], 0)).toBe(T);
    expect(w.equityMin / T).toBeCloseTo(110 / 160, 3);
    expect(w.bondMin / T).toBeCloseTo(40 / 160, 3);
    expect(w.diversifierStart / T).toBeCloseTo(10 / 160, 3);
  });
});

describe('the run-only settings of a Living-on-it review', () => {
  it('the pots entered, in the plan\'s own proportions, from today; the plan untouched', () => {
    const plan = entryOf(copy(C['04-buckets-running']), DAY).plan;
    const before = JSON.stringify(plan);
    const s0 = effectiveStressSettings(plan, { now: noon(DAY) });
    const s = reviewSettingsOf(plan, { pots: { pension: 500000, isa: 20000, other: 5000 }, today: DAY });
    expect(POTS.reduce((t, k) => t + s[k], 0)).toBe(500000);
    const T0 = POTS.reduce((t, k) => t + s0[k], 0);
    expect(s.equityMin / 500000).toBeCloseTo(s0.equityMin / T0, 4);
    expect(s).toMatchObject({ isaBalance: 20000, taxableStart: 5000, potsAsOf: POTS_TODAY });
    expect(JSON.stringify(plan)).toBe(before);
  });
  it('never saved: a review entry keeps its reading only — no settings, no position', () => {
    const day = '2027-04-06';
    const plan = entryOf(copy(C['04-buckets-running']), day).plan;
    const typed = { 'rv.pension': '600000' };
    const key = reviewRunKeyOf(plan, day, runInputsOf(plan, { today: day, typed, phase: 'drawing' }));
    const held = { key, planId: String(plan.id), status: 'done', order: ['today'], rows: { today: result() }, pots: { pension: 600000, isa: 0, other: 0 }, reason: null };
    const p = reviewSavePatch(plan, { today: day, typed, at: '2027-04-06T10:00:00.000Z', held });
    expect(Object.keys(p.entry.reading).sort()).toEqual(['fixedAge', 'key', 'n', 'source', 'sumW', 'typicalLeft', 'weighted']);
    const text = JSON.stringify(p.patch);
    for (const never of ['potsAsOf', 'equityMin', 'isaBalance', 'strategyParams', 'settings']) expect(text).not.toContain(never);
  });
});

describe('the rows a press runs, their key, and what they say', () => {
  it('Moving runs as planned then what is held, whole; Living on it from today; a locked ladder none; a saver none', () => {
    const es = entriesAt(DAY);
    const mv = reviewOf(es, C['19-back-to-work-saving'].id, { today: DAY });
    expect(mv.run).toMatchObject({ rows: ['asPlanned', 'whole'], label: 'held', pots: null });
    const lv = reviewOf(es, C['04-buckets-running'].id, { today: DAY });
    expect(lv.run).toMatchObject({ rows: ['today'], label: 'today', pots: { pension: 587700, isa: 0, other: 0 } });
    const ladder = reviewOf(es, C['03-gilt-ladder-locked'].id, { today: DAY });
    expect(ladder.run).toBe(null);
    expect(ladder.documentReading).toBe(true);
    expect(reviewOf(es, C['05-saver-committed'].id, { today: DAY }).run).toBe(null);
    // the key moves with what is typed: a run on other pots is not this page's
    const lv2 = reviewOf(es, C['04-buckets-running'].id, { today: DAY, typed: { 'rv.pension': '400000' } });
    expect(lv2.run.key).not.toBe(lv.run.key);
  });

  it('what is held for this key is said; for another key, nothing', () => {
    const es = entriesAt(DAY);
    const id = C['19-back-to-work-saving'].id;
    const R0 = reviewOf(es, id, { today: DAY });
    const held = { key: R0.run.key, planId: String(id), status: 'done', order: ['asPlanned', 'whole'], rows: { asPlanned: result({ weighted: 0.95 }), whole: result({ weighted: 0.85 }) }, pots: null, reason: null };
    const R = reviewOf(es, id, { today: DAY, held });
    expect(R.result).toMatchObject({ status: 'done', id: 'held', slots: { chance: '17 times in 20', ref: '19 times in 20', fixed: 'in 17 of 20 futures we tried', age: '95', left: '£120,000' } });
    expect(reviewOf(es, id, { today: DAY, held: { ...held, key: 'another' } }).result).toEqual({ status: 'idle' });
    expect(reviewOf(es, id, { today: DAY, held: { ...held, status: 'working', rows: { asPlanned: result() } } }).result).toMatchObject({ status: 'working', done: 1, total: 2 });
  });

  it('a reading is kept only with the inputs it was run on: changed pots after the run save none', () => {
    const day = '2027-04-06';
    const plan = entryOf(copy(C['04-buckets-running']), day).plan;
    const typed = { 'rv.pension': '600000' };
    const key = reviewRunKeyOf(plan, day, runInputsOf(plan, { today: day, typed, phase: 'drawing' }));
    const held = { key, planId: String(plan.id), status: 'done', order: ['today'], rows: { today: result() }, pots: null, reason: null };
    expect(savedReadingOf(plan, { today: day, typed, phase: 'drawing', held })).toMatchObject({ source: 'run', key, weighted: 0.9, fixedAge: { lasts: 850, n: 1000, age: 95 } });
    expect(savedReadingOf(plan, { today: day, typed: { 'rv.pension': '610000' }, phase: 'drawing', held })).toBe(null);
    expect(reviewSavePatch(plan, { today: day, typed: { 'rv.pension': '610000' }, at: '2027-04-06T10:00:00.000Z', held }).entry.reading).toBe(null);
    // a locked ladder keeps its document's own reading, which never counts for off course
    const ladder = entryOf(copy(C['03-gilt-ladder-locked']), day).plan;
    expect(savedReadingOf(ladder, { today: day, phase: 'drawing', held: null })).toMatchObject({ source: 'document' });
    expect(documentReadingOf(ladder).source).toBe('document');
    expect(readingOf({ na: 'unaffordable' }, 'k')).toBe(null);
  });
});

describe('the runner', () => {
  function setup(raws, hash, today = DAY) {
    const calls = [];
    const client = { stressRow: (plan, env) => { calls.push(env); return Promise.resolve(result()); }, stop: (lane) => calls.push({ stop: lane }) };
    const store = createStore(initialState({ today, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, noon(today)), source: 'account', readAt: '14:03' });
    const go = (h) => { store.dispatch({ type: A.ROUTE_SET, route: parse(h) }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); };
    go(hash);
    const stop = startReviewRunner({ store, client });
    return { store, calls, stop, go };
  }
  it('nothing runs on opening; a press runs each row in order with its own env; the results are held under the key', async () => {
    const raw = copy(C['19-back-to-work-saving']);
    const S = setup([raw], '#/plan/' + raw.id + '/review');
    await tick();
    expect(S.calls).toEqual([]);
    const run = S.store.getState().plans.view.page.review.run;
    S.store.dispatch({ type: A.REVIEW_RUN, key: run.key, planId: String(raw.id), rows: run.rows, pots: run.pots });
    await tick(20);
    expect(S.calls).toEqual([{ today: DAY, row: 'asPlanned' }, { today: DAY, row: 'asHeld', whole: true }]);
    expect(S.store.getState().review).toMatchObject({ key: run.key, status: 'done' });
    expect(Object.keys(S.store.getState().review.rows)).toEqual(['asPlanned', 'whole']);
    S.stop();
  });
  it('"today" runs on the run-only settings from the pots pressed; leaving the page stops the run', async () => {
    const raw = copy(C['04-buckets-running']);
    const env = await rowEnv(entryOf(raw, DAY).plan, 'today', { today: DAY, pots: { pension: 500000, isa: 0, other: 0 } });
    expect(env).toMatchObject({ today: DAY, row: 'asPlanned', settings: { potsAsOf: POTS_TODAY } });
    const S = setup([raw], '#/plan/' + raw.id + '/review');
    const run = S.store.getState().plans.view.page.review.run;
    S.store.dispatch({ type: A.REVIEW_RUN, key: run.key, planId: String(raw.id), rows: run.rows, pots: run.pots });
    S.go('#/plan/' + raw.id);
    await tick(20);
    expect(S.calls.some((c) => c.stop === 'stressRow')).toBe(true);
    expect(S.store.getState().review.status).toBe('idle');
    S.stop();
  });
  it('the reducer: "today" needs the pots; a stale result is dropped', () => {
    const s0 = initialState({ today: DAY, build: 'test' });
    expect(() => reduce(s0, { type: A.REVIEW_RUN, key: 'k', planId: 'p', rows: ['today'] })).toThrow(/review\/run/);
    const s1 = reduce(s0, { type: A.REVIEW_RUN, key: 'k', planId: 'p', rows: ['asPlanned'] });
    expect(reduce(s1, { type: A.REVIEW_DONE, key: 'other', row: 'asPlanned', result: {} })).toBe(s1);
  });
});

describe('off course on the home: two saved reviews that worked out the chance, both below the line', () => {
  const entry = (at, weighted, documentAt) => ({ at, phase: 'drawing', documentAt, pots: { pension: 500000, isa: 0, other: 0 }, entered: { pots: true, took: false }, took: null, choice: null,
    reading: { source: 'run', key: 'k', weighted, sumW: Math.round((1 - weighted) * 1000 * WEIGHT_ONE), n: 1000, fixedAge: { lasts: Math.round(weighted * 1000), n: 1000, age: 95 }, typicalLeft: null }, guardrail: null, drift: null, maxDrift: null });
  it('one below is not; two below is, and the home shows it (nothing written on open)', () => {
    const day = '2027-06-02';
    const raw = copy(C['04-buckets-running']);
    const plan0 = entryOf(raw, day).plan;
    const doc = plan0.planDocument.createdAt || plan0.planDocument.lockedAt;
    const withLog = (log) => { const r = copy(raw); r.phases = { of: r.createdAt, review: { log } }; return r; };
    const one = withLog([entry('2027-04-10T10:00:00.000Z', 0.6, doc)]);
    const two = withLog([entry('2027-04-10T10:00:00.000Z', 0.6, doc), entry('2027-05-10T10:00:00.000Z', 0.55, doc)]);
    const ids = (r) => { const h = homeOf([entryOf(r, day)], r.id, { today: day }); return [...h.todo.items, ...h.todo.more].map((x) => x.id); };
    expect(ids(one)).not.toContain('review.offCourse');
    const before = JSON.stringify(two);
    expect(ids(two)).toContain('review.offCourse');
    expect(JSON.stringify(two)).toBe(before);
  });
});

describe('the screen', () => {
  it('the button is the press; the result is said for this key, and kept with the review', () => {
    const id = C['19-back-to-work-saving'].id;
    let st = stateWith(entriesAt(DAY), '#/plan/' + id + '/review', { today: DAY });
    const run = st.plans.view.page.review.run;
    const draw = (state) => { const root = document.createElement('div'); const out = []; render(h(App, { state, dispatch: (a) => out.push(a) }), root); return { root, out }; };
    const d0 = draw(st);
    const btn = d0.root.querySelector('[data-testid="plan.review.run.button"]');
    expect(btn.textContent).toBe('Test with what I hold');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(d0.out.pop()).toEqual({ type: 'review/run', key: run.key, planId: id, rows: ['asPlanned', 'whole'], pots: null });
    st = reduce(st, { type: A.REVIEW_RUN, key: run.key, planId: id, rows: run.rows, pots: null });
    st = reduce(st, { type: A.REVIEW_DONE, key: run.key, row: 'asPlanned', result: result({ weighted: 0.95 }) });
    st = reduce(st, { type: A.REVIEW_DONE, key: run.key, row: 'whole', result: result({ weighted: 0.85 }) });
    st = reduce(st, { type: A.PLANS_VIEW, view: viewFor(st) });
    const d1 = draw(st);
    const line = d1.root.querySelector('[data-testid="plan.review.run.line"]').textContent;
    expect(line).toBe('With what you hold, counting how long people your age live, the money lasts as long as you do 17 times in 20 (as planned: 19 times in 20). If you live to 95, it lasts that long in 17 of 20 futures we tried.');
    expect(visibleText(d1.root)).not.toMatch(/\{\w+\}/);
  });
});
