/**
 * PostCSS config scoped to the live-demo entries in this directory.
 *
 * The Crylith Vue live-demo adapter (`@crylith/client-vue`) builds each
 * demo with `vite.build({ root: <this dir>, configFile: false })` and the
 * `@vitejs/plugin-vue` plugin only - it does NOT process the source's
 * `globalStyles` (unlike the Angular adapter). Vite still auto-loads a
 * PostCSS config from the build root even when `configFile: false`, so
 * this file gives the demo build a Tailwind v4 pipeline. Combined with the
 * `import './_shared/demo-theme.css'` in `useDemoOptions.ts`, it compiles
 * Tailwind + the nx-code-viewer theme (282 `@apply`s + `@theme`) into each
 * demo's emitted `styles.css`.
 *
 * It lives in `src/components/demo/` (a subdirectory) so it only affects builds
 * rooted here - the vue-demo app build is rooted higher and uses the
 * `@tailwindcss/vite` plugin instead, so the two never collide.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
