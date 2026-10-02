/**
 * I-SS5 — C, A and B agree to the pound with a spending shape (research/v7/spending-shape.md 9.1; the one test, J8–J10,
 * with what is spent changing with age). The same shape is written in shares for C (exact to two places) and in pounds for
 * A and B (each step the start × its share), so every year's figure is the same share of the start in all three:
 *
 *   S1  C(start X, shares).careful = s  ⇒  A's row at X with the shape in pounds has careful s too (one band, one shape),
 *       and A's verdict with the shape at s is a yes and at s + £10 is not
 *   S2  B at X with the shape at s is on course (its one test is A's verdict), and B's "spend less" moves the whole shape
 *       to A's careful start
 *   S3  C's take (Try a change) at s is A's verdict at s, the same lives counted
 *   S4  the shapes the three report at the start agree: C's careful list = A's careful list, step for step
 * Households: one person and a couple, stopping before and after 57, with pay-ins and savings; shapes: go-go / go-slow /
 * no-go, falls, moves evenly, a step up for care. Every push: fixed seeds, 40 futures. Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };

/** A shape in shares (C) and in pounds at a start (A, B): each step the start × share / 100, which divides back exactly. */
const asShares = (shape) => ({ ...(shape.then ? { then: shape.then } : {}), ...(shape.fallsPct ? { fallsPct: shape.fallsPct } : {}),
  steps: (shape.steps || []).map((s) => ({ fromAge: s.fromAge, share: s.share, then: s.then || 'level', ...(s.fallsPct ? { fallsPct: s.fallsPct } : {}) })) });
const inPounds = (shape, start) => ({ ...(shape.then ? { then: shape.then } : {}), ...(shape.fallsPct ? { fallsPct: shape.fallsPct } : {}),
  steps: (shape.steps || []).map((s) => ({ fromAge: s.fromAge, perMonth: start * s.share / 100, then: s.then || 'level', ...(s.fallsPct ? { fallsPct: s.fallsPct } : {}) })) });

function asC(h, shape) {
  const person = (p) => ({ age: p.age, pot: p.pot, ...(p.payIn ? { payIn: { has: 'yes', kind: 'split', own: p.payIn.own, employer: p.payIn.employer } } : {}) });
  return { household: h.partner ? 'couple' : 'single', you: person(h.you), ...(h.partner ? { partner: person(h.partner) } : {}),
    savings: h.savings || 0, start: { kind: 'age', age: h.stop }, risk: 'balanced', endAge: 95, shape: asShares(shape) };
}
function asSaver(h, spend, shape, q) {
  const person = (p) => ({ age: p.age, pot: p.pot, payIn: p.payIn ? { kind: 'split', own: p.payIn.own, employer: p.payIn.employer } : { kind: 'total', total: 0 } });
  const out = { household: h.partner ? 'couple' : 'single', you: person(h.you), ...(h.partner ? { partner: person(h.partner) } : {}),
    savings: h.savings || 0, spend: { kind: 'amount', amount: spend, ...inPounds(shape, spend) }, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95 };
  return q === 'a' ? { ...out, stop: { kind: 'age', age: h.stop }, partTime: { has: false } } : { ...out, stop: { age: h.stop }, confidence: 'nineInTen' };
}

const HOUSEHOLDS = [
  { name: 'one person, 58, stopping at 62', you: { age: 58, pot: 320000, payIn: { own: 400, employer: 300 } }, savings: 30000, stop: 62 },
  { name: 'a couple, 54 and 52, stopping at 56 on savings first', you: { age: 54, pot: 260000, payIn: { own: 300, employer: 300 } }, partner: { age: 52, pot: 120000, payIn: { own: 200, employer: 100 } }, savings: 90000, stop: 56 },
  { name: 'one person, 66, stopping now', you: { age: 66, pot: 450000 }, savings: 20000, stop: 66 }
];
const SHAPES = [
  { name: 'go-go, go-slow, no-go', steps: [{ fromAge: 75, share: 85 }, { fromAge: 85, share: 70 }] },
  { name: 'falls 1% a year, then a step for care', then: 'falls', fallsPct: 1, steps: [{ fromAge: 85, share: 110 }] },
  { name: 'moves evenly to 80%, then falls', then: 'glides', steps: [{ fromAge: 72, share: 80, then: 'falls', fallsPct: 2 }] }
];

describe('I-SS5 — C, A and B agree to the pound with a spending shape', () => {
  for (const h of HOUSEHOLDS) {
    for (const shape of SHAPES) {
      it(`${h.name}; ${shape.name}`, () => {
        const c = answerC(asC(h, shape), ENV);
        expect(c.status, JSON.stringify(c.problems)).toBe('ok');
        const s = c.monthly.careful;
        // S1: A's row at the stop is C's band, the shape the same share of the start every year
        const a = answerA(asSaver(h, s, shape, 'a'), { ...ENV, detail: 'chart', ages: [h.stop] });
        expect(a.status, JSON.stringify(a.problems)).toBe('ok');
        expect(a.shown.monthly).toEqual(c.monthly);
        expect(a.shown.verdict).toBe('yes');
        const above = answerA(asSaver(h, s + 10, shape, 'a'), { ...ENV, detail: 'chart', ages: [h.stop] });
        expect(above.shown.verdict).not.toBe('yes');
        // S4: the lists at the start, step for step
        expect(a.shapeAt.careful).toEqual(c.shapeAt.careful);
        // S3: C's take at s counts the same lives as A's verdict at s
        const take = answerC({ ...asC(h, shape), take: s }, ENV);
        expect(take.take.lasted).toBe(a.shown.lasted);
        expect(take.take.covered).toBe(true);
        // S2: B at the stop with the shape at s: on course, its whole-life count A's verdict
        if (h.stop > h.you.age) {
          const b = answerB(asSaver(h, s, shape, 'b'), { ...ENV, detail: 'answer' });
          expect(b.status, JSON.stringify(b.problems)).not.toBe('invalid');
          expect(b.chance.lasted).toBe(a.shown.lasted);
          expect(b.onCourse).toBe(true);
          const tight = answerB(asSaver(h, s + 200, shape, 'b'), { ...ENV, detail: 'answer' });
          if (tight.levers.spendLess) expect(tight.levers.spendLess.spend).toBe(s);
          expect(tight.monthlyIfShort).toBe(s);
        }
      }, 120_000);
    }
  }
});
