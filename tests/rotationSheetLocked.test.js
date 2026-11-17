/**
 * A locked gilt-ladder-plus-rotation plan's own strategy page prints no fresh priced order sheet (7.12.0): with no dial
 * turned, the page's result card points to the plan document ("Your ladder as locked, gilt by gilt, is in your plan
 * document"), as the full ladder's page does; a dial turned is a what-if, priced today, as before.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const page = html.slice(html.indexOf('async function specStrategyPageHtml(id)'), html.indexOf('async function specStrategyPageHtml(id)') + 9000);

describe('the rotation page on a locked plan', () => {
  it('reads whether this is the locked plan\'s own way with no dial turned, from its plan document', () => {
    expect(page).toMatch(/const docOwn = id === 'gilt-rotation' && settings\.strategyId === id && !Object\.values\(d \|\| \{\}\)\.some\(\(v\) => v != null\) \? await lockedPlanLadder\(settings\)/);
  });
  it('then its result card points to the plan document instead of printing a priced sheet', () => {
    expect(page).toMatch(/strategyResultCard\(r, p, \{ title: '5 · The honest numbers', docSheet: !!docOwn \}\)/);
    expect(html).toMatch(/giltOrderSheetHtml\(r\.plan, \{ p, locked: !!opts\.docSheet \}\)/);
  });
});
