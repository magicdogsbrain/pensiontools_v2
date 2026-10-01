/**
 * Addresses with A, B and C open (step 4 brief 4.12): every A and B address round-trips through routes.js as it is
 * (BUILT grows); #/soon/a and #/soon/b are not found; screenName; no figure in any address. C's rows are pinned in
 * routes.test.js.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { parse, format, href, screenName, NOT_FOUND } from '../../../src/v7/router/routes.js';
import { BUILT, QUESTIONS } from '../../../src/v7/rail/questions.js';
import { CARRY_OPENS } from '../../../src/v7/state/carry.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { fresh, route, typedA, typedB, resultA, resultB, answered } from './_open.js';

const r = route;
const ROWS = [
  ['#/a/numbers', r('step', 'a', 'numbers'), 'a.numbers'],
  ['#/a/answer', r('step', 'a', 'answer'), 'a.answer'],
  ['#/a/ages', r('step', 'a', 'ages'), 'a.ages'],
  ['#/a/keep', r('step', 'a', 'keep'), 'a.keep'],
  ['#/b/numbers', r('step', 'b', 'numbers'), 'b.numbers'],
  ['#/b/answer', r('step', 'b', 'answer'), 'b.answer'],
  ['#/b/choices', r('step', 'b', 'choices'), 'b.choices'],
  ['#/b/keep', r('step', 'b', 'keep'), 'b.keep'],
  ['#/c/answer', r('step', 'c', 'answer'), 'c.answer'],
  ...['d', 'e', 'f'].map((q) => [`#/soon/${q}`, r('soon', q), 'soon'])
];
const FOCUSED = [
  ['#/a/numbers?focus=stop.age', r('step', 'a', 'numbers', 'stop.age')],
  ['#/b/numbers?focus=you.payIn.total', r('step', 'b', 'numbers', 'you.payIn.total')],
  ['#/a/numbers?focus=spend.amount', r('step', 'a', 'numbers', 'spend.amount')]
];
const UNKNOWN = ['#/soon/a', '#/soon/b', '#/soon/c', '#/a/ways', '#/b/ages', '#/a/choices', '#/a', '#/b/', '#/a/answer/extra', '#/A/numbers',
  '#/a/numbers?focus=you.pot=250000', '#/b/numbers?payIn=700', '#/plan/abc/a/answer'];

describe('A and B addresses', () => {
  it('the three questions are open; the front door leads to each first step', () => {
    expect(Object.keys(BUILT)).toEqual(['a', 'b', 'c']);
    expect(QUESTIONS.filter((q) => q.built).map((q) => q.id)).toEqual(['a', 'b', 'c']);
  });
  it.each(ROWS)('%s', (address, wanted, screen) => {
    expect(parse(address)).toEqual(wanted);
    expect(format(wanted)).toBe(address);
    expect(parse(format(wanted))).toEqual(wanted);
    expect(screenName(wanted)).toBe(screen);
    expect(reduce(fresh(), { type: A.ROUTE_SET, route: parse(address) }).route).toEqual(wanted);
  });
  it.each(FOCUSED)('%s', (address, wanted) => {
    expect(parse(address)).toEqual(wanted);
    expect(format(parse(address))).toBe(address);
  });
  it.each(UNKNOWN)('unknown: %s → not found', (address) => {
    expect(parse(address)).toEqual(NOT_FOUND);
    expect(screenName(parse(address))).toBe('front');
  });
  it('every step of A and B has an address, and the address has no digit', () => {
    for (const q of ['a', 'b']) for (const s of BUILT[q].steps) {
      const h = href.step(q, s.id);
      expect(h).toBe(`#/${q}/${s.id}`);
      expect(h).not.toMatch(/\d/);
    }
  });
  it('the places a carry opens are addresses, with no digit', () => {
    for (const o of Object.values(CARRY_OPENS)) {
      const h = format(r('step', o.q, o.step, o.focus));
      expect(parse(h)).toEqual(r('step', o.q, o.step, o.focus));
      expect(h).not.toMatch(/\d/);
    }
  });
  it('no figure in any rail link, whatever has been typed or answered', () => {
    const states = [
      answered(reduce(typedA(), { type: A.ROUTE_SET, route: r('step', 'a', 'answer') }), 'a', resultA({ middling: 1234567 })),
      answered(reduce(typedB(), { type: A.ROUTE_SET, route: r('step', 'b', 'choices') }), 'b', resultB({ careful: 7654000 }))
    ];
    for (const s of states) {
      const rail = railFor(s);
      for (const step of rail.steps) expect(step.href).not.toMatch(/\d/);
      if (rail.next.button && rail.next.button.href) expect(rail.next.button.href).not.toMatch(/\d/);
    }
  });
});
