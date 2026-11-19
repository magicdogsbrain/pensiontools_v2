/**
 * One chance in the body (7.12.0): the answer pages of A, B, C and D say the chance counting how long people live ("lasts as
 * long as you do 18 times in 20") and nothing else in the body. Every count to one age the page would have drawn beside it
 * ("If you live to 100, the money lasts that long in 16 of 20 futures we tried") is in ONE closed block, "More about the
 * chance" ([data-testid="chance.more"]), inside the headline or verdict block. Before, each chance was said twice by rule,
 * and the two measures stood side by side up to five times a page.
 *
 * Over every pinned A to D answer state, and each worked out again while weighing (as tests/v7/render/lastsRule.test.js
 * does). The plan pages keep their own rule (lastsRule.test.js).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { draw } from './checkScreen.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../d/_d.js';
import { CHANCE_MORE_OPEN } from '../../../src/v7/components/Lasts.jsx';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c', 'd']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const ROOT = join(process.cwd(), 'tests/v7/states');
const ANSWER = { a: answerA, b: answerB, c: answerC, d: answerD };

/** Every A to D state on one of its own answer pages (answer, ages, choices, keep), with an answer: [name, q, state]. */
function answerStates() {
  const out = [];
  for (const q of ['a', 'b', 'c', 'd']) {
    const d = join(ROOT, q);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((x) => x.endsWith('.json') && !x.startsWith('_')).sort()) {
      const state = JSON.parse(readFileSync(join(d, f), 'utf8'));
      const r = state.answers && state.answers[q] && state.answers[q].result;
      if (!r || !r.inputs || !r.basis || r.status === 'invalid') continue;
      if (!state.route || state.route.q !== q || !/answer|ages|choices|keep/.test(state.route.step || '')) continue;
      out.push([`${q}/${f.slice(0, -5)}`, q, state]);
    }
  }
  return out;
}

/** The rule on one drawn page: every problem, in words. */
function problems(root) {
  const out = [];
  const blocks = root.querySelectorAll('[data-testid="chance.more"]');
  if (blocks.length > 1) out.push(`${blocks.length} "More about the chance" blocks`);
  // ("Try the bad years" under an answer keeps its own rule, with the plan pages: lastsRule.test.js)
  for (const f of root.querySelectorAll('[data-fixed="age"]')) {
    if (f.closest('.answer-stress')) continue;
    if (!f.closest('[data-testid="chance.more"]')) out.push(`a count to one age in the body: "${f.textContent.trim().slice(0, 90)}"`);
  }
  if ([...root.querySelectorAll('[data-weighted]')].some((w) => !w.closest('.answer-stress'))) {
    const inside = blocks.length ? blocks[0].querySelectorAll('[data-fixed="age"]').length : 0;
    if (!inside) out.push('a chance on the page, and no count to one age behind "More about the chance"');
  }
  for (const b of blocks) {
    if (b.tagName.toLowerCase() !== 'details') out.push('"More about the chance" is not a block to open');
    if (b.hasAttribute('open') !== CHANCE_MORE_OPEN) out.push('"More about the chance" does not start as CHANCE_MORE_OPEN says');
  }
  return out;
}

describe('one chance in the body: every pinned A to D answer page', () => {
  const list = answerStates();
  it('there are pages to draw', () => expect(list.length).toBeGreaterThan(30));
  it.each(list)('%s', (name, _q, state) => {
    const { root } = draw(state);
    expect(problems(root), name).toEqual([]);
  });
});

describe('one chance in the body: each worked out again while weighing', () => {
  const list = answerStates();
  it.each(list)('%s', (name, q, state) => {
    const r = state.answers[q].result;
    const env = { today: r.basis.today, futures: 100, seed: r.basis.seed ?? 0, weighted: true, ...(r.basis.detail ? { detail: r.basis.detail } : {}) };
    const w = ANSWER[q](r.inputs, env);
    if (w.status === 'invalid') return;
    const s = JSON.parse(JSON.stringify(state));
    s.answers[q].result = w;
    const { root } = draw(s);
    expect(problems(root), name).toEqual([]);
  }, 60000);
});
