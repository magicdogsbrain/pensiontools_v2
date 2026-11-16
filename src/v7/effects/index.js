/**
 * The effects — the only code in V7 that touches the outside (address, worker, session storage, the activity stamp in
 * local storage, the page's own attributes). startEffects(store, …) starts them all; main.jsx calls it once.
 *
 *   startEffects(store, { win, client, local }) → { client, stop }
 *   markReady(root, state)      sets #app's data-ready and data-answer, and fires pt:done (brief 4.9)
 */
import { A } from '../state/actions.js';
import { readyMark } from '../state/select.js';
import { startAddress } from './address.js';
import { startDraftStore, sessionStore, localStore } from './draftStore.js';
import { startRunner } from './run.js';
import { startLastsRunner } from './lasts.js';
import { startWaysRunner } from './ways.js';
import { startMixRunner } from './mix.js';
import { startHouseholdRunner } from './household.js';
import { startMoveRunner } from './move.js';
import { startKeepTestRunner } from './keepTest.js';
import { startStressPanelRunner } from './stressPanel.js';
import { startReviewRunner } from './review.js';
import { startStressStripRunner } from './stressStrip.js';
import { startSaverRunner } from './saver.js';
import { createWorkerClient } from './workerClient.js';
import { startActivity } from './activity.js';
import { startOpenPlace, PLANNER } from './openPlace.js';
import { startGuestMeter } from './guestMeter.js';
import { startWhatsNew } from './whatsNew.js';
import { startDownloads } from './download.js';
import { startAssumptions } from './assumptions.js';
import { startPlace, hasSignedInHint } from './place.js';
import { startView } from './view.js';
import { startStaleBuild, watchClient } from './staleBuild.js';

/**
 * The answer worked out on the page itself — used only when no worker can start. The answers (and the engines
 * behind them) are fetched only then, so the shell stays small; the worker has its own copy.
 */
export async function answerOnPage(q, inputs, env) {
  const { ANSWERS } = await import('../../answers/index.js');
  return ANSWERS[q].answer(inputs, env);
}

/**
 * #app carries data-ready="1" only when no run is under way and any answer shown is final, else "0"; and
 * data-answer="none" | "first" | "final". A pt:done event (bubbling) is sent each time data-ready becomes "1".
 * Call it after the screen has been drawn for `state`.
 */
export function markReady(root, state) {
  const mark = readyMark(state);
  // a question's first answer held behind the ring for its least time (components/Spinner.jsx HeldAnswer) is not ready yet:
  // the state has it, the page does not show it; pt:held, when the hold ends, has this read again (main.jsx)
  const ready = mark.ready === '1' && root.querySelector('[data-holding="1"]') ? '0' : mark.ready;
  const answer = mark.answer;
  const was = root.getAttribute('data-ready');
  if (root.getAttribute('data-answer') !== answer) root.setAttribute('data-answer', answer);
  if (was !== ready) root.setAttribute('data-ready', ready);
  if (ready === '1' && was !== '1') root.dispatchEvent(new CustomEvent('pt:done', { bubbles: true }));
}

export function startEffects(store, { win = window, client: made = createWorkerClient(), local = answerOnPage } = {}) {
  const stops = [];
  // A page opened before the site was updated (effects/staleBuild.js): it loads itself again once, figures and place kept,
  // or says so in plain words. Started first, so a part that cannot be loaded on demand is caught wherever it is asked for.
  const stale = startStaleBuild(store, { win, session: sessionStore(win) });
  stops.push(stale.stop);
  const client = watchClient(made, stale.hit);
  // Land where you left off (7.1.0, effects/place.js): the site's root opened with no address of its own, in a browser where
  // someone is signed in. Read before the address effect tidies an empty address to #/ (the questions' own, which stays them).
  const hash = win.location && typeof win.location.hash === 'string' ? win.location.hash : '';
  const landing = (hash === '' || hash === '#') && hasSignedInHint(localStore(win));
  // the front door waits for the session where the note says someone is signed in here (select.js frontWaiting): told first
  if (hasSignedInHint(localStore(win))) store.dispatch({ type: A.ENV_SET, patch: { signedInHint: true } });
  stops.push(startAddress(store, win));
  stops.push(startDraftStore(store, sessionStore(win)));
  stops.push(startRunner({ store, client, local, onStale: stale.hit }));
  // "Does it last?" (research/v7/editing-in-v7.md 10.4): a saved plan's one test, in the worker only, on that step only —
  // no page fallback, so the engine's chunk is the worker's alone and the plan pages' own chunk does not carry it
  stops.push(startLastsRunner({ store, client, now: () => Date.now() }));
  // "How the money is taken" (research/v7/way-and-mix.md 2.2): the nine ways on a saved plan, in the worker only, on that step only
  stops.push(startWaysRunner({ store, client, now: () => Date.now() }));
  // "The mix" (research/v7/way-and-mix.md 3.2): the sleeve's and the tent's try and the eight cells, in the worker only, on that step only
  stops.push(startMixRunner({ store, client, now: () => Date.now() }));
  // "Your household" (research/v7/road-to-7.md step 9): the pooled run, the survivor and the care questions, in the worker only, on that step only
  stops.push(startHouseholdRunner({ store, client, now: () => Date.now() }));
  // "Moving to your plan's mix" (research/v7/holdings-and-move.md §3.3, §3.7): the one run on the held mix in the worker only, and the
  // equity index fetched once for the rotation watch (the bundled snapshot when the file cannot be read), on that step only
  stops.push(startMoveRunner({ store, client, now: () => Date.now(), fetchImpl: typeof win.fetch === 'function' ? win.fetch.bind(win) : null }));
  // "What you pay in" (research/saving-enough-and-check-in.md 4.4): the plan's verdict — question B on the plan's own figures —
  // in the worker's own lane, on that step only; no page fallback, as for the plan's other runs
  stops.push(startSaverRunner({ store, client }));
  // "Test what you keep against your plan" (7.7.0): the plan's own test as locked and as held, in the worker's own lane, only when asked
  stops.push(startKeepTestRunner({ store, client }));
  // "Try the bad years" (7.9.0): the rows on a saved plan, in the worker's own lane, one call each, only when asked
  stops.push(startStressPanelRunner({ store, client }));
  // "Your review" (7.10.0): the review's run, on a press, in the same lane
  stops.push(startReviewRunner({ store, client }));
  // … and under C's and D's answers, on a press of a final answer, in its own lane
  stops.push(startStressStripRunner({ store, client }));

  // The saved plans (research/v7/your-plan.md 4.1, 4.3): activity for the planner's idle sign-out on every page; the
  // hand-over to the planner; and the plan source — the one Firebase file, with the one write file — loaded only where
  // the plans are needed: the plan pages, "Keep this as a plan?" (road-to-7.md step 7: the preview makes the plan itself,
  // so a keep under way loads it too) and "Will it last?" (answer-D.md: a plan in the account is D's way in).
  stops.push(startActivity(win, { storage: localStore(win) }));
  stops.push(startOpenPlace(store, { session: sessionStore(win), go: (address) => win.location.assign(address) }));
  // The visitor's meter, What's new and the downloads (road-to-7.md step 11): on every page, each small; the plans they read come with the plan source.
  stops.push(startGuestMeter(store, { win, local: localStore(win) }));
  stops.push(startWhatsNew(store, { local: localStore(win) }));
  // "Assumptions and data" (road-to-7.md step 11b): the figures loaded lazily when the page is opened
  stops.push(startAssumptions(store, { now: () => Date.now() }));
  stops.push(startDownloads(store, { win }));
  // the view the site opens in (7.11.0, effects/view.js): this browser's copy of the account's choice, and the strip
  stops.push(startView(store, { win, local: localStore(win) }));
  // keep → sign in → back, and the place last left (7.1.0): the way back and the window's place in session storage; a
  // landing for someone whose account says the full view opens it in place of this page (7.11.0)
  stops.push(startPlace(store, { session: sessionStore(win), local: localStore(win), landing, full: () => win.location.replace(PLANNER) }));
  let planSource = null;
  // … the account page and What's new need the session (and the account's settings document); "Look around an example" pressed on the front door needs the write file
  const onPlanPage = (state) => state.route && (state.route.screen === 'plans' || state.route.screen === 'plan' || state.route.screen === 'account' || state.route.screen === 'news');
  const onKeepPage = (state) => state.route && state.route.screen === 'step' && (state.route.step === 'keep' || state.route.q === 'd');
  const keeping = (state) => !!state.keep && Object.values(state.keep).some((k) => k && k.saving);
  const exampleAsked = (state) => !!state.ui.saving && state.ui.saving.kind === 'example';
  // … and landing where a signed-in person left off (effects/place.js), and a way back after signing in from the keep panel
  // … and (7.5.0) the front door in a browser where someone is signed in: the session decides which front door is drawn —
  // the stranger's three doors, or today's questions for someone signed in — so it is read there too
  const signedInHere = hasSignedInHint(localStore(win));
  const onFrontSignedIn = (state) => signedInHere && !!state.route && (state.route.screen === 'front' || state.route.screen === 'notFound');
  // … and "Am I saving enough?" (6.59.0; 16 Nov 2026): "Use these in ‘…’" names the plan B was opened from, the plan kept from
  // it, or else your own saving plan — B started from the front door, a new tab or afresh too — so B's steps read the plans
  // wherever there may be one: someone signed in here, or a plan kept in this window (the draft says so). Never for a
  // visitor with neither, whose B page loads nothing more than before. Reading writes no plan.
  const keptSaver = (state) => !!(state.keep && state.keep.b && state.keep.b.made && state.keep.b.made.saverId);
  const keptInWindow = (state) => !!state.keep && Object.values(state.keep).some((k) => k && k.made && k.made.where === 'window');
  const mayHavePlans = (state) => signedInHere || keptInWindow(state);
  const onB = (state) => !!state.route && state.route.screen === 'step' && state.route.q === 'b'
    && (!!(state.draft.b && state.draft.b.fromPlan) || keptSaver(state) || mayHavePlans(state));
  // … and a name typed in any keep box, where there may be plans: a name you already have is said before a keep makes a second
  const naming = (state) => mayHavePlans(state) && !!state.keep && Object.values(state.keep).some((k) => k && typeof k.name === 'string');
  const needsPlans = (state) => onPlanPage(state) || onKeepPage(state) || keeping(state) || exampleAsked(state) || onB(state) || naming(state) || landing || onFrontSignedIn(state) || !!state.ui.returnTo;
  const loadPlanSource = (state) => {
    if (planSource || !needsPlans(state)) return;
    planSource = import('./planSource.js')
      // the worker client goes with it: the lock's write runs the plan's own test in the worker first (road-to-7.md step 6)
      .then((m) => { const stop = m.startPlanSource(store, { win, local: localStore(win), session: sessionStore(win), client }); stops.push(stop); return stop; })
      .catch(() => { store.dispatch({ type: A.PLANS_FAILED }); return () => {}; });
  };
  loadPlanSource(store.getState());
  stops.push(store.subscribe(loadPlanSource));

  const online = () => store.dispatch({ type: A.UI_ONLINE, online: true });
  const offline = () => store.dispatch({ type: A.UI_ONLINE, online: false });
  win.addEventListener('online', online);
  win.addEventListener('offline', offline);
  if (win.navigator && win.navigator.onLine === false) offline();
  stops.push(() => { win.removeEventListener('online', online); win.removeEventListener('offline', offline); });

  return { client, stop: () => stops.splice(0).forEach((fn) => fn()) };
}
