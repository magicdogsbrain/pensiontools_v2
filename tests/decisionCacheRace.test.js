/**
 * The Decision tool's copy of the plan is dropped after every write (repaintAfterWrite) while a read of it may be
 * waiting on the plan. Such a read must never put back a half copy (the settings alone, no tax years, no months): the
 * next save then failed ("Failed to save decision data") and the plan could not be locked from Stress settings.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData } from '../src/firebase/FirestoreService.js';
import { getActiveScenarioAsync, invalidateScenarioCache } from '../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, saveStressSettings, invalidateStressCache } from '../src/storage/StressRepository.js';
import { loadDecisionDBAsync, saveDecisionSettings, invalidateCache as invalidateDecisionCache } from '../src/storage/DecisionRepository.js';

const GUEST_KEY = 'pt_guest_scenarios';
const fixture = (name) => JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8'));
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };

afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });

describe('a Decision read that overlaps a dropped copy', () => {
  it('reads the plan again instead of keeping the settings alone', async () => {
    enterGuestMode(); clearGuestData();
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...fixture('02-pnv-draft'), isActive: true }]));
    fresh();
    await getActiveScenarioAsync(); await getStressSettingsAsync();
    const first = await loadDecisionDBAsync();
    expect(Array.isArray(first.history)).toBe(true);
    // the plan's Stress settings change, so the next read refreshes the Decision copy from them (it waits on the plan)
    await saveStressSettings({ inflation: 0.031 });
    const reading = loadDecisionDBAsync();
    invalidateDecisionCache();   // a write's repaint drops every copy while that read waits
    const got = await reading;
    expect(Array.isArray(got.history)).toBe(true);
    expect(got.taxYears).toBeTruthy();
    const again = await loadDecisionDBAsync();
    expect(Array.isArray(again.history)).toBe(true);
    await expect(saveDecisionSettings({ duration: 30 })).resolves.toBeUndefined();
  });
});
