/**
 * Golden-master scenario matrix.
 *
 * Representative inputs for the two live engines. Each decision case supplies the
 * injected deps (settings/history/allTaxYears/spInfo) exactly as the live storage
 * getters would return them. Chosen to span rate bands, protection states, tax-year
 * efficiency, month timing, State-Pension timing, ISA, and fund states — and to
 * deliberately exercise the known high-severity bugs so the golden master captures them.
 */

// ---- decision helpers -------------------------------------------------------
const baseSettings = {
  baseSalary: 59450,
  equityMin: 600000,
  bondMin: 480000,
  cashTarget: 120000,
  duration: 35,
  protectionFactor: 20,
  recoveryBuffer: 15000,
  consecutiveLimit: 3
};

function ty(overrides = {}) {
  return {
    pa: 12570,
    brl: 50270,
    other: 0,
    cpi: 0.025,
    isTaxEfficient: true,
    isaSavingsAllocation: 0,
    isaSavingsUsed: 0,
    grossIncomeToDate: 0,
    confirmedSalary: 59450,
    ...overrides
  };
}

// A prior-month history entry (fields the engine reads).
function hist(date, source, extra = {}) {
  return {
    date,
    source,
    sipp: 3000,
    stdSipp: 3000,
    inProtection: false,
    boostAmount: 0,
    isa: 0,
    taxYear: '26/27',
    ...extra
  };
}

const noSP = { amount: 0, isReceiving: false };
const withSP = { amount: 11960, isReceiving: true, isFirstYear: false };

// Fund states
const healthy = { equity: 700000, bond: 550000, cash: 120000 };
const belowMin = { equity: 550000, bond: 450000, cash: 120000 };
const strandedBucket = { equity: 700000, bond: 380000, cash: 120000 }; // net surplus ~0 but equity has +100k

export const decisionCases = [
  {
    name: 'basic-rate / efficient / April (month start)',
    input: { dateStr: '2026-04', ...healthy },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'basic-rate / efficient / July (mid year)',
    input: { dateStr: '2026-07', ...healthy },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'basic-rate / efficient / March 2027 (last month)',
    input: { dateStr: '2027-03', ...healthy },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'higher-rate salary (80k) / efficient',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: { ...baseSettings, baseSalary: 80000 },
      history: [],
      allTaxYears: { '26/27': ty({ confirmedSalary: 80000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'additional-rate salary (150k) — captures NO 45% band',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: { ...baseSettings, baseSalary: 150000 },
      history: [],
      allTaxYears: { '26/27': ty({ confirmedSalary: 150000 }) },
      spInfo: noSP
    }
  },
  {
    name: '100k+ salary (110k) — captures NO PA taper',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: { ...baseSettings, baseSalary: 110000 },
      history: [],
      allTaxYears: { '26/27': ty({ confirmedSalary: 110000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'tax-inefficient year / full SIPP draw',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty({ isTaxEfficient: false }) },
      spInfo: noSP
    }
  },
  {
    name: 'tax-inefficient / 150k salary — crude tax on full draw (captures NO 45%/taper)',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: { ...baseSettings, baseSalary: 150000 },
      history: [],
      allTaxYears: { '26/27': ty({ isTaxEfficient: false, confirmedSalary: 150000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'ISA top-up (efficient, target net > net at BRL)',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty({ isaSavingsAllocation: 12000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'State Pension receiving',
    input: { dateStr: '2026-07', ...healthy },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: withSP }
  },
  {
    name: 'other income present (no CPI cap in live path)',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty({ other: 8000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'protection ENTERS (3 prior cash draws, funds below min)',
    input: { dateStr: '2026-07', ...belowMin },
    deps: {
      settings: baseSettings,
      history: [hist('2026-04', 'Cash'), hist('2026-05', 'Cash'), hist('2026-06', 'Cash')],
      allTaxYears: { '26/27': ty() },
      spInfo: noSP
    }
  },
  {
    name: 'protection CONTINUES (last month in protection, still below min+buffer)',
    input: { dateStr: '2026-07', ...belowMin },
    deps: {
      settings: baseSettings,
      history: [
        hist('2026-04', 'Cash'),
        hist('2026-05', 'Cash'),
        hist('2026-06', 'Cash', { inProtection: true, sipp: 2400 })
      ],
      allTaxYears: { '26/27': ty() },
      spInfo: noSP
    }
  },
  {
    name: 'stranded-bucket (equity surplus but net gate forces Cash)',
    input: { dateStr: '2026-07', ...strandedBucket },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'tax-boost catch-up (prior protected month shortfall)',
    input: { dateStr: '2026-08', ...healthy },
    deps: {
      settings: baseSettings,
      history: [
        hist('2026-04', 'Growth', { sipp: 3000, stdSipp: 3000 }),
        hist('2026-05', 'Cash', { sipp: 2400, stdSipp: 3000, inProtection: true }),
        hist('2026-06', 'Cash', { sipp: 2400, stdSipp: 3000, inProtection: true }),
        hist('2026-07', 'Growth', { sipp: 3000, stdSipp: 3000 })
      ],
      allTaxYears: { '26/27': ty() },
      spInfo: noSP
    }
  },
  {
    name: 'later year 2029-07 (cumulative inflation, yearNum=3)',
    input: { dateStr: '2029-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: {
        '26/27': ty({ cpi: 0.03 }),
        '27/28': ty({ cpi: 0.03 }),
        '28/29': ty({ cpi: 0.03 }),
        '29/30': ty({ confirmedSalary: 59450, cpi: 0.025 })
      },
      spInfo: noSP
    }
  },
  // ---- coverage added after adversarial verification ----
  {
    name: 'wizard expectedMonthly path / efficient (primary stdSipp source)',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty({ expectedMonthly: { sipp: { gross: 3200 } } }) },
      spInfo: noSP
    }
  },
  {
    name: 'wizard expectedMonthly path / inefficient',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty({ isTaxEfficient: false, expectedMonthly: { sipp: { gross: 3200 } } }) },
      spInfo: noSP
    }
  },
  {
    name: 'Jan of prev tax year with carried 2026 history (cross-calendar filter + boost)',
    input: { dateStr: '2027-01', ...healthy },
    deps: {
      settings: baseSettings,
      history: [
        hist('2026-04', 'Growth', { sipp: 3000, stdSipp: 3000 }),
        hist('2026-05', 'Growth', { sipp: 3000, stdSipp: 3000 }),
        hist('2026-06', 'Growth', { sipp: 3000, stdSipp: 3000 }),
        hist('2026-07', 'Cash', { sipp: 2400, stdSipp: 3000, inProtection: true }),
        hist('2026-08', 'Cash', { sipp: 2400, stdSipp: 3000, inProtection: true }),
        hist('2026-09', 'Cash', { sipp: 2400, stdSipp: 3000, inProtection: true }),
        hist('2026-10', 'Growth', { sipp: 3000, stdSipp: 3000 }),
        hist('2026-11', 'Growth', { sipp: 3000, stdSipp: 3000 }),
        hist('2026-12', 'Growth', { sipp: 3000, stdSipp: 3000 })
      ],
      allTaxYears: { '26/27': ty() },
      spInfo: noSP
    }
  },
  {
    name: 'ISA already used + same-month double-count guard',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [hist('2026-07', 'Growth', { isa: 1000 })],
      allTaxYears: { '26/27': ty({ isaSavingsAllocation: 12000, isaSavingsUsed: 8000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'tax-inefficient + in-protection (continues)',
    input: { dateStr: '2026-07', ...belowMin },
    deps: {
      settings: baseSettings,
      history: [
        hist('2026-04', 'Cash'),
        hist('2026-05', 'Cash'),
        hist('2026-06', 'Cash', { inProtection: true, sipp: 2400 })
      ],
      allTaxYears: { '26/27': ty({ isTaxEfficient: false }) },
      spInfo: noSP
    }
  },
  {
    name: 'cash-low warning (source Cash, cash=0)',
    input: { dateStr: '2026-07', equity: 600000, bond: 480000, cash: 0 },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'grossIncomeToDate>0 caps efficient stdSipp',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty({ grossIncomeToDate: 20000 }) },
      spInfo: noSP
    }
  },
  {
    name: 'Bond→Equity rebalance branch',
    input: { dateStr: '2026-07', equity: 550000, bond: 560000, cash: 120000 },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'cash-replenishment suggestion',
    input: { dateStr: '2026-07', equity: 700000, bond: 550000, cash: 100000 },
    deps: { settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP }
  },
  {
    name: 'protection EXIT (last month protected, funds recovered)',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [
        hist('2026-04', 'Cash'),
        hist('2026-05', 'Cash'),
        hist('2026-06', 'Cash', { inProtection: true, sipp: 2400, stdSipp: 3000 })
      ],
      allTaxYears: { '26/27': ty() },
      spInfo: noSP
    }
  },
  {
    name: 'glidepath depletion floor (yearNum == duration → min 0)',
    input: { dateStr: '2061-07', ...healthy },
    deps: { settings: baseSettings, history: [], allTaxYears: { '61/62': ty() }, spInfo: noSP }
  },
  {
    name: 'ISA pot (Option A): SIPP to BRL + ISA top-up to target',
    input: { dateStr: '2026-07', ...healthy },
    deps: {
      settings: baseSettings,
      history: [],
      allTaxYears: { '26/27': ty() },
      spInfo: noSP,
      isaBalance: 200000 // triggers the shared planDrawdown path
    }
  }
];

// ---- stress configs ---------------------------------------------------------
// Fields consumed by SimulationEngine.simulate / calculateMonthlyDraw.
const baseConfig = {
  years: 30,
  duration: 30,
  baseSalary: 59450,
  other: 0,
  equityMin: 600000,
  bondMin: 480000,
  cashTarget: 120000,
  equityStart: 600000,
  bondStart: 480000,
  cashStart: 120000,
  pa: 12570,
  brl: 50270,
  hrl: 125140,
  taxMode: 'inflates',
  protectionMult: 0.8,
  consecutiveLimit: 3,
  disableProtection: false,
  hodlEnabled: false,
  hodlValue: 0,
  // date-based SP (the path the live builder produces)
  spStartYear: 5,
  spWeeklyAmount: 230,
  spFirstYearRatio: 1
};

export const stressConfigs = [
  { name: 'base / SP from year 5', config: baseConfig },
  { name: 'frozen tax thresholds', config: { ...baseConfig, taxMode: 'frozen' } },
  { name: 'protection disabled', config: { ...baseConfig, disableProtection: true } },
  { name: 'HODL reserve enabled', config: { ...baseConfig, hodlEnabled: true, hodlValue: 100000 } },
  { name: 'no State Pension configured (spWeeklyAmount 0)', config: { ...baseConfig, spWeeklyAmount: 0 } },
  {
    name: 'DROPPED-SP BUG: legacy statePension set but no spStartYear',
    // Mimics default stress settings: statePension/statePensionYear present, but the
    // date-based builder yields spStartYear=999 when no spStartDate → SP silently dropped.
    config: {
      ...baseConfig,
      spStartYear: 999,
      spWeeklyAmount: 0,
      statePension: 12000,
      statePensionYear: 12
    }
  },
  { name: 'shorter horizon (20y)', config: { ...baseConfig, years: 20, duration: 20 } },
  // Target BELOW the basic-rate limit so the draw binds to target, not the BRL cap
  // (a higher salary is a no-op: calculateMonthlyDraw caps at min(brl,target)).
  { name: 'lower target salary (40k, binds below BRL)', config: { ...baseConfig, baseSalary: 40000 } },
  { name: 'partial first State-Pension year (ratio 0.5)', config: { ...baseConfig, spFirstYearRatio: 0.5 } },
  // ISA pot helping the SIPP: tax-free top-up means less SIPP drawn → higher success than base.
  { name: 'base + £200k ISA (should beat base)', config: { ...baseConfig, isaBalance: 200000 } },
  { name: 'base + £200k ISA / maximise longevity', config: { ...baseConfig, isaBalance: 200000, isaDrawdownStrategy: 'maximiseLongevity' } }
];
