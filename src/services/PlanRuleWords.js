/**
 * What the plan's rule does this month, from the engine's pot alerts (7.12.0 round 3, decision 6). The engine names a move as
 * an order ("Move £8,000 Equity→Bond", "Replenish Cash: Move £6,000 from growth funds"); a person living on the plan reads
 * what the rule does and that the choice is theirs. Both views read this one function: the simple view's Month by month
 * (answers/plan/month.js) and the full view's Decision tool (ui/components/DecisionPanel.js), filled with the words in
 * src/v7/copy/month.js MONTH.advice.moves. Pure.
 *
 *   moveOfAlert(alert)   { id, slots: { amount } } for a pot move or the low-cash alert, else null
 */
export function moveOfAlert(a) {
  if (!a || typeof a.message !== 'string') return null;
  const amount = (/£([\d,]+)/.exec(a.message) || [])[1];
  const slots = { amount: amount ? '£' + amount : null };
  if (a.type === 'rebalance') return { id: /Equity→Bond/.test(a.message) ? 'sharesToBonds' : 'bondsToShares', slots };
  if (a.type === 'cash-replenish' && /^Waterfall: move £[\d,]+ from equities/.test(a.message)) return { id: 'sharesToBonds', slots };
  if (a.type === 'cash-replenish' && /^Waterfall: move £[\d,]+ from bonds/.test(a.message)) return { id: 'bondsToCash', slots };
  if (a.type === 'cash-replenish') return { id: 'topUpCash', slots };
  if (a.type === 'low-cash') return { id: 'lowCash', slots: {} };
  return null;
}
