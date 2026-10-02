/**
 * The words of an answer whose spending changes with age (research/v7/spending-shape.md 6.1, 7.2, 7.4, 10's fixtures
 * SS1–SS8): the start is the figure; the next sentence gives the steps, each figure the start × that year's share — careful
 * figures rounded down; a fall says where it ends, moving evenly where it arrives; the notes say when the incomes you get
 * anyway pay more than the shape, and when a stop is after a step. Every sentence is its parts joined (format.js), passes
 * the banned list in its question's scopes, and every figure in it is a key into the result (P-SS6). Each answer keeps its
 * question's own invariants. Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import { answerC, checkAnswer } from '../c/invariants.js';
import { answerA, checkAnswerA, scopesForA, allSentences } from '../a/invariants.js';
import { answerB, checkAnswerB, sentencesOf } from '../b/invariants.js';
import { bannedHits } from '../render/checkScreen.js';
import { partsText, get, money } from '../../../src/answers/shared/format.js';
import { suggest, slowlyLess } from '../../../src/answers/shared/shape.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, trace: false };
const C_SCOPES = ['all', 'first', 'planner', 'retired', 'result'];
const B_SCOPES = ['all', 'first', 'planner', 'result', 'saver'];
const pounds = (shape) => ({ ...(shape.start.then !== 'level' ? { then: shape.start.then, ...(shape.start.fallsPct ? { fallsPct: shape.start.fallsPct } : {}) } : {}), steps: shape.steps });

/** P-SS6: each sentence is its parts joined; every key is a figure of the result; no banned word in its scopes. */
function wordsHold(result, list, scopes) {
  const context = list.map((s) => s.text).join(' ');
  for (const s of list) {
    expect(partsText(s.parts, result), s.id).toBe(s.text);
    for (const p of s.parts) if (p && typeof p === 'object' && p.key) expect(get(result, p.key), `${s.id}: ${p.key}`).not.toBeUndefined();
    expect(bannedHits(s.text, scopes, { context }), `${s.id}: ${s.text}`).toEqual([]);
  }
}
const byId = (list, id) => list.find((s) => s.id === id);

describe('a figure from the stop is the start, never "for life", once the spending changes with age', () => {
  it('A: one more year, and each row of the ages, say "at the start" (a flat answer keeps its words)', () => {
    const steps = [{ fromAge: 75, perMonth: 2550, then: 'falls', fallsPct: 2 }, { fromAge: 85, perMonth: 2100 }];
    const inputs = { you: { age: 55, pot: 450000 }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 3000, steps } };
    const env = { ...ENV, detail: 'chart' };
    const a = answerA(inputs, env);
    expect(a.status).toBe('ok');
    expect(checkAnswerA(a, inputs, env)).toEqual([]);
    wordsHold(a, allSentences(a), scopesForA(a.inputs));
    expect(a.sentences.oneMore.text).toMatch(/^Working until 63 instead of 62 buys about £[\d,]+ a month more at the start, with the later steps in proportion\.$/);
    for (const row of a.sentences.chart) expect(row.text).toMatch(/^At \d+, you could spend about £[\d,]+ a month at the start; £3,000 a month at the start, as you set it, lasted /);
    const flat = answerA({ ...inputs, spend: { kind: 'amount', amount: 3000 } }, env);
    expect(flat.sentences.oneMore.text).toMatch(/ a month more for life\.$/);
    for (const row of flat.sentences.chart) expect(row.text).toMatch(/^At \d+, you could spend about £[\d,]+ a month; £3,000 a month lasted /);
  });

  it('B: what lasted paying in as now is a start, the later steps in proportion (a flat answer keeps its words)', () => {
    const steps = [{ fromAge: 75, perMonth: 2130 }, { fromAge: 85, perMonth: 1750, then: 'falls', fallsPct: 1 }];
    const inputs = { you: { age: 45, pot: 120000, payIn: { total: 800 } }, stop: { age: 60 }, spend: { amount: 2500, steps } };
    const b = answerB(inputs, { ...ENV, detail: 'answer' });
    expect(checkAnswerB(b, inputs)).toEqual([]);
    wordsHold(b, sentencesOf(b), B_SCOPES);
    expect(b.monthlyIfShort).toBeGreaterThan(0);
    expect(b.sentences.bad.text).toMatch(/ Paying in as now, about £[\d,]+ a month from 60, with the later steps in proportion, lasted in 9 futures out of 10\.$/);
    const flat = answerB({ ...inputs, spend: { amount: 2500 } }, { ...ENV, detail: 'answer' });
    expect(flat.sentences.bad.text).toMatch(/ Paying in as now, about £[\d,]+ a month from 60 lasted in 9 futures out of 10\.$/);
  });
});

describe('where a fall ends, as typed: rounded once, from the year\'s own figure', () => {
  it('"Slowly less" from £2,500 at 60: the year at 84 is £2,044.77, so "to £2,040 at 84" — never £2,050 (rounded to the pound, then to £10)', () => {
    const sh = slowlyLess('perMonth', 2500, 60);
    const inputs = { you: { age: 45, pot: 120000, payIn: { total: 800 } }, stop: { age: 60 }, spend: { amount: 2500, ...pounds(sh) } };
    const b = answerB(inputs, { ...ENV, detail: 'answer' });
    expect(checkAnswerB(b, inputs)).toEqual([]);
    const fall = b.spendShape.find((x) => x.then === 'falls');
    expect(fall).toMatchObject({ fromAge: 65, perMonth: 2475, fallsPct: 1, endAge: 84, endPerMonth: 2040 });
    expect(b.sentences.shape.text).toBe('That is at the start. Then, as you set it: £2,475 from 65, then falling 1% a year to £2,040 at 84 and £2,045 from 85.');
  });
});

describe('the fixtures of spending-shape.md 10, each with its plain sentence', () => {
  it('SS1 — 62, stopping now, £2,500 a month, "Suggest go-go, go-slow and no-go years"', () => {
    const s = suggest('perMonth', 2500, 62);
    expect(s.shape.steps.map((x) => [x.fromAge, x.perMonth])).toEqual([[75, 2130], [85, 1750]]);
    const inputs = { you: { age: 62, pot: 600000 }, savings: 20000, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2500, ...pounds(s.shape) } };
    const env = { ...ENV, detail: 'chart' };
    const a = answerA(inputs, env);
    expect(a.status).toBe('ok');
    expect(checkAnswerA(a, inputs, env)).toEqual([]);
    const all = allSentences(a);
    wordsHold(a, all, scopesForA(a.inputs));
    expect(a.sentences.shape.text).toBe('That is at the start. Then, as you set it: £2,130 from 75 and £1,750 from 85.');
    expect(a.sentences.pays.some((l) => /in its first year/.test(l.text))).toBe(false);   // level steps: every figure is every year's
    const c = a.shapeAt.careful;
    expect(a.sentences.couldShape.text).toBe(`You could spend about ${money(c[0].perMonth)} a month at the start, then as you set it: ${money(c[1].perMonth)} from 75 and ${money(c[2].perMonth)} from 85.`);
    // careful figures rounded down: never above the start × the share
    expect(c[1].perMonth).toBeLessThanOrEqual(c[0].perMonth * 2130 / 2500);
    expect(c[1].perMonth % 10).toBe(0);
  });

  it('SS2 — a couple, 66 and 60, "Slowly less", from now (C)', () => {
    const sh = slowlyLess('share', null, 66);
    const inputs = { household: 'couple', you: { age: 66, pot: 350000 }, partner: { age: 60, pot: 150000 }, start: { kind: 'now' },
      shape: { steps: sh.steps } };
    const r = answerC(inputs, ENV);
    expect(r.status).toBe('ok');
    expect(checkAnswer(r, inputs)).toEqual([]);
    const all = [...Object.values(r.sentences).flatMap((v) => (Array.isArray(v) ? v : [v])), ...r.assumed, ...r.warnings];
    wordsHold(r, all, C_SCOPES);
    expect(r.sentences.shape.text).toMatch(/^That is at the start\. Then, as you set it: £[\d,]+ from 71, then falling 1% a year to £[\d,]+ at 90 and £[\d,]+ from 91\.$/);
  });

  it('SS3 — C from 67, 85% from 75, falling 1% a year from 85', () => {
    const inputs = { you: { age: 67, pot: 420000 }, start: { kind: 'now' }, shape: { steps: [{ fromAge: 75, share: 85, then: 'level' }, { fromAge: 85, share: 85, then: 'falls', fallsPct: 1 }] } };
    const r = answerC(inputs, ENV);
    expect(checkAnswer(r, inputs)).toEqual([]);
    const all = [...Object.values(r.sentences).flatMap((v) => (Array.isArray(v) ? v : [v])), ...r.assumed, ...r.warnings];
    wordsHold(r, all, C_SCOPES);
    const [s0, s1, s2] = r.shapeAt.careful;
    expect(r.sentences.shape.text).toBe(`That is at the start. Then, as you set it: ${money(s1.perMonth)} from 75 and ${money(s2.perMonth)} from 85, then falling 1% a year to ${money(s2.endPerMonth)} at 94.`);
    expect(r.sentences.head.text).toBe(`About ${money(s0.perMonth)} a month`);
    // the made-of lines follow the periods, cut at each step; the one the shape moves inside says its figures are its first year's
    expect(r.phases.map((p) => p.fromAge)).toEqual([67, 75, 85]);
    expect(r.phases.map((p) => Boolean(p.shapeMoves))).toEqual([false, false, true]);
    expect(r.sentences.madeOf.filter((l) => l.id !== 'c.madeOf.tax').map((l) => /\(in its first year\)/.test(l.text))).toEqual([false, false, true]);
  });

  it('SS4 — B, a step up for care: £3,000 from 85', () => {
    const inputs = { you: { age: 55, pot: 280000, payIn: { kind: 'split', own: 500, employer: 300 } }, savings: 40000, stop: { age: 62 },
      spend: { amount: 2200, steps: [{ fromAge: 85, perMonth: 3000 }] } };
    const b = answerB(inputs, { ...ENV, detail: 'answer' });
    expect(b.status).not.toBe('invalid');
    expect(checkAnswerB(b, inputs)).toEqual([]);
    wordsHold(b, sentencesOf(b), B_SCOPES);
    expect(b.sentences.shape.text).toBe('That is at the start. Then, as you set it: £3,000 from 85.');
    expect(b.spendShape.map((s) => s.perMonth)).toEqual([2200, 3000]);
  });

  it('SS5 — a couple apart with a shape: the steps by your age, the years apart paid as before', () => {
    const inputs = { household: 'couple', you: { age: 61, pot: 200000 }, stop: { kind: 'already' },
      partner: { age: 55, pot: 260000, payIn: { kind: 'split', own: 400, employer: 300 }, stop: { kind: 'age', age: 57 } }, savings: 40000,
      spend: { kind: 'amount', amount: 2800, steps: [{ fromAge: 75, perMonth: 2400 }, { fromAge: 85, perMonth: 2000 }] } };
    const env = { ...ENV, detail: 'chart', ages: [57] };
    const a = answerA(inputs, env);
    expect(a.status).toBe('ok');
    expect(a.apart).toBeTruthy();
    expect(checkAnswerA(a, inputs, env)).toEqual([]);
    wordsHold(a, allSentences(a), scopesForA(a.inputs));
    expect(a.sentences.shape.text).toBe('That is at the start. Then, as you set it: £2,400 from 75 and £2,000 from 85.');
    // the household's clock starts at the first stop (now: you have stopped), so your age at the start is today's
    expect(a.spendShape[0].fromAge).toBe(61);
  });

  it('SS6 — stopping at 55 on savings, the first amount falling 1.5% a year', () => {
    const inputs = { you: { age: 53, pot: 300000, payIn: { total: 800 } }, savings: 120000, stop: { kind: 'age', age: 55 },
      spend: { kind: 'amount', amount: 2000, then: 'falls', fallsPct: 1.5 } };
    const env = { ...ENV, detail: 'chart' };
    const a = answerA(inputs, env);
    expect(a.status).toBe('ok');
    expect(checkAnswerA(a, inputs, env)).toEqual([]);
    wordsHold(a, allSentences(a), scopesForA(a.inputs));
    expect(a.sentences.shape.text).toMatch(/^That is at the start, falling 1\.5% a year to £[\d,]+ at 94\.$/);
    // the years on savings are counted year by year: what they draw falls with the shape
    if (a.savingsNeeded) expect(a.savingsNeeded.amount).toBeGreaterThan(0);
  });

  it('SS7 — a State Pension above the no-go step: the note', () => {
    const inputs = { you: { age: 66, pot: 150000 }, start: { kind: 'now' }, shape: { steps: [{ fromAge: 75, share: 85 }, { fromAge: 85, share: 55 }] } };
    const r = answerC(inputs, ENV);
    expect(checkAnswer(r, inputs)).toEqual([]);
    const note = r.warnings.find((w) => w.id === 'shape-below-income');
    expect(note.severity).toBe('note');
    expect(note.text).toMatch(/^From 85 your State Pension and other pensions pay more than this, after tax \(about £1,046 a month\): you would have that, and nothing would be taken from your pension or savings\.$/);
  });

  it('SS8 — a row of A\'s table past a step: that step is in force from the start, and the note says so', () => {
    const inputs = { you: { age: 60, pot: 380000 }, savings: 40000, stop: { kind: 'age', age: 62 },
      spend: { kind: 'amount', amount: 2400, steps: [{ fromAge: 64, perMonth: 2000 }] } };
    const env = { ...ENV, detail: 'chart', ages: [62, 64, 65] };
    const a = answerA(inputs, env);
    // the row at 65 tests £2,000 a month from the start; its spare is against that
    const row65 = a.ages.find((r) => r.age === 65);
    expect(row65.spare).toBe(Math.max(0, row65.monthly.careful - 2000));
    const past = answerA({ ...inputs, stop: { kind: 'age', age: 63 }, spend: { ...inputs.spend, steps: [{ fromAge: 64, perMonth: 2000 }] } }, { ...env, ages: [63, 65] });
    expect(past.status).toBe('ok');
    // asked about 65 itself, from the ages ("show me ages" shows the same rows): the note on the shown row
    const shown65 = answerA({ ...inputs, stop: { kind: 'ages' }, spend: { ...inputs.spend, steps: [{ fromAge: 61, perMonth: 2000 }] } }, { ...env, ages: [62, 63] });
    const note = shown65.warnings.find((w) => w.id === 'shape-step-in-force');
    expect(note.text).toMatch(/^You stop at 6\d, after your step from 61, so £2,000 a month applies from the start\.$/);
    wordsHold(shown65, allSentences(shown65), scopesForA(shown65.inputs));
  });
});
