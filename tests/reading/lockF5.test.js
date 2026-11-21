/**
 * Step F5 (lead4.md D18): lock, unlock and a new version of the plan document have ONE write path and ONE document
 * gatherer for both views (answers/plan/lock.js lockPatch / unlockPatch / documentPatch, documentFor). The full view no
 * longer builds the document from the page (its name from the page, its essentials from a page global) nor writes three times.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { lockWrite, unlockWrite, documentWrite, documentRunOf } from '../../src/ui/lockWrite.js';
import { lockPatch, unlockPatch } from '../../src/answers/plan/lock.js';
import { runForDocument } from '../../src/answers/plan/lastsRun.js';
import { isLockedSettings } from '../../src/services/LockedPlanGuard.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const html = readFileSync('index.html', 'utf8');
const plansOf = (key) => { const f = FIXTURES.find((x) => x.key === key); const plans = f.plans().map(up); return { plans, plan: plans.find((p) => p.id === f.subject), entries: plans.map((p) => ({ plan: p, newer: false, failed: false })) }; };

describe('the full view locks and unlocks through the simple view\'s one write', () => {
  it('a draft is locked in ONE write of exactly lockPatch\'s paths, the document built from the plan\'s own run', async () => {
    const { plan, entries } = plansOf('retired-draft');
    expect(isLockedSettings(plan.decisionTool && plan.decisionTool.settings)).toBe(false);
    const asked = [];
    const run = await documentRunOf(plan, entries, { today: PARITY_DAY, runInWorker: async (type, payload) => { asked.push(type); return runForDocument(payload.plan, payload); } });
    expect(asked).toEqual(['document']);
    const writes = [];
    const p = await lockWrite({ planId: plan.id, plan, entries, now: NOW, run, save: async (id, patch) => writes.push([id, patch]) });
    expect(p.ok).toBe(true);
    expect(writes.length).toBe(1);
    expect(writes[0][0]).toBe(plan.id);
    expect(writes[0][1]).toEqual(lockPatch(plan, { now: NOW, run, entries }).patch);
    expect(writes[0][1].planDocument.planName).toBeTruthy();
    expect(writes[0][1]['decisionTool.settings.locked']).toBe(true);
  });
  it('a locked plan is unlocked in ONE write of exactly unlockPatch\'s paths; a new version is one write too', async () => {
    const { plan, entries } = plansOf('retired-locked-pots');
    expect(isLockedSettings(plan.decisionTool.settings)).toBe(true);
    const writes = [];
    const run = await documentRunOf(plan, entries, { today: PARITY_DAY, inline: (pl, o) => runForDocument(pl, o) });
    const d = await documentWrite({ planId: plan.id, plan, entries, now: NOW, run, save: async (id, patch) => writes.push(patch) });
    expect(d.ok).toBe(true);
    const u = await unlockWrite({ planId: plan.id, plan, now: NOW, save: async (id, patch) => writes.push(patch) });
    expect(u.ok).toBe(true);
    expect(writes.length).toBe(2);
    expect(writes[1]).toEqual(unlockPatch(plan, { now: NOW }).patch);
  });
  it('a refusal writes nothing', async () => {
    const { plan } = plansOf('retired-locked-pots');
    const writes = [];
    const p = await lockWrite({ planId: plan.id, plan, entries: [], now: NOW, run: { p: {}, r: {} }, save: async () => writes.push(1) });
    expect(p.ok).toBe(false);
    expect(writes.length).toBe(0);
  });
});

describe('the superseded document builder is gone from the full view', () => {
  it('no document built from the page: no page name, no page essentials, no three writes', () => {
    expect(html).not.toContain('buildPlanDocumentNow');
    expect(html).not.toContain('strategyResultForDocument');
    expect(html).not.toMatch(/buildPlanDocument\(/);
    expect(html).not.toMatch(/lockPlanIfNeeded\(/);
    expect(html).not.toMatch(/await unlockPlan\(\)/);
    const unlock = html.slice(html.indexOf('window.unlockDecisionSettings = async function'), html.indexOf('window.createNewPlanForSettings'));
    expect(unlock).toContain('unlockWrite({');
    expect(unlock).not.toContain('saveStressSettings(');
    const newVersion = html.slice(html.indexOf('window.createPlanDocumentNow = async function'), html.indexOf('window.openPlanDocument = function'));
    expect(newVersion).toContain('documentWrite({');
    expect(newVersion).toContain("repaintPlan('lock')");
  });
  it('the worker runs the simple view\'s document run', () => {
    const w = readFileSync('src/workers/engineWorker.js', 'utf8');
    expect(w).toContain("type === 'document'");
    expect(w).toContain('runForDocument(payload.plan');
  });
});
