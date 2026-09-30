// The V7 build: its own page (v7/index.html) and its own output (docs/v7/), beside the current app.
// The current app's build is vite.config.js and must run FIRST — it empties docs/.
// V7_OUT sends the output elsewhere (dist/prod/v7, dist/test/v7 for the browser tests).
import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  root: resolve(here, 'v7'),
  base: './',
  publicDir: false,
  // The test build keeps console output; the published build never ships it (as the current app).
  esbuild: { jsx: 'automatic', jsxImportSource: 'preact', drop: mode === 'test' ? [] : ['console', 'debugger'] },
  worker: { format: 'es' },
  build: {
    outDir: resolve(here, process.env.V7_OUT || 'docs/v7'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: { port: 3001, fs: { allow: [here] } }
}));
