/**
 * "If one of you dies first": what the check says about tax on an inherited pension (the second walk, walker 8's medium
 * finding). The default case is a death at 76, and the note said "Simplifications: pensions inherited free of tax (death
 * before 75)". That is not what the check does: the pension inherited is a windfall in a pension wrapper
 * (HouseholdService.survivorSettingsFor), which lands in the survivor's own pension pots (TaxableSleeve.routeWindfall:
 * toSipp; SimulationEngine adds it to the pots), and every pound drawn from those pots is taxed as the survivor's own is.
 * So the words say that, and what the law does on either side of 75. Both views say it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { survivorSettingsFor } from '../src/services/HouseholdService.js';
import { routeWindfall } from '../src/services/TaxableSleeve.js';
import { HOUSEHOLD } from '../src/v7/copy/household.js';

describe('the inherited pension, as the check counts it and as it says it', () => {
  it('the check: a pension windfall that lands in the survivor\'s own pension (taxed as drawn)', () => {
    const sv = { duration: 30, baseSalary: 20000, incomeSteps: [], windfalls: [] };
    const dc = { duration: 30, baseSalary: 20000, incomeSteps: [] };
    const out = survivorSettingsFor({ survivorSettings: sv, deceasedSettings: dc, survivorYear: 10, offsets: { survivor: 0, deceased: 0 }, spendFraction: 0.7, dbSurvivorPct: 0, inherit: { pension: 300000, isa: 0 } });
    const w = out.windfalls.find((x) => x.label === 'Inherited pension');
    expect(w).toMatchObject({ amount: 300000, wrapper: 'pension', year: 10 });
    expect(routeWindfall(w)).toMatchObject({ toSipp: 300000, toIsa: 0, toGia: 0 });
  });
  it('the words: added to the survivor\'s pension and taxed as it is drawn, never "inherited free of tax" as what the check does', () => {
    const s = HOUSEHOLD.survivor;
    expect(s.note).not.toMatch(/inherited free of tax/);
    expect(s.note).toContain('the pension inherited is added to {survivor}’s pension and taxed with it as it is drawn');
    expect(s.note).toContain('after a death before 75 the law takes no tax from it; after 75 all of it is taxed');
    expect(s.lead).not.toMatch(/free of tax before 75/);
    const view = readFileSync(resolve(__dirname, '..', 'src', 'ui', 'householdView.js'), 'utf8');
    expect(view).not.toMatch(/pensions pass tax-free before 75/);
  });
});
