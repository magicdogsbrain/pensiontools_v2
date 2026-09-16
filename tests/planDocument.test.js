import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { buildPlanDocument, whereAmI, shapeLayersFromSettings, trimResult, CONTRACT_STRATEGIES } from '../src/services/PlanDocument.js';
import { planDocumentHtml, whereAmIHtml, planDocumentHeaderHtml } from '../src/ui/components/PlanDocumentView.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';

const NOW = new Date(2026, 8, 9);
// Chris-like plan: retired, starts 2027/28, steps 83,650 → 68,650 at 60 → 48,650 at 70, DB £3,650, SP 21 Apr 2037,
// £90k pension lump in plan year 1, gilt ladder + rotation on a pinned SIPP total.
const settings = {
  currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, shapeAgeNow: 57, duration: 35,
  spStartDate: '21 April 2037', spWeeklyAmount: 230, baseSalary: 83650,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 57, amount: 83650 }, { fromAge: 60, amount: 68650 }, { fromAge: 70, amount: 48650, decline: 1 }],
  dbAmount: 3650, dbStartYear: 0, other: 0,
  windfalls: [{ label: 'Other SIPP transfer', amount: 90000, year: 1, wrapper: 'pension' }],
  equityMin: 300000, bondMin: 800000, cashTarget: 79422, isaBalance: 60000, isaDrawdownStrategy: 'hold',
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  strategyId: 'gilt-rotation', strategyParams: { sippTotal: 1179422, isaTotal: 60000, cashYears: 3, bridgeCash: 50000, rotateCutAge: 75 }
};
const p = planFromSettings(settings, createSimulationConfigFromSettings({}, settings), {});
// A stubbed strategy result in the shape stressTestStrategy returns (flat cones for a ladder).
const N = p.durationYears;
const flat = Array.from({ length: N + 1 }, (_, y) => 1152092 - y * 30000);
const r = {
  strategyId: 'gilt-rotation', name: 'Gilt ladder + rotation', affordable: true,
  ruin: { hist: 2.4, mc: 12.8 }, ruinLabel: 'chance the plan is cut', coverage: 99, worst12: { min: 48650, median: 68650 },
  guaranteedToAge: '75 by contract whatever happens', terminal: { p10: 0, p50: 120000, p90: 400000 },
  cones: { wealth: { p10: flat, p25: flat, p50: flat, p75: flat, p90: flat }, income: { p10: p.needByYear, p25: p.needByYear, p50: p.needByYear, p75: p.needByYear, p90: p.needByYear } },
  samples: { wealth: [flat, flat], income: [] }, n: { hist: 120, mc: 1000 }, failAges: [], wealthLabel: 'x', configs: { lr: { drawNetOfSp: () => 1 } },
  signature: { rotateTrigger: 30, rotateCutAge: 75, total: 1152092, spare: 27330, cash: 203646, giltsCost: 948446, orders: 22, cashYears: 3, firstTaxYear: 2027, triggeredShare: 0.64, soldRungs: 12, blockValueToday: 300000, blockIncome: 500000 },
  plan: { cash: 203646, cashYears: [{ Y: 2027 }, { Y: 2028 }, { Y: 2029 }], orders: [{ name: 'IL 2030', tidm: 'T30', pays: 40000, cost: 39000, taxYears: [2030], nominal: 36000, cleanPrice: 108 }], years: Array.from({ length: N }, (_, y) => ({ Y: 2027 + y, age: 57 + y, gross: p.needByYear[y], need: Math.max(0, p.needByYear[y] - (y >= 10 ? 11960 : 0) - 3650), from: y < 3 ? 'cash' : 'T' + (2027 + y) })), total: 1152092, spare: 27330 }
};

describe('buildPlanDocument', () => {
  const doc = buildPlanDocument({ planName: 'Chris Real', settings, p, r, lockedAt: '2026-09-09T18:00:00.000Z', now: NOW, budgetGross: 70000, essentials: 40000 });
  it('is plain JSON with no functions and modest size', () => {
    const s = JSON.stringify(doc);
    expect(s).not.toMatch(/=>|function/);
    expect(JSON.parse(s)).toEqual(doc);
    expect(s.length).toBeLessThan(200000);
    expect(doc.strategy.r.samples).toBeUndefined();
    expect(doc.strategy.p.pnvCfg).toBeUndefined();
  });
  it('timeline: year 0 = 2027/28 age 57 £83,650; the step down lands in year 3; SP from year 10; the lump sum in 2028/29', () => {
    const t = doc.timeline;
    expect(t[0]).toMatchObject({ y: 0, taxYear: '2027/28', age: 57, gross: 83650, cashYear: true });
    expect(t[2].gross).toBe(83650);
    expect(t[3]).toMatchObject({ taxYear: '2030/31', age: 60, gross: 68650 });
    expect(t[9].sp).toBe(0);
    expect(t[10].sp).toBeGreaterThan(11000);
    expect(t[1].lumpIn).toEqual([{ label: 'Other SIPP transfer', amount: 90000, wrapper: 'pension' }]);
    expect(t[1].taxYear).toBe('2028/29');
    expect(t[0].other).toBe(3650);
    expect(t.length).toBe(35);
  });
  it('steps carry their tax year and slope wording', () => {
    expect(doc.steps[0]).toMatchObject({ fromAge: 57, taxYear: '2027/28', amount: 83650, slope: 'level within the step' });
    expect(doc.steps[2]).toMatchObject({ fromAge: 70, taxYear: '2040/41', slope: '−1% a year (real)' });
  });
  it('pots, strategy and assumptions', () => {
    expect(doc.pots).toMatchObject({ sipp: 1179422, isa: 60000, gia: 0, isaPolicy: 'hold' });
    expect(doc.strategy).toMatchObject({ id: 'gilt-rotation', contract: true });
    expect(doc.targetMix).toEqual([]);
    expect(doc.assumptions).toMatchObject({ firstTaxYear: 2027, bridgeMonths: 7, cashYears: 3, bridgeCash: 50000, spStartDate: '21 April 2037' });
    expect(doc.timing.text).toContain('Plan starts 6 April 2027');
    expect(doc.decisionRun.monthlyAsks[0]).toMatch(/Gilt ladder value/);
  });
  it('a pot strategy carries a target mix and no ladder', () => {
    const s2 = { ...settings, strategyId: 'pots-and-valves', strategyParams: {}, equityGlideEnabled: true };
    const d2 = buildPlanDocument({ settings: s2, p: planFromSettings(s2, createSimulationConfigFromSettings({}, s2), {}), r: null, now: NOW });
    expect(d2.strategy.contract).toBe(false);
    expect(d2.targetMix.length).toBeGreaterThan(3);
    expect(d2.targetMix[0].equity + d2.targetMix[0].bond + d2.targetMix[0].cash).toBeGreaterThanOrEqual(99);
    expect(d2.timeline[0].gross).toBe(83650);
    expect(d2.pots.sipp).toBe(300000 + 800000 + 79422);
  });
  it('a Pots & Valves document is sized from the allocation even when a deselected ladder left a sippTotal behind (6.13.0)', () => {
    const s3 = { ...settings, strategyId: 'pots-and-valves', strategyParams: { sippTotal: 800000, isaTotal: 1, cashYears: 3, bridgeCash: 50000 } };
    const d3 = buildPlanDocument({ settings: s3, p: planFromSettings(s3, createSimulationConfigFromSettings({}, s3), {}), r: null, now: NOW });
    expect(d3.pots.sipp).toBe(300000 + 800000 + 79422);   // not 800,000
    expect(d3.pots.isa).toBe(60000);                         // the ISA balance, not the stray isaTotal
    expect(d3.strategy.params).toEqual({});
    expect(d3.assumptions).toMatchObject({ cashYears: null, bridgeCash: 0 });
    // a ladder strategy still reads its own keys — and only its own
    const s4 = { ...settings, strategyParams: { ...settings.strategyParams, floorToAge: 80 } };
    const d4 = buildPlanDocument({ settings: s4, p, r, now: NOW });
    expect(d4.pots.sipp).toBe(1179422);
    expect(d4.strategy.params).toEqual({ sippTotal: 1179422, isaTotal: 60000, cashYears: 3, bridgeCash: 50000, rotateCutAge: 75 });
  });
  it('shapeLayersFromSettings mirrors the preview: SP layer from age 67, DB from 57, the lump as an event', () => {
    const L = shapeLayersFromSettings(settings);
    expect(L.sp.fromAge).toBe(67);
    expect(L.other[0]).toMatchObject({ annual: 3650, fromAge: 57, label: 'DB pension' });
    expect(L.events[0]).toMatchObject({ age: 58, amount: 90000, kind: 'in' });
    expect(L.floorVals[0]).toBe(3650);
    expect(L.floorVals[10]).toBeGreaterThan(11000);
  });
  it('trimResult keeps what the card needs and drops the bulk', () => {
    const tr = trimResult(r);
    expect(tr.cones.wealth.p50.length).toBe(N + 1);
    expect(tr.configs).toEqual({});
    expect(tr.plan.orders.length).toBe(1);
    expect(CONTRACT_STRATEGIES).toContain('gilt-rotation');
  });
});

describe('whereAmI', () => {
  const doc = buildPlanDocument({ planName: 'Chris Real', settings, p, r, now: NOW });
  it('September 2026 is a bridge month, step 1, pot compared with the contract path', () => {
    const w = whereAmI(doc, { today: NOW, history: [{ date: '2026-09', taxYear: '26/27', sipp: 7000, other: 305, equity: 0, bond: 952960, cash: 226461 }] });
    expect(w.bridge).toBe(true);
    expect(w.planYear).toBe(-1);
    expect(w.planStart).toBe('2027/28');
    expect(w.step).toMatchObject({ index: 1, of: 3, amount: 83650 });
    expect(w.step.next).toMatchObject({ fromAge: 60, amount: 68650 });
    expect(w.incomeThisYear.recorded).toBe(1);
    expect(w.incomeThisYear.drawn).toBe(7305);
    expect(w.pot.actual).toBe(1179421);
    expect(w.pot.flat).toBe(true);
  });
  it('April 2030 is plan year 3, age 60, step 2', () => {
    const w = whereAmI(doc, { today: new Date(2030, 3, 10), history: [], potsToday: 900000 });
    expect(w).toMatchObject({ bridge: false, planYear: 3, age: 60, taxYear: '2030/31' });
    expect(w.step).toMatchObject({ index: 2, amount: 68650 });
    expect(w.pot.p50).toBe(1152092 - 90000);
  });
  it('pot banding against a real cone', () => {
    const d2 = JSON.parse(JSON.stringify(doc));
    d2.strategy.r.cones.wealth = { p10: [100], p50: [200], p90: [300] };
    expect(whereAmI(d2, { today: new Date(2027, 5, 1), potsToday: 50 }).pot.band).toBe('below p10');
    expect(whereAmI(d2, { today: new Date(2027, 5, 1), potsToday: 150 }).pot.band).toBe('p10–p50');
    expect(whereAmI(d2, { today: new Date(2027, 5, 1), potsToday: 250 }).pot.band).toBe('p50–p90');
    expect(whereAmI(d2, { today: new Date(2027, 5, 1), potsToday: 350 }).pot.band).toBe('above p90');
  });
  it('returns null for no document', () => { expect(whereAmI(null, {})).toBeNull(); });
});

describe('planDocumentHtml', () => {
  const doc = buildPlanDocument({ planName: 'Chris <Real>', settings, p, r, now: NOW });
  it('renders every section, escapes, and uses the injected renderers', () => {
    const h = planDocumentHtml(doc, { strategyCard: () => '<div class="card">CARD</div>', staircaseSvg: () => '<svg>STAIRS</svg>', whereAmI: '<div>WHERE</div>' });
    expect(h).toContain('Chris &lt;Real&gt;');
    expect(h).toContain('1. Timeline');
    expect(h).toContain('2. Strategy');
    expect(h).toContain('3. Portfolio');
    expect(h).toContain('4. Assumptions');
    expect(h).toContain('CARD');
    expect(h).toContain('STAIRS');
    expect(h).toContain('WHERE');
    expect(h).toContain('2028/29');
    expect(h).toContain('Gilt ladder value');
    expect(h).not.toContain('<Real>');
  });
  it('survives an empty or legacy document and a throwing renderer', () => {
    expect(planDocumentHtml({})).toContain('No plan document yet');
    expect(planDocumentHtml(null)).toContain('No plan document yet');
    const h = planDocumentHtml(doc, { strategyCard: () => { throw new Error('boom'); } });
    expect(h).toContain('could not be drawn');
    expect(planDocumentHeaderHtml(doc)).toContain('Plan document');
  });
  it('the where-am-I strip reads as sentences', () => {
    const w = whereAmI(doc, { today: NOW, history: [] , potsToday: 1179421 });
    const h = whereAmIHtml(w);
    expect(h).toContain('Run-up month');
    expect(h).toContain('2027/28');
    expect(h).toContain('Income step 1 of 3');
    expect(whereAmIHtml(null)).toBe('');
  });
});

describe('holdingsAtLock — what you HELD, apart from what the strategy was tested on (6.13.0)', () => {
  const holdings = { version: 1, updatedAt: '2026-09-09', source: 'paste', offerDismissed: false, lines: [
    { wrapper: 'SIPP', ticker: 'TR30', name: 'IL Treasury 2030', sedol: 'B4PTCY7', units: 35000, value: 38584, ocf: null, contribution: null, subClass: 'indexLinked', kind: 'gilt', asOf: '2026-09-01' },
    { wrapper: 'isa', ticker: 'vwrp', name: null, sedol: null, units: null, value: 60000, ocf: 0.22, contribution: null, subClass: null, kind: null, asOf: null }
  ] };
  const doc = buildPlanDocument({ planName: 'Chris Real', settings, p, r, holdings, lockedAt: '2026-09-09T10:00:00.000Z', now: NOW });
  it('every strategy carries the snapshot, normalised; the document version moved', () => {
    expect(doc.version).toBe(2);
    expect(doc.holdingsAtLock.updatedAt).toBe('2026-09-09');
    expect(doc.holdingsAtLock.source).toBe('paste');
    expect(doc.holdingsAtLock.lines.length).toBe(2);
    expect(doc.holdingsAtLock.lines[1]).toMatchObject({ wrapper: 'ISA', ticker: 'VWRP', value: 60000 });
    expect(JSON.stringify(doc)).not.toMatch(/undefined/);
    // no holdings passed → the empty record, never the Stress settings' funds
    const bare = buildPlanDocument({ settings: { ...settings, taggedFunds: [{ ticker: 'VWRP', value: 1 }] }, p, r, now: NOW });
    expect(bare.holdingsAtLock).toEqual({ updatedAt: null, source: 'none', lines: [] });
    expect(bare.pots.allocation.taggedFunds.length).toBe(1);   // still recorded — as the funds the strategy was tested on
  });
  it('the view shows what was held, and calls the tested funds what they are', () => {
    const h = planDocumentHtml(doc);
    expect(h).toContain('What you held when the plan was locked');
    expect(h).toContain('IL Treasury 2030');
    expect(h).toContain('35,000');
    expect(h).toContain('pasted from a platform page');
    expect(h).toContain('Pots the plan was priced on');
    expect(h).toContain('3. Portfolio — what you held, and what the plan was priced on');
    expect(h).not.toContain('Pot today');
    const s2 = { ...settings, strategyId: 'pots-and-valves', strategyParams: {}, taggedFunds: [{ ticker: 'VWRP', name: 'FTSE All-World', value: 500000, wrapper: 'SIPP' }] };
    const h2 = planDocumentHtml(buildPlanDocument({ settings: s2, p: planFromSettings(s2, createSimulationConfigFromSettings({}, s2), {}), now: NOW }));
    expect(h2).toContain('Funds the strategy was tested on');
    expect(h2).toContain('not a record of what you hold');
    expect(h2).toContain('No holdings were on record when the plan was locked');
    const legacy = JSON.parse(JSON.stringify(doc)); delete legacy.holdingsAtLock;
    expect(planDocumentHtml(legacy)).toContain('written before holdings were recorded');
  });
  it('a record refreshed AFTER the lock is titled as what you hold now, not what you held at lock (6.13.0)', () => {
    const later = buildPlanDocument({ planName: 'Chris Real', settings, p, r, holdings: { ...holdings, updatedAt: '2026-09-20' }, lockedAt: '2026-09-09T10:00:00.000Z', now: NOW });
    const h = planDocumentHtml(later);
    expect(h).toContain('What you hold (recorded 20 September 2026, after the plan was locked on 9 September 2026)');
    expect(h).not.toContain('What you held when the plan was locked');
    // same day, or recorded before the lock → the lock-time title
    expect(planDocumentHtml(buildPlanDocument({ settings, p, r, holdings: { ...holdings, updatedAt: '2026-09-09' }, lockedAt: '2026-09-09T23:59:00.000Z', now: NOW }))).toContain('What you held when the plan was locked');
    expect(planDocumentHtml(buildPlanDocument({ settings, p, r, holdings: { ...holdings, updatedAt: '2026-09-01' }, lockedAt: '2026-09-09T10:00:00.000Z', now: NOW }))).toContain('What you held when the plan was locked');
    // the "record what you hold" pointers name the Transition tab
    const bare = planDocumentHtml(buildPlanDocument({ settings, p, r, now: NOW }));
    expect(bare).toContain('Record what you hold on the Transition tab (What you hold — paste it from your platform or type the lines)');
    expect(bare).not.toContain('Accumulation planner → what you hold');
  });
});

describe('a lump sum the ladder spends is shown as such, not as other income (6.11.3)', () => {
  it('incomeLayersRows splits the lump\'s use out of other income', async () => {
    const { incomeLayersRows } = await import('../src/ui/incomeLayersGraphic.js');
    const p = { durationYears: 4, startAge: 62, spStartYear: 99, spAnnual: 0, needByYear: [30000, 30000, 30000, 30000],
      otherIncomeByYear: [14000, 30000, 30000, 0], windfallByYear: [0, 60000, 0, 0], windfallCarryByYear: [0, 30000, 0, 0] };
    const rows = incomeLayersRows({ strategyId: 'floor-the-schedule', cones: {} }, p);
    expect(rows.map((r) => r.lump)).toEqual([0, 30000, 30000, 0]);
    expect(rows.map((r) => r.otherPure)).toEqual([14000, 0, 0, 0]);
    expect(rows[1].other).toBe(30000);   // the stacked graphic still sums
    // Pots & Valves takes the lump into the pot: no lump layer, no other income from it — the pot pays
    const pv = incomeLayersRows({ strategyId: 'pots-and-valves', cones: { income: { p50: [30000, 30000, 30000, 30000] } } }, p);
    expect(pv.map((r) => r.lump)).toEqual([0, 0, 0, 0]);
    expect(pv.map((r) => r.other)).toEqual([14000, 0, 0, 0]);
    expect(pv[1].market).toBe(30000);
  });
});
