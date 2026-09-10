import { describe, it, expect } from 'vitest';
import { splitRows, parseMoney, detectColumns, giltFromName, parsePaste, matchRows, mergeLedger } from '../src/services/HoldingsPaste.js';

// Shapes people actually paste. Names and numbers are illustrative.
const AJBELL_CSV = `Investment,Units,Price,Value,Cost,Change
"Treasury 0.125% I/L 22/03/2029",36000,110.25,£39,690.00,£38,100.00,+4.2%
"Treasury 0.125% I/L 22/03/2030",35000,108.90,£38,584.00,£37,900.00,+1.8%
"Vanguard FTSE All-World UCITS ETF",500,105.20,£52,600.00,£40,000.00,+31.5%
"Lyxor Smart Overnight Return UCITS ETF",1750,100.78,£176,376.00,£175,000.00,+0.8%
Total,,,£307,250.00,,`;

const HL_TABLE = `Stock	Units held	Price (pence)	Value (£)	Cost (£)	Gain/loss (£)
Vanguard LifeStrategy 80% Equity Accumulation	1,234.56	28,450.00	351,258.55	300,000.00	51,258.55
iShares Core FTSE 100 UCITS ETF	2,000	780.50	15,610.00	14,000.00	1,610.00`;

const II_TAB = `Name	SEDOL	Quantity	Market value
Vanguard FTSE All-World UCITS ETF GBP	BK5BQT8	310	£32,620
Treasury 1¼% Index-Linked Gilt 2054	BPSNBG8	32300	£35,474`;

const WEB_SPACES = `Vanguard FTSE All-World UCITS ETF          VWRP        500     £52,600.00
iShares Core Global Aggregate Bond          AGBP        1,000   £4,950.00`;

const orders = [
  { name: 'Index-linked Treasury 0⅛% 2029', tidm: 'TR29', sedol: 'B3D4RD5', matures: '2029-03-22', nominal: 36000, cost: 39690 },
  { name: 'Index-linked Treasury 0⅛% 2030', tidm: 'TR30', sedol: 'B4PTCY7', matures: '2030-03-22', nominal: 35000, cost: 38584 },
  { name: 'Index-linked Treasury 1¼% 2054', tidm: 'TG54', sedol: 'BPSNBG8', matures: '2054-11-22', nominal: 32300, cost: 35474 }
];

describe('splitting and money', () => {
  it('picks the separator that gives consistent columns', () => {
    expect(splitRows(AJBELL_CSV).sep).toBe('comma');
    expect(splitRows(HL_TABLE).sep).toBe('tab');
    expect(splitRows(WEB_SPACES).sep).toBe('spaces');
    expect(splitRows('').rows).toEqual([]);
  });
  it('parses pounds, pence and thousands', () => {
    expect(parseMoney('£39,690.00')).toBe(39690);
    expect(parseMoney('1,234.56')).toBe(1234.56);
    expect(parseMoney('28,450.00p')).toBe(284.5);
    expect(parseMoney('abc')).toBeNull();
  });
});

describe('column detection', () => {
  it('reads a header row', () => {
    const { map, hasHeader } = detectColumns(splitRows(AJBELL_CSV).rows);
    expect(hasHeader).toBe(true);
    expect(map).toMatchObject({ name: 0, units: 1, price: 2, value: 3, cost: 4 });
  });
  it('infers columns from cell shapes without a header', () => {
    const { map, hasHeader } = detectColumns(splitRows(WEB_SPACES).rows);
    expect(hasHeader).toBe(false);
    expect(map.name).toBe(0);
    expect(map.ticker).toBe(1);
    expect(map.value).toBe(3);
    expect(map.units).toBe(2);
  });
});

describe('parsePaste', () => {
  it('AJ Bell CSV: names, units, values; the Total row dropped', () => {
    const p = parsePaste(AJBELL_CSV);
    expect(p.rows.length).toBe(4);
    expect(p.rows[0]).toMatchObject({ name: 'Treasury 0.125% I/L 22/03/2029', units: 36000, value: 39690 });
    expect(p.rows[3].value).toBe(176376);
    expect(p.warnings).toEqual([]);
  });
  it('HL table with pence prices and thousands in units', () => {
    const p = parsePaste(HL_TABLE);
    expect(p.rows[0]).toMatchObject({ units: 1234.56, value: 351259 });
  });
  it('II table with SEDOLs', () => {
    const p = parsePaste(II_TAB);
    expect(p.rows[0].sedol).toBe('BK5BQT8');
    expect(p.rows[1]).toMatchObject({ sedol: 'BPSNBG8', units: 32300, value: 35474 });
  });
  it('a web copy with runs of spaces and tickers', () => {
    const p = parsePaste(WEB_SPACES);
    expect(p.rows[0]).toMatchObject({ ticker: 'VWRP', units: 500, value: 52600 });
    expect(p.rows[1].ticker).toBe('AGBP');
  });
  it('junk gives a warning, not a crash', () => {
    expect(parsePaste('hello').warnings.length).toBeGreaterThan(0);
    expect(parsePaste(null).rows).toEqual([]);
  });
  it('giltFromName reads maturity year and index-linked', () => {
    expect(giltFromName('Treasury 0.125% I/L 22/03/2030')).toEqual({ year: 2030, il: true });
    expect(giltFromName('Treasury 1¼% Index-Linked Gilt 2054')).toEqual({ year: 2054, il: true });
    expect(giltFromName('Vanguard FTSE All-World')).toBeNull();
  });
});

describe('matching and merging', () => {
  it('gilts match the order sheet by SEDOL, code or maturity year; funds match the catalogue', () => {
    const m = matchRows(parsePaste(AJBELL_CSV).rows, { orders, wrapper: 'SIPP' });
    expect(m[0].match).toMatchObject({ kind: 'gilt', ticker: 'TR29', confidence: 'year' });
    expect(m[1].match.ticker).toBe('TR30');
    expect(m[2].match).toMatchObject({ kind: 'catalogue', ticker: 'VWRP', confidence: 'name' });
    expect(m[3].match.kind).toBe('cash');
    const ii = matchRows(parsePaste(II_TAB).rows, { orders });
    expect(ii[1].match).toMatchObject({ kind: 'gilt', ticker: 'TG54', confidence: 'sedol' });
  });
  it('ticker matches beat name matches', () => {
    const m = matchRows(parsePaste(WEB_SPACES).rows, { orders: [] });
    expect(m[0].match).toMatchObject({ kind: 'catalogue', ticker: 'VWRP', confidence: 'ticker' });
  });
  it('merge updates known lines, adds new ones, and lists lines not seen', () => {
    const ledger = [{ ticker: 'VWRP', value: 40000, wrapper: 'SIPP', ocf: 0.22 }, { ticker: 'IGLT', value: 9000, wrapper: 'SIPP' }, { ticker: 'VWRP', value: 60000, wrapper: 'ISA' }];
    const m = matchRows(parsePaste(AJBELL_CSV).rows, { orders, wrapper: 'SIPP' });
    const r = mergeLedger(ledger, m, { wrapper: 'SIPP' });
    const vwrp = r.ledger.find((l) => l.ticker === 'VWRP' && l.wrapper === 'SIPP');
    expect(vwrp.value).toBe(52600);
    expect(vwrp.ocf).toBe(0.22);            // kept
    expect(vwrp.units).toBe(500);
    expect(r.updated.length).toBe(1);
    expect(r.added.map((a) => a.ticker)).toEqual(['TR29', 'TR30', 'CSH2']);
    expect(r.added[0]).toMatchObject({ kind: 'gilt', units: 36000, sedol: 'B3D4RD5', subClass: 'indexLinked' });
    expect(r.unseen.map((u) => u.ticker)).toEqual(['IGLT']);
    expect(r.ledger.find((l) => l.wrapper === 'ISA').value).toBe(60000);   // other wrappers untouched
  });
});
