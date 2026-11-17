/**
 * "Are you paying in enough?" said as one block (7.12.0): the same lines, in the same order, on the plan's home and on the
 * full view's Accumulation tab, so the two can never say different things. From the plan's verdict reading
 * (answers/plan/saving.js saverVerdictOf: question B's inputs on the plan's figures, the aim, the stop age and what goes in now) and the
 * run held for its key (question B's own result):
 *
 *   1. what you want:       "You want £2,000 a month after tax, at today's prices, from age 60."
 *   2. what goes in now:    what leaves take-home pay, the employer's part, all of it (copy/saving.js payInNow), and, when
 *                           it is said in pounds and the pay is known, the share of pay that is
 *   3. whether it is enough, and how sure: the answer's own head and first sentence
 *   4. what would be enough, not on course: the answer's own block (a share of pay with what leaves take-home pay, or the
 *      pounds), and the share of pay when it is said in pounds and the pay is known
 *   5. the reach, when paying in alone cannot do it (enough.reach): said the one way every card says it
 *
 * Each line is { id, slots } (words in copy/home.js HOME.saver, or copy/saving.js payInNow for `now.*`) or { id, s } (one of
 * the answer's sentences, drawn as it is). Pure: nothing is worked out but a share of pay from pounds.
 *
 *   saverBlockOf(verdict, run) → null | { state: 'noAim'|'working'|'failed'|'invalid'|'answer', status, reason, band, lines }
 */
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** A share of pay to one decimal place, as the answer says a share ("37.5%"; "8%"). */
export const pctOf = (monthly, salary) => String(Math.round((monthly * 12 / salary) * 1000) / 10);

export function saverBlockOf(verdict, run) {
  if (!isObj(verdict)) return null;
  if (!verdict.ok) return verdict.why === 'noAim' ? { state: 'noAim', status: null, reason: null, band: null, lines: [] } : null;
  const n = verdict.notes || {};
  const now = verdict.now || null;
  const lines = [{ id: 'want', slots: { amount: n.aimMonthly, age: n.stopAge } }];
  if (now && now.line) {
    lines.push({ id: 'now.' + now.line.id, slots: now.line.slots });
    if (now.line.id !== 'share' && now.line.id !== 'none' && now.salary > 0 && now.total > 0) lines.push({ id: 'nowShare', slots: { pct: pctOf(now.total, now.salary) } });
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
  if (band !== 'yes') {
    if (s.enoughHead) lines.push({ id: 'enoughHead', s: s.enoughHead });
    if (s.enoughLine) lines.push({ id: 'enoughLine', s: s.enoughLine });
    const en = isObj(r.enough) ? r.enough : null;
    const fig = en && isObj(en.atLevel) ? en.atLevel : null;
    if (fig && en.how === 'pounds' && now && now.salary > 0 && isNum(fig.payIn) && fig.payIn > 0) lines.push({ id: 'enoughShare', slots: { pct: pctOf(fig.payIn, now.salary) } });
  }
  return { state: 'answer', status, reason: null, band, lines };
}
