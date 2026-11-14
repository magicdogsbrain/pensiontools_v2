/**
 * The review's runs on the engine (7.10.0; spec-7100 §3.3, §4.4): the Moving review's two rows (as planned, then what is held,
 * whole) and the Living-on-it review's run from today on the pots entered, each giving a reading a review can keep. Each row
 * is one run of "Will it last?"'s one test (stressPanelRun.runStressRow), timed here so the page's budget can be checked.
 * Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { runStressRow } from '../../../src/answers/plan/stressPanelRun.js';
import { reviewSettingsOf, readingOf } from '../../../src/answers/plan/review.js';
import { corpus, entryOf } from './_plans.js';

const C = corpus();
const DAY = '2026-10-02';
const shape = (r) => {
  expect(r.source).toBe('run');
  expect(typeof r.weighted).toBe('number');
  expect(typeof r.sumW).toBe('number');
  expect(r.n).toBeGreaterThan(0);
  expect(r.fixedAge.n).toBeGreaterThan(0);
  expect(r.fixedAge.lasts).toBeLessThanOrEqual(r.fixedAge.n);
};

describe('the review\'s runs, on the engine', () => {
  it('Moving: as planned, then what is held, whole — each a reading; a record matching the plan reads the same', () => {
    const plan = entryOf(JSON.parse(JSON.stringify(C['19-back-to-work-saving'])), DAY).plan;
    const t0 = Date.now();
    const a = runStressRow(plan, { today: DAY, row: 'asPlanned' });
    const t1 = Date.now();
    const b = runStressRow(plan, { today: DAY, row: 'asHeld', whole: true });
    const t2 = Date.now();
    shape(readingOf(a, 'k')); shape(readingOf(b, 'k'));
    expect(readingOf(b, 'k').weighted).toBeCloseTo(readingOf(a, 'k').weighted, 2);
    console.log('[review timing] Moving as planned ' + (t1 - t0) + ' ms, whole ' + (t2 - t1) + ' ms');
  }, 60000);
  it('Living on it: the run from today on the pots entered; fewer pots, a lower chance', () => {
    const plan = entryOf(JSON.parse(JSON.stringify(C['04-buckets-running'])), DAY).plan;
    const t0 = Date.now();
    const a = readingOf(runStressRow(plan, { today: DAY, row: 'asPlanned', settings: reviewSettingsOf(plan, { pots: { pension: 587700, isa: 0, other: 0 }, today: DAY }) }), 'k');
    const t1 = Date.now();
    const b = readingOf(runStressRow(plan, { today: DAY, row: 'asPlanned', settings: reviewSettingsOf(plan, { pots: { pension: 300000, isa: 0, other: 0 }, today: DAY }) }), 'k');
    shape(a); shape(b);
    expect(b.weighted).toBeLessThan(a.weighted);
    console.log('[review timing] Living on it from today ' + (t1 - t0) + ' ms');
  }, 60000);
});
