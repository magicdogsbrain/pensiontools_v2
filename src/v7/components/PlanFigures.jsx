/**
 * The figures of a saved plan, drawn (research/v7/your-plan.md 3): every figure through Money (data-key, data-value),
 * every one with where it came from and its date, a flag when it is over three months old, and never a box.
 *
 *   fill(text, slots)                  '{month}' → the slot's words
 *   <PlanSentence s figures />         a sentence read.js wrote: strings and { key, kind } parts into `figures`
 *   <PlanLine line figures prefix />   one line of a step's panel: its label, the sentence, the source words
 *   <PlanButtons buttons planId … />   the step's buttons: a link inside V7, or "… in the planner" (the hand-over)
 */
import { Money } from './Money.jsx';
import { Button, LinkButton } from './Button.jsx';
import { PLAN } from '../copy/plan.js';

export const fill = (text, slots = {}) => String(text == null ? '' : text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));

export function PlanSentence({ s, figures, prefix = '', as: Tag = 'span', ...rest }) {
  if (!s || !Array.isArray(s.parts)) return null;
  return (
    <Tag {...rest} data-sentence-id={s.id}>
      {s.parts.map((p, i) => (typeof p === 'string' ? p : 'fixed' in p ? <span key={i} data-fixed>{String(p.fixed)}</span> : <Money key={i} source={figures} k={p.key} kind={p.kind} />))}
    </Tag>
  );
}

/** The source words of a figure (3.2), with the stale flag (3.5). */
function sourceWords(source) {
  if (!source) return null;
  const w = PLAN.page.source;
  const at = source.at || null;
  let text;
  if (source.kind === 'record') text = at ? fill(w.record, { date: at }) : w.recordUndated;
  else if (source.kind === 'hold') text = at ? fill(w.hold, { date: at }) : w.holdUndated;
  else if (source.kind === 'locked') text = at ? fill(w.locked, { date: at }) : w.lockedUndated;
  else if (source.kind === 'budget') text = w.budget;
  else text = at ? fill(w.savedOn, { date: at }) : w.saved;
  return <span class="plan-source">{text}{source.stale && at && <> <span class="plan-stale">{fill(PLAN.page.stale, { date: at })}</span></>}</span>;
}

/** Slots that hold an id: the strategy, a dial, the mix's mode — drawn by their plain names. */
const SLOT_WORDS = { strategy: PLAN.strategies, dial: PLAN.dials, mode: PLAN.allocModes };
const worded = (slots) => Object.fromEntries(Object.entries(slots || {}).map(([k, v]) => [k, SLOT_WORDS[k] && SLOT_WORDS[k][v] ? SLOT_WORDS[k][v] : v]));

export function PlanLine({ line, figures, hideSource = false }) {
  if (!line) return null;
  const label = fill(PLAN.lines[line.id] ?? '', worded(line.slots));
  const after = PLAN.lineAfter[line.id] ? fill(PLAN.lineAfter[line.id], worded(line.slots)) : '';
  const hasParts = line.sentence && Array.isArray(line.sentence.parts) && line.sentence.parts.length > 0;
  return (
    <li class="plan-line" data-line={line.id}>
      {label && <span class="plan-label">{label}{hasParts ? ': ' : ''}</span>}
      {hasParts && <PlanSentence s={line.sentence} figures={figures} class="plan-value" />}
      {after && line.slots && Object.values(line.slots).some((v) => v) ? <span>{after}</span> : null}
      {line.theirLine && <span class="plan-value"> {fill(PLAN.theirLines[line.theirLine.id] || '', line.theirLine.slots)}</span>}
      {!hideSource && line.source && <> <br />{sourceWords(line.source)}</>}
    </li>
  );
}

/**
 * The buttons of a step. `onChange(place, planId)` leaves for the planner (the hand-over); a button with `href` is a
 * link inside V7. `windowPlans` adds the warning before leaving without an account.
 */
export function PlanButtons({ buttons, planId, stepId, onChange, readonly = false }) {
  if (!buttons || !buttons.length) return null;
  return (
    <div class="actions-row plan-actions">
      {buttons.map((b, i) => (b.href
        ? <LinkButton key={i} testid={`plan.${stepId}.${b.id}`} href={b.href}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</LinkButton>
        : readonly ? null
          : <Button key={i} testid={`plan.${stepId}.${b.id}`} kind="plain" onClick={() => onChange(b.place, b.planId || planId)}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</Button>))}
    </div>
  );
}
