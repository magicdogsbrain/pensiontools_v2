/**
 * Bug replays — the Transition tab: what to hold against the locked plan, and the words around it.
 * Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { targetHoldings, diffHoldings, sequence, progress } from '../../src/services/TransitionPlanner.js';
import { transitionHtml, holdingsCardHtml } from '../../src/ui/components/TransitionView.js';
import { at, SEPT_2026 } from './_replay.js';

// A three-rung ladder whose year 0 is 2027/28: cash years 2027 and 2028, rungs for 2029, 2030, 2031–32.
const ladderDoc = {
  timing: { firstTaxYear: 2027, shapeAgeNow: 57, startMonth: '2027-04', mode: 'retired' },
  strategy: { id: 'full-il-gilt', contract: true, params: {}, r: { plan: {
    firstTaxYear: 2027, cash: 60000, cashYears: [{ Y: 2027 }, { Y: 2028 }],
    orders: [
      { name: 'IL Treasury 2029', tidm: 'TR29', sedol: 'B3D4RD5', matures: '2029-03-22', pays: 40000, nominal: 36000, cleanPrice: 105, indexRatio: 1.05, cost: 39690, taxYears: [2029] },
      { name: 'IL Treasury 2030', tidm: 'TR30', sedol: 'B4PTCY7', matures: '2030-03-22', pays: 40000, nominal: 35000, cleanPrice: 104, indexRatio: 1.06, cost: 38584, taxYears: [2030] },
      { name: 'IL Treasury 2032', tidm: 'TR32', sedol: 'B7Z5M15', matures: '2032-03-22', pays: 40000, nominal: 33000, cleanPrice: 103, indexRatio: 1.10, cost: 37389, taxYears: [2031, 2032] }
    ] } } },
  pots: { sipp: 200000, isaPolicy: 'hold' }
};
const emptyRecord = { version: 1, updatedAt: null, source: 'none', offerDismissed: false, lines: [] };
const line = (o) => ({ wrapper: 'SIPP', ticker: null, name: null, sedol: null, units: null, value: null, ocf: null, contribution: null, subClass: null, kind: null, asOf: null, ...o });

/** The page as the shell builds it. */
function page(doc, holdings, { today = SEPT_2026, stage, offer = null } = {}) {
  const target = targetHoldings(doc, { today });
  const diff = diffHoldings(holdings.lines, target);
  const seq = sequence(diff, { today, startYear: 2027, startMonth: stage.startMonth, contributionsMonthly: 0 });
  return transitionHtml({ stage, doc, target, diff, seq, prog: progress(diff, {}), done: {}, holdings, offer, rotation: null, startLabel: stage.startLabel });
}

describe('what counts as a rung to hold', () => {
  it('P8a — a gilt that pays nothing (a lump sum covers its years) is not a target', () => {
    const doc = { strategy: { contract: true, r: { plan: { cash: 30000, cashYears: [{ Y: 2027 }], orders: [
      { name: 'IL 2029', tidm: 'T29', nominal: 18200, cost: 31507, pays: 32000, taxYears: [2030, 2031] },
      { name: 'IL 2031', tidm: 'TR31', nominal: 0, cost: 0, pays: 0, taxYears: [2032] },
      { name: 'IL 2033', tidm: 'TR33', nominal: 0, cost: 20, pays: 0, taxYears: [2033] }       // the "£0 with a £20 fee" row
    ] } } } };
    const t = targetHoldings(doc, { today: SEPT_2026 });
    expect(t.lines.filter((l) => l.kind === 'gilt').map((l) => l.ticker)).toEqual(['T29']);
    expect(diffHoldings([], t).buy.some((b) => b.ticker === 'TR31' || b.ticker === 'TR33')).toBe(false);
  });

  it('P6b — a pasted gilt whose code had to be guessed (T30) or that has only a name still matches its rung', () => {
    const t = targetHoldings(ladderDoc, { today: SEPT_2026 });
    const d = diffHoldings([
      { ticker: 'T30', name: '0 1/8% Index-linked Treasury Gilt 2030', units: 35000, value: 38584, wrapper: 'SIPP' },
      { ticker: '', name: 'Treasury 0.125% I/L 22/03/2029', units: 36000, value: 39690, wrapper: 'SIPP', kind: 'gilt' }
    ], t);
    expect(d.hold.map((h) => h.ticker).sort()).toEqual(['TR29', 'TR30']);      // held, not "sell T30 and buy TR30"
    expect(d.sell.filter((s) => s.kind === 'gilt')).toEqual([]);
    expect(d.buy.map((b) => b.ticker)).not.toContain('TR30');
  });
});

describe('the schedule\'s deadline', () => {
  const d = diffHoldings([{ ticker: 'VWRP', value: 150000, wrapper: 'SIPP' }], targetHoldings(ladderDoc, { today: SEPT_2026 }));

  it('P6c — a plan that is already running reconciles over six months; it never has "1 month to go"', () => {
    const s = sequence(d, { today: at(2026, 9, 11), startYear: 2026, contributionsMonthly: 0 });
    expect(s.startPassed).toBe(true);
    expect(s.months).toBe(6);
  });

  it('P3 — a future retiree\'s deadline is the retirement month (13 months), not 6 April (7)', () => {
    const s = sequence(d, { today: at(2026, 9, 11), startYear: 2027, startMonth: '2027-10', contributionsMonthly: 0 });
    expect(s.startPassed).toBe(false);
    expect(s.months).toBe(13);
  });
});

describe('cash to hold before the ladder starts paying', () => {
  // A plan stored the old way: £24,000 of extra cash beside its cash years, first step £46,000 less a £5,200 DB. Read on
  // 6 October 2026: six months to its 6 April 2027 start.
  const doc = { timing: { firstTaxYear: 2027 }, assumptions: { bridgeCash: 24000 }, timeline: [{ y: 0, taxYear: '2027/28', gross: 46000, sp: 0, other: 5200 }],
    strategy: { contract: true, r: { plan: { firstTaxYear: 2027, cash: 142000, cashYears: [{ Y: 2027, cost: 46000 }, { Y: 2028, cost: 0 }, { Y: 2029, cost: 72000 }], orders: [] } } } };
  const october = new Date(Date.UTC(2026, 9, 6));

  it('R6.13.2 / 7.4.2 — the target is the cash years\' money alone: the extra cash and the months to the start are no target', () => {
    const t = targetHoldings(doc, { today: october });
    expect('runUp' in t.cash).toBe(false);
    expect(t.cash.value).toBe(118000);
    expect(t.cash.breakdown.map((b) => b.amount)).toEqual([46000, 0, 72000]);
    expect(targetHoldings(doc, { today: new Date(Date.UTC(2027, 4, 6)) }).cash.value).toBe(118000);   // running: the years still ahead
  });
});

describe('the words on the page', () => {
  const retired = { key: 'running', startLabel: '2027/28', firstTaxYear: 2027, startMonth: '2027-04', monthsToStart: 7 };
  const held = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ ticker: 'VWRP', value: 150000 })] };

  it('R6.12.5-b — someone already retired is told so; nothing reads as a retirement date', () => {
    const html = page(ladderDoc, held, { stage: retired });
    // 7.3.3: no words at all for months before the plan (nobody retired has them): the plan's to-do, the move of its start,
    // is said by the next-step banner — and still nothing reads as a retirement date
    expect(html).not.toMatch(/SIPP cash|run[\s-]?up|set aside|before the plan|retirement date/i);
    expect(html).not.toMatch(/plan starts 2027\/28/);              // R6.13.3: "the ladder's first tax year is", not "plan starts"
  });

  it('R6.13.1 — the page never offers the Stress tester\'s fund list as what you hold, not even as a question', () => {
    const draft = { key: 'draft-retired', startLabel: '2027/28', firstTaxYear: 2027, startMonth: '2027-04' };
    const offer = { lines: [line({ ticker: 'PACW', value: 600000 })], count: 1 };
    for (const html of [holdingsCardHtml({ holdings: emptyRecord, offer }), page(ladderDoc, emptyRecord, { stage: draft, offer })]) {
      expect(html).not.toMatch(/actually hold\?/i);
      expect(html).not.toContain('PACW');
    }
  });
});
