/**
 * The draft store: what was typed is kept in THIS TAB only — sessionStorage, key pt_v7_draft. The answer is never
 * kept (it is worked out again after a reload). The other keys V7 writes are the window's plans (effects/planWrite.js)
 * and the activity stamp (effects/activity.js),
 * and only when a person presses "Save as a plan".
 *
 *   loadDraft(storage)            → { c: { values, touched, asked, revealed }, a, b: { …, carriedFrom, spendHow, skipNoted },
 *                                     budget?, kept? } or null
 *   saveDraft(storage, draft)     → true if it was written. `draft` is state.draft, with (optionally) `budget`: the
 *                                   household's budget sheet, and `kept`: { [q]: { name, made } } — the name box as
 *                                   typed and the last plan made from this window (so a reload still says "Kept as …")
 *   draftOf(state)                → what saveDraft is given for a state
 *   startDraftStore(store, storage) → stop()      writes whenever the draft, the budget or a save changes
 *   sessionStore(win)             → the tab's storage, or null if the browser will not hand it over
 *
 * A storage that throws (private mode, full, blocked) is survived: the app carries on, it just forgets on reload.
 */
import { SCHEMAS } from '../state/select.js';
import { cleanSheet } from '../state/budget.js';
import { keptKeep, keptPlanDraft } from '../state/initial.js';
import { isPlanEditPath } from '../../answers/plan/schema.js';
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

/** The browser's localStorage, or null if it will not hand it over (the activity stamp and the free-time count read it). */
export function localStore(win = window) {
  try {
    const s = win.localStorage;
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
  // a saved plan's editing draft (editing-in-v7.md 4, 7.2): the plan's id and the text of its boxes, nothing of the plan
  const pd = keptPlanDraft(kept);
  if (pd.id) {
    const values = Object.fromEntries(Object.entries(pd.values).filter(([p]) => isPlanEditPath(p)));
    const touched = pd.touched.filter((p) => isPlanEditPath(p));
    if (Object.keys(values).length || touched.length || pd.asked) out.plan = { id: pd.id, values, touched, asked: pd.asked };
  }
  const saves = {};
  for (const q of Object.keys(SCHEMAS)) {
    const k = keptKeep(kept.kept, q);
    if (k.name !== null || k.made !== null) saves[q] = { name: k.name, made: k.made };
  }
  if (Object.keys(saves).length) out.kept = saves;
  return Object.keys(out).length ? out : null;
}

const QUESTION = (k) => k in SCHEMAS;
const isEmpty = (draft) => Object.entries(draft || {}).every(([k, d]) => {
  if (k === 'budget') return !d;
  if (k === 'plan') return !d || !d.id || (Object.keys(d.values || {}).length === 0 && (d.touched || []).length === 0 && !d.asked);
  if (k === 'kept') return !d || Object.values(d).every((x) => !x || (x.name === null && x.made === null));
  if (!QUESTION(k)) return true;
  return !d || (Object.keys(d.values || {}).length === 0 && (d.touched || []).length === 0 && !d.asked && !d.spendHow);
});

/** What the store keeps of a state: the drafts, the budget sheet, and each question's name box and last save. */
export function draftOf(state) {
  const kept = {};
  for (const [q, k] of Object.entries(state.keep || {})) if (k && (typeof k.name === 'string' || k.made)) kept[q] = { name: typeof k.name === 'string' ? k.name : null, made: k.made || null };
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
