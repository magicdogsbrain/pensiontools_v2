/**
 * Accumulation Engine — pre-retirement contribution & growth projection (Tier 3, Aug 2026).
 *
 * Net-first, like the rest of the app: the user says what they can spare from take-home pay;
 * this module works out the gross pension purchase under their scheme's relief method, projects
 * the pot to retirement, and checks it against the plan's own budget-derived target ("on track
 * for YOUR retirement, not a rule of thumb").
 *
 * Deterministic projection uses the FCA point-of-sale rates (2% / 5% / 8% nominal, the
 * regulator-prescribed low/mid/high for tax-advantaged products) with results shown in today's
 * money. The stochastic view reuses the existing Monte-Carlo engine via requiredPotForSuccess.
 *
 * UK rules encoded (2026/27 — update annually):
 *   Annual Allowance £60,000 (tapered £1 per £2 of adjusted income over £260k, floor £10k;
 *   both threshold £200k AND adjusted £260k tests must be breached — we warn on salary alone,
 *   which is conservative). MPAA £10,000 once flexible income has been taken (the Decision
 *   tool KNOWS this — any history record with taxFree > 0 means UFPLS income was taken).
 *   Normal minimum pension age rises 55 → 57 on 6 April 2028 (cliff edge).
 *   Salary-sacrifice NI relief capped at £2,000/yr sacrificed from April 2029 (Budget 2025).
 *   Lump Sum Allowance £268,275 → tax-free cash effectively dilutes below 25% once the pot
 *   exceeds £1,073,100.
 */

import { runMonteCarlo } from './SimulationEngine.js';

export const ACCUMULATION_RULES = {
  ANNUAL_ALLOWANCE: 60000,
  TAPER_THRESHOLD_INCOME: 200000,
  TAPER_ADJUSTED_INCOME: 260000,
  MPAA: 10000,
  NMPA_CHANGE_DATE: '2028-04-06',
  NMPA_NEW: 57,
  SALSAC_NI_CAP_FROM: 2029,
  SALSAC_NI_CAP: 2000,
  LSA: 268275,
  LSA_POT_THRESHOLD: 1073100
};

// FCA point-of-sale projection rates (nominal, tax-advantaged): the mandated 3-point spread.
export const FCA_RATES = { low: 0.02, mid: 0.05, high: 0.08 };

/** Marginal income-tax rate on the top slice of a salary (simple UK bands, no PA taper). */
export function marginalRate(salary, pa = 12570, brl = 50270, hrl = 125140) {
  if (salary <= pa) return 0;
  if (salary <= brl) return 0.20;
  if (salary <= hrl) return 0.40;
  return 0.45;
}

/** Employee NI rate on the top slice (8% to the UEL ≈ BRL, 2% above). */
export function marginalNiRate(salary, brl = 50270) {
  if (salary <= 12570) return 0;
  return salary <= brl ? 0.08 : 0.02;
}

/**
 * From "£N/month out of my take-home" to the gross monthly pension purchase.
 * @returns {{grossMonthly, employerMonthly, totalMonthly, reliefMonthly, niSavedMonthly,
 *            hrClaimMonthly, costPerPound, notes: string[]}}
 */
export function contributionBreakdown({ netMonthly = 0, salary = 0, schemeType = 'ras', employerMonthly = 0 }) {
  const mt = marginalRate(salary);
  const ni = marginalNiRate(salary);
  const notes = [];
  let grossMonthly = 0, hrClaimMonthly = 0, niSavedMonthly = 0;

  if (schemeType === 'salsac') {
    // Sacrificed salary escapes income tax AND employee NI: £N net costs N/(1-mt-ni) gross.
    grossMonthly = netMonthly / Math.max(0.2, 1 - mt - ni);
    niSavedMonthly = grossMonthly * ni;
    notes.push('Salary sacrifice also saves your employer 15% NI — many employers add some or all of that; ask. From April 2029 the NI exemption is capped at £2,000/yr sacrificed (Autumn Budget 2025).');
  } else if (schemeType === 'netpay') {
    grossMonthly = netMonthly / Math.max(0.2, 1 - mt);
  } else {
    // Relief at source: provider adds basic-rate relief (gross = net/0.8); higher/additional
    // rate must be CLAIMED from HMRC — the classic unclaimed-relief money-loser.
    grossMonthly = netMonthly / 0.8;
    if (mt > 0.20) {
      hrClaimMonthly = grossMonthly * (mt - 0.20);
      notes.push('You must CLAIM the extra ' + Math.round((mt - 0.20) * 100) + '% relief (≈£' + Math.round(hrClaimMonthly) + '/mo) from HMRC via self-assessment — it is not automatic and is commonly missed.');
    }
    if (mt === 0) notes.push('Non-taxpayers still get the 25% top-up on contributions up to £3,600 gross/yr (£2,880 net) — relief at source only.');
  }

  const totalMonthly = grossMonthly + (employerMonthly || 0);
  return {
    grossMonthly,
    employerMonthly: employerMonthly || 0,
    totalMonthly,
    reliefMonthly: grossMonthly - netMonthly,
    niSavedMonthly,
    hrClaimMonthly,
    costPerPound: totalMonthly > 0 ? netMonthly / totalMonthly : 1,
    notes
  };
}

/**
 * Rule warnings for a contribution plan. mpaaTriggered comes from the DECISION TOOL's history
 * (any saved decision with a UFPLS tax-free slice) — the cross-check no consumer tool does.
 */
export function contributionWarnings({ annualGrossTotal = 0, salary = 0, mpaaTriggered = false, currentAge = 0, retirementAge = 0, projectedPotHigh = 0 }) {
  const R = ACCUMULATION_RULES;
  const out = [];
  if (mpaaTriggered && annualGrossTotal > R.MPAA) {
    out.push({ severity: 'danger', message: 'MPAA: your Decision-tool history shows UFPLS income has been taken, which permanently caps tax-relieved contributions at £10,000/yr — this plan exceeds it. The excess is taxed back via an annual-allowance charge.' });
  }
  if (annualGrossTotal > R.ANNUAL_ALLOWANCE) {
    out.push({ severity: 'warning', message: 'Annual Allowance: total contributions exceed £60,000/yr. Unused allowance from the previous 3 tax years (carry-forward) may cover it — otherwise the excess is taxed at your marginal rate.' });
  }
  if (salary > R.TAPER_THRESHOLD_INCOME) {
    out.push({ severity: 'warning', message: 'High income: above £200k threshold income the Annual Allowance may taper (£1 lost per £2 of adjusted income over £260k, floor £10,000).' });
  }
  if (retirementAge > 0 && retirementAge < R.NMPA_NEW) {
    const reaches55 = new Date().getFullYear() + Math.max(0, 55 - currentAge);
    if (reaches55 >= 2028 || retirementAge < 55) {
      out.push({ severity: 'warning', message: 'Access age: the normal minimum pension age rises to 57 on 6 April 2028. Retiring before 57 means bridging from ISA/other savings until the pension can be touched.' });
    }
  }
  if (projectedPotHigh > R.LSA_POT_THRESHOLD) {
    out.push({ severity: 'info', message: 'Large pot: above £1,073,100 the £268,275 Lump Sum Allowance means your effective tax-free cash falls below 25% — worth planning the crystallisation strategy early.' });
  }
  return out;
}

/**
 * Deterministic projection at the three FCA rates, in TODAY'S money.
 * @returns {Array<{age, year, potLow, potMid, potHigh, contributedToDate}>} one row per year
 */
export function projectAccumulation({ currentAge, retirementAge, potNow = 0, totalMonthly = 0, escalationPct = 0, assumedCpi = 0.025 }) {
  const years = Math.max(0, Math.round(retirementAge - currentAge));
  const rows = [];
  const pots = { low: potNow, mid: potNow, high: potNow };
  let monthly = totalMonthly;
  let contributed = 0;
  rows.push({ age: currentAge, year: 0, potLow: potNow, potMid: potNow, potHigh: potNow, contributedToDate: 0 });
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      for (const k of Object.keys(pots)) pots[k] = pots[k] * (1 + FCA_RATES[k] / 12) + monthly;
      contributed += monthly;
    }
    monthly *= 1 + (escalationPct || 0) / 100;
    const defl = Math.pow(1 + assumedCpi, y);
    rows.push({
      age: currentAge + y, year: y,
      potLow: pots.low / defl, potMid: pots.mid / defl, potHigh: pots.high / defl,
      contributedToDate: contributed
    });
  }
  return rows;
}

/**
 * Pot needed at retirement for >= successTarget Monte-Carlo success against the CURRENT stress
 * plan (the budget-derived target, duration, allocation shape, SP, access method — everything the
 * user already configured). Binary search, scaling the three pots proportionally.
 * @param {object} baseConfig - createSimulationConfigFromSettings() output
 * @param {number} successTarget - e.g. 0.85
 * @param {number} runs - MC runs per probe (300 keeps the search fast)
 * @returns {{requiredPot: number, successAtRequired: number}}
 */
export function requiredPotForSuccess(baseConfig, successTarget = 0.85, runs = 300) {
  const basePot = (baseConfig.equityStart || 0) + (baseConfig.bondStart || 0) + (baseConfig.cashStart || 0);
  const shape = basePot > 0
    ? { e: baseConfig.equityStart / basePot, b: baseConfig.bondStart / basePot, c: baseConfig.cashStart / basePot }
    : { e: 0.6, b: 0.3, c: 0.1 };
  const successAt = (pot) => {
    const cfg = {
      ...baseConfig,
      equityStart: pot * shape.e, bondStart: pot * shape.b, cashStart: pot * shape.c,
      // Scale the glidepath floors with the pot so the allocation POLICY is preserved
      equityMin: (baseConfig.equityMin || 0) * (basePot > 0 ? pot / basePot : 1),
      bondMin: (baseConfig.bondMin || 0) * (basePot > 0 ? pot / basePot : 1),
      cashTarget: (baseConfig.cashTarget || 0) * (basePot > 0 ? pot / basePot : 1)
    };
    const results = runMonteCarlo(cfg, runs);
    return results.filter((r) => !r.failed).length / results.length;
  };
  let lo = 10000, hi = 5000000;
  for (let i = 0; i < 12; i++) {   // ±£1.2k on a £5M range — precision beyond this is noise vs MC error
    const mid = (lo + hi) / 2;
    if (successAt(mid) >= successTarget) hi = mid; else lo = mid;
  }
  const requiredPot = hi;
  return { requiredPot, successAtRequired: successAt(requiredPot) };
}
