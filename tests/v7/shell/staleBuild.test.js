/**
 * A page opened before the site was updated (src/utils/staleBuild.js; reported 16 Nov 2026: a tab opened before a deploy
 * said "Sorry, we could not work that out." on any question, and "Try again" never worked, because the deploy took the
 * release before's worker and parts loaded on demand off the site, and nothing loaded the page again).
 *
 *  - what counts as a stale build: the worker client's code, and each browser's words for a part that could not be loaded;
 *  - the worker client: a fresh worker that fails before it is ready, after an earlier one was, is a stale build (and so
 *    is every call after it); the first worker failing is still "no worker", and a ready worker's failure still a failure;
 *  - the page loads itself again ONCE for a build in a tab (the note is written first), never on open, never in a loop;
 *    when it has, or the tab cannot keep the note, the plain words with "Reload the page" — never "Sorry";
 *  - the runner: a stale build never dispatches answer/failed while the page loads itself again; Vite's preload error is
 *    a hit; the typed figures and the address survive the reload (the draft is kept in the tab);
 *  - the full view: the same, from its own module, in the same words.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isStaleBuildError, mayReloadOnce, STALE_BUILD, RELOADED_KEY } from '../../../src/utils/staleBuild.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { startStaleBuild, watchClient } from '../../../src/v7/effects/staleBuild.js';
import { startRunner } from '../../../src/v7/effects/run.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { loadDraft, startDraftStore, DRAFT_KEY } from '../../../src/v7/effects/draftStore.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { staleView } from '../../../src/v7/state/select.js';
import { COMMON } from '../../../src/v7/copy/common.js';
import { installStaleBuild, staleWordsText } from '../../../src/ui/staleBuildPage.js';
import { draw, visibleText } from '../render/checkScreen.js';
import { fresh, set, route, result, TODAY } from './_shell.js';

const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };

/** The tab's storage: a Map behind getItem / setItem, counting writes. */
function tabStorage({ throws = false } = {}) {
  const m = new Map();
  const s = {
    writes: 0,
    getItem: (k) => { if (throws) throw new Error('blocked'); return m.has(k) ? m.get(k) : null; },
    setItem: (k, v) => { if (throws) throw new Error('blocked'); s.writes++; m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    map: m
  };
  return s;
}

/** A window with a reload that is counted, events that can be fired, and the tab's storage. */
function fakeWindow(session = tabStorage()) {
  const listeners = new Map();
  const win = {
    reloads: 0,
    location: { hash: '#/b/answer', reload: () => { win.reloads++; } },
    sessionStorage: session,
    localStorage: tabStorage(),
    navigator: { onLine: true },
    addEventListener: (type, fn) => { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener: (type, fn) => { if (listeners.has(type)) listeners.get(type).delete(fn); },
    fire: (type, event = {}) => { for (const fn of listeners.get(type) || []) fn({ type, ...event }); },
    listening: (type) => (listeners.get(type) || new Set()).size
  };
  return win;
}

const CHROME = new TypeError('Failed to fetch dynamically imported module: https://example.test/assets/index-OLD.js');
const SAFARI = new TypeError('Importing a module script failed.');
const FIREFOX = new TypeError('error loading dynamically imported module: https://example.test/assets/index-OLD.js');

describe('what counts as a stale build', () => {
  it('the worker client\'s code, and Chrome\'s, Safari\'s and Firefox\'s words for a part that could not be loaded', () => {
    expect(isStaleBuildError(Object.assign(new Error('x'), { code: STALE_BUILD }))).toBe(true);
    for (const e of [CHROME, SAFARI, FIREFOX, new Error('Unable to preload CSS for /assets/x.css')]) expect(isStaleBuildError(e), e.message).toBe(true);
    expect(isStaleBuildError('Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html".')).toBe(true);
  });
  it('nothing else: an answer that threw, a stopped run, no worker in this browser', () => {
    for (const e of [new Error('boom'), Object.assign(new Error('stopped'), { code: 'stopped' }), Object.assign(new Error('x'), { code: NO_WORKER }), Object.assign(new Error('the worker failed'), { code: 'worker-error' }), null, undefined, {}]) {
      expect(isStaleBuildError(e)).toBe(false);
    }
  });
});

describe('once per build in a tab', () => {
  it('yes the first time (the note written first), no for the same build after, yes for another build', () => {
    const s = tabStorage();
    expect(mayReloadOnce(s, 'b1')).toBe(true);
    expect(s.map.get(RELOADED_KEY)).toBe('b1');
    expect(mayReloadOnce(s, 'b1')).toBe(false);
    expect(mayReloadOnce(s, 'b1')).toBe(false);
    expect(mayReloadOnce(s, 'b2')).toBe(true);
  });
  it('no when the tab cannot keep the note, so it can never loop', () => {
    expect(mayReloadOnce(null, 'b1')).toBe(false);
    expect(mayReloadOnce(tabStorage({ throws: true }), 'b1')).toBe(false);
    const forgetful = { getItem: () => null, setItem: () => {} };
    expect(mayReloadOnce(forgetful, 'b1')).toBe(false);
  });
});

/** A worker the test drives: it answers init with ready unless told to fail first. */
function workers() {
  const made = [];
  const makeWorker = () => {
    const w = { posted: [], terminated: false, onmessage: null, onerror: null, postMessage(m) { w.posted.push(m); }, terminate() { w.terminated = true; } };
    w.ready = () => w.onmessage({ data: { ready: true, historyEnd: '2025-12', engineVersion: 'x' } });
    w.fail = () => w.onerror({ preventDefault() {} });
    w.reply = (id, result) => w.onmessage({ data: { id, result } });
    made.push(w);
    return w;
  };
  return { made, makeWorker };
}

describe('the worker client', () => {
  it('a fresh worker that fails before it is ready, after an earlier one was: a stale build, for that call and every later one', async () => {
    const { made, makeWorker } = workers();
    const client = createWorkerClient({ makeWorker });
    const init = client.init(TODAY);
    made[0].ready();
    await init;
    const first = client.answer('b', {}, {});
    client.stop('b');                                          // a change while it ran: a fresh worker next time
    await expect(first).rejects.toMatchObject({ code: 'stopped' });
    const second = client.answer('b', {}, {});
    expect(made.length).toBe(2);
    made[1].fail();                                            // its file is the site's page now: it never starts
    await expect(second).rejects.toMatchObject({ code: STALE_BUILD });
    await expect(client.answer('b', {}, {})).rejects.toMatchObject({ code: STALE_BUILD });
    await expect(client.lasts({}, {})).rejects.toMatchObject({ code: STALE_BUILD });
    expect(made.length).toBe(2);                               // and no worker is made again
  });
  it('the first worker failing before it was ever ready is still "no worker" (the page works the answer out itself)', async () => {
    const { made, makeWorker } = workers();
    const client = createWorkerClient({ makeWorker });
    const call = client.answer('c', {}, {});
    made[0].fail();
    await expect(call).rejects.toMatchObject({ code: NO_WORKER });
    expect(client.available()).toBe(false);
  });
  it('a ready worker that fails during a run is still a failure, and the next worker may start', async () => {
    const { made, makeWorker } = workers();
    const client = createWorkerClient({ makeWorker });
    client.init(TODAY);
    made[0].ready();
    const call = client.answer('c', {}, {});
    made[0].fail();
    await expect(call).rejects.toMatchObject({ code: 'worker-error' });
    const next = client.answer('c', {}, {});
    made[1].ready();
    const id = made[1].posted.find((m) => m.type === 'answer').id;
    made[1].reply(id, { status: 'ok' });
    await expect(next).resolves.toEqual({ status: 'ok' });
  });
});

/** A store over the real reducer, in the test build, with the draft this tab kept. */
const storeOf = (draft = null) => createStore(initialState({ today: TODAY, build: 'test', draft }), reduce);

describe('the page loads itself again once, then says so', () => {
  it('nothing is written and nothing reloads on open', () => {
    const win = fakeWindow();
    const stale = startStaleBuild(storeOf(), { win, session: win.sessionStorage, build: 'old' });
    expect(win.sessionStorage.writes).toBe(0);
    expect(win.reloads).toBe(0);
    expect(win.listening('vite:preloadError')).toBe(1);
    stale.stop();
    expect(win.listening('vite:preloadError')).toBe(0);
  });
  it('the first stale build reloads once; met again before the page has gone, nothing more', () => {
    const win = fakeWindow();
    const store = storeOf();
    const stale = startStaleBuild(store, { win, session: win.sessionStorage, build: 'old' });
    expect(stale.hit()).toBe('reloading');
    expect(stale.hit()).toBe('reloading');
    win.fire('vite:preloadError');
    expect(win.reloads).toBe(1);
    expect(store.getState().env.stale).toBeUndefined();
  });
  it('the page that comes back as the same build does not reload again: the plain words, with "Reload the page"', () => {
    const session = tabStorage();
    const before = fakeWindow(session);
    startStaleBuild(storeOf(), { win: before, session, build: 'old' }).hit();
    const after = fakeWindow(session);                         // the same tab, loaded again, still the old build
    const store = storeOf();
    const stale = startStaleBuild(store, { win: after, session, build: 'old' });
    expect(stale.hit()).toBe('words');
    expect(stale.hit()).toBe('words');
    expect(after.reloads).toBe(0);
    expect(store.getState().env.stale).toBe(true);
    // "Reload the page" is the person's own press: it reloads, as often as pressed
    store.dispatch({ type: A.PAGE_RELOAD });
    store.dispatch({ type: A.PAGE_RELOAD });
    expect(after.reloads).toBe(2);
  });
  it('a newer build in the same tab may reload once more (a second update), so the guard is per build', () => {
    const session = tabStorage();
    startStaleBuild(storeOf(), { win: fakeWindow(session), session, build: 'b1' }).hit();
    const win = fakeWindow(session);
    expect(startStaleBuild(storeOf(), { win, session, build: 'b2' }).hit()).toBe('reloading');
    expect(win.reloads).toBe(1);
  });
  it('a tab that cannot keep the note never reloads by itself: the words at once', () => {
    const session = tabStorage({ throws: true });
    const win = fakeWindow(session);
    const store = storeOf();
    expect(startStaleBuild(store, { win, session, build: 'old' }).hit()).toBe('words');
    expect(win.reloads).toBe(0);
    expect(store.getState().env.stale).toBe(true);
  });
  it('every call of the worker client that meets a stale build tells it, and its caller still hears the error', async () => {
    const hit = vi.fn();
    const err = Object.assign(new Error('x'), { code: STALE_BUILD });
    const client = watchClient({ lasts: () => Promise.reject(err), ways: () => Promise.reject(new Error('boom')), stop: () => 'kept', available: () => true }, hit);
    await expect(client.lasts()).rejects.toBe(err);
    await expect(client.ways()).rejects.toThrow('boom');
    expect(hit).toHaveBeenCalledTimes(1);
    expect(client.stop()).toBe('kept');
    expect(client.available()).toBe(true);
  });
});

describe('the runner', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  /** C on its answer step, with a client and a page fallback the test chooses. */
  function cOnAnswer({ client, local, onStale }) {
    const store = storeOf();
    store.dispatch(set('you.pot', '250000'));
    store.dispatch(set('you.age', '58'));
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', 'answer') });
    const seen = [];
    store.subscribe((s, a) => seen.push(a.type));
    startRunner({ store, client, local, onStale });
    return { store, seen };
  }
  const noWorker = { init: () => Promise.reject(Object.assign(new Error('x'), { code: NO_WORKER })), answer: () => Promise.reject(Object.assign(new Error('x'), { code: NO_WORKER })), stop() {} };
  const staleWorker = { init: () => Promise.resolve({}), answer: () => Promise.reject(Object.assign(new Error('x'), { code: STALE_BUILD })), stop() {} };

  it('no worker, and the answers\' part cannot be loaded (the first worker never started): the page reloads, no "failed"', async () => {
    const onStale = vi.fn(() => 'reloading');
    const { store, seen } = cOnAnswer({ client: noWorker, local: () => Promise.reject(CHROME), onStale });
    await flush();
    vi.advanceTimersByTime(10);
    await flush();
    expect(onStale).toHaveBeenCalled();
    expect(seen).not.toContain(A.ANSWER_FAILED);
    expect(store.getState().answers.c.status).toBe('working');
  });
  it('a stale worker: the page reloads, no "failed"', async () => {
    const onStale = vi.fn(() => 'reloading');
    const { seen } = cOnAnswer({ client: staleWorker, local: () => result(), onStale });
    await flush();
    expect(onStale).toHaveBeenCalledTimes(1);
    expect(seen).not.toContain(A.ANSWER_FAILED);
  });
  it('when the page has reloaded once already: answer/failed, which draws the plain words', async () => {
    const { seen } = cOnAnswer({ client: staleWorker, local: () => result(), onStale: () => 'words' });
    await flush();
    expect(seen).toContain(A.ANSWER_FAILED);
  });
  it('any other error is a failure as before, and onStale is not asked', async () => {
    const onStale = vi.fn(() => 'reloading');
    const { seen } = cOnAnswer({ client: { init: () => Promise.resolve({}), answer: () => Promise.reject(new Error('boom')), stop() {} }, local: () => result(), onStale });
    await flush();
    expect(onStale).not.toHaveBeenCalled();
    expect(seen).toContain(A.ANSWER_FAILED);
  });
});

describe('as the page runs it', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  /** B's figures typed in this tab (made up, round): Alex, 45, £50,000, £200 a month, stopping at 67, wanting £2,000. */
  const ALEX = { 'you.age': '45', 'you.pot': '50000', 'you.payIn.total': '200', 'stop.age': '67', 'spend.amount': '2000' };
  const noWorker = () => Object.assign(new Error('x'), { code: NO_WORKER });

  /** One load of the page in a tab, wired as startEffects wires it: the stale watch first, the client watched, the runner told. */
  function page(session, { local }) {
    const win = fakeWindow(session);
    const store = storeOf(loadDraft(session));
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'b', 'answer') });
    const stale = startStaleBuild(store, { win, session, build: 'old' });
    const client = watchClient({ init: () => Promise.reject(noWorker()), answer: () => Promise.reject(noWorker()), stop() {} }, stale.hit);
    const stopRunner = startRunner({ store, client, local, onStale: stale.hit, q: 'b' });
    return { win, store, stop: () => { stopRunner(); stale.stop(); } };
  }

  it('startEffects starts the watch first, watches the worker client and tells the runner', () => {
    const src = readFileSync(join(process.cwd(), 'src/v7/effects/index.js'), 'utf8');
    const body = src.slice(src.indexOf('export function startEffects('));
    expect(body.indexOf('startStaleBuild(store')).toBeGreaterThan(-1);
    expect(body.indexOf('startStaleBuild(store')).toBeLessThan(body.indexOf('startAddress('));
    expect(body).toMatch(/const client = watchClient\(made, stale\.hit\)/);
    expect(body).toMatch(/startRunner\(\{ store, client, local, onStale: stale\.hit \}\)/);
  });

  it('a tab opened before the update: one reload with the figures kept, then the plain words — never "Sorry"', async () => {
    const session = tabStorage();
    // what was typed before the update, as the draft store keeps it in the tab
    const typed = storeOf();
    const stopDraft = startDraftStore(typed, session);
    for (const [path, value] of Object.entries(ALEX)) typed.dispatch(set(path, value, 'b'));
    stopDraft();
    expect(session.map.get(DRAFT_KEY)).toBeTruthy();

    // the old page meets the update: no worker started, and the answers' part cannot be loaded
    const one = page(session, { local: () => Promise.reject(CHROME) });
    await flush(); vi.advanceTimersByTime(10); await flush();
    expect(one.win.reloads).toBe(1);
    expect(one.store.getState().answers.b.status).toBe('working');
    one.stop();

    // the same tab, loaded again — still the old build: the figures are back, and the words, not "Sorry"
    const two = page(session, { local: () => Promise.reject(CHROME) });
    expect(two.store.getState().draft.b.values['you.pot']).toBe('50000');
    await flush(); vi.advanceTimersByTime(10); await flush();
    expect(two.win.reloads).toBe(0);
    const state = two.store.getState();
    expect(state.answers.b.status).toBe('failed');
    expect(state.env.stale).toBe(true);
    const { root, actions } = draw(state);
    const text = visibleText(root);
    expect(text).toContain(COMMON.stale.title);
    expect(text).toContain(COMMON.stale.body);
    expect(text).not.toMatch(/Sorry/);
    expect(root.querySelector('[data-testid="b.action.retry"]')).toBe(null);
    expect(root.querySelectorAll('[role="alert"]').length).toBe(1);             // in the answer's place, not twice
    root.querySelector('[data-testid="b.stale.reload"]').click();
    expect(actions).toContainEqual({ type: A.PAGE_RELOAD });
    two.stop();
  });
});

describe('the words', () => {
  it('in the answer\'s place when the question on screen failed; else at the top of the page', () => {
    const base = reduce(fresh(), { type: A.ENV_SET, patch: { stale: true } });
    expect(staleView(fresh())).toBe(null);
    expect(staleView(base)).toEqual({ top: true });
    const onPlans = reduce(base, { type: A.ROUTE_SET, route: route('plans') });
    const { root } = draw(onPlans);
    expect(root.querySelector('[data-testid="stale"]')).not.toBe(null);
    expect(visibleText(root)).toContain(COMMON.stale.title);
  });
  it('are plain, in our voice, and the same in both views', () => {
    expect(COMMON.stale).toEqual({ title: 'PensionTools has been updated since this page was opened.', body: 'Reload the page to carry on.', reload: 'Reload the page' });
    expect(staleWordsText()).toBe('PensionTools has been updated since this page was opened. Reload the page to carry on.');
  });
});

describe('the full view', () => {
  function classicWindow(session) {
    document.body.innerHTML = '<main id="classic">The full view</main>';
    const reloads = { n: 0 };
    const win = {
      document,
      sessionStorage: session,
      location: { reload: () => { reloads.n++; } },
      addEventListener: window.addEventListener.bind(window),
      removeEventListener: window.removeEventListener.bind(window)
    };
    return { win, reloads };
  }
  it('a part that cannot be loaded reloads the page once; the page that comes back as the same build shows the words', () => {
    const session = tabStorage();
    const a = classicWindow(session);
    const one = installStaleBuild(a.win, { build: 'old' });
    expect(session.writes).toBe(0);                              // nothing on open
    window.dispatchEvent(new Event('vite:preloadError'));
    expect(a.reloads.n).toBe(1);
    expect(document.querySelector('[data-testid="stale"]')).toBe(null);
    one.stop();

    const b = classicWindow(session);
    const two = installStaleBuild(b.win, { build: 'old' });
    window.dispatchEvent(new Event('vite:preloadError'));
    window.dispatchEvent(new Event('vite:preloadError'));
    expect(b.reloads.n).toBe(0);
    const box = document.querySelectorAll('[data-testid="stale"]');
    expect(box.length).toBe(1);
    expect(box[0].textContent).toContain(COMMON.stale.title);
    expect(box[0].textContent).not.toMatch(/Sorry/);
    box[0].querySelector('[data-testid="stale.reload"]').click();
    expect(b.reloads.n).toBe(1);
    two.stop();
  });
});
