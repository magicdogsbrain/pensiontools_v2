/**
 * 7.8.0: the runs followed on to the weighting age, the shortfall lines, and the words of the chance the money lasts as
 * long as you do on A, B, C and D (research/v7/replan-nov-2026.md 5; the build spec's sections 1, 4, 10 and 11). The
 * weighted path is asked for with env.weighted (the shipped flag is SUCCESS.weighted). Fictional households only.
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { shortfallOf, floorAtYear } from '../../../src/answers/shared/shortfall.js';
import { runToAgeOf } from '../../../src/answers/shared/weigh.js';
import { lifeAssumed, fixedAgeParts, boldParts } from '../../../src/answers/shared/lastsWords.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { grossToNet } from '../../../src/services/TaxCalculator.js';
import { BANDS } from '../../../src/answers/shared/toEngine.js';
import { RULES } from '../../../src/answers/shared/rules.js';

const ENV = { today: '2026-11-11', futures: 100, seed: 0, weighted: true };
const OFF = { ...ENV, weighted: false };
const IMMORTAL = { scale: 1e7, firstBirthYear: 1960, lastBirthYear: 1960, ageTo: 200, tablesVersion: 'test-immortal', m: { 1960: [18, 0] }, f: { 1960: [18, 0] } };
const ALEX_C = { you: { pot: 400000, age: 66 } };
const SAM_C = { household: 'couple', you: { pot: 300000, age: 66 }, partner: { age: 63, pot: 100000, finalSalary: { has: true, yearly: 6000, fromAge: 63 } } };
const ALEX_D = { you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1900 } };
const ALEX_A = { you: { age: 55, pot: 250000, payIn: { kind: 'total', total: 500 } }, savings: 30000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1700 } };
const SAM_B = { you: { age: 45, pot: 90000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2000 } };
const texts = (r) => [...Object.values(r.sentences || {}).flat(), ...(r.assumed || []), ...(r.warnings || [])].filter((s) => s && typeof s.text === 'string').map((s) => s.text);

describe('the runs go on to the later of the plan-to age and the weighting age; the plan-to age is the label', () => {
  it('runToAgeOf: weighing, the later of the end age and the 1-in-50 age; not weighing, the end age', () => {
    const people = [{ age: 66 }];
    expect(runToAgeOf(99, people, 0, OFF)).toBe(99);
    const w = runToAgeOf(99, people, 0, ENV);
    expect(w).toBeGreaterThan(99);
    expect(w).toBeLessThanOrEqual(105);
    expect(runToAgeOf(104, people, 0, { ...ENV, weightToAge: 101 })).toBe(104);
    expect(runToAgeOf(85, people, 0, { ...ENV, weightToAge: 101 })).toBe(101);
  });

  it('C: a chosen 85 gives the same weighted figures as none (a shorter plan-to age never shortens the weighted sum); the label is 85', () => {
    const none = answerC(ALEX_C, ENV);
    const short = answerC({ ...ALEX_C, endAge: 85 }, ENV);
    for (const k of ['careful', 'balanced', 'bold']) {
      expect(short.levels[k].monthly, k).toBe(none.levels[k].monthly);
      expect(short.levels[k].weighted, k).toBe(none.levels[k].weighted);
    }
    expect(short.basis.endAge).toBe(85);
    expect(short.chance.planToAge).toBe(85);
    expect(short.chance.horizonRule).toBe('chosen');
    expect(none.chance.horizonRule).toBe('survival');
    expect(none.basis.weightToAge).toBeGreaterThan(none.basis.endAge);
    // the fixed-age count is to the label: to 85 more futures last than to the plan-to age
    expect(short.levels.balanced.fixedAge).toBeGreaterThanOrEqual(none.levels.balanced.fixedAge);
  });

  it('a failure after the run\'s end is never counted: with nobody dying and every age at 95 the run ends at 95 as before', () => {
    const r = answerC({ ...ALEX_C, endAge: 95 }, { ...ENV, lifeTable: IMMORTAL, weightToAge: 95 });
    const o = answerC({ ...ALEX_C, endAge: 95 }, OFF);
    expect(r.levels.balanced.monthly).toBe(o.levels.balanced.monthly);
    expect(r.basis.years).toBe(o.basis.years);
  });

  it('capped: a run that cannot reach the weighting age says so and never claims an age past its end', () => {
    // 60 years from 18 ends at 78, long before anyone's 1-in-50 age
    const r = answerC({ you: { pot: 900000, age: 30 }, start: { kind: 'age', age: 40 } }, ENV);
    if (r.status === 'invalid') return;
    expect(r.chance.horizonRule).toBe('capped');
    const capped = r.assumed.find((a) => a.id === 'life-capped');
    expect(capped.text).toMatch(new RegExp(`^We could test only to \\d+: ${RULES.maxDrawYears} years is the most we run\\.$`));
    const to = Number(capped.text.match(/to (\d+)/)[1]);
    expect(to).toBeLessThanOrEqual(40 + RULES.maxDrawYears);
  });

  it('weighted ≥ fixed-age at the default end age, on each question', () => {
    for (const [answer, inputs] of [[answerC, ALEX_C], [answerC, SAM_C], [answerD, ALEX_D], [answerA, ALEX_A]]) {
      const r = answer(inputs, ENV);
      const L = r.levels.careful.monthly !== undefined ? r.levels : r.shown.levels;
      for (const k of ['careful', 'balanced', 'bold']) expect(L[k].weighted + 1e-12, k).toBeGreaterThanOrEqual(L[k].fixedAge);
    }
  });
});

describe('the shortfall lines (shared/shortfall.js)', () => {
  const plan = answerC(ALEX_C, OFF);   // a plan only for its shape below; the lines are tested on a made-up plan
  void plan;
  const P = {
    startAge: 66, endAge: 99, years: 37,
    people: [{ statePension: { amount: 12000, startYear: 1 } }],
    periods: [{ from: 0, to: 1, byPerson: [{ statePension: 0, finalSalary: 0 }], netTotal: 0 }, { from: 1, to: 37, byPerson: [{ statePension: 12000, finalSalary: 0 }], netTotal: grossToNet(12000, BANDS.pa, BANDS.brl, BANDS.hrl) }]
  };
  it('no failing future: no when, no how long, all of the plan paid, no floor', () => {
    expect(shortfallOf(P, new Array(10).fill(null), 24000, { toMonth: 12 * 33 })).toEqual({ when: null, howLong: null, howMuch: 1, floor: null });
  });
  it('when: the middle of the failing futures\' ages and the worst 1 in 10 of all; how long; the floor after tax from the State Pension', () => {
    const months = [null, null, null, null, null, null, 12 * 20, 12 * 22, 12 * 24, 12 * 35];
    const sf = shortfallOf(P, months, 24000, { toMonth: 12 * 33 });
    expect(sf.when.typical).toBe(66 + 22);
    expect(sf.when.worst).toBe(66 + 22);   // position floor(10/10) = 1 of the sorted ages
    expect(sf.howLong).toEqual({ paid: 22, of: 33 });
    expect(sf.howMuch).toBeGreaterThan(0);
    expect(sf.howMuch).toBeLessThan(1);
    expect(sf.floor.yearly).toBe(Math.round(grossToNet(12000, BANDS.pa, BANDS.brl, BANDS.hrl)));
    expect(sf.floor.spAge).toBe(null);
  });
  it('before the State Pension starts: nothing comes in until it does', () => {
    const sf = shortfallOf(P, [0, null, null, null, null, null, null, null, null, null], 24000, { toMonth: 12 * 33 });
    expect(sf.floor.yearly).toBe(0);
    expect(sf.floor.spAge).toBe(67);
  });
  it('a couple: the floor between you and the lower of the two people\'s own', () => {
    const Q = { ...P, periods: [{ from: 0, to: 37, byPerson: [{ statePension: 12000, finalSalary: 0 }, { statePension: 12000, finalSalary: 8000 }], netTotal: 0 }] };
    const f = floorAtYear(Q, 5);
    const one = Math.round(grossToNet(12000, BANDS.pa, BANDS.brl, BANDS.hrl));
    expect(f.survivor).toBe(one);
    expect(f.yearly).toBe(one + Math.round(grossToNet(20000, BANDS.pa, BANDS.brl, BANDS.hrl)));
    expect(f.fs).toBe(true);
    expect(f.sp).toBe(2);
  });
});

describe('the words, weighing', () => {
  it('C, D, A and B: a weighted line in twentieths, the fixed-age line naming its age, no NaN or undefined anywhere', () => {
    for (const [answer, inputs] of [[answerC, ALEX_C], [answerC, SAM_C], [answerD, ALEX_D], [answerA, ALEX_A], [answerB, SAM_B]]) {
      const r = answer(inputs, ENV);
      expect(r.basis.weighted).toBe(true);
      expect(r.sentences.fixed.text).toMatch(/(If you live to|If one of you is still alive when the younger of you is|if you live to) \d+, the money lasts that long /);
      const weighted = Object.values(r.sentences).flat().filter((s) => s && s.mark === 'weighted');
      expect(weighted.length).toBeGreaterThan(0);
      for (const t of texts(r)) expect(t).not.toMatch(/\bNaN\b|\bundefined\b|\bnull\b/);
      // the level is never said as "in 9 futures out of 10" while weighing
      for (const s of weighted) expect(s.text).not.toMatch(/9 futures out of 10/);
    }
  });

  it('B while weighing: the number is the range at the level, the other two beside it', () => {
    const r = answerB(SAM_B, ENV);
    expect(r.sentences.line.text).toMatch(/^At Balanced, to spend £2,000 a month from 62, you would want a pot of about £[\d,]+ by then \(Careful £[\d,]+, Bold £[\d,]+\)\. Counting how long people your age live, with exactly that at 62 the money lasts as long as you do 18 times in 20\.$/);
    // the level's own words say its chance (a count that names its age, "lasted until you are 100 in 9 …", stays a count)
    const own = ['sub', 'line', 'payInLine', 'verdictLine', 'income'].map((k) => r.sentences[k]).filter(Boolean).map((x) => x.text)
      .concat(r.assumed.filter((a) => ['confidence', 'number-is-careful'].includes(a.id)).map((a) => a.text));
    expect(own.length).toBeGreaterThan(4);
    for (const t of own) expect(t).not.toMatch(/9 futures out of 10|9 in 10/);
  });

  it('D: close names what the level asks for; the headroom has its own fixed-age line', () => {
    const r = answerD(ALEX_D, ENV);
    expect(r.sentences.headroomFixed.mark).toBe('fixed');
    expect(r.sentences.headroomFixed.text).toMatch(/^At £[\d,]+ a month: if you live to \d+, the money lasts that long /);
    const close = answerD({ ...ALEX_D, spend: { kind: 'amount', amount: 2050 } }, ENV);
    if (close.verdict === 'close') expect(close.sentences.line.text).toMatch(/; Balanced asks for 18\.$/);
  });

  it('what we assumed: the plan-to age and the age followed on to, the figures used with a way to change them, a couple', () => {
    const c = answerC(SAM_C, ENV);
    const ids = c.assumed.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(['life-plan-to', 'life-sex', 'life-sex-partner', 'life-couple']));
    expect(ids).not.toContain('both-alive');
    expect(ids).not.toContain('plan-to');
    expect(c.assumed.find((a) => a.id === 'life-sex').field).toBe('you.sex');
    expect(c.assumed.find((a) => a.id === 'life-plan-to').text).toMatch(/^Your plan runs to when the younger of you is \d+, when fewer than 1 in 10 couples your ages still have one of you alive\. We follow each future on to \d+, when fewer than 1 in 50 do\.$/);
    const chosen = answerC({ ...ALEX_C, endAge: 85 }, ENV).assumed.find((a) => a.id === 'life-plan-to');
    expect(chosen.text).toMatch(/^Your plan runs to 85, the age you chose\. About \d+ in 10 women your age live longer than that, so we still follow each future on to \d+\.$/);
    // the rollback keeps the lines it had
    const off = answerC(SAM_C, OFF);
    expect(off.assumed.map((a) => a.id)).toEqual(expect.arrayContaining(['plan-to', 'both-alive']));
    expect(off.assumed.map((a) => a.id)).not.toContain('life-plan-to');
  });

  it('the pieces: the fixed-age words name the age; Bold\'s consequence in tenths', () => {
    const lf = { couple: false, planToAge: 97, sex: { you: 'f' }, given: { you: false } };
    expect(partsText(fixedAgeParts(0.7, lf), {})).toBe('If you live to 97, the money lasts that long in 14 of 20 futures we tried.');
    expect(partsText(boldParts(0.70, lf), {})).toBe('About 3 times in 10 the money runs out while you are alive, and you would spend less from then on.');
    const lines = lifeAssumed({ ...lf, weightToAge: 103, rule: 'survival', capped: false, capYears: 37, liveLonger: null });
    expect(lines.map((a) => partsText(a.parts, {}))).toEqual([
      'Your plan runs to 97, when fewer than 1 in 10 women your age are still alive. We follow each future on to 103, when fewer than 1 in 50 are.',
      'We used figures for women, who tend to live longer, because you did not say.'
    ]);
  });
});
