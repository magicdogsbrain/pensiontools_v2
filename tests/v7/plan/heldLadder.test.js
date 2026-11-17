/**
 * 7.12.0 — one reader for "Your plan's mix" while living on a locked gilt ladder (src/answers/plan/held.js heldLadder).
 *
 * Before 7.12.0 four readers worked out "what the cash years need, and what is there for them" four ways: a gilt or a fund with
 * no year was counted as nothing, so money the person plainly held became a "gap", and a later sentence admitted it was enough.
 * Here every figure is worked by hand from the fixture's own orders and years (tests/v7/plan/_alexLiving.js), never copied from
 * the code's output.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { heldLadder, yearsWords } from '../../../src/answers/plan/held.js';
import { asMoving } from './_alex.js';
import { corpus, entryOf } from './_plans.js';
import { TODAY, ORDERS, OVER, alexLines, alexLivingRaw, joLivingRaw, samExactRaw, living, NOT_LISTED } from './_alexLiving.js';
import { L } from './_alex.js';

const order = (tidm) => ORDERS.find((o) => o.tidm === tidm);
const round10 = (v) => Math.round(v / 10) * 10;
// the cash years: 2026/27 (five months of 34,000 to come), 2027/28 (nothing: a lump sum the plan counts pays it), 2028/29 (33,000)
const NEED_EXACT = 34000 * 5 / 12 + 0 + 33000;
const NEED = Math.round(NEED_EXACT);   // 47,167
const OTHER_GILTS = 33930 + 34000 + 34000 + 2000;   // the 2027, 2028 and 2029 gilts and the 2026 gilt not on our list
const FUNDS = 4000 + 6000 + 3300 + 4000 + 6000;

describe('Alex: living on the ladder, holding more than the plan', () => {
  const p = living(alexLivingRaw());
  const before = JSON.parse(JSON.stringify(p));
  const h = heldLadder(p, { today: TODAY });

  it('reads the cash years once: what they still need, set against no line', () => {
    expect(NEED).toBe(47167);
    expect(h.cashYears.need).toBe(NEED);
    expect(h.cashYears.rows.map((r) => [r.Y, r.need])).toEqual([[2026, Math.round(34000 * 5 / 12)], [2027, 0], [2028, 33000]]);
    expect(h.cashYears.rows[0]).toMatchObject({ thisYear: true, monthsLeft: 5 });
    expect(h.cashYears.rows[1].paidBy).toBe('lump');
  });

  it('counts the money the pension holds beside the plan\'s gilts at today\'s value', () => {
    expect(OTHER_GILTS).toBe(103930);
    expect(FUNDS).toBe(23300);
    expect(h.money).toEqual({ cash: 12, gilts: OTHER_GILTS, funds: FUNDS, available: 12 + OTHER_GILTS + FUNDS });
    expect(h.money.available).toBe(127242);
  });

  // 7.12.0 round 3 (walker 7): the cash years as one dated reading. What arrives is what each ordinary gilt pays on the day it
  // matures, with its last interest, and the £12 of cash; the 2026 gilt that may have matured already arrives on no day.
  //   3¾% 2027, 34,000 units, matures 7 March 2027: one half-coupon left, 34,000 × 3.75% ÷ 2 = 637.50 → 34,637.50 → £34,638
  //   0 1/8% 2028, 36,000 units, 31 Jan 2028: three left (Jan 2027, Jul 2027, Jan 2028), 3 × 36,000 × 0.125% ÷ 2 = 67.50 → £36,068
  //   0½% 2029, 37,000 units, 31 Jan 2029: five left, 5 × 37,000 × 0.5% ÷ 2 = 462.50 → £37,463 (37,462.50 rounds up)
  //   in all 12 + 34,638 + 36,068 + 37,463 = 108,181; against 47,167 that is 61,014 more
  const PAYS = [34638, 36068, 37463];
  const ARRIVES = 12 + PAYS[0] + PAYS[1] + PAYS[2];
  it('sets the cash years against what arrives, on the day it arrives: the cash and these gilts pay more than the years need', () => {
    expect(ARRIVES).toBe(108181);
    expect(h.state).toBe('cashGilts');
    expect(h.more).toBe(Math.round(ARRIVES - NEED_EXACT));
    expect(h.more).toBe(61014);
    expect(h.dated.due).toBe(NEED);
    expect(h.dated.arrives).toBe(ARRIVES);
  });

  it('dates each row: the cash now, November to February, the 2027 gilt on 7 March, March, then each later year with what pays in it', () => {
    const rows = h.dated.rows.map((r) => [r.kind, r.from || r.date || r.Y || null, r.due != null ? r.due : null, (r.arrives || []).map((a) => (a.cash != null ? a.cash : a.amount))]);
    // 2,833.33 a month (34,000 ÷ 12): four months before the gilt pays, 11,333.33 → 11,333; March alone 2,833
    expect(rows).toEqual([
      ['now', null, null, [12]],
      ['months', '2026-11', Math.round(4 * 34000 / 12), []],
      ['day', '2027-03-07', null, [PAYS[0]]],
      ['months', '2027-03', Math.round(34000 / 12), []],
      ['year', 2027, 0, [PAYS[1]]],
      ['year', 2028, 33000, [PAYS[2]]]
    ]);
    expect(rows[1][2]).toBe(11333);
  });

  it('says the one difference in timing: four months are due before the first gilt pays, and the pension holds £12 of cash', () => {
    expect(h.timing).toMatchObject({ from: '2026-11', to: '2027-02', due: 11333, cash: 12 });
    expect(h.timing.next).toMatchObject({ label: '3¾% Treasury Gilt 2027', date: '2027-03-07', amount: PAYS[0] });
    // after it pays, 12 + 34,638 − 11,333 − 2,833 = 20,484 is in hand for March: nothing more falls short before 2028/29's gilt
    expect(h.dated.gaps.length).toBe(1);
  });

  it('sets each plan gilt beside what is held of it, in the plan\'s order', () => {
    const rows = h.gilts.rows;
    expect(rows.map((r) => r.code)).toEqual(ORDERS.map((o) => o.tidm));
    expect(rows.length).toBe(14);
    const tr31 = rows.find((r) => r.code === 'TR31'), t41 = rows.find((r) => r.code === 'T41');
    expect(tr31).toMatchObject({ planUnits: 15500, heldUnits: 16200, diff: 700, state: 'over', money: round10(700 * order('TR31').indexRatio) });
    expect(tr31.money).toBe(1000);
    expect(t41).toMatchObject({ planUnits: 7800, heldUnits: 8100, diff: OVER.T41, state: 'over', money: round10(300 * order('T41').indexRatio) });
    for (const r of rows.filter((x) => !(x.code in OVER))) expect(r).toMatchObject({ diff: 0, state: 'same', money: null });
    expect([h.gilts.held, h.gilts.total, h.gilts.over, h.gilts.under, h.gilts.none]).toEqual([14, 14, 2, 0, 0]);
  });

  it('gives each plan gilt the plan\'s own tax years, never a year from a maturity or a name', () => {
    for (const r of h.gilts.rows) expect(r.years).toEqual(order(r.code).taxYears);
    expect(yearsWords(order('T29').taxYears)).toBe('2029/30 to 2031/32');
    expect(yearsWords(order('TR31').taxYears)).toBe('2032/33');
    // the 2029 linker's line typed with another year in its name: still the plan's years
    const lines = alexLines().map((l) => (l.ticker === 'T29' ? { ...l, name: 'Index-linked gilt 2035' } : l));
    const h2 = heldLadder(living(alexLivingRaw({ lines })), { today: TODAY });
    expect(h2.gilts.rows.find((r) => r.code === 'T29').years).toEqual([2029, 2030, 2031]);
  });


  it('lists what else the pension holds, with when each gilt matures and what it pays then', () => {
    const by = (label) => h.lines.find((l) => l.label === label);
    // a conventional gilt pays its units and the coupons still to come after today (16 November 2026)
    expect(by('3¾% Treasury Gilt 2027')).toMatchObject({ value: 33930, matures: '2027-03-07', pays: Math.round(34000 + 34000 * 0.0375 / 2 * 1), fixed: true, note: null });
    expect(by('0 1/8% Treasury Gilt 2028')).toMatchObject({ value: 34000, matures: '2028-01-31', pays: Math.round(36000 + 36000 * 0.00125 / 2 * 3), fixed: true });
    expect(by('0½% Treasury Gilt 2029')).toMatchObject({ value: 34000, matures: '2029-01-31', pays: Math.round(37000 + 37000 * 0.005 / 2 * 5), fixed: true });
    expect(by(NOT_LISTED.name)).toMatchObject({ value: 2000, matures: null, note: 'notListed' });
    expect(h.lines.filter((l) => l.kind === 'fund').map((l) => l.value)).toEqual([4000, 6000, 3300, 4000, 6000]);
    expect(h.expected).toEqual([{ id: 'e1', label: 'Old workplace pension', amount: 60000, by: '2027-07' }]);
    expect(h.lumps).toEqual([{ Y: 2027, amount: 40000 }]);
  });

  it('a typed gilt name with no code cannot be placed: we say so, and count it at its value', () => {
    const typed = L({ name: 'Treasury 2031', units: 5000, value: 5000, kind: 'gilt' });
    const h2 = heldLadder(living(alexLivingRaw({ lines: [...alexLines(), typed] })), { today: TODAY });
    expect(h2.lines.find((l) => l.label === 'Treasury 2031')).toMatchObject({ note: 'unknown', matures: null, value: 5000 });
    expect(h2.money.gilts).toBe(OTHER_GILTS + 5000);
  });

  it('a year the person set against a line, or a "kept by choice" mark, changes no figure; the year is carried as a label', () => {
    const lines = alexLines().map((l) => (l.ticker === 'TG29' ? { ...l, keep: { as: 'rung', taxYears: [2028] } } : l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine' } } : l));
    const h2 = heldLadder(living(alexLivingRaw({ lines })), { today: TODAY });
    for (const k of ['cashYears', 'money', 'state', 'more', 'less', 'timing', 'gilts']) expect(h2[k]).toEqual(h[k]);
    expect(h2.lines.find((l) => l.label === '0½% Treasury Gilt 2029').forYears).toEqual([2028]);
    expect(h2.lines.find((l) => l.label === 'Vanguard FTSE All-World (Acc)').forYears).toBe(null);
    expect(h2.setYears).toEqual([{ label: '0½% Treasury Gilt 2029', years: [2028] }]);
  });

  it('writes nothing: the plan passed in is the same after', () => {
    expect(p).toEqual(before);
  });
});

describe('Jo: two gilts held below the plan\'s units, £5,000 cash, nothing else', () => {
  const h = heldLadder(living(joLivingRaw()), { today: TODAY });
  it('says which gilts are below, and the cash years against the cash alone', () => {
    expect([h.gilts.held, h.gilts.total, h.gilts.under, h.gilts.none]).toEqual([12, 14, 2, 0]);
    const tr31 = h.gilts.rows.find((r) => r.code === 'TR31'), t41 = h.gilts.rows.find((r) => r.code === 'T41');
    expect(tr31).toMatchObject({ planUnits: 15500, heldUnits: 2000, diff: -13500, state: 'under', money: round10(13500 * order('TR31').indexRatio) });
    expect(t41).toMatchObject({ planUnits: 7800, heldUnits: 500, diff: -7300, state: 'under', money: round10(7300 * order('T41').indexRatio) });
    expect(h.money).toEqual({ cash: 5000, gilts: 0, funds: 0, available: 5000 });
    expect(h.state).toBe('less');
    expect(h.less).toBe(Math.round(NEED_EXACT - 5000));
    expect(h.less).toBe(42167);
    // less in all is a shortfall, said once; it is not also a "difference in timing"
    expect(h.timing).toBe(null);
    expect(h.lines).toEqual([]);
  });
});

describe('Sam: exactly the plan, £70,000 cash', () => {
  const h = heldLadder(living(samExactRaw()), { today: TODAY });
  it('the cash alone is more than the cash years need', () => {
    expect(h.state).toBe('cash');
    expect(h.more).toBe(Math.round(70000 - NEED_EXACT));
    expect(h.more).toBe(22833);
    expect(h.timing).toBe(null);
    expect(h.dated.gaps).toEqual([]);
    expect(h.lines).toEqual([]);
    expect(h.gilts.rows.every((r) => r.state === 'same')).toBe(true);
  });
});

describe('nothing recorded under What you hold', () => {
  it('the plan\'s gilts are read with nothing beside them, and no verdict on the cash years is given', () => {
    const h = heldLadder(living(alexLivingRaw({ lines: [], expected: [] })), { today: TODAY });
    expect(h.noRecord).toBe(true);
    expect(h.gilts.rows.map((r) => r.heldUnits)).toEqual(ORDERS.map(() => null));
    expect([h.state, h.more, h.less, h.timing]).toEqual([null, 0, 0, null]);
  });
});

describe('nothing to read outside the held phase on a ladder', () => {
  it('a pot plan', () => {
    const raw = corpus()['04-buckets-running'];
    expect(heldLadder(entryOf(raw, TODAY).plan, { today: TODAY })).toBe(null);
  });
  it('a plan not locked', () => {
    const raw = alexLivingRaw();
    raw.decisionTool.settings.locked = false;
    expect(heldLadder(living(raw), { today: TODAY })).toBe(null);
  });
  it('a ladder plan read as Moving, nothing accepted', () => {
    expect(heldLadder(living(asMoving(alexLivingRaw())), { today: TODAY })).toBe(null);
  });
});
