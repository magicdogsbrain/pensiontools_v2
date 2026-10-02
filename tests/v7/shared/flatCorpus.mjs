/**
 * TEST ONLY — the flat corpus (research/v7/spending-shape.md 9.1, I-SS1): every answer of A, B and C whose spending is the
 * same every year, pinned BEFORE the spending shape reached the answers (2 Oct 2026, 6.20.2 as committed), so the shape's
 * plumbing can be held to "a flat spend is today's answer, byte for byte".
 *
 *   flatCases()      → [{ q, inputs, env, from }] in a fixed order:
 *                        - every case of answers.sameYear.json (the 6.19.0 corpus: fixtures and random inputs, singles and
 *                          couples stopping in the same year, "show me ages", the every-age table, B's grid, C with a take);
 *                        - every fixture of tests/v7/fixtures (with its swap), at 20 futures;
 *                        - the households named by hand in tests/v7/cross/apart.test.js (couples who stop in different
 *                          years), in C, A and B;
 *                        - people aged 54 to 57 stopping now, soon or at an age, alone and together (the 2028 note);
 *   hashOf(result)   → the 24-hex sha256 of the WHOLE result, the app version read as one fixed stamp (as answers.sameYear)
 *
 * The figures are made up, round and generic: nobody's own.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { VERSION } from '../../../src/constants.js';

const ROOT = process.cwd();
const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 20, seed: 0, trace: false };

/** The stamp the app's version is read as: results carry basis.engineVersion, which moves with every release. */
export const STAMP = 'pinned';
const stamped = (text) => text.split(`"engineVersion":"${VERSION}"`).join(`"engineVersion":"${STAMP}"`);
export const hashOf = (r) => createHash('sha256').update(stamped(JSON.stringify(r))).digest('hex').slice(0, 24);

/** apart.test.js's households, as each question's inputs (its asC / asSaver, copied: that file exports nothing). */
function asC(h) {
  const person = (p) => ({ age: p.age, pot: p.pot, ...(p.payIn ? { payIn: { has: 'yes', kind: 'split', own: p.payIn.own, employer: p.payIn.employer } } : {}) });
  return {
    household: 'couple', you: person(h.you),
    partner: { ...person(h.partner), stop: h.partner.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: h.partner.stop } },
    savings: h.savings || 0, start: h.stop === 'already' ? { kind: 'now' } : { kind: 'age', age: h.stop },
    risk: h.risk || 'balanced', charge: h.charge ?? 0.5, endAge: h.endAge || 95, ...(h.payCovers ? { untilBothStop: h.payCovers } : {})
  };
}
function asSaver(h, spend, q) {
  const person = (p) => ({ age: p.age, pot: p.pot, ...(p.payIn ? { payIn: { kind: 'split', own: p.payIn.own, employer: p.payIn.employer } } : {}) });
  const out = {
    household: 'couple', you: person(h.you),
    partner: { ...person(h.partner), stop: h.partner.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: h.partner.stop } },
    savings: h.savings || 0, spend: { kind: 'amount', amount: spend }, savingsIn: 0, savingRisk: h.risk || 'balanced', risk: h.risk || 'balanced',
    charge: h.charge ?? 0.5, endAge: h.endAge || 95, ...(h.payCovers ? { untilBothStop: h.payCovers } : {})
  };
  if (q === 'a') return { ...out, stop: h.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: h.stop }, partTime: { has: false } };
  return { ...out, stop: h.stop === 'already' ? { kind: 'already' } : { age: h.stop }, confidence: 'nineInTen' };
}

const NAMED = [
  { you: { age: 55, pot: 260000, payIn: { own: 400, employer: 300 } }, partner: { age: 61, pot: 180000, payIn: null, stop: 'already' }, savings: 40000, stop: 56 },
  { you: { age: 61, pot: 180000, payIn: null }, partner: { age: 55, pot: 260000, payIn: { own: 400, employer: 300 }, stop: 56 }, savings: 40000, stop: 'already' },
  { you: { age: 52, pot: 220000, payIn: { own: 500, employer: 300 } }, partner: { age: 50, pot: 90000, payIn: { own: 200, employer: 150 }, stop: 57 }, savings: 30000, stop: 58, payCovers: 'all' },
  { you: { age: 57, pot: 300000, payIn: { own: 600, employer: 400 } }, partner: { age: 54, pot: 150000, payIn: null, stop: 'already' }, savings: 60000, stop: 60, payCovers: 'none', risk: 'cautious' },
  { you: { age: 55, pot: 420000, payIn: { own: 100, employer: 0 } }, partner: { age: 54, pot: 0, payIn: null, stop: 'already' }, savings: 34000, stop: 57 },
  { you: { age: 55, pot: 420000, payIn: { own: 100, employer: 0 } }, partner: { age: 54, pot: 15000, payIn: null, stop: 'already' }, savings: 30000, stop: 57 }
];

/** People of 54 to 57 stopping now, soon or at an age — alone and together, in C, A and B (the 2028 note's ground). */
function aroundTheRise() {
  const out = [];
  const c = (inputs) => out.push({ q: 'c', inputs, env: ENV, from: 'rise' });
  const a = (inputs) => out.push({ q: 'a', inputs, env: { ...ENV, detail: 'chart' }, from: 'rise' });
  const b = (inputs) => out.push({ q: 'b', inputs, env: { ...ENV, detail: 'answer' }, from: 'rise' });
  for (const age of [54, 55, 56, 57]) {
    c({ you: { age, pot: 300000 }, start: { kind: 'now' } });
    c({ you: { age, pot: 300000 }, savings: 50000, start: { kind: 'age', age: age + 1 } });
    a({ you: { age, pot: 300000, payIn: { total: 600 } }, savings: 50000, stop: { kind: 'age', age }, spend: { kind: 'amount', amount: 1500 } });
    a({ you: { age, pot: 300000, payIn: { total: 600 } }, savings: 50000, stop: { kind: 'age', age: age + 1 }, spend: { kind: 'amount', amount: 1500 } });
    b({ you: { age, pot: 200000, payIn: { kind: 'split', own: 400, employer: 300 } }, savings: 40000, stop: { age: age + 1 }, spend: { amount: 1600 } });
    c({ household: 'couple', you: { age, pot: 250000 }, partner: { age: 56, pot: 150000 }, start: { kind: 'now' } });
    a({ household: 'couple', you: { age, pot: 250000, payIn: { total: 500 } }, partner: { age: 55, pot: 150000, payIn: { total: 300 } }, savings: 30000,
      stop: { kind: 'age', age: age + 1 }, spend: { kind: 'amount', amount: 2600 } });
  }
  a({ you: { age: 54, pot: 250000, payIn: { total: 700 } }, savings: 80000, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 1500 } });
  a({ household: 'couple', you: { age: 56, pot: 300000 }, partner: { age: 55, pot: 200000, payIn: { total: 600 }, stop: { kind: 'age', age: 56 } }, savings: 40000,
    stop: { kind: 'already' }, spend: { kind: 'amount', amount: 2800 } });
  return out;
}

/**
 * Who the 2028 note should name, worked out on its own from dates (every case is on 30 Sep 2026, ages typed, so each
 * birthday is 30 September): a person whose pension is first touched before 6 April 2028 — at their own stop or start S
 * whole years from today, or at 55 if that is later — and who is 55 or 56 on that day. On 6 April 2028 a person is their
 * age today + 1; they first draw on 30 September of 2026 + max(S, 55 − age), which is before 6 April 2028 only for 2026 and
 * 2027. So: age 54 or 55 today, and max(S, 55 − age) ≤ 1. A person counts when they have a pension at their stop.
 * → the `who`s, in household order.
 */
export function whoIn2028(q, inputs, result) {
  if (!result || !['ok', 'out-of-reach'].includes(result.status)) return [];
  const couple = inputs.household === 'couple' && inputs.partner;
  const whos = couple ? ['you', 'partner'] : ['you'];
  const S = (who) => {
    if (result.apart) return result.apart.stops[who].age - result.inputs[who].age;
    if (q === 'a') return result.shown.ages[who] - result.inputs[who].age;
    if (q === 'b') return result.ages[who] - result.inputs[who].age;
    const younger = Math.min(...whos.map((w) => result.inputs[w].age));
    return result.basis.startAge - younger;
  };
  const payIn = (who) => {
    const p = result.inputs[who].payIn;
    if (!p || p.has === 'no' || (q === 'c' && p.has !== 'yes')) return 0;
    return p.kind === 'split' ? (p.own || 0) + (p.employer || 0) : p.total || 0;
  };
  return whos.filter((who) => {
    const age = result.inputs[who].age;
    const s = S(who);
    const pension = (result.inputs[who].pot || 0) > 0 || (payIn(who) > 0 && s > 0);
    return pension && (age === 54 || age === 55) && Math.max(s, 55 - age) <= 1;
  });
}

/** The people the 2028 note in a result names: from its words. */
export function whoNamed2028(result) {
  const w = (result.warnings || []).find((x) => x.id === 'drawdown-2028');
  if (!w) return [];
  if (/each of you/.test(w.text)) return ['you', 'partner'];
  return /^For your partner/.test(w.text) ? ['partner'] : ['you'];
}

/** Every case of the flat corpus, in a fixed order. */
export function flatCases() {
  const out = [];
  for (const x of JSON.parse(readFileSync(resolve(ROOT, 'tests/v7/shared/answers.sameYear.json'), 'utf8'))) out.push({ q: x.q, inputs: x.inputs, env: x.env, from: 'sameYear' });
  for (const q of ['a', 'b', 'c']) {
    const dir = resolve(ROOT, 'tests/v7/fixtures', q);
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.json')).sort()) {
      const j = JSON.parse(readFileSync(resolve(dir, f), 'utf8'));
      const env = { ...j.env, futures: 20, ...(q === 'a' ? { detail: 'chart' } : q === 'b' ? { detail: 'answer' } : {}) };
      out.push({ q, inputs: j.inputs, env, from: `fixture ${j.id}` });
      if (j.swap && j.swap.inputs) out.push({ q, inputs: j.swap.inputs, env, from: `fixture ${j.id} swap` });
    }
  }
  NAMED.forEach((h, k) => {
    out.push({ q: 'c', inputs: asC(h), env: ENV, from: `apart ${k}` });
    out.push({ q: 'a', inputs: asSaver(h, 2500, 'a'), env: { ...ENV, detail: 'chart' }, from: `apart ${k}` });
    out.push({ q: 'b', inputs: asSaver(h, 2500, 'b'), env: { ...ENV, detail: 'answer' }, from: `apart ${k}` });
  });
  out.push(...aroundTheRise());
  return out;
}
