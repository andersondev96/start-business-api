import path from 'path'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  resolve: {
    alias: [
      { find: /^@modules\/(.*)$/, replacement: path.resolve(__dirname, 'src/modules/$1') },
      { find: /^@config\/(.*)$/, replacement: path.resolve(__dirname, 'src/config/$1') },
      { find: /^@shared\/(.*)$/, replacement: path.resolve(__dirname, 'src/shared/$1') },
      { find: /^@database\/(.*)$/, replacement: path.resolve(__dirname, 'src/database/$1') },
      { find: /^env$/, replacement: path.resolve(__dirname, 'src/env') },
    ],
  },
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
