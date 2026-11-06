/**
 * The round trip (test plan R8; build brief section 6, P4): anything that can be typed → the state → drawn →
 * read back from the boxes → the same values. Aimed at the largest class of the September bugs: a box that shows
 * something other than what the plan holds.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { renderScreen, readForm, SCHEMA_C } from './_c.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { parse } from '../../../src/v7/router/routes.js';
import { checkScreen, savingsGrowthDrawn } from '../render/checkScreen.js';
import { applies as appliesTo } from '../../../src/answers/shared/validate.js';
import { money } from '../../../src/answers/shared/format.js';

const FIELDS = SCHEMA_C.fields.filter((f) => f.group !== 'try' && f.group !== 'shape');   // the spending shape's block has its own round trip (screens/spendShape.test.js)

/** Money as people type it: plain, with commas, with a pound sign, with a stray space. */
const typedMoney = (f) => fc.tuple(fc.integer({ min: f.min, max: f.max }), fc.constantFrom('plain', 'commas', 'pound', 'space'))
  .map(([n, how]) => (how === 'plain' ? String(n) : how === 'commas' ? money(n).slice(1) : how === 'pound' ? money(n) : ` ${n} `));

const typed = (f) => {
  if (f.type === 'choice') return fc.constantFrom(...f.options);
  if (f.type === 'yesNo') return fc.boolean();
  if (f.type === 'age') return fc.integer({ min: f.min, max: f.max }).map(String);
  if (f.type === 'percent') return fc.constantFrom('0', '0.05', '0.5', '1.35', '1.5%', '3', ' 0.8 ');   // the charge (6.19.0)
  return typedMoney(f);
};

/** Every field given a value, or (one time in four) left alone. */
const draftValues = fc.record(Object.fromEntries(FIELDS.map((f) => [f.path, fc.option(typed(f), { freq: 4, nil: undefined })])))
  .map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));

function stateWith(values, hash = '#/c/numbers') {
  const s = initialState({ today: '2026-09-30', build: 'test' });
  s.route = parse(hash);
  s.draft.c.values = values;
  s.ui.open = ['more'];
  return s;
}

// The one rule (validate.js applies: a `when` list is "one of", `whenNot` hides), over what is typed with each plain
// default filled in where nothing is, walked in the list's order as the checks walk it: a field that does not apply
// takes what hangs on it away too (couples-different-years.md 3.2).
const applies = (f, values) => {
  const live = {};
  for (const x of SCHEMA_C.fields) {
    if (!appliesTo(x, live)) continue;
    if (x === f) return true;
    const v = values[x.path] === undefined && typeof x.default !== 'object' ? x.default : values[x.path];
    if (v !== undefined) live[x.path] = v;
  }
  return false;
};

describe('the numbers step: typed → state → drawn → read back', () => {
  it('reads back exactly what the state holds, for anything that can be typed', () => {
    fc.assert(fc.property(draftValues, (values) => {
      // start.kind's default comes from a rule (the age); give it a value so the test needs no rule of its own.
      const v = { 'start.kind': 'now', ...values };
      const state = stateWith(v);
      const root = renderScreen(state);
      const back = readForm(root);
      for (const f of FIELDS) {
        if (f.path === 'household') { expect(back.household).toBe(v.household || 'single'); continue; }
        if (!applies(f, v)) { expect(back[f.path], `${f.path} is drawn but does not apply`).toBe(undefined); continue; }
        // how the savings grow (6.22.0): drawn once the savings box is above £0, "Mostly cash" unless chosen
        if (f.path === 'isaGrowth') { expect(back[f.path], f.path).toBe(savingsGrowthDrawn(state, 'c') ? (v[f.path] ?? 'cash') : undefined); continue; }
        if (v[f.path] !== undefined) expect(back[f.path], f.path).toBe(v[f.path]);
        else if (f.type === 'money' || f.type === 'age' || f.type === 'percent') expect(back[f.path], f.path).toBe('');
        else expect(back[f.path], f.path).toBe(f.default);
      }
      expect(Object.keys(back).filter((p) => !FIELDS.some((f) => f.path === p))).toEqual([]);
    }), { numRuns: 150, seed: 7 });
  });

  it('and the drawn screen keeps every rule of checkScreen whatever is typed', () => {
    fc.assert(fc.property(draftValues, fc.boolean(), (values, asked) => {
      const state = stateWith(values);
      state.draft.c.asked = asked;
      expect(checkScreen(renderScreen(state), state)).toEqual([]);
    }), { numRuns: 60, seed: 11 });
  });

  it('text that is not a figure is shown as typed, never tidied or dropped', () => {
    for (const text of ['25,00', '£', 'abc', ' 250000 ', '250.000,00', '0']) {
      const state = stateWith({ 'you.pot': text, 'you.age': text });
      const back = readForm(renderScreen(state));
      expect(back['you.pot']).toBe(text);
      expect(back['you.age']).toBe(text);
    }
  });

  it('removing the partner and adding them again loses nothing (the values stay in the state and come back)', () => {
    const values = { household: 'single', 'you.pot': '1', 'you.age': '60', 'partner.age': '61', 'partner.pot': '90,000' };
    expect(readForm(renderScreen(stateWith(values)))['partner.age']).toBe(undefined);
    const back = readForm(renderScreen(stateWith({ ...values, household: 'couple' })));
    expect(back['partner.age']).toBe('61');
    expect(back['partner.pot']).toBe('90,000');
  });
});

describe('the answer step with nothing usable typed: the short form round-trips too', () => {
  it('reads back the two boxes', () => {
    fc.assert(fc.property(fc.string({ maxLength: 8 }), (junk) => {
      const state = stateWith({ 'you.pot': junk, 'you.age': '' }, '#/c/answer');
      const back = readForm(renderScreen(state));
      expect(back['you.pot']).toBe(junk);
      expect(back['you.age']).toBe('');
    }), { numRuns: 40, seed: 3 });
  });
});
