/**
 * Downloads (research/v7/road-to-7.md step 11): "Download this plan" on "Your plans" and "Download everything" on the
 * account page each save ONE file on the person's own computer — a Blob and an anchor, as the planner's exportActivePlan
 * does. Nothing leaves the page: no request, no storage.
 *
 *   saveFile(win, name, text)        the file, offered to the browser to save; true when it was
 *   startDownloads(store, { win, now }) → stop()   "Download this plan" (plan/download): planExportJson of the plan as read,
 *                                    identity stripped, named by planExportFileName
 */
import { A } from '../state/actions.js';
import { planExportJson, planExportFileName } from '../../services/PlanExport.js';

const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';

/** A Blob and an anchor; the object URL is let go once the browser has it. */
export function saveFile(win, name, text) {
  try {
    if (!win || typeof win.Blob !== 'function' || !win.URL || typeof win.URL.createObjectURL !== 'function' || !win.document) return false;
    const blob = new win.Blob([text], { type: 'application/json' });
    const url = win.URL.createObjectURL(blob);
    const a = win.document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    (win.document.body || win.document.documentElement).appendChild(a);
    a.click();
    a.remove();
    if (typeof win.setTimeout === 'function') win.setTimeout(() => { try { win.URL.revokeObjectURL(url); } catch { /* gone already */ } }, 1000);
    else { try { win.URL.revokeObjectURL(url); } catch { /* gone already */ } }
    return true;
  } catch {
    return false;
  }
}

export function startDownloads(store, { win, now = () => new Date() }) {
  return store.subscribe((state, action) => {
    if (action.type !== A.PLAN_DOWNLOAD) return;
    const d = state.ui.download;
    if (!d) return;
    const plans = state.plans;
    const entry = plans && Array.isArray(plans.list) ? plans.list.find((e) => e && e.plan && String(e.plan.id) === String(d.planId)) : null;
    if (!entry) { store.dispatch({ type: A.PLAN_SAVE_FAILED, planId: d.planId, problem: 'notHere' }); return; }
    const ok = saveFile(win, planExportFileName(nameOf(entry.plan), now()), planExportJson(entry.plan));
    if (!ok) store.dispatch({ type: A.PLAN_SAVE_FAILED, planId: d.planId, problem: 'storage' });
  });
}
