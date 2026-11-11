/**
 * The words of the chance the money lasts as long as you do, for A, B, C and D (7.8.0: research/v7/replan-nov-2026.md 5;
 * the build spec's sections 6 and 11). Every weighted sentence is said as a chance ("18 times in 20"), never as a count of
 * futures, and always stands beside a fixed-age sentence that names its age ("If you live to 99, the money lasts that long
 * in 14 of 20 futures we tried."): the screens draw a sentence with `mark: 'weighted'` as [data-weighted] and one with
 * `mark: 'fixed'` as [data-fixed="age"], and a render test holds that the one never shows without the other in its block.
 *
 *   lifeFactsOf(result, weigher, plan, inputs)   what the words read: weighing or not, a couple, the sexes used and given,
 *                                                the plan-to age and how it was set, the age followed on to, the cap
 *   LEVEL_NAME, countingLead, asLongAs           the pieces
 *   chanceParts(share), fixedAgeParts(share, lf), boldParts(share, lf), asksForParts(level)
 *   whenParts(sf, lf), howLongParts(sf), howMuchParts(sf), floorParts(sf, lf)   the shortfall lines (shared/shortfall.js)
 *   lifeAssumed(lf)                              the "What we assumed" lines: the plan-to age and the age followed on to,
 *                                                the figures used (with a way to change them), a couple, the cap
 *
 * Sentences are { id, text: '', parts, mark? } as every question writes them; a part is a string, { fixed } (a count or
 * an age the answer wrote, drawn data-fixed), { key, kind } (a figure of the result). Pure: no clock, no storage.
 */
import { chanceWords, fixedAgeWords, money } from './format.js';
import { LEVEL_FAILS20, RULES } from './rules.js';
import { jointSurvivalOf } from '../../services/LongevityModel.js';

const F = (fixed) => ({ fixed: String(fixed) });
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** Words with every run of digits a fixed part. */
export const digits = (words) => String(words).split(/(\d+)/).map((p, i) => (i % 2 ? F(p) : p)).filter((p) => p !== '');
const S = (id, parts, mark) => ({ id, text: '', parts: parts.flat().filter((p) => p !== '' && p != null), ...(mark ? { mark } : {}) });

export const LEVEL_NAME = Object.freeze({ careful: 'Careful', balanced: 'Balanced', bold: 'Bold' });

/** "Counting how long people your age live" (a couple: "your ages"). */
export const countingLead = (couple) => (couple ? 'Counting how long people your ages live' : 'Counting how long people your age live');
/** "as long as you do" (a couple: "as long as one of you is alive"). */
export const asLongAs = (couple) => (couple ? 'as long as one of you is alive' : 'as long as you do');

/**
 * What the words read, from a result with its level and chance, the weigher and the engine plan it was worked on.
 * @returns {{ weighted: boolean, couple: boolean, level: string, sex: { you: 'f'|'m', partner?: 'f'|'m' },
 *   given: { you: boolean, partner?: boolean }, planToAge: number, weightToAge: number, rule: string, capped: boolean,
 *   capYears: number, liveLonger: number|null, startAge: number }}
 */
export function lifeFactsOf(result, weigher, plan, inputs) {
  const ins = inputs || {};
  const couple = ins.household === 'couple' && !!ins.partner;
  const ch = result.chance || {};
  const sex = (result.basis && result.basis.sexUsed) || { you: 'f' };
  const said = (who) => !!(ins[who] && (ins[who].sex === 'female' || ins[who].sex === 'male'));
  const given = couple ? { you: said('you'), partner: said('partner') } : { you: said('you') };
  const capped = Boolean(plan && plan.runCapped);
  const planToAge = isNum(ch.planToAge) ? ch.planToAge : plan.endAge;
  const startAge = plan.startAge;
  const weightToAge = capped ? startAge + plan.years : isNum(ch.weightToAge) ? ch.weightToAge : planToAge;
  // how many people like you live past a plan-to age you chose (from the drawing start): "About 6 in 10 women your age …"
  let liveLonger = null;
  if (weigher && weigher.weighted && Array.isArray(weigher.people) && weigher.people.length) {
    const S = jointSurvivalOf(weigher.people, weigher.d);
    const younger = Math.min(...weigher.people.map((p) => p.age));
    liveLonger = S(planToAge - younger);
  }
  return {
    weighted: Boolean(weigher && weigher.weighted), couple, level: result.level || 'balanced', sex, given, planToAge, weightToAge,
    rule: ch.horizonRule || 'survival', capped, capYears: plan.years, liveLonger, startAge
  };
}

/** A weighted share as parts: "18 times in 20" (format.js chanceWords). */
export const chanceParts = (share) => digits(chanceWords(share));

/** "; Balanced asks for 18" — after a close verdict's chance. */
export const asksForParts = (level) => ['; ', LEVEL_NAME[level], ' asks for ', F(20 - LEVEL_FAILS20[level])];

/** The fixed-age sentence: "If you live to 99, the money lasts that long in 14 of 20 futures we tried." */
export function fixedAgeParts(share, lf, { kind = 'ran-out' } = {}) {
  return digits(fixedAgeWords(share, lf.planToAge, { kind, couple: lf.couple ? { name: 'the younger of you' } : null }));
}

/** Bold's consequence, always in the headline block: "About 3 times in 10 the money runs out while you are alive, …". */
export function boldParts(share, lf) {
  const tens = Math.max(1, Math.round((1 - (isNum(share) ? share : 0)) * 10));
  return ['About ', F(tens), tens === 1 ? ' time' : ' times', ' in ', F('10'), ' the money runs out while ', lf.couple ? 'one of you is' : 'you are',
    ' alive, and you would spend less from then on.'];
}

/** Bold's consequence as a sentence (mark: weighted, a chance), for the headline block. */
export const boldSentence = (id, share, lf) => S(id, boldParts(share, lf), 'weighted');

/** The fixed-age sentence of a block (mark: fixed). */
export const fixedSentence = (id, share, lf, opts) => S(id, fixedAgeParts(share, lf, opts), 'fixed');

/** The younger person said as an age: "88" alone, or "when the younger of you is 88". */
const atAge = (lf, age) => (lf.couple ? ['when the younger of you is ', F(age)] : ['at ', F(age)]);
const byAge = (lf, age) => (lf.couple ? ['by the time the younger of you is ', F(age)] : ['by ', F(age)]);

/** "In the futures where the money runs out, it typically runs out at 88. In the worst 1 in 10 of all the futures, by 84." */
export function whenParts(sf, lf) {
  if (!sf || !sf.when) return null;
  const w = sf.when;
  return ['In the futures where the money runs out, it typically runs out ', ...atAge(lf, w.typical), '. ',
    ...(w.worstLasts ? ['In the worst ', F('1'), ' in ', F('10'), ' of all the futures it still lasts to ', F(lf.planToAge), '.']
      : ['In the worst ', F('1'), ' in ', F('10'), ' of all the futures, ', ...byAge(lf, w.worst), '.'])];
}

/** "In those futures it still pays for 22 of the 31 years to 97." */
export function howLongParts(sf, lf) {
  if (!sf || !sf.howLong) return null;
  return ['In the futures where it runs out before ', F(lf.planToAge), ', it still pays for ', F(sf.howLong.paid), ' of the ', F(sf.howLong.of), ' years to ', F(lf.planToAge), '.'];
}

/** "Across those futures, £9 of every £10 you planned to spend is still paid." */
export function howMuchParts(sf) {
  if (!sf || !sf.howLong || !(sf.howMuch < 1)) return null;
  const tenths = Math.floor(sf.howMuch * 10 + 1e-9);
  return tenths >= 1
    ? ['Across those futures, about ', F('£' + tenths), ' of every ', F('£10'), ' you planned to spend is still paid.']
    : ['Across those futures, less than ', F('£1'), ' of every ', F('£10'), ' you planned to spend is still paid.'];
}

/**
 * "If the money ran out at 88, you would still have £12,500 a year after tax from your State Pension." — a couple adds the
 * survivor's; before any State Pension starts, "nothing would come in until your State Pension starts at 67."
 */
export function floorParts(sf, lf) {
  if (!sf || !sf.floor) return null;
  const f = sf.floor;
  const lead = ['If the money ran out ', ...atAge(lf, f.age), ', '];
  if (!(f.yearly > 0)) {
    return f.spAge ? [...lead, 'nothing would come in until ', lf.couple ? 'the first State Pension starts, when the younger of you is ' : 'your State Pension starts at ', F(f.spAge), '.']
      : [...lead, 'nothing would come in from a pension then.'];
  }
  const from = f.fs ? 'from your pensions' : lf.couple && f.sp > 1 ? 'from your State Pensions' : f.sp ? 'from your State Pension' : 'from your pensions';
  return [...lead, 'you would still have ', F(money(f.yearly)), ' a year after tax', lf.couple ? ' between you' : '', ', ', from,
    ...(lf.couple && isNum(f.survivor) ? ['; if one of you has died by then, about ', F(money(f.survivor)), ' at least'] : []), '.'];
}

const WHO = { f: 'women', m: 'men' };

/** "women your age" / "men your age" / a couple: "couples your ages". */
const peopleLike = (lf) => (lf.couple ? 'couples your ages' : `${WHO[lf.sex.you] || 'women'} your age`);

/**
 * "What we assumed" (spec section 11): the plan-to age and the age followed on to, the figures used, a couple, the cap.
 * Each line { id, field, source, value, text: '', parts }: a line with a field links to the box that changes it.
 * `endAgeField`: the field that holds the end age ('endAge').
 */
export function lifeAssumed(lf, { endAgeField = 'endAge' } = {}) {
  const out = [];
  const line = (id, field, source, value, parts) => out.push({ id, field, source, value, text: '', parts: parts.flat().filter((p) => p !== '' && p != null) });
  const like = peopleLike(lf);
  const toWhom = lf.couple ? ['when the younger of you is ', F(lf.planToAge)] : [F(lf.planToAge)];
  if (lf.capped) {
    line('life-capped', null, 'rule', lf.capYears, ['We could test only to ', F(lf.weightToAge), ': ', F(lf.capYears), ' years is the most we run.']);
  }
  if (lf.rule === 'chosen') {
    const k = isNum(lf.liveLonger) ? Math.round(lf.liveLonger * 10) : null;
    const many = k === null ? [] : k <= 0 ? [' Fewer than 1 in 10 ', like, lf.couple ? ' still have one of you alive then' : ' live longer than that'] : k >= 10 ? [' Almost all ', like, lf.couple ? ' still have one of you alive then' : ' live longer than that']
      : [' About ', F(k), ' in ', F('10'), ' ', like, lf.couple ? ' still have one of you alive then' : ' live longer than that'];
    line('life-plan-to', endAgeField, 'entered', lf.planToAge, ['Your plan runs to ', ...toWhom, ', the age you chose.', ...many,
      lf.capped ? '.' : [many.length ? ', so we' : ' We', ' still follow each future on to ', F(lf.weightToAge), '.']]);
  } else {
    line('life-plan-to', endAgeField, 'default', lf.planToAge, ['Your plan runs to ', ...toWhom, ', when fewer than ', F('1'), ' in ', F('10'), ' ', like,
      lf.couple ? ' still have one of you alive.' : ' are still alive.',
      ...(lf.capped ? [] : [' We follow each future on to ', F(lf.weightToAge), ', when fewer than ', F('1'), ' in ', F('50'), lf.couple ? ' do.' : ' are.'])]);
  }
  const sexLine = (who) => {
    const field = `${who}.sex`;
    const id = who === 'you' ? 'life-sex' : 'life-sex-partner';
    if (!lf.given[who]) {
      line(id, field, 'default', 'notSaid', who === 'you'
        ? ['We used figures for women, who tend to live longer, because you did not say.']
        : ['For your partner we used figures for women, who tend to live longer, because you did not say.']);
    } else {
      const w = WHO[lf.sex[who]] || 'women';
      line(id, field, 'entered', lf.sex[who], who === 'you' ? [`We used the figures for ${w}, as you said.`] : [`For your partner we used the figures for ${w}, as you said.`]);
    }
  };
  sexLine('you');
  if (lf.couple) sexLine('partner');
  if (lf.couple) line('life-couple', null, 'rule', null, ['We work the money out as if you both live to the end of each future, and count each future by the chance at least one of you is still alive.']);
  return out;
}

/** The words a level's name leads with at Bold: "At Bold: " (the verdict names the level there). */
export const boldLead = (level) => (level === 'bold' ? 'At Bold: ' : '');

/** For the copy test: the most drawing years a run goes to. */
export const RUN_CAP_YEARS = RULES.maxDrawYears;
