/**
 * The screens of the one answer (services/OneAnswer.js): the rows the Monte Carlo tab's card adds, the History and
 * Scenarios tabs as explanations of the one test, the Strategies ranking by futures out of 10, the allocation grid,
 * and the locked document's "earlier test" line. HTML strings only; no DOM, no storage, no engine.
 */
import { moneyK, money } from '../reading/format.js';
import { inflationDecadesSvg } from './giltLadderGraphic.js';
import { futuresOutOfTen, pctText, tenthsOutOfTen, CHANCE_BARS, rankWays, oneAnswer, boldConsequenceOf, leftText } from '../services/OneAnswer.js';
import { decadeFigures } from '../services/NamedStarts.js';
import { LEGACY_DEFINITION, planToAgeOfDefinition } from '../services/PlanDocument.js';
import { LIFE_TABLE, HORIZON } from '../services/LongevityModel.js';
import { chanceWords, fixedAgeWords, twentiethsOfFutures } from '../answers/shared/format.js';
import { LEVEL_IDS } from '../answers/shared/shown.js';
import { SUCCESS, planToAgeOf } from '../answers/shared/rules.js';
import { withSavingChance } from '../answers/shared/savingChance.js';
import { markFact, markWithin, tableAttr, cellAttr } from '../reading/mark.js';
import { TABLES } from '../reading/facts.js';
import { wayFactIds, wayVerdictOf, wayFiguresOf } from '../reading/ways.js';
import { LASTS_FINDS } from '../reading/sentenceMarks.js';
import { MIX } from '../v7/copy/mix.js';


const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const n0 = (v) => Math.round(+v || 0).toLocaleString('en-GB');
const pc = (v) => Math.round(+v || 0) + '%';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "Left at the end" — typical, bad case (the worst 1 in 10), good case: to the nearest £1,000, as every place says it (OneAnswer.leftText). */
export function leftRowHtml(a) {
  if (!a) return '';
  return '<tr><td>Left at the end (today\'s money)</td><td>typically <strong>' + markFact('left.typically', leftText(a.typicalLeft)) + '</strong>; in a bad case (the worst 1 in 10) <strong>' + markFact('left.badCase', leftText(a.badCaseLeft)) + '</strong>; in a good case (the best 1 in 10) ' + markFact('left.goodCase', leftText(a.goodCaseLeft)) + '</td></tr>';
}

/** The income cuts: how many futures, by how much, for how long. '' for a strategy that does not cut. */
export function cutsRowHtml(a) {
  if (!a || !a.cuts) return '';
  const c = a.cuts;
  if (!(c.cutN > 0)) return '<tr><td>Income cuts</td><td>never cut: in every one of the ' + n0(c.futures) + ' futures the plan was paid in full</td></tr>';
  // a future that only ran out, with nothing cut before it, is not a cut (with the cuts switched off every one is)
  if (!(c.typicalCutTotal > 0 || c.worstCutTotal > 0)) return '<tr><td>Income cuts</td><td>never cut: the plan is paid in full until the money runs out</td></tr>';
  return '<tr><td>Income cuts</td><td>income was cut in <strong>' + n0(c.cutN) + ' of ' + n0(c.futures) + ' futures</strong>' + (c.ranOutN > 0 ? ' (' + n0(c.ranOutN) + ' of them later ran out)' : '')
    + ': typically <strong>' + gbp(c.typicalCutPerYear) + ' a year less</strong>, for about <strong>' + n0(c.typicalCutYears) + ' year' + (c.typicalCutYears === 1 ? '' : 's') + '</strong> (' + gbp(c.typicalCutTotal) + ' in total; the most in any future ' + gbp(c.worstCutTotal) + '). A cut is a tax year in which more than 1% of the planned income went unpaid and was never caught up.</td></tr>';
}

/** The "without the cuts" twin, as one line of explanation beside the one figure. */
export function withoutCutsLineHtml(a, twin) {
  if (!a || !twin || !twin.ruin) return '';
  const without = Math.round((+twin.ruin.mc || 0) * a.futures / 100), withCuts = Math.round(a.futures * (1 - a.share));
  return '<p class="hint" style="margin:6px 0 0;"><strong>Without the cuts:</strong> the money would run out in ' + n0(without) + ' of ' + n0(a.futures) + ' futures (with them: ' + n0(withCuts) + '). The cuts are what the plan does in a slump instead of running dry; the one figure above counts them as you set them.</p>';
}

/** The locked document's line. */
export function earlierTestNoteHtml(note) {
  return note ? '<div class="alert alert-info" style="font-size:13px;margin:8px 0;">' + esc(note) + '</div>' : '';
}

function startRowHtml(x, { worstKind = false } = {}) {
  const when = (x.month ? MONTHS[x.month - 1] + ' ' : '') + x.year;
  const head = '<td><strong>' + esc(when) + '</strong>' + (x.label ? '<br><span class="hint">' + esc(x.label) + '</span>' : (worstKind ? '<br><span class="hint">an unfair test</span>' : '')) + '</td>';
  if (x.tooShort) return '<tr>' + head + '<td colspan="3" class="hint">Real history since ' + x.year + ' is not long enough yet for a ' + (x.lastStart ? 'plan of this length (a start after ' + x.lastStart + ' would run past the end of the record)' : 'plan of this length') + '. The futures the test stitches from it carry it on.</td></tr>';
  if (x.kind === 'contract') return '<tr>' + head + '<td colspan="3">' + (x.spareGrowth ? 'Every year of income is bought by contract — the start year changes only what the money left over in shares is worth.' : 'Every year is bought by contract — the start year changes nothing but the pounds that arrive (see Scenarios).') + '</td></tr>';
  if (x.kind === 'none') return '<tr>' + head + '<td colspan="3" class="hint">No start-year replay for this strategy yet: its history figure above is the one test\'s.</td></tr>';
  if (x.kind === 'ladder') return '<tr>' + head + '<td>' + (x.failed ? 'the sleeve ran out' + (x.failAge ? ' at ' + Math.round(x.failAge) : '') + ' after the ladder' : 'ladder paid by contract; the ratchet secured ' + n0(x.secured) + ' more year' + (x.secured === 1 ? '' : 's')) + '</td><td>—</td><td>' + gbp(x.terminal) + '</td></tr>';
  if (x.kind === 'rotation') return '<tr>' + head + '<td>' + (x.firedAge != null ? 'the market fell 30% below its high at ' + Math.round(x.firedAge) + ': the long rungs were sold for shares' : 'the market never fell 30% below its high in time: the whole ladder paid by contract') + (x.failed ? '; <strong>the later years ran short from ' + Math.round(x.failAge || 0) + '</strong>' : '; paid in full') + '</td><td>' + gbp(x.worst12) + '</td><td>' + gbp(x.terminal) + '</td></tr>';
  if (x.kind === 'flex') return '<tr>' + head + '<td>floor paid by contract; the leanest treat-year was ' + gbp(x.worstYearFlex) + '</td><td>—</td><td>' + gbp(x.terminal) + '</td></tr>';
  const what = x.failed ? '<strong>ran out at ' + Math.round(x.failAge || 0) + '</strong>'
    : (x.cutYears > 0 ? 'lasted; income cut in ' + n0(x.cutYears) + ' year' + (x.cutYears === 1 ? '' : 's') + ' (' + gbp(x.cutReal) + ' in total)' : 'lasted, never cut')
      + (x.protMonths > 0 ? '; ' + n0(x.protMonths) + ' months with the draw trimmed' : '');
  return '<tr>' + head + '<td>' + what + '</td><td>' + gbp(x.worst12) + '</td><td>' + gbp(x.terminal) + '</td></tr>';
}

const startTable = (rows, opts) => '<div class="table-scroll-container"><table><thead><tr><th>Retiring into</th><th>What happened to this plan</th><th>Lowest 12 months of income</th><th>Left at the end</th></tr></thead><tbody>' + rows.map((x) => startRowHtml(x, opts)).join('') + '</tbody></table></div>';

/**
 * History: "what if you had retired into a bad start year?" — the one test's own real histories.
 * @param {{ strategyId, name, a (oneAnswer), rows (NamedStarts.namedStartRows), worst (OneAnswer.worstStarts) }} o
 */
export function historyTabHtml({ strategyId, name, a, rows = [], worst = [] }) {
  let h = '<div class="card"><h2>What if you had retired into a bad year?</h2>';
  if (!a) return h + '<div class="alert alert-warning">The strategy is not affordable on this plan, so there is no history to explain. Fix the plan in Settings first.</div></div>';
  const contract = rows.length && rows.every((x) => x.kind === 'contract');
  h += '<p>The one test ran <strong>' + esc(name) + '</strong> on your plan through <strong>every real ' + a.years + '-year stretch of markets since 1871</strong> — ' + n0(a.histories) + ' start' + (a.histories === 1 ? '' : 's') + (a.histories > 1 ? (a.histStrideMonths > 1 ? ', ' + (a.histStrideMonths === 2 ? 'two' : a.histStrideMonths) + ' months apart' : ', a month apart') : '') + (contract ? '. Every year of this plan is bought by contract, so no start year can run it out.' : (a.failKind === 'lean' ? ', and <strong>' + n0(a.histRanOutN) + '</strong> of them had a lean year (' : a.failKind === 'cut' ? ', and the plan was cut in <strong>' + n0(a.histRanOutN) + '</strong> of them (' : ', and the money ran out in <strong>' + n0(a.histRanOutN) + '</strong> of them (') + pctText(a.histRanOutPct) + ').') + ' These are the same histories the test\'s 1,000 futures are stitched from; the figure that matters — <strong>' + pctText(a.chancePct, 0, CHANCE_BARS) + '</strong>, lasts ' + esc(a.outOfTen.words) + ' — is on the first tab, and this page only shows where it comes from.</p>';
  if (worst.length) {
    h += '<div class="section-title" style="margin-top:12px;">The hardest starts in the record — an unfair test</div>'
      + '<p class="hint" style="margin:0 0 6px;">Nobody retires into the worst month of 150 years on purpose, and the test counts every one of them all the same. Read these as the edge of what has ever happened, not as a forecast.</p>'
      + startTable(worst, { worstKind: true });
  }
  if (rows.length) {
    h += '<div class="section-title" style="margin-top:12px;">Named starts</div>'
      + '<p class="hint" style="margin:0 0 6px;">The famous bad years, each replayed from its January with your own plan, its own cuts setting and its full length. Today\'s money throughout.</p>'
      + startTable(rows);
  }
  h += '<p class="hint" style="margin-top:8px;">Shares follow world equity (US history less 1.5% a year); each start carries its own inflation; bonds, cash and the diversifiers are modelled from those two. Not a forecast, not advice.</p></div>';
  return h;
}

function decadeWords(sc) {
  const { first, decade: eq, prices: cpi } = decadeFigures(sc);   // NamedStarts, the figures lifted (6.45.0): the preview says the same
  const dir = (v) => (v < 0 ? 'down ' + pc(-v * 100) : 'up ' + pc(v * 100));
  return 'shares ' + dir(first) + ' in the first three years and ' + dir(eq) + ' over the decade; prices ' + dir(cpi) + ' over the decade';
}

/**
 * Scenarios: the named stresses, explained — what the decade did, and what the one test's real history from that
 * start did to this plan. The full gilt ladder keeps its inflation table (the only thing a scenario changes for it).
 */
export function scenariosTabHtml({ strategyId, name, a, r, p, rows = [], scenarios = {}, startYears = {}, worst = [], rowsShown = false }) {
  let h = '<div class="card"><h2>Scenarios — the named stresses</h2>';
  if (!a) return h + '<div class="alert alert-warning">The strategy is not affordable on this plan, so there is nothing to run the scenarios through. Fix the plan in Settings first.</div></div>';
  if (strategyId === 'full-il-gilt' && r && r.plan && r.plan.years && r.plan.years.length) {
    // under "Try the bad years" (its rows above), the decades' table is a fold to open, as for every other way (step F3)
    if (rowsShown) return h + '<details class="named-stresses"><summary>The named decades: what each would do to the cash the rungs pay</summary>' + scenariosTabHtml({ strategyId, name, a, r, p, rows, scenarios, startYears, worst, rowsShown: false }).replace(/^<div class="card"><h2>[^<]*<\/h2>/, '').replace(/<\/div>$/, '') + '</details></div>';
    const plan = r.plan, n = plan.years.length;
    const cpiPath = (sc) => { const out = [1]; let c = 1; for (let i = 1; i < n; i++) { c *= 1 + (sc.inflation[i - 1] ?? 0.025); out.push(c); } return out; };
    h += '<div class="alert alert-info"><strong>Every year of this plan is bought today, index-linked.</strong> Equity crashes, lost decades and 2008 do nothing to its income — the only thing a scenario changes is the number of <em>pounds</em> that arrive, and they always buy the same.' + (r.signature && r.signature.spareGrowth ? ' The money left over is in shares (your setting): a crash does cut what you would have left, never the income.' : '') + ' So the honest scenario test is inflation: here is what each famous decade would do to the cash arriving, against the plan in today\'s money.</div>';
    h += '<div class="table-wrap"><table><thead><tr><th>Scenario</th><th>Prices after 10 years</th><th>Year-1 cash</th><th>Year-10 cash</th><th>Real income</th><th>What it means</th></tr></thead><tbody>';
    const paths = {};
    for (const [k, sc] of Object.entries(scenarios)) {
      const cp = cpiPath(sc); paths[sc.name] = cp;
      const y1 = plan.years[0].gross, y10 = plan.years[Math.min(9, n - 1)].gross;
      h += '<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + esc(sc.color) + ';margin-right:6px;"></span>' + esc(sc.name) + (startYears[k] ? ' <span class="hint">(from ' + startYears[k] + ')</span>' : '') + '</td>'
        + '<td>' + (cp[Math.min(10, n - 1)] >= 1 ? '+' : '') + ((cp[Math.min(10, n - 1)] - 1) * 100).toFixed(0) + '%</td>'
        + '<td>' + gbp(y1 * cp[0]) + '</td><td>' + gbp(y10 * cp[Math.min(9, n - 1)]) + '</td>'
        + '<td>' + gbp(y10) + ' (unchanged)</td><td style="color:var(--success);">Paid in full — indexed by contract</td></tr>';
    }
    h += '</tbody></table></div>';
    h += '<div class="section-title" style="margin-top:14px;">Pounds arriving each year under each scenario</div><p class="hint" style="margin:0 0 6px;">Dashed = your plan in today\'s money. Each solid line is the cash the rungs would actually pay under that decade\'s inflation, then 2.5% a year. Higher lines are not more money — they buy exactly the same.</p><div class="machine-scroll">' + inflationDecadesSvg({ years: plan.years, cpiPaths: paths }) + '</div>';
    h += '<p class="hint" style="margin-top:10px;">What no scenario here tests: your own inflation running above the official index (care, energy, services), the RPI→CPIH change in February 2030, frozen tax thresholds, and the DMO\'s 3-month indexation lag in a fast-moving year. The Great Depression row is a real deflation — UK linkers have no floor, so the pounds fall with prices; they still buy the plan.</p>';
    return h + '</div>';
  }
  // with "Try the bad years" above (7.9.0), the plan's own figure is the As planned line there: no second figure here. The
  // lines above are futures only, so the real starts are named as a set of their own (the words of "Does it last?")
  h += rowsShown
    ? '<p data-stress-hint="1">The lines above make one thing worse on purpose. Each named stress below is a real decade: the real history from its first year is one of the ' + n0(a.histories) + ' real starts since 1871 that the one test counts beside its futures. Here is what the decade did, and what retiring into it would have done to <strong>' + markFact('way.name', esc(name)) + '</strong> on your plan — its own cuts setting, its full length, today\'s money.</p>'
    : '<p>Each named stress is a real decade. The one test already contains it: the real history that starts at that decade\'s first year is one of the ' + n0(a.histories) + ' starts behind your figure of <strong>' + pctText(a.chancePct, 0, CHANCE_BARS) + '</strong> (lasts ' + esc(a.outOfTen.words) + '). Here is what the decade did, and what retiring into it would have done to <strong>' + esc(name) + '</strong> on your plan — its own cuts setting, its full length, today\'s money.</p>';
  // under "Try the bad years" (its rows above), the decades one by one are a fold to open: the simple view says them under its
  // history (step F3)
  h += (rowsShown ? '<details class="named-stresses"><summary>The named decades, one at a time</summary>' : '') + '<div class="table-scroll-container"><table><thead><tr><th>Named stress</th><th>What the decade did</th><th>Retiring into it: what happened to this plan</th><th>Lowest 12 months</th><th>Left at the end</th></tr></thead><tbody>';
  for (const [k, sc] of Object.entries(scenarios)) {
    const y = startYears[k];
    const sw = '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + esc(sc.color) + ';margin-right:6px;"></span>';
    if (!y) {
      const hard = worst && worst[0];
      h += '<tr><td>' + sw + esc(sc.name) + '</td><td>' + esc(decadeWords(sc)) + '</td><td colspan="3" class="hint">A made-up decade: no real start year is this bad, so it is not in the test. The hardest real start in the record' + (hard ? ' is ' + (hard.month ? MONTHS[hard.month - 1] + ' ' : '') + hard.year + ' (History tab)' : ' is on the History tab') + '.</td></tr>';
      continue;
    }
    const x = rows.find((row) => row.year === y);
    const cells = x ? startRowHtml(x).replace(/^<tr>/, '').replace(/<\/tr>$/, '').replace(/^<td>.*?<\/td>/, '') : '<td colspan="3" class="hint">not run</td>';
    h += '<tr><td>' + sw + esc(sc.name) + '<br><span class="hint">from January ' + y + '</span></td><td>' + esc(decadeWords(sc)) + '</td>' + cells + '</tr>';
  }
  h += '</tbody></table></div>' + (rowsShown ? '</details>' : '');
  h += rowsShown
    ? '</div>'
    : '<p class="hint" style="margin-top:8px;">Until 6.24 this tab ran each decade over and over for the whole plan and marked the plan as failed — a test nothing real has ever set. The one test counts every real start once; the named decades are explained here, not re-run.</p></div>';
  return h;
}

/**
 * The Strategies ranking card: by how many futures out of 10 each strategy lasts, in plain words; the score
 * (Estrada's volatility-adjusted coverage ratio) kept under "More columns".
 * @param {{ scored: Array<{id, r, sc}>, names, colors, rankBy: 'lasts'|'left'|'score'|'coverage', more: boolean, volFloorPct, unaffordable: Array<{id,name,reason}>, cutsWords }} o
 */
export function rankingCardHtml({ scored, names, colors, rankBy = 'lasts', more = false, volFloorPct = 3, unaffordable = [], cutsWords = '', own = null }) {
  // a locked plan's own strategy (7.12.0 round 3, walker 7: a locked ladder ranked 4th under "Pots & Valves comes first on your
  // plan"): it heads the card as the person's plan; the others are for comparison only, never ranked against it
  const ranked = rankWays(scored, rankBy);   // the share and the order (OneAnswer.rankWays, 6.40.0): one ranking for the planner and V7
  const rows = own && ranked.some((x) => x.id === own) ? [...ranked.filter((x) => x.id === own), ...ranked.filter((x) => x.id !== own)] : ranked;
  const mine = own && rows.length && rows[0].id === own;
  for (const x of rows) { x.lasts = wayVerdictOf(x.share); }   // the one reading of a way's verdict (src/reading/ways.js), the simple view's cards' too
  const btn = (k, label) => '<button type="button" class="risk-btn' + (rankBy === k ? ' active' : '') + '" style="padding:3px 10px;font-size:12px;" data-on-click="setCmpRank(\'' + k + '\')">' + label + '</button>';
  let h = (mine ? '<div class="card"><h2>Your plan: ' + esc(names[own] || own) + '</h2><p class="hint" style="margin:0 0 8px;" id="rankOwnPlan">This is the strategy your plan is locked on. The others ran the same test on your figures, for comparison only; they are not ranked against your plan.</p>' : '<div class="card"><h2>Which strategy? — ranked on your plan</h2>')
    + '<p class="hint" style="margin:0 0 8px;">All ' + (scored.length + unaffordable.length) + ' ran <strong>your</strong> plan (pot, ISA policy, income shape, State Pension, full length) through the <strong>same one test</strong> — every real stretch of markets since 1871 and 1,000 possible futures' + (cutsWords ? ', ' + esc(cutsWords) : '') + '. The first column is the one figure every screen shows for your own strategy. What each one costs you to live with — a cut, a cliff, a bumpy pot — is yours to weigh; the columns beside it are the trade-offs.</p>'
    + '<div class="row-flex" style="margin:0 0 8px;align-items:center;"><span class="hint">Rank by:</span>' + btn('lasts', 'How many futures it lasts') + btn('left', 'What is typically left') + (more ? btn('score', 'Score') + btn('coverage', 'Coverage ratio') : '')
    + '<button type="button" class="risk-btn" style="padding:3px 10px;font-size:12px;margin-left:auto;" data-on-click="setCmpMore(' + (more ? 'false' : 'true') + ')">' + (more ? 'Fewer columns' : 'More columns') + '</button></div>'
    + '<div class="table-scroll-container"><table><thead><tr><th>#</th><th>Strategy</th><th>Lasts</th><th>Worst 12 months</th><th>Typically left</th><th>Bad case (the worst 1 in 10)</th>'
    + (more ? '<th title="Share of the plan\'s years the money paid for, averaged over all futures">Years covered</th><th title="Years sustained plus the years the money left over would have funded, over the plan length — above 1 a bequest, below 1 it ran out">Coverage ratio</th><th title="Median across futures of everything the strategy paid out over the plan, today\'s money">Spent over the plan</th><th title="Year-on-year volatility of total wealth along the way">Bumpiness</th><th title="Coverage ratio divided by bumpiness, averaged over futures">Score</th>' : '')
    + '</tr></thead><tbody>';
  rows.forEach((x, i) => {
    const r = x.r;
    h += '<tr' + (i === 0 ? ' style="font-weight:600;"' : '') + '><td>' + (mine ? (i === 0 ? '' : '—') : (i + 1)) + '</td><td><span style="display:inline-block;width:10px;height:10px;background:' + esc(colors[x.id] || '#888') + ';border-radius:2px;margin-right:6px;"></span>' + markFact(wayFactIds(x.id).name, esc(names[x.id] || x.id)) + (mine && i === 0 ? ' <span class="hint">(your plan)</span>' : '') + ' <button type="button" class="risk-btn" style="padding:1px 7px;font-size:11px;" data-on-click="showStrategyPage(\'' + esc(x.id) + '\')">read →</button></td>'
      + '<td>lasts ' + markFact(wayFactIds(x.id).verdict, esc(x.lasts)) + ' <span class="hint">(' + pctText(x.share * 100, 0, CHANCE_BARS) + (r.strategyId === 'floor-and-flex' ? ', no lean year' : r.ruinLabel ? ', else cut' : '') + ')</span></td>'
      + (() => { const f = wayFiguresOf(r), m = wayFactIds(x.id); return '<td>' + (f.worst12 == null ? '—' : markFact(m.worst12, f.worst12)) + '</td><td>' + markFact(m.left, f.left) + '</td><td>' + markFact(m.badLeft, f.badLeft) + '</td>'; })()   // the one reading of a way's figures (src/reading/ways.js), the simple view's cards' too
      + (more ? (() => { const f = wayFiguresOf(r), m = wayFactIds(x.id); return '<td>' + (f.covered != null ? markFact(m.covered, f.covered) : '—') + '</td><td>' + (x.sc ? x.sc.coverageRatio.toFixed(2) : '—') + '</td><td>' + (f.spent != null ? markFact(m.spent, f.spent) : '—') + '</td>'; })() + '<td>' + (wayFiguresOf(r, x.sc).bumpiness != null ? markFact(wayFactIds(x.id).bumpiness, wayFiguresOf(r, x.sc).bumpiness) + '/yr' : '—') + '</td><td><strong>' + (x.sc ? x.sc.vac.toFixed(1) : '—') + '</strong></td>' : '')
      + '</tr>';
  });
  h += '</tbody></table></div>';
  if (unaffordable.length) h += '<p class="hint" style="margin-top:6px;">Not affordable on this plan, so not ranked: ' + unaffordable.map((u) => esc(u.name) + ' (' + esc(u.reason || '') + ')').join('; ') + '.</p>';
  const best = rows[0];
  const bf = best ? wayFiguresOf(best.r) : null, bm = best ? wayFactIds(best.id) : null;
  if (best && !mine) h += '<div class="alert alert-info" style="margin-top:10px;"><strong>' + markFact(bm.name, esc(names[best.id] || best.id)) + ' comes first on your plan</strong> — it lasts ' + markFact(bm.verdict, esc(best.lasts)) + ' (' + pctText(best.share * 100, 0, CHANCE_BARS) + '), typically leaving ' + markFact(bm.left, bf.left) + '; in a bad case (the worst 1 in 10) ' + markFact(bm.badLeft, bf.badLeft) + '. Read its page, then the runner-up\'s: the right choice depends on what you would rather live with — a cut, a cliff, or a bumpy pot — and that is yours to weigh. <button type="button" class="risk-btn" style="padding:2px 8px;" data-on-click="showStrategyPage(\'' + esc(best.id) + '\')">Read ' + esc(names[best.id] || best.id) + ' →</button></div>';
  h += '<p class="hint" style="margin-top:8px;">Lasts = the share of the 1,000 futures in which the plan was paid in full to the end (for Floor &amp; Flex: no lean year; for Floor to an age and the rotation: never cut). Worst 12 months = the lowest income lived in any real history. Typically left and the bad case = what is left at the end in the middle future and in the worst 1 in 10 — never the single worst of 1,000.'
    + (more ? ' Years covered = share of the plan\'s years the money paid for, averaged over futures. Coverage ratio = years sustained plus the years the money left over would have funded, over the plan length (Estrada &amp; Kritzman, <em>Toward Determining the Optimal Investment Strategy for Retirement</em>, J. Retirement 2019). Bumpiness = year-on-year volatility of total wealth along the way, floored at ' + Math.round(volFloorPct) + '% so a fully bought plan scores finite. Score = the volatility-adjusted coverage ratio (Estrada, <em>Retirement Planning: The Volatility-Adjusted Coverage Ratio</em>, J. Retirement 2024): coverage divided by bumpiness — it rewards lasting longer and leaving more and penalises a bumpy ride; one honest yardstick, not the only one.' : '')
    + ' A what-if with the cuts switched off is one click away in Try a strategy.</p></div>';
  return h;
}

/**
 * Compare allocations (Pots & Valves): the three risk levels with and without the bond tent, each run through the one
 * test. grid[key].flat / .tent = a stressTestStrategy result (or { affordable: false }).
 */
/**
 * "Compare allocations" (the simple view's "Which mix lasts best?"): the eight cells of answers/plan/mixRun.js runMixCompare —
 * the plan's own mix and the three levels, tent off and on — in the words answers/plan/mix.js mixCompareView gives them, the
 * simple view's words for each cell (lead4.md R6, R7). `view` is mixCompareView's.
 */
/** What the page says while the eight cells run (the simple view's words). */
export const MIX_COMPARE_WORKING = MIX.compare.working;

export function mixGridHtml(view) {
  const C = MIX.compare;
  const fill = (t, slots) => String(t).replace(/\{(\w+)\}/g, (m, k) => (slots[k] != null ? String(slots[k]) : m));
  const cellOf = (key, tent) => (view.cells || []).find((c) => c.key === key && c.tent === tent) || null;
  // each cell marked as the simple view's grid marks it (lead4.md G1; step F3): its words and the line under them
  const td = (c, key, tent) => {
    if (!c || !c.affordable) return '<td style="text-align:center;padding:10px;border:1px solid var(--border);" class="hint">' + esc(C.cannot) + '</td>';
    const col = tent ? 'tent' : 'flat';
    return '<td style="text-align:center;padding:10px;border:1px solid var(--border);' + (c.best ? 'background:rgba(16,185,129,0.12);' : '') + '"><div style="font-size:20px;font-weight:700;color:var(--' + (c.best ? 'success' : 'text') + ');"' + cellAttr(key, col) + '>' + esc(fill(C.cell, { words: c.words })) + '</div><div style="font-size:11px;color:var(--text-muted);"' + cellAttr(key, col + '.sub') + '>' + esc(fill(C.cellSub, c)) + '</div>' + (c.current ? '<div class="hint" style="font-size:11px;">' + esc(C.thisIs) + '</div>' : '') + '</td>';
  };
  let h = '<h3 style="margin-bottom:6px;">Compare allocations</h3>';
  h += '<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">' + esc(MIX.notes.compare) + '</p>';
  h += '<table' + tableAttr(TABLES.MIX) + ' style="border-collapse:collapse;width:100%;max-width:640px;"><thead><tr><th style="text-align:left;padding:8px;">' + esc(C.columns.mix) + '</th><th style="padding:8px;">' + esc(C.columns.flat) + '</th><th style="padding:8px;">' + esc(C.columns.tent) + '</th></tr></thead><tbody>';
  for (const key of ['own', 'cautious', 'balanced', 'adventurous']) {
    const any = cellOf(key, false) || cellOf(key, true);
    if (!any) continue;
    h += '<tr><td style="padding:8px;border:1px solid var(--border);"><strong>' + esc(C.rows[key]) + '</strong><br><span style="font-size:11px;color:var(--text-muted);"' + cellAttr(key, 'amounts') + '>' + esc(fill(C.cellAmounts, any.amounts)) + '</span></td>' + td(cellOf(key, false), key, false) + td(cellOf(key, true), key, true) + '</tr>';
  }
  h += '</tbody></table>';
  if (view.best) h += '<p style="margin-top:12px;font-size:13px;"><strong>' + esc(fill(C.best, { row: C.rows[view.best.key], tent: view.best.tent ? MIX.tentOnOff.on : MIX.tentOnOff.off, words: view.best.words, pct: '\u0000' })).replace('\u0000', markFact('mix.best', esc(view.best.pct))) + '</strong> Set it in Settings if you would like it.</p>';
  return h;
}

// ---- 7.8.0: the verdict block (research/v7/replan-nov-2026.md 5; the build spec's sections 6 and 8) -------------------------

/** The classic page's own pounds (index.html gbp: the browser's own grouping), so the block before 7.8.0 is byte-identical. */
const gbpC = (n) => '£' + Math.round(+n || 0).toLocaleString();
const LEVEL_NAMES = { careful: 'Careful', balanced: 'Balanced', bold: 'Bold' };
/** The level control's choices, each led by its count ("Balanced" is also a word for a mix: never said twice in one list). */
const LEVEL_OPTIONS = { careful: '19 times in 20: Careful', balanced: '18 times in 20: Balanced (we start here)', bold: '14 times in 20: Bold' };
const LASTS_AS_LONG = { 'ran-out': 'the money lasts as long as you do', cut: 'your income is paid in full as long as you live', lean: 'you have no lean year while you are alive' };
const kindOf = (r) => (!r.ruinLabel ? 'ran-out' : r.strategyId === 'floor-and-flex' ? 'lean' : 'cut');

/**
 * The verdict block every strategy card and page opens with, before 7.8.0 and while the figures are not weighted (the
 * rollback): the chance the money lasts the whole plan, the share of the years paid, the worst 12 months. An old document
 * (LEGACY_DEFINITION) reads exactly this, word for word and tone for tone.
 */
export function legacyVerdictBlockHtml(r, p) {
  if (!r || !r.affordable) return '';
  const sr = 100 - (r.ruin.mc || 0);
  const cov = r.coverage != null ? r.coverage : (r.failAges && r.failAges.length === 0 ? 100 : sr);
  const cut = !!r.ruinLabel;
  const flex = r.strategyId === 'floor-and-flex';
  const v = sr >= 90 ? { t: flex ? 'Bills always paid; treats rarely fall short' : cut ? 'Very likely to pay the plan in full' : 'Very likely to last', c: 'success' }
    : sr >= 75 ? { t: flex ? 'Bills always paid; some lean years for the treats' : cut ? 'Likely to pay the plan in full — with some risk of a cut' : 'Likely to last — with some risk', c: 'success' }
    : sr >= 50 ? { t: flex ? 'Bills always paid; lean years are a real possibility' : cut ? 'A real chance of a cut' : 'At real risk of running out', c: 'warning' }
    : { t: flex ? 'Bills always paid; expect lean years for the treats' : cut ? 'A cut is more likely than not' : 'Unlikely to last as planned', c: flex ? 'warning' : 'danger' };
  const basis = r.n.mc.toLocaleString() + ' simulated futures and ' + r.n.hist + ' real ' + p.durationYears + '-year histories since 1871';
  return '<div class="verdict verdict-' + v.c + '"><div class="verdict-title">' + (cut ? 'Will you get what you planned? — ' : 'Will your money last? — ') + v.t + '</div>'
    + '<div class="verdict-heroes"><div><span class="hero">' + pctText(sr, 0, CHANCE_BARS) + '</span><span class="hero-sub">' + (flex ? 'chance of no lean year (never more than 10% under the plan; the bills can\'t fail)' : cut ? 'chance the plan is paid in full, with no year cut' : 'chance your money lasts the whole plan') + ' — ' + (flex ? 'no lean year ' : cut ? 'paid in full ' : 'lasts ') + futuresOutOfTen(sr / 100).words + '</span></div>'
    + '<div><span class="hero" style="font-size:30px;">' + pctText(cov) + '</span><span class="hero-sub">of the plan\'s years covered — the share of your planned income the money actually paid, averaged over every future</span></div>'
    + '<div><span class="hero" style="font-size:30px;">' + gbpC(Math.round(r.worst12.min)) + '</span><span class="hero-sub">worst 12 months lived, today\'s money</span></div></div>'
    + '<div class="verdict-basis">Based on ' + basis + ' (' + pctText((r.ruin.hist || 0)) + ' of the histories ' + (cut ? 'were cut' : 'ran out') + '). Today\'s money. The one test: the same figure on every screen of this plan.</div></div>';
}

/** The verdict word of a block: a document's at its own stored lines; a live block's at the level; null for the block before 7.8.0. */
export function chanceVerdictOf(r, p, o = {}) {
  if (!r || !r.affordable) return null;
  const def = o.definition;
  if (def && def !== LEGACY_DEFINITION && def.weighted && typeof def.weighted === 'object') {
    const lines = def.lines || {};
    const c = typeof def.weighted.chance === 'number' ? def.weighted.chance : def.weighted.fixedAge;
    if (typeof c !== 'number') return null;
    return c >= lines.yes - 1e-12 ? 'yes' : c >= lines.close - 1e-12 ? 'close' : 'no';
  }
  if (def || !o.life) return null;
  const a = liveAnswerOf(r, p, o);
  return a ? a.verdict : null;
}

/** A live block's answer: the run weighed, and (7.12.0) a plan still saving read on its saving chance (o.savingChance). */
function liveAnswerOf(r, p, o) {
  const a = oneAnswer(r, p, o);
  return o && typeof o.savingChance === 'number' ? withSavingChance(a, o.savingChance) : a;
}

/**
 * The tone of a strategy card's opening line (index.html strategyResultCard): from the verdict word (on course, close, not on
 * course) when the block has one; the block before 7.8.0 keeps its own (the share that ran out: 5% and 15%).
 */
export function cardToneOf(r, p, o = {}) {
  const v = chanceVerdictOf(r, p, o);
  if (!v) { const m = r.ruin.mc; return m <= 5 ? 'alert-success' : m <= 15 ? 'alert-warning' : 'alert-danger'; }
  return v === 'yes' ? 'alert-success' : v === 'close' ? 'alert-warning' : 'alert-danger';
}

/** The options a card's block reads: a document's definition, else the one test's weighted run when the card is that result. */
export function chanceOptsOf(r, opts = {}, oneTest = null) {
  if (opts && opts.definition) return { definition: opts.definition };
  if (!oneTest || !oneTest.chance || !r) return {};
  // the plan's own way (its card, or its strategy page's run of the same plan, figure for figure): the one test's own reading
  if (oneTest.r === r || sameRun(oneTest.r, r)) return oneTest.chance;
  // (7.12.0) another way on the same plan: the same person and level, so its block speaks the same verdict words in the
  // same colours as the plan's own (never the block before 7.8.0's green "Likely to last" beside a red "Not on course")
  return oneTest.chance.life ? { life: oneTest.chance.life, level: oneTest.chance.level } : {};
}

/** Two runs of the same plan the same way (the Strategies tab runs the plan's own way again, seed for seed): the same figures. */
const sameRun = (a, b) => !!a && !!b && a.strategyId === b.strategyId && !!a.ruin && !!b.ruin && a.ruin.mc === b.ruin.mc && a.ruin.hist === b.ruin.hist
  && !!a.n && !!b.n && a.n.mc === b.n.mc && !!a.terminal && !!b.terminal && a.terminal.p50 === b.terminal.p50;

/** The fixed-age line under a card's opening (a count, always with its age): "If you live to 97, the money lasts that long in …". */
export function countAgeHtml(r, p) {
  if (!r || !r.affordable || !r.ruin || !p) return '';
  // (the age the plan runs to, as both apps say it: "to 97" = to the 97th birthday — rules.js planToAgeOf, OneAnswer's planToAge)
  const age = planToAgeOf(+p.startAge || 0, +p.durationYears || 0);
  return ' <span class="hint" data-fixed="1">' + esc(fixedAgeWords(Math.max(0, Math.min(1, 1 - (+r.ruin.mc || 0) / 100)), age, { kind: kindOf(r) })) + '</span>';
}

const levelSelectHtml = (level) => '<label class="verdict-level">How careful? <select data-on-change="setChanceLevel(this.value)" data-testid="verdict.level" aria-label="How careful?">'
  + LEVEL_IDS.map((k) => '<option value="' + k + '"' + (k === level ? ' selected' : '') + '>' + esc(LEVEL_OPTIONS[k]) + '</option>').join('') + '</select></label>';
const VERDICT_TITLE = { yes: 'On course', close: 'Close', no: 'Not on course' };
/** The words after the years covered and the worst 12 months (both views: the simple view's band rows say them after the figure). */
export const COVER_WORDS = 'of the plan\'s years covered — the share of your planned income the money actually paid, averaged over every future';
export const WORST12_WORDS = 'the worst year of income lived, at today\'s prices';

/**
 * The verdict block (7.8.0), both apps' words (services/OneAnswer.js weightedWordsOf):
 *   { definition: LEGACY_DEFINITION }   an old document: the block before 7.8.0, byte for byte
 *   { definition: success }             a document locked with the weighted definition: its own figures and lines
 *   { life, level, rW, … }              a live plan, weighing (lastsRun.js chanceRunOf): the chance the money lasts as long as
 *                                       you do at the level, the fixed-age line with its age beside it, the floor, what is left,
 *                                       what we assumed, and the session's level control (window.setChanceLevel)
 *   {}                                  not weighing (the rollback): the block before 7.8.0
 */
export function verdictBlockView(r, p, o = {}) {
  if (!r || !r.affordable) return '';
  const def = o && o.definition;
  if (def && def !== LEGACY_DEFINITION && def.weighted && typeof def.weighted === 'object') return documentBlockHtml(r, p, def);
  if (def || !o || !o.life) return legacyVerdictBlockHtml(r, p);
  const a = liveAnswerOf(r, p, o);
  if (!a || !a.words) return legacyVerdictBlockHtml(r, p);
  const saving = a.chanceFrom === 'saving';
  const w = a.words;
  const tone = a.verdict === 'yes' ? 'success' : a.verdict === 'close' ? 'warning' : 'danger';
  const name = LEVEL_NAMES[a.level];
  const bold = a.level === 'bold' ? ' ' + boldConsequenceOf(a) : '';
  const hero = a.weighted !== null
    ? '<div data-weighted="' + a.weighted + '"' + (saving ? ' data-chance-from="saving"' : '') + '><span class="hero" style="font-size:30px;">' + markFact('lasts.chance', esc(chanceWords(a.weighted, typeof a.sumW === 'number' ? { sumW: a.sumW, n: a.n } : {}))) + '</span><span class="hero-sub">' + esc(w.headline) + esc(bold) + '</span></div>'
    : '<div><span class="hero" style="font-size:30px;">' + markFact('lasts.fixedChance', esc(twentiethsOfFutures(a.fixedAge))) + '</span><span class="hero-sub">' + markWithin(esc(w.fixed), LASTS_FINDS.fixed) + esc(bold) + '</span></div>';
  const cov = r.coverage != null ? r.coverage : (r.failAges && r.failAges.length === 0 ? 100 : 100 - (r.ruin.mc || 0));
  // ("How careful?" straight under the title, beside the figure it changes)
  return '<div class="verdict verdict-' + tone + '" data-chance-block="1" data-level="' + a.level + '"><div class="verdict-title">' + (r.ruinLabel ? 'Will you get what you planned? — ' : 'Will your money last? — ') + markFact('lasts.verdict', VERDICT_TITLE[a.verdict]) + ' at ' + markFact('lasts.level', name) + '</div>'
    + levelSelectHtml(a.level)
    // (7.12.0) a plan still saving: the one chance (What you pay in's, the home's, Accumulation's) leads alone; every figure
    // under it is this run's, from the middling pot when work stops, and is said to be
    + '<div class="verdict-heroes">' + hero
    // (the years covered and the worst 12 months: the simple view's band says both, in the same words: lead4.md R8, step F3)
    + (saving ? '' : '<div><span class="hero" style="font-size:30px;">' + markFact('lasts.coverage', pctText(cov)) + '</span><span class="hero-sub">' + COVER_WORDS + '</span></div>'
    + '<div><span class="hero" style="font-size:30px;">' + markFact('lasts.worst12', money(r.worst12.min)) + '</span><span class="hero-sub">' + WORST12_WORDS + '</span></div>') + '</div>'
    + (saving ? '<p class="hint" data-from-stop="1">' + markWithin(esc(fromStopWords(p)), [[/starts from (£[\d,]+) in your pension/, 'pot.atStop']]) + '</p>' : '')
    + '<p class="verdict-fixed" data-fixed="1">' + (a.weighted !== null ? markWithin(esc(w.fixed), LASTS_FINDS.fixed) : esc(w.why || '')) + '</p>'
    + (w.floor ? '<p class="hint">' + markWithin(esc(w.floor), LASTS_FINDS.floor) + '</p>' : '') + '<p class="hint">' + markWithin(esc(w.left), LASTS_FINDS.left) + '</p>'
    + '<div class="verdict-basis">' + w.assumed.map((x) => markWithin(esc(x), LASTS_FINDS.assumed)).join(' ') + '</div></div>';
}

/** (7.12.0) The line that says a saving plan's run starts from the middling pot when work stops (the run's own `p.pot`). */
export function fromStopWords(p) {
  const pot = p && Number.isFinite(+p.pot) && +p.pot > 0 ? moneyK(+p.pot) : null;   // the one rounding of the pot at the stop (step F1)
  return 'The chance above counts the saving years: each future saves its own pot, then draws from it, as on the Accumulation tab and the simple view. '
    + 'Everything below starts from ' + (pot ? pot + ' in your pension' : 'the middling pot') + ' on the day work stops (the middling case) and leaves out the saving years, so it can differ.';
}


/** A document locked with the weighted definition: its own words, at its own lines, never today's. */
function documentBlockHtml(r, p, def) {
  const w = def.weighted;
  const v = chanceVerdictOf(r, p, { definition: def }) || 'no';
  const tone = v === 'yes' ? 'success' : v === 'close' ? 'warning' : 'danger';
  const kind = kindOf(r);
  const age = planToAgeOfDefinition(def) ?? planToAgeOf(+p.startAge || 0, +p.durationYears || 0);
  const name = LEVEL_NAMES[def.level] || 'Balanced';
  const head = typeof w.chance === 'number'
    ? '<div data-weighted="' + w.chance + '"><span class="hero" style="font-size:30px;">' + esc(chanceWords(w.chance)) + '</span><span class="hero-sub">When the plan was locked, counting how long people your age live, ' + esc(LASTS_AS_LONG[kind]) + ' ' + esc(chanceWords(w.chance)) + '.</span></div>'
    : '<div><span class="hero" style="font-size:30px;">' + esc(twentiethsOfFutures(w.fixedAge)) + '</span><span class="hero-sub">When the plan was locked.</span></div>';
  return '<div class="verdict verdict-' + tone + '" data-level="' + esc(def.level) + '"><div class="verdict-title">' + (r.ruinLabel ? 'Will you get what you planned? — ' : 'Will your money last? — ') + VERDICT_TITLE[v] + ' at ' + name + ', when it was locked</div>'
    + '<div class="verdict-heroes">' + head + '</div>'
    + '<p class="verdict-fixed" data-fixed="1">' + esc(fixedAgeWords(typeof w.fixedAge === 'number' ? w.fixedAge : 1 - (r.ruin.mc || 0) / 100, age, { kind })) + '</p>'
    + '<div class="verdict-basis">The figures this plan was locked with; the document keeps them.</div></div>';
}

/**
 * The classic page's "How careful?" (window.setChanceLevel, called by the block's control): the plan's level, saved
 * (lead4.md R5: phases.level, the same one write as the simple view's strip, through deps.writeLevel), then every block on
 * the page drawn again at it from the one test held (a level changes only what counts as on course, never the run). A
 * write that is refused draws the blocks back at the plan's level. Never a page variable.
 */
/** Why the plan's level was not saved (review.js phaseChoicePatch's problems), in the simple view's words. */
export const LEVEL_REFUSED = Object.freeze({
  example: 'This is an example plan, so nothing was changed.',
  closed: 'This plan is closed, so nothing was changed.',
  notNow: 'This plan has nothing to judge yet, so nothing was changed.',
  notHere: 'That plan is not in this account. Nothing was changed.',
  locked: 'This plan would not take the change. Nothing was changed.',
  problems: 'The level could not be saved. Nothing was changed.'
});

export function installChanceLevel(win, doc, { writeLevel = null } = {}) {
  const redraw = (level) => {
    const t = win._oneTest;
    if (!t || !t.chance) return;
    t.chance = { ...t.chance, level };
    for (const el of doc.querySelectorAll('[data-chance-block]')) el.outerHTML = verdictBlockView(t.r, t.p, t.chance);
  };
  win.setChanceLevel = async (level) => {
    if (!LEVEL_IDS.includes(level) || typeof writeLevel !== 'function') return false;
    const t = win._oneTest;
    const was = t && t.chance ? t.chance.level : null;
    redraw(level);
    let ok = false;
    try { ok = (await writeLevel(level)) === true; } catch { ok = false; }
    if (!ok && was) redraw(was);
    return ok;
  };
}

/**
 * The classic Assumptions page's row on how long the money has to last (the build spec's section 11), from the table the
 * figures read (LongevityModel.LIFE_TABLE): its edition and source, the two ages, the levels.
 */
const dayText = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); return m ? (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : String(iso || ''); };
export function lifeAssumptionsRow() {
  const t = LIFE_TABLE;
  return ['How long the money has to last',
    'How long people born in each year are likely to live comes from the Office for National Statistics\' figures for ' + esc(t.region || 'England and Wales') + ' (' + esc(t.edition || '') + ', published ' + esc(dayText(t.published)) + '; Open Government Licence). Your plan runs to the age when fewer than 1 in ' + Math.round(1 / HORIZON.planToShare) + ' people your age are still alive; we follow each future on until fewer than 1 in ' + Math.round(1 / HORIZON.weightShare) + ' are.',
    'These are figures for everyone in England and Wales; people with pension savings tend to live a little longer. The ONS publishes figures to age 100; above that we extend each line ourselves. If you do not say, we use the figures for women, which test the money for longer. The two figures answer different questions, so we always show both. Counting by how long people live is usually the kinder of the two, so our levels ask for more: Careful 19 times in 20, Balanced 18, Bold 14.'];
}

/** The row in the Assumptions page's list, while the figures are weighted (in the rollback the page is as it was). */
export function lifeAssumptionsRows(row, weighted = SUCCESS.weighted) {
  return weighted ? [row(...lifeAssumptionsRow())] : [];
}

/**
 * The plan document's one line on how it was tested (its `assumptions.success`): the level, the age tested to, the age the
 * futures were followed on to. '' for a document without one (every document before 7.8.0 reads as it always did).
 */
export function successLineHtml(doc) {
  const def = doc && doc.assumptions && doc.assumptions.success && typeof doc.assumptions.success === 'object' ? doc.assumptions.success : null;
  if (!def) return '';
  const name = LEVEL_NAMES[def.level] || 'Balanced';
  const want = Number.isInteger(def.levelFails20) ? 20 - def.levelFails20 : ({ careful: 19, balanced: 18, bold: 14 }[def.level] || 18);   // the document's own lines
  const age = planToAgeOfDefinition(def);
  return '<p class="hint" data-fixed="1">Locked at ' + name + ' (lasting as long as you do ' + want + ' times in 20, counting how long people your age live)'
    + (age ? ', tested to ' + age + (Number.isFinite(def.weightToAge) && def.weightToAge > age ? ' and each future followed on to ' + def.weightToAge : '') : '') + '.</p>';
}
