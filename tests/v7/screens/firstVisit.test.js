/**
 * The first visit (7.5.0; research/v7/mockups/first-visit.html and its README): the stranger's front door and its three
 * doors, the page around B's, C's and D's answers (the slider, the three figures, the Keep line), and the three pictures —
 * the life line, the pot over a life, the record keeper's year — each drawn from the person's own figures, to scale, the
 * bad case shaded, its final frame complete with no motion. Every state here is a real one (tests/v7/states), every figure
 * the answer's own.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { renderScreen } from '../c/_c.js';
import { checkScreen, draw, bannedHits, visibleText } from '../render/checkScreen.js';
import { App } from '../../../src/v7/App.jsx';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { potPicture, answerSlider, answerTiles, tilesKey, roundTop, LIFE_EXAMPLE, lifeStages, guestView, frontWaiting, readyMark } from '../../../src/v7/state/select.js';
import { markReady } from '../../../src/v7/effects/index.js';
import { HeldAnswer, AT_LEAST_MS } from '../../../src/v7/components/Spinner.jsx';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { SCHEMA_D } from '../../../src/answers/d/schema.js';
import { countUp } from '../../../src/v7/components/motion.js';
import { PICTURE } from '../../../src/v7/copy/picture.js';
import { FRONT } from '../../../src/v7/copy/common.js';
import { parse } from '../../../src/v7/router/routes.js';

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const clone = (o) => JSON.parse(JSON.stringify(o));
const VW = 1000;
const VH = 300;
/** The last point of an SVG path written as M x y L x y … */
const lastPoint = (d) => { const n = d.trim().split(/[ML]/).filter(Boolean).pop().trim().split(/\s+/).map(Number); return { x: n[0], y: n[1] }; };
const firstPoint = (d) => { const n = d.trim().split(/[ML]/).filter(Boolean)[0].trim().split(/\s+/).map(Number); return { x: n[0], y: n[1] }; };

function strings(obj, path = '', out = []) {
  if (typeof obj === 'string') out.push([path, obj]);
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) strings(v, path ? `${path}.${k}` : k, out);
  return out;
}

describe('the stranger\'s front door: three doors, each opening its question\'s quickest form', () => {
  const state = load('c', 'front-door');
  const root = renderScreen(state);
  it('Still saving opens B\'s numbers, Stopping soon takes C\'s first number in the door, Already retired opens D\'s numbers', () => {
    expect(one(root, 'front.q.b').getAttribute('href')).toBe('#/b/numbers');
    expect(one(root, 'front.q.d').getAttribute('href')).toBe('#/d/numbers');
    expect(one(root, 'front.q.c').querySelector('[data-testid="front.c.pot"]').tagName).toBe('INPUT');
    expect(one(root, 'front.c.show').getAttribute('href')).toBe('#/c/numbers?focus=you.age');
    expect(one(root, 'front.q.a').getAttribute('href')).toBe('#/a/numbers');
    expect(one(root, 'front.q.e').getAttribute('href')).toBe('#/plans');
    expect(one(root, 'front.q.f').getAttribute('href')).toBe('#/soon/f');
  });
  it('three equal doors and no pink button (the one pink is the headline\'s word); the life line as the explainer with no figure on it, and the words of the front door', () => {
    expect(root.querySelectorAll('main .btn-pop')).toHaveLength(0);
    expect(root.querySelectorAll('main .front-title em')).toHaveLength(1);
    // "Show me" in C's door is drawn in the door's own colour, as the other doors' "Start here"
    expect(one(root, 'front.c.show').classList.contains('door-show')).toBe(true);
    // the site's line is not drawn again above a headline that says it (fidelity review, 7.5.0)
    expect(one(root, 'front.tagline')).toBe(null);
    const life = one(root, 'front.life');
    expect([...life.querySelectorAll('[data-stage]')].map((s) => s.getAttribute('data-stage'))).toEqual(['saving', 'moving', 'drawing']);
    expect(life.querySelector('[data-value]')).toBe(null);
    expect(life.textContent).not.toMatch(/\d/);
    expect(checkScreen(root, state)).toEqual([]);
    const hits = bannedHits(visibleText(root), ['all', 'first', 'front']);
    expect(hits).toEqual([]);
    expect(visibleText(root.querySelector('main')).replace(/PensionTools/g, '')).not.toMatch(/\b(tools?|planner|calculator|tester)\b/i);
  });
  it('the life explainer is a shape only: from 0 to 1 across, the three stages covering the life end to end', () => {
    expect(LIFE_EXAMPLE.stages.map((s) => s.key)).toEqual(['saving', 'moving', 'drawing']);
    expect(LIFE_EXAMPLE.stages[0].from).toBe(0);
    expect(LIFE_EXAMPLE.stages[2].to).toBe(1);
    for (let i = 1; i < 3; i++) expect(LIFE_EXAMPLE.stages[i].from).toBe(LIFE_EXAMPLE.stages[i - 1].to);
    expect(LIFE_EXAMPLE.points[0][0]).toBe(0);
    expect(LIFE_EXAMPLE.points[LIFE_EXAMPLE.points.length - 1][0]).toBe(1);
  });
});

describe('no limit on the questions without an account (7.5.0)', () => {
  it('a visitor whose free hours are used up meets no stop and no reminder on the front door, any question or its Keep step; the plan pages keep both', () => {
    let s = initialState({ today: '2026-11-07', build: 'test' });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    s = reduce(s, { type: A.GUEST_TICK, minutes: 200, usedUp: true, nag: { level: 4, left: 0 } });
    for (const address of ['#/', '#/b/numbers', '#/b/answer', '#/c/answer', '#/d/answer', '#/d/keep', '#/a/ages']) {
      const at = reduce(s, { type: A.ROUTE_SET, route: parse(address) });
      expect(guestView(at), address).toMatchObject({ stop: false, nag: null });
      const root = renderScreen(at);
      expect(one(root, 'guest.stop'), address).toBe(null);
      expect(one(root, 'guest.remindBox'), address).toBe(null);
    }
    expect(guestView(reduce(s, { type: A.ROUTE_SET, route: parse('#/plans') }))).toMatchObject({ stop: true });
  });
});

describe('the pot over a life (B): to scale, through the answer\'s own figures, the bad case shaded', () => {
  const state = load('b', 'answer-B1');
  const r = state.answers.b.result;
  const P = potPicture(state, 'b');
  it('starts at the pot today at today\'s age, and meets the answer\'s pots at the stop and its run-out age', () => {
    const p0 = r.saving.reduce((t, p) => t + p.potToday.pension + p.potToday.savings, 0);
    expect(P.from).toBe(r.inputs.you.age);
    expect(P.to).toBe(r.basis.endAge);
    expect(P.stop).toBe(r.stop.age);
    const now = P.lines.find((l) => l.id === 'now');
    expect(now.points[0]).toEqual({ age: r.inputs.you.age, value: p0 });
    expect(now.points[now.points.length - 1]).toEqual({ age: r.stop.age, value: r.potAtStop.now.middling });
    const enough = P.lines.find((l) => l.id === 'enough');
    expect(enough.points[enough.points.length - 1]).toEqual({ age: r.stop.age, value: r.potAtStop.needed.middling });
    const band = P.band.points;
    expect(band.find((p) => p.age === r.stop.age).value).toBe(r.potAtStop.now.careful);
    expect(band[band.length - 1]).toEqual({ age: Math.min(r.wholeLife.runOutAge, r.basis.endAge), value: 0 });
    expect(P.marks).toEqual([{ id: 'you', age: r.inputs.you.age, value: p0 }]);
  });
  it('each line is one life: its faint drawing half starts where its rising half ends and falls to the age the answer gives (run out in a bad case, or the end age)', () => {
    const end = r.basis.endAge;
    const out = (age) => (age < end ? age : end);
    const halves = { now: out(r.wholeLife.runOutAge), enough: out(r.enough.nineInTen.runOutAge) };
    for (const [id, age] of Object.entries(halves)) {
      const rising = P.lines.find((l) => l.id === id);
      const half = P.lines.find((l) => l.id === `${id}.drawing`);
      expect(half.part).toBe('drawing');
      expect(half.role).toBe(rising.role);
      expect(half.points[0]).toEqual(rising.points[rising.points.length - 1]);
      expect(half.points[half.points.length - 1]).toEqual({ age, value: 0 });
    }
    // the bad case is the band, not another line; and no line of its own for "enough, in a bad case"
    expect(P.lines.map((l) => l.id)).toEqual(['enough', 'enough.drawing', 'now', 'now.drawing']);
    const root = renderScreen(state);
    const legend = [...one(root, 'b.pot.legend').querySelectorAll('li')].map((li) => li.getAttribute('data-series'));
    expect(legend).toEqual(['enough', 'now', 'bad', 'you']);
    // a drawing half's end is drawn, never written as a figure on the page
    for (const id of ['enough.drawing', 'now.drawing']) {
      const path = one(root, 'b.pot').querySelector(`path[data-series="${id}"]`);
      expect(path.hasAttribute('data-end-value')).toBe(false);
      expect(path.getAttribute('data-end')).toBe('guide');
    }
  });
  it('the scale is a round figure above every value drawn, and every line rises while saving', () => {
    const all = [...P.lines.flatMap((l) => l.points), ...P.band.points, ...P.marks].map((p) => p.value);
    expect(P.top).toBeGreaterThanOrEqual(Math.max(...all));
    expect(P.top).toBe(roundTop(P.top));
    for (const l of P.lines.filter((x) => !x.part)) for (let i = 1; i < l.points.length; i++) expect(l.points[i].value).toBeGreaterThanOrEqual(l.points[i - 1].value);
  });
  it('drawn: each path ends where its figure puts it on a linear scale; the bad case shaded, a legend for every series, a table of figures', () => {
    const root = renderScreen(state);
    const fig = one(root, 'b.pot');
    expect(fig).not.toBe(null);
    const x = (age) => ((age - P.from) / (P.to - P.from)) * VW;
    const y = (v) => VH - (v / P.top) * VH;
    for (const l of P.lines) {
      const path = fig.querySelector(`path[data-series="${l.id}"]`);
      const end = lastPoint(path.getAttribute('d'));
      const want = l.points[l.points.length - 1];
      expect(end.x).toBeCloseTo(x(want.age), 0);
      expect(end.y).toBeCloseTo(y(want.value), 0);
    }
    const band = fig.querySelector('path.pot-band');
    expect(band.getAttribute('data-series')).toBe('bad');
    expect(band.getAttribute('d')).toMatch(/Z$/);
    expect(firstPoint(band.getAttribute('d')).y).toBeCloseTo(y(P.band.points[0].value), 0);
    const legend = [...one(root, 'b.pot.legend').querySelectorAll('li')].map((li) => li.getAttribute('data-series'));
    expect(legend).toEqual(['enough', 'now', 'bad', 'you']);
    expect(legend.length).toBeGreaterThanOrEqual(2);
    const you = fig.querySelector('[data-mark="you"]');
    expect(you.getAttribute('style')).toMatch(/left: ?0%/);
    expect(fig.getAttribute('aria-labelledby')).toBeTruthy();
    // a <figure> is a figure: no role over it (axe: aria-allowed-role)
    expect(fig.hasAttribute('role')).toBe(false);
    expect(fig.querySelector('figcaption .sr-only').textContent.length).toBeGreaterThan(20);
    const rows = [...one(root, 'b.pot.table').querySelectorAll('li')].map((li) => li.textContent);
    expect(rows[0]).toMatch(/^Today, at \d+: £[\d,]+\.$/);
    expect(rows.join(' ')).toContain(`£${r.number.careful.toLocaleString('en-GB')}`);
  });
  it('the final frame is drawn complete: every line has its whole shape in the page before any motion, and the motion is CSS that less motion switches off', () => {
    const root = renderScreen(state);
    for (const path of root.querySelectorAll('.pot-svg path')) {
      expect(path.getAttribute('d')).toMatch(/^M[\d.]+ [\d.]+( L[\d.]+ [\d.]+)+( Z)?/);
    }
    const base = readFileSync(join(process.cwd(), 'src/v7/styles/base.css'), 'utf8');
    expect(base).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\*, \*::before, \*::after \{ animation: none !important; transition: none !important;/);
    const css = readFileSync(join(process.cwd(), 'src/v7/styles/components.css'), 'utf8');
    // every animation of the pictures runs under a second
    for (const m of css.matchAll(/\.(pot|life)[a-z-]*[^{]*\{[^}]*animation:\s*[a-z-]+\s+([\d.]+)s(?:\s+([\d.]+)s)?/g)) expect(Number(m[2]) + Number(m[3] || 0), m[0]).toBeLessThan(1);
  });
  it('another future is never drawn for a partner\'s answer or with no pot to aim for', () => {
    const s = clone(state);
    s.answers.b.result.askedAbout = 'partner';
    expect(potPicture(s, 'b')).toBe(null);
  });
});

describe('the pot over a life (D): what is left over the years ahead', () => {
  it.each(['answer-D1', 'answer-no', 'answer-yes', 'answer-D2-couple'])('%s: from the pot today, the bad case ending at its run-out age (or the end age), shaded', (name) => {
    const state = load('d', name);
    const r = state.answers.d.result;
    const P = potPicture(state, 'd');
    expect(P).not.toBe(null);
    const p0 = r.inputs.you.pot + (r.inputs.household === 'couple' ? r.inputs.partner.pot : 0) + r.inputs.savings;
    expect(P.band.points[0]).toEqual({ age: r.inputs.you.age, value: p0 });
    const end = P.band.points[P.band.points.length - 1];
    if (r.runOutAge < r.basis.endAge) expect(end).toEqual({ age: r.runOutAge, value: 0 });
    else expect(end.age).toBe(r.basis.endAge);
    expect(P.top).toBeGreaterThanOrEqual(p0);
    const root = renderScreen(state);
    expect(one(root, 'd.pot').querySelector('path.pot-band.is-drawing')).not.toBe(null);
    expect(checkScreen(root, state)).toEqual([]);
    // the answer gives no pot for the years ahead: the middling line is a guide, its end drawn and never written; the bad case
    // ends at a figure only when the money runs out; "still there at …" says it lasts, never how much
    const mid = one(root, 'd.pot').querySelector('path[data-series="middling"]');
    expect(mid.classList.contains('is-guide')).toBe(true);
    expect(mid.hasAttribute('data-end-value')).toBe(false);
    expect(P.band.guide === true).toBe(!(r.runOutAge < r.basis.endAge));
    const lasting = (p) => p.age >= r.basis.endAge && p.value > 0;
    const lasts = lasting(P.lines[0].points.at(-1)) || lasting(end);
    expect(P.lasts).toBe(lasts ? r.basis.endAge : null);
    expect(one(root, 'd.pot.lasts') !== null).toBe(lasts);
    if (lasts) expect(one(root, 'd.pot.lasts').textContent).toContain(`still there at ${r.basis.endAge}`);
    expect(one(root, 'd.pot').querySelector('.pot-note').textContent).toBe(PICTURE.pot.noteD);
  });
  it('no picture with nothing to draw on (the pensions alone)', () => {
    expect(potPicture(load('d', 'answer-pensions-only'), 'd')).toBe(null);
  });
});

describe('the page around an answer: the slider, the three figures, the Keep line', () => {
  it('B: the slider moves the box the form has — what goes in a month — keyboard-reachable, labelled, its range stable from the answer held', () => {
    const state = load('b', 'answer-B1');
    const S = answerSlider(state, 'b');
    expect(S.path).toBe(`you.payIn.${state.answers.b.result.inputs.you.payIn.kind === 'split' ? 'own' : 'total'}`);
    expect(S.max).toBeGreaterThanOrEqual(state.answers.b.result.payIn.needed);
    const { root, actions } = draw(state);
    const input = one(root, 'b.slider.input');
    expect(input.type).toBe('range');
    expect(root.querySelector(`label[for="${input.id}"]`).textContent).toContain(PICTURE.slider[S.words].split(' (')[0]);
    expect(input.getAttribute('aria-valuetext')).toMatch(/^£[\d,]+$/);
    input.value = String(S.max / 2);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    // the slider sends the range it was drawn with, so the range is held while it moves (state/reduce.js withSliderHold)
    expect(actions.at(-1)).toEqual({ type: 'draft/set', q: 'b', path: S.path, value: (S.max / 2).toLocaleString('en-GB'), hold: { min: S.min, max: S.max, step: S.step } });
    // the figure beside the label is for the eye only: the slider's name does not change as it moves
    expect(root.querySelector(`label[for="${input.id}"]`).textContent).not.toMatch(/£/);
    expect(one(root, 'b.slider.value').getAttribute('aria-hidden')).toBe('true');
  });
  it('C: "What if you took…?" writes the try box; D: what you take writes the spending', () => {
    const c = load('c', 'answer-F1');
    expect(answerSlider(c, 'c')).toMatchObject({ path: 'take', unit: 'money' });
    expect(answerSlider(c, 'c').value).toBe(c.answers.c.result.monthly.careful);
    const d = load('d', 'answer-D1');
    expect(answerSlider(d, 'd')).toMatchObject({ path: 'spend.amount', value: d.answers.d.result.spend.perMonth });
  });
  it.each([['b', 'answer-B1'], ['c', 'answer-F1'], ['d', 'answer-D1']])('%s %s: three figures, each the answer\'s own (Money), the first in pink; the Keep line goes to the Keep step', (q, name) => {
    const state = load(q, name);
    const tiles = answerTiles(state, q);
    expect(tiles).toHaveLength(3);
    expect(tiles.filter((t) => t.pop)).toHaveLength(1);
    const root = renderScreen(state);
    const drawn = [...one(root, `${q}.tiles`).querySelectorAll('.fig-n')];
    expect(drawn.map((el) => el.getAttribute('data-key'))).toEqual(tiles.map((t) => t.k));
    expect(one(root, `${q}.keepLine.keep`).getAttribute('href')).toBe(`#/${q}/keep`);
    expect(one(root, `${q}.keepLine`).textContent).toContain(PICTURE.keep.line);
  });
  it('a figure counts up without its words ever changing: the count is drawn over it, and with less motion nothing moves', () => {
    const root = document.createElement('div');
    root.innerHTML = '<span data-kind="money" data-value="1650" data-key="x">£1,650</span>';
    const frames = [];
    const was = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = (fn) => { frames.push(fn); return frames.length; };
    try {
      countUp(root, { ms: 100 });
      const el = root.firstChild;
      expect(el.textContent).toBe('£1,650');
      expect(el.classList.contains('is-counting')).toBe(true);
      document.body.appendChild(root);
      frames.shift()(0); frames.shift()(50);
      expect(el.textContent).toBe('£1,650');
      expect(el.getAttribute('data-count')).toMatch(/^£[\d,]+$/);
      frames.shift()(200);
      expect(el.classList.contains('is-counting')).toBe(false);
      expect(el.hasAttribute('data-count')).toBe(false);
    } finally { globalThis.requestAnimationFrame = was; root.remove(); }
    const mm = window.matchMedia;
    window.matchMedia = () => ({ matches: true });
    try {
      const r2 = document.createElement('div');
      r2.innerHTML = '<span data-kind="money" data-value="1650">£1,650</span>';
      countUp(r2);
      expect(r2.firstChild.classList.contains('is-counting')).toBe(false);
    } finally { window.matchMedia = mm; }
  });
});

describe('the slider never runs away and never writes a figure its box refuses (review of 7.5.0)', () => {
  const SCHEMA = { b: SCHEMA_B, c: SCHEMA_C, d: SCHEMA_D };
  /** Moves the slider as a person does: draft/set with the range it was drawn with, and the answer at the new figure lands. */
  const slide = (state, q, value) => {
    const S = answerSlider(state, q);
    const text = S.unit === 'pct' ? String(value) : Math.round(value).toLocaleString('en-GB');
    return reduce(state, { type: A.DRAFT_SET, q, path: S.path, value: text, hold: { min: S.min, max: S.max, step: S.step } });
  };
  /** The answer as if it had been worked out again for what the slider wrote (the figure moved into the result's inputs). */
  const landed = (state, q) => {
    const s = clone(state);
    const S = answerSlider(s, q);
    const v = Number(String(s.draft[q].values[S.path]).replace(/[£,]/g, ''));
    const ins = s.answers[q].result.inputs;
    if (q === 'd') { ins.spend.amount = v; s.answers[q].result.spend.perMonth = v; }
    if (q === 'b') { const p = ins.you.payIn; if (S.path.endsWith('ownPct')) p.ownPct = v; else if (S.path.endsWith('.own')) p.own = v; else p.total = v; }
    if (q === 'c') ins.take = v;
    return s;
  };
  const errorsAt = (state, q) => parseDraft(SCHEMA[q], state.draft[q].values, { today: state.env.today }).errors;
  it.each([['b', 'answer-B1'], ['c', 'answer-F1'], ['d', 'answer-D1']])('%s %s: dragged to the right end twice, and to the left end twice, the range stays put and the form takes every figure', (q, name) => {
    let state = load(q, name);
    const S0 = answerSlider(state, q);
    for (const end of ['max', 'max', 'min', 'min', 'max']) {
      state = landed(slide(state, q, answerSlider(state, q)[end]), q);
      const S = answerSlider(state, q);
      expect([S.min, S.max, S.step]).toEqual([S0.min, S0.max, S0.step]);
      expect(S.value).toBe(S0[end]);
      expect(errorsAt(state, q), `${q} at the ${end}`).toEqual({});
    }
  });
  it('the range lets go once something is typed in the box, and fits the typed figure', () => {
    let state = load('d', 'answer-D1');
    const S0 = answerSlider(state, 'd');
    state = slide(state, 'd', S0.max);
    expect(state.ui.slider).toEqual({ q: 'd', path: 'spend.amount', min: S0.min, max: S0.max, step: S0.step });
    state = reduce(state, { type: A.DRAFT_SET, q: 'd', path: 'spend.amount', value: String(S0.max * 2) });
    expect(state.ui.slider).toBe(null);
    expect(answerSlider(state, 'd').max).toBeGreaterThanOrEqual(S0.max * 2);
  });
  it('each end is inside the box\'s own limits: D starts at its least amount, never £0; B stops where both parts together reach what one person can pay in', () => {
    const d = answerSlider(load('d', 'answer-D1'), 'd');
    const least = SCHEMA_D.fields.find((f) => f.path === 'spend.amount').min;
    expect(d.min).toBeGreaterThanOrEqual(least);
    expect(d.min % d.step).toBe(0);
    expect(d.scale[0]).toBe(d.min);
    // B1 pays in a split: the slider's top for your own part leaves room for the employer's within the one-person limit
    const s = clone(load('b', 'answer-B1'));
    const p = s.answers.b.result.inputs.you.payIn;
    expect(p.kind).toBe('split');
    s.answers.b.result.payIn.needed = 9_000;
    const ceiling = SCHEMA_B.fields.find((f) => f.path === 'you.payIn.total').max;
    const b = answerSlider(s, 'b');
    expect(b.max).toBe(ceiling - p.employer);
    const at = slide(s, 'b', b.max);
    expect(errorsAt(at, 'b')).toEqual({});
  });
  it('C\'s first value is the answer\'s own amount, on the track exactly (no £1,410 shown over a thumb at £1,400)', () => {
    const c = load('c', 'answer-F1');
    const S = answerSlider(c, 'c');
    expect(S.value % S.step).toBe(0);
    expect(S.value).toBe(c.answers.c.result.monthly.careful);
  });
});

describe('the figures count up to the result on screen, never to one being worked out (review of 7.5.0)', () => {
  it('the key stays while the old result is on screen, and changes when the new figures land', () => {
    const state = load('d', 'answer-D1');
    const k0 = tilesKey(state, 'd');
    expect(k0).toContain(String(state.answers.d.result.spend.perMonth));
    const working = clone(state);
    working.answers.d.status = 'working';
    working.answers.d.inputsKey = 'something else';
    expect(tilesKey(working, 'd')).toBe(k0);
    const landed = clone(state);
    landed.answers.d.result.spend.perMonth += 100;
    expect(tilesKey(landed, 'd')).not.toBe(k0);
  });
});

describe('the front door in a browser where someone is signed in waits for the session (review of 7.5.0)', () => {
  const front = (session, hint, plans = null) => {
    let s = reduce(initialState({ today: '2026-11-07', build: 'test' }), { type: A.ROUTE_SET, route: parse('#/') });
    if (hint) s = reduce(s, { type: A.ENV_SET, patch: { signedInHint: true } });
    if (session !== 'none') s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'alex@example.com' : null } });
    if (plans === 'failed') s = reduce(s, { type: A.PLANS_FAILED });
    return s;
  };
  it.each([['none', true, 'waiting'], ['checking', true, 'waiting'], ['nobody', true, 'stranger'], ['none', false, 'stranger'], ['checking', false, 'stranger']])('session %s, the note %s: %s', (session, hint, door) => {
    const s = front(session, hint);
    expect(frontWaiting(s)).toBe(door === 'waiting');
    const root = renderScreen(s);
    expect(root.querySelector('[data-front]').getAttribute('data-front')).toBe(door);
    expect(readyMark(s).ready).toBe(door === 'waiting' ? '0' : '1');
    if (door === 'waiting') {
      expect(root.querySelectorAll('[data-door]')).toHaveLength(0);
      expect(one(root, 'front.waiting').textContent).toBe(FRONT.waiting.line);
    }
  });
  it('signed in: the signed-in front door; the plans failing to load: the stranger\'s, never a wait for ever', () => {
    expect(renderScreen(front('in', true)).querySelector('[data-front]')).toBe(null);
    expect(frontWaiting(front('checking', true, 'failed'))).toBe(false);
  });
});

describe('the first answer waits behind the ring for its least time, and the page is not ready until it shows (review of 7.5.0)', () => {
  it('HeldAnswer holds the answer AT_LEAST_MS once the ring was seen, marks the hold on the page and says when it ends', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const events = [];
    root.addEventListener('pt:held', () => events.push('held'));
    const ui = (busy) => h(HeldAnswer, { busy, working: h('p', { id: 'ring' }, 'ring') }, busy ? null : h('p', { id: 'answer' }, 'answer'));
    const flush = () => new Promise((r) => setTimeout(r, 0));
    try {
      render(ui(true), root); await flush();
      expect(root.querySelector('#ring')).not.toBe(null);
      render(ui(false), root); await flush();
      expect(root.querySelector('#ring')).not.toBe(null);
      expect(root.querySelector('[data-holding="1"]')).not.toBe(null);
      await new Promise((r) => setTimeout(r, AT_LEAST_MS + 50)); await flush(); await flush();
      expect(root.querySelector('#answer')).not.toBe(null);
      expect(root.querySelector('[data-holding="1"]')).toBe(null);
      expect(events).toEqual(['held']);
      // a page opened on an answer is never held
      const r2 = document.createElement('div');
      render(ui(false), r2); await flush();
      expect(r2.querySelector('#answer')).not.toBe(null);
    } finally { render(null, root); root.remove(); }
  });
  it('the page\'s ready mark says not ready while the hold shows', () => {
    const state = load('d', 'answer-D1');
    const root = document.createElement('div');
    root.innerHTML = '<div data-holding="1"></div>';
    markReady(root, state);
    expect(root.getAttribute('data-ready')).toBe('0');
    root.innerHTML = '<div></div>';
    markReady(root, state);
    expect(root.getAttribute('data-ready')).toBe('1');
  });
});

describe('the style sheet, as the README has it (review of 7.5.0)', () => {
  const css = readFileSync(join(process.cwd(), 'src/v7/styles/components.css'), 'utf8');
  it('a verdict\'s words are in the text colour and the display face; green, amber and red are its edge only', () => {
    expect(css).toMatch(/\.verdict \.figure \{[^}]*color: var\(--text\);[^}]*font-family: var\(--font-display\)/);
    expect(css).not.toMatch(/\.verdict\.is-(yes|close|no) \.figure/);
  });
  it('the reveal ends clipping nothing a still frame shows (a line\'s round end past the box included)', () => {
    const kf = css.match(/@keyframes pot-reveal \{[^\n]*\}/)[0];
    expect(kf).toMatch(/to \{ clip-path: inset\(-\d+px -\d+px -\d+px -\d+px\); \}/);
  });
  it('the count drawn over a figure is for the eye only (its alternative text is empty)', () => {
    expect(css).toMatch(/\.is-counting::after \{ content: attr\(data-count\); content: attr\(data-count\) \/ '';/);
  });
  it('figures in JetBrains Mono ask only for the weight the site ships (no drawn-on bold)', () => {
    const fonts = readFileSync(join(process.cwd(), 'src/v7/styles/fonts.css'), 'utf8');
    const shipped = fonts.match(/'JetBrains Mono';[^}]*font-weight: (\d+);/)[1];
    for (const m of css.matchAll(/font: (\d+) [^;]*var\(--font-mono\)/g)) expect(m[1]).toBe(shipped);
  });
  it('a phone: the tiles two to a row, a third alone across the whole row', () => {
    expect(css).toMatch(/@media \(max-width: 559px\) \{\s*\.fig-tiles \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}\s*\.fig-tile:last-child:nth-child\(odd\) \{ grid-column: 1 \/ -1; \}/);
  });
  it('the headline and body faces are asked for at once (preloaded), and from the site itself', () => {
    const html = readFileSync(join(process.cwd(), 'v7/index.html'), 'utf8');
    for (const f of ['fraunces-latin', 'nunito-latin']) expect(html).toMatch(new RegExp(`<link rel="preload" href="\\.\\./src/v7/styles/fonts/${f}\\.woff2" as="font" type="font/woff2" crossorigin>`));
  });
});

describe('the life line on a plan\'s home and the record keeper\'s year', () => {
  const DIR = join(process.cwd(), 'tests/v7/states/plan');
  function home(name) {
    const stored = JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
    let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
    state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
    const root = document.createElement('div');
    render(h(App, { state, dispatch: () => {} }), root);
    return { state, root };
  }
  it.each(['home-saving', 'home-moving', 'home-drawing'])('%s: three segments, "you are here" — the dot — on the stage the plan is in, and only there', (name) => {
    const { root } = home(name);
    const strip = one(root, 'plan.home.strip');
    expect(strip.classList.contains('life-line')).toBe(true);
    const segs = [...strip.querySelectorAll('.strip-seg')];
    expect(segs.map((s) => s.className.split(' ')[1])).toEqual(['is-saving', 'is-moving', 'is-drawing']);
    expect(strip.querySelectorAll('.strip-dot')).toHaveLength(1);
    const here = strip.querySelector('[aria-current="step"]').getAttribute('data-stage');
    expect(segs.find((s) => s.querySelector('.strip-dot')).classList.contains(`is-${here}`)).toBe(true);
    expect(root.querySelector('[data-testid="plan.home"]').getAttribute('data-stage')).toBe(here);
  });
  it('lifeStages keeps each stage, its state and a part-held share; nothing else', () => {
    expect(lifeStages([{ key: 'saving', state: 'done', month: 'Jun 2026' }, { key: 'moving', state: 'part', held: 40 }, { key: 'drawing', state: 'now' }]))
      .toEqual([{ key: 'saving', state: 'done', month: 'Jun 2026', held: null }, { key: 'moving', state: 'part', month: null, held: 40 }, { key: 'drawing', state: 'now', month: null, held: null }]);
    expect(lifeStages(null)).toEqual([]);
  });
  it('home-drawing: the year — twelve cells April to March, a bar for each month drawn and the plan\'s dashed line, to one scale; the due month ringed', () => {
    const { state, root } = home('home-drawing');
    const Y = state.plans.view && root.querySelector('[data-testid="plan.home.year"]');
    expect(Y).not.toBe(null);
    const cells = [...Y.querySelectorAll('.year-cell')];
    expect(cells).toHaveLength(12);
    expect(cells[0].getAttribute('data-month').slice(5)).toBe('04');
    expect(cells[11].getAttribute('data-month').slice(5)).toBe('03');
    const states = new Set(cells.map((c) => c.getAttribute('data-state')));
    for (const s of states) expect(['recorded', 'filled', 'due', 'setUp', 'later', 'missed', 'before', 'empty', 'future', 'open']).toContain(s);
    for (const c of cells.filter((x) => x.getAttribute('data-state') === 'recorded')) {
      expect(c.querySelector('.year-bar').getAttribute('style')).toMatch(/height: ?\d+(\.\d+)?%/);
      expect(c.querySelector('.year-plan')).not.toBe(null);
    }
    expect([...Y.querySelectorAll('.year-legend li')]).toHaveLength(5);
  });
});

describe('the words', () => {
  it('the pictures\' words pass the banned list wherever they are shown — the questions\' first answers, a result — and "bad case" is always explained', () => {
    const hits = [];
    const all = strings(PICTURE).map(([, s]) => s).join('\n');
    for (const [where, s] of strings(PICTURE)) {
      const t = s.replace(/\{(age)\}/g, '65').replace(/\{(pot|middling|bad|amount)\}/g, '£250,000').replace(/\{employer\}/g, '3');
      for (const hit of bannedHits(t, ['all', 'first', 'result', 'saver', 'retired'], { context: all })) hits.push(`${where}: ${hit}`);
    }
    expect(hits).toEqual([]);
    for (const [where, s] of strings(PICTURE)) if (/bad case/i.test(s) && where.startsWith('tiles')) expect(s, where).toMatch(/the worst 1 in 10/);
  });
  it('the stranger\'s front door says no "tool", "planner", "calculator" or "tester", and never asks for an account', () => {
    const text = strings(FRONT.stranger).map(([, s]) => s).join(' ');
    expect(text).not.toMatch(/\b(tools?|planner|calculator|tester)\b/i);
    expect(text).not.toMatch(/sign in|sign up|create an account|log in/i);
  });
});
