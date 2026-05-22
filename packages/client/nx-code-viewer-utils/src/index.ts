// Re-export types (no runtime cost). `export *` is fine here because
// TypeScript types are erased at compile time and analyzers don't
// need to detect them as named runtime exports.
export type * from './lib/types';
export type * from './lib/utils/index';

// Explicit named re-exports for every runtime value. Rollup,
// cjs-module-lexer, and esbuild all need to statically detect named
// exports at this entry point. `export *` compiles to
// `__exportStar(...)` which static analyzers can't fully traverse
// through chained barrels - they bail out and report "X is not
// exported by ...". Listing each name explicitly makes the analyzer
// trivially see every export at the package boundary.

// types/code-viewer.constants.ts
export {
  COPY_FEEDBACK_DURATION_MS,
  DEFAULT_CODE_VIEWER_CONFIG,
  LANGUAGE_ALIASES,
  SHIKI_THEME_MAP,
  THEME_CSS_CLASSES,
  resolveShikiTheme,
} from './lib/types/code-viewer.constants';

// types/diff-viewer.types.ts
export { DEFAULT_DIFF_VIEWER_CONFIG } from './lib/types/diff-viewer.types';

// types/line-widget.types.ts
export {
  LINE_WIDGET_CONTEXT,
  LINE_WIDGET_CLOSE,
} from './lib/types/line-widget.types';

// types/multi-code-viewer.types.ts
export {
  DEFAULT_COLUMN_CODE_VIEWER_CONFIG,
  DEFAULT_MULTI_CODE_VIEWER_CONFIG,
  isCodeTabItem,
  isColumnCodeItem,
  isColumnDiffItem,
  isDiffTabItem,
} from './lib/types/multi-code-viewer.types';

// utils/collapsed-lines.utils.ts
export {
  createCollapsedRangesState,
  createDiffCollapsedRangesState,
  diffRangeToKey,
  isDiffLineInCollapsedRange,
  isLineInCollapsedRange,
  parseCollapsedRanges,
  parseDiffCollapsedRanges,
  rangeToKey,
} from './lib/utils/collapsed-lines.utils';

// utils/diff.utils.ts
export {
  computeDiff,
  getDiffLinePrefix,
  getDiffStats,
  parseDiff,
  toSplitViewLines,
} from './lib/utils/diff.utils';

// utils/highlight.utils.ts
export {
  isLineHighlighted,
  parseHighlightedLines,
} from './lib/utils/highlight.utils';

// utils/html.utils.ts
export {
  countLines,
  escapeHtml,
  extractCodeContent,
  formatLineNumber,
  generateLineNumbers,
} from './lib/utils/html.utils';

// utils/icon.utils.ts
export {
  FILENAME_ICON_MAP,
  FILE_EXTENSION_ICON_MAP,
  LANGUAGE_TO_EXTENSION_MAP,
  getExtensionFromFilename,
  getExtensionFromLanguage,
  getFileIcon,
  getFileIconUrl,
  getIconCdnUrl,
} from './lib/utils/icon.utils';

// utils/language.utils.ts
export {
  getLanguageDisplayName,
  resolveLanguageAlias,
} from './lib/utils/language.utils';

// utils/line-widget.utils.ts
export {
  getMatchingWidgets,
  getMatchingWidgetsByDisplay,
  getMatchingWidgetsByPosition,
  hasMatchingWidgetsWithDisplay,
  matchesLine,
} from './lib/utils/line-widget.utils';
