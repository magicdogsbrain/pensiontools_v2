/**
 * The parity sweep (lead4.md section 2, G1–G4, G7): for every fictional plan in e2e/parity/fixtures/, each page of the
 * simple view and each tab of the full view opened, every mark read, and one fact held to one value across every place.
 * Run against the local Firebase emulators of a demo- project by `node scripts/e2e-parity.mjs` (`npm run e2e:parity`),
 * which builds dist/emu, starts the emulators and totals the run; never the live project, never a real account.
 *
 * Four workers: each fixture has its own account. Desktop 1440 only (the views' marks do not depend on the size).
 * PARITY_FIXTURE=key,key runs those fixtures only. Results: test-results/parity/fixtures/<key>.json.
 */
import { defineConfig, devices } from '@playwright/test';
import { V7_PATH } from './e2e/helpers/paths.js';

const PORT = Number(process.env.E2E_PORT_PROD || 4173);
const DIST = process.env.E2E_DIST || 'dist';

export default defineConfig({
  testDir: 'e2e/parity',
  testMatch: /\.spec\.js$/,
  outputDir: 'test-results/parity/runs',
  globalSetup: './e2e/parity/global-setup.js',
  fullyParallel: true,
  workers: Number(process.env.PARITY_WORKERS || 4),
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 25 * 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list']],
  metadata: { dist: `${DIST}/emu`, prod: `http://127.0.0.1:${PORT}` },
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    colorScheme: 'dark',
    serviceWorkers: 'block',
    contextOptions: { reducedMotion: 'reduce' },
    actionTimeout: 20_000,
    trace: 'retain-on-failure'
  },
  webServer: [
    { command: `node e2e/helpers/serve.mjs ${DIST}/emu ${PORT} --emulators`, url: `http://127.0.0.1:${PORT}${V7_PATH}`, reuseExistingServer: process.env.E2E_REUSE_SERVER === '1', timeout: 20_000 }
  ]
});
