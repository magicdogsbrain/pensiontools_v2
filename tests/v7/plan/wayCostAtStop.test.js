/**
 * How the money is taken, on a plan still saving (the second walk, walker 9's medium finding). Fictional Jo, 58, saving
 * £600 a month into £120,000, stops at 63. The Floor & Flex card said "Costs £144,872 of your pot today; £33,424 left to
 * grow", but Jo's pot today is £120,000: by hand 144,872 + 33,424 = 178,296, the middling pension at 63 the runs start
 * from. On a plan still saving the card says whose pot it is: the pension when work stops, at the age it stops.
 */
import { describe, it, expect } from 'vitest';
import { cardLines } from '../../../src/answers/plan/way.js';
import { WAY } from '../../../src/v7/copy/way.js';

const ff = { id: 'floor-and-flex', affordable: true, bought: true, cost: 144872, left: 33424, a: { share: 0, chancePct: 0, futures: 1000, histories: 120, years: 37, typicalLeft: 42695, badCaseLeft: 0 } };

describe('what a bought way costs, said of the pot it is bought from', () => {
  it('a plan still saving: of the pots when work stops (144,872 + 33,424 = £178,296), at 63', () => {
    const lines = cardLines(ff, { endAge: 100, atStop: { age: 63 } });
    const cost = lines.find((l) => l.id === 'costAtStop');
    expect(cost).toEqual({ id: 'costAtStop', slots: { cost: '£144,872', bought: 'bought when you stop, at today’s prices', pot: '£178,296', age: '63', left: '£33,424' } });
    // step F3 (lead4.md D9): when it is bought is said in the words both views use
    expect(WAY.card.costAtStop.replace(/\{(\w+)\}/g, (m, k) => cost.slots[k])).toBe('Costs £144,872 of the £178,296 your pots could hold when you stop at 63; £33,424 left to grow. It is bought when you stop, at today’s prices.');
  });
  it('all of it: nothing left to grow', () => {
    const lines = cardLines({ ...ff, left: 0, cost: 178296 }, { endAge: 100, atStop: { age: 63 } });
    expect(lines.find((l) => /^cost/.test(l.id))).toEqual({ id: 'costAllAtStop', slots: { cost: '£178,296', bought: 'bought when you stop, at today’s prices', pot: '£178,296', age: '63', left: '£0' } });
  });
  it('a retired plan: "of your pot, bought today"', () => {
    expect(cardLines(ff, { endAge: 100 }).map((l) => l.id)).toContain('cost');
  });
});
