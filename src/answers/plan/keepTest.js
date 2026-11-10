/**
 * "Test what you keep against your plan" and "I accept this risk" (7.7.0) — generic: any plan, any strategy, anything held
 * that the plan as locked did not have. The plan's settings and its document stay exactly as locked; this reads what the
 * person chose to keep (HoldingsRecord: a line's `keep`, the record's `expected`) into the plan's own inputs, so the plan's
 * own one test can be run on them (keepRun.js, the lazy engine), and says the result and the agreement plainly — as
 * consequences, never as advice. Pure: the plan brought up to date in memory, today's date; nothing here runs, writes or
 * reads a clock.
 *
 *   keptAssetsOf(rec)                          each kept line: its wrapper, value, asset class (the fund tagging), whether
 *                                              it is counted toward the plan, and whether it reads as one company's shares
 *   heldSettingsOf(settings, rec, o)           a pot plan's inputs as held (any strategy but a bought ladder): the locked
 *                                              settings with the pension re-described — what is kept and not counted toward
 *                                              the plan taken out, what is counted in its own asset class, the rest in the
 *                                              plan's own mix; money expected later as lump sums (o.withExpected); a shock
 *                                              to what is kept by choice (o.shock: 'half' | 'nothing')
 *   ladderGapsOf(plan, o)                      a bought ladder's years as held: the gap of each tax year (today's money) once
 *                                              what stands in has paid, the cash has been used and the money still to buy
 *                                              rungs runs out; the money that can fill the gaps (kept and counted, by class;
 *                                              money expected, by tax year)
 *   keepTestOf(plan, { today, result })        everything the screens say: the state of the agreement, the to-do, the
 *                                              result side by side, the lines for the home and About (ids and slots)
 *   amendPatch(plan, result, { today, at })    → { ok, patch: { planAmendments }, previous, line }: "I accept this risk"
 *   withdrawPatch(plan)                        → the same: the last agreement taken off
 */
import { normaliseHoldings, normaliseKeep, expectedOf } from '../../services/HoldingsRecord.js';
import { ledgerView, isGiltTicker, inTodaysMoney, yearNeedsOf } from '../../services/TransitionPlanner.js';
import { catalogueEntry } from '../../services/SubAssetModel.js';
import { deriveTiming, taxYearStartOf, taxYearOfMonth, taxYearLabel } from '../../services/PlanTiming.js';
import { amendmentState, amendmentEntry, amendmentsWith, amendmentsWithoutLast, keepFingerprint, keepsLines, lineKeysOf, holdingsKeyOf } from '../../services/PlanAmendments.js';
import { gapsOf } from './gaps.js';
import { savedMove } from './move.js';
import { pounds } from './income.js';
import { dateOf, dayWords } from './dates.js';
import { futuresOutOfTen } from '../../services/OneAnswer.js';
import { AMEND_WRITES } from './schema.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const r0 = (v) => Math.round(num(v));
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const POTS = Object.freeze({ shares: 'equityMin', bonds: 'bondMin', cash: 'cashTarget', diversifiers: 'diversifierStart' });

/** A shock to what is kept by choice: half its value, or (for one company's shares) nothing. */
export const SHOCKS = Object.freeze({ half: 0.5, nothing: 0 });

/**
 * Each kept line, read by the fund tagging the move uses (TransitionPlanner.ledgerView): { key, label, wrapper, value, as,
 * counted, bucket, single }. `counted`: it pays the plan — it stands in for some years, or it is kept by choice and counted
 * toward the gaps. `bucket`: shares, bonds, cash or diversifiers (a gilt is bonds; a line nothing places is tested as shares).
 * `single`: a line no fund in the catalogue matches and that is not a gilt or cash — tested on the futures of shares (a world
 * share fund's), and it may be one company's shares, which can fall much further than a world fund (the shocks say that).
 * Each row's key is its own line's (PlanAmendments.lineKeysOf), never taken by place: a kept line with no value and no units
 * (which the ledger leaves out) moves no other line's key.
 */
export function keptAssetsOf(rec) {
  const r = normaliseHoldings(rec);
  const rows = ledgerView(r.lines);
  const all = lineKeysOf(r);
  // the ledger keeps the lines with a value or units, in order: their keys, in the same order
  const keys = r.lines.map((l, i) => [l, all[i]]).filter(([l]) => l && (num(l.value) > 0 || num(l.units) > 0)).map(([, k]) => k);
  return rows.map((h, i) => [h, keys[i]]).filter(([h]) => h.keep).map(([h, key]) => {
    const keep = normaliseKeep(h.keep);
    const bucket = h.cash ? 'cash' : h.gilt ? 'bonds' : (h.bucket || 'shares');
    const single = !h.cash && !h.gilt && !isGiltTicker(h.ticker) && bucket === 'shares' && !catalogueEntry(h.ticker);
    return { key: key || null, label: h.name || h.ticker || '', wrapper: h.wrapper, value: r0(h.value), as: keep.as, counted: keep.as === 'rung' || !!keep.fundsGaps, bucket, single };
  });
}

/** What a shock leaves of a kept-by-choice line: half, or nothing for one company's shares (the others as they are). */
const shockFactor = (a, shock) => (a.as !== 'mine' ? 1 : shock === 'half' ? SHOCKS.half : shock === 'nothing' ? (a.single ? SHOCKS.nothing : 1) : 1);

/** Where money expected later lands in a pot plan's lumps: a pension into the pension, an ISA into the ISA, else cash. */
const lumpWrapper = (w) => (w === 'SIPP' ? 'pension' : w === 'ISA' ? 'isa' : 'cash');

/** The tax year money expected arrives in: its month's, never before this one; with no month, next April. */
export function arrivalYearOf(e, now) {
  const thisTY = taxYearStartOf(now);
  if (!e || !e.by) return thisTY + 1;
  return Math.max(thisTY, taxYearOfMonth(e.by));
}

/** The balances outside the pension a kept line can sit in: the ISA and the taxable account (the settings' own fields). */
const OUTSIDE = Object.freeze({ ISA: 'isaBalance', GIA: 'taxableStart' });

/**
 * A pot plan's inputs as held (see the header). The settings given are never changed; a record that keeps nothing and
 * expects nothing gives the settings back as they are. The pension's kept lines re-describe its pots; a line kept in the ISA
 * or the taxable account is its share of that balance: left out when it is not counted toward the plan, and taking the shock
 * when it is (the balance itself grows as the plan says it does).
 * @param {object} settings   the plan's effective Stress settings (PlanReading.effectiveStressSettings)
 * @param {object} rec        the holdings record
 * @param {{ withExpected?: boolean, shock?: null|'half'|'nothing', now: Date }} o
 */
export function heldSettingsOf(settings, rec, { withExpected = true, shock = null, now } = {}) {
  const s = copy(settings || {});
  const r = normaliseHoldings(rec);
  const pension = ledgerView(r.lines).filter((h) => h.wrapper === 'SIPP' && h.value > 0);
  const H = pension.reduce((t, h) => t + h.value, 0);
  const T = Object.values(POTS).reduce((t, k) => t + num(s[k]), 0);
  const kept = keptAssetsOf(r).filter((a) => a.wrapper === 'SIPP' && a.value > 0);
  if (H > 0 && T > 0 && kept.length) {
    const out = { shares: 0, bonds: 0, cash: 0, diversifiers: 0 };
    let keptShare = 0;
    for (const a of kept) {
      const w = Math.min(1, a.value / H);
      keptShare += w;
      if (a.counted) out[a.bucket] += T * w * shockFactor(a, shock);
    }
    const rest = Math.max(0, 1 - keptShare);
    for (const [b, k] of Object.entries(POTS)) out[b] += rest * num(s[k]);
    for (const [b, k] of Object.entries(POTS)) s[k] = Math.round(out[b]);
    const total = Object.values(POTS).reduce((t, k) => t + num(s[k]), 0);
    const f = T > 0 ? total / T : 1;
    // a pinned pension total (a bought strategy's own dial) and a saver's projected pension move with the pots
    if (isObj(s.strategyParams) && num(s.strategyParams.sippTotal) > 0) s.strategyParams = { ...s.strategyParams, sippTotal: Math.round(s.strategyParams.sippTotal * f) };
    if (isObj(s.potAtRetirement) && num(s.potAtRetirement.sipp) > 0) s.potAtRetirement = { ...s.potAtRetirement, sipp: Math.round(s.potAtRetirement.sipp * f) };
  }
  for (const [wrapper, field] of Object.entries(OUTSIDE)) {
    const held = ledgerView(r.lines).filter((h) => h.wrapper === wrapper && h.value > 0).reduce((t, h) => t + h.value, 0);
    const B = num(s[field]);
    const keptHere = keptAssetsOf(r).filter((a) => a.wrapper === wrapper && a.value > 0);
    if (!(held > 0) || !(B > 0) || !keptHere.length) continue;
    // what is left of the balance: each kept line's share out when it is not counted, its shock's fall out when it is
    let lose = 0;
    for (const a of keptHere) { const w = Math.min(1, a.value / held); lose += a.counted ? w * (1 - shockFactor(a, shock)) : w; }
    const f = Math.max(0, 1 - lose);
    s[field] = Math.round(B * f);
    if (wrapper === 'ISA' && isObj(s.potAtRetirement) && num(s.potAtRetirement.isa) > 0) s.potAtRetirement = { ...s.potAtRetirement, isa: Math.round(s.potAtRetirement.isa * f) };
  }
  const exp = withExpected ? expectedOf(r) : [];
  if (exp.length) {
    const first = deriveTiming(s, now).firstTaxYear || taxYearStartOf(now);
    const lumps = exp.map((e) => ({ label: e.label || 'Money expected', amount: r0(e.amount), year: Math.max(0, arrivalYearOf(e, now) - first), wrapper: lumpWrapper(e.wrapper), indexation: 'level' }));
    s.windfalls = [...(Array.isArray(s.windfalls) ? s.windfalls : []), ...lumps];
  }
  return s;
}

/**
 * A bought ladder's years as held (see the header): { gaps: { [Y]: £ }, firstYear, lastYear, fund: { flat, shares }, arrivals:
 * { [Y]: £ } }. The gaps are the plan's own needs (today's money) less what is held for them: the rungs, what stands in (a
 * fixed pay at today's prices), the pension's cash (the gaps reader, answers/plan/gaps.js), and the rungs the money cannot
 * buy once what is kept is not sold — the move's own order (cash years first, then rungs by maturity), so the latest rungs go
 * short first. The fund is what is kept by choice and counted toward the gaps (shares ride the test's futures; the rest
 * holds its value); `arrivals` the money expected later, at today's prices, in the tax year it arrives.
 * @param {object} plan
 * @param {{ today: string, withExpected?: boolean, shock?: null|'half'|'nothing' }} o
 */
export function ladderGapsOf(plan, { today, withExpected = true, shock = null } = {}) {
  const now = dateOf(today);
  const g = gapsOf(plan, { today });
  const s = savedMove(plan, { today });
  const doc = plan && plan.planDocument;
  const needs = yearNeedsOf(doc);
  const gaps = {};
  const add = (Y, v) => { if (v > 0.5) gaps[+Y] = (gaps[+Y] || 0) + v; };
  for (const row of (g && g.rows) || []) add(row.Y, row.gap);
  // the rungs and cash the money cannot buy: what the buys cost less what the sales and the money paid in until the start bring
  const D = s.m && s.m.diff;
  const seq = s.seq;
  let short = D && seq ? Math.max(0, num(seq.totals.buy) - num(seq.totals.sell) - num(seq.totals.contributions)) : 0;
  if (D && short > 0) {
    const order = (b) => (b.kind === 'cash' ? 0 : 1 + (b.matures ? Date.parse(b.matures) / 1e13 : 0.5));
    const buys = D.buy.slice().sort((a, b) => order(b) - order(a));   // the last bought first
    const cashRows = ((g && g.rows) || []).filter((x) => x.toBuy > 0).sort((a, b) => b.Y - a.Y);
    for (const b of buys) {
      if (!(short > 0)) break;
      const amount = num(b.amount);
      if (!(amount > 0)) continue;
      const take = Math.min(short, amount);
      short -= take;
      if (b.kind === 'cash') {
        let left = take;
        for (const row of cashRows) { const part = Math.min(left, num(row.toBuy)); add(row.Y, part); left -= part; if (!(left > 0)) break; }
        continue;
      }
      const ys = Array.isArray(b.taxYears) ? b.taxYears.map(Number) : [];
      const unitsAll = num(b.units) + num(b.heldUnits);
      const missing = (take / amount) * (unitsAll > 0 ? num(b.units) / unitsAll : 1);
      for (const Y of ys) add(Y, (needs[Y] ? num(needs[Y].need) : 0) * missing);
    }
  }
  const fund = { flat: 0, shares: 0 };
  for (const a of keptAssetsOf(plan && plan.holdings)) {
    if (a.as !== 'mine' || !a.counted) continue;
    const v = a.value * shockFactor(a, shock);
    if (a.bucket === 'shares' || a.bucket === 'diversifiers') fund.shares += v; else fund.flat += v;
  }
  const arrivals = {};
  if (withExpected) for (const e of expectedOf(plan && plan.holdings)) {
    const Y = arrivalYearOf(e, now);
    const when = e.by ? new Date(+e.by.slice(0, 4), +e.by.slice(5, 7) - 1, 15) : new Date(Y, 3, 6);
    arrivals[Y] = (arrivals[Y] || 0) + inTodaysMoney(num(e.amount), when, now);
  }
  const ys = Object.keys(gaps).map(Number);
  const thisTY = taxYearStartOf(now);
  const firstYear = Math.max(thisTY, Math.min(...(ys.length ? ys : [thisTY]), ...(g && g.rows && g.rows.length ? [g.rows[0].Y] : [])));
  const lastYear = ys.length ? Math.max(...ys) : firstYear;
  const firstShort = ys.length ? Math.min(...ys) : null;
  // money that arrives before the first year read is there, waiting, by that year: never dropped
  for (const Y of Object.keys(arrivals).map(Number)) if (Y < firstYear) { arrivals[firstYear] = (arrivals[firstYear] || 0) + arrivals[Y]; delete arrivals[Y]; }
  return { gaps: Object.fromEntries(Object.entries(gaps).map(([Y, v]) => [Y, Math.round(v)])), firstYear, lastYear, fund: { flat: Math.round(fund.flat), shares: Math.round(fund.shares) }, arrivals: Object.fromEntries(Object.entries(arrivals).map(([Y, v]) => [Y, Math.round(v)])), firstShort: firstShort == null ? null : { Y: firstShort, gap: Math.round(gaps[firstShort]) } };
}

// ---- the agreement --------------------------------------------------------------------------------------------------------

const declared = (patch) => { for (const k of Object.keys(patch)) if (!AMEND_WRITES.includes(k)) throw new Error('keepTest: "' + k + '" is not a declared field path'); return patch; };
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const ISO = /^\d{4}-\d{2}-\d{2}T/;

/**
 * "I accept this risk": ONE write of the whole `planAmendments` list with the new agreement on the end. Refused (ok false)
 * when the plan is not locked, keeps no line, or the result is not for the record as it is now (`problem`: 'notLocked', 'nothingKept',
 * 'stale', 'noResult').
 * @param {{ today: string, at: string }} o  `at` the moment, ISO (the effect's clock)
 */
export function amendPatch(plan, result, { at } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {}, previous: {}, line: null });
  if (!isLocked(plan) || !isObj(plan.planDocument)) return fail('notLocked');
  if (!keepsLines(plan.holdings)) return fail('nothingKept');
  if (!isObj(result) || !result.asHeld) return fail('noResult');
  if (typeof at !== 'string' || !ISO.test(at)) return fail('noResult');
  const entry = amendmentEntry(plan, result, { at });
  if (!entry) return fail('stale');
  const previous = { planAmendments: Object.prototype.hasOwnProperty.call(plan, 'planAmendments') ? copy(plan.planAmendments) : undefined };
  return { ok: true, problem: null, patch: declared({ planAmendments: amendmentsWith(plan, entry) }), previous, line: { id: 'agreed', slots: { date: dayWords(at) } }, entry };
}

/** "Withdraw this": ONE write of the list without its last agreement. Refused when there is none. */
export function withdrawPatch(plan) {
  const st = amendmentState(plan);
  if (!st.last) return { ok: false, problem: 'none', patch: {}, previous: {}, line: null };
  const previous = { planAmendments: copy(plan.planAmendments) };
  return { ok: true, problem: null, patch: declared({ planAmendments: amendmentsWithoutLast(plan) }), previous, line: { id: 'withdrawn', slots: { date: dayWords(st.last.at) } } };
}

// ---- the words, as ids and slots ------------------------------------------------------------------------------------------

/** A run's bad case as words' slots: "lasts to {age}" (its end, or the age it runs short at), and whether it runs short. */
function badOf(f) {
  if (!f || !f.badCase) return null;
  const b = f.badCase;
  const short = !b.lasts && b.age != null;
  return { short, age: String(short ? b.age : (f.endAge != null ? f.endAge : b.age != null ? b.age : '')), year: b.year != null ? taxYearLabel(+b.year) : null };
}
/** The bad case as a sentence part (KEEPTEST.badLasts / badShort / badShortNoYear) with its slots. */
const badPart = (b) => (!b ? null : !b.short ? { id: 'badLasts', slots: { age: b.age } } : b.year ? { id: 'badShort', slots: { age: b.age, year: b.year } } : { id: 'badShortNoYear', slots: { age: b.age } });
/** A run as the screens draw it: the chance in futures out of 10 (OneAnswer's words, as every screen says it), the bad case. */
function sideOf(f) {
  if (!f) return null;
  const share = Math.max(0, Math.min(1, num(f.share)));
  return { share, words: f.affordable === false ? futuresOutOfTen(0).words : futuresOutOfTen(share).words, bad: badPart(badOf(f)), affordable: f.affordable !== false };
}
const listOf = (xs) => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);

/** One sentence of KEEPTEST filled: `id` a key (dotted for a nested one), `slots` its figures; a slot may itself be a part { id, slots }. */
export function sayKeep(part, K) {
  if (!part) return '';
  const t = String(part.id || '').split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), K);
  return String(t || '').replace(/\{(\w+)\}/g, (m, k) => { const v = part.slots ? part.slots[k] : undefined; return v == null ? m : typeof v === 'object' ? sayKeep(v, K) : String(v); });
}

/**
 * Everything the screens say about what is kept and the agreement (both apps, one reader). Null when the plan is not locked
 * or keeps nothing and has no agreement — a plan without keeps reads exactly as before.
 * @param {object} plan
 * @param {{ today: string, result?: object|null, run?: { status, reason }|null }} o   `result`: the re-test held in page memory
 *   for this plan (keepRun.js), dropped here unless it is for what is kept now
 */
export function keepTestOf(plan, { result = null, run = null } = {}) {
  const st = amendmentState(plan);
  if (st.status === 'none') return null;
  const fp = keepFingerprint(plan && plan.holdings);
  // the re-test is read only while it is for the record exactly as it is now (what is kept, and every figure)
  const mine = result && isObj(result) && fp && result.fingerprint === fp && result.recordKey === holdingsKeyOf(plan && plan.holdings) ? result : null;
  const lockedOn = dayWords(lockedAtOf(plan));
  const last = st.last;
  const agreed = last ? { on: dayWords(last.at), held: badOf(last.retest && last.retest.asHeld), locked: badOf(last.retest && last.retest.asLocked) } : null;
  const view = mine ? (() => {
    const single = (mine.kept || []).filter((k) => k.single && k.as === 'mine').map((k) => k.label);
    const sh = mine.shock || null;
    const shock = !sh ? [] : !sh.counted ? [{ id: 'shockNotCounted', slots: {} }]
      : [sh.half ? { id: 'shockHalf', slots: { words: sideOf(sh.half).words, bad: badPart(badOf(sh.half)) } } : null, sh.nothing ? { id: 'shockNothing', slots: { list: listOf(single), words: sideOf(sh.nothing).words, bad: badPart(badOf(sh.nothing)) } } : null].filter(Boolean);
    return {
      ladder: !!mine.ladder,
      locked: sideOf(mine.asLocked), held: sideOf(mine.asHeld), without: sideOf(mine.withoutExpected),
      firstShort: mine.firstShort ? { id: 'firstShort', slots: { year: taxYearLabel(+mine.firstShort.Y), gap: pounds(mine.firstShort.gap) } } : null,
      shock, single: single.length ? { id: 'single', slots: { list: listOf(single) } } : null
    };
  })() : null;
  // the plan home's and About's one line: the plan as locked, with what was chosen to keep, as agreed
  const line = st.status === 'agreed' && agreed && agreed.held && agreed.locked
    ? { id: agreed.held.short ? 'line.agreedShort' : 'line.agreedLasts', slots: { locked: lockedOn, agreed: agreed.on, age: agreed.held.age, was: agreed.locked.age } }
    : st.status === 'stale' ? { id: st.keeps ? 'line.stale' : 'line.lapsed', slots: { agreed: agreed ? agreed.on : '' } }
      : st.status === 'untested' ? { id: 'line.untested', slots: {} } : null;
  return {
    status: st.status, keeps: st.keeps, lockedOn, agreed, line,
    // one to-do while something is kept and not agreed as it is now
    todo: st.keeps && st.status !== 'agreed' ? { id: 'todo', slots: {} } : null,
    canAccept: st.keeps && !!mine && st.status !== 'agreed',
    canWithdraw: !!last,
    result: view,
    run: run ? { status: run.status || 'idle', reason: run.reason || null } : { status: mine ? 'done' : 'idle', reason: null },
    fingerprint: fp
  };
}
