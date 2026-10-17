/**
 * Every unlocked plan is asked before a Decision month locks it, and "yes" runs the FULL lock (v6 usability audit,
 * decision 3, 17 Oct 2026; research/v7/v6-usability-audit.md §1 problem 5, §2.6, §5 decision 3).
 *
 * Until now the first monthly entry, or its tax-year set-up, locked an unlocked plan without a word (only a saver was
 * asked, 6.20.2) — on the Decision tool's own defaults (£500,000, a £31,200 target, 35 years), with no plan document.
 * Now everyone is asked "This locks the plan. Lock it now?"; "yes" runs the same lock as Stress settings → Lock
 * (settings copied across, document written) BEFORE the month is recorded; "Not now" leaves the month unrecorded.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveStage, decisionLockQuestion } from '../src/services/LifeStage.js';
import { askBeforeMonthLocks, decisionLockQuestionHtml, LOCKED_FROM_DECISION } from '../src/ui/decisionLockAsk.js';

const NOW = new Date(2026, 9, 2);   // 2 October 2026
const saver = JSON.parse(readFileSync('tests/fixtures/plans/05-saver-committed.json', 'utf8'));   // 48, retiring at 60
const ladder = JSON.parse(readFileSync('tests/fixtures/plans/03-gilt-ladder-runup.json', 'utf8'));   // retired, run-up
const unlocked = (p) => ({ ...p, decisionTool: { ...p.decisionTool, settings: { ...p.decisionTool.settings, locked: false }, history: [], taxYears: {} } });
const stageOf = (p) => deriveStage(p, NOW);

describe('decisionLockQuestion: who is asked', () => {
  it('a saver with an unlocked plan, before the month they stop, is asked — and told where a saver records their pot', () => {
    const st = stageOf(unlocked(saver));
    expect(st.timingMode).toBe('future');
    expect(st.locked).toBe(false);
    expect(st.beforeStart).toBe(true);
    const q = decisionLockQuestion(st);
    expect(q).not.toBeNull();
    expect(q.title).toBe('This locks the plan. Lock it now?');
    expect(q.okLabel).toBe('Lock the plan and carry on');
    expect(q.cancelLabel).toBe('Not now');
    const words = q.paragraphs.join(' ');
    expect(words).toMatch(/still saving until [A-Z][a-z]+ \d{4}/);
    expect(words).toContain('locks the plan');
    expect(words).toContain('copies your Stress tester settings across to the Decision tool');
    expect(words).toContain('writes the plan document');
    expect(words).toContain('record your pot each month on the Accumulation tab');
    expect(words).toContain('"Not now" leaves this month unrecorded');
  });
  it('a retired plan that is not locked is asked too (decision 3: everyone), in words that say what the lock does and keeps', () => {
    const q = decisionLockQuestion(stageOf(unlocked(ladder)));
    expect(q).not.toBeNull();
    expect(q.title).toBe('This locks the plan. Lock it now?');
    expect(q.okLabel).toBe('Lock the plan and record this month');
    expect(q.cancelLabel).toBe('Not now');
    const words = q.paragraphs.join(' ');
    expect(words).toContain('or setting up its tax year — locks the plan');
    expect(words).toContain('copies your Stress tester settings across to the Decision tool');
    expect(words).toContain('writes the plan document');
    expect(words).toContain('How often you draw, your records, what you hold and the Budget stay changeable');
    expect(words).toContain('"Not now" leaves this month unrecorded');
    expect(words).toContain('Lock plan & create the plan document');
  });
  it('a plan already locked is never asked (savers or retired)', () => {
    expect(decisionLockQuestion(stageOf(saver))).toBeNull();
    expect(decisionLockQuestion(stageOf(ladder))).toBeNull();
  });
  it('a plan past its stop month, or with no age, is asked in the general words', () => {
    const st = stageOf(unlocked(saver));
    expect(decisionLockQuestion({ ...st, beforeStart: false }).okLabel).toBe('Lock the plan and record this month');
    expect(decisionLockQuestion({ ...st, timingMode: 'legacy' }).okLabel).toBe('Lock the plan and record this month');
    expect(decisionLockQuestion(null)).toBeNull();
  });
});

describe('askBeforeMonthLocks: the question, then the full lock', () => {
  const st = stageOf(unlocked(saver));
  const retired = stageOf(unlocked(ladder));
  const asker = (answer) => { const calls = []; return { calls, confirm: async (msg, opts) => { calls.push({ msg, opts }); return answer; } }; };
  const locker = () => { const reasons = []; return { reasons, lock: async (why) => { reasons.push(why); return true; } }; };

  it('a locked plan: carries on without asking, and locks nothing', async () => {
    const a = asker(false), l = locker();
    expect(await askBeforeMonthLocks(stageOf(ladder), { planId: 'p0', confirm: a.confirm, lock: l.lock })).toBe(true);
    expect(a.calls.length).toBe(0);
    expect(l.reasons).toEqual([]);
  });
  it('"Not now": stops, locks nothing, and asks again next time', async () => {
    const a = asker(false), l = locker();
    expect(await askBeforeMonthLocks(st, { planId: 'p1', confirm: a.confirm, lock: l.lock })).toBe(false);
    expect(await askBeforeMonthLocks(st, { planId: 'p1', confirm: a.confirm, lock: l.lock })).toBe(false);
    expect(a.calls.length).toBe(2);
    expect(l.reasons).toEqual([]);
    expect(a.calls[0].opts).toEqual({ okLabel: 'Lock the plan and carry on', cancelLabel: 'Not now' });
    expect(a.calls[0].msg.html).toBe(decisionLockQuestionHtml(decisionLockQuestion(st)));
  });
  it('"yes": the FULL lock runs first (the same route as Stress settings → Lock), then the month carries on; not asked again for that plan', async () => {
    const a = asker(true), l = locker();
    expect(await askBeforeMonthLocks(retired, { planId: 'p2', confirm: a.confirm, lock: l.lock })).toBe(true);
    expect(l.reasons).toEqual([LOCKED_FROM_DECISION]);
    expect(LOCKED_FROM_DECISION).toBe('first monthly entry');
    expect(await askBeforeMonthLocks(retired, { planId: 'p2', confirm: a.confirm, lock: l.lock })).toBe(true);   // Save after Calculate
    expect(a.calls.length).toBe(1);
    expect(l.reasons.length).toBe(1);   // locked once
    expect(await askBeforeMonthLocks(retired, { planId: 'p3', confirm: a.confirm, lock: l.lock })).toBe(true);   // another plan is asked
    expect(a.calls.length).toBe(2);
  });
  it('"yes" but the lock fails: the month does NOT go ahead, and the person is told', async () => {
    const a = asker(true); const said = [];
    const ok = await askBeforeMonthLocks(retired, { planId: 'p4', confirm: a.confirm, lock: async () => { throw new Error('offline'); }, say: (m, t) => said.push([m, t]) });
    expect(ok).toBe(false);
    expect(said.length).toBe(1);
    expect(said[0][0]).toContain('could not be locked, so this month was not recorded');
    expect(said[0][0]).toContain('offline');
    // not remembered as a yes: asked again
    expect(await askBeforeMonthLocks(retired, { planId: 'p4', confirm: a.confirm, lock: async () => { throw new Error('offline'); }, say: () => {} })).toBe(false);
    expect(a.calls.length).toBe(2);
  });
  it('"yes" with no way to lock (no commitPlanLock on the page): never records against an unlocked plan', async () => {
    const a = asker(true);
    expect(await askBeforeMonthLocks(retired, { planId: 'p5', confirm: a.confirm, lock: null })).toBe(false);
  });
  it('the question is plain text in the dialog: a heading and paragraphs, nothing else', () => {
    const html = decisionLockQuestionHtml(decisionLockQuestion(retired));
    expect(html.startsWith('<h3')).toBe(true);
    expect(html).toContain('This locks the plan. Lock it now?');
    expect(html).toContain('&quot;Lock plan &amp; create the plan document&quot;');
    expect(html).not.toMatch(/<script|data-on-/);
  });
});

describe('index.html: the Decision tool asks before the month that would lock, and the lock is the full one', () => {
  const html = readFileSync('index.html', 'utf8');
  const fn = (name) => html.slice(html.indexOf('window.' + name + ' = async function'), html.indexOf('window.' + name + ' = async function') + 6000);
  it('Calculate asks right after the stage gate, before the tax-year set-up', () => {
    const f = fn('handleDecisionSubmit');
    const ask = f.indexOf('askBeforeMonthLocks(stage)');
    expect(ask).toBeGreaterThan(f.indexOf('decisionEntryAllowed(stage, dateStr)'));
    expect(ask).toBeLessThan(f.indexOf('checkWizardNeeded(dateStr)'));
  });
  it('Save asks before anything is written', () => {
    const f = fn('saveCurrentDecision');
    const ask = f.indexOf('askBeforeMonthLocks(');
    expect(ask).toBeGreaterThan(0);
    expect(ask).toBeLessThan(f.indexOf('await saveDecision('));
  });
  it('commitPlanLock is the one full lock: Stress settings copied across (never the Decision defaults), the plan locked, the document written', () => {
    const f = fn('commitPlanLock');
    expect(f.indexOf('seedDecisionFromStress(')).toBeGreaterThan(0);
    expect(f.indexOf('seedDecisionFromStress(')).toBeLessThan(f.indexOf('lockPlanIfNeeded(reason)'));
    expect(f.indexOf('lockPlanIfNeeded(reason)')).toBeLessThan(f.indexOf('buildPlanDocumentNow(reason)'));
    expect(f).toContain('refreshDecisionLock()');
    expect(f).toContain('refreshLifeStage()');
  });
  it('the Stress settings button saves the form, then takes the same route', () => {
    const f = fn('lockPlanFromStress');
    expect(f.indexOf('await saveStressSettingsUI()')).toBeGreaterThan(0);
    expect(f.indexOf('await saveStressSettingsUI()')).toBeLessThan(f.indexOf("commitPlanLock('locked from Stress settings')"));
    expect(f).toContain('lockFromStressQuestion()');
  });
  it('the plan chip says the plan asks first, not that it locks itself', () => {
    expect(html).not.toContain('It locks itself when you record');
    expect(html).not.toContain('The plan locks itself again the moment a new entry is recorded');
    expect(html).toContain('You are asked before the first monthly entry or tax-year set-up locks it');
  });
});
