/**
 * Question D's answer, apart from the identities (research/v7/answer-D.md 3.4–3.7, 6, 7, 11.3, 11.4):
 *  - the shape of a result: plain data, the keys the contract names, nothing of the engine;
 *  - the headroom rule: the kind never contradicts the verdict (P-D6), the difference a whole £10;
 *  - the levers cost nothing until asked for (work and fall null; the answer the same with and without them);
 *  - properties on random households: more pot never lowers the careful amount (P-D1), more spend never raises the share
 *    that lasted (P-D2), work never lowers it and more years never do (P-D3), a fall never raises it (P-D4);
 *  - the fixtures of 11.4 that this release covers (D1, D2, D3, D5, D7, D9): the status, the words that must be there;
 *  - the sentences: each is its parts joined; no banned word in the retired, result and first scopes; what was assumed in
 *    a fixed order, every default naming its field; the warnings that apply.
 * Every household is made up (Alex and Sam).
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { answerD, SCHEMA_D, TEST_ENV, D1, D2, D3, D5, D7, D9 } from './_d.js';
import { headroomOf, HEADROOM_LEAST } from '../../../src/answers/d/answer.js';
import { partsText, get, money } from '../../../src/answers/shared/format.js';
import { bannedHits } from '../render/checkScreen.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';

const ENV = TEST_ENV;
const SCOPES = ['all', 'first', 'planner', 'result', 'retired'];
const COUNTDOWN = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i;
const allSentences = (r) => [...Object.values(r.sentences || {}).flatMap((s) => (Array.isArray(s) ? s : [s])), ...(r.assumed || []), ...(r.warnings || [])];
const unsaveable = (v, path = '', out = []) => {
  if (v === undefined || typeof v === 'function' || v instanceof Date) { out.push(path || '(root)'); return out; }
  if (typeof v === 'number' && !Number.isFinite(v)) { out.push(path || '(root)'); return out; }
  if (v && typeof v === 'object') for (const k of Object.keys(v)) unsaveable(v[k], path ? `${path}.${k}` : k, out);
  return out;
};

/** Every rule a D answer must keep; a list of plain failures. */
export function checkAnswerD(r) {
  const out = [];
  if (!['ok', 'guaranteed-only', 'none', 'invalid'].includes(r.status)) out.push(`status ${r.status}`);
  if (r.status === 'invalid') return out;
  for (const p of unsaveable(r)) out.push(`unsaveable at ${p}`);
  for (const k of ['inputs', 'spend', 'verdict', 'lasted', 'runOutAge', 'level', 'levels', 'chance', 'headroom', 'guaranteed', 'phases', 'assumed', 'warnings', 'sentences', 'basis', 'units']) if (!(k in r)) out.push(`no ${k}`);
  if (!['yes', 'close', 'no'].includes(r.verdict)) out.push(`verdict ${r.verdict}`);
  if (!(r.lasted >= 0 && r.lasted <= 1)) out.push(`lasted ${r.lasted}`);
  if (!(r.runOutAge >= r.basis.startAge && r.runOutAge <= r.basis.endAge)) out.push(`runOutAge ${r.runOutAge}`);
  for (const w of ['careful', 'balanced', 'bold']) if (!(r.levels[w].monthly >= 0) || r.levels[w].monthly % 10 !== 0) out.push(`monthly.${w} ${r.levels[w].monthly}`);
  if (!(r.levels.careful.monthly <= r.levels.balanced.monthly && r.levels.balanced.monthly <= r.levels.bold.monthly)) out.push('the levels are out of order');
  // P-D6: the headroom's kind agrees with the verdict, and the amount is a whole £10
  const h = r.headroom;
  if (!['more', 'about', 'less'].includes(h.kind) || h.perMonth % 10 !== 0 || h.perMonth < 0) out.push(`headroom ${JSON.stringify(h)}`);
  if (r.verdict === 'yes' && h.kind === 'less') out.push('a yes beside "less lasted"');
  if (r.verdict !== 'yes' && h.kind === 'more') out.push('not a yes beside "more"');
  if (JSON.stringify(h) !== JSON.stringify(headroomOf(r.verdict, r.levels[r.level].monthly, r.spend.perMonth))) out.push('the headroom is not the rule\'s');
  // the words
  const all = allSentences(r);
  const context = all.map((s) => s.text).join(' ');
  for (const s of all) {
    if (partsText(s.parts, r) !== s.text) out.push(`${s.id}: text ≠ parts`);
    for (const p of s.parts) if (p && p.key !== undefined && typeof get(r, p.key) !== 'number') out.push(`${s.id}: ${p.key} → ${get(r, p.key)}`);
    if (COUNTDOWN.test(s.text)) out.push(`${s.id}: a countdown in "${s.text}"`);
    for (const hit of bannedHits(s.text, SCOPES, { context })) out.push(`${s.id}: ${hit}`);
    if (/\babout\b[^.]*\babout\b/.test(s.text)) out.push(`${s.id}: two "about"s in one sentence`);
  }
  for (const a of r.assumed) if (a.source === 'default' && typeof a.field !== 'string') out.push(`${a.id}: a default without its field`);
  const ids = r.assumed.map((a) => a.id);
  if (ids[0] !== 'd-from-today') out.push('what was assumed does not start with d-from-today');
  if (new Set(ids).size !== ids.length) out.push('an assumed line twice');
  if (r.status === 'ok') {
    if (!r.sentences.head || !r.sentences.line || !r.sentences.bad || !r.sentences.headroom || !r.sentences.levels) out.push('a headline sentence is missing');
    if (!/the worst 1 in 10/.test(r.sentences.bad.text)) out.push('the bad case without its explanation');
    // (7.8.0: at Bold the verdict names its level first, "At Bold: Yes — …")
    const ok = { yes: /^(At Bold: )?Yes — /, close: /^(At Bold: )?Close — /, no: /^(At Bold: )?Not at / };
    if (!ok[r.verdict].test(r.sentences.head.text)) out.push(`the headline "${r.sentences.head.text}" does not say ${r.verdict}`);
  }
  if (r.work) {
    if (!r.sentences.work || !r.sentences.workBad || !r.sentences.workCareful || !Array.isArray(r.sentences.workRows)) out.push('the work lever without its sentences');
    if (r.sentences.workRows.length !== r.work.byYears.length) out.push('the work rows and byYears differ');
    if (!r.assumed.some((a) => a.id === 'd-work-tax')) out.push('work without d-work-tax');
  } else if (r.sentences.work || r.assumed.some((a) => a.id === 'd-work-tax')) out.push('work sentences without the lever');
  if (r.fall) {
    if (!r.sentences.fall || !r.sentences.fallCareful) out.push('the fall lever without its sentences');
    if (!r.assumed.some((a) => a.id === 'd-fall')) out.push('a fall without d-fall');
  } else if (r.sentences.fall) out.push('fall sentences without the lever');
  return out;
}

describe('the shape of an answer, and the headroom rule', () => {
  it('headroomOf: the kind never contradicts the verdict; the difference is a whole £10 (P-D6)', () => {
    expect(headroomOf('yes', 2060, 2000)).toEqual({ kind: 'more', perMonth: 60 });
    expect(headroomOf('yes', 2010, 2000)).toEqual({ kind: 'about', perMonth: 0 });
    expect(headroomOf('yes', 1950, 2000)).toEqual({ kind: 'about', perMonth: 0 });   // a yes never reads "less lasted"
    expect(headroomOf('close', 1960, 2100)).toEqual({ kind: 'less', perMonth: 140 });
    expect(headroomOf('close', 2090, 2100)).toEqual({ kind: 'about', perMonth: 0 });
    expect(headroomOf('no', 2200, 2100)).toEqual({ kind: 'about', perMonth: 0 });     // not a yes never reads "more"
    expect(headroomOf('close', 2100 - HEADROOM_LEAST, 2100)).toEqual({ kind: 'less', perMonth: 20 });
    expect(headroomOf('close', 2100 - HEADROOM_LEAST + 1, 2100)).toEqual({ kind: 'about', perMonth: 0 });
    expect(headroomOf('yes', 2000 + 25, 2000)).toEqual({ kind: 'more', perMonth: 30 });
  });
  it.each([['D1', D1], ['D2', D2], ['D3', D3], ['D5', D5], ['D7', D7], ['D9', D9]])('%s passes every rule, is plain data, and the levers are null unless asked for', (name, d) => {
    const r = answerD(d, ENV);
    expect(r.status).toBe('ok');
    const f = checkAnswerD(r);
    expect(f, f.join('\n')).toEqual([]);
    expect(JSON.parse(JSON.stringify(r))).toEqual(r);
    expect(r.work === null || (name === 'D7')).toBe(true);
    expect(r.fall).toBe(null);
    expect(r.whose).toBe('you');
    expect(r.basis.startAge).toBe(d.you.age);
    expect(r.units).toEqual({ money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' });
  });
  it('the answer is the same with and without the levers; a lever not asked for costs nothing (its block is null)', () => {
    const plain = answerD(D1, ENV);
    const both = answerD({ ...D1, work: { has: true, yearly: 12000, years: 3 }, fall: { has: true } }, ENV);
    for (const k of ['verdict', 'lasted', 'runOutAge', 'level', 'levels', 'chance', 'headroom', 'guaranteed', 'phases']) expect(both[k]).toEqual(plain[k]);
    expect(plain.work).toBe(null);
    expect(plain.fall).toBe(null);
    expect(both.work.byYears.map((r) => r.years)).toEqual([1, 2, 3, 4, 5]);
    expect(both.work.byYears.map((r) => r.toAge)).toEqual([69, 70, 71, 72, 73]);
    expect(both.fall.factor).toBe(0.9);
    const f = checkAnswerD(both);
    expect(f, f.join('\n')).toEqual([]);
    // the work bound (answer-D.md 12): the lever's work is one band and at most six verdicts — a trace counts the evaluations
    const traced = answerD({ ...D1, work: { has: true, yearly: 12000, years: 3 } }, { ...ENV, trace: true });
    expect(traced.trace.evaluations).toBeGreaterThan(0);
  });
});

describe('the fixtures of answer-D.md 11.4 that this release covers', () => {
  it('D1 — 68, drawing for a year, the worked example: a verdict, the band, a bad case in the 80s or 90s, the State Pension after it', () => {
    const r = answerD(D1, ENV);
    expect(r.sentences.sub.text).toBe('after tax, going up with prices, until you are 99');
    // (7.8.0: the verdict as the chance the money lasts as long as you do; the plan-to age and the figures used, assumed)
    expect(r.sentences.line.text).toMatch(/^Counting how long people your age live, £2,100 a month after tax lasts as long as you do /);
    expect(r.assumed.map((a) => a.id)).toEqual(['d-from-today', 'd-spend', 'd-tax-year', 'state-pension-full', 'quarter-tax-free', 'risk-drawing', 'charges', 'life-plan-to', 'life-sex', 'todays-prices', 'no-final-salary', 'savings-growth', 'tax-rules', 'futures']);
    expect(r.warnings.map((w) => w.id)).toEqual(['state-pension-assumed']);
    expect(r.sentences.madeOf.map((s) => s.id)).toEqual(['d.madeOf.mixed', 'd.madeOf.tax']);
    expect(r.sentences.madeOf[0].text).toMatch(/^£1,046 State Pension \+ £[\d,]+ from your pot and savings\.$/);
    expect(r.guaranteed.monthlyAfterTax).toBeCloseTo(1045.63, 2);
  });
  it('D2 — a couple of 72 and 70, both stopped, one final-salary pension, the tax-free part had', () => {
    const r = answerD(D2, ENV);
    expect(r.sentences.sub.text).toBe('after tax between you, going up with prices, until the younger of you is 100');
    expect(r.sentences.line.text).toMatch(/as long as one of you is alive/);
    expect(r.sentences.fixed.text).toMatch(/^If one of you is still alive when the younger of you is 100, /);
    const ids = r.assumed.map((a) => a.id);
    expect(ids).toContain('tax-free-taken');
    expect(ids).toContain('tax-free-taken-partner');
    expect(ids).toContain('life-couple');   // (7.8.0: counted while one of you is alive, said so)
    expect(ids).toContain('savings-split');
    expect(ids).toContain('final-salary-rises');
    expect(r.assumed.find((a) => a.id === 'tax-free-taken').text).toBe('You have already had the tax-free part of your pension, so everything taken from it is taxed.');
    expect(r.phases[0].byPerson.map((b) => b.who)).toEqual(['you', 'partner']);
  });
  it('D3 — 62, under State Pension age, an invested ISA larger than the pension: the State Pension from 67, the savings invested', () => {
    const r = answerD(D3, ENV);
    expect(r.assumed.find((a) => a.id === 'state-pension-full').text).toMatch(/from age 67/);
    expect(r.assumed.map((a) => a.id)).toContain('state-pension-age');
    expect(r.assumed.find((a) => a.id === 'savings-growth').text).toMatch(/invested like your pension/);
    expect(r.phases.length).toBe(2);
    expect(r.phases[0].statePension).toBe(0);
    expect(r.phases[1].statePension).toBeGreaterThan(0);
    expect(r.sentences.madeOf[0].text).toMatch(/^From 62 until 67: £[\d,]+ a month, all from your pot and savings\.$/);
  });
  it('D5 — 53, stopped, the pension closed until 57, savings paying meanwhile: the closed years said, never a wait', () => {
    const r = answerD(D5, ENV);
    expect(r.pensionOpens.you).toBe(57);
    expect(r.assumed.find((a) => a.id === 'pension-closed-until').text).toBe('Your pension is left alone until you are 57; your savings pay until then.');
    expect(r.warnings.find((w) => w.id === 'pension-closed').text).toBe("You can't take money from your pension until you are 57. Until then your ISA and savings pay.");
    expect(r.phases[0]).toMatchObject({ fromAge: 53, toAge: 57, pensionOpen: false });
    expect(r.sentences.madeOf[0].id).toBe('d.madeOf.locked');
    expect(r.sentences.madeOf[0].text).toMatch(/all from your savings\. Your pension can't be touched until then\.$/);
    expect(r.assumed.find((a) => a.id === 'd-tax-free-some')).toBeUndefined();
  });
  it('D7 — 66, thinking about work: £15,000 a year for 3 years; "some" of the tax-free part counted as taken', () => {
    const r = answerD(D7, ENV);
    expect(r.work).toMatchObject({ yearly: 15000, years: 3, fromAge: 66, toAge: 69 });
    expect(r.sentences.work.text).toMatch(/^Working until you are 69 on £15,000 a year before tax, £2,200 a month lasted in .+, against .+ without it\.$/);
    expect(r.sentences.workRows.map((s) => s.text.slice(0, 9))).toEqual(['Until 67:', 'Until 68:', 'Until 69:', 'Until 70:', 'Until 71:']);
    expect(r.assumed.find((a) => a.id === 'd-tax-free-some').text).toMatch(/counted it as all taken/);
    expect(r.assumed.map((a) => a.id)).toContain('d-work-tax');
    expect(r.warnings.map((w) => w.id)).toContain('d-work-mpaa');
    // the work lever's figures move the right way: more lives last with the work, never fewer
    expect(r.work.lasted).toBeGreaterThanOrEqual(r.lasted);
    expect(r.work.byYears.every((row, i, rows) => i === 0 || row.lasted >= rows[i - 1].lasted - 1e-9)).toBe(true);
  });
  // (7.8.0: the end age's default is the plan-to age, when fewer than 1 in 10 people that age are still alive — never near
  // an 88-year-old's own age, so the "near the end" note and the "five years on" rule are the rollback's)
  it('D9 — 88: the default end age is the plan-to age (100), said with the age followed on to; the tax-free part had', () => {
    const r = answerD(D9, ENV);
    expect(r.inputs.endAge).toBe(100);
    expect(r.warnings.map((w) => w.id)).not.toContain('d-end-near');
    expect(r.assumed.find((a) => a.id === 'life-plan-to').text).toBe('Your plan runs to 100, when fewer than 1 in 10 women your age are still alive. We follow each future on to 103, when fewer than 1 in 50 are.');
    expect(r.assumed.map((a) => a.id)).toContain('tax-free-taken');
    expect(r.assumed.map((a) => a.id)).not.toContain('d-end-age');
    const older = answerD({ ...D9, you: { ...D9.you, age: 93 } }, ENV);
    expect(older.inputs.endAge).toBe(101);
    expect(older.assumed.find((a) => a.id === 'life-plan-to').text).toBe('Your plan runs to 101, when fewer than 1 in 10 women your age are still alive. We follow each future on to 104, when fewer than 1 in 50 are.');
  });
  it('the fall on D1: the bad case, the careful amount after the fall, what does not change', () => {
    const r = answerD({ ...D1, fall: { has: true } }, ENV);
    expect(r.sentences.fall.text).toMatch(/^If shares fell by a fifth tomorrow and you kept the same mix, £2,100 a month lasted in /);
    expect(r.sentences.fallCareful.text).toMatch(/^After such a fall, Balanced allows about £[\d,]+ a month/);
    expect(r.sentences.fallUnchanged.text).toBe('Your State Pension would not change.');
    expect(r.fall.lasted).toBeLessThanOrEqual(r.lasted);
    const couple = answerD({ ...D2, fall: { has: true } }, ENV);
    expect(couple.sentences.fallUnchanged.text).toBe('Your State Pensions and your final-salary pension would not change.');
  });
  it('nothing at all: status none, one plain sentence; a pension income only: guaranteed-only with the figure', () => {
    const none = answerD({ you: { age: 70, pot: 0, taxFreeTaken: 'no', statePension: { kind: 'none' } }, spend: { kind: 'amount', amount: 1000 } }, ENV);
    expect(none.status).toBe('none');
    expect(none.sentences.none.text).toMatch(/nothing to test here/);
    expect(checkAnswerD(none)).toEqual([]);
    const only = answerD({ you: { age: 70, pot: 0, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1000 } }, ENV);
    expect(only.status).toBe('guaranteed-only');
    expect(only.verdict).toBe('yes');
    expect(only.runOutAge).toBe(only.basis.endAge);   // (the plan-to age: 70 now, not said — 99)
    expect(only.sentences.nothing.text).toMatch(/^There is no pot to draw on, so this is your State Pension only: £1,046 a month after tax once it has all started\.$/);
    expect(checkAnswerD(only)).toEqual([]);
  });
});

describe('properties on random households (answer-D.md 11.3; at most one £10 step of play)', () => {
  const STEP = 10;
  const opts = { numRuns: 8, seed: 20261021 };
  const households = arbitraryInputs(SCHEMA_D, ENV).filter((i) => i.you.pot + (i.household === 'couple' ? i.partner.pot : 0) + (i.savings || 0) > 0 && !i.work.has && !i.fall.has && i.household === 'single');
  it('every random answer passes every rule', () => {
    fc.assert(fc.property(households, (inputs) => {
      const r = answerD(inputs, ENV);
      const f = checkAnswerD(r);
      expect(f, f.join('\n')).toEqual([]);
    }), opts);
  });
  it('P-D1 more pot never lowers the careful amount; P-D2 more spend never raises the share that lasted', () => {
    fc.assert(fc.property(households, (inputs) => {
      const r = answerD(inputs, ENV);
      const more = answerD({ ...inputs, you: { ...inputs.you, pot: Math.min(10_000_000, inputs.you.pot + 100000) } }, ENV);
      expect(more.levels[more.level].monthly).toBeGreaterThanOrEqual(r.levels[r.level].monthly - STEP);
      const spend = inputs.spend.kind === 'amount' ? inputs.spend.amount : 2000;
      const dearer = answerD({ ...inputs, spend: { kind: 'amount', amount: Math.min(50000, spend + 500) } }, ENV);
      expect(dearer.lasted).toBeLessThanOrEqual(r.lasted + 1e-9);
    }), opts);
  });
  it('P-D3 work never lowers the share that lasted, and more years never do; P-D4 a fall never raises it', () => {
    fc.assert(fc.property(households, (inputs) => {
      const r = answerD({ ...inputs, work: { has: true, yearly: 12000, years: 2 }, fall: { has: true } }, ENV);
      expect(r.work.lasted).toBeGreaterThanOrEqual(r.lasted - 1e-9);
      r.work.byYears.forEach((row, i, rows) => { if (i > 0) expect(row.lasted).toBeGreaterThanOrEqual(rows[i - 1].lasted - 1e-9); });
      expect(r.fall.lasted).toBeLessThanOrEqual(r.lasted + 1e-9);
      expect(r.fall.monthly).toBeLessThanOrEqual(r.levels[r.level].monthly + STEP);
    }), { ...opts, numRuns: 5 });
  });
});

describe('the words, in every scope a retired person reads', () => {
  it.each([['D1', D1], ['D2', D2], ['D3', D3], ['D5', D5], ['D7', D7], ['D9', D9]])('%s: no banned word, no countdown, each sentence its parts joined, money whole pounds', (name, d) => {
    const r = answerD({ ...d, fall: { has: true } }, ENV);
    for (const s of allSentences(r)) {
      expect(partsText(s.parts, r)).toBe(s.text);
      for (const p of s.parts) if (p && p.kind === 'money') expect(s.text).toContain(money(get(r, p.key)));
    }
    expect(checkAnswerD(r)).toEqual([]);
  });
});
