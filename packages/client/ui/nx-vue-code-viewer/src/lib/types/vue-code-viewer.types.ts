import type { Component } from 'vue';
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
 * Vue-specific state for highlighted code
 * Uses string instead of Angular's SafeHtml
 */
export interface VueHighlightedCodeState {
  readonly html: string | null;
  readonly rawHtml: string | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

/**
 * Vue-specific line widget configuration
 * Uses Vue's Component type instead of Angular's Type<T>
 */
export interface VueLineWidgetConfig {
  readonly match?: LineWidgetMatch;
  readonly position: LineWidgetPosition;
  readonly display: LineWidgetDisplay;
  readonly lineComponent: Component;
  readonly insertComponent?: Component;
}

/**
 * Vue-specific line widgets input type
 */
export type VueLineWidgetsInput = readonly VueLineWidgetConfig[];

/**
 * Vue-specific active insert widget
 */
export interface VueActiveInsertWidget {
  readonly lineNumber: number;
  readonly widget: VueLineWidgetConfig;
  readonly line: string;
}

/**
 * Vue-specific line widget click event
 */
export interface VueLineWidgetClickEvent {
  readonly lineNumber: number;
  readonly line: string;
  readonly widget: VueLineWidgetConfig;
}

/**
 * Vue-specific reference config content type
 */
export type VueReferenceContent = string | Component;

export type {
  CodeViewerTheme,
  LineWidgetContext,
  ActiveInsertWidget,
  LineWidgetClickEvent,
};
