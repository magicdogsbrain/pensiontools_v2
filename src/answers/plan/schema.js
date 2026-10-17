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
 *   INCOME_FIELDS, INCOME_LISTS, INCOME_WRITES, isIncomePath, isPlanEditPath
 *                      the second step, "Money that comes in anyway" (editing-in-v7.md 7): its boxes, its card lists, the
 *                      ONLY field paths it may write, and the one rule for a draft path of either step
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

// ---- "Money that comes in anyway" (research/v7/editing-in-v7.md 7): the second editing step ---------------------------

export const INCOME_SUB_STEP = 'income';

/** The step's single boxes, in the order they are drawn. */
export const INCOME_FIELDS = Object.freeze([
  // the State Pension: the full amount (V7's own figure), the forecast's weekly amount, none — or, only while the plan has no
  // figure at all, "as the planner assumes" (the old yearly figure from age 67)
  { path: 'spKind',   type: 'choice', options: ['full', 'forecast', 'none', 'assumed'], required: true },
  { path: 'spWeekly', type: 'money',  min: 1, max: 1000, required: true, when: { spKind: 'forecast' } },
  { path: 'other',    type: 'money',  min: 0, max: 1000000, required: false }
].map(Object.freeze));

/** The three rises the planner offers for a final-salary pension and an income stream (dbIndexation, extraIncomes[].indexation). */
export const RISES = Object.freeze(['lpi5', 'cpi', 'level']);
/** What a lump sum is (windfalls[].wrapper): a cash lump sum, an inherited pension, an inherited ISA. */
export const WRAPPERS = Object.freeze(['cash', 'pension', 'isa']);

/**
 * The lists, each a set of cards (7.2): `fs` final-salary pensions, `streams` income for some years, `lumps` lump sums. A
 * card's boxes are "<list>.<id>.<field>"; the list's order is "<list>.ids" ("0,1,n1").
 */
export const INCOME_LISTS = Object.freeze({
  fs: Object.freeze({ fields: Object.freeze([
    { path: 'amount',  type: 'money',  min: 1, max: 1000000, required: true },
    { path: 'fromAge', type: 'age',    min: 40, max: 100, required: true },
    { path: 'rises',   type: 'choice', options: RISES, default: 'lpi5' }
  ].map(Object.freeze)) }),
  streams: Object.freeze({ fields: Object.freeze([
    { path: 'label',   type: 'text',   max: 60, required: false },
    { path: 'amount',  type: 'money',  min: 1, max: 1000000, required: true },
    { path: 'fromAge', type: 'age',    min: 18, max: 110, required: true },
    { path: 'toAge',   type: 'age',    min: 18, max: 110, required: false },
    { path: 'rises',   type: 'choice', options: RISES, default: 'lpi5' }
  ].map(Object.freeze)) }),
  lumps: Object.freeze({ fields: Object.freeze([
    { path: 'label',   type: 'text',   max: 60, required: false },
    { path: 'amount',  type: 'money',  min: 1, max: 10000000, required: true },
    { path: 'atAge',   type: 'age',    min: 18, max: 110, required: true },
    { path: 'wrapper', type: 'choice', options: WRAPPERS, default: 'cash' }
  ].map(Object.freeze)) })
});
export const INCOME_LIST_IDS = Object.freeze(Object.keys(INCOME_LISTS));

const CARD_ID = /^(\d{1,2}|n\d{1,3})$/;
/** A card's id: a saved card is "0", "1", … in the order read; a new one "n1", "n2", … */
export const isCardId = (id) => CARD_ID.test(String(id));

/** The paths of this step a draft may hold: the single boxes, a list's order, a card's boxes (7.2). */
export function isIncomePath(path) {
  const p = String(path);
  if (INCOME_FIELDS.some((f) => f.path === p)) return true;
  const parts = p.split('.');
  if (parts.length === 2) return INCOME_LIST_IDS.includes(parts[0]) && parts[1] === 'ids';
  if (parts.length !== 3) return false;
  const list = INCOME_LISTS[parts[0]];
  return !!list && isCardId(parts[1]) && list.fields.some((f) => f.path === parts[2]);
}

/** The one rule the reducer, the draft store and the screens share: a path of either editing step. */
export function isPlanEditPath(path) {
  return ABOUT_PATHS.includes(path) || isIncomePath(path);
}

/** Every dotted field path "Money that comes in anyway" may change: the planner's own keys (7.3). */
export const INCOME_WRITES = Object.freeze([
  'stressTool.settings.spWeeklyAmount',
  'stressTool.settings.spStartDate',
  'stressTool.settings.statePension',
  'stressTool.settings.dbAmount',
  'stressTool.settings.dbStartYear',
  'stressTool.settings.dbStartAge',
  'stressTool.settings.dbIndexation',
  'stressTool.settings.other',
  'stressTool.settings.extraIncomes',
  'stressTool.settings.windfalls'
]);

/** Every path a V7 write may carry, by step, and the planner's stamp (the boundary and the effect's tests read it). */
export const WRITES = Object.freeze({ about: ABOUT_WRITES, income: INCOME_WRITES });
export const ALL_WRITES = Object.freeze([...ABOUT_WRITES, ...INCOME_WRITES, ...BOOKKEEPING_WRITES]);
