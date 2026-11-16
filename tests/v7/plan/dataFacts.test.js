/**
 * The scenario tests' marks (7.12.0, the scenario brief's step 3, added at integration on top of the areas' screens): a
 * `data-fact` attribute on the line that states a fact, so a scenario finds the fact by its place. The scenario reader takes
 * a marked element's visible text and applies the register's pattern for that page (e2e/scenarios/read.js readPlaceOnce),
 * so a mark must hold text the pattern reads, and give the same figure the page as a whole gives. Checked here on every
 * plan of the corpus, on every simple-view page the register names for a marked fact. Markup only: nothing a person sees.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { stateWith, corpus, entryOf, TODAY } from './_plans.js';
import { FACTS, PAGES } from '../../../e2e/scenarios/facts.js';
import { LINE_FACTS } from '../../../src/v7/components/facts.js';

const text = (el) => (el.textContent || '').replace(/ /g, ' ');

describe('every mark holds the figure the register reads there', () => {
  const marked = [...new Set(Object.values(LINE_FACTS))];
  it('every marked fact is in the register', () => {
    for (const id of marked) expect(FACTS[id], id).toBeTruthy();
  });
  const C = corpus();
  for (const name of Object.keys(C)) {
    it(name, () => {
      const e = entryOf(C[name], TODAY);
      let seen = 0;
      for (const id of marked) {
        for (const place of FACTS[id].simple || []) {
          if (!place.find || place.input || place.region) continue;
          const step = PAGES.simple[place.page].step;
          const root = document.createElement('div');
          render(h(App, { state: stateWith([e], '#/plan/' + e.plan.id + (step ? '/' + step : ''), { today: TODAY }), dispatch: () => {} }), root);
          const marks = [...root.querySelectorAll(`[data-fact="${id}"]`)];
          const re = new RegExp(place.find, 'm');
          const onPage = re.exec(text(root));
          if (marks.length) {
            const m = re.exec(text(marks[0]));
            expect(m, `${name} ${id} on ${place.page}: the mark's text "${text(marks[0])}" is read by the pattern`).not.toBeNull();
            expect(onPage && onPage[1], `${name} ${id} on ${place.page}: the same figure as the page`).toBe(m[1]);
            seen++;
          }
          render(null, root);
        }
      }
      void seen;
    }, 120000);
  }
  it('the marks are drawn: the running plan\'s About marks its end age; its home marks the pot', () => {
    const e = entryOf(C['04-buckets-running'], TODAY);
    const at = (step) => { const root = document.createElement('div'); render(h(App, { state: stateWith([e], '#/plan/' + e.plan.id + (step ? '/' + step : ''), { today: TODAY }), dispatch: () => {} }), root); return root; };
    expect(at('about').querySelector('[data-fact="plan.endAge"]')).not.toBeNull();
    expect(at('').querySelector('[data-fact="pot.today"]')).not.toBeNull();
  });
});
