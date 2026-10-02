/**
 * Bug replays — two ways a plan that had NOT been touched showed different figures on a different day.
 *
 *  A. "April slide": a retired plan with no saved start year (any plan last saved before 6.4.0 — and a locked
 *     plan can never be re-saved from its form) had the year re-derived from today's date every time it was
 *     opened. On 6 April it moved a year, and the ages, the State Pension year and every rung moved with it.
 *     The same rule also threw away a SAVED start once it had passed: a plan that started in 2027/28 jumped to
 *     2029/30 on 6 April 2028.
 *  B. "Locked ladder re-priced daily": a locked gilt-ladder plan's order sheet, costs and monthly figure were
 *     rebuilt from the live settings and today's gilt prices on every view, so they drifted from the plan
 *     document — and once a rung had matured the rebuild could not find its gilt at all.
 *
 * The load path is exercised through the real repositories in guest mode (the same code as Firestore minus the
 * network), exactly as tests/fixtures/plans/checks.mjs does.
 */
import { describe, it, expect, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { deriveTiming, pinTiming, timingPinPatch, decisionAnchorYear } from '../../src/services/PlanTiming.js';
import { ladderPosition, documentLadder, ladderForDisplay, repriceComparisonText } from '../../src/services/LadderPosition.js';
import { repriceLadder } from '../../src/strategies/GiltLadderPlan.js';
import { planFromSettings, stressTestStrategy } from '../../src/strategies/stressTest.js';
import { realYieldForYear, setLinkersOverride, activeLinkers } from '../../src/services/LinkerUniverse.js';
import { getStressSettingsAsync, createSimulationConfigFromSettings, timingPinSettled, invalidateStressCache } from '../../src/storage/StressRepository.js';
import { invalidateScenarioCache, getActiveScenarioAsync } from '../../src/storage/ScenarioRepository.js';
import { loadDecisionDBAsync, invalidateCache as invalidateDecisionCache, decisionSettingsChecksum } from '../../src/storage/DecisionRepository.js';
import { seedGuestStore, authSettled, GUEST_KEY } from '../fixtures/plans/checks.mjs';
import { at, frozenAt } from './_replay.js';

const ROOT = join(__dirname, '..', '..');
const MARKET = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/plans/market/gilts.json'), 'utf8'));   // the frozen gilt file the fixtures were priced on
const LOCKED_LADDER = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/plans/03-gilt-ladder-runup.json'), 'utf8'));
const INDEX_HTML = readFileSync(join(ROOT, 'index.html'), 'utf8');

const APR_4 = at(2027, 4, 4), APR_8 = at(2027, 4, 8);   // either side of 6 April 2027
const dropCaches = () => { invalidateScenarioCache(); invalidateDecisionCache(); invalidateStressCache(); };
const storedScenario = () => JSON.parse(globalThis.sessionStorage.getItem(GUEST_KEY))[0];
/** The ladder the app builds from settings on a given day (strategyPlanFor in index.html). */
const ladderOn = (settings, now) => {
  const p = planFromSettings(settings, createSimulationConfigFromSettings({}, settings), { yieldForYear: realYieldForYear, startAge: +settings.shapeAgeNow || 57, now });
  return stressTestStrategy('full-il-gilt', p).plan;
};
const rungs = (plan) => ({ firstTaxYear: plan.firstTaxYear, years: plan.years.map((y) => [y.Y, y.age, Math.round(y.need), y.from]), orders: plan.orders.map((o) => [o.tidm, o.taxYears.join('+'), Math.round(o.pays), o.nominal]) });

/** A retired gilt-ladder plan as 6.3 saved it: an age, but no `retired`, no `firstTaxYear`. */
const PRE_6_4 = {
  configured: true, strategyId: 'full-il-gilt', strategyParams: { sippTotal: 1300000, isaTotal: 0, cashYears: 2, bridgeCash: 0 },
  equityMin: 600000, bondMin: 500000, cashTarget: 200000, isaBalance: 0, duration: 30, baseSalary: 40000,
  currentAge: 60, currentAgeAsOf: '2026-09-10', shapeAgeNow: 61, incomeShape: 'phases', incomeSteps: [{ fromAge: 61, amount: 40000 }],
  spStartDate: '10 September 2033', spWeeklyAmount: 230.25, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates'
};
const DECISION = { configured: true, baseSalary: 40000, equityMin: 600000, bondMin: 500000, cashTarget: 200000, duration: 30 };
const scenarioWith = (stress, decision = DECISION) => ({
  id: 'replay-april-slide', planDetails: { name: 'Replay', description: '' }, enabledTools: ['stress', 'decision'], isActive: true,
  createdAt: '2026-03-01T10:00:00.000Z', lastModified: '2026-03-01T10:00:00.000Z',
  stressTool: { settings: stress }, decisionTool: { settings: decision, history: [], taxYears: {} }
});
/** One cold load of the active plan's Stress settings on `day`, waiting for the one-off write to land. */
async function openOn(day) {
  dropCaches();
  return frozenAt(day, async () => { const s = await getStressSettingsAsync(); await timingPinSettled(); return s; });
}

afterAll(() => { setLinkersOverride(null); dropCaches(); vi.useRealTimers(); });

describe('A — the April slide: a plan\'s start year is written into the plan once and never derived again', () => {
  it('A (the bug, still true of the bare derivation) — with nothing saved, 4 April says 2027/28 and 8 April says 2028/29', () => {
    expect(deriveTiming(PRE_6_4, APR_4).firstTaxYear).toBe(2027);
    expect(deriveTiming(PRE_6_4, APR_8).firstTaxYear).toBe(2028);   // which is why it has to be SAVED the first time
  });

  for (const locked of [false, true]) {
    it('A — a retired ' + (locked ? 'LOCKED plan' : 'draft') + ' with no saved start: opened on 4 April, then on 8 April, it has the same start year and the same ladder', async () => {
      await authSettled();
      setLinkersOverride(MARKET);
      const decision = locked ? { ...DECISION, locked: true, lockedAt: '2026-04-10T08:05:00.000Z', lockedBy: 'first monthly entry' } : DECISION;
      seedGuestStore(scenarioWith(PRE_6_4, decision));
      const checksumBefore = decisionSettingsChecksum(storedScenario().decisionTool.settings);

      const first = await openOn(APR_4);
      expect(first.firstTaxYear).toBe(2027);
      // Written into the saved plan by that first load — no Save button involved (a locked plan has none).
      const saved = storedScenario().stressTool.settings;
      expect(saved).toMatchObject({ firstTaxYear: 2027, retired: true });
      expect(saved.baseSalary).toBe(40000);                                  // the rest of the plan is as it was
      // Only the timing fields were added — and, on the draft only, the default fund and platform charge (6.19.0, the
      // schema-2 migration on load). A locked plan is given no charge: it keeps its figures until it is unlocked.
      expect(Object.keys(saved).sort()).toEqual([...Object.keys(PRE_6_4), 'firstTaxYear', 'retired', ...(locked ? [] : ['chargesPct', 'isaGrowth'])].sort());
      if (!locked) { expect(saved.chargesPct).toBe(0.5); expect(saved.isaGrowth).toBe('cash'); }   // 6.19.0, 6.22.0: an unlocked plan's defaults
      const ladderBefore = frozenAt(APR_4, () => ladderOn(first, APR_4));

      const second = await openOn(APR_8);                                    // a new visit, two days after the tax year turned
      expect(second.firstTaxYear).toBe(2027);                                // was 2028
      expect(deriveTiming(second, APR_8)).toMatchObject({ mode: 'retired', firstTaxYear: 2027, shapeAgeNow: deriveTiming(first, APR_4).shapeAgeNow });
      const ladderAfter = frozenAt(APR_8, () => ladderOn(second, APR_8));
      expect(rungs(await ladderAfter)).toEqual(rungs(await ladderBefore));   // same years, ages, gilts, income and units
      expect((await ladderAfter).firstTaxYear).toBe(2027);

      // The Decision settings were not written, so a locked plan's checksum — and every record stamped with it — stands.
      expect(decisionSettingsChecksum(storedScenario().decisionTool.settings)).toBe(checksumBefore);
      dropCaches();
      expect(decisionSettingsChecksum((await loadDecisionDBAsync()).settings)).toBe(checksumBefore);
      // …and the Decision tool reads its year 0 from the Stress plan, where the anchor now lives.
      expect(decisionAnchorYear(storedScenario().decisionTool.settings, {}, null, second, APR_8)).toBe(2027);

      // Nothing more to write on later loads.
      expect(timingPinPatch(storedScenario().stressTool.settings, second)).toBeNull();
      expect((await getActiveScenarioAsync()).stressTool.settings.firstTaxYear).toBe(2027);
    });
  }

  it('A — a saved start is kept once it has passed: a plan that began in 2027/28 is in its second year in September 2028, not starting again in 2029', () => {
    const saved = { ...PRE_6_4, retired: true, firstTaxYear: 2027 };
    const t = deriveTiming(saved, at(2028, 9, 10));
    expect(t.firstTaxYear).toBe(2027);            // was 2029: honoured only while it was this tax year or later
    expect(t.shapeAgeNow).toBe(61);               // the age the steps started at does not creep either
    expect(t.yearsToStart).toBe(0);
    expect(t.bridgeMonths).toBe(0);
    // "This tax year" chosen in 2026/27 used to jump TWO years on the first 6 April.
    expect(deriveTiming({ ...PRE_6_4, retired: true, firstTaxYear: 2026 }, APR_8).firstTaxYear).toBe(2026);
  });

  it('A — a plan with no age at all ("the calendar year after today") stops moving on 1 January, and the Decision tool\'s recorded years are not re-anchored', async () => {
    await authSettled();
    const { currentAge, currentAgeAsOf, spStartDate, spWeeklyAmount, ...noAge } = PRE_6_4;
    expect(deriveTiming(noAge, at(2026, 12, 30)).firstTaxYear).toBe(2027);
    expect(deriveTiming(noAge, at(2027, 1, 2)).firstTaxYear).toBe(2028);     // the bare derivation still slides
    seedGuestStore(scenarioWith(noAge));
    const first = await openOn(at(2026, 12, 30));
    expect(deriveTiming(first, at(2026, 12, 30))).toMatchObject({ mode: 'legacy', firstTaxYear: 2027 });
    expect(storedScenario().stressTool.settings.legacyFirstTaxYear).toBe(2027);
    expect(storedScenario().stressTool.settings.firstTaxYear ?? null).toBeNull();   // pinned under its own name…
    const second = await openOn(at(2027, 1, 2));
    expect(deriveTiming(second, at(2027, 1, 2)).firstTaxYear).toBe(2027);           // was 2028
    // …so the Decision tool still counts from the first tax year it was set up for, as its history was recorded.
    expect(decisionAnchorYear({}, { '26/27': {}, '27/28': {} }, null, second, at(2027, 1, 2))).toBe(2026);
  });

  it('A — an age saved without its date is dated on first load, so the person gets older and the start age stops creeping', () => {
    const undated = { ...PRE_6_4, retired: true, firstTaxYear: 2027, currentAgeAsOf: null };
    expect(deriveTiming(undated, at(2026, 9, 10)).shapeAgeNow).toBe(61);
    expect(deriveTiming(undated, at(2029, 9, 10)).shapeAgeNow).toBe(58);           // the bug: "60 today" for ever
    const pinned = pinTiming(undated, null, at(2026, 9, 10));
    expect(pinned.currentAgeAsOf).toBe('2026-09-10');
    expect(timingPinPatch(undated, pinned)).toEqual({ currentAgeAsOf: '2026-09-10' });
    expect(deriveTiming(pinned, at(2029, 9, 10)).shapeAgeNow).toBe(61);
    expect(pinTiming(pinned, null, at(2029, 9, 10))).toBe(pinned);                 // idempotent
    // An age folded in from the Budget is the Budget's to date: nothing is pinned for it on the Stress side.
    expect(timingPinPatch({ ...undated, currentAge: null }, pinned)).toBeNull();
  });

  it('A — the Decision tool takes the anchor from the Stress plan without writing it onto the (hashed) Decision settings', () => {
    const fn = INDEX_HTML.slice(INDEX_HTML.indexOf('async function calcDecisionWithDeps('), INDEX_HTML.indexOf('function cadenceMonths('));
    expect(fn).toContain('const settings = { ...(await getDecisionSettingsAsync()) };');   // a copy: the cached settings, and their checksum, are never touched
    expect(fn).not.toMatch(/const settings = await getDecisionSettingsAsync\(\);/);
  });
});

describe('B — a locked plan\'s gilt ladder is the one in its plan document, never a rebuild at today\'s prices', () => {
  const doc = LOCKED_LADDER.planDocument;
  const settings = LOCKED_LADDER.stressTool.settings;
  const TWO_YEARS_ON = at(2028, 9, 10);
  // A different market: every linker 7% dearer, index ratios 6% higher, and the 2029 gilt a further 3% up.
  const MOVED = { ...MARKET, as_of: '2028-09-08', gilts: MARKET.gilts.map((g) => ({ ...g, cleanPrice: g.cleanPrice == null ? null : +(g.cleanPrice * (g.tidm === 'T29' ? 1.10 : 1.07)).toFixed(2), indexRatio: g.indexRatio == null ? null : +(g.indexRatio * 1.06).toFixed(5) })) };

  it('the fixture is a locked ladder with its ladder in the document', () => {
    expect(LOCKED_LADDER.decisionTool.settings.locked).toBe(true);
    expect(doc.strategy.id).toBe('full-il-gilt');
    expect(documentLadder(doc, settings.strategyId)).toBe(doc.strategy.r.plan);
    expect(doc.strategy.r.plan.orders.length).toBeGreaterThan(10);
  });

  it('B — two years on, with different gilt prices, the ladder shown is the document\'s: same orders, units, costs, total and spare', async () => {
    setLinkersOverride(MOVED, TWO_YEARS_ON);
    const rebuild = vi.fn(() => frozenAtSync(TWO_YEARS_ON, () => ladderOn(settings, TWO_YEARS_ON)));
    const shown = ladderForDisplay(doc, settings.strategyId, rebuild);
    expect(shown.source).toBe('document');
    expect(shown.pricedOn).toBe('2026-07-01');
    expect(rebuild).not.toHaveBeenCalled();                       // never a rebuild
    expect(shown.plan).toEqual(doc.strategy.r.plan);              // every order, its units, its cost; cash, total, spare
    expect(shown.plan.orders.map((o) => [o.tidm, o.nominal, o.cost])).toEqual(doc.strategy.r.plan.orders.map((o) => [o.tidm, o.nominal, o.cost]));
    expect([shown.plan.total, shown.plan.spare, shown.plan.cash]).toEqual([doc.strategy.r.plan.total, doc.strategy.r.plan.spare, doc.strategy.r.plan.cash]);

    // What the app showed before: the rebuild. Same plan, same person — different orders and costs.
    const rebuilt = rebuild();
    expect(rebuilt.firstTaxYear).toBe(2027);                      // (the anchor holds — part A)
    const cost = (plan, tidm) => plan.orders.find((o) => o.tidm === tidm)?.cost;
    expect(cost(rebuilt, 'T29')).not.toBeCloseTo(cost(doc.strategy.r.plan, 'T29'), 0);
    expect(Math.round(rebuilt.total)).not.toBe(Math.round(doc.strategy.r.plan.total));

    // Where am I / the Decision tool's "your gilt ladder" panel: read from the document's ladder.
    const pos = ladderPosition(shown.plan, { today: TWO_YEARS_ON });
    const row = doc.strategy.r.plan.years.find((y) => y.Y === 2028);
    expect(pos).toMatchObject({ phase: 'running', taxYear: 2028, age: row.age, fromLadder: row.need, source: row.from });
    expect(pos.monthly).toBeCloseTo(row.need / pos.monthsLeft, 6);
  });

  it('B — today\'s prices appear only as a labelled comparison of the same gilts, and with the lock-day prices it is exactly the locked cost', () => {
    setLinkersOverride(MARKET, at(2026, 7, 1));
    const sameDay = repriceLadder(doc.strategy.r.plan, activeLinkers().gilts, { todayIso: doc.assumptions.giltPricesAsOf });
    expect(sameDay.rungs).toBe(doc.strategy.r.plan.orders.length);
    expect(sameDay.todayCost).toBeCloseTo(sameDay.lockedCost, 6);
    expect(sameDay.lockedCost).toBeCloseTo(doc.strategy.r.plan.giltsCost, 6);
    expect(repriceComparisonText(sameDay, doc.assumptions.giltPricesAsOf)).toMatch(/^Comparison only: at today's prices \(1 July 2026\) the \d+ gilts on this ladder would cost £[\d,]+ to buy — the same as the £[\d,]+ they were priced at on 1 July 2026\./);

    setLinkersOverride(MOVED, TWO_YEARS_ON);
    const later = repriceLadder(doc.strategy.r.plan, activeLinkers().gilts, { now: TWO_YEARS_ON });
    expect(later.asOf).toBe('2028-09-10');
    expect(later.todayCost).toBeGreaterThan(later.lockedCost * 1.10);        // 7% dearer × 6% more index-linking
    expect(later.difference).toBeCloseTo(later.todayCost - later.lockedCost, 6);
    const text = repriceComparisonText(later, doc.assumptions.giltPricesAsOf);
    expect(text).toMatch(/^Comparison only: at today's prices \(10 September 2028\)/);
    expect(text).toMatch(/more than the £[\d,]+ they were priced at on 1 July 2026\./);
    expect(text).toMatch(/Your plan is the locked one: its orders, units and amounts do not change with the market\.$/);
    // The locked ladder itself is untouched by the comparison.
    expect(LOCKED_LADDER.planDocument.strategy.r.plan).toEqual(JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/plans/03-gilt-ladder-runup.json'), 'utf8')).planDocument.strategy.r.plan);
  });

  it('B — a rung that has matured is paid, not re-bought; a gilt missing from today\'s list is named and left out of both sides', () => {
    setLinkersOverride(MOVED, at(2031, 9, 10));
    const plan = doc.strategy.r.plan;
    const t29 = plan.orders.find((o) => o.tidm === 'T29');
    const gone = activeLinkers().gilts.filter((g) => g.tidm !== 'TR31');
    const cmp = repriceLadder(plan, gone, { todayIso: '2031-09-10' });
    expect(t29.matures < '2031-09-10').toBe(true);
    expect(cmp.paid).toBeGreaterThanOrEqual(1);
    expect(cmp.orders.some((o) => o.tidm === 'T29')).toBe(false);
    expect(cmp.rungs + cmp.paid + cmp.unpriced.length).toBe(plan.orders.filter((o) => o.pays > 0).length);
    expect(repriceComparisonText(cmp, '2026-07-01')).toContain('still to be paid');
  });

  it('B — a draft has no document, so it keeps live pricing; a document written for another strategy is not used', () => {
    setLinkersOverride(MARKET, at(2026, 9, 10));
    const live = { years: [{ Y: 2027 }], orders: [] };
    expect(ladderForDisplay(null, 'full-il-gilt', () => live)).toEqual({ plan: live, source: 'live', pricedOn: null });
    expect(ladderForDisplay(doc, 'floor-the-schedule', () => live).source).toBe('live');
    expect(ladderForDisplay({ strategy: { id: 'pots-and-valves', r: {} } }, 'pots-and-valves', () => null)).toEqual({ plan: null, source: 'live', pricedOn: null });
  });

  it('B — the screens are wired to it: where-am-I, the Decision panels, the Stress tab and the strategy page ask for the document\'s ladder first', () => {
    const between = (a, b) => INDEX_HTML.slice(INDEX_HTML.indexOf(a), INDEX_HTML.indexOf(b, INDEX_HTML.indexOf(a)));
    const pos = between('async function ladderPositionForPlan(', 'window.ladderPositionForPlan = ladderPositionForPlan;');
    expect(pos).toContain('await lockedPlanLadder(settings)');
    expect(pos).toContain('ladderForDisplay(locked ? locked.doc : null, sid,');
    const lockedFn = between('async function lockedPlanLadder(', 'function lockedLadderNoteHtml(');
    expect(lockedFn).toContain('getActivePlanDocument()');
    expect(lockedFn).toContain('documentLadder(doc, settings && settings.strategyId)');
    const stressTab = between('async function runStrategyWindowsUI(', '// ---- "Try a strategy"');
    expect(stressTab).toMatch(/const locked = await lockedPlanLadder\(settings\);\s*if \(locked && locked\.doc\.strategy\.p\) \{\s*p = locked\.doc\.strategy\.p; r = locked\.doc\.strategy\.r;/);
    const page = between('async function fullGiltPageHtml()', 'window._ftaFrame = 4;');
    expect(page).toContain('const r = fromDoc ? locked.doc.strategy.r : stressTestStrategy(\'full-il-gilt\', p);');
    expect(page).toContain('A what-if at today\\\'s prices — not your locked plan.');
    expect(between('function lockedLadderNoteHtml(', 'let _ladderPosCache = null;')).toContain('repriceComparisonText(repriceLadder(locked.plan, activeLinkers().gilts), locked.pricedOn)');
  });
});

/** Freeze Date around a synchronous call (createSimulationConfigFromSettings reads the wall clock). */
function frozenAtSync(date, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now: date });
  try { return fn(); } finally { vi.useRealTimers(); }
}
