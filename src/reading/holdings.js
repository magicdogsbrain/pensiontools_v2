/**
 * What is held, against the plan (lead4.md D19; step F6): ONE reader each, for both views. The simple view's move page, the
 * home's line, What you hold and the full view's Transition tab read these and draw; nothing else works these out again.
 *
 *   moveReadingOf(plan, { now, life,     the ONE diff of a page: { m: { target, diff, prog, strategyParams } | null, asHeld }.
 *     fromSettings })                     `fromSettings` (the review, the home's drift line): an unlocked plan is read against
 *                                         its settings' year-0 mix, in memory (PlanReading.moveInputs).
 *                                         Living on a ladder, or Moving once what is held was accepted (Phases.heldPhase on
 *                                         the phase the home reads), every line is read as it is: no "Keep this" mark is a
 *                                         condition for counting (R9), and each line's part is carried (`roles`). Otherwise
 *                                         the plan with its marks (PlanReading.moveInputs, as before).
 *   giltsCountOf(T, D, { agreed })        the ONE "n of m gilts held": { held, part, total, counted } — rungs held in full (or
 *                                         more), rungs held in part, the plan's gilts; `counted` is what "n" says (ruling Z3):
 *                                         a gilt is held when any of it is held, so the gilts held in full and in part.
 *                                         Never a gilt set against a year by when it matures (R9).
 *   ladderGapsOf(T, D)                    the ONE reading of a ladder's gaps: { uncovered (tax years with no gilt held), parts
 *                                         (the plan's gilts held in part) } — a gilt held in part is never "not held yet"
 *   sheetOf(doc, reading)                 the order sheet's rows (GiltLadderPlan.orderSheetRows, the document's figures) with
 *                                         the bought column read from the same diff: 'bought', 'part', 'covered', 'paid',
 *                                         'sold', 'not yet'
 *   holdingsTotalsOf(plan)                the record's total and the total by account (HoldingsRecord.holdingsSummary)
 *   heldMixOf(plan, { pension })          what is held as a mix, in whole percent of the four buckets (Holdings.proportions):
 *                                         every account, or with `pension` the pension's lines alone (every line when none is
 *                                         in a pension: `fromPension` says which) — the split the held-mix test is run on.
 *                                         Null with nothing to read.
 *   heldMixPartsOf(plan, { pension })     the same split as fractions of one, for a run (answers/plan/move.js heldMixSettings)
 *   planMixOf(plan, { now })              the plan's own mix in whole percent: a locked plan's document (its year-0 target),
 *                                         else the plan's settings' year 0 (PlanDocument.buildTargetMix); null for a way
 *                                         bought by contract, which holds a ladder, not a mix
 *   mixAgainstPlanOf(plan, m, { now })    a pot plan's pension, bucket by bucket, held against the plan's mix (the home's line,
 *                                         the review, the move page held as it is, the agreement's stored mix): `held` is
 *                                         heldMixOf with `pension`, `plan` is planMixOf, `drift` their difference and
 *                                         `maxDrift` the largest; `assumed` the pension lines counted as shares because
 *                                         nothing says what they hold. Read only when the page's diff (`m`, moveReadingOf)
 *                                         has pension money to read on a pot plan; null else (a ladder has its own check)
 *
 * Pure: the plan brought up to date in memory and the day; nothing here writes or reads a clock.
 */
import { moveInputs, effectiveStressSettings } from '../services/PlanReading.js';
import { isRungRow } from '../services/TransitionPlanner.js';
import { normaliseHoldings, holdingsSummary } from '../services/HoldingsRecord.js';
import { proportions } from '../services/Holdings.js';
import { needsCategory } from '../services/HoldingsPaste.js';
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
export function moveReadingOf(plan, { now, life = null, fromSettings = false } = {}) {
  const asHeld = !!heldPhase(life) && ladderDoc(plan);
  let m = null;
  try { m = moveInputs(asHeld ? unmarked(plan) : plan, { now, ...(asHeld ? { roles: true } : fromSettings ? { fromSettings: true } : {}) }); } catch { m = null; }
  return { m, asHeld };
}

/** A ladder's gilts still to buy that are held in part (some of their units held: gaps.js heldOf's 'partRung'). */
const partRowsOf = (D) => (D && Array.isArray(D.buy) ? D.buy.filter((b) => b.kind === 'gilt' && num(b.heldUnits) > 0) : []);

/** The ONE "n of m gilts held" (see the header). Null for a plan that is not a ladder. */
export function giltsCountOf(T, D, { agreed = false } = {}) {
  if (!T || T.kind !== 'ladder' || !D) return null;
  const total = D.rungs ? D.rungs.needed : (T.lines || []).length;
  const held = D.rungs ? D.rungs.held : (D.hold || []).filter((h) => Array.isArray(h.taxYears)).length;
  const part = partRowsOf(D).length;
  // (ruling Z3) a gilt of the plan is held when any of it is held: `counted` is those held in full and those held in part,
  // agreed or not (`agreed` is kept for the callers; it no longer changes the count)
  void agreed;
  return { held, part, total, counted: Math.min(total, held + part) };
}

/**
 * The ONE reading of a ladder's gaps (see the header): { uncovered, parts } — the tax years whose gilt is not held at all
 * (sorted, as numbers) and the plan's gilts held in part (the diff's buy rows). A gilt held in part is never "not held": its
 * years are not in `uncovered`. Empty for a plan that is not a ladder.
 */
export function ladderGapsOf(T, D) {
  if (!T || T.kind !== 'ladder' || !D) return { uncovered: [], parts: [] };
  const parts = partRowsOf(D);
  const uncovered = [...new Set((D.buy || []).filter((b) => b.kind === 'gilt' && !parts.includes(b) && Array.isArray(b.taxYears)).flatMap((b) => b.taxYears.map(Number)))].sort((a, b) => a - b);
  return { uncovered, parts };
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

const BUCKETS = ['shares', 'bonds', 'diversifiers', 'cash'];
const inPension = (l) => String((l && l.wrapper) || 'SIPP').toUpperCase() === 'SIPP';

/** What is held as a split of one (see the header): { parts: { shares, bonds, diversifiers, cash }, fromPension }, or null. */
export function heldMixPartsOf(plan, { pension = false } = {}) {
  const rec = normaliseHoldings(plan && plan.holdings);
  const own = pension ? rec.lines.filter(inPension) : [];
  const fromPension = own.length > 0;
  let p = null; try { p = proportions(fromPension ? own : rec.lines); } catch { p = null; }
  if (!p || !(p.total > 0)) return null;
  const counted = BUCKETS.reduce((t, b) => t + num(p.buckets[b]), 0);
  if (!(counted > 0)) return null;
  return { parts: Object.fromEntries(BUCKETS.map((b) => [b, num(p.buckets[b]) / counted])), fromPension };
}

/**
 * Whole percents of a split of one that always add to 100 (largest remainder: each share rounded down, then the points left go
 * to the largest remainders, the first bucket first on a tie), so a mix never reads 63% and 38%.
 */
function wholePercents(parts) {
  const raw = BUCKETS.map((b) => ({ b, v: 100 * num(parts[b]) }));
  const out = Object.fromEntries(raw.map((r) => [r.b, Math.floor(r.v + 1e-9)]));
  let left = 100 - BUCKETS.reduce((t, b) => t + out[b], 0);
  const order = raw.map((r, i) => ({ ...r, i, rem: r.v - out[r.b] })).sort((x, y) => (y.rem - x.rem) || (x.i - y.i));
  for (const r of order) { if (left <= 0) break; if (r.rem > 1e-9) { out[r.b] += 1; left -= 1; } }
  return out;
}

/** What is held as a mix (see the header): { shares, bonds, diversifiers, cash } whole percent adding to 100, or null. */
export function heldMixOf(plan, { pension = false } = {}) {
  const h = heldMixPartsOf(plan, { pension });
  return h ? wholePercents(h.parts) : null;
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

/**
 * A pot plan's pension held against the plan's mix (see the header): { buckets: [{ bucket, held, plan }] (buckets held or in
 * the plan), drift: { shares, bonds, cash, diversifiers }, maxDrift, assumed: [names] }, or null. One sum: what is held is the
 * one held mix, what the plan holds the one plan's mix, so every page says the figures the held-mix test is run on.
 */
export function mixAgainstPlanOf(plan, m, { now } = {}) {
  const D = m && m.diff;
  if (!D || D.kind !== 'buckets' || !(num(D.inPlay) > 0)) return null;
  const held = heldMixOf(plan, { pension: true });
  const pm = planMixOf(plan, { now });
  if (!held || !pm) return null;
  const want = { shares: num(pm.shares), bonds: num(pm.bonds), cash: num(pm.cash), diversifiers: 0 };
  const order = ['shares', 'bonds', 'cash', 'diversifiers'];
  const drift = Object.fromEntries(order.map((b) => [b, num(held[b]) - want[b]]));
  const rec = normaliseHoldings(plan && plan.holdings);
  const own = rec.lines.filter(inPension);
  const assumed = (own.length ? own : rec.lines).filter((l) => (num(l.value) > 0) && needsCategory(l)).map((l) => String(l.name || l.ticker || '')).filter(Boolean);
  return {
    buckets: order.map((b) => ({ bucket: b, held: num(held[b]), plan: want[b] })).filter((x) => x.held > 0 || x.plan > 0),
    drift,
    maxDrift: Math.max(...order.map((b) => Math.abs(drift[b]))),
    assumed
  };
}
