---
title: Markdown Integration
description: Replace fenced code blocks with nx-code-viewer across markdown-it, remark, MDX, marked, and plain HTML pipelines.
sidebar:
  group: Guides
  icon: square-code
  order: 2
---

# Markdown Integration

Most documentation sites already render fenced code blocks
(` ```ts ... ``` `) through a markdown processor. nx-code-viewer
fits anywhere that pipeline emits HTML or JSX, so you usually do
not rewrite content. You replace the renderer that turns a `code`
node into output and forward the same fields to `<nx-code-viewer>`.

This page shows the swap for the common stacks. Pick yours from
the matrix, jump to the section, and copy the snippet.

The framework-specific snippets below (MDX components, Web
Component bootstrap glue) track the **Framework** select in the
sidebar. Switch it to see Angular, React, Vue, or Svelte. The
processor-level integrations (markdown-it fence override, remark
plugin, marked renderer) are framework-agnostic and render the
same regardless of your pick.

## Pick your stack

| Stack | Pattern | Section |
| --- | --- | --- |
| VuePress, VitePress-style, Eleventy | `markdown-it` `fence` rule override | [markdown-it](#markdown-it) |
| Astro Content Collections, Gatsby, Next/Nuxt with MDX, AnalogJS | Remark plugin + framework binding | [remark / unified](#remark--unified) |
| React Docusaurus, Astro MDX, Next.js MDX | Component override | [MDX](#mdx) |
| Older or lightweight stacks | `marked` `renderer.code()` | [marked](#marked) |
| Static HTML, CMS-rendered markdown, no bundler | Web Component fallback | [Web Component fallback](#web-component-fallback) |

## The contract

Whatever processor sits in front of nx-code-viewer, every renderer
ends up forwarding the same three fields:

| Input | Source in markdown | Notes |
| --- | --- | --- |
| `code` | the raw fenced content | trailing newline is fine |
| `language` | the fence info-string first token | any [Shiki bundled grammar](https://shiki.style/languages) id |
| `title` | a `title="..."` attribute in the info string | optional |
| `highlightedLines` | a `{1-3,5}` token in the info string | optional |
| `diffCode` | a sibling fence or convention | only for diff view |

The rest of the [Configuration](/docs/v1/get-started/configuration) inputs map
the same way once you have the info-string parser wired.

## markdown-it

Replace the default `fence` rule so each fenced block emits a
`<nx-code-viewer>` element instead of a `<pre><code>` pair:

```ts
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true })

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = token.info.trim()
  const [lang = '', ...rest] = info.split(/\s+/)
  const meta = rest.join(' ')

  const title = /title=["']([^"']+)["']/.exec(meta)?.[1] ?? ''
  const hl = /\{([\d,\-\s]+)\}/.exec(meta)?.[1] ?? ''

  const code = escapeAttr(token.content)
  return (
    `<nx-code-viewer ` +
    `code="${code}" ` +
    `language="${escapeAttr(lang)}" ` +
    (title ? `title="${escapeAttr(title)}" ` : '') +
    (hl ? `highlighted-lines="${escapeAttr(hl)}" ` : '') +
    `theme="dark"></nx-code-viewer>`
  )
}

function escapeAttr(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}
```

Make sure the `<nx-code-viewer>` web component is registered on the
page (see [Web Component fallback](#web-component-fallback)) so the
HTML the markdown emits gets upgraded at runtime.

## remark / unified

`remark` parses markdown to an MDAST. A small plugin visits every
`code` node and either rewrites it to an HTML node (when you render
to static HTML) or attaches the parsed fields for an MDX component
to consume.

```ts
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Code } from 'mdast'

interface Options {
  /** Default chrome theme; falls through to the component's own default. */
  theme?: 'light' | 'dark'
}

export const remarkNxCodeViewer: Plugin<[Options?], Root> = (opts = {}) => {
  return (tree) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (!parent || typeof index !== 'number') return
      const info = parseInfo(node.meta ?? '')
      const html = renderViewer({
        code: node.value,
        language: node.lang ?? 'plaintext',
        title: info.title,
        highlightedLines: info.highlightedLines,
        theme: opts.theme ?? 'dark',
      })
      parent.children.splice(index, 1, {
        type: 'html',
        value: html,
      } as never)
    })
  }
}
```

Slot it after `remarkParse` and before the renderer:

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkNxCodeViewer, { theme: 'dark' })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })
```

For MDX, skip the `type: 'html'` rewrite and instead set custom
`data.hName` / `data.hProperties` on the code node so the MDX
compiler routes it to a real component (see [MDX](#mdx) below).

## MDX

MDX exposes a `components` prop you can use to swap the default
`code` / `pre` renderer for the framework binding's component. The
sidebar **Framework** select drives the snippet below.

:::if{framework="angular"}

`@analogjs/content` is the most common Angular MDX pipeline. It
compiles `.md` / `.mdx` files to inert HTML at build time; you mount
the result inside an Angular component and `CUSTOM_ELEMENTS_SCHEMA`
lets the `<nx-code-viewer>` tag boot itself once the binding's
custom element is registered.

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core'
import { provideContent, withMarkdownRenderer } from '@analogjs/content'

export const appConfig: ApplicationConfig = {
  providers: [
    provideContent(
      withMarkdownRenderer({
        loadMermaid: () => import('mermaid'),
      })
    ),
  ],
}
```

Register the custom element once at bootstrap, then any `<nx-code-viewer>`
tag the MDX output emits will upgrade:

```ts
// main.ts
import { bootstrapApplication, createApplication } from '@angular/platform-browser'
import { createCustomElement } from '@angular/elements'
import { NxAngularCodeViewerComponent } from '@ngeenx/nx-angular-code-viewer'
import { AppComponent } from './app/app.component'
import { appConfig } from './app/app.config'

const app = await createApplication(appConfig)
const element = createCustomElement(NxAngularCodeViewerComponent, {
  injector: app.injector,
})
customElements.define('nx-code-viewer', element)

await bootstrapApplication(AppComponent, appConfig)
```

Pair it with the [remark plugin](#remark--unified) above so every
fenced block becomes a `<nx-code-viewer>` tag in the rendered HTML.

:::

:::if{framework="react"}

```tsx
import { MDXProvider } from '@mdx-js/react'
import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer'

const components = {
  pre: ({ children }: { children: { props: { className?: string; children: string } } }) => {
    const className = children.props.className ?? ''
    const lang = /language-(\w+)/.exec(className)?.[1] ?? 'plaintext'
    return (
      <NxCodeViewer
        code={children.props.children.trimEnd()}
        language={lang}
        theme="dark"
      />
    )
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
```

:::

:::if{framework="vue"}

```vue
<!-- app/MdxLayout.vue -->
<script setup lang="ts">
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer'

const slots = defineSlots<{ default: () => unknown }>()
</script>

<template>
  <component :is="$slots.default" :components="{ pre: PreOverride }" />
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer'

export const PreOverride = defineComponent({
  props: { children: { type: Object, required: true } },
  setup(props) {
    return () => {
      const className = (props.children as any).props?.className ?? ''
      const lang = /language-(\w+)/.exec(className)?.[1] ?? 'plaintext'
      const code = (props.children as any).props?.children?.trimEnd?.() ?? ''
      return h(NxCodeViewer, { code, language: lang, theme: 'dark' })
    }
  },
})
</script>
```

:::

:::if{framework="svelte"}

mdsvex compiles `.svx` files. Override `code` in your `mdsvex.config.js`
to render via the Svelte binding:

```js
// mdsvex.config.js
export default {
  extensions: ['.svx'],
  highlight: {
    highlighter: async (code, lang) => {
      const escaped = code
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
      return (
        `<NxCodeViewer code="${escaped}" language="${lang ?? 'plaintext'}" theme="dark" />`
      )
    },
  },
}
```

Then expose `NxCodeViewer` in your layout so the inserted tag
resolves at render time:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer'
</script>

<slot />
```

:::

### Forwarding line highlights and titles

MDX strips arbitrary fence meta by default. Use one of:

- **`rehype-mdx-code-props`** to pass meta as JSX props
- **A remark plugin** like the one in [remark / unified](#remark--unified)
  to attach `data.hProperties` so MDX surfaces them as props on
  the custom component

The component prop names are the same across frameworks; only the
binding import changes.

:::if{framework="angular"}

```ts
// my-code-block.component.ts
import { Component, input } from '@angular/core'
import { NxAngularCodeViewerComponent } from '@ngeenx/nx-angular-code-viewer'

@Component({
  selector: 'app-code-block',
  imports: [NxAngularCodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="code()"
      [language]="language()"
      [title]="title()"
      [highlightedLines]="highlightedLines()"
      theme="dark" />
  `,
})
export class CodeBlockComponent {
  code = input.required<string>()
  language = input<string>('plaintext')
  title = input<string | undefined>()
  highlightedLines = input<string | undefined>()
}
```

:::

:::if{framework="react"}

```tsx
import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer'

export function CodeBlock({ children, className, title, highlightedLines }: {
  children: string
  className?: string
  title?: string
  highlightedLines?: string
}) {
  const lang = /language-(\w+)/.exec(className ?? '')?.[1] ?? 'plaintext'
  return (
    <NxCodeViewer
      code={children.trimEnd()}
      language={lang}
      title={title}
      highlightedLines={highlightedLines}
      theme="dark"
    />
  )
}
```

:::

:::if{framework="vue"}

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer'

const props = defineProps<{
  children: string
  className?: string
  title?: string
  highlightedLines?: string
}>()

const lang = computed(
  () => /language-(\w+)/.exec(props.className ?? '')?.[1] ?? 'plaintext'
)
</script>

<template>
  <NxCodeViewer
    :code="children.trimEnd()"
    :language="lang"
    :title="title"
    :highlighted-lines="highlightedLines"
    theme="dark" />
</template>
```

:::

:::if{framework="svelte"}

```svelte
<script lang="ts">
  import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer'

  let {
    children,
    className,
    title,
    highlightedLines,
  }: {
    children: string
    className?: string
    title?: string
    highlightedLines?: string
  } = $props()

  const lang = /language-(\w+)/.exec(className ?? '')?.[1] ?? 'plaintext'
</script>

<NxCodeViewer
  code={children.trimEnd()}
  language={lang}
  {title}
  {highlightedLines}
  theme="dark" />
```

:::

## marked

Older / lighter stacks (Hugo's JS pipeline, plain Node scripts)
often use `marked`. Override `renderer.code`:

```ts
import { marked, type Renderer } from 'marked'

const renderer: Pick<Renderer, 'code'> = {
  code({ text, lang, escaped }) {
    const code = escaped ? text : escape(text)
    return (
      `<nx-code-viewer ` +
      `code="${attr(code)}" ` +
      `language="${attr(lang ?? 'plaintext')}" ` +
      `theme="dark"></nx-code-viewer>`
    )
  },
}

marked.use({ renderer: renderer as Renderer })

function attr(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}
function escape(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}
```

## Web Component fallback

For stacks where the markdown processor only emits static HTML
(no bundler, no SSR step), ship a single `<nx-code-viewer>` web
component on the page once. Every `<nx-code-viewer>` tag in the
document is upgraded automatically. The HTML markup is identical
across frameworks; only the bootstrap script that defines the
element differs.

The shared markup the markdown pipeline emits looks like this:

```html
<link rel="stylesheet" href="https://unpkg.com/@ngeenx/nx-code-viewer-theme/dist/index.css" />

<!-- elsewhere in the page (output of your markdown renderer): -->
<nx-code-viewer
  code="const x = 1;"
  language="typescript"
  title="hello.ts"
  theme="dark"></nx-code-viewer>
```

Bootstrap script differs per framework binding:

:::if{framework="angular"}

```html
<script type="module" src="https://unpkg.com/@ngeenx/nx-angular-code-viewer/elements.js"></script>
```

The `/elements` subpath ships
`createCustomElement(NxAngularCodeViewerComponent)` prewired so the
tag upgrades on first paint without any consumer code.

:::

:::if{framework="react"}

For a React app rendering pre-built markdown HTML, mount the React
binding once at the root and rely on a thin glue that scans the
DOM for `<nx-code-viewer>` tags and replaces them with React
`<NxCodeViewer>` components:

```tsx
import { createRoot } from 'react-dom/client'
import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer'

document.querySelectorAll<HTMLElement>('nx-code-viewer').forEach((el) => {
  const props = {
    code: el.getAttribute('code') ?? '',
    language: el.getAttribute('language') ?? 'plaintext',
    title: el.getAttribute('title') ?? undefined,
    theme: (el.getAttribute('theme') ?? 'dark') as 'light' | 'dark',
  }
  createRoot(el).render(<NxCodeViewer {...props} />)
})
```

:::

:::if{framework="vue"}

For a Vue app, mount the Vue binding into each placeholder tag:

```ts
import { createApp, h } from 'vue'
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer'

document.querySelectorAll<HTMLElement>('nx-code-viewer').forEach((el) => {
  const props = {
    code: el.getAttribute('code') ?? '',
    language: el.getAttribute('language') ?? 'plaintext',
    title: el.getAttribute('title') ?? undefined,
    theme: (el.getAttribute('theme') ?? 'dark') as 'light' | 'dark',
  }
  createApp({ render: () => h(NxCodeViewer, props) }).mount(el)
})
```

:::

:::if{framework="svelte"}

For Svelte 5, mount the binding into each placeholder:

```ts
import { mount } from 'svelte'
import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer'

document.querySelectorAll<HTMLElement>('nx-code-viewer').forEach((el) => {
  const props = {
    code: el.getAttribute('code') ?? '',
    language: el.getAttribute('language') ?? 'plaintext',
    title: el.getAttribute('title') ?? undefined,
    theme: el.getAttribute('theme') ?? 'dark',
  }
  mount(NxCodeViewer, { target: el, props })
})
```

:::

This is also the right escape hatch when your markdown lives in a
headless CMS and the rendering server cannot run a framework. The
CMS emits HTML strings containing `<nx-code-viewer>` tags; the
browser-side script picks them up after page load.

## Fence info-string parsing helper

Most processors give you the raw info string after the fence
opener (e.g. `ts title="hello.ts" {1-3,5}`). One helper covers the
common conventions across stacks:

```ts
interface FenceMeta {
  language: string
  title?: string
  highlightedLines?: string
  showLineNumbers?: boolean
}

export function parseInfo(info: string): FenceMeta {
  const [language = 'plaintext', ...rest] = info.trim().split(/\s+/)
  const meta = rest.join(' ')
  return {
    language,
    title: /title=["']([^"']+)["']/.exec(meta)?.[1],
    highlightedLines: /\{([\d,\-\s]+)\}/.exec(meta)?.[1],
    showLineNumbers: !/showLineNumbers=false/.test(meta),
  }
}
```

Drop it into whichever processor's renderer hook you wired up.

## Caveats

- **Escaping `` ` `` in JSX** — when MDX components receive `code` as
  a child, JSX preserves backticks verbatim. When you pass `code`
  through a prop string instead (e.g. `<NxCodeViewer code={...} />`),
  the value is a plain string and quoting follows JS rules.
- **Markdown-it nested fences** — markdown-it does not nest fences
  by default. If you need `:::demo` style nesting use a
  container plugin (markdown-it-container) outside the fence.
- **Code-as-content vs. presentational fences** — when the fence is
  the page's main content (a tutorial step's snippet), nx-code-viewer
  is the right swap. When it's incidental (a 2-line shell prompt in
  a sentence), the default `<pre><code>` is fine; skip the override
  for short fences if you want to keep the prose flow.
- **SSR + Shiki** — Shiki tokenises at the server. Make sure your
  renderer runs in a context where `shiki/core` is loadable
  (Node, Vite SSR, RSC). The browser then receives pre-highlighted
  HTML and the component hydrates in place. See
  [Framework Integration](/docs/v1/guides) for the
  per-framework patterns.
- **Bundle size** — the web-component-fallback path pulls the
  Angular runtime as a side effect. For React-only or Vue-only
  stacks, prefer the per-framework binding in the
  [Installation](/docs/v1/get-started/installation) matrix to skip the
  framework you do not use.

## How this compares to built-in code blocks

| Built-in (VitePress, Nextra, Docusaurus, Starlight) | What nx-code-viewer adds on top |
| --- | --- |
| Shiki highlighting, line numbers, copy button | same baseline, no regression |
| Title, highlighted lines, basic diff | same |
| Per-line widgets, reference popovers (tooltip on a token) | not built in to any of the above |
| Multi-file tab viewer with shared theme | not built in |
| Column / split-view diff with focused-lines blur | not built in |
| Cross-framework single chrome (Angular/React/Vue/Svelte) | not built in |

If you already have a working VitePress site and want one of the
extras (per-line widgets, reference popovers, multi-tab viewer),
the markdown-it integration above is the smallest path: swap the
`fence` renderer for the pages that need it, keep the default for
the rest.

## Where to go next

- [Configuration](/docs/v1/get-started/configuration) for the full input
  surface every renderer can forward.
- [Recipes](/docs/v1/guides/recipes) for assembled patterns that build on
  the inputs documented here.
- [Framework Integration](/docs/v1/guides) for SSR
  and hydration concerns specific to each framework.
