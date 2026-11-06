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
 *  - A plan made from a V7 answer (scenario.fromAnswer): the budget is a guide (our rule, 1 Oct 2026), so it is
 *    never "Start here" and never offered as the target. With no budget yet, a line beside the stage's sentence offers
 *    the walk-through as a guide.
 *
 * Pure: the caller reads the plan and its stage; nextStepAction turns a step's `action` into what its button does.
 */
import { monthWordsOf } from './PlanClosed.js';

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
  savingFromAnswer: 'You are saving. Check you are on course for the income you chose (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.',
  guideAlone: 'Your budget is a guide: walk through what retirement costs (about 10 minutes) to see it beside the amount you chose. It changes nothing unless you choose to.',
  guideBtn: 'Open the budget walk-through',
  // A closed plan whose successor is not here (deleted since, 6.56.0): kept to read, its months the way on.
  closedAlone: 'This plan is closed: it ran to the end of {closed}. Its months stay here to read.',
  closedAloneBtn: 'See its months',
  // A locked plan stored with its start later than it should be (7.3.3): the V7 home's to-do, word for word
  startMove: 'Your plan is set to start in {start}, but you stopped work in {stopped}. Start it from the tax year you stopped.',
  startMoveBtn: 'Move the start',
  startAsk: 'Your plan is set to start in {start}. When did you stop work? If you are already drawing, it can start this tax year instead.',
  startAskBtn: 'Say when',
  /** The same, on a plan whose start this tax year cannot replace (it is already this tax year or earlier). */
  startAskOnly: 'Your plan is set to start in {start}. When did you stop work?',
  // the move cannot keep the State Pension's tax year under the lock (PlanMove.moveBlockedOf): said as it is, and the button
  // opens the line that explains why, never a move it would refuse
  startBlocked: 'Your plan is set to start in {start}, but you stopped work in {stopped}. Its start can be moved only once the plan is unlocked.',
  startBlockedBtn: 'See why',
  // a draft still set to start later than this tax year (7.4.0, PlanMove.laterDraftLeftOf): the V7 home's to-do, the start
  // chosen in the Timing block
  startDraft: 'Your plan is set to start in {start}. It can start this tax year, or the tax year you stopped work: choose it under Timing.',
  startDraftBtn: 'Choose the start'
});

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const OPEN_GUIDE = "switchToTab('budget'); setTimeout(() => openBudgetWizard(), 400); return false;";
/** The guide line beside a stage's sentence, with the walk-through as a link. */
const GUIDE_LINE = 'Your budget is a guide: <a href="#" data-on-click="' + OPEN_GUIDE + '">walk through what retirement costs</a> (about 10 minutes) to see it beside the amount you chose. It changes nothing unless you choose to.';

function stageStep(stage, fromAnswer, successorName = null) {
  const b = stage.banner;
  const words = fromAnswer && stage.key === 'saving' ? NEXT_STEP_WORDS.savingFromAnswer : b.text;
  // a closed plan's button opens the plan that carries it on (PlanClosed.js), by its name — only when that plan is there
  // (the page found its name): one deleted since leaves the closed plan to read, with its months the way on
  if (stage.key === 'closed') {
    if (stage.nextPlanId && successorName) return { html: esc(words.replace('carries on in a new plan', 'carries on in ‘' + successorName + '’')), btn: 'Open ‘' + successorName + '’', action: { kind: 'plan', planId: stage.nextPlanId } };
    return { html: esc(NEXT_STEP_WORDS.closedAlone.replace('{closed}', monthWordsOf(stage.closedAt))), btn: NEXT_STEP_WORDS.closedAloneBtn, action: { kind: 'tab', tab: 'decision', sub: 'history' } };
  }
  return { html: esc(words), btn: b.btn, action: { kind: 'tab', tab: b.tab, ...(b.sub ? { sub: b.sub } : {}) } };
}

/**
 * A locked plan stored with its start later than it should be (PlanMove.startLaterOf; until 6.51.0 a retired person's plan
 * started at the next April): the one thing to do, the same to-do as the V7 plan home — move the start to the tax year work
 * stopped, or say when that was first. The button opens the line under the Timing block that asks and moves (lockedStartUi).
 */
function startLaterStep(sl) {
  const start = 'April ' + sl.start;
  if (sl.kind === 'move' && sl.blocked) return { html: esc(NEXT_STEP_WORDS.startBlocked.replace('{start}', start).replace('{stopped}', monthWordsOf(sl.stopMonth))), btn: NEXT_STEP_WORDS.startBlockedBtn, action: { kind: 'start-later' } };
  if (sl.kind === 'move') return { html: esc(NEXT_STEP_WORDS.startMove.replace('{start}', start).replace('{stopped}', monthWordsOf(sl.stopMonth))), btn: NEXT_STEP_WORDS.startMoveBtn, action: { kind: 'start-later' } };
  return { html: esc((sl.thisYear ? NEXT_STEP_WORDS.startAsk : NEXT_STEP_WORDS.startAskOnly).replace('{start}', start)), btn: NEXT_STEP_WORDS.startAskBtn, action: { kind: 'start-later' } };
}

/**
 * @param {{ stage: object|null, budget: object, stress: object, decision: object, fromAnswer?: boolean, successorName?: string|null, startLater?: object|null, startDraft?: object|null }} plan
 *   `stage` from LifeStage.deriveStage; the Budget, Stress and Decision settings as loaded; whether the plan was made
 *   from a V7 answer; for a closed plan, the name of the plan that carries it on (when the page has it); `startLater`, a
 *   locked plan stored with its start later than it should be (PlanMove.startLaterOf), whose one thing to do is the move;
 *   `startDraft`, a draft still set to start later than this tax year (PlanMove.laterDraftLeftOf): its start is chosen first
 * @returns {{ html: string, btn: string, action: object }|null}
 */
export function nextStepFor({ stage, budget, stress, decision, fromAnswer = false, successorName = null, startLater = null, startDraft = null }) {
  if (stage && stage.locked && startLater) return startLaterStep(startLater);
  if (startDraft && !(stage && (stage.locked || stage.key === 'closed'))) return { html: esc(NEXT_STEP_WORDS.startDraft.replace('{start}', 'April ' + startDraft.start)), btn: NEXT_STEP_WORDS.startDraftBtn, action: { kind: 'stress-settings' } };
  if (stage && (stage.locked || stage.key === 'closed')) return stage.banner ? stageStep(stage, false, successorName) : null;
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
  // another plan (a closed plan's successor): the planner's own way to open a plan (src/ui/planCloseUi.js openPlanById)
  if (a.kind === 'plan') return () => win.openPlanById(a.planId);
  // the move of a plan's start: the Stress tester's settings, at the line under the Timing block that asks and moves
  if (a.kind === 'start-later') return () => { win.switchToTab('stress'); later(() => win.document.querySelector('.sub-tab[data-stresstab="stresssettings"]')?.click()); setTimeout(() => win.document.getElementById('tmLockedStart')?.scrollIntoView({ block: 'center' }), 900); };
  return () => {};
}
