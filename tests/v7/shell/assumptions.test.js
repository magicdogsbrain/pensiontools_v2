/**
 * "Assumptions and data" (research/v7/road-to-7.md step 11b, the ledger's strat.assumptions): the page #/assumptions, linked
 * from the foot of every page. The facts (services/AssumptionsFacts.js) are the planner's own tables read as its page reads
 * them — the shares' series and what it averages, the price series, how the futures are made, the cuts, the charges, the gilt
 * data's provenance and today's curve, the ladder's costs, the tax bands; the effect loads them lazily on the route, once per
 * page life, never writing anywhere; the reducer keeps them as plain data; the screen draws every section with no banned word
 * and no unfilled slot, says "opening" until they arrive and "could not be read" when they cannot.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { assumptionsFacts, CURVE_YEARS, WORLD_ADJUSTMENT_POINTS } from '../../../src/services/AssumptionsFacts.js';
import { startAssumptions } from '../../../src/v7/effects/assumptions.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse, href } from '../../../src/v7/router/routes.js';
import { assumptionsView } from '../../../src/v7/state/select.js';
import { EQUITY_RETURNS, INFLATION, SIMULATION_DEFAULTS, DRAWDOWN_DEFAULTS, TAX_DEFAULTS, VERSION } from '../../../src/constants.js';
import { ENGINE_VERSION } from '../../../src/strategies/version.js';
import { realYieldForYear, dataProvenance } from '../../../src/services/LinkerUniverse.js';
import { DEFAULT_CHARGES_PCT } from '../../../src/services/Charges.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { ASSUMPTIONS } from '../../../src/v7/copy/assumptions.js';
import { COMMON } from '../../../src/v7/copy/common.js';

const TODAY = '2026-10-02';
const NOW_MS = Date.parse('2026-10-02T14:03:00.000Z');
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const geo = (vals) => Math.pow(vals.reduce((a, v) => a * (1 + v), 1), 1 / vals.length) - 1;

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
const stateOn = (hash = '#/assumptions') => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.ROUTE_SET, route: parse(hash) });

describe('the facts: the planner\'s own tables, read as its page reads them', () => {
  const F = assumptionsFacts(NOW_MS);

  it('plain data; the versions; the shares\' series from the same table with its geometric means, worst and best years; the world adjustment', () => {
    expect(JSON.parse(JSON.stringify(F))).toEqual(F);
    expect(F.app).toBe(VERSION);
    expect(F.engine).toBe(ENGINE_VERSION);
    const yrs = Object.keys(EQUITY_RETURNS).map(Number).sort((a, b) => a - b);
    expect(F.shares.from).toBe(yrs[0]);
    expect(F.shares.to).toBe(yrs[yrs.length - 1]);
    expect(F.shares.years).toBe(yrs.length);
    expect(F.shares.nominal).toBeCloseTo(geo(yrs.map((y) => EQUITY_RETURNS[y])), 12);
    expect(F.shares.real).toBeCloseTo(geo(yrs.map((y) => (1 + EQUITY_RETURNS[y]) / (1 + (INFLATION[y] ?? 0.025)) - 1)), 12);
    expect(F.shares.worst).toBe(Math.min(...yrs.map((y) => EQUITY_RETURNS[y])));
    expect(F.shares.best).toBe(Math.max(...yrs.map((y) => EQUITY_RETURNS[y])));
    expect(EQUITY_RETURNS[F.shares.worstYear]).toBe(F.shares.worst);
    expect(F.shares.adjustment).toBe(WORLD_ADJUSTMENT_POINTS);
    expect(F.prices.mean).toBeCloseTo(geo(yrs.map((y) => INFLATION[y] ?? 0.025)), 12);
    expect(F.prices.monthByMonth).toBe(0.04);
  });

  it('how the futures are made, the cuts, the charges and the tax bands are the engine\'s own constants; the gilt data\'s provenance and today\'s curve are LinkerUniverse\'s', () => {
    expect(F.futures).toEqual({ runs: SIMULATION_DEFAULTS.MONTE_CARLO_RUNS, blockYears: 5 });
    expect(F.cuts).toEqual({ mult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER, months: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT, buffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER });
    expect(F.charges).toBe(DEFAULT_CHARGES_PCT);
    expect(F.tax).toEqual({ pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE, brl: TAX_DEFAULTS.BASIC_RATE_LIMIT, hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT, taper: TAX_DEFAULTS.PA_TAPER_THRESHOLD });
    expect(F.ladder.dealFee).toBe(20);
    const p = dataProvenance(NOW_MS);
    expect(F.gilts).toEqual({ generated: String(p.generated_at || '').slice(0, 10) || null, asOf: p.as_of || null, source: p.source || '', stale: !!p.stale, hasCurve: !!p.hasCurve, curveAsOf: p.curve_as_of || null, curvePoints: +p.curvePoints || 0 });
    expect(F.curve.map((c) => c.years)).toEqual([...CURVE_YEARS]);
    for (const c of F.curve) expect(c.real).toBeCloseTo(realYieldForYear(c.years), 12);
  });
});

describe('the effect, the reducer, the view and the page', () => {
  const FAKE = { app: '6.45.0', engine: '6.37.0', shares: { from: 1928, to: 2024, years: 97, nominal: 0.0812, real: 0.0501, worstYear: 1931, worst: -0.45, bestYear: 1954, best: 0.52, adjustment: 1.5 }, prices: { mean: 0.0301, monthByMonth: 0.04 }, futures: { runs: 1000, blockYears: 5 }, cuts: { mult: 0.8, months: 3, buffer: 15000 }, charges: 0.5, gilts: { generated: '2026-10-01', asOf: '2026-10-01', source: 'Delayed closes.', stale: false, hasCurve: true, curveAsOf: '2026-09-30', curvePoints: 40 }, curve: [{ years: 1, real: 0.002, nominal: 0.041 }, { years: 10, real: 0.011, nominal: 0.045 }], ladder: { dealFee: 20, spreadShort: 0.0015, spreadMid: 0.0025, spreadLong: 0.004 }, tax: { pa: 12570, brl: 50270, hrl: 125140, taper: 100000 }, index: { symbol: 'S&P 500 (price index)', date: '2026-10-01', level: 7690.73, source: 'A snapshot.', stale: false } };

  it('the facts are loaded lazily when the page is opened, once per page life, never before; the reducer keeps them as plain data; nothing is written', async () => {
    let loads = 0;
    const load = async () => { loads += 1; return () => FAKE; };
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    const stop = startAssumptions(store, { load, now: () => NOW_MS });
    await tick();
    expect(loads, 'not on the front door').toBe(0);
    expect(store.getState().ui.assumptions).toBe(null);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/assumptions') });
    await tick();
    expect(loads).toBe(1);
    expect(store.getState().ui.assumptions).toEqual({ facts: FAKE, failed: false });
    expect(assumptionsView(store.getState())).toEqual({ facts: FAKE, failed: false, opening: false });
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/') });
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/assumptions') });
    await tick();
    expect(loads, 'kept for the page life').toBe(1);
    stop();
    // a load that fails: said, and never thrown
    const bad = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    bad.dispatch({ type: A.ROUTE_SET, route: parse('#/assumptions') });
    const stop2 = startAssumptions(bad, { load: async () => { throw new Error('no'); }, now: () => NOW_MS });
    await tick();
    expect(bad.getState().ui.assumptions).toEqual({ facts: null, failed: true });
    expect(assumptionsView(bad.getState()).failed).toBe(true);
    stop2();
    expect(reduce(stateOn(), { type: A.ASSUMPTIONS_SET, facts: 'nonsense' }).ui.assumptions).toEqual({ facts: null, failed: true });
  });

  it('the page: opening, then every section with its rows filled from the facts, the first open; no banned word, no unfilled slot; the foot of every page links to it', () => {
    const opening = draw(stateOn());
    expect(opening.root.querySelector('main').getAttribute('data-screen')).toBe('assumptions');
    expect(opening.root.querySelector('[data-testid="assumptions.opening"]')).not.toBe(null);
    expect(opening.root.querySelector('[data-testid="nav.assumptions"]').getAttribute('href')).toBe(href.assumptions());
    expect(opening.root.querySelector('[data-testid="nav.assumptions"]').textContent).toBe(COMMON.footer.assumptions);
    const { root, text } = draw(reduce(stateOn(), { type: A.ASSUMPTIONS_SET, facts: FAKE }));
    expect(root.querySelector('[data-testid="assumptions.opening"]')).toBe(null);
    expect(root.querySelector('[data-testid="assumptions.versions"]').textContent).toBe('App version 6.45.0, engine version 6.37.0.');
    for (const id of ['shares', 'prices', 'futures', 'pots', 'gilts', 'tax', 'limits']) expect(root.querySelector(`[data-testid="assumptions.${id}"]`), id).not.toBe(null);
    expect(root.querySelector('[data-testid="assumptions.shares"]').hasAttribute('open')).toBe(true);
    expect(root.querySelector('[data-testid="assumptions.prices"]').hasAttribute('open')).toBe(false);
    expect(root.querySelector('[data-row="shares.series"] .assump-value').textContent).toBe('Calendar-year S&P 500 total return (dividends reinvested), 1928–2024 (97 years)');
    expect(root.querySelector('[data-row="shares.result"] .assump-value').textContent).toBe('8.12% a year before prices · 5.01% a year after prices');
    expect(root.querySelector('[data-row="shares.result"] .assump-note').textContent).toBe('The worst year was 1931 (-45.0%), the best 1954 (52.0%).');
    expect(root.querySelector('[data-row="futures.oneTest"] .assump-value').textContent).toBe('1,000 futures, each stitched from 5-year stretches of real history, plus every real window since 1871');
    expect(root.querySelector('[data-row="pots.cuts"] .assump-value').textContent).toBe('Income × 0.8 after 3 months in a row with shares, bonds and the gold and trend pot all below their floors; back to the full figure after a £15,000 recovery');
    expect(root.querySelector('[data-row="gilts.inIssue"] .assump-value').textContent).toBe('The Debt Management Office’s list, generated 2026-10-01');
    expect(root.querySelector('[data-row="gilts.curve"] .assump-value').textContent).toBe('Bank of England real spot curve as of 2026-09-30 (40 points)');
    expect(root.querySelector('[data-row="gilts.today"] .assump-value').textContent).toBe('1y 0.20% · 10y 1.10%');
    expect(root.querySelector('[data-row="gilts.index"] .assump-value').textContent).toBe('S&P 500 (price index) at 7,691 on 2026-10-01');
    expect(root.querySelector('[data-row="tax.bands"] .assump-value').textContent).toBe('Personal allowance £12,570, basic-rate limit £50,270, higher-rate limit £125,140; the allowance tapers above £100,000');
    expect(root.querySelectorAll('[data-testid="assumptions.limits"] li').length).toBe(ASSUMPTIONS.sections.limits.items.length);
    // the code's address as words: the preview links nowhere outside itself (e2e/crawl.spec.js)
    expect(root.querySelector('[data-testid="assumptions.source"]').textContent).toContain(ASSUMPTIONS.repo);
    expect(root.querySelector('[data-testid="assumptions.source"] a')).toBe(null);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(bannedHits(text, ['all', 'planner'])).toEqual([]);
    // no curve, no gilt list, no index: the fallbacks in words
    const bare = draw(reduce(stateOn(), { type: A.ASSUMPTIONS_SET, facts: { ...FAKE, gilts: null, curve: [{ years: 1, real: null, nominal: null }], index: null } }));
    expect(bare.root.querySelector('[data-row="gilts.inIssue"] .assump-value').textContent).toBe('Not loaded');
    expect(bare.root.querySelector('[data-row="gilts.curve"] .assump-value').textContent).toBe('A flat 2.3% a year, the fallback');
    expect(bare.root.querySelector('[data-row="gilts.index"]')).toBe(null);
    const failed = draw(reduce(stateOn(), { type: A.ASSUMPTIONS_SET, facts: null }));
    expect(failed.root.querySelector('[data-testid="assumptions.failed"]').textContent).toBe(ASSUMPTIONS.failed);
  });
});
