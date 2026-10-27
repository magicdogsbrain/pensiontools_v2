/**
 * What's new in V7 (research/v7/road-to-7.md step 11): the planner's rules exactly, with the releases handed in — the
 * pop-up once per page life on a sign-in (the account's plans and the settings document read) or a visitor's start (plans of
 * their own in this window); only the announced releases newer than the highest version seen (the local mark, the account's,
 * the higher of the two; a higher local mark carried over to the account); a new account and a first-visit visitor marked seen
 * silently, never a pop-up; "Got it" marks the version seen (the local mark, and news/seen for the account effect's one write);
 * the page holds every release as plain data and reading it marks seen when there was something new; the page's data leaves
 * with the page. Then the drawings: the pop-up, the page, the notes quoted as written.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { startWhatsNew, plainRelease, SEEN_KEY, ANNOUNCE_TO_FIRST_VISIT_GUESTS } from '../../../src/v7/effects/whatsNew.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { newsView } from '../../../src/v7/state/select.js';
import { RELEASES, releasesSince, isAnnounced, compareVersions } from '../../../src/releases.js';
import { RELEASE_HISTORY } from '../../../src/releases-history.js';
import { VERSION } from '../../../src/constants.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { NEWS } from '../../../src/v7/copy/news.js';
import { corpus } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const DRAFT = C['02-pnv-draft'];
const EXAMPLE = { ...JSON.parse(JSON.stringify(C['11-guest-demo'])), id: 'guest-example1', example: true, isActive: false };

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return { calls, map, getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; }, setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); }, removeItem(k) { calls.push(['removeItem', k]); map.delete(k); }, raw: (k) => map.get(k) };
}
/** Three releases to announce or not: 7.1.0 (announced), 7.0.1 (a fix), 7.0.0 (announced), and one of the history. */
const RELS = [
  { version: '7.1.0', date: '2027-01-10', engineVersion: '7.0.0', title: 'Seven point one', summary: 'S1', changes: ['c1'], corrections: [], effects: { stress: ['e'], budget: [], strategies: [], decision: [], accumulation: [], household: [] }, actions: ['a1'], notes: ['n1'], affects: () => ['x'] },
  { version: '7.0.1', date: '2027-01-03', engineVersion: '7.0.0', title: 'A fix', summary: 'S2', changes: [], corrections: ['fixed'], effects: { stress: [], budget: [], strategies: [], decision: [], accumulation: [], household: [] }, actions: [], notes: [] },
  { version: '7.0.0', date: '2027-01-01', engineVersion: '7.0.0', title: 'Seven', summary: 'S3', changes: ['c3'], corrections: [], effects: { stress: [], budget: [], strategies: [], decision: [], accumulation: [], household: [] }, actions: [], notes: [] }
];
const HIST = [{ version: '6.0.10', date: '2026-08-29', reconstructed: true, announce: false, title: 'Old', summary: 'S0', changes: ['c0'], corrections: [] }];
const fakeLoad = () => Promise.resolve({ RELEASES: RELS, RELEASE_HISTORY: HIST, releasesSince: (seen) => releasesSince(seen, RELS), isAnnounced, compareVersions });

function page({ session = 'nobody', raws = [DRAFT], local = storage(), profile = undefined, hash = '#/plans', version = '7.1.0', load = fakeLoad } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse(hash) });
  const actions = [];
  store.subscribe((s, a) => actions.push(a));
  const stop = startWhatsNew(store, { local, load, version });
  const signedIn = session === 'in';
  if (session !== 'none') store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: signedIn ? 'a@b.c' : null } });
  if (session === 'in' || session === 'nobody') { store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source: signedIn ? 'account' : 'window', readAt: '14:03' }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); }
  if (profile !== undefined) store.dispatch({ type: A.PROFILE_SET, profile });
  return { store, local, actions, stop, popup: () => store.getState().ui.news.popup, types: () => actions.map((a) => a.type), seen: () => actions.filter((a) => a.type === A.NEWS_SEEN).map((a) => a.version) };
}

describe('the pop-up: the planner\'s rules', () => {
  it('a first-visit visitor with plans of their own: nothing seen → marked seen silently (the local mark set to this version), no pop-up', async () => {
    const p = page();
    await tick();
    expect(ANNOUNCE_TO_FIRST_VISIT_GUESTS).toBe(false);
    expect(p.popup()).toBe(null);
    expect(p.local.raw(SEEN_KEY)).toBe('7.1.0');
    expect(p.seen()).toEqual([]);
    p.stop();
  });
  it('a visitor who has seen 7.0.0: the pop-up holds 7.1.0 only (the fix release left out), as plain data; "Got it" marks 7.1.0 seen; never a second pop-up this page life', async () => {
    const p = page({ local: storage({ [SEEN_KEY]: '7.0.0' }) });
    await tick();
    expect(p.popup().map((r) => r.version)).toEqual(['7.1.0']);
    expect(JSON.parse(JSON.stringify(p.popup()))).toEqual(p.popup());
    expect(typeof p.popup()[0].affects).toBe('undefined');
    p.store.dispatch({ type: A.NEWS_DISMISS });
    await tick();
    expect(p.popup()).toBe(null);
    expect(p.local.raw(SEEN_KEY)).toBe('7.1.0');
    expect(p.seen()).toEqual([]);   // nobody signed in: no news/seen for the account
    p.store.dispatch({ type: A.PLANS_READING });
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList([DRAFT], NOW), source: 'window', readAt: '14:05' });
    await tick();
    expect(p.popup()).toBe(null);
    p.stop();
  });
  it('a visitor with nothing seen and two releases behind: both announced releases, newest first', async () => {
    const p = page({ local: storage({ [SEEN_KEY]: '6.44.0' }) });
    await tick();
    expect(p.popup().map((r) => r.version)).toEqual(['7.1.0', '7.0.0']);
    p.stop();
  });
  it('the example plan alone is not a visitor\'s start; the questions\' pages, with no plans read, announce nothing', async () => {
    const p = page({ raws: [EXAMPLE], local: storage({ [SEEN_KEY]: '7.0.0' }) });
    await tick();
    expect(p.popup()).toBe(null);
    expect(p.local.raw(SEEN_KEY)).toBe('7.0.0');
    const q = page({ session: 'none', hash: '#/', local: storage({ [SEEN_KEY]: '7.0.0' }) });
    await tick();
    expect(q.popup()).toBe(null);
    p.stop(); q.stop();
  });
  it('signed in: waits for the settings document; a new account (no plans, nothing seen) is marked seen silently — the local mark, and news/seen for the account', async () => {
    const p = page({ session: 'in', raws: [] });
    await tick();
    expect(p.popup()).toBe(null);
    expect(p.local.raw(SEEN_KEY)).toBeUndefined();
    p.store.dispatch({ type: A.PROFILE_SET, profile: { lastSeenVersion: null } });
    await tick();
    expect(p.popup()).toBe(null);
    expect(p.local.raw(SEEN_KEY)).toBe('7.1.0');
    expect(p.seen()).toEqual(['7.1.0']);
    p.stop();
  });
  it('signed in with plans: the account\'s mark decides when higher (and is copied to the local mark); a higher local mark is carried over to the account; "Got it" writes both', async () => {
    const p = page({ session: 'in', local: storage({ [SEEN_KEY]: '6.44.0' }), profile: { lastSeenVersion: '7.0.0' } });
    await tick();
    expect(p.local.raw(SEEN_KEY)).toBe('7.0.0');
    expect(p.popup().map((r) => r.version)).toEqual(['7.1.0']);
    p.store.dispatch({ type: A.NEWS_DISMISS });
    await tick();
    expect(p.seen()).toEqual(['7.1.0']);
    expect(p.local.raw(SEEN_KEY)).toBe('7.1.0');
    const q = page({ session: 'in', local: storage({ [SEEN_KEY]: '7.0.0' }), profile: { lastSeenVersion: '6.44.0' } });
    await tick();
    expect(q.seen()).toEqual(['7.0.0']);                  // the visitor who made an account: the local mark carried over
    expect(q.popup().map((r) => r.version)).toEqual(['7.1.0']);
    const r = page({ session: 'in', local: storage({ [SEEN_KEY]: '7.1.0' }), profile: { lastSeenVersion: '7.1.0' } });
    await tick();
    expect(r.popup()).toBe(null);
    p.stop(); q.stop(); r.stop();
  });
  it('the releases cannot be loaded: nothing announced, nothing marked', async () => {
    const p = page({ local: storage({ [SEEN_KEY]: '7.0.0' }), load: () => Promise.reject(new Error('offline')) });
    await tick();
    expect(p.popup()).toBe(null);
    expect(p.local.raw(SEEN_KEY)).toBe('7.0.0');
    p.stop();
  });
});

describe('the page: every release as plain data; reading it marks seen; the data leaves with the page', () => {
  it('on #/whats-new the releases and the history are put in the state (no function among them); the page read marks this version seen when something was new; leaving takes the data out', async () => {
    const p = page({ hash: '#/whats-new', session: 'none', local: storage({ [SEEN_KEY]: '7.0.0' }) });
    await tick();
    const page1 = newsView(p.store.getState()).page;
    expect(page1.releases.map((r) => r.version)).toEqual(['7.1.0', '7.0.1', '7.0.0']);
    expect(page1.history.map((r) => r.version)).toEqual(['6.0.10']);
    expect(page1.releases[0].announced).toBe(true);
    expect(page1.releases[1].announced).toBe(false);
    expect(page1.history[0].reconstructed).toBe(true);
    expect(JSON.parse(JSON.stringify(page1))).toEqual(page1);
    expect(p.local.raw(SEEN_KEY)).toBe('7.1.0');
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/') });
    await tick();
    expect(newsView(p.store.getState()).page).toBe(null);
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/whats-new') });
    await tick();
    expect(newsView(p.store.getState()).page.releases.length).toBe(3);
    p.stop();
  });
  it('the real notes: every release of src/releases.js and the history becomes plain data with the fields the page draws, the engine version among them', () => {
    for (const r of [...RELEASES, ...RELEASE_HISTORY]) {
      const pl = plainRelease(r);
      expect(JSON.parse(JSON.stringify(pl))).toEqual(pl);
      expect(pl.version).toBe(r.version);
      expect(pl.title).toBe(r.title);
      expect(pl.date).toBe(r.date);
      if (!r.reconstructed) { expect(pl.engineVersion).toBe(r.engineVersion); expect(pl.effects).not.toBe(null); expect(pl.announced).toBe(isAnnounced(r)); }
      expect(Object.keys(pl).sort()).toEqual(['actions', 'announced', 'changes', 'corrections', 'date', 'effects', 'engineVersion', 'notes', 'reconstructed', 'summary', 'title', 'version']);
    }
    expect(RELEASES[0].version).toBe(VERSION);
  });
});

// ---- the drawings ---------------------------------------------------------------------------------------------------------

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
const q = (root, sel) => root.querySelector(sel);
const plain = RELS.map(plainRelease);
const SCOPES = ['all', 'first', 'planner', 'retired', 'saver', 'record'];
/** The page's own words: the quoted notes taken out. */
const ownWords = (root) => { const c = root.cloneNode(true); for (const el of c.querySelectorAll('[data-quoted]')) el.remove(); return visibleText(c); };

describe('the drawings', () => {
  it('the pop-up on any page: the heading for one release or several, the newest open, "Got it" and "See every version" (which also dismisses); the notes quoted', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/') });
    const one = draw(reduce(s, { type: A.NEWS_SHOW, entries: [plain[0]] }));
    const box = q(one.root, '[data-testid="news.popup"]');
    expect(box.textContent).toContain('What’s new in version 7.1.0');
    expect(q(box, '[data-testid="news.release.7.1.0"]').open).toBe(true);
    expect(q(box, '[data-quoted="release"]').textContent).toContain('S1');
    q(box, '[data-testid="news.gotIt"]').click();
    expect(one.actions).toEqual([{ type: 'news/dismiss' }]);
    expect(q(box, '[data-testid="news.seeAll"]').getAttribute('href')).toBe('#/whats-new');
    const many = draw(reduce(s, { type: A.NEWS_SHOW, entries: [plain[0], plain[2]] }));
    expect(q(many.root, '[data-testid="news.popup"]').textContent).toContain('What’s new since you were last here (versions 7.0.0 to 7.1.0)');
    expect(q(many.root, '[data-testid="news.release.7.0.0"]').open).toBe(false);
    for (const hit of bannedHits(ownWords(many.root), SCOPES)) expect(hit).toBe('');
  });
  it('the page: the version you are on, every release (newest open, a fix marked, the engine named), the parts of the planner in V7\'s names with the unaffected ones named, the history under it; opening: a waiting line', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/whats-new') });
    const waiting = draw(s);
    expect(q(waiting.root, 'main').getAttribute('data-screen')).toBe('news');
    expect(q(waiting.root, '[data-testid="news.opening"]')).not.toBe(null);
    expect(q(waiting.root, '[data-testid="news.current"]').textContent).toBe('You are on version ' + VERSION + '.');
    const { root, text } = draw(reduce(s, { type: A.NEWS_PAGE, releases: plain, history: HIST.map(plainRelease) }));
    expect(q(root, '[data-testid="news.page"]').getAttribute('data-count')).toBe('3');
    expect(q(root, '[data-testid="news.release.7.1.0"]').open).toBe(true);
    expect(q(root, '[data-testid="news.release.7.0.1"]').open).toBe(false);
    expect(q(root, '[data-testid="news.release.7.0.1"] summary').textContent).toContain(NEWS.fix);
    expect(q(root, '[data-testid="news.release.7.1.0"] summary').textContent).toContain('engine 7.0.0');
    expect(q(root, '[data-testid="news.release.7.1.0"]').textContent).toContain(NEWS.tools.stress);
    expect(q(root, '[data-testid="news.release.7.1.0"]').textContent).toContain('No effect on kept plans in: ' + ['budget', 'strategies', 'decision', 'accumulation', 'household'].map((t) => NEWS.tools[t]).join(', ') + '.');
    expect(q(root, '[data-testid="news.history"]')).not.toBe(null);
    expect(q(root, '[data-testid="news.release.6.0.10"]').classList.contains('rn-reconstructed')).toBe(true);
    expect(text).toContain('10 January 2027');
    expect(q(root, 'input, select, textarea')).toBe(null);
    for (const hit of bannedHits(ownWords(root), SCOPES)) expect(hit).toBe('');
    // the real notes draw without a throw, every one quoted
    const real = draw(reduce(s, { type: A.NEWS_PAGE, releases: RELEASES.map(plainRelease), history: RELEASE_HISTORY.map(plainRelease) }));
    expect(real.root.querySelectorAll('[data-quoted="release"]').length).toBe(RELEASES.length + RELEASE_HISTORY.length);
    expect(q(real.root, '[data-testid="news.release.' + VERSION + '"]').open).toBe(true);
  });
  it('the footer of every page links to the page with the version; the header to the account page', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/') });
    const { root } = draw(s);
    expect(q(root, '[data-testid="nav.whatsNew"]').getAttribute('href')).toBe('#/whats-new');
    expect(q(root, '[data-testid="nav.whatsNew"]').textContent).toBe('What’s new (version ' + VERSION + ')');
    expect(q(root, '[data-testid="nav.account"]').getAttribute('href')).toBe('#/account');
    expect(q(root, '.brand').textContent).toBe('Drawdown Planner');
  });
});
