/**
 * Release notes, drawn from the data (research/v7/road-to-7.md step 11): the Preact counterpart of the planner's
 * src/ui/components/ReleaseNotesView.js. One release's sections in the planner's order — the summary, what changed, the
 * corrections, how it affects your plans (the parts of the planner by their V7 names, the unaffected ones named: silence
 * would read as "forgot to check"), what you may need to do, the notes. The notes are quoted as written (`data-quoted`:
 * the checks on the screen's own words leave them be). Draws only.
 *
 *   <Release r words open />        one release, as a <details>
 *   <ReleaseBody r words />         its sections
 */
import { fill } from './PlanFigures.jsx';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** '2026-10-27' → '27 October 2026' (the day as written, never through a clock). */
export const dayWords = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] || m[2]} ${m[1]}` : String(iso || '');
};

const List = ({ items }) => (Array.isArray(items) && items.length ? <ul class="rn-list">{items.map((t, i) => <li key={i}>{t}</li>)}</ul> : null);
/** A section's heading one level under the release's own (no level skipped: the screen rule R9). */
const Section = ({ title, children, when, level = 3 }) => { const H = 'h' + level; return when ? <div class="rn-section"><H class="rn-h">{title}</H>{children}</div> : null; };

/** How a release affects the plans, part by part (the planner's effectsHtml): the affected parts listed, the rest named as unaffected. */
export function Effects({ effects, words }) {
  const eff = effects && typeof effects === 'object' ? effects : {};
  const ids = Object.keys(words.tools);
  const affected = ids.filter((t) => Array.isArray(eff[t]) && eff[t].length);
  const clear = ids.filter((t) => !(Array.isArray(eff[t]) && eff[t].length));
  return (
    <>
      {affected.map((t) => <div class="rn-tool" key={t}><strong>{words.tools[t]}</strong><List items={eff[t]} /></div>)}
      {clear.length > 0 && <p class="note rn-clear">{fill(words.noEffect, { tools: clear.map((t) => words.tools[t]).join(', ') })}</p>}
    </>
  );
}

export function ReleaseBody({ r, words, level = 2 }) {
  const W = words.sections;
  const l = level + 1;
  return (
    <div class="rn-body" data-quoted="release" data-version={r.version}>
      {r.summary && <p class="rn-summary">{r.summary}</p>}
      <Section title={W.changes} when={r.changes && r.changes.length} level={l}><List items={r.changes} /></Section>
      <Section title={W.corrections} when={r.corrections && r.corrections.length} level={l}><List items={r.corrections} /></Section>
      <Section title={W.effects} when={!!r.effects} level={l}><Effects effects={r.effects} words={words} /></Section>
      <Section title={W.actions} when={r.actions && r.actions.length} level={l}><List items={r.actions} /></Section>
      <Section title={W.notes} when={r.notes && r.notes.length} level={l}><List items={r.notes} /></Section>
    </div>
  );
}

/** One release as a closed block that opens (the newest open on the page); its heading at `level` (2 on the page, 3 under a heading), its sections one under. */
export function Release({ r, words, open = false, level = 2 }) {
  const H = 'h' + level;
  const tag = [dayWords(r.date), r.announced || r.reconstructed ? null : words.fix, r.engineVersion ? fill(words.engine, { version: r.engineVersion }) : null].filter(Boolean).join(' · ');
  return (
    <details class={`rn-details${r.reconstructed ? ' rn-reconstructed' : ''}`} open={open} data-testid={`news.release.${r.version}`}>
      <summary><H class="rn-release-h">{'Version ' + r.version} · <span data-quoted="title">{r.title}</span></H> <span class="note">{tag}</span></summary>
      <ReleaseBody r={r} words={words} level={level} />
    </details>
  );
}
