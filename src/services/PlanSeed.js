/**
 * Plan seed — today's app's side of "keep this answer as a plan" (research/v7/save-as-plan.md, Contract C.2–C.5).
 *
 * V7 (the question pages at /v7/) writes ONE plain JSON object, the seed, to localStorage['pt_v7_plan_seed'] and opens
 * `/#new-plan`. Today's app reads it here, asks the person to confirm the plan's name, makes a NEW plan from it (two
 * linked plans for a couple), makes that plan the active one, and deletes the seed. No figure ever travels in an
 * address.
 *
 *   SEED_KEY, SEED_VERSION, SEED_VERSIONS, SEED_MAX_AGE_MS
 *                                               where the seed is kept, the version V7 writes now, the versions this code
 *                                               reads (1, 2 and 3), its life
 *   checkSeed(seed, nowMs)                      → { ok: true } | { ok: false, problem, detail }
 *   readSeed(storage, nowMs)                    → { seed } | { problem, createdAt? }; a seed with any problem is DELETED
 *   clearSeed(storage, createdAt?)              deletes it — only if it is still the seed `createdAt` names, when given
 *                                               (a newer seed written meanwhile is never deleted by an older one's use)
 *   seedStillWaiting(storage, createdAt)        the seed read at start is still the one stored (re-checked before a save)
 *   RECEIPT_KEY, writeReceipt(session, createdAt, outcome, name?)
 *                                               what became of a seed — 'made' | 'declined' | 'refused' | 'cleared' —
 *                                               left in THIS TAB's session storage for the V7 page that sent it, which
 *                                               the same tab goes Back to. No figure: the seed's time, the outcome, and
 *                                               the name only when a plan was made under it
 *   dropSeed(storage, session)                  sign-out: the seed deleted, whatever it is, and a 'cleared' receipt
 *   takeSeedEntry(storage, nowMs, hash, drop, session)
 *                                               the start-up read: { wanted, seed, problem }; `drop()` clears '#new-plan'
 *   seedToScenario(seed, today, { name, partnerName })
 *                                               → { yours, partner } — the plan documents, without ids (Contract C.3, C.5)
 *   cleanPlanName / checkPlanName / uniqueName  the name rules of Contract C.4
 *   createPlansFromSeed({ seed, name, today, takenNames }, { create, setActive, remove })
 *                                               the create path: partner first (inactive), then yours, then active
 *   confirmAndCreate(seed, app)                 the confirm step, with every effect handed in (app.ask, app.create …)
 *   seedConfirmText, seedSavedNote, questionHref, SEED_WORDS   the words the entry shows
 *   budgetSummaryWords(figures, guide, money)   the Budget page's three lines about the plan's target: today's words, or
 *                                               — on a plan made from a V7 answer — the budget as a guide beside the
 *                                               target the person chose (owner, 1 Oct 2026)
 *   householdStartWords(own, partner)           the Household tab's line when one of the two plans begins later than the
 *                                               other (research/v7/couples-different-years.md 7); '' when they begin together
 *
 * Seed version 2 (6.20.0, research/v7/couples-different-years.md 6): a couple may stop work in different years. Each
 * person carries their own `stop` and `years` (so both plans end in the same tax year) and the seed an `untilBothStop`
 * ({ payCovers }, or null). Each plan starts at its own person's stop; the savings between them are in the plan of
 * whoever stops first; the budget's flags are per person. A version 1 seed (a V7 tab opened before 6.20.0) is still read,
 * as version 2 with each person at the household's stop, and makes exactly the plans 6.19.0 made — its record
 * (`fromAnswer`) included (tests/planSeed.test.js holds it to the frozen 6.19.0 copy). A planner that reads only version 1
 * refuses a version 2 seed rather than make wrong plans from it.
 *
 * Seed version 3 (research/v7/spending-shape.md 8): what is spent changes with age. Every version 2 field, plus
 * `spend.shape` (the shape as the answer tested it: for the record and the description) and each person's `takeHome` rows
 * exact to the year. The target is then today's own sum on each year — g(y) = round(grossUpAnnual(perMonth(y) × 12)) —
 * made into the fewest income steps whose compiled amount is g(y) to the pound in every year (compressSteps): a level
 * stretch one step, a stretch that moves evenly one glide, a stretch that falls at a typed rate one decline where it can be
 * (below the personal allowance, where after tax is before tax), otherwise one step a year. So the plan targets the
 * answer's after-tax amount every year, and nothing drifts when it is saved again. A planner that reads only 1 and 2
 * refuses a version 3 seed (the rule above).
 *
 * Pure: no storage, DOM or clock of its own — `storage`, `nowMs`, `today` and the create functions are passed in.
 *
 * The rules this file keeps (owner, 1 Oct 2026):
 *  - the plan is named by the person; the suggestion comes from V7 and is never "My plan";
 *  - the budget is a guide only: NOTHING here reads the budget to set a figure. The target is the monthly amount the
 *    person chose (spend.perMonth, split per person in takeHome); the budget lines are copied into the Budget tool as
 *    they are, and nothing else (no essentials floor, no headroom, no total);
 *  - the drawing mix is the risk level the person chose: the INTENDED portfolio. No fund list, no holdings;
 *  - saving always creates new plans (createScenario: a new document id every time) and never writes to an existing
 *    plan, except the `isActive` flag that making the new plan active moves (the same write as picking a plan in the
 *    menu — Contract Q12).
 */
import { taxYearLabel } from './PlanTiming.js';
import {
  SEED_VERSION, SEED_VERSIONS, SEED_MAX_AGE_MS, SEED_FUTURE_SLACK_MS, PLAN_NAME_LIMITS, SEED_WORDS, QUESTION_TITLES,
  isObj, isNum, gbp, pot, localDate, localDay, cleanPlanName, checkPlanName, uniqueName, checkSeed, asVersion2, apartOf,
  PLANNER_DECLINE, compressSteps, answerLastedWords, differenceWords, coupleWords, seedToScenario, targetAtAge
} from './PlanFromSeed.js';

// The pure part — the seed's versions and life, the name rules, the seed check, the mapping to a plan — lives in
// services/PlanFromSeed.js since 6.39.0 (the preview makes a plan itself: road-to-7.md step 7). Every name is kept here.
export {
  SEED_VERSION, SEED_VERSIONS, SEED_MAX_AGE_MS, SEED_FUTURE_SLACK_MS, PLAN_NAME_LIMITS, SEED_WORDS,
  localDate, localDay, cleanPlanName, checkPlanName, uniqueName, checkSeed,
  PLANNER_DECLINE, compressSteps, answerLastedWords, seedToScenario, targetAtAge
};

export const SEED_KEY = 'pt_v7_plan_seed';
export const NEW_PLAN_HASH = '#new-plan';

/** The receipt V7 reads on coming Back (this tab's session storage; src/answers/keep/planSeed.js has the same key). */
export const RECEIPT_KEY = 'pt_v7_plan_receipt';
export const RECEIPT_OUTCOMES = Object.freeze(['made', 'declined', 'refused', 'cleared']);
const RECEIPT_KEEP = 8;

/** The createdAt of what is stored now: a string, or null (nothing there, unreadable, or storage refused). */
function storedCreatedAt(storage) {
  try {
    const text = storage.getItem(SEED_KEY);
    if (text == null) return null;
    const seed = JSON.parse(text);
    return isObj(seed) && typeof seed.createdAt === 'string' ? seed.createdAt : null;
  } catch (e) { return null; }
}

/**
 * Delete the seed. Never throws (a browser that refuses storage has nothing kept to delete). With `createdAt`, only the
 * seed of that time is deleted: one used (or declined) here never deletes a newer one another window wrote meanwhile.
 */
export function clearSeed(storage, createdAt = null) {
  if (createdAt != null && storedCreatedAt(storage) !== createdAt) return;
  try { storage.removeItem(SEED_KEY); } catch (e) { /* storage refused: nothing was kept */ }
}

/** Is the seed read at start (its createdAt) still the one stored? False when it was used, replaced or cannot be read. */
export function seedStillWaiting(storage, createdAt) {
  return typeof createdAt === 'string' && storedCreatedAt(storage) === createdAt;
}

/**
 * Leave a receipt for the V7 page that sent the seed: the same tab goes Back to it, and it then says "Saved as …" only
 * when a plan was made — never on "Not now", a refused seed or a sign-out (found 1 Oct 2026: it took any missing seed
 * to mean the plan was made). Kept in the tab's session storage, which closes with the tab; the last few only. No
 * figure: the seed's time (its id), the outcome, and the name only when a plan was made under it. Never throws.
 * @returns {boolean} written
 */
export function writeReceipt(session, createdAt, outcome, name = null) {
  if (!session || typeof createdAt !== 'string' || !RECEIPT_OUTCOMES.includes(outcome)) return false;
  try {
    let all = null;
    try { all = JSON.parse(session.getItem(RECEIPT_KEY) || 'null'); } catch (e) { all = null; }
    if (!isObj(all)) all = {};
    delete all[createdAt];
    all[createdAt] = outcome === 'made' && typeof name === 'string' ? { outcome, name } : { outcome };
    const keys = Object.keys(all);
    for (const k of keys.slice(0, Math.max(0, keys.length - RECEIPT_KEEP))) delete all[k];
    session.setItem(RECEIPT_KEY, JSON.stringify(all));
    return true;
  } catch (e) { return false; }
}

/** Sign-out (every way: the menu, the idle timer, the verify-email screen): the seed goes, whatever it is. */
export function dropSeed(storage, session) {
  const createdAt = storedCreatedAt(storage);
  clearSeed(storage);
  if (createdAt) writeReceipt(session, createdAt, 'cleared');
}

/**
 * Read the seed. A seed with any problem — unreadable, a version this code does not know, more than a day old, dated
 * ahead of this clock, or missing a field — is deleted on the spot (and its time given back, when it had one, so the
 * caller can leave a 'refused' receipt). A good seed is left in place until it is used.
 * @returns {{ seed: object } | { problem: 'none'|'storage'|'unreadable'|'version'|'expired'|'future'|'shape', createdAt?: string }}
 */
export function readSeed(storage, nowMs) {
  let text;
  try { text = storage.getItem(SEED_KEY); } catch (e) { return { problem: 'storage' }; }
  if (text == null) return { problem: 'none' };
  let seed;
  try { seed = JSON.parse(text); } catch (e) { seed = undefined; }
  const c = seed === undefined ? { ok: false, problem: 'unreadable' } : checkSeed(seed, nowMs);
  if (!c.ok) {
    clearSeed(storage);
    return isObj(seed) && typeof seed.createdAt === 'string' ? { problem: c.problem, createdAt: seed.createdAt } : { problem: c.problem };
  }
  return { seed };
}

/**
 * The read the app makes every time it starts (Contract C.2 step 1). Bad and old seeds are deleted whatever the
 * address (with a 'refused' receipt in this tab); `wanted` is true when the address is '#new-plan', which `dropHash()`
 * then clears so a reload does not ask twice. A good seed is offered only when wanted.
 * @returns {{ wanted: boolean, seed: object|null, problem: string|null }}
 */
export function takeSeedEntry(storage, nowMs, hash, dropHash, session = null) {
  const r = readSeed(storage, nowMs);
  if (r.problem && r.createdAt) writeReceipt(session, r.createdAt, 'refused');
  const wanted = String(hash || '') === NEW_PLAN_HASH;
  if (wanted && typeof dropHash === 'function') { try { dropHash(); } catch (e) { /* the address stays; harmless */ } }
  return { wanted, seed: wanted && r.seed ? r.seed : null, problem: r.problem || null };
}


// ---- creating the plans (Contract C.2 step 7) --------------------------------------------------------------------------

/**
 * Make the plan(s): the partner's first (not active), then yours with the link to it, then yours made active. Only
 * `create` writes plans, and it always makes a NEW document. If yours cannot be made, the partner plan made a moment
 * before is deleted again, and nothing else is touched. A failure to make yours active leaves both plans made
 * (`activeError` says so); saving again would only make copies.
 * @param {{ seed: object, name: string, today: Date|string, takenNames?: string[] }} what
 * @param {{ create: (plan: object) => Promise<string>, setActive: (id: string) => Promise<void>, remove: (id: string) => Promise<void> }} store
 * @returns {Promise<{ yours: { id: string, name: string }, partner: { id: string, name: string } | null, activeError: Error|null }>}
 */
export async function createPlansFromSeed({ seed, name, today, takenNames = [] }, { create, setActive, remove }) {
  const checked = checkPlanName(name);
  if (!checked.ok) throw new Error(checked.message);
  // The final names first: a couple's two descriptions name each other's plan.
  const yourName = uniqueName(checked.name, takenNames);
  const partnerName = seed.household === 'couple' ? uniqueName(checked.name + ' · partner', [...takenNames, yourName]) : null;
  const { yours, partner } = seedToScenario(seed, today, { name: yourName, ...(partnerName ? { partnerName } : {}) });
  yours.planDetails.name = yourName;
  let partnerMade = null;
  if (partner) {
    partner.planDetails.name = partnerName;
    delete partner.id;
    const id = await create({ ...partner, isActive: false });
    if (!id) throw new Error('the plan could not be made');
    partnerMade = { id, name: partnerName };
    yours.household = { partnerScenarioId: id };
  }
  delete yours.id;
  let yourId;
  try {
    yourId = await create({ ...yours, isActive: false });
    if (!yourId) throw new Error('the plan could not be made');
  } catch (e) {
    if (partnerMade) { try { await remove(partnerMade.id); } catch (e2) { /* nothing more to undo */ } }
    throw e;
  }
  let activeError = null;
  try { await setActive(yourId); } catch (e) { activeError = e instanceof Error ? e : new Error(String(e)); }
  return { yours: { id: yourId, name: yourName }, partner: partnerMade, activeError };
}

/**
 * The confirm step (Contract C.2 steps 6–9), with every effect handed in:
 *   app.listNames()        every plan name in the account (or this tab)
 *   app.ask(text, name)    shows the line and the name box; resolves the name, or null for "Not now" (or closed)
 *   app.warn(message)      a plain message (a name refused, a save that failed)
 *   app.create / setActive / remove   as createPlansFromSeed
 *   app.now()              today
 *   app.storage            where the seed is kept
 *   app.session            this tab's session storage, for the receipt V7 reads on coming Back (may be null)
 * "Not now" deletes THIS seed (never a newer one) and leaves a 'declined' receipt. A refused name asks again. Before
 * anything is made the stored seed is read again: if it went, or another replaced it, while the box was open (another
 * window used it), nothing is made — two windows never make two plans from one seed. A save that fails keeps the seed
 * and asks again. A plan made: the seed deleted, a 'made' receipt with the final name.
 * @returns {Promise<{ outcome: 'made', made: object, hadPlans: boolean } | { outcome: 'notNow' } | { outcome: 'gone' }>}
 */
export async function confirmAndCreate(seed, app) {
  let taken = [];
  try { taken = (await app.listNames()) || []; } catch (e) { taken = []; }
  let name = seed.name.chosen;
  for (;;) {
    const typed = await app.ask(seedConfirmText(seed), name);
    if (typed == null) {
      clearSeed(app.storage, seed.createdAt);
      writeReceipt(app.session, seed.createdAt, 'declined');
      return { outcome: 'notNow' };
    }
    name = typed;
    const checked = checkPlanName(typed);
    if (!checked.ok) { app.warn(checked.message); continue; }
    if (!seedStillWaiting(app.storage, seed.createdAt)) {
      app.warn(SEED_WORDS.usedElsewhere);
      writeReceipt(app.session, seed.createdAt, 'refused');
      return { outcome: 'gone' };
    }
    try {
      const made = await createPlansFromSeed({ seed, name: checked.name, today: app.now(), takenNames: taken }, app);
      clearSeed(app.storage, seed.createdAt);
      writeReceipt(app.session, seed.createdAt, 'made', made.yours.name);
      return { outcome: 'made', made, hadPlans: taken.length > 0 };
    } catch (e) {
      app.warn(SEED_WORDS.failed(e && e.message));
    }
  }
}

// ---- the words of the entry -----------------------------------------------------------------------------------------

/** A monthly amount the answer worked out: to the nearest £10 from £1,000, £5 below (language guide 3.5). */
const aboutMonthly = (n) => gbp(n >= 1000 ? Math.round(n / 10) * 10 : Math.round(n / 5) * 5);

/**
 * "Stop at 60, £1,800 a month, a pension of about £341,000 then" — what the plan holds, in one line. Money still going
 * in is said too (found 1 Oct 2026: B's confirm step named its pay-in only in the name box), and for B the pay-in the
 * answer worked out when it is more: "paying in £1,050 a month as now (the answer suggested about £4,660)".
 */
export function seedSummary(seed) {
  if (apartOf(seed)) return apartSummary(seed);
  const later = seed.stop.kind === 'later';
  const ages = seed.people.map((p) => p.ageAtStop).join(' and ');
  // seed version 3: what is spent changes with age, as the answer was given it (the description lists the steps)
  let line = (later ? 'Stop at ' : 'From ') + ages + ', ' + gbp(seed.spend.perMonth) + ' a month' + (seed.seedVersion === 3 ? ' at the start, changing with age as you set it' : '');
  const paying = later ? seed.people.reduce((t, p) => t + (p.payIn && p.payIn.total > 0 ? p.payIn.total : 0), 0) : 0;
  const needed = seed.source === 'b' && seed.answer && isNum(seed.answer.payInNeeded) ? seed.answer.payInNeeded : null;
  if (paying > 0) {
    line += ', paying in ' + gbp(paying) + ' a month' + (seed.source === 'b' ? ' as now' : '');
    if (needed !== null && needed > paying + 0.5) line += ' (the answer suggested about ' + aboutMonthly(needed) + ')';
  } else if (later && needed !== null && needed > 0.5) {
    line += ', paying in nothing now (the answer suggested about ' + aboutMonthly(needed) + ' a month)';
  }
  const pensions = seed.people.map((p) => (later ? p.pension.atStop.middling : p.pension.today));
  if (!pensions.some((v) => v > 0)) return line;
  const many = pensions.length > 1;
  const figures = pensions.map((v) => (later ? pot(v) : gbp(v))).join(' and ');
  return line + ', ' + (many ? 'pensions of ' : 'a pension of ') + (later ? 'about ' : '') + figures + (later ? ' then' : '');
}

/**
 * seedSummary for a couple who stop in different years: "You stop at 60 and your partner at 62, £3,200 a month once
 * you've both stopped, …" or "You from now and your partner from 56, …"; the money still going in; each pension at its
 * holder's own stop ("about" only for what the answer worked out).
 */
function apartSummary(seed) {
  const people = seed.people;
  const bothLater = people.every((p) => p.stop.kind === 'later');
  const [you, partner] = people;
  const when = (p) => (p.stop.kind === 'now' ? 'now' : String(p.ageAtStop));
  let line = (bothLater ? `You stop at ${you.ageAtStop} and your partner at ${partner.ageAtStop}` : `You from ${when(you)} and your partner from ${when(partner)}`)
    + ', ' + gbp(seed.spend.perMonth) + ' a month' + (seed.seedVersion === 3 ? ' at the start (changing with age as you set it)' : ' once you\'ve both stopped');
  const paying = people.reduce((t, p) => t + (p.stop.kind === 'later' && p.payIn && p.payIn.total > 0 ? p.payIn.total : 0), 0);
  const needed = seed.source === 'b' && seed.answer && isNum(seed.answer.payInNeeded) ? seed.answer.payInNeeded : null;
  if (paying > 0) {
    line += ', paying in ' + gbp(paying) + ' a month' + (seed.source === 'b' ? ' as now' : '');
    if (needed !== null && needed > paying + 0.5) line += ' (the answer suggested about ' + aboutMonthly(needed) + ')';
  } else if (needed !== null && needed > 0.5) {
    line += ', paying in nothing now (the answer suggested about ' + aboutMonthly(needed) + ' a month)';
  }
  const pension = (p) => (p.stop.kind === 'later' ? p.pension.atStop.middling : p.pension.today);
  if (!people.some((p) => pension(p) > 0)) return line;
  if (bothLater) return line + ', pensions of about ' + pot(pension(you)) + ' at ' + you.ageAtStop + ' and ' + pot(pension(partner)) + ' at ' + partner.ageAtStop;
  const each = (p) => (p.who === 'you' ? 'your pension ' : 'your partner\'s ') + (p.stop.kind === 'later' ? 'about ' + pot(pension(p)) + ' at ' + p.ageAtStop : gbp(pension(p)) + ' now');
  return line + ', ' + people.map(each).join(' and ');
}

/** The confirm step's words, above the name box. */
export function seedConfirmText(seed) {
  const read = asVersion2(seed);
  return 'A new plan from your quick answer: ' + seedSummary(seed) + '. ' + differenceWords(read, read.people[0]) + ' Name the plan:';
}

/**
 * The note the planner opens with: the name(s) it was saved as, why its own test can differ (with the quick answer's
 * figure), and for a couple whose part this plan holds. The same words are in the plan's description, which stays.
 */
export function seedSavedNote(made, seed = null) {
  const names = '‘' + made.yours.name + '’' + (made.partner ? ' and ‘' + made.partner.name + '’ for your partner' : '');
  const open = made.activeError ? ' It could not be opened just now: choose it from the plan menu.' : '';
  if (!seed) return 'Made from your quick answer: saved as ' + names + '.' + open + ' The planner runs its own test, so its figures can differ from the quick answer.';
  const read = asVersion2(seed);
  const couple = made.partner ? ' ' + coupleWords(read, read.people[0], { yours: made.yours.name, partner: made.partner.name }) : '';
  return 'Made from your quick answer: saved as ' + names + '.' + open + ' ' + differenceWords(read, read.people[0]) + couple;
}

/**
 * The Budget page's three lines about the plan's target (index.html updateBudgetSummary).
 *  - No guide (a plan made in the planner): today's words, exactly as they were.
 *  - A guide (planTargetGuide: a plan made from a V7 answer): the budget's total is a guide shown beside the target the
 *    person chose, which is what the plan works to. Found 1 Oct 2026: the page said the budget's total, with an averaged
 *    allowance for one-offs added, was "what your plan funds" and "the target both tools work to" — it was neither, and
 *    the owner's rule is that the budget never formulates how much they need.
 * @param {{ allInMonthly: number, allInAnnual: number, periodicMonthly: number, useMonthly?: number, plusTen?: boolean, targetGrossAnnual: number, shared: boolean }} f
 * @param {null | { monthly: number, grossAnnual: number, steps: boolean }} guide
 * @param {(n: number) => string} money
 * @returns {{ allInCaption: string, handoff: string, targetLine: string }}   HTML (figures and fixed words only)
 */
export function budgetSummaryWords(f, guide, money) {
  if (!guide) {
    // A plan made in the planner (6.23.0, usability audit decision 6): the budget is a guide, and says so. Only the
    // button changes the plan; `useMonthly` is the figure it would use (the budget, or the budget with a tenth on top).
    const useM = f.useMonthly != null ? +f.useMonthly : +f.allInMonthly;
    const plusTen = !!f.plusTen;
    return {
      allInCaption: money(f.allInAnnual) + '/yr — a guide; it changes nothing until you use it',
      handoff: (f.shared ? 'Your share of the budget adds up to <strong>' : 'Your budget adds up to <strong>') + money(f.allInMonthly) + '/mo</strong> take-home'
        + (f.periodicMonthly > 0 ? ', including ' + money(f.periodicMonthly) + '/mo set aside for the periodic costs' : '')
        + '. The budget is a guide. Only “Use as my spending” changes the plan — and it changes one thing, the plan’s spending figure. Age bands and one-off costs stay here, for your eye.',
      targetLine: 'If you use it: <strong>' + money(useM) + '/mo take-home</strong> <span style="color:var(--text-muted);">(≈ ' + money(f.targetGrossAnnual) + '/yr before tax' + (plusTen ? ' — your budget with a tenth on top' : '') + ')</span>'
    };
  }
  const yours = f.shared ? ' (your part)' : '';
  const start = guide.steps ? ' to start with' : '';
  return {
    allInCaption: money(f.allInAnnual) + '/yr — a guide; this plan’s target' + yours + ' is ' + money(guide.monthly) + '/mo',
    handoff: (f.shared ? 'Your share of the budget adds up to <strong>' : 'Your budget adds up to <strong>') + money(f.allInMonthly) + '/mo</strong>'
      + (f.periodicMonthly > 0 ? ', including ' + money(f.periodicMonthly) + '/mo set aside for one-offs' : '')
      + '. This plan’s target' + yours + ' is <strong>' + money(guide.monthly) + '/mo</strong> take-home' + start
      + ', the figure you chose. The budget is a guide to it: it does not change the target.',
    targetLine: 'Plan target: <strong>' + money(guide.monthly) + '/mo take-home</strong>' + start + ' <span style="color:var(--text-muted);">(≈ '
      + money(guide.grossAnnual) + '/yr before tax) — the figure you chose; it is set in Stress tester → Settings → Your income shape.</span>'
  };
}

/**
 * The Household tab's line when one of the two plans begins later than the other (research/v7/couples-different-years.md
 * 7): a plan made for someone still working starts at their stop, and until then the tab counts nothing from it — their
 * pay covers their part — and holds their pot at what it is expected to be when they stop. Words only: the joint check
 * itself already lines the two plans up by their start (HouseholdService startOffset). '' when they begin together.
 * Which begins later is read from the plans' own first tax years when both have one (deriveTiming): two plans that begin
 * in the same tax year say nothing, whatever their rounded offsets — currentAgeNow does not follow the birthday, so two
 * plans whose ages were typed on different dates can round to offsets 2 and 1 in the same tax year (the reviewers'
 * finding, 2 Oct 2026). Without both years, by the offsets.
 * @param {{ offset: number, firstTaxYear?: number }} own       this plan (you): years until it begins (startOffset) and its first tax year
 * @param {{ offset: number, firstTaxYear?: number }} partner   the partner's plan
 * @returns {string}   plain text (no markup)
 */
export function householdStartWords(own, partner) {
  const ya = +(own && own.firstTaxYear), yb = +(partner && partner.firstTaxYear);
  const years = Number.isInteger(ya) && ya > 0 && Number.isInteger(yb) && yb > 0;
  const a = years ? ya : Math.max(0, +(own && own.offset) || 0);
  const b = years ? yb : Math.max(0, +(partner && partner.offset) || 0);
  if (a === b) return '';
  const theirs = b > a;
  const year = +(theirs ? partner : own).firstTaxYear;
  const when = Number.isInteger(year) && year > 0 ? ' in ' + taxYearLabel(year) : ' later';
  return theirs
    ? `Your partner's plan begins${when}, when they stop work. Until then their pay covers their part, and what they pay in is in that plan's pot at the start. Before then, “What you'd have left” counts their pot as it is expected to be when they stop.`
    : `This plan begins${when}, when you stop work. Until then your pay covers your part, and what you pay in is in this plan's pot at the start. Before then, “What you'd have left” counts your pot as it is expected to be when you stop.`;
}

/** The way back to the question the plan came from, relative to the app's root. */
export function questionHref(source) {
  return 'v7/#/' + (QUESTION_TITLES[source] ? source : 'c') + '/answer';
}

