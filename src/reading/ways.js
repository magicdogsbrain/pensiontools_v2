/**
 * The ways list (lead4.md D9, R6, R7; step F3): what both views say of each of the nine ways of drawing, from ONE function
 * each, so the simple view's cards ("How the money is taken") and the full view's Strategies overview (its ranking and its
 * side-by-side table) read one value per way:
 *
 *   wayNameOf(id)                         the way's one name (copy/way.js names: stressTest.js STRATEGY_NAMES, pinned by a test)
 *   wayVerdictOf(share)                   how many futures out of 10 it lasts, in words (OneAnswer.futuresOutOfTen)
 *   wayReasonOf(id, r, p, configs)        why a way cannot be bought: { why: 'cost'|'noGilt', cost, short } — the price the
 *                                         comparison's configs gave (or the ladder's own) against the pot it may spend
 *   wayCannotText(reason)                 the one sentence for it: { text, cost } (cost: the figure as shown, or null)
 *   boughtWhenOf(settings, timing)        when a bought way is bought: 'today' (a plan living on its money) or 'atStop' (a plan
 *                                         still saving: bought from the pots when work stops, priced at today's prices)
 *   BOUGHT_WORDS[when]                    the words for it, the same in both views
 *   wayFactIds(id)                        { name, verdict, cost } the marks each way's figures carry (way.<id>.name, ...)
 *
 * Pure: no clock, no engine run, no page. A plan with no figures of its own is never ranked (planHasFigures): both views
 * say what is missing instead (lead4.md D2, carry-over F3).
 */
import { FACT, factId } from './facts.js';
import { futuresOutOfTen } from '../services/OneAnswer.js';
import { WAY } from '../v7/copy/way.js';

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const r0 = (v) => Math.round(+v || 0);
const pounds = (n) => '£' + String(Math.abs(r0(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fill = (t, slots) => String(t).replace(/\{(\w+)\}/g, (m, k) => (slots[k] != null ? String(slots[k]) : m));

/** The money a bought way may spend (stressTest.js availablePot): the pension and the ISA, unless the ISA is held aside. */
export const availablePot = (p) => (+(p && p.pot) || 0) + (p && p.isaHold ? 0 : (+(p && p.isa) || 0));

/** The way's one name. */
export const wayNameOf = (id) => WAY.names[id] || String(id || '');

/** How many futures out of 10 a way lasts, in words: "in 9 futures out of 10". */
export const wayVerdictOf = (share) => futuresOutOfTen(share).words;

/** The marks of one way's figures. */
export const wayFactIds = (id) => ({ name: factId(FACT.WAY_EACH_NAME, id), verdict: factId(FACT.WAY_VERDICT, id), cost: factId(FACT.WAY_COST, id) });

/** Why a way cannot be bought: the cost the configs priced (or the ladder's own) against the pot, or no gilt long enough. */
export function wayReasonOf(id, r, p, configs) {
  const c = configs || {};
  const cost = id === 'ladder-and-ratchet' ? c.baseLadderCost : id === 'floor-and-flex' ? c.ffFloorCost : id === 'floor-the-schedule' ? c.fsFloorCost : id === 'floor-to-age' ? c.faFloorCost : id === 'bridge-and-engine' ? c.beCost : (r && r.plan && num(r.plan.total));
  const pot = availablePot(p);
  if (num(cost) != null && cost > pot) return { why: 'cost', cost: r0(cost), short: r0(cost - pot) };
  return { why: 'noGilt', cost: num(cost) != null ? r0(cost) : null, short: null };
}

/** The one sentence for a way the pot cannot buy, and its cost as shown (null when the cause is no gilt long enough). */
export function wayCannotText(reason) {
  const rs = reason || {};
  if (rs.why === 'cost' && rs.cost != null) { const cost = pounds(rs.cost); return { id: 'cannot', text: fill(WAY.card.cannot, { cost, short: pounds(rs.short) }), cost, short: pounds(rs.short) }; }
  return { id: 'cannotGilt', text: WAY.card.cannotGilt, cost: null, short: null };
}

/** When a bought way is bought, in words: the same in both views (lead4.md D9). */
export const BOUGHT_WORDS = Object.freeze({ today: 'bought today', atStop: 'bought when you stop, at today’s prices' });

/**
 * When a bought way is bought: a plan still saving (its timing in the future and not marked retired) buys from its pots when
 * work stops, priced at today's prices; any other plan buys today. `timing`: PlanTiming.deriveTiming's (or about.js safeTiming).
 */
export function boughtWhenOf(settings, timing) {
  const s = settings || {};
  const t = timing || {};
  return t.mode === 'future' && s.retired === false && num(+t.shapeAgeNow) ? 'atStop' : 'today';
}
