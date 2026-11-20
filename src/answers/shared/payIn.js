/**
 * ONE reader of what goes into a pension each month (6.46.0), for every way it can be said — in a file of its own so the
 * household model (household.js) and the input lists (schemaParts.js, which imports household.js) can both read it
 * without importing each other. schemaParts.js exports it on, so the answers read it from there.
 *
 *   payInParts(p, scheme?) → { kind, total, own, employer, pay }
 *
 * `p` is a form's pay-in as checked — kind 'total' (one figure), 'split' (own and employer in pounds) or 'share' (pay a
 * year before tax, the person's part and the employer's part as percentages of it) — or the household model's
 * { total, own, employer }, which has no kind.
 *
 * A share lands own = pay × ownPct / 100 / 12 and employer = pay × employerPct / 100 / 12, each to the penny, the total
 * their sum to the penny (added as a split adds its two boxes — the one expression, so a share and the split of the same
 * pounds are one answer, byte for byte; whole pounds add exactly, and £166.67 + £100 is £266.67, not 266.66999…). That is
 * the whole definition — what lands, with the tax the government adds back included — the same under salary sacrifice,
 * net pay and relief at source: a 5% employee part is 5% of pay landing under every scheme.
 *
 * own and employer are null for one figure; pay is null unless a share was given. C's "still paying in?" not answered
 * yes, or nothing given: nothing goes in. Pure.
 *
 * Your part in pounds ('split') can be said two ways (7.12.0, question B's step 1): `ownFrom: 'takeHome'` — what leaves
 * take-home pay, to which the tax is added back by the scheme's own sum (AccumulationEngine.contributionBreakdown: relief at
 * source at the basic rate when `scheme` — { kind: 'ras' | 'netpay' | 'salsac', salary } — is not known), to the penny — or
 * 'lands' (and, for everything saved before 7.12.0, no `ownFrom` at all): what lands, as before. `own` is always what
 * lands; `ownTyped` is the figure as given and `ownFrom` how it was given.
 */
import { contributionBreakdown } from '../../services/AccumulationEngine.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const round2 = (n) => Math.round(n * 100) / 100;
const SCHEMES = ['ras', 'netpay', 'salsac'];

/**
 * What lands for `typed` a month from take-home pay: the scheme-aware sum (AccumulationEngine.contributionBreakdown, whose
 * exact inverse SaverPayIn.takeHomeOf says it back), on the scheme and pay a plan knows (`scheme`: { kind, salary }), else
 * relief at source at the basic rate (typed / 0.8).
 */
function landsFromTakeHome(typed, scheme) {
  const known = scheme && typeof scheme === 'object' && SCHEMES.includes(scheme.kind) ? scheme : null;
  return round2(contributionBreakdown({ netMonthly: typed, salary: known ? +known.salary || 0 : 0, schemeType: known ? known.kind : 'ras' }).grossMonthly);
}

export function payInParts(p, scheme = null) {
  const none = { kind: 'total', total: 0, own: null, employer: null, pay: null };
  if (!p || typeof p !== 'object') return none;
  if ('has' in p && p.has !== 'yes') return none;
  if (p.kind === 'share') {
    const pay = isNum(p.pay) ? p.pay : 0;
    const own = round2(pay * (isNum(p.ownPct) ? p.ownPct : 0) / 100 / 12);
    const employer = round2(pay * (isNum(p.employerPct) ? p.employerPct : 0) / 100 / 12);
    return { kind: 'share', total: round2(own + employer), own, employer, pay };
  }
  if (p.kind === 'split') {
    const typed = isNum(p.own) ? p.own : 0;
    const employer = isNum(p.employer) ? p.employer : 0;
    if (p.ownFrom === 'takeHome') {
      const own = landsFromTakeHome(typed, scheme);
      return { kind: 'split', total: round2(own + employer), own, employer, pay: null, ownTyped: typed, ownFrom: 'takeHome' };
    }
    return { kind: 'split', total: round2(typed + employer), own: typed, employer, pay: null };
  }
  if (p.kind === 'total') return { kind: 'total', total: isNum(p.total) ? p.total : 0, own: null, employer: null, pay: null };
  // no kind: the household model's { total, own, employer } — the total as given, else the parts added up; the parts as given
  const own = isNum(p.own) ? p.own : null;
  const employer = isNum(p.employer) ? p.employer : null;
  return { kind: 'total', total: isNum(p.total) ? p.total : (own || 0) + (employer || 0), own, employer, pay: null };
}
