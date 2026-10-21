/**
 * Plan lock — ONE notion, one word.
 *
 * A plan is "locked" when recorded data (monthly decisions, set-up tax years) depends on its
 * settings, or when the user commits it from the Stress tester's Settings page (6.5.0) — the same
 * lock either way: it is set automatically by the first such record, or by the user pressing "Lock
 * plan", never by pressing Save. Locked, the Stress settings and the Decision settings are frozen and
 * the strategy can only be changed after an unlock. Unlocking is always allowed; it re-baselines the
 * plan of record, archives the plan document, and leaves earlier entries in place, marked as recorded
 * under previous settings. The strategy choice lives in scenario.strategy.
 */
import {
  getDecisionSettingsAsync, saveDecisionSettings, getHistoryAsync, getAllTaxYearsAsync, decisionSettingsChecksum
} from '../storage/DecisionRepository.js';
import { getActivePlanOfRecord, saveActivePlanOfRecord, archivePlanOfRecord, archivePlanDocument } from '../storage/ScenarioRepository.js';
import { planOfRecordFor, PLAN_OF_RECORD_CPI } from './PlanCommit.js';

export { PLAN_OF_RECORD_CPI };

/**
 * A frozen projection of the current Decision settings — the yardstick "plan vs actual" uses. The body is
 * PlanCommit.planOfRecordFor (6.38.0: the preview's lock builds the same record, byte for byte); this reads the settings
 * when none are given and hands in the clock.
 */
export async function buildPlanOfRecord(settings) {
  const s = settings || await getDecisionSettingsAsync();
  return planOfRecordFor(s, new Date());
}

/** What depends on the settings right now. Pure facts; the unlock modal is built from this. */
export async function planDependents() {
  const [settings, hist, taxYears, por] = await Promise.all([
    getDecisionSettingsAsync(), getHistoryAsync({ limit: 1000 }), getAllTaxYearsAsync(), getActivePlanOfRecord()
  ]);
  const cur = decisionSettingsChecksum(settings);
  const list = Array.isArray(hist) ? hist : [];
  // Entries can only be "under previous settings" once the plan has been unlocked and re-saved.
  // Until then every entry belongs to these settings (older stamps used an order-sensitive hash).
  const everUnlocked = (settings.unlockCount || 0) > 0;
  const isPrev = (h) => everUnlocked && h.settingsChecksum !== undefined && h.settingsChecksum !== cur;
  const under = list.filter((h) => !isPrev(h));
  const previous = list.filter(isPrev);
  const dates = under.map((h) => h.date).sort();
  const setupYears = Object.entries(taxYears || {}).filter(([, ty]) => ty && ty.yearSetupComplete).map(([k]) => k).sort();
  return {
    locked: !!settings.locked,
    entriesUnderCurrent: under.length, entriesUnderPrevious: previous.length,
    firstDate: dates[0] || null, lastDate: dates[dates.length - 1] || null,
    taxYearsSetUp: setupYears,
    planOfRecordAt: por?.savedAt || null,
    unlockedBefore: !!settings.unlockedAt, unlockCount: settings.unlockCount || 0
  };
}

export async function planHasRecords() {
  const d = await planDependents();
  return d.entriesUnderCurrent > 0 || d.entriesUnderPrevious > 0 || d.taxYearsSetUp.length > 0;
}

/** Called after the first record lands. Locks a draft and freezes the plan of record if missing. */
export async function lockPlanIfNeeded(reason = 'record') {
  const settings = await getDecisionSettingsAsync();
  if (settings.locked) return false;
  const por = await getActivePlanOfRecord();
  if (!por) { try { await saveActivePlanOfRecord(await buildPlanOfRecord(settings)); } catch (e) { console.warn('Plan-of-record snapshot failed (non-fatal):', e); } }
  await saveDecisionSettings({ locked: true, lockedAt: new Date().toISOString(), lockedBy: reason });
  return true;
}

/**
 * Unlock: archive the plan of record, clear the flag. Entries stay; their checksum no longer
 * matches once settings change, and the History tab shows them as "under previous settings".
 */
export async function unlockPlan() {
  await archivePlanOfRecord();
  try { await archivePlanDocument(); } catch (e) { console.warn('Plan document archive failed (non-fatal):', e); }
  const s = await getDecisionSettingsAsync();
  await saveDecisionSettings({ locked: false, unlockedAt: new Date().toISOString(), unlockCount: (s.unlockCount || 0) + 1 });
}
