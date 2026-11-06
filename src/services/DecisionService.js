/**
 * Decision Service — persistence for computed decisions.
 *
 * Historical note: this file once held a full parallel decision engine (calculateDecision /
 * calculateDecisionAsync / getDecisionSummary / formatAdvice) that no live code called — the
 * live engine is src/services/legacyDecision.js. The dead engine was removed Aug 2026
 * (see research/roadmap-audit-aug-2026.md); only saveDecision was ever reachable.
 * The correct Mixed-source withdrawal branch that lived in the deleted ProtectionService.js
 * is preserved in git history for the WithdrawalSourcing extraction (roadmap Tier 4).
 */

import { recordOf } from './MonthDecision.js';
import { lockPlanIfNeeded } from './PlanLock.js';
import {
  getDecisionSettingsAsync,
  addHistoryRecord,
  recalculateIsaSavingsUsed
} from '../storage/DecisionRepository.js';

/**
 * Saves a decision to history.
 * @param {object} decision - Decision to save
 * @returns {Promise<void>}
 */
export async function saveDecision(decision) {
  // The record is MonthDecision.recordOf (7.2.0: the new app's Month by month records a month with it too): decisionToHistory,
  // the standard SIPP for the boost, the marks of a month filled in later (and from its tax year's set-up figures, MonthFill.js),
  // and the checksum of the settings it was computed against — which lets us tell whether a saved decision still matches the
  // plan's settings and gate the settings unlock on it. Settings that cannot be read leave the checksum off (we then cannot
  // prove the match later), as before.
  let settings = null;
  try { settings = await getDecisionSettingsAsync(); } catch (e) { console.warn('Could not stamp settings checksum on decision:', e); }
  const historyRecord = recordOf(decision, settings);

  // Save the history record (this will overwrite if same date exists)
  await addHistoryRecord(historyRecord);

  // The first record locks the plan (settings are now depended on). Never on Save.
  try { await lockPlanIfNeeded('first monthly entry'); } catch (e) { console.warn('Auto-lock failed (non-fatal):', e); }

  // Recalculate ISA/Savings usage from all history records for this tax year
  // This ensures accuracy whether it's a new record or an overwrite
  if (decision.taxYear) {
    await recalculateIsaSavingsUsed(decision.taxYear);
  }
}
