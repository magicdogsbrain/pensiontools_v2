/**
 * The signed-in browser tests (research/v7/after-7.md §3): every journey a person makes with an account, run against the
 * local Firebase emulators of a demo- project — never the live project, never a real account.
 *
 *   node scripts/e2e-signed-in.mjs [--no-build] [playwright arguments…]
 *
 * 1. Builds the emulator build into dist/emu (SITE_OUT=dist/emu VITE_EMULATORS=1, both apps, the published layout): its
 *    Firebase is the demo- project's, connected to the emulators (src/firebase/projectConfig.js). `--no-build` reuses it.
 * 2. Runs `firebase emulators:exec --only auth,firestore --project demo-pensiontools` (firebase.json's emulators block:
 *    Auth on 9099, Firestore on 8080, the real firestore.rules, no UI) around Playwright with playwright.signed-in.config.js,
 *    which serves dist/emu with the real security headers plus the two emulator addresses (e2e/helpers/serve.mjs
 *    --emulators) and runs e2e/signed-in/*.spec.js at desktop-1440 and phone-390, one test at a time (they share the
 *    emulators, and every spec clears them first).
 *
 * Needs the Firebase CLI (`firebase`) and Java on this machine; the Firestore emulator is fetched by the CLI the first
 * time. Local only: not in CI this round (RELEASING.md).
 */
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const EMULATOR_PROJECT = 'demo-pensiontools';
export const EMU_OUT = 'dist/emu';

const args = process.argv.slice(2);
const build = !args.includes('--no-build');
const passOn = args.filter((a) => a !== '--no-build');

function run(cmd, cmdArgs, env = {}) {
  const r = spawnSync(cmd, cmdArgs, { cwd: REPO, stdio: 'inherit', env: { ...process.env, ...env } });
  if (r.error) { console.error(r.error.message); process.exit(1); }
  if (r.status !== 0) process.exit(r.status || 1);
}

if (build) {
  const env = { SITE_OUT: EMU_OUT, VITE_EMULATORS: '1' };
  run('npx', ['vite', 'build'], env);
  run('npx', ['vite', 'build', '--config', 'vite.v7.config.js'], env);
}

const quote = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const inner = ['npx', 'playwright', 'test', '-c', 'playwright.signed-in.config.js', ...passOn].map(quote).join(' ');
run('firebase', ['emulators:exec', '--only', 'auth,firestore', '--project', EMULATOR_PROJECT, inner]);
