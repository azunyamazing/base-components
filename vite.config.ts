import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

import { menuPlugin } from './vite-plugin-menu';
import { fileRoutesPlugin } from './vite-plugin-routes';


export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
  },
  plugins: [menuPlugin(), fileRoutesPlugin(), vue(), react()],
  resolve: {
    alias: {
      '@': './src'
    },
    extensions: ['.ts', '.json', '.tsx', '.vue']
  }
})

export { }
