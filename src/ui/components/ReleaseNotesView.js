/**
 * Release notes, rendered. Pure functions: HTML in, HTML out — no DOM, no storage, so the
 * once-only "What's new" pop-up and the What's new page are tested like any other component.
 * Every string from the release data passes through esc(); the data is ours, but the habit is
 * what keeps the strict CSP honest.
 */
import { TOOL_IDS, TOOL_LABELS, isAnnounced } from '../../releases.js';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  return Number.isNaN(d.getTime()) ? esc(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};
const list = (items) => (Array.isArray(items) && items.length) ? '<ul class="rn-list">' + items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>' : '';
const section = (title, body) => body ? '<div class="rn-section"><div class="rn-h">' + esc(title) + '</div>' + body + '</div>' : '';

/**
 * Per-tool effects. Only the Decision tool and the Stress Tester can be switched off per plan, so
 * only those two are hidden when `enabledTools` says so; everything else always shows. Tools with
 * an empty list are named as unaffected — silence would read as "forgot to check".
 */
export function effectsHtml(effects, enabledTools) {
  const eff = effects || {};
  const hidden = new Set(['decision', 'stress'].filter((t) => Array.isArray(enabledTools) && !enabledTools.includes(t)));
  const shown = TOOL_IDS.filter((t) => !hidden.has(t));
  const affected = shown.filter((t) => Array.isArray(eff[t]) && eff[t].length);
  const clear = shown.filter((t) => !(Array.isArray(eff[t]) && eff[t].length));
  let h = affected.map((t) => '<div class="rn-tool"><strong>' + esc(TOOL_LABELS[t] || t) + '</strong>' + list(eff[t]) + '</div>').join('');
  if (clear.length) h += '<p class="hint rn-clear">No effect on saved plans in: ' + esc(clear.map((t) => TOOL_LABELS[t] || t).join(', ')) + '.</p>';
  return h;
}

/** Plan-specific bullets: [{ name, notes: [] }] — plans with nothing to say are skipped. */
export function planNotesHtml(planNotes) {
  const rows = (planNotes || []).filter((p) => p && Array.isArray(p.notes) && p.notes.length);
  if (!rows.length) return '';
  return rows.map((p) => '<div class="rn-plan"><strong>Your plan “' + esc(p.name || 'Untitled') + '”</strong>' + list(p.notes) + '</div>').join('');
}

/** The body of one release: every section the data carries, in a fixed order. */
export function releaseSectionsHtml(rel, { enabledTools, planNotes, otherPlanCount } = {}) {
  let h = rel.summary ? '<p class="rn-summary">' + esc(rel.summary) + '</p>' : '';
  h += section('What changed', list(rel.changes));
  h += section('Corrections', list(rel.corrections));
  if (rel.effects) {
    let body = effectsHtml(rel.effects, enabledTools) + planNotesHtml(planNotes);
    if (otherPlanCount > 0) body += '<p class="hint">…and ' + otherPlanCount + ' other plan' + (otherPlanCount > 1 ? 's' : '') + ' — each is listed on the What\'s new page.</p>';
    h += section('How this affects your plans', body);
  }
  h += section('What you may need to do', list(rel.actions));
  h += section('Notes', list(rel.notes));
  return h;
}

/**
 * The once-only pop-up body. `entries` are the announced releases the user has not seen, newest
 * first; the active plan's own bullets ride along, other plans are counted.
 */
export function whatsNewHtml(entries, opts = {}) {
  const rels = (entries || []).filter(Boolean);
  if (!rels.length) return '';
  const head = rels.length === 1
    ? 'What\'s new in v' + esc(rels[0].version)
    : 'What\'s new since you were last here (v' + esc(rels[rels.length - 1].version) + ' – v' + esc(rels[0].version) + ')';
  let h = '<h2 class="rn-title">' + head + '</h2>';
  for (const rel of rels) {
    h += '<div class="rn-release"><h3>' + esc(rel.title) + ' <span class="hint">v' + esc(rel.version) + ' · ' + fmtDate(rel.date) + '</span></h3>'
      + releaseSectionsHtml(rel, opts) + '</div>';
  }
  return h;
}

/**
 * The What's new page: how we version, then every curated release (newest open), then the
 * reconstructed history. `plans` = [{ name, scenario }] lets each release list its own bullets
 * for each of the user's plans.
 */
export function versionsPageHtml(releases, history, { currentVersion, plans, enabledTools, commitsUrl } = {}) {
  const url = commitsUrl || 'https://github.com/magicdogsbrain/pensiontools_v2/commits/main';
  let h = '<div class="card rn-page"><h2>What\'s new</h2>'
    + '<p class="hint">You are on <strong>v' + esc(currentVersion || (releases[0] && releases[0].version) || '?') + '</strong>. Every release is listed here with what changed, what was corrected, how it affects the plans you had already saved in each tool, and what you may need to do. '
    + 'The first two numbers of a version change when something you can see changed (those releases pop up once when you next open the app); the third changes for small fixes. '
    + 'The <em>engine</em> version, pinned on your plan when it locks, changes only when a strategy\'s arithmetic changes. Full detail: <a href="' + esc(url) + '" target="_blank" rel="noopener">the commit history</a>.</p>';
  (releases || []).forEach((rel, i) => {
    const planNotes = (plans || []).map((p) => ({ name: p.name, notes: typeof rel.affects === 'function' ? safeAffects(rel, p.scenario) : [] }));
    h += '<details class="rn-details"' + (i === 0 ? ' open' : '') + '><summary><strong>v' + esc(rel.version) + '</strong> · ' + esc(rel.title) + ' <span class="hint">' + fmtDate(rel.date) + (isAnnounced(rel) ? '' : ' · fix release') + (rel.engineVersion ? ' · engine ' + esc(rel.engineVersion) : '') + '</span></summary>'
      + releaseSectionsHtml(rel, { enabledTools, planNotes }) + '</details>';
  });
  if (history && history.length) {
    h += '<h3 class="rn-history-h">Before release notes</h3><p class="hint">Reconstructed from the commit history — grouped by theme and dated by the last change in each group, so the dates are approximate and the lists are not exhaustive.</p>';
    for (const rel of history) {
      h += '<details class="rn-details rn-reconstructed"><summary><strong>v' + esc(rel.version) + '</strong> · ' + esc(rel.title) + ' <span class="hint">' + fmtDate(rel.date) + '</span></summary>'
        + (rel.summary ? '<p class="rn-summary">' + esc(rel.summary) + '</p>' : '')
        + section('What changed', list(rel.changes)) + section('Corrections', list(rel.corrections)) + '</details>';
    }
  }
  return h + '</div>';
}

/** affects() must never take the page down: any throw on an odd old plan shape becomes "no notes". */
export function safeAffects(rel, scenario) {
  try { const r = rel.affects(scenario || {}, {}); return Array.isArray(r) ? r.filter((x) => typeof x === 'string' && x) : []; }
  catch (e) { return []; }
}
