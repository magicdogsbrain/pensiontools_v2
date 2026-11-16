/**
 * A closed plan is never the main plan (7.12.0): its row under "Previous plans" offers no "Make this my main plan", and the
 * action is refused for it. Made-up plans from the fixtures.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';

const TODAY = '2026-11-16';
const raw = (name) => JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8'));

function withPlans() {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  const closed = { ...raw('18-moved-to-new-plan'), isActive: false };
  const next = { ...raw('18-moved-to-new-plan-next'), isActive: true };
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'kim@example.test' } });
  store.dispatch({ type: A.PROFILE_SET, profile: { view: 'simple', lastSeenVersion: null } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList([closed, next], new Date(2026, 10, 16, 12)), source: 'account', readAt: '12:00' });
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  return { store, closed, next };
}

describe('a closed plan is never the main plan', () => {
  it('"Make this my main plan" is refused for it (before: a write was started)', () => {
    const { store, closed } = withPlans();
    store.dispatch({ type: A.PLAN_MAIN, planId: closed.id });
    expect(store.getState().ui.saving).toBe(null);
  });
  it('is still started for an open plan that is not the main one', () => {
    const { store, next } = withPlans();
    const s = store.getState();
    const list = s.plans.list.map((e) => (e.plan.id === next.id ? { ...e, plan: { ...e.plan, isActive: false } } : e));
    const store2 = createStore({ ...s, plans: { ...s.plans, list } }, reduce);
    store2.dispatch({ type: A.PLAN_MAIN, planId: next.id });
    expect(store2.getState().ui.saving).toMatchObject({ planId: next.id, kind: 'main' });
  });
  it('its row\'s menu has no main button', () => {
    const { store, closed } = withPlans();
    const root = document.createElement('div');
    render(h(App, { state: store.getState(), dispatch: () => {} }), root);
    expect(root.querySelector(`[data-testid="plans.menu.${closed.id}"]`)).not.toBe(null);
    expect(root.querySelector(`[data-testid="plans.main.${closed.id}"]`)).toBe(null);
  });
});
