/**
 * 7.8.0, the classic planner (the build spec's sections 6 and 8): the verdict block every strategy card opens with lives in
 * src/ui/oneAnswerView.js (verdictBlockView), the page keeping a one-line pass-through.
 *  - an old document (LEGACY_DEFINITION), and every block while not weighing, is the block before 7.8.0 byte for byte (the
 *    frozen copy in verdictBlock.v1), on every corpus document and on results across the whole range of chances and kinds;
 *    so is the card's tone;
 *  - a live block, weighing: the chance at the level with the fixed-age line and its age in the same block (data-weighted
 *    beside data-fixed), the floor, what is left, what we assumed, the level control; the tone from the verdict word;
 *  - a document locked with the weighted definition reads its own figures at its own stored lines;
 *  - the session's level (window.setChanceLevel) draws the blocks again at it, writing nothing;
 *  - the card's count names its age; the Assumptions row only while weighing; the page's script carries none of the words.
 * All fictional (the test corpus).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { verdictBlockHtml as frozenBlock } from './verdictBlock.v1/verdictBlock.js';
import { verdictBlockView, legacyVerdictBlockHtml, cardToneOf, chanceOptsOf, chanceVerdictOf, countAgeHtml, installChanceLevel, lifeAssumptionsRows, successLineHtml } from '../../../src/ui/oneAnswerView.js';
import { planDocumentHtml } from '../../../src/ui/components/PlanDocumentView.js';
import { LEGACY_DEFINITION, definitionOf } from '../../../src/services/PlanDocument.js';
import { chanceRunOf, runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { lifeOfSettings } from '../../../src/answers/plan/life.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const LIFE = lifeOfSettings({ currentAge: 66, currentAgeAsOf: '2026-05-01' }, now, { startAge: 66 });
const P = { startAge: 66, durationYears: 31, spAnnual: 12000, spStartYear: 1 };

/** A made-up result in stressTestStrategy's shape: `fails` of 20 futures failed, at run years 20 on. */
const fake = (strategyId, fails, more = {}) => {
  const survivedMc = Array.from({ length: 20 }, (_, i) => i >= fails);
  return {
    strategyId, affordable: true, ruin: { mc: fails * 5, hist: 3.2 }, n: { mc: 20, hist: 600 }, coverage: 97.5, worst12: { min: 31000, median: 40000 },
    terminal: { p10: 0, p50: 200000, p90: 700000 }, failAges: [], survivedMc,
    futuresMc: { headYear: survivedMc.map((ok, i) => (ok ? null : 20 + i)), failYear: [] }, ...more
  };
};
const KINDS = [['pots-and-valves', {}], ['gilt-rotation', { ruinLabel: 'chance the rotated years are cut' }], ['floor-and-flex', { ruinLabel: 'chance of a lean year' }]];

describe('the block before 7.8.0, byte for byte: old documents and the rollback', () => {
  it('every locked corpus document, and every made-up result from no failure to most, reads exactly as the frozen block', () => {
    let n = 0;
    for (const raw of Object.values(C)) {
      const plan = entryOf(raw).plan;
      const d = plan.planDocument;
      if (!d || !d.strategy || !d.strategy.r || !d.strategy.p) continue;
      expect(definitionOf(d)).toBe(LEGACY_DEFINITION);
      expect(verdictBlockView(d.strategy.r, d.strategy.p, { definition: definitionOf(d) })).toBe(frozenBlock(d.strategy.r, d.strategy.p));
      n++;
    }
    expect(n).toBeGreaterThan(0);
    for (const [id, more] of KINDS) for (let f = 0; f <= 20; f++) {
      const r = fake(id, f, more);
      const old = frozenBlock(r, P);
      expect(legacyVerdictBlockHtml(r, P)).toBe(old);
      expect(verdictBlockView(r, P, { definition: LEGACY_DEFINITION })).toBe(old);
      expect(verdictBlockView(r, P, {})).toBe(old);                       // not weighing: the rollback
      expect(verdictBlockView(r, P)).toBe(old);
      const m = r.ruin.mc;
      expect(cardToneOf(r, P, { definition: LEGACY_DEFINITION })).toBe(m <= 5 ? 'alert-success' : m <= 15 ? 'alert-warning' : 'alert-danger');
    }
    expect(verdictBlockView({ affordable: false }, P)).toBe('');
  });
  it('the full view of an old document: its card is given the old definition, and no line from a definition it does not have', () => {
    const plan = entryOf(C['03-gilt-ladder-locked']).plan;
    const seen = [];
    const h = planDocumentHtml(plan.planDocument, { strategyCard: (r, p, opts) => { seen.push(opts); return '<div class="card">' + verdictBlockView(r, p, chanceOptsOf(r, opts)) + '</div>'; }, staircaseSvg: () => '', whereAmI: '' });
    expect(seen[0].definition).toBe(LEGACY_DEFINITION);
    expect(h).toContain(frozenBlock(plan.planDocument.strategy.r, plan.planDocument.strategy.p));
    expect(successLineHtml(plan.planDocument)).toBe('');
  });
});

describe('a live block, weighing', () => {
  it('the chance at the level and the fixed-age line with its age in the same block; floor, left, assumed, the control; the tone from the word', () => {
    for (const [id, more] of KINDS) for (const f of [0, 2, 6, 12]) {
      const r = fake(id, f, more);
      const o = { life: LIFE, level: 'balanced', floorAt: () => 12500 };
      const h = verdictBlockView(r, P, o);
      const box = document.createElement('div');
      box.innerHTML = h;
      const block = box.querySelector('[data-chance-block]');
      expect(block, `${id} ${f}`).toBeTruthy();
      expect(block.querySelector('[data-weighted]')).toBeTruthy();
      const fixed = block.querySelector('[data-fixed]');
      expect(fixed.textContent).toMatch(/^If you live to 96, /);
      expect(block.querySelector('select').value).toBe('balanced');
      expect([...block.querySelectorAll('option')].map((x) => x.textContent)).toEqual(['19 times in 20: Careful', '18 times in 20: Balanced (we start here)', '14 times in 20: Bold']);
      expect(block.textContent).toMatch(/We tested to 96, the age your plan runs to\./);
      expect(block.textContent).not.toMatch(/NaN|undefined/);
      const v = chanceVerdictOf(r, P, o);
      expect(block.className).toContain('verdict-' + (v === 'yes' ? 'success' : v === 'close' ? 'warning' : 'danger'));
      expect(cardToneOf(r, P, o)).toBe(v === 'yes' ? 'alert-success' : v === 'close' ? 'alert-warning' : 'alert-danger');
    }
  });
  it('Bold says its consequence; a plan with no weighted figure leads with the fixed-age count and says why', () => {
    const bold = verdictBlockView(fake('pots-and-valves', 4), P, { life: LIFE, level: 'bold' });
    // (its consequence from the plan's own chance: 4 of 20 failed late, so about 1 time in 10 while you are alive)
    expect(bold).toMatch(/(About \d+ times? in 10|Less than 1 time in 10) the money runs out while you are alive, and you would spend less from then on\./);
    expect(bold).not.toContain('About 3 times in 10');
    const linked = verdictBlockView(fake('pots-and-valves', 4), P, { life: { ...LIFE, reason: 'linked' } });
    expect(linked).not.toContain('data-weighted');
    expect(linked).toContain('data-fixed="1"');
    expect(linked).toContain('If you live to 96, the money lasts that long in 16 of 20 futures we tried.');
  });
});

describe('a document locked with the weighted definition reads its own figures at its own lines', { timeout: 120_000 }, () => {
  it('its words, its verdict at the stored lines (not today\'s), its one line in the full view', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const run = runForDocument(plan, { today: TODAY, weighted: true });
    const def = run.success;
    const h = verdictBlockView(run.r, run.p, { definition: def });
    expect(h).toContain('When the plan was locked, counting how long people your age live, the money lasts as long as you do');
    expect(h).toContain('data-fixed="1"');
    // the document keeps its own lines: moved, the verdict moves with them, never with today's levels
    const strict = { ...def, lines: { yes: 0.999, close: 0.998 } };
    expect(chanceVerdictOf(run.r, run.p, { definition: strict })).toBe('no');
    expect(cardToneOf(run.r, run.p, { definition: strict })).toBe('alert-danger');
    const doc = { assumptions: { success: def } };
    expect(successLineHtml(doc)).toMatch(/^<p class="hint" data-fixed="1">Locked at Balanced \(lasting as long as you do 18 times in 20, counting how long people your age live\), tested to \d+ and each future followed on to \d+\.<\/p>$/);
  });
});

describe('the session\'s level, and the page\'s own wiring', { timeout: 120_000 }, () => {
  it('window.setChanceLevel draws every block again at the level; an unknown level does nothing', () => {
    const r = fake('pots-and-valves', 3);
    const win = { _oneTest: { r, p: P, chance: { life: LIFE, level: 'balanced' } } };
    document.body.innerHTML = '<div id="a">' + verdictBlockView(r, P, win._oneTest.chance) + '</div><div id="b">' + verdictBlockView(r, P, win._oneTest.chance) + '</div>';
    installChanceLevel(win, document);
    win.setChanceLevel('bold');
    expect(win._chanceLevel).toBe('bold');
    expect([...document.querySelectorAll('[data-chance-block]')].map((x) => x.getAttribute('data-level'))).toEqual(['bold', 'bold']);
    win.setChanceLevel('reckless');
    expect(win._chanceLevel).toBe('bold');
    expect(chanceOptsOf(r, {}, win._oneTest)).toBe(win._oneTest.chance);
    expect(chanceOptsOf(fake('pots-and-valves', 3), {}, win._oneTest)).toEqual({});
  });
  it('the classic one test weighs only while weighing; a locked ladder reads its document\'s figure', () => {
    const plan = entryOf(C['03-gilt-ladder-locked']).plan;
    const d = plan.planDocument;
    expect(chanceRunOf(plan, { settings: {}, strategyId: d.strategy.id, p: d.strategy.p, r: d.strategy.r, now, weighted: false })).toBe(null);
    const o = chanceRunOf(plan, { settings: {}, strategyId: d.strategy.id, p: d.strategy.p, r: d.strategy.r, now, weighted: true, locked: { doc: d }, level: 'careful' });
    expect(o.level).toBe('careful');
    expect(o.stored).toEqual({ chance: null });
  });
  it('the card\'s count names its age; the Assumptions row only while weighing; the page\'s script carries none of the block\'s words', () => {
    expect(countAgeHtml(fake('pots-and-valves', 2), P)).toBe(' <span class="hint" data-fixed="1">If you live to 96, the money lasts that long in 18 of 20 futures we tried.</span>');
    expect(countAgeHtml(fake('gilt-rotation', 2, { ruinLabel: 'x' }), P)).toContain('your income is paid in full that long');
    const row = (...a) => a;
    expect(lifeAssumptionsRows(row, false)).toEqual([]);
    const [[k, v, note]] = lifeAssumptionsRows(row, true);
    expect(k).toBe('How long the money has to last');
    expect(v).toMatch(/2024-based, published 15 May 2026/);
    expect(note).toMatch(/Careful 19 times in 20, Balanced 18, Bold 14/);
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]))[0][2];
    expect(script).toMatch(/function verdictBlockHtml\(r, p, o\) \{ return verdictBlockView\(r, p, o \|\| \{\}\); \}/);
    expect(script).not.toMatch(/verdict-heroes/);
    expect(script).not.toMatch(/ruinMc <= 5 \? 'alert-success'/);
    expect(script).toMatch(/installChanceLevel\(window, document\)/);
    expect(script).toMatch(/chance: chanceRunOf\(/);
    // the classic About suggestion: not said selected, no half-way age (both apps)
    expect(html).toMatch(/<option value="notSaid" selected>Not said<\/option>/);
    expect(html).not.toMatch(/Average life expectancy/);
  });
});
