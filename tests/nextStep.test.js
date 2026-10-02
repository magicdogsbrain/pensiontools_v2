/**
 * 6.20.2 — the next-step banner follows the life stage (research/v7/square-one-audit.md §1, §5 item 1).
 *
 * Before: once the budget, the target and the Stress settings were done, the banner told everyone — a saver 12 years
 * from retiring included — to "set up the monthly Decision Tool"; the stage's own advice waited behind it. A plan made
 * from a V7 answer with no budget was told "Start here: walk through what retirement will actually cost".
 * Now: the onboarding chain's last step is the stage's own sentence (a saver → the Accumulation planner); only a plan
 * the app cannot place (no age today) keeps the Decision tool step. A plan from a V7 answer gets its budget offered as a
 * guide, never "Start here", and is never offered "use the budget as the start of the income shape".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { nextStepFor, nextStepAction, NEXT_STEP_WORDS } from '../src/services/NextStep.js';
import { STAGES } from '../src/services/LifeStage.js';
import { parse } from '../src/ui/inlineHandlers.js';

const stage = (key, extra = {}) => {
  const d = STAGES[key];
  return { key, label: d.label, locked: ['committed-saving', 'bridge', 'running'].includes(key), banner: d.banner ? { ...d.banner, text: d.banner.text.replace(/\{start\}/g, '2037/38') } : null, ...extra };
};
const budgetWith = (annual) => ({ lines: annual ? [{ annual, tier: 'essential' }] : [], derived: { allInComfortableMonthly: annual / 12 } });
const DONE = { budget: budgetWith(24000), stress: { baseSalary: 30000, configured: true }, decision: { configured: false } };
const text = (step) => step.html.replace(/<[^>]+>/g, '');

describe('the onboarding chain (a plan made in today\'s app): unchanged until its last step', () => {
  it('no budget → "Start here" with the walk-through', () => {
    const s = nextStepFor({ ...DONE, budget: budgetWith(0), stage: stage('saving') });
    expect(text(s)).toBe(NEXT_STEP_WORDS.startHere);
    expect(s.btn).toBe('Start the budget walk-through');
    expect(s.action).toEqual({ kind: 'budget-wizard' });
  });
  it('a budget but no target → use it as the start of the income shape', () => {
    const s = nextStepFor({ ...DONE, stress: { baseSalary: 0 }, stage: stage('approaching') });
    expect(text(s)).toMatch(/^Your budget adds up to about £2,000\/mo take-home\. That is today's spending/);
    expect(s.btn).toBe('Use it as the start of my income shape');
    expect(s.action).toEqual({ kind: 'apply-budget' });
  });
  it('a target but the Stress tester not set up → its settings', () => {
    const s = nextStepFor({ ...DONE, stress: { baseSalary: 30000 }, stage: stage('saving') });
    expect(s.btn).toBe('Open Stress Tester settings');
    expect(s.action).toEqual({ kind: 'stress-settings' });
  });
});

describe('the last step follows the life stage, not "set up the Decision tool"', () => {
  it('a saver is pointed at the Accumulation planner', () => {
    const s = nextStepFor({ ...DONE, stage: stage('saving') });
    expect(text(s)).toBe(STAGES.saving.banner.text);
    expect(s.btn).toBe('Open the Accumulation planner');
    expect(s.action).toEqual({ kind: 'tab', tab: 'accumulation' });
    expect(text(s)).not.toMatch(/Decision Tool/i);
  });
  it('someone within five years: the Stress tester, then the lock', () => {
    const s = nextStepFor({ ...DONE, stage: stage('approaching') });
    expect(s.btn).toBe('Open the Stress tester');
    expect(text(s)).toContain('lock the plan');
  });
  it('a retiree with a draft: stress-test it, then lock it from the Stress tester\'s Settings page', () => {
    const s = nextStepFor({ ...DONE, stage: stage('draft-retired') });
    expect(text(s)).toContain('lock it from the Stress tester');
    expect(s.action).toEqual({ kind: 'tab', tab: 'stress' });
  });
  it('a plan the app cannot place (no age today) still gets the Decision tool step', () => {
    const s = nextStepFor({ ...DONE, stage: stage('unknown') });
    expect(s.btn).toBe('Open the Decision Tool');
    expect(s.action).toEqual({ kind: 'tab', tab: 'decision' });
  });
  it('no stage worked out: as before, the Decision tool step', () => {
    expect(nextStepFor({ ...DONE, stage: null }).btn).toBe('Open the Decision Tool');
  });
  it('everything done and no stage sentence: nothing to say', () => {
    expect(nextStepFor({ ...DONE, decision: { configured: true }, stage: stage('unknown') })).toBeNull();
  });
  it('the stage still speaks once the Decision tool is set up (a saver who set it up anyway)', () => {
    expect(nextStepFor({ ...DONE, decision: { configured: true }, stage: stage('saving') }).btn).toBe('Open the Accumulation planner');
  });
});

describe('a locked plan: its stage speaks, or nothing (as before)', () => {
  it('locked while saving → the stage\'s sentence, whatever the chain would say', () => {
    const s = nextStepFor({ budget: budgetWith(0), stress: {}, decision: {}, stage: stage('committed-saving') });
    expect(text(s)).toBe(STAGES['committed-saving'].banner.text.replace(/\{start\}/g, '2037/38'));
    expect(s.action).toEqual({ kind: 'tab', tab: 'decision', sub: 'plandoc' });
  });
  it('running → nothing (the where-am-I strip speaks)', () => {
    expect(nextStepFor({ budget: budgetWith(0), stress: {}, decision: {}, stage: stage('running') })).toBeNull();
  });
});

describe('a plan made from a V7 answer: the budget is a guide, never "Start here"', () => {
  it('no budget: the stage speaks, with the budget offered as a guide beside it', () => {
    const s = nextStepFor({ ...DONE, budget: budgetWith(0), stage: stage('saving'), fromAnswer: true });
    expect(text(s)).not.toMatch(/Start here/);
    expect(text(s)).toContain(NEXT_STEP_WORDS.savingFromAnswer);
    expect(text(s)).toContain('Your budget is a guide');
    expect(text(s)).not.toContain('Set the income you will want (Budget)');
    expect(s.btn).toBe('Open the Accumulation planner');
    expect(s.html).toContain('data-on-click="switchToTab(\'budget\'); setTimeout(() => openBudgetWizard(), 400); return false;"');
  });
  it('the guide link is a handler the page can run', () => {
    expect(() => parse("switchToTab('budget'); setTimeout(() => openBudgetWizard(), 400); return false;")).not.toThrow();
  });
  it('with a budget: the stage alone, no guide line', () => {
    const s = nextStepFor({ ...DONE, stage: stage('approaching'), fromAnswer: true });
    expect(text(s)).toBe(STAGES.approaching.banner.text);
  });
  it('never offers to turn the budget into the target', () => {
    const s = nextStepFor({ ...DONE, stress: { baseSalary: 0, configured: true }, stage: stage('saving'), fromAnswer: true });
    expect(s.action).not.toEqual({ kind: 'apply-budget' });
    expect(text(s)).not.toMatch(/income shape/);
  });
  it('no budget and nothing else to say: the guide on its own, still not "Start here"', () => {
    const s = nextStepFor({ ...DONE, budget: budgetWith(0), decision: { configured: true }, stage: stage('unknown'), fromAnswer: true });
    expect(text(s)).toBe(NEXT_STEP_WORDS.guideAlone);
    expect(s.btn).toBe('Open the budget walk-through');
    expect(s.action).toEqual({ kind: 'budget-wizard' });
  });
  it('locked: its stage speaks; no guide line', () => {
    const s = nextStepFor({ ...DONE, budget: budgetWith(0), stage: stage('committed-saving'), fromAnswer: true });
    expect(text(s)).not.toContain('Your budget is a guide');
  });
});

describe('nextStepAction: what each button does', () => {
  const fakeWin = () => {
    const calls = [];
    const win = {
      calls,
      switchToTab: (t) => calls.push(['tab', t]),
      openBudgetWizard: () => calls.push(['wizard']),
      applyBudgetToPlan: async () => calls.push(['apply']),
      updateNextStepBanner: () => calls.push(['banner']),
      scrollTo: () => calls.push(['top']),
      document: { querySelector: (q) => ({ click: () => calls.push(['click', q]) }) }
    };
    return win;
  };
  const flush = () => new Promise((r) => setTimeout(r, 450));
  it('the walk-through, the budget, the Stress settings and a tab with its sub-tab', async () => {
    let w = fakeWin(); nextStepAction({ kind: 'budget-wizard' }, w)(); await flush();
    expect(w.calls).toEqual([['tab', 'budget'], ['wizard']]);
    w = fakeWin(); await nextStepAction({ kind: 'apply-budget' }, w)();
    expect(w.calls).toEqual([['apply'], ['banner']]);
    w = fakeWin(); nextStepAction({ kind: 'stress-settings' }, w)(); await flush();
    expect(w.calls).toEqual([['tab', 'stress'], ['top'], ['click', '.sub-tab[data-stresstab="stresssettings"]']]);
    w = fakeWin(); nextStepAction({ kind: 'tab', tab: 'decision', sub: 'plandoc' }, w)(); await flush();
    expect(w.calls).toEqual([['tab', 'decision'], ['click', '.sub-tab[data-decisiontab="plandoc"]']]);
  });
});

describe('index.html: the banner is the module\'s', () => {
  const html = readFileSync('index.html', 'utf8');
  const fn = html.slice(html.indexOf('window.updateNextStepBanner = async function'), html.indexOf('window.updateNextStepBanner = async function') + 2500);
  it('reads the plan, works out the stage, and hands both to nextStepFor', () => {
    expect(fn).toContain('nextStepFor(');
    expect(fn).toContain('planFromAnswer()');
    expect(fn).toContain('nextStepAction(');
    expect(fn).not.toContain('set up the monthly Decision Tool');
  });
});
