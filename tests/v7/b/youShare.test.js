/**
 * "You" is never followed by the total going in (7.12.0, the saver brief's RC: "(you 34%, £1,172 a month)" read as if
 * £1,172 were the person's own). The share form beside another figure says the person's share, then the total as the
 * total: "(you 24%; £887 a month in all)". Worked from the pinned share state (fictional): 28% of £38,000 ÷ 12 = £886.67
 * in all, the employer's 4% as now, so the person's own is 24%.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { answerB } from '../../../src/answers/b/answer.js';

const state = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/b/answer-share.json'), 'utf8'));
const r = state.answers.b.result;

describe('a share of pay with an employer\'s part: the total is never labelled as yours', () => {
  it('the "pay more" lever says your share, then the total in all', () => {
    const env = { today: r.basis.today, futures: 100, seed: r.basis.seed ?? 0, ...(r.basis.weighted ? { weighted: true } : {}), ...(r.basis.detail ? { detail: r.basis.detail } : {}) };
    const a = answerB(r.inputs, env);
    const text = a.sentences.lever && a.sentences.lever.payMore ? a.sentences.lever.payMore.text : '';
    expect(text).toMatch(/of your pay in all \(you \d+(\.\d+)?%; £[\d,]+ a month in all\)/);
    for (const s of JSON.stringify(a.sentences).match(/\(you \d+(\.\d+)?%, £[\d,]+ a month\)/g) || []) expect(s).toBe('never');
  }, 120000);
});
