/**
 * "Are you paying in enough?" said as one block (7.12.0): the same lines, in the same order, on the plan's home and on the
 * full view's Accumulation tab, so the two can never say different things. From the plan's verdict reading
 * (answers/plan/saving.js saverVerdictOf: question B's inputs on the plan's figures, the aim, the stop age and what goes in now) and the
 * run held for its key (question B's own result):
 *
 *   1. what you want:       "You want £2,000 a month after tax, at today's prices, from age 60."
 *   2. what goes in now:    what leaves take-home pay, the employer's part, all of it (copy/saving.js payInNow), and, when
 *                           it is said in pounds and the pay is known, the share of pay that is, in all and the person's
 *                           own part (payInSharesOf, ruling Z4)
 *   3. whether it is enough, and how sure: the answer's own head and first sentence; what would be on course in its own
 *      sentence; and what could be spent a month from the stop paying in as now (7.12.0), as What you pay in says it
 *   4. what would be enough, not on course: the answer's own block (a share of pay with what leaves take-home pay, or the
 *      pounds), and the share of pay when it is said in pounds and the pay is known
 *   5. the reach, when paying in alone cannot do it (enough.reach): said the one way every card says it
 *
 * Each line is { id, slots } (words in copy/home.js HOME.saver, or copy/saving.js payInNow for `now.*`) or { id, s } (one of
 * the answer's sentences, drawn as it is). Pure: nothing is worked out but a share of pay from pounds.
 *
 *   saverBlockOf(verdict, run) → null | { state: 'noAim'|'working'|'failed'|'invalid'|'answer', status, reason, band, lines }
 */
import { payInWithinReach } from '../../answers/shared/shown.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** A share of pay to one decimal place, as the answer says a share ("37.5%"; "8%"). */
export const pctOf = (monthly, salary) => String(Math.round((monthly * 12 / salary) * 1000) / 10);

/**
 * (ruling Z4) A pay-in as a share of pay, ONE reading for both views: what goes in now and what would be enough, in all and
 * the person's own part (with the tax added back), whenever the plan knows the pay — the home and the full view's
 * Accumulation tab (saverBlockOf) and the simple view's "What you pay in" (state/select.js planSavingView) draw these lines.
 * `now` only when what goes in now is said in pounds (a share is said as a share already); `enough` only when what would be
 * enough is said in pounds and within reach (shared/shown.js payInWithinReach).
 *   payInSharesOf(verdict, result) → { now: { id: 'nowShare', slots: { pct, ownPct } } | null, enough: { id: 'enoughShare', … } | null }
 */
export function payInSharesOf(verdict, result) {
  const out = { now: null, enough: null };
  const now = isObj(verdict) && verdict.ok && isObj(verdict.now) ? verdict.now : null;
  if (!now || !(now.salary > 0)) return out;
  const employer = isNum(now.employer) ? Math.max(0, now.employer) : 0;
  if (now.line && now.line.id !== 'share' && now.line.id !== 'none' && now.total > 0) out.now = { id: 'nowShare', slots: { pct: pctOf(now.total, now.salary), ownPct: pctOf(Math.max(0, now.total - employer), now.salary) } };
  const r = isObj(result) ? result : null;
  const en = r && isObj(r.enough) ? r.enough : null;
  const fig = en && isObj(en.atLevel) ? en.atLevel : null;
  if (fig && r.onCourse !== true && payInWithinReach(r) && en.how === 'pounds' && isNum(fig.payIn) && fig.payIn > 0) {
    const lead = Array.isArray(fig.parts) && fig.parts.length === 1 ? fig.parts[0] : null;
    const own = isNum(fig.own) ? fig.own : lead && isNum(lead.own) ? lead.own : Math.max(0, fig.payIn - employer);
    out.enough = { id: 'enoughShare', slots: { pct: pctOf(fig.payIn, now.salary), ownPct: pctOf(own, now.salary) } };
  }
  return out;
}

export function saverBlockOf(verdict, run) {
  if (!isObj(verdict)) return null;
  if (!verdict.ok) return verdict.why === 'noAim' ? { state: 'noAim', status: null, reason: null, band: null, lines: [] } : null;
  const n = verdict.notes || {};
  const now = verdict.now || null;
  const lines = [{ id: 'want', slots: { amount: n.aimMonthly, age: n.stopAge } }];
  if (now && now.line) {
    lines.push({ id: 'now.' + now.line.id, slots: now.line.slots });
    const share = payInSharesOf(verdict, null).now;
    if (share) lines.push(share);
  }
  const status = run && run.status ? run.status : 'working';
  const r = run && isObj(run.result) ? run.result : null;
  if (!r) return { state: status === 'failed' ? 'failed' : 'working', status, reason: run ? run.reason || null : null, band: null, lines };
  if (r.status === 'invalid') return { state: 'invalid', status, reason: null, band: null, lines };
  const s = isObj(r.sentences) ? r.sentences : {};
  const band = r.verdict && r.verdict.band ? r.verdict.band : null;
  if (s.verdictHead) lines.push({ id: 'head', s: s.verdictHead });
  if (s.verdictLine) lines.push({ id: 'line', s: s.verdictLine });
  if (s.verdictEnough) lines.push({ id: 'lineEnough', s: s.verdictEnough });
  // (7.12.0) what could be spent a month from the stop paying in as now: the figure What you pay in gives, in its words
  if (s.income) lines.push({ id: 'income', s: s.income });
  if (band !== 'yes') {
    if (s.enoughHead) lines.push({ id: 'enoughHead', s: s.enoughHead });
    if (s.enoughLine) lines.push({ id: 'enoughLine', s: s.enoughLine });
    const share = payInSharesOf(verdict, r).enough;
    if (share) lines.push(share);
  }
  // (the answer itself rides along: its sentences' figures are read from it when the full view draws them marked)
  return { state: 'answer', status, reason: null, band, lines, result: r };
}
