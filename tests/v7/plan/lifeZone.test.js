/**
 * The person's age and year of birth, as the life tables read them, count calendar days: the same in every time zone.
 *
 * Worked by hand (fictional Pat, 66 on 1 March 2026, read on 30 September 2026):
 *   days from 1 January to 30 September 2026 = 31+28+31+30+31+30+31+31 + 29 = 272, of a 365-day year
 *     → the decimal year of the day = 2026 + 272/365
 *   days from the birthday (1 March) to 30 September = 31+30+31+30+31+31 + 29 = 213, of the 365 days to 1 March 2027
 *     → the age today = 66 + 213/365 = 66.583561643...
 *   year of birth as the tables read it = 2026 + 272/365 − (66 + 213/365) = 1960 + 59/365 = 1960.161643835...
 * Counting milliseconds between local dates instead adds the spring clock change's lost hour in London and New York
 * (both spans cross late March), so the age came out 1/8,760 of a day short there and the weighted chance moved in its
 * 7th digit with the zone the plan was read in.
 */
import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const LIFE = resolve(process.cwd(), 'src/answers/plan/life.js');
const SETTINGS = { currentAge: 66, currentAgeAsOf: '2026-03-01' };

function readIn(TZ) {
  const code = `import { lifeOfSettings } from '${LIFE}';
    const l = lifeOfSettings(${JSON.stringify(SETTINGS)}, new Date(2026, 8, 30), { sex: 'f' });
    process.stdout.write(JSON.stringify({ ageNow: l.ageNow, by: l.by, planToAge: l.planToAge, weightToAge: l.weightToAge }));`;
  return JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ } }).toString());
}

describe('the life tables read the age in calendar days', () => {
  const zones = ['UTC', 'Europe/London', 'America/New_York', 'Australia/Sydney'];
  const read = Object.fromEntries(zones.map((z) => [z, readIn(z)]));

  it('Pat on 30 September 2026: age 66 + 213/365, born 1960 + 59/365', () => {
    expect(read.UTC.ageNow).toBeCloseTo(66 + 213 / 365, 12);
    expect(read.UTC.by).toBeCloseTo(1960 + 59 / 365, 9);
  });

  // The plan's day arrives at noon (plan/dates.js dateOf). The time of day is no part of the age: on the birthday itself
  // (here 1 March 2027, a year on) the age is the whole 67, not 67 and half a day (which moved one weighting age 103 → 104).
  it('the time of day is no part of the age: at noon on the birthday the age is whole', () => {
    const code = `import { lifeOfSettings } from '${LIFE}';
      const a = lifeOfSettings(${JSON.stringify(SETTINGS)}, new Date(2027, 2, 1, 12), { sex: 'f' });
      const b = lifeOfSettings(${JSON.stringify(SETTINGS)}, new Date(2026, 8, 30, 12), { sex: 'f' });
      process.stdout.write(JSON.stringify([a.ageNow, b.ageNow]));`;
    const [onBirthday, onDay] = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ: 'Europe/London' } }).toString());
    expect(onBirthday).toBe(67);
    expect(onDay).toBe(read.UTC.ageNow);
  });

  for (const z of zones.slice(1)) {
    it(`is the same to the last bit in ${z} as in UTC`, () => {
      expect(read[z]).toEqual(read.UTC);
    });
  }
});
