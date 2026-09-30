/**
 * The state (V7 build brief 4.5): one plain object that survives JSON.stringify. Pure — the date comes in.
 *
 * @param {object} o
 * @param {string} o.today                'YYYY-MM-DD' — read once by effects/clock.js, never here
 * @param {'prod'|'test'} [o.build]
 * @param {object|null} [o.draft]         what draftStore kept for this tab: { c: { values, touched, asked, revealed } }
 */
import { VERSION } from '../../constants.js';

/**
 * A question's draft: `values` as typed; `touched` the fields that have been left; `asked` whether "Show what it
 * pays" has been pressed; `revealed` the fields that came onto the form AFTER it was last pressed (a partner's
 * boxes opened after a first answer) — they show an error only once left, until the button is pressed again.
 */
export const emptyDraft = () => ({ values: {}, touched: [], asked: false, revealed: [] });
export const emptyAnswer = () => ({ status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false });

export function initialState({ today, build = 'prod', draft = null } = {}) {
  if (typeof today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error('initialState needs today as YYYY-MM-DD');
  const kept = draft && typeof draft === 'object' && draft.c && typeof draft.c === 'object' ? draft.c : null;
  const c = emptyDraft();
  if (kept) {
    if (kept.values && typeof kept.values === 'object') {
      for (const [path, v] of Object.entries(kept.values)) if (typeof v === 'string' || typeof v === 'boolean') c.values[path] = v;
    }
    if (Array.isArray(kept.touched)) c.touched = kept.touched.filter((p) => typeof p === 'string');
    c.asked = kept.asked === true;
    if (Array.isArray(kept.revealed)) c.revealed = kept.revealed.filter((p) => typeof p === 'string');
  }
  return {
    route:   { screen: 'front', q: null, step: null, planId: null, focus: null },
    env:     { today, build: build === 'test' ? 'test' : 'prod', appVersion: VERSION, historyEnd: null },
    session: { kind: 'none' },                       // fixed in this slice
    plan:    null,                                   // fixed in this slice
    draft:   { c },
    answers: { c: emptyAnswer() },
    ui:      { railOpen: false, open: [], online: true }
  };
}
