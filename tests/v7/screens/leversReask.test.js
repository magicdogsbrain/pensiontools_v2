/**
 * B's "Try" buttons put exactly what each lever means into the numbers, so asking again gives the lever's own figure
 * (the review of 1 Oct 2026: "levers must match what re-asking gives"). The actions are the screen's own
 * (leverActions, the button's onClick), applied through the real reducer to a typed draft, then asked again of the real
 * answer: the stop-later age, the pay-in and the lower spending each make the money last in 9 futures out of 10 —
 * on course — and more risk while saving, where it helps, needs the pay-in it named.
 *
 * Households: one stopping when the pension is open (60), one before it (55, with savings), and a couple.
 *
 * "Pay in more" on a pay-in entered as your part and your employer's (a report of 2 Nov 2026): the lever raises
 * your part and leaves the employer's as typed; asked again, what goes in is the lever's figure; kept as a plan, the
 * planner's saving settings hold the employer's part and your part as your own (relief at source), the total landing
 * the lever's figure. Before, the lever wrote one figure and the kept plan read "£0 from your employer". The "Try a
 * change" stepper and a cell of the grid, the two other doors on the same page, write by the same rule (payInTo.js), and an
 * employer's part with pence leaves them in your part rather than rounding the figure away.
 */
import { describe, it, expect } from 'vitest';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { parsedDraft } from '../../../src/v7/state/select.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { leverActions, LEVERS } from '../../../src/v7/components/Levers.jsx';
import { changedLine } from '../../../src/v7/components/TryAChange.jsx';
import { cellActions } from '../../../src/v7/components/Grid.jsx';
import { payInTo, payInEntered, asTyped } from '../../../src/v7/components/payInTo.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { money } from '../../../src/answers/shared/format.js';
import { payInParts } from '../../../src/answers/shared/payIn.js';
import { B } from '../../../src/v7/copy/b.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false, detail: 'answer' };

const HOUSEHOLDS = {
  'stop at 60': { 'you.age': '50', 'you.pot': '120,000', 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250', 'stop.age': '60', 'spend.amount': '2,000' },
  'stop at 55, before the pension opens': { 'you.age': '47', 'you.pot': '150,000', 'you.payIn.total': '800', savings: '30,000', 'stop.age': '55', 'spend.amount': '1,800' },
  'a couple': { household: 'couple', 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '700', 'partner.age': '48', 'partner.pot': '150,000', 'partner.payIn.total': '300', 'stop.age': '60', 'spend.amount': '3,200' }
};

/** A state with B's draft typed. */
function typed(values) {
  const s = initialState({ today: TODAY, build: 'test' });
  return { ...s, draft: { ...s.draft, b: { ...s.draft.b, values: { ...values } } } };
}
const ask = (state) => {
  const parsed = parsedDraft(state, 'b');
  expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  return answerB(parsed.inputs, ENV);
};

describe.each(Object.entries(HOUSEHOLDS))('%s: each lever, tried and asked again, gives its own figure', (name, values) => {
  const start = typed(values);
  const result = ask(start);

  it('the answer is short, with levers to try', () => {
    expect(['ok', 'out-of-reach']).toContain(result.status);
    expect(result.onCourse).toBe(false);
    const tryable = LEVERS.filter((id) => id !== 'accept' && result.levers[id] && leverActions(id, result));
    expect(tryable.length, `levers with a "Try": ${tryable}`).toBeGreaterThanOrEqual(2);
  });

  it.each(LEVERS.filter((id) => id !== 'accept'))('%s', (id) => {
    const lever = result.levers && result.levers[id];
    const actions = lever ? leverActions(id, result) : null;
    if (!actions) return;                                         // not found, not for a couple, or does not help: no "Try"
    const tried = actions.reduce((s, a) => reduce(s, a), start);
    expect(parsedDraft(tried, 'b').ok).toBe(true);
    const again = ask(tried);
    if (id === 'moreRisk') {
      expect(again.payIn.needed, 'more risk: the pay-in it named').toBe(lever.payIn);
      return;
    }
    // stop later, pay in more, spend less: each makes the money last in 9 futures out of 10 — on course
    expect(again.onCourse, `${id}: on course once tried`).toBe(true);
    expect(again.chance.fixedAge).toBe(lever.lasted);
  });
});

describe('"Pay in more" on a pay-in entered as your part and your employer\'s (reported 2 Nov 2026)', () => {
  const values = HOUSEHOLDS['stop at 60'];                                    // split: £450 from you, £250 from the employer
  const start = typed(values);
  const result = ask(start);
  const lever = result.levers.payMore;
  const actions = leverActions('payMore', result);
  const tried = actions ? actions.reduce((s, a) => reduce(s, a), start) : null;
  const again = tried ? ask(tried) : null;

  it('the lever raises your part by the whole rise and leaves the employer\'s box as typed', () => {
    expect(lever && typeof lever.payIn === 'number').toBe(true);
    expect(result.inputs.you.payIn).toEqual({ kind: 'split', own: 450, employer: 250 });
    expect(lever.payIn).toBeGreaterThan(700);
    expect(actions).toEqual([
      { type: 'draft/set', q: 'b', path: 'you.payIn.own', value: money(lever.payIn - 250).slice(1) },
      { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' }
    ]);
    expect(tried.draft.b.values['you.payIn.employer']).toBe('250');
    expect(tried.draft.b.values['you.payIn.total']).toBe(undefined);
  });
  it('asked again, what goes in is the lever\'s figure, the employer\'s part inside it, and it is on course', () => {
    expect(again.inputs.you.payIn).toEqual({ kind: 'split', own: lever.payIn - 250, employer: 250 });
    expect(again.payIn.now).toBe(lever.payIn);
    expect(again.payIn.employer).toBe(250);
    expect(again.onCourse).toBe(true);
    expect(again.chance.fixedAge).toBe(lever.lasted);
    // "What you changed" names the whole figure before and after, as for one figure
    expect(changedLine('b', B, result.inputs, again.inputs)).toBe(`You changed what goes in each month from £700 to ${money(lever.payIn)}.`);
  });
  it('kept as a plan: the employer\'s part stays, your part is entered as your own (relief at source), the total landing is the lever\'s figure', () => {
    const seed = buildPlanSeed({ source: 'b', result: again, env: { today: TODAY, appVersion: 'test' }, name: { chosen: 'My try' }, createdAt: TODAY + 'T10:00:00.000Z' });
    expect(seed).not.toBe(null);
    expect(seed.people[0].payIn).toEqual({ kind: 'split', total: lever.payIn, own: lever.payIn - 250, employer: 250, savingsIn: 0 });
    const { yours } = seedToScenario(seed, new Date(2026, 8, 30, 12));
    const ac = yours.accumulationTool.settings;
    expect(ac.employerMonthly).toBe(250);
    expect(ac.netMonthly).toBe(Math.round((lever.payIn - 250) * 0.8 * 100) / 100);
    expect(ac.netMonthly / 0.8 + ac.employerMonthly).toBeCloseTo(lever.payIn, 6);
    expect(ac.schemeType).toBe('ras');
  });
  it('an entry of one figure is still one figure (the lever as it was)', () => {
    const one = ask(typed(HOUSEHOLDS['stop at 55, before the pension opens']));
    const a = leverActions('payMore', one);
    expect(a.slice(0, 2)).toEqual([
      { type: 'draft/set', q: 'b', path: 'you.payIn.total', value: money(one.levers.payMore.payIn).slice(1) },
      { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'total' }
    ]);
    // a kind that is none of the three: one figure, as before
    const other = { ...result, inputs: { ...result.inputs, you: { ...result.inputs.you, payIn: { kind: 'odd', odd: 5 } } } };
    expect(leverActions('payMore', other)[0].path).toBe('you.payIn.total');
    // a share of pay (R1, saving-enough-and-check-in.md 3.6): the share is written and the kind kept — for a lever in pounds,
    // the share that lands at least its figure, to the box's 0.01%
    const shared = { ...result, inputs: { ...result.inputs, you: { ...result.inputs.you, payIn: { kind: 'share', pay: 35000, ownPct: 4, employerPct: 6 } } } };
    const written = leverActions('payMore', shared);
    expect(written.slice(0, 2).map((x) => x.path)).toEqual(['you.payIn.ownPct', 'you.payIn.kind']);
    expect(written[1].value).toBe('share');
    const lands = payInParts({ kind: 'share', pay: 35000, ownPct: Number(written[0].value), employerPct: 6 }).total;
    expect(lands).toBeGreaterThanOrEqual(result.levers.payMore.payIn);
    expect(lands).toBeLessThan(result.levers.payMore.payIn + 35000 * 0.0001 / 12 + 0.01);
  });
});

describe('the stepper and the grid cell on a split entry keep the employer\'s part too (payInTo.js, the one writer of the three doors)', () => {
  const values = HOUSEHOLDS['stop at 60'];                                    // split: £450 from you, £250 from the employer
  const start = typed(values);
  const result = ask(start);
  const v = parsedDraft(start, 'b').values;

  it('"+ £50" on the stepper: your part up by £50, the employer\'s as typed; asked again, £50 more goes in', () => {
    const entered = payInEntered(v, 'you');
    expect(entered).toEqual({ kind: 'split', employer: 250, total: 700, yours: 450 });
    const actions = payInTo('b', 'you', entered, entered.total + 50);
    expect(actions).toEqual([{ type: 'draft/set', q: 'b', path: 'you.payIn.own', value: '500' }, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' }]);
    const again = ask(actions.reduce((s, a) => reduce(s, a), start));
    expect(again.inputs.you.payIn).toEqual({ kind: 'split', own: 500, employer: 250 });
    expect(again.payIn.now).toBe(750);
    expect(again.payIn.employer).toBe(250);
    expect(changedLine('b', B, result.inputs, again.inputs)).toBe('You changed what goes in each month from £700 to £750.');
  });
  it('a cell of the grid: the stop age, and the cell\'s figure with the employer\'s part inside it; asked again, that figure goes in at that age', () => {
    const actions = cellActions(result, 62, 1820);
    expect(actions).toEqual([
      { type: 'draft/set', q: 'b', path: 'stop.age', value: '62' },
      { type: 'draft/set', q: 'b', path: 'you.payIn.own', value: '1,570' },
      { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' }
    ]);
    const again = ask(actions.reduce((s, a) => reduce(s, a), start));
    expect(again.inputs.you.payIn).toEqual({ kind: 'split', own: 1570, employer: 250 });
    expect(again.inputs.stop.age).toBe(62);
    expect(again.payIn.now).toBe(1820);
  });
  it('an employer\'s part with pence: your part is written with its pence, so asked again what goes in is the lever\'s figure exactly', () => {
    const pence = typed({ ...values, 'you.payIn.employer': '250.50' });
    const r = ask(pence);
    expect(r.inputs.you.payIn).toEqual({ kind: 'split', own: 450, employer: 250.5 });
    const lever = r.levers.payMore;
    const actions = leverActions('payMore', r);
    expect(actions[0]).toEqual({ type: 'draft/set', q: 'b', path: 'you.payIn.own', value: asTyped(lever.payIn - 250.5) });
    expect(actions[0].value).toMatch(/^\d{1,3}(,\d{3})*\.50$/);                // the lever's figure is whole pounds: 50p is left in your part
    const again = ask(actions.reduce((s, a) => reduce(s, a), pence));
    expect(again.payIn.now).toBe(lever.payIn);                                // not 50p over, as money()'s rounding gave
    expect(again.onCourse).toBe(true);
    expect(changedLine('b', B, r.inputs, again.inputs)).toBe(`You changed what goes in each month from ${money(700.5)} to ${money(lever.payIn)}.`);
    // the stepper too: £50 on top of £700.50 is £750.50, your part £500 exactly
    const step = payInTo('b', 'you', payInEntered(parsedDraft(pence, 'b').values, 'you'), 750.5);
    expect(step[0].value).toBe('500');
    expect(ask(step.reduce((s, a) => reduce(s, a), pence)).payIn.now).toBe(750.5);
  });
  it('the writer: whole pounds with commas, pence only when there are any; never below £0; any kind but split is one figure', () => {
    expect(asTyped(2290)).toBe('2,290');
    expect(asTyped(2289.5)).toBe('2,289.50');
    expect(asTyped(0.05)).toBe('0.05');
    expect(asTyped(0)).toBe('0');
    expect(asTyped(1234567.891)).toBe('1,234,567.89');
    expect(payInTo('b', 'partner', { kind: 'split', own: 100, employer: 900 }, 750)).toEqual([
      { type: 'draft/set', q: 'b', path: 'partner.payIn.own', value: '0' }, { type: 'draft/set', q: 'b', path: 'partner.payIn.kind', value: 'split' }
    ]);
    for (const entry of [{ total: 700 }, { kind: 'total', total: 700 }, { kind: 'odd', odd: 5 }, null]) {
      expect(payInTo('b', 'you', entry, 750), JSON.stringify(entry)).toEqual([
        { type: 'draft/set', q: 'b', path: 'you.payIn.total', value: '750' }, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'total' }
      ]);
    }
    // a share of pay (R1, 3.6): the checked inputs' shape (pay and the percentages) and payInEntered's (the employer's pounds
    // read, and the pay) write the same — your share, the kind kept: (950 − 175) × 12 / 35,000 = 26.57…, up to 26.58; a door
    // that names a share writes it as it is
    const asShare = [{ type: 'draft/set', q: 'b', path: 'you.payIn.ownPct', value: '26.58' }, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'share' }];
    expect(payInTo('b', 'you', { kind: 'share', pay: 35000, ownPct: 4, employerPct: 6 }, 950)).toEqual(asShare);
    expect(payInTo('b', 'you', { kind: 'share', employer: 175, total: 291.67, yours: 116.67, pay: 35000 }, 950)).toEqual(asShare);
    expect(payInTo('b', 'you', { kind: 'share', pay: 35000, ownPct: 4, employerPct: 6 }, 937.5, { ownPct: 26.5 })[0].value).toBe('26.5');
    expect(payInTo('b', 'you', { kind: 'share', pay: 35000, ownPct: 4, employerPct: 6 }, 50)[0].value).toBe('0');
    // no pay to be a share of: the pounds into the two parts, as before
    expect(payInTo('b', 'you', { kind: 'share', employer: 175, total: 291.67, yours: 116.67, pay: 0 }, 950)).toEqual([
      { type: 'draft/set', q: 'b', path: 'you.payIn.own', value: '775' }, { type: 'draft/set', q: 'b', path: 'you.payIn.employer', value: '175' }, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' }
    ]);
    expect(payInEntered({ 'you.payIn.kind': 'share', 'you.payIn.pay': 35000, 'you.payIn.ownPct': 4, 'you.payIn.employerPct': 6 }, 'you')).toEqual({ kind: 'share', employer: 175, total: 291.67, yours: 116.67, pay: 35000 });
    expect(payInEntered({ 'you.payIn.kind': 'share', 'you.payIn.pay': 35000 }, 'you')).toEqual({ kind: 'share', employer: 0, total: null, yours: 0, pay: 35000 });
    // as typed: one figure blank is null (the stepper shows nothing and offers no step); split with both boxes blank is £0
    expect(payInEntered({ 'you.payIn.kind': 'total' }, 'you')).toEqual({ kind: 'total', employer: 0, total: null, yours: 0 });
    expect(payInEntered({ 'you.payIn.kind': 'split' }, 'you')).toEqual({ kind: 'split', employer: 0, total: 0, yours: 0 });
    expect(payInEntered({ 'partner.payIn.kind': 'split', 'partner.payIn.own': 0, 'partner.payIn.employer': 300 }, 'partner')).toEqual({ kind: 'split', employer: 300, total: 300, yours: 0 });
  });
});
