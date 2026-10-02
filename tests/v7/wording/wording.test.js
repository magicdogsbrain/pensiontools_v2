/**
 * The words (language guide Part 3; build brief section 6, P4; step 4 brief 6, P5).
 *
 *  - the banned list over every string in src/v7/copy/ and over the sentence templates, by scope — A's and B's with
 *    the saver rules (no countdown, no "contribution", "on track" …) and the retired rules too;
 *  - the banned list over every drawn state of C, A and B (checkScreen's R11 does the work; here it is named on its own);
 *  - every field path has a label and every message a sentence;
 *  - ADVICE_SHORT under every headline and ADVICE_FULL on every answer step, letter for letter.
 *
 * A and B are drawn as the joined-up branch has them (rail/questions.js with all three open).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen, SCHEMA_C } from '../c/_c.js';
import { bannedHits, scopesFor, visibleText } from '../render/checkScreen.js';
import { BANNED, SCOPES, QUESTION_EXEMPT } from '../../../src/v7/copy/banned.js';
import * as common from '../../../src/v7/copy/common.js';
import { C } from '../../../src/v7/copy/c.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { MESSAGE_IDS } from '../../../src/answers/shared/validate.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const ROOT = process.cwd();
const { ADVICE_SHORT, ADVICE_FULL, FRONT } = common;

/** Every string in a piece of copy, with where it is: [['fields.you.pot.label', 'Your pension pot'], …]. */
function strings(obj, path = '', out = []) {
  if (typeof obj === 'string') out.push([path, obj]);
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) strings(v, path ? `${path}.${k}` : k, out);
  return out;
}
/** A string as a person would see it: each {slot} filled with a figure of the right kind. */
const filled = (s) => s.replace(/\{(amount|min|max)\}/g, '£25,000').replace(/\{(age|n|of|earliest)\}/g, '57')
  .replace(/\{level\}/g, 'Moderate').replace(/\{who\}/g, 'one person').replace(/\{name\}/g, 'Stop later').replace(/\{words\}/g, 'in 9 futures out of 10');

describe('the banned list itself', () => {
  it('is the language guide\'s list: every entry has an id, a pattern, a known scope, and words to use instead', () => {
    expect(BANNED.length).toBeGreaterThanOrEqual(70);
    const ids = new Set();
    for (const e of BANNED) {
      expect(e.re, e.id).toBeInstanceOf(RegExp);
      expect(e.re.global, `${e.id} must not be a /g pattern (it would remember where it stopped)`).toBe(false);
      expect(Object.keys(SCOPES), e.id).toContain(e.scope);
      if (e.kind === 'explain') expect(e.needs, e.id).toBeInstanceOf(RegExp);
      else expect(typeof e.say, e.id).toBe('string');
      expect(ids.has(e.id), `two entries called ${e.id}`).toBe(false);
      ids.add(e.id);
    }
    for (const id of QUESTION_EXEMPT) expect(ids.has(id)).toBe(true);
  });

  it('catches what it is there to catch, and lets through what the guide allows', () => {
    const all = ['all', 'first', 'front', 'retired', 'planner', 'result'];
    const bad = [
      'Open the Stress Tester', 'your decumulation plan', 'in plan year 3', 'the bridge years', 'a 90% success rate',
      'the median outcome', 'in the worst case', '£250k', '£1,050 per month', '7 months to go', 'when you retire',
      'your plan starts in April', 'we recommend this', 'you should take less', 'this is safe', 'it will last',
      'about £1,000, or around £1,100', '£1,050 - £1,650', 'undefined a month', 'in 1 futures out of 10', 'net income',
      'a bad case', 'an annuity', 'Monte Carlo', 'your SIPP', 'a scenario', 'this tab', 'guest mode', '£ a month'
    ];
    for (const text of bad) expect(bannedHits(text, all), text).not.toEqual([]);
    const good = [
      'In a bad case (the worst 1 in 10), £1,380 a month only just lasts to 95.',
      'buying a guaranteed income for life (an annuity)',
      'An illustration from your figures, not financial advice.',
      'That amount lasted in 9 futures out of 10.',
      'about £1,050 a month after tax, going up each year with prices',
      'You could take: careful £1,380, middling £1,590, good £1,860 a month.',
      'Your pension pot £ [ ]'
    ];
    for (const text of good) expect(bannedHits(text, ['all', 'first', 'planner', 'retired', 'result']), text).toEqual([]);
  });

  it('has the saver entries of screens-A-B.md 9.3 (22) and the countdown anywhere in A or B, scope saver', () => {
    const ids = new Set(BANNED.map((e) => e.id));
    for (const id of ['contribution', 'employer-contrib', 'tax-relief', 'retirement-age', 'target', 'projection', 'forecast-pot', 'on-track', 'confidence',
      'shortfall', 'withdrawal-rate', 'sustainable', 'coast', 'fire', 'semi-retire', 'feasible', 'pass-fail', 'soften-harden', 'compound', 'growth-rate',
      'years-from-now', 'a-year-longer']) expect(ids.has(id), id).toBe(true);
    expect(BANNED.find((e) => e.id === 'countdown-any').scope).toBe('saver');
    expect(SCOPES.saver).toBeTruthy();
    const saver = ['all', 'first', 'planner', 'saver', 'result'];
    const bad = ['your monthly contribution', 'your employer contribution', 'your retirement age', 'a target pot', 'the projected pot', 'you are on track',
      'a shortfall of £70,000', 'a safe withdrawal rate', 'a sustainable income', 'coasting from 50', 'FIRE at 45', 'semi-retirement', 'that is feasible',
      'it failed', 'you could comfortably retire', 'compound growth', 'at 5% growth', 'in 15 years', 'one year longer', '15 years to go',
      '7 years until you stop', '3 months before the date', 'tax relief'];
    for (const text of bad) expect(bannedHits(text, saver, { context: text }), text).not.toEqual([]);
    const good = ['what you pay in each month', 'your employer’s part', 'the age you have in mind', 'what the pot could be by 60', 'on course for 60',
      '£70,000 short', 'part-time work for 3 years after you stop', 'working until 61 instead of 60', 'from your State Pension forecast',
      'tax relief — the tax the government adds back', 'Yes — you could stop at 60', 'it lasted in 9 futures out of 10'];
    for (const text of good) expect(bannedHits(text, saver), text).toEqual([]);
  });

  it('only the front door bans tool names; "PensionTools" is let through', () => {
    expect(bannedHits('Open the planner', ['front'])).not.toEqual([]);
    expect(bannedHits('PensionTools works things out from the figures you give it.', ['all', 'first', 'front'])).toEqual([]);
  });
});

describe('the words in src/v7/copy/', () => {
  const Q_SCOPES = ['all', 'first', 'planner', 'retired'];
  it('question C: every string passes, in every scope question C is shown in — the "retired" rules included', () => {
    const hits = [];
    const whole = strings(C).map(([, s]) => filled(s)).join('\n');
    for (const [where, s] of strings(C)) for (const h of bannedHits(filled(s), Q_SCOPES, { context: whole })) hits.push(`c.js ${where} — ${h}`);
    expect(hits).toEqual([]);
  });

  it.each([['a', A], ['b', B]])('question %s: every string passes in every scope A and B are shown in — saver and retired included', (q, words) => {
    const scopes = ['all', 'first', 'planner', 'saver', 'retired'];
    const hits = [];
    const whole = strings(words).map(([, s]) => filled(s)).join('\n');
    for (const [where, s] of strings(words)) for (const h of bannedHits(filled(s), scopes, { context: whole })) hits.push(`${q}.js ${where} — ${h}`);
    expect(hits).toEqual([]);
  });

  it.each([['a', A], ['b', B]])('question %s: no slot the screen does not fill; no "error", "failed" or "calculate"', (q, words) => {
    const slots = new Set();
    for (const [, s] of strings(words)) for (const m of s.matchAll(/\{([a-zA-Z]+)\}/g)) slots.add(m[1]);
    for (const slot of slots) expect(['age', 'amount', 'max', 'min', 'n', 'of', 'earliest', 'level', 'who', 'name', 'words'], slot).toContain(slot);
    for (const [where, s] of strings(words)) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
    for (const [where, s] of strings(words.buttons)) expect(s, where).not.toMatch(/^run\b/i);
  });

  it('the shared words pass; the six questions are the visitor\'s own words and pass as such', () => {
    const hits = [];
    const whole = strings(common).map(([, s]) => s).join('\n');
    for (const [where, s] of strings({ ...common, FRONT: undefined })) {
      for (const h of bannedHits(filled(s), ['all', 'first'], { context: whole })) hits.push(`common.js ${where} — ${h}`);
    }
    for (const [where, s] of strings(FRONT)) {
      const question = /^questions\.\d+\.(ask|then)$/.test(where);
      for (const h of bannedHits(filled(s), ['all', 'first', 'front', 'result'], { context: whole, question, skip: question ? [] : ['safe'] })) hits.push(`common.js FRONT.${where} — ${h}`);
    }
    expect(hits).toEqual([]);
  });

  it('no string is left with a slot the screen does not know how to fill', () => {
    const slots = new Set();
    for (const [, s] of [...strings(C), ...strings(common)]) for (const m of s.matchAll(/\{([a-zA-Z]+)\}/g)) slots.add(m[1]);
    expect([...slots].sort()).toEqual(['age', 'amount', 'max', 'min', 'n', 'of']);
  });

  it('nothing in copy/ says "error", "failed", "invalid", "submit", "calculate" or "run" on a button (language guide 3.6)', () => {
    for (const [where, s] of [...strings(C), ...strings(common)]) {
      expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
    }
    for (const [where, s] of strings(C.buttons)) expect(s, where).not.toMatch(/^run\b/i);
  });

  it('copy files are data: they import nothing', () => {
    for (const f of readdirSync(join(ROOT, 'src/v7/copy'))) {
      expect(readFileSync(join(ROOT, 'src/v7/copy', f), 'utf8'), f).not.toMatch(/^\s*import\s/m);
    }
  });
});

describe.each([
  ['c', ['all', 'first', 'planner', 'retired', 'result']],
  ['a', ['all', 'first', 'planner', 'retired', 'result', 'saver']],
  ['b', ['all', 'first', 'planner', 'retired', 'result', 'saver']]
])('the sentence templates (src/answers/%s/sentences.js), read as text', (q, scopes) => {
  const file = join(ROOT, `src/answers/${q}/sentences.js`);
  const source = existsSync(file) ? readFileSync(file, 'utf8') : '';
  /** The string literals of a source file — the words, without the code around them. */
  const literals = (src) => [...src.replace(/\/\*[\s\S]*?\*\/|(^|\s)\/\/.*$/gm, '').matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)]
    .map((m) => (m[1] ?? m[2] ?? m[3]).replace(/\\(['"`])/g, '$1'));

  it('hold no banned word (the checks for broken output are left to the drawn states, where the slots are filled)', () => {
    const hits = [];
    const words = literals(source).filter((s) => /[a-z] [a-z]/i.test(s));          // sentences and pieces of them, not ids
    // An explanation may be built from pieces in the code — 'the worst ', F('1'), ' in ', F('10') — so for the
    // entries that need one, the pieces are joined up first.
    const whole = source.replace(/\bF\('([^']*)'\)/g, '$1').replace(/\{\s*fixed:\s*'([^']*)'\s*\}/g, '$1').replace(/'\s*,\s*'|'\s*,\s*|,\s*'/g, '');
    for (const s of words) {
      const text = s.replace(/\$\{[^}]*\}/g, '57');
      for (const h of bannedHits(text, scopes, { context: whole, skip: ['junk', 'empty-money', 'one-plural', 'double-about'] })) hits.push(h);
    }
    expect(hits).toEqual([]);
  });
});

describe('couples who stop work in different years: one set of words in all three questions (couples-different-years.md 2)', () => {
  const straight = (v) => JSON.parse(JSON.stringify(v).replace(/’/g, "'"));
  it('the pay line, its three settings and the tax-free questions read the same in C, A and B', () => {
    for (const path of ['untilBothStop', 'you.taxFreeTaken', 'partner.taxFreeTaken']) {
      expect(straight(A.fields[path]), path).toEqual(straight(C.fields[path]));
      expect(straight(B.fields[path]), path).toEqual(straight(C.fields[path]));
    }
  });
  it('"When does your partner stop work?" is the same question in all three; only C says "when you start taking money"', () => {
    for (const words of [A, B, C]) expect(words.fields['partner.stop.kind'].label).toBe('When does your partner stop work?');
    expect(C.fields['partner.stop.kind'].options.same).toBe('When you start taking money');
    expect(A.fields['partner.stop.kind'].options.same).toBe('When you do');
    expect(B.fields['partner.stop.kind'].options.same).toBe('When you do');
  });
  it('every new error sentence names what to do, in the guide\'s words, and none is a slot the screen cannot fill', () => {
    const ids = ['partner-stop-not-before-now', 'partner-stop-fits', 'partner-ages-one-at-a-time', 'partner-stop-ages-past-75', 'partner-stop-after-now',
      'already-needs-partner', 'end-after-stop-apart', 'end-after-start-apart'];
    const found = [];
    for (const words of [A, B, C]) {
      for (const [where, s] of strings(words.fields)) if (ids.some((id) => where.endsWith(`errors.${id}`))) found.push([where, s]);
    }
    expect(found.length).toBe(13);                      // A 6, B 5, C 2
    for (const [where, s] of found) {
      expect(s, where).toMatch(/\b(choose|type|give|ask|if you have stopped)\b/i);
      expect(s, where).not.toMatch(/\{/);
    }
  });
});

describe('every drawn state', () => {
  const names = ['c', 'a', 'b'].flatMap((q) => readdirSync(join(ROOT, 'tests/v7/states', q)).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => `${q}/${f.slice(0, -5)}`));
  const load = (name) => JSON.parse(readFileSync(join(ROOT, 'tests/v7/states', `${name}.json`), 'utf8'));

  it.each(names)('%s holds no banned word, by its scope', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    const text = visibleText(root);
    expect(bannedHits(text, scopesFor(state))).toEqual([]);
    for (const region of root.querySelectorAll('[data-region="answer"]')) expect(bannedHits(visibleText(region), ['result'], { context: text })).toEqual([]);
  });

  it.each(names)('%s carries the advice lines, letter for letter', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    const heads = [...root.querySelectorAll('[data-headline]')];
    for (const h of heads) expect(h.textContent).toContain(ADVICE_SHORT);
    if (state.route.step === 'answer' && root.querySelector('main').getAttribute('data-view') !== 'retired') expect(root.textContent).toContain(ADVICE_FULL);
    expect(root.querySelector('[data-region="footer"]').textContent).toContain(ADVICE_SHORT);
    // Neither can be closed, collapsed or dismissed.
    for (const el of root.querySelectorAll('[hidden], details:not([open])')) {
      expect(el.textContent).not.toContain(ADVICE_SHORT);
      expect(el.textContent).not.toContain(ADVICE_FULL);
    }
  });

  it('a person who has already stopped work is never given a stop-work word or a length of time to wait', () => {
    const retired = /when you retire|until you retire|when you stop work|years to go|months to go|plan starts|countdown|to retirement|\bin \d+ (years|months)\b/i;
    for (const name of names.filter((n) => load(n).route.q === 'c')) expect(visibleText(renderScreen(load(name))), name).not.toMatch(retired);
    // A and B: the retired view, and stopping now (the stop at today's age), are drawn under the same rules
    for (const name of ['a/answer-retired', 'a/answer-stop-now', 'b/answer-retired']) {
      const state = load(name);
      expect(scopesFor(state), name).toContain('retired');
      expect(visibleText(renderScreen(state)), name).not.toMatch(retired);
    }
  });

  it('no length of time to wait anywhere in A or B, working or not', () => {
    const wait = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b|\bin \d{1,2} years\b/i;
    for (const name of names.filter((n) => !n.startsWith('c/'))) {
      expect(scopesFor(load(name)), name).toContain('saver');
      expect(visibleText(renderScreen(load(name))), name).not.toMatch(wait);
    }
  });

  it('the words the test plan bans everywhere appear nowhere', () => {
    const everywhere = /decumulation|plan year|bridge|stress test|accumulation|glidepath|monte carlo|percentile|simulation|sequence risk|wrapper|crystallis|UFPLS|PCLS|nominal|real terms|\btbc\b|\btodo\b|\bgross\b|\bnet\b|\bDB\b|\bDC\b|\bSIPP\b/i;
    for (const name of names) expect(visibleText(renderScreen(load(name))), name).not.toMatch(everywhere);
  });
});

describe('the words and the input list agree', () => {
  it('every field path has a label; every choice has words for each option', () => {
    for (const f of SCHEMA_C.fields) {
      expect(C.fields[f.path]?.label, f.path).toBeTruthy();
      for (const o of f.options || []) expect(C.fields[f.path].options[o], `${f.path}: ${o}`).toBeTruthy();
    }
    expect(Object.keys(C.fields).sort()).toEqual(SCHEMA_C.fields.map((f) => f.path).sort());
  });

  it('every message a field can get has a sentence — its own, or the one for its kind', () => {
    for (const f of SCHEMA_C.fields.filter((x) => x.type === 'money' || x.type === 'age')) {
      for (const id of MESSAGE_IDS.filter((m) => m !== 'notAnOption')) {
        expect(C.fields[f.path].errors?.[id] || C.errors[f.type][id], `${f.path} ${id}`).toBeTruthy();
      }
    }
    for (const rule of SCHEMA_C.rules) expect(C.fields[rule.fields[0]].errors[rule.id], rule.id).toBeTruthy();
    expect(C.errors.other).toBeTruthy();
  });

  it('every step and every next sentence of the rail has its words', async () => {
    const { QUESTION_C, NEXT_C } = await import('../../../src/v7/rail/c.js');
    for (const s of QUESTION_C.steps) { expect(C.steps[s.id].label).toBeTruthy(); expect(C.steps[s.id].short).toBeTruthy(); }
    for (const id of NEXT_C) expect(C.next[id], id).toBeTruthy();
    expect(FRONT.questions.map((q) => q.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('the advice lines are the owner\'s, letter for letter', () => {
    expect(ADVICE_SHORT).toBe('An illustration from your figures, not financial advice.');
    expect(ADVICE_FULL).toBe('This is an illustration worked out from the figures you entered. It is not financial advice and it does not tell you what to do. Pension Wise, from MoneyHelper, gives free guidance to anyone aged 50 or over.');
  });
});
