/**
 * Browser tests (V7 build brief, package 5; test plan 7–11).
 *
 * Two local builds, never the live site and never a real account:
 *   <E2E_DIST>/prod   the published build exactly as deployed (V7 at /, the classic planner at /classic/) — no test hooks
 *   <E2E_DIST>/test   V7's test build (V7 only, at /) — has window.__pt; never deployed
 * The two addresses are e2e/helpers/paths.js's V7_PATH and CLASSIC_PATH (src/appLayout.js): LAYOUT=preview runs the
 * suite against a rollback build, made with the same flag (the classic page at /, V7 at /v7/, as before 7.0).
 * `npm run e2e:build` makes both under dist/. Both are served by e2e/helpers/serve.mjs, which sends the real
 * security headers from public/_headers.
 *
 * Settings from the environment (all optional):
 *   E2E_DIST        the folder holding prod/ and test/ (default: dist)
 *   E2E_PORT_PROD   default 4173;  E2E_PORT_TEST  default 4174
 *   NIGHTLY=1       adds the night run's projects (the journeys in WebKit and Firefox) and the long lists
 *   SCREENS_GATE=1  compares the pictures with their approved baselines (off until we approve a first set)
 */
import { defineConfig, devices } from '@playwright/test';
import { V7_PATH } from './e2e/helpers/paths.js';

const CI = !!process.env.CI;
const DIST = process.env.E2E_DIST || 'dist';
const PORT_PROD = Number(process.env.E2E_PORT_PROD || 4173);
const PORT_TEST = Number(process.env.E2E_PORT_TEST || 4174);
const NIGHTLY = process.env.NIGHTLY === '1';

const chromium = (width, height, more = {}) => ({
  ...devices['Desktop Chrome'], viewport: { width, height }, deviceScaleFactor: 1, ...more
});
const phone = { hasTouch: true, isMobile: true };

// Which script runs at which size (test plan 7.4, 8.1, 8.3; step 4: test plan A–B 11.1).
// Step 4's journeys: J4 a-stop-soon and its second half b-my-number (published build), J5 a-couple, J7
// a-from-savings (test build) at 390 and 1440; the B journey b-coast at 390 and 744.
const JOURNEYS_AB_PHONE = ['a-stop-soon', 'b-my-number', 'a-couple', 'a-from-savings', 'b-coast'];
const JOURNEYS_AB_DESKTOP = ['a-stop-soon', 'b-my-number', 'a-couple', 'a-from-savings'];
// J6 (reported 1 Oct 2026): a 55-year-old still paying in, on C's first form — at 390 and 1280.
const JOURNEYS_PAYING_IN = ['c-paying-in'];
// The budget step and "Keep this as a plan" (research/v7/budget-step.md, save-as-plan.md; road-to-7.md step 7: the preview
// makes the plan itself), and "I'm retired. Will it last?" (answer-D.md): at 390 and 1440.
const JOURNEYS_KEEP = ['budget-step', 'keep', 'd-retired'];
// The first visit (7.5.0; research/v7/mockups/README.md): the three doors, a personal answer, Keep → sign in, no limit, less motion.
const JOURNEYS_FIRST = ['first-visit'];
// B2 (research/v7/couples-different-years.md 9.7): "I've already stopped" in A, saved as two plans, in today's planner — at
// 1440 (the planner's Household tab is on the wide tab bar).
const JOURNEYS_APART = ['a-already-stopped'];
// The saved plans in the preview, without an account (research/v7/your-plan.md 9, T10 and T12 on the guest path), and the
// editing steps "About you and when" (research/v7/editing-in-v7.md 5, E8), "Money that comes in anyway" (7.5, I5) and
// "What you spend" (8.5, S4), "Your pots and tax" (9.5, T4) and "Does it last?" (10.6, L7), and "Lock the plan" (road-to-7.md
// step 6: the lock, the planner reading the plan as locked, the unlock): at 390 and 1440.
// … and the three levers of "Will it last?" on a saved plan's "Does it last?" (road-to-7.md step 7), and "How the money is
// taken" (way-and-mix.md 7: the nine cards, a dial, "Use this way of drawing", the locked plan's comparison line).
// … and "The mix" and Try a change (way-and-mix.md 3, 4, 7: a level, your own split, a pasted list, the tent's bad-case line,
// "Which mix lasts best?" and "Use this mix"; every Try box, "What's different", "Use this", "Keep as a separate plan").
// … and "What you hold" and "Moving to your plan's mix" (holdings-and-move.md §7: the record's writes and Undo byte for byte, a tick-off,
// the one run on the held mix equal to Node).
// … and the plan menu, the account page and What's new (road-to-7.md step 11): plans-actions and whats-new, at 390 and 1440.
// … and "Who draws what" in the words of 27 Oct 2026 (household-draw-split.md 9): plan-household-words, at 390 and 1440.
// … and Month by month's missed months filled in, the line under Calculate / Save and a failed Calculate kept on the page (reported 3 Nov 2026): planner-month-fill, at 390 and 1440.
// … and the month work stopped (research/plan-start.md §7, cases a, c, e): plan-stopped-work, at 390 and 1440.
// … and a locked plan's start moved to the tax year work stopped (§7, case b): plan-move-start, at 390 and 1440.
// … and a saver's check-in (research/saving-enough-and-check-in.md 5, release step R3): plan-checkin, at 390 and 1440.
// … and back to work (research/plan-start.md §2 J): a drawing plan closed, a saving plan carrying the £10,000 limit: plan-back-to-work, at 390 and 1440.
// … and trying figures never makes plans (6.59.0): B opened from a saver's plan, "Use these", one more plan only on Keep, "Delete several": plan-try-not-copy, at 390 and 1440.
// … and Month by month in the new app (7.2.0): a tax year set up, a month recorded, the months missed filled in: plan-month, at 390 and 1440.
// … and a plan's home (7.3.0): what is due, where you are, then everything else folded away: plan-home, at 390 and 1440.
// … and no months "before the plan" on any screen of either app (7.3.3), a plan stored that way shown the move of its start: plan-no-runup-words, at 390 and 1440.
// … and "Keep this" (7.6.0): a line kept as a stand-in or by choice on a locked plan, never a sell, the gaps year by year, Undo, in both apps: plan-keep, at 390 and 1440.
// … and "Test what you keep against your plan" (7.7.0): the test on its button, "I accept this risk" one write, Undo, in both apps;
// with "Try the bad years" on a plan (7.9.0): the rows within their budget, an agreement one write, a locked ladder's rows, the
// classic Scenarios page's same rows: plan-stress (was plan-keep-test), at 390 and 1440.
// "Try the bad years" under C's and D's answers (7.9.0): answer-bad-years, at 390 and 1440 (in JOURNEYS_PHONE and JOURNEYS_DESKTOP).
const JOURNEYS_PLAN = ['plan-keep', 'plan-stress', 'plan', 'plan-home', 'plan-about', 'plan-income', 'plan-spend', 'plan-pots', 'plan-lasts', 'plan-lock', 'plan-levers', 'plan-way', 'plan-mix', 'plan-try', 'plan-household', 'plan-household-words', 'plan-hold', 'plan-move', 'plan-budget', 'plan-saving', 'plan-stale-lumps', 'plans-actions', 'whats-new', 'planner-month-fill', 'plan-stopped-work', 'plan-move-start', 'plan-close', 'plan-checkin', 'plan-back-to-work', 'plan-try-not-copy', 'plan-month', 'plan-no-runup-words'];
const JOURNEYS_PHONE = [...JOURNEYS_FIRST, 'c-forum-guest', 'c-couple', 'c-retired', 'answer-bad-years', 'production', 'old-app-unchanged', 'crawl', 'screens', ...JOURNEYS_AB_PHONE, ...JOURNEYS_PAYING_IN, ...JOURNEYS_KEEP, ...JOURNEYS_PLAN];
// An old service worker cleared by the kill switch (public/sw.js; switch-readiness.md §3): its own server, at 1440 only.
const JOURNEYS_DESKTOP = [...JOURNEYS_FIRST, 'c-forum-guest', 'c-couple', 'answer-bad-years', 'production', 'old-app-unchanged', 'old-worker', 'crawl', 'screens', 'keyboard', ...JOURNEYS_AB_DESKTOP, ...JOURNEYS_KEEP, ...JOURNEYS_APART, ...JOURNEYS_PLAN];
const only = (names) => names.map((n) => `**/${n}.spec.js`);

const projects = [
  { name: 'phone-390',    use: chromium(390, 844, phone),  testMatch: only(JOURNEYS_PHONE) },
  { name: 'ipad-744',     use: chromium(744, 1133, { hasTouch: true }), testMatch: only(['c-retired', 'crawl', 'screens', 'b-coast']) },
  { name: 'wide-1024',    use: chromium(1024, 768),        testMatch: only(['crawl', 'screens']) },
  { name: 'desktop-1280', use: chromium(1280, 800),        testMatch: only(JOURNEYS_PAYING_IN) },
  { name: 'desktop-1440', use: chromium(1440, 900),        testMatch: only(JOURNEYS_DESKTOP) },

  // The same answer in every browser (test plan 9).
  { name: 'sameness-chromium', use: { ...devices['Desktop Chrome'] },  testMatch: only(['sameness']) },
  { name: 'sameness-webkit',   use: { ...devices['Desktop Safari'] },  testMatch: only(['sameness']) },
  { name: 'sameness-firefox',  use: { ...devices['Desktop Firefox'] }, testMatch: only(['sameness']) }
];

if (NIGHTLY) {
  // A common iPad and phone size; and one journey in Firefox.
  projects.push(
    // Step 4: J4 (a-stop-soon) and J7 (a-from-savings) in WebKit at 390 and 744; J4 in Firefox (test plan A–B 14.2).
    { name: 'nightly-webkit-390', use: { ...devices['Desktop Safari'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }, testMatch: only(['c-forum-guest', 'c-retired', 'a-stop-soon', 'a-from-savings']) },
    { name: 'nightly-webkit-744', use: { ...devices['Desktop Safari'], viewport: { width: 744, height: 1133 }, deviceScaleFactor: 1 }, testMatch: only(['c-forum-guest', 'c-retired', 'a-stop-soon', 'a-from-savings']) },
    { name: 'nightly-firefox',    use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } }, testMatch: only(['c-forum-guest', 'a-stop-soon']) }
  );
}

export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/global-setup.js',   // measures this machine's speed for the answer-time budgets
  outputDir: 'test-results',
  fullyParallel: true,
  retries: 0,                       // a test that needs a second go is hiding something: fix the wait
  forbidOnly: CI,
  workers: CI ? 2 : undefined,       // a GitHub runner has 2 cores; more workers starve the answer worker
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled', caret: 'hide', scale: 'css' }
  },
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  metadata: { dist: DIST, prod: `http://127.0.0.1:${PORT_PROD}`, test: `http://127.0.0.1:${PORT_TEST}` },
  use: {
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    colorScheme: 'dark',            // one fixed colour scheme: V7 has one theme, taken from today's app
    serviceWorkers: 'block',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure'
  },
  webServer: [
    { command: `node e2e/helpers/serve.mjs ${DIST}/prod ${PORT_PROD}`, url: `http://127.0.0.1:${PORT_PROD}${V7_PATH}`, reuseExistingServer: !CI, timeout: 20_000 },
    { command: `node e2e/helpers/serve.mjs ${DIST}/test ${PORT_TEST}`, url: `http://127.0.0.1:${PORT_TEST}${V7_PATH}`, reuseExistingServer: !CI, timeout: 20_000 }
  ],
  projects
});
