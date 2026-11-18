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
    // a run of another fixture, named for the run, says nothing of this one's pages
    expect(ratchet(summarise([{ ...result([]), fixture: 'other' }]), base, { only: ['other'] }).rose).toEqual([]);
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

  it('a listed disagreement holds its places and values: a new value, or a new place that disagrees, is a rise', () => {
    const places = () => [
      { view: 'simple', page: 'home', fact: 'pot.atStop', text: '£252,000' }, { view: 'simple', page: 'saving', fact: 'pot.atStop', text: '£252,000' },
      { view: 'full', page: 'stress settings', fact: 'pot.atStop', text: '£252,175' }
    ];
    const base = baselineOf(summarise([result(places())]));
    expect(base.known.pairs).toEqual({ 'fx|pot.atStop': { 'full:stress settings': ['£252,175'], 'simple:home': ['£252,000'], 'simple:saving': ['£252,000'] } });
    expect(ratchet(summarise([result(places())]), base).rose).toEqual([]);
    // the full view's wrong figure moves to another wrong figure: still listed as a pair, but a new value
    const worse = places(); worse[2].text = '£252,182';
    expect(ratchet(summarise([result(worse)]), base).rose).toEqual([
      'a listed disagreement shows a new value: fx|pot.atStop full stress settings: "£252,182" (listed: "£252,000" / "£252,175")'
    ]);
    // a place that agreed takes another figure (a known one, but at a place where the fact was not drawn before)
    const spread = [...places(), { view: 'full', page: 'drawdown', fact: 'pot.atStop', text: '£252,175' }];
    expect(ratchet(summarise([result(spread)]), base).rose).toEqual([
      'a listed disagreement is drawn at a new place: fx|pot.atStop full drawdown: "£252,175"'
    ]);
    // one place moving to the other's figure narrows it; agreeing everywhere takes it out
    const nearer = places(); nearer[1].text = '£252,175';
    expect(ratchet(summarise([result(nearer)]), base).rose).toEqual([]);
    const agreed = places(); agreed[2].text = '£252,000';
    expect(ratchet(summarise([result(agreed)]), base).shrank).toEqual(['agrees now, take it out of known-disagreements.json: fx|pot.atStop']);
  });

  it('the floor holds its fixtures: a full run without one, or a named one not run, is a rise', () => {
    const base = baselineOf(summarise([result(run1Places()), { ...result(run1Places()), fixture: 'gone' }]));
    expect(base.coverage.fixtures).toEqual(['fx', 'gone']);
    const onlyFx = summarise([result(run1Places())]);
    // a full run (no fixtures named): a fixture of the floor that did not run is a rise, its pairs and pages unheld otherwise
    expect(ratchet(onlyFx, base).rose).toEqual(['a plan of the floor was not in the full run (dropped, renamed or failed?): gone']);
    // a run of named fixtures is held to those
    expect(ratchet(onlyFx, base, { only: ['fx'] }).rose).toEqual([]);
    expect(ratchet(onlyFx, base, { only: ['fx', 'gone'] }).rose).toEqual(['a plan named for the run did not run: gone']);
    // a plan that is new to the floor grows it
    expect(ratchet(summarise([result(run1Places()), { ...result(run1Places()), fixture: 'gone' }, { ...result([]), fixture: 'new' }]), base).grew)
      .toContain('a plan new to the floor, add it to coverage.json: new');
  });

  it('prints one line', () => {
    const s = summarise([result([{ view: 'simple', page: 'home', fact: 'stage', text: 'Saving' }])]);
    const line = lineOf(reportOf(s, { at: 'now' }));
    expect(line).toBe('parity: 1 plans · facts marked 1 (0 in both views, 1 places, 2 pages) · fields bound 0 · disagreements 0 · unmarked 0 · one-view-only 1 · round trips failed not built');
  });
});
