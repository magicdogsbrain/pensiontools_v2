/**
 * The gate can fail (lead4.md G3, G4, G7): two places of one fact with different text are a disagreement; a disagreement,
 * a one-view-only fact or an unmarked figure that is not in the ratchet files is a rise; agreeing places are none.
 * The browser half of this proof (the page reader on a page with two different marks) is e2e/parity/self-test.spec.js.
 */
import { describe, it, expect } from 'vitest';
import { summarise, ratchet, baselineOf, reportOf, lineOf, shownText } from '../../e2e/parity/gate.js';

const opened = [{ view: 'simple', page: 'home', opened: true }, { view: 'full', page: 'stress settings', opened: true }];
const result = (places, more = {}) => ({ fixture: 'fx', subject: 'P1', pages: opened, places, cells: [], fields: [], unmarked: {}, ...more });

describe('the parity gate', () => {
  it('two places of one fact that differ are one disagreement, and a rise against an empty baseline', () => {
    const s = summarise([result([
      { view: 'simple', page: 'home', fact: 'pot.today', text: '£120,000' },
      { view: 'full', page: 'stress settings', fact: 'pot.today', text: '£120,500' }
    ])]);
    expect(s.disagreements.map((d) => d.key)).toEqual(['fx|pot.today']);
    const empty = baselineOf(summarise([]));
    const { rose } = ratchet(s, empty);
    expect(rose.length).toBe(1);
    expect(rose[0]).toMatch(/fx\|pot\.today/);
  });

  it('the same text in every place is no disagreement; space does not count', () => {
    const s = summarise([result([
      { view: 'simple', page: 'home', fact: 'pot.today', text: ' £120,000 ' },
      { view: 'full', page: 'stress settings', fact: 'pot.today', text: '£120,000' }
    ])]);
    expect(s.disagreements).toEqual([]);
    expect(s.oneViewOnly).toEqual([]);
    expect(shownText('a   b')).toBe('a b');
  });

  it('a fact in one view only is counted; table cells and boxes are compared too', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }], {
      cells: [{ view: 'simple', page: 'lasts', table: 'years', row: '67', col: 'income', text: '£20,000' }, { view: 'full', page: 'drawdown', table: 'years', row: '67', col: 'income', text: '£21,000' }],
      fields: [{ view: 'simple', page: 'about', field: 'about.stop', value: '2038-02' }, { view: 'full', page: 'stress settings', field: 'about.stop', value: '2038-03' }]
    })]);
    expect(s.oneViewOnly.map((d) => d.key)).toEqual(['fx|stage']);
    expect(s.disagreements.map((d) => d.key)).toEqual(['fx|field:about.stop', 'fx|table:years:67:income']);
    expect(s.fieldsBound).toBe(1);
  });

  it('a baseline holds its run; a listed pair that agrees now is a shrink; unmarked may only go down', () => {
    const run1 = summarise([result([
      { view: 'simple', page: 'home', fact: 'pot.today', text: '£1' }, { view: 'full', page: 'stress settings', fact: 'pot.today', text: '£2' }
    ], { unmarked: { 'simple:home': 4 } })]);
    const base = baselineOf(run1);
    expect(ratchet(run1, base)).toEqual({ rose: [], shrank: [] });
    const run2 = summarise([result([
      { view: 'simple', page: 'home', fact: 'pot.today', text: '£1' }, { view: 'full', page: 'stress settings', fact: 'pot.today', text: '£1' }
    ], { unmarked: { 'simple:home': 5 } })]);
    const r = ratchet(run2, base);
    expect(r.rose).toEqual(['unmarked figures rose on fx|simple:home: 4 → 5']);
    expect(r.shrank).toEqual(['agrees now, take it out of known-disagreements.json: fx|pot.today']);
  });

  it('the reading\'s own value is held against what is shown', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'plan.name', text: 'Jo saving' }, { view: 'full', page: 'top', fact: 'plan.name', text: 'Jo saving' }], { readings: [{ fact: 'plan.name', want: 'Jo’s plan' }] })]);
    expect(s.readingMismatches).toBe(1);
    expect(s.disagreements.map((d) => d.key)).toEqual(['fx|plan.name#reading']);
  });

  it('prints one line', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }])]);
    const line = lineOf(reportOf(s, { at: 'now' }));
    expect(line).toBe('parity: 1 plans · facts marked 1 (1 places) · fields bound 0 · disagreements 0 · unmarked 0 · one-view-only 1 · round trips failed not built');
  });
});
