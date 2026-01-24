import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    watch: false,
  },
})
