/**
 * The levels on an answer (7.8.0: research/v7/replan-nov-2026.md 5; the build spec's section 3). Every answer of A, B, C
 * and D carries:
 *   level    the level the person chose ('careful' | 'balanced' | 'bold'; Balanced unless chosen)
 *   levels   { careful, balanced, bold }: each level's figures in the answer's own kind (C and D { monthly, yearly }, A
 *            { stopAge }, B { pot, payIn }), each with { weighted, fixedAge }
 *   chance   { weighted, fixedAge, fails, n, planToAge, weightToAge, horizonRule } for the figure shown
 *   basis    … { level, levelFails20, planToAge, weightToAge, tablesVersion, sexUsed }
 * shownOf(result) = result.levels[result.level] is the one reader of "the figure we stand behind": a helper, never a
 * stored copy.
 *
 * With SUCCESS.weighted false (the rollback) every weight is one whole future, so a level is the count at floor(t·n/20)
 * failures, `weighted` equals `fixedAge`, and Balanced (t = 2) is the careful figure before 7.8.0, figure for figure.
 *
 * Pure: no clock, no storage.
 */
import { LEVEL_FAILS20, LEVEL_DEFAULT, levelOf, WEIGHT_ONE, verdictAtLevel, passes, LEGACY_VERDICT } from './rules.js';
import { weightOf, sexOfInputs } from './weigh.js';
import { LIFE_TABLE } from '../../services/LongevityModel.js';

/** The three levels, in order of how careful they are, and the one reader of the figure an answer stands behind. */
export { LEVEL_IDS, shownOf } from './shown.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** The level an answer's checked inputs choose (the `confidence` field; anything else Balanced). */
export const levelOfInputs = (inputs) => levelOf(inputs && inputs.confidence);

/** The tables each person's figures were read from ('f' | 'm'; not said reads the women's). */
export function sexUsedOf(inputs) {
  const out = { you: sexOfInputs(inputs, 'you') };
  if (inputs && inputs.household === 'couple' && inputs.partner) out.partner = sexOfInputs(inputs, 'partner');
  return out;
}

/**
 * How the plan-to age was set: 'chosen' (typed in this answer), 'survival' (the default rule), 'capped' (the run could
 * not reach the weighting age); 'plan' is the plan side's.
 */
export function horizonRuleOf({ defaulted, capped }) {
  if (capped) return 'capped';
  return defaulted ? 'survival' : 'chosen';
}

/** The basis's level block: what the figures were tested under. */
export function levelBasis(level, weigher, inputs, planToAge) {
  return {
    level, levelFails20: LEVEL_FAILS20[level], planToAge, weightToAge: weigher.weighted ? weigher.weightToAge : planToAge,
    tablesVersion: weigher.tablesVersion || LIFE_TABLE.tablesVersion, sexUsed: sexUsedOf(inputs)
  };
}

/**
 * The chance from the months the futures ran out in (null = lasted), counted from the drawing start:
 *   fails      the futures that ran out before the plan-to age (the fixed-age count)
 *   fixedAge   (n − fails) / n: the share that lasted to the plan-to age
 *   sumW       the whole-number sum of the weights of every future that ran out (weigh.js)
 *   weighted   1 − sumW / (n × 2^30)
 * `toMonth`: the month of the plan-to age (12 × (planToAge − startAge)); a run that ends there counts every run-out.
 */
export function chanceOf(weigher, months, toMonth = Infinity) {
  const n = months.length;
  let fails = 0;
  let sumW = 0;
  for (let i = 0; i < n; i++) {
    const m = months[i];
    if (m === null) continue;
    // (a run-out with no month counts whole, as weightOf counts one: the cautious side)
    sumW += isNum(m) ? weightOf(weigher, m) : weigher.byMonth[0];
    if (!(isNum(m) && m >= toMonth)) fails++;
  }
  const fixedAge = n ? (n - fails) / n : 1;
  // (not weighing, every weight is one whole future: the weighted chance IS the count, said as the same number)
  return { fails, sumW, fixedAge, weighted: !weigher.weighted ? fixedAge : n ? 1 - sumW / (n * WEIGHT_ONE) : 1 };
}

/**
 * The verdict at a level from a chanceOf. Weighing: rules.js verdictAtLevel. Not weighing (the rollback): the count at the
 * level — yes within floor(t·n/20) failures, close within floor(n/4) (LEGACY_VERDICT) — so at Balanced (t = 2) it is
 * legacyVerdictOf's verdict exactly, and the other levels' verdicts agree with their own figures.
 */
export function verdictOfChance(c, n, level, weigher) {
  if (weigher.weighted) return verdictAtLevel(c.sumW, n, level, true);
  const yes = Math.floor((LEVEL_FAILS20[levelOf(level)] * n) / 20);
  return c.fails <= yes ? 'yes' : c.fails <= Math.max(yes, Math.floor(n * LEGACY_VERDICT.close)) ? 'close' : 'no';
}

/** The chance block a result carries for the figure it shows. */
export function chanceBlock(c, n, { planToAge, weightToAge, horizonRule }) {
  return { weighted: c.weighted, fixedAge: c.fixedAge, fails: c.fails, n, planToAge, weightToAge, horizonRule };
}

/**
 * Whether a chance passes a level: weighing, the one test (rules.js passes) on its weighted sum; not weighing, the count
 * at floor(t·n/20) — so each level has its own figure in the rollback too (Balanced, t = 2, is floor(n/10)).
 */
export function passesLevel(c, n, level, weigher) {
  const t = LEVEL_FAILS20[levelOf(level)];
  return weigher.weighted ? passes(c.sumW, n, t) : c.fails <= Math.floor((t * n) / 20);
}
