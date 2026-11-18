/**
 * A full-view Save writes only what the person changed (src/ui/settingsChanged.js, lead4.md D1).
 */
import { describe, it, expect } from 'vitest';
import { changedSettingsPatch, stressSavePatch, ownPotAtRetirement, touches, TIMING_KEYS } from '../../src/ui/settingsChanged.js';

const filled = { baseSalary: 24000, pa: 12570, hodlValue: 25000, recoveryBuffer: 15000, equityMin: 0, bondMin: 0, cashTarget: 0, incomeSteps: [], spStartDate: null };

describe('a Save writes only the boxes changed', () => {
  it('nothing changed: nothing written', () => {
    expect(changedSettingsPatch(filled, { ...filled })).toEqual({});
    expect(stressSavePatch({ base: filled, form: { ...filled } })).toEqual({});
  });

  it('one box changed: that key and the mark that Settings were given, never the defaults beside it', () => {
    const p = stressSavePatch({ base: filled, form: { ...filled, spStartDate: '2040-03-01' } });
    expect(p).toEqual({ spStartDate: '2040-03-01', configured: true });
    expect(p).not.toHaveProperty('hodlValue');
    expect(p).not.toHaveProperty('pa');
  });

  it('lists and objects compare by value', () => {
    expect(changedSettingsPatch({ incomeSteps: [{ fromAge: 60, amount: 1 }] }, { incomeSteps: [{ fromAge: 60, amount: 1 }] })).toEqual({});
    expect(changedSettingsPatch({ incomeSteps: [] }, { incomeSteps: [{ fromAge: 60, amount: 1 }] })).toEqual({ incomeSteps: [{ fromAge: 60, amount: 1 }] });
  });

  it('a plan with no figures: its first change writes its pots and income as shown (empty boxes are none), never a default', () => {
    const p = stressSavePatch({ base: filled, form: { ...filled, spStartDate: '2040-03-01' }, hadFigures: false });
    expect(p).toMatchObject({ spStartDate: '2040-03-01', equityMin: 0, bondMin: 0, cashTarget: 0, baseSalary: 24000, incomeSteps: [], configured: true });
    expect(p).not.toHaveProperty('hodlValue');
  });

  it('with no baseline (the form never filled) every key is the change', () => {
    expect(changedSettingsPatch(null, { a: 1 })).toEqual({ a: 1 });
  });

  it('pots at the stop are kept only when the person typed them', () => {
    expect(ownPotAtRetirement({ sipp: 1, isa: 2, source: 'worked' })).toBe(null);
    expect(ownPotAtRetirement({ sipp: 1, isa: 2, source: 'accumulation' })).toBe(null);
    expect(ownPotAtRetirement({ sipp: 1, isa: 2, source: 'override' })).toEqual({ sipp: 1, isa: 2, source: 'override' });
    expect(touches({ retireAge: 60 }, TIMING_KEYS)).toBe(true);
    expect(touches({ pa: 1 }, TIMING_KEYS)).toBe(false);
  });
});
