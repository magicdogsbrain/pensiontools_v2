/**
 * The field table (lead4.md R3): one entry per box a person types into that changes the saved plan, bound in both views by
 * `data-field="<id>"`. Markup only today: which box of each view is which field. Step W (lead4.md section 4) gives each
 * entry its one writer — read(plan), patch(plan, value), check(value, plan), lock — and both views' boxes bind to it.
 *
 * Each entry:
 *   id       the field's id, written on every box of it (data-field) in both views
 *   plan     where the plan holds it (a dotted path of the stored plan; '…' where more than one path is written today)
 *   simple   { step, path }: the simple view's box, drawn by EditField on the plan's step page as `plan.<step>.<path>`
 *            (null: the simple view has no box for it)
 *   full     the full view's box(es) by element id (a radio group by each radio's id; null: the full view has none).
 *            Boxes the full view draws in code (the first income step, "What you want") carry the mark where they are drawn.
 *
 * The parity gate (e2e/parity/fields.js) reaches each box through this table and types into it; the sweep compares the
 * boxes of one id in both views (e2e/parity/sweep.spec.js). The simple view's form wrappers also carry `data-field` with
 * their own schema paths; those are not bound boxes and the sweep reads only form controls.
 */
const F = (id, plan, simple, full) => Object.freeze({ id, plan, simple: simple ? Object.freeze({ step: simple[0], path: simple[1] }) : null, full: full ? Object.freeze([...full]) : null });
const S = 'stressTool.settings.';
const A = 'accumulationTool.settings.';

export const FIELDS = Object.freeze([
  // About you and when (map-edits 1a)
  F('about.age', S + 'currentAge', ['about', 'age'], ['tmAge', 'acAge']),
  F('about.stopped', S + 'retired', ['about', 'stopped'], ['tmRetired', 'tmFuture']),
  F('about.stopAge', S + 'retireAge', ['about', 'stopAge'], ['tmRetireAge', 'acRetireAge']),
  F('about.stopMonth', S + 'stoppedWork', ['about', 'stopMonth'], ['tmStopMonth']),
  F('about.startWhen', S + 'firstTaxYear', ['about', 'startWhen'], ['tmStartYear']),
  // the simple view asks the age the plan ends, the full view the years it runs (the same stored figure, two quantities)
  F('about.endAge', S + 'duration', ['about', 'endAge'], ['ssDuration']),
  // Pots and tax (1b)
  F('pots.pension', S + 'equityMin…', ['pots', 'pension'], ['ssPot']),
  F('pots.isa', S + 'isaBalance', ['pots', 'isa'], ['ssIsaBalance']),
  F('pots.isaGrowth', S + 'isaGrowth', ['pots', 'isaGrowth'], ['ssIsaGrowthCash', 'ssIsaGrowthInvested']),
  F('pots.isaUse', S + 'isaDrawdownStrategy', ['pots', 'isaUse'], ['ssIsaPolicy']),
  F('pots.taxable', S + 'taxableStart', ['pots', 'taxable'], ['ssTaxableStart']),
  F('pots.taxableMix', S + 'taxableMix', ['pots', 'taxableMix'], ['ssTaxableMix']),
  F('pots.giaBand', S + 'giaTaxBand', ['pots', 'giaBand'], ['ssGiaTaxBand']),
  F('pots.earnings', S + 'relevantEarnings', ['pots', 'earnings'], ['ssRelevantEarnings']),
  F('pots.bedAndIsa', S + 'bedAndIsa', ['pots', 'bedAndIsa'], ['ssBedAndIsa']),
  F('pots.charges', S + 'chargesPct', ['pots', 'charges'], ['ssChargesPct']),
  F('pots.pa', S + 'pa', ['pots', 'pa'], ['ssPA']),
  F('pots.brl', S + 'brl', ['pots', 'brl'], ['ssBRL']),
  F('pots.hrl', S + 'hrl', ['pots', 'hrl'], ['ssHRL']),
  F('pots.taxMode', S + 'taxMode', ['pots', 'taxMode'], ['ssTaxMode']),
  // the full view keeps the choice in a hidden box set by two buttons (setAccessMethod)
  F('pots.taxFree', S + 'accessMethod', ['pots', 'taxFree'], ['ssAccessMethod']),
  F('pots.ufplsYears', S + 'ufplsYears', ['pots', 'ufplsYears'], ['ssUfplsYears']),
  F('pots.ufplsThenIsa', S + 'ufplsThenPcls', ['pots', 'ufplsThenIsa'], ['ssUfplsPcls']),
  F('pots.bandFill', S + 'bandFillRecycle', ['pots', 'bandFill'], ['ssBandFillRecycle']),
  // (step F1, lead4.md D4: the pots at the stop are worked out from the plan, never typed — their boxes are gone in both views)
  // the pots a bought way is priced on: the full view only (map-edits #11)
  F('pots.boughtSipp', S + 'strategyParams.sippTotal', null, ['miniSipp', 'stratSipp', 'stratSippFf']),
  F('pots.boughtIsa', S + 'strategyParams.isaTotal', null, ['miniIsa', 'stratIsa', 'stratIsaFf']),
  // Money that comes in anyway (1c)
  F('income.spKind', S + 'spWeeklyAmount…', ['income', 'spKind'], null),
  F('income.spWeekly', S + 'spWeeklyAmount', ['income', 'spWeekly'], ['ssSpWeeklyAmount']),
  F('income.spDate', S + 'spStartDate', ['income', 'spDate'], ['ssSpStartDate']),
  F('income.other', S + 'other', ['income', 'other'], ['ssOther']),
  F('income.fs.0.amount', S + 'dbAmount', ['income', 'fs.0.amount'], ['ssDbAmount']),
  F('income.fs.0.fromAge', S + 'dbStartAge', ['income', 'fs.0.fromAge'], ['ssDbStartAge']),
  F('income.fs.0.rises', S + 'dbIndexation', ['income', 'fs.0.rises'], ['ssDbIndexation']),
  // What you spend (1d): the simple view's first figure is a month after tax, the full view's first step a year before tax
  // (drawn in code by renderIncomeSteps, which writes the mark)
  F('spend.first', S + 'baseSalary…', ['spend', 'first.amount'], []),
  // Does it last? (1e): the full view asks "turn cuts off" (the opposite tick) and the cut as a multiplier
  F('lasts.cutsOn', S + 'disableProtection', ['lasts', 'cutsOn'], ['ssDisableProtection']),
  F('lasts.cutAfterMonths', S + 'consecutiveLimit', ['lasts', 'cutAfterMonths'], ['ssConsecutiveLimit']),
  F('lasts.cutPct', S + 'protectionMult', ['lasts', 'cutPct'], ['ssProtectionMult']),
  F('lasts.deeperAfterMonths', S + 'protectionEscalateMonths', ['lasts', 'deeperAfterMonths'], ['ssProtEscalate']),
  F('lasts.buffer', S + 'recoveryBuffer', ['lasts', 'buffer'], ['ssRecoveryBuffer']),
  F('lasts.reserveOn', S + 'hodlEnabled', ['lasts', 'reserveOn'], ['ssHodlEnabled']),
  F('lasts.reserveAmount', S + 'hodlValue', ['lasts', 'reserveAmount'], ['ssHodlValue']),
  // The mix (1g)
  F('mix.sleeve', S + 'diversifierStart', ['mix', 'sleeve'], ['ssDiversifiers']),
  F('mix.tent', S + 'equityGlideEnabled', ['mix', 'tent'], ['ssEquityGlide']),
  F('mix.shares', S + 'equityMin…', ['mix', 'shares'], null),
  F('mix.bonds', S + 'bondMin…', ['mix', 'bonds'], null),
  F('mix.diversifiers', S + 'diversifierStart…', ['mix', 'diversifiers'], null),
  F('mix.cash', S + 'cashTarget…', ['mix', 'cash'], null),
  // What you pay in (1i): both views through the same builder (savingPatch)
  F('saving.netMonthly', A + 'netMonthly', ['saving', 'netMonthly'], ['acNetMonthly']),
  F('saving.employerMonthly', A + 'employerMonthly', ['saving', 'employerMonthly'], ['acEmployerMonthly']),
  F('saving.isaMonthly', A + 'isaMonthly', ['saving', 'isaMonthly'], ['acIsaMonthly']),
  F('saving.escalationPct', A + 'escalationPct', ['saving', 'escalationPct'], ['acEscalation']),
  F('saving.schemeType', A + 'schemeType', ['saving', 'schemeType'], ['acScheme']),
  F('saving.salary', A + 'salary', ['saving', 'salary'], ['acSalary']),
  F('saving.potNow', A + 'potNow', ['saving', 'potNow'], ['acPotNow']),
  // "What you want": drawn in code by the full view (saverAnswerUi.wantFormHtml, which writes the mark)
  F('saving.want.monthly', S + 'baseSalary…', ['saving', 'want.monthly'], []),
  F('saving.want.stopAge', S + 'retireAge…', ['saving', 'want.stopAge'], []),
  // The budget's ages: the full view only (map-edits #76)
  F('budget.currentAge', 'budgetTool.settings.currentAge', null, ['budCurrentAge']),
  F('budget.retireAge', 'budgetTool.settings.retirementAge', null, ['budRetireAge']),
  F('budget.endAge', 'budgetTool.settings.endAge', null, ['budEndAge']),
  // How often you draw: the full view only (map-edits #66)
  F('decision.cadence', 'decisionTool.cadence', null, ['entryCadence']),
  // How often to check in: the simple view only (map-edits #62)
  F('checkin.every', 'accumulationTool.checkInEvery', ['checkin', 'ci.every'], null)
]);

/** The ids of the bound fields. */
export const FIELD_IDS = Object.freeze(FIELDS.map((f) => f.id));

const BY_SIMPLE = new Map(FIELDS.filter((f) => f.simple).map((f) => [f.simple.step + '/' + f.simple.path, f.id]));

/** The field id of the simple view's box `plan.<step>.<path>`, or undefined (a box not in the table carries no mark). */
export const simpleFieldId = (step, path) => BY_SIMPLE.get(step + '/' + path);

/** ' data-field="<id>"' for a box the full view draws in code (an id outside the table throws). */
export function fieldAttrOf(id) {
  if (!FIELD_IDS.includes(id)) throw new Error('fields: "' + id + '" is not a field id (src/reading/fields.js)');
  return ' data-field="' + id + '"';
}

/** Writes each field's mark on the full view's boxes (they are in the page from the start): run once the page is drawn. */
export function markFieldBoxes(doc) {
  if (!doc || !doc.getElementById) return 0;
  let n = 0;
  for (const f of FIELDS) for (const el of f.full || []) {
    const box = doc.getElementById(el);
    if (box && box.getAttribute('data-field') !== f.id) { box.setAttribute('data-field', f.id); n++; }
  }
  return n;
}
