/**
 * The move of a locked plan's start worked out in Node, for "screen equals engine" (6.55.0): the plan brought up to date in
 * memory as the plan source does it (scenarioMigration.upgradeScenario at noon of the day), the plan as moved
 * (src/answers/plan/moveStart.js movedPlanOf), the same run the V7 worker makes of it (src/answers/plan/lastsRun.js
 * runForDocument) and the same pure writer the page uses (movePatch), in a child process of plain Node so the code is loaded
 * as the ordinary test suite loads it. As e2e/helpers/lockInNode.js does for the lock.
 *
 *   moveInNode(rawPlan, today, nowIso, how)   → movePatch's { ok, errors, patch } for that plan, moved at `nowIso`; `how`
 *                                              (7.4.0): { thisYear } or { spStartDate }, as the page sends them
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
const { shapeRefsOf } = await import(${JSON.stringify(src('src/answers/plan/lock.js'))});
const { movedPlanOf, movePatch } = await import(${JSON.stringify(src('src/answers/plan/moveStart.js'))});
const { plan, today, nowIso, how } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const now = new Date(nowIso);
const mp = movedPlanOf(up, { now, ...how });
const run = mp ? runForDocument(mp.plan, { today, essentials: shapeRefsOf(mp.plan, [{ plan: up }]).essentials }) : null;
const out = mp ? movePatch(up, { now, run, entries: [{ plan: up }], ...how }) : { ok: false, errors: { plan: 'noMove' }, patch: {} };
process.stdout.write(JSON.stringify({ ok: out.ok, errors: out.errors, patch: out.patch }));
`;

export function moveInNode(plan, today, nowIso, how = {}) {
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today, nowIso, how }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (run.status !== 0) throw new Error(`moveInNode: the move could not be worked out in Node\n${run.stderr || run.error}`);
  return JSON.parse(run.stdout);
}
