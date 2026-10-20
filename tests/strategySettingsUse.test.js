/**
 * The seven "bought" strategies no longer hide the settings their engines still use (v6 usability audit, problem 4,
 * 17 Oct 2026): the plan's length, charges, how the ISA grows, the taxable account, earnings and bed-and-ISA stay in
 * view for every strategy; only the Pots & Valves machinery (marked data-pnv-only) is hidden. A setting a way of
 * drawing really ignores says "Not used by this way of drawing".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { BOUGHT_STRATEGIES, isBoughtStrategy, pnvOnlySections, SHARED_SETTINGS, settingUseNote, paintSettingUseNotes, heldIsaNote } from '../src/ui/strategySettingsUse.js';
import { STRATEGY_IDS, listStrategies } from '../src/strategies/registry.js';

const html = readFileSync('index.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const doc = new JSDOM(html).window.document;

describe('which strategies hide the Pots & Valves machinery', () => {
  it('the seven bought ones; Pots & Valves and Buckets in order keep it', () => {
    expect(BOUGHT_STRATEGIES.length).toBe(7);
    expect(listStrategies().filter((s) => isBoughtStrategy(s.id)).length).toBe(7);
    expect(isBoughtStrategy(STRATEGY_IDS.POTS_AND_VALVES)).toBe(false);
    expect(isBoughtStrategy(STRATEGY_IDS.BUCKETS_IN_ORDER)).toBe(false);
    expect(isBoughtStrategy(STRATEGY_IDS.FULL_IL_GILT)).toBe(true);
  });
});

describe('the Stress settings markup', () => {
  const hidden = pnvOnlySections(doc);
  const inHidden = (id) => { const el = doc.getElementById(id); expect(el, id).not.toBeNull(); return hidden.some((sec) => sec.contains(el)); };
  it('the six shared settings sit OUTSIDE every data-pnv-only part', () => {
    for (const id of ['ssDuration', 'ssChargesPct', 'ssIsaGrowthCash', 'ssIsaGrowthInvested', 'ssTaxableStart', 'ssTaxableMix', 'ssGiaTaxBand', 'ssRelevantEarnings', 'ssBedAndIsa']) {
      expect(inHidden(id), id + ' must show for every strategy').toBe(false);
    }
  });
  it('the Pots & Valves machinery is inside one: the risk/funds switch, the pot boxes, the risk level, diversifiers, the funds list, the bond tent, protection, the reserve, how the pension is accessed', () => {
    for (const id of ['ssModeRisk', 'ssPot', 'ssIsaBalance', 'ssIsaPolicy', 'ssRisks', 'ssDiversifiers', 'ssFundRows', 'ssEquityGlide', 'ssRecoveryBuffer', 'ssHodlEnabled', 'ssAccessMethod']) {
      expect(inHidden(id), id + ' is Pots & Valves machinery').toBe(true);
    }
  });
  it('the taxable account is outside the risk / funds switch too (fund-list mode used to hide it)', () => {
    expect(doc.querySelector('#ssRiskMode #ssTaxableStart')).toBeNull();
    expect(doc.querySelector('#ssFundsMode #ssTaxableStart')).toBeNull();
    expect(doc.querySelector('#ssTaxableBlock #ssTaxableStart')).not.toBeNull();
  });
  it('each shared setting has a place for its note', () => {
    for (const id of Object.values(SHARED_SETTINGS)) expect(doc.getElementById(id), id).not.toBeNull();
  });
});

describe('the notes beside the shared settings', () => {
  it('Pots & Valves and Buckets: every shared setting is used, no notes', () => {
    for (const id of [STRATEGY_IDS.POTS_AND_VALVES, STRATEGY_IDS.BUCKETS_IN_ORDER]) for (const key of Object.keys(SHARED_SETTINGS)) expect(settingUseNote(id, key), id + '.' + key).toBe('');
  });
  it('a bought strategy: length, charges and the taxable account are used; earnings/bed-and-ISA are not; the ISA growth only until the stop', () => {
    for (const id of BOUGHT_STRATEGIES) {
      expect(settingUseNote(id, 'duration')).toBe('');
      expect(settingUseNote(id, 'charges')).toBe('');
      expect(settingUseNote(id, 'taxable')).toBe('');
      expect(settingUseNote(id, 'gia')).toMatch(/^Not used by this way of drawing/);
      expect(settingUseNote(id, 'isaGrowth')).toMatch(/^Not used by this way of drawing once it is running/);
      expect(settingUseNote(id, 'isaGrowth')).toContain('Until the day you stop, it still sets how your ISA grows');
    }
  });
  it('a held ISA: a bought strategy leaves it out, untouched — never "spends the ISA"; Pots & Valves draws it last (sweep 20 Oct 2026)', () => {
    for (const id of BOUGHT_STRATEGIES) {
      expect(settingUseNote(id, 'isaGrowth', { isaHold: true })).toContain('leaves the held ISA out');
      expect(settingUseNote(id, 'isaGrowth', { isaHold: true })).not.toContain('spends the ISA');
      expect(heldIsaNote(id)).toMatch(/leaves a held ISA out/);
    }
    expect(settingUseNote(STRATEGY_IDS.POTS_AND_VALVES, 'isaGrowth', { isaHold: true })).toBe('');
    expect(heldIsaNote(STRATEGY_IDS.POTS_AND_VALVES)).toMatch(/only used once the SIPP and the taxable account have both run out/);
    expect(heldIsaNote(STRATEGY_IDS.BUCKETS_IN_ORDER)).toMatch(/only used once/);
  });
  it('paints them into the form and hides the empty ones', () => {
    const d = new JSDOM(Object.values(SHARED_SETTINGS).map((id) => '<p id="' + id + '"></p>').join('')).window.document;
    const out = paintSettingUseNotes(d, STRATEGY_IDS.FULL_IL_GILT);
    expect(out.gia).toMatch(/^Not used/);
    expect(d.getElementById('ssUseGia').textContent).toBe(out.gia);
    expect(d.getElementById('ssUseGia').style.display).toBe('');
    expect(d.getElementById('ssUseDuration').textContent).toBe('');
    expect(d.getElementById('ssUseDuration').style.display).toBe('none');
    paintSettingUseNotes(d, STRATEGY_IDS.POTS_AND_VALVES);
    expect(d.getElementById('ssUseGia').style.display).toBe('none');
  });
});

describe('index.html: pickStrategy hides only the marked parts and paints the notes', () => {
  const src = readFileSync('index.html', 'utf8');
  it('uses the module, not the old anchor list', () => {
    expect(src).toContain("for (const sec of pnvOnlySections(document)) sec.style.display = isLadder ? 'none' : ''; paintSettingUseNotes(document, id); if (typeof window.syncIsaHoldUI === 'function') window.syncIsaHoldUI('ss');");
    expect(src).not.toContain("const anchors = ['ssModeRisk', 'ssRecoveryBuffer', 'ssHodlEnabled', 'ssAccessMethod'];");
  });
});
