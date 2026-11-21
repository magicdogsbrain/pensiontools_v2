/**
 * The Household tab's results, as HTML from data (6.25.0; research/household-draw-split.md §4, usability audit §5
 * decision 5 option (a)). Pure: strings in, strings out — index.html's inline script only gathers the data and calls
 * these (it may only shrink: tests/v7/shellRatchet.test.js). The handlers named in data-on-click live in index.html.
 *
 *  - splitSectionHtml: the headline at the top of the tab ("Drawing together saves about £X a year in tax…"), the
 *    cost to the smaller pot, the two-column table ("As the two plans are written" / "Paid as a couple, tax first",
 *    household-draw-split.md 9.1), the closing line, the 2028 and ladder notes, the limit controls (the default limit
 *    shown as chosen; "None" is the fast split, 9.2) and the three choices (Use this split / Make copies / Keep things as they are).
 *  - verdictSectionHtml: the household verdict first (when one plan falls short the other pays), each plan's own reading second.
 *  - the timeline, what's-left, what-to-do, survivor and care sections, moved here from the inline script unchanged in
 *    substance.
 */

import { isOnCourse, onCourseAlertClass, jointVerdictHtml, ON_COURSE_WORDS } from '../services/OnCourse.js';
import { markFact, markWithin, fillHtml, tableAttr, cellAttr } from '../reading/mark.js';
import { TABLES } from '../reading/facts.js';
import { WAY } from '../v7/copy/way.js';
import { futuresOutOfTen, pctBesideWords } from '../services/OneAnswer.js';
import { headlineWords, about, noSplitWords } from '../services/HouseholdDraw.js';
import { HOUSEHOLD } from '../v7/copy/household.js';
import { planEndAgeOf } from '../services/PlanTiming.js';
import { householdStartsOf, startsSlotsOf } from '../services/HouseholdStarts.js';
import { todayOf } from '../reading/clock.js';
import { householdVerdictOf, householdYearsOf, householdLeftOf } from '../answers/plan/household.js';
import { CHECK_DEFAULTS as D } from '../answers/plan/household.js';   // the survivor and care checks' one set of starting figures (step F6)
import { householdSlotMarks, householdRowFact, HOUSEHOLD_LEAD_FINDS } from '../reading/sentenceMarks.js';   // the survivor and care checks' one set of starting figures (step F6)

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const gbp = (n) => '£' + Math.round(+n || 0).toLocaleString('en-GB');
const fill = (text, slots) => String(text || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
// In words (6.33.0): the whole count said "10 in 10" from 95% and "9 in 10" from 85% — the words do not.
const inTen = (share) => futuresOutOfTen(+share || 0).words.replace(/^in /, '');
/** The age a plan is tested until: the one end age (PlanTiming.planEndAgeOf), or null. */
const endAgeOf = (s, now) => (s ? planEndAgeOf(s, now) : null);

/**
 * The household verdict in words, pooled first, in the simple view's sentences (7.12.0): until when each plan is tested,
 * and — when one plan fell short and the other paid — whose plan, in that person's ages. `o`: { ownName, pName, setA, setB }.
 */
export function householdVerdictHtml(r, o = {}) {
  const C = HOUSEHOLD.verdict;
  const names = { a: o.ownName || 'This plan', b: o.pName || 'Partner' };
  const now = o.now instanceof Date ? o.now : new Date();
  // the one reader of the verdict's words (answers/plan/household.js householdVerdictOf), as the simple view says them (step F6)
  const v = householdVerdictOf({ combined: r }, names, o.offsets || null, { a: endAgeOf(o.setA, now), b: endAgeOf(o.setB, now) });
  if (!v) return '';
  let s = '<strong>' + esc(C.head[v.head]) + '.</strong> ' + fillHtml(C.headline, { words: v.words }, { words: 'household.chance' });
  if (v.tested) s += ' ' + fillHtml(v.tested.same ? C.tested : C.testedTwo, v.tested, householdSlotMarks('tested', v.tested, names.a));
  if (v.pooled) {
    s += ' ' + esc(C.pooled);
    for (const x of v.covered) s += ' ' + fillHtml(x.earliest ? C.coveredEarliest : C.covered, x, householdSlotMarks('covered', x, names.a));
  } else {
    s += ' ' + jointVerdictHtml(v.share);
  }
  return s;
}

/** The line under the verdict's table: each plan's way of drawing, in the simple view's words (step F6). */
export function waysNoteHtml({ sids, ownName, pName, shifted = false }) {
  const C = HOUSEHOLD.verdict;
  const slots = { wayA: WAY.names[sids.a] || sids.a, wayB: WAY.names[sids.b] || sids.b, a: ownName, b: pName };
  return '<p class="hint" style="margin:6px 0 0;">' + fillHtml(C.ways, slots, householdSlotMarks('ways', slots, ownName)) + (shifted ? ' ' + esc(C.shifted) : '') + '</p>';
}

/**
 * The verdict section: the household first, then each plan on its own and the two as separate plans.
 * @param {{ r: object, ownName: string, pName: string, stratNote?: string, startsNote?: string, setA?: object, setB?: object }} o
 */
export function verdictSectionHtml({ r, ownName, pName, stratNote = '', startsNote = '', setA = null, setB = null, offsets = null, now = null }) {
  const C = HOUSEHOLD.verdict;
  const names = { a: ownName, b: pName };
  const v = householdVerdictOf({ combined: r }, names, offsets, { a: endAgeOf(setA, now || todayOf()), b: endAgeOf(setB, now || todayOf()) });
  const share = v ? v.share : (r.pooled ? r.pooled.success : r.jointSuccess);
  let html = '<div class="settings-section"><div class="section-title">The verdict</div>';
  html += '<div class="alert ' + onCourseAlertClass(share) + '" style="font-size:15px;" id="hhHouseholdVerdict">' + householdVerdictHtml(r, { ownName, pName, setA, setB, offsets, now: now || todayOf() }) + '</div>';
  // each plan on its own and both: the simple view's rows, the chance of each marked (household.#.chance)
  const cell = (x) => '<strong>' + esc(String(x.words).replace(/^in /, '')) + '</strong>' + (x.id === 'household' ? '' : ' <span class="hint">(' + markFact(householdRowFact(x.id), esc(x.pct + '%')) + ')</span>');
  html += '<table><tbody>'
    + (v ? v.rows : []).map((x) => { const slots = { name: x.name || '' }; return '<tr data-row="' + esc(x.id) + '"><td>' + fillHtml(C.rows[x.id], slots, householdSlotMarks('row', slots, ownName)) + '</td><td>' + cell(x) + '</td></tr>'; }).join('')
    + '</tbody></table>' + stratNote + (startsNote ? '<p class="hint" id="hhStartsNote" style="margin:6px 0 0;">' + esc(startsNote) + '</p>' : '');
  // what the check starts from (7.12.0): the simple view's sentence, from the same settings, its figures marked
  const st = setA && setB ? startsSlotsOf(householdStartsOf(setA, setB, names, offsets || {}, now || todayOf())) : null;
  if (st) html += '<p class="hint" id="hhStarts" style="margin:6px 0 0;">' + fillHtml(C.starts.line, st, householdSlotMarks('starts', st, ownName)) + '</p>';
  html += '<p style="font-size:12px;color:var(--text-muted);margin-top:6px;">'
    + 'Both plans face the <em>same</em> markets, so a bad decade hits you both at once: this check runs you both through '
    + 'identical futures instead of treating your plans as unrelated. On course ' + esc(ON_COURSE_WORDS) + '.</p></div>';
  return html;
}

/**
 * Where the money comes from, year by year (householdIncomeTimeline rows), in the simple view's words and column order
 * (7.12.0): the year as a calendar year, what the pots must find second, a plan past its last age said to have ended. The rows
 * and their figures are the one reader's (householdYearsOf; step F6), the cells marked as the table household.years.
 */
export function timelineSectionHtml(rows, ownName, pName, thisYear) {
  const T = HOUSEHOLD.detail.timeline;
  const years = householdYearsOf(rows, thisYear);
  let html = '<div class="settings-section"><div class="section-title">Where the money comes from, year by year</div>';
  const lastWaiting = years.filter((row) => row.beforeStatePension).pop();
  if (lastWaiting) {
    html += '<div class="alert alert-info" id="hhWaitingNote">Until <strong>' + (Number(lastWaiting.year) + 1) + '</strong> at least one of you is still waiting for a State Pension: those are the years when the pots do the most work.</div>';
  }
  // the simple view's column words, as written (not in capitals: a plan's name is shown as it is spelt, step F6)
  const th = (k, name) => '<th style="text-transform:none;">' + (name == null ? esc(T.columns[k]) : fillHtml(T.columns[k], { name }, householdSlotMarks('column', { name }, ownName))) + '</th>';
  html += '<div style="overflow-x:auto;"><table id="hhTimeline"' + tableAttr(TABLES.HOUSEHOLD_YEARS) + '><thead><tr>' + th('year') + th('draw') + th('a', ownName) + th('b', pName) + th('sp') + th('other') + '</tr></thead><tbody>';
  const need = (working, ended, v) => (working ? '<span class="hint">' + esc(T.working) + '</span>' : ended ? '<span class="hint">' + esc(T.ended) + '</span>' : esc(v));
  const td = (row, col, inner) => '<td' + cellAttr(row.year, col) + '>' + inner + '</td>';
  for (const row of years.filter((x) => x.shown)) {
    html += '<tr data-year="' + esc(row.year) + '"><td>' + esc(row.year) + '</td>' + td(row, 'draw', '<strong>' + esc(row.draw) + '</strong>') + td(row, 'a', need(row.workingA, row.endedA, row.needA)) + td(row, 'b', need(row.workingB, row.endedB, row.needB))
      + td(row, 'sp', esc(row.sp)) + td(row, 'other', esc(row.other)) + '</tr>';
  }
  html += '</tbody></table></div>'
    + '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">At today\'s prices, a year. Rows where something changes, and every fifth year. After a plan reaches its last age, nothing of that person\'s is counted: not their spending, their State Pension or their other income. "If one of you dies first", below, tries that properly.</p></div>';
  return html;
}

/** What you'd have left, combined (the potFan): every fifth year, the one reader's (householdLeftOf; step F6), marked as household.left. */
export function wealthSectionHtml(potFan, thisYear) {
  const L = HOUSEHOLD.detail.left;   // the simple view's title, words and columns (step F6)
  let html = '<div class="settings-section"><div class="section-title">' + esc(L.title) + '</div><p class="hint">' + esc(L.lead) + '</p>';
  html += '<div style="overflow-x:auto;"><table' + tableAttr(TABLES.HOUSEHOLD_LEFT) + '><thead><tr>' + ['year', 'p10', 'p50', 'p90'].map((c) => '<th>' + esc(L.columns[c]) + '</th>').join('') + '</tr></thead><tbody>';
  for (const f of householdLeftOf(potFan, thisYear)) {
    html += '<tr><td>' + esc(f.year) + '</td>' + ['p10', 'p50', 'p90'].map((c) => '<td' + cellAttr(f.year, c) + '>' + esc(f[c]) + '</td>').join('') + '</tr>';
  }
  html += '</tbody></table></div></div>';
  return html;
}

/** What to do about it, when the household is not on course. */
export function whatToDoHtml(r, ownName, pName) {
  const share = r.pooled ? r.pooled.success : r.jointSuccess;
  if (isOnCourse(share)) return '';
  const weakName = r.successA <= r.successB ? ownName : pName;
  const weakPct = Math.min(r.successA, r.successB);
  return '<div class="settings-section"><div class="section-title">What to do about it</div>'
    + '<p style="font-size:13px;">The weaker side is <strong>' + esc(weakName) + '</strong> (' + pctBesideWords(weakPct) + ' on its own). '
    + 'Open that plan in the Stress Tester and try: a slightly lower spending target, retiring a little later, '
    + 'the bond tent, or checking whether the budget split between you reflects who can actually fund what. '
    + 'Then come back and re-run this check.</p></div>';
}

/** The survivor and care one-shot checks (opt-in controls; the handlers live in index.html). */
export function survivorCareHtml(ownName, pName) {
  const a = esc(ownName), b = esc(pName);
  return '<div class="settings-section"><div class="section-title">What if one of you dies?</div>'
    // the opening words and their figures are the simple view's, marked where they say them (HOUSEHOLD_LEAD_FINDS; step F6)
    + '<p style="font-size:13px;">' + markWithin(esc(HOUSEHOLD.survivor.lead), HOUSEHOLD_LEAD_FINDS.survivor) + '</p>'
    + '<div class="row-flex" style="font-size:13px;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who dies<select id="hhWhoDies" style="min-width:150px;"><option value="A">' + a + '</option><option value="B">' + b + '</option></select></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Years from now<input type="number" id="hhDeathYear" value="' + D.survivorInYears + '" min="1" max="40" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Survivor spends (% of joint)<input type="number" id="hhSurvivorPct" value="' + D.spendPct + '" min="40" max="100" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">DB survivor %<input type="number" id="hhDbSurvivorPct" value="' + D.dbPct + '" min="0" max="100" style="width:80px;"></label>'
    + '<button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" data-on-click="runSurvivorUI()">Run survivor check</button></div>'
    + '<div id="hhSurvivorResult" style="margin-top:8px;"></div></div>'
    + '<div class="settings-section"><div class="section-title">What if one of you needs care?</div>'
    + '<p style="font-size:13px;">' + markWithin(esc(HOUSEHOLD.care.lead), HOUSEHOLD_LEAD_FINDS.care) + '</p>'
    + '<div class="row-flex" style="font-size:13px;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who needs care<select id="hhCareWho" style="min-width:150px;"><option value="A">' + a + '</option><option value="B">' + b + '</option></select></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">From (years from now)<input type="number" id="hhCareStart" value="' + D.careInYears + '" min="0" max="40" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">For (years)<input type="number" id="hhCareYears" value="' + D.careYears + '" min="1" max="15" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Cost (£ a year after tax, today\'s money)<input type="number" id="hhCareCost" value="' + D.careCost + '" step="5000" style="width:110px;"></label>'
    + '<button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" data-on-click="runCareUI()">Run care check</button></div>'
    + '<div id="hhCareResult" style="margin-top:8px;"></div></div>';
}

/** "lasts in 9 futures out of 10" for one result of the one test (OneAnswer), or why it could not run. */
const lastsWords = (x) => (x && x.a ? 'lasts ' + futuresOutOfTen(x.a.share).words : 'could not be tested (' + esc((x && x.reason) || 'not affordable as configured') + ')');

/**
 * The survivor check's result (HouseholdService.runSurvivorCheck), in the simple view's lines (7.12.0): how long the one left's
 * plan lasts and until what age it is tested; what they would have (their pension and savings, the inheritance, a share of a
 * final-salary pension, one State Pension); what they would spend. Today's money throughout.
 * @param {{ res: object, survivorName: string, deceasedName: string, years: number, spendPct: number }} o
 */
export function survivorResultHtml({ res, survivorName, deceasedName, years, spendPct }) {
  const Q = HOUSEHOLD.survivor;
  const s = esc(survivorName), d = esc(deceasedName);
  if (!res || !res.affordable) return '<div class="alert alert-warning">' + d + '\'s plan could not be tested as configured' + (res && res.reason ? ' — ' + esc(res.reason) : '') + '. Fix that plan first.</div>';
  const share = res.middling.a ? res.middling.a.share : 0;
  const inh = res.inherited, has = res.has || {};
  const tested = has.toAge != null ? fill(Q.tested, { survivor: survivorName, toAge: has.toAge }) : '';
  const lasts = (x) => (x && x.a ? futuresOutOfTen(x.a.share).words : 'could not be tested (' + ((x && x.reason) || 'not affordable as configured') + ')');
  const head = 'If ' + deceasedName + ' died ' + years + ' year' + (years === 1 ? '' : 's') + ' from now, ' + survivorName + '\'s plan lasts ' + lasts(res.middling) + tested + '. With a bad-case inheritance (the worst 1 in 10): ' + lasts(res.bad) + '.';
  const li = (t) => '<li>' + esc(t) + '</li>';
  const held = inh.heldIsa > 0 ? fill(Q.rows.held, { deceased: deceasedName, heldIsa: gbp(inh.heldIsa) }) : '';
  return '<div class="alert ' + onCourseAlertClass(share) + '" id="hhSurvivorVerdict">' + esc(head) + '</div>'
    + '<p style="font-size:13px;margin:6px 0 0;">' + esc(fill(Q.hasTitle, { survivor: survivorName })) + '</p>'
    + '<ul style="font-size:13px;margin:4px 0 0 18px;padding:0;" id="hhSurvivorHas">'
    + li(fill(Q.rows.savings, { survivor: survivorName }))
    + li(fill(Q.rows.inherit, { deceased: deceasedName, middling: gbp(inh.middling.total), bad: gbp(inh.bad.total), held }))
    + (has.pension ? li(fill(Q.rows.pension, { deceased: deceasedName, pct: has.pension.pct, amount: gbp(has.pension.annual) })) : '')
    + (has.statePension ? li(fill(has.statePension.paid ? Q.rows.statePensionPaid : Q.rows.statePension, { survivor: survivorName, amount: gbp(has.statePension.annual), fromAge: has.statePension.fromAge })) : '')
    + '</ul>'
    + '<p style="font-size:13px;margin:6px 0 0;">' + esc(fill(Q.rows.spend, { survivor: survivorName, net: gbp(res.spending.net), gross: gbp(res.spending.gross), pct: Math.round(spendPct) })) + '</p>'
    + '<p style="font-size:11px;color:var(--text-muted);">' + esc(fill(Q.note, { deceased: deceasedName, survivor: survivorName })) + '</p>';
}

/**
 * The care check's result (HouseholdService.runCareCheck): the household verdict first (when one plan falls short the other
 * pays, 6.25.0), with care and without, then both plans each lasting on its own.
 */
export function careResultHtml({ res, name, years, startIn, annualCost }) {
  if (!res || !res.affordable) return '<div class="alert alert-warning">The plans could not be tested as configured' + (res && res.reason ? ' — ' + esc(res.reason) : '') + '.</div>';
  const shareOf = (c) => (c ? (c.pooled ? c.pooled.success : c.jointSuccess) : 0);   // pooled first (6.25.0)
  const withIt = shareOf(res.care), without = shareOf(res.baseline);
  return '<div class="alert ' + onCourseAlertClass(withIt) + '" id="hhCareVerdict">With ' + esc(name) + ' needing care from ' + startIn + ' year' + (startIn === 1 ? '' : 's') + ' from now for ' + years + ' year' + (years === 1 ? '' : 's')
    + ' (' + gbp(annualCost) + ' a year after tax, ' + gbp(res.totalCareCost) + ' in all, today\'s money): <strong>the household\'s money lasts ' + esc(futuresOutOfTen(withIt).words) + '</strong> — '
    + esc(futuresOutOfTen(without).words) + ' without care.</div>'
    + '<p class="hint">' + (res.care.pooled ? 'When one plan falls short, the other pays that share. ' : '') + 'Both plans each lasting on its own: ' + inTen(res.care.jointSuccess) + ' with care, ' + inTen(res.baseline.jointSuccess) + ' without. '
    + 'A stress check, not advice. The cost is added in full on top of normal spending, as a one-off cost of ' + gbp(res.totalCareGross) + ' before tax in all; no means-testing modelled.</p>';
}

/** One budget for the household (decision 5): which plan's budget it is, and the offer to share it. */
export function budgetShareHtml({ ownName, pName, sharedFrom, sharedTo }) {
  let line, button = '';
  if (sharedFrom) {
    line = 'The household\'s budget is <strong>' + esc(pName) + '</strong>\'s: this plan reads the same budget lines, with its own share of who pays.';
    button = '<button type="button" class="risk-btn" style="padding:5px 12px;font-size:13px;" data-on-click="stopSharingHouseholdBudget()">Keep a separate budget on this plan</button>';
  } else if (sharedTo) {
    line = 'This plan\'s budget is the household\'s: <strong>' + esc(pName) + '</strong>\'s plan reads the same budget lines, with its own share of who pays.';
    button = '<button type="button" class="risk-btn" style="padding:5px 12px;font-size:13px;" data-on-click="stopSharingHouseholdBudget(true)">Give ' + esc(pName) + ' a separate budget</button>';
  } else {
    line = 'Each plan has its own budget at the moment. A couple is one household: share this plan\'s budget and <strong>' + esc(pName) + '</strong>\'s plan reads the same lines, with "who pays" still its own.';
    button = '<button type="button" class="risk-btn" style="padding:5px 12px;font-size:13px;" data-on-click="shareHouseholdBudget()">Share this plan\'s budget with ' + esc(pName) + '</button>';
  }
  return '<div class="settings-section" id="hhBudgetShare"><div class="section-title">One budget for the household</div><p style="font-size:13px;margin:0 0 8px;">' + line + '</p>' + button + '</div>';
}

const cell = (v) => (v == null ? '—' : about(v));
const potCells = (vals) => vals.map(cell).join(' / ');
const lasts = (w) => (w && w.lasts ? w.lasts.household.words.replace(/^in /, '') : '…');

/**
 * The headline section (household-draw-split.md §4). `fig` is null until the runs are in: the headline and the "why"
 * stand on the split alone, the table says "…" where a figure is still to come.
 * @param {{ split: object, fig: object|null, mode: 'write'|'copies', locked?: string[], running?: boolean }} o
 */
export function splitSectionHtml({ split, fig = null, mode = 'write', locked = [], running = false }) {
  const w = headlineWords(split, fig);
  const nm = split.names, small = split.smaller;
  const ages = (fig && fig.ages) || [67, 75, 90];
  const own = fig ? fig.own : null, tog = fig ? fig.together : null;
  const left = (x) => (x && x.left90 ? about(x.left90.p50) + ' / ' + about(x.left90.p10) : '…');
  let html = '<div class="alert alert-info" id="hhSplitHeadline" style="font-size:15px;line-height:1.5;margin-bottom:8px;"><strong>' + esc(w.headline) + '</strong><br><span style="font-size:13px;">' + esc(w.why) + '</span></div>';
  html += '<p style="font-size:14px;margin:0 0 10px;"><strong>The cost:</strong> ' + esc(w.cost.replace(/^The cost: /, '')) + '</p>';
  html += '<div style="overflow-x:auto;"><table id="hhSplitTable"><thead><tr><th></th><th>As the two plans are written</th><th>Paid as a couple, tax first</th></tr></thead><tbody>'
    + '<tr><td>Tax a year (first full year)</td><td>' + (split.tax.firstYear ? gbp(split.tax.firstYear.own) : '—') + '</td><td>' + (split.tax.firstYear ? gbp(split.tax.firstYear.together) : '—') + '</td></tr>'
    + '<tr><td>Tax until ' + esc(nm[small]) + ' is ' + split.untilAge + ' / over the whole plan</td><td>' + gbp(split.tax.until.own) + ' / ' + gbp(split.tax.whole.own) + '</td><td>' + gbp(split.tax.until.together) + ' / ' + gbp(split.tax.whole.together) + '</td></tr>'
    + '<tr><td>' + esc(nm.a) + '\'s pot at ' + ages.join(' / ') + ' (middling)</td><td>' + (own ? potCells(own.potA) : '…') + '</td><td>' + (tog ? potCells(tog.potA) : '…') + '</td></tr>'
    + '<tr><td>' + esc(nm.b) + '\'s pot at ' + ages.join(' / ') + ' (middling)</td><td>' + (own ? potCells(own.potB) : '…') + '</td><td>' + (tog ? potCells(tog.potB) : '…') + '</td></tr>'
    + '<tr><td>The money lasts for the household (9 in 10 is on course)</td><td>' + lasts(own) + '</td><td>' + lasts(tog) + '</td></tr>'
    + '<tr><td>Left for the household when ' + esc(nm.a) + ' is 90, today\'s prices (middling / bad case)</td><td>' + left(own) + '</td><td>' + left(tog) + '</td></tr>'
    + '</tbody></table></div>';
  html += '<p style="font-size:14px;margin:10px 0 6px;">' + esc(w.closing).replace('This is your choice; neither is wrong.', '<strong>This is your choice; neither is wrong.</strong>') + '</p>';
  if (w.note2028) html += '<div class="alert alert-warning" style="font-size:13px;">' + esc(w.note2028) + '</div>';
  if (w.ladderNote) html += '<p class="hint" style="margin:6px 0;">' + esc(w.ladderNote) + '</p>';
  html += '<p class="hint" style="margin:6px 0;">Every figure is from the runs: the tax from the planner\'s own tax sums on each year\'s draws in today\'s prices; the pots, the chance and what is left from both plans through the same 1,000 futures each way.' + (running ? ' The runs are still going…' : '') + '</p>';
  html += limitControlsHtml(split);
  // the choices
  const useLabel = mode === 'copies' ? 'Make copies of both plans with this split' : 'Use this split';
  html += '<div class="row-flex" style="margin-top:12px;gap:10px;">'
    + '<button type="button" data-on-click="useHouseholdSplit()" id="hhUseSplit">' + useLabel + '</button>'
    + '<button type="button" class="risk-btn" data-on-click="keepHouseholdAsIs()" id="hhKeepAsIs">Keep things as they are</button></div>';
  if (mode === 'copies') html += '<p class="hint" style="margin:6px 0 0;">' + esc(locked.join(' and ')) + (locked.length > 1 ? ' are locked plans' : ' is a locked plan') + ': a locked plan is never changed. The copies are unlocked drafts, linked to each other; your plans stay exactly as they are.</p>';
  return '<div class="settings-section" id="hhSplitSection"><div class="section-title">Who draws what: drawing together, tax first</div>\n' + html + '</div>';
}

/** The limit controls (household-draw-split.md 9.2): the default keeps the smaller pot until its State Pension age and shows as such; "None" is the fast split. */
function limitControlsHtml(split) {
  const nm = split.names, small = split.smaller;
  const lim = split.limit || {};
  const smallP = split.profiles[small];
  return '<div class="row-flex" style="font-size:13px;align-items:flex-end;margin-top:8px;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">A limit on ' + esc(nm[small]) + '\'s pot<select id="hhLimitKind" style="min-width:220px;">'
    + '<option value="none"' + (lim.kind === 'none' ? ' selected' : '') + '>None</option>'
    + '<option value="untilAge"' + (lim.kind === 'untilAge' ? ' selected' : '') + '>Keep ' + esc(nm[small]) + '\'s pot until an age</option>'
    + '<option value="keepAtLeast"' + (lim.kind === 'keepAtLeast' ? ' selected' : '') + '>Keep at least £X in ' + esc(nm[small]) + '\'s pot</option></select></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Until age<input type="number" id="hhLimitAge" value="' + (lim.age || smallP.spAge || 67) + '" min="55" max="100" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Keep at least (£)<input type="number" id="hhLimitAmount" value="' + (lim.amount || 0) + '" step="10000" min="0" style="width:120px;"></label>'
    + '<button type="button" class="risk-btn" style="padding:8px 14px;" data-on-click="rerunHouseholdSplit()">Re-run with this limit</button></div>';
}

/**
 * When the comparison does not apply (7.12.0): "nothing to move" said once, in the simple view's words (HouseholdDraw.noSplitWords).
 * When drawing the smaller pension faster would save enough to show (household-draw-split.md 9.2): what it would do, from the
 * count alone, and the limit controls so that "None" can be chosen. Otherwise the sentence alone: no limit changes the answer.
 */
export function splitNoneHtml({ split }) {
  const w = noSplitWords(split);
  const nm = split.names, small = split.smaller;
  let line = esc(fill(HOUSEHOLD.split[w.id], { small: nm[small] }));
  if (w.fast) {
    const f = split.fast;
    const d = Math.round(f.saving.until - split.saving.until);
    const until = d === 0 ? 'and the same' : d > 0 ? 'and about ' + about(d) + ' more' : 'but about ' + about(-d) + ' less';
    line += ' Drawing ' + esc(nm[small]) + '\'s pot faster saves about ' + about(f.saving.year - split.saving.year) + ' a year in tax at first, ' + until + ' by the time ' + esc(nm[small]) + ' is ' + split.untilAge
      + (f.goneAt != null ? '; ' + esc(nm[small]) + '\'s pot gone at about ' + f.goneAt : '') + '. Choose "None" below and re-run to see it.';
  }
  return '<div class="settings-section" id="hhSplitSection"><div class="section-title">Who draws what: drawing together, tax first</div>\n<p style="font-size:14px;margin:0 0 6px;" id="hhSplitNone">' + line + '</p>' + (w.fast ? limitControlsHtml(split) : '') + '</div>';
}

/** When the person chose to keep things as they are: one line, with the way back. */
export function splitDismissedHtml() {
  return '<p class="hint" id="hhSplitDismissed" style="margin:0 0 10px;">You chose to keep things as they are: each of you draws for your own plan. <button type="button" data-on-click="showHouseholdSplitAgain()" style="background:none;border:none;padding:0;font:inherit;color:var(--primary,#6366f1);text-decoration:underline;cursor:pointer;">Show the drawing-together comparison again</button>.</p>';
}

/** The Budget tab's one line when the budget is the household's (decision 5): '' when it is this plan's alone. */
export function budgetSharedLineHtml({ sharedFromName, sharedToNames }) {
  if (sharedFromName) return 'This is your household\'s budget, shared with <strong>' + esc(sharedFromName) + '</strong>: the lines are the same on both plans; your share of who pays is this plan\'s own.';
  if (sharedToNames && sharedToNames.length) return 'This is your household\'s budget, shared with <strong>' + sharedToNames.map(esc).join('</strong> and <strong>') + '</strong>: the lines are the same on both plans; who pays is each plan\'s own.';
  return '';
}

/** The confirm's words for "Use this split" (HouseholdSplitApply.splitChanges). */
export function splitConfirmHtml(changes, mode) {
  const lines = changes.map((c) => '<li><strong>' + esc(c.name) + '</strong>: ' + (c.changed ? esc(c.from) + ' → ' + esc(c.to) : 'unchanged (' + esc(c.from) + ')') + '</li>').join('');
  const head = mode === 'copies'
    ? 'Make a copy of each plan with the split as its income shape? Your plans stay exactly as they are; the copies are unlocked drafts, linked to each other.'
    : 'Write the split into both plans as their income shape? You can undo this straight afterwards.';
  return head + '<ul style="margin:8px 0 0 18px;padding:0;font-size:13px;line-height:1.6;">' + lines + '</ul>';
}

/** A plan the household check cannot test yet (7.12.0): by name, with what is missing (the simple view's own words). */
export function householdNotSetWords(name, missing) {
  const P = HOUSEHOLD.partner;
  const t = missing === 'income' ? P.notSetIncome : missing === 'pot' ? P.notSetPot : P.notSet;
  return t.replace('{name}', name || 'Your partner’s plan');
}
