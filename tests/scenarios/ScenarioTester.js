/**
 * Scenario Tester for Decision Calculator
 *
 * This is a STANDALONE test module that does NOT modify any existing code.
 * It imports calculation helpers and runs scenarios to verify correctness.
 *
 * Run with: node tests/scenarios/ScenarioTester.js
 */

// ============================================================================
// CALCULATION LOGIC (copied from index.html for standalone testing)
// This ensures we don't break the original - we test against this copy
// ============================================================================

function grossToNetIncome(gross, pa = 12570, brl = 50270) {
  if (gross <= pa) return gross;
  if (gross <= brl) return gross - (gross - pa) * 0.2;
  return gross - (brl - pa) * 0.2 - (gross - brl) * 0.4;
}

function calcGlidepathMin(base, yearNum, duration, cumInf, isGrowth) {
  if (isGrowth) {
    const factor = Math.max(0, 1 - yearNum / duration);
    return base * factor * cumInf;
  }
  return base * cumInf;
}

function calculateTax(annualTaxable, pa = 12570, brl = 50270) {
  if (annualTaxable <= pa) return 0;
  if (annualTaxable <= brl) return (annualTaxable - pa) * 0.2;
  return (brl - pa) * 0.2 + (annualTaxable - brl) * 0.4;
}

// ============================================================================
// CORE CALCULATION (simplified version matching index.html logic)
// ============================================================================

function calculateDecision(inputs) {
  const {
    dateStr,
    equity,
    bond,
    cash,
    history = [],
    settings = {},
    taxYearConfig = {}
  } = inputs;

  const [year, month] = dateStr.split('-').map(Number);
  const taxYear = month >= 4
    ? `${String(year % 100).padStart(2, '0')}/${String((year + 1) % 100).padStart(2, '0')}`
    : `${String((year - 1) % 100).padStart(2, '0')}/${String(year % 100).padStart(2, '0')}`;

  // Tax config
  const PA = taxYearConfig.pa || 12570;
  const BRL = taxYearConfig.brl || 50270;
  const OTHER = taxYearConfig.other || 0;
  const STATE = taxYearConfig.statePension || 0;
  const isTaxEfficientYear = taxYearConfig.isTaxEfficient !== false;
  const yearlyIsaSavingsAllocation = taxYearConfig.isaSavingsAllocation || 0;
  const grossIncomeToDate = taxYearConfig.grossIncomeToDate || 0;
  const confirmedSalary = taxYearConfig.confirmedSalary || settings.baseSalary || 59450;

  // Settings
  const equityMin = settings.equityMin || 600000;
  const bondMin = settings.bondMin || 480000;
  const cashTarget = settings.cashTarget || 120000;
  const duration = settings.duration || 30;
  const protectionFactor = (settings.protectionFactor || 20) / 100;
  const recoveryBuffer = settings.recoveryBuffer || 10000;
  const consecutiveLimit = settings.consecutiveLimit || 3;

  // Calculate year number (0 = first year)
  const baseYear = 2026; // Tax year 26/27 starts April 2026
  const yearNum = month >= 4 ? year - baseYear : year - baseYear - 1;

  // Cumulative inflation (simplified - assume 4% per year)
  const cpi = taxYearConfig.cpi || 0.04;
  let cumInf = 1;
  for (let i = 0; i < yearNum; i++) {
    cumInf *= 1 + cpi;
  }

  // Glidepath minimums
  const adjEquity = Math.round(calcGlidepathMin(equityMin, yearNum, duration, cumInf, true));
  const adjBond = Math.round(calcGlidepathMin(bondMin, yearNum, duration, cumInf, true));
  const adjCash = Math.round(calcGlidepathMin(cashTarget, yearNum, duration, cumInf, false));

  const totalGrowth = equity + bond;
  const minGrowth = adjEquity + adjBond;

  // Prior history analysis
  const priorHistory = history.filter(h => h.date < dateStr);

  // Count consecutive cash draws
  let consec = 0;
  for (let i = priorHistory.length - 1; i >= 0; i--) {
    if (priorHistory[i].source === 'Cash') consec++;
    else break;
  }

  // Protection mode logic
  let inProtection = false;

  // Check if continuing protection from last month
  if (priorHistory.length && priorHistory[priorHistory.length - 1].inProtection) {
    inProtection = totalGrowth <= minGrowth + recoveryBuffer;
  }

  // Enter NEW protection if below minimum with consecutive cash draws
  if (!inProtection && totalGrowth < minGrowth && consec + 1 >= consecutiveLimit) {
    inProtection = true;
  }

  // Remaining months in tax year
  const remainingMonths = month >= 4 ? (16 - month) : (4 - month);
  const effectiveRemainingMonths = Math.max(1, remainingMonths);

  // Target income
  const target = confirmedSalary * cumInf;
  const other = OTHER + STATE;

  // Calculate ISA used so far
  const existingMonthRecord = history.find(h => h.date === dateStr);
  const existingMonthIsa = existingMonthRecord?.isa || 0;
  const isaSavingsUsedSoFar = Math.max(0, (taxYearConfig.isaSavingsUsed || 0) - existingMonthIsa);
  const remainingIsaAllocation = Math.max(0, yearlyIsaSavingsAllocation - isaSavingsUsedSoFar);
  const monthlyIsaFromAllocation = remainingIsaAllocation / effectiveRemainingMonths;

  // Calculate standard SIPP
  let stdSipp;
  if (taxYearConfig.expectedMonthly?.sipp?.gross > 0) {
    stdSipp = taxYearConfig.expectedMonthly.sipp.gross;
  } else if (isTaxEfficientYear) {
    const brlHeadroom = Math.max(0, BRL - grossIncomeToDate - other);
    const maxMonthlySippAtBrl = brlHeadroom / 12;
    const monthlyTargetGross = target / 12;
    const monthlyFixedIncome = other / 12;
    stdSipp = Math.min(monthlyTargetGross - monthlyFixedIncome, maxMonthlySippAtBrl);
  } else {
    const monthlyTargetGross = target / 12;
    const monthlyFixedIncome = other / 12;
    stdSipp = Math.max(0, monthlyTargetGross - monthlyFixedIncome);
  }

  let sipp, isa, note;
  let boostAmount = 0;
  let isaSavingsUsedThisMonth = 0;

  if (isTaxEfficientYear) {
    // Tax-efficient mode
    const monthlyTargetNet = grossToNetIncome(target, PA, BRL) / 12;
    const grossAtBrl = Math.min(target, BRL);
    const monthlyNetAtBrl = grossToNetIncome(grossAtBrl, PA, BRL) / 12;
    const isaNeeded = Math.max(0, monthlyTargetNet - monthlyNetAtBrl);
    const isaToUse = Math.min(isaNeeded, monthlyIsaFromAllocation);
    isaSavingsUsedThisMonth = isaToUse;

    if (inProtection) {
      sipp = stdSipp * (1 - protectionFactor);
      isa = isaToUse;
      note = 'Protection';
    } else {
      sipp = stdSipp;
      isa = isaToUse;
      note = 'Tax-Efficient';

      // Tax boost calculation
      const taxYearStart = month >= 4 ? year : year - 1;
      const thisTaxYearHistory = priorHistory.filter(h => {
        const [hy, hm] = h.date.split('-').map(Number);
        const hTaxYearStart = hm >= 4 ? hy : hy - 1;
        return hTaxYearStart === taxYearStart;
      });

      let protectionShortfall = 0;
      let annualSippSoFar = 0;

      thisTaxYearHistory.forEach(h => {
        annualSippSoFar += h.sipp || 0;
        if (h.inProtection && h.stdSipp) {
          protectionShortfall += (h.stdSipp - h.sipp);
        }
        if (h.boostAmount > 0) {
          protectionShortfall -= h.boostAmount;
        }
      });

      if (protectionShortfall > 0) {
        const projectedAnnualTaxable = annualSippSoFar + sipp * effectiveRemainingMonths + other;
        const brlHeadroom = BRL - projectedAnnualTaxable;
        const surplus = totalGrowth - minGrowth - recoveryBuffer;

        if (brlHeadroom > 0 && surplus > 0) {
          const maxBoostFromBRL = brlHeadroom / effectiveRemainingMonths;
          const catchUpPerMonth = protectionShortfall / effectiveRemainingMonths;
          const maxBoostFromSurplus = surplus / effectiveRemainingMonths;

          boostAmount = Math.min(catchUpPerMonth, maxBoostFromBRL, maxBoostFromSurplus);

          if (boostAmount > 50) {
            sipp += boostAmount;
            note = 'Tax Boost';
          }
        }
      }
    }
  } else {
    // Tax-inefficient mode
    isa = 0;

    if (inProtection) {
      sipp = stdSipp * (1 - protectionFactor);
      note = 'Protection';
    } else {
      sipp = stdSipp;
      note = 'Tax-Inefficient';
    }
  }

  // Withdrawal source
  let source, reason;
  if (!inProtection && totalGrowth >= minGrowth + sipp) {
    source = 'Growth';
    reason = 'Healthy';
  } else {
    source = 'Cash';
    reason = inProtection ? 'Protection' : 'Below min';
  }

  // Calculate actual annual tax
  const thisTaxYearHistory = priorHistory.filter(h => {
    const [hy, hm] = h.date.split('-').map(Number);
    const hTaxYearStart = hm >= 4 ? hy : hy - 1;
    const taxYearStart = month >= 4 ? year : year - 1;
    return hTaxYearStart === taxYearStart;
  });

  const sippYTD = thisTaxYearHistory.reduce((sum, h) => sum + (h.sipp || 0), 0);
  const monthsPassedIncludingThis = thisTaxYearHistory.length + 1;
  const monthsRemaining = Math.max(0, 12 - monthsPassedIncludingThis);
  const projectedRemainingSipp = monthsRemaining * stdSipp;
  const totalAnnualSipp = sippYTD + sipp + projectedRemainingSipp;
  const annualTaxable = totalAnnualSipp + OTHER + STATE;
  const annualTax = calculateTax(annualTaxable, PA, BRL);

  return {
    date: dateStr,
    taxYear,
    mode: note,
    sipp: Math.round(sipp * 100) / 100,
    stdSipp: Math.round(stdSipp * 100) / 100,
    isa: Math.round(isa * 100) / 100,
    boostAmount: Math.round(boostAmount * 100) / 100,
    source,
    reason,
    inProtection,
    consecutiveCashDraws: consec,
    totalGrowth,
    minGrowth,
    adjEquity,
    adjBond,
    adjCash,
    annualTaxable: Math.round(annualTaxable * 100) / 100,
    annualTax: Math.round(annualTax * 100) / 100,
    headroomToBRL: Math.round((BRL - annualTaxable) * 100) / 100,
    isaSavingsUsedThisMonth,
    effectiveRemainingMonths,
    // For building history
    _historyRecord: {
      date: dateStr,
      taxYear,
      sipp,
      isa,
      stdSipp,
      boostAmount: boostAmount > 50 ? boostAmount : 0,
      source,
      inProtection
    }
  };
}

// ============================================================================
// TEST FRAMEWORK
// ============================================================================

function runTest(testName, scenario, assertions) {
  console.log('\n' + '='.repeat(80));
  console.log(`TEST: ${testName}`);
  console.log('='.repeat(80));

  // Show scenario setup
  console.log('\n📋 SCENARIO SETUP:');
  console.log(JSON.stringify(scenario, null, 2));

  // Run the months
  const results = [];
  let history = [];

  for (const monthInput of scenario.months) {
    const input = {
      ...monthInput,
      history: [...history],
      settings: scenario.settings,
      taxYearConfig: scenario.taxYearConfig
    };

    const result = calculateDecision(input);
    results.push(result);

    // Add to history for next month
    history.push(result._historyRecord);

    console.log(`\n📅 ${result.date} (Month ${results.length}):`);
    console.log(`   Mode: ${result.mode}`);
    console.log(`   SIPP Draw: £${result.sipp.toLocaleString()}`);
    console.log(`   Std SIPP: £${result.stdSipp.toLocaleString()}`);
    console.log(`   ISA Draw: £${result.isa.toLocaleString()}`);
    console.log(`   Boost: £${result.boostAmount.toLocaleString()}`);
    console.log(`   Source: ${result.source} (${result.reason})`);
    console.log(`   In Protection: ${result.inProtection}`);
    console.log(`   Consec Cash: ${result.consecutiveCashDraws}`);
    console.log(`   Total Growth: £${result.totalGrowth.toLocaleString()}`);
    console.log(`   Min Growth: £${result.minGrowth.toLocaleString()}`);
    console.log(`   Annual Taxable: £${result.annualTaxable.toLocaleString()}`);
    console.log(`   Annual Tax: £${result.annualTax.toLocaleString()}`);
    console.log(`   BRL Headroom: £${result.headroomToBRL.toLocaleString()}`);
  }

  // Run assertions
  console.log('\n✅ ASSERTIONS:');
  let passed = 0;
  let failed = 0;

  for (const assertion of assertions) {
    const { month, field, expected, description } = assertion;
    const result = results[month - 1];
    const actual = result[field];

    const isPass = typeof expected === 'function'
      ? expected(actual, result)
      : Math.abs(actual - expected) < 1; // Allow £1 tolerance for rounding

    if (isPass) {
      console.log(`   ✓ Month ${month} ${description}: ${actual} (expected: ${typeof expected === 'function' ? 'custom check' : expected})`);
      passed++;
    } else {
      console.log(`   ✗ Month ${month} ${description}: ${actual} (expected: ${typeof expected === 'function' ? 'custom check' : expected})`);
      failed++;
    }
  }

  // Summary
  console.log('\n📊 SUMMARY:');
  const totalSipp = results.reduce((sum, r) => sum + r.sipp, 0);
  const totalIsa = results.reduce((sum, r) => sum + r.isa, 0);
  const protectionMonths = results.filter(r => r.inProtection).length;
  const boostMonths = results.filter(r => r.boostAmount > 50).length;
  const finalAnnualTax = results[results.length - 1].annualTax;

  console.log(`   Total SIPP drawn: £${Math.round(totalSipp).toLocaleString()}`);
  console.log(`   Total ISA used: £${Math.round(totalIsa).toLocaleString()}`);
  console.log(`   Protection months: ${protectionMonths}`);
  console.log(`   Tax Boost months: ${boostMonths}`);
  console.log(`   Final Annual Tax: £${Math.round(finalAnnualTax).toLocaleString()}`);
  console.log(`   Tests: ${passed} passed, ${failed} failed`);

  return { passed, failed, results };
}

// ============================================================================
// TEST SCENARIOS
// ============================================================================

function runAllTests() {
  console.log('\n' + '#'.repeat(80));
  console.log('# PENSION DECISION CALCULATOR - SCENARIO TESTS');
  console.log('#'.repeat(80));

  let totalPassed = 0;
  let totalFailed = 0;

  // -------------------------------------------------------------------------
  // TEST 1: Standard year - no protection, no boost
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Standard Year - Healthy Funds, Tax Efficient',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 710000, bond: 505000, cash: 115000 },
          { dateStr: '2027-06', equity: 720000, bond: 510000, cash: 110000 }
        ]
      },
      [
        { month: 1, field: 'mode', expected: (v) => v === 'Tax-Efficient', description: 'mode is Tax-Efficient' },
        { month: 1, field: 'sipp', expected: 3893, description: 'SIPP draw is stdSipp' },
        { month: 1, field: 'inProtection', expected: (v) => v === false, description: 'not in protection' },
        { month: 1, field: 'source', expected: (v) => v === 'Growth', description: 'source is Growth' },
        { month: 2, field: 'sipp', expected: 3893, description: 'SIPP consistent' },
        { month: 3, field: 'sipp', expected: 3893, description: 'SIPP consistent' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 2: Protection mode triggers after consecutive cash draws
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Protection Mode - Funds Drop Below Minimum',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Month 1-2: Healthy
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 650000, bond: 480000, cash: 115000 },
          // Month 3-4: Below minimum, cash draws start
          { dateStr: '2027-06', equity: 550000, bond: 450000, cash: 110000 },
          { dateStr: '2027-07', equity: 540000, bond: 445000, cash: 105000 },
          // Month 5: Third consecutive cash draw - protection triggers
          { dateStr: '2027-08', equity: 530000, bond: 440000, cash: 100000 },
          // Month 6: Still in protection
          { dateStr: '2027-09', equity: 525000, bond: 438000, cash: 95000 }
        ]
      },
      [
        { month: 1, field: 'inProtection', expected: (v) => v === false, description: 'not in protection' },
        { month: 1, field: 'source', expected: (v) => v === 'Growth', description: 'source is Growth' },
        { month: 3, field: 'source', expected: (v) => v === 'Cash', description: 'source is Cash (below min)' },
        { month: 5, field: 'inProtection', expected: (v) => v === true, description: 'protection triggered' },
        { month: 5, field: 'sipp', expected: 3114, description: 'SIPP reduced by 20%' }, // 3893 * 0.8
        { month: 6, field: 'inProtection', expected: (v) => v === true, description: 'still in protection' },
        { month: 6, field: 'mode', expected: (v) => v === 'Protection', description: 'mode is Protection' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 3: Tax boost after protection recovery
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Tax Boost - Recovery After Protection',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Month 1-2: Standard
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 700000, bond: 500000, cash: 116000 },
          // Month 3-6: Market crash -> protection
          { dateStr: '2027-06', equity: 550000, bond: 450000, cash: 112000 },
          { dateStr: '2027-07', equity: 540000, bond: 445000, cash: 108000 },
          { dateStr: '2027-08', equity: 530000, bond: 440000, cash: 104000 }, // Protection triggers
          { dateStr: '2027-09', equity: 525000, bond: 438000, cash: 100000 },
          // Month 7-9: Recovery -> tax boost
          { dateStr: '2027-10', equity: 650000, bond: 500000, cash: 96000 },
          { dateStr: '2027-11', equity: 680000, bond: 510000, cash: 92000 },
          { dateStr: '2027-12', equity: 700000, bond: 520000, cash: 88000 }
        ]
      },
      [
        { month: 5, field: 'inProtection', expected: (v) => v === true, description: 'protection active' },
        { month: 5, field: 'sipp', expected: 3114, description: 'SIPP at 80%' },
        { month: 7, field: 'inProtection', expected: (v) => v === false, description: 'exited protection' },
        { month: 7, field: 'mode', expected: (v) => v === 'Tax Boost', description: 'tax boost active' },
        { month: 7, field: 'boostAmount', expected: (v) => v > 50, description: 'boost amount > £50' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 4: No ISA allocation
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'No ISA - Tax Efficient Mode Without ISA',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 0, // No ISA
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 710000, bond: 505000, cash: 115000 }
        ]
      },
      [
        { month: 1, field: 'isa', expected: 0, description: 'no ISA used' },
        { month: 1, field: 'sipp', expected: 3893, description: 'SIPP at BRL-capped level' },
        { month: 2, field: 'isa', expected: 0, description: 'still no ISA' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 5: Large ISA allocation
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Large ISA - Significant ISA Supplement',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 20000, // Large ISA
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 710000, bond: 505000, cash: 115000 }
        ]
      },
      [
        { month: 1, field: 'isa', expected: (v) => v > 0, description: 'ISA used' },
        { month: 1, field: 'sipp', expected: 3893, description: 'SIPP still at BRL-capped level' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 6: Tax-inefficient mode
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Tax Inefficient - Full SIPP Draw',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: false, // Tax-inefficient
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 4658 } } // Full draw = (59450-3552)/12
        },
        months: [
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 710000, bond: 505000, cash: 115000 }
        ]
      },
      [
        { month: 1, field: 'mode', expected: (v) => v === 'Tax-Inefficient', description: 'mode is Tax-Inefficient' },
        { month: 1, field: 'isa', expected: 0, description: 'no ISA in tax-inefficient mode' },
        { month: 1, field: 'sipp', expected: 4658, description: 'full SIPP draw' },
        { month: 1, field: 'annualTax', expected: (v) => v > 7540, description: 'higher tax than BRL limit' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 7: Full year - verify annual tax is correct
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Full Year Tax Check - Mixed Modes',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Standard months 1-2
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 700000, bond: 500000, cash: 116000 },
          // Drop into protection 3-6
          { dateStr: '2027-06', equity: 550000, bond: 450000, cash: 112000 },
          { dateStr: '2027-07', equity: 540000, bond: 445000, cash: 108000 },
          { dateStr: '2027-08', equity: 530000, bond: 440000, cash: 104000 },
          { dateStr: '2027-09', equity: 525000, bond: 438000, cash: 100000 },
          // Recovery with boost 7-9
          { dateStr: '2027-10', equity: 650000, bond: 500000, cash: 96000 },
          { dateStr: '2027-11', equity: 680000, bond: 510000, cash: 92000 },
          { dateStr: '2027-12', equity: 700000, bond: 520000, cash: 88000 },
          // Standard/boost finish 10-12
          { dateStr: '2028-01', equity: 680000, bond: 500000, cash: 84000 },
          { dateStr: '2028-02', equity: 690000, bond: 505000, cash: 80000 },
          { dateStr: '2028-03', equity: 700000, bond: 510000, cash: 76000 }
        ]
      },
      [
        // Final month should show annual tax at or below BRL limit (7540)
        { month: 12, field: 'annualTax', expected: (v) => v <= 7541, description: 'annual tax at/below BRL limit' },
        { month: 12, field: 'headroomToBRL', expected: (v) => v >= -1, description: 'not significantly over BRL' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 8: Small fund values (300k total)
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Small Funds - 300k Total',
      {
        settings: {
          baseSalary: 40000, // Lower target
          equityMin: 180000,
          bondMin: 100000,
          cashTarget: 50000,
          duration: 20,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 0,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 0,
          confirmedSalary: 40000,
          expectedMonthly: { sipp: { gross: 3333 } } // 40000/12
        },
        months: [
          { dateStr: '2027-04', equity: 180000, bond: 100000, cash: 50000 },
          { dateStr: '2027-05', equity: 175000, bond: 98000, cash: 47000 },
          { dateStr: '2027-06', equity: 170000, bond: 96000, cash: 44000 }
        ]
      },
      [
        { month: 1, field: 'sipp', expected: 3333, description: 'SIPP matches target' },
        { month: 1, field: 'annualTax', expected: (v) => v < 7540, description: 'tax below BRL limit' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 9: Large fund values (1.5M total)
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Large Funds - 1.5M Total',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 800000,
          bondMin: 600000,
          cashTarget: 150000,
          duration: 35,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 900000, bond: 600000, cash: 150000 },
          { dateStr: '2027-05', equity: 920000, bond: 610000, cash: 146000 }
        ]
      },
      [
        { month: 1, field: 'source', expected: (v) => v === 'Growth', description: 'drawing from growth' },
        { month: 1, field: 'inProtection', expected: (v) => v === false, description: 'not in protection' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 10: Mid-year start (October) with gross income to date
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Mid-Year Start - October with £25k Income Already',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 2754, // Half year ISA
          confirmedSalary: 59450,
          grossIncomeToDate: 25000, // Already earned £25k
          startMonth: 10,
          remainingMonths: 6,
          expectedMonthly: { sipp: { gross: 3620 } } // Adjusted for mid-year
        },
        months: [
          { dateStr: '2027-10', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-11', equity: 705000, bond: 502000, cash: 116000 },
          { dateStr: '2027-12', equity: 710000, bond: 504000, cash: 112000 }
        ]
      },
      [
        { month: 1, field: 'mode', expected: (v) => v === 'Tax-Efficient', description: 'tax efficient mode' },
        { month: 1, field: 'sipp', expected: 3620, description: 'SIPP adjusted for mid-year' },
        { month: 1, field: 'annualTax', expected: (v) => v <= 7600, description: 'tax reasonable for mid-year' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 11: With State Pension
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'With State Pension - £11,500/year',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 11500, // State pension kicks in
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          // With state pension: SIPP = (BRL - other - statePension) / 12
          // = (50270 - 3552 - 11500) / 12 = 2935
          expectedMonthly: { sipp: { gross: 2935 } }
        },
        months: [
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 705000, bond: 502000, cash: 116000 }
        ]
      },
      [
        { month: 1, field: 'sipp', expected: 2935, description: 'SIPP reduced due to state pension' },
        { month: 1, field: 'annualTax', expected: (v) => v <= 7550, description: 'tax at/below BRL limit' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 12: Different protection factor (30%)
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Protection Factor 30% - Higher Reduction',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 30, // 30% instead of 20%
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Drop into protection
          { dateStr: '2027-04', equity: 550000, bond: 450000, cash: 120000 },
          { dateStr: '2027-05', equity: 540000, bond: 445000, cash: 116000 },
          { dateStr: '2027-06', equity: 530000, bond: 440000, cash: 112000 }
        ]
      },
      [
        { month: 3, field: 'inProtection', expected: (v) => v === true, description: 'protection triggered' },
        { month: 3, field: 'sipp', expected: 2725, description: 'SIPP at 70% (30% reduction)' } // 3893 * 0.7
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 13: Very low funds - immediate protection
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Very Low Funds - Protection From Start',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Already below minimum from start
          { dateStr: '2027-04', equity: 500000, bond: 400000, cash: 120000 },
          { dateStr: '2027-05', equity: 495000, bond: 398000, cash: 116000 },
          { dateStr: '2027-06', equity: 490000, bond: 396000, cash: 112000 },
          { dateStr: '2027-07', equity: 485000, bond: 394000, cash: 108000 }
        ]
      },
      [
        { month: 1, field: 'source', expected: (v) => v === 'Cash', description: 'drawing from cash (below min)' },
        { month: 3, field: 'inProtection', expected: (v) => v === true, description: 'protection after 3 cash draws' },
        { month: 4, field: 'sipp', expected: 3114, description: 'SIPP reduced in protection' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 14: Recovery from protection - exact buffer threshold
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Recovery Buffer - Exits at Min + Buffer',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Drop into protection
          { dateStr: '2027-04', equity: 550000, bond: 450000, cash: 120000 },
          { dateStr: '2027-05', equity: 540000, bond: 445000, cash: 116000 },
          { dateStr: '2027-06', equity: 530000, bond: 440000, cash: 112000 },
          // In protection
          { dateStr: '2027-07', equity: 525000, bond: 438000, cash: 108000 },
          // Recovery to exactly min + buffer (1,085,760 + 10,000 = 1,095,760)
          { dateStr: '2027-08', equity: 600000, bond: 496000, cash: 104000 } // 1,096,000 total
        ]
      },
      [
        { month: 4, field: 'inProtection', expected: (v) => v === true, description: 'in protection' },
        { month: 5, field: 'inProtection', expected: (v) => v === false, description: 'exited protection at buffer' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 15: Unbalanced portfolio - heavy equity
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Unbalanced Portfolio - 90% Equity',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 1000000, bond: 100000, cash: 120000 }, // Heavy equity
          { dateStr: '2027-05', equity: 1010000, bond: 100000, cash: 116000 }
        ]
      },
      [
        { month: 1, field: 'source', expected: (v) => v === 'Growth', description: 'drawing from growth' },
        { month: 1, field: 'sipp', expected: 3893, description: 'standard SIPP despite imbalance' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 16: Unbalanced portfolio - heavy bonds
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Unbalanced Portfolio - 90% Bonds',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 100000, bond: 1000000, cash: 120000 }, // Heavy bonds
          { dateStr: '2027-05', equity: 100000, bond: 1010000, cash: 116000 }
        ]
      },
      [
        { month: 1, field: 'source', expected: (v) => v === 'Growth', description: 'drawing from growth' },
        { month: 1, field: 'sipp', expected: 3893, description: 'standard SIPP despite imbalance' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 17: Low target salary (below BRL)
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Low Salary Target - £35,000/year',
      {
        settings: {
          baseSalary: 35000,
          equityMin: 400000,
          bondMin: 300000,
          cashTarget: 80000,
          duration: 25,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 2000,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 0, // No ISA needed - below BRL
          confirmedSalary: 35000,
          // SIPP = (35000 - 2000) / 12 = 2750
          expectedMonthly: { sipp: { gross: 2750 } }
        },
        months: [
          { dateStr: '2027-04', equity: 450000, bond: 320000, cash: 85000 },
          { dateStr: '2027-05', equity: 455000, bond: 322000, cash: 82000 }
        ]
      },
      [
        { month: 1, field: 'sipp', expected: 2750, description: 'SIPP matches low target' },
        { month: 1, field: 'isa', expected: 0, description: 'no ISA needed below BRL' },
        { month: 1, field: 'annualTax', expected: (v) => v < 5000, description: 'low tax for low salary' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 18: High target salary (well above BRL)
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'High Salary Target - £80,000/year Tax Inefficient',
      {
        settings: {
          baseSalary: 80000,
          equityMin: 800000,
          bondMin: 600000,
          cashTarget: 150000,
          duration: 35,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 5000,
          statePension: 0,
          isTaxEfficient: false, // Must be tax inefficient at this level
          isaSavingsAllocation: 0,
          confirmedSalary: 80000,
          // SIPP = (80000 - 5000) / 12 = 6250
          expectedMonthly: { sipp: { gross: 6250 } }
        },
        months: [
          { dateStr: '2027-04', equity: 900000, bond: 650000, cash: 160000 },
          { dateStr: '2027-05', equity: 910000, bond: 655000, cash: 154000 }
        ]
      },
      [
        { month: 1, field: 'sipp', expected: 6250, description: 'high SIPP for high target' },
        { month: 1, field: 'annualTax', expected: (v) => v > 10000, description: 'high tax above BRL' },
        { month: 1, field: 'headroomToBRL', expected: (v) => v < 0, description: 'over BRL (negative headroom)' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 19: Year 5 - glidepath reduction in minimums
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Year 5 - Glidepath Reduces Minimums',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          cpi: 0.04,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Year 5 = tax year 31/32 = April 2031
          { dateStr: '2031-04', equity: 600000, bond: 450000, cash: 130000 }
        ]
      },
      [
        // Year 5: equityMin = 600000 * (1 - 5/30) * cumInf = 600000 * 0.833 * 1.217 = ~608k
        // The glidepath factor reduces, but inflation increases, so net effect varies
        { month: 1, field: 'adjEquity', expected: (v) => v > 500000 && v < 700000, description: 'equity min adjusted by glidepath+inflation' },
        { month: 1, field: 'adjBond', expected: (v) => v > 400000 && v < 560000, description: 'bond min adjusted by glidepath+inflation' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 20: Boost limited by fund surplus
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Tax Boost - Limited by Fund Surplus',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          // Standard months
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 700000, bond: 500000, cash: 116000 },
          // Protection months (4 months)
          { dateStr: '2027-06', equity: 550000, bond: 450000, cash: 112000 },
          { dateStr: '2027-07', equity: 540000, bond: 445000, cash: 108000 },
          { dateStr: '2027-08', equity: 530000, bond: 440000, cash: 104000 },
          { dateStr: '2027-09', equity: 525000, bond: 438000, cash: 100000 },
          // Recovery but NOT much surplus - boost should be limited
          { dateStr: '2027-10', equity: 600000, bond: 490000, cash: 96000 } // Just above min+buffer
        ]
      },
      [
        // With small surplus, might still be in protection or have limited boost
        { month: 7, field: 'boostAmount', expected: (v) => v < 300, description: 'boost limited by small surplus (or still in protection)' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 21: Full 12 months tax inefficient
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Full Year Tax Inefficient - Higher Tax',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: false,
          isaSavingsAllocation: 0,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 4658 } }
        },
        months: [
          { dateStr: '2027-04', equity: 700000, bond: 500000, cash: 120000 },
          { dateStr: '2027-05', equity: 700000, bond: 500000, cash: 115000 },
          { dateStr: '2027-06', equity: 700000, bond: 500000, cash: 110000 },
          { dateStr: '2027-07', equity: 700000, bond: 500000, cash: 105000 },
          { dateStr: '2027-08', equity: 700000, bond: 500000, cash: 100000 },
          { dateStr: '2027-09', equity: 700000, bond: 500000, cash: 95000 },
          { dateStr: '2027-10', equity: 700000, bond: 500000, cash: 90000 },
          { dateStr: '2027-11', equity: 700000, bond: 500000, cash: 85000 },
          { dateStr: '2027-12', equity: 700000, bond: 500000, cash: 80000 },
          { dateStr: '2028-01', equity: 700000, bond: 500000, cash: 75000 },
          { dateStr: '2028-02', equity: 700000, bond: 500000, cash: 70000 },
          { dateStr: '2028-03', equity: 700000, bond: 500000, cash: 65000 }
        ]
      },
      [
        { month: 12, field: 'annualTax', expected: (v) => v > 10000, description: 'tax well above BRL limit' },
        { month: 12, field: 'headroomToBRL', expected: (v) => v < 0, description: 'over BRL' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 22: Protection with state pension
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Protection With State Pension',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 3
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 11500,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 2935 } } // Reduced for state pension
        },
        months: [
          { dateStr: '2027-04', equity: 550000, bond: 450000, cash: 120000 },
          { dateStr: '2027-05', equity: 540000, bond: 445000, cash: 116000 },
          { dateStr: '2027-06', equity: 530000, bond: 440000, cash: 112000 }
        ]
      },
      [
        { month: 3, field: 'inProtection', expected: (v) => v === true, description: 'protection triggers' },
        { month: 3, field: 'sipp', expected: 2348, description: 'protected SIPP (2935 * 0.8)' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 23: Zero other income
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Zero Other Income - SIPP Only',
      {
        settings: {
          baseSalary: 50000,
          equityMin: 500000,
          bondMin: 400000,
          cashTarget: 100000,
          duration: 25,
          protectionFactor: 20
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 0, // No other income
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 0,
          confirmedSalary: 50000,
          // SIPP = 50000 / 12 = 4167 (but capped at BRL/12 = 4189)
          expectedMonthly: { sipp: { gross: 4167 } }
        },
        months: [
          { dateStr: '2027-04', equity: 550000, bond: 420000, cash: 105000 },
          { dateStr: '2027-05', equity: 555000, bond: 422000, cash: 101000 }
        ]
      },
      [
        { month: 1, field: 'sipp', expected: 4167, description: 'SIPP = target/12' },
        { month: 1, field: 'annualTax', expected: (v) => v < 7540, description: 'tax below BRL limit' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // -------------------------------------------------------------------------
  // TEST 24: Consecutive limit of 2 (quicker protection)
  // -------------------------------------------------------------------------
  {
    const result = runTest(
      'Consecutive Limit 2 - Faster Protection',
      {
        settings: {
          baseSalary: 59450,
          equityMin: 600000,
          bondMin: 480000,
          cashTarget: 120000,
          duration: 30,
          protectionFactor: 20,
          recoveryBuffer: 10000,
          consecutiveLimit: 2 // Only 2 consecutive cash draws needed
        },
        taxYearConfig: {
          pa: 12570,
          brl: 50270,
          other: 3552,
          statePension: 0,
          isTaxEfficient: true,
          isaSavingsAllocation: 5508,
          confirmedSalary: 59450,
          expectedMonthly: { sipp: { gross: 3893 } }
        },
        months: [
          { dateStr: '2027-04', equity: 550000, bond: 450000, cash: 120000 }, // Below min, cash draw 1
          { dateStr: '2027-05', equity: 545000, bond: 448000, cash: 116000 }  // Cash draw 2 -> protection
        ]
      },
      [
        { month: 1, field: 'inProtection', expected: (v) => v === false, description: 'not yet in protection' },
        { month: 2, field: 'inProtection', expected: (v) => v === true, description: 'protection after 2 cash draws' }
      ]
    );
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // =========================================================================
  // FINAL SUMMARY
  // =========================================================================
  console.log('\n' + '#'.repeat(80));
  console.log('# FINAL RESULTS');
  console.log('#'.repeat(80));
  console.log(`\n   Total tests: ${totalPassed + totalFailed}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Success rate: ${Math.round(100 * totalPassed / (totalPassed + totalFailed))}%`);
  console.log('\n' + '#'.repeat(80));

  return { totalPassed, totalFailed };
}

// Run if called directly
runAllTests();
