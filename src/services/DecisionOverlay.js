/**
 * Where a month is paid from when the plan is not drawn the Pots & Valves way (index.html decisionStrategyOverlay until
 * 7.2.0; lifted so the new app's Month by month says the same thing, word for word). A contract strategy (a bought gilt
 * ladder) pays the month from this tax year's rung or the cash bucket and sells nothing; the floors and bridges say which
 * rung or bucket pays and what is left to the sleeve or the engine. The tax and the total are the engine's, unchanged: this
 * only says WHERE the money comes from, and whether the pot advice applies (`hidePots`).
 *
 * The ladder itself is the caller's to find (`ladder`): the classic planner reads the plan document's ladder, or prices one
 * afresh for a plan not locked (index.html ladderPositionForPlan); the new app reads the plan document's (ladderFromDocument).
 *
 * Pure: no storage, no DOM, no clock.
 */
import { deriveTiming, planYearOf } from './PlanTiming.js';
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';
import { ladderMonthAdvice, ladderPosition, documentLadder, firstRungOf } from './LadderPosition.js';
import { ladderYearsFromYear0, planYearsOf, potsDayOf } from './PlanFromToday.js';

/** The strategies that are bought by contract: a ladder of gilts held to pay (index.html CONTRACT_IDS). */
export const CONTRACT_IDS = Object.freeze(['full-il-gilt', 'gilt-rotation', 'floor-the-schedule']);

/**
 * The month's overlay, or null for Pots & Valves and Buckets in order (their pot advice stands as it is).
 * @param {object} decision  the month as the engine worked it out (sippDraw)
 * @param {string} dateStr  'YYYY-MM'
 * @param {{ strategy: { id, params }, stressSettings: object, name: string, ladder?: { lp: object|null, firstRung: object|null }|null }} o
 *   strategy: the plan's strategy block (ScenarioRepository.strategyOf); stressSettings: its effective Stress settings; name: the
 *   strategy's name (the registry's describe().name); ladder: for a contract strategy, where this month sits in the ladder
 */
export function strategyOverlayOf(decision, dateStr, { strategy, stressSettings, name, ladder = null }) {
  const st = strategy || {};
  if (!st.id || st.id === 'pots-and-valves') return null;
  const settings = stressSettings || {};
  const params = { ...(settings.strategyParams || {}), ...(st.params || {}) };
  const timing = deriveTiming(settings);   // 6.4.0: the saved plan start, not "the year after today"
  const startAge = timing.shapeAgeNow || +settings.shapeAgeNow || 57;
  const planYearSigned = planYearOf(dateStr, timing.firstTaxYear);
  const planYear = Math.max(0, planYearSigned);
  const spCfg = spSimConfigFromSettings(settings);
  const spOn = spCfg && planYear >= spCfg.spStartYear;
  const spAnnual = spOn ? (settings.spWeeklyAmount || 0) * 52 : 0;
  const total = (decision.sippDraw || 0);
  let floorMonthly = 0, floorLabel = '', note = '';
  if (CONTRACT_IDS.includes(st.id)) {
    // A contract: this tax year's rung over the months left, placed by the LADDER's own years (LadderPosition.ladderMonthAdvice, 6.51.0).
    const lp = ladder ? ladder.lp : null;
    ({ floorMonthly, floorLabel, note } = ladderMonthAdvice(lp, lp && ladder ? ladder.firstRung : null, total, planYearSigned));
  }
  else if (st.id === 'floor-to-age') { const A = (params.floorToAge || 80) - startAge; if (planYear < A) { floorMonthly = total; floorLabel = 'this year\'s matured rung'; note = 'Bought by contract to ' + (params.floorToAge || 80) + '; nothing to sell this year.'; } else { note = 'Past the floor age: the reserve now pays — this is a Pots & Valves-style draw on what is left.'; } }
  else if (st.id === 'bridge-and-engine') { const B = (params.bridgeAge || 67) - startAge; const cy = params.cashYears ?? 3; if (planYear < B) { floorMonthly = total; floorLabel = planYear < cy ? 'the cash years bucket' : 'this year\'s matured rung'; note = 'On the bridge: ' + (planYear < cy ? 'the cash pays' : 'the rung that matured before this April pays') + ' — the engine is untouched.'; } else { note = 'Past the bridge: the State Pension is in payment and the engine pays the rest by a standing withdrawal from the world-equity fund. Nothing to re-buy, nothing to trigger.'; floorLabel = 'the engine'; } }
  else if (st.id === 'buckets-in-order') { return null; }
  else if (st.id === 'floor-and-flex') { const ess = Math.max(0, (params.essentialsAnnual || 0) - spAnnual) / 12; floorMonthly = Math.min(total, ess); floorLabel = 'the essentials rung'; note = 'Essentials come from the rung; the rest of this month\'s draw is treats from the flex sleeve (sell units for it).'; }
  else if (st.id === 'ladder-and-ratchet') { const yrs = ladderYearsFromYear0(params.ladderYears, planYearsOf(settings.duration)); if (planYear < yrs) { floorMonthly = total; floorLabel = 'this year\'s matured rung'; note = 'Inside the ladder years: the rung pays; the equity sleeve is untouched unless the ratchet fires.'; } else { note = 'Beyond the base ladder: pay from a ratcheted rung if one was secured, otherwise from the sleeve.'; } }
  return { id: st.id, name, floorMonthly: Math.round(floorMonthly), sleeveMonthly: Math.round(Math.max(0, total - floorMonthly)), floorLabel, note, hidePots: (st.id !== 'floor-to-age' && st.id !== 'bridge-and-engine') || floorMonthly > 0 };
}

/**
 * Where a month sits in a LOCKED plan's ladder, read from its plan document (index.html ladderPositionForPlan's locked branch:
 * the document's orders, never re-priced; the month read on its 15th). Null when the plan has no document or it holds no
 * ladder for this strategy — a plan locked by its first record, before 6.38.0, has none.
 * @param {object} planDocument  scenario.planDocument
 * @param {object} stressSettings  the effective Stress settings (strategyId, potsAsOf)
 * @param {string} dateStr  'YYYY-MM'
 * @param {Date} now
 */
export function ladderFromDocument(planDocument, stressSettings, dateStr, now) {
  try {
    const plan = documentLadder(planDocument, stressSettings && stressSettings.strategyId);
    if (!plan) return null;
    const today = new Date(dateStr + (dateStr.length === 7 ? '-15' : ''));
    const lp = ladderPosition(plan, { today, potsDay: potsDayOf(stressSettings, { lockedAt: planDocument.lockedAt, now }), cashBalance: null, drawnThisYear: 0 });
    return { lp, firstRung: lp ? firstRungOf(plan) : null };
  } catch { return null; }
}
