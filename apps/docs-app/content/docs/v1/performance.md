---
title: Performance
description: How the viewer minimises bundle weight and highlight cost, and what knobs you have as a consumer.
sidebar:
  group: Guides
  icon: gauge
  order: 2
---

# Performance

The viewer is wired to follow [Shiki's performance guide](https://shiki.style/guide/best-performance)
out of the box. This page explains what is already handled for you,
then lists the levers worth pulling in your own app.

## What the viewer already does

### 1. JavaScript regex engine, no WebAssembly

Shiki normally ships with the Oniguruma regex engine, which is a
~600 KB inlined WebAssembly blob. The viewer instead wires Shiki
to its native JavaScript regex engine, so nothing WebAssembly ever
loads in the browser.

The trade-off: a small number of TextMate grammars rely on
Oniguruma only regex features (`\G` anchors, possessive quantifiers,
and similar). Under the JS engine those patterns degrade to a
minor mis-highlight rather than a crash. Every grammar Shiki bundles
out of the box renders correctly for typical source. The engine is
also started in **forgiving mode**, so any unsupported pattern logs
a console warning instead of throwing.

If you have a custom grammar that relies on Oniguruma features and
you want exact fidelity, you would need to fork the helper that
builds the highlighter and swap the engine. There is no per-instance
override today.

### 2. One highlighter, shared across every viewer instance

The viewer uses `createSingletonShorthands` under the hood. Mount
fifty `<nx-code-viewer />` instances on a page and they share one
highlighter, one lang registry, and one theme registry. Creating a
highlighter is the expensive operation in Shiki; you only pay it
once per page load, lazily on the first highlight call.

### 3. Lazy grammar and theme loading

The viewer ships the bundled language and theme **index**, not the
grammars themselves. Each grammar JSON and each theme JSON is
fetched on demand the first time it is referenced. A docs site
that shows TypeScript, JSON, and Bash never downloads the Rust
grammar; if a user later views a Rust snippet, that one grammar is
fetched and cached, future Rust snippets reuse it.

### 4. Fine-grained Shiki imports

The viewer imports from `shiki/core`, `shiki/langs`, `shiki/themes`,
and `shiki/engine/javascript` rather than the top-level `shiki`
entry. The top-level entry statically imports the Oniguruma engine,
which has top-level side effects bundlers cannot tree-shake.
Importing the subpaths keeps the WASM blob out of the dependency
graph entirely.

## What you should do in your own app

### Never import `codeToHtml` from `'shiki'` yourself

If any code in your app does:

```ts
import { codeToHtml } from 'shiki';
```

your bundler will pull the full Shiki entry into the page, and with
it the Oniguruma WebAssembly engine, even though the viewer would
not otherwise need it. Use the viewer's own services and components
to highlight code, or import from `'shiki/core'` and friends
directly. Type only imports are fine:

```ts
import type { BundledLanguage, BundledTheme } from 'shiki';
```

These vanish at compile time and do not pull anything into the
bundle.

### Watch your Vite `optimizeDeps`

If your project lists `'shiki'` in `optimizeDeps.include`, Vite
pre-bundles the full entry and the WebAssembly chunks show up in
DevTools. Remove the entry, or replace it with the subpaths the
viewer actually uses:

```ts
// vite.config.ts
optimizeDeps: {
  include: [
    'shiki/core',
    'shiki/langs',
    'shiki/themes',
    'shiki/engine/javascript',
  ],
}
```

After the change, clear `node_modules/.vite` so stale pre-bundles
do not linger.

### Bound the rendered viewport, not the highlighted input

Highlight cost scales with the number of tokens, not bytes. Setting
`maxHeight` caps the rendered DOM without changing how much code
Shiki has to tokenise, so the cost stays the same. For genuinely
large input (logs, generated SQL, minified bundles), trim the
source before passing it in:

- paginate logs to the last N lines server-side,
- truncate minified output to the first few thousand characters,
- use `maxCodeLength` as a guardrail; inputs longer than the limit
  render as a placeholder.

### Pass stable references to inputs

Each time the value of `code`, `language`, or `theme` changes, the
viewer reschedules a highlight pass. If you compute one of those
inline (a new string per change-detection cycle, a new object
literal per render in React), you trigger unnecessary work.
Memoise or hoist the values once, so the viewer only re-highlights
when something genuinely changes.

### Pre-warm grammars before the first paint

For a docs site that consistently shows the same languages on the
landing page, you can pre-load grammars during application
bootstrap so they are ready when the first viewer mounts:

```ts
import { codeToHtml } from '@ngeenx/nx-code-viewer-utils';

// Touch the languages and theme you know the first paint needs,
// so the grammar JSON downloads in parallel with the rest of the
// initial bundle instead of waiting for the first highlight.
void codeToHtml('', { lang: 'typescript', theme: 'github-light' });
void codeToHtml('', { lang: 'json', theme: 'github-light' });
```

`codeToHtml` resolves lazily; calling it with an empty string is
cheap and fetches the grammar plus theme as a side effect.

### Server-side and prerendering

The same `codeToHtml` shorthand works in Node, so static-site
generators (Vite SSG, Angular Universal, Next, Nuxt, SvelteKit) can
pre-render highlighted HTML at build time. The client then ships
no highlighter at all for those snippets. Switching themes at
runtime still needs the highlighter; if your site is read-only and
theme switching is not a feature, you can drop the viewer's runtime
chrome entirely and just style the prerendered HTML.

## Common bundle traps

These are the patterns that quietly bring the WebAssembly chunk
back into the bundle. If you see `wasm-*.js` requests in the
network tab, search for one of these in your repo:

1. `import ... from 'shiki'` (runtime, not type only) anywhere in
   your application code or in a linked workspace package.
2. A linked library whose **built** output still imports `'shiki'`
   directly. Rebuilding the library after upgrading the viewer is
   often what fixes this.
3. A markdown or MDX transformer that calls `import('shiki')`
   during SSR but executes in the browser bundle. Move the call
   behind an `import.meta.env.SSR` guard or use the viewer's helper
   instead.

When in doubt, check
`node_modules/.vite/<app>/deps/_metadata.json` for any `wasm-*`
chunks; those are the canary.
