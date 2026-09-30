/**
 * Bug replay — PROT1: what makes a month count towards protection mode (Pots & Valves).
 *
 * The owner's rule, verbatim (30 September 2026):
 *   "For a month to count in the X number of consecutive months that would switch protection mode on - the
 *    growth pots (i.e. shares plus bonds) must be below their glide paths. That means total shares pot plus total
 *    bonds pot (plus diversifiers etc) - must add up to less than the sum of the glidepaths of the relevant pots."
 * Leaving protection is unchanged: it stays on until the growth pots are back above the sum of their glidepaths
 * plus the recovery buffer. X is consecutiveLimit (3 unless the plan says otherwise).
 *
 * What was wrong up to 6.13.4: the count was of consecutive months whose income was PAID FROM CASH, whatever the
 * growth pots were doing, and the diversifiers sleeve was left out of the comparison. So a plan that had simply
 * been living off its cash bucket with its growth pots on track went into protection in the very first month the
 * growth pots dipped under their glidepaths, and a well-stocked diversifiers sleeve could not keep it out.
 *
 * Two later rulings by the owner (30 September 2026, built for 6.15.0), replayed here as PROT2 and PROT3:
 *   PROT2  "Should the diversifier sleeve's target stay flat in pounds, or rise with inflation like the targets
 *          for shares and bonds?" — "same as shares and bonds". In 6.14.0 the sleeve's glidepath was its starting
 *          value, flat in pounds, for the whole plan. It is now the starting value raised by inflation and run
 *          down in a straight line to nothing at the end of the plan, in both engines.
 *   PROT3  The comparison is made in whole pennies. Sourcing leaves pots sitting exactly on their floors, so
 *          "less than" was regularly asked at equality, and one month was decided by 2.9e-11 of a pound of
 *          rounding error. A month is below when the pots, to the penny, are less than the glidepaths, to the
 *          penny; leaving (above glidepaths + buffer) is judged the same way.
 *
 * Every case is a hand-built run of months through the real engines (the Decision engine with the records it
 * saves; the Stress engine with a hand-written market), and the last two check months by the thousand against
 * the rule written out here in the test, independently of the engine.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { calcDecisionPWA } from '../../src/services/legacyDecision.js';
import { decisionToHistory } from '../../src/models/Decision.js';
import { simulate, simulateTraced, monteCarloReturns } from '../../src/services/SimulationEngine.js';
import { assessProtection, growthVsGlide, diversifierGlidepath, pennies, isBelow } from '../../src/services/ProtectionStrategy.js';
import { calculateGlidepath, equityGlideFromRisk, glideShareForYear } from '../../src/services/GlidepathService.js';
import { buildDecisionContext, aprilDate } from '../crossval/harness.js';

// ---------------------------------------------------------------------------------------------------------
// The Decision engine, month by month, keeping the records the tool would keep.
// Plan year 0 (2026/27): the glidepaths are the entered floors — shares £300,000 + bonds £200,000 = £500,000.
// ---------------------------------------------------------------------------------------------------------
const settings = { baseSalary: 30000, equityMin: 300000, bondMin: 200000, cashTarget: 60000, duration: 30,
  protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, firstTaxYear: 2026 };
const taxYears = { '26/27': { pa: 12570, brl: 50270, hrl: 125140, other: 0, cpi: 0.025, isTaxEfficient: true,
  isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 0 } };
const GLIDE = 500000;
const BELOW = { equity: 290000, bond: 190000, cash: 60000 };        // £480,000: £20,000 under the glidepaths
const ABOVE = { equity: 330000, bond: 200000, cash: 60000 };        // £530,000: over them, and over the exit line
const JUST_ABOVE = { equity: 300500, bond: 200000, cash: 60000 };   // £500 over: too little to pay a month, so cash pays

/** Run April onwards (2026 unless told), one entry per month; returns the engine's answer for each month. */
async function decide(months, s = settings, { year = 2026, allTaxYears = taxYears } = {}) {
  const history = [], out = [];
  for (let i = 0; i < months.length; i++) {
    const m = months[i];
    const date = year + '-' + String(4 + i).padStart(2, '0');
    const d = await calcDecisionPWA(date, m.equity, m.bond, m.cash, {
      settings: s, history, allTaxYears, spInfo: { amount: 0 },
      ...(m.diversifier != null ? { diversifier: m.diversifier } : {})
    });
    // The saved record, as the tool writes it; the sleeve's value is added where the month has one.
    history.push({ ...decisionToHistory(d), ...(m.diversifier != null ? { diversifier: m.diversifier } : {}) });
    out.push(d);
  }
  return out;
}
const prot = (ds) => ds.map((d) => d.inProtection);

describe('PROT1 — the Decision engine counts months with the growth pots below their glidepaths', () => {
  it('PROT1 the glidepaths in plan year 0 are the entered floors (the sequences below stand on this)', async () => {
    const [d] = await decide([ABOVE]);
    expect(d.adjEquityMin + d.adjBondMin).toBe(GLIDE);
  });

  it('PROT1 below for 2 months, then above: no protection — and the count starts again afterwards', async () => {
    const ds = await decide([BELOW, BELOW, ABOVE, BELOW, BELOW]);
    expect(prot(ds)).toEqual([false, false, false, false, false]);
    expect(ds.map((d) => d.belowGlide)).toEqual([true, true, false, true, true]);
    expect(ds.map((d) => d.consecutiveBelowGlide)).toEqual([1, 2, 0, 1, 2]);
  });

  it('PROT1 below for 3 months: protection comes on in month 3, not before', async () => {
    const ds = await decide([BELOW, BELOW, BELOW]);
    expect(prot(ds)).toEqual([false, false, true]);
    expect(ds[2].consecutiveBelowGlide).toBe(3);
  });

  it('PROT1 months paid from cash while the growth pots are ABOVE their glidepaths do not count', async () => {
    // Two months £500 over the glidepaths: the surplus cannot pay a month's income, so cash pays nearly all of
    // it. Then the first month below. The old rule had already counted two "cash draws" and cut in month 3.
    const ds = await decide([JUST_ABOVE, JUST_ABOVE, BELOW, BELOW]);
    expect(ds[0].source).not.toBe('Growth');
    expect(ds[0].drawFromCash).toBeGreaterThan(0.75 * ds[0].sippDraw);
    expect(ds[1].source).not.toBe('Growth');
    expect(ds.slice(0, 2).map((d) => d.belowGlide)).toEqual([false, false]);
    expect(prot(ds)).toEqual([false, false, false, false]);          // months 3 and 4 are the 1st and 2nd below
    const fifth = await decide([JUST_ABOVE, JUST_ABOVE, BELOW, BELOW, BELOW]);
    expect(prot(fifth)).toEqual([false, false, false, false, true]); // the 3rd below: on
  });

  it('PROT1 a growth pot drawn down to exactly its glidepath is ON it, not below it', async () => {
    const onIt = { equity: 300000, bond: 200000, cash: 60000 };
    const ds = await decide([onIt, onIt, onIt, onIt]);
    expect(ds.every((d) => d.source === 'Cash')).toBe(true);         // no surplus: cash pays every month
    expect(prot(ds)).toEqual([false, false, false, false]);
  });

  it('PROT1 leaving is unchanged: on until the growth pots are above the glidepaths plus the recovery buffer', async () => {
    const within = { equity: 310000, bond: 200000, cash: 60000 };    // £10,000 over: inside the £15,000 buffer
    const clear = { equity: 316000, bond: 200000, cash: 60000 };     // £16,000 over: out
    expect(prot(await decide([BELOW, BELOW, BELOW, within, clear]))).toEqual([false, false, true, true, false]);
  });

  it('PROT1 the number of months is the plan\'s own consecutiveLimit', async () => {
    expect(prot(await decide([BELOW, BELOW], { ...settings, consecutiveLimit: 2 }))).toEqual([false, true]);
    expect(prot(await decide([BELOW, BELOW, BELOW, BELOW], { ...settings, consecutiveLimit: 4 }))).toEqual([false, false, false, true]);
  });

  it('PROT1 diversifiers are counted, on both sides: in plan year 0 the sleeve\'s glidepath is its starting value', async () => {
    const withSleeve = { ...settings, diversifierStart: 50000 };     // glidepaths now £500,000 + £50,000
    // Shares + bonds £10,000 under theirs, but the sleeve is £20,000 over its own: together £560,000 v £550,000.
    const carried = { equity: 295000, bond: 195000, cash: 60000, diversifier: 70000 };
    const a = await decide([carried, carried, carried, carried], withSleeve);
    expect(a.map((d) => d.belowGlide)).toEqual([false, false, false, false]);
    expect(prot(a)).toEqual([false, false, false, false]);
    // Shares + bonds £5,000 OVER theirs, but the sleeve has fallen £20,000 under: £535,000 v £550,000.
    const dragged = { equity: 303000, bond: 202000, cash: 60000, diversifier: 30000 };
    const b = await decide([dragged, dragged, dragged], withSleeve);
    expect(b.map((d) => d.belowGlide)).toEqual([true, true, true]);
    expect(prot(b)).toEqual([false, false, true]);
    // The same shares and bonds with the sleeve on its target: above, no protection.
    const level = { ...dragged, diversifier: 50000 };
    expect(prot(await decide([level, level, level], withSleeve))).toEqual([false, false, false]);
  });

  it('PROT1 a plan with a sleeve in its settings but no sleeve value entered this month is not read as "below by the whole sleeve"', async () => {
    // The Decision entry form's Diversifiers box is optional and reads 0 when left alone. Shares + bonds are £5,000
    // over their glidepaths: nothing is below, whatever the settings say the sleeve started at.
    const withSleeve = { ...settings, diversifierStart: 50000 };
    const noEntry = { equity: 303000, bond: 202000, cash: 60000 };             // no diversifier handed in
    const zero = { ...noEntry, diversifier: 0 };                                // the box left at 0
    for (const m of [noEntry, zero]) {
      const ds = await decide([m, m, m, m], withSleeve);
      expect(ds.map((d) => d.belowGlide)).toEqual([false, false, false, false]);
      expect(prot(ds)).toEqual([false, false, false, false]);
    }
  });

  it('PROT1 the saved record carries the month\'s verdict, so a past month with a depleted sleeve still counts', async () => {
    // The record the tool saves (decisionToHistory) does not hold the sleeve's value. Until the verdict was saved
    // with it, a past month was re-judged from shares + bonds alone: here they are £5,000 OVER their glidepaths
    // while the sleeve is £20,000 under, so months 1 and 2 were read back as "not below" and month 3 never cut.
    const withSleeve = { ...settings, diversifierStart: 50000 };
    const months = [30000, 30000, 30000];
    const history = [], out = [];
    for (let i = 0; i < months.length; i++) {
      const d = await calcDecisionPWA('2026-' + String(4 + i).padStart(2, '0'), 303000, 202000, 60000, {
        settings: withSleeve, history, allTaxYears: taxYears, spInfo: { amount: 0 }, diversifier: months[i] });
      const rec = decisionToHistory(d);
      expect(rec.diversifier).toBeUndefined();      // exactly what the tool writes: no sleeve value…
      expect(rec.belowGlide).toBe(true);            // …but the verdict
      history.push(rec); out.push(d);
    }
    expect(prot(out)).toEqual([false, false, true]);
    // And the other way: shares + bonds £10,000 under, the sleeve £20,000 over — never below, never on.
    const h2 = [], o2 = [];
    for (let i = 0; i < 4; i++) {
      const d = await calcDecisionPWA('2026-' + String(4 + i).padStart(2, '0'), 295000, 195000, 60000, {
        settings: withSleeve, history: h2, allTaxYears: taxYears, spInfo: { amount: 0 }, diversifier: 70000 });
      h2.push(decisionToHistory(d)); o2.push(d);
    }
    expect(prot(o2)).toEqual([false, false, false, false]);
  });
});

// ---------------------------------------------------------------------------------------------------------
// The rule itself, as one line of arithmetic both engines call.
// ---------------------------------------------------------------------------------------------------------
describe('PROT1 — the shared rule', () => {
  it('PROT1 growth pots = shares + bonds + diversifiers; glidepaths = the sum of theirs; below means strictly less', () => {
    expect(growthVsGlide({ equity: 100, bond: 50, diversifier: 25, equityGlide: 90, bondGlide: 60, diversifierGlide: 20 }))
      .toEqual({ growth: 175, glide: 170, below: false });
    expect(growthVsGlide({ equity: 100, bond: 50, equityGlide: 90, bondGlide: 60 }).below).toBe(false);   // equal: on it
    expect(growthVsGlide({ equity: 100, bond: 49, equityGlide: 90, bondGlide: 60 }).below).toBe(true);
  });

  it('PROT1 a hand-built run of months: 2 below then above = never on; 3 below = on in the 3rd', () => {
    const run = (growths, glide = 1000) => {
      let before = 0, was = false; const out = [];
      for (const g of growths) {
        was = assessProtection({ totalGrowth: g, minGrowth: glide, consecBelowGlide: before, wasInProtection: was, consecutiveLimit: 3, recoveryBuffer: 100 });
        out.push(was);
        before = g < glide ? before + 1 : 0;
      }
      return out;
    };
    expect(run([900, 900, 1001, 900, 900])).toEqual([false, false, false, false, false]);
    expect(run([900, 900, 900])).toEqual([false, false, true]);
    expect(run([1000, 1000, 1000, 1000, 900])).toEqual([false, false, false, false, false]);   // on the line ≠ below
    expect(run([900, 900, 900, 1050, 1100, 1101])).toEqual([false, false, true, true, true, false]);   // out only above glide + buffer
  });
});

// ---------------------------------------------------------------------------------------------------------
// PROT3 — whole pennies.
// ---------------------------------------------------------------------------------------------------------
describe('PROT3 — the comparison is made in whole pennies', () => {
  it('PROT3 pots that differ from their glidepaths only by rounding error are ON them, not below', () => {
    // 0.1 + 0.2 is 0.30000000000000004 in binary arithmetic: a pot of exactly 0.3 read as "below" it.
    expect(0.3 < 0.1 + 0.2).toBe(true);
    expect(growthVsGlide({ equity: 0.3, bond: 0, equityGlide: 0.1, bondGlide: 0.2 }).below).toBe(false);
    // The size of error that decided a real month: 2.9e-11 of a pound under a £540,000 line.
    expect(growthVsGlide({ equity: 300000, bond: 240000 - 2.9e-11, equityGlide: 300000, bondGlide: 240000 }).below).toBe(false);
    expect(isBelow(540000 - 2.9e-11, 540000)).toBe(false);
    // Under a penny is not below; a whole penny is.
    expect(growthVsGlide({ equity: 300000, bond: 239999.996, equityGlide: 300000, bondGlide: 240000 }).below).toBe(false);
    expect(growthVsGlide({ equity: 300000, bond: 239999.99, equityGlide: 300000, bondGlide: 240000 }).below).toBe(true);
    expect(pennies(1234.565)).toBe(123457);
    expect(pennies(undefined)).toBe(0);
  });

  it('PROT3 entering: three months a fraction of a penny under the line never switch protection on', () => {
    const P = { consecutiveLimit: 3, recoveryBuffer: 15000 };
    expect(assessProtection({ totalGrowth: 500000 - 1e-9, minGrowth: 500000, consecBelowGlide: 2, wasInProtection: false, ...P })).toBe(false);
    expect(assessProtection({ totalGrowth: 499999.99, minGrowth: 500000, consecBelowGlide: 2, wasInProtection: false, ...P })).toBe(true);
  });

  it('PROT3 leaving: out only when above glidepaths + buffer by a whole penny', () => {
    const P = { consecutiveLimit: 3, recoveryBuffer: 15000, consecBelowGlide: 0, wasInProtection: true };
    expect(assessProtection({ totalGrowth: 515000, minGrowth: 500000, ...P })).toBe(true);              // exactly on the exit line: stays
    expect(assessProtection({ totalGrowth: 515000 + 1e-9, minGrowth: 500000, ...P })).toBe(true);       // above it only by rounding error: stays
    expect(assessProtection({ totalGrowth: 515000.004, minGrowth: 500000, ...P })).toBe(true);          // under a penny above: stays
    expect(assessProtection({ totalGrowth: 515000.01, minGrowth: 500000, ...P })).toBe(false);          // a penny above: out
    expect(assessProtection({ totalGrowth: 515000 - 1e-9, minGrowth: 500000, ...P })).toBe(true);
  });

  it('PROT3 the Decision engine: growth pots a tenth of a penny under their glidepaths are on them', async () => {
    const hair = { equity: 300000, bond: 199999.999, cash: 60000 };   // £499,999.999 v £500,000
    const ds = await decide([hair, hair, hair, hair]);
    expect(ds.map((d) => d.belowGlide)).toEqual([false, false, false, false]);
    expect(prot(ds)).toEqual([false, false, false, false]);
    const penny = { equity: 300000, bond: 199999.99, cash: 60000 };   // a whole penny under: below
    const dp = await decide([penny, penny, penny]);
    expect(dp.map((d) => d.belowGlide)).toEqual([true, true, true]);
    expect(prot(dp)).toEqual([false, false, true]);
  });

  it('PROT3 the Decision engine leaves protection on the same penny line', async () => {
    const onLine = { equity: 315000.004, bond: 200000, cash: 60000 };  // under a penny above glidepaths + £15,000
    const over = { equity: 315000.01, bond: 200000, cash: 60000 };     // a penny above
    expect(prot(await decide([BELOW, BELOW, BELOW, onLine, over]))).toEqual([false, false, true, true, false]);
  });

  it('PROT3 the Stress engine: a shares pot a tenth of a penny under its glidepath all year is never "below"', () => {
    // A flat first year with cash paying every month, so the shares pot stays where it started: £299,999.999
    // against a £300,000 glidepath. Compared as raw numbers that was twelve months below and a cut from month 3.
    const config = { ...base, equityStart: 299999.999, bondStart: 0, cashStart: 100000, equityMin: 300000, bondMin: 0, cashTarget: 100000,
      duration: 30, years: 1, baseSalary: 30000, trace: true };
    const { trace } = simulate(config, { equity: { 0: 0 }, inflation: { 0: 0.025 } }, 1);
    expect(trace).toHaveLength(12);
    expect(trace.every((t) => t.growthPots < t.growthGlide)).toBe(true);        // under, as raw numbers…
    expect(trace.map((t) => t.belowGlide)).toEqual(new Array(12).fill(false)); // …on the line, to the penny
    expect(trace.map((t) => t.inProtection)).toEqual(new Array(12).fill(false));
    // A whole penny under: below every month, and protection from the third.
    const under = simulate({ ...config, equityStart: 299999.99 }, { equity: { 0: 0 }, inflation: { 0: 0.025 } }, 1).trace;
    expect(under.map((t) => t.belowGlide)).toEqual(new Array(12).fill(true));
    expect(under.map((t) => t.inProtection)).toEqual([false, false, ...new Array(10).fill(true)]);
  });
});

// ---------------------------------------------------------------------------------------------------------
// PROT2 — the diversifiers sleeve's glidepath rises with inflation and runs down like shares and bonds.
// ---------------------------------------------------------------------------------------------------------
describe('PROT2 — the sleeve\'s glidepath: same as shares and bonds', () => {
  it('PROT2 one definition: the starting value × inflation so far × the share of the plan still to run', () => {
    expect(diversifierGlidepath(45000, 0, 30, 1)).toBe(45000);
    expect(diversifierGlidepath(45000, 10, 30, 1.3)).toBeCloseTo(45000 * 1.3 * (20 / 30), 9);
    expect(diversifierGlidepath(45000, 10, 30, 1.3)).toBe(calculateGlidepath(45000, 10, 30, 1.3, true));   // the shares/bonds routine itself
    expect(diversifierGlidepath(45000, 30, 30, 2)).toBe(0);
    expect(diversifierGlidepath(45000, 31, 30, 2)).toBe(0);
    expect(diversifierGlidepath(undefined, 3, 30, 1.1)).toBe(0);
  });

  // The Decision engine in a later plan year. CPI is what the user entered for each tax year.
  const withSleeve = { ...settings, diversifierStart: 50000 };
  const yearsAt = (cpi) => Object.fromEntries(['26/27', '27/28', '28/29', '29/30', '30/31', '31/32'].map((k) => [k, { ...taxYears['26/27'], cpi }]));

  it('PROT2 Decision engine, plan year 5: the sleeve\'s glidepath has run down with the others (it was still £50,000)', async () => {
    const all = yearsAt(0.025);
    const cumInf = Math.pow(1.025, 5);
    const floors = calculateGlidepath(300000, 5, 30, cumInf, true) + calculateGlidepath(200000, 5, 30, cumInf, true);
    const sleeveGlide = 50000 * cumInf * (25 / 30);                  // about £47,142
    expect(sleeveGlide).toBeGreaterThan(47000); expect(sleeveGlide).toBeLessThan(47300);
    // Shares + bonds exactly on their glidepaths; the sleeve at £48,000 — under its starting value, over its glidepath.
    const m = { equity: floors * 0.6, bond: floors * 0.4, cash: 80000, diversifier: 48000 };
    const ds = await decide([m, m, m, m], withSleeve, { year: 2031, allTaxYears: all });
    expect(ds[0].calculationDetails.growthGlide).toBeCloseTo(floors + sleeveGlide, 6);
    expect(ds.map((d) => d.belowGlide)).toEqual([false, false, false, false]);
    expect(prot(ds)).toEqual([false, false, false, false]);
    // …and at £47,000, under the glidepath: below, and on in the third month.
    const low = { ...m, diversifier: 47000 };
    expect(prot(await decide([low, low, low], withSleeve, { year: 2031, allTaxYears: all }))).toEqual([false, false, true]);
  });

  it('PROT2 Decision engine, high inflation: the sleeve\'s glidepath RISES above its starting value', async () => {
    const all = yearsAt(0.10);
    const cumInf = 1.10;                                             // plan year 1
    const floors = calculateGlidepath(300000, 1, 30, cumInf, true) + calculateGlidepath(200000, 1, 30, cumInf, true);
    const sleeveGlide = 50000 * cumInf * (29 / 30);                  // about £53,167
    // The sleeve at £51,000: over its starting value (the old flat line) but under its glidepath.
    const m = { equity: floors * 0.6, bond: floors * 0.4, cash: 80000, diversifier: 51000 };
    const ds = await decide([m, m, m], withSleeve, { year: 2027, allTaxYears: all });
    expect(ds[0].calculationDetails.growthGlide).toBeCloseTo(floors + sleeveGlide, 6);
    expect(ds.map((d) => d.belowGlide)).toEqual([true, true, true]);
    expect(prot(ds)).toEqual([false, false, true]);
  });

  it('PROT2 a recorded month without its verdict is re-judged against the sleeve\'s glidepath for ITS year, not today\'s', async () => {
    // Two records from plan year 5 (saved without belowGlide, carrying the sleeve's value), then a month in the
    // same year. The sleeve at £48,000 was over its year-5 glidepath (about £47,142): the records do not count.
    const all = yearsAt(0.025);
    const cumInf = Math.pow(1.025, 5);
    const floors = calculateGlidepath(300000, 5, 30, cumInf, true) + calculateGlidepath(200000, 5, 30, cumInf, true);
    const rec = (date, d) => ({ date, source: 'Cash', equity: floors * 0.6, bond: floors * 0.4, cash: 80000, diversifier: d, inProtection: false });
    const run = async (d) => calcDecisionPWA('2031-06', floors * 0.6 - 5000, floors * 0.4, 80000, {
      settings: withSleeve, history: [rec('2031-04', d), rec('2031-05', d)], allTaxYears: all, spInfo: { amount: 0 }, diversifier: 47500 });
    const over = await run(48000);
    expect(over.calculationDetails.consecBelowGlide).toBe(0);
    expect(over.inProtection).toBe(false);
    const under = await run(47000);                                  // records £142 under the year-5 glidepath
    expect(under.calculationDetails.consecBelowGlide).toBe(2);
    expect(under.inProtection).toBe(true);
  });

  it('PROT2 the bond tent re-divides shares and bonds only: the sleeve\'s glidepath is untouched by it', () => {
    const config = { ...base, equityStart: 150000, bondStart: 90000, cashStart: 15000, equityMin: 150000, bondMin: 90000, cashTarget: 15000,
      diversifierStart: 45000, duration: 30, years: 30, baseSalary: 18000, equityGlide: equityGlideFromRisk(150000, 90000) };
    for (let seed = 0; seed < 5; seed++) {
      const { trace } = simulateTraced(config, seed);
      for (const t of trace) {
        expect(t.diversifierGlide).toBeCloseTo(45000 * t.cumInf * Math.max(0, 1 - t.year / 30), 6);
        expect(t.growthGlide).toBeCloseTo((150000 + 90000 + 45000) * t.cumInf * Math.max(0, 1 - t.year / 30), 6);
      }
      expect(glideShareForYear(config.equityGlide, 0, 30)).toBeLessThan(150000 / 240000);   // the tent is really on
      expect(disagreements(config, trace)).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------------------------------------
// The Stress engine.
// ---------------------------------------------------------------------------------------------------------
const base = { pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', other: 0, statePension: 0, statePensionYear: 99,
  disableProtection: false, protectionMult: 0.8, consecutiveLimit: 3, recoveryBuffer: 15000, hodlEnabled: false, hodlValue: 0 };

/** The rule, written out independently of the engine, folded over a traced run. Returns the months it disagrees on. */
function disagreements(config, trace) {
  let run = 0, was = false; const bad = [];
  for (const t of trace) {
    // Every glidepath — shares, bonds AND the diversifiers sleeve — is its starting figure × inflation so far ×
    // the share of the plan still to run (PROT2). Written out here, not taken from the engine.
    const left = Math.max(0, 1 - t.year / config.duration);
    const glide = (config.equityMin + config.bondMin + (config.diversifierStart || 0)) * t.cumInf * left;
    const growth = t.equityStart + t.bondStart + (t.diversifierStart || 0);
    const p = (v) => Math.round(v * 100);                        // whole pennies (PROT3)
    const below = p(growth) < p(glide);
    run = below ? run + 1 : 0;                                   // this month included
    const expected = (was && p(growth) <= p(glide + config.recoveryBuffer)) || (below && run >= config.consecutiveLimit);
    if (expected !== t.inProtection) bad.push({ month: t.month, expected, got: t.inProtection, growth, glide, run });
    was = expected;
  }
  return bad;
}

describe('PROT1 — the Stress engine applies the same count', () => {
  it('PROT1 a year lived off cash with shares on their glidepath, then a fall: protection waits for the 3rd month below', () => {
    // All-shares growth pot sitting exactly on its glidepath; a flat first year, so cash pays every month.
    // Year 2 falls 20%. The old rule had twelve "cash draws" banked and cut in the first month below.
    const config = { ...base, equityStart: 300000, bondStart: 0, cashStart: 100000, equityMin: 300000, bondMin: 0, cashTarget: 100000,
      duration: 30, years: 3, baseSalary: 30000, trace: true };
    const returns = { equity: { 0: 0, 1: -0.20, 2: 0 }, inflation: { 0: 0.025, 1: 0.025, 2: 0.025 } };
    const { trace } = simulate(config, returns, 1);
    const glideOf = (t) => calculateGlidepath(300000, t.year, 30, t.cumInf, true);
    const firstBelow = trace.findIndex((t) => t.equityStart + t.bondStart < glideOf(t));
    expect(firstBelow).toBeGreaterThanOrEqual(12);               // nothing below in the flat first year
    for (let m = 1; m < 12; m++) {
      expect(trace[m].equityStart).toBeCloseTo(300000, 6);       // shares untouched…
      expect(trace[m].cashStart).toBeLessThan(trace[m - 1].cashStart);   // …cash paid the month
    }
    expect(trace.slice(0, firstBelow + 3).map((t) => t.inProtection))
      .toEqual([...new Array(firstBelow + 2).fill(false), true]);
    expect(disagreements(config, trace)).toEqual([]);
  });

  it('PROT1 every month of 40 random futures matches the rule written out here (shares + bonds)', () => {
    const config = { ...base, equityStart: 300000, bondStart: 240000, cashStart: 60000, equityMin: 300000, bondMin: 240000, cashTarget: 60000,
      duration: 30, years: 30, baseSalary: 32000 };
    let months = 0, protMonths = 0;
    for (let seed = 0; seed < 40; seed++) {
      const { trace } = simulateTraced(config, seed);
      expect(disagreements(config, trace)).toEqual([]);
      months += trace.length; protMonths += trace.filter((t) => t.inProtection).length;
    }
    expect(months).toBeGreaterThan(10000);
    expect(protMonths).toBeGreaterThan(100);                     // the rule was really exercised
  });

  it('PROT1 …and with a diversifiers sleeve, which is counted on both sides', () => {
    const config = { ...base, equityStart: 150000, bondStart: 90000, cashStart: 15000, equityMin: 150000, bondMin: 90000, cashTarget: 15000,
      diversifierStart: 45000, duration: 30, years: 30, baseSalary: 18000 };
    let protMonths = 0, sleeveDecided = 0, glideDecided = 0;
    for (let seed = 0; seed < 40; seed++) {
      const { trace } = simulateTraced(config, seed);
      expect(disagreements(config, trace)).toEqual([]);
      protMonths += trace.filter((t) => t.inProtection).length;
      for (const t of trace) {
        const g = calculateGlidepath(150000, t.year, 30, t.cumInf, true) + calculateGlidepath(90000, t.year, 30, t.cumInf, true);
        const sleeveGlide = 45000 * t.cumInf * Math.max(0, 1 - t.year / 30);
        const all3 = t.equityStart + t.bondStart + t.diversifierStart < g + sleeveGlide;
        // Months where the sleeve changes the verdict: shares + bonds alone say one thing, all three another.
        if ((t.equityStart + t.bondStart < g) !== all3) sleeveDecided++;
        // PROT2: months the verdict differs from the 6.14.0 line (the sleeve held at a flat £45,000).
        if ((t.equityStart + t.bondStart + t.diversifierStart < g + 45000) !== all3) glideDecided++;
        expect(t.belowGlide).toBe(Math.round((t.equityStart + t.bondStart + t.diversifierStart) * 100) < Math.round((g + sleeveGlide) * 100));
      }
    }
    expect(protMonths).toBeGreaterThan(100);
    expect(sleeveDecided).toBeGreaterThan(50);                   // the sleeve really does swing months
    expect(glideDecided).toBeGreaterThan(50);                    // and so does putting it on a glidepath
  });
});

// ---------------------------------------------------------------------------------------------------------
// Both engines, the same months: the Decision engine replays a Stress future and must call every month the same.
// ---------------------------------------------------------------------------------------------------------
describe('PROT1 — the two engines agree month for month', () => {
  async function replay(config, seed) {
    const returns = monteCarloReturns(config, seed);
    const { trace } = simulateTraced(config, seed);
    const ctx = buildDecisionContext(config, trace, returns);
    const s = { ...ctx.settings, diversifierStart: config.diversifierStart || 0, ...(config.equityGlide ? { equityGlide: config.equityGlide } : {}) };
    const history = []; let mismatches = 0, prot = 0;
    for (const t of trace) {
      const date = aprilDate(t.month);
      const d = await calcDecisionPWA(date, t.equityStart, t.bondStart, t.cashStart, {
        settings: s, history, allTaxYears: ctx.allTaxYears, spInfo: { amount: t.planInputs.statePension }, isaBalance: t.isaStart,
        ...(config.diversifierStart ? { diversifier: t.diversifierStart } : {})
      });
      history.push({ ...decisionToHistory(d), ...(config.diversifierStart ? { diversifier: t.diversifierStart } : {}) });
      if (d.inProtection !== t.inProtection) mismatches++;
      if (t.inProtection) prot++;
    }
    return { months: trace.length, mismatches, prot };
  }

  it('PROT1 not one month of 20 futures differs — without and with a diversifiers sleeve', async () => {
    const plain = { ...base, recoveryBuffer: 15000, equityStart: 300000, bondStart: 240000, cashStart: 60000, equityMin: 300000, bondMin: 240000, cashTarget: 60000,
      duration: 30, years: 30, baseSalary: 32000 };
    const sleeve = { ...base, equityStart: 150000, bondStart: 90000, cashStart: 15000, equityMin: 150000, bondMin: 90000, cashTarget: 15000,
      diversifierStart: 45000, duration: 30, years: 30, baseSalary: 18000 };
    // PROT2 with the bond tent on as well: the tent re-divides shares and bonds, the sleeve keeps its own glidepath.
    const tented = { ...sleeve, equityGlide: equityGlideFromRisk(150000, 90000) };
    for (const config of [plain, sleeve, tented]) {
      let months = 0, mismatches = 0, prot = 0;
      for (let seed = 0; seed < 10; seed++) { const r = await replay(config, seed); months += r.months; mismatches += r.mismatches; prot += r.prot; }
      expect(months).toBeGreaterThan(3000);
      expect(prot).toBeGreaterThan(50);
      expect(mismatches).toBe(0);
    }
  });
});

// ---------------------------------------------------------------------------------------------------------
// Protection is a Pots & Valves rule: a bought gilt ladder has no pot floors to obey.
// ---------------------------------------------------------------------------------------------------------
describe('PROT1 — a contract strategy (a bought gilt ladder) is never cut by the pot rule', () => {
  // The ladder plan in its run-up (corpus fixture 03): no shares, £868,000 of gilts typed in as "bonds", Decision
  // floors of £300,000 + £650,000. Shares + bonds (£868,000) are under the sum of the floors (£950,000) every
  // month, so the new count reached 3 in the third month and cut the draw by 10% (£4,333 to £3,900). The old
  // count did not (bonds over their own floor paid the month, which reset it). The app now switches protection
  // off for the contract strategies when it asks the Decision engine (calcDecisionWithDeps, index.html).
  const ladderSettings = { baseSalary: 52000, equityMin: 300000, bondMin: 650000, cashTarget: 100000, duration: 30,
    protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, firstTaxYear: 2026 };
  const month = { equity: 0, bond: 868000, cash: 100000 };

  it('PROT1 the pot rule alone would cut the third month; with protection off for the contract it does not', async () => {
    const raw = await decide([month, month, month], ladderSettings);
    expect(prot(raw)).toEqual([false, false, true]);                 // why the app must not apply it to a ladder
    expect(raw[2].sippDraw).toBeLessThan(raw[0].sippDraw);
    const asApp = await decide([month, month, month], { ...ladderSettings, disableProtection: true });
    expect(prot(asApp)).toEqual([false, false, false]);
    expect(asApp[2].sippDraw).toBeCloseTo(asApp[0].sippDraw, 6);
  });

  it('PROT1 the app and the corpus builder both switch it off for the contract strategies; the ladder fixture\'s months are uncut', () => {
    const root = process.cwd();
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    expect(html).toContain('if (st && CONTRACT_IDS.includes(st.id)) engineSettings = { ...decisionSettings, disableProtection: true };');
    expect(html).toContain('settings: engineSettings,');
    expect(html).toContain("const CONTRACT_IDS = ['full-il-gilt', 'gilt-rotation', 'floor-the-schedule'];");
    const fx = JSON.parse(readFileSync(join(root, 'tests/fixtures/plans/03-gilt-ladder-runup.json'), 'utf8'));
    const recs = Object.values(fx.decisionTool.history || {}).flat().filter((h) => h && h.date);
    expect(recs.length).toBeGreaterThanOrEqual(3);
    expect(recs.every((h) => h.inProtection === false)).toBe(true);
    expect(new Set(recs.map((h) => Math.round(h.sipp))).size).toBe(1);   // the same draw every month (it was 4,333, 4,333, 3,900)
  });
});
