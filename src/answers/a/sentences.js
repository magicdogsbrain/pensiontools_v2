/**
 * The sentences of question A (step 4 brief 4.9; templates of screens-A-B.md 7.2 with the brief's keys), what was
 * assumed (brief 4.9; C's lines where their inputs apply) and the warnings (brief 4.9).
 *
 * Every figure in a sentence is a reference into the result, so the screen can mark it; `text` is the parts joined
 * by format.js (`money` to the pound, `age` whole years, `pot` to the nearest £1,000), and a test asserts the two
 * agree. Everything here is read from the result object and a small context of facts the result does not hold
 * (`ctx`, below) — never from the engine.
 *
 * Plain English, in every state (Rail 3.2 and 3.3, Screens 9): "stop", "pay in", "going in each month", "while you are
 * saving", "the years before your State Pension", "a bad case (the worst 1 in 10)"; ages, never "in N years"; no length
 * of time to wait anywhere in A; and, when the stop is today, nothing a person who has stopped work may not read.
 *
 * @typedef {object} Ctx
 * @property {string[]} usedDefault          paths whose value is the input list's default
 * @property {number} fullStatePensionAYear
 * @property {number} historyStartYear
 * @property {boolean} madeUpFutures         env.futureReturns (tests): the futures line is left out
 * @property {boolean} capped                the shown row's drawing years were cut at 45
 */
import { money, outOfTen, partsText, underNine } from '../shared/format.js';
import { shareCutPercent } from '../shared/futures.js';
import { RULES, accessRiseAffects, firstAccessAge } from '../shared/rules.js';
import { statePensionAgeOf } from '../shared/schemaParts.js';

const M = (key) => ({ key, kind: 'money' });
const A = (key) => ({ key, kind: 'age' });
const P = (key) => ({ key, kind: 'pot' });
const F = (fixed) => ({ fixed: String(fixed) });
const S = (id, parts) => ({ id, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) });
const BAD = ['a bad case (the worst ', F('1'), ' in ', F('10'), ')'];
const BAD_CAP = ['In a bad case (the worst ', F('1'), ' in ', F('10'), ')'];
const GOOD = ['a good case (the best ', F('1'), ' in ', F('10'), ')'];

// underNine (format.js): lasted in 85% to under 90% — the count reads 9 but the careful line is not reached, said "just under 9"
/** 'in only 6 futures out of 10' → parts, each count a fixed figure. */
function wordsParts(words) {
  return words.split(/(\d+)/).map((piece, i) => (i % 2 ? F(piece) : piece)).filter((p) => p !== '');
}
/** "in only 6 futures out of 10" — and "in just under 9 futures out of 10" for 85% to under 90%, so a count never reads as the careful 9. */
const lastedWords = (share) => (underNine(share) ? ['in just under ', F('9'), ' futures out of ', F('10')] : wordsParts(outOfTen(share).words));
/** The same words without "only": "from lasting in 8 futures out of 10 to 9" (Screens 9.2 rule 9). */
const plainWords = (share) => (underNine(share) ? ['in just under ', F('9'), ' futures out of ', F('10')] : wordsParts(outOfTen(share).words.replace('in only ', 'in ')));
/** The bare count a moved figure lands on: "9", "just under 9", "more than 9", "every one", "none". */
function countParts(share) {
  const o = outOfTen(share);
  if (underNine(share)) return ['just under ', F('9')];
  if (o.words === 'in every future we tried') return ['every one'];
  if (o.words === 'in none of the futures we tried') return ['none'];
  if (o.words.startsWith('in more than')) return ['more than ', F('9')];
  if (o.words.startsWith('in fewer than')) return ['fewer than ', F('1')];
  return [F(o.count)];
}
const yearsWord = (n) => (n === 1 ? ' year' : ' years');
/** A row that is not a yes but whose count would read "in 9 futures out of 10" (lasted in 85% to under 90%). */
const isJustUnder = (row) => row.verdict !== 'yes' && underNine(row.lasted);
/** A row's count out of 10, never contradicting its verdict (Screens 9.2; brief 4.9 a.line.justUnder). */
const countWords = (row) => lastedWords(row.lasted);

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
  const shown = result.shown;
  const S = shown.yearsSaving;
  const used = new Set(ctx.usedDefault || []);
  const payIn = (who) => (result.saving.find((x) => x.who === who) || { payIn: { total: 0 } }).payIn;
  const people = (couple ? ['you', 'partner'] : ['you']).map((who) => {
    const p = inputs[who];
    const sp = p.statePension || { kind: 'full' };
    const fs = p.finalSalary || { has: false };
    const outcome = result.saving.find((x) => x.who === who);
    const pensionAtStop = outcome ? outcome.potAtStop.pension.good : p.pot || 0;
    const ageAtStop = p.age + S;
    const openAge = result.pensionOpens[who];
    return {
      who, age: p.age, ageAtStop, pot: (p.pot || 0) > 0, pension: pensionAtStop > 0,
      payIn: payIn(who), payInDefault: used.has(`${who}.payIn.total`),
      sp: sp.kind !== 'none', spDefault: sp.kind === 'full', spAge: statePensionAgeOf(p.age, result.basis.today), spPaidAtStop: sp.kind !== 'none' && statePensionAgeOf(p.age, result.basis.today) <= ageAtStop,
      fs: Boolean(fs.has), fsAge: fs.has ? fs.fromAge : null, fsDefault: used.has(`${who}.finalSalary.has`), potDefault: used.has(`${who}.pot`),
      openAge, closedAtStop: pensionAtStop > 0 && ageAtStop < openAge
    };
  });
  const savingsAtStop = result.saving.reduce((t, x) => t + x.potAtStop.savings.good, 0);
  const younger = Math.min(...people.map((x) => x.age));
  // the pension that opens first after the stop, when none is open at it (shown.gapYears years on)
  const closed = people.filter((x) => x.closedAtStop);
  const firstOpen = shown.gapYears > 0 && closed.length ? closed.reduce((b, x) => (!b || x.openAge - x.ageAtStop < b.openAge - b.ageAtStop ? x : b), null) : null;
  const midBy = shown.potAtStop.byPerson || [];
  const savingsMostly = midBy.reduce((t, x) => t + x.savings, 0) > midBy.reduce((t, x) => t + x.pension, 0);
  // a partner past their State Pension age, the stop later than now: they have most likely stopped already — A cannot
  // yet stop two people in different years, so it says what it does instead (the reviewers' finding, 1 Oct 2026)
  const partner = people.find((x) => x.who === 'partner');
  const partnerRetired = Boolean(couple && partner && S > 0 && partner.spAge <= partner.age);
  // the guaranteed incomes, each with the age it starts at in the younger person's years (the run-out ages' years)
  const incomes = people.flatMap((x) => [...(x.sp ? [{ who: x.who, age: x.spAge, at: x.spAge - x.age + younger }] : []), ...(x.fs ? [{ who: x.who, age: x.fsAge, at: x.fsAge - x.age + younger }] : [])]);
  return {
    savingsMostly, partnerRetired, incomes,
    firstOpen, runOutYears: shown.runOutAge - (younger + S),
    couple, S, stopNow: S === 0, people, used,
    anySavings: (inputs.savings || 0) > 0 || (S > 0 && (inputs.savingsIn || 0) > 0) || savingsAtStop > 0,
    anyPension: people.some((x) => x.pension),
    money: shown.potAtStop.good > 0,
    payInTotal: people.reduce((t, x) => t + x.payIn.total, 0),
    fullStatePensionAYear: ctx.fullStatePensionAYear || 0, historyStartYear: ctx.historyStartYear || 1871,
    madeUpFutures: Boolean(ctx.madeUpFutures), capped: Boolean(ctx.capped)
  };
}

/** "your pot", "your pots", "your partner's pot", each "and your savings": the money that pays in a phase. */
function potsPhrase(facts, phase) {
  const open = (x) => x.pension && !(phase && phase.byPerson.some((b) => b.who === x.who && b.locked));
  const [you, partner] = facts.people;
  const out = [];
  if (open(you) && partner && open(partner)) out.push('pots');
  else if (open(you)) out.push('pot');
  else if (partner && open(partner)) out.push("partner's pot");
  if (facts.anySavings) out.push('savings');
  return 'your ' + (out.length ? out.join(' and ') : 'savings');
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

/** The phase lines: which pot pays which years, at the spending (`a.pays.*`). */
function paysLines(result, facts) {
  const lines = [];
  const phases = result.shown.phases || [];
  const at = (i) => `shown.phases.${i}`;
  const from = (i) => (facts.couple ? ['From when you are ', A(`${at(i)}.ages.you.from`)] : ['From ', A(`${at(i)}.ages.you.from`)]);
  const span = (i) => (i + 1 < phases.length ? [...from(i), ' until ', A(`${at(i)}.ages.you.to`)] : from(i));
  phases.forEach((ph, i) => {
    if (ph.pensionOpen === false && ph.fromPension <= 0.005) {
      const closed = ph.byPerson.filter((b) => b.locked).map((b) => b.who);
      const whose = closed.length === 2 ? 'Your pensions' : closed[0] === 'partner' ? "Your partner's pension" : 'Your pension';
      lines.push(S('a.pays.locked', [...span(i), ': ', M(`${at(i)}.shown.takeHome`), ' a month, all from your savings. ', whose, " can't be touched until then."]));
    } else {
      const items = [];
      const sp = ph.byPerson.filter((b) => b.statePension > 0).length === 2 ? 'State Pensions' : 'State Pension';
      if (ph.shown.statePension > 0) items.push([M(`${at(i)}.shown.statePension`), ' ', sp]);
      if (ph.shown.finalSalary > 0) items.push([M(`${at(i)}.shown.finalSalary`), ' final-salary pension']);
      if ((ph.shown.fromWork || 0) > 0) items.push([M(`${at(i)}.shown.fromWork`), ' from part-time work']);
      const potsItem = ph.shown.fromPots > 0 ? [M(`${at(i)}.shown.fromPots`), ' from ', potsPhrase(facts, ph)] : null;
      if (!items.length && potsItem) {
        lines.push(S('a.pays.pots', phases.length === 1 ? ['All of it comes from ', potsPhrase(facts, ph), '.'] : [...span(i), ': ', M(`${at(i)}.shown.takeHome`), ' a month, all from ', potsPhrase(facts, ph), '.']));
      } else if (items.length || potsItem) {
        if (potsItem) items.push(potsItem);
        const parts = [];
        items.forEach((it, k) => { if (k > 0) parts.push(' + '); parts.push(...it); });
        lines.push(S((ph.shown.fromWork || 0) > 0 ? 'a.pays.work' : 'a.pays.mixed', [...span(i), ': ', ...parts, '.']));
      } else {
        lines.push(S('a.pays.none', [...span(i), ': nothing yet.']));
      }
    }
    if (ph.tax >= 0.5) lines.push(S('a.pays.tax', ['Tax of ', M(`${at(i)}.tax`), ' a month is already taken off.']));
  });
  // a bad case runs out before any pension can be touched
  const first = facts.firstOpen;
  if (first && result.shown.verdict !== 'yes' && facts.runOutYears < result.shown.gapYears) {
    lines.push(S('a.pays.short', [...BAD_CAP, ' your savings run out ', ...ageOfRunOut(facts), ', before ', first.who === 'you' ? 'you can touch your pension at ' : 'your partner can touch their pension at ', A(`pensionOpens.${first.who}`), '.']));
  }
  return lines;
}

const ageOfRunOut = (facts) => (facts.couple ? ['when the younger of you is ', A('shown.runOutAge')] : ['at ', A('shown.runOutAge')]);

/**
 * The sentences of a result (status 'ok', 'guaranteed-only' or 'none').
 * @param {object} result   the result so far: every figure filled in
 * @param {object} facts    factsOf(result, ctx)
 */
export function sentencesFor(result, facts) {
  const c = facts.couple;
  const shown = result.shown;
  const h = result.headline;
  const yes = shown.verdict === 'yes';
  const untilEnd = c ? ['until the younger of you is ', A('basis.endAge')] : ['until you are ', A('basis.endAge')];
  const out = {};

  // the headline: the verdict at the named age, or the earliest age that lasted
  if (h.kind === 'earliest') out.head = S('a.head.earliest', ['You could stop at ', A('earliest.yes'), ' on these figures']);
  else if (h.kind === 'noneWorked') out.head = S('a.head.noneWorked', ['No age up to ', F(RULES.stopAgeMax), ' worked on these figures']);
  else if (yes && c && !facts.partnerRetired) out.head = S('a.head.couple', ['Yes — you could both stop when you are ', A('shown.age'), ' (your partner ', A('shown.ages.partner'), ')']);
  else if (yes) out.head = S('a.head.yes', ['Yes — you could stop at ', A('shown.age')]);
  else if (shown.verdict === 'close') out.head = S('a.head.close', ['Close — stopping at ', A('shown.age'), ' is tight']);
  else out.head = S('a.head.no', ['Not at ', A('shown.age'), ' on these figures']);

  out.sub = S('a.sub', ['spending ', M('spend.perMonth'), ' a month after tax', c ? ' between you, from when you are ' : ' from ', A('shown.age'), ' ', ...untilEnd, ', going up each year with prices']);

  // the sentence: the count out of 10 never contradicts the verdict (lasted in 85–90% reads "just under 9")
  const justUnder = isJustUnder(shown);
  const count = countWords(shown);
  if (h.kind === 'earliest') {
    const k = result.ages.findIndex((r) => r.age === shown.age);
    const before = k > 0 ? [' At ', A(`ages.${k - 1}.age`), ' it lasted ', ...lastedWords(result.ages[k - 1].lasted), '.'] : [];
    out.line = S('a.line.earliest', ['The earliest age at which ', M('spend.perMonth'), ' a month lasted to ', A('basis.endAge'), ' in ', F('9'), ' futures out of ', F('10'), ' is ', A('earliest.yes'), '.', ...before]);
  } else if (h.kind === 'noneWorked') {
    out.line = S('a.line', ['At ', A('shown.age'), ', ', M('spend.perMonth'), ' a month lasted to ', A('basis.endAge'), ' ', ...count, '.']);
  } else if (c) {
    out.line = S(justUnder ? 'a.line.justUnder' : 'a.line', ['Stopping when you are ', A('shown.age'), ' and spending ', M('spend.perMonth'), ' a month between you, your money lasted until the younger of you is ', A('basis.endAge'), ' ', ...count, '.']);
  } else {
    out.line = S(justUnder ? 'a.line.justUnder' : 'a.line', ['Stopping at ', A('shown.age'), ' and spending ', M('spend.perMonth'), ' a month, your money lasted to ', A('basis.endAge'), ' ', ...count, '.']);
  }

  // the bad case
  if (h.kind === 'earliest') {
    const k = result.ages.findIndex((r) => r.age === shown.age);
    const prev = k > 0 && result.ages[k - 1].verdict !== 'yes' ? [' Stopping at ', A(`ages.${k - 1}.age`), ' instead would run out ', ...(c ? ['when the younger of you is ', A(`ages.${k - 1}.runOutAge`)] : ['at age ', A(`ages.${k - 1}.runOutAge`)]), '.'] : [];
    out.bad = S('a.bad.earliest', [...BAD_CAP, ', stopping at ', A('earliest.yes'), ' still lasts to ', A('basis.endAge'), '.', ...prev]);
  } else if (yes) {
    out.bad = S('a.bad.yes', [...BAD_CAP, ' it still lasts to ', A('basis.endAge'), '. You could spend up to about ', M('shown.monthly.careful'), ' a month and it would still last in ', F('9'), ' futures out of ', F('10'), '.']);
  } else {
    const nearest = result.earliest.yes;
    const tail = nearest === null ? []
      : nearest > shown.age ? [' Stopping at ', A('earliest.yes'), ' instead lasted in ', F('9'), ' futures out of ', F('10'), '.']
        : [' The earliest age shown that lasted in ', F('9'), ' futures out of ', F('10'), ' is ', A('earliest.yes'), '.'];
    out.bad = S('a.bad', [...BAD_CAP, ' it would run out ', ...(c ? ['when the younger of you is ', A('shown.runOutAge')] : ['at age ', A('shown.runOutAge')]), '.', ...tail]);
  }
  // what is left once the money has run out — said with the run-out age, so it never reads as "after stopping at 62"
  // (it may stand after the stop-later sentence); not when the bad case runs out while the pension is still closed: the
  // pension is there, untouched, and the savings-run-short warning says what happened
  const runsOutClosed = Boolean(facts.firstOpen) && facts.runOutYears < shown.gapYears;
  if (!yes && !runsOutClosed && result.guaranteed.monthlyAfterTax > 0 && afterPhrase(facts)) {
    // that figure is once every State Pension and final-salary pension has started: when the money runs out before then,
    // say so ("once it starts at 67"), so it never reads as paid from the day the money runs out
    const later = facts.incomes.filter((x) => x.at > shown.runOutAge);
    const once = !later.length ? [] : facts.incomes.length === 1 ? [' once it starts at ', F(later[0].age)] : [' once they have all started'];
    out.after = S('a.after', ['After it runs out ', ...(c ? ['when the younger of you is ', A('shown.runOutAge')] : ['at ', A('shown.runOutAge')]), ', you would have ',
      M('guaranteed.monthlyAfterTax'), ' a month from ', afterPhrase(facts), ...once, '.']);
  }

  // what you could spend from that age, and the pot by then
  const what = facts.anySavings ? (c ? 'your pensions and savings' : 'your pension and savings') : (c ? 'your pots' : 'your pot');
  const noMoney = !(shown.potAtStop.good > 0);
  out.range = noMoney
    ? S('a.range', ['There is no careful, middling or good amount to show at ', A('shown.age'), ': nothing here depends on markets.'])
    : S('a.range', ['At ', A('shown.age'), ' you could spend: careful ', M('shown.monthly.careful'), ', middling ', M('shown.monthly.middling'), ', good ', M('shown.monthly.good'), ' a month.']);
  if (noMoney) {
    out.pot = S('a.pot.nothing', ['There is nothing in a pension pot or in savings to draw on at ', A('shown.age'), '.']);
  } else if (facts.stopNow) {
    out.pot = S('a.pot.now', [what.charAt(0).toUpperCase() + what.slice(1), facts.anySavings || c ? ' come to ' : ' is ', M('shown.potAtStop.middling'), ' today.']);
  } else {
    out.pot = S(facts.payInTotal > 0 ? 'a.pot' : 'a.pot.noPayIn', ['By ', A('shown.age'), facts.payInTotal > 0 ? '' : ', with nothing more paid in,', ' ', what, ' could be about ', P('shown.potAtStop.middling'), '. ',
      ...BAD_CAP, ' it is ', P('shown.potAtStop.careful'), ', and in ', ...GOOD, ' ', P('shown.potAtStop.good'), '.']);
  }

  out.pays = paysLines(result, facts);
  if (result.savingsNeeded) {
    out.savingsNeeded = S('a.savingsNeeded', ['Your savings would need to be about ', P('savingsNeeded.amount'), ' at ', A('shown.age'), ' to cover the years from ', A('shown.age'), ' to ', A('savingsNeeded.untilAge'), ' on their own.']);
  }

  // the ages side by side, one sentence a row (for screen readers)
  out.chart = result.ages.map((r, k) => S('a.chart.row', ['At ', A(`ages.${k}.age`), ', you could spend about ', M(`ages.${k}.monthly.careful`), ' a month; ', M('spend.perMonth'), ' a month lasted ', ...countWords(r), '.']));

  // under the every-age table: the ages before a pension can be touched, and the ages left out
  if (result.basis.detail === 'all' && result.status === 'ok') {
    const opens = firstAccessAge(result.inputs.you.age, result.basis.today);
    const early = result.ages.some((r) => r.age < opens);
    const under50 = result.inputs.you.age < 50;
    // the earliest age that worked is always a row, even under 50 (it is the row the headline is about)
    const earliestUnder50 = under50 && result.earliest.yes !== null && result.earliest.yes < 50 && result.earliest.yes !== result.inputs.you.age;
    if (early || under50) {
      out.agesNote = S('a.ages.note', [
        ...(early ? ['Stopping before ', F(opens), ' means living on savings until a pension can be touched at ', F(opens), facts.anySavings ? '.' : ': with no savings, nothing pays those years.'] : []),
        ...(under50 ? [early ? ' ' : '', 'Ages under ', F(50), ' are left out, apart from your age today',
          ...(earliestUnder50 ? [' and ', A('earliest.yes'), ', the earliest that worked'] : []), '.'] : [])
      ]);
    }
  }

  // one more year
  const o = shown.oneMoreYear;
  if (o && result.status === 'ok') {
    out.oneMore = !o.sameish && o.extraMonthly > 0
      ? S('a.oneMore', ['Working until ', A('shown.oneMoreYear.toAge'), ' instead of ', A('shown.age'), ' buys about ', M('shown.oneMoreYear.extraMonthly'), ' a month more for life.'])
      : !o.sameish && o.extraMonthly < 0
        // the next age's futures start in other markets: the careful amount can fall (tests/v7/a/exceptions.md, M-A4)
        ? S('a.oneMore.less', ['Working until ', A('shown.oneMoreYear.toAge'), ' instead of ', A('shown.age'), ' does not add to what you could spend on these futures: it is about ',
          M('shown.oneMoreYear.extraMonthly'), ' a month less.'])
        : S('a.oneMore.same', ['Working until ', A('shown.oneMoreYear.toAge'), ' instead of ', A('shown.age'), ' changes what you could spend very little.']);
    const moved = outOfTen(o.lastedFrom).words !== outOfTen(o.lastedTo).words;
    const bad = o.runOutFrom < result.basis.endAge
      ? (o.runOutTo >= result.basis.endAge
        ? [', and ', ...BAD, ' from running out at ', A('shown.oneMoreYear.runOutFrom'), ' to lasting to ', A('basis.endAge')]
        : o.runOutTo !== o.runOutFrom ? [', and ', ...BAD, ' from running out at ', A('shown.oneMoreYear.runOutFrom'), ' to running out at ', A('shown.oneMoreYear.runOutTo')] : [])
      : [];
    if (moved) out.oneMoreMoves = S('a.oneMore.moves', ['It moves ', M('spend.perMonth'), ' a month from lasting ', ...plainWords(o.lastedFrom), ' to ', ...countParts(o.lastedTo), ...bad, '.']);
    // the count stays, the bad case moves: "It keeps £2,200 a month lasting in 7 futures out of 10, and moves a bad case …"
    else if (bad.length) out.oneMoreMoves = S('a.oneMore.moves', ['It keeps ', M('spend.perMonth'), ' a month lasting ', ...plainWords(o.lastedTo), ', and moves ', ...bad.slice(1), '.']);
  }

  // part-time work
  const pt = result.partTime;
  if (pt) {
    out.partTime = S('a.partTime', ['That is with ', M('partTime.yearly'), ' a year from part-time work for ', F(pt.years), yearsWord(pt.years), ' after you stop (from ', A('partTime.fromAge'), ' until ', A('partTime.toAge'), '), taxed as income. Without it, the money lasted ', ...lastedWords(pt.lastedWithout), '.']);
    if (outOfTen(pt.oneMore.lasted).words !== outOfTen(pt.lastedWith).words) {
      out.partTimeOneMore = S('a.partTime.oneMore', ['One more year of part-time work, until ', F(pt.toAge + 1), ', moves ', M('spend.perMonth'), ' a month from lasting ', ...plainWords(pt.lastedWith), ' to ', ...countParts(pt.oneMore.lasted), '.']);
    }
  }

  if (result.status === 'none') out.none = S('a.none', ['With no pot and no savings there is nothing to stop on yet.']);
  if (result.status === 'guaranteed-only') out.nothing = S('a.nothing', ['There is no pot to draw on and nothing going in, so this is ', afterPhrase(facts), ' only: ', M('guaranteed.monthlyAfterTax'), ' a month after tax once it has all started.']);
  if (h.kind === 'named' && !yes && result.earliest.yes === null && result.status === 'ok') {
    out.late = S('a.late', ['Spending less changes that quickest: try it below.']);
  }

  // "Now:" for the try-a-change row (Screens 3.2 and 3.3: "Now: close at 60, 8 futures out of 10.", "Before: earliest
  // 61."); the shell keeps the one before
  if (result.status === 'ok' && h) {
    if (h.kind === 'earliest') out.change = S('a.change', ['Now: earliest ', A('headline.age'), '.']);
    else if (h.kind === 'noneWorked') out.change = S('a.change', ['Now: no age up to ', F(RULES.stopAgeMax), ' worked.']);
    else {
      const count = plainWords(h.lasted).map((p, i) => (i === 0 && typeof p === 'string' ? p.replace(/^in /, '') : p)).filter((p) => p !== '');
      const pt = result.partTime ? [', with ', F(result.partTime.years), result.partTime.years === 1 ? ' year' : ' years', ' of part-time work'] : [];
      out.change = S('a.change', ['Now: ', { yes: 'yes', close: 'close', no: 'not' }[h.verdict], ' at ', A('headline.age'), ', ', ...count, ...pt, '.']);
    }
  }
  return out;
}

const RISK_WORDS = {
  cautious: 'Cautious, about a third in shares, the rest in bonds and cash.',
  balanced: 'Balanced, about half in shares, the rest in bonds and cash.',
  adventurous: 'Adventurous, about two thirds in shares, the rest in bonds and cash.'
};
const LEVEL_WORDS = { minimum: 'Minimum', moderate: 'Moderate', comfortable: 'Comfortable' };

/** What was assumed, in a fixed order, only the lines that apply. A line with source 'default' always names its field. */
export function assumedFor(result, facts) {
  const out = [];
  const inputs = result.inputs;
  const used = facts.used;
  const src = (field) => (used.has(field) ? 'default' : 'entered');
  const line = (id, field, source, value, parts) => { out.push({ id, field, source, value, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) }); };
  const saving = facts.S > 0;
  const anyMoney = facts.money || facts.payInTotal > 0;
  const c = facts.couple;
  const suffix = (x) => (x.who === 'you' ? '' : '-partner');

  if (saving) {
    facts.people.forEach((x, k) => {
      const whose = x.who === 'you' ? (c ? 'your pension' : 'your pension') : "your partner's pension";
      const field = `${x.who}.payIn.${inputs[x.who].payIn.kind === 'split' ? 'kind' : 'total'}`;
      if (x.payIn.total > 0) {
        line('pay-in' + suffix(x), field, src(field), x.payIn.total, [M(`saving.${k}.payIn.total`), ' a month goes into ', whose, ' until you stop at ', A('shown.age'), ', going up with prices.']);
        if (x.payIn.own !== null) line('pay-in-split' + suffix(x), `${x.who}.payIn.kind`, 'entered', 'split', ['Of that, ', M(`saving.${k}.payIn.own`), ' is from ', x.who === 'you' ? 'your' : 'their', ' pay and ', M(`saving.${k}.payIn.employer`), ' is the employer\'s part.']);
      } else {
        line('nothing-paid-in' + suffix(x), field, src(field), 0, [x.who === 'you' ? 'Nothing more goes into your pension before you stop.' : "Nothing more goes into your partner's pension before you stop."]);
      }
    });
    if (facts.payInTotal > 0) line('pay-in-as-given', null, 'rule', null, ['The figure you gave is what lands in the pension, with the tax the government adds back already inside it.']);
    line('savings-in', 'savingsIn', src('savingsIn'), inputs.savingsIn, inputs.savingsIn > 0
      ? [M('inputs.savingsIn'), ' a month goes into ISAs and savings until you stop, going up with prices.']
      : ['Nothing more goes into ISAs or savings before you stop.']);
    if (anyMoney || inputs.savingsIn > 0) {
      line('risk-saving', 'savingRisk', src('savingRisk'), inputs.savingRisk, ['While saving: ', RISK_WORDS[inputs.savingRisk]]);
      if (inputs.savingRisk !== inputs.risk) {
        const from = Math.max(inputs.you.age, inputs.you.age + facts.S - 10);
        line('slide', null, 'rule', 10, ['From ', F(from), ' your money moves step by step from the mix while saving to the mix once stopped, reaching it at ', A('shown.age'), '.']);
      }
      line('charge-saving', 'charge', src('charge'), inputs.charge, ['A charge of ', F(inputs.charge), '% a year comes off while you are saving; none once you have stopped.']);
      line('saving-rebalanced', null, 'rule', null, ['While you are saving, your money is kept at its mix of shares, bonds and cash every month.']);
    }
    line('same-futures', null, 'rule', null, ['The years before you stop and the years after are one future: the same markets, seen once.']);
  }
  if (inputs.stop.kind === 'age') line('stop-age', 'stop.age', 'entered', inputs.stop.age, ['You stop at ', A('shown.age'), saving && facts.payInTotal > 0 ? ', and nothing more goes into a pension from then.' : '.']);
  else line('stop-age', 'stop.kind', 'entered', 'ages', ['The age shown is the earliest at which your spending lasted in ', F('9'), ' futures out of ', F('10'), ', or the last age tried.']);
  if (c) line('stop-together', null, 'rule', null, facts.partnerRetired
    ? ["Your partner's money is left alone until you stop at ", A('shown.age'), ', then drawn on with yours.']
    : ['You both stop in the same year.']);
  if (inputs.spend.kind === 'level') {
    line('spend-level', 'spend.level', 'entered', inputs.spend.level, [LEVEL_WORDS[inputs.spend.level], ': ', M('spend.perMonth'), ' a month for ', c ? 'a couple' : 'one person', ', from the Retirement Living Standards.']);
  }
  line('spend-steady', null, 'rule', null, ['You spend the same each month, going up with prices, from when you stop. No cuts in bad years.']);
  if (inputs.partTime.has) line('work-tax', null, 'rule', null, ['Earnings from part-time work are taxed as income; National Insurance is not included.']);
  else line('no-part-time', 'partTime.has', src('partTime.has'), false, ['No part-time work after you stop.']);
  for (const x of facts.people.filter((p) => p.closedAtStop)) {
    line('pension-closed-until' + suffix(x), null, 'rule', x.openAge, x.who === 'you'
      ? ['Your pension is left alone until you are ', A('pensionOpens.you'), '; your savings pay until then.']
      : ["Your partner's pension is left alone until they are ", A('pensionOpens.partner'), '; the rest of the money pays until then.']);
  }

  const spMonthly = money(facts.fullStatePensionAYear / 12);
  for (const x of facts.people) {
    const kindField = `${x.who}.statePension.kind`;
    if (x.sp && x.spDefault) {
      const whose = x.who === 'you' ? 'The full State Pension' : 'For your partner, the full State Pension';
      const check = x.who === 'you' ? ' Yours may be different — check your forecast.' : ' Theirs may be different — check their forecast.';
      line('state-pension-full' + suffix(x), kindField, src(kindField), facts.fullStatePensionAYear, x.spPaidAtStop ? [whose, ' of ', F(spMonthly), ' a month.', check] : [whose, ' of ', F(spMonthly), ' a month from age ', F(x.spAge), '.', check]);
    }
    if (x.sp && !x.spPaidAtStop) {
      line('state-pension-age' + suffix(x), null, 'rule', x.spAge, x.who === 'you' ? ['Your State Pension age of ', F(x.spAge), ' comes from your age.'] : ["Your partner's State Pension age of ", F(x.spAge), ' comes from their age.']);
    }
  }
  if (facts.anyPension) line('quarter-tax-free', null, 'rule', RULES.taxFreeShare, ['A quarter of each pension withdrawal is tax-free.']);
  if (facts.money) line('risk-drawing', 'risk', src('risk'), inputs.risk, ['Once stopped: ', RISK_WORDS[inputs.risk]]);
  line('plan-to', 'endAge', src('endAge'), inputs.endAge, c ? ['The money needs to last until the younger of you is ', A('basis.endAge'), '.'] : ['The money needs to last until you are ', A('basis.endAge'), '.']);
  line('todays-prices', null, 'rule', null, ["All figures are in today's prices."]);
  for (const x of facts.people) {
    if (x.fsDefault) line('no-final-salary' + suffix(x), `${x.who}.finalSalary.has`, 'default', false, x.who === 'you' ? ['No final-salary pension.'] : ['Your partner has no final-salary pension.']);
  }
  const fss = facts.people.filter((x) => x.fs);
  if (fss.length === 2) line('final-salary-rises', null, 'rule', 'pricesCapped5', ['Your final-salary pensions rise with prices, up to ', F('5'), '% a year.']);
  else if (fss.length === 1) line('final-salary-rises', null, 'rule', 'pricesCapped5', [fss[0].who === 'you' ? 'Your final-salary pension' : "Your partner's final-salary pension", ' rises with prices, up to ', F('5'), '% a year.']);
  if (c) {
    if (used.has('partner.pot')) line('partner-no-pot', 'partner.pot', 'default', 0, ['Your partner has no pension pot.']);
    if ((inputs.savings || 0) > 0 || (saving && inputs.savingsIn > 0)) line('savings-split', 'savings', 'rule', null, ['Your savings, and anything going into them, are split evenly between you.']);
  }
  if ((inputs.savings || 0) > 0 || inputs.savingsIn > 0) line('isa-fixed-growth', null, 'rule', RULES.savingsGrowth, ['Once you have stopped, your savings are treated as ISA money: tax-free to take, growing at a fixed ', F(Math.round(RULES.savingsGrowth * 100)), '% a year before rising prices, so they lose ground whenever prices rise faster than that.']);
  if (c) line('both-alive', null, 'rule', null, ['Both of you are alive throughout.']);
  line('tax-rules', null, 'rule', RULES.taxYear, ['Tax rules for ', F(RULES.taxYear), ' in England, Wales and Northern Ireland, with allowances rising with prices; the ', F(money(RULES.taperFrom)), ' point where the allowance starts to be withdrawn stays fixed.']);
  if ((facts.money || facts.payInTotal > 0) && !facts.madeUpFutures) {
    line('futures', null, 'rule', result.basis.futures, ['Tested against ', F(money(result.basis.futures).slice(1)), ' possible futures, each pieced together from stretches of US share returns and US price rises since ', F(facts.historyStartYear),
      '. Share returns are cut by ', F(shareCutPercent()), '% a year to stand for shares around the world; bonds and cash are worked out from each future\'s markets.']);
  }
  return out;
}

/** The warnings (brief 4.9), in a fixed order, only those that apply. */
export function warningsFor(result, facts) {
  const out = [];
  const warn = (id, severity, parts) => { out.push({ id, severity, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) }); };
  const inputs = result.inputs;
  const shown = result.shown;
  const c = facts.couple;

  for (const x of facts.people.filter((p) => p.closedAtStop)) {
    warn('pension-closed' + (x.who === 'you' ? '' : '-partner'), 'important', x.who === 'you'
      ? ["You can't take money from your pension until you are ", A('pensionOpens.you'), '. Until then your ISA and savings pay.']
      : ["Your partner can't take money from their pension until they are ", A('pensionOpens.partner'), '. Until then the rest of the money pays.']);
  }
  const first = facts.firstOpen;
  if (first && result.status === 'ok') {
    if (!facts.anySavings) {
      warn('no-savings-for-gap', 'important', ['You have nothing outside a pension to live on until ', first.who === 'you' ? 'you are ' : 'your partner is ', A(`pensionOpens.${first.who}`), '. Stopping at ', A('shown.age'), ' needs savings you can reach.']);
    } else if (shown.verdict !== 'yes' && facts.runOutYears < shown.gapYears) {
      warn('savings-run-short', 'important', [...BAD_CAP, ' your savings run out ', ...ageOfRunOut(facts), ', before ', first.who === 'you' ? 'you can touch your pension at ' : 'your partner can touch their pension at ', A(`pensionOpens.${first.who}`), '.']);
    }
  }
  if (facts.partnerRetired) {
    warn('partner-stops-with-you', 'note', ["Your partner is past their State Pension age. These figures leave their money alone until you stop at ", A('shown.age'),
      ', and do not count anything they take before then.']);
  }
  if (facts.people.some((x) => accessRiseAffects(x.age, result.basis.today, x.ageAtStop))) {
    warn('access-age-rises', 'note', ['The earliest age you can take money from a pension rises from ', F(RULES.pensionAccess.before), ' to ', F(RULES.pensionAccess.from), ' on ', F('6'), ' April ', F(RULES.pensionAccess.changesOn.slice(0, 4)), '.']);
  }
  facts.people.forEach((x, k) => {
    if (x.payIn.total * 12 > RULES.annualAllowance) {
      warn('annual-allowance' + (x.who === 'you' ? '' : '-partner'), 'important', ['The most that can go into ', x.who === 'you' ? 'your' : "your partner's", ' pensions in a year with the tax the government adds back is ', F(money(RULES.annualAllowance)), ' (less for the highest earners). ', M(`saving.${k}.payIn.total`), ' a month is more than that.']);
    }
    if (inputs[x.who].alreadyDrawing && x.payIn.total * 12 > RULES.moneyPurchaseAllowance) {
      warn('mpaa' + (x.who === 'you' ? '' : '-partner'), 'important', ['Once taxable money has been taken from a pension, the most that can go into pensions in a year with the tax the government adds back falls to ', F(money(RULES.moneyPurchaseAllowance)), '.']);
    }
  });
  if (inputs.savingsIn * 12 > RULES.isaAllowance) warn('isa-allowance', 'note', ['The most anyone can put into ISAs in a year is ', F(money(RULES.isaAllowance)), '.', c ? ' Each of you has that limit.' : '']);
  // no row lasted: every later age to 75 was tried as well (an age named that does not last is followed up to 75 until
  // one does, and that one is a row), so it is every age, not only those shown
  if (result.status === 'ok' && !result.ages.some((r) => r.verdict === 'yes')) {
    warn('not-in-range', 'important', inputs.stop.kind === 'ages'
      ? ['No age up to ', F(RULES.stopAgeMax), ' lasted in ', F('9'), ' futures out of ', F('10'), ' at ', M('spend.perMonth'), ' a month.']
      : ['No age from ', A('ages.0.age'), ' to ', F(RULES.stopAgeMax), ' lasted in ', F('9'), ' futures out of ', F('10'), ' at ', M('spend.perMonth'), ' a month.']);
  }
  if (facts.capped) warn('long-plan', 'important', ['We can only test ', F(RULES.maxYears), ' years ahead from the stop, so this runs to age ', A('basis.endAge'), ', not ', A('inputs.endAge'), '.']);
  if (result.status === 'ok' && (shown.phases || []).some((ph) => ph.byPerson.some((b) => b.higherRate))) {
    warn('higher-rate', 'note', ['Some of this is taxed at ', F('40'), '%. Spreading it ', c ? 'between you, or ' : '', 'over more years may lower the tax.']);
  }
  if (c && result.status === 'ok') {
    const by = shown.potAtStop.byPerson;
    const pensions = by.map((x) => x.pension);
    const total = pensions.reduce((t, v) => t + v, 0);
    const first = (shown.phases || [])[0];
    const other = (who) => first.byPerson.find((b) => b.who !== who);
    if (total > 0 && first && by.some((x) => x.pension / total > 0.8 && other(x.who) && (other(x.who).statePension + other(x.who).finalSalary) * 12 < RULES.personalAllowance)) {
      warn('one-name', 'note', ['Most of the pension is in one name, so one tax allowance is barely used.']);
    }
  }
  if (facts.people.some((x) => x.sp && x.spDefault)) warn('state-pension-assumed', 'note', ['This assumes the full State Pension. If yours is lower, so is the figure.']);
  if (result.status === 'ok' && facts.savingsMostly) {
    warn('savings-fixed-growth', 'important', ['Most of the money when you stop is in savings. Once you stop, savings are grown at a fixed ', F(Math.round(RULES.savingsGrowth * 100)),
      '% a year before rising prices, whatever markets do, so for this answer that one figure matters most. Invested ISAs could do better or worse.']);
  }
  if (result.status === 'ok' && (shown.phases || []).length && shown.phases.every((ph) => ph.fromPots <= 0.005 && ph.takeHome >= result.spend.perMonth - 0.005)) {
    warn('target-below-pensions', 'note', [afterPhrase(facts).charAt(0).toUpperCase() + afterPhrase(facts).slice(1), ' alone cover ', M('spend.perMonth'), ' a month from ', A('shown.age'), '; the pot is not needed for that.']);
  }
  if (result.saving.some((x) => x.potAtStop.pension.good > RULES.largePot)) {
    warn('large-pot', 'note', ['The tax-free part of a pension is limited to ', F(money(RULES.taxFreeLimit)), ' in total. That limit is included.']);
  }
  if (facts.money && shown.potAtStop.middling < RULES.smallPot) {
    warn('small-pot', 'note', ['With a pot this size, many people take it as one or a few lump sums instead of a monthly income.']);
  }
  return out;
}

/** Sentences, what was assumed and the warnings of a result, filled in. */
export function textsFor(result, ctx) {
  const facts = factsOf(result, ctx);
  result.sentences = sentencesFor(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  return finishTexts(result);
}
