---
title: Custom Themes
description: Build your own theme by overriding CSS variables and applying a class.
sidebar:
  group: Theming
  icon: swatch-book
  order: 2
---

# Custom Themes

The code viewer's appearance is driven entirely by CSS custom
properties (`--nx-*` variables). A "theme" is just a CSS class that
overrides a subset of them. Apply the class to the host element and
the viewer picks the new values up at render time.

```html
<nx-code-viewer class="theme-cyberpunk" [code]="sample" language="typescript" />
```

The same pattern works across every framework binding because they
all render to the same `<nx-code-viewer>` shadow-DOM host.

## Bundled themes

Six ready-to-use themes ship inside the **`@ngeenx/nx-code-viewer-theme`**
package itself, under the `/themes` subpath. The core theme is
unchanged - you opt into the extras with one extra `@import`.

```css
/* Required base */
@import '@ngeenx/nx-code-viewer-theme';

/* All six themes in one go */
@import '@ngeenx/nx-code-viewer-theme/themes';
```

Pick individual themes to keep the bundle small. File names match
class names (`cyberpunk.css` → `.theme-cyberpunk`,
`high-contrast.css` → `.theme-high-contrast`, etc.):

```css
@import '@ngeenx/nx-code-viewer-theme';
@import '@ngeenx/nx-code-viewer-theme/themes/cyberpunk.css';
@import '@ngeenx/nx-code-viewer-theme/themes/github.css';
```

Each theme file is independent and only references the shared
`--nx-*` variable surface, so any combination works.

| Class                   | Style                                                                              | When to use                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `.theme-cyberpunk`      | Neon cyan + magenta on near-black backgrounds. Sharp corners, JetBrains Mono font. | Dashboards and demos that want a strong visual identity.                          |
| `.theme-minimal`        | Quiet grayscale, thin scrollbar, soft borders, SF Mono font.                       | Documentation pages where the viewer should fade into the prose.                  |
| `.theme-high-contrast`  | Pure black/white with bold borders and yellow/blue hover accents.                  | Accessibility-focused contexts and high-contrast OS modes.                        |
| `.theme-github`         | GitHub's own color tokens (`#0d1117`, `#161b22`, blue accent links).               | Embedding inside a project that already uses a GitHub-flavoured design system.    |
| `.theme-dracula`        | Vibrant purple borders, pink reference links on `#282a36`. Fira Code font.         | Dark-mode-first apps that want a signature palette.                               |
| `.theme-handwritten`    | Warm beige paper background, soft borders, Delius Swash Caps cursive font.         | Playful surfaces and onboarding flows.                                            |
| `.theme-solarized`      | Ethan Schoonover's classic - beige paper / deep slate with amber accents.          | Long-reading prose docs and content systems that already use Solarized elsewhere. |
| `.theme-monokai`        | Warm dark with vibrant pink / green / orange accents. The Sublime Text classic.    | Retro-editor vibe; engineering blogs that want personality.                       |
| `.theme-nord`           | Cool arctic blue palette by Sven Greb. Gentle for long sessions.                   | Calm developer dashboards and Nordic-inspired design systems.                     |
| `.theme-tokyo-night`    | Deep blue-violet with neon city accents.                                           | Dark-mode apps that want a vibrant signature without going full cyberpunk.        |
| `.theme-catppuccin`     | Pastel community palette - Mocha for dark, Latte for light.                        | Trendy dev tools and any UI that leans into soft, modern colors.                  |
| `.theme-sakura`         | Soft cherry-blossom pinks on cream with rose-gold accents.                         | Cosy, reading-heavy surfaces that want a warm spring vibe.                        |
| `.theme-lavender-latte` | Pastel lavender on warm cream with a sprinkle of soft peach.                       | Sweet, dreamy doc surfaces and onboarding flows for friendly products.            |

## Writing your own

A theme is a single CSS class. Put it in any stylesheet that loads
on the page and ship it next to (or instead of) the bundled themes.

```css
.theme-brand-blue {
  /* Background colors */
  --nx-dark-bg: #0b1e3b;
  --nx-dark-bg-secondary: #122b52;
  --nx-light-bg: #f3f7ff;
  --nx-light-bg-secondary: #e6eeff;

  /* Border + header accent */
  --nx-dark-border-color: #4a8bd6;
  --nx-light-border-color: #2a6dc0;
  --nx-dark-header-bg: #122b52;
  --nx-dark-header-text: #e6eeff;
  --nx-light-header-bg: #e6eeff;
  --nx-light-header-text: #2a6dc0;

  /* Reference link colors */
  --nx-ref-dark-color: #ffd166;
  --nx-ref-light-color: #d97706;

  /* Font */
  --nx-font-mono: 'JetBrains Mono', monospace;
}
```

Apply with `class="theme-brand-blue"` on the viewer element. Any
variable you don't override falls through to the default in
`@ngeenx/nx-code-viewer-theme`, so you only need to set what you
want to change.

## CSS variable reference

The default values live in `@ngeenx/nx-code-viewer-theme`. The
groups below are the ones the bundled themes actually override; the
package exports more for finer-grained tweaking.

### Backgrounds

| Variable                                | Used for                                  |
| --------------------------------------- | ----------------------------------------- |
| :copy[`--nx-dark-bg`]                   | Main viewer body in dark mode             |
| :copy[`--nx-dark-bg-secondary`]         | Header strip, sidebar fills in dark mode  |
| :copy[`--nx-light-bg`]                  | Main viewer body in light mode            |
| :copy[`--nx-light-bg-secondary`]        | Header strip, sidebar fills in light mode |
| :copy[`--nx-dark-line-number-bg`]       | Gutter background in dark mode            |
| :copy[`--nx-light-line-number-bg`]      | Gutter background in light mode           |

### Borders + chrome

| Variable                                | Used for                                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| :copy[`--nx-dark-border-color`]         | Outer border + cross-corner accents in dark mode                                     |
| :copy[`--nx-light-border-color`]        | Outer border + cross-corner accents in light mode                                    |
| :copy[`--nx-border-inset`]              | Distance border sits from the edge                                                   |
| :copy[`--nx-corner-cross-size`]         | Length of the cross-mark in the `grid-cross` and `corner-intersection` border styles |
| :copy[`--nx-corner-cross-offset`]       | Distance of the cross-mark from the edge                                             |
| :copy[`--nx-extended-border-length`]    | Length of the extending edges on `corner-intersection`                               |

### Header

| Variable                                                                  | Used for                                 |
| ------------------------------------------------------------------------- | ---------------------------------------- |
| :copy[`--nx-dark-header-bg`], :copy[`--nx-light-header-bg`]               | Header strip background                  |
| :copy[`--nx-dark-header-text`], :copy[`--nx-light-header-text`]           | Filename label + icon color              |
| :copy[`--nx-dark-header-border`], :copy[`--nx-light-header-border`]       | Divider between header and body          |
| :copy[`--nx-header-padding-y`]                                            | Vertical padding inside the header strip |
| :copy[`--nx-header-font-size`], :copy[`--nx-header-font-weight`]          | Filename label typography                |
| :copy[`--nx-header-icon-size`]                                            | File-type icon size                      |

### Scrollbar

| Variable                                       | Used for                                     |
| ---------------------------------------------- | -------------------------------------------- |
| :copy[`--nx-scrollbar-thumb-size`]             | Width of the scrollbar thumb                 |
| :copy[`--nx-scrollbar-thumb-color`]            | Default thumb color                          |
| :copy[`--nx-scrollbar-thumb-hover-color`]      | Hover state                                  |
| :copy[`--nx-scrollbar-thumb-radius`]           | Corner rounding (0 for square, 999 for pill) |

### Reference links (`references` input)

| Variable                                 | Used for                                         |
| ---------------------------------------- | ------------------------------------------------ |
| :copy[`--nx-ref-dark-color`]             | Default underline color in dark mode             |
| :copy[`--nx-ref-dark-hover-color`]       | Hover state in dark mode                         |
| :copy[`--nx-ref-light-color`]            | Default underline color in light mode            |
| :copy[`--nx-ref-light-hover-color`]      | Hover state in light mode                        |
| :copy[`--nx-ref-underline-offset`]       | Distance between text baseline and the underline |

### Line effects

| Variable                          | Used for                                                          |
| --------------------------------- | ----------------------------------------------------------------- |
| :copy[`--nx-line-blur`]           | Blur radius applied to non-focused lines (used by `focusedLines`) |
| :copy[`--nx-widget-padding`]      | Padding around per-line widgets (used by `lineWidgets`)           |

### Diff colors

`--nx-dark-diff-*` and `--nx-light-diff-*` control the added /
removed line backgrounds, borders, and gutter prefixes (`+` / `-`).
Each side has six tokens:

```
--nx-{dark|light}-diff-added-bg
--nx-{dark|light}-diff-added-bg-highlighted   /* on hover */
--nx-{dark|light}-diff-added-border           /* left rail */
--nx-{dark|light}-diff-added-prefix           /* the +/- glyph */
--nx-{dark|light}-diff-removed-bg
--nx-{dark|light}-diff-removed-bg-highlighted
--nx-{dark|light}-diff-removed-border
--nx-{dark|light}-diff-removed-prefix
```

Match `added-*` to your design system's success / additive color and
`removed-*` to the destructive / removed color. The `*-highlighted`
variants should be a step more saturated since they only show on
hover or focus.

### Animation

| Variable                               | Used for                                                |
| -------------------------------------- | ------------------------------------------------------- |
| :copy[`--nx-transition-duration`]      | Time used by hover, focus, and theme-switch transitions |
| :copy[`--nx-transition-timing`]        | CSS easing function (`ease`, `cubic-bezier(...)`, etc.) |

### Font

| Variable                     | Used for                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| :copy[`--nx-font-mono`]      | Font stack for the highlighted code. Used by the viewer body, header filename, and gutter line numbers. |

## Stacking with the chrome `theme` input

Custom themes are orthogonal to the `theme` input (`'light'` /
`'dark'`). Each `.theme-*` class defines BOTH the dark and the light
variants so a single class works in either mode. Switch the chrome
`theme` input and the viewer picks the corresponding half of your
class's variables.

```html
<!-- The class controls the palette, theme controls dark/light mode. -->
<nx-code-viewer class="theme-dracula" [theme]="userTheme()" />
```

This lets you ship one branded theme that responds to the
user's system preference without re-binding inputs.

## Authoring tips

1. **Start by copying one of the bundled themes** and editing values.
   Cloning `theme-github` and tweaking the accent colors is a quick
   way to land on something that looks intentional.
2. **Override only what changes** the viewer's appearance noticeably.
   You don't have to set every variable; defaults fall through.
3. **Match `font-mono` to your design system's mono font** so the
   viewer doesn't visually clash with other code surfaces (Stripe-
   style API docs, in-app terminals).
4. **Test in both modes**. The `theme` input switches mid-render, so
   omit a dark-side variable at your peril - the viewer will use the
   light value in both modes and the dark version will look broken.
5. **Keep diff palettes accessible**. The added / removed
   backgrounds layer on top of the chrome bg; pick alpha values that
   stay readable against your dark and light backgrounds.

For the canonical variable list with default values, see
`packages/styles/nx-code-viewer-theme/src/index.css` in the
repository.
