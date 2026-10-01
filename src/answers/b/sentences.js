/**
 * The sentences of question B (step 4 brief 4.9; screens-A-B.md 7.2 and 4.2–4.4), what was assumed (7.3) and the
 * warnings (brief 4.9). Every figure in a sentence is a reference into the result, so the screen can mark it; `text` is
 * the parts joined by format.js, and a test asserts the two agree.
 *
 * Plain English, in every state: "pay in", "what goes in each month", "stop at 60", "while you are saving", "on course",
 * "£70,000 short", "a bad case (the worst 1 in 10)". Ages, never a length of time to wait. One "about" a sentence.
 * Couples are "you" and "your partner", "between you", "the two of you".
 */
import { money, partsText, lastedText } from '../shared/format.js';
import { shareCutPercent } from '../shared/futures.js';
import { RULES, SAVING } from '../shared/rules.js';

const M = (key) => ({ key, kind: 'money' });
const A = (key) => ({ key, kind: 'age' });
const P = (key) => ({ key, kind: 'pot' });
const F = (fixed) => ({ fixed: String(fixed) });
const S = (id, parts) => ({ id, text: '', parts: parts.flat(Infinity).filter((p) => p !== '' && p != null) });

/** 'in only 6 futures out of 10' → parts, each count a fixed figure. */
export function wordsParts(words) {
  return words.split(/(\d+)/).map((piece, i) => (i % 2 ? F(piece) : piece)).filter((p) => p !== '');
}
/** The count of lives that lasted, in words: "in 9 futures out of 10", "in just under 9 futures out of 10" (85% to under 90%: never the careful 9). */
const countParts = (share) => wordsParts(lastedText(share));
/** The words of a confidence: what the pay-in that gets there reaches the number in. */
export const CONFIDENCE_WORDS = { nineInTen: 'in 9 futures out of 10', threeInFour: 'in 3 futures out of 4' };
const confParts = (c) => wordsParts(CONFIDENCE_WORDS[c] || CONFIDENCE_WORDS.nineInTen);
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
 * @property {number|null} gridRow        the grid's row for the stop age (detail 'grid')
 */

const until = (facts) => (facts.couple ? ['until the younger of you is ', A('basis.endAge')] : ['until you are ', A('basis.endAge')]);

/** ", with your State Pension from 67" / ", with your State Pensions from 67 and 69" — only those still to start at the stop. */
function spFromParts(facts) {
  const later = facts.people.filter((p) => p.sp && !p.spPaidAtStop);
  if (!later.length) return [];
  if (later.length === 1) return [', with ', later[0].who === 'you' ? 'your' : "your partner's", ' State Pension from ', F(later[0].spAge)];
  if (later[0].spAge === later[1].spAge) return [', with your State Pensions from ', F(later[0].spAge)];
  return [', with your State Pensions from ', F(later[0].spAge), ' and ', F(later[1].spAge)];
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
const carefulNowParts = (result) => (result.monthlyIfShort > 0
  ? [' Paying in as now, about ', M('monthlyIfShort'), ' a month from ', A('stop.age'), ' lasted in ', F('9'), ' futures out of ', F('10'), '.']
  : [' Paying in as now, no amount a month from ', A('stop.age'), ' lasted in ', F('9'), ' futures out of ', F('10'), '.']);

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
  const number = result.number;
  const nowIn = result.payIn.now > 0;
  const zero = st === 'ok' && number !== null && number.careful === 0;
  const lastedTo = ['your money lasted ', until(facts), ' '];

  // ---- the first headline -------------------------------------------------------------------------------------------
  if (st === 'guaranteed-only') {
    out.head = S('b.head.nothing', ['No pot is needed for ', M('spend.perMonth'), ' a month']);
    out.sub = S('b.sub.nothing', [c ? 'your State Pensions' : 'your State Pension', facts.people.some((p) => p.fs) ? ' and final-salary pension' : '', ' cover it after tax from ', A('stop.age'), ' ', until(facts), ', going up each year with prices']);
    out.nothing = S('b.nothing', [c ? 'Your State Pensions' : 'Your State Pension', facts.people.some((p) => p.fs) ? ' and final-salary pension' : '', ' alone give ', M('guaranteed.monthlyAfterTax'),
      ' a month after tax once started, which covers ', M('spend.perMonth'), '. No pot is needed for that.']);
    out.line = out.nothing;
    out.bad = S('b.bad.nothing', [...BAD, ' makes no difference here: none of this depends on markets.']);
  } else if (number === null) {
    out.head = S('b.head.none', ['More than ', F(money(SAVING.potMax)), ' by age ', A('stop.age')]);
    out.sub = S('b.sub', ['to pay ', M('spend.perMonth'), ' a month after tax from ', A('stop.age'), ' ', until(facts), ', going up each year with prices']);
    out.none = S('b.none.pot', ['No pot up to ', F(money(SAVING.potMax)), ' paid ', M('spend.perMonth'), ' a month from ', A('stop.age'), ' in ', F('9'), ' futures out of ', F('10'),
      '. Stopping later or spending less changes that: the ways to make it fit are below.']);
    out.line = out.none;
    out.bad = S('b.bad.none', [...BAD, ', ', nowParts(result), ' as now, your money runs out ', c ? ['when the younger of you is ', A('wholeLife.runOutAge')] : ['at ', A('wholeLife.runOutAge')],
      '.', ...carefulNowParts(result)]);
  } else if (zero) {
    // no pension pot is needed: the savings (and the State Pension) pay for it
    out.head = result.onCourse ? S('b.head.onCourse', ['On course for ', A('stop.age')]) : S('b.head.zero', ['No pension pot is needed for ', M('spend.perMonth'), ' a month']);
    out.sub = result.onCourse
      ? S('b.sub.onCourse', [nowIn ? ['paying in ', M('payIn.now'), ' a month as you do now, '] : 'paying nothing more in, ', ...lastedTo, countParts(result.chance.lasted)])
      : S('b.sub.zero', [payersWords(facts), ' pay for it after tax from ', A('stop.age'), ' ', until(facts), ', going up each year with prices']);
    out.line = S('b.line.zero', [cap(payersWords(facts)), !result.onCourse && result.outside ? [' pay for this once about ', P('outside.careful'), ' is in ISAs or savings by ', A('stop.age')] : ' already pay for this',
      ': nothing more is needed in your pension.']);
    out.bad = result.onCourse
      ? S('b.bad.onCourse', [...BAD, ', ', nowParts(result), ' as now, your money still lasts to ', A('basis.endAge'), '.'])
      : S('b.bad.zero', [...BAD, ', as things are now, your money runs out ', c ? ['when the younger of you is ', A('wholeLife.runOutAge')] : ['at ', A('wholeLife.runOutAge')], '.']);
  } else {
    if (result.onCourse) {
      out.head = S('b.head.onCourse', ['On course for ', A('stop.age')]);
      out.sub = S('b.sub.onCourse', [nowIn ? ['paying in ', M('payIn.now'), ' a month as you do now, '] : 'paying nothing more in, ', ...lastedTo, countParts(result.chance.lasted)]);
    } else {
      out.head = c ? S('b.head.couple', ['About ', P('number.careful'), ' between you by the time you are ', A('stop.age')]) : S('b.head', ['About ', P('number.careful'), ' by age ', A('stop.age')]);
      out.sub = S('b.sub', ['the pot that, if you had exactly that at ', A('stop.age'), ', pays ', M('spend.perMonth'), ' a month after tax ', until(facts), ', going up each year with prices, in ', F('9'),
        ' futures out of ', F('10'), spFromParts(facts)]);
    }
    // the guide number, worded as what it is
    out.line = S(c ? 'b.line.couple' : 'b.line', ['To spend ', M('spend.perMonth'), ' a month from ', A('stop.age'), ', ', c ? 'the two of you would want pots of about ' : 'you would want a pot of about ', P('number.careful'),
      c ? ' between you by then' : ' by then', ': with exactly that at ', A('stop.age'), ', the money lasted in ', F('9'), ' futures out of ', F('10'), '.']);
    if (result.onCourse) {
      const least = facts.leastNow;
      out.bad = S('b.bad.onCourse', [...BAD, ', ', nowParts(result), ' as now, your money still lasts to ', A('basis.endAge'), '.',
        least !== null && least > 0 && least < result.payIn.now ? [' You could pay in as little as about ', M('payIn.at.nineInTen'), ' a month and it would still last in ', F('9'), ' futures out of ', F('10'), '.']
          : least === 0 && nowIn ? [' You could stop paying in and it would still last in ', F('9'), ' futures out of ', F('10'), '.'] : '']);
    } else {
      // the bad case of the pension at the stop, said as it is — never measured against the guide number: a bad case
      // while saving and a bad case once stopped are rarely the same future, so "£133,000 short of it" was two cautions
      // added together, and contradicted the pay-in (the reviewers' finding, 1 Oct 2026; the guide sentence below says so)
      out.bad = S('b.bad', [...BAD, ', ', nowParts(result), ' as now gets ', c ? 'your pensions' : 'your pension', ' to about ', P('potAtStop.now.careful'), ' by ', A('stop.age'), '.',
        ...carefulNowParts(result)]);
    }
    // what the number is, and why the pay-in — not the number — is the answer
    out.guide = S('b.guide', ['The pot is a guide. A bad case while you are saving and a bad case once you have stopped are rarely the same future, so what you pay in is tried on each whole future, from now ',
      ...until(facts), ', and that is the answer.']);
    if (result.already && st === 'ok') {
      out.have = S('b.have', ['You already have more than ', P('number.careful'), ' in your pension. Paying in nothing more, ', ...lastedTo, countParts(facts.haveLasted ?? 0), '.']);
    }
  }

  // ---- the second headline: the pay-in that gets there (two headlines only when short) -------------------------------
  const pi = result.payIn;
  const two = st === 'ok' && !result.onCourse && number !== null && pi.needed !== null;
  const savingsToo = result.outside && pi.outside !== null && pi.outside > (pi.savingsNow || 0);
  const savingsOnly = two && savingsToo && pi.needed <= pi.now && result.levers.payMore;
  if (savingsOnly) {
    // what goes into the pension is enough as it is: the savings for the years before it opens are what fall short
    out.payInHead = S('b.payIn.head.savings', ['About ', M('payIn.outside'), ' a month into savings']);
    out.payInSub = S('b.payIn.sub.savings', ['beside ', M('payIn.now'), ' a month into ', c ? 'your pensions' : 'your pension', ' as now, from now until you are ', A('stop.age'), ', going up each year with prices']);
    out.payInLine = S('b.payIn.savings', ['Putting about ', M('payIn.outside'), ' a month into savings, with ', M('payIn.now'), ' a month going into ', c ? 'your pensions' : 'your pension', ' as now, ',
      ...lastedTo, countParts(result.levers.payMore.lasted), '.']);
    out.payInBad = S('b.payIn.bad.savings', [...BAD, ', about ', P('outside.careful'), ' in savings by ', A('stop.age'), ' carries the years from ', A('stop.age'), ' to ', A('outside.untilAge'), '.']);
  } else if (two) {
    const pensions = c ? 'into your pensions between you' : 'into your pension';
    out.payInHead = S('b.payIn.head', ['About ', M('payIn.needed'), ' a month ', pensions, savingsToo ? [', and ', M('payIn.outside'), ' a month into savings'] : '']);
    out.payInSub = S('b.payIn.sub', [pi.employer > 0 ? ["including your employer's ", M('payIn.employer'), ', '] : '', 'from now until you are ', A('stop.age'), ', going up each year with prices']);
    out.payInLine = pi.needed > pi.now
      ? S('b.payIn.line', ['Paying in about ', M('payIn.needed'), ' a month', savingsToo ? [' (and ', M('payIn.outside'), ' into savings)'] : '', ' and then spending ', M('spend.perMonth'), ' a month, ',
        ...lastedTo, confParts(pi.confidence), '. That is ', M('payIn.extra'), ' a month more than now.'])
      : S('b.payIn.less', ['Paying in ', M('payIn.needed'), ' a month', savingsToo ? [' and about ', M('payIn.outside'), ' into savings'] : '', ' and then spending ', M('spend.perMonth'), ' a month, ',
        ...lastedTo, confParts(pi.confidence), '. That is no more than goes into your pension now.']);
    out.payInBad = S('b.payIn.bad', [...BAD, ', ', M('payIn.needed'), ' a month gets ', c ? 'your pensions' : 'your pension', ' to about ', P('potAtStop.needed.careful'), ' by ', A('stop.age'),
      '. In a middling case it reaches ', P('potAtStop.needed.middling'), '.']);
  }
  if (st === 'out-of-reach' && number !== null) {
    out.none = S('b.none', ['No pay-in up to ', F(money(SAVING.payInCeiling)), c ? ' a month each' : ' a month', ' makes ', M('spend.perMonth'), ' a month from ', A('stop.age'), ' last in ', F('9'), ' futures out of ', F('10'),
      '. Try a later age or a lower amount.']);
  }

  // ---- the pots at the stop ----------------------------------------------------------------------------------------
  const savingsNote = facts.anySavings ? [' (your savings are on top)'] : '';
  out.potsNow = S('b.pots.now', [nowIn ? ['Paying in ', M('payIn.now'), ' a month as now, ', c ? 'your pensions' : 'your pension', ' at ', A('stop.age'), savingsNote, ': '] : ['Paying nothing in, as now, ', c ? 'your pensions' : 'your pension', ' at ', A('stop.age'), savingsNote, ': '],
    P('potAtStop.now.careful'), ' in ', BAD[0].slice(3), BAD.slice(1), ', ', P('potAtStop.now.middling'), ' in a middling case, ', P('potAtStop.now.good'), ' ', GOOD, '.']);
  if (two && result.potAtStop.needed) {
    out.potsNeeded = S('b.pots.needed', ['Paying in ', M('payIn.needed'), ' a month: ', P('potAtStop.needed.careful'), ' in a bad case, ', P('potAtStop.needed.middling'),
      ' in a middling case, ', P('potAtStop.needed.good'), ' in a good case.']);
  }

  // ---- the whole life, once: today's pay-in, then the spend -----------------------------------------------------------
  out.wholeLife = S('b.wholeLife', [nowIn ? ['Paying in ', M('payIn.now'), ' a month as you do now'] : 'Paying nothing in', ' and then spending ', M('spend.perMonth'),
    ' a month, ', ...lastedTo, countParts(result.wholeLife.lasted), '.']);

  // ---- stopping before a pension can be touched ----------------------------------------------------------------------
  if (result.outside) {
    out.outside = S('b.outside', ['Stopping at ', A('stop.age'), ' is before you can take money from a pension (', A('outside.untilAge'), '). Beside the pension, about ',
      P('outside.careful'), ' needs to be in ISAs or savings by ', A('stop.age'), ' to pay the years from ', A('stop.age'), ' to ', A('outside.untilAge'), ' in every future we tried.',
      two && !savingsOnly ? ' The pay-in above is into your pension; the savings part is on top of it.' : '']);
  }

  // ---- the ways to make it fit --------------------------------------------------------------------------------------
  const lever = {};
  const lv = result.levers;
  if (lv.stopLater) {
    lever.stopLater = S('b.lever.stopLater', [c ? ['Both stop when you are ', A('levers.stopLater.age'), ', not ', A('stop.age')] : ['Stop at ', A('levers.stopLater.age'), ', not ', A('stop.age')],
      ': ', nowParts(result), ' as now, your money lasted ', countParts(lv.stopLater.lasted), '.']);
  } else if (st !== 'guaranteed-only' && !result.onCourse && facts.laterTo !== null) {
    lever.stopLaterNone = S('b.lever.stopLater.none', ['Stopping later alone, even at ', F(facts.laterTo), ', did not make it last in ', F('9'), ' futures out of ', F('10'), ' paying in as now.']);
  }
  if (lv.payMore) {
    lever.payMore = S('b.lever.payMore', ['Pay in ', M('levers.payMore.payIn'), ' a month', lv.payMore.savingsIn ? [' and put ', M('levers.payMore.savingsIn'), ' a month into savings'] : '',
      ': your money lasted ', countParts(lv.payMore.lasted), '.']);
  }
  if (lv.spendLess) {
    lever.spendLess = S('b.lever.spendLess', ['Spend ', M('levers.spendLess.spend'), ' a month, not ', M('spend.perMonth'), ': ', nowParts(result), ' as now, your money lasted ', countParts(lv.spendLess.lasted), '.']);
  }
  if (lv.moreRisk) {
    const words = LEVEL_WORDS[lv.moreRisk.level];
    if (lv.moreRisk.payIn === null) lever.moreRisk = S('b.lever.moreRisk.no', ['More risk while saving, ', words, ': no pay-in up to ', F(money(SAVING.payInCeiling)), c ? ' a month each' : ' a month', ' made it last.']);
    else if (lv.moreRisk.helps) lever.moreRisk = S('b.lever.moreRisk', ['More risk while saving, ', words, ': ', M('levers.moreRisk.payIn'), ' a month made it last ', confParts(pi.confidence), '.']);
    else lever.moreRisk = S('b.lever.moreRisk.no', ['More risk while saving, ', words, ', does not lower what goes in: it would take ', M('levers.moreRisk.payIn'), ' a month.']);
  }
  lever.accept = st === 'guaranteed-only'
    ? S('b.lever.accept', ['Keep paying in ', nowParts(result), ' as now.'])
    : S('b.lever.accept', ['Keep paying in ', nowParts(result), ' as now: your money lasted ', countParts(lv.accept.lasted), '.',
      ...(lv.accept.monthlyIfShort > 0 ? [' About ', M('levers.accept.monthlyIfShort'), ' a month from ', A('stop.age'), ' lasted in ', F('9'), ' futures out of ', F('10'), '.']
        : [' No amount a month from ', A('stop.age'), ' lasted in ', F('9'), ' futures out of ', F('10'), '.'])]);
  out.lever = lever;

  // ---- the grid: the stop age's cell for screen readers, and a sentence when no cell reaches 9 in 10 -------------------
  if (result.grid && facts.gridRow !== null && facts.gridRow !== undefined && result.grid.ages[facts.gridRow] && result.grid.payIns.length) {
    const k = facts.gridRow;
    const cell = result.grid.ages[k].cells[0];
    out.gridCell = S('b.grid.cell', ['Stopping at ', A(`grid.ages.${k}.age`), ' and paying in ', M(`grid.ages.${k}.cells.0.payIn`), ' a month, your money lasted ', countParts(cell.lasted), '.']);
  }
  if (result.grid && !result.grid.reaches) {
    out.gridNone = S('b.grid.none', ['None of these lasted in ', F('9'), ' futures out of ', F('10'), '. A later age, or a lower amount to spend, is needed as well.']);
  }

  // ---- "Now:" for the try-a-change row (the screen keeps the one before) -----------------------------------------------
  out.change = st === 'guaranteed-only'
    ? S('b.change', ['Now: no pot needed by ', A('stop.age'), '.'])
    : number === null
      ? S('b.change', ['Now: more than ', F(money(SAVING.potMax)), ' by ', A('stop.age'), '.'])
      : S('b.change', ['Now: ', result.onCourse ? 'on course for ' : 'not on course for ', A('stop.age'), ', lasted ', countParts(result.chance.lasted), '.']);
  return out;
}

/**
 * What was assumed, in a fixed order, only the lines that applied. A line with source 'default' always names its field.
 * C's lines apply where their inputs apply; `pot-as-is`, `start-later`, C's `risk`, `steady`, `start` and `no-charges` never
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

  // the saving years
  if (result.payIn.now > 0) {
    line('pay-in', 'you.payIn.total', 'entered', result.payIn.now, c
      ? [M('payIn.now'), ' a month goes in between you until you stop at ', A('stop.age'), ', rising with prices.']
      : [M('payIn.now'), ' a month goes in until you are ', A('stop.age'), ', rising with prices.']);
  } else {
    line('nothing-paid-in', 'you.payIn.total', 'entered', 0, ['Nothing more goes into your pension before you stop.']);
  }
  line('pay-in-as-given', 'you.payIn.kind', 'rule', inputs.you.payIn.kind, ['The figure you gave is what lands in the pension, with the tax the government adds back already inside it.']);
  if (c && result.payIn.now > 0) line('pay-in-split', null, 'rule', null, ['The pay-in that gets there is split between you as it is now.']);
  line('savings-in', 'savingsIn', src('savingsIn'), inputs.savingsIn, inputs.savingsIn > 0
    ? [M('inputs.savingsIn'), ' a month goes into ISAs or savings until you stop, rising with prices.']
    : ['Nothing more goes into ISAs or savings each month.']);
  line('risk-saving', 'savingRisk', src('savingRisk'), inputs.savingRisk, ['While saving: ', LEVEL_NAME[inputs.savingRisk], ', ', LEVEL_WORDS[inputs.savingRisk], '.']);
  line('risk-drawing', 'risk', src('risk'), inputs.risk, ['Once stopped: ', LEVEL_NAME[inputs.risk], ', ', LEVEL_WORDS[inputs.risk], '.']);
  if (inputs.savingRisk !== inputs.risk) {
    line('slide', null, 'rule', SAVING.slideYears, ['Over the ten years before you stop, the mix moves step by step from the one while saving to the one once stopped.']);
  }
  line('charge-saving', 'charge', src('charge'), inputs.charge, ['A charge of ', F(String(inputs.charge)), '% a year comes off while you are saving; none once you have stopped.']);
  line('saving-rebalanced', null, 'rule', null, ['While you are saving, your pot is kept at its mix each month.']);
  line('same-futures', null, 'rule', null, ['The saving years and the years after are tried against the same futures.']);
  line('stop-age', 'stop.age', 'entered', inputs.stop.age, ['You stop working at ', A('stop.age'), ', and nothing more goes in from then.']);
  if (c) line('stop-together', null, 'rule', null, facts.partnerRetired
    ? ["Your partner's money is left alone until you stop at ", A('stop.age'), ', then drawn on with yours.']
    : ['Your partner stops working in the same year, at ', A('ages.partner'), '.']);
  if (inputs.spend.kind === 'level') {
    line('spend-level', 'spend.level', 'entered', result.spend.perMonth, [SPEND_LEVEL[inputs.spend.level], ': ', M('spend.perMonth'), c ? ' a month for a couple' : ' a month for one person',
      ', from the Retirement Living Standards.']);
  }
  line('spend-steady', null, 'rule', null, ['You spend the same each month, going up with prices, from the day you stop.']);
  for (const p of facts.people.filter((x) => x.closedUntil !== null)) {
    line('pension-closed-until' + suffix(p), null, 'rule', p.closedUntil, p.who === 'you'
      ? ['Your pension is left alone until you are ', F(p.closedUntil), '; your savings pay until then.']
      : ["Your partner's pension is left alone until they are ", F(p.closedUntil), '; the rest of the money pays until then.']);
  }
  if (result.outside) line('outside-first', null, 'rule', result.outside.amount, ['The years before you can take money from your pension are paid from ISAs and savings, set aside so they last those years in every future we tried; the pension is on top of that.']);
  line('number-is-careful', null, 'rule', null, ['The number is a guide: the pot that, if you had exactly that when you stop, pays what you want ', ...confParts('nineInTen'), '. The pay-in is worked out on the whole of each future, from now to the end.']);
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
  if (facts.anyPension) line('quarter-tax-free', null, 'rule', RULES.taxFreeShare, ['A quarter of each pension withdrawal is tax-free.']);
  line('plan-to', 'endAge', src('endAge'), inputs.endAge, c ? ['The money needs to last until the younger of you is ', A('basis.endAge'), '.'] : ['The money needs to last until you are ', A('basis.endAge'), '.']);
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
    if (inputs.savings > 0 || inputs.savingsIn > 0) line('savings-split', 'savings', 'rule', null, ['Your savings, and what goes into them, are split evenly between you.']);
  }
  if (inputs.savings > 0 || inputs.savingsIn > 0) {
    line('isa-fixed-growth', null, 'rule', Math.round(RULES.savingsGrowth * 100), ['Once you have stopped, your savings are treated as ISA money: tax-free to take, growing at a fixed ',
      F(Math.round(RULES.savingsGrowth * 100)), '% a year before rising prices, so they lose ground whenever prices rise faster than that.']);
  }
  if (c) line('both-alive', null, 'rule', null, ['Both of you are alive throughout.']);
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
    const open = result.stop.age + result.gapYears;
    if (result.wholeLife.runOutAge < open) {
      warn('savings-run-short', 'important', [...BAD, ', paying in as now, the savings run out at ', A('wholeLife.runOutAge'), ', before a pension can be touched at ', F(open), '.']);
    }
    if (!(result.inputs.savings > 0) && !(result.inputs.savingsIn > 0)) {
      warn('no-savings-for-gap', 'important', ['With no ISA or savings, nothing pays the years before a pension can be touched. The savings part above is what they would need.']);
    }
  }
  if (facts.partnerRetired) {
    warn('partner-stops-with-you', 'note', ["Your partner is past their State Pension age. These figures leave their money alone until you stop at ", A('stop.age'),
      ', and do not count anything they take before then.']);
  }
  if (facts.accessRises) {
    warn('access-age-rises', 'note', ['The earliest age you can take money from a pension rises from ', F(RULES.pensionAccess.before), ' to ', F(RULES.pensionAccess.from), ' on ', F('6'), ' April ',
      F(RULES.pensionAccess.changesOn.slice(0, 4)), '. Anyone not ', F(RULES.pensionAccess.before), ' by then waits until ', F(RULES.pensionAccess.from), '.']);
  }
  if (facts.savingsMostly) {
    warn('savings-fixed-growth', 'important', ['Most of the money when you stop is in savings. Once you stop, savings are grown at a fixed ', F(Math.round(RULES.savingsGrowth * 100)),
      '% a year before rising prices, whatever markets do, so for this answer that one figure matters most. Invested ISAs could do better or worse.']);
  }
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
    warn('out-of-reach', 'important', result.number === null
      ? ['No pot up to ', F(money(SAVING.potMax)), ' pays this from ', A('stop.age'), ' in ', F('9'), ' futures out of ', F('10'), '.']
      : ['No pay-in up to ', F(money(SAVING.payInCeiling)), c ? ' a month each' : ' a month', ' makes the money last from ', A('stop.age'), ' in ', F('9'), ' futures out of ', F('10'), '.']);
  }
  if (result.status === 'guaranteed-only') warn('target-below-pensions', 'note', [c ? 'Your State Pensions cover' : 'Your State Pension covers', ' what you want to spend once it starts.']);
  if (facts.capped) warn('long-plan', 'important', ['We can only test ', F(RULES.maxYears), ' years ahead, so this runs to age ', A('basis.endAge'), ', not ', A('inputs.endAge'), '.']);
  if (result.phases.some((ph) => ph.byPerson.some((b) => b.higherRate))) warn('higher-rate', 'note', ['Some of this is taxed at ', F('40'), '%. Spreading it ', c ? 'between you, or ' : '', 'over more years may lower the tax.']);
  if (c && facts.oneName) warn('one-name', 'note', ['Most of the pension is in one name, so one tax allowance is barely used.']);
  if (facts.people.some((p) => p.sp && p.spDefault)) warn('state-pension-assumed', 'note', ['This assumes the full State Pension. If yours is lower, so is the figure.']);
  if (facts.largePot) warn('large-pot', 'note', ['The tax-free part of a pension is limited to ', F(money(RULES.taxFreeLimit)), ' in total. That limit is included.']);
  if (result.number && result.number.careful > 0 && result.number.careful < RULES.smallPot) {
    warn('small-pot', 'note', ['With a pot this size, many people take it as one or a few lump sums instead of a monthly income.']);
  }
  return out;
}
