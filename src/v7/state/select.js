/**
 * Pure readers of the state (V7 build brief 4.5; step 4 brief 4.11). Screens may call these; they do no money arithmetic.
 *
 *   parsedDraft(state, q)   → parseDraft(schema, state.draft[q].values, state.env)
 *   currentKey(state, q)    → the key of what is typed now, or null when it does not parse
 *   isCurrent(state, q)     → the stored answer was worked out from what is typed now
 *   errorsToShow(state, q)  → { [path]: messageId } for fields that have been left, or all once asked — except the
 *                              fields that came onto the form after the ask, until they are left too
 *   appliedPaths(state, q)  → the paths of the fields that apply to what is typed now
 *   stepStates(state, q)    → [ { id, state: 'current' | 'done' | 'open' } ] for the rail
 *   needsRun(state, q)      → the runner should work out an answer (rules 1 and 2 of brief 4.10; step 4 4.11)
 *   wantedDetail(state, q)  → the detail the runner should ask for (A and B; null for C)
 *   isRetired(state, q)     → the draft of A or B describes someone who has stopped: the retired view
 *   readyMark(state)        → { ready: '1' | '0', answer: 'none' | 'first' | 'final' | 'partial' } for #app (brief 4.9, 4.13)
 *
 * The budget step and "Save this as a plan" (research/v7/budget-step.md; save-as-plan.md Contract C.2, C.5):
 *   figureInUse(state, q)   → the one figure A's or B's answer uses, £ a month (the amount typed, or the level's
 *                              figure), or null. Read from the draft only — never from the budget.
 *   budgetOf(state, q)      → the household's budget sheet, checked (src/answers/keep/budgetSheet.js)
 *   budgetView(state, q)    → what the sheet draws: the rows by heading, the one-off costs, the totals, the guide levels
 *   spendView(state, q)     → the spend step and the answer's spending line: how it is being chosen, the skip note, the
 *                              figure in use against the budget's total ("your budget now adds up to …")
 *   skipNoteDue(state, q)   → the "you are skipping the budget" note is due (shown once)
 *   spendDone(state, q)     → the spend step has what it needs
 *   budgetAgainstC(state)   → C's line "your budget adds up to … this gives £X a month less", or null
 *   keepView(state, q)      → the "Save this as a plan" panel: whether the answer can be saved, why not, the name
 */
import { SCHEMA_C } from '../../answers/c/schema.js';
import { SCHEMA_A } from '../../answers/a/schema.js';
import { SCHEMA_B } from '../../answers/b/schema.js';
import { parseDraft, fieldsThatApply, nest } from '../../answers/shared/validate.js';
import { alreadyStopped } from '../../answers/shared/schemaParts.js';
import { inputsKey } from './inputsKey.js';
import { BUILT } from '../rail/questions.js';
import { emptyKeep } from './initial.js';
import { spendLevelAMonth } from '../../answers/shared/schemaParts.js';
import { HEADINGS, checkSheet, hasBudget, guideLevels, whereAgainstLevels, figureAgainstBudget, carefulAgainstBudget, nextLineId, nextOneOffId } from '../../answers/keep/budgetSheet.js';
import { keepable } from '../../answers/keep/planSeed.js';
import { suggestedPlanName, checkPlanName } from '../../answers/shared/planName.js';

/** The input list of each question. A question's draft is in the state only while it is open (rail/questions.js OPEN). */
export const SCHEMAS = { c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B };

/**
 * The detail each step of A and B shows (conflict 43). The answer step is worked out at its default detail by C's two
 * passes; an optional step that needs more asks for one more pass (answer/extend). C has no details.
 */
export const STEP_DETAIL = Object.freeze({ a: Object.freeze({ answer: 'chart', ages: 'all' }), b: Object.freeze({ answer: 'answer', choices: 'grid' }) });
/** The details in order, least first: a result at a later detail holds everything an earlier one does. */
export const DETAIL_ORDER = Object.freeze({ a: Object.freeze(['chart', 'all']), b: Object.freeze(['answer', 'grid']) });

const rankOf = (q, detail) => (DETAIL_ORDER[q] ? DETAIL_ORDER[q].indexOf(detail) : -1);

const NOTHING = Object.freeze({ ok: false, inputs: null, errors: {}, usedDefault: [], values: {} });

// parseDraft is asked for many times per draw with the same values object (the reducer never changes one in
// place), so the last reading for each is remembered. Same input → same output; nothing outside can tell.
const remembered = new WeakMap();

export function parsedDraft(state, q) {
  const schema = SCHEMAS[q];
  const draft = state && state.draft && state.draft[q];
  if (!schema || !draft || !draft.values) return NOTHING;
  const hit = remembered.get(draft.values);
  if (hit && hit.today === state.env.today) return hit.parsed;
  const parsed = parseDraft(schema, draft.values, state.env);
  remembered.set(draft.values, { today: state.env.today, parsed });
  return parsed;
}

export function currentKey(state, q) {
  const parsed = parsedDraft(state, q);
  return parsed.ok ? inputsKey(parsed.inputs, state.env) : null;
}

export function isCurrent(state, q) {
  const answer = state.answers[q];
  if (!answer || answer.inputsKey === null) return false;
  return answer.inputsKey === currentKey(state, q);
}

/**
 * The errors a person should see: for the fields they have left; once "Show what it pays" has been pressed, for
 * every field that was on the form then. A field that came onto the form afterwards (a partner's age, opened after
 * a first answer) is not marked until it has been left or the button is pressed again — nothing goes red before
 * anyone has had a chance to type in it.
 */
export function errorsToShow(state, q) {
  const draft = state.draft[q];
  if (!draft) return {};
  const { errors } = parsedDraft(state, q);
  const touched = draft.touched || [];
  const revealed = draft.revealed || [];
  const out = {};
  for (const path of Object.keys(errors)) {
    if (touched.includes(path) || (draft.asked && !revealed.includes(path))) out[path] = errors[path];
  }
  return out;
}

/** The paths of the fields that apply to what is typed (defaults by rule included), for the reducer's `revealed`. */
export function appliedPaths(state, q) {
  const schema = SCHEMAS[q];
  if (!schema) return [];
  return fieldsThatApply(schema, parsedDraft(state, q).values).map((f) => f.path);
}

const onStep = (state, q, step) => state.route.screen === 'step' && state.route.q === q && state.route.step === step;

/**
 * The state of each step of a question. Exactly one is 'current' when the route is a step of that question.
 * 'done' = has what it needs: the numbers step when the draft parses; the answer step when a final answer for
 * what is typed now is held. Steps that are not built are never done.
 */
export function stepStates(state, q) {
  const question = BUILT[q];
  if (!question) return [];
  const answer = state.answers[q];
  return question.steps.map((step) => {
    if (onStep(state, q, step.id)) return { id: step.id, state: 'current' };
    let done = false;
    if (step.id === 'numbers') done = SPEND_STEP[q] ? numbersDone(state, q) : parsedDraft(state, q).ok;
    else if (step.id === 'spend') done = spendDone(state, q);
    else if (step.id === 'keep') done = !!(state.keep && state.keep[q] && state.keep[q].back === 'taken');
    else if (step.id === 'answer') done = !!answer && answer.status === 'final' && isCurrent(state, q);
    else if (step.built && STEP_DETAIL[q] && STEP_DETAIL[q][step.id]) {
      // An optional step of A or B: done once a final answer for what is typed holds the step's detail.
      done = !!answer && answer.status === 'final' && !answer.extending && isCurrent(state, q) &&
        rankOf(q, answer.detail) >= rankOf(q, STEP_DETAIL[q][step.id]);
    }
    return { id: step.id, state: done ? 'done' : 'open' };
  });
}

/** The step of question q on screen that asks for more detail than the answer step (A's ages, B's choices), or null. */
function optionalStepDetail(state, q) {
  const r = state.route;
  const table = STEP_DETAIL[q];
  if (!table || r.screen !== 'step' || r.q !== q || r.step === 'answer') return null;
  const step = BUILT[q] && BUILT[q].steps.find((s) => s.id === r.step);
  return step && step.built && table[r.step] ? table[r.step] : null;
}

/** A final answer for what is typed now, at a lower detail than the optional step on screen asks for, not being extended. */
function wantsMore(state, q, key) {
  const want = optionalStepDetail(state, q);
  const answer = state.answers[q];
  return !!want && !!answer && answer.inputsKey === key && answer.status === 'final' && !answer.extending &&
    rankOf(q, answer.detail) < rankOf(q, want);
}

/**
 * True when an answer should be worked out now:
 *  - the answer step (as C): the draft parses and the answer held is not for these inputs. A failed run for the same
 *    inputs is not run again until 'answer/retry' clears its key;
 *  - an optional step of A or B (ages, choices): the same — the answer step's passes first — and then, once a final
 *    answer for these inputs is held at a lower detail than the step shows and is not being extended, one more pass;
 *  - never on the retired view of A or B, which shows no answer.
 */
export function needsRun(state, q) {
  const onOptional = !!optionalStepDetail(state, q);
  if (!onStep(state, q, 'answer') && !onOptional) return false;
  const key = currentKey(state, q);
  if (key === null) return false;
  if (isRetired(state, q)) return false;
  const answer = state.answers[q];
  if (!(answer.inputsKey === key && ['working', 'first', 'final', 'failed'].includes(answer.status))) return true;
  return onOptional && wantsMore(state, q, key);
}

/**
 * The detail the runner should ask for now (A and B): the optional step's own once a final answer for what is typed is
 * held at a lower detail; otherwise the answer step's default. null for a question without details (C), whose env
 * carries none.
 */
export function wantedDetail(state, q) {
  const table = STEP_DETAIL[q];
  if (!table) return null;
  return wantsMore(state, q, currentKey(state, q)) ? optionalStepDetail(state, q) : table.answer;
}

/**
 * The retired view (step 4 brief 4.11, conflict 44): the draft of A or B says the person has stopped — the stop age at
 * or before today's age — and is at or past their State Pension age (alreadyStopped). Read from every figure that
 * parsed, so that B, whose own rule refuses a stop at today's age, still recognises a draft carried in from C.
 * Never for C, and never for "show me ages" (no stop age).
 */
export function isRetired(state, q) {
  if (q !== 'a' && q !== 'b') return false;
  const parsed = parsedDraft(state, q);
  const inputs = parsed.ok ? parsed.inputs : nest(parsed.values || {});
  return alreadyStopped(inputs, state.env.today);
}

/**
 * What #app carries for tests: ready is '1' only when no run is under way or about to start and everything shown is
 * final; answer says which figure is on screen — 'partial' while an optional step's extra pass is due or running
 * (the headline is final, the rest is arriving).
 */
export function readyMark(state) {
  let busy = false;
  let shown = 'none';
  let partial = false;
  for (const q of Object.keys(state.answers)) {
    const answer = state.answers[q];
    const { status } = answer;
    const due = needsRun(state, q);
    if (status === 'working' || status === 'first' || due || answer.extending) busy = true;
    if (answer.extending || (due && status === 'final' && isCurrent(state, q))) partial = true;
    if (status === 'first' || status === 'final') shown = status;
  }
  return { ready: busy ? '0' : '1', answer: partial ? 'partial' : shown };
}

// ---- the budget step (research/v7/budget-step.md) --------------------------------------------------------------------

/** The questions with a spend step, and the fields it holds (the "What you would spend" box). */
export const SPEND_STEP = Object.freeze({ a: true, b: true });
export const SPEND_PATHS = Object.freeze(['spend.kind', 'spend.amount', 'spend.level']);
const isSpendField = (path) => SPEND_PATHS.includes(path);

/** The paths of the fields of A's or B's numbers step that apply to what is typed: everything but the spending. */
export function numbersPaths(state, q) {
  return appliedPaths(state, q).filter((p) => !isSpendField(p) && p !== 'household');
}

/** The numbers step of A or B has what it needs: none of its own fields has a problem. */
export function numbersDone(state, q) {
  const { errors } = parsedDraft(state, q);
  return Object.keys(errors).every((p) => isSpendField(p));
}

const householdOf = (state, q) => (parsedDraft(state, q).values.household === 'couple' ? 'couple' : 'single');
const levelOf = (state, q) => {
  const v = parsedDraft(state, q).values;
  return v['spend.kind'] === 'level' && typeof v['spend.level'] === 'string' ? v['spend.level'] : 'moderate';
};

/**
 * The one figure the answer uses, £ a month: the amount typed when it can be read, or the level's monthly figure (the
 * figure the answer tests). Read from the draft only. null when there is none yet.
 */
export function figureInUse(state, q) {
  if (!SPEND_STEP[q] || !state.draft[q]) return null;
  const v = parsedDraft(state, q).values;
  if (v['spend.kind'] === 'level') return typeof v['spend.level'] === 'string' ? spendLevelAMonth(householdOf(state, q), v['spend.level']) : null;
  return typeof v['spend.amount'] === 'number' ? v['spend.amount'] : null;
}

/** The spend step has what it needs: no problem with the spending, and a figure to use. */
export function spendDone(state, q) {
  if (!SPEND_STEP[q] || !state.draft[q]) return false;
  const { errors } = parsedDraft(state, q);
  return !SPEND_PATHS.some((p) => errors[p]) && figureInUse(state, q) !== null;
}

// The sheet is checked many times per draw with the same objects (the reducer never changes one in place).
const sheets = new WeakMap();
const NO_SHEET = {};

/** The household's budget sheet, checked for question q's household (a couple's budget is the household's). */
export function budgetOf(state, q) {
  const household = householdOf(state, q);
  const level = levelOf(state, q);
  const at = state.budget || NO_SHEET;
  const key = `${household}|${level}|${state.env.today}`;
  const hit = sheets.get(at);
  if (hit && hit.key === key) return hit.checked;
  const checked = checkSheet(state.budget || null, { household, level, today: state.env.today });
  sheets.set(at, { key, checked });
  return checked;
}

/** What the sheet draws. A problem is shown once its box has been left (as the form's errors are). */
export function budgetView(state, q) {
  const checked = budgetOf(state, q);
  const touched = (state.budget && state.budget.touched) || [];
  const shown = (id, field, problem) => (problem && touched.includes(`${id}.${field}`) ? problem : null);
  return {
    exists: !!state.budget,
    household: checked.household,
    level: checked.plsaTier,
    headings: HEADINGS.map((id) => ({
      id,
      monthly: checked.headings[id].monthly,
      // the typical amount in the line's own period: a yearly line's hint a year (BudgetModel's figures are a month)
      rows: checked.rows.filter((r) => r.heading === id).map((r) => ({ ...r, problem: shown(r.id, 'amount', r.problem), labelProblem: shown(r.id, 'label', r.labelProblem),
        hintAmount: r.hint === null ? null : r.period === 'yr' ? r.hint * 12 : r.hint, hintPeriod: r.period }))
    })),
    oneOffs: checked.oneOffRows.map((o) => ({ ...o, problems: Object.fromEntries(Object.entries(o.problems).map(([f, p]) => [f, shown(o.id, f, p)])) })),
    totals: checked.totals,
    has: hasBudget(checked),
    levels: guideLevels(checked.household),
    where: whereAgainstLevels(checked.totals.monthly, checked.household)
  };
}

/** The id the next line (or one-off cost) added to the sheet gets — so the screen can put the keyboard in it. */
export const newLineId = (state) => nextLineId(state.budget);
export const newOneOffId = (state) => nextOneOffId(state.budget);

/** The "you are skipping the budget" note: once, while the spending is a figure of their own with no budget behind it. */
export function skipNoteDue(state, q) {
  const d = state.draft[q];
  if (!SPEND_STEP[q] || !d || d.skipNoted === true || d.spendHow === 'lines') return false;
  if (hasBudget(budgetOf(state, q))) return false;
  return d.spendHow === 'one' || figureInUse(state, q) !== null;
}

/** spend.amount's own limits: a total outside them cannot be copied into the box as it stands. */
const SPEND_MAX = 50_000;

/**
 * The spend step and the answer's spending line. `budget` is null with no budget; else its total to the pound, and
 * whether it differs from the figure in use. Nothing here changes the figure: "Use £X" is an action.
 */
export function spendView(state, q) {
  const d = state.draft[q] || {};
  const checked = budgetOf(state, q);
  const figure = figureInUse(state, q);
  const kind = parsedDraft(state, q).values['spend.kind'] === 'level' ? 'level' : 'amount';
  const has = hasBudget(checked);
  const against = has ? figureAgainstBudget(checked.totals.monthly, figure) : null;
  return {
    how: d.spendHow === 'lines' || d.spendHow === 'one' ? d.spendHow : null,
    skipNote: skipNoteDue(state, q),
    figure,
    kind,
    level: kind === 'level' ? levelOf(state, q) : null,
    budget: against ? { total: against.total, essential: checked.totals.essentialMonthly, differs: against.differs || figure === null } : null,
    canUse: !!against && against.total >= 1 && against.total <= SPEND_MAX && (against.differs || figure === null || kind === 'level')
  };
}

/** C's line when a budget exists: what the careful amount gives against the budget's total. null otherwise. */
export function budgetAgainstC(state) {
  const answer = state.answers.c;
  const r = answer && answer.result;
  if (!r || r.status !== 'ok' || r.closedYears || !r.monthly || typeof r.monthly.careful !== 'number') return null;
  // the budget is the household's, written on A's or B's spend step; C reads the household from its own draft
  const checked = budgetOf(state, 'c');
  if (!hasBudget(checked)) return null;
  return carefulAgainstBudget(r.monthly.careful, checked.totals.monthly);
}

// ---- "Save this as a plan" (save-as-plan.md Contract C.2) ------------------------------------------------------------

/**
 * Why an answer cannot be saved yet, or null when it can: no answer; not for what is typed now ("Updating"); a first
 * figure; the retired view; or the answer itself (keepable: not status ok, C held down by a closed pension).
 */
function keepBlock(state, q) {
  const answer = state.answers[q];
  const r = answer && answer.result;
  if (isRetired(state, q)) return 'retired';
  if (!r || !['working', 'first', 'final'].includes(answer.status)) return 'noAnswer';
  if (answer.status === 'working' || !isCurrent(state, q)) return 'notCurrent';
  if (answer.status !== 'final') return 'notFinal';
  const k = keepable(q, r);
  return k.ok ? null : k.why;
}

/** The panel: { can, why, suggested, name (the box), check, problem, saving, sent, back }. */
export function keepView(state, q) {
  const keep = (state.keep && state.keep[q]) || emptyKeep();
  const why = keepBlock(state, q);
  const r = state.answers[q] && state.answers[q].result;
  const suggested = why === null ? suggestedPlanName(q, r.inputs, r) : '';
  const name = typeof keep.name === 'string' ? keep.name : suggested;
  return { can: why === null, why, suggested, name, check: checkPlanName(name), problem: keep.problem || null, saving: keep.saving === true,
    sent: keep.sent || null, back: keep.back || null };
}
