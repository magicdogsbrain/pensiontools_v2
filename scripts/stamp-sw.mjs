// Stamp the service-worker cache name with the built bundle's hash so every deploy invalidates
// the previous cache (a stale index.html pointing at a deleted bundle = blank "Loading…").
import fs from 'node:fs';
const html = fs.readFileSync('docs/index.html', 'utf8');
const m = html.match(/main-([A-Za-z0-9_-]+)\.js/);
const tag = m ? m[1] : String(Date.now());
const p = 'docs/sw.js';
const sw = fs.readFileSync(p, 'utf8').replace(/const CACHE_NAME = '[^']*';/, `const CACHE_NAME = 'pension-planner-${tag}';`);
fs.writeFileSync(p, sw);
console.log('sw.js cache name → pension-planner-' + tag);
