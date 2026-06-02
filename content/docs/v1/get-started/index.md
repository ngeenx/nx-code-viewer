---
title: Introduction
description: Cross-framework code viewer documentation built on Crylith.
sidebar:
  group: Get Started
  icon: rocket
  order: 1
---

# Introduction

**nx-code-viewer** is a family of small, native components for
displaying source code in Angular, Vue, Svelte and React
applications by following the environment's idioms. Every binding ships the same feature set: syntax
highlighting, line numbers, a copy button, diff view, references, and
per-line widgets. The API in each framework looks the way that
framework's developers expect, so you never adopt a foreign
abstraction just to render a snippet.

## Why these packages exist

Read-only code blocks show up everywhere in modern product UIs:
API payloads next to call buttons, diffs in review panels,
ready-to-paste install commands on onboarding pages, even inline
snippets in non-technical apps. Each surface needs the same things:
match the surrounding design system, highlight in the actual
language (not a guess), copy in one click, support diffs, and stay
lightweight enough that nobody questions adding it.

The existing options all hit the same wall. Hand-rolling on top of
a low-level highlighter ships fast but you rebuild the same chrome
(header, copy button, line numbers, theme switching) for every
project. Reaching for a full editor solves features but drags in
megabytes of bundle for a read-only use case. Picking a
framework-specific viewer works once but the muscle memory does
not transfer, the next codebase starts from scratch.

**nx-code-viewer** sits between these. Rendering uses a
production-grade tokeniser, wrapped in a thin per-framework
component that exposes inputs developers already know.
`@Input` for Angular, `defineProps` for Vue,
`$props` for Svelte, and props for React. The same theme renders identically across all
four bindings, so a snippet in one stack looks exactly like the
equivalent snippet in another.

## What you'll find here

The sidebar groups everything into three sections:

- **Basics** is the place to start. The
  [Installation](/docs/v1/get-started/installation) gets a snippet on screen in
  five minutes; [Installation](/docs/v1/get-started/installation) covers
  per-framework dependencies; [Configuration](/docs/v1/get-started/configuration)
  lists every input with its type and default; and
  [Syntax Highlighting](/docs/v1/get-started/syntax-highlighting) is the canonical
  Shiki grammar list.
- **Guides** are how-to pages for production setups:
  [Framework Integration](/docs/v1/guides) for SSR
  and bundler concerns, [Recipes](/docs/v1/guides/recipes) for
  copy-paste patterns, and [Troubleshooting](/docs/v1/guides/troubleshooting)
  for the most common errors.
- **Theming** covers the [overview](/docs/v1/theming) and the
  [bundled themes catalogue](/docs/v1/theming/custom-theme).

For working visual examples, the **Examples** section in the navbar
has [Basic Examples](/examples/basic-usage) for the smallest
invocations and [Advanced](/examples/interactive-features) for
reference popovers, per-line widgets, multi-file tab viewers, and
side-by-side column layouts.

## Package matrix

Each framework gets its own publishable package. Everything shares
the `@ngeenx/nx-code-viewer-utils` runtime for things that do not
depend on a framework (types, language tokens, Shiki helpers, diff
math).

| Framework | Package                                                                                                 | Peer dependencies                                                                                                                                                                                                                                                                                                                                                                                           | Optional peers                                              |
| --------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Angular   | :copy[[`@ngeenx/nx-angular-code-viewer`](https://www.npmjs.com/package/@ngeenx/nx-angular-code-viewer)] | :copy[[`@angular/common`](https://www.npmjs.com/package/@angular/common)], :copy[[`@angular/core`](https://www.npmjs.com/package/@angular/core)], :copy[[`@angular/platform-browser`](https://www.npmjs.com/package/@angular/platform-browser)], :copy[[`shiki`](https://www.npmjs.com/package/shiki)], :copy[[`@ngeenx/nx-code-viewer-utils`](https://www.npmjs.com/package/@ngeenx/nx-code-viewer-utils)] | :copy[[`tippy.js`](https://www.npmjs.com/package/tippy.js)] |
| Vue       | :copy[[`@ngeenx/nx-vue-code-viewer`](https://www.npmjs.com/package/@ngeenx/nx-vue-code-viewer)]         | :copy[[`vue`](https://www.npmjs.com/package/vue)], :copy[[`shiki`](https://www.npmjs.com/package/shiki)], :copy[[`@ngeenx/nx-code-viewer-utils`](https://www.npmjs.com/package/@ngeenx/nx-code-viewer-utils)]                                                                                                                                                                                               | :copy[[`tippy.js`](https://www.npmjs.com/package/tippy.js)] |
| Svelte    | :copy[[`@ngeenx/nx-svelte-code-viewer`](https://www.npmjs.com/package/@ngeenx/nx-svelte-code-viewer)]   | :copy[[`svelte`](https://www.npmjs.com/package/svelte)], :copy[[`shiki`](https://www.npmjs.com/package/shiki)], :copy[[`@ngeenx/nx-code-viewer-utils`](https://www.npmjs.com/package/@ngeenx/nx-code-viewer-utils)]                                                                                                                                                                                         | :copy[[`tippy.js`](https://www.npmjs.com/package/tippy.js)] |
| React     | :copy[[`@ngeenx/nx-react-code-viewer`](https://www.npmjs.com/package/@ngeenx/nx-react-code-viewer)]     | :copy[[`react`](https://www.npmjs.com/package/react)], :copy[[`react-dom`](https://www.npmjs.com/package/react-dom)], :copy[[`shiki`](https://www.npmjs.com/package/shiki)], :copy[[`@ngeenx/nx-code-viewer-utils`](https://www.npmjs.com/package/@ngeenx/nx-code-viewer-utils)]                                                                                                                            | :copy[[`tippy.js`](https://www.npmjs.com/package/tippy.js)] |
| Shared    | :copy[[`@ngeenx/nx-code-viewer-utils`](https://www.npmjs.com/package/@ngeenx/nx-code-viewer-utils)]     | :copy[[`shiki`](https://www.npmjs.com/package/shiki)]                                                                                                                                                                                                                                                                                                                                                       |                                                             |
| Theme     | :copy[[`@ngeenx/nx-code-viewer-theme`](https://www.npmjs.com/package/@ngeenx/nx-code-viewer-theme)]     |                                                                                                                                                                                                                                                                                                                                                                                                             |                                                             |

`tippy.js` is only needed when you use the reference-popover feature
on the [Interactive Features](/examples/interactive-features) page.
Its import is lazy, so it never touches your main bundle unless a
popover actually opens.

## Feature matrix

Every binding implements the full feature set. Nothing is framework
specific.

| Feature                               | Angular | Vue | Svelte | React |
| ------------------------------------- | :-----: | :-: | :----: | :---: |
| Syntax highlighting (Shiki)           |    ✓    |  ✓  |   ✓    |   ✓   |
| Light / dark themes                   |    ✓    |  ✓  |   ✓    |   ✓   |
| Dual-theme (Shiki theme pair)         |    ✓    |  ✓  |   ✓    |   ✓   |
| Line numbers                          |    ✓    |  ✓  |   ✓    |   ✓   |
| Word wrap                             |    ✓    |  ✓  |   ✓    |   ✓   |
| Max height with internal scroll       |    ✓    |  ✓  |   ✓    |   ✓   |
| Header (filename and extension)       |    ✓    |  ✓  |   ✓    |   ✓   |
| Copy button                           |    ✓    |  ✓  |   ✓    |   ✓   |
| Border style variants                 |    ✓    |  ✓  |   ✓    |   ✓   |
| Highlighted, focused, collapsed lines |    ✓    |  ✓  |   ✓    |   ✓   |
| Diff viewer (unified and split)       |    ✓    |  ✓  |   ✓    |   ✓   |
| Multi-tab viewer (code and diff)      |    ✓    |  ✓  |   ✓    |   ✓   |
| Column viewer                         |    ✓    |  ✓  |   ✓    |   ✓   |
| Reference popovers                    |    ✓    |  ✓  |   ✓    |   ✓   |
| Per-line widgets (hover UI)           |    ✓    |  ✓  |   ✓    |   ✓   |

## Next step

Pick your framework from the sidebar's **Framework** select, then
open [Installation](/docs/v1/get-started/installation). The install commands and
import snippets on every page from there will track your choice.
