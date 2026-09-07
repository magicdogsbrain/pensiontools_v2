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
