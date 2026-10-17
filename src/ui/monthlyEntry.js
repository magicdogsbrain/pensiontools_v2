/**
 * Monthly entry — the form's two views and the helpers the Decision tool's entry card uses (6.23).
 *
 * The platform view (decision 10) asks for what a platform shows: pension total, of which cash, of which bond funds
 * or gilts (a plan with a gold-and-trend sleeve keeps that box; a gilt-ladder plan asks only total and cash). Entry
 * by type (shares / bonds / cash / diversifiers, or per fund) stays as an option. Whichever view is used, the four
 * by-type boxes (#entryEquity, #entryBond, #entryCash, #entryDiversifier) end up holding the per-type figures the
 * rest of the form and the engine read — so nothing downstream changes.
 *
 * Inline handlers are plain calls (the no-eval grammar in src/ui/inlineHandlers.js). The shell installs the window
 * functions through installMonthlyEntryHandlers.
 */
import { platformBoxes, splitFromPlatform, prefillFromHistory, prefillNote, enteredBlock } from '../services/MonthlyEntry.js';

export const ENTRY_MODE_KEY = 'pt.entryMode';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const el = (id) => (typeof document === 'undefined' ? null : document.getElementById(id));
const val = (id) => { const e = el(id); return e ? e.value : ''; };
const setVal = (id, v) => { const e = el(id); if (e) e.value = v == null ? '' : String(v); };
let lastOpts = { contract: false, hasDiversifiers: false };

/** The view in use for this browser: the platform view unless the person chose "by type". */
export function currentEntryMode() {
  try { const m = localStorage.getItem(ENTRY_MODE_KEY); if (m === 'type' || m === 'platform') return m; } catch (e) { /* storage blocked */ }
  return 'platform';
}

/** The platform view's boxes, the pre-fill note and the switch to entry by type. */
export function platformEntryHtml(opts = {}) {
  const boxes = platformBoxes(opts);
  let h = '<div class="form-grid">';
  for (const b of boxes) {
    h += '<div class="form-group"><label>' + esc(b.label) + ' <span class="hlp" tabindex="0" data-tip="' + esc(b.hint) + '">?</span></label>'
      + '<div class="input-with-unit"><span class="unit">£</span><input type="number" id="' + b.id + '" min="0" step="1" inputmode="numeric"></div></div>';
  }
  h += '</div>';
  h += '<p class="hint" id="entryPrefillNote" style="margin:6px 0 0;"></p>';
  h += '<p class="hint" style="margin:6px 0 0;">' + (opts.contract ? 'The gilts are the total less the cash — no need to add up the rungs.' : 'Shares are whatever is left after the cash' + (boxes.some((b) => b.key === 'bonds') ? ' and the bonds' : '') + (opts.hasDiversifiers ? ' and the gold and trend' : '') + '.')
    + ' <a href="#" class="itemise-link" data-on-click="setEntryMode(\'type\'); return false;">Enter by type instead</a></p>';
  return h;
}

/**
 * Show one view, hide the other, remember the choice. `opts` ({ contract, hasDiversifiers }) redraws the platform
 * boxes; typed figures survive a redraw.
 */
export function paintEntryMode(mode, opts) {
  if (opts) lastOpts = { ...lastOpts, ...opts };
  const m = mode === 'type' ? 'type' : 'platform';
  try { localStorage.setItem(ENTRY_MODE_KEY, m); } catch (e) { /* storage blocked: the view still paints */ }
  const plat = el('entryPlatform'), byType = el('entryByType');
  if (plat && (opts || !plat.innerHTML)) {
    const keep = {}; for (const b of platformBoxes(lastOpts)) keep[b.id] = val(b.id);
    const note = (el('entryPrefillNote') || {}).textContent || '';
    plat.innerHTML = platformEntryHtml(lastOpts);
    for (const [id, v] of Object.entries(keep)) if (v !== '') setVal(id, v);
    const n = el('entryPrefillNote'); if (n) n.textContent = note;
  }
  if (plat) plat.style.display = m === 'platform' ? '' : 'none';
  if (byType) byType.style.display = m === 'type' ? '' : 'none';
  const sw = el('entryModeNote');
  if (sw) sw.innerHTML = m === 'type' ? 'Entering by type. <a href="#" class="itemise-link" data-on-click="setEntryMode(\'platform\'); return false;">Enter what my platform shows instead</a>' : '';
  return m;
}

/** Re-describe the plan (a strategy switch, a sleeve appearing) without losing what is typed. */
export function configureMonthlyEntry(opts) { return paintEntryMode(currentEntryMode(), opts || {}); }

/** The figures the engine runs on, from whichever view is showing; the by-type boxes are written either way. */
export function readMonthlyEntry(opts) {
  if (opts) lastOpts = { ...lastOpts, ...opts };
  const n = (id) => { const v = val(id); return v === '' ? 0 : (parseFloat(v) || 0); };
  if (currentEntryMode() === 'type') {
    const split = { equity: n('entryEquity'), bond: n('entryBond'), cash: n('entryCash'), diversifier: n('entryDiversifier') };
    return { ...split, problem: null, entered: enteredBlock('type', split, split) };
  }
  const typed = { total: val('entryPlatTotal'), cash: val('entryPlatCash'), bonds: val('entryPlatBonds'), diversifiers: val('entryPlatDiversifiers') };
  const s = splitFromPlatform(typed, lastOpts);
  if (s.problem) return { ...s, entered: null };
  setVal('entryEquity', s.equity); setVal('entryBond', s.bond); setVal('entryCash', s.cash); setVal('entryDiversifier', s.diversifier);
  return { ...s, entered: enteredBlock('platform', typed, s) };
}

/** Switch views, carrying the figures across (platform → type derives the split; type → platform adds up). */
export function setEntryMode(mode) {
  if (mode === 'type' && currentEntryMode() === 'platform') { readMonthlyEntry(); }
  else if (mode === 'platform' && currentEntryMode() === 'type') {
    const n = (id) => parseFloat(val(id)) || 0;
    const e = n('entryEquity'), b = n('entryBond'), c = n('entryCash'), d = n('entryDiversifier');
    if (e + b + c + d > 0) { setVal('entryPlatTotal', e + b + c + d); setVal('entryPlatCash', c); setVal('entryPlatBonds', lastOpts.contract ? '' : b); setVal('entryPlatDiversifiers', d || ''); }
  }
  return paintEntryMode(mode);
}

/** Fill both views from last month's record and say so; nothing recorded leaves them blank. */
export function prefillMonthlyEntry(history, opts) {
  if (opts) lastOpts = { ...lastOpts, ...opts };
  const p = prefillFromHistory(history, lastOpts);
  const note = el('entryPrefillNote'); if (note) note.textContent = prefillNote(p);
  if (!p) { for (const id of ['entryPlatTotal', 'entryPlatCash', 'entryPlatBonds', 'entryPlatDiversifiers', 'entryEquity', 'entryBond', 'entryCash']) setVal(id, ''); return null; }
  setVal('entryPlatTotal', p.total); setVal('entryPlatCash', p.cash); setVal('entryPlatBonds', lastOpts.contract ? '' : p.bonds); setVal('entryPlatDiversifiers', p.diversifiers || '');
  const s = splitFromPlatform(p, lastOpts);
  if (!s.problem) { setVal('entryEquity', s.equity); setVal('entryBond', s.bond); setVal('entryCash', s.cash); setVal('entryDiversifier', s.diversifier); }
  return p;
}

// ---- Helpers moved out of the shell (they were index.html's; same behaviour) ----

/**
 * Soft plausibility guard for fund values. If ALL THREE pots are under £10k the person has most likely typed
 * thousands (250 meaning £250,000). Ask before proceeding — a genuinely small or depleted set of pots can still
 * confirm and continue. ISA is excluded (it can legitimately be small or zero).
 */
export async function confirmFundsIfLow(equity, bond, cash, appConfirm) {
  const LOW = 10000;
  if (equity < LOW && bond < LOW && cash < LOW && (equity + bond + cash) > 0) {
    const fmt = (n) => '£' + Math.round(n || 0).toLocaleString();
    return await appConfirm(`These fund values look low — Shares ${fmt(equity)}, Bonds ${fmt(bond)}, Cash ${fmt(cash)}.\n\nEnter whole pounds (250000, not 250).\n\nContinue anyway?`);
  }
  return true;
}

/**
 * Installs the entry card's window functions: the per-fund popup, the "record what you hold" nudge, the taxable
 * account's cost pre-fill and the view switch.
 * @param {object} deps { holdingsLines: () => [], effectiveSubClass, liveCatalogueEntry, SUB_ASSET_PROFILES, getHistoryAsync, getDecisionSettingsAsync }
 */
export function installMonthlyEntryHandlers(deps) {
  const w = typeof window === 'undefined' ? globalThis : window;
  let modal = { fieldId: null, subtotal: 0 };
  w.setEntryMode = setEntryMode;
  w.openFundBucketModal = function (bucket, fieldId, title) {
    // The funds to type values for are what you HOLD (the plan record) — a strategy's funds-to-test list is never holdings (6.13.0).
    const bucketFunds = (deps.holdingsLines() || []).filter((f) => { const k = deps.effectiveSubClass(f); return f.ticker && k && deps.SUB_ASSET_PROFILES[k] && deps.SUB_ASSET_PROFILES[k].bucket === bucket; });
    modal = { fieldId, subtotal: 0 };
    el('fundModalTitle').textContent = title;
    const rows = el('fundModalRows');
    if (!bucketFunds.length) rows.innerHTML = '<p style="color:var(--text-muted);">No ' + esc(title.toLowerCase()) + ' recorded yet. Record what you hold on the <strong>Transition</strong> tab, then come back — or just type the total into the box.</p>';
    else rows.innerHTML = bucketFunds.map((f) => {
      const cat = deps.liveCatalogueEntry(f.ticker); const prof = deps.SUB_ASSET_PROFILES[deps.effectiveSubClass(f)];
      return '<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>' + esc(f.ticker) + '</strong> <span style="color:var(--text-muted);font-size:12px;">' + esc(cat ? cat.name : (prof ? prof.label : '')) + '</span></span>'
        + '<span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" data-on-input="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>';
    }).join('');
    w.updateFundModalSubtotal();
    el('fundBucketModal').style.display = 'flex';
  };
  w.updateFundModalSubtotal = function () {
    let sum = 0; document.querySelectorAll('#fundModalRows .fund-modal-input').forEach((inp) => { sum += (+inp.value || 0); });
    modal.subtotal = sum; el('fundModalSubtotal').textContent = 'Total: £' + Math.round(sum).toLocaleString();
  };
  w.applyFundBucketModal = function () { setVal(modal.fieldId, Math.round(modal.subtotal || 0)); w.closeFundBucketModal(); };
  w.closeFundBucketModal = function () { el('fundBucketModal').style.display = 'none'; };
  // Entry by fund needs a recorded portfolio — nudge to the Transition tab until there is one.
  w.updateEntryTagPrompt = function () {
    const box = el('entryTagPrompt'); if (!box) return;
    const hasTags = (deps.holdingsLines() || []).filter((f) => f.ticker).length > 0;
    if (hasTags) { box.style.display = 'none'; box.innerHTML = ''; return; }
    box.style.display = 'block';
    box.innerHTML = '<div class="alert alert-info" style="font-size:13px;">Record what you hold on the <strong>Transition</strong> tab (paste it from your platform) and the <em>enter per fund ▸</em> links let you type each fund\'s value here. Or just type the totals.</div>';
  };
  // Pre-fill the taxable account's cost basis from the last saved month (it must persist between months or CGT
  // cannot be worked out). The balance itself is entered fresh each month.
  w.prefillGiaBasis = async function () {
    try {
      const box = el('entryGiaBasis'); if (!box) return;
      const hist = await deps.getHistoryAsync({ sortDesc: true, limit: 50 });
      const last = hist.find((h) => h.giaBasisAfter != null);
      box.value = last ? Math.round(last.giaBasisAfter) : '';
      const bal = el('entryGia');
      if (bal && last && last.giaBalanceAfter > 0 && (!bal.value || +bal.value === 0)) bal.value = Math.round(last.giaBalanceAfter);
      // No GIA recorded yet: start from the plan's "taxable investments today" (copied from the Stress settings), cost unknown so left blank.
      if (bal && !last && (!bal.value || +bal.value === 0)) { const ds = await deps.getDecisionSettingsAsync(); if (ds && ds.taxableStart > 0) bal.value = Math.round(ds.taxableStart); }
    } catch (e) { /* not signed in yet */ }
  };
}
