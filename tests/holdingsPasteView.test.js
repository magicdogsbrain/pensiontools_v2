/**
 * The paste preview (src/ui/components/HoldingsPasteView.js): every line it could not recognise asks "What is
 * this?" in the preview itself, and the summary says what was left out and why (audit §2.9).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { parsePaste, matchRows, mergeLedger, categorise } from '../src/services/HoldingsPaste.js';
import { pastePreviewHtml } from '../src/ui/components/HoldingsPasteView.js';
import { parse } from '../src/ui/inlineHandlers.js';

const PASTE = `Investment,Units,Value
Vanguard FTSE All-World UCITS ETF,500,£52,600.00
Acme Workplace Growth Fund Series 4,12000,£120,000.00
Total,,£172,600.00`;

describe('pastePreviewHtml', () => {
  const parsed = parsePaste(PASTE);
  const matched = matchRows(parsed.rows, { orders: [], wrapper: 'SIPP' });
  const merged = mergeLedger([], matched, { wrapper: 'SIPP' });
  it('an unrecognised row gets the question with the five answers; a recognised row does not', () => {
    const html = pastePreviewHtml({ parsed, matched, merged, wrapper: 'SIPP', target: 'hold' });
    expect(html).toContain('data-on-change="setPasteCategory(1,this.value)"');
    expect(html).not.toContain('setPasteCategory(0,');
    expect(html).toContain('What is this?');
    expect(html).toContain('>Gold and trend<');
    expect(html).toContain('>Don&#39;t know<');
    expect(html).not.toContain('pick a category after applying');
    for (const m of html.matchAll(/data-on-(?:click|change|input)="([^"]*)"/g)) expect(() => parse(m[1])).not.toThrow();
  });
  it('the summary says what was read, what is unrecognised and what was left out', () => {
    const html = pastePreviewHtml({ parsed, matched, merged, wrapper: 'SIPP', target: 'hold' });
    expect(html).toContain('2 lines read, £172,600 in all.');
    expect(html).toContain('1 line (£120,000) is not recognised');
    expect(html).toContain('Left out: line 3 &quot;Total&quot; (a total line, not a holding).');
    expect(html).toContain('data-on-click="applyPasteHoldings()"');
    expect(html).toContain('Apply to what I hold');
  });
  it('an answered row shows the answer chosen and is no longer unrecognised', () => {
    const m2 = matched.slice(); m2[1] = categorise(m2[1], 'shares');
    const html = pastePreviewHtml({ parsed, matched: m2, merged: mergeLedger([], m2, { wrapper: 'SIPP' }), wrapper: 'SIPP', target: 'hold' });
    expect(html).toContain('<option value="shares" selected>');
    expect(html).not.toContain('is not recognised');
  });
  it('nothing usable: the warnings, and no Apply button', () => {
    const p = parsePaste('hello');
    const html = pastePreviewHtml({ parsed: p, matched: [], merged: mergeLedger([], [], {}), wrapper: 'SIPP', target: 'hold' });
    expect(html).toContain('Nothing recognisable was pasted');
    expect(html).not.toContain('applyPasteHoldings');
  });
});
