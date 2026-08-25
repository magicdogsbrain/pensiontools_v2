# Market-data audit — August 2026

**Trigger.** On 24 Aug 2026 the Strategies compare (Shiller real-terms history) and the Stress tab
(bundled `EQUITY_RETURNS`) disagreed by 30–50 points on identical plans. The user, calibrated on
eight months of Stress-tab output, saw the corrected numbers as "BS". This document is the audit
that settles which was wrong, with sources anyone can re-check.

## 1. The table that shipped was not market data

`src/constants.js` (present since the repo's first commit, 25 Jan 2026, "Initial v2 release")
carried a table headed *"US S&P 500 TOTAL RETURN (1928-2024)"*. It cited no source. Checked
year-by-year against the published calendar-year series (Damodaran, NYU Stern — see §5):

| | Old table | Published |
|---|---|---|
| Geometric mean 1928–2024, nominal | **5.66%** | **9.94%** |
| Geometric mean, real (Shiller CPI) | 2.56% | 6.69% |
| Mean absolute error per year | 6.0 pp | — |
| Years off by more than 5 pp | 50 of 97 | — |

Sample years (old → true): 1950 +17.9% → **+30.8%**; 1980 +14.9% → **+31.7%**; 1998 +16.3% →
**+28.3%**; 2019 +22.3% → +31.2%; 2022 −8.8% → **−18.0%**; 2023 +14.0% → **+26.1%**; 2024 +13.0% →
**+24.9%**. The values match neither price return nor total return. The pattern — right sign
and rough shape (correlation 0.96 with the truth), wrong magnitude in most years, systematically
low — is what a series *typed from memory* looks like, not one computed from data. It was
almost certainly produced by an AI assistant in the v1 era and never validated. There is no
excuse for that; the lesson is in §6.

**Consequence.** Equities compounding at 2.6% real instead of 6.7% real for 35 years makes any
normal withdrawal rate look reckless. Every Stress-tab, Accumulation and Household number the app
ever showed was wrong in the pessimistic direction — typically by 30–45 points of survival.

## 2. The replacement, and how it was verified

`scripts/build-market-data.mjs` now generates the table; it is never hand-edited.

- **Equity (1928–2024):** calendar-year S&P 500 total return, dividends reinvested, from
  *Damodaran, NYU Stern, "Historical Returns on Stocks, Bonds and Bills"* — committed verbatim as
  `src/data/damodaranReturns.json` (with T-bill and 10-year T-bond columns for future
  calibration). Geometric 9.94% nominal / 6.69% real.
- **Inflation:** Jan/Jan CPI from the bundled Shiller monthly dataset (2023–24 appended from
  published CPI-U). Mean 3.1%.
- **Cross-check A (independent dataset):** a series derived from Shiller's monthly prices +
  dividends gives 10.13% nominal — within 0.2 pp of Damodaran on the mean (single years drift
  because Shiller prices are monthly averages, which is why Damodaran is the source).
- **Cross-check B (published summaries):** "From 1928 through 2025 the S&P 500's compound
  annual growth rate is 10.0% with dividends reinvested" (SlickCharts); arithmetic mean ≈11.9%
  (multiple sources). Both consistent.

## 3. Does the engine now agree with the literature?

The classic safe-withdrawal-rate studies (Bengen 1994; Cooley, Hubbard & Walz "Trinity" 1998;
Pfau's 2018 update) use exactly this kind of US data. Engine set to their conventions (no tax, no
State Pension, flat inflation-adjusted draw, 60/40, no spending cuts):

| Draw / horizon | Engine (1,000 futures) | Engine (every history) | Published range |
|---|---|---|---|
| 4% / 30 yrs | 91% | 94% | ~95–100% |
| 4% / 35 yrs | 87% | 90% | ~90–95% |
| 5% / 30 yrs | 74% | 72% | ~70–80% |
| 5% / 35 yrs | 67% | 65% | ~65–75% |
| 6% / 30 yrs | 54% | 62% | ~50–60% |
| 3% / 40 yrs | 97% | 100% | ~100% |

The engine sits at the *bottom* of every published range — deliberately slightly pessimistic
(the design preference), because its bond bucket earns ~1.1% real against ~1.4–1.7% for 10-year
Treasuries, and cash −0.5% real against +0.3% for T-bills. Equities are on the data (6.9% real).

## 4. The user's plan, so the numbers are traceable

£1.26M (£600k equity, £480k bonds, £120k cash, £60k ISA), £60,646/yr gross flat for life, State
Pension £12,480 from year 10, 35 years, no spending cuts. That is a 4.8% draw for ten years then
3.8% net of the pension.

| | Survival |
|---|---|
| Old table (what the app showed until 25 Aug) | 41% |
| Engine, corrected data | **82%** (76% on every history; 88% with 20% cuts on) |
| Bare back-test, Shiller windows since 1871, 60/40, bonds 2% real, no tax | 97% |
| Bare back-test, bootstrapped 1928–2024, 60/40, no tax | 91% |

Of the ~180 failing futures, half also fail in the bare back-test; the other half are
high-inflation paths where the engine's cautious bond/cash returns (−0.1% and −0.8% real in
those futures) turn a marginal plan into a failing one. No money is stranded at failure
(median £28k real left, all buckets empty) — the glidepath floors are not producing false
failures.

## 5. Sources

- Damodaran, A. — *Historical Returns on Stocks, Bonds and Bills: 1928–2024*, NYU Stern.
  https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html (retrieved 25 Aug 2026)
- Shiller, R. — *Irrational Exuberance* online data (monthly S&P composite price, dividends, CPI,
  1871–), bundled as `src/data/shiller.js`.
- SlickCharts — S&P 500 total returns by year: https://www.slickcharts.com/sp500/returns
- Pfau, W. — *The Trinity Study and Portfolio Success Rates (Updated to 2018)*, Forbes, Jan 2018.
  https://www.forbes.com/sites/wadepfau/2018/01/16/the-trinity-study-and-portfolio-success-rates-updated-to-2018/
- Barclays Equity Gilt Study (via Courtiers) — UK real returns 1899–2023: equities ≈5%, gilts
  1.4%, cash 0.5% p.a. https://www.courtiers.co.uk/news-and-insights/the-courtiers-equity-and-gilt-study/
- Monevator — *UK historical asset class returns*: https://monevator.com/uk-historical-asset-class-returns/

## 6. What changes so this cannot recur

1. **No hand-typed market data.** Every series in `constants.js` is generated by a script from a
   committed source file with provenance, and the header says so.
2. **Calibration test.** `tests/calibration.test.js` (added with this audit) asserts the engine's
   4%/30y and 5%/30y 60/40 success rates stay inside the published Trinity bands, so a data or
   engine regression of this kind fails CI.
3. **UK anchor (open).** All of this is US data. UK equities returned ≈5% real over 1899–2023
   (Barclays), roughly 1.5–2 pp below the S&P. A UK-history lens would lower every number by a
   few points and is the honest "pessimistic" setting for a UK user; it needs a licensed or
   open UK annual series and is not yet built.

## 7. Addendum (25 Aug 2026, later): WORLD equity, not US — applied, not optional

A world-tracker holder (VWRL/VWRP/PACW) should not be modelled on US returns. The UBS/Credit
Suisse Global Investment Returns Yearbook 2024 gives 1900–2023 real returns of **US 6.6%/yr,
World 5.0%/yr, UK 5.3%/yr**. The app now applies the 1.5 pp/yr gap everywhere, as data, not as a
setting: `EQUITY_RETURNS` = Damodaran S&P total return × (1 − 0.015) − 1 per year (8.29% nominal /
5.09% real), and the ladder engines' Shiller real index is haircut monthly inside `getRtr()`.
The brief's golden sets A/B/C pin the raw reference maths and opt out explicitly. Engine on this
basis (Trinity conventions, 60/40): 4%/30y 82%, 5%/30y 59%, 6%/30y 39%, 3%/40y 89% — about ten
points below the published US figures, by design; `tests/calibration.test.js` pins those bands.
