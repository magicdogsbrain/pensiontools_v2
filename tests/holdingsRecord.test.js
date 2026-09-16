/**
 * The holdings record (6.13.0): the ONE ledger of what the person holds — never the Stress tester's
 * `taggedFunds` (the funds a strategy is tested on). Pure module + the repository's get/save/duplicate.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { emptyHoldings, normaliseHoldings, normaliseLine, linesFromTaggedFunds, holdingsSummary, holdingsLines, normaliseWrapper, numOrNull, dateOrNull, HOLDINGS_VERSION } from '../src/services/HoldingsRecord.js';
import { proportions, pensionPotFromHoldings } from '../src/services/Holdings.js';

// A fake Firestore for the repository half: one active plan whose Stress settings carry a test list.
const store = vi.hoisted(() => ({ scenarios: [], writes: [], created: [], n: 0 }));
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => true, isLoggedIn: () => true }));
vi.mock('../src/firebase/FirestoreService.js', () => ({
  loadAllScenarios: async () => store.scenarios,
  loadScenario: async (id) => store.scenarios.find((s) => s.id === id) || null,
  saveScenario: async (id, data) => { store.writes.push({ id, data }); const s = store.scenarios.find((x) => x.id === id); if (s) Object.assign(s, data); },
  createScenario: async (data) => { const id = 'new' + (++store.n); store.created.push({ id, data }); store.scenarios.push({ ...data, id }); return id; },
  deleteScenarioDoc: async () => {},
  setActiveScenarioDoc: async () => {}
}));

/** Deep check: nothing `undefined` anywhere (Firestore refuses it). */
function hasUndefined(v) {
  if (v === undefined) return true;
  if (Array.isArray(v)) return v.some(hasUndefined);
  if (v && typeof v === 'object') return Object.values(v).some(hasUndefined);
  return false;
}

const FULL_LINE_KEYS = ['wrapper', 'ticker', 'name', 'sedol', 'units', 'value', 'ocf', 'contribution', 'subClass', 'kind', 'asOf'].sort();

describe('emptyHoldings / normaliseHoldings', () => {
  it('the empty record has every field, no lines, source none', () => {
    const e = emptyHoldings();
    expect(e).toEqual({ version: HOLDINGS_VERSION, updatedAt: null, source: 'none', offerDismissed: false, lines: [] });
  });
  it('garbage in → the empty record; an array in → a record of those lines', () => {
    expect(normaliseHoldings(null)).toEqual(emptyHoldings());
    expect(normaliseHoldings('x')).toEqual(emptyHoldings());
    expect(normaliseHoldings(42)).toEqual(emptyHoldings());
    const r = normaliseHoldings([{ ticker: 'vwrp', value: 100 }]);
    expect(r.lines.length).toBe(1);
    expect(r.source).toBe('typed');
  });
  it('sanitises every line: wrapper validated and upper-cased, ticker upper-cased, numbers coerced, null not undefined', () => {
    const r = normaliseHoldings({
      updatedAt: '2026-09-16T10:00:00.000Z', source: 'paste', offerDismissed: 'yes',
      lines: [
        { wrapper: 'isa', ticker: ' vwrp ', name: 'FTSE All-World', value: '£12,345.67', units: '100', ocf: 0.22 },
        { wrapper: 'pension', ticker: 'tr29', sedol: 'b3d4rd5', units: 36000, value: 39690, kind: 'gilt', subClass: 'indexLinked', asOf: '2026-09-01' },
        { wrapper: 'nonsense', name: 'Some fund', value: 'abc', kind: 'weird' },
        { wrapper: 'GIA', value: 500 },        // no identity → dropped
        { ticker: '', name: '   ', sedol: null }, // no identity → dropped
        null, 'junk'
      ]
    });
    expect(r.version).toBe(HOLDINGS_VERSION);
    expect(r.updatedAt).toBe('2026-09-16');
    expect(r.source).toBe('paste');
    expect(r.offerDismissed).toBe(false);   // only a real `true` counts
    expect(r.lines.length).toBe(3);
    expect(r.lines[0]).toEqual({ wrapper: 'ISA', ticker: 'VWRP', name: 'FTSE All-World', sedol: null, units: 100, value: 12345.67, ocf: 0.22, contribution: null, subClass: null, kind: null, asOf: null });
    expect(r.lines[1]).toMatchObject({ wrapper: 'SIPP', ticker: 'TR29', sedol: 'B3D4RD5', units: 36000, value: 39690, kind: 'gilt', subClass: 'indexLinked', asOf: '2026-09-01' });
    expect(r.lines[2]).toMatchObject({ wrapper: 'SIPP', name: 'Some fund', value: null, kind: null });
    for (const l of r.lines) expect(Object.keys(l).sort()).toEqual(FULL_LINE_KEYS);
    expect(hasUndefined(r)).toBe(false);
    expect(JSON.parse(JSON.stringify(r))).toEqual(r);
  });
  it('an unknown source becomes typed when there are lines and none when there are not', () => {
    expect(normaliseHoldings({ source: 'magic', lines: [{ ticker: 'A' }] }).source).toBe('typed');
    expect(normaliseHoldings({ source: 'magic', lines: [] }).source).toBe('none');
    expect(normaliseHoldings({ source: 'imported', lines: [] }).source).toBe('imported');
  });
  it('helpers: wrapper aliases, numbers, dates, lines-of', () => {
    expect(['SIPP', 'ISA', 'GIA', 'CASH']).toEqual([normaliseWrapper('Pension'), normaliseWrapper('lisa'), normaliseWrapper('Taxable'), normaliseWrapper('bank')]);
    expect(normaliseWrapper(undefined)).toBe('SIPP');
    expect(numOrNull('£1,000')).toBe(1000); expect(numOrNull('')).toBeNull(); expect(numOrNull(NaN)).toBeNull(); expect(numOrNull(0)).toBe(0);
    expect(dateOrNull('2026-1-2')).toBeNull(); expect(dateOrNull(null)).toBeNull(); expect(dateOrNull('2026-09-16')).toBe('2026-09-16');
    expect(holdingsLines([1, 2])).toEqual([1, 2]);
    expect(holdingsLines({ lines: [3] })).toEqual([3]);
    expect(holdingsLines(null)).toEqual([]);
    expect(normaliseLine({ ticker: 'X' }).wrapper).toBe('SIPP');
    expect(normaliseLine({})).toBeNull();
  });
});

describe('linesFromTaggedFunds — the one explicit import from the Stress tester\'s list', () => {
  it('maps wrapper, value, ocf, contribution and subClass; drops identity-less rows; stamps asOf', () => {
    const lines = linesFromTaggedFunds([
      { ticker: 'VLS80', value: 300000, wrapper: 'SIPP', ocf: 0.22, contribution: 1500 },
      { ticker: 'VWRP', value: 100000, wrapper: 'isa', ocf: 0.22, subClass: 'worldGrowth' },
      { name: 'Cash', value: 20000, wrapper: 'gia' },
      { value: 5, wrapper: 'SIPP' },
      undefined
    ], { asOf: '2026-09-16' });
    expect(lines.length).toBe(3);
    expect(lines[0]).toMatchObject({ wrapper: 'SIPP', ticker: 'VLS80', value: 300000, ocf: 0.22, contribution: 1500, asOf: '2026-09-16' });
    expect(lines[1]).toMatchObject({ wrapper: 'ISA', ticker: 'VWRP', subClass: 'worldGrowth' });
    expect(lines[2]).toMatchObject({ wrapper: 'GIA', name: 'Cash', ticker: null });
    expect(linesFromTaggedFunds(null)).toEqual([]);
    expect(hasUndefined(lines)).toBe(false);
  });
});

describe('holdingsSummary and the Holdings consumers accept the record', () => {
  const rec = normaliseHoldings({ lines: [
    { ticker: 'VLS80', value: 300000, wrapper: 'SIPP', ocf: 0.22, contribution: 1500 },
    { ticker: 'VWRP', value: 100000, wrapper: 'ISA', ocf: 0.22 },
    { ticker: 'CSH2', value: 20000, wrapper: 'SIPP', ocf: 0.10 },
    { name: 'Unknown thing', wrapper: 'GIA' }
  ] });
  it('count, total and by wrapper (a valueless line counts but adds nothing)', () => {
    expect(holdingsSummary(rec)).toEqual({ count: 4, total: 420000, byWrapper: { SIPP: 320000, ISA: 100000, GIA: 0, CASH: 0 } });
    expect(holdingsSummary(null)).toEqual({ count: 0, total: 0, byWrapper: { SIPP: 0, ISA: 0, GIA: 0, CASH: 0 } });
  });
  it('proportions() and pensionPotFromHoldings() read the record or its lines alike', () => {
    expect(proportions(rec).total).toBe(420000);
    expect(proportions(rec.lines).total).toBe(420000);
    expect(pensionPotFromHoldings(rec)).toBe(320000);
    expect(proportions(emptyHoldings()).total).toBe(0);
  });
});

describe('ScenarioRepository: getActiveHoldings / saveActiveHoldings / duplicateScenario', () => {
  let repo;
  beforeEach(async () => {
    repo = await import('../src/storage/ScenarioRepository.js');
    store.scenarios = [{
      id: 'a', isActive: true, enabledTools: ['stress', 'decision'], planDetails: { name: 'A', description: '' },
      decisionTool: { settings: {}, history: [], taxYears: {} },
      // The Stress tester's own list: a strategy input. It must NEVER be read back as holdings.
      stressTool: { settings: { taggedFunds: [{ ticker: 'VWRP', value: 999999, wrapper: 'SIPP' }] } },
      planDocument: { version: 2 }
    }];
    store.writes = []; store.created = [];
    repo.invalidateScenarioCache();
  });
  it('no record → the empty record, never the Stress taggedFunds', async () => {
    const h = await repo.getActiveHoldings();
    expect(h).toEqual(emptyHoldings());
  });
  it('save normalises, writes the root key, patches the cache; nothing undefined', async () => {
    const saved = await repo.saveActiveHoldings({ updatedAt: '2026-09-16', source: 'typed', lines: [{ ticker: 'vwrp', wrapper: 'sipp', value: '1,000' }, { wrapper: 'ISA', value: 5 }] });
    expect(saved.lines).toEqual([{ wrapper: 'SIPP', ticker: 'VWRP', name: null, sedol: null, units: null, value: 1000, ocf: null, contribution: null, subClass: null, kind: null, asOf: null }]);
    expect(store.writes.length).toBe(1);
    expect(store.writes[0].id).toBe('a');
    expect(Object.keys(store.writes[0].data)).toEqual(['holdings']);
    expect(hasUndefined(store.writes[0].data)).toBe(false);
    expect(await repo.getActiveHoldings()).toEqual(saved);
  });
  it('a bad saved record is normalised on read', async () => {
    store.scenarios[0].holdings = { lines: [{ ticker: 'tr29', wrapper: 'Pension', units: '36000' }, { value: 1 }], source: 'x' };
    const h = await repo.getActiveHoldings();
    expect(h.lines).toEqual([{ wrapper: 'SIPP', ticker: 'TR29', name: null, sedol: null, units: 36000, value: null, ocf: null, contribution: null, subClass: null, kind: null, asOf: null }]);
    expect(h.source).toBe('typed');
  });
  it('duplicateScenario carries the holdings record (same person) but not the plan document', async () => {
    store.scenarios[0].holdings = { updatedAt: '2026-09-16', source: 'paste', lines: [{ ticker: 'TR29', wrapper: 'SIPP', units: 36000, value: 39690 }] };
    const id = await repo.duplicateScenario('a', 'Copy');
    const c = store.created.find((x) => x.id === id).data;
    expect(c.planDetails.name).toBe('Copy');
    expect(c.holdings.lines[0]).toMatchObject({ ticker: 'TR29', units: 36000, value: 39690 });
    expect(c.holdings.source).toBe('paste');
    expect(c.planDocument).toBeUndefined();
    expect(c.stressTool.settings.taggedFunds[0].value).toBe(999999);   // the test list travels as a setting, unchanged
  });
});
