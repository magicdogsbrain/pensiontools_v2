/**
 * Plan Document — HTML. Pure: document JSON in, HTML string out. The heavy renderers that live in
 * index.html (the strategy card, the staircase SVG) are injected so this module stays testable.
 */
import { esc } from './ReleaseNotesView.js';
import { spanText, money } from '../../reading/format.js';
import { monthWords as monthYearWords, dayWords } from '../../answers/plan/dates.js';
import { isaGrowthAssumptionText } from '../isaGrowthSetting.js';
import { decisionRunWords, mixWords } from '../../services/StrategyWords.js';
import { assumedStatePensionWords } from '../plannerWords.js';
import { ukDate } from '../ukDates.js';
import { pctText as pctShare } from '../../services/OneAnswer.js';
import { takenSentence, sentenceText } from '../../services/YearPlan.js';
import { definitionOf, guaranteeSaid, timingWords } from '../../services/PlanDocument.js';
import { successLineHtml } from '../oneAnswerView.js';
import { POTS } from '../../v7/copy/pots.js';
import { STRESS } from '../../v7/copy/stressPanel.js';
import { PLAN } from '../../v7/copy/plan.js';
import { lockedShortOf } from '../../services/PlanCommit.js';
import { STRESS as STRESS_ON } from '../../answers/shared/rules.js';
import { markFact, markWithin, asRecord } from '../../reading/mark.js';
import { pensionFromWords } from '../../reading/money.js';
import { LABELS } from '../../reading/labels.js';
import { FACT, factId } from '../../reading/facts.js';
import { GUARDRAIL_FACTS, TAKEN_FACTS, PLAN_MIX_SLOTS, POT_FROM_FIND, sentenceHtml } from '../../reading/sentenceMarks.js';
import { planYearSentence, stepSentence, ladderSentence, potSentence, WHERE_KEYS, stepKeysOf, STEP_FINDS } from '../../reading/where.js';

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

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/**
 * A plan locked after its year 0 (6.50.0: `pots.asOfPlanYear`): the plan year its pots belong to, and the month they were
 * entered in ('November 2026'), from the document's own year 0 and `timing.monthsIntoYear`. Null for every other document.
 */
export function potsAsOfWords(doc) {
  const d = doc || {};
  const n = Math.round(+(d.pots && d.pots.asOfPlanYear) || 0);
  const y0 = +(d.timing && d.timing.firstTaxYear) || +(d.assumptions && d.assumptions.firstTaxYear) || 0;
  if (!(n > 0) || !(y0 > 0)) return null;
  const m = Math.max(0, Math.min(11, Math.round(+(d.timing && d.timing.monthsIntoYear) || 0)));
  const idx = 3 + m;   // April is month 0 of a plan year
  return { planYear: n, month: MONTH_NAMES[idx % 12] + ' ' + (y0 + n + Math.floor(idx / 12)), monthsLeft: 12 - m };
}

/**
 * Had the plan's income started on the day it was locked (6.51.0)? A document locked in a later plan year (potsAsOfWords),
 * on its year 0's pots (`pots.asOfPlanYear` 0, written), or on or after 6 April of its year 0. Its header and its
 * assumptions then say "Plan started"; every other document "Plan starts".
 */
export function startedAtLock(doc) {
  const d = doc || {};
  if (potsAsOfWords(d) || (d.pots && d.pots.asOfPlanYear === 0)) return true;
  const y0 = +(d.timing && d.timing.firstTaxYear) || +(d.assumptions && d.assumptions.firstTaxYear) || 0;
  const at = d.lockedAt ? new Date(d.lockedAt) : null;
  return y0 > 0 && !!at && Number.isFinite(at.getTime()) && at.getTime() >= new Date(y0, 3, 6).getTime();
}

/** When the document's own sentences were written: on the lock's day, or on the day it was written after it. */
export function writtenWhen(doc) {
  const d = doc || {};
  return d.createdAt && dateGB(d.createdAt) !== dateGB(d.lockedAt) ? 'As written on ' + dateGB(d.createdAt) : 'As written when the plan was locked';
}

/** Report header (stands on its own in a PDF). */
export function planDocumentHeaderHtml(doc) {
  const d = doc || {};
  const asOf = potsAsOfWords(d);
  return '<div class="rpt-header"><h1>Plan document — ' + esc(d.planName || 'My plan') + '</h1>'
    + '<div class="rpt-sub">Locked ' + markFact('lock.date', esc(dayWords(d.lockedAt) || dateGB(d.lockedAt))) + (d.createdAt && d.createdAt !== d.lockedAt ? ' · document created ' + esc(dateGB(d.createdAt)) : '') + ' · PensionTools v' + esc(d.appVersion || '') + ', engine ' + esc(d.engineVersion || '') + '</div>'
    + '<table class="rpt-meta"><tr><td>Strategy</td><td>' + (strategyNameOf(d.strategy) ? markFact('way.name', esc(strategyNameOf(d.strategy))) : '—') + '</td><td>' + (startedAtLock(d) ? 'Plan started' : 'Plan starts') + '</td><td>' + esc(d.decisionRun?.year0 || '—') + (asOf ? ' (locked in plan year ' + asOf.planYear + ')' : '') + '</td></tr>'
    + '<tr><td>Priced on</td><td>' + gbp(d.pots?.sipp) + (d.pots?.isa ? (d.pots.isaPolicy === 'hold' ? ', ISA ' + gbp(d.pots.isa) + ' held aside' : ' + ISA ' + gbp(d.pots.isa)) : '') + (d.pots?.gia ? ' + GIA ' + gbp(d.pots.gia) : '') + '</td><td>First step</td><td>' + (d.steps?.[0] ? gbp(d.steps[0].amount) + '/yr from age ' + esc(String(d.steps[0].fromAge)) : '—') + '</td></tr></table></div>';
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
  if (!lines.length) return h + '<p class="hint">No holdings were listed when the plan was locked, and you do not need to list them. If you do (What you hold, on the Transition tab), the move reads that list, never the funds the strategy was tested on.</p>';
  const byWrapper = {}; let total = 0;
  for (const l of lines) { const v = +l.value || 0; total += v; byWrapper[l.wrapper || 'SIPP'] = (byWrapper[l.wrapper || 'SIPP'] || 0) + v; }
  const anyUnits = lines.some((l) => l.units != null), anyAsOf = lines.some((l) => l.asOf);
  h += table(['Holding', 'Wrapper', ...(anyUnits ? ['Units'] : []), 'Value', ...(anyAsOf ? ['As of'] : [])],
    lines.map((l) => [esc(l.name || l.ticker || l.sedol || '') + (l.ticker && l.name ? ' <span class="hint">' + esc(l.ticker) + '</span>' : ''), esc(l.wrapper || ''), ...(anyUnits ? [l.units != null ? Math.round(+l.units).toLocaleString('en-GB') : '—'] : []), l.value != null ? gbp(l.value) : '—', ...(anyAsOf ? [esc(ukDate(l.asOf || ''))] : [])]));
  h += '<p class="hint">Total ' + gbp(total) + ' — ' + Object.entries(byWrapper).map(([w, v]) => esc(w) + ' ' + gbp(v)).join(' · ') + (H.updatedAt ? '; recorded ' + esc(ukDate(H.updatedAt)) : '') + (SOURCE_TEXT[H.source] ? ' (' + SOURCE_TEXT[H.source] + ')' : '') + '.</p>';
  return h;
}

/**
 * The whole document.
 * @param {object} doc
 * @param {object} r  { strategyCard(r, p, opts) → html, staircaseSvg(layersArgs) → svg, whereAmI: html to place at the top,
 *   notice: html of one line under the header, above Where you are — a closed plan's "Closed March 2029; carried on as ‘…’",
 *   or "Under your previous plan ‘…’ until …" on the plan that carries one on (6.56.0, src/ui/planCloseUi.js planNoticeHtml) }
 */
export function planDocumentHtml(doc, r = {}) {
  const d = doc || {};
  if (!d.timing) return '<div class="card"><p class="hint">No plan document yet.</p></div>';
  const t = d.timing;
  let h = '<div class="card pd">';
  h += planDocumentHeaderHtml(d);
  // 7.12.0: locked when its gilt ladder cost more than its pots — said once, at the top (V7's words)
  const ls = lockedShortOf(d);
  if (ls) h += '<div class="alert alert-warning" id="pdLockedShort">' + esc(PLAN.lockedShort.replace('{short}', '£' + ls.short.toLocaleString('en-GB'))) + '</div>';
  if (r.notice) h += r.notice;
  if (r.whereAmI) h += r.whereAmI;
  // The timing sentence is the snapshot's (its "in 9 months" was counted on the day it was written): say so, or it reads as
  // today's under "Where you are" (sweep 18 Oct 2026). A document written after the lock — "Write a new version from today's
  // settings", or a move of the plan's start (6.53.0) — says the day it was written, not the lock's.
  // its end age said in the one rule (PlanDocument.timingWords: a document written before 7.9.0 said one year less)
  if (t.text) h += '<p>' + (r.whereAmI ? '<span class="hint">' + writtenWhen(d) + ': </span>' : '') + esc(timingWords(d)) + '</p>';

  // Timeline: picture + table
  let tl = '';
  if (r.staircaseSvg && d.layers && d.steps?.length) {
    try {
      tl += '<div class="machine-scroll">' + r.staircaseSvg({ steps: d.steps.map((s) => ({ fromAge: s.fromAge, amount: s.amount, decline: s.decline, glideToNext: s.glideToNext })), ageNow: d.layers.ageNow, horizonAge: d.layers.horizonAge, essentials: d.layers.essentials || 0, budgetGross: d.layers.budgetGross || 0, sp: d.layers.sp, other: d.layers.other || [], prevVals: null, floorVals: d.layers.floorVals || null, events: d.layers.events || [] }) + '</div>';
    } catch (e) { /* picture optional */ }
  }
  if (d.steps?.length) {
    // (step F2, lead4.md D6) each step as the one reader of the steps gives it (src/reading/income.js, handed in as `r.steps`):
    // what is taken a year before tax and what reaches the bank a month, each with its one label; an archived version (no
    // reading) says the step as it was locked, labelled so
    const read = Array.isArray(r.steps) && r.steps.length === d.steps.length ? r.steps : null;
    const B = LABELS[FACT.STEP_BEFORE_TAX], M = LABELS[FACT.STEP_MONTH_AFTER_TAX];
    tl += '<div class="section-title" style="font-size:13px;margin-top:10px;">Income steps (today\'s money)</div>'
      + (read
        ? table(['From age', 'Tax year', B.label + ', ' + B.basis, M.label + ', ' + M.basis, 'Then'], d.steps.map((s, i) => [esc(String(s.fromAge)), esc(s.taxYear || ''), markFact('income.step.' + i + '.beforeTax', money(read[i].beforeTax)), markFact('income.step.' + i + '.monthAfterTax', money(read[i].monthAfterTax)), esc(s.slope || '')]))
        : table(['From age', 'Tax year', 'As locked, counted as if every pound were taxed', 'Then'], d.steps.map((s) => [esc(String(s.fromAge)), esc(s.taxYear || ''), money(s.amount) + ' a year', esc(s.slope || '')])));
  }
  if (d.timeline?.length) {
    const anyContract = d.timeline.some((x) => x.contract > 0), anyLump = d.timeline.some((x) => x.lumpIn?.length || x.lumpOut?.length), anyLumpUse = d.timeline.some((x) => x.lump > 0);
    const head = ['Plan year', 'Tax year', 'Age', 'Gross income', 'State Pension', 'Other / DB', ...(anyLumpUse ? ['From a lump sum'] : []), anyContract ? 'By contract' : 'From the pot', 'From the market'];
    if (anyLump) head.push('Lump sums');
    const rows = d.timeline.map((x) => {
      const fromPot = anyContract ? x.contract : Math.max(0, x.gross - x.sp - x.other - (x.lump || 0));
      const cells = [String(x.y) + (x.lived ? ' <span class="hint">lived</span>' : '') + (x.cashYear ? ' <span class="hint">cash year</span>' : ''), esc(x.taxYear), String(x.age), gbp(x.gross), x.sp ? gbp(x.sp) : '—', x.other ? gbp(x.other) : '—', ...(anyLumpUse ? [x.lump ? gbp(x.lump) : '—'] : []), fromPot ? gbp(fromPot) : '—', x.market ? gbp(x.market) : '—'];
      if (anyLump) cells.push([...(x.lumpIn || []).map((l) => '▲ ' + esc(l.label) + ' ' + gbp(l.amount)), ...(x.lumpOut || []).map((l) => '▼ ' + esc(l.label) + ' ' + gbp(l.amount))].join('<br>') || '');
      return cells;
    });
    // A plan locked after its year 0 (6.50.0): the run starts on the day of its pots, and its first year is the twelve months
    // from that day at that plan year's figures (PlanFromToday.js, "The run's years") — said here, where the years are read.
    const asOf = potsAsOfWords(d);
    tl += '<div class="section-title" style="font-size:13px;margin-top:10px;">Year by year</div>' + table(head, rows)
      + '<p class="hint">Gross income is the total for the year in today\'s money. "From the market" is the median future\'s contribution over and above the guaranteed layers' + (anyContract ? ' and the rungs bought by contract' : '') + '.'
      + (asOf ? ' The plan was locked in plan year ' + asOf.planYear + ', on the pots as they stood in ' + esc(asOf.month) + ': plan year ' + asOf.planYear + ' here is the twelve months from that month, at plan year ' + asOf.planYear + '\'s figures, and each later year the twelve months after it. The years marked "lived" had already been lived: they show the plan\'s own figures, and nothing was run or bought for them.' : '')
      + '</p>';
  }
  h += section('1. Timeline — your age against the tax years', tl, { open: true, sub: 'what you planned to take, and who pays it' });

  // Strategy
  let st = '';
  if (r.strategyCard && d.strategy?.r && d.strategy?.p) {
    // 7.8.0: the definition it was locked under (PlanDocument.definitionOf: its own success, else the one before 7.8.0), and one line from it;
    // the card is the record as locked: only its own marks (doc.*) stay, never today's ids (its left, worst 12 months, ages)
    try { st = asRecord(r.strategyCard(d.strategy.r, d.strategy.p, { compact: true, definition: definitionOf(d) })) + successLineHtml(d); } catch (e) { st = '<p class="hint">The strategy result could not be drawn from the stored document (' + esc(e.message) + ').</p>'; }
  } else if (d.strategy) {
    const rr = d.strategy.r || {};
    st = '<p><strong>' + esc(strategyNameOf(d.strategy)) + '</strong>' + (rr.ruin ? ' — ran out or was cut in ' + esc(pctShare(+rr.ruin.mc || 0, 1)) + ' of simulated futures; income guaranteed: ' + esc(guaranteeSaid(rr, d.strategy.p) || '—') + '.' : '.') + '</p>';
  }
  h += section('2. Strategy — ' + strategyNameOf(d.strategy), st, { sub: 'the verdict, the cones, and the shopping list as they stood at lock' });

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
      + table(['Plan year', 'Shares', 'Bonds', 'Cash'], d.targetMix.map((m, i) => [String(m.y), ...[[m.equity, 'shares'], [m.bond, 'bonds'], [m.cash, 'cash']].map(([v, b]) => (i === 0 ? markFact(PLAN_MIX_SLOTS[b], esc(String(v))) : esc(String(v))) + '%')]))   // the plan's own mix: its first year marked (mix.plan.#), as the move step says it
      + '<p class="hint">' + esc(mixWords(d.strategy?.id, { allocMode: P.allocation?.allocMode })) + '</p>';
    if (P.allocation?.taggedFunds?.length) pf += '<div class="section-title" style="font-size:13px;margin-top:10px;">Funds the strategy was tested on</div>'
      + table(['Fund', 'Wrapper', 'Value in the test'], P.allocation.taggedFunds.map((f) => [esc(f.name || f.ticker || ''), esc(f.wrapper || ''), gbp(f.value)]))
      + '<p class="hint">The Stress tester\'s own list — an input to the test, not a record of what you hold.</p>';
  }
  h += section('3. Portfolio — what you held, and what the plan was priced on', pf);

  // Assumptions + how the Decision tool runs it
  const A = d.assumptions || {}, DR = d.decisionRun || {};
  const asOfPots = potsAsOfWords(d);
  // When the plan's income starts (6.51.0): a plan locked once it had started says where it stood. An older document's count
  // of months before its start (`decisionRun.bridgeMonths`) is not printed: nobody retired has months before their plan, and
  // a plan stored that way shows one thing to do instead (PlanMove.startLaterOf). The document itself is never rewritten.
  const startText = asOfPots
    ? esc(DR.year0 || '') + ' — locked in plan year ' + asOfPots.planYear + ', on the pots as they stood in ' + esc(asOfPots.month) + ' (' + asOfPots.monthsLeft + ' month' + (asOfPots.monthsLeft === 1 ? '' : 's') + ' of that year still to pay)'
    : esc(DR.year0 || '');
  let as = table(['Assumption', 'Value'], [
    [startedAtLock(d) ? 'Plan started' : 'Plan starts', startText],
    ['Duration', esc(String(A.duration || '')) + ' years'],
    ['State Pension', A.spStartDate ? esc(ukDate(A.spStartDate)) + ', ' + gbp(A.spWeeklyAmount) + '/week (' + gbp(A.spWeeklyAmount * 52) + '/yr)' : (assumedStatePensionWords(d.strategy?.p) ? esc(assumedStatePensionWords(d.strategy?.p)) : 'not entered')],
    ['Tax bands (year 0)', 'PA ' + gbp(A.pa) + ' · basic-rate limit ' + gbp(A.brl) + ' · higher ' + gbp(A.hrl) + '. ' + POTS.modes[A.taxMode === 'frozen' ? 'frozen' : 'inflates']],   // the one sentence both views say (7.12.0)
    ['Decision tool CPI assumption', ((A.cpiDecision || 0) * 100).toFixed(0) + '% a year until each year\'s CPI is entered'],
    // An older document's extra ladder cash beside the cash years is not printed (7.4.2): no run counts it any more, so the
    // figure would sit beside live figures that leave it out. The document itself keeps it as stored.
    ...(A.cashYears != null ? [['Cash years first', esc(String(A.cashYears))]] : []),
    ...(A.spareGrowth ? [['Money left over', 'invested in shares (a growth part); ' + (A.spareFillsCuts ? 'it pays a rotated year the sleeve cannot, before that year counts as cut' : 'never drawn for income')]] : []),   // 6.35.0 (6.36.0: fills cuts); absent = kept, as every earlier document
    ...(!A.spareGrowth && A.spareFillsCuts ? [['Money left over', 'kept, holding its value; it pays a rotated year the sleeve cannot, before that year counts as cut']] : []),   // 6.37.0
    ...(A.giltPricesAsOf ? [['Gilt prices as of', esc(ukDate(A.giltPricesAsOf))]] : []),
    ['Fund and platform charges', chargesAssumptionText(A)],
    ['How the ISA and savings grow', esc(isaGrowthAssumptionText(A))],
    ['Engine', 'v' + esc(d.engineVersion || '') + ' (app v' + esc(d.appVersion || '') + ')']
  ]);
  as += '<div class="section-title" style="font-size:13px;margin-top:10px;">How the Decision tool runs this plan</div><ul>'
    + '<li>Plan year 0 is tax year ' + esc(DR.year0 || '') + '.' + (asOfPots ? ' Months from plan year ' + asOfPots.planYear + ' on are compared with the plan; the years before it are compared with the plan\'s own figures for each year.' : '') + '</li>'
    + '<li>Each month you enter: ' + (DR.monthlyAsks || []).map(esc).join(' · ') + '.</li>'
    + '<li>' + esc(decisionRunWords(d.strategy?.id)) + '</li>'
    + '<li>The tax-year wizard each April takes the next step from this document\'s schedule, uplifted by the CPI you enter.</li></ul>';
  h += section('4. Assumptions and how the Decision tool runs it', as);

  // Getting there (6.7.0): the locked accumulation path for a plan that starts later
  if (d.accumulation && d.accumulation.potNow == null) {
    // Locked with no pot on record (6.13.0): the path could not be drawn — say what to do, never invent one.
    // 7.12.0: said as what happened, never as something the person must record (a plan's own totals are enough)
    h += section('4b. Getting there — the locked accumulation path', '<p>' + esc(PATH_MISSING) + ' ' + esc(PATH_NEW) + '</p>');
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
    h += section('5. Journey', table(['When', 'Stage', 'Note'], d.journey.map((j) => [esc(dateGB(j.at)), esc(j.stage === 'bridge' ? 'Retired' : (j.label || j.stage || '')), esc(j.note || '')])) + '<p class="hint">Stages are worked out from your age, the plan start and the lock — never chosen by hand — and each change is dated here.</p>');
  }
  h += '<p class="hint" style="margin-top:12px;">Illustration, not advice. This document records the plan as it was when it was locked; it does not change when markets or the app move. Compare it with the live Decision tool each month.</p>';
  h += '</div>';
  return h;
}

/** { equity, bond, cash } shares of 1 → '100% shares · 0% bonds · 0% cash'. */
const splitWords = (m) => Math.round((+m.equity || 0) * 100) + '% shares · ' + Math.round((+m.bond || 0) * 100) + '% bonds · ' + Math.round((+m.cash || 0) * 100) + '% cash';
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
    + (isa ? ' The ISA ' + (A.isaFromFunds ? 'follows the ISA funds in your list of funds to test' + (A.isaMix ? ' (' + splitWords(A.isaMix) + ')' : '') : ISA_GROWS[A.isaGrowth] || 'grows at a fixed ' + esc(fmtPct((+A.isaReturn || 0.03) * 100)) + '% a year') + '.' : '')
    + ' Drawn on ' + Math.round(+A.lives || 0).toLocaleString('en-GB') + ' possible futures, one per life (the same lives as the saving-years engine of PensionTools\' questions). In the prices of ' + esc(when || 'the day it was drawn') + ':</p>';
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
 * " Prices are up Z% since April 2026: 4% a year assumed." — the plan's figures are in the prices of that month; the pot as
 * recorded is in the pounds of its own month (6.20.1; said after the pot from 7.12.0). '' when prices have not moved.
 */
const movedPrices = (P) => !!(P && P.prices && P.real != null && Math.abs(P.prices.factor - 1) >= 0.0005);
function pricesText(P) {
  const pr = P.prices;
  if (!movedPrices(P)) return '';
  const a = pctText(pr.assumed || 0.04) + ' a year';
  const basis = !pr.entered ? a + ' assumed' : pr.entered >= pr.years ? 'the CPI entered in the Decision tool' : 'the CPI entered in the Decision tool, ' + a + ' where none was entered';
  return ' Prices are ' + (pr.factor >= 1 ? 'up ' : 'down ') + pctText(Math.abs(pr.factor - 1)) + ' since ' + (pr.since ? whenText(pr.since) : 'the plan began') + ': ' + basis + '.';
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
  'below p10': (P) => '<strong>below the plan\'s 1-in-10 bad line</strong> (' + markFact('pot.planLow', money(P.p10)) + ')',
  'p10–p50': (P) => 'between the 1-in-10 bad line (' + markFact('pot.planLow', money(P.p10)) + ') and the median (' + markFact('pot.planMiddle', money(P.p50)) + ')',
  'p50–p90': (P) => 'between the median (' + markFact('pot.planMiddle', money(P.p50)) + ') and the 1-in-10 good line (' + gbp(P.p90) + ')',
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
  if (missing.includes('pension')) return 'No pension pot on record yet to set against the plan\'s band. Enter this month\'s values in the Decision tool, or record it under What you hold, to compare.';
  if (missing.length) {
    const head = pension ? 'Pension pot ' + markFact('pot.today', money(pension.value)) + ' (' + esc(sourceText(pension)) + '). ' : '';
    if (missing.includes('diversifiers')) return head + 'The plan\'s band counts your diversifiers as well, and the monthly record does not keep their value, so the pot is not set against the band. You can list what you hold, diversifiers included, under What you hold, to compare.';
    const names = missing.filter((k) => ADD_NAME[k]);
    // the ISA alone (7.12.0): the simple view's words, the box it can be typed in and the page it can be added on
    if (names.length === 1 && names[0] === 'isa') return head + 'Your plan counts your ISA too, and we have no figure for it. You can type it in the ISA box when you next record a month, or add it under What you hold.';
    return head + 'The plan\'s band counts ' + names.map((k) => (k === 'isa' ? 'your ISA' : 'your taxable account')).join(' and ') + ' as well, and there is no figure on record for ' + (names.length > 1 ? 'either' : 'it') + ', so the pot is not set against the band. Add ' + names.map((k) => ADD_NAME[k]).join(' and ') + ' under What you hold, to compare.';
  }
  if (P.actual == null || P.p50 == null) return '';
  // the pot sentence both views say (src/reading/where.js potSentence; step F5, D17): the figure the band is in first, at the
  // prices of the month the plan's figures are in, the figure as recorded in brackets with its parts — "Your pot: £670,000 at
  // the prices of April 2026 (£753,659 as recorded)" — and where and when it was recorded after the band, as the simple
  // view's source line says it (R4); how far prices moved, and on what, follows as a sentence of its own.
  const said = potSentence({ pot: P });
  if (!said) return '';
  const pt = 'Your pot: ' + sentenceHtml(said.pot, said.pot.figures, { keys: WHERE_KEYS['where.pot'] }, esc);
  const dated = said.parts ? ' ' + sentenceHtml(said.parts, said.parts.figures, { keys: WHERE_KEYS['where.potParts'] }, esc) : potSourceText(said.source);
  // the full view says more (R8): any other part the band counts (diversifiers, a taxable account), with where and when
  const others = parts.filter((x) => x && x.key !== 'pension' && x.key !== 'isa' && x.value != null)
    .map((x) => ' ' + esc((PART_NAME[x.key] || 'other').replace(/^./, (c) => c.toUpperCase())) + ' ' + gbp(x.value) + (sourceText(x) ? ', ' + esc(sourceText(x)) : '') + '.').join('');
  const mid = markFact('pot.planMiddle', money(P.p50));   // (step F2) the plan's middle by now, marked as the simple view marks it (read.js where.potMid)
  const expects = ' against ' + mid + ' the plan expects by then';
  const verdict = P.verdict || (P.band ? 'band' : null);
  let s;
  if (verdict === 'gilts-held-to-pay') {
    // The band holds the gilts as held to repay (at cost in a document locked before 6.34.0), the record at their market
    // value: no verdict (RUNGS_HELD_TO_PAY).
    // (step F2) a path bought by contract: the simple view says no middle line for it (read.js where.potMid), so the figure
    // here is not the marked fact — joining the two is the ladder's step (F6)
    s = pt + ' against ' + gbp(P.p50) + ' the plan expects by then' + (P.flat ? '; the plan\'s path is bought by contract' : '') + '. The plan counts its gilts ' + (P.atCost ? 'at what they cost' : 'as held until they repay') + ', and your figure is at today\'s market prices, which move with interest rates, so the gap between the two is not read as ahead or behind: the rungs still pay what they were bought to pay.';
  } else if (verdict === 'start') {
    s = P.planYear < 0
      ? pt + ' against ' + mid + ' the plan starts from; the band opens once the plan has started.'
      : pt + ' at the start of the plan, priced on ' + mid + '; the band opens as the year goes on.';
  } else if (verdict === 'not-open') {
    s = pt + expects + '; the plan\'s band has not opened yet.';
  } else if (verdict === 'band' && VERDICT[P.band]) {
    s = pt + ' — ' + VERDICT[P.band](P) + '.';
  } else return '';
  return s + dated + others + pricesText(P) + leftOut + staleText(P.stale);
}
/** Where and when the pot was recorded, in the simple view's source words (PLAN.page.source; lead4.md R4). */
function potSourceText(src) {
  const W = PLAN.page.source;
  const at = src && src.at ? (String(src.at).length > 7 ? dayWords(src.at) : monthYearWords(src.at)) : '';
  const t = src && src.kind === 'hold' ? (at ? fillSlots(W.hold, { date: at }) : W.holdUndated) : (at ? fillSlots(W.record, { date: at }) : W.recordUndated);
  return ' ' + esc(t) + '.';
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
const PATH_MISSING = 'This plan was locked before it had a pension figure to draw a saving path from.';
const PATH_NEW = 'A new version of the plan document adds the path.';
export function saverReadingText(s) {
  if (!s) return '';
  const src = s.recordedAt ? (s.actualSource === 'holdings' ? 'holdings as of ' : 'recorded ') + esc(ukDate(s.recordedAt)) : s.actualSource === 'holdings' ? 'from what you hold' : '';
  const from = src ? ' (' + src + ')' : '';
  // 7.12.0: what happened, the pension today with where it is from, and how the path comes — never "record what you hold"
  // where the pension is from, dated, in the one wording (src/reading/money.js pensionFromWords; lead4.md R4), the month marked
  if (s.pathMissing) return PATH_MISSING + (s.actual != null ? ' Your pension today is ' + markFact('pot.today', money(s.actual)) + ' (' + markWithin(esc(pensionFromWords({ from: s.actualSource, asOf: s.recordedAt })), [[POT_FROM_FIND, 'pot.today.asOf']]) + ').' : '') + ' ' + PATH_NEW;
  const missing = Array.isArray(s.missing) ? s.missing : [];
  if (missing.includes('pension') || (s.actual == null && !missing.length)) return s.expected != null ? 'The locked path expects about ' + gbp(s.expected) + (s.version === 3 ? (s.isaCounted ? ' in your pension and ISA now, in pounds of the day' : ' in the pension pot now, in pounds of the day') : ' in the pension pot now') + '. Record this month\'s pot on the Accumulation planner to compare.' : '';
  if (missing.includes('isa')) return 'Pension pot ' + gbp(s.pension) + from + '. The locked path counts your ISA as well, and there is no ISA figure with it, so the pot is not set against the path. Add your ISA to the monthly record on the Accumulation tab to compare.';
  if (s.version === 3) {
    const what = s.isaCounted ? 'Pension and ISA ' + markFact('pot.againstPlan', money(s.actual)) + ' (' + (src ? src + ': ' : '') + 'pension ' + markFact('pot.today', money(s.pension)) + ', ISA ' + markFact('isa.today', money(s.isa)) + ')' : 'Pension pot ' + markFact('pot.today', money(s.actual)) + from;
    if (s.band === 'start') return what + ', in pounds of the day, against ' + gbp(s.expected) + ' the locked path starts from; its lines open as the months go on.';
    const band = SAVER_V3_BAND[s.band];
    return what + ', in pounds of the day, against ' + gbp(s.expected) + ', the middle of the locked path for then' + (band ? ' — ' + band(s) : '') + '.';
  }
  const pr = s.prices;
  const prices = pr && pr.factor && Math.abs(pr.factor - 1) >= 0.0005 && s.compared != null
    ? ', which is ' + gbp(s.compared) + ' in the prices of ' + esc(monthText(pr.start)) + ', when this path was drawn (prices assumed to rise ' + ((pr.cpi || 0.025) * 100).toFixed(1) + '% a year, as the path does)'
    : '';
  return 'Pension pot ' + markFact('pot.today', money(s.actual)) + from + prices + ', against ' + gbp(s.expected) + ' on the locked path for then — <strong>' + esc(s.band || '') + '</strong>' + (s.low != null && s.high != null ? ' (cautious ' + gbp(s.low) + ', strong ' + gbp(s.high) + ')' : '') + '. This path was drawn before ISAs were counted: it follows your pension only.';
}

/**
 * The strip's income line, like with like (7.12.0): the very sentence the simple view's "Where you are" says
 * (services/YearPlan.js takenSentence) — the months recorded this tax year, what was taken before tax against what each of
 * those months told the person to take, the difference and its cause, and what reached the bank — with the months filled in
 * from the tax year's set-up named after the count. `compare` false: what was taken and no more (a plan whose start is ahead).
 * '' with no tax year to name.
 * @param {{ recorded: number, drawn: number, said?: number, diff?: number, net?: number|null, setUpMonths?: string[], cut?: number, taxYear?: string }} inc
 */
export function incomeThisYearText(inc, { compare = true } = {}) {
  if (!inc || !inc.taxYear) return '';
  const said = takenSentence(inc, { year: inc.taxYear, compare, setUpNote: true });
  // what was taken marked as the simple view marks it (lead4.md G1; the same sentence, the same figure)
  return Array.isArray(said.parts) ? sentenceHtml(said, said.figures, { keys: TAKEN_FACTS }, esc) : esc(sentenceText(said));
}

/**
 * The way of drawing's name as a plan document shows it: the name it was written with — but the one renamed for the screen
 * in 7.3.3 (stressTest.js STRATEGY_NAMES) by its name today, so an older document (its header, its section title, the
 * new-version question and the list of past versions) never shows the old one. Nothing stored changes.
 */
export function strategyNameOf(st) {
  if (!st) return '';
  return st.id === 'bridge-and-engine' ? 'Gilts to State Pension, then shares' : (st.name || st.id || '');
}

/**
 * The "where you are" strip. `opts` (step F2, lead4.md D6, D7): `steps`, the reading's income steps (src/reading/income.js
 * incomeStepsOf: each step a year before tax as it is taken), and `year`, this tax year's lines already drawn
 * (src/ui/thisYearHtml.js: `plan` the year as set up, `changed` the line when the plan's figure differs).
 */
export function whereAmIHtml(w, g = null, { steps = null, year = null } = {}) {
  if (!w) return '';
  const parts = [];
  if (w.saving && w.beforeStart) {
    // Still saving for a plan locked in advance (6.7.0; read like with like from 6.22.0 — saverReadingText)
    const s = w.saving;
    // (7.12.0) the header chip's count, to the month work stops, and both facts: the stop and the plan's first tax year
    const toGo = '<strong>' + markFact('yearsToGo', spanText(s.monthsToGo)) + ' to go</strong>';
    const stop = s.stopMonth ? monthYearWords(s.stopMonth) : '';
    parts.push(stop ? toGo + ': you stop work in ' + markFact('stop.month', esc(stop)) + '; the plan’s first tax year is ' + esc(w.planStart) + '.' : toGo + ' — the plan starts in ' + esc(w.planStart) + '.');
    const text = saverReadingText(s);
    if (text) parts.push(text);
    if (s.contributions > 0 || s.isaMonthly > 0) parts.push('Going in on the locked plan: ' + [s.contributions > 0 ? gbp(s.contributions) + ' a month gross into your pension' : '', s.isaMonthly > 0 ? gbp(s.isaMonthly) + ' a month into ISAs and savings' : ''].filter(Boolean).join(' and ') + '.');
  }
  else if (w.beforeStart) {
    // A plan whose year 0 is later than today: its figures are a later year's, so nothing this year is read against them.
    // Only a plan stored the old way (until 6.51.0 a retired person's plan started at the next April; the caller passes
    // PlanMove.startLaterOf as `w.startLater`) is told how its start changes — from 7.10.0 never moved under the lock: unlock,
    // change it under Timing, lock again; a plan whose year 0 is ahead for its own reasons (the plan that carries a closed
    // one on) is told its first year, no more.
    const later = !!w.startLater;
    // a plan with months recorded began in the tax year they begin (7.4.3): that year, named
    const to = later && w.startLater.recordsFrom && w.startLater.to > 0 ? w.startLater.to + '/' + String(w.startLater.to + 1).slice(2) : null;
    parts.push('<strong>Your plan is set to start in ' + esc(w.planStart) + '.</strong>' + (to ? ' Your recorded months begin in ' + to + '.' : '') + (later ? ' To change its start, unlock the plan, change the start under Timing and lock it again.' : ''));
    const income = w.incomeThisYear && w.incomeThisYear.recorded ? incomeThisYearText(w.incomeThisYear, { compare: false }) : '';
    if (income) parts.push(income);
    return '<div class="alert alert-info pd-where"><div class="section-title" style="font-size:13px;">Where you are — ' + esc(dateGB(w.today)) + '</div><p style="margin:4px 0 0;">' + parts.join(' ') + '</p></div>';
  }
  else {
    // the plan year and the income step: the one sentence builder both views draw (src/reading/where.js; step F5, D17, R8),
    // the step a year before tax as it is taken (step F2, D6), in the plan's own prices
    const py = planYearSentence(w);
    if (py) parts.push('<strong>' + sentenceHtml(py, py.figures, { keys: WHERE_KEYS[py.id] }, esc) + '</strong>');
  }
  const st = stepSentence(w, steps);
  if (st) parts.push(sentenceHtml(st, st.figures, { keys: stepKeysOf(st), finds: STEP_FINDS }, esc));
  if (year && year.plan) parts.push(year.plan);
  const income = incomeThisYearText(w.incomeThisYear);
  if (income) parts.push(income);
  const potText = whereAmIPotText(w.pot);
  if (potText) parts.push(potText);
  // a gilt ladder's month: the one sentence both views say, the month's figure once (step F5, src/reading/where.js)
  const lad = ladderSentence(w, { yearSaid: !!(year && year.plan) });
  if (lad) parts.push(sentenceHtml(lad, lad.figures, { keys: WHERE_KEYS[lad.id] }, esc));
  // the guardrail reading (7.9.0; services/PlanDocument.js guardrailOf, passed in by the page): the words V7 says
  const guard = g && STRESS_ON.guardrail && STRESS.guardrail[g.state] ? '<p class="hint" id="planDocGuardrail" data-guardrail="' + esc(g.state) + '" style="margin:6px 0 0;">' + fillSlotsMarked(STRESS.guardrail[g.state], g.slots, GUARDRAIL_FACTS) + esc(g.cutsOn ? ' ' + STRESS.guardrail.cuts : '') + '</p>' : '';
  return '<div class="alert alert-info pd-where"><div class="section-title" style="font-size:13px;">Where you are — ' + esc(dateGB(w.today)) + '</div><p style="margin:4px 0 0;">' + parts.join(' ') + '</p>' + guard + (year && year.changed ? year.changed : '') + '</div>';
}
/** The same, escaped, with the slots that hold a figure of the fact register marked (lead4.md G1). */
const fillSlotsMarked = (t, slots, marks) => String(t).split(/(\{\w+\})/).map((piece) => {
  const m = /^\{(\w+)\}$/.exec(piece);
  if (!m || !slots || slots[m[1]] == null) return esc(piece);
  return marks[m[1]] ? markFact(marks[m[1]], esc(String(slots[m[1]]))) : esc(String(slots[m[1]]));
}).join('');
/** A sentence of the shared words with its {slots} filled. */
const fillSlots = (t, slots) => String(t).replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
