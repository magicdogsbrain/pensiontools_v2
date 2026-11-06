// The classic page's build (index.html). Where it is written and what its head says follow the layout
// (src/appLayout.js, vite.layout.js): at 7.0 (LAYOUT unset or switch) <site>/classic/; LAYOUT=preview, the rollback,
// <site>/ as before. SITE_OUT moves <site> from docs/ (dist/prod for the browser tests). The two builds (this and
// vite.v7.config.js) each empty their own folder only, so they run in either order.
import { defineConfig } from 'vite';
import { layoutNamed } from './src/appLayout.js';
import { outFor, emptyOwnFolder, classicHead, classicDataCopy, emulatorsWanted } from './vite.layout.js';

export default defineConfig(({ command }) => {
  // The dev server serves the source folders as they are, the classic page at / and V7's page at /v7/ (v7/index.html):
  // the preview layout's shape, so `npm run dev` takes it unless LAYOUT names one.
  const layout = command === 'serve' && !process.env.LAYOUT ? 'preview' : layoutNamed(process.env.LAYOUT);
  const { outDir, keep } = outFor(layout, 'classic');
  return {
    root: '.',
    base: './',
    publicDir: 'public',
    // Where each app lives (src/appLayout.js): the bundle carries this layout's addresses.
    // __PT_EMULATORS__: true only in the signed-in browser tests' build (VITE_EMULATORS=1): the local Firebase emulators of a
    // demo- project in place of the live project (src/firebase/projectConfig.js); false in every published build.
    define: { __PT_LAYOUT__: JSON.stringify(layout), __PT_EMULATORS__: JSON.stringify(emulatorsWanted()) },
    plugins: [emptyOwnFolder(outDir, keep), classicHead(layout), classicDataCopy(layout, outDir)],
    // Never ship console output: several logs carried the user's financial data (security audit H1).
    // jsx: only so tests can read V7's .jsx files; the current app has none, so its bundle is unchanged.
    esbuild: { drop: ['console', 'debugger'], jsx: 'automatic', jsxImportSource: 'preact' },
    build: {
      outDir,
      emptyOutDir: false,                  // emptyOwnFolder empties it, leaving V7's folder alone
      // the public folder is the site root's: copied here only when this page is at the root (the preview layout)
      copyPublicDir: layout === 'preview',
      rollupOptions: {
        input: {
          main: './index.html'
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      port: 3000,
      open: true
    },
    preview: {
      port: 4173
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['tests/**/*.test.js'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.js'],
        exclude: ['src/**/*.test.js']
      }
    }
  };
});
