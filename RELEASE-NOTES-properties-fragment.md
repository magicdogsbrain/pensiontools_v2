# Release-notes fragment: the night run of 27 October 2026

For the lead to fold into the 6.45.0 entry of `src/releases.js`. Of the twelve failures the first night run to finish found,
one was the answer's fault (below); the other eleven were the properties' own — a precondition that restated half a rule,
an oracle that predated couples apart, a swap that moved a household between two models, an age missing from a list, a
tolerance tighter than the pence rounding, a guard on the wrong condition — and are fixed in the tests, with the reason
beside each (tests/v7/a/exceptions.md and tests/v7/c/exceptions.md carry the cases).

## corrections

- 'Preview, "When can I afford to stop work?" and "Am I saving enough?", a couple who stop work in different years: when the first of you to stop had used up their money before the second stop and the other had nothing, the years after the second stop still showed the whole amount spent as paid from pots that held nothing. Those years now show what there is — the State Pension and any final-salary pension, as the years before the second stop already did when nobody’s money could pay — and nothing from the pots. The verdict, the count of futures and the age the money ran out said so already and are unchanged; only those years’ lines move.'

- 'Preview, "Am I saving enough?", stopping before a pension opens: the savings set aside for the years before it opens are worked out with a pension behind them that cannot run out — and that pension was £5,000,000, which in a rare future of a very large spend could. Where it did, the savings were raised for that future, past what the years before the pension need, and the number behind them could move the wrong way for £10 a month less; a couple with one pension closed much longer than the other could be told that nothing a month reached those years when a pay-in did. The savings now carry the years before every pension is open, and no more: a future the pension itself cannot carry after that is the pension’s. The figures move only where a future needed more than £5,000,000 of pension behind the savings (one pinned case of the test corpora, a couple with one pension closed for 23 years and a 3% charge); the fixtures are unchanged.'

## effects (if the entry lists them per tool)

- stress, strategies, decision, household, accumulation, budget: none. The changes are in the preview’s answers to questions A and B only (src/answers/shared/toEngine.js, the years after the second stop of a couple apart whose pots are empty there; src/answers/shared/stopAt.js and src/answers/b/answer.js, the savings for the years before a pension opens); no figure a saved plan holds is read differently. One pinned answer in tests/v7 moved for the second (tests/v7/shared/answers.savingsGrowth.json, case 84 of both corpora, the reason there and in tests/v7/b/exceptions.md); none for the first.
