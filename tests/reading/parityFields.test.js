/**
 * The field table and the round trips' registry (lead4.md R3, G5): every row of the edit map is in the registry, the
 * table and the registry agree, both views write the same mark on a box of the same field, the boxes are compared as one
 * quantity, and the round trips' ratchet fails when a trip gets worse.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { FIELDS, FIELD_IDS, simpleFieldId, fieldAttrOf, markFieldBoxes } from '../../src/reading/fields.js';
import { REGISTRY, BOXES, ONE_VIEW_BOXES, registryProblems, canonOf, valueIn, entryOf } from '../../e2e/parity/fields.js';
import { roundTripsOf, failedTrips, ratchetTrips, tripsBaselineOf, tripKindOf } from '../../e2e/parity/gate.js';
import { EditField } from '../../src/v7/components/EditField.jsx';
import { wantFormHtml } from '../../src/ui/saverAnswerUi.js';
import { FIXTURES } from '../../e2e/parity/fixtures/plans.js';
import oneView from '../../e2e/parity/one-view-only.json';

describe('the field registry', () => {
  it('holds every row of the edit map (85: #1–#86 without #9)', () => {
    const rows = new Set(REGISTRY.map((e) => e.map));
    const want = Array.from({ length: 86 }, (_, i) => i + 1).filter((n) => n !== 9);
    expect([...rows].sort((a, b) => a - b)).toEqual(want);
  });
  it('agrees with the field table: each box of the table is a box of the registry, in the same views', () => {
    expect(registryProblems()).toEqual([]);
    for (const f of FIELDS) expect(entryOf(f.id)?.kind, f.id).toBe('box');
  });
  it('names a fixture that exists for every box and list, and a value for every box', () => {
    const keys = new Set(FIXTURES.map((f) => f.key));
    for (const e of REGISTRY.filter((x) => x.kind !== 'action')) expect(keys.has(e.fixture), `${e.id}: ${e.fixture}`).toBe(true);
    for (const e of BOXES) for (const v of ['simple', 'full']) if (e[v]) expect(valueIn(e, v), `${e.id} ${v}`).not.toMatch(/^(undefined|null|)$/);
  });
  it('the boxes in one view only are the ones one-view-only.json lists under "fields"', () => {
    expect(oneView.fields).toEqual(ONE_VIEW_BOXES);
    for (const id of ONE_VIEW_BOXES) expect(entryOf(id).why, id).toBeTruthy();
  });
});

describe('a box compared as one quantity', () => {
  it('numbers as numbers, whatever the grouping', () => {
    expect(canonOf('pots.pension', 'simple', '61,000')).toBe('61000');
    expect(canonOf('pots.pension', 'full', '61000')).toBe('61000');
    expect(canonOf('pots.charges', 'full', '0.50')).toBe(canonOf('pots.charges', 'simple', '0.5'));
  });
  it('a view\'s own way of writing it: a tick that says the opposite, a multiplier, a month, a date, a start year', () => {
    expect(canonOf('lasts.cutsOn', 'full', 'no')).toBe(canonOf('lasts.cutsOn', 'simple', 'yes'));
    expect(canonOf('lasts.cutPct', 'full', '0.75')).toBe(canonOf('lasts.cutPct', 'simple', '25'));
    expect(canonOf('about.stopMonth', 'simple', 'June 2026')).toBe(canonOf('about.stopMonth', 'full', '2026-06'));
    expect(canonOf('income.spDate', 'simple', '1 May 2054')).toBe(canonOf('income.spDate', 'full', '2054-05-01'));
    expect(canonOf('about.startWhen', 'simple', 'y2025')).toBe(canonOf('about.startWhen', 'full', '2025'));
    expect(canonOf('about.stopped', 'full', 'retired')).toBe('yes');
  });
  it('different quantities stay different: an age and a number of years, a month after tax and a year before tax', () => {
    expect(canonOf('about.endAge', 'simple', '97')).not.toBe(canonOf('about.endAge', 'full', '36'));
    expect(canonOf('income.other', 'simple', '')).not.toBe(canonOf('income.other', 'full', '0'));
  });
});

describe('the mark on a box, the same in both views', () => {
  it('the simple view\'s box carries its field id; a box not in the table carries none', () => {
    const root = document.createElement('div');
    render(h('div', null,
      h(EditField, { step: 'pots', f: { path: 'pension', type: 'money', applies: true, shown: '60000' }, planId: 'P', dispatch: () => {} }),
      h(EditField, { step: 'lasts', f: { path: 'cutsOn', type: 'choice', options: ['yes', 'no'], applies: true, shown: 'no' }, planId: 'P', dispatch: () => {} }),
      h(EditField, { step: 'month', f: { path: 'mo.total', type: 'money', applies: true, shown: '' }, planId: 'P', dispatch: () => {} })), root);
    expect(root.querySelector('input[data-testid="plan.pots.pension"]').getAttribute('data-field')).toBe('pots.pension');
    expect([...root.querySelectorAll('input[name="plan.lasts.cutsOn"]')].map((r) => r.getAttribute('data-field'))).toEqual(['lasts.cutsOn', 'lasts.cutsOn']);
    expect(root.querySelector('input[data-testid="plan.month.mo.total"]').hasAttribute('data-field')).toBe(false);
  });
  it('the full view\'s boxes are marked from the same table; boxes drawn in code write the mark where they are drawn', () => {
    document.body.innerHTML = '<input id="ssPot"><input id="tmAge"><input id="acAge"><input type="radio" id="tmRetired"><input type="radio" id="tmFuture">';
    expect(markFieldBoxes(document)).toBe(5);
    expect(document.getElementById('ssPot').getAttribute('data-field')).toBe('pots.pension');
    expect(document.getElementById('acAge').getAttribute('data-field')).toBe('about.age');
    expect(markFieldBoxes(document)).toBe(0);   // safe to run again
    expect(simpleFieldId('pots', 'pension')).toBe('pots.pension');
    expect(fieldAttrOf('spend.first')).toBe(' data-field="spend.first"');
    expect(() => fieldAttrOf('not.a.field')).toThrow();
    const want = wantFormHtml({ open: true, locked: false, monthly: 2000, stopAge: 60 });
    expect(want).toContain('data-field="saving.want.monthly"');
    expect(want).toContain('data-field="saving.want.stopAge"');
    expect(FIELD_IDS.length).toBe(new Set(FIELD_IDS).size);
  });
});

describe('the round trips\' ratchet', () => {
  const run = (entries) => roundTripsOf([{ fixture: 'saver-draft', entries }]);
  it('"needs a press" is its own kind, and a trip that comes back with no press is not counted', () => {
    const t = run([{ key: 'a|s2f', kind: 'ok', press: true }, { key: 'b|s2f', kind: 'ok', press: false }, { key: 'c|f2s', kind: 'shows another value', press: true }]);
    expect(t.map(tripKindOf)).toEqual(['needs a press', 'ok', 'shows another value']);
    expect(failedTrips(t).map((x) => x.key)).toEqual(['a|s2f', 'c|f2s']);
    expect(tripsBaselineOf(t).entries).toEqual({ 'a|s2f': 'needs a press', 'c|f2s': 'shows another value' });
  });
  it('a new failure, or a listed trip getting worse, is a rise; a trip coming back is a shrink', () => {
    const known = { entries: { 'a|s2f': 'needs a press', 'c|f2s': 'shows another value' } };
    expect(ratchetTrips(run([{ key: 'a|s2f', kind: 'ok', press: true }, { key: 'c|f2s', kind: 'shows another value' }]), known).rose).toEqual([]);
    const worse = ratchetTrips(run([{ key: 'a|s2f', kind: 'not saved', press: true }, { key: 'c|f2s', kind: 'shows another value' }, { key: 'd|s2f', kind: 'ok', press: true }]), known);
    expect(worse.rose.length).toBe(2);
    const better = ratchetTrips(run([{ key: 'a|s2f', kind: 'ok' }, { key: 'c|f2s', kind: 'needs a press' }]), known);
    expect(better.rose).toEqual([]);
    expect(better.shrank.length).toBe(2);
  });
  it('a listed trip missing from a full run is a rise (a test dropped or renamed)', () => {
    const known = { entries: { 'a|s2f': 'needs a press', 'gone|f2s': 'not saved' } };
    expect(ratchetTrips(run([{ key: 'a|s2f', kind: 'ok', press: true }]), known).rose.join()).toContain('gone|f2s');
    expect(ratchetTrips(run([{ key: 'a|s2f', kind: 'ok', press: true }]), known, { only: ['saver-draft'] }).rose).toEqual([]);
  });
});
