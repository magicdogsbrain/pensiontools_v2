/**
 * The one reader of the figure an answer stands behind (7.8.0): shownOf(result) = result.levels[result.level], and the
 * three levels' names in order. Reads nothing, imports nothing: the shell's state may read it (tests/v7/boundaries.test.js).
 */
export const LEVEL_IDS = Object.freeze(['careful', 'balanced', 'bold']);

/** The figures of the level an answer stands behind (its own level's; Balanced when it names none), or null. */
export function shownOf(result) {
  if (!result || !result.levels) return null;
  const level = result.level && result.levels[result.level] ? result.level : 'balanced';
  return result.levels[level] || null;
}

/**
 * Whether what would be enough to pay in is within the reach of paying in (7.12.0, lead decision 9): the answer's one reach
 * rule (answers/b/enough.js reachOf, `result.reach.payIn`), read the same way by every card that offers or keeps the figure —
 * the rail, the keep and "Use" choice, the seed kept "at what would be enough", the plan home's share of pay — so none of
 * them offers a pay-in past all of a pay or past the yearly allowance. An answer without a reach (before 7.12.0) is read as
 * within it, as before.
 */
export const payInWithinReach = (result) => !(result && result.reach && result.reach.payIn === false);
