/**
 * The stretches of years an answer's amount is paid in, read from its phases (each { fromAge, statePension, finalSalary,
 * shown: { takeHome, fromPots, statePension, finalSalary } }): the one reader of "what you have a month, and when".
 * An answer's amount is one figure, but what reaches the person in a later stretch can be more than it — when what comes in
 * anyway (a State Pension, a final-salary pension) is more than the amount — and the years before the State Pension are paid
 * from the pots alone. The headline, the line and the bridge sentence read these two, so they never disagree with what the
 * answer is made of.
 *
 *   laterMore(phases, monthly)   the first later stretch that pays £1 or more above the amount, or null
 *   bridgeOf(phases)             the years before the State Pension, paid from the pots alone, or null
 *
 * Pure: no clock, no storage.
 */
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const shownOf = (ph) => (ph && ph.shown) || {};

/**
 * The first stretch after the first whose take-home is more than `monthly` by £1 or more: it is more only because what
 * comes in anyway is more than the amount. A spending shape moves the amount inside its stretches, so it is never read here.
 * @returns {null | { index: number, takeHome: number }}
 */
export function laterMore(phases, monthly) {
  if (!Array.isArray(phases) || !isNum(monthly) || !(monthly > 0)) return null;
  if (phases.some((ph) => ph && ph.shapeMoves)) return null;
  for (let i = 1; i < phases.length; i++) {
    const takeHome = shownOf(phases[i]).takeHome;
    if (isNum(takeHome) && takeHome - monthly >= 1) return { index: i, takeHome };
  }
  return null;
}

/**
 * The years before the State Pension, when all of the amount comes from the pots: only when the first stretch has no
 * State Pension and no final-salary pension, pays something from the pots, and a later stretch has a State Pension.
 * `years`: whole years from the first stretch's start to that stretch's; `total`: what the pots pay over them, at today's
 * prices, to the nearest £1,000.
 * @returns {null | { toIndex: number, years: number, total: number }}
 */
export function bridgeOf(phases) {
  if (!Array.isArray(phases) || phases.length < 2) return null;
  const first = phases[0];
  if (!first || first.shapeMoves || first.statePension > 0 || first.finalSalary > 0) return null;
  const fromPots = shownOf(first).fromPots;
  if (!isNum(fromPots) || !(fromPots > 0)) return null;
  const toIndex = phases.findIndex((ph, i) => i > 0 && ph && ph.statePension > 0);
  if (toIndex < 0) return null;
  const years = Math.floor(phases[toIndex].fromAge - first.fromAge);
  if (!(years >= 1)) return null;
  const total = Math.round((fromPots * 12 * years) / 1000) * 1000;
  if (!(total > 0)) return null;
  return { toIndex, years, total };
}

/**
 * "From 67 your State Pension is £1,046 a month, more than that." — said after a could-spend figure in A and B when what
 * comes in anyway, once it has all started, is more than the figure, so the figure never reads as all there is for life.
 * `age`: when the last of it starts (a couple: in the younger one's years); `words`: "your State Pension", "your State
 * Pension and your final-salary pension" …; `key`: the result's key for that take-home; `than`: what it is more than.
 */
export function thenMoreParts({ couple, age, words, key, than = 'that' }) {
  const plural = / and |Pensions\b|pensions\b/.test(words);
  return [couple ? 'From when the younger of you is ' : 'From ', { fixed: String(age) }, ' ', words, plural ? ' are ' : ' is ', { key, kind: 'money' }, ' a month, more than ', than, '.'];
}
