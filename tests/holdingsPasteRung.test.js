/**
 * 7.11.1 — a pasted row whose own SEDOL names a conventional gilt never takes an index-linked rung's code or SEDOL. The year
 * match ("Treasury 2029" read as the plan's 2029 linker) gave a conventional gilt the rung's identity, overwrote its own SEDOL,
 * and folded it into the rung's line: the rung then read as held above its target while the person held a few units of it.
 * A row's own SEDOL now says which gilt it is; a year alone matches a rung only when the row's own name says index-linked,
 * and it keeps what the platform called it. Fictional rows; real gilts from the bundled list.
 */
import { describe, it, expect } from 'vitest';
import { matchRows, mergeLedger } from '../src/services/HoldingsPaste.js';

describe('a pasted conventional gilt never takes an index-linked rung\'s identity', () => {
  const orders = [{ tidm: 'T29', name: '0 1/8% Index-linked Treasury Gilt 2029', sedol: 'B3Y1JG8', matures: '2029-03-22' }];

  it('"Treasury 2029" with a conventional gilt\'s SEDOL is never the 2029 rung, and keeps its own SEDOL', () => {
    const [m] = matchRows([{ name: 'Treasury 2029', sedol: 'BJMHB53', ticker: null, units: 30000, value: 26763 }], { orders });
    expect(m.match.ticker).not.toBe('T29');
    expect(m.match.sedol || m.sedol).toBe('BJMHB53');
    const { ledger } = mergeLedger([{ wrapper: 'SIPP', ticker: 'T29', name: orders[0].name, sedol: 'B3Y1JG8', units: 300, value: 520, kind: 'gilt' }], [m]);
    expect(ledger.filter((l) => l.ticker === 'T29').length).toBe(1);
    expect(ledger.find((l) => l.ticker === 'T29').units).toBe(300);
  });

  it('a code that is the rung\'s, on a row whose own SEDOL names another gilt, is not the rung', () => {
    const [m] = matchRows([{ name: '0 7/8% Treasury 2029', sedol: 'BJMHB53', ticker: 'T29', units: 30000, value: 26763 }], { orders });
    expect(m.match.ticker).not.toBe('T29');
  });

  it('by its year only when its own name says index-linked, keeping what the platform called it', () => {
    const [plain] = matchRows([{ name: 'Treasury 2029', sedol: null, ticker: null, units: 300, value: 520 }], { orders });
    expect(plain.match.ticker === 'T29' && plain.match.confidence === 'year').toBe(false);
    const [il] = matchRows([{ name: 'Treasury I/L 2029', sedol: null, ticker: null, units: 300, value: 520 }], { orders });
    expect(il.match).toMatchObject({ kind: 'gilt', ticker: 'T29', confidence: 'year', name: 'Treasury I/L 2029' });
    // its SEDOL or code still names the rung outright
    const [bySedol] = matchRows([{ name: 'Some gilt', sedol: 'B3Y1JG8', ticker: null, units: 300, value: 520 }], { orders });
    expect(bySedol.match).toMatchObject({ ticker: 'T29', confidence: 'sedol', sedol: 'B3Y1JG8' });
  });
});

