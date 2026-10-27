/**
 * "Does it last?" (research/v7/editing-in-v7.md 10): the fifth editing step of a saved plan in V7. Pure: a plan already
 * brought up to date in memory, today's date and what was typed in; the dials every run of the Pots & Valves family reads
 * — the spending cuts in a slump and the emergency reserve — each once with its saved value and source; the problems; the
 * derived lines; the exact field paths and values a save writes out; the key a run is filed under; a locked plan's
 * document figure; and the words of a result once a run has come back (verdictOf). Nothing here runs the test — that is
 * lastsRun.js, loaded lazily by the worker — and nothing here writes or reads a clock.
 *
 *   savedLasts(plan, { today })             the saved dials, from the effective settings
 *   boxesOf(plan, { today })                the same as text by path (what the draft starts from)
 *   checkLasts(plan, typed, { today })      text as typed → { ok, values, errors, applies, saved }
 *   lastsPatch(plan, typed, { today })      → { ok, errors, patch, previous }: the dotted paths that change (10.3)
 *   lastsOf(entries, id, { today, typed })  everything the screen draws but the run's result
 *   runKeyOf(plan)                          the key a run's result is filed under: the plan's id, its stamp, its settings
 *   verdictOf(result, { today })            a run's result (lastsRun.js) → the band, the rows and the history, as ids and slots
 *   notUsedBy(strategyId)                   the dials a bought strategy ignores (all of them)
 *
 * Every path written is in schema.js LASTS_WRITES (tested); a key is sent only when its value changes, and a key the plan
 * lacks only on a value that differs from what the engines read for the absent key (10.1).
 */
import { DRAWDOWN_DEFAULTS, SIMULATION_DEFAULTS } from '../../constants.js';
import { ON_COURSE_SHARE } from '../../services/OnCourse.js';
import { PROTECTION_ESCALATE_MONTHS } from '../../services/ProtectionStrategy.js';
import { oneAnswer, futuresOutOfTen, pctText, CHANCE_BARS } from '../../services/OneAnswer.js';
import { switchPatch } from '../../services/PlanCommit.js';
import { cleanParams } from '../../services/StrategyState.js';
import { get, applyPatch, safeSettings, safeTiming, bandsOf } from './about.js';
import { pounds } from './income.js';
import { isBought } from './pots.js';
import { monthlyNet, yearlyGross } from './spend.js';
import { LASTS_FIELDS, LASTS_WRITES, TRY_FIELDS, TRY_WRITES, WAY_IDS } from './schema.js';
import { dateOf, dayWords, MONTHS } from './dates.js';

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
const n0 = (v) => String(Math.round(+v || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** The two strategies that read the cuts and the reserve: the Pots & Valves family (every other buys its income). */
export const FAMILY = Object.freeze(['pots-and-valves', 'buckets-in-order']);
export const CONTRACT = Object.freeze(['full-il-gilt', 'floor-the-schedule']);

/** What the engines read for a key the plan lacks (10.1): a value equal to this is never written onto an absent key. */
const ABSENT_READS = Object.freeze({
  'stressTool.settings.disableProtection': false,
  'stressTool.settings.consecutiveLimit': DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
  'stressTool.settings.protectionMult': SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,
  'stressTool.settings.protectionEscalateMonths': PROTECTION_ESCALATE_MONTHS,
  'stressTool.settings.recoveryBuffer': DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
  'stressTool.settings.hodlEnabled': false
});

/** A short, stable hash of some text (djb2), for the run key. */
function hashOf(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/**
 * The key a run's result is filed under (10.1): the plan's id, its last-changed stamp, the text of its Stress settings and
 * whether it is locked. A save of any step, or a change made in the planner and read again, moves it; nothing else does.
 */
export function runKeyOf(plan) {
  if (!plan || plan.id == null) return null;
  const s = plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : {};
  return String(plan.id) + '|' + String(plan.lastModified || '') + '|' + hashOf(JSON.stringify(s)) + '|' + (isLocked(plan) ? 'L' : 'U');
}

/** The cut as a whole percent from the planner's multiplier (0.8 → 20), and back (20 → 0.8). */
export const cutPctOf = (mult) => Math.round((1 - (num(mult) ?? SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER)) * 100);
export const multOf = (pct) => Math.round((100 - pct)) / 100;

/** The saved facts (10.1): from the effective settings (the lock freezes them, so a locked plan reads the same way). */
export function savedLasts(plan, { today }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const ss = safeSettings(plan, now);
  const stored = (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  const timing = safeTiming(ss, now);
  const strategyId = (doc && doc.strategy && doc.strategy.id) || ss.strategyId || 'pots-and-valves';
  const bought = isBought(strategyId);
  const values = {
    cutsOn: ss.disableProtection ? 'no' : 'yes',
    cutAfterMonths: num(ss.consecutiveLimit) ?? DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    cutPct: cutPctOf(ss.protectionMult),
    deeperAfterMonths: num(ss.protectionEscalateMonths) ?? PROTECTION_ESCALATE_MONTHS,
    buffer: num(ss.recoveryBuffer) ?? DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    reserveOn: ss.hodlEnabled ? 'yes' : 'no',
    reserveAmount: num(ss.hodlValue) > 0 ? r0(ss.hodlValue) : null
  };
  // a locked plan's document keeps the figure it was locked with (6.24.0): read here, never run
  const docR = doc && doc.strategy && isObj(doc.strategy.r) ? doc.strategy.r : null;
  const docA = docR ? oneAnswer(docR, (doc.strategy && doc.strategy.p) || {}) : null;
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, strategyId, bought, family: FAMILY.includes(strategyId),
    endAge: (num(timing.shapeAgeNow) || 57) + (num(ss.duration) || 35) - 1,
    // the document's figure as a result verdictOf can word: the same shape lastsRun.js returns, without a history
    document: docA ? { a: docA, lockedOn: dayWords(doc.lockedAt || lockedAtOf(plan)), ladder: !!(docR.plan && Array.isArray(docR.plan.years) && docR.plan.years.length),
      ran: { family: FAMILY.includes(strategyId), cutsOn: FAMILY.includes(strategyId) && values.cutsOn === 'yes', cutPct: values.cutPct, months: values.cutAfterMonths } } : null,
    source, values, now
  };
}

/** The boxes' starting text: the saved facts as a person would type them, by path. */
export function boxesOf(plan, { today }) {
  const v = savedLasts(plan, { today }).values;
  const out = { cutsOn: v.cutsOn, cutAfterMonths: String(v.cutAfterMonths), cutPct: String(v.cutPct), deeperAfterMonths: String(v.deeperAfterMonths), buffer: String(v.buffer), reserveOn: v.reserveOn };
  if (v.reserveAmount != null) out.reserveAmount = String(v.reserveAmount);
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
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'count') return parseCount(raw, f);
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}
const field = (path) => LASTS_FIELDS.find((f) => f.path === path);

/**
 * Text as typed → the checked values, the errors by path and which boxes apply. `typed` holds text (or a choice) by path; a
 * path not typed takes the saved value (boxesOf).
 */
export function checkLasts(plan, typed, { today }) {
  const saved = savedLasts(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = {};
  const errors = {};
  const applies = {};
  const take = (path) => { const f = field(path); const r = parseField(boxes[path], f); if (r.error) errors[path] = r.error; else values[path] = r.value; return r; };
  for (const f of LASTS_FIELDS) applies[f.path] = true;
  take('cutsOn');
  const cutsOn = (values.cutsOn || saved.values.cutsOn) === 'yes';
  applies.cutAfterMonths = cutsOn; applies.cutPct = cutsOn; applies.deeperAfterMonths = cutsOn; applies.buffer = cutsOn;
  if (cutsOn) { take('cutAfterMonths'); take('cutPct'); take('deeperAfterMonths'); take('buffer'); }
  take('reserveOn');
  const reserveOn = (values.reserveOn || saved.values.reserveOn) === 'yes';
  applies.reserveAmount = reserveOn;
  if (reserveOn) take('reserveAmount');
  return { ok: Object.keys(errors).length === 0, values, errors, applies, saved };
}

/**
 * The write (10.3): every declared path whose value would change, with the new value and the one it had. Nothing for a
 * locked plan or typed text with a problem. The cut boxes are written only while cuts are on (the planner's own boxes keep
 * their values while "Disable Protection Mode" is ticked); the reserve's amount only while the reserve is on.
 */
export function lastsPatch(plan, typed, { today }) {
  const c = checkLasts(plan, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {} };
  if (c.saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  const v = c.values;
  const S = 'stressTool.settings.';
  const want = {};
  want[S + 'disableProtection'] = v.cutsOn !== 'yes';
  if (c.applies.cutAfterMonths) {
    want[S + 'consecutiveLimit'] = v.cutAfterMonths;
    want[S + 'protectionMult'] = multOf(v.cutPct);
    want[S + 'protectionEscalateMonths'] = v.deeperAfterMonths;
    want[S + 'recoveryBuffer'] = v.buffer || 0;
  }
  want[S + 'hodlEnabled'] = v.reserveOn === 'yes';
  if (c.applies.reserveAmount) want[S + 'hodlValue'] = v.reserveAmount;
  const patch = {}, previous = {};
  for (const path of LASTS_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path];
    if (text(cur) === text(val)) continue;
    // the planner's multiplier read back as a whole percent: a stored 0.8 and a typed 20 are the same setting
    if (path === S + 'protectionMult' && cur !== undefined && cutPctOf(cur) === cutPctOf(val)) continue;
    if (cur === undefined && path in ABSENT_READS && text(ABSENT_READS[path]) === text(val)) continue;   // absent reads as this already: no key for nothing
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous };
}

/** The dials a bought strategy ignores (10.2): all of them — it pays the plan in full until it cannot. */
export function notUsedBy(strategyId) {
  return isBought(strategyId) ? LASTS_FIELDS.map((f) => f.path) : [];
}

/** The derived figures (10.2), as line ids with their slots, from the values as they would be saved (or as saved). */
export function derivedLines(v, s) {
  const lines = [];
  if (v.cutsOn === 'yes') {
    const half = Math.round(v.cutPct / 2);
    if (v.deeperAfterMonths > 0) lines.push({ id: 'cuts.staged', slots: { months: String(v.cutAfterMonths), half: String(half), first: String(v.deeperAfterMonths), full: String(v.cutPct), buffer: pounds(v.buffer || 0) } });
    else lines.push({ id: 'cuts.flat', slots: { months: String(v.cutAfterMonths), full: String(v.cutPct), buffer: pounds(v.buffer || 0) } });
  } else lines.push({ id: 'cuts.off', slots: {} });
  if (v.reserveOn === 'yes' && v.reserveAmount != null) lines.push({ id: 'reserve.on', slots: { amount: pounds(v.reserveAmount) } });
  else lines.push({ id: 'reserve.off', slots: {} });
  if (s.bought) lines.push({ id: s.strategyId === 'floor-and-flex' ? 'notUsed.flex' : 'notUsed.bought', slots: {} });
  return lines;
}

/**
 * Everything the screen draws but the run's result (10.2, 10.5). `typed` is the draft's values for this plan (text by path),
 * or null. The result itself is state.lasts, matched by `runKey`; verdictOf turns it into words.
 */
export function lastsOf(entries, id, { today, typed = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const saved = savedLasts(plan, { today });
  const editable = !saved.locked && !readonly;
  const boxes = boxesOf(plan, { today });
  const c = checkLasts(plan, typed || {}, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const fields = LASTS_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null,
    applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  const v = c.ok ? { ...saved.values, ...c.values } : saved.values;
  const derived = derivedLines(v, saved);
  const partners = list.filter((e) => e.plan.id !== plan.id && (e.plan.id === partnerIdOf(plan) || partnerIdOf(e.plan) === plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan) }));
  const p = editable && c.ok ? lastsPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable,
    source: saved.source, strategyId: saved.strategyId, bought: saved.bought, family: saved.family, endAge: saved.endAge,
    // no run on a plan shown as saved (newer than this code, or one whose upgrade failed): its figure would not be its own
    runKey: readonly ? null : runKeyOf(plan), document: saved.document,
    fields, errors: c.errors, ok: c.ok, derived, notUsed: notUsedBy(saved.strategyId), partners,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    // the one sentence the toast says after a save
    savedLine: c.ok ? (v.cutsOn === 'yes'
      ? { id: 'lasts', slots: { pct: String(v.cutPct), months: String(v.cutAfterMonths), reserve: v.reserveOn === 'yes' && v.reserveAmount != null ? 'a reserve of ' + pounds(v.reserveAmount) : 'no reserve' } }
      : { id: 'lastsOff', slots: { reserve: v.reserveOn === 'yes' && v.reserveAmount != null ? 'a reserve of ' + pounds(v.reserveAmount) : 'no reserve' } }) : null
  };
}

// ---- the words of a result (10.2) ----------------------------------------------------------------------------------------

/** The verdict word for a share: on course (the 9-in-10 bar) is yes; from 85% to just under it close; else no. */
export function verdictWord(share) {
  const s = Math.max(0, Math.min(1, +share || 0));
  if (s >= ON_COURSE_SHARE) return 'yes';
  if (s >= 0.85) return 'close';
  return 'no';
}

/** One real start (OneAnswer.worstStarts or NamedStarts.namedStartRows) in words: a line id with its slots. */
export function startRow(x) {
  const when = (x.month ? MONTHS[x.month - 1] + ' ' : '') + x.year;
  const base = { when, label: x.label || null, unfair: !!x.unfair, lowest: null, left: null };
  if (x.tooShort) return { ...base, id: 'hist.tooShort', slots: { year: String(x.year), lastStart: x.lastStart ? String(x.lastStart) : '' } };
  if (x.kind === 'contract') return { ...base, id: x.spareGrowth ? 'hist.contractShares' : 'hist.contract', slots: {} };
  if (x.kind === 'none') return { ...base, id: 'hist.none', slots: {} };
  if (x.kind === 'ladder') return { ...base, left: pounds(x.terminal), id: x.failed ? 'hist.ladderRanOut' : 'hist.ladder', slots: x.failed ? { age: x.failAge ? String(Math.round(x.failAge)) : '' } : { secured: n0(x.secured), s: Math.round(+x.secured || 0) === 1 ? '' : 's' } };
  if (x.kind === 'flex') return { ...base, left: pounds(x.terminal), id: 'hist.flex', slots: { leanest: pounds(x.worstYearFlex) } };
  if (x.kind === 'rotation') return { ...base, lowest: pounds(x.worst12), left: pounds(x.terminal), id: (x.firedAge != null ? 'hist.rotationFired' : 'hist.rotationHeld') + (x.failed ? 'Short' : ''), slots: { fired: x.firedAge != null ? String(Math.round(x.firedAge)) : '', age: x.failed ? String(Math.round(x.failAge || 0)) : '' } };
  const row = { ...base, lowest: pounds(x.worst12), left: pounds(x.terminal) };
  if (x.failed) return { ...row, id: 'hist.ranOut', slots: { age: String(Math.round(x.failAge || 0)) } };
  if (x.cutYears > 0) return { ...row, id: 'hist.lastedCut', slots: { n: n0(x.cutYears), s: Math.round(x.cutYears) === 1 ? '' : 's', total: pounds(x.cutReal) } };
  return { ...row, id: 'hist.lasted', slots: {} };
}

/**
 * A run's result (lastsRun.js) → what the screen draws: the band (its verdict word, the share for the bar, the headline's
 * words), the rows under it, and the history. Every figure is the planner's own reading of the one test (OneAnswer.js).
 * `saved` is lastsOf's reading of the same plan (the end age, the way of drawing, the source).
 */
export function verdictOf(result, saved) {
  if (!result || typeof result !== 'object') return null;
  const a = result.a;
  if (!a) {
    return { ok: false, id: 'lasts.unaffordable', slots: { strategy: result.strategyId || '' }, strategyId: result.strategyId || null, rows: [], history: null };
  }
  const years = Math.round(a.years || 0);
  const toAge = saved && Number.isFinite(saved.endAge) ? String(saved.endAge) : '';
  const rows = [];
  rows.push({ id: 'left', slots: { typical: pounds(a.typicalLeft), bad: pounds(a.badCaseLeft), good: pounds(a.goodCaseLeft) } });
  const c = a.cuts;
  if (c && c.futures > 0) {
    if (c.cutN > 0) rows.push({ id: 'cuts.some', slots: { n: n0(c.cutN), of: n0(c.futures), ranOut: c.ranOutN > 0 ? ' (' + n0(c.ranOutN) + ' of them later ran out)' : '', perYear: pounds(c.typicalCutPerYear), years: n0(c.typicalCutYears), s: c.typicalCutYears === 1 ? '' : 's', total: pounds(c.typicalCutTotal), worst: pounds(c.worstCutTotal) } });
    else rows.push({ id: 'cuts.none', slots: { of: n0(c.futures) } });
  } else rows.push({ id: result.strategyId === 'floor-and-flex' ? 'cuts.flex' : 'cuts.bought', slots: {} });
  const ran = result.ran && typeof result.ran === 'object' ? result.ran : {};
  if (ran.cutsOn) rows.push({ id: 'ran.cuts', slots: { pct: String(ran.cutPct), months: String(ran.months), s: ran.months === 1 ? '' : 's' } });
  else if (ran.family) rows.push({ id: 'ran.cutsOff', slots: {} });
  if (result.priced === 'bundled') rows.push({ id: 'ran.bundled', slots: {} });
  const worst = Array.isArray(result.history && result.history.worst) ? result.history.worst.map(startRow) : [];
  const named = Array.isArray(result.history && result.history.named) ? result.history.named.map(startRow) : [];
  return {
    ok: true,
    verdict: verdictWord(a.share), share: a.share, chancePct: a.chancePct,
    // the raw figures, for the tests that read them off the screen (data-* on the band) — the planner's own, to the pound
    figures: { chancePct: a.chancePct, typicalLeft: r0(a.typicalLeft), badCaseLeft: r0(a.badCaseLeft), goodCaseLeft: r0(a.goodCaseLeft), futures: a.futures, histories: a.histories, histRanOutN: a.histRanOutN, years,
      cutN: c ? c.cutN : null, cutPerYear: c ? c.typicalCutPerYear : null, cutYears: c ? c.typicalCutYears : null, cutTotal: c ? c.typicalCutTotal : null, worstCut: c ? c.worstCutTotal : null },
    id: 'lasts.headline', slots: { words: futuresOutOfTen(a.share).words },
    // a contract strategy runs no futures: every year is bought (the test counts one window), so its line says that
    sub: CONTRACT.includes(result.strategyId)
      ? { id: 'lasts.subContract', slots: { years: String(years), toAge } }
      : { id: 'lasts.sub', slots: { pct: pctText(a.chancePct, 1, CHANCE_BARS).replace(/%$/, ''), futures: n0(a.futures), histories: n0(a.histories), years: String(years), toAge } },
    rows, strategyId: result.strategyId || null,
    history: { worst, named, histRanOut: n0(a.histRanOutN), failKind: a.failKind, histories: n0(a.histories), contract: CONTRACT.includes(result.strategyId) },
    // the year-by-year tables and the named stresses (road-to-7.md step 11b), when the run carried them
    extras: extrasView(result.extras)
  };
}

/** A fraction as a direction and whole-percent words' slots: −0.45 → { dir: 'down', pct: '45' }. */
const move = (v) => ({ dir: v < 0 ? 'down' : 'up', pct: String(Math.round(Math.abs(+v || 0) * 100)) });

/**
 * The run's extras (lastsRun.js extrasOf) in words: each table's rows as pounds, the named stresses as start rows with what the
 * decade did (ids with slots: the screen says "down" and "up" in its own words), the made-up decade apart. Null when the run
 * carried none.
 */
export function extrasView(x) {
  if (!x || typeof x !== 'object') return null;
  const schedule = Array.isArray(x.schedule) ? x.schedule.map((r) => ({ year: r.year, age: r.age, pension: pounds(r.pension), state: pounds(r.state), tax: pounds(r.tax), isa: pounds(r.isa), spendable: pounds(r.spendable), isaLeft: pounds(r.isaLeft), raw: { pension: r.pension, spendable: r.spendable, isaLeft: r.isaLeft } })) : null;
  const glidepath = x.glidepath && Array.isArray(x.glidepath.rows) ? { tent: !!x.glidepath.tent, diversifiers: !!x.glidepath.diversifiers, reserve: !!x.glidepath.reserve,
    rows: x.glidepath.rows.map((r) => ({ year: r.year, age: r.age, shares: pounds(r.shares), bonds: pounds(r.bonds), cash: pounds(r.cash), diversifiers: pounds(r.diversifiers), reserve: pounds(r.reserve), sharesPct: String(r.sharesPct), isa: r.isa == null ? '' : pounds(r.isa), total: pounds(r.total), raw: { total: r.total, sharesPct: r.sharesPct } })) } : null;
  const own = Array.isArray(x.own) ? x.own.map((r) => ({ year: r.year, age: r.age, incomeMid: pounds(r.incomeMid), incomeBad: pounds(r.incomeBad), leftMid: pounds(r.leftMid), raw: { incomeMid: r.incomeMid, leftMid: r.leftMid } })) : null;
  // a contract plan's row carries the planner's inflation figures too (lastsRun.js contractCash): one more line, as slots
  const cashOf = (c) => { const p = move(c.prices10); return { id: 'cash.line', slots: { pricesDir: p.dir, pricesPct: p.pct, first: pounds(c.cashFirst), firstAge: String(c.ageFirst), tenth: pounds(c.cashTenth), tenthAge: String(c.ageTenth), worth: pounds(c.realTenth) } }; };
  const scenarios = Array.isArray(x.scenarios) ? x.scenarios.map((row) => {
    const d = row.decade || { first: 0, decade: 0, prices: 0 };
    const f = move(d.first), e = move(d.decade), c = move(d.prices);
    return { ...startRow(row), key: row.key || null, decade: { id: 'decade.line', slots: { firstDir: f.dir, firstPct: f.pct, decadeDir: e.dir, decadePct: e.pct, pricesDir: c.dir, pricesPct: c.pct } }, ...(row.cash ? { cash: cashOf(row.cash) } : {}) };
  }) : [];
  const sy = x.synthetic || null;
  const synthetic = sy ? (() => { const f = move(sy.decade.first), e = move(sy.decade.decade), c = move(sy.decade.prices); const when = sy.hardest ? (sy.hardest.month ? MONTHS[sy.hardest.month - 1] + ' ' : '') + sy.hardest.year : null; return { name: sy.name, decade: { id: 'decade.line', slots: { firstDir: f.dir, firstPct: f.pct, decadeDir: e.dir, decadePct: e.pct, pricesDir: c.dir, pricesPct: c.pct } }, hardest: when, ...(sy.cash ? { cash: cashOf(sy.cash) } : {}) }; })() : null;
  return { prices: String(Math.round((+x.prices || 0) * 1000) / 10), schedule, glidepath, own, scenarios, synthetic, years: Array.isArray(x.schedule) ? x.schedule.length : Array.isArray(x.own) ? x.own.length : 0 };
}

// ---- "What's different" (research/v7/way-and-mix.md 4, 9.4; index.html runTryStrategyUI's list, lifted) -------------------

/**
 * Every box of a try that differs from the plan as saved, one line each, as ids with slots (the planner's own six, then the
 * three it left out — the ISA policy, the cut depth and the escalation months — a correction in 6.41.0; the planner's alert
 * now says them too). `s` the settings as read, `c` the copy trySettingsOf made from them.
 *   way        { way, old }                   pot  { pot, old }       isa  { isa, old }      isaPolicy { policy, old }
 *   income     { income (a year before tax) } years { years, old }   cuts { on }            cutPct { pct, old }
 *   cutEsc     { months, old }
 * The planner's `cuts` line was said for Pots & Valves only; Buckets in order runs the same cuts, so it is said for both
 * (a correction). The planner's `income` line was said only when the plan has steps; a flat try of a flat plan at another
 * figure is a difference too, so it is said then as well (a correction).
 */
export function tryDifferencesOf(s, c) {
  const diff = [];
  const sid = s.strategyId || 'pots-and-valves';
  if (c.strategyId !== sid) diff.push({ id: 'way', slots: { way: c.strategyId, old: sid } });
  const oldPot = (s.strategyParams && s.strategyParams.sippTotal) || ((s.equityMin || 0) + (s.bondMin || 0) + (s.cashTarget || 0));
  const newPot = (c.strategyParams && c.strategyParams.sippTotal) || 0;
  if (Math.abs(newPot - oldPot) > 1) diff.push({ id: 'pot', slots: { pot: r0(newPot), old: r0(oldPot) } });
  const oldIsa = (s.strategyParams && s.strategyParams.isaTotal != null) ? s.strategyParams.isaTotal : (s.isaBalance != null ? s.isaBalance : 0);
  if (Math.abs((c.isaBalance || 0) - oldIsa) > 1) diff.push({ id: 'isa', slots: { isa: r0(c.isaBalance || 0), old: r0(oldIsa) } });
  const policy = (x) => (x.isaDrawdownStrategy == null ? null : String(x.isaDrawdownStrategy));
  if (policy(c) !== policy(s)) diff.push({ id: 'isaPolicy', slots: { policy: policy(c), old: policy(s) } });
  if (c.incomeShape === 'level' && (s.incomeShape === 'phases' || r0(c.baseSalary) !== r0(s.baseSalary))) diff.push({ id: 'income', slots: { income: r0(c.baseSalary), steps: s.incomeShape === 'phases' } });
  if (c.duration !== (s.duration || 35)) diff.push({ id: 'years', slots: { years: c.duration, old: s.duration || 35 } });
  if (c.disableProtection !== s.disableProtection && FAMILY.includes(c.strategyId)) diff.push({ id: 'cuts', slots: { on: !c.disableProtection } });
  if (cutPctOf(c.protectionMult) !== cutPctOf(s.protectionMult)) diff.push({ id: 'cutPct', slots: { pct: cutPctOf(c.protectionMult), old: cutPctOf(s.protectionMult) } });
  const esc = (x) => (num(x.protectionEscalateMonths) ?? PROTECTION_ESCALATE_MONTHS);
  if (esc(c) !== esc(s)) diff.push({ id: 'cutEsc', slots: { months: esc(c), old: esc(s) } });
  return diff;
}

// ---- Try a change on a plan (way-and-mix.md 4): the boxes, the checks, the words, the write ---------------------------------

/** index.html tryStrategySettings(s), as answers/plan/lastsRun.js carries it: the copy "Use this" and the keep are composed from. */
function trySettingsOf(s, boxes) {
  const b = boxes || {};
  const c = JSON.parse(JSON.stringify(s));
  const id = b.way || 'pots-and-valves';
  const pot = +b.pot || 0;
  const isa = +b.isa || 0;
  const oldPot = (s.equityMin || 0) + (s.bondMin || 0) + (s.cashTarget || 0);
  const scale = oldPot > 0 ? pot / oldPot : 0;
  if (oldPot > 0) { c.equityMin = Math.round((s.equityMin || 0) * scale); c.bondMin = Math.round((s.bondMin || 0) * scale); c.cashTarget = Math.round((s.cashTarget || 0) * scale); }
  else { c.equityMin = Math.round(pot * 0.6); c.bondMin = Math.round(pot * 0.3); c.cashTarget = pot - c.equityMin - c.bondMin; }
  c.isaBalance = isa;
  c.strategyId = id;
  c.strategyParams = { ...restoredParamsOf(s, id), sippTotal: pot, isaTotal: isa };
  if (b.isaPolicy === 'hold') c.isaDrawdownStrategy = 'hold'; else if (b.isaPolicy === 'draw') c.isaDrawdownStrategy = 'bridge';
  if (b.incomeMode === 'flat') { c.baseSalary = +b.income || 0; c.incomeShape = 'level'; c.incomeSteps = []; c.targetSchedule = null; }
  c.duration = Math.max(5, Math.min(45, +b.years || s.duration || 35));
  if (b.cuts === 'on' || b.cuts === 'off') c.disableProtection = b.cuts === 'off';
  if (b.cutPct !== undefined && b.cutPct !== null && b.cutPct !== '') c.protectionMult = 1 - (+b.cutPct) / 100;
  if (b.cutEsc !== undefined && b.cutEsc !== null && b.cutEsc !== '') c.protectionEscalateMonths = Math.max(0, +b.cutEsc);
  return c;
}
/** PlanCommit.restoredParamsFor, written here so this file (loaded with the plan source) reads one function less; the same body. */
function restoredParamsOf(s, id) {
  if (s.strategyId === id) return cleanParams(id, s.strategyParams || {});
  return (s.strategyState && s.strategyState[id] && s.strategyState[id].strategyParams) ? { ...s.strategyState[id].strategyParams } : {};
}

/** The pot a try starts from, the figure the what-if rescales by and "What's different" reads: the pinned pension total, else the pension's shares, bonds and cash. */
export const tryPotOf = (ss) => r0((ss.strategyParams && ss.strategyParams.sippTotal) || ((ss.equityMin || 0) + (ss.bondMin || 0) + (ss.cashTarget || 0)));
export const tryIsaOf = (ss) => r0(ss.strategyParams && ss.strategyParams.isaTotal != null ? ss.strategyParams.isaTotal : (ss.isaBalance || 0));

/** The boxes' starting text (4): the plan as saved — the income box a month after tax, as the spend step shows the first step. */
export function tryBoxesOf(plan, { today }) {
  const saved = savedLasts(plan, { today });
  const ss = saved.ss;
  const bands = bandsOf(ss);
  const first = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? r0(ss.targetSchedule[0]) : r0(ss.baseSalary);
  return {
    'try.way': WAY_IDS.includes(ss.strategyId) ? ss.strategyId : 'pots-and-valves',
    'try.pot': String(tryPotOf(ss)), 'try.isa': String(tryIsaOf(ss)), 'try.isaPolicy': 'saved',
    'try.incomeMode': 'shape', 'try.income': String(monthlyNet(first, bands)),
    'try.years': String(num(ss.duration) || 35), 'try.cuts': 'saved', 'try.cutPct': '', 'try.cutEsc': ''
  };
}

function parseTryField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'count') return parseCount(raw, f);
  if (blank(raw) && f.required && f.default == null) return { error: 'required', value: null };
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}

/**
 * Text as typed → the checked values, the errors by path, which boxes apply, and the boxes for the run (the planner's
 * units: the flat income a year before tax through the plan's own tax sum; a blank depth or months "as saved").
 */
export function checkTry(plan, typed, { today }) {
  const saved = savedLasts(plan, { today });
  const boxes = { ...tryBoxesOf(plan, { today }), ...(typed || {}) };
  const values = {}, errors = {}, applies = {};
  const take = (path) => { const f = TRY_FIELDS.find((x) => x.path === path); const r = parseTryField(boxes[path], f); if (r.error) errors[path] = r.error; else values[path] = r.value; return r; };
  for (const f of TRY_FIELDS) applies[f.path] = true;
  take('try.way'); take('try.pot'); take('try.isa'); take('try.isaPolicy'); take('try.incomeMode');
  applies['try.income'] = (values['try.incomeMode'] || 'shape') === 'flat';
  if (applies['try.income']) take('try.income');
  take('try.years'); take('try.cuts'); take('try.cutPct'); take('try.cutEsc');
  const ok = Object.keys(errors).length === 0;
  const bands = bandsOf(saved.ss);
  const run = ok ? {
    way: values['try.way'], pot: values['try.pot'], isa: values['try.isa'] || 0, isaPolicy: values['try.isaPolicy'],
    incomeMode: values['try.incomeMode'], income: applies['try.income'] ? yearlyGross(values['try.income'], bands) : 0,
    years: values['try.years'], cuts: values['try.cuts'], cutPct: values['try.cutPct'] == null ? '' : values['try.cutPct'], cutEsc: values['try.cutEsc'] == null ? '' : values['try.cutEsc']
  } : null;
  return { ok, values, errors, applies, run, saved };
}

/** "What's different" (4) on a plan: the lines, from the plan's settings and the copy the boxes make. */
export function tryDifferences(plan, boxes, today) {
  const ss = safeSettings(plan, dateOf(today));
  return tryDifferencesOf(ss, trySettingsOf(ss, boxes));
}

/**
 * "Use this" (4): ONE write of exactly the fields that differ, composed from the steps' own lists — the way through the
 * planner's switch (PlanCommit.switchPatch with the tried way's own dials, as the planner's "Use this strategy" sends them),
 * the pots and the ISA and its policy, the income (a flat try: the planner's own 'level' shape), the years, the cuts.
 * Nothing for a locked plan or a try that changes nothing.
 */
export function tryPatch(plan, boxes, { today, at = null } = {}) {
  if (isLocked(plan)) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {}, diffs: [] };
  const ss = safeSettings(plan, dateOf(today));
  const c = trySettingsOf(ss, boxes);
  const diffs = tryDifferencesOf(ss, c);
  const ids = new Set(diffs.map((d) => d.id));
  const S = 'stressTool.settings.';
  const want = {};
  if (ids.has('way')) {
    const { sippTotal, isaTotal, ...rest } = c.strategyParams; void sippTotal; void isaTotal;
    const sp = switchPatch(ss, c.strategyId, {}, { savedAt: today, at, extraParams: cleanParams(c.strategyId, rest) });
    for (const [k, v] of Object.entries(sp.settings)) want[S + k] = v;
    want.strategy = sp.strategy;
  }
  const potsMoved = ids.has('pot') || ids.has('isa');
  if (potsMoved) {
    want[S + 'equityMin'] = c.equityMin; want[S + 'bondMin'] = c.bondMin; want[S + 'cashTarget'] = c.cashTarget; want[S + 'isaBalance'] = c.isaBalance;
    // a bought way is priced on its pinned totals (StrategyState.SHARED_KEYS): they travel with the way's params
    if (isBought(c.strategyId)) {
      const params = cleanParams(c.strategyId, { ...(want[S + 'strategyParams'] || (c.strategyId === ss.strategyId ? ss.strategyParams : {}) || {}), sippTotal: c.strategyParams.sippTotal, isaTotal: c.strategyParams.isaTotal });
      want[S + 'strategyParams'] = params;
      want.strategy = { ...(want.strategy || (plan.strategy && typeof plan.strategy === 'object' ? plan.strategy : { id: c.strategyId, lockedAt: null, engineVersion: null })), id: c.strategyId, params: { ...params } };
    }
  }
  if (ids.has('isaPolicy')) want[S + 'isaDrawdownStrategy'] = c.isaDrawdownStrategy;
  if (ids.has('income')) {
    want[S + 'baseSalary'] = c.baseSalary; want[S + 'incomeShape'] = 'level'; want[S + 'incomeSteps'] = []; want[S + 'targetSchedule'] = null;
    want['decisionTool.settings.baseSalary'] = c.baseSalary; want['decisionTool.settings.targetSchedule'] = null;
  }
  if (ids.has('years')) want[S + 'duration'] = c.duration;
  if (ids.has('cuts')) want[S + 'disableProtection'] = c.disableProtection;
  if (ids.has('cutPct')) want[S + 'protectionMult'] = c.protectionMult;
  if (ids.has('cutEsc')) want[S + 'protectionEscalateMonths'] = c.protectionEscalateMonths;
  const patch = {}, previous = {};
  for (const path of TRY_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path] === undefined ? null : want[path];
    if (text(cur) === text(val)) continue;
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous, diffs, line: { id: 'try', slots: { n: String(diffs.length) } } };
}

/** The tried copy as a plan document for "Keep as a separate plan" (4): the settings the boxes make, laid onto a copy of the plan. */
export function tryCopyOf(plan, boxes, today) {
  const ss = safeSettings(plan, dateOf(today));
  const c = trySettingsOf(ss, boxes);
  const out = JSON.parse(JSON.stringify(plan));
  out.stressTool = { ...(out.stressTool || {}), settings: c };
  const { sippTotal, isaTotal, ...rest } = c.strategyParams || {}; void sippTotal; void isaTotal;
  out.strategy = { ...(out.strategy && typeof out.strategy === 'object' ? out.strategy : {}), id: c.strategyId, params: cleanParams(c.strategyId, isBought(c.strategyId) ? c.strategyParams : rest), lockedAt: null };
  return out;
}

/**
 * What the screen draws of a try (4): the boxes with their saved values and problems, the difference lines, the tried
 * verdict's words (verdictOf, with the plan's own reading), the cost, and whether "Use this" and the keep are offered.
 */
export function tryViews(plan, typed, tried, kept, { today, editable, saved }) {
  const c = checkTry(plan, typed || {}, { today });
  const boxes = tryBoxesOf(plan, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const fields = TRY_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null, applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(shown[f.path]),
    saved: f.path in boxes && !blank(boxes[f.path]) ? boxes[f.path] : null, error: c.errors[f.path] || null
  }));
  const t = tried && typeof tried === 'object' ? tried : null;
  const same = !!(t && c.run && JSON.stringify(t.boxes) === JSON.stringify(c.run));
  let result = null;
  if (t && t.status === 'done' && t.result) {
    const diffs = tryDifferences(plan, t.boxes, today);
    const v = verdictOf(t.result, saved);
    result = { verdict: v, diffs, none: diffs.length === 0, way: t.result.strategyId, runs: t.result.basis && t.result.basis.runs ? t.result.basis.runs : 1, ms: t.ms == null ? null : t.ms, stale: !same, canUse: editable && diffs.length > 0 };
  }
  const p = editable && t && t.status === 'done' ? tryPatch(plan, t.boxes, { today }) : null;
  return { fields, errors: c.errors, ok: c.ok, run: c.run, status: t ? t.status : 'off', reason: t && t.status === 'failed' ? t.reason || null : null, result, patch: p ? p.patch : {}, kept: kept || null, same };
}

// ---- the three levers (research/v7/answer-D.md 3.5–3.7, 3.9; road-to-7.md step 7) -----------------------------------------

export const LEVER_KINDS = Object.freeze(['spendMore', 'work', 'fall']);

/**
 * What the screen draws for the levers on "Does it last?": one entry per lever — its status ('off', 'working', 'invalid',
 * 'failed', 'done'), and when done its lines (ids into copy/lasts.js levers.lines, with slots) — and, on a locked plan with a
 * document, the ONE comparison line (3.9): the document's figure, today's, the same plan on a different day; never a
 * suggestion to unlock. `levers` is state.lasts.levers; `verdict` today's run in words (verdictOf); `documentVerdict` the
 * document's; `workDraft` the work lever's boxes as typed.
 */
export function leverViews(levers, { verdict = null, documentVerdict = null, lockedOn = null, workDraft = null } = {}) {
  const L = levers && typeof levers === 'object' ? levers : {};
  const baseChance = verdict && verdict.ok ? pctText(verdict.chancePct, 1, CHANCE_BARS).replace(/%$/, '') : null;
  const out = {};
  for (const kind of LEVER_KINDS) {
    const x = L[kind];
    if (!x) { out[kind] = { status: 'off', lines: [], problem: null, reason: null }; continue; }
    if (x.status !== 'done' || !x.result) { out[kind] = { status: x.status, lines: [], problem: x.status === 'invalid' ? x.reason : null, reason: x.status === 'failed' ? x.reason : null }; continue; }
    out[kind] = { status: 'done', lines: leverLines(kind, x.result, baseChance), problem: null, reason: null, runs: x.result.runs };
  }
  const anyDone = LEVER_KINDS.some((k) => out[k].status === 'done');
  const compare = anyDone && documentVerdict && documentVerdict.ok && baseChance !== null
    ? { id: 'locked', slots: { date: lockedOn || '', docChance: pctText(documentVerdict.chancePct, 1, CHANCE_BARS).replace(/%$/, ''), chance: baseChance } }
    : null;
  return { ...out, compare, workDraft: workDraft || { yearly: '', years: '' } };
}

const chanceOf = (a) => (a ? pctText(a.chancePct, 1, CHANCE_BARS).replace(/%$/, '') : '');
const lastedWordsOf = (a) => (a ? futuresOutOfTen(a.share).words : '');

/** One lever's result (lastsRun.js runLever) in lines: ids into copy/lasts.js levers.lines, with slots. */
export function leverLines(kind, r, baseChance) {
  if (!r || typeof r !== 'object') return [];
  const lines = [];
  if (!r.ok) {
    lines.push({ id: r.reason === 'unaffordable' ? 'unaffordable' : 'leverNo', slots: {} });
    return lines;
  }
  if (kind === 'spendMore') {
    if (r.evenHalf) lines.push({ id: 'spendMore.evenHalf', slots: { baseChance: chanceOf(r.base) } });
    else if (r.capped) lines.push({ id: 'spendMore.capped', slots: { perMonth: pounds(r.perMonth), chance: chanceOf(r.at), typical: pounds(r.at.typicalLeft) } });
    else if (r.perMonth > 0) lines.push({ id: 'spendMore.more', slots: { perMonth: pounds(r.perMonth), chance: chanceOf(r.at), typical: pounds(r.at.typicalLeft), baseChance: chanceOf(r.base) } });
    else if (r.perMonth < 0) lines.push({ id: 'spendMore.less', slots: { perMonth: pounds(-r.perMonth), chance: chanceOf(r.at), baseChance: chanceOf(r.base) } });
    else lines.push({ id: r.base && r.base.lasts ? 'spendMore.none' : 'spendMore.noneShort', slots: { baseChance: chanceOf(r.base) } });
    lines.push({ id: 'runs', slots: { runs: String(r.runs), s: r.runs === 1 ? '' : 's' } });
    return lines;
  }
  if (kind === 'work') {
    lines.push({ id: 'work.line', slots: { yearly: pounds(r.yearly), years: String(r.years), s: r.years === 1 ? '' : 's', words: lastedWordsOf(r.at), chance: chanceOf(r.at), typical: pounds(r.at.typicalLeft), baseChance: baseChance || '' } });
    lines.push({ id: 'work.how', slots: { years: String(r.years), s: r.years === 1 ? '' : 's' } });
    return lines;
  }
  lines.push({ id: 'fall.line', slots: { potBefore: pounds(r.potBefore), potAfter: pounds(r.potAfter), words: lastedWordsOf(r.at), chance: chanceOf(r.at), typical: pounds(r.at.typicalLeft), baseChance: baseChance || '' } });
  lines.push({ id: 'fall.how', slots: {} });
  return lines;
}
