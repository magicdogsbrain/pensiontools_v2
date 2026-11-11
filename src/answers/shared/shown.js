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
