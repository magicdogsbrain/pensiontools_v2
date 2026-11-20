/**
 * The ways list's other figures (lead4.md D9, R6, R7; step F3, pass 3): what is typically left, the bad case (the worst 1 in
 * 10) and the worst 12 months lived, for each way. ONE reading (src/reading/ways.js wayFiguresOf) writes them for both views —
 * the simple view's cards and "More columns" table, the full view's ranking card (its table and the "comes first" line) and
 * its side-by-side table — each marked as the way's own fact, so the gate can compare them.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { wayFactIds, wayFiguresOf } from '../../src/reading/ways.js';
import { wayOf, cardsOf } from '../../src/answers/plan/way.js';
import { patternOf, FACT } from '../../src/reading/facts.js';
import { labelOf } from '../../src/reading/labels.js';
import { formatFact } from '../../src/reading/format.js';
import { rankingCardHtml } from '../../src/ui/oneAnswerView.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');
const now = new Date(PARITY_DAY + 'T12:00:00Z');
const subjectOf = (f) => { const plans = f.plans(); const raw = plans.find((p) => p.id === f.subject) || plans[0]; return upgradeScenario(JSON.parse(JSON.stringify(raw)), { now }).scenario; };
const marked = (html, id) => [...html.matchAll(new RegExp('data-fact="' + id.replace(/[.]/g, '\\.') + '">([^<]*)<', 'g'))].map((m) => m[1]);

describe('each way\'s left, bad case and worst 12 months are facts of their own', () => {
  it('ids, patterns, labels and one rule', () => {
    expect(wayFactIds('floor-to-age')).toMatchObject({ left: 'way.floor-to-age.left', badLeft: 'way.floor-to-age.badLeft', worst12: 'way.floor-to-age.worst12' });
    expect(patternOf('way.floor-to-age.left')).toBe(FACT.WAY_LEFT);
    expect(patternOf('way.floor-to-age.badLeft')).toBe(FACT.WAY_BAD_LEFT);
    expect(patternOf('way.floor-to-age.worst12')).toBe(FACT.WAY_WORST_12);
    for (const id of ['way.pots-and-valves.left', 'way.pots-and-valves.badLeft', 'way.pots-and-valves.worst12']) {
      expect(labelOf(id), id).toBeTruthy();
      expect(formatFact(id, 123456.6), id).toBe('£123,457');
    }
  });
  it('one reading writes them, from an engine result or a card\'s result alike', () => {
    const engine = { terminal: { p10: 1200.4, p50: 98765.5, p90: 1 }, worst12: { min: 30123.7, median: 1 } };
    const card = { terminal: { p10: 1200.4, p50: 98765.5, p90: 1 }, worst12: 30123.7 };
    const want = { left: '£98,766', badLeft: '£1,200', worst12: '£30,124' };
    expect(wayFiguresOf(engine)).toEqual(want);
    expect(wayFiguresOf(card)).toEqual(want);
    expect(wayFiguresOf({ terminal: { p10: 0, p50: 5 }, worst12: null })).toEqual({ left: '£5', badLeft: '£0', worst12: null });
  });
});

describe('the simple view marks them', () => {
  const plan = subjectOf(FIXTURES.find((f) => f.key === 'retired-draft'));
  const reading = wayOf([{ plan }], plan.id, { today: PARITY_DAY });
  const ff = { id: 'floor-and-flex', affordable: true, bought: true, cost: 100, left: 10, a: { share: 0.8, chancePct: 80, futures: 1000, histories: 120, years: 37, typicalLeft: 42695, badCaseLeft: 0 },
    dials: { defaults: {}, ranWith: {} }, ruin: { mc: 20, hist: 0 }, terminal: { p10: 0, p50: 42695, p90: 2 }, worst12: 30000 };
  it('on the card and in "More columns", the run\'s own figures only', () => {
    const v = cardsOf(reading, { key: reading.runKey, status: 'done', result: { ways: [ff] } });
    const c = v.cards.find((x) => x.id === 'floor-and-flex');
    expect(c.facts).toMatchObject({ left: 'way.floor-and-flex.left', badLeft: 'way.floor-and-flex.badLeft', worst12: 'way.floor-and-flex.worst12' });
    expect(c.table.worst12).toBe('£30,000');
    expect(c.table.left).toBe('£42,695');
    const tried = cardsOf(reading, { key: reading.runKey, status: 'done', result: { ways: [ff] }, tried: { 'floor-and-flex': { status: 'done', values: {}, result: { ...ff } } } });
    expect(tried.cards.find((x) => x.id === 'floor-and-flex').facts).toMatchObject({ left: null, badLeft: null, worst12: null });
  });
  it('the screen draws the marks', () => {
    const src = read('src/v7/screens/plan/WayScreen.jsx');
    expect(src).toMatch(/id === 'left'/);
    expect(src).toMatch(/c\.facts\.worst12/);
    expect(src).toMatch(/c\.facts\.left/);
  });
});

describe('the full view marks them in the ranking, its "comes first" line and the side-by-side table', () => {
  const r = (p50, p10, w) => ({ affordable: true, ruin: { mc: 10, hist: 0 }, terminal: { p10, p50, p90: p50 * 2 }, worst12: w == null ? null : { min: w, median: w }, coverage: 0.9 });
  const scored = [{ id: 'pots-and-valves', r: r(250000.4, 12000, 31000.2), sc: null }, { id: 'floor-to-age', r: r(150000, 0, null), sc: null }];
  const html = rankingCardHtml({ scored, names: { 'pots-and-valves': 'Pots & Valves', 'floor-to-age': 'Floor to an age' }, colors: {} });
  it('each way\'s cells, through the one reading', () => {
    expect(marked(html, 'way.pots-and-valves.worst12')).toEqual(['£31,000']);
    expect(marked(html, 'way.floor-to-age.worst12')).toEqual([]);
    expect(marked(html, 'way.floor-to-age.left')).toEqual(['£150,000']);
    expect(marked(html, 'way.floor-to-age.badLeft')).toEqual(['£0']);
  });
  it('the way that comes first says the same figures, marked', () => {
    const first = ['pots-and-valves', 'floor-to-age'].find((id) => marked(html, 'way.' + id + '.left').length === 2);
    expect(first).toBeTruthy();
    expect(marked(html, 'way.' + first + '.badLeft').length).toBe(2);
    expect(marked(html, 'way.' + first + '.verdict').length).toBe(2);
    expect(new Set(marked(html, 'way.' + first + '.left')).size).toBe(1);
  });
  it('the side-by-side table writes them through the one reading', () => {
    const src = read('index.html');
    expect(src).toMatch(/markFact\(wayFactIds\(id\)\.worst12, wayFiguresOf\(r\)\.worst12\)/);
    expect(src).toMatch(/markFact\(wayFactIds\(id\)\.left, wayFiguresOf\(r\)\.left\)/);
    expect(src).not.toMatch(/typically left at the end: ' \+ gbp\(/);
    expect(src).not.toMatch(/worst 12 months ' \+ gbp\(Math\.round\(r\.worst12\.min\)\)/);
  });
});
