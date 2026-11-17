/**
 * 7.12.0 round 3 (walker 7, decision 4) — nothing has to be answered for a holding to count. Alex pasted four company shares by
 * their codes (no type) and a plain £12 cash line; What you hold said "Everything here counts as yours" at the top, then
 * "Counted as: What is this?" on each share and "Not counted in the mix: ULVR, AZN, LGEN, NG., Cash" at the bottom, with the
 * mix worked on £365,556 against a £382,868 headline. Now a line nothing places counts as shares until the person says what it
 * is, a pension's cash line counts as cash, and the mix is on everything held. Fictional plan (_alexLiving.js); every figure is
 * the sum of the fixture's own lines.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { holdOf, countedAs } from '../../../src/answers/plan/hold.js';
import { proportions } from '../../../src/services/Holdings.js';
import { holdingsCardHtml } from '../../../src/ui/components/TransitionView.js';
import { stateWith } from './_plans.js';
import { L } from './_alex.js';
import { TODAY, alexLines, alexLivingRaw, living } from './_alexLiving.js';

const flat = (t) => t.replace(/\s+/g, ' ').trim();
// as a platform pastes them: the four companies by code with no type, and the cash as a plain line
const COMPANIES = ['ULVR', 'AZN', 'LGEN', 'NG.'];
const lines = alexLines().map((l) => (COMPANIES.includes(l.ticker) ? { ...l, subClass: null, kind: null } : l.ticker === 'XSTR' ? L({ name: 'Cash', value: 12, kind: 'cash' }) : l));
const plan = living(alexLivingRaw({ lines }));
const TOTAL = lines.reduce((s, l) => s + (l.value || 0), 0);
const SHARES = 4000 + 6000 + 3300 + 4000 + 6000;   // the four companies and the world fund

describe('Alex\'s What you hold: every line counts as it is', () => {
  it('a company\'s shares pasted by code count as shares, said so, with the choice to change it optional', () => {
    for (const code of COMPANIES) expect(countedAs(lines.find((l) => l.ticker === code))).toMatchObject({ bucket: 'shares', assumed: true });
    expect(countedAs(lines.find((l) => l.name === 'Cash'))).toMatchObject({ kind: 'cash', bucket: 'cash' });
  });

  it('the mix is on everything held: shares are the five share lines\' share of the total, and nothing is "not counted"', () => {
    const p = proportions(plan.holdings);
    expect(p.untagged).toEqual([]);
    expect(Math.round(p.total)).toBe(TOTAL);
    expect(Math.round(p.buckets.shares * 100)).toBe(Math.round(SHARES / TOTAL * 100));
  });

  it('the simple page says "Counted as: shares (you can change this)" and never "What is this?" or "Not counted in the mix"', () => {
    const root = document.createElement('div');
    render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id + '/hold', { today: TODAY }), dispatch: () => {} }), root);
    const t = flat(visibleText(root));
    const at = lines.findIndex((l) => l.ticker === 'ULVR');
    expect(flat(root.querySelector(`[data-testid="plan.hold.line.${at}.counted"]`).textContent)).toMatch(/^Counted as: shares \(you can change this\)/);
    expect(t).not.toContain('What is this?');
    expect(t).not.toContain('Not counted in the mix');
    expect(t).toContain(`on £${TOTAL.toLocaleString('en-GB')} across your accounts`);
    const v = holdOf([{ plan }], plan.id, { today: TODAY });
    expect(v.mix ? v.mix.untagged : []).toEqual([]);
  });

  it('the full view\'s What you hold names the line as shares, as counted, and asks nothing', () => {
    // as the tab draws it while living on the ladder (TransitionView.transitionHtml's `keep`)
    const html = holdingsCardHtml({ holdings: plan.holdings, keep: { held: true, at: new Set(), summary: null } });
    expect(html).toContain('Shares, as counted now');
    expect(html).not.toContain('>What is this?<');
    expect(html).not.toContain('left out of the mix figures');
  });
});

describe('the tax-years box is on gilts only (walker 7)', () => {
  it('a share or a fund has no "For which tax years?" box; an ordinary gilt has it', () => {
    const v = holdOf([{ plan }], plan.id, { today: TODAY });
    const all = v.groups.flatMap((g) => g.lines);
    for (const code of [...COMPANIES, 'VWRP']) expect(all.find((l) => l.ticker === code).forYears, code).toBe(undefined);
    expect(all.find((l) => l.ticker === 'TS27').forYears).toBeTruthy();
  });
});
