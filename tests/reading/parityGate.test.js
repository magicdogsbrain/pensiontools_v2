/**
 * The gate can fail (lead4.md G3, G4, G7): two places of one fact with different text are a disagreement; a disagreement,
 * a one-view-only fact or an unmarked figure that is not in the ratchet files is a rise; agreeing places are none.
 * The browser half of this proof (the page reader on a page with two different marks) is e2e/parity/self-test.spec.js.
 */
import { describe, it, expect } from 'vitest';
import { summarise, ratchet, baselineOf, reportOf, lineOf, shownText } from '../../e2e/parity/gate.js';

const opened = [{ view: 'simple', page: 'home', opened: true }, { view: 'full', page: 'stress settings', opened: true }];
const result = (places, more = {}) => ({ fixture: 'fx', subject: 'P1', pages: opened, places, cells: [], fields: [], unmarked: {}, ...more });
const run1Places = () => [
  { view: 'simple', page: 'home', fact: 'pot.today', text: '£1' }, { view: 'full', page: 'stress settings', fact: 'pot.today', text: '£2' },
  { view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }
];

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
    expect(ratchet(run1, base)).toEqual({ rose: [], shrank: [], grew: [] });
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

  it('a page that opened in the baseline and does not open now, or is missing from the run, is a rise', () => {
    const pages = [{ view: 'simple', page: 'home', opened: true, quiet: true }, { view: 'full', page: 'stress settings', opened: true, quiet: true }, { view: 'full', page: 'will it last', opened: true, quiet: true, pressed: true }];
    const base = baselineOf(summarise([result([], { pages })]));
    expect(base.coverage.pages).toEqual(['fx|full:stress settings', 'fx|full:will it last', 'fx|full:will it last#press', 'fx|simple:home']);
    const shut = summarise([result([], { pages: [pages[0], { ...pages[1], opened: false }, pages[2]] })]);
    expect(ratchet(shut, base).rose).toEqual(['a page that opened before did not open: fx|full:stress settings']);
    const gone = summarise([result([], { pages: [pages[0], pages[1]] })]);
    expect(ratchet(gone, base).rose).toEqual(['a page that opened before did not open: fx|full:will it last', 'a page that opened before did not open: fx|full:will it last#press']);
    const unpressed = summarise([result([], { pages: [pages[0], pages[1], { ...pages[2], pressed: false }] })]);
    expect(ratchet(unpressed, base).rose).toEqual(['a page that opened before did not open: fx|full:will it last#press']);
    // a run of another fixture says nothing of this one's pages
    expect(ratchet(summarise([{ ...result([]), fixture: 'other' }]), base).rose).toEqual([]);
  });

  it('a page read before it went quiet is a rise', () => {
    const s = summarise([result([], { pages: [{ view: 'simple', page: 'home', opened: true, quiet: false }, opened[1]] })]);
    expect(ratchet(s, baselineOf(s)).rose).toEqual(['a page was read before it went quiet: fx|simple:home']);
  });

  it('marks taken off are a rise, even off a fact that disagreed', () => {
    const cells = [{ view: 'full', page: 'drawdown', table: 'years', row: '67', col: 'income', text: '£20,000' }, { view: 'full', page: 'drawdown', table: 'years', row: '68', col: 'income', text: '£20,000' }];
    const base = baselineOf(summarise([result(run1Places(), { cells })]));
    expect(base.coverage.shown).toEqual({ 'fx|pot.today|full': 1, 'fx|pot.today|simple': 1, 'fx|stage|simple': 1, 'fx|table:years|full': 1 });
    const off = summarise([result([{ view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }])]);
    expect(ratchet(off, base).rose).toEqual([
      'fewer places of a fact than before (a mark taken off?): fx|pot.today|full 1 → 0',
      'fewer places of a fact than before (a mark taken off?): fx|pot.today|simple 1 → 0',
      'fewer places of a fact than before (a mark taken off?): fx|table:years|full 1 → 0'
    ]);
    // a table's rows may change (its length is the plan's): it is held to being drawn at all
    const shorter = summarise([result(run1Places(), { cells: cells.slice(0, 1) })]);
    expect(ratchet(shorter, base).rose).toEqual([]);
  });

  it('a blank place is a place: blank in one view and a figure in the other is a disagreement', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'pot.today', text: '' }, { view: 'full', page: 'stress settings', fact: 'pot.today', text: '£2' }])]);
    expect(s.disagreements.map((d) => d.key)).toEqual(['fx|pot.today']);
  });

  it('counts the facts marked in both views', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }, { view: 'full', page: 'top', fact: 'stage', text: 'Saving' }, { view: 'simple', page: 'home', fact: 'pot.today', text: '£1' }])]);
    expect(s.factsInBoth).toEqual(['stage']);
    expect(reportOf(s, { at: 'now' }).factsInBoth).toBe(1);
  });

  it('prints one line', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }])]);
    const line = lineOf(reportOf(s, { at: 'now' }));
    expect(line).toBe('parity: 1 plans · facts marked 1 (0 in both views, 1 places, 2 pages) · fields bound 0 · disagreements 0 · unmarked 0 · one-view-only 1 · round trips failed not built');
  });
});
