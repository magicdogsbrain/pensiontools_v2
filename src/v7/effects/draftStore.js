/**
 * The draft store: what was typed is kept in THIS TAB only — sessionStorage, key pt_v7_draft. Nothing else is
 * written anywhere by V7 in this slice, and the answer is never kept (it is worked out again after a reload).
 *
 *   loadDraft(storage)            → { c: { values, touched, asked, revealed } } or null
 *   saveDraft(storage, draft)     → true if it was written
 *   startDraftStore(store, storage) → stop()      writes whenever state.draft changes
 *   sessionStore(win)             → the tab's storage, or null if the browser will not hand it over
 *
 * A storage that throws (private mode, full, blocked) is survived: the app carries on, it just forgets on reload.
 */
import { SCHEMAS } from '../state/select.js';

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
    const paths = new Set(SCHEMAS[q].fields.map((f) => f.path));
    const values = {};
    if (d.values && typeof d.values === 'object' && !Array.isArray(d.values)) {
      for (const [path, v] of Object.entries(d.values)) if (paths.has(path) && (typeof v === 'string' || typeof v === 'boolean')) values[path] = v;
    }
    const list = (a) => (Array.isArray(a) ? [...new Set(a.filter((p) => typeof p === 'string' && paths.has(p)))] : []);
    out[q] = { values, touched: list(d.touched), asked: d.asked === true, revealed: list(d.revealed) };
  }
  return Object.keys(out).length ? out : null;
}

const isEmpty = (draft) => Object.values(draft || {}).every((d) => !d || (Object.keys(d.values || {}).length === 0 && (d.touched || []).length === 0 && !d.asked));

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
  let last = store.getState().draft;
  return store.subscribe((state) => {
    if (state.draft === last) return;
    last = state.draft;
    saveDraft(storage, state.draft);
  });
}
