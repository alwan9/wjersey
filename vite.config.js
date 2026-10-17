import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5500,
    open: false,
    host: true
  },
  preview: {
    port: 5500
  }
});
