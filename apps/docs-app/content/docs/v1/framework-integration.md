---
title: Framework Integration
description: SSR, hydration, and bundler notes for Angular Universal, Nuxt, SvelteKit, and Next.js.
sidebar:
  group: Guides
  icon: plug
  order: 1
---

# Framework Integration

Every framework binding is the same component with the same inputs.
What differs between Angular Universal, Nuxt, SvelteKit, and Next.js
is how the snippet is rendered and hydrated. This page collects the
gotchas so you don't hit them in production.

If you only render snippets in the browser (no SSR), you can skip
the framework-specific notes and use the
[Quick Start](/docs/v1/quick-start) instructions as-is.

## Why SSR is different

Shiki tokenises code by running a TextMate grammar through a small
WASM engine. Both the grammar and the engine can run server-side,
which is the whole point: snippets render to fully highlighted HTML
on the server and arrive at the browser already styled. No client
JS is needed just to color the code.

But three things must line up across the server and client render:

1. **The same Shiki theme** must resolve on both sides. Resolving
   from `localStorage` or `prefers-color-scheme` on the server is
   impossible; pass a static value or read a cookie.
2. **The same grammar set** must be available. If the server bundle
   ships `typescript` but the client bundle only loaded `javascript`,
   hydration warns about mismatched markup.
3. **The viewer's chrome CSS** (`@ngeenx/nx-code-viewer-theme`) must
   load before paint. Without it the borderless first render flashes
   into the styled chrome on hydration.

The rest of this page is framework-specific guidance for getting
those three right.

## Angular Universal / SSR

:::callout
The Angular binding ships a standalone component (`<nx-code-viewer>`)
and works under Angular Universal with no special wiring. The notes
below cover the production checklist.
:::

**Import the stylesheet in `styles.css`**. Angular extracts it into
the SSR HTML head, which means the snippet is fully styled on the
first paint:

```css
/* src/styles.css */
@import '@ngeenx/nx-code-viewer-theme';
```

**Pin the Shiki theme statically** when SSR is enabled. Reading
`prefers-color-scheme` only works in the browser, so the server
render defaults to whatever value is hard-coded:

```ts
@Component({
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      shikiTheme="github-dark" />
  `,
})
export class SnippetComponent {
  /* ... */
}
```

For dark-mode-aware sites, bind `theme` to a signal driven by the
existing app theme service (the one your nav bar already uses).
Both server and client read the same source.

**Defer `tippy.js`**. The Angular reference-popover layer lazy-loads
tippy on first interaction, so SSR-rendered HTML never includes it.
No extra config required.

## Nuxt 3

The Vue binding pairs cleanly with Nuxt's hybrid renderer. Tested
with Nuxt 3.10+ and Vue 3.5.

**Register the stylesheet in `nuxt.config.ts`**:

```ts
export default defineNuxtConfig({
  css: ['@ngeenx/nx-code-viewer-theme'],
});
```

**Render server-side** by using the component directly in a page or
content file:

```vue
<script setup lang="ts">
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer';

const code = `interface User { id: string; }`;
</script>

<template>
  <NxCodeViewer :code="code" language="typescript" shiki-theme="github-dark" />
</template>
```

**For `<ClientOnly>` use cases** (e.g. dynamic theme switching
based on `useColorMode()`), wrap the viewer:

```vue
<ClientOnly>
  <NxCodeViewer :code="code" language="ts" :theme="colorMode.value" />
  <template #fallback>
    <pre>{{ code }}</pre>
  </template>
</ClientOnly>
```

The fallback prevents layout shift while the client mounts.

## SvelteKit

The Svelte binding requires Svelte 5 (uses `$state` / `$props`
runes). Tested with SvelteKit 2.x.

**Add the stylesheet to your root `+layout.svelte`**:

```svelte
<script lang="ts">
  import '@ngeenx/nx-code-viewer-theme';
  let { children } = $props();
</script>

{@render children()}
```

**Server-load the snippet** in `+page.server.ts` for SSR:

```ts
// src/routes/posts/[slug]/+page.server.ts
export const load = async ({ params }) => {
  const code = await loadSnippet(params.slug);
  return { code };
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  let { data } = $props();
</script>

<NxCodeViewer code={data.code} language="typescript" shikiTheme="github-dark" />
```

## Next.js (App Router, RSC)

In the App Router, every server component renders on the server by
default. The React binding works as both a server and client
component, but the **`shikiTheme`/`shikiThemes` props must be
serialisable**, which they already are (plain strings).

**Add the chrome stylesheet to the root layout**:

```tsx
// app/layout.tsx
import '@ngeenx/nx-code-viewer-theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**Render snippets from a server component** for the lowest bundle:

```tsx
// app/posts/[slug]/page.tsx
import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer';

export default async function Post({ params }: { params: { slug: string } }) {
  const code = await loadSnippet(params.slug);
  return (
    <NxCodeViewer code={code} language="typescript" shikiTheme="github-dark" />
  );
}
```

**For interactive features**, lift the snippet into a `'use client'`
boundary. Reference popovers, per-line widgets, and chrome `theme`
toggling all require client JS.

**Streaming**: snippets render synchronously inside the server tree,
so they participate in the App Router's streaming
HTML out of the box.

## Common patterns across all frameworks

### Theme flicker on first paint

The chrome stylesheet defines the CSS variables. If it loads
asynchronously (CSS chunked into a separate file Vite/webpack split)
the first paint shows borderless plain text before the styled chrome
flashes in.

Two fixes:

1. **Import it in the root entry** so it lands in the initial CSS
   bundle. This is what every example in this page does.
2. **Inline the critical variables** in your app's base stylesheet
   for first-paint speed. The bundled themes overwrite them once they
   load.

### Hydration mismatch

If you see "hydration mismatch" warnings in the console, check that
`shikiTheme` resolves to the same value on server and client.
Reading `localStorage` or `prefers-color-scheme` synchronously on
the client gives a value the server didn't have. Either:

- Pin `shikiTheme` to a constant string in SSR-rendered components.
- Move the theme-switching viewer into a client-only boundary.

### Bundle size

Shiki is the largest dependency. By default it ships every grammar
and theme; that's typically OK for docs sites but can be cut down.
See [Language Support](/docs/v1/language-support) for the
fine-grained import patterns and bundle-size table.

## Production checklist

| Concern                                 | Where to check                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Stylesheet loads before paint           | First paint shows styled chrome with border + header                               |
| No hydration warnings                   | Browser console clean on a server-rendered snippet                                 |
| Same theme on server and client         | View source HTML; the `class` attribute on `<pre>` matches what the client renders |
| `tippy.js` deferred                     | DevTools Network: tippy loads on first popover hover, not on page load             |
| `shiki` tree-shaken (if you customised) | DevTools Coverage: only the languages you use ship to the client                   |
