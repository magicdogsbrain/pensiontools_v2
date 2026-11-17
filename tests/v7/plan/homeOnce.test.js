/**
 * Each fact once on a plan's home (7.10.0; research/v7/replan-nov-2026.md §6.4: the phase, the next review and at most one
 * thing due — nothing due is nothing in To do):
 *   - nothing due is only the nothing-due line: a plan living on its money and not locked yet says the review's line in To do,
 *     and that its months wait for the lock only on the Month by month tool;
 *   - the line under the headline says only what the headline, the move window's line and To do do not ("Locked {date}."
 *     beside it, or alone): never the phase again ("Inside the move window", "Retired. Plan not locked yet."), never the stop
 *     the window's line or "Did you stop work in …?" says, never a closed plan's month its to-do says;
 *   - a partner's line on the household step reads their plan's phase (LifeStage.stageOf), as their own pages do — a partner
 *     past their stop is never "inside the move window".
 * Fixtures are the committed plans (tests/v7/plan/_plans.js) and the named home states; all fictional.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { planPage, stageLine } from '../../../src/answers/plan/read.js';
import { householdOf } from '../../../src/answers/plan/household.js';
import { planStage } from '../../../src/services/PlanReading.js';
import { phasesPatch } from '../../../src/services/Phases.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, withTasks, stateWith, noon, DATES } from './_plans.js';

const C = corpus();
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
const DIR = join(process.cwd(), 'tests/v7/states/plan');
const HOMES = readdirSync(DIR).filter((f) => f.startsWith('home-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const T = 'plan.home';
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
function draw(stored) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  return drawState(state);
}
function drawState(state) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: () => {} }), root);
  return { root, text: visibleText(root) };
}
/** The words that say the phase or the stop again under a headline that says it already. */
const PHASE_AGAIN = /move window|Still saving|Retired\.|Living on the plan|Plan locked|not locked yet|Still working until/;
/** The dates the stage tests read, and one past 10's stop (January 2030), where it is asked whether work has stopped. */
const DAYS = [...DATES, '2030-10-02'];
/** The words of the line under the headline, as the home draws it. */
const headWords = (h) => [h.headLine ? fill(HOME.headLine[h.headLine.id] || PLAN.stageLines[h.headLine.id], h.headLine.slots) : '', h.lockedOn ? fill(PLAN.page.lockedOn, { date: h.lockedOn }) : ''].filter(Boolean).join(' ');

describe('nothing due is only the nothing-due line (7.10.0)', () => {
  it('a plan living on its money and not locked yet says the review\'s line in To do; its months waiting for the lock are said on the Month by month tool', () => {
    let seen = 0;
    for (const today of DAYS) {
      const entries = entriesAt(today);
      for (const e of entries) {
        const h = homeOf(entries, e.plan.id, { today });
        if (!h.found || h.stage.key !== 'drawing' || h.locked || h.todo.count) continue;
        seen++;
        expect(['review', 'reviewAny'], `${e.plan.id} ${today}`).toContain(h.quiet.id);
        expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toMatch(/^Nothing due\. /);
        const month = h.tools.find((t) => t.id === 'month');
        expect(month && month.result.text, `${e.plan.id} ${today}`).toBe('Months are recorded once the plan is locked');
      }
    }
    expect(seen).toBeGreaterThan(5);
    // no nothing-due line says anything about the lock
    for (const [id, words] of Object.entries(HOME.quiet)) expect(words, id).not.toMatch(/lock/i);
  });
  it('drawn: "Living on it. Not locked yet." with nothing due — To do holds the nothing-due line and the way to a review, and nothing else', () => {
    const { root } = draw(load('home-draft-retired'));
    const todo = one(root, `${T}.todo`);
    expect(todo.querySelectorAll('.home-item')).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. You can review your plan whenever you like.');
    expect(one(root, `${T}.review`)).toBe(null);
    expect(one(root, `${T}.review.now`).textContent).toBe(HOME.review.link);
    expect(visibleText(todo)).not.toContain('Months are recorded once the plan is locked');
    expect([...todo.querySelectorAll('p')].map((p) => p.textContent)).toEqual(['Nothing due. You can review your plan whenever you like.', HOME.review.link]);
    // the months' note stays on the tool that records them
    expect(one(root, `${T}.tool.month`).textContent).toContain('Months are recorded once the plan is locked');
  });
});

describe('the line under the headline says only what nothing above it says (7.10.0)', () => {
  it('every committed plan, at every date: never the phase or the stop again; a ladder\'s first gilt and back to work in their own words', () => {
    const SAID_ABOVE = ['saving', 'approaching', 'committed-saving', 'draft-retired', 'running'];
    for (const today of DAYS) {
      const entries = entriesAt(today);
      for (const e of entries) {
        const h = homeOf(entries, e.plan.id, { today });
        if (!h.found) continue;
        const where = `${e.plan.id} ${today} (${h.line && h.line.id})`;
        expect(headWords(h), where).not.toMatch(PHASE_AGAIN);
        if (h.line && SAID_ABOVE.includes(h.line.id)) expect(h.headLine, where).toBe(null);
        if (h.line && h.line.id === 'running-ladder') expect(h.headLine, where).toEqual({ id: 'ladder', slots: h.line.slots });
        // a closed plan's month and the plan that carries it on are said by its to-do (or its nothing-due line), once
        if (h.todo.items.some((x) => x.id === 'closed.next')) expect(['backToWork', undefined], where).toContain(h.headLine ? h.headLine.id : undefined);
        // a plan locked says when, alone or after the line
        if (h.lockedOn) expect(headWords(h), where).toMatch(new RegExp(`Locked ${h.lockedOn}\\.$`));
      }
    }
    // by name: the ladder still before its first gilt, and the plan closed for going back to work
    const at = entriesAt('2026-10-02');
    expect(headWords(homeOf(at, C['20-locked-start-after-stop'].id, { today: '2026-10-02' }))).toBe('Your ladder’s first gilt pays from April 2029. Locked 1 July 2026.');
    expect(headWords(homeOf(at, C['19-back-to-work'].id, { today: '2026-10-02' }))).toBe('You went back to work. Locked 1 October 2023.');
    expect(headWords(homeOf(at, C['18-moved-to-new-plan'].id, { today: '2026-10-02' }))).toBe('Locked 20 August 2023.');
    expect(headWords(homeOf(at, C['05-saver-committed'].id, { today: '2026-10-02' }))).toBe('Locked 15 July 2026.');
    expect(headWords(homeOf(at, C['02-pnv-draft'].id, { today: '2026-10-02' }))).toBe('');
  });
  it('past the stop on a plan not locked: "Did you stop work in …?" says the stop; put off, the line says it instead', () => {
    const today = '2030-10-02';
    const e = entryOf(C['10-couple-b'], today);
    const h = homeOf([e], e.plan.id, { today });
    expect(h.stage.key).toBe('moving');
    expect(h.todo.items.map((x) => x.id)).toEqual(['plan.confirmStop']);
    expect(h.line).toEqual({ id: 'pastStop', slots: { month: 'January 2030' } });
    expect(h.headLine).toBe(null);
    expect(h.moveWindow).toBe(null);
    const key = h.todo.items[0].key;
    const off = entryOf(withTasks(C['10-couple-b'], [key], { until: '2030-11', at: today + 'T12:00:00.000Z' }), today);
    const h2 = homeOf([off], off.plan.id, { today });
    expect(h2.todo.items.map((x) => x.id)).not.toContain('plan.confirmStop');
    expect(headWords(h2)).toBe('Your plan has you stopping work in January 2030.');
  });
  for (const name of HOMES) {
    it(`${name} drawn: the headline, the line under it, the window's line and To do say each sentence once, and never the phase twice`, () => {
      const { root } = draw(load(name));
      const head = one(root, `${T}.headline`).textContent;
      const line = one(root, 'plan.stageLine');
      // drawn only when it has something to say: never an empty line
      if (line) expect(line.textContent.trim()).not.toBe('');
      if (line && head !== HOME.headline.none) expect(line.textContent, name).not.toMatch(PHASE_AGAIN);
      const parts = [head, line ? line.textContent : '', one(root, `${T}.moveWindow`) ? one(root, `${T}.moveWindow`).textContent : '', visibleText(one(root, `${T}.todo`))];
      const sentences = parts.join(' ').split(/(?<=\.)\s+/).map((s) => s.trim()).filter((s) => s.length > 12);
      expect(sentences.filter((s, i) => sentences.indexOf(s) !== i), name).toEqual([]);
    });
  }
  it('drawn by name: Moving says the window once; Living on it, not locked, says the headline alone; a locked plan, when it was locked', () => {
    const moving = draw(load('home-moving')).root;
    expect(one(moving, `${T}.headline`).textContent).toBe('Moving.');
    expect(one(moving, 'plan.stageLine')).toBe(null);
    expect(one(moving, `${T}.moveWindow`).textContent).toMatch(/^You stop work in \w+ \d{4}, in your move window: [\w ]+ left\./);
    const draft = draw(load('home-draft-retired')).root;
    expect(one(draft, `${T}.headline`).textContent).toBe('Living on it. Not locked yet.');
    expect(one(draft, 'plan.stageLine')).toBe(null);
    expect(one(draw(load('home-locked-saver')).root, 'plan.stageLine').textContent).toBe('Locked 15 July 2026.');
    expect(one(draw(load('home-drawing')).root, 'plan.stageLine').textContent).toMatch(/^Locked \d{1,2} [A-Z][a-z]+ \d{4}\.$/);
    expect(one(draw(load('home-saving')).root, 'plan.stageLine')).toBe(null);
    // every other page of the plan keeps the plan's own line: there it is under the page's title, not the phase
    const { root: about } = drawState(stateWith(entriesAt('2027-04-06'), '#/plan/' + C['10-couple-b'].id + '/about', { today: '2027-04-06' }));
    expect(one(about, 'plan.stageLine').textContent).toBe(PLAN.stageLines.approaching);
  });
});

describe('a partner\'s line reads their plan\'s phase (7.10.0, LifeStage.stageOf)', () => {
  it('a partner past their stop, not locked: "their plan has them stopping work in …", never "inside the move window" — on the step and on "Your household"', () => {
    const today = '2030-10-02';
    const entries = entriesAt(today);
    const a = entries.find((e) => e.plan.id === C['09-couple-a'].id);
    const b = entries.find((e) => e.plan.id === C['10-couple-b'].id);
    // the placing alone still reads "inside the move window" past the stop: the phase is what the line follows
    expect(stageLine(planStage(b.plan, { now: noon(today) }), b.plan).id).toBe('approaching');
    expect(planPage(entries, b.plan.id, null, { today }).life).toMatchObject({ key: 'moving', confirmStop: true });
    const step = planPage(entries, a.plan.id, 'household', { today }).steps.find((s) => s.id === 'household');
    expect(step.theirLine).toEqual({ id: 'pastStop', slots: { month: 'January 2030' } });
    expect(step.lines.map((l) => l.theirLine)).toEqual([{ id: 'pastStop', slots: { month: 'January 2030' } }]);
    expect(householdOf(entries, a.plan.id, { today }).partner.line).toEqual({ id: 'pastStop', slots: { month: 'January 2030' } });
    const { root } = drawState(stateWith(entries, '#/plan/' + a.plan.id + '/household', { today }));
    const said = one(root, 'plan.household.with').textContent;
    expect(said).toContain('their plan has them stopping work in January 2030.');
    expect(said).not.toMatch(/move window/);
  });
  it('at every date, every partner\'s line is the line their own plan\'s pages say', () => {
    let seen = 0;
    for (const today of DAYS) {
      const entries = entriesAt(today);
      for (const e of entries) {
        const step = planPage(entries, e.plan.id, 'household', { today }).steps.find((s) => s.id === 'household');
        for (const l of (step && step.lines) || []) {
          const theirs = planPage(entries, l.theirId, null, { today });
          if (theirs.closing) continue;
          expect(l.theirLine, `${e.plan.id} → ${l.theirId} ${today}`).toEqual(theirs.line);
          expect(PLAN.theirLines[l.theirLine.id], l.theirLine.id).toBeTruthy();
          seen++;
        }
      }
    }
    expect(seen).toBeGreaterThan(4);
  });
});

describe('a saver\'s line names the phase, never the placing\'s own five years (7.10.0)', () => {
  it('every committed plan not locked, every window from one to five years, every date: "Still saving." outside the window, the window\'s words inside it', () => {
    const AT = '2026-10-01T12:00:00.000Z';
    const seen = { saving: 0, moving: 0 };
    for (const today of [...DAYS, '2028-10-02', '2029-06-02']) {
      for (const years of [1, 2, 3, 4, 5]) {
        const raws = Object.values(C).map((p) => ({ ...p, ...phasesPatch(p, 'window', years, { at: AT }) }));
        const entries = entriesAt(today, raws);
        for (const e of entries) {
          const pg = planPage(entries, e.plan.id, null, { today });
          if (!pg.found || !pg.life || !pg.line || pg.life.confirmStop) continue;
          const placing = planStage(e.plan, { now: noon(today) }).key;
          if (placing !== 'saving' && placing !== 'approaching') continue;
          const where = `${e.plan.id} ${today} window ${years} (placing ${placing}, phase ${pg.life.key})`;
          if (pg.life.key === 'saving') { seen.saving++; expect(pg.line.id, where).toBe('saving'); }
          if (pg.life.key === 'moving') { seen.moving++; expect(pg.line.id, where).toBe('approaching'); }
        }
      }
    }
    expect(seen.saving).toBeGreaterThan(5);
    expect(seen.moving).toBeGreaterThan(5);
  });
  it('a plan placed only by the Accumulation tab\'s ages, two years from its stop: the stop has no date, so it reads Saving and says "Still saving."', () => {
    const today = '2026-10-02';
    const raw = C['01-fresh-default'];
    const plan = { ...raw, accumulationTool: { ...(raw.accumulationTool || {}), settings: { ...((raw.accumulationTool || {}).settings || {}), currentAge: 63, retirementAge: 65 } } };
    const entries = entriesAt(today, [plan]);
    const pg = planPage(entries, plan.id, null, { today });
    expect(planStage(entries[0].plan, { now: noon(today) }).key).toBe('approaching');
    expect(pg.life.key).toBe('saving');
    expect(pg.line).toEqual({ id: 'saving', slots: {} });
  });
});
