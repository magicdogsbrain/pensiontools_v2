/**
 * Step F6 (lead4.md D19): what is held, against the plan, read ONCE for both views. One diff (src/reading/holdings.js
 * moveReadingOf → PlanReading.moveInputs → diffHoldings) feeds every list and count on the simple view's move page and the full
 * view's Transition tab; "n of m gilts held" is one count that honours "this is how I want to hold it"; the order sheet's
 * bought column is read from the same diff; a saver waiting for the move window is shown no list to buy or sell in either view.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradedList } from '../../src/v7/effects/planSource.js';
import { moveOf } from '../../src/answers/plan/move.js';
import { heldLadder, heldLadderView, sayHeld } from '../../src/answers/plan/held.js';
import { HELD } from '../../src/v7/copy/held.js';
import { transitionHeld } from '../../src/ui/keepHoldingsUi.js';
import { transitionHtml, heldMixLineHtml } from '../../src/ui/components/TransitionView.js';
import { moveReadingOf, giltsCountOf, sheetOf, heldMixOf, planMixOf, holdingsTotalsOf } from '../../src/reading/holdings.js';
import { orderSheetRows } from '../../src/strategies/GiltLadderPlan.js';
import { normaliseHoldings } from '../../src/services/HoldingsRecord.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const entriesOf = (key) => upgradedList(FIXTURES.find((f) => f.key === key).plans(), NOW);
const subjectOf = (key) => FIXTURES.find((f) => f.key === key).subject;
const planOf = (key) => entriesOf(key).find((e) => e.plan.id === subjectOf(key)).plan;
/** The full view's tab, drawn as index.html loadTransitionUI draws it: from transitionHeld's one reading, nothing else. */
function fullTab(key) {
  const entries = entriesOf(key), plan = entries.find((e) => e.plan.id === subjectOf(key)).plan;
  const held = transitionHeld(plan, plan.holdings, NOW, entries);
  const raw = held && held.raw;
  return { held, html: transitionHtml({ doc: plan.planDocument, target: raw && raw.target, diff: raw && raw.diff, seq: raw && raw.seq, prog: raw && raw.prog, holdings: normaliseHoldings(plan.holdings), gaps: held && held.gaps, held }) };
}

describe('one diff for both views', () => {
  it('the full view\'s Transition tab works out no diff, target or schedule of its own', () => {
    const src = readFileSync('index.html', 'utf8');
    const at = src.indexOf('window.loadTransitionUI = async function');
    const body = src.slice(at, src.indexOf('window._transitionLast =', at));
    for (const reader of ['diffHoldings(', 'targetHoldings(', 'transitionSequence(', 'transitionProgress(', 'transitionGaps(', 'orderSheetRows(']) expect(body.indexOf(reader), reader).toBe(-1);
    expect(body).toContain('transitionHeld(');
    // the rotation watch is the move reading's too (move.js rotationWatch, the one clock): no second status of its own
    expect(body.indexOf('rotationStatus(')).toBe(-1);
    expect(body).toContain('raw.watch');
  });

  it('a ladder + rotation: the tab\'s watch is the move page\'s, from the same reading', () => {
    const key = 'retired-locked-ladder';
    const entries = entriesOf(key).map((e) => (e.plan.id !== subjectOf(key) ? e : { ...e, plan: { ...e.plan, planDocument: { ...e.plan.planDocument, strategy: { ...e.plan.planDocument.strategy, id: 'gilt-rotation' } }, stressTool: { ...e.plan.stressTool, settings: { ...e.plan.stressTool.settings, strategyId: 'gilt-rotation' } } } }));
    const v = moveOf(entries, subjectOf(key), { today: PARITY_DAY });
    const plan = entries.find((e) => e.plan.id === subjectOf(key)).plan;
    const held = transitionHeld(plan, plan.holdings, NOW, entries);
    expect(v.watch && v.watch.state).toBeTruthy();
    expect(held.raw.watch.applies).toBe(true);
    expect(held.raw.watch.state).toBe(v.watch.state);
    expect(String(held.raw.watch.cutAge)).toBe(v.watch.cutAge);
    const html = transitionHtml({ doc: plan.planDocument, target: held.raw.target, diff: held.raw.diff, seq: held.raw.seq, prog: held.raw.prog, holdings: normaliseHoldings(plan.holdings), rotation: held.raw.watch, gaps: held.gaps, held });
    expect(html).toContain('Rotation watch');
  });

  it.each(['saver-locked-ladder', 'saver-locked-pots', 'retired-locked-ladder', 'retired-locked-pots'])('%s: the tab draws the very diff the move page reads', (key) => {
    const entries = entriesOf(key);
    const v = moveOf(entries, subjectOf(key), { today: PARITY_DAY });
    const { held } = fullTab(key);
    expect(held.raw.diff).toEqual(v.raw.diff);
    expect(held.raw.seq).toEqual(v.raw.seq);
    expect(held.mode).toBe(v.mode);
    // the move page's own lists are that diff's rows
    expect(v.buy.map((x) => x.key)).toEqual(v.raw.diff.buy.map((x) => x.key));
  });

  it('living on a ladder, the page, its count and the home read the diff with every line as it is (no keep mark counts)', () => {
    const plan = planOf('retired-locked-ladder');
    const v = moveOf(entriesOf('retired-locked-ladder'), plan.id, { today: PARITY_DAY });
    const r = moveReadingOf(plan, { now: NOW, life: { key: 'drawing' } });
    expect(r.asHeld).toBe(true);
    expect(v.raw.diff).toEqual(r.m.diff);
    expect(v.heldInfo.gilts.held).toBe(giltsCountOf(r.m.target, r.m.diff).counted);
  });
});

describe('a saver waiting for the move window', () => {
  const { html, held } = fullTab('saver-locked-ladder');
  it('is shown where new money goes and when the move starts, in both views — no list to buy or sell, no schedule', () => {
    expect(held.mode).toBe('waiting');
    expect(html).toContain('id="transitionWaiting"');
    expect(html).not.toMatch(/>Buy<\/div>|>Sell<\/div>|Things the schedule assumes|toggleTransitionDone/);
  });
  it('the order sheet with its bought column is on the tab, its cells marked as the simple view marks them', () => {
    expect(html).toContain('data-fact-table="ladder"');
    expect(held.sheet.length).toBeGreaterThan(0);
    for (const r of held.sheet) expect(html).toContain('data-row="' + r.tidm + '" data-col="pays">' + r.pays + '<');
  });
});

describe('the one count, and the order sheet from the same diff', () => {
  const T = { kind: 'ladder', lines: [{ key: 'gilt:A' }, { key: 'gilt:B' }, { key: 'gilt:C' }] };
  const D = { rungs: { held: 1, needed: 3 }, buy: [{ kind: 'gilt', key: 'gilt:B', heldUnits: 400, units: 600 }, { kind: 'gilt', key: 'gilt:C', heldUnits: 0, units: 900 }], hold: [] };
  it('n of m is the plan\'s gilts held in full; once what is held was accepted, a gilt held in part is held as chosen', () => {
    expect(giltsCountOf(T, D)).toEqual({ held: 1, part: 1, total: 3, counted: 1 });
    expect(giltsCountOf(T, D, { agreed: true })).toEqual({ held: 1, part: 1, total: 3, counted: 2 });
    expect(giltsCountOf({ kind: 'buckets' }, D)).toBe(null);
  });
  it('the sheet\'s bought column is the page\'s diff, as the sheet read it before', () => {
    const plan = planOf('saver-locked-ladder');
    const r = moveReadingOf(plan, { now: NOW });
    const before = orderSheetRows(plan.planDocument, plan.holdings, { today: NOW, params: r.m.strategyParams });
    expect(sheetOf(plan.planDocument, r).map((x) => [x.tidm, x.bought, x.part])).toEqual(before.map((x) => [x.tidm, x.bought, x.part]));
  });
  it('once accepted, the gilts held below the plan\'s units say they are paid from what else is held, never "less than the plan says"', () => {
    const plan = planOf('retired-locked-ladder');
    const life = { key: 'moving', agreed: { at: '2026-11-10T09:00:00.000Z' } };
    const h = heldLadder(plan, { today: PARITY_DAY, life });
    expect(h.gilts.chosen).toBe(true);
    const v = heldLadderView(h);
    const text = [...v.under, ...v.gilts.map((g) => g.difference)].map((s) => sayHeld(s, HELD)).join(' ');
    expect(text).not.toMatch(/less (that year|over those years)|pay less than the plan says/);
    if (h.gilts.under + h.gilts.none > 0) expect(text).toContain(HELD.belowChosen);
  });
});

describe('what is held and the plan\'s mix: one reader each', () => {
  it('the held mix is every account\'s, in whole percent; the totals are the record\'s', () => {
    const plan = planOf('mover-holdings');
    const m = heldMixOf(plan);
    expect(Object.keys(m)).toEqual(['shares', 'bonds', 'diversifiers', 'cash']);
    expect(holdingsTotalsOf(plan).total).toBeGreaterThan(0);
    // the full view's What you hold card and its Accumulation tab draw the one line, its figures marked (heldMixLineHtml)
    const line = heldMixLineHtml(plan.holdings, { charge: true });
    for (const b of ['shares', 'bonds', 'diversifiers', 'cash']) expect(line).toContain('data-fact="mix.held.' + b + '">' + m[b] + '<');
    expect(line).toContain('Yearly charge, weighted:');
    const src = readFileSync('index.html', 'utf8');
    const acc = src.slice(src.indexOf('window.renderAccumulationHoldings'), src.indexOf('window.renderAccumulationHoldings') + 2000);
    expect(acc).toContain('heldMixLineHtml(rec');
    expect(acc).not.toContain('describeMix(');
  });
  it('a locked plan\'s mix is its document\'s year 0; a ladder has none', () => {
    const p = planOf('retired-locked-pots');
    const m0 = p.planDocument.targetMix[0];
    expect(planMixOf(p, { now: NOW })).toEqual({ shares: m0.equity, bonds: m0.bond, cash: m0.cash, from: 'document' });
    expect(planMixOf(planOf('retired-locked-ladder'), { now: NOW })).toBe(null);
  });
});

describe('keep and stands-in years: one parser, one refusal, the same words in both views', () => {
  it('a year is typed one way in both views', async () => {
    const { typedTaxYears } = await import('../../src/answers/plan/hold.js');
    expect(typedTaxYears('2028/29, 2029')).toEqual([2028, 2029]);
    expect(typedTaxYears('2028/30')).toBe(null);
    expect(typedTaxYears('next year')).toBe(null);
  });
  it('a gilt that pays after the years chosen is refused in both views, in the same words', async () => {
    const { holdOf } = await import('../../src/answers/plan/hold.js');
    const { tooEarlyWords } = await import('../../src/ui/keepHoldingsUi.js');
    const { GAPS } = await import('../../src/v7/copy/gaps.js');
    const entries = entriesOf('saver-locked-ladder');
    const plan = entries.find((e) => e.plan.id === subjectOf('saver-locked-ladder')).plan;
    const line = { wrapper: 'SIPP', ticker: 'TG28', name: '4½% Treasury Gilt 2028', units: 20000, value: 19900, kind: 'gilt' };
    plan.holdings = { ...normaliseHoldings(plan.holdings), lines: [...normaliseHoldings(plan.holdings).lines, line] };
    const at = plan.holdings.lines.length - 1;
    const v = holdOf(entries, plan.id, { today: PARITY_DAY, typed: { 'keep.index': at, [`line.${at}.keepAs`]: 'rung', [`line.${at}.keepYears`]: '2027' } });
    const k = v.groups.flatMap((g) => g.lines).find((l) => l.index === at).keep;
    expect(k.error).toBe('tooEarly');
    expect(k.change).toBe(null);
    const words = GAPS.keep.tooEarly.replace(/\{(\w+)\}/g, (m, x) => k.errorSlots[x]);
    expect(tooEarlyWords(line, [2027])).toBe(words);
    expect(words).toMatch(/^This gilt pays on \d+ \w+ 2028, after 2027\/28 ends, so it cannot pay for 2027\/28\.$/);
  });
});

describe('a partner\'s plan made in the full view (lead4.md D2, D20)', () => {
  it('is made through the one timing seed, dated, and linked; nothing nobody gave is stored', () => {
    const src = readFileSync('index.html', 'utf8');
    const at = src.indexOf('window.createPartnerPlanReal = async function');
    const body = src.slice(at, src.indexOf('location.reload()', at));
    expect(body).toContain('timingSettingsOf(');
    expect(body).toContain('setHouseholdPartnerId(');
    expect(body).not.toMatch(/createNewScenario\([^)]*, \{\}, true\)/);
    // ages are not figures: the plan is not marked as having figures given (PlanFigures.planHasFigures)
    expect(body).toContain('const { configured: _given, ...timingOnly } = timing;');
    expect(body).toContain('{ stressSettings: timingOnly }');
  });
  it('a partner still working stops in a month ahead; one already stopped has no stop month to come', async () => {
    const { timingSettingsOf } = await import('../../src/services/PlanFromSeed.js');
    const { deriveTiming, taxYearStartOf } = await import('../../src/services/PlanTiming.js');
    const working = timingSettingsOf({}, { ageToday: 58, later: true, ageAtStop: 62 }, PARITY_DAY);
    expect(working).toMatchObject({ currentAge: 58, currentAgeAsOf: PARITY_DAY, retired: false, retireAge: 62 });
    const t = deriveTiming(working, NOW);
    expect(t.startMonth > PARITY_DAY.slice(0, 7)).toBe(true);
    expect(working.firstTaxYear).toBeGreaterThanOrEqual(taxYearStartOf(NOW));
    const stopped = timingSettingsOf({}, { ageToday: 70, later: false }, PARITY_DAY);
    expect(stopped).toMatchObject({ currentAge: 70, retired: true, retireAge: null, firstTaxYear: taxYearStartOf(NOW) });
  });
});
