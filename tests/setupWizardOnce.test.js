/**
 * The setup wizard makes ONE plan per finish (src/ui/components/SetupWizard.js `once`). Signed in, making a plan takes
 * several round trips, and on a slow or dropping connection the wizard stayed on screen with its doors live: every door
 * pressed again in that wait made one more plan with the same name. Here the plan's making is held open (a promise that has
 * not settled), the doors are pressed again and again, and only one plan is asked for; a plan not made opens the doors again
 * with words that say so. Fictional: "Alex", 41, stopping at 60.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { initSetupWizard, WIZARD_WORDS } from '../src/ui/components/SetupWizard.js';

const held = () => { let resolve, reject; const p = new Promise((a, b) => { resolve = a; reject = b; }); return { p, resolve, reject }; };
const flush = () => new Promise((r) => setTimeout(r, 0));

let box;
beforeEach(() => {
  document.body.innerHTML = '<div id="setupWizard"></div>';
  box = document.getElementById('setupWizard');
  window.showToast = vi.fn();
});

/** Step 1 filled in and Next pressed: the doors of step 2 are on screen. */
function toDoors(onComplete, onCancel = null) {
  initSetupWizard(box, onComplete, onCancel);
  box.querySelector('#wizScenarioName').value = 'Alex';
  box.querySelector('#wizCurrentAge').value = '41';
  box.querySelector('#wizRetireAge').value = '60';
  box.querySelector('[data-action="to-router"]').click();
  expect(box.querySelector('[data-action="start-accumulation"]')).not.toBe(null);
}
const door = (a) => box.querySelector(`[data-action="${a}"]`);
const status = () => box.querySelector('[data-wizard-status]');

describe('the setup wizard makes one plan per finish', () => {
  it('pressed again and again while the plan is being made: one plan asked for, every door closed, the wait said', async () => {
    const making = held();
    const onComplete = vi.fn(() => making.p);
    toDoors(onComplete);
    const saver = door('start-accumulation');
    saver.click();
    saver.click();
    saver.click();
    // a press that reaches the code another way (a keyboard's Enter is a click on the focused door; a door the page did not disable)
    saver.disabled = false;
    saver.click();
    door('start-stress').disabled = false;
    door('start-stress').click();
    await flush();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0].scenarioName).toBe('Alex');
    expect(onComplete.mock.calls[0][0].startAt).toBe('accumulation');
    for (const b of box.querySelectorAll('[data-action]')) {
      if (b === saver || b === door('start-stress')) continue;
      expect(b.disabled, b.dataset.action).toBe(true);
    }
    expect(status().textContent).toBe(WIZARD_WORDS.making);
    expect(status().getAttribute('role')).toBe('status');
    making.resolve();
    await flush();
    saver.click();
    await flush();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('a plan not made: the doors open again with words that say so, and one more press asks once more', async () => {
    const first = held();
    const second = held();
    const onComplete = vi.fn().mockReturnValueOnce(first.p).mockReturnValueOnce(second.p);
    toDoors(onComplete);
    door('start-budget').click();
    door('start-budget').click();
    expect(onComplete).toHaveBeenCalledTimes(1);
    first.reject(new Error('offline'));
    await flush();
    for (const b of box.querySelectorAll('[data-action]')) expect(b.disabled, b.dataset.action).toBe(false);
    expect(status().textContent).toBe(WIZARD_WORDS.notMade);
    expect(status().getAttribute('role')).toBe('alert');
    // never a promise that nothing was saved: a failure can come after the plan was made, so the words say to look first
    expect(WIZARD_WORDS.notMade).not.toMatch(/nothing was saved/i);
    expect(WIZARD_WORDS.notMade).toMatch(/look for it in your plans before you press this again/);
    door('start-accumulation').click();
    door('start-accumulation').click();
    await flush();
    expect(onComplete).toHaveBeenCalledTimes(2);
    expect(status().textContent).toBe(WIZARD_WORDS.making);
  });

  it('a callback that throws at once is a plan not made too', async () => {
    const onComplete = vi.fn(() => { throw new Error('no store'); });
    toDoors(onComplete);
    door('start-stress').click();
    await flush();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(door('start-stress').disabled).toBe(false);
    expect(status().textContent).toBe(WIZARD_WORDS.notMade);
  });

  it('Cancel, which makes an empty first plan when there is none, is once too; a door after it does nothing', async () => {
    const leaving = held();
    const onCancel = vi.fn(() => leaving.p);
    const onComplete = vi.fn();
    initSetupWizard(box, onComplete, onCancel);
    door('skip-all').click();
    door('skip-all').disabled = false;
    door('skip-all').click();
    door('to-router').disabled = false;
    door('to-router').click();
    await flush();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    expect(door('to-router').disabled).toBe(false);   // re-enabled by hand above; the press still did nothing
    expect(box.querySelector('[data-action="start-accumulation"]')).toBe(null);
  });

  it('opening the wizard again opens its doors', async () => {
    const making = held();
    const onComplete = vi.fn(() => making.p);
    toDoors(onComplete);
    door('start-decision').click();
    making.resolve();
    await flush();
    toDoors(onComplete);
    door('start-decision').click();
    await flush();
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('the planner\'s handleWizardComplete lets a plan not made reject (no try that swallows it), so the doors come back', () => {
    const html = readFileSync('index.html', 'utf8');
    const start = html.indexOf('async function handleWizardComplete(');
    const end = html.indexOf('async function cancelPlanCreation(');
    const body = html.slice(start, end);
    expect(start).toBeGreaterThan(0);
    expect(body).toMatch(/await createNewScenario\(/);
    expect(body).not.toMatch(/console\.error\('Error creating scenario from wizard/);
    // the only catch left is the budget's own, after the plan is made
    expect((body.match(/catch \(/g) || []).length).toBe(1);
  });
});
