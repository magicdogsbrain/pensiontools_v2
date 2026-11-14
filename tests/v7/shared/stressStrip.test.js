/**
 * 7.9.0 "Try the bad years" under C's and D's answers (the build spec's §1.2, §2.2, §9): the answer's own case (c/answer.js and
 * d/answer.js stressCaseOf — answerC and answerD untouched), the five rows on the answer's futures at the amount it stands
 * behind, As planned equal to the answer's own figure at that amount (from now, a take named, on the lives, D), the rows'
 * order on the same futures (a fall and lower returns never end a future sooner than As planned; a tenth more spent never
 * raises the chance; prices left out: its bond draws differ), each row's words beside As planned's, and the strip's
 * machinery — the reducer, the runner, the worker's message, the client's lane, the answer runner stopping it before a new
 * answer. Fictional households only (the named states). The time is stressStrip.slow.test.js.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runStressStrip, stressCaseFor, STRIP_ROWS } from '../../../src/answers/shared/stressStrip.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { bannedHits } from '../render/checkScreen.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyStressStrip, cleanStressStrip } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { stressStripView, stripAmountOf } from '../../../src/v7/state/select.js';
import { startStressStripRunner } from '../../../src/v7/effects/stressStrip.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';

const STATES = join(process.cwd(), 'tests/v7/states');
const stateOf = (q, name) => JSON.parse(readFileSync(join(STATES, q, name + '.json'), 'utf8'));
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const FUTURES = 200;
/** The named state's inputs, answered again at FUTURES, and its strip at the amount it stands behind. */
function caseOf(q, name) {
  const r = stateOf(q, name).answers[q].result;
  const env = { today: r.basis.today, futures: FUTURES, seed: r.basis.seed ?? 0 };
  const answer = (q === 'c' ? answerC : answerD)(r.inputs, env);
  const perMonth = stripAmountOf(q, answer);
  return { r, env, answer, perMonth, strip: runStressStrip(q, r.inputs, env, { perMonth }) };
}
const CASES = [['c', 'answer-F1'], ['c', 'answer-take'], ['c', 'answer-paying-in'], ['d', 'answer-D1'], ['d', 'answer-D2-couple'], ['d', 'answer-no']];
const RUN = Object.fromEntries(CASES.map(([q, name]) => [q + '/' + name, caseOf(q, name)]));

describe('As planned is the answer at the amount it stands behind', () => {
  it.each(CASES)('%s %s: the chance, the count and the verdict are the answer\'s own; the five rows in order', (q, name) => {
    const { answer, strip, perMonth } = RUN[q + '/' + name];
    expect(strip.status).toBe('ok');
    expect(strip.rows.map((x) => x.id)).toEqual(STRIP_ROWS);
    const planned = strip.rows[0];
    expect(planned.perMonth).toBe(perMonth);
    const want = q === 'd' ? { fixedAge: answer.chance.fixedAge, weighted: answer.chance.weighted, verdict: answer.verdict }
      : answer.take ? { fixedAge: answer.take.lasted, weighted: answer.take.weighted, verdict: answer.take.verdict }
        : { fixedAge: answer.levels[answer.level].fixedAge, weighted: answer.levels[answer.level].weighted, verdict: 'yes' };
    expect(planned.chance.fixedAge).toBe(want.fixedAge);
    expect(planned.chance.weighted).toBe(want.weighted);
    if (q === 'd' || answer.take) expect(planned.verdict).toBe(want.verdict);
    expect(strip.rows.find((x) => x.id === 'spend').perMonth).toBe(Math.round(perMonth * 1.1 * 100) / 100);
  });
  it('the answer is worked out exactly as before: a strip run first changes nothing in it', () => {
    for (const [q, name] of CASES) {
      const { r, env, answer } = RUN[q + '/' + name];
      expect((q === 'c' ? answerC : answerD)(r.inputs, env), name).toEqual(answer);
    }
  });
  it('nothing to try: no amount, or no pot to draw on', () => {
    const { r, env } = RUN['c/answer-F1'];
    expect(runStressStrip('c', r.inputs, env, { perMonth: 0 })).toEqual({ status: 'none', q: 'c', perMonth: 0, rows: [] });
    const none = stateOf('c', 'answer-pensions-only').answers.c.result;
    expect(stressCaseFor('c', none.inputs, { today: none.basis.today, futures: 20, seed: 0 })).toBe(null);
    expect(stressCaseFor('a', none.inputs, { today: none.basis.today, futures: 20, seed: 0 })).toBe(null);
  });
});

describe('the rows on the same futures', () => {
  it.each(CASES)('%s %s: a fall and lower returns never end a future sooner than As planned; a tenth more never raises the chance', (q, name) => {
    const { r, env, perMonth } = RUN[q + '/' + name];
    const sc = stressCaseFor(q, r.inputs, env);
    const H = perMonth * 12;
    const base = sc.monthsAt({ H }).months;
    const at = (m) => (m === null ? Infinity : m);
    for (const [label, o] of [['fall', { H, shock: { kind: 'fall', share: 0.3 } }], ['lower', { H, dragPct: 1 }]]) {
      const worse = sc.monthsAt(o).months;
      worse.forEach((m, i) => expect(at(m), `${name} ${label} future ${i}`).toBeLessThanOrEqual(at(base[i])));
    }
    const { strip } = RUN[q + '/' + name];
    const by = Object.fromEntries(strip.rows.map((x) => [x.id, x]));
    for (const id of ['fall', 'lower', 'spend']) {
      expect(by[id].chance.fails, `${name} ${id}`).toBeGreaterThanOrEqual(by.asPlanned.chance.fails);
      expect(by[id].chance.sumW, `${name} ${id}`).toBeGreaterThanOrEqual(by.asPlanned.chance.sumW);
    }
  });
});

describe('the words', () => {
  it.each(CASES)('%s %s: each row beside As planned, the weighted line with its fixed-age line; no banned word, nothing unfilled', (q, name) => {
    const { strip } = RUN[q + '/' + name];
    for (const row of strip.rows) {
      const s = row.sentences;
      const text = Object.values(s).map((x) => x.text).join(' ');
      expect(text).not.toMatch(/\bNaN\b|\bundefined\b|\bnull\b|\{\w+\}/);
      expect(bannedHits(text, ['all', 'result', 'retired'], { context: text }), `${name} ${row.id}`).toEqual([]);
      expect(s.fixed.text).toMatch(/\b(live to|is still alive when the younger of you is) \d{2,3}\b/);
      if (s.line) {
        expect(s.line.mark).toBe('weighted');
        expect(s.fixed.mark).toBe('fixed');
        expect(s.line.text).not.toMatch(/of 20 futures we tried/);
      }
      if (row.id === 'asPlanned') expect(text).not.toContain('as planned');
      else if (!row.same) expect(s.fixed.text).toMatch(/\(as planned: [^)]+\)\.$/);
      // never a figure of the real histories
      expect(text).not.toMatch(/histor|real start/i);
    }
    expect(strip.rows.find((x) => x.id === 'spend').words.what[0]).toEqual({ id: 'rows.spend.answer', slots: { amount: '£' + Math.round(strip.rows[3].perMonth).toLocaleString('en-GB') } });
  });
  it('a row whose every figure is As planned\'s is said to change nothing', () => {
    const couple = RUN['d/answer-D2-couple'].strip;
    expect(couple.rows[0].chance.fixedAge).toBe(1);
    expect(couple.rows.filter((x) => x.id !== 'asPlanned').every((x) => x.same)).toBe(true);
  });
});

describe('the strip\'s machinery', () => {
  const answered = (q = 'd', name = 'answer-D1') => {
    const st = stateOf(q, name);
    const store = createStore(initialState({ today: st.env.today, build: 'test' }), reduce);
    store.dispatch({ type: A.STATE_REPLACE, state: st });
    return { store, key: store.getState().answers[q].inputsKey, result: store.getState().answers[q].result };
  };
  it('the reducer: a press of a final answer only; the rows filed under its key; a new answer drops them; stopped, failed, noWorker', () => {
    const { store, key } = answered();
    let s = store.getState();
    expect(s.stressStrip).toEqual(emptyStressStrip());
    expect(stressStripView(s, 'd')).toMatchObject({ q: 'd', inputsKey: key, perMonth: 2100, status: 'idle', result: null });
    expect(reduce(s, { type: A.STRIP_RUN, q: 'd', inputsKey: 'other' }), 'not the answer on screen').toBe(s);
    expect(() => reduce(s, { type: A.STRIP_RUN, q: 'a', inputsKey: key })).toThrow(/only under C and D/);
    s = reduce(s, { type: A.STRIP_RUN, q: 'd', inputsKey: key });
    expect(s.stressStrip).toEqual({ q: 'd', key, status: 'working', result: null, reason: null });
    expect(reduce(s, { type: A.STRIP_DONE, q: 'd', inputsKey: 'other', result: { rows: [] } })).toBe(s);
    const done = reduce(s, { type: A.STRIP_DONE, q: 'd', inputsKey: key, result: { status: 'ok', rows: [{ id: 'asPlanned' }] } });
    expect(stressStripView(done, 'd')).toMatchObject({ status: 'done', result: { rows: [{ id: 'asPlanned' }] } });
    // a new answer of D: the rows were for the one before, and go
    const next = reduce(done, { type: A.ANSWER_WORKING, q: 'd', inputsKey: 'K2' });
    expect(next.stressStrip).toEqual(emptyStressStrip());
    expect(reduce(s, { type: A.STRIP_FAILED, q: 'd', inputsKey: key, reason: 'stopped' }).stressStrip.status).toBe('idle');
    expect(reduce(s, { type: A.STRIP_FAILED, q: 'd', inputsKey: key, reason: 'noWorker' }).stressStrip).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(cleanStressStrip({ q: 'c', key: 'k', status: 'done', result: { rows: [] }, reason: 'x' })).toEqual({ q: 'c', key: 'k', status: 'done', result: { rows: [] }, reason: null });
    expect(cleanStressStrip({ q: 'a', key: 'k' })).toEqual(emptyStressStrip());
  });
  it('the runner: strip/run → client.stressStrip(q, the answer\'s inputs, its date, futures and seed, the amount) → strip/done; a new answer stops it; no worker', async () => {
    const { store, key, result } = answered();
    const calls = [];
    const stopped = [];
    const stop = startStressStripRunner({ store, client: { stressStrip: (q, inputs, env, at) => { calls.push({ q, inputs, env, at }); return Promise.resolve({ status: 'ok', q, rows: [{ id: 'asPlanned' }] }); }, stop: (q) => stopped.push(q) } });
    store.dispatch({ type: A.STRIP_RUN, q: 'd', inputsKey: key });
    await tick();
    expect(calls).toEqual([{ q: 'd', inputs: result.inputs, env: { today: result.basis.today, futures: result.basis.futures, seed: result.basis.seed ?? 0 }, at: { perMonth: 2100 } }]);
    expect(store.getState().stressStrip.status).toBe('done');
    stop();
    const p2 = answered();
    const stopped2 = [];
    const stop2 = startStressStripRunner({ store: p2.store, client: { stressStrip: () => new Promise(() => {}), stop: (q) => stopped2.push(q) } });
    p2.store.dispatch({ type: A.STRIP_RUN, q: 'd', inputsKey: p2.key });
    await tick();
    p2.store.dispatch({ type: A.ANSWER_WORKING, q: 'd', inputsKey: 'K2' });
    await tick();
    expect(stopped2).toEqual(['stressStrip']);
    expect(p2.store.getState().stressStrip).toEqual(emptyStressStrip());
    stop2();
    const p3 = answered();
    const stop3 = startStressStripRunner({ store: p3.store, client: { stressStrip: () => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })), stop: () => {} } });
    p3.store.dispatch({ type: A.STRIP_RUN, q: 'd', inputsKey: p3.key });
    await tick();
    expect(p3.store.getState().stressStrip).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop3();
  });
  it('the worker: the stressStrip message through the real handler (never kept as the answer\'s last); the client\'s own lane', async () => {
    const seen = [];
    const handle = createHandler(undefined, { stressStrip: (q, inputs, env, at) => { seen.push([q, env.today, env.futures, at.perMonth]); env.onProgress(5, 5); return { status: 'ok', q, rows: [], f: () => 1 }; } });
    handle({ id: 1, type: 'init', today: '2026-10-02' }, () => {});
    const out = [];
    handle({ id: 2, type: 'stressStrip', q: 'd', inputs: { a: 1 }, env: { futures: 20, seed: 0 }, at: { perMonth: 2100 } }, (m) => out.push(m));
    await tick();
    expect(seen).toEqual([['d', '2026-10-02', 20, 2100]]);
    expect(out.at(-1)).toEqual({ id: 2, result: { status: 'ok', q: 'd', rows: [] } });
    const bad = [];
    handle({ id: 3, type: 'stressStrip', q: 'b', inputs: {}, at: { perMonth: 1 } }, (m) => bad.push(m));
    expect(bad[0].error).toMatch(/only under C and D/);
    const posted = [];
    let w;
    const client = createWorkerClient({ makeWorker: () => { w = { postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }; return w; } });
    const strip = client.stressStrip('c', { x: 1 }, { today: '2026-10-02', futures: 1000, seed: 0 }, { perMonth: 1380 });
    const answer = client.answer('c', { x: 1 }, { today: '2026-10-02', futures: 100 });
    expect(posted.map((m) => [m.type, m.q])).toEqual([['stressStrip', 'c'], ['answer', 'c']]);
    expect(posted[0].at).toEqual({ perMonth: 1380 });
    client.stop('stressStrip');
    await expect(strip).rejects.toMatchObject({ code: 'stopped' });
    w.onmessage({ data: { id: posted.at(-1).id, result: { status: 'ok' } } });
    await expect(answer).resolves.toEqual({ status: 'ok' });
  });
  it('the answer runner stops a strip under way before it posts a new answer, and touches nothing when none is', async () => {
    const { startRunner } = await import('../../../src/v7/effects/run.js');
    const { store, key } = answered();
    const stops = [];
    const client = { init: () => Promise.resolve({ historyEnd: null }), answer: () => new Promise(() => {}), stop: (q) => stops.push(q) };
    store.dispatch({ type: A.ROUTE_SET, route: { screen: 'step', q: 'd', step: 'answer', planId: null, focus: null } });
    const stop = startRunner({ store, client, local: () => ({}), q: 'd' });
    await tick();
    expect(stops).toEqual([]);
    store.dispatch({ type: A.STRIP_RUN, q: 'd', inputsKey: key });
    store.dispatch({ type: A.DRAFT_SET, q: 'd', path: 'spend.amount', value: '2,300' });
    await new Promise((r) => setTimeout(r, 300));
    expect(stops).toContain('stressStrip');
    stop();
  });
});

describe('the strip drawn under C\'s and D\'s answers', () => {
  const BLOCK = 'section, .block, .headline, .band, .plan-section, details';
  const AGE = /\b(live to|is still alive when|is) \d{2,3}\b/;
  const rule = (root) => {
    const out = [];
    for (const el of root.querySelectorAll('[data-stress-strip] [data-weighted]')) {
      const block = (el.parentElement && el.parentElement.closest(BLOCK)) || root;
      if (![...block.querySelectorAll('[data-fixed="age"]')].some((f) => f !== el && AGE.test(f.textContent))) out.push(el.textContent.slice(0, 80));
    }
    return out;
  };
  it.each([['c', 'answer-F1'], ['c', 'answer-take'], ['d', 'answer-D1'], ['d', 'answer-D2-couple']])('%s %s: the button on a final answer; a press is strip/run; the rows drawn with their words', async (q, name) => {
    const { draw, visibleText } = await import('../render/checkScreen.js');
    const st = stateOf(q, name);
    let s = reduce(initialState({ today: st.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: st });
    const key = s.answers[q].inputsKey;
    const before = draw(s);
    const strip = before.root.querySelector(`[data-stress-strip="${q}"]`);
    expect(strip).toBeTruthy();
    expect(strip.querySelector('.stress-rows')).toBe(null);
    expect(strip.textContent).toContain('Try the bad years');
    expect(strip.textContent).toContain(`at the £${stripAmountOf(q, s.answers[q].result).toLocaleString('en-GB')} a month it stands behind`);
    strip.querySelector(`[data-testid="${q}.stress.run"]`).click();
    expect(before.actions).toEqual([{ type: 'strip/run', q, inputsKey: key }]);
    const { strip: result } = RUN[q + '/' + name];
    s = reduce(reduce(s, { type: A.STRIP_RUN, q, inputsKey: key }), { type: A.STRIP_DONE, q, inputsKey: key, result });
    const { root } = draw(s);
    const drawn = root.querySelector(`[data-stress-strip="${q}"]`);
    expect([...drawn.querySelectorAll('li.stress-row')].map((li) => li.getAttribute('data-row'))).toEqual(STRIP_ROWS);
    expect(rule(root)).toEqual([]);
    const text = visibleText(drawn);
    expect(text).not.toMatch(/\bNaN\b|\bundefined\b|\bnull\b|\{\w+\}/);
    expect(bannedHits(text, ['all', 'result', 'retired'], { context: text })).toEqual([]);
    // the answer above is drawn as it was: its own region holds no row of the strip
    expect(root.querySelector('[data-region="answer"] [data-stress-strip]')).toBe(null);
  });
  it('no button on a first figure or while an answer is worked out', async () => {
    const { draw } = await import('../render/checkScreen.js');
    for (const [q, name] of [['c', 'answer-first'], ['c', 'answer-working'], ['d', 'answer-first'], ['d', 'answer-working']]) {
      const st = stateOf(q, name);
      const s = reduce(initialState({ today: st.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: st });
      expect(draw(s).root.querySelector('[data-stress-strip]'), name).toBe(null);
    }
  });
});
