import { describe, it, expect } from 'vitest';
import {
  glidePathValue, spendableSurplus, priceRung,
  evaluateBandTrigger, evaluateCalendarReview, calendarReviewMonths
} from '../src/services/TriggerComponent.js';
import { resolveIncomeProfile, profileTargetForYear } from '../src/services/IncomeProfile.js';
import { spendingSmileFactor } from '../src/services/SpendingModel.js';

const DRAW = 27500, RY = 0.023, GP = 0.05, E0 = 183500;
const price = (k, t) => priceRung(DRAW, RY, k, t);

describe('TriggerComponent — Appendix A semantics', () => {
  it('rung pricing matches the reference formula', () => {
    expect(priceRung(48500, 0.023, 20, 60)).toBeCloseTo(48500 * Math.pow(1.023, -(20 - 5)), 6);
  });

  it('band geometry: a skim from b×G to G sells at most 1 − 1/b of the sleeve (any b > 1)', () => {
    for (const b of [1.05, 1.2, 1.5, 2.0]) {
      const t = 60;
      const V = b * glidePathValue(E0, GP, t) * 1.000001;
      const r = evaluateBandTrigger({ sleeveValue: V, tMonths: t, E0, glideRate: GP,
        bandThreshold: b, nextRung: 24, maxRung: 35, priceForYear: price });
      const soldFrac = r.spent / V;
      expect(soldFrac).toBeLessThanOrEqual(1 - 1 / b + 1e-9);
    }
  });

  it('whole rungs, sequential, capped at the horizon; never spends more than the excess', () => {
    const t = 12;
    const V = 3 * glidePathValue(E0, GP, t); // huge surplus
    const r = evaluateBandTrigger({ sleeveValue: V, tMonths: t, E0, glideRate: GP,
      bandThreshold: 1.2, nextRung: 24, maxRung: 26, priceForYear: price });
    expect(r.bought).toBe(3);                               // 24, 25, 26 then stops at cap
    expect(r.nextRung).toBe(27);
    expect(r.spent).toBeLessThanOrEqual(V - glidePathValue(E0, GP, t) + 1e-6);
  });

  it('band_threshold → ∞ reproduces the never-trigger branch exactly (metamorphic)', () => {
    const r = evaluateBandTrigger({ sleeveValue: 1e12, tMonths: 60, E0, glideRate: GP,
      bandThreshold: 1e15, nextRung: 24, maxRung: 35, priceForYear: price });
    expect(r.fires).toBe(false);
    expect(r.bought).toBe(0);
  });

  it('a deterministic path of exactly g never triggers (sleeve rides the path)', () => {
    for (let t = 1; t <= 180; t++) {
      const V = glidePathValue(E0, GP, t);   // exactly on path
      const r = evaluateBandTrigger({ sleeveValue: V, tMonths: t, E0, glideRate: GP,
        bandThreshold: 1.2, nextRung: 24, maxRung: 35, priceForYear: price });
      expect(r.fires).toBe(false);
    }
  });

  it('spendable_surplus is max(0, sleeve − G) at every t', () => {
    expect(spendableSurplus(200000, E0, GP, 0)).toBeCloseTo(200000 - E0, 6);
    expect(spendableSurplus(100000, E0, GP, 0)).toBe(0);
  });

  it('calendar cadence generalises: 5-yearly / annual / monthly review dates', () => {
    expect(calendarReviewMonths({ everyNYears: 5 }, 180)).toEqual([60, 120, 180]);
    expect(calendarReviewMonths('annual', 36)).toEqual([12, 24, 36]);
    expect(calendarReviewMonths('monthly', 3)).toEqual([1, 2, 3]);
    const r = evaluateCalendarReview({ sleeveValue: 2 * glidePathValue(E0, GP, 60), tMonths: 60,
      E0, glideRate: GP, nextRung: 24, maxRung: 35, priceForYear: price, maxRungsPerReview: 2 });
    expect(r.bought).toBe(2);                               // per-review cap respected
  });
});

describe('IncomeProfile — canonical profiles', () => {
  it('back-compat mapping is exact: taper == the shared smile; schedule passes through', () => {
    const taper = resolveIncomeProfile({ spendingProfile: 'declining' });
    for (const y of [0, 4, 5, 15, 24, 25, 34]) {
      expect(profileTargetForYear(taper, y, 40000)).toBeCloseTo(40000 * spendingSmileFactor(y, 'declining'), 9);
    }
    const sched = resolveIncomeProfile({ targetSchedule: [50000, 30000] });
    expect(profileTargetForYear(sched, 0, 99)).toBe(50000);
    expect(profileTargetForYear(sched, 1, 99)).toBe(30000);
    expect(profileTargetForYear(sched, 5, 42000)).toBe(42000); // past the schedule → anchor
  });

  it('phases: the user\'s live plan (£60k for 10 years, then £36.5k) is expressible directly', () => {
    const p = { type: 'phases', phases: [{ fromYear: 0, amount: 60000 }, { fromYear: 10, amount: 36500 }] };
    expect(profileTargetForYear(p, 0, 0)).toBe(60000);
    expect(profileTargetForYear(p, 9, 0)).toBe(60000);
    expect(profileTargetForYear(p, 10, 0)).toBe(36500);
    expect(profileTargetForYear(p, 30, 0)).toBe(36500);
  });

  it('a phases profile with all stages equal matches the flat run to the penny (metamorphic)', () => {
    const p = { type: 'phases', phases: [{ fromYear: 0, amount: 40000 }, { fromYear: 10, amount: 40000 }] };
    for (let y = 0; y < 35; y++) expect(profileTargetForYear(p, y, 40000)).toBe(40000);
  });
});
