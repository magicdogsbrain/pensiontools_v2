# "Try the bad years" on a plan: where the order tests do not hold future by future

The order tests (`stressPanelRun.slow.test.js`, "order on the same futures") hold a row against its reference on the same
1,000 futures. These are the cases they leave out or read only in aggregate, and why.

| Case | What the test does | Why |
|---|---|---|
| Pots & Valves and Buckets with the cuts on | Aggregate only: a fall, lower returns and a tenth more spending each give at least As planned's weighted failures (`sumW`) and failed futures | A cut is a rule on the pots' level against a line; a future made worse can cross the line earlier, cut sooner and so run out later than it did. With the cuts off every future is held to the order (it held on every future of every plan tried) |
| Gilt ladder + rotation | Pinned, not ordered: the fall row's share of futures that rotate (0.993 on the 02 plan, against 0.395 As planned) | The fall is 30%, the rotation's own trigger, so whether a future rotates is decided by the last bit of its first year. A rotation sells the later rungs into shares, which can then do better or worse than the rungs |
| Prices rising faster | Left out of the order tests | Once last year's prices rose over 4.5% the bond model makes one or two more draws, so part of that row's change is noise |
| The held rows on a locked ladder | Fixed-age only (the count and the bad case), equal to the keep test's | The document holds no weighted figure for what is held |
| A plan that already lost more than 30% in its first year | Left as it is (the fall changes nothing in that future) | No row ever makes a future better than it was |
