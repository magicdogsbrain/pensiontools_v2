/**
 * The next-step banner (one sentence and one button at the top of the planner), worked out from what the plan holds.
 * Moved out of index.html's updateNextStepBanner in 6.20.2, when it began to follow the life stage.
 *
 *  - A LOCKED plan: its stage's sentence (LifeStage.STAGES), or nothing once it is running (the where-am-I strip
 *    speaks). Its settings are frozen, so "open Settings" would mislead.
 *  - Otherwise the onboarding chain: the budget → the target → the Stress tester's settings → then the life stage's own
 *    sentence (a saver: the Accumulation planner; within five years: stress-test and lock; a retiree's draft: lock it
 *    from the Stress tester). Until 6.20.2 the last step told everyone, a saver included, to "set up the monthly
 *    Decision Tool" — and recording a Decision month locks the plan. Only a plan the app cannot place (no age today)
 *    keeps that step.
 *  - A plan made from a V7 answer (scenario.fromAnswer): the budget is a guide (owner's rule, 1 Oct 2026), so it is
 *    never "Start here" and never offered as the target. With no budget yet, a line beside the stage's sentence offers
 *    the walk-through as a guide.
 *
 * Pure: the caller reads the plan and its stage; nextStepAction turns a step's `action` into what its button does.
 */
export const NEXT_STEP_WORDS = Object.freeze({
  startHere: 'Start here: walk through what retirement will actually cost — about 10 minutes, with typical UK figures when you\'re unsure.',
  startHereBtn: 'Start the budget walk-through',
  applyBudgetBtn: 'Use it as the start of my income shape',
  stressText: 'Target set. Now the big question: can your pension actually pay for it? Open the Stress Tester settings, tell it what you have, and run the simulation.',
  stressBtn: 'Open Stress Tester settings',
  decisionText: 'Your target is set and the Stress Tester is ready — when the long-term picture looks right, set up the monthly Decision Tool (it tells you what to draw, from where, each month).',
  decisionBtn: 'Open the Decision Tool',
  // A plan from a V7 answer: the saver's sentence without "set the income you will want (Budget)" — the income is the
  // amount they chose; the budget is a guide beside it.
  savingFromAnswer: 'You are saving. Check you are on track for the income you chose (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.',
  guideAlone: 'Your budget is a guide: walk through what retirement costs (about 10 minutes) to see it beside the amount you chose. It changes nothing unless you choose to.',
  guideBtn: 'Open the budget walk-through'
});

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const OPEN_GUIDE = "switchToTab('budget'); setTimeout(() => openBudgetWizard(), 400); return false;";
/** The guide line beside a stage's sentence, with the walk-through as a link. */
const GUIDE_LINE = 'Your budget is a guide: <a href="#" data-on-click="' + OPEN_GUIDE + '">walk through what retirement costs</a> (about 10 minutes) to see it beside the amount you chose. It changes nothing unless you choose to.';

function stageStep(stage, fromAnswer) {
  const b = stage.banner;
  const words = fromAnswer && stage.key === 'saving' ? NEXT_STEP_WORDS.savingFromAnswer : b.text;
  return { html: esc(words), btn: b.btn, action: { kind: 'tab', tab: b.tab, ...(b.sub ? { sub: b.sub } : {}) } };
}

/**
 * @param {{ stage: object|null, budget: object, stress: object, decision: object, fromAnswer?: boolean }} plan
 *   `stage` from LifeStage.deriveStage; the Budget, Stress and Decision settings as loaded; whether the plan was made
 *   from a V7 answer
 * @returns {{ html: string, btn: string, action: object }|null}
 */
export function nextStepFor({ stage, budget, stress, decision, fromAnswer = false }) {
  if (stage && stage.locked) return stage.banner ? stageStep(stage, false) : null;
  const b = budget || {}, s = stress || {}, d = decision || {};
  const budgetDone = (b.lines || []).some((l) => +l.annual > 0);
  if (!fromAnswer) {
    if (!budgetDone) return { html: esc(NEXT_STEP_WORDS.startHere), btn: NEXT_STEP_WORDS.startHereBtn, action: { kind: 'budget-wizard' } };
    if (!((s.baseSalary || 0) > 0)) {
      const m = b.derived && b.derived.allInComfortableMonthly;
      return {
        html: esc('Your budget adds up' + (m ? ' to about ' + gbp(m) + '/mo take-home' : '') + '. That is today\'s spending — use it as the first step of your income shape, then draw the later years and see if the pension can pay for them.'),
        btn: NEXT_STEP_WORDS.applyBudgetBtn, action: { kind: 'apply-budget' }
      };
    }
  }
  let step = null;
  if (!s.configured) step = { html: esc(NEXT_STEP_WORDS.stressText), btn: NEXT_STEP_WORDS.stressBtn, action: { kind: 'stress-settings' } };
  else if (stage && stage.banner) step = stageStep(stage, fromAnswer);
  else if (!d.configured) step = { html: esc(NEXT_STEP_WORDS.decisionText), btn: NEXT_STEP_WORDS.decisionBtn, action: { kind: 'tab', tab: 'decision' } };
  if (fromAnswer && !budgetDone) {
    if (!step) return { html: esc(NEXT_STEP_WORDS.guideAlone), btn: NEXT_STEP_WORDS.guideBtn, action: { kind: 'budget-wizard' } };
    step = { ...step, html: step.html + ' ' + GUIDE_LINE };
  }
  return step;
}

/** What a step's button does, on the page `win` (the planner's own globals: switchToTab, openBudgetWizard, …). */
export function nextStepAction(action, win) {
  const a = action || {};
  const later = (fn) => setTimeout(fn, 400);
  if (a.kind === 'budget-wizard') return () => { win.switchToTab('budget'); later(() => win.openBudgetWizard()); };
  if (a.kind === 'apply-budget') return async () => { await win.applyBudgetToPlan(); win.updateNextStepBanner(); };
  if (a.kind === 'stress-settings') return () => { win.switchToTab('stress'); later(() => win.document.querySelector('.sub-tab[data-stresstab="stresssettings"]')?.click()); win.scrollTo({ top: 0 }); };
  if (a.kind === 'tab') return () => { win.switchToTab(a.tab); if (a.sub) later(() => win.document.querySelector('.sub-tab[data-decisiontab="' + a.sub + '"]')?.click()); };
  return () => {};
}
