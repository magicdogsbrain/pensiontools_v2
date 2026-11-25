/**
 * Ruling Z4: a saver's answer says the pay-in as a share of pay as well as in pounds whenever the plan knows the pay — what
 * goes in now and what would be enough, in all and the person's own part — in BOTH views, from ONE reading
 * (src/v7/state/saverBlock.js payInSharesOf): the home and the full view's Accumulation tab (saverBlockOf) and the simple
 * view's "What you pay in" (planSavingView). A kept plan whose pay-in is held in pounds still says the share.
 *
 * Made up by hand: Jo earns £35,000 a year. £300 a month from take-home pay lands as £375 with the basic-rate tax added
 * back; the employer pays £87.50: £462.50 a month in all. 462.50 × 12 ÷ 35,000 = 15.86% → 15.9%; Jo's own part 375 × 12 ÷
 * 35,000 = 12.86% → 12.9%. What would be enough: £970 a month in all, of it Jo's own £882.50: 970 × 12 ÷ 35,000 = 33.26% →
 * 33.3%; 882.50 × 12 ÷ 35,000 = 30.26% → 30.3%.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { saverBlockOf, payInSharesOf } from '../../../src/v7/state/saverBlock.js';
import { saverVerdictOf } from '../../../src/answers/plan/saving.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { FIXTURES, PARITY_DAY } from '../../../e2e/parity/fixtures/plans.js';

const verdict = { ok: true, key: 'k', notes: { aimMonthly: '£1,800', stopAge: '60' }, now: { line: { id: 'poundsEmployer', slots: {} }, salary: 35000, total: 462.5, employer: 87.5 } };
const result = { status: 'ok', verdict: { band: 'no' }, onCourse: false, reach: { payIn: true }, sentences: {},
  enough: { how: 'pounds', atLevel: { payIn: 970, own: 882.5, employer: 87.5, parts: [{ who: 'you', payIn: 970, own: 882.5, employer: 87.5 }] } } };
const fillWords = (l) => HOME.saver.lines[l.id].replace(/\{(\w+)\}/g, (m, k) => l.slots[k]);

describe('the one reading of a pay-in as a share of pay', () => {
  it('now: 15.9% in all, Jo 12.9%; enough: 33.3% in all, Jo 30.3%', () => {
    const s = payInSharesOf(verdict, result);
    expect(s.now).toEqual({ id: 'nowShare', slots: { pct: '15.9', ownPct: '12.9' } });
    expect(s.enough).toEqual({ id: 'enoughShare', slots: { pct: '33.3', ownPct: '30.3' } });
    expect(fillWords(s.now)).toBe('In all that is 15.9% of your pay (you 12.9%).');
    expect(fillWords(s.enough)).toBe('That is 33.3% of your pay in all (you 30.3%).');
  });
  it('the block (home, the full view\'s Accumulation tab) draws exactly these lines', () => {
    const lines = saverBlockOf(verdict, { status: 'final', result }).lines;
    const s = payInSharesOf(verdict, result);
    expect(lines.find((l) => l.id === 'nowShare')).toEqual(s.now);
    expect(lines.find((l) => l.id === 'enoughShare')).toEqual(s.enough);
  });
  it('no pay known: no share is said', () => {
    expect(payInSharesOf({ ...verdict, now: { ...verdict.now, salary: 0 } }, result)).toEqual({ now: null, enough: null });
  });
});

describe('a kept plan whose pay-in is held in pounds still reads its pay and the employer\'s part', () => {
  it('the verdict carries the pay and the employer\'s part a month', () => {
    const plans = FIXTURES.find((f) => f.key === 'saver-payin').plans();
    const plan = plans[0];
    plan.accumulationTool.settings.salary = 35000;
    const v = saverVerdictOf(plans.map((p) => ({ id: p.id, plan: p })), plan.id, { today: PARITY_DAY });
    expect(v.ok).toBe(true);
    expect(v.now.salary).toBe(35000);
    expect(v.now.employer).toBe(250);
    expect(payInSharesOf(v, null).now.id).toBe('nowShare');
  });
});

describe('the simple view\'s "What you pay in" says the same lines', () => {
  it('its view carries the one reading, and the page draws it in the home\'s words', () => {
    const sel = readFileSync('src/v7/state/select.js', 'utf8');
    expect(sel).toMatch(/shares: payInSharesOf\(/);
    const page = readFileSync('src/v7/screens/plan/SavingScreen.jsx', 'utf8');
    expect(page).toMatch(/V\.shares\.now/);
    expect(page).toMatch(/V\.shares\.enough/);
    expect(page).toMatch(/HOME\.saver\.lines/);
  });
});
