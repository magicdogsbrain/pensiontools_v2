/**
 * The hand-over from the preview to the planner (research/v7/your-plan.md 5.2, 5.3): "Change this" on a plan page of
 * /v7/ leaves one request in THIS WINDOW's session storage, then opens the planner in the same window. The planner reads
 * and deletes it at start-up and, at its first showMainApp, opens that plan in this window only, presses the page's own
 * button (so the page's loader runs and every box fills), scrolls to the section, and shows one line with the way back.
 *
 *   OPEN_PLACE_KEY          sessionStorage key of the request: { v: 1, planId, place, back, at, month? }. No figures, no name.
 *                           `month` ('YYYY-MM') rides on the month place alone: the month the button names, this month
 *                           included — the earliest month not recorded when one was missed, else this month (your-plan.md 2.3).
 *   OPEN_PLAN_KEY           sessionStorage key of "which plan this window's planner is on" (5.5): a plan id, nothing else
 *   PLACES                  every place the preview may ask for: the tab, an optional sub-page, an optional section id
 *   makeRequest(o)          the request as text, or null when it would be refused
 *   readRequest(text, nowMs) the request checked: { ok: true, request } or { ok: false, why }
 *   backOk(back)            '#/plans' or '#/plan/<id>[/<step>]' only
 *
 * Pure: no storage, no DOM. Both apps import it.
 */
export const OPEN_PLACE_KEY = 'pt_open_place';
export const OPEN_PLAN_KEY = 'pt_open_plan';
export const REQUEST_VERSION = 1;
export const REQUEST_MAX_AGE_MS = 10 * 60 * 1000;

export const PLAN_ID = /^[A-Za-z0-9_-]{1,64}$/;
const STEP = /^[a-z]{1,16}$/;
/** The month to record, as the planner's month box takes it: a year and a month 01–12, nothing else. */
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * Each place names a tab (the planner's `.tab[data-tab]`), an optional sub-page (`.sub-tab[data-stresstab]` or
 * `[data-decisiontab]`), an optional section id to scroll to, and the page it needs switched on (`enabledTools`).
 * Every id here exists in index.html: tests/openPlace.test.js reads index.html and fails if one goes missing.
 */
export const PLACES = Object.freeze({
  about:     { tab: 'stress',       sub: 'stresssettings', section: 'ssTimingBlock',   needs: 'stress' },
  spend:     { tab: 'stress',       sub: 'stresssettings', section: 'incomeShapeBlock', needs: 'stress' },
  way:       { tab: 'stress',       sub: 'stresssettings', section: 'ssStrategyPick',  needs: 'stress' },
  pots:      { tab: 'stress',       sub: 'stresssettings', section: 'ssAllocAmounts',  needs: 'stress' },
  income:    { tab: 'stress',       sub: 'stresssettings', section: 'ssOther',         needs: 'stress' },
  lock:      { tab: 'stress',       sub: 'stresssettings', section: 'ssLockBtn',       needs: 'stress' },
  settings:  { tab: 'stress',       sub: 'stresssettings', section: null,              needs: 'stress' },
  test:      { tab: 'stress',       sub: 'montecarlo',     section: null,              needs: 'stress' },
  /** "Try the bad years" (7.9.0): the planner's Scenarios page, at its results; and its real starts one at a time (History). */
  badYears:  { tab: 'stress',       sub: 'scenarios',      section: 'scenResults',     needs: 'stress' },
  badStarts: { tab: 'stress',       sub: 'historical',     section: null,              needs: 'stress' },
  month:     { tab: 'decision',     sub: 'entry',          section: null,              needs: 'decision' },
  taxyear:   { tab: 'decision',     sub: 'taxyears',       section: null,              needs: 'decision' },
  document:  { tab: 'decision',     sub: 'plandoc',        section: null,              needs: 'decision' },
  /** The records by tax year, the spreadsheet per year and the printed documents (road-to-7.md step 11b, the ledger's month.exports): the planner's History page. */
  exports:   { tab: 'decision',     sub: 'history',        section: null,              needs: 'decision' },
  potRecord: { tab: 'accumulation', sub: null,             section: 'acRecordSection', needs: null },
  saving:    { tab: 'accumulation', sub: null,             section: null,              needs: null },
  onCourse:  { tab: 'accumulation', sub: null,             section: 'acOnTrack',      needs: null },
  hold:      { tab: 'transition',   sub: null,             section: null,              needs: null },
  move:      { tab: 'transition',   sub: null,             section: null,              needs: null },
  /** The rotation's guided switch (holdings-and-move.md §3.7, decision 7): the strategy page of the ladder + rotation, where the planner records the switch. `page` names the strategy page to open. */
  rotation:  { tab: 'strategies',   sub: null,             section: 'stratPage',       needs: null, page: 'gilt-rotation' },
  budget:    { tab: 'budget',       sub: null,             section: null,              needs: null },
  household: { tab: 'household',    sub: null,             section: null,              needs: null },
  /** No plan: the planner's sign-in screen. A window holding plans made without an account goes through "keep this work". */
  signin:    { tab: null,           sub: null,             section: null,              needs: null }
});

/** The sub-tab attribute a tab's sub-pages use. */
export const SUB_ATTR = Object.freeze({ stress: 'data-stresstab', decision: 'data-decisiontab' });

/** '#/plans', '#/plan/<id>' or '#/plan/<id>/<step>', nothing else. */
export function backOk(back) {
  if (typeof back !== 'string') return false;
  if (back === '#/plans') return true;
  const m = /^#\/plan\/([^/]+)(?:\/([^/]+))?$/.exec(back);
  return !!m && PLAN_ID.test(m[1]) && (m[2] === undefined || STEP.test(m[2]));
}

/**
 * The request as the preview writes it. `planId` may be null for the `signin` place only. `month` ('YYYY-MM') is the
 * month to record and is carried only when given: every other request keeps the shape it always had.
 * @returns {string|null} JSON text, or null when the request would be refused on reading
 */
export function makeRequest({ planId = null, place, back, at, month = null }) {
  const r = { v: REQUEST_VERSION, planId, place, back, at, ...(month != null ? { month } : {}) };
  return readRequest(JSON.stringify(r), Date.parse(at)).ok ? JSON.stringify(r) : null;
}

/**
 * Check a stored request. Refused: unreadable text, an unknown version, a place not on the list, a plan id that is not
 * one, a way back that is not a plan page, a month that is not 'YYYY-MM' (when one is carried), or one more than ten
 * minutes old.
 * @param {string|null} text
 * @param {number} nowMs
 * @returns {{ ok: true, request: { v, planId, place, back, at, month? } } | { ok: false, why: string }}
 */
export function readRequest(text, nowMs) {
  if (text == null) return { ok: false, why: 'none' };
  let r = null;
  try { r = JSON.parse(text); } catch { return { ok: false, why: 'unreadable' }; }
  if (!r || typeof r !== 'object') return { ok: false, why: 'unreadable' };
  if (r.v !== REQUEST_VERSION) return { ok: false, why: 'version' };
  if (!PLACES[r.place]) return { ok: false, why: 'place' };
  if (r.place === 'signin' ? r.planId !== null : !(typeof r.planId === 'string' && PLAN_ID.test(r.planId))) return { ok: false, why: 'plan' };
  if (!backOk(r.back)) return { ok: false, why: 'back' };
  if (r.month !== undefined && !(typeof r.month === 'string' && MONTH.test(r.month))) return { ok: false, why: 'month' };
  const at = Date.parse(r.at);
  if (!Number.isFinite(at) || nowMs - at > REQUEST_MAX_AGE_MS || at - nowMs > 60 * 1000) return { ok: false, why: 'old' };
  return { ok: true, request: { v: r.v, planId: r.planId, place: r.place, back: r.back, at: r.at, ...(r.month !== undefined ? { month: r.month } : {}) } };
}

/** The words the classic planner shows at the top of the page it opened (5.4 step 4); the page it came from is the site's front page, PensionTools (7.1.0; Drawdown Planner in 7.0). */
export const OPEN_PLACE_WORDS = Object.freeze({
  opened: 'Opened from PensionTools.',
  back: 'Back to PensionTools',
  /** {name}: the plan opened here; {other}: the plan the account opens on. */
  thisWindow: '‘{name}’ is open in this window only. Your other windows and devices stay on ‘{other}’.',
  notHere: 'That plan is not in this account.',
  signedIn: 'Signed in.',
  backToPlans: 'Back to your plans in PensionTools'
});
