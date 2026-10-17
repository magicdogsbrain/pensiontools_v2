/**
 * Who draws what (research/household-draw-split.md §7; usability audit §5 decision 5): the split that pays the least
 * tax when a couple draws together, worked out year by year with the app's own tax sums, and what it must never do.
 *
 * The owner's reference case is kept GENERIC (no names): plan A draws £80,000 fully taxed plus a £3,650 final-salary
 * pension (gross £83,650 → tax £20,892); plan B's quarter-tax-free draw of £1,716 a month with A capped at £50,270 gives
 * the same household net within £20 and tax £8,115 (saving £12,777).
 */
import { describe, it, expect } from 'vitest';
import { householdDrawSplit, stepsFromSchedule, settingsWithSchedule, pensionAgeNote, headlineWords, comparisonFigures, about, limitFrom, SPLIT_HEADLINE_MIN } from '../src/services/HouseholdDraw.js';
import { calculateTax, grossToNet } from '../src/services/TaxCalculator.js';
import { planDrawdown } from '../src/services/DrawdownStrategy.js';
import { combineHouseholdStrategies } from '../src/services/HouseholdService.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };

/** Plan A: the bigger pot, already retired, fully taxed draws, a small final-salary pension from the start. */
const planA = (over = {}) => ({
  configured: true, retired: true, currentAge: 62, shapeAgeNow: 62, duration: 30, baseSalary: 83650,
  equityMin: 800000, bondMin: 300000, cashTarget: 80000, isaBalance: 0, isaDrawdownStrategy: 'hold',
  dbAmount: 3650, dbStartYear: 0, statePension: 11973, statePensionYear: 5, accessMethod: 'drawdown',
  ...BANDS, strategyId: 'pots-and-valves', ...over
});
/** Plan B: the smaller pot, already retired, a quarter of each draw tax-free, drawing nothing in its own plan. */
const planB = (over = {}) => ({
  configured: true, retired: true, currentAge: 57, shapeAgeNow: 57, duration: 35, baseSalary: 0,
  equityMin: 150000, bondMin: 50000, cashTarget: 20000, isaBalance: 0, isaDrawdownStrategy: 'hold',
  statePension: 11973, statePensionYear: 10, accessMethod: 'ufpls',
  ...BANDS, strategyId: 'pots-and-valves', ...over
});
const split = (a = planA(), b = planB(), o = {}) => householdDrawSplit({ settings: a, name: 'A' }, { settings: b, name: 'B' }, { now: NOW, ...o });
const sumNet = (w) => w.netA + w.netB;
const sumTax = (w) => w.taxA + w.taxB;

describe('the reference case, from the app\'s own tax sums', () => {
  it('£83,650 fully taxed pays £20,892; A at £50,270 with B\'s £1,716 a month (a quarter tax-free) pays £8,115 for the same net within £20', () => {
    expect(Math.round(calculateTax(83650, BANDS.pa, BANDS.brl, BANDS.hrl))).toBe(20892);
    const ownNet = grossToNet(83650, BANDS.pa, BANDS.brl, BANDS.hrl);
    const aCapped = planDrawdown({ targetGross: 50270, fixedIncome: 3650, ...BANDS, isaBalance: 0, strategy: 'hold', taxFreeFraction: 0 });
    const bUfpls = 1716 * 12;
    const bTax = calculateTax(bUfpls * 0.75, BANDS.pa, BANDS.brl, BANDS.hrl);
    expect(Math.round(aCapped.tax + bTax)).toBe(8115);
    expect(Math.round(aCapped.tax + bTax - 20892)).toBe(-12777);
    expect(Math.abs((aCapped.net + bUfpls - bTax) - ownNet)).toBeLessThan(20);
  });

  it('the split finds that year: A capped at the top of the 20% band, B about £1,717 a month, tax within £5 of £8,115', () => {
    const s = split();
    const r0 = s.rows[0];
    expect(Math.round(sumTax(r0.own))).toBe(20892);
    expect(Math.round(r0.together.taxableA)).toBe(50270);
    expect(Math.round(r0.together.drawB / 12)).toBeGreaterThanOrEqual(1716);
    expect(Math.round(r0.together.drawB / 12)).toBeLessThanOrEqual(1718);
    expect(Math.abs(sumTax(r0.together) - 8115)).toBeLessThan(5);
    expect(r0.saving).toBeGreaterThan(12770);
    expect(Math.abs(sumNet(r0.together) - sumNet(r0.own))).toBeLessThan(1);
    expect(s.applies).toBe(true);
    expect(s.smaller).toBe('b');
    expect(s.saving.year).toBeCloseTo(r0.saving, 6);
    expect(s.untilAge).toBe(67);
  });

  it('the steps it writes: A\'s first step is the top of the 20% band, B\'s delivers the moved net; the schedule runs the plan\'s length', () => {
    const s = split();
    expect(s.steps.a[0]).toEqual({ fromAge: 62, amount: 50270 });
    expect(s.settings.a.targetSchedule).toHaveLength(31);
    expect(s.settings.a.incomeShape).toBe('phases');
    expect(s.settings.a.baseSalary).toBe(50270);
    expect(s.settings.a.spendingProfile).toBe('flat');
    expect(s.steps.b[0].fromAge).toBe(57);
    // B's gross-equivalent target delivers the moved net: planDrawdown on it draws the £1,717 a month
    const d = planDrawdown({ targetGross: s.steps.b[0].amount, fixedIncome: 0, ...BANDS, isaBalance: 0, strategy: 'hold', taxFreeFraction: 0.25 });
    expect(Math.abs(d.sippGross - s.rows[0].together.drawB)).toBeLessThan(2);
    expect(s.settings.b.targetSchedule).toHaveLength(36);
  });

  it('the headline equals the table: its yearly figure is the first full year\'s saving, its total the saving until B is 67', () => {
    const s = split();
    const w = headlineWords(s);
    expect(w.headline).toBe('Drawing together saves about ' + about(s.saving.year) + ' a year in tax — about ' + about(s.saving.until) + ' by the time B is 67.');
    expect(s.saving.until).toBeCloseTo(s.tax.until.own - s.tax.until.together, 6);
    expect(w.why).toContain('A pays 40% on ' + about(s.unused.over));
    expect(w.why).toContain('£12,570 of B’s tax-free allowance');
    expect(w.closing).toContain('This is your choice; neither is wrong.');
  });
});

describe('what the split must never do', () => {
  const allSplits = () => [split(), split(planA({ accessMethod: 'ufpls' }), planB({ baseSalary: 30000 })), split(planA({ isaBalance: 150000, isaDrawdownStrategy: 'tax-efficient' }), planB({ baseSalary: 20000, accessMethod: 'drawdown' })), split(planA(), planB(), { limit: { kind: 'untilAge', who: 'b', age: 67 } }), split(planA(), planB(), { limit: { kind: 'keepAtLeast', who: 'b', amount: 100000 } })];

  it('never lowers the household\'s after-tax spending in any year', () => {
    for (const s of allSplits()) for (const r of s.rows) expect(sumNet(r.together)).toBeGreaterThanOrEqual(sumNet(r.own) - 0.01);
  });

  it('never pays more tax than drawing apart, in any year', () => {
    for (const s of allSplits()) for (const r of s.rows) expect(sumTax(r.together)).toBeLessThanOrEqual(sumTax(r.own) + 0.01);
  });

  it('never draws more than a pot holds: the smaller pot takes more than its own plan only while the pot (today\'s prices, no growth) has it', () => {
    for (const s of allSplits()) {
      const k = s.smaller, K = k.toUpperCase();
      let drawn = 0;
      for (const r of s.rows) {
        drawn += r.together['draw' + K];
        if (r.together['draw' + K] > r.own['draw' + K] + 1) expect(drawn).toBeLessThanOrEqual(s.profiles[k].pot + 1e-6);
      }
      // once the counted pot is spent the year keeps its own draws: nothing is drawn that the plan did not already draw
      const spent = s.rows.findIndex((r, i) => s.rows.slice(0, i + 1).reduce((t, x) => t + x.together['draw' + K], 0) >= s.profiles[k].pot - 1e-6);
      if (spent >= 0 && !s.limit) for (const r of s.rows.slice(spent + 1)) expect(r.together['draw' + K]).toBeLessThanOrEqual(r.own['draw' + K] + 1e-6);
    }
  });

  it('respects "keep B\'s pot until 67": B is drawn evenly to 67, then not at all, and A pays the rest', () => {
    const s = split(planA(), planB(), { limit: { kind: 'untilAge', who: 'b', age: 67 } });
    const before = s.rows.filter((r) => r.ageB < 67), after = s.rows.filter((r) => r.ageB >= 67);
    expect(before.length).toBe(10);
    for (const r of after) expect(r.together.drawB).toBe(0);
    const even = s.profiles.b.pot / 10;
    for (const r of before) expect(r.together.drawB).toBeLessThanOrEqual(even + 1);
    for (const r of after) expect(sumNet(r.together)).toBeGreaterThanOrEqual(sumNet(r.own) - 0.01);
    expect(s.limit).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
  });

  it('respects "keep at least £100,000 in B\'s pot"', () => {
    const s = split(planA(), planB(), { limit: { kind: 'keepAtLeast', who: 'b', amount: 100000 } });
    const drawnB = s.rows.reduce((t, r) => t + r.together.drawB, 0);
    expect(drawnB).toBeLessThanOrEqual(s.profiles.b.pot - 100000 + 1e-6);
    expect(drawnB).toBeGreaterThan(100000);
  });

  it('equal pots and equal draws: nothing changes and there is no headline', () => {
    const same = (age) => ({ ...planA({ currentAge: age, shapeAgeNow: age, baseSalary: 40000, dbAmount: 0, statePensionYear: 67 - age }) });
    const s = split(same(62), same(62));
    expect(s.unchanged).toBe(true);
    expect(s.applies).toBe(false);
    expect(s.saving.year).toBe(0);
    expect(s.schedules.together.a).toEqual(s.schedules.own.a);
    expect(s.steps.a).toEqual([{ fromAge: 62, amount: 40000 }]);
    // two equal plans both over the band: still unchanged — the excess goes back to whoever it came from
    const s2 = split(same(62), same(62));
    expect(s2.rows.every((r) => Math.abs(r.saving) < 1)).toBe(true);
    const over = split(planA({ baseSalary: 70000, dbAmount: 0 }), planA({ baseSalary: 70000, dbAmount: 0 }));
    expect(over.unchanged).toBe(true);
  });

  it('a saving under £1,000 a year shows no headline', () => {
    const s = split(planA({ baseSalary: 51000, dbAmount: 0 }), planB());
    expect(s.saving.year).toBeLessThan(SPLIT_HEADLINE_MIN);
    expect(s.applies).toBe(false);
  });

  it('a partner still working draws nothing until their plan begins', () => {
    const b = planB({ retired: false, currentAge: 55, retireAge: 60, shapeAgeNow: 60 });
    const s = split(planA(), b);
    const early = s.rows.filter((r) => !r.activeB);
    expect(early.length).toBeGreaterThan(0);
    for (const r of early) { expect(r.together.drawB).toBe(0); expect(r.together.grossB).toBe(0); }
  });
});

describe('the words that go with it', () => {
  it('the 2028 note names whoever is 55 or 56 on 6 April 2028 and drawing before then; nobody else', () => {
    const rows = [{ year: 0, own: { drawA: 0, drawB: 1000 }, together: { drawA: 0, drawB: 1000 } }];
    const names = { a: 'A', b: 'B' };
    const now = new Date('2026-10-17T10:00:00Z');
    expect(pensionAgeNote(rows, { a: { currentAge: 62 }, b: { currentAge: 55 } }, names, now)).toContain('B will be 56 on 6 April 2028');
    expect(pensionAgeNote(rows, { a: { currentAge: 62 }, b: { currentAge: 53 } }, names, now)).toBe('');
    expect(pensionAgeNote(rows, { a: { currentAge: 62 }, b: { currentAge: 55 } }, names, new Date('2028-05-01T00:00:00Z'))).toBe('');
    const noDraw = [{ year: 0, own: { drawA: 0, drawB: 0 }, together: { drawA: 0, drawB: 0 } }];
    expect(pensionAgeNote(noDraw, { a: { currentAge: 62 }, b: { currentAge: 55 } }, names, now)).toBe('');
  });

  it('the ladder note names a gilt-ladder plan and says what the engine keeps as cash', () => {
    const s = split(planA({ strategyId: 'full-il-gilt', strategyParams: { sippTotal: 1180000 } }), planB());
    expect(s.ladderNote).toContain('A’s plan is a gilt ladder');
    expect(s.ladderNote).toContain('stays as cash');
    expect(split().ladderNote).toBe('');
  });

  it('steps and settings helpers', () => {
    expect(stepsFromSchedule([50270, 50270, 40000.4, 40000], 62)).toEqual([{ fromAge: 62, amount: 50270 }, { fromAge: 64, amount: 40000 }]);
    const st = settingsWithSchedule({ pa: 1, spendingProfile: 'declining' }, [100.4, 200], [{ fromAge: 1, amount: 100 }]);
    expect(st).toMatchObject({ pa: 1, incomeShape: 'phases', baseSalary: 100, spendingProfile: 'flat', targetSchedule: [100, 200] });
    expect(limitFrom({ kind: 'untilAge', age: '67' })).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
    expect(limitFrom({ kind: 'keepAtLeast', amount: 0 })).toBeNull();
    expect(about(12777)).toBe('£12,800');
    expect(about(139900)).toBe('£140,000');
    expect(about(21500)).toBe('£22,000');
  });

  it('the table figures read the runs: pots at ages from each plan\'s cone, the household verdict pooled first', () => {
    const s = split();
    const mk = (startAge, dur, p50, terminal) => ({ affordable: true, ruin: { mc: 10 }, cones: { wealth: { p50: Array.from({ length: dur + 1 }, (_, y) => p50 - y * 1000), p10: [] } }, terminal: { p50: terminal },
      survivedMc: [true, false, true, true], futuresMc: { terminal: [terminal, 0, terminal, terminal], failYear: [null, 3, null, null] }, samples: { wealth: [[p50, p50], [0, 0], [p50, p50], [p50, p50]] } });
    const rA = mk(62, 30, 900000, 500000), rB = mk(57, 35, 100000, 20000);
    const combined = combineHouseholdStrategies(rA, rB, { needA: s.needs.together.a, needB: s.needs.together.b, startAgeA: 62, startAgeB: 57 });
    expect(combined.pooled.success).toBeGreaterThanOrEqual(combined.jointSuccess);
    const fig = comparisonFigures(s, { own: { combined, rA, rB }, together: { combined, rA, rB } });
    expect(fig.own.potA[0]).toBe(900000 - 5000);   // A at 67 = plan year 5
    expect(fig.own.potB[0]).toBe(100000 - 10000);  // B at 67 = plan year 10
    expect(fig.own.lasts.household.n).toBe(Math.round(combined.pooled.success * 10));
    expect(fig.own.lasts.a.n).toBe(9);
    const w = headlineWords(s, fig);
    expect(w.cost).toContain('about ' + about(fig.cost.together) + ' at 67');
    expect(w.closing).toContain('better off at 90');
  });
});
