/**
 * Plan corpus — the saved-plan shapes every later change is tested against (V7 step 1, the safety net).
 *
 * tests/fixtures/plans/NN-*.json are synthetic users/{uid}/scenarios/{id} documents written by the app's own
 * code (tests/fixtures/plans/build.mjs). For each one:
 *   (1) normalizeScenario survives it and a second pass changes nothing;
 *   (2) its Stress settings build a simulation config and one strategy evaluation runs, with no NaN/undefined
 *       in the headline;
 *   (3) a locked plan's decisionSettingsChecksum is the same after normalise + the load migrations
 *       (migrateStressDB, migrateTiming, sortLegacyParams), its records still belong to it, and its plan
 *       document is byte-identical;
 *   (4) its holdings normalise without loss.
 * and its checksum + headline equal tests/fixtures/plans/snapshot.json — so a later step that moves an answer
 * or a checksum has to say so by regenerating the snapshot (`node tests/fixtures/plans/build.mjs`) and
 * explaining the diff.
 *
 * Clock, time zone and market data are pinned: every engine reads `new Date()` with local-date maths, and the
 * gilt file is rewritten nightly. The evaluation therefore runs in a child Node process (fixtures/plans/run.mjs
 * → clock.mjs) — a vitest worker thread cannot set its own time zone. (Until 6.13.4 the answers differed by a
 * few pounds between UTC and Europe/London — a clock-change hour in the State Pension's first-year share; the
 * "time zone does not move an answer" block below now holds them equal across zones.)
 *
 * Portability: the snapshot was written on one machine and is compared on another (the owner's Apple-silicon
 * Mac, the Linux x64 CI runner, different Node versions). The random stream is integer arithmetic and identical
 * everywhere (MathUtils.seededRng); what is left is last-bit noise in Math.pow/log/cos, which recordDiffs()
 * tolerates on simulated money only.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { normalizeScenario } from '../src/firebase/scenarioMigration.js';
import { sortLegacyParams, activeParams, allowedKeys } from '../src/services/StrategyState.js';
import { recordDiffs } from './fixtures/plans/checks.mjs';

const PLANS_DIR = resolve(__dirname, 'fixtures', 'plans');
const load = (f) => JSON.parse(readFileSync(join(PLANS_DIR, f), 'utf8'));
const names = readdirSync(PLANS_DIR).filter((f) => /^\d\d-.*\.json$/.test(f)).map((f) => f.replace(/\.json$/, '')).sort();
const snapshot = load('snapshot.json');
let run = { plans: {} };   // run.mjs output: { now, market, plans: { name: { record, problems } } }

beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'plan-corpus-'));
  try {
    const out = join(dir, 'out.json');
    execFileSync(process.execPath, [join(PLANS_DIR, 'run.mjs'), '--now', snapshot.corpusNow, '--out', out, ...names.map((n) => join(PLANS_DIR, n + '.json'))], { stdio: ['ignore', 'ignore', 'inherit'] });
    run = JSON.parse(readFileSync(out, 'utf8'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 180000);

// check 0 = the evaluation itself threw: that fails every check of the plan.
const failures = (n, check) => (run.plans[n] ? run.plans[n].problems : [{ check: 0, msg: 'not evaluated' }]).filter((p) => p.check === check || p.check === 0).map((p) => p.msg);

describe('plan corpus — the fixture set itself', () => {
  it('has 8–12 fixtures and the snapshot lists exactly those', () => {
    expect(names.length).toBeGreaterThanOrEqual(8);
    expect(names.length).toBeLessThanOrEqual(12);
    expect(Object.keys(snapshot.plans).sort()).toEqual(names);
  });
  it('is evaluated at the clock and on the market data the snapshot was taken with', () => {
    expect(run.now).toBe(snapshot.corpusNow);
    expect(run.market).toEqual(snapshot.market);
  });
  it('every fixture is a whole scenario document with an id', () => {
    for (const n of names) {
      const d = load(n + '.json');
      expect(typeof d.id, n).toBe('string');
      for (const k of ['planDetails', 'enabledTools', 'decisionTool', 'stressTool', 'createdAt', 'lastModified']) expect(d, n).toHaveProperty(k);
    }
  });

  // The shapes the corpus exists to cover. If a regeneration loses one, the net has a hole — fail here, loudly.
  it('01 is an untouched default plan', () => {
    const d = load('01-fresh-default.json');
    expect(d.stressTool.settings.configured).toBeUndefined();
    expect(d.decisionTool.history).toEqual([]);
    expect(d.stressTool.settings.currentAge).toBeNull();
  });
  it('02 is a configured Pots & Valves draft', () => {
    const d = load('02-pnv-draft.json');
    expect(d.stressTool.settings).toMatchObject({ configured: true, strategyId: 'pots-and-valves', retired: true });
    expect(d.decisionTool.settings.locked).toBeFalsy();
  });
  it('03 is a locked gilt ladder in its run-up with history, a tax year, a plan document, a journey and holdings', () => {
    const d = load('03-gilt-ladder-runup.json');
    expect(d.decisionTool.settings.locked).toBe(true);
    expect(d.stressTool.settings.strategyId).toBe('full-il-gilt');
    expect(d.decisionTool.history.length).toBeGreaterThanOrEqual(3);
    expect(d.decisionTool.history.every((h) => h.bridgeYear === true && h.contract === true)).toBe(true);
    expect(Object.values(d.decisionTool.taxYears).some((t) => t.yearSetupComplete)).toBe(true);
    expect(d.planDocument.strategy.contract).toBe(true);
    expect(d.planDocument.holdingsAtLock.lines.length).toBeGreaterThan(0);
    expect(d.journey.map((j) => j.stage)).toContain('bridge');
    expect(d.holdings.lines.some((l) => l.kind === 'gilt')).toBe(true);
    expect(snapshot.plans['03-gilt-ladder-runup'].stage).toBe('bridge');
  });
  it('04 is a locked Buckets plan that is running', () => {
    const d = load('04-buckets-running.json');
    expect(d.decisionTool.settings.locked).toBe(true);
    expect(d.strategy.id).toBe('buckets-in-order');
    expect(d.decisionTool.history.length).toBeGreaterThanOrEqual(6);
    expect(snapshot.plans['04-buckets-running'].stage).toBe('running');
  });
  it('05 is a future retiree, committed and saving, with accumulation history', () => {
    const d = load('05-saver-committed.json');
    expect(d.stressTool.settings).toMatchObject({ retired: false, retireAge: 60 });
    expect(d.stressTool.settings.potAtRetirement.sipp).toBeGreaterThan(0);
    expect(d.accumulationTool.history.length).toBeGreaterThanOrEqual(3);
    expect(d.planDocument.accumulation.path.length).toBeGreaterThan(0);
    expect(snapshot.plans['05-saver-committed'].stage).toBe('committed-saving');
  });
  it('06 has no 6.4.0 timing fields at all, and is locked with records', () => {
    const d = load('06-pre-6.4-no-timing.json');
    for (const k of ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'potAtRetirement']) expect(k in d.stressTool.settings, k).toBe(false);
    expect('firstTaxYear' in d.decisionTool.settings).toBe(false);
    expect(d.stressTool.settings.spendingProfile).toBe('declining');
    expect(d.decisionTool.settings.locked).toBe(true);
    expect(d.decisionTool.history.length).toBeGreaterThan(0);
    expect(d.planDocument).toBeUndefined();
  });
  it('07 has one flat strategyParams bag full of other strategies\' keys, a funds list and no 6.13.0 fields', () => {
    const d = load('07-pre-6.13-flat-params.json');
    const s = d.stressTool.settings;
    const stray = Object.keys(s.strategyParams).filter((k) => !allowedKeys(s.strategyId).includes(k));
    expect(stray.length).toBeGreaterThanOrEqual(5);
    expect(s.strategyState).toBeUndefined();
    expect(d.holdings).toBeUndefined();
    expect(s.taggedFunds.length).toBeGreaterThan(0);
    // …and the 6.13.0 sort puts each stray key under its own strategy without touching the flat bag.
    const sorted = sortLegacyParams(s);
    expect(Object.keys(sorted.strategyState).sort()).toEqual(['bridge-and-engine', 'buckets-in-order', 'floor-and-flex', 'floor-to-age', 'full-il-gilt', 'ladder-and-ratchet']);
    expect(sorted.strategyParams).toEqual(s.strategyParams);
    expect(Object.keys(activeParams(sorted)).every((k) => allowedKeys(s.strategyId).includes(k))).toBe(true);
    expect(sortLegacyParams(sorted)).toBe(sorted);   // once only
  });
  it('08 carries literal dotted keys, and the phantom fields (the latest edits) win over the nested defaults', () => {
    const d = load('08-dotted-keys.json');
    const dotted = Object.keys(d).filter((k) => k.includes('.'));
    expect(dotted.sort()).toEqual(['decisionTool.history', 'decisionTool.settings', 'decisionTool.taxYears', 'planDetails.name', 'stressTool.settings']);
    expect(d.stressTool.settings.baseSalary).not.toBe(d['stressTool.settings'].baseSalary);
    const { scenario, migrated } = normalizeScenario(d);
    expect(migrated).toBe(true);
    expect(scenario.planDetails.name).toBe(d['planDetails.name']);
    expect(scenario.stressTool.settings).toEqual(d['stressTool.settings']);
    expect(scenario.decisionTool.settings).toEqual(d['decisionTool.settings']);
    expect(scenario.decisionTool.history).toEqual(d['decisionTool.history']);
    expect(scenario.decisionTool.taxYears).toEqual(d['decisionTool.taxYears']);
    expect(scenario.budgetTool).toEqual(d.budgetTool);   // an untouched root key travels
    expect(scenario.strategy).toEqual(d.strategy);
  });
  it('09 and 10 are a couple: each names the other as its household partner', () => {
    const a = load('09-couple-a.json'), b = load('10-couple-b.json');
    expect(a.household.partnerScenarioId).toBe(b.id);
    expect(b.household.partnerScenarioId).toBe(a.id);
    expect([a.isActive, b.isActive].filter(Boolean).length).toBe(1);
  });
  it('11 is the guest demo plan', () => {
    const d = load('11-guest-demo.json');
    expect(d.id.startsWith('guest-')).toBe(true);
    expect(d.enabledTools).toContain('household');
    expect(d.stressTool.settings.configured).toBe(true);
  });
  it('12 has windfalls, extra incomes, a DB pension, one-off spends and a GIA', () => {
    const s = load('12-lumpy-db-gia.json').stressTool.settings;
    expect(s.windfalls.length).toBeGreaterThanOrEqual(2);
    expect(s.extraIncomes.length).toBeGreaterThanOrEqual(2);
    expect(s.extraWithdrawals.length).toBeGreaterThanOrEqual(1);
    expect(s.dbAmount).toBeGreaterThan(0);
    expect(s.taxableStart).toBeGreaterThan(0);
  });
  it('at least four fixtures are locked, so check (3) is exercised on more than one shape', () => {
    expect(names.filter((n) => snapshot.plans[n].locked).length).toBeGreaterThanOrEqual(4);
  });
});

describe.each(names)('plan corpus — %s', (n) => {
  it('(1) survives normalizeScenario and a second pass changes nothing', () => {
    expect(failures(n, 1)).toEqual([]);
  });
  it('(2) builds a sim config and one strategy evaluation runs clean (no NaN / undefined in the headline)', () => {
    expect(failures(n, 2)).toEqual([]);
    expect(run.plans[n].record.headline).not.toBeNull();
  });
  it('(3) a locked plan keeps its checksum, its records and a byte-identical plan document across normalise + load migrations', () => {
    expect(failures(n, 3)).toEqual([]);
  });
  it('(4) holdings normalise without loss', () => {
    expect(failures(n, 4)).toEqual([]);
  });
  it('matches the committed snapshot (checksum + headline) — regenerate with build.mjs only for an explained change', () => {
    // Exact, except simulated money (within £1 or one part in a million) — see recordDiffs for why and why not rounding.
    expect(recordDiffs(run.plans[n].record, snapshot.plans[n])).toEqual([]);
  });
});

// The same plan, the same instant, another time zone: the same answers, to the last digit (same machine, so no
// tolerance). Until 6.13.4 these differed by £1–£15 — State Pension first-year shares and gilt maturities were
// measured in milliseconds between LOCAL dates, which are an hour out across a clock change. One plan of each
// kind that was affected: a pot strategy with a State Pension date, the gilt ladder, a saver whose age was
// recorded on a date, a legacy plan with no timing, and gilt rotation.
describe('plan corpus — the time zone does not move an answer', () => {
  const some = ['02-pnv-draft', '03-gilt-ladder-runup', '05-saver-committed', '06-pre-6.4-no-timing', '07-pre-6.13-flat-params'];
  const zones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Pacific/Auckland'];   // New York added 1 Oct 2026 (the plan-seed time-zone review)
  const byZone = {};
  beforeAll(() => {
    const dir = mkdtempSync(join(tmpdir(), 'plan-corpus-tz-'));
    try {
      for (const z of zones) {
        const out = join(dir, 'out.json');
        execFileSync(process.execPath, [join(PLANS_DIR, 'run.mjs'), '--now', snapshot.corpusNow, '--out', out, ...some.map((n) => join(PLANS_DIR, n + '.json'))], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, CORPUS_TZ: z } });
        byZone[z] = JSON.parse(readFileSync(out, 'utf8'));
      }
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 180000);
  it.each(zones)('%s gives exactly the Europe/London answers', (z) => {
    for (const n of some) expect(byZone[z].plans[n].record, n).toEqual(run.plans[n].record);
  });
});

describe('plan corpus — the comparison with the snapshot', () => {
  const rec = () => JSON.parse(JSON.stringify(snapshot.plans['02-pnv-draft']));
  it('an identical record has no differences', () => {
    expect(recordDiffs(rec(), snapshot.plans['02-pnv-draft'])).toEqual([]);
  });
  it('tolerates a last-bit rounding flip on simulated money: £1, or one part in a million on a large figure', () => {
    const r = rec();
    r.headline.terminalP50 += 1; r.headline.terminalP10 -= 1; r.headline.cone.wealthP50[2] += 1;
    r.headline.terminalP90 = Math.round(r.headline.terminalP90 * (1 + 0.9e-6));
    r.headline.coverage = Math.round((r.headline.coverage - 0.01) * 100) / 100;
    expect(recordDiffs(r, snapshot.plans['02-pnv-draft'])).toEqual([]);
  });
  it('does NOT tolerate a real change: £2 on a cone, a ruin rate, a checksum, a stage, a lost key', () => {
    const pin = snapshot.plans['02-pnv-draft'];
    const one = (mut) => { const r = rec(); mut(r); return recordDiffs(r, pin).length; };
    expect(pin.headline.terminalP50).toBeLessThan(1e6);   // so £2 is outside the relative tolerance too
    expect(one((r) => { r.headline.terminalP50 += 2; })).toBe(1);
    expect(one((r) => { r.headline.cone.wealthP10[1] -= 2; })).toBe(1);
    expect(one((r) => { r.headline.terminalP90 = Math.round(r.headline.terminalP90 * 1.00001); })).toBe(1);
    expect(one((r) => { r.headline.coverage -= 0.03; })).toBe(1);
    expect(one((r) => { r.headline.ruinMc += 0.1; })).toBe(1);
    expect(one((r) => { r.headline.ruinHist += 0.01; })).toBe(1);
    expect(one((r) => { r.decisionChecksum += 'x'; })).toBe(1);
    expect(one((r) => { r.stressChecksum = '0'; })).toBe(1);
    expect(one((r) => { r.stage = 'running'; })).toBe(1);
    expect(one((r) => { r.startAge += 1; })).toBe(1);
    expect(one((r) => { r.holdings.total += 0.01; })).toBe(1);
    expect(one((r) => { delete r.headline.spentMedian; })).toBe(1);
    expect(one((r) => { r.headline.cone.years.pop(); })).toBe(1);
    expect(one((r) => { r.headline = null; })).toBe(1);
  });
});
