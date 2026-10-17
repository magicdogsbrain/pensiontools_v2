/**
 * The input list of "About you and when" (research/v7/editing-in-v7.md 2, 3) — the first editing step of a saved plan in
 * V7. Data only, like the questions' lists (src/answers/c/schema.js): the fields, by path, with their limits and when each
 * applies; and the ONLY field paths of the stored plan this step may write (editing-in-v7.md 1, rule 3e).
 *
 *   ABOUT_FIELDS       the boxes, in the order they are drawn
 *   ABOUT_PATHS        their paths
 *   ABOUT_WRITES       every dotted field path of the stored plan the step may change (the planner's own keys, 3)
 *   BOOKKEEPING_WRITES the planner's stamp on every save (FirestoreService.saveScenario), written with every patch
 *   SUB_STEP           the address of the step under a plan: #/plan/<id>/about
 *
 * `when` is the one rule the questions' lists use (src/answers/shared/validate.js applies): the field is drawn and checked
 * only while the named field shows that value.
 */
export const SUB_STEP = 'about';

export const ABOUT_FIELDS = Object.freeze([
  { path: 'age',       type: 'age',    min: 18, max: 100, required: true },
  { path: 'stopped',   type: 'choice', options: ['yes', 'age', 'month'], required: true },
  { path: 'stopAge',   type: 'age',    min: 18, max: 85,  required: true, when: { stopped: 'age' } },
  { path: 'stopMonth', type: 'month',  required: true, when: { stopped: 'month' } },
  { path: 'startWhen', type: 'choice', options: ['now', 'april', 'saved'], required: true, when: { stopped: 'yes' } },
  { path: 'endAge',    type: 'age',    min: 23, max: 110, required: true },
  // "Suggest from how long people live": neither is saved
  { path: 'sex',       type: 'choice', options: ['m', 'f'], default: 'm' },
  { path: 'chance',    type: 'choice', options: ['10', '25', '50'], default: '10' }
].map(Object.freeze));

export const ABOUT_PATHS = Object.freeze(ABOUT_FIELDS.map((f) => f.path));

/** The least a plan may run (the planner's own floor when the start moves: Math.max(5, …)). */
export const MIN_YEARS = 5;

export const ABOUT_WRITES = Object.freeze([
  'stressTool.settings.currentAge',
  'stressTool.settings.currentAgeAsOf',
  'stressTool.settings.retired',
  'stressTool.settings.retireAge',
  'stressTool.settings.firstTaxYear',
  'stressTool.settings.shapeAgeNow',
  'stressTool.settings.duration',
  'decisionTool.settings.firstTaxYear',
  'budgetTool.settings.currentAge',
  'budgetTool.settings.currentAgeAsOf',
  'budgetTool.settings.retired',
  'budgetTool.settings.retirementAge'
]);

export const BOOKKEEPING_WRITES = Object.freeze(['lastModified']);

/** Every path a V7 write may carry, for this step and the planner's stamp (the boundary and the effect's tests read it). */
export const WRITES = Object.freeze({ about: ABOUT_WRITES });
export const ALL_WRITES = Object.freeze([...ABOUT_WRITES, ...BOOKKEEPING_WRITES]);
