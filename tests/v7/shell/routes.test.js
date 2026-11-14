/**
 * Addresses (V7 build brief 4.8): the round trip for every row, unknown → not found, no figure in any address,
 * and the address effect (the only code that reads or writes the address).
 */
import { describe, it, expect } from 'vitest';
import { parse, format, href, screenName, ROUTES, NOT_FOUND } from '../../../src/v7/router/routes.js';
import { QUESTIONS, BUILT } from '../../../src/v7/rail/questions.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { startAddress, classicQueryForward } from '../../../src/v7/effects/address.js';
import { LAYOUTS } from '../../../src/appLayout.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCHEMA_C } from '../c/_c.js';
import { fresh, set, route, fakeWindow, run, result } from './_shell.js';

const r = route;

/** Every row of the table in 4.8. */
const ROWS = [
  ['#/', r('front'), 'front'],
  ['#/c/numbers', r('step', 'c', 'numbers'), 'c.numbers'],
  ['#/c/answer', r('step', 'c', 'answer'), 'c.answer'],
  ['#/c/keep', r('step', 'c', 'keep'), 'c.keep'],
  ['#/a/numbers', r('step', 'a', 'numbers'), 'a.numbers'],
  ['#/a/answer', r('step', 'a', 'answer'), 'a.answer'],
  ['#/a/ages', r('step', 'a', 'ages'), 'a.ages'],
  ['#/a/keep', r('step', 'a', 'keep'), 'a.keep'],
  ['#/b/numbers', r('step', 'b', 'numbers'), 'b.numbers'],
  ['#/b/answer', r('step', 'b', 'answer'), 'b.answer'],
  ['#/b/choices', r('step', 'b', 'choices'), 'b.choices'],
  ['#/b/keep', r('step', 'b', 'keep'), 'b.keep'],
  // "Will it last?" (research/v7/answer-D.md; road-to-7.md step 7): three steps
  ['#/d/numbers', r('step', 'd', 'numbers'), 'd.numbers'],
  ['#/d/answer', r('step', 'd', 'answer'), 'd.answer'],
  ['#/d/keep', r('step', 'd', 'keep'), 'd.keep'],
  ...['e', 'f'].map((q) => [`#/soon/${q}`, r('soon', q), 'soon']),
  // the saved plans, read-only (research/v7/your-plan.md 4.2): the list, and one plan on its first step or a named one
  ['#/plans', { ...r('plans') }, 'plans'],
  ['#/plan/Kq8LwT2mJv5PzYc9BnRd', { ...r('plan'), planId: 'Kq8LwT2mJv5PzYc9BnRd' }, 'plan'],
  ['#/plan/guest-k3v9x1qa/month', { ...r('plan', null, 'month'), planId: 'guest-k3v9x1qa' }, 'plan.month'],   // Month by month draws its own screen (7.2.0)
  // the account page and What's new (road-to-7.md step 11)
  ['#/account', r('account'), 'account'],
  ['#/whats-new', r('news'), 'news'],
  // where every figure comes from (road-to-7.md step 11b)
  ['#/assumptions', r('assumptions'), 'assumptions']
];
const FOCUSED = [
  ['#/c/numbers?focus=you.age', r('step', 'c', 'numbers', 'you.age')],
  ['#/c/numbers?focus=partner.statePension.yearly', r('step', 'c', 'numbers', 'partner.statePension.yearly')],
  ['#/c/answer?focus=take', r('step', 'c', 'answer', 'take')],
  ['#/?focus=you.pot', r('front', null, null, 'you.pot')],
  // "Try the bad years" (7.9.0): the one section a plan page's address may name
  ['#/plan/Kq8LwT2mJv5PzYc9BnRd/lasts?focus=stress', { ...r('plan', null, 'lasts', 'stress'), planId: 'Kq8LwT2mJv5PzYc9BnRd' }]
];
const UNKNOWN = ['#/account/x', '#/account?focus=you.age', '#/whats-new/1', '#/whatsnew', '#/plan/abc123/c/answer', '#/plan/abc/nowhere', '#/plan/', '#/plan/a%20b', '#/plans/x', '#/plans?focus=you.age', '#/plan/abc?focus=you.age', '#/c', '#/c/', '#/c/nowhere', '#/soon/c', '#/soon/a', '#/soon/b', '#/soon/d', '#/soon/z', '#/soon', '#/x/y/z', '#nonsense', '#/d/spend', '#/d/ages',
  '#/c/answer/extra', '#/c/numbers?focus=', '#/c/numbers?focus=you.pot=250000', '#/c/numbers?pot=250000', '#/C/numbers', '#/c/numbers?focus=1',
  // C's unbuilt "ways" step left its rail at 7.0 (switch-readiness.md gate 3): an old link finds the front door
  '#/c/ways',
  // a plan page names no other section, on no other step (7.9.0)
  '#/plan/abc/lasts?focus=fall', '#/plan/abc/hold?focus=stress', '#/plan/abc/lasts?focus=you.age'];

describe('parse and format', () => {
  it.each(ROWS)('%s', (address, wanted, screen) => {
    expect(parse(address)).toEqual(wanted);
    expect(format(wanted)).toBe(address);
    expect(format(parse(address))).toBe(address);
    expect(parse(format(wanted))).toEqual(wanted);
    expect(screenName(wanted)).toBe(screen);
  });
  it.each(FOCUSED)('%s', (address, wanted) => {
    expect(parse(address)).toEqual(wanted);
    expect(format(parse(address))).toBe(address);
    expect(parse(format(wanted))).toEqual(wanted);
  });
  it('an empty address is the front door', () => {
    for (const h of ['', '#', '#/', undefined, null]) expect(parse(h)).toEqual(r('front'));
  });
  it.each(UNKNOWN)('unknown: %s → not found, which draws the front door', (address) => {
    expect(parse(address)).toEqual(NOT_FOUND);
    expect(screenName(parse(address))).toBe('front');
    expect(parse(format(parse(address)))).toEqual(NOT_FOUND);
  });
  it('unset fields are null, never undefined', () => {
    for (const [address] of [...ROWS, ...FOCUSED]) {
      const got = parse(address);
      expect(Object.keys(got).sort()).toEqual(['focus', 'planId', 'q', 'screen', 'step']);
      for (const v of Object.values(got)) expect(v).not.toBe(undefined);
    }
  });
  it('every kind of address in ROUTES is covered by a row above', () => {
    const screens = new Set([...ROWS.map(([, w]) => w.screen), 'notFound']);
    expect([...new Set(ROUTES.map((x) => x.screen))].sort()).toEqual([...screens].sort());
  });
  it('the shorthands build the same addresses', () => {
    expect(href.front()).toBe('#/');
    expect(href.step('c', 'numbers', 'you.age')).toBe('#/c/numbers?focus=you.age');
    expect(href.soon('e')).toBe('#/soon/e');
    expect(href.account()).toBe('#/account');
    expect(href.news()).toBe('#/whats-new');
    expect(href.assumptions()).toBe('#/assumptions');
    expect(href.plan('abc', 'lasts', 'stress')).toBe('#/plan/abc/lasts?focus=stress');
    expect(href.plan('abc', 'hold', 'stress'), 'no section of that name on that step').toBe('#/plan/abc/hold');
  });
});

describe('no figure ever appears in an address', () => {
  // A state full of figures: everything typed, an answer worked out.
  let full = fresh();
  for (const f of SCHEMA_C.fields) {
    const v = f.type === 'yesNo' ? true : f.type === 'choice' ? f.options[f.options.length - 1] : String(f.max ?? 99);
    full = reduce(full, set(f.path, f.path === 'household' ? 'couple' : v));
  }
  full = run(full, { type: A.ANSWER_WORKING, q: 'c', inputsKey: 'K' }, { type: A.ANSWER_FINAL, q: 'c', inputsKey: 'K', result: result(1380) });

  /** Every route a person can be on, with every field as the focus. */
  const reachable = [];
  const places = [r('front'), ...Object.values(BUILT).flatMap((q) => q.steps.map((s) => r('step', q.id, s.id))),
    ...QUESTIONS.filter((q) => !q.built).map((q) => r('soon', q.id)), r('notFound')];
  for (const place of places) {
    reachable.push(place);
    for (const f of SCHEMA_C.fields) reachable.push({ ...place, focus: f.path });
  }

  it('in any route reachable from a state full of figures', () => {
    expect(reachable.length).toBeGreaterThan(200);
    for (const place of reachable) {
      const s = reduce(full, { type: A.ROUTE_SET, route: place });
      const address = format(s.route);
      expect(address, address).not.toMatch(/\d/);
      expect(address).not.toMatch(/£|%/);
    }
  });
  it('a plan address carries the plan\'s id and nothing else: no figure, however full the state', () => {
    for (const step of [null, 'month', 'plan', 'household']) {
      const s = reduce(full, { type: A.ROUTE_SET, route: { ...r('plan', null, step), planId: 'Kq8LwT2mJv5PzYc9BnRd' } });
      const address = format(s.route);
      expect(address).toBe('#/plan/Kq8LwT2mJv5PzYc9BnRd' + (step ? '/' + step : ''));
      expect(address.replace('Kq8LwT2mJv5PzYc9BnRd', '')).not.toMatch(/\d/);
    }
  });
  it('nor after the button is pressed', () => {
    const s = reduce(run(fresh(), set('you.pot', '250000'), set('you.age', '58')), { type: A.DRAFT_ASK, q: 'c' });
    expect(format(s.route)).toBe('#/c/answer');
  });
  it('an address that tries to carry a figure is not understood', () => {
    expect(parse('#/c/answer?pot=250000').screen).toBe('notFound');
    expect(parse('#/c/numbers?focus=250000').screen).toBe('notFound');
    expect(format({ ...r('step', 'c', 'numbers'), focus: '250000' })).toBe('#/c/numbers');
  });
});

describe('the address effect', () => {
  const start = (hash) => {
    const win = fakeWindow(hash);
    const store = createStore(fresh(), reduce);
    const stop = startAddress(store, win);
    return { win, store, stop };
  };

  it('reads the address at start-up', () => {
    const { store } = start('#/c/numbers?focus=you.age');
    expect(store.getState().route).toEqual(r('step', 'c', 'numbers', 'you.age'));
  });
  it('an empty address is left alone (no extra entry for the back button)', () => {
    const { store, win } = start('');
    expect(store.getState().route.screen).toBe('front');
    expect(win.entries).toEqual(['']);
  });
  it('a change of address becomes a route', () => {
    const { store, win } = start('#/');
    win.go('#/c/answer');
    expect(store.getState().route).toEqual(r('step', 'c', 'answer'));
    win.go('#/soon/e');
    expect(store.getState().route).toEqual(r('soon', 'e'));
  });
  it('a change of route becomes an address, as a new entry', () => {
    const { store, win } = start('#/c/numbers');
    store.dispatch(set('you.pot', '250000'));
    store.dispatch(set('you.age', '58'));
    expect(win.entries).toEqual(['#/c/numbers']);
    store.dispatch({ type: A.DRAFT_ASK, q: 'c' });
    expect(win.location.hash).toBe('#/c/answer');
    expect(win.entries).toEqual(['#/c/numbers', '#/c/answer']);
  });
  it('a state change that lands before a new address\'s "hashchange" never writes the old route over it (6.27.1)', () => {
    // A browser fires "hashchange" a moment after the address changes. On a slow runner the crawl saw "#/plans"
    // become "#/not-found": the person left the not-found page, a state change landed, and the effect wrote the
    // state's (old) route back. The coming "hashchange" is what reconciles the two.
    const { store, win } = start('#/no-such-page');
    expect(win.location.hash).toBe('#/not-found');
    win.entries.push('#/plans');                     // the address has changed; its "hashchange" has not fired yet
    store.dispatch({ type: A.UI_ONLINE, online: false });   // any state change in that moment
    expect(win.location.hash).toBe('#/plans');
    expect(win.entries).toEqual(['#/not-found', '#/plans']);
    win.listeners.hashchange.forEach((fn) => fn({ type: 'hashchange' }));   // now it fires
    expect(store.getState().route.screen).toBe('plans');
    expect(win.location.hash).toBe('#/plans');
    // and the app's own moves still write the address
    win.go('#/c/numbers');
    store.dispatch(set('you.pot', '250000'));
    store.dispatch(set('you.age', '58'));
    store.dispatch({ type: A.DRAFT_ASK, q: 'c' });
    expect(win.location.hash).toBe('#/c/answer');
  });
  it('back works', () => {
    const { store, win } = start('#/');
    win.go('#/c/numbers');
    win.go('#/c/answer');
    win.history.back();
    expect(store.getState().route).toEqual(r('step', 'c', 'numbers'));
    expect(win.entries).toEqual(['#/', '#/c/numbers']);
  });
  it('an unknown address is tidied in place, so the back button is not trapped', () => {
    const { store, win } = start('#/');
    win.go('#/plan/abc/c/answer');
    expect(store.getState().route.screen).toBe('notFound');
    expect(win.entries).toEqual(['#/', '#/not-found']);
    win.history.back();
    expect(store.getState().route.screen).toBe('front');
  });
  it('after it is stopped it neither reads nor writes', () => {
    const { store, win, stop } = start('#/');
    stop();
    win.go('#/c/answer');
    expect(store.getState().route.screen).toBe('front');
    store.dispatch({ type: A.ROUTE_SET, route: r('soon', 'a') });
    expect(win.location.hash).toBe('#/c/answer');
  });
});

describe('a link made for the classic page when it was the site\'s root (before 7.0)', () => {
  /** Where the browser lands: the forward resolved from the page it was asked of, or null. */
  const landing = (href, layout = LAYOUTS.switch) => {
    const u = new URL(href);
    const to = classicQueryForward({ search: u.search, hash: u.hash }, layout);
    return to === null ? null : new URL(to, href).href;
  };

  it('?demo=, ?signup=1 and ?signin=1 go on to the classic planner, the query and any #… part kept, from the folder or its index.html', () => {
    expect(landing('https://site.test/?demo=1m')).toBe('https://site.test/classic/?demo=1m');
    expect(landing('https://site.test/index.html?demo=1m')).toBe('https://site.test/classic/?demo=1m');
    expect(landing('https://site.test/?signup=1')).toBe('https://site.test/classic/?signup=1');
    expect(landing('https://site.test/?signin=1#top')).toBe('https://site.test/classic/?signin=1#top');
    // the mirror serves the site under a path: the forward is relative, so it stays there
    expect(landing('https://mirror.test/pensiontools/?demo=1m')).toBe('https://mirror.test/pensiontools/classic/?demo=1m');
  });
  it('any other address is this page\'s own: no query, another query, or the classic page\'s options with a value it never acted on', () => {
    for (const href of ['https://site.test/', 'https://site.test/#/plans', 'https://site.test/?x=1#/c/numbers', 'https://site.test/?signup=0', 'https://site.test/?signin=yes', 'https://site.test/?demo=']) {
      expect(landing(href), href).toBe(null);
    }
    expect(classicQueryForward(undefined)).toBe(null);
    expect(classicQueryForward({})).toBe(null);
  });
  it('in the rollback layout the root is the classic page itself, so V7 (at /v7/) passes nothing on', () => {
    expect(landing('https://site.test/v7/?demo=1m', LAYOUTS.preview)).toBe(null);
    expect(landing('https://site.test/v7/?signin=1', LAYOUTS.preview)).toBe(null);
  });
  it('the start-up asks before anything is drawn, and draws nothing when it forwards', () => {
    const main = readFileSync(join(process.cwd(), 'src/v7/main.jsx'), 'utf8');
    const at = main.indexOf('classicQueryForward(window.location)');
    expect(at).toBeGreaterThan(-1);
    expect(main.slice(at, at + 120)).toMatch(/if \(forward\) \{ window\.location\.replace\(forward\); return; \}/);
    expect(at).toBeLessThan(main.indexOf('render(<App'));
    expect(at).toBeLessThan(main.indexOf('startEffects('));
  });
});
