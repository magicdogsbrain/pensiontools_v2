/**
 * "Where you are" compares like with like (6.20.1; research/v7/answer-D.md §2.1).
 *
 * The strip used to set the PENSION pot alone (the latest Decision record's equity + bond + cash) against the plan's
 * band, which counts more than the pension: Pots & Valves and Buckets count SIPP + ISA (held or not) + taxable
 * account (stressTest.js pnvRun: potByYear + isaByYear); the bought strategies count the growth part + the unpaid
 * rungs bought from SIPP + ISA, the ISA only when it is not held aside (availablePot). So someone with an ISA was told
 * in bold "below the plan's 1-in-10 bad line" when they were not. Like with like now means:
 *  - the same accounts (a needed figure that is missing → nothing compared, and the strip says what to add);
 *  - the same pounds: every band is in prices at the start of the plan, a pot in the pounds of its month — the pot is
 *    turned into the plan's prices with the CPI entered in the Decision tool, else the plan's 4% assumption;
 *  - the same point in the plan: the band is read at the pot's month, the spread opening with the square root of time;
 *  - the same measure: a band that holds gilts at what they cost (Full ladder, Ladder + rotation) is not set against
 *    a record of their market value — no verdict there.
 * The plan document itself is never changed.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { whereAmI, bandMeasure, bandAt, pricesSinceStart } from '../src/services/PlanDocument.js';
import { whereAmIHtml } from '../src/ui/components/PlanDocumentView.js';

const at = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0, 0);   // local noon, month 1-based
const deepFreeze = (o) => { if (o && typeof o === 'object') { Object.freeze(o); Object.values(o).forEach(deepFreeze); } return o; };
const series = (n, f) => Array.from({ length: n }, (_, y) => f(y));
/** A pot in plan-start prices → the pounds of a month `years` (whole or part) into the plan, at the plan's own 4%. */
const inf = (v, years) => Math.round(v * 1.04 ** years);
const strip = (w) => whereAmIHtml(w).replace(/<(?!\/?strong)[^>]+>/g, '');

/** A made-up locked plan document: only the fields the strip reads. Plan year 0 = 2026/27, age 60, 10 years. */
function makeDoc({ id = 'pots-and-valves', isa = 100000, gia = 0, isaPolicy = 'minimiseEarlyTax', cones, firstTaxYear = 2026, mode = 'retired', bridgeCash = 0, bridgeMonths = 0, diversifierStart = 0, timeline = null, contract = false } = {}) {
  return {
    version: 2, lockedAt: '2026-04-01T10:00:00.000Z', createdAt: '2026-04-01T10:00:00.000Z',
    timing: { firstTaxYear, shapeAgeNow: 60, mode, bridgeMonths },
    steps: [{ fromAge: 60, amount: 40000, taxYear: firstTaxYear + '/' + String(firstTaxYear + 1).slice(2) }],
    timeline: timeline || series(10, (y) => ({ y, gross: 40000, sp: 0, other: 0, lumpIn: [] })),
    pots: { sipp: 600000, isa, gia, isaPolicy, allocation: { equityMin: 360000, bondMin: 180000, cashTarget: 60000, diversifierStart } },
    strategy: { id, contract, r: { cones: { wealth: cones } } },
    assumptions: { duration: 10, firstTaxYear, bridgeCash, cpiDecision: 0.04 },
    holdingsAtLock: { updatedAt: '2026-03-20', source: 'typed', lines: [] }
  };
}
// A Pots & Valves band, all pots, in plan-start prices: 700,000 at the start, the 1-in-10 bad line 15,000 a year under the median.
const pvCones = { p10: series(11, (y) => 700000 - 25000 * y), p50: series(11, (y) => 700000 - 10000 * y), p90: series(11, (y) => 700000 + 5000 * y) };
const record = (date, equity, bond, cash, extra = {}) => ({ date, taxYear: '28/29', equity, bond, cash, sipp: 3000, other: 0, state: 0, ...extra });
const holdingsWith = (lines, updatedAt = '2028-04-02') => ({ version: 1, updatedAt, source: 'typed', offerDismissed: false, lines });
const isaLine = (value) => ({ wrapper: 'ISA', ticker: 'VWRP', name: 'FTSE All-World', value });

describe('what the band counts (bandMeasure)', () => {
  it('Pots & Valves and Buckets: SIPP + ISA (held or not) + taxable account', () => {
    expect(bandMeasure(makeDoc({ isa: 100000 }))).toMatchObject({ isa: true, gia: false, isaLeftOut: false });
    expect(bandMeasure(makeDoc({ isa: 100000, isaPolicy: 'hold' }))).toMatchObject({ isa: true, isaLeftOut: false });
    expect(bandMeasure(makeDoc({ id: 'buckets-in-order', isa: 100000, gia: 40000 }))).toMatchObject({ isa: true, gia: true });
  });
  it('a bought strategy leaves a held ISA out (it never buys rungs with it)', () => {
    expect(bandMeasure(makeDoc({ id: 'ladder-and-ratchet', isa: 100000 }))).toMatchObject({ isa: true, isaLeftOut: false });
    expect(bandMeasure(makeDoc({ id: 'gilt-rotation', contract: true, isa: 60000, isaPolicy: 'hold' }))).toMatchObject({ isa: false, isaLeftOut: true });
  });
  it('a plan priced with no ISA does not count one; a lump sum that has arrived does', () => {
    expect(bandMeasure(makeDoc({ isa: 0 }))).toMatchObject({ isa: false, gia: false, isaLeftOut: false });
    const tl = series(10, (y) => ({ y, gross: 40000, sp: 0, other: 0, lumpIn: y === 2 ? [{ label: 'Inheritance', amount: 50000, wrapper: 'cash' }] : [] }));
    const d = makeDoc({ isa: 0, timeline: tl });
    expect(bandMeasure(d, { planYear: 1 })).toMatchObject({ isa: false, gia: false });
    expect(bandMeasure(d, { planYear: 2 })).toMatchObject({ isa: true, gia: true });   // £20,000 to the ISA, the rest taxable
  });
});

describe('the pot is made of the same accounts as the band', () => {
  const today = at(2028, 4, 20);   // plan year 2, its first month: the band is read at its start; prices up 4% a year twice
  it('ISA plan: pension alone is below the 1-in-10 line, pension + ISA is above it — the strip must not say "below"', () => {
    const doc = deepFreeze(makeDoc({ isa: 100000, cones: pvCones }));
    const w = whereAmI(doc, { today, history: [record('2028-04', inf(400000, 2), inf(150000, 2), inf(50000, 2))], holdings: holdingsWith([isaLine(inf(120000, 2))]) });
    // band at year 2: 1-in-10 650,000 · median 680,000 · 1-in-10 good 710,000 (plan-start prices)
    expect(w.pot.p10).toBe(650000);
    expect(w.pot.real).toBe(720000);                        // 600,000 pension + 120,000 ISA, in plan-start prices
    expect(w.pot.actual).toBe(inf(600000, 2) + inf(120000, 2));
    expect(w.pot.band).toBe('above p90');
    expect(w.pot.parts.map((x) => x.key)).toEqual(['pension', 'isa']);
    const h = strip(w);
    expect(h).not.toContain('below the plan');
    expect(h).toContain('ISA ' + '£' + inf(120000, 2).toLocaleString('en-GB'));
    expect(h).toContain('£720,000 in prices at the start of the plan');
    // and the pension alone, against the all-pots band, would have read "below"
    expect(600000).toBeLessThan(w.pot.p10);
  });
  it('mirror: pension + ISA genuinely under the 1-in-10 line still says so', () => {
    const doc = makeDoc({ isa: 100000, cones: pvCones });
    const w = whereAmI(doc, { today, history: [record('2028-04', inf(380000, 2), inf(150000, 2), inf(50000, 2))], holdings: holdingsWith([isaLine(inf(60000, 2))]) });
    expect(w.pot.real).toBe(640000);
    expect(w.pot.band).toBe('below p10');
    expect(whereAmIHtml(w)).toContain('<strong>below the plan\'s 1-in-10 bad line</strong>');
  });
  it('mirror: a bought plan with its ISA held aside leaves the ISA out of both sides — and says so', () => {
    const doc = makeDoc({ id: 'ladder-and-ratchet', isa: 100000, isaPolicy: 'hold', cones: pvCones });
    const w = whereAmI(doc, { today, history: [record('2028-04', inf(400000, 2), inf(180000, 2), inf(30000, 2))], holdings: holdingsWith([isaLine(120000)]) });
    expect(w.pot.real).toBe(610000);                        // the ISA is not added: the band never counted it
    expect(w.pot.band).toBe('below p10');
    const h = whereAmIHtml(w);
    expect(h).toContain('below the plan\'s 1-in-10 bad line');
    expect(h).toMatch(/ISA is held aside/);
  });
  it('no ISA figure on record: nothing is compared, and the strip says what to add', () => {
    const doc = makeDoc({ isa: 100000, cones: pvCones });
    for (const holdings of [null, holdingsWith([{ wrapper: 'SIPP', ticker: 'VWRP', value: 600000 }])]) {
      const w = whereAmI(doc, { today, history: [record('2028-04', 400000, 150000, 50000)], holdings });
      expect(w.pot.actual).toBeNull();
      expect(w.pot.band).toBeNull();
      expect(w.pot.missing).toEqual(['isa']);
      expect(w.pot.pension).toBe(600000);
      const h = whereAmIHtml(w);
      expect(h).toContain('Add your ISA under What you hold');
      expect(h).not.toMatch(/below the plan|1-in-10/);
    }
  });
  it('a plan with no ISA compares the pension — an ISA it was not priced on is not added', () => {
    const doc = makeDoc({ isa: 0, cones: pvCones });
    const w = whereAmI(doc, { today, history: [record('2028-04', inf(400000, 2), inf(220000, 2), inf(50000, 2))] });
    expect(w.pot.real).toBe(670000);
    expect(w.pot.band).toBe('p10–p50');
    expect(whereAmIHtml(w)).not.toContain('Add your ISA');
    const w2 = whereAmI(doc, { today, history: [record('2028-04', inf(400000, 2), inf(220000, 2), inf(50000, 2))], holdings: holdingsWith([isaLine(90000)]) });
    expect(w2.pot.real).toBe(670000);
  });
  it('the taxable account: from the month\'s record when it carries one, else What you hold, else asked for', () => {
    const doc = makeDoc({ isa: 0, gia: 40000, cones: pvCones });
    const w = whereAmI(doc, { today, history: [record('2028-04', 400000, 220000, 20000, { gia: 35000 })] });
    expect(w.pot.actual).toBe(675000);
    expect(w.pot.parts.find((x) => x.key === 'gia')).toMatchObject({ value: 35000, source: 'record' });
    const w2 = whereAmI(doc, { today, history: [record('2028-04', 400000, 220000, 20000)] });
    expect(w2.pot.missing).toEqual(['gia']);
    expect(whereAmIHtml(w2)).toContain('Add your taxable account (GIA) under What you hold');
    const w3 = whereAmI(doc, { today, history: [record('2028-04', 400000, 220000, 20000)], holdings: holdingsWith([{ wrapper: 'GIA', ticker: 'VWRP', value: 30000 }]) });
    expect(w3.pot.actual).toBe(670000);
    // drawn to nothing as planned: the last record that carried it says £0 after the draw
    const w4 = whereAmI(doc, { today, history: [record('2028-03', 400000, 220000, 23000, { gia: 2000, giaBalanceAfter: 0 }), record('2028-04', 400000, 220000, 20000)] });
    expect(w4.pot.missing).toEqual([]);
    expect(w4.pot.actual).toBe(640000);
  });
});

describe('the same pounds: the pot is turned into the plan\'s prices before it is compared', () => {
  it('a pot exactly on the median in plan-start prices, after three years of 4% a year, reads on the median — not "above the 1-in-10 good line"', () => {
    const doc = deepFreeze(makeDoc({ isa: 0, cones: pvCones }));
    expect(inf(670000, 3)).toBe(753659);
    const w = whereAmI(doc, { today: at(2029, 4, 20), history: [record('2029-04', 500000, 200000, 53659, { taxYear: '29/30' })] });
    expect(w.pot.actual).toBe(753659);
    expect(w.pot.real).toBe(670000);
    expect(w.pot.p50).toBe(670000);
    expect(w.pot.band).toBe('p50–p90');                    // on the median, inside the band
    const h = strip(w);
    expect(h).not.toContain('above the plan');
    expect(h).toContain('Pot £753,659 (recorded April 2029), which is £670,000 in prices at the start of the plan, the prices its figures are in (prices up 12.5% since: 4% a year assumed)');
  });
  it('uses the CPI entered for each tax year in the Decision tool, 4% where none was entered — the Decision tool\'s own chain', () => {
    const doc = makeDoc({ isa: 0, cones: pvCones });
    const history = [record('2029-04', 500000, 200000, 40000, { taxYear: '29/30' })];   // 740,000 as recorded
    const entered = { '26/27': { cpi: 0.03 }, '27/28': { cpi: 0.02 }, '28/29': { cpi: 0.05 } };
    const w = whereAmI(doc, { today: at(2029, 4, 20), history, taxYears: entered });
    expect(w.pot.real).toBe(Math.round(740000 / (1.03 * 1.02 * 1.05)));   // 670,818: on the median line or above
    expect(w.pot.band).toBe('p50–p90');
    expect(strip(w)).toContain('the CPI entered in the Decision tool');
    const w2 = whereAmI(doc, { today: at(2029, 4, 20), history });              // none entered: 4% a year → 657,857
    expect(w2.pot.real).toBe(Math.round(740000 / 1.04 ** 3));
    expect(w2.pot.band).toBe('p10–p50');
    const w3 = whereAmI(doc, { today: at(2029, 4, 20), history, taxYears: { '27/28': { cpi: 0.02 } } });
    expect(w3.pot.real).toBe(Math.round(740000 / (1.04 * 1.02 * 1.04)));
    expect(strip(w3)).toContain('the CPI entered in the Decision tool, 4% a year where none was entered');
  });
  it('within a year the year\'s CPI counts for the months gone; the run-up and April of year 0 are at the starting prices', () => {
    const doc = makeDoc({ isa: 0, cones: pvCones });
    expect(pricesSinceStart(doc, '2029-01').factor).toBeCloseTo(1.04 ** 2.75, 12);
    expect(pricesSinceStart(doc, '2026-04').factor).toBe(1);
    expect(pricesSinceStart(doc, '2026-02').factor).toBe(1);
    expect(pricesSinceStart(doc, '2026-10', { '26/27': { cpi: 0.06 } }).factor).toBeCloseTo(1.06 ** 0.5, 12);
    const w = whereAmI(doc, { today: at(2026, 4, 20), history: [record('2026-04', 400000, 200000, 100000, { taxYear: '26/27' })] });
    expect(w.pot.real).toBe(w.pot.actual);
    expect(strip(w)).not.toContain('in prices at the start');
  });
  it('a pot from What you hold (no monthly record) is turned into the plan\'s prices too', () => {
    const doc = makeDoc({ isa: 0, cones: pvCones });
    const w = whereAmI(doc, { today: at(2028, 4, 20), holdings: holdingsWith([{ wrapper: 'SIPP', ticker: 'VWRP', value: inf(670000, 2) }]) });
    expect(w.pot.source).toBe('holdings');
    expect(w.pot.real).toBe(670000);
  });
});

describe('the band in the first months of a plan opens with the square root of time', () => {
  // Fixture 04's real cone (Buckets): one figure at year 0, the full spread at year 1.
  const cones = { p10: [615000, 529837, 486507], p50: [615000, 613905, 613316], p90: [615000, 703464, 748690] };
  const doc = makeDoc({ id: 'buckets-in-order', isa: 25000, cones });
  it('June of year 0, a 4% dip: inside the band — not "below the 1-in-10 bad line"', () => {
    const w = whereAmI(doc, { today: at(2026, 6, 20), history: [record('2026-06', 365360, 150000, 50000, { taxYear: '26/27' })], holdings: holdingsWith([isaLine(25040)], '2026-06-01') });
    expect(w.pot.actual).toBe(590400);
    const p50 = 615000 + (2 / 12) * (613905 - 615000);
    expect(w.pot.p10).toBe(Math.round(p50 + Math.sqrt(2 / 12) * (529837 - 613905)));   // about 580,500 (a straight line: 600,806)
    expect(w.pot.band).toBe('p10–p50');
    expect(strip(w)).not.toContain('below the plan');
  });
  it('a real fall early in year 0 still reads below', () => {
    const w = whereAmI(doc, { today: at(2026, 6, 20), history: [record('2026-06', 330000, 150000, 50000, { taxYear: '26/27' })], holdings: holdingsWith([isaLine(25000)], '2026-06-01') });
    expect(w.pot.band).toBe('below p10');
  });
  it('bandAt: the year\'s own figures at its start; the median on a straight line; the spread on a square-root scale between years', () => {
    expect(bandAt(cones, 1, 0)).toEqual({ p10: 529837, p50: 613905, p90: 703464 });
    const b = bandAt(cones, 1, 0.5);
    expect(b.p50).toBeCloseTo(613905 + 0.5 * (613316 - 613905), 6);
    const s = (Math.sqrt(1.5) - 1) / (Math.sqrt(2) - 1);
    expect(b.p10).toBeCloseTo(b.p50 + (529837 - 613905) + s * ((486507 - 613316) - (529837 - 613905)), 6);
    expect(bandAt(cones, 9, 0.5)).toEqual({ p10: 486507, p50: 613316, p90: 748690 });   // past the end: the last year
  });
});

describe('gilts valued at what they cost: no verdict against their market value', () => {
  // A Ladder + rotation band like the owner's: the 1-in-10 bad line IS the median while most futures never rotate.
  const rot = { p10: [1019460, 971497, 923611, 873025, 819491], p50: [1019460, 971497, 923611, 876647, 829763], p90: [1019460, 971497, 937865, 905479, 893232] };
  const owner = (extra = {}) => deepFreeze(makeDoc({ id: 'gilt-rotation', contract: true, isa: 80000, isaPolicy: 'hold', firstTaxYear: 2027, bridgeCash: 30000, bridgeMonths: 7, cones: rot,
    timeline: series(10, (y) => ({ y, gross: 52000, sp: 0, other: 0, lumpIn: [] })), ...extra }));
  it('a £1 dip in the gilts\' market price is not "below the plan\'s 1-in-10 bad line"', () => {
    const doc = owner();
    const before = JSON.stringify(doc);
    // May 2028 (plan year 1, one month in): the band reads 967,506 on the 1-in-10 bad line AND the median; the pot is £1
    // under it in plan-start prices — the gilts' market price dipped a little, every rung still pays
    const real = 971497 + (923611 - 971497) / 12 - 1;
    const nominal = Math.round(real * 1.04 ** (13 / 12));
    const w = whereAmI(doc, { today: at(2028, 5, 20), history: [record('2028-05', 0, nominal - 20000, 20000)] });
    expect(w.pot.p10).toBe(w.pot.p50);
    expect(w.pot.real).toBe(Math.round(real));
    expect(w.pot.verdict).toBe('gilts-at-cost');
    expect(w.pot.band).toBeNull();
    const h = strip(w);
    expect(h).not.toMatch(/below the plan|1-in-10/);
    expect(h).toContain('the plan expects by then');
    expect(h).toContain('The plan counts its gilts at what they cost and your figure is at today\'s market prices');
    expect(JSON.stringify(doc)).toBe(before);
  });
  it('the owner\'s shape — locked, ISA held aside, in the run-up: the run-up cash on both sides, and still no verdict', () => {
    const doc = owner();
    const w = whereAmI(doc, { today: at(2026, 10, 2), history: [record('2026-09', 0, 870000, 180000, { sipp: 4333, taxYear: '26/27' })], holdings: holdingsWith([isaLine(81000)], '2026-09-01') });
    expect(w.bridge).toBe(true);
    expect(w.pot.actual).toBe(1050000);                    // gilts + cash; the held ISA is not added
    expect(w.pot.real).toBe(1050000);                      // the run-up is at the starting prices
    expect(w.pot.runUp).toMatchObject({ months: 7, of: 7, value: 30000 });
    expect(w.pot.p50).toBe(1019460 + 30000);
    expect(w.pot.verdict).toBe('gilts-at-cost');
    const h = strip(w);
    expect(h).toContain('against £1,049,460 the plan expects by then (£1,019,460 at the start of the plan + £30,000 of run-up cash for the 7 months still to pay)');
    expect(h).toMatch(/ISA is held aside/);
    expect(h).not.toMatch(/below the plan|the band opens|cone opens/);
    // January: three months (January to March) still to pay — 3/7 of the cash; by April none, the band is year 0's own
    const w2 = whereAmI(doc, { today: at(2027, 1, 20), history: [record('2027-01', 0, 870000, 150000, { sipp: 4333, taxYear: '26/27' })] });
    expect(w2.pot.runUp).toMatchObject({ months: 3, value: Math.round(30000 * 3 / 7) });
    const w3 = whereAmI(doc, { today: at(2027, 4, 20), history: [record('2027-04', 0, 870000, 150000, { sipp: 4333, taxYear: '27/28' })] });
    expect(w3.pot.runUp).toBeNull();
    expect(w3.pot.p50).toBe(1019460);
    // a document without its run-up length: the draw the record shows, else the plan's year-0 draw, capped at the cash
    const old = makeDoc({ id: 'gilt-rotation', contract: true, isa: 60000, isaPolicy: 'hold', firstTaxYear: 2027, bridgeCash: 50000, cones: rot, timeline: series(10, (y) => ({ y, gross: 83650, sp: 0, other: 3650, lumpIn: [] })) });
    expect(whereAmI(old, { today: at(2026, 10, 2), history: [record('2026-09', 0, 952960, 116000, { sipp: 7000 })] }).pot.runUp).toMatchObject({ months: 7, value: 49000 });
    expect(whereAmI(old, { today: at(2026, 10, 2), holdings: holdingsWith([{ wrapper: 'SIPP', ticker: 'T30', value: 1060000 }], '2026-10-01') }).pot.runUp).toMatchObject({ months: 6, value: 40000 });
  });
  it('later in the plan the band is read at the record\'s month and the pot in plan-start prices — still numbers only', () => {
    const doc = owner();
    const w = whereAmI(doc, { today: at(2031, 1, 20), history: [record('2031-01', 0, 760000, 20000, { taxYear: '30/31' })] });
    expect(w.planYear).toBe(3);
    expect(w.pot.p50).toBe(Math.round(876647 + 0.75 * (829763 - 876647)));
    expect(w.pot.real).toBe(Math.round(780000 / 1.04 ** 3.75));
    expect(w.pot.band).toBeNull();
    expect(strip(w)).not.toMatch(/1-in-10|cone opens|at the start of the plan, priced/);
  });
  it('the full ladder (flat band): bought by contract, no verdict, the same cost-and-market note', () => {
    const flat = series(11, (y) => 1019980 - 80000 * y);
    const doc = makeDoc({ id: 'full-il-gilt', contract: true, isa: 0, firstTaxYear: 2027, cones: { p10: flat, p50: flat, p90: flat } });
    const w = whereAmI(doc, { today: at(2029, 6, 20), history: [record('2029-06', 0, 850000, 10000, { taxYear: '29/30' })] });
    expect(w.pot.flat).toBe(true);
    expect(w.pot.band).toBeNull();
    const h = strip(w);
    expect(h).toContain('the plan\'s path is bought by contract');
    expect(h).toContain('at what they cost');
  });
  it('a band whose 1-in-10 bad line is still its median gives no verdict on any strategy', () => {
    const cones = { p10: [700000, 690000, 680000], p50: [700000, 690000, 680000], p90: [700000, 700000, 700000] };
    const w = whereAmI(makeDoc({ isa: 0, cones }), { today: at(2027, 4, 20), history: [record('2027-04', 300000, 300000, inf(50000, 1))] });
    expect(w.pot.verdict).toBe('not-open');
    expect(w.pot.band).toBeNull();
    const h = strip(w);
    expect(h).toContain('against £690,000 the plan expects by then; the plan\'s band has not opened yet');
    expect(h).not.toMatch(/below the plan|at the start of the plan, priced|cone opens/);
  });
});

describe('the pension figure: the newer of the monthly record and What you hold, and its age', () => {
  const doc = makeDoc({ isa: 0, diversifierStart: 30000, cones: pvCones });
  const febToApr = ['2028-02', '2028-03', '2028-04'].map((d, i) => record(d, inf(400000, 2) - 3000 * i, inf(220000, 2), inf(20000, 2)));
  const sippLines = [{ wrapper: 'SIPP', ticker: 'VWRP', value: 640000 }, { wrapper: 'SIPP', ticker: 'SGLN', value: 30000 }];
  it('records newer than What you hold: the record\'s pots, plus the diversifiers from What you hold with their own date', () => {
    const w = whereAmI(doc, { today: at(2028, 4, 20), history: febToApr, holdings: holdingsWith(sippLines, '2026-03-20') });
    expect(w.pot.source).toBe('record');
    expect(w.pot.asOf).toBe('2028-04');
    expect(w.pot.parts.find((x) => x.key === 'diversifiers')).toMatchObject({ value: 30000, source: 'holdings', asOf: '2026-03-20' });
    expect(w.pot.actual).toBe(inf(400000, 2) - 6000 + inf(220000, 2) + inf(20000, 2) + 30000);
    expect(w.pot.stale.map((x) => x.key)).toEqual(['diversifiers']);
    const h = strip(w);
    expect(h).toContain('diversifiers £30,000 from What you hold as of 20 March 2026');
    expect(h).toContain('Your diversifiers figure is from 20 March 2026');
    expect(h).not.toMatch(/at the start of the plan, priced|cone opens/);
  });
  it('What you hold as new as the record: its SIPP total, diversifiers included', () => {
    const w = whereAmI(doc, { today: at(2028, 4, 20), history: febToApr, holdings: holdingsWith(sippLines, '2028-04-05') });
    expect(w.pot.source).toBe('holdings');
    expect(w.pot.actual).toBe(670000);
  });
  it('no SIPP lines under What you hold: the diversifiers are asked for', () => {
    const w = whereAmI(doc, { today: at(2028, 4, 20), history: febToApr });
    expect(w.pot.missing).toEqual(['diversifiers']);
    expect(whereAmIHtml(w)).toMatch(/diversifiers/);
  });
  it('a pension figure more than three months old is named, with what to do', () => {
    const w = whereAmI(makeDoc({ isa: 0, cones: pvCones }), { today: at(2028, 9, 20), history: [record('2028-04', inf(400000, 2), inf(220000, 2), inf(50000, 2))] });
    expect(w.pot.stale.map((x) => x.key)).toEqual(['pension']);
    expect(strip(w)).toContain('Your pension figure is from April 2028: enter this month\'s values in the Decision tool for a closer reading.');
    const fresh = whereAmI(makeDoc({ isa: 0, cones: pvCones }), { today: at(2028, 7, 20), history: [record('2028-04', 1, 1, 1)] });
    expect(fresh.pot.stale).toEqual([]);
  });
});

describe('the sentence when the band has not opened', () => {
  it('April of year 0: at the start of the plan, priced on the starting figure', () => {
    const w = whereAmI(makeDoc({ isa: 0, cones: pvCones }), { today: at(2026, 4, 20), history: [record('2026-04', 400000, 200000, 95000, { taxYear: '26/27' })] });
    expect(w.pot.verdict).toBe('start');
    expect(strip(w)).toContain('Pot £695,000 (recorded April 2026) at the start of the plan, priced on £700,000; the band opens as the year goes on.');
  });
  it('the run-up of a plan that starts next April: against the figure it starts from', () => {
    const w = whereAmI(makeDoc({ isa: 0, cones: pvCones, firstTaxYear: 2027 }), { today: at(2026, 10, 20), history: [record('2026-10', 400000, 200000, 95000, { taxYear: '26/27' })] });
    expect(w.pot.verdict).toBe('start');
    expect(strip(w)).toContain('Pot £695,000 (recorded October 2026) against £700,000 the plan starts from; the band opens once the plan has started.');
  });
});

describe('missing records and other shapes', () => {
  it('no record, no holdings, no pot passed in: nothing compared, and the strip says what to record', () => {
    const w = whereAmI(makeDoc({ cones: pvCones }), { today: at(2028, 4, 20) });
    expect(w.pot).toMatchObject({ actual: null, band: null, missing: ['pension'] });
    expect(whereAmIHtml(w)).toMatch(/No pension pot on record yet/);
    expect(whereAmIHtml(w)).not.toMatch(/1-in-10/);
  });
  it('no band in the document: no pot line at all', () => {
    const d = makeDoc({ cones: pvCones }); delete d.strategy.r;
    expect(whereAmI(d, { today: at(2028, 4, 20), history: [record('2028-04', 1, 1, 1)] }).pot).toBeNull();
  });
  it('a batch of months saved at once (same values) is read at the month it was entered, not its last month', () => {
    const doc = makeDoc({ isa: 0, cones: pvCones });
    const hist = ['2028-04', '2028-05', '2028-06'].map((d) => record(d, 400000, 220000, 50000));
    const w = whereAmI(doc, { today: at(2028, 5, 10), history: hist });
    expect(w.pot.asOf).toBe('2028-04');
    expect(w.pot.p50).toBe(680000);
  });
  it('a saver before the plan starts: the band begins at retirement, so today\'s pot is not set against it', () => {
    const doc = makeDoc({ cones: pvCones, firstTaxYear: 2037, mode: 'future' });
    expect(whereAmI(doc, { today: at(2028, 4, 20), history: [record('2028-04', 400000, 150000, 50000)], holdings: holdingsWith([isaLine(120000)]) }).pot).toBeNull();
  });
  it('a pot passed in is taken as already counting what the band counts, in today\'s pounds', () => {
    const w = whereAmI(makeDoc({ isa: 100000, cones: pvCones }), { today: at(2028, 4, 20), potsToday: inf(660000, 2) });
    expect(w.pot).toMatchObject({ real: 660000, missing: [], source: 'today', band: 'p10–p50' });
  });
  it('an old document without pots or a strategy id still reads (no ISA asked for; 4% assumed)', () => {
    const d = { timing: { firstTaxYear: 2026, shapeAgeNow: 60, mode: 'retired' }, steps: [{ fromAge: 60, amount: 40000 }], timeline: [{ y: 0 }, { y: 1 }, { y: 2 }], strategy: { r: { cones: { wealth: { p10: [100, 90, 80], p50: [100, 100, 100], p90: [100, 110, 120] } } } } };
    const w = whereAmI(d, { today: at(2028, 4, 20), history: [record('2028-04', 50, 30, 10)] });
    expect(w.pot).toMatchObject({ actual: 90, real: Math.round(90 / 1.04 ** 2), missing: [], band: 'p10–p50' });
  });
});
