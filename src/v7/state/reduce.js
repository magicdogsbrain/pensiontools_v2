/**
 * The reducer (V7 build brief 4.6; step 4 brief 4.11). Pure: (state, action) → state. It never changes the state it
 * is given, and returns the very same object when an action changes nothing (a stale result, an action it does not know).
 *
 * No action can change `plan` or `session` in this slice. An unknown action type — or one with a field that is not
 * on the input list — throws in the test build and is ignored in the published build.
 *
 * Step 4: every question that is open has its draft and answer (C's shapes unchanged; A's and B's drafts carry
 * `carriedFrom`, their answers `detail` and `extending`). `draft/carry` copies one question's figures into another's
 * draft by the declared map and opens the place the map names; `answer/extend` marks an optional step's extra pass.
 * The reducer never runs an answer.
 */
import { A, OPENABLE } from './actions.js';
import { emptyDraftFor, emptyAnswerFor, emptyKeep, keptKeep, cleanMade, emptyPlanDraft, keptPlanDraft, emptyLasts, LEVER_KINDS, cleanLever, emptyWays, cleanTried, emptyMix, MIX_TRY_KINDS, cleanMixTry, cleanCell, cleanTriedChange, cleanKept, emptyHousehold, HH_PICKS, cleanHouseholdTry, emptyMove, cleanMove, cleanIndex,
  emptyShellUi, emptyAccount, emptyGuest, emptyNews, ACCOUNT_MODES, ACCOUNT_ASKS, PLAN_ACTION_KINDS, PLAN_ACTION_OPS } from './initial.js';
import { parsedDraft, appliedPaths, isCurrent, SCHEMAS, SPEND_STEP, numbersPaths, skipNoteDue, spendView, keepView, isSpendPath, shapeContext, typedNumber, checkPlanName } from './select.js';
import { hasShape, SHAPE_UNIT, THENS, thenPath, fallsPath, stepsPath, stepBox, stepFields, shapePaths, isShapePath, stepsOf, newStep,
  touchedWithout, touchedReordered, sortedSteps, shapeValuesOf, withShapeValues } from './shapeDraft.js';
import { suggest as suggestShape, preset as presetShape, rescale as rescaleAmount } from './shapeModel.js';
import { carryFor, carriedSteps, atStartOf } from './carry.js';
import { budgetReduce, cleanSheet, newSheet } from './budget.js';
import { parse, format, PLAN_ID } from '../router/routes.js';
import { BUILT } from '../rail/questions.js';
import { SESSION_KINDS, KEEP_WHERES } from './initial.js';
import { isPlanEditPath, WAY_IDS, RANK_BYS } from '../../answers/plan/schema.js';

/** The plan draft (editing-in-v7.md 4, 7.2): what was typed into an editing step for ONE plan; gone when the plan changes. */
const planDraftOf = (state) => (state.draft && state.draft.plan) || emptyPlanDraft();
const withPlanDraft = (state, plan) => ({ ...state, draft: { ...state.draft, plan } });
const PLAN_PROBLEMS = ['locked', 'notHere', 'usedUp', 'nobody', 'storage', 'failed', 'problems', 'readonly',
  // the lock (road-to-7.md step 6): not locked (an unlock or a new version on an unlocked plan), no worker to run the plan's
  // test in, the test gave nothing to write
  'notLocked', 'noWorker', 'noRun',
  // "Keep as a separate plan" (way-and-mix.md 4): the window holds its three plans; an unconfirmed email
  'full', 'unverified',
  // "Your household" (road-to-7.md step 9): no partner's plan linked; the second copy or its link could not be made (the first stays)
  'noPartner', 'partial',
  // the plan menu (road-to-7.md step 11): the last plan is never deleted; the example plan is never changed; a downloaded copy that is
  // not a plan, too big to be one, or holds one with a problem; a name empty or too long
  'lastPlan', 'example', 'badFile', 'fileTooBig', 'fileProblems', 'empty', 'tooLong'];
/** What a saved write was (ui.toast.op): an editing step's save (null), or the lock, the unlock, a new version of the document, the way switched (way-and-mix.md 2.4), a mix used (3.2e), a tried change used (4). */
const PLAN_OPS = [null, 'lock', 'unlock', 'document', 'way', 'mix', 'try',
  // "Leave it" on an out-of-date draft (road-to-7.md step 11b): the planner's own key, remembered
  'stale',
  // "Your household" (road-to-7.md step 9): the partner link, the split written into both plans, "Keep things as they are", the budget shared
  'link', 'split', 'dismiss', 'budgetShare',
  // "What you hold" and "Moving to your plan's mix" (step 10): one change of the record, one tick-off
  'hold', 'tick',
  // the budget on a saved plan (step 11b): one change of the whole budget; "What you pay in": this month's pot recorded
  'budget', 'potRecord'];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-\d{2}$/;

/** Any route → one that has an address: the five fields, no plan id; anything else becomes "not found". */
const tidyRoute = (r) => parse(format(r));

const withDraft = (state, q, draft) => ({ ...state, draft: { ...state.draft, [q]: draft } });
const withAnswer = (state, q, answer) => ({ ...state, answers: { ...state.answers, [q]: answer } });
const keepOf = (state, q) => (state.keep && state.keep[q]) || emptyKeep();
const withKeep = (state, q, keep) => ({ ...state, keep: { ...(state.keep || {}), [q]: keep } });
const onStepOf = (route, q, step) => !!route && route.screen === 'step' && route.q === q && route.step === step;
/** Why a keep did not make a plan (effects/planWrite.js): the box's two, and the store's. */
const KEEP_PROBLEMS = ['empty', 'tooLong', 'notReady', 'full', 'usedUp', 'unverified', 'storage', 'failed', 'partial'];

/**
 * Leaving A's or B's spend step with the "you are skipping the budget" note on screen: it has now been shown, and is
 * not shown again (budget-step.md: "once").
 */
function noteShown(before, after) {
  const r = before.route;
  if (!r || r.screen !== 'step' || !SPEND_STEP[r.q] || r.step !== 'spend' || onStepOf(after.route, r.q, 'spend')) return after;
  if (!skipNoteDue(before, r.q)) return after;
  return withDraft(after, r.q, { ...after.draft[r.q], skipNoted: true });
}
const hasField = (q, path) => !!SCHEMAS[q] && (SCHEMAS[q].fields.some((f) => f.path === path) || (hasShape(q) && path !== stepsPath(q) && shapePaths(q).includes(path)));
const closeRail = (ui) => (ui.railOpen ? { ...ui, railOpen: false } : ui);
/** A's and B's answers carry detail and extending; C's do not, and keep C's shape. */
const hasDetail = (answer) => !!answer && 'extending' in answer;
const detailOf = (result) => (result && result.basis && typeof result.basis.detail === 'string' ? result.basis.detail : null);
/** Whole pounds as a person would type them: 480000 → '480,000'. The same on every device (no toLocaleString). */
const asTyped = (n) => String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const get = (obj, key) => String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

/**
 * draft/carry { from, to }: a new state with draft[to] filled by CARRY[from→to] (state/carry.js) and the route at
 * CARRY_OPENS — or, when the source says "I've already stopped" (a couple), by CARRY_YOU_STOPPED and its own place
 * (carryFor) — or null when there is no such carry. Each entry writes its target field only when it has something:
 *   a typed field of the source → copied as it is (text, or yes/no), skipped when nothing is typed there;
 *   { result: key }           → the figure at that key of the source's answer — only an answer for what is typed now,
 *                               first or final — written as text ('480,000'); with no such figure the box is emptied,
 *                               so it is never left holding a figure from before;
 *   { fixed: text }           → that text.
 * Every field written (or emptied) is marked touched; the target's carriedFrom (A's, B's) says where from. The source
 * draft and every answer are untouched.
 */
function carried(state, from, to) {
  const source = state.draft[from];
  const target = state.draft[to];
  const answer = state.answers[from];
  const readable = !!answer && (answer.status === 'first' || answer.status === 'final') && isCurrent(state, from);
  // the map for what the source says: "I've already stopped" (a couple) has its own, as has C's answer from now with you
  // stopped and your partner stopping later (carry.js carryFor reads that from the answer, as C's "What next?" does)
  const { map, opens } = carryFor(from, to, source && source.values, readable ? answer.result : null);
  if (!map || !source || !target || from === to) return null;
  const values = { ...target.values };
  const touched = [...target.touched];
  const mark = (path) => { if (!touched.includes(path)) touched.push(path); };
  for (const [src, toPath] of map) {
    if (!hasField(to, toPath)) return null;
    if (typeof src === 'string') {
      const v = source.values[src];
      if (typeof v !== 'string' && typeof v !== 'boolean') continue;
      values[toPath] = v;
    } else if (src && 'result' in src) {
      const n = readable ? get(answer.result, src.result) : undefined;
      if (typeof n === 'number' && Number.isFinite(n)) values[toPath] = asTyped(n);
      else delete values[toPath];
    } else if (src && 'fixed' in src) {
      values[toPath] = String(src.fixed);
    } else continue;
    mark(toPath);
  }
  // The spending shape goes with the household's figures (spending-shape.md 4.5; carry.js carriedSteps): measured against
  // the figure the target's box now holds (C → A, B: C's amount to take, else its careful start, which the box then takes
  // too), or the figure the source uses (A, B → C).
  let shapeMoved = false;
  if (hasShape(from) && hasShape(to)) {
    let base = null;
    if (SHAPE_UNIT[from] === 'share' && SHAPE_UNIT[to] !== 'share' && stepsOf(from, source.values).length) {
      base = typedNumber(values['spend.amount']);
      const careful = readable && answer.result && answer.result.monthly ? answer.result.monthly.careful : null;
      if (base === null && typeof careful === 'number' && careful > 0) {
        base = Math.floor(careful);
        values['spend.amount'] = asTyped(base);
        values['spend.kind'] = 'amount';
        mark('spend.amount');
      }
    } else if (SHAPE_UNIT[from] !== 'share' && SHAPE_UNIT[to] === 'share') {
      base = shapeContext(state, from).first;
    }
    // a stop past one of the source's steps (A's "show me ages"): the target starts there, so it starts on the step in force
    // — the shape from it, and (B) the figure the source tested there in the box, to the pound, down (carry.js atStartOf)
    let src = source.values;
    if (SHAPE_UNIT[from] === 'perMonth') {
      const at = atStartOf(from, source.values, shapeContext(state, from).first, shapeContext(withDraft(state, to, { ...target, values }), to).startAge);
      if (at) {
        src = at.values;
        if (SHAPE_UNIT[to] === 'share') base = at.first;
        else {
          values['spend.amount'] = asTyped(Math.floor(at.first + 1e-9));
          values['spend.kind'] = 'amount';
          mark('spend.amount');
        }
      }
    }
    const shape = carriedSteps(from, to, src, base);
    if (shape) {
      for (const [p, v] of Object.entries(shape)) {
        if (v === undefined) { if (p in values) { delete values[p]; shapeMoved = true; } continue; }
        values[p] = v;
        shapeMoved = true;
        if (p === stepsPath(to)) v.forEach((x, i) => stepFields(to).forEach((f) => mark(stepBox(to, i, f))));
        else mark(p);
      }
    }
  }
  const draft = { ...target, values, touched };
  // the target's own Undo, its line and the figure its steps were set against belong to the shape it had: gone with it
  if (shapeMoved) { delete draft.shapeUndo; delete draft.shapeNote; delete draft.shapeBase; }
  if ('carriedFrom' in target) draft.carriedFrom = from;
  const route = opens ? tidyRoute({ screen: 'step', q: opens.q, step: opens.step, planId: null, focus: opens.focus }) : state.route;
  return { ...withDraft(state, to, draft), route, ui: closeRail(state.ui) };
}

// ---- the spending shape (research/v7/spending-shape.md 4.3; state/shapeDraft.js) ---------------------------------------

/** The block opened when a box of the shape has a problem (on "Show", or a step added after the question was asked). */
function withShapeOpen(state, q, errors) {
  if (!hasShape(q) || state.ui.open.includes('shape') || !Object.keys(errors || {}).some((p) => isShapePath(q, p))) return state;
  return { ...state, ui: { ...state.ui, open: [...state.ui.open, 'shape'] } };
}

/**
 * draft[q] with its values' later steps replaced (an empty list is no steps) and `more` over the draft. `byHand`: an edit
 * by hand — the line about the last suggestion and its Undo go, and the steps are now set against the figure in use.
 */
function withSteps(state, q, steps, more = {}, byHand = true) {
  const draft = state.draft[q];
  const values = { ...draft.values };
  if (steps.length) values[stepsPath(q)] = steps;
  else delete values[stepsPath(q)];
  const next = { ...draft, values, ...more };
  if (byHand) {
    delete next.shapeNote;
    delete next.shapeUndo;
    const ctx = shapeContext(state, q);
    if (ctx && typeof ctx.first === 'number') next.shapeBase = ctx.first;
  }
  if ('carriedFrom' in draft && draft.carriedFrom !== null) next.carriedFrom = null;
  return withDraft(state, q, next);
}

/** A figure for a box: whole numbers with their commas ("2,130"), pence only where the figure has them. */
function boxText(n, unit) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '';
  if (unit === 'share') return String(Math.round(n * 100) / 100);
  const whole = Math.round(n * 100) % 100 === 0;
  const [int, dec] = (whole ? Math.round(n).toFixed(0) : n.toFixed(2)).split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? `.${dec}` : '');
}

/** The model's shape (numbers) as the boxes of a draft (text). */
function shapeAsTyped(q, model) {
  const unit = SHAPE_UNIT[q];
  const out = {};
  const start = model.start || {};
  if (start.then === 'falls' || start.then === 'glides') out[thenPath(q)] = start.then;
  if (start.then === 'falls') out[fallsPath(q)] = String(start.fallsPct);
  const steps = (model.steps || []).map((x) => ({ fromAge: String(x.fromAge), [unit]: boxText(x[unit], unit), then: THENS.includes(x.then) ? x.then : 'level',
    fallsPct: x.then === 'falls' && typeof x.fallsPct === 'number' ? String(x.fallsPct) : '' }));
  if (steps.length) out[stepsPath(q)] = steps;
  return out;
}

/** A suggestion or preset: the shape replaced, what it was kept for Undo, and the line saying what was done. */
function replacedShape(state, q, model, note) {
  const d = state.draft[q];
  const undo = { values: shapeValuesOf(q, d.values) };
  const values = withShapeValues(q, d.values, shapeAsTyped(q, model));
  const ctx = shapeContext(state, q);
  const touched = d.touched.filter((t) => !isShapePath(q, t) || shapePaths(q).includes(t));
  const next = { ...d, values, touched, shapeUndo: undo, shapeNote: note };
  if (ctx && typeof ctx.first === 'number') next.shapeBase = ctx.first;
  else delete next.shapeBase;
  if ('carriedFrom' in d && d.carriedFrom !== null) next.carriedFrom = null;
  return withDraft(state, q, next);
}

function shapeReduce(state, action, refuse) {
  const q = action.q;
  const draft = q ? state.draft[q] : null;
  if (!draft || !hasShape(q)) return refuse(`${action.type}: question "${q}" has no spending shape`);
  const steps = stepsOf(q, draft.values);
  const unit = SHAPE_UNIT[q];
  const okIndex = (i) => Number.isInteger(i) && i >= 0 && i < steps.length;
  switch (action.type) {
    case A.SHAPE_STEP: {
      const { i, field, value } = action;
      if (!stepFields(q).includes(field) || typeof value !== 'string') return refuse(`shape/step: no box ${field} in "${q}"`);
      if (field === 'then' && !THENS.includes(value)) return refuse(`shape/step: "${value}" is not a then`);
      if (!okIndex(i)) return state;                                       // a step already gone (a second press): nothing to do
      if (steps[i][field] === value) return state;
      const next = steps.map((x, k) => (k === i ? { ...x, [field]: value } : x));
      return withSteps(state, q, next);
    }
    case A.SHAPE_TOUCH: {
      const { i, field } = action;
      if (!stepFields(q).includes(field)) return refuse(`shape/touch: no box ${field} in "${q}"`);
      if (!okIndex(i)) return state;
      const box = stepBox(q, i, field);
      if (draft.touched.includes(box)) return state;
      return withDraft(state, q, { ...draft, touched: [...draft.touched, box] });
    }
    case A.SHAPE_ADD: {
      const ctx = shapeContext(state, q);
      const step = newStep(q, steps, { startAge: ctx.startAge !== null ? ctx.startAge : ctx.youAge, endAge: ctx.endAge, first: ctx.first });
      const i = steps.length;
      // after "Show", the new step's boxes are "revealed": no sentence under them until they are left or it is pressed again
      const revealed = draft.asked ? [...(draft.revealed || []), ...stepFields(q).map((f) => stepBox(q, i, f))] : draft.revealed;
      return withSteps(state, q, [...steps, step], { revealed });
    }
    case A.SHAPE_REMOVE: {
      const { i } = action;
      if (!okIndex(i)) return state;                                       // already removed (a second press)
      const next = steps.filter((x, k) => k !== i);
      return withSteps(state, q, next, { touched: touchedWithout(q, draft.touched, i), revealed: touchedWithout(q, draft.revealed || [], i) });
    }
    case A.SHAPE_SORT: {
      const sorted = sortedSteps(q, steps);
      if (!sorted) return state;
      return withSteps(state, q, sorted.steps, { touched: touchedReordered(q, draft.touched, sorted.order), revealed: touchedReordered(q, draft.revealed || [], sorted.order) }, false);
    }
    case A.SHAPE_SUGGEST: {
      const ctx = shapeContext(state, q);
      const start = ctx.startAge !== null ? ctx.startAge : ctx.youAge;
      if (unit === 'perMonth' && !(ctx.first > 0)) return withDraft(state, q, { ...draft, shapeNote: { kind: 'suggestNeedsFirst' } });
      if (start === null) return state;
      const s = suggestShape(unit, ctx.first, start, ctx.olderBy, ctx.essentials);
      const note = { kind: 'suggest', values: { age75: s.age75, age85: s.age85, ...(s.floor ? { floor: s.floor } : {}), couple: ctx.couple && ctx.olderBy > 0 } };
      return replacedShape(state, q, s, note);
    }
    case A.SHAPE_PRESET: {
      if (!['level', 'slowly'].includes(action.id)) return refuse(`shape/preset: no preset "${action.id}"`);
      const ctx = shapeContext(state, q);
      const start = ctx.startAge !== null ? ctx.startAge : ctx.youAge;
      if (action.id === 'slowly' && unit === 'perMonth' && !(ctx.first > 0)) return withDraft(state, q, { ...draft, shapeNote: { kind: 'suggestNeedsFirst' } });
      // "Slowly less" counts its years from when the money starts, as today's smileToSteps does from the plan's start: with
      // "show me ages" there is no start yet, so it asks for one (review, 2 Oct 2026 — from today's age it was not today's
      // "declining with age" for any stop shown, and every stop past its fifth year started on a figure never typed)
      if (action.id === 'slowly' && ctx.startAge === null) return withDraft(state, q, { ...draft, shapeNote: { kind: 'slowlyNeedsStop' } });
      const model = presetShape(unit, action.id, ctx.first, start);
      if (!model) return state;
      return replacedShape(state, q, model, { kind: action.id });
    }
    case A.SHAPE_UNDO: {
      if (!draft.shapeUndo) return state;
      const values = withShapeValues(q, draft.values, draft.shapeUndo.values);
      const { shapeUndo, ...rest } = draft;
      return withDraft(state, q, { ...rest, values, shapeNote: { kind: 'undone' } });
    }
    case A.SHAPE_RESCALE: {
      // from the figure the steps were set against — or, from "Try a change", the figure the press moved from (`from`)
      const ctx = shapeContext(state, q);
      const from = typeof action.from === 'number' && action.from > 0 ? action.from : draft.shapeBase;
      if (unit !== 'perMonth' || typeof from !== 'number' || !(ctx.first > 0) || from === ctx.first) return state;
      const next = steps.map((x) => {
        const n = typedNumber(x.perMonth);
        const moved = rescaleAmount(n, from, ctx.first);
        return moved === null ? x : { ...x, perMonth: boxText(moved, unit) };
      });
      return withSteps(state, q, next, { shapeBase: ctx.first, shapeNote: { kind: 'rescaled' } }, false);
    }
    default:
      return refuse(`unknown action "${action.type}"`);
  }
}

export function reduce(state, action) {
  const refuse = (why) => {
    if (state.env.build === 'test') throw new Error(`V7 reducer: ${why}`);
    return state;
  };
  if (!action || typeof action.type !== 'string') return refuse('an action needs a type');
  const q = action.q;
  const draft = q ? state.draft[q] : null;
  const answer = q ? state.answers[q] : null;

  switch (action.type) {
    case A.ROUTE_SET: {
      const route = tidyRoute(action.route);
      const pd = planDraftOf(state);
      // the plan draft belongs to one plan: an address naming another plan (or none) clears it, and the toast goes with it
      const onPlan = (id) => route.screen === 'plan' && route.planId === id;
      const other = pd.id !== null && !onPlan(pd.id);
      // the toast and a save's problem belong to their plan too
      const t = state.ui.toast, sp = state.ui.saveProblem;
      const uiOther = (t && !onPlan(t.planId)) || (sp && sp.planId && !onPlan(sp.planId));
      // the blocks opened on one plan's step belong to it: Try a change's boxes and confirm to its "Does it last?", the mix's
      // paste and example to its "The mix" — leaving that page closes them (a locked plan's page starts with no box)
      const stays = (step) => route.screen === 'plan' && route.step === step && state.route && state.route.screen === 'plan' && state.route.step === step && String(state.route.planId) === String(route.planId);
      const gone = [...(stays('lasts') ? [] : ['tryOpen', 'tryConfirm']), ...(stays('mix') ? [] : ['mixPaste', 'mixExample']), ...(stays('household') ? [] : ['hhWhoPays', 'hhDetail']), ...(stays('hold') ? [] : ['holdPaste']), ...(stays('move') ? [] : ['moveHow', 'moveSheet', 'moveExplained']), ...(stays('budget') ? [] : ['budgetReset']), ...(stays('saving') ? [] : ['savingRelief'])];
      // the household's confirm belongs to its page too
      const hh = state.household && state.household.pick && !stays('household') ? { ...state.household, pick: null } : state.household;
      const ui0 = closeRail(state.ui);
      const open = ui0.open.filter((x) => !gone.includes(x));
      // the plan menu's box or confirm (road-to-7.md step 11) belongs to "Your plans": leaving the page closes it
      const ui1 = ui0.action && route.screen !== 'plans' ? { ...ui0, action: null } : ui0;
      const next = { ...state, route, household: hh, ui: open.length === ui1.open.length ? ui1 : { ...ui1, open } };
      if (!other && !uiOther) return noteShown(state, next);
      const cleared = { ...next, ui: { ...next.ui, saving: null, saveProblem: null, toast: null } };
      return noteShown(state, other ? withPlanDraft(cleared, emptyPlanDraft()) : cleared);
    }

    // ---- what was typed -------------------------------------------------------------------------------------
    case A.DRAFT_SET: {
      if (!draft || !hasField(q, action.path)) return refuse(`draft/set: no field "${q}.${action.path}"`);
      // the later steps of the spending shape are one list, edited step by step (shape/*): a text can only empty it
      if (hasShape(q) && action.path === stepsPath(q)) {
        if (!(action.path in draft.values)) return state;
        const { [action.path]: gone, ...rest } = draft.values;
        return withDraft(state, q, { ...draft, values: rest, ...('carriedFrom' in draft && draft.carriedFrom !== null ? { carriedFrom: null } : {}) });
      }
      const values = { ...draft.values };
      // Text is held exactly as typed; yes/no as a boolean. Anything else empties the box.
      if (typeof action.value === 'string' || typeof action.value === 'boolean') values[action.path] = action.value;
      else delete values[action.path];
      // Setting household to 'single' keeps the partner's values: "Remove" then "Add" loses nothing.
      // A's and B's "we have brought your figures over" goes once any box is changed.
      const changed = values[action.path] !== draft.values[action.path] || (action.path in values) !== (action.path in draft.values);
      const carriedGone = changed && 'carriedFrom' in draft && draft.carriedFrom !== null;
      const next = withDraft(state, q, carriedGone ? { ...draft, values, carriedFrom: null } : { ...draft, values });
      if (!draft.asked) return next;
      // After "Show what it pays": a field this change brings onto the form (a partner's boxes) is "revealed" —
      // it shows no error until it has been left or the button is pressed again.
      const before = new Set(appliedPaths(state, q));
      const revealed = [...(draft.revealed || [])];
      for (const path of appliedPaths(next, q)) if (!before.has(path) && !revealed.includes(path)) revealed.push(path);
      return revealed.length === (draft.revealed || []).length ? next : withDraft(next, q, { ...next.draft[q], revealed });
    }
    case A.DRAFT_TOUCH: {
      if (!draft || !hasField(q, action.path)) return refuse(`draft/touch: no field "${q}.${action.path}"`);
      if (draft.touched.includes(action.path)) return state;
      return withDraft(state, q, { ...draft, touched: [...draft.touched, action.path] });
    }
    case A.DRAFT_ASK: {
      if (!draft) return refuse(`draft/ask: no question "${q}"`);
      // Pressing the button asks for every field on the form as it stands: nothing is "revealed" any more.
      const next = draft.asked && !(draft.revealed || []).length ? state : withDraft(state, q, { ...draft, asked: true, revealed: [] });
      const parsed = parsedDraft(state, q);
      // A's and B's spend step asks for the spending only: with that right, the answer step opens — and asks there for
      // anything else still missing (rule R3), never a bounce back to the numbers step.
      const fromSpend = SPEND_STEP[q] && onStepOf(state.route, q, 'spend') && !Object.keys(parsed.errors).some(isSpendPath);
      const canAnswer = (parsed.ok || fromSpend) && BUILT[q] && BUILT[q].steps.some((s) => s.id === 'answer');
      if (!canAnswer) {
        // A figure that needs another look inside "Add more detail" (C's "make it last to age" before the start age, the
        // reviewers' dead end): the block opens, so the box and its sentence are on screen for the form to focus.
        const inMore = SCHEMAS[q] && (SCHEMAS[q].fields.some((f) => f.group === 'more' && parsed.errors[f.path]) || (q === 'c' && Object.keys(parsed.errors).some((p) => isShapePath(q, p))));
        const opened = inMore && !next.ui.open.includes('more') ? { ...next, ui: { ...next.ui, open: [...next.ui.open, 'more'] } } : next;
        // a step of the spending shape that needs another look: its block opens, so the box and its sentence are on screen
        return withShapeOpen(opened, q, parsed.errors);
      }
      return noteShown(state, { ...next, route: tidyRoute({ screen: 'step', q, step: 'answer', planId: null, focus: null }), ui: closeRail(next.ui) });
    }
    case A.DRAFT_ONWARD: {
      // A's and B's numbers step: its own boxes checked (the spending is on the next step). Something wrong → those
      // boxes are marked, as if left; all right → the spend step.
      if (!draft || !SPEND_STEP[q]) return refuse(`draft/onward: question "${q}" has no spend step`);
      const parsed = parsedDraft(state, q);
      const wrong = numbersPaths(state, q).filter((p) => parsed.errors[p]);
      if (!wrong.length) return { ...state, route: tidyRoute({ screen: 'step', q, step: 'spend', planId: null, focus: null }), ui: closeRail(state.ui) };
      const touched = [...draft.touched];
      for (const p of wrong) if (!touched.includes(p)) touched.push(p);
      const next = touched.length === draft.touched.length ? state : withDraft(state, q, { ...draft, touched });
      const inMore = SCHEMAS[q].fields.some((f) => f.group === 'more' && wrong.includes(f.path));
      return inMore && !next.ui.open.includes('more') ? { ...next, ui: { ...next.ui, open: [...next.ui.open, 'more'] } } : next;
    }
    case A.SPEND_HOW: {
      if (!draft || !SPEND_STEP[q] || !['lines', 'one'].includes(action.how)) return refuse(`spend/how: "${action.how}" for "${q}"`);
      const how = draft.spendHow === action.how ? state : withDraft(state, q, { ...draft, spendHow: action.how });
      // Working it out line by line starts the household's one sheet: the catalogue's lines, every amount blank.
      return action.how === 'lines' && !state.budget ? { ...how, budget: newSheet() } : how;
    }
    case A.BUDGET_USE: {
      // The ONE way from the budget to a figure: its total, to the pound, into the spending box, as typed text.
      if (!draft || !SPEND_STEP[q]) return refuse(`budget/use: question "${q}" has no spend step`);
      const view = spendView(state, q);
      if (!view.budget || !view.canUse) return state;
      const values = { ...draft.values, 'spend.kind': 'amount', 'spend.amount': asTyped(view.budget.total) };
      const touched = draft.touched.includes('spend.amount') ? draft.touched : [...draft.touched, 'spend.amount'];
      return withDraft(state, q, { ...draft, values, touched, spendHow: 'lines', ...('carriedFrom' in draft ? { carriedFrom: null } : {}) });
    }
    case A.DRAFT_RESET: {
      if (!draft) return refuse(`draft/reset: no question "${q}"`);
      const reset = withAnswer(withDraft(state, q, emptyDraftFor(q)), q, emptyAnswerFor(q));
      return withKeep(reset, q, { ...keepOf(state, q), name: null, problem: null });
    }
    case A.DRAFT_CARRY: {
      const next = carried(state, action.from, action.to);
      return next || refuse(`draft/carry: no carry from "${action.from}" to "${action.to}"`);
    }

    // ---- the answer -----------------------------------------------------------------------------------------
    case A.ANSWER_WORKING: {
      if (!answer) return refuse(`answer/working: no question "${q}"`);
      if (typeof action.inputsKey !== 'string') return state;
      // The old result stays on screen (greyed). "before" is the last FINAL answer's careful amount — and, when an
      // amount to take had been named, how long that lasted — for "Before / Now".
      const wasFinal = answer.status === 'final' && answer.result && answer.result.monthly && typeof answer.result.monthly.careful === 'number';
      const oldTake = wasFinal && answer.result.take && typeof answer.result.take.perMonth === 'number' ? answer.result.take : null;
      // A and B keep the last final answer's own "Now:" sentence (a.change / b.change), which the screen shows as "Before:",
      // and the inputs it was worked out from, so the screen can name what was changed since ("the stop age from 60 to 61").
      const changeOf = answer.status === 'final' && answer.result && answer.result.sentences && answer.result.sentences.change;
      const keptInputs = answer.result && answer.result.inputs && typeof answer.result.inputs === 'object' ? { inputs: answer.result.inputs } : {};
      const before = wasFinal
        ? { monthly: { careful: answer.result.monthly.careful }, take: oldTake ? { perMonth: oldTake.perMonth, runOutAge: oldTake.runOutAge, covered: oldTake.covered === true } : null }
        : q !== 'c' && changeOf && typeof changeOf.text === 'string'
          ? { change: { id: changeOf.id, text: changeOf.text, parts: changeOf.parts }, ...keptInputs }
          : answer.before;
      const working = { ...answer, status: 'working', inputsKey: action.inputsKey, before, progress: null, slow: false };
      if (hasDetail(answer)) working.extending = false;                                                                       // a change mid-extend ends it
      return withAnswer(state, q, working);
    }
    case A.ANSWER_PROGRESS: {
      if (!answer) return refuse(`answer/progress: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey) return state;
      if (answer.status !== 'working' && answer.status !== 'first' && !answer.extending) return state;
      return withAnswer(state, q, { ...answer, progress: { done: Number(action.done) || 0, total: Number(action.total) || 0 } });
    }
    case A.ANSWER_FIRST: {
      if (!answer) return refuse(`answer/first: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey || answer.status !== 'working') return state;   // stale
      const first = { ...answer, status: 'first', result: action.result, progress: null };
      if (hasDetail(answer)) first.detail = detailOf(action.result);
      return withAnswer(state, q, first);
    }
    case A.ANSWER_FINAL: {
      if (!answer) return refuse(`answer/final: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey) return state;                                  // stale
      // A final figure arrives for a run under way, or for an optional step's extra pass on a final answer.
      if (answer.status !== 'working' && answer.status !== 'first' && !(answer.status === 'final' && answer.extending)) return state;
      const final = { ...answer, status: 'final', result: action.result, progress: null, slow: false };
      if (hasDetail(answer)) { final.detail = detailOf(action.result); final.extending = false; }
      return withAnswer(state, q, final);
    }
    case A.ANSWER_FAILED: {
      if (!answer) return refuse(`answer/failed: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey) return state;                                  // stale
      if (answer.status !== 'working' && answer.status !== 'first' && !(answer.status === 'final' && answer.extending)) return state;
      const failed = { ...answer, status: 'failed', progress: null, slow: false };                                           // the draft is untouched
      if (hasDetail(answer)) failed.extending = false;
      return withAnswer(state, q, failed);
    }
    case A.ANSWER_SLOW: {
      if (!answer) return refuse(`answer/slow: no question "${q}"`);
      if ((answer.status !== 'working' && answer.status !== 'first' && !answer.extending) || answer.slow) return state;
      return withAnswer(state, q, { ...answer, slow: true });
    }
    case A.ANSWER_EXTEND: {
      // An optional step's extra pass (A's ages, B's choices): only on a final answer for the key, not already extending.
      if (!hasDetail(answer)) return refuse(`answer/extend: question "${q}" has no optional pass`);
      if (typeof action.inputsKey !== 'string' || action.inputsKey !== answer.inputsKey) return state;                      // stale
      if (answer.status !== 'final' || answer.extending) return state;
      return withAnswer(state, q, { ...answer, extending: true, progress: null, slow: false });
    }
    case A.ANSWER_RETRY: {
      if (!answer) return refuse(`answer/retry: no question "${q}"`);
      // "Try again" after a failure: with no key, the runner starts again at once. Only a failed run can be retried.
      if (answer.status !== 'failed') return state;
      return withAnswer(state, q, { ...answer, status: 'idle', inputsKey: null });
    }

    // ---- the page -------------------------------------------------------------------------------------------
    case A.UI_TOGGLE: {
      if (!OPENABLE.includes(action.id)) return refuse(`ui/toggle: nothing called "${action.id}" opens`);
      const open = state.ui.open.includes(action.id) ? state.ui.open.filter((id) => id !== action.id) : [...state.ui.open, action.id];
      return { ...state, ui: { ...state.ui, open } };
    }
    case A.UI_RAIL:
      return state.ui.railOpen === !!action.open ? state : { ...state, ui: { ...state.ui, railOpen: !!action.open } };
    case A.UI_ONLINE:
      return state.ui.online === !!action.online ? state : { ...state, ui: { ...state.ui, online: !!action.online } };

    // ---- the saved plans, read-only (research/v7/your-plan.md 3.8, 4.3): page memory only, never the draft ----------
    case A.SESSION_SET: {
      const k = action.session && action.session.kind;
      if (!SESSION_KINDS.includes(k)) return refuse('session/set: not a session');
      const email = typeof action.session.email === 'string' ? action.session.email : null;
      const next = { kind: k, email, signingOut: false };
      if (state.session.kind === k && state.session.email === email && !state.session.signingOut) return state;
      // becoming nobody clears the plans at once (4.3)
      return { ...state, session: next, plans: k === 'in' || k === 'checking' ? state.plans : null };
    }
    case A.SESSION_OUT:
      return state.session.kind !== 'in' || state.session.signingOut ? state : { ...state, session: { ...state.session, signingOut: true } };
    case A.PLANS_READING:
      return { ...state, plans: { status: 'reading', source: state.plans ? state.plans.source : null, readAt: state.plans ? state.plans.readAt : null, list: state.plans ? state.plans.list : [] } };
    case A.PLANS_SET: {
      if (!Array.isArray(action.list)) return refuse('plans/set: the list must be a list');
      const source = action.source === 'window' ? 'window' : 'account';
      const list = action.list.filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null).map((e) => ({ plan: e.plan, newer: !!e.newer, failed: !!e.failed }));
      return { ...state, plans: { status: 'read', source, readAt: typeof action.readAt === 'string' ? action.readAt : null, list, usedUp: action.usedUp === true } };
    }
    case A.PLANS_FAILED:
      return { ...state, plans: { status: 'failed', source: state.plans ? state.plans.source : null, readAt: state.plans ? state.plans.readAt : null, list: [] } };
    case A.PLANS_VIEW: {
      // the plan source's reading (src/answers/plan/read.js, loaded with the source on the plan pages only): the list's
      // rows, and the page for the route's plan and step — data the screens draw; nothing a screen works out
      const v = action.view;
      if (!state.plans || state.plans.status !== 'read') return state;
      if (!v || typeof v !== 'object' || !Array.isArray(v.rows)) return refuse('plans/view: not a view');
      return { ...state, plans: { ...state.plans, view: { today: String(v.today), rows: v.rows, page: v.page && typeof v.page === 'object' ? v.page : null } } };
    }
    case A.PLANS_CLEAR:
      if (state.plans === null && state.session.kind === 'none' && planDraftOf(state).id === null && (state.lasts || emptyLasts()).key === null && (state.ways || emptyWays()).key === null && (state.mix || emptyMix()).key === null && (state.household || emptyHousehold()).key === null && (state.move || emptyMove()).key === null) return state;
      // the plans leave the page's memory, and the one test's result, the nine ways', the mix's and the held run with them (editing-in-v7.md 10.1; way-and-mix.md 2.2, 3.2); the index the watch read is the page's, and stays
      return withPlanDraft({ ...state, plans: null, lasts: emptyLasts(), ways: emptyWays(), mix: emptyMix(), household: emptyHousehold(), move: { ...emptyMove(), index: (state.move || emptyMove()).index || null }, session: { kind: 'checking', email: null, signingOut: false }, ui: { ...state.ui, saving: null, saveProblem: null, toast: null } }, emptyPlanDraft());
    case A.PLAN_CHANGE: {
      const { planId = null, place, back } = action;
      if (typeof place !== 'string' || typeof back !== 'string') return refuse('plan/change: needs a place and a way back');
      return { ...state, ui: { ...state.ui, leaving: { planId, place, back }, leaveProblem: null } };
    }
    case A.PLAN_CHANGE_FAILED:
      return { ...state, ui: { ...state.ui, leaving: null, leaveProblem: 'storage' } };

    // ---- editing a saved plan: "About you and when", "Money that comes in anyway" (research/v7/editing-in-v7.md 2, 4, 7) ----
    case A.PLAN_EDIT: {
      const { planId, path, value } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/edit: needs a plan id');
      if (!isPlanEditPath(path)) return refuse(`plan/edit: no field "${path}"`);
      const pd = planDraftOf(state);
      const base = pd.id === planId ? pd : emptyPlanDraft();
      const values = { ...base.values };
      if (typeof value === 'string') values[path] = value; else delete values[path];   // text as typed; anything else empties the box
      if (base.id === planId && values[path] === pd.values[path] && (path in values) === (path in pd.values)) return state;
      return withPlanDraft({ ...state, ui: { ...state.ui, saveProblem: null } }, { ...base, id: planId, values });
    }
    case A.PLAN_TOUCH: {
      const { planId, path } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/touch: needs a plan id');
      if (!isPlanEditPath(path)) return refuse(`plan/touch: no field "${path}"`);
      const pd = planDraftOf(state);
      const base = pd.id === planId ? pd : { ...emptyPlanDraft(), id: planId };
      if (base.touched.includes(path)) return base === pd ? state : withPlanDraft(state, base);
      return withPlanDraft(state, { ...base, touched: [...base.touched, path] });
    }
    case A.PLAN_SAVE: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/save: needs a plan id');
      if (state.ui.saving) return state;
      const pd = planDraftOf(state);
      const base = pd.id === planId ? pd : { ...emptyPlanDraft(), id: planId };
      return withPlanDraft({ ...state, ui: { ...state.ui, saving: { planId, kind: 'save' }, saveProblem: null, toast: null } }, { ...base, asked: true });
    }
    case A.PLAN_STALE_LEAVE: {
      // "Leave it" on an out-of-date draft (road-to-7.md step 11b): one write of the planner's own key; the boxes are left alone
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/staleLeave: needs a plan id');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId, kind: 'staleLeave' }, saveProblem: null, toast: null } };
    }
    case A.PLAN_SAVED: {
      const { planId, previous = null, line = null, op = null, lockedAt = null } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/saved: needs a plan id');
      if (!PLAN_OPS.includes(op)) return refuse(`plan/saved: "${op}" is not a write it knows`);
      // a write that touched the partner's plan too (road-to-7.md step 9: the split, the budget shared): its previous values ride on the toast, so Undo puts both back
      const others = Array.isArray(action.others) ? action.others.filter((o) => o && typeof o.planId === 'string' && o.planId && o.previous && typeof o.previous === 'object').map((o) => ({ planId: o.planId, previous: o.previous })) : [];
      const hasPrevious = (!!previous && typeof previous === 'object' && Object.keys(previous).length > 0) || others.some((o) => Object.keys(o.previous).length > 0);
      // the lock's toast remembers the moment of the lock (lockedAt): Undo is allowed only as the exact reverse of that lock
      const marks = { ...(op ? { op, ...(op === 'lock' && typeof lockedAt === 'string' ? { lockedAt } : {}) } : {}), ...(others.length ? { others } : {}) };
      const toast = hasPrevious ? { planId, kind: 'saved', previous: previous && typeof previous === 'object' ? previous : {}, line: line && typeof line === 'object' ? line : null, ...marks }
        : { planId, kind: 'unchanged', previous: null, line: null, ...marks };
      // the way of drawing changed (way-and-mix.md 2.4), a mix used (3.2e) or a tried change used (4): the one test's result was for
      // the old settings — it goes, and runs again on the saved plan (the copy a try was kept as stays said)
      const lasts = op === 'way' || op === 'mix' || op === 'try' || op === 'split' ? { ...emptyLasts(), kept: (state.lasts && state.lasts.kept) || null } : state.lasts;
      // a tried change used: the boxes and the confirm close with it (the plan is now what was tried)
      const open = op === 'try' ? state.ui.open.filter((x) => x !== 'tryOpen' && x !== 'tryConfirm') : state.ui.open;
      return withPlanDraft({ ...state, lasts, ui: { ...state.ui, open, saving: null, saveProblem: null, toast } }, emptyPlanDraft());
    }
    case A.PLAN_SAVE_FAILED: {
      const { planId, problem } = action;
      if (!PLAN_PROBLEMS.includes(problem)) return refuse(`plan/saveFailed: "${problem}" is not a problem it knows`);
      // a detail in words (the problem a downloaded copy holds: road-to-7.md step 11), never more than a line
      const detail = typeof action.detail === 'string' && action.detail ? action.detail.slice(0, 200) : null;
      // a hand-over that failed: the offer stays, no longer under way
      const bringIn = state.ui.bringIn && state.ui.saving && state.ui.saving.kind === 'bringIn' ? { ...state.ui.bringIn, busy: false } : state.ui.bringIn;
      return { ...state, ui: { ...state.ui, saving: null, bringIn, saveProblem: { planId: typeof planId === 'string' ? planId : null, problem, ...(detail ? { detail } : {}) } } };
    }
    case A.PLAN_CANCEL: {
      const pd = planDraftOf(state);
      if (pd.id === null && !state.ui.saveProblem) return state;
      return withPlanDraft({ ...state, ui: { ...state.ui, saveProblem: null } }, emptyPlanDraft());
    }
    case A.PLAN_UNDO: {
      const t = state.ui.toast;
      if (!t || t.kind !== 'saved' || t.planId !== action.planId || state.ui.saving) return state;
      const marks = { ...(t.op ? { op: t.op, ...(t.lockedAt ? { lockedAt: t.lockedAt } : {}) } : {}), ...(Array.isArray(t.others) && t.others.length ? { others: t.others } : {}) };
      return { ...state, ui: { ...state.ui, saving: { planId: t.planId, kind: 'undo', previous: t.previous, ...marks }, toast: { ...t, kind: 'undoing' } } };
    }
    case A.PLAN_UNDO_DONE: {
      const t = state.ui.toast;
      if (!t || t.planId !== action.planId) return { ...state, ui: { ...state.ui, saving: null } };
      return { ...state, ui: { ...state.ui, saving: null, toast: { planId: t.planId, kind: 'undone', previous: null, line: null, ...(t.op ? { op: t.op } : {}) } } };
    }
    // ---- the lock, the unlock and a new version of the document (road-to-7.md step 6): one write each, the effect runs it ----
    case A.PLAN_LOCK:
    case A.PLAN_UNLOCK:
    case A.PLAN_DOCUMENT: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse(action.type + ': needs a plan id');
      if (state.ui.saving) return state;
      const kind = action.type === A.PLAN_LOCK ? 'lock' : action.type === A.PLAN_UNLOCK ? 'unlock' : 'document';
      // the confirm step closes with the press
      const open = state.ui.open.filter((id) => !['lockConfirm', 'unlockConfirm', 'documentConfirm'].includes(id));
      return { ...state, ui: { ...state.ui, open, saving: { planId, kind }, saveProblem: null, toast: null } };
    }
    case A.PLAN_TOAST_CLOSE:
      return state.ui.toast === null ? state : { ...state, ui: { ...state.ui, toast: null } };

    // ---- "Does it last?": the one test's result, page memory only (research/v7/editing-in-v7.md 10.4) ------------------
    case A.LASTS_WORKING: {
      if (typeof action.key !== 'string' || !action.key) return refuse('lasts/working: needs a key');
      const L = state.lasts || emptyLasts();
      // the old result stays (greyed on the screen) while the new run is under way for another key; the levers tried on the
      // old plan go (they were its), the work lever's boxes stay as typed; so does a tried change (its figures were the old plan's)
      const same = L.key === action.key;
      return { ...state, lasts: { ...L, key: action.key, status: 'working', reason: null, progress: null, slow: false, levers: same ? L.levers || {} : {}, tried: same ? L.tried || null : null } };
    }
    // ---- Try a change on a plan (research/v7/way-and-mix.md 4): one try at a time, on the run held; "Use this"; the copy kept ----
    case A.TRY_RUN: {
      const L = state.lasts || emptyLasts();
      if (!action.boxes || typeof action.boxes !== 'object') return refuse('lasts/tryRun: needs the boxes');
      if (!L.key || L.status !== 'done') return state;                                                                   // never before the plan's own test is held
      if (L.tried && L.tried.status === 'working' && JSON.stringify(L.tried.boxes) === JSON.stringify(action.boxes)) return state;
      return { ...state, lasts: { ...L, tried: { status: 'working', boxes: action.boxes, result: null, ms: null, reason: null } }, ui: { ...state.ui, open: state.ui.open.filter((x) => x !== 'tryConfirm') } };
    }
    case A.TRY_DONE: {
      const L = state.lasts || emptyLasts();
      const t = L.tried;
      if (action.key !== L.key || !t || t.status !== 'working' || JSON.stringify(action.boxes) !== JSON.stringify(t.boxes)) return state;   // stale
      if (!action.result || typeof action.result !== 'object') return refuse('lasts/tryDone: needs a result');
      return { ...state, lasts: { ...L, tried: { ...t, status: 'done', result: action.result, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null } } };
    }
    case A.TRY_FAILED: {
      const L = state.lasts || emptyLasts();
      const t = L.tried;
      if (action.key !== L.key || !t || t.status !== 'working' || JSON.stringify(action.boxes) !== JSON.stringify(t.boxes)) return state;   // stale
      return { ...state, lasts: { ...L, tried: { ...t, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null } } };
    }
    case A.TRY_CLOSE: {
      const L = state.lasts || emptyLasts();
      if (!L.tried && !state.ui.open.includes('tryConfirm')) return state;
      return { ...state, lasts: { ...L, tried: null }, ui: { ...state.ui, open: state.ui.open.filter((x) => x !== 'tryConfirm') } };
    }
    case A.PLAN_TRY:
    case A.TRY_KEEP: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse(action.type + ': needs a plan id');
      if (state.ui.saving) return state;
      const L = state.lasts || emptyLasts();
      if (!L.tried || L.tried.status !== 'done') return state;                                                             // only a try that ran
      const kind = action.type === A.PLAN_TRY ? 'try' : 'tryKeep';
      return { ...state, ui: { ...state.ui, open: state.ui.open.filter((x) => x !== 'tryConfirm'), saving: { planId, kind }, saveProblem: null, toast: null } };
    }
    case A.TRY_KEPT: {
      const kept = cleanKept(action);
      if (!kept) return refuse('lasts/tryKept: needs an id, a name and where');
      const L = state.lasts || emptyLasts();
      return { ...state, lasts: { ...L, kept }, ui: { ...state.ui, saving: null, saveProblem: null } };
    }
    // ---- the three levers of "Does it last?" (research/v7/answer-D.md 3.9; road-to-7.md step 7): try only, nothing kept ----
    case A.LEVER_TYPE: {
      if (action.field !== 'yearly' && action.field !== 'years') return refuse('lasts/leverType: the field is yearly or years');
      const L = state.lasts || emptyLasts();
      const value = typeof action.value === 'string' ? action.value : action.value == null ? '' : String(action.value);
      const workDraft = { ...(L.workDraft || { yearly: '', years: '' }), [action.field]: value };
      // a change of the figures puts the work lever's last try away (its figures were for other figures): the boxes stay open
      const levers = { ...(L.levers || {}) };
      if (levers.work && levers.work.status !== 'working') levers.work = { status: 'open', lever: { kind: 'work' }, result: null, reason: null };
      return { ...state, lasts: { ...L, workDraft, levers } };
    }
    case A.LEVER_TRY: {
      if (!LEVER_KINDS.includes(action.kind)) return refuse(`lasts/leverTry: no lever called "${action.kind}"`);
      const L = state.lasts || emptyLasts();
      // a lever is tried on the plan whose one test is held: never before it is, never on a stale one
      if (!L.key || L.status !== 'done') return state;
      const levers = { ...(L.levers || {}) };
      if (levers[action.kind] && levers[action.kind].status === 'working') return state;
      let lever = { kind: action.kind };
      if (action.kind === 'work') {
        // the first press opens the two boxes; the next tries what is typed in them
        if (!levers.work) { levers.work = { status: 'open', lever, result: null, reason: null }; return { ...state, lasts: { ...L, levers } }; }
        const d = L.workDraft || { yearly: '', years: '' };
        const yearly = typedNumber(d.yearly);
        const years = typedNumber(d.years);
        const okYearly = yearly !== null && yearly >= 1 && yearly <= 200000;
        const okYears = years !== null && Number.isInteger(years) && years >= 1 && years <= 5;
        if (!okYearly || !okYears) { levers.work = { status: 'invalid', lever, result: null, reason: !okYearly ? 'yearly' : 'years' }; return { ...state, lasts: { ...L, levers } }; }
        lever = { kind: 'work', yearly, years };
      }
      levers[action.kind] = { status: 'working', lever, result: null, reason: null };
      return { ...state, lasts: { ...L, levers } };
    }
    case A.LEVER_DONE: {
      const L = state.lasts || emptyLasts();
      const x = L.levers && L.levers[action.kind];
      if (action.key !== L.key || !x || x.status !== 'working') return state;                                            // stale
      if (!action.result || typeof action.result !== 'object') return refuse('lasts/leverDone: needs a result');
      return { ...state, lasts: { ...L, levers: { ...L.levers, [action.kind]: { ...x, status: 'done', result: action.result } } } };
    }
    case A.LEVER_FAILED: {
      const L = state.lasts || emptyLasts();
      const x = L.levers && L.levers[action.kind];
      if (action.key !== L.key || !x || x.status !== 'working') return state;                                            // stale
      return { ...state, lasts: { ...L, levers: { ...L.levers, [action.kind]: { ...x, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null } } } };
    }
    case A.LEVER_CLOSE: {
      const L = state.lasts || emptyLasts();
      if (!L.levers || !L.levers[action.kind]) return state;
      const levers = { ...L.levers };
      delete levers[action.kind];
      return { ...state, lasts: { ...L, levers } };
    }
    case A.LASTS_PROGRESS: {
      const L = state.lasts || emptyLasts();
      if (action.key !== L.key || L.status !== 'working') return state;
      return { ...state, lasts: { ...L, progress: { done: Number(action.done) || 0, total: Number(action.total) || 0 } } };
    }
    case A.LASTS_DONE: {
      const L = state.lasts || emptyLasts();
      if (action.key !== L.key || L.status !== 'working') return state;                                                   // stale
      if (!action.result || typeof action.result !== 'object') return refuse('lasts/done: needs a result');
      return { ...state, lasts: { ...L, status: 'done', result: action.result, progress: null, slow: false } };
    }
    case A.LASTS_FAILED: {
      const L = state.lasts || emptyLasts();
      if (action.key !== L.key || L.status !== 'working') return state;                                                   // stale
      // 'noWorker': this browser cannot start a worker, and the test runs nowhere else in the preview (the screen offers the planner)
      return { ...state, lasts: { ...L, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null, progress: null, slow: false } };
    }
    case A.LASTS_SLOW: {
      const L = state.lasts || emptyLasts();
      if (action.key !== L.key || L.status !== 'working' || L.slow) return state;
      return { ...state, lasts: { ...L, slow: true } };
    }
    case A.LASTS_RETRY: {
      const L = state.lasts || emptyLasts();
      if (L.status !== 'failed') return state;
      return { ...state, lasts: { ...L, status: 'idle' } };
    }

    // ---- "How the money is taken": the nine ways on a saved plan, page memory only (research/v7/way-and-mix.md 2.2) ----------
    case A.WAYS_WORKING: {
      if (typeof action.key !== 'string' || !action.key) return refuse('ways/working: needs a key');
      const W = state.ways || emptyWays();
      // another plan, or the plan saved under the run: the old cards, dials and tries go (they were the old plan's); the same key: a retry
      const same = W.key === action.key;
      return { ...state, ways: { ...(same ? W : emptyWays()), key: action.key, status: 'working', reason: null, result: same ? W.result : null, progress: null, slow: false, ran: same ? W.ran : null } };
    }
    case A.WAYS_PROGRESS: {
      const W = state.ways || emptyWays();
      if (action.key !== W.key || W.status !== 'working') return state;
      return { ...state, ways: { ...W, progress: { done: Number(action.done) || 0, total: Number(action.total) || 0 } } };
    }
    case A.WAYS_DONE: {
      const W = state.ways || emptyWays();
      if (action.key !== W.key || W.status !== 'working') return state;                                                   // stale
      if (!action.result || typeof action.result !== 'object' || !Array.isArray(action.result.ways)) return refuse('ways/done: needs a result');
      const runs = action.result.ways.length;
      return { ...state, ways: { ...W, status: 'done', result: action.result, progress: null, slow: false, ran: { runs, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null } } };
    }
    case A.WAYS_FAILED: {
      const W = state.ways || emptyWays();
      if (action.key !== W.key || W.status !== 'working') return state;                                                   // stale
      return { ...state, ways: { ...W, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null, progress: null, slow: false } };
    }
    case A.WAYS_SLOW: {
      const W = state.ways || emptyWays();
      if (action.key !== W.key || W.status !== 'working' || W.slow) return state;
      return { ...state, ways: { ...W, slow: true } };
    }
    case A.WAYS_RETRY: {
      const W = state.ways || emptyWays();
      if (W.status !== 'failed') return state;
      return { ...state, ways: { ...W, status: 'idle' } };
    }
    case A.WAY_OPEN: {
      const id = action.id == null ? null : String(action.id);
      if (id !== null && !WAY_IDS.includes(id)) return refuse(`ways/open: no way called "${id}"`);
      const W = state.ways || emptyWays();
      if (W.open === id) return state;
      // one card open at a time: the card closed puts its try away (its tried figures were for its dials as they were)
      const tried = { ...(W.tried || {}) };
      if (W.open !== null && W.open !== undefined) delete tried[W.open];
      return { ...state, ways: { ...W, open: id, tried } };
    }
    case A.WAY_DIAL: {
      const { id, key } = action;
      if (!WAY_IDS.includes(id)) return refuse(`ways/dial: no way called "${id}"`);
      if (typeof key !== 'string' || !key) return refuse('ways/dial: needs a dial');
      const W = state.ways || emptyWays();
      const value = typeof action.value === 'string' ? action.value : action.value == null ? '' : String(action.value);
      const mine = { ...((W.dials || {})[id] || {}), [key]: value };
      // a dial moved: the card's last try was for other values — it stays shown, greyed, until the new try comes
      return { ...state, ways: { ...W, dials: { ...(W.dials || {}), [id]: mine } } };
    }
    case A.WAY_TRY: {
      const { id, values } = action;
      if (!WAY_IDS.includes(id)) return refuse(`ways/try: no way called "${id}"`);
      if (!values || typeof values !== 'object') return refuse('ways/try: needs the values');
      const W = state.ways || emptyWays();
      if (!W.key || W.status !== 'done') return state;                                                                    // never before the nine are held
      return { ...state, ways: { ...W, tried: { ...(W.tried || {}), [id]: { status: 'working', values, result: null, reason: null, ms: null } } } };
    }
    case A.WAY_TRIED: {
      const W = state.ways || emptyWays();
      const t = W.tried && W.tried[action.id];
      if (action.key !== W.key || !t || t.status !== 'working' || JSON.stringify(action.values) !== JSON.stringify(t.values)) return state;   // stale
      if (!action.result || typeof action.result !== 'object') return refuse('ways/tried: needs a result');
      return { ...state, ways: { ...W, tried: { ...W.tried, [action.id]: { ...t, status: 'done', result: action.result, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null } } } };
    }
    case A.WAY_TRY_FAILED: {
      const W = state.ways || emptyWays();
      const t = W.tried && W.tried[action.id];
      if (action.key !== W.key || !t || t.status !== 'working' || JSON.stringify(action.values) !== JSON.stringify(t.values)) return state;   // stale
      return { ...state, ways: { ...W, tried: { ...W.tried, [action.id]: { ...t, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null } } } };
    }
    case A.WAY_RANK: {
      if (!RANK_BYS.includes(action.by)) return refuse(`ways/rankBy: no order called "${action.by}"`);
      const W = state.ways || emptyWays();
      if (W.rankBy === action.by) return state;
      return { ...state, ways: { ...W, rankBy: action.by } };
    }
    case A.PLAN_WAY: {
      const { planId, id } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/useWay: needs a plan id');
      if (!WAY_IDS.includes(id)) return refuse(`plan/useWay: no way called "${id}"`);
      if (state.ui.saving) return state;
      const open = state.ui.open.filter((x) => x !== 'wayConfirm');
      return { ...state, ui: { ...state.ui, open, saving: { planId, kind: 'way', way: id }, saveProblem: null, toast: null } };
    }

    // ---- "The mix": the sleeve's and the tent's try, the eight cells, the cell picked — page memory only (way-and-mix.md 3.2) ----
    case A.MIX_TRY: {
      if (typeof action.key !== 'string' || !action.key) return refuse('mix/try: needs a key');
      if (!MIX_TRY_KINDS.includes(action.kind)) return refuse(`mix/try: no try called "${action.kind}"`);
      const M = state.mix || emptyMix();
      // another plan, or the plan saved under the runs: the old tries, the comparison and the pick go (they were the old plan's)
      const base = M.key === action.key ? M : emptyMix();
      const cur = base.tries[action.kind];
      if (cur && cur.status === 'working') return state;
      return { ...state, mix: { ...base, key: action.key, tries: { ...base.tries, [action.kind]: { status: 'working', result: null, ms: null, reason: null } } } };
    }
    case A.MIX_TRIED: {
      const M = state.mix || emptyMix();
      const t = M.tries[action.kind];
      if (action.key !== M.key || !t || t.status !== 'working') return state;                                            // stale
      if (!action.result || typeof action.result !== 'object') return refuse('mix/tried: needs a result');
      return { ...state, mix: { ...M, tries: { ...M.tries, [action.kind]: { ...t, status: 'done', result: action.result, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null } } } };
    }
    case A.MIX_TRY_FAILED: {
      const M = state.mix || emptyMix();
      const t = M.tries[action.kind];
      if (action.key !== M.key || !t || t.status !== 'working') return state;                                            // stale
      return { ...state, mix: { ...M, tries: { ...M.tries, [action.kind]: { ...t, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null } } } };
    }
    case A.MIX_TRY_CLOSE: {
      const M = state.mix || emptyMix();
      if (!M.tries[action.kind]) return state;
      const tries = { ...M.tries };
      delete tries[action.kind];
      return { ...state, mix: { ...M, tries } };
    }
    case A.MIX_COMPARE: {
      if (typeof action.key !== 'string' || !action.key) return refuse('mix/compare: needs a key');
      const M = state.mix || emptyMix();
      const base = M.key === action.key ? M : emptyMix();
      if (base.compare.status === 'working') return state;
      return { ...state, mix: { ...base, key: action.key, compare: { status: 'working', result: null, ms: null, progress: null, reason: null }, pick: null } };
    }
    case A.MIX_COMPARE_PROGRESS: {
      const M = state.mix || emptyMix();
      if (action.key !== M.key || M.compare.status !== 'working') return state;
      return { ...state, mix: { ...M, compare: { ...M.compare, progress: { done: Number(action.done) || 0, total: Number(action.total) || 0 } } } };
    }
    case A.MIX_COMPARED: {
      const M = state.mix || emptyMix();
      if (action.key !== M.key || M.compare.status !== 'working') return state;                                          // stale
      if (!action.result || typeof action.result !== 'object' || !Array.isArray(action.result.cells)) return refuse('mix/compared: needs a result');
      return { ...state, mix: { ...M, compare: { status: 'done', result: action.result, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null, progress: null, reason: null } } };
    }
    case A.MIX_COMPARE_FAILED: {
      const M = state.mix || emptyMix();
      if (action.key !== M.key || M.compare.status !== 'working') return state;                                          // stale
      return { ...state, mix: { ...M, compare: { status: 'failed', result: null, ms: null, progress: null, reason: action.reason === 'noWorker' ? 'noWorker' : null } } };
    }
    case A.MIX_PICK: {
      const M = state.mix || emptyMix();
      const cell = action.cell == null ? null : cleanCell(action.cell);
      if (action.cell != null && !cell) return refuse('mix/pick: not a cell');
      if (JSON.stringify(M.pick) === JSON.stringify(cell)) return state;
      if (cell && M.compare.status !== 'done') return state;                                                               // only a cell that ran
      return { ...state, mix: { ...M, pick: cell } };
    }
    case A.PLAN_MIX: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/useMix: needs a plan id');
      const cell = cleanCell(action.cell);
      if (!cell) return refuse('plan/useMix: not a cell');
      if (state.ui.saving) return state;
      const M = state.mix || emptyMix();
      return { ...state, mix: { ...M, pick: null }, ui: { ...state.ui, saving: { planId, kind: 'mix', cell }, saveProblem: null, toast: null } };
    }

    // ---- "Your household": the pooled run, the survivor and care questions, the confirms — page memory only (road-to-7.md step 9) ----
    case A.HH_RUN: {
      if (typeof action.key !== 'string' || !action.key) return refuse('household/run: needs a key');
      const limit = action.limit && typeof action.limit === 'object' ? action.limit : null;
      const H = state.household || emptyHousehold();
      // another pair, or a plan saved under the runs: the old run, the survivor's and the care's go (they were the old plans')
      const base = H.key === action.key ? H : emptyHousehold();
      if (base.status === 'working' && JSON.stringify(base.limit) === JSON.stringify(limit)) return state;
      return { ...state, household: { ...base, key: action.key, status: 'working', limit, reason: null, result: null, progress: null, ms: null, pick: null } };
    }
    case A.HH_PROGRESS: {
      const H = state.household || emptyHousehold();
      if (action.key !== H.key || H.status !== 'working') return state;
      return { ...state, household: { ...H, progress: { done: Number(action.done) || 0, total: Number(action.total) || 0 } } };
    }
    case A.HH_DONE: {
      const H = state.household || emptyHousehold();
      if (action.key !== H.key || H.status !== 'working' || JSON.stringify(action.limit || null) !== JSON.stringify(H.limit)) return state;   // stale
      if (!action.result || typeof action.result !== 'object') return refuse('household/done: needs a result');
      return { ...state, household: { ...H, status: 'done', result: action.result, progress: null, reason: null, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null } };
    }
    case A.HH_FAILED: {
      const H = state.household || emptyHousehold();
      if (action.key !== H.key || H.status !== 'working' || JSON.stringify(action.limit || null) !== JSON.stringify(H.limit)) return state;   // stale
      return { ...state, household: { ...H, status: 'failed', result: null, progress: null, reason: action.reason === 'noWorker' ? 'noWorker' : null } };
    }
    case A.HH_SURVIVOR:
    case A.HH_CARE: {
      const what = action.type === A.HH_SURVIVOR ? 'survivor' : 'care';
      if (typeof action.key !== 'string' || !action.key) return refuse(action.type + ': needs a key');
      if (!action.boxes || typeof action.boxes !== 'object') return refuse(action.type + ': needs the boxes');
      const H = state.household || emptyHousehold();
      const base = H.key === action.key ? H : { ...emptyHousehold(), key: action.key };
      const cur = base[what];
      if (cur && cur.status === 'working' && JSON.stringify(cur.boxes) === JSON.stringify(action.boxes)) return state;
      return { ...state, household: { ...base, [what]: { status: 'working', boxes: action.boxes, result: null, ms: null, reason: null } } };
    }
    case A.HH_SURVIVOR_DONE:
    case A.HH_CARE_DONE: {
      const what = action.type === A.HH_SURVIVOR_DONE ? 'survivor' : 'care';
      const H = state.household || emptyHousehold();
      const t = H[what];
      if (action.key !== H.key || !t || t.status !== 'working' || JSON.stringify(action.boxes) !== JSON.stringify(t.boxes)) return state;   // stale
      if (!action.result || typeof action.result !== 'object') return refuse(action.type + ': needs a result');
      return { ...state, household: { ...H, [what]: { ...t, status: 'done', result: action.result, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null } } };
    }
    case A.HH_SURVIVOR_FAILED:
    case A.HH_CARE_FAILED: {
      const what = action.type === A.HH_SURVIVOR_FAILED ? 'survivor' : 'care';
      const H = state.household || emptyHousehold();
      const t = H[what];
      if (action.key !== H.key || !t || t.status !== 'working' || JSON.stringify(action.boxes) !== JSON.stringify(t.boxes)) return state;   // stale
      return { ...state, household: { ...H, [what]: { ...t, status: 'failed', reason: action.reason === 'noWorker' ? 'noWorker' : null } } };
    }
    case A.HH_CLOSE: {
      const H = state.household || emptyHousehold();
      if (action.what !== 'survivor' && action.what !== 'care') return refuse('household/close: survivor or care');
      if (!H[action.what]) return state;
      return { ...state, household: { ...H, [action.what]: null } };
    }
    case A.HH_PICK: {
      const H = state.household || emptyHousehold();
      const what = action.what == null ? null : action.what;
      if (what !== null && !HH_PICKS.includes(what)) return refuse(`household/pick: no confirm called "${what}"`);
      if (H.pick === what) return state;
      if (what === 'split' && H.status !== 'done') return state;                                                           // only a split that ran
      return { ...state, household: { ...H, pick: what } };
    }

    // ---- "What you hold" and "Moving to your plan's mix" (research/v7/holdings-and-move.md §2.2, §3.3, §3.5; road-to-7.md step 10) ----
    case A.PLAN_HOLD: {
      const { planId, change } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/hold: needs a plan id');
      if (!change || typeof change !== 'object' || !['add', 'edit', 'remove', 'paste'].includes(change.kind)) return refuse('plan/hold: needs a change (add, edit, remove or paste)');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId, kind: 'hold', change }, saveProblem: null, toast: null } };
    }
    case A.PLAN_TICK: {
      const { planId, key } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/tick: needs a plan id');
      if (typeof key !== 'string' || !key) return refuse('plan/tick: needs the move\'s key');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId, kind: 'tick', key, done: action.done !== false }, saveProblem: null, toast: null } };
    }
    case A.MOVE_RUN: {
      if (typeof action.key !== 'string' || !action.key) return refuse('move/run: needs a key');
      const Mv = state.move || emptyMove();
      if (Mv.key === action.key && Mv.status === 'working') return state;
      return { ...state, move: { ...Mv, key: action.key, status: 'working', result: null, ms: null, reason: null } };
    }
    case A.MOVE_DONE: {
      const Mv = state.move || emptyMove();
      if (action.key !== Mv.key || Mv.status !== 'working') return state;   // stale
      if (!action.result || typeof action.result !== 'object') return refuse('move/done: needs a result');
      return { ...state, move: { ...Mv, status: 'done', result: action.result, ms: Number.isFinite(action.ms) ? Math.max(0, Math.round(action.ms)) : null, reason: null } };
    }
    case A.MOVE_FAILED: {
      const Mv = state.move || emptyMove();
      if (action.key !== Mv.key || Mv.status !== 'working') return state;   // stale
      return { ...state, move: { ...Mv, status: 'failed', result: null, reason: action.reason === 'noWorker' ? 'noWorker' : null } };
    }
    case A.MOVE_INDEX: {
      const Mv = state.move || emptyMove();
      const index = cleanIndex(action.index);
      if (JSON.stringify(index) === JSON.stringify(Mv.index)) return state;
      return { ...state, move: { ...Mv, index } };
    }
    case A.PLAN_LINK: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/linkPartner: needs a plan id');
      const partnerId = action.partnerId == null ? null : String(action.partnerId);
      if (partnerId !== null && !PLAN_ID.test(partnerId)) return refuse('plan/linkPartner: not a plan id');
      if (state.ui.saving) return state;
      const H = state.household || emptyHousehold();
      return { ...state, household: { ...H, pick: null }, ui: { ...state.ui, saving: { planId, kind: 'link', partnerId }, saveProblem: null, toast: null } };
    }
    case A.PLAN_SPLIT: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/useSplit: needs a plan id');
      if (state.ui.saving) return state;
      const H = state.household || emptyHousehold();
      return { ...state, household: { ...H, pick: null }, ui: { ...state.ui, saving: { planId, kind: 'split' }, saveProblem: null, toast: null } };
    }
    case A.PLAN_DISMISS: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/keepAsIs: needs a plan id');
      if (state.ui.saving) return state;
      const H = state.household || emptyHousehold();
      return { ...state, household: { ...H, pick: null }, ui: { ...state.ui, saving: { planId, kind: 'dismiss', dismiss: action.dismiss !== false }, saveProblem: null, toast: null } };
    }
    case A.PLAN_BUDGET_SHARE: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/shareBudget: needs a plan id');
      if (state.ui.saving) return state;
      const H = state.household || emptyHousehold();
      return { ...state, household: { ...H, pick: null }, ui: { ...state.ui, saving: { planId, kind: 'budgetShare', share: action.share !== false }, saveProblem: null, toast: null } };
    }
    case A.SPLIT_KEPT: {
      const ids = action.ids && typeof action.ids === 'object' ? action.ids : null;
      const names = action.names && typeof action.names === 'object' ? action.names : null;
      if (!ids || !names || typeof ids.a !== 'string' || typeof ids.b !== 'string' || !PLAN_ID.test(ids.a) || !PLAN_ID.test(ids.b) || typeof names.a !== 'string' || typeof names.b !== 'string' || !KEEP_WHERES.includes(action.where)) return refuse('household/splitKept: needs two ids, two names and where');
      const H = state.household || emptyHousehold();
      return { ...state, household: { ...H, kept: { ids: { a: ids.a, b: ids.b }, names: { a: names.a, b: names.b }, where: action.where } }, ui: { ...state.ui, saving: null, saveProblem: null } };
    }

    case A.ENV_SET: {
      // Start-up and the test hook only. The date, the last month of market history and the version; never the build.
      const patch = action.patch || {};
      const env = { ...state.env };
      if ('today' in patch) {
        if (typeof patch.today !== 'string' || !DATE.test(patch.today)) return refuse('env/set: today must be YYYY-MM-DD');
        env.today = patch.today;
      }
      if ('historyEnd' in patch) {
        if (patch.historyEnd !== null && !(typeof patch.historyEnd === 'string' && MONTH.test(patch.historyEnd))) return refuse('env/set: historyEnd must be YYYY-MM or null');
        env.historyEnd = patch.historyEnd;
      }
      if (typeof patch.appVersion === 'string' && patch.appVersion) env.appVersion = patch.appVersion;
      if (env.today === state.env.today && env.historyEnd === state.env.historyEnd && env.appVersion === state.env.appVersion) return state;
      return { ...state, env };
    }

    // ---- the budget sheet: never a draft, never a figure ------------------------------------------------------
    case A.BUDGET_LINE:
    case A.BUDGET_ADD:
    case A.BUDGET_REMOVE:
    case A.BUDGET_ONE_OFF:
    case A.BUDGET_ADD_ONE_OFF:
    case A.BUDGET_REMOVE_ONE_OFF:
    case A.BUDGET_TOUCH: {
      const sheet = budgetReduce(state.budget || null, action);
      return sheet === (state.budget || null) ? state : { ...state, budget: sheet };
    }

    // ---- "Keep this as a plan" (road-to-7.md step 7: the one write file makes the plan) --------------------------
    case A.KEEP_NAME: {
      if (!draft) return refuse(`keep/name: no question "${q}"`);
      const k = keepOf(state, q);
      const name = typeof action.value === 'string' ? action.value.slice(0, 200) : '';
      return k.name === name && k.problem === null ? state : withKeep(state, q, { ...k, name, problem: null });
    }
    case A.KEEP_SAVE: {
      if (!draft) return refuse(`keep/save: no question "${q}"`);
      const k = keepOf(state, q);
      if (k.saving) return state;
      const view = keepView(state, q);
      if (!view.can) return withKeep(state, q, { ...k, problem: 'notReady' });
      if (!view.check.ok) return withKeep(state, q, { ...k, problem: view.check.problem });
      return withKeep(state, q, { ...k, saving: true, problem: null });
    }
    case A.KEEP_MADE: {
      // The one write file made the plan (effects/planWrite.js): in the account, or in this window. The box goes back to
      // following the answer: the next try gets its own name ("Try something else and keep that too").
      if (!draft) return refuse(`keep/made: no question "${q}"`);
      const made = cleanMade(action);
      if (!made) return refuse('keep/made: needs an id, a name and where');
      return withKeep(state, q, { ...keepOf(state, q), name: null, saving: false, problem: null, partnerKept: null, made });
    }
    case A.KEEP_FAILED: {
      if (!draft) return refuse(`keep/failed: no question "${q}"`);
      const problem = KEEP_PROBLEMS.includes(action.problem) ? action.problem : 'failed';
      // a couple whose partner's plan was made but not yours: the name it was kept under, for the sentence
      const partnerKept = problem === 'partial' && typeof action.name === 'string' ? action.name.slice(0, 200) : null;
      return withKeep(state, q, { ...keepOf(state, q), saving: false, problem, partnerKept });
    }

    case A.SHAPE_STEP:
    case A.SHAPE_TOUCH:
    case A.SHAPE_ADD:
    case A.SHAPE_REMOVE:
    case A.SHAPE_SORT:
    case A.SHAPE_SUGGEST:
    case A.SHAPE_PRESET:
    case A.SHAPE_UNDO:
    case A.SHAPE_RESCALE:
      return shapeReduce(state, action, refuse);

    case A.STATE_REPLACE: {
      // The test hook only: draws any named state. Refused in the published build.
      if (state.env.build !== 'test') return state;
      const s = action.state;
      const ok = s && s.route && s.env && typeof s.env.today === 'string' && DATE.test(s.env.today) && s.draft && s.draft.c && s.answers && s.answers.c && s.ui;
      if (!ok) return refuse('state/replace: not a V7 state');
      const copy = JSON.parse(JSON.stringify(s));
      // Every question open here gets its draft and answer, in its own shape; one the state handed in leaves out is empty.
      const drafts = { plan: keptPlanDraft(copy.draft) };   // the plan draft has its own shape (editing-in-v7.md 4)
      const answers = {};
      for (const id of Object.keys(state.draft).filter((k) => k !== 'plan')) {
        const d = copy.draft[id] && typeof copy.draft[id] === 'object' ? copy.draft[id] : {};
        drafts[id] = { ...emptyDraftFor(id), ...d, revealed: Array.isArray(d.revealed) ? d.revealed : [] };
        if ('spendHow' in drafts[id]) {
          drafts[id].spendHow = ['lines', 'one'].includes(drafts[id].spendHow) ? drafts[id].spendHow : null;
          drafts[id].skipNoted = drafts[id].skipNoted === true;
        }
        const a = copy.answers[id] && typeof copy.answers[id] === 'object' ? copy.answers[id] : {};
        answers[id] = { ...emptyAnswerFor(id), ...a };
      }
      // "Keep this as a plan": the name and the last plan made as draftStore would keep them, and a problem.
      const keep = {};
      for (const id of Object.keys(state.draft).filter((k) => k !== 'plan')) {
        const k = copy.keep && typeof copy.keep === 'object' ? copy.keep[id] : null;
        keep[id] = { ...keptKeep(copy.keep, id), problem: k && KEEP_PROBLEMS.includes(k.problem) ? k.problem : null };
      }
      return {
        route: tidyRoute(copy.route),
        env: { today: copy.env.today, build: 'test', appVersion: typeof copy.env.appVersion === 'string' ? copy.env.appVersion : state.env.appVersion,
               historyEnd: typeof copy.env.historyEnd === 'string' ? copy.env.historyEnd : null },
        session: copy.session && SESSION_KINDS.includes(copy.session.kind) ? { kind: copy.session.kind, email: typeof copy.session.email === 'string' ? copy.session.email : null, signingOut: false } : { kind: 'none', email: null, signingOut: false },
        plan: null,                                  // reserved
        // a named plan state holds its plans (page memory, as the source would have handed them in)
        plans: copy.plans && Array.isArray(copy.plans.list) ? { status: ['reading', 'read', 'failed'].includes(copy.plans.status) ? copy.plans.status : 'read', source: copy.plans.source === 'window' ? 'window' : 'account', readAt: typeof copy.plans.readAt === 'string' ? copy.plans.readAt : null,
          list: copy.plans.list.filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null).map((e) => ({ plan: e.plan, newer: !!e.newer, failed: !!e.failed })), usedUp: copy.plans.usedUp === true,
          ...(copy.plans.view && Array.isArray(copy.plans.view.rows) ? { view: { today: String(copy.plans.view.today), rows: copy.plans.view.rows, page: copy.plans.view.page || null } } : {}) } : null,
        draft: drafts,
        answers,
        budget: cleanSheet(copy.budget),
        keep,
        // a named plan state may carry the one test's result for its plan (editing-in-v7.md 10): a key with a plain result
        lasts: copy.lasts && typeof copy.lasts === 'object' && typeof copy.lasts.key === 'string' && ['working', 'done', 'failed'].includes(copy.lasts.status)
          ? { key: copy.lasts.key, status: copy.lasts.status, reason: copy.lasts.reason === 'noWorker' ? 'noWorker' : null, result: copy.lasts.result && typeof copy.lasts.result === 'object' ? copy.lasts.result : null, progress: copy.lasts.progress && typeof copy.lasts.progress === 'object' ? { done: Number(copy.lasts.progress.done) || 0, total: Number(copy.lasts.progress.total) || 0 } : null, slow: copy.lasts.slow === true,
            // the levers tried (road-to-7.md step 7), each cleaned; the work lever's boxes as typed
            levers: Object.fromEntries(LEVER_KINDS.map((k) => [k, cleanLever(copy.lasts.levers && copy.lasts.levers[k])]).filter(([, v]) => v)),
            workDraft: { yearly: copy.lasts.workDraft && typeof copy.lasts.workDraft.yearly === 'string' ? copy.lasts.workDraft.yearly : '', years: copy.lasts.workDraft && typeof copy.lasts.workDraft.years === 'string' ? copy.lasts.workDraft.years : '' },
            // a tried change and the copy it was kept as (way-and-mix.md 4), each cleaned
            tried: cleanTriedChange(copy.lasts.tried), kept: cleanKept(copy.lasts.kept) }
          : emptyLasts(),
        // a named plan state may carry the mix's tries and comparison for its plan (way-and-mix.md 3.2): a key, each cleaned
        mix: copy.mix && typeof copy.mix === 'object' && typeof copy.mix.key === 'string'
          ? { key: copy.mix.key,
            tries: Object.fromEntries(MIX_TRY_KINDS.map((k) => [k, cleanMixTry(copy.mix.tries && copy.mix.tries[k])]).filter(([, v]) => v)),
            compare: copy.mix.compare && typeof copy.mix.compare === 'object' && ['working', 'done', 'failed'].includes(copy.mix.compare.status)
              ? { status: copy.mix.compare.status, result: copy.mix.compare.status === 'done' && copy.mix.compare.result && typeof copy.mix.compare.result === 'object' && Array.isArray(copy.mix.compare.result.cells) ? copy.mix.compare.result : null, ms: Number.isFinite(copy.mix.compare.ms) ? copy.mix.compare.ms : null, progress: copy.mix.compare.progress && typeof copy.mix.compare.progress === 'object' ? { done: Number(copy.mix.compare.progress.done) || 0, total: Number(copy.mix.compare.progress.total) || 0 } : null, reason: copy.mix.compare.status === 'failed' && copy.mix.compare.reason === 'noWorker' ? 'noWorker' : null }
              : emptyMix().compare,
            pick: cleanCell(copy.mix.pick) }
          : emptyMix(),
        // a named plan state may carry the nine ways' result for its plan (way-and-mix.md 2.2): a key with a plain result, the cards' state
        // a named plan state may carry the household's runs for its pair (road-to-7.md step 9): a key, each cleaned
        household: copy.household && typeof copy.household === 'object' && typeof copy.household.key === 'string'
          ? { key: copy.household.key, status: ['working', 'done', 'failed'].includes(copy.household.status) ? copy.household.status : 'idle', limit: copy.household.limit && typeof copy.household.limit === 'object' ? copy.household.limit : null,
            reason: copy.household.status === 'failed' && copy.household.reason === 'noWorker' ? 'noWorker' : null, result: copy.household.status === 'done' && copy.household.result && typeof copy.household.result === 'object' ? copy.household.result : null,
            progress: copy.household.progress && typeof copy.household.progress === 'object' ? { done: Number(copy.household.progress.done) || 0, total: Number(copy.household.progress.total) || 0 } : null, ms: Number.isFinite(copy.household.ms) ? copy.household.ms : null,
            survivor: cleanHouseholdTry(copy.household.survivor), care: cleanHouseholdTry(copy.household.care), pick: HH_PICKS.includes(copy.household.pick) ? copy.household.pick : null,
            ...(copy.household.kept && typeof copy.household.kept === 'object' && copy.household.kept.ids && copy.household.kept.names && KEEP_WHERES.includes(copy.household.kept.where) ? { kept: { ids: { a: String(copy.household.kept.ids.a), b: String(copy.household.kept.ids.b) }, names: { a: String(copy.household.kept.names.a), b: String(copy.household.kept.names.b) }, where: copy.household.kept.where } } : {}) }
          : emptyHousehold(),
        // a named plan state may carry the one run on the held mix and the index the watch read (road-to-7.md step 10), cleaned
        move: cleanMove(copy.move),
        ways: copy.ways && typeof copy.ways === 'object' && typeof copy.ways.key === 'string' && ['working', 'done', 'failed'].includes(copy.ways.status)
          ? { key: copy.ways.key, status: copy.ways.status, reason: copy.ways.reason === 'noWorker' ? 'noWorker' : null, result: copy.ways.result && typeof copy.ways.result === 'object' && Array.isArray(copy.ways.result.ways) ? copy.ways.result : null,
            progress: copy.ways.progress && typeof copy.ways.progress === 'object' ? { done: Number(copy.ways.progress.done) || 0, total: Number(copy.ways.progress.total) || 0 } : null, slow: copy.ways.slow === true,
            ran: copy.ways.ran && typeof copy.ways.ran === 'object' ? { runs: Number(copy.ways.ran.runs) || 0, ms: Number.isFinite(copy.ways.ran.ms) ? copy.ways.ran.ms : null } : null,
            open: WAY_IDS.includes(copy.ways.open) ? copy.ways.open : null,
            dials: Object.fromEntries(Object.entries(copy.ways.dials && typeof copy.ways.dials === 'object' ? copy.ways.dials : {}).filter(([id, d]) => WAY_IDS.includes(id) && d && typeof d === 'object').map(([id, d]) => [id, Object.fromEntries(Object.entries(d).filter(([, v]) => typeof v === 'string'))])),
            tried: Object.fromEntries(Object.entries(copy.ways.tried && typeof copy.ways.tried === 'object' ? copy.ways.tried : {}).filter(([id]) => WAY_IDS.includes(id)).map(([id, t]) => [id, cleanTried(t)]).filter(([, t]) => t)),
            rankBy: RANK_BYS.includes(copy.ways.rankBy) ? copy.ways.rankBy : 'lasts' }
          : emptyWays(),
        ui: { railOpen: !!copy.ui.railOpen, open: Array.isArray(copy.ui.open) ? copy.ui.open.filter((id) => OPENABLE.includes(id)) : [], online: copy.ui.online !== false, leaving: null, leaveProblem: null, saving: null, saveProblem: null, toast: null,
          // the shell's own slices (road-to-7.md step 11) start empty: nothing under way, no box open, no pop-up
          ...emptyShellUi() }
      };
    }

    // ---- "Your plans": the plan menu (research/v7/road-to-7.md step 11) — each write is the one write file's; here only what is open and under way ----
    case A.PLAN_ACTION: {
      const { planId, kind } = action;
      if (kind === null || kind === undefined) return state.ui.action === null ? state : { ...state, ui: { ...state.ui, action: null } };
      if (typeof planId !== 'string' || !planId) return refuse('plan/action: needs a plan id');
      if (!PLAN_ACTION_KINDS.includes(kind)) return refuse(`plan/action: "${kind}" is not an action it knows`);
      const step = action.step === 2 ? 2 : 1;
      const text = kind === 'rename' ? (typeof action.text === 'string' ? action.text.slice(0, 200) : '') : '';
      return { ...state, ui: { ...state.ui, action: { planId, kind, step, text }, saveProblem: null } };
    }
    case A.PLAN_ACTION_TEXT: {
      const a = state.ui.action;
      if (!a || a.kind !== 'rename') return state;
      const value = typeof action.value === 'string' ? action.value.slice(0, 200) : '';
      return value === a.text ? state : { ...state, ui: { ...state.ui, action: { ...a, text: value }, saveProblem: null } };
    }
    case A.PLAN_RENAME: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/rename: needs a plan id');
      if (state.ui.saving) return state;
      const c = checkPlanName(typeof action.name === 'string' ? action.name : '');
      if (!c.ok) return { ...state, ui: { ...state.ui, saveProblem: { planId, problem: c.problem } } };
      return { ...state, ui: { ...state.ui, action: null, saving: { planId, kind: 'rename', name: c.name }, saveProblem: null, toast: null } };
    }
    case A.PLAN_COPY: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/copy: needs a plan id');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, action: null, saving: { planId, kind: 'copy', carry: action.carry === true }, saveProblem: null, toast: null } };
    }
    case A.PLAN_MAIN: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/makeMain: needs a plan id');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, action: null, saving: { planId, kind: 'main' }, saveProblem: null, toast: null } };
    }
    case A.PLAN_DELETE: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/delete: needs a plan id');
      if (state.ui.saving) return state;
      // only from the row's own confirm, open on this plan (plan/action 'delete'); a locked plan only from its second confirm
      const a = state.ui.action;
      if (!a || a.kind !== 'delete' || a.planId !== planId) return state;
      const entry = state.plans && Array.isArray(state.plans.list) ? state.plans.list.find((e) => e && e.plan && String(e.plan.id) === planId) : null;
      const locked = !!(entry && entry.plan.decisionTool && entry.plan.decisionTool.settings && entry.plan.decisionTool.settings.locked);
      if (locked && a.step !== 2) return state;
      return { ...state, ui: { ...state.ui, action: null, saving: { planId, kind: 'delete' }, saveProblem: null, toast: null } };
    }
    case A.PLAN_DOWNLOAD: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/download: needs a plan id');
      const n = state.ui.download ? state.ui.download.n + 1 : 1;
      return { ...state, ui: { ...state.ui, download: { planId, n } } };
    }
    // ---- the budget on a saved plan (research/v7/road-to-7.md step 11b): one change, the spreadsheet read, the download ----
    case A.PLAN_BUDGET: {
      const { planId, change } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/budget: needs a plan id');
      if (!change || typeof change !== 'object' || typeof change.kind !== 'string') return refuse('plan/budget: needs a change');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId, kind: 'budget', change }, saveProblem: null, toast: null } };
    }
    case A.PLAN_RECORD: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/record: needs a plan id');
      if (state.ui.saving) return state;
      const pd = planDraftOf(state);
      const base = pd.id === planId ? pd : { ...emptyPlanDraft(), id: planId };
      // the record's boxes are marked as left, so their problems show
      const touched = [...new Set([...base.touched, 'record.month', 'record.pension', 'record.isa', 'record.gia'])];
      return withPlanDraft({ ...state, ui: { ...state.ui, saving: { planId, kind: 'potRecord' }, saveProblem: null, toast: null } }, { ...base, touched });
    }
    case A.PLAN_BUDGET_FILE: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/budgetFile: needs a plan id');
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId, kind: 'budgetFile' }, saveProblem: null, toast: null } };
    }
    case A.PLAN_BUDGET_FILE_READ: {
      const { planId, text } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/budgetFileRead: needs a plan id');
      const ui = { ...state.ui, saving: null };
      if (typeof text !== 'string') return { ...state, ui: { ...ui, saveProblem: { planId, problem: 'badFile' } } };
      const pd = planDraftOf(state);
      const base = pd.id === planId ? pd : emptyPlanDraft();
      return withPlanDraft({ ...state, ui: { ...ui, saveProblem: null } }, { ...base, id: planId, values: { ...base.values, 'import.text': text } });
    }
    case A.PLAN_BUDGET_DOWNLOAD: {
      const { planId } = action;
      if (typeof planId !== 'string' || !planId) return refuse('plan/budgetDownload: needs a plan id');
      const n = state.ui.download ? state.ui.download.n + 1 : 1;
      return { ...state, ui: { ...state.ui, download: { planId, n, what: 'budget' } } };
    }
    case A.PLAN_OPEN_FILE:
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId: null, kind: 'open' }, saveProblem: null, toast: null } };
    case A.PLAN_EXAMPLE:
      if (state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, saving: { planId: null, kind: 'example' }, saveProblem: null, toast: null } };
    case A.PLAN_ACTION_DONE: {
      const { op } = action;
      if (!PLAN_ACTION_OPS.includes(op)) return refuse(`plan/actionDone: "${op}" is not an action it knows`);
      const planId = typeof action.planId === 'string' && action.planId ? action.planId : null;
      const slots = action.slots && typeof action.slots === 'object' ? Object.fromEntries(Object.entries(action.slots).filter(([, v]) => typeof v === 'string' || typeof v === 'number')) : {};
      const bringIn = op === 'brought' ? null : state.ui.bringIn;
      return { ...state, ui: { ...state.ui, action: null, saving: null, saveProblem: null, bringIn, toast: { planId, kind: 'done', previous: null, line: null, op, slots } } };
    }

    // ---- the visitor without an account (road-to-7.md step 11): the meter, the reminders, the stop, the hand-over ----
    case A.GUEST_TICK: {
      const g = state.ui.guest || emptyGuest();
      const minutes = typeof action.minutes === 'number' && Number.isFinite(action.minutes) && action.minutes >= 0 ? action.minutes : g.minutes;
      const usedUp = action.usedUp === true;
      const nag = action.nag === undefined ? g.nag : action.nag && typeof action.nag === 'object' && [1, 2, 3, 4].includes(action.nag.level) ? { level: action.nag.level, left: typeof action.nag.left === 'number' && Number.isFinite(action.nag.left) ? action.nag.left : 0 } : null;
      if (minutes === g.minutes && usedUp === g.usedUp && JSON.stringify(nag) === JSON.stringify(g.nag)) return state;
      return { ...state, ui: { ...state.ui, guest: { minutes, usedUp, nag } } };
    }
    case A.GUEST_NAG_CLOSE: {
      const g = state.ui.guest || emptyGuest();
      return g.nag === null ? state : { ...state, ui: { ...state.ui, guest: { ...g, nag: null } } };
    }
    case A.GUEST_OFFER: {
      const count = Math.floor(Number(action.count));
      if (!(count >= 1)) return refuse('guest/offer: needs a count of plans');
      return { ...state, ui: { ...state.ui, bringIn: { count, busy: false } } };
    }
    case A.GUEST_OFFER_CLOSE:
      return state.ui.bringIn === null ? state : { ...state, ui: { ...state.ui, bringIn: null } };
    case A.GUEST_BRING_IN:
      if (!state.ui.bringIn || state.ui.saving) return state;
      return { ...state, ui: { ...state.ui, bringIn: { ...state.ui.bringIn, busy: true }, saving: { planId: null, kind: 'bringIn' }, saveProblem: null, toast: null } };

    // ---- the account page (road-to-7.md step 11): the effect does each thing; the state says what is shown and under way ----
    case A.ACCOUNT_MODE: {
      if (!ACCOUNT_MODES.includes(action.mode)) return refuse(`account/mode: "${action.mode}" is not a form it knows`);
      const acc = state.ui.account || emptyAccount();
      return { ...state, ui: { ...state.ui, account: { ...acc, mode: action.mode, problem: null, note: null } } };
    }
    case A.ACCOUNT_ASK: {
      if (!ACCOUNT_ASKS.includes(action.what)) return refuse(`account/ask: "${action.what}" is not something it does`);
      const acc = state.ui.account || emptyAccount();
      if (acc.busy) return state;
      // the deletion only after its two confirms, on screen
      if (action.what === 'delete' && acc.confirm !== 2) return state;
      return { ...state, ui: { ...state.ui, account: { ...acc, busy: action.what, problem: null, note: null } } };
    }
    case A.ACCOUNT_DONE: {
      if (!ACCOUNT_ASKS.includes(action.what)) return refuse(`account/done: "${action.what}" is not something it does`);
      const acc = state.ui.account || emptyAccount();
      const slots = action.slots && typeof action.slots === 'object' ? Object.fromEntries(Object.entries(action.slots).filter(([, v]) => typeof v === 'string' || typeof v === 'number')) : {};
      return { ...state, ui: { ...state.ui, account: { ...acc, busy: null, problem: null, note: { what: action.what, slots } } } };
    }
    case A.ACCOUNT_FAILED: {
      if (!ACCOUNT_ASKS.includes(action.what)) return refuse(`account/failed: "${action.what}" is not something it does`);
      const acc = state.ui.account || emptyAccount();
      const problem = typeof action.problem === 'string' && action.problem ? action.problem.slice(0, 80) : 'failed';
      return { ...state, ui: { ...state.ui, account: { ...acc, busy: null, note: null, problem: { what: action.what, code: problem } } } };
    }
    case A.ACCOUNT_CONFIRM: {
      const step = action.step === 1 || action.step === 2 ? action.step : null;
      const acc = state.ui.account || emptyAccount();
      if (acc.busy && step !== null) return state;
      return acc.confirm === step ? state : { ...state, ui: { ...state.ui, account: { ...acc, confirm: step, problem: null } } };
    }
    case A.ACCOUNT_DELETED: {
      const acc = state.ui.account || emptyAccount();
      return { ...state, ui: { ...state.ui, account: { ...acc, busy: null, confirm: null, problem: null, note: null, deleted: { signInGone: action.signInGone === true } } } };
    }
    case A.PROFILE_SET: {
      const p = action.profile && typeof action.profile === 'object' ? { lastSeenVersion: typeof action.profile.lastSeenVersion === 'string' ? action.profile.lastSeenVersion : null } : null;
      return JSON.stringify(p) === JSON.stringify(state.ui.profile) ? state : { ...state, ui: { ...state.ui, profile: p } };
    }

    // ---- What's new (road-to-7.md step 11) ----
    case A.NEWS_SHOW: {
      const entries = Array.isArray(action.entries) ? action.entries.filter((e) => e && typeof e === 'object' && typeof e.version === 'string') : [];
      if (!entries.length) return refuse('news/show: needs the releases to show');
      const news = state.ui.news || emptyNews();
      return { ...state, ui: { ...state.ui, news: { ...news, popup: entries } } };
    }
    case A.NEWS_DISMISS: {
      const news = state.ui.news || emptyNews();
      return news.popup === null ? state : { ...state, ui: { ...state.ui, news: { ...news, popup: null } } };
    }
    case A.NEWS_PAGE: {
      const news = state.ui.news || emptyNews();
      if (action.page === null) return news.page === null ? state : { ...state, ui: { ...state.ui, news: { ...news, page: null } } };
      const releases = Array.isArray(action.releases) ? action.releases.filter((e) => e && typeof e === 'object' && typeof e.version === 'string') : null;
      if (!releases) return refuse('news/page: needs the releases');
      const history = Array.isArray(action.history) ? action.history.filter((e) => e && typeof e === 'object' && typeof e.version === 'string') : [];
      return { ...state, ui: { ...state.ui, news: { ...news, page: { releases, history } } } };
    }
    case A.NEWS_SEEN: {
      if (typeof action.version !== 'string' || !action.version) return refuse('news/seen: needs a version');
      const news = state.ui.news || emptyNews();
      return news.seen === action.version ? state : { ...state, ui: { ...state.ui, news: { ...news, seen: action.version } } };
    }
    case A.ASSUMPTIONS_SET: {
      // "Assumptions and data" (road-to-7.md step 11b): the figures as plain data, or that they could not be read
      const facts = action.facts && typeof action.facts === 'object' && !Array.isArray(action.facts) ? action.facts : null;
      return { ...state, ui: { ...state.ui, assumptions: { facts, failed: !facts } } };
    }

    default:
      return refuse(`unknown action "${action.type}"`);
  }
}
