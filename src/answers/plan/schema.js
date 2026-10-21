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
 *   INCOME_FIELDS, INCOME_LISTS, INCOME_WRITES, isIncomePath
 *                      the second step, "Money that comes in anyway" (editing-in-v7.md 7): its boxes, its card lists and the
 *                      ONLY field paths it may write
 *   SPEND_FIELDS, SPEND_LISTS, SPEND_WRITES, isSpendPath
 *                      the third step, "What you spend" (editing-in-v7.md 8): the first row, the later steps and the one-off
 *                      costs as cards, and the ONLY field paths it may write
 *   POTS_FIELDS, POTS_WRITES, isPotsPath
 *                      the fourth step, "Your pots and tax" (editing-in-v7.md 9): the pots today and at the stop, the ISA
 *                      choices, the ordinary account, charges, the tax bands and the tax-free part, and the ONLY field paths
 *                      it may write
 *   LASTS_FIELDS, LASTS_WRITES, isLastsPath
 *                      the fifth step, "Does it last?" (editing-in-v7.md 10): the spending cuts in a slump and the emergency
 *                      reserve, and the ONLY field paths it may write (the run itself writes nothing)
 *   DECISION_SEED_KEYS, LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES
 *                      "Lock the plan" (road-to-7.md step 6): the ONLY field paths the lock, the unlock and "Write a new
 *                      version from today's settings" may write — the planner's own, field for field
 *   WAY_IDS, WAY_DIALS, RANK_BYS, WAY_WRITES
 *                      "How the money is taken" (way-and-mix.md 2; road-to-7.md step 8a): the nine ways, each one's dials
 *                      (one set), the orders of the table, and the ONLY field paths "Use this way of drawing" may write
 *   isPlanEditPath     the one rule for a draft path of any step
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

// ---- "What you spend" (research/v7/editing-in-v7.md 8): the third editing step ------------------------------------------

export const SPEND_SUB_STEP = 'spend';

/** What happens from a step's age: stays the same, falls by a percentage a year, or moves evenly to the next step. */
export const THENS = Object.freeze(['level', 'falls', 'glides']);
/** How a one-off cost's amount is reckoned over the years (extraWithdrawals[].indexation): with prices ('cpi') or a fixed sum ('level'). */
export const PRICES = Object.freeze(['rise', 'fixed']);

/**
 * The first row (8.2): the figure from the plan's start, a month after tax, and what happens from it. Its age is the plan's
 * start age and is never asked.
 */
export const SPEND_FIELDS = Object.freeze([
  { path: 'first.amount',   type: 'money',   min: 1, max: 50000, required: true },
  { path: 'first.then',     type: 'choice',  options: THENS, default: 'level' },
  { path: 'first.fallsPct', type: 'percent', min: 0.25, max: 10, step: 0.25, required: true, when: { 'first.then': 'falls' } }
].map(Object.freeze));

/** The lists (8.2): `steps` the later steps by age, `costs` the one-off costs by age. Cards as 7.2. */
export const SPEND_LISTS = Object.freeze({
  steps: Object.freeze({ fields: Object.freeze([
    { path: 'fromAge',  type: 'age',     min: 18, max: 110, required: true },
    { path: 'amount',   type: 'money',   min: 1, max: 50000, required: true },
    { path: 'then',     type: 'choice',  options: THENS, default: 'level' },
    { path: 'fallsPct', type: 'percent', min: 0.25, max: 10, step: 0.25, required: true, when: { then: 'falls' } }
  ].map(Object.freeze)) }),
  costs: Object.freeze({ fields: Object.freeze([
    { path: 'label',    type: 'text',    max: 60, required: false },
    { path: 'amount',   type: 'money',   min: 1, max: 1000000, required: true },
    { path: 'atAge',    type: 'age',     min: 18, max: 110, required: true },
    { path: 'years',    type: 'count',   min: 1, max: 60, required: false, default: 1 },
    { path: 'prices',   type: 'choice',  options: PRICES, default: 'rise' }
  ].map(Object.freeze)) })
});
export const SPEND_LIST_IDS = Object.freeze(Object.keys(SPEND_LISTS));

/** The paths of "What you spend" a draft may hold: the first row's boxes, a list's order, a card's boxes. */
export function isSpendPath(path) {
  const p = String(path);
  if (SPEND_FIELDS.some((f) => f.path === p)) return true;
  const parts = p.split('.');
  if (parts.length === 2) return SPEND_LIST_IDS.includes(parts[0]) && parts[1] === 'ids';
  if (parts.length !== 3) return false;
  const list = SPEND_LISTS[parts[0]];
  return !!list && isCardId(parts[1]) && list.fields.some((f) => f.path === parts[2]);
}

/** Every dotted field path "What you spend" may change: the planner's own keys (8.3). */
export const SPEND_WRITES = Object.freeze([
  'stressTool.settings.incomeShape',
  'stressTool.settings.incomeSteps',
  'stressTool.settings.targetSchedule',
  'stressTool.settings.baseSalary',
  'stressTool.settings.spendingProfile',
  'stressTool.settings.extraWithdrawals',
  'decisionTool.settings.baseSalary',
  'decisionTool.settings.targetSchedule'
]);

// ---- "Your pots and tax" (research/v7/editing-in-v7.md 9): the fourth editing step ----------------------------------------

export const POTS_SUB_STEP = 'pots';

/** How the ISA and savings grow (stressTool.settings.isaGrowth, 6.22.0): the two choices, "Mostly cash" first. */
export const ISA_GROWTHS = Object.freeze(['cash', 'invested']);
/** How the ISA is used (isaDrawdownStrategy): tax-efficient, make it last, hold — the planner's three (IsaDrawdown.ISA_STRATEGIES). */
export const ISA_USES = Object.freeze(['minimiseEarlyTax', 'maximiseLongevity', 'hold']);
/** What the ordinary (taxable) account holds (taxableMix): the planner's five. */
export const TAXABLE_MIXES = Object.freeze(['equity', 'gilt', 'bond', 'balanced', 'cash']);
/** The tax band the ordinary account is taxed at (giaTaxBand). */
export const GIA_BANDS = Object.freeze(['basic', 'higher']);
/** Whether the tax thresholds rise with prices or stay frozen (taxMode). */
export const TAX_MODES = Object.freeze(['inflates', 'frozen']);
/** The 25% tax-free part (accessMethod): kept separate or already taken ('drawdown'), or a quarter of each draw ('ufpls'). */
export const TAX_FREES = Object.freeze(['drawdown', 'ufpls']);
/** A tick, as a choice a person makes: yes or no. */
export const YES_NO = Object.freeze(['yes', 'no']);

/**
 * The boxes (9.2), in the order they are drawn. `when` as the other lists; the boxes whose showing depends on a figure
 * (the ordinary account's mix and band while it holds money; the pots at the stop while the plan stops later; bed-and-ISA
 * while the ISA is not held) are decided by the reading (pots.js checkPots applies).
 */
export const POTS_FIELDS = Object.freeze([
  { path: 'pension',      type: 'money',   min: 0, max: 50000000, required: true },
  { path: 'stopSipp',     type: 'money',   min: 1, max: 50000000, required: false },
  { path: 'stopIsa',      type: 'money',   min: 1, max: 50000000, required: false },
  { path: 'isa',          type: 'money',   min: 0, max: 50000000, required: false, default: 0 },
  { path: 'isaGrowth',    type: 'choice',  options: ISA_GROWTHS, required: true },
  { path: 'isaUse',       type: 'choice',  options: ISA_USES, default: 'minimiseEarlyTax' },
  { path: 'taxable',      type: 'money',   min: 0, max: 50000000, required: false, default: 0 },
  { path: 'taxableMix',   type: 'choice',  options: TAXABLE_MIXES, default: 'equity' },
  { path: 'giaBand',      type: 'choice',  options: GIA_BANDS, default: 'basic' },
  { path: 'earnings',     type: 'money',   min: 0, max: 10000000, required: false, default: 0 },
  { path: 'bedAndIsa',    type: 'choice',  options: YES_NO, default: 'yes' },
  { path: 'charges',      type: 'percent', min: 0, max: 3, step: 0.05, required: true },
  { path: 'pa',           type: 'money',   min: 1, max: 1000000, required: true },
  { path: 'brl',          type: 'money',   min: 1, max: 1000000, required: true },
  { path: 'hrl',          type: 'money',   min: 1, max: 1000000, required: true },
  { path: 'taxMode',      type: 'choice',  options: TAX_MODES, default: 'inflates' },
  { path: 'taxFree',      type: 'choice',  options: TAX_FREES, default: 'drawdown' },
  { path: 'ufplsYears',   type: 'count',   min: 1, max: 60, required: false, when: { taxFree: 'ufpls' } },
  { path: 'ufplsThenIsa', type: 'choice',  options: YES_NO, default: 'no', when: { taxFree: 'ufpls' } },
  { path: 'bandFill',     type: 'choice',  options: YES_NO, default: 'no' }
].map(Object.freeze));

export const POTS_PATHS = Object.freeze(POTS_FIELDS.map((f) => f.path));

/** The paths of "Your pots and tax" a draft may hold: the boxes, nothing else. */
export const isPotsPath = (path) => POTS_PATHS.includes(String(path));

/** Every dotted field path "Your pots and tax" may change: the planner's own keys (9.3), all in the Stress settings. */
export const POTS_WRITES = Object.freeze([
  'stressTool.settings.equityMin',
  'stressTool.settings.bondMin',
  'stressTool.settings.cashTarget',
  'stressTool.settings.diversifierStart',
  'stressTool.settings.potAtRetirement',
  'stressTool.settings.isaBalance',
  'stressTool.settings.isaGrowth',
  'stressTool.settings.isaDrawdownStrategy',
  'stressTool.settings.taxableStart',
  'stressTool.settings.taxableMix',
  'stressTool.settings.giaTaxBand',
  'stressTool.settings.relevantEarnings',
  'stressTool.settings.bedAndIsa',
  'stressTool.settings.chargesPct',
  'stressTool.settings.pa',
  'stressTool.settings.brl',
  'stressTool.settings.hrl',
  'stressTool.settings.taxMode',
  'stressTool.settings.accessMethod',
  'stressTool.settings.ufplsYears',
  'stressTool.settings.ufplsThenPcls',
  'stressTool.settings.bandFillRecycle'
]);

// ---- "Does it last?" (research/v7/editing-in-v7.md 10): the fifth editing step --------------------------------------------

export const LASTS_SUB_STEP = 'lasts';

/**
 * The dials (10.2), in the order they are drawn: the spending cuts in a slump (the Pots & Valves family's protection) and
 * the emergency reserve. The cut boxes are drawn while cuts are on; the reserve's amount while the reserve is on. The run
 * itself has no box: the test's futures are the engine's own fixed seeds and its length is the plan's (10.1).
 */
export const LASTS_FIELDS = Object.freeze([
  { path: 'cutsOn',            type: 'choice', options: YES_NO, default: 'yes' },
  { path: 'cutAfterMonths',    type: 'count',  min: 1, max: 24, required: true, when: { cutsOn: 'yes' } },
  { path: 'cutPct',            type: 'count',  min: 0, max: 95, required: true, when: { cutsOn: 'yes' } },
  { path: 'deeperAfterMonths', type: 'count',  min: 0, max: 60, required: true, when: { cutsOn: 'yes' } },
  { path: 'buffer',            type: 'money',  min: 0, max: 1000000, required: false, default: 0, when: { cutsOn: 'yes' } },
  { path: 'reserveOn',         type: 'choice', options: YES_NO, default: 'no' },
  { path: 'reserveAmount',     type: 'money',  min: 1, max: 50000000, required: true, when: { reserveOn: 'yes' } }
].map(Object.freeze));

export const LASTS_PATHS = Object.freeze(LASTS_FIELDS.map((f) => f.path));

/** The paths of "Does it last?" a draft may hold: the dials, nothing else. */
export const isLastsPath = (path) => LASTS_PATHS.includes(String(path));

/** Every dotted field path "Does it last?" may change: the planner's own Stress keys for the cuts and the reserve (10.3). */
export const LASTS_WRITES = Object.freeze([
  'stressTool.settings.disableProtection',
  'stressTool.settings.consecutiveLimit',
  'stressTool.settings.protectionMult',
  'stressTool.settings.protectionEscalateMonths',
  'stressTool.settings.recoveryBuffer',
  'stressTool.settings.hodlEnabled',
  'stressTool.settings.hodlValue'
]);

// ---- "Lock the plan" (research/v7/road-to-7.md step 6; your-plan.md 1.3, 7; v6-usability-audit.md 2.6) ---------------------

export const LOCK_STEP = 'lock';

/**
 * Every key the Decision tool's seed from the Stress settings may set or change (services/PlanCommit.js seedDecisionFromStress:
 * the planner's own default Decision settings and the keys the seed sets explicitly), listed by hand — the seed is written as
 * one dotted path per key that changes, and a test proves the seed never produces a key outside this list.
 */
export const DECISION_SEED_KEYS = Object.freeze([
  'accessMethod', 'allocMode', 'bandFillRecycle', 'baseSalary', 'bedAndIsa', 'bondMin', 'cashTarget', 'configured',
  'consecutiveLimit', 'disableProtection', 'diversifierStart', 'duration', 'equityGlideEnabled', 'equityMin', 'firstTaxYear',
  'giaTaxBand', 'glideEndgame', 'incomeShape', 'incomeSteps', 'isaBalance', 'isaDrawdownStrategy', 'isaMin', 'isaReturn',
  'protectionEscalateMonths', 'protectionFactor', 'recoveryBuffer', 'relevantEarnings', 'seededFrom', 'shapeAgeNow',
  'spStartDate', 'spWeeklyAmount', 'spendingProfile', 'statePension', 'statePensionYear', 'strategyId', 'strategyParams',
  'subAsset', 'taggedFunds', 'taxableMix', 'taxableStart', 'ufplsThenPcls', 'ufplsYears', 'windfalls'
]);

/** The lock's own keys: the flag, its date and who made it (PlanLock.lockPlanIfNeeded), each a dotted path. */
export const LOCK_FLAG_WRITES = Object.freeze([
  'decisionTool.settings.locked',
  'decisionTool.settings.lockedAt',
  'decisionTool.settings.lockedBy'
]);

/**
 * Every dotted field path the lock may write (index.html commitPlanLock, field for field): the Decision tool seeded from the
 * Stress settings, the lock's flags, the plan of record (the planner's yardstick for its records, one map), the plan document
 * (one map) and the journey (the stage change the lock causes).
 */
export const LOCK_WRITES = Object.freeze([
  ...DECISION_SEED_KEYS.map((k) => 'decisionTool.settings.' + k),
  ...LOCK_FLAG_WRITES,
  'decisionTool.planOfRecord',
  'planDocument',
  'journey'
]);

/**
 * Every dotted field path the unlock may write (PlanLock.unlockPlan + ScenarioRepository.archivePlanDocument /
 * archivePlanOfRecord, and the defaults of PlanCommit.unlockPatchesOf): the document and the plan of record each into its
 * archive (the last ten kept) and cleared, the flag off, the unlock dated and counted, and the Stress defaults a plan locked
 * before a setting existed gets.
 */
export const UNLOCK_WRITES = Object.freeze([
  'planDocumentArchive',
  'planDocument',
  'decisionTool.planOfRecordArchive',
  'decisionTool.planOfRecord',
  'decisionTool.settings.locked',
  'decisionTool.settings.unlockedAt',
  'decisionTool.settings.unlockCount',
  'stressTool.settings.chargesPct',
  'stressTool.settings.isaGrowth'
]);

/** "Write a new version from today's settings" (index.html createPlanDocumentNow): the current document archived, a new one written. */
export const DOCUMENT_WRITES = Object.freeze([
  'planDocumentArchive',
  'planDocument'
]);

// ---- "How the money is taken" (research/v7/way-and-mix.md 2; road-to-7.md step 8a): the way of drawing -------------------

export const WAY_SUB_STEP = 'way';

/** The nine ways, in the planner's order (stressTest.js STRATEGY_NAMES: the order the cards run and the ranking breaks ties by). */
export const WAY_IDS = Object.freeze(['pots-and-valves', 'buckets-in-order', 'ladder-and-ratchet', 'bridge-and-engine', 'floor-and-flex', 'floor-the-schedule', 'floor-to-age', 'full-il-gilt', 'gilt-rotation']);
/** The orders of the cards' table (OneAnswer.rankWays): by futures out of 10 (the default), what is left, the score, coverage. */
export const RANK_BYS = Object.freeze(['lasts', 'left', 'score', 'coverage']);

/**
 * The dials of each way (way-and-mix.md 2.3), ONE set: every dial the planner shows for the way anywhere (its Settings box
 * or its strategy page), by the key the way keeps in its params — in dial units (a percent as a percent, a choice as a
 * word). `type`: 'count' (a whole number), 'age', 'money', 'percent' (a number with `step`), 'number' (a decimal with
 * `step`), 'choice' (`options`). The default of each is the ENGINE's — what runs when the key is absent — and travels
 * with the run (waysRun.js dialDefaults), since some depend on the plan (the target income, the State Pension age); a
 * `default` here is the plan-free one. The cut dials (`cut`) are the Stress keys of "Does it last?", drawn on the two
 * ways of the Pots & Valves family and written through the switch as the planner's strategy page writes them.
 */
const CUT_DIALS = Object.freeze([
  { key: 'protectionOn',     type: 'choice', options: ['yes', 'no'], default: 'yes', cut: true },
  { key: 'cutPct',           type: 'percent', min: 0, max: 60, step: 5, default: 20, cut: true },
  { key: 'consecutiveLimit', type: 'count',  min: 1, max: 24, default: 3, cut: true }
].map(Object.freeze));
const LADDER_DIALS = Object.freeze([
  { key: 'cashYears',   type: 'count',  min: 0, max: 5, default: 2 },
  { key: 'bridgeCash',  type: 'money',  min: 0, max: 50000000, default: 0 },
  { key: 'spareGrowth', type: 'choice', options: ['kept', 'invested'], default: 'kept' }
].map(Object.freeze));
export const WAY_DIALS = Object.freeze({
  'pots-and-valves': CUT_DIALS,
  'buckets-in-order': Object.freeze([
    { key: 'bucketBand', type: 'percent', min: 0, max: 50, step: 5, default: 10 },
    ...CUT_DIALS
  ]),
  'ladder-and-ratchet': Object.freeze([
    { key: 'ladderYears',   type: 'count',  min: 1, max: 44, default: null },          // min(15, half the plan), within 1 to N−1
    { key: 'drawAnnual',    type: 'money',  min: 1, max: 10000000, default: null },    // the plan's target income
    { key: 'triggerMode',   type: 'choice', options: ['band', 'calendar'], default: 'band' },
    { key: 'bandThreshold', type: 'number', min: 1.05, max: 2, step: 0.05, default: 1.2 }
  ].map(Object.freeze)),
  'bridge-and-engine': Object.freeze([
    { key: 'bridgeAge', type: 'age',   min: 56, max: 90, default: null },               // the State Pension age, else the start + min(10, N−1)
    { key: 'cashYears', type: 'count', min: 0, max: 10, default: 3 }
  ].map(Object.freeze)),
  'floor-and-flex': Object.freeze([
    { key: 'essentialsAnnual', type: 'money',   min: 1, max: 10000000, default: null },  // round(target × 0.55)
    { key: 'horizonAge',       type: 'age',     min: 60, max: 105, default: null },      // the engine's: the plan's end
    { key: 'sleeveRatePct',    type: 'percent', min: 1, max: 10, step: 0.25, default: 4 },
    { key: 'ratchet',          type: 'choice',  options: ['off', 'extend', 'raise'], default: 'off' },
    { key: 'treatsRule',       type: 'choice',  options: ['share', 'fixed'], default: 'share' }
  ].map(Object.freeze)),
  'floor-the-schedule': Object.freeze([]),
  'floor-to-age': Object.freeze([
    { key: 'floorToAge', type: 'age', min: 60, max: 95, default: 80 }
  ].map(Object.freeze)),
  'full-il-gilt': LADDER_DIALS,
  'gilt-rotation': Object.freeze([
    ...LADDER_DIALS,
    { key: 'rotateCutAge',      type: 'age',     min: 65, max: 88, default: 75 },
    { key: 'rotateTrigger',     type: 'percent', min: 20, max: 50, step: 5, default: 30 },
    { key: 'rotateDisarmYears', type: 'count',   min: 1, max: 15, default: 8 }
  ].map(Object.freeze))
});

/**
 * Every dotted field path "Use this way of drawing" may change (way-and-mix.md 2.4): the planner's switch field for
 * field — the strategy, its params, every way's stash, the mix's mode and funds list, the pots a restored funds list
 * gives (switchPatch), the cut dials a Pots & Valves or Buckets card carries (the strategy page's own patch), and the
 * root strategy block as ScenarioRepository.setActiveStrategy writes it.
 */
export const WAY_WRITES = Object.freeze([
  'stressTool.settings.strategyId',
  'stressTool.settings.strategyParams',
  'stressTool.settings.strategyState',
  'stressTool.settings.allocMode',
  'stressTool.settings.taggedFunds',
  'stressTool.settings.equityMin',
  'stressTool.settings.bondMin',
  'stressTool.settings.cashTarget',
  'stressTool.settings.diversifierStart',
  'stressTool.settings.subAsset',
  'stressTool.settings.isaBalance',
  'stressTool.settings.disableProtection',
  'stressTool.settings.protectionMult',
  'stressTool.settings.consecutiveLimit',
  'strategy'
]);

/** The one rule the reducer, the draft store and the screens share: a path of any editing step. */
export function isPlanEditPath(path) {
  return ABOUT_PATHS.includes(path) || isIncomePath(path) || isSpendPath(path) || isPotsPath(path) || isLastsPath(path);
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
export const WRITES = Object.freeze({ about: ABOUT_WRITES, income: INCOME_WRITES, spend: SPEND_WRITES, pots: POTS_WRITES, lasts: LASTS_WRITES, lock: LOCK_WRITES, unlock: UNLOCK_WRITES, document: DOCUMENT_WRITES, way: WAY_WRITES });
export const ALL_WRITES = Object.freeze([...new Set([...ABOUT_WRITES, ...INCOME_WRITES, ...SPEND_WRITES, ...POTS_WRITES, ...LASTS_WRITES, ...LOCK_WRITES, ...UNLOCK_WRITES, ...DOCUMENT_WRITES, ...WAY_WRITES, ...BOOKKEEPING_WRITES])]);
