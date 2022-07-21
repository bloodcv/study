import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  open: true,
  server: {
    hmr: true
  },
  configureWebpack: {
    devtool:'source-map'
  }
})
