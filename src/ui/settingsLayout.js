/**
 * The order of Stress tester → Settings (moved out of index.html's inline script, 7.12.0).
 *
 *   orderStressSettingsSections(doc)   the layers that are not the pot (State Pension, other income) come before the income
 *                                      strategy, so the income shape below can show what the pot itself has to supply
 */
export function orderStressSettingsSections(doc) {
  try {
    const strat = doc.getElementById('ssStrategyPick')?.closest('.settings-section');
    const sp = doc.getElementById('ssSpStartDate')?.closest('.settings-section');
    const oth = doc.getElementById('ssOther')?.closest('.settings-section');
    if (strat && strat.parentElement) { if (oth && oth !== strat) strat.parentElement.insertBefore(oth, strat); if (sp && sp !== strat) strat.parentElement.insertBefore(sp, strat); }
  } catch (e) { /* layout only */ }
}
