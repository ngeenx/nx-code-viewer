import { InjectionToken, Type } from '@angular/core';
import type { CodeViewerTheme } from './code-viewer.types';

/**
 * Position of the line widget relative to the line
 */
export type LineWidgetPosition = 'left' | 'right';

/**
 * Display mode for the line widget
 * - 'hover': Widget is shown only when the line is hovered
 * - 'always': Widget is always visible
 */
export type LineWidgetDisplay = 'hover' | 'always';

/**
 * Match specification for determining which lines should show the widget
 * - boolean: true for all lines, false for no lines
 * - RegExp: Tests against line content
 * - function: Custom logic receiving line content and number
 */
export type LineWidgetMatch =
  | boolean
  | RegExp
  | ((line: string, lineNumber: number) => boolean);

/**
 * Context provided to line widget components via injection
 */
export interface LineWidgetContext {
  /** The content of the line (plain text, without HTML) */
  readonly line: string;
  /** The 1-based line number */
  readonly lineNumber: number;
  /** The current theme */
  readonly theme: CodeViewerTheme;
}

/**
 * Injection token for providing line widget context to dynamically created components
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class BookmarkWidgetComponent {
 *   private readonly context = inject(LINE_WIDGET_CONTEXT);
 *
 *   onClick() {
 *     console.log(`Bookmark line ${this.context.lineNumber}`);
 *   }
 * }
 * ```
 */
export const LINE_WIDGET_CONTEXT = new InjectionToken<LineWidgetContext>(
  'LINE_WIDGET_CONTEXT'
);

/**
 * Injection token for providing a close callback to insert widget components
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CommentFormComponent {
 *   private readonly context = inject(LINE_WIDGET_CONTEXT);
 *   private readonly close = inject(LINE_WIDGET_CLOSE);
 *
 *   onCancel() {
 *     this.close();
 *   }
 * }
 * ```
 */
export const LINE_WIDGET_CLOSE = new InjectionToken<() => void>(
  'LINE_WIDGET_CLOSE'
);

/**
 * Configuration for a single line widget
 *
 * @example
 * ```typescript
 * const bookmarkWidget: LineWidgetConfig = {
 *   position: 'left',
 *   display: 'hover',
 *   lineComponent: BookmarkButtonComponent,
 * };
 *
 * const commentWidget: LineWidgetConfig = {
 *   match: (line, num) => num > 5,
 *   position: 'right',
 *   display: 'hover',
 *   lineComponent: CommentButtonComponent,
 *   insertComponent: CommentFormComponent,
 * };
 * ```
 */
export interface LineWidgetConfig<TLine = unknown, TInsert = unknown> {
  /**
   * Determines which lines should show this widget
   * - true (default): All lines
   * - false: No lines
   * - RegExp: Lines matching the pattern
   * - function: Custom logic
   */
  readonly match?: LineWidgetMatch;

  /**
   * Position of the widget relative to the line content
   */
  readonly position: LineWidgetPosition;

  /**
   * Display mode
   * - 'hover': Show only when line is hovered
   * - 'always': Always visible
   */
  readonly display: LineWidgetDisplay;

  /**
   * Component to render as the line widget
   * Receives LINE_WIDGET_CONTEXT via dependency injection
   */
  readonly lineComponent: Type<TLine>;

  /**
   * Optional component to render between lines when the line widget is clicked
   * If not provided, clicking the line widget has no effect
   * Receives LINE_WIDGET_CONTEXT via dependency injection
   */
  readonly insertComponent?: Type<TInsert>;
}

/**
 * Input type for lineWidgets property on code/diff viewers
 */
export type LineWidgetsInput = readonly LineWidgetConfig[];

/**
 * Event emitted when a line widget is clicked
 */
export interface LineWidgetClickEvent {
  /** The 1-based line number where the widget was clicked */
  readonly lineNumber: number;
  /** The line content (plain text) */
  readonly line: string;
  /** The widget configuration that was clicked */
  readonly widget: LineWidgetConfig;
}

/**
 * State tracking which insert widget is currently active
 */
export interface ActiveInsertWidget {
  /** The 1-based line number where the insert widget is shown */
  readonly lineNumber: number;
  /** The widget configuration */
  readonly widget: LineWidgetConfig;
  /** The line content */
  readonly line: string;
}
