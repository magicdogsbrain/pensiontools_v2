/**
 * The figures behind the first visit's pictures and controls (7.5.0; research/v7/mockups/README.md, "Three pictures" and
 * "When it is built"). Pure: state in, plain data out. The components draw what these return and work nothing out
 * (tests/v7/boundaries.test.js rule 2); the answers are not touched: every figure here is one the answer already gave.
 *
 *   LIFE_EXAMPLE                      the front door's explainer: the shape of a pot over a life, with no figures on it
 *   lifeStages(strip)                 the plan home's stage strip as the life line draws it
 *   roundTop(max)                     a round top for a scale (1, 2, 2.5 or 5 times a power of ten)
 *   answerSlider(state, q)            the one control on B's, C's and D's answer: which box it moves, its range and value
 *   answerTiles(state, q)             the three figures under the verdict, each a key of the answer's own result
 *   tilesKey(state, q)                what those figures count up to, as one key: the result on screen, never the inputs
 *   potPicture(state, q)              the pot over a life for B (the rising half, the drawing half faint) and D (what is left)
 *
 * The pot picture is drawn to scale through the figures the answer gives — the pot today, the pot at the stop (middling and
 * in a bad case), the age the money runs out in a bad case — and nothing between them is claimed as a figure: the rising
 * half is drawn as a pot that grows with what goes in (a smooth curve between the two pots the answer gives), the drawing
 * half as a faint straight fall to the age it runs out. Where the answer gives no figure for an end — what is left at the
 * end age when the money lasts, or where the middling years leave D's pot — the line is a guide (`guide: true`: drawn
 * dashed, carrying no figure on the page), and the picture says the money is still there at that age rather than how much.
 * The table under each picture lists only the answer's figures.
 */

import { shownOf, LEVEL_IDS } from '../../answers/shared/shown.js';
import { SCHEMA_B } from '../../answers/b/schema.js';
import { SCHEMA_C } from '../../answers/c/schema.js';
import { SCHEMA_D } from '../../answers/d/schema.js';

/** The front door's explainer: a pot over a life, as a shape only (x and y from 0 to 1; no figure is drawn or read). */
export const LIFE_EXAMPLE = Object.freeze({
  // the three stages along the life, as shares of its width: saving to 0.48, the move to 0.62, drawing to the end
  stages: Object.freeze([
    Object.freeze({ key: 'saving', from: 0, to: 0.48 }),
    Object.freeze({ key: 'moving', from: 0.48, to: 0.62 }),
    Object.freeze({ key: 'drawing', from: 0.62, to: 1 })
  ]),
  // the pot: rising while saving, level through the move, falling while drawing
  points: Object.freeze([
    [0, 0.06], [0.08, 0.1], [0.16, 0.16], [0.24, 0.25], [0.32, 0.38], [0.4, 0.55], [0.48, 0.74],
    [0.55, 0.8], [0.62, 0.8],
    [0.7, 0.74], [0.78, 0.63], [0.86, 0.48], [0.93, 0.31], [1, 0.14]
  ].map((p) => Object.freeze(p)))
});

/**
 * The plan home's stage strip (answers/plan/home.js homeOf → stage.strip) as the life line draws it: each stage, its state
 * and how far along the dot sits. Only the stage marked "now" carries the dot; a part-held move fills to its share.
 */
export function lifeStages(strip) {
  if (!Array.isArray(strip)) return [];
  return strip.filter((s) => s && typeof s.key === 'string').map((s) => ({
    key: s.key, state: s.state, month: s.month || null, held: typeof s.held === 'number' ? s.held : null
  }));
}

/** A round top for a scale at or above `max`: a round step of a power of ten, close enough that the picture fills its box. */
export function roundTop(max) {
  const m = Math.max(1, Number(max) || 0);
  const p = 10 ** Math.floor(Math.log10(m));
  for (const k of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (k * p >= m) return k * p;
  return 10 * p;
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const get = (o, path) => path.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
const resultOf = (state, q) => {
  const a = state.answers && state.answers[q];
  const r = a && a.result;
  return r && r.status !== 'invalid' ? r : null;
};
const draftOf = (state, q) => (state.draft && state.draft[q] && state.draft[q].values) || {};
/** A number typed in a box ("1,250" or "8.5"), or null. */
const typed = (v) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const t = v.replace(/[£,\s%]/g, '');
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  return Number(t);
};

// ---- the slider ------------------------------------------------------------------------------------------------------

const SCHEMA = { b: SCHEMA_B, c: SCHEMA_C, d: SCHEMA_D };
/** A box's own limits (the input list's min and max), so the slider can never write a figure the form would refuse. */
function limitsOf(q, path) {
  const f = SCHEMA[q] && SCHEMA[q].fields.find((x) => x.path === path);
  return { min: f && isNum(f.min) ? f.min : 0, max: f && isNum(f.max) ? f.max : Infinity };
}
const quarters = (min, max) => [min, max / 4, max / 2, (3 * max) / 4, max];

/**
 * The one control on an answer (the mock-up's slider): the box it moves and its range. It writes the same box the form
 * has (draft/set), so the answer is worked out again exactly as a typed change would be — the slider is a faster way to
 * type, nothing more.
 *   B  what goes in a month: your pounds (a total or your own part), or your share of pay — from nothing to well past
 *      what would be enough;
 *   C  what you would take a month ("What if I took…?", the try box) — from nothing to well past the good case;
 *   D  what you take a month — from the least the box takes to well past what could be taken.
 * The range fits the figure in the box when it is drawn; once the slider moves, the range it was drawn with is held
 * (ui.slider, set by the slider's own draft/set and let go by any other change to the draft), so the track never grows
 * under the pointer. Both ends stay inside the box's own limits — the input list's min and max, and for B what one person
 * can pay in a month with the employer's part (the pay-in box's own top) — so no end of the track makes the form refuse it.
 * Null where there is no one box to move: B about your partner or with "I've already stopped", D with a spending level
 * chosen in place of an amount, an answer with nothing drawn on.
 * @returns {null | { q, path, min, max, step, value, unit: 'money'|'pct', words, slots, scale: number[] }}
 */
export function answerSlider(state, q) {
  const r = resultOf(state, q);
  if (!r || !r.inputs) return null;
  const S = sliderOf(state, r, q);
  if (!S) return null;
  // the range the slider was moving on, while nothing else has been typed (state/reduce.js withSliderHold)
  const h = state.ui && state.ui.slider;
  if (h && h.q === q && h.path === S.path && isNum(h.min) && isNum(h.max) && S.raw !== null && S.raw >= h.min && S.raw <= h.max) {
    const { raw, ...rest } = S;
    return { ...rest, min: h.min, max: h.max, step: isNum(h.step) ? h.step : S.step, value: raw, scale: quarters(h.min, h.max) };
  }
  const { raw, ...rest } = S;
  return rest;
}

function sliderOf(state, r, q) {
  const d = draftOf(state, q);
  const ins = r.inputs;
  /** A money slider: a round top a little past what it must show, inside the box's limits (and `cap`). */
  const money = (path, words, want, value, slots = {}, cap = Infinity) => {
    const lim = limitsOf(q, path);
    const hi = Math.min(lim.max, cap);
    const top = Math.min(hi, roundTop(Math.max(want, 100)));
    // whole tens up to £10,000 (so an answer's own figure, £1,410, sits on the track exactly), fifties above
    const step = top <= 10_000 ? 10 : 50;
    const min = lim.min > 0 ? Math.ceil(lim.min / step) * step : 0;
    const v = isNum(value) ? Math.max(min, Math.min(top, value)) : min;
    return { q, path, min, max: top, step, value: v, raw: isNum(value) ? value : null, unit: 'money', words, slots, scale: quarters(min, top) };
  };
  if (q === 'b') {
    if (r.askedAbout === 'partner' || r.apart || r.status === 'guaranteed-only') return null;
    const p = ins.you && ins.you.payIn;
    if (!p) return null;
    const needed = r.payIn && isNum(r.payIn.needed) ? r.payIn.needed : 0;
    // what one person can pay in a month, both parts together (validate.js pay-in-over-limit): the input list's own top for
    // one figure going in, SAVING.payInCeiling
    const ceiling = limitsOf('b', 'you.payIn.total').max;
    if (p.kind === 'share') {
      const own = typed(d['you.payIn.ownPct']) ?? p.ownPct;
      if (!isNum(own)) return null;
      const employer = isNum(p.employerPct) ? p.employerPct : 0;
      // a share of pay lands pay × share / 12 a month: both parts together stay within what one person can pay in
      const cap = isNum(p.pay) && p.pay > 0 ? Math.floor(((ceiling * 1200) / p.pay - employer) * 2) / 2 : 100;
      const hi = Math.max(0, Math.min(limitsOf('b', 'you.payIn.ownPct').max, cap));
      const top = Math.min(hi, Math.max(20, Math.ceil((own * 1.5) / 5) * 5));
      return { q, path: 'you.payIn.ownPct', min: 0, max: top, step: 0.5, value: Math.max(0, Math.min(top, own)), raw: own, unit: 'pct', words: 'share',
        slots: { employer }, scale: quarters(0, top) };
    }
    const path = p.kind === 'split' ? 'you.payIn.own' : 'you.payIn.total';
    const now = typed(d[path]) ?? (p.kind === 'split' ? p.own : p.total);
    const theirs = p.kind === 'split' && isNum(p.employer) ? p.employer : 0;
    return money(path, p.kind === 'split' ? 'own' : 'total', Math.max(2 * needed, 1.25 * (isNum(now) ? now : 0), 500), now, { employer: theirs },
      p.kind === 'split' ? Math.max(0, ceiling - theirs) : Infinity);
  }
  if (q === 'c') {
    // (7.8.0: the scale reaches past Bold's amount, the most of the three levels)
    if (!r.levels || !r.levels.bold || !isNum(r.levels.bold.monthly) || r.status === 'none') return null;
    const take = typed(d.take);
    const value = take ?? (isNum(ins.take) ? ins.take : shownOf(r).monthly);
    return { ...money('take', 'take', 1.6 * r.levels.bold.monthly, value), set: take !== null || isNum(ins.take) };
  }
  if (q === 'd') {
    if (!ins.spend || ins.spend.kind !== 'amount' || !r.levels || !r.levels.bold || !isNum(r.levels.bold.monthly)) return null;
    const spend = typed(d['spend.amount']) ?? ins.spend.amount;
    return money('spend.amount', 'spend', Math.max(1.5 * r.levels.bold.monthly, 1.5 * (isNum(spend) ? spend : 0)), spend);
  }
  return null;
}

// ---- the three figures ---------------------------------------------------------------------------------------------

/**
 * The three figures under the verdict (the mock-up's tiles), each a key of the answer's own result — Money draws it. The
 * first marked `pop` is the one figure that is "you": what you pay in, take, or would get. A tile whose figure the answer
 * did not give is left out (never a blank tile).
 * @returns {Array<{ id, k, kind: 'money'|'pot'|'age'|'pct', pop?: true, ageKey? }>}   ageKey: the answer's key of the age the words name
 */
export function answerTiles(state, q) {
  const r = resultOf(state, q);
  if (!r) return [];
  const has = (k) => isNum(get(r, k));
  const out = [];
  const add = (t) => { if (has(t.k)) out.push(t); };
  if (q === 'b') {
    add({ id: 'aim', k: `levels.${r.level}.pot`, kind: 'pot', ageKey: 'stop.age' });
    add({ id: 'nowBad', k: 'potAtStop.now.careful', kind: 'pot', ageKey: 'stop.age' });
    if (r.onCourse !== true && r.enough && r.enough.how === 'share' && has('enough.atLevel.totalPct')) add({ id: 'enoughShare', k: 'enough.atLevel.totalPct', kind: 'pct', pop: true });
    else if (r.onCourse !== true && has('payIn.needed') && r.payIn.needed > 0) add({ id: 'enough', k: 'payIn.needed', kind: 'money', pop: true });
    else add({ id: 'payInNow', k: 'payIn.now', kind: 'money', pop: true });
  } else if (q === 'c') {
    if (r.status === 'none') return [];
    // the three levels (7.8.0), the one the answer stands behind first
    for (const id of [r.level, ...LEVEL_IDS.filter((x) => x !== r.level)]) add({ id, k: `levels.${id}.monthly`, kind: 'money', ...(id === r.level ? { pop: true } : {}) });
  } else if (q === 'd') {
    const end = r.basis && r.basis.endAge;
    add({ id: 'take', k: 'spend.perMonth', kind: 'money', pop: true });
    if (r.status === 'ok') add({ id: 'could', k: `levels.${r.level}.monthly`, kind: 'money', ageKey: 'basis.endAge' });
    if (r.status === 'ok' && isNum(r.runOutAge) && isNum(end)) add(r.runOutAge < end ? { id: 'runsOut', k: 'runOutAge', kind: 'age' } : { id: 'lasts', k: 'basis.endAge', kind: 'age' });
  }
  return out;
}

/**
 * What the three figures count up to, as one key (FigureTiles remounts, and so counts, when it changes): the figures of the
 * result on screen. While a new answer is worked out the old result stays on screen and so does its key — nothing counts
 * on the old figures; when the new figures land, the key changes and they count up to their own value.
 */
export function tilesKey(state, q) {
  const r = resultOf(state, q);
  if (!r) return null;
  return answerTiles(state, q).map((t) => `${t.id}:${get(r, t.k)}`).join('|');
}

// ---- the pot over a life -------------------------------------------------------------------------------------------

/** The rising half: a pot that grows with what goes in, drawn through the two pots the answer gives (year by year). */
function rise(from, to, a, s) {
  const n = Math.max(1, Math.round(s - a));
  const g = 1.04;
  const den = g ** n - 1;
  const pts = [];
  for (let t = 0; t <= n; t++) pts.push({ age: a + ((s - a) * t) / n, value: from + (to - from) * ((g ** t - 1) / den) });
  return pts;
}
const round = (x) => Math.round(x);

/**
 * The pot over a life (README picture 2). B: the rising half — what paying in as now comes to and what would be enough,
 * each going on, faint, into its drawing half (falling to the age it runs out in a bad case, or to the end age), and the
 * bad case of paying in as now shaded. D: what is left over the years ahead at what you take — the bad case shaded, the
 * middling years a guide.
 * @returns {null | { q, from, to, top, ticks: number[], ages: number[], stop: number|null, lines, band, marks, rows, lasts }}
 *   lines: [{ id, role: 'pop'|'now'|'drawing', part?: 'drawing', guide?: true, points: [{ age, value }] }]
 *          part 'drawing': a line's faint drawing half (no legend entry of its own); guide: its end is not an answer's figure
 *   band:  { id, role, guide?, points } — shaded from nothing up to these points
 *   marks: [{ id, age, value }] — 'you' (you, today)
 *   rows:  [{ id, k?, kind?, slots }] — the table: each row names the answer's own figures
 *   lasts: the end age when a line drawn there is still above nothing (the money is still there; how much is not claimed)
 */
export function potPicture(state, q) {
  const r = resultOf(state, q);
  if (!r || !r.inputs || !r.basis) return null;
  if (q === 'b') return saverPicture(r);
  if (q === 'd') return drawingPicture(r);
  return null;
}

function saverPicture(r) {
  if (r.askedAbout === 'partner' || r.apart || !Array.isArray(r.saving) || !r.potAtStop || !r.potAtStop.now) return null;
  const a = r.inputs.you && r.inputs.you.age;
  const s = r.stop && r.stop.age;
  const end = r.basis.endAge;
  if (!isNum(a) || !isNum(s) || !isNum(end) || !(s > a) || !(end > s)) return null;
  const p0 = r.saving.reduce((t, p) => t + (p.potToday ? (p.potToday.pension || 0) + (p.potToday.savings || 0) : 0), 0);
  const now = r.potAtStop.now;
  if (!isNum(now.middling) || !isNum(now.careful)) return null;
  const needed = r.onCourse !== true && r.potAtStop.needed && isNum(r.potAtStop.needed.middling) ? r.potAtStop.needed : null;
  const outAt = (age) => (isNum(age) && age < end ? age : end);
  const nowOut = outAt(r.wholeLife && r.wholeLife.runOutAge);
  const enoughOut = outAt(r.enough && r.enough.atLevel && r.enough.atLevel.runOutAge);
  // one life per line: its rising half to the pot at the stop, then, faint, its drawing half down to the age the money runs
  // out in a bad case (or the end age) — the answer's own ages; the fall between is a guide
  const lines = [];
  if (needed) {
    lines.push({ id: 'enough', role: 'pop', points: rise(p0, needed.middling, a, s) });
    lines.push({ id: 'enough.drawing', role: 'pop', part: 'drawing', points: [{ age: s, value: needed.middling }, { age: enoughOut, value: 0 }] });
  }
  lines.push({ id: 'now', role: 'now', points: rise(p0, now.middling, a, s) });
  lines.push({ id: 'now.drawing', role: 'now', part: 'drawing', points: [{ age: s, value: now.middling }, { age: nowOut, value: 0 }] });
  const band = { id: 'bad', role: 'saving', points: [...rise(p0, now.careful, a, s), { age: nowOut, value: 0 }] };
  const pot = r.levels && r.levels[r.level] ? r.levels[r.level].pot : null;
  const aim = isNum(pot) && pot > 0 ? pot : null;
  const marks = [{ id: 'you', age: a, value: p0 }];
  const values = [p0, now.middling, now.careful, needed ? needed.middling : 0];
  // a little room above the highest figure, so no line or dot sits on the picture's top edge
  const top = roundTop(1.08 * Math.max(...values));
  const rows = [
    { id: 'today', slots: { age: a, pot: round(p0) } },
    { id: 'now', slots: { age: s, middling: round(now.middling), bad: round(now.careful) } },
    ...(needed ? [{ id: 'enough', slots: { age: s, middling: round(needed.middling), bad: round(needed.careful) } }] : []),
    ...(aim ? [{ id: 'aim', slots: { age: s, pot: aim } }] : []),
    nowOut < end ? { id: 'nowOut', slots: { age: nowOut } } : { id: 'nowLasts', slots: { age: end } }
  ];
  return { q: 'b', from: a, to: end, top, ticks: [top / 2, top], ages: ageTicks(a, s, end), stop: s, lines, band, marks, rows, lasts: null };
}

function drawingPicture(r) {
  if (r.status !== 'ok' || !r.levels || !Array.isArray(r.phases)) return null;
  const ins = r.inputs;
  const a = ins.you && ins.you.age;
  const end = r.basis.endAge;
  if (!isNum(a) || !isNum(end) || !(end > a)) return null;
  const p0 = (ins.you.pot || 0) + (ins.partner && ins.household === 'couple' ? ins.partner.pot || 0 : 0) + (ins.savings || 0);
  if (!(p0 > 0)) return null;
  const S = r.spend && r.spend.perMonth;
  // the level's amount for the bad case, and Bold's (the most of the three) for the guide line above it (7.8.0: the
  // count's middling amount is no longer a figure of the answer)
  const C = shownOf(r).monthly;
  const M = r.levels.bold.monthly;
  if (!isNum(S) || !isNum(C) || !isNum(M)) return null;
  const T = end - a;
  // The answer gives the pot today, and the age the money runs out in a bad case when it does; it gives no pot for the
  // years ahead. So only those are figures: the middling line, and the bad case when the money lasts, are guides placed
  // in proportion — at what you take against the amount that lasts exactly to the end age (the middling amount for the
  // middling years, the careful one for a bad case), with the pots paying what the answer's own phases say and growth
  // left aside. A guide's end is drawn, never written: the page says only that the money is still there.
  const drawn = r.phases.reduce((t, p) => t + (isNum(p.fromPots) ? p.fromPots : 0) * 12 * Math.max(0, (p.toAge || 0) - (p.fromAge || 0)), 0);
  const at = (X) => drawn + (X - S) * 12 * T;
  const endOf = (X) => {
    const dX = at(X);
    if (!(drawn > 0) || !(dX > 0)) return { age: end, value: p0 };
    if (drawn <= dX) return { age: end, value: Math.max(0, p0 * (1 - drawn / dX)) };
    return { age: a + (T * dX) / drawn, value: 0 };
  };
  const runsOut = isNum(r.runOutAge) && r.runOutAge < end;
  const mid = endOf(M);
  const bad = runsOut ? { age: r.runOutAge, value: 0 } : endOf(C);
  const start = { age: a, value: p0 };
  const top = roundTop(1.08 * p0);
  const rows = [
    { id: 'dToday', slots: { age: a, pot: round(p0) } },
    runsOut ? { id: 'dOut', slots: { age: r.runOutAge } } : { id: 'dLasts', slots: { age: end } },
    { id: 'dMiddling', slots: { amount: M, age: end } }
  ];
  const still = (p) => p.age >= end && p.value > 0;
  return {
    q: 'd', from: a, to: end, top, ticks: [top / 2, top], ages: ageTicks(a, null, end, runsOut ? r.runOutAge : null), stop: null,
    lines: [{ id: 'middling', role: 'drawing', guide: true, points: [start, mid] }],
    band: { id: 'bad', role: 'drawing', ...(runsOut ? {} : { guide: true }), points: [start, bad] },
    marks: [{ id: 'you', age: a, value: p0 }],
    rows,
    lasts: still(mid) || still(bad) ? end : null
  };
}

/** The ages written under a picture: today, the stop, the run-out age, the end — none closer than a few years to another. */
function ageTicks(a, s, end, extra = null) {
  const out = [a];
  const span = Math.max(1, end - a);
  const room = Math.max(3, Math.round(span / 8));
  for (const x of [s, extra, end]) {
    if (!isNum(x)) continue;
    const near = out.find((y) => Math.abs(y - x) < room);
    if (near === undefined) out.push(x);
    else if (x === end && near !== a) out[out.indexOf(near)] = x;
  }
  return out.sort((x, y) => x - y);
}
