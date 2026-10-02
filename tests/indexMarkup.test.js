/**
 * index.html structure guards. A stray </div> once nested every later tab panel inside the Decision
 * settings grid, so only the Decision tool showed a sub-tab ribbon (v6.2.1 → hotfix 6.2.2).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const doc = new JSDOM(html).window.document;

describe('tab panels are siblings, each with its own ribbon', () => {
  it('every .tab-content shares one parent', () => {
    const panels = [...doc.querySelectorAll('.tab-content')];
    expect(panels.length).toBeGreaterThanOrEqual(6);
    const parents = new Set(panels.map((p) => p.parentElement));
    expect(parents.size).toBe(1);
  });
  it('the Stress and Decision panels carry their sub-tab ribbons directly', () => {
    expect(doc.querySelectorAll('#stress-content .sub-tab[data-stresstab]').length).toBe(6);
    expect(doc.querySelectorAll('#decision-content .sub-tab[data-decisiontab]').length).toBe(5);   // + Plan document (6.5.0)
    expect(doc.querySelector('#decision-plandoc')).not.toBeNull();
    expect(doc.querySelector('#ssLockBtn')).not.toBeNull();
    expect(doc.querySelector('#ssLockBanner')).not.toBeNull();
    expect(doc.querySelector('#decision-content #stress-content')).toBeNull();
    expect(doc.querySelector('#strategies-content #stratNav')).not.toBeNull();
  });
});

/**
 * H1 (research/v7/couples-different-years.md 7, 9.7): the Household tab says when one of the two plans begins later than
 * the other — a plan made for someone still working starts at their own stop — and says nothing when they begin together.
 * Words only: the joint check already lines the plans up by their starts (startOffset).
 */
describe('the Household tab: a line when one plan begins later than the other (H1)', () => {
  const raw = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  it('appears when the offsets differ, saying which plan, when, and what is counted until then', async () => {
    const { householdStartWords } = await import('../src/services/PlanSeed.js');
    expect(householdStartWords({ offset: 0, firstTaxYear: 2026 }, { offset: 1, firstTaxYear: 2027 })).toBe(
      'Your partner\'s plan begins in 2027/28, when they stop work. Until then their pay covers their part, and what they pay in is in that plan\'s pot at the start. '
      + 'Before then, “What you\'d have left” counts their pot as it is expected to be when they stop.');
    expect(householdStartWords({ offset: 4, firstTaxYear: 2030 }, { offset: 1, firstTaxYear: 2027 })).toBe(
      'This plan begins in 2030/31, when you stop work. Until then your pay covers your part, and what you pay in is in this plan\'s pot at the start. '
      + 'Before then, “What you\'d have left” counts your pot as it is expected to be when you stop.');
    expect(householdStartWords({ offset: 0 }, { offset: 2 })).toMatch(/^Your partner's plan begins later, when they stop work\./);
  });
  it('says nothing when the plans begin together (the same year, or both now)', async () => {
    const { householdStartWords } = await import('../src/services/PlanSeed.js');
    expect(householdStartWords({ offset: 0, firstTaxYear: 2026 }, { offset: 0, firstTaxYear: 2026 })).toBe('');
    expect(householdStartWords({ offset: 5, firstTaxYear: 2031 }, { offset: 5, firstTaxYear: 2031 })).toBe('');
    expect(householdStartWords({}, {})).toBe('');
    expect(householdStartWords(null, undefined)).toBe('');
  });
  it('the joint check shows it beside the result, from the two plans\' own offsets and first tax years', () => {
    expect(raw).toMatch(/import \{ householdStartWords \} from '\.\/src\/services\/PlanSeed\.js';/);
    // no line added to the inline script (tests/v7/shellRatchet.test.js): the import and the call share existing lines
    const check = raw.slice(raw.indexOf('window.runHouseholdCheck = async function'), raw.indexOf('// ---- Where the money comes from, year by year ----'));
    expect(check).toMatch(/householdStartWords\(\{ offset: offsets\.a, firstTaxYear: deriveTiming\(ownSettings\)\.firstTaxYear \}, \{ offset: offsets\.b, firstTaxYear: deriveTiming\(partnerSettings\)\.firstTaxYear \}\)/);
    expect(check).toMatch(/\+ stratNote \+ \(\(note\) => \(note \? '<p class="hint" id="hhStartsNote"[^']*>' \+ budEsc\(note\) \+ '<\/p>' : ''\)\)\(householdStartWords\(/);
  });
  it('plain words: no "scenario", "bridge", "retire", nothing broken', async () => {
    const { householdStartWords } = await import('../src/services/PlanSeed.js');
    for (const t of [householdStartWords({ offset: 0, firstTaxYear: 2026 }, { offset: 1, firstTaxYear: 2027 }), householdStartWords({ offset: 3, firstTaxYear: 2029 }, { offset: 0 })]) {
      expect(t).not.toMatch(/scenario|bridg|\bretire\b|undefined|NaN|null/i);
    }
  });
});
