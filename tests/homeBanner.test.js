/**
 * The classic page's next-step banner reads the plan home (7.10.0; spec-7100 §5; src/ui/homeBannerUi.js): one reading for both
 * apps, so the classic banner and the new app's home never give different to-dos.
 *
 *   - on the whole corpus list (09 and 10 both present, 18 closed with its successor) at three dates: the banner's to-do is the
 *     home's first, in the rail's words, with the button the home offers and the action the classic page can take;
 *   - nothing due: a draft gets the onboarding chain, a locked plan its stage's sentence;
 *   - the ✕: "Not now" stored on the plan for a to-do that may be put away, else the page's own "hide guidance";
 *   - reading writes nothing.
 * Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { homeBannerOf, showHomeBanner, installHomeBanner, entriesOf, dayOf, DISMISSED_KEY, updateHomeBanner, simpleLinkHref, openingTabOf } from '../src/ui/homeBannerUi.js';
import { homeOf } from '../src/answers/plan/home.js';
import { deriveStage, openingTab } from '../src/services/LifeStage.js';
import { holdingsLines } from '../src/services/HoldingsRecord.js';
import { planHasFigures } from '../src/services/DraftDecision.js';
import { nextStepFor } from '../src/services/NextStep.js';
import { PLAN } from '../src/v7/copy/plan.js';
import { HOME } from '../src/v7/copy/home.js';
import { phasesPatch } from '../src/services/Phases.js';
import { LAYOUT } from '../src/appLayout.js';
import { corpus, entriesAt, entryOf, noon, DATES, TODAY } from './v7/plan/_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

describe('the classic banner is the new app\'s home, on the whole corpus list, at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: the home's first to-do, in the rail's words, with its button and an action the classic page takes`, () => {
      const entries = entriesAt(today);
      expect(entries.map((e) => e.plan.id)).toEqual(expect.arrayContaining([C['09-couple-a'].id, C['10-couple-b'].id, C['18-moved-to-new-plan'].id, C['18-moved-to-new-plan-next'].id]));
      const before = JSON.stringify(entries.map((e) => e.plan));
      let seen = 0;
      for (const e of entries) {
        const h = homeOf(entries, e.plan.id, { today });
        const banner = homeBannerOf(entries, e.plan.id, { today, stage: deriveStage(e.plan, noon(today)), budget: {}, stress: {}, decision: {} });
        const first = h.todo.items[0];
        if (!first) { if (banner) expect(banner.id, e.plan.id).toBe(null); continue; }
        seen++;
        expect(banner.id, e.plan.id).toBe(first.id);
        expect(banner.html, e.plan.id).toBe(esc(first.planId ? banner.html : fill(PLAN.next[first.pid], first.slots)));
        expect(banner.html, e.plan.id).not.toMatch(/\{\w+\}/);
        expect(banner.btn, e.plan.id).toBeTruthy();
        // Moved on purpose (the walk): a month to record opens Monthly Entry on that month, not on this one
        if (first.id.startsWith('month.')) expect(banner.action, e.plan.id).toEqual(first.planId ? { kind: 'plan', planId: first.planId } : ['month.record', 'month.gap'].includes(first.id) ? { kind: 'tab', tab: 'decision', sub: 'entry', month: first.button.month } : { kind: 'tab', tab: 'decision' });
        else if (first.id === 'closed.next') expect(banner.action, e.plan.id).toEqual({ kind: 'plan', planId: first.button.href.replace('#/plan/', '') });
        else expect(banner.action, e.plan.id).toEqual({ kind: 'v7', href: LAYOUT.classic.v7 + first.button.href });
        expect(banner.dismiss, e.plan.id).toEqual(first.dismiss && !first.planId ? { kind: 'task', key: first.key } : { kind: 'banner' });
        if (['month.record', 'month.gap'].includes(first.id) && !first.planId) expect(banner.btn, e.plan.id).toContain(new Date(first.button.month + '-15').toLocaleString('en-GB', { month: 'long' }));
      }
      expect(seen).toBeGreaterThan(5);
      expect(JSON.stringify(entries.map((e) => e.plan))).toBe(before);
    });
  }
  it('"Record {month}" opens Monthly Entry on that month: its action carries the month the button names (the walk)', () => {
    let found = 0;
    for (const today of DATES) {
      const entries = entriesAt(today);
      for (const e of entries) {
        const h = homeOf(entries, e.plan.id, { today });
        const first = h.todo.items[0];
        if (!first || first.planId || !['month.record', 'month.gap'].includes(first.id)) continue;
        found++;
        const banner = homeBannerOf(entries, e.plan.id, { today, stage: deriveStage(e.plan, noon(today)) });
        expect(banner.action, e.plan.id).toEqual({ kind: 'tab', tab: 'decision', sub: 'entry', month: first.button.month });
        expect(first.button.month < today.slice(0, 7) || first.button.month === today.slice(0, 7)).toBe(true);
      }
    }
    expect(found).toBeGreaterThan(0);
  });
  it('a closed plan with its successor: "carry on in …", opening that plan; 6 April 2027 on a plan living on its money: the tax year, put away "Not now"', () => {
    const entries = entriesAt(TODAY);
    const closed = homeBannerOf(entries, C['18-moved-to-new-plan'].id, { today: TODAY, stage: deriveStage(C['18-moved-to-new-plan'], noon(TODAY)) });
    expect(closed).toMatchObject({ id: 'closed.next', action: { kind: 'plan', planId: C['18-moved-to-new-plan-next'].id }, dismiss: { kind: 'banner' } });
    expect(closed.html).toContain('carry on in ‘Pots and valves from April 2025’');
    const april = entriesAt('2027-04-06');
    const ty = homeBannerOf(april, C['04-buckets-running'].id, { today: '2027-04-06', stage: deriveStage(C['04-buckets-running'], noon('2027-04-06')) });
    expect(ty).toMatchObject({ id: 'month.taxYear', html: 'Next: set up the 2027/28 tax year.', btn: 'Set up 2027/28', action: { kind: 'tab', tab: 'decision' }, dismiss: { kind: 'task', key: 'month.taxYear@2027/28' } });
  });
  it('nothing due: a draft gets the onboarding chain; a locked plan its stage\'s sentence; a plan shown as saved nothing', () => {
    const entries = entriesAt(TODAY);
    const draft = C['02-pnv-draft'];
    const stage = deriveStage(draft, noon(TODAY));
    expect(homeBannerOf(entries, draft.id, { today: TODAY, stage, budget: {}, stress: {}, decision: {} })).toEqual({ ...nextStepFor({ stage, budget: {}, stress: {}, decision: {} }), dismiss: { kind: 'banner' }, id: null });
    const saver = C['05-saver-committed'];
    const st = deriveStage(saver, noon(TODAY));
    const b = homeBannerOf(entries, saver.id, { today: TODAY, stage: st });
    expect(b).toEqual(st.banner ? { ...nextStepFor({ stage: st, budget: {}, stress: {}, decision: {} }), dismiss: { kind: 'banner' }, id: null } : null);
    const newer = entries.map((e) => (e.plan.id === C['04-buckets-running'].id ? { ...e, newer: true } : e));
    expect(homeBannerOf(newer, C['04-buckets-running'].id, { today: TODAY, stage: deriveStage(C['04-buckets-running'], noon(TODAY)) })).toBe(null);
  });
  it('nothing due on a plan Moving by its agreement: the new app\'s own line that it was accepted, with the way to its review — never the onboarding chain', () => {
    const day = '2026-10-02';
    const raw = copy(C['19-back-to-work-saving']);
    const at = day + 'T11:00:00.000Z';
    const plan = entryOf(raw, day).plan;
    const ph = phasesPatch(plan, 'moving.agreed', { strategyId: (plan.stressTool.settings.strategyId || 'pots-and-valves'), how: 'asHeld', heldPct: 90, entryAt: at }, { at }).phases;
    const agreed = { ...raw, phases: ph };
    const entries = [entryOf(agreed, day)];
    const h = homeOf(entries, agreed.id, { today: day });
    expect(h.moveWindow).toMatchObject({ id: 'agreed' });
    const b = homeBannerOf(entries, agreed.id, { today: day, stage: deriveStage(agreed, noon(day)), budget: {}, stress: {}, decision: {} });
    expect(b).toEqual({ html: esc(fill(HOME.moveWindow.agreed, h.moveWindow.slots)), btn: HOME.review.link, action: { kind: 'v7', href: LAYOUT.classic.v7 + '#/plan/' + agreed.id + '/review' }, dismiss: { kind: 'banner' }, id: null });
    expect(b.html).toMatch(/^You accepted what you hold on 2 October 2026\. You stop work in /);
  });
  it('the plans as the new app reads them: each brought up to date in memory, never written', () => {
    const raws = Object.values(C).map(copy);
    const before = JSON.stringify(raws);
    const got = entriesOf(raws, noon(TODAY));
    expect(got.map((e) => e.plan.id)).toEqual(entriesAt(TODAY).map((e) => e.plan.id));
    expect(JSON.stringify(got.map((e) => e.plan))).toBe(JSON.stringify(entriesAt(TODAY).map((e) => e.plan)));
    expect(JSON.stringify(raws)).toBe(before);
    expect(dayOf(new Date(2027, 3, 6, 12))).toBe('2027-04-06');
  });
});

describe('the banner on the page and its ✕', () => {
  /** A page with the banner's four elements and a window with storage. */
  function page() {
    const el = (id) => ({ id, style: { display: 'none' }, innerHTML: '', textContent: '', title: '', onclick: null });
    const x = el('x');
    const els = { nextStepBanner: { ...el('nextStepBanner'), querySelector: () => x }, nextStepText: el('nextStepText'), nextStepBtn: el('nextStepBtn') };
    const doc = { getElementById: (id) => els[id] || null };
    const mem = new Map();
    const win = { localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)) }, location: { href: '/classic/' } };
    return { doc, win, els, x, mem };
  }
  const depsFor = (raws, activeId, today, more = {}) => ({
    stage: deriveStage(raws.find((r) => r.id === activeId), noon(today)),
    getActiveScenarioId: async () => activeId, listScenariosAsync: async () => raws.map(copy),
    getBudgetAsync: async () => ({}), getStressSettingsAsync: async () => ({}), getDecisionSettingsAsync: async () => ({}), planFromAnswer: async () => null,
    now: () => noon(today), ...more
  });
  it('a to-do that may be put away: drawn, its ✕ "Not now" stored on the plan; the page\'s own "hide guidance" never hides it', async () => {
    const raws = Object.values(C);
    const id = C['04-buckets-running'].id;
    const p = page();
    const step = await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY));
    expect(step).toMatchObject({ id: 'month.record', dismiss: { kind: 'task', key: 'month.record@2026-10' } });
    expect(p.els.nextStepBanner.style.display).toBe('flex');
    expect(p.els.nextStepText.innerHTML).toBe('Next: record October 2026.');
    expect(p.els.nextStepBtn.textContent).toBe('Record October');
    expect(p.x.title).toBe('Not now');
    // an old "hide guidance" on this plan hides only what it hid before
    p.mem.set(DISMISSED_KEY + id, '1');
    await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY));
    expect(p.els.nextStepBanner.style.display).toBe('flex');
    const saved = [];
    installHomeBanner(p.win, p.doc, { saveActivePlanTasks: async (key) => { saved.push(key); }, getActiveScenarioId: async () => id });
    await p.win.dismissNextStep();
    expect(saved).toEqual(['month.record@2026-10']);
    expect(p.els.nextStepBanner.style.display).toBe('none');
  });
  it('anything else, and the onboarding chain: the ✕ hides guidance for this plan, as before', async () => {
    const raws = Object.values(C);
    const id = C['02-pnv-draft'].id;
    const p = page();
    const step = await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY));
    expect(step).toMatchObject({ dismiss: { kind: 'banner' }, id: null });
    expect(p.els.nextStepBanner.style.display).toBe('flex');
    expect(p.x.title).toBe('Hide guidance for this plan');
    const saved = [];
    installHomeBanner(p.win, p.doc, { saveActivePlanTasks: async (key) => { saved.push(key); }, getActiveScenarioId: async () => id });
    await p.win.dismissNextStep();
    expect(saved).toEqual([]);
    expect(p.mem.get(DISMISSED_KEY + id)).toBe('1');
    expect(p.els.nextStepBanner.style.display).toBe('none');
    await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY));
    expect(p.els.nextStepBanner.style.display).toBe('none');
  });
  it('updateHomeBanner (7.11.0, index.html\'s updateNextStepBanner): the newer-plan banner, then the stage, then the plans are read; a stage that throws still draws the banner, with no stage', async () => {
    const raws = Object.values(C);
    const id = C['04-buckets-running'].id;
    const order = [];
    const p = page();
    const base = depsFor(raws, id, TODAY);
    const stage = base.stage;
    const deps = { ...base, stage: undefined,
      showPlanNewerBanner: () => { order.push('newer'); },
      refreshLifeStage: async () => { order.push('stage'); return stage; },
      listScenariosAsync: async () => { order.push('plans'); return raws.map(copy); } };
    const step = await updateHomeBanner(p.win, p.doc, deps);
    expect(order).toEqual(['newer', 'stage', 'plans']);
    expect(step).toEqual(await showHomeBanner(page().win, page().doc, depsFor(raws, id, TODAY)));
    expect(p.els.nextStepText.innerHTML).toBe('Next: record October 2026.');
    // the stage throws: the banner is still drawn, read with no stage (as the inline function did)
    const q = page();
    const seen = [];
    const thrown = await updateHomeBanner(q.win, q.doc, { ...deps, showPlanNewerBanner: () => {}, refreshLifeStage: async () => { throw new Error('no stage'); }, getBudgetAsync: async () => { seen.push('read'); return {}; } });
    expect(seen).toEqual(['read']);
    expect(thrown).toEqual(await showHomeBanner(page().win, page().doc, { ...depsFor(raws, id, TODAY), stage: null }));
    expect(q.els.nextStepBanner.style.display).toBe('flex');
    const draft = C['02-pnv-draft'].id;
    const r = page();
    expect(await updateHomeBanner(r.win, r.doc, { ...depsFor(raws, draft, TODAY), showPlanNewerBanner: () => {}, refreshLifeStage: async () => { throw new Error('no stage'); } }))
      .toEqual(homeBannerOf(entriesAt(TODAY), draft, { today: TODAY, stage: null, budget: {}, stress: {}, decision: {} }));
  });
  it('the way back to the simple view (#classicToSimple, 7.11.0) follows the open plan; without the element nothing else changes', async () => {
    expect(simpleLinkHref('A1')).toBe(LAYOUT.classic.v7 + '#/plan/A1');
    expect(simpleLinkHref(null)).toBe(LAYOUT.classic.v7 + '#/');
    expect(simpleLinkHref('a b')).toBe(LAYOUT.classic.v7 + '#/');
    expect(simpleLinkHref('')).toBe(LAYOUT.classic.v7 + '#/');
    if (LAYOUT.classic.v7 === '../') expect(simpleLinkHref('A1')).toBe('../#/plan/A1');
    const raws = Object.values(C);
    const id = C['04-buckets-running'].id;
    const withLink = () => {
      const p = page();
      const link = { attrs: { href: LAYOUT.classic.v7 + '#/' }, setAttribute(k, v) { this.attrs[k] = String(v); } };
      const get = p.doc.getElementById;
      p.doc.getElementById = (x) => (x === 'classicToSimple' ? link : get(x));
      return { ...p, link };
    };
    const p = withLink();
    await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY));
    expect(p.link.attrs.href).toBe(LAYOUT.classic.v7 + '#/plan/' + id);
    // a plan with nothing to show still points the way back at it; no plan open: the front door
    const draft = withLink();
    draft.win.localStorage.setItem(DISMISSED_KEY + C['02-pnv-draft'].id, '1');
    await showHomeBanner(draft.win, draft.doc, depsFor(raws, C['02-pnv-draft'].id, TODAY));
    expect(draft.els.nextStepBanner.style.display).toBe('none');
    expect(draft.link.attrs.href).toBe(LAYOUT.classic.v7 + '#/plan/' + C['02-pnv-draft'].id);
    const none = withLink();
    await showHomeBanner(none.win, none.doc, depsFor(raws, id, TODAY, { getActiveScenarioId: async () => null }));
    expect(none.link.attrs.href).toBe(LAYOUT.classic.v7 + '#/');
    // no such element (the rollback layout draws no line): the banner exactly as before
    const bare = page();
    expect(await showHomeBanner(bare.win, bare.doc, depsFor(raws, id, TODAY))).toEqual(await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY)));
  });
  it('the full view\'s opening tab (7.11.0, openingTabOf): Transition exactly for a plan whose home reads Moving, else the stage\'s own, on the whole corpus at three dates; nothing written', async () => {
    let moving = 0;
    for (const today of DATES) {
      const raws = Object.values(C).map(copy);
      const before = JSON.stringify(raws);
      const entries = entriesAt(today);
      for (const e of entries) {
        const raw = raws.find((r) => r.id === e.plan.id);
        const stage = deriveStage(raw, noon(today));
        const tab = await openingTabOf({ refreshLifeStage: async () => stage, getActiveScenarioId: async () => e.plan.id, listScenariosAsync: async () => raws }, noon(today));
        const phase = homeOf(entries, e.plan.id, { today }).stage.key;
        const opts = { held: holdingsLines(raw.holdings).length > 0, figures: planHasFigures(raw) };
        if (phase === 'moving') { moving++; expect(tab.tab, `${today} ${e.plan.id}`).toBe(stage.locked ? (opts.held ? 'transition' : 'decision') : 'stress'); }
        else expect(tab, `${today} ${e.plan.id} ${phase}`).toEqual(openingTab(stage, phase, opts));
      }
      expect(JSON.stringify(raws)).toBe(before);
    }
    expect(moving).toBeGreaterThan(0);
    // the plans cannot be read: the stage's own tab, as before
    const saver = C['05-saver-committed'];
    const st = deriveStage(saver, noon(TODAY));
    expect(await openingTabOf({ refreshLifeStage: async () => st, getActiveScenarioId: async () => saver.id, listScenariosAsync: async () => { throw new Error('offline'); } }, noon(TODAY))).toEqual(openingTab(st));
    expect(await openingTabOf({ refreshLifeStage: async () => null, getActiveScenarioId: async () => null, listScenariosAsync: async () => [] }, noon(TODAY))).toEqual({ tab: 'decision', sub: null });
  });
  it('a refused write leaves the banner as it was; no plan: nothing drawn', async () => {
    const raws = Object.values(C);
    const id = C['04-buckets-running'].id;
    const p = page();
    await showHomeBanner(p.win, p.doc, depsFor(raws, id, TODAY));
    installHomeBanner(p.win, p.doc, { saveActivePlanTasks: async () => { throw new Error('refused'); }, getActiveScenarioId: async () => id });
    await p.win.dismissNextStep();
    expect(p.els.nextStepBanner.style.display).toBe('flex');
    const q = page();
    expect(await showHomeBanner(q.win, q.doc, depsFor(raws, id, TODAY, { getActiveScenarioId: async () => null }))).toBe(null);
    expect(q.els.nextStepBanner.style.display).toBe('none');
  });
});
