/**
 * TEST ONLY — the levels of an answer (7.8.0) read as three figures, for tests that check all three at once.
 *   monthlyOf(r)   → { careful, balanced, bold }: each level's £ a month (C, D, an A row)
 *   fixedAgeOf(r)  → { careful, balanced, bold }: each level's share of futures that lasted to the plan-to age
 */
const IDS = ['careful', 'balanced', 'bold'];
export const monthlyOf = (r) => Object.fromEntries(IDS.map((k) => [k, r.levels[k].monthly]));
export const fixedAgeOf = (r) => Object.fromEntries(IDS.map((k) => [k, r.levels[k].fixedAge]));
