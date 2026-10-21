/**
 * The lock worked out in Node, for "screen equals engine" (research/v7/road-to-7.md step 6): the same lazily-loaded run the
 * V7 worker makes (src/answers/plan/lastsRun.js runForDocument) and the same pure writer the page uses (src/answers/plan/lock.js
 * lockPatch), on a plan brought up to date in memory exactly as the plan source does it (scenarioMigration.upgradeScenario at
 * noon of the day), in a child process of plain Node so the code is loaded as the ordinary test suite loads it.
 *
 *   lockInNode(rawPlan, today, nowIso)   → lockPatch's { patch, previous, lockedAt } for that plan, locked at `nowIso`
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runForDocument } = await import(${JSON.stringify(src('src/answers/plan/lastsRun.js'))});
const { lockPatch, shapeRefsOf } = await import(${JSON.stringify(src('src/answers/plan/lock.js'))});
const { plan, today, nowIso } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const run = runForDocument(up, { today, essentials: shapeRefsOf(up, [{ plan: up }]).essentials });
const out = lockPatch(up, { now: new Date(nowIso), run, entries: [{ plan: up }] });
process.stdout.write(JSON.stringify({ ok: out.ok, errors: out.errors, patch: out.patch, previous: out.previous, lockedAt: out.lockedAt }));
`;

export function lockInNode(plan, today, nowIso) {
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today, nowIso }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (run.status !== 0) throw new Error(`lockInNode: the lock could not be worked out in Node\n${run.stderr || run.error}`);
  return JSON.parse(run.stdout);
}
