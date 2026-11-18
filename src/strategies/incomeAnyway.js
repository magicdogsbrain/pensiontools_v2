/**
 * The income that comes anyway: the State Pension, a final-salary pension, other income and any extra income streams.
 * It is paid whatever the markets do and whether or not the pots have run out, so:
 *  - "worst 12 months" counts it after a run has run out of money (it was £0 there: a run that ran out read as a
 *    person living on nothing, beside a sentence saying the State Pension still comes);
 *  - the guaranteed line names every source of it (it said "State Pension only" beside a final-salary pension).
 * One reader for the Pots & Valves family's histories, futures and named starts (stressTest.js pnvRun) and the compare's
 * canned decades (compareRunner.js runPnvWindows).
 */
import { incomeAnywayByMonth } from '../services/SimulationEngine.js';

/**
 * A run's monthly income (today's money) carried on to `months` months: the months after the run ran out of money are
 * the income that comes anyway, read from the engine's own fixed income on the same returns.
 */
export function withIncomeAnyway(inc, cfg, returns, months) {
  if (inc.length >= months) return inc;
  const anyway = incomeAnywayByMonth(cfg, returns, months);
  return inc.concat(anyway.slice(inc.length));
}

/** The lowest sum of any 12 months running, or 0 when there are fewer than 12. */
export function worstTwelveOf(inc) {
  let worst = Infinity, run = 0;
  for (let i = 0; i < inc.length; i++) {
    run += inc[i];
    if (i >= 12) run -= inc[i - 12];
    if (i >= 11) worst = Math.min(worst, run);
  }
  return Number.isFinite(worst) ? worst : 0;
}

const pounds = (v) => '£' + Math.round(v).toLocaleString('en-GB');

/**
 * Every source of income that comes anyway, in words, State Pension first (the full view marks its "from age N").
 * `p` is the plan from planFromSettings: its State Pension (spAnnual, spStartYear, spFirstYearRatio, spAssumed), its
 * start (startAge, yearsToStart), spPaidNow, and the engine config (pnvCfg: dbAmount, dbStartYear, dbIndexation, other, extraIncomes).
 * A source already paid in the plan's first year, with the plan running now, is "being paid now".
 */
export function incomeAnywayWords(p) {
  const cfg = p.pnvCfg || {};
  const startsNow = !(p.yearsToStart > 0);
  const when = (year) => (year <= 0 && startsNow ? 'being paid now' : 'from age ' + (p.startAge + Math.max(0, year || 0)));
  const parts = [];
  if (p.spAnnual > 0) {
    parts.push('State Pension (' + (p.spPaidNow ? 'being paid now' : 'from age ' + (p.startAge + (p.spStartYear || 0))) + (p.spAssumed ? ', assumed — none entered' : '') + ')');
  }
  if (cfg.dbAmount > 0) {
    parts.push('final-salary pension ' + pounds(cfg.dbAmount) + ' a year' + (cfg.dbIndexation === 'level' ? ', not rising with prices' : '') + ' (' + when(cfg.dbStartYear || 0) + ')');
  }
  for (const s of cfg.extraIncomes || []) {
    if (!(s.annual > 0)) continue;
    const to = s.endYear != null ? ' to age ' + (p.startAge + s.endYear) : '';
    parts.push((s.label ? String(s.label) : 'income') + ' ' + pounds(s.annual) + ' a year (' + when(s.startYear || 0) + to + ')');
  }
  if (cfg.other > 0) parts.push('other income ' + pounds(cfg.other) + ' a year');
  if (!parts.length) return 'None — market-dependent';
  return parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
}
