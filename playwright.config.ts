import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:5173/mobile-wedding-invitation/', channel: 'chrome', headless: true },
  workers: 1,
})
