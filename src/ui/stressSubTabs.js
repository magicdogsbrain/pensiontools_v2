/**
 * The Stress tester's sub-tabs (moved out of index.html's inline script, 7.12.0).
 *
 * Pressing Settings draws the form from the plan as stored (index.html loadStressSettings). Pressing it while it is already
 * open does not draw it again: the full view presses Settings itself a moment after a plan opens (homeBannerUi.pressOpeningSub;
 * the wizard's way in, NextStep 'stress-settings'), and that second press used to draw the stored plan back over a way of
 * drawing just pressed and figures just typed. Every other way to Settings still loads it: a plan opening or switching makes
 * "Will it last?" the open sub-tab first (index.html resetStressSubTabs), and the Stress tab's own press loads it.
 *
 *   pressIfClosed(button)                       presses a tab or sub-tab only when it is not the open one; true when pressed
 *   installStressSubTabs(doc, win, deps)        the sub-tabs' presses. deps: loadStressSettings, updateStrategyNote,
 *                                               getStressSettingsAsync, and optionally beforeChange (awaited before a press
 *                                               changes anything: a save of what was typed waiting to go)
 */

/** Presses `button` only when it is not already the open tab; returns whether it was pressed. */
export function pressIfClosed(button) {
  if (!button || (button.classList && button.classList.contains('active'))) return false;
  button.click();
  return true;
}

export function installStressSubTabs(doc, win, deps) {
  const d = deps || {};
  doc.querySelectorAll('.sub-tab[data-stresstab]').forEach((tab) => {
    tab.addEventListener('click', async () => {
      // pressed again while it is open: nothing to load, and what is typed stays where it is
      const wasOpen = tab.classList.contains('active');
      if (typeof d.beforeChange === 'function') { try { await d.beforeChange(); } catch (e) { /* the save says its own fault */ } }
      doc.querySelectorAll('.sub-tab[data-stresstab]').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      if (win.__hideHelpTip) win.__hideHelpTip();
      doc.querySelectorAll('.stress-subtab').forEach((c) => c.classList.add('hidden'));
      const which = tab.dataset.stresstab;
      const box = doc.getElementById('stress-' + which);
      if (box) box.classList.remove('hidden');
      if (which === 'montecarlo' && typeof d.updateStrategyNote === 'function') d.updateStrategyNote();
      if (which === 'stresssettings' && !wasOpen) await d.loadStressSettings();
      // Drawdown / Glidepath: start from the plan's own horizon, not a stale 35
      if (which === 'drawdown' || which === 'glidepath') {
        try {
          const s = await d.getStressSettingsAsync();
          const el = doc.getElementById((which === 'drawdown' ? 'dd' : 'gp') + 'Duration');
          if (el && s.duration) el.value = s.duration;
        } catch (e) { /* the defaults stand */ }
      }
    });
  });
}
