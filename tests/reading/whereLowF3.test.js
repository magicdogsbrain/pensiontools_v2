/**
 * The plan's 1-in-10 bad line under "Where you are" (lead4.md D24, R8; step F3): the full view's strip says it when the pot
 * is below it or between it and the middle (PlanDocumentView whereAmIPotText); the simple view now says it in the same
 * cases, one figure, marked `pot.planLow` in both.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../src/v7/App.jsx';
import { stateWith, corpus, entryOf, TODAY } from '../v7/plan/_plans.js';
import { whereAmIFor } from '../../src/services/PlanReading.js';
import { whereAmIPotText } from '../../src/ui/components/PlanDocumentView.js';

const text = (el) => (el.textContent || '').replace(/ /g, ' ');
const lowIn = (html) => { const m = /data-fact="pot\.planLow">([^<]*)</.exec(String(html || '')); return m ? m[1] : null; };

describe('the 1-in-10 bad line: said in both views in the same cases, one figure', () => {
  const C = corpus();
  const rows = Object.keys(C).map((k) => {
    const e = entryOf(C[k], TODAY);
    let w = null; try { w = whereAmIFor(e.plan, { now: new Date(TODAY + 'T12:00:00Z') }); } catch { w = null; }
    const full = w && w.pot ? lowIn(whereAmIPotText(w.pot)) : null;
    const root = document.createElement('div');
    render(h(App, { state: stateWith([e], '#/plan/' + e.plan.id + '/where', { today: TODAY }), dispatch: () => {} }), root);
    const m = root.querySelector('[data-fact="pot.planLow"]');
    const simple = m ? text(m).trim() : null;
    render(null, root);
    return { k, full, simple };
  });
  it('the simple view shows it exactly where the full view does, with the same figure', () => {
    for (const r of rows) expect(r.simple, r.k).toBe(r.full);
    expect(rows.filter((r) => r.full).length).toBeGreaterThan(0);   // the corpus has pots near the line (a running Buckets plan, a moved plan)
  });
});
