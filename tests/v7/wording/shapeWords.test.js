/**
 * The words of the spending shape (src/v7/copy/shape.js; research/v7/spending-shape.md 7), held to the language guide as
 * the questions' own words are: the banned list in every scope they are shown in — A's and B's (saver, and retired when
 * stopping now) and C's (all retired) — with every slot filled as the components fill it; only those slots; none of the
 * words the design rules out ("net", "gross", "per", "real terms", "compound", "glide path", "recommend", "we suggest",
 * "will last"); and the owner's rule said in the words themselves: go-go, go-slow and no-go, the suggestion a typical
 * pattern and never a figure for you, the budget's essentials a guide.
 */
import { describe, it, expect } from 'vitest';
import { bannedHits } from '../render/checkScreen.js';
import { SHAPE } from '../../../src/v7/copy/shape.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { C } from '../../../src/v7/copy/c.js';

function strings(obj, path = '', out = []) {
  if (typeof obj === 'string') out.push([path, obj]);
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) strings(v, path ? `${path}.${k}` : k, out);
  return out;
}
/** Each slot filled as the component fills it. */
const SLOTS = {
  amount: '£2,130', income: '£1,046', pots: '£1,084', age: '75', age75: '75', age85: '85', pct: '85', budgetPct: '71', n: '4', gap: '6 years', younger: 'younger',
  from: '62', to: '94', floor: ', not below your budget’s essentials of £1,800 a month',
  list: '£2,500 a month from 62, £2,130 from 75 and £1,750 from 85'
};
const filled = (s) => s.replace(/\{(\w+)\}/g, (m, k) => (k in SLOTS ? SLOTS[k] : m));
const SCOPES = ['all', 'first', 'planner', 'saver', 'retired'];

describe('src/v7/copy/shape.js', () => {
  it('every string passes the banned list in every scope it is shown in (A, B and C: saver and retired)', () => {
    const whole = strings(SHAPE).map(([, s]) => filled(s)).join('\n');
    const hits = [];
    for (const [where, s] of strings(SHAPE)) for (const h of bannedHits(filled(s), SCOPES, { context: whole })) hits.push(`shape.js ${where} — ${h}`);
    expect(hits).toEqual([]);
  });
  it('only slots the components fill', () => {
    for (const [where, s] of strings(SHAPE)) for (const m of s.matchAll(/\{([a-zA-Z0-9]+)\}/g)) expect(Object.keys(SLOTS), `${where}: {${m[1]}}`).toContain(m[1]);
  });
  it('none of the words the design rules out; no "error", "invalid", "submit"; plain "a month" and "a year"', () => {
    for (const [where, s] of strings(SHAPE)) {
      expect(s, where).not.toMatch(/\b(net|gross|per|real terms|today['’]s money|compound\w*|glide path|recommend\w*|we suggest|will last|advise)\b/i);
      expect(s, where).not.toMatch(/\b(error|invalid|submit|calculate)\b/i);
    }
  });
  it('the owner\'s rule in the words: go-go, go-slow and no-go; a typical pattern, not a figure for you; the essentials a guide', () => {
    expect(SHAPE.suggest).toBe('Suggest go-go, go-slow and no-go years');
    for (const w of ['go-go', 'go-slow', 'no-go']) { expect(SHAPE.lead).toContain(w); expect(SHAPE.leadC).toContain(w); }
    expect(SHAPE.suggestDone).toMatch(/15% less from \{age75\} and 30% less from \{age85\}/);
    expect(SHAPE.suggestDone).toMatch(/not a figure for you: change any of it\.$/);
    expect(SHAPE.belowEssentials).toMatch(/That is allowed: it is your figure\.$/);
    expect(SHAPE.chart.keyEssentials).toMatch(/\(a guide\)/);
    expect([SHAPE.then.level, SHAPE.then.falls, SHAPE.then.glides]).toEqual(['stays the same', 'falls by a percentage a year', 'moves evenly to the next step']);
    expect(SHAPE.presetSlowlyHelp).toBe('The same for 5 years, then 1% less each year for 20 years, then the same.');
    expect(SHAPE.lead).toMatch(/after tax, at today’s prices, and goes up with prices\./);
  });
  it('every error the checks can give a step has its sentence (validate.js: the steps\' own ids and the rule shape-steps)', () => {
    for (const id of ['required', 'notANumber', 'order', 'beforeStop', 'beforeFirstStop', 'beforeNow', 'beforeStart', 'afterEnd']) expect(SHAPE.errors.fromAge[id], `fromAge ${id}`).toBeTruthy();
    for (const unit of ['perMonth', 'share']) for (const id of ['required', 'notANumber', 'tooLow', 'tooHigh']) expect(SHAPE.errors[unit][id], `${unit} ${id}`).toBeTruthy();
    expect(SHAPE.errors.fallsPct.range).toBeTruthy();
    expect(SHAPE.errors.then.glidesLast).toBeTruthy();
    expect(SHAPE.errors.steps.tooMany).toBeTruthy();
  });
  it('the input list\'s own words for the shape\'s fields are the block\'s words, in all three questions', () => {
    for (const [words, base] of [[A, 'spend'], [B, 'spend'], [C, 'shape']]) {
      expect(words.fields[`${base}.then`].options).toEqual({ level: SHAPE.then.level, falls: SHAPE.then.falls, glides: SHAPE.then.glides });
      expect(words.fields[`${base}.then`].errors.glidesLast).toBe(SHAPE.errors.then.glidesLast);
      expect(words.fields[`${base}.fallsPct`].errors.notANumber).toBe(SHAPE.errors.fallsPct.range);
      expect(words.fields[`${base}.steps`].errors.tooMany).toBe(SHAPE.errors.steps.tooMany);
    }
  });
});
