/**
 * Withdrawal Sourcing — the single "which pot pays this month" rules engine (both tools).
 *
 * Grounded in the published standards (see design/strategies/pots-and-valves.md):
 *  - PARTIAL/MIXED draws (Guyton-Klinger's funding cascade; Benz's combined refill; Kitces'
 *    rebalancing-as-income): growth funds what its floors allow, the remainder cascades to the
 *    cash side. All-or-nothing switching is the nonstandard choice — removed.
 *  - CASH-SIDE ORDER by relative overweight vs target (G-K Portfolio Management Rule: sell what
 *    held its value, protect what's depressed): cash first, then the sleeve most overweight
 *    against its target (diversifiers vs their flat start, bonds vs floor, equity vs floor),
 *    HODL strictly last (break-glass). After a crash this reproduces the old fixed order
 *    (diversifiers → bonds → equity) but adapts when e.g. bonds rallied instead.
 *  - REFILL cash only, from growth surplus (Evensky's cash-flow reserve, Benz's bucket 1;
 *    Kitces: bucket maintenance IS rebalancing). Never auto-refill growth pots.
 *  - ONE ENGINE for simulation and advice (Income Lab/Kitces): the stress tester EXECUTES this
 *    plan; the Decision tool RECOMMENDS the identical numbers.
 *
 * Pure function. All £ nominal, same units in and out.
 */

export const SOURCING_DEFAULTS = {
  REPLENISH_GATE: 5000,      // growth surplus (after the draw) must exceed this to refill cash
  REPLENISH_SHORTFALL_FRAC: 0.3,  // refill at most 30% of the cash shortfall per month
  REPLENISH_SURPLUS_FRAC: 0.5     // ...and at most 50% of the month's surplus
};

/**
 * @param {object} p
 * @param {number} p.draw - this month's SIPP-side draw (already protection-adjusted)
 * @param {number} p.equity,p.bond,p.cash - current pot values
 * @param {number} [p.diversifier=0] - diversifiers sleeve value
 * @param {number} [p.diversifierTarget=0] - its held-flat target (start value)
 * @param {number} [p.hodl=0] - break-glass reserve
 * @param {number} p.eqMin,p.bdMin - growth floors this month
 * @param {number} p.csTarget - cash floor (real-value target)
 * @param {boolean} p.inProtection - protection mode this month
 * @returns {{fromEquity, fromBond, fromCash, fromDiversifier, fromHodl, shortfall,
 *            source: string, replenish: number, reason: string}}
 */
export function planSourcing(p) {
  const div = p.diversifier || 0;
  const hodl = p.hodl || 0;
  const out = { fromEquity: 0, fromBond: 0, fromCash: 0, fromDiversifier: 0, fromHodl: 0, shortfall: 0, replenish: 0, source: 'Cash', reason: '' };
  let remaining = p.draw;

  // Growth pays first — but ONLY above its floors, and never in protection.
  const eqSurplus = Math.max(0, p.equity - p.eqMin);
  const bdSurplus = Math.max(0, p.bond - p.bdMin);
  const growthSurplus = eqSurplus + bdSurplus;
  if (!p.inProtection && growthSurplus > 0) {
    const fromGrowth = Math.min(remaining, growthSurplus);
    out.fromEquity = fromGrowth * eqSurplus / growthSurplus;
    out.fromBond = fromGrowth * bdSurplus / growthSurplus;
    remaining -= fromGrowth;
    if (remaining <= 1e-9) {
      out.source = 'Growth';
      out.reason = 'Healthy';
      // Cash refill from the remaining surplus (Evensky/Benz: refill the reserve, nothing else)
      const cashShortfall = p.csTarget - p.cash;
      const excess = growthSurplus - fromGrowth;
      if (cashShortfall > 0 && excess > SOURCING_DEFAULTS.REPLENISH_GATE) {
        out.replenish = Math.min(cashShortfall * SOURCING_DEFAULTS.REPLENISH_SHORTFALL_FRAC,
                                 excess * SOURCING_DEFAULTS.REPLENISH_SURPLUS_FRAC);
      }
      return out;
    }
  }

  // Cascade: cash, then sleeves ranked by relative overweight vs target, HODL strictly last.
  const takeCash = Math.min(remaining, p.cash);
  out.fromCash = takeCash;
  remaining -= takeCash;

  if (remaining > 1e-9) {
    const sleeves = [
      { key: 'fromDiversifier', value: div, target: p.diversifierTarget || div || 1 },
      { key: 'fromBond', value: Math.max(0, p.bond - out.fromBond), target: Math.max(1, p.bdMin) },
      { key: 'fromEquity', value: Math.max(0, p.equity - out.fromEquity), target: Math.max(1, p.eqMin) }
    ].filter((s) => s.value > 0)
     .sort((a, b) => (b.value / b.target) - (a.value / a.target)); // most overweight first
    for (const s of sleeves) {
      if (remaining <= 1e-9) break;
      const take = Math.min(remaining, s.value);
      out[s.key] += take;
      remaining -= take;
    }
    if (remaining > 1e-9 && hodl > 0) {
      const take = Math.min(remaining, hodl);
      out.fromHodl = take;
      remaining -= take;
    }
    out.shortfall = Math.max(0, remaining);
  }

  // Label. Priority: growth-partial → Mixed; break-glass → HODL; otherwise the cash-side mix.
  const usedGrowth = out.fromEquity + out.fromBond > 1e-9;
  const usedCashSide = out.fromCash + out.fromDiversifier + out.fromHodl > 1e-9 || out.shortfall > 0;
  if (!p.inProtection && growthSurplus > 0 && usedGrowth && usedCashSide) {
    out.source = 'Mixed';
    out.reason = 'Growth surplus part-funds; the rest cascades';
  } else if (out.fromHodl > 0) {
    out.source = 'HODL';
    out.reason = 'Break glass';
  } else if (out.fromDiversifier > 0) {
    out.source = out.fromCash > 0 ? 'Cash + Diversifier' : 'Diversifier';
    out.reason = p.inProtection ? 'Protection' : 'Below min';
  } else if (usedGrowth) {
    // floors-breached spill (no surplus): the overweight-ranked sleeve paid
    out.source = out.fromBond >= out.fromEquity ? 'Bond' : 'Equity';
    out.reason = 'Cash exhausted — least-depressed sleeve pays';
  } else {
    out.source = 'Cash';
    out.reason = p.inProtection ? 'Protection' : (growthSurplus <= 0 ? 'Below min' : 'At min');
  }
  return out;
}


/**
 * "Buckets in order" sourcing — the same output shape as planSourcing, a different rule:
 *   DRAW: always from the lowest-risk bucket that has money — cash, then bonds (the defensive
 *   sleeve), then diversifiers, then equities last.
 *   WATERFALL (refill, only ever from surplus, never in a slump): equities above their absolute £
 *   path by more than `band` spill the excess DOWN into bonds (up to the bond target); bonds above
 *   their target by more than `band` spill the excess into cash (up to the cash target). The paths
 *   are pound figures, not % shares — a % share rises by itself as cash is spent.
 *   There is never any other trade between pots.
 * @param {object} p - planSourcing's inputs plus { eqPath, bdTarget, band }
 * @returns planSourcing's shape plus transfers: { equityToBond, bondToCash } (replenish = bondToCash)
 */
export function planSourcingOrdered(p) {
  const div = p.diversifier || 0;
  const hodl = p.hodl || 0;
  const band = p.band ?? 0.10;
  const out = { fromEquity: 0, fromBond: 0, fromCash: 0, fromDiversifier: 0, fromHodl: 0, shortfall: 0, replenish: 0, source: 'Cash', reason: '', transfers: { equityToBond: 0, bondToCash: 0 } };
  let remaining = p.draw;

  const takeCash = Math.min(remaining, Math.max(0, p.cash)); out.fromCash = takeCash; remaining -= takeCash;
  if (remaining > 1e-9) { const t = Math.min(remaining, Math.max(0, p.bond)); out.fromBond = t; remaining -= t; }
  if (remaining > 1e-9 && div > 0) { const t = Math.min(remaining, div); out.fromDiversifier = t; remaining -= t; }
  if (remaining > 1e-9) { const t = Math.min(remaining, Math.max(0, p.equity)); out.fromEquity = t; remaining -= t; }
  if (remaining > 1e-9 && hodl > 0) { const t = Math.min(remaining, hodl); out.fromHodl = t; remaining -= t; }
  out.shortfall = Math.max(0, remaining);

  // Waterfall from surplus (after this month's draw)
  const eqLeft = Math.max(0, p.equity - out.fromEquity), bdLeft = Math.max(0, p.bond - out.fromBond), csLeft = Math.max(0, p.cash - out.fromCash);
  const eqPath = p.eqPath || 0, bdTarget = p.bdTarget || 0, csTarget = p.csTarget || 0;
  let e2b = 0, b2c = 0;
  if (eqPath > 0 && eqLeft > eqPath * (1 + band)) e2b = Math.min(eqLeft - eqPath, Math.max(0, bdTarget - bdLeft));
  const bdAfter = bdLeft + e2b;
  if (bdTarget > 0 && bdAfter > bdTarget * (1 + band)) b2c = Math.min(bdAfter - bdTarget, Math.max(0, csTarget - csLeft));
  out.transfers = { equityToBond: e2b, bondToCash: b2c };
  out.replenish = b2c;

  if (out.fromHodl > 0) { out.source = 'HODL'; out.reason = 'Break glass'; }
  else if (out.fromEquity > 0) { out.source = out.fromCash + out.fromBond + out.fromDiversifier > 0 ? 'Mixed' : 'Equity'; out.reason = 'Cash and the defensive sleeve are empty — equities pay'; }
  else if (out.fromDiversifier > 0) { out.source = out.fromCash > 0 ? 'Cash + Diversifier' : 'Diversifier'; out.reason = 'Cash and bonds exhausted — diversifiers pay'; }
  else if (out.fromBond > 0) { out.source = out.fromCash > 0 ? 'Mixed' : 'Bond'; out.reason = 'Cash exhausted — the defensive sleeve pays'; }
  else { out.source = 'Cash'; out.reason = (e2b > 0 || b2c > 0) ? 'Cash pays; surplus waterfalls down the buckets' : 'Cash pays — the lowest-risk bucket first'; }
  return out;
}
