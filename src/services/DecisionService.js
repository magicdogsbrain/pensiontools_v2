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

import { decisionToHistory } from '../models/Decision.js';
import { lockPlanIfNeeded } from './PlanLock.js';
import {
  getDecisionSettingsAsync,
  addHistoryRecord,
  recalculateIsaSavingsUsed,
  decisionSettingsChecksum
} from '../storage/DecisionRepository.js';

/**
 * Saves a decision to history.
 * @param {object} decision - Decision to save
 * @returns {Promise<void>}
 */
export async function saveDecision(decision) {
  const historyRecord = decisionToHistory(decision);

  // Add standard SIPP for boost calculations (from decision object, set in calcDecisionPWA)
  historyRecord.stdSipp = decision.stdSipp || decision.sippDraw;

  // Stamp the checksum of the settings this decision was computed against. Lets us tell whether a
  // saved decision still matches the plan's settings and gate the settings unlock on it (unlock only
  // while nothing has been recorded against those settings).
  try {
    const settings = await getDecisionSettingsAsync();
    historyRecord.settingsChecksum = decisionSettingsChecksum(settings);
  } catch (e) {
    // Non-fatal: a missing checksum just means we can't prove the match later.
    console.warn('Could not stamp settings checksum on decision:', e);
  }

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
