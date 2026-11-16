/**
 * Who is my partner? One reader for the household link (7.12.0), for both views.
 *
 * The link is written on one plan only (`household.partnerScenarioId`, ScenarioRepository.setHouseholdPartnerId and
 * answers/plan/household.js linkPatch). The rule is: read it either way, write it on this plan only. A plan that points at
 * this one is this plan's partner as much as the plan this one points at; when both exist, this plan's own link wins.
 * A closed plan is never a partner (6.56.0, PlanClosed.js): the plan that carries it on is.
 *
 *   partnerIdOf(plan)            this plan's own link, or null
 *   partnersOf(list, plan)       every open plan linked with this one, either way; this plan's own link first
 *   partnerOf(list, plan)        partnersOf(...)[0] || null
 *   linkedByOf(plan, partner)    'mine' | 'theirs' | 'both' (null when neither points at the other)
 *
 * `list` may hold plans or `{ plan }` entries (as PlanClosed.partnerCandidates takes); what comes back is the list's own
 * items, so an entry keeps its `newer` and `failed`. Pure.
 */
import { isClosedPlan } from './PlanClosed.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const planOf = (item) => (isObj(item) && isObj(item.plan) ? item.plan : item);

/** This plan's own link, or null. */
export function partnerIdOf(plan) {
  return (plan && isObj(plan.household) && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) || null;
}

/** Every open plan linked with `plan`, either way; the plan this one points at first. */
export function partnersOf(list, plan) {
  if (!isObj(plan) || plan.id == null) return [];
  const id = String(plan.id);
  const mine = partnerIdOf(plan);
  const items = (Array.isArray(list) ? list : []).filter((item) => {
    const p = planOf(item);
    return isObj(p) && p.id != null && String(p.id) !== id && !isClosedPlan(p) && (String(p.id) === mine || partnerIdOf(p) === id);
  });
  const own = items.filter((item) => String(planOf(item).id) === mine);
  return [...own, ...items.filter((item) => String(planOf(item).id) !== mine)];
}

/** The partner's plan (or entry), or null. */
export function partnerOf(list, plan) {
  return partnersOf(list, plan)[0] || null;
}

/** Which plan holds the link: 'mine' (this plan points at the partner), 'theirs', 'both', or null. */
export function linkedByOf(plan, partner) {
  const p = planOf(partner);
  if (!isObj(plan) || !isObj(p) || plan.id == null || p.id == null) return null;
  const mine = partnerIdOf(plan) === String(p.id), theirs = partnerIdOf(p) === String(plan.id);
  return mine && theirs ? 'both' : mine ? 'mine' : theirs ? 'theirs' : null;
}
