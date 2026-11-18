/**
 * The gate can fail (lead4.md section 2, task 6): on a page whose two places of one fact show different text, the page
 * reader (collect.js) finds both, the gate (gate.js) reports one disagreement, and the ratchet calls it a rise. The same
 * page with the two places agreeing reports none. No emulator and no app: the page is written here.
 */
import { test, expect } from '@playwright/test';
import { collectMarks, waitQuiet } from './collect.js';
import { summarise, ratchet, baselineOf } from './gate.js';

const pageWith = (a, b) => `<!doctype html><html><body>
  <p>Your pot: <span data-fact="pot.today">${a}</span>, recorded in November 2026.</p>
  <div style="display:none"><span data-fact="pot.today">£999</span></div>
  <section><span data-fact="pot.today">${b}</span></section>
  <table data-fact-table="years"><tr><td data-row="67" data-col="income">£20,000</td></tr></table>
  <input data-field="saving.pay" value="52000">
</body></html>`;

async function read(page, html, view, name) {
  await page.setContent(html);
  expect(await waitQuiet(page, { timeout: 10_000 })).toBe(true);
  const got = await page.evaluate(collectMarks);
  return {
    places: got.places.map((p) => ({ view, page: name, ...p })),
    cells: got.cells.map((c) => ({ view, page: name, ...c })),
    fields: got.fields.map((f) => ({ view, page: name, ...f })),
    unmarked: got.unmarked
  };
}

test('two places that differ are one disagreement, a rise against an empty baseline; agreeing places are none', async ({ page }) => {
  const one = await read(page, pageWith('£120,000', '£120,500'), 'simple', 'home');
  expect(one.places.map((p) => p.text)).toEqual(['£120,000', '£120,500']);   // the hidden place is not read
  expect(one.cells).toEqual([{ view: 'simple', page: 'home', table: 'years', row: '67', col: 'income', text: '£20,000' }]);
  expect(one.fields).toEqual([{ view: 'simple', page: 'home', field: 'saving.pay', value: '52000' }]);
  expect(one.unmarked).toBe(1);                                                 // "November 2026" outside any mark
  const result = (r) => ({ fixture: 'self', subject: 'S', pages: [{ view: 'simple', page: 'home', opened: true }], places: r.places, cells: r.cells, fields: r.fields, unmarked: {} });
  const s = summarise([result(one)]);
  expect(s.disagreements.map((d) => d.key)).toEqual(['self|pot.today']);
  expect(ratchet(s, baselineOf(summarise([]))).rose.length).toBe(1);

  const same = await read(page, pageWith('£120,000', '£120,000'), 'simple', 'home');
  expect(summarise([result(same)]).disagreements).toEqual([]);
});
