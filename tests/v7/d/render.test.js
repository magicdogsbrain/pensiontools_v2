/**
 * Question D's screens (research/v7/answer-D.md 3; road-to-7.md step 7): every named state drawn in jsdom and held to
 * checkScreen's rules (R1–R16 and the scope rules — always the `retired` scope), then what each screen must show, what
 * each control sends, the levers, the way in, "Keep this as a plan" and the words. The states are tests/v7/states/d/*.json,
 * written by build-states.mjs --question d. The households are made up (Alex and Sam).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen, SCHEMA_D, get, readForm } from './_d.js';
import { checkScreen, draw, visibleText, expectedInputs, scopesFor, bannedHits } from '../render/checkScreen.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { verdictOf } from '../../../src/answers/shared/rules.js';
import { suggestedPlanName } from '../../../src/answers/shared/planName.js';
import { ADVICE_SHORT, ADVICE_FULL, FRONT } from '../../../src/v7/copy/common.js';
import { D } from '../../../src/v7/copy/d.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { LAYOUT_D } from '../../../src/v7/screens/d/NumbersScreen.jsx';
import { SHORT } from '../../../src/v7/screens/a/AnswerScreen.jsx';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { dWayIn, keepView } from '../../../src/v7/state/select.js';

vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

const DIR = join(process.cwd(), 'tests/v7/states/d');
/** The named states of D. */
const NAMES = [
  'numbers-blank', 'numbers-couple-open', 'numbers-more-open', 'numbers-still-working', 'numbers-way-in',
  'answer-nothing-entered', 'answer-working', 'answer-first', 'answer-D1', 'answer-yes', 'answer-no', 'answer-D2-couple', 'answer-D3-invested',
  'answer-D5-closed', 'answer-D7-work', 'answer-fall', 'answer-pensions-only', 'answer-assumed-open', 'answer-updating', 'answer-failed',
  'keep-no-answer', 'keep-D1'
];
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const set = (path, value) => ({ type: 'draft/set', q: 'd', path, value });
const withResult = NAMES.filter((n) => load(n).answers.d.result);
const replaced = (state) => reduce(initialState({ today: state.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state });
const press = (state, id) => { const { root, actions } = draw(state); one(root, id).click(); return actions; };

describe('D: the named states', () => {
  it('are exactly the ones named here', () => {
    expect(readdirSync(DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)).sort()).toEqual([...NAMES].sort());
  });
  it.each(NAMES)('%s survives JSON and is a whole state with D open', (name) => {
    const s = load(name);
    expect(Object.keys(s)).toEqual(expect.arrayContaining(['answers', 'draft', 'env', 'route', 'session', 'ui', 'keep']));
    expect(Object.keys(s.draft)).toContain('d');
    expect(s.route).toMatchObject({ screen: 'step', q: 'd' });
    expect(s.env.today).toBe('2026-09-30');
    expect(s.env.appVersion).toBe('6.38.0');
    // D's draft is C's shape: no saving-years fields (no carriedFrom, no spendHow)
    expect(Object.keys(s.draft.d).sort()).toEqual(['asked', 'revealed', 'touched', 'values']);
  });
  it.each(NAMES)('%s passes every rule of checkScreen', (name) => {
    const state = load(name);
    expect(checkScreen(renderScreen(state), state)).toEqual([]);
  });
  it.each(NAMES)('%s: drawing it changes nothing in the state', (name) => {
    const state = load(name);
    const before = JSON.stringify(state);
    renderScreen(state);
    expect(JSON.stringify(state)).toBe(before);
  });
  it.each(NAMES)('%s: every number on screen carries the answer\'s own value', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    for (const el of root.querySelectorAll('[data-value]')) {
      const key = el.getAttribute('data-key');
      expect(Number(el.getAttribute('data-value')), key).toBe(get(state.answers.d.result, key));
    }
    expect(visibleText(root)).not.toMatch(/undefined|NaN|-£0|−£0/);
  });
  it.each(NAMES)('%s: the retired rules on every state — no countdown, no stop-work date, no "when you retire"', (name) => {
    const state = load(name);
    expect(scopesFor(state)).toEqual(['all', 'first', 'planner', 'retired']);
    const text = visibleText(renderScreen(state));
    expect(text).not.toMatch(/\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i);
    expect(text).not.toMatch(/when you retire|until you retire|years to go|plan starts|countdown/i);
    expect(bannedHits(text, scopesFor(state))).toEqual([]);
  });
  it('every answer in a state is the real answerD — nothing is hand-made (re-run in tests/v7/states/states.slow.test.js)', () => {
    expect(MADE.answer).toBe('src/answers/d/answer.js');
    expect(MADE.patched).toEqual([]);
    expect(MADE.futures).toBe(1000);
    for (const name of withResult) expect(load(name).answers.d.result.basis.futures, name).toBe(name === 'answer-first' ? 100 : 1000);
  });
});

describe('D: the numbers step', () => {
  it('draws the person in the order of the drawing, the spending on the same form, and "Will it last?" as the one button', () => {
    const root = renderScreen(load('numbers-blank'));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('d.numbers');
    expect(root.querySelector('h1').textContent).toBe(D.steps.numbers.label);
    const fields = [...root.querySelectorAll('[data-field]')].map((el) => el.getAttribute('data-field'));
    const top = LAYOUT_D.you.filter((p) => fields.includes(p));
    expect(top).toEqual(LAYOUT_D.you.filter((p) => p !== 'isaGrowth'));              // "How your savings grow" only once there is money in savings
    expect(fields.indexOf('stopped')).toBeLessThan(fields.indexOf('you.age'));
    expect(fields.indexOf('you.taxFreeTaken')).toBeLessThan(fields.indexOf('spend.kind'));
    expect(one(root, 'd.action.show').textContent).toBe(D.buttons.show);
    expect(one(root, 'd.action.show').getAttribute('type')).toBe('submit');
    expect(one(root, 'd.wayIn')).toBe(null);
    expect(one(root, 'd.action.fullDetail').getAttribute('href')).toBe('#/soon/e');
  });
  it('the tax-free part is a choice of three with nothing ticked until chosen (never a guess)', () => {
    const root = renderScreen(load('numbers-blank'));
    const radios = [...root.querySelectorAll('[name="d.you.taxFreeTaken"]')];
    expect(radios.map((r) => r.value)).toEqual(['no', 'yes', 'some']);
    expect(radios.some((r) => r.checked)).toBe(false);
  });
  it('"Not yet" under "Have you stopped work?" says, in that box\'s own sentence, that the stop-work question is theirs', () => {
    const root = renderScreen(load('numbers-still-working'));
    const error = root.querySelector('[data-error-for="d.stopped"]');
    expect(error.textContent).toBe(D.fields.stopped.errors['d-still-working']);
    expect(one(root, 'd.stopped.notYet').checked).toBe(true);
  });
  it('a couple: both of you have stopped; the partner block asks their tax-free part too', () => {
    const root = renderScreen(load('numbers-couple-open'));
    const fields = [...root.querySelectorAll('[data-field]')].map((el) => el.getAttribute('data-field'));
    for (const p of LAYOUT_D.partner) expect(fields, p).toContain(p);
    expect(one(root, 'd.action.removePartner')).not.toBe(null);
    expect(root.textContent).toContain(D.numbers.partnerDone);
  });
  it('more detail: the risk level, the charge and the end age', () => {
    const root = renderScreen(load('numbers-more-open'));
    for (const p of LAYOUT_D.more) expect(root.querySelector(`[data-field="${p}"]`), p).not.toBe(null);
    expect(one(root, 'd.endAge').getAttribute('placeholder')).toBe('95');
  });
  it('typing sends draft/set; the form reads back what the state holds', () => {
    const state = load('numbers-more-open');
    const { root, actions } = draw(state);
    const box = one(root, 'd.you.pot');
    box.value = '310,000';
    fire(box, 'input');
    expect(actions).toEqual([set('you.pot', '310,000')]);
    const back = readForm(renderScreen(state), 'd', SCHEMA_D);
    for (const [path, v] of Object.entries(state.draft.d.values)) if (typeof v === 'string') expect(back[path], path).toBe(v);
  });
  it('the way in (answer-D.md 3.10): a plan in the account or this window is offered first, at its own "Does it last?"', () => {
    const state = load('numbers-way-in');
    expect(dWayIn(state)).toEqual({ known: true, plans: [{ id: 'guest-wayin001', name: 'Kept from a first answer', locked: false }] });
    const root = renderScreen(state);
    const block = one(root, 'd.wayIn');
    expect(block.textContent).toContain(D.numbers.hasPlan);
    expect(block.textContent).toContain(D.numbers.orAfresh);
    const link = one(root, 'd.wayIn.guest-wayin001');
    expect(link.getAttribute('href')).toBe('#/plan/guest-wayin001/lasts');
    expect(link.textContent).toBe(D.buttons.openPlan.replace('{name}', 'Kept from a first answer'));
    // the form is still there, under it: the test afresh
    expect(one(root, 'd.action.show')).not.toBe(null);
    // before the plans are read, nothing is claimed either way
    expect(dWayIn(load('numbers-blank'))).toEqual({ known: false, plans: [] });
  });
});

describe('D: the answer step', () => {
  it('asks for the four things on the step itself when nothing is entered (rule R3)', () => {
    const root = renderScreen(load('answer-nothing-entered'));
    expect(root.textContent).toContain(D.answer.needFour);
    for (const p of SHORT.d) expect(root.querySelector(`[data-field="${p}"]`), p).not.toBe(null);
    expect(one(root, 'd.action.show').textContent).toBe(D.buttons.show);
    expect(expectedInputs(load('answer-nothing-entered'))).toContain('d.you.taxFreeTaken.some');
  });
  it('working, a first figure, updating, failed', () => {
    expect(renderScreen(load('answer-working')).querySelector('.working')).not.toBe(null);
    expect(renderScreen(load('answer-first')).textContent).toContain(D.answer.first);
    const updating = renderScreen(load('answer-updating'));
    expect(updating.querySelector('[data-region="answer"]').getAttribute('aria-busy')).toBe('true');
    expect(updating.textContent).toContain(D.answer.updating);
    const failed = renderScreen(load('answer-failed'));
    expect(failed.textContent).toContain(D.answer.failedTitle);
    expect(one(failed, 'd.action.retry')).not.toBe(null);
    expect(one(failed, 'd.action.change').getAttribute('href')).toBe('#/d/numbers');
  });
  it.each(withResult.filter((n) => n.startsWith('answer-') && load(n).answers.d.result.status === 'ok'))('%s: the verdict is the rule on the count, in words and a token; the sentences are the answer\'s', (name) => {
    const state = load(name);
    const r = state.answers.d.result;
    const root = renderScreen(state);
    const band = root.querySelector('[data-headline="verdict"] [data-verdict]');
    expect(band.getAttribute('data-verdict')).toBe(verdictOf(r.fails, r.basis.futures));
    expect(band.getAttribute('data-verdict')).toBe(r.verdict);
    expect(band.querySelector('#answer-figure').textContent).toBe(r.sentences.head.text);
    const head = root.querySelector('[data-headline="verdict"]');
    expect(head.querySelector('[data-sentence="verdict"]').textContent).toBe(r.sentences.line.text);
    expect(head.textContent).toContain(r.sentences.bad.text);
    expect(head.textContent).toContain(ADVICE_SHORT);
    for (const w of r.warnings) expect(root.querySelector(`[data-warning-id="${w.id}"]`).textContent).toContain(w.text);
    expect(root.querySelector('[data-region="footer"]').textContent).toContain(ADVICE_FULL);
  });
  it.each(withResult.filter((n) => n.startsWith('answer-') && load(n).answers.d.result.status === 'ok'))('%s: "Could I spend more?" is the headroom line and the band in full', (name) => {
    const state = load(name);
    const r = state.answers.d.result;
    const root = renderScreen(state);
    const block = one(root, 'd.more');
    expect(block.querySelector('h2').textContent).toBe(D.answer.moreTitle);
    const line = one(root, 'd.answer.headroom');
    expect(line.textContent).toBe(r.sentences.headroom.text);
    expect(line.getAttribute('data-headroom')).toBe(r.headroom.kind);
    expect(block.textContent).toContain(r.sentences.middling.text);
    expect(block.textContent).toContain(r.sentences.good.text);
    expect(one(root, 'd.more.key').textContent).toBe(D.answer.moreNote);
    // the headroom never contradicts the verdict (answer-D.md 3.4)
    if (r.verdict === 'yes') expect(['more', 'about']).toContain(r.headroom.kind);
    else expect(['less', 'about']).toContain(r.headroom.kind);
  });
  it('the three headrooms are all drawn somewhere: more (a yes), less (a no), and the band', () => {
    expect(load('answer-yes').answers.d.result.headroom.kind).toBe('more');
    expect(load('answer-no').answers.d.result.headroom.kind).toBe('less');
    expect(load('answer-D1').answers.d.result.verdict).toBe('close');
  });
  it('what it is made of: the answer\'s lines, in order', () => {
    const state = load('answer-D3-invested');
    const r = state.answers.d.result;
    const root = renderScreen(state);
    const lines = [...root.querySelectorAll('.made-of-list li')].map((li) => li.textContent);
    expect(lines).toEqual(r.sentences.madeOf.map((s) => s.text));
    expect(root.querySelector('.made-of').getAttribute('data-open')).toBe('1');
  });
  it('no pot, no savings: the verdict on the pensions alone, then the State Pension only, in words; no levers, no "Could I spend more?"', () => {
    const state = load('answer-pensions-only');
    const r = state.answers.d.result;
    expect(r.status).toBe('guaranteed-only');
    const root = renderScreen(state);
    expect(root.querySelector('[data-verdict]').getAttribute('data-verdict')).toBe(r.verdict);
    expect(one(root, 'd.answer.nothing').textContent).toBe(r.sentences.nothing.text);
    expect(one(root, 'd.lever.work')).toBe(null);
    expect(one(root, 'd.lever.fall')).toBe(null);
    expect(one(root, 'd.more')).toBe(null);
  });
  it('a couple: "Your partner still working?" offers the stop-work question about them', () => {
    const root = renderScreen(load('answer-D2-couple'));
    const next = root.querySelector('[data-region="next"]');
    expect(next.textContent).toContain(D.answer.partnerWorking);
    expect(one(root, 'd.next.a.partner').getAttribute('href')).toBe('#/a/numbers');
    const single = renderScreen(load('answer-D1'));
    expect(single.querySelector('[data-region="next"]').textContent).toContain(D.answer.stillWorking);
    expect(one(single, 'd.next.a').getAttribute('href')).toBe('#/a/numbers');
    expect(one(single, 'd.next.a.partner')).toBe(null);
  });
});

describe('D: the levers, tried on the answer\'s own lives (answer-D.md 3.6, 3.7)', () => {
  it('"Would some work help?" off: the two boxes and "Try it", which fills a sensible start into empty boxes and turns the work on', () => {
    const state = load('answer-D1');
    const root = renderScreen(state);
    const block = one(root, 'd.lever.work');
    expect(block.getAttribute('data-lever-on')).toBe('0');
    expect(block.querySelector('h2').textContent).toBe(D.answer.workTitle);
    expect(one(root, 'd.try.work.yearly').value).toBe('');
    expect(one(root, 'd.try.work.years').value).toBe('');
    expect(one(root, 'd.work.result')).toBe(null);
    expect(press(state, 'd.lever.work.try')).toEqual([set('work.yearly', '12,000'), set('work.years', '3'), set('work.has', true)]);
    // boxes already filled: only the switch
    const filled = { ...state, draft: { ...state.draft, d: { ...state.draft.d, values: { ...state.draft.d.values, 'work.yearly': '15,000', 'work.years': '2' } } } };
    expect(press(filled, 'd.lever.work.try')).toEqual([set('work.has', true)]);
    const { root: r2, actions } = draw(filled);
    const box = one(r2, 'd.try.work.years');
    box.value = '4';
    fire(box, 'input');
    expect(actions).toEqual([set('work.years', '4')]);
  });
  it('"Would some work help?" on: the answer\'s sentences, year by year, and "Take the work away"', () => {
    const state = load('answer-D7-work');
    const r = state.answers.d.result;
    expect(r.work).not.toBe(null);
    const root = renderScreen(state);
    const block = one(root, 'd.lever.work');
    expect(block.getAttribute('data-lever-on')).toBe('1');
    expect(one(root, 'd.try.work.yearly').value).toBe('15,000');
    expect(one(root, 'd.try.work.years').value).toBe('3');
    const result = one(root, 'd.work.result');
    expect(result.textContent).toContain(r.sentences.work.text);
    expect(result.textContent).toContain(r.sentences.workBad.text);
    expect(result.textContent).toContain(r.sentences.workCareful.text);
    const rows = [...result.querySelectorAll('.work-rows li')].map((li) => li.textContent);
    expect(rows).toEqual(r.sentences.workRows.map((s) => s.text));
    expect(rows.length).toBe(r.work.byYears.length);
    expect(r.work.byYears.map((y) => y.years)).toEqual([1, 2, 3, 4, 5]);
    expect(press(state, 'd.lever.work.off')).toEqual([set('work.has', false)]);
    // the work never lowers the share that lasted (answer-D.md 3.6)
    expect(r.work.lasted).toBeGreaterThanOrEqual(r.lasted);
  });
  it('"What if shares fell by a fifth?": one press on, the answer\'s sentences, "Put the shares back"', () => {
    const off = load('answer-D1');
    const rootOff = renderScreen(off);
    expect(one(rootOff, 'd.lever.fall').getAttribute('data-lever-on')).toBe('0');
    expect(one(rootOff, 'd.fall.result')).toBe(null);
    expect(press(off, 'd.lever.fall.try')).toEqual([set('fall.has', true)]);
    const on = load('answer-fall');
    const r = on.answers.d.result;
    expect(r.fall).toMatchObject({ share: 0.2 });
    const root = renderScreen(on);
    expect(one(root, 'd.lever.fall').getAttribute('data-lever-on')).toBe('1');
    const result = one(root, 'd.fall.result');
    expect(result.textContent).toContain(r.sentences.fall.text);
    expect(result.textContent).toContain(r.sentences.fallCareful.text);
    expect(press(on, 'd.lever.fall.off')).toEqual([set('fall.has', false)]);
    // a fall never raises the share that lasted (answer-D.md 3.7)
    expect(r.fall.lasted).toBeLessThanOrEqual(r.lasted);
    expect(r.fall.monthly.careful).toBeLessThanOrEqual(r.monthly.careful);
  });
  it('a lever not opened costs nothing: the answer without a lever holds no work and no fall', () => {
    const r = load('answer-D1').answers.d.result;
    expect(r.work).toBe(null);
    expect(r.fall).toBe(null);
  });
});

describe('D: "Keep this as a plan" (road-to-7.md step 7)', () => {
  it('at the foot of the answer: the name box holds the suggestion; "Keep as a plan"', () => {
    const state = load('answer-D1');
    const r = state.answers.d.result;
    const root = renderScreen(state);
    const box = one(root, 'd.keep.name');
    expect(box.value).toBe(suggestedPlanName('d', r.inputs, r));
    expect(box.value).toBe('From 68 · £2,100 a month');
    expect(one(root, 'd.action.save').textContent).toBe(KEEP.save);
    expect(root.querySelector('[data-region="keep"] h2').textContent).toBe(KEEP.title);
  });
  it('the keep step: the answer\'s own sentence, the panel, the way back; with nothing to keep it says so', () => {
    const root = renderScreen(load('keep-D1'));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('d.keep');
    expect(root.querySelector('h1').textContent).toBe(D.steps.keep.label);
    expect(one(root, 'd.keep.summary')).not.toBe(null);
    expect(one(root, 'd.keep.name')).not.toBe(null);
    expect(one(root, 'd.keep.back').getAttribute('href')).toBe('#/d/answer');
    const none = renderScreen(load('keep-no-answer'));
    expect(one(none, 'd.keep.why').textContent).toBe(KEEP.why.noAnswer);
    expect(one(none, 'd.keep.name')).toBe(null);
  });
  it('with a locked plan in the account (answer-D.md 3.8): "Keep as a separate plan", and no lock offered after keeping', () => {
    const base = replaced(load('answer-D1'));
    const s = [{ type: ACT.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } },
      { type: ACT.PLANS_SET, list: [{ plan: { id: 'Kq8LwT2mJv5PzYc9BnRd', planDetails: { name: 'The one I follow' }, decisionTool: { settings: { locked: true } } }, newer: false, failed: false }], source: 'account', readAt: '14:03' }]
      .reduce((st, a) => reduce(st, a), base);
    expect(keepView(s, 'd').separate).toBe(true);
    const root = renderScreen(s);
    expect(root.querySelector('[data-region="keep"] h2').textContent).toBe(KEEP.titleSeparate);
    expect(one(root, 'd.action.save').textContent).toBe(KEEP.saveSeparate);
    expect(one(root, 'd.keep.separate').textContent).toBe(KEEP.separate);
    const made = reduce(s, { type: ACT.KEEP_MADE, q: 'd', id: 'NewPlanAbc123', name: 'From 68 · £2,100 a month', where: 'account', separate: true });
    const root2 = renderScreen(made);
    expect(one(root2, 'd.keep.made').textContent).toContain(KEEP.madeSeparate);
    expect(one(root2, 'd.keep.lock')).toBe(null);
    expect(one(root2, 'd.keep.plans').getAttribute('href')).toBe('#/plans');
    expect(checkScreen(root2, made)).toEqual([]);
    // without a locked plan: not separate, and "Lock this plan?" after keeping
    expect(keepView(base, 'd').separate).toBe(false);
    const plain = reduce(base, { type: ACT.KEEP_MADE, q: 'd', id: 'NewPlanAbc123', name: 'From 68 · £2,100 a month', where: 'account' });
    expect(one(renderScreen(plain), 'd.keep.lock').getAttribute('href')).toBe('#/plan/NewPlanAbc123/lock');
  });
});

describe('D: the front door and the words', () => {
  it('the front door leads D to its numbers step, with its line', () => {
    const q = FRONT.questions.find((x) => x.id === 'd');
    expect(q.more).toBeTruthy();
    const root = renderScreen(initialState({ today: '2026-09-30', build: 'test' }));
    const el = one(root, 'front.q.d');
    expect(el.getAttribute('href')).toBe('#/d/numbers');
    expect(el.textContent).not.toContain(FRONT.notYet);
  });
  it('every field path has a label; every choice has words for each option', () => {
    for (const f of SCHEMA_D.fields) {
      expect(D.fields[f.path]?.label, f.path).toBeTruthy();
      for (const o of f.options || []) expect(D.fields[f.path].options[o], `${f.path}: ${o}`).toBeTruthy();
      if (f.type === 'yesNo') expect(D.fields[f.path].options.yes && D.fields[f.path].options.no, f.path).toBeTruthy();
    }
    expect(Object.keys(D.fields).sort()).toEqual(SCHEMA_D.fields.map((f) => f.path).sort());
  });
  it('every message a field can get has a sentence — its own, or the one for its kind; every rule its own', () => {
    for (const f of SCHEMA_D.fields.filter((x) => ['money', 'age', 'percent', 'count'].includes(x.type))) {
      for (const id of ['required', 'notANumber', 'tooLow', 'tooHigh']) expect(D.fields[f.path].errors?.[id] || D.errors[f.type][id], `${f.path} ${id}`).toBeTruthy();
    }
    for (const rule of SCHEMA_D.rules) expect(D.fields[rule.fields[0]].errors[rule.id], rule.id).toBeTruthy();
  });
  it('every step and every next sentence of the rail has its words', async () => {
    const { QUESTION_D, NEXT_D } = await import('../../../src/v7/rail/d.js');
    for (const s of QUESTION_D.steps) { expect(D.steps[s.id].label, s.id).toBeTruthy(); expect(D.steps[s.id].short, s.id).toBeTruthy(); }
    for (const id of NEXT_D) expect(D.next[id], id).toBeTruthy();
    expect(QUESTION_D.steps.map((s) => s.id)).toEqual(['numbers', 'answer', 'keep']);
  });
  it('the draft of each named answer parses to the inputs the answer was worked out from', () => {
    for (const name of withResult) {
      const s = load(name);
      if (s.answers.d.status === 'working' && name === 'answer-updating') continue;
      const parsed = parseDraft(SCHEMA_D, s.draft.d.values, s.env);
      expect(parsed.ok, name).toBe(true);
      expect(parsed.inputs, name).toEqual(s.answers.d.result.inputs);
    }
  });
});
