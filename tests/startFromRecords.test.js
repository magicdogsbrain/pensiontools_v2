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
  startLaterOf, moveOfferOf, planMoveOf, moveBlockedOf, reAnchorAllowance, reAnchorCopy, positionAfterMove, pickUpYearOf,
  firstRecordedMonthOf, firstRecordedMonthIn, stopAskOf, moveFactsOf
} from '../src/services/PlanMove.js';
import { movedPlanOf, movePatch } from '../src/answers/plan/moveStart.js';
import { runForDocument } from '../src/answers/plan/lastsRun.js';
import { applyPatch, lockedStartOf } from '../src/answers/plan/about.js';
import { homeOf } from '../src/answers/plan/home.js';
import { planPage } from '../src/answers/plan/read.js';
import { lockedPlanWriteRefusal } from '../src/services/LockedPlanGuard.js';
import { nextStepFor, NEXT_STEP_WORDS } from '../src/services/NextStep.js';
import { deriveStage } from '../src/services/LifeStage.js';
import { lockedStartHtml, moveStartQuestion, moveStartDoneWords, startMovePointerHtml } from '../src/ui/planStartUi.js';
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
function moved(plan, now = NOW) {
  return at(now, () => {
    const mp = movedPlanOf(plan, { now });
    const run = runForDocument(mp.plan, { today: TODAY, essentials: 0 });
    return movePatch(plan, { now, run });
  });
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
  it('with no month work stopped: the same move, never "When did you stop work?" first', () => {
    const p = alex({ stop: null });
    expect(startLaterOf(p, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: null, to: 2026, blocked: false, recordsFrom: '2026-06' });
    expect(moveOfferOf(p, NOW)).toEqual({ stopMonth: null, from: 2027, to: 2026, years: 1, recordsFrom: '2026-06' });
    // "this tax year" asked for changes nothing: the months say the year
    expect(moveOfferOf(p, NOW, { thisYear: true })).toEqual(moveOfferOf(p, NOW));
    const ls = lockedStartOf(p, { today: TODAY });
    expect(ls.ask).toBe(false);
    expect(ls.nowMove).toBe(null);
    expect(ls.move).toMatchObject({ yearStop: '2026/27', yearStart: '2027/28', records: 'June 2026', start: 'April 2027', how: {} });
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

describe('a State Pension given only by plan year: the move waits for its date, and still says where the months begin', () => {
  /** Alex with the State Pension set by the plan's count of years only (no date), in both copies. */
  const byYear = (o) => {
    const r = raw(o);
    for (const s of [r.stressTool.settings, r.decisionTool.settings]) { delete s.spStartDate; s.statePensionYear = 11; }
    return upgradeScenario(r, { now: NOW }).scenario;
  };
  for (const stop of ['2024-10', null]) {
    it(stop ? 'stopped October 2024' : 'no month work stopped', () => {
      const p = byYear({ stop });
      expect(startLaterOf(p, NOW)).toMatchObject({ kind: 'move', to: 2026, spAsk: true, recordsFrom: '2026-06' });
      const ls = lockedStartOf(p, { today: TODAY });
      expect(ls.move).toMatchObject({ yearStop: '2026/27', yearStart: '2027/28', records: 'June 2026', start: 'April 2027', spAsk: true, how: null });
      const said = fill(ls.move.stepped ? ABOUT.lockedStart.moveRecords : ABOUT.lockedStart.moveRecordsLevel, ls.move);
      expect(said).toMatch(/^Your plan is set to start in April 2027, but your recorded months begin in June 2026\. Start it from 2026\/27: /);
      expect(said).not.toMatch(/the tax year you stopped|stopped work in/);
      // once a date is typed, the same words, and the confirm
      const typed = lockedStartOf(p, { today: TODAY, typed: { moveSpDate: '14 March 2029' } });
      expect(typed.move).toMatchObject({ records: 'June 2026', yearStop: '2026/27', spAsk: true });
      expect(typed.move.confirm[0].id).toBe('firstRecords');
    });
  }
});

describe('the move: one write, the records re-stamped from year 0, nothing else in them changed', () => {
  for (const stop of ['2024-10', null]) {
    describe(stop ? 'stopped October 2024' : 'no month work stopped', () => {
      const before = alex({ stop });
      const out = moved(before);
      const after = applyPatch(before, out.patch);
      it('one write the guard lets through (with and without the clock); both copies of year 0 at 2026/27', () => {
        expect(out.ok).toBe(true);
        expect(refusal(before, out.patch)).toBe(null);
        expect(refusal(before, out.patch, { now: NOW })).toBe(null);
        expect(after.stressTool.settings.firstTaxYear).toBe(2026);
        expect(after.decisionTool.settings.firstTaxYear).toBe(2026);
        expect(after.decisionTool.settings.locked).toBe(true);
        expect(after.stressTool.settings.stoppedWork).toBe(stop || undefined);
        expect(out.line).toEqual({ id: 'movedRecords', slots: { year: '2026/27' } });
      });
      it('the earliest recorded month is year 0: every month of 2026/27 is year 0, its old mark gone, every figure kept', () => {
        const h0 = before.decisionTool.history, h1 = after.decisionTool.history;
        expect(h1.length).toBe(h0.length);
        expect(h1.map((h) => h.yearNum)).toEqual(h0.map(() => 0));
        const DERIVED = ['yearNum', 'bridgeYear', 'planStartYear', 'strategySource', 'strategyNote', 'settingsChecksum'];
        const strip = (h) => { const o = { ...h }; for (const k of DERIVED) delete o[k]; return o; };
        h1.forEach((h, i) => {
          expect(JSON.stringify(strip(h))).toBe(JSON.stringify(strip(h0[i])));
          expect(h.bridgeYear).toBeUndefined();
        });
      });
      it('the moved plan is offered nothing more, and the journey says why', () => {
        expect(startLaterOf(after, NOW)).toBe(null);
        expect(moveOfferOf(after, NOW)).toBe(null);
        expect(after.journey.at(-1)).toMatchObject({ label: 'The plan’s start moved to 2026/27, when your recorded months begin' });
        expect(after.journey.at(-1).note).toContain('Your recorded months begin in June 2026; the plan’s income had been set to start in 2027/28.');
      });
    });
  }
});

describe('the guard: a plan with months recorded moves only to the tax year they begin in', () => {
  const plan = alex();
  const m = planMoveOf(plan, NOW);
  /** A move worked out exactly as the move works it, to another year `to`: both copies, every key and the lock's position agree. */
  const consistent = (p, to, stop = '2024-10') => {
    const ss = p.stressTool.settings, ds = p.decisionTool.settings;
    const stress = { ...reAnchorCopy(ss, 2027 - to, to, 'stress'), ...(stop ? { stoppedWork: stop } : {}) };
    return { [S]: stress, [D]: { ...reAnchorCopy(ds, 2027 - to, to, 'decision'), lockedPosition: positionAfterMove(stress, ds.lockedAt) } };
  };
  it('the move itself passes; the same move to the stop\'s year, past the recorded months, is refused', () => {
    expect(refusal(plan, { [S]: m.stress, [D]: m.decision })).toBe(null);
    expect(refusal(plan, consistent(plan, 2026))).toBe(null);
    expect(refusal(plan, consistent(plan, 2025))).not.toBe(null);    // a year with nothing recorded
    expect(refusal(plan, consistent(plan, 2024))).not.toBe(null);    // the stop's year: nothing recorded either
    // without the months the guard reads the stop's year, as before (a caller that hands it no months)
    const asStored = { stress: plan.stressTool.settings, decision: plan.decisionTool.settings };
    const w24 = consistent(plan, 2024);
    expect(reAnchorAllowance(asStored, { stress: w24[S], decision: w24[D] })).not.toBe(null);
    expect(reAnchorAllowance({ ...asStored, history: plan.decisionTool.history }, { stress: w24[S], decision: w24[D] })).toBe(null);
  });
  it('with no month said: only the year the months begin in; a year before it, or one not come yet by the clock, is refused', () => {
    const p = alex({ stop: null });
    expect(refusal(p, consistent(p, 2026, null))).toBe(null);
    expect(refusal(p, consistent(p, 2026, null), { now: NOW })).toBe(null);
    expect(refusal(p, consistent(p, 2025, null))).not.toBe(null);
    expect(refusal(p, consistent(p, 2024, null))).not.toBe(null);
    // the clock, where the caller has it: a year after this tax year is never the move (months recorded ahead of today)
    expect(refusal(p, consistent(p, 2026, null), { now: new Date(2026, 1, 1, 12) })).not.toBe(null);   // 1 Feb 2026: 2026/27 not come
  });
  it('a plan with no months: the stop\'s year as before, and this tax year with no month as before', () => {
    const none = alex({ months: [] });
    expect(refusal(none, consistent(none, 2024))).toBe(null);
    expect(refusal(none, consistent(none, 2026))).not.toBe(null);
    const bare = alex({ stop: null, months: [] });
    expect(refusal(bare, consistent(bare, 2026, null), { now: NOW })).toBe(null);
  });
});

describe('the words, in both apps', () => {
  const plan = alex();
  const SCOPES = ['all', 'record', 'retired', 'planner'];
  it('the to-do: "Your plan is set to start in April 2027, but your recorded months begin in June 2026. Start it from 2026/27."', () => {
    const step = nextStepFor({ stage: deriveStage(plan, NOW), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(plan, NOW) });
    expect(step).toEqual({ html: 'Your plan is set to start in April 2027, but your recorded months begin in June 2026. Start it from 2026/27.', btn: 'Move the start', action: { kind: 'start-later' } });
    const e = { plan, newer: false, failed: false };
    const h = homeOf([e], plan.id, { today: TODAY });
    const first = h.todo.items[0];
    expect(first.id).toBe('start.moveRecords');
    expect(first.button).toMatchObject({ id: 'moveStart', href: '#/plan/' + plan.id + '/about' });
    expect(fill(HOME.items['start.moveRecords'].title, first.slots) + ' — ' + fill(HOME.items['start.moveRecords'].detail, first.slots))
      .toBe('Start it from 2026/27 — Your plan is set to start in April 2027, but your recorded months begin in June 2026.');
    const pg = planPage([e], plan.id, null, { today: TODAY });
    expect(fill(PLAN.next[pg.next.words], pg.next.slots)).toBe('Your plan is set to start in April 2027, but your recorded months begin in June 2026. Next: start it from 2026/27.');
    expect(PLAN.buttons.moveStart).toBe('Move the start');
  });
  it('the line under the Timing block, and V7\'s "About you and when": the same sentence, and the move\'s button', () => {
    const offer = moveOfferOf(plan, NOW);
    const m = planMoveOf(plan, NOW);
    const line = plain(lockedStartHtml({ offer, stepAge: m.stress.shapeAgeNow, stepped: true }));
    expect(line).toContain('Your plan is set to start in April 2027, but your recorded months begin in June 2026. Start it from 2026/27 : your recorded months are kept and read against it.');
    expect(lockedStartHtml({ offer })).toContain('moveLockedPlanStart(\'stop\')');
    const ls = lockedStartOf(plan, { today: TODAY });
    expect(fill(ABOUT.lockedStart.moveRecords, ls.move)).toBe('Your plan is set to start in April 2027, but your recorded months begin in June 2026. Start it from 2026/27: your recorded months are kept and read against it. Your first income step keeps its amount and runs from 2026/27; your later steps keep their ages. The plan stays locked.');
    // a blocked move (none today: a date always carries the State Pension) would say the same months
    expect(plain(lockedStartHtml({ blocked: { from: 2027, recordsFrom: '2026-06' } }))).toContain('your recorded months begin in June 2026');
  });
  it('beside the saved first tax year ("2027/28 (saved)"): where it belongs, with the move\'s button — in both apps', () => {
    const offer = moveOfferOf(plan, NOW);
    const html = startMovePointerHtml(offer);
    expect(plain(html)).toBe('Move it to 2026/27, when your recorded months begin. Move the start…');
    expect(html).toContain('id="tmStartMoveBtn"');
    expect(html).toContain('moveLockedPlanStart(\'stop\')');
    expect(startMovePointerHtml(offer, true)).toContain('moveLockedPlanStart(\'sp\')');
    expect(plain(startMovePointerHtml(moveOfferOf(alex({ months: [] }), NOW)))).toBe('Move it to 2024/25, the tax year you stopped work. Move the start…');
    expect(startMovePointerHtml(null)).toBe('');
    const ls = lockedStartOf(plan, { today: TODAY });
    expect(fill(ABOUT.lockedStart.pointer, ls.move)).toBe('Move it to 2026/27, when your recorded months begin.');
    expect(ABOUT.lockedStart.pointerOpen).toBe('Move the start…');
  });
  it('the confirm names the tax year and says the recorded months are kept and read against it; the toast likewise', () => {
    const m = planMoveOf(plan, NOW);
    const q = plain(moveStartQuestion(m, moveFactsOf(plan, m)).html);
    expect(q).toContain('Move the plan\'s start to 2026/27?');
    expect(q).toContain('The plan\'s first tax year becomes 2026/27 , the tax year your recorded months begin (June 2026); it was 2027/28. Your recorded months are kept and read against 2026/27.');
    expect(q).toContain('5 recorded months (June 2026 to October 2026) keep every figure you entered.');
    expect(q).not.toMatch(/Months you did not record since you stopped/);   // the years before the months had no plan
    expect(moveStartDoneWords(m)).toContain('The plan\'s start is now 2026/27, when your recorded months begin.');
    const ls = lockedStartOf(plan, { today: TODAY });
    const C = ABOUT.lockedStart.confirm;
    const ours = ls.move.confirm.map((l) => fill(C.lines[l.id], l.slots));
    expect(ls.move.confirm.map((l) => l.id)).not.toContain('fill');
    expect(ours[0]).toBe('The plan’s first tax year becomes 2026/27, the tax year your recorded months begin (June 2026); it was 2027/28. Your recorded months are kept and read against 2026/27. The plan stays locked: nothing is unlocked and no setting is added.');
    expect(fill(ABOUT.toast.movedRecords, { year: '2026/27' })).toContain('The plan’s start is now 2026/27, when your recorded months begin.');
  });
  it('the plan document\'s "Where you are" points at the move to that year; a stop\'s move as before', () => {
    const w = { beforeStart: true, planStart: '2027/28', today: NOW };
    expect(plain(whereAmIHtml({ ...w, startLater: startLaterOf(plan, NOW) }))).toContain('Your plan is set to start in 2027/28. Start it from 2026/27, when your recorded months begin: the banner at the top of the page does it.');
    expect(plain(whereAmIHtml({ ...w, startLater: startLaterOf(alex({ months: [] }), NOW) }))).toContain('Start it from the tax year you stopped work: the banner');
  });
  it('pass the banned list, and leave no slot unfilled', () => {
    const slots = { start: 'April 2027', records: 'June 2026', moveTo: '2026/27', yearStop: '2026/27', yearStart: '2027/28', year: '2026/27', to: '2026/27' };
    const L = ABOUT.lockedStart;
    for (const t of [L.moveRecords, L.moveRecordsLevel, L.blockedRecords, L.pointer, L.pointerStop, L.pointerOpen, L.confirm.lines.firstRecords, ABOUT.toast.movedRecords,
      HOME.items['start.moveRecords'].title, HOME.items['start.moveRecords'].detail, HOME.items['start.blockedRecords'].title, HOME.items['start.blockedRecords'].detail,
      PLAN.next['P.startMoveRecords'], PLAN.next['P.startBlockedRecords'], NEXT_STEP_WORDS.startMoveRecords, NEXT_STEP_WORDS.startBlockedRecords]) {
      const w = fill(t, slots);
      expect(bannedHits(w, SCOPES), t).toEqual([]);
      expect(w, t).not.toMatch(/\{\w+\}|undefined|null/);
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
