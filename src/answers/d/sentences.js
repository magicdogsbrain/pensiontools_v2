/**
 * The sentences of question D (research/v7/answer-D.md 6.2), what was assumed (6.3, a fixed order) and the warnings
 * (6.4). Every figure in a sentence is a reference into the result, so the screen can mark it; `text` is the parts
 * joined by format.js, and a test asserts the two agree. Everything here is read from the result object and a small
 * context of facts the result does not hold (`ctx`) — never from the engine.
 *
 * Plain English for someone who has stopped work (the `retired` scope of src/v7/copy/banned.js): no countdown, no
 * "when you retire", no "years to go"; ages for the future; "lasted in 9 futures out of 10" is the house phrase; "a bad
 * case" always with "(the worst 1 in 10)"; one "about" a sentence; never "will last", "safe" or "guaranteed".
 *
 * @typedef {object} Ctx
 * @property {string[]} usedDefault          paths whose value is the input list's default
 * @property {number} fullStatePensionAYear
 * @property {number} historyStartYear
 * @property {boolean} madeUpFutures         env.futureReturns (tests): the futures line is left out
 * @property {boolean} capped                the drawing years were cut at 45
 * @property {string[]} drawdown2028         who moves money into drawdown before 6 April 2028 at 55 or 56
 */
import { money, outOfTen, partsText, underNine } from '../shared/format.js';
import { shareCutPercent } from '../shared/futures.js';
import { RULES } from '../shared/rules.js';
import { statePensionAgeOf } from '../shared/schemaParts.js';
import { savingsGrowthParts } from '../shared/savingsGrowth.js';
import { taxFreeGone } from './toHousehold.js';

const M = (key) => ({ key, kind: 'money' });
const A = (key) => ({ key, kind: 'age' });
const F = (fixed) => ({ fixed: String(fixed) });
const S = (id, parts) => ({ id, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) });
const BAD_CAP = ['In a bad case (the worst ', F('1'), ' in ', F('10'), ')'];
const NINE = ['in ', F('9'), ' futures out of ', F('10')];

/** 'in only 6 futures out of 10' → parts, each count a fixed figure. */
function wordsParts(words) {
  return words.split(/(\d+)/).map((piece, i) => (i % 2 ? F(piece) : piece)).filter((p) => p !== '');
}
/** "in only 6 futures out of 10" — and "in just under 9 futures out of 10" for 85% to under 90%, so a count never reads as the careful 9. */
const lastedWords = (share) => (underNine(share) ? ['in just under ', F('9'), ' futures out of ', F('10')] : wordsParts(outOfTen(share).words));
/** The bare count after "against": "only 8", "just under 9", "9", "more than 9", "every one", "none", "fewer than 1". */
function shortCount(share) {
  const o = outOfTen(share);
  if (underNine(share)) return ['just under ', F('9')];
  if (o.words === 'in every future we tried') return ['every one'];
  if (o.words === 'in none of the futures we tried') return ['none'];
  if (o.words.startsWith('in more than')) return ['more than ', F('9')];
  if (o.words.startsWith('in fewer than')) return ['fewer than ', F('1')];
  if (o.only) return ['only ', F(o.count)];
  return [F(o.count)];
}
const VERDICT_WORD = { yes: 'yes', close: 'close', no: 'not' };
/** "Near the end age" (answer-D.md 6.4 d-end-near): the test covers this many years or fewer. */
export const END_NEAR_YEARS = 7;

/** Fills `text` from `parts` for every sentence, assumed line and warning of a result. */
export function finishTexts(result) {
  const fill = (s) => { if (s && s.parts) s.text = partsText(s.parts, result); };
  for (const s of Object.values(result.sentences || {})) (Array.isArray(s) ? s : [s]).forEach(fill);
  (result.assumed || []).forEach(fill);
  (result.warnings || []).forEach(fill);
  return result;
}

/** The facts of a result the sentences need, read from the result itself. */
export function factsOf(result, ctx = {}) {
  const inputs = result.inputs;
  const couple = inputs.household === 'couple' && Boolean(inputs.partner);
  const used = new Set(ctx.usedDefault || []);
  const people = (couple ? ['you', 'partner'] : ['you']).map((who) => {
    const p = inputs[who];
    const sp = p.statePension || { kind: 'full' };
    const fs = p.finalSalary || { has: false };
    const spAge = statePensionAgeOf(p.age, result.basis.today);
    const openAge = result.pensionOpens && typeof result.pensionOpens[who] === 'number' ? result.pensionOpens[who] : p.age;
    return {
      who, age: p.age, pot: (p.pot || 0) > 0,
      sp: sp.kind !== 'none', spDefault: sp.kind === 'full', spAge, spPaid: sp.kind !== 'none' && spAge <= p.age,
      fs: Boolean(fs.has), fsAge: fs.has ? fs.fromAge : null, fsDefault: used.has(`${who}.finalSalary.has`),
      openAge, closed: (p.pot || 0) > 0 && openAge > p.age,
      taxFreeTaken: taxFreeGone(p.taxFreeTaken), taxFreeSome: p.taxFreeTaken === 'some'
    };
  });
  const younger = Math.min(...people.map((x) => x.age));
  const incomes = people.flatMap((x) => [...(x.sp ? [{ who: x.who, age: x.spAge, at: x.spAge - x.age + younger }] : []), ...(x.fs ? [{ who: x.who, age: x.fsAge, at: x.fsAge - x.age + younger }] : [])]);
  return {
    couple, people, used, younger, incomes,
    anySavings: (inputs.savings || 0) > 0,
    anyPension: people.some((x) => x.pot),
    money: result.status === 'ok',
    endAge: result.basis.endAge,
    fullStatePensionAYear: ctx.fullStatePensionAYear || 0, historyStartYear: ctx.historyStartYear || 1871,
    madeUpFutures: Boolean(ctx.madeUpFutures), capped: Boolean(ctx.capped),
    drawdown2028: ctx.drawdown2028 || []
  };
}

/** "your State Pension and your final-salary pension": what carries on after the pots. */
function afterPhrase(facts) {
  const sps = facts.people.filter((x) => x.sp).length;
  const fss = facts.people.filter((x) => x.fs).length;
  const out = [];
  if (sps) out.push(sps === 2 ? 'your State Pensions' : 'your State Pension');
  if (fss) out.push(fss === 2 ? 'your final-salary pensions' : 'your final-salary pension');
  return out.join(' and ');
}

/** "your pot", "your pots", "your pot and savings": the money that pays in a phase. */
function potsPhrase(facts, phase) {
  const open = (x) => x.pot && !(phase && phase.byPerson.some((b) => b.who === x.who && b.locked));
  const [you, partner] = facts.people;
  const out = [];
  if (open(you) && partner && open(partner)) out.push('pots');
  else if (open(you)) out.push('pot');
  else if (partner && open(partner)) out.push("partner's pot");
  if (facts.anySavings) out.push('savings');
  return 'your ' + (out.length ? out.join(' and ') : 'savings');
}

const untilEnd = (facts) => (facts.couple ? ['until the younger of you is ', A('basis.endAge')] : ['until you are ', A('basis.endAge')]);
const runOutAt = (facts, key) => (facts.couple ? ['when the younger of you is ', A(key)] : ['at age ', A(key)]);

/** The phase lines: what pays which years, at the spend (`d.madeOf.*`, C's shape). */
function madeOfLines(result, facts) {
  const lines = [];
  const phases = result.phases || [];
  const at = (i) => `phases.${i}`;
  const from = (i) => (facts.couple ? ['From when you are ', A(`${at(i)}.ages.you.from`)] : ['From ', A(`${at(i)}.ages.you.from`)]);
  const span = (i) => (i + 1 < phases.length ? [...from(i), ' until ', A(`${at(i)}.ages.you.to`)] : from(i));
  phases.forEach((ph, i) => {
    if (ph.pensionOpen === false && ph.fromPension <= 0.005) {
      const closed = ph.byPerson.filter((b) => b.locked).map((b) => b.who);
      const whose = closed.length === 2 ? 'Your pensions' : closed[0] === 'partner' ? "Your partner's pension" : 'Your pension';
      lines.push(S('d.madeOf.locked', [...span(i), ': ', M(`${at(i)}.shown.takeHome`), ' a month, all from your savings. ', whose, " can't be touched until then."]));
    } else {
      const items = [];
      const sp = ph.byPerson.filter((b) => b.statePension > 0).length === 2 ? 'State Pensions' : 'State Pension';
      if (ph.shown.statePension > 0) items.push([M(`${at(i)}.shown.statePension`), ' ', sp]);
      if (ph.shown.finalSalary > 0) items.push([M(`${at(i)}.shown.finalSalary`), ' final-salary pension']);
      if ((ph.shown.fromWork || 0) > 0) items.push([M(`${at(i)}.shown.fromWork`), ' from work']);
      const potsItem = ph.shown.fromPots > 0 ? [M(`${at(i)}.shown.fromPots`), ' from ', potsPhrase(facts, ph)] : null;
      if (!items.length && potsItem) {
        lines.push(S('d.madeOf.pots', phases.length === 1 ? ['All of it comes from ', potsPhrase(facts, ph), '.'] : [...span(i), ': ', M(`${at(i)}.shown.takeHome`), ' a month, all from ', potsPhrase(facts, ph), '.']));
      } else if (items.length || potsItem) {
        if (potsItem) items.push(potsItem);
        const parts = [];
        items.forEach((it, k) => { if (k > 0) parts.push(' + '); parts.push(...it); });
        lines.push(S('d.madeOf.mixed', [...(phases.length === 1 ? [] : [...span(i), ': ']), ...parts, '.']));
      } else {
        lines.push(S('d.madeOf.none', [...span(i), ': nothing yet.']));
      }
    }
    if (ph.tax >= 0.5) lines.push(S('d.madeOf.tax', ['Tax of ', M(`${at(i)}.tax`), ' a month is already taken off.']));
  });
  return lines;
}

/**
 * The sentences of a result (status 'ok', 'guaranteed-only' or 'none').
 * @param {object} result   the result so far: every figure filled in
 * @param {object} facts    factsOf(result, ctx)
 */
export function sentencesFor(result, facts) {
  const c = facts.couple;
  const out = {};
  const yes = result.verdict === 'yes';
  const lasts = result.runOutAge >= result.basis.endAge;

  if (result.status === 'none') {
    out.none = S('d.none', ['With no pot, no savings and no pension income there is nothing to test here. If your money is in ISAs or cash, put it under savings.']);
    return out;
  }
  // the headline: a verdict at the spend (answer-D.md 3.4), word for word A's stop-now row
  out.head = yes ? S('d.head.yes', ['Yes — ', M('spend.perMonth'), ' a month lasted'])
    : result.verdict === 'close' ? S('d.head.close', ['Close — ', M('spend.perMonth'), ' a month is tight'])
      : S('d.head.no', ['Not at ', M('spend.perMonth'), ' a month on these figures']);
  out.sub = S('d.sub', [c ? 'after tax between you, going up with prices, ' : 'after tax, going up with prices, ', ...untilEnd(facts)]);
  out.line = S(underNine(result.lasted) && !yes ? 'd.line.justUnder' : 'd.line',
    ['Spending ', M('spend.perMonth'), ' a month after tax, your money lasted ', ...untilEnd(facts), ' ', ...lastedWords(result.lasted), '.']);
  // the bad case; what carries on after the money has run out
  if (lasts) out.bad = S('d.bad.lasts', [...BAD_CAP, ' it still lasted ', ...untilEnd(facts), '.']);
  else {
    const after = afterPhrase(facts);
    const later = facts.incomes.filter((x) => x.at > result.runOutAge);
    const once = !after ? [] : !later.length ? [] : facts.incomes.length === 1 ? [' once it starts at ', F(later[0].age)] : [' once they have all started'];
    out.bad = S('d.bad', [...BAD_CAP, ' it would run out ', ...runOutAt(facts, 'runOutAge'), '.',
      ...(after && result.guaranteed.monthlyAfterTax > 0 ? [' After that you would have about ', M('guaranteed.monthlyAfterTax'), ' a month from ', after, ...once, '.'] : [])]);
  }
  // the careful amount beside the spend (3.4): more, about, or less — never contradicting the verdict
  const h = result.headroom || { kind: 'about' };
  if (result.status === 'ok') {
    if (h.kind === 'more') out.headroom = S('d.more', ['You could spend about ', M('headroom.perMonth'), ' a month more. About ', M('monthly.careful'), ' a month lasted ', ...NINE, '.']);
    else if (h.kind === 'less') out.headroom = S('d.less', ['About ', M('monthly.careful'), ' a month lasted ', ...NINE, '. That is about ', M('headroom.perMonth'), ' a month less than you spend now.']);
    else out.headroom = S('d.about', ['What you spend is about what lasted ', ...NINE, '.']);
    // "Could I spend more?" (3.5): the band in full
    out.middling = S('d.middling', ['About ', M('monthly.middling'), ' a month lasted in ', F('5'), ' futures out of ', F('10'), '. ',
      ...(result.runOutAgeAt.middling >= result.basis.endAge ? [...BAD_CAP, ' it still lasted ', ...untilEnd(facts), '.'] : [...BAD_CAP, ' it would run out ', ...runOutAt(facts, 'runOutAgeAt.middling'), '.'])]);
    out.good = S('d.good', ['In a good case (the best ', F('1'), ' in ', F('10'), ') about ', M('monthly.good'), ' a month lasted.']);
  } else {
    out.nothing = S('d.nothing', ['There is no pot to draw on, so this is ', afterPhrase(facts) || 'your pension income', ' only: ', M('guaranteed.monthlyAfterTax'), ' a month after tax once it has all started.']);
  }
  out.madeOf = madeOfLines(result, facts);

  // "Would some work help?" (3.6)
  const w = result.work;
  if (w) {
    const wLasts = w.runOutAge >= result.basis.endAge;
    out.work = S('d.work', ['Working until you are ', A('work.toAge'), ' on ', M('work.yearly'), ' a year before tax, ', M('spend.perMonth'), ' a month lasted ',
      ...lastedWords(w.lasted), ', against ', ...shortCount(result.lasted), ' without it.']);
    out.workBad = wLasts && lasts ? S('d.work.bad.both', [...BAD_CAP, ' it still lasted ', ...untilEnd(facts), ', with or without the work.'])
      : wLasts ? S('d.work.bad.lasts', [...BAD_CAP, ' it still lasted ', ...untilEnd(facts), ', instead of running out ', ...runOutAt(facts, 'runOutAge'), '.'])
        : S('d.work.bad', [...BAD_CAP, ' it would run out ', ...runOutAt(facts, 'work.runOutAge'), lasts ? '' : ' instead of ', ...(lasts ? [] : [A('runOutAge')]), '.']);
    out.workCareful = yes
      ? S('d.work.notNeeded', [M('spend.perMonth'), ' a month already lasted ', ...NINE, '. That work would let you spend about ', M('work.extra'), ' a month more.'])
      : S('d.work.careful', ['With that work, about ', M('work.monthly.careful'), ' a month lasted ', ...NINE, '.']);
    out.workRows = (w.byYears || []).map((r, i) => S('d.work.row', ['Until ', A(`work.byYears.${i}.toAge`), ': lasted ', ...lastedWords(r.lasted), '; ',
      ...(r.runOutAge >= result.basis.endAge ? ['in a bad case (the worst ', F('1'), ' in ', F('10'), ') it still lasted ', ...untilEnd(facts), '.']
        : ['in a bad case (the worst ', F('1'), ' in ', F('10'), ') it would run out ', ...runOutAt(facts, `work.byYears.${i}.runOutAge`), '.'])]));
  }

  // "What if shares fell by a fifth?" (3.7)
  const f = result.fall;
  if (f) {
    const fLasts = f.runOutAge >= result.basis.endAge;
    out.fall = S('d.fall', ['If shares fell by a fifth tomorrow and you kept the same mix, ', M('spend.perMonth'), ' a month lasted ', ...lastedWords(f.lasted), '. ',
      ...(fLasts ? [...BAD_CAP, ' it still lasted ', ...untilEnd(facts), '.'] : [...BAD_CAP, ' it would run out ', ...runOutAt(facts, 'fall.runOutAge'), '.'])]);
    out.fallCareful = f.drop > 0
      ? S('d.fall.careful', ['After such a fall, about ', M('fall.monthly.careful'), ' a month lasted ', ...NINE, ': ', M('fall.drop'), ' a month less than now.'])
      : S('d.fall.careful.same', ['After such a fall, about ', M('fall.monthly.careful'), ' a month lasted ', ...NINE, ', the same as now.']);
    const after = afterPhrase(facts);
    if (after) out.fallUnchanged = S('d.fall.unchanged', [after.charAt(0).toUpperCase() + after.slice(1), ' would not change.']);
  }

  // "Now:" for Before / Now
  if (result.status === 'ok') {
    const count = lastedWords(result.lasted).map((x, i) => (i === 0 && typeof x === 'string' ? x.replace(/^in /, '') : x)).filter((x) => x !== '');
    out.change = S('d.change', ['Now: ', VERDICT_WORD[result.verdict], ' at ', M('spend.perMonth'), ' a month, ', ...count, '.']);
  }
  return out;
}

const RISK_WORDS = {
  cautious: 'Cautious, about a third in shares, the rest in bonds and cash.',
  balanced: 'Balanced, about half in shares, the rest in bonds and cash.',
  adventurous: 'Adventurous, about two thirds in shares, the rest in bonds and cash.'
};
const LEVEL_WORDS = { minimum: 'Minimum', moderate: 'Moderate', comfortable: 'Comfortable' };
const chargesParts = (pct) => ['Charges of ', F(String(pct)), '% a year come off the money in funds and cash; not off State Pension or final-salary pension.'];

/** What was assumed (answer-D.md 6.3), in a fixed order, only the lines that apply. A line with source 'default' always names its field. */
export function assumedFor(result, facts) {
  const out = [];
  const inputs = result.inputs;
  const used = facts.used;
  const src = (field) => (used.has(field) ? 'default' : 'entered');
  const line = (id, field, source, value, parts) => { out.push({ id, field, source, value, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) }); };
  const c = facts.couple;
  const suffix = (x) => (x.who === 'you' ? '' : '-partner');

  line('d-from-today', null, 'rule', null, ['Everything is worked out from today, on what you have today.']);
  if (inputs.spend.kind === 'level') {
    line('spend-level', 'spend.level', 'entered', inputs.spend.level, [LEVEL_WORDS[inputs.spend.level], ': ', M('spend.perMonth'), ' a month for ', c ? 'a couple' : 'one person', ', from the Retirement Living Standards.']);
  }
  line('d-spend', 'spend.amount', 'entered', result.spend.perMonth, ['You spend ', M('spend.perMonth'), ' a month after tax, going up with prices, ', ...untilEnd(facts), '. No cuts in bad years.']);
  line('d-tax-year', null, 'rule', null, ['This tax year is worked out as if it started today.']);
  const spMonthly = money(facts.fullStatePensionAYear / 12);
  for (const x of facts.people) {
    const kindField = `${x.who}.statePension.kind`;
    if (x.sp && x.spDefault) {
      const whose = x.who === 'you' ? 'The full State Pension' : 'For your partner, the full State Pension';
      const check = x.who === 'you' ? ' Yours may be different — check your forecast.' : ' Theirs may be different — check their forecast.';
      line('state-pension-full' + suffix(x), kindField, src(kindField), facts.fullStatePensionAYear, x.spPaid ? [whose, ' of ', F(spMonthly), ' a month.', check] : [whose, ' of ', F(spMonthly), ' a month from age ', F(x.spAge), '.', check]);
    }
    if (x.sp && !x.spPaid) line('state-pension-age' + suffix(x), null, 'rule', x.spAge, x.who === 'you' ? ['Your State Pension age of ', F(x.spAge), ' comes from your age.'] : ["Your partner's State Pension age of ", F(x.spAge), ' comes from their age.']);
  }
  // the tax-free part (answer-D.md 3.2): answered, never guessed
  for (const x of facts.people.filter((p) => p.pot)) {
    const field = `${x.who}.taxFreeTaken`;
    if (x.taxFreeSome) line('d-tax-free-some' + suffix(x), field, 'entered', 'some', [x.who === 'you' ? "You've had some of the tax-free part of your pension: " : "Your partner has had some of the tax-free part of their pension: ", "we've counted it as all taken, which is the cautious side."]);
    else if (x.taxFreeTaken) line('tax-free-taken' + suffix(x), field, 'entered', 'yes', x.who === 'you' ? ['You have already had the tax-free part of your pension, so everything taken from it is taxed.'] : ["Your partner has already had the tax-free part of their pension, so everything taken from it is taxed."]);
    else line('quarter-tax-free' + suffix(x), field, 'entered', 'no', x.who === 'you' ? ['A quarter of each withdrawal from your pension is tax-free.'] : ["A quarter of each withdrawal from your partner's pension is tax-free."]);
  }
  for (const x of facts.people.filter((p) => p.closed)) {
    line('pension-closed-until' + suffix(x), null, 'rule', x.openAge, x.who === 'you'
      ? ['Your pension is left alone until you are ', A('pensionOpens.you'), '; your savings pay until then.']
      : ["Your partner's pension is left alone until they are ", A('pensionOpens.partner'), '; the rest of the money pays until then.']);
  }
  if (facts.money) line('risk-drawing', 'risk', src('risk'), inputs.risk, ['Your money is held ', RISK_WORDS[inputs.risk].charAt(0).toLowerCase() + RISK_WORDS[inputs.risk].slice(1)]);
  if (facts.money) line('charges', 'charge', src('charge'), inputs.charge, chargesParts(inputs.charge));
  if (result.basis.endAgeDefaulted && inputs.endAge > 95) line('d-end-age', 'endAge', 'default', inputs.endAge, ['Your money is tested ', ...untilEnd(facts), ', five years on from ', c ? 'the younger of you' : 'your age today', '.']);
  else line('plan-to', 'endAge', src('endAge'), inputs.endAge, c ? ['The money needs to last until the younger of you is ', A('basis.endAge'), '.'] : ['The money needs to last until you are ', A('basis.endAge'), '.']);
  line('todays-prices', null, 'rule', null, ["All figures are in today's prices."]);
  for (const x of facts.people) {
    if (x.fsDefault) line('no-final-salary' + suffix(x), `${x.who}.finalSalary.has`, 'default', false, x.who === 'you' ? ['No final-salary pension.'] : ['Your partner has no final-salary pension.']);
  }
  const fss = facts.people.filter((x) => x.fs);
  if (fss.length === 2) line('final-salary-rises', null, 'rule', 'pricesCapped5', ['Your final-salary pensions rise with prices, up to ', F('5'), '% a year.']);
  else if (fss.length === 1) line('final-salary-rises', null, 'rule', 'pricesCapped5', [fss[0].who === 'you' ? 'Your final-salary pension' : "Your partner's final-salary pension", ' rises with prices, up to ', F('5'), '% a year.']);
  if (c) {
    if (used.has('partner.pot')) line('partner-no-pot', 'partner.pot', 'default', 0, ['Your partner has no pension pot.']);
    if (facts.anySavings) line('savings-split', 'savings', 'rule', null, ['Your savings are split evenly between you.']);
  }
  if (facts.anySavings) line('savings-growth', 'isaGrowth', src('isaGrowth'), inputs.isaGrowth, savingsGrowthParts(inputs.isaGrowth));
  if (result.work) line('d-work-tax', null, 'rule', null, ['Pay from work is taxed with your other income. National Insurance is not included.']);
  if (result.fall) line('d-fall', null, 'rule', null, ['In "What if shares fell?", shares fall by a fifth tomorrow, you keep the same mix, and the futures then run as usual.']);
  if (c) line('both-alive', null, 'rule', null, ['Both of you are alive throughout.']);
  line('tax-rules', null, 'rule', RULES.taxYear, ['Tax rules for ', F(RULES.taxYear), ' in England, Wales and Northern Ireland, with allowances rising with prices; the ', F(money(RULES.taperFrom)), ' point where the allowance starts to be withdrawn stays fixed.']);
  if (facts.money && !facts.madeUpFutures) {
    line('futures', null, 'rule', result.basis.futures, ['Tested against ', F(money(result.basis.futures).slice(1)), ' possible futures, each pieced together from stretches of US share returns and US price rises since ', F(facts.historyStartYear),
      '. Share returns are cut by ', F(shareCutPercent()), '% a year to stand for shares around the world; bonds and cash are worked out from each future\'s markets.']);
  }
  return out;
}

/** The warnings (answer-D.md 6.4), in a fixed order, only those that apply. */
export function warningsFor(result, facts) {
  const out = [];
  const warn = (id, severity, parts) => { out.push({ id, severity, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) }); };
  const c = facts.couple;
  const endAge = result.basis.endAge;

  for (const x of facts.people.filter((p) => p.closed)) {
    warn('pension-closed' + (x.who === 'you' ? '' : '-partner'), 'important', x.who === 'you'
      ? ["You can't take money from your pension until you are ", A('pensionOpens.you'), '. Until then your ISA and savings pay.']
      : ["Your partner can't take money from their pension until they are ", A('pensionOpens.partner'), '. Until then the rest of the money pays.']);
  }
  const closed = facts.people.filter((p) => p.closed);
  if (closed.length && result.status === 'ok') {
    const first = closed.reduce((b, x) => (!b || x.openAge - x.age < b.openAge - b.age ? x : b), null);
    if (!facts.anySavings) warn('no-savings-for-gap', 'important', ['You have nothing outside a pension to live on until ', first.who === 'you' ? 'you are ' : 'your partner is ', A(`pensionOpens.${first.who}`), '.']);
    else if (result.verdict !== 'yes' && result.runOutAge < facts.younger + (first.openAge - first.age)) {
      warn('d-savings-run-short', 'important', [...BAD_CAP, ' your savings run out ', ...runOutAt(facts, 'runOutAge'), ', before ', first.who === 'you' ? 'you can touch your pension at ' : 'your partner can touch their pension at ', A(`pensionOpens.${first.who}`), '.']);
    }
  }
  // 55 or 56 on 6 April 2028 with the tax-free part not all taken (answer-D.md 6.4 d-2028): the 2028 rise is not modelled
  const d2028 = (facts.drawdown2028 || []).filter((who) => facts.people.some((x) => x.who === who && x.pot && !x.taxFreeTaken));
  if (d2028.length) warn('d-2028', 'important', ['Move into drawdown what you will need before ', F(RULES.pensionAccess.from), ' by ', F('5'), ' April ', F('2028'), ': after that, nothing new can be taken from your pension until you are ', F(RULES.pensionAccess.from), '.']);
  if (facts.capped) warn('long-plan', 'important', ['We can only test ', F(RULES.maxYears), ' years ahead, so this runs to age ', A('basis.endAge'), ', not ', A('inputs.endAge'), '.']);
  if (result.status === 'ok' && (result.phases || []).some((ph) => ph.byPerson.some((b) => b.higherRate))) {
    warn('higher-rate', 'note', ['Some of this is taxed at ', F('40'), '%. Spreading it ', c ? 'between you, or ' : '', 'over more years may lower the tax.']);
  }
  if (c && result.status === 'ok' && (result.phases || []).length) {
    const you = result.inputs.you.pot || 0, partner = result.inputs.partner.pot || 0, total = you + partner;
    const first = result.phases[0];
    const other = (who) => first.byPerson.find((b) => b.who !== who);
    const share = [{ who: 'you', pension: you }, { who: 'partner', pension: partner }];
    if (total > 0 && share.some((x) => x.pension / total > 0.8 && other(x.who) && (other(x.who).statePension + other(x.who).finalSalary) * 12 < RULES.personalAllowance)) {
      warn('one-name', 'note', ['Most of the pension is in one name, so one tax allowance is barely used.']);
    }
  }
  if (facts.people.some((x) => x.sp && x.spDefault)) warn('state-pension-assumed', 'note', ['This assumes the full State Pension. If yours is lower, so is the figure.']);
  if (result.status === 'ok' && facts.anyPension && (result.inputs.you.pot || 0) + (c ? result.inputs.partner.pot || 0 : 0) < RULES.smallPot) {
    warn('small-pot', 'note', ['With a pot this size, many people take it as one or a few lump sums instead of a monthly income.']);
  }
  if (result.work && result.work.yearly > 0) warn('d-work-mpaa', 'note', ['Once you have taken money from a pension that is taxed, the most you can pay into pensions and still get tax back is ', F(money(RULES.moneyPurchaseAllowance)), ' a year.']);
  // near the end age (6.4 d-end-near): the test covers seven years or fewer
  if (endAge - facts.younger <= END_NEAR_YEARS) warn('d-end-near', 'note', ['Your money is tested ', ...untilEnd(facts), '. You can test to a later age under more detail.']);
  return out;
}

/**
 * The sentences, what was assumed and the warnings of a result, written onto it and filled in. The result must hold
 * every figure already.
 */
export function textsFor(result, ctx = {}) {
  const facts = factsOf(result, ctx);
  result.sentences = sentencesFor(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  return finishTexts(result);
}
