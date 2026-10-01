/**
 * The plans a seed makes pass the plan-corpus checks (tests/fixtures/plans/checks.mjs — the same four checks every
 * saved-plan shape in the corpus passes), evaluated the way tests/planCorpus.test.js evaluates them: in a child Node
 * process with the clock, the time zone and the market data pinned (fixtures/plans/run.mjs).
 *
 *   (1) normalizeScenario survives it and a second pass changes nothing;
 *   (2) its Stress settings build a simulation config and one strategy evaluation runs, with no NaN or undefined;
 *   (3) (locked plans only — none of these is locked) the checksum and records;
 *   (4) its holdings (none) normalise without loss.
 * Plus: the app's load path reads back the start year and start age the plan was written with, and its life stage.
 * Slow (one strategy evaluation per plan), so named *.slow.test.js.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { seedToScenario } from '../src/services/PlanSeed.js';
import { ALL_SEEDS } from './integration/fixtures/planSeeds.js';

const RUNNER = resolve(__dirname, 'fixtures', 'plans', 'run.mjs');
const NOW = '2026-10-02T09:00:00.000Z';   // the day after the answer; every figure in the plan is dated from seed.today

// The hand-written seeds, and — once V7's builder is there — the seeds V7 makes from its own named states' answers.
const seeds = Object.entries(ALL_SEEDS).map(([name, f]) => [name, f()]);
const BUILDER = resolve(__dirname, '../src/answers/keep/planSeed.js');
if (existsSync(BUILDER)) {
  const { buildPlanSeed } = await import('../src/answers/keep/planSeed.js');
  for (const [q, f] of [['c', 'answer-F1'], ['c', 'answer-paying-in'], ['a', 'answer-A2-couple'], ['a', 'answer-A3-part-time'], ['a', 'answer-stop-now'], ['b', 'answer-B4-before-57'], ['b', 'answer-B5-couple']]) {
    const file = resolve(__dirname, 'v7/states', q, f + '.json');
    if (!existsSync(file)) continue;
    const result = JSON.parse(readFileSync(file, 'utf8')).answers[q].result;
    const seed = buildPlanSeed({ source: q, result, env: { today: '2026-09-30', appVersion: '6.17.0' }, name: { chosen: 'V7 ' + f }, createdAt: '2026-09-30T14:03:22.511Z' });
    if (seed) seeds.push(['V7 ' + q + ' ' + f, seed]);
  }
}

const plans = [];
for (const [name, seed] of seeds) {
  const { yours, partner } = seedToScenario(seed, new Date(2026, 9, 2, 10, 0));
  // as stored: an id and the two stamps createScenario adds
  const stamp = (p, id) => ({ ...p, id, createdAt: '2026-10-02T09:00:00.000Z', lastModified: '2026-10-02T09:00:00.000Z' });
  plans.push([name, stamp(yours, name + '-yours')]);
  if (partner) plans.push([name + ' · partner', stamp(partner, name + '-partner')]);
}

let run = { plans: {} };
beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'plan-seed-corpus-'));
  try {
    const file = join(dir, 'seedPlans.json');
    writeFileSync(file, JSON.stringify(plans.map(([, p]) => p)));
    const out = join(dir, 'out.json');
    execFileSync(process.execPath, [RUNNER, '--now', NOW, '--out', out, file], { stdio: ['ignore', 'ignore', 'inherit'] });
    run = JSON.parse(readFileSync(out, 'utf8'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 240000);

describe('plans made from seeds pass the plan-corpus checks', () => {
  plans.forEach(([name, plan], i) => {
    const key = 'seedPlans#' + i;
    it(name + ': checks 1–4 find nothing', () => {
      const r = run.plans[key];
      expect(r, 'not evaluated').toBeTruthy();
      expect(r.problems.map((p) => '(' + p.check + ') ' + p.msg)).toEqual([]);
    });
    it(name + ': the app reads back the start it was written with, unlocked, with no records', () => {
      const rec = run.plans[key].record;
      const S = plan.stressTool.settings;
      expect([rec.firstTaxYear, rec.startAge, rec.locked, rec.historyMonths, rec.hasPlanDocument, rec.fundsToTest, rec.holdings.lines]).toEqual([S.firstTaxYear, S.shapeAgeNow, false, 0, false, 0, 0]);
      expect(rec.timingMode).toBe(S.retired ? 'retired' : 'future');
      expect(rec.strategyId).toBe('pots-and-valves');
      expect(rec.headline && rec.headline.affordable).toBe(true);
      expect(['saving', 'approaching', 'draft-retired']).toContain(rec.stage);
    });
  });
});
