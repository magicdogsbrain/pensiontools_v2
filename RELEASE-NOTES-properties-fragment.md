# Release-notes fragment: the night run of 27 October 2026

For the lead to fold into the 6.45.0 entry of `src/releases.js`. Of the twelve failures the first night run to finish found,
one was the answer's fault (below); the other eleven were the properties' own — a precondition that restated half a rule,
an oracle that predated couples apart, a swap that moved a household between two models, an age missing from a list, a
tolerance tighter than the pence rounding, a guard on the wrong condition — and are fixed in the tests, with the reason
beside each (tests/v7/a/exceptions.md and tests/v7/c/exceptions.md carry the cases).

## corrections

- 'Preview, "When can I afford to stop work?" and "Am I saving enough?", a couple who stop work in different years: when the first of you to stop had used up their money before the second stop and the other had nothing, the years after the second stop still showed the whole amount spent as paid from pots that held nothing. Those years now show what there is — the State Pension and any final-salary pension, as the years before the second stop already did when nobody’s money could pay — and nothing from the pots. The verdict, the count of futures and the age the money ran out said so already and are unchanged; only those years’ lines move.'

## effects (if the entry lists them per tool)

- stress, strategies, decision, household, accumulation, budget: none. The change is in the preview’s answer to questions A and B only (src/answers/shared/toEngine.js, the years after the second stop of a couple apart whose pots are empty there); no figure a saved plan holds is read differently, and no pinned answer in tests/v7 moved.
