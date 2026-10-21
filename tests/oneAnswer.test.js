/**
 * One "will it last" answer per plan (research/v7/v6-usability-audit.md §1 problem 1, §5 decision 2, option (a),
 * approved 17 Oct 2026). Every figure the planner shows comes from the ONE stress test every strategy runs
 * (stressTestStrategy on the plan's own strategy, with its own cuts setting and its full length), read through
 * src/services/OneAnswer.js. The words: "lasts in 9 futures out of 10"; the bad case is the worst 1 in 10, never the
 * worst of 1,000; the worst start years are "an unfair test", never "FAILED".
 *
 * The retired paths: the Monte Carlo tab's own run (5-year blocks of 1928–2024 through runMonteCarloSimulation), the
 * Historical tab's own run, the Scenarios tab's looped decades, the Strategies ranking's "level footing" toggle, the
 * couples check's own Monte Carlo. index.html's inline script must not reach any of them.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

import { futuresOutOfTen, summariseCuts, oneAnswer, worstStarts, startOfWindow, earlierTestNote, rankByLasting, NAMED_STARTS } from '../src/services/OneAnswer.js';
import { historyTabHtml, scenariosTabHtml, rankingCardHtml, cutsRowHtml, leftRowHtml, allocationGridHtml, earlierTestNoteHtml, withoutCutsLineHtml } from '../src/ui/oneAnswerView.js';
import { trimResult } from '../src/services/PlanDocument.js';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]))[0][2];
const markup = html.replace(/<script[\s\S]*?<\/script>/g, '');
const doc = new JSDOM(markup).window.document;
const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// A Pots & Valves result as stressTestStrategy returns it (the parts the screens read).
const R = {
  strategyId: 'pots-and-valves', name: 'Pots & Valves', affordable: true,
  ruin: { hist: 0, mc: 4.1 }, n: { hist: 657, mc: 1000 }, coverage: 99.6,
  worst12: { min: 31000, median: 40000 }, terminal: { p10: 135978, p50: 1806699, p90: 4200000, histMedian: 1500000 },
  cones: { wealth: { p10: [1], p50: [1], p90: [1] }, income: { p10: [1], p50: [1], p90: [1] } },
  cuts: { futures: 1000, cutN: 190, cutPct: 19, ranOutN: 41, typicalCutPerYear: 4000, typicalCutYears: 3, typicalCutTotal: 12000 },
  guaranteedToAge: 'State Pension only (from age 67)',
  histWindows: [{ s: 0, failed: false, failAge: null, terminal: 100, worst12: 40000, protMonths: 0 }, { s: 1140, failed: true, failAge: 88.5, terminal: 0, worst12: 24000, protMonths: 300 }, { s: 1224, failed: false, failAge: null, terminal: 20, worst12: 30000, protMonths: 120 }]
};
const P = { durationYears: 39, startAge: 56, targetAnnual: 40000, pnvCfg: { disableProtection: false, protectionMult: 0.8, consecutiveLimit: 3 } };

describe('the words: futures out of 10', () => {
  it('bands like the quick answer\'s words (PlanSeed.answerLastedWords): 9 in 10 is the bar, just under it is not 9', () => {
    expect(futuresOutOfTen(1)).toEqual({ n: 10, words: 'in every future it tried' });
    expect(futuresOutOfTen(0.959)).toEqual({ n: 10, words: 'in more than 9 futures out of 10' });
    expect(futuresOutOfTen(0.93)).toEqual({ n: 9, words: 'in 9 futures out of 10' });
    expect(futuresOutOfTen(0.86)).toEqual({ n: 9, words: 'in just under 9 futures out of 10' });
    expect(futuresOutOfTen(0.44)).toEqual({ n: 4, words: 'in 4 futures out of 10' });
    expect(futuresOutOfTen(0.07)).toEqual({ n: 1, words: 'in only 1 future out of 10' });
    expect(futuresOutOfTen(0.02)).toEqual({ n: 0, words: 'in fewer than 1 future out of 10' });
    expect(futuresOutOfTen(0)).toEqual({ n: 0, words: 'in none of the futures it tried' });
    expect(futuresOutOfTen(NaN)).toEqual({ n: 0, words: 'in none of the futures it tried' });
  });
});

describe('the income cuts: how many futures, by how much, for how long', () => {
  const W = [
    { failed: false, cutYears: 0, cutReal: 0, protMonths: 0 },
    { failed: false, cutYears: 0, cutReal: 40, protMonths: 6 },          // under 1%: not a cut
    { failed: false, cutYears: 2, cutReal: 8000, protMonths: 30 },
    { failed: false, cutYears: 4, cutReal: 20000, protMonths: 60 },
    { failed: true, cutYears: 1, cutReal: 3000, protMonths: 40 }
  ];
  it('counts the futures whose income was actually cut, those that ran out, and the typical depth and length', () => {
    const c = summariseCuts(W, 39);
    expect(c.futures).toBe(5);
    expect(c.cutN).toBe(3); expect(c.cutPct).toBe(60);
    expect(c.ranOutN).toBe(1);
    expect(c.typicalCutYears).toBe(2);        // median of 2, 4, 1
    expect(c.typicalCutPerYear).toBe(4000);   // median of 8000/2, 20000/4, 3000/1
    expect(c.typicalCutTotal).toBe(8000);
    expect(c.worstCutTotal).toBe(20000);
  });
  it('no futures, no cuts', () => {
    expect(summariseCuts([], 30)).toEqual({ futures: 0, cutN: 0, cutPct: 0, ranOutN: 0, typicalCutPerYear: 0, typicalCutYears: 0, typicalCutTotal: 0, worstCutTotal: 0 });
    expect(summariseCuts(W.slice(0, 2), 30).cutN).toBe(0);
  });
});

describe('oneAnswer: the figures every screen reads', () => {
  it('reads the chance, the words, the typical and bad-case (worst 1 in 10) money left, and the cuts from the one result', () => {
    const a = oneAnswer(R, P);
    expect(a.chancePct).toBeCloseTo(95.9, 6);
    expect(a.share).toBeCloseTo(0.959, 6);
    expect(a.outOfTen).toEqual({ n: 10, words: 'in more than 9 futures out of 10' });
    expect(a.futures).toBe(1000); expect(a.histories).toBe(657); expect(a.years).toBe(39);
    expect(a.typicalLeft).toBe(1806699);
    expect(a.badCaseLeft).toBe(135978);     // p10 — never the worst of 1,000
    expect(a.goodCaseLeft).toBe(4200000);
    expect(a.histRanOutPct).toBe(0); expect(a.histRanOutN).toBe(0);
    expect(a.worst12).toBe(31000);
    expect(a.cuts).toBe(R.cuts);
    expect(a.cutLabel).toBeNull();
  });
  it('a result that is not affordable, or missing, has no answer', () => {
    expect(oneAnswer(null, P)).toBeNull();
    expect(oneAnswer({ affordable: false, reason: 'too dear' }, P)).toBeNull();
  });
  it('a strategy that is "cut" rather than "runs out" keeps its label', () => {
    expect(oneAnswer({ ...R, ruinLabel: 'chance the plan is cut' }, P).cutLabel).toBe('chance the plan is cut');
  });
});

describe('the worst start years are read from the one test\'s own histories', () => {
  it('a month index since January 1871 → the start year and month', () => {
    expect(startOfWindow(0)).toEqual({ year: 1871, month: 1 });
    expect(startOfWindow(1140)).toEqual({ year: 1966, month: 1 });
    expect(startOfWindow(1224 + 6)).toEqual({ year: 1973, month: 7 });
  });
  it('ran out first (earliest first), then the leanest; each marked as an unfair test', () => {
    const w = worstStarts(R.histWindows, 2);
    expect(w.map((x) => x.year)).toEqual([1966, 1973]);
    expect(w[0].failed).toBe(true); expect(w[0].unfair).toBe(true); expect(w[1].unfair).toBe(true);
    expect(worstStarts([], 5)).toEqual([]);
    expect(worstStarts(undefined, 5)).toEqual([]);
  });
  it('the named start years are real crises with a plain label', () => {
    expect(NAMED_STARTS.map((x) => x.year)).toEqual([1929, 1937, 1966, 1973, 2000, 2008]);
    for (const x of NAMED_STARTS) expect(typeof x.label).toBe('string');
  });
});

describe('a locked plan keeps its stored figure; the page says when today\'s test differs', () => {
  it('nothing to say when the figures agree', () => {
    expect(earlierTestNote(R, R)).toBe('');
    expect(earlierTestNote(R, { ...R, ruin: { hist: 0, mc: 4.12 }, terminal: { ...R.terminal, p50: 1806700 } })).toBe('');
    expect(earlierTestNote(null, R)).toBe('');
    expect(earlierTestNote(R, null)).toBe('');
    expect(earlierTestNote(R, { affordable: false })).toBe('');
  });
  it('says "worked out under the earlier test" with both figures when they differ, and never rewrites the stored one', () => {
    const stored = JSON.parse(JSON.stringify(R));
    const note = earlierTestNote(stored, { ...R, ruin: { hist: 0, mc: 9.3 }, terminal: { ...R.terminal, p50: 1500000 } });
    expect(note).toMatch(/worked out under the earlier test/);
    expect(note).toMatch(/96% \(in more than 9 futures out of 10\)/);
    expect(note).toMatch(/today's test gives 91%/);
    expect(note).toMatch(/typically £1,806,699 left, today £1,500,000/);
    expect(stored).toEqual(R);
    expect(earlierTestNoteHtml(note)).toContain('alert');
    expect(earlierTestNoteHtml('')).toBe('');
  });
});

describe('the Strategies ranking lists strategies by how many futures out of 10 each lasts', () => {
  const S = {
    'full-il-gilt': { ...R, strategyId: 'full-il-gilt', ruin: { hist: 0, mc: 0 }, coverage: 100 },
    'pots-and-valves': R,
    'bridge-and-engine': { ...R, strategyId: 'bridge-and-engine', ruin: { hist: 2, mc: 12 }, coverage: 98 },
    'floor-and-flex': { ...R, strategyId: 'floor-and-flex', ruin: { hist: 2, mc: 12 }, coverage: 99.9, ruinLabel: 'lean year' }
  };
  it('sorted by share, ties broken by the share of the years paid', () => {
    const rows = rankByLasting(Object.keys(S).map((id) => ({ id, r: S[id] })));
    expect(rows.map((x) => x.id)).toEqual(['full-il-gilt', 'pots-and-valves', 'floor-and-flex', 'bridge-and-engine']);
    expect(rows[0].lasts.words).toBe('in every future it tried');
    expect(rows[1].lasts.words).toBe('in more than 9 futures out of 10');
    expect(rows[3].lasts.words).toBe('in just under 9 futures out of 10');   // 88%: not the 9 in 10 "on course" is
  });
  it('the card: plain words in the main view, the score under "More columns" (kept, never removed)', () => {
    const scored = Object.keys(S).map((id) => ({ id, r: S[id], sc: { coverageRatio: 2.1, vol: 0.12, vac: 17.5, n: 80 } }));
    const names = { 'full-il-gilt': 'Full index-linked gilt ladder', 'pots-and-valves': 'Pots & Valves', 'bridge-and-engine': 'Bridge & engine', 'floor-and-flex': 'Floor & Flex' };
    const colors = Object.fromEntries(Object.keys(names).map((k) => [k, '#000']));
    const h = rankingCardHtml({ scored, names, colors, rankBy: 'lasts', more: false, volFloorPct: 3, unaffordable: [], cutsWords: 'with the spending cuts you set (up to 20% after 3 months below the glidepath)' });
    const t = plain(h);
    expect(t).toMatch(/lasts in every future it tried/);
    expect(t).toMatch(/lasts in more than 9 futures out of 10/);
    expect(t).toMatch(/bad case \(the worst 1 in 10\)/i);
    expect(t).toContain('with the spending cuts you set');
    expect(t).not.toMatch(/Estrada|volatility-adjusted|level footing/i);
    expect(h).toContain('setCmpMore(true)');
    const more = plain(rankingCardHtml({ scored, names, colors, rankBy: 'score', more: true, volFloorPct: 3, unaffordable: [], cutsWords: '' }));
    expect(more).toMatch(/Score/); expect(more).toMatch(/Coverage ratio/); expect(more).toMatch(/Bumpiness/); expect(more).toMatch(/Estrada/);
    expect(plain(rankingCardHtml({ scored, names, colors, rankBy: 'lasts', more: false, volFloorPct: 3, unaffordable: [{ id: 'floor-the-schedule', name: 'Floor the schedule', reason: 'too dear' }], cutsWords: '' }))).toContain('Not affordable on this plan');
  });
});

describe('the Monte Carlo tab\'s card rows: money left, and the income cuts', () => {
  it('money left: typical, bad case (the worst 1 in 10), good case', () => {
    const t = plain(leftRowHtml(oneAnswer(R, P)));
    expect(t).toContain('typically £1,806,699');
    expect(t).toContain('bad case (the worst 1 in 10) £135,978');
    expect(t).not.toMatch(/worst of 1,000|unluckiest/);
  });
  it('the cuts: how many futures, by how much, for how long — and nothing for a strategy without cuts', () => {
    const t = plain(cutsRowHtml(oneAnswer(R, P)));
    expect(t).toContain('cut in 190 of 1,000 futures');
    expect(t).toContain('41 of them later ran out');
    expect(t).toContain('£4,000 a year less');
    expect(t).toContain('about 3 years');
    expect(cutsRowHtml(oneAnswer({ ...R, cuts: null }, P))).toBe('');
    expect(plain(cutsRowHtml(oneAnswer({ ...R, cuts: { ...R.cuts, cutN: 0, ranOutN: 0 } }, P)))).toContain('never cut');
  });
  it('the "without the cuts" line is an explanation beside the one figure', () => {
    const t = plain(withoutCutsLineHtml(oneAnswer(R, P), { ruin: { mc: 11.2 } }));
    expect(t).toContain('Without the cuts');
    expect(t).toContain('112 of 1,000');
    expect(withoutCutsLineHtml(oneAnswer(R, P), null)).toBe('');
  });
});

describe('History and Scenarios explain the one test; neither shows a rival percentage or "FAILED"', () => {
  const rows = [
    { year: 1929, label: 'the Great Depression', kind: 'pnv', available: true, failed: false, failAge: null, terminal: 400000, worst12: 34000, protMonths: 48 },
    { year: 1966, label: 'the 1966 start', kind: 'pnv', available: true, failed: true, failAge: 88.2, terminal: 0, worst12: 24000, protMonths: 300 },
    { year: 2008, label: 'the 2008 crisis', kind: 'pnv', available: false, tooShort: true }
  ];
  const a = oneAnswer(R, P);
  it('History: "what if you had retired into …", the worst decades as an unfair test', () => {
    const h = historyTabHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', a, rows, worst: worstStarts(R.histWindows, 2) });
    const t = plain(h);
    expect(t).toMatch(/What if you had retired into/);
    expect(t).toMatch(/an unfair test/);
    expect(t).toMatch(/every real 39-year stretch/);
    expect(t).toContain('ran out at 88');
    expect(t).toContain('not long enough yet');
    expect(t).not.toMatch(/FAILED/);
    expect(t).not.toMatch(/\b\d{1,3}(\.\d)?% (chance|of futures)/);   // no rival chance figure
    expect(t).not.toMatch(/1928/);
  });
  it('Scenarios: the named stresses, explained, with the one test\'s history row for each', () => {
    const scenarios = { GREAT_DEPRESSION: { name: 'Great Depression', equity: [-0.1, -0.26, -0.45, -0.1, 0.48, -0.03, 0.45, 0.3, -0.36, 0.27], inflation: [0, -0.07, -0.1, -0.1, 0.02, 0.03, 0.01, 0.02, 0.01, -0.01], color: '#e74c3c' }, SYNTHETIC_WORST: { name: 'Synthetic Worst', equity: [-0.4, 0.1, 0.1, 0.1, -0.35, 0.1, 0.1, 0.1, 0.1, -0.3], inflation: [0.08, 0.05, 0.05, 0.05, 0.08, 0.05, 0.05, 0.05, 0.05, 0.08], color: '#1abc9c' } };
    const h = scenariosTabHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', a, r: R, p: P, rows: [rows[0]], scenarios, startYears: { GREAT_DEPRESSION: 1929 }, worst: worstStarts(R.histWindows, 1) });
    const t = plain(h);
    expect(t).toContain('Great Depression');
    expect(t).toMatch(/shares .*down/i);
    expect(t).toContain('Synthetic Worst');
    expect(t).toMatch(/no real start year/i);
    expect(t).not.toMatch(/FAILED/);
    expect(t).not.toMatch(/looped|on repeat/i);
  });
  it('a strategy that cuts instead of running out says "cut" (or "a lean year"), never "the money ran out" (sweep 20 Oct 2026)', () => {
    expect(a.failKind).toBe('ran-out');
    expect(plain(historyTabHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', a, rows: [], worst: [] }))).toMatch(/the money ran out in \d+ of them/);
    const rot = oneAnswer({ ...R, strategyId: 'gilt-rotation', ruinLabel: 'chance the rotated years (after 75) are cut' }, P);
    expect(rot.failKind).toBe('cut');
    const t = plain(historyTabHtml({ strategyId: 'gilt-rotation', name: 'Gilt ladder + rotation', a: rot, rows: [], worst: [] }));
    expect(t).toMatch(/the plan was cut in \d+ of them/);
    expect(t).not.toMatch(/ran out/);
    const flex = oneAnswer({ ...R, strategyId: 'floor-and-flex', ruinLabel: 'chance of at least one lean year' }, P);
    expect(flex.failKind).toBe('lean');
    expect(plain(historyTabHtml({ strategyId: 'floor-and-flex', name: 'Floor & flex', a: flex, rows: [], worst: [] }))).toMatch(/\d+ of them had a lean year/);
  });
  it('a contract strategy: every year is bought, so a bad start changes nothing', () => {
    const t = plain(historyTabHtml({ strategyId: 'floor-the-schedule', name: 'Floor the schedule', a: { ...a, histRanOutPct: 0 }, rows: [{ year: 1929, label: 'the Great Depression', kind: 'contract', available: true }], worst: [] }));
    expect(t).toMatch(/bought by contract/i);
  });
});

describe('Compare allocations reads the one test too', () => {
  it('the grid shows futures out of 10 and the bad-case money left, never a rival coverage figure', () => {
    const cell = (mc, p10) => ({ affordable: true, ruin: { mc }, terminal: { p10, p50: p10 * 3 }, n: { mc: 1000 } });
    const grid = { cautious: { flat: cell(8, 100000), tent: cell(6, 120000) }, balanced: { flat: cell(4, 130000), tent: cell(5, 110000) }, adventurous: { flat: cell(7, 90000), tent: cell(9, 80000) } };
    const presets = { cautious: { label: 'Cautious', equity: 0.3, bond: 0.5, cash: 0.2 }, balanced: { label: 'Balanced', equity: 0.6, bond: 0.3, cash: 0.1 }, adventurous: { label: 'Adventurous', equity: 0.8, bond: 0.15, cash: 0.05 } };
    const t = plain(allocationGridHtml(grid, presets, ['cautious', 'balanced', 'adventurous']));
    expect(t).toContain('9.6 futures out of 10');
    expect(t).toContain('bad case £130,000');
    expect(t).toMatch(/Balanced.*lasts best/);
    expect(t).not.toMatch(/coverage/i);
  });
});

describe('the retired paths are gone from index.html; the plan\'s own settings run everywhere', () => {
  it('no second Monte Carlo, Historical or looped-scenario run; no level-footing toggle; no couples Monte Carlo of its own', () => {
    for (const gone of ['runMonteCarloSimulation', 'runHistoricalSimulation', 'runAllScenarios', 'renderStressResults', 'renderScenarioResults', 'buildWorstPeriodsTable', '_cmpCutsOff', 'setCmpCuts', 'monteCarloReturns', 'runOptimisationUI', 'latestMCResults', "runInWorker('household'", 'requiredPotForSuccess(']) {
      expect(script.includes(gone), gone).toBe(false);
    }
    expect(script).not.toMatch(/FAILED/);
    expect(script).not.toMatch(/level footing/i);
    expect(script).not.toMatch(/worst simulated future/i);
  });
  it('the tabs: no per-tab years box (the plan\'s full length runs), one "Compare allocations" button, the words say what the test is', () => {
    expect(doc.querySelector('#mcYears')).toBeNull();
    expect(doc.querySelector('#histYears')).toBeNull();
    expect(doc.querySelector('#optimiseBtnHist')).toBeNull();
    expect(doc.querySelector('#optimiseResultsHist')).toBeNull();
    expect(doc.querySelector('#optimiseBtnMC')).not.toBeNull();
    expect(doc.querySelectorAll('#stress-content .sub-tab[data-stresstab]').length).toBe(6);
    const mc = doc.querySelector('#stress-montecarlo').textContent.replace(/\s+/g, ' ');
    expect(mc).toMatch(/every real stretch of markets since 1871 and 1,000 possible futures/);
    expect(mc).not.toMatch(/1928/);
    expect(doc.querySelector('#stress-historical').textContent).not.toMatch(/1928/);
  });
  it('the ranking and the couples check run the plan\'s own cuts; "Am I on course?" and Try run the one test at the plan\'s full length', () => {
    const at = script.indexOf('async function cmpRun');
    const body = script.slice(at, script.indexOf('\n    }\n', at));
    expect(body).not.toMatch(/disableProtection/);
    const ot = script.indexOf('window.runOnTrackCheck');
    expect(script.slice(ot, script.indexOf('\n    };', ot))).toMatch(/requiredPotForStrategy\(stratId, strategyPlanFor\(sSet\), ON_COURSE_SHARE\)/);
    expect(script).toMatch(/runInWorker\('household-ways'/);   // 6.25.0: both ways (as they are / drawing together) through the one test
    // 6.41.0: the what-if copy is lifted (src/answers/plan/lastsRun.js trySettingsOf): the planner hands it the boxes, and the
    // years clamp to the engines' 45 lives there
    expect(script).toMatch(/function tryStrategySettings\(s\) \{\s*return trySettingsOf\(s, readTryBoxes\(\)\);/);
    const lifted = readFileSync(process.cwd() + '/src/answers/plan/lastsRun.js', 'utf8');
    expect(lifted).toContain('export const TRY_YEARS = Object.freeze({ min: 5, max: 45 });');
    expect(lifted).toContain('c.duration = Math.max(TRY_YEARS.min, Math.min(TRY_YEARS.max, +b.years || s.duration || 35));');
  });
});

describe('the plan document stores the one figure, not the per-start history', () => {
  it('trimResult keeps ruin, terminal and the cuts; drops histWindows with samples and survivedMc', () => {
    const t = trimResult({ ...R, samples: { wealth: [[1]] }, survivedMc: [true], configs: { lr: {} } });
    expect(t.ruin).toEqual(R.ruin); expect(t.terminal).toEqual(R.terminal); expect(t.cuts).toEqual(R.cuts);
    expect(t.histWindows).toBeUndefined(); expect(t.samples).toBeUndefined(); expect(t.survivedMc).toBeUndefined();
    expect(t.configs).toEqual({});
  });
});
