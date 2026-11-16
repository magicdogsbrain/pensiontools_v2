/**
 * "What if you took this a month?" — C's answer read at the amount being tried (reported from the live site, 16 Nov 2026:
 * the slider moved from the solved amount to a much larger one and only one small line under it changed; the headline, the
 * chance, the run-out ages and what it is made of all stayed at the solved amount, and that line counted futures to an age
 * while the page said a chance — two measures on one page).
 *
 * Now, with the slider (or "Take, a month" under Try a change) on an amount other than the level's:
 *   - the answer block reads for THAT amount, in the page's own measures and words: "Taking £… a month", the chance it lasts
 *     as long as you do with the fixed-age line beside it, what happens if the money runs out, what is left, what it is
 *     made of — every figure the answer's `take` block, worked out on the same futures as the level's amount (D's reading of
 *     what you take: the same chance, the same bad case, the same phases);
 *   - one line under the slider keeps the level's amount in view ("At Balanced you could take about £…") with "Back to £…",
 *     which empties the take box: the slider and the page return to the level's amount;
 *   - the three tiles stay the most you could take at each level; the slider's own line is gone (the block says it); the
 *     line under "Show how long that lasts" says the page's chance, with its fixed-age line beside it;
 *   - Keep asks which amount it keeps: the one being tried, or the level's (7.12.0).
 * At the level's own amount the answer reads as it always has. Fictional figures only (one person, 58, £250,000).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { answerC, SCHEMA_C } from './_c.js';
import { checkScreen, draw, visibleText } from '../render/checkScreen.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { money, chanceWords } from '../../../src/answers/shared/format.js';
import { currentKey } from '../../../src/v7/state/select.js';
import { answerD } from '../d/_d.js';

const load = (name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/c', `${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const ENV = { futures: 100, seed: 0, trace: false };

/** The chance's render rule (tests/v7/render/lastsRule.test.js), on one drawn root: a weighted line never without its fixed-age line. */
const BLOCK = 'section, .block, .headline, .band, details';
function lastsRuleProblems(root) {
  const out = [];
  for (const el of root.querySelectorAll('[data-weighted]')) {
    const block = (el.parentElement && el.parentElement.closest(BLOCK)) || root;
    const fixed = [...block.querySelectorAll('[data-fixed="age"]')].filter((f) => f !== el && /\b(live to|is still alive when|is) \d{2,3}\b/.test(f.textContent));
    if (!fixed.length) out.push(`no fixed-age line beside: "${el.textContent.trim().slice(0, 90)}"`);
    if (/of 20 futures we tried|futures out of/.test(el.textContent) && !el.classList.contains('level-strip')) out.push(`a weighted sentence counts futures: "${el.textContent.trim().slice(0, 90)}"`);
  }
  return out;
}

/** answer-F1 with `take` typed, the answer worked out for it (100 futures) and current. */
function trying(take) {
  const s = load('answer-F1');
  if (take === null) delete s.draft.c.values.take;
  else s.draft.c.values.take = take;
  const parsed = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
  expect(parsed.ok).toBe(true);
  s.answers.c.result = answerC(parsed.inputs, { today: s.env.today, ...ENV });
  s.answers.c.inputsKey = currentKey(s, 'c');
  s.answers.c.status = 'final';
  return s;
}

describe('the answer engine: the reading at the amount being tried', () => {
  it('carries what it is made of at that amount, and the page\'s sentences for it', () => {
    const r = trying('2,000').answers.c.result;
    expect(r.take.perMonth).toBe(2000);
    expect(Array.isArray(r.take.phases) && r.take.phases.length).toBeGreaterThan(0);
    // what it is made of adds up to the amount tried in its first stretch (the level's phases to the level's amount)
    expect(Math.abs(r.take.phases[0].takeHome - 2000)).toBeLessThan(1);
    expect(Math.abs(r.phases[0].takeHome - r.levels[r.level].monthly)).toBeLessThan(1);
    const s = r.sentences;
    expect(s.takeHead.text).toBe('Taking £2,000 a month');
    expect(s.takeLine.mark).toBe('weighted');
    expect(s.takeLine.text).toContain('£2,000 a month');
    expect(s.takeLine.text).toContain(chanceWords(r.take.weighted));
    expect(s.takeFixed.mark).toBe('fixed');
    expect(s.takeBad.text).toMatch(/the worst 1 in 10/);
    expect(s.takeMadeOf.length).toBeGreaterThan(0);
    // the try box's line says the page's chance (weighted), never a count of futures out of 10; the take sentence the
    // answer has always given stays as it was beside it (nothing the answer said before changes)
    expect(s.takeChance.mark).toBe('weighted');
    expect(s.takeChance.text).not.toMatch(/futures? out of 10/);
    expect(s.take.id).toMatch(/^c\.take/);
  });

  it('is D\'s reading of what you take: the same chance, bad case, phases and words, from now', () => {
    const d = { you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, savings: 40000, spend: { kind: 'amount', amount: 2400 } };
    const env = { today: '2026-09-30', futures: 100, seed: 0, trace: false };
    const D = answerD(d, env);
    const C = answerC({ household: 'single', you: { age: 68, pot: 300000 }, savings: 40000, start: { kind: 'now' }, risk: 'balanced', charge: 0.5, endAge: D.inputs.endAge, take: 2400 }, env);
    expect(C.take.weighted).toBe(D.chance.weighted);
    expect(C.take.lasted).toBe(D.chance.fixedAge);
    expect(C.take.phases.map((p) => p.takeHome)).toEqual(D.phases.map((p) => p.takeHome));
    for (const [c, dk] of [['takeBad', 'bad'], ['takeFloor', 'floor'], ['takeHowLong', 'howLong'], ['takeHowMuch', 'howMuch'], ['takeLeft', 'left'], ['takeFixed', 'fixed']]) {
      expect(Boolean(C.sentences[c]), c).toBe(Boolean(D.sentences[dk]));
      if (C.sentences[c]) expect(C.sentences[c].text, c).toBe(D.sentences[dk].text);
    }
  }, 120000);
});

describe('the screen: the slider on an amount other than the level\'s', () => {
  const s = trying('2,000');
  const r = s.answers.c.result;
  const { root, actions } = draw(s);
  const region = root.querySelector('[data-region="answer"]');

  it('passes every rule of checkScreen and the chance\'s render rule', () => {
    expect(checkScreen(root, s)).toEqual([]);
    // (7.12.0: one chance in the body; the counts to one age behind "More about the chance": tests/v7/render/oneChance.test.js)
    expect(lastsRuleProblems(root).filter((p) => !p.startsWith('no fixed-age line beside'))).toEqual([]);
    for (const f of root.querySelectorAll('[data-fixed="age"]')) expect(f.closest('[data-testid="chance.more"]')).not.toBe(null);
    expect(root.querySelectorAll('[data-testid="chance.more"] [data-fixed="age"]').length).toBeGreaterThan(0);
  });

  it('the headline is the amount tried, with its chance and the fixed-age line beside it', () => {
    expect(region.querySelector('[data-headline="levels.balanced.monthly"]')).toBe(null);
    const head = region.querySelector('[data-headline="take.perMonth"]');
    expect(head).not.toBe(null);
    expect(head.querySelector('#answer-figure').textContent).toBe('Taking £2,000 a month');
    const line = head.querySelector('[data-sentence="take.perMonth"]');
    expect(line.textContent).toBe(r.sentences.takeLine.text);
    expect(line.getAttribute('data-weighted')).toBe('1');
    expect(head.querySelector('[data-testid="lasts.fixed"]').textContent).toBe(r.sentences.takeFixed.text);
    expect(head.textContent).toContain(r.sentences.takeBad.text);
    // the level's own words are not drawn as the answer's: its line and its chance are not on the block
    expect(region.textContent).not.toContain(r.sentences.line.text);
    expect(region.textContent).not.toContain(r.sentences.fixed.text);
  });

  it('every line under it is the amount tried: run-out ages, what comes in after, how long, how much, what is left', () => {
    for (const k of ['takeFloor', 'takeHowLong', 'takeHowMuch', 'takeLeft']) {
      if (r.sentences[k]) expect(region.textContent, k).toContain(r.sentences[k].text);
    }
    // what the other levels ask for is about the level's amount: not said under an amount tried
    if (r.sentences.cost) expect(region.textContent).not.toContain(r.sentences.cost.text);
  });

  it('what it is made of is at the amount tried', () => {
    const items = [...region.querySelectorAll('.made-of-list li')].map((li) => li.textContent);
    expect(items).toEqual(r.sentences.takeMadeOf.map((x) => x.text));
  });

  it('the three tiles stay the most you could take at each level', () => {
    const tiles = [...root.querySelectorAll('[data-testid="c.tiles"] [data-tile]')].map((el) => el.getAttribute('data-tile'));
    expect(tiles).toEqual(['balanced', 'careful', 'bold']);
    expect(root.querySelector('[data-testid="c.tiles"] [data-key="levels.balanced.monthly"]').getAttribute('data-value')).toBe(String(r.levels.balanced.monthly));
  });

  it('under the slider: the level\'s amount kept in view, and "Back to" it — no second measure', () => {
    const card = one(root, 'c.slider');
    expect(one(root, 'c.answer.take')).toBe(null);
    expect(card.textContent).not.toMatch(/futures? out of 10|lasted to/);
    const solved = one(root, 'c.answer.solved');
    expect(solved.textContent).toContain(`At Balanced you could take about ${money(r.levels.balanced.monthly)} a month.`);
    const back = one(root, 'c.answer.back');
    expect(visibleText(back)).toBe(`Back to ${money(r.levels.balanced.monthly)}`);
    back.click();
    expect(actions).toEqual([{ type: 'draft/set', q: 'c', path: 'take', value: '' }]);
  });

  it('"Show how long that lasts" says the page\'s chance, with its fixed-age line beside it', () => {
    const under = one(root, 'c.try.take.result');
    expect(under.textContent).toBe(r.sentences.takeChance.text);
    expect(under.getAttribute('data-weighted')).toBe('1');
    expect(under.textContent).not.toMatch(/futures? out of 10/);
    // its count to one named age straight after it, in the same block
    const fixed = one(root, 'c.try.take.fixed');
    expect(fixed.textContent).toBe(r.sentences.takeFixed.text);
    expect(under.nextElementSibling).toBe(fixed);
  });

  // (7.12.0: Keep asks which amount the plan keeps, the one tried or the level's, neither chosen: tests/v7/keep/keepTried.test.js)
  it('Keep asks which amount it keeps: the amount tried, or the level\'s', () => {
    expect(one(root, 'c.keep.trying')).toBe(null);
    const level = one(root, 'c.action.save.level');
    expect(level.querySelector('[data-key="levels.balanced.monthly"]').getAttribute('data-value')).toBe(String(r.levels.balanced.monthly));
    expect(one(root, 'c.action.save.tried').textContent).toContain('(the amount you are trying)');
  });

  it('nothing is written: drawing it dispatches nothing', () => {
    const fresh = draw(s);
    expect(fresh.actions).toEqual([]);
  });
});

describe('the screen: the slider on the level\'s own amount, or not moved', () => {
  it.each([['not moved', false], ['on the level\'s amount', true]])('%s: the answer reads as it always has, with no way back to draw', (_name, atLevel) => {
    const solved = trying(null).answers.c.result.levels.balanced.monthly;
    const s = trying(atLevel ? money(solved).slice(1) : null);
    const r = s.answers.c.result;
    if (atLevel) expect(r.take.perMonth).toBe(solved);
    const { root } = draw(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-headline="levels.balanced.monthly"]')).not.toBe(null);
    expect(root.querySelector('[data-headline="take.perMonth"]')).toBe(null);
    expect(one(root, 'c.answer.solved')).toBe(null);
    expect(one(root, 'c.answer.back')).toBe(null);
    expect(one(root, 'c.keep.trying')).toBe(null);
  });
});

describe('"Back to £…": the box emptied', () => {
  it('the slider stands at the level\'s amount at once, while the answer for it is worked out again; no way back is drawn', () => {
    const s = trying('2,000');
    s.draft.c.values = { ...s.draft.c.values, take: '' };
    const { root } = draw(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(one(root, 'c.slider.input').value).toBe(String(s.answers.c.result.levels.balanced.monthly));
    expect(one(root, 'c.answer.back')).toBe(null);
    expect(root.querySelector('[data-region="answer"]').getAttribute('aria-busy')).toBe('true');
  });
});

describe('while the amount tried is worked out', () => {
  it('the slider moved, the answer not yet: the old answer greyed and marked, and the way back already there', () => {
    const s = trying(null);
    s.draft.c.values = { ...s.draft.c.values, take: '2,000' };     // a new object, as the reducer makes (the parse is kept by it)
    const { root } = draw(s);
    expect(checkScreen(root, s)).toEqual([]);
    const region = root.querySelector('[data-region="answer"]');
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.className).toContain('is-stale');
    expect(one(root, 'c.answer.back')).not.toBe(null);
  });
});
