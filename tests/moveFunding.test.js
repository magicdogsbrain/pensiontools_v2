/**
 * What pays for the buys (7.12.0, the moving brief D1/D2/D6): on a ladder, the lines the plan does not use are no longer each
 * a sale. They are listed in `outside`, and one reading (`funding`) says how much of them the buys need and what is left over.
 * The schedule raises one amount a date and never slices a fund. A pot plan is untouched.
 *
 * Fictional Sam (no real person's figures). Today 16 November 2026, stopping work in October 2027.
 *   Ladder: TA30 40,000 units cost £60,000 for 2029/30; TB31 20,000 units cost £30,000 for 2030/31;
 *           cash years 2027/28 need £26,000 cost £26,000, 2028/29 need £26,000 cost £26,400 (cash target £52,400).
 *   Pension: share fund £300,000; bond fund £90,000; TA30 10,000 units (£15,000); cash £25,000; an ordinary gilt TG28 £20,000.
 *   By hand: buy TA30 30,000 units = 30,000 × £1.50 = £45,000; buy TB31 = £30,000; cash £52,400 − £25,000 = £27,400.
 *            need = 45,000 + 30,000 + 27,400 = £102,400. Outside = 300,000 + 90,000 + 20,000 = £410,000.
 *            toRaise = 102,400 (no spare cash). leftOver = 410,000 − 102,400 = £307,600.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { targetHoldings, diffHoldings, sequence } from '../src/services/TransitionPlanner.js';
import { samDoc, samLines, SAM_TODAY as TODAY } from './helpers/samMove.js';

const diffOf = (lines, doc = samDoc()) => diffHoldings(lines, targetHoldings(doc, { today: TODAY }), { today: TODAY, needs: null });

describe('What pays for the buys: one reading, never a sale of every line', () => {
  it('lines the plan does not use are listed outside, with the money the buys need and the money left over', () => {
    const d = diffOf(samLines());
    expect(d.sell).toEqual([]);   // no sell row for the share fund, the bond fund or TG28
    expect(d.outside.map((x) => x.label).sort()).toEqual(['1 5/8% Treasury Gilt 2028', 'Bond fund', 'World share fund']);
    expect(d.outside.reduce((s, x) => s + x.value, 0)).toBe(410000);
    expect(d.funding).toMatchObject({ need: 102400, spareCash: 0, available: 410000, toRaise: 102400, leftOver: 307600, short: 0, leftOverHeld: 'shares', fromPlan: false });
    expect(d.totals.sellValue).toBe(102400);
    expect(d.totals.shortfall).toBe(0);
  });

  it('a gilt outside the ladder says when it matures, and the cash year that falls in, as a fact only', () => {
    const tg = diffOf(samLines()).outside.find((x) => x.ticker === 'TG28');
    expect(tg.matures).toBe('2028-10-22');   // the bundled list's date
    expect(tg.cashYear).toBe(2028);          // 22 October 2028 is in 2028/29, one of Sam's cash years
    expect(tg.kind).toBe('gilt');
  });

  it('money kept by choice is not available: £60,000 left toward £102,400, so £42,400 short', () => {
    // by hand: the share fund (£300,000) kept by choice, and £50,000 of the bond fund kept by choice: 300,000 + 50,000 = 350,000
    const lines = samLines().filter((l) => l.ticker !== 'WSHR' && l.ticker !== 'BNDF');
    lines.push({ wrapper: 'SIPP', ticker: 'WSHR', name: 'World share fund', value: 300000, subClass: 'globalEquity', keep: { as: 'mine' } });
    lines.push({ wrapper: 'SIPP', ticker: 'BNDK', name: 'Bond fund (kept part)', value: 50000, subClass: 'globalBonds', keep: { as: 'mine' } });
    lines.push({ wrapper: 'SIPP', ticker: 'BNDF', name: 'Bond fund', value: 40000, subClass: 'globalBonds' });
    const d = diffOf(lines);
    // available = 40,000 + 20,000 (TG28) = 60,000; short = 102,400 − 60,000 = 42,400
    expect(d.funding).toMatchObject({ available: 60000, toRaise: 102400, short: 42400, leftOver: 0 });
    expect(d.totals.sellValue).toBe(60000);
    expect(d.totals.shortfall).toBe(42400);
  });

  it('the schedule raises one amount a date, never a slice of each fund, and the raises come to what the buys need', () => {
    const d = diffOf(samLines());
    const s = sequence(d, { today: TODAY, startYear: 2027, startMonth: '2027-10' });
    const raises = s.steps.filter((x) => x.action === 'raise');
    expect(raises.length).toBeGreaterThan(0);
    expect(raises.reduce((t, x) => t + x.amount, 0)).toBe(102400);
    expect(s.steps.some((x) => x.action === 'sell')).toBe(false);
    for (const x of raises) expect(/share|bond|treasury/i.test(String(x.label || ''))).toBe(false);
    expect(s.funded).toBe(true);
  });

  it('a pot plan reads exactly as it did', () => {
    const potDoc = { strategy: { contract: false }, targetMix: [{ y: 0, equity: 50, bond: 40, cash: 10 }], pots: { sipp: 400000 } };
    const lines = [
      { wrapper: 'SIPP', ticker: 'WSHR', name: 'World share fund', value: 300000, subClass: 'globalEquity' },
      { wrapper: 'SIPP', ticker: 'BNDF', name: 'Bond fund', value: 60000, subClass: 'globalBonds' },
      { wrapper: 'SIPP', ticker: 'CSH2', name: 'Cash fund', value: 40000 }
    ];
    const d = diffHoldings(lines, targetHoldings(potDoc, { today: TODAY }), { today: TODAY });
    expect(JSON.parse(JSON.stringify(d))).toMatchSnapshot();
    expect(JSON.parse(JSON.stringify(sequence(d, { today: TODAY, startYear: 2027, startMonth: '2027-10' })))).toMatchSnapshot();
  });
});

describe('One rule for the ISA: the move follows the engine (counted unless held aside)', () => {
  // TB31's 20,000 units held in an ISA instead of nothing: by hand, the buys are 45,000 (TA30) + 27,400 (cash) = £72,400
  const withIsaRung = () => [...samLines(), { wrapper: 'ISA', ticker: 'TB31', name: 'Fictional Linker 2030', kind: 'gilt', units: 20000, value: 30000 }];
  it('an ISA the plan counts: its gilt is the rung, and the move says the plan pays from both', () => {
    const doc = samDoc({ pots: { sipp: 500000, isa: 30000, isaPolicy: 'draw' } });
    const t = targetHoldings(doc, { today: TODAY });
    expect(t.isaIn).toBe(true);
    expect(t.note).toContain('Your plan pays for the ladder from your pension and your ISA together. Which account each gilt sits in is yours to choose.');
    const d = diffHoldings(withIsaRung(), t, { today: TODAY });
    expect(d.hold.some((h) => h.ticker === 'TB31')).toBe(true);
    expect(d.keep).toEqual([]);
    expect(d.funding.need).toBe(72400);
  });
  it('an ISA held aside: the rung is still to buy and the ISA line is left alone', () => {
    const doc = samDoc({ pots: { sipp: 500000, isa: 30000, isaPolicy: 'hold' } });
    const t = targetHoldings(doc, { today: TODAY });
    expect(t.isaIn).toBe(false);
    expect(t.note).toContain('Your plan pays for the ladder from your pension. Your ISA is held aside.');
    const d = diffHoldings(withIsaRung(), t, { today: TODAY });
    expect(d.buy.some((b) => b.ticker === 'TB31')).toBe(true);
    expect(d.keep.map((k) => k.ticker)).toEqual(['TB31']);
    expect(d.funding.need).toBe(102400);
  });
  it('a document with no ISA figure reads as not counted', () => {
    const doc = samDoc({ pots: { sipp: 500000, isaPolicy: 'draw' } });
    const t = targetHoldings(doc, { today: TODAY });
    expect(t.isaIn).toBe(false);
    expect(t.note).toContain('Your plan pays for the ladder from your pension.');
    expect(diffHoldings(withIsaRung(), t, { today: TODAY }).funding.need).toBe(102400);
  });
});
