/**
 * T4 (research/v7/your-plan.md 2.5, 9): the parity section is complete. Every `stress.*` and `decision.*` key in
 * tests/v7/parity/ledger.json is shown by one of the four sections of "Your plan" or by a row of "Everything else this
 * plan uses" — so a new setting in the planner cannot be invisible in V7. Every row has its words; every fact draws
 * without junk on every committed plan.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { OPTIONS, SECTION_KEYS, coveredKeys, optionsFor } from '../../../src/answers/plan/options.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entryOf, noon, TODAY } from './_plans.js';

const ledger = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/parity/ledger.json'), 'utf8'));
const C = corpus();

describe('every saved setting is visible in V7 (the parity rule)', () => {
  it('every stress.* and decision.* key in the ledger is shown by a section or a row', () => {
    const keys = new Set();
    for (const r of ledger.rows) for (const k of r.keys) if (/^(stress|decision)\./.test(k)) keys.add(k);
    expect(keys.size).toBeGreaterThan(100);
    const covered = coveredKeys();
    const missing = [...keys].filter((k) => !covered.has(k)).sort();
    expect(missing, 'keys shown by no section and no row of src/answers/plan/options.js').toEqual([]);
  });
  it('no row names a key the ledger does not have (a key renamed in the planner would be caught)', () => {
    const keys = new Set();
    for (const r of ledger.rows) for (const k of r.keys) keys.add(k);
    for (const r of OPTIONS) for (const k of r.keys) expect(keys.has(k), `${r.id} names ${k}`).toBe(true);
    for (const ks of Object.values(SECTION_KEYS)) for (const k of ks) expect(keys.has(k), k).toBe(true);
  });
  it('every row has a name and a label for every fact it can give; every row id is unique', () => {
    const ids = new Set();
    for (const r of OPTIONS) {
      expect(ids.has(r.id), r.id).toBe(false); ids.add(r.id);
      expect(PLAN.options[r.id], r.id).toBeTruthy();
      expect(PLAN.options[r.id].name.length).toBeGreaterThan(3);
    }
  });
  it('on every committed plan, every fact of every row draws: a number with a kind, a choice with words, or text', () => {
    for (const [name, raw] of Object.entries(C)) {
      const plan = entryOf(raw).plan;
      const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
      const ds = plan.decisionTool.settings || {};
      const all = optionsFor(ss, ds, plan, { all: true });
      expect(all.length).toBe(OPTIONS.length);
      for (const r of all) for (const f of r.facts) {
        const label = PLAN.options[r.id].facts[f.k.replace(/\d+$/, '')];
        expect(label, `${name}: ${r.id}.${f.k} has no label`).toBeTruthy();
        if (f.kind === 'money' || f.kind === 'count' || f.kind === 'pct') expect(Number.isFinite(f.v), `${name}: ${r.id}.${f.k}`).toBe(true);
        else if (f.kind === 'choice') expect(PLAN.choices[f.v] || f.v, `${name}: ${r.id}.${f.k}`).toBeTruthy();
        else expect(['yesNo', 'text']).toContain(f.kind);
      }
      const set = optionsFor(ss, ds, plan);
      for (const r of set) expect(r.set).toBe(true);
    }
  });
  it('the rows a plan has moved: the locked ladder shows its lock and its dials; a fresh plan shows almost nothing', () => {
    const ladder = entryOf(C['03-gilt-ladder-runup']).plan;
    const set = optionsFor(effectiveStressSettings(ladder, { now: noon(TODAY) }), ladder.decisionTool.settings, ladder).map((r) => r.id);
    expect(set).toContain('lock.lock');
    const fresh = entryOf(C['01-fresh-default']).plan;
    const few = optionsFor(effectiveStressSettings(fresh, { now: noon(TODAY) }), fresh.decisionTool.settings, fresh).map((r) => r.id);
    expect(few).not.toContain('lock.lock');
    expect(few.length).toBeLessThan(4);
  });
});
