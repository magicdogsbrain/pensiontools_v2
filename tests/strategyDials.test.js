/**
 * The Strategies page's dials in the full view's Stress settings (src/ui/strategyDials.js, lead4.md R2): every dial box
 * shows what the plan open now holds, or the page's own starting value when it holds none: never the plan before's.
 * (Check round 2: a plan without ladder-and-ratchet or floor-and-flex dials kept the previous plan's draw, ladder years,
 * essentials and horizon, and the next dial changed wrote them into this plan.)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { fillStrategyDials, DIAL_BOXES } from '../src/ui/strategyDials.js';

const PAGE = '<input type="number" id="lrLadderYears" value="15"><input type="number" id="lrDraw">'
  + '<select id="lrTriggerMode"><option value="band" selected>Band</option><option value="calendar">Calendar</option></select>'
  + '<input type="number" id="lrBand" value="1.2"><input type="number" id="stratSipp"><input type="number" id="stratIsa">'
  + '<input type="number" id="ffEssentials"><select id="ffHorizon"><option value="92" selected>92</option><option value="95">95</option><option value="100">100</option></select>'
  + '<input type="number" id="ffRate" value="4"><select id="ffRatchet"><option value="off" selected>Off</option><option value="extend">Extend</option><option value="raise">Raise</option></select>'
  + '<input type="number" id="stratSippFf"><input type="number" id="stratIsaFf">';
const v = (id) => document.getElementById(id).value;

describe('fillStrategyDials', () => {
  beforeEach(() => { document.body.innerHTML = PAGE; });

  it('fills a ladder-and-ratchet plan\'s dials from the plan', () => {
    fillStrategyDials(document, 'ladder-and-ratchet', { ladderYears: 12, drawAnnual: 30000, triggerMode: 'calendar', bandThreshold: 1.3, sippTotal: 400000, isaTotal: 50000 });
    expect([v('lrLadderYears'), v('lrDraw'), v('lrTriggerMode'), v('lrBand'), v('stratSipp'), v('stratIsa')]).toEqual(['12', '30000', 'calendar', '1.3', '400000', '50000']);
  });

  it('a plan with none of the dials after one that had them: every box back to the page\'s own value', () => {
    fillStrategyDials(document, 'ladder-and-ratchet', { ladderYears: 12, drawAnnual: 30000, triggerMode: 'calendar', bandThreshold: 1.3, sippTotal: 400000 });
    fillStrategyDials(document, 'ladder-and-ratchet', {});
    expect([v('lrLadderYears'), v('lrDraw'), v('lrTriggerMode'), v('lrBand'), v('stratSipp'), v('stratIsa')]).toEqual(['15', '', 'band', '1.2', '', '']);
    fillStrategyDials(document, 'floor-and-flex', { essentialsAnnual: 20000, horizonAge: 95, sleeveRate: 0.045, ratchet: 'raise', sippTotal: 300000 });
    expect([v('ffEssentials'), v('ffHorizon'), v('ffRate'), v('ffRatchet'), v('stratSippFf')]).toEqual(['20000', '95', '4.5', 'raise', '300000']);
    fillStrategyDials(document, 'floor-and-flex', null);
    expect([v('ffEssentials'), v('ffHorizon'), v('ffRate'), v('ffRatchet'), v('stratSippFf'), v('stratIsaFf')]).toEqual(['', '92', '4', 'off', '', '']);
  });

  it('another strategy: no dial of these two keeps a figure', () => {
    fillStrategyDials(document, 'floor-and-flex', { essentialsAnnual: 20000, horizonAge: 100 });
    fillStrategyDials(document, 'ladder-and-ratchet', { drawAnnual: 30000 });
    fillStrategyDials(document, 'pots-and-valves', { drawAnnual: 30000, essentialsAnnual: 20000 });
    for (const boxes of Object.values(DIAL_BOXES)) for (const id of Object.keys(boxes)) {
      const el = document.getElementById(id);
      const start = el.tagName === 'SELECT' ? [...el.options].find((o) => o.defaultSelected).value : el.defaultValue;
      expect([id, el.value]).toEqual([id, start]);
    }
  });
});
