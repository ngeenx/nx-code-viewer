import type {
  DefaultCodeViewerConfig,
  LanguageAliasMap,
  ShikiThemeMap,
} from './code-viewer.types';

/**
 * Default configuration for code viewer
 */
export const DEFAULT_CODE_VIEWER_CONFIG: DefaultCodeViewerConfig = {
  language: 'plaintext',
  theme: 'dark',
  showLineNumbers: true,
  showCopyButton: true,
  showHeader: true,
  maxHeight: '',
  wordWrap: false,
  title: '',
} as const;

/**
 * Shiki theme mapping for dark/light modes
 */
export const SHIKI_THEME_MAP: ShikiThemeMap = {
  dark: 'github-dark',
  light: 'github-light',
} as const;

/**
 * Language aliases for Shiki compatibility
 */
export const LANGUAGE_ALIASES: LanguageAliasMap = {
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  console: 'bash',
} as const;

/**
 * Duration in milliseconds to show "copied" feedback
 */
export const COPY_FEEDBACK_DURATION_MS = 2000 as const;

/**
 * CSS class names for theming
 */
export const THEME_CSS_CLASSES = {
  dark: {
    container: 'bg-neutral-900 border-neutral-700',
    header: 'bg-neutral-800 border-neutral-700 text-neutral-300',
    lineNumbers: 'bg-neutral-800 text-neutral-500 border-neutral-700',
    code: 'text-neutral-100',
    copyButton: 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700',
  },
  light: {
    container: 'bg-neutral-50 border-neutral-200',
    header: 'bg-neutral-100 border-neutral-200 text-neutral-700',
    lineNumbers: 'bg-neutral-100 text-neutral-400 border-neutral-200',
    code: 'text-neutral-900',
    copyButton: 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200',
  },
} as const;

/**
 * Type for theme CSS classes
 */
export type ThemeCssClasses = typeof THEME_CSS_CLASSES;
