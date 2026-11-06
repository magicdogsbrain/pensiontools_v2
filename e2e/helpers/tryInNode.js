/**
 * Try a change and "The mix" worked out in Node, for "screen equals engine" (research/v7/way-and-mix.md 3, 4, 7; road-to-7.md
 * step 8b): the same lazily-loaded modules the V7 worker runs (src/answers/plan/lastsRun.js runTry; src/answers/plan/mixRun.js
 * runMixTry, runMixCompare) and the same pure writers the one write file uses (lasts.js tryPatch, tryCopyOf; mix.js mixPatch,
 * useMixPatch), on a plan brought up to date in memory exactly as the plan source does it, in a child process of plain Node.
 *
 *   tryInNode(rawPlan, today, { typed, at })   → { boxes, tried, diffs, patch, copy }
 *     boxes    the run boxes the typed text makes (checkTry's run: the planner's units)
 *     tried    runTry's result on those boxes (plain data)
 *     diffs    the "What's different" ids
 *     patch    tryPatch's { ok, patch, previous } dated `at`
 *     copy     tryCopyOf's settings (strategyId, duration, strategyParams) for "Keep as a separate plan"
 *
 *   mixInNode(rawPlan, today, { tryKind, typed, cell, paste })  → { saved, tried, compare, patch, use, paste }
 *     saved    savedMix's values (held, level, pcts, sleeve, tent) and the pot
 *     tried    runMixTry's result for `tryKind` ('sleeve' | 'tent'), without a base, when given
 *     compare  runMixCompare's eight cells, when `cell` or `compare: true` is given
 *     patch    mixPatch's { ok, patch, previous } for `typed`, when given
 *     use      useMixPatch's { ok, patch, previous } for `cell`, when given
 *     paste    the paste's reading for `paste` { text, wrapper }: the rows' count, how many recognised, left out
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const TRY_CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runTry } = await import(${JSON.stringify(src('src/answers/plan/lastsRun.js'))});
const { checkTry, tryPatch, tryCopyOf, tryDifferences } = await import(${JSON.stringify(src('src/answers/plan/lasts.js'))});
const { plan, today, typed, at } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const c = checkTry(up, typed || {}, { today });
if (!c.ok) { process.stdout.write(JSON.stringify({ ok: false, errors: c.errors })); process.exit(0); }
const tried = runTry(up, { today, boxes: c.run });
const diffs = tryDifferences(up, c.run, today).map((x) => x.id);
const p = tryPatch(up, c.run, { today, at });
const copy = tryCopyOf(up, c.run, today);
process.stdout.write(JSON.stringify({ ok: true, boxes: c.run, tried, diffs, patch: { ok: p.ok, patch: p.patch, previous: p.previous }, copy: { strategyId: copy.stressTool.settings.strategyId, duration: copy.stressTool.settings.duration, strategyParams: copy.stressTool.settings.strategyParams, strategy: copy.strategy } }));
`;

const MIX_CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runMixTry, runMixCompare } = await import(${JSON.stringify(src('src/answers/plan/mixRun.js'))});
const { savedMix, checkMix, mixPatch, useMixPatch } = await import(${JSON.stringify(src('src/answers/plan/mix.js'))});
const { plan, today, tryKind, typed, cell, compare, paste } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const s = savedMix(up, { today });
const out = { saved: { ...s.values, pot: s.pot, amounts: s.amounts, strategyId: s.strategyId, locked: s.locked }, tried: null, compare: null, patch: null, use: null, paste: null };
if (tryKind) out.tried = runMixTry(up, { today, kind: tryKind });
if (cell || compare) out.compare = runMixCompare(up, { today });
if (typed) { const p = mixPatch(up, typed, { today }); out.patch = { ok: p.ok, errors: p.errors, patch: p.patch, previous: p.previous }; }
if (cell) { const p = useMixPatch(up, cell, { today }); out.use = { ok: p.ok, patch: p.patch, previous: p.previous }; }
if (paste) { const c = checkMix(up, { held: 'funds', 'paste.text': paste.text, 'paste.wrapper': paste.wrapper || 'SIPP' }, { today }); out.paste = { rows: c.paste.rows.length, recognised: c.paste.rows.filter((r) => r.match).length, unrecognised: c.paste.rows.filter((r) => r.unrecognised).length, leftOut: c.paste.leftOut.length, canAdd: c.paste.canAdd, edits: c.paste.edits.length }; }
process.stdout.write(JSON.stringify(out));
`;

function run(child, input, name) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', child], {
    cwd: REPO, input: JSON.stringify(input), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (r.status !== 0) throw new Error(name + ' failed: ' + r.stderr);
  return JSON.parse(r.stdout);
}

export function tryInNode(plan, today, { typed = {}, at = null } = {}) {
  return run(TRY_CHILD, { plan, today, typed, at }, 'tryInNode');
}

export function mixInNode(plan, today, { tryKind = null, typed = null, cell = null, compare = false, paste = null } = {}) {
  return run(MIX_CHILD, { plan, today, tryKind, typed, cell, compare, paste }, 'mixInNode');
}
