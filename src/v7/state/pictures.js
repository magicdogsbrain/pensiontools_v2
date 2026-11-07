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
 *   potPicture(state, q)              the pot over a life for B (the rising half, the drawing half faint) and D (what is left)
 *
 * The pot picture is drawn to scale through the figures the answer gives — the pot today, the pot at the stop (middling and
 * in a bad case), the age the money runs out in a bad case — and nothing between them is claimed as a figure: the rising
 * half is drawn as a pot that grows with what goes in (a smooth curve between the two pots the answer gives), the drawing
 * half as a straight fall to the age it runs out. D's middling line ends where the answer's own band puts it: the
 * middling amount a month lasts to the end age in the middling futures, so at what you take the pot falls in proportion
 * to how much less (or more) that takes from it over the years. The table under each picture lists only the answer's figures.
 */

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

/**
 * The one control on an answer (the mock-up's slider): the box it moves and its range. It writes the same box the form
 * has (draft/set), so the answer is worked out again exactly as a typed change would be — the slider is a faster way to
 * type, nothing more. The range is set from the answer held, so it stays put while the slider moves:
 *   B  what goes in a month: your pounds (a total or your own part), or your share of pay — from nothing to well past
 *      what would be enough;
 *   C  what you would take a month ("What if I took…?", the try box) — from nothing to well past the good case;
 *   D  what you take a month — from nothing to well past what could be taken.
 * Null where there is no one box to move: B about your partner or with "I've already stopped", D with a spending level
 * chosen in place of an amount, an answer with nothing drawn on.
 * @returns {null | { q, path, min, max, step, value, unit: 'money'|'pct', words, slots, scale: number[] }}
 */
export function answerSlider(state, q) {
  const r = resultOf(state, q);
  if (!r || !r.inputs) return null;
  const d = draftOf(state, q);
  const ins = r.inputs;
  const money = (path, words, max, value, slots = {}) => {
    const top = roundTop(Math.max(max, 100));
    const step = top <= 2_000 ? 10 : top <= 10_000 ? 50 : 100;
    const v = isNum(value) ? Math.max(0, Math.min(top, value)) : 0;
    return { q, path, min: 0, max: top, step, value: v, unit: 'money', words, slots, scale: [0, top / 4, top / 2, (3 * top) / 4, top] };
  };
  if (q === 'b') {
    if (r.askedAbout === 'partner' || r.apart || r.status === 'guaranteed-only') return null;
    const p = ins.you && ins.you.payIn;
    if (!p) return null;
    const needed = r.payIn && isNum(r.payIn.needed) ? r.payIn.needed : 0;
    if (p.kind === 'share') {
      const own = typed(d['you.payIn.ownPct']) ?? p.ownPct;
      if (!isNum(own)) return null;
      const employer = isNum(p.employerPct) ? p.employerPct : 0;
      const top = Math.max(20, Math.ceil((own * 1.5) / 5) * 5);
      return { q, path: 'you.payIn.ownPct', min: 0, max: top, step: 0.5, value: Math.min(top, own), unit: 'pct', words: 'share',
        slots: { employer }, scale: [0, top / 4, top / 2, (3 * top) / 4, top] };
    }
    const path = p.kind === 'split' ? 'you.payIn.own' : 'you.payIn.total';
    const now = typed(d[path]) ?? (p.kind === 'split' ? p.own : p.total);
    const theirs = p.kind === 'split' && isNum(p.employer) ? p.employer : 0;
    return money(path, p.kind === 'split' ? 'own' : 'total', Math.max(2 * needed, 1.25 * (isNum(now) ? now : 0), 500), now, { employer: theirs });
  }
  if (q === 'c') {
    if (!r.monthly || !isNum(r.monthly.good) || r.status === 'none') return null;
    const take = typed(d.take);
    const value = take ?? (isNum(ins.take) ? ins.take : r.monthly.careful);
    return { ...money('take', 'take', 1.6 * r.monthly.good, value), set: take !== null || isNum(ins.take) };
  }
  if (q === 'd') {
    if (!ins.spend || ins.spend.kind !== 'amount' || !r.monthly || !isNum(r.monthly.good)) return null;
    const spend = typed(d['spend.amount']) ?? ins.spend.amount;
    return money('spend.amount', 'spend', Math.max(1.5 * r.monthly.good, 1.5 * (isNum(spend) ? spend : 0)), spend);
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
    add({ id: 'aim', k: 'number.careful', kind: 'pot', ageKey: 'stop.age' });
    add({ id: 'nowBad', k: 'potAtStop.now.careful', kind: 'pot', ageKey: 'stop.age' });
    if (r.onCourse !== true && r.enough && r.enough.how === 'share' && has('enough.nineInTen.totalPct')) add({ id: 'enoughShare', k: 'enough.nineInTen.totalPct', kind: 'pct', pop: true });
    else if (r.onCourse !== true && has('payIn.needed') && r.payIn.needed > 0) add({ id: 'enough', k: 'payIn.needed', kind: 'money', pop: true });
    else add({ id: 'payInNow', k: 'payIn.now', kind: 'money', pop: true });
  } else if (q === 'c') {
    if (r.status === 'none') return [];
    add({ id: 'careful', k: 'monthly.careful', kind: 'money', pop: true });
    add({ id: 'middling', k: 'monthly.middling', kind: 'money' });
    add({ id: 'good', k: 'monthly.good', kind: 'money' });
  } else if (q === 'd') {
    const end = r.basis && r.basis.endAge;
    add({ id: 'take', k: 'spend.perMonth', kind: 'money', pop: true });
    if (r.status === 'ok') add({ id: 'could', k: 'monthly.careful', kind: 'money', ageKey: 'basis.endAge' });
    if (r.status === 'ok' && isNum(r.runOutAge) && isNum(end)) add(r.runOutAge < end ? { id: 'runsOut', k: 'runOutAge', kind: 'age' } : { id: 'lasts', k: 'basis.endAge', kind: 'age' });
  }
  return out;
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
 * The pot over a life (README picture 2). B: the rising half — what paying in as now comes to (middling, and a bad case
 * shaded under it) and what would be enough — with the drawing half faint: each bad case falling to the age it runs out.
 * D: what is left over the years ahead at what you take — the middling years, and a bad case shaded.
 * @returns {null | { q, from, to, top, ticks: number[], ages: number[], stop: number|null, lines, band, marks, rows }}
 *   lines: [{ id, role: 'pop'|'now'|'faint'|'drawing', points: [{ age, value }] }]
 *   band:  { id, role, points } — shaded from nothing up to these points
 *   marks: [{ id, age, value }] — 'you' (you, today) and 'aim' (the pot to aim for)
 *   rows:  [{ id, k?, kind?, slots }] — the table: each row names the answer's own figures
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
  const lines = [];
  if (needed) lines.push({ id: 'enough', role: 'pop', points: rise(p0, needed.middling, a, s) });
  lines.push({ id: 'now', role: 'now', points: rise(p0, now.middling, a, s) });
  if (needed && isNum(needed.careful)) {
    const enoughOut = outAt(r.enough && r.enough.nineInTen && r.enough.nineInTen.runOutAge);
    lines.push({ id: 'enoughBad', role: 'faint', points: [{ age: s, value: needed.careful }, { age: enoughOut, value: 0 }] });
  }
  const band = { id: 'bad', role: 'saving', points: [...rise(p0, now.careful, a, s), { age: nowOut, value: 0 }] };
  const aim = r.number && isNum(r.number.careful) && r.number.careful > 0 ? r.number.careful : null;
  const marks = [{ id: 'you', age: a, value: p0 }];
  if (aim) marks.push({ id: 'aim', age: s, value: aim });
  const values = [p0, now.middling, now.careful, needed ? needed.middling : 0, aim || 0];
  // a little room above the highest figure, so no line or dot sits on the picture's top edge
  const top = roundTop(1.08 * Math.max(...values));
  const rows = [
    { id: 'today', slots: { age: a, pot: round(p0) } },
    { id: 'now', slots: { age: s, middling: round(now.middling), bad: round(now.careful) } },
    ...(needed ? [{ id: 'enough', slots: { age: s, middling: round(needed.middling), bad: round(needed.careful) } }] : []),
    ...(aim ? [{ id: 'aim', slots: { age: s, pot: aim } }] : []),
    nowOut < end ? { id: 'nowOut', slots: { age: nowOut } } : { id: 'nowLasts', slots: { age: end } }
  ];
  return { q: 'b', from: a, to: end, top, ticks: [top / 2, top], ages: ageTicks(a, s, end), stop: s, lines, band, marks, rows };
}

function drawingPicture(r) {
  if (r.status !== 'ok' || !r.monthly || !Array.isArray(r.phases)) return null;
  const ins = r.inputs;
  const a = ins.you && ins.you.age;
  const end = r.basis.endAge;
  if (!isNum(a) || !isNum(end) || !(end > a)) return null;
  const p0 = (ins.you.pot || 0) + (ins.partner && ins.household === 'couple' ? ins.partner.pot || 0 : 0) + (ins.savings || 0);
  if (!(p0 > 0)) return null;
  const S = r.spend && r.spend.perMonth;
  const { careful: C, middling: M } = r.monthly;
  if (!isNum(S) || !isNum(C) || !isNum(M)) return null;
  const T = end - a;
  // what the pots pay over the years at what you take (the answer's own phases), and at another amount a month: each
  // pound a month more after tax is taken from the pots too (tax left aside: this places a line, it is not a figure)
  const drawn = r.phases.reduce((t, p) => t + (isNum(p.fromPots) ? p.fromPots : 0) * 12 * Math.max(0, (p.toAge || 0) - (p.fromAge || 0)), 0);
  const at = (X) => drawn + (X - S) * 12 * T;
  /** Where a line ends: the pot left at the end age, or the age it runs out, for an amount that lasts exactly to the end. */
  const endOf = (X) => {
    const dX = at(X);
    if (!(drawn > 0) || !(dX > 0)) return { age: end, value: p0 };
    if (drawn <= dX) return { age: end, value: Math.max(0, p0 * (1 - drawn / dX)) };
    return { age: a + (T * dX) / drawn, value: 0 };
  };
  const mid = endOf(M);
  const bad = isNum(r.runOutAge) && r.runOutAge < end ? { age: r.runOutAge, value: 0 } : endOf(C);
  const start = { age: a, value: p0 };
  const top = roundTop(1.08 * p0);
  const rows = [
    { id: 'dToday', slots: { age: a, pot: round(p0) } },
    isNum(r.runOutAge) && r.runOutAge < end ? { id: 'dOut', slots: { age: r.runOutAge } } : { id: 'dLasts', slots: { age: end } },
    { id: 'dMiddling', slots: { amount: M, age: end } }
  ];
  return {
    q: 'd', from: a, to: end, top, ticks: [top / 2, top], ages: ageTicks(a, null, end, isNum(r.runOutAge) && r.runOutAge < end ? r.runOutAge : null), stop: null,
    lines: [{ id: 'middling', role: 'drawing', points: [start, mid] }],
    band: { id: 'bad', role: 'drawing', points: [start, bad] },
    marks: [{ id: 'you', age: a, value: p0 }],
    rows
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
