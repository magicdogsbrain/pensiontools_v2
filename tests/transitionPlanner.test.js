import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { targetHoldings, ledgerView, diffHoldings, sequence, progress, isGiltTicker } from '../src/services/TransitionPlanner.js';

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
    const t = targetHoldings(ladderDoc);
    expect(t.kind).toBe('ladder');
    expect(t.lines.map((l) => l.ticker)).toEqual(['TR29', 'TR30', 'TR32']);
    expect(t.lines[0].units).toBe(36000);
    expect(t.cash.value).toBe(60000);
    expect(t.cash.label).toContain('2027/28');
  });
  it('a pot plan targets the year-0 mix in pounds', () => {
    const t = targetHoldings(potDoc);
    expect(t.kind).toBe('buckets');
    expect(t.lines.map((l) => l.value)).toEqual([200000, 160000, 40000]);
  });
  it('no document → nothing', () => { expect(targetHoldings(null).kind).toBe('none'); });
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
    const d = diffHoldings([], targetHoldings(ladderDoc));
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
    const d = diffHoldings(ledger, targetHoldings(ladderDoc));
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
    const d = diffHoldings(ledger, targetHoldings(ladderDoc));
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
  it('a rung within 2% counts as held', () => {
    const d = diffHoldings([{ ticker: 'TR29', units: 35500, value: 39000, wrapper: 'SIPP' }], targetHoldings(ladderDoc));
    expect(d.hold.some((h) => h.ticker === 'TR29')).toBe(true);
  });
});

describe('diffHoldings — buckets', () => {
  it('rebalances by bucket in pounds', () => {
    const d = diffHoldings([{ ticker: 'VWRP', value: 320000, wrapper: 'SIPP' }, { ticker: 'IGLT', value: 60000, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 20000, wrapper: 'SIPP' }], targetHoldings(potDoc));
    expect(d.sell.find((s) => s.bucket === 'shares').amount).toBe(120000);
    expect(d.buy.find((b) => b.bucket === 'bonds').amount).toBe(100000);
    expect(d.buy.find((b) => b.bucket === 'cash').amount).toBe(20000);
  });
});

describe('sequence and progress', () => {
  const ledger = [{ ticker: 'VWRP', value: 150000, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 10000, wrapper: 'SIPP' }];
  const d = diffHoldings(ledger, targetHoldings(ladderDoc));
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
