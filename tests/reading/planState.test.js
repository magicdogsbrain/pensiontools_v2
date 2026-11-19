/**
 * The full view's one object for the open plan (src/ui/planState.js, lead4.md R2): dropped whole on a change of plan.
 */
import { describe, it, expect } from 'vitest';
import { createPlanState, planKeyOf, planIdOfKey, PLAN_STATE_FIELDS, PLAN_TABS, emptyPlanField } from '../../src/ui/planState.js';

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
    for (const f of PLAN_STATE_FIELDS) expect([f, st[f]]).toEqual([f, emptyPlanField(f)]);
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

  it('a write drops what was worked out and keeps what is being edited', () => {
    const st = createPlanState().reset('a|1');
    st.oneTest = { r: 1 }; st.cmpCache = {}; st.budget = { lines: [1] }; st.budLoaded = true; st.stressFormBase = { a: 1 };
    st.dropWorked();
    expect(st.oneTest).toBe(null); expect(st.cmpCache).toBe(null);
    expect(st.budget).toEqual({ lines: [1] }); expect(st.budLoaded).toBe(true); expect(st.stressFormBase).toEqual({ a: 1 });
    expect(st.key).toBe('a|1');
  });

  it('its own methods are not fields', () => {
    expect(Object.keys(createPlanState()).sort()).toEqual(['key', ...PLAN_STATE_FIELDS].sort());
  });
});

describe('the page\'s names are the one state', () => {
  it('window._budget and the rest read and write it, and a reset drops them', async () => {
    const { bindPlanState, PLAN_STATE_GLOBALS } = await import('../../src/ui/planState.js');
    const win = {};
    const st = bindPlanState(win, createPlanState().reset('a|1'));
    win._budget = { lines: [] }; win._oneTest = { r: 1 }; win._arrivalChecked = true;
    expect(st.budget).toEqual({ lines: [] });
    expect(st.oneTest).toEqual({ r: 1 });
    st.reset('b|1');
    for (const [name, field] of Object.entries(PLAN_STATE_GLOBALS)) expect([name, win[name]]).toEqual([name, emptyPlanField(field)]);
    expect(win._plan).toBe(st);
  });

  it('nothing chosen on a page of one plan is read in the next (fix round 1): dials, limits, offers to undo, years chosen, splits', () => {
    const { bindPlanState } = require('../../src/ui/planState.js');
    const win = {};
    const st = bindPlanState(win, createPlanState().reset('a|1'));
    win._stratDials.cutPct = 7; win._beAge = 70; win._ffHorizon = 88; win._hhLimit = { kind: 'age', age: 70 };
    win._budImportUndo = { lines: [] }; win._budPlusTen = true; win._customAlloc.ss = { savedSplit: true, glideEndgame: 'x' }; win._allocMode.ss = 'funds';
    win._decisionAnchor = 2027; st.historyYear = '2027'; st.taxYear = '27/28'; st.budLastRemoved = { kind: 'line', item: { label: 'Rent' }, index: 0 };
    const dialsBefore = win._stratDials;
    st.reset('b|1');
    expect(win._stratDials).toEqual({}); expect(win._stratDials).not.toBe(dialsBefore);
    expect(win._beAge).toBe(null); expect(win._ffHorizon).toBe(null); expect(win._hhLimit).toBe(null);
    expect(win._budImportUndo).toBe(null); expect(win._budPlusTen).toBe(false);
    expect(win._customAlloc).toEqual({}); expect(win._allocMode).toEqual({}); expect(win._decisionAnchor).toBe(null);
    expect(st.historyYear).toBe('all'); expect(st.taxYear).toBe(null); expect(st.budLastRemoved).toBe(null);
  });

  it('index.html keeps none of these as a page variable of its own', () => {
    const src = require('node:fs').readFileSync('index.html', 'utf8');
    for (const re of [/let selectedHistoryYear\b/, /let selectedTaxYear\b/, /let _budLastRemoved\b/, /window\._stratDials = \{\}/, /window\._customAlloc = window\._customAlloc \|\| \{\}/, /window\._allocMode = window\._allocMode \|\| \{\}/, /\|\| window\._decisionAnchor/]) expect(src).not.toMatch(re);
  });
});
