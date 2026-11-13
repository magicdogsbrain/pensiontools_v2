/**
 * A saved saver's plan read as question B (research/saving-enough-and-check-in.md 4.4, release step R2): the plan's own
 * figures as SCHEMA_B inputs, so the plan's verdict — "are you paying in enough, and what would be?" — is answerB itself.
 * One test, no second model: the count, the incomes from the stop, the gap and what would be enough are B's, worked out on
 * the same lives.
 *
 *   saverInputsOf(plan, { today, checkIn }) → { ok: true, inputs, env, notes } | { ok: false, why }
 *   saverDraftOf(plan, { today })           → { ok: true, values, exactMix, mixes } | { ok: false, why }: the same inputs
 *                                              as the text of question B's boxes (the rail's "Ask a question", 4.1), and
 *                                              the plan's own mixes B runs with
 *     inputs   SCHEMA_B inputs, checked (validate.js checkInputs)
 *     env      { mix, savingMix } — the plan's own mixes, exact, so no mix is rounded to a level; empty when the plan still
 *              says what the B answer it was kept from said (below)
 *     notes    what the screen says beside the verdict: the plan's aim a year before tax and a month after it, the plan's
 *              own yearly rise in pay-ins when it is not the price rise B assumes (and something goes in), the share of pay
 *              while it agrees, where the pot came from (`potFrom`: the check-in, a record, What you hold, the saved pot
 *              today, the answer the plan was kept from, or none), and whether it is a couple's plan read alone
 *     why      'notSaving' (no saving years: retired, or no age to stop at) | 'noAim' (no income set) | 'invalid'
 *
 * What it reads (4.4): the age today and the age to stop from the Timing block (else the Accumulation tab's ages, when the
 * plan is placed by them, LifeStage 4.6); the pot from the check-in being read, else the newest pot record, else the
 * pension lines under What you hold, else the Accumulation tab's pot today; what goes in from the check-in, else the
 * Accumulation settings — a share of pay while it agrees with the pounds (services/SaverPayIn.js), else your part and your
 * employer's in pounds as they land (AccumulationEngine.contributionBreakdown) — read as rising with prices, B's rule; the
 * State Pension and a final-salary pension from the plan's settings; ISAs and savings and what goes into them; the plan's
 * allocation and the saving mix the path uses (SavingPath.savingPathMixes: what you hold, else the kept saving mix, else
 * the allocation); the charge, how savings grow and the plan's last age (counted on the plan's own clock); and the plan's
 * income as the engines read it from its start — the figure in force then, a year before tax, as a month after tax by
 * the one tax module — with the steps after it as B's spending shape.
 *
 * The round trip (section 8): a plan kept from a B answer, read on the day it was kept, gives back that answer's count and
 * pay-in exactly. The plan holds the answer's figures as the planner holds them (pounds after × 0.8, a year before tax,
 * a mix in pounds), which do not all turn back to the penny. So each group of B's inputs — what goes in, what is spent,
 * the State Pension, the final-salary pension, the mixes, the savings, the last age — is taken from the answer the plan
 * was kept from (its `fromAnswer` record) while the plan still holds exactly what keeping that answer wrote for it
 * (PlanFromSeed.seedToScenario made again from the record); a group the person has changed since is read from the plan.
 * The answer's chance for what would be enough (`confidence`, 9 in 10 or 3 in 4) is its own choice, not a figure the plan
 * holds, so it is taken from the record whenever there is one; without one it is B's own default, 9 in 10.
 * A couple's plan is read alone (one person, their own figures) until couples are read together (release step R5), and
 * `notes.couple` says so.
 *
 * Money taken from a pension flexibly (research/plan-start.md §2 J; services/FlexibleAccess.js): a plan that carries the
 * person's `flexibleAccess` (a saving plan made on going back to work) is read as someone already drawing (`you.alreadyDrawing`,
 * B's own yes/no), so B's verdict — and "Am I saving enough?" opened from the plan with its figures — says the £10,000
 * limit on what goes in, as B says it to anyone who has drawn. A plan without it is read as before (B's default, no).
 *
 * Pure: no clock, no storage, no runs. A check-in (release step R3; answers/plan/checkIn.js) is read before the plan: its
 * pot ({ pension, isa }), its pay and what goes in ({ kind, ownPct, employerPct | own, employer | total, savingsIn }, what
 * lands a month) and a pause still running (nothing going in now) — checkInPayIn turns it into B's pay-in. The check-in's
 * verdict is this same test on its figures: no second model.
 */
import { SCHEMA_B } from '../b/schema.js';
import { checkInputs, draftTextOf } from '../shared/validate.js';
import { fullStatePensionYearly, SAVING, LEVEL_DEFAULT, levelOf as levelOfValue } from '../shared/rules.js';
import { effectiveStressSettings, planStage } from '../../services/PlanReading.js';
import { deriveTiming } from '../../services/PlanTiming.js';
import { saverPotOf } from '../../services/SaverReading.js';
import { contributionBreakdown } from '../../services/AccumulationEngine.js';
import { proportions, pensionPotFromHoldings } from '../../services/Holdings.js';
import { holdingsLines, normaliseWrapper, numOrNull } from '../../services/HoldingsRecord.js';
import { savingPathMixes } from '../../services/SavingPath.js';
import { amountAtAge } from '../../services/IncomeSchedule.js';
import { chargesPctOf, CHARGES_LIMITS } from '../../services/Charges.js';
import { isIsaGrowth } from '../../services/IsaGrowth.js';
import { RISK_PRESETS } from '../../services/GlidepathService.js';
import { payInShareOf, savingMixOf, PRICE_RISE_PCT } from '../../services/SaverPayIn.js';
import { seedToScenario } from '../../services/PlanFromSeed.js';
import { bandsOf, netOf } from './about.js';
import { flexibleAccessAlong } from '../../services/FlexibleAccess.js';
import { dateOf } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const round2 = (n) => Math.round(n * 100) / 100;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const same = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);
const accOf = (plan) => (plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {});
const LEVELS = ['cautious', 'balanced', 'adventurous'];

/** The risk level nearest a mix by its share in shares (the level only names the mix in B's words; the run uses the mix). */
function levelOf(mix) {
  if (!mix) return 'balanced';
  let best = 'balanced', gap = Infinity;
  for (const k of LEVELS) { const d = Math.abs((RISK_PRESETS[k].equity || 0) - (mix.equity || 0)); if (d < gap) { gap = d; best = k; } }
  return best;
}

/** The ISA lines under What you hold, summed; null when there are none (SavingPath's own rule). */
function isaFromHoldings(lines) {
  const isa = lines.filter((l) => l && normaliseWrapper(l.wrapper) === 'ISA' && numOrNull(l.value) != null);
  return isa.length ? isa.reduce((t, l) => t + numOrNull(l.value), 0) : null;
}

/**
 * The plan's income as the engines read it from its start (IncomeSchedule.scheduleFromSteps: the saved per-year schedule
 * first, else the steps compiled from the start age, else the flat target), a year before tax: the figure in force at
 * `headAge` and how it moves from there (the step in force: falling, moving evenly to the next step, or level), with every
 * step after it. Not the first step the plan holds: "About you and when" moves the stop without moving the steps, so a
 * plan whose stop moved later starts part-way down its steps, and the figure tested is the one it would draw then.
 */
function aimOf(ss, headAge) {
  const sched = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? num(ss.targetSchedule[0]) : null;
  if (ss.incomeShape === 'phases' && Array.isArray(ss.incomeSteps) && ss.incomeSteps.length) {
    const priced = ss.incomeSteps.filter((s) => s && num(s.amount) > 0 && num(s.fromAge) != null)
      .map((s) => ({ fromAge: num(s.fromAge), amount: +s.amount, decline: num(s.decline) || 0, glide: !!s.glideToNext }))
      .sort((a, b) => a.fromAge - b.fromAge);
    if (!priced.length) return null;
    // the step in force at the start (amountAtAge's own choice); none yet, or £0 then: the first step above £0, as before
    const at = priced.reduce((k, s, i) => (s.fromAge <= headAge ? i : k), -1);
    const inForce = sched != null && sched > 0 ? sched : at >= 0 ? amountAtAge(priced.map((s) => ({ fromAge: s.fromAge, amount: s.amount, decline: s.decline, glideToNext: s.glide })), headAge, 0) : 0;
    if (!(inForce > 0)) return { head: { ...priced[0], fromAge: headAge }, later: priced.slice(1) };
    const step = at >= 0 ? priced[at] : null;
    return { head: { fromAge: headAge, amount: inForce, decline: step ? step.decline : 0, glide: !!step && step.glide && at + 1 < priced.length }, later: priced.slice(at + 1) };
  }
  const flat = sched != null ? sched : num(ss.baseSalary);
  return flat > 0 ? { head: { fromAge: headAge, amount: flat, decline: 0, glide: false }, later: [] } : null;
}

/** "Falls by", in the steps B can hold (shape.js SHAPE_LIMITS.fallsPct: 0.25% to 10% in steps of 0.25). */
const fallsOf = (pct) => clamp(Math.round(pct * 4) / 4, 0.25, 10);

/** The plan's aim as B's spend: the figure in force at the start a month after tax, the later steps as B's spending shape. */
function spendOf(aim, bands, stopAge, endAge) {
  if (!aim) return null;
  const { head } = aim;
  const month = (gross) => Math.round(netOf(gross, bands) / 12);
  const thenOf = (s) => (s.decline > 0 ? { then: 'falls', fallsPct: fallsOf(s.decline) } : s.glide ? { then: 'glides' } : { then: 'level' });
  const amount = clamp(month(head.amount), 1, 50_000);
  const later = aim.later.filter((s) => s.fromAge > Math.max(stopAge, head.fromAge) && s.fromAge < endAge && s.amount > 0);
  const spend = { kind: 'amount', amount, ...(later.length || head.decline > 0 || head.glide ? thenOf(head) : {}) };
  if (later.length) spend.steps = later.map((s) => ({ fromAge: s.fromAge, perMonth: clamp(month(s.amount), 1, 50_000), ...thenOf(s) }));
  if (spend.then === 'glides' && !later.length) delete spend.then;
  return { spend, aimYearly: Math.round(head.amount), aimMonthly: amount };
}

/**
 * What goes in, as B's pay-in: a share of pay while the plan's share agrees with its pounds; else your part and your
 * employer's in pounds as they land (the tax added back included), or one figure with no employer part.
 */
function payInOf(acc) {
  const share = payInShareOf(acc);
  if (share) return { payIn: { kind: 'share', pay: Math.min(5_000_000, share.pay), ownPct: share.ownPct, employerPct: share.employerPct }, share };
  const net = num(acc.netMonthly) || 0, employer = num(acc.employerMonthly) || 0;
  let own = 0;
  try { own = net > 0 ? contributionBreakdown({ netMonthly: net, salary: num(acc.salary) || 0, schemeType: acc.schemeType || 'ras', employerMonthly: 0 }).grossMonthly : 0; } catch { own = 0; }
  const cap = SAVING.payInCeiling;
  if (employer > 0) return { payIn: { kind: 'split', own: clamp(round2(own), 0, cap), employer: clamp(round2(employer), 0, cap) }, share: null };
  return { payIn: { kind: 'total', total: clamp(round2(own), 0, cap) }, share: null };
}

/** What goes in, as the plan's saved settings say it (B's pay-in and the share it was read from): the check-in's prefill. */
export const planPayInOf = (plan) => payInOf(accOf(plan));

/**
 * A check-in's pay-in as B's (research/saving-enough-and-check-in.md 5.1, 5.6): the kind the person gave it in, what lands
 * a month. A pause still running at the check-in reads as nothing going in now — the verdict at £0 now — in the same kind,
 * so what would be enough is still said as a share of pay to a share payer. A share needs the pay it is of.
 */
export function checkInPayIn(ci) {
  const p = isObj(ci) && isObj(ci.payIn) ? ci.payIn : null;
  if (!p) return null;
  const pausedNow = isObj(ci.paused) && typeof ci.paused.from === 'string' && ci.paused.to == null;
  const cap = SAVING.payInCeiling;
  const m = (v) => (pausedNow ? 0 : clamp(round2(num(v) || 0), 0, cap));
  if (p.kind === 'share') return { kind: 'share', pay: Math.min(5_000_000, Math.max(0, num(ci.pay) || 0)), ownPct: pausedNow ? 0 : clamp(num(p.ownPct) || 0, 0, 100), employerPct: pausedNow ? 0 : clamp(num(p.employerPct) || 0, 0, 100) };
  if (p.kind === 'split') return { kind: 'split', own: m(p.own), employer: m(p.employer) };
  return { kind: 'total', total: m(p.total) };
}

/** Whether B's pay-in puts anything in a month. */
function paysIn(p) {
  if (!isObj(p)) return false;
  if (p.kind === 'split') return p.own > 0 || p.employer > 0;
  if (p.kind === 'share') return p.pay > 0 && (p.ownPct > 0 || p.employerPct > 0);
  return p.total > 0;
}

/** The State Pension as B takes it: the full amount (as B assumes it), a forecast a year, or none. */
function statePensionOf(ss) {
  const weekly = num(ss.spWeeklyAmount) || 0;
  const yearlyOld = num(ss.statePension) || 0;
  const yearly = weekly > 0 ? (yearlyOld > 0 && Math.abs(yearlyOld / 52 - weekly) < 0.01 ? yearlyOld : round2(weekly * 52)) : yearlyOld;
  if (!(yearly > 0)) return { kind: 'none' };
  if (Math.abs(yearly - fullStatePensionYearly()) < 0.01) return { kind: 'full' };
  return { kind: 'forecast', yearly: Math.min(20_000, round2(yearly)) };
}

/** A final-salary pension as B takes it, from the plan's settings. */
function finalSalaryOf(ss, clockAge) {
  const amount = num(ss.dbAmount) || 0;
  if (!(amount > 0)) return { has: false };
  const from = num(ss.dbStartAge) > 0 ? num(ss.dbStartAge) : clockAge + (num(ss.dbStartYear) || 0);
  return { has: true, yearly: clamp(Math.round(amount), 1, 200_000), fromAge: clamp(Math.round(from), 50, 75) };
}

/**
 * The plan as keeping its B answer wrote it, made again from the plan's own record of that answer (PlanFromSeed is pure:
 * the same seed gives the same plan); null when the plan was not kept from B, holds a couple's part, or cannot be made again.
 */
function keptFrom(plan, now) {
  const fa = plan && plan.fromAnswer;
  if (!isObj(fa) || fa.source !== 'b' || fa.household !== 'single' || !Array.isArray(fa.people) || fa.people.length !== 1 || !isObj(fa.inputs)) return null;
  try {
    const { who, savedOn, ...rest } = fa;
    void who;
    const made = seedToScenario({ ...rest, budget: null }, savedOn || fa.today).yours;
    return { plan: made, ss: effectiveStressSettings(made, { now }), acc: accOf(made), inputs: fa.inputs, answer: isObj(fa.answer) ? fa.answer : null };
  } catch { return null; }
}

/**
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, checkIn?: object|null, plans?: object[] }} o  `plans`: the plans at hand (plans or entries), so
 *   money taken flexibly on a plan before this one is read too (FlexibleAccess.flexibleAccessAlong)
 */
export function saverInputsOf(plan, { today, checkIn = null, plans = [] } = {}) {
  const now = dateOf(today);
  let ss, stage;
  try { ss = effectiveStressSettings(plan, { now }); stage = planStage(plan, { now }); } catch { return { ok: false, why: 'notSaving' }; }
  const t = deriveTiming(ss, now);
  const acc = accOf(plan);
  // Two ages: the plan's own clock (its year 0's age, which its years and its last age count from) and the age its income
  // is read at. With the Timing block's ages they are one, the start. A plan placed by the Accumulation tab's ages (4.6)
  // still runs on its old clock — "About you and when" shows its last age from it — while the person stops at the
  // Accumulation stop, so the income is read there: confirming the ages unchanged on About then changes nothing here.
  let age, stopAge, clockAge, headAge;
  if (t.mode === 'future' && t.currentAge > 0 && t.retireAge > 0) { age = Math.floor(t.currentAge); stopAge = Math.round(t.retireAge); clockAge = num(t.shapeAgeNow) || stopAge; headAge = clockAge; }
  else if (stage.fromAccumulation && stage.accumulationAges) { age = Math.floor(stage.accumulationAges.currentAge); stopAge = Math.round(stage.accumulationAges.retirementAge); clockAge = num(t.shapeAgeNow) || stopAge; headAge = stopAge; }
  else return { ok: false, why: 'notSaving' };
  if (!(stopAge > age)) return { ok: false, why: 'notSaving' };

  const bands = bandsOf(ss);
  const duration = num(ss.duration) || 0;
  const endAge = clamp(Math.round(clockAge + duration), 75, 105);
  const aim = spendOf(aimOf(ss, headAge), bands, stopAge, endAge);
  if (!aim) return { ok: false, why: 'noAim' };

  // the pot: the check-in's, else the newest record, else the pension lines under What you hold, else the tab's pot today
  const lines = holdingsLines(plan && plan.holdings);
  const hist = Array.isArray(plan && plan.accumulationTool && plan.accumulationTool.history) ? plan.accumulationTool.history : [];
  const ci = isObj(checkIn) ? checkIn : null;
  const rec = saverPotOf({ accHistory: hist, today: now });
  let pot = 0, potFrom = 'none', isa = null;
  if (ci && isObj(ci.pot) && isNum(ci.pot.pension)) { pot = ci.pot.pension; potFrom = 'checkIn'; isa = isNum(ci.pot.isa) ? ci.pot.isa : null; }
  else if (rec.source === 'record' && isNum(rec.pension)) { pot = rec.pension; potFrom = 'record'; isa = isNum(rec.isa) ? rec.isa : null; }
  else if (pensionPotFromHoldings(lines) > 0) { pot = pensionPotFromHoldings(lines); potFrom = 'holdings'; }
  else if (num(acc.potNow) > 0) { pot = +acc.potNow; potFrom = 'saved'; }
  if (isa == null) isa = isaFromHoldings(lines) != null ? isaFromHoldings(lines) : Math.max(0, num(ss.isaBalance) || 0);

  const ciPayIn = ci ? checkInPayIn(ci) : null;
  const read = ciPayIn ? { payIn: ciPayIn, share: ciPayIn.kind === 'share' && ciPayIn.pay > 0 ? ciPayIn : null } : payInOf(acc);
  // what goes into ISAs and savings: the check-in's when it says (nothing while a pause runs), else the plan's
  const ciSavingsIn = ciPayIn && isNum(ci.payIn.savingsIn) ? (isObj(ci.paused) && ci.paused.to == null ? 0 : ci.payIn.savingsIn) : null;
  let prop = null;
  try { const p = proportions(lines); if (p.total > 0) prop = p; } catch { prop = null; }
  const mixes = savingPathMixes(ss, prop, acc);
  const charge = chargesPctOf(ss);

  let inputs = {
    household: 'single',
    you: { pot: clamp(Math.round(pot), 0, 10_000_000), age, statePension: statePensionOf(ss), finalSalary: finalSalaryOf(ss, clockAge), payIn: read.payIn, ...(flexibleAccessAlong(plan, plans) ? { alreadyDrawing: true } : {}) },
    stop: { age: stopAge },
    spend: aim.spend,
    savings: clamp(Math.round(isa), 0, 10_000_000),
    savingsIn: clamp(round2(ciSavingsIn != null ? ciSavingsIn : num(acc.isaMonthly) || 0), 0, 10_000),
    savingRisk: levelOf(mixes.saving),
    risk: levelOf(mixes.drawing),
    charge: clamp(round2(Math.round(charge / CHARGES_LIMITS.step) * CHARGES_LIMITS.step), CHARGES_LIMITS.min, CHARGES_LIMITS.max),
    ...(isIsaGrowth(ss.isaGrowth) ? { isaGrowth: ss.isaGrowth } : {}),
    endAge,
    confidence: LEVEL_DEFAULT
  };
  let env = { mix: mixes.drawing, savingMix: mixes.saving };
  const from = {};

  // The answer the plan was kept from, group by group, while the plan still holds what keeping it wrote (the round trip).
  // A check-in brings its own figures, so no group is taken from the answer then — but the answer's own chance for what
  // would be enough still is (below), so a check-in leads with the same figure as What you pay in on the same plan.
  const kept = keptFrom(plan, now);
  if (kept && !ci) {
    const b = kept.inputs;
    const S = (keys) => keys.every((k) => same(ss[k], kept.ss[k]));
    const A = (keys) => keys.every((k) => same(acc[k], kept.acc[k]));
    const noRecords = potFrom === 'saved' || potFrom === 'none';
    const noHoldings = !lines.length;
    if (age === b.you.age && stopAge === (b.stop && b.stop.age) && S(['currentAge', 'retireAge', 'retired'])) from.ages = true;
    if (from.ages && A(['netMonthly', 'employerMonthly', 'salary', 'schemeType', 'payInKind', 'ownPct', 'employerPct'])) { inputs.you.payIn = b.you.payIn; from.payIn = true; }
    // the pot the answer was given: said as that, so the words beside the verdict never say "nothing" while it is counted
    if (from.ages && noRecords && noHoldings && A(['potNow'])) { inputs.you.pot = b.you.pot; from.pot = true; if (potFrom === 'none' && b.you.pot > 0) potFrom = 'answer'; }
    if (from.ages && S(['incomeShape', 'baseSalary', 'incomeSteps', 'targetSchedule', 'shapeAgeNow', 'duration', 'pa', 'brl', 'hrl'])) {
      inputs.spend = b.spend; inputs.endAge = b.endAge; from.spend = true;
    }
    if (from.ages && S(['statePension', 'spWeeklyAmount', 'spStartDate'])) { inputs.you.statePension = b.you.statePension; from.statePension = true; }
    if (from.ages && S(['dbAmount', 'dbStartYear', 'dbStartAge', 'shapeAgeNow'])) { inputs.you.finalSalary = b.you.finalSalary; from.finalSalary = true; }
    if (noHoldings && S(['equityMin', 'bondMin', 'cashTarget']) && A(['savingMix'])) { inputs.risk = b.risk; inputs.savingRisk = b.savingRisk; env = {}; from.mix = true; }
    if (noRecords && noHoldings && S(['isaBalance']) && A(['isaMonthly'])) { inputs.savings = b.savings; inputs.savingsIn = b.savingsIn; from.savings = true; }
    if (S(['chargesPct'])) inputs.charge = b.charge;
    if (S(['isaGrowth'])) { if (b.isaGrowth !== undefined) inputs.isaGrowth = b.isaGrowth; else delete inputs.isaGrowth; }
  }
  // the answer's own level (7.8.0): the person's only when they chose it (the kept answer row's `levelChosen`); a level
  // stored before 7.8.0 ("9 in 10" was everyone's default) is Balanced. No figure of the plan's, so it stays the answer's
  // for as long as the plan keeps the record of it — with a check-in too
  if (kept && kept.answer && kept.answer.levelChosen === true) inputs.confidence = levelOfValue(kept.inputs.confidence, { stored: true });
  // which figures for how long people live (7.8.0): the kept answer's, only when it said one (a plan saves none of its own);
  // else the box's default, not said (the figures for women). The saver's plan is read for one person, so `you` alone
  const keptSex = kept && kept.inputs && kept.inputs.you && kept.inputs.you.sex;
  if (keptSex === 'female' || keptSex === 'male') inputs.you.sex = keptSex;

  const checked = checkInputs(SCHEMA_B, inputs, { today });
  if (!checked.ok) return { ok: false, why: 'invalid', errors: checked.errors };
  inputs = checked.inputs;

  // the plan's own rise in pay-ins (escalationPct, % a year in pounds of the day): B reads what goes in as rising with
  // prices; a plan that raises it by another figure is told so (4.4) — until R4 reads the plan's own rise. Nothing going
  // in, or no saving figures at all: there is nothing to rise, so nothing is said.
  const esc = num(acc.escalationPct) || 0;
  const hasSaving = !!(plan && plan.accumulationTool && isObj(plan.accumulationTool.settings));
  const goesIn = paysIn(inputs.you.payIn) || inputs.savingsIn > 0;
  const rise = !hasSaving || !goesIn || Math.abs(esc - PRICE_RISE_PCT) < 1e-9 ? null : { pct: esc, path: esc < PRICE_RISE_PCT ? 'less' : 'more' };
  // a couple's plan is read on its own until two plans are read together (release step R5): the screen says so
  const couple = !!(plan && plan.household && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId)
    || !!(plan && isObj(plan.fromAnswer) && plan.fromAnswer.household === 'couple');
  return {
    ok: true, inputs, env,
    notes: {
      aimYearly: aim.aimYearly, aimMonthly: inputs.spend && inputs.spend.amount != null ? inputs.spend.amount : aim.aimMonthly, stopAge,
      rise, share: read.share ? { ownPct: read.share.ownPct, employerPct: read.share.employerPct } : null,
      potFrom, from, fromAccumulation: !!stage.fromAccumulation, couple
    }
  };
}

/**
 * The key a run of the plan's verdict is filed under: the plan, and every input the run reads — a plan whose saving
 * figures have not changed keeps its answer; any change asks again.
 */
export function saverRunKey(planId, read) {
  return read && read.ok ? 'saver:' + String(planId) + ':' + JSON.stringify([read.inputs, read.env]) : null;
}

/**
 * The plan's figures as question B's draft (4.1: the rail's "Ask a question" opens B with the plan's figures, instead of
 * empty): saverInputsOf's inputs as the text B's boxes hold (validate.js draftTextOf — parseDraft reads them back to the
 * same inputs), so the person asking B from their plan sees the answer their plan gives. B's boxes hold a risk level:
 * `exactMix` says the levels are the plan's mixes exactly (a plan kept from B, read as kept), and `mixes` is null; else
 * `mixes` is the plan's own mixes with the levels the boxes name them by ({ risk, savingRisk, mix, savingMix }), which the
 * draft carries (draft/load) so B runs on them, as the plan's own reading does, while those boxes stay as loaded.
 * @returns {{ ok: true, values: object, exactMix: boolean, mixes: object|null } | { ok: false, why: string }}
 */
export function saverDraftOf(plan, { today, plans = [] } = {}) {
  const read = saverInputsOf(plan, { today, plans });
  if (!read.ok) return { ok: false, why: read.why };
  const exactMix = !read.env || !read.env.mix;
  const mixes = exactMix ? null : { risk: read.inputs.risk, savingRisk: read.inputs.savingRisk, mix: read.env.mix, savingMix: read.env.savingMix || read.env.mix };
  return { ok: true, values: draftTextOf(SCHEMA_B, read.inputs), exactMix, mixes };
}
