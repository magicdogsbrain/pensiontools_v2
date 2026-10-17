// Guest-only browser check of the Household tab's headline and table in a scratch build (never signed in; every request
// outside the local server is blocked). Run from the repository root after `npx vite build --outDir /tmp/hh-build`: node scripts/household-browser-check.mjs /tmp/hh-build /tmp/hh-shots
import { chromium } from 'playwright';
import { startServer } from '../e2e/helpers/serve.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [buildDir = '/tmp/hh-build', outDir = '/tmp/hh-shots'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const PORT = 4199;
const server = startServer(buildDir, PORT);
const base = `http://127.0.0.1:${PORT}`;

const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const stressA = { configured: true, retired: true, currentAge: 62, currentAgeAsOf: '2026-10-17', shapeAgeNow: 62, duration: 30, baseSalary: 83650, equityMin: 800000, bondMin: 300000, cashTarget: 80000, diversifierStart: 0, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', dbAmount: 3650, dbStartYear: 0, statePension: 11973, statePensionYear: 5, accessMethod: 'drawdown', ...BANDS, taxMode: 'inflates', strategyId: 'pots-and-valves', strategyParams: {}, riskMode: 'risk', chargesPct: 0.3, isaGrowth: 'cash', incomeShape: 'flat', incomeSteps: [] };
const stressB = { ...stressA, currentAge: 57, shapeAgeNow: 57, duration: 35, baseSalary: 0, equityMin: 150000, bondMin: 50000, cashTarget: 20000, dbAmount: 0, statePensionYear: 10, accessMethod: 'ufpls' };
const now = new Date().toISOString();
const plan = (id, name, settings, partnerId, isActive) => ({ id, planDetails: { name, description: '' }, enabledTools: ['stress', 'decision'], isActive, createdAt: now, lastModified: now,
  stressTool: { settings }, decisionTool: { settings: {}, taxYears: {}, history: [] }, budgetTool: { settings: {} }, household: { partnerScenarioId: partnerId } });
const plans = [plan('guest-alex', 'Alex', stressA, 'guest-sam', true), plan('guest-sam', 'Sam', stressB, 'guest-alex', false)];

const browser = await chromium.launch();
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  await context.route('**/*', (route) => (route.request().url().startsWith(base) ? route.continue() : route.abort()));
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(base + '/');
  await page.waitForSelector('#landingTryGuest', { timeout: 30000 });
  await page.evaluate((list) => sessionStorage.setItem('pt_guest_scenarios', JSON.stringify(list)), plans);
  await page.reload();
  await page.waitForSelector('#landingTryGuest', { timeout: 30000 });
  await page.click('#landingTryGuest');
  await page.waitForSelector('#guestBanner', { state: 'visible', timeout: 30000 });
  await page.evaluate(() => document.querySelector('nav.tabs .tab[data-tab="household"]').click());
  await page.waitForFunction(() => document.getElementById('hhPartnerSelect')?.value === 'guest-sam', null, { timeout: 30000 });
  await page.click('button[data-on-click="runHouseholdCheck()"]');
  await page.waitForSelector('#hhSplitHeadline', { timeout: 60000 });
  await page.waitForFunction(() => { const t = document.getElementById('hhSplitTable')?.textContent || ''; return t && !t.includes('…') && !!document.getElementById('hhHouseholdVerdict'); }, null, { timeout: 180000 });
  const text = (sel) => page.$eval(sel, (el) => el.textContent.replace(/\s+/g, ' ').trim());
  console.log('HEADLINE:', await text('#hhSplitHeadline'));
  console.log('VERDICT:', await text('#hhHouseholdVerdict'));
  console.log('TABLE:', (await page.$$eval('#hhSplitTable tbody tr', (rows) => rows.map((r) => [...r.children].map((c) => c.textContent.trim()).join(' | ')))).join('\n  '));
  console.log('SECTION ORDER:', await page.$$eval('#household-content .settings-section .section-title', (els) => els.map((e) => e.textContent.trim().slice(0, 40))));
  const scroll = async () => page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, inner: window.innerWidth }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(outDir, 'household-1280.png'), fullPage: true });
  console.log('1280 scroll:', JSON.stringify(await scroll()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(outDir, 'household-390.png'), fullPage: true });
  console.log('390 scroll:', JSON.stringify(await scroll()));
  const headlineBox = await page.$eval('#hhSplitHeadline', (el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top + window.scrollY), width: Math.round(r.width) }; });
  console.log('390 headline box:', JSON.stringify(headlineBox));
  console.log('signed in?', await page.evaluate(() => !!(window.firebase && window.firebase.auth && window.firebase.auth().currentUser)), '| guest plans in store:', await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]').length));
} finally {
  console.log('CONSOLE ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  server.close();
}
