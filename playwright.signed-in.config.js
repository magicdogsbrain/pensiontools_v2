/**
 * The signed-in browser tests (research/v7/after-7.md §3): the journeys a person makes with an account, run against the
 * local Firebase emulators of a demo- project — never the live project, never a real account. Started by
 * `node scripts/e2e-signed-in.mjs`, which builds the emulator build (dist/emu) and runs this inside
 * `firebase emulators:exec --only auth,firestore --project demo-pensiontools`.
 *
 * One server: the emulator build, served by e2e/helpers/serve.mjs with the real security headers and the two emulator
 * addresses let through connect-src (`--emulators`), at the PROD address (E2E_PORT_PROD), so the specs' helpers
 * (e2e/helpers/app.js: `v7(page, 'prod')`, PROD, V7_PATH, CLASSIC_PATH) open it as they open the published build.
 * Two projects, desktop-1440 and phone-390, each running e2e/signed-in/*.spec.js. One test at a time: they share the
 * emulators, and every test clears them first (e2e/signed-in/emulator.js).
 */
import { defineConfig, devices } from '@playwright/test';
import { V7_PATH } from './e2e/helpers/paths.js';

const PORT = Number(process.env.E2E_PORT_PROD || 4173);
const DIST = process.env.E2E_DIST || 'dist';

const chromium = (width, height, more = {}) => ({
  ...devices['Desktop Chrome'], viewport: { width, height }, deviceScaleFactor: 1, ...more
});

export default defineConfig({
  testDir: 'e2e/signed-in',
  outputDir: 'test-results/signed-in',
  fullyParallel: false,
  workers: 1,                        // the emulators are shared: one test at a time, each clearing them first
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  reporter: [['list']],
  metadata: { dist: `${DIST}/emu`, prod: `http://127.0.0.1:${PORT}` },
  use: {
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    colorScheme: 'dark',
    serviceWorkers: 'block',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure'
  },
  webServer: [
    { command: `node e2e/helpers/serve.mjs ${DIST}/emu ${PORT} --emulators`, url: `http://127.0.0.1:${PORT}${V7_PATH}`, reuseExistingServer: false, timeout: 20_000 }
  ],
  projects: [
    { name: 'signed-in-desktop-1440', use: chromium(1440, 900) },
    { name: 'signed-in-phone-390', use: chromium(390, 844, { hasTouch: true, isMobile: true }) }
  ]
});
