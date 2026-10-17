/**
 * Plain words the planner shows, kept right (v6 usability audit, 17 Oct 2026):
 *  - the number of strategies is counted from the registry ("six strategies" said nine — problem 10);
 *  - the abolished lifetime allowance is not mentioned (problem 10);
 *  - a State Pension nobody entered is said to be assumed wherever it is used, order sheet included (§2.5);
 *  - "Try a strategy" runs the plan's full length, not 35 years (problem 1);
 *  - "Refresh the document" is "Write a new version from today's settings", asked first (problem 5).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { strategyCount, strategyCountWord, paintStrategyCounts, assumedStatePensionWords, assumedStatePensionAlertHtml, assumedStatePensionTag, assumedStatePensionSettingsNote, NEW_DOCUMENT_VERSION_LABEL, newDocumentVersionQuestion, lockFromStressQuestion } from '../src/ui/plannerWords.js';
import { listStrategies } from '../src/strategies/registry.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';

const html = readFileSync('index.html', 'utf8');

describe('how many strategies', () => {
  it('is counted from the registry, and said as a word', () => {
    expect(strategyCount()).toBe(listStrategies().length);
    expect(strategyCount()).toBe(9);
    expect(strategyCountWord()).toBe('nine');
    expect(strategyCountWord(6)).toBe('six');
    expect(strategyCountWord(13)).toBe('13');
    const d = new JSDOM('<span data-strategy-count>six</span> <b data-strategy-count></b>').window.document;
    paintStrategyCounts(d);
    expect([...d.querySelectorAll('[data-strategy-count]')].map((e) => e.textContent)).toEqual(['nine', 'nine']);
  });
  it('index.html never types the number: "six strategies" is gone, the markup carries the span, the strings call the word', () => {
    expect(html).not.toMatch(/six strategies/i);
    expect(html).toContain('<span data-strategy-count>nine</span> strategies');
    expect(html).not.toMatch(/all eight strategies/i);   // the "Re-running all eight strategies" toggle went with the level-footing run (6.24.0)
    expect(html).toContain("All ' + strategyCountWord() + ' strategies, compared on your plan");
    expect(html).toContain('paintStrategyCounts(document)');
  });
});

describe('the lifetime allowance (abolished April 2024) is not mentioned', () => {
  it('the tax-free cash words name the lump sum allowance instead', () => {
    expect(html).not.toMatch(/lifetime allowance/i);
    expect(html).toContain('until the £268,275 tax-free lump sum allowance is used up');
  });
});

describe('the State Pension the plan assumes when none was entered', () => {
  const settings = { currentAge: 57, currentAgeAsOf: '2026-10-01', retired: true, firstTaxYear: 2026, shapeAgeNow: 57, duration: 30, baseSalary: 40000, statePension: 12000, statePensionYear: 12,   /* the stored defaults every plan carries */ equityMin: 600000, bondMin: 300000, cashTarget: 100000, strategyId: 'full-il-gilt', strategyParams: { sippTotal: 1000000, isaTotal: 0 } };
  const none = planFromSettings(settings, createSimulationConfigFromSettings({}, settings), { now: new Date(2026, 9, 17) });
  const entered = planFromSettings({ ...settings, spStartDate: '6 May 2036', spWeeklyAmount: 230.25 }, createSimulationConfigFromSettings({}, { ...settings, spStartDate: '6 May 2036', spWeeklyAmount: 230.25 }), { now: new Date(2026, 9, 17) });
  it('the plan carries the flag; the words say the figure and the age', () => {
    expect(none.spAssumed).toBe(true);
    expect(none.spAnnual).toBe(12000);
    expect(assumedStatePensionWords(none)).toBe('assumed £12,000 a year from 67 — no State Pension was entered in Settings');
    expect(assumedStatePensionTag(none)).toBe(' (assumed)');
    expect(assumedStatePensionAlertHtml(none)).toContain('State Pension assumed £12,000 a year from 67');
    expect(assumedStatePensionAlertHtml(none)).toContain('The rungs below are sized on it');
  });
  it('a State Pension that was entered: nothing is said', () => {
    expect(entered.spAssumed).toBe(false);
    expect(assumedStatePensionWords(entered)).toBe('');
    expect(assumedStatePensionAlertHtml(entered)).toBe('');
    expect(assumedStatePensionTag(entered)).toBe('');
    expect(assumedStatePensionWords(null)).toBe('');
  });
  it('the Settings page says it under the boxes when nothing is entered', () => {
    expect(assumedStatePensionSettingsNote(false)).toContain('every run assumes £12,000 a year from age 67');
    expect(assumedStatePensionSettingsNote(true)).toBe('');
    expect(html).toContain('id="ssSpAssumedNote"');
    expect(html).toContain('assumedStatePensionSettingsNote(');
  });
  it('the order sheet is told the plan, on both pages that draw it, and marks the "+ SP" cells', () => {
    expect(html).toContain("let h = assumedStatePensionAlertHtml(opts.p) + '<div class=\"alert alert-warning\"");
    expect(html).toContain("h += giltOrderSheetHtml(r.plan, { p });");
    expect(html).toContain("+ lockedNote + giltOrderSheetHtml(plan, { p })");
    expect(html).toContain("gbp(Math.round(y.gross - y.need)) + assumedStatePensionTag(opts.p)");
  });
});

describe('"Try a strategy" runs the plan\'s full length', () => {
  it('no 35-year cap: the plan\'s own duration, up to the engines\' 45 years', () => {
    expect(html).toContain("c.duration = Math.max(5, Math.min(45, +document.getElementById('tryYears').value || s.duration || 35));");
    expect(html).not.toContain("Math.min(35, +document.getElementById('tryYears').value");
    expect(html).toContain('<input type="number" id="tryYears" min="5" max="45">');
  });
});

describe('a new version of the plan document', () => {
  it('the button says what it does, and the page asks first — in the app, never a browser dialog', () => {
    expect(NEW_DOCUMENT_VERSION_LABEL).toBe('Write a new version from today\'s settings');
    expect(html).toContain('>Write a new version from today\'s settings</button>');
    expect(html).not.toContain('>Refresh the document<');
    const f = html.slice(html.indexOf('window.createPlanDocumentNow = async function'), html.indexOf('window.createPlanDocumentNow = async function') + 1800);
    const ask = f.indexOf('newDocumentVersionQuestion(');
    expect(ask).toBeGreaterThan(0);
    expect(f.indexOf('appConfirm(')).toBeGreaterThan(ask);
    expect(f.indexOf('appConfirm(')).toBeLessThan(f.indexOf('await archivePlanDocument()'));
    expect(f).not.toContain('window.confirm(');
    expect(f).not.toContain(' confirm(');
  });
  it('the question says the current document becomes a past version', () => {
    const q = newDocumentVersionQuestion({ strategyName: 'Full index-linked gilt ladder', lockedAt: '9 September 2026' });
    expect(q.html).toContain('Write a new version of the plan document?');
    expect(q.html).toContain('The current document (9 September 2026, Full index-linked gilt ladder) becomes a past version');
    expect(q.html).toContain('Previous versions');
    expect(q.okLabel).toBe('Write the new version');
    expect(q.cancelLabel).toBe('Keep the current document');
  });
});

describe('the lock question from the Stress settings', () => {
  it('says what stays changeable (how often you draw among them)', () => {
    const q = lockFromStressQuestion();
    expect(q.html).toContain('Lock this plan?');
    expect(q.html).toContain('How often you draw, your records, what you hold and the Budget stay changeable');
    expect(q.okLabel).toBe('Lock the plan');
  });
});
