/**
 * The screen-side fixes from the review of questions A and B (1 Oct 2026), each held to checkScreen's rules too:
 *
 *   1  counts beside a bar: never "1 in 10" beside an empty bar, never a bare "9 in 10" beside a full one
 *   2  "Try a change" keeps the keyboard where it was: a − / + press rests the button (aria-disabled), never
 *      greys it out (a greyed-out button drops the cursor to the page)
 *   3  the "What would … a month?" hand-over is one line of words (on a phone it split into three columns)
 *   4  the rail's next line on the every-age step does not offer the step it is on
 *   5  the every-age table says why the ages before a pension opens pay little or nothing, and why it starts at 50
 *   6  B's levers: "Try" only where the lever helps; a lever the answer found nothing for, with a sentence, is said
 *   7  no "risk while saving" to try when there are no saving years
 *   8  Before / Now names the change that was made
 *   9  the "brought over" line says whether what goes in each month was brought over
 *  10  labels: the age to stop work (and, for two, "when you both stop"); the partner's age in the table's header;
 *      "your part" says the tax the government adds back is in it
 *  11  B's grid: the columns for now and for what it needs are marked; "none of these" when no cell reaches 9 in 10;
 *      the couple's wording in the line above it
 *  12  the hand-overs to C: never before a pension can be touched; named by the age the money starts
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { renderScreen } from '../c/_c.js';
import { checkScreen, visibleText } from '../render/checkScreen.js';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { currentKey } from '../../../src/v7/state/select.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { countPlain } from '../../../src/v7/components/OutOfTenBar.jsx';
import { leverActions } from '../../../src/v7/components/Levers.jsx';
import { outOfTen } from '../../../src/answers/shared/format.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { C } from '../../../src/v7/copy/c.js';

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), `tests/v7/states/${q}/${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
const clone = (o) => JSON.parse(JSON.stringify(o));

/** A live page: the real store and reducer, redrawn after every action, in the document (so focus works). */
function live(state) {
  const store = createStore({ ...state, env: { ...state.env, build: 'test' } }, reduce);
  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);
  const dispatch = (a) => store.dispatch(a);
  const drawIt = (s) => act(() => { render(h(App, { state: s, dispatch }), root); });
  store.subscribe(drawIt);
  drawIt(store.getState());
  return { root, store, done: () => { render(null, root); root.remove(); } };
}

describe('1 — counts beside a bar', () => {
  const words = A.answer;
  it('a share under 1 in 20 reads "fewer than 1 in 10"; 95% or more (not all) reads "more than 9 in 10"', () => {
    expect(countPlain(0.001, words)).toBe(words.countFewer);
    expect(countPlain(0.049, words)).toBe(words.countFewer);
    expect(countPlain(0.05, words)).toBe(words.count.replace('{n}', '1'));
    expect(countPlain(0.87, words)).toBe(words.countJustUnder);
    expect(countPlain(0.9, words)).toBe(words.count.replace('{n}', '9'));
    expect(countPlain(0.95, words)).toBe(words.countMore);
    expect(countPlain(0.999, words)).toBe(words.countMore);
    expect(countPlain(1, words)).toBe(words.countEvery);
    expect(countPlain(0, words)).toBe(words.countNone);
    expect(words.countFewer).toMatch(/fewer than 1 in 10/);
    expect(words.countMore).toMatch(/more than 9 in 10/);
    expect(B.choices.countFewer).toBe(words.countFewer);
    expect(B.choices.countMore).toBe(words.countMore);
  });
  it('the every-age table: an empty bar never says "1 in 10", a full bar short of every one says "more than 9 in 10"', () => {
    const state = load('a', 'ages-A1');
    const root = renderScreen(state);
    clean(root, state);
    const r = state.answers.a.result;
    r.ages.forEach((row, k) => {
      const tr = root.querySelector(`[data-table="ages"] [data-age="${row.age}"]`);
      const on = tr.querySelectorAll('.bar-cell.is-on').length;
      const count = tr.querySelector('.count').textContent;
      if (on === 0) expect(count, `age ${row.age}`).not.toMatch(/^1 in 10$/);
      if (row.lasted > 0 && row.lasted < 0.05) expect(count, `age ${row.age}`).toBe(words.countFewer);
      if (row.lasted >= 0.95 && row.lasted < 1) expect(count, `age ${row.age}`).toBe(words.countMore);
      expect(k).toBeGreaterThanOrEqual(0);
    });
  });
  it('the grid on a phone: "<1" under 1 in 20 and ">9" from 95%', () => {
    const state = load('b', 'choices-B1');
    const r = state.answers.b.result;
    r.grid.ages[0].cells[0].lasted = 0.97;
    r.grid.ages[0].cells[0].outOfTen = outOfTen(0.97);
    r.grid.ages[0].cells[0].verdict = 'yes';
    const root = renderScreen(state);
    clean(root, state);
    const first = root.querySelector('[data-key="grid.ages.0.cells.0.lasted"]');
    expect(first.querySelector('.count-short').textContent).toBe('>9');
    expect(first.querySelector('.count-long').textContent).toBe(B.choices.countMore);
  });
});

describe('2 — "Try a change" keeps the keyboard where it was', () => {
  const cases = [
    ['c', 'answer-F1', 'c.try.pot.up', (s) => s.draft.c.values['you.pot']],
    ['a', 'answer-A1', 'a.try.spend.down', (s) => s.draft.a.values['spend.amount']],
    ['a', 'answer-A1', 'a.try.stop.up', (s) => s.draft.a.values['stop.age']],
    ['b', 'answer-B1', 'b.try.payIn.up', (s) => s.draft.b.values['you.payIn.total']]
  ];
  it.each(cases)('%s %s: after pressing %s the cursor is still on it, and it rests without being greyed out', (q, name, id, read) => {
    const page = live(load(q, name));
    try {
      const button = one(page.root, id);
      button.focus();
      expect(document.activeElement).toBe(button);
      button.click();
      const after = one(page.root, id);
      expect(after).toBe(button);                                   // the same button, not a new one
      expect(document.activeElement).toBe(button);
      expect(after.disabled).toBe(false);
      expect(after.getAttribute('aria-disabled')).toBe('true');     // resting while the answer is worked out
      const typed = read(page.store.getState());
      after.click();                                                // a second press does nothing
      expect(read(page.store.getState())).toBe(typed);
      clean(page.root, page.store.getState());
    } finally { page.done(); }
  });
  it('once the answer is in, the buttons are live again (no aria-disabled)', () => {
    const root = renderScreen(load('a', 'answer-A1'));
    for (const id of ['a.try.stop.up', 'a.try.spend.down', 'a.try.pot.up']) expect(one(root, id).getAttribute('aria-disabled'), id).toBe(null);
    const c = renderScreen(load('c', 'answer-F1'));
    for (const id of ['c.try.pot.up', 'c.try.start.up']) expect(one(c, id).getAttribute('aria-disabled'), id).toBe(null);
  });
});

describe('3 — the hand-over to "What is that a month?" is one line of words', () => {
  it.each([['a', 'answer-A1', 'a.next.c'], ['b', 'answer-B1', 'b.next.c']])('%s %s: %s holds its words in one span', (q, name, id) => {
    const root = renderScreen(load(q, name));
    const link = one(root, id);
    expect(link).not.toBe(null);
    expect(link.children.length).toBe(1);
    expect(link.children[0].tagName).toBe('SPAN');
    expect(link.children[0].textContent).toBe(link.textContent);
  });
  it('the styles keep a hand-over link in the "What next?" list from splitting into columns', () => {
    const css = readFileSync(join(process.cwd(), 'src/v7/styles/components.css'), 'utf8');
    expect(css).toMatch(/\.next-list \.btn\s*\{[^}]*display:\s*inline-block/);
  });
});

describe('4 — the rail on the every-age step', () => {
  it('says to press an age, and does not offer "See every age" on the step that is every age', () => {
    for (const name of ['ages-A1', 'answer-partial']) {
      const state = load('a', name);
      if (state.answers.a.extending) continue;                      // still arriving: "working"
      const rail = railFor(state);
      expect(rail.next.id, name).toBe('a.ages');
      expect(JSON.stringify(rail.next.button || {})).not.toContain('a.action.seeAges');
      const root = renderScreen(state);
      expect(one(root, 'rail.next').textContent).toContain(A.next['a.ages']);
    }
  });
  it('the same answer on the answer step still leads to every age', () => {
    const state = load('a', 'answer-A1');
    expect(railFor(state).next.id).toBe('a.close');
  });
});

describe('5 — the every-age table says why', () => {
  it('names the age a pension opens when the table has ages before it (with its key)', () => {
    const state = load('a', 'ages-A1');
    const r = state.answers.a.result;
    expect(r.ages.some((row) => row.age < r.pensionOpens.you)).toBe(true);
    const root = renderScreen(state);
    clean(root, state);
    const note = one(root, 'a.ages.closedNote');
    expect(note).not.toBe(null);
    expect(note.querySelector('[data-key="pensionOpens.you"]').getAttribute('data-value')).toBe(String(r.pensionOpens.you));
  });
  it('says nothing about it when every age in the table is one at which the pension is open', () => {
    const state = load('a', 'ages-A1');
    state.answers.a.result.pensionOpens = { you: 50 };
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.ages.closedNote')).toBe(null);
  });
  it('says the ages under 50 are left out, only when the person is under 50', () => {
    const state = load('a', 'ages-A1');
    expect(one(renderScreen(state), 'a.ages.from50')).toBe(null);
    const younger = clone(state);
    younger.answers.a.result.inputs.you.age = 45;
    const root = renderScreen(younger);
    clean(root, younger);
    expect(one(root, 'a.ages.from50')).not.toBe(null);
  });
});

describe('6 — B\'s levers', () => {
  it('"More risk while saving" has no "Try" when it does not help', () => {
    const state = load('b', 'answer-B1');
    state.answers.b.result.levers.moreRisk = { ...state.answers.b.result.levers.moreRisk, helps: false };
    expect(leverActions('moreRisk', state.answers.b.result)).toBe(null);
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-lever="moreRisk"]')).not.toBe(null);
    expect(one(root, 'b.lever.moreRisk.try')).toBe(null);
  });
  it('a lever the answer found nothing for, but wrote a sentence about, is said — with no "Try"', () => {
    const state = load('b', 'answer-B1');
    const r = state.answers.b.result;
    r.levers.stopLater = null;
    r.sentences.lever.stopLaterNone = { id: 'b.lever.stopLater.none', text: 'Stopping later alone, even at 70, did not get there.', parts: ['Stopping later alone, even at ', { fixed: '70' }, ', did not get there.'] };
    const root = renderScreen(state);
    clean(root, state);
    const card = root.querySelector('[data-lever-none="stopLater"]');
    expect(card).not.toBe(null);
    expect(card.textContent).toContain(r.sentences.lever.stopLaterNone.text);
    expect(card.querySelector('button')).toBe(null);
    expect(root.querySelector('[data-lever="stopLater"]')).toBe(null);
  });
});

describe('7 — no "risk while saving" to try with no saving years', () => {
  it('stopping now: no saving-risk buttons; stopping later: they are there', () => {
    expect(one(renderScreen(load('a', 'answer-stop-now')), 'a.try.savingRisk.balanced')).toBe(null);
    expect(one(renderScreen(load('a', 'answer-A1')), 'a.try.savingRisk.balanced')).not.toBe(null);
  });
});

describe('8 — Before / Now names the change', () => {
  it('the reducer keeps the inputs of the last final A or B answer beside its "Now" sentence', () => {
    for (const [q, name] of [['a', 'answer-A1'], ['b', 'answer-B1']]) {
      const state = load(q, name);
      const old = state.answers[q].result;
      const next = reduce(reduce(state, { type: 'draft/set', q, path: 'spend.amount', value: '1,800' }), { type: 'answer/working', q, inputsKey: 'K2' });
      expect(next.answers[q].before.change.text).toBe(old.sentences.change.text);
      expect(next.answers[q].before.inputs).toEqual(old.inputs);
      expect(JSON.parse(JSON.stringify(next.answers[q].before))).toEqual(next.answers[q].before);
    }
  });
  it('part-time years: the line says what changed', () => {
    const state = load('a', 'answer-A3-part-time');
    const r = state.answers.a.result;
    const was = clone(r.inputs);
    was.partTime = { ...was.partTime, years: r.inputs.partTime.years - 1 };
    state.answers.a.before = { change: { id: 'a.change', text: 'Now: close at 60, 8 futures out of 10.', parts: [] }, inputs: was };
    const root = renderScreen(state);
    clean(root, state);
    const changed = root.querySelector('.before-now [data-testid="a.try.changed"]');
    expect(changed).not.toBe(null);
    expect(changed.textContent).toContain(A.answer.changed.partTimeYears[0]);
    expect(changed.textContent).toContain(`${was.partTime.years} years`);
    expect(changed.textContent).toContain(`${r.inputs.partTime.years} years`);
  });
  it('the stop age and the spending: both named', () => {
    const state = load('a', 'answer-A1');
    const r = state.answers.a.result;
    const was = clone(r.inputs);
    was.stop = { ...was.stop, age: r.inputs.stop.age - 1 };
    was.spend = { ...was.spend, amount: r.inputs.spend.amount + 100 };
    state.answers.a.before = { change: { id: 'a.change', text: 'Now: no at 59.', parts: [] }, inputs: was };
    const text = one(renderScreen(state), 'a.try.changed').textContent;
    expect(text).toContain(String(r.inputs.stop.age - 1));
    expect(text).toContain('£2,000');
    expect(text).toContain('£1,900');
  });
  it('nothing kept from before: no "changed" line', () => {
    expect(one(renderScreen(load('a', 'answer-A1')), 'a.try.changed')).toBe(null);
  });
});

describe('9 — the "brought over" line', () => {
  const carried = (values) => {
    const state = load('b', 'numbers-blank');
    state.draft.b.values = { 'you.age': '50', 'you.pot': '250,000', 'stop.age': '60', 'spend.amount': '2,000', ...values };
    state.draft.b.carriedFrom = 'a';
    return state;
  };
  it('from A with nothing going in: asks for what goes in each month', () => {
    const root = renderScreen(carried({}));
    expect(one(root, 'b.carried').textContent).toBe(B.carried['a→b']);
  });
  it('from A with what goes in brought over too: asks to check it, naming it', () => {
    const state = carried({ 'you.payIn.total': '600' });
    const root = renderScreen(state);
    clean(root, state);
    const text = one(root, 'b.carried').textContent;
    expect(text).not.toBe(B.carried['a→b']);
    expect(text).toContain('£600');
    expect(text).not.toMatch(/add what goes into your pension/i);
  });
});

describe('10 — labels', () => {
  it('B asks for the age you would stop work; for two, the age when you both stop', () => {
    expect(B.fields['stop.age'].label).toMatch(/stop work/);
    const state = load('b', 'numbers-split-open');
    expect(renderScreen(state).querySelector('label[for="b.stop.age"]').textContent).toBe(B.fields['stop.age'].label);
    state.draft.b.values = { ...state.draft.b.values, household: 'couple', 'partner.age': '48' };
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('label[for="b.stop.age"]').textContent).toBe(B.fields['stop.age'].labelCouple);
  });
  it('A\'s ages for two: the header says the bracket is the partner\'s age', () => {
    const state = load('a', 'answer-A2-couple');
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-chart="ages"] thead th').textContent).toBe(A.answer.chartAgeCouple);
    expect(renderScreen(load('a', 'answer-A1')).querySelector('[data-chart="ages"] thead th').textContent).toBe(A.answer.chartAge);
  });
  it('"your part, a month" says the tax the government adds back is in it — in A, B and C', () => {
    for (const words of [A, B]) {
      expect(words.fields['you.payIn.own'].help).toMatch(/the tax the government adds back/);
      expect(words.fields['partner.payIn.own'].help).toMatch(/the tax the government adds back/);
    }
    expect(C.fields['you.payIn.own'].help).toMatch(/the tax the government adds back/);
  });
  it('no "a little" where the cut may be large', () => {
    for (const id of ['a.no.later', 'a.ages.none']) expect(A.next[id]).not.toMatch(/a little/);
  });
});

describe('11 — B\'s grid', () => {
  it('marks the column paid in now (and the one it needs, when it is a column)', () => {
    const state = load('b', 'choices-B1');
    const r = state.answers.b.result;
    const root = renderScreen(state);
    clean(root, state);
    const heads = [...root.querySelectorAll('[data-grid] thead th[data-pay-in]')];
    expect(heads.length).toBe(r.grid.payIns.length);
    for (const th of heads) {
      const p = Number(th.getAttribute('data-pay-in'));
      expect(th.hasAttribute('data-col-now'), String(p)).toBe(p === r.payIn.now);
      expect(th.hasAttribute('data-col-needed'), String(p)).toBe(p === r.payIn.needed);
    }
  });
  it('says so when no cell reaches 9 futures out of 10, and not when one does', () => {
    const state = load('b', 'choices-B1');
    const r = state.answers.b.result;
    for (const row of r.grid.ages) for (const cell of row.cells) { cell.lasted = 0.5; cell.outOfTen = outOfTen(0.5); cell.verdict = 'no'; }
    delete r.grid.reaches;
    delete r.sentences.gridNone;
    let root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'b.grid.none')).not.toBe(null);
    r.grid.ages[1].cells[2].lasted = 0.93;
    r.grid.ages[1].cells[2].outOfTen = outOfTen(0.93);
    r.grid.ages[1].cells[2].verdict = 'yes';
    root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'b.grid.none')).toBe(null);
  });
  it('for two: the line above the grid speaks of the younger of you', () => {
    const state = load('b', 'choices-B1');
    state.answers.b.result.inputs.household = 'couple';
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-region="answer"] .lead').textContent).toContain(B.choices.spendingEndCouple);
  });
});

describe('12 — the hand-overs to "What is that a month?"', () => {
  /** Whether the answer says C takes that age: its own handOver.c, or (an answer without it) the age a pension opens. */
  const takes = (r, age) => (r.handOver && r.handOver.c ? r.handOver.c.ok : age >= r.pensionOpens.you);
  it('A: named by the age the money would start; offered only where C takes that age', () => {
    for (const name of ['answer-A1', 'answer-A4', 'answer-yes', 'answer-A2-couple']) {
      const state = load('a', name);
      const r = state.answers.a.result;
      const root = renderScreen(state);
      clean(root, state);
      const link = one(root, 'a.next.c');
      expect(!!link, name).toBe(takes(r, r.shown.age));
      if (link) expect(link.querySelector('[data-key="shown.age"]').getAttribute('data-value')).toBe(String(r.shown.age));
    }
  });
  it('A: no answer of its own on the matter, a stop before a pension opens has no hand-over (C would refuse it)', () => {
    const early = load('a', 'answer-A4');
    delete early.answers.a.result.handOver;
    expect(early.answers.a.result.shown.age).toBeLessThan(early.answers.a.result.pensionOpens.you);
    expect(one(renderScreen(early), 'a.next.c')).toBe(null);
  });
  it('B: named by the stop age; offered only where C takes that age', () => {
    for (const name of ['answer-B1', 'answer-B4-before-57', 'answer-B5-couple']) {
      const state = load('b', name);
      const r = state.answers.b.result;
      const link = one(renderScreen(state), 'b.next.c');
      expect(!!link, name).toBe(takes(r, r.stop.age));
      if (link) expect(link.querySelector('[data-key="stop.age"]').getAttribute('data-value')).toBe(String(r.stop.age));
    }
  });
  it('when C does not ask everything the answer was given, the link says its figure can differ', () => {
    const state = load('a', 'answer-A1');
    state.answers.a.result.handOver = { c: { ok: true, same: false } };
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.next.c.differs').textContent).toBe(A.answer.toCDiffers);
    state.answers.a.result.handOver = { c: { ok: true, same: true } };
    expect(one(renderScreen(state), 'a.next.c.differs')).toBe(null);
    state.answers.a.result.handOver = { c: { ok: false, same: true } };
    expect(one(renderScreen(state), 'a.next.c')).toBe(null);
  });
  it('the keys a hand-over link reads are in the answer (nothing worked out on the screen)', () => {
    const state = load('a', 'answer-A1');
    expect(currentKey(state, 'a')).toBe(state.answers.a.inputsKey);
  });
});

describe('13 — no sentence said twice', () => {
  it('A, no age up to 75 worked: the headline says it, so the warning that says the same is not drawn under it', () => {
    const state = load('a', 'answer-ages-none');
    const r = state.answers.a.result;
    expect(r.headline.kind).toBe('noneWorked');
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-warning-id="not-in-range"]')).toBe(null);
    for (const w of r.warnings.filter((x) => x.id !== 'not-in-range')) expect(root.querySelector(`[data-warning-id="${w.id}"]`), w.id).not.toBe(null);
  });
});

describe('14 — B when no pension pot is needed, or none is enough', () => {
  const sentence = (id, text) => ({ id, text, parts: [text] });
  it('a £0 number: a headline in words, no "£0" as a target, and no number headline to key', () => {
    const state = load('b', 'answer-B2-on-course');
    const r = state.answers.b.result;
    r.number = { careful: 0, middling: 0, good: 0, byPerson: [{ who: 'you', pot: 0 }] };
    r.sentences.head = sentence('b.head.zero', 'No pension pot is needed for that a month');
    r.sentences.line = sentence('b.line.zero', 'Your savings and State Pension already pay for this: nothing more is needed in your pension.');
    r.sentences.sub = sentence('b.sub.zero', 'your savings and State Pension pay for it after tax from then, going up each year with prices');
    r.sentences.bad = { id: 'b.bad.zero', text: 'In a bad case (the worst 1 in 10), as things are now, your money lasts.',
      parts: ['In a bad case (the worst ', { fixed: '1' }, ' in ', { fixed: '10' }, '), as things are now, your money lasts.'] };
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-headline="number.careful"]')).toBe(null);
    const head = one(root, 'b.headline.noPot');
    expect(head).not.toBe(null);
    expect(head.textContent).toContain(r.sentences.line.text);
    expect(visibleText(root.querySelector('[data-region="answer"]'))).not.toMatch(/£0\b/);
  });
  it('no pot up to the most we try: the headline says so, and its sentence is said once', () => {
    const state = load('b', 'answer-B1');
    const r = state.answers.b.result;
    r.number = null;
    r.status = 'out-of-reach';
    r.sentences.head = sentence('b.head.none', 'More than the most we try');
    r.sentences.none = sentence('b.none.pot', 'No pot we tried paid it. The ways to make it fit are below.');
    r.sentences.line = r.sentences.none;
    delete r.sentences.payInHead;
    const root = renderScreen(state);
    expect(one(root, 'b.headline.noPot')).not.toBe(null);
    expect(visibleText(root).split(r.sentences.none.text).length - 1).toBe(1);
  });
});

describe('15 — the rail on the grid step', () => {
  it('says to press a cell (or, for two, to compare), and does not offer "two levers together" on the step that is it', () => {
    const state = load('b', 'choices-B1');
    const rail = railFor(state);
    expect(rail.next.id).toBe('b.choices');
    expect(JSON.stringify(rail.next.button || {})).not.toContain('b.action.together');
    const root = renderScreen(state);
    expect(one(root, 'rail.next').textContent).toContain(B.next['b.choices']);
    state.answers.b.result.inputs.household = 'couple';
    expect(one(renderScreen(state), 'rail.next').textContent).toContain(B.next['b.choices.couple']);
  });
});

describe('16 — "Try a change" for two', () => {
  const press = (state, id) => { const actions = []; const root = document.createElement('div'); root.id = 'app';
    render(h(App, { state, dispatch: (a) => actions.push(a) }), root); one(root, id).click(); return actions; };
  it('A: the partner\'s pot can be tried too', () => {
    const state = load('a', 'answer-A2-couple');
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.try.partnerPot.up')).not.toBe(null);
    expect(press(state, 'a.try.partnerPot.up')).toEqual([{ type: 'draft/set', q: 'a', path: 'partner.pot', value: '205,000' }]);
    expect(one(renderScreen(load('a', 'answer-A1')), 'a.try.partnerPot.up')).toBe(null);
  });
  it('B: what goes into the partner\'s pension can be tried too', () => {
    const state = load('b', 'answer-B5-couple');
    const root = renderScreen(state);
    clean(root, state);
    expect(press(state, 'b.try.partnerPayIn.up')).toEqual([{ type: 'draft/set', q: 'b', path: 'partner.payIn.total', value: '350' }, { type: 'draft/set', q: 'b', path: 'partner.payIn.kind', value: 'total' }]);
    expect(one(renderScreen(load('b', 'answer-B1')), 'b.try.partnerPayIn.up')).toBe(null);
  });
});

describe('17 — the grid\'s own words when no cell reaches 9 in 10', () => {
  it('the answer\'s sentence (b.grid.none) is drawn in place of the screen\'s own line', () => {
    const state = load('b', 'choices-B1');
    const r = state.answers.b.result;
    r.grid.reaches = false;
    r.sentences.gridNone = { id: 'b.grid.none', text: 'None of these lasted in 9 futures out of 10.', parts: ['None of these lasted in ', { fixed: '9' }, ' futures out of ', { fixed: '10' }, '.'] };
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'b.grid.none').getAttribute('data-sentence-id')).toBe('b.grid.none');
    expect(one(root, 'b.grid.none').textContent).toBe(r.sentences.gridNone.text);
  });
});
