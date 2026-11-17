/**
 * The home says the month work stops, and how far off it is, in years and months (7.12.0). Fictional Sam
 * (tests/helpers/samMove.js), locked, stopping work in October 2027:
 *   on 16 November 2026, November 2026 to October 2027 is 11 months: "You stop work in October 2027, in your move window: 11 months left."
 *   on 16 August 2025, August 2025 to October 2027 is 26 months, 2 years 2 months: "… 2 years 2 months left."
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { homeOf } from '../../../src/answers/plan/home.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { fill } from '../../../src/v7/components/PlanFigures.jsx';
import { samMovePlan } from './_samMove.js';

const said = (today) => { const plan = samMovePlan(); const H = homeOf([{ plan }], plan.id, { today }); return H.moveWindow ? fill(HOME.moveWindow[H.moveWindow.id], H.moveWindow.slots) : null; };

describe('the home\'s line for the move window', () => {
  it('names the month work stops and the months to it', () => {
    expect(said('2026-11-16')).toMatch(/^You stop work in October 2027, in your move window: 11 months left\./);
  });
  it('says a longer wait in years and months', () => {
    expect(said('2025-08-16')).toMatch(/^You stop work in October 2027, in your move window: 2 years 2 months left\./);
  });
});
