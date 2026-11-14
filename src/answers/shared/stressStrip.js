/**
 * "Try the bad years" under C's and D's answers (7.9.0; research/v7/replan-nov-2026.md §5; the build spec's §1.2, §2.2): the
 * answer worked out again, row by row, on its own futures with one thing made worse, at the amount it stands behind.
 *
 *   runStressStrip(q, inputs, env, { perMonth, onProgress? }) → {
 *     status: 'ok' | 'none', q, perMonth,
 *     rows: [{ id, perMonth, chance: { weighted, fixedAge, fails, sumW, n }, verdict, same, sentences: { line?, fixed, when,
 *             howLong?, howMuch?, floor? }, words: { title, what[] } }]       As planned first, then the four in STRIP_ROWS
 *     basis: { today, futures, seed, planToAge, weighted }
 *   }
 *
 * The case is the answer's own (c/answer.js and d/answer.js stressCaseOf: the plan, the weights, the level, the plan-to age),
 * so As planned here is the answer at that amount: worked out in the strip like every other row, at the same amount — C's
 * take when one is set, else the level's amount; D's spend — and no answer result is read or added, so no answer moves.
 *   asPlanned   the case as it is
 *   fall        shares lose at least 30% after prices in the first year the money is drawn on (ladderEngine.shockPath)
 *   lower       every fund and cash pot grows 1% a year less, after prices (the household's returnDragPct)
 *   spend       a tenth more spent, after tax (the amount × 1.1, to the penny)
 *   prices      prices rise 2% a year faster in every future
 * Each row: the chance (levels.js chanceOf) and its verdict at the answer's level (verdictOfChance), when, how long and how
 * much (shortfall.js shortfallOf, with what is left by the answer's own reader), in the answers' words (lastsWords.js, with
 * the answer's facts), each beside As planned's. The 1-in-10 is a reading on every row; the answer keeps its own bad-case
 * sentence. Pure; no clock: the date arrives in env. In the worker's own chunk beside the answers.
 */
import { stressCaseOf as stressCaseOfC } from '../c/answer.js';
import { stressCaseOf as stressCaseOfD } from '../d/answer.js';
import { chanceOf, verdictOfChance } from './levels.js';
import { shortfallOf } from './shortfall.js';
import { countingLead, asLongAs, chanceParts, fixedAgeParts, whenParts, howLongParts, howMuchParts, floorParts } from './lastsWords.js';
import { chanceTwentieths, chanceWords, twentiethsOfFutures, money } from './format.js';

/** The rows of the strip, in order (As planned first). */
export const STRIP_ROWS = Object.freeze(['asPlanned', 'fall', 'lower', 'spend', 'prices']);
/** What each row changes (the plan side's sizes: answers/plan/stressPanel.js ROW_CHANGE). */
export const STRIP_CHANGE = Object.freeze({
  asPlanned: Object.freeze({}),
  fall: Object.freeze({ shock: Object.freeze({ kind: 'fall', share: 0.3 }) }),
  lower: Object.freeze({ dragPct: 1 }),
  spend: Object.freeze({ spend: 1.1 }),
  prices: Object.freeze({ shock: Object.freeze({ kind: 'prices', add: 0.02 }) })
});

const F = (fixed) => ({ fixed: String(fixed) });
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** A sentence as every answer writes it: { id, text, parts, mark? } — the text is the parts joined. */
const S = (id, parts, mark) => {
  const p = parts.flat().filter((x) => x !== '' && x != null);
  return { id, text: p.map((x) => (typeof x === 'string' ? x : String(x.fixed))).join(''), parts: p, ...(mark ? { mark } : {}) };
};
/** The parts without their closing full stop (so the reference can follow it). */
const noStop = (parts) => {
  const out = parts.slice();
  for (let i = out.length - 1; i >= 0; i--) {
    if (typeof out[i] !== 'string') break;
    out[i] = out[i].replace(/\.\s*$/, '');
    if (out[i] === '') out.splice(i, 1); else break;
  }
  return out;
};
/** As planned's chance said beside a row: "18" for 18 times in 20, else its words. */
const refChance = (c) => { const k = chanceTwentieths(c.weighted, { sumW: c.sumW, n: c.n }); return c.weighted > 0 && c.weighted < 1 && k >= 1 && k <= 19 ? String(k) : chanceWords(c.weighted, { sumW: c.sumW, n: c.n }); };
/** As planned's fixed-age count said beside a row: "14" for 14 of 20 futures, else its words. */
const refFixed = (share) => { const v = Math.max(0, Math.min(1, +share || 0)); const k = Math.round(v * 20); return v > 0 && v < 1 && k >= 1 && k <= 19 ? String(k) : twentiethsOfFutures(v); };

/** The case an answer is worked out again on (null: nothing to try). */
export function stressCaseFor(q, inputs, env) {
  if (q === 'c') return stressCaseOfC(inputs, env);
  if (q === 'd') return stressCaseOfD(inputs, env);
  return null;
}

/** A row's sentences in the answers' words, beside As planned's (`ref`; none on As planned itself). */
function sentencesOf(id, row, ref, lf) {
  const c = lf.couple;
  const out = {};
  const refPart = (n) => [' (as planned: ', ...String(n).split(/(\d+)/).map((x, i) => (i % 2 ? F(x) : x)).filter((x) => x !== ''), ').'];
  if (lf.weighted) {
    const head = [countingLead(c), ', the money lasts ', asLongAs(c), ' ', ...chanceParts(row.chance.weighted)];
    out.line = S('strip.' + id + '.line', ref ? [...head, ...refPart(refChance(ref.chance))] : [...head, '.'], 'weighted');
  }
  const fixed = fixedAgeParts(row.chance.fixedAge, lf);
  out.fixed = S('strip.' + id + '.fixed', ref ? [...noStop(fixed), ...refPart(refFixed(ref.chance.fixedAge))] : fixed, lf.weighted ? 'fixed' : undefined);
  const sf = row.sf;
  // beside As planned: how many futures each set holds and As planned's own figure (lastsWords.js `cmp`), so a set that grew
  // with later run-outs never reads as a better year; As planned itself in the answer's own words
  const cmp = ref ? { count: row.counts.failing, early: row.counts.early, n: row.chance.n, ref: ref.sf, refCount: ref.counts.failing, refEarly: ref.counts.early } : null;
  const wp = whenParts(sf, lf, cmp);
  const rw = ref && ref.sf && ref.sf.when ? ref.sf.when : null;
  out.when = wp ? S('strip.' + id + '.when', wp)
    : S('strip.' + id + '.lasts', ['In the worst ', F('1'), ' in ', F('10'), ' of all the futures it still lasts to ', F(lf.planToAge), ...(ref && rw && !rw.worstLasts ? [' (as planned: by ', F(rw.worst), ')'] : []), '.']);
  const hl = howLongParts(sf, lf, cmp);
  if (hl) out.howLong = S('strip.' + id + '.howLong', hl);
  const hm = howMuchParts(sf, cmp);
  if (hm) out.howMuch = S('strip.' + id + '.howMuch', hm);
  const fp = floorParts(sf, lf);
  if (fp) out.floor = S('strip.' + id + '.floor', fp);
  return out;
}

/** Whether a row's every reported figure is As planned's (then it says only "this changes nothing"). */
function sameAsRef(row, ref) {
  if (!ref) return false;
  // (what the strip says of a row: the chance, when, how long, how much and the floor — what is left is the answer's own line)
  const pick = (r) => JSON.stringify([r.chance.fails, r.chance.sumW, r.sf.when, r.sf.howLong, r.sf.howMuch, r.sf.floor && r.sf.floor.age, r.sf.floor && r.sf.floor.yearly]);
  return pick(row) === pick(ref);
}

/**
 * @param {'c'|'d'} q
 * @param {object} inputs   the answer's checked inputs (result.inputs)
 * @param {{ today: string, futures: number, seed?: number, onProgress?: Function }} env   the final answer's
 * @param {{ perMonth: number }} at   the amount the answer stands behind, a month after tax
 */
export function runStressStrip(q, inputs, env, { perMonth } = {}) {
  const tell = (done, total) => { if (env && typeof env.onProgress === 'function') env.onProgress(done, total); };
  const sc = isNum(perMonth) && perMonth > 0 ? stressCaseFor(q, inputs, env) : null;
  if (!sc) return { status: 'none', q, perMonth: isNum(perMonth) ? perMonth : null, rows: [] };
  const n = sc.n;
  const rows = [];
  tell(0, STRIP_ROWS.length);
  for (const id of STRIP_ROWS) {
    const ch = STRIP_CHANGE[id];
    const monthly = ch.spend ? Math.round(perMonth * ch.spend * 100) / 100 : perMonth;
    const H = monthly * 12;
    const { months, left, plan } = sc.monthsAt({ H, shock: ch.shock || null, dragPct: ch.dragPct || 0 });
    const c = chanceOf(sc.weigher, months, sc.toMonth);
    const sf = shortfallOf(plan, months, H, { toMonth: sc.toMonth, left });
    // (how many futures run out before the age they are followed on to, and before the plan-to age: the sets the words name)
    const counts = { failing: months.filter((m) => m !== null && isNum(m)).length, early: months.filter((m) => m !== null && isNum(m) && m < sc.toMonth).length };
    rows.push({ id, perMonth: monthly, chance: { weighted: c.weighted, fixedAge: c.fixedAge, fails: c.fails, sumW: c.sumW, n }, verdict: verdictOfChance(c, n, sc.level, sc.weigher), sf, counts });
    tell(rows.length, STRIP_ROWS.length);
  }
  const ref = rows[0];
  for (const row of rows) {
    const r = row.id === 'asPlanned' ? null : ref;
    row.same = sameAsRef(row, r);
    row.sentences = sentencesOf(row.id, row, r, sc.lf);
    row.words = {
      title: { id: 'rows.' + row.id + '.title' },
      what: row.id === 'asPlanned' ? [{ id: 'rows.asPlanned.answer' }]
        : row.id === 'fall' ? [{ id: sc.drawingNow ? 'rows.fall.whatDrawing' : 'rows.fall.what' }]
          : row.id === 'spend' ? [{ id: 'rows.spend.answer', slots: { amount: money(row.perMonth) } }]
            : row.id === 'lower' ? [{ id: 'rows.lower.what' }, ...(sc.drawingNow ? [] : [{ id: 'rows.lower.saver' }])]
              : [{ id: 'rows.' + row.id + '.what' }]
    };
  }
  return {
    status: 'ok', q, perMonth, rows,
    basis: { today: env.today, futures: n, seed: env.seed ?? 0, planToAge: sc.lf.planToAge, weighted: !!sc.lf.weighted, level: sc.level }
  };
}
