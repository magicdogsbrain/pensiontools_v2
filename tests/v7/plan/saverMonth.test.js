/**
 * 7.12.0: someone still saving is never shown a drawing year on Month by month, and the rail says their plan's income as they
 * set it, a month after tax. The locked saver of the corpus (05), stopping in February 2038, on 16 November 2026.
 */
import { describe, it, expect } from 'vitest';
import { corpus, entryOf } from './_plans.js';
import { readMonth } from '../../../src/answers/plan/month.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { MONTH } from '../../../src/v7/copy/month.js';

const C = corpus();
const fill = (t, s) => String(t).replace(/\{(\w+)\}/g, (m, k) => (k in s ? String(s[k]) : m));

describe('a locked saver on Month by month', () => {
  const today = '2026-11-16';
  const e = entryOf(C['05-saver-committed'], today);

  it('one sentence: it is for living on the plan, from the stop; nothing set up or worked out', () => {
    const V = readMonth(e.plan, {}, { today });
    expect(V.forLater).toEqual({ from: 'February 2038' });
    expect(V.setUp).toBeUndefined();
    expect(V.planMonth).toBeUndefined();
    expect(fill(MONTH.forLater, V.forLater)).toBe('Month by month is for when you live on your plan, from February 2038. Until then, your check-in once a year keeps it up to date.');
  });

  it('the rail: the plan\'s income from the stop, a month after tax', () => {
    const pg = planPage([e], e.plan.id, 'plan', { today });
    const head = pg.steps.find((s) => s.id === 'plan').result.text;
    // £36,000 a year before tax: 36,000 − 0.2 × (36,000 − 12,570) = 31,314 after tax, ÷ 12 = 2,609.50 → £2,610
    expect(head).toBe('£2,610 a month after tax from February 2038 (tax year 2037/38)');
    expect(head).not.toMatch(/a year before tax/);
  });
});
