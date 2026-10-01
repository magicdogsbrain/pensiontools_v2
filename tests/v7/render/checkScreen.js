/**
 * checkScreen(root, state) — the rules every drawn V7 screen must keep (test plan section 5, R1–R12; build brief
 * section 6, P4; step 4 test plan 10.2, R13–R16 and the scope rules of 10.3). One helper, run on every named state of
 * questions C, A and B in jsdom; it uses nothing jsdom-only, so the browser tests can run the same rules on the live page.
 *
 * It returns a list of problems in plain words. An empty list is a pass:  expect(checkScreen(root, state)).toEqual([])
 *
 *   R1  no rubbish on screen (undefined, NaN, null, -£0, an unfilled {slot} …)
 *   R2  every number is the answer's number: data-key → the same raw value in data-value, text by format.js
 *   R3  no digit inside [data-region="answer"] outside [data-value] / [data-fixed] — the screen works out nothing
 *   R4  every headline is complete: a number (A: the verdict in words), its sentence, the bad-case line,
 *       ADVICE_SHORT, what was assumed (C: inside the headline; A and B: in the answer)
 *   R5  what was assumed is all there, in order, each with its "Change" link where it has a field
 *   R6  the same key always carries the same value
 *   R7  the form is the input list: exactly the fields that apply, each with its test id, a label and the state's value
 *   R8  round trip: what readForm reads back is what the state holds
 *   R9  one main heading, no skipped level
 *   R10 "1 year", never "1 years"
 *   R11 the banned list, by scope
 *   R12 money looks like money: whole pounds, no pence, no minus
 *   R13 A's ages are a table a reader can follow: one row per ages[] entry, in order, the shown age marked, each
 *       row's keys inside its own entry (a "row k shows row k + 1" goes red here)
 *   R14 a verdict is a word and a colour token, never only a colour: [data-verdict] is yes|close|no with words
 *   R15 B's levers side by side: one [data-lever] per lever the answer found, in order, each with its "Try" but accept
 *       (and "more risk" that does not help); a lever found null is never a [data-lever] (its sentence, if any, is
 *       [data-lever-none], with no "Try")
 *   R16 a pot looks like a pot (whole £1,000); a percent like a percent
 *   plus: the page contract of brief 4.9 / step 4 4.13 (data-screen, data-question, data-view, regions, the rail's
 *   marks), unique ids, labelled controls, links that lead somewhere, no tab order other than the page's own.
 */
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { money, ageText, pot, outOfTen, get } from '../../../src/answers/shared/format.js';
import { parse, format, screenName } from '../../../src/v7/router/routes.js';
import { BUILT } from '../../../src/v7/rail/questions.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { isRetired } from '../../../src/v7/state/select.js';
import { BANNED, QUESTION_EXEMPT } from '../../../src/v7/copy/banned.js';
import { ADVICE_SHORT, ADVICE_FULL } from '../../../src/v7/copy/common.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { SHORT } from '../../../src/v7/screens/a/AnswerScreen.jsx';
import { LEVERS } from '../../../src/v7/components/Levers.jsx';
import { readForm } from '../c/_c.js';
import { readForm as readSaverForm } from '../a/_a.js';

/** Draws App for a state with a dispatch the test can watch. Returns { root, actions }. */
export function draw(state, dispatch) {
  const actions = [];
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: dispatch || ((a) => { actions.push(a); }) }), root);
  return { root, actions };
}

const INLINE = new Set(['SPAN', 'A', 'B', 'STRONG', 'EM', 'I', 'SMALL', 'ABBR']);
const BOXES = new Set(['INPUT', 'SELECT', 'TEXTAREA']);

/**
 * The words a person reads, in order. A box becomes "[ ]" (what was typed is the visitor's own text and is not
 * checked as wording); every element that starts a new line starts a new line here. Hidden parts are left out.
 */
export function visibleText(node) {
  let out = '';
  const walk = (n) => {
    if (n.nodeType === 3) { out += n.nodeValue; return; }
    if (n.nodeType !== 1) return;
    if (n.hasAttribute('hidden') || n.tagName === 'SCRIPT' || n.tagName === 'STYLE') return;
    if (BOXES.has(n.tagName)) { out += n.type === 'radio' || n.type === 'checkbox' ? '' : ' [ ] '; return; }
    const block = !INLINE.has(n.tagName);
    if (block) out += '\n';
    for (const c of n.childNodes) walk(c);
    if (block) out += '\n';
  };
  walk(node);
  return out.replace(/[ \t]+/g, ' ').replace(/ ?\n[\n ]*/g, '\n').trim();
}

/** One sentence (or one line of a band) at a time — `allow` and `double-about` are tested that way. */
const sentencesOf = (text) => text.split(/\n|(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

/**
 * The banned list over some words. `scopes` says which entries apply; `context` is the whole screen (for the
 * entries that need their explanation on the same screen); `question: true` for words the visitor is quoted saying.
 * @returns {string[]} one line per hit: id, the text found, what to say instead
 */
export function bannedHits(text, scopes, { context = text, question = false, skip = [] } = {}) {
  const hits = [];
  for (const entry of BANNED) {
    if (!scopes.includes(entry.scope) || skip.includes(entry.id)) continue;
    if (question && QUESTION_EXEMPT.includes(entry.id)) continue;
    if (entry.kind === 'explain') {
      const m = entry.re.exec(text);
      if (m && !entry.needs.test(context)) hits.push(`${entry.id}: "${m[0]}" needs its explanation (${entry.needs}) on the same screen`);
      continue;
    }
    for (const sentence of sentencesOf(text)) {
      const m = entry.re.exec(sentence);
      if (!m) continue;
      if ((entry.allow || []).some((a) => a instanceof RegExp && a.test(sentence))) continue;
      hits.push(`${entry.id}: "${m[0]}" in "${sentence}" — say: ${entry.say}`);
    }
  }
  return hits;
}

/** The input list of each question, and the question a state's route is about ('c' away from a question). */
export const SCHEMA_OF = { a: SCHEMA_A, b: SCHEMA_B, c: SCHEMA_C };
const SAVER = ['a', 'b'];
export const questionOf = (state) => (state.route.screen === 'step' && SCHEMA_OF[state.route.q] && state.draft[state.route.q] ? state.route.q : 'c');

/** A or B with the stop at today's age or before (stopping now), or the retired view: the `retired` rules apply too. */
export function stopsNow(state, q) {
  if (!SAVER.includes(q) || !state.draft[q]) return false;
  if (isRetired(state, q)) return true;
  const v = parseDraft(SCHEMA_OF[q], state.draft[q].values, state.env).values;
  return typeof v['stop.age'] === 'number' && typeof v['you.age'] === 'number' && v['stop.age'] <= v['you.age'] && v['stop.kind'] !== 'ages';
}

/**
 * Which scopes of the banned list apply to a drawn state (language guide 3.2; brief 2.2 #25: all of C is "retired";
 * step 4 brief conflict 47: every A and B state is "saver" — no countdown — and "retired" when stopping now).
 */
export function scopesFor(state) {
  const name = screenName(state.route);
  if (name === 'front') return ['all', 'first', 'front'];
  if (state.route.q === 'c') return ['all', 'first', 'planner', 'retired'];
  if (state.route.screen === 'step' && SAVER.includes(state.route.q)) {
    return stopsNow(state, state.route.q) ? ['all', 'first', 'planner', 'saver', 'retired'] : ['all', 'first', 'planner', 'saver'];
  }
  return ['all', 'first'];
}

const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const moreOf = (q) => SCHEMA_OF[q].fields.filter((f) => f.group === 'more').map((f) => f.path);

/** What a field shows when nothing is typed: the checked value (defaults by rule included), else the plain default. */
export function shownValues(state, q = 'c') {
  const schema = SCHEMA_OF[q];
  const draft = state.draft[q].values;
  const parsed = parseDraft(schema, draft, state.env);
  const shown = {};
  for (const f of schema.fields) {
    if (!blank(draft[f.path])) shown[f.path] = draft[f.path];
    else if (parsed.values[f.path] !== undefined) shown[f.path] = parsed.values[f.path];
    else if ('default' in f && (f.default === null || typeof f.default !== 'object')) shown[f.path] = f.default;
  }
  return { draft, parsed, shown };
}

export function moreIsOpen(state, q = 'c') {
  const draft = state.draft[q].values;
  const more = moreOf(q);
  return state.ui.open.includes('more') || more.some((p) => !blank(draft[p])) || more.includes(state.route.focus);
}

/** The boxes that are not a field's own: test id → the path they write. */
export const TRY_BOXES = { 'a.try.partTime.yearly': 'partTime.yearly' };

/** Which of short form / failed / working / answer an A or B step draws (the screen's rule, written again here). */
export function saverKind(state, q) {
  const { parsed } = shownValues(state, q);
  const a = state.answers[q] || {};
  const usable = !!a.result && a.result.status !== 'invalid' && a.status !== 'failed';
  if (Object.keys(parsed.errors).length || (!parsed.ok && !usable)) return 'short';
  if (a.status === 'failed' || (a.result && a.result.status === 'invalid')) return 'failed';
  if (!a.result) return 'working';
  return 'answer';
}

const idsOf = (q, fields) => {
  const ids = [];
  for (const f of fields) {
    if (f.type === 'choice') for (const o of f.options) ids.push(`${q}.${f.path}.${o}`);
    else if (f.type === 'yesNo') ids.push(`${q}.${f.path}.no`, `${q}.${f.path}.yes`);
    else ids.push(`${q}.${f.path}`);
  }
  return ids;
};

/** The test ids of the boxes a state must draw — no more, no fewer (R7). */
export function expectedInputs(state) {
  const name = screenName(state.route);
  if (name === 'front') return ['front.c.pot'];
  const q = state.route.q;
  if (SAVER.includes(q) && state.draft[q]) return expectedSaverInputs(state, q, name);
  if (name !== 'c.numbers' && name !== 'c.answer') return [];
  const { parsed, shown } = shownValues(state);
  const applies = (f) => Object.entries(f.when || {}).every(([p, want]) => shown[p] === want);
  let fields;
  if (name === 'c.numbers') {
    fields = SCHEMA_C.fields.filter((f) => f.path !== 'household' && f.group !== 'try' && applies(f) && (f.group !== 'more' || moreIsOpen(state)));
  } else {
    const wrong = Object.keys(parsed.errors).filter((p) => p !== 'take');
    const a = state.answers.c;
    const usable = !!a.result && a.result.status !== 'invalid' && a.status !== 'failed';
    if (wrong.length || (!parsed.ok && !usable)) {
      const need = new Set(['you.pot', 'you.age', ...Object.keys(parsed.errors)]);
      fields = SCHEMA_C.fields.filter((f) => need.has(f.path));
    } else if (usable) {
      fields = SCHEMA_C.fields.filter((f) => f.path === 'take');
    } else fields = [];
  }
  return idsOf('c', fields);
}

function expectedSaverInputs(state, q, name) {
  if (name === 'notBuilt' || isRetired(state, q)) return [];
  const schema = SCHEMA_OF[q];
  const { parsed, shown } = shownValues(state, q);
  const applies = (f) => Object.entries(f.when || {}).every(([p, want]) => shown[p] === want);
  if (name === `${q}.numbers`) {
    const open = moreIsOpen(state, q);
    return idsOf(q, schema.fields.filter((f) => f.path !== 'household' && applies(f) && (f.group !== 'more' || open)));
  }
  const kind = saverKind(state, q);
  if (kind === 'short') {
    const top = SHORT[q];
    const inside = (f) => Object.keys(f.when || {}).some((p) => top.includes(p));
    return idsOf(q, schema.fields.filter((f) => applies(f) && (top.includes(f.path) || inside(f) || parsed.errors[f.path])));
  }
  if (kind === 'answer' && name === 'a.answer') return ['a.try.partTime.yearly'];
  return [];
}

const RUBBISH = [/undefined/, /\bNaN\b/, /\bnull\b/, /Infinity/, /\[object/, /-£0\b/, /−£0\b/, /£\s?[-−]/, /£NaN/, /[{}]/];
const MONEY = /^£\d{1,3}(,\d{3})*$/;
const COUNT_WORDS = { a: A.answer, b: B.choices, c: A.answer };

/** The value a data-key names: `before.…` is the answer kept from before a change; everything else is in the result. */
function valueAt(state, q, key) {
  const a = state.answers[q] || {};
  return key.startsWith('before.') ? get(a, key) : get(a.result, key);
}

/** The steps of a question's rail, from its step list. */
const stepsOf = (q) => (BUILT[q] ? BUILT[q].steps.map((s) => s.id) : []);

export function checkScreen(root, state) {
  const problems = [];
  const say = (rule, text) => problems.push(`${rule}: ${text}`);
  const all = (sel, from = root) => [...from.querySelectorAll(sel)];
  const name = screenName(state.route);
  const q = questionOf(state);
  const saver = SAVER.includes(q);
  const result = (state.answers[q] || {}).result;
  const text = visibleText(root);
  const onQuestion = state.route.screen === 'step' && !!BUILT[state.route.q];

  // ---- the page contract (brief 4.9; step 4 brief 4.13) -------------------------------------------------------
  const screens = all('[data-screen]');
  if (screens.length !== 1 || screens[0].tagName !== 'MAIN') say('page', `${screens.length} elements carry data-screen (it belongs on <main>)`);
  else {
    if (screens[0].getAttribute('data-screen') !== name) say('page', `data-screen is "${screens[0].getAttribute('data-screen')}", the route says "${name}"`);
    const dq = screens[0].getAttribute('data-question');
    if (onQuestion ? dq !== state.route.q : dq !== null) say('page', `data-question is ${JSON.stringify(dq)}`);
    // the retired view replaces a built step; a step not built yet (keep) stays the "not in the preview yet" screen
    const retired = saver && onQuestion && name !== 'notBuilt' && isRetired(state, q);
    const view = screens[0].getAttribute('data-view');
    if (retired ? view !== 'retired' : view !== null) say('page', `data-view is ${JSON.stringify(view)}, the draft says ${retired ? 'retired' : 'not retired'}`);
  }
  if (all('[data-region="footer"]').length !== 1) say('page', 'there must be exactly one footer region');
  if (!text.includes(ADVICE_SHORT)) say('page', 'ADVICE_SHORT is not on the screen');
  if (onQuestion) {
    const rail = all('[data-region="rail"]');
    if (rail.length !== 1) say('rail', `${rail.length} rail regions`);
    else {
      const current = all('[aria-current="step"]', rail[0]);
      if (current.length !== 1) say('rail', `${current.length} steps are marked as the current one`);
      else if (current[0].getAttribute('data-testid') !== `rail.${state.route.q}.${state.route.step}`) say('rail', `the current step is ${current[0].getAttribute('data-testid')}`);
      for (const step of stepsOf(state.route.q)) {
        const link = rail[0].querySelector(`[data-testid="rail.${state.route.q}.${step}"]`);
        if (!link) say('rail', `no link for step ${step}`);
        else if (link.getAttribute('href') !== `#/${state.route.q}/${step}`) say('rail', `step ${step} links to ${link.getAttribute('href')}`);
      }
      const next = rail[0].querySelector('[data-testid="rail.next"]');
      if (!next || !next.textContent.trim()) say('rail', 'no next sentence');
      if (!rail[0].querySelector('[data-testid="rail.line"]')) say('rail', 'no phone line');
    }
    const answerStep = name === `${state.route.q}.answer` && !(saver && isRetired(state, q));
    if (answerStep && !text.includes(ADVICE_FULL)) say('page', 'ADVICE_FULL is not on the answer step');
    if (answerStep && !all('[data-region="footer"]')[0]?.textContent.includes(ADVICE_FULL)) say('page', 'ADVICE_FULL is not in the footer');
  }

  // ---- R1 no rubbish --------------------------------------------------------------------------------------------
  for (const re of RUBBISH) { const m = re.exec(text); if (m) say('R1', `"${m[0]}" on screen, near "${text.slice(Math.max(0, m.index - 30), m.index + 30)}"`); }
  for (const el of all('input')) if (/undefined|NaN|null|\[object/.test(el.value)) say('R1', `the box ${el.id} holds "${el.value}"`);
  for (const el of all('*')) for (const at of el.attributes) {
    if (/^(undefined|null|NaN|\[object Object\])$/.test(at.value) || /undefined|\[object/.test(at.name === 'href' || at.name === 'id' || at.name === 'for' || at.name === 'data-testid' || at.name === 'aria-label' ? at.value : '')) say('R1', `<${el.tagName.toLowerCase()} ${at.name}="${at.value}">`);
  }

  // ---- R2, R6, R12, R16 every number is the answer's ------------------------------------------------------------
  const seen = new Map();
  for (const el of all('[data-value]')) {
    const key = el.getAttribute('data-key');
    if (!key) { say('R2', `a data-value with no data-key: "${el.textContent}"`); continue; }
    const want = valueAt(state, q, key);
    const got = Number(el.getAttribute('data-value'));
    if (typeof want !== 'number' || got !== want) say('R2', `${key}: data-value ${el.getAttribute('data-value')} but the answer holds ${JSON.stringify(want)}`);
    const kind = el.getAttribute('data-kind');
    if (kind === 'outOfTen') {
      // the bar: ten cells, the first round(share × 10) filled, labelled with format.js's words
      const cells = all('.bar-cell', el);
      if (cells.length !== 10) say('R2', `${key}: the bar has ${cells.length} cells`);
      const on = cells.filter((c) => c.classList.contains('is-on')).length;
      if (on !== Math.round(want * 10)) say('R2', `${key}: ${on} cells filled for ${want}`);
      if (el.getAttribute('aria-label') !== outOfTen(want).words) say('R2', `${key}: the bar reads "${el.getAttribute('aria-label')}"`);
      if (el.textContent.trim() !== '') say('R2', `${key}: the bar holds words "${el.textContent}"`);
    } else if (kind === 'count') {
      const words = COUNT_WORDS[q];
      const o = outOfTen(want);
      // 85% to under 90% is "just under 9 in 10", never a bare 9 beside a "close" (Screens 9.2); the ends are format.js's
      // own: "fewer than 1 in 10" under 1 in 20, "more than 9 in 10" from 95% short of every one (never a count the bar contradicts)
      const long = o.count === null ? (o.only ? words.countNone : words.countEvery)
        : o.words.startsWith('in fewer than') ? words.countFewer
          : o.words.startsWith('in more than') ? words.countMore
            : o.count === 9 && want < 0.9 ? words.countJustUnder : words.count.replace('{n}', String(o.count));
      const shown = el.querySelector('.count-long');
      if (!shown || shown.textContent !== long) say('R2', `${key}: reads "${shown && shown.textContent}", the count is "${long}"`);
    } else {
      const shouldRead = kind === 'age' ? ageText(want) : kind === 'pot' ? pot(want) : money(want);
      if (el.textContent !== shouldRead) say('R2', `${key}: reads "${el.textContent}", format.js gives "${shouldRead}"`);
      if (kind !== 'age' && !MONEY.test(el.textContent)) say('R12', `${key}: "${el.textContent}" is not whole pounds`);
      if (kind === 'pot' && !/,000$|^£0$/.test(el.textContent)) say('R16', `${key}: the pot "${el.textContent}" is not a whole £1,000`);
      if (kind !== 'age' && kind !== 'money' && kind !== 'pot') say('R2', `${key}: data-kind is ${JSON.stringify(kind)}`);
    }
    if (seen.has(key) && seen.get(key) !== el.getAttribute('data-value')) say('R6', `${key} carries two values`);
    seen.set(key, el.getAttribute('data-value'));
  }
  for (const el of all('[data-key]')) if (!el.hasAttribute('data-value')) say('R2', `data-key ${el.getAttribute('data-key')} with no data-value`);
  for (const el of all('[data-kind="percent"]')) if (!/^\d{1,2}(\.\d)?%$/.test(el.textContent)) say('R16', `"${el.textContent}" is not a percent`);

  // ---- R3 no number from anywhere else, inside the answer -------------------------------------------------------
  for (const region of all('[data-region="answer"]')) {
    const copy = region.cloneNode(true);
    for (const el of copy.querySelectorAll('[data-value], [data-fixed]')) el.remove();
    const m = /\d/.exec(visibleText(copy));
    if (m) say('R3', `a digit outside data-value in the answer: "${visibleText(copy).slice(Math.max(0, m.index - 40), m.index + 20)}"`);
  }

  // ---- R4 every headline is complete ----------------------------------------------------------------------------
  for (const head of all('[data-headline]')) {
    const key = head.getAttribute('data-headline');
    const sentence = head.querySelector(`[data-sentence="${key}"]`);
    if (key === 'verdict') {
      const band = head.querySelector('[data-verdict]');
      if (!band || !visibleText(band)) say('R4', 'the verdict headline has no verdict in words');
    } else {
      const number = head.querySelector(`[data-key="${key}"]`);
      if (!number) say('R4', `headline ${key} has no number`);
      if (sentence && number && !sentence.textContent.includes(number.textContent)) say('R4', `the sentence for ${key} does not hold ${number.textContent}`);
    }
    if (!sentence || !sentence.textContent.trim()) say('R4', `headline ${key} has no sentence`);
    // C keeps what was assumed inside its one headline; A's and B's answers keep it once, in the answer
    const assumedIn = saver ? head.closest('[data-region="answer"]') : head;
    if (!assumedIn || !all('[data-assumed] [data-assumed-id]', assumedIn).length) say('R4', `headline ${key} has nothing under "what we assumed"`);
    if (!/the worst 1 in 10/.test(visibleText(head))) say('R4', `headline ${key} has no bad-case line`);
    if (!visibleText(head).includes(ADVICE_SHORT)) say('R4', `headline ${key} has no ADVICE_SHORT`);
    if (!head.closest('[data-region="answer"]')) say('R4', `headline ${key} is outside the answer region`);
  }

  // ---- R5 what was assumed --------------------------------------------------------------------------------------
  for (const box of all('[data-assumed]')) {
    const lines = all('[data-assumed-id]', box);
    const want = (result && result.assumed) || [];
    if (lines.map((l) => l.getAttribute('data-assumed-id')).join('|') !== want.map((a) => a.id).join('|')) {
      say('R5', `the lines are [${lines.map((l) => l.getAttribute('data-assumed-id'))}], the answer assumed [${want.map((a) => a.id)}]`);
      continue;
    }
    want.forEach((a, i) => {
      if (!lines[i].textContent.includes(a.text)) say('R5', `${a.id} does not read "${a.text}"`);
      const link = lines[i].querySelector('a');
      if (a.field) {
        if (!link) say('R5', `${a.id} has no link to change ${a.field}`);
        else {
          if (link.getAttribute('href') !== `#/${q}/numbers?focus=${a.field}`) say('R5', `${a.id} links to ${link.getAttribute('href')}`);
          if (link.getAttribute('data-testid') !== `assumed.${a.id}.change`) say('R5', `${a.id}: test id ${link.getAttribute('data-testid')}`);
        }
      } else if (link) say('R5', `${a.id} has no field, yet has a link`);
    });
  }

  // ---- R7 the form is the input list; R8 round trip -------------------------------------------------------------
  const boxes = all('input, select, textarea');
  const gotIds = boxes.map((el) => el.getAttribute('data-testid'));
  const wantIds = expectedInputs(state);
  if ([...gotIds].sort().join('|') !== [...wantIds].sort().join('|')) say('R7', `boxes drawn [${gotIds}], the state calls for [${wantIds}]`);
  const fq = name === 'front' ? 'c' : q;
  const { draft, shown } = shownValues(state, fq);
  const byPath = new Map(SCHEMA_OF[fq].fields.map((f) => [f.path, f]));
  for (const el of boxes) {
    const id = el.getAttribute('data-testid') || '';
    if (el.id !== id) say('R7', `box ${id}: id is "${el.id}"`);
    if (el.type === 'radio') {
      const path = id.slice(2, id.lastIndexOf('.'));
      const option = id.slice(id.lastIndexOf('.') + 1);
      const f = byPath.get(path);
      const group = el.closest('fieldset');
      if (!group || !group.querySelector('legend') || !group.querySelector('legend').textContent.trim()) say('R7', `${id} is not in a fieldset with a legend`);
      const label = root.querySelector(`label[for="${id}"]`) || el.closest('label');
      if (!label || !label.textContent.trim()) say('R7', `${id} has no label`);
      if (el.getAttribute('name') !== `${fq}.${path}`) say('R7', `${id}: the radio's name is ${el.getAttribute('name')}`);
      const want = f && f.type === 'yesNo' ? (shown[path] === true ? 'yes' : 'no') : shown[path];
      if (el.checked !== (option === want)) say('R7', `${id}: ${el.checked ? 'ticked' : 'not ticked'}, the state says ${JSON.stringify(shown[path])}`);
    } else {
      const label = root.querySelector(`label[for="${id}"]`);
      if (!label || !label.textContent.trim()) say('R7', `${id} has no <label for>`);
      const path = id === 'front.c.pot' ? 'you.pot' : TRY_BOXES[id] || id.slice(2);
      const want = blank(draft[path]) ? '' : String(draft[path]);
      if (el.value !== want) say('R7', `${id} shows "${el.value}", the state holds "${want}"`);
      if (el.type !== 'text') say('R7', `${id} is type="${el.type}" — money and ages are text boxes`);
      if (!el.getAttribute('inputmode')) say('R7', `${id} has no inputmode`);
    }
    const described = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    for (const d of described) if (!root.querySelector(`[id="${d}"]`)) say('R7', `${id}: aria-describedby names "${d}", which is not on the page`);
  }
  const formScreen = name === 'c.numbers' || name === 'c.answer' || (saver && onQuestion && name !== 'notBuilt' && !isRetired(state, q));
  if (formScreen) {
    const back = saver ? readSaverForm(root, q, SCHEMA_OF[q]) : readForm(root);
    for (const [path, v] of Object.entries(back)) {
      if (path === 'household') { if (name === `${fq}.numbers` && v !== (shown.household || 'single')) say('R8', `household reads back as ${v}`); continue; }
      const f = byPath.get(path);
      const numberBox = ['money', 'age', 'percent', 'count'].includes(f.type);
      // a yes/no with no default and nothing chosen shows "No" (C's "still paying in?": not answered is no)
      const nothing = f.type === 'yesNo' && shown[path] === undefined ? false : shown[path];
      const want = blank(draft[path]) ? (numberBox ? '' : nothing) : draft[path];
      if (v !== want) say('R8', `${path} reads back as ${JSON.stringify(v)}, the state holds ${JSON.stringify(want)}`);
    }
  }
  for (const el of all('[data-error-for]')) {
    const box = root.querySelector(`[id="${el.getAttribute('data-error-for')}"]`) || root.querySelector(`[name="${el.getAttribute('data-error-for')}"]`);
    if (!box) say('R7', `an error for ${el.getAttribute('data-error-for')}, which is not drawn`);
    if (!el.textContent.trim()) say('R7', `an empty error for ${el.getAttribute('data-error-for')}`);
  }

  // ---- R9 headings ----------------------------------------------------------------------------------------------
  const heads = all('h1, h2, h3, h4, h5, h6').filter((el) => !el.closest('[hidden]')).map((el) => Number(el.tagName[1]));
  if (heads.filter((n) => n === 1).length !== 1) say('R9', `${heads.filter((n) => n === 1).length} main headings`);
  heads.forEach((n, i) => { if (i > 0 && n > heads[i - 1] + 1) say('R9', `a heading jumps from h${heads[i - 1]} to h${n}`); });
  for (const el of all('h1, h2, h3')) if (!el.textContent.trim()) say('R9', 'an empty heading');

  // ---- R10, R11 wording -----------------------------------------------------------------------------------------
  const one = /\b1 (years|months|futures|pensions)\b/.exec(text);
  if (one) say('R10', `"${one[0]}"`);
  for (const hit of bannedHits(text, scopesFor(state))) say('R11', hit);
  for (const region of all('[data-region="answer"]')) for (const hit of bannedHits(visibleText(region), ['result'], { context: text })) say('R11', hit);
  for (const region of all('[data-region="rail"], [data-region="form"]')) {
    const m = /\b(sign up|create an account|log in)\b/i.exec(visibleText(region));
    if (m) say('R11', `"${m[0]}" before the answer`);
  }

  // ---- R13 A's ages, row by row ---------------------------------------------------------------------------------
  for (const table of all('[data-table="ages"], [data-chart="ages"]')) {
    const what = table.hasAttribute('data-table') ? 'the ages table' : 'the ages chart';
    const rows = all('[data-age]', table);
    const ages = (result && result.ages) || [];
    if (rows.map((r) => r.getAttribute('data-age')).join('|') !== ages.map((r) => String(r.age)).join('|')) {
      say('R13', `${what} rows [${rows.map((r) => r.getAttribute('data-age'))}], the answer's ages [${ages.map((r) => r.age)}]`);
      continue;
    }
    rows.forEach((row, k) => {
      for (const el of all('[data-key]', row)) {
        const key = el.getAttribute('data-key');
        if (key.startsWith('ages.') && !key.startsWith(`ages.${k}.`)) say('R13', `${what}: row ${k} (age ${row.getAttribute('data-age')}) shows ${key}`);
      }
      if (!row.querySelector(`[data-key="ages.${k}.lasted"]`)) say('R13', `${what}: row ${k} has no bar`);
      const current = row.getAttribute('aria-current') === 'true';
      const shownAge = result.shown && result.shown.age;
      if (current !== (ages[k].age === shownAge)) say('R13', `${what}: row ${k} ${current ? 'is' : 'is not'} marked as the age shown (${shownAge})`);
    });
  }

  // ---- R14 a verdict is a word ----------------------------------------------------------------------------------
  for (const el of all('[data-verdict]')) {
    const v = el.getAttribute('data-verdict');
    if (!['yes', 'close', 'no'].includes(v)) say('R14', `data-verdict="${v}"`);
    if (!visibleText(el)) say('R14', `a verdict "${v}" with no words`);
    if (!el.className.includes(`is-${v}`)) say('R14', `a verdict "${v}" without its colour token`);
  }

  // ---- R15 B's levers -------------------------------------------------------------------------------------------
  for (const el of all('[data-lever-none]')) {
    const id = el.getAttribute('data-lever-none');
    if (result && result.levers && result.levers[id]) say('R15', `the lever ${id} was found, yet is drawn as found nothing`);
    if (el.querySelector('button')) say('R15', `the lever ${id} found nothing, yet has a button`);
  }
  for (const box of all('[data-levers]')) {
    const want = LEVERS.filter((id) => result && result.levers && result.levers[id]);
    const got = all('[data-lever]', box).map((el) => el.getAttribute('data-lever'));
    if (got.join('|') !== want.join('|')) say('R15', `levers drawn [${got}], the answer found [${want}]`);
    const couple = !!(result && result.inputs && result.inputs.household === 'couple');
    for (const id of got) {
      const button = box.querySelector(`[data-testid="b.lever.${id}.try"]`);
      const lever = result.levers[id];
      const needs = id !== 'accept' && !(couple && id === 'payMore') && !(id === 'moreRisk' && lever && lever.helps === false);
      if (needs && !button) say('R15', `the lever ${id} has no "Try"`);
      if (!needs && button) say('R15', `the lever ${id} has a "Try" it should not`);
    }
  }

  // ---- links, buttons, ids, tab order ---------------------------------------------------------------------------
  for (const a of all('a')) {
    const href = a.getAttribute('href');
    if (!a.textContent.trim() && !a.getAttribute('aria-label')) say('links', `a link with no words (${href})`);
    if (!href) { say('links', `"${a.textContent}" has no href`); continue; }
    if (href.startsWith('#')) {
      if (parse(href).screen === 'notFound') say('links', `"${a.textContent}" leads to ${href}, which is no page`);
      else if (format(parse(href)) !== href) say('links', `"${a.textContent}": ${href} is not how that address is written`);
      if (/\d/.test(href)) say('links', `a figure in an address: ${href}`);
    } else if (!href.startsWith('../')) say('links', `"${a.textContent}" leads outside: ${href}`);
  }
  for (const b of all('button')) {
    if (!b.textContent.trim() && !b.getAttribute('aria-label')) say('buttons', 'a button with no words');
    if (b.getAttribute('type') !== 'button' && b.getAttribute('type') !== 'submit') say('buttons', `"${b.textContent}" has no type`);
    if (b.disabled && /^[abc]\.action\.show$/.test(b.getAttribute('data-testid') || '')) say('buttons', `"${b.textContent}" must never be greyed out`);
  }
  for (const attr of ['id', 'data-testid']) {
    const count = new Map();
    for (const el of all(`[${attr}]`)) count.set(el.getAttribute(attr), (count.get(el.getAttribute(attr)) || 0) + 1);
    for (const [v, n] of count) if (n > 1) say('ids', `${attr}="${v}" appears ${n} times`);
  }
  for (const el of all('[tabindex]')) if (Number(el.getAttribute('tabindex')) > 0) say('keyboard', `tabindex ${el.getAttribute('tabindex')} on <${el.tagName.toLowerCase()}>`);
  for (const el of all('[aria-controls], [aria-labelledby]')) {
    for (const at of ['aria-controls', 'aria-labelledby']) {
      const v = el.getAttribute(at);
      if (v && !root.querySelector(`[id="${v}"]`)) say('ids', `${at}="${v}" names nothing on the page`);
    }
  }
  return problems;
}
