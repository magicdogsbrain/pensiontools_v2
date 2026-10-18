import { chromium } from 'playwright';
import { startServer } from '../e2e/helpers/serve.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const OUT = '/private/tmp/claude-501/-Volumes-Projects-coding-pensiontools-v2-github/1704967a-3219-405f-8985-c97db713215f/scratchpad/walk';
const PORT = 4791; const server = startServer('docs', PORT); const base = `http://127.0.0.1:${PORT}`;
const fx = (f) => JSON.parse(readFileSync('tests/fixtures/plans/' + f, 'utf8'));
const ladder = fx('03-gilt-ladder-runup.json'); ladder.id = 'WalkLadder'; ladder.isActive = true;
const rot = fx('03-gilt-ladder-runup.json'); rot.id = 'WalkRotation'; rot.isActive = true; rot.planDetails.name = 'Rotation draft';
rot.stressTool.settings.strategyId = 'gilt-rotation'; rot.stressTool.settings.strategyParams = { ...rot.stressTool.settings.strategyParams, sippTotal: 0, isaTotal: 0 };
Object.assign(rot.stressTool.settings, { equityMin: 606000, bondMin: 484800, cashTarget: 121200 });
delete rot.planDocument; if (rot.decisionTool && rot.decisionTool.settings) rot.decisionTool.settings.locked = false;
const growth = fx('02-pnv-draft.json'); growth.id = 'WalkGrowth'; growth.isActive = true;
const plans = { ladder, rotation: rot, growth };
const which = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
page.on('dialog', d => d.dismiss());
await page.goto(base + '/v7/#/'); await page.waitForSelector('#app [data-screen]');
await page.evaluate((t) => sessionStorage.setItem('pt_guest_scenarios', t), JSON.stringify([plans[which]]));
await page.goto(base + '/'); await page.locator('#landingTryGuest').click(); await page.waitForSelector('#mainApp', { state: 'visible' });
await page.waitForTimeout(2500);
let out = '';
const settle = async (ms = 1500) => { await page.waitForTimeout(ms); for (let i = 0; i < 60; i++) { const busy = await page.evaluate(() => /Running|Working|…$/m.test(document.querySelector('.tab-content.active')?.innerText || '')); if (!busy) break; await page.waitForTimeout(1000); } };
const dump = async (label) => { const t = await page.evaluate(() => document.querySelector('.tab-content.active')?.innerText || document.body.innerText); out += `\n\n######## ${label}\n` + t; };
const press = async (fn) => { const b = page.locator(`.tab-content.active [data-on-click="${fn}()"]:visible`).first(); if (await b.count()) { await b.click().catch(() => {}); await settle(3000); return true; } return false; };
for (const tab of ['decision', 'accumulation', 'budget', 'stress', 'strategies', 'transition', 'household']) {
  const t = page.locator(`.tab[data-tab="${tab}"]`); if (!(await t.isVisible().catch(() => false))) { out += `\n\n######## ${tab} (tab hidden)`; continue; }
  await t.click(); await settle();
  if (tab === 'stress') {
    for (const st of ['montecarlo', 'historical', 'scenarios', 'drawdown', 'glidepath', 'stresssettings']) {
      await page.locator(`[data-stresstab="${st}"]`).click(); await settle();
      for (const fn of ['runMonteCarloUI', 'runHistoricalUI', 'runScenariosUI']) await press(fn);
      await dump(`stress/${st}`);
    }
  } else if (tab === 'decision') {
    for (const st of ['entry', 'history', 'plandoc', 'taxyears', 'decisionsettings']) { await page.locator(`[data-decisiontab="${st}"]`).click(); await settle(); await dump(`decision/${st}`); }
  } else {
    for (const fn of ['runOnTrackCheck', 'runRetireSweep', 'runTryStrategyUI', 'runHouseholdCheck']) await press(fn);
    await dump(tab);
  }
}
out += '\n\n######## ERRORS\n' + errs.join('\n');
writeFileSync(`${OUT}/${which}.txt`, out);
console.log(which, 'chars', out.length, 'errors', errs.length);
await browser.close(); server.close();
