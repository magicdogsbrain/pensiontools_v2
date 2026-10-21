/**
 * "Your household" (research/v7/road-to-7.md step 9; your-plan.md 6; v6-usability-audit.md 2.10): a couple's two plans in
 * V7 — the partner's plan linked (either way), the pooled verdict first and each plan alone, "Who draws what" with "Use
 * this split" (copies when a plan is locked), the survivor and care questions asked in ages, one budget for the
 * household with "Keeping money separate?" as the option, and the budget's who-pays. Pure: the plans already brought up
 * to date in memory, today's date, what was typed in, and what page memory holds of the household's runs (state.household:
 * the pooled run, the survivor's and the care's); out come the partner and the other plans here, the boxes with their
 * values and problems, every figure in words with its slots, and the exact field paths and values each write carries.
 * Nothing here runs the test (householdRun.js, loaded lazily by the worker), writes, or reads a clock.
 *
 *   partnerOf(entries, plan)                       the plan linked to this one, either way (the plan's own link first), or null
 *   pairKeyOf(plan, partner)                       the key the household's runs are filed under: both plans' run keys (lasts.js runKeyOf)
 *   savedHousehold(plan, partner, { today })       the saved facts: the lock on each, the names, the budget's sharing, the dismissal
 *   boxesOf(plan, partner, { today })              the boxes' starting text (the planner's defaults, said as ages)
 *   checkHousehold(plan, partner, typed, { today }) text as typed → { ok, values, errors, applies, run }
 *   householdOf(entries, id, { today, typed, H })  everything the screen draws
 *   linkPatch(plan, partnerId)                     → { ok, patch, previous, line }: the partner link, as the planner writes it
 *   dismissPatch(plan, partnerId, fingerprint, { at }, dismiss)   "Keep things as they are" / "Show it again"
 *   splitPatches(plan, partner, split, { today })  → { mode: 'write', writes } | { mode: 'copies', copies }: "Use this split"
 *   shareBudgetPatches(plan, partner, share)       → the writes of "Share this plan's budget" / "Keep a separate budget"
 *   whoPaysPatches(plan, entries, typed, { today }) → the writes of the budget's who-pays (the lines go where they live)
 *
 * Every path written is in schema.js HOUSEHOLD_WRITES (tested).
 */
import { planStage, effectiveStressSettings } from '../../services/PlanReading.js';
import { personProfile, splitFingerprint, SPLIT_HEADLINE_MIN, settingsWithSchedule } from '../../services/HouseholdDraw.js';
import { isLockedPlan, splitWriteMode, shapeWords, splitCopyNames, SPLIT_KEYS } from '../../services/HouseholdSplitApply.js';
import { budgetSharedFromOf, shareBudgetWrite, stopSharingWrite, sharedBudgetView, ownSideOf } from '../../services/PlanCommit.js';
import { summariseBudget } from '../../services/BudgetModel.js';
import { currentAgeNow } from '../../utils/StatePensionUtils.js';
import { guestOwnPlans, GUEST_MAX_PLANS } from '../../services/GuestPlans.js';
import { futuresOutOfTen, pctText, CHANCE_BARS } from '../../services/OneAnswer.js';
import { isOnCourse, BORDERLINE_SHARE } from '../../services/OnCourse.js';
import { stageLine } from './read.js';
import { runKeyOf } from './lasts.js';
import { pounds } from './income.js';
import { HOUSEHOLD_FIELDS, HOUSEHOLD_WRITES, PAID_BYS } from './schema.js';
import { dateOf, dayWords } from './dates.js';

export { runKeyOf };

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
const pct = (share) => pctText((+share || 0) * 100, 0, [...CHANCE_BARS, 70]).replace(/%$/, '');
const inTen = (share) => futuresOutOfTen(+share || 0).words;
const safeSettings = (plan, now) => { try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {}; } };
const safeStage = (plan, now) => { try { return planStage(plan, { now }); } catch { return { key: 'unknown' }; } };

/** The plan linked to `plan`, either way (6): its own link first, else the first plan that points at it. */
export function partnerOf(entries, plan) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const mine = partnerIdOf(plan);
  const own = mine ? list.find((e) => String(e.plan.id) === String(mine) && String(e.plan.id) !== String(plan.id)) : null;
  return own || list.find((e) => String(e.plan.id) !== String(plan.id) && partnerIdOf(e.plan) === plan.id) || null;
}

/** The key the household's runs are filed under: both plans' run keys (a save of either moves it). */
export function pairKeyOf(plan, partner) {
  const a = runKeyOf(plan), b = runKeyOf(partner);
  return a && b ? a + '+' + b : null;
}

/** The person's age today from the effective settings (the budget's age folded in), whole years; null when not given. */
export function ageNowOf(ss, now) {
  const a = currentAgeNow(ss || {}, now);
  return a > 0 ? Math.floor(a) : (num(ss && ss.shapeAgeNow) || null);
}

/** The saved facts: the lock on each plan, the names, the budget's sharing, "Keep things as they are". */
export function savedHousehold(plan, partner, { today }) {
  const now = dateOf(today);
  const ssA = safeSettings(plan, now), ssB = partner ? safeSettings(partner, now) : null;
  const names = { a: nameOf(plan) || 'You', b: partner ? (nameOf(partner) || 'Partner') : 'Partner' };
  const mode = partner ? splitWriteMode(plan, partner, names) : { mode: 'write', locked: [] };
  const budget = {
    from: budgetSharedFromOf(plan),                                     // this plan reads the household's budget from that plan
    to: partner ? budgetSharedFromOf(partner) === String(plan.id) : false   // the partner reads this plan's budget
  };
  const fingerprint = partner ? splitFingerprint(ssA, ssB) : null;
  const d = plan && plan.household && isObj(plan.household.splitDismissed) ? plan.household.splitDismissed : null;
  const dismissed = !!(d && partner && d.partnerScenarioId === String(partner.id) && String(d.fingerprint) === String(fingerprint));
  const PA = personProfile(ssA, { now }), PB = ssB ? personProfile(ssB, { now }) : null;
  const smaller = PB ? ((PB.pot + PB.isa) <= (PA.pot + PA.isa) ? 'b' : 'a') : 'b';
  return {
    locked: isLocked(plan), lockedOn: isLocked(plan) ? dayWords(lockedAtOf(plan)) : null,
    partnerLocked: !!partner && isLocked(partner), partnerLockedOn: partner && isLocked(partner) ? dayWords(lockedAtOf(partner)) : null,
    names, mode: mode.mode, lockedNames: mode.locked, ssA, ssB, ageA: ageNowOf(ssA, now), ageB: ssB ? ageNowOf(ssB, now) : null,
    spAge: { a: PA.spAge, b: PB ? PB.spAge : null }, smaller, budget, fingerprint, dismissed, now
  };
}

/** The boxes' starting text: the planner's defaults (householdView.js), the "years from now" said as ages. */
export function boxesOf(plan, partner, { today }) {
  const s = savedHousehold(plan, partner, { today });
  const ageOf = (who) => (who === 'a' ? s.ageA : s.ageB) || 65;
  const b = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : {};
  const read = readBudget(plan, partner ? [{ plan: partner }] : []);
  return {
    'link.choice': '',
    'limit.kind': 'none', 'limit.age': String(s.spAge[s.smaller] || 67), 'limit.amount': '',
    'survivor.who': 'a', 'survivor.atAge': String(ageOf('a') + 10), 'survivor.spendPct': '70', 'survivor.dbPct': '50',
    'care.who': 'a', 'care.fromAge': String(ageOf('a') + 15), 'care.years': '3', 'care.cost': '90000',
    'budget.shared': read.budget.sharedWithPartner ? 'yes' : 'no', 'budget.mySharePct': String(Number.isFinite(+read.budget.mySharePct) ? +read.budget.mySharePct : (Number.isFinite(+b.mySharePct) ? +b.mySharePct : 50))
  };
}

/**
 * The budget this plan reads (ScenarioRepository.getActiveBudget): its own, or the household's lines with its own side of
 * who pays when it points at another plan. `holder` is the plan whose lines they are.
 */
export function readBudget(plan, entries) {
  const own = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : {};
  const from = budgetSharedFromOf(plan);
  const source = from ? (entries || []).map((e) => e && e.plan).find((p) => p && String(p.id) === String(from)) : null;
  const theirs = source && source.budgetTool && isObj(source.budgetTool.settings) ? source.budgetTool.settings : null;
  return theirs ? { budget: sharedBudgetView(theirs, own, from), holder: source, shared: true } : { budget: own, holder: plan, shared: false };
}

// ---- the boxes ----------------------------------------------------------------------------------------------------------

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s);
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parseWhole(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).replace(/[%\s,]/g, '');
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
const PLAN_ID = /^[A-Za-z0-9_-]{1,64}$/;
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'age' || f.type === 'count') return parseWhole(raw, f);
  if (f.type === 'id') return blank(raw) ? { error: null, value: null } : PLAN_ID.test(String(raw).trim()) ? { error: null, value: String(raw).trim() } : { error: 'notAnOption', value: null };
  if (blank(raw) && f.required && f.default == null) return { error: 'required', value: null };
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}
const applies = (f, values) => !f.when || Object.entries(f.when).every(([k, v]) => values[k] === v);

/** The who-pays cards of a budget's lines and one-offs, with what was typed laid over them. */
function readCards(budget, typed) {
  const out = {};
  for (const kind of ['lines', 'oneOffs']) {
    const items = Array.isArray(budget[kind]) ? budget[kind] : [];
    out[kind] = items.filter((it) => isObj(it) && it.id != null).map((it) => {
      const id = String(it.id);
      const pb = typed['budget.' + kind + '.' + id + '.paidBy'];
      const ps = typed['budget.' + kind + '.' + id + '.mySharePct'];
      const paidBy = blank(pb) ? (PAID_BYS.includes(it.paidBy) ? it.paidBy : (budget.sharedWithPartner ? 'shared' : 'me')) : String(pb);
      const share = blank(ps) ? (it.mySharePct == null || it.mySharePct === '' ? null : num(it.mySharePct)) : parseWhole(ps, { min: 0, max: 100, required: false }).value;
      const shareError = blank(ps) ? null : parseWhole(ps, { min: 0, max: 100, required: false }).error;
      return { id, kind, label: typeof it.label === 'string' ? it.label : '', saved: { paidBy: it.paidBy || null, mySharePct: it.mySharePct == null ? null : it.mySharePct }, touched: !blank(pb) || !blank(ps),
        paidBy, paidByError: PAID_BYS.includes(paidBy) ? null : 'notAnOption', mySharePct: share, shareError,
        shown: { paidBy, mySharePct: blank(ps) ? (it.mySharePct == null || it.mySharePct === '' ? '' : String(it.mySharePct)) : String(ps) } };
    });
  }
  return out;
}

/** Text as typed → the values the runs and the writes take, with every problem by path. */
export function checkHousehold(plan, partner, typed, { today }) {
  const boxes = boxesOf(plan, partner, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const values = {}, errors = {}, app = {};
  for (const f of HOUSEHOLD_FIELDS) {
    const on = applies(f, shown);
    app[f.path] = on;
    if (!on) continue;
    const p = parseField(shown[f.path], f);
    if (p.error) errors[f.path] = p.error; else values[f.path] = p.value;
  }
  const read = readBudget(plan, partner ? [{ plan: partner }] : []);
  const cards = readCards(read.budget, typed || {});
  for (const kind of ['lines', 'oneOffs']) for (const c of cards[kind]) {
    if (c.paidByError) errors['budget.' + kind + '.' + c.id + '.paidBy'] = c.paidByError;
    if (c.shareError) errors['budget.' + kind + '.' + c.id + '.mySharePct'] = c.shareError;
  }
  const ok = Object.keys(errors).length === 0;
  const s = savedHousehold(plan, partner, { today });
  // the runs' inputs, in the planner's units: a limit on the smaller pot (HouseholdDraw.limitFrom); the survivor's and the care's who and ages
  const limit = values['limit.kind'] === 'untilAge' && values['limit.age'] != null ? { kind: 'untilAge', who: s.smaller, age: values['limit.age'] }
    : values['limit.kind'] === 'keepAtLeast' && values['limit.amount'] != null ? { kind: 'keepAtLeast', who: s.smaller, amount: values['limit.amount'] } : null;
  const survivor = ['survivor.who', 'survivor.atAge', 'survivor.spendPct', 'survivor.dbPct'].every((k) => values[k] != null)
    ? { who: values['survivor.who'], atAge: values['survivor.atAge'], spendPct: values['survivor.spendPct'], dbPct: values['survivor.dbPct'] } : null;
  const care = ['care.who', 'care.fromAge', 'care.years', 'care.cost'].every((k) => values[k] != null)
    ? { who: values['care.who'], fromAge: values['care.fromAge'], years: values['care.years'], cost: values['care.cost'] } : null;
  return { ok, values, errors, applies: app, cards, read, run: { limit, survivor, care }, boxes, shown };
}

// ---- the writes -------------------------------------------------------------------------------------------------------------

const declared = (patch) => { for (const k of Object.keys(patch)) if (!HOUSEHOLD_WRITES.includes(k)) throw new Error('household: "' + k + '" is not a declared field path'); return patch; };

/** The partner link, as the planner writes it (ScenarioRepository.setHouseholdPartnerId: on this plan only; null unlinks). */
export function linkPatch(plan, partnerId) {
  const next = partnerId ? String(partnerId) : null;
  if (!plan || plan.id == null) return { ok: false, errors: { plan: 'missing' }, patch: {}, previous: {} };
  if (next && String(next) === String(plan.id)) return { ok: false, errors: { plan: 'self' }, patch: {}, previous: {} };
  const was = partnerIdOf(plan);
  if (was === next) return { ok: true, errors: {}, patch: {}, previous: {}, line: null };
  const previous = { 'household.partnerScenarioId': plan.household && 'partnerScenarioId' in plan.household ? copy(plan.household.partnerScenarioId) : undefined };
  return { ok: true, errors: {}, patch: declared({ 'household.partnerScenarioId': next }), previous, line: { id: next ? 'linked' : 'unlinked', slots: {} } };
}

/** "Keep things as they are" (HouseholdSplitApply.dismissalFor) on this plan, or "Show it again" (null), as the planner writes it. */
export function dismissPatch(plan, partnerId, fingerprint, { at }, dismiss = true) {
  const value = dismiss ? { partnerScenarioId: String(partnerId), fingerprint: String(fingerprint), at } : null;
  const previous = { 'household.splitDismissed': plan.household && 'splitDismissed' in plan.household ? copy(plan.household.splitDismissed) : undefined };
  return { ok: true, errors: {}, patch: declared({ 'household.splitDismissed': value }), previous, line: { id: dismiss ? 'kept' : 'shownAgain', slots: {} } };
}

/** The five keys the split's income shape changes on a plan's Stress settings (settingsWithSchedule), as a patch and its reverse. */
function shapePatch(plan, settings) {
  const stored = (plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  const patch = {}, previous = {};
  for (const k of SPLIT_KEYS) {
    if (text(stored[k]) === text(settings[k])) continue;
    patch['stressTool.settings.' + k] = copy(settings[k]);
    previous['stressTool.settings.' + k] = copy(stored[k]);
  }
  return { patch: declared(patch), previous };
}

/**
 * "Use this split" (HouseholdSplitApply.applySplit): on two unlocked plans, each plan's Stress settings with the split's
 * income shape (the five keys settingsWithSchedule sets, one write per plan); when either is locked, a copy of each with
 * those settings, named "{name} — drawing together" unless named, linked to each other (the planner's rule: a locked plan
 * is never changed). The split's settings are rebuilt here from its schedules on each plan's effective settings — the
 * same function the run used, so they are the run's.
 */
export function splitPatches(plan, partner, split, { today, copyNames = null } = {}) {
  const now = dateOf(today);
  if (!split || !split.applies || !split.schedules || !split.steps) return { ok: false, errors: { split: 'none' }, mode: null };
  const sA = safeSettings(plan, now), sB = safeSettings(partner, now);
  const settings = { a: settingsWithSchedule(sA, split.schedules.together.a, split.steps.a), b: settingsWithSchedule(sB, split.schedules.together.b, split.steps.b) };
  const names = split.names || { a: nameOf(plan) || 'You', b: nameOf(partner) || 'Partner' };
  const { mode } = splitWriteMode(plan, partner, names);
  const changes = ['a', 'b'].map((k) => {
    const p = k === 'a' ? plan : partner;
    const before = safeSettings(p, now);
    const same = (split.schedules.own[k] || []).every((v, y) => Math.abs(v - (split.schedules.together[k][y] || 0)) < 1);
    return { name: names[k], from: shapeWords(before), to: shapeWords(settings[k]), changed: !same };
  });
  if (mode === 'write') {
    const a = shapePatch(plan, settings.a), b = shapePatch(partner, settings.b);
    return { ok: true, errors: {}, mode, changes, writes: [{ planId: String(plan.id), ...a }, { planId: String(partner.id), ...b }], line: { id: 'split', slots: { a: names.a, b: names.b } } };
  }
  const cn = splitCopyNames({ names }, copyNames);
  return { ok: true, errors: {}, mode, changes, copies: [{ source: plan, name: cn.a, settings: settings.a }, { source: partner, name: cn.b, settings: settings.b }], line: { id: 'copies', slots: { a: cn.a, b: cn.b } } };
}

/** "Share this plan's budget" / "Keep a separate budget" (ScenarioRepository.shareBudgetWith, stopSharingBudget): the write on the partner's plan. */
export function shareBudgetPatches(plan, partner, share, { source = null } = {}) {
  if (!plan || !partner) return { ok: false, errors: { plan: 'missing' }, writes: [] };
  const data = share ? shareBudgetWrite(plan, partner) : stopSharingWrite(partner, source);
  const previous = { 'budgetTool.sharedFrom': partner.budgetTool && 'sharedFrom' in partner.budgetTool ? copy(partner.budgetTool.sharedFrom) : undefined, 'budgetTool.settings': partner.budgetTool ? copy(partner.budgetTool.settings) : undefined };
  return { ok: true, errors: {}, writes: [{ planId: String(partner.id), patch: declared(data), previous }], line: { id: share ? 'shared' : 'separate', slots: { b: nameOf(partner) || 'Partner' } } };
}

/**
 * The budget's who-pays (BudgetRepository.saveBudget through ScenarioRepository.saveActiveBudget): the sharing flag and the
 * budget-wide share on this plan; each line's and one-off's who-pays on the plan that holds the lines (this one, or the
 * household's when the budget is shared), with the totals recomputed as the planner recomputes them (`derived`).
 */
export function whoPaysPatches(plan, entries, typed, { today }) {
  const partner = partnerOf(entries, plan);
  const c = checkHousehold(plan, partner ? partner.plan : null, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, writes: [] };
  const read = readBudget(plan, entries.map((e) => ({ plan: e.plan })));
  const holder = read.holder;
  const holderBudget = (holder.budgetTool && isObj(holder.budgetTool.settings)) ? holder.budgetTool.settings : {};
  const ownBudget = (plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : {};
  const shared = c.values['budget.shared'] === 'yes';
  const share = shared ? c.values['budget.mySharePct'] : undefined;
  const nextItems = (kind) => (Array.isArray(holderBudget[kind]) ? holderBudget[kind] : []).map((it) => {
    const card = c.cards[kind].find((x) => isObj(it) && String(it.id) === x.id);
    if (!card || !card.touched) return it;   // a line nobody touched is written as stored (the planner writes who pays only when the select is changed)
    const out = { ...it, paidBy: card.paidBy };
    if (card.mySharePct == null) delete out.mySharePct; else out.mySharePct = card.mySharePct;
    return out;
  });
  const writes = [];
  const add = (p, patch, previous) => { if (Object.keys(patch).length) writes.push({ planId: String(p.id), patch: declared(patch), previous }); };
  const put = (patch, previous, budget, k, v) => { if (text(budget[k]) !== text(v)) { patch['budgetTool.settings.' + k] = copy(v); previous['budgetTool.settings.' + k] = copy(budget[k]); } };
  if (read.shared) {
    // the lines live on the household's plan; this plan keeps its own side of who pays (ScenarioRepository.saveActiveBudget)
    const hp = {}, hv = {};
    const nextHolder = { ...holderBudget, lines: nextItems('lines'), oneOffs: nextItems('oneOffs') };
    put(hp, hv, holderBudget, 'lines', nextHolder.lines);
    put(hp, hv, holderBudget, 'oneOffs', nextHolder.oneOffs);
    if (Object.keys(hp).length) put(hp, hv, holderBudget, 'derived', summariseBudget(nextHolder));
    add(holder, hp, hv);
    const op = {}, ov = {};
    const mine = ownSideOf({ ...ownBudget, sharedWithPartner: true, ...(share === undefined ? {} : { mySharePct: share }) });
    for (const k of ['sharedWithPartner', 'mySharePct']) if (k in mine) put(op, ov, ownBudget, k, mine[k]);
    add(plan, op, ov);
  } else {
    const p = {}, v = {};
    const next = { ...ownBudget, sharedWithPartner: shared, ...(share === undefined ? {} : { mySharePct: share }), lines: nextItems('lines'), oneOffs: nextItems('oneOffs') };
    put(p, v, ownBudget, 'sharedWithPartner', shared);
    if (share !== undefined) put(p, v, ownBudget, 'mySharePct', share);
    put(p, v, ownBudget, 'lines', next.lines);
    put(p, v, ownBudget, 'oneOffs', next.oneOffs);
    if (Object.keys(p).length) put(p, v, ownBudget, 'derived', summariseBudget(next));
    add(plan, p, v);
  }
  return { ok: true, errors: {}, writes, line: { id: 'whoPays', slots: { shared: shared ? 'yes' : 'no', share: share === undefined ? '' : String(share) } } };
}

// ---- the words of the runs ------------------------------------------------------------------------------------------------

/** The verdict word for a share: on course, close (from 70%), or not. */
const headOf = (share) => (isOnCourse(share) ? 'yes' : share >= BORDERLINE_SHARE ? 'close' : 'no');
const r5 = (fan) => (Array.isArray(fan) ? fan.filter((f, i) => i % 5 === 0) : []);

/** The pooled verdict and each plan alone, in words with slots (householdView.verdictSectionHtml, in V7's words). */
function verdictView(res, names, offsets) {
  const c = res && res.combined;
  if (!c) return null;
  const share = c.pooled ? c.pooled.success : c.jointSuccess;
  const covered = c.pooled ? (c.pooled.coveredByA || 0) + (c.pooled.coveredByB || 0) : 0;
  return {
    head: headOf(share), share, pct: pct(share), words: inTen(share), pooled: !!c.pooled,
    covered: c.pooled && covered > 0 && c.pooled.fromAgeMedian ? { n: String(covered), of: String(c.runs), from: String(c.pooled.fromAgeMedian), earliest: c.pooled.fromAgeEarliest && c.pooled.fromAgeEarliest !== c.pooled.fromAgeMedian ? String(c.pooled.fromAgeEarliest) : null } : null,
    rows: [
      { id: 'household', words: inTen(share), pct: pct(share) },
      { id: 'a', name: names.a, words: inTen(c.successA), pct: pct(c.successA) },
      { id: 'b', name: names.b, words: inTen(c.successB), pct: pct(c.successB) },
      { id: 'both', words: inTen(c.jointSuccess), pct: pct(c.jointSuccess) }
    ],
    runs: String(c.runs), shifted: !!(offsets && (offsets.a || offsets.b)),
    weak: isOnCourse(share) ? null : { name: c.successA <= c.successB ? names.a : names.b, pct: pct(Math.min(c.successA, c.successB)) }
  };
}

/** The split's headline and table (HouseholdDraw.headlineWords, householdView.splitSectionHtml) in V7's words: exact pounds, never "about". */
function splitView(split, fig, names, saved, mode) {
  if (!split) return null;
  const u = split.unused || {};
  const small = split.smaller, big = split.larger;
  const ages = (fig && fig.ages) || [67, 75, 90];
  const cell = (v) => (v == null ? '—' : pounds(v));
  const way = (w) => (w ? { a: w.potA.map(cell).join(' / '), b: w.potB.map(cell).join(' / '), lasts: w.lasts ? w.lasts.household.words : '…', left: w.left90 ? pounds(w.left90.p50) + ' / ' + pounds(w.left90.p10) : '…' } : null);
  return {
    applies: !!split.applies, unchanged: !!split.unchanged, dismissed: saved.dismissed, fingerprint: split.fingerprint, mode, lockedNames: saved.lockedNames,
    smallerName: names[small], biggerName: names[big], untilAge: String(split.untilAge),
    saving: { year: pounds(split.saving.year), until: pounds(split.saving.until), whole: pounds(split.saving.whole) },
    pots: { a: pounds(split.pots.a), b: pounds(split.pots.b) },
    unused: { over: pounds(u.over || 0), allowance: pounds(u.allowanceUnused || 0), band: u.bandMost ? 'most' : pounds(u.bandUnused || 0) },
    cost: fig && fig.cost && fig.cost.together != null && fig.cost.own != null ? { together: pounds(fig.cost.together), own: pounds(fig.cost.own) } : null,
    betterOff: fig && fig.betterOff90 != null ? { amount: pounds(Math.abs(fig.betterOff90)), better: fig.betterOff90 >= 0 } : null,
    tax: { firstYear: split.tax.firstYear ? { own: pounds(split.tax.firstYear.own), together: pounds(split.tax.firstYear.together) } : null, until: { own: pounds(split.tax.until.own), together: pounds(split.tax.until.together) }, whole: { own: pounds(split.tax.whole.own), together: pounds(split.tax.whole.together) } },
    ages: ages.join(' / '), own: fig ? way(fig.own) : null, together: fig ? way(fig.together) : null,
    note2028: split.note2028 || '', ladderNote: split.ladderNote || '',
    steps: { a: (split.steps.a || []).map((s) => ({ fromAge: String(s.fromAge), amount: pounds(s.amount) })), b: (split.steps.b || []).map((s) => ({ fromAge: String(s.fromAge), amount: pounds(s.amount) })) }
  };
}

/** The survivor's result in words (householdView.survivorResultHtml). */
function survivorView(S, names, sids) {
  if (!S) return { status: 'off' };
  const base = { status: S.status, boxes: S.boxes, ms: S.ms == null ? null : S.ms, reason: S.status === 'failed' ? S.reason || null : null };
  if (S.status !== 'done' || !S.result) return base;
  const r = S.result;
  const deceased = r.who === 'b' ? names.b : names.a, survivor = r.who === 'b' ? names.a : names.b;
  if (!r.affordable) return { ...base, result: { affordable: false, deceased, reason: r.reason || '' } };
  const lasts = (x) => (x && x.a ? inTen(x.a.share) : null);
  return { ...base, result: {
    affordable: true, deceased, survivor, atAge: String(r.atAge), years: String(r.deathYear),
    head: headOf(r.middling.a ? r.middling.a.share : 0),
    middling: lasts(r.middling), middlingReason: r.middling.reason || null, bad: lasts(r.bad), badReason: r.bad.reason || null,
    inherit: { middling: pounds(r.inherited.middling.total), bad: pounds(r.inherited.bad.total), held: r.inherited.heldIsa > 0 ? pounds(r.inherited.heldIsa) : null },
    spending: { gross: pounds(r.spending.gross), net: pounds(r.spending.net), pct: String(r.spendPct) },
    ways: { deceased: sids[r.who === 'b' ? 'b' : 'a'], survivor: sids[r.who === 'b' ? 'a' : 'b'] }, runs: String(r.basis && r.basis.runs ? r.basis.runs : 3)
  } };
}

/** The care result in words (householdView.careResultHtml). */
function careView(Cc, names) {
  if (!Cc) return { status: 'off' };
  const base = { status: Cc.status, boxes: Cc.boxes, ms: Cc.ms == null ? null : Cc.ms, reason: Cc.status === 'failed' ? Cc.reason || null : null };
  if (Cc.status !== 'done' || !Cc.result) return base;
  const r = Cc.result;
  if (!r.affordable) return { ...base, result: { affordable: false, reason: r.reason || '' } };
  const shareOf = (c) => (c ? (c.pooled ? c.pooled.success : c.jointSuccess) : 0);
  const withIt = shareOf(r.care), without = shareOf(r.baseline);
  return { ...base, result: {
    affordable: true, name: r.who === 'B' ? names.b : names.a, fromAge: String(r.fromAge), years: String(r.years), cost: pounds(r.annualCost), total: pounds(r.totalCareCost), totalGross: pounds(r.totalCareGross),
    head: headOf(withIt), withWords: inTen(withIt), withoutWords: inTen(without), pooled: !!(r.care && r.care.pooled),
    bothWith: inTen(r.care ? r.care.jointSuccess : 0), bothWithout: inTen(r.baseline ? r.baseline.jointSuccess : 0), runs: String(r.basis && r.basis.runs ? r.basis.runs : 3)
  } };
}

/**
 * Everything the screen draws. `H` is state.household (the runs held: `key`, `status`, `limit`, `result`, `ms`, `reason`,
 * `progress`, `survivor`, `care`, `pick`); `typed` the plan draft's values.
 */
export function householdOf(entries, id, { today, typed = null, H = null, source = 'account' } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const now = dateOf(today);
  const readonly = !!(entry.newer || entry.failed);
  const pe = partnerOf(list, plan);
  const partner = pe ? pe.plan : null;
  const saved = savedHousehold(plan, partner, { today });
  const mine = partnerIdOf(plan);
  const missing = !!mine && !list.some((e) => String(e.plan.id) === String(mine));
  const candidates = list.filter((e) => String(e.plan.id) !== String(plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan), locked: isLocked(e.plan) }));
  const c = checkHousehold(plan, partner, typed || {}, { today });
  const fields = HOUSEHOLD_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null, applies: c.applies[f.path] !== false,
    shown: blank(c.shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(c.shown[f.path]),
    saved: f.path in c.boxes ? c.boxes[f.path] : null, error: c.errors[f.path] || null
  }));
  const runKey = readonly || !partner || (pe.newer || pe.failed) ? null : pairKeyOf(plan, partner);
  const h = H && runKey && H.key === runKey ? H : null;
  const names = saved.names;
  const sids = { a: (saved.ssA && saved.ssA.strategyId) || 'pots-and-valves', b: saved.ssB ? (saved.ssB.strategyId || 'pots-and-valves') : null };
  const result = h && h.status === 'done' && h.result ? h.result : null;
  const ok = !!(result && result.ok);
  // the plan chosen to link must be one of the other plans here
  if (c.values['link.choice'] && !candidates.some((x) => x.id === c.values['link.choice'])) c.errors['link.choice'] = 'notAnOption';
  // "Use this split": what each plan's income shape becomes, for the confirm (HouseholdSplitApply.splitChanges in V7's words)
  const sp = ok && result.split && result.split.applies && partner ? splitPatches(plan, partner, result.split, { today }) : null;
  const stale = !!(h && h.status === 'done' && text(h.limit || null) !== text(c.run.limit));
  const partnerView = partner ? {
    id: String(partner.id), name: names.b, locked: saved.partnerLocked, lockedOn: saved.partnerLockedOn, readonly: !!(pe.newer || pe.failed),
    line: stageLine(safeStage(partner, now), partner, saved.ssB), configured: !!(partner.stressTool && isObj(partner.stressTool.settings) && partner.stressTool.settings.configured),
    linkedBy: mine === String(partner.id) ? (partnerIdOf(partner) === String(plan.id) ? 'both' : 'mine') : 'theirs'
  } : null;
  const budgetRead = c.read;
  const whoPays = {
    shared: c.values['budget.shared'] === 'yes', holderName: budgetRead.shared ? names.b : names.a, readsShared: budgetRead.shared,
    lines: c.cards.lines, oneOffs: c.cards.oneOffs
  };
  const wp = !readonly ? whoPaysPatches(plan, list, typed || {}, { today }) : { ok: false, writes: [] };
  return {
    found: true, id: String(plan.id), name: names.a, locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable: !readonly, source,
    partner: partnerView, missing: missing ? { id: mine } : null, candidates, names, runKey, mode: saved.mode, lockedNames: saved.lockedNames,
    // copies need room: an account always has it; this window holds three plans at most (services/GuestPlans.js), the example plan not counted
    copyRoom: saved.mode !== 'copies' || source !== 'window' || guestOwnPlans(list.map((e) => e.plan)).length + 2 <= GUEST_MAX_PLANS,
    ages: { a: saved.ageA == null ? null : String(saved.ageA), b: saved.ageB == null ? null : String(saved.ageB) }, smaller: saved.smaller,
    fields, errors: c.errors, ok: c.ok, run: c.run,
    status: h ? h.status : 'idle', reason: h && h.status === 'failed' ? h.reason || null : null, ms: h && h.ms != null ? h.ms : null, progress: h ? h.progress : null, stale,
    runs: result && result.basis ? String(result.basis.runs) : null,
    unaffordable: result && !result.ok ? { which: result.which === 'b' ? names.b : names.a, reason: result.reason === 'partnerNotSet' ? null : (result.why || ''), kind: result.reason } : null,
    verdict: ok ? verdictView(result.own, names, result.offsets) : null,
    timeline: ok && Array.isArray(result.timeline) ? result.timeline.map((r) => ({ year: String(r.year), bridge: !!r.bridge, workingA: !!r.workingA, workingB: !!r.workingB, needA: pounds(r.needA), needB: pounds(r.needB), sp: pounds(r.spA + r.spB), other: pounds(r.db + r.other), draw: pounds(r.drawNeed) })) : [],
    left: ok && result.own && result.own.combined ? r5(result.own.combined.potFan).map((f) => ({ year: String(f.year), p10: pounds(f.p10), p50: pounds(f.p50), p90: pounds(f.p90) })) : [],
    split: ok ? splitView(result.split, result.fig, names, saved, saved.mode) : null,
    survivor: survivorView(h ? h.survivor : null, names, sids),
    care: careView(h ? h.care : null, names),
    // the confirm shown and the copies kept belong to the page, not to a run's key (a confirm may open before any run)
    pick: H ? H.pick || null : null, kept: H && H.kept ? H.kept : null, changes: sp && sp.ok ? sp.changes : [],
    budget: { from: saved.budget.from, to: saved.budget.to, shared: !!(saved.budget.from || saved.budget.to) },
    whoPays, changed: wp.ok && wp.writes.length > 0, writes: wp.ok ? wp.writes : [],
    savedLine: wp.ok ? wp.line : null,
    sids
  };
}
