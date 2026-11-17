/**
 * Your part in pounds, said the way it was typed (7.12.0, the saver brief's P2.8): step 1 of "Am I saving enough?" asks
 * whether the figure is what leaves take-home pay or what lands in the pension, and reads it that way. Fictional figures,
 * worked by hand: £300 leaves take-home pay, the provider adds the basic-rate tax back, so 300 × 1.25 = £375 goes in; with
 * the employer's £250 that is 375 + 250 = £625 a month in all. A part given before 7.12.0 (no way said) still lands as typed:
 * 300 + 250 = £550.
 */
import { describe, it, expect } from 'vitest';
import { payInParts } from '../../../src/answers/shared/payIn.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { splitLandsOf } from '../../../src/v7/state/select.js';
import { payInTo, payInEntered } from '../../../src/v7/components/payInTo.js';
import { B } from '../../../src/v7/copy/b.js';

describe('your part in pounds, as what leaves take-home pay', () => {
  it('lands × 1.25: £300 from take-home pay is £375 going in, £625 in all with £250 from the employer', () => {
    const p = payInParts({ kind: 'split', own: 300, employer: 250, ownFrom: 'takeHome' });
    expect(p.own).toBe(375);
    expect(p.employer).toBe(250);
    expect(p.total).toBe(625);
  });

  it('a part given before 7.12.0, with no way said, still lands as typed: 300 + 250 = 550', () => {
    expect(payInParts({ kind: 'split', own: 300, employer: 250 }).total).toBe(550);
    expect(payInParts({ kind: 'split', own: 300, employer: 250, ownFrom: 'lands' }).total).toBe(550);
  });

  it('B asks it, inside "your part and your employer\'s", with no default (not answered is what lands)', () => {
    const f = SCHEMA_B.fields.find((x) => x.path === 'you.payIn.ownFrom');
    expect(f).toMatchObject({ type: 'choice', options: ['takeHome', 'lands'], when: { 'you.payIn.kind': 'split' } });
    expect('default' in f).toBe(false);
    const checked = checkInputs(SCHEMA_B, { you: { age: 45, pot: 120000, payIn: { kind: 'split', own: 300, employer: 250 } }, stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 } }, { today: '2026-11-16' });
    expect(checked.inputs.you.payIn.ownFrom).toBeUndefined();
  });

  it('the form says it: the choice names take-home pay, and the line under the boxes says £375 going in from you', () => {
    expect(B.fields['you.payIn.ownFrom'].options.takeHome).toMatch(/take-home pay/);
    const lands = splitLandsOf({ 'you.payIn.kind': 'split', 'you.payIn.own': 300, 'you.payIn.employer': 250, 'you.payIn.ownFrom': 'takeHome' });
    expect(lands).toMatchObject({ own: 375, employer: 250, total: 625, takeHome: true });
  });

  it('choosing "your part and your employer\'s" on a new form answers it: take-home pay', () => {
    let s = initialState({ build: 'test', today: '2026-11-16' });
    s = reduce(s, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' });
    expect(s.draft.b.values['you.payIn.ownFrom']).toBe('takeHome');
    // said already (a plan's figures, which land): left as it is
    s = reduce(s, { type: 'draft/set', q: 'b', path: 'you.payIn.ownFrom', value: 'lands' });
    s = reduce(s, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'total' });
    s = reduce(s, { type: 'draft/set', q: 'b', path: 'you.payIn.kind', value: 'split' });
    expect(s.draft.b.values['you.payIn.ownFrom']).toBe('lands');
  });

  it('"Pay in more" writes your part back in take-home pounds: £750 in all is (750 − 250) × 0.8 = £400 from take-home pay', () => {
    const v = { 'you.payIn.kind': 'split', 'you.payIn.own': 300, 'you.payIn.employer': 250, 'you.payIn.ownFrom': 'takeHome' };
    const entered = payInEntered(v, 'you');
    expect(entered.total).toBe(625);
    const acts = payInTo('b', 'you', entered, 750);
    expect(acts.find((a) => a.path === 'you.payIn.own').value).toBe('400');
  });
});
