/**
 * The state (V7 build brief 4.5): one plain object that survives JSON.stringify. Pure — the date comes in.
 *
 * @param {object} o
 * @param {string} o.today                'YYYY-MM-DD' — read once by effects/clock.js, never here
 * @param {'prod'|'test'} [o.build]
 * @param {object|null} [o.draft]         what draftStore kept for this tab: { c: { values, touched, asked } }
 */
import { VERSION } from '../../constants.js';

export const emptyDraft = () => ({ values: {}, touched: [], asked: false });
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
