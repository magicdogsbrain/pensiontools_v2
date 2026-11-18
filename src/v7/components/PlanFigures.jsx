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
import { figureFactOf } from './facts.js';
import { Fact } from '../../reading/Mark.jsx';

export const fill = (text, slots = {}) => String(text == null ? '' : text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));

/**
 * fill, with the slots that hold a figure of the fact register drawn marked (lead4.md G1): `marks` is { slot: factId }.
 * Returns the words as nodes; the text a person reads is the same as fill's.
 */
export function fillMarked(text, slots = {}, marks = {}) {
  const out = [];
  const t = String(text == null ? '' : text);
  let at = 0;
  for (const m of t.matchAll(/\{(\w+)\}/g)) {
    const k = m[1];
    const has = k in slots && slots[k] != null;
    out.push(t.slice(at, m.index));
    out.push(has ? (marks[k] ? <Fact key={m.index} id={marks[k]}>{String(slots[k])}</Fact> : String(slots[k])) : m[0]);
    at = m.index + m[0].length;
  }
  out.push(t.slice(at));
  return out.filter((x) => x !== '');
}

/**
 * Words already written (a sentence another reader built), with the figures found in them drawn marked (lead4.md G1):
 * `finds` is [[RegExp with one group, factId], …]; the first match of each, group 1, is wrapped. The text is unchanged.
 */
export function markIn(text, finds = []) {
  const t = String(text == null ? '' : text);
  const hits = [];
  for (const [re, id] of finds) {
    const m = new RegExp(re.source, re.flags.replace('g', '')).exec(t);
    if (!m || m[1] == null) continue;
    const start = m.index + m[0].indexOf(m[1]);
    const end = start + m[1].length;
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, id });
  }
  if (!hits.length) return t;
  hits.sort((a, b) => a.start - b.start);
  const out = [];
  let at = 0;
  for (const h of hits) { out.push(t.slice(at, h.start)); out.push(<Fact key={h.start} id={h.id}>{t.slice(h.start, h.end)}</Fact>); at = h.end; }
  out.push(t.slice(at));
  return out.filter((x) => x !== '');
}

/** The chance words of the register ("about 17 times in 20", "more than 19 times in 20", "less than once in 20"). */
export const CHANCE_RE = /((?:more than |less than |about )?(?:\d+ times|once) in 20)/;

export function PlanSentence({ s, figures, prefix = '', as: Tag = 'span', ...rest }) {
  if (!s || !Array.isArray(s.parts)) return null;
  return (
    <Tag {...rest} data-sentence-id={s.id}>
      {s.parts.map((p, i) => (typeof p === 'string' ? p : 'fixed' in p ? <span key={i} data-fixed>{String(p.fixed)}</span> : figureFactOf(s.id, p.key) ? <Fact key={i} id={figureFactOf(s.id, p.key)}><Money source={figures} k={p.key} kind={p.kind} /></Fact> : <Money key={i} source={figures} k={p.key} kind={p.kind} />))}
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
const SLOT_WORDS = { strategy: PLAN.strategies, dial: PLAN.dials, mode: PLAN.allocModes, what: PLAN.wrappers, level: PLAN.levels };
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
 * A step's name on a plan's pages (the home, the rail, the step's own heading). A locked plan's own step is "Your plan as
 * locked". On a Drawing plan the move step goes by the mix it keeps to, its short name (7.3.1): such a plan is not moving,
 * whatever its record of what is held says, so "Moving to your plan's mix" there would name the stage it is not in. `view`
 * is the plan's page reading (state/select.js planView: `locked`, and `life`, LifeStage.stageOf's stage).
 */
// (7.11.1: and on a plan Moving once what is held was accepted — its page is what is held, never a move: answers/plan/move.js heldMode)
const onDrawing = (view) => !!view && !!view.life && (view.life.key === 'drawing' || (view.life.key === 'moving' && !!view.life.agreed));
export function stepNameOf(id, view) {
  if (id === 'plan' && view && view.locked) return PLAN.steps.plan.locked;
  if (id === 'move' && onDrawing(view)) return PLAN.steps.move.short;
  return PLAN.steps[id].label;
}

/**
 * The hand-over's action (research/v7/your-plan.md 5.2). A button that names a month to record (the month step's: the
 * earliest month not recorded, 2.3) carries it as `month`, so the planner opens Month by month on that month; every other
 * button carries none and the action is as it always was.
 */
export const changeAction = (planId, place, back, month = null) => ({ type: 'plan/change', planId, place, back, ...(typeof month === 'string' ? { month } : {}) });

/**
 * The buttons of a step. `onChange(place, planId, month)` leaves for the planner (the hand-over); a button with `href` is
 * a link inside V7. `windowPlans` adds the warning before leaving without an account.
 */
export function PlanButtons({ buttons, planId, stepId, onChange, readonly = false }) {
  if (!buttons || !buttons.length) return null;
  return (
    <div class="actions-row plan-actions">
      {buttons.map((b, i) => (b.href
        ? <LinkButton key={i} testid={`plan.${stepId}.${b.id}`} kind={b.primary ? 'primary' : undefined} href={b.href}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</LinkButton>
        : readonly ? null
          : <Button key={i} testid={`plan.${stepId}.${b.id}`} kind={b.quiet ? 'quiet' : 'plain'} onClick={() => onChange(b.place, b.planId || planId, b.month)}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</Button>))}
    </div>
  );
}
