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
import { emptyDraftFor, emptyAnswerFor, emptyKeep, keptKeep } from './initial.js';
import { parsedDraft, appliedPaths, isCurrent, SCHEMAS, SPEND_STEP, SPEND_PATHS, numbersPaths, skipNoteDue, spendView, keepView } from './select.js';
import { carryFor } from './carry.js';
import { budgetReduce, cleanSheet, newSheet } from './budget.js';
import { parse, format } from '../router/routes.js';
import { BUILT } from '../rail/questions.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-\d{2}$/;

/** Any route → one that has an address: the five fields, no plan id; anything else becomes "not found". */
const tidyRoute = (r) => parse(format(r));

const withDraft = (state, q, draft) => ({ ...state, draft: { ...state.draft, [q]: draft } });
const withAnswer = (state, q, answer) => ({ ...state, answers: { ...state.answers, [q]: answer } });
const keepOf = (state, q) => (state.keep && state.keep[q]) || emptyKeep();
const withKeep = (state, q, keep) => ({ ...state, keep: { ...(state.keep || {}), [q]: keep } });
const onStepOf = (route, q, step) => !!route && route.screen === 'step' && route.q === q && route.step === step;
const KEEP_PROBLEMS = ['empty', 'tooLong', 'storage', 'notReady'];
/** What V7 can know of a save it sent, on coming back (KEEP_BACK). */
const KEEP_BACKS = ['waiting', 'taken', 'declined', 'notMade'];

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
const hasField = (q, path) => !!SCHEMAS[q] && SCHEMAS[q].fields.some((f) => f.path === path);
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
  const draft = { ...target, values, touched };
  if ('carriedFrom' in target) draft.carriedFrom = from;
  const route = opens ? tidyRoute({ screen: 'step', q: opens.q, step: opens.step, planId: null, focus: opens.focus }) : state.route;
  return { ...withDraft(state, to, draft), route, ui: closeRail(state.ui) };
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
    case A.ROUTE_SET:
      return noteShown(state, { ...state, route: tidyRoute(action.route), ui: closeRail(state.ui) });

    // ---- what was typed -------------------------------------------------------------------------------------
    case A.DRAFT_SET: {
      if (!draft || !hasField(q, action.path)) return refuse(`draft/set: no field "${q}.${action.path}"`);
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
      const fromSpend = SPEND_STEP[q] && onStepOf(state.route, q, 'spend') && !SPEND_PATHS.some((p) => parsed.errors[p]);
      const canAnswer = (parsed.ok || fromSpend) && BUILT[q] && BUILT[q].steps.some((s) => s.id === 'answer');
      if (!canAnswer) {
        // A figure that needs another look inside "Add more detail" (C's "make it last to age" before the start age, the
        // reviewers' dead end): the block opens, so the box and its sentence are on screen for the form to focus.
        const inMore = SCHEMAS[q] && SCHEMAS[q].fields.some((f) => f.group === 'more' && parsed.errors[f.path]);
        return inMore && !next.ui.open.includes('more') ? { ...next, ui: { ...next.ui, open: [...next.ui.open, 'more'] } } : next;
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

    // ---- "Save this as a plan" ----------------------------------------------------------------------------------
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
    case A.KEEP_SENT: {
      if (!draft) return refuse(`keep/sent: no question "${q}"`);
      if (typeof action.name !== 'string' || typeof action.createdAt !== 'string') return refuse('keep/sent: a name and a time');
      // The box goes back to following the answer: the next try gets its own name ("Try something else and save that too").
      return withKeep(state, q, { ...keepOf(state, q), name: null, saving: false, problem: null, sent: { name: action.name, createdAt: action.createdAt }, back: null });
    }
    case A.KEEP_FAILED: {
      if (!draft) return refuse(`keep/failed: no question "${q}"`);
      const problem = KEEP_PROBLEMS.includes(action.problem) ? action.problem : 'storage';
      return withKeep(state, q, { ...keepOf(state, q), saving: false, problem });
    }
    case A.KEEP_BACK: {
      // Coming back to V7, what became of the seed this tab sent (effects/planSeed.js seedOutcome): still 'waiting' in
      // the planner; 'taken' — a plan was made, under `name` (the planner's final name: it may have been changed there,
      // or given " (2)"); 'declined' ("Not now"); 'notMade' (the planner could not use it, or a sign-out deleted it).
      // 'gone' (found too old and deleted unused) and 'unknown' (gone with no word from the planner): the save is
      // forgotten and nothing is claimed — "Saved as" is said only on the planner's word.
      if (!draft) return refuse(`keep/back: no question "${q}"`);
      const k = keepOf(state, q);
      if (!k.sent) return state;
      if (action.outcome === 'gone' || action.outcome === 'unknown') return withKeep(state, q, { ...k, sent: null, back: null });
      if (!KEEP_BACKS.includes(action.outcome)) return state;
      const made = action.outcome === 'taken' && typeof action.name === 'string' && action.name.length > 0 && action.name.length <= 200 ? action.name : null;
      if (k.back === action.outcome && (!made || made === k.sent.name)) return state;
      return withKeep(state, q, { ...k, back: action.outcome, ...(made ? { sent: { ...k.sent, name: made } } : {}) });
    }

    case A.STATE_REPLACE: {
      // The test hook only: draws any named state. Refused in the published build.
      if (state.env.build !== 'test') return state;
      const s = action.state;
      const ok = s && s.route && s.env && typeof s.env.today === 'string' && DATE.test(s.env.today) && s.draft && s.draft.c && s.answers && s.answers.c && s.ui;
      if (!ok) return refuse('state/replace: not a V7 state');
      const copy = JSON.parse(JSON.stringify(s));
      // Every question open here gets its draft and answer, in its own shape; one the state handed in leaves out is empty.
      const drafts = {};
      const answers = {};
      for (const id of Object.keys(state.draft)) {
        const d = copy.draft[id] && typeof copy.draft[id] === 'object' ? copy.draft[id] : {};
        drafts[id] = { ...emptyDraftFor(id), ...d, revealed: Array.isArray(d.revealed) ? d.revealed : [] };
        if ('spendHow' in drafts[id]) {
          drafts[id].spendHow = ['lines', 'one'].includes(drafts[id].spendHow) ? drafts[id].spendHow : null;
          drafts[id].skipNoted = drafts[id].skipNoted === true;
        }
        const a = copy.answers[id] && typeof copy.answers[id] === 'object' ? copy.answers[id] : {};
        answers[id] = { ...emptyAnswerFor(id), ...a };
      }
      // "Save this as a plan": the name and the last save as draftStore would keep them, and what was found on coming back.
      const keep = {};
      for (const id of Object.keys(state.draft)) {
        const k = copy.keep && typeof copy.keep === 'object' ? copy.keep[id] : null;
        keep[id] = { ...keptKeep(copy.keep, id), back: k && KEEP_BACKS.includes(k.back) ? k.back : null,
          problem: k && KEEP_PROBLEMS.includes(k.problem) ? k.problem : null };
      }
      return {
        route: tidyRoute(copy.route),
        env: { today: copy.env.today, build: 'test', appVersion: typeof copy.env.appVersion === 'string' ? copy.env.appVersion : state.env.appVersion,
               historyEnd: typeof copy.env.historyEnd === 'string' ? copy.env.historyEnd : null },
        session: { kind: 'none' },                   // fixed in this slice, whatever was handed in
        plan: null,                                  // fixed in this slice
        draft: drafts,
        answers,
        budget: cleanSheet(copy.budget),
        keep,
        ui: { railOpen: !!copy.ui.railOpen, open: Array.isArray(copy.ui.open) ? copy.ui.open.filter((id) => OPENABLE.includes(id)) : [], online: copy.ui.online !== false }
      };
    }

    default:
      return refuse(`unknown action "${action.type}"`);
  }
}
