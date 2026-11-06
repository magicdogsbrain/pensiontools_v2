/**
 * "Does it last?" worked out in Node, for "screen equals engine" (research/v7/editing-in-v7.md 10.6, L7): the same
 * lazily-loaded module the V7 worker runs (src/answers/plan/lastsRun.js), on a plan brought up to date in memory exactly
 * as the plan source does it (scenarioMigration.upgradeScenario at noon of the day), in a child process of plain Node so
 * the code is loaded as the ordinary test suite loads it.
 *
 *   lastsInNode(rawPlan, today)   → the result lastsRun.js returns (a, history, stored, …) for that plan on that day
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runLasts } = await import(${JSON.stringify(src('src/answers/plan/lastsRun.js'))});
const { plan, today } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
process.stdout.write(JSON.stringify(runLasts(up, { today })));
`;

export function lastsInNode(plan, today) {
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (run.status !== 0) throw new Error(`lastsInNode: the test could not be run in Node\n${run.stderr || run.error}`);
  return JSON.parse(run.stdout);
}
