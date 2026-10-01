/**
 * The words of the budget step (src/v7/copy/budget.js) and of "Save this as a plan" (src/v7/copy/keep.js), held to
 * the language guide (rail-screens-language.md Part 3) as the questions' own words are (wording.test.js): the banned
 * list in every scope they are shown in (A and B — saver and retired included — and C, which is all "retired"); only
 * slots the components fill; no "error", "failed", "submit"; the owner's rules said in the words themselves.
 */
import { describe, it, expect } from 'vitest';
import { bannedHits } from '../render/checkScreen.js';
import { BUDGET } from '../../../src/v7/copy/budget.js';
import { KEEP } from '../../../src/v7/copy/keep.js';

function strings(obj, path = '', out = []) {
  if (typeof obj === 'string') out.push([path, obj]);
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) strings(v, path ? `${path}.${k}` : k, out);
  return out;
}
/** Each slot filled as the component fills it. */
const filled = (s) => s.replace(/\{(amount|used|minimum|moderate|comfortable|yearly|diff)\}/g, '£2,340').replace(/\{who\}/g, 'one person')
  .replace(/\{level\}/g, 'Moderate').replace(/\{name\}/g, 'Stop at 60 · £1,850 a month');
const SCOPES = ['all', 'first', 'planner', 'saver', 'retired', 'result'];

describe.each([['budget.js', BUDGET, ['amount', 'used', 'minimum', 'moderate', 'comfortable', 'yearly', 'diff', 'who', 'level', 'name']], ['keep.js', KEEP, ['name']]])(
  'src/v7/copy/%s', (file, words, slots) => {
    it('every string passes the banned list in every scope it is shown in', () => {
      const whole = strings(words).map(([, s]) => filled(s)).join('\n');
      const hits = [];
      for (const [where, s] of strings(words)) for (const h of bannedHits(filled(s), SCOPES, { context: whole })) hits.push(`${file} ${where} — ${h}`);
      expect(hits).toEqual([]);
    });
    it('only slots the components fill', () => {
      const used = new Set();
      for (const [, s] of strings(words)) for (const m of s.matchAll(/\{([a-zA-Z]+)\}/g)) used.add(m[1]);
      for (const slot of used) expect(slots, slot).toContain(slot);
    });
    it('no "error", "failed", "invalid", "submit", "calculate"; no "guest", no "tab"', () => {
      for (const [where, s] of strings(words)) {
        expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
        expect(s, where).not.toMatch(/\bguest\b|\btabs?\b/i);
      }
    });
  });

describe('the owner\'s rules, in the words', () => {
  it('skipping the budget is said plainly, with why doing it is better', () => {
    expect(BUDGET.spend.skipNote).toMatch(/^You are skipping the budget\./);
    expect(BUDGET.spend.skipNote).toMatch(/most people spend more than they think/);
    expect(BUDGET.spend.howHelp.lines).toMatch(/^better/);
  });
  it('the budget is a guide: one-off costs are not added; the essentials change no figure', () => {
    expect(BUDGET.sheet.oneOffsNote).toMatch(/not added/);
    expect(BUDGET.sheet.essentials).toMatch(/does not change any figure/);
    expect(BUDGET.sheet.intro).toMatch(/never filled in for you/);
  });
  it('saving: as many as you like; an account, or carry on without one; the figures never in the address', () => {
    expect(KEEP.note).toMatch(/as many as you like/);
    expect(KEEP.note).toMatch(/without one/);
    expect(KEEP.privacy).toMatch(/never go into the address/);
    expect(KEEP.saved).toBe('Saved as ‘{name}’. Try something else and save that too.');
  });
});
