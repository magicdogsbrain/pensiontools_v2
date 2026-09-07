/**
 * Release notes are a contract, not a courtesy. A version bump without notes, or notes without a
 * bump, must fail here — that is what makes "every release explains itself" stick.
 */
import { describe, it, expect } from 'vitest';
import { version as pkgVersion } from '../package.json';
import { VERSION } from '../src/constants.js';
import { ENGINE_VERSION } from '../src/strategies/version.js';
import { RELEASES, TOOL_IDS, parseVersion, compareVersions, isAnnounced, releasesSince, latestRelease } from '../src/releases.js';
import { RELEASE_HISTORY } from '../src/releases-history.js';
import { whatsNewHtml, versionsPageHtml, effectsHtml, safeAffects, esc } from '../src/ui/components/ReleaseNotesView.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

describe('the release contract', () => {
  it('the app version comes from package.json and the newest release note matches it', () => {
    expect(VERSION).toBe(pkgVersion);
    expect(RELEASES[0].version).toBe(pkgVersion);
    expect(RELEASES[0].engineVersion).toBe(ENGINE_VERSION);
    expect(isAnnounced(RELEASES[0])).toBe(true);
  });

  it('every curated entry is complete: semver, ISO date, engine version, summary, something changed, effects for known tools only, actions', () => {
    for (const r of RELEASES) {
      expect(parseVersion(r.version), r.version).not.toBeNull();
      expect(r.date, r.version).toMatch(ISO);
      expect(parseVersion(r.engineVersion), r.version).not.toBeNull();
      expect(r.title && r.summary, r.version).toBeTruthy();
      expect((r.changes || []).length + (r.corrections || []).length, r.version).toBeGreaterThan(0);
      expect(typeof r.effects, r.version).toBe('object');
      for (const k of Object.keys(r.effects)) expect(TOOL_IDS, r.version + ' effects.' + k).toContain(k);
      for (const t of TOOL_IDS) expect(Array.isArray(r.effects[t]), r.version + ' effects.' + t + ' must be listed (empty = no effect)').toBe(true);
      expect(Array.isArray(r.actions), r.version).toBe(true);
      if (r.affects) expect(typeof r.affects).toBe('function');
    }
  });

  it('versions are strictly descending across the curated notes and the reconstructed history, with no overlap', () => {
    const all = [...RELEASES, ...RELEASE_HISTORY];
    for (let i = 1; i < all.length; i++) expect(compareVersions(all[i - 1].version, all[i].version), all[i - 1].version + ' > ' + all[i].version).toBeGreaterThan(0);
    for (const r of RELEASE_HISTORY) { expect(r.reconstructed).toBe(true); expect(isAnnounced(r)).toBe(false); expect(r.date).toMatch(ISO); expect(r.summary).toBeTruthy(); }
  });
});

describe('version helpers', () => {
  it('compareVersions orders numerically, not lexically', () => {
    expect(compareVersions('6.10.0', '6.9.1')).toBeGreaterThan(0);
    expect(compareVersions('6.1.0', '6.1.0')).toBe(0);
    expect(compareVersions('6.0.12', '6.1.0')).toBeLessThan(0);
    expect(compareVersions(null, '0.0.1')).toBeLessThan(0);
  });
  it('minor and major releases announce; patches do not unless told to', () => {
    expect(isAnnounced({ version: '6.1.0' })).toBe(true);
    expect(isAnnounced({ version: '7.0.0' })).toBe(true);
    expect(isAnnounced({ version: '6.1.1' })).toBe(false);
    expect(isAnnounced({ version: '6.1.1', announce: true })).toBe(true);
    expect(isAnnounced({ version: '6.2.0', announce: false })).toBe(false);
  });
  it('releasesSince: only announced entries newer than what was last seen; nothing seen = everything announced', () => {
    const rels = [{ version: '6.2.0' }, { version: '6.1.1' }, { version: '6.1.0' }, { version: '6.0.0' }];
    expect(releasesSince('6.1.0', rels).map((r) => r.version)).toEqual(['6.2.0']);
    expect(releasesSince(null, rels).map((r) => r.version)).toEqual(['6.2.0', '6.1.0', '6.0.0']);
    expect(releasesSince('6.2.0', rels)).toEqual([]);
    expect(releasesSince('6.0.0').map((r) => r.version)).toContain(pkgVersion);
    expect(latestRelease().version).toBe(pkgVersion);
  });
});

describe('rendering', () => {
  const evil = { version: '9.9.0', date: '2030-01-01', engineVersion: '9.9.0', title: '<script>x</script>', summary: 'a & b', changes: ['<b>bold</b>'], corrections: [], effects: { stress: ['s'], decision: ['d'], budget: [], strategies: [], accumulation: [], household: [] }, actions: ['do "this"'], notes: [] };

  it('escapes everything that came from the data', () => {
    const h = whatsNewHtml([evil]);
    expect(h).not.toMatch(/<script>/);
    expect(h).toMatch(/&lt;script&gt;/);
    expect(h).toMatch(/a &amp; b/);
    expect(h).toMatch(/&lt;b&gt;bold/);
    expect(esc('"\'')).toBe('&quot;&#39;');
  });

  it('hides Decision/Stress effects only when those tools are switched off, and names the unaffected tools', () => {
    const on = effectsHtml(evil.effects, ['budget', 'stress', 'decision']);
    expect(on).toMatch(/Stress Tester/); expect(on).toMatch(/Decision tool/);
    const off = effectsHtml(evil.effects, ['budget']);
    expect(off).not.toMatch(/Stress Tester/); expect(off).not.toMatch(/Decision tool/);
    expect(off).toMatch(/No effect on saved plans in: Budget Planner/);
    expect(effectsHtml(evil.effects, undefined)).toMatch(/Stress Tester/);   // unknown tool list = show all
  });

  it('the 6.1.0 pop-up tells a plan on ISA hold what changed, and lists the active plan\'s own bullets', () => {
    const rel = RELEASES.find((r) => r.version === '6.1.0');
    const scenario = { planDetails: { name: 'Mine' }, stressTool: { settings: { taxableStart: 50000, taxableMix: 'gilt', isaDrawdownStrategy: 'hold', bedAndIsa: true, bandFillRecycle: true, windfalls: [{ year: 3, amount: 100000 }] } }, decisionTool: { settings: { locked: true } }, strategy: { engineVersion: '6.0.0' } };
    const notes = safeAffects(rel, scenario);
    expect(notes.length).toBeGreaterThanOrEqual(4);
    expect(notes.join(' ')).toMatch(/£50,000/); expect(notes.join(' ')).toMatch(/Hold/); expect(notes.join(' ')).toMatch(/locked/);
    const h = whatsNewHtml([rel], { enabledTools: ['stress', 'decision', 'budget'], planNotes: [{ name: 'Mine', notes }], otherPlanCount: 2 });
    expect(h).toMatch(/on hold/i);
    expect(h).toMatch(/Your plan “Mine”/);
    expect(h).toMatch(/2 other plans/);
    expect(h).toMatch(/What you may need to do/);
  });

  it('affects() survives an empty or ancient plan shape', () => {
    for (const r of RELEASES) if (r.affects) { expect(safeAffects(r, {})).toEqual([]); expect(safeAffects(r, undefined)).toEqual([]); expect(safeAffects(r, { stressTool: {}, decisionTool: null })).toEqual([]); }
    expect(safeAffects({ affects() { throw new Error('boom'); } }, {})).toEqual([]);
  });

  it('the page opens the newest release, marks fix releases and reconstructed history, and lists per-plan notes', () => {
    const rel61 = RELEASES.find((r) => r.version === '6.1.0');
    const h = versionsPageHtml([{ ...evil, version: '9.9.1' }, rel61], RELEASE_HISTORY, { currentVersion: '9.9.1', plans: [{ name: 'P1', scenario: { stressTool: { settings: { taxableStart: 1000 } } } }] });
    expect(h).toMatch(/<details class="rn-details" open>/);
    expect(h).toMatch(/fix release/);
    expect(h).toMatch(/Before release notes/);
    expect((h.match(/rn-reconstructed/g) || []).length).toBe(RELEASE_HISTORY.length);
    expect(h).toMatch(/Your plan “P1”/);
    expect(h).toMatch(/v9\.9\.1/);
  });

  it('nothing to announce renders nothing', () => { expect(whatsNewHtml([])).toBe(''); expect(whatsNewHtml(null)).toBe(''); });
});
