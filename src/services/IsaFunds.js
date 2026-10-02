/**
 * An ISA made of the ISA funds in the plan's list of funds to test (the "own-funds" ISA): its mix, and whether those funds
 * decide how the ISA grows. Moved here from src/storage/StressRepository.js (deriveIsaMix) and src/ui/isaGrowthSetting.js
 * (isaFundsDecide) in the review of 6.22.0, so the projections to retirement (services/PlanTiming.js,
 * services/RetireSweep.js) and a saver's path (services/SavingPath.js) can ask the same question the runs ask without
 * importing a storage or screen module. The arithmetic is unchanged.
 *
 * When the list holds ISA-wrapped funds, every run grows the ISA at THEIR asset mix (config.isaMix) whatever the plan's
 * "How your ISA and savings grow" says, and the setting shows "Follows the ISA funds in your list of funds to test".
 *
 * Pure: no DOM, no storage, no clock.
 */
import { tagPortfolio } from './PortfolioTagger.js';

/**
 * Asset mix of the ISA-wrapped tagged holdings, as bucket fractions (+ sub-class weights), or null when there are none.
 * Re-wrapped as SIPP for tagging because tagPortfolio deliberately keeps ISA-wrapped holdings out of the buckets.
 */
export function deriveIsaMix(taggedFunds) {
  const isaHoldings = (taggedFunds || []).filter(
    (f) => f && (f.wrapper || '').toUpperCase() === 'ISA' && +f.value > 0
  );
  if (!isaHoldings.length) return null;
  const t = tagPortfolio(isaHoldings.map((f) => ({ ...f, wrapper: 'SIPP' })));
  if (!(t.total > 0)) return null;
  const mix = {
    shares: t.buckets.shares / t.total,
    bonds: t.buckets.bonds / t.total,
    diversifiers: t.buckets.diversifiers / t.total,
    cash: t.buckets.cash / t.total
  };
  if (Object.keys(t.bondWeights).length) mix.bondWeights = t.bondWeights;
  if (Object.keys(t.diversifierWeights).length) mix.diversifierWeights = t.diversifierWeights;
  return mix;
}

/** Whether the ISA funds in the plan's list of funds to test decide how its ISA grows (the runs then follow them). */
export function isaFundsDecide(settings) {
  try { return deriveIsaMix(settings && settings.taggedFunds) != null; } catch (e) { return false; }
}

/**
 * The ISA funds' mix as shares : bonds : cash of 1, for V7's saving-years engine (diversifiers counted with bonds, as a
 * saver's pension mix counts them — SavingPath.savingPathMixes). Null when the funds do not decide.
 */
export function isaFundsSavingMix(settings) {
  let m = null;
  try { m = deriveIsaMix(settings && settings.taggedFunds); } catch (e) { m = null; }
  if (!m) return null;
  const equity = m.shares || 0, bond = (m.bonds || 0) + (m.diversifiers || 0), cash = m.cash || 0;
  const t = equity + bond + cash;
  return t > 0 ? { equity: equity / t, bond: bond / t, cash: cash / t } : null;
}
