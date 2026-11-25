/**
 * A year's income before tax, as the person takes it (7.12.0). ONE function for every page that says "a year before tax".
 *
 * The plan holds its income as the engines read it: the target, a year "before tax" counted as if every pound of it were
 * taxed (BudgetModel.grossUpAnnual of what is wanted after tax; SimulationEngine and the Decision tool turn it back into
 * the after-tax figure with grossToNet). When every withdrawal is taxed that IS what is taken before tax. When a quarter of
 * each pension withdrawal is tax-free (accessMethod 'ufpls'), less is taken for the same income after tax: the engines
 * draw the pension figure planDrawdown works out (DrawdownStrategy, taxFreeFraction 0.25), and that — with the State
 * Pension and other income the target counts — is what reaches the bank before tax. Until 7.12.0 the pages said the
 * target (£2,400 a month after tax: £32,858) while the months and the plan document's year took the smaller figure
 * (£30,925). These two read the one rule both ways:
 *
 *   takenBeforeTax(target, { taxFreeFraction, fixed, pa, brl, hrl }) → the year before tax as taken
 *   targetOfTaken(taken, { … })                                       → the target that takes it (a typed figure, back)
 *
 * `fixed`: the State Pension and other taxable income in the year (they are part of the target and are taken as they are).
 * With no tax-free share both return what they are given. Pure; no rounding.
 */
import { planDrawdown } from './DrawdownStrategy.js';
import { grossToNet, netToGross } from './TaxCalculator.js';
import { taxFreeFractionOf } from './FlexibleAccess.js';
import { monthsOf, spIn, otherIn } from './PaidYear.js';

const DEFAULT_BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const n = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

function bandsOf(o) {
  return { pa: n(o.pa, DEFAULT_BANDS.pa), brl: n(o.brl, DEFAULT_BANDS.brl), hrl: n(o.hrl, DEFAULT_BANDS.hrl) };
}

export function takenBeforeTax(target, o = {}) {
  const t = n(target);
  const f = Math.max(0, Math.min(0.75, n(o.taxFreeFraction)));
  if (!(f > 0) || !(t > 0)) return t;
  const fixed = Math.max(0, n(o.fixed));
  const { pa, brl, hrl } = bandsOf(o);
  const p = planDrawdown({ targetGross: t, fixedIncome: fixed, pa, brl, hrl, isaBalance: 0, taxFreeFraction: f });
  return p.sippGross + fixed;
}

export function targetOfTaken(taken, o = {}) {
  const t = n(taken);
  const f = Math.max(0, Math.min(0.75, n(o.taxFreeFraction)));
  if (!(f > 0) || !(t > 0)) return t;
  const fixed = Math.max(0, n(o.fixed));
  const { pa, brl, hrl } = bandsOf(o);
  const drawn = Math.max(0, t - fixed);
  const net = grossToNet(fixed + (1 - f) * drawn, pa, brl, hrl) + f * drawn;
  return netToGross(net, pa, brl, hrl);
}

/** The share of each withdrawal that is tax-free in a plan's first year as its settings say (FlexibleAccess's own rule). */
export const taxFreeShareOf = (settings) => taxFreeFractionOf(settings || {}, [], 0);

/**
 * (7.12.0) A plan's own figure for a year (an income step, a try, the aim: held as the engines read it) as every page says
 * "a year before tax": what is taken, with the plan's own tax-free share (its access method) and the income that comes in
 * anyway that year (`fixed`, taken as it is). Whole pounds. With no tax-free share it is the figure as held.
 * `bands` { pa, brl, hrl } (the plan's own; the defaults otherwise).
 */
export function takenOfTarget(target, settings, { fixed = 0, bands = null } = {}) {
  const t = n(target);
  const f = taxFreeShareOf(settings);
  if (!(f > 0) || !(t > 0)) return Math.round(t);
  const b = bands || {};
  return Math.round(takenBeforeTax(t, { taxFreeFraction: f, fixed, pa: b.pa, brl: b.brl, hrl: b.hrl }));
}

/**
 * (ruling Z1) A year's figure as the engines hold it (the target: every pound taxed) for the run's year `k` of plan `p`, as
 * taken before tax: the year for the months it has (services/PaidYear.js: a part year is the rate of its months, then its
 * share) with the income that comes in anyway in it (`fixed`, in pounds of that year; absent, the plan's own State Pension
 * and other income in it, PaidYear spIn / otherIn), at the tax-free share `share`. With no share: the figure. No rounding.
 */
export function yearTakenOf(target, { p = null, k = 0, share = 0, bands = null, fixed = null } = {}) {
  const t = +target || 0;
  if (!(share > 0) || !(t > 0)) return t;
  const m = p ? monthsOf(p, k) : 12, r = m / 12;
  const f = fixed != null ? Math.max(0, +fixed || 0) : p ? spIn(p, k) + otherIn(p, k) : 0;
  const b = bands || {};
  return takenBeforeTax(t / r, { taxFreeFraction: share, fixed: f / r, pa: b.pa, brl: b.brl, hrl: b.hrl }) * r;
}

/**
 * The ways of drawing whose engine takes from the pension the figure planDrawdown works out (SimulationEngine: Pots &
 * Valves and Buckets in order), so a tax-free part takes less before tax than the figure held. A way that buys its income
 * pays the figure as held (its rungs and floors are bought on it), so what is taken is that figure: no conversion.
 */
export const takesAsDrawn = (strategyId) => (strategyId || 'pots-and-valves') === 'pots-and-valves' || strategyId === 'buckets-in-order';
