/**
 * The age a plan runs to, one convention for every page of both apps (7.9.0). Pure: no imports.
 */
const finite = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
/**
 * The age a plan runs to, as every page of both apps says it (7.9.0): "to 97" is to the 97th birthday — the birthday its last
 * year ends on, the age the answers name (their plan-to age). A plan from 65 for 32 years runs to 97: its last year is the
 * year at 96. Until 7.9.0 a plan's pages named the age in its last year, one year below the answers' figure for the same run;
 * the runs are unchanged, only the age said. What is stored from 7.9.0 says so (`ageRule: TO_AGE_RULE`: a document's
 * success.planTo, an agreement); a stored age without it was the age in the last year, and is read one on
 * (toAgeAsWritten: PlanDocument.planToAgeOfDefinition, keepTest.js's agreed lines).
 */
export const planToAgeOf = (startAge, years) => Math.round(finite(startAge) + finite(years));
/** The rule a stored "to {age}" was written under from 7.9.0: the birthday its last year ends on. */
export const TO_AGE_RULE = 'birthday';
/** A stored "to {age}" in the one convention: as written under TO_AGE_RULE, else (7.8.0 and before: the age in its last year) one on. */
export const toAgeAsWritten = (age, rule) => (typeof age === 'number' && Number.isFinite(age) ? (rule === TO_AGE_RULE ? age : age + 1) : null);
