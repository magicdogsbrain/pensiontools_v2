import { describe, it, expect } from 'vitest';
import { deriveStage, decisionEntryAllowed, arrivalCheck, journeyAppend, APPROACHING_YEARS, STAGES } from '../src/services/LifeStage.js';

const NOW = new Date(2026, 8, 10);
const sc = (stress, decision = {}, extra = {}) => ({ stressTool: { settings: stress }, decisionTool: { settings: decision, history: [], taxYears: {} }, ...extra });

describe('deriveStage — the persona matrix', () => {
  it('mid-career saver: retire at 62 at 45 → Saving', () => {
    const st = deriveStage(sc({ currentAge: 45, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 62 }), NOW);
    expect(st.key).toBe('saving');
    expect(st.leads).toContain('accumulation');
    expect(st.hidden).toEqual(['transition']);   // nothing to transition yet (6.8.0)
    expect(st.yearsToStart).toBeGreaterThan(APPROACHING_YEARS);
  });
  it('approaching: retire at 60 at 57 → Approaching (within five years)', () => {
    const st = deriveStage(sc({ currentAge: 57, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }), NOW);
    expect(st.key).toBe('approaching');
    expect(st.banner.text).toMatch(/lock the plan/);
  });
  it('Wendy: locked while saving, two years to go → Committed, still saving; Decision gated', () => {
    const st = deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }, { planDocument: { pots: {} } }), NOW);
    expect(st.key).toBe('committed-saving');
    expect(st.readOnly).toEqual(['stress', 'strategies']);
    expect(st.hidden).toEqual([]);
    expect(st.chip).toMatch(/to go/);
    expect(st.banner.text).toContain('2028/29');
    expect(decisionEntryAllowed(st, '2026-10').ok).toBe(false);
    expect(decisionEntryAllowed(st, '2028-04').ok).toBe(true);
    expect(decisionEntryAllowed(st, '2028-03').ok).toBe(false);   // March 2028 is still 27/28
  });
  it('Chris in September: retired, locked, before the start → Bridge; accumulation hidden', () => {
    const st = deriveStage(sc({ currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, spStartDate: '21 April 2037' }, { locked: true }), NOW);
    expect(st.key).toBe('bridge');
    expect(st.hidden).toEqual(['accumulation']);
    expect(st.chip).toBe('7 months to go');
    expect(decisionEntryAllowed(st, '2026-09').ok).toBe(true);   // bridge months are recorded
  });
  it('Chris from April 2027: Running', () => {
    const st = deriveStage(sc({ currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027 }, { locked: true }), new Date(2027, 4, 1));
    expect(st.key).toBe('running');
    expect(st.banner).toBeNull();
  });
  it('retrospective adopter: retired, draft, plan starts this tax year → Draft, retired; accumulation hidden', () => {
    const st = deriveStage(sc({ currentAge: 68, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026 }), NOW);
    expect(st.key).toBe('draft-retired');
    expect(st.hidden).toEqual(['accumulation']);
    expect(st.beforeStart).toBe(false);
  });
  it('legacy plan (no age today): unknown while draft; locked counts as running', () => {
    expect(deriveStage(sc({ shapeAgeNow: 57 }), NOW).key).toBe('unknown');
    expect(deriveStage(sc({ shapeAgeNow: 57 }, { locked: true }), new Date(2028, 0, 1)).key).toBe('running');
  });
  it('the demo / empty scenario does not throw', () => {
    expect(deriveStage({}, NOW).key).toBe('unknown');
    expect(deriveStage(null, NOW).key).toBe('unknown');
  });
  it('every stage definition is complete', () => {
    for (const d of Object.values(STAGES)) { expect(Array.isArray(d.leads)).toBe(true); expect(Array.isArray(d.readOnly)).toBe(true); expect(Array.isArray(d.hidden)).toBe(true); }
  });
});

describe('arrivalCheck', () => {
  const wendyDoc = { pots: { sipp: 500000, potAtRetirement: { sipp: 620000 } } };
  const after = deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }), new Date(2028, 4, 1));
  it('within 10% → runs as locked', () => {
    const a = arrivalCheck(after, wendyDoc, { sipp: 600000 });
    expect(a.within).toBe(true);
    expect(a.message).toMatch(/within 10%/);
  });
  it('beyond 10% → offers the choice', () => {
    const a = arrivalCheck(after, wendyDoc, { sipp: 500000 });
    expect(a.within).toBe(false);
    expect(a.message).toMatch(/unlock and re-plan/);
  });
  it('nothing to check before the start, for retirees, or without a document', () => {
    const before = deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }), NOW);
    expect(arrivalCheck(before, wendyDoc, { sipp: 1 })).toBeNull();
    const chris = deriveStage(sc({ currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027 }, { locked: true }), new Date(2027, 4, 1));
    expect(arrivalCheck(chris, wendyDoc, { sipp: 1 })).toBeNull();
    expect(arrivalCheck(after, null, { sipp: 1 })).toBeNull();
  });
});

describe('journeyAppend', () => {
  it('records stage changes once, with dates, and keeps the last 40', () => {
    const a = deriveStage(sc({ currentAge: 45, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 62 }), NOW);
    let j = journeyAppend([], a, NOW);
    expect(j).toHaveLength(1);
    expect(journeyAppend(j, a, NOW)).toBe(j);   // same stage → same array
    const b = deriveStage(sc({ currentAge: 57, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }), NOW);
    j = journeyAppend(j, b, new Date(2027, 0, 1), 'lock');
    expect(j[1]).toMatchObject({ stage: 'approaching', note: 'lock' });
  });
});
