/**
 * The draft store: what was typed is kept in THIS TAB only — sessionStorage, key pt_v7_draft. The answer is never
 * kept (it is worked out again after a reload). The one other key V7 writes is the plan seed, by effects/planSeed.js,
 * and only when a person presses "Save as a plan".
 *
 *   loadDraft(storage)            → { c: { values, touched, asked, revealed }, a, b: { …, carriedFrom, spendHow, skipNoted },
 *                                     budget?, kept? } or null
 *   saveDraft(storage, draft)     → true if it was written. `draft` is state.draft, with (optionally) `budget`: the
 *                                   household's budget sheet, and `kept`: { [q]: { name, sent } } — the name box as
 *                                   typed and the last save sent from this tab (so coming back can say "Saved as …")
 *   draftOf(state)                → what saveDraft is given for a state
 *   startDraftStore(store, storage) → stop()      writes whenever the draft, the budget or a save changes
 *   sessionStore(win)             → the tab's storage, or null if the browser will not hand it over
 *
 * A storage that throws (private mode, full, blocked) is survived: the app carries on, it just forgets on reload.
 */
import { SCHEMAS } from '../state/select.js';
import { cleanSheet } from '../state/budget.js';
import { keptKeep } from '../state/initial.js';
import { hasShape, stepsPath, shapePaths, isShapePath, cleanSteps, keptShapeExtras } from '../state/shapeDraft.js';

export const DRAFT_KEY = 'pt_v7_draft';

export function sessionStore(win = window) {
  try {
    const s = win.sessionStorage;
    return s && typeof s.getItem === 'function' ? s : null;
  } catch {
    return null;
  }
}

/** Only what the input list knows, and only text or yes/no: whatever else is in the tab is dropped. */
function clean(kept) {
  if (!kept || typeof kept !== 'object' || Array.isArray(kept)) return null;
  const out = {};
  for (const q of Object.keys(SCHEMAS)) {
    const d = kept[q];
    if (!d || typeof d !== 'object' || Array.isArray(d)) continue;
    // the spending shape's paths are the question's own (research/v7/spending-shape.md 3.2): its later steps are one list
    const paths = new Set([...SCHEMAS[q].fields.map((f) => f.path), ...shapePaths(q)]);
    const values = {};
    if (d.values && typeof d.values === 'object' && !Array.isArray(d.values)) {
      for (const [path, v] of Object.entries(d.values)) {
        if (hasShape(q) && path === stepsPath(q)) {
          const steps = cleanSteps(q, v);
          if (steps && steps.length) values[path] = steps;
        } else if (paths.has(path) && (typeof v === 'string' || typeof v === 'boolean')) values[path] = v;
      }
    }
    // a step's box ("spend.steps.2.fromAge") is marked as its own path
    const list = (a) => (Array.isArray(a) ? [...new Set(a.filter((p) => typeof p === 'string' && (paths.has(p) || isShapePath(q, p))))] : []);
    out[q] = { values, touched: list(d.touched), asked: d.asked === true, revealed: list(d.revealed) };
    // the spending shape's Undo, its line and the figure its steps were set against (shapeDraft.js keptShapeExtras)
    Object.assign(out[q], keptShapeExtras(q, d));
    // A and B: where the figures were brought over from ("we have brought your figures over …"), kept across a reload
    if (q !== 'c') out[q].carriedFrom = ['a', 'b', 'c'].includes(d.carriedFrom) && d.carriedFrom !== q ? d.carriedFrom : null;
    // A and B: how the spending is being chosen, and whether the "you are skipping the budget" note has been shown
    if (q !== 'c' && ['lines', 'one'].includes(d.spendHow)) out[q].spendHow = d.spendHow;
    if (q !== 'c' && d.skipNoted === true) out[q].skipNoted = true;
  }
  const budget = cleanSheet(kept.budget);
  if (budget) out.budget = budget;
  const saves = {};
  for (const q of Object.keys(SCHEMAS)) {
    const k = keptKeep(kept.kept, q);
    if (k.name !== null || k.sent !== null) saves[q] = { name: k.name, sent: k.sent };
  }
  if (Object.keys(saves).length) out.kept = saves;
  return Object.keys(out).length ? out : null;
}

const QUESTION = (k) => k in SCHEMAS;
const isEmpty = (draft) => Object.entries(draft || {}).every(([k, d]) => {
  if (k === 'budget') return !d;
  if (k === 'kept') return !d || Object.values(d).every((x) => !x || (x.name === null && x.sent === null));
  if (!QUESTION(k)) return true;
  return !d || (Object.keys(d.values || {}).length === 0 && (d.touched || []).length === 0 && !d.asked && !d.spendHow);
});

/** What the store keeps of a state: the drafts, the budget sheet, and each question's name box and last save. */
export function draftOf(state) {
  const kept = {};
  for (const [q, k] of Object.entries(state.keep || {})) if (k && (typeof k.name === 'string' || k.sent)) kept[q] = { name: typeof k.name === 'string' ? k.name : null, sent: k.sent || null };
  return { ...state.draft, ...(state.budget ? { budget: state.budget } : {}), ...(Object.keys(kept).length ? { kept } : {}) };
}

export function loadDraft(storage) {
  if (!storage) return null;
  try {
    const text = storage.getItem(DRAFT_KEY);
    return text ? clean(JSON.parse(text)) : null;
  } catch {
    return null;
  }
}

export function saveDraft(storage, draft) {
  if (!storage) return false;
  try {
    if (isEmpty(draft)) {
      if (storage.getItem(DRAFT_KEY) !== null) storage.removeItem(DRAFT_KEY);   // nothing typed: leave nothing behind
    } else {
      storage.setItem(DRAFT_KEY, JSON.stringify(clean(draft) || {}));
    }
    return true;
  } catch {
    return false;
  }
}

export function startDraftStore(store, storage) {
  const first = store.getState();
  let last = [first.draft, first.budget, first.keep];
  return store.subscribe((state) => {
    if (state.draft === last[0] && state.budget === last[1] && state.keep === last[2]) return;
    last = [state.draft, state.budget, state.keep];
    saveDraft(storage, draftOf(state));
  });
}
