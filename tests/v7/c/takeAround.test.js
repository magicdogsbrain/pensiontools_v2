/**
 * Around C's slider "What if you took this a month?" (a sceptical walk of the 7.11.1 fix, 16 Nov 2026). The slider now moves
 * the whole answer; these are the places around it that still read wrong:
 *   - an amount tried stayed when the figures it was tried on changed: new figures on step 1 ("What have you got?") opened
 *     on "Taking £… a month", an amount nobody chose for them. Now a change on step 1 lets it go, so the answer opens on its
 *     level's amount; a change under Try a change keeps it (trying an amount and a later start is a what-if of its own);
 *   - "How careful?" pressed while an amount was tried left every figure as it was, under "Your choice changes every figure
 *     on this page". Now choosing a level lets the amount tried go, and the page reads at that level's amount;
 *   - an amount typed above the slider's top left the slider pinned at its top, showing another amount than the headline.
 *     Now the track reaches past the amount typed;
 *   - the slider's low end was £0, where the page went back to the old count of futures and "All of it comes from your
 *     pot". Now its low end is one step above £0, and £0 typed reads as no amount tried;
 *   - an amount tried below what comes in anyway: what it is made of named more than the headline's amount without a word.
 *     Now it says that is more than the amount, so nothing is taken from the pot.
 * Fictional figures only (one person, 58, £250,000; one person, 66, £600,000).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { answerC, SCHEMA_C } from './_c.js';
import { checkScreen, draw } from '../render/checkScreen.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { money } from '../../../src/answers/shared/format.js';
import { currentKey, answerSlider, takeReading, takeTried, keepView } from '../../../src/v7/state/select.js';
import { reduce } from '../../../src/v7/state/reduce.js';

const load = (name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/c', `${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const ENV = { futures: 100, seed: 0, trace: false };
const STEP = (step) => ({ screen: 'step', q: 'c', step, planId: null, focus: null });

/** answer-F1 (one person, 58, £250,000) with `values` added to what is typed, the answer worked out for it and current. */
function worked(values = {}) {
  const s = load('answer-F1');
  s.draft.c.values = { ...s.draft.c.values, ...values };
  const parsed = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
  expect(parsed.ok).toBe(true);
  s.answers.c.result = answerC(parsed.inputs, { today: s.env.today, ...ENV });
  s.answers.c.inputsKey = currentKey(s, 'c');
  s.answers.c.status = 'final';
  return s;
}
const set = (s, path, value) => reduce(s, { type: 'draft/set', q: 'c', path, value });

describe('an amount tried belongs to the figures it was tried on', () => {
  it('a change on step 1 lets it go, so the answer for the new figures opens on its level\'s amount', () => {
    const s = { ...worked({ take: '2,020' }), route: STEP('numbers') };
    const a = set(s, 'you.pot', '400,000');
    expect(a.draft.c.values['you.pot']).toBe('400,000');
    expect(a.draft.c.values.take).toBe('');
    expect(parseDraft(SCHEMA_C, a.draft.c.values, a.env).inputs.take).toBe(null);
    // the same for a partner added, and for a box under "Add more detail"
    expect(set(s, 'household', 'couple').draft.c.values.take).toBe('');
    expect(set(s, 'risk', 'adventurous').draft.c.values.take).toBe('');
    // "Show what it pays" then opens the answer with no amount tried
    const asked = reduce(a, { type: 'draft/ask', q: 'c' });
    expect(asked.route.step).toBe('answer');
    expect(asked.draft.c.values.take).toBe('');
  });

  it('step 1 opened and left as it was keeps it', () => {
    const s = { ...worked({ take: '2,020' }), route: STEP('numbers') };
    const same = set(s, 'you.pot', '250,000');
    expect(same.draft.c.values.take).toBe('2,020');
    expect(reduce(same, { type: 'draft/ask', q: 'c' }).draft.c.values.take).toBe('2,020');
  });

  it('a change under Try a change keeps it: an amount and a later start tried together', () => {
    const s = worked({ take: '2,020' });
    expect(s.route.step).toBe('answer');
    expect(set(s, 'start.kind', 'age').draft.c.values.take).toBe('2,020');
    expect(set(s, 'risk', 'adventurous').draft.c.values.take).toBe('2,020');
  });
});

describe('"How careful?" while an amount is tried', () => {
  it('choosing a level lets the amount go: the page reads at that level\'s amount', () => {
    const s = worked({ take: '1,770' });
    expect(takeReading(s)).not.toBe(null);
    const { root, actions } = draw(s);
    one(root, 'c.level.careful').click();
    expect(actions).toEqual([{ type: 'draft/set', q: 'c', path: 'confidence', value: 'careful' }]);
    const next = reduce(s, actions[0]);
    expect(next.draft.c.values.confidence).toBe('careful');
    expect(next.draft.c.values.take).toBe('');
    expect(parseDraft(SCHEMA_C, next.draft.c.values, next.env).inputs.take).toBe(null);
    // nothing tried any more: no way back drawn, and Keep has nothing to say about an amount tried
    expect(takeTried(next)).toBe(null);
  });

  it('the level already chosen pressed again changes nothing', () => {
    const s = worked({ take: '1,770', confidence: 'balanced' });
    expect(reduce(s, { type: 'draft/set', q: 'c', path: 'confidence', value: 'balanced' }).draft.c.values.take).toBe('1,770');
  });
});

describe('the slider and the amount typed agree', () => {
  it('an amount typed above the track\'s top: the track reaches past it, and the slider shows it', () => {
    const base = worked();
    const top = answerSlider(base, 'c').max;
    const typed = Math.ceil((top + 500) / 10) * 10;
    const s = worked({ take: String(typed) });
    const slider = answerSlider(s, 'c');
    expect(slider.max).toBeGreaterThanOrEqual(typed);
    expect(slider.value).toBe(typed);
    const { root } = draw(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(one(root, 'c.slider.input').value).toBe(String(typed));
    expect(root.querySelector('[data-headline="take.perMonth"] #answer-figure').textContent).toBe(`Taking ${money(typed)} a month`);
  });

  it('its low end is one step above £0: taking nothing is no amount to try', () => {
    const slider = answerSlider(worked(), 'c');
    expect(slider.min).toBe(slider.step);
    expect(slider.scale[0]).toBe(slider.step);
  });

  it('£0 typed reads as no amount tried: the level\'s amount, its own words, no way back, no line in the try box', () => {
    const s = worked({ take: '0' });
    const r = s.answers.c.result;
    expect(r.take.perMonth).toBe(0);
    expect(takeReading(s)).toBe(null);
    expect(takeTried(s)).toBe(null);
    expect(keepView(s, 'c').trying).toBe(null);
    expect(answerSlider(s, 'c').value).toBe(r.levels[r.level].monthly);
    const { root } = draw(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-headline="levels.balanced.monthly"]')).not.toBe(null);
    expect(root.querySelector('[data-headline="take.perMonth"]')).toBe(null);
    expect(one(root, 'c.answer.back')).toBe(null);
    expect(one(root, 'c.try.take.result')).toBe(null);
    expect(root.textContent).not.toMatch(/Taking £0 a month|futures? out of 10|in every future we tried/);
  });
});

describe('an amount tried below what comes in anyway', () => {
  /** One person, 66, £600,000, the State Pension from now: an amount tried well under it. */
  function under() {
    const s = load('answer-F1');
    s.draft.c.values = { 'you.pot': '600,000', 'you.age': '66' };
    const parsed = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
    expect(parsed.ok).toBe(true);
    const r0 = answerC(parsed.inputs, { today: s.env.today, ...ENV });
    const sp = r0.phases[0].shown.statePension;
    expect(sp).toBeGreaterThan(500);
    const take = Math.floor((sp - 200) / 10) * 10;
    s.draft.c.values.take = String(take);
    const p2 = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
    s.answers.c.result = answerC(p2.inputs, { today: s.env.today, ...ENV });
    s.answers.c.inputsKey = currentKey(s, 'c');
    s.answers.c.status = 'final';
    return { s, take, sp };
  }

  it('what it is made of says that is more than the amount, so nothing is taken from the pot', () => {
    const { s, take } = under();
    const r = s.answers.c.result;
    const lines = r.sentences.takeMadeOf.map((x) => x.text);
    expect(lines).toContain(`That is more than ${money(take)} a month, so nothing is taken from your pot.`);
    // straight after the stretch's own line
    const i = lines.findIndex((t) => t.startsWith('That is more than'));
    expect(i).toBeGreaterThan(0);
    expect(lines[i - 1]).toMatch(/^Your State Pension/);
    // the level's own made-of lines are as they were: nothing said about an amount there
    expect(r.sentences.madeOf.map((x) => x.text).join(' ')).not.toMatch(/That is more than/);
    const { root } = draw(s);
    expect(checkScreen(root, s)).toEqual([]);
    const items = [...root.querySelectorAll('[data-region="answer"] .made-of-list li')].map((li) => li.textContent);
    expect(items).toEqual(lines);
  });

  it('an amount tried above what comes in anyway says nothing of the kind', () => {
    const r = worked({ take: '2,000' }).answers.c.result;
    expect(r.sentences.takeMadeOf.map((x) => x.text).join(' ')).not.toMatch(/That is more than/);
  });
});
