/**
 * "Everything else this plan uses" — the parity section of a plan page (research/v7/your-plan.md 2.5). A pure table:
 * every setting the planner saves that the four named sections of "Your plan" do not show, as data. Each row names
 * the saved keys it reads (as the parity ledger names them), says whether the plan has moved it away from the planner's
 * starting value, and gives its value as facts (a number with its kind, or a plain-English choice). The words live in
 * src/v7/copy/plan.js under the same ids.
 *
 * tests/v7/plan/options.test.js fails when any `stress.*` or `decision.*` key in tests/v7/parity/ledger.json is shown
 * by no section and no row here — so a new setting in the planner cannot be invisible in V7 (the parity rule).
 *
 *   SECTION_KEYS      the keys the four sections of "Your plan" show (about, pays, pots, way)
 *   OPTIONS           the rows: { id, keys, set(ss, ds, plan), facts(ss, ds, plan) }
 *   optionsFor(ss, ds, plan, { all }) → [{ id, set, facts: [{ k, v, kind }] }]
 *
 * `ss` is the plan's effective Stress settings, `ds` its Decision settings (as saved). Pure.
 */
import { DRAWDOWN_DEFAULTS, SIMULATION_DEFAULTS, TAX_DEFAULTS, ISA_DEFAULTS } from '../../constants.js';

/** The keys the five sections show, by section (the ledger's names: 'stress.x', 'decision.x'). */
export const SECTION_KEYS = Object.freeze({
  about: ['stress.currentAge', 'stress.currentAgeAsOf', 'stress.retired', 'stress.retireAge', 'stress.firstTaxYear', 'stress.legacyFirstTaxYear', 'decision.firstTaxYear', 'stress.duration', 'decision.duration'],
  pays:  ['stress.incomeShape', 'stress.incomeSteps', 'decision.incomeShape', 'decision.incomeSteps', 'stress.targetSchedule', 'decision.targetSchedule', 'stress.baseSalary', 'decision.baseSalary', 'stress.shapeAgeNow', 'decision.shapeAgeNow'],
  pots:  ['stress.equityMin', 'stress.bondMin', 'stress.cashTarget', 'decision.equityMin', 'decision.bondMin', 'decision.cashTarget', 'stress.isaBalance', 'decision.isaBalance',
          'stress.taxableStart', 'stress.taxableMix', 'stress.giaTaxBand', 'decision.taxableStart', 'decision.taxableMix', 'decision.giaTaxBand', 'stress.potAtRetirement'],
  // "Money that comes in anyway" (editing-in-v7.md 7): the State Pension, the final-salary pension, other income, the streams and the lump sums
  income: ['stress.spWeeklyAmount', 'decision.spWeeklyAmount', 'stress.spStartDate', 'decision.spStartDate', 'stress.dbAmount', 'stress.dbStartYear', 'stress.dbStartAge', 'stress.dbIndexation', 'stress.other',
          'stress.extraIncomes', 'stress.windfalls', 'decision.windfalls'],
  way:   ['stress.strategyId', 'stress.strategyParams', 'stress.strategyState', 'decision.strategyId', 'decision.strategyParams', 'stress.allocMode', 'decision.allocMode']
});

const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const list = (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);
const money = (k, v) => ({ k, v: Math.round(num(v) || 0), kind: 'money' });
const count = (k, v) => ({ k, v: Math.round(num(v) || 0), kind: 'count' });
const pct = (k, v) => ({ k, v: Math.round((num(v) || 0) * 100) / 100, kind: 'pct' });
const yesNo = (k, v) => ({ k, v: !!v, kind: 'yesNo' });
const choice = (k, v) => ({ k, v: String(v), kind: 'choice' });
const text = (k, v) => ({ k, v: String(v), kind: 'text' });
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** An ISO instant or day → '1 July 2026' (the calendar day as written); other text as it is. */
const dayWords = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '')); return m && +m[2] >= 1 && +m[2] <= 12 ? +m[3] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : String(s || ''); };
const date = (k, v) => text(k, dayWords(v));

/**
 * The rows. `set` is true when the plan has moved the setting away from the planner's starting value (the row is then
 * listed without "Show every setting"). `facts` are the row's values; the words for each `k` are in copy/plan.js.
 */
export const OPTIONS = Object.freeze([
  { id: 'inc.streams', keys: ['stress.extraIncomes'],
    set: (ss) => list(ss.extraIncomes).some((x) => num(x.annual) > 0),
    facts: (ss) => list(ss.extraIncomes).filter((x) => num(x.annual) > 0).flatMap((x, i) => [money('annual' + i, x.annual), count('fromAge' + i, x.fromAge), count('years' + i, x.years)]) },
  { id: 'inc.lump-sums', keys: ['stress.windfalls', 'decision.windfalls'],
    set: (ss) => list(ss.windfalls).some((x) => num(x.amount) > 0),
    facts: (ss) => list(ss.windfalls).filter((x) => num(x.amount) > 0).flatMap((x, i) => [money('amount' + i, x.amount), count('atAge' + i, x.atAge ?? x.fromAge ?? x.age)]) },
  { id: 'inc.extra-spends', keys: ['stress.extraWithdrawals'],
    set: (ss) => list(ss.extraWithdrawals).some((x) => num(x.amount) > 0),
    facts: (ss) => list(ss.extraWithdrawals).filter((x) => num(x.amount) > 0).flatMap((x, i) => [money('amount' + i, x.amount), count('atAge' + i, x.atAge ?? x.fromAge ?? x.age), count('years' + i, x.years ?? 1)]) },
  { id: 'inc.final-salary-rises', keys: ['stress.dbIndexation'],
    set: (ss) => num(ss.dbAmount) > 0 && !!ss.dbIndexation && ss.dbIndexation !== 'cpi',
    facts: (ss) => [choice('rises', ss.dbIndexation || 'cpi')] },
  { id: 'inc.state-pension-old', keys: ['stress.statePension', 'stress.statePensionYear', 'decision.statePension', 'decision.statePensionYear'],
    set: (ss) => !ss.spStartDate && num(ss.statePension) > 0,
    facts: (ss) => [money('yearly', ss.statePension), count('fromYear', ss.statePensionYear)] },
  { id: 'tax.bands', keys: ['stress.pa', 'stress.brl', 'stress.hrl'],
    set: (ss) => (num(ss.pa) ?? TAX_DEFAULTS.PERSONAL_ALLOWANCE) !== TAX_DEFAULTS.PERSONAL_ALLOWANCE || (num(ss.brl) ?? TAX_DEFAULTS.BASIC_RATE_LIMIT) !== TAX_DEFAULTS.BASIC_RATE_LIMIT || (num(ss.hrl) ?? TAX_DEFAULTS.HIGHER_RATE_LIMIT) !== TAX_DEFAULTS.HIGHER_RATE_LIMIT,
    facts: (ss) => [money('pa', ss.pa ?? TAX_DEFAULTS.PERSONAL_ALLOWANCE), money('brl', ss.brl ?? TAX_DEFAULTS.BASIC_RATE_LIMIT), money('hrl', ss.hrl ?? TAX_DEFAULTS.HIGHER_RATE_LIMIT)] },
  { id: 'tax.mode', keys: ['stress.taxMode'],
    set: (ss) => !!ss.taxMode && ss.taxMode !== 'inflates',
    facts: (ss) => [choice('mode', ss.taxMode || 'inflates')] },
  { id: 'tax.tax-free-cash', keys: ['stress.accessMethod', 'decision.accessMethod'],
    set: (ss, ds) => !!(ss.accessMethod || ds.accessMethod) && (ss.accessMethod || ds.accessMethod) !== 'drawdown',
    facts: (ss, ds) => [choice('how', ss.accessMethod || ds.accessMethod || 'drawdown')] },
  { id: 'tax.ufpls-years', keys: ['stress.ufplsYears', 'stress.ufplsThenPcls', 'decision.ufplsYears', 'decision.ufplsThenPcls'],
    set: (ss, ds) => num(ss.ufplsYears ?? ds.ufplsYears) > 0,
    facts: (ss, ds) => [count('years', ss.ufplsYears ?? ds.ufplsYears), yesNo('thenRest', ss.ufplsThenPcls ?? ds.ufplsThenPcls)] },
  { id: 'tax.band-fill', keys: ['stress.bandFillRecycle', 'decision.bandFillRecycle'],
    set: (ss, ds) => !!(ss.bandFillRecycle ?? ds.bandFillRecycle),
    facts: (ss, ds) => [yesNo('on', ss.bandFillRecycle ?? ds.bandFillRecycle)] },
  { id: 'tax.bed-and-isa', keys: ['stress.bedAndIsa', 'decision.bedAndIsa'],
    set: (ss, ds) => !!(ss.bedAndIsa ?? ds.bedAndIsa),
    facts: (ss, ds) => [yesNo('on', ss.bedAndIsa ?? ds.bedAndIsa)] },
  { id: 'tax.earnings', keys: ['stress.relevantEarnings', 'decision.relevantEarnings'],
    set: (ss, ds) => num(ss.relevantEarnings ?? ds.relevantEarnings) > 0,
    facts: (ss, ds) => [money('yearly', ss.relevantEarnings ?? ds.relevantEarnings)] },
  { id: 'prot.cuts', keys: ['stress.consecutiveLimit', 'stress.protectionMult', 'stress.protectionEscalateMonths', 'stress.recoveryBuffer', 'stress.disableProtection',
                           'decision.consecutiveLimit', 'decision.protectionFactor', 'decision.protectionEscalateMonths', 'decision.recoveryBuffer', 'decision.disableProtection'],
    set: (ss) => !!ss.disableProtection || (num(ss.consecutiveLimit) ?? DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT) !== DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT
      || (num(ss.protectionMult) ?? SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER) !== SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER
      || (num(ss.recoveryBuffer) ?? DRAWDOWN_DEFAULTS.RECOVERY_BUFFER) !== DRAWDOWN_DEFAULTS.RECOVERY_BUFFER || num(ss.protectionEscalateMonths) > 0,
    facts: (ss) => [yesNo('off', !!ss.disableProtection), count('after', ss.consecutiveLimit ?? DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT),
      pct('cutTo', (num(ss.protectionMult) ?? SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER) * 100), count('deeperAfter', ss.protectionEscalateMonths ?? 0),
      money('buffer', ss.recoveryBuffer ?? DRAWDOWN_DEFAULTS.RECOVERY_BUFFER)] },
  { id: 'prot.reserve', keys: ['stress.hodlEnabled', 'stress.hodlValue'],
    set: (ss) => !!ss.hodlEnabled,
    facts: (ss) => [yesNo('on', !!ss.hodlEnabled), money('amount', ss.hodlValue ?? SIMULATION_DEFAULTS.HODL_VALUE)] },
  { id: 'pots.diversifiers', keys: ['stress.diversifierStart', 'decision.diversifierStart'],
    set: (ss) => num(ss.diversifierStart) > 0,
    facts: (ss) => [money('amount', ss.diversifierStart)] },
  { id: 'pots.bond-tent', keys: ['stress.equityGlideEnabled', 'decision.equityGlideEnabled', 'stress.glideEndgame', 'decision.glideEndgame'],
    set: (ss) => !!ss.equityGlideEnabled,
    facts: (ss) => [yesNo('on', !!ss.equityGlideEnabled), choice('endgame', ss.glideEndgame || 'hold')] },
  { id: 'pots.isa-use', keys: ['stress.isaDrawdownStrategy', 'decision.isaDrawdownStrategy'],
    set: (ss) => !!ss.isaDrawdownStrategy && ss.isaDrawdownStrategy !== ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    facts: (ss) => [choice('use', ss.isaDrawdownStrategy || ISA_DEFAULTS.DRAWDOWN_STRATEGY)] },
  { id: 'pots.isa-growth', keys: ['stress.isaGrowth', 'stress.isaReturn', 'stress.isaMin', 'decision.isaReturn', 'decision.isaMin'],
    set: (ss) => (ss.isaGrowth === 'invested') || num(ss.isaMin) > 0,
    facts: (ss) => [choice('grows', ss.isaGrowth === 'invested' ? 'invested' : ss.isaGrowth === 'cash' ? 'cash' : 'fixed'), pct('fixedRate', (num(ss.isaReturn) ?? ISA_DEFAULTS.RETURN) * 100), money('floor', ss.isaMin ?? 0)] },
  { id: 'pots.charges', keys: ['stress.chargesPct'],
    set: (ss) => num(ss.chargesPct) != null && num(ss.chargesPct) !== 0.5,
    facts: (ss) => [pct('yearly', num(ss.chargesPct) ?? 0)] },
  { id: 'pots.funds-to-test', keys: ['stress.taggedFunds', 'decision.taggedFunds', 'stress.subAsset', 'decision.subAsset'],
    set: (ss) => list(ss.taggedFunds).some((f) => num(f.value) > 0),
    facts: (ss) => list(ss.taggedFunds).filter((f) => num(f.value) > 0).flatMap((f, i) => [text('name' + i, f.name || f.ticker || ''), money('value' + i, f.value)]) },
  { id: 'draw.cadence', keys: [],
    set: (ss, ds, plan) => { const c = plan && plan.decisionTool && (plan.decisionTool.cadence || (plan.decisionTool.settings && plan.decisionTool.settings.cadence)); return !!c && c !== 'monthly'; },
    facts: (ss, ds, plan) => [choice('how', (plan && plan.decisionTool && (plan.decisionTool.cadence || (plan.decisionTool.settings && plan.decisionTool.settings.cadence))) || 'monthly')] },
  { id: 'timing.stale-draft', keys: ['stress.staleDraftDismissedFor'],
    set: (ss) => num(ss.staleDraftDismissedFor) > 0,
    facts: (ss) => [count('year', ss.staleDraftDismissedFor)] },
  { id: 'lock.lock', keys: ['decision.locked', 'decision.lockedAt', 'decision.lockedBy'],
    set: (ss, ds) => !!ds.locked,
    facts: (ss, ds) => [yesNo('locked', !!ds.locked), date('at', ds.lockedAt || ''), text('by', ds.lockedBy || '')] },
  { id: 'lock.unlock', keys: ['decision.unlockedAt', 'decision.unlockCount'],
    set: (ss, ds) => num(ds.unlockCount) > 0,
    facts: (ss, ds) => [count('times', ds.unlockCount ?? 0), date('last', ds.unlockedAt || '')] },
  { id: 'month.seeded', keys: ['decision.seededFrom'],
    set: (ss, ds) => !!ds.seededFrom,
    facts: (ss, ds) => [text('from', ds.seededFrom || '')] },
  { id: 'mach.configured', keys: ['stress.configured', 'decision.configured'],
    set: () => false,
    facts: (ss, ds) => [yesNo('stress', !!ss.configured), yesNo('decision', !!ds.configured)] },
  { id: 'mach.declining', keys: ['stress.spendingProfile', 'decision.spendingProfile', 'stress.spendingMigratedFrom', 'decision.spendingMigratedFrom'],
    set: (ss) => ss.spendingMigratedFrom === 'declining',
    facts: (ss) => [yesNo('folded', ss.spendingMigratedFrom === 'declining')] },
  { id: 'mach.old-names', keys: ['stress.pacwMin', 'stress.cgtMin', 'stress.csh2Target'],
    set: () => false,
    facts: (ss) => [yesNo('present', ss.pacwMin !== undefined || ss.cgtMin !== undefined || ss.csh2Target !== undefined)] },
  { id: 'mach.risk-mode', keys: ['stress.riskMode'],
    set: () => false,
    facts: (ss) => [text('mode', ss.riskMode || '')] },
  { id: 'mach.start-date', keys: ['decision.startDate'],
    set: () => false,
    facts: (ss, ds) => [date('date', ds.startDate || '')] }
]);

/** Every key a section or a row shows. */
export function coveredKeys() {
  const out = new Set();
  for (const ks of Object.values(SECTION_KEYS)) for (const k of ks) out.add(k);
  for (const r of OPTIONS) for (const k of r.keys) out.add(k);
  return out;
}

/**
 * The rows for a plan: those moved away from the starting value, or all of them.
 * @param {object} ss    the effective Stress settings
 * @param {object} ds    the Decision settings as saved
 * @param {object} plan  the plan
 * @param {{ all?: boolean }} [o]
 * @returns {{ id: string, set: boolean, facts: { k: string, v: *, kind: string }[] }[]}
 */
export function optionsFor(ss, ds, plan, { all = false } = {}) {
  const S = ss || {}, D = ds || {};
  const out = [];
  for (const r of OPTIONS) {
    let set = false, facts = [];
    try { set = !!r.set(S, D, plan); } catch { set = false; }
    if (!set && !all) continue;
    try { facts = r.facts(S, D, plan).filter((f) => f && (f.kind === 'text' || f.kind === 'choice' ? typeof f.v === 'string' : true)); } catch { facts = []; }
    out.push({ id: r.id, set, facts });
  }
  return out;
}
