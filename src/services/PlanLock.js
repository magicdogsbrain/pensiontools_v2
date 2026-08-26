/**
 * Plan lock — ONE notion, one word.
 *
 * A plan is "locked" when recorded data (monthly decisions, set-up tax years) depends on its
 * Decision settings. The lock is set automatically by the first such record, never by pressing
 * Save. Unlocking is always allowed; it re-baselines the plan of record and leaves earlier entries
 * in place, marked as recorded under previous settings. The strategy choice is NOT a lock — it's
 * a switch — and lives elsewhere (scenario.strategy).
 */
import {
  getDecisionSettingsAsync, saveDecisionSettings, getHistoryAsync, getAllTaxYearsAsync, decisionSettingsChecksum
} from '../storage/DecisionRepository.js';
import { getActivePlanOfRecord, saveActivePlanOfRecord, archivePlanOfRecord } from '../storage/ScenarioRepository.js';
import { generateDrawdownSchedule } from './DrawdownService.js';
import { generateGlidepathSchedule } from './GlidepathService.js';
import { ENGINE_VERSION } from '../strategies/version.js';

export const PLAN_OF_RECORD_CPI = 0.04;   // decision-side assumed CPI: slightly pessimistic by design

/** A frozen projection of the current Decision settings — the yardstick "plan vs actual" uses. */
export async function buildPlanOfRecord(settings) {
  const s = settings || await getDecisionSettingsAsync();
  const assumedCpi = PLAN_OF_RECORD_CPI;
  return {
    savedAt: new Date().toISOString(),
    engineVersion: ENGINE_VERSION,
    assumedCpi,
    baseSalary: s.baseSalary,
    settingsChecksum: decisionSettingsChecksum(s),
    // Frozen bands by default: the Decision tool draws to the tax-year wizard's fixed BRL, so a plan of
    // record with inflating bands drifted above the actual draw every year (persona test B34).
    drawdown: generateDrawdownSchedule({ ...s, taxMode: s.taxMode || 'frozen', pa: s.pa || 12570, brl: s.brl || 50270, hrl: s.hrl || 125140 }, s.duration || 35, assumedCpi)
      .map((r) => ({ year: r.year, sippDraw: Math.round(r.sippDraw), tax: Math.round(r.tax), isaDraw: Math.round(r.isaDraw), isaBalance: Math.round(r.isaBalance), spendable: Math.round(r.spendable) })),
    glidepath: generateGlidepathSchedule(s, assumedCpi).map((r) => ({ year: r.year, totalMin: Math.round(r.totalMin) }))
  };
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
  const s = await getDecisionSettingsAsync();
  await saveDecisionSettings({ locked: false, unlockedAt: new Date().toISOString(), unlockCount: (s.unlockCount || 0) + 1 });
}
