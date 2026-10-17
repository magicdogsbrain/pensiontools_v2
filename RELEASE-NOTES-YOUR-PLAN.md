# Release notes to carry into `src/releases.js` — "Your plans" and "Your plan" in the preview (17 Oct 2026)

Not yet bumped: `package.json` and `src/releases.js` are untouched on this branch (the brief). The bullets below are the
entry for the release that ships this. Design: research/v7/your-plan.md (approved 17 Oct 2026, every owner question
answered as recommended).

## Changes

- **The preview shows your saved plans, read-only.** "Your plans" sits in the header of every preview page
  (`/v7/#/plans`). Signed in to the planner on this device, you see the account's plans, grouped: "Your household"
  (plans linked to each other, either way) and "Other plans"; each by its own name with one stage line, for example
  "Retired. Your ladder pays from April 2027." Nobody signed in: the plans this window kept without an account, read-only.
- **Each plan opens on a short step list for its life stage** (`/v7/#/plan/<id>`): This month, Where you are, Your plan,
  This month's pot, What you pay in, What you spend, Lock the plan, What you hold, Moving to your plan's mix, Your
  household — the ones the stage needs, the optional ones marked. Every figure is the plan's own record, exact, with where
  it came from and its date ("From your record, September 2026"; "From your plan as locked, 1 July 2026"); a figure
  over three months old is flagged. Nothing on these pages can be typed into. One "Next: …" sentence at the bottom.
  A retired person is never shown a countdown.
- **A locked plan is read from its plan document.** Its settings say "Fixed when you locked the plan on {date}", with
  the prices they were worked out at; unlocking is mentioned once, on "Your plan as locked". The budget stays a guide.
- **"Everything else this plan uses"** lists every setting the plan has moved away from the planner's starting values,
  in plain words, with "Show every setting" for the rest — so nothing a plan carries is invisible in the preview (the
  parity rule; a test fails when a saved setting is shown nowhere).
- **"Change this" opens the planner on the right plan, page and section, with the boxes filled.** The planner presses
  the page's own button, so its loader runs; a line at the top says "Opened from the preview" with the way back. Your
  partner's plan opens in that window only: your other windows and devices stay on the account's open plan, and nothing is
  written to either plan.

## Corrections

- The planner's "which plan is open" now reads the window's own choice first (`sessionStorage['pt_open_plan']`), then
  the account's open plan, as before. The plan menu, What's new and Download read it the same way.

## Effects on saved plans

- None. Browsing the preview writes nothing: the plans are brought up to date in memory only, and a test walks every
  import the preview can reach and fails on any write.

## Actions

- None needed. To see your plans in the preview, open `/v7/#/plans` while signed in to the planner on this device.

## Notes

- Privacy: no new processor, no new data category; the preview reads the same plans under the same rules. Two new
  browser keys, this window only, holding no figures: the hand-over note (`pt_open_place`, gone once used) and the
  window's open plan (`pt_open_plan`). One sentence added to the privacy policy ("Storage in your browser").
- Not in this release: signing in from inside the preview (the "Sign in" button opens the planner's own sign-in screen
  and comes back); testing a plan and "One decision" (links to the planner until questions E and F); the emulator-backed
  signed-in browser tests (the design's T11–T13).
