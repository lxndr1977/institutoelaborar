// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  base: '/institutoelaborar/',
  output: 'static',

  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: "Be Vietnam Pro",
      cssVariable: "--font-be-vietnam-pro",
      weights: [400, 500, 600, 700],
    }]
  },

  devToolbar: {
    enabled: false
  },

  site: 'https://institutoelaborar.org',
  integrations: [sitemap()],
  adapter: cloudflare()
});