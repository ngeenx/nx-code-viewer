import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  // Global stylesheet: pulls in Tailwind v4 + the shared code-viewer theme
  // (same chain the vue-demo uses). The theme is linked from the monorepo
  // package source via a file: dependency.
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    // The library is published ESM with `vue` as an external peer. Dedupe
    // guarantees a single Vue instance across Nuxt and the library so SSR
    // reactivity proxies don't crash, and pre-bundling keeps dev fast.
    resolve: {
      dedupe: ['vue'],
    },
    optimizeDeps: {
      include: ['@ngeenx/nx-vue-code-viewer'],
    },
  },

  // Transpile the library so its SFC-derived ESM is processed by Nuxt's
  // build (handles the bundled component runtime + scoped styles).
  build: {
    transpile: ['@ngeenx/nx-vue-code-viewer'],
  },

  // SSR is on by default (universal rendering). The /ssg route is
  // additionally prerendered to static HTML at build time, proving the
  // library works in a fully static (nuxi generate) pass too.
  routeRules: {
    '/ssg': { prerender: true },
  },
  nitro: {
    prerender: {
      routes: ['/ssg'],
    },
  },
});
