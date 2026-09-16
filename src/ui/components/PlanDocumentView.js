/**
 * Plan Document — HTML. Pure: document JSON in, HTML string out. The heavy renderers that live in
 * index.html (the strategy card, the staircase SVG) are injected so this module stays testable.
 */
import { esc } from './ReleaseNotesView.js';

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const dateGB = (iso) => { const d = new Date(iso); return Number.isFinite(d.getTime()) ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; };
function section(title, body, { open = false, sub = '' } = {}) {
  if (!body) return '';
  return '<details class="pd-section"' + (open ? ' open' : '') + '><summary><strong>' + esc(title) + '</strong>' + (sub ? ' <span class="hint">' + esc(sub) + '</span>' : '') + '</summary><div class="pd-body">' + body + '</div></details>';
}
function table(head, rows) {
  if (!rows.length) return '';
  return '<div class="table-scroll-container"><table><thead><tr>' + head.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
}

/** Report header (stands on its own in a PDF). */
export function planDocumentHeaderHtml(doc) {
  const d = doc || {};
  return '<div class="rpt-header"><h1>Plan document — ' + esc(d.planName || 'My plan') + '</h1>'
    + '<div class="rpt-sub">Locked ' + esc(dateGB(d.lockedAt)) + (d.createdAt && d.createdAt !== d.lockedAt ? ' · document created ' + esc(dateGB(d.createdAt)) : '') + ' · PensionTools v' + esc(d.appVersion || '') + ', engine ' + esc(d.engineVersion || '') + '</div>'
    + '<table class="rpt-meta"><tr><td>Strategy</td><td>' + esc(d.strategy?.name || d.strategy?.id || '—') + '</td><td>Plan starts</td><td>' + esc(d.decisionRun?.year0 || '—') + '</td></tr>'
    + '<tr><td>Priced on</td><td>' + gbp(d.pots?.sipp) + (d.pots?.isa ? ' + ISA ' + gbp(d.pots.isa) : '') + (d.pots?.gia ? ' + GIA ' + gbp(d.pots.gia) : '') + '</td><td>First step</td><td>' + (d.steps?.[0] ? gbp(d.steps[0].amount) + '/yr from age ' + esc(String(d.steps[0].fromAge)) : '—') + '</td></tr></table></div>';
}

const SOURCE_TEXT = { typed: 'typed in', paste: 'pasted from a platform page or export', imported: 'imported from the Stress tester\'s fund list', none: 'no source' };

/**
 * "What you held when the plan was locked" — from `holdingsAtLock` (6.13.0), every strategy. What the person
 * HELD, as distinct from the pots and funds the strategy was tested on. A document written before 6.13.0 has
 * no snapshot; a plan locked with nothing on record says so.
 */
export function holdingsAtLockHtml(doc) {
  const H = doc && doc.holdingsAtLock;
  // A document refreshed after a LATER holdings record carries that record, not the lock-time one: say so, or "what
  // you held when locked" is a false claim (6.13.0). Both dates are UTC day strings (lockedAt is an ISO instant,
  // updatedAt a 'YYYY-MM-DD' cut from one), so the date parts compare directly.
  const day = (v) => { const s = String(v || '').slice(0, 10); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null; };
  const dayGB = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const lockDay = day(doc && doc.lockedAt), recDay = day(H && H.updatedAt);
  const title = lockDay && recDay && recDay > lockDay ? 'What you hold (recorded ' + dayGB(recDay) + ', after the plan was locked on ' + dayGB(lockDay) + ')' : 'What you held when the plan was locked';
  let h = '<div class="section-title" style="font-size:13px;margin-top:10px;">' + esc(title) + '</div>';
  if (!H) return h + '<p class="hint">This document was written before holdings were recorded separately from the funds a strategy is tested on. Refresh the plan document to add them.</p>';
  const lines = Array.isArray(H.lines) ? H.lines : [];
  if (!lines.length) return h + '<p class="hint">No holdings were on record when the plan was locked. Record what you hold on the Transition tab (What you hold — paste it from your platform or type the lines) — the Transition tool works from that record, not from the funds the strategy was tested on.</p>';
  const byWrapper = {}; let total = 0;
  for (const l of lines) { const v = +l.value || 0; total += v; byWrapper[l.wrapper || 'SIPP'] = (byWrapper[l.wrapper || 'SIPP'] || 0) + v; }
  const anyUnits = lines.some((l) => l.units != null), anyAsOf = lines.some((l) => l.asOf);
  h += table(['Holding', 'Wrapper', ...(anyUnits ? ['Units'] : []), 'Value', ...(anyAsOf ? ['As of'] : [])],
    lines.map((l) => [esc(l.name || l.ticker || l.sedol || '') + (l.ticker && l.name ? ' <span class="hint">' + esc(l.ticker) + '</span>' : ''), esc(l.wrapper || ''), ...(anyUnits ? [l.units != null ? Math.round(+l.units).toLocaleString('en-GB') : '—'] : []), l.value != null ? gbp(l.value) : '—', ...(anyAsOf ? [esc(l.asOf || '')] : [])]));
  h += '<p class="hint">Total ' + gbp(total) + ' — ' + Object.entries(byWrapper).map(([w, v]) => esc(w) + ' ' + gbp(v)).join(' · ') + (H.updatedAt ? '; recorded ' + esc(H.updatedAt) : '') + (SOURCE_TEXT[H.source] ? ' (' + SOURCE_TEXT[H.source] + ')' : '') + '.</p>';
  return h;
}

/**
 * The whole document.
 * @param {object} doc
 * @param {object} r  { strategyCard(r, p, opts) → html, staircaseSvg(layersArgs) → svg, whereAmI: html to place at the top }
 */
export function planDocumentHtml(doc, r = {}) {
  const d = doc || {};
  if (!d.timing) return '<div class="card"><p class="hint">No plan document yet.</p></div>';
  const t = d.timing;
  let h = '<div class="card pd">';
  h += planDocumentHeaderHtml(d);
  if (r.whereAmI) h += r.whereAmI;
  h += '<p>' + esc(t.text || '') + '</p>';

  // Timeline: picture + table
  let tl = '';
  if (r.staircaseSvg && d.layers && d.steps?.length) {
    try {
      tl += '<div class="machine-scroll">' + r.staircaseSvg({ steps: d.steps.map((s) => ({ fromAge: s.fromAge, amount: s.amount, decline: s.decline, glideToNext: s.glideToNext })), ageNow: d.layers.ageNow, horizonAge: d.layers.horizonAge, essentials: d.layers.essentials || 0, budgetGross: d.layers.budgetGross || 0, sp: d.layers.sp, other: d.layers.other || [], prevVals: null, floorVals: d.layers.floorVals || null, events: d.layers.events || [] }) + '</div>';
    } catch (e) { /* picture optional */ }
  }
  if (d.steps?.length) {
    tl += '<div class="section-title" style="font-size:13px;margin-top:10px;">Income steps (today\'s money, gross)</div>'
      + table(['From age', 'Tax year', 'Take', 'Then'], d.steps.map((s) => [esc(String(s.fromAge)), esc(s.taxYear || ''), gbp(s.amount) + '/yr', esc(s.slope || '')]));
  }
  if (d.timeline?.length) {
    const anyContract = d.timeline.some((x) => x.contract > 0), anyLump = d.timeline.some((x) => x.lumpIn?.length || x.lumpOut?.length), anyLumpUse = d.timeline.some((x) => x.lump > 0);
    const head = ['Plan year', 'Tax year', 'Age', 'Gross income', 'State Pension', 'Other / DB', ...(anyLumpUse ? ['From a lump sum'] : []), anyContract ? 'By contract' : 'From the pot', 'From the market'];
    if (anyLump) head.push('Lump sums');
    const rows = d.timeline.map((x) => {
      const fromPot = anyContract ? x.contract : Math.max(0, x.gross - x.sp - x.other - (x.lump || 0));
      const cells = [String(x.y) + (x.cashYear ? ' <span class="hint">cash year</span>' : ''), esc(x.taxYear), String(x.age), gbp(x.gross), x.sp ? gbp(x.sp) : '—', x.other ? gbp(x.other) : '—', ...(anyLumpUse ? [x.lump ? gbp(x.lump) : '—'] : []), fromPot ? gbp(fromPot) : '—', x.market ? gbp(x.market) : '—'];
      if (anyLump) cells.push([...(x.lumpIn || []).map((l) => '▲ ' + esc(l.label) + ' ' + gbp(l.amount)), ...(x.lumpOut || []).map((l) => '▼ ' + esc(l.label) + ' ' + gbp(l.amount))].join('<br>') || '');
      return cells;
    });
    tl += '<div class="section-title" style="font-size:13px;margin-top:10px;">Year by year</div>' + table(head, rows)
      + '<p class="hint">Gross income is the total for the year in today\'s money. "From the market" is the median future\'s contribution over and above the guaranteed layers' + (anyContract ? ' and the rungs bought by contract' : '') + '.</p>';
  }
  h += section('1. Timeline — your age against the tax years', tl, { open: true, sub: 'what you planned to take, and who pays it' });

  // Strategy
  let st = '';
  if (r.strategyCard && d.strategy?.r && d.strategy?.p) {
    try { st = r.strategyCard(d.strategy.r, d.strategy.p, { compact: true }); } catch (e) { st = '<p class="hint">The strategy result could not be drawn from the stored document (' + esc(e.message) + ').</p>'; }
  } else if (d.strategy) {
    const rr = d.strategy.r || {};
    st = '<p><strong>' + esc(d.strategy.name || d.strategy.id) + '</strong>' + (rr.ruin ? ' — ran out or was cut in ' + esc(String((+rr.ruin.mc || 0).toFixed(1))) + '% of simulated futures; income guaranteed: ' + esc(rr.guaranteedToAge || '—') + '.' : '.') + '</p>';
  }
  h += section('2. Strategy — ' + (d.strategy?.name || d.strategy?.id || ''), st, { sub: 'the verdict, the cones, and the shopping list as they stood at lock' });

  // Portfolio: what you HELD (the holdings record) first; then the pots and funds the strategy was TESTED on —
  // the two are different things and the document never presents the second as the first (6.13.0).
  let pf = holdingsAtLockHtml(d);
  const P = d.pots || {};
  pf += '<div class="section-title" style="font-size:13px;margin-top:14px;">Pots the plan was priced on</div>'
    + table(['Pot', 'Priced on'], [['SIPP', gbp(P.sipp)], ['ISA' + (P.isaPolicy === 'hold' ? ' (held — never drawn for income)' : ''), gbp(P.isa)], ['Taxable account (GIA)' + (P.taxableMix ? ', held as ' + esc(String(typeof P.taxableMix === 'string' ? P.taxableMix : 'a mix')) : ''), gbp(P.gia)]]);
  if (P.potAtRetirement && (P.potAtRetirement.sipp || P.potAtRetirement.isa)) pf += '<p class="hint">Retiring later: priced on pots at retirement of SIPP ' + gbp(P.potAtRetirement.sipp) + (P.potAtRetirement.isa ? ' and ISA ' + gbp(P.potAtRetirement.isa) : '') + ' in today\'s money (' + esc(P.potAtRetirement.source || 'projection') + ').</p>';
  if (d.strategy?.contract) {
    pf += '<p>A contract strategy: the plan\'s target holding IS the ladder in section 2 — the order sheet lists every gilt and the cash years, and "what arrives when" shows the rung that pays each tax year. Nothing is sold; each year\'s matured rung pays that year. The Transition tool takes you from what you held (above) to the order sheet.</p>';
  } else if (d.targetMix?.length) {
    pf += '<div class="section-title" style="font-size:13px;margin-top:10px;">Target mix by plan year</div>'
      + table(['Plan year', 'Shares', 'Bonds', 'Cash'], d.targetMix.map((m) => [String(m.y), m.equity + '%', m.bond + '%', m.cash + '%']))
      + '<p class="hint">Cash is held flat; shares and bonds glide inside the growth sleeve' + (P.allocation?.allocMode === 'funds' ? '. The funds below set the starting split.' : '.') + '</p>';
    if (P.allocation?.taggedFunds?.length) pf += '<div class="section-title" style="font-size:13px;margin-top:10px;">Funds the strategy was tested on</div>'
      + table(['Fund', 'Wrapper', 'Value in the test'], P.allocation.taggedFunds.map((f) => [esc(f.name || f.ticker || ''), esc(f.wrapper || ''), gbp(f.value)]))
      + '<p class="hint">The Stress tester\'s own list — an input to the test, not a record of what you hold.</p>';
  }
  h += section('3. Portfolio — what you held, and what the plan was priced on', pf);

  // Assumptions + how the Decision tool runs it
  const A = d.assumptions || {}, DR = d.decisionRun || {};
  let as = table(['Assumption', 'Value'], [
    ['Plan starts', esc(DR.year0 || '') + (DR.bridgeMonths > 0 ? ' — ' + DR.bridgeMonths + ' run-up month' + (DR.bridgeMonths === 1 ? '' : 's') + ' before it, drawn from the SIPP cash' : '')],
    ['Duration', esc(String(A.duration || '')) + ' years'],
    ['State Pension', A.spStartDate ? esc(A.spStartDate) + ', ' + gbp(A.spWeeklyAmount) + '/week (' + gbp(A.spWeeklyAmount * 52) + '/yr)' : 'not entered'],
    ['Tax bands (year 0)', 'PA ' + gbp(A.pa) + ' · basic-rate limit ' + gbp(A.brl) + ' · higher ' + gbp(A.hrl) + ' · ' + (A.taxMode === 'frozen' ? 'frozen' : 'rise with inflation')],
    ['Decision tool CPI assumption', ((A.cpiDecision || 0) * 100).toFixed(0) + '% a year until each year\'s CPI is entered'],
    ...(A.cashYears != null ? [['Cash years first', esc(String(A.cashYears)) + (A.bridgeCash ? ' · SIPP cash to the first April ' + gbp(A.bridgeCash) : '')]] : []),
    ...(A.giltPricesAsOf ? [['Gilt prices as of', esc(A.giltPricesAsOf)]] : []),
    ['Engine', 'v' + esc(d.engineVersion || '') + ' (app v' + esc(d.appVersion || '') + ')']
  ]);
  as += '<div class="section-title" style="font-size:13px;margin-top:10px;">How the Decision tool runs this plan</div><ul>'
    + '<li>Plan year 0 is tax year ' + esc(DR.year0 || '') + '. Months before it are the run-up: paid from your SIPP cash (the money-market fund the cash years also use); nothing is sold.</li>'
    + '<li>Each month you enter: ' + (DR.monthlyAsks || []).map(esc).join(' · ') + '.</li>'
    + (DR.contract ? '<li>The recommendation is the year\'s rung (or the cash years) divided over the months left. Nothing is sold; pot floors and rebalancing do not apply.</li>'
      : '<li>The recommendation draws to the tax bands, keeps the pots on their glidepath tracks and applies protection in a downturn.</li>')
    + '<li>The tax-year wizard each April takes the next step from this document\'s schedule, uplifted by the CPI you enter.</li></ul>';
  h += section('4. Assumptions and how the Decision tool runs it', as);

  // Getting there (6.7.0): the locked accumulation path for a plan that starts later
  if (d.accumulation && d.accumulation.potNow == null) {
    // Locked with no pot on record (6.13.0): the path could not be drawn — say what to do, never invent one.
    h += section('4b. Getting there — the locked accumulation path', '<p>The plan was locked without a pension pot on record' + (d.accumulation.totalMonthly ? ' (' + gbp(d.accumulation.totalMonthly) + ' a month going in)' : '') + '. Record what you hold on the Transition tab (or the pot today on the Accumulation planner) and refresh the plan document; the path from today to age ' + esc(String(d.accumulation.retireAge || '')) + ' is then drawn from your own pot, not from the pots the strategy was tested on.</p>');
  } else if (d.accumulation && Array.isArray(d.accumulation.path) && d.accumulation.path.length > 1) {
    const A = d.accumulation; const hasMix = A.path[0].potMix != null;
    let gt = '<p>Pension pot ' + gbp(A.potNow) + ' today' + (A.potSource === 'holdings' ? ' (from what you hold)' : A.potSource === 'accumulation' ? ' (the pot today on the Accumulation planner)' : '') + (A.totalMonthly ? ', ' + gbp(A.totalMonthly) + ' a month going in' : '') + (A.mixText ? ', held as ' + esc(A.mixText) : '') + '. In today\'s money:</p>'
      + table(['Age', 'Cautious (2%)', 'Middle (5%)', ...(hasMix ? ['Your mix'] : []), 'Strong (8%)', 'Paid in'], A.path.map((r) => [String(r.age), gbp(r.potLow), gbp(r.potMid), ...(hasMix ? [gbp(r.potMix)] : []), gbp(r.potHigh), gbp(r.contributedToDate)]))
      + '<p class="hint">Record your pot each month on the Accumulation planner; the "where you are" strip reads it against ' + (hasMix ? 'the "your mix" line' : 'the middle line') + '. When the plan starts, the first Decision entry checks the pot you arrive with against the pot the plan was priced on.</p>';
    h += section('4b. Getting there — the locked accumulation path', gt);
  }
  // Journey: the stages this plan has been through, with dates (6.6.0)
  if (Array.isArray(d.journey) && d.journey.length) {
    h += section('5. Journey', table(['When', 'Stage', 'Note'], d.journey.map((j) => [esc(dateGB(j.at)), esc(j.label || j.stage || ''), esc(j.note || '')])) + '<p class="hint">Stages are worked out from your age, the plan start and the lock — never chosen by hand — and each change is dated here.</p>');
  }
  h += '<p class="hint" style="margin-top:12px;">Illustration, not advice. This document records the plan as it was when it was locked; it does not change when markets or the app move. Compare it with the live Decision tool each month.</p>';
  h += '</div>';
  return h;
}

/** The "where you are" strip. */
export function whereAmIHtml(w) {
  if (!w) return '';
  const parts = [];
  if (w.saving && w.bridge) {
    // Still saving for a plan locked in advance (6.7.0)
    const s = w.saving;
    parts.push('<strong>' + (s.monthsToGo >= 24 ? Math.round(s.monthsToGo / 12) + ' years' : s.monthsToGo + ' month' + (s.monthsToGo === 1 ? '' : 's')) + ' to go</strong> — the plan starts in ' + esc(w.planStart) + '.');
    if (s.pathMissing) parts.push('The plan was locked without a pension pot on record, so there is no locked path to read against' + (s.actual != null ? ' — your pot today is ' + gbp(s.actual) + (s.actualSource === 'holdings' ? ' from what you hold' : '') : '') + '. Record what you hold and refresh the plan document.');
    else if (s.actual != null && s.expected != null) parts.push('Pension pot ' + gbp(s.actual) + (s.recordedAt ? ' (' + (s.actualSource === 'holdings' ? 'holdings as of ' : 'recorded ') + esc(s.recordedAt) + ')' : s.actualSource === 'holdings' ? ' (from what you hold)' : '') + ' against ' + gbp(s.expected) + ' on the locked path — <strong>' + esc(s.band || '') + '</strong>' + (s.low != null && s.high != null ? ' (cautious ' + gbp(s.low) + ', strong ' + gbp(s.high) + ')' : '') + '.');
    else if (s.expected != null) parts.push('The locked path expects about ' + gbp(s.expected) + ' in the pension pot now. Record this month\'s pot on the Accumulation planner to compare.');
    if (s.contributions > 0) parts.push('Contributions on the locked plan: ' + gbp(s.contributions) + ' a month gross.');
  }
  else if (w.bridge) parts.push('<strong>Run-up month</strong> — tax year ' + esc(w.taxYear) + ', ' + (-w.planYear) + ' tax year' + (w.planYear === -1 ? '' : 's') + ' before the plan\'s year 0, ' + esc(w.planStart) + '. Drawn from your SIPP cash; the ladder\'s rungs begin at year 0.');
  else parts.push('<strong>Plan year ' + w.planYear + ' of ' + w.planYears + '</strong> — tax year ' + esc(w.taxYear) + ', age ' + w.age + '.');
  if (w.step) parts.push('Income step ' + w.step.index + ' of ' + w.step.of + ': ' + gbp(w.step.amount) + '/yr gross' + (w.step.next ? '; next step ' + gbp(w.step.next.amount) + ' from age ' + w.step.next.fromAge + ' (' + esc(w.step.next.taxYear || '') + ', ' + w.step.next.yearsAway + ' year' + (w.step.next.yearsAway === 1 ? '' : 's') + ' away)' : '; no further steps') + '.');
  if (w.incomeThisYear && w.incomeThisYear.recorded) parts.push(w.incomeThisYear.recorded + ' month' + (w.incomeThisYear.recorded === 1 ? '' : 's') + ' recorded this tax year: ' + gbp(w.incomeThisYear.drawn) + ' gross so far' + (w.incomeThisYear.perMonth ? ' against ' + gbp(w.incomeThisYear.perMonth) + ' a month planned' : '') + '.');
  if (w.pot && w.pot.actual != null) {
    if (w.pot.flat) parts.push('Pot ' + gbp(w.pot.actual) + '; the plan\'s path is bought by contract (' + gbp(w.pot.p50) + ' expected this year).');
    else if (w.pot.p10 != null && w.pot.p90 != null && Math.abs(w.pot.p90 - w.pot.p10) < 1) parts.push('Pot ' + gbp(w.pot.actual) + ' at the start of the plan, priced on ' + gbp(w.pot.p50) + '; the cone opens from next year.');
    else if (w.pot.band) parts.push('Pot ' + gbp(w.pot.actual) + ' — ' + (w.pot.band === 'below p10' ? '<strong>below the plan\'s 1-in-10 bad line</strong> (' + gbp(w.pot.p10) + ')' : w.pot.band === 'p10–p50' ? 'between the 1-in-10 bad line (' + gbp(w.pot.p10) + ') and the median (' + gbp(w.pot.p50) + ')' : w.pot.band === 'p50–p90' ? 'between the median (' + gbp(w.pot.p50) + ') and the 1-in-10 good line (' + gbp(w.pot.p90) + ')' : 'above the plan\'s 1-in-10 good line (' + gbp(w.pot.p90) + ')') + '.');
  }
  if (w.ladder && w.ladder.instruction) parts.push(esc(w.ladder.instruction));
  return '<div class="alert alert-info pd-where"><div class="section-title" style="font-size:13px;">Where you are — ' + esc(dateGB(w.today)) + '</div><p style="margin:4px 0 0;">' + parts.join(' ') + '</p></div>';
}
