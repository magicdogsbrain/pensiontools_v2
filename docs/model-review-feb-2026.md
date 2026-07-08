# PensionTools Financial Model Review — February 2026

## Overview

Independent review of the return models, assumptions, and Monte Carlo methodology
in PensionTools v2 (v6.0). Compared against industry standards, professional
adviser tools (Timeline, Voyant), FCA projection rates, and academic research
(Dimson-Marsh-Staunton global returns dataset).

---

## What's Working Well

### Monte Carlo Approach
- 1,000 runs with historical sampling is solid for a consumer tool
- Professional tools use 10,000 for tighter percentile convergence, but 1,000
  is adequate — the success rate stabilises within ~1% at this count
- Historical sampling preserves real-world fat tails (crashes actually happened)

### Cash Model
- `max(0.5%, inflation + 1.2%)` is reasonable
- Long-term real cash return: ~0.5-1.0% (DMS global data: 0.5%, Barclays UK: 0.8-0.9%)
- Floor of 0.5% prevents unrealistic negative cash returns
- Volatility of 0.2% is appropriate for money market equivalent

### Inflation Assumption
- 2.5% is well-chosen — slightly above BoE 2% target
- Historical UK CPI averages ~3% over long periods
- 2.5% is the sweet spot between optimistic (2%) and pessimistic (3.5%)

### Stress Scenarios
- Great Depression, Stagflation 70s, Lost Decade 2000s, 2008 Crisis, Synthetic Worst
- These are the canonical scenarios used by professional tools
- Historical sequence analysis (all 35-year windows from 1928) is excellent

### Protection Mode
- 3 consecutive cash draws → 20% drawdown reduction
- Unique feature not found in competitor tools
- Practically useful — automates a real decision retirees face
- Recovery buffer (£5k surplus before exiting) prevents whiplash

### HODL Fund (Ruffer-style absolute return)
- 6.9% mean, 6% vol, defensive boost when equities fall >10%
- Reasonable model for an absolute return fund
- Capped at -8% to +18% — sensible bounds
- Good as a "break glass" emergency reserve concept

---

## Issues To Address

### 1. S&P 500 Bias (Medium Priority)

**Problem:** Equity returns sampled from S&P 500 (1928-2024). A UK investor
in a global equity fund (Vanguard FTSE All-World, MSCI ACWI) would expect
lower returns.

**Evidence:**

| Index | Long-term real return | Volatility |
|-------|----------------------|------------|
| S&P 500 | ~6.5-7.0% | ~17% |
| MSCI World / FTSE All-World | ~5.0-5.2% | ~15% |
| UK equities (FTSE All-Share) | ~5.1-5.4% | ~20% |
| FCA mid projection rate | 3.0% real (5% nominal) | n/a |

Source: Dimson-Marsh-Staunton (DMS) Global Investment Returns Yearbook 2024,
covering 125 years across 35 markets.

**Impact:** Using S&P 500 data makes projections ~1.5-2% more optimistic
annually than a global equity benchmark. Over 35 years this compounds
significantly.

**Options:**
1. Switch to MSCI World data (available from 1970; pre-1970 use DMS global)
2. Apply a scaling factor to S&P returns (e.g. multiply by ~0.85)
3. Disclose "based on US equity data" and let users understand the bias
4. Offer a "conservative/moderate/optimistic" toggle that adjusts the dataset

**Recommendation:** Option 3 (disclosure) is the minimum. Option 4 is the best
user experience — let them choose their assumption.

### 2. Missing Equity-Bond Correlation (High Priority)

**Problem:** Equity and bond returns are generated independently in each
Monte Carlo run. In reality, they are correlated, and the correlation
varies by regime.

**Historical correlation:**

| Period | Correlation | Driver |
|--------|------------|--------|
| 1970-1999 | +0.35 | Both driven by inflation expectations |
| 2000-2020 | -0.29 | Flight to quality (bonds rally when stocks fall) |
| 2022 | +0.58 | Both fell together (rate shock) |
| Long-run average | ~+0.1 | Weighted across regimes |

**Impact:** Without correlation, the model overstates diversification benefit.
In reality, stocks and bonds sometimes fall together (2022), which is the
most dangerous scenario for retirees. The model should capture this.

**See: Implementation Notes below for how to add this.**

### 3. Bond Model Labelling (Low Priority)

**Problem:** The "bond" allocation is actually a 6-sub-asset diversified fund:
- 15% index-linked gilts
- 30% nominal bonds
- 20% property
- 10% commodities
- 10% cash
- 15% equity (dampened)

This is more like a Vanguard LifeStrategy or diversified growth fund than
a "bond fund." Users who hold a pure gilt fund will get misleading results.

**Recommendation:** Either:
- Relabel as "Diversified Growth" or "Multi-Asset" in the UI
- Or offer two bond modes: "Pure Bonds" (simpler model) and "Multi-Asset"
- The sub-asset return formulas themselves are reasonable for what they model

### 4. Inflation Inconsistency (Low Priority)

**Problem:** Monte Carlo simulations use historical inflation (variable per run),
but glidepath minimums and income targets inflate at a fixed 2.5%.

**Impact:** Minor. In a simulation year with 8% historical inflation, the
withdrawal target only grows at 2.5%, understating the real income need.

**Recommendation:** Either:
- Use simulated inflation for income targets within each Monte Carlo run
  (more accurate but harder for users to understand)
- Accept the simplification and document it (pragmatic for a consumer tool)
- The fixed rate is arguably more useful — users think in today's money

---

## Comparison to Industry Standards

### FCA Standardised Projection Rates (since April 2014)

| Scenario | Nominal | Real (after 2% inflation) |
|----------|---------|--------------------------|
| Low | 2% | 0% |
| Mid | 5% | 3% |
| High | 8% | 6% |

The FCA is consulting on modernising these (CP25/39). PensionTools' historical
sampling approach is more realistic than fixed projection rates.

### What Professional Tools Use

| Tool | Method | Returns | Correlation |
|------|--------|---------|-------------|
| Timeline | Parametric log-normal | Configurable | Yes (Cholesky) |
| Voyant | Parametric + Monte Carlo | Configurable | Yes (Cholesky) |
| PensionTools | Historical sampling | S&P 500 data | No |

### Academic Best Practice
- **Parametric log-normal** is the industry standard
- **Block bootstrap** (5-year blocks) is best for historical sampling
  (preserves serial correlation and sequence-of-returns risk)
- **10,000 simulations** for publication-quality; 1,000 for consumer tools
- **Annual time steps** sufficient for pension planning (monthly adds cost, little benefit)

---

## Summary Scorecard

| Aspect | Rating | Priority to Fix |
|--------|--------|----------------|
| Equity returns | Good, slightly optimistic | Medium |
| Bond model | Creative, unconventional | Low (relabel) |
| Cash | Good | None |
| Monte Carlo mechanics | Good | None (bump to 10k if easy) |
| Equity-bond correlation | Missing | **High** |
| Inflation | Good | Low |
| Stress scenarios | Excellent | None |
| Protection mode | Unique, well-designed | None |
| HODL/absolute return | Reasonable | None |

---

## Implementation Notes: Adding Equity-Bond Correlation

### The Problem

Currently in SimulationEngine.js, equity returns are sampled from historical
data and bond returns are generated independently via parametric formulas.
This means in any given Monte Carlo run, a terrible equity year might coincide
with a great bond year — or vice versa — purely by chance, with no systematic
relationship.

In reality, equity and bond returns have a measurable correlation that varies
by regime but averages around +0.1 over the long run. In stress periods
(like 2022), the correlation can spike to +0.5 or higher, meaning both asset
classes fall together — the worst scenario for a retiree drawing income.

### Recommended Approach: Cholesky Decomposition

This is the standard method used by Timeline, Voyant, and academic Monte Carlo
models. It takes two independent random numbers and transforms them into
correlated random numbers.

**The maths:**

Given:
- `z1` = independent standard normal random number (for equities)
- `z2` = independent standard normal random number (for bonds)
- `ρ` (rho) = target correlation (e.g. +0.1)

Transform `z2` into a correlated value:
```
z2_correlated = ρ * z1 + sqrt(1 - ρ²) * z2
```

Then use `z1` for equity returns and `z2_correlated` for bond returns.

When `ρ = 0.1`:
```
z2_correlated = 0.1 * z1 + sqrt(1 - 0.01) * z2
              = 0.1 * z1 + 0.995 * z2
```

This means bond returns are ~10% influenced by the equity shock and ~99.5%
driven by their own randomness. Subtle, but over 1,000 runs it creates
realistic clustering of bad outcomes.

### How To Integrate With Current Architecture

The current model uses historical sampling for equities but parametric
(Gaussian) generation for bond sub-assets. The cleanest integration:

**Option A: Correlate the parametric bond noise with equity returns**

In the simulation loop where bond sub-asset returns are generated:

```javascript
// Current approach (independent):
const nominalNoise = gaussianRandom(rng) * 0.05;  // 5% vol
const nominalReturn = 0.04 - penaltyForInflation + nominalNoise;

// New approach (correlated with equity):
const rho = 0.1;  // long-run equity-bond correlation
const independentNoise = gaussianRandom(rng);
const correlatedNoise = rho * equityZScore + Math.sqrt(1 - rho * rho) * independentNoise;
const nominalReturn = 0.04 - penaltyForInflation + correlatedNoise * 0.05;
```

Where `equityZScore` is the standardised equity return for that year:
```javascript
const equityMean = 0.10;   // approximate long-run S&P mean
const equityStd = 0.17;    // approximate S&P standard deviation
const equityZScore = (annualEquityReturn - equityMean) / equityStd;
```

**Option B: Regime-based correlation (more sophisticated)**

Instead of a fixed correlation, vary it by market conditions:

```javascript
function getCorrelation(equityReturn, inflation) {
  // High inflation regime: positive correlation (2022-style)
  if (inflation > 0.045) return 0.4;

  // Equity crash: negative correlation (flight to quality)
  if (equityReturn < -0.15) return -0.3;

  // Normal markets: mild positive
  return 0.1;
}
```

This captures the key dynamic: bonds usually help in equity crashes (negative
correlation), but in inflation shocks, everything falls together (positive
correlation). Option B is more realistic but harder to validate.

**Recommendation:** Start with Option A (fixed ρ = 0.1). It's simple,
well-understood, and matches what professional tools use as their default.
Add Option B later as a "stress correlation" toggle if desired.

### Which Sub-Assets To Correlate

Not all bond sub-assets should have the same equity correlation:

| Sub-asset | Suggested ρ with equity | Rationale |
|-----------|------------------------|-----------|
| Nominal bonds | +0.1 | Standard gilt-equity relationship |
| Index-linked gilts | +0.05 | Less sensitive to equity moves |
| Property | +0.3 | Property correlates more with risk assets |
| Commodities | +0.15 | Some correlation via economic cycle |
| Cash | 0.0 | Cash is independent |
| Equity (dampened) | +0.8 | It IS equity, just dampened |

### Testing the Implementation

After adding correlation, compare:
1. Overall success rate should **decrease slightly** (~1-3%) — the model
   now captures joint-bad-outcome risk
2. Worst-case scenarios should be **worse** — because stocks and bonds
   can now fall together
3. Median outcomes should be **roughly unchanged** — correlation affects
   tails more than centres
4. Run the same seed before/after to verify the change is working

### Impact on Existing Stress Scenarios

The predefined stress scenarios (Great Depression, 2008, etc.) use fixed
return sequences, so correlation doesn't affect them. It only affects the
random Monte Carlo runs. This is correct — the stress scenarios already
embed the real historical correlation implicitly.

---

## References

- Dimson, Marsh & Staunton, "Triumph of the Optimists" and annual Global
  Investment Returns Yearbook (Credit Suisse / UBS)
- FCA PS14/3 — Projection rates for pension illustrations
- FCA CP25/39 — Consultation on modernising projection assumptions
- Vanguard Economic and Market Outlook 2024-2034
- Kitces, M. "Monte Carlo Analysis: Better Alternatives To Fixed Return
  Assumptions" (kitces.com)
- Timeline "Withdrawal Rate Guidelines" methodology paper
