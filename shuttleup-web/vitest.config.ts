import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: 'next/navigation', replacement: path.resolve(__dirname, './node_modules/next/navigation.js') },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
  },
})
