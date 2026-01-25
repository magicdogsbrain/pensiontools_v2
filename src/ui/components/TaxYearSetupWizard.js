/**
 * Tax Year Setup Wizard
 * Guides users through setting up a new tax year including ISA/Savings allocation
 */

import {
  shouldShowWizard,
  getWizardData,
  calculateIsaNeeded,
  validateIsaInput,
  buildTaxYearConfig,
  calculateMonthlyBreakdown
} from '../../services/TaxYearWizardService.js';
import { saveTaxYearConfig } from '../../storage/DecisionRepository.js';

// Wizard state
let wizardElement = null;
let onCompleteCallback = null;
let currentStep = 1;
let wizardContext = null;  // Data from getWizardData()
let wizardInputs = {};     // User inputs collected during wizard

/**
 * Initialize and show the Tax Year Setup Wizard
 * @param {HTMLElement} container - Container element for wizard
 * @param {string} selectedMonth - Selected month in YYYY-MM format
 * @param {Function} onComplete - Callback when wizard completes
 */
export async function initTaxYearWizard(container, selectedMonth, onComplete) {
  wizardElement = container;
  onCompleteCallback = onComplete;
  currentStep = 1;
  wizardInputs = {};

  // Load wizard context data
  wizardContext = await getWizardData(selectedMonth);

  // Pre-fill inputs with defaults
  wizardInputs = {
    pa: wizardContext.defaults.pa,
    brl: wizardContext.defaults.brl,
    hrl: wizardContext.defaults.hrl,
    cpi: wizardContext.defaults.cpi,
    other: wizardContext.defaults.other,
    grossIncomeToDate: 0,
    confirmedSalary: wizardContext.suggestedSalary,
    isaSavingsAllocation: 0,
    isTaxEfficient: true,
    taxEfficiencyChoice: null
  };

  renderWizard();
}

/**
 * Check if wizard should be shown for a given month
 * @param {string} selectedMonth - Month in YYYY-MM format
 * @returns {Promise<object>} { showWizard, taxYear, reason }
 */
export async function checkWizardNeeded(selectedMonth) {
  return await shouldShowWizard(selectedMonth);
}

/**
 * Render current wizard step
 */
function renderWizard() {
  if (!wizardElement || !wizardContext) return;

  const totalSteps = wizardContext.isApril ? 6 : 7;

  wizardElement.innerHTML = `
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${wizardContext.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${wizardContext.isApril
            ? 'Setting up for the full tax year'
            : `Starting in ${getMonthName(wizardContext.selectedMonth)} - ${wizardContext.remainingMonths} months remaining`
          }
        </div>

        <div class="wizard-progress">
          ${renderProgressDots(totalSteps, currentStep)}
        </div>

        ${renderStep()}
      </div>
    </div>
  `;

  attachListeners();
}

/**
 * Render the current step content
 */
function renderStep() {
  // Adjust step numbers if mid-year (has extra step 2 for income-to-date)
  const effectiveStep = wizardContext.isApril ? currentStep : currentStep;

  if (wizardContext.isApril) {
    switch (currentStep) {
      case 1: return renderTaxThresholds();
      case 2: return renderCpiAndSalary();
      case 3: return renderOtherIncome();
      case 4: return renderIsaRequirement();
      case 5: return renderTaxEfficiencyDecision();
      case 6: return renderConfirmation();
      default: return '';
    }
  } else {
    // Mid-year has extra step for income-to-date
    switch (currentStep) {
      case 1: return renderTaxThresholds();
      case 2: return renderMidYearIncome();
      case 3: return renderCpiAndSalary();
      case 4: return renderOtherIncome();
      case 5: return renderIsaRequirement();
      case 6: return renderTaxEfficiencyDecision();
      case 7: return renderConfirmation();
      default: return '';
    }
  }
}

/**
 * Step: Tax Thresholds
 */
function renderTaxThresholds() {
  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Thresholds for ${wizardContext.taxYear}</div>
      <div class="wizard-step-desc">
        Enter the tax thresholds for this tax year. These are pre-filled with standard values.
      </div>

      <div class="wizard-grid">
        <div class="wizard-grid-item">
          <label>Personal Allowance</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizPA" value="${wizardInputs.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${wizardInputs.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${wizardInputs.hrl}">
          </div>
        </div>
      </div>

      <div class="wizard-example">
        <strong>Note:</strong> BRL is the threshold where 40% tax begins. Staying at or below BRL keeps you in the 20% tax band.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="cancel">Cancel</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/**
 * Step: Mid-Year Income (only for non-April starts)
 */
function renderMidYearIncome() {
  const monthName = getMonthName(wizardContext.selectedMonth);
  const prevMonth = getPreviousMonthName(wizardContext.selectedMonth);

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${monthName}. Enter any taxable income you've already received this tax year (April to ${prevMonth}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${wizardInputs.grossIncomeToDate}" placeholder="0">
        <span class="wizard-unit">gross</span>
      </div>

      <div class="wizard-example">
        <strong>Include:</strong> Employment income, self-employment, rental income, dividends, etc. received since April.
        <br><strong>Exclude:</strong> Tax-free income like ISA withdrawals.
      </div>

      <div class="wizard-info-box">
        <p>This affects how much BRL headroom you have remaining. If you've already earned above the BRL, you cannot be tax-efficient this year.</p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/**
 * Step: CPI and Salary
 */
function renderCpiAndSalary() {
  // Use current CPI input if available, otherwise default
  const currentCpi = wizardInputs.cpi !== undefined ? wizardInputs.cpi : wizardContext.defaults.cpi;
  const cpiPercent = (currentCpi * 100).toFixed(1);

  // Calculate suggested salary based on current CPI
  const baseSalary = wizardContext.baseSalary;
  const suggestedSalary = Math.round(baseSalary * (1 + currentCpi));

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Inflation and Target Salary</div>
      <div class="wizard-step-desc">
        Enter last year's CPI (used to adjust your target salary for inflation).
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <span class="wizard-unit">CPI</span>
        <input type="number" id="wizCPI" value="${cpiPercent}" step="0.1" style="max-width: 80px;" onchange="window._updateWizardSalary && window._updateWizardSalary()">
        <span class="wizard-unit">%</span>
      </div>

      <div class="wizard-info-box" id="salaryInfoBox">
        <p>Based on <span id="cpiDisplay">${cpiPercent}</span>% inflation, your target salary should be:</p>
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${suggestedSalary.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(wizardInputs.confirmedSalary || suggestedSalary)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/**
 * Step: Other Income
 */
function renderOtherIncome() {
  const spInfo = wizardContext.statePension;
  const spDisplay = spInfo.isReceiving
    ? `<span style="color: var(--success);">Receiving £${Math.round(spInfo.amount).toLocaleString()}/year</span>`
    : `<span style="color: var(--text-muted);">${spInfo.yearsUntil} years until state pension</span>`;

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${wizardInputs.other}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-example">
        <strong>Include:</strong> Private pensions, rental income, side hustles, dividends above allowance.
      </div>

      <div class="wizard-info-box">
        <strong>State Pension:</strong> ${spDisplay}
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
          (Based on your settings - edit in Settings if needed)
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/**
 * Step: ISA Requirement
 */
function renderIsaRequirement() {
  // Calculate ISA needed based on current inputs
  saveCurrentInputs();

  const isaCalc = calculateIsaNeeded({
    targetAnnualGross: wizardInputs.confirmedSalary,
    brl: wizardInputs.brl,
    pa: wizardInputs.pa,
    other: wizardInputs.other,
    statePension: wizardContext.statePension.amount,
    remainingMonths: wizardContext.remainingMonths,
    grossIncomeToDate: wizardInputs.grossIncomeToDate
  });

  // Store for next step
  wizardInputs._isaCalc = isaCalc;

  if (isaCalc.brlExhausted) {
    return `
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${wizardInputs.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${wizardInputs.brl.toLocaleString()}).
          </p>
          <p style="margin-top: 8px;">
            You cannot be tax-efficient this tax year. Any pension income will be taxed at 40% or higher.
          </p>
        </div>

        <div class="wizard-buttons">
          <button class="wizard-btn secondary" data-action="back">Back</button>
          <button class="wizard-btn primary" data-action="next">Continue</button>
        </div>
      </div>
    `;
  }

  if (isaCalc.targetAchievableAtBrl) {
    return `
      <div class="wizard-step">
        <div class="wizard-step-title">Good News!</div>

        <div class="wizard-info-box" style="background: rgba(46, 204, 113, 0.2); border: 1px solid var(--success);">
          <p style="color: var(--success); font-weight: 500;">
            Your target salary of £${Math.round(wizardInputs.confirmedSalary).toLocaleString()} is achievable within the BRL.
          </p>
          <p style="margin-top: 8px;">
            No ISA/Savings allocation is needed for tax efficiency. All your income will be taxed at 20% or less.
          </p>
        </div>

        <div class="wizard-input" style="margin-top: 16px;">
          <span class="wizard-unit">ISA allocation (optional): £</span>
          <input type="number" id="wizISA" value="0">
        </div>

        <div class="wizard-buttons">
          <button class="wizard-btn secondary" data-action="back">Back</button>
          <button class="wizard-btn primary" data-action="next">Continue</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">ISA/Savings Requirement</div>

      <div class="wizard-info-box" style="background: rgba(52, 152, 219, 0.2); border: 1px solid var(--primary);">
        <p>To be tax-efficient for the remaining <strong>${wizardContext.remainingMonths} months</strong>, you need:</p>
        <p style="font-size: 28px; color: var(--primary); margin: 12px 0;">
          £${Math.round(isaCalc.isaNeeded).toLocaleString()}
        </p>
        <p>from ISA/Savings</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          This keeps your SIPP draw at the BRL (£${wizardInputs.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${wizardInputs.isaSavingsAllocation || Math.round(isaCalc.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/**
 * Step: Tax Efficiency Decision (if ISA insufficient or BRL exhausted)
 */
function renderTaxEfficiencyDecision() {
  saveCurrentInputs();

  const isaCalc = wizardInputs._isaCalc;
  const validation = validateIsaInput(
    wizardInputs.isaSavingsAllocation,
    isaCalc?.isaNeeded || 0,
    isaCalc?.brlExhausted || false
  );

  // If sufficient ISA, skip to confirmation
  if (validation.sufficient && !validation.isBrlExhausted) {
    wizardInputs.isTaxEfficient = true;
    wizardInputs.taxEfficiencyChoice = 'efficient';
    // Auto-advance to confirmation - use setTimeout to avoid returning empty
    setTimeout(() => {
      currentStep++;
      renderWizard();
    }, 0);
    // Show a brief "processing" message instead of blank
    return `
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;
  }

  const shortfallMsg = validation.shortfall > 0
    ? `You entered £${wizardInputs.isaSavingsAllocation.toLocaleString()} but need £${Math.round(isaCalc.isaNeeded).toLocaleString()}.`
    : '';

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Efficiency Choice</div>

      ${validation.isBrlExhausted ? `
        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2);">
          <p style="color: var(--danger);">Your prior income has exhausted the BRL. You cannot be tax-efficient this year.</p>
        </div>
      ` : `
        <div class="wizard-info-box" style="background: rgba(243, 156, 18, 0.2);">
          <p style="color: var(--warning);">${shortfallMsg}</p>
        </div>
      `}

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Choose how to proceed:
      </div>

      <div class="wizard-options">
        ${!validation.isBrlExhausted ? `
          <label class="wizard-option">
            <input type="radio" name="taxChoice" value="increase" ${wizardInputs.taxEfficiencyChoice === 'increase' ? 'checked' : ''}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(isaCalc.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        ` : ''}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${wizardInputs.taxEfficiencyChoice === 'reduced' ? 'checked' : ''}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${wizardInputs.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${wizardInputs.taxEfficiencyChoice === 'inefficient' ? 'checked' : ''}>
          <div class="wizard-option-content">
            <strong>Accept tax-inefficient year</strong>
            <p>Draw full SIPP to target, ISA stays untouched, pay 40% on excess</p>
          </div>
        </label>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="apply-choice">Continue</button>
      </div>
    </div>
  `;
}

/**
 * Step: Confirmation
 */
function renderConfirmation() {
  saveCurrentInputs();

  const breakdown = calculateMonthlyBreakdown({
    targetSalary: wizardInputs.confirmedSalary,
    brl: wizardInputs.brl,
    pa: wizardInputs.pa,
    other: wizardInputs.other,
    statePension: wizardContext.statePension.amount,
    isaSavingsAllocation: wizardInputs.isaSavingsAllocation,
    remainingMonths: wizardContext.remainingMonths,
    grossIncomeToDate: wizardInputs.grossIncomeToDate,
    isTaxEfficient: wizardInputs.isTaxEfficient
  });

  const modeLabel = wizardInputs.isTaxEfficient ? 'Tax-Efficient' : 'Tax-Inefficient';
  const modeClass = wizardInputs.isTaxEfficient ? 'success' : 'warning';

  // Format currency helper
  const fmt = (val) => `£${Math.round(val).toLocaleString()}`;

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${wizardContext.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${getMonthName(wizardContext.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${wizardContext.remainingMonths}</span>
        </div>
        ${wizardInputs.grossIncomeToDate > 0 ? `
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${fmt(wizardInputs.grossIncomeToDate)}</span>
          </div>
        ` : ''}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${fmt(wizardInputs.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${modeClass}">${modeLabel}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${fmt(wizardInputs.isaSavingsAllocation)}</span>
        </div>
      </div>

      <div class="wizard-info-box" style="margin-top: 16px;">
        <strong>Expected Monthly Take-Home:</strong>
        <table style="width: 100%; margin-top: 12px; font-size: 13px;">
          <thead>
            <tr style="text-align: left; color: var(--text-muted);">
              <th style="padding: 4px 0;">Source</th>
              <th style="padding: 4px 0; text-align: right;">Gross</th>
              <th style="padding: 4px 0; text-align: right;">Tax</th>
              <th style="padding: 4px 0; text-align: right;">Net</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 4px 0;">SIPP</td>
              <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.sipp.gross)}</td>
              <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${fmt(breakdown.sipp.tax)}</td>
              <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.sipp.net)}</td>
            </tr>
            ${breakdown.other.gross > 0 ? `
              <tr>
                <td style="padding: 4px 0;">Other</td>
                <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.other.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${fmt(breakdown.other.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.other.net)}</td>
              </tr>
            ` : ''}
            ${breakdown.statePension.gross > 0 ? `
              <tr>
                <td style="padding: 4px 0;">State Pension</td>
                <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.statePension.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${fmt(breakdown.statePension.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.statePension.net)}</td>
              </tr>
            ` : ''}
            ${breakdown.isa.net > 0 ? `
              <tr>
                <td style="padding: 4px 0;">ISA <span style="color: var(--success);">(tax-free)</span></td>
                <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.isa.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--success);">£0</td>
                <td style="padding: 4px 0; text-align: right;">${fmt(breakdown.isa.net)}</td>
              </tr>
            ` : ''}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid var(--border); font-weight: bold;">
              <td style="padding: 8px 0;">Total</td>
              <td style="padding: 8px 0; text-align: right;">${fmt(breakdown.totalGross)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--danger);">-${fmt(breakdown.totalTax)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--success);">${fmt(breakdown.totalNet)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 12px; font-size: 14px; color: var(--text);">
          <strong>You'll receive ${fmt(breakdown.totalNet)}/month</strong> in your bank
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="finish">Confirm & Save</button>
      </div>
    </div>
  `;
}

/**
 * Render progress dots
 */
function renderProgressDots(total, current) {
  let html = '';
  for (let i = 1; i <= total; i++) {
    const className = i < current ? 'done' : i === current ? 'active' : '';
    html += `<div class="wizard-dot ${className}"></div>`;
  }
  return html;
}

/**
 * Attach event listeners
 */
function attachListeners() {
  const buttons = wizardElement.querySelectorAll('[data-action]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action));
  });

  // Setup CPI change handler for dynamic salary update
  window._updateWizardSalary = function() {
    const cpiInput = document.getElementById('wizCPI');
    const salaryInput = document.getElementById('wizSalary');
    const cpiDisplay = document.getElementById('cpiDisplay');
    const suggestedDisplay = document.getElementById('suggestedSalaryDisplay');

    if (cpiInput && salaryInput && cpiDisplay && suggestedDisplay) {
      const cpiPercent = parseFloat(cpiInput.value) || 0;
      const cpi = cpiPercent / 100;
      const baseSalary = wizardContext.baseSalary;
      const suggestedSalary = Math.round(baseSalary * (1 + cpi));

      // Update displays
      cpiDisplay.textContent = cpiPercent.toFixed(1);
      suggestedDisplay.textContent = suggestedSalary.toLocaleString();

      // Update the salary input to match suggestion
      salaryInput.value = suggestedSalary;

      // Store the CPI value
      wizardInputs.cpi = cpi;
      wizardInputs.confirmedSalary = suggestedSalary;
    }
  };
}

/**
 * Handle wizard actions
 */
function handleAction(action) {
  saveCurrentInputs();

  const totalSteps = wizardContext.isApril ? 6 : 7;

  switch (action) {
    case 'cancel':
      hideWizard();
      // Call callback with cancelled status
      if (onCompleteCallback) {
        onCompleteCallback({ completed: false, cancelled: true });
      }
      break;

    case 'next':
      if (currentStep < totalSteps) {
        currentStep++;
        renderWizard();
      }
      break;

    case 'back':
      if (currentStep > 1) {
        currentStep--;
        renderWizard();
      }
      break;

    case 'apply-choice':
      applyTaxEfficiencyChoice();
      currentStep++;
      renderWizard();
      break;

    case 'finish':
      finishWizard();
      break;
  }
}

/**
 * Apply the tax efficiency choice
 */
function applyTaxEfficiencyChoice() {
  const choice = document.querySelector('input[name="taxChoice"]:checked')?.value;
  wizardInputs.taxEfficiencyChoice = choice;

  switch (choice) {
    case 'increase':
      wizardInputs.isaSavingsAllocation = wizardInputs._isaCalc.isaNeeded;
      wizardInputs.isTaxEfficient = true;
      break;

    case 'reduced':
      wizardInputs.confirmedSalary = wizardInputs.brl;
      wizardInputs.isaSavingsAllocation = 0;
      wizardInputs.isTaxEfficient = true;
      break;

    case 'inefficient':
      wizardInputs.isaSavingsAllocation = 0;
      wizardInputs.isTaxEfficient = false;
      break;
  }
}

/**
 * Save current input values
 */
function saveCurrentInputs() {
  const pa = document.getElementById('wizPA');
  if (pa) wizardInputs.pa = parseFloat(pa.value) || 12570;

  const brl = document.getElementById('wizBRL');
  if (brl) wizardInputs.brl = parseFloat(brl.value) || 50270;

  const hrl = document.getElementById('wizHRL');
  if (hrl) wizardInputs.hrl = parseFloat(hrl.value) || 125140;

  const cpi = document.getElementById('wizCPI');
  if (cpi) wizardInputs.cpi = (parseFloat(cpi.value) || 4) / 100;

  const salary = document.getElementById('wizSalary');
  if (salary) wizardInputs.confirmedSalary = parseFloat(salary.value) || 30000;

  const other = document.getElementById('wizOther');
  if (other) wizardInputs.other = parseFloat(other.value) || 0;

  const isa = document.getElementById('wizISA');
  if (isa) wizardInputs.isaSavingsAllocation = parseFloat(isa.value) || 0;

  const incomeToDate = document.getElementById('wizIncomeToDate');
  if (incomeToDate) wizardInputs.grossIncomeToDate = parseFloat(incomeToDate.value) || 0;
}

/**
 * Finish wizard and save config
 */
async function finishWizard() {
  saveCurrentInputs();

  // Calculate the monthly breakdown to save
  const breakdown = calculateMonthlyBreakdown({
    targetSalary: wizardInputs.confirmedSalary,
    brl: wizardInputs.brl,
    pa: wizardInputs.pa,
    other: wizardInputs.other,
    statePension: wizardContext.statePension.amount,
    isaSavingsAllocation: wizardInputs.isaSavingsAllocation,
    remainingMonths: wizardContext.remainingMonths,
    grossIncomeToDate: wizardInputs.grossIncomeToDate,
    isTaxEfficient: wizardInputs.isTaxEfficient
  });

  // Build the tax year config
  const config = buildTaxYearConfig({
    pa: wizardInputs.pa,
    brl: wizardInputs.brl,
    hrl: wizardInputs.hrl,
    cpi: wizardInputs.cpi,
    other: wizardInputs.other,
    isaSavingsAllocation: wizardInputs.isaSavingsAllocation,
    isTaxEfficient: wizardInputs.isTaxEfficient,
    taxEfficiencyChoice: wizardInputs.taxEfficiencyChoice,
    grossIncomeToDate: wizardInputs.grossIncomeToDate,
    startMonth: parseInt(wizardContext.selectedMonth.split('-')[1]),
    confirmedSalary: wizardInputs.confirmedSalary,
    remainingMonths: wizardContext.remainingMonths,
    statePension: wizardContext.statePension.amount,
    monthlyBreakdown: breakdown
  });

  console.log(`Tax Year Wizard: Saving config for ${wizardContext.taxYear}`, config);

  try {
    // Save to repository
    await saveTaxYearConfig(wizardContext.taxYear, config);
    console.log(`Tax Year Wizard: Successfully saved config for ${wizardContext.taxYear}`);
  } catch (error) {
    console.error(`Tax Year Wizard: Failed to save config for ${wizardContext.taxYear}`, error);
    alert(`Error saving tax year configuration: ${error.message}`);
    return;
  }

  // Hide wizard
  hideWizard();

  // Callback
  if (onCompleteCallback) {
    onCompleteCallback({
      completed: true,
      taxYear: wizardContext.taxYear,
      config,
      wizardInputs
    });
  }
}

/**
 * Hide the wizard
 */
export function hideWizard() {
  if (wizardElement) {
    wizardElement.innerHTML = '';
    wizardElement.style.display = 'none';
  }
}

/**
 * Show the wizard
 */
export function showWizard() {
  if (wizardElement) {
    wizardElement.style.display = 'block';
  }
}

/**
 * Get month name from YYYY-MM
 */
function getMonthName(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

/**
 * Get previous month name
 */
function getPreviousMonthName(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 2, 1);
  return date.toLocaleString('default', { month: 'long' });
}

/**
 * Get additional wizard styles
 */
export function getTaxYearWizardStyles() {
  return `
    .wizard-summary {
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
    }

    .wizard-summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }

    .wizard-summary-row:last-child {
      border-bottom: none;
    }

    .wizard-summary-row .success {
      color: var(--success);
      font-weight: 500;
    }

    .wizard-summary-row .warning {
      color: var(--warning);
      font-weight: 500;
    }

    .wizard-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }

    .wizard-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .wizard-option:hover {
      border-color: var(--primary);
    }

    .wizard-option input[type="radio"] {
      margin-top: 4px;
    }

    .wizard-option-content strong {
      display: block;
      color: var(--text);
      margin-bottom: 4px;
    }

    .wizard-option-content p {
      color: var(--text-muted);
      font-size: 13px;
      margin: 0;
    }
  `;
}
