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
 *   keep        per question: the name box as typed (null = the suggestion), a problem, whether a save is under way,
 *               the last save sent from this tab ({ name, createdAt }), and what was found on coming back to it.
 */
import { VERSION } from '../../constants.js';
import { OPEN } from '../rail/questions.js';
import { cleanSheet } from './budget.js';

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

/** "Save this as a plan", per question (save-as-plan.md Contract C.2). */
export const emptyKeep = () => ({ name: null, problem: null, saving: false, sent: null, back: null });

const SPEND_HOW = ['lines', 'one'];
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const NAME_MAX = 200;

/** What draftStore kept of one question's "save as a plan": the name as typed, and the last save sent from this tab. */
export function keptKeep(kept, q) {
  const k = emptyKeep();
  const x = kept && typeof kept === 'object' && kept[q] && typeof kept[q] === 'object' ? kept[q] : null;
  if (!x) return k;
  if (typeof x.name === 'string' && x.name.length <= NAME_MAX) k.name = x.name;
  const sent = x.sent;
  if (sent && typeof sent === 'object' && typeof sent.name === 'string' && sent.name.length <= NAME_MAX && typeof sent.createdAt === 'string' && ISO_TIME.test(sent.createdAt)) {
    k.sent = { name: sent.name, createdAt: sent.createdAt };
  }
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

const CARRIED = ['c', 'a', 'b'];

/** What draftStore kept for one question, cleaned: only text or yes/no values, string lists, booleans. */
export function keptDraft(kept, q) {
  const d = emptyDraftFor(q);
  const k = kept && typeof kept === 'object' && kept[q] && typeof kept[q] === 'object' ? kept[q] : null;
  if (!k) return d;
  if (k.values && typeof k.values === 'object') {
    for (const [path, v] of Object.entries(k.values)) if (typeof v === 'string' || typeof v === 'boolean') d.values[path] = v;
  }
  if (Array.isArray(k.touched)) d.touched = k.touched.filter((p) => typeof p === 'string');
  d.asked = k.asked === true;
  if (Array.isArray(k.revealed)) d.revealed = k.revealed.filter((p) => typeof p === 'string');
  if ('carriedFrom' in d) d.carriedFrom = CARRIED.includes(k.carriedFrom) ? k.carriedFrom : null;
  if ('spendHow' in d) { d.spendHow = SPEND_HOW.includes(k.spendHow) ? k.spendHow : null; d.skipNoted = k.skipNoted === true; }
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
    session: { kind: 'none' },                       // fixed in this slice
    plan:    null,                                   // fixed in this slice
    draft:   drafts,
    answers,
    budget:  cleanSheet(draft && typeof draft === 'object' ? draft.budget : null),
    keep,
    ui:      { railOpen: false, open: [], online: true }
  };
}
