# How long people live: the ONS life tables behind "the chance the money lasts as long as you do" (7.8.0)

The data file `src/data/onsCohort2024.json` holds death rates q(x) by sex and year of birth, from the Office for National
Statistics. `src/services/LongevityModel.js` reads it; nothing else does. This note says where the figures come from, how
the file is built, and how we checked it. Retrieved 11 November 2026. Open Government Licence v3.0.

## Source

| What | File | SHA-256 |
|---|---|---|
| Mortality rates (qx), principal projection, England and Wales, 2024-based (published 15 May 2026) | `ewppp24qx.xlsx` | `6fde86280da8950b9a9eba9171c52c7413787ef6aa906b5b6c72906249e00829` |
| Expectation of life (ex), the same edition (used only for the checks) | `ewppp24ex.xlsx` | `35d5c4a13792adc86dd688dfe0241bfe2a2e7813f846d805f0e17e103dc3ec1e` |

URLs (both start `https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/datasets/`):

- `mortalityratesqxprincipalprojectionenglandandwales/2024based/ewppp24qx.xlsx`
- `expectationoflifeprincipalprojectionenglandandwales/2024based/ewppp24ex.xlsx`

Dataset page: https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/datasets/mortalityratesqxprincipalprojectionenglandandwales

Why this edition: it is the newest, and the ONS's own life expectancy calculator uses it. The 2022-based edition lives a
little shorter at the ages that matter here, so it is the less cautious of the two.

## The file

```
{ source, url, edition: '2024-based', region: 'England and Wales', published: '2026-05-15', retrieved: '2026-11-11',
  tablesVersion: 'ons-ew-2024-cohort/1', scale: 1e7, firstBirthYear: 1935, lastBirthYear: 2008, ageTo: 110, notes: [5],
  m: { '1935': [fromAge, q(fromAge)·1e7, …, q(110)·1e7], …, '2008': […] }, f: { … } }
```

- **q(x)** is the chance that someone born in that year, alive at exact age x, dies before x + 1. ONS publishes it per
  100,000 to two decimal places, so q × 10,000,000 is a whole number and exact for every published cell.
- **Ages kept:** from max(18, 2025 − year of birth) to 110: everything read forwards from today, nothing before calendar
  year 2025. There are no gaps.
- **Size:** 62,437 bytes (31,054 gzipped): 8,508 whole numbers, most of six or seven figures. (The build spec guessed
  52 KB; the test holds it under 64 KB.)

## How each value is made (`scripts/ons-cohort.py`, standard library only)

1. **Years of birth 1981–2008, ages to 100:** the ONS cohort qx sheet as published (it lists years of birth 1981–2074
   from age 0).
2. **Years of birth 1935–1980, ages to 100:** the cohort sheet starts at 1981, so each value is the ONS period qx for
   calendar year (year of birth + age). That is how ONS builds its cohort rates: the two sheets agree on every one of the
   4,465 cells per sex where both have a value (largest difference 0).
3. **Years of birth 1975–1980 at calendar years after 2074** (their oldest ages only): neither sheet has these cells. Each
   is a geometric interpolation at that age between the period qx for 2074 and the 1981 cohort's qx (calendar year
   1981 + age).
4. **Ages 101–110:** ONS does not publish them (it supplies them on request). Each cohort and sex is extended by a
   straight line in logit(q) fitted to its own ages 91–100. Above 110, q = 1.

Rebuild: `python3 -I scripts/ons-cohort.py build ewppp24qx.xlsx src/data/onsCohort2024.json`. Check:
`python3 -I scripts/ons-cohort.py check ewppp24qx.xlsx ewppp24ex.xlsx`.

## How the model reads it

- Within a year of age deaths are spread evenly: from u into the year, S(x+u → x+u+f) = (1 − (u+f)·q) / (1 − u·q),
  multiplied over the years of age. Only ×, + and ÷ touch a figure, so every engine gives the same bits.
- A person aged a today (whole years) is taken as born in (this year − a). A fractional year of birth is read on a
  straight line between the two years either side.
- Clamps: born after 2008 reads 2008; before 1935 reads 1935 (the longer-lived side); an age below a line's first age
  reads its first.
- Not said reads the women's figures: a later plan-to age and heavier weights, the cautious side.
- A couple: the chance at least one of them is alive, each at their own age, year of birth and sex, lives taken as
  independent.
- **The plan-to age** is the younger person's age when fewer than 1 in 10 (households) are still alive, rounded up, at
  least 5 years after the money starts and at most 105. **The weighting age** is the same at 1 in 50, at most 105.

## Checks (all from the raw workbooks; pinned in `tests/lifeTable.test.js`)

| Check | Result |
|---|---|
| 12 cells against `ewppp24qx.xlsx` (cohort and period sheets, ages 18–100, years of birth 1935–2008) | exact |
| Life expectancy from the file against the ONS cohort ex table, years of birth 1945–2008 at 50, 65, 75, 85, 95, 100 | within 0.11 years everywhere (largest 0.101, at 100, where our line past 100 is a little shorter-lived than ONS's own); at 65 within 0.01 |
| e65, born 1960: men 20.18 (ONS 20.18), women 22.90 (ONS 22.90); born 1966: men 20.62 (ONS 20.62), women 23.39 (ONS 23.39) | to 0.01 |
| 1 in 10 still alive, from 65: born 1960 men 96.36, women 98.57; born 1966 men 96.84, women 98.98 | |
| 1 in 50 still alive, from 65: born 1960 men 100.83, women 102.78 | |
| Couple both 65, born 1961, one of them alive at 1 in 10: a man and a woman 99.78; two women 100.64 | |
| A couple 15 years apart (80 and 65): the joint age is the younger person's alone | plan to 99 both ways |
| q rises with age from 30 on every line; women's q is never above men's | every cell |

The Python check and the JavaScript model agree on every age above to 0.001.

## The standard has to rise with the weighting

A chance weighted by how long people live is higher than a count of futures to one fixed age: running out at 98 counts
for less than at 80. Kitces notes that 90% over 30 years for a 65-year-old couple is about 98% once the chance of dying
earlier is counted (https://www.kitces.com/blog/monte-carlo-analysis-customize-probability-success-risk-tolerance-spending-portfolio-volatility/),
and that randomising the lifespan is sound only if the standard for success is raised to match. So our levels are set on
the weighted scale and ask for more than the advisers' fixed-age 75–90%: Careful 19 times in 20, Balanced 18, Bold 14.
The fixed-age figure is always shown beside the weighted one.

## Recorded, not built: people with pension savings live longer

These are figures for everyone in England and Wales. People with pension savings tend to live a little longer than the
population as a whole (the CMI's tables for pension scheme members, and the ONS's own figures by deprivation, both show
it). One way to allow for it is a multiplier below 1 on every q (for example 0.9). It is not built: it would be one
constant in `LongevityModel.js` and a new `tablesVersion`, and it needs a source we can name for the figure.
