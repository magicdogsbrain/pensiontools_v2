/**
 * The state (V7 build brief 4.5; step 4 brief 4.11): one plain object that survives JSON.stringify. Pure — the date comes in.
 *
 * @param {object} o
 * @param {string} o.today                'YYYY-MM-DD' — read once by effects/clock.js, never here
 * @param {'prod'|'test'} [o.build]
 * @param {object|null} [o.draft]         what draftStore kept for this tab: { c: { values, touched, asked, revealed },
 *                                        a?: { …, carriedFrom, spendHow, skipNoted }, b?, budget?, kept? }
 *
 * The state holds a draft and an answer for every question in rail/questions.js's OPEN (C now; A and B from the
 * joining-up change). A's and B's drafts also carry `carriedFrom`; their answers `detail` and `extending`.
 *
 * The budget step and "Save this as a plan" (research/v7/budget-step.md; save-as-plan.md Contract C.5):
 *   budget      null, or the household's ONE budget sheet (state/budget.js), shared by A and B. It is never an input of
 *               any answer: the figure every answer uses is draft[q].values['spend.amount'], and only "Use £X"
 *               (budget/use) ever writes the budget's total into it.
 *   draft.a/b   also `spendHow` (null | 'lines' | 'one') and `skipNoted` (the "you are skipping the budget" note has
 *               been shown) — outside `values`, so never in the checked inputs.
 *   keep        per question: the name box as typed (null = the suggestion), a problem, whether a keep is under way,
 *               and the last plan made from this question ({ id, name, where, partnerId, partnerName, separate }).
 */
import { VERSION } from '../../constants.js';
import { OPEN } from '../rail/questions.js';
import { cleanSheet } from './budget.js';
import { hasShape, stepsPath, cleanSteps, keptShapeExtras } from './shapeDraft.js';

/** The questions whose draft and answer carry the saving-years fields (carriedFrom; detail, extending). */
const SAVER = ['a', 'b'];

/**
 * A question's draft: `values` as typed; `touched` the fields that have been left; `asked` whether "Show what it
 * pays" has been pressed; `revealed` the fields that came onto the form AFTER it was last pressed (a partner's
 * boxes opened after a first answer) — they show an error only once left, until the button is pressed again.
 */
export const emptyDraft = () => ({ values: {}, touched: [], asked: false, revealed: [] });
export const emptyAnswer = () => ({ status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false });

/**
 * A's and B's drafts also carry `carriedFrom`: null, or the question whose figures were carried in ('c' | 'a' | 'b');
 * `spendHow`: how the spending is being chosen on the spend step (null | 'lines' | 'one'); `skipNoted`: the note that
 * the budget is being skipped has been shown (it is shown once).
 */
export const emptySaverDraft = () => ({ ...emptyDraft(), carriedFrom: null, spendHow: null, skipNoted: false });

/**
 * "Keep this as a plan", per question (save-as-plan.md; road-to-7.md step 7): the name box, a problem, a keep under way, the
 * last plan made from this question, and — a couple whose partner's plan was made but not yours ('partial') — that plan's name.
 */
export const emptyKeep = () => ({ name: null, problem: null, saving: false, made: null, partnerKept: null });
/** Where a plan was made: the account, or this window. */
export const KEEP_WHERES = Object.freeze(['account', 'window']);
const PLAN_ID = /^[A-Za-z0-9_-]{1,64}$/;

const SPEND_HOW = ['lines', 'one'];
const NAME_MAX = 200;

/** A plan made from a question, cleaned: its id, its name, where it is, and (a couple) the partner's; or null. */
export function cleanMade(made) {
  if (!made || typeof made !== 'object' || typeof made.id !== 'string' || !PLAN_ID.test(made.id)) return null;
  if (typeof made.name !== 'string' || !made.name || made.name.length > NAME_MAX || !KEEP_WHERES.includes(made.where)) return null;
  const out = { id: made.id, name: made.name, where: made.where, partnerId: null, partnerName: null, separate: made.separate === true };
  if (typeof made.partnerId === 'string' && PLAN_ID.test(made.partnerId) && typeof made.partnerName === 'string' && made.partnerName.length <= NAME_MAX) {
    out.partnerId = made.partnerId;
    out.partnerName = made.partnerName;
  }
  return out;
}

/** What draftStore kept of one question's "keep as a plan": the name as typed, and the last plan made from this window. */
export function keptKeep(kept, q) {
  const k = emptyKeep();
  const x = kept && typeof kept === 'object' && kept[q] && typeof kept[q] === 'object' ? kept[q] : null;
  if (!x) return k;
  if (typeof x.name === 'string' && x.name.length <= NAME_MAX) k.name = x.name;
  k.made = cleanMade(x.made);
  return k;
}

/**
 * A's and B's answers also carry `detail` — the detail of the result held (result.basis.detail: A 'chart' | 'all',
 * B 'answer' | 'grid') — and `extending`, true while an optional step's extra pass runs (status stays 'final').
 */
export const emptySaverAnswer = () => ({ ...emptyAnswer(), detail: null, extending: false });

/** The empty draft and answer of a question, by id. */
export const emptyDraftFor = (q) => (SAVER.includes(q) ? emptySaverDraft() : emptyDraft());
export const emptyAnswerFor = (q) => (SAVER.includes(q) ? emptySaverAnswer() : emptyAnswer());

const CARRIED = ['c', 'a', 'b', 'd'];

/** What draftStore kept for one question, cleaned: only text or yes/no values (and the spending shape's list of steps), string lists, booleans. */
export function keptDraft(kept, q) {
  const d = emptyDraftFor(q);
  const k = kept && typeof kept === 'object' && kept[q] && typeof kept[q] === 'object' ? kept[q] : null;
  if (!k) return d;
  if (k.values && typeof k.values === 'object') {
    for (const [path, v] of Object.entries(k.values)) {
      if (typeof v === 'string' || typeof v === 'boolean') d.values[path] = v;
      else if (hasShape(q) && path === stepsPath(q)) {
        // the spending shape's later steps: one list of steps, each its boxes as typed (state/shapeDraft.js)
        const steps = cleanSteps(q, v);
        if (steps && steps.length) d.values[path] = steps;
      }
    }
  }
  if (Array.isArray(k.touched)) d.touched = k.touched.filter((p) => typeof p === 'string');
  d.asked = k.asked === true;
  if (Array.isArray(k.revealed)) d.revealed = k.revealed.filter((p) => typeof p === 'string');
  if ('carriedFrom' in d) d.carriedFrom = CARRIED.includes(k.carriedFrom) ? k.carriedFrom : null;
  if ('spendHow' in d) { d.spendHow = SPEND_HOW.includes(k.spendHow) ? k.spendHow : null; d.skipNoted = k.skipNoted === true; }
  // the spending shape's Undo ("Put back my steps by age"), its line and the figure its steps were set against
  Object.assign(d, keptShapeExtras(q, k));
  return d;
}

export function initialState({ today, build = 'prod', draft = null } = {}) {
  if (typeof today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error('initialState needs today as YYYY-MM-DD');
  const drafts = {};
  const answers = {};
  const keep = {};
  const kept = draft && typeof draft === 'object' ? draft.kept : null;
  for (const q of OPEN) { drafts[q] = keptDraft(draft, q); answers[q] = emptyAnswerFor(q); keep[q] = keptKeep(kept, q); }
  return {
    route:   { screen: 'front', q: null, step: null, planId: null, focus: null },
    env:     { today, build: build === 'test' ? 'test' : 'prod', appVersion: VERSION, historyEnd: null },
    session: { kind: 'none', email: null, signingOut: false },   // who is signed in; 'none' until a plan page asks (your-plan.md 4.3)
    plan:    null,                                   // reserved (architecture.md 3.2)
    plans:   null,                                   // the saved plans in page memory only, or null: { status, source, readAt, list }
    draft:   { ...drafts, plan: keptPlanDraft(draft) },   // `plan`: what was typed into a saved plan's editing step (editing-in-v7.md 4)
    answers,
    budget:  cleanSheet(draft && typeof draft === 'object' ? draft.budget : null),
    keep,
    lasts:   emptyLasts(),                           // "Does it last?": the one test's result for ONE plan, page memory only (editing-in-v7.md 10)
    ways:    emptyWays(),                            // "How the money is taken": the nine ways on ONE plan, page memory only (way-and-mix.md 2)
    ui:      { railOpen: false, open: [], online: true, leaving: null, leaveProblem: null, saving: null, saveProblem: null, toast: null }
  };
}

/** No run of "Does it last?" held: `key` is lasts.js runKeyOf of the plan a result (or a run under way) is for. */
export const emptyLasts = () => ({ key: null, status: 'idle', reason: null, result: null, progress: null, slow: false, levers: {}, workDraft: { yearly: '', years: '' } });
/**
 * No run of the nine ways held (way-and-mix.md 2.2): `key` as lasts'; `result` waysRun.js runWays's; `ran` { runs, ms } the cost
 * said on screen; `open` the way whose card is open (null: the plan's own); `dials` text typed by way and key; `tried` by way:
 * { status: 'working' | 'done' | 'failed', values, result, reason, ms } for the one way tried on its dials; `rankBy` the table's order.
 */
export const emptyWays = () => ({ key: null, status: 'idle', reason: null, result: null, progress: null, slow: false, ran: null, open: null, dials: {}, tried: {}, rankBy: 'lasts' });
const TRY_STATUS = ['working', 'done', 'failed'];
/** A tried way's entry, cleaned (state/replace may draw one). */
export function cleanTried(x) {
  if (!x || typeof x !== 'object' || !TRY_STATUS.includes(x.status)) return null;
  return { status: x.status, values: x.values && typeof x.values === 'object' ? x.values : {}, result: x.status === 'done' && x.result && typeof x.result === 'object' ? x.result : null, reason: x.status === 'failed' && x.reason === 'noWorker' ? 'noWorker' : null, ms: Number.isFinite(x.ms) ? x.ms : null };
}
/** The three levers of "Does it last?" (road-to-7.md step 7), and what a lever's entry may be. */
export const LEVER_KINDS = Object.freeze(['spendMore', 'work', 'fall']);
const LEVER_STATUS = ['open', 'working', 'done', 'failed', 'invalid'];
/** A lever's entry, cleaned (the draft store never keeps it; state/replace may draw one). */
export function cleanLever(x) {
  if (!x || typeof x !== 'object' || !LEVER_STATUS.includes(x.status)) return null;
  const lever = x.lever && typeof x.lever === 'object' && LEVER_KINDS.includes(x.lever.kind) ? x.lever : null;
  if (!lever) return null;
  return { status: x.status, lever, result: x.status === 'done' && x.result && typeof x.result === 'object' ? x.result : null, reason: x.status === 'failed' && x.reason === 'noWorker' ? 'noWorker' : null };
}

/** An empty plan draft: no plan, nothing typed. */
export const emptyPlanDraft = () => ({ id: null, values: {}, touched: [], asked: false });
/** The plan draft a tab kept (draftStore cleans it): the plan's id, text or choices by path, the boxes left, asked. */
export function keptPlanDraft(draft) {
  const k = draft && typeof draft === 'object' && draft.plan && typeof draft.plan === 'object' ? draft.plan : null;
  if (!k || typeof k.id !== 'string' || !k.id) return emptyPlanDraft();
  const values = {};
  if (k.values && typeof k.values === 'object' && !Array.isArray(k.values)) for (const [p, v] of Object.entries(k.values)) if (typeof v === 'string') values[p] = v;
  return { id: k.id, values, touched: Array.isArray(k.touched) ? k.touched.filter((p) => typeof p === 'string') : [], asked: k.asked === true };
}

/** The session states the plan source reports (your-plan.md 1.1 "States"). */
export const SESSION_KINDS = Object.freeze(['none', 'checking', 'in', 'unverified', 'nobody', 'failed']);
export const emptyPlans = () => null;
