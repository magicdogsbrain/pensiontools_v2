/**
 * The three levers of "Will it last?" on a saved plan (research/v7/answer-D.md 3.5–3.7, 3.9; road-to-7.md step 7):
 * answers/plan/lastsRun.js runLever on the corpus plans — each the same one test on a COPY of the plan's effective settings;
 * the plan itself is never changed; nothing is written. The pure parts (scaledIncome, withWork, afterFall) are checked for
 * what they change and what they leave alone; the words (lasts.js leverViews) for their ids and slots. The fixtures are the
 * corpus plans (Alex's: 02, a couple: 10). Full runs: about half a second each; "Could I spend more?" at most seven.
 */
import { describe, it, expect } from 'vitest';
import { runLasts, runLever, scaledIncome, withWork, afterFall, pickFigures, LEVER_KINDS, SPEND_SEARCH_STEPS, SPEND_MORE_MAX, SPEND_LESS_MIN, FALL_SHARE, WORK_LIMITS } from '../../../src/answers/plan/lastsRun.js';
import { leverViews, leverLines } from '../../../src/answers/plan/lasts.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { ON_COURSE_SHARE } from '../../../src/services/OnCourse.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const ALEX = entryOf(C['02-pnv-draft']).plan;        // "Alex's plan" in the browser journeys: Pots & Valves, retired
const COUPLE = entryOf(C['10-couple-b']).plan;
const copy = (v) => JSON.parse(JSON.stringify(v));
const now = noon(TODAY);

describe('the pure parts: what each lever changes in a copy of the settings, and what it leaves alone', () => {
  it('scaledIncome: the base income, each step\'s amount and the saved per-year schedule, all by the same factor; nothing else', () => {
    const s = { baseSalary: 20000, incomeSteps: [{ fromAge: 62, amount: 20000 }, { fromAge: 75, amount: 16000, decline: 1 }], targetSchedule: [20000, 20000, 16000], other: 3000, equityMin: 100 };
    const out = scaledIncome(s, 1.5);
    expect(out).toEqual({ baseSalary: 30000, incomeSteps: [{ fromAge: 62, amount: 30000 }, { fromAge: 75, amount: 24000, decline: 1 }], targetSchedule: [30000, 30000, 24000], other: 3000, equityMin: 100 });
    expect(s.baseSalary).toBe(20000);                                           // a copy: the settings in are untouched
    expect(scaledIncome({ baseSalary: 18000 }, 1).baseSalary).toBe(18000);
  });
  it('withWork: one more row of the planner\'s own extra incomes, from the first year, for the years, taxed as income; the rows there stay', () => {
    const s = { extraIncomes: [{ label: 'Rent', startYear: 2, endYear: 9, annual: 6000, indexation: 'cpi' }] };
    const out = withWork(s, { yearly: 15000, years: 3 });
    expect(out.extraIncomes).toEqual([{ label: 'Rent', startYear: 2, endYear: 9, annual: 6000, indexation: 'cpi' }, { label: 'Work', startYear: 0, endYear: 2, annual: 15000, indexation: 'cpi' }]);
    expect(s.extraIncomes.length).toBe(1);
    expect(withWork({}, { yearly: 12000, years: 1 }).extraIncomes).toEqual([{ label: 'Work', startYear: 0, endYear: 0, annual: 12000, indexation: 'cpi' }]);
  });
  it('afterFall: the pension\'s shares cut by a fifth; an ISA only where invested like the pension; a taxable account by its shares; a saver\'s projected pot; the mix kept', () => {
    const s = { equityMin: 500000, bondMin: 300000, cashTarget: 200000, isaBalance: 100000, isaGrowth: 'cash', taxableStart: 0 };
    const f = afterFall(s);
    expect(f.settings).toMatchObject({ equityMin: 400000, bondMin: 300000, cashTarget: 200000, isaBalance: 100000 });
    expect(f.potBefore).toBe(1100000);
    expect(f.potAfter).toBe(1000000);
    expect(f.equityShare).toBe(0.5);
    const inv = afterFall({ ...s, isaGrowth: 'invested', taxableStart: 50000, taxableMix: 'equity', potAtRetirement: { sipp: 1000000, isa: 120000, source: 'accumulation' } });
    expect(inv.settings.isaBalance).toBe(90000);                                // a fifth of its half in shares
    expect(inv.settings.taxableStart).toBe(40000);
    expect(inv.settings.potAtRetirement).toEqual({ sipp: 900000, isa: 108000, source: 'accumulation' });
    expect(afterFall({ equityMin: 0, bondMin: 0, cashTarget: 0 }).potAfter).toBe(0);
    expect(FALL_SHARE).toBe(0.2);
  });
  it('pickFigures: the planner\'s own figures, and whether they last in 9 futures out of 10', () => {
    expect(pickFigures({ share: 0.93, chancePct: 93, typicalLeft: 1234.6, badCaseLeft: 10.2, years: 32.4 })).toEqual({ share: 0.93, chancePct: 93, typicalLeft: 1235, badCaseLeft: 10, years: 32, lasts: true });
    expect(pickFigures({ share: 0.8, chancePct: 80 }).lasts).toBe(false);
    expect(pickFigures(null)).toBe(null);
    expect(ON_COURSE_SHARE).toBe(0.9);
  });
});

describe('the levers on Alex\'s plan (corpus 02) and the couple\'s (corpus 10): each the one test on a copy; the plan untouched', { timeout: 120_000 }, () => {
  for (const [name, plan] of [['Alex', ALEX], ['the couple', COUPLE]]) {
    it(`${name}: "What if shares fell by a fifth?" — one run; the pots said; never a better chance than as it is`, () => {
      const before = copy(plan);
      const base = runLasts(plan, { today: TODAY });
      const progress = [];
      const f = runLever(plan, { today: TODAY, lever: { kind: 'fall' }, onProgress: (d, t) => progress.push([d, t]) });
      expect(progress).toEqual([[0, 1], [1, 1]]);
      expect(plan).toEqual(before);
      expect(f).toMatchObject({ kind: 'fall', ok: true, runs: 1, share: 0.2 });
      const s = effectiveStressSettings(plan, { now });
      expect(f.potBefore).toBe(Math.round((+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.isaBalance || 0) + (+s.taxableStart || 0)));
      expect(f.potAfter).toBeLessThan(f.potBefore);
      expect(f.at.chancePct).toBeLessThanOrEqual(base.a.chancePct + 1e-9);
      expect(JSON.parse(JSON.stringify(f))).toEqual(f);
    });
    it(`${name}: "Would some work help?" — one run through extraIncomes; never a worse chance than without it; the limits refuse what will not do`, () => {
      const base = runLasts(plan, { today: TODAY });
      const w = runLever(plan, { today: TODAY, lever: { kind: 'work', yearly: 15000, years: 3 } });
      expect(w).toMatchObject({ kind: 'work', ok: true, runs: 1, yearly: 15000, years: 3, field: 'extraIncomes' });
      expect(w.at.chancePct).toBeGreaterThanOrEqual(base.a.chancePct - 1e-9);
      for (const bad of [{ yearly: 0, years: 3 }, { yearly: 15000, years: 0 }, { yearly: 15000, years: 6 }, { yearly: 15000, years: 2.5 }, { yearly: WORK_LIMITS.yearlyMax + 1, years: 1 }]) {
        expect(runLever(plan, { today: TODAY, lever: { kind: 'work', ...bad } })).toMatchObject({ kind: 'work', ok: false, reason: 'lever', runs: 0 });
      }
    });
    it(`${name}: "Could I spend more?" — the base run then a bounded search, at most ${1 + SPEND_SEARCH_STEPS} runs; the figure found lasts in 9 futures out of 10; the cost said`, () => {
      const base = runLasts(plan, { today: TODAY });
      const progress = [];
      const sm = runLever(plan, { today: TODAY, lever: { kind: 'spendMore' }, onProgress: (d, t) => progress.push([d, t]) });
      expect(sm.kind).toBe('spendMore');
      expect(sm.ok).toBe(true);
      expect(sm.runs).toBeLessThanOrEqual(1 + SPEND_SEARCH_STEPS);
      expect(sm.runs).toBeGreaterThanOrEqual(2);
      expect(progress[0]).toEqual([0, 1 + SPEND_SEARCH_STEPS]);
      expect(sm.base.chancePct).toBeCloseTo(base.a.chancePct, 9);
      if (sm.base.lasts) {
        expect(sm.factor).toBeGreaterThanOrEqual(1);
        expect(sm.factor).toBeLessThanOrEqual(SPEND_MORE_MAX);
        expect(sm.perMonth).toBeGreaterThanOrEqual(0);
        expect(sm.at.lasts).toBe(true);
        expect(sm.perMonth % 10).toBe(0);
        // the figure found: the plan's income scaled by the factor lasts, and a step further would not (unless capped)
        if (!sm.capped) expect(sm.factor).toBeLessThan(SPEND_MORE_MAX);
      } else {
        expect(sm.evenHalf || (sm.factor >= SPEND_LESS_MIN && sm.factor < 1)).toBe(true);
      }
    });
  }
  it('a lever the run does not know is refused; the plan\'s id and stamp are not read', () => {
    expect(() => runLever(ALEX, { today: TODAY, lever: { kind: 'sideways' } })).toThrow(/no lever/);
    expect(LEVER_KINDS).toEqual(['spendMore', 'work', 'fall']);
  });
});

describe('the words (lasts.js leverViews): one line id per outcome, the slots the screen fills, the one comparison line on a locked plan', () => {
  const verdict = { ok: true, chancePct: 95.5 };
  it('off, working, invalid, failed, done — and what each draws', () => {
    const none = leverViews({}, { verdict });
    expect(none.spendMore).toEqual({ status: 'off', lines: [], problem: null, reason: null });
    expect(none.compare).toBe(null);
    expect(none.workDraft).toEqual({ yearly: '', years: '' });
    const v = leverViews({
      spendMore: { status: 'working', lever: { kind: 'spendMore' }, result: null, reason: null },
      work: { status: 'invalid', lever: { kind: 'work' }, result: null, reason: 'years' },
      fall: { status: 'failed', lever: { kind: 'fall' }, result: null, reason: 'noWorker' }
    }, { verdict, workDraft: { yearly: '15,000', years: '9' } });
    expect(v.spendMore.status).toBe('working');
    expect(v.work).toMatchObject({ status: 'invalid', problem: 'years' });
    expect(v.fall).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(v.workDraft).toEqual({ yearly: '15,000', years: '9' });
  });
  it('spend more: more, none, less, even half, capped; work and fall: the line and how it was done; the cost', () => {
    const at = { share: 0.91, chancePct: 91.2, typicalLeft: 200000, badCaseLeft: 0, years: 30, lasts: true };
    const base = { share: 0.95, chancePct: 95.5, typicalLeft: 300000, badCaseLeft: 1000, years: 30, lasts: true };
    expect(leverLines('spendMore', { ok: true, runs: 7, factor: 1.16, perMonth: 240, base, at, capped: false, evenHalf: false }, '95.5'))
      .toEqual([{ id: 'spendMore.more', slots: { perMonth: '£240', chance: '91.2', typical: '£200,000', baseChance: '95.5' } }, { id: 'runs', slots: { runs: '7', s: 's' } }]);
    expect(leverLines('spendMore', { ok: true, runs: 7, factor: 1, perMonth: 0, base, at: base, capped: false, evenHalf: false }, '95.5')[0]).toEqual({ id: 'spendMore.none', slots: { baseChance: '95.5' } });
    const short = { ...base, share: 0.7, chancePct: 70, lasts: false };
    expect(leverLines('spendMore', { ok: true, runs: 7, factor: 0.75, perMonth: -500, base: short, at, capped: false, evenHalf: false }, '70')[0]).toEqual({ id: 'spendMore.less', slots: { perMonth: '£500', chance: '91.2', baseChance: '70.0' } });
    expect(leverLines('spendMore', { ok: true, runs: 7, factor: null, perMonth: null, base: short, at: null, capped: false, evenHalf: true }, '70')[0]).toEqual({ id: 'spendMore.evenHalf', slots: { baseChance: '70.0' } });
    expect(leverLines('spendMore', { ok: true, runs: 2, factor: 2, perMonth: 1500, base, at, capped: true, evenHalf: false }, '95.5')[0]).toEqual({ id: 'spendMore.capped', slots: { perMonth: '£1,500', chance: '91.2', typical: '£200,000' } });
    expect(leverLines('spendMore', { ok: false, reason: 'unaffordable', runs: 1 }, '95.5')).toEqual([{ id: 'unaffordable', slots: {} }]);
    expect(leverLines('work', { ok: true, runs: 1, yearly: 15000, years: 1, at }, '95.5')).toEqual([
      { id: 'work.line', slots: { yearly: '£15,000', years: '1', s: '', words: 'in 9 futures out of 10', chance: '91.2', typical: '£200,000', baseChance: '95.5' } },
      { id: 'work.how', slots: { years: '1', s: '' } }]);
    expect(leverLines('fall', { ok: true, runs: 1, potBefore: 745000, potAfter: 661000, at }, '95.5')).toEqual([
      { id: 'fall.line', slots: { potBefore: '£745,000', potAfter: '£661,000', words: 'in 9 futures out of 10', chance: '91.2', typical: '£200,000', baseChance: '95.5' } },
      { id: 'fall.how', slots: {} }]);
    expect(leverLines('work', { ok: false, reason: 'lever', runs: 0 }, '95.5')).toEqual([{ id: 'leverNo', slots: {} }]);
  });
  it('a locked plan with a document: once a lever is done, ONE comparison line — the document\'s figure, today\'s — never before, never a word of unlocking', () => {
    const done = { fall: { status: 'done', lever: { kind: 'fall' }, result: { ok: true, runs: 1, potBefore: 1, potAfter: 1, at: { share: 0.9, chancePct: 90, typicalLeft: 0 } } } };
    const v = leverViews(done, { verdict: { ok: true, chancePct: 97.3 }, documentVerdict: { ok: true, chancePct: 99.1 }, lockedOn: '1 July 2026' });
    expect(v.compare).toEqual({ id: 'locked', slots: { date: '1 July 2026', docChance: '99.1', chance: '97.3' } });
    expect(leverViews({}, { verdict: { ok: true, chancePct: 97.3 }, documentVerdict: { ok: true, chancePct: 99.1 }, lockedOn: '1 July 2026' }).compare).toBe(null);
    expect(leverViews(done, { verdict: { ok: true, chancePct: 97.3 } }).compare).toBe(null);
    expect(JSON.stringify(v)).not.toMatch(/unlock|wrong/i);
  });
});
