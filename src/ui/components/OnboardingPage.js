/**
 * Onboarding Page component
 * Shown after a new user logs in for the first time (no scenarios exist).
 * Explains all tools in detail and directs the user to set up their first plan.
 */

let onboardingElement = null;

/**
 * Initialize the onboarding page
 * @param {HTMLElement} container - Container element
 * @param {string} userName - User's display name or email
 * @param {Function} onStartWizard - Callback when user clicks to start the wizard
 */
export function initOnboardingPage(container, userName, onStartWizard) {
  onboardingElement = container;
  renderOnboardingPage(userName, onStartWizard);
}

/**
 * Render the onboarding page content
 */
function renderOnboardingPage(userName, onStartWizard) {
  if (!onboardingElement) return;

  const displayName = userName || 'there';

  onboardingElement.innerHTML = `
    <div class="onboarding-page">
      <div class="onboarding-content">

        <div class="onboarding-welcome">
          <h1>Welcome, ${displayName}!</h1>
          <p>Your account is set up and ready to go. Here's what Pension Planner can do for you.</p>
        </div>

        <!-- Tool: Stress Tester -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 1</span>
            <h2>Stress Tester</h2>
          </div>
          <p class="onboarding-tool-question">"Can I afford to retire?"</p>
          <p>The Stress Tester runs 1,000 Monte Carlo simulations using real historical stock market and bond data going back decades. It shows you:</p>
          <ul>
            <li>The range of possible outcomes for your pension pot</li>
            <li>How likely your money is to last through retirement</li>
            <li>What happens if markets crash early in your retirement</li>
            <li>Whether your target income is sustainable</li>
          </ul>
          <p class="onboarding-tool-who"><strong>Best for:</strong> Anyone thinking about retirement, whether you're 10 years away or already drawing your pension. Start here.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Your pension fund values (equity, bonds, cash), desired yearly income, and expected retirement duration.</p>
        </div>

        <!-- Tool: Decision Tool -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 2</span>
            <h2>Monthly Decision Tool</h2>
          </div>
          <p class="onboarding-tool-question">"Where should I take money from this month?"</p>
          <p>Once you're drawing your pension, this tool helps you make the optimal withdrawal each month. It considers:</p>
          <ul>
            <li>Current fund values vs target minimums</li>
            <li>Tax efficiency (personal allowance, basic/higher rate thresholds)</li>
            <li>Whether to enter "protection mode" during market downturns</li>
            <li>ISA top-up recommendations</li>
          </ul>
          <p class="onboarding-tool-who"><strong>Best for:</strong> People already in pension drawdown, or about to start. You can always add this tool later if you're not ready yet.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Current fund values, tax year details, and your desired income level.</p>
        </div>

        <!-- Future: Accumulation -->
        <div class="onboarding-tool-section future">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge future">Coming Soon</span>
            <h2>Accumulation Planner</h2>
          </div>
          <p class="onboarding-tool-question">"Am I saving enough for retirement?"</p>
          <p>A future tool for people still building their pension. Project how your contributions and investment growth could add up over time.</p>
        </div>

        <!-- Reassurance -->
        <div class="onboarding-reassurance">
          <p><strong>You don't have to use everything.</strong> When you set up a plan, you choose which tools you want. You can always add more later as your needs change.</p>
        </div>

        <!-- CTA -->
        <div class="onboarding-cta">
          <button class="onboarding-btn primary" id="onboardingStartWizard">Set Up Your First Plan</button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('onboardingStartWizard').addEventListener('click', onStartWizard);
}

/**
 * Hide the onboarding page
 */
export function hideOnboardingPage() {
  if (onboardingElement) {
    onboardingElement.style.display = 'none';
  }
}

/**
 * Show the onboarding page
 */
export function showOnboardingPage() {
  if (onboardingElement) {
    onboardingElement.style.display = 'block';
  }
}

/**
 * Get onboarding page styles
 */
export function getOnboardingPageStyles() {
  return `
    .onboarding-page {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg);
      z-index: 999;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .onboarding-content {
      max-width: 680px;
      width: 100%;
    }

    .onboarding-welcome {
      text-align: center;
      margin-bottom: 40px;
    }

    .onboarding-welcome h1 {
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 10px;
    }

    .onboarding-welcome p {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .onboarding-tool-section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .onboarding-tool-section.future {
      opacity: 0.6;
    }

    .onboarding-tool-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .onboarding-tool-badge {
      background: var(--primary);
      color: var(--bg);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .onboarding-tool-badge.future {
      background: var(--border);
      color: var(--text-muted);
    }

    .onboarding-tool-header h2 {
      font-size: 18px;
      color: var(--text);
      margin: 0;
    }

    .onboarding-tool-question {
      font-style: italic;
      color: var(--primary);
      font-size: 15px;
      margin-bottom: 10px;
    }

    .onboarding-tool-section p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .onboarding-tool-section ul {
      margin: 10px 0 14px 0;
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.8;
    }

    .onboarding-tool-who,
    .onboarding-tool-need {
      font-size: 13px !important;
      background: rgba(0, 0, 0, 0.15);
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 6px !important;
    }

    .onboarding-tool-who strong,
    .onboarding-tool-need strong {
      color: var(--text);
    }

    .onboarding-reassurance {
      text-align: center;
      padding: 20px;
      margin: 24px 0;
    }

    .onboarding-reassurance p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .onboarding-reassurance strong {
      color: var(--text);
    }

    .onboarding-cta {
      text-align: center;
      margin-bottom: 40px;
    }

    .onboarding-btn {
      padding: 16px 40px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .onboarding-btn.primary {
      background: linear-gradient(135deg, var(--primary) 0%, #5a9aba 100%);
      color: var(--bg);
    }

    .onboarding-btn.primary:hover {
      opacity: 0.9;
    }

    @media (max-width: 600px) {
      .onboarding-page {
        padding: 24px 16px;
      }

      .onboarding-welcome h1 {
        font-size: 24px;
      }

      .onboarding-tool-section {
        padding: 18px;
      }
    }
  `;
}
