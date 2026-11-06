/**
 * "Use these in ‘{plan}’" (6.59.0): question B's answer — "Am I saving enough?", opened from a saver's plan or answered after
 * a plan was kept from it — written back onto THAT plan, instead of a new plan made for every set of figures tried. Only
 * what goes in changes: what lands in the pension each month (a share of pay as the share, else the pounds, under the plan's
 * own scheme) and what goes into ISAs and savings, for the pay-in the person chose — as now, or what would be on course.
 * The same settings, written the same way, as the check-in's "Use these in my plan" (checkIn.js settingsFromCheckIn; one
 * write of What you pay in's own field, SAVING_WRITES, outside the lock). The ages, the pot, the yearly rise and everything
 * else in the plan stay as the plan has them. Pure: no clock, no store, no run.
 *
 *   answerPayInOf(result, { payIn })            → { ok, pay, payIn: { kind, …, savingsIn } } in the check-in's shape (what
 *                                                 lands a month), or { ok: false, problem: 'couple' | 'stopped' | 'notReady' }
 *   answerInPlanPatch(plan, result, { today, payIn }) → { ok, patch, previous, line } | { ok: false, problem }
 *     problem 'notSaving' (the plan is not still saving: LifeStage.checkInAllowed, as the check-in's own), 'couple' (the
 *     answer is for two people; a saver's plan is one person's), 'stopped' (the answer says you have stopped: nothing goes in),
 *     'notReady' (no answer to read, or no "on course" figure to use)
 *     line { id: 'usedAnswer' | 'usedSame', slots: { name, payIn, savings } } — what the answer page says changed
 */
import { atEnough } from '../keep/planSeed.js';
import { payInParts } from '../shared/payIn.js';
import { checkInAllowed } from '../../services/LifeStage.js';
import { planStage } from '../../services/PlanReading.js';
import { settingsFromCheckIn } from './checkIn.js';
import { SAVING_WRITES } from './schema.js';
import { get } from './about.js';
import { pounds } from './income.js';
import { dateOf } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const round2 = (n) => Math.round(n * 100) / 100;
const pctText = (v) => String(Math.round((+v || 0) * 10) / 10);
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';

/** The settings as the planner reads them: a key left out is £0 (the scheme, relief at source), so adding it as £0 changes nothing. */
const valueOf = (o, k) => (isObj(o) && o[k] !== undefined && o[k] !== null ? o[k] : k === 'schemeType' ? 'ras' : 0);
function sameSettings(a, b) {
  const keys = new Set([...Object.keys(isObj(a) ? a : {}), ...Object.keys(isObj(b) ? b : {})]);
  return [...keys].every((k) => JSON.stringify(valueOf(a, k)) === JSON.stringify(valueOf(b, k)));
}

/** The pay-in of the answer for "you", in the check-in's shape, at the chosen figure. */
export function answerPayInOf(result, { payIn = 'now' } = {}) {
  if (!isObj(result) || !isObj(result.inputs)) return { ok: false, problem: 'notReady' };
  if (result.inputs.household === 'couple') return { ok: false, problem: 'couple' };
  const at = payIn === 'enough' ? atEnough(result) : result;
  if (!at) return { ok: false, problem: 'notReady' };
  const saving = Array.isArray(at.saving) ? at.saving.find((s) => s && s.who === 'you') : null;
  if (!saving || !(saving.yearsSaving > 0)) return { ok: false, problem: 'stopped' };
  const given = at.inputs.you && at.inputs.you.payIn;
  const parts = payInParts(given);
  const savingsIn = round2(isNum(at.inputs.savingsIn) && at.inputs.savingsIn > 0 ? at.inputs.savingsIn : 0);
  if (parts.kind === 'share' && parts.pay > 0 && isNum(given.ownPct) && isNum(given.employerPct)) {
    return { ok: true, pay: parts.pay, payIn: { kind: 'share', ownPct: given.ownPct, employerPct: given.employerPct, savingsIn }, total: parts.total };
  }
  if (parts.kind === 'split' || (parts.kind === 'share' && parts.own !== null)) {
    return { ok: true, pay: null, payIn: { kind: 'split', own: round2(parts.own || 0), employer: round2(parts.employer || 0), savingsIn }, total: parts.total };
  }
  return { ok: true, pay: null, payIn: { kind: 'total', total: round2(parts.total || 0), savingsIn }, total: parts.total };
}

/** The words of what goes in, as the answer page says it changed. */
function payInWords(a) {
  const amount = pounds(Math.round(a.total || 0));
  return a.payIn.kind === 'share' ? pctText(a.payIn.ownPct + a.payIn.employerPct) + '% of your pay (' + amount + ' a month)' : amount + ' a month';
}

export function answerInPlanPatch(plan, result, { today, payIn = 'now' } = {}) {
  let stage = { key: 'unknown' };
  try { stage = planStage(plan, { now: dateOf(today) }); } catch { stage = { key: 'unknown' }; }
  if (!checkInAllowed(stage).ok) return { ok: false, problem: 'notSaving' };
  const a = answerPayInOf(result, { payIn });
  if (!a.ok) return { ok: false, problem: a.problem };
  const next = settingsFromCheckIn(plan, { pay: a.pay, payIn: a.payIn }, today);
  const cur = get(plan, 'accumulationTool.settings');
  const slots = { name: nameOf(plan), payIn: payInWords(a), savings: a.payIn.savingsIn > 0 ? pounds(Math.round(a.payIn.savingsIn)) : '' };
  if (sameSettings(cur, next)) return { ok: true, patch: {}, previous: {}, line: { id: 'usedSame', slots } };
  const patch = { 'accumulationTool.settings': next };
  for (const k of Object.keys(patch)) if (!SAVING_WRITES.includes(k)) throw new Error('useAnswer: "' + k + '" is not a declared field path');
  // A plan with no settings here (a saver by its Timing alone) has `undefined` as the previous value: Undo writes it back as
  // null in the account (and drops it in this window), the account's "absent", as the check-in's "Use these in my plan" does.
  // The plan then reads exactly as before — the same stage, the same figures in B — though `accumulationTool` stays as an
  // empty holder: the one write path declares the settings, never the holder above them.
  return { ok: true, patch, previous: { 'accumulationTool.settings': copy(cur) }, line: { id: 'usedAnswer', slots } };
}
