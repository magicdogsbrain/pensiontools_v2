/**
 * Tax Year Setup — the set-up for a tax year the Decision tool has not seen yet.
 *
 * Three screens (6.23; research/v7/v6-usability-audit.md §2.7): this year's figures (everything the app cannot
 * know, on one screen — income so far when the year starts mid-way, last year's inflation, income before tax, other
 * income, gains realised; the tax bands shown as an assumption you can change, never a question), the tax-free
 * top-up (what the ISA or savings need to provide to keep the pension income in the 20% band, and the choice when
 * they cannot), and confirm. The config saved is exactly what the six-screen set-up saved.
 */

import { DECISION_ASSUMED_CPI } from '../../services/InflationModel.js';
import {
  shouldShowWizard,
  getWizardData,
  calculateIsaNeeded,
  validateIsaInput,
  buildTaxYearConfig,
  calculateMonthlyBreakdown,
  wizardScreens,
  bandsAssumptionText,
  statePensionLine
} from '../../services/TaxYearWizardService.js';
import { saveTaxYearConfig, getTaxYearConfigAsync } from '../../storage/DecisionRepository.js';
import { lockPlanIfNeeded } from '../../services/PlanLock.js';

// Wizard state
let wizardElement = null;
let onCompleteCallback = null;
let currentStep = 1;
let wizardContext = null;  // Data from getWizardData()
let wizardInputs = {};     // User inputs collected during wizard

const fmt = (val) => '£' + Math.round(+val || 0).toLocaleString('en-GB');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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

  // Pre-fill inputs with what the app already knows
  wizardInputs = {
    pa: wizardContext.defaults.pa,
    brl: wizardContext.defaults.brl,
    hrl: wizardContext.defaults.hrl,
    cpi: wizardContext.defaults.cpi,
    other: wizardContext.defaults.other,
    cgtExemptionUsed: 0,
    grossIncomeToDate: 0,
    taxPaidToDate: null,
    confirmedSalary: wizardContext.suggestedSalary,
    isaSavingsAllocation: null,   // null until the top-up screen suggests one
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

  const screens = wizardScreens(wizardContext);
  const screen = screens[currentStep - 1] || screens[0];

  wizardElement.innerHTML = `
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Setting up tax year ${esc(wizardContext.taxYear)}</div>
        <div class="wizard-subtitle">
          ${wizardContext.isApril
            ? 'The whole tax year, April to March'
            : `Starting in ${esc(getMonthName(wizardContext.selectedMonth))} — ${wizardContext.remainingMonths} payments to come this tax year`
          }
        </div>

        <div class="wizard-progress">
          ${renderProgressDots(screens.length, currentStep)}
        </div>

        ${screen.key === 'this-year' ? renderThisYear() : screen.key === 'top-up' ? renderTopUp() : renderConfirmation()}
      </div>
    </div>
  `;

  attachListeners();
}

/**
 * Screen 1: this year's figures — everything the app cannot know, on one screen.
 */
function renderThisYear() {
  const monthName = getMonthName(wizardContext.selectedMonth);
  const prevMonth = getPreviousMonthName(wizardContext.selectedMonth);
  const currentCpi = wizardInputs.cpi !== undefined ? wizardInputs.cpi : wizardContext.defaults.cpi;
  const cpiPercent = (currentCpi * 100).toFixed(1);

  // Suggested income before tax: last year's figure (or the plan base in year 1) uplifted by CPI, netted by the
  // real-spending decline when the plan declines — the Stress tester's own curve; or the plan's schedule for this year.
  const base = wizardContext.suggestionBase ?? wizardContext.baseSalary;
  const declineRate = wizardContext.declineRate || 0;
  const fromBridge = wizardContext.suggestionSource === 'bridge';
  const fromSchedule = wizardContext.suggestionSource === 'budget-schedule' || fromBridge;
  const suggestedSalary = fromSchedule ? Math.round(wizardContext.suggestedSalary) : Math.round(base * (1 + currentCpi - declineRate));
  const declining = declineRate > 0;
  const netUpliftPct = ((currentCpi - declineRate) * 100).toFixed(1);
  const startLabel = wizardContext.planStartYear ? wizardContext.planStartYear + '/' + String(wizardContext.planStartYear + 1).slice(2) : '';

  const midYear = wizardContext.isApril ? '' : `
      <div class="wizard-step-desc">
        <strong>Income before tax you have already received this tax year</strong> (April to ${esc(prevMonth)}): pay, self-employment, rent,
        dividends, pension already drawn. ${esc(monthName)}'s own payment is the first the tool plans, so do not include it. If ${esc(monthName)}'s
        payment has already been made, cancel, tick "This month's payment has already been made" on the entry, and the set-up restarts from next month.
      </div>
      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${wizardInputs.grossIncomeToDate}" placeholder="0">
        <span class="wizard-unit">before tax</span>
      </div>
      <div class="wizard-step-desc" style="margin-top:10px;">
        Tax already taken off that income (from your payslips, or a P60 to date). Leave blank if you don't know — the tool then assumes
        the earlier income was taxed on its own, which overstates the tax to come for someone already drawing a pension.
      </div>
      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizTaxPaidToDate" value="${wizardInputs.taxPaidToDate == null ? '' : wizardInputs.taxPaidToDate}" placeholder="leave blank if unknown">
        <span class="wizard-unit">tax paid</span>
      </div>`;

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">This year's figures</div>
      ${midYear}

      <div class="wizard-step-desc" style="margin-top:${wizardContext.isApril ? 0 : 14}px;">
        <strong>Last year's inflation (CPI)</strong> — it moves this year's suggested income.
      </div>
      <div class="wizard-input" style="margin-bottom: 12px;">
        <input type="number" id="wizCPI" value="${cpiPercent}" step="0.1" style="max-width: 80px;">
        <span class="wizard-unit">%</span>
      </div>

      <div class="wizard-info-box" id="salaryInfoBox">
        ${fromBridge
          ? `<p><strong>Run-up year</strong> — your plan's first year is ${esc(startLabel)}, so this tax year is drawn from your pension cash
             (the money-market fund the cash years also use). The suggestion is your plan's first income step, the rate that cash was sized
             for${wizardContext.bridgeCoverMonths != null ? ` (at that rate the cash to April covers about ${wizardContext.bridgeCoverMonths} of the ${wizardContext.remainingMonths} payments to come)` : ''}:</p>`
          : fromSchedule
          ? `<p><strong>From your plan's income schedule for this year</strong> — the year-by-year income your plan was priced on
             (the income steps, or the Budget tool's plan), uplifted to this year's money:</p>`
          : ''}
        ${fromSchedule
          ? `<span id="cpiDisplay" hidden>${cpiPercent}</span><span id="netUpliftDisplay" hidden>${netUpliftPct}</span>`
          : declining
            ? `<p>Your plan's spending <strong>falls a little each year</strong> (about ${(declineRate * 100).toFixed(0)}% a year in today's money). Last year's income rises with <span id="cpiDisplay">${cpiPercent}</span>% inflation less that fall — a net <strong><span id="netUpliftDisplay">${netUpliftPct}</span>%</strong> — to:</p>`
            : `<p>With <span id="cpiDisplay">${cpiPercent}</span>% inflation, this year's income before tax would be:<span id="netUpliftDisplay" hidden>${netUpliftPct}</span></p>`}
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${suggestedSalary.toLocaleString('en-GB')}</span></p>
        <p>a year, before tax</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 12px;">
        <strong>Income before tax</strong> for this year — what you want to live on, counting the State Pension and any other income below. Change it if you like.
      </div>
      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(wizardInputs.confirmedSalary || suggestedSalary)}">
        <span class="wizard-unit">a year</span>
      </div>

      <div class="wizard-step-desc" style="margin-top: 14px;">
        <strong>Other taxable income this year</strong> — a workplace or private pension in payment, rent, part-time work, dividends above the allowance. A year's worth.
      </div>
      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${wizardInputs.other}">
        <span class="wizard-unit">a year</span>
      </div>

      <div class="wizard-step-desc" style="margin-top: 14px;">
        <strong>Gains already made this tax year</strong> outside this tool, if any — they share the £3,000 capital-gains allowance with any sales from a taxable account the tool advises.
      </div>
      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizCgtUsed" value="${wizardInputs.cgtExemptionUsed || 0}" min="0">
        <span class="wizard-unit">of gains</span>
      </div>

      <div class="wizard-info-box" style="margin-top: 14px;">
        <strong>State Pension:</strong> ${esc(statePensionLine(wizardContext.statePension, wizardContext.selectedMonth))}
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">From your settings — change it there if it is wrong.</p>
      </div>

      <details class="wizard-example" style="margin-top: 12px;">
        <summary style="cursor:pointer;">${esc(bandsAssumptionText(wizardInputs))} <span style="color: var(--primary);">Change</span></summary>
        <div class="wizard-grid" style="margin-top: 10px;">
          <div class="wizard-grid-item">
            <label>Tax-free allowance</label>
            <div class="wizard-input"><span class="wizard-unit">£</span><input type="number" id="wizPA" value="${wizardInputs.pa}"></div>
          </div>
          <div class="wizard-grid-item">
            <label>20% tax up to (taxable income)</label>
            <div class="wizard-input"><span class="wizard-unit">£</span><input type="number" id="wizBRL" value="${wizardInputs.brl}"></div>
          </div>
          <div class="wizard-grid-item">
            <label>45% tax above (taxable income)</label>
            <div class="wizard-input"><span class="wizard-unit">£</span><input type="number" id="wizHRL" value="${wizardInputs.hrl}"></div>
          </div>
        </div>
        <p style="font-size:12px; color: var(--text-muted); margin-top:6px;">Pre-filled from your plan. Keeping pension income within the 20% band is what the tax-free top-up on the next screen is for.</p>
      </details>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="cancel">Cancel</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/** The one place the top-up need is worked out from screen 1's answers. */
function isaCalcNow() {
  const isaCalc = calculateIsaNeeded({
    targetAnnualGross: wizardInputs.confirmedSalary,
    brl: wizardInputs.brl,
    pa: wizardInputs.pa,
    hrl: wizardInputs.hrl || undefined,   // the 45% threshold the set-up collects (until 6.16.0 the sums always used the standard £125,140)
    other: wizardInputs.other,
    statePension: wizardContext.statePension.amount,
    statePensionMonthlyFull: wizardContext.statePension.monthlyFull ?? null,
    spStartYm: wizardContext.statePension.startYm ?? null,
    startYm: wizardContext.selectedMonth,
    remainingMonths: wizardContext.remainingMonths,
    grossIncomeToDate: wizardInputs.grossIncomeToDate
  });
  wizardInputs._isaCalc = isaCalc;
  return isaCalc;
}

/** The choice when the top-up typed is short of what is needed (or the band is already used up). */
function choiceHtml(isaCalc, isaTyped) {
  const validation = validateIsaInput(isaTyped || 0, isaCalc.isaNeeded || 0, !!isaCalc.brlExhausted);
  if (validation.sufficient && !validation.isBrlExhausted) return '';
  const brl = fmt(wizardInputs.brl), target = fmt(wizardInputs.confirmedSalary);
  const radio = (v, strong, p) => `
        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="${v}" ${wizardInputs.taxEfficiencyChoice === v ? 'checked' : ''}>
          <div class="wizard-option-content"><strong>${strong}</strong><p>${p}</p></div>
        </label>`;
  return `
      <div class="wizard-step-desc" style="margin-top: 12px;">
        ${validation.isBrlExhausted
          ? 'The 20% band is already used up this year, so any pension income is taxed at 40% or more. Which do you want?'
          : `That is ${fmt(validation.shortfall)} short of the ${fmt(isaCalc.isaNeeded)} needed. Which do you want?`}
      </div>
      <div class="wizard-options" id="wizChoice">
        ${validation.isBrlExhausted ? '' : radio('increase', `Top up ${fmt(isaCalc.isaNeeded)} from the ISA or savings this year`, 'Keeps the pension income within the 20% band.')}
        ${radio('reduced', `Take less: ${brl} before tax this year`, 'Keeps the ISA and savings to grow; a lower income this year.')}
        ${radio('inefficient', `Take the full ${target} from the pension and pay 40% tax on the part above the band`, 'The ISA and savings are left untouched.')}
      </div>`;
}

/**
 * Screen 2: the tax-free top-up — and the choice, on the same screen, when it falls short.
 */
function renderTopUp() {
  const isaCalc = isaCalcNow();
  const months = wizardContext.remainingMonths;
  const brl = fmt(wizardInputs.brl);
  let lead, isaBox;
  if (isaCalc.brlExhausted) {
    lead = `<div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
        <p style="color: var(--danger); font-weight: 500;">Your income so far this tax year (${fmt(wizardInputs.grossIncomeToDate)}) is already above the 20% band (${brl}).</p>
        <p style="margin-top: 8px;">Any pension income this year is taxed at 40% or more, so no top-up can keep it in the 20% band.</p>
      </div>`;
    isaBox = '';
    wizardInputs.isaSavingsAllocation = 0;
  } else if (isaCalc.targetAchievableAtBrl) {
    lead = `<div class="wizard-info-box" style="background: rgba(46, 204, 113, 0.2); border: 1px solid var(--success);">
        <p style="color: var(--success); font-weight: 500;">No tax-free top-up is needed: ${fmt(wizardInputs.confirmedSalary)} before tax fits within the 20% band (${brl}).</p>
        <p style="margin-top: 8px;">Everything you take this year is taxed at 20% or less.</p>
      </div>`;
    if (wizardInputs.isaSavingsAllocation == null) wizardInputs.isaSavingsAllocation = 0;
    isaBox = `<div class="wizard-step-desc" style="margin-top: 14px;">Still want some of this year's income to come tax-free from the ISA or savings? Optional.</div>
      <div class="wizard-input"><span class="wizard-unit">£</span><input type="number" id="wizISA" value="${Math.round(wizardInputs.isaSavingsAllocation || 0)}" min="0"><span class="wizard-unit">this year</span></div>`;
  } else {
    lead = `<div class="wizard-info-box" style="background: rgba(52, 152, 219, 0.2); border: 1px solid var(--primary);">
        <p>To keep the pension income within the 20% band (${brl}) for the remaining <strong>${months} payment${months === 1 ? '' : 's'}</strong> and still reach ${fmt(wizardInputs.confirmedSalary)} before tax, <strong>you need about ${fmt(isaCalc.isaNeeded)} from your ISA or savings</strong> this tax year.</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">Money taken from an ISA or savings is not taxed, so it makes up the difference without pushing pension income into the 40% band.</p>
      </div>`;
    if (wizardInputs.isaSavingsAllocation == null) wizardInputs.isaSavingsAllocation = Math.round(isaCalc.isaNeeded);
    isaBox = `<div class="wizard-step-desc" style="margin-top: 14px;">How much can the ISA or savings provide this tax year?</div>
      <div class="wizard-input"><span class="wizard-unit">£</span><input type="number" id="wizISA" value="${Math.round(wizardInputs.isaSavingsAllocation)}" min="0"><span class="wizard-unit">this year</span></div>`;
  }
  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Tax-free top-up</div>
      ${lead}
      ${isaBox}
      <div id="wizChoiceBox">${choiceHtml(isaCalc, isaCalc.brlExhausted ? 0 : wizardInputs.isaSavingsAllocation)}</div>
      <p class="hint" id="wizChoiceAsk" style="color: var(--warning); margin: 8px 0 0; display:none;">Choose one of the ${isaCalc.brlExhausted ? 'two' : 'three'} before going on.</p>
      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/** Settle the top-up screen's answer: enough typed → efficient; short → the choice picked. False when nothing is chosen yet. */
function settleTopUp() {
  const isaCalc = wizardInputs._isaCalc || isaCalcNow();
  const typed = isaCalc.brlExhausted ? 0 : (wizardInputs.isaSavingsAllocation || 0);
  const validation = validateIsaInput(typed, isaCalc.isaNeeded || 0, !!isaCalc.brlExhausted);
  if (validation.sufficient && !validation.isBrlExhausted) {
    wizardInputs.isTaxEfficient = true;
    wizardInputs.taxEfficiencyChoice = 'efficient';
    return true;
  }
  const choice = wizardElement.querySelector('input[name="taxChoice"]:checked')?.value;
  if (!choice) return false;
  wizardInputs.taxEfficiencyChoice = choice;
  switch (choice) {
    case 'increase':
      wizardInputs.isaSavingsAllocation = isaCalc.isaNeeded;
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
  return true;
}

/**
 * Screen 3: confirm
 */
function renderConfirmation() {
  const breakdown = calculateMonthlyBreakdown({
    targetSalary: wizardInputs.confirmedSalary,
    brl: wizardInputs.brl,
    pa: wizardInputs.pa,
    hrl: wizardInputs.hrl || undefined,   // the 45% threshold the set-up collects (until 6.16.0 the sums always used the standard £125,140)
    other: wizardInputs.other,
    statePension: wizardContext.statePension.amount,
    statePensionMonthlyFull: wizardContext.statePension.monthlyFull ?? null,
    spStartYm: wizardContext.statePension.startYm ?? null,
    startYm: wizardContext.selectedMonth,
    isaSavingsAllocation: wizardInputs.isaSavingsAllocation || 0,
    remainingMonths: wizardContext.remainingMonths,
    grossIncomeToDate: wizardInputs.grossIncomeToDate,
    taxPaidToDate: wizardInputs.taxPaidToDate,
    isTaxEfficient: wizardInputs.isTaxEfficient
  });

  const modeLabel = wizardInputs.isTaxEfficient ? 'Pension income kept within the 20% band; the ISA or savings top it up' : 'The full amount from the pension, 40% tax on the part above the band';
  const modeClass = wizardInputs.isTaxEfficient ? 'success' : 'warning';
  const sp = wizardContext.statePension;
  const row = (k, v) => `<div class="wizard-summary-row"><span>${k}</span><span>${v}</span></div>`;
  const cell = (v, extra = '') => `<td style="padding: 4px 0; text-align: right;${extra}">${v}</td>`;
  const line = (label, b, taxFree) => `<tr><td style="padding: 4px 0;">${label}</td>${cell(fmt(b.gross))}${cell(taxFree ? '£0' : '-' + fmt(b.tax), taxFree ? ' color: var(--success);' : ' color: var(--danger);')}${cell(fmt(b.net))}</tr>`;

  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm</div>

      <div class="wizard-summary">
        ${row('Tax year', esc(wizardContext.taxYear))}
        ${row('Starting month', esc(getMonthName(wizardContext.selectedMonth)))}
        ${row('Payments to come this tax year (including this month\'s)', wizardContext.remainingMonths)}
        ${wizardInputs.grossIncomeToDate > 0 ? row('Income so far this year', fmt(wizardInputs.grossIncomeToDate)) : ''}
        ${wizardInputs.taxPaidToDate != null ? row('Tax already paid', fmt(wizardInputs.taxPaidToDate)) : ''}
        ${sp && sp.amount > 0 && sp.startYm && sp.startYm > wizardContext.selectedMonth ? row('State Pension', fmt(sp.monthlyFull || 0) + '/month from ' + esc(sp.startDate || sp.startYm) + ' — the months before it come from the pension') : ''}
        ${row('Income before tax', fmt(wizardInputs.confirmedSalary) + ' a year')}
        ${row('How it is taken', '<span class="' + modeClass + '">' + modeLabel + '</span>')}
        ${row('Tax-free top-up this year', fmt(wizardInputs.isaSavingsAllocation || 0))}
        ${row('Tax bands assumed', esc(bandsAssumptionText(wizardInputs)))}
      </div>

      <div class="wizard-info-box" style="margin-top: 16px;">
        <strong>What reaches your bank each month:</strong>
        <table style="width: 100%; margin-top: 12px; font-size: 13px;">
          <thead>
            <tr style="text-align: left; color: var(--text-muted);">
              <th style="padding: 4px 0;">From</th>
              <th style="padding: 4px 0; text-align: right;">Before tax</th>
              <th style="padding: 4px 0; text-align: right;">Tax</th>
              <th style="padding: 4px 0; text-align: right;">After tax</th>
            </tr>
          </thead>
          <tbody>
            ${line('Pension', breakdown.sipp)}
            ${breakdown.other.gross > 0 ? line('Other income', breakdown.other) : ''}
            ${breakdown.statePension.gross > 0 ? line('State Pension', breakdown.statePension) : ''}
            ${breakdown.isa.net > 0 ? line('ISA or savings <span style="color: var(--success);">(tax-free)</span>', breakdown.isa, true) : ''}
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
          <strong>About ${fmt(breakdown.totalNet)} a month</strong> reaches your bank
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="finish">Confirm &amp; save</button>
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

  // Last year's CPI moves the suggested income
  window._updateWizardSalary = function() {
    // Budget-schedule suggestions don't depend on this year's CPI entry (the schedule is
    // uplifted by PRIOR years' CPI only) — don't clobber them with the chain recompute.
    const fromScheduleAssumed = wizardContext && wizardContext.suggestionSource === 'budget-schedule' && wizardContext.schedulePrevCpiAssumed && wizardContext.scheduleSuggestedBase > 0;
    if (wizardContext && wizardContext.suggestionSource === 'budget-schedule' && !fromScheduleAssumed) return;
    const cpiInput = document.getElementById('wizCPI');
    const salaryInput = document.getElementById('wizSalary');
    const cpiDisplay = document.getElementById('cpiDisplay');
    const suggestedDisplay = document.getElementById('suggestedSalaryDisplay');

    if (cpiInput && salaryInput && cpiDisplay && suggestedDisplay) {
      const cpiPercent = parseFloat(cpiInput.value) || 0;
      const cpi = cpiPercent / 100;
      // Compound off last year's confirmed figure (or the plan base in year 1), netting the spending
      // decline when the plan declines — same behaviour as the Stress tester.
      const base = wizardContext.suggestionBase ?? wizardContext.baseSalary;
      const declineRate = wizardContext.declineRate || 0;
      // A bridge-year suggestion is this year's cash spread over the months left — CPI does not move it.
      const suggestedSalary = wizardContext.suggestionSource === 'bridge'
        ? Math.round(wizardContext.suggestedSalary)
        : fromScheduleAssumed
        ? Math.round(wizardContext.scheduleSuggestedBase * (1 + cpi))   // last year's CPI was assumed: the typed figure replaces it (6.11.6)
        : Math.round(base * (1 + cpi - declineRate));

      cpiDisplay.textContent = cpiPercent.toFixed(1);
      suggestedDisplay.textContent = suggestedSalary.toLocaleString('en-GB');
      const netDisplay = document.getElementById('netUpliftDisplay');
      if (netDisplay) netDisplay.textContent = ((cpi - declineRate) * 100).toFixed(1);

      salaryInput.value = suggestedSalary;
      wizardInputs.cpi = cpi;
      wizardInputs.confirmedSalary = suggestedSalary;
    }
  };
  const cpi = wizardElement.querySelector('#wizCPI');
  if (cpi) cpi.addEventListener('change', () => window._updateWizardSalary());

  // The top-up typed decides whether there is a choice to make — shown on the same screen as you type
  const isa = wizardElement.querySelector('#wizISA');
  if (isa) isa.addEventListener('input', () => {
    wizardInputs.isaSavingsAllocation = parseFloat(isa.value) || 0;
    const box = wizardElement.querySelector('#wizChoiceBox');
    if (box) box.innerHTML = choiceHtml(wizardInputs._isaCalc || isaCalcNow(), wizardInputs.isaSavingsAllocation);
    const ask = wizardElement.querySelector('#wizChoiceAsk'); if (ask) ask.style.display = 'none';
  });
}

/**
 * Handle wizard actions
 */
function handleAction(action) {
  saveCurrentInputs();
  const totalSteps = wizardScreens(wizardContext).length;
  const onTopUp = currentStep === 2;

  switch (action) {
    case 'cancel':
      hideWizard();
      if (onCompleteCallback) onCompleteCallback({ completed: false, cancelled: true });
      break;

    case 'next':
      if (onTopUp && !settleTopUp()) {
        const ask = wizardElement.querySelector('#wizChoiceAsk'); if (ask) ask.style.display = '';
        break;
      }
      if (currentStep < totalSteps) { currentStep++; renderWizard(); }
      break;

    case 'back':
      if (currentStep > 1) {
        // Back from confirm: a "take less" choice set the income to the band limit — undo it so the first screen shows what was typed
        if (currentStep === 3 && wizardInputs.taxEfficiencyChoice === 'reduced' && wizardInputs._salaryBeforeChoice != null) wizardInputs.confirmedSalary = wizardInputs._salaryBeforeChoice;
        currentStep--;
        renderWizard();
      }
      break;

    case 'finish': {
      // Re-entry guard: a double-click (or queued clicks) must not run the save twice or leave
      // duplicate dialogs behind. Disable the button for the duration of the save.
      const btn = wizardElement?.querySelector('[data-action="finish"]');
      if (btn) { if (btn.disabled) break; btn.disabled = true; btn.textContent = 'Saving…'; }
      finishWizard().finally(() => { if (btn) { btn.disabled = false; btn.textContent = 'Confirm & save'; } });
      break;
    }
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
  if (cpi) wizardInputs.cpi = (parseFloat(cpi.value) || DECISION_ASSUMED_CPI * 100) / 100;

  const salary = document.getElementById('wizSalary');
  if (salary) {
    const typed = parseFloat(salary.value) || 30000;
    if (typed !== wizardInputs.confirmedSalary) wizardInputs.isaSavingsAllocation = null;   // a new income: the top-up is suggested afresh
    wizardInputs.confirmedSalary = typed;
    wizardInputs._salaryBeforeChoice = typed;
  }

  const other = document.getElementById('wizOther');
  if (other) wizardInputs.other = parseFloat(other.value) || 0;

  const cgtUsed = document.getElementById('wizCgtUsed');
  if (cgtUsed) wizardInputs.cgtExemptionUsed = Math.max(0, parseFloat(cgtUsed.value) || 0);

  const isa = document.getElementById('wizISA');
  if (isa) wizardInputs.isaSavingsAllocation = parseFloat(isa.value) || 0;

  const incomeToDate = document.getElementById('wizIncomeToDate');
  if (incomeToDate) wizardInputs.grossIncomeToDate = parseFloat(incomeToDate.value) || 0;
  const taxPaid = document.getElementById('wizTaxPaidToDate');
  if (taxPaid) wizardInputs.taxPaidToDate = taxPaid.value.trim() === '' ? null : Math.max(0, parseFloat(taxPaid.value) || 0);
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
    hrl: wizardInputs.hrl || undefined,   // the 45% threshold the set-up collects (until 6.16.0 the sums always used the standard £125,140)
    other: wizardInputs.other,
    statePension: wizardContext.statePension.amount,
    statePensionMonthlyFull: wizardContext.statePension.monthlyFull ?? null,
    spStartYm: wizardContext.statePension.startYm ?? null,
    startYm: wizardContext.selectedMonth,
    isaSavingsAllocation: wizardInputs.isaSavingsAllocation || 0,
    remainingMonths: wizardContext.remainingMonths,
    grossIncomeToDate: wizardInputs.grossIncomeToDate,
    taxPaidToDate: wizardInputs.taxPaidToDate,
    isTaxEfficient: wizardInputs.isTaxEfficient
  });

  // Build the tax year config
  const config = buildTaxYearConfig({
    pa: wizardInputs.pa,
    brl: wizardInputs.brl,
    hrl: wizardInputs.hrl,
    cpi: wizardInputs.cpi,
    other: wizardInputs.other,
    cgtExemptionUsed: wizardInputs.cgtExemptionUsed || 0,
    isaSavingsAllocation: wizardInputs.isaSavingsAllocation || 0,
    isTaxEfficient: wizardInputs.isTaxEfficient,
    taxEfficiencyChoice: wizardInputs.taxEfficiencyChoice,
    grossIncomeToDate: wizardInputs.grossIncomeToDate,
    taxPaidToDate: wizardInputs.taxPaidToDate,
    startMonth: parseInt(wizardContext.selectedMonth.split('-')[1]),
    confirmedSalary: wizardInputs.confirmedSalary,
    remainingMonths: wizardContext.remainingMonths,
    statePension: wizardContext.statePension.amount,
    statePensionMonthlyFull: wizardContext.statePension.monthlyFull ?? null,
    spStartYm: wizardContext.statePension.startYm ?? null,
    startYm: wizardContext.selectedMonth,
    monthlyBreakdown: breakdown
  });

  console.log(`Tax Year Wizard: Saving config for ${wizardContext.taxYear}`, config);

  try {
    // Save to repository, then VERIFY the write round-trips — a silently-lost tax year leaves
    // the plan half-configured (decision calculates in-session but the year vanishes on reload).
    await saveTaxYearConfig(wizardContext.taxYear, config);
    const check = await getTaxYearConfigAsync(wizardContext.taxYear);
    if (!check || !check.yearSetupComplete) {
      throw new Error('the saved tax year did not read back — please try Confirm again');
    }
    try { await lockPlanIfNeeded('tax year set up'); } catch (e) { console.warn('Auto-lock failed (non-fatal):', e); }
    console.log(`Tax Year Wizard: Successfully saved config for ${wizardContext.taxYear}`);
  } catch (error) {
    console.error(`Tax Year Wizard: Failed to save config for ${wizardContext.taxYear}`, error);
    if (typeof window.showToast === 'function') {
      window.showToast(`Error saving tax year configuration: ${error.message}`, 'error');
    }
    return;
  }

  hideWizard();

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
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }

    .wizard-summary-row > span:last-child { text-align: right; }

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
