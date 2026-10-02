/**
 * Plan Document — HTML. Pure: document JSON in, HTML string out. The heavy renderers that live in
 * index.html (the strategy card, the staircase SVG) are injected so this module stays testable.
 */
import { esc } from './ReleaseNotesView.js';
import { isaGrowthAssumptionText } from '../isaGrowthSetting.js';

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

const fmtPct = (v) => String(Math.round((+v || 0) * 100) / 100);
/**
 * The fund and platform charge the plan's figures were worked out at (6.19.0, assumptions.chargesPct, recorded at lock).
 * A document written before charges has no key: its figures were worked out without them — say so; it is never rewritten.
 */
function chargesAssumptionText(A) {
  if (!A || typeof A.chargesPct !== 'number') return 'not taken off — this plan was locked before charges were added';
  if (!(A.chargesPct > 0)) return 'none (0%)';
  return esc(fmtPct(A.chargesPct)) + '% a year, taken off every month from the money held in funds and cash; not off gilts held directly, annuities, final-salary or State Pensions';
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
    ['Fund and platform charges', chargesAssumptionText(A)],
    ['How the ISA and savings grow', esc(isaGrowthAssumptionText(A))],
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
  } else if (d.accumulation && d.accumulation.version === 3 && Array.isArray(d.accumulation.path) && d.accumulation.path.length > 1) {
    h += section('4b. Getting there — the locked saving path', savingPathV3Html(d));
  } else if (d.accumulation && Array.isArray(d.accumulation.path) && d.accumulation.path.length > 1) {
    const A = d.accumulation; const hasMix = A.path[0].potMix != null;
    let gt = '<p>Pension pot ' + gbp(A.potNow) + ' today' + (A.potSource === 'holdings' ? ' (from what you hold)' : A.potSource === 'accumulation' ? ' (the pot today on the Accumulation planner)' : '') + (A.totalMonthly ? ', ' + gbp(A.totalMonthly) + ' a month going in' : '') + (A.mixText ? ', held as ' + esc(A.mixText) : '') + '. In today\'s money:</p>'
      + table(['Age', 'Cautious (2%)', 'Middle (5%)', ...(hasMix ? ['Your mix'] : []), 'Strong (8%)', 'Paid in'], A.path.map((r) => [String(r.age), gbp(r.potLow), gbp(r.potMid), ...(hasMix ? [gbp(r.potMix)] : []), gbp(r.potHigh), gbp(r.contributedToDate)]))
      + (+A.chargesPct > 0 ? '<p class="hint">Each line is after fund and platform charges of ' + esc(fmtPct(A.chargesPct)) + '% a year, taken off every month' + (hasMix ? ' (on the "your mix" line in place of your funds\' own charges)' : '') + '.</p>' : '')
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

/** { equity, bond, cash } shares of 1 → '100% shares · 0% bonds · 0% cash'. */
const mixWords = (m) => Math.round((+m.equity || 0) * 100) + '% shares · ' + Math.round((+m.bond || 0) * 100) + '% bonds · ' + Math.round((+m.cash || 0) * 100) + '% cash';
const ISA_GROWS = { cash: 'grows mostly as cash (last year\'s rise in prices, less 1% a year)', invested: 'is invested like your pension' };
/**
 * Section 4b for a saving path drawn on V7's saving-years engine (6.22.0, plan document version 3; SavingPath.js): the
 * pension and the ISA with what goes into each, 1,000 futures, the middle line and the 1-in-10 bad and good lines.
 */
export function savingPathV3Html(d) {
  const A = d.accumulation;
  const when = whenText(A.asOf);
  const step = A.path.length > 13 ? 5 : 1;
  const rows = A.path.filter((r, i) => i === 0 || i === A.path.length - 1 || i % step === 0);
  const isa = (+A.isaNow || 0) > 0 || (+A.isaMonthly || 0) > 0;
  let h = '<p>Pension pot ' + gbp(A.potNow) + (A.potSource === 'holdings' ? ' (from what you hold)' : A.potSource === 'accumulation' ? ' (the pot today on the Accumulation planner)' : '')
    + (isa ? ' and ISA and savings ' + gbp(A.isaNow) : '') + (when ? ' in ' + esc(when) : '')
    + (A.totalMonthly ? '; ' + gbp(A.totalMonthly) + ' a month going into the pension' : '') + (A.isaMonthly ? (A.totalMonthly ? ' and ' : '; ') + gbp(A.isaMonthly) + ' a month into ISAs and savings' : '')
    + ((A.totalMonthly || A.isaMonthly) && A.escalationPct ? ', raised by ' + esc(fmtPct(A.escalationPct)) + '% a year' : '')
    + (A.mixText ? '; the pension held as ' + esc(A.mixText) : '') + '.'
    + (isa ? ' The ISA ' + (A.isaFromFunds ? 'follows the ISA funds in your list of funds to test' + (A.isaMix ? ' (' + mixWords(A.isaMix) + ')' : '') : ISA_GROWS[A.isaGrowth] || 'grows at a fixed ' + esc(fmtPct((+A.isaReturn || 0.03) * 100)) + '% a year') + '.' : '')
    + ' Drawn on ' + Math.round(+A.lives || 0).toLocaleString('en-GB') + ' possible futures, one per life (the same lives as the preview\'s saving-years engine). In the prices of ' + esc(when || 'the day it was drawn') + ':</p>';
  h += table(['Age', '1-in-10 bad', 'Middle', '1-in-10 good', ...(isa ? ['Pension (middle)', 'ISA (middle)'] : []), 'Paid in (pounds of the day)'],
    rows.map((r) => [String(Math.round(r.age)), gbp(r.real.careful), gbp(r.real.middling), gbp(r.real.good), ...(isa ? [gbp(r.pension.real), gbp(r.isa.real)] : []), gbp(r.paidIn)]));
  const par = d.pots && d.pots.potAtRetirement;
  const last = A.path[A.path.length - 1];
  if (par && (+par.sipp > 0 || +par.isa > 0)) {
    h += '<p class="hint">The plan was priced on pots at ' + esc(String(A.retireAge)) + ' of ' + gbp(par.sipp) + (+par.isa > 0 ? ' and ISA ' + gbp(par.isa) : '') + ' (the Timing block, in today\'s money). On the futures this path was drawn on, the middle pot at ' + esc(String(A.retireAge)) + ' is ' + gbp(last.real.middling) + ' (pension ' + gbp(last.pension.real) + (isa ? ', ISA ' + gbp(last.isa.real) : '') + ').</p>';
  }
  if (+A.chargesPct > 0) h += '<p class="hint">After fund and platform charges of ' + esc(fmtPct(A.chargesPct)) + '% a year, taken off every month.</p>';
  h += '<p class="hint">Record your pot each month on the Accumulation planner' + (isa ? ' — your pension and your ISA' : '') + '; the "where you are" strip reads it against these lines in pounds of the day (each future carries its own prices, so no rise in prices has to be assumed). When the plan starts, the first Decision entry checks the pot you arrive with against the middle line at the stop.</p>';
  return h;
}

/** 'YYYY-MM' → 'September 2026'; 'YYYY-MM-DD' → '5 January 2027'; anything else ''. */
function whenText(s) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(s || ''));
  if (!m) return '';
  const d = new Date(+m[1], +m[2] - 1, m[3] ? +m[3] : 1);
  return m[3] ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}
const PART_NAME = { pension: 'pension', isa: 'ISA', gia: 'taxable account', diversifiers: 'diversifiers' };
const ADD_NAME = { isa: 'your ISA', gia: 'your taxable account (GIA)' };
/** Where a figure came from, in words: "recorded September 2026" / "from What you hold as of 5 January 2027". */
function sourceText(x) {
  const when = whenText(x.asOf);
  if (x.source === 'record') return 'recorded ' + (when || 'in the Decision tool');
  if (x.source === 'holdings') return 'from What you hold' + (when ? ' as of ' + when : '');
  return when;
}
const pctText = (v) => (Math.round(v * 1000) / 10).toLocaleString('en-GB', { maximumFractionDigits: 1 }) + '%';
/**
 * ", which is £Y in prices at the start of the plan, the prices its figures are in (prices up Z% since: …)" — the plan's
 * figures are in prices at its start; the pot is in the pounds of its month (6.20.1). '' when prices have not moved.
 */
function pricesText(P) {
  const pr = P.prices;
  if (!pr || P.real == null || !(Math.abs(pr.factor - 1) >= 0.0005)) return '';
  const a = pctText(pr.assumed || 0.04) + ' a year';
  const basis = !pr.entered ? a + ' assumed' : pr.entered >= pr.years ? 'the CPI entered in the Decision tool' : 'the CPI entered in the Decision tool, ' + a + ' where none was entered';
  return ', which is ' + gbp(P.real) + ' in prices at the start of the plan, the prices its figures are in (prices ' + (pr.factor >= 1 ? 'up ' : 'down ') + pctText(Math.abs(pr.factor - 1)) + ' since: ' + basis + ')';
}
/** "Your pension figure is from April 2028: enter this month's values in the Decision tool for a closer reading." */
function staleText(stale) {
  if (!Array.isArray(stale) || !stale.length) return '';
  const items = stale.map((x, i) => (i === 0 ? 'Your ' : 'your ') + (PART_NAME[x.key] || 'pot') + ' figure ' + (i === 0 ? 'is ' : '') + 'from ' + esc(whenText(x.asOf)));
  const fromRecord = stale.some((x) => x.source === 'record'), fromHoldings = stale.some((x) => x.source === 'holdings');
  const todo = [fromRecord ? 'enter this month\'s values in the Decision tool' : '', fromHoldings ? (fromRecord || stale.length > 1 ? 'update What you hold' : 'update it under What you hold') : ''].filter(Boolean).join(' and ');
  return ' ' + items.join(' and ') + ': ' + todo + ' for a closer reading.';
}
const VERDICT = {
  'below p10': (P) => '<strong>below the plan\'s 1-in-10 bad line</strong> (' + gbp(P.p10) + ')',
  'p10–p50': (P) => 'between the 1-in-10 bad line (' + gbp(P.p10) + ') and the median (' + gbp(P.p50) + ')',
  'p50–p90': (P) => 'between the median (' + gbp(P.p50) + ') and the 1-in-10 good line (' + gbp(P.p90) + ')',
  'above p90': (P) => 'above the plan\'s 1-in-10 good line (' + gbp(P.p90) + ')'
};
/**
 * The pot sentence of the strip (6.20.1): the pot is made of what the plan's band counts, each part with where and
 * when it came from, put into the plan's prices; a figure the band needs that is missing → nothing compared, and what
 * to add. A verdict only when the two are the same measure and the band has opened (`pot.verdict`, potReading).
 */
export function whereAmIPotText(pot) {
  if (!pot) return '';
  const P = pot;
  const missing = Array.isArray(P.missing) ? P.missing : [];
  const parts = Array.isArray(P.parts) ? P.parts : [];
  const pension = parts.find((x) => x.key === 'pension');
  const leftOut = P.isaLeftOut ? ' Your ISA is held aside, outside this plan, so neither the pot nor the plan\'s band counts it.' : '';
  if (missing.includes('pension')) return 'No pension pot on record yet to set against the plan\'s band. Enter this month\'s values in the Decision tool, or record what you hold on the Transition tab, to compare.';
  if (missing.length) {
    const head = pension ? 'Pension pot ' + gbp(pension.value) + ' (' + esc(sourceText(pension)) + '). ' : '';
    if (missing.includes('diversifiers')) return head + 'The plan\'s band counts your diversifiers as well, and the monthly record does not keep their value, so the pot is not set against the band. Record what you hold, diversifiers included, under What you hold on the Transition tab to compare.';
    const names = missing.filter((k) => ADD_NAME[k]);
    return head + 'The plan\'s band counts ' + names.map((k) => (k === 'isa' ? 'your ISA' : 'your taxable account')).join(' and ') + ' as well, and there is no figure on record for ' + (names.length > 1 ? 'either' : 'it') + ', so the pot is not set against the band. Add ' + names.map((k) => ADD_NAME[k]).join(' and ') + ' under What you hold, on the Transition tab, to compare.';
  }
  if (P.actual == null || P.p50 == null) return '';
  // "Pot £X (recorded September 2026)", or with more than one account
  // "Pot £X (pension £A recorded September 2026; ISA £B from What you hold as of 5 January 2027)".
  let pt = 'Pot ' + gbp(P.actual);
  if (parts.length > 1) pt += ' (' + parts.map((x) => PART_NAME[x.key] + ' ' + gbp(x.value) + (sourceText(x) ? ' ' + esc(sourceText(x)) : '')).join('; ') + ')';
  else if (parts[0] && parts[0].source !== 'today' && sourceText(parts[0])) pt += ' (' + esc(sourceText(parts[0])) + ')';
  pt += pricesText(P);
  const expects = ' against ' + gbp(P.p50) + ' the plan expects by then' + (P.runUp ? ' (' + gbp(P.startP50) + ' at the start of the plan + ' + gbp(P.runUp.value) + ' of run-up cash for the ' + P.runUp.months + ' month' + (P.runUp.months === 1 ? '' : 's') + ' still to pay)' : '');
  const verdict = P.verdict || (P.band ? 'band' : null);
  let s;
  if (verdict === 'gilts-at-cost') {
    // The band holds the gilts at what they cost, the record at their market value: no verdict (RUNGS_AT_COST).
    s = pt + expects + (P.flat ? '; the plan\'s path is bought by contract' : '') + '. The plan counts its gilts at what they cost and your figure is at today\'s market prices, so the gap between the two is not read as ahead or behind: the rungs still pay what they were bought to pay.';
  } else if (verdict === 'start') {
    s = P.planYear < 0
      ? pt + ' against ' + gbp(P.p50) + ' the plan starts from; the band opens once the plan has started.'
      : pt + ' at the start of the plan, priced on ' + gbp(P.p50) + '; the band opens as the year goes on.';
  } else if (verdict === 'not-open') {
    s = pt + expects + '; the plan\'s band has not opened yet.';
  } else if (verdict === 'band' && VERDICT[P.band]) {
    s = pt + ' — ' + VERDICT[P.band](P) + '.';
  } else return '';
  return s + leftOut + staleText(P.stale);
}

const SAVER_V3_BAND = {
  'below p10': (s) => '<strong>below the locked path\'s 1-in-10 bad line</strong> (' + gbp(s.low) + ')',
  'p10–p50': (s) => 'between the 1-in-10 bad line (' + gbp(s.low) + ') and the middle (' + gbp(s.expected) + ')',
  'p50–p90': (s) => 'between the middle (' + gbp(s.expected) + ') and the 1-in-10 good line (' + gbp(s.high) + ')',
  'above p90': (s) => '<strong>above the locked path\'s 1-in-10 good line</strong> (' + gbp(s.high) + ')'
};
/** 'YYYY-MM' → 'July 2026' (no day). */
const monthText = (k) => whenText(String(k || '').slice(0, 7));
/**
 * The saver's sentence of the strip (6.22.0; services/SaverReading.js): the recorded pot against the locked saving path,
 * like with like. A path drawn before 6.22.0 is the pension only, in the prices of the day it was drawn: the pot is put
 * into those prices (2.5% a year, as the path was drawn) and the words say so. A path drawn from 6.22.0 counts the ISA
 * too and is in pounds of the day: no price assumption. A figure the path needs that is missing → nothing compared, and
 * what to add.
 */
export function saverReadingText(s) {
  if (!s) return '';
  const src = s.recordedAt ? (s.actualSource === 'holdings' ? 'holdings as of ' : 'recorded ') + esc(s.recordedAt) : s.actualSource === 'holdings' ? 'from what you hold' : '';
  const from = src ? ' (' + src + ')' : '';
  if (s.pathMissing) return 'The plan was locked without a pension pot on record, so there is no locked path to read against' + (s.actual != null ? ' — your pot today is ' + gbp(s.actual) + (s.actualSource === 'holdings' ? ' from what you hold' : '') : '') + '. Record what you hold and refresh the plan document.';
  const missing = Array.isArray(s.missing) ? s.missing : [];
  if (missing.includes('pension') || (s.actual == null && !missing.length)) return s.expected != null ? 'The locked path expects about ' + gbp(s.expected) + (s.version === 3 ? (s.isaCounted ? ' in your pension and ISA now, in pounds of the day' : ' in the pension pot now, in pounds of the day') : ' in the pension pot now') + '. Record this month\'s pot on the Accumulation planner to compare.' : '';
  if (missing.includes('isa')) return 'Pension pot ' + gbp(s.pension) + from + '. The locked path counts your ISA as well, and there is no ISA figure with it, so the pot is not set against the path. Add your ISA to the monthly record on the Accumulation tab to compare.';
  if (s.version === 3) {
    const what = s.isaCounted ? 'Pension and ISA ' + gbp(s.actual) + ' (' + (src ? src + ': ' : '') + 'pension ' + gbp(s.pension) + ', ISA ' + gbp(s.isa) + ')' : 'Pension pot ' + gbp(s.actual) + from;
    if (s.band === 'start') return what + ', in pounds of the day, against ' + gbp(s.expected) + ' the locked path starts from; its lines open as the months go on.';
    const band = SAVER_V3_BAND[s.band];
    return what + ', in pounds of the day, against ' + gbp(s.expected) + ', the middle of the locked path for then' + (band ? ' — ' + band(s) : '') + '.';
  }
  const pr = s.prices;
  const prices = pr && pr.factor && Math.abs(pr.factor - 1) >= 0.0005 && s.compared != null
    ? ', which is ' + gbp(s.compared) + ' in the prices of ' + esc(monthText(pr.start)) + ', when this path was drawn (prices assumed to rise ' + ((pr.cpi || 0.025) * 100).toFixed(1) + '% a year, as the path does)'
    : '';
  return 'Pension pot ' + gbp(s.actual) + from + prices + ', against ' + gbp(s.expected) + ' on the locked path for then — <strong>' + esc(s.band || '') + '</strong>' + (s.low != null && s.high != null ? ' (cautious ' + gbp(s.low) + ', strong ' + gbp(s.high) + ')' : '') + '. This path was drawn before ISAs were counted: it follows your pension only.';
}

/** The "where you are" strip. */
export function whereAmIHtml(w) {
  if (!w) return '';
  const parts = [];
  if (w.saving && w.bridge) {
    // Still saving for a plan locked in advance (6.7.0; read like with like from 6.22.0 — saverReadingText)
    const s = w.saving;
    parts.push('<strong>' + (s.monthsToGo >= 24 ? Math.round(s.monthsToGo / 12) + ' years' : s.monthsToGo + ' month' + (s.monthsToGo === 1 ? '' : 's')) + ' to go</strong> — the plan starts in ' + esc(w.planStart) + '.');
    const text = saverReadingText(s);
    if (text) parts.push(text);
    if (s.contributions > 0 || s.isaMonthly > 0) parts.push('Going in on the locked plan: ' + [s.contributions > 0 ? gbp(s.contributions) + ' a month gross into your pension' : '', s.isaMonthly > 0 ? gbp(s.isaMonthly) + ' a month into ISAs and savings' : ''].filter(Boolean).join(' and ') + '.');
  }
  else if (w.bridge) parts.push('<strong>Run-up month</strong> — tax year ' + esc(w.taxYear) + ', ' + (-w.planYear) + ' tax year' + (w.planYear === -1 ? '' : 's') + ' before the plan\'s year 0, ' + esc(w.planStart) + '. Drawn from your SIPP cash; the ladder\'s rungs begin at year 0.');
  else parts.push('<strong>Plan year ' + w.planYear + ' of ' + w.planYears + '</strong> — tax year ' + esc(w.taxYear) + ', age ' + w.age + '.');
  if (w.step) parts.push('Income step ' + w.step.index + ' of ' + w.step.of + ': ' + gbp(w.step.amount) + '/yr gross' + (w.step.next ? '; next step ' + gbp(w.step.next.amount) + ' from age ' + w.step.next.fromAge + ' (' + esc(w.step.next.taxYear || '') + ', ' + w.step.next.yearsAway + ' year' + (w.step.next.yearsAway === 1 ? '' : 's') + ' away)' : '; no further steps') + '.');
  if (w.incomeThisYear && w.incomeThisYear.recorded) parts.push(w.incomeThisYear.recorded + ' month' + (w.incomeThisYear.recorded === 1 ? '' : 's') + ' recorded this tax year: ' + gbp(w.incomeThisYear.drawn) + ' gross so far' + (w.incomeThisYear.perMonth ? ' against ' + gbp(w.incomeThisYear.perMonth) + ' a month planned' : '') + '.');
  const potText = whereAmIPotText(w.pot);
  if (potText) parts.push(potText);
  if (w.ladder && w.ladder.instruction) parts.push(esc(w.ladder.instruction));
  return '<div class="alert alert-info pd-where"><div class="section-title" style="font-size:13px;">Where you are — ' + esc(dateGB(w.today)) + '</div><p style="margin:4px 0 0;">' + parts.join(' ') + '</p></div>';
}
