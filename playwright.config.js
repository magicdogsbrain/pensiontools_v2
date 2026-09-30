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

// Which script runs at which size (test plan 7.4, 8.1, 8.3).
const JOURNEYS_PHONE = ['c-forum-guest', 'c-couple', 'c-retired', 'production', 'old-app-unchanged', 'crawl', 'screens'];
const JOURNEYS_DESKTOP = ['c-forum-guest', 'c-couple', 'production', 'old-app-unchanged', 'crawl', 'screens', 'keyboard'];
const only = (names) => names.map((n) => `**/${n}.spec.js`);

const projects = [
  { name: 'phone-390',    use: chromium(390, 844, phone),  testMatch: only(JOURNEYS_PHONE) },
  { name: 'ipad-744',     use: chromium(744, 1133, { hasTouch: true }), testMatch: only(['c-retired', 'crawl', 'screens']) },
  { name: 'wide-1024',    use: chromium(1024, 768),        testMatch: only(['crawl', 'screens']) },
  { name: 'desktop-1440', use: chromium(1440, 900),        testMatch: only(JOURNEYS_DESKTOP) },

  // The same answer in every browser (test plan 9).
  { name: 'sameness-chromium', use: { ...devices['Desktop Chrome'] },  testMatch: only(['sameness']) },
  { name: 'sameness-webkit',   use: { ...devices['Desktop Safari'] },  testMatch: only(['sameness']) },
  { name: 'sameness-firefox',  use: { ...devices['Desktop Firefox'] }, testMatch: only(['sameness']) }
];

if (NIGHTLY) {
  // The nearest thing to the owner's iPad and phone; and one journey in Firefox.
  projects.push(
    { name: 'nightly-webkit-390', use: { ...devices['Desktop Safari'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }, testMatch: only(['c-forum-guest', 'c-retired']) },
    { name: 'nightly-webkit-744', use: { ...devices['Desktop Safari'], viewport: { width: 744, height: 1133 }, deviceScaleFactor: 1 }, testMatch: only(['c-forum-guest', 'c-retired']) },
    { name: 'nightly-firefox',    use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } }, testMatch: only(['c-forum-guest']) }
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
