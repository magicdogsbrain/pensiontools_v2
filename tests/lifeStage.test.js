import { describe, it, expect } from 'vitest';
import { deriveStage, decisionEntryAllowed, arrivalCheck, journeyAppend, APPROACHING_YEARS, STAGES, openingTab, accumulationAgesOf } from '../src/services/LifeStage.js';

const NOW = new Date(2026, 8, 10);
const sc = (stress, decision = {}, extra = {}) => ({ stressTool: { settings: stress }, decisionTool: { settings: decision, history: [], taxYears: {} }, ...extra });

describe('deriveStage — the persona matrix', () => {
  it('mid-career saver: retire at 62 at 45 → Saving', () => {
    const st = deriveStage(sc({ currentAge: 45, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 62 }), NOW);
    expect(st.key).toBe('saving');
    expect(st.leads).toContain('accumulation');
    expect(st.hidden).toEqual([]);   // Transition stays visible: it is where holdings are recorded (6.13.0); it does not lead yet
    expect(st.leads).not.toContain('transition');
    expect(st.yearsToStart).toBeGreaterThan(APPROACHING_YEARS);
  });
  it('the Transition tab is never hidden — it holds the What-you-hold record; it only LEADS from Approaching to the start', () => {
    for (const [stress, decision, at] of [
      [{ currentAge: 45, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 62 }, {}, NOW],          // saving
      [{ shapeAgeNow: 64 }, {}, NOW],                                                                       // unknown (legacy draft)
      [{}, {}, NOW],                                                                                        // empty
      [{ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2027 }, { locked: true }, new Date(2027, 4, 1)]   // running
    ]) expect(deriveStage(sc(stress, decision), at).hidden).not.toContain('transition');
    for (const key of ['approaching', 'committed-saving', 'bridge', 'draft-retired']) {
      const st = { approaching: deriveStage(sc({ currentAge: 57, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }), NOW),
        'committed-saving': deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }), NOW),
        bridge: deriveStage(sc({ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2027 }, { locked: true }), NOW),
        'draft-retired': deriveStage(sc({ currentAge: 68, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026 }), NOW) }[key];
      expect(st.key).toBe(key);
      expect(st.leads).toContain('transition');
    }
  });
  it('approaching: retire at 60 at 57 → Approaching (within five years)', () => {
    const st = deriveStage(sc({ currentAge: 57, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }), NOW);
    expect(st.key).toBe('approaching');
    // on course first, the lock and the move when ready — never the next step (release step R2, saving-enough-and-check-in.md 4.3)
    expect(st.banner.text).toMatch(/Check you are on course \(Accumulation\)/);
    expect(st.banner.text).toMatch(/locking it and moving what you hold come when you are ready/);
    expect(st.banner.text).not.toMatch(/start moving your holdings/);
  });
  it('Sam: locked while saving, two years to go → Committed, still saving; Decision gated', () => {
    const st = deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }, { planDocument: { pots: {} } }), NOW);
    expect(st.key).toBe('committed-saving');
    expect(st.readOnly).toEqual(['stress', 'strategies']);
    expect(st.hidden).toEqual([]);
    expect(st.chip).toMatch(/to go/);
    // the month work stops, and within five years the move offered as a choice; never "buying the target portfolio" (R2)
    expect(st.banner.text).toContain('you stop work in September 2028');
    expect(st.banner.text).toContain('Moving what you hold to the plan\'s mix can start now, if you want to.');
    expect(st.banner.text).not.toMatch(/target portfolio/);
    expect(st.banner.tab).toBe('accumulation');
    expect(decisionEntryAllowed(st, '2026-10').ok).toBe(false);
    // No SP date → the birthday is taken as the date the age was recorded (10 Sept): she retires September 2028
    expect(st.startMonth).toBe('2028-09');
    expect(decisionEntryAllowed(st, '2028-09').ok).toBe(true);
    expect(decisionEntryAllowed(st, '2028-08').ok).toBe(false);   // plan year 0 has begun, but she is still working
  });
  it('a locked future retiree stays "committed, saving" until the retirement MONTH, not the tax year (6.10.3)', () => {
    const s = { currentAge: 59, currentAgeAsOf: '2026-09-11', spStartDate: '20 October 2034', retired: false, retireAge: 61 };
    const inSept27 = deriveStage(sc(s, { locked: true }), new Date(2027, 8, 15));   // plan year 0 (2027/28) has begun, retirement is October
    expect(inSept27.key).toBe('committed-saving');
    expect(inSept27.startMonth).toBe('2027-10');
    expect(inSept27.monthsToStart).toBe(1);
    expect(decisionEntryAllowed(inSept27, '2027-09').ok).toBe(false);
    expect(decisionEntryAllowed(inSept27, '2027-09').reason).toMatch(/retire in October 2027/);
    expect(decisionEntryAllowed(inSept27, '2027-10').ok).toBe(true);
    expect(deriveStage(sc(s, { locked: true }), new Date(2027, 9, 21)).key).toBe('running');
  });
  // Re-written in 6.51.0 (research/plan-start.md §2 D, §7): the bridge is now only a start CHOSEN for later — Alex stopped
  // work in July 2026 and chose to start the plan's income next April. (The same plan with no stop month derives the same
  // stage, as every plan saved before 6.51.0 does.) Someone who stopped in an earlier tax year is running: the case after.
  it('Alex in September: stopped in July, chose next April, locked, before the start → Bridge; accumulation hidden', () => {
    const alexD = { currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2027, spStartDate: '12 June 2030', stoppedWork: '2026-07' };
    const st = deriveStage(sc(alexD, { locked: true }), NOW);
    expect(st.key).toBe('bridge');
    expect(st.hidden).toEqual(['accumulation']);
    expect(st.chip).toBe('7 months to go');
    expect(st.banner.text).toBe('Retired; the plan\'s income starts in 2027/28. Record each month in the Decision tool: the months until then are recorded, not compared with the plan. The plan\'s steps, and any ladder\'s rungs, begin in 2027/28.');
    expect(decisionEntryAllowed(st, '2026-09').ok).toBe(true);   // the months before the start are recorded
    const { stoppedWork, ...noMonth } = alexD;
    expect(deriveStage(sc(noMonth, { locked: true }), NOW).key).toBe('bridge');
  });
  it('stopped in an earlier tax year with the plan\'s income from then: running (plan year 3), never the bridge', () => {
    const st = deriveStage(sc({ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, stoppedWork: '2023-10', firstTaxYear: 2023, spStartDate: '12 June 2030' }, { locked: true }), NOW);
    expect(st.key).toBe('running');
    expect([st.beforeStart, st.planYearNow, st.stoppedWork]).toEqual([false, 3, '2023-10']);
    expect(deriveStage(sc({ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, stoppedWork: '2023-10' }), NOW).key).toBe('draft-retired');
  });
  it('Alex from April 2027: Running', () => {
    const st = deriveStage(sc({ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2027 }, { locked: true }), new Date(2027, 4, 1));
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
    expect(deriveStage(sc({ shapeAgeNow: 64 }), NOW).key).toBe('unknown');
    expect(deriveStage(sc({ shapeAgeNow: 64 }, { locked: true }), new Date(2028, 0, 1)).key).toBe('running');
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
  const samDoc = { pots: { sipp: 500000, potAtRetirement: { sipp: 620000 } } };
  const after = deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }), new Date(2028, 9, 1));   // October 2028: retired in September
  it('within 10% → runs as locked', () => {
    const a = arrivalCheck(after, samDoc, { sipp: 600000 });
    expect(a.within).toBe(true);
    expect(a.message).toMatch(/within 10%/);
  });
  it('beyond 10% → offers the choice', () => {
    const a = arrivalCheck(after, samDoc, { sipp: 500000 });
    expect(a.within).toBe(false);
    expect(a.message).toMatch(/unlock and re-plan/);
  });
  it('nothing to check before the start, for retirees, or without a document', () => {
    const before = deriveStage(sc({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }), NOW);
    expect(arrivalCheck(before, samDoc, { sipp: 1 })).toBeNull();
    const alex = deriveStage(sc({ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2027 }, { locked: true }), new Date(2027, 4, 1));
    expect(arrivalCheck(alex, samDoc, { sipp: 1 })).toBeNull();
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

/**
 * Release step R2 (research/saving-enough-and-check-in.md 4.3, 4.6): one placing for both apps from the Accumulation tab's
 * ages; the planner's opening tab for the saver stages only; the committed saver's banner far from and near the stop.
 */
describe('a saver, placed and opened as a saver (release step R2)', () => {
  const acc = (currentAge, retirementAge) => ({ accumulationTool: { settings: { currentAge, retirementAge, potNow: 40000, netMonthly: 200, employerMonthly: 150, salary: 30000, schemeType: 'ras', escalationPct: 0, isaMonthly: 0 } } });
  it('ages typed only on the Accumulation tab place an unlocked plan by them: saving, or approaching within five years', () => {
    const far = deriveStage(sc({}, {}, acc(30, 67)), NOW);
    expect(far.key).toBe('saving');
    expect(far.fromAccumulation).toBe(true);
    expect(far.accumulationAges).toEqual({ currentAge: 30, retirementAge: 67 });
    expect(far.reasons).toContain('ages from the Accumulation tab');
    expect(far.yearsToStart).toBe(37);
    expect(far.banner.tab).toBe('accumulation');
    const near = deriveStage(sc({}, {}, acc(62, 66)), NOW);
    expect(near.key).toBe('approaching');
    expect(near.yearsToStart).toBe(4);
  });
  it('never when the Timing block has an age, never on a locked plan, never with no later stop', () => {
    expect(deriveStage(sc({ currentAge: 45, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 62 }, {}, acc(30, 67)), NOW).fromAccumulation).toBeUndefined();
    const locked = deriveStage(sc({}, { locked: true }, acc(30, 67)), NOW);
    expect(locked.key).toBe('running');
    expect(locked.fromAccumulation).toBeUndefined();
    expect(deriveStage(sc({}, {}, acc(67, 67)), NOW).key).toBe('unknown');
    expect(deriveStage(sc({}, {}, acc(0, 67)), NOW).key).toBe('unknown');
    expect(deriveStage(sc({}, {}), NOW).key).toBe('unknown');
    expect(accumulationAgesOf(acc(30, 67))).toEqual({ currentAge: 30, retirementAge: 67, years: 37 });
    expect(accumulationAgesOf({})).toBe(null);
  });
  it('the planner opens a saver on their stage\'s first lead; every other stage on the Decision tool, as before', () => {
    const at = (stress, decision = {}, extra = {}, now = NOW) => openingTab(deriveStage(sc(stress, decision, extra), now));
    expect(at({ currentAge: 45, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 62 })).toBe('accumulation');                     // saving
    expect(at({ currentAge: 57, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 })).toBe('stress');                           // approaching
    expect(at({ currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true })).toBe('accumulation');   // committed-saving
    expect(at({}, {}, acc(30, 67))).toBe('accumulation');                                                                                   // saving, by the Accumulation ages
    // the others exactly as before
    expect(at({ currentAge: 66, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2028 }, { locked: true })).toBe('decision');    // bridge
    expect(at({ currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2026 }, { locked: true })).toBe('decision');    // running
    expect(at({ currentAge: 68, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026 })).toBe('decision');                      // draft-retired
    expect(at({})).toBe('decision');                                                                                                          // unknown
    expect(openingTab(null)).toBe('decision');
    for (const key of ['bridge', 'running', 'draft-retired', 'unknown']) expect(openingTab({ key, leads: STAGES[key].leads })).toBe('decision');
    expect(STAGES.saving.leads[0]).toBe('accumulation');
    // a saver's banner button opens the tab the planner opened on: the two never disagree
    for (const key of ['saving', 'approaching', 'committed-saving']) expect(STAGES[key].banner.tab, key).toBe(openingTab({ key, leads: STAGES[key].leads }));
  });
  it('a committed saver far from the stop is not offered the move; within five years it is, as a choice', () => {
    const far = deriveStage(sc({ currentAge: 50, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60 }, { locked: true }), NOW);
    expect(far.key).toBe('committed-saving');
    expect(far.banner.text).not.toMatch(/Moving what you hold/);
    expect(far.banner.text).toMatch(/Keep paying in, and record your pot each month/);
    for (const key of Object.keys(STAGES)) if (STAGES[key].banner) expect(STAGES[key].banner.text + (STAGES[key].banner.nearText || '')).not.toMatch(/target portfolio|buying/);
  });
});
