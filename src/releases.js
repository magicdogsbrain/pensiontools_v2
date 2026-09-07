/**
 * Release notes — the one record of what each version changed, what it corrected, how it
 * affects the plans users have already saved in each tool, and what they may need to do.
 *
 * This file is DATA the app renders (the once-only "What's new" pop-up and the What's new page)
 * and a CONTRACT the test suite enforces (tests/releases.test.js): the top entry's version must
 * equal package.json's version, so a version bump without notes — or notes without a bump —
 * fails the build. See RELEASING.md for the checklist.
 *
 * Entry shape (newest first):
 *   version        'x.y.z' — the app version (package.json). Patch releases (z > 0) are listed
 *                  on the page but do not pop up unless `announce: true`.
 *   date           ISO date the release went live.
 *   engineVersion  src/strategies/version.js ENGINE_VERSION shipped with it (pinned on plan lock).
 *   title, summary one line + one paragraph, plain English, no jargon.
 *   changes[]      what is new.
 *   corrections[]  what was wrong before and is now right — say so plainly.
 *   effects{}      per tool (TOOL_IDS): how a plan saved under the previous version now reads.
 *                  An empty array = "no effect"; say so rather than omitting the tool.
 *   actions[]      what a user may need to do (enter something new, re-run something, review a setting).
 *   notes[]        anything else: rules used, data notes, known limits still open.
 *   announce       optional override of the minor/major rule.
 *   affects(scenario, ctx) optional: plan-specific bullets for one saved scenario. MUST tolerate
 *                  any shape ({} included) — old plans predate most fields.
 */
import { ENGINE_VERSION } from './strategies/version.js';

export const TOOL_IDS = ['budget', 'stress', 'strategies', 'decision', 'accumulation', 'household'];
export const TOOL_LABELS = {
  budget: 'Budget Planner', stress: 'Stress Tester', strategies: 'Strategies (compare & switch)',
  decision: 'Decision tool (monthly)', accumulation: 'Accumulation planner', household: 'Household (couples)'
};

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

export const RELEASES = [
  {
    version: '6.2.5', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Income streams, lump sums and one-off spends on the income shape',
    summary: 'The income-shape picture now draws your income streams (rent, part-time work) as layers for their years, and marks each lump sum and one-off spend at the age it happens. Editing them refreshes the picture at once.',
    changes: [
      'Income streams appear as grey layers inside the bars for the years they run, like the DB pension.',
      'Lump sums (▲) and one-off spends (▼) are marked at their age with the amount and label. A lump sum is not income — it lands in your pots or taxable account and the strategies spend it over the years — so it is a marker, not a layer.',
      'Changing anything under Income streams & lump sums redraws the picture immediately.'
    ],
    corrections: ['Streams were counted in the schedule\'s guaranteed-income floor but not drawn, so the picture and the arithmetic disagreed.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.4', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'The income shape shows its slopes — and never dips below your State Pension',
    summary: 'The income-shape picture now draws the slope of every step and animates to the new shape when you move a slider; the schedule can never fall below the guaranteed income of the year (State Pension, DB pension, other income); and an audit confirmed every engine, strategy and projection reads the same sloped schedule.',
    changes: [
      'Your income shape: bars follow each step\'s slope, a line traces the path over them, and both ease into place when you change a slider or tick "glide".',
      'A step is your TOTAL income for the year — State Pension, other pensions and the pot together — and the editor now says so. If a slope would take the shape below the guaranteed income that year, it is held there and a note tells you from which age.'
    ],
    corrections: [
      'The picture used its own flat-step arithmetic, so it ignored the slopes the engines were running (6.2.1 to 6.2.3).',
      '"Use as my plan\'s target" from the Budget page rebuilt the schedule with the same flat arithmetic, dropping the slopes on a plan re-seeded from the Budget. It now uses the engines\' compiler.'
    ],
    effects: {
      stress: ['Plans re-seeded from the Budget in 6.2.1–6.2.3 with sloped steps: the schedule was flat then and is sloped now — the Stress Tester and every strategy follow it. Plans whose slope dipped below the State Pension are held at that floor.'],
      strategies: ['Same as the Stress Tester.'],
      decision: ['The tax-year wizard suggests from the (now correct) schedule copy; recorded months are untouched.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['Open Stress Settings → Your income shape once and look at the picture: it is now what the engines run.'],
    notes: ['Audit of every schedule consumer: both engines, the nine strategies, the drawdown and glidepath projections, the tax-year wizard, the couples check, the layered charts and the Decision copy all read the compiled schedule.'],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const sloped = Array.isArray(ss.incomeSteps) && ss.incomeSteps.some((x) => x && ((+x.decline > 0) || x.glideToNext));
      return sloped ? ['This plan\'s steps carry slopes: check the picture in Stress Settings and re-save if the schedule looks flat (it was, if you re-seeded from the Budget).'] : [];
    }
  },
  {
    version: '6.2.3', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Hotfix: lump-sum amount box',
    summary: 'The one-off lump sum amount box under Income streams and lump sums lost focus after every digit (since 6.1.0 the row re-drew itself to update its "where it goes" note). The note now updates in place.',
    changes: [],
    corrections: ['Typing a lump-sum amount no longer stops after one digit.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.2', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Hotfix: missing sub-tabs',
    summary: 'In 6.2.1 the Stress Tester, Budget and Strategies tabs lost their content and sub-tab ribbons; only the Decision tool showed its ribbon. A stray closing tag from removing the old spending control. Fixed within the hour.',
    changes: [],
    corrections: ['Removing the Decision tool\'s "Spending over retirement" control took one closing tag too many, nesting every later tab inside the Decision settings grid. A structure test now guards the tab panels.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['Reload once if a tab still looks empty.'],
    notes: []
  },
  {
    version: '6.2.1', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'Income steps with a slope; fairer cuts for Buckets in order',
    summary: 'The "Spending over retirement" control is gone: each income step now carries its own slope, so you say how fast each phase drifts down (or glides into the next). And Buckets in order now decides on spending cuts by looking at the whole pot against the whole plan track, not at a signal it triggered by design.',
    changes: [
      'Your income shape: every step has a slider — how much it falls each year in today\'s money (0 to 5%) — and a "glide evenly to the next step" tick box that walks the income down smoothly instead of a cliff. The preview and every strategy follow it.',
      'The separate "Spending over retirement" (level / declining) control has been removed from Stress and Decision settings. Plans that had "Declining with age" were converted to steps that reproduce the same curve exactly.',
      'Buckets in order + spending cuts: cuts now start when the whole SIPP has sat below the whole glidepath track for the configured number of months, and end when it is back above the track plus the recovery buffer — the same test the Decision tool applies for a Buckets plan.'
    ],
    corrections: [
      'Buckets in order draws from cash first by design, so the old "three cash draws in a row" test was always true and cuts fired on any dip below the growth floors. A test plan showed cuts in 83 of 100 futures and 394 of 396 months in the Lost Decade scenario — most of that was the rule, not the market.'
    ],
    effects: {
      stress: [
        'Plans on Buckets in order with spending cuts on: fewer cut months, so the Monte Carlo, Historical and Scenarios results improve; the "as configured" ranked comparison moves too (level footing is unchanged).',
        'Plans that used "Declining with age": your steps now show the drift explicitly (a step at year 5 falling 1% a year, level again from year 25). Numbers are identical; you can now change the slope.'
      ],
      strategies: ['Ranked figures move only for Buckets plans with cuts on. Nothing else changed.'],
      decision: [
        'Buckets plans: the monthly protection decision uses the same whole-pot test (a "below track" flag is now saved on each record; the streak starts counting from your next entry).',
        'A Decision copy of a "Declining" plan keeps its schedule (the curve is baked into it) and the tax-year wizard suggests the same figures as before.'
      ],
      household: [], budget: [], accumulation: []
    },
    actions: [
      'If you had "Declining with age", open Stress Settings → Your income shape and check the slopes are what you meant; adjust the sliders or tick "glide" where a cliff was never intended.',
      'Buckets in order plans with cuts on: re-run the Stress Tester to see the corrected results.'
    ],
    notes: ['Engine version 6.2.0: a strategy\'s arithmetic changed (Buckets in order protection).'],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      if (ss.spendingMigratedFrom === 'declining' || ss.spendingProfile === 'declining') out.push('This plan used "Declining with age": its steps now carry that slope explicitly (same numbers).');
      if (ss.strategyId === 'buckets-in-order' && ss.disableProtection === false) out.push('This plan is Buckets in order with spending cuts on: its cut months will fall — re-run the Stress Tester.');
      return out;
    }
  },
  {
    version: '6.2.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Trustworthy comparisons',
    summary: 'A day of testing every Stress Tester tab and three years of the Decision tool found eight bugs and four traps. None crashed anything; several put the wrong number in front of you, and one quietly rewrote saved allocations. All fixed. The Decision tool itself was clean.',
    changes: [
      'Stress Settings keeps a saved allocation that is not a preset as "Custom — your saved split" (with the exact amounts) instead of snapping it to the nearest risk level. Pick a risk card only if you want to change it.',
      'Stress Settings shows the "age today" it uses (from the Budget page) under the State Pension inputs, and says when it is not set.',
      'Try a strategy, the survivor check and the care check run in the background worker, so the page no longer freezes for a minute.',
      'The Drawdown and Glidepath tabs start from the plan\'s own horizon.',
      'Saving now times out after 20 seconds, retries once, and tells you if it failed — instead of "Saving…" for ever.'
    ],
    corrections: [
      'Visiting the Drawdown or Glidepath tab changed the plan\'s horizon for everything that ran afterwards — the ranked comparison, Try a strategy, the couples check. A 30-year plan was compared over 35 years.',
      'For a plan saved on Buckets in order, the Pots & Valves row of the ranked table WAS Buckets in order (identical to the pound).',
      '"Worst 12 months" for the bought strategies (Floor the schedule, Ladder & Ratchet, Floor to an age) counted only the rungs bought — a year a lump sum or a DB pension paid showed as £0 or £28,000 on a plan whose income never dipped. It is now the income you actually receive.',
      'The risk summary read "chance of a cut after undefined" for Gilt ladder + rotation.',
      'The Historical tab on a contract strategy left a spinner running above the finished result.',
      'Switching plan left the previous plan\'s strategy card on the Monte Carlo tab.',
      'With no State Pension entered, the comparison used a £12,000 default from year 0 and said "State Pension only (from age N)" as if you had entered it. It now says it is an assumption, in the table and on every card.',
      'Zero amounts rendered as "£0.00"; the Decision tool\'s calculation reason read "Protection | Protection".'
    ],
    effects: {
      stress: [
        'The ranked comparison changes for plans with a lump sum, a DB pension, or an inherited pension (worst-12 figures rise to the real income), for plans saved on Buckets in order (the Pots & Valves row now differs), and for anyone who opened Glidepath or Drawdown before comparing (the horizon is now the plan\'s).',
        'Saved fund minimums that were not a preset are shown and kept exactly. If you saved Stress Settings since mid-August and had a custom split, check the Custom amounts — the earlier build snapped them.'
      ],
      strategies: ['Same as the Stress Tester: ranked figures move for the plans above. Nothing else about a strategy changed.'],
      decision: ['No numbers change. The calculation reason text is tidier.'],
      household: ['Survivor and care checks give the same answers, faster and without freezing the page.'],
      budget: [],
      accumulation: []
    },
    actions: [
      'Open Stress Settings once: if your allocation now reads "Custom — your saved split", the amounts shown are what was saved — keep them or pick a risk level.',
      'Re-run the Strategies overview if your plan has a lump sum, a DB pension, uses Buckets in order, or you had opened Glidepath before comparing.',
      'If your State Pension line says "assumed — none entered", enter your forecast date and weekly amount in Settings.'
    ],
    notes: [
      'Full findings, with the code locations and tests: research/qa-audit-7-sep-2026.md.',
      'Still open from that audit: Buckets in order with spending cuts on treats every month as a cash-draw month, so cuts hinge on growth alone (a modelling decision to make, not a defect); the CSV export was not exercised.',
      'Engine version unchanged (6.1.0): no strategy\'s arithmetic changed, only what is measured and shown.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const pot = (+ss.equityMin || 0) + (+ss.bondMin || 0) + (+ss.cashTarget || 0) + (+ss.diversifierStart || 0);
      const presets = [[0.3, 0.45, 0.25], [0.5, 0.4, 0.1], [0.7, 0.25, 0.05]];
      if (pot > 0 && ss.allocMode !== 'funds') {
        const f = [(+ss.equityMin || 0) / pot, (+ss.bondMin || 0) / pot, (+ss.cashTarget || 0) / pot];
        const isPreset = presets.some((pr) => pr.every((v, i) => Math.abs(v - f[i]) <= 0.011));
        if (!isPreset) out.push('This plan\'s allocation (' + Math.round(f[0] * 100) + '/' + Math.round(f[1] * 100) + '/' + Math.round(f[2] * 100) + ') is not a preset: it now shows as Custom and is kept exactly.');
      }
      if (ss.strategyId === 'buckets-in-order') out.push('This plan uses Buckets in order: the Pots & Valves row in its ranked table was a copy of Buckets — re-run the overview to see the real comparison.');
      const lumps = (Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0).length : 0) + (+ss.dbAmount > 0 ? 1 : 0);
      if (lumps) out.push('This plan has a lump sum or DB pension: the bought strategies\' "worst 12 months" figure now counts that income.');
      if (pot > 0 && !ss.spStartDate && !(+ss.spWeeklyAmount > 0)) out.push('No State Pension is entered on this plan: the comparison now says the £12,000-from-67 figure is an assumption.');
      return out;
    }
  },
  {
    version: '6.1.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Taxable accounts and lump sums',
    summary: 'Money held outside a pension or ISA is now modelled properly: an investment account you already hold, and lump sums that arrive during retirement (an inheritance, a house sale, a maturing policy) — including the tax each actually suffers and the limits on where the money can legally go. It reaches both engines and every strategy.',
    changes: [
      'Stress Tester settings: a "Taxable investments today" section — the balance, what it holds (shares, gilts, bond funds, mixed or cash), your tax band, relevant earnings, and whether to move £20,000 a year into the ISA (bed-and-ISA).',
      'Income streams and lump sums: each lump sum now says what it is (cash, an inherited pension, an inherited ISA) and, for cash, what its taxable part will be held in. Cash is routed through this year\'s ISA allowance and pension room; the rest stays taxable.',
      'The taxable account is drawn before the ISA (least tax-efficient money first), net of capital gains tax. Gilts held there are CGT-free, so a gilt account is close to tax-free while a share account is not.',
      'Decision tool: the monthly entry takes the taxable account\'s balance and cost; the tool sells from it before the ISA, works out the CGT with the £3,000 exemption tracked per tax year, and carries the cost forward to next month. Lump sums and bed-and-ISA are advice alerts — it never moves money silently.',
      'Every strategy sees the taxable account: the ladder and floor strategies now count it (and lump sums) as money that buys rungs, not only the Pots & Valves engine.',
      'The "?" help pop-ups on the settings forms work on hover and on touch.',
      'The Assumptions & data page lists the taxable-account rules.'
    ],
    corrections: [
      'The pension contribution cap for anyone already drawing a pension is £10,000 (the MPAA), not £60,000 — a lump sum can shelter far less into a SIPP than the previous build allowed.',
      'The ISA allowance was being used up to three times in one year (a lump sum\'s slice, bed-and-ISA and band-fill recycling each assumed a fresh £20,000). One allowance per tax year now.',
      'Lump sums were treated as fixed pounds while the form said "today\'s money". They now rise with inflation to the year they arrive (choose "level" for a fixed sum).',
      'Survivor check: an inherited pension stays a pension and an inherited ISA passes into the survivor\'s ISA. A 6 September build briefly pushed both into a taxable account.',
      'The taxable account\'s tax was calculated and then dropped from the totals; it is now in lifetime tax.',
      'The ladder and floor strategies ignored lump sums entirely (one-off spends were modelled, one-off receipts were not) — a bias against every ladder in the ranked table.',
      'With the ISA policy set to Hold, the plan was still moving money INTO the ISA (bed-and-ISA and a lump sum\'s ISA slice), locking spendable money in a pot it had promised not to draw. It no longer does.'
    ],
    effects: {
      stress: [
        'Plans with no taxable account and no lump sums are unchanged to the penny.',
        'Plans with a lump sum will show different numbers: the ISA slice once a year, the sum rising with inflation, and the taxable remainder taxed. Expect slightly lower wealth and a more realistic result.',
        'Plans whose ISA policy is Hold: bed-and-ISA is now ignored (the checkbox greys out) and a cash lump sum\'s ISA slice stays taxable. An inherited ISA still joins the held ISA.'
      ],
      strategies: [
        'The ranked comparison now credits ladders and floors with lump sums and an existing taxable account, so the order of strategies can change for plans that have either.'
      ],
      decision: [
        'Plans with no taxable account are unchanged. The two new monthly-entry boxes default to £0.',
        'Locked plans: nothing recorded is re-judged. The new boxes simply appear on your next entry.',
        'The tax-year wizard has a new optional box for capital gains already realised this year.'
      ],
      household: [
        'The survivor check routes an inherited pension and ISA into the right wrappers again; results for couples with a partner\'s pension or ISA may move.'
      ],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you hold investments outside a pension or ISA, enter them in Stress Settings → Your pot → Taxable investments today, and say what the account holds.',
      'Decision tool users: enter the taxable account\'s balance and what it cost on your next monthly entry (the cost is pre-filled from then on).',
      'If you expect an inheritance or a house sale, add it under Income streams and lump sums with what it is and how the taxable part will be held.',
      'If your ISA policy is Hold, read the note under bed-and-ISA; if band-fill recycling is also on, decide whether you really want recycled money going into an ISA you will not draw.',
      'Re-run the Stress Tester and the Strategies overview to see the updated numbers for plans with a lump sum or a taxable account.'
    ],
    notes: [
      'Rules used: ISA £20,000 a year; MPAA £10,000; pension relief floor £3,600 gross; dividend allowance £500 (8.75% / 33.75%); savings allowance £1,000 / £500; CGT exemption £3,000 (18% / 24%); UK gilts exempt from CGT; inherited pension = beneficiary drawdown; inherited ISA = additional permitted subscription.',
      'Still open: gilts in the taxable account grow at the engine\'s bond return rather than the real-yield curve the ladders price on; losses are not carried forward; the history CSV export does not yet include the taxable-account columns.',
      'Engine version 6.1.0.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const ds = scenario?.decisionTool?.settings || {};
      const windfalls = Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0) : [];
      const hold = ss.isaDrawdownStrategy === 'hold';
      if (+ss.taxableStart > 0) out.push('This plan holds ' + gbp(ss.taxableStart) + ' in a taxable account: it is now drawn before the ISA and taxed on its dividends and gains (' + (ss.taxableMix === 'gilt' ? 'gilts, so CGT-free' : 'held as ' + (ss.taxableMix || 'shares')) + ').');
      if (windfalls.length) out.push('This plan expects ' + windfalls.length + ' lump sum' + (windfalls.length > 1 ? 's' : '') + ' (' + windfalls.map((w) => gbp(w.amount) + ' in year ' + (w.year ?? '?')).join(', ') + '): each is now routed through the ISA allowance and pension room, with the rest taxable.');
      if (hold && ss.bedAndIsa !== false && (+ss.taxableStart > 0 || windfalls.length)) out.push('The ISA is on Hold, so bed-and-ISA no longer happens for this plan and a cash lump sum\'s ISA slice stays in the taxable account.');
      if (hold && ss.bandFillRecycle) out.push('Band-fill recycling is on while the ISA is on Hold: recycled money lands in an ISA this plan never draws — review one of the two.');
      if (ds.locked) out.push('The Decision plan is locked' + (scenario?.strategy?.engineVersion ? ' (engine ' + scenario.strategy.engineVersion + ' at lock)' : '') + ': recorded months are not re-judged; the taxable-account boxes appear on your next entry.');
      return out;
    }
  }
];

// ---------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------

/** 'x.y.z' → [x, y, z], or null when it is not a plain semver. */
export function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
  return m ? [+m[1], +m[2], +m[3]] : null;
}

/** Standard three-part compare: negative when a < b, 0 when equal, positive when a > b. */
export function compareVersions(a, b) {
  const pa = parseVersion(a) || [0, 0, 0], pb = parseVersion(b) || [0, 0, 0];
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  return 0;
}

/** Announced = pops up once. Default: minor and major releases (patch 0); `announce` overrides. */
export function isAnnounced(rel) {
  if (!rel) return false;
  if (typeof rel.announce === 'boolean') return rel.announce;
  const p = parseVersion(rel.version);
  return !!p && p[2] === 0;
}

/** Announced releases newer than the version the user last saw (null/'' = never seen any). */
export function releasesSince(lastSeen, releases = RELEASES) {
  return releases.filter((r) => isAnnounced(r) && (!lastSeen || compareVersions(r.version, lastSeen) > 0));
}

export function latestRelease(releases = RELEASES) { return releases[0] || null; }

export { ENGINE_VERSION };
