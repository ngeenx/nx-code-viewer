---
title: Overview
description: Light/dark modes, Shiki themes, theme pairs, and CSS overrides.
sidebar:
  group: Theming
  icon: palette
  order: 1
---

# Theming

The code viewer's theming has three independent layers. You can opt
into as many as you need; defaults work out of the box.

1. **Chrome theme** (`theme`) picks light or dark for the header,
   line numbers, copy button, and background. Two values: `'light'`,
   `'dark'`.
2. **Shiki theme** (`shikiTheme` or `shikiThemes`) controls the
   syntax-highlighting color scheme. Defaults to `'github-light'` /
   `'github-dark'` to match the chrome theme.
3. **CSS variables** fine-grained color overrides for borders,
   focus rings, the copy-button hover state, etc. Useful when the
   surrounding design system has specific tokens you want to mirror.

All three work the same way across every framework binding.

## Chrome theme

The simplest case: pass `theme="light"` or `theme="dark"`. The viewer
picks a matching Shiki theme automatically (`github-light` /
`github-dark`).

```ts
<nx-code-viewer
  [code]="sample"
  language="typescript"
  theme="dark" />
```

For apps that follow the system color scheme, bind `theme` to a
signal/state value driven by `matchMedia('(prefers-color-scheme: dark)')`
or your own theme switcher.

## Shiki single theme (`shikiTheme`)

Pin the syntax highlighter to one Shiki theme regardless of the
chrome theme. Every theme name from
[Shiki's bundled themes](https://shiki.style/themes) works.

```ts
<nx-code-viewer
  [code]="sample"
  language="typescript"
  shikiTheme="nord" />
```

`shikiTheme` always wins over the chrome `theme` and over
`shikiThemes`. Useful when your design system has one canonical
syntax palette regardless of light/dark mode.

## Shiki theme pair (`shikiThemes`)

When the chrome flips between light and dark, you usually want the
syntax colors to flip too but with custom themes, not just
GitHub's defaults. `shikiThemes` accepts a `{ light, dark }` pair;
the runtime picks the active half based on the chrome `theme` input.

```ts
<nx-code-viewer
  [code]="sample"
  language="typescript"
  [theme]="theme()"
  [shikiThemes]="{ light: 'one-light', dark: 'one-dark-pro' }" />
```

Switching `theme()` between `'light'` and `'dark'` now also flips
the syntax palette without a separate `shikiTheme` re-bind.

## Precedence

When multiple theme inputs are set, the resolution order is:

1. `shikiTheme` wins if set single explicit value.
2. `shikiThemes` pair, picked by the current `theme`.
3. The built-in `github-light` / `github-dark` defaults, picked by
   the current `theme`.

This means you can layer: ship the app with a global `shikiThemes`
pair, then let an individual demo snippet override with `shikiTheme`
for a one-off effect.

## CSS variables

Every visible color in the chrome (border, header background, copy
button hover, scrollbar tint) is driven by a CSS custom property.
The `@ngeenx/nx-code-viewer-theme` package ships the default values;
override any of them with higher CSS specificity to match your
design system.

```css
/* Override only what you need; everything else falls through to defaults. */
.my-app nx-code-viewer {
  --nx-code-viewer-border: hsl(220 14% 90%);
  --nx-code-viewer-header-bg: hsl(220 14% 96%);
  --nx-code-viewer-line-number: hsl(220 9% 50%);
  --nx-code-viewer-copy-hover: hsl(220 14% 88%);
}
```

The package's `src/index.css` is the authoritative list `@import`
it once at the root of your app's stylesheet and the defaults are in
place. After that, override per-component, per-page, or globally.

## Recipes

### Sync with the host page's theme

Bind `theme` to whichever signal/state drives your app's
light/dark mode. Most apps already have one for the rest of the UI.

```ts
@Component({
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [theme]="appTheme()" />
  `,
})
export class MyComponent {
  protected readonly appTheme = inject(ThemeService).theme; // signal('light' | 'dark')
}
```

### Force a single theme regardless of system mode

Pin `theme` to a constant and skip the Shiki theme inputs:

```ts
<nx-code-viewer
  [code]="sample"
  language="typescript"
  theme="dark" />
```

### Override one Shiki theme value globally

Set a `shikiThemes` pair at the app's root component and pass it
down through the inputs. Or, since each component instance accepts
the input directly, you can wrap the viewer in a small adapter
component that fills in your house themes by default.

### Custom-theme CSS class

The demos on this site use a `theme-*` class pattern to apply
multiple custom palettes side by side without re-importing the
theme stylesheet. The Basic Examples page demonstrates this with
its theme picker.

## What's coming

A future version may surface a `theme-color-scheme` event so
embedded components (line widget popovers, reference tooltips) can
mirror the active theme without each consumer wiring its own signal.
The current workaround is to pass the same `theme` input down
manually.
