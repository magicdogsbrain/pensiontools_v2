/**
 * The timing of plans made from V7 answers, in one time zone (CORPUS_TZ), on a pinned day: 1 Oct 2026, 15:00 LOCAL.
 *
 *   CORPUS_TZ=America/New_York node tests/fixtures/tz/seedTiming.mjs <out.json>
 *
 * tests/planSeed.timezone.test.js runs it in several zones and holds every answer equal to Europe/London's (a vitest
 * worker cannot change its own zone). Found 1 Oct 2026: west of Greenwich PlanTiming read the 'YYYY-MM-DD' day an age
 * was recorded as midnight UTC — the evening before — and every plan made from a seed (whose birthday IS that day)
 * started a tax year early, its State Pension and final-salary pension a year out.
 *
 * Output: { zone, cases: { name: record } } where a record holds what the planner works out from the plan: the start
 * year and age (as saved, and as worked out again on load), the age today, and the engine config's State Pension year,
 * final-salary year, years run, starting pots and first twelve years of target.
 */
import { at } from '../plans/clock.mjs';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = process.argv[2];
if (!out) { process.stderr.write('usage: seedTiming.mjs <out.json>\n'); process.exit(2); }
at(new Date(2026, 9, 1, 15, 0).toISOString());   // 15:00 on 1 Oct 2026 in THIS zone (Date with arguments is the real one)

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '../../..');
const { deriveTiming, ageOnDate } = await import('../../../src/services/PlanTiming.js');
const { seedToScenario } = await import('../../../src/services/PlanSeed.js');
const { createSimulationConfigFromSettings } = await import('../../../src/storage/StressRepository.js');
const { ALL_SEEDS } = await import('../../integration/fixtures/planSeeds.js');
const { buildPlanSeed } = await import('../../../src/answers/keep/planSeed.js');

const now = () => new Date();
const timing = (S) => {
  const t = deriveTiming(S, now());
  const cfg = createSimulationConfigFromSettings({}, S);
  const pick = (k) => (cfg[k] === undefined ? null : cfg[k]);
  return {
    saved: { firstTaxYear: S.firstTaxYear, shapeAgeNow: S.shapeAgeNow },
    loaded: { mode: t.mode, firstTaxYear: t.firstTaxYear, shapeAgeNow: t.shapeAgeNow, currentAge: t.currentAge },
    ageToday: ageOnDate(S, now(), now()),
    cfg: { years: pick('years'), spStartYear: pick('spStartYear'), spFirstYearRatio: pick('spFirstYearRatio'), dbStartYear: pick('dbStartYear'),
      pots: Math.round(cfg.equityStart + cfg.bondStart + cfg.cashStart), isa: Math.round(cfg.isaBalance),
      target: Array.isArray(cfg.targetSchedule) ? cfg.targetSchedule.slice(0, 12).map(Math.round) : Math.round(cfg.baseSalary || 0) }
  };
};
const cases = {};
const plans = (name, seed) => {
  const { yours, partner } = seedToScenario(seed, now());
  cases[name + ' (yours)'] = timing(yours.stressTool.settings);
  if (partner) cases[name + ' (partner)'] = timing(partner.stressTool.settings);
};

// The smallest case: an age recorded today, the State Pension date on the same day and month (today's own plans can
// hit this too — a State Pension date that falls on the day the age was entered).
cases['minimal: age 55 today, State Pension 1 Oct 2038, stop at 67'] = timing({ currentAge: 55, currentAgeAsOf: '2026-10-01', spStartDate: '2038-10-01', retired: false, retireAge: 67, equityMin: 1, bondMin: 0, cashTarget: 0 });
cases['no State Pension date: the birthday is the day the age was recorded'] = timing({ currentAge: 62, currentAgeAsOf: '2026-10-01', retired: false, retireAge: 64, equityMin: 1, bondMin: 0, cashTarget: 0 });
cases['taking money now at 62, aged on 1 Oct'] = timing({ currentAge: 62, currentAgeAsOf: '2026-10-01', retired: true, firstTaxYear: 2026, spStartDate: '2031-10-01', spWeeklyAmount: 241.3, equityMin: 1, bondMin: 0, cashTarget: 0 });

// The hand-written seeds (tests/integration/fixtures/planSeeds.js), dated today.
for (const [name, f] of Object.entries(ALL_SEEDS)) plans(name, { ...f(), today: '2026-10-01' });

// V7's own seeds, from its pinned answers (buildPlanSeed), re-dated to today.
const STATES = join(REPO, 'tests/v7/states');
for (const q of ['c', 'a', 'b']) {
  const dir = join(STATES, q);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => /^answer-.*\.json$/.test(f)).sort()) {
    const state = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    const result = state.answers && state.answers[q] && state.answers[q].result;
    const seed = result ? buildPlanSeed({ source: q, result, env: { today: '2026-10-01', appVersion: 'tz' }, name: { chosen: 'Zone' }, createdAt: '2026-10-01T12:00:00.000Z' }) : null;
    if (seed) plans(q + '/' + file.replace(/\.json$/, ''), seed);
  }
}

writeFileSync(out, JSON.stringify({ zone: process.env.TZ, cases }));
process.exit(0);   // firebase keeps handles open
