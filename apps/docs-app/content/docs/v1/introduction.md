---
title: Introduction
description: Cross-framework code viewer documentation built on Crylith.
sidebar:
  group: Basics
  icon: rocket
  order: 1
---

# Introduction

**nx-code-viewer** is a family of small, native components for
displaying source code in Angular, React, Vue, and Svelte
applications. Every binding ships the same feature set: syntax
highlighting, line numbers, a copy button, diff view, references, and
per-line widgets. The API in each framework looks the way that
framework's developers expect, so you never adopt a foreign
abstraction just to render a snippet.

## Why these packages exist

Look at any modern developer-facing product and you'll find
read-only code blocks scattered across the UI. The Stripe dashboard
shows a request payload next to each API call. GitHub renders a unified
diff inside every pull request review. The Vercel and Cloudflare
consoles drop ready-to-paste snippets onto onboarding pages. Even
non-developer apps lean on snippets when the surface is technical:
Linear's CLI install instructions, Notion's code block, the AI chat
products that paste back generated functions for you to copy.

These surfaces share a small set of requirements. The output has to
look exactly like the surrounding design system. It has to highlight
correctly in the language the author wrote in, not the one a runtime
detector guessed. It has to copy cleanly with one click. It has to
show diffs when the underlying content changes. And it has to stay
out of the way: nobody embeds a Monaco editor on a marketing page just
because they wanted to display six lines of TypeScript.

The available solutions tend to fall into one of three categories.

Hand-rolling syntax highlighting on top of Prism or highlight.js gives
you fast output, but you end up rebuilding the same chrome over and
over: a header bar, a copy button, line numbers, theme switching.

Reaching for Monaco or CodeMirror works, but those are full editors.
Their bundle weighs megabytes for what is usually a read-only use
case.

Picking a framework-specific viewer feels great for one project, but
the muscle memory does not transfer. The next codebase is in a
different framework and you start from scratch.

**nx-code-viewer** sits between these. The rendering is **Shiki**,
which tokenises code the same way VS Code does, wrapped in a thin
per-framework component that exposes inputs developers already know.
`@Input` for Angular, props for React, `defineProps` for Vue, `$props`
for Svelte. The same Shiki theme renders identically across all four
bindings, so a snippet in your Angular admin panel looks exactly like
the equivalent snippet in your React docs site.

## What you'll find here

The sidebar groups everything into two sections:

- [Installation](/docs/v1/installation) covers the per-framework
  install command, peer dependencies, and a four-step setup
  walkthrough.
- [Basic Examples](/examples/basic-usage) collects the smallest
  invocations: bare render, header with filename, scrollable
  `maxHeight`, border styles, line highlighting, and diff view.
- [Advanced](/examples/interactive-features) covers reference
  popovers, per-line widgets, multi-file tab viewers, and side-by-side
  column layouts.

## Package matrix

Each framework gets its own publishable package. Everything shares
the `@ngeenx/nx-code-viewer-utils` runtime for things that do not
depend on a framework (types, language tokens, Shiki helpers, diff
math).

| Framework | Package                          | Peer dependencies                                                                                        | Optional peers |
| --------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------- |
| Angular   | `@ngeenx/nx-angular-code-viewer` | `@angular/common`, `@angular/core`, `@angular/platform-browser`, `shiki`, `@ngeenx/nx-code-viewer-utils` | `tippy.js`     |
| Vue       | `@ngeenx/nx-vue-code-viewer`     | `vue`, `shiki`, `@ngeenx/nx-code-viewer-utils`                                                           | `tippy.js`     |
| Svelte    | `@ngeenx/nx-svelte-code-viewer`  | `svelte ^5.0.0`, `shiki`, `@ngeenx/nx-code-viewer-utils`                                                 | `tippy.js`     |
| React     | `@ngeenx/nx-react-code-viewer`   | `react`, `react-dom`, `shiki`, `@ngeenx/nx-code-viewer-utils`                                            | `tippy.js`     |
| Shared    | `@ngeenx/nx-code-viewer-utils`   | `shiki`                                                                                                  |                |
| Theme     | `@ngeenx/nx-code-viewer-theme`   |                                                                                                          |                |

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
open [Installation](/docs/v1/installation). The install commands and
import snippets on every page from there will track your choice.
