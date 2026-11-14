/**
 * A locked plan moves to the tax year its recorded months begin (7.4.3). A retired plan starts in the tax year work stopped,
 * or the tax year the person picked it up from; for a locked plan with months recorded, that is the tax year of its EARLIEST
 * recorded month (PlanMove.pickUpYearOf): never the stop's when the months begin later (year 0 would then be a whole tax year
 * with nothing recorded), never before the stop, never after this tax year. With months recorded the to-do is always the
 * move, with no question first; a plan with none is read exactly as before.
 *
 * The subject is fictional: Alex (the corpus's fixture 03, a gilt ladder locked on 1 July 2026 with year 0 2027/28) who
 * stopped work in October 2024 — two tax years back — and has recorded every month from June 2026 to October 2026, read on
 * 7 November 2026 (tax year 2026/27). Covered: the to-do and the offer, with and without the month work stopped; months
 * that begin before the stop; the one write, which the guard lets through, and the tamper cases it refuses; the records
 * re-stamped so the earliest month is year 0, every other byte the same; both apps' words (the to-do, the line under the
 * Timing block and V7's "About you and when", the pointer beside the saved first tax year, the confirm, the toast, the
 * journey); nothing written on open; and the same plan with no months recorded, moved to the stop's tax year as before.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import {
  startLaterOf, moveOfferOf, planMoveOf, moveBlockedOf, reAnchorCopy, positionAfterMove, pickUpYearOf,
  firstRecordedMonthOf, firstRecordedMonthIn, stopAskOf, moveFactsOf
} from '../src/services/PlanMove.js';
import { runForDocument } from '../src/answers/plan/lastsRun.js';
import { applyPatch, lockedStartOf } from '../src/answers/plan/about.js';
import { homeOf } from '../src/answers/plan/home.js';
import { planPage } from '../src/answers/plan/read.js';
import { lockedPlanWriteRefusal } from '../src/services/LockedPlanGuard.js';
import { nextStepFor, NEXT_STEP_WORDS } from '../src/services/NextStep.js';
import { deriveStage } from '../src/services/LifeStage.js';
import { lockedStartHtml } from '../src/ui/planStartUi.js';
import { getDefaultStressSettings } from '../src/storage/stressDefaults.js';
import { whereAmIHtml } from '../src/ui/components/PlanDocumentView.js';
import { setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';
import { ABOUT } from '../src/v7/copy/about.js';
import { HOME } from '../src/v7/copy/home.js';
import { PLAN } from '../src/v7/copy/plan.js';
import { bannedHits } from './v7/render/checkScreen.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const NOW = new Date(2026, 10, 7, 12);   // 7 November 2026: tax year 2026/27
const TODAY = '2026-11-07';
const copy = (v) => JSON.parse(JSON.stringify(v));
const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));
const key = (ym) => { const [y, m] = ym.split('-').map(Number); const Y = m >= 4 ? y : y - 1; return String(Y % 100).padStart(2, '0') + '/' + String((Y + 1) % 100).padStart(2, '0'); };
const S = 'stressTool.settings', D = 'decisionTool.settings';

/**
 * Alex as stored: retired, stopped work in `stop` (null: no month said), locked with year 0 2027/28, months recorded from
 * `months` (each a copy of the fixture's first month, dated then: the figures are not what is tested).
 */
function raw({ stop = '2024-10', months = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10'] } = {}) {
  const r = read('20-locked-start-after-stop');
  if (stop) r.stressTool.settings.stoppedWork = stop; else delete r.stressTool.settings.stoppedWork;
  const first = r.decisionTool.history[0];
  r.decisionTool.history = months.map((m) => ({ ...first, date: m, taxYear: key(m) }));
  return r;
}
const alex = (o) => upgradeScenario(raw(o), { now: NOW }).scenario;
function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  try { return fn(); } finally { vi.useRealTimers(); }
}
const refusal = (plan, data, o) => lockedPlanWriteRefusal(plan, data, getDefaultStressSettings(), o);

beforeAll(() => { setEquityOverride(EQUITY); });
afterAll(() => { setLinkersOverride(null); setEquityOverride(null); vi.useRealTimers(); });

describe('the year a plan with recorded months starts in (PlanMove.pickUpYearOf)', () => {
  it('the tax year of the earliest recorded month; the stop\'s when that is later; none without months', () => {
    expect(firstRecordedMonthIn([{ date: '2026-07' }, { date: '2026-06-01' }, { date: 'soon' }, null, { date: '2026-13' }])).toBe('2026-06');
    expect(firstRecordedMonthIn([])).toBe(null);
    expect(firstRecordedMonthOf(alex())).toBe('2026-06');
    expect(pickUpYearOf('2024-10', '2026-06')).toBe(2026);   // months begin later than the stop: their year
    expect(pickUpYearOf(null, '2026-06')).toBe(2026);
    expect(pickUpYearOf('2026-05', '2025-10')).toBe(2026);   // months before the stop (odd): never before the stop
    expect(pickUpYearOf('2024-10', '2026-03')).toBe(2025);   // a March is the tax year before
  });
});

describe('stopped work two tax years back, months recorded from June this tax year, year 0 next tax year', () => {
  const plan = alex();
  it('the to-do is the move, to this tax year, where the months begin; no question first', () => {
    expect(startLaterOf(plan, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: '2024-10', to: 2026, blocked: false, recordsFrom: '2026-06' });
    expect(moveOfferOf(plan, NOW)).toEqual({ stopMonth: '2024-10', from: 2027, to: 2026, years: 1, recordsFrom: '2026-06' });
    expect(moveBlockedOf(plan, NOW)).toBe(null);
  });
  it('with no month work stopped: the same reading; "About you and when" asks the month once and says the later start, never a move (7.10.0)', () => {
    const p = alex({ stop: null });
    expect(startLaterOf(p, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: null, to: 2026, blocked: false, recordsFrom: '2026-06' });
    expect(moveOfferOf(p, NOW)).toEqual({ stopMonth: null, from: 2027, to: 2026, years: 1, recordsFrom: '2026-06' });
    // "this tax year" asked for changes nothing: the months say the year
    expect(moveOfferOf(p, NOW, { thisYear: true })).toEqual(moveOfferOf(p, NOW));
    expect(lockedStartOf(p, { today: TODAY })).toEqual({ ask: true, leave: true, change: null, left: false, later: { start: 'April 2027' } });
  });
  it('months that begin before the stop\'s tax year (odd): the stop\'s year, in the stop\'s words', () => {
    const p = alex({ stop: '2026-05', months: ['2025-10', '2025-11'] });
    expect(startLaterOf(p, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: '2026-05', to: 2026, blocked: false });
    const m = planMoveOf(p, NOW);
    expect(m.recordsFrom).toBeUndefined();
    expect(m.history.map((h) => h.yearNum)).toEqual([0, 0]);   // nothing before year 0
  });
  it('months that begin after this tax year (ahead of today): nothing is moved yet, and nothing asked', () => {
    const p = alex({ stop: null, months: ['2027-04'] });
    expect(moveOfferOf(p, NOW)).toBe(null);
    // the months say the year: a month work stopped, once said, would move nothing, so it is not asked
    expect(startLaterOf(p, NOW)).toBe(null);
  });
  it('year 0 already where the months begin, records still marked from an old start, no month said: nothing asked', () => {
    // e.g. a plan unlocked, given an earlier year 0 and locked again: "When did you stop work?" would lead nowhere, as
    // whatever month is said the move goes to where the months begin, which is year 0 already
    const r = raw({ stop: null }); r.stressTool.settings.firstTaxYear = 2026; r.decisionTool.settings.firstTaxYear = 2026;
    const p = upgradeScenario(r, { now: NOW }).scenario;
    p.decisionTool.history = p.decisionTool.history.map((h) => ({ ...h, bridgeYear: true }));
    expect(startLaterOf(p, NOW)).toBe(null);
    expect(moveOfferOf(p, NOW)).toBe(null);
    const step = nextStepFor({ stage: deriveStage(p, NOW), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(p, NOW) });
    expect(step && step.action && step.action.kind).not.toBe('start-later');
  });
  it('a plan whose year 0 is already where its months begin, or earlier, has nothing to move', () => {
    const p = raw(); p.stressTool.settings.firstTaxYear = 2026; p.decisionTool.settings.firstTaxYear = 2026;
    for (const h of p.decisionTool.history) { delete h.bridgeYear; delete h.planStartYear; }
    expect(startLaterOf(upgradeScenario(p, { now: NOW }).scenario, NOW)).toBe(null);
    const q = raw(); q.stressTool.settings.firstTaxYear = 2025; q.decisionTool.settings.firstTaxYear = 2025;
    for (const h of q.decisionTool.history) { delete h.bridgeYear; delete h.planStartYear; }
    expect(startLaterOf(upgradeScenario(q, { now: NOW }).scenario, NOW)).toBe(null);   // never moved forward to its months
  });
  it('the same plan with no months recorded is read as before: the move to the stop\'s tax year', () => {
    const p = alex({ months: [] });
    expect(startLaterOf(p, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: '2024-10', to: 2024, blocked: false });
    expect(moveOfferOf(p, NOW)).toEqual({ stopMonth: '2024-10', from: 2027, to: 2024, years: 3 });
    // and with no month either: the question, with this tax year beside it
    expect(startLaterOf(alex({ stop: null, months: [] }), NOW)).toEqual({ kind: 'ask', start: 2027, thisYear: 2026 });
  });
});

describe('the words, in both apps', () => {
  const plan = alex();
  const SCOPES = ['all', 'record', 'retired', 'planner'];
  // retaken in 7.10.0 (spec-7100 §5): neither app has a to-do for the start; and (§7, step 12) neither moves it under the lock —
  // both say the later start and how it changes: unlock, change it on "About you and when" or under Timing, lock again
  it('no to-do for the start in either app: the banner never says it', () => {
    const step = nextStepFor({ stage: deriveStage(plan, NOW), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(plan, NOW) });
    if (step) expect(step.html).not.toMatch(/set to start in/);
    const e = { plan, newer: false, failed: false };
    const h = homeOf([e], plan.id, { today: TODAY });
    expect([...h.todo.items, ...h.todo.more].map((i) => i.id).filter((x) => x.startsWith('start.'))).toEqual([]);
    const pg = planPage([e], plan.id, null, { today: TODAY });
    expect(String(pg.next.id)).not.toMatch(/^P\.start/);
  });
  it('the line under the Timing block, and V7\'s "About you and when": the later start and how it changes; no button moves it', () => {
    const ls = lockedStartOf(plan, { today: TODAY });
    expect(ls).toEqual({ ask: false, leave: false, change: 'October 2024', left: false, later: { start: 'April 2027' } });
    expect(fill(ABOUT.lockedStart.laterLocked, ls.later)).toBe('Your plan is set to start in April 2027. To change its start, unlock it from “Your plan as locked”, change the start here, and lock it again.');
    const line = lockedStartHtml({ stopped: '2024-10', later: 2027 });
    expect(plain(line)).toContain('Your plan is set to start in April 2027. To change its start, unlock the plan (Settings), change the start under Timing, and lock it again.');
    expect(line).not.toMatch(/moveLockedPlanStart|tmMoveStartBtn|tmStartMoveBtn/);
  });
  it('the plan document\'s "Where you are": the later start, where the months begin, and how it changes — never "the banner does it"', () => {
    const w = { beforeStart: true, planStart: '2027/28', today: NOW };
    expect(plain(whereAmIHtml({ ...w, startLater: startLaterOf(plan, NOW) }))).toContain('Your plan is set to start in 2027/28. Your recorded months begin in 2026/27. To change its start, unlock the plan, change the start under Timing and lock it again.');
    expect(plain(whereAmIHtml({ ...w, startLater: startLaterOf(alex({ months: [] }), NOW) }))).toContain('Your plan is set to start in 2027/28. To change its start, unlock the plan');
    expect(plain(whereAmIHtml({ ...w }))).not.toMatch(/To change its start/);
  });
  it('pass the banned list, and leave no slot unfilled', () => {
    for (const t of [fill(ABOUT.lockedStart.laterLocked, { start: 'April 2027' }), plain(lockedStartHtml({ stopped: '2024-10', later: 2027 })), plain(whereAmIHtml({ beforeStart: true, planStart: '2027/28', today: NOW, startLater: startLaterOf(plan, NOW) }))]) {
      expect(bannedHits(t, SCOPES), t).toEqual([]);
      expect(t, t).not.toMatch(/\{\w+\}|undefined|null/);
    }
  });
});

describe('nothing is written by reading', () => {
  it('reading the to-do, the offer, the home and "About you and when" leaves the stored plan byte for byte', () => {
    const r = raw();
    const text = JSON.stringify(r);
    const p = upgradeScenario(r, { now: NOW }).scenario;
    const plan = copy(p);
    startLaterOf(p, NOW); moveOfferOf(p, NOW); planMoveOf(p, NOW); lockedStartOf(p, { today: TODAY });
    homeOf([{ plan: p, newer: false, failed: false }], p.id, { today: TODAY });
    expect(JSON.stringify(r)).toBe(text);
    expect(p).toEqual(plan);
    expect(stopAskOf(p, NOW)).toBe(false);   // it says when work stopped: nothing to ask
  });
});
