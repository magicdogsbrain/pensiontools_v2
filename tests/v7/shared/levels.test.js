/**
 * 7.8.0 step 2: the levels, the one test (`passes`), the verdict at a level, the weights of the futures (weigh.js), the
 * two ages as default rules, the "How careful?" and sex fields, and old level values read by validate.js.
 *
 * Ships with SUCCESS.weighted false: every weight is one whole future and every default the rule before 7.8.0 (the rest
 * of the suite holds every figure byte for byte). The weighted path is reached here through env.weighted (tests only).
 * All people are fictional.
 */
import { describe, it, expect } from 'vitest';
import {
  SUCCESS, LEVEL_FAILS20, LEVELS, LEVEL_DEFAULT, LEVEL_LINES, LEGACY_LEVEL, levelOf, WEIGHT_ONE, passes, verdictAtLevel,
  legacyVerdictOf, LEGACY_VERDICT, BAND
} from '../../../src/answers/shared/rules.js';
import { weigherOf, weightOf, weightedFails, weightedChance, failsBound, levelT, lifePeopleOf } from '../../../src/answers/shared/weigh.js';
import { levelField, sexField, horizonEndAge, weightToAge, drawingStartFromValues } from '../../../src/answers/shared/schemaParts.js';
import { defaults, parseDraft, checkInputs, draftTextOf } from '../../../src/answers/shared/validate.js';
import { defaultEndAge } from '../../../src/answers/d/schema.js';
import { LIFE_TABLE, survival, jointSurvival } from '../../../src/services/LongevityModel.js';

const TODAY = '2026-11-11';
const ON = { today: TODAY, weighted: true };
const OFF = { today: TODAY, weighted: false };

/** A table in LongevityModel's shape with one year of birth (so birth year never matters) and these q from `from`. */
function toyTable(from, qs, ageTo = from + qs.length - 1) {
  const line = [from, ...qs.map((q) => Math.round(q * 1e7))];
  return { scale: 1e7, firstBirthYear: 1960, lastBirthYear: 1960, ageTo, m: { 1960: line }, f: { 1960: line } };
}
/** Nobody dies: q = 0 at every age to 200. */
const IMMORTAL = toyTable(18, [0], 200);
/** Three ages of dying: 10% at 70, 20% at 71, half at 72 (then everyone within the year at 73); nobody before 70. */
const THREE = toyTable(60, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.5]);

/** An engine plan as weigh.js reads one (enginePlan's own fields). */
const planOf = (people, { d = 0, years = 30, endAge = null } = {}) => ({
  people: people.map((age, j) => ({ who: j ? 'partner' : 'you', ageToday: age })),
  yearsFromNow: d, years, endAge: endAge ?? Math.min(...people) + d + years, today: TODAY
});

describe('the levels', () => {
  it('Careful 19 in 20, Balanced 18 in 20 (the default), Bold 14 in 20, in whole twentieths; the lines the words keep to', () => {
    expect(LEVEL_FAILS20).toEqual({ careful: 1, balanced: 2, bold: 6 });
    for (const t of Object.values(LEVEL_FAILS20)) expect(Number.isInteger(t)).toBe(true);
    expect(LEVELS).toEqual({ careful: 0.95, balanced: 0.9, bold: 0.7 });
    expect(LEVEL_DEFAULT).toBe('balanced');
    expect(LEVEL_LINES).toEqual([0.95, 0.90, 0.85, 0.70, 0.65]);
    expect(BAND).toEqual({ careful: 0.9, middling: 0.5, good: 0.1 });          // the spread, unchanged
    expect(levelT('bold')).toBe(6);
  });
  it('levelOf: a level as it is; old values typed (a URL, a draft) and stored (a seed, a plan) read differently', () => {
    for (const k of ['careful', 'balanced', 'bold']) { expect(levelOf(k)).toBe(k); expect(levelOf(k, { stored: true })).toBe(k); }
    expect(levelOf('nineInTen')).toBe('careful');
    expect(levelOf('threeInFour')).toBe('balanced');
    expect(levelOf('nineInTen', { stored: true })).toBe('balanced');      // B stored it for everyone by default
    expect(levelOf('threeInFour', { stored: true })).toBe('balanced');
    for (const v of [undefined, null, '', 'junk', 'toString', 3]) expect(levelOf(v)).toBe('balanced');
    expect(LEGACY_LEVEL.typed).toEqual({ nineInTen: 'careful', threeInFour: 'balanced' });
  });
});

describe('passes: the one test, in whole numbers', () => {
  it.each([1000, 200, 10])('n = %i: exactly floor(t·n/20) whole failures pass, one more does not, at each level', (n) => {
    for (const t of Object.values(LEVEL_FAILS20)) {
      const k = failsBound(n, t);
      expect(k).toBe(Math.floor((t * n) / 20));
      expect(passes(k * WEIGHT_ONE, n, t)).toBe(true);
      expect(passes((k + 1) * WEIGHT_ONE, n, t)).toBe(false);
      // a part of a future more than the line fails; the line itself passes
      expect(passes((t * n * WEIGHT_ONE) / 20, n, t)).toBe(Number.isInteger((t * n * WEIGHT_ONE) / 20));
    }
  });
  it.each([1000, 200, 10])('n = %i, the immortal table: the weighted verdict at each level is yes / close / no at the counts', (n) => {
    const w = weigherOf(planOf([66], { years: 30 }), {}, { ...ON, lifeTable: IMMORTAL });
    for (const m of [0, 1, 12, 359, 360]) expect(weightOf(w, m)).toBe(WEIGHT_ONE);
    for (const [level, t] of Object.entries(LEVEL_FAILS20)) {
      const months = (fails) => Array.from({ length: n }, (_, i) => (i < fails ? 7 * i : null));
      const sum = (fails) => weightedFails(w, months(fails));
      expect(verdictAtLevel(sum(failsBound(n, t)), n, level, true)).toBe('yes');
      if (failsBound(n, t + 1) > failsBound(n, t)) expect(verdictAtLevel(sum(failsBound(n, t) + 1), n, level, true)).toBe('close');
      expect(verdictAtLevel(sum(failsBound(n, t + 1)), n, level, true)).toBe(failsBound(n, t + 1) > failsBound(n, t) ? 'close' : 'yes');
      expect(verdictAtLevel(sum(failsBound(n, t + 1) + 1), n, level, true)).toBe('no');
    }
  });
  it('not weighing (the rollback): the verdict at any level is the verdict before 7.8.0 on the count', () => {
    expect(SUCCESS.weighted === true || SUCCESS.weighted === false).toBe(true);
    expect(LEGACY_VERDICT).toEqual({ yes: 0.10, close: 0.25 });
    for (const n of [1000, 200, 10, 40]) {
      for (let fails = 0; fails <= n; fails += Math.max(1, Math.floor(n / 50))) {
        for (const level of ['careful', 'balanced', 'bold']) expect(verdictAtLevel(fails * WEIGHT_ONE, n, level, false)).toBe(legacyVerdictOf(fails, n));
      }
    }
    // Balanced at the count is the "yes" before 7.8.0: floor(2n/20) = floor(n/10)
    for (const n of [1000, 200, 10, 40, 37]) expect(failsBound(n, LEVEL_FAILS20.balanced)).toBe(Math.floor(n * LEGACY_VERDICT.yes));
  });
});

describe('weigh.js: the weights of the futures', () => {
  it('a toy table with three ages of dying: byMonth is round(S × 2^30), every entry a whole number', () => {
    const w = weigherOf(planOf([70], { years: 4 }), {}, { ...ON, lifeTable: THREE });
    expect(w.byMonth.length).toBe(4 * 12 + 1);
    const S = (m) => {
      const t = m / 12;
      if (t <= 1) return 1 - t * 0.1;
      if (t <= 2) return 0.9 * (1 - (t - 1) * 0.2);
      if (t <= 3) return 0.9 * 0.8 * (1 - (t - 2) * 0.5);
      return 0.36 * (1 - (t - 3));                                     // past the table's last age, q = 1: gone within the year
    };
    for (let m = 0; m <= 48; m++) {
      expect(Number.isInteger(w.byMonth[m]), `month ${m}`).toBe(true);
      expect(Math.abs(w.byMonth[m] - S(m) * WEIGHT_ONE), `month ${m}`).toBeLessThanOrEqual(1);
    }
    expect(w.byMonth[0]).toBe(WEIGHT_ONE);
    expect(w.byMonth[48]).toBe(0);
    expect(w.byMonth[36]).toBe(Math.round(0.36 * WEIGHT_ONE));
  });
  it('the real table: a man of 66 drawing now — the weights fall with the month; plan to 97, followed on to 101', () => {
    const w = weigherOf(planOf([66], { years: 35 }), { you: { sex: 'male' } }, ON);
    expect(lifePeopleOf(planOf([66]), { you: { sex: 'male' } }, TODAY)).toEqual([{ who: 'you', age: 66, by: 1960, sex: 'm' }]);
    for (let m = 1; m <= w.months; m++) expect(w.byMonth[m] <= w.byMonth[m - 1]).toBe(true);
    for (const m of [0, 7, 120, 360, 420]) expect(w.byMonth[m]).toBe(Math.round(survival(66, 1960, 'm', m / 12) * WEIGHT_ONE));
    expect([w.planToAge, w.weightToAge]).toEqual([97, 101]);
    // not said reads the women's figures
    expect(Array.from(weigherOf(planOf([66], { years: 35 }), { you: { sex: 'notSaid' } }, ON).byMonth))
      .toEqual(Array.from(weigherOf(planOf([66], { years: 35 }), { you: { sex: 'female' } }, ON).byMonth));
    expect(Array.from(weigherOf(planOf([66], { years: 35 }), {}, ON).byMonth))
      .toEqual(Array.from(weigherOf(planOf([66], { years: 35 }), { you: { sex: 'female' } }, ON).byMonth));
  });
  it('a couple: at least one alive, each at their own age and sex; never below either alone', () => {
    const inputs = { you: { sex: 'male' }, partner: { sex: 'female' } };
    const w = weigherOf(planOf([66, 63], { years: 40 }), inputs, ON);
    const a = weigherOf(planOf([66], { years: 40 }), { you: { sex: 'male' } }, ON);
    for (const m of [12, 240, 400]) {
      expect(w.byMonth[m]).toBe(Math.round(jointSurvival([{ age: 66, by: 1960, sex: 'm' }, { age: 63, by: 1963, sex: 'f' }], m / 12) * WEIGHT_ONE));
      expect(w.byMonth[m]).toBeGreaterThanOrEqual(a.byMonth[m]);
    }
  });
  it('conditioned on the drawing start: the same person at 40 stopping in 20 years and at 60 stopping now weigh alike', () => {
    const at40 = weigherOf(planOf([40], { d: 20, years: 14 }), {}, { ...ON, lifeTable: THREE });
    const at60 = weigherOf(planOf([60], { d: 0, years: 14 }), {}, { ...ON, lifeTable: THREE });
    expect(Array.from(at40.byMonth)).toEqual(Array.from(at60.byMonth));
    expect([at40.planToAge, at40.weightToAge]).toEqual([at60.planToAge, at60.weightToAge]);
    expect(at40.byMonth[0]).toBe(WEIGHT_ONE);                          // dying before the money is drawn never counts
  });
  it('the sums: a future that lasted adds nothing, one with no month adds a whole future; the chance', () => {
    const w = weigherOf(planOf([70], { years: 4 }), {}, { ...ON, lifeTable: THREE });
    expect(weightOf(w, null)).toBe(0);
    expect(weightOf(w, NaN)).toBe(WEIGHT_ONE);
    expect(weightOf(w, 9999)).toBe(w.byMonth[48]);
    const months = [null, 0, 12, 24, null];
    expect(weightedFails(w, months)).toBe(w.byMonth[0] + w.byMonth[12] + w.byMonth[24]);
    expect(weightedChance(w, months)).toBeCloseTo(1 - (1 + 0.9 + 0.72) / 5, 8);
    expect(weightedChance(w, [null, null])).toBe(1);
  });
  it('the rollback: not weighing, every weight is one whole future and the ages are the run\'s end', () => {
    for (const env of [OFF, { today: TODAY }]) {
      if (env.weighted === undefined && SUCCESS.weighted) continue;
      const w = weigherOf(planOf([66], { years: 29, endAge: 95 }), { you: { sex: 'male' } }, env);
      expect(w.weighted).toBe(false);
      expect(w.byMonth.every((v) => v === WEIGHT_ONE)).toBe(true);
      expect([w.planToAge, w.weightToAge]).toEqual([95, 95]);
      const months = [null, 3, 100, null, 340];
      expect(weightedFails(w, months)).toBe(3 * WEIGHT_ONE);
    }
  });
});

describe('the two ages as the end age\'s default rule', () => {
  it('not weighing: the rule before 7.8.0 exactly — 95, and D\'s later of 95 and the younger person\'s age + 5', () => {
    for (let age = 18; age <= 100; age++) {
      for (const partner of [undefined, 18, 60, 100]) {
        const couple = partner !== undefined ? { household: 'couple', 'partner.age': partner } : { household: 'single' };
        const d = { stopped: 'yes', 'you.age': age, ...couple };
        expect(horizonEndAge(d, OFF)).toBe(defaultEndAge(d));
        expect(weightToAge(d, OFF)).toBe(defaultEndAge(d));
        for (const abc of [{ 'you.age': age, ...couple }, { 'you.age': age, 'stop.age': 75, ...couple }, { 'you.age': age, 'start.kind': 'age', 'start.age': 100, ...couple }]) {
          expect(horizonEndAge(abc, OFF)).toBe(95);
        }
      }
    }
    expect(horizonEndAge({}, OFF)).toBe(95);
    if (!SUCCESS.weighted) expect(horizonEndAge({ stopped: 'yes', 'you.age': 93 }, { today: TODAY })).toBe(98);
  });
  it('weighing: the plan-to age by age and sex, from the drawing start; the weighting age after it', () => {
    expect(horizonEndAge({ stopped: 'yes', 'you.age': 66, 'you.sex': 'male' }, ON)).toBe(97);
    expect(horizonEndAge({ stopped: 'yes', 'you.age': 66, 'you.sex': 'female' }, ON)).toBe(99);
    expect(horizonEndAge({ stopped: 'yes', 'you.age': 66 }, ON)).toBe(99);
    expect(weightToAge({ stopped: 'yes', 'you.age': 66, 'you.sex': 'male' }, ON)).toBe(101);
    expect(weightToAge({ stopped: 'yes', 'you.age': 66 }, { ...ON, weightToAge: 95 })).toBe(95);
    // A and B: from the first stop; C: from the start
    expect(drawingStartFromValues({ 'you.age': 40, 'stop.age': 60 })).toBe(20);
    expect(drawingStartFromValues({ 'you.age': 40, 'stop.age': 60, household: 'couple', 'partner.age': 45, 'partner.stop.kind': 'age', 'partner.stop.age': 55 })).toBe(10);
    expect(drawingStartFromValues({ 'you.age': 50, 'start.kind': 'age', 'start.age': 57 })).toBe(7);
    expect(drawingStartFromValues({ 'you.age': 50, 'start.kind': 'now' })).toBe(0);
    expect(drawingStartFromValues({ stopped: 'yes', 'you.age': 70 })).toBe(0);
    // conditioned on the start: with a table that ignores the year of birth, 40 stopping at 60 plans to 60's age
    const toy = { ...ON, lifeTable: THREE };
    expect(horizonEndAge({ 'you.age': 40, 'stop.age': 60 }, toy)).toBe(horizonEndAge({ 'you.age': 60, 'stop.age': 60 }, toy));
    // at least 5 years after the start
    expect(horizonEndAge({ 'you.age': 18, 'start.kind': 'age', 'start.age': 100 }, ON)).toBeGreaterThanOrEqual(105);
  });
});

describe('"How careful?" and which figures to use: the fields, their order, and old values', () => {
  const SCHEMA = {
    id: 'levels-test',
    fields: [
      { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
      { path: 'you.age', type: 'age', min: 18, max: 100, required: true, group: 'you' },
      { path: 'partner.age', type: 'age', min: 18, max: 100, required: true, group: 'partner', when: { household: 'couple' } },
      { path: 'stopped', type: 'choice', options: ['yes'], default: 'yes', group: 'you' },
      sexField('you'), sexField('partner'), levelField(),
      { path: 'endAge', type: 'age', min: 75, max: 105, default: { rule: 'endAge' }, group: 'more' }
    ],
    rules: [],
    defaultRules: { endAge: horizonEndAge }
  };
  it('the fields: Careful / Balanced / Bold with Balanced the default; not said / women / men with not said the default', () => {
    expect(levelField()).toEqual({ path: 'confidence', type: 'choice', options: ['careful', 'balanced', 'bold'], default: 'balanced',
      legacy: { nineInTen: 'careful', threeInFour: 'balanced' }, group: 'more' });
    expect(sexField('you')).toEqual({ path: 'you.sex', type: 'choice', options: ['notSaid', 'female', 'male'], default: 'notSaid', group: 'more' });
    expect(sexField('partner')).toEqual({ path: 'partner.sex', type: 'choice', options: ['notSaid', 'female', 'male'], default: 'notSaid', group: 'more',
      when: { household: 'couple' } });
  });
  it('declared ahead of the end age, the end age\'s default reads the sex given; declared after, it could not', () => {
    const male = parseDraft(SCHEMA, { 'you.age': '66', 'you.sex': 'male' }, ON);
    const female = parseDraft(SCHEMA, { 'you.age': '66', 'you.sex': 'female' }, ON);
    const none = parseDraft(SCHEMA, { 'you.age': '66' }, ON);
    expect([male.inputs.endAge, female.inputs.endAge, none.inputs.endAge]).toEqual([97, 99, 99]);
    expect(none.inputs.you.sex).toBe('notSaid');
    expect(none.inputs.confidence).toBe('balanced');
    expect(defaults(SCHEMA, { 'you.age': 66, 'you.sex': 'male' }, ON).endAge).toBe(97);
    const after = { ...SCHEMA, fields: [...SCHEMA.fields.filter((f) => f.path !== 'you.sex'), sexField('you')] };
    expect(parseDraft(after, { 'you.age': '66', 'you.sex': 'male' }, ON).inputs.endAge).toBe(99);
    // a couple: the partner's own
    const couple = parseDraft(SCHEMA, { household: 'couple', 'you.age': '66', 'partner.age': '63', 'you.sex': 'male', 'partner.sex': 'female' }, ON);
    expect(couple.inputs.partner.sex).toBe('female');
    expect(parseDraft(SCHEMA, { 'you.age': '66', 'partner.sex': 'male' }, ON).inputs.partner).toBe(undefined);
    // not weighing: the rule before 7.8.0, whatever the sex
    expect(parseDraft(SCHEMA, { 'you.age': '66', 'you.sex': 'male' }, OFF).inputs.endAge).toBe(95);
  });
  it('old values read: typed "9 in 10" is Careful and "3 in 4" Balanced, as text or as values; nothing else that is not an option', () => {
    for (const [given, want] of [['nineInTen', 'careful'], ['threeInFour', 'balanced'], ['careful', 'careful'], ['bold', 'bold']]) {
      expect(parseDraft(SCHEMA, { 'you.age': '66', confidence: given }, ON).inputs.confidence).toBe(want);
      expect(checkInputs(SCHEMA, { you: { age: 66 }, confidence: given }, ON).inputs.confidence).toBe(want);
    }
    expect(parseDraft(SCHEMA, { 'you.age': '66', confidence: 'nineInTenX' }, ON).errors).toEqual({ confidence: 'notAnOption' });
    expect(checkInputs(SCHEMA, { you: { age: 66 }, confidence: 'toString' }, ON).errors).toEqual({ confidence: 'notAnOption' });
    expect(parseDraft(SCHEMA, { 'you.age': '66', 'you.sex': 'nineInTen' }, ON).errors).toEqual({ 'you.sex': 'notAnOption' });
    // and back to text: the level as it now reads
    const r = checkInputs(SCHEMA, { you: { age: 66 }, confidence: 'nineInTen' }, ON);
    expect(draftTextOf(SCHEMA, r.inputs).confidence).toBe('careful');
    // stored values go through levelOf first: a seed's "9 in 10" is Balanced
    expect(checkInputs(SCHEMA, { you: { age: 66 }, confidence: levelOf('nineInTen', { stored: true }) }, ON).inputs.confidence).toBe('balanced');
  });
  it('the table the weights read is the 2024-based one', () => {
    expect(LIFE_TABLE.tablesVersion).toBe('ons-ew-2024-cohort/1');
  });
});
