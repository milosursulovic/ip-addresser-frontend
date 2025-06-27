import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const ip = process.env.VITE_HOST_IP_ADDRESS || 'localhost'

export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, `../../cert/${ip}-key.pem`)),
      cert: fs.readFileSync(path.resolve(__dirname, `../../cert/${ip}.pem`)),
    },
    host: ip,
    port: 5173,
  },
})
