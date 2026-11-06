/**
 * Back to work (research/plan-start.md §2 J, §7 — the J test: `flexibleAccess` reaches `contributionWarnings`): the close's
 * second reason, "I'm going back to work". The drawing plan closes as for a move (the same two keys, the same guard
 * allowance); a saving plan made from its figures carries it on until work stops again; and the person's fact that money has
 * been taken from a pension flexibly (`flexibleAccess`, services/FlexibleAccess.js) is written on the new plan by every close
 * when a taxable draw is recorded, copied by every later close, and read where what goes into pensions is worked out.
 * Fictional plans only: the corpus (Alex, 13 and 19) and copies of it.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { successorOf, closeWrite, closeOfferOf, closeQuestionOf, workingStopOf, CARRIED_FACTS, CLOSE_REASONS, successorName } from '../src/services/PlanClose.js';
import { closedReading, beforeReading, closedWords, beforeWords, closedPlanRefusal, successorRefusal, notBegunOf, CLOSE_KEYS } from '../src/services/PlanClosed.js';
import { flexibleAccessOf, carriedFlexibleAccess, firstTaxableDrawMonth, mpaaOf, flexibleAccessWords, flexibleAccessAlong, earlierPlansOf, FLEXIBLE_ACCESS_LIMIT } from '../src/services/FlexibleAccess.js';
import { contributionWarnings, ACCUMULATION_RULES } from '../src/services/AccumulationEngine.js';
import { deriveStage, SAVER_STAGE_KEYS, checkInAllowed, decisionEntryAllowed } from '../src/services/LifeStage.js';
import { deriveTiming, taxYearOfMonth } from '../src/services/PlanTiming.js';
import { lockedPlanWriteRefusal, writeNeedsGuard } from '../src/services/LockedPlanGuard.js';
import { savingOf, allowanceOf, recordPatch } from '../src/answers/plan/saving.js';
import { checkInDraft, checkInPatch, checkInOf } from '../src/answers/plan/checkIn.js';
import { saverInputsOf } from '../src/answers/plan/saverInputs.js';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData, saveScenario } from '../src/firebase/FirestoreService.js';
import { getActiveScenarioAsync, getActiveAccumulationHistory, saveActiveAccumulationHistory, invalidateScenarioCache } from '../src/storage/ScenarioRepository.js';
import { PLAN_LOCKED_CODE } from '../src/services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../src/storage/stressDefaults.js';
import { copyOf } from '../src/services/PlanCopy.js';
import { PLAN_CLOSE_WORDS, planCloseLineHtml, planCloseQuestionHtml, closeSays, stopFromAnswers, nameAfterMonth } from '../src/ui/planCloseUi.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const raw = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const NOW = new Date(2026, 9, 2, 12);   // 2 October 2026
const read = (name, now = NOW) => upgradeScenario(raw(name), { now }).scenario;
const copy = (v) => JSON.parse(JSON.stringify(v));
const LADDER = read('13-stopped-drawing-since');   // locked, drawing since 2024, its records with income taken each month
const CLOSED = read('19-back-to-work');
const SAVING = read('19-back-to-work-saving');
const ss = (p) => p.stressTool.settings;
const endAgeOf = (s) => +s.shapeAgeNow + +s.duration - 1;

describe('flexibleAccess: the person\'s fact, carried by every close', () => {
  it('is one of the facts a close carries, and either reason writes it on the new plan from the first taxable draw recorded', () => {
    expect(CARRIED_FACTS).toEqual(['flexibleAccess']);
    expect(CLOSE_REASONS).toEqual(['plan', 'working']);
    expect(firstTaxableDrawMonth(LADDER)).toBe('2024-11');
    const moved = successorOf(LADDER, { month: '2026-11', name: 'Next', now: NOW });
    const working = successorOf(LADDER, { month: '2026-11', name: 'Saving', now: NOW, reason: 'working', stop: { month: '2030-06' } });
    for (const p of [moved, working]) expect(p.flexibleAccess).toEqual({ since: '2024-11', fromPlanId: LADDER.id });
  });
  it('the widening: income drawn counts, not only a slice taken partly tax-free (today\'s test of the plan\'s own records is unchanged)', () => {
    expect(LADDER.decisionTool.history.every((h) => !(h.taxFree > 0))).toBe(true);
    expect(mpaaOf(LADDER)).toEqual({ triggered: false, flexibleAccess: null });      // the planner's test, as it always was
    expect(carriedFlexibleAccess(LADDER)).toEqual({ since: '2024-11', fromPlanId: LADDER.id });
    // a slice taken partly tax-free, with no other income from the pension, counts too
    const ufpls = copy(LADDER);
    ufpls.decisionTool.history = ufpls.decisionTool.history.map((h, i) => ({ ...h, sipp: 0, taxFree: i === 3 ? 900 : 0 }));
    expect(carriedFlexibleAccess(ufpls)).toEqual({ since: ufpls.decisionTool.history[3].date.slice(0, 7), fromPlanId: LADDER.id });
    expect(mpaaOf(ufpls).triggered).toBe(true);
  });
  it('never on a plan closed with no draw: records with nothing taken, or a locked plan with no records', () => {
    const none = copy(LADDER);
    none.decisionTool.history = none.decisionTool.history.map((h) => ({ ...h, sipp: 0, taxFree: 0 }));
    const bare = copy(LADDER);
    bare.decisionTool.history = [];
    for (const p of [none, bare]) {
      expect(carriedFlexibleAccess(p)).toBe(null);
      for (const reason of CLOSE_REASONS) {
        const month = closeOfferOf(p, NOW).suggested;
        expect('flexibleAccess' in successorOf(p, { month, name: 'Next', now: NOW, reason, stop: { month: '2030-06' } })).toBe(false);
      }
    }
  });
  it('copied by a later close, as it was first recorded (the earlier plan named), whichever reason', () => {
    const next = { ...successorOf(LADDER, { month: '2026-11', name: 'Shares and cash', now: NOW }), id: 'NextPlan01' };
    next.decisionTool.settings = { ...next.decisionTool.settings, locked: true, lockedAt: NOW.toISOString(), lockedBy: 'test' };
    expect(flexibleAccessOf(next)).toEqual({ since: '2024-11', fromPlanId: LADDER.id });
    const later = new Date(2027, 0, 10, 12);
    for (const reason of CLOSE_REASONS) {
      const after = successorOf(next, { month: '2027-02', name: 'After', now: later, reason, stop: { month: '2031-03' } });
      expect(after.flexibleAccess).toEqual({ since: '2024-11', fromPlanId: LADDER.id });
    }
  });
  it('a copy carries it, as it carries what is held: the fact is the person\'s, not the plan\'s', () => {
    expect(copyOf(SAVING, 'A copy', { carryHistory: false, now: NOW }).flexibleAccess).toEqual({ since: '2023-10', fromPlanId: CLOSED.id });
    expect('flexibleAccess' in copyOf(LADDER, 'A copy', { carryHistory: false, now: NOW })).toBe(false);
  });
  it('never written on the closed plan: the close writes its two keys (and the lock\'s, on a plan not locked), nothing else', () => {
    for (const reason of CLOSE_REASONS) {
      expect(Object.keys(closeWrite(LADDER, { month: '2026-11', nextPlanId: 'Next', now: NOW, reason })).sort()).toEqual([...CLOSE_KEYS].sort());
      const unlocked = copy(LADDER);
      unlocked.decisionTool.settings = { ...unlocked.decisionTool.settings, locked: false };
      const w = closeWrite(unlocked, { month: '2026-11', nextPlanId: 'Next', now: NOW, reason });
      expect(Object.keys(w).filter((k) => !k.startsWith('decisionTool.settings.')).sort()).toEqual([...CLOSE_KEYS].sort());
      expect(w['decisionTool.settings.lockedBy']).toBe(reason === 'working' ? 'closed when going back to work' : 'closed when moving to a new plan');
    }
    expect(lockedPlanWriteRefusal(LADDER, closeWrite(LADDER, { month: '2026-11', nextPlanId: 'Next', now: NOW, reason: 'working' }), getDefaultStressSettings())).toBe(null);
    // the closed plan as stored keeps what it had: the fact, like what you hold, is frozen there (it has its own copy onward)
    expect('flexibleAccess' in CLOSED).toBe(false);
    expect(closedPlanRefusal(CLOSED, { flexibleAccess: { since: '2023-10', fromPlanId: CLOSED.id } })).toEqual(['flexibleAccess']);
    expect(lockedPlanWriteRefusal(CLOSED, { flexibleAccess: { since: '2023-10', fromPlanId: CLOSED.id } }, getDefaultStressSettings())).toEqual(['flexibleAccess']);
    // a second close of it is refused, as for any closed plan
    expect(lockedPlanWriteRefusal(CLOSED, { closedAt: '2026-09', nextPlanId: 'Other' }, getDefaultStressSettings())).toEqual(['closedAt', 'nextPlanId']);
  });
});

describe('the saving plan that carries a drawing plan on (back to work)', () => {
  const made = successorOf(LADDER, { month: '2026-11', name: 'Saving', now: NOW, reason: 'working', stop: { month: '2030-06' } });
  it('not retired, stopping again in the month given; year 0 that stop\'s tax year in both copies; the plan ends at the same age', () => {
    const s = ss(made), old = ss(LADDER);
    expect([s.retired, s.stoppedWork, s.retireAge]).toEqual([false, '2030-06', 67]);
    const t = deriveTiming(s, NOW);
    expect(t.mode).toBe('future');
    expect([t.firstTaxYear, t.startMonth]).toEqual([taxYearOfMonth('2030-06'), '2030-06']);
    expect([s.firstTaxYear, made.decisionTool.settings.firstTaxYear]).toEqual([2030, 2030]);
    expect(s.shapeAgeNow).toBe(t.shapeAgeNow);
    expect(endAgeOf(s)).toBe(endAgeOf(old));
    expect(made.decisionTool.settings.duration).toBe(s.duration);
    expect(made.decisionTool.settings.locked).toBe(false);
  });
  it('linked back with the reason, the Accumulation planner\'s figures to start from, the pots projected as the planner\'s Save does', () => {
    expect(made.before).toEqual({ kind: 'working', from: '2026-11' });
    expect(made.previousPlanId).toBe(LADDER.id);
    expect(made.accumulationTool.settings).toEqual({ currentAge: 63, retirementAge: 67, potNow: 429700 });
    expect(made.accumulationTool.history).toEqual([]);   // November 2026 has not come on 2 October: no month of its own yet
    expect(ss(made).potAtRetirement).toMatchObject({ source: 'accumulation' });
    expect(ss(made).potAtRetirement.sipp).toBeGreaterThan(429700);
    expect(made.budgetTool.settings).toMatchObject({ retired: false, retirementAge: 67 });
    expect(made.enabledTools).toContain('accumulation');
    expect('fromAnswer' in made).toBe(false);
    expect(made.journey[0].note).toBe('Back to work from November 2026: made from ‘Linkers since 2024’, which closed at the end of October 2026.');
    // this month's pot record once the spell has begun (the change-over this month)
    const now = successorOf(LADDER, { month: '2026-10', name: 'Saving', now: NOW, reason: 'working', stop: { month: '2030-06' } });
    expect(now.accumulationTool.history).toEqual([expect.objectContaining({ date: '2026-10', sipp: 429700, isa: 15030, isaEntered: true })]);
  });
  it('its stage is a saver\'s: it leads with the Accumulation planner and takes a check-in', () => {
    const st = deriveStage(made, NOW);
    expect(SAVER_STAGE_KEYS).toContain(st.key);
    expect(checkInAllowed(st).ok).toBe(true);
    expect(st.hidden).not.toContain('accumulation');
    const fixture = deriveStage(SAVING, new Date(2026, 8, 30, 12));
    expect(fixture.key).toBe('approaching');
  });
  it('the second stop as an age: no month kept, the age decides (its birthday month); a month wins when both are given', () => {
    const w = workingStopOf(LADDER, { month: '2026-11', stop: { age: 66 }, now: NOW });
    expect(w).toMatchObject({ ok: true, stoppedWork: null, retireAge: 66 });
    const p = successorOf(LADDER, { month: '2026-11', name: 'Saving', now: NOW, reason: 'working', stop: { age: '66' } });
    expect([ss(p).stoppedWork, ss(p).retireAge, ss(p).retired]).toEqual([null, 66, false]);
    expect(workingStopOf(LADDER, { month: '2026-11', stop: { month: '2030-06', age: 70 }, now: NOW })).toMatchObject({ stoppedWork: '2030-06', retireAge: 67 });
  });
  it('a stop that is not one is refused, before anything is made', () => {
    const at = (stop, month = '2026-11') => workingStopOf(LADDER, { month, stop, now: NOW });
    expect(at({})).toEqual({ ok: false, problem: 'noStop' });
    expect(at({ month: 'June' })).toEqual({ ok: false, problem: 'notAMonth' });
    expect(at({ month: '2026-11' })).toEqual({ ok: false, problem: 'stopTooSoon' });   // the month work starts again
    expect(at({ month: '2027-02' }, '2027-03')).toEqual({ ok: false, problem: 'stopTooSoon' });
    expect(at({ age: 63 })).toEqual({ ok: false, problem: 'stopAgeTooSoon' });         // the age today: refused as an age
    expect(at({ age: 62 })).toEqual({ ok: false, problem: 'stopAgeTooSoon' });
    expect(at({ age: 66.5 })).toEqual({ ok: false, problem: 'notAnAge' });
    expect(at({ age: 86 })).toEqual({ ok: false, problem: 'notAnAge' });
    const short = copy(LADDER); short.stressTool.settings.duration = 25;               // a plan that ends at 85
    expect(workingStopOf(short, { month: '2026-11', stop: { age: 82 }, now: NOW })).toEqual({ ok: false, problem: 'stopTooLate' });   // fewer than five years left
    expect(workingStopOf(short, { month: '2026-11', stop: { age: 80 }, now: NOW })).toMatchObject({ ok: true, endAge: 85 });
    const noAge = copy(LADDER); delete noAge.stressTool.settings.currentAge;
    expect(workingStopOf(noAge, { month: '2026-11', stop: { month: '2030-06' }, now: NOW })).toEqual({ ok: false, problem: 'noAge' });
    expect(() => successorOf(LADDER, { month: '2026-11', name: 'x', now: NOW, reason: 'working', stop: {} })).toThrow(/noStop/);
    expect(() => successorOf(LADDER, { month: '2026-11', name: 'x', now: NOW, reason: 'later' })).toThrow(/not a reason/);
  });
  it('offered beside the move only when the plan knows the person\'s age; the default name says it', () => {
    expect(closeOfferOf(LADDER, NOW)).toMatchObject({ working: true, ageNow: 63 });
    const noAge = copy(LADDER); delete noAge.stressTool.settings.currentAge;
    expect(closeOfferOf(noAge, NOW)).toMatchObject({ working: false, ageNow: null });
    expect(successorName(LADDER, '2026-11', 'working')).toBe('Linkers since 2024, back to work from November 2026');
    expect(closeQuestionOf(LADDER, { now: NOW }).flexibleAccess).toEqual({ since: '2024-11', month: 'November 2024' });
  });
});

describe('fixture 19: the closed drawing plan and the saving plan, read', () => {
  const plans = [CLOSED, SAVING];
  it('the closed plan says why it closed; the saving plan says what came before it', () => {
    const r = closedReading(CLOSED, plans, NOW);
    expect(r).toMatchObject({ closedAt: '2025-06', working: true, next: { id: SAVING.id, name: 'Saving again from July 2025' } });
    expect(closedWords(r)).toBe('Closed June 2025: back to work; carried on as ‘Saving again from July 2025’.');
    expect(closedWords(closedReading(CLOSED, [CLOSED], NOW))).toBe('Closed June 2025.');   // the reason lives on the plan that carries it on
    expect(closedWords({ ...r, ahead: true })).toBe('Closes at the end of June 2025: back to work; carries on as ‘Saving again from July 2025’.');
    const b = beforeReading(SAVING, plans);
    expect(b).toMatchObject({ kind: 'working', from: '2025-07', previous: { id: CLOSED.id, name: 'Drawing from 57' } });
    expect(beforeWords(b)).toBe('Under your previous plan ‘Drawing from 57’ until June 2025 — its months are there.');
  });
  it('the saving plan carries the fact; the plan locked when work stops again keeps it and its `before`, and takes months from the stop', () => {
    expect(flexibleAccessOf(SAVING)).toEqual({ since: '2023-10', fromPlanId: CLOSED.id });
    expect(mpaaOf(SAVING)).toEqual({ triggered: true, flexibleAccess: { since: '2023-10', fromPlanId: CLOSED.id } });
    expect(ss(SAVING).stoppedWork).toBe('2029-03');
    // locked as any saver is (case A); read after the second stop: running, Month by month open from the stop, the months
    // before the saving plan's first refused (they are the closed plan's), the fact and the reason still there
    const locked = copy(SAVING);
    locked.decisionTool.settings = { ...locked.decisionTool.settings, locked: true, lockedAt: '2028-11-02T10:00:00.000Z', lockedBy: 'test' };
    const after = new Date(2029, 4, 10, 12);
    const st = deriveStage(locked, after);
    expect(st.key).toBe('running');
    expect(decisionEntryAllowed(st, '2029-04')).toEqual({ ok: true });
    expect(decisionEntryAllowed(st, '2025-06').ok).toBe(false);
    expect(successorRefusal(locked, { 'decisionTool.history': [{ date: '2025-06', sipp: 100 }] })).toEqual(['decisionTool.history']);
    expect(successorRefusal(locked, { 'decisionTool.history': [{ date: '2029-04', sipp: 100 }] })).toBe(null);
    expect(mpaaOf(locked).triggered).toBe(true);
  });
});

describe('the fact along the plans before this one: a month recorded after the close, and a plan an earlier move made', () => {
  const TODAY = '2026-10-02';
  const entries = (...plans) => plans.map((plan) => ({ plan }));
  // a locked drawing plan with no month recorded yet, closed as back to work: the saving plan carries nothing at the close
  const bare = copy(LADDER); bare.decisionTool.history = [];
  const closeBare = (month) => {
    const made = upgradeScenario({ ...successorOf(bare, { month, name: 'Saving', now: NOW, reason: 'working', stop: { month: '2030-06' } }), id: 'SavingNew01' }, { now: NOW }).scenario;
    const closed = { ...copy(bare), ...closeWrite(bare, { month, nextPlanId: made.id, now: NOW, reason: 'working' }) };
    return { made, closed };
  };
  // the months missed before the close, filled in on the closed plan afterwards (the guard lets them through), each with income taken
  const filled = (closed, dates) => ({ ...closed, decisionTool: { ...closed.decisionTool, history: dates.map((d, i) => ({ ...LADDER.decisionTool.history[i], date: d })) } });
  it('a missed month filled in on the closed plan after the close reaches the saving plan (both guards allow the fill)', () => {
    const { made, closed } = closeBare('2026-11');
    expect(made.flexibleAccess).toBe(undefined);
    const fill = { 'decisionTool.history': filled(closed, ['2026-08-20', '2026-09-20']).decisionTool.history };
    expect(closedPlanRefusal(closed, fill)).toBe(null);
    expect(lockedPlanWriteRefusal(closed, fill, getDefaultStressSettings())).toBe(null);
    const after = filled(closed, ['2026-08-20', '2026-09-20']);
    const fact = { since: '2026-08', fromPlanId: bare.id };
    expect(mpaaOf(made)).toEqual({ triggered: false, flexibleAccess: null });                       // the stored fact alone: none
    expect(mpaaOf(made, null, [after, made])).toEqual({ triggered: true, flexibleAccess: fact });     // the plans at hand: the closed plan's draw
    expect(mpaaOf(made, null, entries(after, made))).toEqual({ triggered: true, flexibleAccess: fact });   // V7's entries too
    expect(allowanceOf(made, 9000, entries(after, made))).toEqual({ month: 'August 2026', over: false, yearly: '£9,000' });
    expect(savingOf(entries(made, after), made.id, { today: TODAY }).allowance).toMatchObject({ month: 'August 2026' });
    expect(checkInOf(entries(made, after), made.id, { today: TODAY }).allowance).toMatchObject({ month: 'August 2026' });
    const read = saverInputsOf(made, { today: TODAY, plans: entries(made, after) });
    expect(read.ok).toBe(true);
    expect(read.inputs.you.alreadyDrawing).toBe(true);
    expect(saverInputsOf(made, { today: TODAY }).inputs.you.alreadyDrawing).not.toBe(true);
  });
  it('a change-over set up ahead: draws recorded on the drawing plan before it reach the saving plan', () => {
    const { made, closed } = closeBare('2027-03');
    expect(closed.closedAt).toBe('2027-02');
    const after = filled(closed, ['2026-10-20', '2026-12-20']);
    expect(flexibleAccessAlong(made, [after, made])).toEqual({ since: '2026-10', fromPlanId: bare.id });
  });
  it('a plan made by an earlier move (6.56.0, no fact of its own) closed as back to work carries the draws of the plan it came from', () => {
    const old18 = read('18-moved-to-new-plan'), next18 = read('18-moved-to-new-plan-next');
    expect(flexibleAccessOf(next18)).toBe(null);
    expect(firstTaxableDrawMonth(old18)).toBe('2023-08');
    const locked = copy(next18);
    locked.decisionTool.settings = { ...locked.decisionTool.settings, locked: true, lockedAt: NOW.toISOString(), lockedBy: 'test' };
    const offer = closeOfferOf(locked, NOW);
    const want = { since: '2023-08', fromPlanId: old18.id };
    const made = successorOf(locked, { month: offer.suggested, name: 'Saving', now: NOW, reason: 'working', stop: { age: offer.ageNow + 2 }, plans: [old18, locked] });
    expect(made.flexibleAccess).toEqual(want);
    expect(closeQuestionOf(locked, { now: NOW, plans: [old18, locked] }).flexibleAccess).toEqual({ since: '2023-08', month: 'August 2023' });
    // the readers find it on the plan an earlier move made, too
    expect(mpaaOf(next18, null, [old18, next18]).flexibleAccess).toEqual(want);
    // with a month of its own recorded later, the earliest still counts (not the plan's own first month)
    const own = copy(locked);
    own.decisionTool.history = [{ ...old18.decisionTool.history[old18.decisionTool.history.length - 1], date: '2025-04-20' }];
    const q = closeQuestionOf(own, { now: NOW, plans: [old18, own] });
    expect(successorOf(own, { month: q.suggested, name: 'Saving', now: NOW, reason: 'working', stop: { age: q.ageNow + 2 }, plans: [old18, own] }).flexibleAccess).toEqual(want);
    expect(carriedFlexibleAccess(own)).toEqual({ since: '2025-04', fromPlanId: own.id });   // the plan alone, as before
  });
  it('the chain: nearest first, each plan once, and it stops at a plan not at hand', () => {
    const a = { id: 'A' }, b = { id: 'B', previousPlanId: 'A' }, c = { id: 'C', previousPlanId: 'B' };
    expect(earlierPlansOf(c, [a, b, c]).map((p) => p.id)).toEqual(['B', 'A']);
    expect(earlierPlansOf(c, [a, c]).map((p) => p.id)).toEqual([]);
    const loopA = { id: 'A', previousPlanId: 'B' }, loopB = { id: 'B', previousPlanId: 'A' };
    expect(earlierPlansOf(loopA, [loopA, loopB]).map((p) => p.id)).toEqual(['B']);
    expect(earlierPlansOf({ id: 'D', before: { kind: 'plan', planId: 'A', from: '2026-01' } }, [{ plan: a }]).map((p) => p.id)).toEqual(['A']);
  });
  it('nothing moves for a plan that came from no other: the whole corpus at hand reads as before', () => {
    const all = readdirSync(PLANS).filter((f) => /^\d\d-.*\.json$/.test(f)).map((f) => read(f.slice(0, -5)));
    for (const p of all) if (!p.previousPlanId && !(p.before && p.before.planId)) expect(mpaaOf(p, null, all), p.id).toEqual(mpaaOf(p));
  });
});

describe('a change-over still to come: the saving plan takes no month before it begins', () => {
  const TODAY = '2026-10-02';
  const made = upgradeScenario({ ...successorOf(LADDER, { month: '2027-06', name: 'Saving', now: NOW, reason: 'working', stop: { month: '2030-06' } }), id: 'SavingNew02' }, { now: NOW }).scenario;
  const closed = { ...copy(LADDER), ...closeWrite(LADDER, { month: '2027-06', nextPlanId: made.id, now: NOW, reason: 'working' }) };
  const entries = [{ plan: made }, { plan: closed }];
  it('it reads as a saver now, and says when it begins', () => {
    expect(made.before).toEqual({ kind: 'working', from: '2027-06' });
    expect(SAVER_STAGE_KEYS).toContain(deriveStage(made, NOW).key);
    expect(notBegunOf(made, '2026-10')).toEqual({ from: '2027-06', month: 'June 2027' });
    expect(notBegunOf(made, '2027-06')).toBe(null);
    expect(notBegunOf(LADDER, '2026-10')).toBe(null);   // a plan that came from no other
    expect(savingOf(entries, made.id, { today: TODAY }).notYet).toEqual({ month: 'June 2027' });
    const v = checkInOf(entries, made.id, { today: TODAY });
    expect(v).toMatchObject({ allowed: true, notYet: { month: 'June 2027' }, editable: false });
  });
  it('no check-in and no pot record of a month before it (they are the drawing plan\'s), in the boxes\' own checks', () => {
    const typed = { 'ci.pension': '430000', 'ci.isa': '15000', 'ci.kind': 'total', 'ci.total': '1500' };
    expect(checkInDraft(made, typed, { today: TODAY })).toEqual({ ok: false, problem: 'notYet' });
    expect(checkInPatch(made, typed, { today: TODAY, now: NOW })).toMatchObject({ ok: false, problem: 'notYet' });
    expect(recordPatch(made, { 'record.pension': '430000', 'record.month': '2026-10' }, { today: TODAY })).toMatchObject({ ok: false, errors: { 'record.month': 'beforePlan' } });
  });
  it('the store refuses a saver\'s month before it as it refuses Month by month\'s; from its first month on, nothing changes', () => {
    const early = { 'accumulationTool.history': [{ date: '2026-10', sipp: 430000, isa: 15000, total: 445000 }] };
    const earlyCheckIn = { 'accumulationTool.checkIns': [{ date: '2026-10-02', pot: { pension: 430000 } }] };
    expect(writeNeedsGuard(made, early)).toBe(true);
    expect(successorRefusal(made, early)).toEqual(['accumulationTool.history']);
    expect(successorRefusal(made, earlyCheckIn)).toEqual(['accumulationTool.checkIns']);
    expect(successorRefusal(made, { ...early, ...earlyCheckIn })).toEqual(['accumulationTool.history', 'accumulationTool.checkIns']);
    expect(lockedPlanWriteRefusal(made, early, getDefaultStressSettings())).toEqual(['accumulationTool.history']);
    expect(successorRefusal(made, { 'accumulationTool.history': [{ date: '2027-06', sipp: 430000, total: 430000 }] })).toBe(null);
    expect(successorRefusal(made, { 'accumulationTool.settings.netMonthly': 500 })).toBe(null);   // what goes in is not a month
    expect(writeNeedsGuard(LADDER, early)).toBe(false);                                           // a plan that came from no other
  });
  it('a change-over this month: nothing is held back', () => {
    const now = upgradeScenario({ ...successorOf(LADDER, { month: '2026-10', name: 'Saving', now: NOW, reason: 'working', stop: { month: '2030-06' } }), id: 'SavingNew03' }, { now: NOW }).scenario;
    expect(notBegunOf(now, '2026-10')).toBe(null);
    expect(checkInOf([{ plan: now }], now.id, { today: TODAY }).notYet).toBe(null);
    expect(successorRefusal(now, { 'accumulationTool.history': [{ date: '2026-10', sipp: 1, total: 1 }] })).toBe(null);
  });
});

describe('the planner\'s Accumulation page: no pot record before the saving plan\'s first month', () => {
  afterEach(() => { leaveGuestMode(); clearGuestData(); invalidateScenarioCache(); });
  it('refused in words before the store is asked, and by the store behind it; from the first month on, recorded', async () => {
    enterGuestMode(); clearGuestData();
    sessionStorage.setItem('pt_guest_scenarios', JSON.stringify([{ ...raw('19-back-to-work-saving'), isActive: true }]));
    invalidateScenarioCache();
    const plan = await getActiveScenarioAsync();
    expect(plan.before.from).toBe('2025-07');
    const had = await getActiveAccumulationHistory();
    const early = { date: '2025-05', sipp: 300000, isa: 0, gia: 0, total: 300000 };
    await expect(saveActiveAccumulationHistory([...had, early])).rejects.toThrow('This plan carries on from July 2025. Months before then are recorded on your previous plan.');
    await expect(saveScenario(plan.id, { 'accumulationTool.history': [...had, early] })).rejects.toMatchObject({ code: PLAN_LOCKED_CODE, keys: ['accumulationTool.history'] });
    const later = { date: '2026-10', sipp: 300000, isa: 0, gia: 0, total: 300000 };
    const kept = await saveActiveAccumulationHistory([...had, later]);
    expect(kept.map((r) => r.date)).toContain('2026-10');
  });
});

describe('the £10,000 compared as worked out', () => {
  it('just over it is over, on every page (the planner compares the same unrounded figure); only the words round', () => {
    expect(allowanceOf(SAVING, 10000.44)).toEqual({ month: 'October 2023', over: true, yearly: '£10,000' });
    expect(contributionWarnings({ annualGrossTotal: 10000.44, flexibleAccess: flexibleAccessOf(SAVING) })[0].code).toBe('mpaa-carried-over');
    expect(allowanceOf(SAVING, 10000).over).toBe(false);
  });
});

describe('the limit read where what goes in is worked out (contributionWarnings)', () => {
  const fa = { since: '2023-10', fromPlanId: 'x' };
  const codes = (w) => w.map((x) => x.code || x.message.split(':')[0]);
  it('with the fact: said at £10,000 whatever is paid in — information under it, a warning above it, with the month', () => {
    expect(FLEXIBLE_ACCESS_LIMIT).toBe(ACCUMULATION_RULES.MPAA);
    const under = contributionWarnings({ annualGrossTotal: 9000, salary: 36000, flexibleAccess: fa });
    expect(under).toEqual([{ severity: 'info', code: 'mpaa-carried', message: 'MPAA: ' + flexibleAccessWords('2023-10') }]);
    const over = contributionWarnings({ annualGrossTotal: 10001, salary: 36000, flexibleAccess: fa });
    expect(over[0]).toMatchObject({ severity: 'danger', code: 'mpaa-carried-over' });
    expect(over[0].message).toContain('in October 2023');
    // over £60,000 too: the £10,000 line says the excess is taxed back; carry-forward cannot raise that limit, so the Annual
    // Allowance line (which says unused allowance may cover it) is not said
    expect(codes(contributionWarnings({ annualGrossTotal: 70000, salary: 90000, flexibleAccess: fa }))).toEqual(['mpaa-carried-over']);
  });
  it('the plan\'s own records setting off the limit: over £60,000 says the £10,000 line, not the carry-forward one', () => {
    const w = contributionWarnings({ annualGrossTotal: 70000, salary: 90000, mpaaTriggered: true });
    expect(w.map((x) => x.message.split(':')[0])).toEqual(['MPAA']);
    expect(w.some((x) => /carry-forward/.test(x.message))).toBe(false);
  });
  it('without it: the normal allowance, and the plan\'s own records decide the £10,000 as before', () => {
    expect(contributionWarnings({ annualGrossTotal: 12000, salary: 36000 })).toEqual([]);
    expect(codes(contributionWarnings({ annualGrossTotal: 61000, salary: 90000 }))).toEqual(['Annual Allowance']);
    const own = contributionWarnings({ annualGrossTotal: 12000, salary: 36000, mpaaTriggered: true });
    expect(own.map((w) => w.code)).toEqual([undefined]);
    expect(own[0].message).toMatch(/^MPAA: your Decision-tool history/);
  });
  it('nothing moves for a plan that does not carry it: every corpus plan without the fact reads as the planner\'s old test', () => {
    const names = readdirSync(PLANS).filter((f) => /^\d\d-.*\.json$/.test(f)).map((f) => f.slice(0, -5));
    let read0 = 0;
    for (const name of names) {
      const p = read(name);
      if (flexibleAccessOf(p)) continue;
      read0++;
      const hist = (p.decisionTool && p.decisionTool.history) || [];
      expect(mpaaOf(p), name).toEqual({ triggered: hist.some((h) => h && (h.taxFree || 0) > 0), flexibleAccess: null });
    }
    expect(read0).toBe(names.length - 1);   // only 19's saving plan carries it
  });
  it('the words say the rule, never what to do', () => {
    // the limit is on what goes into pension pots (a final-salary pension's building up is not counted against it)
    expect(flexibleAccessWords('2029-03')).toBe('Since you took money from your pension flexibly in March 2029, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply.');
  });
});

describe('the planner\'s question (src/ui/planCloseUi.js)', () => {
  const q = closeQuestionOf(LADDER, { now: NOW });
  it('the line offers the second reason beside the move when the plan knows the age; the move\'s own words and button are as before', () => {
    const both = planCloseLineHtml({ offered: true, working: true });
    expect(both).toContain(PLAN_CLOSE_WORDS.offer);
    expect(both).toContain('movePlanToNew()');
    expect(both).toContain('movePlanToNew(\'working\')');
    expect(both).toContain(PLAN_CLOSE_WORDS.offerWorkingBtn);
    expect(planCloseLineHtml({ offered: true })).not.toContain('working');
  });
  it('going back to work asks the stop (a month or an age), says the limit the new plan carries, and what happens', () => {
    const html = planCloseQuestionHtml(q, { name: 'Saving', reason: 'working' });
    for (const id of ['pcMonth', 'pcStopMonth', 'pcStopAge', 'pcPension', 'pcIsa', 'pcGia', 'pcName']) expect(html).toContain('id="' + id + '"');
    expect(html).toContain(PLAN_CLOSE_WORDS.titleWorking);
    expect(html).toContain('flexibly in November 2024');
    expect(closeSays(q, '2026-11', 'working')).toBe('‘Linkers since 2024’ closes at the end of October 2026 and is kept as it is: its 18 recorded months stay here to read, and nothing after October 2026 can be recorded on it. The new saving plan takes the months from November 2026.');
    expect(planCloseQuestionHtml(q, { name: 'Next' })).not.toContain('pcStopMonth');
    expect(stopFromAnswers({ stopMonth: '2030-06', stopAge: '66' })).toEqual({ month: '2030-06', age: null });
    expect(stopFromAnswers({ stopMonth: '', stopAge: ' 66 ' })).toEqual({ month: null, age: '66' });
    expect(stopFromAnswers({ stopMonth: '', stopAge: '' })).toEqual({ month: null, age: null });
    for (const k of ['noStop', 'notAMonth', 'notAnAge', 'stopTooSoon', 'stopAgeTooSoon', 'stopTooLate', 'noAge']) expect(PLAN_CLOSE_WORDS.stopProblems[k]).toBeTypeOf('string');
  });
  it('a browser with no month picker shows the month box as text: it says how to type one, and reads a month as V7 does', () => {
    const html = planCloseQuestionHtml(q, { name: 'Saving', reason: 'working' });
    expect(html).toMatch(/id="pcStopMonth" placeholder="2030-06"/);
    for (const typed of ['June 2030', 'june 2030', 'Jun 2030', '2030-06', '2030/6', '6/2030']) expect(stopFromAnswers({ stopMonth: typed, stopAge: '' }), typed).toEqual({ month: '2030-06', age: null });
    expect(stopFromAnswers({ stopMonth: 'Junetember 2030', stopAge: '' })).toEqual({ month: 'Junetember 2030', age: null });   // refused as typed
    expect(workingStopOf(LADDER, { month: '2026-11', stop: stopFromAnswers({ stopMonth: 'June 2030' }), now: NOW })).toMatchObject({ ok: true, stoppedWork: '2030-06' });
    expect(workingStopOf(LADDER, { month: '2026-11', stop: stopFromAnswers({ stopMonth: 'Junetember 2030' }), now: NOW })).toEqual({ ok: false, problem: 'notAMonth' });
  });
  it('an age that is not ahead is refused in words about the age', () => {
    expect(PLAN_CLOSE_WORDS.stopProblems.stopAgeTooSoon).toBe('Give an age older than you are today, which you reach after the month you go back to work.');
    expect(PLAN_CLOSE_WORDS.stopProblems.stopAgeTooSoon).not.toMatch(/month you go back to work, and after this month/);
  });
  it('the offer says the plan closes when work starts again (the close is at the end of the month before)', () => {
    expect(PLAN_CLOSE_WORDS.offerWorking).toBe('Going back to work? Close it when work starts again and carry on in a saving plan made from its figures until you stop again.');
  });
  it('the name box follows the month chosen while it holds the default name; typed over, it stays', () => {
    const nameFor = (m) => successorName(LADDER, m, 'working');
    const def = nameFor('2026-10');
    expect(nameAfterMonth(def, { from: '2026-10', to: '2026-12', nameFor })).toBe('Linkers since 2024, back to work from December 2026');
    expect(nameAfterMonth('My saving years', { from: '2026-10', to: '2026-12', nameFor })).toBe('My saving years');
    expect(nameAfterMonth(def, { from: '2026-10', to: '2026-10', nameFor })).toBe(def);
  });
});
