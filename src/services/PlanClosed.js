/**
 * A closed plan, and the plan that carries it on (research/plan-start.md §2 I, §3, §6 decisions 10 and 11): what the data
 * says and what every tool reads from it. The close itself (the offer, the new plan, the one write) is services/PlanClose.js;
 * this file is the small part every reader and the lock guard need, so it imports nothing heavy.
 *
 * Someone who has lived on a plan, with its months recorded, moves to another plan from a month they choose. The old plan is
 * closed, not edited: a locked plan is never changed, so closing writes two keys at the plan's root, outside both settings
 * maps (no settings checksum moves, and the saved-plan migrations, which never touch a locked plan's settings, are not
 * crossed):
 *   - `closedAt: 'YYYY-MM'` — the LAST month the plan covers: the month before the change-over month. Its months up to then
 *     stay readable; nothing after it may be recorded on it. "Closed March 2029" says the plan ran to the end of March.
 *   - `nextPlanId` — the plan that carries it on.
 * The new plan carries, at its root:
 *   - `previousPlanId` — the closed plan (the two are linked both ways, like the partner link);
 *   - `before: { kind: 'plan', planId, from: 'YYYY-MM' }` — what came before it and the change-over month, its first month.
 *     The kind names the reason: 'plan' (moved to a new plan) or 'working' (back to work, research/plan-start.md §2 J: the
 *     new plan is a saving spell, `before: { kind: 'working', from }`, the previous plan named by `previousPlanId`).
 *   - `flexibleAccess: { since, fromPlanId }` — the person's fact that money has been taken from a pension flexibly, written by
 *     the close when the closed plan carries it or recorded a taxable draw (services/FlexibleAccess.js), and copied by every
 *     later close. A closed plan keeps the one it had: the close never writes it there.
 * Every one of them absent means what it always meant: a plan with no `closedAt` is open, and a plan with no `before` came
 * from nowhere. Nothing here is derived or written on load.
 *
 * What "closed" means for every tool (§2 I): the plan reads as locked and is never changed again — its settings, its strategy,
 * the close itself, its months after `closedAt`, the tax years after it, and what you hold and its tick-offs (the record is the
 * person's, and it moved to the new plan) are all refused (closedPlanRefusal, applied by the lock guard to every write, against
 * the plan as stored). Where you are and the plan document are read as at the end of `closedAt` (readDayOf). The life stage is
 * `closed`. A closed plan is not a partner's plan to pair with; its successor is.
 *
 * Pure: no storage, no DOM, no clock of its own.
 */

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The root keys a close writes on the old plan, and the ones the new plan is made with. */
export const CLOSE_KEYS = Object.freeze(['closedAt', 'nextPlanId']);
export const SUCCESSOR_KEYS = Object.freeze(['previousPlanId', 'before']);
/** Why a plan carries a closed one on (`before.kind`): moved to a new plan, or back to work (a saving spell). */
export const BEFORE_KINDS = Object.freeze(['plan', 'working']);

/** 'YYYY-MM' when `v` is one, else null. */
export const monthOrNull = (v) => (typeof v === 'string' && MONTH.test(v.trim()) ? v.trim() : null);
/** The month after / before a 'YYYY-MM'. */
export function monthAfter(ym) { const [y, m] = String(ym).split('-').map(Number); return m === 12 ? (y + 1) + '-01' : y + '-' + String(m + 1).padStart(2, '0'); }
export function monthBefore(ym) { const [y, m] = String(ym).split('-').map(Number); return m === 1 ? (y - 1) + '-12' : y + '-' + String(m - 1).padStart(2, '0'); }
/** 'March 2029' for '2029-03'. */
export function monthWordsOf(ym) { const m = monthOrNull(ym); if (!m) return ''; const [y, mm] = m.split('-').map(Number); return MONTH_NAMES[mm - 1] + ' ' + y; }
/** The tax year a 'YYYY-MM' month is in (April starts it). */
const taxYearOf = (ym) => { const [y, m] = String(ym).split('-').map(Number); return m >= 4 ? y : y - 1; };

/** The last month the plan covers, when it is closed: 'YYYY-MM', else null. */
export function closedAtOf(plan) { return monthOrNull(plan && plan.closedAt); }
export const isClosedPlan = (plan) => closedAtOf(plan) != null;
/** The plan that carries a closed plan on (its id), or null. */
export function nextPlanIdOf(plan) { const v = plan && plan.nextPlanId; return typeof v === 'string' && v.trim() ? v.trim() : null; }
/** The plan a successor carries on from (its id), or null. */
export function previousPlanIdOf(plan) { const v = plan && plan.previousPlanId; return typeof v === 'string' && v.trim() ? v.trim() : null; }
/** What came before this plan: { kind, planId, from } (from: its first month), or null. */
export function beforeOf(plan) {
  const b = plan && plan.before;
  if (!isObj(b) || typeof b.kind !== 'string') return null;
  const from = monthOrNull(b.from);
  if (!from) return null;
  return { kind: b.kind, planId: typeof b.planId === 'string' && b.planId ? b.planId : null, from };
}

/** The month a record belongs to ('YYYY-MM'), or null. */
const recordMonth = (h) => (isObj(h) && typeof h.date === 'string' ? monthOrNull(h.date.slice(0, 7)) : null);
/** The latest month recorded on the plan's Month by month, or null. */
export function lastRecordedMonth(plan) {
  const hist = plan && plan.decisionTool && Array.isArray(plan.decisionTool.history) ? plan.decisionTool.history : [];
  let last = null;
  for (const h of hist) { const m = recordMonth(h); if (m && (!last || m > last)) last = m; }
  return last;
}

/**
 * The day a closed plan is read on: the last day of `closedAt` once that has passed, else `now` — so Where you are, the
 * plan document's reading and plan vs actual stop where the plan stopped. A plan that is not closed reads `now`, untouched.
 */
export function readDayOf(plan, now = new Date()) {
  const c = closedAtOf(plan);
  if (!c) return now;
  const [y, m] = c.split('-').map(Number);
  const end = new Date(y, m, 0, 12, 0, 0);   // the last day of the month, at noon (a local date)
  return end.getTime() < now.getTime() ? end : now;
}

/** May a month ('YYYY-MM' or a date) be recorded on this plan? { ok } or { ok: false, why: 'closed'|'before', month }. */
export function monthRefusal(plan, month) {
  const m = monthOrNull(String(month || '').slice(0, 7));
  if (!m) return null;
  const c = closedAtOf(plan);
  if (c && m > c) return { why: 'closed', closedAt: c, month: m };
  const b = beforeOf(plan);
  if (b && m < b.from) return { why: 'before', from: b.from, month: m };
  return null;
}

// ---- the lock guard's part (LockedPlanGuard.lockedPlanWriteRefusal applies both, against the plan as stored) ----------

/** Does a write (saveScenario's map, dotted keys allowed) reach a key at this root, or under it? */
const reaches = (data, root) => Object.keys(isObj(data) ? data : {}).some((k) => k === root || k.startsWith(root + '.'));
/** The value a write leaves at a root key (a dotted write under it folded in), read as Firestore's updateDoc reads it. */
function rootAfter(plan, data, root) {
  let v = plan ? plan[root] : undefined;
  for (const [k, x] of Object.entries(isObj(data) ? data : {})) {
    if (k === root) v = x;
    else if (k.startsWith(root + '.')) {
      const path = k.split('.').slice(1);
      v = isObj(v) ? JSON.parse(JSON.stringify(v)) : {};
      let o = v;
      for (let i = 0; i < path.length - 1; i++) { if (!isObj(o[path[i]])) o[path[i]] = {}; o = o[path[i]]; }
      o[path[path.length - 1]] = x;
    }
  }
  return v;
}
/** The plan's Month by month after a write: its records and its tax years (decisionTool, or paths under it). */
function decisionAfter(plan, data) {
  const dt = rootAfter(plan, data, 'decisionTool');
  return isObj(dt) ? dt : {};
}

/** Does a write touch the close's keys, or (on a closed plan) anything the close froze? The store checks only then. */
export function writeTouchesClosure(data) { return CLOSE_KEYS.some((k) => reaches(data, k)); }
/**
 * The root keys under which a closed plan keeps something frozen: Month by month (its months after the close, its tax years
 * after it, its plan of record and the archive of it), what you hold and its tick-offs, and the plan document and its past
 * versions — which stay as they were at the close, so an unlock's archive or "Write a new version" can never clear or
 * rewrite them — and the person's fact of money taken flexibly as it stood (the plan that carries it on has its own copy).
 */
export const FROZEN_WHEN_CLOSED = Object.freeze(['decisionTool', 'holdings', 'transition', 'planDocument', 'planDocumentArchive', 'flexibleAccess']);
export function writeTouchesClosedParts(data) { return FROZEN_WHEN_CLOSED.some((k) => reaches(data, k)); }
/** Does a write reach Month by month (where the plan that carries one on keeps its first month)? */
export function writeTouchesMonths(data) { return reaches(data, 'decisionTool'); }
/** Does a write reach a saver's own months — the Accumulation planner's pot records and the check-ins (a saving spell's)? */
export function writeTouchesSaverMonths(data) { return reaches(data, 'accumulationTool'); }

/**
 * The close's own allowance: may this write set `closedAt` and `nextPlanId`? Exactly once — the stored plan has no
 * `closedAt` and no `nextPlanId` — both together, `closedAt` a month no earlier than the last month recorded (no record may
 * fall after the close), and `nextPlanId` a plan's id other than its own. Any other write that reaches either key is refused,
 * on every plan, locked or not: a closed plan stays closed. Null when the write may (or does not touch them); else the keys.
 * @param {object} plan  the plan as stored (read as a load reads it)
 * @param {object} data  the write
 */
export function closureRefusal(plan, data) {
  if (!writeTouchesClosure(data)) return null;
  const bad = CLOSE_KEYS.filter((k) => reaches(data, k));
  if (closedAtOf(plan) || nextPlanIdOf(plan) || (plan && plan.closedAt != null) || (plan && plan.nextPlanId != null)) return bad;
  const at = monthOrNull(data.closedAt), next = typeof data.nextPlanId === 'string' ? data.nextPlanId.trim() : '';
  if (!at || !next || bad.length !== 2) return bad;
  if (plan && plan.id != null && String(plan.id) === next) return bad;
  const last = lastRecordedMonth({ decisionTool: decisionAfter(plan, data) });
  if (last && last > at) return bad;
  return null;
}

const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : isObj(v) ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const text = (v) => (v === undefined || v === null ? '<absent>' : JSON.stringify(sortKeys(v)));

/** The records a write adds to Month by month (those not already stored, as they stand). */
function addedRecords(plan, data) {
  const before = isObj(plan && plan.decisionTool) ? plan.decisionTool : {};
  const after = decisionAfter(plan, data);
  const had = new Set((Array.isArray(before.history) ? before.history : []).map((h) => text(h)));
  return (Array.isArray(after.history) ? after.history : []).filter((h) => !had.has(text(h)));
}

/**
 * What a CLOSED plan refuses besides its settings (which the guard refuses as a locked plan's, with no unlock and no move of
 * its start): a month recorded after `closedAt`, a change to a tax year that begins after it, any change to what you hold
 * or its tick-offs (the record moved to the plan that carries it on), and any change to the plan document, its past
 * versions, the plan of record or its archive (plan vs actual and the document stay as they were at the close). The months
 * up to `closedAt`, and their tax years, stay as they are and may still be written (a month missed before the close can be
 * filled in). Null for a plan that is not closed.
 * @returns {string[]|null}  the parts refused ('decisionTool.history', 'decisionTool.taxYears.27/28', 'holdings', 'transition',
 *   'planDocument', 'planDocumentArchive', 'flexibleAccess', 'decisionTool.planOfRecord', 'decisionTool.planOfRecordArchive')
 */
export function closedPlanRefusal(plan, data) {
  const c = closedAtOf(plan);
  if (!c || !writeTouchesClosedParts(data)) return null;
  const bad = [];
  for (const k of ['holdings', 'transition', 'planDocument', 'planDocumentArchive', 'flexibleAccess']) if (reaches(data, k) && text(plan[k]) !== text(rootAfter(plan, data, k))) bad.push(k);
  if (reaches(data, 'decisionTool')) {
    const before = isObj(plan.decisionTool) ? plan.decisionTool : {};
    const after = decisionAfter(plan, data);
    if (addedRecords(plan, data).some((h) => { const m = recordMonth(h); return m && m > c; })) bad.push('decisionTool.history');
    for (const k of ['planOfRecord', 'planOfRecordArchive']) if (text(before[k]) !== text(after[k])) bad.push('decisionTool.' + k);
    const ty0 = isObj(before.taxYears) ? before.taxYears : {}, ty1 = isObj(after.taxYears) ? after.taxYears : {};
    const lastTaxYear = taxYearOf(c);
    for (const key of new Set([...Object.keys(ty0), ...Object.keys(ty1)])) {
      const a = parseInt(String(key).split('/')[0], 10);
      const Y = Number.isFinite(a) ? (a < 100 ? 2000 + a : a) : NaN;
      if (Number.isFinite(Y) && Y > lastTaxYear && text(ty0[key]) !== text(ty1[key])) bad.push('decisionTool.taxYears.' + key);
    }
  }
  return bad.length ? bad : null;
}

/** The entries a write adds to a list under the Accumulation planner ('history' or 'checkIns'), as addedRecords does. */
function addedSaverEntries(plan, data, key) {
  const before = isObj(plan && plan.accumulationTool) ? plan.accumulationTool : {};
  const at = rootAfter(plan, data, 'accumulationTool');
  const after = isObj(at) ? at : {};
  const had = new Set((Array.isArray(before[key]) ? before[key] : []).map((h) => text(h)));
  return (Array.isArray(after[key]) ? after[key] : []).filter((h) => !had.has(text(h)));
}

/**
 * What the plan that carries a closed one on refuses: a month recorded before its first month (`before.from`) — those
 * months are recorded on the previous plan, and Month by month's gate (decisionEntryAllowed) says so; this is the store's
 * rule behind it, for every write that adds records (a fill, a batch). Either reason: a saving spell after a drawing plan
 * (back to work) records no month before its first either — not on Month by month, and not as a saver's own months, the
 * Accumulation planner's pot records and the check-ins (a change-over set up ahead: until it comes, the months are the
 * drawing plan's, and the saving plan says when it begins). Null for a plan with no `before` of a known kind.
 * @returns {string[]|null}  the parts refused ('decisionTool.history', 'accumulationTool.history', 'accumulationTool.checkIns')
 */
export function successorRefusal(plan, data) {
  const b = beforeOf(plan);
  if (!b || !BEFORE_KINDS.includes(b.kind) || !(writeTouchesMonths(data) || writeTouchesSaverMonths(data))) return null;
  const early = (h) => { const m = recordMonth(h); return !!m && m < b.from; };
  const bad = [];
  if (writeTouchesMonths(data) && addedRecords(plan, data).some(early)) bad.push('decisionTool.history');
  if (writeTouchesSaverMonths(data)) for (const k of ['history', 'checkIns']) if (addedSaverEntries(plan, data, k).some(early)) bad.push('accumulationTool.' + k);
  return bad.length ? bad : null;
}

/**
 * A plan that carries a closed one on, before its first month: { from: 'YYYY-MM', month: 'November 2026' } when `month`
 * ('YYYY-MM' or a date: today) comes before `before.from` — a change-over set up ahead, whose months until then are the
 * previous plan's — else null. The saver's pages say so and take no month of it (successorRefusal is the store's rule).
 */
export function notBegunOf(plan, month) {
  const r = monthRefusal(plan, month);
  return r && r.why === 'before' ? { from: r.from, month: monthWordsOf(r.from) } : null;
}

// ---- the words both apps use (the planner's src/ui/planCloseUi.js, V7's copy/plan.js say the same) -------------------

/** The plan's name as the readers take it. */
export const planNameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';

/** 'YYYY-MM' of a moment (local). */
const monthOfDay = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

/**
 * Is a closed plan's last month still to come (a change-over chosen up to twelve months ahead)? Until it has passed the plan
 * is lived on as before — its months up to the close are still to be recorded on it — and it reads as closing, not closed.
 */
export function closesAhead(plan, now = new Date()) {
  const c = closedAtOf(plan);
  return !!c && c >= monthOfDay(now);
}

/**
 * A closed plan's one line, and the plan that carries it on, found among `plans` (a list of plans, or of { plan }):
 * { closedAt, month: 'March 2029', next: { id, name }|null, ahead, working }. `ahead` while its last month is still to come
 * (closesAhead): the words then say it closes, not that it closed. `working` when the plan that carries it on is a saving
 * spell (back to work: its `before.kind` is 'working') — the reason lives on that plan, so the close writes nothing more on
 * this one; with that plan not at hand the reason is not known and not said. Null for a plan that is not closed.
 */
export function closedReading(plan, plans = [], now = new Date()) {
  const c = closedAtOf(plan);
  if (!c) return null;
  const id = nextPlanIdOf(plan);
  const list = (Array.isArray(plans) ? plans : []).map((e) => (e && e.plan ? e.plan : e)).filter(isObj);
  const next = id ? list.find((p) => String(p.id) === id) || null : null;
  const working = !!next && (beforeOf(next) || {}).kind === 'working';
  return { closedAt: c, month: monthWordsOf(c), next: next ? { id: String(next.id), name: planNameOf(next) } : null, ahead: closesAhead(plan, now), working };
}

/**
 * The plans `plan` may be paired with as a partner's (both apps' Household pickers, one rule): never itself, never a closed
 * plan (its successor is the one to pair with), and never the plan it carries on or that carries it on — one person's two
 * plans are not a couple. `list` is a list of plans, or of { plan }; the same entries come back.
 */
export function partnerCandidates(list, plan) {
  const own = plan && plan.id != null ? String(plan.id) : null;
  const near = new Set([nextPlanIdOf(plan), previousPlanIdOf(plan), (beforeOf(plan) || {}).planId].filter(Boolean));
  return (Array.isArray(list) ? list : []).filter((e) => {
    const p = e && e.plan ? e.plan : e;
    if (!isObj(p) || p.id == null) return false;
    const id = String(p.id);
    return id !== own && !near.has(id) && !isClosedPlan(p);
  });
}

/**
 * A successor's one line about what came before it: { from, until: 'March 2029', previous: { id, name }|null, kind }, the
 * previous plan found among `plans`. Either reason (a new plan, or a saving spell after going back to work) says the same:
 * the previous plan's months are there. Null for a plan that came from nowhere (no `before` of a known kind).
 */
export function beforeReading(plan, plans = []) {
  const b = beforeOf(plan);
  if (!b || !BEFORE_KINDS.includes(b.kind)) return null;
  const id = b.planId || previousPlanIdOf(plan);
  const list = (Array.isArray(plans) ? plans : []).map((e) => (e && e.plan ? e.plan : e)).filter(isObj);
  const prev = id ? list.find((p) => String(p.id) === id) || null : null;
  return { from: b.from, fromMonth: monthWordsOf(b.from), until: monthWordsOf(monthBefore(b.from)), previous: prev ? { id: String(prev.id), name: planNameOf(prev) } : null, kind: b.kind };
}

/**
 * "Closed March 2029; carried on as ‘Shares and cash’." (or without the name when that plan is not at hand); while the last
 * month is still to come, "Closes at the end of March 2029; carries on as ‘Shares and cash’." Closed for going back to work:
 * "Closed March 2029: back to work; carried on as ‘…’." (and "Closes at the end of March 2029: back to work; …").
 */
export function closedWords(reading) {
  if (!reading) return '';
  const why = reading.working ? ': back to work' : '';
  if (reading.ahead) return 'Closes at the end of ' + reading.month + why + (reading.next ? '; carries on as ‘' + reading.next.name + '’.' : '.');
  return 'Closed ' + reading.month + why + (reading.next ? '; carried on as ‘' + reading.next.name + '’.' : '.');
}
/** "Under your previous plan ‘Ladder’ until March 2029 — its months are there." */
export function beforeWords(reading) {
  if (!reading) return '';
  return 'Under your previous plan' + (reading.previous ? ' ‘' + reading.previous.name + '’' : '') + ' until ' + reading.until + ' — its months are there.';
}
/** Why a month is not recorded here (monthRefusal), in words. */
export function monthRefusalWords(r) {
  if (!r) return '';
  if (r.why === 'closed') return 'This plan is closed: its last month is ' + monthWordsOf(r.closedAt) + '. Record ' + monthWordsOf(monthAfter(r.closedAt)) + ' and later on the plan that carries it on.';
  return 'This plan carries on from ' + monthWordsOf(r.from) + '. Months before then are recorded on your previous plan.';
}
