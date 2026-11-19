/**
 * The paste reader knows a gilt by its name and maturity as well as by its code (walks3 W7-H1). Fictional: Alex pastes his
 * holdings again as his platform lists them, names and values and no codes. The bundled list has, in 2028, the ordinary
 * 0 1/8% Treasury Gilt 2028 (TN28, pays 31 January 2028) and the 0 1/8% Index-linked Treasury Gilt 2028 (T28, 10 August).
 *   "Treasury 0.125% 2028"                  no index-linked words → the ordinary gilt, TN28 (it was read as T28, index-linked)
 *   "UK Gilt 0.125% 2028"                    the same, TN28
 *   "Treasury 0.125% Index-linked 2028"      T28;  "TREASURY 0.125% IL 2028" T28;  "Treasury 0.125% I/L 22/03/2029" T29
 *   "TR28"                                   its own code: 6% Treasury Stock 2028, ordinary
 *   "Treasury 4.5% 2028"                     TS28, ordinary
 *   "Treasury 2029"                          four ordinary gilts mature in 2029: no code is guessed (it was "T29", index-linked)
 * Pasting the same holdings again updates the lines held (Unilever plc is the Unilever line held, the 2028 gilt is TN28):
 * nothing is added twice, so the total stays £51,000 (it rose by the doubled lines).
 */
import { describe, it, expect } from 'vitest';
import { parsePaste, matchRows, applyPaste } from '../src/services/HoldingsPaste.js';
import { holdingsLines } from '../src/services/HoldingsRecord.js';

const read = (name) => matchRows([{ line: 1, name, ticker: '', sedol: null, units: 100, value: 100 }])[0].match;

describe('a gilt known by its name', () => {
  it('an ordinary gilt is never read as index-linked', () => {
    expect([read('Treasury 0.125% 2028').ticker, read('Treasury 0.125% 2028').subClass]).toEqual(['TN28', 'longGilts']);
    expect(read('UK Gilt 0.125% 2028').ticker).toBe('TN28');
    expect(read('Treasury 4.5% 2028').ticker).toBe('TS28');
  });
  it('an index-linked name is index-linked, whichever way the platform writes it', () => {
    for (const n of ['Treasury 0.125% Index-linked 2028', 'TREASURY 0.125% IL 2028', 'Treasury 0.125% I/L 2028']) {
      expect([n, read(n).ticker, read(n).subClass]).toEqual([n, 'T28', 'indexLinked']);
    }
    expect(read('Treasury 0.125% I/L 22/03/2029').ticker).toBe('T29');
  });
  it('a code in the name is the gilt\'s own', () => {
    expect([read('TR28').kind, read('TR28').ticker, read('TR28').subClass]).toEqual(['gilt', 'TR28', 'longGilts']);
    expect([read('Gilt TR31').ticker, read('Gilt TR31').subClass]).toEqual(['TR31', 'indexLinked']);
  });
  it('a name that fits more than one gilt is a gilt with no code guessed', () => {
    const m = read('Treasury 2029');
    expect(m.kind).toBe('gilt');
    expect(m.ticker).toBe('');                 // was T29, an index-linked gilt's code
    expect(m.subClass).toBe('longGilts');
  });
  it('"April" in a name is not "IL"', () => {
    expect(read('Treasury 4.5% 7 June 2028').subClass).toBe('longGilts');
    expect(read('Treasury Gilt April 2029 4%').subClass).toBe('longGilts');
  });
});

describe('a cash line is read', () => {
  it('with its amount in the value column or, alone, in the units column', () => {
    const p = parsePaste('Investment\tUnits\tValue\nCash\t\t£25,000.00\nCash\t25000\t\n');
    expect(p.rows.map((r) => r.value)).toEqual([25000, 25000]);
    expect(matchRows(p.rows).every((r) => r.match.kind === 'cash')).toBe(true);
  });
});

describe('pasting the same holdings again updates them', () => {
  it('nothing is added twice', () => {
    const held = { lines: [
      { ticker: 'TN28', name: '0 1/8% Treasury Gilt 2028', wrapper: 'SIPP', value: 29000, units: 30459, kind: 'gilt', subClass: 'longGilts' },
      { ticker: 'ULVR', name: 'Unilever', wrapper: 'SIPP', value: 22000, units: 500, subClass: 'ukEquity' }
    ] };
    const rows = parsePaste('Investment\tUnits\tValue\nTreasury 0.125% 2028\t30459\t£29,100.00\nUnilever plc\t500\t£21,900.00\n').rows;
    const r = applyPaste(held, rows, {}, 'SIPP', { today: '2026-11-18' });
    expect(r.added).toEqual([]);
    const lines = holdingsLines(r.record);
    expect(lines.length).toBe(2);
    expect(lines.reduce((t, l) => t + l.value, 0)).toBe(51000);   // 29,100 + 21,900
    expect(lines.find((l) => l.ticker === 'ULVR').value).toBe(21900);
  });
});
