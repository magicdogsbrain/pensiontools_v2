/**
 * "Move to a new plan" in the planner (6.56.0, research/plan-start.md §2 I; the rules are services/PlanClose.js, what closed
 * means services/PlanClosed.js).
 *
 * Where it is offered: Stress tester → Settings, on a line beside the lock (#ssPlanClose, under the lock's banner). That is
 * where a locked plan says how it can be changed — every refusal of a locked plan's change sends the person there ("unlock
 * it in Stress tester → Settings") — and closing is the other way to change a plan someone has lived on: unlocking rewrites
 * the plan they have lived on; moving keeps it and carries on in a new one. The plan list makes copies, which is a different
 * thing (a copy is not linked to its plan, and the plan it came from carries on).
 *
 * The line says, by the plan:
 *   - a plan offered the move (PlanClose.closeOfferOf): what moving does, and "Move to a new plan…"; and, when the plan knows
 *     the person's age, the second reason beside it, "I'm going back to work…" (research/plan-start.md §2 J: the same close,
 *     and a saving plan carries it on until work stops again);
 *   - a closed plan: nothing here — its lock banner says "Closed March 2029; carried on as ‘…’." with a button that opens it;
 *   - a plan that carries one on: "Under your previous plan ‘…’ until March 2029 — its months are there." and a button that
 *     opens it.
 * The question (the page's own appConfirm) says exactly what happens and asks the month, the new plan's name, the pots (boxes
 * filled in from what is known, PlanClose.closePotsOf), and — when this plan is linked with a partner's, either way —
 * whether the link moves to the new plan. Going back to work it asks, too, when work is expected to stop again (a month, or
 * an age: PlanClose.workingStopOf) and says the limit on what goes into pensions the new plan will carry when money has been
 * taken from the pension flexibly (services/FlexibleAccess.js). Without an account the three-plan cap holds, as for New plan and Duplicate.
 * Then the writes, each the planner's own: the new plan created (FirestoreService.createScenario), the old plan closed
 * (saveScenario, which checks the close against the plan as stored: LockedPlanGuard), the partner's plan re-pointed when
 * asked, and the new plan opened.
 *
 *   installPlanClose(win, doc, deps)   win.renderPlanClose, win.movePlanToNew, win.openPlanById
 *   planReadDay()                      the day the open plan is read on (a closed plan: the end of its last month)
 *   stressLockBannerHtml(o)            the lock banner's words in Stress → Settings (a closed plan's has no unlock)
 *   decisionLockBannerHtml(o)          the Decision tool's lock banner (a closed plan's has no unlock)
 *   planDocumentMay(win), planDocumentEmptyHtml(locked), paintPlanDocumentTools(doc)   no new plan document on a closed plan
 *   planNoticeHtml()                   the closed / carried-on line above the plan document and Where you are
 *   drawClosedTransition(box)          What you hold and the Transition on a closed plan, to read
 *   taxYearTabsFor(years, doc)         no tax year after a closed plan's close, and no "+ Add Year"
 *   householdPickerFor(doc, plan)      the partner picker, read-only on a closed plan
 *   closedTimingSummary(summary)       the Timing summary of a closed plan, read as at its close
 *   successorNameOf()                  the name of the plan that carries the open plan on, for the next-step banner
 *   plansInListOrder(list), planListDesc(plan)   the plan menu: previous (closed) plans last, each saying so
 *
 * index.html keeps one call for each (tests/v7/shellRatchet.test.js): installLockedStart installs this, and
 * renderLockedStart draws the line.
 */
import { getActiveScenarioAsStored, getActiveScenarioAsync, switchScenario, invalidateScenarioCache } from '../storage/ScenarioRepository.js';
import { loadAllScenarios, createScenario, saveScenario } from '../firebase/FirestoreService.js';
import { closeQuestionOf, successorOf, closeWrite, partnerWrites, successorName, workingStopOf } from '../services/PlanClose.js';
import { flexibleAccessWords } from '../services/FlexibleAccess.js';
import { closedReading, beforeReading, closedWords, beforeWords, readDayOf, planNameOf, monthWordsOf, monthBefore, isClosedPlan, closedAtOf, closesAhead } from '../services/PlanClosed.js';
import { normaliseHoldings } from '../services/HoldingsRecord.js';
import { uniqueName } from '../services/PlanFromSeed.js';
import { taxYearLabel, deriveTiming, taxYearOfMonth } from '../services/PlanTiming.js';
import { laterDraftOf, laterDraftSentence } from '../services/PlanMove.js';
import { isGuest, isLoggedIn } from '../firebase/AuthService.js';
import { guestPlanRefusal } from '../services/GuestPlans.js';
import { OPEN_PLACE_KEY, makeRequest } from '../services/OpenPlace.js';
import { parseMonth } from '../answers/plan/about.js';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** The words of the line and the question (one place, so the tests read them). */
export const PLAN_CLOSE_WORDS = Object.freeze({
  offer: 'Moving to another plan? You can close this one at a month you choose and carry on in a new plan made from its figures. This plan and its months stay here to read.',
  offerBtn: 'Move to a new plan…',
  title: 'Move to a new plan',
  ok: 'Close this plan and make the new one',
  cancel: 'Not now',
  working: 'Making the new plan and closing this one…',
  // back to work (research/plan-start.md §2 J)
  offerWorking: 'Going back to work? Close it when work starts again and carry on in a saving plan made from its figures until you stop again.',
  offerWorkingBtn: 'I’m going back to work…',
  titleWorking: 'I’m going back to work',
  okWorking: 'Close this plan and start saving',
  workingNew: 'The new plan is a saving plan, not locked: say what you and your employer pay in on its Accumulation page, and record your pot there. Its income steps keep their ages and it ends at the same age; the plan you draw on starts when you stop again.',
  stopAsk: 'When do you expect to stop work again? A month, or an age if you are not sure of the month.',
  stopProblems: {
    noStop: 'Say when you expect to stop work again: a month, or an age.',
    notAMonth: 'Give the month you expect to stop as a month and a year, for example June 2030 or 2030-06.',
    notAnAge: 'Give the age you expect to stop at as a whole number, 85 at most.',
    stopTooSoon: 'The stop must come after the month you go back to work, and after this month.',
    stopAgeTooSoon: 'Give an age older than you are today, which you reach after the month you go back to work.',
    stopTooLate: 'That stop leaves fewer than five years of the plan before the age it ends at: change the plan’s end age first, or stop earlier.',
    noAge: 'This plan does not say how old you are: give your age in the Timing block first.'
  }
});

/** The day the open plan is read on (PlanClosed.readDayOf): today, or the end of a closed plan's last month. */
export async function planReadDay() {
  const now = new Date();
  try { return readDayOf(await getActiveScenarioAsync(), now); } catch (e) { return now; }
}

/** The name of the plan that carries the open plan on (for the next-step banner), or null. */
export async function successorNameOf() {
  try {
    const sc = await getActiveScenarioAsync();
    const r = sc ? closedReading(sc, await loadAllScenarios()) : null;
    return r && r.next ? r.next.name : null;
  } catch (e) { return null; }
}

/** The open plan's close (PlanClosed.closedReading, the plan that carries it on looked up), or null: not closed, or unread. */
async function openClosedReading() {
  try { const sc = await getActiveScenarioAsync(); return sc && isClosedPlan(sc) ? closedReading(sc, await loadAllScenarios()) : null; } catch (e) { return null; }
}
/** The button that opens the plan that carries a closed one on (none when that plan is not here). */
const openNextBtn = (reading, cls = '') => (reading && reading.next ? '<button type="button"' + (cls ? ' class="' + cls + '"' : '') + ' data-on-click="openPlanById(\'' + esc(reading.next.id) + '\')">Open ‘' + esc(reading.next.name) + '’</button>' : '');

/**
 * The lock banner's words in Stress → Settings (moved here from index.html's refreshStressLock, word for word), and a closed
 * plan's: closed, carried on as …, no unlock (a closed plan is never unlocked).
 * @param {{ when: string, lockedBy?: string|null, hasDocument: boolean }} o
 */
export async function stressLockBannerHtml({ when, lockedBy = null, hasDocument }) {
  const reading = await openClosedReading();
  const docBtn = hasDocument ? '<button type="button" data-on-click="openPlanDocument()">Open plan document</button>' : '';
  if (reading) {
    const keeps = reading.ahead ? ' Its settings and its plan document stay as they are, and nothing of it is unlocked; record its months up to the close here.'
      : ' This plan is kept as it was: its settings, ' + (hasDocument ? 'its plan document ' : '') + 'and its months up to the close stay here to read, and nothing of it changes again.';
    return '<span>🔒 <strong>' + esc(closedWords(reading)) + '</strong>' + keeps + '</span>'
      + '<span style="display:flex;gap:8px;flex-wrap:wrap;">' + docBtn + openNextBtn(reading) + '</span>';
  }
  return '<span>🔒 <strong>This plan is locked</strong>' + (when ? ' (since ' + when + (lockedBy ? ', ' + esc(lockedBy) : '') + ')' : '') + '. Its settings are frozen for both tools' + (hasDocument ? ', and the plan document records what you committed to.' : ' — but it has no plan document yet.') + ' What-ifs still run under "Try a strategy"; to change the plan, unlock it or duplicate it.</span>'
    + '<span style="display:flex;gap:8px;flex-wrap:wrap;">' + (hasDocument ? docBtn : '<button type="button" data-on-click="createPlanDocumentNow()">Create the plan document now</button>') + '<button type="button" class="secondary" data-on-click="unlockDecisionSettings()">Unlock to edit…</button></span>';
}

/**
 * The Decision tool's lock banner (moved here from index.html's refreshDecisionLock, word for word), and a closed plan's:
 * its settings are kept, with no "Unlock to edit…" — a closed plan is never unlocked (PlanLock.unlockPlan refuses it before
 * anything is written, and the store refuses each write of it).
 * @param {{ what: string, verb: string }} o  what was recorded against the settings, in words, and 'was' | 'were'
 */
export async function decisionLockBannerHtml({ what, verb }) {
  const reading = await openClosedReading();
  if (reading) return '<span>🔒 <strong>' + esc(closedWords(reading)) + '</strong> These settings are kept as they are: a closed plan is never unlocked. ' + (reading.ahead ? 'Record its months up to the close here.' : 'Its months stay here to read.') + '</span>' + openNextBtn(reading);
  return '<span>🔒 <strong>These settings are locked</strong> because ' + (what ? what + ' ' + verb + ' recorded against them' : 'entries have been recorded against them') + '. You can unlock and edit — the consequences are explained first.</span>' +
    '<button type="button" data-on-click="unlockDecisionSettings()">Unlock to edit…</button>';
}

/**
 * May the plan document be written now ("Create the plan document now", "Write a new version from today's settings")?
 * Signed in, and not on a closed plan: its document stays as it was when it closed (the store refuses the write too). When
 * not, the page's toast says why, and false comes back before anything is archived or run.
 * @param {Window} win  the page (its showToast)
 */
export async function planDocumentMay(win) {
  const no = (why, type) => { if (win && typeof win.showToast === 'function') win.showToast(why, type); return false; };
  if (!isLoggedIn()) return no('Please sign in first', 'error');
  if (await openClosedReading()) return no('This plan is closed: its plan document stays as it was when it closed.', 'info');
  return true;
}

/** The Plan document page with no document (moved here from index.html, word for word), and a closed plan's: none is written. */
export async function planDocumentEmptyHtml(locked) {
  const reading = await openClosedReading();
  if (reading) return '<div class="card"><h2>Plan document</h2><p data-testid="planDocument.closedNone">' + esc(closedWords(reading)) + ' This plan closed without a plan document: its months were recorded against its settings, and it is kept as it was. Its months are under History.</p>' + openNextBtn(reading, 'secondary') + '</div>';
  return '<div class="card"><h2>Plan document</h2><p>' + (locked ? 'This plan is locked but has no plan document yet — it was locked before plan documents existed.' : 'The plan document is written when you lock the plan: Stress Tester → Settings → <strong>Lock plan &amp; create the plan document</strong>. It records what you committed to, and this page then shows where you are against it each month.') + '</p>'
    + (locked ? '<button type="button" data-on-click="createPlanDocumentNow()">Create the plan document now</button>' : '') + '</div>';
}

/** "Write a new version from today's settings" is not offered on a closed plan (its document stays as it was). */
export async function paintPlanDocumentTools(doc) {
  const btn = doc.getElementById('pdNewVersionBtn');
  if (btn) btn.style.display = (await openClosedReading()) ? 'none' : '';
}

/**
 * The one line the plan document and Where you are carry above their reading (research/plan-start.md §2 I): a closed plan's
 * "Closed March 2029; carried on as ‘…’." and, on the plan that carries one on, "Under your previous plan ‘…’ until March
 * 2029 — its months are there." HTML, or '' for every other plan.
 */
export async function planNoticeHtml() {
  try {
    const sc = await getActiveScenarioAsync();
    if (!sc) return '';
    const all = await loadAllScenarios();
    const closed = isClosedPlan(sc) ? closedReading(sc, all) : null;
    const before = closed ? null : beforeReading(sc, all);
    const text = closed ? closedWords(closed) : before ? beforeWords(before) : '';
    return text ? '<p class="pd-notice" data-testid="planNotice"><strong>' + esc(text) + '</strong></p>' : '';
  } catch (e) { return ''; }
}

/**
 * What you hold and the Transition on a closed plan (research/plan-start.md §2 I): the record moved to the plan that carries
 * it on, so it is drawn to read — no boxes, no Add, Paste or Save, no list of moves and no tick-offs (the store refuses each
 * of those writes) — with the way to that plan. Draws into `box` and says true for a closed plan; false (nothing drawn) else.
 */
export async function drawClosedTransition(box) {
  let sc = null;
  try { sc = await getActiveScenarioAsync(); } catch (e) { return false; }
  if (!sc || !isClosedPlan(sc)) return false;
  const reading = await openClosedReading();
  const lines = (normaliseHoldings(sc.holdings).lines || []).filter((l) => l && +l.value > 0);
  const moved = reading && reading.next ? 'What you hold moved to ‘' + reading.next.name + '’ when this plan closed: change it there.' : 'What you hold moved to the plan that carried this one on when it closed.';
  const table = lines.length ? '<p class="hint">As it stood then:</p><ul style="margin:4px 0 0 18px;">' + lines.map((l) => '<li>' + esc(l.name || l.ticker || '') + ' (' + esc(l.wrapper || '') + '): £' + Math.round(+l.value).toLocaleString('en-GB') + '</li>').join('') + '</ul>' : '';
  box.innerHTML = '<div class="card" id="holdingsCard"><h2>What you hold</h2><p data-testid="transition.closed">' + esc(moved) + '</p>' + (reading && reading.next ? '<p>' + openNextBtn(reading) + '</p>' : '') + table + '</div>';
  return true;
}

/**
 * The tax years Month by month's Tax Years page lists, and its "+ Add Year" shown or not: on a closed plan, none after the
 * tax year of its last month and no Add (those years are the plan's that carries it on). Every other plan's, as given.
 */
export async function taxYearTabsFor(years, doc) {
  let c = null;
  try { c = closedAtOf(await getActiveScenarioAsync()); } catch (e) { c = null; }
  const add = doc && doc.querySelector('.tax-year-add-btn'); if (add) add.style.display = c ? 'none' : '';
  if (!c) return years;
  const last = taxYearOfMonth(c);
  return (Array.isArray(years) ? years : []).filter((k) => { const a = parseInt(String(k), 10); return !Number.isFinite(a) || (a < 100 ? 2000 + a : a) <= last; });
}

/** The Household page's partner picker (index.html's hhPartnerSelect): on a closed plan it is read, not changed. */
export function householdPickerFor(doc, plan) {
  const sel = doc.getElementById('hhPartnerSelect');
  if (sel) sel.disabled = isClosedPlan(plan);
  return sel;
}

/**
 * The Timing block's summary on a closed plan, read as at its close (Where you are and the document read it there): "today is
 * plan year N" counted on past the close is replaced by the year it closed in. Every other plan's, as given.
 */
export async function closedTimingSummary(summary) {
  let sc = null;
  try { sc = await getActiveScenarioAsync(); } catch (e) { return summary; }
  // a draft read from an earlier start than it saved (7.4.0, PlanMove.laterDraftOf, on the plan as stored): said once, first
  let later = null;
  try { const st = await getActiveScenarioAsStored(); later = st ? laterDraftOf(st, (st.stressTool && st.stressTool.settings) || {}, new Date()) : null; } catch (e) { later = null; }
  const words = closedTimingWords(summary, sc);
  return later ? laterDraftSentence(later) + ' ' + words : words;
}
/** closedTimingSummary's words for a plan (pure but for the clock): the summary as given for a plan that is not closed. */
export function closedTimingWords(summary, plan, now = new Date()) {
  const c = closedAtOf(plan);
  if (!c || closesAhead(plan, now)) return summary;
  const t = deriveTiming((plan.stressTool && plan.stressTool.settings) || {}, readDayOf(plan, now));
  const year = Number.isFinite(t.planYearNow) && t.planYearNow >= 0 ? t.planYearNow : null;
  return String(summary || '').replace(/; today is plan year \d+( of \d+)?\./, '.') + ' This plan closed at the end of ' + monthWordsOf(c) + (year != null ? ', in plan year ' + year : '') + '.';
}

/** The plan menu's order: the plans in use as they come, then the previous (closed) plans. */
export function plansInListOrder(list) {
  const all = Array.isArray(list) ? list : [];
  const previous = (p) => { const r = closedReading(p); return !!r && !r.ahead; };
  return [...all.filter((p) => !previous(p)), ...all.filter(previous)];
}
/**
 * The plan menu's second line: "Previous plan — closed March 2029" for a closed plan ("Closes at the end of March 2029" while
 * that month is still to come, and it is still listed with the plans in use), else the plan's description.
 */
export function planListDesc(plan) {
  const r = closedReading(plan);
  if (r && r.ahead) return 'Closes at the end of ' + r.month;
  if (r) return 'Previous plan — closed ' + r.month;
  return (plan && plan.planDetails && plan.planDetails.description) || (plan && plan.description) || '';
}

/** The line's HTML for a plan (pure): closed, carrying one on, offered the move (and going back to work), or nothing. */
export function planCloseLineHtml({ closed = null, before = null, offered = false, working = false }) {
  if (closed) return '<span>' + esc(closedWords(closed)) + '</span>' + (closed.next ? '<span><button type="button" data-on-click="openPlanById(\'' + esc(closed.next.id) + '\')">Open ‘' + esc(closed.next.name) + '’</button></span>' : '');
  if (before) return '<span>' + esc(beforeWords(before)) + '</span>' + (before.previous ? '<span><button type="button" class="secondary" data-on-click="openPlanById(\'' + esc(before.previous.id) + '\')">Open ‘' + esc(before.previous.name) + '’</button></span>' : '');
  if (offered) return '<span>' + esc(PLAN_CLOSE_WORDS.offer) + (working ? ' ' + esc(PLAN_CLOSE_WORDS.offerWorking) : '') + '</span><span style="display:flex;gap:8px;flex-wrap:wrap;"><button type="button" class="secondary" data-on-click="movePlanToNew()">' + esc(PLAN_CLOSE_WORDS.offerBtn) + '</button>'
    + (working ? '<button type="button" class="secondary" data-on-click="movePlanToNew(\'working\')" data-testid="planClose.working">' + esc(PLAN_CLOSE_WORDS.offerWorkingBtn) + '</button>' : '') + '</span>';
  return '';
}

/**
 * The question's HTML (pure), from PlanClose.closeQuestionOf: what happens, then the month, the name, the pots (boxes when
 * nothing is recorded as held), and the partner's link.
 */
export function planCloseQuestionHtml(q, { name, reason = 'plan' }) {
  const working = reason === 'working';
  const month = q.months.find((m) => m.month === q.suggested) || q.months[0];
  const opts = q.months.map((m) => '<option value="' + m.month + '"' + (m.month === month.month ? ' selected' : '') + '>From ' + esc(m.words) + (working ? '' : ' (tax year ' + esc(taxYearLabel(m.taxYear)) + ')') + '</option>').join('');
  const p = q.pots;
  // always asked (PlanClose.closePotsOf): boxes filled in from what is known, and where each figure came from
  const pots = '<p style="margin:8px 0 4px;" data-testid="planClose.potsFrom">' + esc(potsAskWords(q)) + '</p>'
    + '<label style="display:block;margin:4px 0;">Pension pot (£) <input type="number" id="pcPension" min="0" step="1000" value="' + Math.round(p.pension) + '" style="width:9em;"></label>'
    + '<label style="display:block;margin:4px 0;">ISAs (£) <input type="number" id="pcIsa" min="0" step="1000" value="' + Math.round(p.isa) + '" style="width:9em;"></label>'
    + '<label style="display:block;margin:4px 0;">Ordinary investment account (£) <input type="number" id="pcGia" min="0" step="1000" value="' + Math.round(p.gia) + '" style="width:9em;"></label>';
  const partner = q.partner
    ? '<label style="display:block;margin:8px 0;"><input type="checkbox" id="pcPartner" checked> Link ‘' + esc(q.partner.name) + '’ with the new plan as your partner’s plan instead of this one (and the budget you share, when you share one).</label>'
    : '';
  if (working) {
    // back to work (§2 J): when work starts again, when it is expected to stop again, and the limit the new plan carries
    const stop = '<p style="margin:8px 0 4px;">' + esc(PLAN_CLOSE_WORDS.stopAsk) + '</p>'
      + '<label style="display:block;margin:4px 0;">Month <input type="month" id="pcStopMonth" placeholder="2030-06" style="width:11em;"></label>'
      + '<label style="display:block;margin:4px 0;">or at age <input type="number" id="pcStopAge" min="' + ((q.ageNow || 17) + 1) + '" max="85" step="1" style="width:6em;"></label>';
    const fa = q.flexibleAccess ? '<p style="margin:6px 0;" data-testid="planClose.flexibleAccess">' + esc(flexibleAccessWords(q.flexibleAccess.since)) + ' The new plan says so on its Accumulation page.</p>' : '';
    return '<h3 style="margin:0 0 8px;">' + esc(PLAN_CLOSE_WORDS.titleWorking) + '</h3>'
      + '<label style="display:block;margin:0 0 6px;">Back to work <select id="pcMonth">' + opts + '</select></label>'
      + '<p id="pcSays" style="margin:6px 0;">' + esc(closeSays(q, month.month, 'working')) + '</p>'
      + '<p style="margin:6px 0;">' + esc(PLAN_CLOSE_WORDS.workingNew) + '</p>'
      + stop + fa + pots
      + '<label style="display:block;margin:8px 0 0;">Name of the new plan <input type="text" id="pcName" value="' + esc(name) + '" style="width:100%;"></label>'
      + partner;
  }
  return '<h3 style="margin:0 0 8px;">' + esc(PLAN_CLOSE_WORDS.title) + '</h3>'
    + '<label style="display:block;margin:0 0 6px;">Move <select id="pcMonth">' + opts + '</select></label>'
    + '<p id="pcSays" style="margin:6px 0;">' + esc(closeSays(q, month.month)) + '</p>'
    + '<p style="margin:6px 0;">The new plan is made from this plan’s figures and is not locked, so you can change anything in it before you lock it. Its income steps keep their ages, the plan ends at the same age, and the month you stopped work is kept.</p>'
    + pots
    + '<label style="display:block;margin:8px 0 0;">Name of the new plan <input type="text" id="pcName" value="' + esc(name) + '" style="width:100%;"></label>'
    + partner;
}

/** The new plan is one more plan: without an account the three-plan cap holds here as for New plan and Duplicate (V7's 'full'). */
export function closeCapRefusal(all, guest) {
  return guest ? guestPlanRefusal(all) : null;
}

/**
 * The pots as the question's boxes were left: { pension, isa, gia }, or null when the pension is not a figure of £0 or more —
 * an emptied box is no figure (V7's reducer reads it so), never £0. The ISAs and the ordinary account left empty are £0.
 */
export function potsFromAnswers(answers) {
  const fig = (v) => (v == null || String(v).trim() === '' ? NaN : +v);
  const pots = { pension: fig(answers && answers.pension), isa: fig(answers && answers.isa) || 0, gia: fig(answers && answers.gia) || 0 };
  return Number.isFinite(pots.pension) && pots.pension >= 0 && pots.isa >= 0 && pots.gia >= 0 ? pots : null;
}

/** The line above the pots' boxes: where they were filled in from, and that What you hold moves with the plan. */
export function potsAskWords(q) {
  return 'Put in what you hold today. The boxes are filled in from ' + q.potsFrom + '.' + (q.held ? ' What you hold moves to the new plan.' : '');
}

/** What the close does at a month, in one sentence (going back to work: the saving plan takes the months from then). */
export function closeSays(q, month, reason = 'plan') {
  const m = q.months.find((x) => x.month === month) || q.months[0];
  const kept = '‘' + q.name + '’ closes at the end of ' + monthWordsOf(monthBefore(m.month)) + ' and is kept as it is: its ' + (q.records === 1 ? 'recorded month stays' : q.records + ' recorded months stay') + ' here to read, and nothing after ' + monthWordsOf(monthBefore(m.month)) + ' can be recorded on it.';
  if (reason === 'working') return kept + ' The new saving plan takes the months from ' + m.words + '.';
  return kept + ' The new plan’s first tax year is ' + taxYearLabel(m.taxYear) + '; it takes the months from ' + m.words + '.';
}

/**
 * The second stop as the question's boxes were left: { month } when a month is given (the month box), else { age } — the
 * age box as typed; checked by PlanClose.workingStopOf, whose problem is said in words (PLAN_CLOSE_WORDS.stopProblems).
 * The month is read as V7 reads it (answers/plan/about.js parseMonth): a browser with no month picker shows the box as
 * text, and "June 2030", "2030-06" or "6/2030" are all the same month; anything else goes on as typed, to be refused.
 */
export function stopFromAnswers(answers) {
  const m = answers && typeof answers.stopMonth === 'string' ? answers.stopMonth.trim() : '';
  const p = m ? parseMonth(m) : null;
  if (m) return { month: p ? p.y + '-' + String(p.m).padStart(2, '0') : m, age: null };
  return { month: null, age: answers && answers.stopAge != null && String(answers.stopAge).trim() !== '' ? String(answers.stopAge).trim() : null };
}

/**
 * The name box as the month changes: still the default name for the month it was on (not typed over), it becomes the new
 * month's default; typed over, it stays as typed. `nameFor(month)` is the default name for a month.
 */
export function nameAfterMonth(current, { from, to, nameFor }) {
  return from !== to && String(current == null ? '' : current) === nameFor(from) ? nameFor(to) : current;
}

/**
 * @param {Window} win
 * @param {Document} doc
 * @param {object} deps  the page's showLoading and hideLoading
 */
export function installPlanClose(win, doc, deps = {}) {
  const toast = (m, t, ms) => win.showToast(m, t, ms);

  /**
   * Open another plan, as the plan menu does (switch, then the page loaded again). Without an account the page would open
   * on its landing page after the reload, so the plan is handed to it as the preview hands one over (OpenPlace.js): the
   * planner opens straight on it, at its Timing block, where its first tax year and what came before it are said — or, for a
   * saving plan made on going back to work, at its Accumulation page (`place` 'saving'), where what goes in is asked.
   */
  async function reopenOn(id, place = 'about') {
    await switchScenario(String(id));
    invalidateScenarioCache();
    if (isGuest()) { try { win.sessionStorage.setItem(OPEN_PLACE_KEY, makeRequest({ planId: String(id), place, back: '#/plan/' + String(id), at: new Date().toISOString() })); } catch (e) { /* the landing page then: the plan is still the open one */ } }
    win.location.reload();
  }

  win.renderPlanClose = async function () {
    const el = doc.getElementById('ssPlanClose'); if (!el) return;
    let html = '';
    try {
      const sc = await getActiveScenarioAsStored();
      if (sc) {
        const all = await loadAllScenarios();
        const closed = closedReading(sc, all), before = closed ? null : beforeReading(sc, all);
        const q = closed ? null : closeQuestionOf(sc, { now: new Date(), plans: all });
        // a closed plan's lock banner says it is closed (stressLockBannerHtml); a plan that carries one on says so here, and is
        // offered the move too once it has been lived on
        html = closed ? '' : (before ? planCloseLineHtml({ before }) : '') + (q ? planCloseLineHtml({ offered: true, working: q.working }) : '');
      }
    } catch (e) { html = ''; }
    el.innerHTML = html; el.style.display = html ? 'flex' : 'none';
  };

  win.openPlanById = async function (id) {
    if (!id) return;
    try { await reopenOn(id); } catch (e) { toast('Could not open that plan: ' + e.message, 'error'); }
  };

  /**
   * One question at a time. The plans are read before the question is drawn, so a double click reached the button again in
   * that wait and stacked a second question on the first; answering both made two new plans with the same name (and the
   * second close was refused, after its plan was made). A move under way — asked, or being made — makes any other press do
   * nothing until it is done.
   */
  let moving = false;
  win.movePlanToNew = async function (why) {
    if (moving) return;
    moving = true;
    try { await moveOnce(why); } finally { moving = false; }
  };

  async function moveOnce(why) {
    const now = new Date();
    const reason = why === 'working' ? 'working' : 'plan';
    let sc = null, all = [];
    try { sc = await getActiveScenarioAsStored(); all = await loadAllScenarios(); } catch (e) { sc = null; }
    const q = sc ? closeQuestionOf(sc, { now, plans: all }) : null;
    if (!q || (reason === 'working' && !q.working)) { toast(q ? PLAN_CLOSE_WORDS.stopProblems.noAge : 'This plan cannot be moved to a new one: it is closed already, still to stop work, or a draft with nothing recorded.', 'info', 6000); return; }
    const full = closeCapRefusal(all, isGuest());
    if (full) { toast(full, 'info', 8000); return; }
    const answers = { month: q.suggested, name: '', pension: null, isa: null, gia: null, partner: !!q.partner, stopMonth: '', stopAge: '' };
    const nameFor = (m) => uniqueName(successorName(sc, m, reason), all.map(planNameOf));
    const asked = win.appConfirm({ html: planCloseQuestionHtml(q, { name: nameFor(q.suggested), reason }) }, { okLabel: reason === 'working' ? PLAN_CLOSE_WORDS.okWorking : PLAN_CLOSE_WORDS.ok, cancelLabel: PLAN_CLOSE_WORDS.cancel, danger: false });
    // the question is on the page now (appConfirm draws it at once): its boxes are read as they change, since it is gone after
    const g = (id) => doc.getElementById(id);
    const read = () => {
      const from = answers.month;
      answers.month = g('pcMonth') ? g('pcMonth').value : answers.month;
      // the default name says the month: it follows the month chosen until the person types over it
      if (g('pcName')) g('pcName').value = nameAfterMonth(g('pcName').value, { from, to: answers.month, nameFor });
      answers.name = g('pcName') ? g('pcName').value : answers.name;
      if (g('pcPension')) { answers.pension = g('pcPension').value; answers.isa = g('pcIsa') ? g('pcIsa').value : null; answers.gia = g('pcGia') ? g('pcGia').value : null; }
      answers.partner = g('pcPartner') ? g('pcPartner').checked : false;
      answers.stopMonth = g('pcStopMonth') ? g('pcStopMonth').value : ''; answers.stopAge = g('pcStopAge') ? g('pcStopAge').value : '';
      const says = g('pcSays'); if (says) says.textContent = closeSays(q, answers.month, reason);
    };
    read();
    for (const id of ['pcMonth', 'pcName', 'pcPension', 'pcIsa', 'pcGia', 'pcPartner', 'pcStopMonth', 'pcStopAge']) { const x = g(id); if (x) { x.addEventListener('input', read); x.addEventListener('change', read); } }
    if (!(await asked)) return;
    const name = uniqueName((answers.name || '').trim() || successorName(sc, answers.month, reason), all.map(planNameOf));
    const pots = potsFromAnswers(answers);
    if (!pots) { toast('Put in the pension pot you hold today (0 if none). Nothing was changed.', 'warning', 6000); return; }
    const stop = reason === 'working' ? stopFromAnswers(answers) : null;
    const checked = stop ? workingStopOf(sc, { month: answers.month, stop, now }) : null;
    if (checked && !checked.ok) { toast((PLAN_CLOSE_WORDS.stopProblems[checked.problem] || PLAN_CLOSE_WORDS.stopProblems.noStop) + ' Nothing was changed.', 'warning', 8000); return; }
    if (deps.showLoading) deps.showLoading(PLAN_CLOSE_WORDS.working);
    let newId = null, closed = false;
    try {
      const data = successorOf(sc, { month: answers.month, name, now, pots, keepPartner: !!(q.partner && answers.partner), reason, stop, plans: all });
      newId = await createScenario(data);
      if (!newId) throw new Error('the new plan could not be made');
      await saveScenario(sc.id, closeWrite(sc, { month: answers.month, nextPlanId: newId, now, reason }));
      closed = true;
      if (q.partner && answers.partner) {
        const partner = all.find((p) => String(p.id) === q.partner.id);
        const w = partner ? partnerWrites(partner, { oldId: sc.id, newId }) : null;
        if (w) { try { await saveScenario(partner.id, w); } catch (e) { toast('The new plan was made, but ‘' + q.partner.name + '’ could not be linked to it: link it on the Household page.', 'warning', 8000); } }
      }
      toast('‘' + planNameOf(sc) + '’ is closed; ‘' + name + '’ carries on from ' + monthWordsOf(answers.month) + (reason === 'working' ? ', saving until you stop again.' : '.'), 'success', 6000);
      await reopenOn(newId, reason === 'working' ? 'saving' : 'about');
    } catch (e) {
      console.error('Move to a new plan:', e);
      toast(closed ? '‘' + name + '’ was made and this plan closed, but the page could not open it: choose it from the plan menu.'
        : newId ? 'The new plan ‘' + name + '’ was made, but this plan could not be closed: ' + e.message + ' Delete the new plan from the plan menu, or try again.'
          : 'Could not make the new plan: ' + e.message + ' Nothing was changed.', 'error', 9000);
    } finally { if (deps.hideLoading) deps.hideLoading(); }
  }
}
