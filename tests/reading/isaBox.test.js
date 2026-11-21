/**
 * The ISA box (field pots.isa; lead4.md D3, R3; step F1): both views fill it from ONE reader (src/reading/money.js isaBoxOf)
 * and a typed ISA is read back as the ISA today everywhere (services/PensionToday.js isaTodayPatch), whatever the ISA today was
 * read from before (the plan's figure, a pot record, or the ISA lines under What you hold). Every person and figure is made up.
 */
import { describe, it, expect } from 'vitest';
import { isaTodayOf, isaTodayPatch, pensionTodayOf, pensionTodayPatch } from '../../src/services/PensionToday.js';
import { isaBoxOf, isaToday } from '../../src/reading/money.js';

const NOW = new Date(2026, 10, 16, 12);
const TODAY = '2026-11-16';

/** Sam, 50, still saving, stops at 60: a pension on the plan, an ISA under What you hold. */
const sam = (more = {}) => ({
  id: 'sam', planDetails: { name: 'Sam' },
  stressTool: { settings: { configured: true, equityMin: 120000, bondMin: 60000, cashTarget: 20000, isaBalance: 0, baseSalary: 24000,
    currentAge: 50, currentAgeAsOf: TODAY, retired: false, retireAge: 60, duration: 35 } },
  decisionTool: { settings: { locked: false }, history: [], taxYears: {} },
  accumulationTool: { settings: { netMonthly: 300, schemeType: 'ras' }, history: [] },
  ...more
});
/** Sam's pension and ISA as listed under What you hold (the plan's own pots and ISA left as they were first typed). */
const withHoldings = (p) => ({ ...p, holdings: { lines: [{ id: 'h0', name: 'Workplace fund', wrapper: 'SIPP', value: 215000 }, { id: 'h1', name: 'Global index', wrapper: 'ISA', value: 30000 }] } });

/** Applies a patch of dotted paths, as a save would. */
function apply(plan, patch) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const [path, v] of Object.entries(patch)) {
    const keys = path.split('.'); let o = out;
    for (const k of keys.slice(0, -1)) o = o[k] = o[k] || {};
    o[keys[keys.length - 1]] = v;
  }
  return out;
}

describe('the ISA box says the ISA today', () => {
  it('a saver whose ISA is under What you hold: the box holds that figure, not the plan\'s £0', () => {
    const p = withHoldings(sam());
    expect(isaToday(p, { now: NOW }).value).toBe(30000);
    expect(isaBoxOf(p, { now: NOW })).toEqual({ value: 30000, today: true });
  });

  it('a typed ISA is read back as typed, over What you hold', () => {
    const p = withHoldings(sam());
    const patch = { 'stressTool.settings.isaBalance': 42000, ...isaTodayPatch(p, 42000, { now: NOW }) };
    const after = apply(p, patch);
    expect(isaTodayOf(after, { now: NOW }).value).toBe(42000);
    expect(isaBoxOf(after, { now: NOW }).value).toBe(42000);
    // the pension today is not moved by an ISA typed
    expect(pensionTodayOf(after, { now: NOW }).value).toBe(pensionTodayOf(p, { now: NOW }).value);
  });

  it('a typed ISA over a pot record with an ISA: this month\'s record carries the new ISA', () => {
    const p = sam({ accumulationTool: { settings: {}, history: [{ date: '2026-09', sipp: 210000, isa: 18000, gia: 0, total: 228000, isaEntered: true }] } });
    expect(isaBoxOf(p, { now: NOW }).value).toBe(18000);
    const after = apply(p, isaTodayPatch(p, 25000, { now: NOW }));
    expect(isaTodayOf(after, { now: NOW }).value).toBe(25000);
    expect(pensionTodayOf(after, { now: NOW }).value).toBe(210000);
  });

  it('a pension and an ISA typed together: both read back', () => {
    const p = withHoldings(sam());
    const pp = pensionTodayPatch(p, 250000, { now: NOW });
    const ip = isaTodayPatch(p, 41000, { now: NOW, history: pp['accumulationTool.history'] });
    const after = apply(p, { ...pp, ...ip });
    expect(pensionTodayOf(after, { now: NOW }).value).toBe(250000);
    expect(isaTodayOf(after, { now: NOW }).value).toBe(41000);
  });

  it('the ISA already read as typed writes nothing; the plan\'s own figure needs only the plan\'s ISA', () => {
    const p = withHoldings(sam());
    expect(isaTodayPatch(p, 30000, { now: NOW })).toEqual({});
    expect(isaTodayPatch(sam(), 5000, { now: NOW })).toEqual({});   // read from the plan: its isaBalance is the write
  });

  it('a locked plan has no box of its own here (its pots are the lock\'s); a plan drawing shows its own ISA', () => {
    expect(isaBoxOf(sam({ decisionTool: { settings: { locked: true }, history: [] } }), { now: NOW })).toBeNull();
    const drawing = sam(); drawing.stressTool.settings = { ...drawing.stressTool.settings, retired: true, retireAge: null, isaBalance: 9000 };
    expect(isaBoxOf(drawing, { now: NOW })).toEqual({ value: 9000, today: false });
  });
});
