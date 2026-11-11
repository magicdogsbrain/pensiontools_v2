/**
 * When the money runs out, how much of the plan is still paid, and what comes in after it has (7.8.0: the build spec's
 * section 4), at the amount an answer stands behind, from the months each future ran out in. No runs.
 *
 *   shortfallOf(plan, months, H, { toMonth })
 *     months   each future's run-out month from the drawing start (null: it lasted to the run's end)
 *     H        the year-0 amount a year (take-home) the answer stands behind
 *     toMonth  the plan-to age's month (12 × (plan.endAge − plan.startAge))
 *   → {
 *       when      null when no future ran out; else { typical, worst, worstLasts }
 *                   typical: the middle of the failing futures' run-out ages (the younger person's, startAge + ⌊m/12⌋)
 *                   worst:   the worst 1 in 10 of all the futures (position ⌊n/10⌋ of every future's age, a future that
 *                            lasted read at the plan-to age); worstLasts when that is at or past the plan-to age
 *       howLong   null when none ran out before the plan-to age; else { paid, of }: the failing futures' mean years paid
 *                 (to the plan-to age at most, whole years), against the years to the plan-to age
 *       howMuch   1 when none ran out before the plan-to age; else 1 − unpaid / planned over those futures, to the plan-to
 *                 age: unpaid is what the pots would have paid from the run-out (the first year pro rata), planned every
 *                 year's amount (toEngine potsNeedByYear, amountInYear)
 *       floor     null when none ran out; else at the typical age { age, yearly, survivor, spAge }:
 *                   yearly    after tax, the State Pensions and final-salary pensions paid that year (work left out)
 *                   survivor  a couple: the lower of the two people's own (no survivor's share is asked for)
 *                   sp, fs    how many State Pensions are paid then; whether a final-salary pension is
 *                   spAge     nothing paid yet: the age the first State Pension starts (null when none does)
 *     }
 *
 * Pure: no clock, no storage.
 */
import { grossToNet } from '../../services/TaxCalculator.js';
import { BANDS, potsNeedByYear, amountInYear } from './toEngine.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const net = (g) => (g > 0 ? grossToNet(g, BANDS.pa, BANDS.brl, BANDS.hrl) : 0);
const round = (x) => Math.round(x);

/** The period of a plan year y falls in (the last one past the plan's end). */
function periodAt(plan, y) {
  const ps = plan.periods || [];
  return ps.find((p) => y >= p.from && y < p.to) || ps[ps.length - 1] || null;
}

/**
 * What comes in after tax in plan year y with no pot: State Pensions and final-salary pensions (work left out), the
 * household's, and for a couple the lower of the two people's own.
 */
export function floorAtYear(plan, y) {
  const per = periodAt(plan, y);
  if (!per) return { yearly: 0, survivor: null, sp: 0, fs: false };
  const own = per.byPerson.map((b) => net((b.statePension || 0) + (b.finalSalary || 0)));
  return {
    yearly: round(own.reduce((s, v) => s + v, 0)), survivor: own.length > 1 ? round(Math.min(...own)) : null,
    sp: per.byPerson.filter((b) => b.statePension > 0).length, fs: per.byPerson.some((b) => b.finalSalary > 0)
  };
}

/** The age (the younger person's) the first State Pension in the plan starts at, after year y; null when none does. */
function spStartAfter(plan, y) {
  const starts = (plan.people || []).filter((p) => p.statePension && p.statePension.amount > 0 && p.statePension.startYear > y).map((p) => p.statePension.startYear);
  return starts.length ? plan.startAge + Math.min(...starts) : null;
}

export function shortfallOf(plan, months, H, { toMonth = Infinity } = {}) {
  const n = months.length;
  const toYears = Number.isFinite(toMonth) ? toMonth / 12 : plan.years;
  const ageOf = (m) => plan.startAge + Math.floor(m / 12);
  const failing = months.filter((m) => m !== null && isNum(m));
  if (!n || !failing.length) return { when: null, howLong: null, howMuch: 1, floor: null };

  // when: the middle of the failing futures' ages; the worst 1 in 10 of all of them
  const ages = failing.map(ageOf).sort((a, b) => a - b);
  const typical = ages[Math.floor((ages.length - 1) / 2)];
  const all = months.map((m) => (m === null || !isNum(m) || m >= toMonth ? plan.endAge : ageOf(m))).sort((a, b) => a - b);
  const worst = all[Math.floor(n / 10)];
  const when = { typical, worst, worstLasts: worst >= plan.endAge };

  // how long and how much, over the futures that ran out before the plan-to age
  const early = failing.filter((m) => m < toMonth);
  let howLong = null;
  let howMuch = 1;
  if (early.length) {
    const paid = early.reduce((s, m) => s + Math.min(m / 12, toYears), 0) / early.length;
    howLong = { paid: Math.floor(paid), of: Math.round(toYears) };
    const need = potsNeedByYear(plan, H);
    const Y = Math.min(need.length, Math.ceil(toYears));
    let planned = 0;
    for (let y = 0; y < Y; y++) planned += amountInYear(plan, H, y);
    let unpaid = 0;
    for (const m of early) {
      const y0 = Math.floor(m / 12);
      for (let y = y0; y < Y; y++) unpaid += y === y0 ? need[y] * (1 - (m - 12 * y0) / 12) : need[y];
    }
    howMuch = planned > 0 ? Math.max(0, Math.min(1, 1 - unpaid / (early.length * planned))) : 1;
  }

  const fy = Math.max(0, typical - plan.startAge);
  const f = floorAtYear(plan, fy);
  const floor = { age: typical, yearly: f.yearly, survivor: f.survivor, sp: f.sp, fs: f.fs, spAge: f.yearly > 0 ? null : spStartAfter(plan, fy) };
  return { when, howLong, howMuch, floor };
}
