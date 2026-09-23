import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { targetHoldings, ledgerView, diffHoldings, sequence, progress, isGiltTicker, planRunning } from '../src/services/TransitionPlanner.js';

// Every target is read as of a fixed date (the planner is time-aware from 6.12): September 2026, before the 2027/28 start.
const TODAY = new Date(2026, 8, 10);
const tgt = (doc, today = TODAY) => targetHoldings(doc, { today });

// A three-rung ladder document (shape of buildPlanDocument output for a contract strategy)
const ladderDoc = {
  strategy: { contract: true, r: { plan: {
    cash: 60000, cashYears: [{ Y: 2027 }, { Y: 2028 }],
    orders: [
      { name: 'IL Treasury 2029', tidm: 'TR29', sedol: 'B3D4RD5', matures: '2029-03-22', pays: 40000, nominal: 36000, cleanPrice: 105, indexRatio: 1.05, cost: 39690, taxYears: [2029] },
      { name: 'IL Treasury 2030', tidm: 'TR30', sedol: 'B4PTCY7', matures: '2030-03-22', pays: 40000, nominal: 35000, cleanPrice: 104, indexRatio: 1.06, cost: 38584, taxYears: [2030] },
      { name: 'IL Treasury 2032', tidm: 'TR32', sedol: 'B7Z5M15', matures: '2032-03-22', pays: 40000, nominal: 33000, cleanPrice: 103, indexRatio: 1.10, cost: 37389, taxYears: [2031, 2032] }
    ] } } },
  pots: { sipp: 200000, isaPolicy: 'hold' }
};
const potDoc = { strategy: { contract: false }, targetMix: [{ y: 0, equity: 50, bond: 40, cash: 10 }], pots: { sipp: 400000 } };

describe('targetHoldings', () => {
  it('a ladder plan targets its order sheet plus the cash years', () => {
    const t = tgt(ladderDoc);
    expect(t.kind).toBe('ladder');
    expect(t.lines.map((l) => l.ticker)).toEqual(['TR29', 'TR30', 'TR32']);
    expect(t.lines[0].units).toBe(36000);
    expect(t.cash.value).toBe(60000);
    expect(t.cash.breakdown.map((b) => b.label).join(' ')).toContain('2027/28');
  });
  it('a pot plan targets the year-0 mix in pounds', () => {
    const t = tgt(potDoc);
    expect(t.kind).toBe('buckets');
    expect(t.lines.map((l) => l.value)).toEqual([200000, 160000, 40000]);
  });
  it('no document → nothing', () => { expect(tgt(null).kind).toBe('none'); });
});

describe('ledgerView', () => {
  it('recognises gilts by ticker and money-market funds as cash', () => {
    const v = ledgerView([{ ticker: 'TR29', value: 39000, wrapper: 'SIPP', units: 36000 }, { ticker: 'CSH2', value: 30000, wrapper: 'SIPP' }, { ticker: 'VWRP', value: 50000, wrapper: 'ISA' }]);
    expect(v[0]).toMatchObject({ gilt: true, bucket: 'bonds', units: 36000 });
    expect(v[1]).toMatchObject({ cash: true, bucket: 'cash' });
    expect(v[2]).toMatchObject({ wrapper: 'ISA', bucket: 'shares' });
    expect(isGiltTicker('TG36')).toBe(true);
    expect(isGiltTicker('VWRP')).toBe(false);
  });
});

describe('diffHoldings — ladder', () => {
  it('an empty SIPP buys the whole order sheet and the cash', () => {
    const d = diffHoldings([], tgt(ladderDoc));
    expect(d.buy.length).toBe(4);
    expect(d.sell).toEqual([]);
    expect(d.totals.buyCost).toBe(39690 + 38584 + 37389 + 60000);
    expect(d.progressPct).toBe(0);
  });
  it('a ledger matching rung for rung (Chris) has nothing to buy', () => {
    const ledger = [
      { ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' }, { ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' },
      { ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }, { ticker: 'VWRP', value: 60000, wrapper: 'ISA' }
    ];
    const d = diffHoldings(ledger, tgt(ladderDoc));
    expect(d.buy).toEqual([]);
    expect(d.sell).toEqual([]);
    expect(d.hold.length).toBe(4);
    expect(d.keep[0].wrapper).toBe('ISA');
    expect(d.progressPct).toBe(100);
  });
  it('a part-held ladder (reconcile): top-ups for short rungs, a surplus to sell, cash short', () => {
    const ledger = [
      { ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' },   // full
      { ticker: 'TR30', units: 20000, value: 22048, wrapper: 'SIPP' },   // short by 15,000 units
      { ticker: 'TR32', units: 40000, value: 45320, wrapper: 'SIPP' },   // 7,000 over
      { ticker: 'CSH2', value: 20000, wrapper: 'SIPP' },
      { ticker: 'VWRP', value: 80000, wrapper: 'SIPP' }                  // equities to sell
    ];
    const d = diffHoldings(ledger, tgt(ladderDoc));
    const buyTr30 = d.buy.find((b) => b.ticker === 'TR30');
    expect(buyTr30.units).toBe(15000);
    expect(buyTr30.amount).toBe(Math.round(15000 * 104 * 1.06 / 100));
    expect(d.sell.find((s) => s.ticker === 'TR32').units).toBe(7000);
    expect(d.buy.find((b) => b.kind === 'cash').amount).toBe(40000);
    expect(d.sell.find((s) => s.ticker === 'VWRP').amount).toBe(80000);
    expect(d.hold.map((h) => h.ticker || h.kind)).toContain('TR29');
    expect(d.progressPct).toBeGreaterThan(50);
    expect(d.progressPct).toBeLessThan(100);
  });
  it('a pasted gilt with only a guessed code (T30) or a name still matches its rung by maturity year (6.10.5)', () => {
    const d = diffHoldings([{ ticker: 'T30', name: '0 1/8% Index-linked Treasury Gilt 2030', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: '', name: 'Treasury 0.125% I/L 22/03/2029', units: 36000, value: 39690, wrapper: 'SIPP', kind: 'gilt' }], tgt(ladderDoc));
    expect(d.hold.map((h) => h.ticker).sort()).toEqual(['TR29', 'TR30']);
    expect(d.sell.filter((s) => s.kind === 'gilt')).toEqual([]);   // nothing wrongly marked "not in the plan"
  });
  it('a rung within 2% counts as held', () => {
    const d = diffHoldings([{ ticker: 'TR29', units: 35500, value: 39000, wrapper: 'SIPP' }], tgt(ladderDoc));
    expect(d.hold.some((h) => h.ticker === 'TR29')).toBe(true);
  });
});

describe('diffHoldings — buckets', () => {
  it('rebalances by bucket in pounds', () => {
    const d = diffHoldings([{ ticker: 'VWRP', value: 320000, wrapper: 'SIPP' }, { ticker: 'IGLT', value: 60000, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 20000, wrapper: 'SIPP' }], tgt(potDoc));
    expect(d.sell.find((s) => s.bucket === 'shares').amount).toBe(120000);
    expect(d.buy.find((b) => b.bucket === 'bonds').amount).toBe(100000);
    expect(d.buy.find((b) => b.bucket === 'cash').amount).toBe(20000);
  });
});

describe('sequence and progress', () => {
  const ledger = [{ ticker: 'VWRP', value: 150000, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 10000, wrapper: 'SIPP' }];
  const d = diffHoldings(ledger, tgt(ladderDoc));
  it('lays the buys out cash first, near rungs first, funded by tranche sales and contributions', () => {
    // buys 115,663 of gilts + 50,000 cash = 165,663; sales 150,000 + 7 × £3,000 contributions = 171,000 → funded
    const s = sequence(d, { today: new Date(2026, 8, 10), startYear: 2027, contributionsMonthly: 3000 });
    expect(s.months).toBe(7);
    expect(s.tranches).toBe(3);
    const buys = s.steps.filter((x) => x.action === 'buy');
    expect(buys[0].label).toMatch(/cash/i);
    const rungs = buys.filter((x) => x.ticker).map((x) => x.ticker);
    expect(rungs.indexOf('TR29')).toBeLessThan(rungs.indexOf('TR32'));
    expect(s.steps.filter((x) => x.action === 'sell').length).toBe(3);   // one VWRP sale per tranche
    expect(s.funded).toBe(true);
    expect(s.steps.every((x) => /^\d{4}-\d{2}$/.test(x.when))).toBe(true);
  });
  it('a plan already running reconciles over a rolling horizon; a future retiree\'s deadline is the retirement month (6.10.5)', () => {
    const running = sequence(d, { today: new Date(2026, 8, 11), startYear: 2026, contributionsMonthly: 0 });
    expect(running.startPassed).toBe(true);
    expect(running.months).toBe(6);
    const wendy = sequence(d, { today: new Date(2026, 8, 11), startYear: 2027, startMonth: '2027-10', contributionsMonthly: 0 });
    expect(wendy.startPassed).toBe(false);
    expect(wendy.months).toBe(13);
  });
  it('reports a shortfall honestly', () => {
    const s = sequence(d, { today: new Date(2026, 8, 10), startYear: 2027, contributionsMonthly: 0 });
    expect(s.funded).toBe(false);
    expect(s.note).toMatch(/Short by/);
  });
  it('progress counts tick-offs and names the next item', () => {
    const p0 = progress(d, {});
    expect(p0.total).toBe(d.buy.length + d.sell.length);
    expect(p0.next).toBeTruthy();
    const p1 = progress(d, { [d.buy[0].key]: '2026-09-10' });
    expect(p1.doneCount).toBe(1);
  });
});

describe('zero-pay gilts are not targets (6.11.3)', () => {
  it('a rung whose years a later lump sum covers is left out of the target', () => {
    const doc = { strategy: { contract: true, r: { plan: { cash: 30000, cashYears: [{ Y: 2027 }], orders: [
      { name: 'IL 2029', tidm: 'T29', nominal: 18200, cost: 31507, pays: 32000, taxYears: [2030, 2031] },
      { name: 'IL 2031', tidm: 'TR31', nominal: 0, cost: 0, pays: 0, taxYears: [2032] }
    ] } } } };
    const t = tgt(doc);
    expect(t.lines.filter((l) => l.kind === 'gilt').map((l) => l.ticker)).toEqual(['T29']);
  });
});

describe('time-aware ladder target (6.12)', () => {
  const full = [
    { ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' }, { ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' },
    { ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }
  ];
  it('before the start the whole plan is the target, as before, and a full ledger is complete with a reason', () => {
    const t = tgt(ladderDoc);
    expect(t.running).toBe(false);
    expect(t.paid).toEqual([]);
    expect(t.cash).toMatchObject({ value: 60000, spending: false, yearsLeft: [2027, 2028] });
    expect(t.firstTaxYear).toBe(2027);   // inferred from the earliest year the plan funds when the document carries none
    const d = diffHoldings(full, t);
    expect(d).toMatchObject({ complete: true, reason: 'every rung the plan still needs is held, and the cash years are covered', cashInfo: null, matured: [] });
    expect(d.totals).toMatchObject({ cashHeld: 60000, cashTarget: 60000 });
    expect(diffHoldings([], t)).toMatchObject({ complete: false, reason: '4 lines still to buy' });
    expect(diffHoldings(full.slice(0, 3), t).reason).toBe('1 line still to buy');
  });
  it('the 6 April boundary: 5 April 2027 is still before the start, 6 April is running', () => {
    expect(planRunning(ladderDoc, new Date(2027, 3, 5))).toBe(false);
    expect(planRunning(ladderDoc, new Date(2027, 3, 6))).toBe(true);
    expect(tgt(ladderDoc, new Date(2027, 3, 5)).cash.spending).toBe(false);
    expect(tgt(ladderDoc, new Date(2027, 3, 6)).cash.spending).toBe(true);
  });
  it('a future retiree\'s plan runs from the retirement MONTH, not just the tax year', () => {
    const wendy = { ...ladderDoc, timing: { firstTaxYear: 2027, startMonth: '2027-10', mode: 'future' } };
    expect(planRunning(wendy, new Date(2027, 5, 1))).toBe(false);
    expect(planRunning(wendy, new Date(2027, 9, 1))).toBe(true);
  });
  it('mid-run: rungs whose gilt has matured are paid, not targets; cash is information, not a move', () => {
    // September 2030 = tax year 2030/31: TR29 (matured March 2029) and TR30 (matured 22 March 2030, funding THIS tax year)
    // have both redeemed — the money is cash now, not a rung to hold; TR32 (matures 2032) pays 2031/32 and 2032/33
    const t = tgt(ladderDoc, new Date(2030, 8, 10));
    expect(t.running).toBe(true);
    expect(t.lines.map((l) => l.ticker)).toEqual(['TR32']);
    expect(t.paid.map((l) => l.ticker)).toEqual(['TR29', 'TR30']);
    expect(t.cash).toMatchObject({ spending: true, value: 0, yearsLeft: [] });   // both cash years are behind us
    expect(t.note).toMatch(/running \(tax year 2030\/31\): 2 rungs have matured and paid/);
    const d = diffHoldings([{ ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 12000, wrapper: 'SIPP' }], t);
    expect(d.buy).toEqual([]);
    expect(d.sell).toEqual([]);
    expect(d.hold.map((h) => h.ticker)).toEqual(['TR32']);
    expect(d.matured.map((m) => m.ticker)).toEqual(['TR30']);   // still on the record after redemption: stale, not a sale
    expect(d.cashInfo).toEqual({ held: 12000, target: 0, yearsLeft: [] });
    expect(d.totals).toMatchObject({ cashHeld: 12000, cashTarget: 0 });
    expect(d).toMatchObject({ complete: true, reason: 'every rung the plan still needs is held', progressPct: 100 });
  });
  it('BLOCKER (6.13): a rung retires on its MATURITY DATE, not at the next 6 April — the ladder buys gilts maturing before the April their year starts', () => {
    // TR30 matures 22 March 2030 and funds 2030/31. The old "every tax year passed" rule kept it as a target until 6 April 2031.
    expect(tgt(ladderDoc, new Date(2030, 2, 10)).lines.map((l) => l.ticker)).toEqual(['TR30', 'TR32']);   // 10 March 2030: not yet redeemed
    const april = tgt(ladderDoc, new Date(2030, 3, 10));                                                 // 10 April 2030: redeemed, paying this year
    expect(april.lines.map((l) => l.ticker)).toEqual(['TR32']);
    expect(april.paid.map((l) => l.ticker)).toEqual(['TR29', 'TR30']);
    // Redeemed but still in the old tax year (25 March 2030, 2029/30): paid all the same — the cash is sitting there for April.
    expect(tgt(ladderDoc, new Date(2030, 2, 25)).paid.map((l) => l.ticker)).toEqual(['TR29', 'TR30']);
    // No maturity date on the order → the tax-year rule is the fallback
    const noDates = { ...ladderDoc, strategy: { ...ladderDoc.strategy, r: { plan: { ...ladderDoc.strategy.r.plan, orders: ladderDoc.strategy.r.plan.orders.map((o) => ({ ...o, matures: null })) } } } };
    expect(tgt(noDates, new Date(2030, 3, 10)).lines.map((l) => l.ticker)).toEqual(['TR30', 'TR32']);
    expect(tgt(noDates, new Date(2031, 3, 10)).lines.map((l) => l.ticker)).toEqual(['TR32']);
  });
  it('mid-run with a cash year still ahead: the cash target is what is left, from the plan\'s years when it has them', () => {
    const doc = { ...ladderDoc, strategy: { ...ladderDoc.strategy, r: { plan: { ...ladderDoc.strategy.r.plan, years: [{ Y: 2027, from: 'cash', need: 30000 }, { Y: 2028, from: 'cash', need: 30000 }, { Y: 2029, from: 'TR29', need: 40000 }] } } } };
    const t = tgt(doc, new Date(2028, 8, 10));   // 2028/29: the second cash year, TR29 not yet paid
    expect(t.cash).toMatchObject({ spending: true, value: 30000, yearsLeft: [2028] });
    expect(t.paid).toEqual([]);
    // without `years`, pro-rate the cash by the years left
    expect(tgt(ladderDoc, new Date(2028, 8, 10)).cash.value).toBe(30000);
    const d = diffHoldings([{ ticker: 'CSH2', value: 14000, wrapper: 'SIPP' }], t);
    expect(d.buy.find((b) => b.kind === 'cash')).toBeUndefined();   // half-spent cash is not a shortfall
    expect(d.cashInfo).toEqual({ held: 14000, target: 30000, yearsLeft: [2028] });
    expect(d.complete).toBe(false);
    expect(d.reason).toBe('3 lines still to buy');
  });
  it('a ledger line for a rung that has already matured is "matured", never a sale', () => {
    const t = tgt(ladderDoc, new Date(2030, 8, 10));
    const d = diffHoldings([{ ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' }, { ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' }], t);
    expect(d.sell).toEqual([]);
    expect(d.matured).toHaveLength(2);
    expect(d.matured[0]).toMatchObject({ ticker: 'TR29', key: 'matured:TR29', why: 'matured and paid in 2029/30 — remove it from your record' });
    expect(d.matured[1]).toMatchObject({ ticker: 'TR30', key: 'matured:TR30', why: 'matured and paid in 2030/31 — remove it from your record' });
    expect(d.complete).toBe(true);
  });
  it('every rung paid → complete with nothing left to hold', () => {
    const t = tgt(ladderDoc, new Date(2033, 8, 10));
    expect(t.lines).toEqual([]);
    expect(t.paid).toHaveLength(3);
    expect(diffHoldings([{ ticker: 'CSH2', value: 5000, wrapper: 'SIPP' }], t)).toMatchObject({ complete: true, reason: 'every rung has matured and paid — nothing left to hold', progressPct: 100 });
  });
  it('a stray fund in the SIPP still blocks completeness', () => {
    const t = tgt(ladderDoc, new Date(2030, 8, 10));
    const d = diffHoldings([{ ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' }, { ticker: 'VWRP', value: 20000, wrapper: 'SIPP' }], t);
    expect(d).toMatchObject({ complete: false, reason: '1 line to sell' });
  });
  it('buckets: complete when every bucket is within tolerance; a 0% bucket needs nothing', () => {
    const t = tgt(potDoc);
    expect(diffHoldings([{ ticker: 'VWRP', value: 200000, wrapper: 'SIPP' }, { ticker: 'IGLT', value: 160000, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 40000, wrapper: 'SIPP' }], t)).toMatchObject({ complete: true, reason: 'every bucket is within 2% of its target' });
    const noCash = tgt({ ...potDoc, targetMix: [{ y: 0, equity: 60, bond: 40, cash: 0 }] });
    const d = diffHoldings([{ ticker: 'VWRP', value: 240000, wrapper: 'SIPP' }, { ticker: 'IGLT', value: 160000, wrapper: 'SIPP' }], noCash);
    expect(d.sell).toEqual([]);
    expect(d.complete).toBe(true);
    expect(diffHoldings([], tgt(null))).toMatchObject({ complete: false, reason: 'no plan document to read against' });
  });
  it('returns nothing undefined (the diff may be cached on the scenario)', () => {
    const d = diffHoldings([{ ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' }], tgt(ladderDoc));
    const s = JSON.stringify(d);
    expect(JSON.parse(s)).toEqual(d);
    expect(Object.values(d).some((v) => v === undefined)).toBe(false);
    expect(Object.values(d.totals).some((v) => v === undefined)).toBe(false);
    for (const k of ['sold', 'rotated', 'paid']) expect(tgt(ladderDoc)[k]).not.toBeUndefined();
    for (const k of ['sold', 'rotated']) { expect(tgt(potDoc)[k]).not.toBeUndefined(); expect(tgt(null)[k]).not.toBeUndefined(); }
  });
});

describe('spare cash, bridge cash and bank cash (6.13.0)', () => {
  const rungs = [{ ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' }, { ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' }];
  it('surplus SIPP cash before the start is HELD with the spare said — never a sell, and it does not block complete', () => {
    const d = diffHoldings([...rungs, { ticker: 'CSH2', value: 90000, wrapper: 'SIPP' }], tgt(ladderDoc));
    expect(d.sell).toEqual([]);
    expect(d.buy).toEqual([]);
    const cash = d.hold.find((h) => h.kind === 'cash');
    expect(cash).toMatchObject({ heldValue: 90000, value: 60000, spare: 30000 });
    expect(d).toMatchObject({ complete: true, reason: 'every rung the plan still needs is held, and the cash years are covered' });
    expect(d.totals).toMatchObject({ cashHeld: 90000, cashTarget: 60000, sellValue: 0 });
    // exactly on target → spare 0; just inside tolerance → held; short beyond it → a buy for the difference
    expect(diffHoldings([{ ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }], tgt(ladderDoc)).hold.find((h) => h.kind === 'cash').spare).toBe(0);
    expect(diffHoldings([{ ticker: 'CSH2', value: 59000, wrapper: 'SIPP' }], tgt(ladderDoc)).hold.find((h) => h.kind === 'cash')).toMatchObject({ heldValue: 59000, spare: 0 });
    expect(diffHoldings([{ ticker: 'CSH2', value: 50000, wrapper: 'SIPP' }], tgt(ladderDoc)).buy.find((b) => b.kind === 'cash').amount).toBe(10000);
  });
  it('the pre-start cash target is the cash YEARS\' money only: plan.cash includes the bridge, which the run-up spends', () => {
    // plan.cash 110,000 = 60,000 for the two cash years + 50,000 bridge (GiltLadderPlan adds bridgeCash into `cash`)
    const withBridge = (extra) => ({ ...ladderDoc, ...extra, strategy: { ...ladderDoc.strategy, params: extra.params || {}, r: { plan: { ...ladderDoc.strategy.r.plan, cash: 110000 } } } });
    const a = tgt(withBridge({ assumptions: { bridgeCash: 50000 } }));
    expect(a.cash).toMatchObject({ value: 60000, bridgeCash: 50000, spending: false });
    expect(a.note).toMatch(/run-up is paid from the same cash|bridge cash for the run-up has been spent/);
    // from the strategy params when the document has no assumptions block
    expect(tgt(withBridge({ params: { bridgeCash: 50000 } })).cash).toMatchObject({ value: 60000, bridgeCash: 50000 });
    // no bridge anywhere → the whole of plan.cash, as before
    expect(tgt(ladderDoc).cash).toMatchObject({ value: 60000, bridgeCash: 0 });
    // the cash years' own costs win when the plan carries them, whatever plan.cash says
    const costed = { ...ladderDoc, assumptions: { bridgeCash: 50000 }, strategy: { ...ladderDoc.strategy, r: { plan: { ...ladderDoc.strategy.r.plan, cash: 111000, cashYears: [{ Y: 2027, cost: 31000 }, { Y: 2028, cost: 30000 }] } } } };
    expect(tgt(costed).cash.value).toBe(61000);
    // a ledger holding the cash years' money plus the bridge is complete — the bridge is not a surplus to sell
    const d = diffHoldings([...rungs, { ticker: 'CSH2', value: 110000, wrapper: 'SIPP' }], a);
    expect(d.sell).toEqual([]);
    expect(d.complete).toBe(true);
    // mid-run pro-rating (no `years` on the plan) is of the cash years' money, not of plan.cash
    expect(tgt(withBridge({ assumptions: { bridgeCash: 50000 } }), new Date(2028, 8, 10)).cash.value).toBe(30000);
  });
  it('a CASH-wrapper line is bank money: kept as it is, never counted as the SIPP\'s cash years', () => {
    const v = ledgerView([{ ticker: '', name: 'Bank savings', value: 25000, wrapper: 'CASH' }, { ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }]);
    expect(v[0]).toMatchObject({ wrapper: 'CASH', cash: true, bucket: 'cash' });
    expect(v[1]).toMatchObject({ wrapper: 'SIPP', cash: true });
    const d = diffHoldings([...rungs, { ticker: '', name: 'Bank savings', value: 25000, wrapper: 'CASH' }, { ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }], tgt(ladderDoc));
    expect(d.keep).toHaveLength(1);
    expect(d.keep[0]).toMatchObject({ wrapper: 'CASH', name: 'Bank savings', value: 25000, why: 'bank / savings cash — outside the pension, kept as it is' });
    expect(d.totals.cashHeld).toBe(60000);
    expect(d.sell).toEqual([]);
    expect(d.complete).toBe(true);
    // bank cash alone does not cover the SIPP's cash years
    expect(diffHoldings([{ name: 'Bank savings', value: 60000, wrapper: 'CASH' }], tgt(ladderDoc)).buy.find((b) => b.kind === 'cash').amount).toBe(60000);
  });
});

describe('gilt recognition and rung matching (6.13.0)', () => {
  it('recognises every TIDM in the bundled universe, not just the TRxx / Txx shapes', () => {
    for (const t of ['TRTQ', 'T2IL', 'TR8F', 'tr8f', 'TR35', 'T26A', 'TG36', 'GB00B3D4RD54']) expect(isGiltTicker(t)).toBe(true);
    for (const t of ['VWRP', 'CSH2', 'IGLT', '', null]) expect(isGiltTicker(t)).toBe(false);
    expect(ledgerView([{ ticker: 'T2IL', units: 1000, value: 1500, wrapper: 'SIPP' }])[0]).toMatchObject({ gilt: true, bucket: 'bonds' });
  });
  it('two linkers maturing the same year (T2IL and TR35, both 2035) are paired by code first, never by year', () => {
    const doc = { strategy: { contract: true, r: { plan: { cash: 0, cashYears: [], orders: [
      { name: '2% Index-linked Treasury Stock 2035', tidm: 'T2IL', sedol: 'B0CNHZ0', matures: '2035-01-26', pays: 40000, nominal: 20000, cleanPrice: 200, indexRatio: 1.0, cost: 40000, taxYears: [2035] },
      { name: '1 1/8% Index-linked Treasury Gilt 2035', tidm: 'TR35', sedol: 'BNNGP66', matures: '2035-09-22', pays: 40000, nominal: 30000, cleanPrice: 120, indexRatio: 1.1, cost: 39600, taxYears: [2036] }
    ] } } } };
    const t = tgt(doc);
    // the old single pass let the first 2035 rung take BOTH ledger rows by maturity year
    const d = diffHoldings([{ ticker: 'TR35', units: 30000, value: 39600, wrapper: 'SIPP' }, { ticker: 'T2IL', units: 20000, value: 40000, wrapper: 'SIPP' }], t);
    expect(d.hold.map((h) => h.ticker).sort()).toEqual(['T2IL', 'TR35']);
    expect(d.buy).toEqual([]);
    expect(d.sell).toEqual([]);
    // only ONE of them on the record, by code: the other is a buy — not a mis-pair by year
    const one = diffHoldings([{ ticker: 'TR35', units: 30000, value: 39600, wrapper: 'SIPP' }], t);
    expect(one.hold.map((h) => h.ticker)).toEqual(['TR35']);
    expect(one.buy.map((b) => b.ticker)).toEqual(['T2IL']);
    // an exact match on one rung leaves the year fallback to the rung with nothing: a nameless 2035 row goes to T2IL
    const mixed = diffHoldings([{ ticker: 'TR35', units: 30000, value: 39600, wrapper: 'SIPP' }, { ticker: '', name: 'Index-linked Treasury 2035', units: 20000, value: 40000, wrapper: 'SIPP', kind: 'gilt' }], t);
    expect(mixed.hold.map((h) => h.ticker).sort()).toEqual(['T2IL', 'TR35']);
    // each ledger row is used once
    const twice = diffHoldings([{ ticker: 'T2IL', units: 20000, value: 40000, wrapper: 'SIPP' }], t);
    expect(twice.hold.map((h) => h.ticker)).toEqual(['T2IL']);
    expect(twice.buy.map((b) => b.ticker)).toEqual(['TR35']);
  });
});

describe('a fired rotation (6.13.0): sold rungs are not targets, the equity fund is kept', () => {
  const rotDoc = { timing: { firstTaxYear: 2027, shapeAgeNow: 57 }, strategy: { id: 'gilt-rotation', contract: true, params: { rotateCutAge: 75 }, r: { plan: { cash: 60000, cashYears: [{ Y: 2027 }, { Y: 2028 }], orders: [
    ...ladderDoc.strategy.r.plan.orders,
    { name: 'IL Treasury 2046', tidm: 'TR46', sedol: 'BYZW3J8', matures: '2046-03-22', pays: 40000, nominal: 30000, cleanPrice: 90, indexRatio: 1.2, cost: 32400, taxYears: [2046] },
    { name: 'IL Treasury 2048', tidm: 'TR48', sedol: 'BZ13DV4', matures: '2048-08-10', pays: 40000, nominal: 31000, cleanPrice: 88, indexRatio: 1.2, cost: 32736, taxYears: [2047, 2048] }
  ] } } }, pots: { isaPolicy: 'hold' } };
  const bf = { soldAt: '2031-03-02', tidms: ['TR46', 'TR48'], nominals: [30000, 31000], years: [{ Y: 2046, age: 76, need: 40000 }], proceeds: 65000 };
  const held = [{ ticker: 'TR29', units: 36000, value: 39690, wrapper: 'SIPP' }, { ticker: 'TR30', units: 35000, value: 38584, wrapper: 'SIPP' }, { ticker: 'TR32', units: 33000, value: 37389, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }];
  it('before any rotation the block is a target and an equity fund in the SIPP is a sale', () => {
    const t = tgt(rotDoc);
    expect(t.lines.map((l) => l.ticker)).toEqual(['TR29', 'TR30', 'TR32', 'TR46', 'TR48']);
    expect(t).toMatchObject({ sold: [], rotated: false });
    const d = diffHoldings([...held, { ticker: 'VWRP', value: 65000, wrapper: 'SIPP' }], t);
    expect(d.sell.map((s) => s.ticker)).toEqual(['VWRP']);
    expect(d.buy.map((b) => b.ticker)).toEqual(['TR46', 'TR48']);
  });
  it('the borrowed floor on the LIVE params (the document is a snapshot) excludes the sold rungs and keeps the fund', () => {
    const t = targetHoldings(rotDoc, { today: TODAY, params: { floorToAge: 75, borrowedFloor: bf } });
    expect(t.lines.map((l) => l.ticker)).toEqual(['TR29', 'TR30', 'TR32']);
    expect(t.sold.map((l) => l.ticker)).toEqual(['TR46', 'TR48']);
    expect(t.rotated).toBe(true);
    expect(t.note).toContain('The rotation fired on 2 March 2031: 2 rungs were sold and the proceeds bought the equity fund, so they are no longer targets and the fund is kept.');
    const d = diffHoldings([...held, { ticker: 'VWRP', value: 65000, wrapper: 'SIPP' }], t);
    expect(d.sell).toEqual([]);
    expect(d.buy).toEqual([]);
    expect(d.keep.find((k) => k.ticker === 'VWRP')).toMatchObject({ wrapper: 'SIPP', value: 65000, why: 'bought by the rotation — kept' });
    expect(d).toMatchObject({ complete: true, reason: 'every rung the plan still needs is held, and the cash years are covered' });
    // a sold rung still on the record is stale — the sale is on record — not a sale to make
    const stale = diffHoldings([...held, { ticker: 'TR46', units: 30000, value: 32400, wrapper: 'SIPP' }], t);
    expect(stale.sell).toEqual([]);
    expect(stale.sold).toHaveLength(1);
    expect(stale.sold[0]).toMatchObject({ ticker: 'TR46', key: 'sold:TR46', why: 'sold by the rotation — remove it from your record' });
  });
  it('the document\'s own params or its rotation record say the same; a gilt outside the plan is still a sale', () => {
    const viaDocParams = tgt({ ...rotDoc, strategy: { ...rotDoc.strategy, params: { rotateCutAge: 75, borrowedFloor: bf } } });
    expect(viaDocParams.sold.map((l) => l.ticker)).toEqual(['TR46', 'TR48']);
    const viaRecord = tgt({ ...rotDoc, rotation: { firedAt: '2031-03-02', borrowedFloor: bf } });
    expect(viaRecord.sold.map((l) => l.ticker)).toEqual(['TR46', 'TR48']);
    expect(viaRecord.rotated).toBe(true);
    const d = diffHoldings([...held, { ticker: 'VWRP', value: 65000, wrapper: 'SIPP' }, { ticker: 'TR40', units: 5000, value: 5000, wrapper: 'SIPP' }], viaRecord);
    expect(d.keep.map((k) => k.ticker)).toEqual(['VWRP']);
    expect(d.sell.map((s) => s.ticker)).toEqual(['TR40']);
  });
});

describe('run-up months still to pay are part of the pre-start cash target (6.13.2)', () => {
  it('6 months at £6,667 adds £40,000 on top of the cash years, capped at the bridge cash; nothing once running', async () => {
    const { targetHoldings } = await import('../src/services/TransitionPlanner.js');
    const doc = { timing: { firstTaxYear: 2027 }, assumptions: { bridgeCash: 50000 }, timeline: [{ y: 0, gross: 83650, sp: 0, other: 3650 }],
      strategy: { contract: true, r: { plan: { firstTaxYear: 2027, cash: 203646, cashYears: [{ Y: 2027, cost: 80000 }, { Y: 2028, cost: 0 }, { Y: 2029, cost: 73646 }], orders: [] } } } };
    const t = targetHoldings(doc, { today: new Date(Date.UTC(2026, 9, 6)) });   // 6 October 2026: six months to 6 April 2027
    expect(t.cash.runUp.months).toBe(6);
    expect(t.cash.runUp.value).toBe(40000);
    expect(t.cash.value).toBe(153646 + 40000);
    expect(t.cash.breakdown[0].label).toContain('Run-up: 6 months');
    const capped = targetHoldings({ ...doc, assumptions: { bridgeCash: 20000 } }, { today: new Date(Date.UTC(2026, 9, 6)) });
    expect(capped.cash.runUp.value).toBe(20000);
    const running = targetHoldings(doc, { today: new Date(Date.UTC(2027, 4, 6)) });
    expect(running.cash.runUp.value).toBe(0);
  });
});

describe('the run-up uses the actual monthly draw and the cash target has a plain breakdown (6.13.3)', () => {
  it('£7,000 a month when the Decision tool knows it; rows for the run-up and each cash year', async () => {
    const { targetHoldings } = await import('../src/services/TransitionPlanner.js');
    const doc = { timing: { firstTaxYear: 2027 }, assumptions: { bridgeCash: 50000 }, timeline: [{ y: 0, taxYear: '2027/28', gross: 83650, sp: 0, other: 3650 }, { y: 1, taxYear: '2028/29', gross: 83650, sp: 0, other: 3650, lump: 80000 }],
      strategy: { contract: true, r: { plan: { firstTaxYear: 2027, cash: 203646, cashYears: [{ Y: 2027, cost: 80000 }, { Y: 2028, cost: 0 }, { Y: 2029, cost: 73646 }], orders: [] } } } };
    const t = targetHoldings(doc, { today: new Date(Date.UTC(2026, 9, 6)), runUpMonthly: 7000 });
    expect(t.cash.runUp.monthly).toBe(7000);
    expect(t.cash.runUp.value).toBe(42000);
    expect(t.cash.breakdown.map((b) => b.amount)).toEqual([42000, 80000, 0, 73646]);
    expect(t.cash.breakdown[2].label).toContain('paid by a lump sum');
    expect(t.cash.label).toBe('Money-market fund / cash (e.g. CSH2)');
  });
});
