/**
 * The screens of the one answer (services/OneAnswer.js): the rows the Monte Carlo tab's card adds, the History and
 * Scenarios tabs as explanations of the one test, the Strategies ranking by futures out of 10, the allocation grid,
 * and the locked document's "earlier test" line. HTML strings only; no DOM, no storage, no engine.
 */
import { inflationDecadesSvg } from './giltLadderGraphic.js';
import { futuresOutOfTen, pctText, tenthsOutOfTen, CHANCE_BARS } from '../services/OneAnswer.js';

const futuresWords = (share) => futuresOutOfTen(share).words;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const n0 = (v) => Math.round(+v || 0).toLocaleString('en-GB');
const pc = (v) => Math.round(+v || 0) + '%';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "Left at the end" — typical, bad case (the worst 1 in 10), good case. */
export function leftRowHtml(a) {
  if (!a) return '';
  return '<tr><td>Left at the end (today\'s money)</td><td>typically <strong>' + gbp(a.typicalLeft) + '</strong>; in a bad case (the worst 1 in 10) <strong>' + gbp(a.badCaseLeft) + '</strong>; in a good case (the best 1 in 10) ' + gbp(a.goodCaseLeft) + '</td></tr>';
}

/** The income cuts: how many futures, by how much, for how long. '' for a strategy that does not cut. */
export function cutsRowHtml(a) {
  if (!a || !a.cuts) return '';
  const c = a.cuts;
  if (!(c.cutN > 0)) return '<tr><td>Income cuts</td><td>never cut: in every one of the ' + n0(c.futures) + ' futures the plan was paid in full</td></tr>';
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
  const eq = (sc.equity || []).reduce((a, r) => a * (1 + r), 1) - 1;
  const first = (sc.equity || []).slice(0, 3).reduce((a, r) => a * (1 + r), 1) - 1;
  const cpi = (sc.inflation || []).reduce((a, r) => a * (1 + r), 1) - 1;
  const dir = (v) => (v < 0 ? 'down ' + pc(-v * 100) : 'up ' + pc(v * 100));
  return 'shares ' + dir(first) + ' in the first three years and ' + dir(eq) + ' over the decade; prices ' + dir(cpi) + ' over the decade';
}

/**
 * Scenarios: the named stresses, explained — what the decade did, and what the one test's real history from that
 * start did to this plan. The full gilt ladder keeps its inflation table (the only thing a scenario changes for it).
 */
export function scenariosTabHtml({ strategyId, name, a, r, p, rows = [], scenarios = {}, startYears = {}, worst = [] }) {
  let h = '<div class="card"><h2>Scenarios — the named stresses</h2>';
  if (!a) return h + '<div class="alert alert-warning">The strategy is not affordable on this plan, so there is nothing to run the scenarios through. Fix the plan in Settings first.</div></div>';
  if (strategyId === 'full-il-gilt' && r && r.plan && r.plan.years && r.plan.years.length) {
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
  h += '<p>Each named stress is a real decade. The one test already contains it: the real history that starts at that decade\'s first year is one of the ' + n0(a.histories) + ' starts behind your figure of <strong>' + pctText(a.chancePct, 0, CHANCE_BARS) + '</strong> (lasts ' + esc(a.outOfTen.words) + '). Here is what the decade did, and what retiring into it would have done to <strong>' + esc(name) + '</strong> on your plan — its own cuts setting, its full length, today\'s money.</p>';
  h += '<div class="table-scroll-container"><table><thead><tr><th>Named stress</th><th>What the decade did</th><th>Retiring into it: what happened to this plan</th><th>Lowest 12 months</th><th>Left at the end</th></tr></thead><tbody>';
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
  h += '</tbody></table></div>';
  h += '<p class="hint" style="margin-top:8px;">Until 6.24 this tab ran each decade over and over for the whole plan and marked the plan as failed — a test nothing real has ever set. The one test counts every real start once; the named decades are explained here, not re-run.</p></div>';
  return h;
}

/**
 * The Strategies ranking card: by how many futures out of 10 each strategy lasts, in plain words; the score
 * (Estrada's volatility-adjusted coverage ratio) kept under "More columns".
 * @param {{ scored: Array<{id, r, sc}>, names, colors, rankBy: 'lasts'|'left'|'score'|'coverage', more: boolean, volFloorPct, unaffordable: Array<{id,name,reason}>, cutsWords }} o
 */
export function rankingCardHtml({ scored, names, colors, rankBy = 'lasts', more = false, volFloorPct = 3, unaffordable = [], cutsWords = '' }) {
  const rows = scored.map((x) => { const share = Math.max(0, Math.min(1, (100 - (+x.r.ruin.mc || 0)) / 100)); return { ...x, share, lasts: null }; });
  for (const x of rows) { x.lasts = futuresWords(x.share); }
  const keyOf = (x) => rankBy === 'left' ? (+x.r.terminal.p50 || 0) : rankBy === 'score' ? (x.sc ? x.sc.vac : 0) : rankBy === 'coverage' ? (x.sc ? x.sc.coverageRatio : 0) : x.share * 1000 + (+x.r.coverage || 0);
  rows.sort((a, b) => keyOf(b) - keyOf(a));
  const btn = (k, label) => '<button type="button" class="risk-btn' + (rankBy === k ? ' active' : '') + '" style="padding:3px 10px;font-size:12px;" data-on-click="setCmpRank(\'' + k + '\')">' + label + '</button>';
  let h = '<div class="card"><h2>Which strategy? — ranked on your plan</h2>'
    + '<p class="hint" style="margin:0 0 8px;">All ' + (scored.length + unaffordable.length) + ' ran <strong>your</strong> plan (pot, ISA policy, income shape, State Pension, full length) through the <strong>same one test</strong> — every real stretch of markets since 1871 and 1,000 possible futures' + (cutsWords ? ', ' + esc(cutsWords) : '') + '. The first column is the one figure every screen shows for your own strategy. What each one costs you to live with — a cut, a cliff, a bumpy pot — is yours to weigh; the columns beside it are the trade-offs.</p>'
    + '<div class="row-flex" style="margin:0 0 8px;align-items:center;"><span class="hint">Rank by:</span>' + btn('lasts', 'How many futures it lasts') + btn('left', 'What is typically left') + (more ? btn('score', 'Score') + btn('coverage', 'Coverage ratio') : '')
    + '<button type="button" class="risk-btn" style="padding:3px 10px;font-size:12px;margin-left:auto;" data-on-click="setCmpMore(' + (more ? 'false' : 'true') + ')">' + (more ? 'Fewer columns' : 'More columns') + '</button></div>'
    + '<div class="table-scroll-container"><table><thead><tr><th>#</th><th>Strategy</th><th>Lasts</th><th>Worst 12 months</th><th>Typically left</th><th>Bad case (the worst 1 in 10)</th>'
    + (more ? '<th title="Share of the plan\'s years the money paid for, averaged over all futures">Years covered</th><th title="Years sustained plus the years the money left over would have funded, over the plan length — above 1 a bequest, below 1 it ran out">Coverage ratio</th><th title="Median across futures of everything the strategy paid out over the plan, today\'s money">Spent over the plan</th><th title="Year-on-year volatility of total wealth along the way">Bumpiness</th><th title="Coverage ratio divided by bumpiness, averaged over futures">Score</th>' : '')
    + '</tr></thead><tbody>';
  rows.forEach((x, i) => {
    const r = x.r;
    h += '<tr' + (i === 0 ? ' style="font-weight:600;"' : '') + '><td>' + (i + 1) + '</td><td><span style="display:inline-block;width:10px;height:10px;background:' + esc(colors[x.id] || '#888') + ';border-radius:2px;margin-right:6px;"></span>' + esc(names[x.id] || x.id) + ' <button type="button" class="risk-btn" style="padding:1px 7px;font-size:11px;" data-on-click="showStrategyPage(\'' + esc(x.id) + '\')">read →</button></td>'
      + '<td>lasts ' + esc(x.lasts) + ' <span class="hint">(' + pctText(x.share * 100, 0, CHANCE_BARS) + (r.strategyId === 'floor-and-flex' ? ', no lean year' : r.ruinLabel ? ', else cut' : '') + ')</span></td>'
      + '<td>' + gbp(r.worst12 && r.worst12.min) + '</td><td>' + gbp(r.terminal.p50) + '</td><td>' + gbp(r.terminal.p10) + '</td>'
      + (more ? '<td>' + (r.coverage != null ? pctText(r.coverage) : '—') + '</td><td>' + (x.sc ? x.sc.coverageRatio.toFixed(2) : '—') + '</td><td>' + (r.spentMedian != null ? gbp(r.spentMedian) : '—') + '</td><td>' + (x.sc ? (x.sc.vol * 100).toFixed(0) + '%/yr' : '—') + '</td><td><strong>' + (x.sc ? x.sc.vac.toFixed(1) : '—') + '</strong></td>' : '')
      + '</tr>';
  });
  h += '</tbody></table></div>';
  if (unaffordable.length) h += '<p class="hint" style="margin-top:6px;">Not affordable on this plan, so not ranked: ' + unaffordable.map((u) => esc(u.name) + ' (' + esc(u.reason || '') + ')').join('; ') + '.</p>';
  const best = rows[0];
  if (best) h += '<div class="alert alert-info" style="margin-top:10px;"><strong>' + esc(names[best.id] || best.id) + ' comes first on your plan</strong> — it lasts ' + esc(best.lasts) + ' (' + pctText(best.share * 100, 0, CHANCE_BARS) + '), typically leaving ' + gbp(best.r.terminal.p50) + '; in a bad case (the worst 1 in 10) ' + gbp(best.r.terminal.p10) + '. Read its page, then the runner-up\'s: the right choice depends on what you would rather live with — a cut, a cliff, or a bumpy pot — and that is yours to weigh. <button type="button" class="risk-btn" style="padding:2px 8px;" data-on-click="showStrategyPage(\'' + esc(best.id) + '\')">Read ' + esc(names[best.id] || best.id) + ' →</button></div>';
  h += '<p class="hint" style="margin-top:8px;">Lasts = the share of the 1,000 futures in which the plan was paid in full to the end (for Floor &amp; Flex: no lean year; for Floor to an age and the rotation: never cut). Worst 12 months = the lowest income lived in any real history. Typically left and the bad case = what is left at the end in the middle future and in the worst 1 in 10 — never the single worst of 1,000.'
    + (more ? ' Years covered = share of the plan\'s years the money paid for, averaged over futures. Coverage ratio = years sustained plus the years the money left over would have funded, over the plan length (Estrada &amp; Kritzman, <em>Toward Determining the Optimal Investment Strategy for Retirement</em>, J. Retirement 2019). Bumpiness = year-on-year volatility of total wealth along the way, floored at ' + Math.round(volFloorPct) + '% so a fully bought plan scores finite. Score = the volatility-adjusted coverage ratio (Estrada, <em>Retirement Planning: The Volatility-Adjusted Coverage Ratio</em>, J. Retirement 2024): coverage divided by bumpiness — it rewards lasting longer and leaving more and penalises a bumpy ride; one honest yardstick, not the only one.' : '')
    + ' A what-if with the cuts switched off is one click away in Try a strategy.</p></div>';
  return h;
}

/**
 * Compare allocations (Pots & Valves): the three risk levels with and without the bond tent, each run through the one
 * test. grid[key].flat / .tent = a stressTestStrategy result (or { affordable: false }).
 */
export function allocationGridHtml(grid, presets, order) {
  let best = { share: -1, key: null, tent: null };
  for (const key of order) for (const t of ['flat', 'tent']) { const g = grid[key] && grid[key][t]; if (g && g.affordable) { const sh = (100 - (+g.ruin.mc || 0)) / 100; if (sh > best.share) best = { share: sh, key, tent: t }; } }
  const cell = (g, isBest) => {
    if (!g || !g.affordable) return '<td style="text-align:center;padding:10px;border:1px solid var(--border);" class="hint">not run</td>';
    const sh = (100 - (+g.ruin.mc || 0)) / 100;
    return '<td style="text-align:center;padding:10px;border:1px solid var(--border);' + (isBest ? 'background:rgba(16,185,129,0.12);' : '') + '"><div style="font-size:20px;font-weight:700;color:var(--' + (isBest ? 'success' : 'text') + ');">' + tenthsOutOfTen(sh) + ' futures out of 10</div><div style="font-size:11px;color:var(--text-muted);">' + pctText(sh * 100, 0, CHANCE_BARS) + ' · typically ' + gbp(g.terminal.p50) + ' left · bad case ' + gbp(g.terminal.p10) + '</div></td>';
  };
  let h = '<h3 style="margin-bottom:6px;">Compare allocations</h3>';
  h += '<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Each cell is the one test (every real stretch since 1871 and 1,000 futures, your own cuts setting, your full length) with the pot split that way. More shares usually lasts in a few more futures but gives a rougher ride; the bond tent mainly lifts the bad case. Pick the risk level you are comfortable holding — the tool will not change it for you.</p>';
  h += '<table style="border-collapse:collapse;width:100%;max-width:640px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';
  for (const key of order) {
    const p = presets[key];
    h += '<tr><td style="padding:8px;border:1px solid var(--border);"><strong>' + esc(p.label) + '</strong><br><span style="font-size:11px;color:var(--text-muted);">' + Math.round(p.equity * 100) + '/' + Math.round(p.bond * 100) + '/' + Math.round(p.cash * 100) + '</span></td>';
    h += cell(grid[key] && grid[key].flat, best.key === key && best.tent === 'flat');
    h += cell(grid[key] && grid[key].tent, best.key === key && best.tent === 'tent');
    h += '</tr>';
  }
  h += '</tbody></table>';
  if (best.key) h += '<p style="margin-top:12px;font-size:13px;"><strong>' + esc(presets[best.key].label) + (best.tent === 'tent' ? ' + bond tent' : '') + '</strong> lasts best: ' + futuresWords(best.share) + ' (' + pctText(best.share * 100, 0, CHANCE_BARS) + '). Set it in Settings if you would like it.</p>';
  return h;
}
