/**
 * The parity gate (lead4.md section 2): `npm run e2e:parity`.
 *
 *   node scripts/e2e-parity.mjs [--no-build] [--fixture key,key] [--write-baseline] [playwright arguments…]
 *
 * 1. Builds the emulator build into dist/emu, as the signed-in tests do (scripts/e2e-signed-in.mjs); `--no-build` reuses it.
 * 2. Runs the parity sweep (playwright.parity.config.js: e2e/parity/) inside `firebase emulators:exec` on the demo- project.
 *    `--fixture` runs only the fixtures named (PARITY_FIXTURE), so a step can check its part quickly.
 * 3. Totals the run (e2e/parity/gate.js): writes e2e/parity/report.json and prints ONE line — facts marked, fields bound,
 *    disagreements, unmarked, one-view-only, round trips failed — then every rise against the ratchet files
 *    (e2e/parity/known-disagreements.json, unmarked.json, one-view-only.json), which may only shrink.
 * 4. `--write-baseline` writes the ratchet files from this run (the first run of the gate only, or a brief that says so):
 *    entries of the fixtures run are replaced, the others kept.
 *
 * Exit status: not 0 when the sweep failed, or any number rose against the ratchet files.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarise, ratchet, baselineOf, reportOf, lineOf } from '../e2e/parity/gate.js';

// the same project and build folder as scripts/e2e-signed-in.mjs (not imported: that file runs when loaded)
const EMULATOR_PROJECT = 'demo-pensiontools';
const EMU_OUT = 'dist/emu';
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PARITY = join(REPO, 'e2e', 'parity');
const RESULTS = join(REPO, 'test-results', 'parity', 'fixtures');
const FILES = { known: 'known-disagreements.json', unmarked: 'unmarked.json', oneView: 'one-view-only.json' };

const args = process.argv.slice(2);
const build = !args.includes('--no-build');
const writeBaseline = args.includes('--write-baseline');
let fixtures = null;
const passOn = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--no-build' || a === '--write-baseline') continue;
  if (a === '--fixture') { fixtures = String(args[++i] || ''); continue; }
  if (a.startsWith('--fixture=')) { fixtures = a.slice('--fixture='.length); continue; }
  passOn.push(a);
}
const wanted = fixtures ? fixtures.split(',').map((s) => s.trim()).filter(Boolean) : null;

function run(cmd, cmdArgs, env = {}, { must = true } = {}) {
  const r = spawnSync(cmd, cmdArgs, { cwd: REPO, stdio: 'inherit', env: { ...process.env, ...env } });
  if (r.error) { console.error(r.error.message); process.exit(1); }
  if (must && r.status !== 0) process.exit(r.status || 1);
  return r.status;
}

if (build) {
  const env = { SITE_OUT: EMU_OUT, VITE_EMULATORS: '1' };
  run('npx', ['vite', 'build'], env);
  run('npx', ['vite', 'build', '--config', 'vite.v7.config.js'], env);
}

// the results of the fixtures about to run are cleared, so a fixture that fails cannot be totalled from an older run
if (existsSync(RESULTS)) for (const f of readdirSync(RESULTS)) if (!wanted || wanted.includes(f.replace(/\.json$/, ''))) rmSync(join(RESULTS, f));

const quote = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const inner = ['npx', 'playwright', 'test', '-c', 'playwright.parity.config.js', ...passOn].map(quote).join(' ');
const sweepStatus = run('firebase', ['emulators:exec', '--only', 'auth,firestore', '--project', EMULATOR_PROJECT, inner], wanted ? { PARITY_FIXTURE: wanted.join(',') } : {}, { must: false });

// ---- the totals ---------------------------------------------------------------------------------------------------------
const results = existsSync(RESULTS)
  ? readdirSync(RESULTS).filter((f) => f.endsWith('.json') && (!wanted || wanted.includes(f.replace(/\.json$/, '')))).map((f) => JSON.parse(readFileSync(join(RESULTS, f), 'utf8')))
  : [];
const summary = summarise(results);
const readJson = (name, empty) => (existsSync(join(PARITY, name)) ? JSON.parse(readFileSync(join(PARITY, name), 'utf8')) : empty);
const empty = baselineOf(summarise([]));
const base = { known: readJson(FILES.known, empty.known), unmarked: readJson(FILES.unmarked, empty.unmarked), oneView: readJson(FILES.oneView, empty.oneView) };

if (writeBaseline) {
  const ran = new Set(summary.fixtures);
  const keepOthers = (pairs) => pairs.filter((k) => !ran.has(String(k).split('|')[0]));
  const next = baselineOf(summary);
  next.known.pairs = [...keepOthers(base.known.pairs), ...next.known.pairs].sort();
  next.oneView.pairs = [...keepOthers(base.oneView.pairs), ...next.oneView.pairs].sort();
  next.unmarked.counts = Object.fromEntries(Object.entries({ ...Object.fromEntries(Object.entries(base.unmarked.counts).filter(([k]) => !ran.has(k.split('|')[0]))), ...next.unmarked.counts }).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(PARITY, FILES.known), JSON.stringify(next.known, null, 1) + '\n');
  writeFileSync(join(PARITY, FILES.unmarked), JSON.stringify(next.unmarked, null, 1) + '\n');
  writeFileSync(join(PARITY, FILES.oneView), JSON.stringify(next.oneView, null, 1) + '\n');
  Object.assign(base, next);
}

const { rose, shrank } = ratchet(summary, base);
const notQuiet = results.flatMap((r) => (r.pages || []).filter((p) => p.opened && !p.quiet).map((p) => `${r.fixture} ${p.view}:${p.page}`));
const report = reportOf(summary, { at: new Date().toISOString(), rose, shrank, notQuiet, fixtures: summary.fixtures });
writeFileSync(join(PARITY, 'report.json'), JSON.stringify(report, null, 1) + '\n');

console.log('\n' + lineOf(report));
for (const r of rose) console.log('  ROSE    ' + r);
if (shrank.length) console.log(`  ${shrank.length} entries can come out of the ratchet files (report.json "shrank").`);
if (notQuiet.length) console.log(`  ${notQuiet.length} pages were read before they went quiet (report.json "notQuiet").`);
const missing = (wanted || []).filter((k) => !summary.fixtures.includes(k));
if (missing.length) console.log('  NOT RUN ' + missing.join(', '));
process.exit(sweepStatus !== 0 || rose.length || missing.length ? 1 : 0);
