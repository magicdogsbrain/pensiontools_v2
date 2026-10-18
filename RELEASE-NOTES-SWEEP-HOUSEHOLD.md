# Release notes — household sweep (survivor and care checks through each plan's own test)

No version bump in this change. When it ships, put this entry at the top of `RELEASES` in `src/releases.js`, set the
version (the Household tab's figures change, so a minor bump is suggested) and the date, and bump `package.json` to match.

```js
  {
    version: 'x.y.z', date: 'YYYY-MM-DD', engineVersion: '6.22.0',
    title: 'Household: the survivor and care checks run each plan through its own test',
    summary: 'On the Household tab, "What if one of you dies?" and "What if one of you needs care?" ran every plan as a portfolio of shares, bonds and cash, whatever its way of drawing — so a gilt ladder was tested as if it were invested for growth. The survivor check also added the median pension and the median ISA from different futures and raised the result by 2.5% a year into future pounds, beside spending in today\'s money: on a gilt-ladder plan the inheritance it showed was about double what the plan leaves. Both checks now run each plan through its own strategy\'s test — the same one test as Will it last?, the Strategies page and the household verdict — and say the result in the planner\'s words, in today\'s money.',
    changes: [
      'Survivor check: the inheritance is what the other person\'s own plan has left in that year in its own test: about £X in a middling case and £Y in a bad case (the worst 1 in 10), today\'s money. A gilt-ladder plan that holds its ISA aside adds the ISA as it holds it. The survivor\'s plan is then run through its own strategy\'s test twice, with each inheritance, and the result is said as "lasts in N futures out of 10" for each.',
      'Survivor check: the survivor\'s spending from that year is the chosen share of what you both spend after tax, grossed up again on the survivor\'s own tax bands, and shown as a figure a year before tax with what it leaves after tax beside it. The inheritance arrives as a pension that stays a pension and an ISA that passes as an ISA; a final-salary survivor\'s pension continues as an income stream, as before.',
      'Care check: the care cost is entered as a figure a year after tax, in today\'s money, and added to that person\'s plan as one-off costs — the same key the planner\'s own one-off costs use, grossed up on top of that year\'s spending. Both plans run through their own tests, paired future for future, and the household verdict comes first (when one pot is empty, the other pays), with care and without; both plans each lasting on their own is shown beside it.',
      'The year boxes now read "Years from now", and each plan\'s own year is found from it (a partner who has not started drawing starts later).'
    ],
    corrections: [
      'Survivor check: a gilt ladder (full or with rotation), a floor or a bridge was tested as a growth portfolio. Each plan now runs on its own strategy. On a gilt ladder + rotation that leaves about £0.73M in its own test ten years in, the check said it left about £1.48M.',
      'Survivor check: the inheritance was the median pension plus the median ISA, taken from different futures, then raised by 2.5% a year into future pounds and shown beside spending in today\'s money. It is now the middle and the worst 1 in 10 of the total the plan leaves, in today\'s money.',
      'Survivor check: the survivor\'s spending was 70% of the two plans\' before-tax figures added together. It is now 70% of what you both have after tax, taxed again as one person.',
      'Care check: both plans were tested as growth portfolios, the cost was added before tax although care fees are paid from money after tax, and the result counted only futures in which both pots lasted on their own. Each plan now runs its own test, the cost is grossed up, and the household verdict (when one pot is empty, the other pays) comes first.'
    ],
    effects: {
      household: [
        'The survivor and care checks give different figures: lower inheritances on gilt-ladder, floor and bridge plans (often about half), and on every plan an inheritance in today\'s money rather than future pounds. Nothing is saved: both checks are what-ifs and never change a plan, locked or not.'
      ],
      stress: [], strategies: [], decision: [], accumulation: [], budget: []
    },
    actions: ['If you ran the survivor or care check before, run it again: the earlier figures came from a different model.'],
    notes: [
      'Simplifications still made: pensions are inherited tax-free (death before 75); the ISA passes as ISA (the spouse\'s extra allowance); the inheritance is split between pension and ISA in the shares the plan started with; gilts still held count at what they cost; the bad case sets the worst 1 in 10 of what is left against every one of the survivor\'s futures rather than future by future (cautious); care fees are added in full and no means-testing is modelled.',
      'Nothing outside the one test may now run the drawdown engine directly; a test fails the build if anything does.'
    ]
  },
```
