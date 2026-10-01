/**
 * Browser tests (V7 build brief, package 5; test plan 7–11).
 *
 * Two local builds, never the live site and never a real account:
 *   <E2E_DIST>/prod   the published build exactly as deployed (the current app at /, V7 at /v7/) — no test hooks
 *   <E2E_DIST>/test   V7's test build (/v7/ only) — has window.__pt; never deployed
 * `npm run e2e:build` makes both under dist/. Both are served by e2e/helpers/serve.mjs, which sends the real
 * security headers from public/_headers.
 *
 * Settings from the environment (all optional):
 *   E2E_DIST        the folder holding prod/ and test/ (default: dist)
 *   E2E_PORT_PROD   default 4173;  E2E_PORT_TEST  default 4174
 *   NIGHTLY=1       adds the night run's projects (the journeys in WebKit and Firefox) and the long lists
 *   SCREENS_GATE=1  compares the pictures with their approved baselines (off until the owner approves a first set)
 */
import { defineConfig, devices } from '@playwright/test';

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
// J6 (the owner's report, 1 Oct 2026): a 55-year-old still paying in, on C's first form — at 390 and 1280.
const JOURNEYS_PAYING_IN = ['c-paying-in'];
const JOURNEYS_PHONE = ['c-forum-guest', 'c-couple', 'c-retired', 'production', 'old-app-unchanged', 'crawl', 'screens', ...JOURNEYS_AB_PHONE, ...JOURNEYS_PAYING_IN];
const JOURNEYS_DESKTOP = ['c-forum-guest', 'c-couple', 'production', 'old-app-unchanged', 'crawl', 'screens', 'keyboard', ...JOURNEYS_AB_DESKTOP];
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
  // The nearest thing to the owner's iPad and phone; and one journey in Firefox.
  projects.push(
    // Step 4: J4 (a-stop-soon) and J7 (a-from-savings) in WebKit at 390 and 744; J4 in Firefox (test plan A–B 14.2).
    { name: 'nightly-webkit-390', use: { ...devices['Desktop Safari'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }, testMatch: only(['c-forum-guest', 'c-retired', 'a-stop-soon', 'a-from-savings']) },
    { name: 'nightly-webkit-744', use: { ...devices['Desktop Safari'], viewport: { width: 744, height: 1133 }, deviceScaleFactor: 1 }, testMatch: only(['c-forum-guest', 'c-retired', 'a-stop-soon', 'a-from-savings']) },
    { name: 'nightly-firefox',    use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } }, testMatch: only(['c-forum-guest', 'a-stop-soon']) }
  );
}

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  retries: 0,                       // a test that needs a second go is hiding something: fix the wait
  forbidOnly: CI,
  workers: CI ? 4 : undefined,
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
    { command: `node e2e/helpers/serve.mjs ${DIST}/prod ${PORT_PROD}`, url: `http://127.0.0.1:${PORT_PROD}/v7/`, reuseExistingServer: !CI, timeout: 20_000 },
    { command: `node e2e/helpers/serve.mjs ${DIST}/test ${PORT_TEST}`, url: `http://127.0.0.1:${PORT_TEST}/v7/`, reuseExistingServer: !CI, timeout: 20_000 }
  ],
  projects
});
