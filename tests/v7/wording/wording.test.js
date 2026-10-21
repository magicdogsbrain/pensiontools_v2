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
import { D } from '../../../src/v7/copy/d.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { ABOUT } from '../../../src/v7/copy/about.js';
import { INCOME } from '../../../src/v7/copy/income.js';
import { SPEND } from '../../../src/v7/copy/spend.js';
import { POTS } from '../../../src/v7/copy/pots.js';
import { LASTS } from '../../../src/v7/copy/lasts.js';
import { LOCK } from '../../../src/v7/copy/lock.js';
import { WAY } from '../../../src/v7/copy/way.js';
import { MIX } from '../../../src/v7/copy/mix.js';
import { HOUSEHOLD } from '../../../src/v7/copy/household.js';
import { STRATEGY_NAMES } from '../../../src/strategies/stressTest.js';
import { listStrategies } from '../../../src/strategies/registry.js';
import { WAY_IDS, WAY_DIALS } from '../../../src/answers/plan/schema.js';
import { MESSAGE_IDS } from '../../../src/answers/shared/validate.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c', 'd']);
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
  it('the saved plans (plan.js): every string passes in every scope a plan page is shown in — records, retired and saver alike', () => {
    // A plan page is a record screen (banned.js SCOPES.record); a retired person's and a saver's stages are both drawn from it.
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    const slot = (s) => s.replace(/\{(month|nextMonth|stop)\}/g, 'April 2027').replace(/\{(date|asOf)\}/g, '1 July 2026').replace(/\{(year|savedYear)\}/g, '2027/28')
      .replace(/\{monthName\}/g, 'October').replace(/\{time\}/g, '14:03').replace(/\{changed\}/g, '17 October 2026').replace(/\{n\}/g, '2').replace(/\{of\}/g, '3').replace(/\{name\}/g, 'Ladder plan').replace(/\{step\}/g, 'This month')
      .replace(/\{strategy\}/g, 'Full gilt ladder').replace(/\{dial\}/g, 'Years held in cash').replace(/\{mode\}/g, 'by risk level').replace(/\{from\}/g, '9 November 2036')
      .replace(/\{label\}/g, 'Rental flat').replace(/\{(to|age)\}/g, '74').replace(/\{what\}/g, 'a cash lump sum').replace(/\{level\}/g, 'balanced').replace(/\{years\}/g, '15');
    const hits = [];
    const all = strings(PLAN).map(([, s]) => slot(s)).join('\n');
    // the strategies' names are shown one at a time beside a label; the one with an ampersand is spelt as the planner spells it
    const skipOn = (where) => (where.startsWith('strategies.') ? ['bridge'] : []);
    for (const [where, s] of strings(PLAN)) for (const h of bannedHits(slot(s), scopes, { context: all, skip: skipOn(where) })) hits.push(`plan.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(PLAN)) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
  });
  it('"About you and when" (about.js): every string passes in every scope a plan page is shown in; no field without words', () => {
    // the editing step is a plan page (editing-in-v7.md 2): a retired person's and a saver's plan are both edited from it
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    const slot = (s) => s.replace(/\{(month|from)\}/g, 'April 2027').replace(/\{date\}/g, '1 July 2026').replace(/\{(year|yearNow|yearApril|yearSaved)\}/g, '2027/28')
      .replace(/\{(age|ageNow|endAge|minAge|value)\}/g, '57').replace(/\{(years|min|y)\}/g, '32').replace(/\{who\}/g, 'women').replace(/\{name\}/g, 'Sam');
    const hits = [];
    const all = strings(ABOUT).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(ABOUT)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`about.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(ABOUT)) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
    for (const [where, s] of strings(ABOUT)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
  });
  it('"Money that comes in anyway" (income.js): every string passes in every scope a plan page is shown in; no slot left unfilled', () => {
    // the second editing step is a plan page too (editing-in-v7.md 7): a retired person's and a saver's plan are both edited from it
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{year\}/g, '2027/28').replace(/\{(yearly|amount)\}/g, '£11,973').replace(/\{full\}/g, '£12,548')
      .replace(/\{(age|ageNow|endAge|from|to|n|value)\}/g, '67').replace(/\{years\}/g, '15 years').replace(/\{(fs|streams|lumps)\}/g, '2').replace(/\{day\}/g, '5 April 2028')
      .replace(/\{label\}/g, 'Rental flat').replace(/\{name\}/g, 'Sam').replace(/\{rises\}/g, 'going up with prices').replace(/\{what\}/g, 'a cash lump sum').replace(/\{sp\}/g, 'none');
    const hits = [];
    const all = strings(INCOME).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(INCOME)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`income.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(INCOME)) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
    for (const [where, s] of strings(INCOME)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
  });
  it('"What you spend" (spend.js): every string passes in every scope a plan page is shown in; no slot left unfilled', () => {
    // the third editing step is a plan page too (editing-in-v7.md 8): a retired person's and a saver's plan are both edited from it
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{year\}/g, '2027/28').replace(/\{(monthly|yearly|gross|net|total|essentials|amount|endMonthly|toMonthly)\}/g, '£2,300')
      .replace(/\{(age|ageNow|endAge|startAge|age75|age85|endAge|toAge|n|value)\}/g, '67').replace(/\{(years|steps|costs)\}/g, '2').replace(/\{(pct|budgetPct)\}/g, '85')
      .replace(/\{label\}/g, 'New roof').replace(/\{name\}/g, 'Sam').replace(/\{prices\}/g, 'going up with prices').replace(/\{floor\}/g, '');
    const hits = [];
    const all = strings(SPEND).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(SPEND)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`spend.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(SPEND)) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
    for (const [where, s] of strings(SPEND)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
  });
  it('"Does it last?" (lasts.js): every string passes in every scope a plan page is shown in; no slot left unfilled', () => {
    // the fifth editing step is a plan page too (editing-in-v7.md 10): a retired person's and a saver's plan are both shown it
    const scopes = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
    // the levers' slots (road-to-7.md step 7): money, a chance, the cost in runs, a plural
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{words\}/g, 'in 9 futures out of 10')
      .replace(/\{(perMonth|potBefore|potAfter|yearly)\}/g, '£25,000').replace(/\{(chance|baseChance|docChance)\}/g, '92.7').replace(/\{runs\}/g, '7').replace(/\{s\}/g, 's')
      .replace(/\{(typical|bad|good|perYear|total|worst|lowest|left|amount|buffer|leanest)\}/g, '£25,000')
      .replace(/\{(pct|half|full)\}/g, '20').replace(/\{(futures|of|n|histories|ranOut)\}/g, '1,000').replace(/\{(years|months|first|age|toAge|secured|year|lastStart|fired)\}/g, '12')
      .replace(/\{s\}/g, 's').replace(/\{name\}/g, 'Sam').replace(/\{value\}/g, '3').replace(/\{reserve\}/g, 'no reserve').replace(/\{strategy\}/g, 'Pots and valves')
      // Try a change (way-and-mix.md 4): the way, the pots, the policy, the income, the old figure, on or off, "instead of your steps"
      .replace(/\{way\}/g, 'Floor to an age, then decide').replace(/\{(pot|isa|income)\}/g, '£500,000').replace(/\{old\}/g, '35').replace(/\{policy\}/g, 'held back, never drawn for income').replace(/\{on\}/g, 'on').replace(/\{steps\}/g, ' instead of your steps');
    const hits = [];
    const all = strings(LASTS).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(LASTS)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`lasts.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(LASTS)) expect(s, where).not.toMatch(/\b(error|invalid|submit|calculate|simulate|simulation|Monte Carlo|percentile|FAILED)\b/);
    for (const [where, s] of strings(LASTS)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
    // the words every screen of the planner uses for the one answer (6.24.0), and the bad case said the one way
    expect(LASTS.verdict['lasts.headline']).toBe('Your plan lasts {words}.');
    expect(LASTS.rows.left).toContain('a bad case (the worst 1 in 10)');
    expect(strings(LASTS).some(([, s]) => /worst of 1,000|worst case/i.test(s))).toBe(false);
  });
  it('"Lock the plan" (lock.js): every string passes in every scope a plan page is shown in; no slot left unfilled; no jargon for the plan of record', () => {
    // the lock step, the unlock's confirm and the new version are plan pages (road-to-7.md step 6): a retired person's and a saver's plan alike
    const scopes = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{versions\}/g, '10').replace(/\{strategy\}/g, 'Full gilt ladder').replace(/\{charges\}/g, '0.5')
      .replace(/\{which\}/g, 'fund and platform charges of 0.5% a year');
    const hits = [];
    const all = strings(LOCK).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(LOCK)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`lock.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(LOCK)) expect(s, where).not.toMatch(/\b(error|invalid|submit|calculate|simulate|simulation|plan of record|yardstick|checksum|Firestore)\b/i);
    for (const [where, s] of strings(LOCK)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
    for (const [where, s] of strings(LOCK.buttons)) expect(s, where).not.toMatch(/^run\b/i);
    // the lock is offered once, on its own step; the unlock once, on "Your plan as locked"; never a browser dialog's words
    expect(LOCK.buttons.lock).toBe('Lock this plan');
    expect(LOCK.unlock.button).toBe('Unlock this plan');
    expect(strings(LOCK).some(([, s]) => /\b(OK|Cancel)\b/.test(s))).toBe(false);
  });
  it('"How the money is taken" (way.js): every string passes in every scope a plan page is shown in; the nine names are the planner\'s; every way has its promise, what can go wrong and words for each dial', () => {
    // the way step is a plan page (way-and-mix.md 2): a retired person's and a saver's plan alike; its cards state the answer
    const scopes = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{(words|docWords)\}/g, 'in 9 futures out of 10').replace(/\{(name|old|docWay|way)\}/g, 'Floor to an age, then decide')
      .replace(/\{(typical|bad|cost|left|short)\}/g, '£25,000').replace(/\{pct\}/g, '92.7').replace(/\{(futures|histories)\}/g, '1,000').replace(/\{(years|toAge|min|max)\}/g, '12').replace(/\{s\}/g, '4.6');
    const hits = [];
    const all = strings(WAY).map(([, s]) => slot(s)).join('\n');
    // the names are shown one at a time beside a label; the one with an ampersand is spelt as the planner spells it
    const skipOn = (where) => (where.startsWith('names.') ? ['bridge'] : []);
    for (const [where, s] of strings(WAY)) for (const h of bannedHits(slot(s), scopes, { context: all, skip: skipOn(where) })) hits.push(`way.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(WAY)) expect(s, where).not.toMatch(/\b(error|invalid|submit|calculate|simulate|simulation|Monte Carlo|percentile|strategy|allocation|MC|p10|p50|p90|equit(y|ies)|FAILED)\b/);
    for (const [where, s] of strings(WAY)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
    // the nine, as the planner names them (way-and-mix.md: "the nine ways keep the planner's names")
    expect(WAY.names).toEqual(STRATEGY_NAMES);
    expect(Object.keys(WAY.names)).toEqual(WAY_IDS);
    // every way has a promise and what can go wrong — the registry's, in V7's words — and words for each of its dials
    for (const st of listStrategies()) {
      expect(WAY.promise[st.id], st.id).toBeTypeOf('string');
      expect(WAY.wrong[st.id], st.id).toBeTypeOf('string');
      expect(st.promise.length).toBeGreaterThan(0); expect(st.failure.length).toBeGreaterThan(0);
    }
    for (const id of WAY_IDS) for (const d of WAY_DIALS[id]) {
      expect(WAY.dials.labels[d.key], `${id}.${d.key}`).toBeTypeOf('string');
      if (d.type === 'choice') for (const o of d.options) expect(WAY.dials.options[d.key] && WAY.dials.options[d.key][o], `${id}.${d.key}.${o}`).toBeTypeOf('string');
    }
    // the bad case is said the one way, and the score never decides the cards' order
    expect(WAY.card.left).toContain('a bad case (the worst 1 in 10)');
    expect(WAY.table.score).toContain('never decides the order of the cards');
  });
  it('"The mix" (mix.js): every string passes in every scope a plan page is shown in; no slot left unfilled; never the planner\'s words for the mix', () => {
    // the mix step is a plan page (way-and-mix.md 3): a retired person's and a saver's plan alike; its cells state the answer
    const scopes = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{(words|triedWords|ownWords)\}/g, 'in 9 futures out of 10').replace(/\{name\}/g, 'Full index-linked gilt ladder')
      .replace(/\{(pot|isa|shares|bonds|cash|diversifiers|amount|typical|bad|withBad|withoutBad)\}/g, '£250,000').replace(/\{pct\}/g, '92').replace(/\{(years|runs|n|line)\}/g, '15').replace(/\{ms\}/g, '4.6').replace(/\{s\}/g, 's')
      .replace(/\{(div|list|text|why|category|ticker|held|row|level)\}/g, 'balanced').replace(/\{(on|tent)\}/g, 'on').replace(/\{value\}/g, '3')
      .replace(/\{(read|recognised|unrecognised|unknown)\}/g, '2').replace(/\{(total|recognisedTotal|unrecognisedTotal|unknownTotal)\}/g, '£53,600');
    const hits = [];
    const all = strings(MIX).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(MIX)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`mix.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(MIX)) expect(s, where).not.toMatch(/\b(error|invalid|submit|calculate|simulate|simulation|Monte Carlo|percentile|strategy|allocation|portfolio|sub-?asset|sleeves?|equit(y|ies)|MC|p10|p50|p90|FAILED)\b/i);
    for (const [where, s] of strings(MIX)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
    // the bad case is said the one way; the cost of the runs is said where the figures are (way-and-mix.md 10)
    expect(MIX.tries.lines['sleeve.withTried']).toContain('a bad case (the worst 1 in 10)');
    expect(MIX.tries.ran.one).toBe('Tried in 1 run.');
    expect(MIX.compare.ranUntimed).toBe('Tried in 8 runs.');
  });
  it('"Your household" (household.js): every string passes in every scope a plan page is shown in; no slot left unfilled; never the planner\'s words for the household', () => {
    // the household step is a plan page (road-to-7.md step 9): a retired person's and a saver's plan alike; its verdict states the answer
    const scopes = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{(words|withWords|withoutWords|middling|bad|bothWith|bothWithout)\}/g, 'in 9 futures out of 10')
      .replace(/\{(name|a|b|small|big|deceased|survivor|names|wayA|wayB|way|store|where|value|line|from|to|reason|badReason)\}/g, 'Alex’s plan')
      .replace(/\{(year|until|whole|over|allowance|band|together|own|amount|cost|total|totalGross|gross|net|inherit|heldIsa)\}/g, '£12,800')
      .replace(/\{(untilAge|atAge|fromAge|from|earliest|ages|n|of|runs|years)\}/g, '67').replace(/\{pct\}/g, '92').replace(/\{ms\}/g, '4.6').replace(/\{s\}/g, 's')
      .replace(/\{(better|is|held|steps)\}/g, 'better off').replace(/\{(share|shared)\}/g, 'yes');
    const hits = [];
    const all = strings(HOUSEHOLD).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(HOUSEHOLD)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`household.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(HOUSEHOLD)) expect(s, where).not.toMatch(/\b(error|invalid|submit|calculate|simulate|simulation|Monte Carlo|percentile|strategy|allocation|portfolio|DB|survivor spends|years from now|today's money|MC|p10|p50|p90|FAILED)\b/);
    for (const [where, s] of strings(HOUSEHOLD)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
    // the questions are asked in ages (2.10), the bad case said the one way, the cost of the runs where the figures are, never "about £" on a plan page
    expect(HOUSEHOLD.fields['survivor.atAge'].label).toBe('At what age');
    expect(HOUSEHOLD.fields['care.fromAge'].label).toBe('From what age');
    expect(HOUSEHOLD.survivor.headline).toContain('(the worst 1 in 10)');
    expect(HOUSEHOLD.verdict.ranUntimed).toBe('Tried in {runs} run{s}.');
    for (const [where, s] of strings(HOUSEHOLD)) expect(s, where).not.toMatch(/about £/);
  });
  it('"Your pots and tax" (pots.js): every string passes in every scope a plan page is shown in; no slot left unfilled', () => {
    // the fourth editing step is a plan page too (editing-in-v7.md 9): a retired person's and a saver's plan are both edited from it
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    const slot = (s) => s.replace(/\{date\}/g, '1 July 2026').replace(/\{(pension|isa|taxable|shares|bonds|cash|sipp|sippBad|isaBad|pa|brl|hrl)\}/g, '£250,000')
      .replace(/\{(pct|charges)\}/g, '0.5').replace(/\{years\}/g, ' for 10 years').replace(/\{(then|div)\}/g, '').replace(/\{mode\}/g, 'the thresholds rise with prices')
      .replace(/\{name\}/g, 'Sam').replace(/\{value\}/g, '67');
    const hits = [];
    const all = strings(POTS).map(([, s]) => slot(s)).join('\n');
    for (const [where, s] of strings(POTS)) for (const h of bannedHits(slot(s), scopes, { context: all })) hits.push(`pots.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of strings(POTS)) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate)\b/i);
    for (const [where, s] of strings(POTS)) expect(slot(s), where).not.toMatch(/\{\w+\}/);
  });
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

  it('question d: every string passes in every scope D is shown in — retired included (answer-D.md: never a countdown, never "when you retire")', () => {
    const scopes = ['all', 'first', 'planner', 'retired'];
    const hits = [];
    const whole = strings(D).map(([, s]) => filled(s)).join('\n');
    for (const [where, s] of strings(D)) for (const h of bannedHits(filled(s), scopes, { context: whole })) hits.push(`d.js ${where} — ${h}`);
    expect(hits).toEqual([]);
  });

  it.each([['a', A], ['b', B], ['d', D]])('question %s: no slot the screen does not fill; no "error", "failed" or "calculate"', (q, words) => {
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
  ['b', ['all', 'first', 'planner', 'retired', 'result', 'saver']],
  ['d', ['all', 'first', 'planner', 'retired', 'result']]
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
  const names = ['c', 'a', 'b', 'd'].flatMap((q) => readdirSync(join(ROOT, 'tests/v7/states', q)).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => `${q}/${f.slice(0, -5)}`));
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
    // C and D are for people who have stopped: every state of theirs
    for (const name of names.filter((n) => ['c', 'd'].includes(load(n).route.q))) expect(visibleText(renderScreen(load(name))), name).not.toMatch(retired);
    // A and B: the retired view, and stopping now (the stop at today's age), are drawn under the same rules
    for (const name of ['a/answer-retired', 'a/answer-stop-now', 'b/answer-retired']) {
      const state = load(name);
      expect(scopesFor(state), name).toContain('retired');
      expect(visibleText(renderScreen(state)), name).not.toMatch(retired);
    }
  });

  it('no length of time to wait anywhere in A or B, working or not', () => {
    const wait = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b|\bin \d{1,2} years\b/i;
    for (const name of names.filter((n) => n.startsWith('a/') || n.startsWith('b/'))) {
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
