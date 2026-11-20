/**
 * The ways list (lead4.md D9, R6, R7; step F3): ONE reading of each way (src/reading/ways.js) drawn by both views — the
 * simple view's cards (answers/plan/way.js, WayScreen.jsx) and the full view's Strategies overview (index.html, its ranking
 * card in src/ui/oneAnswerView.js). Each way's name, verdict and cost carry their own marks; "cannot be bought" is one
 * sentence; a bought way says when it is bought, the same words in both views; a plan with no figures is never ranked on an
 * income nobody gave it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { wayReasonOf, wayCannotText, wayNameOf, wayVerdictOf, wayFactIds, boughtWhenOf, BOUGHT_WORDS } from '../../src/reading/ways.js';
import { cardLines, wayOf, cardsOf } from '../../src/answers/plan/way.js';
import { WAY } from '../../src/v7/copy/way.js';
import { STRATEGY_NAMES } from '../../src/strategies/stressTest.js';
import { patternOf, FACT } from '../../src/reading/facts.js';
import { labelOf } from '../../src/reading/labels.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');
const fill = (t, slots) => String(t).replace(/\{(\w+)\}/g, (m, k) => (slots[k] != null ? String(slots[k]) : m));
const now = new Date(PARITY_DAY + 'T12:00:00Z');
const subjectOf = (f) => { const plans = f.plans(); const raw = plans.find((p) => p.id === f.subject) || plans[0]; return upgradeScenario(JSON.parse(JSON.stringify(raw)), { now }).scenario; };

describe('one reading of a way', () => {
  it('one name per way, the planner\'s', () => {
    for (const id of Object.keys(STRATEGY_NAMES)) expect(wayNameOf(id)).toBe(STRATEGY_NAMES[id]);
  });
  it('each way\'s figures are facts of their own', () => {
    expect(wayFactIds('full-il-gilt')).toEqual({ name: 'way.full-il-gilt.name', verdict: 'way.full-il-gilt.verdict', cost: 'way.full-il-gilt.cost', left: 'way.full-il-gilt.left', badLeft: 'way.full-il-gilt.badLeft', worst12: 'way.full-il-gilt.worst12' });
    expect(patternOf('way.floor-to-age.verdict')).toBe(FACT.WAY_VERDICT);
    expect(patternOf('way.floor-to-age.name')).toBe(FACT.WAY_EACH_NAME);
    expect(patternOf('way.name')).toBe(FACT.WAY_NAME);
    expect(labelOf('way.bought')).toBeTruthy();
  });
  it('the verdict in words', () => {
    expect(wayVerdictOf(0.9)).toBe('in 9 futures out of 10');
    expect(wayVerdictOf(1)).toBe('in every future it tried');
  });
  it('cannot be bought: the price against the pot it may spend, one sentence', () => {
    const p = { pot: 200000, isa: 50000 };
    const rs = wayReasonOf('floor-the-schedule', { affordable: false }, p, { fsFloorCost: 300000.4 });
    expect(rs).toEqual({ why: 'cost', cost: 300000, short: 50000 });
    const t = wayCannotText(rs);
    expect(t.cost).toBe('£300,000');
    expect(t.text).toBe(fill(WAY.card.cannot, { cost: '£300,000', short: '£50,000' }));
    // the ISA held aside is not spent
    expect(wayReasonOf('floor-the-schedule', null, { ...p, isaHold: true }, { fsFloorCost: 220000 })).toEqual({ why: 'cost', cost: 220000, short: 20000 });
    expect(wayCannotText(wayReasonOf('full-il-gilt', { affordable: false }, p, {}))).toMatchObject({ id: 'cannotGilt', cost: null, text: WAY.card.cannotGilt });
  });
  it('when a bought way is bought: a plan still saving at its stop, at today\'s prices; any other today', () => {
    expect(boughtWhenOf({ retired: false }, { mode: 'future', shapeAgeNow: 63 })).toBe('atStop');
    expect(boughtWhenOf({ retired: true }, { mode: 'future', shapeAgeNow: 63 })).toBe('today');
    expect(boughtWhenOf({}, { mode: 'legacy', shapeAgeNow: 66 })).toBe('today');
    expect(BOUGHT_WORDS).toEqual({ today: 'bought today', atStop: 'bought when you stop, at today’s prices' });
  });
});

describe('the simple view\'s cards say it in those words', () => {
  const ff = { id: 'floor-and-flex', affordable: true, bought: true, cost: 144872, left: 33424, a: { share: 0.8, chancePct: 80, futures: 1000, histories: 120, years: 37, typicalLeft: 42695, badCaseLeft: 0 } };
  it('a saver: bought when the work stops, at today\'s prices', () => {
    const l = cardLines(ff, { endAge: 100, atStop: { age: 63 } }).find((x) => x.id === 'costAtStop');
    expect(fill(WAY.card[l.id], l.slots)).toBe('Costs £144,872, bought when you stop, at today’s prices: of the £178,296 your pots could hold at 63, £33,424 is left to grow.');
  });
  it('a retired plan: bought today', () => {
    const l = cardLines(ff, { endAge: 100 }).find((x) => x.id === 'cost');
    expect(fill(WAY.card[l.id], l.slots)).toBe('Costs £144,872 of your pot, bought today; £33,424 left to grow.');
  });
  it('cannot be bought: the one sentence', () => {
    const l = cardLines({ id: 'floor-the-schedule', affordable: false, reason: { why: 'cost', cost: 300000, short: 50000 } }, {});
    expect(fill(WAY.card[l[0].id], l[0].slots)).toBe(wayCannotText({ why: 'cost', cost: 300000, short: 50000 }).text);
  });
  it('a plan with no figures of its own is never run: no key, and it says so', () => {
    for (const key of ['age-only', 'wizard-defaults']) {
      const plan = subjectOf(FIXTURES.find((f) => f.key === key));
      const r = wayOf([{ plan }], plan.id, { today: PARITY_DAY });
      expect(r.noFigures, key).toBe(true);
      expect(r.runKey, key).toBe(null);
    }
    const plan = subjectOf(FIXTURES.find((f) => f.key === 'retired-draft'));
    const r = wayOf([{ plan }], plan.id, { today: PARITY_DAY });
    expect(r.noFigures).toBe(false);
    expect(r.runKey).toBeTruthy();
  });
  it('each card carries its name, verdict and cost marks; a try is never marked as the plan\'s verdict', () => {
    const plan = subjectOf(FIXTURES.find((f) => f.key === 'retired-draft'));
    const reading = wayOf([{ plan }], plan.id, { today: PARITY_DAY });
    const ways = [{ ...ff, id: 'floor-and-flex', dials: { defaults: {}, ranWith: {} }, ruin: { mc: 20, hist: 0 }, terminal: { p10: 0, p50: 1, p90: 2 } }];
    const v = cardsOf(reading, { key: reading.runKey, status: 'done', result: { ways } });
    const c = v.cards.find((x) => x.id === 'floor-and-flex');
    expect(c.facts.name).toBe('way.floor-and-flex.name');
    expect(c.facts.verdict).toBe('way.floor-and-flex.verdict');
    expect(c.costFact).toBe('way.floor-and-flex.cost');
    const tried = cardsOf(reading, { key: reading.runKey, status: 'done', result: { ways }, tried: { 'floor-and-flex': { status: 'done', values: {}, result: { ...ways[0] } } } });
    expect(tried.cards.find((x) => x.id === 'floor-and-flex').facts.verdict).toBe(null);
  });
});

describe('the full view draws the same reading', () => {
  const html = read('index.html');
  const card = read('src/ui/oneAnswerView.js');
  it('keeps no wording of its own for a way it cannot buy', () => {
    expect(html).not.toMatch(/Not affordable on this plan —/);
    expect(html).not.toMatch(/not affordable — ' \+ budEsc\(S\[id\]\.reason/);
    expect(html).not.toMatch(/Not affordable on the plan as saved —/);
    expect(html).toMatch(/wayCannotText\(wayReasonOf\(/);
    expect(read('src/answers/plan/waysRun.js')).not.toMatch(/function unaffordableReason/);
  });
  it('heads the cost column with the one label, and says when a bought way is bought', () => {
    expect(html).not.toMatch(/What you pay today/);
    expect(html).toMatch(/labelOf\(FACT\.WAY_COST\)/);
    expect(html).toMatch(/markFact\(FACT\.WAY_BOUGHT, budEsc\(boughtWords\)\)/);
    expect(html).toMatch(/BOUGHT_WORDS\[boughtWhenOf\(c\.settings, deriveTiming\(c\.settings, todayOf\(\)\)\)\]/);
  });
  it('marks each way\'s name and verdict in the ranking and the table', () => {
    expect(card).toMatch(/markFact\(wayFactIds\(x\.id\)\.name/);
    expect(card).toMatch(/markFact\(wayFactIds\(x\.id\)\.verdict/);
    expect(card).toMatch(/x\.lasts = wayVerdictOf\(x\.share\)/);
    expect(html).toMatch(/const nameHtml = \(id\) => markFact\(wayFactIds\(id\)\.name/);
  });
  it('never ranks a plan with no figures', () => {
    expect(html).toMatch(/if \(sc && !planHasFigures\(sc\)\) return \{ noFigures: missingWords\(settings\)/);
    expect(html).toMatch(/if \(c\.noFigures\) return/);
    // nor prices one way on its own page
    expect(html).toMatch(/if \(sc0 && !planHasFigures\(sc0\)\) \{ if \(!stale\(\)\) box\.innerHTML/);
  });
  it('the simple view\'s screen marks the same', () => {
    const scr = read('src/v7/screens/plan/WayScreen.jsx');
    expect(scr).toMatch(/<Fact id=\{card\.facts\.name\}>/);
    expect(scr).toMatch(/m\.words = f\.verdict/);
    expect(scr).toMatch(/plan\.way\.noFigures/);
  });
});
