/**
 * The full view's Household tab: who the partner is, read through the one link reader (7.12.0).
 *
 * Until 7.12.0 the tab's picker read only the link written on its own plan, so a plan the partner had linked showed
 * "— choose a plan —". It now reads the link either way (services/HouseholdLink.js partnerOf), says which plan holds it
 * in the simple view's own words (#hhLinkedBy), and names the partner with their plan's phase (#hhTheirLine, read.js
 * theirLineOf, the one reader both views use). A result left on the tab from another pair (window._hhLast) is put away
 * whenever the tab is read again, so a plan switch never leaves the last plan's verdict under this plan's picker.
 *
 *   installHouseholdTab(win, doc, deps)   win.loadHouseholdUI and win.savePartnerSelection. `deps`: listScenariosAsync,
 *                                         getActiveScenarioId, setHouseholdPartnerId, showToast; optional now().
 *   householdTabLines(entries, plan, now) { partnerId, linkedBy, theirLine } — the words under the picker, pure
 *
 * Writes keep the repository's rule: the link is written on this plan only (ScenarioRepository.setHouseholdPartnerId).
 */
import { partnerOf, linkedByOf } from '../services/HouseholdLink.js';
import { partnerCandidates, isClosedPlan } from '../services/PlanClosed.js';
import { theirLineOf } from '../answers/plan/read.js';
import { entriesOf } from './homeBannerUi.js';
import { HOUSEHOLD } from '../v7/copy/household.js';
import { PLAN } from '../v7/copy/plan.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (text, slots) => String(text || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && plan.id != null ? String(plan.id) : '');

/** The words under the picker: which plan holds the link, and the partner with their plan's phase. Pure. */
export function householdTabLines(entries, plan, now) {
  const pe = plan ? partnerOf(entries, plan) : null;
  if (!pe) return { partnerId: null, linkedBy: '', theirLine: '' };
  const partner = pe.plan || pe;
  const name = nameOf(partner);
  const by = linkedByOf(plan, partner);
  const P = HOUSEHOLD.partner;
  const linkedBy = by === 'both' ? P.linkedBoth : by === 'mine' ? fill(P.linkedMine, { name }) : by === 'theirs' ? fill(P.linkedTheirs, { name }) : '';
  let line = null; try { line = theirLineOf(partner, now); } catch (e) { line = null; }
  const theirLine = fill(P.with, { name, line: line ? fill(PLAN.theirLines[line.id] || '', line.slots) : '' }).trim();
  return { partnerId: String(partner.id), linkedBy, theirLine };
}

export function installHouseholdTab(win, doc, deps) {
  const results = doc.getElementById('hhResults');
  const opening = results ? results.innerHTML : '';   // the tab's opening words, put back when a result is put away
  const nowOf = () => (deps.now ? deps.now() : new Date());
  const put = (id, text) => { const el = doc.getElementById(id); if (el) { el.textContent = text; el.hidden = !text; } };

  /** A result from another pair is put away: the split and the verdict go, the opening words come back. */
  function forgetOtherPair(activeId, partnerId) {
    const L = win._hhLast;
    if (!L) return;
    const same = L.own && String(L.own.id) === String(activeId) && L.partner && partnerId && String(L.partner.id) === String(partnerId);
    if (same) return;
    win._hhLast = null;
    const top = doc.getElementById('hhSplit'), out = doc.getElementById('hhResults');
    if (top) top.innerHTML = '';
    if (out) out.innerHTML = opening;
  }

  win.loadHouseholdUI = async function () {
    try {
      const [scenarios, activeId] = await Promise.all([deps.listScenariosAsync(), deps.getActiveScenarioId()]);
      const list = Array.isArray(scenarios) ? scenarios : [];
      const now = nowOf();
      const entries = entriesOf(list, now);
      const ownEntry = entries.find((e) => String(e.plan.id) === String(activeId));
      const own = ownEntry ? ownEntry.plan : { id: activeId };
      const ownBox = doc.getElementById('hhOwnPlan');
      if (ownBox) ownBox.value = (own.planDetails && own.planDetails.name) || 'Current plan';
      const lines = ownEntry ? householdTabLines(entries, own, now) : { partnerId: null, linkedBy: '', theirLine: '' };
      const sel = doc.getElementById('hhPartnerSelect');
      if (sel) {
        sel.disabled = isClosedPlan(own);   // read, not changed, on a closed plan (6.56.0)
        // never itself, a closed plan, or its own previous or next plan (PlanClosed.partnerCandidates)
        sel.innerHTML = '<option value="">' + esc(HOUSEHOLD.partner.chooseNone) + '</option>' + partnerCandidates(list, own)
          .map((sc) => '<option value="' + esc(sc.id) + '"' + (String(sc.id) === lines.partnerId ? ' selected' : '') + '>' + esc(nameOf(sc)) + '</option>').join('');
        sel.value = lines.partnerId || '';
      }
      put('hhLinkedBy', lines.linkedBy);
      put('hhTheirLine', lines.theirLine);
      forgetOtherPair(activeId, lines.partnerId);
    } catch (e) { console.error('Household load error:', e); }
  };

  win.savePartnerSelection = async function () {
    const sel = doc.getElementById('hhPartnerSelect');
    try {
      await deps.setHouseholdPartnerId((sel && sel.value) || null);   // on this plan only: its own link wins
    } catch (e) { deps.showToast('Could not save partner selection: ' + e.message, 'error'); return; }
    await win.loadHouseholdUI();
  };
}
