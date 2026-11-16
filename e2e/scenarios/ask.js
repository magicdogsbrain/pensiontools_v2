/**
 * ask(person, question, route, fn): one fictional person asking one question, taking a route, reading the screen. Every
 * check inside `fn` is recorded; at the end, if any failed, ask() throws ONE failure a person can read (brief 2.5):
 *
 *   Jo, 33, asked what to pay in for £2,000 a month at 60 and was not told what leaves Jo's pay.
 *
 *     Question   S1  "If I want £2,000 a month from 60, what do I need to pay in?"
 *     Route      front page > Am I saving enough? > Show what I need   (simple view, guest, 16 Nov 2026)
 *     Must read  what leaves Jo's take-home pay: £861 a month
 *     Did read   "37% of your pay in all (you 34%, £1,172 a month)"; no take-home figure on the page
 *     By hand    34% × 38,000 ÷ 12 = 1,076.67 going in from Jo; × 0.8 = 861.33 from take-home pay
 *     Owner      SAVER
 *
 * The title is the first failure's; every further failure follows as its own block. A step of the route that cannot be
 * taken (a button not there, a page that never draws) is a failure too: "could not …", with where it stopped.
 *
 * The kinds of check (brief 2.2): exact, within, same, follows, never, reach. Each takes what the person must read, what
 * was read, the sum by hand, and the words for the title ("was not told …", "was told … twice").
 */
import { test } from '@playwright/test';
import { QUESTIONS } from './questions.js';

const fmt = (v) => (typeof v === 'number' ? (Number.isInteger(v) ? v.toLocaleString('en-GB') : v.toLocaleString('en-GB', { maximumFractionDigits: 2 })) : v === null || v === undefined ? 'nothing' : String(v));
const pad = (label) => `  ${label.padEnd(10)} `;
const SEEDED = 'This scenario wrote its plan into the store (seeded: true): a shape saved before today\'s screens, not one a person made today.';

/** A question from the catalogue (questions.js) by id, or the object itself. */
function questionOf(q) {
  if (q && typeof q === 'object') return q;
  const found = QUESTIONS.find((x) => x.id === q);
  if (!found) throw new Error(`ask: no question "${q}" in the catalogue`);
  return found;
}

/** The person-sentence and its body, for one or more failures. Exported for the harness's own check. */
export function failureText({ person, question, route, failures, seeded = false }) {
  const q = questionOf(question);
  const who = person.age !== undefined ? `${person.name}, ${person.age},` : person.name;
  const first = failures[0];
  const lines = [`${who} asked ${route.asked || q.asked || q.text} and ${first.says}.`, ''];
  failures.forEach((f, i) => {
    if (i > 0) lines.push('', `  …and ${f.says}.`);
    if (i === 0) lines.push(`${pad('Question')}${q.id}  "${q.text}"`);
    if (i === 0) lines.push(`${pad('Route')}${route.path}   (${route.view} view, ${route.who}, ${route.today})`);
    lines.push(`${pad('Must read')}${f.must}`);
    lines.push(`${pad('Did read')}${f.did}`);
    if (f.byHand) lines.push(`${pad('By hand')}${f.byHand}`);
    lines.push(`${pad('Owner')}${f.owner || q.owner}`);
  });
  if (seeded) lines.push('', `  ${SEEDED}`);
  return lines.join('\n');
}

class Asking {
  constructor(person, question, route) {
    this.person = person;
    this.question = questionOf(question);
    this.route = { path: '', view: 'simple', who: 'guest', today: '16 Nov 2026', ...route };
    this.failures = [];
    this.checks = 0;
    this.at = [];
  }

  fail(f) { this.failures.push(f); return false; }

  /** A step of the route, named as a person would: a failure inside it says where the route stopped. */
  async step(name, body) {
    this.at.push(name);
    return test.step(name, body);
  }

  /** EXACT: a figure worked by hand. `tolerance` in the figure's own units (a pound for money shown whole). */
  exact(must, got, want, { byHand = '', tolerance = 0, says, owner, did } = {}) {
    this.checks += 1;
    const ok = got !== null && got !== undefined && (typeof want === 'number' ? Math.abs(Number(got) - want) <= tolerance : got === want);
    if (ok) return true;
    return this.fail({ must: `${must}: ${fmt(want)}`, did: did ?? (got === null || got === undefined ? 'not stated on the page' : fmt(got)), byHand, owner,
      says: says || (got === null || got === undefined ? `was not told ${must}` : `was told ${fmt(got)} for ${must}, not ${fmt(want)}`) });
  }

  /** WITHIN: a figure inside a bracket worked by hand. */
  within(must, got, low, high, { byHand = '', says, owner, did } = {}) {
    this.checks += 1;
    if (got !== null && got !== undefined && got >= low && got <= high) return true;
    return this.fail({ must: `${must}: between ${fmt(low)} and ${fmt(high)}`, did: did ?? (got === null || got === undefined ? 'not stated on the page' : fmt(got)), byHand, owner,
      says: says || (got === null || got === undefined ? `was not told ${must}` : `was told ${fmt(got)} for ${must}, outside what the sums allow`) });
  }

  /**
   * SAME: one fact, one value, on every page that states it. `readings`: [{ where, value }]; a reading of null is a page
   * that did not state it, which fails only when `everywhere` is set. With `want`, every value must also be that one.
   */
  same(must, readings, { want, byHand = '', says, owner, everywhere = false, eq = (a, b) => a === b } = {}) {
    this.checks += 1;
    const stated = readings.filter((r) => r.value !== null && r.value !== undefined);
    const missing = readings.filter((r) => r.value === null || r.value === undefined);
    const values = [...new Set(stated.map((r) => JSON.stringify(r.value)))];
    const agree = stated.every((r) => eq(r.value, stated[0].value));
    const right = want === undefined || stated.every((r) => eq(r.value, want));
    const enough = stated.length > 0 && (!everywhere || missing.length === 0);
    if (agree && right && enough) return true;
    const side = readings.map((r) => `${r.where}: ${r.value === null || r.value === undefined ? '(not stated)' : fmt(r.value)}`).join('; ');
    return this.fail({ must: `${must}${want !== undefined ? `: ${fmt(want)}` : ''}, the same on every page`, did: side, byHand, owner,
      says: says || (!stated.length ? `was not told ${must} on any page` : !agree ? `was told ${values.length} different values for ${must}` : !right ? `was told ${values.map((v) => fmt(JSON.parse(v))).join(' and ')} for ${must}, not ${fmt(want)}` : `was not told ${must} on ${missing.map((r) => r.where).join(', ')}`) });
  }

  /** FOLLOWS: after one change, the fact moved the right way by at least a hand-worked amount. */
  follows(must, before, after, least, { byHand = '', says, owner, down = false } = {}) {
    this.checks += 1;
    const moved = before !== null && after !== null && before !== undefined && after !== undefined ? (down ? before - after : after - before) : null;
    if (moved !== null && moved >= least) return true;
    return this.fail({ must: `${must}: ${down ? 'down' : 'up'} by at least ${fmt(least)}`, did: `${fmt(before)} before, ${fmt(after)} after`, byHand, owner,
      says: says || (moved === null ? `was not told ${must} before and after the change` : `saw ${must} move by ${fmt(moved)}, less than the change must move it`) });
  }

  /** NEVER: words that must not be on the page for this person. `found`: what was found. */
  never(where, found, { must = 'none of the words this page may never say', says, owner, byHand = '' } = {}) {
    this.checks += 1;
    if (!found.length) return true;
    return this.fail({ must, did: `${where}: ${found.map((w) => `"${w}"`).join(', ')}`, byHand, owner, says: says || `was shown ${found.map((w) => `"${w}"`).join(', ')} on ${where}` });
  }

  /** REACH: a thing a person must be able to get to (in so many presses). */
  reach(must, ok, { did = 'could not get there', says, owner, byHand = '' } = {}) {
    this.checks += 1;
    if (ok) return true;
    return this.fail({ must, did, byHand, owner, says: says || `could not reach ${must}` });
  }

  /** A NOTE for the report when a reading was not possible, without failing (used sparingly, and said so). */
  note(text) { test.info().annotations.push({ type: 'note', description: text }); }
}

/**
 * The person asks; `fn(q)` takes the route and makes the checks. Any failure ends the test with one readable message.
 * `opts.seeded`: the plan was written into the store (allowed for saved shapes from before today's screens and for
 * long recorded histories); the message says so.
 */
export async function ask(person, question, route, fn, opts = {}) {
  const q = new Asking(person, question, route);
  const info = test.info();
  info.annotations.push({ type: 'question', description: q.question.id });
  if (opts.seeded) info.annotations.push({ type: 'seeded', description: 'true' });
  try {
    await fn(q);
  } catch (e) {
    const first = String((e && e.message) || e).split('\n').find((l) => l.trim()) || String(e);
    q.fail({ must: `the route to its end (${route.path})`, did: `stopped at "${q.at[q.at.length - 1] || 'the start'}": ${first.replace(/\u001b\[[0-9;]*m/g, '').slice(0, 300)}`, says: `could not take the route: it stopped at "${q.at[q.at.length - 1] || 'the start'}"` });
  }
  if (q.failures.length) {
    const text = failureText({ person, question: q.question, route: q.route, failures: q.failures, seeded: !!opts.seeded });
    info.annotations.push({ type: 'failure', description: text.split('\n')[0] });
    await info.attach('person-sentence', { body: text, contentType: 'text/plain' });
    const err = new Error(text);
    err.stack = text;                       // the person's words, not a stack of the harness
    throw err;
  }
  return q;
}
