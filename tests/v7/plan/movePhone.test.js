/**
 * The move page at phone width (7.12.0, the moving brief S1, W5): its tables (what to buy, what you hold that the plan does
 * not use, what is held against the plan, the cash to hold now) stack each row as a card of label–value pairs under 600px,
 * as "Your plan's mix" does, so nothing is off the side of a 390-wide screen. jsdom draws no layout, so this holds the two
 * things the stacking needs: the class on each table, and every cell's column label; and the stylesheet's rule.
 *
 * Fictional Sam (tests/helpers/samMove.js), Moving, with a Buy list, lines the plan does not use and cash years.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { stateWith } from './_plans.js';
import { samMovePlan, SAM_MOVE_TODAY as TODAY } from './_samMove.js';

const T = 'plan.move';
function page(plan) {
  const root = document.createElement('div'); root.id = 'app';
  render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today: TODAY }), dispatch: () => {} }), root);
  return root;
}

describe('the move page\'s tables stack at phone width', () => {
  const root = page(samMovePlan());
  const ids = ['buy', 'outside', 'cash.table'];

  it('the Buy list, the lines the plan does not use and the cash table are all drawn for Sam', () => {
    for (const id of ids) expect(root.querySelector(`[data-testid="${T}.${id}"]`), id).toBeTruthy();
  });

  it('each table stacks, and every cell with something in it carries its column\'s label', () => {
    for (const table of root.querySelectorAll('table.way-table')) {
      if (table.closest('[data-section="sheet"]')) continue;   // the order sheet is a sheet to print, kept as a table
      expect(table.classList.contains('stack-table'), table.getAttribute('data-testid')).toBe(true);
      const heads = [...table.querySelectorAll('thead th')].map((th) => th.textContent);
      for (const tr of table.querySelectorAll('tbody tr')) {
        [...tr.children].forEach((cell, i) => {
          if (cell.tagName === 'TD' && cell.textContent.trim() !== '') expect(cell.getAttribute('data-label'), table.getAttribute('data-testid') + ' ' + tr.textContent).toBe(heads[i]);
        });
      }
    }
  });

  it('the stylesheet stacks them under 600px', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'v7', 'styles', 'components.css'), 'utf8');
    const block = css.slice(css.indexOf('@media (max-width: 599px)'));
    expect(block).toMatch(/\.stack-table, \.stack-table tbody, \.stack-table tr, \.stack-table td \{ display: block; width: 100%; \}/);
    expect(block).toMatch(/\.stack-table td::before \{ content: attr\(data-label\)/);
  });
});
