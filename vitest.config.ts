import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    watch: false,
    fileParallelism: false,
    isolate: false,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      include: ['src/modules/**/services/*.ts'],
      reporter: ['text-summary', 'lcov'],
      reportsDirectory: 'coverage',
      provider: 'v8',
    },
  },
})
