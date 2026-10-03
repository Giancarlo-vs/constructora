// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ingesuelosconcalidad.com',
  // Páginas como archivo .html (servicios.html): Cloudflare las sirve en /servicios sin redirigir.
  build: { format: 'file' },
  trailingSlash: 'never',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});