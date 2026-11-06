/**
 * "A share of your pay" (6.46.0; reported 2 Nov 2026: a person paying in a share of their pay had to work the pounds
 * out themselves): the third way of saying what goes into a pension each month,
 * in questions A, B and C, and the ONE reader of every kind (src/answers/shared/payIn.js payInParts, exported on from
 * schemaParts.js).
 *
 *   1  the reader: one figure, two parts, a share, the household model's kind-less { total, own, employer }, C's "not
 *      paying in"; a share of £35,000 at 4% and 6% lands £116.67 from the person and £175 from the employer, £291.67 in all
 *   2  A, B and C answer a share exactly as they answer the split of those pounds — byte for byte, the inputs as typed aside
 *   3  the form: the three boxes apply under 'share' only and are dropped under the other kinds; a blank box is said; a share
 *      over the £10,000-a-month ceiling is refused on the employer's percentage; "5%" and "4.25" are figures, "4.255" is not
 *   4  the hand-overs: A ↔ B carry the three boxes as typed; C → A and B carry the total it lands as one figure; "Try" on
 *      B's "Pay in more" writes the pounds and the two-part kind, the figures first
 *   5  the readers the screens use (select.js): the total as typed, the line under the boxes
 *   6  the seed: a share seeds the two parts in pounds and `pay`; the planner's plan from it carries the pay as the salary,
 *      the employer's part as it is and the person's part × 0.8 (relief at source), so what lands equals V7's figure
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { payInParts, payInTotalOf, saverFields, payingInFields } from '../../../src/answers/shared/schemaParts.js';
import { parseDraft, checkInputs, nest } from '../../../src/answers/shared/validate.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { CARRY } from '../../../src/v7/state/carry.js';
import { leverActions } from '../../../src/v7/components/Levers.jsx';
import { payInTypedOf, shareLandsOf } from '../../../src/v7/state/select.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { checkSeed, seedToScenario } from '../../../src/services/PlanFromSeed.js';

const ENV = { today: '2026-09-30' };
const fixture = (file) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/fixtures', `${file}.json`), 'utf8'));
/** An example: £35,000 a year, 4% from the person and 6% from the employer — and the split of the pounds it lands. */
const SHARE = { kind: 'share', pay: 35000, ownPct: 4, employerPct: 6 };
const SPLIT = { kind: 'split', own: 116.67, employer: 175 };
const withPayIn = (inputs, payIn) => ({ ...inputs, you: { ...inputs.you, payIn } });
/**
 * An answer without the record of what was typed: the inputs, and the "what we assumed" lines about how the pay-in was
 * given (the box "Change" opens, the kind as given, and the line that what was given is what lands) — the only places a
 * share and the split of its pounds differ. Those lines are checked word for word below.
 */
const sans = (r) => {
  const { inputs, assumed, ...rest } = r;
  void inputs;
  return JSON.stringify({ ...rest, assumed: (assumed || []).filter((x) => !/\.payIn\.kind$/.test(x.field || '') && x.id !== 'pay-in-as-given') });
};
/**
 * B since R1 (research/saving-enough-and-check-in.md 3.1, 3.6): what would be enough is said the way the pay-in was given —
 * a share of pay as a share, searched on its 0.5% grid — so those parts (and the lever, the grid and the pots at that
 * figure that say it) are left out; and a share knows the pay, so the one-off sum is checked against it as well (the
 * tax is added back only up to it), which a split in pounds cannot be. Every figure of the one test is still the split's,
 * byte for byte.
 */
const sansB = (r) => {
  const { enough, levers, grid, sentences, ...rest } = r;
  void enough; void grid;
  const { verdictLine, enoughHead, enoughLine, enoughFour, enoughMatch, potsNeeded, lever, ...said } = sentences;
  void verdictLine; void enoughHead; void enoughLine; void enoughFour; void enoughMatch; void potsNeeded;
  const { payMore, oneOff, ...ways } = lever;
  void payMore; void oneOff;
  const { overPay, ...oneOffLever } = levers.oneOff || {};
  void overPay;
  return sans({ ...rest, levers: { ...levers, payMore: null, oneOff: levers.oneOff ? oneOffLever : null }, sentences: { ...said, lever: ways } });
};
/** One assumed line of an answer, by id. */
const said = (r, id) => r.assumed.find((x) => x.id === id);
/** What was given is what lands: the words for a share of pay, for figures, and for a couple who gave one of each. */
const AS_GIVEN = {
  share: 'What you gave as a share of pay is what lands in the pension, with the tax the government adds back already inside it.',
  mixed: 'What you gave, in figures or as a share of pay, is what lands in the pension, with the tax the government adds back already inside it.',
  figure: 'The figure you gave is what lands in the pension, with the tax the government adds back already inside it.',
  figuresC: 'The figures you gave are what lands in the pension, with the tax the government adds back already inside them.'
};

describe('1 — the one reader, every kind', () => {
  it('a share of £35,000 at 4% and 6% lands £116.67 and £175, £291.67 in all, to the penny', () => {
    expect(payInParts(SHARE)).toEqual({ kind: 'share', total: 291.67, own: 116.67, employer: 175, pay: 35000 });
    expect(payInParts({ kind: 'share', pay: 37000, ownPct: 4.25, employerPct: 8 })).toEqual({ kind: 'share', total: 377.71, own: 131.04, employer: 246.67, pay: 37000 });
    expect(payInParts({ kind: 'share', pay: 40000, ownPct: 0, employerPct: 0 })).toEqual({ kind: 'share', total: 0, own: 0, employer: 0, pay: 40000 });
  });
  it('one figure, two parts, the household model\'s kind-less figures, and nothing', () => {
    expect(payInParts({ kind: 'total', total: 700 })).toEqual({ kind: 'total', total: 700, own: null, employer: null, pay: null });
    expect(payInParts({ kind: 'total', total: 700, own: 1, employer: 2, pay: 3 })).toEqual({ kind: 'total', total: 700, own: null, employer: null, pay: null });
    expect(payInParts(SPLIT)).toEqual({ kind: 'split', total: 291.67, own: 116.67, employer: 175, pay: null });
    expect(payInParts({ kind: 'split', own: 450, employer: 250, total: 9, pay: 3 })).toEqual({ kind: 'split', total: 700, own: 450, employer: 250, pay: null });
    expect(payInParts({ kind: 'split', own: 450 })).toEqual({ kind: 'split', total: 450, own: 450, employer: 0, pay: null });
    // the household model: the total as given, else the parts added up; the parts as given
    expect(payInParts({ total: 700, own: 450, employer: 250 })).toEqual({ kind: 'total', total: 700, own: 450, employer: 250, pay: null });
    expect(payInParts({ total: 700 })).toEqual({ kind: 'total', total: 700, own: null, employer: null, pay: null });
    expect(payInParts({ own: 450, employer: 250 })).toEqual({ kind: 'total', total: 700, own: 450, employer: 250, pay: null });
    for (const p of [null, undefined, {}, { has: 'no', ...SHARE }, { has: 'no', kind: 'total', total: 700 }]) expect(payInParts(p)).toEqual({ kind: 'total', total: 0, own: null, employer: null, pay: null });
    expect(payInParts({ has: 'yes', ...SHARE }).total).toBe(291.67);
  });
  it('payInTotalOf reads checked inputs by the same rule', () => {
    expect(payInTotalOf({ you: { payIn: SHARE } }, 'you')).toBe(291.67);
    expect(payInTotalOf({ you: { payIn: { has: 'yes', ...SHARE } }, partner: { payIn: { has: 'no', ...SHARE } } }, 'partner')).toBe(0);
    expect(payInTotalOf({ you: {} }, 'you')).toBe(0);
  });
});

describe('2 — A, B and C answer a share as the split of the pounds it lands, byte for byte', () => {
  it('A (A1-stop-soon with the share in place of its pay-in)', () => {
    const f = fixture('a/A1-stop-soon');
    const share = answerA(withPayIn(f.inputs, SHARE), f.env);
    const split = answerA(withPayIn(f.inputs, SPLIT), f.env);
    expect(share.status).toBe('ok');
    expect(share.inputs.you.payIn).toEqual(SHARE);
    expect(sans(share)).toBe(sans(split));
    expect(share.saving[0].payIn).toMatchObject({ total: 291.67, own: 116.67, employer: 175 });
    // the lines that say how the pay-in was given: the kind recorded is the one typed, and what was given is what lands
    expect(said(share, 'pay-in-split')).toMatchObject({ field: 'you.payIn.kind', value: 'share' });
    expect(said(split, 'pay-in-split')).toMatchObject({ field: 'you.payIn.kind', value: 'split' });
    expect(said(share, 'pay-in-as-given').parts).toEqual([AS_GIVEN.share]);
    expect(said(split, 'pay-in-as-given').parts).toEqual([AS_GIVEN.figure]);
  }, 120000);
  it('A (A2-couple-before-57, your pay-in as a share beside your partner\'s figure): what was given, in figures or as a share', () => {
    const f = fixture('a/A2-couple-before-57');
    const share = answerA(withPayIn(f.inputs, SHARE), f.env);
    expect(share.status).toBe('ok');
    expect(sans(share)).toBe(sans(answerA(withPayIn(f.inputs, SPLIT), f.env)));
    expect(said(share, 'pay-in-as-given').parts).toEqual([AS_GIVEN.mixed]);
    expect(said(answerA(f.inputs, f.env), 'pay-in-as-given').parts).toEqual([AS_GIVEN.figure]);
  }, 120000);
  it('B (B1-my-number): the pay-in now is £291.67, its two parts named', () => {
    const f = fixture('b/B1-my-number');
    const share = answerB(withPayIn(f.inputs, SHARE), f.env);
    const split = answerB(withPayIn(f.inputs, SPLIT), f.env);
    expect(share.status).toBe('ok');
    expect(share.payIn).toMatchObject({ now: 291.67, own: 116.67, employer: 175 });
    expect(sansB(share)).toBe(sansB(split));
    // what would be enough: a share for the share, pounds for the split — above B's £10 less than its whole £10 (which did
    // not last), and within one 0.5% step of pay above it
    expect([share.enough.how, split.enough.how]).toEqual(['share', 'pounds']);
    const step = 35000 * 0.5 / 100 / 12;
    expect(share.enough.nineInTen.payIn).toBeGreaterThan(split.enough.nineInTen.payIn - 10);
    expect(share.enough.nineInTen.payIn).toBeLessThan(split.enough.nineInTen.payIn + step + 0.02);
    expect(share.enough.nineInTen.employerPct).toBe(6);
    expect(said(share, 'pay-in-as-given')).toMatchObject({ field: 'you.payIn.kind', value: 'share', parts: [AS_GIVEN.share] });
    expect(said(split, 'pay-in-as-given')).toMatchObject({ field: 'you.payIn.kind', value: 'split', parts: [AS_GIVEN.figure] });
  }, 120000);
  it('C (F4-still-paying-in): still paying in, a share of pay', () => {
    const f = fixture('c/F4-still-paying-in');
    const share = answerC(withPayIn(f.inputs, { has: 'yes', ...SHARE }), f.env);
    const split = answerC(withPayIn(f.inputs, { has: 'yes', ...SPLIT }), f.env);
    expect(share.status).toBe('ok');
    expect(share.payIn.total).toBe(291.67);
    expect(sans(share)).toBe(sans(split));
    expect(said(share, 'pay-in-as-given').parts).toEqual([AS_GIVEN.share]);
    expect(said(split, 'pay-in-as-given').parts).toEqual([AS_GIVEN.figuresC]);
  }, 120000);
  it('C (F6-couple-apart-closed, your pay-in as a share, your partner already stopped): a share is all that was given', () => {
    const f = fixture('c/F6-couple-apart-closed');
    const share = answerC(withPayIn(f.inputs, { has: 'yes', ...SHARE }), f.env);
    expect(share.status).toBe('ok');
    expect(sans(share)).toBe(sans(answerC(withPayIn(f.inputs, { has: 'yes', ...SPLIT }), f.env)));
    expect(said(share, 'pay-in-as-given').parts).toEqual([AS_GIVEN.share]);
  }, 120000);
});

describe('3 — the form', () => {
  const BASE = { 'you.pot': '120,000', 'you.age': '50', 'stop.age': '60', 'spend.amount': '2,000' };
  const typed = { 'you.payIn.kind': 'share', 'you.payIn.pay': '35,000', 'you.payIn.ownPct': '4%', 'you.payIn.employerPct': '6' };

  it('the three boxes are declared once, under the share in A, B and C, each required; the choice has three options', () => {
    for (const who of ['you', 'partner']) {
      for (const list of [saverFields(who), payingInFields(who)]) {
        for (const p of ['pay', 'ownPct', 'employerPct']) {
          const f = list.find((x) => x.path === `${who}.payIn.${p}`);
          expect(f, `${who}.payIn.${p}`).toMatchObject({ required: true, when: { [`${who}.payIn.kind`]: 'share' } });
          expect(f.type).toBe(p === 'pay' ? 'money' : 'percent');
          if (p !== 'pay') expect(f).toMatchObject({ min: 0, max: 100, step: 0.01 });
        }
        expect(list.find((x) => x.path === `${who}.payIn.kind`).options).toEqual(['total', 'split', 'share']);
      }
    }
    for (const schema of [SCHEMA_A, SCHEMA_B, SCHEMA_C]) for (const p of ['you.payIn.pay', 'you.payIn.ownPct', 'you.payIn.employerPct', 'partner.payIn.employerPct']) expect(schema.fields.some((f) => f.path === p), p).toBe(true);
  });

  it('typed in B, A and C: the share is the checked pay-in, with no figure in pounds beside it', () => {
    const b = parseDraft(SCHEMA_B, { ...BASE, ...typed }, ENV);
    expect(b.ok, JSON.stringify(b.errors)).toBe(true);
    expect(b.inputs.you.payIn).toEqual(SHARE);
    const a = parseDraft(SCHEMA_A, { ...BASE, ...typed }, ENV);
    expect(a.ok, JSON.stringify(a.errors)).toBe(true);
    expect(a.inputs.you.payIn).toEqual(SHARE);
    const c = parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'start.kind': 'age', 'start.age': '67', 'you.payIn.has': 'yes', ...typed }, ENV);
    expect(c.ok, JSON.stringify(c.errors)).toBe(true);
    expect(c.inputs.you.payIn).toEqual({ has: 'yes', ...SHARE });
    // the same from real values
    expect(checkInputs(SCHEMA_B, nest({ ...BASE, 'you.pot': 120000, 'you.age': 50, 'stop.age': 60, 'spend.amount': 2000, ...SHAREFLAT() }), ENV).inputs.you.payIn).toEqual(SHARE);
  });
  const SHAREFLAT = () => ({ 'you.payIn.kind': 'share', 'you.payIn.pay': 35000, 'you.payIn.ownPct': 4, 'you.payIn.employerPct': 6 });

  it('the boxes of the kinds not chosen are dropped: a share typed beside one figure, or two parts beside a share', () => {
    const total = parseDraft(SCHEMA_B, { ...BASE, ...typed, 'you.payIn.kind': 'total', 'you.payIn.total': '700' }, ENV);
    expect(total.inputs.you.payIn).toEqual({ kind: 'total', total: 700 });
    const share = parseDraft(SCHEMA_B, { ...BASE, ...typed, 'you.payIn.own': '450', 'you.payIn.employer': '250', 'you.payIn.total': '700' }, ENV);
    expect(share.inputs.you.payIn).toEqual(SHARE);
  });

  it('a blank box is said, on that box; nothing is said for a box of a kind not chosen', () => {
    const blank = parseDraft(SCHEMA_B, { ...BASE, ...typed, 'you.payIn.employerPct': '' }, ENV);
    expect(blank.errors).toEqual({ 'you.payIn.employerPct': 'required' });
    expect(parseDraft(SCHEMA_B, { ...BASE, 'you.payIn.kind': 'share' }, ENV).errors).toEqual({ 'you.payIn.pay': 'required', 'you.payIn.ownPct': 'required', 'you.payIn.employerPct': 'required' });
    expect(parseDraft(SCHEMA_B, { ...BASE, 'you.payIn.kind': 'total', 'you.payIn.total': '700' }, ENV).errors).toEqual({});
  });

  it('a percentage is a figure on steps of 0.01 up to 100; "%" and spaces are fine', () => {
    const p = (ownPct) => parseDraft(SCHEMA_B, { ...BASE, ...typed, 'you.payIn.ownPct': ownPct }, ENV);
    expect(p('4.25').inputs.you.payIn.ownPct).toBe(4.25);
    expect(p(' 5 % ').inputs.you.payIn.ownPct).toBe(5);
    expect(p('100').ok).toBe(true);
    expect(p('4.255').errors).toEqual({ 'you.payIn.ownPct': 'notANumber' });
    expect(p('101').errors).toEqual({ 'you.payIn.ownPct': 'tooHigh' });
    expect(p('-1').errors).toEqual({ 'you.payIn.ownPct': 'notANumber' });
    expect(p('five').errors).toEqual({ 'you.payIn.ownPct': 'notANumber' });
  });

  it('a share over the £10,000-a-month ceiling is refused on the employer\'s percentage, in all three lists', () => {
    // £2,000,000 at 4% and 6%: £6,666.67 + £10,000 a month
    const over = { ...typed, 'you.payIn.pay': '2,000,000' };
    expect(parseDraft(SCHEMA_B, { ...BASE, ...over }, ENV).errors).toEqual({ 'you.payIn.employerPct': 'pay-in-over-limit' });
    expect(parseDraft(SCHEMA_A, { ...BASE, ...over }, ENV).errors).toEqual({ 'you.payIn.employerPct': 'pay-in-over-limit' });
    expect(parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'start.kind': 'age', 'start.age': '67', 'you.payIn.has': 'yes', ...over }, ENV).errors)
      .toEqual({ 'you.payIn.employerPct': 'pay-in-over-limit' });
    // exactly £10,000 is allowed: £2,000,000 at 0% and 6%
    expect(parseDraft(SCHEMA_B, { ...BASE, ...over, 'you.payIn.ownPct': '0' }, ENV).ok).toBe(true);
    // a partner's share too, on their box; the ceiling is each person's own
    const two = { household: 'couple', 'partner.age': '48', 'partner.payIn.kind': 'share', 'partner.payIn.pay': '3,000,000', 'partner.payIn.ownPct': '4', 'partner.payIn.employerPct': '1' };
    expect(parseDraft(SCHEMA_B, { ...BASE, ...typed, ...two }, ENV).errors).toEqual({ 'partner.payIn.employerPct': 'pay-in-over-limit' });
    // from real values, the same rule
    expect(checkInputs(SCHEMA_B, nest({ 'you.pot': 120000, 'you.age': 50, 'stop.age': 60, 'spend.amount': 2000, ...SHAREFLAT(), 'you.payIn.pay': 2000000 }), ENV).errors)
      .toEqual({ 'you.payIn.employerPct': 'pay-in-over-limit' });
  });
});

describe('4 — the hand-overs and "Try"', () => {
  it('A ↔ B carry the three boxes as typed; C → A and B carry the total it lands as one figure', () => {
    for (const k of ['a→b', 'b→a']) for (const p of ['you.payIn.pay', 'you.payIn.ownPct', 'you.payIn.employerPct', 'partner.payIn.pay', 'partner.payIn.ownPct', 'partner.payIn.employerPct']) {
      expect(CARRY[k].some(([from, to]) => from === p && to === p), `${k} ${p}`).toBe(true);
    }
    for (const k of ['c→a', 'c→b', 'a→c', 'b→c']) {
      expect(CARRY[k].some(([from, to]) => from && from.fixed === 'total' && to === 'you.payIn.kind'), k).toBe(true);
      expect(CARRY[k].some(([, to]) => to === 'you.payIn.pay'), k).toBe(false);
    }
  });
  it('"Pay in more" on a share: the share is written and the kind kept — the lever\'s own share, or one that lands the pounds (3.6)', () => {
    // the lever names a share (what would be enough, saving-enough-and-check-in.md 3.5): that share, your part of it
    const result = { levers: { payMore: { payIn: 937.5, savingsIn: null, lasted: 36, ownPct: 26.5, totalPct: 32.5 } }, inputs: { household: 'single', you: { payIn: SHARE } } };
    expect(leverActions('payMore', result)).toEqual([
      { type: 'draft/set', q: 'b', path: 'you.payIn.ownPct', value: '26.5' },
      { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'share' }
    ]);
    // pounds only (an older answer): the share that lands at least that much, to the box's 0.01% — (500 − 175) × 12 / 35,000
    const pounds = { ...result, levers: { payMore: { payIn: 500, savingsIn: null, lasted: 36 } } };
    expect(leverActions('payMore', pounds)).toEqual([
      { type: 'draft/set', q: 'b', path: 'you.payIn.ownPct', value: '11.15' },
      { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'share' }
    ]);
    // a share of a pay of £0 is no share: the pounds into the two parts, as before
    const paused = { ...pounds, inputs: { household: 'single', you: { payIn: { ...SHARE, pay: 0 } } } };
    expect(leverActions('payMore', paused)).toEqual([
      { type: 'draft/set', q: 'b', path: 'you.payIn.own', value: '500' },
      { type: 'draft/set', q: 'b', path: 'you.payIn.employer', value: '0' },
      { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' }
    ]);
    // one figure or two parts: as before, one figure
    const total = { ...pounds, inputs: { household: 'single', you: { payIn: { kind: 'total', total: 300 } } } };
    expect(leverActions('payMore', total)).toEqual([{ type: 'draft/set', q: 'b', path: 'you.payIn.total', value: '500' }, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'total' }]);
  });
});

describe('5 — the readers the screens use', () => {
  const flat = { 'you.payIn.kind': 'share', 'you.payIn.pay': 35000, 'you.payIn.ownPct': 4, 'you.payIn.employerPct': 6 };
  it('the total as typed, for every kind; null while a box it needs is blank', () => {
    expect(payInTypedOf(flat)).toBe(291.67);
    expect(payInTypedOf({ ...flat, 'you.payIn.employerPct': undefined })).toBe(null);
    expect(payInTypedOf({ 'you.payIn.kind': 'total', 'you.payIn.total': 700 })).toBe(700);
    expect(payInTypedOf({ 'you.payIn.kind': 'total' })).toBe(null);
    expect(payInTypedOf({ 'you.payIn.kind': 'split', 'you.payIn.own': 450 })).toBe(450);
    expect(payInTypedOf({ 'you.payIn.kind': 'split' })).toBe(null);
    expect(payInTypedOf({ 'partner.payIn.kind': 'share', 'partner.payIn.pay': 30000, 'partner.payIn.ownPct': 8, 'partner.payIn.employerPct': 0 }, 'partner')).toBe(200);
  });
  it('the line under the boxes: the two parts in pounds, or nothing', () => {
    expect(shareLandsOf(flat)).toEqual({ own: 116.67, employer: 175 });
    expect(shareLandsOf({ ...flat, 'you.payIn.pay': undefined })).toBe(null);
    expect(shareLandsOf({ 'you.payIn.kind': 'split', 'you.payIn.own': 450, 'you.payIn.employer': 250 })).toBe(null);
  });
});

describe('6 — the seed and the plan made from it', () => {
  const AT = '2026-09-30T14:03:22.511Z';
  const SEED_ENV = { today: '2026-09-30', appVersion: '6.17.0' };
  it('B: a share seeds the two parts in pounds, as a split, with the pay a year beside them; the planner\'s plan has the salary', () => {
    const f = fixture('b/B1-my-number');
    const result = answerB(withPayIn(f.inputs, SHARE), f.env);
    const seed = buildPlanSeed({ source: 'b', result, env: SEED_ENV, name: { chosen: 'My try' }, createdAt: AT });
    expect(seed).not.toBe(null);
    expect(seed.people[0].payIn).toEqual({ kind: 'split', total: 291.67, own: 116.67, employer: 175, savingsIn: 0, pay: 35000 });
    expect(checkSeed(seed, Date.parse(AT) + 1000)).toEqual({ ok: true });
    const { yours } = seedToScenario(seed, new Date(2026, 8, 30, 15, 0));
    // from release step R2 (research/saving-enough-and-check-in.md 4.5): the share kept beside the pounds it lands, and what
    // goes in rising with prices (decision D6, 2.5% a year; it was 0%)
    expect(yours.accumulationTool.settings).toEqual({
      currentAge: 50, retirementAge: 60, potNow: 120000, salary: 35000, schemeType: 'ras', netMonthly: 93.34, employerMonthly: 175, escalationPct: 2.5,
      payInKind: 'share', ownPct: SHARE.ownPct, employerPct: SHARE.employerPct
    });
    // a split in pounds seeds no `pay`, byte for byte as before
    const split = buildPlanSeed({ source: 'b', result: answerB(withPayIn(f.inputs, SPLIT), f.env), env: SEED_ENV, name: { chosen: 'My try' }, createdAt: AT });
    expect(split.people[0].payIn).toEqual({ kind: 'split', total: 291.67, own: 116.67, employer: 175, savingsIn: 0 });
    expect(seedToScenario(split, new Date(2026, 8, 30, 15, 0)).yours.accumulationTool.settings.salary).toBe(0);
  }, 120000);
  it('C: the same from "still paying in" as a share', () => {
    const f = fixture('c/F4-still-paying-in');
    const result = answerC(withPayIn(f.inputs, { has: 'yes', ...SHARE }), f.env);
    const seed = buildPlanSeed({ source: 'c', result, env: SEED_ENV, name: { chosen: 'My try' }, createdAt: AT });
    expect(seed).not.toBe(null);
    expect(seed.people[0].payIn).toEqual({ kind: 'split', total: 291.67, own: 116.67, employer: 175, savingsIn: 0, pay: 35000 });
    expect(checkSeed(seed, Date.parse(AT) + 1000)).toEqual({ ok: true });
    expect(seedToScenario(seed, new Date(2026, 8, 30, 15, 0)).yours.accumulationTool.settings).toMatchObject({ salary: 35000, netMonthly: 93.34, employerMonthly: 175, schemeType: 'ras' });
  }, 120000);
});
