/**
 * A saving plan's home is not "ready" until its answer is the final one, and says so while it shows a first figure
 * (7.12.0; the round-3 walk of Jo, 33: straight after signing in the home read "23.5% of your pay in all (… £744 …)" while
 * What you pay in read "23% (… £728 …)" for the same plan — the home was showing the 100-futures first figure with nothing
 * to say so, and the page was marked ready). The same rule as What you pay in and "Does it last?" (select.js readyMark).
 */
import { describe, it, expect } from 'vitest';
import { initialState, cleanSaver } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { readyMark } from '../../../src/v7/state/select.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { SAVING } from '../../../src/v7/copy/saving.js';

const home = (saver) => ({
  ...initialState({ today: '2026-11-17', build: 'test' }),
  route: { screen: 'plan', planId: 'Jo33', step: null },
  plans: { status: 'read', list: [], view: { page: { forId: 'Jo33', saver: { ok: true, key: 'k1' } } } },
  saver
});

describe('the home of a saving plan waits for the final answer', () => {
  it('no run yet, or a first figure: not ready', () => {
    expect(readyMark(home(null)).ready).toBe('0');
    expect(readyMark(home({ key: 'k1', status: 'idle', result: null })).ready).toBe('0');
    expect(readyMark(home({ key: 'k1', status: 'working', result: {} })).ready).toBe('0');
  });
  it('the final answer for this plan\'s key, or a failure: ready', () => {
    expect(readyMark(home({ key: 'k1', status: 'final', result: {} })).ready).toBe('1');
    expect(readyMark(home({ key: 'k1', status: 'failed', result: null })).ready).toBe('1');
  });
  it('the final answer for another key (figures since changed): not ready', () => {
    expect(readyMark(home({ key: 'old', status: 'final', result: {} })).ready).toBe('0');
  });
  it('no first figure is ever shown or said (lead4.md R6): the saver\'s run is one pass, and a first status is not kept', () => {
    expect(HOME.saver.first).toBeUndefined();
    expect(SAVING.verdict.first).toBeUndefined();
    expect(A.SAVER_FIRST).toBeUndefined();
    expect(cleanSaver({ key: 'k1', status: 'first', result: {} }).status).toBe('idle');
  });
});
