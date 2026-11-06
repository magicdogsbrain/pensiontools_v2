// The V7 build: its own page (v7/index.html). Where it is written and what its head says follow the layout
// (src/appLayout.js, vite.layout.js): at 7.0 (LAYOUT unset or switch) <site>/, with the public folder (the privacy
// policy, the market data, the kill-switch sw.js, the manifest and icons, _headers) and the forward from the old /v7/
// address; LAYOUT=preview, the rollback, <site>/v7/ as before. SITE_OUT moves <site> from docs/ (dist/prod, dist/test
// for the browser tests). The two builds (this and vite.config.js) each empty their own folder only, so they run in
// either order.
import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layoutNamed } from './src/appLayout.js';
import { outFor, emptyOwnFolder, v7Head, oldV7Forward, emulatorsWanted } from './vite.layout.js';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const layout = layoutNamed(process.env.LAYOUT);
  const { outDir, keep } = outFor(layout, 'v7');
  return {
    root: resolve(here, 'v7'),
    base: './',
    // the site root's public folder: served by `npm run dev:v7` (V7 at its root), and copied by the build when V7 is
    // the site's root (the switch layout)
    publicDir: resolve(here, 'public'),
    // __PT_EMULATORS__: true only in the signed-in browser tests' build (VITE_EMULATORS=1): the local Firebase emulators of a
    // demo- project in place of the live project (src/firebase/projectConfig.js); false in every published build.
    define: { __PT_LAYOUT__: JSON.stringify(layout), __PT_EMULATORS__: JSON.stringify(emulatorsWanted()) },
    plugins: [emptyOwnFolder(outDir, keep), v7Head(layout), oldV7Forward(layout, outDir)],
    // The test build keeps console output; the published build never ships it (as the current app).
    esbuild: { jsx: 'automatic', jsxImportSource: 'preact', drop: mode === 'test' ? [] : ['console', 'debugger'] },
    worker: { format: 'es' },
    build: {
      outDir,
      emptyOutDir: false,                  // emptyOwnFolder empties it, leaving the classic page's folder alone
      copyPublicDir: layout === 'switch',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    server: { port: 3001, fs: { allow: [here] } }
  };
});
