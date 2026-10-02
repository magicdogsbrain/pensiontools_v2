/**
 * Couples who stop work in different years: exact checks in a flat world, and the engine's own properties
 * (research/v7/couples-different-years.md 9.2, 9.3, 10).
 *
 * The flat world (apart.mjs flatWorld): shares return nothing, prices stay flat, savings grow at 0, all shares, no
 * charge — so every pound can be counted.
 *   C1  A stopped partner with savings only, G years apart, on Half: their savings at the join are
 *       savings − 12·G·max(0, H/2 − their guaranteed income after tax), floored at 0 (and running dry is not a run-out).
 *   C2  On All, the stopped person's money is untouched, and the answer equals the same-year answer at the later stop
 *       with those pots.
 *   C3  On None, with nothing that can be touched: a run-out in the first month apart.
 *   C4  A stopped partner with a closed pension and no savings, on Half: no run-out before the join, and the answer
 *       equals All.
 *   C5  The worker's pot at their stop is the last potEnd of savingRows at their own S_j.
 *   C6  A partner with no pots and nothing paid in: "already" equals "same", on Half or All, when the 45-year cap does
 *       not bite.
 *   C7  The hand-over: after the join, the shares are each run's money then over the total — sharesOf fed the run's
 *       own state.
 * Properties (held to one £10 step, tests/v7/c/exceptions.md): P2 swapping "you" and "partner" with their stops changes
 * nothing; P3 None ≤ Half ≤ All; P1 more money for either person never lowers the careful amount.
 * The work bound (10): per future and amount, an apart couple's engine months are no more than the same couple's
 * stopping together at the first stop, counted by the stop runner.
 */
import { describe, it, expect } from 'vitest';
import * as live from '../saving/_saving.js';
import { apart, stopAgeOf, flatWorld, SHARES } from './apart.mjs';
import { coverAt } from '../../../src/answers/shared/stopAt.js';

const { TEST_ENV } = live;
const near = (a, b, tol) => Math.abs(a - b) <= tol;

/** The stop plan and runner of a household, asked about `who`'s stop. */
const planOf = (h, env, who = 'you') => {
  const sp = live.stopAtPlan(h, stopAgeOf(h, who), env);
  return { sp, runner: live.createStopRunner(sp) };
};

/** Run every life's joined entry at H; the parts of each. */
function joinedParts(sp, runner, H) {
  const out = [];
  for (let i = 0; i < sp.n; i++) {
    const entries = runner.configsAtH(H, i);
    const r = entries.findIndex((e) => e.role === 'joined');
    expect(r).toBeGreaterThanOrEqual(0);
    out.push(runner.run(r, i, entries[r].config));
  }
  return out;
}

describe('C1: savings only, on Half — what is left at the join', () => {
  for (const [savings, G, H] of [[50_000, 3, 30_000], [30_000, 3, 30_000], [80_000, 5, 24_000], [12_000, 2, 40_000]]) {
    it(`savings £${savings}, ${G} years apart, £${H} a year: £${Math.max(0, savings - G * H / 2)} left, and no run-out before the join`, () => {
      const h = apart({ you: { age: 60 - G, pot: 900_000, stop: 60, sp: 'none' }, partner: { age: 62, isa: savings, stop: 'already', sp: 'none' }, payCovers: 0.5, charge: 0 });
      const env = flatWorld({ futures: 4 });
      const { sp, runner } = planOf(h, env);
      expect(sp.plan.apart.years).toBe(G);
      for (const res of joinedParts(sp, runner, H)) {
        expect(res.parts.atJoin).not.toBe(null);
        expect(near(res.parts.atJoin.isa, Math.max(0, savings - 12 * G * Math.max(0, H / 2 - 0) / 12), 1)).toBe(true);
        expect(res.failed && res.failMonth < 12 * G).toBe(false);
      }
    });
  }

  it('with a State Pension in payment, only what it does not cover of the half comes from the savings', () => {
    const sp0 = 10_000;
    const h = apart({ you: { age: 57, pot: 900_000, stop: 60, sp: 'none' }, partner: { age: 68, isa: 60_000, stop: 'already', sp: sp0 }, payCovers: 0.5, charge: 0 });
    const env = flatWorld({ futures: 3 });
    const { sp, runner } = planOf(h, env);
    const H = 30_000;
    const netSp = sp.plan.periods[0].byPerson[1].net;
    expect(netSp).toBe(sp0);                                   // under the personal allowance: no tax
    for (const res of joinedParts(sp, runner, H)) expect(near(res.parts.atJoin.isa, 60_000 - 3 * Math.max(0, H / 2 - netSp), 1)).toBe(true);
  });
});

describe('C2: on All the stopped person\'s money is untouched, and the answer is the same-year answer at the later stop', () => {
  it('the pots at the join are the pots given; the band equals the same couple stopping together at the later stop with those pots', () => {
    const env = flatWorld({ futures: 6 });
    const partner = { age: 60, pot: 200_000, isa: 20_000, sp: 'none' };
    const you = { age: 57, pot: 300_000, payIn: 500, stop: 60, sp: 'none' };
    const a = planOf(apart({ you, partner: { ...partner, stop: 'already' }, payCovers: 1, charge: 0 }), env);
    for (const res of joinedParts(a.sp, a.runner, 30_000)) {
      expect(near(res.parts.atJoin.pension, 200_000, 1e-3)).toBe(true);
      expect(near(res.parts.atJoin.isa, 20_000, 1e-3)).toBe(true);
    }
    const together = planOf(apart({ you, partner: { ...partner, stop: 63 }, payCovers: 1, charge: 0 }), env);
    expect(together.sp.plan.apart).toBe(undefined);
    const bandApart = live.bandAt(a.sp, a.runner);
    const bandTogether = live.bandAt(together.sp, together.runner);
    expect(bandApart.monthly).toEqual(bandTogether.monthly);
    expect(bandApart.runOutAgeAt).toEqual(bandTogether.runOutAgeAt);
  });
});

describe('C3: on None, with nothing that can be touched, a run-out in the first month apart', () => {
  it('the stopped partner has no money at all', () => {
    const h = apart({ you: { age: 57, pot: 300_000, stop: 60 }, partner: { age: 60, stop: 'already', sp: 'none' }, payCovers: 0 });
    const { sp, runner } = planOf(h, { ...TEST_ENV, futures: 12 });
    const v = live.verdictAt(sp, runner, 20_000);
    expect(v.fails).toBe(12);
    expect(v.runOutMonths.every((m) => m === 0)).toBe(true);
    expect(v.runOutAge).toBe(57);
    // on Half the pay makes up the gap: nothing runs out before the join, and the cover is said to be used from the start
    const half = planOf(apart({ you: { age: 57, pot: 300_000, stop: 60 }, partner: { age: 60, stop: 'already', sp: 'none' }, payCovers: 0.5 }), { ...TEST_ENV, futures: 12 });
    const vh = live.verdictAt(half.sp, half.runner, 20_000);
    expect(vh.runOutMonths.every((m) => m === null || m >= 36)).toBe(true);
    const cover = coverAt(half.sp, half.runner, 20_000);
    expect(cover.months.every((m) => m === 0)).toBe(true);
    expect(cover).toMatchObject({ who: 'partner', fromAge: 60 });
  });

  it('the stopped partner\'s pension cannot be touched yet and there are no savings', () => {
    const h = apart({ you: { age: 50, pot: 200_000, payIn: 400, stop: 56 }, partner: { age: 53, pot: 300_000, stop: 'already' }, payCovers: 0 });
    const { sp, runner } = planOf(h, { ...TEST_ENV, futures: 12 });
    expect(sp.plan.lockedUntil).toContainEqual({ who: 'partner', untilAge: 57, years: 4 });
    const v = live.verdictAt(sp, runner, 20_000);
    expect(v.runOutMonths.every((m) => m === 0)).toBe(true);
  });
});

describe('C4: a closed pension and no savings, on Half — no run-out before the join, and the answer equals All', () => {
  it('the partner\'s pension opens at the join: Half and All give the same band; the pay covers every month apart', () => {
    const env = { ...TEST_ENV, futures: 20 };
    const make = (payCovers) => planOf(apart({ you: { age: 51, pot: 150_000, payIn: 400, stop: 55 }, partner: { age: 53, pot: 300_000, stop: 'already' }, payCovers }), env);
    const half = make(0.5);
    const all = make(1);
    expect(half.sp.plan.apart.years).toBe(4);
    for (const H of [18_000, 26_000]) {
      const v = live.verdictAt(half.sp, half.runner, H);
      expect(v.runOutMonths.every((m) => m === null || m >= 48)).toBe(true);
      expect(v).toEqual(live.verdictAt(all.sp, all.runner, H));
      expect(coverAt(half.sp, half.runner, H).months.every((m) => m === 0)).toBe(true);
      expect(coverAt(all.sp, all.runner, H).months.every((m) => m === null)).toBe(true);
    }
    const bh = live.bandAt(half.sp, half.runner);
    const ba = live.bandAt(all.sp, all.runner);
    expect(bh.monthly).toEqual(ba.monthly);
    expect(bh.runOutMonths).toEqual(ba.runOutMonths);
  });
});

describe('C5: the worker\'s pot at their stop is the last month of their own saving rows', () => {
  it('in market lives and in the flat world, for the later stopper; the one who has stopped holds the pots given', () => {
    for (const env of [{ ...TEST_ENV, futures: 8 }, flatWorld({ futures: 3 })]) {
      const h = apart({ you: { age: 52, pot: 120_000, isa: 15_000, payIn: 700, savingsIn: 200, stop: 59 }, partner: { age: 61, pot: 240_000, isa: 30_000, stop: 'already' }, charge: env.futureReturns ? 0 : 0.005 });
      const { sp } = planOf(h, env);
      const [you, partner] = sp.saving.people;
      expect(you.until).toBe(7);
      expect(partner.until).toBe(0);
      for (let i = 0; i < sp.n; i++) {
        const rows = live.savingRows(sp.saving, you, sp.lives[i]);
        expect(rows).toHaveLength(12 * 7);
        const last = rows[rows.length - 1];
        const P = sp.kernels[0].pension.priceAtStop[i];
        expect(Math.abs(sp.pots[0].pension[i] - last.potEnd / P)).toBeLessThanOrEqual(1e-9 * last.potEnd);
        expect(Math.abs(sp.pots[0].savings[i] - last.savingsEnd / P)).toBeLessThanOrEqual(1e-9 * last.savingsEnd);
        expect(live.savingRows(sp.saving, partner, sp.lives[i])).toEqual([]);
        expect(sp.potsOf(i)[1]).toEqual({ pension: 240_000, isa: 30_000 });
      }
      if (env.futureReturns) for (let i = 0; i < sp.n; i++) expect(near(sp.pots[0].pension[i], 120_000 + 700 * 12 * 7, 1e-3)).toBe(true);
    }
  });
});

describe('C6: a partner with nothing — "already" is "same" on Half or All, when the 45-year cap does not bite', () => {
  for (const payCovers of [0.5, 1]) {
    it(`payCovers ${payCovers}: the same band, the same run-out ages, the run-out months five years later on the household's clock`, () => {
      const env = { ...TEST_ENV, futures: 20 };
      const you = { age: 55, pot: 300_000, isa: 20_000, payIn: 600, stop: 60 };
      const a = planOf(apart({ you, partner: { age: 57, stop: 'already' }, payCovers, endAge: 90 }), env);
      const s = planOf(apart({ you, partner: { age: 57, stop: 62 }, payCovers, endAge: 90 }), env);
      expect(a.sp.plan.apart.years).toBe(5);
      expect(s.sp.plan.apart).toBe(undefined);
      const ba = live.bandAt(a.sp, a.runner);
      const bs = live.bandAt(s.sp, s.runner);
      expect(ba.monthly).toEqual(bs.monthly);
      expect(ba.runOutAgeAt).toEqual(bs.runOutAgeAt);
      for (const w of ['careful', 'middling', 'good']) expect(ba.runOutMonths[w]).toEqual(bs.runOutMonths[w].map((m) => (m === null ? null : m + 60)));
      const va = live.verdictAt(a.sp, a.runner, 30_000);
      const vs = live.verdictAt(s.sp, s.runner, 30_000);
      expect([va.fails, va.runOutAge]).toEqual([vs.fails, vs.runOutAge]);
    });
  }
});

describe('C7: the hand-over sets the shares on what each has at the second stop', () => {
  it('after the join each run\'s share of the need is its money then over the total (sharesOf on the run\'s own state)', () => {
    const env = { ...TEST_ENV, futures: 10 };
    const h = apart({ you: { age: 55, pot: 250_000, isa: 10_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000, stop: 'already' } });
    const { sp, runner } = planOf(h, env);
    const G = sp.plan.apart.years;
    const first = sp.plan.runs.findIndex((r) => r.offset === 0);
    const join = 1 - first;
    let checked = 0;
    for (const H of [20_000, 32_000]) {
      joinedParts(sp, runner, H).forEach((res, i) => {
        if (!res.parts.atJoin) return;
        const F = res.parts.atJoin.pension + res.parts.atJoin.isa;
        const q = sp.potsOf(i)[sp.plan.runs[join].index];
        const J = q.pension + q.isa;
        sp.plan.periods.forEach((per, k) => {
          if (per.from < G) { expect(res.parts.shares[k]).toBe(null); return; }
          expect(Math.abs(res.parts.shares[k][first] - F / (F + J))).toBeLessThan(1e-12);
          expect(Math.abs(res.parts.shares[k][join] - J / (F + J))).toBeLessThan(1e-12);
          checked++;
        });
      });
    }
    expect(checked).toBeGreaterThan(20);
  });
});

describe('the engine\'s properties on apart households', () => {
  const env = { ...TEST_ENV, futures: 40 };
  const cases = [
    { you: { age: 55, pot: 250_000, isa: 10_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000, stop: 'already' } },
    { you: { age: 50, pot: 150_000, isa: 40_000, payIn: 700, stop: 56 }, partner: { age: 52, pot: 400_000, payIn: 300, stop: 54 } },
    { you: { age: 61, pot: 320_000, isa: 25_000, stop: 'already' }, partner: { age: 56, pot: 140_000, payIn: 450, stop: 58, finalSalary: { yearly: 8_000, fromAge: 60 } } },
    { you: { age: 54, pot: 90_000, isa: 60_000, payIn: 900, stop: 57 }, partner: { age: 53, pot: 260_000, stop: 'already' } }
  ];

  it('P2: swapping "you" and "partner", with their stops, leaves the band and the verdict unchanged', () => {
    for (const c of cases) {
      for (const payCovers of [0, 0.5, 1]) {
        const a = planOf(apart({ ...c, payCovers }), env);
        const b = planOf(apart({ you: c.partner, partner: c.you, payCovers }), env);
        const ba = live.bandAt(a.sp, a.runner);
        const bb = live.bandAt(b.sp, b.runner);
        expect(bb.monthly).toEqual(ba.monthly);
        expect(bb.runOutMonths).toEqual(ba.runOutMonths);
        expect(live.verdictAt(b.sp, b.runner, 30_000).runOutMonths).toEqual(live.verdictAt(a.sp, a.runner, 30_000).runOutMonths);
      }
    }
  }, 60_000);

  it('P3: the careful amount under None ≤ under Half ≤ under All (to one £10 step)', () => {
    for (const c of cases) {
      const [none, half, all] = [0, 0.5, 1].map((payCovers) => { const p = planOf(apart({ ...c, payCovers }), env); return live.bandAt(p.sp, p.runner).monthly.careful; });
      expect(none).toBeLessThanOrEqual(half + 10);
      expect(half).toBeLessThanOrEqual(all + 10);
    }
  }, 60_000);

  it('P1: more money for either person never lowers the careful amount (to one £10 step)', () => {
    for (const c of cases) {
      const base = planOf(apart(c), env);
      const careful = live.bandAt(base.sp, base.runner).monthly.careful;
      for (const who of ['you', 'partner']) {
        const more = planOf(apart({ ...c, [who]: { ...c[who], pot: (c[who].pot || 0) + 50_000, isa: (c[who].isa || 0) + 10_000 } }), env);
        expect(live.bandAt(more.sp, more.runner).monthly.careful).toBeGreaterThanOrEqual(careful - 10);
      }
    }
  }, 60_000);

  it('the band\'s floor and ceiling (4.3 i): every life lasts at kLow, and fails at kMax, on Half, All and None', () => {
    for (const c of cases) {
      for (const payCovers of [0, 0.5, 1]) {
        const { sp, runner } = planOf(apart({ ...c, payCovers }), { ...TEST_ENV, futures: 30 });
        const solver = live.createBandSolver(sp.plan, sp.lives, { runner, configsFor: runner.configsFor });
        expect(live.verdictAt(sp, runner, solver.kLow * 120).fails).toBe(0);
        expect(live.verdictAt(sp, runner, solver.kMax * 120).fails).toBe(sp.n);
      }
    }
  }, 60_000);

  it('an apart plan says so, and a same-year plan carries no new key', () => {
    const a = planOf(apart(cases[0]), { ...TEST_ENV, futures: 3 }).sp.plan;
    expect(a.apart).toEqual({ first: 'partner', firstIndex: 1, years: 4, payCovers: 0.5, coversGap: true, joins: [4, 0] });
    expect(a.periods.filter((p) => p.from < 4).every((p) => p.potsShare === 0.5 && p.byPerson[0].working === true && p.byPerson[1].working === false)).toBe(true);
    expect(a.periods.filter((p) => p.from >= 4).every((p) => !('potsShare' in p) && p.byPerson.every((b) => !('working' in b)))).toBe(true);
    expect(a.runs.map((r) => r.offset).sort()).toEqual([0, 4]);
  });
});

/*
 * The pass-on (the engine's call of 2 Oct 2026, couples-different-years.md 4.3 f): after the second stop the household
 * runs out only when both runs have. The reviewers' cases: a stopped partner coming to the second stop with a few hundred
 * pounds of savings gave it a share of its own that ran dry decades early while the other's money lasted — so a life
 * lasted at £2,740 a month and ran out at £2,700, £5,000 more of savings lowered every amount, and £45,000 of savings
 * between you added £10 to the careful amount when the stops differed against £60 when they did not.
 */
describe('the pass-on: around the leftover at the second stop, more money never gives less, and savings count', () => {
  const env = { ...TEST_ENV, futures: 40 };
  // you 55 with a pension, paying in a little, stopping at 57; your partner 54, stopped, with savings only (savings-first)
  const leftover = (savings, partnerPot = 0) => apart({ you: { age: 55, pot: 420_000, payIn: 100, stop: 57 }, partner: { age: 54, pot: partnerPot, isa: savings, stop: 'already' } });

  it('every life is monotone in the spend over the whole band: none lasts at a higher amount after running out at a lower one', () => {
    for (const savings of [30_000, 34_000]) {
      const { sp, runner } = planOf(leftover(savings), env);
      const band = live.bandAt(sp, runner);
      let ranOut = null;
      for (let m = band.monthly.careful - 300; m <= band.monthly.good + 300; m += 10) {
        const months = live.verdictAt(sp, runner, m * 12).runOutMonths;
        if (ranOut) months.forEach((x, i) => expect(x === null && ranOut[i], `£${m} a month, life ${i}`).toBe(false));
        ranOut = months.map((x, i) => x !== null || Boolean(ranOut && ranOut[i]));
      }
    }
  }, 60_000);

  it('P1 around the leftover: savings stepping through what the years apart use, and the stopped partner\'s pension — no amount falls (to one £10 step)', () => {
    const at = (h) => { const { sp, runner } = planOf(h, env); return live.bandAt(sp, runner).monthly; };
    let prev = null;
    for (let savings = 0; savings <= 60_000; savings += 5_000) {
      const now = at(leftover(savings));
      if (prev) for (const w of ['careful', 'middling', 'good']) expect(now[w], `${w}, savings £${savings}`).toBeGreaterThanOrEqual(prev[w] - 10);
      prev = now;
    }
    prev = null;
    for (let pot = 0; pot <= 40_000; pot += 5_000) {
      const now = at(leftover(30_000, pot));
      if (prev) for (const w of ['careful', 'middling']) expect(now[w], `${w}, the partner's pension £${pot}`).toBeGreaterThanOrEqual(prev[w] - 10);
      prev = now;
    }
  }, 120_000);

  it('savings between you count about as much when the stops differ as when they do not, and at least half what the same sum in a pension does', () => {
    // (measured at 200 lives, 2 Oct 2026 — careful: apart +60 to +80, together +90, in your pension +100; middling: +70
    // each way. Before the pass-on: careful +20 to +30 apart, middling +10 to +30)
    const lives = { ...TEST_ENV, futures: 200 };
    const band = (h) => { const sp = live.stopAtPlan(h, 56, lives); return live.bandAt(sp, live.createStopRunner(sp)).monthly; };
    for (const payCovers of [0, 0.5, 1]) {
      // you 56, stopped; your partner 55, stopping at 56 (apart), or stopped too (together): savings all with you when apart
      // (savings-first), split evenly together; or the same £45,000 in your pension
      const mk = (isaYou, isaPartner, pot = 380_000, partnerStop = 56) => apart({ you: { age: 56, pot, isa: isaYou, stop: 'already' }, partner: { age: 55, pot: 290_000, isa: isaPartner, stop: partnerStop }, payCovers });
      const a0 = band(mk(0, 0));
      const a45 = band(mk(45_000, 0));
      const inPension = band(mk(0, 0, 425_000)).careful - a0.careful;
      const t0 = band(mk(0, 0, 380_000, 55));
      const t45 = band(mk(22_500, 22_500, 380_000, 55));
      for (const w of ['careful', 'middling']) expect(a45[w] - a0[w], `${w}, payCovers ${payCovers}`).toBeGreaterThanOrEqual(t45[w] - t0[w] - 30);
      expect(a45.careful - a0.careful, `payCovers ${payCovers}`).toBeGreaterThanOrEqual(inPension / 2);
    }
  }, 120_000);
});

describe('the work bound: an apart couple costs no more engine months than the same couple stopping together', () => {
  // Per future and amount (one evaluation) the apart couple runs one run of D years and one of D − G — never more than
  // the same couple stopping together at the first stop (two runs of D years) — and exactly that when neither runs out.
  // The pass-on (2 Oct 2026) adds at most the rest of the first stopper's run, resumed from its record at the month the
  // joiner's money ran out: 12·(2D − G) + 1 at most (that month is counted in both), still under the same couple's 24D.
  // Over a whole answer the two households are searched at different amounts (the apart couple's are higher), so the
  // totals follow the search, not the mechanism: measured 0.83 to 1.14 of the same couple's on 12 households at 200
  // lives (1 Oct 2026). The guard below allows a quarter more, to catch the mechanism doing extra work.
  it('per evaluation: at most 12·(2D − G) + 1 months, and exactly 12·(2D − G) when neither runs out; a whole verdict and band within a quarter more', () => {
    const env = { ...TEST_ENV, futures: 60 };
    let resumed = 0;
    for (const c of [
      { you: { age: 55, pot: 250_000, isa: 10_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000 } },
      { you: { age: 52, pot: 150_000, isa: 40_000, payIn: 700, stop: 58 }, partner: { age: 56, pot: 400_000 } }
    ]) {
      for (const payCovers of [0, 0.5, 1]) {
        const a = planOf(apart({ ...c, partner: { ...c.partner, stop: 'already' }, payCovers }), env);
        // the same couple stopping together at the first stop: the partner's (today), you with them
        const t = planOf(apart({ you: { ...c.you, stop: c.you.age }, partner: { ...c.partner, stop: 'already' }, payCovers }), env);
        const D = a.sp.plan.years;
        const G = a.sp.plan.apart.years;
        expect(t.sp.plan.years).toBe(D);
        const most = 12 * (2 * D - G);
        expect(most + 1).toBeLessThanOrEqual(24 * D);
        const lastingH = a.sp.plan.guaranteedAtStartAYear;
        for (const H of [lastingH, 20_000, 30_000, 40_000, 80_000]) {
          for (let i = 0; i < env.futures; i += 5) {
            const before = a.runner.months;
            let passed = false;
            const res = live.runFuture(a.runner.configsAtH(H, i), null, false, (r, config) => {
              const out = a.runner.run(r, i, config);
              if (out.parts && out.parts.passOn) passed = true;
              if (out.parts && out.parts.last) resumed++;
              return out;
            });
            const used = a.runner.months - before;
            expect(used).toBeLessThanOrEqual(most + 1);
            if (!res.failed && !passed) expect(used).toBe(most);
          }
          if (H === lastingH) {
            const before = t.runner.months;
            for (let i = 0; i < env.futures; i += 5) live.runFuture(t.runner.configsAtH(H, i), null, false, (r, config) => t.runner.run(r, i, config));
            expect(most).toBeLessThan(24 * D);
            expect(t.runner.months - before).toBeLessThanOrEqual(24 * D * Math.ceil(env.futures / 5));
          }
        }
        const ma0 = a.runner.months, mt0 = t.runner.months;
        live.verdictAt(a.sp, a.runner, 30_000); live.bandAt(a.sp, a.runner);
        live.verdictAt(t.sp, t.runner, 30_000); live.bandAt(t.sp, t.runner);
        expect(a.runner.months - ma0).toBeLessThanOrEqual(1.25 * (t.runner.months - mt0));
      }
    }
    expect(resumed).toBeGreaterThan(0);
  }, 60_000);
});

void SHARES;
