/**
 * Fictional plans for the 7.11.1 tests, built in memory from the corpus (never a new fixture file). Not a test file.
 *
 *   alexRaw({ lines, expected })   Alex: the corpus's locked ladder (03), living on it, months recorded. The ladder's first rung
 *                                  pays from 2029/30; the three tax years before it (2026/27, 2027/28, 2028/29) are paid from
 *                                  cash, and 2027/28 needs nothing from the pension because a lump sum the plan counts pays it.
 *                                  In the pension: every rung but two in full (the 2031 and 2041 linkers part bought), three
 *                                  conventional gilts known by their SEDOL and no code, maturing one in each cash year, some
 *                                  company shares and a world share fund, £50 of cash; and one sum of money expected later.
 *                                  Nothing is marked "Keep this".
 *   asMoving(raw, { stop })        a stored plan read as Moving, in place: still saving, work stopping in the month `stop`
 *                                  (inside the move window), no month recorded — the locked document as it was
 *   samRaw({ lines })              Sam: the corpus's ladder locked with its start in 2027/28 (20), Moving: work stops in April
 *                                  2027, so the cash years 2027/28 and 2028/29 are still ahead. In the pension, besides 20's
 *                                  own lines (two linkers outside the plan maturing in those cash years, a third maturing later,
 *                                  a world share fund, cash): a conventional gilt maturing in 2028/29 and one maturing in 2029/30.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { entryOf } from './_plans.js';

export const ALEX_TODAY = '2026-11-15';   // November of 2026/27: five months of the tax year to come
const read = (name) => JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));
export const RAW = read('03-gilt-ladder-locked');
export const L = (o) => ({ wrapper: 'SIPP', ticker: null, name: null, sedol: null, units: null, value: null, ocf: null, contribution: null, subClass: null, kind: null, asOf: '2026-11-01', ...o });
// three conventional gilts from the bundled list, known by SEDOL alone (no code), maturing one in each cash year
export const CONV = [
  L({ name: '4 1/8% Treasury Gilt 2027', sedol: 'BL6C772', units: 30000, value: 29990, kind: 'gilt' }),   // 29 January 2027: 2026/27
  L({ name: '4¼% Treasury Gilt 2027', sedol: 'B16NNR7', units: 32000, value: 31860, kind: 'gilt' }),      // 7 December 2027: 2027/28
  L({ name: '1 5/8% Treasury Gilt 2028', sedol: 'BFX0ZL7', units: 28000, value: 26380, kind: 'gilt' })    // 22 October 2028: 2028/29
];
export const SHARES = L({ ticker: 'EXMPL', name: 'Example Shares plc', units: 400, value: 12000, subClass: 'worldGrowth' });
export const FUND = L({ ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 300, value: 40000, kind: 'fund', subClass: 'worldGrowth' });
export const CASH = L({ ticker: 'XSTR', name: 'Xtrackers II Sterling Overnight Rate', units: 1, value: 50, kind: 'fund', subClass: 'moneyMarket' });
export const EXPECTED = [{ id: 'e1', label: 'Pension elsewhere', amount: 25000, by: '2027-06' }];
export const PART = { TR31: 2000, T41: 500 };   // the two rungs part bought, of 15,500 and 7,800

/** Alex's plan: the corpus ladder with three cash years ahead and the 2027/28 need paid by a lump sum the plan counts. */
export function alexRaw({ lines = null, expected = EXPECTED } = {}) {
  const p = JSON.parse(JSON.stringify(RAW));
  p.id = 'AlexLiving01';
  p.planDetails = { ...p.planDetails, name: 'Alex plan' };
  const doc = p.planDocument, plan = doc.strategy.r.plan;
  plan.orders = plan.orders.filter((o) => o.tidm !== 'T27');
  plan.cashYears = [{ Y: 2026, age: 65, gross: 34000, need: 34000, cost: 34000 }, { Y: 2027, age: 66, gross: 34000, need: 0, cost: 0 }, { Y: 2028, age: 67, gross: 34000, need: 33000, cost: 33700 }];
  plan.years = plan.years.map((y) => (y.Y === 2027 ? { ...y, need: 0, cost: 0, from: 'cash' } : y.Y === 2028 ? { Y: 2028, age: 67, gross: 34000, need: 33000, cost: 33700, from: 'cash' } : y));
  doc.timeline = doc.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, lump: 34000, lumpIn: [{ label: 'Lump sum', amount: 40000, wrapper: 'cash' }] } : r.taxYear === '2028/29' ? { ...r, cashYear: true, source: 'cash', contract: 33000 } : r));
  const rungs = plan.orders.map((o) => L({ ticker: o.tidm, name: o.name, sedol: o.sedol, units: PART[o.tidm] || o.nominal, value: Math.round((PART[o.tidm] || o.nominal) * o.cleanPrice * o.indexRatio / 100), kind: 'gilt' }));
  p.holdings = { version: 1, updatedAt: '2026-11-01', source: 'typed', offerDismissed: false, lines: lines || [...rungs, ...CONV, SHARES, FUND, CASH], ...(expected && expected.length ? { expected } : {}) };
  return p;
}
export const alex = (o, today = ALEX_TODAY) => entryOf(alexRaw(o), today).plan;

/** A stored plan read as Moving (see the header): in place, and returned. */
export function asMoving(raw, { stop = '2027-04' } = {}) {
  const s = raw.stressTool.settings;
  s.retired = false; s.retireAge = 66; s.stoppedWork = stop;
  delete s.firstTaxYear;
  raw.decisionTool.history = [];
  return raw;
}

/** Sam's plan (see the header). */
export const SAM_CONV = [
  L({ name: '1 5/8% Treasury Gilt 2028', sedol: 'BFX0ZL7', units: 20000, value: 18800, kind: 'gilt' }),   // 22 October 2028: 2028/29, a cash year
  L({ name: '4 3/8% Treasury Gilt 2030', units: 10000, value: 10050, kind: 'gilt' })                       // 7 March 2030: 2029/30, a rung's year
];
export function samRaw({ lines = null } = {}) {
  const p = asMoving(read('20-locked-start-after-stop'));
  p.id = 'SamMoving01';
  p.planDetails = { ...p.planDetails, name: 'Sam plan' };
  delete p.household;
  p.holdings = { ...p.holdings, lines: lines || [...p.holdings.lines, ...SAM_CONV] };
  return p;
}
