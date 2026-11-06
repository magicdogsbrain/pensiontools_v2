# Mock-ups for the first visit and the record keeper's home (6 Nov 2026)

`first-visit.html` is a self-contained page (open it in a browser) with four mock screens drawn with invented figures
(Alex, Sam). It was agreed with the owner before anything was built, to be coded from later. It is NOT part of the
site: nothing imports it and no build includes it.

## What it fixes

The agreed design (`../one-product-design.md`) assumed today's front door. The owner added, before 7.3.0:

- **A stranger's front door**: one headline, one picture (the pot over a life), three doors — *Still saving* (question
  B), *Stopping soon* (C), *Already retired* (D) — and the other questions as plain links. A personal answer in under a
  minute. **No account and no limit for the questions**: the three-hour guest meter and its nags go from the question
  pages. The account (Firebase auth as now: email/password and Google) is asked only to **keep** a plan.
- **"What attracts the most users"**: a real, personal answer before anything is asked for; pictures over words, but one
  picture that becomes *theirs* once they type three numbers; the account at the moment they want to keep something.
- **Three pictures, all drawn from the person's own figures, to scale, with the bad case shaded**:
  1. *The life line* — Saving → Moving → Drawing with "you are here". The front door's explainer and, reduced to three
     segments, the home's stage strip. One component, two uses.
  2. *The pot over a life* — rising while saving, the move, falling while drawing. The saver's answer (screen 2) and
     the retiree's answer (screen 3) are the two halves of the same picture.
  3. *The record keeper's year* — twelve month cells: a bar for what was drawn, a dashed line for what the plan said,
     dashed cells for months filled in later, a ring on the month due, a teal cell for the year set up.
- **The home** (screen 4) as the design says: the stage strip, at most three to-dos (the first pink; "soon" items amber
  and not counted), the year view and "where you are", tools, then everything else collapsed.

## The colour rules (validated for colour vision on the dark surface with the dataviz palette checker)

| Hue | Hex (dark) | Meaning — and nothing else |
|---|---|---|
| amber | `#cf7f14` | Saving |
| teal | `#17a587` | Moving |
| purple | `#8a63ee` | Drawing |
| pink | `#f2408a` | the one thing to press on this screen; "you, today" |
| green / amber / red | `#0ca30c` / `#fab219` / `#d03b3b` | a verdict's edge only (yes / close / no) |

Light-mode values are in the page's `:root` block. Type: Fraunces (display), Nunito (body), JetBrains Mono (figures).
The site's own tokens (`src/v7/styles/tokens.css`) keep the dark base; these are the additions a build would make.

## When it is built

- The front door and the two answers are the questions B, C and D as they are; what changes is the page around them
  (the doors, the picture, the slider as the main control, the three figure tiles, the "Keep" line) and the removal of
  the guest meter from the question pages. Keeping still goes through the one create path.
- The home is 7.3.0 of the agreed route (reads only). The year view reads `decisionTool.history` and the plan of
  record as "Where you are" does; the stage strip reads `stageOf`.
- Words must pass `src/v7/copy/banned.js`. "Tool" and "planner" are banned on the front door: the mock-up's "Tools"
  heading on the home is fine (not the front door), but check the front door's words.
- Every figure in the mock-ups is invented. Never replace them with a real plan's.
