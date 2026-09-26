import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'

const routeMiddleware = (req: any, _res: any, next: () => void) => {
  if (req.url) {
    const urlPath = req.url.split('?')[0]
    const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : ''
    if (urlPath === '/reservasi') {
      req.url = '/reservasi.html' + query
    } else if (urlPath === '/blanca') {
      req.url = '/index.html' + query
    } else if (urlPath === '/kasir') {
      req.url = '/kasir.html' + query
    } else if (urlPath === '/prototype') {
      req.url = '/prototype.html' + query
    }
  }
  next()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'route-rewrite-middleware',
      configureServer(server) {
        server.middlewares.use(routeMiddleware)
      },
      configurePreviewServer(server) {
        server.middlewares.use(routeMiddleware)
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        reservasi: resolve(__dirname, 'reservasi.html'),
        kasir: resolve(__dirname, 'kasir.html'),
        prototype: resolve(__dirname, 'prototype.html'),
      },
    },
  },
})
