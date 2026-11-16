/**
 * What the full view says about a plan that is not locked yet (7.12.0). Replaces the "Set up this plan first … meaningless"
 * warnings: an unlocked plan runs on its own figures (services/DraftDecision.js), so the Decision tool says which, and a
 * plan with no figures yet says where to add them.
 *
 *   draftLineOf(plan, { stress, stage })   { kind: 'figures'|'none', text, btn } or null (locked, or still working)
 *   SETTINGS_LINE                           the line above the Decision tool's settings on an unlocked plan
 *   paintDraftLines(win, doc, { plan, stress, stage })   draws #dsSetupBanner and #ssSetupBanner
 *   paintDraftSettingsLine(win, banner)     draws the settings line into the Decision settings' banner
 *   refreshDraftLines(win, doc, deps)       reads the open plan (deps: getActiveScenarioAsync, getStressSettingsAsync) and
 *                                           draws both boxes; never throws
 *   openStressSettings(win)                 opens Stress tester → Settings
 *   blankUnsetPots(doc, settings)           a plan with no pension known anywhere (`potsNotSet`, PlanReading.withPensionToday):
 *                                           the Stress settings' pot box empty, "Not set yet", never the default
 *
 * The words are plain data; the painters only set text and one button that opens Stress tester → Settings.
 */
import { planHasFigures, planLocked } from '../services/DraftDecision.js';
import { sippTodayOf } from '../services/PotsAtRetirement.js';
import { SAVER_STAGE_KEYS } from '../services/LifeStage.js';
import { nextStepAction } from '../services/NextStep.js';
import { planStage } from '../services/PlanReading.js';

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

export const DRAFT_WORDS = Object.freeze({
  figures: 'This plan is not locked yet. Recording its first month locks it, and you are asked first. It runs on your plan\'s figures: {figures}.',
  none: 'This plan has no figures yet. Add your pot and what you want to spend on Stress tester → Settings.',
  settings: 'These are your plan\'s settings. Change them on Stress tester → Settings; this page follows.',
  openStress: 'Open the Stress tester',
  openSettings: 'Open Stress tester settings',
  notSet: 'Not set yet'
});

/** The plan's figures as one list: "pension £250,000, ISAs and savings £20,000, £23,858 a year before tax". */
export function figuresWords(stress) {
  const s = isObj(stress) ? stress : {};
  const parts = ['pension ' + gbp(sippTodayOf(s))];
  if (+s.isaBalance > 0) parts.push('ISAs and savings ' + gbp(s.isaBalance));
  const first = Array.isArray(s.targetSchedule) && s.targetSchedule.length && +s.targetSchedule[0] > 0 ? +s.targetSchedule[0] : +s.baseSalary || 0;
  if (first > 0) parts.push(gbp(first) + ' a year before tax');
  return parts.join(', ');
}

/** The line for the Decision tool's first page, or null when there is none to show. */
export function draftLineOf(plan, { stress = null, stage = null } = {}) {
  if (!plan || planLocked(plan)) return null;
  if (stage && SAVER_STAGE_KEYS.includes(stage.key)) return null;   // still working: the Decision tool's own gate line speaks
  if (!planHasFigures(plan)) return { kind: 'none', text: DRAFT_WORDS.none, btn: DRAFT_WORDS.openSettings };
  return { kind: 'figures', text: DRAFT_WORDS.figures.replace('{figures}', figuresWords(stress || (plan.stressTool && plan.stressTool.settings))), btn: DRAFT_WORDS.openStress };
}

function paintBox(win, box, line, action) {
  if (!box) return;
  if (!line) { box.style.display = 'none'; return; }
  box.className = 'alert alert-info';
  box.textContent = line.text + ' ';
  const b = box.ownerDocument.createElement('button');
  b.type = 'button';
  b.className = 'risk-btn';
  b.style.cssText = 'margin-left:8px; padding:5px 14px; font-size:13px;';
  b.textContent = line.btn;
  b.onclick = nextStepAction(action, win);
  box.appendChild(b);
  box.style.display = 'block';
}

/** Draws both boxes: the Decision tool's (the plan's figures, or none yet) and the Stress tester's (only when none yet). */
export function paintDraftLines(win, doc, { plan, stress = null, stage = null } = {}) {
  const line = draftLineOf(plan, { stress, stage });
  paintBox(win, doc.getElementById('dsSetupBanner'), line, line && line.kind === 'figures' ? { kind: 'tab', tab: 'stress' } : { kind: 'stress-settings' });
  const none = plan && !planLocked(plan) && !planHasFigures(plan) ? { kind: 'none', text: DRAFT_WORDS.none, btn: DRAFT_WORDS.openSettings } : null;
  paintBox(win, doc.getElementById('ssSetupBanner'), none, { kind: 'stress-settings' });
  return line;
}

/** The Decision settings' banner on an unlocked plan: the one line, with the way to the Stress tester's settings. */
export function paintDraftSettingsLine(win, banner) {
  paintBox(win, banner, { text: DRAFT_WORDS.settings, btn: DRAFT_WORDS.openSettings }, { kind: 'stress-settings' });
}

/** Opens Stress tester → Settings. */
export function openStressSettings(win) {
  nextStepAction({ kind: 'stress-settings' }, win)();
}

/** Reads the open plan and draws both boxes (the full view calls it on every load, tab change and Save). */
export async function refreshDraftLines(win, doc, deps) {
  try {
    const plan = await deps.getActiveScenarioAsync();
    const stress = await deps.getStressSettingsAsync();
    let stage = null; try { stage = plan ? planStage(plan) : null; } catch (e) { stage = null; }
    return paintDraftLines(win, doc, { plan, stress, stage });
  } catch (e) {
    for (const id of ['dsSetupBanner', 'ssSetupBanner']) { const el = doc.getElementById(id); if (el) el.style.display = 'none'; }
    return null;
  }
}

/** Empties the Stress settings' pot box when no pension is known anywhere, so no default reads as a figure. */
export function blankUnsetPots(doc, settings) {
  const box = doc && doc.getElementById('ssPot');
  if (!box) return;
  if (settings && settings.potsNotSet) { box.value = ''; box.placeholder = DRAFT_WORDS.notSet; }
  else if (box.placeholder === DRAFT_WORDS.notSet) box.placeholder = '';
}
