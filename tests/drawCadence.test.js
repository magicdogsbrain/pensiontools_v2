/**
 * How often you draw is a preference, not a plan setting (v6 usability audit, decision 4, 17 Oct 2026).
 *
 * It lives at decisionTool.cadence (services/DrawCadence.js, ScenarioRepository.saveActiveDrawCadence): changeable on
 * a locked plan, outside the Decision settings and their checksum, so no recorded month is ever relabelled by it. A plan
 * saved before this change is read through its old settings.cadence, which is left exactly as stored.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { CADENCES, DEFAULT_CADENCE, DRAW_CADENCE_FIELD, normaliseCadence, cadenceMonths, cadenceOf, cadenceNote } from '../src/services/DrawCadence.js';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData } from '../src/firebase/FirestoreService.js';
import { invalidateScenarioCache, getActiveDrawCadence, saveActiveDrawCadence, getActiveScenarioAsync } from '../src/storage/ScenarioRepository.js';
import { invalidateStressCache, getStressSettingsAsync } from '../src/storage/StressRepository.js';
import { invalidateCache as invalidateDecisionCache, getDecisionSettingsAsync, decisionSettingsChecksum } from '../src/storage/DecisionRepository.js';
import { planDependents } from '../src/services/PlanLock.js';
import { writeTouchesLockedParts, lockedPlanWriteRefusal } from '../src/services/LockedPlanGuard.js';

const GUEST_KEY = 'pt_guest_scenarios';
const fixture = (name) => JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8'));
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const stored = () => JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]').find((p) => p.isActive);
const open = (plan) => { enterGuestMode(); clearGuestData(); sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...plan, isActive: true }])); fresh(); };
afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });

/** The parts of a locked plan the preference must not move, as text. */
const frozen = () => { const p = stored(); return { stress: JSON.stringify(p.stressTool?.settings), decision: JSON.stringify(p.decisionTool.settings), checksum: decisionSettingsChecksum(p.decisionTool.settings), doc: JSON.stringify(p.planDocument), archive: JSON.stringify(p.planDocumentArchive), history: JSON.stringify(p.decisionTool.history), por: JSON.stringify(p.decisionTool.planOfRecord) }; };

describe('the pure rules', () => {
  it('three cadences, monthly by default, written to decisionTool.cadence', () => {
    expect(CADENCES).toEqual(['monthly', 'quarterly', 'annual']);
    expect(DEFAULT_CADENCE).toBe('monthly');
    expect(DRAW_CADENCE_FIELD).toBe('decisionTool.cadence');
    expect(normaliseCadence('annual')).toBe('annual');
    expect(normaliseCadence('weekly')).toBe('monthly');
    expect(normaliseCadence(undefined)).toBe('monthly');
  });
  it('months per recommendation: 1, 3, 12', () => {
    expect(cadenceMonths('monthly')).toBe(1); expect(cadenceMonths('quarterly')).toBe(3); expect(cadenceMonths('annual')).toBe(12); expect(cadenceMonths(undefined)).toBe(1);
  });
  it('reads the preference first, then the old settings key, then monthly', () => {
    expect(cadenceOf({ cadence: 'annual', settings: { cadence: 'quarterly' } })).toBe('annual');
    expect(cadenceOf({ settings: { cadence: 'quarterly' } })).toBe('quarterly');   // a plan saved before the change
    expect(cadenceOf({ cadence: 'nonsense', settings: { cadence: 'quarterly' } })).toBe('quarterly');
    expect(cadenceOf({ settings: {} })).toBe('monthly');
    expect(cadenceOf(null)).toBe('monthly');
  });
  it('the note under the picker', () => {
    expect(cadenceNote('monthly')).toBe('');
    expect(cadenceNote('quarterly')).toContain('covers the next 3 months');
    expect(cadenceNote('annual')).toContain('covers the next 12 months');
  });
});

describe('the lock guard: the preference is outside the locked parts', () => {
  it('a write to decisionTool.cadence does not touch the settings or the strategy, locked or not', () => {
    expect(writeTouchesLockedParts({ 'decisionTool.cadence': 'annual' })).toBe(false);
    const plan = fixture('03-gilt-ladder-runup');
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.cadence': 'annual' })).toBeNull();
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.settings.cadence': 'annual' })).toEqual(['decision.cadence']);   // the OLD key is still a setting: still refused
  });
});

describe('on a LOCKED plan (the retired ladder in its run-up, with recorded months)', () => {
  it('the picker goes through; the stored settings, checksum, document, history and plan of record are byte-identical; no month is relabelled', async () => {
    const plan = fixture('03-gilt-ladder-runup');
    plan.decisionTool.settings.unlockCount = 1;   // a plan unlocked once before: the case that used to relabel every month
    plan.decisionTool.settings.unlockedAt = '2026-07-01T00:00:00.000Z';
    const sum = decisionSettingsChecksum(plan.decisionTool.settings);
    plan.decisionTool.history = plan.decisionTool.history.map((h) => ({ ...h, settingsChecksum: sum }));
    open(plan);
    await getActiveScenarioAsync(); await getStressSettingsAsync(); await getDecisionSettingsAsync();
    expect(stored().decisionTool.settings.locked).toBe(true);
    const before = frozen();
    const dep0 = await planDependents();
    expect(dep0.entriesUnderCurrent).toBe(3);
    expect(await getActiveDrawCadence()).toBe(plan.decisionTool.settings.cadence || 'monthly');
    expect(await saveActiveDrawCadence('quarterly')).toBe('quarterly');
    expect(stored().decisionTool.cadence).toBe('quarterly');
    expect(await getActiveDrawCadence()).toBe('quarterly');
    expect(frozen()).toEqual(before);
    expect(stored().decisionTool.settings.cadence).toBe(plan.decisionTool.settings.cadence);   // the old key: untouched
    const dep = await planDependents();
    expect(dep.entriesUnderCurrent).toBe(3);
    expect(dep.entriesUnderPrevious).toBe(0);
    await saveActiveDrawCadence('annual');
    expect(stored().decisionTool.cadence).toBe('annual');
    expect(frozen()).toEqual(before);
  });
  it('a draft changes it freely too, and the old settings key is never written', async () => {
    open(fixture('02-pnv-draft'));
    const before = JSON.stringify((await getActiveScenarioAsync()).decisionTool.settings);
    await saveActiveDrawCadence('annual');
    expect(stored().decisionTool.cadence).toBe('annual');
    expect(JSON.stringify(stored().decisionTool.settings)).toBe(before);
    await saveActiveDrawCadence('nonsense');
    expect(stored().decisionTool.cadence).toBe('monthly');   // normalised
  });
});

describe('index.html: the picker writes the preference, never the Decision settings', () => {
  const html = readFileSync('index.html', 'utf8');
  it('setCadence saves through saveActiveDrawCadence; the month\'s batch size comes from getActiveDrawCadence', () => {
    expect(html).toContain('await saveActiveDrawCadence(v)');
    expect(html).not.toContain('saveDecisionSettings({ cadence');
    expect(html).toContain('cadenceMonths(await getActiveDrawCadence())');
    expect(html).not.toContain('cadenceMonths(settings.cadence)');
  });
});
