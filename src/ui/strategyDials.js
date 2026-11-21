/**
 * The dial boxes of two strategies in the full view's Stress settings (ladder and ratchet; floor and flex), filled from the
 * plan open now (lead4.md R2). Every box is first put back to the page's own starting value (an input's default value, a
 * select's default option), then given what this plan holds. A plan without a dial never keeps the plan before's figure in
 * its box: the page reads these boxes into the plan's strategy settings, so a figure left over would be written into this
 * plan with the next change.
 *
 *   DIAL_BOXES                              { strategyId: { boxId: key } }
 *   fillStrategyDials(doc, id, params)      the boxes of every strategy back to their start; then `id`'s from `params`
 *
 * A dial the plan holds as 0 or empty shows the page's start (the page reads an empty box as 0 or its default, so the two
 * mean the same). DOM access goes through `doc`.
 */
export const DIAL_BOXES = Object.freeze({
  'ladder-and-ratchet': Object.freeze({ lrLadderYears: 'ladderYears', lrDraw: 'drawAnnual', lrTriggerMode: 'triggerMode', lrBand: 'bandThreshold', stratSipp: 'sippTotal', stratIsa: 'isaTotal' }),
  'floor-and-flex': Object.freeze({ ffEssentials: 'essentialsAnnual', ffHorizon: 'horizonAge', ffRate: 'sleeveRate', ffRatchet: 'ratchet', stratSippFf: 'sippTotal', stratIsaFf: 'isaTotal' })
});

/** The box as the page opens with it. */
function toStart(el) {
  if (el.tagName === 'SELECT') {
    const opts = [...el.options];
    const d = opts.find((o) => o.defaultSelected) || opts[0];
    el.value = d ? d.value : '';
  } else el.value = el.defaultValue;
}

/** The box's value for a key the plan holds ('' / null / 0 hold nothing). */
function shown(key, v) {
  if (v == null || v === '' || v === 0 || v === false) return null;
  if (key === 'sleeveRate') return String(Math.round(+v * 100 * 1000) / 1000);   // stored as a fraction, shown as a percentage
  return String(v);
}

export function fillStrategyDials(doc, id, params) {
  const p = params || {};
  for (const [sid, boxes] of Object.entries(DIAL_BOXES)) {
    for (const [boxId, key] of Object.entries(boxes)) {
      const el = doc.getElementById(boxId);
      if (!el) continue;
      toStart(el);
      if (sid !== id) continue;
      const v = shown(key, p[key]);
      if (v != null) el.value = v;
    }
  }
}
