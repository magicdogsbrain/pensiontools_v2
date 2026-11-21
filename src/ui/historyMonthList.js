/**
 * The History month list at phone width (#historyMobileSelector): one filler that replaces the whole list each time, so it
 * only ever holds the months of the plan open now (lead4.md R2). An empty list empties it.
 *
 *   fillHistoryMonthList(select, entries, { labelOf, chosen })   entries: the recorded months ({ date: 'YYYY-MM', ... })
 */
export function fillHistoryMonthList(select, entries = [], { labelOf = (h) => h.date, chosen = '' } = {}) {
  if (!select) return;
  const doc = select.ownerDocument;
  select.innerHTML = '';
  for (const h of Array.isArray(entries) ? entries : []) {
    const o = doc.createElement('option');
    o.value = h.date;
    o.textContent = labelOf(h);
    select.appendChild(o);
  }
  select.value = chosen && entries.some((h) => h.date === chosen) ? chosen : '';
}
