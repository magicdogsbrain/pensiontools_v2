/**
 * The link at the top of every page is a choice (7.12.0, src/ui/viewSwitch.js): pressing "Back to the simple view." or
 * "Show everything." leaves a one-shot note in the window; the view that arrives saves the choice once, for someone signed in.
 */
import { describe, it, expect, vi } from 'vitest';
import { noteViewSwitch, takeViewSwitch, followViewSwitch, viewChoiceToSave, VIEW_SWITCH_KEY } from '../src/ui/viewSwitch.js';
import { createStore } from '../src/v7/effects/store.js';
import { initialState } from '../src/v7/state/initial.js';
import { reduce } from '../src/v7/state/reduce.js';
import { A } from '../src/v7/state/actions.js';
import { startView } from '../src/v7/effects/view.js';

function storage(init = {}) {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m };
}

describe('the note and the one write', () => {
  it('a press leaves the note; it is taken once', () => {
    const s = storage();
    noteViewSwitch('simple', s);
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe('simple');
    expect(takeViewSwitch(s)).toBe('simple');
    expect(takeViewSwitch(s)).toBe(null);
    noteViewSwitch('sideways', s);
    expect(s.m.size).toBe(0);
  });

  it('the note "simple" and settings with no view: one write { view: "simple" }, and the note is gone', () => {
    const s = storage({ [VIEW_SWITCH_KEY]: 'simple' });
    const save = vi.fn(async () => {});
    expect(followViewSwitch({ lastSeenVersion: '7.11.1' }, { session: s, save, signedIn: true })).toBe('simple');
    expect(save.mock.calls).toEqual([[{ view: 'simple' }]]);
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe(null);
  });

  it('no note: no write; the view already held: no write, the note gone', () => {
    const save = vi.fn();
    expect(followViewSwitch({ view: 'full' }, { session: storage(), save, signedIn: true })).toBe(null);
    const s = storage({ [VIEW_SWITCH_KEY]: 'full' });
    expect(followViewSwitch({ view: 'full' }, { session: s, save, signedIn: true })).toBe(null);
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe(null);
    expect(save).not.toHaveBeenCalled();
    expect(viewChoiceToSave(null, 'full')).toBe('full');
  });

  it('a guest: nothing written, the note gone', () => {
    const s = storage({ [VIEW_SWITCH_KEY]: 'simple' });
    const save = vi.fn();
    expect(followViewSwitch(null, { session: s, save, signedIn: false })).toBe(null);
    expect(save).not.toHaveBeenCalled();
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe(null);
  });
});

describe('the simple view, arriving from "Back to the simple view."', () => {
  const setUp = (note) => {
    const store = createStore(initialState({ today: '2026-11-16', build: 'test' }), reduce);
    const session = storage(note ? { [VIEW_SWITCH_KEY]: note } : {});
    const local = storage();
    const seen = [];
    store.subscribe((state, action) => { if (action.type === A.VIEW_SET) seen.push(action.view); });
    const stop = startView(store, { local, session });
    return { store, session, local, seen, stop };
  };
  const signIn = (store, profile) => {
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'sam@example.test' } });
    store.dispatch({ type: A.PROFILE_SET, profile });
  };

  it('saves the simple view once the account\'s settings are read (it held none: the full view by default)', () => {
    const p = setUp('simple');
    signIn(p.store, { lastSeenVersion: null });
    expect(p.seen).toEqual(['simple']);
    expect(p.store.getState().ui.profile.view).toBe('simple');
    expect(p.session.getItem(VIEW_SWITCH_KEY)).toBe(null);
    expect(p.local.getItem('pt_view')).toBe(null);   // this browser's copy follows: no longer 'full'
    p.stop();
  });

  it('without the note, nothing is chosen', () => {
    const p = setUp(null);
    signIn(p.store, { lastSeenVersion: null });
    expect(p.seen).toEqual([]);
    p.stop();
  });

  it('nobody signed in: the note is let go, nothing chosen', () => {
    const p = setUp('simple');
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(p.session.getItem(VIEW_SWITCH_KEY)).toBe(null);
    expect(p.seen).toEqual([]);
    p.stop();
  });

  it('"Show everything." pressed: the note is left in the window for the full view', () => {
    const p = setUp(null);
    p.store.dispatch({ type: A.VIEW_LINK, view: 'full' });
    expect(p.session.getItem(VIEW_SWITCH_KEY)).toBe('full');
    p.stop();
  });
});

// (wrap-up) a figure typed and the link pressed straight away: the save waiting goes first,
// then the page moves; a save that is refused keeps the person on the page, where the box says why
import { leaveForView } from '../src/ui/viewSwitch.js';
describe('the link waits for what was typed', () => {
  const press = (over = {}) => { const e = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, prevented: false, preventDefault() { this.prevented = true; }, ...over }; return e; };
  it('a plain press: the flush first, then the move, then the note', async () => {
    const s = storage();
    const seen = [];
    let done;
    const flush = () => { seen.push('flush'); return new Promise((r) => { done = () => { seen.push('saved'); r(['saved', 'nothing', undefined]); }; }); };
    const e = press();
    const p = leaveForView(e, 'simple', '../#/plan/A1', { flush, go: (h) => seen.push('go ' + h), session: s });
    expect(e.prevented).toBe(true);
    await Promise.resolve();
    expect(seen).toEqual(['flush']);
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe(null);
    done();
    expect(await p).toBe('went');
    expect(seen).toEqual(['flush', 'saved', 'go ../#/plan/A1']);
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe('simple');
  });
  it('a save refused (a box with a problem, a write that failed): the page stays and nothing is noted', async () => {
    for (const out of ['problem', 'notSaved']) {
      const s = storage();
      const went = [];
      const e = press();
      expect(await leaveForView(e, 'full', './classic/', { flush: async () => [out], go: (h) => went.push(h), session: s })).toBe('stay');
      expect(went).toEqual([]);
      expect(s.getItem(VIEW_SWITCH_KEY)).toBe(null);
    }
    const went = [];
    expect(await leaveForView(press(), 'full', './classic/', { flush: async () => { throw new Error('offline'); }, go: (h) => went.push(h), session: storage() })).toBe('stay');
    expect(went).toEqual([]);
  });
  it('a press for a new tab is the plain link: noted, nothing held', async () => {
    const s = storage();
    const e = press({ metaKey: true });
    let flushed = false;
    expect(await leaveForView(e, 'simple', '../#/', { flush: async () => { flushed = true; }, go: () => { throw new Error('no'); }, session: s })).toBe('link');
    expect(e.prevented).toBe(false);
    expect(flushed).toBe(false);
    expect(s.getItem(VIEW_SWITCH_KEY)).toBe('simple');
  });
});
