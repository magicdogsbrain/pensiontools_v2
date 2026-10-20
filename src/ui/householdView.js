/**
 * The Household tab's results, as HTML from data (6.25.0; research/household-draw-split.md §4, usability audit §5
 * decision 5 option (a)). Pure: strings in, strings out — index.html's inline script only gathers the data and calls
 * these (it may only shrink: tests/v7/shellRatchet.test.js). The handlers named in data-on-click live in index.html.
 *
 *  - splitSectionHtml: the headline at the top of the tab ("Drawing together saves about £X a year in tax…"), the
 *    cost to the smaller pot, the two-column table, the closing line, the 2028 and ladder notes, the limit controls and
 *    the three choices (Use this split / Make copies / Keep things as they are).
 *  - verdictSectionHtml: the household verdict first (when one plan falls short the other pays), each plan's own reading second.
 *  - the timeline, what's-left, what-to-do, survivor and care sections, moved here from the inline script unchanged in
 *    substance.
 */

import { isOnCourse, onCourseAlertClass, jointVerdictHtml, ON_COURSE_WORDS } from '../services/OnCourse.js';
import { futuresOutOfTen, pctText, CHANCE_BARS } from '../services/OneAnswer.js';
import { headlineWords, about } from '../services/HouseholdDraw.js';

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const gbp = (n) => '£' + Math.round(+n || 0).toLocaleString('en-GB');
const pctFmt = (x) => pctText((+x || 0) * 100, 0, [...CHANCE_BARS, 70]);   // a share of futures: never rounded across a verdict's line
// In words (6.33.0): the whole count said "10 in 10" from 95% and "9 in 10" from 85% — the words do not.
const inTen = (share) => futuresOutOfTen(+share || 0).words.replace(/^in /, '');

/** The household verdict in words: pooled first. */
export function householdVerdictHtml(r) {
  const share = r.pooled ? r.pooled.success : r.jointSuccess;
  const ten = futuresOutOfTen(share);
  const head = isOnCourse(share) ? 'On course together' : share >= 0.7 ? 'Not on course yet, together' : 'At risk, together';
  let s = '<strong>' + head + ':</strong> the household\'s money lasts ' + esc(ten.words) + '.';
  if (r.pooled) {
    s += ' When one plan falls short (its money runs out, or a strategy that cuts instead cuts it), the other pays that share; the household falls short only when both have.';
    const covered = (r.pooled.coveredByA || 0) + (r.pooled.coveredByB || 0);
    if (covered > 0 && r.pooled.fromAgeMedian) s += ' In ' + covered + ' of ' + r.runs.toLocaleString('en-GB') + ' futures one plan fell short and the other paid, typically from age ' + r.pooled.fromAgeMedian + (r.pooled.fromAgeEarliest && r.pooled.fromAgeEarliest !== r.pooled.fromAgeMedian ? ' (from ' + r.pooled.fromAgeEarliest + ' at the earliest)' : '') + '.';
  } else {
    s += ' ' + jointVerdictHtml(share);
  }
  return s;
}

/**
 * The verdict section: the household first, then each plan on its own and the two as separate plans.
 * @param {{ r: object, ownName: string, pName: string, stratNote?: string, startsNote?: string }} o
 */
export function verdictSectionHtml({ r, ownName, pName, stratNote = '', startsNote = '' }) {
  const share = r.pooled ? r.pooled.success : r.jointSuccess;
  let html = '<div class="settings-section"><div class="section-title">The verdict</div>';
  html += '<div class="alert ' + onCourseAlertClass(share) + '" style="font-size:15px;" id="hhHouseholdVerdict">' + householdVerdictHtml(r) + '</div>';
  html += '<table><tbody>'
    + '<tr><td>The household together (when one plan falls short, the other pays)</td><td><strong>' + inTen(share) + '</strong></td></tr>'
    + '<tr><td>' + esc(ownName) + '\'s plan on its own</td><td><strong>' + inTen(r.successA) + '</strong> <span class="hint">(' + pctFmt(r.successA) + ')</span></td></tr>'
    + '<tr><td>' + esc(pName) + '\'s plan on its own</td><td><strong>' + inTen(r.successB) + '</strong> <span class="hint">(' + pctFmt(r.successB) + ')</span></td></tr>'
    + '<tr><td>Both plans, each lasting on its own</td><td><strong>' + inTen(r.jointSuccess) + '</strong> <span class="hint">(' + pctFmt(r.jointSuccess) + ')</span></td></tr>'
    + '</tbody></table>' + stratNote + (startsNote ? '<p class="hint" id="hhStartsNote" style="margin:6px 0 0;">' + esc(startsNote) + '</p>' : '');
  html += '<p style="font-size:12px;color:var(--text-muted);margin-top:6px;">'
    + 'Both plans face the <em>same</em> markets, so a bad decade hits you both at once: this check runs you both through '
    + 'identical futures instead of treating your plans as unrelated. On course ' + esc(ON_COURSE_WORDS) + '.</p></div>';
  return html;
}

/** Where the money comes from, year by year (householdIncomeTimeline rows). */
export function timelineSectionHtml(rows, ownName, pName, thisYear) {
  const yr = (y) => thisYear + y;
  let html = '<div class="settings-section"><div class="section-title">Where the money comes from, year by year</div>';
  const lastBridge = rows.filter((row) => row.bridge).pop();
  if (lastBridge) {
    html += '<div class="alert alert-info">Until <strong>' + yr(lastBridge.year + 1) + '</strong> at least one of you is still waiting for their State Pension — those are the years (marked 🌉) when your pots do the most work. This is usually where a couple\'s plan is tightest.</div>';
  }
  html += '<div style="overflow-x:auto;"><table><thead><tr><th>Year</th><th>' + esc(ownName) + ' needs</th><th>' + esc(pName) + ' needs</th><th>State Pensions</th><th>Other guaranteed</th><th>From your pots</th></tr></thead><tbody>';
  const marks = new Set([0]);
  rows.forEach((row, i) => { if (i > 0 && (row.workingA !== rows[i - 1].workingA || row.workingB !== rows[i - 1].workingB || row.spA !== rows[i - 1].spA || row.spB !== rows[i - 1].spB || row.db !== rows[i - 1].db || (row.needB === 0 && rows[i - 1].needB > 0) || (row.needA === 0 && rows[i - 1].needA > 0))) marks.add(i); });
  for (let y = 0; y < rows.length; y += 5) marks.add(y);
  [...marks].sort((a, b) => a - b).forEach((i) => {
    const row = rows[i];
    if (!row) return;
    html += '<tr><td>' + yr(row.year) + (row.bridge ? ' 🌉' : '') + '</td><td>' + (row.workingA ? '<span class="hint">still working</span>' : gbp(row.needA)) + '</td><td>' + (row.workingB ? '<span class="hint">still working</span>' : gbp(row.needB))
      + '</td><td>' + gbp(row.spA + row.spB) + '</td><td>' + gbp(row.db + row.other) + '</td><td><strong>' + gbp(row.drawNeed) + '</strong></td></tr>';
  });
  html += '</tbody></table></div>'
    + '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Today\'s money, per year. Rows shown where something changes (a State Pension starts, a plan ends) plus every 5th year. The last column is what your investments must provide after all guaranteed income.</p></div>';
  return html;
}

/** What you'd have left, combined (the potFan). */
export function wealthSectionHtml(potFan, thisYear) {
  let html = '<div class="settings-section"><div class="section-title">What you\'d have left, combined <span style="font-weight:normal;font-size:12px;color:var(--text-muted);">(everything both plans hold — pensions, ISAs, gilts not yet repaid — today\'s money)</span></div>';
  html += '<div style="overflow-x:auto;"><table><thead><tr><th>Year</th><th>If markets are poor</th><th>Typical</th><th>If markets are strong</th></tr></thead><tbody>';
  for (let y = 0; y < potFan.length; y += 5) {
    const f = potFan[y];
    html += '<tr><td>' + (thisYear + f.year) + '</td><td>' + gbp(f.p10) + '</td><td>' + gbp(f.p50) + '</td><td>' + gbp(f.p90) + '</td></tr>';
  }
  html += '</tbody></table></div>'
    + '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">"Poor" = worse than 9 in 10 simulated futures; "strong" = better than 9 in 10.</p></div>';
  return html;
}

/** What to do about it, when the household is not on course. */
export function whatToDoHtml(r, ownName, pName) {
  const share = r.pooled ? r.pooled.success : r.jointSuccess;
  if (isOnCourse(share)) return '';
  const weakName = r.successA <= r.successB ? ownName : pName;
  const weakPct = Math.min(r.successA, r.successB);
  return '<div class="settings-section"><div class="section-title">What to do about it</div>'
    + '<p style="font-size:13px;">The weaker side is <strong>' + esc(weakName) + '</strong> (' + pctFmt(weakPct) + ' on its own). '
    + 'Open that plan in the Stress Tester and try: a slightly lower spending target, retiring a little later, '
    + 'the bond tent, or checking whether the budget split between you reflects who can actually fund what. '
    + 'Then come back and re-run this check.</p></div>';
}

/** The survivor and care one-shot checks (opt-in controls; the handlers live in index.html). */
export function survivorCareHtml(ownName, pName) {
  const a = esc(ownName), b = esc(pName);
  return '<div class="settings-section"><div class="section-title">What if one of you dies?</div>'
    + '<p style="font-size:13px;">The hard question most tools skip. The survivor keeps their own pensions, inherits what the other\'s plan has left then (pensions pass tax-free before 75), loses one State Pension, and typically needs about 70% of the joint spending. Both plans run through their own strategy\'s test.</p>'
    + '<div class="row-flex" style="font-size:13px;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who dies<select id="hhWhoDies" style="min-width:150px;"><option value="A">' + a + '</option><option value="B">' + b + '</option></select></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Years from now<input type="number" id="hhDeathYear" value="10" min="1" max="40" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Survivor spends (% of joint)<input type="number" id="hhSurvivorPct" value="70" min="40" max="100" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">DB survivor %<input type="number" id="hhDbSurvivorPct" value="50" min="0" max="100" style="width:80px;"></label>'
    + '<button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" data-on-click="runSurvivorUI()">Run survivor check</button></div>'
    + '<div id="hhSurvivorResult" style="margin-top:8px;"></div></div>'
    + '<div class="settings-section"><div class="section-title">What if one of you needs care?</div>'
    + '<p style="font-size:13px;">Nursing care runs roughly £80–100k a year. This adds the full cost on top of normal spending (deliberately cautious) as a one-off cost in that person\'s plan and re-runs both plans through their own strategy\'s test. It models the cost only — never local-authority means-testing.</p>'
    + '<div class="row-flex" style="font-size:13px;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who needs care<select id="hhCareWho" style="min-width:150px;"><option value="A">' + a + '</option><option value="B">' + b + '</option></select></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">From (years from now)<input type="number" id="hhCareStart" value="15" min="0" max="40" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">For (years)<input type="number" id="hhCareYears" value="3" min="1" max="15" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Cost (£ a year after tax, today\'s money)<input type="number" id="hhCareCost" value="90000" step="5000" style="width:110px;"></label>'
    + '<button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" data-on-click="runCareUI()">Run care check</button></div>'
    + '<div id="hhCareResult" style="margin-top:8px;"></div></div>';
}

/** "lasts in 9 futures out of 10" for one result of the one test (OneAnswer), or why it could not run. */
const lastsWords = (x) => (x && x.a ? 'lasts ' + futuresOutOfTen(x.a.share).words : 'could not be tested (' + esc((x && x.reason) || 'not affordable as configured') + ')');

/**
 * The survivor check's result (HouseholdService.runSurvivorCheck), in the planner's words since 6.24.0. Today's money
 * throughout; the spending is the survivor's yearly figure before tax, with what it leaves after tax beside it.
 * @param {{ res: object, survivorName: string, deceasedName: string, years: number, spendPct: number, strategyNames: { survivor: string, deceased: string } }} o
 */
export function survivorResultHtml({ res, survivorName, deceasedName, years, spendPct, strategyNames = {} }) {
  const s = esc(survivorName), d = esc(deceasedName);
  if (!res || !res.affordable) return '<div class="alert alert-warning">' + d + '\'s plan could not be tested as configured' + (res && res.reason ? ' — ' + esc(res.reason) : '') + '. Fix that plan first.</div>';
  const share = res.middling.a ? res.middling.a.share : 0;
  const inh = res.inherited;
  const held = inh.heldIsa > 0 ? ' (including the ISA ' + d + '\'s plan holds aside, ' + gbp(inh.heldIsa) + ')' : '';
  return '<div class="alert ' + onCourseAlertClass(share) + '" id="hhSurvivorVerdict">If ' + d + ' dies ' + years + ' year' + (years === 1 ? '' : 's') + ' from now, <strong>' + s + '\'s plan ' + lastsWords(res.middling) + '</strong> with a middling inheritance, and ' + lastsWords(res.bad) + ' with a bad-case one.</div>'
    + '<ul style="font-size:13px;margin:6px 0 0 18px;padding:0;">'
    + '<li>' + s + ' inherits about <strong>' + gbp(inh.middling.total) + '</strong> in a middling case, <strong>' + gbp(inh.bad.total) + '</strong> in a bad case (the worst 1 in 10), today\'s money — what ' + d + '\'s own plan (' + esc(strategyNames.deceased || '') + ') has left then' + held + '.</li>'
    + '<li>' + s + ' then spends <strong>' + gbp(res.spending.gross) + ' a year before tax</strong> (about ' + gbp(res.spending.net) + ' after tax), today\'s money — ' + Math.round(spendPct) + '% of what you both spend after tax.</li>'
    + '<li>' + s + '\'s plan runs on its own strategy (' + esc(strategyNames.survivor || '') + ') with the inheritance arriving that year.</li></ul>'
    + '<p style="font-size:11px;color:var(--text-muted);">A stress check, not advice. Simplifications: pensions inherited tax-free (death before 75); the ISA passes as ISA (the spouse\'s extra allowance); the inheritance is split between pension and ISA in the shares ' + d + '\'s plan started with; gilts still held count at the value they would reach if interest rates did not move; the bad case sets ' + d + '\'s worst 1 in 10 against every one of ' + s + '\'s futures, not future by future.</p>';
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
  html += '<div style="overflow-x:auto;"><table id="hhSplitTable"><thead><tr><th></th><th>Each for their own</th><th>Drawing together</th></tr></thead><tbody>'
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
  // the optional limit
  const lim = split.limit || {};
  const smallP = split.profiles[small];
  html += '<div class="row-flex" style="font-size:13px;align-items:flex-end;margin-top:8px;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">A limit on ' + esc(nm[small]) + '\'s pot<select id="hhLimitKind" style="min-width:220px;">'
    + '<option value=""' + (!lim.kind ? ' selected' : '') + '>None</option>'
    + '<option value="untilAge"' + (lim.kind === 'untilAge' ? ' selected' : '') + '>Keep ' + esc(nm[small]) + '\'s pot until an age</option>'
    + '<option value="keepAtLeast"' + (lim.kind === 'keepAtLeast' ? ' selected' : '') + '>Keep at least £X in ' + esc(nm[small]) + '\'s pot</option></select></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Until age<input type="number" id="hhLimitAge" value="' + (lim.age || smallP.spAge || 67) + '" min="55" max="100" style="width:80px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Keep at least (£)<input type="number" id="hhLimitAmount" value="' + (lim.amount || 0) + '" step="10000" min="0" style="width:120px;"></label>'
    + '<button type="button" class="risk-btn" style="padding:8px 14px;" data-on-click="rerunHouseholdSplit()">Re-run with this limit</button></div>';
  // the choices
  const useLabel = mode === 'copies' ? 'Make copies of both plans with this split' : 'Use this split';
  html += '<div class="row-flex" style="margin-top:12px;gap:10px;">'
    + '<button type="button" data-on-click="useHouseholdSplit()" id="hhUseSplit">' + useLabel + '</button>'
    + '<button type="button" class="risk-btn" data-on-click="keepHouseholdAsIs()" id="hhKeepAsIs">Keep things as they are</button></div>';
  if (mode === 'copies') html += '<p class="hint" style="margin:6px 0 0;">' + esc(locked.join(' and ')) + (locked.length > 1 ? ' are locked plans' : ' is a locked plan') + ': a locked plan is never changed. The copies are unlocked drafts, linked to each other; your plans stay exactly as they are.</p>';
  return '<div class="settings-section" id="hhSplitSection"><div class="section-title">Who draws what: drawing together, tax first</div>\n' + html + '</div>';
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
