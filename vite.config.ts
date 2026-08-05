import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/mobile-wedding-invitation/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: `${projectRoot}index.html`,
        designLab: `${projectRoot}design-lab/index.html`,
        invitationA: `${projectRoot}invitation-a/index.html`,
        invitationB: `${projectRoot}invitation-b/index.html`,
      },
    },
  },
})
