/**
 * The full view's one object for the open plan (src/ui/planState.js, lead4.md R2): dropped whole on a change of plan.
 */
import { describe, it, expect } from 'vitest';
import { createPlanState, planKeyOf, planIdOfKey, PLAN_STATE_FIELDS, PLAN_TABS } from '../../src/ui/planState.js';

describe('the open plan\'s state', () => {
  it('is keyed by the plan and its last change', () => {
    expect(planKeyOf({ id: 'a', lastModified: '2026-11-01' })).toBe('a|2026-11-01');
    expect(planKeyOf(null)).toBe('');
    expect(planIdOfKey('a|2026-11-01')).toBe('a');
  });

  it('a reset drops every field worked out for the plan before', () => {
    const st = createPlanState().reset('a|1');
    for (const f of PLAN_STATE_FIELDS) st[f] = { from: 'a' };
    st.reset('b|2');
    expect(st.key).toBe('b|2');
    for (const f of PLAN_STATE_FIELDS) expect(st[f] === null || st[f] === false).toBe(true);
    expect(st.isFor('b|2')).toBe(true);
    expect(st.isFor('a|1')).toBe(false);
  });

  it('every tab is marked to draw again when opened, once', () => {
    const st = createPlanState().reset('a|1').markAllStale();
    for (const t of PLAN_TABS) expect(st.takeStale(t)).toBe(true);
    for (const t of PLAN_TABS) expect(st.takeStale(t)).toBe(false);
    st.markAllStale().reset('b|1');
    expect(st.takeStale('budget')).toBe(false);
  });

  it('its own methods are not fields', () => {
    expect(Object.keys(createPlanState()).sort()).toEqual(['key', ...PLAN_STATE_FIELDS].sort());
  });
});
