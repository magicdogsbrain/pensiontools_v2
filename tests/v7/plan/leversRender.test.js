/**
 * "Try a change" on "Does it last?" (research/v7/answer-D.md 3.9; road-to-7.md step 7), drawn from states: the three levers
 * appear only once the plan's own test is held and fresh; each button sends lasts/leverTry; the work lever opens its two
 * boxes on a press (so a locked plan draws no box until asked) and "Try it" sends the try; working, invalid, failed and
 * done states; the lines of a done lever are the reading's; "Put it away" sends lasts/leverClose; a locked plan says the
 * one comparison line and never a word of unlocking; no banned word, no countdown.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { lastsOf, runKeyOf } from '../../../src/answers/plan/lasts.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { LASTS } from '../../../src/v7/copy/lasts.js';
import { corpus, entriesAt, stateWith, TODAY } from './_plans.js';

const C = corpus();
function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const R = { strategyId: 'pots-and-valves', name: 'Pots & Valves', affordable: true, ruin: { hist: 2.1, mc: 7.3 }, n: { hist: 657, mc: 1000 }, coverage: 99.6,
  worst12: { min: 31000, median: 40000 }, terminal: { p10: 135978, p50: 1806699, p90: 4200000, histMedian: 1500000 },
  cones: { wealth: { p10: [1], p50: [1], p90: [1] }, income: { p10: [1], p50: [1], p90: [1] } },
  cuts: { futures: 1000, cutN: 190, cutPct: 19, ranOutN: 41, typicalCutPerYear: 4000, typicalCutYears: 3, typicalCutTotal: 12000, worstCutTotal: 31000 }, guaranteedToAge: 'State Pension only (from age 67)' };
const P = { durationYears: 39, startAge: 56 };
const fakeResult = (strategyId) => ({ strategyId, ran: { family: true, cutsOn: true, cutPct: 20, months: 3 }, priced: null, a: oneAnswer({ ...R, strategyId }, P), reason: null, history: { worst: [], named: [] }, stored: null, basis: { today: TODAY, engine: 'one-test' } });
const AT = { share: 0.91, chancePct: 91.2, typicalLeft: 200000, badCaseLeft: 0, years: 30, lasts: true };
const BASE = { share: 0.927, chancePct: 92.7, typicalLeft: 1806699, badCaseLeft: 135978, years: 39, lasts: true };
const LEVER_RESULTS = {
  spendMore: { kind: 'spendMore', ok: true, runs: 7, factor: 1.16, perMonth: 240, baseMonthly: 1500, capped: false, evenHalf: false, base: BASE, at: AT },
  work: { kind: 'work', ok: true, runs: 1, yearly: 15000, years: 3, field: 'extraIncomes', at: AT },
  fall: { kind: 'fall', ok: true, runs: 1, share: 0.2, potBefore: 745000, potAfter: 661000, equityShare: 0.56, at: AT }
};

/** A state on the lasts step with the run held, then the lever actions given, the reading refreshed as the plan source does. */
function state(entries, id, { run = 'done', actions = [] } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/lasts', { today: TODAY });
  const entry = entries.find((e) => e.plan.id === id);
  const key = runKeyOf(entry.plan);
  if (run !== 'idle') {
    s = reduce(s, { type: A.LASTS_WORKING, key });
    if (run === 'done') s = reduce(s, { type: A.LASTS_DONE, key, result: fakeResult(lastsOf(entries, id, { today: TODAY }).strategyId) });
  }
  for (const a of actions) s = reduce(s, typeof a === 'function' ? a(key) : a);
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  return { s, key };
}
const entries = entriesAt(TODAY);
const ALEX = C['02-pnv-draft'].id;
const LOCKED = C['03-gilt-ladder-runup'].id;

describe('"Try a change" on "Does it last?"', () => {
  it('is there once the run is held and fresh: the three levers, each a button; not while the run is under way; no box until a lever is opened', () => {
    const { s } = state(entries, ALEX);
    const { root, text } = draw(s);
    const section = one(root, 'plan.lasts.levers');
    expect(section.querySelector('h2').textContent).toBe(LASTS.levers.title);
    expect([...section.querySelectorAll('[data-lever]')].map((el) => [el.getAttribute('data-lever'), el.getAttribute('data-lever-status')])).toEqual([['spendMore', 'off'], ['work', 'off'], ['fall', 'off']]);
    for (const k of ['spendMore', 'work', 'fall']) expect(one(root, `plan.lasts.lever.${k}`)).not.toBe(null);
    expect(one(root, 'plan.lasts.lever.work').textContent).toBe(LASTS.levers.names.work);
    expect(one(root, 'plan.lasts.lever.work.yearly')).toBe(null);
    expect(one(root, 'plan.lasts.levers.locked')).toBe(null);
    expect(bannedHits(text, ['all', 'record', 'retired'])).toEqual([]);
    expect(text).not.toMatch(/\bto go\b|countdown/i);
    const working = state(entries, ALEX, { run: 'working' });
    expect(one(draw(working.s).root, 'plan.lasts.levers')).toBe(null);
    const idle = state(entries, ALEX, { run: 'idle' });
    expect(one(draw(idle.s).root, 'plan.lasts.levers')).toBe(null);
  });
  it('each button sends lasts/leverTry for its lever; the work lever opens its boxes first, then "Try it"; typing sends lasts/leverType; "Put it away" sends lasts/leverClose', () => {
    const { s } = state(entries, ALEX);
    const { root, actions } = draw(s);
    one(root, 'plan.lasts.lever.spendMore').click();
    one(root, 'plan.lasts.lever.fall').click();
    one(root, 'plan.lasts.lever.work').click();
    expect(actions).toEqual([{ type: 'lasts/leverTry', kind: 'spendMore' }, { type: 'lasts/leverTry', kind: 'fall' }, { type: 'lasts/leverTry', kind: 'work' }]);
    const open = state(entries, ALEX, { actions: [{ type: A.LEVER_TRY, kind: 'work' }, { type: A.LEVER_TYPE, field: 'yearly', value: '15,000' }] });
    const o = draw(open.s);
    expect(o.root.querySelector('[data-lever="work"]').getAttribute('data-lever-status')).toBe('open');
    expect(one(o.root, 'plan.lasts.lever.work.yearly').value).toBe('15,000');
    expect(one(o.root, 'plan.lasts.lever.work.years').value).toBe('');
    expect(o.root.querySelector('label[for="plan.lasts.lever.work.yearly"]').textContent).toBe(LASTS.levers.work.yearly);
    const box = one(o.root, 'plan.lasts.lever.work.years');
    box.value = '3';
    box.dispatchEvent(new window.Event('input', { bubbles: true }));
    one(o.root, 'plan.lasts.lever.work.try').click();
    one(o.root, 'plan.lasts.lever.work.close').click();
    expect(o.actions).toEqual([{ type: 'lasts/leverType', field: 'years', value: '3' }, { type: 'lasts/leverTry', kind: 'work' }, { type: 'lasts/leverClose', kind: 'work' }]);
  });
  it('invalid figures in the work boxes: the plain sentence under the box, nothing tried', () => {
    const { s } = state(entries, ALEX, { actions: [{ type: A.LEVER_TRY, kind: 'work' }, { type: A.LEVER_TYPE, field: 'yearly', value: '15,000' }, { type: A.LEVER_TYPE, field: 'years', value: '9' }, { type: A.LEVER_TRY, kind: 'work' }] });
    expect(s.lasts.levers.work).toMatchObject({ status: 'invalid', reason: 'years' });
    const { root } = draw(s);
    expect(root.querySelector('[data-error-for="plan.lasts.lever.work.years"]').textContent).toBe(LASTS.levers.invalid.years);
    expect(one(root, 'plan.lasts.lever.work.years').getAttribute('aria-invalid')).toBe('true');
    expect(one(root, 'plan.lasts.lever.work.try')).not.toBe(null);
  });
  it('working, failed (and no worker), done: the lines are the reading\'s, with the cost; "Put it away"', () => {
    const working = state(entries, ALEX, { actions: [{ type: A.LEVER_TRY, kind: 'spendMore' }] });
    expect(one(draw(working.s).root, 'plan.lasts.lever.spendMore.working').textContent).toBe(LASTS.levers.working);
    const failed = state(entries, ALEX, { actions: [{ type: A.LEVER_TRY, kind: 'fall' }, (key) => ({ type: A.LEVER_FAILED, key, kind: 'fall' })] });
    const f = draw(failed.s);
    expect(one(f.root, 'plan.lasts.lever.fall.failed').textContent).toContain(LASTS.levers.failed);
    expect(one(f.root, 'plan.lasts.lever.fall.again')).not.toBe(null);
    const noWorker = state(entries, ALEX, { actions: [{ type: A.LEVER_TRY, kind: 'fall' }, (key) => ({ type: A.LEVER_FAILED, key, kind: 'fall', reason: 'noWorker' })] });
    expect(one(draw(noWorker.s).root, 'plan.lasts.lever.fall.failed').textContent).toContain(LASTS.levers.noWorker);
    const done = state(entries, ALEX, { actions: [
      { type: A.LEVER_TRY, kind: 'spendMore' }, (key) => ({ type: A.LEVER_DONE, key, kind: 'spendMore', result: LEVER_RESULTS.spendMore }),
      { type: A.LEVER_TRY, kind: 'work' }, { type: A.LEVER_TYPE, field: 'yearly', value: '15000' }, { type: A.LEVER_TYPE, field: 'years', value: '3' }, { type: A.LEVER_TRY, kind: 'work' }, (key) => ({ type: A.LEVER_DONE, key, kind: 'work', result: LEVER_RESULTS.work }),
      { type: A.LEVER_TRY, kind: 'fall' }, (key) => ({ type: A.LEVER_DONE, key, kind: 'fall', result: LEVER_RESULTS.fall })
    ] });
    const d = draw(done.s);
    const lines = (kind) => [...one(d.root, `plan.lasts.lever.${kind}.result`).querySelectorAll('[data-line]')].map((el) => [el.getAttribute('data-line'), el.textContent]);
    expect(lines('spendMore')).toEqual([
      ['lever.spendMore.more', '£240 a month more would still last in 9 futures out of 10: 91.2% of futures, with typically £200,000 left at the end (against 92.7% as it is).'],
      ['lever.runs', 'Tried in 7 runs of the one test.']
    ]);
    expect(lines('work')[0]).toEqual(['lever.work.line', 'With £15,000 a year from work for 3 years, the plan lasts in 9 futures out of 10: 91.2% of futures, typically £200,000 left — against 92.7% without it.']);
    expect(lines('work')[1][0]).toBe('lever.work.how');
    expect(lines('fall')[0]).toEqual(['lever.fall.line', 'If shares fell by a fifth tomorrow (the pots £745,000 to £661,000), the plan lasts in 9 futures out of 10: 91.2% of futures, typically £200,000 left — against 92.7% as it is.']);
    for (const k of ['spendMore', 'work', 'fall']) expect(one(d.root, `plan.lasts.lever.${k}.close`)).not.toBe(null);
    expect(one(d.root, 'plan.lasts.levers.locked')).toBe(null);                  // not a locked plan
    expect(bannedHits(d.text, ['all', 'record', 'retired'])).toEqual([]);
    expect(d.text).not.toMatch(/undefined|NaN|\{\w+\}/);
    // closed: the lever is off again
    const closed = reduce(done.s, { type: A.LEVER_CLOSE, kind: 'fall' });
    expect(closed.lasts.levers.fall).toBeUndefined();
  });
  it('a locked plan with a document: no box before a lever is opened; once one is done, ONE comparison line and never a word of unlocking in it', () => {
    const before = state(entries, LOCKED);
    const b = draw(before.s);
    expect(one(b.root, 'plan.lasts.levers')).not.toBe(null);
    expect(b.root.querySelectorAll('input, select, textarea').length).toBe(0);
    expect(one(b.root, 'plan.lasts.levers.locked')).toBe(null);
    const done = state(entries, LOCKED, { actions: [{ type: A.LEVER_TRY, kind: 'fall' }, (key) => ({ type: A.LEVER_DONE, key, kind: 'fall', result: LEVER_RESULTS.fall })] });
    const d = draw(done.s);
    const line = one(d.root, 'plan.lasts.levers.locked');
    expect(line).not.toBe(null);
    expect(line.textContent).toMatch(/^The plan as locked on .+ said [\d.]+%\. The levers are tried against today’s test \([\d.]+%\): the same plan on a different day\.$/);
    expect(d.root.querySelectorAll('[data-testid="plan.lasts.levers.locked"]').length).toBe(1);
    expect(line.textContent).not.toMatch(/unlock|wrong/i);
    expect(one(d.root, 'plan.lasts.document')).not.toBe(null);                   // the document's figure stays above
  });
});
