---
title: Troubleshooting
description: Diagnose the most common setup, rendering, and hydration problems.
sidebar:
  group: Guides
  icon: triangle-alert
  order: 5
---

# Troubleshooting

Common problems people hit when they first wire the viewer up, and
the fix that usually unblocks them.

If your issue isn't here, open a GitHub issue with a minimal
reproduction. The maintainers will either patch the underlying
problem or extend this page.

## Snippet renders, but the chrome is missing

**Symptom**: the code is highlighted, but there's no border, no
header strip, no rounded corners, no scrollbar styling. It just
looks like a plain `<pre>` block with color.

**Cause**: the chrome stylesheet didn't load.

**Fix**: import it once at the root of your app's stylesheet:

```css
@import '@ngeenx/nx-code-viewer-theme';
```

The package only ships CSS variables; nothing JavaScript-side
depends on it. If the import path errors, check that the package
is installed and your bundler resolves bare package specifiers
(Vite, webpack, Rollup, esbuild all do by default).

## Hydration mismatch warning

**Symptom**: the browser console logs a hydration mismatch warning
on a server-rendered page. The viewer may flicker on first paint.

**Cause**: `shikiTheme` resolves to different values on the server
and the client. The server doesn't have access to `localStorage` or
`prefers-color-scheme`; if the client reads one of those
synchronously, the first client render disagrees with the SSR
output.

**Fix**: either pin `shikiTheme` to a constant string during SSR, or
move the viewer into a client-only boundary. See
[Framework Integration](/docs/v1/framework-integration) for the
patterns per framework.

## "Cannot find module 'tippy.js'"

**Symptom**: the build fails because tippy.js isn't installed, even
though you don't use reference popovers.

**Cause**: an older version of the binding declared tippy.js as a
required peer. From v0.1.0-alpha.3 onwards it's an
**optional peer**, lazy-imported only when the
[reference-popover](/examples/interactive-features) feature is
actually used.

**Fix**: upgrade to the latest binding. The optional peer is listed
in the [Installation](/docs/v1/installation) matrix.

If you want reference popovers, install tippy explicitly:

```bash
pnpm add tippy.js
```

## Reference popover doesn't open

**Symptom**: clicking a referenced token does nothing.

**Cause**: tippy.js isn't installed or the popover root element is
blocked by a CSP `script-src` directive.

**Fix**:

1. Confirm tippy is installed (`pnpm list tippy.js`).
2. Check the browser console for "Refused to execute inline script"
   errors. If present, your CSP needs to allow either inline scripts
   in the popover root or a hashed source.

## Copy button does nothing

**Symptom**: clicking the copy button shows the "copied" state but
nothing lands on the clipboard.

**Cause**: the Clipboard API requires a secure context (HTTPS or
localhost). Browsers silently fail when the page is served over
plain HTTP.

**Fix**: serve the page over HTTPS in production. For local
development, `http://localhost` works in every modern browser; only
remote `http://` origins are blocked.

If the page is HTTPS but copying still fails, check your CSP for a
missing `clipboard-write` permission (some strict CSPs disable it).

## Theme flicker on first paint

**Symptom**: the snippet renders unstyled for a frame, then snaps
into the themed chrome.

**Cause**: the chrome stylesheet is in a non-critical CSS chunk that
the browser loads after the initial HTML.

**Fix**:

- Import the stylesheet in your app's root entry, not lazily inside
  a route module. This puts it in the initial CSS bundle.
- If you use a CSS-in-JS framework, make sure the import sits in
  the global stylesheet, not a component-local one.

## Shiki theme name not recognised

**Symptom**: console warns
`Shiki theme "<name>" not found, falling back to "github-light"`.

**Cause**: the name doesn't match any
[Shiki bundled theme](https://shiki.style/themes), or the casing is
wrong (Shiki theme names are kebab-case).

**Fix**: pick a name from the Shiki themes list and pass it
verbatim. Common typos: `github-dark` not `githubDark`,
`one-dark-pro` not `onedark-pro`.

## Language not highlighting

**Symptom**: the snippet renders, but all the tokens are the same
color - no syntax highlighting at all.

**Cause**: the `language` input doesn't match any Shiki bundled
grammar, or you typed a display name instead of a Shiki id.

**Fix**: check the
[Shiki languages list](https://shiki.style/languages). Use the
short id, e.g. `ts` or `typescript`, not `TypeScript`.

If you want to register a custom grammar, see
[Language Support](/docs/v1/language-support).

## "Cannot find module 'lucide-angular'"

**Symptom**: the Angular binding build fails referencing
lucide-angular.

**Cause**: an older alpha required lucide-angular as a peer for the
copy-button icon. Current versions inline the icon as SVG, so the
peer is gone.

**Fix**: upgrade to `@ngeenx/nx-angular-code-viewer@^0.1.0-alpha.5`
or later.

## Snippet width overflows the parent

**Symptom**: the viewer pushes outside the page and creates a
horizontal scrollbar on the whole document.

**Cause**: long lines without word wrap and no width constraint on
the parent.

**Fix**: enable word wrap, or constrain the parent's width:

```ts
<nx-code-viewer
  [code]="sample"
  language="typescript"
  [wordWrap]="true" />
```

Or wrap the host in a `min-width: 0` container so flex/grid
parents don't expand to fit the content.

## Live demos (iframe) show blank

**Symptom**: in a docs site that uses `:::demo` directives, the
iframe loads but the page is empty.

**Cause**: the live-demo bundle didn't build, or the iframe is
pointing at the wrong path.

**Fix**:

1. Run `pnpm crylith build-live-demos` (or your project's equivalent).
2. Check the network tab: the iframe should request a static
   `index.html` under `/.crylith-demos/<demo-id>/...`.
3. If the iframe URL is correct but the body is blank, check the
   iframe's console for a runtime error.

## Dev-server changes to themes don't apply

**Symptom**: edits to a `theme-*` CSS file aren't reflected in the
live-demo iframes, even after the dev server reloads.

**Cause**: live-demo iframes are separate Vite builds. The host
docs-app's HMR pipeline doesn't reach inside them.

**Fix**: rebuild the live demos:

```bash
pnpm nx run docs-app:build-live-demos --skip-nx-cache
```

The `--skip-nx-cache` matters because Nx's cache hash doesn't
include the theme package by default; without it the rebuild is
short-circuited and the iframes keep their stale styles.

## Bundle size larger than expected

**Symptom**: the viewer adds several MB to your client bundle.

**Cause**: by default Shiki ships every bundled grammar and theme.
For most docs sites that's fine; for landing pages it's overkill.

**Fix**: import Shiki's `getSingletonHighlighter` with an explicit
language and theme list. See [Language Support](/docs/v1/language-support)
for the fine-grained import patterns.

## Still stuck?

If none of the above fits, open an issue with:

1. The framework binding and version (`pnpm list @ngeenx/nx-*-code-viewer`).
2. A minimal reproduction (Codesandbox / StackBlitz preferred).
3. The full browser console output.
4. The result of `pnpm list shiki @ngeenx/nx-code-viewer-utils`.

Issues with reproductions get answered fastest.
