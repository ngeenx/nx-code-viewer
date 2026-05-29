# nuxt-demo

A standalone **Nuxt 4** application that consumes
`@ngeenx/nx-vue-code-viewer` to prove the library works under server-side
rendering (SSR) and static site generation (SSG), then hydrates correctly
on the client.

## Why it is isolated

This app is **not** part of the root pnpm workspace. It keeps its own
`package.json` + `node_modules` (installed with `pnpm install
--ignore-workspace`) so adding Nuxt never mutates the monorepo's shared
`pnpm-lock.yaml` or collides with the pinned Vite 7 / Vue 3.5 versions and
the large `overrides` block in the root `pnpm-workspace.yaml`.

It depends on the library the way a real external consumer would, via the
built dist:

```jsonc
"@ngeenx/nx-vue-code-viewer": "file:../../dist/packages/client/ui/nx-vue-code-viewer",
"@ngeenx/nx-code-viewer-theme": "file:../../packages/styles/nx-code-viewer-theme/src"
```

> Because it links the **built** dist, rebuild the Vue library first if you
> change its source, then re-run `install` here.

## Commands

From the repo root via Nx:

```bash
nx run nuxt-demo:install    # one-time: pnpm install --ignore-workspace
nx run nuxt-demo:dev        # dev server (http://localhost:3000)
nx run nuxt-demo:build      # SSR build + prerender /ssg
nx run nuxt-demo:generate   # full static export
nx run nuxt-demo:preview    # preview the production build
```

Or directly inside `apps/nuxt-demo`: `pnpm dev`, `pnpm build`, etc.

## What it shows

| Route   | Rendering                | Proves                                            |
| ------- | ------------------------ | ------------------------------------------------- |
| `/`     | SSR                      | Library mounts + a basic viewer renders           |
| `/ssr`  | SSR (universal)          | Viewers server-render per request, then hydrate   |
| `/ssg`  | Prerendered static HTML  | Viewers fully highlighted at build time, hydrate  |

The code viewer is server-rendered: the highlighted Shiki markup is present
in the initial HTML response (view source to confirm), so there is no blank
flash and the content is crawlable.

## How SSR-safety is handled

- The library imports `vue` as an external peer; `nuxt.config.ts` sets
  `vite.resolve.dedupe: ['vue']` so a single Vue instance serves both Nuxt
  and the library.
- The library is added to `build.transpile`.
- Browser-only work in the library runs inside lifecycle hooks, and the
  chrome theme (`useChromeTheme`) renders `light` on the server and
  reconciles to the stored/system preference after mount.
