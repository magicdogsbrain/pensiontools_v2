/**
 * The one market (lead4.md R5; src/reading/market.js): one loader for both views' pages and workers, the day's file when it
 * loads and is no older than the copy built in, else the copy built in; a stamp that says which and its date; one label.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadMarket, marketStamp, marketLabel, forgetMarket } from '../../src/reading/market.js';
import { activeLinkers, realYieldForYear, BUNDLED_LINKERS } from '../../src/services/LinkerUniverse.js';
import { activeEquity, BUNDLED_EQUITY } from '../../src/services/EquityIndex.js';

const clone = (x) => JSON.parse(JSON.stringify(x));
const later = (iso) => new Date(Date.parse(iso) + 1000).toISOString();
const giltsFile = () => ({ ...clone(BUNDLED_LINKERS), generated_at: later(BUNDLED_LINKERS.generated_at), as_of: '2026-11-18', curve_as_of: '2026-11-18', realCurve: [{ years: 1, yield: 0.01 }, { years: 30, yield: 0.03 }] });
const equityFile = () => ({ ...clone(BUNDLED_EQUITY), generated_at: later(BUNDLED_EQUITY.generated_at), date: '2026-11-18' });
const serve = (files) => async (url) => { const f = Object.keys(files).find((k) => url.endsWith(k)); return f ? { ok: true, json: async () => files[f] } : { ok: false }; };

afterEach(() => forgetMarket());

describe('the one market loader', () => {
  it('nothing asked: the copy built in, and the stamp says so', async () => {
    const m = await loadMarket({ folder: null });
    expect(activeLinkers()).toBe(BUNDLED_LINKERS);
    expect(m).toEqual({ gilts: { source: 'builtIn', asOf: BUNDLED_LINKERS.curve_as_of || BUNDLED_LINKERS.as_of }, equity: { source: 'builtIn', asOf: BUNDLED_EQUITY.date } });
  });
  it('the day\'s files: used, and the stamp names them and their dates', async () => {
    const m = await loadMarket({ folder: 'https://site/data/', fetchImpl: serve({ 'gilts.json': giltsFile(), 'equity.json': equityFile() }) });
    expect(realYieldForYear(30)).toBe(0.03);
    expect(activeEquity().date).toBe('2026-11-18');
    expect(m).toEqual({ gilts: { source: 'file', asOf: '2026-11-18' }, equity: { source: 'file', asOf: '2026-11-18' } });
  });
  it('a file older than the copy built in, or one that fails, leaves the copy built in', async () => {
    const old = { ...giltsFile(), generated_at: '2000-01-01T00:00:00Z' };
    await loadMarket({ folder: 'https://site/data/', fetchImpl: serve({ 'gilts.json': old }) });
    expect(activeLinkers()).toBe(BUNDLED_LINKERS);
    forgetMarket();
    const m = await loadMarket({ folder: 'https://site/data/', fetchImpl: async () => { throw new Error('offline'); } });
    expect(m.gilts.source).toBe('builtIn');
    expect(m.equity.source).toBe('builtIn');
  });
  it('asks once per folder in a context: a second call waits on the first', async () => {
    let n = 0;
    const f = async (url) => { n++; return { ok: false }; };
    await Promise.all([loadMarket({ folder: 'https://site/data/', fetchImpl: f }), loadMarket({ folder: 'https://site/data/', fetchImpl: f })]);
    expect(n).toBe(2);   // gilts.json and equity.json, once
  });
  it('one label for both views: the prices\' date and where they came from', () => {
    expect(marketLabel({ gilts: { source: 'file', asOf: '2026-11-12' } })).toBe('Gilts priced at the prices of 12 November 2026 (the day’s file).');
    expect(marketLabel({ gilts: { source: 'builtIn', asOf: '2026-11-12' } })).toMatch(/^Gilts priced at the prices of 12 November 2026 \(the copy built into the site/);
    expect(marketStamp().gilts.source).toBe('builtIn');
  });
});

/** Every source file the site ships (src and the full view's page), for the one-writer check below. */
function shipped(dir = 'src', out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) shipped(p, out);
    else if (/\.(js|jsx|mjs)$/.test(n)) out.push(p);
  }
  return out;
}

describe('one writer of what a run is priced on', () => {
  it('only the one market loader sets the gilts and the share index: no page-only override (the admin import is gone)', () => {
    const writers = [...shipped(), 'index.html'].filter((f) => !/src[\\/](reading[\\/]market\.js|services[\\/](LinkerUniverse|EquityIndex)\.js)$/.test(f))
      .filter((f) => /\b(setLinkersOverride|setLiveGilts|setLiveEquity|setEquityOverride)\s*\(/.test(readFileSync(f, 'utf8')));
    expect(writers).toEqual([]);
  });
});

describe('one reader of the gilt and share prices: the one market (fix round 1)', () => {
  it('only the one market\'s modules read the copy built into the site: no page or service reads its prices beside it', () => {
    const readers = [...shipped(), 'index.html'].filter((f) => !/src[\\/](services[\\/](LinkerUniverse|EquityIndex)\.js|data[\\/].*)$/.test(f))
      .filter((f) => /data\/(giltsSnapshot|equitySnapshot)\.js/.test(readFileSync(f, 'utf8')));
    // GiltName and HoldingsPaste read the list of gilts in issue only to know a gilt by its name or code, never its price
    expect(readers.sort()).toEqual(['src/services/GiltName.js', 'src/services/HoldingsPaste.js']);
    for (const f of readers) expect(readFileSync(f, 'utf8')).not.toMatch(/cleanPrice|indexRatio|InflationCurve|realCurve|\.level\b/);
  });
  it('what a held gilt pays and what a later pound is worth follow the day\'s file, as every run does', async () => {
    const { standInPays, inflationTo } = await import('../../src/services/TransitionPlanner.js');
    const { activeGiltsFile } = await import('../../src/services/LinkerUniverse.js');
    const built = activeGiltsFile();
    const il = built.gilts.find((g) => g.type !== 'conventional' && +g.indexRatio > 0 && g.isin);
    const line = { name: il.name, sedol: il.isin.slice(4, 11), units: 10000, value: 12000 };
    const before = standInPays(line);
    expect(before.amount).toBe(Math.round(10000 * il.indexRatio));
    const day = clone(built);
    day.generated_at = later(built.generated_at);
    day.gilts = day.gilts.map((g) => (g.isin === il.isin ? { ...g, indexRatio: il.indexRatio * 2 } : g));
    day.boeInflationCurve = [{ years: 1, yield: 0.07 }, { years: 30, yield: 0.07 }];
    await loadMarket({ folder: 'https://site/data/', fetchImpl: serve({ 'gilts.json': day }) });
    expect(standInPays(line).amount).toBe(Math.round(10000 * il.indexRatio * 2));
    expect(inflationTo(5)).toBe(0.07);
    forgetMarket();
    expect(standInPays(line).amount).toBe(before.amount);
  });
});

describe('the full view\'s page prices nothing before the one market is in (fix round 1)', () => {
  const page = readFileSync('index.html', 'utf8');
  const bodyOf = (head) => { const at = page.indexOf(head); expect(at, head).toBeGreaterThan(-1); const end = page.indexOf('\n    }', at); return page.slice(at, end); };
  it('the page\'s one plan builder refuses to price while the day\'s file loads (strategyPlanFor)', () => {
    expect(bodyOf('    function strategyPlanFor(')).toMatch(/if \(!window\._marketIn\) throw/);
    expect(page).toMatch(/window\._marketReady = loadMarket\([^\n]*window\._marketIn = true/);
  });
  it.each([
    'window.runTryStrategyUI = async function', 'window.runHistoricalUI = async function', 'window.runScenariosUI = async function',
    'window.runCompareStrategiesUI = async function', 'async function buildPlanDocumentNow(', 'async function ladderPositionForPlan(',
    'async function genericStrategyPageHtml(', 'async function fullGiltPageHtml(', 'async function floorToAgePageHtml(',
    'async function specStrategyPageHtml(', 'window.runHouseholdCheck = async function', 'window.runSurvivorUI = async function',
    'window.runCareUI = async function', 'async function planYearTables(', 'window.renderDecisionStrategyPanel = async function',
    'window.showStrategyPage = async function', 'window.runWhenStop = async function', 'async function oneTestFor(', 'async function cmpRun('
  ])('%s waits for the one market before it prices anything', (head) => {
    expect(bodyOf(head)).toMatch(/await window\._marketReady/);
  });
  it('what a way costs on the Stress settings and the ladder\'s trigger come from the plan\'s run (wayCostOf), never a sum of the boxes', () => {
    const costs = bodyOf('    window.refreshStrategyCosts = async function');
    expect(costs).toMatch(/wayCostOf\(r\)/);
    expect(costs).not.toMatch(/realYieldForYear|- 57\b|readAlloc\('ss'\)[^\n]*\n[^\n]*cost/);
    const trigger = bodyOf('    window.checkLadderTrigger = async function');
    expect(trigger).toMatch(/oneTestFor\(/);
    expect(trigger).toMatch(/sg\.glide|gl\.E0/);
    expect(trigger).not.toMatch(/for \(let k = 1; k <=/);
    expect(trigger).not.toMatch(/settings\.(equityMin|bondMin|cashTarget|baseSalary|spWeeklyAmount)/);
  });
});
