import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import monkey, { cdn } from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    preact(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'faceit-ext',
        icon: 'https://www.faceit.com/favicon.ico',
        namespace: 'https://github.com/swxfe/faceit-ext',
        match: ['*://*.faceit.com/*'],
        description: 'Faceit Extender Userscript',
        author: 'swxfe',
        version: '1.0',
        license: 'MIT',
        updateURL: 'https://github.com/swxfe/faceit-ext/raw/refs/heads/main/dist/faceit-ext.user.js',
        downloadURL: 'https://github.com/swxfe/faceit-ext/raw/refs/heads/main/dist/faceit-ext.user.js',
      },
      build: {
        externalGlobals: {
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
        },
      },
    }),
  ],
});