/**
 * 7.7.0 — "Test what you keep against your plan" and "I accept this risk", generic: any plan, any strategy, anything held
 * that the plan as locked did not have. A pot plan never asks to sell (or replace) what is kept; the plan's own test is read
 * with what is held (a ladder's years as held, here — the pot plans' engine runs are in keepRetestRun.slow.test.js); the
 * agreement is one write of a root list, with withdraw, out of date when what is kept or the document changes, frozen on a
 * closed plan, dropped by a copy, kept by every migration. Plans that keep nothing read exactly as before. Fictional plans only.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { targetHoldings, diffHoldings, yearNeedsOf } from '../src/services/TransitionPlanner.js';
import { normaliseHoldings } from '../src/services/HoldingsRecord.js';
import { moveInputs } from '../src/services/PlanReading.js';
import { keepFingerprint, amendmentState, keptLinesOf, normaliseAmendments } from '../src/services/PlanAmendments.js';
import { heldSettingsOf, ladderGapsOf, keptAssetsOf, keepTestOf, amendPatch, withdrawPatch, sayKeep } from '../src/answers/plan/keepTest.js';
import { runKeepRetest, ladderWalk } from '../src/answers/plan/keepRun.js';
import { closedPlanRefusal } from '../src/services/PlanClosed.js';
import { copyOf } from '../src/services/PlanCopy.js';
import { migrateScenario } from '../src/storage/migrations.js';
import { homeOf } from '../src/answers/plan/home.js';
import { KEEPTEST } from '../src/v7/copy/keepTest.js';
import { BANNED } from '../src/v7/copy/banned.js';
import { transitionHtml, keepTestHtml } from '../src/ui/components/TransitionView.js';
import { keepLineHtml } from '../src/ui/keepHoldingsUi.js';
import { AMEND_WRITES, ALL_WRITES } from '../src/answers/plan/schema.js';

const FIX = join(import.meta.dirname, 'fixtures', 'plans');
const fixture = (name) => JSON.parse(readFileSync(join(FIX, name), 'utf8'));
const noon = (iso) => new Date(iso + 'T12:00:00');
const TODAY = '2026-11-09';
const AT = '2026-11-09T12:00:00.000Z';
const text = (v) => JSON.stringify(v);

/** "Sam's plan": a locked index-linked ladder from 2027/28 (fictional). Sam keeps the world fund instead of buying the last rungs. */
function samKeeps({ counted = false, expected = true } = {}) {
  const p = fixture('20-locked-start-after-stop.json'); p.id = 'SamKeeps77';
  const lines = p.holdings.lines.filter((l) => !/^(T29|T30I)$/.test(l.ticker || '')).map((l) => (l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine', fundsGaps: counted } } : l));
  p.holdings = { ...normaliseHoldings({ lines, updatedAt: '2026-11-01', source: 'typed' }), ...(expected ? { expected: [{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 30000, by: '2028-06' }] } : {}) };
  return p;
}
/** "Alex's plan": a locked pot plan (buckets in order), drawing (fictional). */
const alex = () => { const p = fixture('04-buckets-running.json'); p.id = 'AlexKeeps77'; return p; };
const single = (value, keep) => ({ wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value, keep });

describe('a pot plan never asks to sell, or to replace, what is kept (every strategy)', () => {
  it('a kept line on top of the plan\'s mix: no buy, no sell — the mix is read on the money still in play', () => {
    const p = alex();
    p.holdings.lines.push(single(60000, { as: 'mine', fundsGaps: false }));
    const m = moveInputs(p, { now: noon(TODAY) });
    expect(m.target.kind).toBe('buckets');
    expect(m.diff.sell).toEqual([]);
    expect(m.diff.buy).toEqual([]);
    expect(m.diff.kept.map((k) => k.label)).toEqual(['Example Shares plc']);
  });
  it('a kept line in place of part of the plan\'s shares: never sold; the shares bucket is not "brought down" by it; the rest is read in the plan\'s mix', () => {
    const p = alex();
    const world = p.holdings.lines.find((l) => l.ticker === 'HMWO' && l.wrapper === 'SIPP');
    world.value -= 60000;
    p.holdings.lines.push({ wrapper: 'SIPP', ticker: 'VWRL', name: 'Vanguard FTSE All-World', subClass: 'worldGrowth', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } });
    const m = moveInputs(p, { now: noon(TODAY) });
    // the kept line is not counted in the shares bucket, so shares are never "brought down" because of it
    expect(m.diff.sell.some((s) => /bring shares down/.test(s.why))).toBe(false);
    expect(m.diff.sell.some((s) => /Vanguard FTSE All-World|VWRL/.test(s.label || ''))).toBe(false);
    // the targets are the plan's own shares of the pension money in play — the kept pound counted nowhere
    const inPlay = p.holdings.lines.filter((l) => l.wrapper === 'SIPP' && !l.keep).reduce((s, l) => s + l.value, 0);
    const lines = [...m.diff.hold, ...m.diff.buy, ...m.diff.sell].filter((x) => x.kind === 'bucket' && x.pct != null);
    expect(lines.reduce((s, t) => s + t.value, 0)).toBeGreaterThan(inPlay - 3);
    expect(lines.reduce((s, t) => s + t.value, 0)).toBeLessThan(inPlay + 3);
  });
  it('a plan that keeps nothing reads the plan\'s pot exactly as before', () => {
    const p = alex();
    const t = targetHoldings(p.planDocument, { today: noon(TODAY) });
    const d = diffHoldings(normaliseHoldings(p.holdings).lines, t, { needs: yearNeedsOf(p.planDocument), today: noon(TODAY) });
    for (const x of [...d.hold, ...d.buy, ...d.sell].filter((y) => y.kind === 'bucket')) expect(x.value).toBe(t.lines.find((l) => l.key === x.key).value);
    expect(d).not.toHaveProperty('kept');
  });
});

describe('the plan\'s inputs as held', () => {
  it('a pot plan: what is kept and not counted leaves the pension; what is counted is tested as what it is; the rest in the plan\'s mix', () => {
    const p = alex();
    const s = { equityMin: 400000, bondMin: 150000, cashTarget: 50000, diversifierStart: 0, strategyId: 'buckets-in-order', firstTaxYear: 2026 };
    const H = p.holdings.lines.filter((l) => l.wrapper === 'SIPP').reduce((t, l) => t + l.value, 0) + 60000;
    const out = heldSettingsOf(s, { ...p.holdings, lines: [...p.holdings.lines, single(60000, { as: 'mine', fundsGaps: false })] }, { now: noon(TODAY) });
    const w = 60000 / H;
    expect(out.equityMin).toBe(Math.round(400000 * (1 - w)));
    expect(out.bondMin).toBe(Math.round(150000 * (1 - w)));
    const counted = heldSettingsOf(s, { ...p.holdings, lines: [...p.holdings.lines, single(60000, { as: 'mine', fundsGaps: true })] }, { now: noon(TODAY) });
    expect(counted.equityMin).toBe(Math.round(400000 * (1 - w) + 600000 * w));
    expect(counted.equityMin + counted.bondMin + counted.cashTarget).toBeGreaterThan(599990);
    // one company's shares worth half, and worth nothing
    const half = heldSettingsOf(s, { ...p.holdings, lines: [...p.holdings.lines, single(60000, { as: 'mine', fundsGaps: true })] }, { now: noon(TODAY), shock: 'half' });
    expect(half.equityMin).toBe(Math.round(400000 * (1 - w) + 600000 * w * 0.5));
    const none = heldSettingsOf(s, { ...p.holdings, lines: [...p.holdings.lines, single(60000, { as: 'mine', fundsGaps: true })] }, { now: noon(TODAY), shock: 'nothing' });
    expect(none.equityMin).toBe(Math.round(400000 * (1 - w)));
    expect(keptAssetsOf({ lines: [single(60000, { as: 'mine', fundsGaps: true })] })[0]).toMatchObject({ bucket: 'shares', single: true, counted: true });
  });
  it('money expected later is a lump sum in the tax year it arrives (in the pension, at its pounds); left out when asked', () => {
    const s = { equityMin: 400000, bondMin: 150000, cashTarget: 50000, strategyId: 'pots-and-valves', firstTaxYear: 2026, windfalls: [{ amount: 5000, year: 3 }] };
    const rec = { lines: [], expected: [{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 30000, by: '2028-06' }] };
    const out = heldSettingsOf(s, rec, { now: noon(TODAY) });
    expect(out.windfalls).toEqual([{ amount: 5000, year: 3 }, { label: 'Pension elsewhere', amount: 30000, year: 2, wrapper: 'pension', indexation: 'level' }]);
    expect(heldSettingsOf(s, rec, { now: noon(TODAY), withExpected: false }).windfalls).toEqual([{ amount: 5000, year: 3 }]);
  });
  it('nothing kept and nothing expected: the settings come back exactly as given', () => {
    const p = alex();
    const s = { equityMin: 380000, bondMin: 150000, cashTarget: 60000, diversifierStart: 0, strategyParams: { sippTotal: 0 } };
    expect(heldSettingsOf(s, p.holdings, { now: noon(TODAY) })).toEqual(s);
  });
  it('a ladder: the rungs the money cannot buy once a line is kept go short, the latest first; what is counted fills them', () => {
    const G = ladderGapsOf(samKeeps(), { today: TODAY });
    const ys = Object.keys(G.gaps).map(Number);
    expect(ys.length).toBeGreaterThan(3);
    expect(Math.max(...ys)).toBe(2046);
    expect(ys).not.toContain(2029);   // the earliest rung to buy is bought first, so it is not the one short
    expect(G.fund).toEqual({ flat: 0, shares: 0 });
    expect(G.arrivals[2028]).toBeGreaterThan(25000);
    expect(G.arrivals[2028]).toBeLessThan(30000);   // £30,000 in June 2028, at today's prices
    expect(ladderGapsOf(samKeeps(), { today: TODAY, withExpected: false }).arrivals).toEqual({});
    expect(ladderGapsOf(samKeeps({ counted: true }), { today: TODAY }).fund.shares).toBeGreaterThan(400000);
  });
  it('a ladder walk with money that never moves gives one answer in every future', () => {
    expect(ladderWalk({ gaps: { 2030: 1000 }, firstYear: 2027, lastYear: 2030, fund: { flat: 1500, shares: 0 }, arrivals: {} })).toMatchObject({ share: 1, fail: [] });
    expect(ladderWalk({ gaps: { 2030: 1000, 2031: 1000 }, firstYear: 2027, lastYear: 2031, fund: { flat: 1500, shares: 0 }, arrivals: {} })).toMatchObject({ share: 0, fail: [2031] });
    expect(ladderWalk({ gaps: { 2030: 1000, 2031: 1000 }, firstYear: 2027, lastYear: 2031, fund: { flat: 1500, shares: 0 }, arrivals: { 2031: 600 } })).toMatchObject({ share: 1 });
  });
});

describe('the re-test of a ladder (the plan\'s own test as locked, the years as held)', () => {
  it('kept and not counted: the latest rungs go unbought, so a bad case runs short — said by age and tax year; with and without the money expected', () => {
    const p = samKeeps();
    const before = text(p);
    const r = runKeepRetest(p, { today: TODAY });
    expect(text(p)).toBe(before);   // nothing written, nothing changed
    expect(r.ladder).toBe(true);
    expect(r.fingerprint).toBe(keepFingerprint(p.holdings));
    expect(r.asLocked).toMatchObject({ share: 1, badCase: { lasts: true, age: r.asLocked.endAge } });
    expect(r.asHeld.share).toBe(0);
    expect(r.asHeld.badCase.lasts).toBe(false);
    expect(r.withoutExpected.badCase.age).toBeLessThanOrEqual(r.asHeld.badCase.age);
    expect(r.firstShort.Y).toBe(r.withoutExpected.badCase.year);
    expect(r.shock).toMatchObject({ counted: false });
    expect(typeof r.engineVersion).toBe('string');
  });
  it('kept and counted toward the gaps: the shares pay them on the test\'s futures; half of them, fewer futures last', () => {
    const r = runKeepRetest(samKeeps({ counted: true }), { today: TODAY });
    expect(r.asHeld.share).toBeGreaterThan(0.9);
    expect(r.shock.half.share).toBeLessThan(r.asHeld.share);
    expect(r.shock.counted).toBe(true);
  });
  it('no money expected: no "without" side', () => {
    expect(runKeepRetest(samKeeps({ expected: false }), { today: TODAY }).withoutExpected).toBe(null);
  });
});

describe('"I accept this risk": one write, withdraw, out of date, the guard', () => {
  const p = samKeeps();
  const r = runKeepRetest(p, { today: TODAY });
  const agreed = () => { const a = amendPatch(p, r, { at: AT }); return { ...p, planAmendments: a.patch.planAmendments }; };

  it('before: untested, one to-do, the line says so; the result read only while it is for what is kept now', () => {
    const v = keepTestOf(p, { result: r });
    expect(v).toMatchObject({ status: 'untested', keeps: true, canAccept: true, canWithdraw: false, todo: { id: 'todo' }, line: { id: 'line.untested' } });
    expect(v.result.held.bad.id).toBe('badShort');
    expect(keepTestOf(p, { result: { ...r, fingerprint: 'other' } }).result).toBe(null);
  });
  it('one write of the whole list, the declared path only; the settings and the document byte-identical', () => {
    const a = amendPatch(p, r, { at: AT });
    expect(a.ok).toBe(true);
    expect(Object.keys(a.patch)).toEqual(['planAmendments']);
    for (const k of Object.keys(a.patch)) expect(AMEND_WRITES).toContain(k);
    expect(ALL_WRITES).toContain('planAmendments');
    expect(a.previous).toEqual({ planAmendments: undefined });
    const e = a.patch.planAmendments[0];
    expect(e).toMatchObject({ at: AT, kind: 'keep', fingerprint: keepFingerprint(p.holdings), documentAt: p.planDocument.createdAt || p.planDocument.lockedAt, engineVersion: r.engineVersion });
    expect(e.lines).toEqual(keptLinesOf(p.holdings));
    expect(e.expected).toEqual([{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 30000, by: '2028-06' }]);
    expect(Object.keys(e.retest)).toEqual(['asLocked', 'asHeld', 'withoutExpected', 'shock']);
    expect(text(e)).not.toMatch(/function|samples/);
    const q = agreed();
    expect(text(q.planDocument)).toBe(text(p.planDocument));
    expect(text(q.stressTool)).toBe(text(p.stressTool));
    expect(text(q.decisionTool)).toBe(text(p.decisionTool));
  });
  it('agreed: the to-do goes; the home and About line says the plan as locked, with what was kept, lasts to … (was …)', () => {
    const q = agreed();
    const v = keepTestOf(q, {});
    expect(v.status).toBe('agreed');
    expect(v.todo).toBe(null);
    expect(v.line.id).toBe('line.agreedShort');
    const words = sayKeep(v.line, KEEPTEST);
    expect(words).toMatch(/^Your plan, as locked on .+, with what you chose to keep \(agreed 9 November 2026\): runs short at \d+ in a bad case, the worst 1 in 10 \(was \d+\)\.$/);
    expect(words).toContain('(was ' + r.asLocked.endAge + ')');
    expect(keepLineHtml(q)).toContain('runs short at');
  });
  it('out of date when a kept line is removed, a new keep is made, the money expected changes, or the document is a new version', () => {
    const q = agreed();
    const unkept = { ...q, holdings: { ...q.holdings, lines: q.holdings.lines.map((l) => (l.ticker === 'VWRP' && l.value > 100000 ? { ...l, keep: undefined } : l)) } };
    expect(amendmentState(unkept).status).toBe('stale');
    const more = { ...q, holdings: { ...q.holdings, lines: [...q.holdings.lines, single(1000, { as: 'mine', fundsGaps: false })] } };
    expect(amendmentState(more).status).toBe('stale');
    expect(keepTestOf(more, {}).todo).toEqual({ id: 'todo', slots: {} });
    const moved = { ...q, holdings: { ...q.holdings, expected: [{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 30000, by: '2029-06' }] } };
    expect(amendmentState(moved).status).toBe('stale');
    const doc2 = { ...q, planDocument: { ...q.planDocument, createdAt: '2027-01-01T00:00:00.000Z' } };
    expect(amendmentState(doc2).status).toBe('stale');
    const none = { ...q, holdings: { ...q.holdings, lines: q.holdings.lines.map(({ keep, ...l }) => l), expected: undefined } };
    expect(keepTestOf(none, {})).toMatchObject({ status: 'stale', todo: null, line: { id: 'line.lapsed' }, canWithdraw: true });
    // a value moving with the market is not a change of what is kept
    const valued = { ...q, holdings: { ...q.holdings, lines: q.holdings.lines.map((l) => ({ ...l, value: l.value * 1.1 })) } };
    expect(amendmentState(valued).status).toBe('agreed');
  });
  it('refused when the result is not for what is kept now, nothing is kept, or the plan is not locked', () => {
    expect(amendPatch(p, { ...r, fingerprint: 'x' }, { at: AT })).toMatchObject({ ok: false, problem: 'stale' });
    expect(amendPatch(p, null, { at: AT })).toMatchObject({ ok: false, problem: 'noResult' });
    const bare = fixture('20-locked-start-after-stop.json');
    expect(amendPatch(bare, r, { at: AT })).toMatchObject({ ok: false, problem: 'nothingKept' });
    const draft = { ...p, decisionTool: { ...p.decisionTool, settings: { ...p.decisionTool.settings, locked: false } } };
    expect(amendPatch(draft, r, { at: AT })).toMatchObject({ ok: false, problem: 'notLocked' });
  });
  it('withdraw takes the last agreement off, in one write; with none there is nothing to withdraw', () => {
    const q = agreed();
    const w = withdrawPatch(q);
    expect(w.ok).toBe(true);
    expect(w.patch).toEqual({ planAmendments: [] });
    expect(w.previous.planAmendments).toEqual(q.planAmendments);
    expect(keepTestOf({ ...q, planAmendments: [] }, {}).status).toBe('untested');
    expect(withdrawPatch(p)).toMatchObject({ ok: false, problem: 'none' });
  });
  it('a closed plan refuses any change to its agreements; a copy carries none; no migration may change them', () => {
    const q = { ...agreed(), closedAt: '2027-03', nextPlanId: 'NextPlan01' };
    expect(closedPlanRefusal(q, { planAmendments: [] })).toContain('planAmendments');
    expect(closedPlanRefusal(q, { planAmendments: q.planAmendments })).toBe(null);
    expect(copyOf(agreed(), 'Copy', { now: noon(TODAY) })).not.toHaveProperty('planAmendments');
    const bad = { up: (s) => { s.planAmendments = []; return s; }, to: 99 };
    const old = { ...agreed(), schemaVersion: 98 };
    const m = migrateScenario(old, { now: noon(TODAY), migrations: [bad], target: 99 });
    expect(m.error && m.error.message).toMatch(/planAmendments/);
  });
  it('normalises the stored list: anything not an agreement is dropped', () => {
    expect(normaliseAmendments([null, { at: 'x' }, { at: AT, kind: 'keep', fingerprint: 'f' }, { at: AT, kind: 'other', fingerprint: 'f' }])).toEqual([{ at: AT, kind: 'keep', fingerprint: 'f' }]);
  });
});

describe('plans that keep nothing read exactly as before', () => {
  for (const f of readdirSync(FIX).filter((x) => x.endsWith('.json') && x !== 'snapshot.json')) {
    it(f, () => {
      const p = fixture(f); p.id = p.id || 'Fx' + f.slice(0, 2);
      expect(keepTestOf(p, {})).toBe(null);
      expect(amendmentState(p).status).toBe('none');
      expect(keepFingerprint(p.holdings)).toBe('');
      expect(keepLineHtml(p)).toBe('');
      expect(keepTestHtml(null)).toBe('');
      let h = null; try { h = homeOf([{ plan: p }], p.id, { today: TODAY }); } catch { h = null; }
      if (h && h.found) expect(JSON.stringify(h)).not.toMatch(/keepTest|hold\.keepTest/);
    });
  }
});

describe('both apps say the same words, and the words give no advice', () => {
  it('the classic Transition tab draws the same reading: the test, the table, the accept and its confirm', () => {
    const p = samKeeps();
    const r = runKeepRetest(p, { today: TODAY });
    const v = keepTestOf(p, { result: r });
    const html = keepTestHtml({ ...v, confirmOpen: false });
    expect(html).toContain('runKeepTest()');
    expect(html).toContain('askKeepRisk()');
    expect(html).toContain(KEEPTEST.columns.locked);
    expect(html).toContain(sayKeep(v.result.held.bad, KEEPTEST).replace(/&/g, '&amp;'));
    expect(keepTestHtml({ ...v, confirmOpen: true })).toContain('acceptKeepRisk()');
    expect(typeof transitionHtml).toBe('function');
  });
  it('every word of the test and the agreement is free of advice and of the banned words', () => {
    const p = samKeeps({ counted: true });
    const r = runKeepRetest(p, { today: TODAY });
    const v = keepTestOf(p, { result: r });
    const said = [v.line, v.result.firstShort, v.result.single, ...v.result.shock, v.result.held.bad, v.result.locked.bad].filter(Boolean).map((x) => sayKeep(x, KEEPTEST));
    const flat = (o) => (typeof o === 'string' ? [o] : Object.values(o).flatMap(flat));
    for (const t of [...said, ...flat(KEEPTEST).map((x) => x.replace(/\{\w+\}/g, 'two'))]) for (const b of BANNED.filter((x) => ['all', 'planner', 'record', 'result'].includes(x.scope))) {
      if (b.kind === 'explain') { if (b.re.test(t)) expect(b.needs.test(t), `"${t}" needs ${b.needs}`).toBe(true); continue; }
      const hit = b.re.test(t) && !(b.allow || []).some((a) => a.test(t));
      expect(hit, `"${t}" uses ${b.id}`).toBe(false);
    }
  });
});
