/**
 * Couples who stop work in different years: what C, A and B say about it, written once (research/v7/couples-different-
 * years.md 2.4, 4.3 and 12). Each question works out its own stop plan (stopAt.js); this module turns the plan into the
 * answer's `apart` block (contract.js ApartAnswer) and gives the lines the three questions share word for word:
 *
 *   apartOf(plan, inputs, own, cover?)   → the answer's `apart` block, or null when the two stop in the same year
 *   workerOf(apart)                      → who is still working until the second stop
 *   coverUsedOf(cover)                   → { who, fromAge } from stopAt.js coverAt, or null
 *   before2028(people, today)            → who moves money into drawdown before 6 April 2028 at 55 or 56 (section 12)
 *   payKeepsPensions(plan)               → whether a State Pension or final-salary pension starts while its holder still works
 *   apartAssumed(result, opts)           → the lines under what was assumed: 'stop-apart', 'stop-apart-cover',
 *                                          'partner-already', 'you-already', 'savings-first', 'pay-keeps-pensions'
 *   apartWarnings(result, opts)          → 'apart-cover-used' (a bad case leans on the pay) and 'drawdown-2028'
 *
 * A household whose people stop in the same year has no `plan.apart`: nothing here reaches it, so every answer of a
 * same-year couple or a single person is today's, word for word (tests/v7/shared/answers.sameYear.test.js).
 *
 * The words keep the language guide's rules (rail-screens-language.md 3): ages, never a wait; "stops", never "stop work at
 * 60" (C is read by people who have stopped); "a bad case (the worst 1 in 10)"; "could", never "will".
 * Pure: no clock (`today` is given), no storage, no screen.
 */
import { RULES, addYears } from './rules.js';
import { APART, PAY_COVERS, bornFromAge, ageOn, firstOpenAge } from './household.js';

const A = (key) => ({ key, kind: 'age' });
const F = (fixed) => ({ fixed: String(fixed) });
const BAD_CAP = ['In a bad case (the worst ', F('1'), ' in ', F('10'), ')'];

/** The other person of a couple. */
export const otherOf = (who) => (who === 'you' ? 'partner' : 'you');

/**
 * The answer's `apart` block (contract.js ApartAnswer), from a stop plan whose people stop in different years — null
 * when they stop in the same year (the answer then has no `apart` key at all).
 * @param {object} plan     the drawing years' plan (enginePlan under asGiven: `plan.apart`)
 * @param {object} inputs   the checked inputs (for each person's age today)
 * @param {{ you: number, partner: number }} own   each person's whole years from today until their own stop
 * @param {null | { who: string, fromAge: number|null }} [cover]   stopAt.js coverAt at the amount the answer is about
 */
export function apartOf(plan, inputs, own, cover = null) {
  if (!plan || !plan.apart) return null;
  const stop = (who) => ({ age: inputs[who].age + own[who], already: own[who] === 0 });
  return {
    first: plan.apart.first,
    years: plan.apart.years,
    stops: { you: stop('you'), partner: stop('partner') },
    payCovers: plan.apart.payCovers,
    coversGap: plan.apart.coversGap,
    coverUsed: coverUsedOf(cover)
  };
}

/** Who is still working until the second stop: the one who does not stop first. */
export const workerOf = (apart) => otherOf(apart.first);

/** stopAt.js coverAt → the block's `coverUsed`: the first stopper and their age from which, in a bad case, the pay covers all. */
export function coverUsedOf(cover) {
  return cover && Number.isFinite(cover.fromAge) ? { who: cover.who, fromAge: cover.fromAge } : null;
}

/**
 * The people whose pension moves into drawdown before 6 April 2028 at 55 or 56 (section 12, checked 1 Oct 2026): it first
 * opens — at their own stop, or at 55 after it — before that day, and they are still under 57 on the day itself. The
 * answers draw a pension from the day it opens, as if it all moved into drawdown then; money already in drawdown may
 * still be taken after that day, but nothing new may be until 57, so the line says to move what is needed in time.
 * @param {{ who: string, age: number, S: number, pension: boolean }[]} people   each with their own years to their stop
 */
export function before2028(people, today) {
  const on = RULES.pensionAccess.changesOn;
  return people.filter((p) => {
    if (!p.pension) return false;
    const opens = firstOpenAge(p.age, today, p.S);
    return addYears(today, opens - p.age) < on && ageOn(bornFromAge(p.age, today), on) < RULES.pensionAccess.from;
  }).map((p) => p.who);
}

/**
 * Whether a State Pension or final-salary pension of the one still working starts before they stop: it then goes with
 * their pay until they do (4.3 b, 'pay-keeps-pensions').
 */
export function payKeepsPensions(plan) {
  if (!plan || !plan.apart) return false;
  const w = plan.people.find((p) => p.join > 0);
  if (!w) return false;
  return (w.statePension.amount > 0 && w.statePension.startAge < w.ageAtStop)
    || w.finalSalary.some((f) => f.amount > 0 && f.startAge < w.ageAtStop);
}

/** The pay line's answer as given, or the owner's default when it was not answered: 'half' | 'all' | 'none'. */
const payAnswerOf = (inputs) => (Object.prototype.hasOwnProperty.call(PAY_COVERS, inputs.untilBothStop) ? inputs.untilBothStop : APART.payCoversDefault);

/** "your money", "your partner's money": the money of `who`. */
const moneyOf = (who) => (who === 'you' ? 'your money' : "your partner's money");

/**
 * The lines under what was assumed for a couple who stop in different years, in order — each { id, field, source, value,
 * parts } for the question's own `line`. Nothing for a household whose people stop in the same year.
 * @param {object} result   the answer so far: `inputs` and `apart` filled in
 * @param {{ workerPaysIn: boolean, keepsPensions: boolean, youAlready?: boolean }} opts
 *   workerPaysIn: the one still working pays into a pension (they keep paying in); keepsPensions: payKeepsPensions;
 *   youAlready: A and B with "I've already stopped" (C says when the money is taken in its own line)
 */
export function apartAssumed(result, { workerPaysIn, keepsPensions, youAlready = false }) {
  const ap = result.apart;
  if (!ap) return [];
  const inputs = result.inputs;
  const out = [];
  const line = (id, field, source, value, parts) => { out.push({ id, field, source, value, parts: parts.flat(Infinity).filter((p) => p !== '' && p != null) }); };
  const first = ap.first;
  const worker = otherOf(first);
  const at = (who) => A(`apart.stops.${who}.age`);

  const opening = ap.stops[first].already
    ? (first === 'partner' ? ['Your partner has already stopped and you stop at ', at('you'), '.'] : ['You have already stopped and your partner stops at ', at('partner'), '.'])
    : (first === 'you' ? ['You stop at ', at('you'), ' and your partner at ', at('partner'), '.'] : ['Your partner stops at ', at('partner'), ' and you at ', at('you'), '.']);
  const pay = worker === 'partner' ? 'their pay' : 'your pay';
  const keep = !workerPaysIn ? '' : worker === 'partner' ? ' They keep paying in until they stop.' : ' You keep paying in until you stop.';
  const answer = payAnswerOf(inputs);
  const until = answer === 'half' ? [' Until then, ', pay, ' covers half of what you spend; the other half comes from ', moneyOf(first), '.']
    : answer === 'all' ? [' Until then, ', pay, ' covers all of what you spend, and ', moneyOf(first), ' is left alone.']
      : [' Until then, ', moneyOf(first), ' pays all of what you spend.'];
  const given = Object.prototype.hasOwnProperty.call(PAY_COVERS, inputs.untilBothStop);
  line('stop-apart', 'untilBothStop', given ? 'entered' : 'default', answer, [opening, until, keep]);
  // (only while the money of the one who has stopped has a part to pay: under "All of it" it pays nothing until then)
  if (ap.payCovers > 0 && ap.payCovers < 1 && ap.coversGap) {
    line('stop-apart-cover', 'untilBothStop', 'rule', null, ["If the money of the one who has stopped cannot pay its part (say their pension cannot be touched yet), the other's pay covers the rest."]);
  }
  if (youAlready) {
    line('you-already', 'stop.kind', 'entered', 'already', ['You have already stopped, so nothing more goes into your pension', ap.payCovers < 1 ? ', and your money is drawn on from now.' : '.']);
  }
  if (inputs.partner && inputs.partner.stop && inputs.partner.stop.kind === 'already') {
    line('partner-already', 'partner.stop.kind', 'entered', 'already', ["Your partner has already stopped, so nothing more goes into their pension", ap.payCovers < 1 ? ', and their money is drawn on from now.' : '.']);
  }
  if ((inputs.savings || 0) > 0) {
    line('savings-first', 'savings', 'rule', inputs.savings, ['Your savings between you go with ', moneyOf(first), ': ', first === 'you' ? 'you stop' : 'they stop', ' first.']);
  }
  if (keepsPensions) {
    line('pay-keeps-pensions', null, 'rule', null, ['A State Pension or final-salary pension paid to the one still working goes with their pay until they stop.']);
  }
  return out;
}

/**
 * The warnings for a couple who stop in different years, in order — each { id, severity, parts }. Nothing for a
 * household whose people stop in the same year.
 * @param {object} result   the answer so far: `apart` filled in
 * @param {{ drawdown: string[] }} opts   before2028's people
 */
export function apartWarnings(result, { drawdown = [] } = {}) {
  const ap = result.apart;
  if (!ap) return [];
  const out = [];
  const warn = (id, severity, parts) => { out.push({ id, severity, parts: parts.flat(Infinity).filter((p) => p !== '' && p != null) }); };
  if (ap.coverUsed) {
    const first = ap.coverUsed.who;
    const part = ap.payCovers === 0.5 ? 'half' : 'part';
    warn('apart-cover-used', 'important', first === 'you'
      ? [BAD_CAP, ', your money cannot pay its ', part, ' from ', A('apart.coverUsed.fromAge'), ", so your partner's pay would need to cover all of what you spend until they stop at ", A('apart.stops.partner.age'), '.']
      : [BAD_CAP, ", your partner's money cannot pay its ", part, ' from when they are ', A('apart.coverUsed.fromAge'), ', so your pay would need to cover all of what you spend until you stop at ', A('apart.stops.you.age'), '.']);
  }
  if (drawdown.length) {
    const from = F(RULES.pensionAccess.from);
    const day = [F('5'), ' April ', F(RULES.pensionAccess.changesOn.slice(0, 4))];
    warn('drawdown-2028', 'note', drawdown.length === 2
      ? ['Move into drawdown what each of you will need before ', from, ' by ', day, ': after that, nothing new can be taken until you are each ', from, '.']
      : drawdown[0] === 'you'
        ? ['Move into drawdown what you will need before ', from, ' by ', day, ': after that, nothing new can be taken until you are ', from, '.']
        : ['For your partner: move into drawdown what they will need before ', from, ' by ', day, ': after that, nothing new can be taken until they are ', from, '.']);
  }
  return out;
}
