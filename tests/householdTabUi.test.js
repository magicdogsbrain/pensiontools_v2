/**
 * The full view's Household tab reads the partner either way (7.12.0, src/ui/householdTabUi.js). Kim and Sam (fictional),
 * the link written on Sam's plan only: with Kim's plan open, the picker shows Sam's plan, the line under it says Sam's plan
 * points at this one, and Sam is named with their plan's phase. A verdict left on the tab for another plan is put away when
 * the tab is read again, so a plan switch never shows the last plan's result.
 */
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { installHouseholdTab } from '../src/ui/householdTabUi.js';
import { kimAndSam, KIM_ID, SAM_ID } from './fixtures/kimAndSam.js';

const NOW = new Date(2026, 10, 16, 12);
const OPENING = '<div class="settings-section" id="hhOpening">How it works</div>';
const MARKUP = '<input id="hhOwnPlan"><select id="hhPartnerSelect"><option value="">— choose a plan —</option></select>'
  + '<p id="hhLinkedBy" hidden></p><p id="hhTheirLine" hidden></p><div id="hhSplit"></div><div id="hhResults">' + OPENING + '</div>';

function tab({ active = KIM_ID, link = 'sam' } = {}) {
  const { kim, sam } = kimAndSam({ link });
  const dom = new JSDOM('<body>' + MARKUP + '</body>');
  const win = { _hhLast: null };
  const state = { active, writes: [] };
  installHouseholdTab(win, dom.window.document, {
    listScenariosAsync: async () => [kim, sam], getActiveScenarioId: async () => state.active,
    setHouseholdPartnerId: async (id) => { state.writes.push(id); }, showToast: () => {}, now: () => NOW
  });
  return { win, doc: dom.window.document, state, kim, sam };
}
const $ = (doc, id) => doc.getElementById(id);

describe('the full view\'s partner picker', () => {
  it('Kim\'s plan open, the link on Sam\'s only: the picker shows Sam\'s plan, which plan holds the link, and Sam with a phase', async () => {
    const { win, doc } = tab();
    await win.loadHouseholdUI();
    expect($(doc, 'hhOwnPlan').value).toBe('Kim');
    expect($(doc, 'hhPartnerSelect').value).toBe(SAM_ID);
    expect($(doc, 'hhLinkedBy').textContent).toBe('‘Sam’ points at this plan.');
    expect($(doc, 'hhLinkedBy').hidden).toBe(false);
    expect($(doc, 'hhTheirLine').textContent.startsWith('With ‘Sam’: ')).toBe(true);
    expect($(doc, 'hhTheirLine').textContent.length).toBeGreaterThan('With ‘Sam’: '.length);
  });

  it('Sam\'s plan open: this plan points at Kim\'s; both linked: each points at the other; none: nothing under the picker', async () => {
    let t = tab({ active: SAM_ID });
    await t.win.loadHouseholdUI();
    expect($(t.doc, 'hhPartnerSelect').value).toBe(KIM_ID);
    expect($(t.doc, 'hhLinkedBy').textContent).toBe('This plan points at ‘Kim’.');
    expect($(t.doc, 'hhTheirLine').textContent).toBe('With ‘Kim’: retired. Plan not locked yet.');
    t = tab({ link: 'both' });
    await t.win.loadHouseholdUI();
    expect($(t.doc, 'hhLinkedBy').textContent).toBe('Each plan points at the other.');
    t = tab({ link: 'none' });
    await t.win.loadHouseholdUI();
    expect($(t.doc, 'hhPartnerSelect').value).toBe('');
    expect($(t.doc, 'hhLinkedBy').hidden).toBe(true);
    expect($(t.doc, 'hhTheirLine').hidden).toBe(true);
  });

  it('a result painted for Sam\'s plan is put away once Kim\'s plan is open; the same pair\'s result stays', async () => {
    const t = tab({ active: SAM_ID });
    await t.win.loadHouseholdUI();
    $(t.doc, 'hhSplit').innerHTML = '<div id="hhSplitSection">split</div>';
    $(t.doc, 'hhResults').innerHTML = '<div id="hhHouseholdVerdict">On course together</div>';
    t.win._hhLast = { own: { id: SAM_ID }, partner: { id: KIM_ID } };
    await t.win.loadHouseholdUI();                                   // the same pair: kept
    expect($(t.doc, 'hhHouseholdVerdict')).not.toBe(null);
    t.state.active = KIM_ID;                                         // the plan switched
    await t.win.loadHouseholdUI();
    expect($(t.doc, 'hhHouseholdVerdict')).toBe(null);
    expect($(t.doc, 'hhSplit').innerHTML).toBe('');
    expect($(t.doc, 'hhOpening')).not.toBe(null);
    expect(t.win._hhLast).toBe(null);
  });

  it('choosing a plan writes this plan\'s own link and reads the tab again', async () => {
    const t = tab({ link: 'none' });
    await t.win.loadHouseholdUI();
    $(t.doc, 'hhPartnerSelect').value = SAM_ID;
    await t.win.savePartnerSelection();
    expect(t.state.writes).toEqual([SAM_ID]);
  });
});
