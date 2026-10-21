/**
 * A lever of "Will it last?" worked out in Node on a saved plan, for "screen equals engine" (research/v7/answer-D.md 3.9;
 * road-to-7.md step 7): the same lazily-loaded module the V7 worker runs (src/answers/plan/lastsRun.js runLever), on a plan
 * brought up to date in memory exactly as the plan source does it, in a child process of plain Node.
 *
 *   leverInNode(rawPlan, today, lever)   → the result runLever returns for that plan, that day, that lever
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runLever } = await import(${JSON.stringify(src('src/answers/plan/lastsRun.js'))});
const { plan, today, lever } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
process.stdout.write(JSON.stringify(runLever(up, { today, lever })));
`;

export function leverInNode(plan, today, lever) {
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today, lever }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (run.status !== 0) throw new Error('leverInNode failed: ' + run.stderr);
  return JSON.parse(run.stdout);
}
