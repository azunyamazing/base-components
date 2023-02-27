import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { virtualTreePlugin } from './vite-plugin-react-virtual';
import { renderAppPlugin } from './vite-plugin-react-render';


export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
  },
  plugins: [virtualTreePlugin(), renderAppPlugin(), react()],
  resolve: {
    alias: {
      '@': '.'
    }
  }
})
