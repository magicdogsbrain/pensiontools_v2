/**
 * The same plans, the same local day, other time zones: the same start years, ages, State Pension and final-salary
 * years and targets (review, 1 Oct 2026). West of Greenwich PlanTiming read `currentAgeAsOf` ('YYYY-MM-DD') as midnight
 * UTC — the evening before — so a birthday on the day the age was recorded counted as a new one: every plan made from a
 * V7 answer (whose birthday IS seed.today) started a tax year early there, and a "taking money now" plan made the
 * person a year older. The fix reads the day as a local date, as parseStatePensionDate does.
 *
 * Each zone is a plain Node process (tests/fixtures/tz/seedTiming.mjs): a vitest worker cannot change its own zone.
 * The plan corpus holds today's own saved plans equal across zones the same way (tests/planCorpus.test.js).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), 'tests/fixtures/tz/seedTiming.mjs');
const ZONES = ['Europe/London', 'UTC', 'America/New_York', 'America/Toronto', 'America/Los_Angeles', 'Pacific/Auckland', 'Asia/Kolkata'];
const byZone = {};

beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'seed-tz-'));
  try {
    for (const z of ZONES) {
      const out = join(dir, 'out.json');
      execFileSync(process.execPath, [SCRIPT, out], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, CORPUS_TZ: z } });
      byZone[z] = JSON.parse(readFileSync(out, 'utf8'));
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 180000);

describe('plans made from V7 answers: the time zone does not move a year', () => {
  it('each run really was in its zone, and covered the cases', () => {
    for (const z of ZONES) expect(byZone[z].zone).toBe(z);
    expect(Object.keys(byZone['Europe/London'].cases).length).toBeGreaterThanOrEqual(20);
  });
  it('the answers in London are the right ones', () => {
    const c = byZone['Europe/London'].cases;
    expect(c['minimal: age 55 today, State Pension 1 Oct 2038, stop at 67'].loaded).toEqual({ mode: 'future', firstTaxYear: 2038, shapeAgeNow: 67, currentAge: 55 });
    expect(c['no State Pension date: the birthday is the day the age was recorded'].loaded).toMatchObject({ firstTaxYear: 2028, shapeAgeNow: 64, currentAge: 62 });
    expect(c['taking money now at 62, aged on 1 Oct'].loaded).toMatchObject({ firstTaxYear: 2026, shapeAgeNow: 62, currentAge: 62 });
    expect(c['seedA (yours)'].loaded).toEqual({ mode: 'future', firstTaxYear: 2030, shapeAgeNow: 60, currentAge: 56 });
    expect(c['seedA (yours)'].saved).toEqual({ firstTaxYear: 2030, shapeAgeNow: 60 });
    expect(c['seedCNow (yours)'].loaded).toMatchObject({ mode: 'retired', firstTaxYear: 2026, shapeAgeNow: 62, currentAge: 62 });
  });
  it.each(ZONES.filter((z) => z !== 'Europe/London'))('%s gives exactly the London answers', (z) => {
    const london = byZone['Europe/London'].cases;
    for (const [name, rec] of Object.entries(byZone[z].cases)) expect(rec, name).toEqual(london[name]);
  });
});
