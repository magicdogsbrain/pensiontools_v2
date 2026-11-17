/**
 * The order of Stress tester → Settings (moved out of index.html's inline script; 7.12.0, lead decision 11).
 *
 * The page opens on what everyone has: the plan's start and your age today, the way of drawing and what you want a year
 * (the income strategy block), then your pot (the allocation), then the State Pension and other income. Everything else —
 * how the tax-free part is taken (UFPLS, the Money Purchase Annual Allowance, filling the basic-rate band), a taxable
 * account and bed-and-ISA, the tax thresholds, the cuts in a slump and the emergency reserve — sits under "More detail",
 * closed, after them. Nothing is created or copied: the same boxes, with the same ids, are moved.
 *
 *   orderStressSettingsSections(doc)   arranges the sections once; safe to call again
 *   MORE_DETAIL                        the closed block's words
 */
export const MORE_DETAIL = Object.freeze({
  summary: 'More detail',
  hint: 'How the tax-free part is taken, a taxable account, the tax thresholds, cuts in a slump and an emergency reserve. Each starts as most people have it; change any you need.'
});

const sectionOf = (doc, id) => { const el = doc.getElementById(id); return el ? el.closest('.settings-section') : null; };

export function orderStressSettingsSections(doc) {
  try {
    const strat = sectionOf(doc, 'ssStrategyPick');
    if (!strat || !strat.parentElement) return;
    const parent = strat.parentElement;
    const alloc = doc.getElementById('ssAllocation');
    const sp = sectionOf(doc, 'ssSpStartDate');
    const oth = sectionOf(doc, 'ssOther');
    // what everyone has first: age and income (the strategy block), the pot (the allocation), then the income that comes anyway
    let at = strat;
    for (const s of [alloc, sp, oth]) { if (s && s !== at && s.parentElement === parent) { at.after(s); at = s; } }
    // the rest, closed, after them
    let more = doc.getElementById('ssMoreDetail');
    if (!more) {
      more = doc.createElement('details');
      more.id = 'ssMoreDetail';
      more.className = 'settings-section';
      more.setAttribute('data-testid', 'settings.moreDetail');
      const sum = doc.createElement('summary');
      sum.className = 'section-title';
      sum.style.cssText = 'cursor:pointer; display:list-item;';   // the browser's own open/closed marker
      sum.textContent = MORE_DETAIL.summary;
      const hint = doc.createElement('p');
      hint.className = 'hint';
      hint.style.margin = '6px 0 10px';
      hint.textContent = MORE_DETAIL.hint;
      more.append(sum, hint);
    }
    at.after(more);
    // this form's own sections only (the Decision tool's settings have the same buttons)
    const inside = [sectionOf(doc, 'ssAccessMethod'), doc.getElementById('ssTaxableBlock'), sectionOf(doc, 'ssPA'), sectionOf(doc, 'ssConsecutiveLimit'), sectionOf(doc, 'ssHodlEnabled')];
    for (const s of inside) if (s && s !== more && !more.contains(s)) more.appendChild(s);
  } catch (e) { /* layout only */ }
}
