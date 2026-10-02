/**
 * The round trip for B (test plan R8; step 4 brief 6, P5): anything that can be typed → the state → drawn → read
 * back from the boxes → the same values; and the drawn screen keeps every rule of checkScreen whatever is typed.
 * A's suite (tests/v7/a/roundTrip.test.js), over B's list.
 */
import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import { renderScreen, readForm, SCHEMA_B } from './_b.js';
import { initialState, emptySaverDraft, emptySaverAnswer } from '../../../src/v7/state/initial.js';
import { checkScreen } from '../render/checkScreen.js';
import { applies as appliesTo } from '../../../src/answers/shared/validate.js';
import { isRetired } from '../../../src/v7/state/select.js';
import { money } from '../../../src/answers/shared/format.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

/** Money as people type it: plain, with commas, with a pound sign, with a stray space. */
const typedMoney = (f) => fc.tuple(fc.integer({ min: f.min, max: f.max }), fc.constantFrom('plain', 'commas', 'pound', 'space'))
  .map(([n, how]) => (how === 'plain' ? String(n) : how === 'commas' ? money(n).slice(1) : how === 'pound' ? money(n) : ` ${n} `));

const typed = (f) => {
  if (f.type === 'choice') return fc.constantFrom(...f.options);
  if (f.type === 'yesNo') return fc.boolean();
  if (f.type === 'age' || f.type === 'count') return fc.integer({ min: f.min, max: f.max }).map(String);
  if (f.type === 'percent') return fc.constantFrom('0', '0.05', '0.5', '1', '1.5%', '2', '2.95', ' 0.8 ');
  return typedMoney(f);
};

/** A state of question q on a step, with these values typed and "more detail" open. */
function stateWith(q, values, step = 'numbers') {
  const s = initialState({ today: '2026-09-30', build: 'test' });
  for (const x of ['a', 'b']) { s.draft[x] = s.draft[x] || emptySaverDraft(); s.answers[x] = s.answers[x] || emptySaverAnswer(); }
  s.route = { screen: 'step', q, step, planId: null, focus: null };
  s.draft[q].values = values;
  s.ui.open = ['more'];
  return s;
}

function roundTripSuite(q, schema, read) {
  const FIELDS = schema.fields.filter((f) => f.group !== 'shape');   // the spending shape's block has its own round trip (screens/spendShape.test.js)
  const draftValues = fc.record(Object.fromEntries(FIELDS.map((f) => [f.path, fc.option(typed(f), { freq: 4, nil: undefined })])))
    .map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
  // The one rule (validate.js applies: a `when` list is "one of", `whenNot` hides), over what is typed with each plain
  // default filled in where nothing is, walked in the list's order as the checks walk it: a field that does not apply
  // takes what hangs on it away too (couples-different-years.md 3.2).
  const applies = (f, values) => {
    const live = {};
    for (const x of FIELDS) {
      if (!appliesTo(x, live)) continue;
      if (x === f) return true;
      const v = values[x.path] === undefined ? x.default : values[x.path];
      if (v !== undefined) live[x.path] = v;
    }
    return false;
  };

  describe(`${q.toUpperCase()}, the numbers step: typed → state → drawn → read back`, () => {
    it('reads back exactly what the state holds, for anything that can be typed', () => {
      fc.assert(fc.property(draftValues, (values) => {
        const state = stateWith(q, values);
        const root = renderScreen(state);
        const back = read(root);
        // Someone who has stopped (the stop at or before today's age, at State Pension age) gets the retired view: no boxes.
        if (isRetired(state, q)) { expect(root.querySelector('input')).toBe(null); return; }
        for (const f of FIELDS) {
          if (f.path === 'household') { expect(back.household).toBe(values.household || 'single'); continue; }
          // the spending is the spend step's (the budget step), never on this one
          if (f.group === 'spend') { expect(back[f.path], `${f.path} is on the numbers step`).toBe(undefined); continue; }
          if (!applies(f, values)) { expect(back[f.path], `${f.path} is drawn but does not apply`).toBe(undefined); continue; }
          if (values[f.path] !== undefined) expect(back[f.path], f.path).toBe(values[f.path]);
          else if (['money', 'age', 'percent', 'count'].includes(f.type)) expect(back[f.path], f.path).toBe('');
          else expect(back[f.path], f.path).toBe(f.default);
        }
        expect(Object.keys(back).filter((p) => !FIELDS.some((f) => f.path === p))).toEqual([]);
      }), { numRuns: 120, seed: 7 });
    });

    it('and the drawn screen keeps every rule of checkScreen whatever is typed', () => {
      fc.assert(fc.property(draftValues, fc.boolean(), (values, asked) => {
        const state = stateWith(q, values);
        state.draft[q].asked = asked;
        expect(checkScreen(renderScreen(state), state)).toEqual([]);
      }), { numRuns: 50, seed: 11 });
    });

    it('text that is not a figure is shown as typed, never tidied or dropped', () => {
      for (const text of ['25,00', '£', 'abc', ' 250000 ', '250.000,00', '0']) {
        const back = read(renderScreen(stateWith(q, { 'you.pot': text, 'you.age': text, 'stop.age': text })));
        expect(back['you.pot']).toBe(text);
        expect(back['you.age']).toBe(text);
        expect(back['stop.age']).toBe(text);
      }
    });

    it('removing the partner and adding them again loses nothing', () => {
      const values = { household: 'single', 'you.pot': '1', 'you.age': '50', 'partner.age': '48', 'partner.pot': '90,000', 'partner.payIn.total': '300' };
      expect(read(renderScreen(stateWith(q, values)))['partner.age']).toBe(undefined);
      const back = read(renderScreen(stateWith(q, { ...values, household: 'couple' })));
      expect(back['partner.age']).toBe('48');
      expect(back['partner.payIn.total']).toBe('300');
    });
  });

  describe(`${q.toUpperCase()}, the spend step (the budget step): the spending, typed → state → drawn → read back`, () => {
    const SPEND = FIELDS.filter((f) => f.group === 'spend');
    it('reads back exactly what the state holds — and only the spending, whatever else is typed', () => {
      fc.assert(fc.property(draftValues, fc.constantFrom(null, 'lines', 'one'), (values, how) => {
        const state = stateWith(q, values, 'spend');
        state.draft[q].spendHow = how;
        const root = renderScreen(state);
        if (isRetired(state, q)) { expect(root.querySelector('input')).toBe(null); return; }
        const back = read(root);
        for (const f of SPEND) {
          if (!applies(f, values)) { expect(back[f.path], `${f.path} is drawn but does not apply`).toBe(undefined); continue; }
          if (values[f.path] !== undefined) expect(back[f.path], f.path).toBe(values[f.path]);
          else if (f.type === 'money') expect(back[f.path], f.path).toBe('');
          else expect(back[f.path], f.path).toBe(f.default);
        }
        expect(Object.keys(back).filter((p) => p !== 'household' && !SPEND.some((f) => f.path === p))).toEqual([]);
        expect(checkScreen(root, state)).toEqual([]);
      }), { numRuns: 80, seed: 17 });
    });
  });

  describe(`${q.toUpperCase()}, the answer step with nothing usable typed: the short form round-trips too`, () => {
    it('reads back the boxes it asks for, whatever is in them', () => {
      fc.assert(fc.property(fc.string({ maxLength: 8 }), fc.string({ maxLength: 4 }), (junk, age) => {
        const state = stateWith(q, { 'you.pot': junk, 'you.age': age, 'spend.amount': junk }, 'answer');
        const root = renderScreen(state);
        const back = read(root);
        expect(back['you.pot']).toBe(junk);
        expect(back['you.age']).toBe(age);
        expect(back['spend.amount']).toBe(junk);
        expect(checkScreen(root, state)).toEqual([]);
      }), { numRuns: 30, seed: 3 });
    });
  });
}

roundTripSuite('b', SCHEMA_B, (root) => readForm(root, 'b'));
