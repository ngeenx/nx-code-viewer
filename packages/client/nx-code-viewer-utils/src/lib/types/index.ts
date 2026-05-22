export * from './code-viewer.types';
export * from './diff-viewer.types';
export * from './multi-code-viewer.types';
export * from './line-widget.types';

// Explicit named re-exports for the constants module so consumers
// can `import { resolveShikiTheme } from '@ngeenx/nx-code-viewer-utils'`
// reliably across the CJS/ESM interop boundary. Star re-exports
// chained two levels deep aren't always detected by Vite's
// cjs-module-lexer; explicit re-exports compile to direct
// `Object.defineProperty(exports, 'resolveShikiTheme', ...)` calls
// the lexer picks up every time.
export {
  DEFAULT_CODE_VIEWER_CONFIG,
  SHIKI_THEME_MAP,
  LANGUAGE_ALIASES,
  COPY_FEEDBACK_DURATION_MS,
  THEME_CSS_CLASSES,
  resolveShikiTheme,
} from './code-viewer.constants';
export type { ThemeCssClasses } from './code-viewer.constants';
