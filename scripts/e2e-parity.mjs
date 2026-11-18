/**
 * The parity gate (lead4.md section 2): `npm run e2e:parity`.
 *
 *   node scripts/e2e-parity.mjs [--no-build] [--fixture key,key] [--write-baseline] [playwright arguments…]
 *
 * 1. Builds the emulator build into dist/emu, as the signed-in tests do (scripts/e2e-signed-in.mjs); `--no-build` reuses it.
 * 2. Runs the parity sweep (playwright.parity.config.js: e2e/parity/) inside `firebase emulators:exec` on the demo- project.
 *    `--fixture` runs only the fixtures named (PARITY_FIXTURE), so a step can check its part quickly. Without it the run is
 *    FULL whatever the shell holds (PARITY_FIXTURE is cleared), and must hold every plan of the floor (coverage.json
 *    "fixtures"): a plan dropped, renamed or failed is a rise, as is a named plan that did not run.
 * 3. Totals the run (e2e/parity/gate.js): writes e2e/parity/report.json and prints ONE line — facts marked, fields bound,
 *    disagreements, unmarked, one-view-only, round trips failed — then every rise against the ratchet files
 *    (e2e/parity/known-disagreements.json, each pair with its places and values; unmarked.json, one-view-only.json), which
 *    may only shrink, and against their
 *    floor (e2e/parity/coverage.json: the plans, the pages that opened, the places of each fact), which may only grow. A page read
 *    before it settled is a rise too.
 * 4. The round trips (e2e/parity/roundtrip.spec.js, lead4.md G5) are held against known-roundtrips.json and the boxes in one
 *    view only against one-view-only.json "fields"; `--write-fields-baseline` writes those two and adds the boxes that
 *    differ between the views as "field:" pairs to known-disagreements.json (step G2's baseline; nothing else is touched).
 * 5. `--write-baseline` writes the ratchet files from this run (the first run of the gate only, or a brief that says so):
 *    entries of the fixtures run are replaced, the others kept.
 *    `--raise-floor` writes coverage.json up to this run where it ran more plans, opened more pages or drew more places
 *    (never down).
 *
 * Exit status: not 0 when the sweep failed, or any number rose against the ratchet files or fell under the floor.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarise, ratchet, baselineOf, reportOf, lineOf, roundTripsOf, failedTrips, ratchetTrips, tripsBaselineOf } from '../e2e/parity/gate.js';
import { ONE_VIEW_BOXES, registryProblems } from '../e2e/parity/fields.js';

// the same project and build folder as scripts/e2e-signed-in.mjs (not imported: that file runs when loaded)
const EMULATOR_PROJECT = 'demo-pensiontools';
const EMU_OUT = 'dist/emu';
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PARITY = join(REPO, 'e2e', 'parity');
const RESULTS = join(REPO, 'test-results', 'parity', 'fixtures');
const TRIPS = join(REPO, 'test-results', 'parity', 'roundtrips');
const FILES = { known: 'known-disagreements.json', unmarked: 'unmarked.json', oneView: 'one-view-only.json', coverage: 'coverage.json', trips: 'known-roundtrips.json' };

const args = process.argv.slice(2);
const build = !args.includes('--no-build');
const writeBaseline = args.includes('--write-baseline');
const raiseFloor = args.includes('--raise-floor');
const writeFields = args.includes('--write-fields-baseline');
let fixtures = null;
const passOn = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--no-build' || a === '--write-baseline' || a === '--raise-floor' || a === '--write-fields-baseline') continue;
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
if (existsSync(TRIPS)) for (const f of readdirSync(TRIPS)) if (!wanted || wanted.includes(JSON.parse(readFileSync(join(TRIPS, f), 'utf8')).fixture)) rmSync(join(TRIPS, f));
// the field table and the registry agree before anything runs (src/reading/fields.js, e2e/parity/fields.js)
{ const bad = registryProblems(); if (bad.length) { console.error('parity: the field registry does not match the field table:\n  ' + bad.join('\n  ')); process.exit(1); } }

const quote = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const inner = ['npx', 'playwright', 'test', '-c', 'playwright.parity.config.js', ...passOn].map(quote).join(' ');
const sweepStatus = run('firebase', ['emulators:exec', '--only', 'auth,firestore', '--project', EMULATOR_PROJECT, inner], { PARITY_FIXTURE: wanted ? wanted.join(',') : '' }, { must: false });

// ---- the totals ---------------------------------------------------------------------------------------------------------
const results = existsSync(RESULTS)
  ? readdirSync(RESULTS).filter((f) => f.endsWith('.json') && (!wanted || wanted.includes(f.replace(/\.json$/, '')))).map((f) => JSON.parse(readFileSync(join(RESULTS, f), 'utf8')))
  : [];
const summary = summarise(results);
const trips = roundTripsOf(existsSync(TRIPS) ? readdirSync(TRIPS).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(TRIPS, f), 'utf8'))).filter((r) => !wanted || wanted.includes(r.fixture)) : []);
const readJson = (name, empty) => (existsSync(join(PARITY, name)) ? JSON.parse(readFileSync(join(PARITY, name), 'utf8')) : empty);
const empty = baselineOf(summarise([]));
const base = { known: readJson(FILES.known, empty.known), unmarked: readJson(FILES.unmarked, empty.unmarked), oneView: readJson(FILES.oneView, empty.oneView), coverage: readJson(FILES.coverage, empty.coverage) };
base.trips = readJson(FILES.trips, { entries: {} });
const ofRan = (ran, key) => ran.has(String(key).split('|')[0]);

if (writeBaseline) {
  const ran = new Set(summary.fixtures);
  const keepOthers = (pairs) => pairs.filter((k) => !ran.has(String(k).split('|')[0]));
  const next = baselineOf(summary);
  const knownBefore = Array.isArray(base.known.pairs) ? {} : base.known.pairs;
  next.known.pairs = Object.fromEntries(Object.entries({ ...Object.fromEntries(Object.entries(knownBefore).filter(([k]) => !ofRan(ran, k))), ...next.known.pairs }).sort(([a], [b]) => a.localeCompare(b)));
  next.oneView.pairs = [...keepOthers(base.oneView.pairs), ...next.oneView.pairs].sort();
  next.unmarked.counts = Object.fromEntries(Object.entries({ ...Object.fromEntries(Object.entries(base.unmarked.counts).filter(([k]) => !ran.has(k.split('|')[0]))), ...next.unmarked.counts }).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(PARITY, FILES.known), JSON.stringify(next.known, null, 1) + '\n');
  writeFileSync(join(PARITY, FILES.unmarked), JSON.stringify(next.unmarked, null, 1) + '\n');
  next.oneView.fields = base.oneView.fields || [];
  writeFileSync(join(PARITY, FILES.oneView), JSON.stringify(next.oneView, null, 1) + '\n');
  next.coverage.fixtures = [...new Set([...(base.coverage.fixtures || []), ...next.coverage.fixtures])].sort();
  next.coverage.pages = [...base.coverage.pages.filter((k) => !ofRan(ran, k)), ...next.coverage.pages].sort();
  next.coverage.shown = Object.fromEntries(Object.entries({ ...Object.fromEntries(Object.entries(base.coverage.shown).filter(([k]) => !ofRan(ran, k))), ...next.coverage.shown }).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(PARITY, FILES.coverage), JSON.stringify(next.coverage, null, 1) + '\n');
  Object.assign(base, next);
} else if (raiseFloor) {
  // only upwards: a page that opens now is added, a fact drawn in more places raises its count; nothing is taken out
  const now = baselineOf(summary).coverage;
  const cov = { ...base.coverage, fixtures: [...new Set([...(base.coverage.fixtures || []), ...now.fixtures])].sort(), pages: [...new Set([...base.coverage.pages, ...now.pages])].sort(), shown: { ...base.coverage.shown } };
  for (const [k, n] of Object.entries(now.shown)) cov.shown[k] = Math.max(n, cov.shown[k] || 0);
  cov.shown = Object.fromEntries(Object.entries(cov.shown).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(PARITY, FILES.coverage), JSON.stringify(cov, null, 1) + '\n');
  base.coverage = cov;
}

if (writeFields) {
  // the fields' baseline (step G2 of lead4.md G5): the boxes in one view only, the round trips that fail, and the boxes that
  // differ between the views in the sweep — added to known-disagreements.json as "field:" pairs, nothing else touched
  const ran = new Set(summary.fixtures);
  const fieldPairs = Object.fromEntries(Object.entries(baselineOf(summary).known.pairs).filter(([k]) => k.split('|')[1].startsWith('field:')));
  const kept = Object.fromEntries(Object.entries(base.known.pairs).filter(([k]) => !(ran.has(k.split('|')[0]) && k.split('|')[1].startsWith('field:'))));
  base.known = { ...base.known, pairs: Object.fromEntries(Object.entries({ ...kept, ...fieldPairs }).sort(([a], [b]) => a.localeCompare(b))) };
  writeFileSync(join(PARITY, FILES.known), JSON.stringify(base.known, null, 1) + '\n');
  base.oneView = { ...base.oneView, fields: [...ONE_VIEW_BOXES] };
  writeFileSync(join(PARITY, FILES.oneView), JSON.stringify(base.oneView, null, 1) + '\n');
  const tb = tripsBaselineOf(trips);
  if (wanted) tb.entries = Object.fromEntries(Object.entries({ ...Object.fromEntries(Object.entries(base.trips.entries || {}).filter(([k]) => !trips.some((t) => t.key === k))), ...tb.entries }).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(PARITY, FILES.trips), JSON.stringify(tb, null, 1) + '\n');
  base.trips = tb;
}

const { rose, shrank, grew } = ratchet(summary, base, { only: wanted });
// the round trips (lead4.md G5) and the boxes in one view only: may only shrink
{
  const t = ratchetTrips(trips, base.trips, { only: wanted });
  rose.push(...t.rose); shrank.push(...t.shrank);
  const listed = new Set(base.oneView.fields || []);
  for (const id of ONE_VIEW_BOXES) if (!listed.has(id)) rose.push(`a box in one view only, not in one-view-only.json "fields": ${id}`);
  for (const id of listed) if (!ONE_VIEW_BOXES.includes(id)) shrank.push(`a box in both views now, take it out of one-view-only.json "fields": ${id}`);
}
// fields bound: every box of the table the run found marked, in the sweep or in a round trip
const boundIds = new Set([...summary.fieldIds, ...trips.filter((t) => t.field && t.kind !== 'not reachable' && t.kind !== 'not tried').map((t) => t.field)]);
summary.fieldsBound = boundIds.size;
const report = reportOf(summary, { at: new Date().toISOString(), rose, shrank, grew, fixtures: summary.fixtures, roundTripsFailed: trips.length ? failedTrips(trips).length : null, trips });
writeFileSync(join(PARITY, 'report.json'), JSON.stringify(report, null, 1) + '\n');

console.log('\n' + lineOf(report));
for (const r of rose) console.log('  ROSE    ' + r);
if (shrank.length) console.log(`  ${shrank.length} entries can come out of the ratchet files (report.json "shrank").`);
if (grew.length) console.log(`  ${grew.length} pages or places more than the floor (report.json "grew"; --raise-floor writes them).`);
process.exit(sweepStatus !== 0 || rose.length ? 1 : 0);
