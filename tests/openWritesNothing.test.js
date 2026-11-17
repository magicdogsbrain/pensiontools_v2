/**
 * 7.12.0: opening a plan writes nothing (lead decision, round 2). The full view's loader reads every part of the plan
 * a page draws from (the plan, its Stress settings, its Decision settings, history and tax years, the budget, the plan
 * document, holdings), and afterwards the stored plan is byte for byte what it was. Until 7.12.0 the first load of a plan
 * with no saved start wrote one (StressRepository.loadStressDBAsync, the 6.13.5 / 6.14.0 timing pin): that start is now
 * read in memory and stored only with the person's own next save.
 *
 * Run on every plan of the corpus (tests/fixtures/plans), in guest mode (FirestoreService keeps a guest's plans in
 * sessionStorage, so "stored" is a string that can be compared whole), on two days either side of 6 April.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData } from '../src/firebase/FirestoreService.js';
import {
  getActiveScenarioAsync, invalidateScenarioCache, getActiveBudget, getActivePlanDocument, getActiveHoldings, getActiveAccumulation
} from '../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, loadStressDBAsync, invalidateStressCache, timingPinSettled, saveStressSettings } from '../src/storage/StressRepository.js';
import { getDecisionSettingsAsync, loadDecisionDBAsync, getHistoryAsync, getAllTaxYearsAsync, invalidateCache as invalidateDecisionCache } from '../src/storage/DecisionRepository.js';

const GUEST_KEY = 'pt_guest_scenarios';
const DIR = 'tests/fixtures/plans/';
const CORPUS = readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== 'snapshot.json');
const fixture = (f) => JSON.parse(readFileSync(DIR + f, 'utf8'));
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };

async function openAsTheFullViewDoes() {
  await getActiveScenarioAsync();
  await loadStressDBAsync();
  await getStressSettingsAsync();
  await loadDecisionDBAsync();
  await getDecisionSettingsAsync();
  await getHistoryAsync();
  await getAllTaxYearsAsync();
  await getActiveBudget();
  await getActivePlanDocument();
  await getActiveHoldings();
  await getActiveAccumulation();
  await timingPinSettled();
}

afterEach(() => { vi.useRealTimers(); leaveGuestMode(); fresh(); });

describe('opening a plan writes nothing', () => {
  it('the corpus is there', () => { expect(CORPUS.length).toBeGreaterThanOrEqual(15); });

  for (const day of ['2026-04-04T10:00:00Z', '2026-11-16T10:00:00Z']) {
    for (const f of CORPUS) {
      it(`${f}, opened on ${day.slice(0, 10)}: the stored plan is byte for byte as it was`, async () => {
        vi.useFakeTimers({ now: new Date(day), toFake: ['Date'] });
        enterGuestMode(); clearGuestData();
        const before = JSON.stringify([{ ...fixture(f), isActive: true }]);
        sessionStorage.setItem(GUEST_KEY, before);
        fresh();
        await openAsTheFullViewDoes();
        expect(JSON.parse(sessionStorage.getItem(GUEST_KEY))).toEqual(JSON.parse(before));
        expect(sessionStorage.getItem(GUEST_KEY)).toBe(before);
        // a second visit the same way
        fresh();
        await openAsTheFullViewDoes();
        expect(sessionStorage.getItem(GUEST_KEY)).toBe(before);
      });
    }
  }

  it('the start read in memory on opening is stored with the person\'s own next save', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-16T10:00:00Z'), toFake: ['Date'] });
    enterGuestMode(); clearGuestData();
    const plan = fixture('06-pre-6.4-no-timing.json');
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...plan, isActive: true }]));
    fresh();
    const db = await loadStressDBAsync();
    const stored = () => JSON.parse(sessionStorage.getItem(GUEST_KEY))[0].stressTool.settings;
    const pinned = ['firstTaxYear', 'legacyFirstTaxYear', 'currentAgeAsOf', 'retired'].filter((k) => db.settings[k] != null && stored()[k] == null);
    expect(pinned.length).toBeGreaterThan(0);                // the copy in memory has a start the stored plan lacks
    expect(JSON.parse(sessionStorage.getItem(GUEST_KEY))[0].decisionTool.settings.locked).toBe(true);   // a locked plan: the hard case
    await saveStressSettings({});                            // the person's own next save (here: nothing changed by them)
    for (const k of pinned) expect(stored()[k]).toEqual(db.settings[k]);
  });
});
