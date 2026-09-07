/**
 * The versions before release notes existed, reconstructed from the commit history (367 commits,
 * January–September 2026) and the research notes. Grouped by theme, dated by the last commit in
 * each group, numbered in the 6.0.x line so the What's new page reads as one backwards roadmap.
 * These entries are marked `reconstructed: true`, never pop up (`announce: false`), and use a
 * lighter schema: summary + changes, corrections only where the commits say fix / wrong.
 */
export const RELEASE_HISTORY = [
  {
    version: '6.0.10', date: '2026-08-29', reconstructed: true, announce: false,
    title: 'Gilt ladder execution, rotation, State Pension timing',
    summary: 'The Decision tool learned to run a gilt ladder month by month; a ninth strategy adds a rotation rule; several State Pension timing errors were corrected.',
    changes: [
      'Decision tool executes the gilt ladder: a position service, a ladder card and a rotation watch; contract-ladder plans hide the Pots & Valves machinery.',
      'Ninth strategy — Gilt ladder + rotation: a −30% equity trigger, evidence and risks on its page; nightly equity feed; sell ticket; guided switch; borrowed-floor track.',
      'Ranked table credits what a strategy SPENT over the plan (median), not only what is left.',
      'Order sheet reads as a phone order: units to order (nominal, with the £100-lot figure) and approximate spend.',
      'Buckets in order redefined: cash → bonds → equities, refilled by waterfall from surplus only.'
    ],
    corrections: [
      'State Pension plan year now comes from the age reached on the SP date (birthday count), counted in whole months — 67, not 66.',
      'Age today no longer goes stale: engines take the Budget\'s age, date-stamped and aged forward.',
      'Gilt ladder: the State Pension\'s first-year share is measured against the tax year (6 April), not the calendar year.',
      'Strategy result card crashed after the engine worker (drawForYear is not a function).'
    ]
  },
  {
    version: '6.0.9', date: '2026-08-27', reconstructed: true, announce: false,
    title: 'Strategies tab, one plan lock, guest mode, mobile, security',
    summary: 'A top-level Strategies tab with a page per strategy and a comparison; the plan lock simplified to one rule; a try-before-you-sign-up guest mode; a full mobile pass; a strict content-security policy.',
    changes: [
      'Strategies tab: left nav, a page per strategy (machine diagrams, dials, the honest numbers), a comparison page with a question router and a level-footing default.',
      'Sixth strategy — Full index-linked gilt ladder (fully deterministic); seventh and eighth — Bridge & engine and Buckets in order. Layered income charts (State Pension / other / by contract / market median) on every card.',
      'ISA policy "Hold": never draw the ISA for income, in both engines. A held ISA is excluded from the pot the ladders price on.',
      'One plan lock: locks itself on the first monthly entry or tax year (never on Save); unlock always offered with the consequences computed and shown first.',
      'Stress Tester "Try a strategy" what-if panel; Assumptions & data page; Decision tool cadence (monthly / quarterly / annual batch sale).',
      'Guest mode ("Just try it — nothing saved") and a deep-linkable £1M demo (?demo=1m); the Beta chip.',
      'Engine runs in a Web Worker (no page freeze); mobile pass (bottom tab bar, stacked cards, no sideways scroll).',
      'Strict CSP: every inline handler moved to data-on-* attributes; security pass on escaping, CSV formula injection, budget calculator parser.'
    ],
    corrections: [
      'Random-number seed 0 replayed the 1928 block for 35 years (a £1bn outlier in Monte Carlo run #0).',
      'Calendar-mode ladder now records the sleeve every year (fixed a sawtooth wealth cone).',
      'Strategy income series include DB/other income (cones and worst-12 months no longer understated).',
      'Decision-side State Pension indexed by tax year (the plan of record was a year early); "tax saved" compared on the same partial-year basis as tax paid.',
      'Stale strategy dial values leaked between plans; strategy parameters were lost on Save.'
    ]
  },
  {
    version: '6.0.8', date: '2026-08-25', reconstructed: true, announce: false,
    title: 'Nine ways to draw an income, and honest market data',
    summary: 'A strategy framework with a registry and golden tests; four bought strategies; stepped income; the market data rebuilt from source; live gilt prices and the Bank of England real-yield curve.',
    changes: [
      'Strategy interface and registry; Ladder & Ratchet, Floor & Flex, Floor the schedule, Floor to an age then decide — each with golden test sets.',
      'Income shape: a stepped-by-age editor ("£60k until 72, £50k until 80, £40k after") compiled to one per-year schedule that every tool reads.',
      'One stress test for every strategy, with cones of uncertainty, and an ISA rescue when the SIPP falls short.',
      'Ladders priced on the Bank of England real spot curve (daily open data) and nightly DMO + Tradeweb closing prices.',
      'World equity, not US, applied as data everywhere (a 1.5pp/yr haircut from the Yearbook gap).'
    ],
    corrections: [
      'Market data regenerated from the Shiller series 1928–2024 — the previous nominal equity series (~5.7%) was wrong.',
      'Stepped income never reached the engines (a save-order bug nulled the schedule).',
      'Worst-12-months was measured with ISA top-ups counted net; now gross-equivalent.',
      'Pots & Valves in the comparison ran on real paths with frozen bands, which flattered bonds and cash; it now runs nominally on paired real-return / CPI paths.'
    ]
  },
  {
    version: '6.0.7', date: '2026-08-21', reconstructed: true, announce: false,
    title: 'Band-fill recycling, DB floors, Accumulation, Household',
    summary: 'Two new tools and a set of income mechanics.',
    changes: [
      'Band-fill-and-recycle (draw to the basic-rate limit, put the net in the ISA); a defined-benefit pension floor; per-year budget schedule; longevity horizons.',
      'Accumulation Planner tab (Tier 3).',
      'Household tab: the couples view — joint success on shared market paths; survivor stress.',
      'Lumpy income: income streams with start/end years and one-off lump sums; example ETF portfolios per risk level.',
      'Guidance on spending profile vs a budget schedule that already winds down (avoid counting the slowdown twice).'
    ],
    corrections: []
  },
  {
    version: '6.0.6', date: '2026-08-17', reconstructed: true, announce: false,
    title: 'Net-first everywhere, access method, accuracy fixes',
    summary: 'The whole app works from take-home need; drawdown vs UFPLS; an admin panel; a run of accuracy fixes found by audit.',
    changes: [
      'Stress and Decision tools take a net (take-home) spending need instead of a gross salary; the landing page shows all three tools, Budget first.',
      'Access method: flexi-access drawdown or UFPLS, with phased access (UFPLS for N years, optional PCLS to the ISA, then drawdown).',
      'Plans and the lock made visible: header chip, explainer, onboarding flow; copy settings between tools in both directions.',
      'Fund catalogue of ~156 UK funds; sub-asset classes for REITs, emerging markets, small-cap, high-yield, commodities; the ISA modelled at its tagged mix.',
      'Admin panel (probe-gated) for the fund catalogue, category model and suggestions.'
    ],
    corrections: [
      'Tier 0 accuracy fixes: CPI semantics, recovery buffer, protection parity between the tools, dead code removed.',
      'Mid-year first-year drawdown and the saved record\'s tax figure unified; tax-year salary chain fixed.',
      'ISA double counting in tagged portfolios; the multi-tab auto-logout left a zombie UI.'
    ]
  },
  {
    version: '6.0.5', date: '2026-08-03', reconstructed: true, announce: false,
    title: 'Data protection',
    summary: 'The compliance work that makes it responsible to hold personal financial data.',
    changes: [
      'Firestore security rules source-controlled and deployed: every path locked to the signed-in, email-verified user.',
      'Email verification gate; Delete Account wipes Firestore and the login.',
      'The database moved from the US to Google\'s London region.',
      'Privacy policy published; ICO registration ZC209401.',
      'Budget: guided walk-through wizard; per-line partner share.'
    ],
    corrections: []
  },
  {
    version: '6.0.4', date: '2026-07-19', reconstructed: true, announce: false,
    title: 'Budget Planner and a net-first setup',
    summary: 'A budget tool that becomes the plan\'s target, and a setup wizard that starts from what you spend.',
    changes: [
      'Budget tab: a pure budget model (phases, one-offs, PLSA comparison, net → gross), curated categories with hints, £/month–£/year toggle, ONS typical amounts, optional partner cost-sharing.',
      'Setup wizard: net-first minimal creation, already-retired and any couple combination.'
    ],
    corrections: []
  },
  {
    version: '6.0.3', date: '2026-07-16', reconstructed: true, announce: false,
    title: 'Asset sub-classes, fund tagging, the plan lock',
    summary: 'Real funds tagged to asset classes, a fourth "diversifiers" bucket, and settings that lock once decisions are recorded against them.',
    changes: [
      'Asset sub-classes: gold and trend as an opt-in Diversifiers pot; regime-aware per-sleeve correlation; yield-driven bond families.',
      'Fund tagging with a catalogue and autocomplete; risk-level vs my-funds allocation mode; per-fund monthly entry.',
      'Plan lock: settings lock on the first saved decision, with a checksum stamped on each record.',
      'Settings redesigned as bordered sections; one shared spending "smile" for both engines.'
    ],
    corrections: [
      'Funds-mode plans reverted to a risk preset on reload (the £1,105,000 bug); fund inputs were invisible on a white background.'
    ]
  },
  {
    version: '6.0.2', date: '2026-07-11', reconstructed: true, announce: false,
    title: 'The ISA as a real pot, and the bond tent',
    summary: 'The ISA became a depleting pot with a drawdown policy shared by both tools; a rising-equity glide became the main allocation model.',
    changes: [
      'ISA drawdown (Option A band management) in a shared DrawdownStrategy used by the Stress Tester and the Decision tool; ISA fields with "Copy from Decision".',
      'Bond tent (rising equity, then plateau) as the main allocation model; Glidepath and Drawdown tabs show it and the ISA bridge.',
      'Declining-spending option; regime-based equity–bond correlation.'
    ],
    corrections: [
      'Drawdown/Glidepath ISA top-up used a crude copy; now the real engine.',
      'The optimiser dropped the State Pension (a date-parser gap); the stress engine silently dropped a legacy State Pension.'
    ]
  },
  {
    version: '6.0.1', date: '2026-07-10', reconstructed: true, announce: false,
    title: 'One engine for both tools',
    summary: 'The Stress Tester and the Decision tool were made to compute income, tax and withdrawals through the same code, proven by golden tests and a replay harness.',
    changes: [
      'Golden-master harness; shared tax bands (HMRC), the 6-April tax year, one inflation model, shared protection and tax-boost rules; a cross-validation harness that replays a Monte Carlo path through the Decision engine.',
      'Realistic cash model (FCA −1% real); regime-preserving block-bootstrap Monte Carlo; failure-severity analytics (coverage, timing, reason); redesigned stress report and charts.'
    ],
    corrections: [
      'A NaN blow-up in the stress engine (Box–Muller log(0)).',
      'The Decision engine\'s crude tax replaced by proper bands.'
    ]
  },
  {
    version: '6.0.0', date: '2026-01-30', reconstructed: true, announce: false,
    title: 'Version 6 baseline',
    summary: 'The rebuilt app: named plans (scenarios) with a setup wizard, the Decision tool with history and tax years, the Stress Tester, Firebase login and cloud storage.',
    changes: [
      'Scenarios architecture with a wizard and per-tool visibility; landing page and onboarding.',
      'Decision tool: protection mode, tax boost, history integrity controls, toasts.'
    ],
    corrections: [
      'Protection reduced net income, not gross; ISA double-counting when recalculating a month; state pension used consistently in all simulations.'
    ]
  }
];
