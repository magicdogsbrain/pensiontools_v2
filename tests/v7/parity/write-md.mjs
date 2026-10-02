// Writes research/v7/parity-ledger.md from tests/v7/parity/ledger.json. Run from the repository root:
//   node tests/v7/parity/write-md.mjs
// ledger.test.js fails when the page and the ledger differ, so run this after every change to the ledger.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderLedgerMarkdown, LEDGER_JSON, LEDGER_MD } from './render.js';

const root = process.cwd();
const ledger = JSON.parse(readFileSync(resolve(root, LEDGER_JSON), 'utf8'));
writeFileSync(resolve(root, LEDGER_MD), renderLedgerMarkdown(ledger));
console.log('Wrote ' + LEDGER_MD + ' (' + ledger.rows.length + ' rows).');
