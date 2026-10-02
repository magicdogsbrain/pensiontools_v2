/**
 * How the ISA and savings grow, on today's planner's screens (6.22.0; research/saver-lock-and-savings-growth.md §3.5,
 * tests 10, 12 and 19; the owner's decision (B) of 2 Oct 2026).
 *
 *  - Stress tester → Settings: two choices, "Mostly cash" (the default) and "Invested like my pension", in plain words,
 *    outside the risk / funds switch. A locked plan with no setting shows "A fixed 3% a year (this plan was locked before
 *    this choice was added; unlock to change)" instead, as charges do; a plan whose fund list holds ISA funds shows that
 *    those funds decide.
 *  - The line above Monte Carlo, History and Scenarios says how the ISA grows; the Assumptions page states the setting.
 *  - The plan document records the choice at lock; a document from before says its ISA grew at a fixed 3%.
 *  - The Accumulation planner has a box for what goes into ISAs and savings each month, and an ISA line that agrees with
 *    the Timing block's ISA at retirement.
 *  - A plan made from a V7 answer carries the answer's choice ("Mostly cash" when it has none) and its savings pay-in.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

import {
  ISA_GROWTH_LABEL, ISA_GROWTH_CHOICES, ISA_GROWTH_HINT, ISA_GROWTH_HELP, ISA_GROWTH_LOCKED_TEXT, ISA_GROWTH_FUNDS_TEXT,
  isaGrowthFieldState, isaGrowthForSave, readIsaGrowthChoice, paintIsaGrowthField, isaGrowthRunLine, isaGrowthUnlockNoteHtml,
  unlockNotesHtml, isaAssumptionsRow, isaGrowthAssumptionText, isaFundsDecide, accumulationIsaNote, drawdownIsaNoteHtml
} from '../src/ui/isaGrowthSetting.js';
import { chargesUnlockNoteHtml } from '../src/ui/chargesSetting.js';
import { startSummaryHtml } from '../src/ui/startingPotsWords.js';
import { accumulationTableHtml, isaLineRows } from '../src/ui/accumulationProjection.js';
import { planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { projectedPotAtRetirement } from '../src/services/PlanTiming.js';
import { projectAccumulation } from '../src/services/AccumulationEngine.js';
import { seedToScenario, checkSeed } from '../src/services/PlanSeed.js';
import { BANNED } from '../src/v7/copy/banned.js';
import { seedA, seedBCouple, NOW_MS } from './integration/fixtures/planSeeds.js';

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, '\'');
const SRC = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const doc = new JSDOM(SRC.replace(/<script[\s\S]*?<\/script>/g, '')).window.document;
const script = [...SRC.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1])).map((m) => m[2]).join('\n');
const fnBody = (marker, len = 6000) => { const i = script.indexOf(marker); expect(i, marker).toBeGreaterThan(-1); return script.slice(i, i + len); };

describe('the words', () => {
  it('the label, the two choices in the owner\'s words, and where it applies', () => {
    expect(ISA_GROWTH_LABEL).toBe('How your ISA and savings grow');
    expect(ISA_GROWTH_CHOICES.map((c) => [c.value, c.label])).toEqual([['cash', 'Mostly cash'], ['invested', 'Invested like my pension']]);
    expect(ISA_GROWTH_CHOICES[0].help).toBe('like cash: by last year\'s rise in prices, less 1% a year, never below nothing. For cash ISAs, savings accounts and money-market funds.');
    expect(ISA_GROWTH_CHOICES[1].help).toBe('the same mix of shares, bonds and cash as your pension, in the same futures. For a stocks and shares ISA held like your pension.');
    expect(ISA_GROWTH_HINT).toBe('Used by Pots & Valves and Buckets in order. The other strategies spend the ISA as part of their own pot.');
    expect(ISA_GROWTH_HELP).toMatch(/diversifiers and reserve are not part of it/);
    expect(ISA_GROWTH_HELP).toMatch(/charge comes off either way/);
    expect(ISA_GROWTH_LOCKED_TEXT).toBe('A fixed 3% a year (this plan was locked before this choice was added; unlock to change)');
    expect(ISA_GROWTH_FUNDS_TEXT).toBe('Follows the ISA funds in your list of funds to test');
  });
  it('none of the words a person reads beside the choice uses a phrase V7\'s plain-English list bans (the Assumptions page keeps the ISA policy\'s own names)', () => {
    const texts = [ISA_GROWTH_LABEL, ISA_GROWTH_HINT, ISA_GROWTH_HELP, ISA_GROWTH_LOCKED_TEXT, ISA_GROWTH_FUNDS_TEXT, ...ISA_GROWTH_CHOICES.flatMap((c) => [c.label, c.help]),
      plain(isaGrowthUnlockNoteHtml()), plain(isaGrowthRunLine({ isaBalance: 1, isaGrowth: 'cash' })), plain(isaGrowthRunLine({ isaBalance: 1, isaGrowth: 'invested' }))];
    // "Stress tester" is today's planner's own name for its tab (V7 renames it), so the words that send people there keep it
    for (const t of texts) for (const b of BANNED.filter((x) => x.scope === 'all' && x.id !== 'stress-tester')) expect(b.re.test(t), b.id + ': ' + t).toBe(false);
  });
});

describe('the field: the choice, or a line in its place', () => {
  it('an unlocked plan shows the choice holding its own value, "Mostly cash" when it has none', () => {
    expect(isaGrowthFieldState({ isaGrowth: 'invested' })).toEqual({ mode: 'choice', value: 'invested', text: '' });
    expect(isaGrowthFieldState({ isaGrowth: 'cash' }, { locked: true })).toEqual({ mode: 'choice', value: 'cash', text: '' });
    expect(isaGrowthFieldState({})).toEqual({ mode: 'choice', value: 'cash', text: '' });
  });
  it('a locked plan with no setting shows the fixed-3% line (it runs at 3% until it is unlocked)', () => {
    expect(isaGrowthFieldState({}, { locked: true })).toEqual({ mode: 'locked-before-choice', value: 'cash', text: ISA_GROWTH_LOCKED_TEXT });
    expect(isaGrowthFieldState({ isaGrowth: 'nonsense' }, { locked: true }).mode).toBe('locked-before-choice');
  });
  it('ISA funds in the fund list decide, locked or not', () => {
    const funds = { taggedFunds: [{ ticker: 'VWRP', value: 40000, wrapper: 'ISA' }] };
    expect(isaFundsDecide(funds)).toBe(true);
    expect(isaFundsDecide({ taggedFunds: [{ ticker: 'VWRP', value: 40000, wrapper: 'SIPP' }] })).toBe(false);
    expect(isaFundsDecide({ taggedFunds: [{ ticker: 'VWRP', value: 0, wrapper: 'ISA' }] })).toBe(false);
    expect(isaGrowthFieldState({ ...funds, isaGrowth: 'cash' })).toMatchObject({ mode: 'isa-funds', text: ISA_GROWTH_FUNDS_TEXT });
    expect(isaGrowthFieldState(funds, { locked: true })).toMatchObject({ mode: 'isa-funds' });
  });
  it('the value saved: the ticked choice, else the plan\'s own, else "Mostly cash"', () => {
    expect(isaGrowthForSave('invested', { isaGrowth: 'cash' })).toBe('invested');
    expect(isaGrowthForSave(null, { isaGrowth: 'invested' })).toBe('invested');
    expect(isaGrowthForSave('wrong', {})).toBe('cash');
    expect(isaGrowthForSave(undefined, null)).toBe('cash');
  });
  it('painted on the page: the radios hold the value, the line replaces them when it applies', () => {
    const page = new JSDOM(SRC.replace(/<script[\s\S]*?<\/script>/g, '')).window.document;
    paintIsaGrowthField(page, isaGrowthFieldState({ isaGrowth: 'invested' }));
    expect(readIsaGrowthChoice(page)).toBe('invested');
    expect(page.getElementById('ssIsaGrowthChoices').style.display).toBe('');
    expect(page.getElementById('ssIsaGrowthLocked').style.display).toBe('none');
    paintIsaGrowthField(page, isaGrowthFieldState({}, { locked: true }));
    expect(page.getElementById('ssIsaGrowthChoices').style.display).toBe('none');
    expect(page.getElementById('ssIsaGrowthLocked').textContent).toBe(ISA_GROWTH_LOCKED_TEXT);
    expect(page.getElementById('ssIsaGrowthLocked').style.display).toBe('');
    expect(() => paintIsaGrowthField(new JSDOM('<p></p>').window.document, isaGrowthFieldState({}))).not.toThrow();
  });
});

describe('index.html: the choice in Stress tester → Settings', () => {
  it('two radios, "Mostly cash" first and ticked by default, in the Settings pane, outside the risk / funds switch', () => {
    const g = doc.querySelector('#ssIsaGrowthGroup');
    expect(g).not.toBeNull();
    expect(g.closest('#stress-stresssettings')).not.toBeNull();
    expect(g.closest('#ssRiskMode')).toBeNull();
    expect(g.closest('#ssFundsMode')).toBeNull();
    const radios = [...g.querySelectorAll('input[type="radio"][name="ssIsaGrowth"]')];
    expect(radios.map((r) => r.value)).toEqual(['cash', 'invested']);
    expect(radios[0].checked).toBe(true);
    expect(plain(g.querySelector('label').innerHTML)).toMatch(/^How your ISA and savings grow/);
    expect(g.querySelector('#ssIsaGrowthLocked')).not.toBeNull();
    const text = g.textContent.replace(/\s+/g, ' ');
    for (const c of ISA_GROWTH_CHOICES) { expect(text).toContain(c.label); expect(text).toContain(c.help); }
    expect(g.querySelector('#ssIsaGrowthHint').textContent).toBe(ISA_GROWTH_HINT);
    expect(g.querySelector('.hlp').getAttribute('data-tip')).toBe(ISA_GROWTH_HELP);
  });
  it('painted with the charges box (on load, after a save and when the lock changes) and saved beside the charge', () => {
    expect(fnBody('async function renderChargesField()', 900)).toContain('paintIsaGrowthField(document, isaGrowthFieldState(st, { locked }))');
    expect(fnBody('window.saveStressSettingsUI', 9000)).toContain('isaGrowth: isaGrowthForSave(readIsaGrowthChoice(document), _curSS)');
  });
  it('the ISA paragraph no longer says the ISA has "its own steady return"', () => {
    const risk = doc.querySelector('#ssRiskMode').textContent.replace(/\s+/g, ' ');
    expect(risk).not.toMatch(/own steady return/);
    expect(risk).toMatch(/How your ISA and savings grow/);
  });
});

describe('the line above Monte Carlo, History and Scenarios', () => {
  it('says how the ISA grows, for a plan with an ISA; nothing for a plan without one or without a setting (lock unknown)', () => {
    expect(plain(isaGrowthRunLine({ isaBalance: 60000, isaGrowth: 'cash' }))).toBe('Your ISA grows like cash: by last year\'s rise in prices, less 1% a year (change it in Settings).');
    expect(plain(isaGrowthRunLine({ isaBalance: 60000, isaGrowth: 'invested' }))).toBe('Your ISA is invested like your pension: the same mix, in the same futures (change it in Settings).');
    expect(isaGrowthRunLine({ isaBalance: 60000 }, { locked: true })).toBe('Your ISA grows at a fixed 3% a year: this plan was locked before the choice of how it grows was added.');
    expect(isaGrowthRunLine({ isaBalance: 60000 })).toBe('');
    expect(isaGrowthRunLine({ isaBalance: 0, isaGrowth: 'cash' })).toBe('');
    expect(isaGrowthRunLine({ isaBalance: 5, taggedFunds: [{ ticker: 'VWRP', value: 5, wrapper: 'ISA' }] })).toBe('Your ISA grows as the ISA funds in your list of funds to test.');
  });
  it('the start summary ends with it', () => {
    const s = { equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 60000, isaGrowth: 'cash', chargesPct: 0.5 };
    expect(plain(startSummaryHtml(s))).toMatch(/Your ISA grows like cash/);
    const before = startSummaryHtml({ equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 60000 });
    expect(before).not.toMatch(/Your ISA/);   // no setting, lock unknown: the line is as it always was
  });
});

describe('Stress tester → Drawdown: the fixed table says how its ISA grows (research/saver-lock-and-savings-growth.md §2c)', () => {
  // The table is one fixed projection at the assumed rise in prices (DrawdownService): its ISA left always grows by the
  // cash rule there, max(0, inflation − 1%). With "Invested like my pension", or a plan locked before the choice, the runs
  // grow it otherwise, so the table says so rather than look like a second answer.
  it('"Mostly cash": the same rule as the runs, at the table\'s one rate', () => {
    expect(plain(drawdownIsaNoteHtml({ isaBalance: 60000, isaGrowth: 'cash' }, { inflation: 0.025 })))
      .toBe('The ISA left grows like cash here: your assumed rise in prices less 1%, 1.5% a year, never below nothing, the same rule the 1,000 futures and the history use.');
    expect(plain(drawdownIsaNoteHtml({ isaBalance: 60000, isaGrowth: 'cash' }, { inflation: 0.005 }))).toContain('0.0% a year');
  });
  it('"Invested like my pension": this table cannot follow the pension\'s futures, the runs do', () => {
    expect(plain(drawdownIsaNoteHtml({ isaBalance: 60000, isaGrowth: 'invested' }, { inflation: 0.03 })))
      .toBe('The ISA left grows like cash here (your assumed rise in prices less 1%, 2.0% a year): this one fixed table has no futures for your pension\'s mix to follow. The 1,000 futures and the history grow it invested like your pension, as you chose.');
  });
  it('a plan locked before the choice: the runs keep its fixed 3%; ISA funds in the fund list: the runs follow them', () => {
    expect(plain(drawdownIsaNoteHtml({ isaBalance: 60000 }, { inflation: 0.025, locked: true })))
      .toBe('The ISA left grows like cash here (your assumed rise in prices less 1%, 1.5% a year). The 1,000 futures and the history grow this plan\'s ISA at a fixed 3% a year: it was locked before the choice of how it grows was added.');
    expect(plain(drawdownIsaNoteHtml({ isaBalance: 5, isaGrowth: 'cash', taggedFunds: [{ ticker: 'VWRP', value: 5, wrapper: 'ISA' }] }, { inflation: 0.025 })))
      .toBe('The ISA left grows like cash here (your assumed rise in prices less 1%, 1.5% a year). The 1,000 futures and the history grow it as the ISA funds in your list of funds to test.');
  });
  it('nothing for a plan with no ISA, or no setting with the lock unknown; plain words', () => {
    expect(drawdownIsaNoteHtml({ isaBalance: 0, isaGrowth: 'invested' }, { inflation: 0.025 })).toBe('');
    expect(drawdownIsaNoteHtml({ isaBalance: 60000 }, { inflation: 0.025 })).toBe('');
    expect(drawdownIsaNoteHtml(null)).toBe('');
    const texts = [{ isaGrowth: 'cash' }, { isaGrowth: 'invested' }, {}].map((s) => plain(drawdownIsaNoteHtml({ isaBalance: 1, ...s }, { inflation: 0.025, locked: true })));
    for (const t of texts) for (const b of BANNED.filter((x) => x.scope === 'all' && x.id !== 'stress-tester')) expect(b.re.test(t), b.id + ': ' + t).toBe(false);
  });
  it('index.html: the table\'s note carries it, with the plan\'s lock and the table\'s own rise in prices', () => {
    expect(fnBody('window.showDrawdownScheduleUI', 2500)).toContain('drawdownIsaNoteHtml(settings, { inflation, locked: await planIsLocked().catch(() => null) })');
  });
});

describe('the Assumptions page and the unlock confirmation', () => {
  it('the ISA row states the setting, not a fixed 3%', () => {
    const [k, v, note] = isaAssumptionsRow();
    expect(k).toBe('ISA');
    expect(v).toMatch(/Mostly cash/);
    expect(v).toMatch(/Invested like my pension/);
    expect(note).toMatch(/locked before the choice was added keeps a fixed 3% a year/);
    expect(fnBody('function assumptionsPageHtml()', 12000)).toContain('row(...isaAssumptionsRow())');
    expect(script).not.toMatch(/ISA_DEFAULTS\.RETURN/);
  });
  it('unlocking a plan locked before the choice says it will grow like cash, beside the charges bullet', () => {
    expect(plain(isaGrowthUnlockNoteHtml())).toMatch(/^How your ISA grows: this plan was locked before this choice was added, so its ISA has grown at a fixed 3% a year\. Once it is unlocked it grows like cash/);
    expect(unlockNotesHtml({ chargesPct: 0.5, isaGrowth: 'cash' })).toEqual([chargesUnlockNoteHtml(0.5), isaGrowthUnlockNoteHtml()]);
    expect(unlockNotesHtml({ isaGrowth: 'cash' })).toEqual([isaGrowthUnlockNoteHtml()]);
  });
});

describe('the plan document records the choice', () => {
  const settings = { currentAge: 66, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2026, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 40000, baseSalary: 30000, duration: 30, incomeShape: 'phases', incomeSteps: [{ fromAge: 66, amount: 30000 }] };
  const NOW = new Date(2026, 8, 10);
  it('assumptions.isaGrowth on new documents ("cash", "invested", null for none); the view says it', () => {
    for (const [v, words] of [['cash', /mostly cash: by last year's rise in prices, less 1% a year/], ['invested', /invested like the pension/]]) {
      const d = buildPlanDocument({ settings: { ...settings, isaGrowth: v }, now: NOW });
      expect(d.assumptions.isaGrowth).toBe(v);
      expect(plain(planDocumentHtml(d))).toMatch(words);
    }
    const none = buildPlanDocument({ settings, now: NOW });
    expect(none.assumptions.isaGrowth).toBeNull();
    expect(plain(planDocumentHtml(none))).toMatch(/How the ISA and savings growa fixed 3% a year/);
    const funds = buildPlanDocument({ settings: { ...settings, isaGrowth: 'cash', taggedFunds: [{ ticker: 'VWRP', value: 40000, wrapper: 'ISA' }] }, now: NOW });
    expect(funds.assumptions.isaFromFunds).toBe(true);
    expect(isaGrowthAssumptionText(funds.assumptions)).toBe('as the ISA funds in the list of funds to test');
  });
  it('a document written before 6.22.0 (no key) reads "grew at a fixed 3% a year", and is never rewritten', () => {
    const d = buildPlanDocument({ settings, now: NOW });
    delete d.assumptions.isaGrowth;
    const before = JSON.stringify(d);
    expect(plain(planDocumentHtml(d))).toMatch(/grew at a fixed 3% a year \(this plan was locked before the choice was added\)/);
    expect(JSON.stringify(d)).toBe(before);
  });
});

describe('the Accumulation planner: "Into ISAs and savings" and the ISA line', () => {
  it('the box is there, read, saved and loaded', () => {
    const box = doc.querySelector('#accumulation-content #acIsaMonthly');
    expect(box).not.toBeNull();
    expect(box.getAttribute('type')).toBe('number');
    expect(box.closest('.form-group').textContent).toMatch(/Into ISAs and savings \(£\/mo\)/);
    expect(fnBody('function readAccumulationInputs()', 1200)).toContain("isaMonthly: +document.getElementById('acIsaMonthly')?.value || 0");
    expect(fnBody('window.loadAccumulationUI', 2000)).toContain("set('acIsaMonthly', saved.isaMonthly)");
    expect(fnBody('window.recalcAccumulation', 6500)).toContain('accumulationTableHtml({ rows, mixOn: window._acMixOn, mixRealReturn, chargesPct: acCharges, stress: acStress, inputs: a })');
  });
  it('the ISA line follows the plan\'s choice, pays in, and ends where the Timing block\'s ISA at retirement does', () => {
    const inputs = { currentAge: 48, retirementAge: 60, isaMonthly: 300, escalationPct: 1 };
    const rowsP = projectAccumulation({ currentAge: 48, retirementAge: 60, potNow: 300000, totalMonthly: 1200 });
    const stressBase = { currentAge: 48, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60, equityMin: 200000, bondMin: 80000, cashTarget: 20000, isaBalance: 40000, chargesPct: 0.5 };
    const NOWT = new Date(2026, 8, 10);
    for (const v of ['cash', 'invested', undefined]) {
      const stress = { ...stressBase, ...(v ? { isaGrowth: v } : {}) };
      const isa = isaLineRows(stress, inputs);
      expect(isa.length).toBe(13);
      const timing = projectedPotAtRetirement(stress, { isaMonthly: 300, escalationPct: 1 }, NOWT);
      expect(timing.years).toBe(12);
      expect(Math.round(isa[12].potMid)).toBe(timing.isa);
      const html = accumulationTableHtml({ rows: rowsP, stress, inputs });
      expect(html).toContain('<th>ISA and savings</th>');
      expect(plain(html)).toContain(accumulationIsaNote(v || null, 300).replace(/&/g, '&'));
    }
    // "Mostly cash" grows slower than the middle rate; money going in counts
    const cash = isaLineRows({ ...stressBase, isaGrowth: 'cash' }, inputs), inv = isaLineRows({ ...stressBase, isaGrowth: 'invested' }, inputs);
    expect(cash[12].potMid).toBeLessThan(inv[12].potMid);
    expect(isaLineRows({ ...stressBase, isaGrowth: 'cash' }, { ...inputs, isaMonthly: 0 })[12].potMid).toBeLessThan(cash[12].potMid);
    expect(isaLineRows({ ...stressBase, isaBalance: 0, isaGrowth: 'cash' }, { ...inputs, isaMonthly: 0 })).toBeNull();
  });
});

describe('a plan made from a V7 answer carries the answer\'s choice', () => {
  const SAVED_ON = new Date(2026, 9, 2, 9, 30);
  const withChoice = (seed, isaGrowth) => ({ ...seed, inputs: { ...seed.inputs, isaGrowth } });
  it('the answer\'s choice, as chosen; none (an older tab) or an invalid one: "Mostly cash"', () => {
    for (const v of ['cash', 'invested']) {
      const seed = withChoice(seedA(), v);
      expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
      expect(seedToScenario(seed, SAVED_ON).yours.stressTool.settings.isaGrowth).toBe(v);
    }
    expect(seedToScenario(seedA(), SAVED_ON).yours.stressTool.settings.isaGrowth).toBe('cash');
    for (const v of ['Cash', 0.03, null, 'funds']) expect(seedToScenario(withChoice(seedA(), v), SAVED_ON).yours.stressTool.settings.isaGrowth).toBe('cash');
  });
  it('a couple: both plans carry the household\'s one choice; it never reaches the Decision settings', () => {
    const { yours, partner } = seedToScenario(withChoice(seedBCouple(), 'invested'), SAVED_ON);
    expect(yours.stressTool.settings.isaGrowth).toBe('invested');
    expect(partner.stressTool.settings.isaGrowth).toBe('invested');
    expect(yours.decisionTool.settings).not.toHaveProperty('isaGrowth');
  });
});
