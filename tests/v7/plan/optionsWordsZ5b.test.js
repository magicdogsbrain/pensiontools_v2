/**
 * Ruling Z5b: internal words are not shown on "Everything else this plan uses". The State Pension kept the older way says
 * the amount a year and the tax year it starts, as a person would (never "Years after the first tax year: 2"); where
 * Month by month's settings were copied from is machinery, never listed unless every setting is asked for, and then in
 * words (never "From: stress").
 */
import { describe, it, expect } from 'vitest';
import { optionsFor } from '../../../src/answers/plan/options.js';
import { PLAN } from '../../../src/v7/copy/plan.js';

const ss = { statePension: 12000, statePensionYear: 12, shapeAgeNow: 62, firstTaxYear: 2026 };

describe('the State Pension kept the older way', () => {
  it('says £12,000 a year from 2031/32 (67 − 62 = 5 years on from 2026/27)', () => {
    const row = optionsFor(ss, {}, null, { all: true }).find((r) => r.id === 'inc.state-pension-old');
    expect(row.set).toBe(true);
    expect(row.facts).toEqual([{ k: 'yearly', v: 12000, kind: 'money' }, { k: 'fromYear', v: '2031/32', kind: 'text' }]);
    const w = PLAN.options['inc.state-pension-old'];
    expect(w.name).not.toMatch(/older way|a yearly figure and a year/);
    expect(w.facts.fromYear).not.toMatch(/Years after/);
  });
});

describe('where Month by month\'s settings were copied from', () => {
  it('is never listed as changed, and is said in words', () => {
    const row = optionsFor({}, { seededFrom: 'stress' }, null, { all: true }).find((r) => r.id === 'month.seeded');
    expect(row.set).toBe(false);
    expect(optionsFor({}, { seededFrom: 'stress' }, null).some((r) => r.id === 'month.seeded')).toBe(false);
    const w = PLAN.options['month.seeded'];
    expect(w.name).not.toMatch(/a copy came from/);
    expect(w.values.from.stress).toBeTruthy();
    expect(w.values.from.stress).not.toMatch(/stress/i);
  });
});
