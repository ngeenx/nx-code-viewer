---
title: Language Support
description: Which languages Shiki ships, how to add more, and bundle-size tradeoffs.
sidebar:
  icon: code
  order: 5
---

# Language Support

The code viewer uses [Shiki](https://shiki.style) for syntax
highlighting. Shiki ships grammars for **180+ languages** out of the
box, and the viewer's `CodeViewerLanguage` type is exactly
`BundledLanguage | 'plaintext'` any name Shiki knows is valid.

## Recognised languages

Common picks (the full list lives in
[Shiki's documentation](https://shiki.style/languages)):

`typescript`, `tsx`, `javascript`, `jsx`, `json`, `jsonc`, `yaml`,
`toml`, `xml`, `html`, `css`, `scss`, `bash`, `shell`, `rust`, `go`,
`python`, `ruby`, `java`, `kotlin`, `swift`, `csharp`, `cpp`, `c`,
`php`, `sql`, `graphql`, `vue`, `svelte`, `astro`, `markdown`, `mdx`,
`diff`, `dockerfile`, `nginx`, `lua`, `r`, `julia`, `dart`, `elixir`,
`erlang`, `clojure`, `haskell`, `fsharp`, `ocaml`, `scala`, `groovy`.

There's also `'plaintext'` for content with no highlighting (raw
logs, free-text snippets, fixtures).

## Setting the language

Pass the name as a string. TypeScript users get autocomplete via the
`CodeViewerLanguage` type.

```ts
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  template: ` <nx-code-viewer [code]="sample" [language]="lang" /> `,
})
export class MyComponent {
  protected readonly lang: CodeViewerLanguage = 'typescript';
  protected readonly sample = `const x: number = 1;`;
}
```

If `language` is omitted, it falls back to `'plaintext'` code
renders but with no token colouring.

## Fence-tag conventions

When the viewer is fed source that came from a markdown fenced
block, the fence's info-string drives the `language` input. Common
aliases:

| Fence tag    | Resolved language |
| ------------ | ----------------- |
| `ts`         | `typescript`      |
| `tsx`        | `tsx`             |
| `js`         | `javascript`      |
| `sh`, `bash` | `bash`            |
| `yml`        | `yaml`            |
| `md`         | `markdown`        |

Anything Shiki doesn't recognise falls back to `'plaintext'` rather
than throwing.

## Bundle size

This is the part most people care about: **how much does each
language cost?** Shiki loads grammars lazily by name only the
languages you actually use end up in the bundle. The runtime
defers grammar download until first render, so the initial page
weight stays small even if your app references many languages.

Typical numbers (gzipped, per-grammar):

| Grammar         | Approximate size |
| --------------- | ---------------- |
| `typescript`    | ~12 KB           |
| `javascript`    | ~10 KB           |
| `tsx`           | ~13 KB           |
| `json`          | ~2 KB            |
| `yaml`          | ~4 KB            |
| `bash`          | ~6 KB            |
| `rust`          | ~9 KB            |
| `python`        | ~7 KB            |
| `html`          | ~8 KB            |
| `css`           | ~6 KB            |
| `vue`, `svelte` | ~10-15 KB        |

These are Shiki's grammar bundles, not the viewer chrome itself.
The viewer's per-framework binding adds another fixed ~20 KB
regardless of how many languages you use.

## Performance for large snippets

Highlighting cost scales with the number of tokens, not the number
of bytes. A 5,000-line config file with simple tokens highlights
faster than a 500-line file dense with regex literals or nested
template strings.

If you're rendering snippets bigger than ~5,000 lines or ~500 KB,
consider:

1. **Bound the height** with `maxHeight` so the layout doesn't have
   to lay out every line at once. The viewer still highlights the
   full content; only the rendered DOM is bounded.
2. **Trim before passing** for log viewers, paginate to last N
   lines server-side rather than highlighting the whole thing.
3. **Use `maxCodeLength`** as a guardrail by default the viewer
   refuses to highlight inputs longer than 500,000 characters and
   renders a placeholder instead. Tune this number based on what
   your users actually need to see.

## Custom grammars

Shiki accepts custom [TextMate](https://macromates.com/manual/en/language_grammars) grammar JSONs via its loader API. The
viewer doesn't expose a direct hook for registering custom grammars
on a per-component basis today instead, register them at the
Shiki instance level early in your app's bootstrap:

```ts
// Once at app startup, before any nx-code-viewer renders.
import { getHighlighter } from 'shiki';

await getHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: [
    'typescript',
    {
      // Inline custom grammar object loaded from disk or fetched.
      name: 'my-dsl',
      scopeName: 'source.my-dsl',
      patterns: [
        /* ... */
      ],
    },
  ],
});
```

After registration, pass `language="my-dsl"` (cast through
`as CodeViewerLanguage`) and the viewer picks it up the same way as
a built-in grammar.

This API is the lowest-friction integration today; a dedicated
input on the viewer for registering grammars per-instance is on the
roadmap.

## Detecting an unsupported language

When the active `language` value isn't in Shiki's bundle, the
viewer renders the snippet as plain text and emits a warning to the
console. This is non-fatal so a typo in a fence tag never crashes
the page you'll see uncoloured code and a console message telling
you which name didn't resolve.

If you'd rather fail loud, validate the `language` value against
the imported `CodeViewerLanguage` type at the consumer level before
passing it in.
