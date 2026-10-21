/**
 * "Your household" worked out in Node, for "screen equals engine" (research/v7/road-to-7.md step 9): the same lazily-loaded
 * module the V7 worker runs (src/answers/plan/householdRun.js runHousehold, runSurvivor, runCare) and the same pure writers
 * the one write file uses (household.js splitPatches, linkPatch, shareBudgetPatches), on two plans brought up to date in
 * memory exactly as the plan source does it, in a child process of plain Node.
 *
 *   householdInNode(plan, partner, today, { survivor, care })  → { pooled, split, survivor, care, link, share }
 *     pooled    runHousehold's result (plain data): own.combined, rA, rB, the split, fig, basis
 *     split     splitPatches on that run: { mode, writes | copies, changes } (null when the split does not apply)
 *     survivor  runSurvivor's result for `survivor` boxes ({ who, atAge, spendPct, dbPct }), when given
 *     care      runCare's result for `care` boxes ({ who, fromAge, years, cost }), when given
 *     link      linkPatch(plan, partner.id)'s patch; share: shareBudgetPatches(plan, partner, true)'s first write
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { runHousehold, runSurvivor, runCare } = await import(${JSON.stringify(src('src/answers/plan/householdRun.js'))});
const { splitPatches, linkPatch, shareBudgetPatches, boxesOf } = await import(${JSON.stringify(src('src/answers/plan/household.js'))});
const { plan, partner, today, survivor, care } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const now = new Date(y, m - 1, d, 12);
const a = upgradeScenario(plan, { now }).scenario, b = upgradeScenario(partner, { now }).scenario;
const pooled = runHousehold(a, b, { today });
const split = pooled.ok && pooled.split.applies ? (() => { const p = splitPatches(a, b, pooled.split, { today }); return { mode: p.mode, writes: p.writes || null, copies: p.copies ? p.copies.map((c) => ({ name: c.name, settings: c.settings })) : null, changes: p.changes }; })() : null;
const out = { pooled, split, boxes: boxesOf(a, b, { today }), link: linkPatch({ ...a, household: undefined }, b.id).patch, share: shareBudgetPatches(a, b, true).writes[0] };
if (survivor) out.survivor = runSurvivor(a, b, { today, ...survivor });
if (care) out.care = runCare(a, b, { today, ...care });
process.stdout.write(JSON.stringify(out));
`;

export function householdInNode(plan, partner, today, { survivor = null, care = null } = {}) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, partner, today, survivor, care }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (r.status !== 0) throw new Error('householdInNode failed: ' + r.stderr);
  return JSON.parse(r.stdout);
}
