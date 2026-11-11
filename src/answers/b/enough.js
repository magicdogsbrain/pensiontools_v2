/**
 * "What would be enough" for question B (research/saving-enough-and-check-in.md 3.1–3.4; release step R1): the least
 * pay-in that is on course at the level chosen (7.8.0: `atLevel`; the separate "3 in 4" figure is gone), said the way the
 * person gave what goes in now; and the one-off sum into the pension today that would be on course, paying in as now.
 *
 * ONE TEST. Every figure here is B's own test (stopAt.js lastsWithin, and verdictAtPayIns for the count) on the stop
 * plan's lives, at another pay-in or another pot: no second model and no new saving run. The pot at the stop is exactly
 * linear in what goes in and in what is there today (saving.js), so a share of pay is the test at that share's pounds,
 * and a sum put in today is the test at a larger pot.
 *
 *  - A share of pay (one person still saving, pay above £0): the least TOTAL share, the employer's share kept as entered,
 *    searched on a grid of 0.5% of pay for the person's own part (decision 4). B's whole-£10 figure is only a hint for the
 *    bracket: the grid steps either side of it are tried first, so it usually costs two tries. Nothing is inferred from
 *    "more paid in never makes a life fail" — the engine does not promise it (stopAt.js leastPayIn, OT2) — so a step
 *    counts as lasting only when it was tried.
 *  - Pounds (one figure; your part and your employer's; or a share of a pay of £0): B's own least whole £10, the person's
 *    part said as that less the employer's part as entered. Never a share of £0 pay, never "even all of your pay".
 *  - Two people still saving: B's household figure split by today's ratio, each part in that person's own kind, a share
 *    rounded UP to the grid (so the household figure rises a little; the count is the count at the rounded figures). A
 *    part that would pass its person's most (all of their pay for a share, else £10,000 a month) is held there and the
 *    rest goes to the other, so a figure the two of you could pay is never called out of reach because of today's split.
 *  - The count said is the count at the figure said: every figure is asked once more in full, at exactly the pay-ins it
 *    names, and if that count does not hold (a few pounds where the test is not monotone) the figure steps up one step and
 *    is counted again — the figure said is always one whose full count held.
 *  - Caps: a person's own part never above 100% of their pay (then "out of reach by paying in", and the other ways lead),
 *    nor above B's £10,000 a month a person. A couple out of reach is told whose most was reached (`caps`), so the words
 *    can say "even all of your pay and £10,000 a month from your partner".
 *  - Stopping before a pension can be touched: the savings a month that carry the closed years are B's (payIn.outside),
 *    held while the pension part is searched; when the pension as now is already enough, the answer is the savings alone
 *    and no share is searched.
 *
 * Pure: reads nothing but what it is handed.
 */
import { payInParts } from '../shared/schemaParts.js';
import { leastPayIn, verdictAtPayIns, lastsWithin } from '../shared/stopAt.js';
import { SAVING } from '../shared/rules.js';
import { outOfTen } from '../shared/format.js';
import { bandIndexes } from '../shared/band.js';

/** The grid a share of pay is searched on: 0.5% of pay a step (decision 4). */
export const SHARE_STEP = 0.5;
/** The most a person's own part can be: all of their pay. */
export const SHARE_MAX = 100;
/** The steps a one-off sum is searched on: whole £1,000. */
export const LUMP_STEP = 1000;

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const round2 = (x) => Math.round(x * 100) / 100;

/** careful / middling / good of a list of values (the positions of bandIndexes), whole pounds. */
function spread(values) {
  const s = Array.from(values).sort((a, b) => a - b);
  const at = bandIndexes(s.length);
  return { careful: Math.round(s[at.careful]), middling: Math.round(s[at.middling]), good: Math.round(s[at.good]) };
}

/** A count as the words read it: the lives that failed, the share that lasted, outOfTen, the band and the bad-case age. */
const countOf = (v) => ({ fails: v.fails, lasted: v.lasted, outOfTen: outOfTen(v.lasted), verdict: v.verdict, runOutAge: v.runOutAge });

/**
 * Each person as the solver reads them: whether they still save, how they gave what goes in ('share' of a pay above £0,
 * 'paused' — a share of a pay of £0, which lands nothing — 'split' or 'total'), their pay, their employer's share and
 * the pounds it lands, and what goes in now.
 */
function peopleOf(inp, whos, savers) {
  return whos.map((who, j) => {
    const p = (inp[who] && inp[who].payIn) || {};
    const parts = payInParts(p);
    const share = p.kind === 'share';
    const kind = share ? (parts.pay > 0 ? 'share' : 'paused') : parts.own !== null ? 'split' : 'total';
    return {
      who, j, saves: savers[j], kind, pay: share ? parts.pay : null,
      employerPct: share && isNum(p.employerPct) ? p.employerPct : null,
      ownPctNow: share && isNum(p.ownPct) ? p.ownPct : null,
      employer: savers[j] && parts.employer !== null ? parts.employer : 0,
      now: savers[j] ? parts.total : 0
    };
  });
}

/** What a person's own share of pay `ownPct` lands, the employer's share as entered (payIn.js, the one reader). */
function shareFigure(q, ownPct) {
  const l = payInParts({ kind: 'share', pay: q.pay, ownPct, employerPct: q.employerPct });
  return { who: q.who, payIn: l.total, own: l.own, employer: l.employer, ownPct, employerPct: q.employerPct, totalPct: round2(ownPct + q.employerPct) };
}

/** A person's part in pounds at `c` a month landing: their own part the rest of it over the employer's as entered. */
function poundsFigure(q, c) {
  if (q.kind === 'total') return { who: q.who, payIn: round2(c), own: null, employer: null };
  const own = round2(Math.max(0, c - q.employer));
  return { who: q.who, payIn: round2(own + q.employer), own, employer: q.employer };
}

/**
 * The most grid steps of a share that stay within all of the person's pay and within `cap` pounds a month: the steps of
 * their own part, k × SHARE_STEP, from 0.
 */
function shareSteps(q, cap) {
  let k = Math.floor(SHARE_MAX / SHARE_STEP);
  while (k > 0 && shareFigure(q, k * SHARE_STEP).payIn > cap + 1e-9) k--;
  return k;
}

/**
 * The most a person's part can land a month: all of their pay for a share of a pay above £0, never above B's £10,000 a
 * month a person — `k`, the grid steps of their own part there, and `by`, which of the two it is ('pay' or 'ceiling').
 */
function capOf(q) {
  if (q.kind !== 'share') return { payIn: SAVING.payInCeiling, k: null, by: 'ceiling' };
  const k = shareSteps(q, SAVING.payInCeiling);
  return { payIn: shareFigure(q, round2(k * SHARE_STEP)).payIn, k, by: k * SHARE_STEP >= SHARE_MAX ? 'pay' : 'ceiling' };
}

/**
 * "What would be enough" (3.1–3.3).
 * @param {object} o
 * @param {object} o.row        B's stop age as answer.js reads it (createAges): `lasts`, `count`, `payInsAt`, `sp`, `H`
 * @param {number} o.H          the spend a year, as typed
 * @param {object} o.ctx        answer.js's context: now, shares, savingsInNow, savers, saverCount
 * @param {object} o.solved     payInsThatGetThere's: { savingsIn, needed } — B's whole-£10 figure at the level
 * @param {object} o.inp        the checked inputs
 * @param {string[]} o.whos
 * @param {boolean[]} o.savers
 * @param {'yes'|'close'|'no'} o.band   the verdict at the level at today's pay-ins
 * @param {{ level: number }} o.allowed   the lives the level lets fail (floor(t·n/20) while not weighing)
 * @param {string} o.level      the level chosen
 * @param {boolean} o.reachable  a number exists (some pot pays the spend): when not, no pay-in can be enough
 * @param {boolean[]|null} o.only    couples apart: whose pensions the number is (those still saving); null for everyone
 * @param {boolean} o.closedYears    the answer names savings set aside for the years before a pension opens (result.outside)
 * @returns {object}
 */
export function enoughOf({ row, H, ctx, solved, inp, whos, savers, band, allowed, level, reachable, only, closedYears }) {
  const people = peopleOf(inp, whos, savers);
  const saving = people.filter((q) => q.saves);
  const one = saving.length === 1 ? saving[0] : null;
  const how = !one ? 'couple' : one.kind === 'share' ? 'share' : 'pounds';
  const now = ctx.now;
  // the savings a month B holds for the years before a pension opens — only when it says them (result.outside); else
  // what goes into savings now, so no figure here leans on savings the answer does not name
  const savingsIn = closedYears ? solved.savingsIn : ctx.savingsInNow;
  const savingsMore = savingsIn > ctx.savingsInNow + 1e-9 ? savingsIn : null;
  // each saver's most (all of their pay, or £10,000 a month)
  const caps = people.map((q) => (q.saves ? capOf(q) : null));
  const out = {
    how,
    // whose pay-in it is when one person is saving (you, or your partner after "I've already stopped"): the words follow it
    who: one ? one.who : null,
    // who has an employer's part going in (the words say "your employer's" or "your employers'")
    employers: people.filter((q) => q.saves && q.employer > 0).map((q) => q.who),
    now: how === 'share' ? { totalPct: round2(one.ownPctNow + one.employerPct), ownPct: one.ownPctNow, employerPct: one.employerPct, payIn: now } : null,
    employerKept: people.some((q) => q.saves && q.employer > 0),
    paused: people.some((q) => q.saves && q.kind === 'paused'),
    pausedWho: people.filter((q) => q.saves && q.kind === 'paused').map((q) => q.who),
    pausedEmployer: people.some((q) => q.saves && q.kind === 'paused' && q.employerPct > 0),
    savingsOnly: false,
    outOfReach: null,
    // a couple out of reach by paying in: each saver's most, and whether it is all of their pay or £10,000 a month
    caps: null,
    // the level the figure is at, whether today's pay-in is close to it, and the figure (7.8.0)
    level,
    closeNow: band === 'close',
    atLevel: null
  };
  if (!reachable) { out.outOfReach = 'pot'; return out; }

  /** The pay-ins of every person for a figure: each one's part into their pension, the savings a month as B holds them. */
  const listOf = (fig) => row.payInsAt(fig.payIn, savingsIn).map((x, j) => ({ ...x, pension: fig.parts[j].payIn }));
  /** The full count at exactly the pay-ins a figure names. */
  const countAt = (fig) => countOf(verdictAtPayIns(row.sp, row.H(H), listOf(fig)));
  /** One figure from each person's part (those who have stopped put nothing in). */
  const figureOf = (parts) => {
    const payIn = round2(parts.reduce((s, x) => s + x.payIn, 0));
    const lead = parts.find((x) => x.who === (one ? one.who : null)) || null;
    return {
      payIn, extra: round2(Math.max(0, payIn - now)), savingsIn: savingsMore,
      ...(lead ? { own: lead.own, employer: lead.employer } : {}),
      ...(lead && isNum(lead.totalPct) ? { ownPct: lead.ownPct, employerPct: lead.employerPct, totalPct: lead.totalPct } : {}),
      parts
    };
  };
  const nobody = (q) => ({ who: q.who, payIn: 0, own: null, employer: null });
  const asNow = (q) => (q.saves ? { who: q.who, payIn: q.now, own: q.kind === 'total' ? null : round2(q.now - q.employer), employer: q.kind === 'total' ? null : q.employer } : nobody(q));

  // ---- a figure by how the pay-in was given ----------------------------------------------------------------------------
  // one person, a share of pay: their own part on the grid (k steps of SHARE_STEP)
  const shareAt = (k) => figureOf(people.map((q) => (q === one ? shareFigure(q, round2(k * SHARE_STEP)) : nobody(q))));
  // one person in pounds: B's whole £10
  const poundsAt = (c) => figureOf(people.map((q) => (q === one ? poundsFigure(q, c) : nobody(q))));
  // two people: the household figure split as now, a share rounded up to the grid. A part past its person's most (all of
  // their pay, or £10,000 a month) is held at it and the rest goes to the other; null only when neither has room for it
  const coupleAt = (c) => {
    const want = people.map((q) => (q.saves ? c * ctx.shares[q.j] : 0));
    let rest = 0;
    people.forEach((q, j) => { if (q.saves && want[j] > caps[j].payIn) { rest += want[j] - caps[j].payIn; want[j] = caps[j].payIn; } });
    people.forEach((q, j) => { if (q.saves && rest > 0) { const room = Math.max(0, caps[j].payIn - want[j]); const take = Math.min(room, rest); want[j] += take; rest -= take; } });
    if (rest > 0.005) return null;
    const parts = people.map((q, j) => {
      if (!q.saves) return nobody(q);
      if (q.kind !== 'share') return poundsFigure(q.kind === 'paused' ? { ...q, kind: 'split' } : q, want[j]);
      const k = Math.max(0, Math.ceil(((want[j] - q.employer) * 1200 / q.pay) / SHARE_STEP - 1e-9));
      return shareFigure(q, round2(Math.min(k, caps[j].k) * SHARE_STEP));
    });
    return figureOf(parts);
  };
  // the most a couple's figure can be: each saver at their most
  const coupleTop = caps.reduce((s, x) => s + (x ? x.payIn : 0), 0);

  /**
   * The least figure at which at most `fails` lives fail. Shares: searched on the grid with B's £10 figure `hint` as the
   * bracket, below `kTop` steps. Pounds and couples: B's figure. Then the full count at exactly that figure, one step up
   * at a time until it holds (never assumed). null when nothing within the caps holds.
   */
  const solve = (fails, hint, kTop = null) => {
    if (how === 'share') {
      const cap = shareSteps(one, SAVING.payInCeiling);
      const top = kTop === null ? cap : Math.min(cap, kTop);
      const guessK = hint === null ? top : Math.min(top, Math.max(0, Math.ceil(((hint - one.employer) * 1200 / one.pay) / SHARE_STEP - 1e-9)));
      // every step near B's figure is counted in full (a test that holds runs nearly every life anyway, and one that only
      // just fails nearly as many), so the count said is never run twice; the first try, nothing from you, is far from the
      // answer and stops as soon as it is settled
      const counts = new Map();
      const countOfStep = (k) => { if (!counts.has(k)) counts.set(k, countAt(shareAt(k))); return counts.get(k); };
      const ok = (k) => (k === 0 && guessK !== 0 ? row.lasts(H, shareAt(0).payIn, savingsIn, fails) : countOfStep(k).fails <= fails);
      let k = leastPayIn(ok, top, 0, { lo: guessK, hi: guessK }, 1);
      while (k !== null && k <= top) {
        const fig = shareAt(k);
        const v = countOfStep(k);
        if (v.fails <= fails) return { ...fig, ...v, k };
        k += 1;
      }
      return null;
    }
    if (hint === null) return null;
    const ceiling = how === 'couple' ? Math.floor(coupleTop / 10 + 1e-9) * 10 : SAVING.payInCeiling * ctx.saverCount;
    const figAt = (c) => (how === 'couple' ? coupleAt(c) : poundsAt(c));
    // B's own figure first (one full count: it usually holds, being B's test at the same pounds or a little more); where
    // it does not, the least £10 above it at which the test holds is searched for, then counted in full step by step
    let c = hint;
    for (let tries = 0; c <= ceiling + 1e-9 && tries < 100; tries++, c += 10) {
      const fig = figAt(c);
      if (fig === null) return null;
      const v = countAt(fig);
      if (v.fails <= fails) return { ...fig, ...v };
      if (tries === 0) {
        const ok = (x) => { const f = figAt(x); return f !== null && lastsWithin(row.sp, row.H(H), listOf(f), fails); };
        const next = leastPayIn(ok, ceiling, c + 10, { lo: c + 10, hi: c + 10 });
        if (next === null) return null;
        c = next - 10;
      }
    }
    return null;
  };
  /**
   * Why nothing was enough: all of a pay (one person, a share that would pass 100%; or a couple, each at their most and
   * one of those all of a pay — `caps` says whose), else the £10,000 a month ceiling. A couple B found nothing for at
   * today's split (`hint` null) keeps B's own words, the ceiling: those are what B tried.
   */
  const whyNot = (hint) => {
    if (how === 'share') return caps[one.j].by;
    if (how === 'couple' && hint !== null && caps.some((x) => x && x.by === 'pay')) {
      out.caps = people.filter((q) => q.saves).map((q) => ({ who: q.who, by: caps[q.j].by }));
      return 'pay';
    }
    return 'ceiling';
  };

  // ---- what goes into the pension as now is enough: the savings for the closed years alone (row P) ---------------------
  if (band !== 'yes' && savingsMore !== null && solved.needed !== null && solved.needed <= now) {
    const fig = figureOf(people.map(asNow));
    const v = countAt(fig);
    if (v.fails <= allowed.level) {
      out.savingsOnly = true;
      out.atLevel = { ...fig, ...v };
      return withAtStop(out, row, listOf, only);
    }
  }

  const fig = solve(allowed.level, solved.needed);
  out.atLevel = fig;
  if (fig === null && band !== 'yes') out.outOfReach = whyNot(solved.needed);
  if (fig && 'k' in fig) delete fig.k;
  return band === 'yes' ? out : withAtStop(out, row, listOf, only);
}

/**
 * Each person's pension and savings at the stop paying in what would be enough (careful, middling and good), and the
 * household's pension the way B's potAtStop.now counts it — for keeping the answer "paying in what would be on course"
 * (3.6: the plan then starts from those pots), and for saying the pots at the figure the words state, at either chance.
 * Kernel arithmetic only: no run.
 */
function withAtStop(out, row, listOf, only) {
  if (out.atLevel) atStopOf(out.atLevel, row, listOf, only);
  return out;
}

function atStopOf(fig, row, listOf, only) {
  const sp = row.sp;
  const list = listOf(fig);
  const n = sp.n;
  const household = new Float64Array(n);
  fig.parts.forEach((part, j) => {
    const kp = sp.kernels[j].pension;
    const ks = sp.kernels[j].savings;
    const pension = new Float64Array(n);
    const savings = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      pension[i] = kp.A[i] + list[j].pension * kp.B[i];
      savings[i] = ks.A[i] + list[j].savings * ks.B[i];
      if (!only || only[j]) household[i] += pension[i];
    }
    part.atStop = { pension: spread(pension), savings: spread(savings) };
  });
  fig.potAtStop = spread(household);
}

/**
 * A one-off sum now (3.4): the least whole £1,000 put into the pension today, paying in as now, at which at most `fails`
 * lives fail — the test at a pot today that much larger (stopAt.js runnerAtPayIns `lumps`: the stop finds it grown by the
 * kernel's F). One person: into their pension. Two: into the pensions between you, split as the number is (sp.split), so
 * each life's own least pot at the stop (`least`, answer.js's potNeededAt, at the household's total split that way) brackets
 * it closely, as B's pay-in search is bracketed. The likely sum, and every step near it, is counted in full: a count that
 * holds runs nearly every life anyway, so the count said is never run twice. null when no sum up to SAVING.potMax would do.
 * @returns {null | { amount: number, fails: number, lasted: number, outOfTen: object, byPerson: null | { who: string, amount: number }[] }}
 */
export function oneOffSum({ row, H, ctx, least, fails }) {
  const sp = row.sp;
  const n = sp.n;
  const payIns = row.payInsAt(ctx.now);
  const two = sp.kernels.length > 1;
  const lumpsOf = (L) => sp.kernels.map((k, j) => (two ? L * sp.split[j] : L));
  // the growth to the stop of £1 put in today, in the household's pensions as the sum is split
  const F = new Float64Array(n);
  sp.kernels.forEach((k, j) => { const w = two ? sp.split[j] : 1; for (let i = 0; i < n; i++) F[i] += w * k.pension.F[i]; });
  let guess = null;
  if (least) {
    // each life's own: the sum that lifts the pensions at the stop to its least pot (a hint: the search decides). The
    // bracket is drawn in to that figure at the count allowed: the sum there usually holds and £1,000 less does not, so
    // two tries settle it (a sum lower down is still found: the search widens downwards from it)
    const each = new Float64Array(n);
    const top = Math.round(SAVING.potMax / SAVING.potStep);
    for (let i = 0; i < n; i++) {
      let have = 0;
      sp.kernels.forEach((k, j) => { if (ctx.savers[j]) have += k.pension.A[i] + payIns[j].pension * k.pension.B[i]; });
      each[i] = least[i] > top || !(F[i] > 0) ? Infinity : Math.max(0, (least[i] * SAVING.potStep - have) / F[i]);
    }
    each.sort();
    const need = n - fails;
    if (need >= 1 && Number.isFinite(each[need - 1])) {
      const at = Math.max(LUMP_STEP, Math.ceil(each[need - 1] / LUMP_STEP - 1e-9) * LUMP_STEP);
      guess = { lo: at, hi: at };
    }
  }
  // the first try, at the least sum, is far from the answer and stops as soon as it is settled; every other is a full count
  const counts = new Map();
  const countOfSum = (L) => {
    if (!counts.has(L)) counts.set(L, verdictAtPayIns(sp, row.H(H), payIns, { lumps: lumpsOf(L) }));
    return counts.get(L);
  };
  const probe = (L) => (L === LUMP_STEP && !(guess && guess.hi === LUMP_STEP)
    ? lastsWithin(sp, row.H(H), payIns, fails, { lumps: lumpsOf(L) })
    : countOfSum(L).fails <= fails);
  let L = leastPayIn(probe, SAVING.potMax, LUMP_STEP, guess, LUMP_STEP);
  while (L !== null && L <= SAVING.potMax) {
    const v = countOfSum(L);
    if (v.fails <= fails) {
      // a couple's parts: the larger rounded to the pound, the smaller the rest (as the number's byPerson)
      let byPerson = null;
      if (two) {
        const big = sp.split.indexOf(Math.max(...sp.split));
        const parts = sp.split.map((w) => Math.round(L * w));
        parts[1 - big] = L - parts[big];
        byPerson = sp.kernels.map((k, j) => ({ who: k.who, amount: parts[j] }));
      }
      return { amount: L, fails: v.fails, lasted: v.lasted, outOfTen: outOfTen(v.lasted), byPerson };
    }
    L += LUMP_STEP;
  }
  return null;
}
