/**
 * The full view's plan button (the second walk, walker 9's medium finding, unchanged from the first walk). Most of the
 * button is the chip ("🔒 locked · Saving · 5 years to go"), and a press on the chip opened "Plans — and why they lock",
 * six paragraphs, every time: the list of plans opened only from the name's left edge or the ▼. A press anywhere on the
 * button now opens the list; what "draft" and "locked" mean is one button in the list, for whoever wants it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8');

describe('the plan button opens the list of plans, wherever it is pressed', () => {
  it('the chip has no press of its own that stops the button\'s', () => {
    const fn = html.slice(html.indexOf('async function updatePlanLockChip()'), html.indexOf('window.explainPlanLock = function'));
    expect(fn).not.toMatch(/stopPropagation/);
    expect(fn).not.toMatch(/explainPlanLock\(/);
    expect(fn).not.toMatch(/Click for details/);
  });
  it('the list has one button saying what "draft" and "locked" mean', () => {
    const list = html.slice(html.indexOf('<div class="scenario-dropdown" id="scenarioDropdown">'), html.indexOf('<button type="button" id="mobileMenuBtn"'));
    expect(list).toMatch(/id="planLockExplainBtn"[^>]*>What “draft” and “locked” mean</);
    expect(list).toMatch(/explainPlanLock\(/);
  });
});
