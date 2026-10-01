/**
 * The state (V7 build brief 4.5; step 4 brief 4.11): one plain object that survives JSON.stringify. Pure — the date comes in.
 *
 * @param {object} o
 * @param {string} o.today                'YYYY-MM-DD' — read once by effects/clock.js, never here
 * @param {'prod'|'test'} [o.build]
 * @param {object|null} [o.draft]         what draftStore kept for this tab: { c: { values, touched, asked, revealed }, a?: { …, carriedFrom }, b? }
 *
 * The state holds a draft and an answer for every question in rail/questions.js's OPEN (C now; A and B from the
 * joining-up change). A's and B's drafts also carry `carriedFrom`; their answers `detail` and `extending`.
 */
import { VERSION } from '../../constants.js';
import { OPEN } from '../rail/questions.js';

/** The questions whose draft and answer carry the saving-years fields (carriedFrom; detail, extending). */
const SAVER = ['a', 'b'];

/**
 * A question's draft: `values` as typed; `touched` the fields that have been left; `asked` whether "Show what it
 * pays" has been pressed; `revealed` the fields that came onto the form AFTER it was last pressed (a partner's
 * boxes opened after a first answer) — they show an error only once left, until the button is pressed again.
 */
export const emptyDraft = () => ({ values: {}, touched: [], asked: false, revealed: [] });
export const emptyAnswer = () => ({ status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false });

/** A's and B's drafts also carry `carriedFrom`: null, or the question whose figures were carried in ('c' | 'a' | 'b'). */
export const emptySaverDraft = () => ({ ...emptyDraft(), carriedFrom: null });

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
  return d;
}

export function initialState({ today, build = 'prod', draft = null } = {}) {
  if (typeof today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error('initialState needs today as YYYY-MM-DD');
  const drafts = {};
  const answers = {};
  for (const q of OPEN) { drafts[q] = keptDraft(draft, q); answers[q] = emptyAnswerFor(q); }
  return {
    route:   { screen: 'front', q: null, step: null, planId: null, focus: null },
    env:     { today, build: build === 'test' ? 'test' : 'prod', appVersion: VERSION, historyEnd: null },
    session: { kind: 'none' },                       // fixed in this slice
    plan:    null,                                   // fixed in this slice
    draft:   drafts,
    answers,
    ui:      { railOpen: false, open: [], online: true }
  };
}
