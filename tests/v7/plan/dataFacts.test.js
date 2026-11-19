/**
 * The marks on the simple view's plan pages (lead4.md G1; first added for the scenario tests in 7.12.0): a `data-fact`
 * attribute on the span that holds exactly a figure, so the parity sweep and the scenario reader find the figure by its
 * place. The scenario reader takes a marked element's visible text (e2e/scenarios/read.js readPlaceOnce): a mark must hold
 * the figure the register's pattern reads on that page, and give the same value. Checked here on every plan of the corpus,
 * on every simple-view page the register names for a fact. Markup only: nothing a person sees.
 *
 * (Until 7.12.0 the mark sat on the whole line, LINE_FACTS; it now sits on the figure: src/v7/components/facts.js.)
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { stateWith, corpus, entryOf, TODAY } from './_plans.js';
import { FACTS, PAGES } from '../../../e2e/scenarios/facts.js';
import { parse } from '../../../e2e/scenarios/read.js';
import { isFactId } from '../../../src/reading/facts.js';

/**
 * Where the page itself states one fact as two figures, a mark holds one and the page's pattern finds the other. These are
 * the disagreements the parity gate counts (e2e/parity/known-disagreements.json); each is named here with its cause, and
 * comes out when the figure moves onto the one reading.
 */
const TWO_FIGURES = Object.freeze({
  '12-lumpy-db-gia|pot.today|pots': 'the pension today summed two ways on one page (lead4.md section 0 point 3, D3)'
});

const text = (el) => (el.textContent || '').replace(/ /g, ' ');

describe('every mark holds the figure the register reads there', () => {
  const C = corpus();
  for (const name of Object.keys(C)) {
    it(name, () => {
      const e = entryOf(C[name], TODAY);
      for (const [id, f] of Object.entries(FACTS)) {
        for (const place of f.simple || []) {
          if (!place.find || place.input || place.region) continue;
          const step = PAGES.simple[place.page].step;
          const root = document.createElement('div');
          render(h(App, { state: stateWith([e], '#/plan/' + e.plan.id + (step ? '/' + step : ''), { today: TODAY }), dispatch: () => {} }), root);
          for (const m of root.querySelectorAll('[data-fact]')) expect(isFactId(m.getAttribute('data-fact')), m.getAttribute('data-fact')).toBe(true);
          const marks = [...root.querySelectorAll(`[data-fact="${id}"]`)];
          const onPage = new RegExp(place.find, 'm').exec(text(root));
          if (marks.length && onPage && !TWO_FIGURES[`${name}|${id}|${place.page}`]) {
            // the figure the register reads on the page is the value of a mark of that fact there
            const values = marks.map((m) => parse(f.kind, text(m).trim()));
            expect(values, `${name} ${id} on ${place.page}: a mark holds "${onPage[1]}"`).toContainEqual(parse(f.kind, onPage[1]));
          }
          render(null, root);
        }
      }
    }, 120000);
  }
  it('the marks are drawn on the figure: the running plan\'s About marks its end age; its home marks the pot', () => {
    const e = entryOf(C['04-buckets-running'], TODAY);
    const at = (step) => { const root = document.createElement('div'); render(h(App, { state: stateWith([e], '#/plan/' + e.plan.id + (step ? '/' + step : ''), { today: TODAY }), dispatch: () => {} }), root); return root; };
    const end = at('about').querySelector('[data-fact="plan.endAge"]');
    expect(end).not.toBeNull();
    expect(text(end).trim()).toMatch(/^\d+$/);
    const pot = at('').querySelector('[data-fact="pot.againstPlan"], [data-fact="pot.today"]');   // (step F1) the pot set against the plan, or the pension today it is
    expect(pot).not.toBeNull();
    expect(text(pot).trim()).toMatch(/^£[\d,]+$/);
  });
});
