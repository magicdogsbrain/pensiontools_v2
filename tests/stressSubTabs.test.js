/**
 * 7.12.0 (the second walk's race hunt): pressing Stress tester → Settings while it is already open does not draw the form
 * again from the stored plan. The full view pressed it a second time 400 ms after a plan opened (homeBannerUi.pressOpeningSub
 * and the wizard's NextStep 'stress-settings'), over a way of drawing just pressed and figures just typed.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { installStressSubTabs, pressIfClosed } from '../src/ui/stressSubTabs.js';
import { pressOpeningSub } from '../src/ui/homeBannerUi.js';
import { nextStepAction } from '../src/services/NextStep.js';

const SUBS = ['montecarlo', 'historical', 'drawdown', 'stresssettings'];
function page() {
  document.body.innerHTML = SUBS.map((s) => '<button class="sub-tab' + (s === 'montecarlo' ? ' active' : '') + '" data-stresstab="' + s + '"></button>').join('')
    + SUBS.map((s) => '<div id="stress-' + s + '" class="stress-subtab' + (s === 'montecarlo' ? '' : ' hidden') + '"></div>').join('')
    + '<input id="ddDuration" value="35">';
  const calls = [];
  const deps = {
    loadStressSettings: async () => { calls.push('load'); },
    updateStrategyNote: () => calls.push('note'),
    getStressSettingsAsync: async () => ({ duration: 29 })
  };
  installStressSubTabs(document, window, deps);
  return { calls, deps, btn: (s) => document.querySelector('.sub-tab[data-stresstab="' + s + '"]') };
}
const settle = () => new Promise((r) => setTimeout(r, 0));

describe('the Stress tester sub-tabs', () => {
  let p;
  beforeEach(() => { p = page(); });

  it('Settings pressed from another sub-tab loads the form once and shows it', async () => {
    p.btn('stresssettings').click(); await settle();
    expect(p.calls).toEqual(['load']);
    expect(document.getElementById('stress-stresssettings').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('stress-montecarlo').classList.contains('hidden')).toBe(true);
  });

  it('Settings pressed again while it is open does not load the form again (what is typed stays)', async () => {
    p.btn('stresssettings').click(); await settle();
    p.btn('stresssettings').click(); await settle();
    p.btn('stresssettings').click(); await settle();
    expect(p.calls).toEqual(['load']);
  });

  it('leaving Settings and coming back loads it again', async () => {
    p.btn('stresssettings').click(); await settle();
    p.btn('montecarlo').click(); await settle();
    p.btn('stresssettings').click(); await settle();
    expect(p.calls).toEqual(['load', 'note', 'load']);
  });

  it('Drawdown starts from the plan\'s own length (29), not 35', async () => {
    p.btn('drawdown').click(); await settle(); await settle();
    expect(document.getElementById('ddDuration').value).toBe('29');
  });

  it('pressed again during a slow save: the last sub-tab pressed is the one shown, and it alone loads', async () => {
    let release;
    document.body.innerHTML = '<button class="sub-tab active" data-stresstab="montecarlo"></button><button class="sub-tab" data-stresstab="stresssettings"></button><div id="stress-montecarlo" class="stress-subtab"></div><div id="stress-stresssettings" class="stress-subtab hidden"></div>';
    const loads = [];
    let first = true;
    installStressSubTabs(document, window, { beforeChange: () => (first ? (first = false, new Promise((r) => { release = r; })) : Promise.resolve()), loadStressSettings: async () => loads.push('settings'), updateStrategyNote: () => loads.push('note') });
    document.querySelector('[data-stresstab="stresssettings"]').click();   // waits on the slow save
    await settle();
    document.querySelector('[data-stresstab="montecarlo"]').click();       // pressed on meanwhile
    await settle();
    release(); await settle(); await settle();
    expect(document.querySelector('.sub-tab.active').dataset.stresstab).toBe('montecarlo');
    expect(document.getElementById('stress-montecarlo').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('stress-stresssettings').classList.contains('hidden')).toBe(true);
    expect(loads).toEqual(['note']);
  });

  it('a save waiting to go is awaited before the press loads anything', async () => {
    const order = [];
    document.body.innerHTML = '<button class="sub-tab active" data-stresstab="montecarlo"></button><button class="sub-tab" data-stresstab="stresssettings"></button><div id="stress-montecarlo" class="stress-subtab"></div><div id="stress-stresssettings" class="stress-subtab hidden"></div>';
    installStressSubTabs(document, window, { beforeChange: async () => { await settle(); order.push('saved'); }, loadStressSettings: async () => order.push('load'), updateStrategyNote: () => {} });
    document.querySelector('[data-stresstab="stresssettings"]').click();
    await settle(); await settle(); await settle();
    expect(order).toEqual(['saved', 'load']);
  });
});

describe('the page\'s own delayed presses leave an open sub-tab alone', () => {
  const flush = () => new Promise((r) => setTimeout(r, 450));

  it('pressIfClosed presses a closed tab and leaves the open one', () => {
    const clicks = [];
    const open = { classList: { contains: () => true }, click: () => clicks.push('open') };
    const shut = { classList: { contains: () => false }, click: () => clicks.push('shut') };
    expect(pressIfClosed(open)).toBe(false);
    expect(pressIfClosed(shut)).toBe(true);
    expect(pressIfClosed(null)).toBe(false);
    expect(clicks).toEqual(['shut']);
  });

  it('pressOpeningSub: Settings already open (pressed by the person) is not pressed again', async () => {
    const clicks = [];
    const settings = { classList: { contains: (c) => c === 'active' }, click: () => clicks.push('settings') };
    const doc = { querySelector: () => settings };
    pressOpeningSub(window, doc, { tab: 'stress', sub: 'stresssettings' });
    await flush();
    expect(clicks).toEqual([]);
  });

  it('pressOpeningSub: Settings not open yet is pressed once', async () => {
    const clicks = [];
    const settings = { classList: { contains: () => false }, click: () => clicks.push('settings') };
    pressOpeningSub(window, { querySelector: () => settings }, { tab: 'stress', sub: 'stresssettings' });
    await flush();
    expect(clicks).toEqual(['settings']);
  });

  it('NextStep "stress-settings": Settings already open is not pressed again', async () => {
    const calls = [];
    const settings = { classList: { contains: (c) => c === 'active' }, click: () => calls.push('click') };
    const win = { switchToTab: (t) => calls.push('tab ' + t), scrollTo: () => calls.push('top'), document: { querySelector: () => settings } };
    nextStepAction({ kind: 'stress-settings' }, win)();
    await flush();
    expect(calls).toEqual(['tab stress', 'top']);
  });
});
