/**
 * 7.8.0 — one render rule for both apps (research/v7/replan-nov-2026.md 5; the build spec's sections 6 and 10, "Wording and
 * render"): any element carrying a chance weighted by how long people live ([data-weighted]) has, in the same block, a
 * sentence that counts the futures to one named age ([data-fixed="age"], or the classic block's [data-fixed="1"]) — so a
 * weighted figure never shows without the plain count beside it. Over every V7 state (A, B, C, D and the plan pages), every
 * answer state of A to D worked out again while weighing (so the rule is held on the weighted words before the shipped flag
 * is on, and after), and the classic planner's verdict block.
 *
 * Also: no weighted sentence says a count of futures ("of 20 futures we tried"); every sentence says something (no NaN, no
 * undefined); each fixed-age sentence names its age; every Bold answer carries the consequence sentence in its headline
 * block; and the level control and the MadeOf key's counts are marked as the rule needs. Fictional households only.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { draw, visibleText } from './checkScreen.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { verdictBlockView } from '../../../src/ui/oneAnswerView.js';
import { lifeOfSettings } from '../../../src/answers/plan/life.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c', 'd']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const ROOT = join(process.cwd(), 'tests/v7/states');
const ANSWER = { a: answerA, b: answerB, c: answerC, d: answerD };
const BLOCK = 'section, .block, .headline, .band, .checkin-kept, [data-chance-block], .chance-block, .plan-section, details';
const AGE = /\b(live to|is still alive when|is) \d{2,3}\b/;

/** Every named state of a folder: [name, state]. */
function statesOf(dir) {
  const d = join(ROOT, dir);
  if (!existsSync(d)) return [];
  return readdirSync(d).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort().map((f) => [`${dir}/${f.slice(0, -5)}`, JSON.parse(readFileSync(join(d, f), 'utf8'))]);
}

/** The rule on a drawn root: every problem, as words (empty when it holds). */
export function lastsRuleProblems(root) {
  const out = [];
  for (const el of root.querySelectorAll('[data-weighted]')) {
    const block = (el.parentElement && el.parentElement.closest(BLOCK)) || root;
    const fixed = [...block.querySelectorAll('[data-fixed="age"], [data-fixed="1"]')].filter((f) => f !== el && AGE.test(f.textContent));
    if (!fixed.length) out.push(`no fixed-age line beside: "${el.textContent.trim().slice(0, 90)}"`);
    if (/of 20 futures we tried|futures out of/.test(el.textContent) && !el.classList.contains('level-strip')) out.push(`a weighted sentence counts futures: "${el.textContent.trim().slice(0, 90)}"`);
  }
  for (const f of root.querySelectorAll('[data-fixed="age"]')) {
    if (!AGE.test(f.textContent)) out.push(`a fixed-age line names no age: "${f.textContent.trim().slice(0, 90)}"`);
  }
  const text = visibleText(root);
  if (/\bNaN\b|\bundefined\b/.test(text)) out.push('NaN or undefined in the words');
  return out;
}

describe('the render rule over every V7 state as pinned', () => {
  const all = ['a', 'b', 'c', 'd', 'plan'].flatMap(statesOf);
  it('there are states to draw', () => expect(all.length).toBeGreaterThan(100));
  it.each(all)('%s', (_name, state) => {
    const { root } = draw(state);
    expect(lastsRuleProblems(root)).toEqual([]);
  });
});

/** The A to D states with an answer, worked out again while weighing (env.weighted) at 100 futures. */
function weighedStates() {
  const out = [];
  for (const q of ['a', 'b', 'c', 'd']) {
    for (const [name, state] of statesOf(q)) {
      const r = state.answers && state.answers[q] && state.answers[q].result;
      if (!r || !r.inputs || !r.basis || r.status === 'invalid') continue;
      if (!state.route || state.route.q !== q || !/answer|ages|keep/.test(state.route.step || '')) continue;
      out.push([name, q, state]);
    }
  }
  return out;
}

describe('the render rule on the weighted words: every A to D answer state worked out while weighing', () => {
  const list = weighedStates();
  it('there are answers to weigh', () => expect(list.length).toBeGreaterThan(30));
  it.each(list)('%s', (name, q, state) => {
    const r = state.answers[q].result;
    const env = { today: r.basis.today, futures: 100, seed: r.basis.seed ?? 0, weighted: true, ...(r.basis.detail ? { detail: r.basis.detail } : {}) };
    const w = ANSWER[q](r.inputs, env);
    if (w.status === 'invalid') return;
    const s = JSON.parse(JSON.stringify(state));
    s.answers[q].result = w;
    const { root } = draw(s);
    expect(lastsRuleProblems(root), name).toEqual([]);
    // a weighed answer whose weighted line is drawn draws its fixed-age line too
    if (w.sentences && w.sentences.line && w.sentences.line.mark === 'weighted' && root.querySelector(`[data-sentence-id="${w.sentences.line.id}"][data-weighted]`)) {
      expect(root.querySelectorAll('[data-fixed="age"]').length, name).toBeGreaterThan(0);
    }
    // Bold: the consequence sentence is in the headline block
    if (w.level === 'bold' && w.sentences && w.sentences.boldLine) {
      expect(root.querySelector('[data-sentence-id$=".bold"]'), name).not.toBe(null);
    }
  }, 60000);
});

describe('Bold carries its consequence; the level control and the key', () => {
  const ENV = { today: '2026-11-11', futures: 100, seed: 0, weighted: true };
  const CASES = {
    c: { you: { pot: 400000, age: 66 }, confidence: 'bold' },
    d: { you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1900 }, confidence: 'bold' },
    a: { you: { age: 55, pot: 250000, payIn: { kind: 'total', total: 500 } }, savings: 30000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1700 }, confidence: 'bold' },
    b: { you: { age: 45, pot: 90000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2000 }, confidence: 'bold' }
  };
  it.each(Object.entries(CASES))('%s at Bold: "About 6 times in 20 the money runs out while you are alive …" in the answer, in the twentieths of the chance before it', (q, inputs) => {
    const r = ANSWER[q](inputs, ENV);
    expect(r.level).toBe('bold');
    expect(r.sentences.boldLine.text).toMatch(/^(About (\d+ times|once) in 20|Less than once in 20) the money runs out while you are alive, and you would spend less from then on\.$/);
    // the consequence and the chance said before it are the same twentieths
    const chance = Object.values(r.sentences).map((x) => x && x.text).find((t) => typeof t === 'string' && /as long as you do (\d+) times in 20/.test(t) && !/would put you on course/.test(t));
    const said = r.sentences.boldLine.text.match(/About (\d+) times in 20/);
    if (chance && said) expect(+said[1]).toBe(20 - +chance.match(/as long as you do (\d+) times in 20/)[1]);
    expect(r.sentences.boldLine.mark).toBe('weighted');
    expect(r.sentences.fixed.mark).toBe('fixed');
    expect(r.sentences.fixed.text).toMatch(/^(Paying in as now: if|If) you live to \d+, the money lasts that long (in \d+ of 20 futures we tried|in every future we tried|in none of the futures we tried|in more than 19 of 20 futures we tried|in fewer than 1 of 20 futures we tried)\.$/);
  });

  it('every weighted sentence of the four says a chance in twentieths, never a count of futures or a percentage', () => {
    for (const [q, inputs] of Object.entries(CASES)) {
      for (const level of ['careful', 'balanced', 'bold']) {
        const r = ANSWER[q]({ ...inputs, confidence: level }, ENV);
        const marked = Object.values(r.sentences).flat().filter((s) => s && s.mark === 'weighted');
        expect(marked.length, `${q} ${level}`).toBeGreaterThan(0);
        for (const s of marked) {
          expect(s.text, `${q} ${level} ${s.id}`).not.toMatch(/futures we tried|futures out of|\d\s?%/);
          expect(s.text, `${q} ${level} ${s.id}`).toMatch(s.id.endsWith('.bold') ? /^(About (\d+ times|once) in 20|Less than once in 20) / : /times? in 20|every future we tried|none of the futures we tried/);
        }
      }
    }
  });
});

describe('the classic planner\'s block (src/ui/oneAnswerView.js) keeps the rule', () => {
  // a made-up result in stressTestStrategy's shape: `fails` of 20 futures failed, at run years 20 on (as tests/v7/plan/verdictBlock.test.js)
  const now = new Date('2026-11-11T12:00:00Z');
  const LIFE = lifeOfSettings({ currentAge: 66, currentAgeAsOf: '2026-05-01' }, now, { startAge: 66 });
  const P = { startAge: 66, durationYears: 31, spAnnual: 12000, spStartYear: 1 };
  const fake = (strategyId, fails) => {
    const survivedMc = Array.from({ length: 20 }, (_, i) => i >= fails);
    return { strategyId, affordable: true, ruin: { mc: fails * 5, hist: 3.2 }, n: { mc: 20, hist: 600 }, coverage: 97.5, worst12: { min: 31000, median: 40000 },
      terminal: { p10: 0, p50: 200000, p90: 700000 }, failAges: [], survivedMc, futuresMc: { headYear: survivedMc.map((ok, i) => (ok ? null : 20 + i)), failYear: [] } };
  };
  it.each([0, 2, 6, 12])('a weighing block with %i of 20 futures failed carries its fixed-age line in the same block, at every level', (f) => {
    for (const level of ['careful', 'balanced', 'bold']) {
      const root = document.createElement('div');
      root.innerHTML = verdictBlockView(fake('pots-and-valves', f), P, { life: LIFE, level, floorAt: () => 12500 });
      expect(root.querySelector('[data-weighted]'), level).toBeTruthy();
      expect(lastsRuleProblems(root), level).toEqual([]);
    }
  });
});
