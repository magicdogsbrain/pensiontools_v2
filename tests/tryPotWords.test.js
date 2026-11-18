/**
 * "Try a strategy" for a plan still saving (the second walk, walker 8's fifth high finding and walker 3's medium one).
 * Fictional Sam, 61, saving £575 a month into £120,000, stops at 63. The line above the what-if says the runs start from
 * the pension when work stops (£142,720); the what-if's box said "SIPP / pension pot" and showed £120,000, so one page
 * gave two pots for one plan with nothing to say which is which. The box holds the pension today, because the runs grow
 * it to the stop (lastsRun.trySettingsOf scales today's pots; createSimulationConfigFromSettings grows them), so the box
 * says that, and names the pension when work stops beside it. A retired plan's box is unchanged.
 */
import { describe, it, expect } from 'vitest';
import { tryPotWordsOf, paintTryPotWords, tryFillKeyOf } from '../src/ui/tryBoxes.js';

// Sam: £120,000 today, split 60,000 / 48,000 / 12,000; the pension when work stops, worked out: £142,720 at 63
const SAM = { retired: false, retireAge: 63, shapeAgeNow: 63, equityMin: 60000, bondMin: 48000, cashTarget: 12000, isaBalance: 0,
  potAtRetirement: { sipp: 142720, isa: 0, source: 'worked', from: { pot: 120000, monthly: 575 } } };
// Kim: retired, £300,000 as typed
const KIM = { retired: true, shapeAgeNow: 66, equityMin: 150000, bondMin: 120000, cashTarget: 30000, isaBalance: 40000 };

describe('the what-if\'s pension box says which pension it is', () => {
  it('a plan still saving: the pension today, with the pension when work stops beside it', () => {
    const w = tryPotWordsOf(SAM);
    expect(w.label).toBe('Your pension today (£)');
    // by hand: 142,720 written with a comma; the stop at 63
    expect(w.hint).toBe('The runs grow it to £142,720 by 63, the pension when you stop in the line above. A figure typed here is tried as your pension today.');
  });
  it('a retired plan: the pot as it is, nothing beside it', () => {
    expect(tryPotWordsOf(KIM)).toEqual({ label: 'SIPP / pension pot (£)', hint: '' });
  });
  it('a plan still saving with no pension when work stops worked out: the pot as it is', () => {
    expect(tryPotWordsOf({ ...SAM, potAtRetirement: null })).toEqual({ label: 'SIPP / pension pot (£)', hint: '' });
  });
  it('drawn on the page: the label and one line under the box, again on another plan', () => {
    document.body.innerHTML = '<div class="form-group"><label id="tryPotLabel">SIPP / pension pot (£)</label><input type="number" id="tryPot"></div>';
    paintTryPotWords(document, SAM);
    expect(document.getElementById('tryPotLabel').textContent).toBe('Your pension today (£)');
    expect(document.getElementById('tryPotHint').textContent).toContain('£142,720 by 63');
    paintTryPotWords(document, KIM);
    expect(document.getElementById('tryPotLabel').textContent).toBe('SIPP / pension pot (£)');
    expect(document.getElementById('tryPotHint').textContent).toBe('');
    expect(document.querySelectorAll('#tryPotHint').length).toBe(1);
  });
  it('the boxes are filled again when the pension when work stops changes (a new stop age), unless a what-if was typed', () => {
    expect(tryFillKeyOf('Sam', SAM)).not.toBe(tryFillKeyOf('Sam', { ...SAM, retireAge: 62, shapeAgeNow: 62, potAtRetirement: { ...SAM.potAtRetirement, sipp: 131120 } }));
  });
});
