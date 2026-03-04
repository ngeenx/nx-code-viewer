import type {
  CodeViewerBorderStyle,
  CodeViewerLanguage,
  CodeViewerTheme,
  HighlightedLinesInput,
} from './code-viewer.types';
import type { DiffViewMode } from './diff-viewer.types';

/**
 * Tab content type discriminator
 */
export type TabContentType = 'code' | 'diff';

/**
 * Base tab item interface with shared properties
 */
export interface BaseTabItem {
  /** Unique identifier for the tab */
  readonly id: string;
  /** Display name shown in the tab header */
  readonly fileName: string;
  /** File extension for icon display (e.g., '.ts', '.js') */
  readonly fileExtension?: string;
  /** Type discriminator */
  readonly type: TabContentType;
}

/**
 * Tab item for code viewer content
 */
export interface CodeTabItem extends BaseTabItem {
  readonly type: 'code';
  /** Source code to display */
  readonly code: string | string[];
  /** Programming language for syntax highlighting */
  readonly language?: CodeViewerLanguage;
  /** Whether to show line numbers */
  readonly showLineNumbers?: boolean;
  /** Whether to show the copy button */
  readonly showCopyButton?: boolean;
  /** Maximum height with scrolling */
  readonly maxHeight?: string;
  /** Enable word wrapping */
  readonly wordWrap?: boolean;
  /** Pre-configured lines to highlight */
  readonly highlightedLines?: HighlightedLinesInput;
}

/**
 * Tab item for diff viewer content
 */
export interface DiffTabItem extends BaseTabItem {
  readonly type: 'diff';
  /** Unified diff string (option 1) */
  readonly diff?: string;
  /** Original code for computing diff (option 2) */
  readonly oldCode?: string;
  /** Modified code for computing diff (option 2) */
  readonly newCode?: string;
  /** Programming language for syntax highlighting */
  readonly language?: CodeViewerLanguage;
  /** Display mode: unified or split */
  readonly viewMode?: DiffViewMode;
  /** Whether to show line numbers */
  readonly showLineNumbers?: boolean;
  /** Maximum height with scrolling */
  readonly maxHeight?: string;
  /** Old file name for diff header */
  readonly oldFileName?: string;
  /** New file name for diff header */
  readonly newFileName?: string;
}

/**
 * Union type for all tab items
 */
export type MultiCodeViewerTabItem = CodeTabItem | DiffTabItem;

/**
 * Configuration for multi-code-viewer component
 */
export interface MultiCodeViewerConfig {
  readonly theme: CodeViewerTheme;
  readonly borderStyle: CodeViewerBorderStyle;
  /** Whether to show individual content headers inside tabs */
  readonly showContentHeader: boolean;
  /** Default language for tabs without explicit language */
  readonly defaultLanguage: CodeViewerLanguage;
}

/**
 * Default configuration values for multi-code-viewer
 */
export const DEFAULT_MULTI_CODE_VIEWER_CONFIG: MultiCodeViewerConfig = {
  theme: 'dark',
  borderStyle: 'classic',
  showContentHeader: false,
  defaultLanguage: 'plaintext',
} as const;

/**
 * Tab change event payload
 */
export interface TabChangeEvent {
  readonly previousTabId: string | null;
  readonly currentTabId: string;
  readonly currentIndex: number;
}

/**
 * Type guard for CodeTabItem
 */
export function isCodeTabItem(
  tab: MultiCodeViewerTabItem
): tab is CodeTabItem {
  return tab.type === 'code';
}

/**
 * Type guard for DiffTabItem
 */
export function isDiffTabItem(
  tab: MultiCodeViewerTabItem
): tab is DiffTabItem {
  return tab.type === 'diff';
}
