/**
 * Fund and platform charges on today's planner's screens (research/charges-setting.md §5, T13; rules 1–3).
 *
 *  - Stress tester → Settings: ONE box, "Charges (funds and platform), % a year", 0 to 3 in steps of 0.05, with the
 *    owner's help text (what it is taken off, and why not gilts held directly, annuities, final-salary or State
 *    Pensions). A locked plan with no setting shows "0% (this plan was locked before charges were added; unlock to
 *    change)" instead of the box.
 *  - The lines above Monte Carlo, History and Scenarios say what charge the runs take.
 *  - The plan document records the charge at lock and says it; a document locked before charges says it had none.
 *  - The Assumptions page no longer says charges are not modelled.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

import {
  CHARGES_LABEL, CHARGES_HELP, CHARGES_LOCKED_TEXT, chargesFieldState, chargesForSave, formatChargesPct, chargesRunLine,
  holdingsChargesHint, hasStoredCharges, paintChargesField, chargesHintText, chargesUnlockNoteHtml, accumulationChargesNoteHtml
} from '../src/ui/chargesSetting.js';
import { startSummaryHtml } from '../src/ui/startingPotsWords.js';
import { unlockNotesHtml } from '../src/ui/isaGrowthSetting.js';
import { planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { DEFAULT_CHARGES_PCT, CHARGES_LIMITS } from '../src/services/Charges.js';
import { parse } from '../src/ui/inlineHandlers.js';

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const SRC = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const doc = new JSDOM(SRC.replace(/<script[\s\S]*?<\/script>/g, '')).window.document;
const fnBody = (marker, len = 6000) => { const i = SRC.indexOf(marker); expect(i, marker).toBeGreaterThan(-1); return SRC.slice(i, i + len); };

describe('the words', () => {
  it('the label and the help text say what is charged and what is not, and why', () => {
    expect(CHARGES_LABEL).toBe('Charges (funds and platform), % a year');
    for (const w of ['every month', 'while you save and while you draw', 'funds and cash', 'pension, ISA and taxable account']) expect(CHARGES_HELP).toContain(w);
    expect(CHARGES_HELP).toBe('What your funds and your platform take each year, as a share of what you hold — for example a 0.2% '
      + 'tracker on a 0.25% platform is 0.45%. It is taken off every month, while you save and while you draw, from the money '
      + 'held in funds and cash in your pension, ISA and taxable account. It is not taken off State Pensions, final-salary '
      + 'pensions or annuities, which have no such charge, or off gilts you hold directly (platforms usually charge a small '
      + 'fixed fee for those).');
    expect(CHARGES_LOCKED_TEXT).toBe('0% (this plan was locked before charges were added; unlock to change)');
  });
  // Review of 6.19.0 (1 Oct 2026): "the platform fee on those is usually a small fixed amount", after a list ending in
  // State Pensions, read as a fee on a State Pension. Neither it, a final-salary pension nor an annuity has one; the
  // small fixed fee is a platform's, for gilts held on it.
  it('no words about charges say or suggest that a State Pension, a final-salary pension or an annuity has a fee', () => {
    const page = fnBody('function assumptionsPageHtml()', 12000);
    const at = page.indexOf("row('Fund and platform charges'");
    expect(at, 'the Assumptions row').toBeGreaterThan(-1);
    const texts = {
      help: CHARGES_HELP,
      tip: doc.querySelector('#ssChargesGroup .hlp').getAttribute('data-tip'),
      assumptions: page.slice(at, page.indexOf('\n', at)),
      runLine: plain(chargesRunLine({ chargesPct: 0.5 })),
      hint: chargesHintText(0.0018)
    };
    for (const [k, t] of Object.entries(texts)) {
      expect(t, k).not.toMatch(/fee on (those|them)|any fee|their (platform )?fee/i);
      // every "fee" in these words is a platform's, and is about gilts or the person's own platform — never a pension's
      for (const m of t.matchAll(/[^.;:()]*\bfees?\b[^.;:()]*/gi)) expect(m[0], k + ': ' + m[0]).toMatch(/platform/i);
    }
    expect(texts.assumptions).toContain('Not taken off State Pensions, final-salary pensions or annuities, which have no such charge, or off gilts held directly (a ladder\\\'s rungs, the gilts in a taxable account): platforms usually charge a small fixed fee for those.');
  });
  it('formatChargesPct shows the percent as typed, without trailing noise', () => {
    expect(formatChargesPct(0.5)).toBe('0.5');
    expect(formatChargesPct(0.45)).toBe('0.45');
    expect(formatChargesPct(0)).toBe('0');
    expect(formatChargesPct(3)).toBe('3');
    expect(formatChargesPct(0.1 + 0.2)).toBe('0.3');
  });
});

describe('the Settings box', () => {
  it('a locked plan with no setting: the text, not the box — it runs at 0%', () => {
    expect(chargesFieldState({}, { locked: true })).toEqual({ mode: 'locked-before-charges', value: 0, text: CHARGES_LOCKED_TEXT });
    expect(chargesFieldState({ chargesPct: 'x' }, { locked: true }).mode).toBe('locked-before-charges');
  });
  it('a locked plan WITH a setting shows it in the (frozen) box', () => {
    expect(chargesFieldState({ chargesPct: 0.5 }, { locked: true })).toEqual({ mode: 'input', value: 0.5, text: '0.5' });
    expect(chargesFieldState({ chargesPct: 0 }, { locked: true })).toEqual({ mode: 'input', value: 0, text: '0' });
  });
  it('an unlocked plan shows what its runs take: its setting, or 0 when it has none', () => {
    expect(chargesFieldState({ chargesPct: 1.25 })).toEqual({ mode: 'input', value: 1.25, text: '1.25' });
    expect(chargesFieldState({})).toEqual({ mode: 'input', value: 0, text: '0' });
    expect(hasStoredCharges({ chargesPct: 0 })).toBe(true);
    expect(hasStoredCharges({})).toBe(false);
  });
  it('what is saved: clamped to 0–3, on the 0.05 grid; an empty or unreadable box keeps the plan\'s value', () => {
    expect(chargesForSave('0.5', {})).toBe(0.5);
    expect(chargesForSave('0.07', {})).toBe(0.05);
    expect(chargesForSave('0.08', {})).toBe(0.1);
    expect(chargesForSave('9', {})).toBe(3);
    expect(chargesForSave('-1', {})).toBe(0);
    expect(chargesForSave('', { chargesPct: 1.25 })).toBe(1.25);
    expect(chargesForSave('abc', { chargesPct: 0.4 })).toBe(0.4);
    expect(chargesForSave('', {})).toBe(0);
    expect(chargesForSave(0.45, {})).toBe(0.45);
  });
  it('the holdings hint: their own fund charges, so the person adds the platform\'s fee', () => {
    expect(holdingsChargesHint(0.0018)).toBe('Your holdings\' own fund charges come to about 0.18% a year; add your platform\'s fee.');
    expect(holdingsChargesHint(0)).toBe('');
    expect(holdingsChargesHint(null)).toBe('');
  });
});

describe('index.html: the box in Stress tester → Settings', () => {
  const box = doc.querySelector('#stress-stresssettings #ssChargesPct');
  it('is a number box, 0 to 3 in steps of 0.05, in the Settings pane, outside the risk/funds switch', () => {
    expect(box).not.toBeNull();
    expect(box.getAttribute('type')).toBe('number');
    expect(+box.getAttribute('min')).toBe(CHARGES_LIMITS.min);
    expect(+box.getAttribute('max')).toBe(CHARGES_LIMITS.max);
    expect(+box.getAttribute('step')).toBe(CHARGES_LIMITS.step);
    expect(box.getAttribute('value')).toBe(String(DEFAULT_CHARGES_PCT));
    expect(box.closest('#ssRiskMode')).toBeNull();     // shown in both allocation modes
    expect(box.closest('#ssFundsMode')).toBeNull();
  });
  it('carries the label and the help text, and has a place for the locked-plan text', () => {
    const group = doc.querySelector('#ssChargesGroup');
    expect(group).not.toBeNull();
    expect(plain(group.querySelector('label').innerHTML)).toContain(CHARGES_LABEL);
    expect(group.querySelector('.hlp').getAttribute('data-tip')).toBe(CHARGES_HELP);
    const locked = doc.querySelector('#ssChargesLocked');
    expect(locked).not.toBeNull();
    expect(locked.getAttribute('style')).toContain('display:none');
    expect(doc.querySelector('#ssChargesHint')).not.toBeNull();
  });
  it('is filled on load from the plan (with the lock), and saved clamped — never written while locked', () => {
    expect(fnBody('async function loadStressSettings()')).toContain('refreshStressLock()');   // every load path refreshes the lock, which paints the box
    const save = fnBody('window.saveStressSettingsUI = async function()', 9000);
    expect(save).toMatch(/chargesPct: chargesForSave\(/);
    expect(save.indexOf('chargesPct: chargesForSave(')).toBeGreaterThan(save.indexOf('if (await planIsLocked())'));
    const r = fnBody('async function renderChargesField(', 2500);
    expect(r).toContain('chargesFieldState(');
    expect(r).toContain('planIsLocked()');
    expect(fnBody('window.refreshStressLock = async function', 2500)).toContain('renderChargesField(');
  });
  it('the Accumulation planner takes the plan\'s charge, and the funds\' own charge is not taken twice', () => {
    const acc = fnBody('window.recalcAccumulation = async function', 6500);
    expect(acc).toMatch(/projectAccumulation\(\{[^}]*chargesPct/);
    expect(acc).toContain('mixOcf');
    // 6.22.0: the table (and its charges note) moved into src/ui/accumulationProjection.js, which is handed the charge
    expect(acc).toContain('accumulationTableHtml({ rows, mixOn: window._acMixOn, mixRealReturn, chargesPct: acCharges');
    expect(readFileSync(resolve(process.cwd(), 'src/ui/accumulationProjection.js'), 'utf8')).toContain('accumulationChargesNoteHtml(chargesPct, mixOn)');
    expect(plain(accumulationChargesNoteHtml(0.5, true))).toBe('After fund and platform charges of 0.5% a year (your plan\'s setting in Stress tester → Settings); the "your mix" line takes this in place of your funds\' own charges.');
    expect(plain(accumulationChargesNoteHtml(0))).toBe('No fund or platform charges taken off (see Stress tester → Settings).');
  });
  it('unlocking a plan locked before charges writes the default and says so first (D2)', () => {
    const u = fnBody('window.unlockDecisionSettings = async function', 7000);
    // 6.22.0: one patch for everything unlocking writes (the charge and the ISA choice), its bullets from one function
    expect(u).toContain('unlockPatchesOf(');
    expect(u).toContain('li.push(...unlockNotesHtml(unlockPatch))');
    expect(u.indexOf('saveStressSettings(unlockPatch)')).toBeGreaterThan(u.indexOf('await unlockPlan()'));
    expect(u.indexOf('unlockNotesHtml(')).toBeLessThan(u.indexOf('appConfirm('));   // said before the person agrees
    expect(unlockNotesHtml({ chargesPct: 0.5 })).toEqual([chargesUnlockNoteHtml(0.5)]);
    expect(unlockNotesHtml(null)).toEqual([]);
    expect(plain(chargesUnlockNoteHtml(0.5))).toBe('Fund and platform charges: this plan was locked before charges were added, so its figures have been worked out without them. Once it is unlocked, 0.5% a year is taken off its projections — its chance of lasting and the amount left go down. Change it in Stress tester → Settings.');
  });
  it('Reset to defaults is refused on a locked plan', () => {
    const r = fnBody('window.resetStressSettingsUI = async function', 1200);
    expect(r).toContain('planIsLocked()');
  });
  it('the Assumptions page no longer says charges are not modelled, and states the setting', () => {
    const a = fnBody('function assumptionsPageHtml()', 9000);
    expect(a).not.toMatch(/Not modelled', 'Fund charges/);
    expect(a).toMatch(/row\('Fund and platform charges'/);
  });
  it('the start lines are told whether the plan is locked', () => {
    const s = fnBody('function renderStressStartSummary(s)', 2000);
    expect(s).toContain('locked');
    expect(s).toContain('planIsLocked()');
  });
  it('every handler the new markup names parses', () => {
    const group = doc.querySelector('#ssChargesGroup');
    for (const el of group.querySelectorAll('[data-on-input],[data-on-change],[data-on-click]')) {
      for (const a of ['data-on-input', 'data-on-change', 'data-on-click']) { const v = el.getAttribute(a); if (v) expect(() => parse(v)).not.toThrow(); }
    }
  });
});

describe('paintChargesField: the box, or the words in its place', () => {
  const page = () => new JSDOM('<input id="ssChargesPct" value="0.5"><p id="ssChargesLocked" style="display:none"></p><p id="ssChargesHint"></p>').window.document;
  it('a locked plan from before charges: the box hidden, the words shown', () => {
    const d = page();
    paintChargesField(d, chargesFieldState({}, { locked: true }), 0);
    expect(d.getElementById('ssChargesPct').style.display).toBe('none');
    expect(d.getElementById('ssChargesLocked').style.display).toBe('');
    expect(d.getElementById('ssChargesLocked').textContent).toBe(CHARGES_LOCKED_TEXT);
    expect(d.getElementById('ssChargesHint').textContent).toBe(chargesHintText(0));
  });
  it('otherwise the box with the plan\'s value, the words hidden, and the holdings\' own charges when known', () => {
    const d = page();
    paintChargesField(d, chargesFieldState({}, { locked: true }), 0);
    paintChargesField(d, chargesFieldState({ chargesPct: 1.25 }, { locked: false }), 0.0018);
    expect(d.getElementById('ssChargesPct').style.display).toBe('');
    expect(d.getElementById('ssChargesPct').value).toBe('1.25');
    expect(d.getElementById('ssChargesLocked').style.display).toBe('none');
    expect(d.getElementById('ssChargesLocked').textContent).toBe('');
    expect(d.getElementById('ssChargesHint').textContent).toContain('about 0.18% a year; add your platform\'s fee');
  });
  it('a page without the box is left alone', () => {
    expect(() => paintChargesField(new JSDOM('<p></p>').window.document, chargesFieldState({}), 0)).not.toThrow();
  });
});

describe('the lines above Monte Carlo, History and Scenarios', () => {
  const S = { equityMin: 1, bondMin: 2, cashTarget: 3 };
  it('a plan with a charge says what the runs take off, and from what', () => {
    const t = plain(startSummaryHtml({ ...S, chargesPct: 0.5 }));
    expect(t).toContain('Fund and platform charges of 0.5% a year come off every month');
    expect(t).toContain('not off gilts held directly, annuities, final-salary or State Pensions');
    expect(plain(chargesRunLine({ chargesPct: 0.5 }))).toBe('Fund and platform charges of 0.5% a year come off every month (change it in Settings); not off gilts held directly, annuities, final-salary or State Pensions.');
  });
  it('a plan set to 0%', () => {
    expect(plain(startSummaryHtml({ ...S, chargesPct: 0 }))).toContain('No fund or platform charges are taken off (0% in Settings).');
  });
  it('a locked plan from before charges', () => {
    expect(plain(startSummaryHtml(S, { locked: true }))).toContain('No fund or platform charges are taken off: this plan was locked before charges were added.');
  });
  it('a plan with no setting whose lock is not known: the line is as it was', () => {
    expect(plain(startSummaryHtml(S))).toBe('Starting balances come from your Settings (Fund Minimums): Equity £1 · Bond £2 · Cash £3. Edit them in the Settings tab.');
    expect(chargesRunLine({})).toBe('');
    expect(chargesRunLine({}, { locked: false })).toBe('');
  });
});

describe('the plan document', () => {
  const settings = { currentAge: 60, retired: true, firstTaxYear: 2027, shapeAgeNow: 61, duration: 30, baseSalary: 30000, equityMin: 300000, bondMin: 150000, cashTarget: 50000, pa: 12570, brl: 50270, hrl: 125140, spStartDate: '1 May 2033', spWeeklyAmount: 230 };
  const NOW = new Date(2026, 9, 1);
  const build = (s) => buildPlanDocument({ planName: 'P', settings: s, p: planFromSettings(s, createSimulationConfigFromSettings({}, s), {}), r: null, lockedAt: '2026-10-01T10:00:00.000Z', now: NOW });
  it('records the charge at lock, as a percent a year', () => {
    expect(build({ ...settings, chargesPct: 0.5 }).assumptions.chargesPct).toBe(0.5);
    expect(build({ ...settings, chargesPct: 1.25 }).assumptions.chargesPct).toBe(1.25);
    expect(build(settings).assumptions.chargesPct).toBe(0);   // a plan locked from Stress always has one; none reads 0
  });
  it('says it among the assumptions', () => {
    const h = plain(planDocumentHtml(build({ ...settings, chargesPct: 0.5 })));
    expect(h).toContain('Fund and platform charges');
    expect(h).toContain('0.5% a year, taken off every month from the money held in funds and cash; not off gilts held directly, annuities, final-salary or State Pensions');
    expect(plain(planDocumentHtml(build({ ...settings, chargesPct: 0 })))).toContain('none (0%)');
  });
  it('a document written before charges (no key) says its figures were worked out without them — it is never rewritten', () => {
    const old = build(settings); delete old.assumptions.chargesPct;
    expect(plain(planDocumentHtml(old))).toContain('not taken off — this plan was locked before charges were added');
  });
});
