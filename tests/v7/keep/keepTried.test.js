/**
 * Keep on "What is my pot worth a month?" keeps what is on screen. Read at an amount being tried, with the spending the same
 * every year, Keep asks which amount the plan keeps — the one tried or the level's — with two buttons of one kind, neither
 * chosen; the name follows the press while it is the suggestion. Before, Keep always kept the level's amount and said so in
 * a note. With spending that changes with age the amount tried has no year-by-year figures: one button and the old note.
 *
 * Fictional: Jo, 33, pay £38,000, pays 5% and the employer 3%, pot £22,000, wants £2,500 a month from 65, carried over from
 * "Am I saving enough?".
 */
import { describe, it, expect } from 'vitest';
import { fresh, run, set, answered } from '../shell/_open.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { parsedDraft, keepView } from '../../../src/v7/state/select.js';
import { answerC } from '../c/_c.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { draw } from '../render/checkScreen.js';

const TODAY = '2026-09-30';
const pounds = (n) => '£' + Math.round(n).toLocaleString('en-GB');
// the name rounds the amount to £10 (planName.js tenner): £2,500 stays £2,500
const tenner = (n) => pounds(Math.round(n / 10) * 10);

function joTrying() {
  let st = run(fresh({ today: TODAY }), set('b', 'you.age', '33'), set('b', 'you.pot', '22,000'), set('b', 'you.payIn.kind', 'share'), set('b', 'you.payIn.pay', '38,000'),
    set('b', 'you.payIn.ownPct', '5'), set('b', 'you.payIn.employerPct', '3'), set('b', 'stop.age', '65'), set('b', 'spend.amount', '2,500'));
  st = answered(st, 'b', { status: 'ok', saving: [{ who: 'you', payIn: { total: 253.33 } }] });
  st = reduce(st, { type: ACT.DRAFT_CARRY, from: 'b', to: 'c' });
  const parsed = parsedDraft(st, 'c');
  expect(parsed.ok).toBe(true);
  const result = answerC(parsed.inputs, { today: TODAY, futures: 100, seed: 0, trace: false });
  st = answered(st, 'c', result);
  return reduce(st, { type: ACT.ROUTE_SET, route: { screen: 'step', q: 'c', step: 'answer', planId: null, focus: null } });
}

const seedOf = (st, take) => {
  const v = keepView(st, 'c');
  return buildPlanSeed({ source: 'c', result: st.answers.c.result, env: { today: TODAY, appVersion: 'test' }, name: { suggested: v.suggested, chosen: v.check.name }, createdAt: TODAY + 'T10:00:00.000Z', take });
};

describe('Keep on C keeps the amount on screen', () => {
  it('the amount tried: £2,500 a month, as typed, named for it', () => {
    const st = joTrying();
    const r = st.answers.c.result;
    expect(r.take.perMonth).toBe(2500);
    // (7.12.0) carried from "Am I saving enough?" and still paying in: the amount tried is what Jo wants
    expect(keepView(st, 'c').take).toEqual({ level: r.level, wanted: 'b' });
    const seed = seedOf(st, 'tried');
    expect(seed.spend.perMonth).toBe(2500);
    expect(seed.spend.from).toBe('typed');
    expect(seed.name.chosen).toBe('Stop at 65 · £2,500 a month');
  });

  it('the level\'s amount: the answer\'s own figure, named for it', () => {
    const st = joTrying();
    const r = st.answers.c.result;
    const level = r.levels[r.level].monthly;
    const seed = seedOf(st, 'level');
    expect(seed.spend.perMonth).toBe(level);
    expect(seed.spend.from).toBe('careful');
    expect(seed.name.chosen).toBe(`Stop at 65 · ${tenner(level)} a month`);
  });

  it('the panel asks with two buttons, neither chosen, and no "not the amount you are trying"', () => {
    const st = joTrying();
    const { root } = draw(st);
    const box = root.querySelector('[data-testid="c.keep.take"]');
    expect(box).not.toBeNull();
    expect(box.querySelector('legend').textContent).toBe('Which amount does the plan keep?');
    expect(root.querySelector('[data-testid="c.action.save.tried"]').textContent).toBe('Keep: £2,500 a month (what you want)');
    const level = st.answers.c.result.levels[st.answers.c.result.level].monthly;
    expect(root.querySelector('[data-testid="c.action.save.level"]').textContent).toBe(`Keep: ${pounds(level)} a month (what paying in as now supports, at Balanced)`);
    expect(root.querySelector('[data-testid="c.action.save"]')).toBeNull();
    expect(root.textContent).not.toContain('not the amount you are trying');
    // the press is carried to the write
    const pressed = reduce(st, { type: ACT.KEEP_SAVE, q: 'c', take: 'tried' });
    expect(pressed.keep.c.take).toBe('tried');
  });

  it('with spending that changes with age: one button and the note that the level\'s amount is kept', () => {
    const st = joTrying();
    // (an answer whose spending changes with age carries its year-by-year rows; the amount tried has none)
    st.answers.c.result = { ...st.answers.c.result, byYear: [{ age: 65, spend: 2000 }] };
    expect(keepView(st, 'c').take).toBeNull();
    const { root } = draw(st);
    expect(root.querySelector('[data-testid="c.keep.take"]')).toBeNull();
    expect(root.querySelector('[data-testid="c.action.save"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="c.keep.trying"]').textContent).toContain('not the amount you are trying');
  });
});
