/**
 * Reading what a person reads: money, ages, months, durations and "N in 20" from the visible text of a page, and a fact
 * from the register (facts.js) on the page that is open. Values are always taken from visible text (or the value in a
 * box a person typed into), never from an attribute.
 */
import { expect } from '@playwright/test';
import { FACTS, STAGE_WORDS } from './facts.js';
import { monthFromName } from './hand/dates.js';

/** '£1,234' or '1 234' → 1234. */
export const money = (t) => {
  const s = String(t ?? '').replace(/[£,\s]/g, '');
  return s === '' || Number.isNaN(Number(s)) ? null : Number(s);
};
/** Every sum of money in a text, in order. */
export const moneyAll = (t) => [...String(t).matchAll(/£\s?([\d,]+(?:\.\d{2})?)/g)].map((m) => money(m[1]));

/** '11 years 3 months' → 135; '11 years' → 132; '16 months' → 16. */
export function months(t) {
  const y = /(\d+) years?/.exec(String(t));
  const m = /(\d+) months?/.exec(String(t));
  if (!y && !m) return null;
  return (y ? Number(y[1]) * 12 : 0) + (m ? Number(m[1]) : 0);
}

/** 'about 17 times in 20' → '17'; 'more than 19 times in 20' → '>19'; 'less than once in 20' → '<1'; '9 in 10' → '18'. */
export function chance(t) {
  const s = String(t).toLowerCase();
  const m = /(more than |less than |about )?(\d+|once) (?:times )?(?:in|out of) (20|10)\b/.exec(s);
  if (!m) return null;
  const n = (m[2] === 'once' ? 1 : Number(m[2])) * (m[3] === '10' ? 2 : 1);
  return `${m[1] === 'more than ' ? '>' : m[1] === 'less than ' ? '<' : ''}${n}`;
}

/** The stage a page's words name: 'saving', 'moving' or 'living'. */
export function stage(t) {
  const s = String(t).trim();
  for (const [re, v] of STAGE_WORDS) if (re.test(s)) return v;
  return null;
}

/** A value of a kind, from the text a pattern caught. */
export function parse(kind, raw) {
  if (raw === null || raw === undefined) return null;
  switch (kind) {
    case 'money': return money(raw);
    case 'age': return Number(raw);
    case 'month': return monthFromName(raw);
    case 'years': return months(raw);
    case 'stage': return stage(raw);
    case 'chance': return chance(raw);
    default: return String(raw).replace(/\s+/g, ' ').trim();
  }
}

const isCss = (r) => /^[#.[]|^[a-z]+(\[|$|\s)/.test(r);
/** The locator of a region: a CSS selector, or a data-testid. With none, the page itself (#app in the simple view). */
export async function regionOf(page, region) {
  if (!region) return (await page.locator('#app').count()) ? page.locator('#app') : page.locator('body');
  return isCss(region) ? page.locator(region).first() : page.getByTestId(region).first();
}

/** What a person reads in a region: its visible text, the lines kept. */
export async function visibleText(page, region = null) {
  const loc = await regionOf(page, region);
  if (!(await loc.count())) return '';
  return (await loc.innerText().catch(() => '')).replace(/ /g, ' ');
}

/** One place of the register, read once: { value, raw } or null when the page does not state it (yet). */
export async function readPlaceOnce(page, id, place) {
  const kind = FACTS[id].kind;
  const marked = page.locator(`[data-fact="${id}"]`);
  if (await marked.count()) {
    const el = marked.first();
    if (await el.isVisible()) {
      const text = (await el.innerText()).replace(/ /g, ' ');
      const m = place.find ? new RegExp(place.find, 'm').exec(text) : null;
      const raw = m ? m[1] : text;
      const value = parse(kind, raw);
      if (value !== null) return { value, raw, how: 'data-fact' };
    }
  }
  if (place.input) {
    const box = page.locator(place.input).first();
    if (!(await box.count()) || !(await box.isVisible())) return null;
    const raw = await box.inputValue();
    if (raw === '') return null;
    return { value: parse(kind, raw), raw, how: place.input };
  }
  const text = await visibleText(page, place.region);
  const m = new RegExp(place.find, 'm').exec(text);
  if (!m) return null;
  return { value: parse(kind, m[1]), raw: m[0], how: place.region || 'the page' };
}

/**
 * A fact read on the page that is open, by the register's place for `pageName` in `view`. Pages work their figures out
 * after they are drawn, so this waits (up to `timeout`) for the fact to be stated; null when it never is.
 */
export async function fact(page, id, { view = 'simple', page: pageName, timeout = 20_000 } = {}) {
  const f = FACTS[id];
  if (!f) throw new Error(`read.fact: no fact "${id}" in the register`);
  const places = (f[view] || []).filter((p) => p.page === pageName);
  if (!places.length) throw new Error(`read.fact: the register has no place for "${id}" on ${view} ${pageName}`);
  let got = null;
  try {
    await expect.poll(async () => {
      for (const p of places) { got = await readPlaceOnce(page, id, p); if (got && got.value !== null) return true; }
      return false;
    }, { timeout, intervals: [250, 500, 1000] }).toBe(true);
  } catch { return null; }
  return got;
}

/**
 * The NEVER list the brief puts on every page a scenario opens (2.6), on top of the simple view's own list
 * (e2e/helpers/app.js NEVER_ON_SCREEN, copied here and kept in step by tests/scenarioRules.test.js).
 */
export const NEVER_ANY_PAGE = Object.freeze([
  'you should', 'we recommend', 'recommendation', 'maximise tax efficiency', 'what should I', '(from this window)', 'still the defaults',
  'undefined', 'NaN'
]);
export const NEVER_ON_SCREEN = Object.freeze(['bridge', 'FIRE', 'years to go', 'countdown', 'contribution', 'on track', 'run-up', 'run up', 'before your plan starts', 'before the plan starts', 'before the plan’s income starts', "before the plan's income starts", 'before your plan’s income starts', 'next 6 April', 'Next April']);

/** Two chance measures in one sentence: "N in 20" beside "N in 10" or "N out of 10". */
const TWO_MEASURES = /\d+ (times )?in 20\b.*\d+ (of|in|out of) (10|20)\b/;
const sentences = (text) => String(text).split(/(?<=[.!?])\s+|\n+/);

/** What the page says that it never may. `view`: 'simple' adds the simple view's own list. Returns the words found. */
export function neverIn(text, { view = 'simple' } = {}) {
  const t = String(text);
  const low = t.toLowerCase();
  const found = [];
  for (const w of NEVER_ANY_PAGE) if (w === 'NaN' ? /\bNaN\b/.test(t) : low.includes(w.toLowerCase())) found.push(w);
  if (view === 'simple') for (const w of NEVER_ON_SCREEN) if (w === w.toUpperCase() ? new RegExp(`\\b${w}\\b`).test(t) : low.includes(w.toLowerCase())) found.push(w);
  const iso = /\b\d{4}-\d{2}-\d{2}\b/.exec(t);
  if (iso) found.push(`an ISO date ("${t.slice(Math.max(0, iso.index - 40), iso.index + 20).replace(/\s+/g, ' ').trim()}")`);
  const until = /\bUntil (\d{1,2})\b(?![\d,])/.exec(t);
  if (until && Number(until[1]) < 30) found.push(`a plan year after "Until" ("${until[0]}")`);
  for (const s of sentences(t)) if (TWO_MEASURES.test(s)) { found.push(`two chance measures in one sentence ("${s.trim().slice(0, 90)}")`); break; }
  return found;
}

/** The NEVER list on the page that is open. */
export async function neverOnAnyPage(page, { view = 'simple' } = {}) {
  return neverIn(await visibleText(page, view === 'simple' ? '#app' : 'body'), { view });
}

/** Every sum a page shows: the £ figures in its text and the figures in its visible boxes (what a person sees in them). */
export async function figuresOn(page) {
  const text = await visibleText(page, (await page.locator('#app').count()) ? '#app' : 'body');
  const boxes = await page.$$eval('input:not([type=checkbox]):not([type=radio]):not([type=hidden])', (els) => els.filter((e) => e.offsetParent && e.value !== '').map((e) => e.value));
  return [...moneyAll(text), ...boxes.map((v) => money(v)).filter((v) => v !== null)];
}
