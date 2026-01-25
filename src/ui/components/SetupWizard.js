/**
 * Setup Wizard component for new user onboarding
 * Guides users through initial configuration of the pension planner
 */

// Wizard state
let wizardElement = null;
let onCompleteCallback = null;
let wizardData = {
  // Intro done flag
  introDone: false,
  // Stress tester settings
  baseSalary: 30000,
  otherIncome: 0,
  // State Pension - from HMRC forecast
  spStartDate: '',      // e.g. "21 April 2037"
  spWeeklyAmount: 0,    // e.g. 230.25
  equityMin: 250000,
  bondMin: 200000,
  cashTarget: 50000,
  duration: 35,
  taxMode: 'inflates',
  // Decision tool settings (copied from stress or entered)
  decisionSalary: 30000,
  decisionEquity: 250000,
  decisionBond: 200000,
  decisionCash: 50000,
  decisionDuration: 35
};

// Current step tracking
let currentPhase = 'intro'; // 'intro', 'stress', 'decision'
let currentStep = 1;

/**
 * Reset wizard state to initial values
 */
function resetWizardState() {
  currentPhase = 'intro';
  currentStep = 1;
  wizardData = {
    introDone: false,
    baseSalary: 30000,
    otherIncome: 0,
    spStartDate: '',
    spWeeklyAmount: 0,
    equityMin: 250000,
    bondMin: 200000,
    cashTarget: 50000,
    duration: 35,
    taxMode: 'inflates',
    decisionSalary: 30000,
    decisionEquity: 250000,
    decisionBond: 200000,
    decisionCash: 50000,
    decisionDuration: 35
  };
}

/**
 * Initialize the setup wizard
 * @param {HTMLElement} container - Container element
 * @param {Function} onComplete - Callback when wizard completes
 */
export function initSetupWizard(container, onComplete) {
  wizardElement = container;
  onCompleteCallback = onComplete;
  // Reset to beginning on every init
  resetWizardState();
  renderWizard();
}

/**
 * Render the current wizard state
 */
function renderWizard() {
  if (!wizardElement) return;

  if (currentPhase === 'intro') {
    renderIntroWizard();
  } else if (currentPhase === 'stress') {
    renderStressWizard();
  } else if (currentPhase === 'decision') {
    renderDecisionWizard();
  }
}

/**
 * Render intro wizard
 */
function renderIntroWizard() {
  const totalSteps = 2;

  wizardElement.innerHTML = `
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">A tool to help you plan and manage your SIPP pension drawdown</div>

        <div class="wizard-progress">
          ${renderProgressDots(totalSteps, currentStep)}
        </div>

        ${currentStep === 1 ? renderIntroStep1() : renderIntroStep2()}
      </div>
    </div>
  `;

  attachWizardListeners();
}

/**
 * Render intro step 1 - What is this app?
 */
function renderIntroStep1() {
  return `
    <div class="wizard-step">
      <div class="wizard-step-title">What does this app do?</div>
      <div class="wizard-step-desc">
        This app helps you answer two important questions about your pension:
      </div>

      <div class="wizard-info-box">
        <div class="wizard-info-item">
          <strong>1. Stress Tester</strong>
          <p>"Can I afford to retire?" This tool runs 1,000 simulations using real historical market data to show you the range of possible outcomes for your pension.</p>
        </div>
        <div class="wizard-info-item">
          <strong>2. Decision Tool</strong>
          <p>"Where should I take money from this month?" Once you're retired, this tool helps you decide each month which fund to withdraw from to maximise tax efficiency.</p>
        </div>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `;
}

/**
 * Render intro step 2 - Start with Stress Tester
 */
function renderIntroStep2() {
  return `
    <div class="wizard-step">
      <div class="wizard-step-title">Start with the Stress Tester</div>
      <div class="wizard-step-desc">
        Whether you're already retired or still planning, the Stress Tester is where you should start.
      </div>

      <div class="wizard-info-box">
        <p>The Stress Tester will help you understand:</p>
        <ul>
          <li>How much yearly income your pension could realistically provide</li>
          <li>How long your money might last under different market conditions</li>
          <li>What happens if markets crash early in your retirement</li>
          <li>Whether your current savings are on track</li>
        </ul>
      </div>

      <div class="wizard-example">
        <strong>Next:</strong> We'll set up your Stress Tester with some basic questions about your pension.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="start-stress">Set Up Stress Tester</button>
      </div>
    </div>
  `;
}

/**
 * Render stress tester wizard
 */
function renderStressWizard() {
  const totalSteps = 6;

  wizardElement.innerHTML = `
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${renderProgressDots(totalSteps, currentStep)}
        </div>

        ${renderStressStep(currentStep)}
      </div>
    </div>
  `;

  attachWizardListeners();
}

/**
 * Render a stress wizard step
 */
function renderStressStep(step) {
  switch (step) {
    case 1:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${wizardData.baseSalary}">
            <span class="wizard-unit">per year</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you want £2,500 per month, enter £30,000 here.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="skip-stress">Skip</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 2:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">Do you have other pension income?</div>
          <div class="wizard-step-desc">
            Enter any other guaranteed pension income you'll receive (like a workplace defined benefit pension).
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizOther" value="${wizardData.otherIncome}">
            <span class="wizard-unit">per year</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you have a company pension paying £5,000/year, enter £5,000.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 3:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">What about the State Pension?</div>
          <div class="wizard-step-desc">
            Get your forecast from <a href="https://www.tax.service.gov.uk/check-your-state-pension/" target="_blank" style="color: var(--primary);">gov.uk/check-your-state-pension</a>
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Start Date (from HMRC)</label>
              <div class="wizard-input">
                <input type="text" id="wizSpStartDate" value="${wizardData.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${wizardData.spWeeklyAmount || ''}" step="0.01" placeholder="e.g. 221.20">
              </div>
            </div>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> Copy the exact date and weekly amount from your HMRC State Pension forecast. Leave blank if you don't have one yet.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 4:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">How big are your pension funds?</div>
          <div class="wizard-step-desc">
            Enter the minimum amount you want to keep in each type of investment at the start of retirement.
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Stocks/Shares (Higher Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizEquityMin" value="${wizardData.equityMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds (Medium Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizBondMin" value="${wizardData.bondMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash (Low Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizCashTarget" value="${wizardData.cashTarget}">
              </div>
            </div>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> These are target minimums. The simulation draws from stocks/bonds first and keeps cash as an emergency buffer.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 5:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">How long should your money last?</div>
          <div class="wizard-step-desc">
            How many years of retirement do you want to plan for?
          </div>

          <div class="wizard-input">
            <input type="number" id="wizDuration" value="${wizardData.duration}" style="max-width: 100px;">
            <span class="wizard-unit">years</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you're 55 and want money until age 90, enter 35 years.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 6:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">One last thing: Tax thresholds</div>
          <div class="wizard-step-desc">
            Will the government raise tax thresholds with inflation, or keep them frozen?
          </div>

          <div class="wizard-input">
            <select id="wizTaxMode">
              <option value="inflates" ${wizardData.taxMode === 'inflates' ? 'selected' : ''}>Standard (rise with inflation)</option>
              <option value="frozen" ${wizardData.taxMode === 'frozen' ? 'selected' : ''}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">Continue to Decision Tool</button>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

/**
 * Render decision tool wizard
 */
function renderDecisionWizard() {
  const totalSteps = 4;

  wizardElement.innerHTML = `
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${renderProgressDots(totalSteps, currentStep)}
        </div>

        ${renderDecisionStep(currentStep)}
      </div>
    </div>
  `;

  attachWizardListeners();
}

/**
 * Render a decision wizard step
 */
function renderDecisionStep(step) {
  switch (step) {
    case 1:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${wizardData.decisionSalary}">
            <span class="wizard-unit">per year (before tax)</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you want about £2,000 per month after tax, you might need £30,000 gross.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="skip-decision">Skip</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 2:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">What are your fund size targets?</div>
          <div class="wizard-step-desc">
            Enter the minimum you want in each fund at the start of retirement. The tool uses these to decide when to enter "protection mode".
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Stocks/Shares</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDEquityMin" value="${wizardData.decisionEquity}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDBondMin" value="${wizardData.decisionBond}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDCashTarget" value="${wizardData.decisionCash}">
              </div>
            </div>
          </div>

          <div class="wizard-example">
            <strong>Protection Mode:</strong> If your growth funds drop below these minimums, the tool recommends drawing from cash instead.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 3:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">How long should your money last?</div>
          <div class="wizard-step-desc">
            The fund minimums will gradually reduce to zero over this period. This is your "depletion curve."
          </div>

          <div class="wizard-input">
            <input type="number" id="wizDDuration" value="${wizardData.decisionDuration}" style="max-width: 100px;">
            <span class="wizard-unit">years</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you're 55 and planning to age 90, enter 35 years.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;

    case 4:
      return `
        <div class="wizard-step">
          <div class="wizard-step-title">You're all set!</div>
          <div class="wizard-step-desc">
            The Decision Tool will now help you track monthly withdrawals. Each month, enter your current fund values and it will tell you:
          </div>

          <ul class="wizard-list">
            <li>How much to withdraw from your SIPP</li>
            <li>Whether you need ISA top-up</li>
            <li>Which fund to take money from</li>
            <li>Whether to enter protection mode</li>
          </ul>

          <div class="wizard-example">
            <strong>Next Step:</strong> Go to "Tax Years" to set up your personal tax details (allowance, other income, state pension dates).
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish">Finish Setup</button>
          </div>
        </div>
      `;

    default:
      return '';
  }
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
 * Attach event listeners to wizard buttons
 */
function attachWizardListeners() {
  const buttons = wizardElement.querySelectorAll('[data-action]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action));
  });
}

/**
 * Handle wizard actions
 */
function handleAction(action) {
  // Save any input values before navigation
  saveCurrentInputs();

  switch (action) {
    case 'skip-all':
      finishWizard();
      break;

    case 'next':
      if (currentPhase === 'intro') {
        if (currentStep < 2) {
          currentStep++;
          renderWizard();
        }
      } else if (currentPhase === 'stress') {
        if (currentStep < 6) {
          currentStep++;
          renderWizard();
        }
      } else if (currentPhase === 'decision') {
        if (currentStep < 4) {
          currentStep++;
          renderWizard();
        }
      }
      break;

    case 'back':
      if (currentStep > 1) {
        currentStep--;
        renderWizard();
      }
      break;

    case 'start-stress':
      currentPhase = 'stress';
      currentStep = 1;
      renderWizard();
      break;

    case 'skip-stress':
      currentPhase = 'decision';
      currentStep = 1;
      // Copy defaults to decision settings
      wizardData.decisionSalary = wizardData.baseSalary;
      wizardData.decisionEquity = wizardData.equityMin;
      wizardData.decisionBond = wizardData.bondMin;
      wizardData.decisionCash = wizardData.cashTarget;
      wizardData.decisionDuration = wizardData.duration;
      renderWizard();
      break;

    case 'finish-stress':
      currentPhase = 'decision';
      currentStep = 1;
      // Copy stress settings to decision settings
      wizardData.decisionSalary = wizardData.baseSalary;
      wizardData.decisionEquity = wizardData.equityMin;
      wizardData.decisionBond = wizardData.bondMin;
      wizardData.decisionCash = wizardData.cashTarget;
      wizardData.decisionDuration = wizardData.duration;
      renderWizard();
      break;

    case 'skip-decision':
      finishWizard();
      break;

    case 'finish':
      finishWizard();
      break;
  }
}

/**
 * Save current input values
 */
function saveCurrentInputs() {
  // Stress wizard inputs
  const baseSalary = document.getElementById('wizBaseSalary');
  if (baseSalary) wizardData.baseSalary = parseFloat(baseSalary.value) || 30000;

  const other = document.getElementById('wizOther');
  if (other) wizardData.otherIncome = parseFloat(other.value) || 0;

  const spStartDate = document.getElementById('wizSpStartDate');
  if (spStartDate) wizardData.spStartDate = spStartDate.value.trim() || '';

  const spWeeklyAmount = document.getElementById('wizSpWeeklyAmount');
  if (spWeeklyAmount) wizardData.spWeeklyAmount = parseFloat(spWeeklyAmount.value) || 0;

  const equityMin = document.getElementById('wizEquityMin');
  if (equityMin) wizardData.equityMin = parseFloat(equityMin.value) || 250000;

  const bondMin = document.getElementById('wizBondMin');
  if (bondMin) wizardData.bondMin = parseFloat(bondMin.value) || 200000;

  const cashTarget = document.getElementById('wizCashTarget');
  if (cashTarget) wizardData.cashTarget = parseFloat(cashTarget.value) || 50000;

  const duration = document.getElementById('wizDuration');
  if (duration) wizardData.duration = parseInt(duration.value) || 35;

  const taxMode = document.getElementById('wizTaxMode');
  if (taxMode) wizardData.taxMode = taxMode.value;

  // Decision wizard inputs
  const dBaseSalary = document.getElementById('wizDBaseSalary');
  if (dBaseSalary) wizardData.decisionSalary = parseFloat(dBaseSalary.value) || 30000;

  const dEquityMin = document.getElementById('wizDEquityMin');
  if (dEquityMin) wizardData.decisionEquity = parseFloat(dEquityMin.value) || 250000;

  const dBondMin = document.getElementById('wizDBondMin');
  if (dBondMin) wizardData.decisionBond = parseFloat(dBondMin.value) || 200000;

  const dCashTarget = document.getElementById('wizDCashTarget');
  if (dCashTarget) wizardData.decisionCash = parseFloat(dCashTarget.value) || 50000;

  const dDuration = document.getElementById('wizDDuration');
  if (dDuration) wizardData.decisionDuration = parseInt(dDuration.value) || 35;
}

/**
 * Finish the wizard and trigger callback
 */
function finishWizard() {
  saveCurrentInputs();

  if (onCompleteCallback) {
    onCompleteCallback(wizardData);
  }
}

/**
 * Hide the wizard
 */
export function hideSetupWizard() {
  if (wizardElement) {
    wizardElement.style.display = 'none';
  }
}

/**
 * Show the wizard
 */
export function showSetupWizard() {
  if (wizardElement) {
    wizardElement.style.display = 'block';
    // Reset to start
    currentPhase = 'intro';
    currentStep = 1;
    renderWizard();
  }
}

/**
 * Get the wizard data
 */
export function getWizardData() {
  return { ...wizardData };
}

/**
 * Get wizard styles
 */
export function getSetupWizardStyles() {
  return `
    .wizard-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .wizard-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      max-width: 600px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
    }

    .wizard-title {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .wizard-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 24px;
    }

    .wizard-progress {
      display: flex;
      gap: 6px;
      margin-bottom: 24px;
    }

    .wizard-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border);
    }

    .wizard-dot.active {
      background: var(--primary);
    }

    .wizard-dot.done {
      background: var(--success);
    }

    .wizard-step {
      margin-bottom: 24px;
    }

    .wizard-step-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text);
    }

    .wizard-step-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .wizard-info-box {
      margin: 20px 0;
      padding: 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }

    .wizard-info-item {
      margin-bottom: 16px;
    }

    .wizard-info-item:last-child {
      margin-bottom: 0;
    }

    .wizard-info-item strong {
      color: var(--primary);
    }

    .wizard-info-item p {
      margin: 8px 0 0 0;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
    }

    .wizard-info-box ul {
      margin: 12px 0 0 0;
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.8;
    }

    .wizard-list {
      margin: 16px 0;
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.8;
    }

    .wizard-input {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .wizard-input input,
    .wizard-input select {
      flex: 1;
      max-width: 200px;
      padding: 12px 14px;
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 14px;
    }

    .wizard-input input:focus,
    .wizard-input select:focus {
      outline: none;
      border-color: var(--primary);
    }

    .wizard-unit {
      color: var(--text-muted);
      font-size: 13px;
    }

    .wizard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .wizard-grid-item label {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .wizard-grid-item .wizard-input {
      margin-bottom: 0;
    }

    .wizard-grid-item .wizard-input input {
      max-width: none;
      width: 100%;
    }

    .wizard-example {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 8px;
    }

    .wizard-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: space-between;
    }

    .wizard-btn {
      padding: 14px 28px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .wizard-btn.primary {
      background: linear-gradient(135deg, var(--primary) 0%, #5a9aba 100%);
      color: var(--bg);
    }

    .wizard-btn.primary:hover {
      opacity: 0.9;
    }

    .wizard-btn.secondary {
      background: var(--card-alt);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .wizard-btn.secondary:hover {
      background: var(--border);
    }

    @media (max-width: 600px) {
      .wizard-box {
        padding: 20px;
      }

      .wizard-title {
        font-size: 20px;
      }

      .wizard-grid {
        grid-template-columns: 1fr;
      }

      .wizard-buttons {
        flex-direction: column-reverse;
      }

      .wizard-btn {
        width: 100%;
      }
    }
  `;
}
