/**
 * The words of "Assumptions and data" (research/v7/road-to-7.md step 11b, the ledger's strat.assumptions): the planner's
 * Strategies → Assumptions & data page in the preview's own words. Data only — this file imports nothing. Placeholders are
 * written {likeThis} and filled by the screen from the facts the effect loads (services/AssumptionsFacts.js). Every figure
 * is read from the same tables the engines use; nothing here is advice — it describes a model.
 */
export const ASSUMPTIONS = {
  title: 'Assumptions and data',
  lead: 'Where every figure comes from: the return history, the price history, how the futures are made, the gilt prices and what is assumed. Everything below is read from the same tables the engines use, so what you see here is what the numbers rest on. Nothing here is advice; it describes a model.',
  /** The words this page uses, said once: gilts are UK government bonds; index-linked ones rise with prices; a ladder is bonds that pay out one year after another; an annuity is guaranteed income for life. */
  words: 'A gilt is a UK government bond; an index-linked gilt is one whose payments rise with prices. A ladder is a row of bonds that pay out one year after another. An annuity is guaranteed income for life, bought from an insurer.',
  versions: 'App version {app}, engine version {engine}.',
  opening: 'Opening the tables…',
  failed: 'Sorry, the tables could not be read. The planner’s own page has them.',
  /** Each section: a heading, then rows of a name, the figure, and a note. */
  sections: {
    shares: {
      title: '1 · Shares',
      series: { name: 'The series', value: 'Calendar-year S&P 500 total return (dividends reinvested), {from}–{to} ({years} years)', note: 'Aswath Damodaran, NYU Stern. Committed with its provenance in the data file.' },
      adjustment: { name: 'The world adjustment', value: '{adjustment} percentage points a year taken off every year', note: 'UBS/Credit Suisse Global Investment Returns Yearbook 2024: US shares 6.6% a year real against the world’s 5.0%, 1900–2023. Someone with a world tracker is not modelled on US returns — the winner’s history.' },
      result: { name: 'What it averages (the geometric average)', value: '{nominal}% a year before prices · {real}% a year after prices', note: 'The worst year was {worstYear} ({worst}%), the best {bestYear} ({best}%).' },
      ladders: { name: 'The ladder and floor engines', value: 'Shiller’s monthly S&P price, dividend and price-index series from January 1871 on, the same adjustment applied monthly', note: 'Robert Shiller, Irrational Exuberance data. Gives 150 years of rolling windows for the ways of drawing that buy income.' },
      notModelled: { name: 'Not modelled', value: 'Currency; a UK-only share history', note: 'Barclays’ long-run study of UK shares and gilts: UK shares about 5% a year real over the long run — close to the world figure, not the US one.' },
      charges: { name: 'Fund and platform charges', value: 'Your plan’s setting ({charges}% a year unless you change it), taken off every month — while you save and while you draw — from every fund and cash pot, the ISA and the taxable account', note: 'Not taken off State Pensions, final-salary pensions or annuities, which carry no such charge, nor off gilts held directly (a ladder’s rungs, the gilts in a taxable account): platforms usually charge a small fixed fee for those. A plan locked before charges were added keeps its figures without them until it is unlocked. The world adjustment above concerns which shares, not costs.' }
    },
    prices: {
      title: '2 · Prices',
      series: { name: 'The series', value: 'The US price index, calendar years {from}–{to} (Shiller)', note: 'Geometric average {mean}% a year. The price index the pension has to keep up with; the UK’s price history is similar in shape, worse in the 1970s.' },
      futures: { name: 'Prices in the futures', value: 'Travel with the block of share history they came from', note: 'A 1970s block brings 1970s prices; a 2010s block brings 2010s prices. Bonds and cash then see a coherent stretch, not random price rises.' },
      monthByMonth: { name: 'Month by month', value: '{monthByMonth}% a year for the tax years you have not set up', note: 'Pessimistic on purpose. A year you have set up uses the price rise you entered.' },
      gilts: { name: 'Index-linked gilts', value: 'Paid on the retail price index (the housing-inclusive consumer index from February 2030) with the three-month lag the Debt Management Office uses', note: 'Your own prices (care, energy, services) may rise faster than the index; nothing here protects against that.' }
    },
    futures: {
      title: '3 · How the futures are made',
      oneTest: { name: 'The one test', value: '{runs} futures, each stitched from {blockYears}-year stretches of real history, plus every real window since 1871', note: 'Random consecutive stretches of real years are joined end to end, so booms, busts and price regimes survive intact. Independent yearly draws would understate the risk of a bad run early on. One test, one figure on every page.' },
      history: { name: 'The real history', value: 'Every start year {from}–{to} for Pots & Valves; every start month since 1871 for the ladders', note: 'The windows overlap: 150 years is really only some ten independent 15-year draws. Treat the tail as a sign of what can happen, not a probability.' },
      calibration: { name: 'Calibration', value: 'A flat 4% draw for 30 years, no tax, no pension: some 82 futures out of 100 last (the published US Trinity figure is about 95)', note: 'Some ten points below the US figure on purpose — the world adjustment. Pinned by a test; a 5% draw for 30 years lasts in some 59, a 6% draw in some 39.' },
      named: { name: 'The named stresses', value: 'The Great Depression (1929), the stagflation of the 1970s (1973), the lost decade (2000), 2008, and a made-up worst', note: 'On “Does it last?” each real decade is replayed from its January with your own plan, and the decade’s own figures for shares and prices are said beside it. The made-up decade is not in the test: no real start is that bad.' }
    },
    pots: {
      title: '4 · Bonds, cash and the ISA (Pots & Valves)',
      bonds: { name: 'The bonds pot', value: 'A blend: 15% index-linked gilts, 30% ordinary gilts, 20% property, 10% commodities, 10% cash, 15% shares; leans towards index-linked gilts when last year’s prices rose more than 4.5%', note: 'A model of a diversified steadier fund, not a gilt index. Ordinary gilts lose when prices rise more than 4% a year; shares and bonds fall together in a price shock (2022).' },
      cash: { name: 'Cash', value: 'Earns last year’s price rise less 1% a year, never below nothing', note: 'Cash lags prices and never goes down in pounds — a real return of about −1% a year, as the FCA assumes.' },
      isa: { name: 'The ISA', value: 'Your plan’s setting: “Mostly cash” (the default) grows like the cash in your pension; “Invested like my pension” follows your pension’s shares, bonds and cash in the same futures', note: 'Before charges, which come off it every month. “Hold” keeps the ISA out of every way of drawing: it is never sold to buy rungs. An ISA made of funds in your list follows those funds. A plan locked before the choice existed keeps a fixed 3% a year until it is unlocked.' },
      cuts: { name: 'Cuts in a slump', value: 'Income × {mult} after {months} months in a row with shares, bonds and the gold and trend pot all below their floors; back to the full figure after a {buffer} recovery', note: 'Every page runs the plan’s own cuts setting: the ranking, the way of drawing’s page, the first answer and the plan document show one figure. A what-if with the cuts off is “Try a change” on “Does it last?”.' }
    },
    gilts: {
      title: '5 · Gilt ladders and live data',
      inIssue: { name: 'Gilts in issue', value: 'The Debt Management Office’s list, generated {generated}', note: 'Only index-linked gilts with the three-month lag are used for ladders; the old eight-month-lag stocks are left out.' },
      inIssueNone: { name: 'Gilts in issue', value: 'Not loaded', note: 'The bundled list could not be read.' },
      pricesRow: { name: 'Prices', value: 'Delayed exchange closes as of {asOf}', note: '{source} Refreshed nightly by a scheduled job; when the file cannot be read, the page says the prices are old.' },
      pricesStale: ' — more than 48 hours old',
      curve: { name: 'Real yield curve', value: 'Bank of England real spot curve as of {curveAsOf} ({curvePoints} points)', note: 'Every rung is priced at its own maturity’s real yield, never a flat guess. Future rungs (the ratchet’s reviews) are priced on today’s curve at their then-maturity, which is optimistic if short real yields stay low.' },
      curveNone: { name: 'Real yield curve', value: 'A flat 2.3% a year, the fallback', note: 'No curve could be read, so every rung is priced at the same real yield.' },
      today: { name: 'Today’s curve', value: '{curve}', note: 'Real, linked to the retail price index. Before prices: {nominalCurve}.' },
      costs: { name: 'Order-sheet costs', value: 'Units = what each year pays ÷ the index ratio, rounded up to £100; bid–offer {spreadShort}% up to five years, {spreadMid}% up to fifteen, {spreadLong}% beyond; £{dealFee} a trade', note: 'Index ratios from the Debt Management Office’s formula (the base price index, three-month lag), checked to five decimal places against its publications.' },
      notAdvice: { name: 'Not advice', value: 'Every ladder shown is an illustration priced from public data', note: 'Whether to buy anything, and which gilts, is your decision or your adviser’s.' },
      indexRow: { name: 'The share index watched', value: '{symbol} at {level} on {date}', note: '{source} The rotation’s watch reads it; when the file cannot be read the bundled snapshot stands in.' }
    },
    tax: {
      title: '6 · Tax',
      bands: { name: 'The bands', value: 'Personal allowance £{pa}, basic-rate limit £{brl}, higher-rate limit £{hrl}; the allowance tapers above £{taper}', note: 'Rates 20%, 40% and 45%. Frozen (the default) or rising with prices — your choice in the plan’s settings. Scottish bands are not modelled.' },
      access: { name: 'Taking the pension', value: 'Drawdown, or lump sums with a quarter tax-free each time, with the tax-free lump sum as an option', note: 'The earliest age is 57 from April 2028; paying in more than £10,000 a year after taking money out is flagged on “What you pay in”.' },
      taxable: { name: 'The taxable account', value: 'Dividend allowance £500 (8.75% and 33.75% above it), savings allowance £1,000 or £500, capital gains exemption £3,000 (18% and 24%); gilts free of capital gains tax', note: 'Drawn before the ISA; a lump sum lands here once the £20,000 ISA allowance and the pension’s room (£10,000 a year after taking money out; a £3,600 floor with no earnings) are used. “Bed and ISA” moves £20,000 a year when switched on.' },
      notModelled: { name: 'Not modelled', value: 'National Insurance in retirement, tax on the estate, carrying a capital loss forward', note: 'The ISA is tax-free; what the pension pays out is income.' }
    },
    limits: {
      title: '7 · Known limits',
      items: [
        'One person at a time. The household page tests two plans together; there is no survivor’s figure and no second tax allowance inside one plan.',
        'No property and no final-salary pension inside the pots (a final-salary pension is money that comes in anyway). The taxable account is one mix, not a list of funds.',
        'One-off costs from the budget are averaged into the figure a month, not placed in a year; one-off costs on “What you spend” are placed in their year.',
        'The history is US shares with a world adjustment — Japan from 1989, or UK shares alone from 1965 to 1980, would look worse.',
        'No give in spending when ways of drawing are compared unless the cuts are on — pessimistic on purpose.'
      ]
    }
  },
  /** The code and the data, for anyone who wants to read them. */
  source: 'The code and the data files are public: {repo} — the market-data build script, the nightly gilt fetch and the market-data audit are there.',
  repo: 'github.com/magicdogsbrain/pensiontools_v2',
  repoHref: 'https://github.com/magicdogsbrain/pensiontools_v2',
  columns: { name: 'What', value: 'The figure', note: 'Note' },
  back: 'Back'
};
