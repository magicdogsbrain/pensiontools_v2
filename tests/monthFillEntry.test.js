/**
 * The entry form's side of "why Save is off", a failed Calculate kept on the page, and the missed months filled in
 * (decided 3 November 2026; src/ui/monthFillEntry.js), driven whole in jsdom with the form's own elements and every
 * collaborator faked: the writes go through the one `save` in date order, the missed months first and marked, then this
 * month worked out again; the fill stops at a tax year not set up and this month is then not recorded; the batch is as
 * it was; a failed write puts Save back on. The "Start from" chooser widens the offer to every month with no record from
 * the month chosen, so a person who started recording part-way through a tax year can fill in the months before their
 * first record; when the default offers nothing, a quiet line opens it (never a ready tick). A month before its tax
 * year's set-up is recorded with its share of what that set-up was given as received (MonthFill.setUpShareDecision).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMonthEntry, IDS } from '../src/ui/monthFillEntry.js';
import { FILL_HELP, MORE_WORDS, setUpWords, setUpShares } from '../src/services/MonthFill.js';
import { readFileSync } from 'node:fs';

const tick0 = () => new Promise((r) => setTimeout(r, 0));   // the module reads the offer and the line again after the page's own handlers

const NOW = '2026-09-30T08:00:00.000Z';
const ym = (y, m) => y + '-' + String(m).padStart(2, '0');
const addMonths = (s, k) => { const [y, m] = s.split('-').map(Number); const d = new Date(Date.UTC(y, m - 1 + k, 1)); return ym(d.getUTCFullYear(), d.getUTCMonth() + 1); };
const taxYearOf = (s) => { const [y, m] = s.split('-').map(Number); const t = m >= 4 ? y : y - 1; return String(t % 100).padStart(2, '0') + '/' + String((t + 1) % 100).padStart(2, '0'); };

function mount(month = '2026-09') {
  document.body.innerHTML = '<form id="decisionForm">'
    + '<input type="month" id="entryMonth" value="' + month + '"><input type="checkbox" id="entryPaidThisMonth">'
    + '<select id="entryCadence"><option value="monthly">m</option><option value="quarterly">q</option></select>'
    + '<input type="number" id="entryIsa" value="">'
    + '<div id="monthFillBox" style="display:none"><label><input type="checkbox" id="monthFillTick"> <span id="monthFillLabel"></span></label>'
    + '<button type="button" id="monthFillMore" style="display:none">' + MORE_WORDS + '</button>'
    + '<div id="monthFillFromRow" style="display:none"><label for="monthFillFrom">Start from</label><select id="monthFillFrom"></select></div><p id="monthFillHelp"></p></div>'
    + '<button type="submit">Calculate</button>'
    + '<button type="button" id="saveBtn" disabled><span class="btn-text">Save to History</span><span class="btn-spinner"><span id="saveBtnProgress">Saving...</span></span></button>'
    + '<p id="saveStateNote"></p></form><div id="decisionOutput"></div>';
}
const $ = (id) => document.getElementById(id);
const input = (id, value) => { const e = $(id); if (value !== undefined) e.value = value; e.dispatchEvent(new Event('input', { bubbles: true })); };

/** The module with every collaborator faked; `calc` notes which records each month saw, `save` records the writes in order. */
function harness(o = {}) {
  const history = (o.history || ['2026-04', '2026-05', '2026-06']).map((date) => ({ date }));
  const writes = [], toasts = [], calcs = [], panels = [], progress = [];
  const notSetUp = new Set(o.notSetUp || []);
  const entry = createMonthEntry({
    doc: document,
    getHistory: async () => history.slice().reverse(),   // newest first: the order must not matter
    ...(o.taxYears ? { getTaxYears: async () => o.taxYears } : {}),
    calc: async (date, equity, bond, cash) => {
      calcs.push({ date, saw: history.map((h) => h.date) });
      if (o.calcFails && o.calcFails(date, calcs.length)) throw new Error('the calculation failed');
      return { date, equity, bond, cash, taxYear: taxYearOf(date), sippDraw: 2600, cadenceMonths: o.cadence || 1, ...(o.calcExtra ? o.calcExtra(date, calcs.length) : {}) };
    },
    save: async (d) => { progress.push($(IDS.progress).textContent); if (o.failOn === d.date) throw new Error('the write failed'); writes.push(d); history.push({ date: d.date }); history.sort((a, b) => a.date.localeCompare(b.date)); },
    wizardNeeded: async (date) => ({ showWizard: notSetUp.has(date) }),
    renderPanel: (d) => panels.push(d.date),
    showToast: (m, t) => toasts.push([m, t]),
    addMonths, taxYearOf,
    now: () => NOW
  });
  return { entry, writes, toasts, calcs, panels, progress, history };
}
const decision = (date, extra = {}) => ({ date, taxYear: taxYearOf(date), equity: 368100, bond: 150400, cash: 55100, entered: { mode: 'platform' }, sippDraw: 2600, ...extra });

beforeEach(() => mount());

describe('why Save is off: the line and the button, state by state', () => {
  it('on only after a Calculate; the line names the month in the box', () => {
    const { entry } = harness();
    entry.setState('none');
    expect($(IDS.note).textContent).toBe('Press Calculate to work out September 2026.');
    expect($(IDS.save).disabled).toBe(true);
    entry.calculated('2026-09');
    expect($(IDS.note).textContent).toBe('');
    expect($(IDS.save).disabled).toBe(false);
    expect(entry.state()).toBe('calculated');
    entry.setState('changed');
    expect($(IDS.note).textContent).toBe('Changed since the last calculation: press Calculate again.');
    expect($(IDS.save).disabled).toBe(true);
    entry.setState('saved', { month: '2026-09', filled: ['2026-07', '2026-08'] });
    expect($(IDS.note).textContent).toBe('September 2026 saved, with July 2026 and August 2026 filled in. To record another month, change the month and press Calculate.');
    expect($(IDS.save).disabled).toBe(true);
  });
  it('a change after the calculation turns Save off and says why; the cadence picker and the fill tick do not', () => {
    const { entry } = harness();
    entry.watchForm();
    entry.calculated('2026-09');
    input('entryCadence', 'quarterly');
    expect(entry.state()).toBe('calculated');
    input('monthFillTick');
    expect(entry.state()).toBe('calculated');
    input('entryIsa', '1000');
    expect(entry.state()).toBe('changed');
    expect($(IDS.save).disabled).toBe(true);
    expect($(IDS.note).textContent).toBe('Changed since the last calculation: press Calculate again.');
    // before anything is calculated a change says nothing new
    entry.setState('none');
    input('entryIsa', '2000');
    expect(entry.state()).toBe('none');
  });
  it('before anything is calculated the line follows the month in the box, however it is moved; a change event counts as much as an input', async () => {
    const { entry } = harness();
    entry.watchForm();
    entry.setState('none');
    input('entryMonth', '2026-10');
    await tick0();
    expect($(IDS.note).textContent).toBe('Press Calculate to work out October 2026.');
    // the Tax Years page's "Set up" sets the month with an input event that does not bubble
    $(IDS.month).value = '2027-04';
    $(IDS.month).dispatchEvent(new Event('input'));
    await tick0();
    expect($(IDS.note).textContent).toBe('Press Calculate to work out April 2027.');
    // after a calculation, a change event alone (a box left after typing) turns Save off too
    entry.calculated('2027-04');
    $(IDS.month).dispatchEvent(new Event('change', { bubbles: true }));
    expect(entry.state()).toBe('changed');
    expect($(IDS.save).disabled).toBe(true);
  });
  it('"This month\'s payment has already been made" moves the month on in its own handler, after the form\'s: the offer and the line are read once it has', async () => {
    const h = harness();
    h.entry.watchForm();
    h.entry.setState('none');
    await h.entry.refreshOffer();
    expect($(IDS.label).textContent).toBe('Fill in 2 months you did not record, July 2026 and August 2026, with these figures');
    // the page's handler runs on the document, after the form's listeners: here it moves the month on as togglePaidThisMonth does
    const move = (e) => { if (e.target.id === 'entryPaidThisMonth') $(IDS.month).value = '2026-10'; };
    document.addEventListener('change', move);
    $('entryPaidThisMonth').checked = true;
    $('entryPaidThisMonth').dispatchEvent(new Event('input', { bubbles: true }));
    $('entryPaidThisMonth').dispatchEvent(new Event('change', { bubbles: true }));
    document.removeEventListener('change', move);
    await tick0(); await tick0();
    expect($(IDS.label).textContent).toBe('Fill in 3 months you did not record, July 2026 to September 2026, with these figures');
    expect($(IDS.note).textContent).toBe('Press Calculate to work out October 2026.');
  });
  it('a failed Calculate: the engine\'s own words in the panel, escaped, Save off, the line says where to look', () => {
    const { entry } = harness();
    entry.calculated('2026-10');
    entry.failed('2026-10', new Error('A fund value cannot be negative — enter what each pot actually holds (£0 if empty). <b>'));
    const alert = $(IDS.error);
    expect(alert).not.toBeNull();
    expect(alert.className).toBe('alert alert-danger');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.textContent).toBe('October 2026 could not be worked out. A fund value cannot be negative — enter what each pot actually holds (£0 if empty). <b>');
    expect(alert.querySelector('b')).toBeNull();
    expect($(IDS.save).disabled).toBe(true);
    expect($(IDS.note).textContent).toBe('October 2026 could not be worked out — see the message in the panel. Put it right and press Calculate again.');
    entry.showError('2026-10', 'a bare string');
    expect($(IDS.error).textContent).toContain('a bare string');
  });
});

describe('the offer to fill in the missed months', () => {
  it('shown with its words and help when there is a gap; hidden when there is none; the tick comes off when the months change', async () => {
    const { entry } = harness();
    entry.watchForm();
    const offer = await entry.refreshOffer();
    expect(offer.months).toEqual(['2026-07', '2026-08']);
    expect($(IDS.box).style.display).toBe('');
    expect($(IDS.label).textContent).toBe('Fill in 2 months you did not record, July 2026 and August 2026, with these figures');
    expect($(IDS.help).textContent).toBe(FILL_HELP);
    $(IDS.tick).checked = true;
    await entry.refreshOffer();   // the same months: the tick stays
    expect($(IDS.tick).checked).toBe(true);
    $(IDS.month).value = '2026-10';
    await entry.refreshOffer();   // one more month: the tick comes off
    expect($(IDS.label).textContent).toBe('Fill in 3 months you did not record, July 2026 to September 2026, with these figures');
    expect($(IDS.tick).checked).toBe(false);
    $(IDS.month).value = '2026-07';
    await entry.refreshOffer();
    expect($(IDS.box).style.display).toBe('none');
    expect($(IDS.label).textContent).toBe('');
    expect(entry.offer()).toBe(null);
  });
  it('a month before its tax year\'s set-up takes its share of what that set-up was given as received, and the help says so beforehand; the tick comes off when which months take a share changes, though the months do not', async () => {
    // records to February 2026; tax year 26/27 set up from April, then again from June with what was received before it (fictional figures)
    const taxYears = { '25/26': { yearSetupComplete: true, startMonth: 4 }, '26/27': { yearSetupComplete: true, startMonth: 4 } };
    const taxYearOf = (s) => (s < '2026-04' ? '25/26' : '26/27');
    const history = [{ date: '2026-01' }, { date: '2026-02' }];
    mount('2026-09');
    const entry = createMonthEntry({ doc: document, getHistory: async () => history, getTaxYears: async () => taxYears, taxYearOf });
    const six = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'];
    expect((await entry.refreshOffer()).months).toEqual(six);
    expect($(IDS.help).textContent).toBe(FILL_HELP);
    $(IDS.tick).checked = true;
    taxYears['26/27'] = { yearSetupComplete: true, startMonth: 6, remainingMonths: 10, grossIncomeToDate: 5000, taxPaidToDate: 400 };
    const offer = await entry.refreshOffer();
    expect(offer.months).toEqual(six);
    expect(Object.keys(offer.shares)).toEqual(['2026-04', '2026-05']);
    expect($(IDS.label).textContent).toBe('Fill in 6 months you did not record, March 2026 to August 2026, with these pension figures');
    expect($(IDS.help).textContent).toBe('You set up 2026/27 from June 2026 and entered £5,000 of income received before then, with £400 of tax on it. That is spread evenly over April 2026 and May 2026 (£2,500 a month before tax, £200 of tax), and ticked, they are recorded as drawn from your pension, so the year\'s totals stay the same; the months from June 2026 on are worked out exactly as before. Only tick this if that money was pension you drew: if it was pay or other income, leave those months unrecorded. ' + FILL_HELP);
    expect($(IDS.tick).checked).toBe(false);
    // tax years that cannot be read: every missed month, worked out afresh
    const e2 = createMonthEntry({ doc: document, getHistory: async () => history, getTaxYears: async () => { throw new Error('no'); }, taxYearOf });
    const o2 = await e2.refreshOffer();
    expect(o2.months).toEqual(six);
    expect(o2.shares).toEqual({});
  });
  it('a Calculate reads the offer again (the tax year it set up may put months before its set-up)', async () => {
    const taxYears = { '26/27': { yearSetupComplete: true, startMonth: 4 } };
    const entry = createMonthEntry({ doc: document, getHistory: async () => [{ date: '2026-04' }], getTaxYears: async () => taxYears, taxYearOf: () => '26/27' });
    await entry.refreshOffer();
    expect(entry.offer().months).toEqual(['2026-05', '2026-06', '2026-07', '2026-08']);
    expect(entry.offer().shares).toEqual({});
    taxYears['26/27'] = { yearSetupComplete: true, startMonth: 7, remainingMonths: 9, grossIncomeToDate: 6000, taxPaidToDate: 0 };
    entry.calculated('2026-09');
    await tick0();
    expect(entry.offer().months).toEqual(['2026-05', '2026-06', '2026-07', '2026-08']);
    expect(entry.offer().shares).toEqual({ '2026-05': { gross: 2000, tax: 0, taxToDate: 0 }, '2026-06': { gross: 2000, tax: 0, taxToDate: 0 } });
  });
  it('two reads at once (the month box sends input and change together): the later month is the one drawn, whichever answers first', async () => {
    let release;
    const slow = new Promise((r) => { release = r; });
    let calls = 0;
    const entry = createMonthEntry({ doc: document, getHistory: async () => { calls++; if (calls === 1) await slow; return [{ date: '2026-06' }]; } });
    $(IDS.month).value = '2026-09';
    const first = entry.refreshOffer();
    $(IDS.month).value = '2026-08';
    await entry.refreshOffer();
    release();
    await first;
    expect(entry.offer().months).toEqual(['2026-07']);
    expect($(IDS.label).textContent).toBe('Fill in 1 month you did not record, July 2026, with these figures');
  });
  it('the month in the box\'s own tax year not set up: its missed months are not offered yet, and with nothing else to offer the help alone shows the reason, without the tick; once the Calculate has set the year up, they are, with their share', async () => {
    // 2025/26 recorded month by month, September 2026 in the box, 26/27 not set up: the Calculate will set it up from September
    const taxYears = { '25/26': { yearSetupComplete: true, startMonth: 4 } };
    const history = Array.from({ length: 12 }, (_, i) => ({ date: addMonths('2025-04', i) }));
    const entry = createMonthEntry({ doc: document, getHistory: async () => history, getTaxYears: async () => taxYears, taxYearOf });
    $(IDS.tick).checked = true;
    const offer = await entry.refreshOffer();
    expect(offer.months).toEqual([]);
    expect($(IDS.box).style.display).toBe('');
    expect($(IDS.tick).closest('label').style.display).toBe('none');
    expect($(IDS.fromRow).style.display).toBe('none');
    expect($(IDS.tick).checked).toBe(false);
    expect($(IDS.label).textContent).toBe('');
    expect($(IDS.help).textContent).toBe('April 2026 to August 2026 are not offered yet: their tax year will be set up from September 2026 when you press Calculate, with what you received in them, and they can then be filled in with their share of that.');
    // the Calculate sets 26/27 up from September with what was received before it: the same months, now with their share
    taxYears['26/27'] = { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 13000, taxPaidToDate: 1552.5 };
    entry.calculated('2026-09');
    await tick0();
    expect(entry.offer().months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect(Object.keys(entry.offer().shares)).toEqual(entry.offer().months);
    expect($(IDS.tick).closest('label').style.display).toBe('');
    expect($(IDS.label).textContent).toBe('Fill in 5 months you did not record, April 2026 to August 2026, with these pension figures');
    expect($(IDS.help).textContent).toBe(setUpWords({ ...setUpShares('26/27', taxYears['26/27']), filled: entry.offer().months }) + ' ' + FILL_HELP);
    // a later month: the months from the set-up on as well, worked out afresh
    $(IDS.month).value = '2026-11';
    await entry.refreshOffer();
    expect(entry.offer().months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
    expect(Object.keys(entry.offer().shares)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
  });
  it('the "Start from" chooser: when the default offers nothing, the quiet line alone (no tick, no chooser); pressed, the chooser opens at its earliest month; choosing a month widens or narrows the offer, takes the tick off and leaves Save alone; after a Save, the default again', async () => {
    // a tax year set up from September with what was received before it (fictional figures); September and November
    // recorded; October in the box: the months after the latest record before October are none
    const taxYears = { '26/27': { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 13000, taxPaidToDate: 1552.5 } };
    mount('2026-10');
    const h = harness({ history: ['2026-09', '2026-11'], taxYears });
    h.entry.watchForm();
    h.entry.calculated('2026-10');
    await tick0();
    expect(h.entry.offer()).toMatchObject({ closed: true, months: [] });
    expect($(IDS.box).style.display).toBe('');
    expect($(IDS.more).style.display).toBe('');
    expect($(IDS.more).textContent).toBe('Fill in earlier months you did not record…');
    expect($(IDS.tick).closest('label').style.display).toBe('none');
    expect($(IDS.fromRow).style.display).toBe('none');
    expect($(IDS.help).style.display).toBe('none');
    expect($(IDS.label).textContent).toBe('');
    // the quiet line pressed: the chooser at April, the tick unticked, the label and the help with it
    $(IDS.more).click();
    await tick0(); await tick0();
    const offer = h.entry.offer();
    expect(offer.months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect($(IDS.more).style.display).toBe('none');
    expect($(IDS.fromRow).style.display).toBe('');
    expect($(IDS.tick).closest('label').style.display).toBe('');
    expect($(IDS.tick).checked).toBe(false);
    expect([...$(IDS.from).options].map((o) => [o.value, o.textContent])).toEqual([['2026-04', 'April 2026'], ['2026-05', 'May 2026'], ['2026-06', 'June 2026'], ['2026-07', 'July 2026'], ['2026-08', 'August 2026']]);
    expect($(IDS.from).value).toBe('2026-04');
    expect($(IDS.label).textContent).toBe('Fill in 5 months you did not record, April 2026 to August 2026, with these pension figures');
    expect($(IDS.help).style.display).toBe('');
    expect($(IDS.help).textContent.startsWith('You set up 2026/27 from September 2026 and entered £13,000 of income received before then')).toBe(true);
    expect(h.entry.state()).toBe('calculated');
    expect($(IDS.save).disabled).toBe(false);
    // June chosen: from there on; the tick comes off (what is ticked is what the label said), Save stays on
    $(IDS.tick).checked = true;
    $(IDS.from).value = '2026-06';
    $(IDS.from).dispatchEvent(new Event('change', { bubbles: true }));
    await tick0();
    expect(h.entry.offer().months).toEqual(['2026-06', '2026-07', '2026-08']);
    expect($(IDS.from).value).toBe('2026-06');
    expect($(IDS.label).textContent).toBe('Fill in 3 months you did not record, June 2026 to August 2026, with these pension figures');
    expect($(IDS.help).textContent).toContain('and ticked, June 2026 to August 2026 are recorded with their share, as drawn from your pension; the months from September 2026 on are worked out exactly as before.');
    expect($(IDS.tick).checked).toBe(false);
    expect(h.entry.state()).toBe('calculated');
    expect($(IDS.save).disabled).toBe(false);
    // Save with the tick: June to August with their share (the tax to date counts April and May too), then October
    $(IDS.tick).checked = true;
    await h.entry.save(decision('2026-10'));
    expect(h.writes.map((w) => [w.date, !!w.filledIn, !!w.fromSetUp])).toEqual([['2026-06', true, true], ['2026-07', true, true], ['2026-08', true, true], ['2026-10', false, false]]);
    expect(h.writes.slice(0, 3).map((w) => [w.sippDraw, w.monthlyTax, w.taxPaidYTD])).toEqual([[2600, 310.5, 931.5], [2600, 310.5, 1242], [2600, 310.5, 1552.5]]);
    expect($(IDS.note).textContent).toBe('October 2026 saved, with June 2026 to August 2026 filled in. To record another month, change the month and press Calculate.');
    // the next entry starts from the default again: April and May are still unrecorded, so the quiet line, not a ready tick
    $(IDS.month).value = '2026-12';
    await h.entry.refreshOffer();
    expect(h.entry.offer()).toMatchObject({ closed: true, months: [], choices: ['2026-04', '2026-05'] });
    expect($(IDS.more).style.display).toBe('');
    // with one month left to choose from, the chooser is hidden
    const one = createMonthEntry({ doc: document, getHistory: async () => [{ date: '2026-04' }, { date: '2026-05' }, { date: '2026-06' }, { date: '2026-08' }], getTaxYears: async () => ({ '26/27': { yearSetupComplete: true, startMonth: 4 } }), taxYearOf });
    $(IDS.month).value = '2026-09';
    expect((await one.refreshOffer()).choices).toEqual(['2026-07']);
    expect($(IDS.fromRow).style.display).toBe('none');
  });
  it('a set-up given nothing as received, every month recorded since: no box at all, now or a year later', async () => {
    const taxYears = { '26/27': { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 0, taxPaidToDate: null }, '27/28': { yearSetupComplete: true, startMonth: 4 } };
    mount('2026-11');
    const h = harness({ history: ['2026-09', '2026-10'], taxYears });
    expect(await h.entry.refreshOffer()).toBe(null);
    expect($(IDS.box).style.display).toBe('none');
    const later = harness({ history: Array.from({ length: 20 }, (_, i) => addMonths('2026-09', i)), taxYears });
    $(IDS.month).value = '2028-05';
    expect(await later.entry.refreshOffer()).toBe(null);
    expect($(IDS.box).style.display).toBe('none');
  });
  it('a gap inside the history before the latest record: the default is the months after it, as before; the chooser reaches back to the gap and every month with no record from there', async () => {
    const taxYears = { '26/27': { yearSetupComplete: true, startMonth: 4 } };
    mount('2026-12');
    const h = harness({ history: ['2026-04', '2026-06', '2026-09'], taxYears });
    h.entry.watchForm();
    await h.entry.refreshOffer();
    expect(h.entry.offer().months).toEqual(['2026-10', '2026-11']);
    expect($(IDS.label).textContent).toBe('Fill in 2 months you did not record, October 2026 and November 2026, with these figures');
    expect($(IDS.from).value).toBe('2026-10');
    $(IDS.from).value = '2026-05';
    $(IDS.from).dispatchEvent(new Event('change', { bubbles: true }));
    await tick0();
    expect($(IDS.label).textContent).toBe('Fill in 5 months you did not record, May 2026, July 2026, August 2026, October 2026 and November 2026, with these figures');
    $(IDS.tick).checked = true;
    await h.entry.save(decision('2026-12'));
    expect(h.writes.map((w) => w.date)).toEqual(['2026-05', '2026-07', '2026-08', '2026-10', '2026-11', '2026-12']);
    // worked out in date order, each with the records on file at the time (the engine reads those before its month)
    expect(h.calcs[0]).toEqual({ date: '2026-05', saw: ['2026-04', '2026-06', '2026-09'] });
    expect(h.calcs[1].saw).toEqual(['2026-04', '2026-05', '2026-06', '2026-09']);
  });
  it('a history that refuses to load offers nothing', async () => {
    const entry = createMonthEntry({ doc: document, getHistory: async () => { throw new Error('no'); } });
    expect(await entry.refreshOffer()).toBe(null);
    expect($(IDS.box).style.display).toBe('none');
  });
});

describe('Save with the fill', () => {
  it('the missed months first, in date order and marked, each seeing the records before it; then this month worked out again, unmarked; the toast, the line, the spinner count', async () => {
    const h = harness();
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09'));
    expect(r.ok).toBe(true);
    expect(h.writes.map((w) => w.date)).toEqual(['2026-07', '2026-08', '2026-09']);
    for (const w of h.writes.slice(0, 2)) { expect(w.filledIn).toBe(true); expect(w.filledInOn).toBe(NOW); expect(w.entered).toEqual({ mode: 'platform' }); }
    expect('filledIn' in h.writes[2]).toBe(false);
    expect('filledInOn' in h.writes[2]).toBe(false);
    // the same figures every time, nothing invented between months
    for (const w of h.writes) { expect(w.equity).toBe(368100); expect(w.bond).toBe(150400); expect(w.cash).toBe(55100); }
    // worked out in order: July saw April–June, August saw July too, and September (again) saw both
    expect(h.calcs.map((c) => c.date)).toEqual(['2026-07', '2026-08', '2026-09']);
    expect(h.calcs[0].saw).toEqual(['2026-04', '2026-05', '2026-06']);
    expect(h.calcs[1].saw).toEqual(['2026-04', '2026-05', '2026-06', '2026-07']);
    expect(h.calcs[2].saw).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect(h.panels).toEqual(['2026-09']);   // redrawn, so what is shown is what is saved
    expect(r.decision.date).toBe('2026-09');
    expect(r.decision.entered).toEqual({ mode: 'platform' });
    expect(h.progress).toEqual(['Saving 1 of 3…', 'Saving 2 of 3…', 'Saving 3 of 3…']);
    expect($(IDS.progress).textContent).toBe('Saving...');
    expect(h.toasts).toEqual([['Saved, with 2 months filled in', 'success']]);
    expect($(IDS.note).textContent).toBe('September 2026 saved, with July 2026 and August 2026 filled in. To record another month, change the month and press Calculate.');
    expect($(IDS.save).disabled).toBe(true);
    expect($(IDS.save).classList.contains('loading')).toBe(false);
  });
  it('this month worked out again after the fill and moved: the saved line and the toast say what moved, against what was read at Calculate', async () => {
    // the first working-out (at Calculate) said £2,600 and £2,290 after tax; with July and August on record the pot held level tips September into protection
    const h = harness({ calcExtra: (date) => (date === '2026-09' ? { sippDraw: 2340, totalMonthlyNet: 2064, inProtection: true } : { totalMonthlyNet: 2290, inProtection: false }) });
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09', { totalMonthlyNet: 2290, inProtection: false }));
    expect(r.ok).toBe(true);
    expect(r.decision.sippDraw).toBe(2340);
    expect(h.writes.map((w) => [w.date, w.sippDraw])).toEqual([['2026-07', 2600], ['2026-08', 2600], ['2026-09', 2340]]);
    const moved = 'September 2026 was worked out again with the filled-in months on record, and the recommendation changed: SIPP withdrawal £2,340 a month (it was £2,600); income after tax £2,064 a month (it was £2,290); now in Protection Mode.';
    expect($(IDS.note).textContent).toBe('September 2026 saved, with July 2026 and August 2026 filled in. ' + moved + ' To record another month, change the month and press Calculate.');
    expect(h.toasts).toEqual([['Saved, with 2 months filled in. ' + moved, 'success']]);
    // nothing moved: nothing said (the first case above)
  });
  it('without the tick: this month alone, as before, the spinner\'s plain word, the old toast', async () => {
    const h = harness();
    const r = await h.entry.save(decision('2026-09'));
    expect(r.ok).toBe(true);
    expect(h.writes.map((w) => w.date)).toEqual(['2026-09']);
    expect(h.calcs).toEqual([]);
    expect(h.panels).toEqual([]);
    expect(h.progress).toEqual(['Saving...']);
    expect(h.toasts).toEqual([['Decision saved to history', 'success']]);
    expect($(IDS.note).textContent).toBe('September 2026 saved. To record another month, change the month and press Calculate.');
  });
  it('a tick left on for a month with no gap writes nothing extra', async () => {
    const h = harness({ history: ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'] });
    $(IDS.tick).checked = true;
    await h.entry.save(decision('2026-09'));
    expect(h.writes.map((w) => w.date)).toEqual(['2026-09']);
    expect(h.toasts).toEqual([['Decision saved to history', 'success']]);
  });
  it('a missed month in a tax year not set up stops the fill there, with the batch\'s words; this month is not recorded, and the line says so', async () => {
    const h = harness({ history: ['2027-01', '2027-02'], notSetUp: ['2027-04', '2027-05'] });
    mount('2027-06');
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2027-06'));
    expect(r.ok).toBe(true);
    expect(h.writes.map((w) => w.date)).toEqual(['2027-03']);
    expect(h.writes[0].filledIn).toBe(true);
    expect(h.calcs.map((c) => c.date)).toEqual(['2027-03']);
    const words = 'Recorded one month; the fill stopped before April 2027 because 2027/28 is not set up. Set it up first: put April 2027 in the month box and press Calculate. June 2027 was not recorded.';
    expect(h.toasts).toEqual([[words, 'warning']]);
    expect($(IDS.note).textContent).toBe(words);
    expect($(IDS.save).disabled).toBe(true);
    expect(h.entry.state()).toBe('stopped');
    expect(r.decision.date).toBe('2027-06');
  });
  it('with the tax years known, the label counts only the months the fill will write and the help says beforehand that the month in the box will not be recorded; Save writes those and stops, as the words said', async () => {
    // records to February 2026; 2025/26 and 2027/28 set up, 2026/27 between them not; May 2027 in the box
    const taxYears = { '25/26': { yearSetupComplete: true, startMonth: 4 }, '27/28': { yearSetupComplete: true, startMonth: 4 } };
    mount('2027-05');
    const h = harness({ history: ['2026-01', '2026-02'], taxYears });
    await h.entry.refreshOffer();
    expect($(IDS.label).textContent).toBe('Fill in 1 month you did not record, March 2026, with these figures');
    expect($(IDS.help).textContent).toBe('2026/27 is not set up, so the fill stops before April 2026, and May 2027 will not be recorded either until 2026/27 is set up. Set that year up first: put April 2026 in the month box and press Calculate (it is then set up from April, with nothing received before it). ' + FILL_HELP);
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2027-05'));
    expect(r.ok).toBe(true);
    expect(h.writes.map((w) => w.date)).toEqual(['2026-03']);
    const words = 'Recorded one month; the fill stopped before April 2026 because 2026/27 is not set up. Set it up first: put April 2026 in the month box and press Calculate. May 2027 was not recorded.';
    expect(h.toasts).toEqual([[words, 'warning']]);
    expect(h.entry.state()).toBe('stopped');
  });
  it('Save records a month before its tax year\'s set-up with its share of that set-up\'s figures, as the offer said; the months from the set-up on are worked out as usual', async () => {
    const h = harness({ history: ['2026-02'], taxYears: { '25/26': { yearSetupComplete: true, startMonth: 4 }, '26/27': { yearSetupComplete: true, startMonth: 6, remainingMonths: 10, grossIncomeToDate: 5000, taxPaidToDate: 400 } } });
    mount('2026-07');
    await h.entry.refreshOffer();
    $(IDS.tick).checked = true;
    await h.entry.save(decision('2026-07'));
    expect(h.writes.map((w) => [w.date, !!w.filledIn, !!w.fromSetUp])).toEqual([['2026-03', true, false], ['2026-04', true, true], ['2026-05', true, true], ['2026-06', true, false], ['2026-07', false, false]]);
    // each worked out first (the pots, the glidepaths), then its income and tax replaced by its share; the others as worked out
    expect(h.calcs.map((c) => c.date)).toEqual(['2026-03', '2026-04', '2026-05', '2026-06', '2026-07']);
    const [mar, apr, may, jun] = h.writes;
    expect([apr.sippDraw, apr.monthlyTax, apr.totalMonthlyNet, apr.taxPaidYTD]).toEqual([2500, 200, 2300, 200]);
    expect([may.sippDraw, may.monthlyTax, may.totalMonthlyNet, may.taxPaidYTD]).toEqual([2500, 200, 2300, 400]);
    for (const w of [apr, may]) { expect(w.equity).toBe(368100); expect(w.filledInOn).toBe(NOW); expect(w.paidAhead).toBe(false); expect(w.inProtection).toBe(false); }
    expect([mar.sippDraw, jun.sippDraw]).toEqual([2600, 2600]);
    expect($(IDS.note).textContent).toBe('July 2026 saved, with March 2026 to June 2026 filled in. To record another month, change the month and press Calculate.');
  });
  it('a failed write: the error toast, Save on again (the panel still matches the boxes), the months already written stay', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});   // the planner logs a failed save, as it always did
    const h = harness({ failOn: '2026-09' });
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09'));
    expect(r.ok).toBe(false);
    expect(h.writes.map((w) => w.date)).toEqual(['2026-07', '2026-08']);
    expect(h.toasts).toEqual([['Error saving: the write failed', 'error']]);
    expect($(IDS.save).disabled).toBe(false);
    expect($(IDS.note).textContent).toBe('');
    expect(h.entry.state()).toBe('calculated');
    expect($(IDS.save).classList.contains('loading')).toBe(false);
    expect($(IDS.progress).textContent).toBe('Saving...');
    expect(quiet).toHaveBeenCalledTimes(1);
    quiet.mockRestore();
  });
});

describe('a write that fails part-way through the fill', () => {
  it('a filled-in month went in, then the next write failed: Save stays off (this month\'s calculation did not see it), the line says what went in and asks for a Calculate', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    const h = harness({ failOn: '2026-08' });
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09'));
    expect(r.ok).toBe(false);
    expect(h.writes.map((w) => w.date)).toEqual(['2026-07']);
    expect(r.decision.date).toBe('2026-09');
    expect(h.toasts).toEqual([['Error saving: the write failed', 'error']]);
    expect(h.entry.state()).toBe('interrupted');
    expect($(IDS.save).disabled).toBe(true);
    expect($(IDS.note).textContent).toBe('July 2026 was filled in before the save failed, and September 2026 was not recorded. Press Calculate to work it out again with that month on record.');
    // the form's edits keep the line (it already asks for a Calculate); the next Calculate puts Save back on, and the offer is August alone
    h.entry.watchForm();
    input('entryIsa', '10');
    expect(h.entry.state()).toBe('interrupted');
    h.entry.calculated('2026-09');
    await tick0();
    expect($(IDS.save).disabled).toBe(false);
    expect(h.entry.offer().months).toEqual(['2026-08']);
    expect($(IDS.tick).checked).toBe(false);
    quiet.mockRestore();
  });
  it('the second working-out of this month failed after the fill: the same', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    const h = harness({ calcFails: (date, nth) => date === '2026-09' && nth === 3 });
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09'));
    expect(r.ok).toBe(false);
    expect(h.writes.map((w) => w.date)).toEqual(['2026-07', '2026-08']);
    expect(h.entry.state()).toBe('interrupted');
    expect($(IDS.save).disabled).toBe(true);
    expect($(IDS.note).textContent).toBe('July 2026 and August 2026 were filled in before the save failed, and September 2026 was not recorded. Press Calculate to work it out again with those months on record.');
    quiet.mockRestore();
  });
  it('the first filled-in month\'s write failed: nothing went in, so Save is on again as before', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    const h = harness({ failOn: '2026-07' });
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09'));
    expect(r.ok).toBe(false);
    expect(h.writes).toEqual([]);
    expect(h.entry.state()).toBe('calculated');
    expect($(IDS.save).disabled).toBe(false);
    quiet.mockRestore();
  });
});

describe('"This month\'s payment has already been made" (paidAhead) keeps its meaning for the month in the box', () => {
  it('this month alone carries the mark as calculated; without the tick it carries none', async () => {
    const h = harness();
    await h.entry.save(decision('2026-09', { paidAhead: true }));
    expect(h.writes.map((w) => [w.date, w.paidAhead])).toEqual([['2026-09', true]]);
    const h2 = harness();
    await h2.entry.save(decision('2026-09', { paidAhead: false }));
    expect(h2.writes[0].paidAhead).toBe(false);
  });
  it('with the fill: the filled-in months never carry it (they were missed, not paid before their entry); this month, worked out again, keeps it', async () => {
    const h = harness();
    $(IDS.tick).checked = true;
    const r = await h.entry.save(decision('2026-09', { paidAhead: true }));
    expect(h.writes.map((w) => [w.date, w.paidAhead, !!w.filledIn])).toEqual([['2026-07', false, true], ['2026-08', false, true], ['2026-09', true, false]]);
    expect(r.decision.paidAhead).toBe(true);
  });
  it('a batch marks its first record alone, with or without a fill before it', async () => {
    const h = harness({ cadence: 3 });
    await h.entry.save(decision('2026-09', { cadenceMonths: 3, paidAhead: true }));
    expect(h.writes.map((w) => [w.date, w.paidAhead])).toEqual([['2026-09', true], ['2026-10', false], ['2026-11', false]]);
    const h2 = harness({ cadence: 3 });
    $(IDS.tick).checked = true;
    await h2.entry.save(decision('2026-09', { cadenceMonths: 3, paidAhead: true }));
    expect(h2.writes.map((w) => [w.date, w.paidAhead])).toEqual([['2026-07', false], ['2026-08', false], ['2026-09', true], ['2026-10', false], ['2026-11', false]]);
    const h3 = harness({ cadence: 3 });
    $(IDS.tick).checked = false;
    await h3.entry.save(decision('2026-09', { cadenceMonths: 3 }));
    expect(h3.writes.map((w) => w.paidAhead)).toEqual([false, false, false]);
  });
});

describe('Save with a batch, as before', () => {
  it('a quarterly batch: three records of the same recommendation, counted on the spinner', async () => {
    const h = harness({ cadence: 3 });
    const r = await h.entry.save(decision('2026-09', { cadenceMonths: 3 }));
    expect(r.ok).toBe(true);
    expect(h.writes.map((w) => [w.date, w.month])).toEqual([['2026-09', '2026-09'], ['2026-10', '2026-10'], ['2026-11', '2026-11']]);
    expect(h.progress).toEqual(['Saving 1 of 3…', 'Saving 2 of 3…', 'Saving 3 of 3…']);
    expect(h.toasts).toEqual([['Batch saved — 3 months recorded', 'success']]);
    expect($(IDS.note).textContent).toBe('September 2026 to November 2026 saved. To record another month, change the month and press Calculate.');
  });
  it('a batch that reaches a tax year not set up stops there with its warning, and no success toast talks over it', async () => {
    const h = harness({ cadence: 3 });
    mount('2027-02');
    const r = await h.entry.save(decision('2027-02', { cadenceMonths: 3 }));
    expect(r.ok).toBe(true);
    expect(h.writes.map((w) => w.date)).toEqual(['2027-02', '2027-03']);
    expect(h.toasts).toEqual([['Recorded 2 months — the next tax year needs setting up first (enter its first month).', 'warning']]);
    expect(h.entry.state()).toBe('saved');
    expect($(IDS.note).textContent).toBe('February 2027 to March 2027 saved. To record another month, change the month and press Calculate.');
  });
  it('the fill and then a batch: the missed months first, then the batch from this month, all counted', async () => {
    const h = harness({ cadence: 3 });
    $(IDS.tick).checked = true;
    await h.entry.save(decision('2026-09', { cadenceMonths: 3 }));
    expect(h.writes.map((w) => w.date)).toEqual(['2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    expect(h.writes.filter((w) => w.filledIn).map((w) => w.date)).toEqual(['2026-07', '2026-08']);
    expect(h.progress).toEqual(['Saving 1 of 5…', 'Saving 2 of 5…', 'Saving 3 of 5…', 'Saving 4 of 5…', 'Saving 5 of 5…']);
    expect(h.toasts).toEqual([['Batch saved — 3 months recorded', 'success']]);
  });
});

describe('index.html: a Calculate refused before the engine runs stays on the page too', () => {
  // The figure problem of the platform view (its default), the life-stage gate, a missing figure and a month already
  // saved each stopped Calculate with a toast alone, and the line then asked for a Calculate that only refused again. A
  // month already saved and one before its tax year's set-up share one refusal (MonthFill.refusedMonthWords).
  const html = readFileSync('index.html', 'utf8');
  const f = html.slice(html.indexOf('window.handleDecisionSubmit'), html.indexOf('window.saveCurrentDecision'));
  it('each refusal\'s toast has the panel\'s alert beside it, with the same words', () => {
    for (const [toast, words] of [['showToast(entry.problem', 'entry.problem'], ['showToast(gate.reason', 'gate.reason'], ["showToast('Missing: '", "'Missing: ' + missing.join(', ')"], ['showToast(refused', 'refused']]) {
      const line = f.split('\n').find((l) => l.includes(toast));
      expect(line, toast).toBeDefined();
      expect(line, toast).toContain('monthEntry.failed(dateStr, ' + words);
    }
  });
});
