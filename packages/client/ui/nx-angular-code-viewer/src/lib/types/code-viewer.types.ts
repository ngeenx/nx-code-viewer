import type { SafeHtml } from '@angular/platform-browser';
import type { BundledLanguage } from 'shiki';
import type { Type } from '@angular/core';

/**
 * Theme variants for code viewer
 */
export type CodeViewerTheme = 'dark' | 'light';

/**
 * Border style variants for code viewer
 * - 'classic': Standard rounded border (default)
 * - 'grid-cross': Grid borders with corner cross marks extending outside
 * - 'corner-intersection': Long grid borders extending beyond corners
 * - 'none': No border styling
 */
export type CodeViewerBorderStyle =
  | 'classic'
  | 'grid-cross'
  | 'corner-intersection'
  | 'none';

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
 * Focused lines specification (same format as highlighted lines)
 * When specified, all lines NOT in this set will be blurred
 */
export type FocusedLinesInput = HighlightedLinesInput;

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

// ═══════════════════════════════════════════════════════════════════════════
// REFERENCE LINK TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Type of reference interaction
 * - 'link': Clickable link that navigates to a URL
 * - 'info': Shows information popover on hover
 */
export type ReferenceType = 'link' | 'info';

/**
 * Reference type specification
 * Can be a single type or an array of both types
 */
export type ReferenceTypeSpec =
  | ReferenceType
  | readonly [ReferenceType, ReferenceType];

/**
 * Link target for 'link' type references
 */
export type ReferenceLinkTarget = '_blank' | '_self' | '_parent' | '_top';

/**
 * Configuration for a single reference pattern
 *
 * @example
 * ```typescript
 * // Link-only reference
 * const linkRef: ReferenceConfig = {
 *   textMatch: /@angular\/\w+/g,
 *   linkMatch: /@angular\/(\w+)/g,
 *   type: 'link',
 *   link: 'https://angular.io/api/$1',
 *   target: '_blank'
 * };
 *
 * // Info-only reference
 * const infoRef: ReferenceConfig = {
 *   textMatch: /TODO:/g,
 *   type: 'info',
 *   content: 'This is a todo item that needs attention'
 * };
 *
 * // Combined link and info
 * const combinedRef: ReferenceConfig = {
 *   textMatch: /\bComponent\b/g,
 *   type: ['link', 'info'],
 *   link: 'https://angular.io/api/core/Component',
 *   content: 'Angular Component decorator'
 * };
 * ```
 */
export interface ReferenceConfig {
  /**
   * Regex pattern to match text in code
   * Applied to plain text content (not HTML)
   * Use global flag (g) for multiple matches per line
   */
  readonly textMatch: RegExp;

  /**
   * Regex to extract link/context parameters from matched text
   * Capture groups become $1, $2, etc. in the link template
   * If not provided, the entire matched text is used
   */
  readonly linkMatch?: RegExp;

  /**
   * Type of reference interaction
   * - 'link': Clickable link
   * - 'info': Hover popover
   * - ['link', 'info']: Both behaviors
   */
  readonly type: ReferenceTypeSpec;

  /**
   * URL template with $1, $2, etc. placeholders for capture groups
   * Required when type includes 'link'
   */
  readonly link?: string;

  /**
   * Link target attribute
   * @default '_blank'
   */
  readonly target?: ReferenceLinkTarget;

  /**
   * Content for info popover
   * Can be a string or an Angular component type
   * Required when type includes 'info'
   */
  readonly content?: string | Type<unknown>;

  /**
   * Optional CSS class for custom styling of the reference element
   */
  readonly cssClass?: string;
}

/**
 * Processed reference match result (internal use)
 * Contains resolved values after processing a match
 */
export interface ProcessedReference {
  /**
   * Unique identifier for this reference instance
   */
  readonly id: string;

  /**
   * The original matched text from the code
   */
  readonly matchedText: string;

  /**
   * Capture groups extracted from linkMatch regex
   */
  readonly captureGroups: readonly string[];

  /**
   * Resolved URL with capture groups substituted
   * Only present when type includes 'link'
   */
  readonly resolvedLink?: string;

  /**
   * Link target attribute
   */
  readonly target: ReferenceLinkTarget;

  /**
   * Normalized array of reference types
   */
  readonly types: readonly ReferenceType[];

  /**
   * Content for info popover (string or component)
   */
  readonly content?: string | Type<unknown>;

  /**
   * Custom CSS class
   */
  readonly cssClass?: string;

  /**
   * Line number where the match was found (1-based)
   */
  readonly lineNumber: number;
}

/**
 * Event emitted when a reference is hovered
 */
export interface ReferenceHoverEvent {
  /**
   * The processed reference data
   */
  readonly reference: ProcessedReference;

  /**
   * The DOM element being hovered
   */
  readonly element: HTMLElement;

  /**
   * Whether the mouse is entering (true) or leaving (false)
   */
  readonly show: boolean;
}
