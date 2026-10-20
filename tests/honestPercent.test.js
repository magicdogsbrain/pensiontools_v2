/**
 * 6.33.0 sweep: a percentage never rounds a near miss into a clean 100% (or a trace into 0%), and the strategy the
 * page names is the one the test runs.
 */
import { describe, it, expect } from 'vitest';
import { pctText, tenthsOutOfTen } from '../src/services/OneAnswer.js';
import { strategyOf } from '../src/storage/ScenarioRepository.js';
import { earliestAt, sweepHeadline } from '../src/services/RetireSweep.js';
import { jointVerdictHtml } from '../src/services/OnCourse.js';

describe('pctText', () => {
  it('rounds as usual away from the ends', () => {
    expect(pctText(98.4)).toBe('98%');
    expect(pctText(50)).toBe('50%');
    expect(pctText(12.34, 1)).toBe('12.3%');
  });
  it('never says 100% while anything fell short, nor 0% while anything happened', () => {
    expect(pctText(99.8)).toBe('99.8%');
    expect(pctText(99.5)).toBe('99.5%');
    expect(pctText(99.96)).toBe('99.96%');
    expect(pctText(99.999)).toBe('99.99%');
    expect(pctText(0.3)).toBe('0.3%');
    expect(pctText(0.001)).toBe('under 0.01%');
    expect(pctText(0.004)).toBe('under 0.01%');
    expect(pctText(99.96, 1)).toBe('99.96%');
    expect(pctText(0.04, 1)).toBe('0.04%');
  });
  it('exactly 0 and 100 (and nonsense) read as themselves', () => {
    expect(pctText(100)).toBe('100%');
    expect(pctText(0)).toBe('0%');
    expect(pctText(null)).toBe('0%');
    expect(pctText(120)).toBe('100%');
  });
});

describe('pctText with lines the words change at', () => {
  it('never across a bar, however close', () => {
    expect(pctText(89.6, 0, 90)).toBe('89.6%');
    expect(pctText(89.996, 0, 90)).toBe('89.99%');
    expect(pctText(74.9996, 0, [90, 75, 50])).toBe('74.99%');
    expect(pctText(10.4, 1, [10, 25, 50])).toBe('10.4%');
    expect(pctText(9.96, 1, [10, 25, 50])).toBe('9.96%');
    expect(pctText(90, 0, 90)).toBe('90%');
    expect(pctText(92.3, 0, [90, 75])).toBe('92%');
  });
});

describe('tenthsOutOfTen', () => {
  it('never 10.0 while a future failed, never 0.0 while one lasted', () => {
    expect(tenthsOutOfTen(0.998)).toBe('9.9');
    expect(tenthsOutOfTen(1)).toBe('10.0');
    expect(tenthsOutOfTen(0.004)).toBe('0.1');
    expect(tenthsOutOfTen(0)).toBe('0.0');
    expect(tenthsOutOfTen(0.87)).toBe('8.7');
    expect(tenthsOutOfTen(0.896)).toBe('8.9');
    expect(tenthsOutOfTen(0.9)).toBe('9.0');
  });
});

describe('the on-course words never round across the bar', () => {
  it('89.6% is "not on course" and does not say 90%', () => {
    const w = jointVerdictHtml(0.896);
    expect(w).toMatch(/Not on course/);
    expect(w).toContain('89.6%');
  });
  it('the age spin: 89.6% is not on course, and is said as 89.6%', () => {
    const rows = [{ age: 60, success: 89.6, coverage: 99.7 }, { age: 61, success: 92, coverage: 100 }];
    expect(earliestAt(rows, 90)).toMatchObject({ age: 61, met: true });
    const h = sweepHeadline({ rows: [{ age: 60, success: 89.6 }], income: 40000, basis: 'the middle band' }, 90);
    expect(h).toContain('89.6%');
    expect(h).not.toMatch(/ 90%/);
  });
});

describe('strategyOf: the strategy the page names is the one the test runs', () => {
  const block = { id: 'full-il-gilt', params: { a: 1 }, lockedAt: 'x', engineVersion: 'y' };
  it('agrees → the block as stored', () => {
    expect(strategyOf({ strategy: block, stressTool: { settings: { strategyId: 'full-il-gilt' } } })).toBe(block);
  });
  it('apart → the tested id, without the other strategy\'s params', () => {
    expect(strategyOf({ strategy: block, stressTool: { settings: { strategyId: 'gilt-rotation' } } })).toMatchObject({ id: 'gilt-rotation', params: {} });
  });
  it('no strategyId in the stress settings → Pots & Valves, as the test runs it', () => {
    expect(strategyOf({ strategy: block, stressTool: { settings: {} } }).id).toBe('pots-and-valves');
  });
  it('no stress settings at all → the block as before; no block → the default', () => {
    expect(strategyOf({ strategy: block })).toBe(block);
    expect(strategyOf({}).id).toBe('pots-and-valves');
  });
});
