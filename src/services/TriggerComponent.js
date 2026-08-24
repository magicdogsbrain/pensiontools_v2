/**
 * Trigger Component — engine-level module (strategy brief §4b): when and how equity-sleeve
 * surplus above a glide path is converted into forward linker rungs. Pure maths, real terms,
 * ported exactly from the brief's Appendix A reference implementation. Used by the Phase C
 * ladder strategies; Pots & Valves does not use it.
 */

/** Glide-path value at month t: G(t) = E0 × (1+g)^(t/12). */
export function glidePathValue(E0, g, tMonths) {
  return E0 * Math.pow(1 + g, tMonths / 12);
}

/** The anti-underspending series: surplus above the path, emitted continuously (§4b). */
export function spendableSurplus(sleeveValue, E0, g, tMonths) {
  return Math.max(0, sleeveValue - glidePathValue(E0, g, tMonths));
}

/** Price of the rung funding plan-year k, seen from month t: P(k) × (1+y)^-(k − t/12). */
export function priceRung(drawForYearK, realYield, k, tMonths) {
  return drawForYearK * Math.pow(1 + realYield, -(k - tMonths / 12));
}

/**
 * Band-mode evaluation for one month (Appendix A stage1_band):
 * fires when sleeve ≥ threshold × G(t); skims the excess above skimTarget × G(t) into whole
 * sequential rungs. Returns the trade; the caller mutates its own state.
 * @returns {{fires, bought, spent, nextRung, sleeveAfter, excessLeft}}
 */
export function evaluateBandTrigger({ sleeveValue, tMonths, E0, glideRate, bandThreshold = 1.2,
  skimTargetFactor = 1, nextRung, maxRung, priceForYear, realYield = 0.023 }) {
  const G = glidePathValue(E0, glideRate, tMonths);
  const out = { fires: false, bought: 0, spent: 0, nextRung, sleeveAfter: sleeveValue, excessLeft: 0 };
  if (!(bandThreshold > 1)) throw new Error('bandThreshold must exceed 1');
  if (sleeveValue < bandThreshold * G || nextRung > maxRung) return out;
  out.fires = true;
  let excess = sleeveValue - skimTargetFactor * G;
  let V = sleeveValue;
  let rung = nextRung;
  while (rung <= maxRung) {
    const cost = priceForYear
      ? priceForYear(rung, tMonths)
      : priceRung(1, realYield, rung, tMonths); // caller supplies P(k) via priceForYear normally
    if (excess >= cost) {
      excess -= cost;
      V -= cost;
      rung += 1;
      out.bought += 1;
      out.spent += cost;
    } else break;
  }
  out.nextRung = rung;
  out.sleeveAfter = V;
  out.excessLeft = excess;
  return out;
}

/**
 * Calendar-mode evaluation at a review date (Appendix A stage1_calendar): skims whenever the
 * sleeve exceeds the path (no band multiple), same whole-rung sequential loop; optional cap on
 * rungs bought per review.
 */
export function evaluateCalendarReview({ sleeveValue, tMonths, E0, glideRate, nextRung, maxRung,
  priceForYear, realYield = 0.023, maxRungsPerReview = Infinity }) {
  const G = glidePathValue(E0, glideRate, tMonths);
  const out = { fires: false, bought: 0, spent: 0, nextRung, sleeveAfter: sleeveValue, excessLeft: 0 };
  if (sleeveValue <= G || nextRung > maxRung) return out;
  out.fires = true;
  let excess = sleeveValue - G;
  let V = sleeveValue;
  let rung = nextRung;
  while (rung <= maxRung && out.bought < maxRungsPerReview) {
    const cost = priceForYear ? priceForYear(rung, tMonths) : priceRung(1, realYield, rung, tMonths);
    if (excess >= cost) {
      excess -= cost; V -= cost; rung += 1; out.bought += 1; out.spent += cost;
    } else break;
  }
  out.nextRung = rung;
  out.sleeveAfter = V;
  out.excessLeft = excess;
  return out;
}

/** Review months for a calendar cadence over a ladder of L months. */
export function calendarReviewMonths(cadence, ladderMonths) {
  const step = cadence === 'annual' ? 12 : cadence === 'monthly' ? 1 : (cadence?.everyNYears || 5) * 12;
  const out = [];
  for (let t = step; t <= ladderMonths; t += step) out.push(t);
  return out;
}
