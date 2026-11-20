/**
 * The plan open now cannot be read (lead4.md R2, D1): every box of the full view is emptied, never left holding the figures
 * of the plan open before under the read-fault words. A box is emptied as a loader empties it for a value nobody gave: a
 * number or text box to '', a tick off, a choice to its blank option (or to none). Figures drawn from the plan (data-fact)
 * go with them. Nothing is written: a box emptied here is not a person's change, so no autosave starts.
 *
 *   PLAN_TAB_ROOTS                    the full view's tabs that show a plan's figures
 *   emptyPlanBoxes(doc, rootIds?)     empties them; returns how many boxes it emptied
 */
export const PLAN_TAB_ROOTS = Object.freeze(['decision-content', 'stress-content', 'strategies-content', 'accumulation-content', 'transition-content', 'household-content', 'budget-content']);

const SKIP_TYPES = new Set(['button', 'submit', 'reset', 'file', 'hidden', 'image']);

export function emptyPlanBoxes(doc, rootIds = PLAN_TAB_ROOTS) {
  let n = 0;
  for (const id of rootIds) {
    const root = doc.getElementById(id);
    if (!root) continue;
    root.querySelectorAll('input, select, textarea').forEach((el) => {
      if (el.closest('[data-fixed], [data-example]')) return;   // fixed page text and example hints are nobody's figures
      const t = (el.type || '').toLowerCase();
      if (SKIP_TYPES.has(t)) return;
      if (t === 'checkbox' || t === 'radio') { el.checked = false; n++; return; }
      if (el.tagName === 'SELECT') {
        const blank = [...el.options].find((o) => o.value === '');
        if (blank) el.value = ''; else el.selectedIndex = -1;
        n++; return;
      }
      el.value = ''; n++;
    });
    root.querySelectorAll('[data-fact]').forEach((f) => { f.textContent = ''; });
  }
  return n;
}
