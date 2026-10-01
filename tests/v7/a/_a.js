/**
 * The adapter for question A (step 4 brief 4.14) — the ONLY test file that knows real paths for A.
 * Every other test under tests/v7/a/ imports the answer, the input list and the screen from here.
 */
import { SCHEMA_A } from '../../../src/answers/a/schema.js';

export { answerA } from '../../../src/answers/a/answer.js';
export { SCHEMA_A };
export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false, detail: 'chart' };
export { get, renderScreen } from '../c/_c.js';

/**
 * { [path]: value } read back from the boxes of a drawn form, by data-testid="<q>.<path>" (C's reader, for A's list).
 * Text boxes give their text; a ticked radio "<q>.<path>.<option>" gives the option (yes/no fields: 'yes' → true,
 * 'no' → false); a checkbox gives true or false. `household` has no box: it is 'couple' when any partner box is drawn.
 */
export function readForm(root, q = 'a', schema = SCHEMA_A) {
  const out = {};
  const byPath = new Map(schema.fields.map((f) => [f.path, f]));
  const prefix = `${q}.`;
  for (const el of root.querySelectorAll(`[data-testid^="${prefix}"]`)) {
    const id = el.getAttribute('data-testid').slice(prefix.length);
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
  out.household = Object.keys(out).some((p) => p.startsWith('partner.')) || root.querySelector(`[data-testid^="${prefix}partner."]`) ? 'couple' : 'single';
  return out;
}
