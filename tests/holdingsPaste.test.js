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
    // Firestore refuses `undefined` — no merged line may carry one (a whole settings save failed on this, 6.10.5)
    for (const l of r.ledger) for (const [k, v] of Object.entries(l)) expect(v, k).not.toBeUndefined();
  });
});

describe('a stray code in the ticker column cannot out-vote the fund\'s own name (6.12.5)', () => {
  it('"CGT" beside an index-linked gilt is not Capital Gearing Trust; "PNL" beside Vanguard FTSE All-World is not Personal Assets', async () => {
    const { matchRows } = await import('../src/services/HoldingsPaste.js');
    const m = matchRows([
      { ticker: 'CGT', name: '0 1/8% Index-linked Treasury Gilt 2031', value: 20000 },
      { ticker: 'PNL', name: 'Vanguard FTSE All-World UCITS ETF Acc', value: 10000 },
      { ticker: 'CGT', name: 'Capital Gearing Trust', value: 5000 }
    ]);
    expect(m[0].match.kind).toBe('gilt');
    expect(m[1].match.ticker).not.toBe('PNL');
    expect(m[1].match.name).toMatch(/All-World/);
    expect(m[2].match.ticker).toBe('CGT');
  });
});

// Every pasted line counts (research/v7/v6-usability-audit.md §2.9). The audit's case: £282,550 pasted, the pot read
// £97,300 — the lines the tool could not recognise dropped out of the counts without a word. Now a line it cannot
// recognise asks "What is this?" and the summary says what was left out and why.
import { CATEGORY_CHOICES, categorise, needsCategory, pasteSummary } from '../src/services/HoldingsPaste.js';

const AUDIT_PASTE = `Investment,Units,Value
Vanguard FTSE All-World UCITS ETF,500,£52,600.00
iShares Core Global Aggregate Bond,1000,£4,950.00
Lyxor Smart Overnight Return UCITS ETF,394,£39,750.00
Acme Workplace Growth Fund Series 4,12000,£120,000.00
Zenith Managed Balanced Portfolio,8000,£60,250.00
Northstar Cautious Fund,1000,£5,000.00
Total,,£282,550.00`;

describe('every pasted line counts (6.23)', () => {
  it('parsePaste lists what it left out and why, not just a warning string', () => {
    const p = parsePaste(AJBELL_CSV);
    expect(p.leftOut).toEqual([{ line: 5, text: 'Total', why: 'a total line, not a holding' }]);
    const q = parsePaste('Investment,Units,Value\nSome fund with nothing else,,\nVanguard FTSE All-World UCITS ETF,500,£52,600.00');
    expect(q.rows.length).toBe(1);
    expect(q.leftOut).toEqual([{ line: 1, text: 'Some fund with nothing else', why: 'no units or value found' }]);
  });
  it('the five answers to "What is this?"', () => {
    expect(CATEGORY_CHOICES.map((c) => c.key)).toEqual(['shares', 'bonds', 'cash', 'diversifiers', 'unknown']);
    expect(CATEGORY_CHOICES.map((c) => c.label)).toEqual(['Shares', 'Bonds', 'Cash', 'Gold and trend', 'Don\'t know']);
  });
  it('categorise puts a line in the bucket the person chose; "don\'t know" keeps it on the record, unplaced', () => {
    expect(categorise({ name: 'Acme Growth' }, 'shares')).toMatchObject({ subClass: 'worldGrowth' });
    expect(categorise({ name: 'Acme Bond' }, 'bonds')).toMatchObject({ subClass: 'globalAggHedged' });
    expect(categorise({ name: 'Acme Cash' }, 'cash')).toMatchObject({ subClass: 'moneyMarket', kind: 'cash' });
    expect(categorise({ name: 'Acme Gold' }, 'diversifiers')).toMatchObject({ subClass: 'gold' });
    const u = categorise({ name: 'Acme ?', subClass: 'worldGrowth' }, 'unknown');
    expect(u.subClass).toBeNull();
    expect(u.name).toBe('Acme ?');
    for (const v of Object.values(u)) expect(v).not.toBeUndefined();
  });
  it('needsCategory: a line the tool cannot place; a catalogue fund, a gilt code, a cash line or a bank wrapper is placed already', () => {
    expect(needsCategory({ name: 'Acme Workplace Growth Fund', ticker: null, subClass: null, kind: null, wrapper: 'SIPP' })).toBe(true);
    expect(needsCategory({ ticker: 'VWRP', wrapper: 'SIPP' })).toBe(false);
    expect(needsCategory({ ticker: 'TR29', wrapper: 'SIPP' })).toBe(false);
    expect(needsCategory({ name: 'x', kind: 'cash', wrapper: 'SIPP' })).toBe(false);
    expect(needsCategory({ name: 'Bank savings', wrapper: 'CASH' })).toBe(false);
    expect(needsCategory({ name: 'x', subClass: 'gold', wrapper: 'SIPP' })).toBe(false);
  });
  it('the audit\'s paste: six lines, £282,550; three recognised, £97,300; the other £185,250 is said, not dropped', () => {
    const parsed = parsePaste(AUDIT_PASTE);
    const matched = matchRows(parsed.rows, { orders: [], wrapper: 'SIPP' });
    const s = pasteSummary({ parsed, matched });
    expect(s.pastedCount).toBe(6);
    expect(s.pastedTotal).toBe(282550);
    expect(s.recognisedCount).toBe(3);
    expect(s.recognisedTotal).toBe(97300);
    expect(s.unrecognised.map((u) => u.name)).toEqual(['Acme Workplace Growth Fund Series 4', 'Zenith Managed Balanced Portfolio', 'Northstar Cautious Fund']);
    expect(s.unrecognisedTotal).toBe(185250);
    expect(s.text).toContain('6 lines read, £282,550 in all.');
    expect(s.text).toContain('3 lines (£185,250) are not recognised — say what each is under "What is this?" and they count.');
    expect(s.text).toContain('Left out: line 7 "Total" (a total line, not a holding).');
  });
  it('once each line has an answer the summary says so, and the ledger carries the choice', () => {
    const parsed = parsePaste(AUDIT_PASTE);
    const matched = matchRows(parsed.rows, { orders: [], wrapper: 'SIPP' });
    matched[3] = categorise(matched[3], 'shares'); matched[4] = categorise(matched[4], 'bonds'); matched[5] = categorise(matched[5], 'unknown');
    const s = pasteSummary({ parsed, matched });
    expect(s.recognisedTotal).toBe(97300 + 120000 + 60250);
    expect(s.unrecognisedTotal).toBe(0);   // every line has an answer now
    expect(s.unknownTotal).toBe(5000);
    expect(s.text).toContain('1 line (£5,000) is marked "don\'t know": it stays on your record and counts in the total, but not in the mix until you say what it is.');
    const merged = mergeLedger([], matched, { wrapper: 'SIPP' });
    expect(merged.ledger.length).toBe(6);
    expect(merged.ledger[3]).toMatchObject({ name: 'Acme Workplace Growth Fund Series 4', subClass: 'worldGrowth', value: 120000 });
    expect(merged.ledger[4]).toMatchObject({ subClass: 'globalAggHedged' });
    expect(merged.ledger[5].subClass).toBeNull();
    for (const l of merged.ledger) for (const [k, v] of Object.entries(l)) expect(v, k).not.toBeUndefined();
  });
});
