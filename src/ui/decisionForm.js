/**
 * The Decision settings boxes, filled from the plan as read (lead4.md R2): a box shows what the plan holds, and a value the
 * plan does not hold EMPTIES the box. The two loaders in index.html (the page's first fill, initializeAllInputsFromSettings,
 * and the Decision → Settings page, loadDecisionSettings) used to fill these boxes each with its own fallbacks (a 35-year
 * plan, £250,000 / £200,000 / £50,000 pots, a £30,000 income, the protection defaults), so a plan with none of them showed
 * factory figures as if it held them. Both now fill through this one function.
 *
 *   decisionBoxValues(s)      { boxId: value } for the number and date boxes ('' where the plan has no value)
 *   decisionPotsOf(s)         { equityMin, bondMin, cashTarget, diversifierStart, set }: the pots to draw, `set` false when
 *                             the plan holds none of the three (the pot box is then emptied)
 *   fillDecisionBoxes(doc, s) puts decisionBoxValues(s) into the boxes on the page
 *
 * Pure apart from fillDecisionBoxes' writes to the boxes.
 */
const has = (x) => x !== undefined && x !== null && x !== '' && !(typeof x === 'number' && Number.isNaN(x));
const shown = (x) => (has(x) ? x : '');

export function decisionBoxValues(s) {
  const d = s || {};
  return {
    dsDuration: shown(d.duration),
    dsBaseSalary: shown(d.baseSalary),
    dsIsaBalance: shown(d.isaBalance),
    dsUfplsYears: shown(d.ufplsYears),
    dsSpStartDate: shown(d.spStartDate),
    dsSpWeeklyAmount: shown(d.spWeeklyAmount),
    dsProtectionFactor: shown(d.protectionFactor),
    dsRecoveryBuffer: shown(d.recoveryBuffer),
    dsProtEscalate: shown(d.protectionEscalateMonths),
    dsConsecutiveLimit: shown(d.consecutiveLimit)
  };
}

export function decisionPotsOf(s) {
  const d = s || {};
  const set = has(d.equityMin) || has(d.bondMin) || has(d.cashTarget);
  return { equityMin: +d.equityMin || 0, bondMin: +d.bondMin || 0, cashTarget: +d.cashTarget || 0, diversifierStart: +d.diversifierStart || 0, set };
}

export function fillDecisionBoxes(doc, s) {
  for (const [id, v] of Object.entries(decisionBoxValues(s))) {
    const el = doc.getElementById(id);
    if (el) el.value = v;
  }
}
