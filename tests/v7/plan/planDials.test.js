/**
 * "Your plan", How the money is taken (7.12.0): each dial the plan keeps is said with its figure. Before, every dial line
 * printed its label and nothing after it ("Years held in cash: "), because the figure was filed under a dotted key the
 * screen reads as a path; and a dial with no plain name printed its key ("bucketBand:").
 *
 * Corpus plans (fictional). By hand, from the stored plan documents:
 *  - 03 (full gilt ladder): cashYears 2, isaTotal 35,000, sippTotal 640,000; nothing else.
 *  - 04 (buckets in order): bucketBand 10 (a percent).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { stateWith, entryOf, corpus } from './_plans.js';

const TODAY = '2026-11-16';
const wayText = (id) => {
  const p = entryOf(corpus()[id], TODAY).plan;
  const root = document.createElement('div'); root.id = 'app';
  render(h(App, { state: stateWith([{ plan: p }], '#/plan/' + p.id + '/plan', { today: TODAY }), dispatch: () => {} }), root);
  const sec = root.querySelector('[data-section="way"]');
  return visibleText(sec).replace(/\s+/g, ' ');
};

describe('Your plan says each dial with its figure', () => {
  it('a locked gilt ladder: the cash years and the pots it is built on', () => {
    const t = wayText('03-gilt-ladder-locked');
    expect(t).toContain('Years held in cash: 2');
    expect(t).toContain('ISA the plan is built on: £35,000');
    expect(t).toContain('Pension pot the plan is built on: £640,000');
  });

  it('buckets: the band, as a percent and by its name, never its key', () => {
    const t = wayText('04-buckets-running');
    expect(t).not.toContain('bucketBand');
    expect(t).toContain('How far above the path before the cash bucket refills: 10%');
  });

  it('no dial line is left without its figure', () => {
    for (const id of ['03-gilt-ladder-locked', '04-buckets-running', '13-stopped-drawing-since', '02-pnv-draft', '01-fresh-default']) {
      expect(wayText(id)).not.toMatch(/: (Fixed|Saved|$)/);
    }
  });
});
