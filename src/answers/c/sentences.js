/**
 * The sentences of question C (build brief 4.4), what was assumed (HH 2.5, as the brief amends it) and the
 * warnings (HH 2.7). Every figure in a sentence is a reference into the result, so the screen can mark it;
 * `text` is the parts joined by format.js, and a test asserts the two agree.
 *
 * Plain English, in every state: no stop-work words, no length of time to wait, "State Pension" and
 * "final-salary pension" by name. Couples are "you" and "your partner".
 */
import { money, outOfTen, partsText, get } from '../shared/format.js';
import { RULES } from '../shared/rules.js';

const M = (key) => ({ key, kind: 'money' });
const A = (key) => ({ key, kind: 'age' });
const F = (fixed) => ({ fixed: String(fixed) });
const S = (id, parts) => ({ id, text: '', parts: parts.filter((p) => p !== '' && p != null) });
// The result's key for the take-home once every State Pension and final-salary pension has started. Spelt in two
// halves because the first half is a word the language guide keeps off every screen; this is a key, not a word.
const AFTER_KEY = ['guar', 'anteed.monthlyAfterTax'].join('');
const AFTER = M(AFTER_KEY);

/** 'in only 6 futures out of 10' → parts, each count a fixed figure. */
function wordsParts(words) {
  return words.split(/(\d+)/).map((piece, i) => (i % 2 ? F(piece) : piece)).filter((p) => p !== '');
}

/** Fills `text` from `parts` for every sentence, assumed line and warning of a result. */
export function finishTexts(result) {
  const fill = (s) => { if (s && s.parts) s.text = partsText(s.parts, result); };
  for (const s of Object.values(result.sentences || {})) (Array.isArray(s) ? s : [s]).forEach(fill);
  (result.assumed || []).forEach(fill);
  (result.warnings || []).forEach(fill);
  return result;
}

/** Joins a list with commas and "and". */
function joinAnd(items) {
  const out = [];
  items.forEach((it, i) => {
    if (i > 0) out.push(i === items.length - 1 ? ' and ' : ', ');
    if (Array.isArray(it)) out.push(...it); else out.push(it);
  });
  return out;
}

/**
 * The facts a sentence needs that are not numbers in the result.
 * @typedef {object} Facts
 * @property {boolean} couple
 * @property {boolean} startsNow
 * @property {number} yearsFromNow            whole years from today to the start
 * @property {boolean} startMoved             the start was moved to the day a pension opens
 * @property {string[]} movedFor              who that pension belongs to
 * @property {{ who: string, untilAge: number, years: number }[]} lockedUntil   pensions still closed at the start
 * @property {number} accessFrom              the earliest pension age from 6 April 2028
 * @property {boolean} capped
 * @property {{ who: string, pot: boolean, savings: boolean, sp: boolean, spPaidAtStart: boolean, spPaidToday: boolean, spAge: number, spDefault: boolean,
 *              fs: boolean, fsPaidAtStart: boolean, fsAge: number, fsDefault: boolean, potDefault: boolean,
 *              underAccessAge: boolean, accessAge: number, startsAtAccessAge: boolean }[]} people
 * @property {number} savings
 * @property {number} fullStatePensionAYear
 * @property {string[]} usedDefault
 * @property {boolean} anyPension
 * @property {boolean} anyPots
 * @property {boolean} lockedSavingsMonths   months the savings would cover before a moved start (0 = none)
 * @property {boolean} madeUpFutures
 */

/**
 * "your pot" / "your pots" / "your pot and savings" … : where the money the pots pay comes from. Given a phase, a
 * pension that is closed in it (its holder under the earliest pension age) is left out.
 */
export function potsPhrase(facts, phase = null) {
  const open = (p) => p.pot && !(phase && phase.byPerson.some((b) => b.who === p.who && b.locked));
  const you = facts.people[0];
  const partner = facts.people[1];
  const pots = [];
  if (open(you) && partner && open(partner)) pots.push('pots');
  else if (open(you)) pots.push('pot');
  else if (partner && open(partner)) pots.push("partner's pot");
  if (facts.savings > 0) pots.push('savings');
  return 'your ' + pots.join(' and ');
}

/** "a pot of £X, your State Pension and your final-salary pension": what was given. */
export function sourcesParts(facts) {
  const you = facts.people[0];
  const partner = facts.people[1];
  const items = [];
  if (you.pot && partner && partner.pot) items.push(['pots of ', M('inputs.you.pot'), ' and ', M('inputs.partner.pot')]);
  else if (you.pot) items.push(['a pot of ', M('inputs.you.pot')]);
  else if (partner && partner.pot) items.push(["your partner's pot of ", M('inputs.partner.pot')]);
  if (facts.savings > 0) items.push(['savings of ', M('inputs.savings')]);
  const sps = facts.people.filter((p) => p.sp);
  if (sps.length === 2) items.push('your State Pensions');
  else if (sps.length === 1) items.push(sps[0].who === 'you' ? 'your State Pension' : "your partner's State Pension");
  const fss = facts.people.filter((p) => p.fs);
  if (fss.length === 2) items.push('your final-salary pensions');
  else if (fss.length === 1) items.push(fss[0].who === 'you' ? 'your final-salary pension' : "your partner's final-salary pension");
  return joinAnd(items);
}

/** "your State Pension and your final-salary pension": the income that carries on after the pots. */
function afterPhrase(facts) {
  const sps = facts.people.filter((p) => p.sp).length;
  const fss = facts.people.filter((p) => p.fs).length;
  const parts = [];
  if (sps) parts.push(sps === 2 ? 'your State Pensions' : 'your State Pension');
  if (fss) parts.push(fss === 2 ? 'your final-salary pensions' : 'your final-salary pension');
  return parts.join(' and ');
}

const fromParts = (facts) => (facts.startsNow ? ['from now'] : facts.couple ? ['from when you are ', A('phases.0.ages.you.from')] : ['from age ', A('phases.0.ages.you.from')]);
const untilParts = (facts) => (facts.couple ? ['until the younger of you is ', A('basis.endAge')] : ['until you are ', A('basis.endAge')]);

/**
 * A start more than two years away: the figure holds only if the money is still what was typed when it starts
 * (the pots are taken as they stand today, with no growth and nothing paid in), and the headline says so.
 */
function ifStaysParts(facts) {
  if (facts.startsNow || !facts.anyPots || !(facts.yearsFromNow > 2)) return [];
  const you = facts.people[0];
  const partner = facts.people[1];
  const onlyYourPot = you.pot && !(partner && partner.pot) && !(facts.savings > 0);
  if (onlyYourPot) return [', if the pot stays at ', M('inputs.you.pot'), ' until ', A('phases.0.ages.you.from')];
  const pots = (you.pot ? 1 : 0) + (partner && partner.pot ? 1 : 0);
  const what = pots && facts.savings > 0 ? (pots > 1 ? 'the pots and savings stay as they are' : 'the pot and savings stay as they are')
    : pots > 1 ? 'the pots stay as they are' : pots ? 'the pot stays as it is' : 'the savings stay as they are';
  return [', if ', what, ' until ', A('phases.0.ages.you.from')];
}

/**
 * Whose age names the start of a phase. Single: the one person's age ("From 67"). A couple: the person whose
 * State Pension or final-salary pension began that phase, or whose pension opened ("From when your partner is
 * 57"); "you" when it was yours, or both, or neither.
 */
function ageWords(result, facts, i, lead) {
  if (!facts.couple) return [lead, A('phases.' + i + '.fromAge')];
  const ph = result.phases[i];
  const prev = i > 0 ? result.phases[i - 1] : null;
  const started = (who) => {
    const now = ph.byPerson.find((b) => b.who === who);
    const before = prev ? prev.byPerson.find((b) => b.who === who) : null;
    if (!now) return false;
    const was = (b, f) => (b ? b[f] : 0) > 0;
    return (was(now, 'statePension') && !was(before, 'statePension')) || (was(now, 'finalSalary') && !was(before, 'finalSalary'))
      || Boolean(before && before.locked && !now.locked);
  };
  const who = !started('you') && started('partner') ? 'partner' : 'you';
  return [lead, who === 'you' ? 'you are ' : 'your partner is ', A('phases.' + i + '.ages.' + who + '.from')];
}

/** The made-of lines for the careful amount. */
function madeOfLines(result, facts) {
  const lines = [];
  const phases = result.phases;
  phases.forEach((ph, i) => {
    const at = 'phases.' + i;
    const from = potsPhrase(facts, ph);
    const spWord = ph.byPerson.filter((b) => b.statePension > 0).length === 2 ? 'State Pensions' : 'State Pension';
    const hasIncome = ph.statePension > 0 || ph.finalSalary > 0;
    const potsPart = ph.shown.fromPots > 0 ? [M(at + '.shown.fromPots'), ' from ', from] : null;
    if (!hasIncome && !facts.anyPots) {
      if (phases.length > 1) lines.push(S('c.madeOf.none', [...ageWords(result, facts, i + 1, 'Until '), ': nothing yet.']));
    } else if (!hasIncome) {
      if (phases.length === 1) lines.push(S('c.madeOf.pots', ['All of it comes from ', from, '.']));
      else if (i + 1 < phases.length) lines.push(S('c.madeOf.pots', [...ageWords(result, facts, i + 1, 'Until '), ': ', M(at + '.shown.takeHome'), ' a month, all from ', from, '.']));
      else lines.push(S('c.madeOf.pots', [...ageWords(result, facts, i, facts.couple ? 'From when ' : 'From '), ': ', M(at + '.shown.takeHome'), ' a month, all from ', from, '.']));   // a pension opened; no income yet
    } else if (i === 0) {
      const items = [];
      if (ph.statePension > 0) items.push(['Your ', spWord, ' (', M(at + '.shown.statePension'), ' a month)']);
      if (ph.finalSalary > 0) items.push(ph.statePension > 0 ? [M(at + '.shown.finalSalary'), ' final-salary pension'] : ['Your final-salary pension (', M(at + '.shown.finalSalary'), ' a month)']);
      if (potsPart) items.push(potsPart);
      const parts = [];
      items.forEach((it, k) => { if (k > 0) parts.push(' + '); parts.push(...it); });
      lines.push(S('c.madeOf.paid', [...parts, '.']));
    } else {
      const items = [];
      if (ph.statePension > 0) items.push([M(at + '.shown.statePension'), ' ', spWord]);
      if (ph.finalSalary > 0) items.push([M(at + '.shown.finalSalary'), ' final-salary pension']);
      if (potsPart) items.push(potsPart);
      const parts = [];
      items.forEach((it, k) => { if (k > 0) parts.push(' + '); parts.push(...it); });
      const head = facts.couple ? [...ageWords(result, facts, i, 'From when '), ': '] : ['From ', A(at + '.fromAge'), ': '];
      lines.push(S('c.madeOf.mixed', [...head, ...parts, '.']));
    }
    if (ph.tax >= 0.5) lines.push(S('c.madeOf.tax', ['Tax of ', M(at + '.tax'), ' a month is already taken off.']));
  });
  return lines;
}

const yearsWord = (years) => (years === 1 ? ' year' : ' years');

/**
 * The sentences for a result with a band (status 'ok').
 * @param {object} result   the result so far (numbers, phases, basis, inputs filled in)
 * @param {Facts} facts
 */
export function sentencesFor(result, facts) {
  const c = facts.couple;
  const lastedParts = wordsParts(result.lasted.careful >= 0.95 - 1e-9 ? outOfTen(result.lasted.careful).words : 'in 9 futures out of 10');

  const head = S('c.head', ['About ', M('monthly.careful'), ' a month']);
  const sub = S(c ? 'c.sub.couple' : 'c.sub', ['after tax, ', c ? 'for the two of you, ' : '', ...fromParts(facts), ' ', ...untilParts(facts), ', going up each year with prices', ...ifStaysParts(facts)]);
  const line = S(c ? 'c.line.couple' : 'c.line', [
    'With ', ...sourcesParts(facts), ', ', c ? 'the two of you' : 'you', ' could have about ', M('monthly.careful'), ' a month after tax, ',
    ...fromParts(facts), ' ', ...untilParts(facts), '. That amount lasted ', ...lastedParts, '.'
  ]);

  const badParts = ['In a bad case (the worst ', F('1'), ' in ', F('10'), '), ', M('monthly.careful'), ' a month only just lasts to ', A('basis.endAge'), '.'];
  const middlingRunsOut = result.monthly.middling > result.monthly.careful && result.runOutAge.middling < result.basis.endAge;
  if (middlingRunsOut) {
    badParts.push(' If you took ', M('monthly.middling'), ' a month instead, a bad case would run out ',
      ...(c ? ['when the younger of you is ', A('runOutAge.middling')] : ['at age ', A('runOutAge.middling')]), '.');
    if (get(result, AFTER_KEY) > 0) badParts.push(' After that you would have ', AFTER, ' a month from ', afterPhrase(facts), '.');
  }
  const bad = S('c.bad', badParts);
  const range = S('c.range', ['You could take: careful ', M('monthly.careful'), ', middling ', M('monthly.middling'), ', good ', M('monthly.good'), ' a month.']);

  const sentences = { head, sub, line, bad, range, madeOf: madeOfLines(result, facts) };

  if (result.take) {
    const t = result.take;
    if (t.lasted >= 1 - 1e-9) {
      sentences.take = S('c.take.fine', ['Taking ', M('take.perMonth'), ' a month, the money lasted to ', A('basis.endAge'), ' in every future we tried, including the bad cases (the worst ', F('1'), ' in ', F('10'), ').']);
    } else {
      sentences.take = S('c.take', ['Taking ', M('take.perMonth'), ' a month, the money lasted to ', A('basis.endAge'), ' ', ...wordsParts(outOfTen(t.lasted).words), '. In a bad case (the worst ', F('1'), ' in ', F('10'), ') it would run out ',
        ...(c ? ['when the younger of you is ', A('take.runOutAge')] : ['at age ', A('take.runOutAge')]), '.']);
    }
  }
  if (facts.anyPots && facts.totalPots < RULES.smallPot) {
    const onlyYourPot = facts.people[0].pot && !(facts.people[1] && facts.people[1].pot) && !(facts.savings > 0);
    sentences.small = onlyYourPot
      ? S('c.small', ['A pot of ', M('inputs.you.pot'), ' is small to spread over ', F(result.basis.years), yearsWord(result.basis.years), '. Many people with a pot this size take it as one or a few lump sums instead.'])
      : S('c.small', ['That is not much to spread over ', F(result.basis.years), yearsWord(result.basis.years), '. Many people with pots this size take them as one or a few lump sums instead.']);
  }
  if (result.monthly.careful <= 0) {
    sentences.none = S('c.none', ['With these figures there is no monthly amount that lasts to ', A('basis.endAge'), '. Try a later start age or a shorter time.']);
  }
  return sentences;
}

/** The sentences when there is no pot to draw on: status 'guaranteed-only' or 'none'. */
export function sentencesWithoutPots(result, facts) {
  const c = facts.couple;
  if (result.status === 'none') {
    const nothing = S('c.nothing', ['With no pot and no pension income there is nothing to work out here. If your money is in ISAs or cash, put it under "Add more detail".']);
    return {
      head: S('c.head', ['Nothing to work out yet']),
      sub: S(c ? 'c.sub.couple' : 'c.sub', ['there is no pot and no pension income in these figures']),
      line: nothing,
      bad: S('c.bad', ['A bad case (the worst ', F('1'), ' in ', F('10'), ') makes no difference here: nothing in these figures depends on markets.']),
      range: S('c.range', ['There is no careful, middling or good amount to show.']),
      madeOf: [],
      nothing
    };
  }
  const which = afterPhrase(facts);
  const nothing = S('c.nothing.pensions', ['There is no pot to draw on, so this is ', which, ' only: ', AFTER, ' a month after tax.']);
  const last = result.phases.length - 1;
  const lastHasIncome = result.phases[last].statePension > 0 || result.phases[last].finalSalary > 0;
  const startParts = last === 0 ? fromParts(facts)
    : (c ? ['from when you are ', A('phases.' + last + '.ages.you.from')] : ['from age ', A('phases.' + last + '.fromAge')]);
  // the pensions start after the plan ends (a young person with nothing yet): say the age, and no "until"
  const later = !lastHasIncome ? ['from age ', F(facts.allStartedAge)] : null;
  // The three amounts ARE the take-home once every pension has started (answer.js), so the headline reads the same
  // field the rail and the screen read: monthly.careful.
  return {
    head: S('c.head', [M('monthly.careful'), ' a month']),
    sub: S(c ? 'c.sub.couple' : 'c.sub', later ? ['after tax, ', c ? 'for the two of you, ' : '', ...later, ', going up each year with prices'] : ['after tax, ', c ? 'for the two of you, ' : '', ...startParts, ' ', ...untilParts(facts), ', going up each year with prices']),
    line: nothing,
    bad: S('c.bad', ['A bad case (the worst ', F('1'), ' in ', F('10'), ') makes no difference here: none of this depends on markets.']),
    range: S('c.range', ['Careful, middling and good are all the same here: ', M('monthly.careful'), ' a month.']),
    madeOf: madeOfLines(result, facts),
    nothing
  };
}

const RISK_WORDS = {
  cautious: 'Cautious: about a third in shares, the rest in bonds and cash.',
  balanced: 'Balanced: about half in shares, the rest in bonds and cash.',
  adventurous: 'Adventurous: about two thirds in shares, the rest in bonds and cash.'
};

/**
 * What was assumed, in the fixed order of HH 2.5 (with the brief's changes), only the lines that applied.
 * A line with source 'default' always names its field.
 */
export function assumedFor(result, facts) {
  const out = [];
  const used = new Set(facts.usedDefault);
  const src = (field) => (used.has(field) ? 'default' : 'entered');
  const c = facts.couple;
  const inputs = result.inputs;
  const line = (id, field, source, value, parts) => { out.push({ id, field, source, value, text: '', parts }); };
  const suffix = (p) => (p.who === 'you' ? '' : '-partner');
  const spMonthly = money(facts.fullStatePensionAYear / 12);

  if (used.has('savings') && facts.anyPension) line('all-pension', 'savings', 'default', 0, ["We've treated all of it as pension money."]);

  for (const p of facts.people) {
    const kindField = p.who + '.statePension.kind';
    if (p.sp && p.spDefault) {
      const whose = p.who === 'you' ? 'The full State Pension' : "For your partner, the full State Pension";
      // Already being paid today: there is no forecast to check, only what arrives.
      const check = p.who === 'you'
        ? (p.spPaidToday ? ' Yours may be different — check what you are paid.' : ' Yours may be different — check your forecast.')
        : (p.spPaidToday ? ' Theirs may be different — check what they are paid.' : ' Theirs may be different — check their forecast.');
      line('state-pension-full' + suffix(p), kindField, src(kindField), facts.fullStatePensionAYear,
        p.spPaidAtStart ? [whose, ' of ', F(spMonthly), ' a month.', check]
          : [whose, ' of ', F(spMonthly), ' a month from age ', F(p.spAge), '.', check]);
    }
    if (p.sp && !p.spPaidAtStart) {
      line('state-pension-age' + suffix(p), null, 'rule', p.spAge,
        p.who === 'you' ? ['Your State Pension age of ', F(p.spAge), ' comes from your age.'] : ["Your partner's State Pension age of ", F(p.spAge), ' comes from their age.']);
    }
  }
  if (facts.anyPension) line('quarter-tax-free', null, 'rule', RULES.taxFreeShare, ['A quarter of each pension withdrawal is tax-free.']);
  if (facts.anyPension) line('risk', 'risk', src('risk'), inputs.risk, [RISK_WORDS[inputs.risk] || RISK_WORDS.balanced]);
  if (facts.anyPots) line('steady', null, 'rule', null, ['You take the same amount every month, and it rises with prices. No cuts in bad years.']);

  const startField = 'start.kind';
  const startsNow = facts.startsNow;
  // a default if either the choice or the age was left to the form (the form's "from age" with no age typed is the earliest pension age)
  const startSource = used.has(startField) || (inputs.start.kind === 'age' && used.has('start.age')) ? 'default' : 'entered';
  line('start', startField, startSource, result.basis.startAge,
    startsNow ? ['The money is taken from now, when you are ', A('phases.0.ages.you.from'), '.'] : ['The money is taken from when you are ', A('phases.0.ages.you.from'), '.']);
  if (!startsNow && facts.anyPots && !facts.startMoved) {
    const what = facts.anyPension && facts.savings > 0 ? 'Your pot and savings are taken as they stand' : facts.anyPension ? 'Your pot is taken as it stands' : 'Your savings are taken as they stand';
    line('pot-as-is', 'start.age', 'rule', null, [what, ' today: no growth and nothing more paid in before then.']);
  }

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
    if (partner.potDefault) line('partner-no-pot', 'partner.pot', 'default', 0, ['Your partner has no pension pot.']);
    line('both-stop-together', null, 'rule', null, ['You both start taking the money at the same time.']);
    if (facts.savings > 0) line('savings-split', 'savings', 'rule', facts.savings / 2, ['Your savings are split evenly between you.']);
  }
  if (facts.savings > 0) line('savings-as-isa', 'savings', 'rule', facts.savings, ['Your savings are treated as ISA money: tax-free to take, growing at a fixed ', F(Math.round(RULES.savingsGrowth * 100)), '% a year.']);
  if (c) line('both-alive', null, 'rule', null, ['Both of you are alive throughout.']);
  line('tax-rules', null, 'rule', RULES.taxYear, ['Tax rules for ', F(RULES.taxYear), ' in England, Wales and Northern Ireland, with allowances rising with prices; the ', F(money(RULES.taperFrom)), ' point where the allowance starts to be withdrawn stays fixed.']);
  if (facts.anyPots && !facts.madeUpFutures) {
    line('futures', null, 'rule', result.basis.futures, ['Tested against ', F(money(result.basis.futures).slice(1)), ' possible futures built from market history since ', F(facts.historyStartYear), '.']);
  }
  if (facts.anyPots) line('no-charges', null, 'rule', null, ['Fund and platform charges are not taken off.']);
  return out;
}

/** The warnings (HH 2.7), in its order, only those that apply. */
export function warningsFor(result, facts) {
  const out = [];
  const warn = (id, severity, parts) => { out.push({ id, severity, text: '', parts }); };
  const c = facts.couple;
  // A pension holder under the earliest pension age today, named: the start was moved to the day their pension opens,
  // or they chose that day (or a later one) on the form, or — a couple — the other person's money pays while theirs
  // stays closed.
  for (const p of facts.people.filter((x) => x.underAccessAge)) {
    const you = p.who === 'you';
    const still = facts.lockedUntil.find((l) => l.who === p.who);
    const parts = [you ? "You can't take money from your pension until you are " : "Your partner can't take money from their pension until they are ", F(p.accessAge),
      ...(p.accessAge === facts.accessFrom ? [' (April ', F(RULES.pensionAccess.changesOn.slice(0, 4)), ' rules)'] : []), '.'];
    if (still) parts.push(' Until then it is left alone and the rest of the money pays.');
    else if (p.startsAtAccessAge) parts.push(' These figures start from then.');
    else parts.push(' These figures start from when you are ', A('phases.0.ages.you.from'), '.');
    warn('pension-locked' + (you ? '' : '-partner'), 'important', parts);
  }
  if (facts.startMoved && facts.lockedSavingsMonths > 0) {
    warn('savings-cover-gap', 'note', ['Your other savings would cover about ', F(facts.lockedSavingsMonths), facts.lockedSavingsMonths === 1 ? ' month' : ' months', ' at this level before then.']);
  }
  if (result.status === 'ok') {
    const usedUp = result.phases.findIndex((ph, i) => i > 0 && ph.fromPots <= 0 && result.phases[i - 1].fromPots > 0);
    if (usedUp > 0) {
      warn('pot-used-before-state-pension', 'important', ['Your ', facts.anyPension ? 'pot' : 'savings', facts.anyPension ? ' is' : ' are', ' used up by ',
        ...(c ? ['when you are ', A('phases.' + usedUp + '.ages.you.from')] : [A('phases.' + usedUp + '.fromAge')]), '; after that you would have ', afterPhrase(facts), '.']);
    }
  }
  if (result.status === 'guaranteed-only' || result.status === 'none') {
    warn('nothing-to-draw', 'note', result.status === 'none' ? ['There is no pot to draw on.'] : ['There is no pot to draw on, so this is ', afterPhrase(facts), ' only.']);
  }
  if (facts.capped) warn('long-plan', 'important', ['We can only test ', F(RULES.maxYears), ' years ahead, so this runs to age ', A('basis.endAge'), ', not ', A('inputs.endAge'), '.']);
  if (!facts.startsNow && facts.anyPots && !facts.startMoved) warn('start-later', 'note', ['This leaves out any growth, and anything you pay in, between now and then.']);
  if (result.status === 'ok' && result.phases.some((ph) => ph.byPerson.some((b) => b.higherRate))) {
    warn('higher-rate', 'note', ['Some of this is taxed at ', F('40'), '%. Spreading it ', c ? 'between you, or ' : '', 'over more years may lower the tax.']);
  }
  if (c && facts.oneName) warn('one-name', 'note', ['Most of the pension is in one name, so one tax allowance is barely used.']);
  if (facts.people.some((p) => p.sp && p.spDefault)) warn('state-pension-assumed', 'note', ['This assumes the full State Pension. If yours is lower, so is the figure.']);
  if (facts.people.some((p) => p.pensionOverLimit)) warn('tax-free-limit', 'note', ['The tax-free part of a pension is limited to ', F(money(RULES.taxFreeLimit)), ' in total. That limit is included.']);
  if (facts.anyPots && facts.totalPots < RULES.smallPot) warn('small-pot', 'note', ['With a pot this size, many people take it as one or a few lump sums instead of a monthly income.']);
  return out;
}
