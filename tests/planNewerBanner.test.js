/**
 * 6.15.0 — a tab left open across a release must say plainly why it will not save: the refusal reaches
 * the screen in its own words (not "Failed to save … data"), and the shell has a banner with a Reload button.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData } from '../src/firebase/FirestoreService.js';
import { getActiveScenarioAsync, invalidateScenarioCache, isPlanNewerThanApp } from '../src/storage/ScenarioRepository.js';
import { saveStressSettings, invalidateStressCache } from '../src/storage/StressRepository.js';
import { saveDecisionSettings, invalidateCache as invalidateDecisionCache } from '../src/storage/DecisionRepository.js';
import { SCHEMA_VERSION, PLAN_NEWER_MESSAGE, PLAN_NEWER_CODE, PLAN_NEWER_EVENT } from '../src/storage/schema.js';
import { parse } from '../src/ui/inlineHandlers.js';

const GUEST_KEY = 'pt_guest_scenarios';
const html = fs.readFileSync('index.html', 'utf8');

describe('a plan newer than this code: the refusal reaches the screen in plain words', () => {
  it('Stress and Decision settings saves pass the refusal on unchanged (code + message), and write nothing', async () => {
    enterGuestMode(); clearGuestData();
    const newer = { id: 'guest-new', isActive: true, schemaVersion: SCHEMA_VERSION + 1, planDetails: { name: 'From the future', description: '' }, decisionTool: { settings: { movedKey: 1 }, history: [], taxYears: {} }, stressTool: { settings: { baseSalary: 9 } } };
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([newer]));
    invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache();
    const before = sessionStorage.getItem(GUEST_KEY);
    await getActiveScenarioAsync();
    expect(isPlanNewerThanApp()).toBe(true);
    await expect(saveStressSettings({ baseSalary: 31000 })).rejects.toMatchObject({ code: PLAN_NEWER_CODE, message: PLAN_NEWER_MESSAGE });
    await expect(saveDecisionSettings({ cadence: 'monthly' })).rejects.toMatchObject({ code: PLAN_NEWER_CODE, message: PLAN_NEWER_MESSAGE });
    expect(sessionStorage.getItem(GUEST_KEY)).toBe(before);
    leaveGuestMode(); clearGuestData(); invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache();
  });
});

describe('index.html: the newer-plan banner', () => {
  it('has the banner, in the owner\'s words, with a Reload button whose handler exists and parses', () => {
    const m = html.match(/<div id="planNewerBanner"[\s\S]*?<\/div>/);
    expect(m).not.toBeNull();
    expect(m[0]).toContain('role="alert"');
    expect(m[0]).toContain('display:none');
    expect(m[0]).toContain('This plan was updated by a newer version of the app — reload the page.');
    expect(m[0]).toContain('data-on-click="reloadPage()"');
    expect(() => parse('reloadPage()')).not.toThrow();
    expect(html).toMatch(/window\.reloadPage\s*=\s*function/);
  });
  it('is shown from the one test (isPlanNewerThanApp), on the event and whenever the plan is refreshed', () => {
    expect(html).toMatch(/import \{ isPlanNewerThanApp \} from '\.\/src\/storage\/ScenarioRepository\.js'/);
    expect(html).toContain("window.addEventListener('" + PLAN_NEWER_EVENT + "'");
    const fn = html.slice(html.indexOf('window.updateNextStepBanner = async function'));
    expect(fn.slice(0, 200)).toContain('showPlanNewerBanner();');
  });
});
