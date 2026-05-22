---
title: Recipes
description: Copy-paste patterns for common code-viewer setups.
sidebar:
  group: Guides
  icon: book-open
  order: 2
---

# Recipes

A grab-bag of patterns that come up enough to warrant a copy-paste
template. None of these need framework-specific code; they all
combine inputs documented on the
[Configuration](/docs/v1/configuration) page.

The snippets below are written for the Angular binding, but the
prop names are identical across every framework. The
[Quick Start](/docs/v1/quick-start) page shows the per-framework
binding syntax.

## Terminal output

Render shell output as a minimal block: no header, no line numbers,
chrome that disappears so the text feels like a real terminal.

```ts
<nx-code-viewer
  [code]="output"
  language="bash"
  [showHeader]="false"
  [showLineNumbers]="false"
  [showCopyButton]="true"
  borderStyle="none"
  shikiTheme="github-dark" />
```

Pair it with a CSS class that gives the host a terminal-style
padding and font:

```css
.terminal nx-code-viewer {
  --nx-code-font-size: 13px;
  padding: 0.75rem 1rem;
}
```

## File-tree + viewer split

Use the column viewer when you want a sidebar of files and a single
viewer that swaps between them. Each entry shares one `theme` and
one chrome configuration.

```ts
import { NxAngularMultiTabCodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  imports: [NxAngularMultiTabCodeViewerComponent],
  template: `
    <nx-multi-tab-code-viewer
      [tabs]="files"
      theme="dark" />
  `,
})
export class FileBrowserComponent {
  protected readonly files = [
    { title: 'index.ts', code: ENTRY, language: 'typescript' },
    { title: 'lib.ts', code: LIB, language: 'typescript' },
    { title: 'package.json', code: PKG, language: 'json' },
  ];
}
```

See [Multi Tab Viewer](/examples/multi-tab-viewer) for the full
input surface.

## Diff-on-hover for revision history

Show "after" by default; flip to a diff when the user hovers a
"compare" button. Two viewers stacked, one toggled by a signal:

```ts
@Component({
  template: `
    <button (mouseenter)="showDiff.set(true)"
            (mouseleave)="showDiff.set(false)">
      Compare with previous
    </button>

    @if (showDiff()) {
      <nx-code-viewer
        [code]="prev"
        [diffCode]="curr"
        language="typescript"
        theme="dark" />
    } @else {
      <nx-code-viewer
        [code]="curr"
        language="typescript"
        theme="dark" />
    }
  `,
})
export class RevisionViewerComponent {
  protected readonly showDiff = signal(false);
  protected readonly prev = OLD_CODE;
  protected readonly curr = NEW_CODE;
}
```

See [Diff Viewer](/examples/diff-viewer) for unified vs split diff
options.

## Reference popover backed by an API

The `references` input opens a tippy.js popover when the user clicks
or hovers a token. Wire the popover body to a lookup in your own
backend or a static glossary file:

```ts
@Component({
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [references]="refs" />
  `,
})
export class DocsSnippetComponent {
  protected readonly sample = `import { signal } from '@angular/core';`;
  protected readonly refs = [
    {
      text: 'signal',
      line: 1,
      content: '<p>A read-write reactive primitive...</p>',
    },
  ];
}
```

For dynamic references, build the array from a service that fetches
docs metadata. The popover content can be any HTML string.

## Dynamic theme from user preference

Bind `theme` to whatever signal/state drives your app's
light/dark mode. Most apps already have one.

```ts
@Component({
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [theme]="appTheme()" />
  `,
})
export class ThemedSnippetComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly appTheme = this.themeService.theme;
}
```

For server-rendered pages, see
[Framework Integration](/docs/v1/framework-integration) for the
hydration-safe pattern.

## Highlighted line ranges

Drive `highlightedLines` from data instead of a hardcoded array:

```ts
@Component({
  template: `
    <nx-code-viewer
      [code]="source"
      language="typescript"
      [highlightedLines]="changed" />
  `,
})
export class HighlightChangesComponent {
  protected readonly source = SOURCE_CODE;
  protected readonly changed = [
    [12, 18],
    24,
    [30, 32],
  ];
}
```

Line numbers are 1-indexed and inclusive. See
[Line Highlighting](/examples/line-highlighting) for visual
variants (focused, collapsed).

## Embedding inside MDX or markdown

When the viewer lives inside a markdown pipeline (MDX, Astro
content, Crylith content, etc.), use the framework binding's
component the same way you would in normal app code. The chrome
stylesheet still has to load once globally; the snippet content
flows in via markdown's normal channels.

For Crylith specifically, snippet rendering happens through the
`:::demo` directive, which mounts a `<crylith-live-demo>` web
component. See the Crylith docs for the full directive set.

## Custom border at a specific breakpoint

The viewer's border style is settable per-instance. Combine it with
container queries or media queries for responsive chrome:

```css
@container (max-width: 480px) {
  nx-code-viewer {
    --nx-corner-cross-size: 0;
  }
}
```

The cross-mark border degrades gracefully to a flat border when the
size goes to zero. The component itself doesn't need re-rendering.

## Force a maximum height with internal scroll

Long snippets benefit from a bounded height that scrolls internally
instead of pushing the rest of the page down:

```ts
<nx-code-viewer
  [code]="longSample"
  language="typescript"
  maxHeight="320px"
  theme="dark" />
```

The scroll handle uses the same `--nx-scrollbar-*` variables as the
chrome, so a custom theme automatically restyles the scrollbar.

## More patterns

Most visual variants are demonstrated as live components on
[Basic Examples](/examples/basic-usage) and
[Advanced](/examples/interactive-features). If you have a recipe
that isn't covered, open an issue with the use case and we'll
either add an example or extend this page.
