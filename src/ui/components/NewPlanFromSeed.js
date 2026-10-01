/**
 * The way in from a V7 answer: today's app's steps for "keep this answer as a plan" (research/v7/save-as-plan.md,
 * Contract C.2). The rules, the mapping and the words are in src/services/PlanSeed.js (pure); this file holds the
 * steps, so index.html's inline script gets only the import and the calls (Contract C.6 Q15).
 *
 *   startSeedEntry(shell) → { keepIfWaiting(user), clear(), tryWithoutAccount() }
 *   planTargetGuide()     → null, or { monthly, grossAnnual } — the active plan's own target when it was made from a V7
 *                           answer (the Budget page then shows its total as a guide beside it, never as the target)
 *   planFromAnswer()      → the active plan's fromAnswer record, or null
 *
 * At start (the moment index.html calls startSeedEntry) the seed is read: a bad or day-old seed is deleted, whatever the
 * address; a good one is offered only on /#new-plan, whose hash is then cleared so a reload does not ask twice.
 *  - No seed on /#new-plan: "There was nothing waiting to be saved…".
 *  - Signed out: "Sign in or make a free account… or carry on without an account". Carrying on starts guest mode and its
 *    meter WITHOUT startGuest (which empties the tab and adds the demo plan), so the tab's plans are kept; if the guest
 *    time is used up the meter's hard stop shows and the seed waits out its day.
 *  - Signed in (index.html's auth callback calls keepIfWaiting after the guest hand-off): the confirm step, then a NEW
 *    plan, the planner open on it at Stress tester → Settings with the one-line note and the way back to the question.
 *  - Signing out, by ANY way (the menu, the idle timer, the verify-email screen): the seed is deleted.
 *  - The landing page's "Just try it" in a tab that already holds plans (made from V7 answers, or earlier in the tab)
 *    carries on with them: tryWithoutAccount, never startGuest's empty-the-tab (found 1 Oct 2026: it deleted them).
 *
 * The browser may refuse storage altogether (site data blocked): every read and write goes through one guarded
 * handle, and with none the entry does nothing — the app must still start (found 1 Oct 2026: a bare `localStorage`
 * here threw and left a blank page).
 *
 * `shell` hands in the four steps that live in index.html's own script: showMainApp(user, tab), maybeAnnounceRelease,
 * startGuestMeter, startGuest. Everything else is imported or is one of the page's own globals (appPrompt, appConfirm,
 * showToast, openToolSettingsTab), read at the moment it is needed.
 */
import { takeSeedEntry, clearSeed, dropSeed, confirmAndCreate, seedSavedNote, questionHref, SEED_WORDS } from '../../services/PlanSeed.js';
import { grossToNet } from '../../services/TaxCalculator.js';
import { amountAtAge } from '../../services/IncomeSchedule.js';
import { loadAllScenarios, hasCloudData, createScenario, setActiveScenarioDoc, deleteScenarioDoc } from '../../firebase/FirestoreService.js';
import { enterGuestMode, onAuthStateChange } from '../../firebase/index.js';
import { invalidateScenarioCache, getActiveScenarioAsync } from '../../storage/ScenarioRepository.js';
import { invalidateCache } from '../../storage/DecisionRepository.js';
import { invalidateStressCache, getStressSettingsAsync } from '../../storage/StressRepository.js';
import { isBlocked as guestBlocked, readMinutes as guestMinutes } from '../../services/GuestMeter.js';
import { hideLandingPage } from './LandingPage.js';
import { showAuthScreenWithTab } from './AuthScreen.js';

export { budgetSummaryWords } from '../../services/PlanSeed.js';   // the Budget page's words (index.html imports them from here)

const forgetCaches = () => { invalidateScenarioCache(); invalidateCache(); invalidateStressCache(); };

/** The browser's storage, or null when it will not hand it over (site data blocked, a sandbox). Never throws. */
export function storageOf(win, which) {
  try {
    const s = win[which];
    return s && typeof s.getItem === 'function' ? s : null;
  } catch (e) {
    return null;
  }
}

/** What a page gets when the entry cannot run at all: nothing waiting, nothing to clear. */
export const NO_ENTRY = Object.freeze({ keepIfWaiting: async () => false, clear() {}, tryWithoutAccount: null });

/**
 * @param {{ showMainApp: Function, maybeAnnounceRelease: Function, startGuestMeter: Function, startGuest: Function }} shell
 * @param {Window} [win]
 * @returns {{ keepIfWaiting: (user: object) => Promise<boolean>, clear: () => void, tryWithoutAccount: (() => Promise<void>) | null }}
 */
export function startSeedEntry(shell, win = window) {
  const store = storageOf(win, 'localStorage');
  const session = storageOf(win, 'sessionStorage');
  if (!store) return { ...NO_ENTRY, tryWithoutAccount: () => tryWithoutAccount(shell) };
  const entry = takeSeedEntry(store, Date.now(), win.location.hash, () => win.history.replaceState(null, '', win.location.pathname + win.location.search), session);
  if (entry.wanted && !entry.seed) setTimeout(() => win.showToast(SEED_WORDS.nothingWaiting, 'info', 8000), 800);
  let offered = false;

  /** The confirm step; true once the NEW plan is made and the planner is open on it. */
  async function keepIfWaiting(user) {
    const seed = entry.seed;
    if (!seed) return false;
    const r = await confirmAndCreate(seed, {
      storage: store,
      session,
      now: () => new Date(),
      listNames: async () => (await loadAllScenarios()).map((s) => s.planDetails?.name || ''),
      ask: (text, name) => win.appPrompt(text, name, { okLabel: SEED_WORDS.save, cancelLabel: SEED_WORDS.notNow }),
      warn: (m) => win.showToast(m, 'warning', 8000),
      create: createScenario,
      setActive: setActiveScenarioDoc,
      remove: deleteScenarioDoc
    });
    entry.seed = null;
    if (r.outcome !== 'made') return false;   // "Not now", or used elsewhere: the seed is gone; the app carries on as normal
    forgetCaches();
    await shell.showMainApp(user, 'stress');
    win.openToolSettingsTab('stress');
    shell.maybeAnnounceRelease({ isGuestUser: !!user.isGuest, hasData: r.hadPlans });
    win.document.getElementById('seedNoteText').textContent = seedSavedNote(r.made, seed);
    win.document.getElementById('seedNoteBack').href = questionHref(seed.source);
    win.document.getElementById('seedNote').style.display = 'block';
    return true;
  }

  /** Without an account: guest mode and its meter — NOT startGuest, which empties the tab and adds the demo plan. */
  async function carryOnWithoutAccount() {
    const user = enterGuestMode();
    forgetCaches();
    shell.startGuestMeter();
    win.document.getElementById('guestBanner').style.display = 'flex';
    if (guestBlocked(guestMinutes(store))) return;   // the meter's hard stop is showing; the figures wait out their day
    if (!(await keepIfWaiting(user))) {
      if (await hasCloudData()) await shell.showMainApp(user);
      else await shell.startGuest(null);
    }
  }

  if (entry.seed) {
    onAuthStateChange(async (u) => {
      if (u || !entry.seed || offered) return;
      offered = true;
      const carryOn = await win.appConfirm(SEED_WORDS.signedOut, { okLabel: SEED_WORDS.carryOn, cancelLabel: SEED_WORDS.signIn, danger: false });
      if (carryOn) await carryOnWithoutAccount();
      else { hideLandingPage(); showAuthScreenWithTab('signin'); }
    });
  }

  /** Figures waiting from a V7 answer go on sign-out too (Reset and Delete Account clear all of localStorage). */
  const clear = () => { entry.seed = null; dropSeed(store, session); };
  // Every way of signing out ends here — the menu's Logout calls clear() itself; the idle timer and the verify-email
  // screen's "Sign out" call logOut() alone. A signed-in user becoming nobody is a sign-out; the first "nobody" of a
  // signed-out visit is not (the seed must wait for the sign-in it was kept for).
  let was = null;
  onAuthStateChange((u) => { if (was && !u) clear(); was = u || null; });

  return { keepIfWaiting, clear, tryWithoutAccount: () => tryWithoutAccount(shell) };
}

/**
 * The landing page's "Just try it — no account": a tab that already holds plans (made from a V7 answer, or earlier in
 * this tab) carries on with them, as "carry on without an account" does; only an empty tab gets the demo plan. Found
 * 1 Oct 2026: startGuest emptied the tab of every plan but one, and left the one it kept pointing at a partner plan
 * that was gone.
 */
async function tryWithoutAccount(shell) {
  const user = enterGuestMode();
  forgetCaches();
  let has = false;
  try { has = await hasCloudData(); } catch (e) { has = false; }
  if (!has) { await shell.startGuest(null); return; }
  // As startGuest does it, without its demo plan: the planner on the tab's own open plan, then the meter (whose hard
  // stop, once the free hours are used up, covers it) and the banner.
  hideLandingPage();
  await shell.showMainApp(user);
  shell.maybeAnnounceRelease({ isGuestUser: true, hasData: true });
  shell.startGuestMeter();
  const banner = document.getElementById('guestBanner'); if (banner) banner.style.display = 'flex';
}

/** The active plan's fromAnswer record (a plan made from a V7 answer), or null. Never throws. */
export async function planFromAnswer() {
  try {
    const sc = await getActiveScenarioAsync();
    return sc && sc.fromAnswer && typeof sc.fromAnswer === 'object' ? sc.fromAnswer : null;
  } catch (e) {
    return null;
  }
}

/**
 * On a plan made from a V7 answer, the target the plan actually works to — the first step of its income shape, after
 * tax a month and before tax a year, from the saved Stress settings — for the Budget page to show beside the budget's
 * total (owner, 1 Oct 2026: "the budget is a guide for the user when deciding how much"). Null on any other plan.
 */
export async function planTargetGuide() {
  if (!(await planFromAnswer())) return null;
  try {
    const S = await getStressSettingsAsync();
    const age = +S.shapeAgeNow || 0;
    const grossAnnual = Array.isArray(S.targetSchedule) && S.targetSchedule.length ? +S.targetSchedule[0] || 0
      : S.incomeShape === 'phases' ? amountAtAge(S.incomeSteps, age, +S.baseSalary || 0) : +S.baseSalary || 0;
    const monthly = grossToNet(grossAnnual, S.pa ?? 12570, S.brl ?? 50270, S.hrl ?? 125140) / 12;
    const steps = S.incomeShape === 'phases' && Array.isArray(S.incomeSteps) && S.incomeSteps.filter((x) => +x.amount > 0).length > 1;
    return { monthly, grossAnnual, steps };
  } catch (e) {
    return null;
  }
}
