/**
 * The full view's Decision report header (the printed annual and monthly records): a standalone plan header so any
 * exported record stands on its own. Its income line is the plan's first step a year before tax as the one income reader
 * gives it (src/reading/income.js incomeStepsOf: what the plan's way takes; ruling Z1b), never the stored target.
 *
 *   decisionPlanHeaderHtml(s, subtitle, step) → html
 *     s        the Decision settings (the pots' floors, the bond tent, the length)
 *     step     incomeStepsOf(plan).steps[0] (null: no income read, the line says so)
 */
import { RISK_PRESETS, nearestPresetKey } from '../services/GlidepathService.js';

const gbp = (v) => '£' + Math.round(v || 0).toLocaleString('en-GB');

export function decisionPlanHeaderHtml(s0, subtitle, step = null) {
  const s = s0 || {};
  const pot = (s.equityMin || 0) + (s.bondMin || 0) + (s.cashTarget || 0);
  const key = pot > 0 ? nearestPresetKey(s.equityMin / pot, s.bondMin / pot, s.cashTarget / pot) : 'balanced';
  const preset = RISK_PRESETS[key] || RISK_PRESETS.balanced;
  const mix = Math.round(preset.equity * 100) + '/' + Math.round(preset.bond * 100) + '/' + Math.round(preset.cash * 100);
  const income = step && Number.isFinite(+step.beforeTax) ? gbp(step.beforeTax) + ' a year before tax' : 'not set';
  return `<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${subtitle || ''}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${gbp(pot)}</td><td>Risk level</td><td>${preset.label} (${mix})</td></tr>
          <tr><td>Bond tent</td><td>${s.equityGlideEnabled ? 'On — rising-equity glidepath' : 'Off'}</td><td>First income step</td><td>${income}</td></tr>
          <tr><td>Duration</td><td>${s.duration || 35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString('en-GB')}</td></tr>
        </tbody></table>
      </div>`;
}
