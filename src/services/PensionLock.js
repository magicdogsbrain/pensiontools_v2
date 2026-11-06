/**
 * The years a plan cannot take money from a pension (7.4.1, research design section 7 "Risks": early retirement before
 * 55/57). A defined-contribution pension cannot be drawn in a plan year in which its holder is younger than their minimum
 * pension age (services/PensionAge.js, the one rule; PlanTiming.accessAgeOf, their own). Until 7.4.1 no engine held it
 * back: a plan that started at 50 drew its pension from year 0 and only said so in words (7.4.0). Every engine that
 * draws a pension year by year now reads the one helper here and keeps its pension untouched (and growing) in those years:
 *
 *   pensionLockOf(settings, { now, fromTaxYear, pensionPot })   the closed years of one person's plan, or null
 *   payClosedYears(needByYear, years, money)                    those years paid in order from the money outside the pension
 *   closedYearsWords(lock)                                      what the plan does, or the warning when the money runs short
 *
 * What pays the closed years is the money outside the pension, in the plan's own order: the taxable account and lump sums
 * first, then the ISA (a held ISA too: in those years it is the only money there is, as a held ISA always rescues a plan
 * whose pension has run out). When it cannot pay a year's need the year's income is cut to what it can pay — each engine
 * through its own cut, never a new one — and the plan says by how much. A final-salary pension and the State Pension are
 * not touched; they start when they start. Couples: each plan is one person's, so each is closed by its own holder's age.
 *
 * Every plan whose holder is at or past their access age in the run's first year gets null, and every engine runs exactly
 * as before: the figures cannot move.
 *
 * Pure: no storage, no DOM; the clock only as `now`.
 */
import { deriveTiming, ageInTaxYear, accessAgeOf, taxYearLabel, sippTodayOf } from './PlanTiming.js';

/**
 * The closed years of one person's plan, counted from the tax year its run starts in (`fromTaxYear`: the plan's year 0, or
 * the plan year a run seen from today starts in — PlanFromToday). Plan years are tax years, and a plan year's age is the
 * age reached in it (PlanTiming's convention): a year is closed while that age is below the person's access age, so the
 * year they reach it is the first the pension pays. Null without an age, for a plan with no pension to draw (`pensionPot`,
 * the pension the run starts from; when not given, the plan's own pots today or at retirement), and when nothing is closed.
 * @returns {null | { accessAge: number, years: number, fromTaxYear: number, opensTaxYear: number }}
 */
export function pensionLockOf(settings, { now = new Date(), fromTaxYear = null, pensionPot = null } = {}) {
  const s = settings || {};
  if (!(+s.currentAge > 0)) return null;
  let t = null; try { t = deriveTiming(s, now); } catch { t = null; }
  if (!t || t.mode === 'legacy') return null;
  let pot = 0;
  if (pensionPot != null) pot = +pensionPot || 0;
  else { try { pot = sippTodayOf(s); } catch { pot = 0; } if (!(pot > 0)) pot = +(s.potAtRetirement && s.potAtRetirement.sipp) || 0; }
  if (!(pot > 0)) return null;
  const accessAge = accessAgeOf(s, now);
  const from = fromTaxYear != null && Number.isFinite(+fromTaxYear) ? +fromTaxYear : +t.firstTaxYear;
  const ageThen = ageInTaxYear(s, from, now);
  if (accessAge == null || ageThen == null || !(ageThen < accessAge)) return null;
  const years = accessAge - ageThen;
  return { accessAge, years, fromTaxYear: from, opensTaxYear: from + years };
}

/** The pension an engine config's run starts from: its pots (shares, bonds, cash and the diversifiers sleeve). */
export function pensionPotOf(cfg) {
  const c = cfg || {};
  return (+c.equityStart || 0) + (+c.bondStart || 0) + (+c.cashStart || 0) + (+c.diversifierStart || 0);
}

/**
 * The closed years paid in order from the money outside the pension, held at its real value until it is spent (the bought
 * strategies' own assumption for money parked to pay a later year: stressTest.applyWindfallsToNeed). `needByYear[y]` is
 * what the pots must pay in run year y, before tax, today's money; `money` what there is outside the pension.
 *
 * That money is tax-free in the hand, so it need only pay what the pension's pounds would have left after tax: `costOf(y, g)`
 * is what paying `g` of the year's need costs it, and `grossFor(y, m)` how much of the need `m` of it pays (the inverse).
 * Without them a pound pays a pound.
 * @returns {{ paid: number[], unpaid: number[], spent: number[], used: number, left: number }}   paid and unpaid in the
 *   need's terms; spent (each year's), used and left in the money's
 */
export function payClosedYears(needByYear, years, money, { costOf = null, grossFor = null } = {}) {
  const start = Math.max(0, +money || 0);
  let left = start;
  const paid = [], unpaid = [], spent = [];
  for (let y = 0; y < Math.max(0, years); y++) {
    const need = Math.max(0, +(needByYear && needByYear[y]) || 0);
    const cost = costOf ? Math.max(0, costOf(y, need)) : need;
    let p;
    if (cost <= left) { p = need; spent.push(cost); left -= cost; }
    else { p = grossFor ? Math.min(need, Math.max(0, grossFor(y, left))) : left; spent.push(left); left = 0; }
    paid.push(p); unpaid.push(need - p);
  }
  return { paid, unpaid, spent, used: start - left, left };
}

/**
 * What a plan's closed years leave unpaid, for the words: the years short (from the run's first tax year), and about how
 * much a year (the average over those years, to the nearest £100). Null when every closed year is paid.
 * @param {{ fromTaxYear: number, unpaid: number[] }} lock
 */
export function closedYearsShort(lock) {
  if (!lock || !Array.isArray(lock.unpaid)) return null;
  const short = lock.unpaid.map((v, y) => ({ y, v })).filter((x) => x.v > 1);
  if (!short.length) return null;
  const perYear = short.reduce((a, x) => a + x.v, 0) / short.length;
  const first = lock.fromTaxYear + short[0].y, last = lock.fromTaxYear + short[short.length - 1].y;
  return { perYear: Math.max(100, Math.round(perYear / 100) * 100), firstTaxYear: first, lastTaxYear: last, years: short.length };
}

/** The tax years of a shortfall, as the plan names them: "2027/28", or "2027/28 to 2029/30". */
export function shortYearsWords(short) {
  return short.firstTaxYear === short.lastTaxYear ? taxYearLabel(short.firstTaxYear) : taxYearLabel(short.firstTaxYear) + ' to ' + taxYearLabel(short.lastTaxYear);
}

/**
 * The words for a plan's closed years, in both apps: what the plan does, or — when the money outside the pension cannot pay
 * them — the warning, with about how much a year it is short and in which years.
 * @param {{ accessAge: number, fromTaxYear?: number, unpaid?: number[] }} lock
 */
export function closedYearsWords(lock) {
  const short = closedYearsShort(lock);
  if (!short) return 'Before ' + lock.accessAge + ', this plan pays you from your other savings, not your pension.';
  return 'Before ' + lock.accessAge + ' your plan can’t take money from your pension. Your other savings run short by about £'
    + short.perYear.toLocaleString('en-GB') + ' a year in ' + shortYearsWords(short) + '.';
}
