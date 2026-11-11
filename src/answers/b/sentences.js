/**
 * The sentences of question B (step 4 brief 4.9; screens-A-B.md 7.2 and 4.2–4.4), what was assumed (7.3) and the
 * warnings (brief 4.9). Every figure in a sentence is a reference into the result, so the screen can mark it; `text` is
 * the parts joined by format.js, and a test asserts the two agree.
 *
 * Plain English, in every state: "pay in", "what goes in each month", "stop at 60", "while you are saving", "on course",
 * "£70,000 short", "a bad case (the worst 1 in 10)". Ages, never a length of time to wait. One "about" a sentence.
 * Couples are "you" and "your partner", "between you", "the two of you".
 *
 * Couples who stop work in different years (result.apart; couples-different-years.md 2.4): the number is the pensions of
 * those still saving, each at their own stop — "You need about £410,000 in pensions between you: yours when you stop at 60
 * and your partner's when they stop at 62", "… in your pension when you stop at 60, with your partner's money as you gave
 * it", or, after "I've already stopped" (result.askedAbout), "Your partner needs about £300,000 in their pension when they
 * stop at 56, with your money as you gave it". What was assumed and the warnings carry the pay line (shared/apart.js, the
 * same words in C, A and B). With one stop for both nothing here changes.
 */
import { money, partsText, lastedText } from '../shared/format.js';
import { LEVEL_NAME as LEVEL_WORD, countingLead, asLongAs, chanceParts, asksForParts, fixedSentence, boldSentence, whenParts, howLongParts, howMuchParts, floorParts, lifeAssumed } from '../shared/lastsWords.js';
import { shareCutPercent } from '../shared/futures.js';
import { RULES, SAVING, LEVEL_FAILS20 } from '../shared/rules.js';
import { LEVEL_IDS } from '../shared/shown.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
import { apartAssumed, apartWarnings } from '../shared/apart.js';
import { atTheStart, shapeWarnings } from '../shared/shapeAnswer.js';
import { savingsGrowthParts, mostlyCashParts } from '../shared/savingsGrowth.js';

const M = (key) => ({ key, kind: 'money' });
const A = (key) => ({ key, kind: 'age' });
const P = (key) => ({ key, kind: 'pot' });
const F = (fixed) => ({ fixed: String(fixed) });
/** A share of pay, written "31%" (format.js pctText). */
const PCT = (key) => ({ key, kind: 'pct' });

/**
 * The one charge line (6.19.0), word for word the same in C, A and B (each question keeps its own words; the test holds
 * them equal): what comes off, from what, when — and what it is never taken from. `pct` is the charge as typed (percent
 * a year), shown as typed: 0.5, 0.05, 1.25.
 */
const chargesParts = (pct) => ['Charges of ', F(String(pct)), '% a year come off the money in funds and cash, while saving and while drawing; not off State Pension or final-salary pension.'];
const S = (id, parts, mark) => ({ id, text: '', parts: parts.flat(Infinity).filter((p) => p !== '' && p != null), ...(mark ? { mark } : {}) });

/** 'in only 6 futures out of 10' → parts, each count a fixed figure. */
export function wordsParts(words) {
  return words.split(/(\d+)/).map((piece, i) => (i % 2 ? F(piece) : piece)).filter((p) => p !== '');
}
/** The count of lives that lasted, in words: "in 9 futures out of 10", "in just under 9 futures out of 10" (85% to under 90%: never the careful 9). */
const countParts = (share) => wordsParts(lastedText(share));
/**
 * The words of a level: what the pay-in that gets there reaches the number in (7.8.0, while not weighing: the count each
 * level lets through, floor(t·n/20) failures).
 */
export const CONFIDENCE_WORDS = { careful: 'in 19 futures out of 20', balanced: 'in 9 futures out of 10', bold: 'in 7 futures out of 10' };
const confParts = (c) => (WEIGH ? levelChance(c) : wordsParts(CONFIDENCE_WORDS[c] || CONFIDENCE_WORDS.balanced));
/** The same as "9 in 10", for "which is 9 in 10". */
const LEVEL_IN_COUNT = { careful: [F('19'), ' in ', F('20')], balanced: [F('9'), ' in ', F('10')], bold: [F('7'), ' in ', F('10')] };

/*
 * 7.8.0, weighing (research/v7/replan-nov-2026.md 5): while an answer's words are written (textsFor sets it, and clears
 * it after), the level is said as the chance the money lasts as long as you do — "as long as you do 18 times in 20" —
 * never as a count of futures; null in the rollback, where every word is the one before 7.8.0.
 */
let WEIGH = null;
/** Sets the words' weighing for one answer: { level, couple } or null. */
export function weighWords(w) { WEIGH = w; }
const levelT20 = (level) => 20 - LEVEL_FAILS20[level in LEVEL_FAILS20 ? level : 'balanced'];
const levelChance = (level) => [asLongAs(WEIGH.couple), ' ', F(levelT20(level)), ' times in ', F('20')];
/** The level's line after `prefix` ('… lasted in '): the count before 7.8.0, part for part, or the level's chance. */
const nineP = (prefix) => (WEIGH
  ? [prefix.replace(/(lasted |last )?in $/, (m, v) => v || ''), ...levelChance(WEIGH.level)]
  : [prefix, F('9'), ' futures out of ', F('10')]);
/** "9 in 10" for "which is 9 in 10" — weighing, "Balanced: 18 times in 20". */
const levelIn = (k) => (WEIGH ? [LEVEL_WORD[k in LEVEL_IN_COUNT ? k : 'balanced'], ': ', F(levelT20(k)), ' times in ', F('20')] : LEVEL_IN_COUNT[k] || LEVEL_IN_COUNT.balanced);
const BAD = ['In a bad case (the worst ', F('1'), ' in ', F('10'), ')'];
const GOOD = ['in a good case (the best ', F('1'), ' in ', F('10'), ')'];

/** Fills `text` from `parts` for every sentence (lists and objects of sentences opened), assumed line and warning. */
export function finishTexts(result) {
  const fill = (s) => {
    if (Array.isArray(s)) s.forEach(fill);
    else if (s && Array.isArray(s.parts)) s.text = partsText(s.parts, result);
    else if (s && typeof s === 'object') Object.values(s).forEach(fill);
  };
  fill(result.sentences || {});
  (result.assumed || []).forEach(fill);
  (result.warnings || []).forEach(fill);
  return result;
}

const LEVEL_WORDS = { cautious: 'about a third in shares', balanced: 'about half in shares', adventurous: 'about two thirds in shares' };
const LEVEL_NAME = { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' };
const SPEND_LEVEL = { minimum: 'Minimum', moderate: 'Moderate', comfortable: 'Comfortable' };

/**
 * The facts a sentence needs that are not numbers in the result (answer.js builds them).
 * @typedef {object} FactsB
 * @property {boolean} couple
 * @property {{ who: string, sp: boolean, spAge: number, spDefault: boolean, spPaidAtStop: boolean, fs: boolean, fsAge: number|null,
 *              fsDefault: boolean, potDefault: boolean, closedUntil: number|null }[]} people
 * @property {string[]} usedDefault       fields whose value is the list's default
 * @property {number} fullStatePensionAYear
 * @property {boolean} anyPension         a pension pot at the stop in some life (a pot today or anything paid in)
 * @property {boolean} madeUpFutures
 * @property {number} historyStartYear
 * @property {boolean} capped             the end age is past the 45 years the engine runs
 * @property {boolean} oneName
 * @property {boolean} accessRises        someone the rise to 57 on 6 April 2028 touches: not 55 by then, and stopping before 57 (rules.js accessRiseAffects)
 * @property {number|null} haveLasted     already: the share of lives that reach the number with nothing more paid in
 * @property {boolean} [fsPaidAtStop]     (per person) the final-salary pension is paid from the stop already
 * @property {number|null} gridRow        the grid's row for the stop age (detail 'grid')
 */

const until = (facts) => (facts.couple ? ['until the younger of you is ', A('basis.endAge')] : ['until you are ', A('basis.endAge')]);

/** ", with your State Pension from 67" / ", with your State Pensions from 67 and 69" — only those still to start at the stop. */
function spFromParts(facts) {
  const later = facts.people.filter((p) => p.sp && !p.spPaidAtStop);
  if (!later.length) return [];
  if (later.length === 1) return [', with ', later[0].who === 'you' ? 'your' : "your partner's", ' State Pension from ', F(later[0].spAge)];
  if (later[0].spAge === later[1].spAge) return [', with your State Pensions from ', F(later[0].spAge)];
  // two ages: whose is whose (facts.people is you, then your partner)
  return [', with your State Pension from ', F(later[0].spAge), " and your partner's from ", F(later[1].spAge)];
}

const nowParts = (result) => (result.payIn.now > 0 ? [M('payIn.now'), ' a month'] : ['nothing more']);

/** "your savings and State Pension": what pays when no pension pot is needed (the £0 number). */
function payersWords(facts) {
  const sps = facts.people.filter((p) => p.sp).length;
  const fss = facts.people.filter((p) => p.fs).length;
  const items = [];
  if (facts.anySavings) items.push('savings');
  if (sps) items.push(sps === 2 ? 'State Pensions' : 'State Pension');
  if (fss) items.push(fss === 2 ? 'final-salary pensions' : 'final-salary pension');
  if (!items.length) return 'your money';
  return 'your ' + (items.length === 1 ? items[0] : items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1]);
}
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
/** " Paying in as now, about £1,460 a month from 60 lasted in 9 futures out of 10." — or that no amount did. */
const carefulNowParts = (result, p = false) => (result.monthlyIfShort > 0
  // (with a spending shape the figure is the start, and the later steps go with it: spending-shape.md 6.4)
  ? [' Paying in as now, about ', M('monthlyIfShort'), p ? ' a month from when your partner stops at ' : ' a month from ', A('stop.age'),
    ...nineP(shapeMoves(result.spendShape) ? ', with the later steps in proportion, lasted in ' : ' lasted in '), '.']
  : [p ? ' Paying in as now, no amount a month from when your partner stops at ' : ' Paying in as now, no amount a month from ', A('stop.age'), ...nineP(' lasted in '), '.']);

/**
 * The sentences, from the result only (the facts carry no figure the result does not hold).
 *
 * ONE TEST (step 4 brief section 10, J9): every count here is of lives in which the money lasted to the end age, the
 * saving years and the drawing years as one life. The number is a guide, worded as what it is: the pot that, if you had
 * exactly that at the stop, pays the spend in 9 futures out of 10. The pay-in is the answer.
 */
export function sentencesFor(result, facts) {
  const c = facts.couple;
  const st = result.status;
  const out = {};
  // the pot the answer stands behind: the level chosen's (7.8.0)
  const NK = 'levels.' + result.level + '.pot';
  const number = result.levels[result.level].pot;
  const nowIn = result.payIn.now > 0;
  const zero = st === 'ok' && number !== null && number === 0;
  const lastedTo = ['your money lasted ', until(facts), ' '];
  // (before the level's words: weighing, the level is a chance said without an age — "your money lasts as long as you do …")
  const lastedToLevel = WEIGH ? ['your money lasts '] : lastedTo;
  // couples apart (result.apart) and the answer about your partner (result.askedAbout): whose pensions the number and the
  // pay-in are — those still saving, each at their own stop
  const ap = result.apart || null;
  const p = facts.asked === 'partner';
  const savers = facts.people.filter((x) => x.saves).map((x) => x.who);
  const both = Boolean(ap) && savers.length === 2;
  const pensionsWord = !ap ? (c ? 'your pensions' : 'your pension') : both ? 'your pensions' : savers[0] === 'you' ? 'your pension' : "your partner's pension";
  /** " by 60", " by the time you have both stopped" (both still saving, apart): when the pensions are counted. */
  const byStop = both ? [' by the time you have both stopped'] : [' by ', A('stop.age')];

  // ---- the first headline -------------------------------------------------------------------------------------------
  if (st === 'guaranteed-only') {
    out.head = S('b.head.nothing', ['No pot is needed for ', M('spend.perMonth'), ' a month']);
    out.sub = S('b.sub.nothing', [c ? 'your State Pensions' : 'your State Pension', facts.people.some((x) => x.fs) ? ' and final-salary pension' : '', ap ? ' cover it after tax from when you have both stopped' : [p ? ' cover it after tax from when your partner stops at ' : ' cover it after tax from ', A('stop.age')], ' ', until(facts),
      ', going up each year with prices']);
    out.nothing = S('b.nothing', [c ? 'Your State Pensions' : 'Your State Pension', facts.people.some((x) => x.fs) ? ' and final-salary pension' : '', ' alone give ', M('guaranteed.monthlyAfterTax'),
      ' a month after tax once started, which covers ', M('spend.perMonth'), '. No pot is needed for that.']);
    out.line = out.nothing;
    out.bad = S('b.bad.nothing', [...BAD, ' makes no difference here: none of this depends on markets.']);
  } else if (number === null) {
    out.head = S('b.head.none', ['More than ', F(money(SAVING.potMax)), p ? ' by the time your partner is ' : ' by age ', A('stop.age')]);
    out.sub = S('b.sub', ['to pay ', M('spend.perMonth'), p ? ' a month after tax from when your partner stops at ' : ' a month after tax from ', A('stop.age'), ' ', until(facts), ', going up each year with prices']);
    out.none = S('b.none.pot', ['No pot up to ', F(money(SAVING.potMax)), ' paid ', M('spend.perMonth'), p ? ' a month from when your partner stops at ' : ' a month from ', A('stop.age'), ...nineP(' in '),
      '. Stopping later or spending less changes that: the ways to make it fit are below.']);
    out.line = out.none;
    out.bad = S('b.bad.none', [...BAD, ', ', nowParts(result), ' as now, your money runs out ', c ? ['when the younger of you is ', A('wholeLife.runOutAge')] : ['at ', A('wholeLife.runOutAge')],
      '.', ...carefulNowParts(result, p)]);
  } else if (zero) {
    // no pension pot is needed: the savings (and the State Pension) pay for it. Whether that is on course is the
    // verdict's to say (verdictSentences, above everything): this block says what pays.
    out.head = S('b.head.zero', ['No pension pot is needed for ', M('spend.perMonth'), ' a month']);
    out.sub = S('b.sub.zero', [payersWords(facts), p ? ' pay for it after tax from when your partner stops at ' : ' pay for it after tax from ', A('stop.age'), ' ', until(facts), ', going up each year with prices']);
    out.line = S('b.line.zero', [cap(payersWords(facts)), !result.onCourse && result.outside ? [' pay for this once about ', P('outside.careful'), p ? ' is in ISAs or savings by the time your partner is ' : ' is in ISAs or savings by ', A('stop.age')] : ' already pay for this',
      ap ? [': nothing more is needed in ', pensionsWord, '.'] : ': nothing more is needed in your pension.']);
    out.bad = result.onCourse
      ? S('b.bad.onCourse', [...BAD, ', ', nowParts(result), ' as now, your money still lasts to ', A('basis.endAge'), '.'])
      : S('b.bad.zero', [...BAD, ', as things are now, your money runs out ', c ? ['when the younger of you is ', A('wholeLife.runOutAge')] : ['at ', A('wholeLife.runOutAge')], '.']);
  } else {
    // the guide number's own block: on course or not, the verdict above says which (verdictSentences), so this block's
    // head is always the number, worded as what it is
    if (ap) {
      // couples apart: the pensions of those still saving, each at their own stop
      out.head = p ? S('b.head.partner', ['About ', P(NK), ' by the time your partner is ', A('stop.age')])
        : both ? S('b.head.apart', ['About ', P(NK), ' between you by the time you have both stopped'])
          : S('b.head', ['About ', P(NK), ' by age ', A('stop.age')]);
      out.sub = S('b.sub', [p ? ['the pot that, if your partner had exactly that at ', A('stop.age'), ', pays ']
        : both ? 'the pots that, if you had exactly that between you at your own stops, pay ' : ['the pot that, if you had exactly that at ', A('stop.age'), ', pays '],
        M('spend.perMonth'), ' a month after tax ', until(facts), ...nineP(', going up each year with prices, in '), spFromParts(facts)]);
    } else {
      out.head = c ? S('b.head.couple', ['About ', P(NK), ' between you by the time you are ', A('stop.age')]) : S('b.head', ['About ', P(NK), ' by age ', A('stop.age')]);
      out.sub = S('b.sub', ['the pot that, if you had exactly that at ', A('stop.age'), ', pays ', M('spend.perMonth'), ' a month after tax ', until(facts), ...nineP(', going up each year with prices, in '), spFromParts(facts)]);
    }
    // the guide number, worded as what it is (couples apart: the design's words, couples-different-years.md 2.4)
    const exactly = [...nineP('. With exactly that, the money lasted in '), '.'];
    if (p) {
      out.line = S('b.line.partner', ['Your partner needs about ', P(NK), ' in their pension when they stop at ', A('stop.age'), ', with your money as you gave it', ...exactly]);
    } else if (both) {
      out.line = S('b.line.apart', ['You need about ', P(NK), ' in pensions between you: yours when you stop at ', A('apart.stops.you.age'), " and your partner's when they stop at ",
        A('apart.stops.partner.age'), ...exactly]);
    } else if (ap) {
      out.line = S('b.line.apart', ['You need about ', P(NK), ' in your pension when you stop at ', A('stop.age'), ", with your partner's money as you gave it", ...exactly]);
    } else {
      out.line = S(c ? 'b.line.couple' : 'b.line', ['To spend ', M('spend.perMonth'), ' a month from ', A('stop.age'), ', ', c ? 'the two of you would want pots of about ' : 'you would want a pot of about ', P(NK),
        c ? ' between you by then' : ' by then', ': with exactly that at ', A('stop.age'), ...nineP(', the money lasted in '), '.']);
    }
    if (result.onCourse) {
      // (how little could still be on course is the verdict's first sentence now, said the way the pay-in was given)
      out.bad = S('b.bad.onCourse', [...BAD, ', ', nowParts(result), ' as now, your money still lasts to ', A('basis.endAge'), '.']);
    } else {
      // the bad case of the pension at the stop, said as it is — never measured against the guide number: a bad case
      // while saving and a bad case once stopped are rarely the same future, so "£133,000 short of it" was two cautions
      // added together, and contradicted the pay-in (the reviewers' finding, 1 Oct 2026; the guide sentence below says so)
      out.bad = S('b.bad', [...BAD, ', ', nowParts(result), ' as now gets ', pensionsWord, ' to about ', P('potAtStop.now.careful'), ...byStop, '.',
        ...carefulNowParts(result, p)]);
    }
    // what the number is, and why the pay-in — not the number — is the answer
    out.guide = S('b.guide', ['The pot is a guide. A bad case while you are saving and a bad case once you have stopped are rarely the same future, so what you pay in is tried on each whole future, from now ',
      ...until(facts), ', and that is the answer.']);
    if (result.already && st === 'ok') {
      out.have = S('b.have', [p ? 'Your partner already has more than ' : 'You already have more than ', P(NK), p ? ' in their pension. Paying in nothing more, ' : ap ? [' in ', pensionsWord, '. Paying in nothing more, '] : ' in your pension. Paying in nothing more, ', ...lastedTo, countParts(facts.haveLasted ?? 0), '.']);
    }
  }

  // ---- the second headline: the pay-in that gets there (two headlines only when short) -------------------------------
  const pi = result.payIn;
  const two = st === 'ok' && !result.onCourse && number !== null && pi.needed !== null;
  const savingsToo = result.outside && pi.outside !== null && pi.outside > (pi.savingsNow || 0);
  const savingsOnly = two && savingsToo && pi.needed <= pi.now && result.levers.payMore;
  /** "until you are 60", "until your partner stops at 56", "until each of you stops": how long the pay-in goes in. */
  const untilStop = !ap ? ['until you are ', A('stop.age')] : both ? ['until each of you stops'] : p ? ['until your partner stops at ', A('stop.age')] : ['until you stop at ', A('stop.age')];
  if (savingsOnly) {
    // what goes into the pension is enough as it is: the savings for the years before it opens are what fall short
    out.payInHead = S('b.payIn.head.savings', ['About ', M('payIn.outside'), ' a month into savings']);
    out.payInSub = S('b.payIn.sub.savings', ['beside ', M('payIn.now'), ' a month into ', pensionsWord, ap ? [' as now, from now ', ...untilStop] : [' as now, from now until you are ', A('stop.age')], ', going up each year with prices']);
    out.payInLine = S('b.payIn.savings', ['Putting about ', M('payIn.outside'), ' a month into savings, with ', M('payIn.now'), ' a month going into ', pensionsWord, ' as now, ',
      ...lastedTo, countParts(result.levers.payMore.lasted), '.']);
    out.payInBad = S('b.payIn.bad.savings', [...BAD, ', about ', P('outside.careful'), ' in savings by ', A('stop.age'), ' carries the years from ', A('stop.age'), ' to ', A('outside.untilAge'), '.']);
  } else if (two) {
    const pensions = !ap ? (c ? 'into your pensions between you' : 'into your pension') : both ? 'into your pensions between you' : `into ${pensionsWord}`;
    out.payInHead = S('b.payIn.head', ['About ', M('payIn.needed'), ' a month ', pensions, savingsToo ? [', and ', M('payIn.outside'), ' a month into savings'] : '']);
    out.payInSub = S('b.payIn.sub', [pi.employer > 0 ? ["including your employer's ", M('payIn.employer'), ', '] : '', ap ? ['from now ', ...untilStop] : ['from now until you are ', A('stop.age')], ', going up each year with prices']);
    out.payInLine = pi.needed > pi.now
      ? S('b.payIn.line', ['Paying in about ', M('payIn.needed'), ' a month', savingsToo ? [' (and ', M('payIn.outside'), ' into savings)'] : '', ' and then spending ', M('spend.perMonth'), ' a month, ',
        ...lastedToLevel, confParts(result.level), '. That is ', M('payIn.extra'), ' a month more than now.'])
      : S('b.payIn.less', ['Paying in ', M('payIn.needed'), ' a month', savingsToo ? [' and about ', M('payIn.outside'), ' into savings'] : '', ' and then spending ', M('spend.perMonth'), ' a month, ',
        ...lastedToLevel, confParts(result.level), ap ? ['. That is no more than goes into ', pensionsWord, ' now.'] : '. That is no more than goes into your pension now.']);
    out.payInBad = S('b.payIn.bad', [...BAD, ', ', M('payIn.needed'), ' a month gets ', pensionsWord, ' to about ', P('potAtStop.needed.careful'), ...byStop,
      '. In a middling case it reaches ', P('potAtStop.needed.middling'), '.']);
  }
  const each = ap ? both : c;
  if (st === 'out-of-reach' && number !== null) {
    out.none = S('b.none', ['No pay-in up to ', F(money(SAVING.payInCeiling)), each ? ' a month each' : ' a month', ' makes ', M('spend.perMonth'), p ? ' a month from when your partner stops at ' : ' a month from ', A('stop.age'), ...nineP(' last in '),
      '. Try a later age or a lower amount.']);
  }

  // ---- the pots at the stop ----------------------------------------------------------------------------------------
  const savingsNote = facts.anySavings ? [' (your savings are on top)'] : '';
  const atStop = both ? [' at your own stops'] : [' at ', A('stop.age')];
  out.potsNow = S('b.pots.now', [nowIn ? ['Paying in ', M('payIn.now'), ' a month as now, ', pensionsWord, ...atStop, savingsNote, ': '] : ['Paying nothing in, as now, ', pensionsWord, ...atStop, savingsNote, ': '],
    P('potAtStop.now.careful'), ' in ', BAD[0].slice(3), BAD.slice(1), ', ', P('potAtStop.now.middling'), ' in a middling case, ', P('potAtStop.now.good'), ' ', GOOD, '.']);
  // at what would be enough, the figure the verdict states (enough, in the person's own kind), its pots worked out at
  // exactly those pay-ins; B's own £10 figure only for an answer with no enough block
  const en = result.enough;
  const enLead = en && !result.onCourse && !en.savingsOnly ? en.atLevel : null;
  if (enLead && enLead.potAtStop) {
    const K = 'enough.atLevel';
    const fig = typeof enLead.totalPct === 'number'
      ? [PCT(`${K}.totalPct`), en.who === 'partner' ? " of your partner's pay (" : ' of your pay (', M(`${K}.payIn`), ' a month)']
      : [M(`${K}.payIn`), ' a month'];
    out.potsNeeded = S('b.pots.needed', ['Paying in ', fig, ': ', P(`${K}.potAtStop.careful`), ' in a bad case, ', P(`${K}.potAtStop.middling`),
      ' in a middling case, ', P(`${K}.potAtStop.good`), ' in a good case.']);
  } else if (!en && two && result.potAtStop.needed) {
    out.potsNeeded = S('b.pots.needed', ['Paying in ', M('payIn.needed'), ' a month: ', P('potAtStop.needed.careful'), ' in a bad case, ', P('potAtStop.needed.middling'),
      ' in a middling case, ', P('potAtStop.needed.good'), ' in a good case.']);
  }

  // ---- the whole life, once: today's pay-in, then the spend -----------------------------------------------------------
  out.wholeLife = S('b.wholeLife', [nowIn ? ['Paying in ', M('payIn.now'), ' a month as you do now'] : 'Paying nothing in', ' and then spending ', M('spend.perMonth'),
    ' a month, ', ...lastedTo, countParts(result.wholeLife.lasted), '.']);

  // ---- stopping before a pension can be touched ----------------------------------------------------------------------
  if (result.outside) {
    out.outside = S('b.outside', [p ? 'Your partner stopping at ' : 'Stopping at ', A('stop.age'), ' is before you can take money from a pension (', A('outside.untilAge'), '). Beside the pension, about ',
      P('outside.careful'), ' needs to be in ISAs or savings by ', A('stop.age'), ' to pay the years from ', A('stop.age'), ' to ', A('outside.untilAge'), ' in every future we tried.',
      two && !savingsOnly ? ' The pay-in above is into your pension; the savings part is on top of it.' : '']);
  }

  // ---- the ways to make it fit --------------------------------------------------------------------------------------
  const lever = {};
  const lv = result.levers;
  if (lv.stopLater) {
    lever.stopLater = S('b.lever.stopLater', [p ? ['Your partner stops at ', A('levers.stopLater.age'), ', not ', A('stop.age')]
      : c && !ap ? ['Both stop when you are ', A('levers.stopLater.age'), ', not ', A('stop.age')] : ['Stop at ', A('levers.stopLater.age'), ', not ', A('stop.age')],
      ': ', nowParts(result), ' as now, your money lasted ', countParts(lv.stopLater.lasted), '.']);
  } else if (st !== 'guaranteed-only' && !result.onCourse && facts.laterTo !== null) {
    lever.stopLaterNone = S('b.lever.stopLater.none', [p ? 'Your partner stopping later alone, even at ' : 'Stopping later alone, even at ', F(facts.laterTo), ...nineP(', did not make it last in '), ' paying in as now.']);
  }
  if (lv.payMore) {
    // a share of pay (saving-enough-and-check-in.md 3.6): said, and tried, as a share — the employer's part as entered;
    // your partner's when they are the one saving ("I've already stopped")
    const inShares = typeof lv.payMore.totalPct === 'number';
    const employerPct = inShares && result.enough && result.enough.now ? result.enough.now.employerPct : 0;
    const theirs = inShares && result.enough && result.enough.who === 'partner';
    lever.payMore = S(inShares ? 'b.lever.payMore.share' : 'b.lever.payMore', [theirs ? 'Your partner pays in ' : 'Pay in ',
      inShares ? [PCT('levers.payMore.totalPct'), employerPct > 0
        ? [theirs ? ' of their pay in all (your partner ' : ' of your pay in all (you ', PCT('levers.payMore.ownPct'), ', ', M('levers.payMore.payIn'), ' a month)']
        : [theirs ? ' of their pay (' : ' of your pay (', M('levers.payMore.payIn'), ' a month)']]
        : [M('levers.payMore.payIn'), ' a month'],
      lv.payMore.savingsIn ? [' and put ', M('levers.payMore.savingsIn'), ' a month into savings'] : '',
      ': your money lasted ', countParts(lv.payMore.lasted), '.']);
  }
  if (lv.spendLess) {
    lever.spendLess = shapeMoves(result.spendShape)
      // a shape (spending-shape.md 6.4): the whole shape moves to the careful start
      ? S('b.lever.spendLess', ['Spend ', M('levers.spendLess.spend'), ' a month at the start, not ', M('spend.perMonth'), ', the later steps in proportion: ', nowParts(result), ' as now, your money lasted ', countParts(lv.spendLess.lasted), '.'])
      : S('b.lever.spendLess', ['Spend ', M('levers.spendLess.spend'), ' a month, not ', M('spend.perMonth'), ': ', nowParts(result), ' as now, your money lasted ', countParts(lv.spendLess.lasted), '.']);
  }
  if (lv.oneOff) {
    // a one-off sum now (saving-enough-and-check-in.md 3.4): what lands, with the tax added back. Checked a person at a
    // time with a year of what goes in now: against the annual allowance (carrying forward allowance from earlier years is
    // not counted, and the words say so), and against the pay of someone who gave it (the tax is added back only up to it)
    const o = lv.oneOff;
    const parts = Array.isArray(o.byPerson) ? o.byPerson : null;
    const at = (who) => parts.findIndex((x) => x.who === who);
    // a couple's sum all in one pension (the other's part £0): said as that pension's, no split to read
    const into = !parts ? ' into your pension now'
      : parts[at('you')].amount <= 0 ? " into your partner's pension now"
        : parts[at('partner')].amount <= 0 ? ' into your pension now'
          : [' into your pensions now (you ', M(`levers.oneOff.byPerson.${at('you')}.amount`), ', your partner ', M(`levers.oneOff.byPerson.${at('partner')}.amount`), '; what lands, with the tax the government adds back)'];
    const lands = typeof into === 'string' ? ' (what lands, with the tax the government adds back)' : '';
    const over = Array.isArray(o.over) ? o.over : o.overAllowance ? ['you'] : [];
    const overPay = Array.isArray(o.overPay) ? o.overPay : [];
    const someone = (list) => (!parts ? '' : list.length === 2 ? ' for each of you' : list[0] === 'you' ? ' for you' : ' for your partner');
    lever.oneOff = S('b.lever.oneOff', ['Put ', M('levers.oneOff.amount'), into, lands, ' and keep paying in as now: your money lasted ', countParts(o.lasted), '.',
      over.length ? [' With what goes in now, that is more than ', F(money(RULES.annualAllowance)), ' in one year', someone(over), ': the most that gets the tax the government adds back (less for the highest earners). Allowance not used in the three years before can add to it; that is not counted here.'] : '',
      overPay.length ? [' The tax is added back only on what ', overPay.length === 2 ? 'each of you pays in up to your own pay in a year' : overPay[0] === 'you' ? 'you pay in up to your pay in a year' : 'your partner pays in up to their pay in a year',
        ', and with what goes in now this is more than that.'] : '']);
  }
  if (lv.moreRisk) {
    const words = LEVEL_WORDS[lv.moreRisk.level];
    if (lv.moreRisk.payIn === null) lever.moreRisk = S('b.lever.moreRisk.no', ['More risk while saving, ', words, ': no pay-in up to ', F(money(SAVING.payInCeiling)), each ? ' a month each' : ' a month', ' made it last.']);
    else if (lv.moreRisk.helps) lever.moreRisk = S('b.lever.moreRisk', ['More risk while saving, ', words, ': ', M('levers.moreRisk.payIn'), ' a month made it last ', confParts(result.level), '.']);
    else lever.moreRisk = S('b.lever.moreRisk.no', ['More risk while saving, ', words, ', does not lower what goes in: it would take ', M('levers.moreRisk.payIn'), ' a month.']);
  }
  lever.accept = st === 'guaranteed-only'
    ? S('b.lever.accept', ['Keep paying in ', nowParts(result), ' as now.'])
    : S('b.lever.accept', ['Keep paying in ', nowParts(result), ' as now: your money lasted ', countParts(lv.accept.lasted), '.',
      ...(lv.accept.monthlyIfShort > 0 ? [' About ', M('levers.accept.monthlyIfShort'), p ? ' a month from when your partner stops at ' : ' a month from ', A('stop.age'),
        ...nineP(shapeMoves(result.spendShape) ? ', with the later steps in proportion, lasted in ' : ' lasted in '), '.']
        : [p ? ' No amount a month from when your partner stops at ' : ' No amount a month from ', A('stop.age'), ...nineP(' lasted in '), '.'])]);
  out.lever = lever;

  // ---- the grid: the stop age's cell for screen readers, and a sentence when no cell reaches 9 in 10 -------------------
  if (result.grid && facts.gridRow !== null && facts.gridRow !== undefined && result.grid.ages[facts.gridRow] && result.grid.payIns.length) {
    const k = facts.gridRow;
    const cell = result.grid.ages[k].cells[0];
    out.gridCell = S('b.grid.cell', [p ? 'Your partner stopping at ' : 'Stopping at ', A(`grid.ages.${k}.age`), ' and paying in ', M(`grid.ages.${k}.cells.0.payIn`), ' a month, your money lasted ', countParts(cell.lasted), '.']);
  }
  if (result.grid && !result.grid.reaches) {
    out.gridNone = S('b.grid.none', [...nineP('None of these lasted in '), '. A later age, or a lower amount to spend, is needed as well.']);
  }

  // ---- "Now:" for the try-a-change row (the screen keeps the one before) -----------------------------------------------
  out.change = st === 'guaranteed-only'
    ? S('b.change', [p ? 'Now: no pot needed by the time your partner is ' : 'Now: no pot needed by ', A('stop.age'), '.'])
    : number === null
      ? S('b.change', ['Now: more than ', F(money(SAVING.potMax)), p ? ' by the time your partner is ' : ' by ', A('stop.age'), '.'])
      : S('b.change', ['Now: ', result.onCourse ? 'on course for ' : 'not on course for ', p ? ['your partner at ', A('stop.age')] : A('stop.age'), ', lasted ', countParts(result.wholeLife.lasted), '.']);
  // what is spent changing with age (spending-shape.md 6.4): the spend as typed is the start; the steps follow, as tested
  if (shapeMoves(result.spendShape)) out.shape = atTheStart('b.shape', result.spendShape, 'spendShape');
  // said straight: the verdict, what would be enough, the two incomes and the gap (saving-enough-and-check-in.md 2.2, 3.5)
  Object.assign(out, verdictSentences(result, facts));
  if (WEIGH && facts.weighing && st === 'ok') weighedSentences(out, result, facts);
  return out;
}

/**
 * 7.8.0, weighing (research/v7/replan-nov-2026.md 5; the build spec's 5 and 11): the number is never a lone pot — the level
 * chosen's, with the other two beside it — and the chance it lasts as long as you do; the fixed-age line to the plan-to age
 * (paying in as now) stands beside it, with Bold's consequence.
 */
function weighedSentences(out, result, facts) {
  const { lf } = facts.weighing;
  const c = facts.couple;
  const level = result.level;
  const name = LEVEL_WORD[level];
  const NK = 'levels.' + level + '.pot';
  const lv = result.levels;
  const others = LEVEL_IDS.filter((k) => k !== level && lv[k] && isNum(lv[k].pot)).map((k) => [LEVEL_WORD[k], ' ', P(`levels.${k}.pot`)]);
  const range = others.length ? [' (', ...others.flatMap((x, i) => (i ? [', ', ...x] : x)), ')'] : [];
  const simple = !result.apart && result.askedAbout !== 'partner';
  if (simple && out.line && isNum(lv[level].pot)) {
    out.line = S(c ? 'b.line.couple' : 'b.line', ['At ', name, ', to spend ', M('spend.perMonth'), ' a month from ', A('stop.age'), ', ', c ? 'the two of you would want pots of about ' : 'you would want a pot of about ',
      P(NK), c ? ' between you by then' : ' by then', ...range, '. ', countingLead(c), ', with exactly that at ', A('stop.age'), ' the money lasts ', asLongAs(c), ' ',
      F(20 - LEVEL_FAILS20[level]), ' times in ', F('20'), '.'], 'weighted');
  } else if (out.line) out.line = { ...out.line, mark: 'weighted' };
  // the fixed-age line, paying in as now (the chance the answer carries: today's pay-ins, the whole of each future)
  out.fixed = { ...fixedSentence('b.fixed', result.chance.fixedAge, lf) };
  out.fixed.parts = ['Paying in as now: ', ...out.fixed.parts.map((x, i) => (i === 0 && typeof x === 'string' ? x.charAt(0).toLowerCase() + x.slice(1) : x))];
  if (level === 'bold') out.boldLine = boldSentence('b.bold', lv.bold && isNum(lv.bold.weighted) ? lv.bold.weighted : 1 - LEVEL_FAILS20.bold / 20, lf);
}

/**
 * The verdict said straight, and what would be enough (research/saving-enough-and-check-in.md 2.2 and 3.5; release step
 * R1). The first sentence answers both questions at once — how it stands paying in as now, and the share of pay (or the
 * pounds) that would put you on course — because that was what was hard to find.
 *
 *   verdictHead   "On course for £1,500 a month from 66" / "Close — £1,810 a month from 63 is tight" / "Not on course for …"
 *                 (legacyVerdictOf's bands: on course at 9 futures in 10, close from 3 in 4)
 *   verdictLine   paying in as now: the count; then what would be on course (and, not on course, for 3 futures out of 4),
 *                 or "even all of your pay going in would not be on course"; on course, how little would still be
 *   verdictFour   the Close band only: today's pay-in is already enough for 3 futures out of 4 (decided by the count)
 *   income        what you could spend from the stop: the most that lasted in 9 and in 5 futures out of 10, what it
 *                 includes (savings, the State Pension "the full amount, as assumed", a final-salary pension), and the gap
 *                 to what you want, a month and a year
 *   atAim         spending what you want: the age a bad case (the worst 1 in 10) runs out, or that it lasted
 *   enoughHead / enoughLine / enoughFour / enoughMatch / enoughPaused   the block under the verdict: the figure in the
 *                 person's own kind, what lands a month and until when, its count; the other chance; the employer's part
 *
 * Every figure is a key into the result (enough.*, income.*, gap.*): the counts are the ones B re-asked at those figures.
 */
function verdictSentences(result, facts) {
  const out = {};
  const v = result.verdict;
  const en = result.enough;
  if (!v || !en || result.status === 'guaranteed-only') return out;
  const c = facts.couple;
  const ap = result.apart || null;
  const p = facts.asked === 'partner';
  const savers = facts.people.filter((x) => x.saves).map((x) => x.who);
  const both = Boolean(ap) && savers.length === 2;
  const pair = en.how === 'couple';
  const band = v.band;
  const shape = shapeMoves(result.spendShape);
  // one person saving, and that person is your partner ("I've already stopped"): every figure is theirs, and the words say
  // so — their pay, their employer, their pension
  const theirs = !pair && (en.who ? en.who === 'partner' : p || savers[0] === 'partner');
  const W = whoWords(theirs);
  const pensionWord = pair ? 'your pensions' : theirs ? "your partner's pension" : 'your pension';
  const intoWord = pair ? 'into your pensions between you' : `into ${pensionWord}`;
  const untilStop = both ? ['until each of you stops'] : p ? ['until your partner stops at ', A('stop.age')] : ['until you are ', A('stop.age')];
  /** " a month from 63", " a month between you from when you are 62", …: the aim's unit and when it starts. */
  const fromStop = p ? [' a month from when your partner stops at ', A('stop.age')]
    : both ? [' a month between you once you have both stopped']
      : ap ? [' a month between you from when you stop at ', A('stop.age')]
        : c ? [' a month between you from when you are ', A('stop.age')] : [' a month from ', A('stop.age')];
  const aim = [M('spend.perMonth'), ...fromStop];
  // what would be enough at the level chosen (7.8.0: one figure; the "3 in 4" figure beside it is gone)
  const nine = en.atLevel;
  const NINE = 'enough.atLevel';
  const employerPct = en.now ? en.now.employerPct : 0;
  // whose employer's part goes in (the words name it once: "your employer's", "their employer's", "your employers'")
  const employers = Array.isArray(en.employers) ? en.employers : [];

  /**
   * A couple's parts, each person's OWN part in their own kind — "you 28.5% of your pay", "your partner £278 a month" —
   * as "you 27%" means your own part for one person; the employers' parts are named after them, as now.
   */
  const pairParts = (key, fig) => {
    const each = fig.parts.map((part, j) => ({ part, j })).filter(({ j }) => facts.people[j] && facts.people[j].saves);
    if (each.length < 2) return null;
    const one = ({ part, j }) => [part.who === 'you' ? 'you ' : 'your partner ', typeof part.ownPct === 'number'
      ? [PCT(`${key}.parts.${j}.ownPct`), part.who === 'you' ? ' of your pay' : ' of their pay']
      : typeof part.own === 'number' ? [M(`${key}.parts.${j}.own`), ' a month'] : [M(`${key}.parts.${j}.payIn`), ' a month']];
    return [one(each[0]), ', ', one(each[1]), employersAsNow(employers)];
  };

  /**
   * A figure in the person's own kind. Long: "31% of your pay in all (you 27%, £982 a month)", "£980 a month (you
   * £830, your employer's £150 as now)", "£1,400 a month between you (you 12% of your pay, your partner £600 a month,
   * with your employer's part as now)". Short (the 3-in-4 figure beside the 9-in-10 one): "22% (you 18%, £697 a month)",
   * "£690 a month".
   */
  const figure = (key, fig, short = false) => {
    if (en.how === 'share') {
      return employerPct > 0
        ? [PCT(`${key}.totalPct`), short ? [' (', W.who, ' '] : [' of ', W.pay, ' in all (', W.who, ' '], PCT(`${key}.ownPct`), ', ', M(`${key}.payIn`), ' a month)']
        : [PCT(`${key}.totalPct`), short ? ' (' : [' of ', W.pay, ' ('], M(`${key}.payIn`), ' a month)'];
    }
    if (pair) {
      const parts = short ? null : pairParts(key, fig);
      return [M(`${key}.payIn`), ' a month between you', parts ? [' (', parts, ')'] : ''];
    }
    return fig.employer > 0 && !short
      ? [M(`${key}.payIn`), ' a month (', W.who, ' ', M(`${key}.own`), ', ', W.employers, ' ', M(`${key}.employer`), ' as now)']
      : [M(`${key}.payIn`), ' a month'];
  };
  /** "all of your pay", "all of your partner's pay", "all of your pay and £10,000 a month from your partner": a most reached. */
  const allOf = () => {
    if (pair && Array.isArray(en.caps) && en.caps.length) {
      const one = (x) => (x.by === 'pay' ? (x.who === 'you' ? 'all of your pay' : "all of your partner's pay")
        : [F(money(SAVING.payInCeiling)), x.who === 'you' ? ' a month from you' : ' a month from your partner']);
      return en.caps.map((x, i) => (i ? [' and ', one(x)] : one(x)));
    }
    return [W.allPay];
  };
  const nineInTen = levelIn(result.level);

  // ---- the headline: the band, in the unit the aim was given in ----------------------------------------------------
  out.verdictHead = band === 'yes' ? S('b.verdict.head.yes', ['On course for ', aim])
    : band === 'close' ? S('b.verdict.head.close', ['Close — ', aim, ' is tight'])
      : S('b.verdict.head.no', ['Not on course for ', aim]);

  // ---- the first sentence: as now, then what would be enough --------------------------------------------------------
  // (one person saving: whoever it is — "With your partner paying in …" when it is your partner; two: between you)
  const nowIn = result.payIn.now > 0;
  const nowWords = !nowIn ? [theirs ? 'With your partner paying nothing more in, ' : 'Paying nothing more in, ']
    : en.how === 'share' ? [W.paying, PCT('enough.now.totalPct'), ' of ', W.payShort, ' as now (', M('payIn.now'), ' a month',
      employerPct > 0 ? [', ', W.employers, ' ', PCT('enough.now.employerPct'), ' included'] : '', '), ']
      : pair ? ['Paying in ', M('payIn.now'), ' a month between you as now', employersIncluded(employers), ', ']
        : [W.paying, M('payIn.now'), ' a month as now', (result.payIn.employer || 0) > 0 ? [' (', W.employers, ' ', M('payIn.employer'), ' included)'] : '', ', '];
  const asNow = [nowWords, 'your money lasted ', until(facts), ' ', countParts(v.lasted)];
  let enoughWords;
  if (band === 'yes') {
    // on course: how little would still be (only when less than now, and no more into savings)
    const less = nine && nine.savingsIn === null && nine.payIn < result.payIn.now - 0.005;
    // the employer's part alone is enough: said the same way for a share and for pounds
    const employerOnly = less && nine.payIn > 0 && ((en.how === 'share' && nine.ownPct === 0) || (en.how === 'pounds' && nine.own === 0 && nine.employer > 0));
    enoughWords = !less ? '.'
      : nine.payIn <= 0 ? ['. ', W.couldStop, ' and still be on course.']
        : employerOnly ? ['. ', W.couldStopOwn, W.employers, ' ', en.how === 'share' ? PCT(`${NINE}.employerPct`) : M(`${NINE}.employer`), ' going in, and still be on course.']
          : ['. ', W.asLittle, figure(NINE, nine), ' and still be on course.'];
  } else if (en.savingsOnly && nine) {
    enoughWords = ['. What goes into ', pensionWord, ' is enough; ', M(`${NINE}.savingsIn`), ' a month into ISAs or savings ', untilStop, ' would put you on course, which is ', nineInTen, '.'];
  } else if (nine) {
    const parts = nine.savingsIn !== null
      ? [figure(NINE, nine), en.how === 'share' ? [' into ', pensionWord] : '', ' and ', M(`${NINE}.savingsIn`), ' a month into ISAs or savings ', untilStop]
      : figure(NINE, nine);
    enoughWords = ['. ', parts, ' would put you on course, which is ', nineInTen, '.'];
  } else {
    // out of reach by paying in: the other ways lead (3.3)
    const each = pair || both ? ' a month each' : ' a month';
    enoughWords = [en.outOfReach === 'pay' ? ['; even ', allOf(), ' going in would not be on course']
      : en.outOfReach === 'pot' ? '; paying in more on its own would not put you on course'
        : ['; no pay-in up to ', F(money(SAVING.payInCeiling)), each, ' would be on course'], '.'];
  }
  out.verdictLine = S(`b.verdict.line.${band}`, [asNow, enoughWords]);

  // ---- what you could spend from the stop paying in as now, what it includes, and the gap ----------------------------
  const includes = includesParts(facts);
  const short = band !== 'yes' && result.gap.month > 0
    ? [': ', M('gap.month'), ' a month (', M('gap.year'), ' a year) less than you want'] : '';
  const atStart = shape ? ' at the start, the later steps in proportion' : '';
  out.income = result.income.bad > 0
    ? S('b.verdict.income', [...nineP('To last in '), band === 'yes' ? '' : ' paying in as now', ', you could spend ', M('income.bad'), fromStop, atStart,
      includes, short, '.'])
    : S('b.verdict.income.none', ['Paying in as now, no amount', fromStop, ...nineP(' lasted in '), includes,
      band !== 'yes' && result.gap.month > 0 ? ['; that is ', M('gap.month'), ' a month (', M('gap.year'), ' a year) less than you want'] : '', '.']);

  // ---- spending what you want: the bad case's age -------------------------------------------------------------------
  const lasts = result.wholeLife.runOutAge >= result.basis.endAge;
  out.atAim = lasts
    ? S('b.verdict.atAim.lasts', ['Spending ', M('spend.perMonth'), ' a month', atStart ? ' at the start' : '', ', in a bad case (the worst ', F('1'), ' in ', F('10'), ') your money lasted ', until(facts), '.'])
    : S('b.verdict.atAim', ['Spending ', M('spend.perMonth'), ' a month', atStart ? ' at the start' : '', ', in a bad case (the worst ', F('1'), ' in ', F('10'), ') your money runs out ',
      c ? ['when the younger of you is ', A('wholeLife.runOutAge')] : ['at ', A('wholeLife.runOutAge')], '.']);

  // ---- what would be enough: the block under the verdict (3.5), not when on course -----------------------------------
  if (band === 'yes') return out;
  // the block leads with what would be on course at the level chosen
  const LEAD = NINE;
  const leadFig = nine;
  const lastedLine = (fig) => [' Your money lasted ', until(facts), ' ', countParts(fig.lasted), '.'];
  const going = ['from now ', untilStop, ', going up with prices.'];
  if (en.savingsOnly && nine) {
    out.enoughHead = S('b.enough.head.savings', ['What goes into ', pensionWord, ' is enough. The years from ', A('stop.age'), ' to ', A('outside.untilAge'), ' need ', M(`${NINE}.savingsIn`),
      ' a month into ISAs or savings ', untilStop, '.']);
    out.enoughLine = S('b.enough.line.savings', ['Paying in as now beside it, your money lasted ', until(facts), ' ', countParts(nine.lasted), '.']);
    return out;
  }
  if (!leadFig) {
    out.enoughHead = en.outOfReach === 'pay'
      ? S('b.enough.head.outOfReach', ['Even ', allOf(), ' going in would not be on course for ', aim, '.'])
      : en.outOfReach === 'pot'
        ? S('b.enough.head.outOfReach', ['Paying in more on its own would not be on course for ', aim, '.'])
        : S('b.enough.head.outOfReach', ['No pay-in up to ', F(money(SAVING.payInCeiling)), pair || both ? ' a month each' : ' a month', ' would be on course for ', aim, '.']);
    // only the ways below that were found: each made the money last on its own (none found: nothing to point to)
    const lv = result.levers || {};
    const ways = [lv.stopLater && 'stopping later', lv.spendLess && 'spending less', lv.oneOff && 'a one-off sum now'].filter(Boolean);
    if (ways.length) {
      out.enoughLine = S('b.enough.line.outOfReach', [ways.length === 1 ? ['Another way below could: ', ways[0], '.']
        : ['Other ways below could, each on its own: ', ways.slice(0, -1).join(', '), ' or ', ways[ways.length - 1], '.']]);
    }
    return out;
  }
  const savingsPart = leadFig.savingsIn !== null ? [', and ', M(`${LEAD}.savingsIn`), ' a month into ISAs or savings ', untilStop] : '';
  const headFigure = en.how === 'share'
    ? [PCT(`${LEAD}.totalPct`), ' of ', W.pay, employerPct > 0 ? ' in all' : '', leadFig.savingsIn !== null ? [' into ', pensionWord] : '']
    : [M(`${LEAD}.payIn`), ' a month ', intoWord];
  out.enoughHead = S('b.enough.head', ['To be on course: ', headFigure, savingsPart]);
  let line;
  if (en.how === 'share') {
    line = employerPct > 0
      ? [W.Who, ' ', PCT(`${LEAD}.ownPct`), ' and ', W.employer, ' ', PCT(`${LEAD}.employerPct`), ' as now: ', M(`${LEAD}.payIn`), ' a month going ', intoWord, ' ', going]
      : [M(`${LEAD}.payIn`), ' a month going ', intoWord, ' ', going];
  } else if (pair) {
    // each person's own part and their employer's, then what lands a month for each
    const each = leadFig.parts.map((part, j) => ({ part, j })).filter(({ j }) => facts.people[j] && facts.people[j].saves);
    const one = ({ part, j }, first) => {
      const w = whoWords(part.who === 'partner');
      const who = first ? w.Who : w.who;
      const emp = part.who === 'you' ? ' and your employer ' : ' and their employer ';
      if (typeof part.ownPct === 'number') {
        return [who, ' ', PCT(`${LEAD}.parts.${j}.ownPct`), part.who === 'you' ? ' of your pay' : ' of their pay', part.employerPct > 0 ? [emp, PCT(`${LEAD}.parts.${j}.employerPct`)] : '',
          ' (', M(`${LEAD}.parts.${j}.payIn`), ' a month)'];
      }
      if (typeof part.own === 'number' && part.employer > 0) return [who, ' ', M(`${LEAD}.parts.${j}.own`), emp, M(`${LEAD}.parts.${j}.employer`), ' (', M(`${LEAD}.parts.${j}.payIn`), ' a month)'];
      return [who, ' ', M(`${LEAD}.parts.${j}.payIn`), ' a month'];
    };
    // (", and " between the two only when a part names an employer's too: "You 28.5% of your pay and your employer 5% (…), and …")
    const inner = each.some(({ part }) => (typeof part.ownPct === 'number' && part.employerPct > 0) || (typeof part.ownPct !== 'number' && typeof part.own === 'number' && part.employer > 0));
    line = each.length === 2 ? [one(each[0], true), inner ? ', and ' : ' and ', one(each[1], false), ', ', going] : ['From now ', untilStop, ', going up with prices.'];
  } else {
    line = leadFig.employer > 0
      ? [W.Who, ' ', M(`${LEAD}.own`), ' and ', W.employer, ' ', M(`${LEAD}.employer`), ' as now, ', going]
      : ['From now ', untilStop, ', going up with prices.'];
  }
  const more = leadFig.extra > 0 && en.how !== 'share' ? [' That is ', M(`${LEAD}.extra`), ' a month more than now.'] : '';
  const closed = leadFig.savingsIn !== null && result.outside
    ? [' The savings carry the years from ', A('stop.age'), ' to ', A('outside.untilAge'), ', before you can take money from a pension; the pension carries the rest.'] : '';
  out.enoughLine = S('b.enough.line', [line, lastedLine(leadFig), more, closed]);
  // the employer's part as entered (decision 6): matching is not modelled, and would lower the figure
  if (en.employerKept) out.enoughMatch = S('b.enough.match', [matchWords(employers)]);
  // a share of a pay of £0 (row I): the pounds from now, and the employer's part as given
  if (en.paused) {
    const away = theirs || (Array.isArray(en.pausedWho) && en.pausedWho.length === 1 && en.pausedWho[0] === 'partner');
    out.enoughPaused = S('b.enough.paused', away
      ? [en.pausedEmployer ? "Your partner's employer's part is as you gave it (nothing while they are not paying in). " : '', 'This is from now: if they start again later, they would need more.']
      : [en.pausedEmployer ? "Your employer's part is as you gave it (nothing while you are not paying in). " : '', 'This is from now: if you start again later, you would need more.']);
  }
  return out;
}

/**
 * The words for whose pay-in it is, when one person is saving: you, or your partner ("I've already stopped").
 * `who`/`Who` name the person's own part ("you 27%", "your partner 69%"); `pay` is whose pay a share is of.
 */
function whoWords(theirs) {
  return theirs
    ? { who: 'your partner', Who: 'Your partner', pay: "your partner's pay", payShort: 'their pay', allPay: "all of your partner's pay", employer: 'their employer', employers: "their employer's",
      paying: 'With your partner paying in ', couldStop: 'Your partner could stop paying in', couldStopOwn: 'Your partner could stop paying in themselves, with ', asLittle: 'Your partner could pay in as little as ' }
    : { who: 'you', Who: 'You', pay: 'your pay', payShort: 'your pay', allPay: 'all of your pay', employer: 'your employer', employers: "your employer's",
      paying: 'Paying in ', couldStop: 'You could stop paying in', couldStopOwn: 'You could stop paying in yourself, with ', asLittle: 'You could pay in as little as ' };
}

/** " (your employers' parts included)" / " (your employer's part included)" / " (your partner's employer's part included)". */
function employersIncluded(employers) {
  if (employers.length >= 2) return " (your employers' parts included)";
  if (employers.length === 1) return employers[0] === 'you' ? " (your employer's part included)" : " (your partner's employer's part included)";
  return '';
}

/** ", with your employers' parts as now" / ", with your employer's part as now" / ", with their employer's part as now". */
function employersAsNow(employers) {
  if (employers.length >= 2) return ", with your employers' parts as now";
  if (employers.length === 1) return employers[0] === 'you' ? ", with your employer's part as now" : ", with their employer's part as now";
  return '';
}

/** That matching is not modelled, said of whoever has an employer's part. */
function matchWords(employers) {
  if (employers.length >= 2) return 'If your employers add more when you pay more, you would need less: these keep your employers\' parts as they are now.';
  if (employers[0] === 'partner') return 'If your partner\'s employer adds more when they pay more, you would need less: these keep their employer\'s part as it is now.';
  return 'If your employer adds more when you pay more, you would need less: these keep your employer\'s part as it is now.';
}

/**
 * ", with your savings, your State Pension from 68 (the full amount, as assumed) and your final-salary pension from 65":
 * what the incomes from the stop include, so a saver can tell the gap is not the pot's alone (2.1). The State Pension is
 * named "the full amount, as assumed" when B took the full one; a pension already paid at the stop is named without an age.
 */
function includesParts(facts) {
  const items = [];
  if (facts.anySavings) items.push(['your savings']);
  const whose = (x) => (x.who === 'you' ? 'your' : "your partner's");
  const sps = facts.people.filter((x) => x.sp);
  if (sps.length === 1) {
    const x = sps[0];
    items.push([whose(x), ' State Pension', x.spPaidAtStop ? '' : [' from ', F(x.spAge)], x.spDefault ? ' (the full amount, as assumed)' : '']);
  } else if (sps.length === 2) {
    const later = sps.filter((x) => !x.spPaidAtStop);
    const assumed = sps.filter((x) => x.spDefault);
    const asAssumed = assumed.length === 2 ? ' (the full amounts, as assumed)'
      : assumed.length === 1 ? (assumed[0].who === 'you' ? ' (yours the full amount, as assumed)' : " (your partner's the full amount, as assumed)") : '';
    // two ages: whose is whose (sps is you, then your partner)
    if (later.length && sps[0].spAge !== sps[1].spAge) items.push(['your State Pension from ', F(sps[0].spAge), " and your partner's from ", F(sps[1].spAge), asAssumed]);
    else items.push(['your State Pensions', later.length ? [' from ', F(sps[0].spAge)] : '', asAssumed]);
  }
  const fss = facts.people.filter((x) => x.fs);
  if (fss.length === 1) items.push([whose(fss[0]), ' final-salary pension', fss[0].fsPaidAtStop ? '' : [' from ', F(fss[0].fsAge)]]);
  else if (fss.length === 2) items.push(['your final-salary pensions']);
  if (!items.length) return '';
  return [', with ', items.length === 1 ? items[0] : [items.slice(0, -1).map((x, i) => (i ? [', ', x] : x)), ' and ', items[items.length - 1]]];
}

/**
 * What was assumed, in a fixed order, only the lines that applied. A line with source 'default' always names its field.
 * C's lines apply where their inputs apply; `pot-as-is`, `start-later`, C's `risk`, `steady` and `start` never
 * (B's own lines say those things for the saving years and the years after).
 */
export function assumedFor(result, facts) {
  const out = [];
  const used = new Set(facts.usedDefault);
  const src = (field) => (used.has(field) ? 'default' : 'entered');
  const c = facts.couple;
  const inputs = result.inputs;
  const line = (id, field, source, value, parts) => { out.push({ id, field, source, value, text: '', parts: parts.flat(Infinity).filter((p) => p !== '' && p != null) }); };
  const suffix = (p) => (p.who === 'you' ? '' : '-partner');
  const spMonthly = money(facts.fullStatePensionAYear / 12);

  // the saving years — couples apart (result.apart): each still saving until their own stop; after "I've already
  // stopped" (result.askedAbout) what goes in is your partner's
  const ap = result.apart || null;
  const pa = facts.asked === 'partner';
  const savers = facts.people.filter((x) => x.saves).map((x) => x.who);
  const both = Boolean(ap) && savers.length === 2;
  const payer = pa ? 'partner' : 'you';
  if (result.payIn.now > 0) {
    line('pay-in', `${payer}.payIn.total`, 'entered', result.payIn.now, ap
      ? (both ? [M('payIn.now'), ' a month goes in between you, each until your own stop, rising with prices.']
        : savers[0] === 'you' ? [M('payIn.now'), ' a month goes into your pension until you stop at ', A('apart.stops.you.age'), ', rising with prices.']
          : [M('payIn.now'), " a month goes into your partner's pension until they stop at ", A('apart.stops.partner.age'), ', rising with prices.'])
      : c
        ? [M('payIn.now'), ' a month goes in between you until you stop at ', A('stop.age'), ', rising with prices.']
        : [M('payIn.now'), ' a month goes in until you are ', A('stop.age'), ', rising with prices.']);
  } else {
    line('nothing-paid-in', `${payer}.payIn.total`, 'entered', 0, [pa ? "Nothing more goes into your partner's pension before they stop." : 'Nothing more goes into your pension before you stop.']);
  }
  line('pay-in-as-given', `${payer}.payIn.kind`, 'rule', inputs[payer].payIn.kind, [inputs[payer].payIn.kind === 'share'
    ? 'What you gave as a share of pay is what lands in the pension, with the tax the government adds back already inside it.'
    : 'The figure you gave is what lands in the pension, with the tax the government adds back already inside it.']);
  if (c && result.payIn.now > 0 && (!ap || both)) line('pay-in-split', null, 'rule', null, ['The pay-in that gets there is split between you as it is now.']);
  line('savings-in', 'savingsIn', src('savingsIn'), inputs.savingsIn, inputs.savingsIn > 0
    ? (ap
      ? [M('inputs.savingsIn'), ' a month goes into ISAs or savings', both ? ', split between you, each until you stop'
        : savers[0] === 'you' ? [' until you stop at ', A('apart.stops.you.age')] : [' until your partner stops at ', A('apart.stops.partner.age')], ', rising with prices.']
      : [M('inputs.savingsIn'), ' a month goes into ISAs or savings until you stop, rising with prices.'])
    : ['Nothing more goes into ISAs or savings each month.']);
  line('risk-saving', 'savingRisk', src('savingRisk'), inputs.savingRisk, ['While saving: ', LEVEL_NAME[inputs.savingRisk], ', ', LEVEL_WORDS[inputs.savingRisk], '.']);
  line('risk-drawing', 'risk', src('risk'), inputs.risk, ['Once stopped: ', LEVEL_NAME[inputs.risk], ', ', LEVEL_WORDS[inputs.risk], '.']);
  if (inputs.savingRisk !== inputs.risk) {
    line('slide', null, 'rule', SAVING.slideYears, [ap ? 'Over the ten years before each of you stops, the mix moves step by step from the one while saving to the one once stopped.'
      : 'Over the ten years before you stop, the mix moves step by step from the one while saving to the one once stopped.']);
  }
  // the one fund and platform charge (6.19.0), with Change: while saving and once stopped
  line('charges', 'charge', src('charge'), inputs.charge, chargesParts(inputs.charge));
  line('saving-rebalanced', null, 'rule', null, ['While you are saving, your pot is kept at its mix each month.']);
  line('same-futures', null, 'rule', null, ['The saving years and the years after are tried against the same futures.']);
  if (pa) line('stop-age', 'partner.stop.age', 'entered', inputs.partner.stop.age, ['Your partner stops working at ', A('stop.age'), ', and nothing more goes into their pension from then.']);
  else line('stop-age', 'stop.age', 'entered', inputs.stop.age, ['You stop working at ', A('stop.age'), ap ? ', and nothing more goes into your pension from then.' : ', and nothing more goes in from then.']);
  if (c && ap) {
    // each of you on your own date: the pay line, and what it means (shared/apart.js, the same words in C, A and B)
    for (const x of apartAssumed(result, { ...(facts.apart || {}), youAlready: pa })) line(x.id, x.field, x.source, x.value, x.parts);
  } else if (c) {
    line('stop-together', null, 'rule', null, facts.partnerRetired
      ? ["Your partner's money is left alone until you stop at ", A('stop.age'), ', then drawn on with yours.']
      : ['Your partner stops working in the same year, at ', A('ages.partner'), '.']);
  }
  if (inputs.spend.kind === 'level') {
    line('spend-level', 'spend.level', 'entered', result.spend.perMonth, [SPEND_LEVEL[inputs.spend.level], ': ', M('spend.perMonth'), c ? ' a month for a couple' : ' a month for one person',
      ', from the Retirement Living Standards.']);
  }
  line('spend-steady', null, 'rule', null, [ap ? 'You spend the same each month, going up with prices.' : 'You spend the same each month, going up with prices, from the day you stop.']);
  for (const p of facts.people.filter((x) => x.closedUntil !== null)) {
    line('pension-closed-until' + suffix(p), null, 'rule', p.closedUntil, p.who === 'you'
      ? ['Your pension is left alone until you are ', F(p.closedUntil), '; your savings pay until then.']
      : ["Your partner's pension is left alone until they are ", F(p.closedUntil), '; the rest of the money pays until then.']);
  }
  if (result.outside) line('outside-first', null, 'rule', result.outside.amount, ['The years before you can take money from your pension are paid from ISAs and savings, set aside so they last those years in every future we tried; the pension is on top of that.']);
  line('number-is-careful', null, 'rule', null, ['The number is a guide: the pot that, if you had exactly that when you stop, pays what you want ', ...confParts(result.level), '. The pay-in is worked out on the whole of each future, from now to the end.']);
  line('confidence', 'confidence', src('confidence'), inputs.confidence, ['The pay-in that gets there makes your money last ', ...confParts(inputs.confidence), '.']);

  // C's lines, where their inputs apply
  for (const p of facts.people) {
    const kindField = p.who + '.statePension.kind';
    if (p.sp && p.spDefault) {
      const whose = p.who === 'you' ? 'The full State Pension' : 'For your partner, the full State Pension';
      const check = p.who === 'you' ? ' Yours may be different — check your forecast.' : ' Theirs may be different — check their forecast.';
      line('state-pension-full' + suffix(p), kindField, src(kindField), facts.fullStatePensionAYear, [whose, ' of ', F(spMonthly), ' a month from age ', F(p.spAge), '.', check]);
    }
    if (p.sp) {
      line('state-pension-age' + suffix(p), null, 'rule', p.spAge,
        p.who === 'you' ? ['Your State Pension age of ', F(p.spAge), ' comes from your age.'] : ["Your partner's State Pension age of ", F(p.spAge), ' comes from their age.']);
    }
  }
  // the tax-free part (couples-different-years.md 2.3): asked only of someone who has stopped; already had, everything
  // taken from that pension is taxed. Not answered: not taken — a quarter of each withdrawal, as before.
  const taken = facts.people.filter((p) => p.taxFreeTaken && p.pension);
  for (const p of taken) {
    line('tax-free-taken' + suffix(p), `${p.who}.taxFreeTaken`, 'entered', true, p.who === 'you'
      ? ['You have already had the tax-free part of your pension, so everything taken from it is taxed.']
      : ["Your partner has already had the tax-free part of their pension, so everything taken from it is taxed."]);
  }
  if (facts.anyPension && (!taken.length || facts.people.some((p) => !p.taxFreeTaken && (p.pension || p.saves)))) line('quarter-tax-free', null, 'rule', RULES.taxFreeShare, ['A quarter of each pension withdrawal is tax-free.']);
  if (facts.weighing) for (const a of lifeAssumed(facts.weighing.lf)) out.push(a);
  else line('plan-to', 'endAge', src('endAge'), inputs.endAge, c ? ['The money needs to last until the younger of you is ', A('basis.endAge'), '.'] : ['The money needs to last until you are ', A('basis.endAge'), '.']);
  line('todays-prices', null, 'rule', null, ["All figures are in today's prices."]);
  for (const p of facts.people) {
    if (p.fsDefault) line('no-final-salary' + suffix(p), p.who + '.finalSalary.has', 'default', false, p.who === 'you' ? ['No final-salary pension.'] : ['Your partner has no final-salary pension.']);
  }
  const fss = facts.people.filter((p) => p.fs);
  if (fss.length === 2) line('final-salary-rises', null, 'rule', 'pricesCapped5', ['Your final-salary pensions rise with prices, up to ', F('5'), '% a year.']);
  else if (fss.length === 1) line('final-salary-rises', null, 'rule', 'pricesCapped5', [fss[0].who === 'you' ? 'Your final-salary pension' : "Your partner's final-salary pension", ' rises with prices, up to ', F('5'), '% a year.']);
  if (c) {
    const partner = facts.people[1];
    if (partner.potDefault) line('partner-no-pot', 'partner.pot', 'default', 0, ['Your partner has no pension pot today.']);
    // (couples apart: the savings go with the one who stops first — 'savings-first', above)
    if (!ap && (inputs.savings > 0 || inputs.savingsIn > 0)) line('savings-split', 'savings', 'rule', null, ['Your savings, and what goes into them, are split evenly between you.']);
  }
  // how the savings grow (6.22.0), with Change: "Mostly cash" or "Invested like my pension", while saving and once stopped
  if (inputs.savings > 0 || inputs.savingsIn > 0) line('savings-growth', 'isaGrowth', src('isaGrowth'), inputs.isaGrowth, savingsGrowthParts(inputs.isaGrowth));
  if (c && !facts.weighing) line('both-alive', null, 'rule', null, ['Both of you are alive throughout.']);
  line('tax-rules', null, 'rule', RULES.taxYear, ['Tax rules for ', F(RULES.taxYear), ' in England, Wales and Northern Ireland, with allowances rising with prices; the ', F(money(RULES.taperFrom)),
    ' point where the allowance starts to be withdrawn stays fixed.']);
  if (!facts.madeUpFutures) line('futures', null, 'rule', result.basis.futures, ['Tested against ', F(money(result.basis.futures).slice(1)), ' possible futures, each pieced together from stretches of US share returns and US price rises since ', F(facts.historyStartYear),
      '. Share returns are cut by ', F(shareCutPercent()), '% a year to stand for shares around the world; bonds and cash are worked out from each future\'s markets.']);
  return out;
}

/** The warnings (brief 4.9), in its order, only those that apply. */
export function warningsFor(result, facts) {
  const out = [];
  const warn = (id, severity, parts) => { out.push({ id, severity, text: '', parts: parts.flat(Infinity).filter((p) => p !== '' && p != null) }); };
  const c = facts.couple;
  for (const p of facts.people.filter((x) => x.closedUntil !== null)) {
    warn('pension-closed' + (p.who === 'you' ? '' : '-partner'), 'important', p.who === 'you'
      ? ["You can't take money from your pension until you are ", F(p.closedUntil), '. Stopping at ', A('stop.age'), ' needs savings you can reach until then.']
      : ["Your partner can't take money from their pension until they are ", F(p.closedUntil), '. Until then the rest of the money pays.']);
  }
  if (result.gapYears > 0) {
    // (couples apart: the closed years are counted from where the pay of the one still working stops covering, in the
    // younger person's ages, as the run-out age is)
    const open = result.apart && result.outside ? result.outside.untilAge : result.stop.age + result.gapYears;
    if (result.wholeLife.runOutAge < open) {
      warn('savings-run-short', 'important', [...BAD, ', paying in as now, the savings run out at ', A('wholeLife.runOutAge'), ', before a pension can be touched at ', F(open), '.']);
    }
    if (!(result.inputs.savings > 0) && !(result.inputs.savingsIn > 0)) {
      warn('no-savings-for-gap', 'important', ['With no ISA or savings, nothing pays the years before a pension can be touched. The savings part above is what they would need.']);
    }
  }
  // couples apart: a bad case that leans on the pay of the one still working; and, for everyone it applies to, money moved
  // into drawdown before 6 April 2028 (shared/apart.js, the same words in C, A and B)
  for (const w of apartWarnings(result, { drawdown: facts.drawdown2028 || (facts.apart && facts.apart.drawdown) || [] })) warn(w.id, w.severity, w.parts);
  if (facts.partnerRetired) {
    warn('partner-stops-with-you', 'note', ["Your partner is past their State Pension age. These figures leave their money alone until you stop at ", A('stop.age'),
      ', and do not count anything they take before then.']);
  }
  if (facts.accessRises) {
    warn('access-age-rises', 'note', ['The earliest age you can take money from a pension rises from ', F(RULES.pensionAccess.before), ' to ', F(RULES.pensionAccess.from), ' on ', F('6'), ' April ',
      F(RULES.pensionAccess.changesOn.slice(0, 4)), '. Anyone not ', F(RULES.pensionAccess.before), ' by then waits until ', F(RULES.pensionAccess.from), '.']);
  }
  // most of the money at the stop is savings, held mostly as cash (6.22.0): how to say they are invested
  if (facts.savingsMostly && (result.inputs.isaGrowth || RULES.isaGrowthDefault) === 'cash') warn('savings-mostly-cash', 'note', mostlyCashParts());
  if (facts.overAllowance) {
    warn('annual-allowance', 'important', [facts.overAllowance === 'now' ? 'What goes in now' : 'The pay-in that gets there', ' is more than ', F(money(RULES.annualAllowance)),
      ' a year for one person, the most that gets the tax the government adds back each year (less for the highest earners). Some of it would be taxed.']);
  }
  if (facts.overMpaa) {
    warn('mpaa', 'important', ['Once you have taken taxable money from a pension, only ', F(money(RULES.moneyPurchaseAllowance)),
      ' a year paid in gets the tax the government adds back. ', facts.overMpaa === 'now' ? 'What goes in now' : 'The pay-in that gets there', ' is more than that.']);
  }
  if (facts.overIsa) warn('isa-allowance', 'note', ['The most one person can put into ISAs is ', F(money(RULES.isaAllowance)), ' a year; this puts in more.']);
  if (result.status === 'out-of-reach') {
    warn('out-of-reach', 'important', result.levels[result.level].pot === null
      ? ['No pot up to ', F(money(SAVING.potMax)), ' pays this from ', A('stop.age'), ...nineP(' in '), '.']
      : ['No pay-in up to ', F(money(SAVING.payInCeiling)), (result.apart ? facts.people.filter((p) => p.saves).length === 2 : c) ? ' a month each' : ' a month', ' makes the money last from ', A('stop.age'), ...nineP(' in '), '.']);
  }
  if (result.status === 'guaranteed-only') warn('target-below-pensions', 'note', [c ? 'Your State Pensions cover' : 'Your State Pension covers', ' what you want to spend once it starts.']);
  if (facts.capped) warn('long-plan', 'important', ['We can only test ', F(RULES.maxYears), ' years ahead, so this runs to age ', A('basis.endAge'), ', not ', A('inputs.endAge'), '.']);
  if (result.phases.some((ph) => ph.byPerson.some((b) => b.higherRate))) warn('higher-rate', 'note', ['Some of this is taxed at ', F('40'), '%. Spreading it ', c ? 'between you, or ' : '', 'over more years may lower the tax.']);
  if (c && facts.oneName) warn('one-name', 'note', ['Most of the pension is in one name, so one tax allowance is barely used.']);
  if (facts.people.some((p) => p.sp && p.spDefault)) warn('state-pension-assumed', 'note', ['This assumes the full State Pension. If yours is lower, so is the figure.']);
  if (facts.largePot) warn('large-pot', 'note', ['The tax-free part of a pension is limited to ', F(money(RULES.taxFreeLimit)), ' in total. That limit is included.']);
  if (result.levels[result.level].pot > 0 && result.levels[result.level].pot < RULES.smallPot) {
    warn('small-pot', 'note', ['With a pot this size, many people take it as one or a few lump sums instead of a monthly income.']);
  }
  // what is spent changing with age (spending-shape.md 7.4): the incomes you get anyway pay more than the shape
  for (const w of shapeWarnings(result, { couple: facts.couple })) warn(w.id, w.severity, w.parts);
  return out;
}

/** Whether a shape's list says more than its start: a later step, or a start that falls or moves evenly. */
function shapeMoves(list) {
  return Array.isArray(list) && (list.length > 1 || Boolean(list[0] && list[0].then !== 'level'));
}
