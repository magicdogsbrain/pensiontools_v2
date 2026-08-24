# Pensiontools — strategy chooser: UX and infographic design brief
## Companion to the strategy-engine brief (v4). Governs Phase E and the visual layer of Phase D.

---

## 1. Purpose and audience

Three strategies, each with dials, will bewilder a fair share of users. This document exists so the choosing experience is engineered as seriously as the engines: a visitor with no bond knowledge should be able to understand all three strategies, compare them on their own numbers, configure one, and lock it in — in about 10 minutes — and afterwards be able to say in their own words what they chose and how it can fail. That last sentence is the acceptance test for the whole design (§9).

Audience: UK DIY retirees and near-retirees, numeracy ranging from professional to nervous. Design for the nervous end; let the professionals open the bonnet. The tool never crowns a strategy — it teaches trade-offs and lets the user choose.

## 2. Design principles (house rules — apply everywhere)

1. **One metaphor per strategy, carried everywhere.** Pots with valves; a ladder with a balloon and a ratchet; a floor slab with a flex balloon. The same illustration components appear in the explainer, the compare view, the configure screen, and later the Monitor mode, where a standing **safe-to-spend readout** (`spendable_surplus` today, in £) sits beside the metaphor with the band line drawn in, and each 6 April a one-question prompt per wrapper: take, skip or resize this year's withdrawals. Users learn the picture once.
2. **The one colour-and-shape law.** Contractual money (rungs, floor, cash) is always a **solid filled shape**. Market money (equity sleeve, pots) is always **outlined / translucent**. One accent colour per strategy; never encode meaning in colour alone.
3. **Progressive disclosure.** Metaphor → mechanics → dials → maths. Nothing on layer 1 requires a definition; jargon lives behind an "under the bonnet" disclosure.
4. **Both lines, always.** Every surface that names a strategy shows its promise line and its honest failure line. The failure line is repeated at the moment of locking.
5. **Real numbers, the user's numbers.** Once the user has entered pot size and income need, every illustrative figure on every screen is computed from *their* inputs by the real engine. No fake numbers anywhere in the product — the explainer charts are produced by the same engine that runs the plan.
6. **Captions ≤12 words, sentence case, plain British English**, reading age ~14 on explainer layers.
7. **Motion with restraint.** One animated money-flow per explainer, played on demand, ≤8 seconds, honouring `prefers-reduced-motion` with a static equivalent.
8. **Mobile-first.** Explainers are single-column scroll; the compare view stacks to swipeable cards under 700px; dials are thumb-sized.
9. **Accessibility**: WCAG AA contrast, colour-blind-safe accents, every illustration carries alt text equal to its caption, full keyboard navigation, charts backed by a data table toggle.

## 3. The journey: Orient → Learn → Compare → Configure → Lock

### 3.1 Orient (60 seconds)
Three sliders, no jargon: *certainty ↔ upside*, *level income ↔ flexible income*, *set-and-forget ↔ hands-on*. Output is a **soft ordering** of the three strategy cards ("start with this one"), explicitly labelled a starting point, not advice. Skippable.

### 3.2 Learn (one scrollytelling explainer per strategy)
Each explainer is the same five-beat structure:
1. **The picture** — the metaphor illustration with the promise line.
2. **The storyboard** — the four panels (captions already fixed in the engine brief §2/§4e).
3. **Two canned decades** — an interactive scrubber through one famous bad stretch (start 1966) and one boom (start 1985), the real engine driving the metaphor: the user watches what *this* strategy does — pots refilling, rungs being bought, the flex balloon shrinking — with income and pot values ticking alongside in their own £.
4. **When it shines / how it fails** — three short lines and the failure line with one concrete number from the canned decades.
5. **Under the bonnet** — the dials preview and a link to the maths.

### 3.3 Compare (the stress tester, dressed properly)
Same seeds, same income profile, always — the engine enforces it, the UI states it ("identical markets for all three"). Layout: three columns (stacking on mobile), each headed by its metaphor icon.
- **The layered spending chart** (the centrepiece): every income source a named band — ladder rungs, state pension, DB and other external incomes, cash bridge all solid; equity/flex draw and spent surpluses translucent — stacked to one total-spending line. Flows that cancel by design are still shown; the user entered them to see them. This one chart carries most of the comparison.
- **The "safe to spend" line**: wherever the sleeve is drawn against its glide path, the surplus above the path is labelled as spendable money as well as lockable money. In the single-path inspector every trigger shows both futures side by side — "2 more locked years" next to "£X of spending this year" — presented neutrally (§5).
- **Signature charts**: L&R's extra-years-secured histogram; P&V's floor-touch frequency; F&F's worst-year-treats distribution.
- **The plain table**: worst 12 months you'd have lived; income guaranteed to age; chance of running out; typical amount left at the horizon. Four rows, no more.
- Toggle: 150 years of history ↔ Monte Carlo (with confidence widths shown, per engine brief Appendix D).

### 3.4 Configure (the buttons and dials)
Dials are grouped identically for every strategy — **Profile / Trigger / This strategy** — and every dial obeys the **live-consequence rule**: moving it updates one plain sentence and one number, computed by the engine. The full inventory:

| Control | Type | Default | Live consequence sentence (template) |
|---|---|---|---|
| Income profile | phase editor: draggable steps on an income chart | go-go 10 yrs | "£60k to 2037, then £36.5k + state pension." |
| Taper (alt) | 3 numeric fields | 1%/yr from yr 5 | "Income drifts down to £X by age Y." |
| Trigger mode | segmented: band / calendar | band | — |
| Band threshold | slider 1.05–2.0 | 1.2 | "Sells only above £X; never more than 17% at once." |
| Glide-path rate | presets 4/5/6% + fine slider | 5% | "Your £184k must reach £X by 2036 to trigger." |
| Calendar cadence | segmented: 5-yearly / annual / monthly | 5-yearly | "Reviews in 2031, 2036, 2041, 2046." |
| Ladder end (L&R) | age stepper | 80 | "Income locked to 2049; costs £X today." |
| Floor amount (F&F) | £ input | from user | "Every £1k a year of bills costs about £24k up front." + bank-statement prompt |
| Floor horizon (F&F) | segmented 92/95/100 | 92 | "Bills paid to 2061 by contract; £X today." |
| Sleeve rate (F&F) | slider 3–5% | 4% | "Treats start at £X; worst year in 150 yrs would have been £Y." |
| Floor ratchet (F&F) | toggle + raises/extends choice | off | "Booms make the floor taller / longer." |
| Collars (F&F) | optional £ min/max | off | "Treats never below £X (paid from sleeve capital)." |
| External incomes/costs | repeating editor (name, £, start, end) | state pension prefilled | "Total spending shown includes your £X DB from 2030." |
| Surplus destination | segmented: lock / spend / ask | lock | "Each trigger shows both uses: a locked year or £X to spend." |
| Wrapper funding order | drag-to-order list + per-wrapper hold rule | SIPP first, ISA preserved | "ISA untouched until 2032; choosing this costs ~£X vs the tax-optimal order." |

Advanced items (skim target, parked-cash rate, OCF, horizon cap) sit collapsed under "under the bonnet" with the same live-consequence treatment.

### 3.5 Lock
A summary card in plain words — strategy name, the metaphor icon, the profile shape, the trigger setting, the three headline numbers from Compare — with the failure line restated immediately above the confirm button. Locking pins parameters and engine version (per engine brief Phase B). A visible affordance: "Try another strategy in a cloned plan" — comparison never mutates a locked plan.

## 4. The three metaphor illustrations (component specs)

Built as SVG component sets with named states, so the same parts serve Learn, Compare, and Monitor:
- **Pots & Valves**: three vessels with visible floor lines; states: draw-arrow-from-pot, valve-refill, storm (draw switches to cash), sun (refill). Liquid levels are data-driven.
- **Ladder & Ratchet**: horizontal timeline of rungs (solid, filled as bought; dotted ghosts for potential years); balloon above (translucent, radius data-driven); ratchet arrow balloon→ghost-rungs; a glide-path line with the band drawn at `b×G` when band mode is on; states: trigger-fires (arrow animates, ghost fills), never-trigger (grey flags).
- **Floor & Flex**: a solid floor slab running to the horizon age with the state-pension course inlaid from 2037; a translucent flex balloon above whose radius is the sleeve; treats shown as a tap from balloon; states: boom (balloon grows, optional ratchet thickens/extends the slab), bust (balloon shrinks, slab unchanged — this unchanging slab is the single most important frame in the whole product).
- Design tokens file: the two fills (solid/translucent), three accents, gridline and path-line styles — shared with the chart components so charts and metaphors visibly belong together.

## 5. Copy deck

All fixed strings in one versioned file: names, promise lines, failure lines, storyboard captions, dial consequence templates, empty/error states. Tone rules: plain, warm, no exclamation marks, no finance jargon on layers 1–2, numerals for numbers, and the tool never says "best", "optimal", or "recommended" about a strategy — the strongest permitted phrasing is "closest to what you said you wanted" (Orient output). Surplus is always presented neutrally with both uses side by side — "a locked year or a holiday, your call" — never with nudging or guilt language in either direction; underspending and overspending are treated as equally legitimate risks.

## 6. Build notes

- Mini-sims and canned decades call the production engine (WASM/worker or server — follow the repo), never precomputed fakes; cache by config hash.
- Illustrations: static SVG + CSS transitions; no canvas for the metaphors; charts may use the existing charting stack skinned with the tokens.
- Lazy-load explainers; the Orient screen must be interactive < 1s on mid-range mobile.
- Analytics events (privacy-respecting, no PII): explainer completion per strategy, dial-change counts, compare toggles used, time-to-lock, unlock/clone rate, and the comprehension prompt result (§9).

## 7. What this document governs

Phase E in full, the visual layer of Phase D, and the Monitor mode's reuse of the metaphor components (Phase F+). Engine behaviour, parameters and tests remain governed by the engine brief.

## 8. Deliverables and review gates

1. Wireframes of the five journey screens (mobile + desktop) — **user review**.
2. The three metaphor SVG component sets with state demos — **user review**.
3. Copy deck v1 — **user review**.
4. Built Learn + Compare on the user's own live plan numbers — **user review before Lock ships**.

## 9. Acceptance test for the whole experience

Five hallway testers (or honest friends), fresh to the tool, each: completes Orient, reads one explainer, uses Compare, configures and locks a plan. Pass criteria: (a) they can state, unprompted, what their chosen strategy does in a crash; (b) they can repeat its failure line in their own words; (c) they can say what one dial they touched actually changed; (c2) shown the safe-to-spend number, they can say what it means and name its two uses; (d) none of them asks "so which one is best?" and if they do, the product's answer — trade-offs, not a crown — satisfied them. Fewer than 4 of 5 passing means the explainers get reworked before launch, not the users blamed.
