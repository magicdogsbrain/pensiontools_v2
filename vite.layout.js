/**
 * Where each build writes its files, and what each page's head says, in each layout (the layouts and every address the
 * two apps hand each other are src/appLayout.js's; research/v7/switch-readiness.md §2 steps 3, 5, 6 and 8). Read by
 * vite.config.js (the classic page) and vite.v7.config.js (V7) when they build or serve; Node only, never in a bundle.
 *
 *                       switch (7.0, the default)                     preview (before 7.0, and the rollback)
 *   V7                  <site>/          with the public folder        <site>/v7/
 *   the classic page    <site>/classic/  with a copy of data/          <site>/           with the public folder
 *   /v7/                a forward to the front page, for old links      V7 itself
 *   the manifest        V7's page links public/manifest.json           the classic page links manifest.json (hashed)
 *   "do not index"      the classic page                               V7's page
 *
 * <site> is SITE_OUT: docs/ by default (the published folder), dist/prod and dist/test for the browser tests. Each build
 * empties its own folder and leaves the other app's folder alone, so `vite build` and `vite build --config
 * vite.v7.config.js` give the same site in either order, and a build of one app never deletes the other: in the switch
 * layout V7's folder is the site's root, so emptying it whole would take the classic page with it.
 *
 * The classic page's copy of data/ is for its engine worker, which asks for the market files beside its own script
 * (`../data/` from /classic/assets/, src/appLayout.js); the page itself reads the root's data/, which the nightly job
 * keeps fresh. The copy is as fresh as the release, as the worker's bundled figures are.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYOUTS } from './src/appLayout.js';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * True when the build is the signed-in browser tests' (VITE_EMULATORS=1): its Firebase is the local emulators of a demo-
 * project (src/firebase/projectConfig.js). Refused for the published folder, so docs/ can never be built against the
 * emulators by a stray variable: that build goes to its own SITE_OUT (dist/emu).
 */
export function emulatorsWanted(env = process.env) {
  if (env.VITE_EMULATORS !== '1') return false;
  if (siteFolder(env) === resolve(here, 'docs')) throw new Error('vite.layout.js: VITE_EMULATORS=1 builds the signed-in tests\' site; give it its own SITE_OUT (dist/emu), never docs/.');
  return true;
}

/** The folder the site's root is built into: SITE_OUT, or docs/ (the published folder). */
export const siteFolder = (env = process.env) => resolve(here, env.SITE_OUT || 'docs');

/** Each app's folder under the site, by layout: '' is the site's root. */
export const FOLDERS = Object.freeze({
  switch: Object.freeze({ v7: '', classic: 'classic' }),
  preview: Object.freeze({ v7: 'v7', classic: '' })
});

/** Where an app ('v7' | 'classic') is written for a layout, and the other app's folder it must leave alone (null when it has none inside). */
export function outFor(layout, app, env = process.env) {
  const folders = FOLDERS[layout];
  const other = app === 'v7' ? 'classic' : 'v7';
  return {
    outDir: join(siteFolder(env), folders[app]),
    keep: folders[app] === '' ? folders[other] : null
  };
}

/**
 * Why a folder must not be emptied as a build's output, or null when it may be. SITE_OUT is taken as it is typed, so a
 * slip (`SITE_OUT=.`, `SITE_OUT=..`, a path to another project) would hand emptyOwnFolder the repository, a folder that
 * holds it, or someone else's work; Vite's own emptyOutDir only warns about an output folder outside the project, but
 * this one deletes, so it refuses. A built site never holds a .git or a package.json, so a folder that does is a
 * project's, wherever it is (a scratch folder for a rollback build, outside the repository, is fine).
 */
export function refuseToEmpty(outDir, repo = here) {
  const out = resolve(outDir);
  const up = relative(out, resolve(repo));
  if (up === '' || (!isAbsolute(up) && up.split(sep)[0] !== '..')) return `${out} is the repository or holds it`;
  for (const name of ['.git', 'package.json']) if (existsSync(join(out, name))) return `${out} holds ${name}: it is a project's folder, not a built site`;
  return null;
}

/**
 * Empties the build's own folder before it is written, but leaves `keep` (the other app's folder inside it), in place of
 * Vite's emptyOutDir, which would empty it whole. Runs at the start of a build, before Vite copies the public folder.
 * It stops the build, deleting nothing, when the folder is not a site's (refuseToEmpty), and never deletes a .git.
 */
export function emptyOwnFolder(outDir, keep) {
  return {
    name: 'pt:empty-own-folder',
    apply: 'build',
    buildStart() {
      if (!existsSync(outDir)) return;
      const why = refuseToEmpty(outDir);
      if (why) throw new Error(`vite.layout.js: will not empty the output folder: ${why}. Check SITE_OUT.`);
      for (const name of readdirSync(outDir)) if (name !== keep && name !== '.git') rmSync(join(outDir, name), { recursive: true, force: true });
    }
  };
}

/** The 7.0 head of V7's page: the one installable app (its manifest, icons and colour); indexed. */
const V7_SWITCH_HEAD = [
  '<meta name="theme-color" content="#6366f1">',
  '<link rel="icon" type="image/png" href="./favicon.png">',
  '<link rel="apple-touch-icon" href="./icon-192.png">',
  '<link rel="manifest" href="./manifest.json">'
];
/** The preview's head, as before 7.0: reachable by address only, never indexed; the favicon is the site root's. */
const V7_PREVIEW_HEAD = [
  '<meta name="robots" content="noindex">',
  '<link rel="icon" href="../favicon.png">'
];

/** Puts lines into a page's head just before its <title>, indented as the title is. Refuses a page without one. */
function beforeTitle(html, lines) {
  const m = /^([ \t]*)<title>/m.exec(html);
  if (!m) throw new Error('vite.layout.js: the page has no <title> to put its head lines before');
  return html.slice(0, m.index) + lines.map((l) => m[1] + l + '\n').join('') + html.slice(m.index);
}

/** Replaces one exact piece of a page; refuses when it is not there exactly once, so a changed page cannot skip a step. */
function once(html, from, to) {
  const at = html.indexOf(from);
  if (at === -1 || html.indexOf(from, at + 1) !== -1) throw new Error(`vite.layout.js: expected exactly one ${JSON.stringify(from)} in the page`);
  return html.slice(0, at) + to + html.slice(at + from.length);
}

/** V7's page head for a layout (v7/index.html carries what both share). After Vite's own work, so these addresses are left as written. */
export function v7Head(layout) {
  return {
    name: 'pt:v7-head',
    transformIndexHtml: { order: 'post', handler: (html) => beforeTitle(html, layout === 'switch' ? V7_SWITCH_HEAD : V7_PREVIEW_HEAD) }
  };
}

/** The classic page's name at 7.0: its tab title and its header's heading (src/ui/classicName.js names the rest the same). */
export const CLASSIC_NAME = 'The classic planner';
/**
 * The classic page's one way back to the front page at 7.0, at the top of the app at every width (the header's own
 * actions are behind the menu on a phone): a person who chose "Use the previous version", signed in or not, has a way
 * back to PensionTools' front page without a hand-over. Markup only, in the 7.0 build, so the page's script gains no line.
 */
export const CLASSIC_TO_FRONT = `<p id="classicToFront" style="margin:0 0 6px;text-align:right;font-size:13px;"><a href="${LAYOUTS.switch.classic.v7}" style="color:inherit;text-decoration:underline;">Back to PensionTools</a></p>`;
/**
 * The same way back on the screens drawn outside the app, before a visitor is in: the landing page and the sign-in
 * screen (7.0.1). It sits above them and hides itself once the app shows, where CLASSIC_TO_FRONT takes over, so one link
 * shows at a time. Markup and one style rule only, so the page's script gains no line.
 */
export const CLASSIC_TO_FRONT_OUTSIDE = `<style>body:has(#mainApp:not(.hidden)) #classicToFrontOutside{display:none}</style><p id="classicToFrontOutside" style="margin:8px 16px 0;text-align:right;font-size:13px;"><a href="${LAYOUTS.switch.classic.v7}" style="color:inherit;text-decoration:underline;">Back to PensionTools</a></p>`;

/**
 * The classic page at 7.0 (index.html is the preview's, unchanged by that layout). Its head: no manifest and no
 * home-screen app of its own, so the site has one installable app; "do not index"; its name; the favicon from the site's
 * root. Its body: the header's heading names it, and the way back to the front page (CLASSIC_TO_FRONT) sits above the
 * header, with its twin (CLASSIC_TO_FRONT_OUTSIDE) above the landing page and the sign-in screen. The manifest link
 * goes before Vite reads the page, so no manifest is built for it; the rest after, so Vite
 * leaves the favicon's address as written.
 */
export function classicHead(layout) {
  if (layout !== 'switch') return [];
  return [
    {
      name: 'pt:classic-head-before',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => {
          let out = once(html, '  <link rel="manifest" href="manifest.json">\n', '');
          out = once(out, '  <meta name="apple-mobile-web-app-capable" content="yes">\n', '');
          return once(out, '  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n', '');
        }
      }
    },
    {
      name: 'pt:classic-head-after',
      transformIndexHtml: {
        order: 'post',
        handler: (html) => {
          let out = once(html, '<link rel="icon" type="image/png" href="favicon.png">', '<link rel="icon" type="image/png" href="../favicon.png">');
          out = once(out, '<title>Pension Planner v6</title>', `<title>${CLASSIC_NAME}</title>`);
          out = once(out, '<h1>Pension Planner</h1>', `<h1>${CLASSIC_NAME}</h1>`);
          out = once(out, '      <header class="header">\n', '      ' + CLASSIC_TO_FRONT + '\n      <header class="header">\n');
          out = once(out, '  <div id="landingPage"></div>\n', '  ' + CLASSIC_TO_FRONT_OUTSIDE + '\n  <div id="landingPage"></div>\n');
          return beforeTitle(out, ['<meta name="robots" content="noindex">']);
        }
      }
    }
  ];
}

/** The market files beside the classic page at 7.0 (<site>/classic/data/), for its engine worker; see the top of this file. */
export function classicDataCopy(layout, outDir) {
  if (layout !== 'switch') return [];
  return {
    name: 'pt:classic-data',
    apply: 'build',
    closeBundle() { cpSync(resolve(here, 'public', 'data'), join(outDir, 'data'), { recursive: true }); }
  };
}

/** The old /v7/ address at 7.0: a page that forwards to the same place at the site's root, the #/… part kept. */
export const FORWARD_PAGE = `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>PensionTools</title>
  <script src="./forward.js"></script>
</head>
<body>
  <p><a href="../">PensionTools' questions and plans are now on the site's front page.</a></p>
</body>
</html>
`;
/**
 * Its script, a file of its own because the security policy runs no script written in a page. Relative to the page, so it
 * lands on the site's root on the GitHub Pages mirror too (a host's redirect file would reach Cloudflare only).
 */
export const FORWARD_SCRIPT = `// The old address of the new app (/v7/): the same place at the site's root, the #/... part kept.
location.replace('../' + location.search + location.hash);
`;

export function oldV7Forward(layout, outDir) {
  if (layout !== 'switch') return [];
  return {
    name: 'pt:old-v7-forward',
    apply: 'build',
    closeBundle() {
      const at = join(outDir, 'v7');
      mkdirSync(at, { recursive: true });
      writeFileSync(join(at, 'index.html'), FORWARD_PAGE);
      writeFileSync(join(at, 'forward.js'), FORWARD_SCRIPT);
    }
  };
}
