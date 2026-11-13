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
 *       howLong   null when none ran out before the plan-to age, or when what comes in anyway meets what you planned to
 *                 spend in every year after it ran out (then nothing goes unmet); else { paid, of, anyway }: the failing
 *                 futures' mean years in which what you planned to spend is met (to the plan-to age at most, whole years):
 *                 the years the pots paid, and each later year in which what comes in anyway meets it (`anyway`: some
 *                 did), against the years to the plan-to age
 *       howMuch   1 when none ran out before the plan-to age; else 1 − unpaid / planned over those futures, to the plan-to
 *                 age: unpaid is what the pots would have paid from the run-out (the first year pro rata), planned every
 *                 year's amount (toEngine potsNeedByYear, amountInYear)
 *       floor     null when none ran out; else at the typical age { age, yearly, survivor, spAge }:
 *                   yearly    after tax, the State Pensions and final-salary pensions paid that year (work left out)
 *                   survivor  a couple: the lower of the two people's own (no survivor's share is asked for); 0 is said
 *                             as nothing coming in for the one left
 *                   sp, fs    how many State Pensions are paid then; whether a final-salary pension is
 *                   spAge     nothing paid yet: the age the first State Pension starts (null when none does)
 *       left      absent when not worked out; else what is left at the plan-to age at today's prices, from each future's
 *                 figure (`opts.left`, band.js leftAt: £0 where the money ran out before then) — { typical, best, mostNone }:
 *                   typical   the middle of all the futures, to the nearest £1,000
 *                   best      the best 1 in 10 (position n − ⌈n/10⌉ of them in order), to the nearest £1,000
 *                   mostNone  more than half the futures have nothing left then
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

/** What is left at the plan-to age, from each future's figure at today's prices (null: not worked out). */
export function leftOf(values) {
  if (!values || !values.length) return null;
  const s = Array.from(values).sort((a, b) => a - b);
  const n = s.length;
  const k = (x) => Math.round(x / 1000) * 1000;
  return { typical: k(s[Math.floor((n - 1) / 2)]), best: k(s[Math.max(0, n - Math.ceil(n / 10))]), mostNone: s.filter((v) => !(v > 0)).length * 2 > n };
}

export function shortfallOf(plan, months, H, { toMonth = Infinity, left = null } = {}) {
  const n = months.length;
  const toYears = Number.isFinite(toMonth) ? toMonth / 12 : plan.years;
  const ageOf = (m) => plan.startAge + Math.floor(m / 12);
  const failing = months.filter((m) => m !== null && isNum(m));
  const leftSaid = leftOf(left);
  if (!n || !failing.length) return { when: null, howLong: null, howMuch: 1, floor: null, ...(leftSaid ? { left: leftSaid } : {}) };

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
    const need = potsNeedByYear(plan, H);
    const Y = Math.min(need.length, Math.ceil(toYears));
    // a year after the run-out in which what comes in anyway meets what you planned (the pots would pay nothing in it) is a
    // year the spending is still met: counted, so "how long" never reads short while the floor pays the whole spend
    const met = (y) => !(need[y] > 1);
    let anyway = false;
    const paid = early.reduce((s, m) => {
      let years = Math.min(m / 12, toYears);
      for (let y = Math.floor(m / 12) + 1; y < Y; y++) if (met(y)) { years += 1; anyway = true; }
      return s + Math.min(years, toYears);
    }, 0) / early.length;
    // (met in every year: nothing to say — "how much" says all of it is paid)
    if (Math.floor(paid) < Math.round(toYears)) howLong = { paid: Math.floor(paid), of: Math.round(toYears), ...(anyway ? { anyway: true } : {}) };
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
  return { when, howLong, howMuch, floor, ...(leftSaid ? { left: leftSaid } : {}) };
}
