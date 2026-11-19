/**
 * The one context of a run (lead4.md R1, R5; src/reading/context.js contextFor): the same day from either view's way of
 * holding it, the plan's own level, its own budget, its linked partner, and what the runs are priced on.
 */
import { describe, it, expect } from 'vitest';
import { contextFor, dayOfContext } from '../../src/reading/context.js';
import { marketStamp } from '../../src/reading/market.js';

const plan = (more = {}) => ({ id: 'a', createdAt: '2026-01-01T00:00:00Z', stressTool: { settings: { currentAge: 66 } }, ...more });

describe('contextFor', () => {
  it('one day from either view: "YYYY-MM-DD" (simple) and a Date (full) give the same noon', () => {
    const a = contextFor(plan(), { today: '2026-11-16' });
    const b = contextFor(plan(), { now: new Date(2026, 10, 16, 23, 30) });
    expect(a.now.getTime()).toBe(b.now.getTime());
    expect(a.now.getHours()).toBe(12);
    expect(a.today).toBe('2026-11-16');
    expect(dayOfContext({ today: '2026-11-16' }).getTime()).toBe(a.now.getTime());
  });
  it('the plan\'s level: its own choice, else the kept answer\'s chosen one, else Balanced', () => {
    expect(contextFor(plan(), { today: '2026-11-16' }).level).toBe('balanced');
    expect(contextFor(plan({ fromAnswer: { answer: { level: 'careful', levelChosen: true } } }), { today: '2026-11-16' }).level).toBe('careful');
    expect(contextFor(plan({ phases: { level: { level: 'bold', at: 'x' } }, fromAnswer: { answer: { level: 'careful', levelChosen: true } } }), { today: '2026-11-16' }).level).toBe('bold');
  });
  it('the plan\'s own budget, its linked partner, and the market as this context has it', () => {
    const p = plan({ household: { partnerScenarioId: 'b' }, budgetTool: { settings: { currentAge: 66 } } });
    const other = { id: 'b', createdAt: '2026-01-01T00:00:00Z' };
    const ctx = contextFor(p, { today: '2026-11-16', plans: [p, other, { id: 'c' }] });
    expect(ctx.budget).toEqual({ currentAge: 66 });
    expect(ctx.partnerPlan).toBe(other);
    expect(ctx.market).toEqual(marketStamp());
    expect(contextFor(plan(), { today: '2026-11-16' }).partnerPlan).toBeNull();
    expect(contextFor(plan(), { today: '2026-11-16' }).budget).toBeNull();
  });
});

/**
 * Every run of both views sees its plan through contextFor (lead4.md R1, R5): the simple view's run modules build their day
 * there, never from the date words by hand, and the full view's runs hand the engine the one clock, never a bare clock.
 */
import { readFileSync } from 'node:fs';
const src = (f) => readFileSync(f, 'utf8');
const RUNS = ['lastsRun', 'waysRun', 'mixRun', 'householdRun', 'moveRun', 'keepRun', 'stressPanelRun'].map((n) => `src/answers/plan/${n}.js`);

describe('every run is handed the one context', () => {
  it.each(RUNS)('%s builds its day through contextFor, never dateOf(today) by hand', (f) => {
    const s = src(f);
    expect(s).toMatch(/import \{[^}]*\bcontextFor\b[^}]*\} from '\.\.\/\.\.\/reading\/context\.js'/);
    expect(s).not.toMatch(/\bdateOf\(today\)/);
  });
  it('the stress rows judge a held ladder at the context\'s level, not one read beside it', () => {
    expect(src('src/answers/plan/stressPanelRun.js')).not.toMatch(/\bplanLevelOf\(/);
  });
  it('the full view\'s household checks see both plans from the one day (contextFor), as the simple view\'s do', () => {
    const page = src('index.html');
    const at = page.indexOf('window.runHouseholdCheck = async function');
    const body = page.slice(at, page.indexOf('\n    };\n', at));
    expect(body).toMatch(/contextFor\(own, \{ now: todayOf\(\), plans: scenarios \}\)/);
    expect(body).toMatch(/effectiveStressSettings\(own, \{ now \}\)/);
    expect(body).toMatch(/effectiveStressSettings\(partner, \{ now \}\)/);
    // the run, its timeline included, is the simple view's on that day (householdRun.js; tests/reading/householdGatherer.test.js)
    expect(body).toMatch(/runInWorker\('household', \{ plan: own, partner, today, limit \}\)/);
    expect(body).toMatch(/const today = dayKeyOf\(now\)/);
    expect(body).toMatch(/deriveTiming\(ownSettings, now\)/);
    expect(body).not.toMatch(/new Date\(\)/);
  });
  it('the full view\'s ladder position, order sheets and where-you-are read the one clock', () => {
    const page = src('index.html');
    const fn = (name) => { const a = page.indexOf(name); return page.slice(a, page.indexOf('\n    }\n', a)); };
    expect(fn('async function ladderPositionForPlan(')).not.toMatch(/new Date\(\)/);
    expect(fn('function exampleLadderHtml(')).not.toMatch(/new Date\(\)/);
    expect(page).not.toMatch(/whereAmI\(doc, \{ today: new Date\(\)/);
  });
});
