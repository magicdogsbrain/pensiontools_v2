/**
 * Moving to another plan (6.56.0, research/plan-start.md §2 I, §3, §6 decisions 10 and 11, §7 the I tests):
 *  - the guard's close allowance: `closedAt` and `nextPlanId` only, both together, once, on a plan with no `closedAt`;
 *  - a closed plan: no month after `closedAt`, none of the frozen writes (its settings, the unlock, the move of its start, its
 *    strategy, the close again, what you hold, the tick-offs, a tax year after the close); its months up to the close stay
 *    writable;
 *  - the new plan: year 0 the change-over month's tax year, `before`, `previousPlanId`, the month work stopped, a draft with
 *    nothing recorded, every figure keeping its tax year and its age, its pots what is held today (or the figures given);
 *  - the life stage `closed`, Month by month's gate on both plans, the household's candidates, the words (banned.js), and
 *    nothing moving for a plan that is not closed.
 * Fixture 18 is a closed plan and the plan that carries it on (tests/fixtures/plans/build.mjs); Alex is fictional.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { closeOfferOf, closeQuestionOf, successorOf, closeWrite, partnerWrites, heldPotsOf, successorSettings, successorName } from '../src/services/PlanClose.js';
import { closureRefusal, closedPlanRefusal, isClosedPlan, closedReading, beforeReading, closedWords, beforeWords, monthRefusal, monthRefusalWords, readDayOf, monthBefore, planNameOf } from '../src/services/PlanClosed.js';
import { lockedPlanWriteRefusal, writeNeedsGuard, PlanLockedError, PLAN_CLOSED_MESSAGE } from '../src/services/LockedPlanGuard.js';
import { deriveStage, decisionEntryAllowed, STAGES } from '../src/services/LifeStage.js';
import { nextStepFor } from '../src/services/NextStep.js';
import { deriveTiming, planYearOf } from '../src/services/PlanTiming.js';
import { getDefaultStressSettings } from '../src/storage/stressDefaults.js';
import { planPage, planRows } from '../src/answers/plan/read.js';
import { householdOf } from '../src/answers/plan/household.js';
import { PLAN } from '../src/v7/copy/plan.js';
import { BANNED } from '../src/v7/copy/banned.js';
import { planCloseLineHtml, planCloseQuestionHtml, closeSays, plansInListOrder, planListDesc, PLAN_CLOSE_WORDS } from '../src/ui/planCloseUi.js';

const raw = (name) => JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8'));
const NOW = new Date(2026, 9, 2, 12);
const read = (r) => upgradeScenario(r, { now: NOW }).scenario;
const CLOSED = read(raw('18-moved-to-new-plan'));
const NEXT = read(raw('18-moved-to-new-plan-next'));
const LADDER = read(raw('13-stopped-drawing-since'));      // locked, records to September 2026, a holdings record
const RUNUP = read(raw('20-locked-start-after-stop'));           // locked, its income starts in 2027/28
const DRAFT = read(raw('02-pnv-draft'));                   // a draft with nothing recorded
const SAVER = read(raw('05-saver-committed'));             // locked while still saving
const DEFAULTS = getDefaultStressSettings();
const refusal = (plan, data) => lockedPlanWriteRefusal(plan, data, DEFAULTS);
const copy = (v) => JSON.parse(JSON.stringify(v));

/** The words a page shows, against banned.js in the scopes a retired person's record pages are read in. */
function bannedIn(text) {
  const scopes = ['all', 'record', 'retired'];
  return BANNED.filter((b) => scopes.includes(b.scope) && b.re.test(text) && !(b.allow || []).some((a) => a.test(text))).map((b) => b.id + ': ' + text);
}

describe('fixture 18: a closed plan and the plan that carries it on, linked both ways', () => {
  it('the closed plan: closed at the end of March 2025, locked, its 15 months kept; the new plan: a draft from April 2025', () => {
    expect(CLOSED.closedAt).toBe('2025-03');
    expect(CLOSED.nextPlanId).toBe(NEXT.id);
    expect(CLOSED.decisionTool.settings.locked).toBe(true);
    expect(CLOSED.decisionTool.history.length).toBe(15);
    expect(NEXT.previousPlanId).toBe(CLOSED.id);
    expect(NEXT.before).toEqual({ kind: 'plan', planId: CLOSED.id, from: '2025-04' });
    expect(NEXT.decisionTool.settings.locked).toBe(false);
    expect(NEXT.decisionTool.history).toEqual([]);
    expect(NEXT.decisionTool.taxYears).toEqual({});
    expect('planDocument' in NEXT).toBe(false);
    expect(NEXT.stressTool.settings.firstTaxYear).toBe(2025);
    expect(NEXT.decisionTool.settings.firstTaxYear).toBe(2025);
    expect(NEXT.stressTool.settings.stoppedWork).toBe(CLOSED.stressTool.settings.stoppedWork);
    expect(isClosedPlan(CLOSED)).toBe(true);
    expect(isClosedPlan(NEXT)).toBe(false);
  });
  it('the readings and their words', () => {
    const plans = [CLOSED, NEXT];
    expect(closedWords(closedReading(CLOSED, plans))).toBe('Closed March 2025; carried on as ‘Pots and valves from April 2025’.');
    expect(beforeWords(beforeReading(NEXT, plans))).toBe('Under your previous plan ‘Pots and valves 2023’ until March 2025 — its months are there.');
    expect(closedWords(closedReading(CLOSED, []))).toBe('Closed March 2025.');
    expect(beforeWords(beforeReading(NEXT, []))).toBe('Under your previous plan until March 2025 — its months are there.');
    expect(closedReading(NEXT, plans)).toBe(null);
    expect(beforeReading(CLOSED, plans)).toBe(null);
  });
});

describe('the guard: the close allowance, once', () => {
  const close = { closedAt: '2026-10', nextPlanId: 'NextPlanId1' };
  it('passes exactly closedAt and nextPlanId, both together, on a locked plan with no closedAt — the plan, the settings, the records untouched', () => {
    expect(closureRefusal(LADDER, close)).toBe(null);
    expect(refusal(LADDER, close)).toBe(null);
    expect(writeNeedsGuard(LADDER, close)).toBe(true);
  });
  it('refuses one key alone, a month that is not one, an empty id, its own id, and a close before a recorded month', () => {
    expect(refusal(LADDER, { closedAt: '2026-10' })).toEqual(['closedAt']);
    expect(refusal(LADDER, { nextPlanId: 'NextPlanId1' })).toEqual(['nextPlanId']);
    expect(refusal(LADDER, { closedAt: '2026-13', nextPlanId: 'NextPlanId1' })).toEqual(['closedAt', 'nextPlanId']);
    expect(refusal(LADDER, { closedAt: '2026-10', nextPlanId: '' })).toEqual(['closedAt', 'nextPlanId']);
    expect(refusal(LADDER, { closedAt: '2026-10', nextPlanId: LADDER.id })).toEqual(['closedAt', 'nextPlanId']);
    expect(refusal(LADDER, { closedAt: '2026-08', nextPlanId: 'NextPlanId1' })).toEqual(['closedAt', 'nextPlanId']);   // September 2026 is recorded
  });
  it('lets nothing else ride along on a locked plan: a setting with the close is refused as on any locked plan', () => {
    expect(refusal(LADDER, { ...close, 'stressTool.settings.duration': 40 })).toEqual(['stress.duration']);
    expect(refusal(LADDER, { ...close, 'decisionTool.settings.baseSalary': 1 })).toEqual(['decision.baseSalary']);
  });
  it('once: a plan with closedAt (even one that is not a month) refuses any write of either key', () => {
    expect(refusal(CLOSED, { closedAt: '2025-06', nextPlanId: 'Other' })).toEqual(['closedAt', 'nextPlanId']);
    expect(refusal(CLOSED, { closedAt: null, nextPlanId: null })).toEqual(['closedAt', 'nextPlanId']);
    expect(refusal({ ...copy(LADDER), closedAt: 'garbage' }, close)).toEqual(['closedAt', 'nextPlanId']);
  });
  it('a plan that is not locked may be closed with the lock\'s flags in the same write (closeWrite), and is then read as locked', () => {
    const unlocked = copy(DRAFT);
    const w = closeWrite(unlocked, { month: '2026-11', nextPlanId: 'N1', now: NOW });
    expect(w).toEqual({ closedAt: '2026-10', nextPlanId: 'N1', 'decisionTool.settings.locked': true, 'decisionTool.settings.lockedAt': NOW.toISOString(), 'decisionTool.settings.lockedBy': 'closed when moving to a new plan', 'decisionTool.settings.lockedPosition': { elapsedYears: 0, monthsIntoYear: 6 } });   // 7.4.0: 02 is in its year 0 (stopped June 2026), its pots six months in
    expect(refusal(unlocked, w)).toBe(null);
    expect(closeWrite(LADDER, { month: '2026-11', nextPlanId: 'N1', now: NOW })).toEqual({ closedAt: '2026-10', nextPlanId: 'N1' });
  });
  it('the store\'s error says the plan is closed, not that it can be unlocked', () => {
    expect(new PlanLockedError(['x'], { closed: true }).message).toBe(PLAN_CLOSED_MESSAGE);
  });
});

describe('a closed plan: no month after the close, and none of the frozen writes', () => {
  const hist = CLOSED.decisionTool.history;
  const after = { date: '2025-04-12T19:00:00.000Z', taxYear: '25/26', monthlyNet: 1800 };
  const before = { date: '2025-03-12T19:00:00.000Z', taxYear: '24/25', monthlyNet: 1800 };
  it('Month by month refuses April 2025 and later, with the reason, and takes March 2025', () => {
    const stage = deriveStage(CLOSED, NOW);
    expect(decisionEntryAllowed(stage, '2025-04')).toEqual({ ok: false, reason: 'This plan is closed: its last month is March 2025. Record April 2025 and later on the plan that carries it on.' });
    expect(decisionEntryAllowed(stage, '2026-10').ok).toBe(false);
    expect(decisionEntryAllowed(stage, '2025-03')).toEqual({ ok: true });
    expect(monthRefusal(CLOSED, '2025-04')).toEqual({ why: 'closed', closedAt: '2025-03', month: '2025-04' });
  });
  it('the store refuses a record after the close and takes one at or before it (a month missed can be filled in)', () => {
    expect(refusal(CLOSED, { 'decisionTool.history': [...hist, after] })).toEqual(['decisionTool.history']);
    expect(refusal(CLOSED, { 'decisionTool.history': [...hist, before] })).toBe(null);
    expect(refusal(CLOSED, { decisionTool: { ...CLOSED.decisionTool, history: [...hist, after] } })).toEqual(['decisionTool.history']);
    expect(refusal(CLOSED, { 'decisionTool.history': hist.slice(0, -1) })).toBe(null);   // a delete of a recorded month
  });
  it('a tax year after the close is refused; the tax years it covers are not', () => {
    expect(refusal(CLOSED, { 'decisionTool.taxYears.25/26': { yearSetupComplete: true } })).toEqual(['decisionTool.taxYears.25/26']);
    expect(refusal(CLOSED, { 'decisionTool.taxYears.24/25': { ...CLOSED.decisionTool.taxYears['24/25'], cpi: 0.03 } })).toBe(null);
  });
  it('what you hold and the tick-offs moved to the new plan: both refused', () => {
    expect(refusal(CLOSED, { holdings: { lines: [] } })).toEqual(['holdings']);
    expect(refusal(CLOSED, { transition: { done: { a: '2026-10-02' } } })).toEqual(['transition']);
    expect(closedPlanRefusal(NEXT, { holdings: { lines: [] } })).toBe(null);
  });
  it('its settings, its strategy, the unlock and a move of its start are refused; the journey, the name and the budget are not', () => {
    expect(refusal(CLOSED, { 'stressTool.settings.duration': 40 })).toEqual(['stress.duration']);
    expect(refusal(CLOSED, { strategy: { id: 'buckets-in-order', params: {} } })).toEqual(['strategy']);
    const unlock = { 'decisionTool.settings.locked': false, 'decisionTool.settings.unlockedAt': NOW.toISOString(), 'decisionTool.settings.unlockCount': 1 };
    expect(refusal(CLOSED, unlock)).toEqual(['decision.locked', 'decision.unlockCount', 'decision.unlockedAt']);
    expect(refusal(CLOSED, { 'decisionTool.settings.firstTaxYear': 2022, 'stressTool.settings.firstTaxYear': 2022 })).not.toBe(null);
    expect(refusal(CLOSED, { journey: [] })).toBe(null);
    expect(refusal(CLOSED, { 'planDetails.name': 'Old plan' })).toBe(null);
    expect(refusal(CLOSED, { 'budgetTool.settings': {} })).toBe(null);
  });
  it('Where you are reads it as at the end of its last month', () => {
    expect(readDayOf(CLOSED, NOW)).toEqual(new Date(2025, 2, 31, 12));
    expect(readDayOf(NEXT, NOW)).toBe(NOW);
    expect(readDayOf(CLOSED, new Date(2025, 2, 10, 12))).toEqual(new Date(2025, 2, 10, 12));   // before the end of it: today
  });
});

describe('the life stage', () => {
  it('a closed plan is `closed`: leads nothing, Stress, Strategies, the move and Month by month read-only, the Accumulation planner hidden', () => {
    const st = deriveStage(CLOSED, NOW);
    expect(st.key).toBe('closed');
    expect(st.leads).toEqual([]);
    expect(st.readOnly).toEqual(['stress', 'strategies', 'transition', 'decision']);
    expect(st.hidden).toEqual(['accumulation']);
    expect(st.closedAt).toBe('2025-03');
    expect(st.nextPlanId).toBe(NEXT.id);
    expect(st.banner.text).toBe('This plan is closed: it ran to the end of March 2025 and carries on in a new plan. Its months stay here to read; record the months after it on the plan that carries it on.');
    expect(STAGES.closed.key).toBe('closed');
  });
  it('the next-step banner opens the plan that carries it on, by its name when the page has it', () => {
    const st = deriveStage(CLOSED, NOW);
    expect(nextStepFor({ stage: st, successorName: 'Pots and valves from April 2025' })).toEqual({
      html: 'This plan is closed: it ran to the end of March 2025 and carries on in ‘Pots and valves from April 2025’. Its months stay here to read; record the months after it on the plan that carries it on.',
      btn: 'Open ‘Pots and valves from April 2025’', action: { kind: 'plan', planId: NEXT.id }
    });
  });
  it('the plan that carries it on is a retired draft, and takes no month before April 2025', () => {
    const st = deriveStage(NEXT, NOW);
    expect(st.key).toBe('draft-retired');
    expect(st.beforeFrom).toBe('2025-04');
    expect(decisionEntryAllowed(st, '2025-03')).toEqual({ ok: false, reason: 'This plan carries on from April 2025. Months before then are recorded on your previous plan.' });
    expect(decisionEntryAllowed(st, '2025-04')).toEqual({ ok: true });
  });
  it('nothing moves for a plan that is not closed: every other fixture keeps its stage and its gate', () => {
    for (const p of [LADDER, RUNUP, DRAFT, SAVER]) {
      const st = deriveStage(p, NOW);
      expect(st.key).not.toBe('closed');
      expect(st.closedAt).toBe(null);
      expect(st.beforeFrom).toBe(null);
      expect(monthRefusal(p, '2030-01')).toBe(null);
      expect(readDayOf(p, NOW)).toBe(NOW);
    }
  });
});

describe('the offer and the new plan', () => {
  it('offered on a locked plan someone has lived on, from the month after the last record to a year ahead; never on a draft with nothing recorded, a plan still to stop, the example, or a closed plan', () => {
    const o = closeOfferOf(LADDER, NOW);
    expect(o.locked).toBe(true);
    expect(o.choices[0]).toBe('2026-10');
    expect(o.choices[o.choices.length - 1]).toBe('2027-10');
    expect(o.suggested).toBe('2026-10');
    expect(closeOfferOf(DRAFT, NOW)).toBe(null);
    expect(closeOfferOf(SAVER, NOW)).toBe(null);
    expect(closeOfferOf({ ...copy(LADDER), example: true }, NOW)).toBe(null);
    expect(closeOfferOf(CLOSED, NOW)).toBe(null);
    expect(closeOfferOf(NEXT, NOW)).toBe(null);   // a draft with nothing recorded yet
  });
  it('an unlocked plan with records is offered it too', () => {
    const unlocked = copy(LADDER);
    unlocked.decisionTool.settings.locked = false;
    expect(closeOfferOf(unlocked, NOW).locked).toBe(false);
  });
  it('the new plan: year 0 the change-over month\'s tax year, its steps keeping their ages, the plan ending at the same age, the month work stopped kept', () => {
    const s0 = LADDER.stressTool.settings;
    const n = successorOf(LADDER, { month: '2027-04', name: 'Next', now: NOW });
    const s1 = n.stressTool.settings;
    const k = 2027 - 2024;
    expect(s1.firstTaxYear).toBe(2027);
    expect(n.decisionTool.settings.firstTaxYear).toBe(2027);
    expect(s1.shapeAgeNow).toBe(s0.shapeAgeNow + k);
    expect(s1.shapeAgeNow + s1.duration).toBe(s0.shapeAgeNow + s0.duration);
    expect(s1.targetSchedule).toEqual(s0.targetSchedule.slice(k));
    expect(s1.incomeSteps).toEqual(s0.incomeSteps);
    expect(s1.spStartDate).toBe(s0.spStartDate);
    expect(n.before).toEqual({ kind: 'plan', planId: LADDER.id, from: '2027-04' });
    expect(n.previousPlanId).toBe(LADDER.id);
    expect(n.decisionTool.settings.locked).toBe(false);
    for (const key of ['lockedAt', 'lockedBy', 'unlockedAt', 'unlockCount', 'lockedPosition']) expect(key in n.decisionTool.settings, key).toBe(false);
    expect(n.decisionTool.history).toEqual([]);
    expect(n.decisionTool.taxYears).toEqual({});
    for (const key of ['planDocument', 'planDocumentArchive', 'closedAt', 'nextPlanId', 'transition', 'id']) expect(key in n, key).toBe(false);
    expect(n.holdings).toEqual(LADDER.holdings);
    expect(n.journey).toHaveLength(1);
    expect(deriveTiming(s1, NOW).firstTaxYear).toBe(2027);
    expect(planYearOf('2027-04', s1.firstTaxYear)).toBe(0);
  });
  it('its pots are what is held today, in the mix held (the Transition tool\'s reading of the record), when the record is the newest figure', () => {
    const fresh = copy(LADDER); fresh.holdings.updatedAt = '2026-10-01';   // a record newer than the last month recorded
    const held = heldPotsOf(fresh);
    expect(held).toMatchObject({ from: 'holdings', isa: 15030, gia: 0, has: { pension: true, isa: true, gia: false } });
    expect(held.pension).toBe(held.split.equity + held.split.bond + held.split.cash + held.split.div);
    const s1 = successorOf(fresh, { month: '2027-04', name: 'Next', now: NOW }).stressTool.settings;
    expect([s1.equityMin, s1.bondMin, s1.cashTarget, s1.isaBalance]).toEqual([held.split.equity, held.split.bond, held.split.cash, 15030]);
    expect(s1.potAtRetirement).toBe(null);
  });
  it('with nothing held on record, the pots are the figures given, the pension in the plan\'s own mix; an empty pension box is refused', () => {
    const bare = copy(LADDER); delete bare.holdings;
    expect(heldPotsOf(bare)).toBe(null);
    expect(closeQuestionOf(bare, { now: NOW }).asked).toBe(true);
    expect(() => successorOf(bare, { month: '2027-04', name: 'Next', now: NOW, pots: { pension: '', isa: 0, gia: 0 } })).toThrow(/no pension pot/);
    const s1 = successorOf(bare, { month: '2027-04', name: 'Next', now: NOW, pots: { pension: 400000, isa: 20000, gia: 5000 } }).stressTool.settings;
    expect(s1.equityMin + s1.bondMin + s1.cashTarget + (s1.diversifierStart || 0)).toBe(400000);
    expect(s1.isaBalance).toBe(20000);
    expect(s1.taxableStart).toBe(5000);
    const s0 = LADDER.stressTool.settings, t0 = s0.equityMin + s0.bondMin + s0.cashTarget;
    expect(Math.abs(s1.equityMin / 400000 - s0.equityMin / t0)).toBeLessThan(0.001);
  });
  it('a month outside the offer is refused', () => {
    expect(() => successorOf(LADDER, { month: '2026-09', name: 'Next', now: NOW })).toThrow(/not a month/);
    expect(() => successorOf(LADDER, { month: '2028-04', name: 'Next', now: NOW })).toThrow(/not a month/);
  });
  it('a plan closed before its income started: the new plan\'s year 0 earlier than the old one\'s, the same tax years kept', () => {
    const n = successorOf(RUNUP, { month: '2026-11', name: 'Next', now: NOW });
    const s0 = RUNUP.stressTool.settings, s1 = n.stressTool.settings;
    expect(s1.firstTaxYear).toBe(2026);
    expect(s1.shapeAgeNow).toBe(s0.shapeAgeNow - 1);
    expect(s1.shapeAgeNow + s1.duration).toBe(s0.shapeAgeNow + s0.duration);
  });
  it('the settings move both ways from one helper; no move writes only year 0', () => {
    const s = LADDER.stressTool.settings;
    expect(successorSettings(s, 0, 2024)).toEqual({ ...s, firstTaxYear: 2024 });
    expect(successorSettings({ ...s, potsAsOf: 'today' }, 0, 2024).potsAsOf).toBe(undefined);
  });
  it('the partner: the link and a budget read from the old plan move to the new one, on the person\'s say', () => {
    expect(partnerWrites({ id: 'P', household: { partnerScenarioId: 'OLD' }, budgetTool: { sharedFrom: 'OLD' } }, { oldId: 'OLD', newId: 'NEW' })).toEqual({ 'household.partnerScenarioId': 'NEW', 'budgetTool.sharedFrom': 'NEW' });
    expect(partnerWrites({ id: 'P', household: { partnerScenarioId: 'OLD' } }, { oldId: 'OLD', newId: 'NEW' })).toEqual({ 'household.partnerScenarioId': 'NEW' });
    expect(partnerWrites({ id: 'P', household: { partnerScenarioId: 'ELSE' } }, { oldId: 'OLD', newId: 'NEW' })).toBe(null);
    const linked = { ...copy(LADDER), household: { partnerScenarioId: 'P' } };
    expect(successorOf(linked, { month: '2027-04', name: 'Next', now: NOW, keepPartner: true }).household.partnerScenarioId).toBe('P');
    expect('partnerScenarioId' in (successorOf(linked, { month: '2027-04', name: 'Next', now: NOW, keepPartner: false }).household || {})).toBe(false);
    expect(closeQuestionOf(linked, { now: NOW, plans: [linked, { id: 'P', planDetails: { name: 'Sam' } }] }).partner).toEqual({ id: 'P', name: 'Sam' });
    expect(closeQuestionOf(linked, { now: NOW, plans: [linked, { id: 'P', planDetails: { name: 'Sam' }, closedAt: '2026-01' }] }).partner).toBe(null);
  });
  it('the suggested name says the month', () => {
    expect(successorName(LADDER, '2027-04')).toBe('Linkers since 2024 from April 2027');
  });
});

describe('V7: the closed plan\'s page, the successor\'s, the list and the household', () => {
  const entries = [CLOSED, NEXT, LADDER].map((plan) => ({ plan, newer: false, failed: false }));
  it('the closed plan: stage `closed`, its line naming the successor, its steps Where you are and the plan, the next sentence to carry on', () => {
    const pg = planPage(entries, CLOSED.id, null, { today: '2026-10-02' });
    expect(pg.stageKey).toBe('closed');
    expect(pg.line).toEqual({ id: 'closed', slots: { month: 'March 2025', name: 'Pots and valves from April 2025' } });
    expect(pg.steps.map((s) => s.id)).toEqual(['where', 'plan']);
    expect(pg.next.id).toBe('P.closed');
    expect(pg.next.button).toMatchObject({ id: 'openNext', href: '#/plan/' + NEXT.id });
    expect(pg.closed.next).toEqual({ id: NEXT.id, name: 'Pots and valves from April 2025' });
    // Where you are, as at the close: the tax year 2024/25
    expect(pg.steps.find((s) => s.id === 'where').result.text).toMatch(/2024\/25/);
  });
  it('the successor: what came before it, with the way back', () => {
    const pg = planPage(entries, NEXT.id, null, { today: '2026-10-02' });
    expect(pg.stageKey).toBe('draft-retired');
    expect(pg.before).toMatchObject({ from: '2025-04', until: 'March 2025', previous: { id: CLOSED.id, name: 'Pots and valves 2023' } });
    expect(pg.closed).toBe(null);
  });
  it('the list: the closed plan under "Previous plans", last; the move offered on a plan lived on, not on the closed one or a draft with nothing recorded', () => {
    const { groups } = planRows(entries, { today: '2026-10-02' });
    expect(groups.map((g) => g.id)).toEqual(['other', 'previous']);
    expect(groups[1].rows.map((r) => r.id)).toEqual([CLOSED.id]);
    const rows = groups.flatMap((g) => g.rows);
    expect(rows.find((r) => r.id === CLOSED.id).close).toBe(null);
    expect(rows.find((r) => r.id === NEXT.id).close).toBe(null);
    const c = rows.find((r) => r.id === LADDER.id).close;
    expect(c).toMatchObject({ suggested: '2026-10', asked: true, held: true, partner: null, name: 'Linkers since 2024 from October 2026' });
    expect(c.pots).toEqual({ pension: 429700, isa: 15030, gia: 0 });
    expect(c.potsFrom).toBe('your record for September 2026 for the pension; What you hold (8 November 2024) for the ISAs; this plan’s own figure for the ordinary investment account');
    // each month with the new plan's default name from it, so the name box follows the month chosen (either reason)
    expect(c.months[0]).toEqual({ month: '2026-10', words: 'October 2026', year: '2026/27', name: 'Linkers since 2024 from October 2026', workingName: 'Linkers since 2024, back to work from October 2026' });
    expect(c.months[1]).toMatchObject({ month: '2026-11', name: 'Linkers since 2024 from November 2026' });
  });
  it('the household: a closed plan is no partner\'s plan to pick; the plan that carries it on is', () => {
    const linked = [{ ...copy(LADDER), household: { partnerScenarioId: CLOSED.id } }, CLOSED, NEXT].map((plan) => ({ plan, newer: false, failed: false }));
    const h = householdOf(linked, LADDER.id, { today: '2026-10-02' });
    expect(h.candidates.map((c) => c.id)).toEqual([NEXT.id]);
    expect(h.partner).toBe(null);
  });
  it('every new sentence passes banned.js: the stage lines, the next sentences, the page\'s lines, the menu\'s box, the planner\'s words', () => {
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
    const slots = { month: 'March 2029', name: 'Shares and cash', closed: 'March 2029', next: 'Shares and cash', old: 'Ladder', partner: 'Sam’s plan', pension: '£250,000', isa: '£40,000', gia: '', asOf: ', 1 July 2026', year: '2029/30', from: closeQuestionOf(LADDER, { now: NOW }).potsFrom };
    const W = PLAN.list.actions;
    const texts = [PLAN.stageLines.closed, PLAN.stageLines['closed-alone'], PLAN.stageLines.closing, PLAN.stageLines['closing-alone'], PLAN.theirLines.closed, PLAN.next['P.closed'], PLAN.next['P.closedAlone'], PLAN.page.before, PLAN.page.beforeAlone, PLAN.page.closedKeeps, PLAN.page.closedKeepsNoDocument, PLAN.page.closedStep, PLAN.page.closedStepAlone, PLAN.page.journeyClosed,
      W.close, W.closeIntro, W.closeKeeps, W.closeNew, W.closeHeld, W.closeAsk, W.closeMonth, W.closeMonthOption, W.closeName, W.closePension, W.closeIsa, W.closeGia, W.closePartner, W.closeYes, W.done.closed, W.problems.notClosable, W.problems.noPots, PLAN.list.groups.previous]
      .map((t) => fill(t, slots));
    const q = closeQuestionOf(LADDER, { now: NOW, plans: [LADDER] });
    const planner = [PLAN_CLOSE_WORDS.offer, PLAN_CLOSE_WORDS.title, PLAN_CLOSE_WORDS.ok, closeSays(q, '2027-04'), monthRefusalWords(monthRefusal(CLOSED, '2025-04')), monthRefusalWords(monthRefusal(NEXT, '2025-03')),
      closedWords(closedReading(CLOSED, [NEXT])), beforeWords(beforeReading(NEXT, [CLOSED])), planListDesc(CLOSED), deriveStage(CLOSED, NOW).banner.text];
    for (const t of [...texts, ...planner]) expect(bannedIn(t), t).toEqual([]);
    for (const t of texts) expect(t).not.toMatch(/\{\w+\}/);
  });
});

describe('the planner\'s line, question and plan menu (src/ui/planCloseUi.js)', () => {
  it('the line: closed, carrying one on, offered', () => {
    expect(planCloseLineHtml({ closed: closedReading(CLOSED, [NEXT]) })).toContain('openPlanById(\'' + NEXT.id + '\')');
    expect(planCloseLineHtml({ before: beforeReading(NEXT, [CLOSED]) })).toContain('Under your previous plan ‘Pots and valves 2023’ until March 2025');
    expect(planCloseLineHtml({ offered: true })).toContain('movePlanToNew()');
    expect(planCloseLineHtml({})).toBe('');
  });
  it('the question names the month, the tax year, the pots held, and asks the name', () => {
    const q = closeQuestionOf(LADDER, { now: NOW, plans: [LADDER] });
    const html = planCloseQuestionHtml(q, { name: 'Next' });
    expect(html).toContain('<option value="2026-10" selected>From October 2026 (tax year 2026/27)</option>');
    expect(html).toContain('id="pcName" value="Next"');
    expect(html).toContain('Put in what you hold today. The boxes are filled in from your record for September 2026 for the pension; What you hold (8 November 2024) for the ISAs;');
    expect(html).toContain('id="pcPension" min="0" step="1000" value="429700"');
    expect(closeSays(q, '2027-04')).toBe('‘Linkers since 2024’ closes at the end of March 2027 and is kept as it is: its 18 recorded months stay here to read, and nothing after March 2027 can be recorded on it. The new plan’s first tax year is 2027/28; it takes the months from April 2027.');
    const bare = copy(LADDER); delete bare.holdings;
    expect(planCloseQuestionHtml(closeQuestionOf(bare, { now: NOW }), { name: 'Next' })).toContain('id="pcPension"');
  });
  it('the plan menu: previous plans last, each saying so', () => {
    expect(plansInListOrder([CLOSED, NEXT, LADDER]).map((p) => p.id)).toEqual([NEXT.id, LADDER.id, CLOSED.id]);
    expect(planListDesc(CLOSED)).toBe('Previous plan — closed March 2025');
    expect(planListDesc(NEXT)).toBe('Stopped work in July 2023');
    expect(monthBefore('2025-01')).toBe('2024-12');
  });
});

// ---- a review of 6.56.0: each finding's case, so it cannot come back ---------------------------------------------------
import { copyOf } from '../src/services/PlanCopy.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { runPositionOf, lockPositionOf } from '../src/services/PlanFromToday.js';
import { successorRefusal, partnerCandidates, closesAhead } from '../src/services/PlanClosed.js';
import { closePotsOf, linkedPartnerOf } from '../src/services/PlanClose.js';
import { fillOffer } from '../src/services/MonthFill.js';
import { holdOf } from '../src/answers/plan/hold.js';
import { moveOf } from '../src/answers/plan/move.js';
import { moveOfferOf } from '../src/services/PlanMove.js';
import { closeCapRefusal, potsFromAnswers, closedTimingWords, decisionLockBannerHtml } from '../src/ui/planCloseUi.js';
import { planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';

/** A write folded onto a plan as Firestore's updateDoc folds it (a dotted key is a path). */
function fold(plan, data) {
  const out = copy(plan);
  for (const [k, v] of Object.entries(data)) {
    const path = k.split('.'); let o = out;
    for (let i = 0; i < path.length - 1; i++) { if (!o[path[i]] || typeof o[path[i]] !== 'object') o[path[i]] = {}; o = o[path[i]]; }
    o[path[path.length - 1]] = copy(v);
  }
  return out;
}
const tyOf = (ym) => { const [y, m] = String(ym).slice(0, 7).split('-').map(Number); const a = m >= 4 ? y : y - 1; return String(a % 100).padStart(2, '0') + '/' + String((a + 1) % 100).padStart(2, '0'); };
const entriesOf = (...plans) => plans.map((plan) => ({ plan, newer: false, failed: false }));

describe('review: a closed plan keeps its plan document and plan vs actual (the store)', () => {
  it('the unlock\'s archives, a cleared or rewritten document, and a new plan of record are each refused; the same write on a plan not closed is not', () => {
    expect(refusal(CLOSED, { planDocument: null })).toEqual(['planDocument']);
    expect(refusal(CLOSED, { planDocumentArchive: [], planDocument: null })).toEqual(['planDocument', 'planDocumentArchive']);
    expect(refusal(CLOSED, { planDocument: { ...CLOSED.planDocument, createdAt: NOW.toISOString() } })).toEqual(['planDocument']);
    expect(refusal(CLOSED, { 'decisionTool.planOfRecordArchive': [], 'decisionTool.planOfRecord': null })).toEqual(['decisionTool.planOfRecord', 'decisionTool.planOfRecordArchive']);
    expect(refusal(CLOSED, { 'decisionTool.planOfRecord': { savedAt: NOW.toISOString() } })).toEqual(['decisionTool.planOfRecord']);
    expect(writeNeedsGuard(CLOSED, { planDocument: null })).toBe(true);
    expect(refusal(CLOSED, { planDocument: copy(CLOSED.planDocument) })).toBe(null);   // the same document: nothing changes
    expect(refusal(LADDER, { planDocument: null, planDocumentArchive: [] })).toBe(null);
  });
});

describe('review: closing a plan that is not locked records where its pots stood, so its run does not move', () => {
  it('fixture 13 unlocked after its records: the same years, offset and State Pension year before and after the close', () => {
    const un = copy(LADDER); un.decisionTool.settings.locked = false; delete un.planDocument; delete un.decisionTool.planOfRecord;
    const w = closeWrite(un, { month: '2026-11', nextPlanId: 'N1', now: NOW });
    expect(w['decisionTool.settings.lockedPosition']).toEqual(lockPositionOf(effectiveStressSettings(un, { now: NOW }), NOW, un));
    expect(refusal(un, w)).toBe(null);
    const closed = fold(un, w);
    const cfg = (p) => simulationConfigFromSettings({}, effectiveStressSettings(p, { now: NOW }), NOW);
    const before = cfg(un), after = cfg(closed);
    expect({ years: after.years, yearOffset: after.yearOffset, spStartYear: after.spStartYear }).toEqual({ years: before.years, yearOffset: before.yearOffset, spStartYear: before.spStartYear });
    expect(before.yearOffset).toBeGreaterThan(0);
  });
});

describe('review: a copy is a new plan, linked to none', () => {
  it('a copy of the closed plan is not closed and may be unlocked; a copy of its successor refuses no early month', () => {
    for (const carryHistory of [false, true]) {
      const c = { ...copyOf(CLOSED, 'Copy', { carryHistory, now: NOW }), id: 'C1' };
      for (const k of ['closedAt', 'nextPlanId', 'previousPlanId', 'before']) expect(k in c).toBe(false);
      expect(deriveStage(c, NOW).key).not.toBe('closed');
      const unlock = { 'decisionTool.settings.locked': false, 'decisionTool.settings.unlockedAt': NOW.toISOString(), 'decisionTool.settings.unlockCount': 1 };
      expect(refusal(c, unlock)).toBe(null);
    }
    const n = { ...copyOf(NEXT, 'Copy', { carryHistory: false, now: NOW }), id: 'C2' };
    for (const k of ['closedAt', 'nextPlanId', 'previousPlanId', 'before']) expect(k in n).toBe(false);
    expect(decisionEntryAllowed(deriveStage(n, NOW), '2025-03')).toEqual({ ok: true });
  });
});

describe('review: the plan that carries one on reads its pots as today\'s once its first month has come', () => {
  it('fixture 13 (no month work stopped) moved from October 2026: its pots are today\'s, seven months into its year 0; a lock records the same', () => {
    const n = { ...successorOf(LADDER, { month: '2026-10', name: 'Next', now: NOW }), id: 'N' };
    expect(n.stressTool.settings.stoppedWork).toBeUndefined();
    const ss = effectiveStressSettings(n, { now: NOW });
    expect(ss.potsAsOf).toBe('today');
    expect(runPositionOf(ss, deriveTiming(ss, NOW))).toEqual({ elapsedYears: 0, monthsIntoYear: 6 });
    expect(lockPositionOf(ss, NOW, n)).toEqual({ elapsedYears: 0, monthsIntoYear: 6 });
    expect(lockPositionOf(ss, NOW)).toBe(null);   // the settings alone, as before: nothing moves for a plan with no `before`
  });
  it('one whose first month is still to come is read as before (from year 0)', () => {
    const n = { ...successorOf(LADDER, { month: '2027-01', name: 'Next', now: NOW }), id: 'N' };
    expect(n.stressTool.settings.firstTaxYear).toBe(2026);
    expect(effectiveStressSettings(n, { now: NOW }).potsAsOf).toBeUndefined();
  });
});

describe('review: Month by month records nothing outside the plan\'s months', () => {
  const hist = CLOSED.decisionTool.history;
  it('the store refuses a record before the successor\'s first month, from any route; the months from then on go', () => {
    expect(refusal(NEXT, { 'decisionTool.history': [{ date: '2025-03-12T19:00:00.000Z', taxYear: '24/25', monthlyNet: 1 }] })).toEqual(['decisionTool.history']);
    expect(successorRefusal(NEXT, { 'decisionTool.history': [{ date: '2025-04-12T19:00:00.000Z', taxYear: '25/26', monthlyNet: 1 }] })).toBe(null);
    expect(writeNeedsGuard(NEXT, { 'decisionTool.history': [] })).toBe(true);
    expect(writeNeedsGuard(LADDER, { 'decisionTool.history': [] })).toBe(false);
  });
  it('the fill offers no month before the successor\'s first, even with its year 0 set up from April', () => {
    const taxYears = { '25/26': { yearSetupComplete: true } };
    const all = fillOffer([], '2025-08', { taxYears, taxYearOf: tyOf, planStart: '2025-04', from: '2025-04' });
    expect(all.choices[0]).toBe('2025-04');
    const bounded = fillOffer([], '2025-08', { taxYears, taxYearOf: tyOf, planStart: '2025-04', floor: '2025-06', from: '2025-04' });
    expect(bounded.choices).toEqual(['2025-06', '2025-07']);
  });
  it('on the closed plan the fill offers nothing for a month after the close, and no month after it otherwise', () => {
    const taxYears = { '23/24': { yearSetupComplete: true }, '24/25': { yearSetupComplete: true } };
    expect(fillOffer(hist, '2026-11', { taxYears, taxYearOf: tyOf, ceiling: '2025-03' })).toBe(null);
    const at = fillOffer(hist.filter((h) => h.date.slice(0, 7) !== '2024-12'), '2025-03', { taxYears, taxYearOf: tyOf, ceiling: '2025-03' });
    expect(at.choices.every((m) => m <= '2025-03')).toBe(true);
  });
});

describe('review: the new plan\'s pots, per kind of account and from the newest figure', () => {
  it('a record of the pension\'s funds alone leaves the ISAs and the ordinary account at the plan\'s own figures', () => {
    const p = copy(LADDER); p.holdings.lines = p.holdings.lines.filter((l) => l.wrapper === 'SIPP'); p.holdings.updatedAt = '2026-10-01';
    const pots = closePotsOf(p);
    expect(pots.from).toEqual({ pension: 'holdings', isa: 'plan', gia: 'plan' });
    expect(pots.isa).toBe(15000);
    expect(successorOf(p, { month: '2027-04', name: 'Next', now: NOW }).stressTool.settings.isaBalance).toBe(15000);
  });
  it('a record older than the last month recorded gives way to that month\'s pots for the pension', () => {
    const pots = closePotsOf(LADDER);
    expect(pots.from.pension).toBe('record');
    expect(pots.asOf.pension).toBe('2026-09');
    expect(pots.pension).toBe(429700);
  });
  it('the planner: an emptied pension box is no figure; the guest cap holds as for New plan', () => {
    expect(potsFromAnswers({ pension: '', isa: '1', gia: '' })).toBe(null);
    expect(potsFromAnswers({ pension: '  ', isa: '', gia: '' })).toBe(null);
    expect(potsFromAnswers({ pension: '0', isa: '', gia: '' })).toEqual({ pension: 0, isa: 0, gia: 0 });
    const three = [1, 2, 3].map((i) => ({ id: 'guest-' + i, planDetails: { name: 'P' + i } }));
    expect(closeCapRefusal(three, true)).toMatch(/up to/);
    expect(closeCapRefusal(three, false)).toBe(null);
    expect(closeCapRefusal(three.slice(0, 2), true)).toBe(null);
  });
});

describe('review: a change-over still to come', () => {
  const ahead = { ...copy(LADDER), closedAt: '2027-03', nextPlanId: NEXT.id };
  it('the plan keeps its stage, says when it closes, and takes its months until then', () => {
    expect(closesAhead(ahead, NOW)).toBe(true);
    const st = deriveStage(ahead, NOW);
    expect(st.key).toBe(deriveStage(LADDER, NOW).key);
    expect(st.closing).toBe(true);
    expect(st.readOnly).not.toContain('decision');
    expect(st.banner.text).toContain('This plan closes at the end of March 2027: record the months until then here');
    expect(decisionEntryAllowed(st, '2026-11')).toEqual({ ok: true });
    expect(decisionEntryAllowed(st, '2027-04').ok).toBe(false);
    expect(closedWords(closedReading(ahead, [NEXT], NOW))).toBe('Closes at the end of March 2027; carries on as ‘' + NEXT.planDetails.name + '’.');
    const { groups } = planRows(entriesOf(ahead, NEXT), { today: '2026-10-02' });
    expect(groups.some((g) => g.id === 'previous')).toBe(false);
    expect(groups.flatMap((g) => g.rows).find((r) => r.id === LADDER.id).line.id).toBe('closing');
    expect(planListDesc(ahead)).toBe('Closes at the end of March 2027');
    const page = planPage(entriesOf(ahead, NEXT), LADDER.id, null, { today: '2026-10-02' });
    expect([page.closed, page.closing]).toEqual([null, true]);   // lived on, its months recorded, never unlocked
    expect(page.steps.map((x) => x.id)).toContain('month');
  });
});

describe('review: a closed plan in the other tools', () => {
  it('its start is never moved, nor its successor\'s back past its first month', () => {
    expect(moveOfferOf(CLOSED, NOW)).toBe(null);
    const stopped = { ...copy(NEXT), decisionTool: { ...copy(NEXT.decisionTool), settings: { ...NEXT.decisionTool.settings, locked: true } } };
    stopped.stressTool.settings.stoppedWork = '2023-07';
    expect(moveOfferOf(stopped, NOW)).toBe(null);
  });
  it('V7: what you hold, the move and the household are read, not changed, with the way to the successor', () => {
    const e = entriesOf(CLOSED, NEXT);
    for (const v of [holdOf(e, CLOSED.id, { today: '2026-10-02' }), moveOf(e, CLOSED.id, { today: '2026-10-02' }), householdOf(e, CLOSED.id, { today: '2026-10-02' })]) {
      expect(v.editable).toBe(false);
      expect(v.closed).toMatchObject({ closedAt: '2025-03', next: { id: NEXT.id } });
    }
    expect(holdOf(e, NEXT.id, { today: '2026-10-02' }).editable).toBe(true);
  });
  it('the household: never a plan\'s own previous or next plan, nor a closed one; the same rule in both apps', () => {
    const other = { ...copy(DRAFT), id: 'Other1' };
    expect(partnerCandidates([CLOSED, NEXT, other], NEXT).map((p) => p.id)).toEqual(['Other1']);
    const aheadOld = { ...copy(LADDER), closedAt: '2027-03', nextPlanId: 'Succ' }, succ = { ...copy(DRAFT), id: 'Succ', previousPlanId: LADDER.id, before: { kind: 'plan', planId: LADDER.id, from: '2027-04' } };
    expect(partnerCandidates([aheadOld, succ, other], succ).map((p) => p.id)).toEqual(['Other1']);
    expect(householdOf(entriesOf(NEXT, CLOSED, other), NEXT.id, { today: '2026-10-02' }).candidates.map((c) => c.id)).toEqual(['Other1']);
  });
  it('a partner linked only from their own plan (or reading its budget) is asked about too', () => {
    const p = { ...copy(DRAFT), id: 'P1', household: { partnerScenarioId: LADDER.id } };
    expect(linkedPartnerOf(LADDER, [LADDER, p]).id).toBe('P1');
    expect(closeQuestionOf(LADDER, { now: NOW, plans: [LADDER, p] }).partner).toEqual({ id: 'P1', name: planNameOf(p) });
    const b = { ...copy(DRAFT), id: 'P2', budgetTool: { sharedFrom: LADDER.id } };
    expect(linkedPartnerOf(LADDER, [LADDER, b]).id).toBe('P2');
    expect(linkedPartnerOf(LADDER, [LADDER, { ...p, closedAt: '2025-01' }])).toBe(null);
  });
  it('the next-step banner offers no plan that is not there', () => {
    const st = deriveStage(CLOSED, NOW);
    expect(nextStepFor({ stage: st, successorName: null })).toEqual({ html: 'This plan is closed: it ran to the end of March 2025. Its months stay here to read.', btn: 'See its months', action: { kind: 'tab', tab: 'decision', sub: 'history' } });
  });
  it('V7 Where you are counts the months cut in the closed plan\'s own last tax year', () => {
    const cut = copy(CLOSED); cut.decisionTool.history = cut.decisionTool.history.map((h) => (h.taxYear === '24/25' ? { ...h, inProtection: true } : h));
    const n = cut.decisionTool.history.filter((h) => h.taxYear === '24/25').length;
    const where = planPage(entriesOf(cut, NEXT), CLOSED.id, 'where', { today: '2026-10-02' }).steps.find((x) => x.id === 'where');
    expect(where.figures.cutMonths).toBe(n);
    expect(n).toBeGreaterThan(0);
  });
  it('V7: a closed plan with no plan document says so, and its month step sets nothing up after the close', () => {
    const bare = copy(CLOSED); delete bare.planDocument;
    const page = planPage(entriesOf(bare, NEXT), CLOSED.id, 'where', { today: '2026-10-02' });
    expect(page.closed.hasDocument).toBe(false);
    expect(page.steps.find((x) => x.id === 'where').result.id).toBe('where.closedNoDocument');
    const month = planPage(entriesOf(CLOSED, NEXT), CLOSED.id, 'month', { today: '2026-10-02' }).steps.find((x) => x.id === 'month');
    expect(month.result.id).toBe('month.closed');
    expect(month.buttons).toEqual([]);
    for (const t of [month.result, page.steps.find((x) => x.id === 'where').result].map((r) => (r.parts || []).map((x) => (typeof x === 'string' ? x : '')).join(''))) expect(bannedIn(t)).toEqual([]);
  });
  it('the planner: the Timing summary of a closed plan is read as at its close', () => {
    const words = closedTimingWords('You stopped work in July 2023. Plan started 6 April 2023 (tax year 2023/24); today is plan year 3 of 30.', CLOSED, NOW);
    expect(words).toBe('You stopped work in July 2023. Plan started 6 April 2023 (tax year 2023/24). This plan closed at the end of March 2025, in plan year 1.');
    expect(closedTimingWords('Same.', LADDER, NOW)).toBe('Same.');
  });
  it('the plan document carries the closed line above Where you are', () => {
    const html = planDocumentHtml(CLOSED.planDocument, { whereAmI: '<p id="w">where</p>', notice: '<p id="n">Closed March 2025.</p>' });
    expect(html.indexOf('id="n"')).toBeGreaterThan(-1);
    expect(html.indexOf('id="n"')).toBeLessThan(html.indexOf('id="w"'));
  });
});
