/** Guest-mode trial: metered active minutes, escalating nags, a hard stop, and the hand-off payload. */
import { describe, it, expect } from 'vitest';
import { tick, readMinutes, pendingNag, markNagShown, isBlocked, remainingMinutes, bannerText, handoffPayload, stashHandoff, readHandoff, clearHandoff, GUEST_ALLOWANCE_MINUTES, GUEST_NAG_MINUTES } from '../src/services/GuestMeter.js';

const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

describe('the meter', () => {
  it('counts a minute only when the tab is visible and the person was active in the last two minutes', () => {
    const st = mem(); const now = 1_000_000_000;
    expect(tick(st, { now, lastActivity: now - 1000, visible: true })).toBe(1);
    expect(tick(st, { now, lastActivity: now - 3 * 60 * 1000, visible: true })).toBe(1);   // idle: no count
    expect(tick(st, { now, lastActivity: now, visible: false })).toBe(1);                  // hidden tab: no count
    expect(tick(st, { now, lastActivity: now, visible: true })).toBe(2);
    expect(readMinutes(st)).toBe(2);
  });
  it('survives garbage in storage', () => { const st = mem(); st.setItem('pt_guest_minutes', 'nope'); expect(readMinutes(st)).toBe(0); });
});

describe('nags and the stop', () => {
  it('each milestone nags once, later ones are firm, and the allowance blocks', () => {
    const st = mem();
    expect(pendingNag(st, 5)).toBeNull();
    const n1 = pendingNag(st, GUEST_NAG_MINUTES[0]); expect(n1.level).toBe(1); expect(n1.firm).toBe(false); markNagShown(st, 1);
    expect(pendingNag(st, GUEST_NAG_MINUTES[0] + 5)).toBeNull();
    const n3 = pendingNag(st, GUEST_NAG_MINUTES[2]); expect(n3.level).toBe(3); expect(n3.firm).toBe(true); expect(n3.message).toMatch(/left/);
    expect(isBlocked(GUEST_ALLOWANCE_MINUTES - 1)).toBe(false); expect(isBlocked(GUEST_ALLOWANCE_MINUTES)).toBe(true);
    expect(remainingMinutes(GUEST_ALLOWANCE_MINUTES + 10)).toBe(0);
    expect(bannerText(30)).toMatch(/30 min of your 3 free hours/); expect(bannerText(200)).toMatch(/used up/);
  });
});

describe('the hand-off', () => {
  it('drops ids and the active flag, marks the names, round-trips through storage', () => {
    const st = mem();
    const guest = [{ id: 'guest-abc', isActive: true, createdAt: 'x', planDetails: { name: 'My plan' }, stressTool: { settings: { baseSalary: 40000 } }, decisionTool: { history: [{ date: '2026-09' }] } }];
    const p = handoffPayload(guest);
    expect(p.scenarios[0].id).toBeUndefined(); expect(p.scenarios[0].isActive).toBeUndefined();
    expect(p.scenarios[0].planDetails.name).toBe('My plan (from guest)');
    expect(p.scenarios[0].decisionTool.history.length).toBe(1);
    expect(stashHandoff(st, guest)).not.toBeNull();
    expect(readHandoff(st).scenarios[0].stressTool.settings.baseSalary).toBe(40000);
    clearHandoff(st); expect(readHandoff(st)).toBeNull();
    expect(stashHandoff(st, [])).toBeNull();
  });
});
