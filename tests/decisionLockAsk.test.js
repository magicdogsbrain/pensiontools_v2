/**
 * 6.20.2 — a saver's plan is not locked by accident (research/v7/square-one-audit.md §3, "Locking by accident").
 *
 * Recording a Decision month — or setting up its tax year — locks the plan (PlanLock.lockPlanIfNeeded). For someone
 * still saving that lock writes no saving path, freezes the plan and closes the Decision tool until they stop. So a plan
 * in future mode ("I will retire at…"), before the month it stops and not locked yet, asks first and says where a saver
 * records their pot. Retired plans, plans with no age, and plans already locked keep today's behaviour.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveStage, decisionLockQuestion } from '../src/services/LifeStage.js';
import { askBeforeMonthLocks, decisionLockQuestionHtml } from '../src/ui/decisionLockAsk.js';

const NOW = new Date(2026, 9, 2);   // 2 October 2026
const saver = JSON.parse(readFileSync('tests/fixtures/plans/05-saver-committed.json', 'utf8'));   // 48, retiring at 60
const ladder = JSON.parse(readFileSync('tests/fixtures/plans/03-gilt-ladder-runup.json', 'utf8'));   // retired, run-up
const unlocked = (p) => ({ ...p, decisionTool: { ...p.decisionTool, settings: { ...p.decisionTool.settings, locked: false }, history: [], taxYears: {} } });
const stageOf = (p) => deriveStage(p, NOW);

describe('decisionLockQuestion: who is asked', () => {
  it('a saver with an unlocked plan, before the month they stop, is asked', () => {
    const st = stageOf(unlocked(saver));
    expect(st.timingMode).toBe('future');
    expect(st.locked).toBe(false);
    expect(st.beforeStart).toBe(true);
    const q = decisionLockQuestion(st);
    expect(q).not.toBeNull();
    expect(q.okLabel).toBe('Lock the plan and carry on');
    expect(q.cancelLabel).toBe('Not now');
    const words = q.paragraphs.join(' ');
    expect(words).toMatch(/still saving until [A-Z][a-z]+ \d{4}/);
    expect(words).toContain('locks the plan');
    expect(words).toContain('Locking freezes the plan');
    expect(words).toContain('Stress tester and Decision tool settings');
    expect(words).toContain('record your pot each month on the Accumulation tab');
    expect(words).toContain('Lock plan & create the plan document');
  });
  it('a saver whose plan is already locked is not asked (the stage gate speaks instead)', () => {
    expect(decisionLockQuestion(stageOf(saver))).toBeNull();
  });
  it('a retired plan keeps today\'s behaviour: no question, locked or not', () => {
    expect(decisionLockQuestion(stageOf(ladder))).toBeNull();
    expect(decisionLockQuestion(stageOf(unlocked(ladder)))).toBeNull();
  });
  it('a plan past its stop month, or with no age, keeps today\'s behaviour', () => {
    const st = stageOf(unlocked(saver));
    expect(decisionLockQuestion({ ...st, beforeStart: false })).toBeNull();
    expect(decisionLockQuestion({ ...st, timingMode: 'legacy' })).toBeNull();
    expect(decisionLockQuestion(null)).toBeNull();
  });
});

describe('askBeforeMonthLocks: the question, once per plan', () => {
  const st = stageOf(unlocked(saver));
  const asker = (answer) => { const calls = []; return { calls, confirm: async (msg, opts) => { calls.push({ msg, opts }); return answer; } }; };

  it('no question for this plan: carries on without asking', async () => {
    const a = asker(false);
    expect(await askBeforeMonthLocks(stageOf(ladder), { planId: 'p0', confirm: a.confirm })).toBe(true);
    expect(a.calls.length).toBe(0);
  });
  it('"Not now": stops, and asks again next time', async () => {
    const a = asker(false);
    expect(await askBeforeMonthLocks(st, { planId: 'p1', confirm: a.confirm })).toBe(false);
    expect(await askBeforeMonthLocks(st, { planId: 'p1', confirm: a.confirm })).toBe(false);
    expect(a.calls.length).toBe(2);
    expect(a.calls[0].opts).toEqual({ okLabel: 'Lock the plan and carry on', cancelLabel: 'Not now' });
    expect(a.calls[0].msg.html).toBe(decisionLockQuestionHtml(decisionLockQuestion(st)));
  });
  it('"Lock the plan and carry on": carries on, and is not asked again for that plan (Calculate, then Save)', async () => {
    const a = asker(true);
    expect(await askBeforeMonthLocks(st, { planId: 'p2', confirm: a.confirm })).toBe(true);
    expect(await askBeforeMonthLocks(st, { planId: 'p2', confirm: a.confirm })).toBe(true);
    expect(a.calls.length).toBe(1);
    expect(await askBeforeMonthLocks(st, { planId: 'p3', confirm: a.confirm })).toBe(true);   // another plan is asked
    expect(a.calls.length).toBe(2);
  });
  it('the question is plain text in the dialog: a heading and paragraphs, nothing else', () => {
    const html = decisionLockQuestionHtml(decisionLockQuestion(st));
    expect(html.startsWith('<h3')).toBe(true);
    expect(html).toContain('Lock this plan?');
    expect(html).toContain('&quot;Lock plan &amp; create the plan document&quot;');
    expect(html).not.toMatch(/<script|data-on-/);
  });
});

describe('index.html asks before the month that would lock: on Calculate (its tax-year set-up locks too) and on Save', () => {
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
});
