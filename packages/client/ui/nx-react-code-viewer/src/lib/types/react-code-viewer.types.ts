import type { ComponentType } from 'react';
import type {
  LineWidgetMatch,
  LineWidgetPosition,
  LineWidgetDisplay,
  LineWidgetContext,
} from '@ngeenx/nx-code-viewer-utils';

export interface ReactLineWidgetConfig {
  readonly match?: LineWidgetMatch;
  readonly position: LineWidgetPosition;
  readonly display: LineWidgetDisplay;
  readonly lineComponent: ComponentType<LineWidgetContext>;
  readonly insertComponent?: ComponentType<LineWidgetContext & { onClose: () => void }>;
}

export type ReactLineWidgetsInput = readonly ReactLineWidgetConfig[];

export interface ReactLineWidgetClickEvent {
  lineNumber: number;
  line: string;
  widget: ReactLineWidgetConfig;
}

export interface ReactHighlightedCodeState {
  html: string | null;
  rawHtml: string | null;
  isLoading: boolean;
  error: Error | null;
}
