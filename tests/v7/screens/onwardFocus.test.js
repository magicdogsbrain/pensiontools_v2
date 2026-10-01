/**
 * A's and B's "Next: what you would spend" (review, 1 Oct 2026): arriving on the spend step, the spending box is NOT
 * red. It was: the numbers step's submit handler moved on (draft/onward), the screen was drawn again inside the
 * handler, and the handler then put the keyboard in the first box with a problem — the spending box the new step had
 * just drawn. The shell then moved the keyboard to the step's heading, the box counted as left, and "Type what you
 * would spend a month…" showed before the person had done anything.
 *
 * A live page (the real store, reducer and screens, redrawn after every action, in the document so focus is real).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { checkScreen } from '../render/checkScreen.js';

vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), `tests/v7/states/${q}/${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const SPEND = ['spend.kind', 'spend.amount', 'spend.level'];

/** Question q's numbers step with the answer's own numbers typed and nothing about spending: as a person arrives at "Next". */
function numbersTyped(q, from) {
  const answered = load(q, from);
  const s = load(q, 'numbers-blank');
  const values = Object.fromEntries(Object.entries(answered.draft[q].values).filter(([p]) => !SPEND.includes(p)));
  s.draft[q] = { ...s.draft[q], values, touched: [], asked: false };
  return reduce(initialState({ today: s.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state: s });
}

function live(state) {
  const store = createStore({ ...state, env: { ...state.env, build: 'test' } }, reduce);
  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);
  const dispatch = (a) => store.dispatch(a);
  const drawIt = (s) => act(() => { render(h(App, { state: s, dispatch }), root); });
  store.subscribe(drawIt);
  drawIt(store.getState());
  return { root, store, done: () => { render(null, root); root.remove(); } };
}

describe.each([['a', 'answer-A1'], ['b', 'answer-B1']])('%s: on to "What would you spend?"', (q, from) => {
  it('by the button: the spend step, the keyboard on its heading, and the spending box neither touched nor red', async () => {
    const p = live(numbersTyped(q, from));
    try {
      await act(async () => { one(p.root, `${q}.action.onward`).click(); });
      const s = p.store.getState();
      expect(s.route.step).toBe('spend');
      expect(p.root.querySelector('main').getAttribute('data-screen')).toBe(`${q}.spend`);
      expect(s.draft[q].touched).not.toContain('spend.amount');
      expect(document.activeElement && document.activeElement.id).not.toBe(`${q}.spend.amount`);
      expect(p.root.querySelector(`[data-error-for="${q}.spend.amount"]`)).toBe(null);
      expect(one(p.root, `${q}.spend.amount`).getAttribute('aria-invalid')).toBe(null);
      expect(checkScreen(p.root, s)).toEqual([]);
    } finally { p.done(); }
  });
  it('by Enter in a box (the form submitted): the same', async () => {
    const p = live(numbersTyped(q, from));
    try {
      const box = one(p.root, `${q}.you.age`);
      box.focus();
      await act(async () => { box.closest('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })); });
      const s = p.store.getState();
      expect(s.route.step).toBe('spend');
      expect(s.draft[q].touched).not.toContain('spend.amount');
      expect(p.root.querySelector(`[data-error-for="${q}.spend.amount"]`)).toBe(null);
    } finally { p.done(); }
  });
  it('a box of the numbers step still wanting a figure: it stays, and THAT box takes the keyboard (never the next step\'s)', async () => {
    const st = numbersTyped(q, from);
    const s0 = reduce(st, { type: ACT.DRAFT_SET, q, path: 'you.age', value: '' });
    const p = live(s0);
    try {
      await act(async () => { one(p.root, `${q}.action.onward`).click(); });
      const s = p.store.getState();
      expect(s.route.step).toBe('numbers');
      expect(document.activeElement && document.activeElement.id).toBe(`${q}.you.age`);
      expect(s.draft[q].touched).toContain('you.age');
      expect(s.draft[q].touched).not.toContain('spend.amount');
    } finally { p.done(); }
  });
});
