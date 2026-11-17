/**
 * The full view follows a change saved on one of its tabs everywhere it shows the plan (7.12.0, lead decision 9; the round-3
 * walk of Jo, 33: "Retiring at" 58 and "You pay" £500 saved on the Accumulation tab, yet the plan menu still said
 * ‘Stop at 65 · £2,000 a month’ and Stress tester → "Will it last?" still said "Starting balances at retirement (age 65)
 * … £253 a month going in"). Source pins on index.html's one inline script:
 *  - Stress tester's load draws the starting-balances lines from the settings it has just read, not the page's first ones;
 *  - a save as a box changes, on either form, draws the plan menu again (the shown name follows the figures).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]))[0][2];
const body = (start) => { const at = script.indexOf(start); expect(at, start).toBeGreaterThan(-1); return script.slice(at, script.indexOf('\n    }\n', at)); };
const line = (start) => { const at = script.indexOf(start); expect(at, start).toBeGreaterThan(-1); return script.slice(at, script.indexOf('\n', script.indexOf('\n', at) + 1)); };

describe('the full view follows a saved change', () => {
  it('Stress tester\'s load draws the starting balances from the settings it read', () => {
    expect(body('async function loadStressSettings() {')).toMatch(/renderStressStartSummary\(s\)/);
  });
  it('a save as Settings changes draws the plan menu again', () => {
    expect(line('window._ssAutosave = installStressSettingsAutosave(')).toMatch(/afterSave: \(\) => \{[^}]*renderScenarioSelector\(\)/);
  });
  it('a save as the Accumulation tab changes draws the plan menu again', () => {
    expect(line('window._acAutosave = installAccumulationAutosave(')).toMatch(/afterSave: \(\) => \{[^}]*renderScenarioSelector\(\)/);
  });
});
