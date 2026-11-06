/**
 * Who draws what (research/household-draw-split.md §7 and §9.6; usability audit §5 decision 5): the split that pays the
 * least tax when a couple draws together, worked out year by year with the app's own tax sums, and what it must never do.
 *
 * The reference case (fictional figures, no names): plan A draws £58,000 fully taxed plus a £6,100 final-salary
 * pension (gross £64,100 → tax £13,072); plan B's quarter-tax-free draw of £692 a month with A capped at £50,270 gives
 * the same household net within £20 and tax £7,540 (saving £5,532) — the arithmetic of §7.
 * Since section 9 (our decisions of 27 Oct 2026) the split itself finds a cheaper year under its default limit: B's pot (£185,000) is kept until B's
 * State Pension at 67, £23,125 a year (§9.2), and every pound is compared (§9.4) — B's quarter-tax-free pounds inside the
 * 20% band replace A's taxed ones — so A draws £32,930 and the tax is £5,027 (saving £8,045). With no limit (the fast
 * split) B takes more, A goes down to the allowance, the tax £3,829, and B's pot is gone at 63.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { householdDrawSplit, stepsFromSchedule, settingsWithSchedule, pensionAgeNote, headlineWords, comparisonFigures, about, limitFrom, SPLIT_HEADLINE_MIN } from '../src/services/HouseholdDraw.js';
import { calculateTax, grossToNet, netToGross } from '../src/services/TaxCalculator.js';
import { planDrawdown } from '../src/services/DrawdownStrategy.js';
import { combineHouseholdStrategies } from '../src/services/HouseholdService.js';
import { SPLIT_KEYS } from '../src/services/HouseholdSplitApply.js';
import { splitPatches } from '../src/answers/plan/household.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };

/** Plan A: the bigger pot, already retired, fully taxed draws, a small final-salary pension from the start. */
const planA = (over = {}) => ({
  configured: true, retired: true, currentAge: 64, shapeAgeNow: 64, duration: 28, baseSalary: 64100,
  equityMin: 600000, bondMin: 250000, cashTarget: 60000, isaBalance: 0, isaDrawdownStrategy: 'hold',
  dbAmount: 6100, dbStartYear: 0, statePension: 11973, statePensionYear: 3, accessMethod: 'drawdown',
  ...BANDS, strategyId: 'pots-and-valves', ...over
});
/** Plan B: the smaller pot, already retired, a quarter of each draw tax-free, drawing nothing in its own plan. */
const planB = (over = {}) => ({
  configured: true, retired: true, currentAge: 59, shapeAgeNow: 59, duration: 33, baseSalary: 0,
  equityMin: 125000, bondMin: 45000, cashTarget: 15000, isaBalance: 0, isaDrawdownStrategy: 'hold',
  statePension: 11973, statePensionYear: 8, accessMethod: 'ufpls',
  ...BANDS, strategyId: 'pots-and-valves', ...over
});
const split = (a = planA(), b = planB(), o = {}) => householdDrawSplit({ settings: a, name: 'A' }, { settings: b, name: 'B' }, { now: NOW, ...o });
const sumNet = (w) => w.netA + w.netB;
const sumTax = (w) => w.taxA + w.taxB;
const NONE = { kind: 'none' };

/** A random person's plan, in the planner's own units: the draw, the pots, the ISA and its policy, the way of drawing, the ages. */
const arbPerson = fc.record({
  base: fc.oneof(fc.constant(0), fc.integer({ min: 10000, max: 150000 })),
  pot: fc.integer({ min: 20000, max: 2000000 }),
  isa: fc.constantFrom(0, 0, 30000, 150000),
  isaStrategy: fc.constantFrom('hold', 'minimiseEarlyTax'),
  access: fc.constantFrom('drawdown', 'ufpls'),
  age: fc.integer({ min: 57, max: 70 }),
  spYear: fc.integer({ min: 0, max: 12 }),
  db: fc.constantFrom(0, 0, 5200, 12000),
  dur: fc.integer({ min: 20, max: 35 })
});
const personOf = (p) => planA({ currentAge: p.age, shapeAgeNow: p.age, duration: p.dur, baseSalary: p.base, equityMin: Math.round(p.pot * 0.7), bondMin: Math.round(p.pot * 0.25), cashTarget: Math.round(p.pot * 0.05),
  isaBalance: p.isa, isaDrawdownStrategy: p.isaStrategy, dbAmount: p.db, dbStartYear: 0, statePensionYear: p.spYear, accessMethod: p.access });
const arbLimit = fc.constantFrom(null, NONE, { kind: 'untilAge', who: 'b', age: 67 }, { kind: 'keepAtLeast', who: 'b', amount: 50000 });
const arbCouple = fc.record({ a: arbPerson, b: arbPerson, limit: arbLimit });
/** The limit named on the smaller pot, whichever side that is. */
const coupleSplitNamed = (c) => {
  const a = personOf(c.a), b = personOf(c.b);
  if (c.limit === null) return split(a, b);
  if (c.limit.kind === 'none') return split(a, b, { limit: NONE });
  const probe = split(a, b);
  return split(a, b, { limit: { ...c.limit, who: probe.smaller } });
};
/** The rows while both pots still had money at the start of the year in the count — where the "as written" column is a real alternative. */
const whileBothHaveMoney = (s) => s.rows.filter((r, i) => i === 0 || (s.rows[i - 1].left.a > 1e-6 && s.rows[i - 1].left.b > 1e-6));

describe('the reference case, from the app\'s own tax sums', () => {
  it('£64,100 fully taxed pays £13,072; A at £50,270 with B\'s £692 a month (a quarter tax-free, inside B\'s allowance) pays £7,540 for the same net within £20 (the figures of §7)', () => {
    expect(Math.round(calculateTax(64100, BANDS.pa, BANDS.brl, BANDS.hrl))).toBe(13072);
    const ownNet = grossToNet(64100, BANDS.pa, BANDS.brl, BANDS.hrl);
    const aCapped = planDrawdown({ targetGross: 50270, fixedIncome: 6100, ...BANDS, isaBalance: 0, strategy: 'hold', taxFreeFraction: 0 });
    const bUfpls = 692 * 12;
    const bTax = calculateTax(bUfpls * 0.75, BANDS.pa, BANDS.brl, BANDS.hrl);
    expect(Math.round(aCapped.tax + bTax)).toBe(7540);
    expect(Math.round(aCapped.tax + bTax - 13072)).toBe(-5532);
    expect(Math.abs((aCapped.net + bUfpls - bTax) - ownNet)).toBeLessThan(20);
  });

  it('the split finds a cheaper year under its default limit (§9.2, §9.4): B\'s pot kept until 67 at £23,125 a year (£1,927 a month), A at £32,930, tax within £5 of £5,027 for the same net', () => {
    const s = split();
    const r0 = s.rows[0];
    expect(Math.round(sumTax(r0.own))).toBe(13072);
    expect(s.limit).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
    expect(s.limitDefaulted).toBe(true);
    expect(Math.round(r0.together.drawB)).toBe(23125);            // 185,000 drawn evenly over the eight years to 67
    expect(Math.round(r0.together.drawB / 12)).toBe(1927);
    expect(Math.round(r0.together.taxableA)).toBe(32930);          // below the top of the band: B's £23,125 pays the rest, its pounds cheaper than A's
    expect(Math.abs(sumTax(r0.together) - 5027)).toBeLessThan(5);
    expect(r0.saving).toBeGreaterThan(8040);
    expect(Math.abs(sumNet(r0.together) - sumNet(r0.own))).toBeLessThan(1);
    expect(s.applies).toBe(true);
    expect(s.smaller).toBe('b');
    expect(s.saving.year).toBeCloseTo(r0.saving, 6);
    expect(s.untilAge).toBe(67);
    // the pot lasts to 67 in the count and is spent by then; nothing extra after
    expect(s.rows.filter((r) => r.ageB < 67).every((r) => Math.abs(r.together.drawB - 23125) < 1)).toBe(true);
    expect(s.goneAt).toBe(66);
  });

  it('the fast split (no limit, §9.2): B takes the household\'s need above A\'s allowance, A down to the allowance, tax £3,829; B\'s pot gone at 63; the default\'s result says so from the count alone', () => {
    const s = split();
    expect(s.fast).not.toBe(null);
    expect(Math.round(s.fast.saving.year)).toBe(9243);
    expect(s.fast.saving.year).toBeGreaterThan(s.saving.year);
    expect(s.fast.goneAt).toBe(63);
    const f = split(planA(), planB(), { limit: NONE });
    expect(f.limit).toEqual(NONE);
    expect(f.limitDefaulted).toBe(false);
    expect(f.fast).toBe(null);
    const r0 = f.rows[0];
    expect(Math.round(r0.together.taxableA)).toBe(12570);
    expect(Math.round(r0.together.taxableB)).toBe(31715);
    expect(Math.abs(sumTax(r0.together) - 3829)).toBeLessThan(5);
    expect(Math.round(f.saving.year)).toBe(Math.round(s.fast.saving.year));
    expect(f.goneAt).toBe(63);
    // the years after the pot is empty are counted (§9.5): B draws nothing, A pays the household's need alone, the saving stops
    const after = f.rows.filter((r) => r.ageB > 63 && r.ageB < 67);
    expect(after.length).toBeGreaterThan(0);
    for (const r of after) { expect(r.together.drawB).toBe(0); expect(Math.abs(r.saving)).toBeLessThan(1); }
    expect(f.saving.until).toBeLessThan(s.saving.until);
  });

  it('the steps it writes: A\'s first step is £32,930, B\'s delivers the moved net; the schedule runs the plan\'s length', () => {
    const s = split();
    expect(s.steps.a[0]).toEqual({ fromAge: 64, amount: 32930 });
    expect(s.settings.a.targetSchedule).toHaveLength(29);
    expect(s.settings.a.incomeShape).toBe('phases');
    expect(s.settings.a.baseSalary).toBe(32930);
    expect(s.settings.a.spendingProfile).toBe('flat');
    expect(s.steps.b[0].fromAge).toBe(59);
    // B's gross-equivalent target delivers the moved net: planDrawdown on it draws the £23,125
    const d = planDrawdown({ targetGross: s.steps.b[0].amount, fixedIncome: 0, ...BANDS, isaBalance: 0, strategy: 'hold', taxFreeFraction: 0.25 });
    expect(Math.abs(d.sippGross - s.rows[0].together.drawB)).toBeLessThan(2);
    expect(s.settings.b.targetSchedule).toHaveLength(34);
  });

  it('the headline equals the table: its yearly figure is the first full year\'s saving, its total the saving until B is 67', () => {
    const s = split();
    const w = headlineWords(s);
    expect(w.headline).toBe('Drawing together saves about ' + about(s.saving.year) + ' a year in tax — about ' + about(s.saving.until) + ' by the time B is 67.');
    expect(s.saving.until).toBeCloseTo(s.tax.until.own - s.tax.until.together, 6);
    // "until B is 67" is the eight bridge years, 59 to 66: the year the State Pension begins is not among them
    const bridge = s.rows.filter((r) => r.year < s.untilC);
    expect(bridge.length).toBe(s.untilAge - s.profiles.b.startAge);
    expect(bridge.every((r) => r.ageB < 67)).toBe(true);
    expect(s.tax.until.own).toBeCloseTo(bridge.reduce((t, r) => t + sumTax(r.own), 0), 6);
    expect(s.tax.until.together).toBeCloseTo(bridge.reduce((t, r) => t + sumTax(r.together), 0), 6);
    expect(w.why).toContain('A pays 40% on ' + about(s.unused.over));
    expect(w.why).toContain('£12,570 of B’s tax-free allowance');
    expect(w.closing).toContain('This is your choice; neither is wrong.');
  });

  it('the baseline (§9.1): the couple\'s take-home a year is the same both ways; the smaller pension\'s figure is its own draw plus what moved', () => {
    const s = split();
    expect(Math.round(s.baseline.net)).toBe(51028);
    expect(Math.round(s.baseline.written)).toBe(51028);
    expect(s.baseline.typed).toBe(null);
    expect(s.madeOf.year).toBe(0);
    expect(Math.round(s.madeOf.pays)).toBe(23125);
    expect(Math.round(s.madeOf.own)).toBe(0);
    expect(Math.round(s.madeOf.moved)).toBe(23125);
    expect(s.madeOf.pays).toBeCloseTo(s.madeOf.own + s.madeOf.moved, 6);
    // what the larger pension stops paying is more than what moved in: B's pounds are taxed less, so fewer of them replace A's
    expect(Math.round(s.madeOf.stops)).toBe(31170);
    expect(s.madeOf.stops).toBeCloseTo(s.rows[0].own.drawA - s.rows[0].together.drawA, 6);
    expect(s.madeOf.stops).toBeGreaterThan(s.madeOf.moved);
  });
});

describe('what the split must never do', () => {
  const allSplits = () => [split(), split(planA({ accessMethod: 'ufpls' }), planB({ baseSalary: 30000 })), split(planA({ isaBalance: 150000, isaDrawdownStrategy: 'tax-efficient' }), planB({ baseSalary: 20000, accessMethod: 'drawdown' })), split(planA(), planB(), { limit: { kind: 'untilAge', who: 'b', age: 67 } }), split(planA(), planB(), { limit: { kind: 'keepAtLeast', who: 'b', amount: 60000 } }), split(planA(), planB(), { limit: NONE })];

  it('never lowers the household\'s after-tax spending in any year', () => {
    for (const s of allSplits()) for (const r of s.rows) expect(sumNet(r.together)).toBeGreaterThanOrEqual(sumNet(r.own) - 1);
  });

  it('never pays more tax than drawing apart in any year while both pots have money in the count (after the smaller pot is empty its plan\'s draw is the bigger pension\'s to pay, §9.5)', () => {
    for (const s of allSplits()) for (const r of whileBothHaveMoney(s)) expect(sumTax(r.together)).toBeLessThanOrEqual(sumTax(r.own) + 0.01);
  });

  it('never draws more than a pot holds: the smaller pot takes more than its own plan only while the pot (today\'s prices, no growth) has it, and nothing at all once it is empty in the count', () => {
    for (const s of allSplits()) {
      const k = s.smaller, K = k.toUpperCase();
      let drawn = 0;
      for (const r of s.rows) {
        drawn += r.together['draw' + K];
        if (r.together['draw' + K] > r.own['draw' + K] + 1) expect(drawn).toBeLessThanOrEqual(s.profiles[k].pot + 1e-6);
      }
      // (unless the bigger pot is empty too: the year then keeps its own draws, a fiction both ways)
      const spent = s.rows.findIndex((r) => r.left[k] <= 1e-9);
      if (spent >= 0) for (const r of s.rows.slice(spent + 1)) if (!r.fallback) expect(r.together['draw' + K]).toBe(0);
    }
  });

  it('respects "keep B\'s pot until 67": B is drawn evenly to 67, then not at all, and A pays the rest', () => {
    const s = split(planA(), planB(), { limit: { kind: 'untilAge', who: 'b', age: 67 } });
    const before = s.rows.filter((r) => r.ageB < 67), after = s.rows.filter((r) => r.ageB >= 67);
    expect(before.length).toBe(8);
    for (const r of after) expect(r.together.drawB).toBe(0);
    const even = s.profiles.b.pot / 8;
    for (const r of before) expect(r.together.drawB).toBeLessThanOrEqual(even + 1);
    for (const r of after) expect(sumNet(r.together)).toBeGreaterThanOrEqual(sumNet(r.own) - 0.01);
    expect(s.limit).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
    expect(s.limitDefaulted).toBe(false);
    expect(s.fast).toBe(null);
  });

  it('respects "keep at least £60,000 in B\'s pot"', () => {
    const s = split(planA(), planB(), { limit: { kind: 'keepAtLeast', who: 'b', amount: 60000 } });
    const drawnB = s.rows.reduce((t, r) => t + r.together.drawB, 0);
    expect(drawnB).toBeLessThanOrEqual(s.profiles.b.pot - 60000 + 1e-6);
    expect(drawnB).toBeGreaterThan(100000);
    expect(s.goneAt).toBe(null);
  });

  it('a limit never binds a pension\'s own draw: under "keep until 67" a smaller plan that draws £30,000 itself still draws it', () => {
    const s = split(planA(), planB({ baseSalary: 30000 }), { limit: { kind: 'untilAge', who: 'b', age: 67 } });
    for (const r of s.rows.filter((x) => x.left.b > 1e-9 || x.year === 0)) expect(r.together.drawB).toBeGreaterThanOrEqual(r.own.drawB - 1e-6);
  });

  it('equal pots and equal draws: nothing changes and there is no headline', () => {
    const same = (age) => ({ ...planA({ currentAge: age, shapeAgeNow: age, baseSalary: 40000, dbAmount: 0, statePensionYear: 67 - age }) });
    const s = split(same(62), same(62));
    expect(s.unchanged).toBe(true);
    expect(s.applies).toBe(false);
    expect(s.saving.year).toBe(0);
    expect(s.schedules.together.a).toEqual(s.schedules.own.a);
    expect(s.steps.a).toEqual([{ fromAge: 62, amount: 40000 }]);
    // two equal plans both over the band: still unchanged — at the same cost each plan's own pounds come first
    const over = split(planA({ baseSalary: 70000, dbAmount: 0 }), planA({ baseSalary: 70000, dbAmount: 0 }));
    expect(over.unchanged).toBe(true);
    // and with ISAs not on hold, drawn above the band as each plan's own policy draws them
    const isa = split(planA({ baseSalary: 70000, dbAmount: 0, isaBalance: 100000, isaDrawdownStrategy: 'minimiseEarlyTax' }), planA({ baseSalary: 70000, dbAmount: 0, isaBalance: 100000, isaDrawdownStrategy: 'minimiseEarlyTax' }));
    expect(isa.unchanged).toBe(true);
  });

  it('a saving under £1,000 a year shows no headline', () => {
    // Since §9.4 every pound is compared: an unused allowance (0p) or a quarter-tax-free pound in B's band (15p) is cheaper than
    // A's taxed pound in the band (20p), so A just over the band with B's allowance unused saves thousands. With B's State Pension
    // already using B's allowance and B fully taxed, the pounds in the band tie (each plan's own first) and only A's £730 above it moves.
    expect(split(planA({ baseSalary: 51000, dbAmount: 0 }), planB()).saving.year).toBeGreaterThan(SPLIT_HEADLINE_MIN);
    const s = split(planA({ baseSalary: 51000, dbAmount: 0 }), planB({ accessMethod: 'drawdown', statePensionYear: 0 }));
    expect(s.saving.year).toBeLessThan(SPLIT_HEADLINE_MIN);
    expect(s.fast).toBe(null);                                             // B's State Pension already in payment: no bridge, no limit, nothing faster
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

describe('the rule of section 9 (§9.6): the default limit, the fast split, every pound, the need', () => {
  it('limit null is the default limit (keep the smaller pot until its State Pension age); { kind: "none" } is no limit; an explicit limit is itself; only the default carries the fast split', () => {
    const d = split();
    expect(d.limit).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
    expect(d.limitDefaulted).toBe(true);
    expect(d.fast).toMatchObject({ saving: { year: expect.any(Number), until: expect.any(Number) } });
    // the smaller pot is whichever is smaller: the default names it
    const flipped = split(planB(), planA());
    expect(flipped.smaller).toBe('a');
    expect(flipped.limit).toEqual({ kind: 'untilAge', who: 'a', age: 67 });
    // no State Pension on the smaller plan: 67
    expect(split(planA(), planB({ statePension: 0 })).limit.age).toBe(67);
    expect(split(planA(), planB(), { limit: NONE }).fast).toBe(null);
    expect(split(planA(), planB(), { limit: { kind: 'keepAtLeast', who: 'b', amount: 1 } }).fast).toBe(null);
    // limitFrom: the form's 'none' is no limit, an absent choice the default
    expect(limitFrom({ kind: 'none' })).toEqual(NONE);
    expect(limitFrom({})).toBe(null);
    expect(limitFrom({ kind: '' })).toBe(null);
  });

  it('property: the couple\'s take-home is never lower either way, on random couples under every limit', () => {
    fc.assert(fc.property(arbCouple, (c) => {
      const s = coupleSplitNamed(c);
      for (const r of s.rows) expect(sumNet(r.together)).toBeGreaterThanOrEqual(sumNet(r.own) - 1);
    }), { numRuns: 60 });
  });

  it('property: under the default limit the smaller pot is never overdrawn before its State Pension age in the count — the cumulative draw is the check: in any bridge year the split draws more than the plan, what has been drawn so far is within the pot', () => {
    // (9.6 says "the balance at the State Pension age is not below nothing"; the count clamps the balance at nothing, so that
    // figure cannot fail — the cumulative draw in the years the split adds to the plan's own is the test that can. A year the
    // plan's OWN draw overdraws the pot is the plan's doing, not the split's, and is not held against it.)
    fc.assert(fc.property(fc.record({ a: arbPerson, b: arbPerson }), (c) => {
      const s = split(personOf(c.a), personOf(c.b));
      const k = s.smaller, K = k.toUpperCase();
      let together = 0;
      for (const r of s.rows) {
        if (r[k === 'b' ? 'ageB' : 'ageA'] >= s.untilAge) break;
        together += r.together['draw' + K];
        if (r.together['draw' + K] > r.own['draw' + K] + 1e-6) expect(together).toBeLessThanOrEqual(s.profiles[k].pot + 1);
      }
    }), { numRuns: 60 });
  });

  it('property: tax together is never above tax as written in any year both pots still have money in the count, at the same net (random couples)', () => {
    fc.assert(fc.property(arbCouple, (c) => {
      const s = coupleSplitNamed(c);
      for (const r of whileBothHaveMoney(s)) {
        if (Math.abs(sumNet(r.together) - sumNet(r.own)) > 1) continue;
        expect(sumTax(r.together)).toBeLessThanOrEqual(sumTax(r.own) + 0.01);
      }
    }), { numRuns: 60 });
  });

  it('property: the fast split saves at least as much in the first full year as the paced one, and empties the smaller pot no later (random couples)', () => {
    fc.assert(fc.property(fc.record({ a: arbPerson, b: arbPerson }), (c) => {
      const s = split(personOf(c.a), personOf(c.b));
      if (!s.fast) { expect(s.limit).toEqual(NONE); return; }             // no bridge: the default is no limit and there is nothing faster
      expect(s.fast.saving.year).toBeGreaterThanOrEqual(s.saving.year - 0.01);
      if (s.fast.goneAt != null && s.goneAt != null) expect(s.fast.goneAt).toBeLessThanOrEqual(s.goneAt);
      if (s.goneAt != null && s.fast.goneAt == null) throw new Error('the paced split emptied the pot and the fast one did not');
    }), { numRuns: 60 });
    // 9.6 asks for "gone at not after the State Pension age"; deliberately narrowed (release-notes fragment, decision 7): a pot
    // not drained during the bridge empties after the State Pension age or never, under either split, so the property is
    // "no later than the paced split" on random couples and "before 67" on the reference case alone
    const s = split();
    expect(s.fast.goneAt).toBeLessThanOrEqual(s.untilAge);
    expect(s.goneAt).toBe(s.untilAge - 1);
  });

  it('property: two equal plans change nothing, whatever the plan (random equal couples)', () => {
    fc.assert(fc.property(arbPerson, (p) => {
      const s = split(personOf(p), personOf(p));
      expect(s.unchanged).toBe(true);
      expect(s.saving.year).toBe(0);
      if (s.fast) expect(s.fast.saving.year).toBe(0);
    }), { numRuns: 60 });
  });

  it('a typed need (§9.3): the household\'s net equals it in every year both plans draw; the own draws scale to it before the fill; the "as written" column stays as written; the baseline says both', () => {
    const s = split(planA(), planB({ baseSalary: 20000, accessMethod: 'drawdown' }), { need: 50000 });
    expect(s.need).toBe(50000);
    for (const r of s.rows.filter((x) => x.activeA && x.activeB && !x.fallback)) expect(Math.abs(sumNet(r.together) - 50000)).toBeLessThan(1);
    expect(Math.round(s.baseline.net)).toBe(50000);
    expect(s.baseline.typed).toBe(50000);
    expect(Math.round(s.baseline.written)).toBe(Math.round(s.rows[0].own.netA + s.rows[0].own.netB));
    expect(s.baseline.written).toBeGreaterThan(50000);
    expect(Math.round(s.rows[0].own.grossA)).toBe(64100);                    // as written
    expect(s.rows[0].together.grossA).toBeLessThan(64100);
    // a need above the two plans' take-home raises both; none typed is the two plans' own
    const up = split(planA(), planB(), { need: 70000 });
    expect(Math.abs(sumNet(up.rows[0].together) - 70000)).toBeLessThan(1);
    expect(split(planA(), planB(), { need: null }).need).toBe(null);
    expect(split(planA(), planB(), { need: 'abc' }).need).toBe(null);
    // two equal plans at a lower typed need change proportionally and symmetrically
    const same = planA({ baseSalary: 40000, dbAmount: 0 });
    const eq = split(same, same, { need: 60000 });
    expect(Math.abs(eq.rows[0].together.grossA - eq.rows[0].together.grossB)).toBeLessThan(1);
    expect(Math.abs(sumNet(eq.rows[0].together) - 60000)).toBeLessThan(1);
  });

  it('every pound compared (§9.4): a quarter-tax-free pound inside the smaller plan\'s band replaces a taxed pound inside the bigger plan\'s band; with fully taxed pounds on both sides nothing moves below the band', () => {
    const s = split(planA({ baseSalary: 45000, dbAmount: 0 }), planB());   // A within the band, nothing above it
    const r0 = s.rows[0];
    expect(r0.together.drawB).toBeGreaterThan(0);                            // B's pounds (0p in the allowance, 15p in the band) take A's 20p ones
    expect(r0.together.taxableA).toBeLessThan(45000);
    expect(sumTax(r0.together)).toBeLessThan(sumTax(r0.own) - 1000);
    const taxed = split(planA({ baseSalary: 45000, dbAmount: 0 }), planB({ accessMethod: 'drawdown' }));
    const t0 = taxed.rows[0];
    expect(Math.round(t0.together.drawB)).toBe(12570);                       // only B's allowance (0p) is cheaper; the band ties at 20p and A's own pounds stay A's
    expect(Math.round(t0.together.taxableA)).toBe(Math.round(45000 - 12570 / 0.8));   // B's £12,570 untaxed replaces £15,713 of A's taxed pounds for the same net
    expect(Math.abs(sumNet(t0.together) - sumNet(t0.own))).toBeLessThan(1);
  });

  it('the years after the smaller pot is empty are counted (§9.5): once B\'s pot is gone in the count B draws nothing, A pays B\'s plan\'s draw at its own marginal rate, and the tax until B is 67 includes it', () => {
    const s = split(planA(), planB({ baseSalary: 30000 }));   // B's own £30,000 a year empties £185,000 before 67 in the count
    const gone = s.rows.findIndex((r) => r.left.b <= 1e-9);
    expect(gone).toBeGreaterThan(0);
    expect(s.rows[gone].ageB).toBeLessThan(67);
    const after = s.rows.slice(gone + 1).filter((r) => r.ageB < 67);
    expect(after.length).toBeGreaterThan(0);
    for (const r of after) {
      expect(r.together.drawB).toBe(0);
      expect(r.together.drawA).toBeGreaterThan(r.own.drawA);
      expect(sumNet(r.together)).toBeGreaterThanOrEqual(sumNet(r.own) - 1);
      expect(sumTax(r.together)).toBeGreaterThan(sumTax(r.own));           // the loss those years cost
    }
    const before = (rows, c) => rows.filter((r) => r.year < c).reduce((t, r) => t + r.saving, 0);   // the bridge years: before the State Pension begins
    expect(s.saving.until).toBeCloseTo(before(s.rows, s.untilC), 6);
    expect(before(after, s.untilC)).toBeLessThan(0);
  });

  it('after the smaller pension is empty in the count its ISA still pays what its plan draws from it (§9.5 moves the pension\'s draw, not the ISA\'s): B\'s pension pays nothing, B\'s ISA draw is as written while it lasts, and A\'s draw rises by what delivers B\'s pension pounds and no more', () => {
    const s = split(planA(), planB({ baseSalary: 70000, accessMethod: 'drawdown', isaBalance: 150000, isaDrawdownStrategy: 'tax-efficient' }));
    const gone = s.rows.findIndex((r) => r.left.b <= 1e-9);
    expect(gone).toBeGreaterThan(0);
    const after = s.rows.slice(gone + 1).filter((r) => r.own.isaB > 1e-6 && !r.fallback && r.left.a > 1e-9);   // while the ISA lasts in the plan's own count and A's pot has money
    expect(after.length).toBeGreaterThan(2);
    for (const r of after) {
      expect(r.together.drawB).toBe(0);
      expect(Math.abs(r.together.isaB - r.own.isaB)).toBeLessThan(1);
      expect(r.together.taxB).toBeLessThanOrEqual(r.own.taxB + 0.01);
      expect(Math.abs(sumNet(r.together) - sumNet(r.own))).toBeLessThan(1);
      // what A now pays: A's own net plus the net of B's PENSION pounds (not its ISA's), at A's rate — the gross that delivers it
      const fixedNetB = grossToNet(r.own.taxableB - r.own.drawB, BANDS.pa, BANDS.brl, BANDS.hrl);
      const pensionNetB = r.own.netB - r.own.isaB - fixedNetB;
      expect(Math.abs(r.together.grossA - netToGross(r.own.netA + pensionNetB, BANDS.pa, BANDS.brl, BANDS.hrl))).toBeLessThan(2);
      expect(sumTax(r.together)).toBeGreaterThan(sumTax(r.own));           // the cost of those years, counted (§9.5)
    }
    // a partner with no pension at all (an ISA alone) is not "emptied" by the count: nothing is forced, the two columns agree
    const isaOnly = split(planA(), planB({ baseSalary: 15000, accessMethod: 'drawdown', equityMin: 0, bondMin: 0, cashTarget: 0, isaBalance: 200000, isaDrawdownStrategy: 'tax-efficient' }));
    expect(isaOnly.unchanged).toBe(true);
    expect(isaOnly.tax.until.together).toBeCloseTo(isaOnly.tax.until.own, 6);
  });

  it('the paced count can move nothing while the fast split saves (the smaller plan\'s own draw at or above its paced cap): unchanged and no comparison, but the fast split\'s figures are there to offer, and no limit gives them', () => {
    const s = split(planA(), planB({ baseSalary: 30000 }));
    expect(s.unchanged).toBe(true);
    expect(s.applies).toBe(false);
    expect(s.fast.saving.year).toBeGreaterThan(SPLIT_HEADLINE_MIN);
    expect(s.fast.saving.until).toBeLessThan(0);                          // the years after the pot is empty, at A's rate, outweigh the first years
    expect(s.fast.goneAt).toBeLessThan(s.untilAge);
    const f = split(planA(), planB({ baseSalary: 30000 }), { limit: NONE });
    expect(f.applies).toBe(true);
    expect(f.unchanged).toBe(false);
    expect(Math.round(f.saving.year)).toBe(Math.round(s.fast.saving.year));
  });

  it('no bridge to keep the pension for (§9.2): with the smaller plan\'s State Pension already in payment in the first year both plans draw, the default is no limit — the split applies and there is nothing faster', () => {
    const both = split(planA({ currentAge: 68, shapeAgeNow: 68, statePensionYear: 0 }), planB({ currentAge: 68, shapeAgeNow: 68, statePensionYear: 0 }));
    expect(both.limit).toEqual(NONE);
    expect(both.limitDefaulted).toBe(true);
    expect(both.fast).toBe(null);
    expect(both.applies).toBe(true);
    expect(both.saving.year).toBeGreaterThan(SPLIT_HEADLINE_MIN);
    expect(both.untilC).toBe(0);
    expect(headlineWords(both).headline).toBe('Drawing together saves about ' + about(both.saving.year) + ' a year in tax — about ' + about(both.saving.whole) + ' over the whole plan.');
    // the smaller at its State Pension age with the larger plan younger: the same
    const one = split(planA(), planB({ currentAge: 67, shapeAgeNow: 67, statePensionYear: 0 }));
    expect(one.limit).toEqual(NONE);
    expect(one.applies).toBe(true);
    // the larger plan still working until the smaller's State Pension is in payment: nothing can move before then, so no limit either
    const later = split(planA({ retired: false, currentAge: 60, retireAge: 70, shapeAgeNow: 70 }), planB({ currentAge: 59, shapeAgeNow: 59, statePensionYear: 8 }));
    expect(later.limit).toEqual(NONE);
    // a bridge still to come keeps the default limit
    expect(split().limit).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
  });

  it('a chosen limit is the smaller pension\'s whichever side it names: "keep until 67" given for A binds B\'s pot when B\'s is the smaller', () => {
    const s = split(planA(), planB(), { limit: { kind: 'untilAge', who: 'a', age: 67 } });
    expect(s.limit).toEqual({ kind: 'untilAge', who: 'b', age: 67 });
    expect(s.rows.filter((r) => r.ageB < 67).every((r) => Math.abs(r.together.drawB - 23125) < 1)).toBe(true);
    expect(s.goneAt).toBe(66);
    const k = split(planA(), planB(), { limit: { kind: 'keepAtLeast', amount: 100000 } });
    expect(k.limit).toEqual({ kind: 'keepAtLeast', amount: 100000, who: 'b' });
    expect(k.goneAt).toBe(null);
  });

  it('"Use this split" under a typed need (§9.3): the steps it writes deliver the typed need — planDrawdown on each plan\'s first step nets £50,000 between them — and the writes are the five keys of the income shape', () => {
    const a = planA(), b = planB({ baseSalary: 20000, accessMethod: 'drawdown' });
    const s = split(a, b, { need: 50000 });
    const dA = planDrawdown({ targetGross: s.steps.a[0].amount, fixedIncome: 6100, ...BANDS, isaBalance: 0, strategy: 'hold', taxFreeFraction: 0 });
    const dB = planDrawdown({ targetGross: s.steps.b[0].amount, fixedIncome: 0, ...BANDS, isaBalance: 0, strategy: 'hold', taxFreeFraction: 0 });
    expect(Math.abs(dA.net + dB.net - 50000)).toBeLessThan(2);           // the steps are rounded to the pound
    expect(s.settings.a.targetSchedule[0]).toBe(s.steps.a[0].amount);
    const planOf = (id, name, settings) => ({ id, planDetails: { name }, stressTool: { settings }, decisionTool: { settings: {} } });
    const p = splitPatches(planOf('a', 'A', a), planOf('b', 'B', b), s, { today: '2026-10-17' });
    expect(p.ok).toBe(true);
    expect(p.mode).toBe('write');
    for (const w of p.writes) expect(Object.keys(w.patch).sort()).toEqual(SPLIT_KEYS.map((key) => 'stressTool.settings.' + key).sort());
    expect(p.writes[0].patch['stressTool.settings.incomeSteps'][0]).toEqual(s.steps.a[0]);
  });

  it('the first full year is the first both plans draw in: a partner still working and a typed need do not make the lone plan\'s year the headline\'s', () => {
    const b = planB({ retired: false, currentAge: 55, retireAge: 60, shapeAgeNow: 60 });
    const s = split(planA(), b, { need: 50000 });
    expect(s.tax.firstYear.year).toBe(s.rows.findIndex((r) => r.activeA && r.activeB));
    expect(s.madeOf.year).toBe(s.tax.firstYear.year);
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
    const s = split(planA({ strategyId: 'full-il-gilt', strategyParams: { sippTotal: 900000 } }), planB());
    expect(s.ladderNote).toContain('A’s plan is a gilt ladder');
    expect(s.ladderNote).toContain('stays as cash');
    expect(split().ladderNote).toBe('');
    // the money left over in shares (6.35.0): the freed money joins it; another bought strategy is not called a gilt ladder
    const g = split(planA({ strategyId: 'gilt-rotation', strategyParams: { sippTotal: 900000, spareGrowth: true } }), planB());
    expect(g.ladderNote).toContain('joins the money left over in shares');
    expect(g.ladderNote).not.toContain('stays as cash');
    const f = split(planA({ strategyId: 'floor-to-age', strategyParams: { sippTotal: 900000 } }), planB());
    expect(f.ladderNote).toContain('A’s plan buys its income');
    expect(f.ladderNote).not.toContain('gilt ladder');
    const flex = split(planA({ strategyId: 'floor-and-flex', strategyParams: { sippTotal: 900000 } }), planB());
    expect(flex.ladderNote).toContain('A’s plan buys part of its income and invests the rest');
  });

  it('steps and settings helpers', () => {
    expect(stepsFromSchedule([50270, 50270, 40000.4, 40000], 62)).toEqual([{ fromAge: 62, amount: 50270 }, { fromAge: 64, amount: 40000 }]);
    const st = settingsWithSchedule({ pa: 1, spendingProfile: 'declining' }, [100.4, 200], [{ fromAge: 1, amount: 100 }]);
    expect(st).toMatchObject({ pa: 1, incomeShape: 'phases', baseSalary: 100, spendingProfile: 'flat', targetSchedule: [100, 200] });
    expect(limitFrom({ kind: 'untilAge', age: '67' })).toEqual({ kind: 'untilAge', age: 67 });   // no side: householdDrawSplit names the smaller pension
    expect(limitFrom({ kind: 'keepAtLeast', amount: 0 })).toBeNull();
    expect(about(14649)).toBe('£14,600');
    expect(about(139900)).toBe('£140,000');
    expect(about(21500)).toBe('£22,000');
  });

  it('the table figures read the runs: pots at ages from each plan\'s cone, the household verdict pooled first', () => {
    const s = split();
    const mk = (startAge, dur, p50, terminal) => ({ affordable: true, ruin: { mc: 10 }, cones: { wealth: { p50: Array.from({ length: dur + 1 }, (_, y) => p50 - y * 1000), p10: [] } }, terminal: { p50: terminal },
      survivedMc: [true, false, true, true], futuresMc: { terminal: [terminal, 0, terminal, terminal], failYear: [null, 3, null, null] }, samples: { wealth: [[p50, p50], [0, 0], [p50, p50], [p50, p50]] } });
    const rA = mk(64, 28, 900000, 500000), rB = mk(59, 33, 100000, 20000);
    const combined = combineHouseholdStrategies(rA, rB, { needA: s.needs.together.a, needB: s.needs.together.b, startAgeA: 64, startAgeB: 59 });
    expect(combined.pooled.success).toBeGreaterThanOrEqual(combined.jointSuccess);
    const fig = comparisonFigures(s, { own: { combined, rA, rB }, together: { combined, rA, rB } });
    expect(fig.own.potA[0]).toBe(900000 - 3000);   // A at 67 = plan year 3
    expect(fig.own.potB[0]).toBe(100000 - 8000);   // B at 67 = plan year 8
    expect(fig.own.lasts.household.n).toBe(Math.round(combined.pooled.success * 10));
    expect(fig.own.lasts.a.n).toBe(9);
    const w = headlineWords(s, fig);
    expect(w.cost).toContain('about ' + about(fig.cost.together) + ' at 67');
    expect(w.closing).toContain('better off at 90');
  });
});
