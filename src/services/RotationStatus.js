/**
 * Rotation status (6.12) — what the "Gilt ladder + rotation" watch is doing today, in one line.
 *
 * The strategy's one escape (src/strategies/GiltRotation.js): while world equities are within `trigger`
 * (default 30%) of their all-time high, do nothing; on the first close at or below that, sell every rung
 * whose years all fund ages above `cutAge` (default 75) and buy the equity fund. The trigger DISARMS
 * `rotateDisarmYears` (default 8) before the block starts paying — a late crash has no runway, so it is
 * lived through on the rungs (research/rotation-plan-aug-2026.md §F). Three states, then:
 *   armed     — the plan-year age is at or below the disarm age: watch the market, nothing else to do
 *   disarmed  — past the disarm age with no rotation: the full ladder, held to maturity
 *   fired     — the block was sold (the guided switch records a `borrowedFloor` on the strategy params)
 * A ladder already bought therefore reads "complete — nothing to do" with, at most, this watch.
 *
 * Pure: (plan document, today, age) → status or null. No DOM, no storage.
 */
import { planYearOf } from './PlanTiming.js';

export const ROTATION_DEFAULTS = { cutAge: 75, triggerPct: 0.30, disarmYears: 8 };

/** The dealing fee the sell ticket takes off each rung's proceeds, and the spread a rung carries when it names none. */
export const SELL_FEE = 20;
export const SELL_SPREAD = 0.004;

/**
 * Split a buildGiltLadder plan at cutAge (from src/strategies/GiltRotation.js, 6.43.0: the same function, here so the
 * watch can be read without the engine; GiltRotation.js re-exports it).
 * @returns {{ keptYears, soldYears, soldOrders, blockCostToday, soldIncomeTotal }}
 */
export function splitLadderAtAge(plan, cutAge) {
  const soldYears = plan.years.filter((y) => y.age > cutAge && y.from !== 'cash' && y.from !== 'none');
  const keptYears = plan.years.filter((y) => !soldYears.includes(y));
  const soldTidms = new Set(soldYears.map((y) => y.from));
  // A rung is sold only when EVERY year it funds is above the cut (never split one gilt's job).
  const soldOrders = plan.orders.filter((o) => o.taxYears.every((Y) => {
    const yr = plan.years.find((y) => y.Y === Y); return yr && yr.age > cutAge;
  }) && soldTidms.has(o.tidm));
  const soldSet = new Set(soldOrders.map((o) => o.tidm));
  const actuallySoldYears = plan.years.filter((y) => soldSet.has(y.from));
  const blockCostToday = soldOrders.reduce((s, o) => s + o.cost, 0);
  const soldIncomeTotal = actuallySoldYears.reduce((s, y) => s + y.need, 0);
  return { keptYears, soldYears: actuallySoldYears, soldOrders, blockCostToday, soldIncomeTotal };
}

/**
 * The block the rotation would sell (index.html rotationWatchHtml, 6.43.0 lifted pure): the rungs whose every year funds
 * ages above the cut, the ages they fund, what they are worth today at the prices at lock (pays × clean price / 100), and
 * the income they would give up. Null when the plan has no such rung.
 */
export function rotationBlock(plan, cutAge) {
  if (!plan || !Array.isArray(plan.years) || !Array.isArray(plan.orders)) return null;
  const sp = splitLadderAtAge(plan, cutAge);
  if (!sp.soldOrders.length) return null;
  const value = sp.soldOrders.reduce((t, o) => t + (o.pays * (o.cleanPrice ?? 100) / 100), 0);
  const ages = sp.soldYears.map((y) => y.age);
  return { orders: sp.soldOrders, rungs: sp.soldOrders.length, ages: [Math.min(...ages), Math.max(...ages)], years: sp.soldYears.map((y) => +y.Y), value, income: sp.soldIncomeTotal };
}

/**
 * The market against the trigger (index.html checkRotationTrigger, lifted pure): how far the index is below its high, the
 * level the trigger fires at, and whether it is live. Null without both figures.
 * @param {{ level, ath, asOf?, athDate?, symbol? }|null} index
 */
export function rotationMarket(index, triggerPct = ROTATION_DEFAULTS.triggerPct) {
  const level = index ? +index.level : 0, ath = index ? +index.ath : 0;
  if (!(level > 0) || !(ath > 0)) return null;
  const drawdown = level / ath - 1;
  return { level, ath, asOf: (index && (index.asOf || index.date)) || null, athDate: (index && index.athDate) || null, symbol: (index && index.symbol) || null, drawdown, fireLevel: Math.round(ath * (1 - triggerPct)), live: drawdown <= -triggerPct };
}

/**
 * The sell ticket's rows (index.html giltSellTicketHtml, lifted pure): each rung of the block with the units to sell (the
 * nominal), its proceeds at the prices at lock less the spread and the dealing fee, the income given up and the tax years
 * it funded; the totals summed from the unrounded proceeds, as the planner sums them.
 */
export function sellTicketRows(orders) {
  const rows = (Array.isArray(orders) ? orders : []).map((o, i) => ({
    n: i + 1, name: String(o.name || ''), sedol: o.sedol || '', tidm: o.tidm || '', matures: o.matures || null,
    nominal: Math.round(+o.nominal || 0), proceeds: Math.max(0, (o.pays * (o.cleanPrice ?? 100) / 100) * (1 - (o.spread ?? SELL_SPREAD)) - SELL_FEE),
    pays: Math.round(+o.pays || 0), taxYears: Array.isArray(o.taxYears) ? o.taxYears.slice() : []
  }));
  return { rows, proceeds: rows.reduce((t, r) => t + r.proceeds, 0), income: rows.reduce((t, r) => t + r.pays, 0) };
}

/**
 * The rotation watch, whole (research/v7/holdings-and-move.md §3.7): the status (armed / disarmed / fired), the block it
 * would sell, the market against the trigger from the index figures handed in, and the sell ticket for the block. Null for
 * a plan whose way is not the rotation. `today` is handed in; nothing here reads a clock or fetches.
 * @param {object} doc  the plan document
 * @param {{ today: Date, ageToday?: number|null, params?: object|null, index?: { level, ath, asOf }|null }} o
 */
export function rotationWatch(doc, { today, ageToday = null, params = null, index = null } = {}) {
  const status = rotationStatus(doc, { today, ageToday, params });
  if (!status) return null;
  const plan = doc && doc.strategy && doc.strategy.r ? doc.strategy.r.plan : null;
  const block = rotationBlock(plan, status.cutAge);
  const market = rotationMarket(index, status.triggerPct);
  return { ...status, block, market, ticket: block ? sellTicketRows(block.orders) : null };
}

const dateGB = (iso) => { const d = new Date(String(iso) + (String(iso).length === 10 ? 'T00:00:00Z' : '')); return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };

/**
 * @param {object} doc  the plan document (strategy.id, strategy.params, timing, journey, optional rotation record)
 * @param {{ today?: Date, ageToday?: number|null, params?: object|null }} o
 *   `ageToday` — whole-years age today, the FALLBACK for a document without timing: the engine arms by the plan-year
 *   age (shapeAgeNow + plan year), which the document's timing gives exactly, so timing wins when present. `params` —
 *   the LIVE strategy params, when the shell has them: the document is a snapshot at lock time, so a rotation fired
 *   afterwards is only visible on the live settings.
 * @returns {null | { applies: true, cutAge, triggerPct, disarmAge, disarmYears, ageToday, state: 'armed'|'disarmed'|'fired',
 *   firedAt: string|null, yearsArmed: number|null, text }}
 */
export function rotationStatus(doc, { today = new Date(), ageToday = null, params = null } = {}) {
  const d = doc || {};
  if (!d.strategy || d.strategy.id !== 'gilt-rotation') return null;
  const prm = { ...(d.strategy.params || {}), ...(params || {}) };
  const cutAge = +prm.rotateCutAge > 0 ? Math.round(+prm.rotateCutAge) : ROTATION_DEFAULTS.cutAge;
  // The dials store the trigger as a percent (30); accept a fraction (0.30) too and always report a fraction.
  const trigRaw = +prm.rotateTrigger > 0 ? +prm.rotateTrigger : ROTATION_DEFAULTS.triggerPct * 100;
  const triggerPct = trigRaw > 1 ? trigRaw / 100 : trigRaw;
  const disarmYears = +prm.rotateDisarmYears > 0 ? +prm.rotateDisarmYears : ROTATION_DEFAULTS.disarmYears;
  const disarmAge = cutAge - disarmYears;
  // Fired = the guided switch wrote the borrowed floor, or the document/journey records the rotation.
  const bf = prm.borrowedFloor || (d.rotation && d.rotation.borrowedFloor) || null;
  const rec = d.rotation || {};
  const firedAt = (bf && bf.soldAt) || rec.firedAt || rec.soldAt || null;
  const journeyFired = Array.isArray(d.journey) && d.journey.some((j) => j && j.stage === 'rotated');
  const fired = !!(bf || rec.fired === true || firedAt || journeyFired);
  // The engine arms by the PLAN-YEAR age (GiltRotation.js: fires while y <= lastRotateYear = (cutAge − disarm) − startAge,
  // i.e. THROUGH the plan year in which the disarm age is reached). The document's timing gives that age exactly; a
  // whole-years age today is only the fallback for a document without timing. Mirrored exactly: armed while age <= disarmAge.
  let age = null;
  if (+d.timing?.shapeAgeNow > 0 && +d.timing?.firstTaxYear > 0) age = +d.timing.shapeAgeNow + planYearOf(today, +d.timing.firstTaxYear);
  else if (Number.isFinite(+ageToday) && +ageToday > 0) age = Math.floor(+ageToday);
  const state = fired ? 'fired' : (age != null && age > disarmAge) ? 'disarmed' : 'armed';
  const pct = Math.round(triggerPct * 100);
  let text;
  if (state === 'fired') text = 'Rotation fired' + (firedAt ? ' on ' + dateGB(firedAt) : '') + ': the rungs above ' + cutAge + ' were sold and the proceeds bought the equity fund. Income above ' + cutAge + ' now depends on that fund — the borrowed floor is on record on the plan.';
  else if (state === 'disarmed') text = 'Rotation watch disarmed: past age ' + disarmAge + ' the trigger no longer fires, so the rungs above ' + cutAge + ' are held to maturity whatever the market does. The ladder runs as bought — nothing to do.';
  else text = 'Rotation watch armed: if world equities close ' + pct + '% below their all-time high while you are ' + disarmAge + ' or younger, the rungs above ' + cutAge + ' are sold and buy the equity fund. Nothing to do until then.';
  return { applies: true, cutAge, triggerPct, disarmAge, disarmYears, ageToday: age, state, firedAt: firedAt || null, yearsArmed: state === 'armed' && age != null ? disarmAge - age : null, text };
}
