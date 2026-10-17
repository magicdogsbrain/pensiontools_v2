# Release-note bullets — batch C (monthly entry, tax-year set-up, pasted holdings)

For `src/releases.js` when the version is bumped. Plain English; each bullet is one user-visible change.

## Changes

- **Month by month asks for what your platform shows.** The monthly entry now asks for the pension total, of which cash, and of which bond funds or gilts — shares are the rest. A gilt-ladder plan asks only for the total and the cash (the gilts are the difference; nobody adds up 22 rungs). A plan with a gold-and-trend sleeve keeps that box. Last month's figures are filled in, ready to change. "Enter by type instead" keeps the old boxes (shares / bonds / cash / gold and trend, or per fund).
- **The tax-year set-up is three screens, not six or seven.** Everything the app cannot know is on one screen: income already received this tax year (mid-year starts), last year's inflation, income before tax, other taxable income and gains already made. The tax bands are no longer a question — they read "We assume a tax-free allowance of £12,570, 20% tax up to £50,270 …" with a Change link, pre-filled from your plan. Screen two is the tax-free top-up, with the choice (top up, take less, or pay 40% on the part above the band) on the same screen when the top-up falls short. Screen three confirms.
- **"Target salary" is gone**: the set-up says "income before tax" throughout, and no longer says "BRL".
- **Every pasted line counts.** Pasting your holdings no longer drops lines it cannot recognise. Each one asks "What is this?" (shares, bonds, cash, gold and trend, don't know) in the preview, and the summary says what was read, what is not recognised yet and what was left out and why (a total line, a line with no value). Under What you hold, a line still unplaced shows the same question, and the total says how much is not in the mix yet. The audit's case — £282,550 pasted, the pot reading £97,300 — now shows the £185,250 it could not place and asks.

## Corrections

- The tax-year set-up said "0 years until state pension" when the State Pension was already in payment or its date was missing. It now says "In payment: £998 a month (£11,973 this tax year)", "Starts 17 April 2037 — 10 years 7 months away", or "Not in your plan yet — add your State Pension forecast under Settings if you have one".

## Effects on saved plans

- **Month by month:** none on recorded months or locked plans. The engine receives the same per-type figures it always has; a record made from now on also keeps exactly what was typed and the split it became (`entered` on the record). Older records are read, never changed.
- **Tax years:** the set-up saves the same tax-year configuration as before (bands, CPI, income, top-up, tax mode, income to date, tax paid). Tax years already set up are untouched.
- **What you hold:** a line answered "don't know" stays on the record and counts in the total; it is not placed in the mix until answered. Lines already recognised are unchanged.

## Actions

- None required. On your next monthly entry, check the pre-filled figures against your platform and change them to this month's.

## Notes

- The "What is this?" answers map to plain stand-ins for the modelled mix: shares → world growth, bonds → global bonds (£-hedged), cash → money-market, gold and trend → gold. Tag a fund precisely under the Stress tester's fund list if you want a different sub-class.
- The entry view you choose (platform view or by type) is remembered in this browser only.
