/**
 * The bands and the three fixes to the move (7.10.0; spec-7100 §3.1, §3.2; services/TransitionPlanner.js). Every example is
 * fictional (Alex). No corpus plan holds diversifiers or a multi-asset fund, so the cases are made here.
 *
 *   - a pot plan's buckets are read on the pension money in play today, within 5% of it (MOVE_BAND); a rung keeps 2%;
 *   - a multi-asset fund is read in its parts (a LifeStrategy 60 is 60% shares, 40% bonds), never as 100% shares;
 *   - the diversifiers the plan was tested on are a target; held ones with none in the plan are compared with nothing under
 *     the band — never sold inside it;
 *   - a line nothing places is named (`unknown`) and left out of the money in play; nothing readable in the pension reads as
 *     no pension record: never complete, no share held, no drift;
 *   - driftOf: points per bucket on a pot plan, the rungs on a ladder; moveInputs' `fromSettings` on an unlocked plan, and
 *     every other caller as before.
 */
import { describe, it, expect } from 'vitest';
import { targetHoldings, diffHoldings, ledgerView, driftOf, MOVE_BAND, DRIFT_BAND, RUNG_TOLERANCE, BUCKET_KEYS } from '../../../src/services/TransitionPlanner.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { heldPotsOf } from '../../../src/services/PlanClose.js';
import { keptAssetsOf, heldSettingsOf } from '../../../src/answers/plan/keepTest.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { MOVE } from '../../../src/v7/copy/move.js';
import { bannedHits } from '../render/checkScreen.js';
import { corpus, entryOf, entriesAt, noon, DATES, TODAY } from './_plans.js';

const C = corpus();
const NOW = new Date(2026, 9, 2, 12);
const copy = (v) => JSON.parse(JSON.stringify(v));
// Alex's pension, as a platform lists it: a LifeStrategy 60, gold, a world tracker
const ALEX = [
  { wrapper: 'SIPP', ticker: 'VLS60', name: 'Vanguard LifeStrategy 60% Equity', value: 100000 },
  { wrapper: 'SIPP', ticker: 'SGLN', name: 'iShares Physical Gold', value: 10000 },
  { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', value: 50000 }
];
/** A pot plan's document: the year-0 mix and the allocation it was tested on (diversifiers or none). */
const potDoc = (mix, allocation = {}, sipp = 1000000) => ({ strategy: { contract: false }, targetMix: [{ y: 0, ...mix }], pots: { sipp, allocation } });
const target = (doc) => targetHoldings(doc, { today: NOW });
const line = (d, key) => [...d.buy.map((x) => ['buy', x]), ...d.sell.map((x) => ['sell', x]), ...d.hold.map((x) => ['hold', x])].find(([, x]) => x.key === key) || [null, null];

describe('the constants', () => {
  it('a bucket within 5% of the pension; the drift line from 10 points; a rung within 2% of what it needs', () => {
    expect(MOVE_BAND).toBe(0.05);
    expect(DRIFT_BAND).toBe(0.10);
    expect(RUNG_TOLERANCE).toBe(0.02);
    expect(BUCKET_KEYS).toEqual(['shares', 'bonds', 'diversifiers', 'cash']);
  });
});

describe('a multi-asset fund in its parts (fix 3)', () => {
  it('the ledger reads a LifeStrategy 60 as 60% shares and 40% bonds, line by line — never matched by value', () => {
    const rows = ledgerView(ALEX);
    expect(rows.map((r) => [r.ticker, r.bucket])).toEqual([['VLS60', 'shares'], ['SGLN', 'diversifiers'], ['VWRP', 'shares']]);
    expect(rows[0].split).toEqual({ shares: 0.6, bonds: 0.4, diversifiers: 0, cash: 0 });
    expect(rows[1].split).toEqual({ shares: 0, bonds: 0, diversifiers: 1, cash: 0 });
    // the same fund twice, at two values: each line its own split
    expect(ledgerView([ALEX[0], { ...ALEX[0], value: 3 }]).map((r) => r.split.bonds)).toEqual([0.4, 0.4]);
    // a gilt is bonds, money-market cash is cash, a line nothing places has no split
    expect(ledgerView([{ wrapper: 'SIPP', ticker: 'TR31', value: 1000, kind: 'gilt' }, { wrapper: 'SIPP', ticker: 'CSH2', value: 500 }, { wrapper: 'SIPP', ticker: 'ZZQ9', name: 'Acme workplace default fund', value: 700 }]).map((r) => [r.bucket, r.split])).toEqual([
      ['bonds', { shares: 0, bonds: 1, diversifiers: 0, cash: 0 }], ['cash', { shares: 0, bonds: 0, diversifiers: 0, cash: 1 }], [null, null]]);
  });
  it('Alex against a 60/40 plan with no diversifiers: 110k shares and 40k bonds held, the gold compared with nothing under the band', () => {
    const d = diffHoldings(ALEX, target(potDoc({ equity: 60, bond: 40, cash: 0 })));
    expect(d.inPlay).toBe(160000);
    expect(d.buckets).toEqual({ shares: { held: 110000, target: 96000 }, bonds: { held: 40000, target: 64000 }, diversifiers: { held: 10000, target: 0 }, cash: { held: 0, target: 0 } });
    // 8,000 is 5% of 160,000: shares 14,000 over and bonds 24,000 short are moves; the gold (10,000) is beyond the band
    expect(line(d, 'bucket:shares')).toEqual(['sell', expect.objectContaining({ amount: 14000 })]);
    expect(line(d, 'bucket:bonds')).toEqual(['buy', expect.objectContaining({ amount: 24000 })]);
    expect(line(d, 'bucket:diversifiers')).toEqual(['sell', expect.objectContaining({ amount: 10000, why: 'not in the target mix' })]);
    // gold within the band (5,000 of 155,000 is inside 7,750): no sale
    const less = diffHoldings([ALEX[0], { ...ALEX[1], value: 5000 }, ALEX[2]], target(potDoc({ equity: 60, bond: 40, cash: 0 })));
    expect(line(less, 'bucket:diversifiers')[0]).toBe(null);
  });
  it('the plan\'s pots in a multi-asset fund too: closing a plan reads its pension in the fund\'s parts', () => {
    const plan = { holdings: { lines: ALEX, updatedAt: '2026-10-01' } };
    expect(heldPotsOf(plan).split).toEqual({ equity: 110000, bond: 40000, cash: 0, div: 10000 });
  });
  it('a multi-asset fund kept by choice re-describes each bucket it holds in the test as held', () => {
    const rec = { lines: [{ ...ALEX[0], keep: { as: 'mine', fundsGaps: true } }, ALEX[2]] };
    const [k] = keptAssetsOf(rec);
    expect(k).toMatchObject({ bucket: 'shares', split: { shares: 0.6, bonds: 0.4, diversifiers: 0, cash: 0 }, counted: true, single: false });
    const s = heldSettingsOf({ equityMin: 300000, bondMin: 300000, cashTarget: 0, diversifierStart: 0 }, rec, { now: NOW, withExpected: false });
    // 100k of 150k kept: two thirds of the 600k re-described as the fund's 60/40, the rest in the plan's own 50/50
    expect([s.equityMin, s.bondMin]).toEqual([Math.round(600000 * (2 / 3) * 0.6 + 600000 * (1 / 3) * 0.5), Math.round(600000 * (2 / 3) * 0.4 + 600000 * (1 / 3) * 0.5)]);
  });
});

describe('the plan\'s diversifiers are a target (fix 2)', () => {
  const doc = potDoc({ equity: 60, bond: 30, cash: 10 }, { equityMin: 540000, bondMin: 270000, cashTarget: 90000, diversifierStart: 100000 });
  it('targetHoldings adds the diversifiers the plan was tested on, beside the mix of the rest; a plan with none reads as before', () => {
    const t = target(doc);
    expect(t.lines.map((l) => [l.bucket, l.value, l.pct])).toEqual([['shares', 540000, 54], ['bonds', 270000, 27], ['cash', 90000, 9], ['diversifiers', 100000, 10]]);
    expect(target(potDoc({ equity: 50, bond: 40, cash: 10 }, { equityMin: 500000, bondMin: 400000, cashTarget: 100000, diversifierStart: 0 }, 400000)).lines.map((l) => [l.bucket, l.value, l.pct])).toEqual([['shares', 200000, 50], ['bonds', 160000, 40], ['cash', 40000, 10]]);
  });
  it('Alex\'s gold inside the band of the plan\'s diversifiers is held, never sold', () => {
    const d = diffHoldings(ALEX, target(doc));
    // 160,000 in play: shares 86,400, bonds 43,200, cash 14,400, diversifiers 16,000; the band is 8,000
    expect(d.buckets.diversifiers).toEqual({ held: 10000, target: 16000 });
    expect(line(d, 'bucket:diversifiers')[0]).toBe('hold');
    expect(line(d, 'bucket:bonds')[0]).toBe('hold');
    expect(line(d, 'bucket:shares')).toEqual(['sell', expect.objectContaining({ amount: 23600 })]);
    expect(line(d, 'bucket:cash')).toEqual(['buy', expect.objectContaining({ amount: 14400 })]);
    expect(d.sell.filter((x) => x.bucket === 'diversifiers')).toEqual([]);
  });
});

describe('today\'s pot and the band (fix 1)', () => {
  it('the targets are the plan\'s mix on the pension in play today, whatever pot the plan was locked with', () => {
    const big = diffHoldings(ALEX, target(potDoc({ equity: 60, bond: 40, cash: 0 }, {}, 900000)));
    const small = diffHoldings(ALEX, target(potDoc({ equity: 60, bond: 40, cash: 0 }, {}, 120000)));
    expect(big.buckets).toEqual(small.buckets);
    expect(big.buy.map((x) => [x.key, x.amount])).toEqual(small.buy.map((x) => [x.key, x.amount]));
  });
  it('a bucket within 5% of the pension is held; just beyond it, a move', () => {
    const t = target(potDoc({ equity: 50, bond: 50, cash: 0 }));
    const at = (shares) => diffHoldings([{ wrapper: 'SIPP', ticker: 'VWRP', value: shares }, { wrapper: 'SIPP', ticker: 'IGLT', value: 200000 - shares }], t);
    expect(at(110000)).toMatchObject({ complete: true, reason: 'every bucket is within 5% of the pension of its target' });   // 10,000 = 5% of 200,000
    expect(at(110001).complete).toBe(false);
    expect(at(110001).sell.map((x) => x.key)).toEqual(['bucket:shares']);
  });
  it('with no record at all the plan\'s own pot stays the target, as before (nothing held, nothing read)', () => {
    const d = diffHoldings([], target(potDoc({ equity: 50, bond: 40, cash: 10 }, {}, 400000)));
    expect(d.kind).toBe('buckets');
    expect(d.buy.map((x) => [x.key, x.amount])).toEqual([['bucket:shares', 200000], ['bucket:bonds', 160000], ['bucket:cash', 40000]]);
    expect(d.inPlay).toBe(0);
    expect(driftOf(d)).toBe(null);
  });
});

describe('a line nothing places, and nothing readable (fix 3, inPlay <= 0)', () => {
  const t = target(potDoc({ equity: 60, bond: 40, cash: 0 }));
  it('a line nothing places is named and left out of the money in play', () => {
    const acme = { wrapper: 'SIPP', ticker: 'ZZQ9', name: 'Acme workplace default fund', value: 40000 };
    const d = diffHoldings([...ALEX, acme], t);
    expect(d.unknown.map((u) => u.label)).toEqual(['Acme workplace default fund']);
    expect(d.inPlay).toBe(160000);
    expect(d.buckets).toEqual(diffHoldings(ALEX, t).buckets);
  });
  it('a record whose only pension line is unplaced reads as no pension record: never complete, no share held, no drift', () => {
    const d = diffHoldings([{ wrapper: 'SIPP', ticker: 'ZZQ9', name: 'Acme workplace default fund', value: 40000 }, { wrapper: 'ISA', ticker: 'VWRP', value: 20000 }], t);
    expect(d).toMatchObject({ kind: 'none', complete: false, progressPct: null, inPlay: 0, buy: [], sell: [], hold: [] });
    expect(d.unknown.map((u) => u.label)).toEqual(['Acme workplace default fund']);
    expect(driftOf(d)).toBe(null);
    // a record with no pension line at all reads the same
    expect(diffHoldings([{ wrapper: 'ISA', ticker: 'VWRP', value: 20000 }], t)).toMatchObject({ kind: 'none', complete: false, progressPct: null });
  });
  it('the move page says so, in words that pass the banned list, and draws nothing else', () => {
    const raw = copy(C['04-buckets-running']);
    raw.holdings = { ...raw.holdings, lines: [{ wrapper: 'SIPP', ticker: 'ZZQ9', name: 'Acme workplace default fund', value: 400000 }] };
    const v = moveOf([entryOf(raw)], raw.id, { today: TODAY });
    expect(v).toMatchObject({ found: true, hasDocument: true, kind: 'none', unread: true, unknown: ['Acme workplace default fund'] });
    expect(bannedHits(MOVE.unread, ['all', 'record', 'retired', 'saver'])).toEqual([]);
  });
});

describe('driftOf', () => {
  it('a pot plan: points per bucket of the pension in play, and the largest', () => {
    const d = diffHoldings(ALEX, target(potDoc({ equity: 60, bond: 40, cash: 0 })));
    // shares 110 against 96, bonds 40 against 64, gold 10 against 0, of 160
    expect(driftOf(d)).toEqual({ kind: 'buckets', drift: { shares: 9, bonds: -15, cash: 0, diversifiers: 6 }, maxDrift: 15 });
  });
  it('a ladder: never points; the rungs held of those needed and a gap this tax year or next', () => {
    const ladderDoc = {
      strategy: { contract: true, r: { plan: { cash: 0, cashYears: [], orders: [
        { name: 'IL Treasury 2027', tidm: 'TR27', matures: '2027-11-22', pays: 40000, nominal: 36000, cleanPrice: 105, indexRatio: 1.05, cost: 39690, taxYears: [2027] },
        { name: 'IL Treasury 2030', tidm: 'TR30', matures: '2030-03-22', pays: 40000, nominal: 35000, cleanPrice: 104, indexRatio: 1.06, cost: 38584, taxYears: [2030] }
      ] } } },
      pots: { sipp: 100000, isaPolicy: 'hold' }
    };
    const t = target(ladderDoc);
    const none = diffHoldings([], t);
    expect(driftOf(none)).toEqual({ kind: 'ladder', drift: null, maxDrift: null, rungs: { held: 0, needed: 2 }, gapSoon: true });
    const near = diffHoldings([{ wrapper: 'SIPP', ticker: 'TR27', units: 36000, value: 39690, kind: 'gilt' }], t);
    expect(driftOf(near)).toEqual({ kind: 'ladder', drift: null, maxDrift: null, rungs: { held: 1, needed: 2 }, gapSoon: false });
  });
  it('nothing to read: no diff, no document, nothing in the pension', () => {
    expect(driftOf(null)).toBe(null);
    expect(driftOf(diffHoldings([], targetHoldings(null)))).toBe(null);
  });
  for (const today of DATES) {
    it(`the corpus at ${today}: 04 holds its mix (0 points), 05 is 22 points over in shares; the ladders are read by their rungs`, () => {
      const at = (name) => driftOf(moveInputs(entriesAt(today).find((e) => e.plan.id === C[name].id).plan, { now: noon(today) }).diff);
      expect(at('04-buckets-running').maxDrift).toBe(0);
      expect(at('05-saver-committed')).toMatchObject({ kind: 'buckets', maxDrift: 22 });
      for (const name of ['03-gilt-ladder-locked', '13-stopped-drawing-since', '20-locked-start-after-stop']) expect(at(name)).toMatchObject({ kind: 'ladder', drift: null, maxDrift: null });
    });
  }
});

describe('moveInputs({ fromSettings }): an unlocked plan read against its own settings, in memory only', () => {
  it('a pot plan with no document: the settings\' year-0 mix on the pension in play; never stored, and null without the flag', () => {
    const raw = copy(C['02-pnv-draft']);
    raw.holdings = { lines: ALEX, updatedAt: '2026-10-01' };
    const plan = entryOf(raw).plan;
    const before = JSON.stringify(plan);
    expect(moveInputs(plan, { now: NOW })).toBe(null);
    const m = moveInputs(plan, { now: NOW, fromSettings: true });
    expect(m.fromSettings).toBe(true);
    expect(m.target.kind).toBe('buckets');
    expect(m.diff.inPlay).toBe(160000);
    // 02 is tested on 420k : 210k : 70k (60% : 30% : 10%)
    expect(m.diff.buckets).toMatchObject({ shares: { held: 110000, target: 96000 }, bonds: { held: 40000, target: 48000 }, cash: { held: 0, target: 16000 } });
    expect(driftOf(m.diff).maxDrift).toBe(10);
    expect(JSON.stringify(plan)).toBe(before);
    expect('planDocument' in plan).toBe(false);
  });
  it('an unlocked ladder has no rungs to read: no target, no drift', () => {
    const plan = entryOf(C['07-pre-6.13-flat-params']).plan;
    const m = moveInputs(plan, { now: NOW, fromSettings: true });
    expect(m).toMatchObject({ fromSettings: true, ladderLater: true, diff: null, prog: null, target: { kind: 'none' } });
    expect(m.target.note).toBe('The ladder\'s years show once the plan is locked.');
  });
  for (const today of DATES) {
    it(`every plan with a document at ${today}: the flag changes nothing`, () => {
      for (const e of entriesAt(today)) {
        if (!e.plan.planDocument) continue;
        expect(moveInputs(e.plan, { now: noon(today), fromSettings: true }), e.plan.id).toEqual(moveInputs(e.plan, { now: noon(today) }));
      }
    });
  }
});
