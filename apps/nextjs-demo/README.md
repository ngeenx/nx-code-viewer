# nextjs-demo

Standalone **Next.js (App Router)** static-site-generation showcase for
`@ngeenx/nx-react-code-viewer`. It proves the React code viewer renders during
the static export pass and hydrates on the client, mirroring what `nuxt-demo`
does for the Vue viewer.

## How it works

- **Isolated install.** Dependencies live in `apps/nextjs-demo/node_modules`
  and are installed with `pnpm install --ignore-workspace`, so this app never
  touches the root monorepo lockfile.
- **Consumes the built library.** It depends on
  `@ngeenx/nx-react-code-viewer` via a `file:` reference to its `dist/` output,
  so rebuild that library first if its source changes
  (`nx run nx-react-code-viewer:build` — wired as a `dependsOn` of the build
  targets here).
- **Static export.** `next.config.mjs` sets `output: 'export'`, so
  `next build` prerenders every route to plain HTML in `out/` with no Node
  server at runtime.

## Commands

```bash
# one-time install of the isolated dependency tree
nx run nextjs-demo:install

# dev server on http://localhost:3001
nx run nextjs-demo:serve

# static export -> apps/nextjs-demo/out
nx run nextjs-demo:build

# preview the exported out/ directory
nx run nextjs-demo:preview
```

## Routes

- `/` — intro plus an install snippet rendered by the code viewer.
- `/ssg` — a prerendered showcase (basic, highlighted, diff, multi-tab) that
  hydrates and flips its Shiki theme with the chrome toggle.
