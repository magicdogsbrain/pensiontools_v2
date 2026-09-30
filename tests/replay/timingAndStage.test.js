/**
 * Bug replays — when the plan starts, and the life stage the app puts a person in.
 * Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect } from 'vitest';
import { deriveTiming, describeTiming } from '../../src/services/PlanTiming.js';
import { deriveStage, decisionEntryAllowed, STAGES } from '../../src/services/LifeStage.js';
import { at, SEPT_2026 } from './_replay.js';

const scenario = (stress, decision = {}, extra = {}) => ({ stressTool: { settings: stress }, decisionTool: { settings: decision, history: [], taxYears: {} }, ...extra });
const chris = { currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, spStartDate: '21 April 2037', spWeeklyAmount: 230 };

describe('the plan\'s first tax year', () => {
  it('R6.4.0-a — a saved start does not slide a year later on 1 January', () => {
    expect(deriveTiming(chris, SEPT_2026).firstTaxYear).toBe(2027);
    expect(deriveTiming(chris, at(2026, 12, 31)).firstTaxYear).toBe(2027);
    expect(deriveTiming(chris, at(2027, 1, 1)).firstTaxYear).toBe(2027);     // was "the calendar year after today" → 2028
    expect(deriveTiming(chris, at(2027, 4, 5)).firstTaxYear).toBe(2027);
  });
});

describe('someone who retires on a birthday, not on 6 April', () => {
  // "QA Approaching 59 lock": 59 in September 2026, October birthday, retiring at 61 → October 2027.
  const p3 = { currentAge: 59, currentAgeAsOf: '2026-09-11', spStartDate: '20 October 2034', spWeeklyAmount: 230, retired: false, retireAge: 61 };
  const today = at(2026, 9, 11);

  it('P3 — the countdown is to the retirement month (13 months), not to the plan\'s tax year (7)', () => {
    const t = deriveTiming(p3, today);
    expect(t.firstTaxYear).toBe(2027);             // the ladder still buys whole tax years
    expect(t.startMonth).toBe('2027-10');
    expect(t.bridgeMonths).toBe(13);
    expect(describeTiming(t, p3, today)).toMatch(/You retire in October 2027 at 61, 13 months away/);
  });

  it('P3 — a locked plan stays "committed, still saving" and the Decision tool stays shut until that month', () => {
    const april = deriveStage(scenario(p3, { locked: true }), at(2027, 4, 20));   // plan year 0 has begun; still working
    expect(april.key).toBe('committed-saving');
    expect(decisionEntryAllowed(april, '2027-04').ok).toBe(false);
    expect(decisionEntryAllowed(april, '2027-09').ok).toBe(false);
    expect(decisionEntryAllowed(april, '2027-10').ok).toBe(true);
    expect(decisionEntryAllowed(april, '2027-09').reason).toMatch(/retire in October 2027/);
    expect(deriveStage(scenario(p3, { locked: true }), at(2027, 10, 21)).key).toBe('running');
  });
});

describe('a plan locked and started the same day', () => {
  // "QA Retiring now 60": retired, plan starts this tax year, locked → Running at once.
  const p4 = { currentAge: 60, currentAgeAsOf: '2026-09-11', retired: true, firstTaxYear: 2026 };
  const st = deriveStage(scenario(p4, { locked: true }), at(2026, 9, 11));

  it('P4b — the Transition tab is still there while Running: nothing has been bought yet', () => {
    expect(st.key).toBe('running');
    expect(st.hidden).not.toContain('transition');
  });
});

describe('the months before year 0 for someone already retired', () => {
  const st = deriveStage(scenario(chris, { locked: true }), SEPT_2026);

  it('R6.11.1 — they are the "run-up", never a "bridge", in the chip, the label and the banner', () => {
    expect(st.key).toBe('bridge');                 // the internal key is unchanged; the words are what the owner objected to
    for (const text of [st.label, st.chip, st.banner.text, STAGES.bridge.label, STAGES.bridge.chip]) expect(text).not.toMatch(/bridge/i);
    expect(st.banner.text).toMatch(/SIPP cash/);
  });

  it('R6.13.3-b — the stage says "Retired": the run-up is not a countdown to retirement', () => {
    expect(st.label).toMatch(/^Retired/);
    expect(st.retired).toBe(true);
    expect(decisionEntryAllowed(st, '2026-09').ok).toBe(true);    // run-up months are recorded
  });
});
