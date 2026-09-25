import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { createWeddingCalendar } from './src/draftCalendarFile.ts'
import { copyDefaults } from './src/draftCopy.ts'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/mobile-wedding-invitation/',
  plugins: [react(), {
    name: 'wedding-calendar-file',
    generateBundle() {
      this.emitFile({ type:'asset', fileName:'calendar/wedding.ics', source:createWeddingCalendar(copyDefaults)! })
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/mobile-wedding-invitation/calendar/wedding.ics') return next()
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
        res.end(createWeddingCalendar(copyDefaults))
      })
    },
  }],
  build: {
    rollupOptions: {
      input: {
        main: `${projectRoot}index.html`,
        designLab: `${projectRoot}design-lab/index.html`,
        draft: `${projectRoot}draft/index.html`,
        invitationA: `${projectRoot}invitation-a/index.html`,
        invitationB: `${projectRoot}invitation-b/index.html`,
      },
    },
  },
})
