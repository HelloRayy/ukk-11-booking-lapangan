import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'route-rewrite-middleware',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url) {
            const urlPath = req.url.split('?')[0]
            if (urlPath === '/reservasi') {
              req.url = '/reservasi.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')
            } else if (urlPath === '/blanca') {
              req.url = '/blanca.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')
            }
          }
          next()
        })
      },
    },
  ],
})
