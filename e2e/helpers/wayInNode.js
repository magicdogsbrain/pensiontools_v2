/**
 * "How the money is taken" worked out in Node, for "screen equals engine" (research/v7/way-and-mix.md 1, 7; road-to-7.md
 * step 8a): the same lazily-loaded module the V7 worker runs (src/answers/plan/waysRun.js runWays, runWay), the same order the
 * page's cards take (way.js rankedIds) and the same pure writer the one write file uses (way.js wayPatch, which is
 * PlanCommit.switchPatch), on a plan brought up to date in memory exactly as the plan source does it, in a child process of
 * plain Node.
 *
 *   wayInNode(rawPlan, today, { tryWay, at })  → { ways, order, current, tried, patch }
 *     ways     runWays's result (the nine, plain data)
 *     order    the ids as the cards list them: the plan's own first, then the other eight ranked by futures out of 10
 *     tried    runWay's result for `tryWay` ({ id, dials }), when given
 *     patch    wayPatch's { patch, previous } for `tryWay` typed as text, dated `at`, when given
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runWays, runWay } = await import(${JSON.stringify(src('src/answers/plan/waysRun.js'))});
const { rankedIds, wayPatch } = await import(${JSON.stringify(src('src/answers/plan/way.js'))});
const { plan, today, tryWay, at } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const ways = runWays(up, { today });
const ranked = rankedIds(ways.ways, 'lasts');
const order = [ways.strategyId, ...ranked.filter((id) => id !== ways.strategyId)];
let tried = null, patch = null;
if (tryWay) {
  tried = runWay(up, { today, id: tryWay.id, dials: tryWay.dials });
  const typed = Object.fromEntries(Object.entries(tryWay.dials).map(([k, v]) => [k, String(v)]));
  const run = ways.ways.find((w) => w.id === tryWay.id);
  const p = wayPatch(up, tryWay.id, typed, { today, at, defaults: run ? run.dials.defaults : {} });
  patch = { ok: p.ok, errors: p.errors, patch: p.patch, previous: p.previous };
}
process.stdout.write(JSON.stringify({ ways, order, current: ways.strategyId, tried, patch }));
`;

export function wayInNode(plan, today, { tryWay = null, at = null } = {}) {
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today, tryWay, at }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (run.status !== 0) throw new Error('wayInNode failed: ' + run.stderr);
  return JSON.parse(run.stdout);
}
