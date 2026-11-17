/**
 * 7.12.0 round 3 (walker 5, decision 8) — the order sheet's units for a rung part bought are what is still to buy, the Buy
 * table's own figure. Before, the sheet said "Units to order 17,500 … part bought" beside a Buy table of 2,800 for the same
 * gilt: ordering from the sheet would have bought the units already held a second time. Alex's plan read as Moving
 * (fictional, _alex.js): the 2031 linker is held at 2,000 of the plan's 15,500 and the 2041 linker at 500 of 7,800.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { moveOf } from '../../../src/answers/plan/move.js';
import { entryOf, stateWith } from './_plans.js';
import { ALEX_TODAY as TODAY, alexRaw, asMoving, PART } from './_alex.js';

const plan = entryOf(asMoving(alexRaw({ expected: [] })), TODAY).plan;
const flat = (t) => t.replace(/\s+/g, ' ').trim();

describe('a rung part bought on the order sheet', () => {
  // 15,500 − 2,000 = 13,500 still to buy of the 2031 linker; 7,800 − 500 = 7,300 of the 2041 linker
  const STILL = { TR31: 15500 - PART.TR31, T41: 7800 - PART.T41 };
  it('says the units still to buy, the same figure as the Buy table, and how many are held of the plan\'s', () => {
    const V = moveOf([{ plan }], plan.id, { today: TODAY });
    for (const code of ['TR31', 'T41']) {
      const row = V.sheet.find((r) => r.tidm === code);
      expect(row.bought).toBe('part');
      expect(row.part.toBuy).toBe(STILL[code]);
      const buy = V.buy.find((b) => b.ticker === code || (b.label || '').includes(code));
      if (buy) expect(Number(String(buy.units).replace(/,/g, ''))).toBe(STILL[code]);
    }
    const root = document.createElement('div');
    render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today: TODAY }), dispatch: () => {} }), root);
    const tr = root.querySelector('[data-testid="plan.move.sheet.table"] tr[data-bought="part"]');
    expect(tr).not.toBe(null);
    const cells = [...tr.querySelectorAll('td')].map((td) => flat(td.textContent));
    const code = cells.find((c) => c === 'TR31' || c === 'T41');
    // the cell's lines run together in textContent (they are separated by a line break on screen)
    expect(cells.some((c) => c.startsWith(STILL[code].toLocaleString('en-GB') + '(' + Math.round(STILL[code] / 100) + ' if the screen counts £100 lots)'))).toBe(true);
    expect(cells.some((c) => c.includes('You hold ' + PART[code].toLocaleString('en-GB') + ' of the ' + (STILL[code] + PART[code]).toLocaleString('en-GB') + '.'))).toBe(true);
  });
});
