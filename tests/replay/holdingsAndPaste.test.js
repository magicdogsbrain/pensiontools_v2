/**
 * Bug replays — what you hold: the holdings record, the paste matcher, and the rule that the Stress tester's
 * "funds to test" are never read as holdings. Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { parsePaste, matchRows, mergeLedger } from '../../src/services/HoldingsPaste.js';
import { tagPortfolio } from '../../src/services/PortfolioTagger.js';
import { potAtAge, sweepRetirementAges, NO_POT_MESSAGE } from '../../src/services/RetireSweep.js';
import { buildAccumulationPath } from '../../src/services/PlanDocument.js';
import { deriveTiming } from '../../src/services/PlanTiming.js';
import { normaliseHoldings } from '../../src/services/HoldingsRecord.js';
import { hasUndefined, SEPT_2026 } from './_replay.js';

const orders = [
  { name: 'Index-linked Treasury 0⅛% 2029', tidm: 'TR29', sedol: 'B3D4RD5', matures: '2029-03-22', nominal: 36000, cost: 39690 },
  { name: 'Index-linked Treasury 0⅛% 2031', tidm: 'TR31', sedol: 'B3Y1JG8', matures: '2031-08-10', nominal: 35000, cost: 38584 }
];

describe('pasting a statement', () => {
  it('P6a — a merged paste never leaves an empty field the database refuses ("Failed to save stress data")', () => {
    // The retrospective adopter's paste: three rungs, a money-market fund and a world tracker, merged onto a ledger
    // that already holds a hand-typed line with no units and no sub-class.
    const paste = `Investment,Units,Price,Value
"Treasury 0.125% I/L 22/03/2029",36000,110.25,"£39,690.00"
"Treasury 0.125% I/L 10/08/2031",35000,108.90,"£38,584.00"
"Lyxor Smart Overnight Return UCITS ETF",1750,100.78,"£176,376.00"
"Vanguard FTSE All-World UCITS ETF",500,105.20,"£52,600.00"
"Some Fund Nobody Has Heard Of",10,1.00,"£10.00"`;
    const ledger = [{ ticker: 'VWRP', value: 40000, wrapper: 'SIPP' }];
    const r = mergeLedger(ledger, matchRows(parsePaste(paste).rows, { orders, wrapper: 'SIPP' }), { wrapper: 'SIPP' });
    expect(r.ledger.length).toBeGreaterThanOrEqual(4);
    expect(hasUndefined(r.ledger)).toBe(false);
    expect(hasUndefined(r.added)).toBe(false);
    expect(hasUndefined(r.updated)).toBe(false);
  });

  it('P6b — a gilt known only by its name is matched to its rung by maturity year', () => {
    const m = matchRows(parsePaste(`Investment,Units,Value\n"Treasury 0.125% I/L 10/08/2031",35000,"£38,584.00"`).rows, { orders, wrapper: 'SIPP' });
    expect(m[0].match).toMatchObject({ kind: 'gilt', ticker: 'TR31' });
  });

  it('R6.12.5-c — a stray code in the ticker column ("CGT", "PNL") cannot tag a line as a fund whose name it does not share', () => {
    const m = matchRows([
      { ticker: 'CGT', name: '0 1/8% Index-linked Treasury Gilt 2031', value: 20000 },     // a statement's "CGT" column heading
      { ticker: 'PNL', name: 'Vanguard FTSE All-World UCITS ETF Acc', value: 10000 },      // "P&L"
      { ticker: 'CGT', name: 'Capital Gearing Trust', value: 5000 }                        // the real thing still matches
    ]);
    expect(m[0].match.kind).toBe('gilt');                          // not Capital Gearing Trust
    expect(m[0].match.name).not.toMatch(/Capital Gearing/);
    expect(m[0].match.subClass).toBe('indexLinked');
    expect(m[1].match.ticker).toBe('VWRP');                        // not Personal Assets
    expect(m[1].match.name).toMatch(/All-World/);
    expect(m[2].match.ticker).toBe('CGT');
  });

  // TODO(live finding, 30 Sep 2026 — not fixed here, src is out of this step's scope): the 6.12.5 fix stops the stray
  // code choosing the FUND, but a gilt matched by name alone (no rung for its year on the order sheet, or no order sheet)
  // still KEEPS the stray code as its ticker: matchRows' name-only branch is `ticker: r.ticker || 'T' + yy`
  // (src/services/HoldingsPaste.js). Two consequences, both reproduced:
  //   1. the saved line reads ticker "CGT", name "0 1/8% Index-linked Treasury Gilt 2031" — the owner's "it thinks I
  //      have CGT" survives on the What-you-hold card;
  //   2. pasted beside a real Capital Gearing Trust line, mergeLedger keys both on SIPP+CGT and folds them into ONE
  //      line: { ticker: 'CGT', name: 'Capital Gearing Trust', value: 5000, units: 18000, kind: 'gilt' } — the gilt's
  //      £20,000 is gone and the trust is marked a gilt with the gilt's units.
  it.skip('R6.12.5-c (LIVE) — a gilt matched by name alone does not keep the stray code as its ticker, and never merges with the real fund', () => {
    const m = matchRows([
      { ticker: 'CGT', name: '0 1/8% Index-linked Treasury Gilt 2031', value: 20000, units: 18000 },
      { ticker: 'CGT', name: 'Capital Gearing Trust', value: 5000 }
    ]);
    expect(m[0].match.ticker).not.toBe('CGT');
    const ledger = mergeLedger([], m, { wrapper: 'SIPP' }).ledger;
    expect(ledger.length).toBe(2);
    expect(ledger.reduce((t, l) => t + l.value, 0)).toBe(25000);
  });
});

describe('multi-asset funds', () => {
  it('R6.7.0 — a LifeStrategy 80 counts as 80% shares and 20% bonds, not as one asset class', () => {
    const t = tagPortfolio([{ ticker: 'VLS80', value: 100000, wrapper: 'SIPP' }]);
    expect(Math.round(t.buckets.shares)).toBe(80000);
    expect(Math.round(t.buckets.bonds)).toBe(20000);
  });
});

describe('the Stress tester\'s fund list is never what you hold (the owner\'s ruling, 16 September 2026)', () => {
  // The owner's own case: five test lines typed while the plan was still an experiment.
  const settings = {
    currentAge: 50, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60, duration: 35, shapeAgeNow: 60,
    taggedFunds: [{ ticker: 'PACW', value: 600000, wrapper: 'SIPP' }, { ticker: 'CGT', value: 240000, wrapper: 'SIPP' }, { ticker: 'PNL', value: 240000, wrapper: 'SIPP' }],
    equityMin: 800000, bondMin: 0, cashTarget: 0, isaBalance: 0, baseSalary: 40000, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }],
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', spStartDate: '10 September 2043', spWeeklyAmount: 230, strategyId: 'pots-and-valves', strategyParams: {}
  };
  const accumulation = { netMonthly: 1200, salary: 60000, schemeType: 'ras', employerMonthly: 375 };

  it('R6.13.0-a — "When could I retire?" has no pot until one is recorded; it never spins on the tested funds', () => {
    expect(potAtAge({ settings, accumulation, currentAge: 50, age: 60 })).toMatchObject({ potNow: null, pot: null });
    const r = sweepRetirementAges({ settings, accumulation, ages: [57], mcRuns: 10, stride: 24, now: SEPT_2026 });
    expect(r.error).toBe(NO_POT_MESSAGE);
    const real = { lines: [{ ticker: 'VWRP', value: 400000, wrapper: 'SIPP' }] };
    expect(potAtAge({ settings, accumulation, holdings: real, currentAge: 50, age: 60 }).potNow).toBe(400000);   // not £1,080,000
  });

  it('R6.13.0-a — the saver\'s locked path starts from the recorded pot, or from nothing', () => {
    const none = buildAccumulationPath({ settings, timing: deriveTiming(settings, SEPT_2026), accumulation });
    expect(none.potNow).toBeNull();
    expect(none.path).toEqual([]);
  });

  it('R6.13.1 — what you hold starts empty: nothing is seeded from anywhere', () => {
    expect(normaliseHoldings(undefined).lines).toEqual([]);
    expect(normaliseHoldings(null).source).toBe('none');
  });
});
