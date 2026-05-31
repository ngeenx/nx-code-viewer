/**
 * PostCSS config scoped to the live-demo entries in this directory.
 *
 * The Crylith Svelte live-demo adapter (`@crylith/client-svelte`) builds
 * each demo with `vite.build({ root: <this dir>, configFile: false })`
 * and the `@sveltejs/vite-plugin-svelte` plugin only. Vite still
 * auto-loads a PostCSS config from the build root even when
 * `configFile: false`, so this file gives the demo build a Tailwind v4
 * pipeline. Combined with the `import '../../../app.css'` in
 * `_shared/useDemoOptions.svelte.ts`, it compiles Tailwind + the
 * nx-code-viewer theme into each demo's emitted `styles.css`.
 *
 * It lives in `src/components/demo/` (a subdirectory) so it only affects
 * builds rooted here. The svelte-demo app build is rooted higher and
 * uses the `@tailwindcss/vite` plugin instead, so the two never collide.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
