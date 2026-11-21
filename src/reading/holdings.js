/**
 * What is held, against the plan (lead4.md D19; step F6): ONE reader each, for both views. The simple view's move page, the
 * home's line, What you hold and the full view's Transition tab read these and draw; nothing else works these out again.
 *
 *   moveReadingOf(plan, { now, life })   the ONE diff of a page: { m: { target, diff, prog, strategyParams } | null, asHeld }.
 *                                         Living on a ladder, or Moving once what is held was accepted (Phases.heldPhase on
 *                                         the phase the home reads), every line is read as it is: no "Keep this" mark is a
 *                                         condition for counting (R9), and each line's part is carried (`roles`). Otherwise
 *                                         the plan with its marks (PlanReading.moveInputs, as before).
 *   giltsCountOf(T, D, { agreed })        the ONE "n of m gilts held": { held, part, total, counted } — rungs held in full (or
 *                                         more), rungs held in part, the plan's gilts; `counted` is what "n" says: once the
 *                                         person said this is how they want to hold it (`agreed`), a gilt of the plan they hold
 *                                         in part is held as they chose, so what they hold by choice is never read as 0.
 *                                         Never a gilt set against a year by when it matures (R9).
 *   sheetOf(doc, reading)                 the order sheet's rows (GiltLadderPlan.orderSheetRows, the document's figures) with
 *                                         the bought column read from the same diff: 'bought', 'part', 'covered', 'paid',
 *                                         'sold', 'not yet'
 *   holdingsTotalsOf(plan)                the record's total and the total by account (HoldingsRecord.holdingsSummary)
 *   heldMixOf(plan)                       what is held as a mix, in whole percent of the four buckets (Holdings.proportions,
 *                                         every account), or null with nothing to read
 *   planMixOf(plan, { now })              the plan's own mix in whole percent: a locked plan's document (its year-0 target),
 *                                         else the plan's settings' year 0 (PlanDocument.buildTargetMix); null for a way
 *                                         bought by contract, which holds a ladder, not a mix
 *
 * Pure: the plan brought up to date in memory and the day; nothing here writes or reads a clock.
 */
import { moveInputs, effectiveStressSettings } from '../services/PlanReading.js';
import { isRungRow } from '../services/TransitionPlanner.js';
import { normaliseHoldings, holdingsSummary } from '../services/HoldingsRecord.js';
import { proportions } from '../services/Holdings.js';
import { heldPhase } from '../services/Phases.js';
import { buildTargetMix, CONTRACT_STRATEGIES } from '../services/PlanDocument.js';
import { orderSheetRows } from '../strategies/GiltLadderPlan.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

/** The plan with every line's mark taken off, in memory: in the held phase every line counts as it is. */
function unmarked(plan) {
  const rec = normaliseHoldings(plan && plan.holdings);
  return { ...plan, holdings: { ...(isObj(plan && plan.holdings) ? plan.holdings : {}), lines: rec.lines.map((l) => { const { keep, ...rest } = l; return rest; }) } };
}

/** Whether the plan's document holds a ladder (a way bought by contract): the held phase then reads every line as it is. */
const ladderDoc = (plan) => !!(isLocked(plan) && isObj(plan.planDocument) && plan.planDocument.strategy && plan.planDocument.strategy.contract);

/**
 * The ONE diff a page reads (see the header). `life` is the phase the home reads (LifeStage.stageOf), or null.
 * @returns {{ m: object|null, asHeld: boolean }}
 */
export function moveReadingOf(plan, { now, life = null } = {}) {
  const asHeld = !!heldPhase(life) && ladderDoc(plan);
  let m = null;
  try { m = moveInputs(asHeld ? unmarked(plan) : plan, { now, ...(asHeld ? { roles: true } : {}) }); } catch { m = null; }
  return { m, asHeld };
}

/** The ONE "n of m gilts held" (see the header). Null for a plan that is not a ladder. */
export function giltsCountOf(T, D, { agreed = false } = {}) {
  if (!T || T.kind !== 'ladder' || !D) return null;
  const total = D.rungs ? D.rungs.needed : (T.lines || []).length;
  const held = D.rungs ? D.rungs.held : (D.hold || []).filter((h) => Array.isArray(h.taxYears)).length;
  const part = (D.buy || []).filter((b) => b.kind === 'gilt' && num(b.heldUnits) > 0).length;
  return { held, part, total, counted: agreed ? Math.min(total, held + part) : held };
}

/** The order sheet's rows with the bought column from the page's one diff (see the header). [] for a plan with no ladder. */
export function sheetOf(doc, reading) {
  const m = reading && reading.m;
  let rows = [];
  try { rows = orderSheetRows(doc); } catch { rows = []; }
  if (!rows.length || !m || !m.target || m.target.kind !== 'ladder' || !m.diff) return rows;
  const T = m.target, D = m.diff;
  const up = (s) => String(s || '').toUpperCase().trim();
  const keyOf = (o) => 'gilt:' + up(o.tidm || o.sedol || o.name);
  // a rung held above its target is bought, with more than it needs (7.11.1): never "not yet"
  const held = new Set([...(D.hold || []).map((h) => h.key), ...(D.sell || []).filter(isRungRow).map((s) => s.key)]);
  const partOf = new Map((D.buy || []).filter((b) => num(b.heldUnits) > 0).map((b) => [b.key, { toBuy: Math.round(num(b.units)), heldUnits: Math.round(num(b.heldUnits)) }]));
  const paid = new Set((T.paid || []).map((t) => t.key));
  const sold = new Set((T.sold || []).map((t) => t.key));
  const covered = new Set((D.covered || []).filter((c) => !c.part).map((c) => c.key));
  const boughtOf = (k) => (paid.has(k) ? 'paid' : sold.has(k) ? 'sold' : held.has(k) ? 'bought' : covered.has(k) ? 'covered' : partOf.has(k) ? 'part' : 'not yet');
  return rows.map((r) => { const k = keyOf(r); const bought = boughtOf(k); return { ...r, bought, part: bought === 'part' ? partOf.get(k) : null }; });
}

/** The record's totals (see the header): { count, total, byWrapper: { SIPP, ISA, GIA, CASH } }. */
export function holdingsTotalsOf(plan) {
  return holdingsSummary(normaliseHoldings(plan && plan.holdings));
}

const pct = (f) => Math.round(num(f) * 100);

/** What is held as a mix (see the header): { shares, bonds, diversifiers, cash } whole percent, or null. */
export function heldMixOf(plan) {
  let p = null; try { p = proportions(normaliseHoldings(plan && plan.holdings)); } catch { p = null; }
  if (!p || !(p.total > 0)) return null;
  return { shares: pct(p.buckets.shares), bonds: pct(p.buckets.bonds), diversifiers: pct(p.buckets.diversifiers), cash: pct(p.buckets.cash) };
}

/** The plan's own mix (see the header): { shares, bonds, cash, from: 'document'|'settings' } (a year-0 target has no gold and trend), or null. */
export function planMixOf(plan, { now } = {}) {
  const doc = isLocked(plan) && isObj(plan.planDocument) ? plan.planDocument : null;
  if (doc) {
    if (doc.strategy && doc.strategy.contract) return null;
    const m0 = Array.isArray(doc.targetMix) && doc.targetMix.length ? doc.targetMix[0] : null;
    return m0 ? { shares: Math.round(num(m0.equity)), bonds: Math.round(num(m0.bond)), cash: Math.round(num(m0.cash)), from: 'document' } : null;
  }
  let ss = null; try { ss = effectiveStressSettings(plan, { now }); } catch { ss = null; }
  if (!ss || ss.readFault || CONTRACT_STRATEGIES.includes(ss.strategyId)) return null;
  let mix = []; try { mix = buildTargetMix(ss, Math.max(1, Math.round(num(ss.duration) || 1))); } catch { mix = []; }
  const m0 = mix.length ? mix[0] : null;
  return m0 ? { shares: Math.round(num(m0.equity)), bonds: Math.round(num(m0.bond)), cash: Math.round(num(m0.cash)), from: 'settings' } : null;
}
