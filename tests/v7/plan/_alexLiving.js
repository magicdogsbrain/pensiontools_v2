/**
 * Fictional plans for the 7.12.0 "Your plan's mix" tests (living on a locked ladder), built in memory from _alex.js's alexRaw —
 * never a new fixture file. Not a test file. Today is 16 November 2026: five months of 2026/27 to come.
 *
 *   alexLivingRaw()   Alex: every one of the plan's 14 gilts at the plan's units, except the 2031 linker (TR31) held 700 units
 *                     above and the 2041 linker (T41) 300 above; three ordinary gilts (2027, 2028, 2029); a 2026 gilt that is not
 *                     on the bundled list; four company shares and a world fund; £12 of cash; and £60,000 expected by July 2027.
 *   joLivingRaw()     Jo: the same plan; every gilt at the plan's units but two part bought (_alex.js PART), £5,000 cash, nothing else.
 *   samExactRaw()     Sam: the same plan; every gilt at the plan's units, £70,000 cash, nothing else.
 *   living(raw)       the stored plan brought up to date on TODAY, as the plan source hands it in.
 */
import { entryOf } from './_plans.js';
import { RAW, L, PART, alexRaw } from './_alex.js';

export const TODAY = '2026-11-16';
/** The plan's orders as Alex's plan has them (the 2027 linker taken out: 2028/29 is a cash year). */
export const ORDERS = RAW.planDocument.strategy.r.plan.orders.filter((o) => o.tidm !== 'T27');
export const OVER = { TR31: 700, T41: 300 };

/** One line for a plan gilt at `units`, valued at the order's price. */
export const rungLine = (o, units) => L({ ticker: o.tidm, name: o.name, sedol: o.sedol, units, value: Math.round(units * o.cleanPrice * o.indexRatio / 100), kind: 'gilt' });
export const cashLine = (value) => L({ ticker: 'XSTR', name: 'Xtrackers II Sterling Overnight Rate', units: 1, value, kind: 'fund', subClass: 'moneyMarket' });

export const OTHER_GILTS = [
  L({ ticker: 'TS27', name: '3¾% Treasury Gilt 2027', units: 34000, value: 33930, kind: 'gilt' }),    // 7 March 2027
  L({ ticker: 'TN28', name: '0 1/8% Treasury Gilt 2028', units: 36000, value: 34000, kind: 'gilt' }),  // 31 January 2028
  L({ ticker: 'TG29', name: '0½% Treasury Gilt 2029', units: 37000, value: 34000, kind: 'gilt' })      // 31 January 2029
];
export const NOT_LISTED = L({ ticker: 'TN26', name: '0 1/8% Treasury Gilt 2026', units: 2000, value: 2000, kind: 'gilt' });
export const SHARES = [
  L({ ticker: 'ULVR', name: 'Unilever', units: 90, value: 4000, subClass: 'worldGrowth' }),
  L({ ticker: 'AZN', name: 'AstraZeneca', units: 50, value: 6000, subClass: 'worldGrowth' }),
  L({ ticker: 'LGEN', name: 'Legal & General', units: 1400, value: 3300, subClass: 'worldGrowth' }),
  L({ ticker: 'NG.', name: 'National Grid', units: 400, value: 4000 }),
  L({ ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 50, value: 6000, kind: 'fund', subClass: 'worldGrowth' })
];
export const EXPECTED = [{ id: 'e1', label: 'Old workplace pension', amount: 60000, by: '2027-07' }];

export const alexLines = () => [...ORDERS.map((o) => rungLine(o, o.nominal + (OVER[o.tidm] || 0))), ...OTHER_GILTS, NOT_LISTED, ...SHARES, cashLine(12)];
export const alexLivingRaw = ({ lines = alexLines(), expected = EXPECTED } = {}) => {
  const p = alexRaw({ lines, expected });
  if (!expected || !expected.length) delete p.holdings.expected;
  return p;
};
export const joLivingRaw = () => alexLivingRaw({ lines: [...ORDERS.map((o) => rungLine(o, PART[o.tidm] || o.nominal)), cashLine(5000)], expected: [] });
export const samExactRaw = () => alexLivingRaw({ lines: [...ORDERS.map((o) => rungLine(o, o.nominal)), cashLine(70000)], expected: [] });

export const living = (raw, today = TODAY) => entryOf(raw, today).plan;
