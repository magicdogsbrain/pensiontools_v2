/**
 * Two facts a saver asks and the questions did not say (7.12.0; the second walk, walker 3, Pat, 52): what "the full amount"
 * of State Pension needs, and where a forecast is; and that the national guide levels are for a home owned outright, the
 * lowest being the published "Minimum".
 */
import { describe, it, expect } from 'vitest';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { C } from '../../../src/v7/copy/c.js';
import { BUDGET } from '../../../src/v7/copy/budget.js';

describe('what the questions say beside the State Pension and the guide levels', () => {
  it.each([['A', A], ['B', B], ['C', C]])('%s: "The full amount" says it needs 35 years of National Insurance, and where a forecast is', (q, words) => {
    const help = words.fields['you.statePension.kind'].help || '';
    expect(help).toMatch(/35 years of National Insurance/);
    expect(help).toMatch(/gov\.uk\/check-state-pension/);
  });
  it('the guide levels: for a home owned outright, and Basic is the published "Minimum"', () => {
    expect(BUDGET.levels || BUDGET.spend?.levels || JSON.stringify(BUDGET)).toMatch(/owned outright/);
    expect(JSON.stringify(BUDGET)).toMatch(/published “Minimum”/);
  });
});
