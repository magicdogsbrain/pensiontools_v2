/**
 * "Your household", once checked, says what the check starts from (7.12.0): each plan's pension and ISA at its own start,
 * and their sum, beside the verdict — so a change of stop age shows where it moves the check. The named state
 * household-ran (fictional), its reading refreshed as the plan source does.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';

const load = (name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/plan', `${name}.json`), 'utf8'));
const money = (s) => Number(String(s).replace(/[£,]/g, ''));

describe('the household check says what it starts from', () => {
  it('household-ran: "The check starts from £T in pensions and ISAs: £a in ‘A’ …, and £b in ‘B’ …", with T = a + b', () => {
    const stored = load('household-ran');
    let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
    state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
    const root = document.createElement('div'); root.id = 'app';
    render(h(App, { state, dispatch: () => {} }), root);
    const line = root.querySelector('[data-testid="plan.household.starts"]');
    expect(line).not.toBe(null);
    const m = /^The check starts from (£[\d,]+) in pensions and ISAs: (£[\d,]+) in ‘.+?’ .+?, and (£[\d,]+) in ‘.+?’ .+\.$/.exec(visibleText(line).trim());
    expect(m).not.toBe(null);
    expect(money(m[1])).toBe(money(m[2]) + money(m[3]));
  });
});
