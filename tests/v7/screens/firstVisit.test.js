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
import { potPicture, answerSlider, answerTiles, roundTop, LIFE_EXAMPLE, lifeStages, guestView } from '../../../src/v7/state/select.js';
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
  it('one pink thing to press, the life line as the explainer with no figure on it, and the words of the front door', () => {
    expect(root.querySelectorAll('main .btn-pop')).toHaveLength(1);
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
    expect(P.marks.find((m) => m.id === 'you')).toEqual({ id: 'you', age: r.inputs.you.age, value: p0 });
    expect(P.marks.find((m) => m.id === 'aim').value).toBe(r.number.careful);
  });
  it('the scale is a round figure above every value drawn, and every line rises while saving', () => {
    const all = [...P.lines.flatMap((l) => l.points), ...P.band.points, ...P.marks].map((p) => p.value);
    expect(P.top).toBeGreaterThanOrEqual(Math.max(...all));
    expect(P.top).toBe(roundTop(P.top));
    for (const l of P.lines.filter((x) => x.id !== 'enoughBad')) for (let i = 1; i < l.points.length; i++) expect(l.points[i].value).toBeGreaterThanOrEqual(l.points[i - 1].value);
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
    expect(legend).toEqual(expect.arrayContaining(['enough', 'now', 'bad', 'you']));
    expect(legend.length).toBeGreaterThanOrEqual(2);
    const you = fig.querySelector('[data-mark="you"]');
    expect(you.getAttribute('style')).toMatch(/left: ?0%/);
    expect(fig.getAttribute('aria-labelledby')).toBeTruthy();
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
    expect(actions.at(-1)).toEqual({ type: 'draft/set', q: 'b', path: S.path, value: (S.max / 2).toLocaleString('en-GB') });
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
