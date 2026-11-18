/**
 * 7.12.0 (lead decisions 1 and 13; the second walk: figures typed on Stress tester → Settings stayed on screen, the test ran
 * on them, and a reload, a sub-tab or a plan switch gave the stored figures back, with nothing said). On a plan not locked a
 * box saves when it changes and is valid, with "Saved" by the heading; a box with a problem says what beside it and "Not
 * saved yet"; nothing is written by opening or by a press that changes nothing; a save never lands on another plan.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ageProblem, moneyProblem, spDateProblem, problemsLine, FIELD_WORDS } from '../src/services/FieldChecks.js';
import { createAutosave, fingerprintOf, boxNameOf, stressKindOf } from '../src/ui/settingsAutosave.js';

const NOW = new Date(2026, 10, 17, 12);

describe('the checks a typed box runs (decision 13)', () => {
  it('an age is from 18 to 110', () => {
    expect(ageProblem('17')).toEqual({ id: 'age', words: 'Type an age from 18 to 110.', blocks: true });
    expect(ageProblem('18')).toBe(null);
    expect(ageProblem('110')).toBe(null);
    expect(ageProblem('111').id).toBe('age');
    expect(ageProblem('')).toBe(null);
    expect(ageProblem('', { badInput: true }).id).toBe('notANumber');
  });
  it('an amount is never below £0, and one over £50 million is asked about until confirmed', () => {
    expect(moneyProblem('-1')).toEqual({ id: 'negative', words: 'Type an amount of £0 or more.', blocks: true });
    expect(moneyProblem('0')).toBe(null);
    expect(moneyProblem('50000000')).toBe(null);
    expect(moneyProblem('50000001')).toEqual({ id: 'big', words: 'Over £50 million: is that right?', ask: true, blocks: true });
    expect(moneyProblem('50000001', { confirmed: true })).toBe(null);
  });
  it('a State Pension date that cannot be read says so, with what to type; a date of birth is refused; a past date is said and used', () => {
    expect(spDateProblem('2026-08', { now: NOW })).toEqual({ id: 'date', words: 'We could not read “2026-08” as a date. Type the day, the month and the year, like “6 August 2040”.', blocks: true });
    expect(spDateProblem('3 September 1962', { now: NOW }).id).toBe('birth');
    expect(spDateProblem('6 August 2026', { now: NOW })).toEqual({ id: 'past', words: FIELD_WORDS.past, blocks: false });
    expect(spDateProblem('6 August 2040', { now: NOW })).toBe(null);
  });
  it('the line by the heading names the one box, or counts them; a note that does not block says nothing there', () => {
    expect(problemsLine([{ box: 'Pension pot (£)', blocks: true }])).toBe('Not saved yet: “Pension pot (£)” needs a change (said beside it).');
    expect(problemsLine([{ box: 'a', blocks: true }, { box: 'b', blocks: true }])).toBe('Not saved yet: 2 boxes need a change (said beside each).');
    expect(problemsLine([{ box: 'a', blocks: false }])).toBe('');
  });
});

function form() {
  document.body.innerHTML = '<div id="f"><h2>Settings</h2>'
    + '<div class="form-group"><label>Pension pot (£)</label><input type="number" id="pot" value=""></div>'
    + '<div class="form-group"><label>Age today</label><input type="number" id="age" value="66"></div>'
    + '<button type="button" id="nothing">See more</button>'
    + '<button type="button" id="way" data-strat="x">A way</button></div>';
}
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

describe('a form that saves as it changes', () => {
  let saves, plan, locked, auto, state;
  beforeEach(async () => {
    form();
    saves = []; plan = 'PlanA'; locked = false; state = { way: null };
    auto = createAutosave(window, document, {
      root: () => document.getElementById('f'), heading: () => document.querySelector('#f h2'), testid: 'settings.saveState',
      include: () => true, state: () => state, kindOf: (el) => (el.id === 'pot' ? 'money' : el.id === 'age' ? 'age' : null),
      canSave: async () => !locked, planId: async () => plan, visible: () => true, byPerson: () => true, delay: 5,
      save: async () => { saves.push({ plan, pot: document.getElementById('pot').value, way: state.way }); return true; }
    });
    await auto.loaded();
  });
  const type = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
  const line = () => document.querySelector('[data-testid="settings.saveState"]')?.textContent || '';

  it('a box changed is saved a moment later, once, and the heading says Saved', async () => {
    type('pot', '300000');
    await tick(30);
    expect(saves).toEqual([{ plan: 'PlanA', pot: '300000', way: null }]);
    expect(line()).toBe('Saved');
  });

  it('opening writes nothing, and nor does a press that changes nothing', async () => {
    await auto.flush();
    document.getElementById('nothing').click();
    await tick(30);
    expect(saves).toEqual([]);
  });

  it('a press that changes the form (a way of drawing) is saved', async () => {
    state.way = 'x';
    document.getElementById('way').click();
    await tick(30);
    expect(saves.map((s) => s.way)).toEqual(['x']);
  });

  it('a box with a problem says what beside it and "Not saved yet", and nothing is written until it is put right', async () => {
    type('pot', '-5');
    await tick(30);
    expect(saves).toEqual([]);
    expect(document.querySelector('[data-testid="field.problem"]').textContent).toBe('Type an amount of £0 or more. Not saved yet.');
    expect(document.getElementById('pot').getAttribute('aria-invalid')).toBe('true');
    expect(line()).toBe('Not saved yet: “Pension pot (£)” needs a change (said beside it).');
    type('pot', '250000');
    await tick(30);
    expect(saves.map((s) => s.pot)).toEqual(['250000']);
    expect(document.querySelector('[data-testid="field.problem"]')).toBe(null);
    expect(line()).toBe('Saved');
  });

  it('over £50 million is asked about; "Yes, that is right" saves it', async () => {
    type('pot', '60000000');
    await tick(30);
    expect(saves).toEqual([]);
    const yes = document.querySelector('[data-testid="field.problem"] button');
    expect(yes.textContent).toBe('Yes, that is right');
    yes.click();
    await tick(30);
    expect(saves.map((s) => s.pot)).toEqual(['60000000']);
  });

  it('a change waiting to go is sent by flush (a sub-tab, a tab or a plan about to change)', async () => {
    type('pot', '410000');
    await auto.flush();
    expect(saves.map((s) => s.pot)).toEqual(['410000']);
  });

  it('never written into another plan opened meanwhile', async () => {
    type('pot', '410000');
    plan = 'PlanB';
    await tick(30);
    expect(saves).toEqual([]);
  });

  it('a locked plan saves nothing here', async () => {
    locked = true;
    type('pot', '410000');
    await tick(30);
    expect(saves).toEqual([]);
  });

  it('typed again while a save is going: that is saved too', async () => {
    form(); saves = [];   // a fresh form: only this one listens
    let release;
    const slow = createAutosave(window, document, {
      root: () => document.getElementById('f'), heading: () => document.querySelector('#f h2'), include: () => true, state: () => null, kindOf: () => null,
      canSave: async () => true, planId: async () => 'PlanA', visible: () => true, byPerson: () => true, delay: 5,
      save: async () => { saves.push(document.getElementById('pot').value); if (saves.length === 1) await new Promise((r) => { release = r; }); return true; }
    });
    await slow.loaded();
    type('pot', '1'); await tick(20);
    type('pot', '2'); await tick(20);
    release(); await tick(40);
    expect(saves).toEqual(['1', '2']);
  });
});

describe('the form\'s own pieces', () => {
  it('the fingerprint holds the boxes with an id and the state', () => {
    form();
    const root = document.getElementById('f');
    const a = fingerprintOf(root, { state: () => ({ s: 1 }) });
    document.getElementById('pot').value = '5';
    expect(fingerprintOf(root, { state: () => ({ s: 1 }) })).not.toBe(a);
  });
  it('a box is named by its own label', () => {
    form();
    expect(boxNameOf(document.getElementById('age'))).toBe('Age today');
  });
  it('the Stress settings checks: an age, an amount, the State Pension date, an income step\'s amount', () => {
    document.body.innerHTML = '<input id="tmAge"><input id="ssPot"><input id="ssSpStartDate"><div id="incomeStepsEditor"><input type="number" step="1000"><input type="number" min="40"></div>';
    const [age, pot, date, amount, from] = document.querySelectorAll('input');
    expect([age, pot, date, amount, from].map(stressKindOf)).toEqual(['age', 'money', 'spDate', 'money', 'age']);
  });
});

describe('a box still being typed in when the page moves on', () => {
  it('is saved by flush, though it has not been left yet (no change event)', async () => {
    document.body.innerHTML = '<div id="f"><h2>Settings</h2><input type="number" id="pot" value=""></div>';
    const saves = [];
    const auto = createAutosave(window, document, {
      root: () => document.getElementById('f'), heading: () => document.querySelector('#f h2'), testid: 'settings.saveState',
      include: () => true, state: () => null, kindOf: () => 'money', canSave: async () => true, planId: async () => 'PlanA',
      visible: () => true, byPerson: () => true, delay: 5, save: async () => { saves.push(document.getElementById('pot').value); return true; }
    });
    await auto.loaded();
    const box = document.getElementById('pot');
    box.focus(); box.value = '410000';               // typed, still in the box
    await auto.flush();
    expect(saves).toEqual(['410000']);
    await auto.loaded();                              // the same plan drawn again
    expect(document.querySelector('[data-testid="settings.saveState"]').textContent).toBe('Saved');
  });
});

describe('"Saved" is never shown while a change waits to go', () => {
  it('a second change after a save turns "Saved" into "Saving…" until it has gone', async () => {
    document.body.innerHTML = '<div id="f"><h2>Settings</h2><input type="number" id="pot" value=""><input type="number" id="isa" value=""></div>';
    let release = null;
    const auto = createAutosave(window, document, {
      root: () => document.getElementById('f'), heading: () => document.querySelector('#f h2'), testid: 'settings.saveState',
      include: () => true, state: () => null, kindOf: () => 'money', canSave: async () => true, planId: async () => 'PlanA',
      visible: () => true, byPerson: () => true, delay: 5, save: async () => { if (release === false) await new Promise((r) => { release = r; }); return true; }
    });
    await auto.loaded();
    const type = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
    const line = () => document.querySelector('[data-testid="settings.saveState"]').textContent;
    type('pot', '300000'); await tick(30);
    expect(line()).toBe('Saved');
    release = false;                                  // the next save is slow
    type('isa', '40000');
    expect(line()).toBe('Saving…');                   // at once, before it goes
    await tick(30);
    expect(line()).toBe('Saving…');
    release(); await tick(30);
    expect(line()).toBe('Saved');
  });
});

describe('"Saved" only when something was written (lead4.md R3)', () => {
  it('a press says what happened: saved, nothing to save, refused and why', async () => {
    const { SAVE_OUTCOME_WORDS, saveOutcomeToast } = await import('../src/ui/settingsAutosave.js');
    form();
    let refusal = null, plan = 'PlanA', saves = 0;
    const auto = createAutosave(window, document, {
      root: () => document.getElementById('f'), heading: () => document.querySelector('#f h2'), include: () => true, state: () => null,
      kindOf: () => null, canSave: async () => !refusal, refusal: async () => refusal, planId: async () => plan, visible: () => true, byPerson: () => true, delay: 5,
      save: async () => { saves += 1; return true; }
    });
    await auto.loaded();
    expect(await auto.run()).toBe('nothing');
    document.getElementById('pot').value = '1000';
    refusal = 'locked';
    expect(await auto.run()).toBe('locked');
    refusal = 'signedOut';
    expect(await auto.run()).toBe('signedOut');
    refusal = null; plan = 'PlanB';
    expect(await auto.run()).toBe('otherPlan');   // typed in plan A, never written into plan B
    expect(saves).toBe(0);
    plan = 'PlanA';
    expect(await auto.run()).toBe('saved');
    expect(saves).toBe(1);
    expect(saveOutcomeToast('saved')).toEqual({ words: SAVE_OUTCOME_WORDS.saved, kind: 'success' });
    expect(saveOutcomeToast('nothing').kind).toBe('info');
    expect(saveOutcomeToast('locked').words).toMatch(/locked/);
    expect(saveOutcomeToast('saved', 'Settings')).toEqual({ words: 'Settings saved.', kind: 'success' });
    expect(saveOutcomeToast('nothing', 'Settings')).toEqual({ words: 'Settings saved already: nothing has changed since.', kind: 'info' });
    expect(saveOutcomeToast('locked', 'Settings').words).toBe(SAVE_OUTCOME_WORDS.locked);
    for (const w of Object.values(SAVE_OUTCOME_WORDS)) expect(w).not.toMatch(/should|recommend/i);
  });
});
