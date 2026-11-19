/**
 * The one market (lead4.md R5; src/reading/market.js): one loader for both views' pages and workers, the day's file when it
 * loads and is no older than the copy built in, else the copy built in; a stamp that says which and its date; one label.
 */
import { describe, it, expect, afterEach } from 'vitest';
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
