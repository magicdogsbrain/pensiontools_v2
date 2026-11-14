/**
 * The header's "Use the previous version" on a plan page (7.3.2): it opens the classic planner on THE PLAN ON SCREEN, at
 * the page matching the step, through the same hand-over as "Change this" (plan/change). Before 7.3.2 it was a plain
 * address, so the classic planner opened the account's usual plan on its own last tab — another plan than the one viewed.
 * Off a plan page it stays the plain address.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { PLAN_STEPS, PLAN_SUB_STEPS, parse } from '../../../src/v7/router/routes.js';
import { PLACES, makeRequest } from '../../../src/services/OpenPlace.js';
import { PREVIOUS_STEP_PLACE as STEP_PLACE, previousLinkView } from '../../../src/v7/state/select.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));

function draw(stored, address) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  if (address) state = reduce(state, { type: A.ROUTE_SET, route: parse(address) });
  state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  const root = document.createElement('div');
  root.id = 'app';
  const out = [];
  render(h(App, { state, dispatch: (a) => out.push(a) }), root);
  return { state, root, actions: out };
}
const click = (el, o = {}) => { const e = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...o }); el.dispatchEvent(e); return e; };

describe('previousPlace: every step of a plan names a page the planner has', () => {
  it('each step and sub-step maps to a PLACES key (the home and "plan" by the plan\'s opening tab)', () => {
    for (const s of [...new Set([...PLAN_STEPS, ...PLAN_SUB_STEPS])]) {
      if (s === 'plan') continue;
      expect(STEP_PLACE[s], s).toBeTruthy();
      expect(PLACES[STEP_PLACE[s]], s).toBeTruthy();
    }
  });
  it('the home of a drawing plan opens Month by month; a locked saver\'s their saving page; a step its own page', () => {
    const at = (name, address) => { const st = load(name); return previousLinkView(draw(st, address).state); };
    expect(at('home-drawing').place).toBe('month');
    expect(at('home-locked-saver').place).toBe('saving');
    const id = load('home-drawing').route.planId;
    expect(at('home-drawing', `#/plan/${id}/lasts`).place).toBe('test');
    // "Try the bad years" named in the address (7.9.0): the planner's Scenarios page; back to "Does it last?"
    expect(at('home-drawing', `#/plan/${id}/lasts?focus=stress`)).toEqual({ planId: id, place: 'badYears', back: `#/plan/${id}/lasts` });
    expect(at('home-drawing', `#/plan/${id}/where`).place).toBe('document');
    expect(at('home-drawing', '#/plans')).toBeNull();
  });
});

describe('the header link on a plan page hands over THAT plan', () => {
  it('on a plan\'s home: plan/change with the plan on screen, its place and the way back; the request is valid', () => {
    const stored = load('home-drawing');
    const { root, actions, state } = draw(stored);
    for (const id of ['nav.previous', 'nav.previousShort']) {
      actions.length = 0;
      const e = click(root.querySelector(`[data-testid="${id}"]`));
      expect(e.defaultPrevented, id).toBe(true);
      expect(actions, id).toEqual([{ type: 'plan/change', planId: state.route.planId, place: 'month', back: `#/plan/${state.route.planId}` }]);
      expect(makeRequest({ planId: state.route.planId, place: 'month', back: `#/plan/${state.route.planId}`, at: new Date().toISOString() })).not.toBeNull();
    }
  });
  it('on a step: the matching page, and the way back to that step', () => {
    const stored = load('home-drawing');
    const id = stored.route.planId;
    const { root, actions } = draw(stored, `#/plan/${id}/lasts`);
    click(root.querySelector('[data-testid="nav.previous"]'));
    expect(actions).toEqual([{ type: 'plan/change', planId: id, place: 'test', back: `#/plan/${id}/lasts` }]);
  });
  it('a new-tab click (ctrl/cmd) keeps the plain address, as does any page that is not a plan', () => {
    const stored = load('home-drawing');
    const { root, actions } = draw(stored);
    const e = click(root.querySelector('[data-testid="nav.previous"]'), { metaKey: true });
    expect(e.defaultPrevented).toBe(false);
    expect(actions).toEqual([]);
    const off = draw(stored, '#/plans');
    const e2 = click(off.root.querySelector('[data-testid="nav.previous"]'));
    expect(e2.defaultPrevented).toBe(false);
    expect(off.actions.filter((a) => a.type === 'plan/change')).toEqual([]);
  });
});
