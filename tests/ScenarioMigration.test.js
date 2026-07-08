import { describe, it, expect } from 'vitest';
import { normalizeScenario } from '../src/firebase/scenarioMigration.js';

describe('normalizeScenario', () => {
  it('leaves a clean nested scenario untouched (migrated=false)', () => {
    const clean = {
      id: 'a',
      isActive: true,
      enabledTools: ['stress', 'decision'],
      planDetails: { name: 'Plan', description: 'd' },
      decisionTool: { settings: { equityMin: 1 }, history: [{ m: 1 }], taxYears: { '26/27': {} } },
      stressTool: { settings: { equityMin: 2 } }
    };
    const { scenario, migrated } = normalizeScenario(clean);
    expect(migrated).toBe(false);
    expect(scenario).toBe(clean);
  });

  it('recovers data from phantom dot-notation fields (the persistence bug)', () => {
    // What the buggy setDoc(merge) writes: nested map holds creation defaults,
    // while the user's real edits sit in literal "decisionTool.settings" fields.
    const raw = {
      id: 'x',
      isActive: true,
      enabledTools: ['decision'],
      createdAt: 't0',
      lastModified: 't1',
      planDetails: { name: 'Orig', description: '' },
      decisionTool: { settings: { equityMin: 250000 }, history: [], taxYears: {} },
      stressTool: { settings: { equityMin: 0 } },
      // phantom fields = the user's actual saved edits
      'decisionTool.settings': { equityMin: 600000 },
      'decisionTool.history': [{ month: '2026-07' }],
      'decisionTool.taxYears': { '26/27': { pa: 12570 } },
      'stressTool.settings': { equityMin: 999 },
      'planDetails.name': 'Renamed Plan'
    };
    const { scenario, migrated } = normalizeScenario(raw);
    expect(migrated).toBe(true);
    // phantom (latest) wins over nested (creation defaults)
    expect(scenario.decisionTool.settings.equityMin).toBe(600000);
    expect(scenario.decisionTool.history).toEqual([{ month: '2026-07' }]);
    expect(scenario.decisionTool.taxYears['26/27'].pa).toBe(12570);
    expect(scenario.stressTool.settings.equityMin).toBe(999);
    expect(scenario.planDetails.name).toBe('Renamed Plan');
    // metadata preserved, id kept, no dotted keys remain
    expect(scenario.id).toBe('x');
    expect(scenario.createdAt).toBe('t0');
    expect(Object.keys(scenario).some((k) => k.includes('.'))).toBe(false);
  });

  it('migrates a legacy-schema scenario into the nested shape', () => {
    const legacy = {
      id: 'old',
      isActive: false,
      enabledTools: ['stress', 'decision'],
      createdAt: 't0',
      lastModified: 't1',
      name: 'Legacy Plan',
      description: 'from before restructure',
      decisionSettings: { equityMin: 300000 },
      stressSettings: { equityMin: 400000 },
      taxYears: { '25/26': { pa: 12570 } }
    };
    const { scenario, migrated } = normalizeScenario(legacy);
    expect(migrated).toBe(true);
    expect(scenario.planDetails.name).toBe('Legacy Plan');
    expect(scenario.planDetails.description).toBe('from before restructure');
    expect(scenario.decisionTool.settings.equityMin).toBe(300000);
    expect(scenario.decisionTool.history).toEqual([]);
    expect(scenario.decisionTool.taxYears['25/26'].pa).toBe(12570);
    expect(scenario.stressTool.settings.equityMin).toBe(400000);
    // legacy top-level keys are gone from the cleaned object
    expect('decisionSettings' in scenario).toBe(false);
    expect('name' in scenario).toBe(false);
  });

  it('handles null/invalid input gracefully', () => {
    expect(normalizeScenario(null)).toEqual({ scenario: null, migrated: false });
  });
});
