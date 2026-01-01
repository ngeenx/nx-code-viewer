import type { SafeHtml } from '@angular/platform-browser';
import type { BundledLanguage } from 'shiki';

/**
 * Theme variants for code viewer
 */
export type CodeViewerTheme = 'dark' | 'light';

/**
 * Line range represented as a tuple [start, end] (inclusive)
 */
export type LineRange = readonly [number, number];

/**
 * Highlighted lines specification
 * - number: single line (e.g., 5)
 * - number[]: multiple individual lines (e.g., [1, 3, 5])
 * - LineRange: single range (e.g., [1, 5] for lines 1-5)
 * - LineRange[]: multiple ranges (e.g., [[1, 5], [10, 15]])
 * - Mixed array: combination of lines and ranges (e.g., [1, [3, 5], 8, [10, 12]])
 */
export type HighlightedLinesInput = number | readonly (number | LineRange)[];

/**
 * Supported programming language type
 * Extends Shiki's BundledLanguage with 'plaintext' for plain text display
 */
export type CodeViewerLanguage = BundledLanguage | 'plaintext';

/**
 * Copy button state
 */
export type CopyButtonState = 'idle' | 'copied' | 'error';

/**
 * Configuration for code viewer component
 */
export interface CodeViewerConfig {
  readonly language: CodeViewerLanguage;
  readonly theme: CodeViewerTheme;
  readonly showLineNumbers: boolean;
  readonly showCopyButton: boolean;
  readonly showHeader: boolean;
  readonly maxHeight: string;
  readonly wordWrap: boolean;
  readonly title: string;
}

/**
 * Default configuration values
 */
export type DefaultCodeViewerConfig = Required<CodeViewerConfig>;

/**
 * State for highlighted code
 */
export interface HighlightedCodeState {
  readonly html: SafeHtml | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

/**
 * Result from code highlighting operation
 */
export interface HighlightResult {
  readonly success: boolean;
  readonly html: string | null;
  readonly error: Error | null;
}

/**
 * Options for code highlighting
 */
export interface HighlightOptions {
  readonly code: string;
  readonly language: CodeViewerLanguage;
  readonly theme: CodeViewerTheme;
  readonly signal?: AbortSignal;
}

/**
 * Clipboard operation result
 */
export interface ClipboardResult {
  readonly success: boolean;
  readonly error: Error | null;
}

/**
 * Line number display data
 */
export interface LineNumberData {
  readonly lineNumber: number;
  readonly isHighlighted: boolean;
}

/**
 * Code header display data
 */
export interface CodeHeaderData {
  readonly title: string;
  readonly language: CodeViewerLanguage;
  readonly displayText: string;
}

/**
 * Mapping for language aliases
 */
export type LanguageAliasMap = Readonly<Record<string, CodeViewerLanguage>>;

/**
 * Shiki theme mapping
 */
export type ShikiThemeMap = Readonly<Record<CodeViewerTheme, string>>;
