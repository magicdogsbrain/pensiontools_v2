/**
 * Decision Panel Component
 * Renders the single unified recommendation (no alternatives)
 */

import { formatCurrency, formatPercent } from '../../utils/FormatUtils.js';
import { markFact, factAttr } from '../../reading/mark.js';
import { monthAfterTaxOf, monthFromOf, fromLabel } from '../../reading/month.js';
import { money } from '../../reading/format.js';
import { moveOfAlert } from '../../services/PlanRuleWords.js';
import { MONTH } from '../../v7/copy/month.js';
import { AlertSeverity } from '../../models/Decision.js';
import { TAX_DEFAULTS } from '../../constants.js';
import { calculateTax } from '../../services/TaxCalculator.js';

/**
 * A year's income tax on twelve months like this one — the FALLBACK for a decision that carries no
 * engine tax figure. The one tax sum (TaxCalculator): until 6.16.0 the panel had two hand-written
 * copies that stopped at 40% and did not withdraw the allowance above £100,000.
 */
function fallbackAnnualTax(d, annualTaxable) {
  return calculateTax(annualTaxable, d.pa || TAX_DEFAULTS.PERSONAL_ALLOWANCE, d.brl || TAX_DEFAULTS.BASIC_RATE_LIMIT, d.hrl || TAX_DEFAULTS.HIGHER_RATE_LIMIT);
}

/**
 * Where the month comes from, as Month by month draws it (src/v7/screens/plan/MonthScreen.jsx): one list, one line per part,
 * its words from src/v7/copy/month.js, its amount by the one formatter; the list is the fact `month.take.from` (step F5).
 */
export function monthFromHtml(d) {
  const from = monthFromOf(d);
  if (!from.length) return '';
  return '<ul class="plan-lines month-from"' + factAttr('month.take.from') + '>' + from.map((x) => '<li class="plan-line" data-from="' + esc(x.id) + '"><span class="plan-label">' + esc(fromLabel(x)) + '</span> ' + money(x.amount) + '</li>').join('') + '</ul>';
}

/**
 * Renders the decision output panel
 * @param {object} decision - Decision object from DecisionService
 * @param {HTMLElement} container - Container element to render into
 */
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fillWords = (t, slots) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
/** The month's pot moves and low-cash alert as the plan's rule (none under a contract strategy: nothing is sold from pots). */
function planMoves(d) {
  if (d.strategyOverlay && d.strategyOverlay.hidePots) return [];
  return (d.alerts || []).map(moveOfAlert).filter(Boolean);
}

export function renderDecisionPanel(decision, container) {
  const html = buildDecisionHTML(decision);
  container.innerHTML = html;
}

/**
 * Builds the HTML for the decision panel
 * @param {object} decision - Decision object
 * @returns {string} HTML string
 */
function buildTaxSummary(d) {
  const details = d.calculationDetails || {};
  const isTaxEfficientYear = d.isTaxEfficientYear ?? d.taxEfficient;
  const monthlyTaxable = (d.sippDraw || 0) + (d.other || 0) + (d.statePension || 0);
  const annualTaxable = monthlyTaxable * 12;
  // Engine figure first (partial-year aware); the flat 12× estimate only when the engine gave none.
  const annualTax = d.monthlyTax != null ? d.monthlyTax * 12 : fallbackAnnualTax(d, annualTaxable);
  let html = '';
  // Tax information - enhanced with monthly, YTD, and projected
  html += '<div class="tax-info">';
  html += '<h4>Tax Summary</h4>';

  // Tax thresholds row
  html += '<div class="tax-thresholds">';
  html += `<div class="tax-threshold-item"><span class="label">PA:</span><span>${formatCurrency(d.pa)}</span></div>`;
  html += `<div class="tax-threshold-item"><span class="label">BRL:</span><span>${formatCurrency(d.brl)}</span></div>`;
  if (details.taxInfo) {
    html += `<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${details.taxInfo.headroomToBRL > 0 ? 'success' : 'warning'}">${formatCurrency(details.taxInfo.headroomToBRL)}</span></div>`;
  }
  html += '</div>';

  // Tax comparison table (Monthly | YTD | Projected)
  html += '<div class="tax-comparison">';
  html += '<div class="tax-comparison-header">';
  html += '<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>';
  html += '</div>';

  // Tax paid row
  const monthlyTax = details.taxInfo?.monthlyTax || (annualTax / 12);
  const ytdTax = d.taxPaidYTD || monthlyTax;
  const projectedTax = d.taxProjectedAnnual || details.taxInfo?.annualTax || annualTax;

  html += '<div class="tax-comparison-row">';
  html += '<div class="label">Tax Paid</div>';
  html += `<div>${formatCurrency(monthlyTax)}</div>`;
  html += `<div>${formatCurrency(ytdTax)}</div>`;
  html += `<div>${formatCurrency(projectedTax)}</div>`;
  html += '</div>';

  // Tax saved row (if tax-efficient)
  if (isTaxEfficientYear || details.taxInfo?.taxSavedAnnual > 0) {
    const monthlySaved = d.taxSavedMonthly || details.taxInfo?.taxSavedMonthly || 0;
    const ytdSaved = d.taxSavedYTD || monthlySaved;
    const projectedSaved = d.taxSavedProjectedAnnual || details.taxInfo?.taxSavedAnnual || 0;

    if (projectedSaved >= 0.5) {   // floating-point dust showed as "-£0.00" (6.10.4)
      html += '<div class="tax-comparison-row saved">';
      html += '<div class="label">Tax Saved</div>';
      // a saving is said as the amount saved, never with a minus (7.12.0 round 3, walker 6)
      html += `<div class="success">${formatCurrency(Math.abs(monthlySaved))}</div>`;
      html += `<div class="success">${formatCurrency(Math.abs(ytdSaved))}</div>`;
      html += `<div class="success">${formatCurrency(Math.abs(projectedSaved))}</div>`;
      html += '</div>';
    }
  }

  html += '</div>'; // End tax-comparison

  // Taxable account (GIA): its own tax, separate from the income-tax table above.
  if (d.giaBalance > 0) {
    html += `<div class="hint" style="margin:4px 0 8px;">Taxable account: CGT this month ${d.giaCgt > 0 ? formatCurrency(d.giaCgt) : 'nil'} (CGT exemption used this tax year ${formatCurrency(d.cgtExemptionUsed || 0)} of £3,000); dividend/interest tax about ${formatCurrency(d.giaIncomeTaxAnnual || 0)} a year, paid out of the account. Gilts held there are CGT-free.</div>`;
  }

  // Effective tax rate
  if (details.taxInfo && typeof details.taxInfo.effectiveRate === 'number' && !isNaN(details.taxInfo.effectiveRate)) {
    const effectiveRate = details.taxInfo.effectiveRate * 100;
    html += `<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${effectiveRate <= 20 ? 'success' : effectiveRate <= 40 ? 'warning' : 'danger'}">${effectiveRate.toFixed(1)}%</span>
    </div>`;
  } else if (details.taxInfo && details.taxInfo.annualTaxable > 0 && details.taxInfo.annualTax >= 0) {
    // Calculate from available data if effectiveRate is missing
    const effectiveRate = (details.taxInfo.annualTax / details.taxInfo.annualTaxable) * 100;
    html += `<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${effectiveRate <= 20 ? 'success' : effectiveRate <= 40 ? 'warning' : 'danger'}">${effectiveRate.toFixed(1)}%</span>
    </div>`;
  }

  html += '</div>'; // End tax-info

  // Rebalancing recommendations
  // Contract strategies hold their income in rungs/cash, not P&V pots — no P&V rebalancing advice.
  // What the plan's rule does this month (7.12.0 round 3, decision 6): the pot moves as the rule's, in "you can" words, the
  // same sentences as Month by month (services/PlanRuleWords.js, src/v7/copy/month.js); never a list of orders
  const moves = planMoves(d);
  if (moves.length) {
    html += '<div class="rebalance-card" id="planRuleMoves">';
    html += `<h4>${esc(MONTH.advice.movesTitle)}</h4>`;
    html += '<ul>' + moves.map((m) => `<li data-move="${m.id}">${esc(fillWords(MONTH.advice.moves[m.id], m.slots))}</li>`).join('') + '</ul>';
    html += '</div>';
  }

  // Cadence: a quarterly / annual batch — the same monthly recommendation, sold once and parked.
  const cm = d.cadenceMonths || 1;
  if (cm > 1) {
    const total = (d.sippDraw || 0) * cm, isaT = (d.isaMonthly || 0) * cm;
    const src = d.strategyOverlay && d.strategyOverlay.hidePots ? d.strategyOverlay.floorLabel : (details.source || 'the recommended pot');
    const giaT = (d.giaNet || 0) * cm;
    html += '<div class="callout" style="margin-top:12px;">'
      + `<strong>${cm === 12 ? 'Your annual batch' : 'Your quarterly batch'}:</strong> sell ${formatCurrency(total)} from ${src} now (${cm} × ${formatCurrency(d.sippDraw || 0)}), leave it as cash inside the SIPP, and let the platform pay ${formatCurrency(d.sippDraw || 0)} a month to your bank.`
      + (giaT > 0 ? ` Plus about ${formatCurrency(giaT)} from the taxable account over the period.` : '')
      + (isaT > 0 ? ` Plus ${formatCurrency(isaT)} from the ISA over the period.` : '')
      + ` Save records all ${cm} months; come back after the period with fresh values.</div>`;
  }
  // Mode explanation — under a contract strategy (rung pays; nothing is sold) the Pots & Valves
  // reasoning ("Below min", "Growth") does not apply, so only the tax-mode line is shown.
  const contract = d.strategyOverlay && d.strategyOverlay.hidePots;
  html += '<div class="mode-explanation">';
  html += '<h4>Why This Recommendation?</h4>';
  html += `<p>${contract ? (d.strategyOverlay.note || 'This month is paid by the strategy\'s own schedule — see "Where this month comes from" above.') : (details.reason || 'Standard calculation based on your settings.')}</p>`;

  if (!details.hasSufficientIsa && details.isaNeededMonthly > 0) {
    html += `<p class="isa-warning">To enable tax-efficient mode, you need ${formatCurrency(details.totalIsaNeeded)} in your ISA (${d.remainingMonths} months remaining in tax year).</p>`;
  }
  html += '</div>';

  // Debug toggle (collapsed by default)
  html += '<details class="debug-section">';
  html += '<summary>Calculation Details</summary>';
  html += '<pre>' + JSON.stringify(details, null, 2) + '</pre>';
  html += '</details>';

  return html;
}

function closeAfterSource(d) {
  let html = '';
  html += buildTaxSummary(d);
  return html;
}

export function buildDecisionHTML(decision) {
  const d = decision;
  const details = d.calculationDetails || {};

  let html = '';

  // Mode indicator - now shows year-level tax efficiency
  const isTaxEfficientYear = d.isTaxEfficientYear ?? d.taxEfficient;
  const isProtectionInduced = d.protectionInducedTaxEfficiency || false;
  const isTaxBoost = d.boostAmount > 0;

  let modeClass, modeLabel, modeIcon;
  if (d.inProtection) {
    modeClass = 'warning';
    modeLabel = 'Protection Mode';
    modeIcon = '⚡';
  } else if (isTaxBoost) {
    modeClass = 'boost';
    modeLabel = 'Tax Boost (Catch-up)';
    modeIcon = '↑';
  } else if (isProtectionInduced) {
    modeClass = 'info';
    modeLabel = 'Protection-Induced Tax Efficiency';
    modeIcon = '↑';
  } else if (isTaxEfficientYear) {
    modeClass = 'success';
    modeLabel = 'Tax-Efficient Year';
    modeIcon = '✓';
  } else {
    modeClass = 'warning';
    modeLabel = 'Tax-Inefficient Year';
    modeIcon = '!';
  }

  html += `<div class="decision-mode ${modeClass}">
    <span class="mode-icon">${modeIcon}</span>
    <span class="mode-label">${modeLabel}</span>
  </div>`;

  // ISA/Savings allocation progress (if tax-efficient year)
  if (isTaxEfficientYear && d.yearlyIsaSavingsAllocation > 0) {
    // cumulativeIsaSavingsUsed already includes this month's ISA draw
    const used = d.cumulativeIsaSavingsUsed || 0;
    const total = d.yearlyIsaSavingsAllocation;
    const remaining = Math.max(0, total - used);
    const percentUsed = total > 0 ? (used / total) * 100 : 0;

    html += `<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(percentUsed, 100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${formatCurrency(used)} of ${formatCurrency(total)}</span>
        <span>Remaining: ${formatCurrency(remaining)}</span>
      </div>
    </div>`;
  }

  // Phased-access switch-year reminder: the plan says the UFPLS phase is over — advise the
  // real-world PCLS action (the tool never silently moves money the user actually holds).
  if (d.pclsSuggestion > 0) {
    html += `<div class="alert alert-info">
      💡 Your plan's UFPLS phase has ended. If you haven't already, take your remaining 25% tax-free
      lump sum — about <strong>${formatCurrency(d.pclsSuggestion)}</strong> at today's pot value
      (capped by your remaining Lump Sum Allowance) — into your ISA, then continue in drawdown.
      Update your fund values here once done.
    </div>`;
  }

  // Alerts
  // Contract strategies: the P&V cash/rebalance alerts do not apply (nothing is sold from pots).
  // the pot moves and the low-cash alert are said once, as the plan's rule, under the recommendation (planMoves)
  const topAlerts = (d.alerts || []).filter((a) => !(a.type === 'low-cash' || a.type === 'rebalance' || a.type === 'cash-replenish'));
  if (topAlerts.length > 0) {
    html += '<div class="alerts">';
    for (const alert of topAlerts) {
      const alertClass = getAlertClass(alert.severity);
      html += `<div class="alert ${alertClass}">${alert.message}</div>`;
    }
    html += '</div>';
  }

  // Main recommendation card
  html += '<div class="recommendation-card">';
  html += '<h3>Monthly Recommendation</h3>';

  // SIPP draw
  html += '<div class="draw-row primary">';
  html += `<span class="label">SIPP Withdrawal</span>`;
  html += `<span class="value">${markFact('month.take.pension', formatCurrency(d.sippDraw))}</span>`;
  html += '</div>';

  // ISA top-up (if applicable)
  if (d.isaDraw > 0) {
    html += '<div class="draw-row">';
    html += `<span class="label">ISA Top-up</span>`;
    html += `<span class="value">${formatCurrency(d.isaDraw)}</span>`;
    html += '</div>';
  }

  // Taxable account (GIA): drawn before the ISA, net of CGT on the realised gain.
  if (d.giaNet > 0) {
    html += '<div class="draw-row">';
    html += `<span class="label">Taxable account (GIA) draw</span>`;
    html += `<span class="value">${formatCurrency(d.giaNet)}</span>`;
    html += '</div>';
    html += `<div class="hint" style="margin:-6px 0 8px;">Sell ${formatCurrency(d.giaDraw)} from the taxable account; CGT on the gain ${d.giaCgt > 0 ? formatCurrency(d.giaCgt) : 'nil'} (this is not taxable income, so it does not use your tax bands). Balance after: ${formatCurrency(d.giaBalanceAfter || 0)}, cost ${formatCurrency(d.giaBasisAfter || 0)}.</div>`;
  }

  // Band-fill recycle (opt-in): part of the SIPP withdrawal is destined for the ISA, not spending
  if (d.recycleNet > 0) {
    html += '<div class="draw-row">';
    html += `<span class="label">of which: recycle to ISA (band-fill)</span>`;
    html += `<span class="value">${formatCurrency(d.recycleNet)}</span>`;
    html += '</div>';
    html += `<div class="alert alert-info" style="margin:6px 0;">💡 Your SIPP withdrawal above includes an extra ${formatCurrency(d.recycleGross)} to fill your basic-rate band. After 20% tax, contribute <strong>${formatCurrency(d.recycleNet)}</strong> of it to your ISA — it comes out tax-free later. (Counts toward your £20,000 ISA allowance.)</div>`;
  }

  // Other income
  if (d.other > 0) {
    html += '<div class="draw-row muted">';
    html += `<span class="label">Other Pension</span>`;
    html += `<span class="value">${formatCurrency(d.other)}</span>`;
    html += '</div>';
  }

  // State pension
  if (d.statePension > 0) {
    html += '<div class="draw-row muted">';
    html += `<span class="label">State Pension</span>`;
    html += `<span class="value">${formatCurrency(d.statePension)}</span>`;
    html += '</div>';
  }

  // Divider
  html += '<div class="divider"></div>';

  // What reaches the bank after tax: the one builder both views say it with (src/reading/month.js monthAfterTaxOf, step F5)
  const totalMonthlyNet = monthAfterTaxOf(d, { fallbackTax: fallbackAnnualTax });

  html += '<div class="draw-row total">';
  html += `<span class="label">Total Monthly Income, after tax</span>`;
  html += `<span class="value">${markFact('month.take.afterTax', formatCurrency(totalMonthlyNet))}</span>`;
  html += '</div>';

  // Tax boost indicator
  if (d.boostAmount > 0) {
    html += '<div class="boost-indicator">';
    html += `<span class="boost-label">Includes Tax Boost:</span>`;
    html += `<span class="boost-value">+${formatCurrency(d.boostAmount)}</span>`;
    html += '</div>';
  }

  html += '</div>'; // End recommendation-card

  // Where the month comes from: the same list, in the same words, as Month by month (src/reading/month.js; step F5, D17)
  const ov = d.strategyOverlay;
  if (ov && (ov.floorMonthly > 0 || ov.hidePots)) {
    // A contract strategy: say where the money actually comes from and skip the P&V pot advice.
    html += '<div class="source-card">';
    html += `<h4>${esc(MONTH.advice.fromTitle)} — ${esc(ov.name)}</h4>`;
    html += monthFromHtml(d);
    html += `<p class="hint" style="margin-top:6px;">${ov.note} The tax above is unchanged — it is still a pension withdrawal.</p>`;
    html += '</div>';
    return html + closeAfterSource(d);
  }
  html += '<div class="source-card">';
  html += `<h4>${esc(MONTH.advice.fromTitle)}</h4>`;
  html += monthFromHtml(d);
  html += '</div>'; // End source-card

  // Fund status summary
  html += '<div class="fund-status">';
  html += `<h4>${esc(MONTH.advice.levels.title)}</h4>`;

  const totalFunds = d.equity + d.bond + d.cash + (d.diversifier || 0);
  const totalMins = d.adjEquityMin + d.adjBondMin + d.adjCashTarget;
  const surplus = totalFunds - totalMins;
  const surplusPercent = totalMins > 0 ? (surplus / totalMins) * 100 : 0;

  html += '<div class="fund-grid">';

  // Equity
  const eqSurplus = d.equity - d.adjEquityMin;
  html += buildFundCell('Equity', d.equity, d.adjEquityMin, eqSurplus);

  // Bond
  const bdSurplus = d.bond - d.adjBondMin;
  html += buildFundCell('Bond', d.bond, d.adjBondMin, bdSurplus);

  // Cash
  const csSurplus = d.cash - d.adjCashTarget;
  html += buildFundCell('Cash', d.cash, d.adjCashTarget, csSurplus);

  // Diversifiers (only when the sleeve is in use). Held flat, so its whole balance is "surplus".
  if (d.diversifier != null) {
    html += buildFundCell('Diversifiers', d.diversifier, 0, d.diversifier);
  }

  html += '</div>'; // End fund-grid

  // Taxable account (GIA): outside the SIPP floors — shown for the record, with its unrealised gain.
  if (d.giaBalance > 0) {
    html += `<div class="hint" style="margin-top:10px;">Taxable account (GIA): ${formatCurrency(d.giaBalance)} (cost ${formatCurrency(d.giaBasis || 0)}, unrealised gain ${formatCurrency(Math.max(0, d.giaBalance - (d.giaBasis || 0)))}). Drawn before the ISA; not part of the SIPP floors above.</div>`;
  }

  // Overall status
  // the pots against the plan's levels, as facts in one colour (7.12.0 round 3, walker 6): below a level is how you hold it
  const L = MONTH.advice.levels;
  html += '<div class="overall-status healthy">';
  html += `<span>${esc(fillWords(L.all, { amount: formatCurrency(Math.abs(surplus)), side: surplus >= 0 ? L.allAbove : L.allBelow, pct: Math.abs(surplusPercent).toFixed(1) }))}</span>`;
  html += '</div>';

  html += '</div>'; // End fund-status

  html += buildTaxSummary(d);
  return html;
}

/**
 * Builds HTML for a fund status cell
 */
function buildFundCell(name, current, minimum, surplus) {
  // one colour: a pot below the plan's level is a fact, not an alarm (7.12.0 round 3, walker 6)
  const L = MONTH.advice.levels;
  const side = Math.round(surplus) === 0 ? L.same : fillWords(surplus > 0 ? L.above : L.below, { amount: formatCurrency(Math.abs(surplus)) });
  return `<div class="fund-cell healthy">
    <div class="fund-name">${name}</div>
    <div class="fund-current">${formatCurrency(current)}</div>
    <div class="fund-min">${esc(fillWords(L.level, { amount: formatCurrency(minimum) }))}</div>
    <div class="fund-surplus">${esc(side)}</div>
  </div>`;
}

/**
 * Gets CSS class for alert severity
 */
function getAlertClass(severity) {
  switch (severity) {
    case AlertSeverity.DANGER: return 'alert-danger';
    case AlertSeverity.WARNING: return 'alert-warning';
    case AlertSeverity.SUCCESS: return 'alert-success';
    case AlertSeverity.INFO:
    default: return 'alert-info';
  }
}

/**
 * Gets CSS styles for the decision panel
 * @returns {string} CSS styles
 */
export function getDecisionPanelStyles() {
  return `
    .decision-mode {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .decision-mode.success {
      background: rgba(46, 160, 67, 0.15);
      border: 1px solid rgba(46, 160, 67, 0.3);
      color: #2ea043;
    }

    .decision-mode.warning {
      background: rgba(240, 198, 116, 0.15);
      border: 1px solid rgba(240, 198, 116, 0.3);
      color: #f0c674;
    }

    .mode-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: currentColor;
      color: #1a1a2e;
      font-size: 14px;
    }

    .protection-badge {
      margin-left: auto;
      padding: 4px 10px;
      background: rgba(248, 81, 73, 0.2);
      border: 1px solid rgba(248, 81, 73, 0.4);
      border-radius: 4px;
      color: #f85149;
      font-size: 12px;
      text-transform: uppercase;
    }

    .alerts {
      margin-bottom: 20px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .alert-danger {
      background: rgba(248, 81, 73, 0.15);
      border-left: 4px solid #f85149;
      color: #f85149;
    }

    .alert-warning {
      background: rgba(240, 198, 116, 0.15);
      border-left: 4px solid #f0c674;
      color: #f0c674;
    }

    .alert-success {
      background: rgba(46, 160, 67, 0.15);
      border-left: 4px solid #2ea043;
      color: #2ea043;
    }

    .alert-info {
      background: rgba(126, 184, 218, 0.15);
      border-left: 4px solid #7eb8da;
      color: #7eb8da;
    }

    .recommendation-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .recommendation-card h3 {
      margin: 0 0 20px 0;
      color: var(--primary);
    }

    .draw-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .draw-row.primary .label {
      font-weight: 600;
      color: var(--primary);
    }

    .draw-row.primary .value {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
    }

    .draw-row.muted {
      color: var(--text-muted);
    }

    .draw-row.total {
      border-bottom: none;
      padding-top: 16px;
    }

    .draw-row.total .label {
      font-weight: 600;
    }

    .draw-row.total .value {
      font-size: 20px;
      font-weight: 700;
      color: var(--success);
    }

    .divider {
      height: 2px;
      background: var(--border);
      margin: 8px 0;
    }

    .boost-indicator {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
      padding: 8px 12px;
      background: rgba(126, 184, 218, 0.1);
      border-radius: 6px;
      font-size: 14px;
      color: var(--info);
    }

    .source-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
    }

    .source-card h4 {
      margin: 0 0 12px 0;
      color: var(--text-muted);
      font-size: 14px;
    }

    .source-label {
      display: inline-block;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .source-label.growth {
      background: rgba(46, 160, 67, 0.2);
      color: #2ea043;
    }

    .source-label.cash {
      background: rgba(240, 198, 116, 0.2);
      color: #f0c674;
    }

    .source-label.mixed {
      background: rgba(126, 184, 218, 0.2);
      color: #7eb8da;
    }

    .source-breakdown {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 12px;
      color: var(--text-muted);
      font-size: 14px;
    }

    .fund-status {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .fund-status h4 {
      margin: 0 0 16px 0;
    }

    .fund-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .fund-cell {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .fund-cell.healthy {
      background: rgba(46, 160, 67, 0.1);
      border: 1px solid rgba(46, 160, 67, 0.2);
    }

    .fund-cell.deficit {
      background: rgba(248, 81, 73, 0.1);
      border: 1px solid rgba(248, 81, 73, 0.2);
    }

    .fund-name {
      font-weight: 600;
      margin-bottom: 8px;
    }

    .fund-current {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .fund-min {
      font-size: 12px;
      color: var(--text-muted);
    }

    .fund-surplus {
      font-size: 14px;
      margin-top: 8px;
    }

    .fund-cell.healthy .fund-surplus {
      color: #2ea043;
    }

    .fund-cell.deficit .fund-surplus {
      color: #f85149;
    }

    .overall-status {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
    }

    .overall-status.healthy {
      background: rgba(46, 160, 67, 0.1);
      color: #2ea043;
    }

    .overall-status.warning {
      background: rgba(248, 81, 73, 0.1);
      color: #f85149;
    }

    .tax-info, .rebalance-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .tax-info h4, .rebalance-card h4 {
      margin: 0 0 16px 0;
    }

    .tax-grid {
      display: grid;
      gap: 8px;
    }

    .tax-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }

    .tax-item:last-child {
      border-bottom: none;
    }

    .rebalance-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .rebalance-card li {
      margin-bottom: 8px;
      color: var(--text-muted);
    }

    .mode-explanation {
      background: var(--card-alt);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .mode-explanation h4 {
      margin: 0 0 12px 0;
      color: var(--primary);
    }

    .mode-explanation p {
      margin: 0 0 8px 0;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .isa-warning {
      color: var(--warning) !important;
    }

    .debug-section {
      margin-top: 20px;
      padding: 16px;
      background: var(--card-alt);
      border-radius: 8px;
    }

    .debug-section summary {
      cursor: pointer;
      color: var(--text-muted);
      font-size: 14px;
    }

    .debug-section pre {
      margin-top: 16px;
      padding: 16px;
      background: var(--card);
      border-radius: 6px;
      overflow-x: auto;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Info mode (protection-induced efficiency) */
    .decision-mode.info {
      background: rgba(126, 184, 218, 0.15);
      border: 1px solid rgba(126, 184, 218, 0.3);
      color: #7eb8da;
    }

    /* Tax Boost mode (catch-up after protection) */
    .decision-mode.boost {
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.3);
      color: #2ecc71;
    }

    /* ISA Progress Card */
    .isa-progress-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .isa-progress-card h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-muted);
    }

    .isa-progress-bar {
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .isa-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), #5a9aba);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .isa-progress-stats {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 13px;
      color: var(--text-muted);
    }

    /* Tax Thresholds Row */
    .tax-thresholds {
      display: flex;
      gap: 20px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
    }

    .tax-threshold-item {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }

    .tax-threshold-item .label {
      color: var(--text-muted);
    }

    .tax-threshold-item .success {
      color: var(--success);
    }

    .tax-threshold-item .warning {
      color: var(--warning);
    }

    /* Tax Comparison Table */
    .tax-comparison {
      margin: 16px 0;
    }

    .tax-comparison-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .tax-comparison-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }

    .tax-comparison-row:last-child {
      border-bottom: none;
    }

    .tax-comparison-row .label {
      color: var(--text-muted);
    }

    .tax-comparison-row.saved {
      background: rgba(46, 160, 67, 0.05);
    }

    .tax-comparison-row .success {
      color: var(--success);
    }

    .tax-comparison-row .warning {
      color: var(--warning);
    }

    .tax-comparison-row .danger {
      color: var(--danger);
    }

    /* Effective Rate */
    .effective-rate {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--card-alt);
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }

    .effective-rate .success {
      color: var(--success);
      font-weight: 600;
    }

    .effective-rate .warning {
      color: var(--warning);
      font-weight: 600;
    }

    .effective-rate .danger {
      color: var(--danger);
      font-weight: 600;
    }
  `;
}
