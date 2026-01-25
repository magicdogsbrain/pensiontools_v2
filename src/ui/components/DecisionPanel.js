/**
 * Decision Panel Component
 * Renders the single unified recommendation (no alternatives)
 */

import { formatCurrency, formatPercent } from '../../utils/FormatUtils.js';
import { AlertSeverity } from '../../models/Decision.js';

/**
 * Renders the decision output panel
 * @param {object} decision - Decision object from DecisionService
 * @param {HTMLElement} container - Container element to render into
 */
export function renderDecisionPanel(decision, container) {
  const html = buildDecisionHTML(decision);
  container.innerHTML = html;
}

/**
 * Builds the HTML for the decision panel
 * @param {object} decision - Decision object
 * @returns {string} HTML string
 */
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

  // Alerts
  if (d.alerts && d.alerts.length > 0) {
    html += '<div class="alerts">';
    for (const alert of d.alerts) {
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
  html += `<span class="value">${formatCurrency(d.sippDraw)}</span>`;
  html += '</div>';

  // ISA top-up (if applicable)
  if (d.isaDraw > 0) {
    html += '<div class="draw-row">';
    html += `<span class="label">ISA Top-up</span>`;
    html += `<span class="value">${formatCurrency(d.isaDraw)}</span>`;
    html += '</div>';
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

  // Calculate NET total (after tax)
  // Taxable income = SIPP + Other + State (ISA is tax-free)
  const monthlyTaxable = d.sippDraw + d.other + d.statePension;
  const annualTaxable = monthlyTaxable * 12;
  const pa = d.pa || 12570;
  const brl = d.brl || 50270;

  // Tax calculation: 0% up to PA, 20% from PA to BRL, 40% above BRL
  let annualTax = 0;
  if (annualTaxable > pa) {
    if (annualTaxable <= brl) {
      annualTax = (annualTaxable - pa) * 0.2;
    } else {
      annualTax = (brl - pa) * 0.2 + (annualTaxable - brl) * 0.4;
    }
  }

  // Net = gross taxable - tax + ISA (tax-free)
  const totalMonthlyNet = monthlyTaxable - (annualTax / 12) + d.isaDraw;

  html += '<div class="draw-row total">';
  html += `<span class="label">Total Monthly Income</span>`;
  html += `<span class="value">${formatCurrency(totalMonthlyNet)}</span>`;
  html += '</div>';

  // Tax boost indicator
  if (d.boostAmount > 0) {
    html += '<div class="boost-indicator">';
    html += `<span class="boost-label">Includes Tax Boost:</span>`;
    html += `<span class="boost-value">+${formatCurrency(d.boostAmount)}</span>`;
    html += '</div>';
  }

  html += '</div>'; // End recommendation-card

  // Withdrawal source
  html += '<div class="source-card">';
  html += '<h4>Withdraw From</h4>';
  html += `<div class="source-label ${d.source.toLowerCase()}">${d.source}</div>`;

  if (d.source === 'Growth' && (d.drawFromEquity > 0 || d.drawFromBond > 0)) {
    html += '<div class="source-breakdown">';
    if (d.drawFromEquity > 0) {
      html += `<div class="source-item">Equity: ${formatCurrency(d.drawFromEquity)}</div>`;
    }
    if (d.drawFromBond > 0) {
      html += `<div class="source-item">Bond: ${formatCurrency(d.drawFromBond)}</div>`;
    }
    html += '</div>';
  }

  html += '</div>'; // End source-card

  // Fund status summary
  html += '<div class="fund-status">';
  html += '<h4>Fund Status</h4>';

  const totalFunds = d.equity + d.bond + d.cash;
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

  html += '</div>'; // End fund-grid

  // Overall status
  const statusClass = surplus >= 0 ? 'healthy' : 'warning';
  html += `<div class="overall-status ${statusClass}">`;
  html += `<span>Total Surplus: ${formatCurrency(surplus)}</span>`;
  html += `<span>(${surplusPercent.toFixed(1)}% above target)</span>`;
  html += '</div>';

  html += '</div>'; // End fund-status

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

    if (projectedSaved > 0) {
      html += '<div class="tax-comparison-row saved">';
      html += '<div class="label">Tax Saved</div>';
      html += `<div class="success">-${formatCurrency(monthlySaved)}</div>`;
      html += `<div class="success">-${formatCurrency(ytdSaved)}</div>`;
      html += `<div class="success">-${formatCurrency(projectedSaved)}</div>`;
      html += '</div>';
    }
  }

  html += '</div>'; // End tax-comparison

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
  if (d.rebalanceNeeded && d.rebalanceActions.length > 0) {
    html += '<div class="rebalance-card">';
    html += '<h4>Rebalancing Suggestions</h4>';
    html += '<ul>';
    for (const action of d.rebalanceActions) {
      html += `<li>${action}</li>`;
    }
    html += '</ul>';
    html += '</div>';
  }

  // Mode explanation
  html += '<div class="mode-explanation">';
  html += '<h4>Why This Recommendation?</h4>';
  html += `<p>${details.reason || 'Standard calculation based on your settings.'}</p>`;

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

/**
 * Builds HTML for a fund status cell
 */
function buildFundCell(name, current, minimum, surplus) {
  const statusClass = surplus >= 0 ? 'healthy' : 'deficit';

  return `<div class="fund-cell ${statusClass}">
    <div class="fund-name">${name}</div>
    <div class="fund-current">${formatCurrency(current)}</div>
    <div class="fund-min">Min: ${formatCurrency(minimum)}</div>
    <div class="fund-surplus">${surplus >= 0 ? '+' : ''}${formatCurrency(surplus)}</div>
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
