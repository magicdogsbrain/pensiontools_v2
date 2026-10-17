/**
 * The tax-year set-up, collapsed (research/v7/v6-usability-audit.md §2.7): it does not ask for tax bands the app
 * already knows (they are shown as "we assume … change"), "target salary" is "income before tax", the State Pension
 * line says the right thing when the pension is already in payment or the date is missing, and the questions sit on
 * as few screens as they allow — none lost.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
const stress = {
  currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, shapeAgeNow: 57,
  spStartDate: '21 April 2037', spWeeklyAmount: 230, baseSalary: 40000, duration: 35,
  targetSchedule: [40000, 40000, 40000], strategyId: 'pots-and-valves', strategyParams: {}
};
vi.mock('../src/storage/ScenarioRepository.js', async (orig) => ({ ...(await orig()), getActiveStressSettings: async () => stress }));
import { statePensionLine, wizardScreens, bandsAssumptionText } from '../src/services/TaxYearWizardService.js';
import { initTaxYearWizard } from '../src/ui/components/TaxYearSetupWizard.js';
import { parse } from '../src/ui/inlineHandlers.js';

describe('the State Pension line says the right thing', () => {
  it('nothing in the plan: says so, never "0 years until"', () => {
    const t = statePensionLine({ amount: 0, monthly: 0, yearsUntil: 0, isReceiving: false, startDate: null }, '2026-09');
    expect(t).toBe('Not in your plan yet — add your State Pension forecast under Settings if you have one.');
    expect(t).not.toMatch(/0 years/);
  });
  it('a date but no amount', () => {
    const t = statePensionLine({ amount: 0, yearsUntil: 10, isReceiving: false, startDate: '21 April 2037' }, '2026-09');
    expect(t).toBe('Starts 21 April 2037 — the amount is not in your plan yet; add your forecast under Settings.');
  });
  it('already in payment', () => {
    const t = statePensionLine({ amount: 11973, monthlyFull: 997.75, yearsUntil: 0, monthsUntil: 0, isReceiving: true, startYm: '2024-05', startDate: '21 May 2024' }, '2026-09');
    expect(t).toBe('In payment: £998 a month (£11,973 this tax year).');
  });
  it('starts later this tax year', () => {
    const t = statePensionLine({ amount: 4990, monthlyFull: 997.75, isReceiving: true, startYm: '2026-11', startDate: '21 November 2026' }, '2026-09');
    expect(t).toBe('Starts 21 November 2026: £998 a month (£4,990 this tax year).');
  });
  it('years away, with the months', () => {
    expect(statePensionLine({ amount: 11973, yearsUntil: 10, monthsUntil: 7, isReceiving: false, startDate: '21 April 2037' }, '2026-09')).toBe('Starts 21 April 2037 — 10 years 7 months away.');
    expect(statePensionLine({ amount: 11973, yearsUntil: 1, monthsUntil: 0, isReceiving: false, startDate: '21 April 2028' }, '2027-04')).toBe('Starts 21 April 2028 — 1 year away.');
    expect(statePensionLine({ amount: 11973, yearsUntil: 0, monthsUntil: 5, isReceiving: false, startDate: '21 April 2027' }, '2026-11')).toBe('Starts 21 April 2027 — 5 months away.');
  });
  it('the start month has passed but the year total is not yet counted: still "in payment", never 0 years', () => {
    const t = statePensionLine({ amount: 11973, monthlyFull: 997.75, yearsUntil: 0, monthsUntil: 0, isReceiving: false, startYm: '2026-05', startDate: '21 May 2026' }, '2026-09');
    expect(t).not.toMatch(/0 years/);
    expect(t).toMatch(/In payment/);
  });
});

describe('the screens', () => {
  it('three screens, April or mid-year: this year, the tax-free top-up, confirm', () => {
    expect(wizardScreens({ isApril: true }).map((s) => s.key)).toEqual(['this-year', 'top-up', 'confirm']);
    expect(wizardScreens({ isApril: false }).map((s) => s.key)).toEqual(['this-year', 'top-up', 'confirm']);
  });
  it('the bands read as an assumption, in pounds', () => {
    expect(bandsAssumptionText({ pa: 12570, brl: 50270, hrl: 125140 })).toBe('We assume a tax-free allowance of £12,570, 20% tax up to £50,270 of taxable income and 45% above £125,140.');
  });
});

describe('the wizard on screen (jsdom)', () => {
  let box;
  beforeEach(() => { document.body.innerHTML = '<div id="w"></div>'; box = document.getElementById('w'); });
  const handlers = () => [...box.innerHTML.matchAll(/data-on-(?:click|change|input)="([^"]*)"/g)].map((m) => m[1]);
  const click = (action) => box.querySelector('[data-action="' + action + '"]').click();

  it('mid-year: one screen holds income so far, last year\'s CPI, income before tax, other income and the State Pension; the bands are an assumption you can change', async () => {
    await initTaxYearWizard(box, '2026-09', () => {});
    const html = box.innerHTML;
    expect(box.querySelectorAll('.wizard-dot').length).toBe(3);
    for (const id of ['wizIncomeToDate', 'wizTaxPaidToDate', 'wizCPI', 'wizSalary', 'wizOther', 'wizCgtUsed', 'wizPA', 'wizBRL', 'wizHRL']) expect(box.querySelector('#' + id), id).not.toBeNull();
    expect(html).toContain('Income before tax');
    expect(html).not.toMatch(/target salary/i);
    expect(html).toContain('We assume a tax-free allowance of £12,570');
    expect(html).toContain('<summary');   // the bands sit behind "change"
    expect(html).toMatch(/[Cc]hange/);
    expect(box.querySelector('#wizPA').value).toBe('12570');
    expect(html).toContain('State Pension');
    expect(html).not.toMatch(/0 years until/);
    for (const e of handlers()) expect(() => parse(e)).not.toThrow();
  });
  it('April: the same screen without the income-so-far boxes', async () => {
    await initTaxYearWizard(box, '2027-04', () => {});
    expect(box.querySelector('#wizIncomeToDate')).toBeNull();
    expect(box.querySelector('#wizSalary')).not.toBeNull();
    expect(box.querySelector('#wizPA')).not.toBeNull();
  });
  it('the words carry no jargon the audit flagged', async () => {
    await initTaxYearWizard(box, '2026-09', () => {});
    const seen = [box.innerHTML];
    click('next'); seen.push(box.innerHTML);
    for (const h of seen) { expect(h).not.toMatch(/\bBRL\b/); expect(h).not.toMatch(/\bUFPLS\b/); expect(h).not.toMatch(/target salary/i); }
  });
  it('screen 2: an income within the 20% band needs no top-up, and Next goes straight to confirm', async () => {
    await initTaxYearWizard(box, '2027-04', () => {});
    box.querySelector('#wizSalary').value = '40000';
    click('next');
    expect(box.innerHTML).toContain('No tax-free top-up is needed');
    expect(box.querySelector('#wizISA')).not.toBeNull();
    click('next');
    expect(box.innerHTML).toContain('Confirm');
    expect(box.innerHTML).toContain('Income before tax');
    expect(box.innerHTML).toContain('£40,000');
  });
  it('screen 2: an income above the band shows the top-up needed; typing less than that shows the choice on the same screen', async () => {
    await initTaxYearWizard(box, '2027-04', () => {});
    box.querySelector('#wizSalary').value = '70000';
    click('next');
    expect(box.innerHTML).toMatch(/you need about £[\d,]+ from your ISA or savings/);
    const isa = box.querySelector('#wizISA');
    expect(box.querySelector('input[name="taxChoice"]')).toBeNull();   // enough is pre-filled: no choice to make
    isa.value = '1000'; isa.dispatchEvent(new Event('input', { bubbles: true }));
    expect(box.querySelectorAll('input[name="taxChoice"]').length).toBe(3);
    expect(box.innerHTML).toContain('Take the full £70,000 from the pension and pay 40% tax on the part above the band');
    box.querySelector('input[name="taxChoice"][value="reduced"]').checked = true;
    click('next');
    expect(box.innerHTML).toContain('Confirm');
    expect(box.innerHTML).toContain('£50,270');
  });
  it('screen 2: short and nothing chosen: it asks before going on', async () => {
    await initTaxYearWizard(box, '2027-04', () => {});
    box.querySelector('#wizSalary').value = '70000';
    click('next');
    const isa = box.querySelector('#wizISA'); isa.value = '0'; isa.dispatchEvent(new Event('input', { bubbles: true }));
    click('next');
    expect(box.innerHTML).toContain('Choose one of the three');
    expect(box.querySelector('#wizISA')).not.toBeNull();
  });
  it('Back from confirm returns to the top-up, and from there to the first screen with the answers kept', async () => {
    await initTaxYearWizard(box, '2026-09', () => {});
    box.querySelector('#wizIncomeToDate').value = '18000';
    box.querySelector('#wizSalary').value = '40000';
    click('next'); click('next');
    expect(box.innerHTML).toContain('Confirm');
    click('back'); expect(box.querySelector('#wizISA')).not.toBeNull();
    click('back'); expect(box.querySelector('#wizIncomeToDate').value).toBe('18000');
    expect(box.querySelector('#wizSalary').value).toBe('40000');
  });
  it('Cancel tells the caller', async () => {
    const cb = vi.fn();
    await initTaxYearWizard(box, '2026-09', cb);
    click('cancel');
    expect(cb).toHaveBeenCalledWith({ completed: false, cancelled: true });
  });
});
