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
import { get, applyPatch, safeSettings, safeTiming } from './about.js';
import { pounds } from './income.js';
import { isBought } from './pots.js';
import { LASTS_FIELDS, LASTS_WRITES } from './schema.js';
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
  if (x.kind === 'contract') return { ...base, id: 'hist.contract', slots: {} };
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
    history: { worst, named, histRanOut: n0(a.histRanOutN), failKind: a.failKind, histories: n0(a.histories), contract: CONTRACT.includes(result.strategyId) }
  };
}
