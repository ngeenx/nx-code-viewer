---
title: Configuration
description: Every input the code viewer accepts, with types and defaults.
sidebar:
  group: Basics
  icon: sliders-horizontal
  order: 4
---

# Configuration

The code viewer exposes one render component per framework with the
same inputs everywhere. Names and types are stable across Angular,
React, Vue, and Svelte; only the binding syntax changes
(`@Input` / props / `defineProps` / `$props`).

The table below is the canonical reference. Every example page in
the docs links here when it mentions an input by name.

## Core inputs

| Input            | Type                          | Default       | Description                                                                                  |
| ---------------- | ----------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `code`           | `string`                      | required      | The snippet to render. Pass exactly what you'd write in a fenced block; trailing newline is OK. |
| `language`       | `CodeViewerLanguage`          | `'plaintext'` | Any Shiki bundled grammar (`'typescript'`, `'json'`, `'rust'`, …) plus `'plaintext'`.        |
| `theme`          | `'light' \| 'dark'`           | `'dark'`      | Picks one of the two Shiki bundled themes when `shikiTheme` / `shikiThemes` are not set.     |
| `shikiTheme`     | `ShikiThemeName`              | -             | Single Shiki theme name. Wins over `theme` and `shikiThemes`. See [Theming](/docs/v1/theming).|
| `shikiThemes`    | `ShikiThemePair`              | -             | `{ light, dark }` pair. The active value tracks `theme`. See [Theming](/docs/v1/theming).    |

## Chrome inputs

| Input             | Type                | Default                  | Description                                                                  |
| ----------------- | ------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `title`           | `string`            | `''`                     | Filename label rendered in the header.                                       |
| `fileExtension`   | `string`            | `''`                     | Drives the file-type icon at the left of the header.                         |
| `showHeader`      | `boolean`           | `true`                   | Render the header bar.                                                       |
| `showLineNumbers` | `boolean`           | `true`                   | Render the gutter line numbers.                                              |
| `showCopyButton`  | `boolean`           | `true`                   | Render the copy-to-clipboard button.                                         |
| `maxHeight`       | `string`            | `''`                     | CSS height, e.g. `'200px'`, `'30vh'`. Empty string disables the bound.       |
| `wordWrap`        | `boolean`           | `false`                  | Wrap long lines instead of horizontal scroll.                                |
| `enableLineHover` | `boolean`           | `true`                   | Highlight the active line on hover. Required for `lineWidgets`.              |
| `borderStyle`     | `CodeViewerBorderStyle` | `'classic'`          | `'classic' \| 'grid-cross' \| 'corner-intersection' \| 'none'`. See [Border Styles](/examples/border-styles). |

## Line-level inputs

See [Line Highlighting](/examples/line-highlighting) for visual examples.

| Input              | Type                    | Default | Description                                                              |
| ------------------ | ----------------------- | ------- | ------------------------------------------------------------------------ |
| `highlightedLines` | `HighlightedLinesInput` | -       | Numbers or `[from, to]` ranges. 1-indexed, inclusive.                    |
| `focusedLines`     | `FocusedLinesInput`     | -       | Same shape. Lines outside the set are visually blurred.                  |
| `collapsedLines`   | `CollapsedLinesInput`   | -       | Same shape. Each range collapses behind one expandable indicator.        |

`HighlightedLinesInput` and `FocusedLinesInput` accept either a
single number, a `[from, to]` tuple, or an array mixing both.
`CollapsedLinesInput` accepts an array of `[from, to]` tuples.

## Interactive inputs (experimental)

See [Interactive Features](/examples/interactive-features) for the
full story including the `tippy.js` optional peer dependency.

| Input         | Type                | Default | Description                                                                          |
| ------------- | ------------------- | ------- | ------------------------------------------------------------------------------------ |
| `references`  | `ReferenceConfig[]` | `[]`    | Regex-driven tooltip/link annotations. Content can be a string or a framework component. |
| `lineWidgets` | `LineWidgetsInput`  | `[]`    | Per-line UI mounted at `left` / `right`, shown `always` or on `hover`.                |

## Safety inputs

| Input           | Type     | Default   | Description                                                                                                            |
| --------------- | -------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `maxCodeLength` | `number` | `500_000` | Characters allowed before the viewer renders a "too large" placeholder instead of attempting to highlight. Tune for huge files. |

## Diff viewer inputs

`nx-diff-viewer` accepts everything above plus three diff-specific inputs.

| Input            | Type                      | Default     | Description                                                                                          |
| ---------------- | ------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `oldCode`        | `string`                  | required    | The "before" snapshot.                                                                               |
| `newCode`        | `string`                  | required    | The "after" snapshot.                                                                                |
| `viewMode`       | `'unified' \| 'split'`    | `'unified'` | `unified` is one column with +/- markers; `split` shows old and new side by side.                    |
| `oldFileName`    | `string`                  | `''`        | Filename label for the old snapshot.                                                                 |
| `newFileName`    | `string`                  | `''`        | Filename label for the new snapshot.                                                                 |
| `collapsedLines` | `DiffCollapsedLinesInput` | -           | `{ startIndex, endIndex }` ranges (0-based across the unified diff) to hide behind an indicator.      |

See [Diff Viewer](/examples/diff-viewer) for a live demo.

## Multi-tab and column inputs

`nx-multi-code-viewer` and `nx-column-code-viewer` each take a single
array of mixed-type items. Every item carries an `id`, a `type`
(`'code'` or `'diff'`), and the same per-tab/per-column inputs as the
plain viewers.

| Component                | Input    | Type                          | Description                                                                  |
| ------------------------ | -------- | ----------------------------- | ---------------------------------------------------------------------------- |
| `nx-multi-code-viewer`   | `tabs`   | `MultiCodeViewerTabItem[]`    | Mixed `type: 'code'` and `type: 'diff'` entries. Tab order is array order.   |
| `nx-column-code-viewer`  | `columns`| `ColumnItem[]`                | Same shape, rendered horizontally instead of behind a tab strip.             |

See [Multi Tab Viewer](/examples/multi-tab-viewer) and
[Multi Column Viewer](/examples/multi-column-viewer) for live demos.

## Theme + language details

For everything Shiki-related (which themes are bundled, how
dark/light switches work, custom CSS overrides) see
[Theming](/docs/v1/theming). For the list of supported languages
and how to add custom grammars see
[Language Support](/docs/v1/language-support).
