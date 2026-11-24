/**
 * "I accept this as my plan" (7.10.0; research/v7/replan-nov-2026.md §6; spec-7100 §3.3): the Moving review's agreement. After
 * "Test with what I hold" the person may say they have moved what they mean to move and accept what they hold, as it is,
 * with what it does to the money. It is never "leaving the plan": the plan, its settings and its document are not touched.
 * Until the month work stops the plan reads Moving with nothing due; from then, Living on it (LifeStage.stageOf).
 * Living on it (replan §6.4: a tactical difference from the plan's mix is information, and accepting it quiets it): the same
 * agreement on the Living-on-it review, after "Test with what I hold" from today on the pots entered; the home's line about
 * what is held then rests while it stands.
 *
 * ONE press, ONE write (schema.js AGREE_WRITES): `moving.agreed` in `phases` (with its review entry and a history line,
 * Phases.phasesPatch) and the one `asHeld` entry it carries in `planAmendments` (stressPanel.stressAmendPatch's `whole` branch:
 * kind 'asHeld', test.id 'whole', the figures accepted and what was held in whole points), and the stamp. Withdraw removes the
 * agreement and only the entry it carried (`at` = `entryAt`), in one write. The bad-years panel's agreements are other kinds,
 * so neither ever replaces or withdraws the other.
 *
 * Pure: no clock (today arrives as text, the moment as `at`), no engine (the run is the review effect's, held as `held`).
 *
 *   howOf(plan, { today })                    'done' (complete inside the band) | 'asHeld' | 'nothing' (no pension record to
 *                                             read), with the share of the move done and what is held in whole points
 *   agreePatch(plan, { today, at, held })     → { ok, problem, patch: { phases, planAmendments }, agreed, entry }
 *   agreeWithdrawPatch(plan, { at })          → { ok, problem, patch: { phases, planAmendments } }
 *   agreementViewOf(plan, R, { today })       what the Moving review shows of it: the state, whether it can be accepted now (a run
 *                                             held for this page), the confirm's clauses, the accepted line, why it is stale
 *   asHeldStateOf(plan, { today })            { status: 'none'|'agreed'|'stale', why: null|'version'|'moved'|'strategy',
 *                                             agreed, entry } — stale on a new fingerprint, a new version of the document
 *                                             (when the entry kept one), a bucket more than 5 points from what was held, or
 *                                             another way of drawing; a ladder never by points. Stale is information: what
 *                                             was accepted still decides the stage, as long as its way of drawing stands
 */
import { planPage, dateOf } from './read.js';
import { reviewEntryOf, reviewRunKeyOf, runInputsOf, readingOf } from './review.js';
import { stressAmendPatch, fingerprintOf, WHOLE_ID } from './stressPanel.js';
import { settingsForScreen } from '../../services/PlanReading.js';
import { moveReadingOf, mixAgainstPlanOf } from '../../reading/holdings.js';
import { phasesPatch, storedAgreementOf, strategyIdOf } from '../../services/Phases.js';
import { amendmentsOf, amendmentsWithout, documentAtOf } from '../../services/PlanAmendments.js';
import { isExamplePlan } from '../../services/GuestPlans.js';
import { dayWords } from './dates.js';
import { pounds } from './income.js';
import { chanceWords, twentiethsOfFutures } from '../shared/format.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { normaliseHoldings, holdingsSummary } from '../../services/HoldingsRecord.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const BUCKETS = ['shares', 'bonds', 'cash', 'diversifiers'];
/** How far a bucket may move from what was accepted, in points of the pension, before the agreement says it has moved. */
export const MOVED_POINTS = 5;

const safeSettings = (plan, now) => settingsForScreen(plan, { now });   // never the stored or factory settings in its place (lead4.md D1)
const isWhole = (e) => e && e.kind === 'asHeld' && isObj(e.test) && e.test.id === WHOLE_ID;

/**
 * What is held now, against the mix the plan moves to: the page's one diff (src/reading/holdings.js moveReadingOf) and, on a pot
 * plan, the one held mix against the one plan's mix (mixAgainstPlanOf) — `mix` is the held mix in whole points of the pension
 * (heldMixOf with `pension`), the figure the held-mix test is run on.
 */
function heldNow(plan, now) {
  const mv = moveReadingOf(plan, { now, fromSettings: true }).m;
  const diff = mv && mv.diff ? mv.diff : null;
  const x = mixAgainstPlanOf(plan, mv, { now });
  const drift = x ? { kind: 'buckets', drift: x.drift, maxDrift: x.maxDrift } : diff && diff.kind === 'ladder' ? { kind: 'ladder' } : null;
  const mix = x ? Object.fromEntries(BUCKETS.map((b) => [b, (x.buckets.find((r) => r.bucket === b) || { held: 0 }).held])) : null;
  return { diff, drift, mix };
}

/** How the move was agreed (see the header). */
export function howOf(plan, { today }) {
  const now = dateOf(today);
  const record = holdingsSummary(normaliseHoldings(plan && plan.holdings)).count > 0;
  const h = heldNow(plan, now);
  if (!record || !h.diff || h.diff.kind === 'none' || !h.drift) return { how: 'nothing', heldPct: null, heldMix: null };
  return { how: h.diff.complete ? 'done' : 'asHeld', heldPct: Number.isFinite(h.diff.progressPct) ? h.diff.progressPct : null, heldMix: h.mix };
}

/** The phase the plan is in today, and whether it closes (planPage's reading). */
function phaseNow(plan, today) {
  const pg = planPage([{ plan, newer: false, failed: false }], plan.id, null, { today });
  return { phase: pg.found && pg.life ? pg.life.key : null, closing: !!(pg.found && pg.closing) };
}

/** "Yes, this is my plan" (see the header): ONE write of `phases` and `planAmendments`, from the run held for this page. */
export function agreePatch(plan, { today, at, held = null, typed = {} } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {}, agreed: null, entry: null });
  if (!plan || isExamplePlan(plan)) return fail('example');
  const { phase, closing } = phaseNow(plan, today);
  if (closing || plan.closedAt != null || isClosedPlan(plan)) return fail('closed');
  if (phase !== 'moving' && phase !== 'drawing') return fail('notNow');
  const key = reviewRunKeyOf(plan, today, runInputsOf(plan, { today, typed, phase }));
  if (!held || held.status !== 'done' || !isObj(held.rows) || String(held.planId) !== String(plan.id)) return fail('noResult');
  if (held.key !== key) return fail('oldResult');
  // Living on it: only what is held, tested ("Test with what I hold"); Moving: what is held, else the plan as it stands
  const main = phase === 'drawing' ? held.rows.whole || null : held.rows.whole || held.rows.asPlanned || null;
  if (!main) return fail('noResult');
  const now = dateOf(today);
  const settings = safeSettings(plan, now);
  const h = howOf(plan, { today });
  if (phase === 'drawing' && h.how === 'nothing') return fail('noResult');
  const amend = stressAmendPatch(plan, { id: WHOLE_ID, result: main, heldMix: h.how === 'nothing' ? null : h.heldMix }, { at, today, settings });
  if (!amend.ok) return fail(amend.problem);
  const entry = reviewEntryOf(plan, { phase, today, typed, at, reading: readingOf(main, key) });
  let phases;
  try {
    phases = phasesPatch(plan, 'moving.agreed', { strategyId: strategyIdOf(plan, settings), how: h.how, heldPct: h.heldPct, entryAt: at, entry }, { at }).phases;
  } catch { return fail('problems'); }
  return { ok: true, problem: null, patch: { phases, planAmendments: amend.patch.planAmendments }, agreed: phases.moving.agreed, entry: amend.entry };
}

/**
 * "This is how I want to hold it" (7.12.0) on the move page: one press and a confirm, no test run. Moving only, on a plan not
 * closed and not an example. ONE write of `phases` alone (the agreement, with no review entry and no `planAmendments` entry:
 * asHeldStateOf reads an agreement with no entry as agreed). The tested route on "Your review" is unchanged.
 */
export function sayHeldPatch(plan, { today, at } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {}, agreed: null });
  if (!plan || isExamplePlan(plan)) return fail('example');
  const { phase, closing } = phaseNow(plan, today);
  if (closing || plan.closedAt != null || isClosedPlan(plan)) return fail('closed');
  if (phase !== 'moving') return fail('notNow');
  const settings = safeSettings(plan, dateOf(today));
  const h = howOf(plan, { today });
  let phases;
  try { phases = phasesPatch(plan, 'moving.agreed', { strategyId: strategyIdOf(plan, settings), how: h.how, heldPct: h.heldPct, entryAt: at }, { at }).phases; } catch { return fail('problems'); }
  return { ok: true, problem: null, patch: { phases }, agreed: phases.moving.agreed };
}

/** "Withdraw this" (see the header): the agreement and only the entry it carried, in one write. */
export function agreeWithdrawPatch(plan, { at } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {} });
  if (!plan || isExamplePlan(plan)) return fail('example');
  if (plan.closedAt != null || isClosedPlan(plan)) return fail('closed');
  const agreed = storedAgreementOf(plan);
  if (!agreed) return fail('none');
  let phases;
  try { phases = phasesPatch(plan, 'moving.withdrawn', null, { at }).phases; } catch { return fail('none'); }
  const planAmendments = amendmentsWithout(plan, (e) => isWhole(e) && e.at === agreed.entryAt);
  return { ok: true, problem: null, patch: { phases, planAmendments } };
}

/** Where the agreement stands (see the header). Nothing is written. */
export function asHeldStateOf(plan, { today } = {}) {
  const agreed = storedAgreementOf(plan);
  if (!agreed) return { status: 'none', why: null, agreed: null, entry: null };
  const now = dateOf(today);
  const entry = amendmentsOf(plan, ['asHeld']).filter((e) => isWhole(e) && e.at === agreed.entryAt).pop() || null;
  const stale = (why) => ({ status: 'stale', why, agreed, entry });
  const strategyNow = strategyIdOf(plan, safeSettings(plan, now));
  if (agreed.strategyId !== strategyNow) return { ...stale('strategy'), strategyNow };
  if (entry) {
    if (entry.fingerprint !== fingerprintOf(plan, 'asHeld', WHOLE_ID)) return stale('version');
    if (entry.documentAt != null && entry.documentAt !== (documentAtOf(plan) || null)) return stale('version');
    const then = entry.result && isObj(entry.result.heldMix) ? entry.result.heldMix : null;
    if (then) {
      const h = heldNow(plan, now);
      if (h.mix && BUCKETS.some((b) => Math.abs(num(h.mix[b]) - num(then[b])) > MOVED_POINTS)) return stale('moved');
    }
  }
  return { status: 'agreed', why: null, agreed, entry };
}

/**
 * What the Moving review shows of the agreement (see the header): `R` is review.js reviewOf's page with the run held for it.
 * Null on a plan that is not Moving and has no agreement.
 */
export function agreementViewOf(plan, R, { today } = {}) {
  if (!R || !R.found) return null;
  const st = asHeldStateOf(plan, { today });
  // Living on it: offered once what is held can be tested there (the review's 'whole' row), or shown when one stands
  const livingHeld = R.phase === 'drawing' && !!R.run && R.run.rows.includes('whole');
  if (R.phase !== 'moving' && !livingHeld && st.status === 'none') return null;
  const res = R.result || { status: 'idle' };
  const ran = res.status === 'done' && res.id !== 'na' && res.slots && (R.phase !== 'drawing' || res.id === 'held' || res.id === 'heldFixed');
  // what an agreement made now would be of: what is held, or (no pension record to read) the plan as it stands — the words
  // never say "what you hold" of a plan that records nothing
  let howNow = null; try { howNow = howOf(plan, { today }).how; } catch { howNow = null; }
  const canAccept = (R.phase === 'moving' || livingHeld) && R.editable && !!ran && st.status !== 'agreed';
  const confirm = ran ? (res.slots.chance
    ? { id: 'clauses', slots: { chance: res.slots.chance, age: res.slots.age, fixed: res.slots.fixed } }
    : { id: 'clausesFixed', slots: { age: res.slots.age, fixed: res.slots.fixed } }) : null;
  let accepted = null;
  if (st.agreed) {
    const r = st.entry && isObj(st.entry.result) ? st.entry.result : null;
    const date = dayWords(st.agreed.at);
    const age = r && Number.isFinite(r.planToAge) ? String(r.planToAge) : '';
    // what is typically left, the middle of every future tried: nothing in more than half of them is said as that
    const left = r && r.leftMedian != null ? (r.leftMedian > 0 ? 'some' : 'none') : null;
    accepted = r && Number.isFinite(r.chance)
      ? { id: left === 'some' ? 'accepted' : left === 'none' ? 'acceptedNoneLeft' : 'acceptedNoLeft', slots: { date, chance: chanceWords(r.chance), age, left: left === 'some' ? pounds(Math.round(r.leftMedian / 1000) * 1000) : '' } }
      : r ? { id: 'acceptedFixed', slots: { date, age, fixed: twentiethsOfFutures(Number.isFinite(r.fixedAge) ? r.fixedAge : 0) } }
        : { id: 'acceptedPlain', slots: { date } };
  }
  const stale = st.status === 'stale' ? { why: st.why, date: dayWords(st.agreed.at), old: st.agreed.strategyId, now: st.strategyNow || null } : null;
  // what the words say it was of: the agreement's own, else the one that would be made now
  const of = (st.agreed ? st.agreed.how : howNow) === 'nothing' ? 'asItStands' : 'held';
  return { status: st.status, phase: R.phase, how: st.agreed ? st.agreed.how : null, howNow, of, canAccept, confirm, accepted, stale, withdrawable: !!st.agreed && R.editable };
}