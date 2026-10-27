/**
 * Visitors (6.23.0, research/v7/v6-usability-audit.md 2.1 and decisions 7, 8, 9): one rule for guests, said the same
 * way everywhere; no Delete Account for a guest; the example plan behind "Look around an example"; the preview's
 * questions linked from the top of the landing page; the welcome tour, Edit Tools, the per-tool wizard and the
 * "Copy from Stress / Decision" buttons retired.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { initLandingPage } from '../src/ui/components/LandingPage.js';
import { GUEST_RULE, bannerText, pendingNag, savedChipText, GUEST_SAVED_CHIP, GUEST_NAG_MINUTES } from '../src/services/GuestMeter.js';
import { enterGuestMode, leaveGuestMode, getCurrentUser } from '../src/firebase/AuthService.js';
import { clearGuestData } from '../src/firebase/FirestoreService.js';
import { h, render } from 'preact';
import { App } from '../src/v7/App.jsx';
import { initialState } from '../src/v7/state/initial.js';
import { reduce } from '../src/v7/state/reduce.js';
import { parse } from '../src/v7/router/routes.js';
import { GUEST } from '../src/v7/copy/guest.js';
import { ACCOUNT } from '../src/v7/copy/account.js';
import { handoffPayload } from '../src/services/GuestMeter.js';

const html = readFileSync('index.html', 'utf8');
const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

describe('one rule for guests', () => {
  it('the rule is the one sentence, and every guest-facing line carries it or agrees with it', () => {
    expect(GUEST_RULE).toBe('Kept in this browser window until you close it. Make a free account to keep it for good.');
    expect(bannerText(30)).toContain(GUEST_RULE);
    expect(bannerText(30)).not.toMatch(/nothing is saved/);
    expect(pendingNag(mem(), GUEST_NAG_MINUTES[0]).message).toContain(GUEST_RULE);
    expect(pendingNag(mem(), GUEST_NAG_MINUTES[1]).message).not.toMatch(/keeps nothing/);
    enterGuestMode();
    expect(getCurrentUser().email).toBe('Guest — kept in this window only');
    leaveGuestMode(); clearGuestData();
    expect(html).toContain('kept in this browser window until you close it. Make a free account to keep it for good.');
    for (const bad of ['nothing is saved or sent anywhere', 'Guest mode keeps one plan', 'nothing saved', 'Your account is set up']) expect(html, bad).not.toContain(bad);
  });
  it('the Budget\'s chip says "Kept in this window" for a guest, "Saved" for an account — never both "nothing saved" and "Saved ✓"', () => {
    expect(savedChipText(true)).toBe(GUEST_SAVED_CHIP);
    expect(savedChipText(false)).toBe('Saved ✓');
    expect(html).toContain('budSetStatus(savedChipText(isGuest()))');
    expect(html).not.toContain("budSetStatus('Saved \\u2713')");
  });
  it('a guest is never offered Delete Account, and Reset as a guest clears the window instead of a welcome', () => {
    expect(html).toContain("document.getElementById('deleteAccountBtn').style.display = user.isGuest ? 'none' : '';");
    expect(html).toContain("(isGuest() ? '' : '<button type=\"button\" class=\"danger\" data-on-click=\"closeMobileSheet(); document.getElementById(\\'deleteAccountBtn\\').click();\">&#128465; Delete my account</button>')");
    const del = html.slice(html.indexOf("document.getElementById('deleteAccountBtn').addEventListener('click'"), html.indexOf("document.getElementById('deleteAccountBtn').addEventListener('click'") + 400);
    expect(del).toContain('if (isGuest()) {');
    const reset = html.slice(html.indexOf("document.getElementById('resetBtn').addEventListener('click'"), html.indexOf("document.getElementById('resetBtn').addEventListener('click'") + 2400);
    expect(reset).toContain("if (isGuest()) { try { clearGuestData(); leaveGuestMode(); } catch (e) {} location.href = location.pathname; return; }");
    expect(reset).toContain('showSetupWizardFor();');
    expect(reset).not.toContain('showOnboarding');
  });
});

describe('the same promises in the preview (research/v7/road-to-7.md step 11)', () => {
  const drawV7 = (hash, session) => {
    let s = initialState({ today: '2026-10-02', build: 'test' });
    s = reduce(s, { type: 'route/set', route: parse(hash) });
    s = reduce(s, { type: 'session/set', session: { kind: session, email: session === 'in' ? 'someone@example.com' : null } });
    const root = document.createElement('div'); root.id = 'app';
    render(h(App, { state: s, dispatch: () => {} }), root);
    return root;
  };
  it('a visitor is never offered "Delete my account" on the preview\'s account page: there is no account; an account is, after two confirms', () => {
    const visitor = drawV7('#/account', 'nobody');
    expect(visitor.textContent).not.toContain(ACCOUNT.remove.button);
    expect(visitor.querySelector('[data-testid="account.delete"]')).toBe(null);
    expect(visitor.querySelector('[data-testid="account.signIn"]')).not.toBe(null);
    const account = drawV7('#/account', 'in');
    expect(account.querySelector('[data-testid="account.delete"]').textContent).toBe(ACCOUNT.remove.button);
    expect(account.querySelector('[data-testid="account.delete.confirm1"]')).toBe(null);
    expect(ACCOUNT.remove.ask1).toContain('This cannot be undone.');
  });
  it('the one rule for visitors is the same sentence in the preview\'s words, and the preview never says "guest"', () => {
    expect(GUEST.rule).toBe(GUEST_RULE);
    expect(GUEST.banner).toContain(GUEST_RULE.charAt(0).toLowerCase() + GUEST_RULE.slice(1));
    expect(JSON.stringify(GUEST)).not.toMatch(/guest/i);
    expect(JSON.stringify(ACCOUNT)).not.toMatch(/guest/i);
  });
  it('the hand-off into an account never carries the example plan (the planner\'s "keep this work" used to): GuestMeter.handoffPayload leaves it out for both apps', () => {
    const own = { id: 'guest-a', planDetails: { name: 'Mine' } };
    const example = { id: 'guest-b', example: true, planDetails: { name: 'The example' } };
    expect(handoffPayload([example, own]).scenarios.map((s) => s.planDetails.name)).toEqual(['Mine (from guest)']);
    expect(handoffPayload([example]).scenarios).toEqual([]);
  });
});

describe('the landing page', () => {
  const render = () => {
    const el = document.createElement('div'); document.body.appendChild(el);
    const calls = [];
    initLandingPage(el, { onGetStarted: () => calls.push('start'), onSignIn: () => calls.push('signin'), onTryGuest: () => calls.push('guest'), onLookAround: () => calls.push('example') });
    return { el, calls };
  };
  it('one line at the top links the preview\'s questions', () => {
    const { el } = render();
    const first = el.querySelector('.landing-content').firstElementChild;
    expect(first.className).toBe('landing-new');
    const a = first.querySelector('a');
    expect(a.getAttribute('href')).toBe('v7/');
    expect(a.textContent).toBe('New: answer one question in about two minutes (preview)');
    el.remove();
  });
  it('"Just try it" starts the person\'s own plan; "Look around an example" opens the example; the guest rule is under them', () => {
    const { el, calls } = render();
    const tryIt = el.querySelector('#landingTryGuest'), look = el.querySelector('#landingLookAround');
    expect(tryIt.textContent).toBe('Just try it — no account needed');
    expect(look.textContent).toBe('Look around an example');
    tryIt.click(); look.click();
    expect(calls).toEqual(['guest', 'example']);
    expect(el.querySelector('.landing-guest-note').textContent).toBe('Without an account: ' + GUEST_RULE);
    expect(el.textContent).not.toMatch(/nothing saved/);
    expect(el.textContent).not.toMatch(/becomes your plan's target/);
    el.remove();
  });
  it('the page wires "Look around" to the example and "Just try it" to a plan of one\'s own', () => {
    expect(html).toContain('onLookAround: () => startGuest(EXAMPLE_PLAN_KEY)');
    const sg = html.slice(html.indexOf('async function startGuest(demoKey) {'), html.indexOf('async function startGuest(demoKey) {') + 1800);
    expect(sg).toContain('if (!demo) { showSetupWizardFor(); return; }');
    expect(sg).toContain("saveScenarioDoc(made, { example: true })");
    expect(sg).not.toContain('deleteScenario(');   // never empties the window of the guest's own plans
  });
});

describe('retired, with nothing in their place', () => {
  it('the welcome tour, the per-tool wizard, Edit Tools and the Copy from Stress / Decision buttons are gone', () => {
    expect(existsSync('src/ui/components/OnboardingPage.js')).toBe(false);
    const wizard = readFileSync('src/ui/components/SetupWizard.js', 'utf8');
    expect(wizard).not.toContain('initToolWizard');
    const repo = readFileSync('src/storage/ScenarioRepository.js', 'utf8');
    for (const gone of ['seedStressFromDecision', 'updateScenarioTools', 'getActiveEnabledTools']) expect(repo, gone).not.toContain('export function ' + gone);
    for (const gone of ['OnboardingPage', 'initToolWizard', 'showEditToolsModal', 'Edit Tools', 'edit-tools-', 'applyTabVisibility', 'copyStressFromDecisionUI', 'copyDecisionFromStressUI', 'Copy from Decision Tool', 'Use ALL Stress settings', 'ssSeedNote', 'onboardingPage']) expect(html, gone).not.toContain(gone);
  });
  it('a new account, "+ New plan" and "Just try it" go straight to the setup wizard; the cancel with no plans makes an empty plan', () => {
    expect(html).toContain('function showSetupWizardFor() {');
    const newBtn = html.slice(html.indexOf("document.getElementById('scenarioNewBtn').addEventListener('click'"), html.indexOf("document.getElementById('scenarioNewBtn').addEventListener('click'") + 400);
    expect(newBtn).toContain('if (await guestPlanGate()) return;');
    expect(newBtn).toContain('showSetupWizardFor();');
    const cancel = html.slice(html.indexOf('async function cancelPlanCreation() {'), html.indexOf('async function cancelPlanCreation() {') + 900);
    expect(cancel).toContain("await createNewScenario('My plan', '', ['stress', 'decision'], {}, true);");
    expect(cancel).toContain('await showMainApp(getCurrentUser());');
  });
  it('a guest may keep three plans: every door that makes a plan asks the gate', () => {
    expect(html).toContain('async function guestPlanGate() {');
    expect((html.match(/if \(await guestPlanGate\(\)\) return;/g) || []).length).toBe(3);   // + New plan, Duplicate, a partner plan
  });
});
