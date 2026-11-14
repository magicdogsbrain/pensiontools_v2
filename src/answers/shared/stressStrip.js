/**
 * "Try the bad years" under C's and D's answers (7.9.0; research/v7/replan-nov-2026.md §5; the build spec's §1.2, §2.2): the
 * answer worked out again, row by row, on its own futures with one thing made worse, at the amount it stands behind.
 *
 *   runStressStrip(q, inputs, env, { perMonth, onProgress? }) → {
 *     status: 'ok' | 'none', q, perMonth,
 *     rows: [{ id, perMonth, chance: { weighted, fixedAge, fails, sumW, n }, verdict, same, short: { chance, runsOut },
 *             sentences: { when?, howLong?, howMuch?, floor? }, words: { title, what[] } }]   As planned first, then the four
 *             in STRIP_ROWS; `short` the two lines a row shows (shared/stressRowWords.js), `sentences` the rest
 *     floor: what still comes in if the money runs out, said once above the rows from As planned (null: none runs out)
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
import { whenParts, howLongParts, howMuchParts, floorParts } from './lastsWords.js';
import { chanceShort, runsOutShort, answerFloorShort, sameFloor } from './stressRowWords.js';
import { money } from './format.js';

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

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** A sentence as every answer writes it: { id, text, parts, mark? } — the text is the parts joined. */
const S = (id, parts, mark) => {
  const p = parts.flat().filter((x) => x !== '' && x != null);
  return { id, text: p.map((x) => (typeof x === 'string' ? x : String(x.fixed))).join(''), parts: p, ...(mark ? { mark } : {}) };
};

/** The case an answer is worked out again on (null: nothing to try). */
export function stressCaseFor(q, inputs, env) {
  if (q === 'c') return stressCaseOfC(inputs, env);
  if (q === 'd') return stressCaseOfD(inputs, env);
  return null;
}

/**
 * A row in words: `short` — its chance beside its fixed-age count, and where it runs out, each beside As planned's figure
 * (shared/stressRowWords.js, the plan panel's own builder) — and `sentences`, the rest in the answers' words, drawn under
 * "More about this line": when (with how many futures run out, beside As planned's), how long, how much, and what still
 * comes in when it says something other than As planned's (`refFloor`, said once above the rows).
 */
function wordsOf(id, row, ref, lf, refFloor) {
  const c = lf.couple;
  const me = { weighted: lf.weighted ? row.chance.weighted : null, sumW: row.chance.sumW, n: row.chance.n, fixedAge: row.chance.fixedAge };
  const refMe = ref ? { weighted: lf.weighted ? ref.chance.weighted : null, sumW: ref.chance.sumW, n: ref.chance.n, fixedAge: ref.chance.fixedAge } : null;
  const sf = row.sf;
  const short = {
    chance: chanceShort(me, refMe, { planToAge: lf.planToAge, couple: c ? 'younger' : null }),
    runsOut: runsOutShort(sf && sf.when ? sf.when : null, ref ? (ref.sf && ref.sf.when ? ref.sf.when : null) : undefined, { planToAge: lf.planToAge, younger: c })
  };
  const out = {};
  // beside As planned: how many futures each set holds and As planned's own figure (lastsWords.js `cmp`), so a set that grew
  // with later run-outs never reads as a better year; As planned itself in the answer's own words
  const cmp = ref ? { count: row.counts.failing, early: row.counts.early, n: row.chance.n, ref: ref.sf, refCount: ref.counts.failing, refEarly: ref.counts.early } : null;
  const wp = whenParts(sf, lf, cmp);
  if (wp) out.when = S('strip.' + id + '.when', wp);
  const hl = howLongParts(sf, lf, cmp);
  if (hl) out.howLong = S('strip.' + id + '.howLong', hl);
  const hm = howMuchParts(sf, cmp);
  if (hm) out.howMuch = S('strip.' + id + '.howMuch', hm);
  const fp = floorParts(sf, lf);
  if (fp && !sameFloor(floorShortOf(sf, lf), refFloor)) out.floor = S('strip.' + id + '.floor', fp);
  return { short, sentences: out };
}

/** A row's floor as the line above the rows says it (without an age when something comes in). */
function floorShortOf(sf, lf) {
  const fp = floorParts(sf, lf);
  return fp ? answerFloorShort(sf.floor, { couple: lf.couple, words: S('', fp).text }) : null;
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
  // what still comes in if the money runs out: said once, above the rows, from As planned
  const floor = floorShortOf(ref.sf, sc.lf);
  for (const row of rows) {
    const r = row.id === 'asPlanned' ? null : ref;
    row.same = sameAsRef(row, r);
    const w = wordsOf(row.id, row, r, sc.lf, floor);
    row.short = w.short;
    row.sentences = w.sentences;
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
    status: 'ok', q, perMonth, rows, floor,
    basis: { today: env.today, futures: n, seed: env.seed ?? 0, planToAge: sc.lf.planToAge, weighted: !!sc.lf.weighted, level: sc.level }
  };
}
