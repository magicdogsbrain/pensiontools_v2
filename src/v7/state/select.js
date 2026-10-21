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
 *   retiredBoth(state, q)   → that retired view is for a couple who have both stopped (couples-different-years.md 2.2)
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
 *   keepView(state, q)      → the "Keep this as a plan" panel: whether the answer can be kept, why not, the name, the plan made
 *   lockedPlanInAccount(state) → a locked plan is among the plans read (D keeps a separate plan then), or null until read
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 2, 3.1), from what each field shows
 * (flat values: the text typed, else the checked value, else the plain default — formView's `shown`):
 *   offeredOptions(q, field, values) → the options a choice offers on screen: only those that fit, and whatever is chosen
 *   choiceAsked(q, field, values, checked)  → false for a choice whose one fitting option is what not answering it means,
 *                                      and for "How your savings grow" while there is no money in savings (6.22.0)
 *   stopsApart(values)               → the partner's stop is their own ("They already have", an age, "show me ages")
 *   askedAboutValues(values)         → who A's and B's answer is about: 'you', or 'partner' after "I've already stopped"
 *   askedAboutOf(state, q)           → the same, from what is typed in question q
 *   payLineOf(state, q, values)      → the pay line: null when it does not apply, else { open, covers }
 *   fieldApplies(field, values)      → validate.js's one rule (a `when` list is "one of"; `whenNot` hides), for the
 *                                      components, which read rules only through this file
 */
import { SCHEMA_C } from '../../answers/c/schema.js';
import { SCHEMA_A } from '../../answers/a/schema.js';
import { SCHEMA_B } from '../../answers/b/schema.js';
import { SCHEMA_D } from '../../answers/d/schema.js';
import { parseDraft, fieldsThatApply, nest, applies } from '../../answers/shared/validate.js';
import { alreadyStopped, askedAbout, payCoversOf, savingsGrowthAsked } from '../../answers/shared/schemaParts.js';
import { inputsKey } from './inputsKey.js';
import { BUILT } from '../rail/questions.js';
import { emptyKeep } from './initial.js';
import { spendLevelAMonth } from '../../answers/shared/schemaParts.js';
import { HEADINGS, checkSheet, hasBudget, guideLevels, whereAgainstLevels, figureAgainstBudget, carefulAgainstBudget, nextLineId, nextOneOffId } from '../../answers/keep/budgetSheet.js';
import { keepable } from '../../answers/keep/planSeed.js';
import { suggestedPlanName, checkPlanName } from '../../answers/shared/planName.js';
import { hasShape, SHAPE_BASE, SHAPE_UNIT, thenPath, fallsPath, stepsPath, stepBox, stepsOf, typedShape, isShapePath } from './shapeDraft.js';
/** The spending shape's draft readers, for the components (which read the state only through this file). */
export { typedShape, isShapePath, stepsOf as shapeStepsOf } from './shapeDraft.js';
import { yearFigures, shownShare } from './shapeModel.js';
import { money } from '../../answers/shared/format.js';

/**
 * Whether C's answer says you have stopped and your partner stops later (state/carry.js): the reading C's "What next?" draws
 * its words from, the same one the carry picks its map with, so the two cannot disagree.
 */
export { cAnswerYouStopped } from './carry.js';

/** The input list of each question. A question's draft is in the state only while it is open (rail/questions.js OPEN). */
export const SCHEMAS = { c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B, d: SCHEMA_D };

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
    else if (step.id === 'keep') done = !!(state.keep && state.keep[q] && state.keep[q].made);
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
 * The retired view for a couple who have both stopped (couples-different-years.md 2.2): "I've already stopped" and "They
 * already have". It points to "What is that a month?" rather than to "Will it last?".
 */
export function retiredBoth(state, q) {
  if (!isRetired(state, q)) return false;
  const v = parsedDraft(state, q).values;
  return v.household === 'couple' && v['stop.kind'] === 'already' && v['partner.stop.kind'] === 'already';
}

// ---- couples who stop work in different years (research/v7/couples-different-years.md 2, 3.1) -------------------------

/** Whether a field applies — validate.js's one rule, handed to the components (couples-different-years.md 3.2). */
export const fieldApplies = applies;

/** What not answering a choice with no default means: the stop in mind is an age; the partner stops when you do. */
const NOT_ANSWERED = Object.freeze({ 'stop.kind': 'age', 'partner.stop.kind': 'same' });
const SAVERS = ['a', 'b'];
const blankValue = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

/**
 * The options a choice offers on screen (couples-different-years.md 3.1), in the input list's order:
 *  - A's and B's stop question offers "I've already stopped" to a couple only (2.2);
 *  - "When does your partner stop work?" offers, while you are still working, "when you do", "they already have" and an
 *    age; once you have stopped (A and B), an age — and "show me ages" in A;
 *  - every other choice, all its options; a yes/no, both.
 * Whatever is chosen is always offered, so the form never hides what it holds (its sentence says what is wrong with it).
 */
export function offeredOptions(q, field, values) {
  if (!field) return [];
  if (field.type === 'yesNo') return ['no', 'yes'];
  const v = values || {};
  const options = field.options || [];
  const saver = SAVERS.includes(q);
  let fit = options;
  if (field.path === 'stop.kind' && saver && v.household !== 'couple') fit = options.filter((o) => o !== 'already');
  else if (field.path === 'partner.stop.kind') {
    fit = saver && v['stop.kind'] === 'already' ? options.filter((o) => o === 'age' || o === 'ages') : options.filter((o) => o !== 'ages');
  }
  return options.filter((o) => fit.includes(o) || o === v[field.path]);
}

/**
 * Whether a choice is asked at all: not when the one option it offers is what not answering it means and nothing is
 * chosen — B's stop for one person, where only an age fits, so the age box stands on its own as it always has. "How your
 * savings grow" (6.22.0) is asked only once there is money in savings (schemaParts.js savingsGrowthAsked, read from
 * `checked`: the values as checked, numbers — a box as typed is text), as its default is given only then.
 */
export function choiceAsked(q, field, values, checked = values) {
  if (!field || field.type !== 'choice') return true;
  if (field.path === 'isaGrowth') return savingsGrowthAsked(checked);
  const offered = offeredOptions(q, field, values);
  return !(offered.length === 1 && offered[0] === NOT_ANSWERED[field.path] && blankValue((values || {})[field.path]));
}

/** The partner's stop is their own: a couple, and "When does your partner stop work?" answered other than "when you do". */
export function stopsApart(values) {
  const v = values || {};
  return v.household === 'couple' && ['already', 'age', 'ages'].includes(v['partner.stop.kind']);
}

/** Who A's and B's answer is about, from flat values (schemaParts.js askedAbout: the one rule, the owner's switch 3). */
export function askedAboutValues(values) {
  const inputs = nest(values || {});
  return askedAbout({ ...inputs, partner: inputs.partner || {} });
}

/**
 * Whether A's answer about your partner ("I've already stopped") shows them stopping now: the stop age shown is their age
 * today. A answers that ("could my partner stop now instead?"), but B — about saving — refuses it (partner-stop-after-now),
 * so A does not offer B then (the reviewers' finding, 2 Oct 2026). Read from the answer; nothing worked out.
 */
export function partnerStopsNow(result) {
  if (!result || result.askedAbout !== 'partner' || !result.shown || !result.inputs || !result.inputs.partner) return false;
  return typeof result.inputs.partner.age === 'number' && result.shown.age === result.inputs.partner.age;
}

/** Who A's and B's answer is about, from what is typed in question q ('you' for C, which has no "I've already stopped"). */
export function askedAboutOf(state, q) {
  if (!SAVERS.includes(q) || !state.draft[q]) return 'you';
  return askedAboutValues({ ...state.draft[q].values, ...parsedDraft(state, q).values });
}

/**
 * The pay line (couples-different-years.md 2.1): null when it does not apply (one person, or the partner stops when you
 * do); else `open` — its three settings are drawn once answered, or once "Change" has put ?focus=untilBothStop in the
 * address — and `covers`, the setting the line describes: the answer, or what not answering means (the owner's switch,
 * household.js APART.payCoversDefault, read through schemaParts.js payCoversOf: the option whose share is the default's).
 */
export function payLineOf(state, q, values) {
  const schema = SCHEMAS[q];
  const field = schema && schema.fields.find((f) => f.path === 'untilBothStop');
  if (!field || !applies(field, values || {})) return null;
  const given = state.draft[q] && state.draft[q].values.untilBothStop;
  const open = !blankValue(given) || (state.route.q === q && state.route.focus === 'untilBothStop');
  const answer = (values || {}).untilBothStop;
  const covers = field.options.includes(answer) ? answer : field.options.find((o) => payCoversOf(o) === payCoversOf(undefined));
  return { open, covers };
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
  // "Does it last?" (editing-in-v7.md 10.4): a run under way, or one due for the plan on the step, is not ready
  const L = state.lasts;
  if (L && L.status === 'working') busy = true;
  const r = state.route;
  if (r && r.screen === 'plan' && r.step === 'lasts') {
    const page = state.plans && state.plans.view && state.plans.view.page;
    const key = page && page.forId === r.planId && page.lasts && page.lasts.runKey ? page.lasts.runKey : null;
    if (key && !(L && L.key === key && (L.status === 'done' || L.status === 'failed'))) busy = true;
  }
  // "How the money is taken" (way-and-mix.md 2.2): the nine-way run, or one way being tried, is not ready
  const W = state.ways;
  if (W && (W.status === 'working' || Object.values(W.tried || {}).some((t) => t && t.status === 'working'))) busy = true;
  if (r && r.screen === 'plan' && r.step === 'way') {
    const page = state.plans && state.plans.view && state.plans.view.page;
    const key = page && page.forId === r.planId && page.way && page.way.runKey ? page.way.runKey : null;
    if (key && !(W && W.key === key && (W.status === 'done' || W.status === 'failed'))) busy = true;
    if (key && page.way.cards && page.way.cards.some((c) => c.needsRun)) busy = true;
  }
  // "The mix" (way-and-mix.md 3.2): a try or the comparison under way is not ready; Try a change (4): a try under way too
  const M = state.mix;
  if (M && (M.compare.status === 'working' || Object.values(M.tries || {}).some((t) => t && t.status === 'working'))) busy = true;
  if (L && L.tried && L.tried.status === 'working') busy = true;
  return { ready: busy ? '0' : '1', answer: partial ? 'partial' : shown };
}

// ---- the budget step (research/v7/budget-step.md) --------------------------------------------------------------------

/**
 * The questions with a spend step, and the fields it holds (the "What you would spend" box). The spending shape's fields
 * (spend.then, spend.fallsPct, spend.steps and each step's boxes) are on the spend step too: isSpendPath says so.
 */
export const SPEND_STEP = Object.freeze({ a: true, b: true });
export const SPEND_PATHS = Object.freeze(['spend.kind', 'spend.amount', 'spend.level']);
/** A path of A's or B's spend step: the figure, or the spending shape (research/v7/spending-shape.md 4.1). */
export const isSpendPath = (path) => SPEND_PATHS.includes(path) || isShapePath('a', path);
const isSpendField = isSpendPath;

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
  return !Object.keys(errors).some(isSpendPath) && figureInUse(state, q) !== null;
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

/**
 * Whether a locked plan is in the account (or this window), as the plans in page memory say (null when they are not
 * read). D then keeps a "separate plan" beside the one followed, and offers no lock (answer-D.md 3.8, 10).
 */
export function lockedPlanInAccount(state) {
  const plans = state.plans;
  if (!plans || plans.status !== 'read') return null;
  return plans.list.some((e) => e && e.plan && e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked === true);
}

/**
 * D's way in (answer-D.md 3.10): the plans in page memory, each a candidate for its own test at "Does it last?" — { id,
 * name, locked } — once the plans are read (the plan source loads on D's pages); `known` false until then, or away from an
 * account. The screen links to each (href.plan(id, 'lasts')); it never redirects.
 */
export function dWayIn(state) {
  const plans = state.plans;
  if (!plans || plans.status !== 'read') return { known: false, plans: [] };
  const nameOf = (plan) => (plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (typeof plan.name === 'string' && plan.name) || '';
  const list = plans.list.filter((e) => e && e.plan && e.plan.id != null && !e.failed)
    .map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan), locked: !!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked === true) }));
  return { known: true, plans: list };
}

/** The panel: { can, why, suggested, name (the box), check, problem, saving, made, separate, partnerKept }. */
export function keepView(state, q) {
  const keep = (state.keep && state.keep[q]) || emptyKeep();
  const why = keepBlock(state, q);
  const r = state.answers[q] && state.answers[q].result;
  const suggested = why === null ? suggestedPlanName(q, r.inputs, r) : '';
  const name = typeof keep.name === 'string' ? keep.name : suggested;
  return { can: why === null, why, suggested, name, check: checkPlanName(name), problem: keep.problem || null, saving: keep.saving === true,
    made: keep.made || null, separate: q === 'd' && lockedPlanInAccount(state) === true, partnerKept: keep.partnerKept || null };
}

// ---- the spending shape (research/v7/spending-shape.md 3.6, 4.1–4.4) --------------------------------------------------

const numOrNull = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
/** A number as typed in a step's box ("2,130", "£2,130", "85%", "1.5"), or null: the text read, nothing worked out. */
export function typedNumber(t) {
  if (typeof t === 'number') return Number.isFinite(t) ? t : null;
  const s = String(t == null ? '' : t).replace(/[£,%\s]/g, '');
  return /^\d{1,12}(\.\d{1,2})?$/.test(s) ? Number(s) : null;
}
const wholeAge = (t) => {
  const n = typedNumber(t);
  return n !== null && Number.isInteger(n) ? n : null;
};

/**
 * Where question q's shape stands (spending-shape.md 3.6): your age today, a couple's gap (your age − your partner's),
 * how much older you are than the younger of you, your age when the household's money starts (the first stop in A and
 * B — yours, or your partner's when theirs is their own and comes first; "now" for anyone who has stopped; C's start)
 * and at the end of the plan, the first amount (A and B: the figure in use), and the budget's essentials and whole total a
 * month (a guide, only when a budget exists). null for a question without a shape.
 */
export function shapeContext(state, q) {
  if (!hasShape(q) || !state.draft[q]) return null;
  const v = parsedDraft(state, q).values;
  const youAge = numOrNull(v['you.age']);
  const couple = v.household === 'couple';
  const partnerAge = couple ? numOrNull(v['partner.age']) : null;
  const gap = youAge !== null && partnerAge !== null ? youAge - partnerAge : null;
  const olderBy = gap !== null && gap > 0 ? gap : 0;
  let startAge = null;
  let startKind = 'ages';
  if (q === 'c') {
    startKind = 'start';
    startAge = v['start.kind'] === 'age' ? numOrNull(v['start.age']) : youAge;
  } else {
    const kind = v['stop.kind'] || 'age';
    const yours = kind === 'age' ? numOrNull(v['stop.age']) : kind === 'already' ? youAge : null;
    const pk = couple ? v['partner.stop.kind'] : null;
    const theirStop = numOrNull(v['partner.stop.age']);
    const theirs = pk === 'already' ? youAge : pk === 'age' && youAge !== null && partnerAge !== null && theirStop !== null ? youAge + (theirStop - partnerAge) : null;
    const known = [yours, theirs].filter((x) => x !== null);
    startAge = known.length ? Math.min(...known) : null;
    if (startAge !== null) startKind = youAge !== null && startAge <= youAge ? 'now' : startAge === yours ? 'stop' : 'apart';
  }
  const end = numOrNull(v.endAge);
  const endAge = end !== null ? end + olderBy : null;
  const first = SPEND_STEP[q] ? figureInUse(state, q) : null;
  const checked = budgetOf(state, q);
  const essentials = hasBudget(checked) && checked.totals.essentialMonthly > 0 ? checked.totals.essentialMonthly : null;
  // the budget's whole total a month (a guide): each later step's share of it, as today's editor shows "% of today's budget"
  const budgetMonthly = hasBudget(checked) ? checked.totals.monthly : null;
  return { q, couple, youAge, partnerAge, gap, olderBy, startAge, startKind, endAge, first, essentials, budgetMonthly };
}

/** The model's shape from what is typed: only the steps whose age and amount can be read (a fall that cannot is 0). */
function modelShape(q, raw) {
  const unit = SHAPE_UNIT[q];
  const then = raw[thenPath(q)];
  const falls = typedNumber(raw[fallsPath(q)]);
  const steps = stepsOf(q, raw).map((s) => ({ fromAge: wholeAge(s.fromAge), [unit]: typedNumber(s[unit]), then: s.then, fallsPct: typedNumber(s.fallsPct) || 0 }))
    .filter((s) => s.fromAge !== null && s[unit] !== null && s[unit] > 0);
  return { unit, start: { then: then === 'falls' || then === 'glides' ? then : 'level', fallsPct: falls || 0 }, steps };
}

/**
 * The shape as typed, as a list a sentence reads (the words are the component's: components/shapeWords.js): the start —
 * { kind: 'start', perMonth?, share?, age, now } — then each later step that can be read, { fromAge, perMonth | share, then,
 * fallsPct }. Nothing is worked out: the figures are the ones typed.
 */
function typedList(ctx, unit, raw, q, from) {
  const then = raw[thenPath(q)];
  const falls = typedNumber(raw[fallsPath(q)]);
  const head = { fromAge: from, then: then === 'falls' || then === 'glides' ? then : 'level', ...(then === 'falls' && falls !== null ? { fallsPct: falls } : {}),
    now: ctx.startKind === 'now', ...(unit === 'share' ? { share: 100 } : ctx.first !== null ? { perMonth: ctx.first } : {}) };
  const later = stepsOf(q, raw).map((s) => ({ fromAge: wholeAge(s.fromAge), [unit]: typedNumber(s[unit]), then: s.then, fallsPct: typedNumber(s.fallsPct) }))
    .filter((s) => s.fromAge !== null && s[unit] !== null)
    .map((s) => ({ ...s, ...(s.then === 'falls' && s.fallsPct !== null ? {} : { fallsPct: undefined }) }));
  return [head, ...later];
}

/**
 * Everything the spending shape's block draws (components/StepsField.jsx), or null for a question without one. The
 * boxes hold the text typed; each row's error is the message id the checks gave for that box, shown once the box has
 * been left (or the question asked) — errorsToShow's rule. `chart` is each year's figure, worked out by the model
 * (shapeModel.js: today's planner's own amountAtAge), from the start to the end of the plan.
 */
export function shapeView(state, q) {
  const ctx = shapeContext(state, q);
  if (!ctx) return null;
  const d = state.draft[q];
  const raw = d.values || {};
  const errors = errorsToShow(state, q);
  const unit = SHAPE_UNIT[q];
  const base = SHAPE_BASE[q];
  const typedThen = raw[thenPath(q)];
  const then = typedThen === 'falls' || typedThen === 'glides' ? typedThen : 'level';
  const steps = stepsOf(q, raw).map((s, i) => {
    const age = wholeAge(s.fromAge);
    const amount = typedNumber(s[unit]);
    return {
      fromAge: s.fromAge, amount: s[unit], then: s.then, fallsPct: s.fallsPct, age,
      partnerAge: ctx.couple && age !== null && ctx.gap !== null ? age - ctx.gap : null,
      ofStart: unit === 'perMonth' ? shownShare(amount, ctx.first) : null,
      ofBudget: unit === 'perMonth' && ctx.budgetMonthly !== null ? shownShare(amount, ctx.budgetMonthly) : null,
      errors: { fromAge: errors[stepBox(q, i, 'fromAge')], [unit]: errors[stepBox(q, i, unit)], then: errors[stepBox(q, i, 'then')], fallsPct: errors[stepBox(q, i, 'fallsPct')] }
    };
  });
  const shaped = typedShape(q, raw);

  // the picture: from the start (with "show me ages", from today) to the end of the plan
  let chart = null;
  let below = null;
  const from = ctx.startAge !== null ? ctx.startAge : ctx.youAge;
  const years = from !== null && ctx.endAge !== null ? ctx.endAge - from : 0;
  const figures = years > 0 ? yearFigures(modelShape(q, raw), ctx.first, from, years) : null;
  if (figures) {
    const ess = unit === 'perMonth' ? ctx.essentials : null;
    const list = figures.map((value, y) => {
      const age = from + y;
      return { age, partnerAge: ctx.couple && ctx.gap !== null ? age - ctx.gap : null, value, below: ess !== null && value < ess - 0.005 };
    });
    const firstBelow = list.find((y) => y.below);
    if (firstBelow) below = { age: firstBelow.age, amount: ess };
    chart = {
      unit, years: list, essentials: ess, layers: false, couple: ctx.couple, gap: ctx.gap,
      bands: { goSlow: 75 + ctx.olderBy, noGo: 85 + ctx.olderBy },
      list: typedList(ctx, unit, raw, q, from)
    };
  }

  const firstErrors = { then: errors[thenPath(q)], fallsPct: errors[fallsPath(q)] };
  const stepsError = errors[stepsPath(q)] || null;
  return {
    q, base, unit, open: state.ui.open.includes('shape'), couple: ctx.couple, youAge: ctx.youAge, startAge: ctx.startAge, startKind: ctx.startKind,
    endAge: ctx.endAge, first: ctx.first, essentials: ctx.essentials, then, fallsPct: typeof raw[fallsPath(q)] === 'string' ? raw[fallsPath(q)] : '',
    firstErrors, steps, stepsError, shaped, list: typedList(ctx, unit, raw, q, ctx.startAge), note: d.shapeNote || null, canUndo: !!d.shapeUndo,
    rescaleDue: unit === 'perMonth' && steps.length > 0 && typeof d.shapeBase === 'number' && ctx.first !== null && d.shapeBase !== ctx.first,
    below, chart
  };
}

/**
 * The picture of every year on an answer whose spending changes with age (spending-shape.md 4.4): the answer's own rows
 * (result.byYear, at the amount the answer is about — A and B as typed, C the careful amount), each year what the
 * household has after tax, the part its State Pension and other pensions (and pay, and part-time work) pay, and the part
 * from the pension and savings. null for a flat answer (no byYear). Nothing is worked out but the split of each bar.
 */
export function answerShapeChart(state, q) {
  const answer = state.answers[q];
  const r = answer && answer.result;
  if (!r || !Array.isArray(r.byYear) || !r.byYear.length) return null;
  const ctx = shapeContext(state, q);
  const ess = ctx && ctx.essentials !== null ? ctx.essentials : null;
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const years = r.byYear.map((row) => {
    const value = num(row.takeHome);
    const anyway = num(row.statePension) + num(row.finalSalary) + num(row.fromWork) + num(row.fromPay);
    const income = Math.max(0, Math.min(value, anyway));
    const partner = row.ages && typeof row.ages.partner === 'number' ? row.ages.partner : null;
    return { age: row.age, partnerAge: partner, value, income, pots: Math.max(0, value - income), below: ess !== null && value < ess - 0.005 };
  });
  const first = r.byYear[0];
  const gap = first.ages && typeof first.ages.you === 'number' && typeof first.ages.partner === 'number' ? first.ages.you - first.ages.partner : null;
  const olderBy = gap !== null && gap > 0 ? gap : 0;
  const list = q === 'c' ? r.shapeAt && r.shapeAt.careful : r.spendShape;
  return {
    unit: 'perMonth', years, essentials: ess, layers: true, couple: gap !== null, gap,
    bands: { goSlow: 75 + olderBy, noGo: 85 + olderBy },
    list: Array.isArray(list) ? list : []
  };
}

// ---- the saved plans, read-only (research/v7/your-plan.md 1.2, 1.3) ------------------------------------------------------

/**
 * The "Your plans" screen: the session's state, and — once the plans are read and the plan source has read them for the
 * screen (plans.view, from src/answers/plan/read.js) — their rows in groups.
 * @returns {{ session, status: 'none'|'checking'|'reading'|'read'|'failed', source, readAt, groups, usedUp, count }}
 */
export function plansView(state) {
  const session = state.session || { kind: 'none' };
  const plans = state.plans;
  const view = plans && plans.status === 'read' && plans.view && plans.view.today === state.env.today ? plans.view : null;
  const status = plans ? (plans.status === 'read' && !view ? 'reading' : plans.status) : session.kind === 'none' ? 'none' : 'checking';
  return { session, status, source: plans ? plans.source : null, readAt: plans ? plans.readAt : null, groups: view ? view.rows : [], usedUp: !!(plans && plans.usedUp), count: plans ? plans.list.length : 0 };
}

/** The "Your plan" screen for the route's plan and step: the source's reading of it, or { found: false } until it is there. */
/**
 * "About you and when" (research/v7/editing-in-v7.md 2): the plan source's reading of the step for the route's plan, with
 * what was typed laid over it (the reading already carries the typed text: planSource.js hands the draft to aboutOf), and
 * which problems to show — a box's once it has been left, every box's once Save has been pressed. Nothing worked out here.
 */
export function aboutView(state) {
  return editView(state, 'about');
}
/** "Money that comes in anyway" (editing-in-v7.md 7): the same reading for the second step (page.income). */
export function incomeView(state) {
  return editView(state, 'income');
}
/** "What you spend" on a saved plan (editing-in-v7.md 8): the same reading for the third step (page.spend). */
export function planSpendView(state) {
  return editView(state, 'spend');
}
/** "Your pots and tax" (editing-in-v7.md 9): the same reading for the fourth step (page.pots). */
export function planPotsView(state) {
  return editView(state, 'pots');
}
/**
 * "Does it last?" (editing-in-v7.md 10): the same reading for the fifth step (page.lasts) — the dials — with the run: its
 * status for THIS plan's key (state.lasts: working, done, failed; the progress and the slow flag), and the words of the
 * result the plan source read from it (page.lasts.verdict, worked out there, never here); `fresh` says the result is for
 * the plan as it is now, else it is an older run's, shown greyed while the new one is under way.
 */
export function planLastsView(state) {
  const v = editView(state, 'lasts');
  if (!v.found) return v;
  const L = state.lasts || { key: null, status: 'idle', reason: null, result: null, progress: null, slow: false };
  const mine = L.key === v.runKey;
  const open = Array.isArray(state.ui && state.ui.open) ? state.ui.open : [];
  // Try a change (way-and-mix.md 4): the boxes' problems show once left or once "Try it" has been pressed, as the dials' do
  const tryFields = v.try ? v.try.fields.map((f) => ({ ...f, error: v.draft.touched.includes(f.path) || v.draft.asked || (L.tried && mine) ? f.error : null })) : [];
  return { ...v, run: { status: mine ? L.status : 'idle', reason: mine ? L.reason || null : null, progress: mine ? L.progress : null, slow: mine ? L.slow : false, fresh: mine && L.status === 'done' && !!v.verdict },
    try: v.try ? { ...v.try, fields: tryFields, open: open.includes('tryOpen') || !!(L.tried && mine), confirm: open.includes('tryConfirm') } : null };
}
/**
 * "The mix" (way-and-mix.md 3.2): the plan source's reading of the step (page.mix: the boxes, the funds, the paste, the tries
 * and the comparison in words, worked out there from state.mix and state.lasts) with the open blocks (ui.open: the paste box,
 * the example list), the write's state (ui.saving kind 'save' or 'mix'), the problem and the toast.
 */
export function planMixView(state) {
  const v = editView(state, 'mix');
  if (!v.found) return v;
  const ui = state.ui || {};
  const open = Array.isArray(ui.open) ? ui.open : [];
  // the funds cards' boxes are marked as the fields are: once left, or once Save is pressed
  const show = (path) => v.draft.asked || v.draft.touched.includes(path);
  const funds = v.lists && v.lists.funds ? { ...v.lists.funds, cards: v.lists.funds.cards.map((c) => ({ ...c, fields: c.fields.map((f) => ({ ...f, error: show(f.path) ? f.error : null })) })) } : null;
  return { ...v, lists: { funds }, pasteOpen: open.includes('mixPaste') || !!(v.paste && v.paste.text), exampleOpen: open.includes('mixExample') };
}
/**
 * "How the money is taken" (way-and-mix.md 2.2): the plan source's reading of the step (page.way: the reading and the cards from
 * state.ways, worked out there) with the nine-way run's status for THIS plan's key (state.ways: working, done, failed; the
 * progress and the slow flag), the write's state (ui.saving kind 'way'), the open confirm and "More columns" (ui.open).
 */
export function planWayView(state) {
  const plans = state.plans;
  const r = state.route;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.today === state.env.today ? plans.view.page : null;
  const way = page && page.way && r && r.screen === 'plan' && r.step === 'way' && page.forId === r.planId ? page.way : null;
  if (!way || !way.found) return { found: false, id: r && r.planId ? r.planId : '', status: plans ? plans.status : 'checking' };
  const W = state.ways || { key: null, status: 'idle', reason: null, progress: null, slow: false };
  const mine = W.key === way.runKey;
  const ui = state.ui || {};
  const open = Array.isArray(ui.open) ? ui.open : [];
  return {
    ...way,
    run: { status: mine ? W.status : 'idle', reason: mine ? W.reason || null : null, progress: mine ? W.progress : null, slow: mine ? W.slow : false },
    more: open.includes('waysMore'), confirm: open.includes('wayConfirm'),
    saving: ui.saving && ui.saving.planId === way.id ? ui.saving : null,
    problem: ui.saveProblem && ui.saveProblem.planId === way.id ? ui.saveProblem.problem : null,
    toast: ui.toast && ui.toast.planId === way.id ? ui.toast : null
  };
}
function editView(state, step) {
  const plans = state.plans;
  const r = state.route;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.today === state.env.today ? plans.view.page : null;
  const about = page && page[step] && r && r.screen === 'plan' && r.step === step && page.forId === r.planId ? page[step] : null;
  if (!about || !about.found) return { found: false, id: r && r.planId ? r.planId : '', status: plans ? plans.status : 'checking' };
  const pd = state.draft.plan && state.draft.plan.id === about.id ? state.draft.plan : { id: about.id, values: {}, touched: [], asked: false };
  const draftKey = JSON.stringify(pd.values);
  const show = (path) => pd.asked || pd.touched.includes(path);
  const fields = about.fields.map((f) => ({ ...f, error: show(f.path) ? f.error : null }));
  // the second step's cards (editing-in-v7.md 7.2): a card's box is marked the same way, once left or once Save is pressed
  const lists = about.lists ? Object.fromEntries(Object.entries(about.lists).map(([L, l]) => [L, { ...l, cards: l.cards.map((c) => ({ ...c, fields: c.fields.map((f) => ({ ...f, error: show(f.path) ? f.error : null })) })) }])) : undefined;
  const ui = state.ui || {};
  return {
    ...about, fields, ...(lists ? { lists } : {}), draft: pd, draftKey, fresh: about.draftKey === draftKey,
    saving: ui.saving && ui.saving.planId === about.id ? ui.saving : null,
    problem: ui.saveProblem && ui.saveProblem.planId === about.id ? ui.saveProblem.problem : null,
    toast: ui.toast && ui.toast.planId === about.id ? ui.toast : null
  };
}
export function planView(state) {
  const plans = state.plans;
  const r = state.route;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.today === state.env.today ? plans.view.page : null;
  if (!r || r.screen !== 'plan' || !page || page.forId !== r.planId || (page.forStep || null) !== (r.step || null)) return { found: false, id: r && r.planId ? r.planId : '', status: plans ? plans.status : 'checking' };
  return { ...page, status: 'read' };
}

/**
 * The lock, the unlock and a new version of the document (research/v7/road-to-7.md step 6): what the route's plan page
 * draws beside its reading — a write under way for THIS plan (ui.saving: lock | unlock | document, or an editing step's save),
 * the problem of the last one, the toast with Undo, and which confirm step is open (ui.open: lockConfirm, unlockConfirm,
 * documentConfirm). Nothing worked out here.
 */
export function planActionsView(state) {
  const r = state.route;
  const id = r && r.screen === 'plan' && r.planId ? r.planId : null;
  const ui = state.ui || {};
  const open = Array.isArray(ui.open) ? ui.open : [];
  return {
    id,
    saving: id && ui.saving && ui.saving.planId === id ? ui.saving : null,
    problem: id && ui.saveProblem && ui.saveProblem.planId === id ? ui.saveProblem.problem : null,
    toast: id && ui.toast && ui.toast.planId === id ? ui.toast : null,
    confirm: open.includes('lockConfirm') ? 'lock' : open.includes('unlockConfirm') ? 'unlock' : open.includes('documentConfirm') ? 'document' : null
  };
}

/** "Lock the plan" (road-to-7.md step 6): the plan page's reading of the lock step (read.js lockStep), with the actions above. */
export function planLockView(state) {
  const v = planView(state);
  if (!v.found) return v;
  const step = v.steps.find((s) => s.id === 'lock') || null;
  return { ...v, lock: step, ...planActionsView(state) };
}
