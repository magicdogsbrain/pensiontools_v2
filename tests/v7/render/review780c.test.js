/**
 * 7.8.0 second review, the new app's screens while weighing (fictional households only: Alex, Sam):
 *   - C draws "How careful?" straight under the fixed-age line, before what comes in if the money runs out, as A, B and D do
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { draw } from './checkScreen.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c', 'd']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const ROOT = join(process.cwd(), 'tests/v7/states');
const stateOf = (name) => JSON.parse(readFileSync(join(ROOT, name + '.json'), 'utf8'));
/** True when node a comes before node b in the document. */
const before = (a, b) => !!(a.compareDocumentPosition(b) & 4);

describe('C: "How careful?" sits under the fixed-age line', () => {
  for (const name of ['c/answer-F1', 'c/answer-F2', 'c/answer-F3']) {
    it(name, () => {
      const { root } = draw(stateOf(name));
      const strip = root.querySelector('.level-strip');
      if (!strip) return;   // (a state drawn before the figures were weighed has none)
      const fixed = root.querySelector('.headline [data-fixed="age"]');
      expect(fixed).toBeTruthy();
      expect(before(fixed, strip)).toBe(true);
      // nothing of the lines after the bad case comes before it
      for (const el of root.querySelectorAll('.headline .bad, .headline [data-testid="lasts.floor"], .headline [data-testid="lasts.howLong"], .headline [data-testid="lasts.left"]')) expect(before(strip, el)).toBe(true);
    });
  }
});

describe('B\'s headline is never a lone pot', () => {
  it('the first tile says the level chosen\'s pot with the other two beside it, as the answer\'s own figures', async () => {
    const { answerB } = await import('../../../src/answers/b/answer.js');
    const { h, render } = await import('preact');
    const { FigureTiles } = await import('../../../src/v7/components/AnswerPicture.jsx');
    const { answerTiles } = await import('../../../src/v7/state/pictures.js');
    const { money } = await import('../../../src/answers/shared/format.js');
    for (const level of ['careful', 'balanced', 'bold']) {
      const r = answerB({ you: { age: 41, pot: 62000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 63 }, spend: { kind: 'amount', amount: 1800 }, confidence: level },
        { today: '2026-09-30', futures: 40, seed: 0, weighted: true });
      const tiles = answerTiles({ answers: { b: { result: r } } }, 'b');
      const root = document.createElement('div');
      render(h(FigureTiles, { q: 'b', source: r, tiles, countKey: 'x' }), root);
      const aim = root.querySelector('[data-tile="aim"]').textContent;
      expect(aim).not.toMatch(/guide below|\{/);
      for (const k of ['careful', 'balanced', 'bold']) expect(aim).toContain(money(r.levels[k].pot));
      expect(aim).toMatch(new RegExp(`at ${level.charAt(0).toUpperCase() + level.slice(1)}, at today`));
    }
  });
});

describe('the levels\' twentieths the screens say are the rules\'', () => {
  it('LEVELS_WORDS.twentieths = 20 less each level\'s failures, and the option labels lead with them', async () => {
    const { LEVELS_WORDS } = await import('../../../src/v7/copy/common.js');
    const { LEVEL_FAILS20 } = await import('../../../src/answers/shared/rules.js');
    for (const k of ['careful', 'balanced', 'bold']) {
      expect(LEVELS_WORDS.twentieths[k]).toBe(String(20 - LEVEL_FAILS20[k]));
      expect(LEVELS_WORDS.options[k].startsWith(LEVELS_WORDS.twentieths[k] + ' times in 20')).toBe(true);
    }
  });
});

describe('Keep says the age a plan cut by the 45-year limit runs to', () => {
  it('A stopping at 52, counted to 100: the Keep panel names 96, 45 years and 100', async () => {
    const { parseDraft } = await import('../../../src/answers/shared/validate.js');
    const { inputsKey } = await import('../../../src/v7/state/inputsKey.js');
    const { SCHEMA_A } = await import('../../../src/answers/a/schema.js');
    const { answerA } = await import('../../../src/answers/a/answer.js');
    const { keepView } = await import('../../../src/v7/state/select.js');
    const { h, render } = await import('preact');
    const { KeepPanel } = await import('../../../src/v7/components/KeepPanel.jsx');
    const state = stateOf('a/answer-A1');
    state.draft.a.values = { 'you.age': '45', 'you.pot': '150,000', 'you.sex': 'female', 'you.payIn.kind': 'total', 'you.payIn.total': '900', savings: '200,000', 'stop.kind': 'age', 'stop.age': '52', 'spend.kind': 'amount', 'spend.amount': '2,000' };
    const parsed = parseDraft(SCHEMA_A, state.draft.a.values, state.env);
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
    const result = answerA(parsed.inputs, { today: state.env.today, futures: 20, seed: 0 });
    state.answers.a = { status: 'final', inputsKey: inputsKey(parsed.inputs, state.env), result, before: null, progress: null, slow: false };
    const v = keepView(state, 'a');
    expect(v.can).toBe(true);
    expect(v.cut).toMatchObject({ cut: true, years: 45, keptToAge: 96, planToAge: result.chance.planToAge });
    const root = document.createElement('div');
    render(h(KeepPanel, { state, q: 'a', dispatch: () => {} }), root);
    expect(root.querySelector('[data-testid="a.keep.cut"]').textContent).toBe(`The plan this keeps runs to 96: 45 years from when the money starts is the longest a plan runs. This answer counts to ${result.chance.planToAge}.`);
  });
});
