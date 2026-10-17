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
