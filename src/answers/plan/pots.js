/**
 * "Your pots and tax" (research/v7/editing-in-v7.md 9): the fourth editing step of a saved plan in V7. Pure: a plan already
 * brought up to date in memory, today's date and what was typed in; the pension pot today (and, stopping later, the pots at
 * the day you stop), the ISAs and how they grow and are used, the ordinary (taxable) account, charges, the tax bands and
 * whether they rise, the tax-free part and band fill — each once, with its saved value and source — the problems, the
 * derived lines, and the exact field paths and values a save writes out. Nothing here writes, runs a future, projects a
 * pot or reads a clock.
 *
 *   savedPots(plan, { today })             the saved facts, from the effective settings (or the plan document when locked)
 *   boxesOf(plan, { today })               the same as text by path (what the draft starts from)
 *   checkPots(plan, typed, { today })      text as typed → { ok, values, errors, applies, saved }
 *   potsPatch(plan, typed, { today })      → { ok, errors, patch, previous }: the dotted paths that change (9.3)
 *   potsOf(entries, id, { today, typed })  everything the screen draws
 *   splitTotal(total, shares)              the planner's pots from a total, in the saved proportions (9.1)
 *   notUsedBy(strategyId)                  the paths a bought strategy ignores (the planner's own data-pnv-only parts)
 *
 * Every path written is in schema.js POTS_WRITES (tested); a key is sent only when its value changes, and a key the plan
 * lacks only on a value that differs from what the engines read for the absent key (9.1), so a plan saved as it is writes
 * nothing and a locked plan from before charges or the ISA choice never gains either key.
 */
import { chargesPctOf, isChargesPct, normaliseChargesPct } from '../../services/Charges.js';
import { isaGrowthOf } from '../../services/IsaGrowth.js';
import { isaFundsDecide } from '../../services/IsaFunds.js';
import { sippTodayOf } from '../../services/PotsAtRetirement.js';
import { TAX_DEFAULTS, ISA_DEFAULTS } from '../../constants.js';
import { get, applyPatch, safeSettings, safeTiming } from './about.js';
import { pounds } from './income.js';
import { POTS_FIELDS, POTS_WRITES } from './schema.js';
import { dateOf, dayWords } from './dates.js';

export { applyPatch };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const partnerIdOf = (plan) => (plan && plan.household && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) || null;
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
const r0 = (v) => Math.round(+v || 0);

/**
 * The seven strategies that buy their income (a ladder, a floor, a rotation) and hide the Pots & Valves machinery in the
 * planner (src/ui/strategySettingsUse.js BOUGHT_STRATEGIES, by id — that file is not imported so the preview's bundle does
 * not carry the strategy registry; tests/v7/plan/pots.test.js proves the two lists are the same).
 */
export const BOUGHT = Object.freeze(['ladder-and-ratchet', 'floor-and-flex', 'floor-the-schedule', 'floor-to-age', 'full-il-gilt', 'bridge-and-engine', 'gilt-rotation']);
export const isBought = (id) => BOUGHT.includes(id);

/** The balanced preset: the planner's own fallback for a pot with no saved split (GlidepathService.RISK_PRESETS.balanced). */
const BALANCED = Object.freeze({ equity: 0.5, bond: 0.4, cash: 0.1, div: 0 });

/** What the engines read for a key the plan lacks (9.1): a value equal to this is never written onto an absent key. */
const ABSENT_READS = Object.freeze({
  'stressTool.settings.diversifierStart': 0,
  'stressTool.settings.potAtRetirement': null,
  'stressTool.settings.isaBalance': 0,
  'stressTool.settings.isaDrawdownStrategy': ISA_DEFAULTS.DRAWDOWN_STRATEGY,
  'stressTool.settings.taxableStart': 0,
  'stressTool.settings.taxableMix': 'equity',
  'stressTool.settings.giaTaxBand': 'basic',
  'stressTool.settings.relevantEarnings': 0,
  'stressTool.settings.bedAndIsa': true,
  'stressTool.settings.chargesPct': 0,
  'stressTool.settings.pa': TAX_DEFAULTS.PERSONAL_ALLOWANCE,
  'stressTool.settings.brl': TAX_DEFAULTS.BASIC_RATE_LIMIT,
  'stressTool.settings.hrl': TAX_DEFAULTS.HIGHER_RATE_LIMIT,
  'stressTool.settings.taxMode': 'inflates',
  'stressTool.settings.accessMethod': 'drawdown',
  'stressTool.settings.ufplsYears': null,
  'stressTool.settings.ufplsThenPcls': false,
  'stressTool.settings.bandFillRecycle': false
});

/** The saved split as shares of the whole: each pot over the sum, or the balanced preset when the sum is £0. */
export function sharesOf(pots) {
  const e = r0(pots.equity), b = r0(pots.bond), c = r0(pots.cash), d = r0(pots.div);
  const sum = e + b + c + d;
  if (!(sum > 0)) return { ...BALANCED };
  return { equity: e / sum, bond: b / sum, cash: c / sum, div: d / sum };
}

/** A total split into the planner's pots in the given shares, cash taking the rounding remainder (PlanSeed's own rule). */
export function splitTotal(total, shares) {
  const t = r0(total);
  const equity = Math.round(t * shares.equity), bond = Math.round(t * shares.bond), div = shares.div > 0 ? Math.round(t * shares.div) : 0;
  return { equity, bond, div, cash: t - equity - bond - div };
}

/** The answer's own record of the pots at the stop (PlanSeed fromAnswer.people[0]), or null. */
function answerRecordOf(plan) {
  const p = plan && isObj(plan.fromAnswer) && Array.isArray(plan.fromAnswer.people) && isObj(plan.fromAnswer.people[0]) ? plan.fromAnswer.people[0] : null;
  if (!p || !isObj(p.pension) || !isObj(p.pension.atStop) || !isObj(p.savings) || !isObj(p.savings.atStop)) return null;
  const m = num(p.pension.atStop.middling), c = num(p.pension.atStop.careful), sm = num(p.savings.atStop.middling), sc = num(p.savings.atStop.careful);
  if (m == null || c == null) return null;
  return { sipp: r0(m), sippBad: r0(c), isa: r0(sm), isaBad: r0(sc) };
}

/**
 * The saved facts (9.1): from the effective settings — or, locked, the plan document's pots and assumptions where it has
 * them and the settings the lock froze for the rest.
 */
export function savedPots(plan, { today }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked ? plan.planDocument : null;
  const ss = safeSettings(plan, now);
  const stored = (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  let timing = safeTiming(ss, now);
  if (doc && isObj(doc.timing)) timing = { ...timing, mode: doc.timing.mode || timing.mode };
  const docPots = doc && isObj(doc.pots) ? doc.pots : null;
  const docAss = doc && isObj(doc.assumptions) ? doc.assumptions : null;
  const alloc = docPots && isObj(docPots.allocation) ? docPots.allocation : ss;
  const pots = { equity: r0(alloc.equityMin), bond: r0(alloc.bondMin), cash: r0(alloc.cashTarget), div: r0(alloc.diversifierStart) };
  const pension = docPots && num(docPots.sipp) != null ? r0(docPots.sipp) : pots.equity + pots.bond + pots.cash + pots.div;
  const later = ss.retired === false && timing.mode === 'future';
  const strategyId = (doc && doc.strategy && doc.strategy.id) || ss.strategyId || 'pots-and-valves';
  const bought = isBought(strategyId);
  const params = (doc && doc.strategy && isObj(doc.strategy.params)) ? doc.strategy.params : (isObj(ss.strategyParams) ? ss.strategyParams : {});
  const pinned = bought && num(params.sippTotal) > 0 ? { sipp: r0(params.sippTotal), isa: r0(params.isaTotal) } : null;
  const fundsMode = (docPots && isObj(docPots.allocation) ? docPots.allocation.allocMode : ss.allocMode) === 'funds';
  const par = docPots ? (isObj(docPots.potAtRetirement) ? docPots.potAtRetirement : null) : (isObj(ss.potAtRetirement) ? ss.potAtRetirement : null);
  const override = par && par.source === 'override' ? par : null;
  const hasIsaGrowthKey = isaGrowthOf(stored) != null;
  const isaGrowth = docAss && 'isaGrowth' in docAss ? (isaGrowthOf(docAss) || null) : (isaGrowthOf(ss) || null);
  const isaFunds = docAss && 'isaFromFunds' in docAss ? !!docAss.isaFromFunds : isaFundsDecide(ss);
  const hasChargesKey = isChargesPct(stored.chargesPct);
  const charges = docAss && isChargesPct(docAss.chargesPct) ? docAss.chargesPct : chargesPctOf(ss);
  const bands = { pa: num(docAss && docAss.pa) ?? num(ss.pa) ?? TAX_DEFAULTS.PERSONAL_ALLOWANCE, brl: num(docAss && docAss.brl) ?? num(ss.brl) ?? TAX_DEFAULTS.BASIC_RATE_LIMIT, hrl: num(docAss && docAss.hrl) ?? num(ss.hrl) ?? TAX_DEFAULTS.HIGHER_RATE_LIMIT };
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };
  const values = {
    pension, pots, shares: sharesOf(pots),
    stopSipp: override && num(override.sipp) > 0 ? r0(override.sipp) : null,
    stopIsa: override && num(override.isa) > 0 ? r0(override.isa) : null,
    isa: docPots && num(docPots.isa) != null ? r0(docPots.isa) : r0(ss.isaBalance),
    isaGrowth,
    isaUse: (docPots && docPots.isaPolicy) || ss.isaDrawdownStrategy || ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    taxable: docPots && num(docPots.gia) != null ? r0(docPots.gia) : r0(ss.taxableStart),
    taxableMix: (docPots && docPots.taxableMix) || (typeof ss.taxableMix === 'string' ? ss.taxableMix : (ss.taxableMix ? 'balanced' : 'equity')),
    giaBand: ss.giaTaxBand || 'basic',
    earnings: r0(ss.relevantEarnings),
    bedAndIsa: ss.bedAndIsa !== false ? 'yes' : 'no',
    charges,
    pa: bands.pa, brl: bands.brl, hrl: bands.hrl,
    taxMode: (docAss && docAss.taxMode) || ss.taxMode || 'inflates',
    taxFree: ss.accessMethod === 'ufpls' ? 'ufpls' : 'drawdown',
    ufplsYears: num(ss.ufplsYears) > 0 ? r0(ss.ufplsYears) : null,
    ufplsThenIsa: ss.ufplsThenPcls ? 'yes' : 'no',
    bandFill: ss.bandFillRecycle ? 'yes' : 'no'
  };
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, later, strategyId, bought, pinned, fundsMode,
    par, hasIsaGrowthKey, isaFunds, hasChargesKey, answer: later ? answerRecordOf(plan) : null, source, values, now
  };
}

/** The boxes' starting text: the saved facts as a person would type them, by path. */
export function boxesOf(plan, { today }) {
  const s = savedPots(plan, { today });
  const v = s.values;
  const out = { pension: String(v.pension), isa: String(v.isa), isaUse: v.isaUse, taxable: String(v.taxable), taxableMix: v.taxableMix, giaBand: v.giaBand, earnings: String(v.earnings), bedAndIsa: v.bedAndIsa,
    pa: String(v.pa), brl: String(v.brl), hrl: String(v.hrl), taxMode: v.taxMode, taxFree: v.taxFree, ufplsThenIsa: v.ufplsThenIsa, bandFill: v.bandFill };
  if (v.stopSipp != null) out.stopSipp = String(v.stopSipp);
  if (v.stopIsa != null) out.stopIsa = String(v.stopIsa);
  if (v.isaGrowth) out.isaGrowth = v.isaGrowth;
  if (s.hasChargesKey || !s.locked) out.charges = String(v.charges);
  if (v.ufplsYears != null) out.ufplsYears = String(v.ufplsYears);
  return out;
}

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s);
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parseCount(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).trim();
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
/** A charge, % a year: 0 to 3; put on the planner's 0.05 grid as its own Save does (normaliseChargesPct). */
function parsePercent(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,2}(\.\d+)?$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min || n > f.max) return { error: 'range', value: n };
  return { error: null, value: normaliseChargesPct(n) };
}
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'count') return parseCount(raw, f);
  if (f.type === 'percent') return parsePercent(raw, f);
  if (blank(raw) && f.required && f.default == null) return { error: 'required', value: null };
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}
const field = (path) => POTS_FIELDS.find((f) => f.path === path);

/**
 * Text as typed → the checked values, the errors by path and which boxes apply. `typed` holds text (or a choice) by path; a
 * path not typed takes the saved value (boxesOf).
 */
export function checkPots(plan, typed, { today }) {
  const saved = savedPots(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = {};
  const errors = {};
  const applies = {};
  const take = (path) => { const f = field(path); const r = parseField(boxes[path], f); if (r.error) errors[path] = r.error; else values[path] = r.value; return r; };
  for (const f of POTS_FIELDS) applies[f.path] = true;
  // the pension pot: from the funds list, the box is not drawn (the list sets it); a bought strategy sized on its own dial still shows it
  applies.pension = !saved.fundsMode;
  if (applies.pension) take('pension');
  applies.stopSipp = saved.later; applies.stopIsa = saved.later;
  if (saved.later) { take('stopSipp'); take('stopIsa'); }
  take('isa');
  // how the ISA grows: only where the plan has the choice (a locked plan without it keeps the fixed rate) and the funds do not decide
  applies.isaGrowth = (saved.hasIsaGrowthKey || !saved.locked) && !saved.isaFunds;
  if (applies.isaGrowth) take('isaGrowth');
  take('isaUse');
  const tx = take('taxable');
  const taxableNow = tx.error ? saved.values.taxable : (tx.value || 0);
  applies.taxableMix = taxableNow > 0; applies.giaBand = taxableNow > 0;
  if (applies.taxableMix) { take('taxableMix'); take('giaBand'); }
  take('earnings');
  applies.bedAndIsa = (values.isaUse || saved.values.isaUse) !== 'hold';
  if (applies.bedAndIsa) take('bedAndIsa');
  applies.charges = saved.hasChargesKey || !saved.locked;
  if (applies.charges) take('charges');
  take('pa'); take('brl'); take('hrl');
  if (values.pa != null && values.brl != null && values.brl <= values.pa) { errors.brl = 'belowAllowance'; delete values.brl; }
  if (values.brl != null && values.hrl != null && values.hrl <= values.brl) { errors.hrl = 'belowBasic'; delete values.hrl; }
  take('taxMode');
  take('taxFree');
  applies.ufplsYears = values.taxFree === 'ufpls'; applies.ufplsThenIsa = values.taxFree === 'ufpls';
  if (applies.ufplsYears) { take('ufplsYears'); take('ufplsThenIsa'); }
  take('bandFill');
  return { ok: Object.keys(errors).length === 0, values, errors, applies, saved };
}

/**
 * The write (9.3): every declared path whose value would change, with the new value and the one it had. Nothing for a
 * locked plan or typed text with a problem.
 */
export function potsPatch(plan, typed, { today }) {
  const c = checkPots(plan, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {} };
  if (c.saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  const s = c.saved, v = c.values, sv = s.values;
  const want = {};
  const S = 'stressTool.settings.';
  // the pension pot today, in the saved proportions (9.1); the sleeve only when the plan has one
  if (c.applies.pension && v.pension !== sv.pension) {
    const p = splitTotal(v.pension, sv.shares);
    want[S + 'equityMin'] = p.equity; want[S + 'bondMin'] = p.bond; want[S + 'cashTarget'] = p.cash;
    if (sv.pots.div > 0) want[S + 'diversifierStart'] = p.div;
  }
  // the pots at the stop, typed (9.1): the planner's own object; a typed override blanked goes back to null
  if (s.later) {
    const sipp = v.stopSipp || null, isa = v.stopIsa || null;
    if (sipp || isa) want[S + 'potAtRetirement'] = { sipp, isa, source: 'override' };
    else if (s.par && s.par.source === 'override') want[S + 'potAtRetirement'] = null;
  }
  want[S + 'isaBalance'] = v.isa || 0;
  if (c.applies.isaGrowth) want[S + 'isaGrowth'] = v.isaGrowth;
  want[S + 'isaDrawdownStrategy'] = v.isaUse;
  want[S + 'taxableStart'] = v.taxable || 0;
  if (c.applies.taxableMix) { want[S + 'taxableMix'] = v.taxableMix; want[S + 'giaTaxBand'] = v.giaBand; }
  want[S + 'relevantEarnings'] = v.earnings || 0;
  if (c.applies.bedAndIsa) want[S + 'bedAndIsa'] = v.bedAndIsa === 'yes';
  if (c.applies.charges) want[S + 'chargesPct'] = v.charges;
  want[S + 'pa'] = v.pa; want[S + 'brl'] = v.brl; want[S + 'hrl'] = v.hrl; want[S + 'taxMode'] = v.taxMode;
  want[S + 'accessMethod'] = v.taxFree;
  if (c.applies.ufplsYears) { want[S + 'ufplsYears'] = v.ufplsYears || null; want[S + 'ufplsThenPcls'] = v.ufplsThenIsa === 'yes'; }
  want[S + 'bandFillRecycle'] = v.bandFill === 'yes';
  const patch = {}, previous = {};
  for (const path of POTS_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path];
    if (text(cur) === text(val)) continue;
    if (cur === undefined && path in ABSENT_READS && text(ABSENT_READS[path]) === text(val)) continue;   // absent reads as this already: no key for nothing
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous };
}

/** The settings of this step a bought strategy ignores (9.1): the planner's own data-pnv-only parts and its "gia" note. */
export function notUsedBy(strategyId) {
  return isBought(strategyId) ? ['taxFree', 'ufplsYears', 'ufplsThenIsa', 'bandFill', 'earnings', 'bedAndIsa'] : [];
}

/** The derived figures (9.2), as line ids with their slots, from the values as they would be saved (or as saved). */
export function derivedLines(v, s, { stopBlanked = false } = {}) {
  const lines = [];
  const pension = s.fundsMode ? s.values.pension : v.pension;
  lines.push(v.taxable > 0 ? { id: 'pots.todayTaxable', slots: { pension: pounds(pension), isa: pounds(v.isa), taxable: pounds(v.taxable) } } : { id: 'pots.today', slots: { pension: pounds(pension), isa: pounds(v.isa) } });
  if (s.fundsMode) lines.push({ id: 'pots.fromFunds', slots: { pension: pounds(s.values.pension) } });
  else {
    const p = pension === s.values.pension ? s.values.pots : splitTotal(pension, s.values.shares);
    lines.push({ id: 'pots.split', slots: { shares: pounds(p.equity), bonds: pounds(p.bond), cash: pounds(p.cash), div: p.div > 0 ? ', ' + pounds(p.div) + ' diversifiers' : '' } });
  }
  if (s.pinned) lines.push({ id: 'pots.pinned', slots: { pension: pounds(s.pinned.sipp), isa: pounds(s.pinned.isa) } });
  if (s.later) {
    if (v.stopSipp || v.stopIsa) lines.push({ id: 'stop.typed', slots: { sipp: v.stopSipp ? pounds(v.stopSipp) : 'none typed', isa: v.stopIsa ? pounds(v.stopIsa) : 'none typed' } });
    else if (stopBlanked) lines.push({ id: 'stop.blanked', slots: {} });
    else if (s.par && s.par.source !== 'override' && (num(s.par.sipp) > 0 || num(s.par.isa) > 0)) lines.push({ id: 'stop.projection', slots: { sipp: pounds(s.par.sipp), isa: pounds(s.par.isa) } });
    else if (!s.answer) lines.push({ id: 'stop.none', slots: {} });
    if (s.answer) lines.push({ id: 'stop.answer', slots: { sipp: pounds(s.answer.sipp), sippBad: pounds(s.answer.sippBad), isa: pounds(s.answer.isa), isaBad: pounds(s.answer.isaBad) } });
  }
  if (s.isaFunds) lines.push({ id: 'isa.funds', slots: {} });
  else if (!v.isaGrowth) lines.push({ id: 'isa.fixed', slots: {} });
  else lines.push({ id: v.isaGrowth === 'invested' ? 'isa.invested' : 'isa.cash', slots: {} });
  lines.push({ id: 'isa.use.' + v.isaUse + (v.isaUse === 'hold' && s.bought ? 'Bought' : ''), slots: {} });   // a bought strategy never draws a held ISA
  if (s.locked && !s.hasChargesKey) lines.push({ id: 'charges.locked', slots: {} });
  else if (v.charges > 0) lines.push({ id: 'charges.some', slots: { pct: String(v.charges) } });
  else lines.push({ id: 'charges.none', slots: {} });
  lines.push({ id: 'tax.bands', slots: { pa: pounds(v.pa), brl: pounds(v.brl), hrl: pounds(v.hrl), mode: v.taxMode } });
  if (v.taxFree === 'ufpls') lines.push({ id: 'tax.free.ufpls', slots: { years: v.ufplsYears != null ? String(v.ufplsYears) : '', then: v.ufplsThenIsa } });
  else lines.push({ id: 'tax.free.drawdown', slots: {} });
  if (v.bandFill === 'yes') lines.push({ id: 'tax.bandFill', slots: {} });
  lines.push({ id: 'tax.saves', slots: {} });
  return lines;
}

/**
 * Everything the screen draws (9.2, 9.4). `typed` is the draft's values for this plan (text by path), or null.
 */
export function potsOf(entries, id, { today, typed = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const saved = savedPots(plan, { today });
  const editable = !saved.locked && !readonly;
  const boxes = boxesOf(plan, { today });
  const c = checkPots(plan, typed || {}, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const fields = POTS_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null,
    applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  // the derived lines: from the values as they would be saved where every box is right, else as saved
  const v = c.ok ? { ...saved.values, ...c.values } : saved.values;
  const stopBlanked = c.ok && saved.later && !c.values.stopSipp && !c.values.stopIsa && !!saved.par && saved.par.source === 'override';
  const derived = derivedLines(v, saved, { stopBlanked });
  const useNotes = {};
  if (saved.bought) useNotes.isaGrowth = v.isaUse === 'hold' ? 'isaGrowthBoughtHeld' : 'isaGrowthBought';   // a held ISA is left out, not spent
  if (saved.pinned) { useNotes.pension = 'pinned'; useNotes.isa = 'pinned'; }
  if (saved.isaFunds) useNotes.isaGrowth = 'isaFunds';
  if (saved.locked && !saved.hasChargesKey) useNotes.charges = 'chargesLocked';
  if (saved.locked && !saved.hasIsaGrowthKey && !saved.isaFunds) useNotes.isaGrowth = 'isaGrowthLocked';
  const partners = list.filter((e) => e.plan.id !== plan.id && (e.plan.id === partnerIdOf(plan) || partnerIdOf(e.plan) === plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan) }));
  const p = editable && c.ok ? potsPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable,
    source: saved.source, later: saved.later, bought: saved.bought, fundsMode: saved.fundsMode,
    fields, errors: c.errors, ok: c.ok, derived, notUsed: notUsedBy(saved.strategyId), useNotes, partners,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    // the one sentence the toast says after a save
    savedLine: c.ok ? { id: 'pots', slots: { pension: pounds(saved.fundsMode ? saved.values.pension : c.values.pension), isa: pounds(c.values.isa || 0), charges: String(c.applies.charges ? c.values.charges : saved.values.charges) } } : null
  };
}
