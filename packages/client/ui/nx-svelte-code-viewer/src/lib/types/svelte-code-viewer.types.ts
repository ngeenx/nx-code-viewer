import type { Component } from 'svelte';
import type {
  CodeViewerTheme,
  LineWidgetDisplay,
  LineWidgetMatch,
  LineWidgetPosition,
  LineWidgetClickEvent,
  ActiveInsertWidget,
  LineWidgetContext,
} from '@ngeenx/nx-code-viewer-utils';

/**
 * Svelte-specific state for highlighted code
 * Uses string instead of Angular's SafeHtml
 */
export interface SvelteHighlightedCodeState {
  readonly html: string | null;
  readonly rawHtml: string | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

/**
 * Svelte-specific line widget configuration
 * Uses Svelte's Component type instead of Angular's Type<T>
 */
export interface SvelteLineWidgetConfig {
  readonly match?: LineWidgetMatch;
  readonly position: LineWidgetPosition;
  readonly display: LineWidgetDisplay;
  readonly lineComponent: Component;
  readonly insertComponent?: Component;
}

/**
 * Svelte-specific line widgets input type
 */
export type SvelteLineWidgetsInput = readonly SvelteLineWidgetConfig[];

/**
 * Svelte-specific active insert widget
 */
export interface SvelteActiveInsertWidget {
  readonly lineNumber: number;
  readonly widget: SvelteLineWidgetConfig;
  readonly line: string;
}

/**
 * Svelte-specific line widget click event
 */
export interface SvelteLineWidgetClickEvent {
  readonly lineNumber: number;
  readonly line: string;
  readonly widget: SvelteLineWidgetConfig;
}

/**
 * Svelte-specific reference config content type
 */
export type SvelteReferenceContent = string | Component;

export type {
  CodeViewerTheme,
  LineWidgetContext,
  ActiveInsertWidget,
  LineWidgetClickEvent,
};
