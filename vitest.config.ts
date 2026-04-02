import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // enable alias from tsconfig.json
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
});
