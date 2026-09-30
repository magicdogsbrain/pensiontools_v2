/**
 * The reducer (V7 build brief 4.6). Pure: (state, action) → state. It never changes the state it is given, and
 * returns the very same object when an action changes nothing (a stale result, an action it does not know).
 *
 * No action can change `plan` or `session` in this slice. An unknown action type — or one with a field that is not
 * on the input list — throws in the test build and is ignored in the published build.
 */
import { A, OPENABLE } from './actions.js';
import { emptyDraft, emptyAnswer } from './initial.js';
import { parsedDraft, appliedPaths, SCHEMAS } from './select.js';
import { parse, format } from '../router/routes.js';
import { BUILT } from '../rail/questions.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-\d{2}$/;

/** Any route → one that has an address: the five fields, no plan id; anything else becomes "not found". */
const tidyRoute = (r) => parse(format(r));

const withDraft = (state, q, draft) => ({ ...state, draft: { ...state.draft, [q]: draft } });
const withAnswer = (state, q, answer) => ({ ...state, answers: { ...state.answers, [q]: answer } });
const hasField = (q, path) => !!SCHEMAS[q] && SCHEMAS[q].fields.some((f) => f.path === path);

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
      return { ...state, route: tidyRoute(action.route), ui: state.ui.railOpen ? { ...state.ui, railOpen: false } : state.ui };

    // ---- what was typed -------------------------------------------------------------------------------------
    case A.DRAFT_SET: {
      if (!draft || !hasField(q, action.path)) return refuse(`draft/set: no field "${q}.${action.path}"`);
      const values = { ...draft.values };
      // Text is held exactly as typed; yes/no as a boolean. Anything else empties the box.
      if (typeof action.value === 'string' || typeof action.value === 'boolean') values[action.path] = action.value;
      else delete values[action.path];
      // Setting household to 'single' keeps the partner's values: "Remove" then "Add" loses nothing.
      const next = withDraft(state, q, { ...draft, values });
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
      const canAnswer = parsedDraft(state, q).ok && BUILT[q] && BUILT[q].steps.some((s) => s.id === 'answer');
      if (!canAnswer) return next;
      return { ...next, route: tidyRoute({ screen: 'step', q, step: 'answer', planId: null, focus: null }), ui: next.ui.railOpen ? { ...next.ui, railOpen: false } : next.ui };
    }
    case A.DRAFT_RESET: {
      if (!draft) return refuse(`draft/reset: no question "${q}"`);
      return withAnswer(withDraft(state, q, emptyDraft()), q, emptyAnswer());
    }

    // ---- the answer -----------------------------------------------------------------------------------------
    case A.ANSWER_WORKING: {
      if (!answer) return refuse(`answer/working: no question "${q}"`);
      if (typeof action.inputsKey !== 'string') return state;
      // The old result stays on screen (greyed). "before" is the last FINAL answer's careful amount — and, when an
      // amount to take had been named, how long that lasted — for "Before / Now".
      const wasFinal = answer.status === 'final' && answer.result && answer.result.monthly && typeof answer.result.monthly.careful === 'number';
      const oldTake = wasFinal && answer.result.take && typeof answer.result.take.perMonth === 'number' ? answer.result.take : null;
      const before = wasFinal
        ? { monthly: { careful: answer.result.monthly.careful }, take: oldTake ? { perMonth: oldTake.perMonth, runOutAge: oldTake.runOutAge, covered: oldTake.covered === true } : null }
        : answer.before;
      return withAnswer(state, q, { ...answer, status: 'working', inputsKey: action.inputsKey, before, progress: null, slow: false });
    }
    case A.ANSWER_PROGRESS: {
      if (!answer) return refuse(`answer/progress: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey) return state;
      if (answer.status !== 'working' && answer.status !== 'first') return state;
      return withAnswer(state, q, { ...answer, progress: { done: Number(action.done) || 0, total: Number(action.total) || 0 } });
    }
    case A.ANSWER_FIRST: {
      if (!answer) return refuse(`answer/first: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey || answer.status !== 'working') return state;   // stale
      return withAnswer(state, q, { ...answer, status: 'first', result: action.result, progress: null });
    }
    case A.ANSWER_FINAL: {
      if (!answer) return refuse(`answer/final: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey) return state;                                  // stale
      if (answer.status !== 'working' && answer.status !== 'first') return state;
      return withAnswer(state, q, { ...answer, status: 'final', result: action.result, progress: null, slow: false });
    }
    case A.ANSWER_FAILED: {
      if (!answer) return refuse(`answer/failed: no question "${q}"`);
      if (action.inputsKey === null || action.inputsKey !== answer.inputsKey) return state;                                  // stale
      if (answer.status !== 'working' && answer.status !== 'first') return state;
      return withAnswer(state, q, { ...answer, status: 'failed', progress: null, slow: false });                             // the draft is untouched
    }
    case A.ANSWER_SLOW: {
      if (!answer) return refuse(`answer/slow: no question "${q}"`);
      if ((answer.status !== 'working' && answer.status !== 'first') || answer.slow) return state;
      return withAnswer(state, q, { ...answer, slow: true });
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

    case A.STATE_REPLACE: {
      // The test hook only: draws any named state. Refused in the published build.
      if (state.env.build !== 'test') return state;
      const s = action.state;
      const ok = s && s.route && s.env && typeof s.env.today === 'string' && DATE.test(s.env.today) && s.draft && s.draft.c && s.answers && s.answers.c && s.ui;
      if (!ok) return refuse('state/replace: not a V7 state');
      const copy = JSON.parse(JSON.stringify(s));
      return {
        route: tidyRoute(copy.route),
        env: { today: copy.env.today, build: 'test', appVersion: typeof copy.env.appVersion === 'string' ? copy.env.appVersion : state.env.appVersion,
               historyEnd: typeof copy.env.historyEnd === 'string' ? copy.env.historyEnd : null },
        session: { kind: 'none' },                   // fixed in this slice, whatever was handed in
        plan: null,                                  // fixed in this slice
        draft: { c: { ...emptyDraft(), ...copy.draft.c, revealed: Array.isArray(copy.draft.c.revealed) ? copy.draft.c.revealed : [] } },
        answers: { c: { ...emptyAnswer(), ...copy.answers.c } },
        ui: { railOpen: !!copy.ui.railOpen, open: Array.isArray(copy.ui.open) ? copy.ui.open.filter((id) => OPENABLE.includes(id)) : [], online: copy.ui.online !== false }
      };
    }

    default:
      return refuse(`unknown action "${action.type}"`);
  }
}
