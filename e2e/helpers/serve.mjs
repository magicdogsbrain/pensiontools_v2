/**
 * A static server for the browser tests that sends the REAL security headers.
 *
 *   node e2e/helpers/serve.mjs <folder> <port>
 *
 * It reads public/_headers — the file Cloudflare Pages reads — and sends the same headers Cloudflare sends,
 * so a script the policy would block is found here and not after deployment. (`vite preview` sends none.)
 * Nothing else is clever: files from the folder, index.html for a folder, nothing cached.
 *
 * A path that is not there is answered as Cloudflare Pages answers it: the folder's 404.html with a 404 if
 * there is one; otherwise the site's own index.html with a 200 (Pages treats a site without a 404.html as a
 * single-page app — checked against the live site, 30 Sep 2026). Such an answer carries `X-E2E-Fallback: 1`,
 * which Cloudflare does not send, so a test can still tell that a file was missing.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, extname, dirname, normalize, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.map': 'application/json; charset=utf-8'
};

/**
 * Cloudflare's _headers format: a path pattern at the start of a line, then indented "Name: value" lines.
 * `#` starts a comment. Returns [{ pattern, headers: { name: value } }] in file order.
 */
export function parseHeaders(text) {
  const rules = [];
  let current = null;
  for (const raw of String(text).split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (/^\s/.test(raw)) {
      const at = raw.indexOf(':');
      if (!current || at === -1) continue;
      current.headers[raw.slice(0, at).trim()] = raw.slice(at + 1).trim();
    } else {
      current = { pattern: raw.trim(), headers: {} };
      rules.push(current);
    }
  }
  return rules;
}

function matches(pattern, path) {
  const re = new RegExp('^' + pattern.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return re.test(path);
}

/** Every header of every block whose pattern matches the path (Cloudflare applies them all). */
export function headersFor(rules, path) {
  const out = {};
  for (const r of rules) if (matches(r.pattern, path)) Object.assign(out, r.headers);
  return out;
}

export function startServer(folder, port, { headersFile = join(REPO, 'public', '_headers') } = {}) {
  const root = resolve(folder);
  if (!existsSync(root)) throw new Error(`serve.mjs: no such folder ${root} — run "npm run e2e:build" first`);
  const rules = parseHeaders(readFileSync(headersFile, 'utf8'));

  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { path = url.pathname; }
    const send = (status, body, extra = {}) => {
      res.writeHead(status, { ...headersFor(rules, path), 'Cache-Control': 'no-store', ...extra });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, 'Method not allowed', { 'Content-Type': TYPES['.txt'] });

    const file = normalize(join(root, path));
    if (file !== root && !file.startsWith(root + sep)) return send(403, 'Forbidden', { 'Content-Type': TYPES['.txt'] });

    let target = file;
    if (existsSync(target) && statSync(target).isDirectory()) {
      // As Cloudflare Pages: a folder without its closing slash is forwarded to the one with it.
      if (!path.endsWith('/')) return send(308, '', { Location: path + '/' + url.search });
      target = join(target, 'index.html');
    }
    if (!existsSync(target) || !statSync(target).isFile()) {
      const notFound = join(root, '404.html');
      const home = join(root, 'index.html');
      if (existsSync(notFound)) return send(404, readFileSync(notFound), { 'Content-Type': TYPES['.html'], 'X-E2E-Fallback': '1' });
      if (existsSync(home)) return send(200, readFileSync(home), { 'Content-Type': TYPES['.html'], 'X-E2E-Fallback': '1' });
      return send(404, 'Not found', { 'Content-Type': TYPES['.txt'], 'X-E2E-Fallback': '1' });
    }
    send(200, readFileSync(target), { 'Content-Type': TYPES[extname(target).toLowerCase()] || 'application/octet-stream' });
  });
  server.listen(port, '127.0.0.1');
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [folder, port] = process.argv.slice(2);
  if (!folder || !port) { console.error('usage: node e2e/helpers/serve.mjs <folder> <port>'); process.exit(2); }
  startServer(folder, Number(port));
  console.log(`serving ${resolve(folder)} on http://127.0.0.1:${port} with the headers of public/_headers`);
}
