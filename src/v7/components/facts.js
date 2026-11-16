/**
 * Which line on a plan page states which fact of the scenario tests' register (e2e/scenarios/facts.js; the scenario brief's
 * step 3, 7.12.0). Markup only: a `data-fact` attribute on the element that holds the fact's sentence, so a scenario finds
 * the fact by its place, not by its words. The value is always read from the visible text, never from the attribute.
 * Each pairing was checked against the register's own pattern on the corpus (tests/v7/plan/dataFacts.test.js).
 */
export const LINE_FACTS = Object.freeze({
  'about.saved.endAge': 'plan.endAge',
  'about.stopIn': 'stop.month',
  'about.stoppedIn': 'stop.month',
  'lasts.left': 'left.typically',
  'pots.atStop': 'pot.atStop',
  'where.pot': 'pot.today',
  'income.sp.paid': 'statePension.amount'
});

/** The attribute for a line, or nothing. */
export const factOf = (lineId) => (LINE_FACTS[lineId] ? { 'data-fact': LINE_FACTS[lineId] } : {});
