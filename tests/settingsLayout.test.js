/**
 * 7.12.0, lead decision 11 (the second walk: the full view's first Settings screen opened on "Your 25% tax-free cash …
 * UFPLS … Money Purchase Annual Allowance" before a pot or an income was typed). Settings now opens on what everyone has
 * — age and income (the income strategy block), the pot, the State Pension and other income — and the rest sits under a
 * closed "More detail". Read from index.html's own markup.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { orderStressSettingsSections } from '../src/ui/settingsLayout.js';

let doc;
beforeAll(() => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8').replace(/<script\b[\s\S]*?<\/script>/g, '');
  doc = new DOMParser().parseFromString(html, 'text/html');
  orderStressSettingsSections(doc);
  orderStressSettingsSections(doc);   // safe to call again
});
const title = (sec) => (sec.querySelector(':scope > .section-title') || sec.querySelector('.section-title') || { textContent: '' }).textContent.trim();

describe('Stress tester → Settings, in the order a first visit needs', () => {
  it('opens on the income strategy block (age today and income), then the pot, the State Pension and other income', () => {
    const card = doc.getElementById('stress-stresssettings').querySelector('.card');
    const shown = [...card.children].filter((c) => c.classList.contains('settings-section') && c.style.display !== 'none');
    // (step F2) how the tax-free part is taken is asked in the open, after the State Pension
    expect(shown.map(title).map((t) => t.split(' — ')[0].split(' (')[0])).toEqual(['Income strategy', 'Your allocation', 'State Pension', 'How you\'ll take this pension', 'Other income', 'More detail']);
    const strategy = shown[0];
    expect(strategy.querySelector('#tmAge')).not.toBeNull();            // age today
    expect(strategy.querySelector('#incomeStepsEditor')).not.toBeNull(); // what you want a year
    expect(shown[1].querySelector('#ssPot')).not.toBeNull();             // the pot
  });

  it('bed-and-ISA, a taxable account, the thresholds, cuts and the reserve are under the closed "More detail"; the tax-free choice is in the open (step F2)', () => {
    const more = doc.getElementById('ssMoreDetail');
    expect(more.tagName).toBe('DETAILS');
    expect(more.open).toBe(false);
    expect(more.querySelector('summary').textContent).toBe('More detail');
    for (const sel of ['#ssBedAndIsa', '#ssTaxableStart', '#ssPA', '#ssConsecutiveLimit', '#ssHodlEnabled']) {
      expect(more.querySelector(sel), sel).not.toBeNull();
    }
    for (const sel of ['[data-access="ufpls"]', '#ssAccessMethod', '#ssAccessAssumed']) expect(more.querySelector(sel), sel).toBeNull();
    const card = doc.getElementById('stress-stresssettings').querySelector('.card');
    const outside = [...card.children].filter((c) => c !== more).map((c) => c.textContent).join(' ');
    expect(outside).not.toMatch(/bed-and-ISA/);
  });

  it('the Decision tool\'s own settings stay where they are', () => {
    const ss = doc.getElementById('stress-stresssettings');
    expect(ss.querySelector('[data-on-click="setAccessMethod(\'ds\',\'ufpls\')"]')).toBeNull();
    expect(ss.querySelector('#dsTaxableBlock, #dsPA, #dsBedAndIsa')).toBeNull();
    expect(ss.querySelector('[data-on-click="setAccessMethod(\'ss\',\'ufpls\')"]')).not.toBeNull();
  });

  it('every box keeps its id, once', () => {
    for (const id of ['ssPot', 'ssIsaBalance', 'ssSpStartDate', 'ssOther', 'ssBedAndIsa', 'ssAccessMethod', 'ssHodlValue']) expect(doc.querySelectorAll('#' + id).length, id).toBe(1);
  });
});
