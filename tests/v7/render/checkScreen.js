/**
 * checkScreen(root, state) — the rules every drawn V7 screen must keep (test plan section 5, R1–R12; build brief
 * section 6, P4). One helper, run on every named state in jsdom; it uses nothing jsdom-only, so the browser tests
 * can run the same rules on the live page.
 *
 * It returns a list of problems in plain words. An empty list is a pass:  expect(checkScreen(root, state)).toEqual([])
 *
 *   R1  no rubbish on screen (undefined, NaN, null, -£0, an unfilled {slot} …)
 *   R2  every number is the answer's number: data-key → the same raw value in data-value, text by format.js
 *   R3  no digit inside [data-region="answer"] outside [data-value] / [data-fixed] — the screen works out nothing
 *   R4  every headline is complete: a number, its sentence, the bad-case line, ADVICE_SHORT, what was assumed
 *   R5  what was assumed is all there, in order, each with its "Change" link where it has a field
 *   R6  the same key always carries the same value
 *   R7  the form is the input list: exactly the fields that apply, each with its test id, a label and the state's value
 *   R8  round trip: what readForm reads back is what the state holds
 *   R9  one main heading, no skipped level
 *   R10 "1 year", never "1 years"
 *   R11 the banned list, by scope
 *   R12 money looks like money: whole pounds, no pence, no minus
 *   plus: the page contract of brief 4.9 (data-screen, regions, the rail's marks), unique ids, labelled controls,
 *   links that lead somewhere, no tab order other than the page's own.
 */
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { money, ageText, get } from '../../../src/answers/shared/format.js';
import { parse, format, screenName } from '../../../src/v7/router/routes.js';
import { BANNED, QUESTION_EXEMPT } from '../../../src/v7/copy/banned.js';
import { ADVICE_SHORT, ADVICE_FULL } from '../../../src/v7/copy/common.js';
import { readForm } from '../c/_c.js';

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

/** Which scopes of the banned list apply to a drawn state (language guide 3.2; brief 2.2 #25: all of C is "retired"). */
export function scopesFor(state) {
  const name = screenName(state.route);
  if (name === 'front') return ['all', 'first', 'front'];
  if (state.route.q === 'c') return ['all', 'first', 'planner', 'retired'];
  return ['all', 'first'];
}

const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const MORE = SCHEMA_C.fields.filter((f) => f.group === 'more').map((f) => f.path);

/** What a field shows when nothing is typed: the checked value (defaults by rule included), else the plain default. */
export function shownValues(state) {
  const draft = state.draft.c.values;
  const parsed = parseDraft(SCHEMA_C, draft, state.env);
  const shown = {};
  for (const f of SCHEMA_C.fields) {
    if (!blank(draft[f.path])) shown[f.path] = draft[f.path];
    else if (parsed.values[f.path] !== undefined) shown[f.path] = parsed.values[f.path];
    else if ('default' in f && (f.default === null || typeof f.default !== 'object')) shown[f.path] = f.default;
  }
  return { draft, parsed, shown };
}

export function moreIsOpen(state) {
  const draft = state.draft.c.values;
  return state.ui.open.includes('more') || MORE.some((p) => !blank(draft[p])) || MORE.includes(state.route.focus);
}

/** The test ids of the boxes a state must draw — no more, no fewer (R7). */
export function expectedInputs(state) {
  const name = screenName(state.route);
  if (name === 'front') return ['front.c.pot'];
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
  const ids = [];
  for (const f of fields) {
    if (f.type === 'choice') for (const o of f.options) ids.push(`c.${f.path}.${o}`);
    else if (f.type === 'yesNo') ids.push(`c.${f.path}.no`, `c.${f.path}.yes`);
    else ids.push(`c.${f.path}`);
  }
  return ids;
}

const RUBBISH = [/undefined/, /\bNaN\b/, /\bnull\b/, /Infinity/, /\[object/, /-£0\b/, /−£0\b/, /£\s?[-−]/, /£NaN/, /[{}]/];
const MONEY = /^£\d{1,3}(,\d{3})*$/;

/** The value a data-key names: `before.…` is the answer kept from before a change; everything else is in the result. */
function valueAt(state, key) {
  const a = state.answers.c;
  return key.startsWith('before.') ? get(a, key) : get(a.result, key);
}

export function checkScreen(root, state) {
  const problems = [];
  const say = (rule, text) => problems.push(`${rule}: ${text}`);
  const all = (sel, from = root) => [...from.querySelectorAll(sel)];
  const name = screenName(state.route);
  const result = state.answers.c.result;
  const text = visibleText(root);

  // ---- the page contract (brief 4.9) ------------------------------------------------------------------------
  const screens = all('[data-screen]');
  if (screens.length !== 1 || screens[0].tagName !== 'MAIN') say('page', `${screens.length} elements carry data-screen (it belongs on <main>)`);
  else {
    if (screens[0].getAttribute('data-screen') !== name) say('page', `data-screen is "${screens[0].getAttribute('data-screen')}", the route says "${name}"`);
    const q = screens[0].getAttribute('data-question');
    if ((state.route.screen === 'step' && state.route.q === 'c') ? q !== 'c' : q !== null) say('page', `data-question is ${JSON.stringify(q)}`);
  }
  if (all('[data-region="footer"]').length !== 1) say('page', 'there must be exactly one footer region');
  if (!text.includes(ADVICE_SHORT)) say('page', 'ADVICE_SHORT is not on the screen');
  if (state.route.screen === 'step' && state.route.q === 'c') {
    const rail = all('[data-region="rail"]');
    if (rail.length !== 1) say('rail', `${rail.length} rail regions`);
    else {
      const current = all('[aria-current="step"]', rail[0]);
      if (current.length !== 1) say('rail', `${current.length} steps are marked as the current one`);
      else if (current[0].getAttribute('data-testid') !== `rail.c.${state.route.step}`) say('rail', `the current step is ${current[0].getAttribute('data-testid')}`);
      for (const step of ['numbers', 'answer', 'ways', 'keep']) {
        const link = rail[0].querySelector(`[data-testid="rail.c.${step}"]`);
        if (!link) say('rail', `no link for step ${step}`);
        else if (link.getAttribute('href') !== `#/c/${step}`) say('rail', `step ${step} links to ${link.getAttribute('href')}`);
      }
      const next = rail[0].querySelector('[data-testid="rail.next"]');
      if (!next || !next.textContent.trim()) say('rail', 'no next sentence');
      if (!rail[0].querySelector('[data-testid="rail.line"]')) say('rail', 'no phone line');
    }
    if (name === 'c.answer' && !text.includes(ADVICE_FULL)) say('page', 'ADVICE_FULL is not on the answer step');
    if (name === 'c.answer' && !all('[data-region="footer"]')[0]?.textContent.includes(ADVICE_FULL)) say('page', 'ADVICE_FULL is not in the footer');
  }

  // ---- R1 no rubbish --------------------------------------------------------------------------------------------
  for (const re of RUBBISH) { const m = re.exec(text); if (m) say('R1', `"${m[0]}" on screen, near "${text.slice(Math.max(0, m.index - 30), m.index + 30)}"`); }
  for (const el of all('input')) if (/undefined|NaN|null|\[object/.test(el.value)) say('R1', `the box ${el.id} holds "${el.value}"`);
  for (const el of all('*')) for (const at of el.attributes) {
    if (/^(undefined|null|NaN|\[object Object\])$/.test(at.value) || /undefined|\[object/.test(at.name === 'href' || at.name === 'id' || at.name === 'for' || at.name === 'data-testid' ? at.value : '')) say('R1', `<${el.tagName.toLowerCase()} ${at.name}="${at.value}">`);
  }

  // ---- R2, R6, R12 every number is the answer's -----------------------------------------------------------------
  const seen = new Map();
  for (const el of all('[data-value]')) {
    const key = el.getAttribute('data-key');
    if (!key) { say('R2', `a data-value with no data-key: "${el.textContent}"`); continue; }
    const want = valueAt(state, key);
    const got = Number(el.getAttribute('data-value'));
    if (typeof want !== 'number' || got !== want) say('R2', `${key}: data-value ${el.getAttribute('data-value')} but the answer holds ${JSON.stringify(want)}`);
    const kind = el.getAttribute('data-kind');
    const shouldRead = kind === 'age' ? ageText(want) : money(want);
    if (el.textContent !== shouldRead) say('R2', `${key}: reads "${el.textContent}", format.js gives "${shouldRead}"`);
    if (kind !== 'age' && !MONEY.test(el.textContent)) say('R12', `${key}: "${el.textContent}" is not whole pounds`);
    if (kind !== 'age' && kind !== 'money') say('R2', `${key}: data-kind is ${JSON.stringify(kind)}`);
    if (seen.has(key) && seen.get(key) !== el.getAttribute('data-value')) say('R6', `${key} carries two values`);
    seen.set(key, el.getAttribute('data-value'));
  }
  for (const el of all('[data-key]')) if (!el.hasAttribute('data-value')) say('R2', `data-key ${el.getAttribute('data-key')} with no data-value`);

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
    const number = head.querySelector(`[data-key="${key}"]`);
    const sentence = head.querySelector(`[data-sentence="${key}"]`);
    if (!number) say('R4', `headline ${key} has no number`);
    if (!sentence || !sentence.textContent.trim()) say('R4', `headline ${key} has no sentence`);
    else if (number && !sentence.textContent.includes(number.textContent)) say('R4', `the sentence for ${key} does not hold ${number.textContent}`);
    if (!all('[data-assumed] [data-assumed-id]', head).length) say('R4', `headline ${key} has nothing under "what we assumed"`);
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
          if (link.getAttribute('href') !== `#/c/numbers?focus=${a.field}`) say('R5', `${a.id} links to ${link.getAttribute('href')}`);
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
  const { draft, shown } = shownValues(state);
  const byPath = new Map(SCHEMA_C.fields.map((f) => [f.path, f]));
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
      if (el.getAttribute('name') !== `c.${path}`) say('R7', `${id}: the radio's name is ${el.getAttribute('name')}`);
      const want = f && f.type === 'yesNo' ? (shown[path] === true ? 'yes' : 'no') : shown[path];
      if (el.checked !== (option === want)) say('R7', `${id}: ${el.checked ? 'ticked' : 'not ticked'}, the state says ${JSON.stringify(shown[path])}`);
    } else {
      const label = root.querySelector(`label[for="${id}"]`);
      if (!label || !label.textContent.trim()) say('R7', `${id} has no <label for>`);
      const path = id === 'front.c.pot' ? 'you.pot' : id.slice(2);
      const want = blank(draft[path]) ? '' : String(draft[path]);
      if (el.value !== want) say('R7', `${id} shows "${el.value}", the state holds "${want}"`);
      if (el.type !== 'text') say('R7', `${id} is type="${el.type}" — money and ages are text boxes`);
      if (!el.getAttribute('inputmode')) say('R7', `${id} has no inputmode`);
    }
    const described = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    for (const d of described) if (!root.querySelector(`[id="${d}"]`)) say('R7', `${id}: aria-describedby names "${d}", which is not on the page`);
  }
  if (name === 'c.numbers' || name === 'c.answer') {
    const back = readForm(root);
    for (const [path, v] of Object.entries(back)) {
      if (path === 'household') { if (name === 'c.numbers' && v !== (shown.household || 'single')) say('R8', `household reads back as ${v}`); continue; }
      const want = blank(draft[path]) ? (byPath.get(path).type === 'money' || byPath.get(path).type === 'age' ? '' : shown[path]) : draft[path];
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

  // ---- links, buttons, ids, tab order ---------------------------------------------------------------------------
  for (const a of all('a')) {
    const href = a.getAttribute('href');
    if (!a.textContent.trim()) say('links', `a link with no words (${href})`);
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
    if (b.disabled && b.getAttribute('data-testid') === 'c.action.show') say('buttons', '"Show what it pays" must never be greyed out');
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
