import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { buildPlanDocument, whereAmI, shapeLayersFromSettings, trimResult, CONTRACT_STRATEGIES } from '../src/services/PlanDocument.js';
import { planDocumentHtml, whereAmIHtml, planDocumentHeaderHtml } from '../src/ui/components/PlanDocumentView.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';

const NOW = new Date(2026, 8, 9);
// A plan: retired, starts 2028/29 at 64, steps 46,000 → 39,000 at 67 → 33,000 at 76 (falling 1% a year), a £5,200 DB
// from plan year 1, SP 3 October 2031, a £40k pension lump in plan year 2, gilt ladder + rotation on a pinned SIPP total.
const settings = {
  currentAge: 61, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2028, shapeAgeNow: 64, duration: 30,
  spStartDate: '3 October 2031', spWeeklyAmount: 230, baseSalary: 46000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 64, amount: 46000 }, { fromAge: 67, amount: 39000 }, { fromAge: 76, amount: 33000, decline: 1 }],
  dbAmount: 5200, dbStartYear: 1, other: 0,
  windfalls: [{ label: 'Inherited pension', amount: 40000, year: 2, wrapper: 'pension' }],
  equityMin: 200000, bondMin: 560000, cashTarget: 100000, isaBalance: 25000, isaDrawdownStrategy: 'minimiseEarlyTax',
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  strategyId: 'gilt-rotation', strategyParams: { sippTotal: 860000, isaTotal: 25000, cashYears: 2, bridgeCash: 20000, rotateCutAge: 80 }
};
const p = planFromSettings(settings, createSimulationConfigFromSettings({}, settings), {});
// A stubbed strategy result in the shape stressTestStrategy returns (flat cones for a ladder).
const N = p.durationYears;
const flat = Array.from({ length: N + 1 }, (_, y) => 845000 - y * 30000);
const r = {
  strategyId: 'gilt-rotation', name: 'Gilt ladder + rotation', affordable: true,
  ruin: { hist: 2.4, mc: 12.8 }, ruinLabel: 'chance the plan is cut', coverage: 99, worst12: { min: 33000, median: 39000 },
  guaranteedToAge: '80 by contract whatever happens', terminal: { p10: 0, p50: 120000, p90: 400000 },
  cones: { wealth: { p10: flat, p25: flat, p50: flat, p75: flat, p90: flat }, income: { p10: p.needByYear, p25: p.needByYear, p50: p.needByYear, p75: p.needByYear, p90: p.needByYear } },
  samples: { wealth: [flat, flat], income: [] }, n: { hist: 120, mc: 1000 }, failAges: [], wealthLabel: 'x', configs: { lr: { drawNetOfSp: () => 1 } },
  signature: { rotateTrigger: 30, rotateCutAge: 80, total: 845000, spare: 15000, cash: 92000, giltsCost: 738000, orders: 18, cashYears: 2, firstTaxYear: 2028, triggeredShare: 0.64, soldRungs: 9, blockValueToday: 200000, blockIncome: 350000 },
  plan: { cash: 92000, cashYears: [{ Y: 2028 }, { Y: 2029 }], orders: [{ name: 'IL 2030', tidm: 'T30', pays: 40000, cost: 39000, taxYears: [2030], nominal: 36000, cleanPrice: 108 }], years: Array.from({ length: N }, (_, y) => ({ Y: 2028 + y, age: 64 + y, gross: p.needByYear[y], need: Math.max(0, p.needByYear[y] - (y >= 3 ? 11960 : 0) - (y >= 1 ? 5200 : 0)), from: y < 2 ? 'cash' : 'T' + (2028 + y) })), total: 845000, spare: 15000 }
};

describe('buildPlanDocument', () => {
  const doc = buildPlanDocument({ planName: 'Alex Example', settings, p, r, lockedAt: '2026-09-09T18:00:00.000Z', now: NOW, budgetGross: 70000, essentials: 40000 });
  it('is plain JSON with no functions and modest size', () => {
    const s = JSON.stringify(doc);
    expect(s).not.toMatch(/=>|function/);
    expect(JSON.parse(s)).toEqual(doc);
    expect(s.length).toBeLessThan(200000);
    expect(doc.strategy.r.samples).toBeUndefined();
    expect(doc.strategy.p.pnvCfg).toBeUndefined();
  });
  it('timeline: year 0 = 2028/29 age 64 £46,000; the step down lands in year 3 with the SP (part of its first year); the lump sum in 2030/31', () => {
    const t = doc.timeline;
    expect(t[0]).toMatchObject({ y: 0, taxYear: '2028/29', age: 64, gross: 46000, cashYear: true });
    expect(t[2].gross).toBe(46000);
    expect(t[3]).toMatchObject({ taxYear: '2031/32', age: 67, gross: 39000 });
    expect(t[2].sp).toBe(0);
    expect(t[3].sp).toBe(6078);              // 3 October to 5 April: 186 of 366 days of £11,960
    expect(t[4].sp).toBe(11960);
    expect(t[2].lumpIn).toEqual([{ label: 'Inherited pension', amount: 40000, wrapper: 'pension' }]);
    expect(t[2].taxYear).toBe('2030/31');
    expect(t[0].other).toBe(0);              // the DB starts in plan year 1
    expect(t[1].other).toBe(5200);
    expect(t.length).toBe(30);
  });
  it('steps carry their tax year and slope wording', () => {
    expect(doc.steps[0]).toMatchObject({ fromAge: 64, taxYear: '2028/29', amount: 46000, slope: 'level within the step' });
    expect(doc.steps[2]).toMatchObject({ fromAge: 76, taxYear: '2040/41', slope: '−1% a year (real)' });
  });
  it('pots, strategy and assumptions', () => {
    expect(doc.pots).toMatchObject({ sipp: 860000, isa: 25000, gia: 0, isaPolicy: 'minimiseEarlyTax' });
    expect(doc.strategy).toMatchObject({ id: 'gilt-rotation', contract: true });
    expect(doc.targetMix).toEqual([]);
    expect(doc.assumptions).toMatchObject({ firstTaxYear: 2028, bridgeMonths: 19, cashYears: 2, bridgeCash: 20000, spStartDate: '3 October 2031' });
    expect(doc.timing.text).toContain('Plan starts 6 April 2028');
    expect(doc.decisionRun.monthlyAsks[0]).toMatch(/Gilt ladder value/);
  });
  it('a pot strategy carries a target mix and no ladder', () => {
    const s2 = { ...settings, strategyId: 'pots-and-valves', strategyParams: {}, equityGlideEnabled: true };
    const d2 = buildPlanDocument({ settings: s2, p: planFromSettings(s2, createSimulationConfigFromSettings({}, s2), {}), r: null, now: NOW });
    expect(d2.strategy.contract).toBe(false);
    expect(d2.targetMix.length).toBeGreaterThan(3);
    expect(d2.targetMix[0].equity + d2.targetMix[0].bond + d2.targetMix[0].cash).toBeGreaterThanOrEqual(99);
    expect(d2.timeline[0].gross).toBe(46000);
    expect(d2.pots.sipp).toBe(200000 + 560000 + 100000);
  });
  it('a Pots & Valves document is sized from the allocation even when a deselected ladder left a sippTotal behind (6.13.0)', () => {
    const s3 = { ...settings, strategyId: 'pots-and-valves', strategyParams: { sippTotal: 800000, isaTotal: 1, cashYears: 2, bridgeCash: 20000 } };
    const d3 = buildPlanDocument({ settings: s3, p: planFromSettings(s3, createSimulationConfigFromSettings({}, s3), {}), r: null, now: NOW });
    expect(d3.pots.sipp).toBe(200000 + 560000 + 100000);   // not 800,000
    expect(d3.pots.isa).toBe(25000);                         // the ISA balance, not the stray isaTotal
    expect(d3.strategy.params).toEqual({});
    expect(d3.assumptions).toMatchObject({ cashYears: null, bridgeCash: 0 });
    // a ladder strategy still reads its own keys — and only its own
    const s4 = { ...settings, strategyParams: { ...settings.strategyParams, floorToAge: 80 } };
    const d4 = buildPlanDocument({ settings: s4, p, r, now: NOW });
    expect(d4.pots.sipp).toBe(860000);
    expect(d4.strategy.params).toEqual({ sippTotal: 860000, isaTotal: 25000, cashYears: 2, bridgeCash: 20000, rotateCutAge: 80 });
  });
  it('shapeLayersFromSettings mirrors the preview: SP layer from age 67, DB from 65, the lump as an event', () => {
    const L = shapeLayersFromSettings(settings);
    expect(L.sp.fromAge).toBe(67);
    expect(L.other[0]).toMatchObject({ annual: 5200, fromAge: 65, label: 'DB pension' });
    expect(L.events[0]).toMatchObject({ age: 66, amount: 40000, kind: 'in' });
    expect(L.floorVals[0]).toBe(0);
    expect(L.floorVals[1]).toBe(5200);
    expect(L.floorVals[4]).toBeGreaterThan(17000);
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
  const doc = buildPlanDocument({ planName: 'Alex Example', settings, p, r, now: NOW });
  it('September 2026 is a bridge month, step 1, pot compared with the contract path', () => {
    const w = whereAmI(doc, { today: NOW, history: [{ date: '2026-09', taxYear: '26/27', sipp: 3400, other: 0, equity: 0, bond: 640000, cash: 180000 }],
      holdings: { updatedAt: '2026-09-01', lines: [{ wrapper: 'ISA', ticker: 'VWRP', value: 25000 }] } });
    expect(w.bridge).toBe(true);
    expect(w.planYear).toBe(-2);
    expect(w.planStart).toBe('2028/29');
    expect(w.step).toMatchObject({ index: 1, of: 3, amount: 46000 });
    expect(w.step.next).toMatchObject({ fromAge: 67, amount: 39000 });
    expect(w.incomeThisYear.recorded).toBe(1);
    expect(w.incomeThisYear.drawn).toBe(3400);
    expect(w.pot.actual).toBe(845000);   // the pension recorded, with the ISA from what you hold
    expect(w.pot.flat).toBe(true);
  });
  it('April 2031 is plan year 3, age 67, step 2', () => {
    const w = whereAmI(doc, { today: new Date(2031, 3, 10), history: [], potsToday: 700000 });
    expect(w).toMatchObject({ bridge: false, planYear: 3, age: 67, taxYear: '2031/32' });
    expect(w.step).toMatchObject({ index: 2, amount: 39000 });
    expect(w.pot.p50).toBe(845000 - 90000);
  });
  it('pot banding against a real cone', () => {
    const d2 = JSON.parse(JSON.stringify(doc));
    d2.strategy.r.cones.wealth = { p10: [100], p50: [200], p90: [300] };
    // A gilt-rotation band holds the gilts as held to repay, the pot their market value: no verdict (6.20.1) …
    expect(whereAmI(d2, { today: new Date(2028, 5, 1), potsToday: 50 }).pot).toMatchObject({ band: null, verdict: 'gilts-held-to-pay' });
    // … the banding itself, on a market strategy's band
    d2.strategy.id = 'ladder-and-ratchet';
    expect(whereAmI(d2, { today: new Date(2028, 5, 1), potsToday: 50 }).pot.band).toBe('below p10');
    expect(whereAmI(d2, { today: new Date(2028, 5, 1), potsToday: 150 }).pot.band).toBe('p10–p50');
    expect(whereAmI(d2, { today: new Date(2028, 5, 1), potsToday: 250 }).pot.band).toBe('p50–p90');
    expect(whereAmI(d2, { today: new Date(2028, 5, 1), potsToday: 350 }).pot.band).toBe('above p90');
  });
  it('returns null for no document', () => { expect(whereAmI(null, {})).toBeNull(); });
});

describe('planDocumentHtml', () => {
  const doc = buildPlanDocument({ planName: 'Alex <Example>', settings, p, r, now: NOW });
  it('renders every section, escapes, and uses the injected renderers', () => {
    const h = planDocumentHtml(doc, { strategyCard: () => '<div class="card">CARD</div>', staircaseSvg: () => '<svg>STAIRS</svg>', whereAmI: '<div>WHERE</div>' });
    expect(h).toContain('Alex &lt;Example&gt;');
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
    const w = whereAmI(doc, { today: NOW, history: [] , potsToday: 845000 });
    const h = whereAmIHtml(w);
    // 7.3.3: a plan whose year 0 is still ahead (a retired plan stored before 6.51.0 took the next April) says its one thing to
    // do — move the start — and never names months before the plan, nor reads this year against a later year's figures
    expect(h).toContain('Your plan is set to start in 2028/29.');
    expect(h).not.toMatch(/before the plan|set aside|Income step/);
    expect(whereAmIHtml(null)).toBe('');
  });
});

describe('holdingsAtLock — what you HELD, apart from what the strategy was tested on (6.13.0)', () => {
  const holdings = { version: 1, updatedAt: '2026-09-09', source: 'paste', offerDismissed: false, lines: [
    { wrapper: 'SIPP', ticker: 'TR30', name: 'IL Treasury 2030', sedol: 'B4PTCY7', units: 35000, value: 38584, ocf: null, contribution: null, subClass: 'indexLinked', kind: 'gilt', asOf: '2026-09-01' },
    { wrapper: 'isa', ticker: 'vwrp', name: null, sedol: null, units: null, value: 25000, ocf: 0.22, contribution: null, subClass: null, kind: null, asOf: null }
  ] };
  const doc = buildPlanDocument({ planName: 'Alex Example', settings, p, r, holdings, lockedAt: '2026-09-09T10:00:00.000Z', now: NOW });
  it('every strategy carries the snapshot, normalised; the document version moved', () => {
    expect(doc.version).toBeGreaterThanOrEqual(2);   // 2 from 6.13.0 (this snapshot); 3 from 6.22.0 (the ISA choice, the saving path)
    expect(doc.holdingsAtLock.updatedAt).toBe('2026-09-09');
    expect(doc.holdingsAtLock.source).toBe('paste');
    expect(doc.holdingsAtLock.lines.length).toBe(2);
    expect(doc.holdingsAtLock.lines[1]).toMatchObject({ wrapper: 'ISA', ticker: 'VWRP', value: 25000 });
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
    const later = buildPlanDocument({ planName: 'Alex Example', settings, p, r, holdings: { ...holdings, updatedAt: '2026-09-20' }, lockedAt: '2026-09-09T10:00:00.000Z', now: NOW });
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
