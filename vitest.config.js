import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // Two tiers, one glob: slow files are named *.slow.test.js and still match this, so a plain
    // `vitest run` (test:all, CI, the data bot) covers everything; test:fast excludes them by name.
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js', 'src/**/index.js']
    },
    reporters: ['verbose'],
    testTimeout: 10000
  }
});
