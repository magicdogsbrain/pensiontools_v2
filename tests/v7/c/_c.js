/**
 * The adapter (V7 build brief 4.10) — the ONLY test file that knows real paths for question C.
 * Every other test under tests/v7/ imports the answer, the input list and the screen from here.
 */
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';

export { answerC } from '../../../src/answers/c/answer.js';
export { SCHEMA_C };
export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false };
export const get = (answer, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);

/** Draws App for a state into a fresh div (not attached to the page) and returns the div. */
export function renderScreen(state) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: () => {} }), root);
  return root;
}

/**
 * { [path]: value } read back from the boxes of a drawn form, by data-testid="c.<path>".
 * Text boxes give their text; a ticked radio "c.<path>.<option>" gives the option (yes/no fields: 'yes' → true,
 * 'no' → false); a checkbox gives true or false. `household` has no box (it is set by buttons): it is 'couple'
 * when any partner box is drawn, else 'single'.
 */
export function readForm(root) {
  const out = {};
  const byPath = new Map(SCHEMA_C.fields.map((f) => [f.path, f]));
  for (const el of root.querySelectorAll('[data-testid^="c."]')) {
    const id = el.getAttribute('data-testid').slice(2);
    const tag = el.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'select' && tag !== 'textarea') continue;
    if (el.type === 'radio') {
      const cut = id.lastIndexOf('.');
      const path = id.slice(0, cut);
      const option = id.slice(cut + 1);
      const field = byPath.get(path);
      if (!field || !el.checked) continue;
      out[path] = field.type === 'yesNo' ? option === 'yes' : option;
    } else if (byPath.has(id)) {
      out[id] = el.type === 'checkbox' ? el.checked : el.value;
    }
  }
  out.household = Object.keys(out).some((p) => p.startsWith('partner.')) || root.querySelector('[data-testid^="c.partner."]') ? 'couple' : 'single';
  return out;
}
