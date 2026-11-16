/**
 * The scenario tests (e2e/scenarios/): a fictional person asks one question, takes the route a person takes, and reads
 * the screen; every expected figure is worked by hand in the test. Run against the local Firebase emulators of a demo-
 * project by `node scripts/e2e-signed-in.mjs --scenarios` (`npm run e2e:scenarios`), which builds dist/emu and starts the
 * emulators; never the live project, never a real account.
 *
 * Four workers: each scenario makes its own account (account.js) and never clears the emulators; the global set-up
 * clears them once. Every scenario runs at 1440 wide; those tagged @phone also at 390. The report is
 * test-results/scenarios/answers.md (reporter.mjs), which also keeps the 13-minute budget.
 */
import { defineConfig, devices } from '@playwright/test';
import { V7_PATH } from './e2e/helpers/paths.js';

const PORT = Number(process.env.E2E_PORT_PROD || 4173);
const DIST = process.env.E2E_DIST || 'dist';

const chromium = (width, height, more = {}) => ({
  ...devices['Desktop Chrome'], viewport: { width, height }, deviceScaleFactor: 1, ...more
});

export default defineConfig({
  testDir: 'e2e/scenarios',
  testMatch: /s\d\d-[^/]*\.spec\.js$/,
  outputDir: 'test-results/scenarios/runs',
  globalSetup: './e2e/scenarios/global-setup.js',
  fullyParallel: true,
  workers: Number(process.env.SCENARIO_WORKERS || 4),
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 90_000,                  // a scenario should take about 45 s
  expect: { timeout: 15_000 },
  reporter: [['list'], ['./e2e/scenarios/reporter.mjs']],
  metadata: { dist: `${DIST}/emu`, prod: `http://127.0.0.1:${PORT}` },
  use: {
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    colorScheme: 'dark',
    serviceWorkers: 'block',
    contextOptions: { reducedMotion: 'reduce' },
    actionTimeout: 20_000,           // a press that cannot happen fails the step, not the whole scenario's time
    trace: 'retain-on-failure'
  },
  webServer: [
    { command: `node e2e/helpers/serve.mjs ${DIST}/emu ${PORT} --emulators`, url: `http://127.0.0.1:${PORT}${V7_PATH}`, reuseExistingServer: process.env.E2E_REUSE_SERVER === '1', timeout: 20_000 }
  ],
  projects: [
    { name: 'scenarios-desktop-1440', use: chromium(1440, 900) },
    { name: 'scenarios-phone-390', use: chromium(390, 844, { hasTouch: true, isMobile: true }), grep: /@phone/ }
  ]
});
