const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5500,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 5500,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        katalog: resolve(__dirname, 'katalog.html'),
      },
    },
  },
});
