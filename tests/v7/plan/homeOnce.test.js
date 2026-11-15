/**
 * Each fact once on a plan's home (7.10.0; research/v7/replan-nov-2026.md §6.4: the phase, the next review and at most one
 * thing due — nothing due is nothing in To do):
 *   - nothing due is only the nothing-due line: a plan living on its money and not locked yet says the review's line in To do,
 *     and that its months wait for the lock only on the Month by month tool.
 * Fixtures are the committed plans (tests/v7/plan/_plans.js) and the named home states; all fictional.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { entriesAt, DATES } from './_plans.js';

const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
const DIR = join(process.cwd(), 'tests/v7/states/plan');
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const T = 'plan.home';
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
function draw(stored) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  return drawState(state);
}
function drawState(state) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: () => {} }), root);
  return { root, text: visibleText(root) };
}
/** The dates the stage tests read, and one past 10's stop (January 2030), where it is asked whether work has stopped. */
const DAYS = [...DATES, '2030-10-02'];

describe('nothing due is only the nothing-due line (7.10.0)', () => {
  it('a plan living on its money and not locked yet says the review\'s line in To do; its months waiting for the lock are said on the Month by month tool', () => {
    let seen = 0;
    for (const today of DAYS) {
      const entries = entriesAt(today);
      for (const e of entries) {
        const h = homeOf(entries, e.plan.id, { today });
        if (!h.found || h.stage.key !== 'drawing' || h.locked || h.todo.count) continue;
        seen++;
        expect(['review', 'reviewAny'], `${e.plan.id} ${today}`).toContain(h.quiet.id);
        expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toMatch(/^Nothing due\. /);
        const month = h.tools.find((t) => t.id === 'month');
        expect(month && month.result.text, `${e.plan.id} ${today}`).toBe('Months are recorded once the plan is locked');
      }
    }
    expect(seen).toBeGreaterThan(5);
    // no nothing-due line says anything about the lock
    for (const [id, words] of Object.entries(HOME.quiet)) expect(words, id).not.toMatch(/lock/i);
  });
  it('drawn: "Living on it. Not locked yet." with nothing due — To do holds the nothing-due line and the way to a review, and nothing else', () => {
    const { root } = draw(load('home-draft-retired'));
    const todo = one(root, `${T}.todo`);
    expect(todo.querySelectorAll('.home-item')).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. You can review your plan whenever you like.');
    expect(one(root, `${T}.review`)).toBe(null);
    expect(one(root, `${T}.review.now`).textContent).toBe(HOME.review.link);
    expect(visibleText(todo)).not.toContain('Months are recorded once the plan is locked');
    expect([...todo.querySelectorAll('p')].map((p) => p.textContent)).toEqual(['Nothing due. You can review your plan whenever you like.', HOME.review.link]);
    // the months' note stays on the tool that records them
    expect(one(root, `${T}.tool.month`).textContent).toContain('Months are recorded once the plan is locked');
  });
});
