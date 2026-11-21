/**
 * A pot plan with totals only, Moving (7.12.0, the moving brief S4 and S1 case C): with nothing listed under What you hold,
 * the move never says "0% of the plan's mix held", never lists buys worked out against nothing, and never says "Short by";
 * it says the person has not listed what the pension holds and does not need to, and the plan's own pension, with where
 * that figure came from. The home's move tile and both views say the same.
 *
 * Fictional saver, corpus 05 (a locked pots-and-valves plan stopping in 2037), read on 1 June 2035, inside the move window,
 * with nothing listed. Its last pot record (September 2026) holds a pension of £319,800 and an ISA of £41,450: "Your plan has
 * £319,800 in your pension and £41,450 in your ISA (from your last record)."
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { sequence } from '../../../src/services/TransitionPlanner.js';
import { entryOf, stateWith, noon } from './_plans.js';

const TODAY = '2035-06-01';
const SAID = 'You have not listed what your pension holds, and you do not need to. Your plan has £319,800 in your pension and £41,450 in your ISA (from your last record, September 2026).';   // the record's month (step F5, R4)
function plan() {
  const raw = JSON.parse(readFileSync('tests/fixtures/plans/05-saver-committed.json', 'utf8'));
  raw.holdings = { version: 1, lines: [] };
  return entryOf(raw, TODAY).plan;
}
const textOfHtml = (html) => { const el = document.createElement('div'); el.innerHTML = html; return el.textContent.replace(/\s+/g, ' '); };

describe('a pot plan with nothing listed, Moving', () => {
  const p = plan();
  const V = moveOf([{ plan: p }], p.id, { today: TODAY });
  it('reads Moving with nothing listed: the plan\'s own pension, no buys, no shortfall', () => {
    expect(V.phase).toBe('moving');
    expect(V.status.id).toMatch(/^unlisted/);
    expect(V.totalsOnly).toBe(true);
    expect(V.buy).toEqual([]);
    expect(V.totals.short).toBe(null);
  });
  it('the simple page says it, and none of "0% of the plan’s mix held", "Short by", a buy list', () => {
    const root = document.createElement('div'); root.id = 'app';
    render(h(App, { state: stateWith([{ plan: p }], '#/plan/' + p.id + '/move', { today: TODAY }), dispatch: () => {} }), root);
    const t = visibleText(root).replace(/\s+/g, ' ');
    expect(t).toContain(SAID);
    expect(t).not.toContain('0% of the plan’s mix held');
    expect(t).not.toContain('Short by');
    expect(t).not.toMatch(/bring (shares|bonds|cash) up to/);
    expect(t).not.toMatch(/record what you hold first|What skipping it costs|What is not bought yet/);
  });
  it('the full view says it the same way', () => {
    const now = noon(TODAY);
    const mi = moveInputs(p, { now });
    const seq = sequence(mi.diff, { today: now, startYear: 2037, startMonth: '2038-02' });
    const t = textOfHtml(transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq, prog: mi.prog, holdings: p.holdings, held: transitionHeld(p, p.holdings, now) }));
    expect(t).toContain(SAID);
    expect(t).not.toMatch(/bring (shares|bonds|cash) up to/);
    expect(t).not.toMatch(/short by/i);
    expect(t).not.toContain('0% of the plan’s mix held');
    expect(t).not.toContain('Short by');
  });
  it('the home\'s move step says nothing of a share held', () => {
    const st = planPage([{ plan: p }], p.id, 'move', { today: TODAY }).steps.find((s) => s.id === 'move');
    expect(st.lines.map((l) => l.id)).not.toContain('move.held');
    expect(st.result.text).not.toMatch(/moves done|% of/);
    expect(st.toBuy).toBe(0);
  });
});

import { samMovePlan } from './_samMove.js';
describe('"Where you are" for a saver with no pot record', () => {
  it('nothing recorded and nothing listed: the plan\'s own pension, never "No pot recorded"', () => {
    // corpus 05 with its pot records taken away: the pension saved with what you pay in, £310,000; the ISA in the plan, £40,000
    const raw = JSON.parse(readFileSync('tests/fixtures/plans/05-saver-committed.json', 'utf8'));
    raw.holdings = { version: 1, lines: [] };
    raw.accumulationTool.history = [];
    const p = entryOf(raw, TODAY).plan;
    const W = planPage([{ plan: p }], p.id, 'where', { today: TODAY }).steps.find((s) => s.id === 'where');
    expect(W.result.text).toBe('You have not listed what your pension holds, and you do not need to. Your plan has £310,000 in your pension and £40,000 in your ISA (from your plan).');
  });
  it('what is held listed, but no saving path to set it against: the pension today, said as that', () => {
    // fictional Sam (tests/helpers/samMove.js): What you hold's pension lines, from its record of 1 November 2026
    const p = samMovePlan();
    const W = planPage([{ plan: p }], p.id, 'where', { today: '2026-11-16' }).steps.find((s) => s.id === 'where');
    expect(W.result.text).not.toMatch(/No pot recorded/);
  });
});
