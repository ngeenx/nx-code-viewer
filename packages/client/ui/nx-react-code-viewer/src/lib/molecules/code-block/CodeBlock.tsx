import React, { memo, useState, useMemo, useCallback } from 'react';
import type {
  ActiveInsertWidget,
  CodeViewerTheme,
  CollapsedRangeState,
  CopyButtonState,
  LineRange,
  LineWidgetClickEvent,
  LineWidgetsInput,
  ProcessedReference,
  ReferenceHoverEvent,
} from '@ngeenx/nx-code-viewer-utils';
import { LineNumbers } from '../../atoms/line-numbers';
import { CodeContent } from '../../atoms/code-content';
import { CopyButton } from '../../atoms/copy-button';

interface CodeBlockProps {
  content: string | null;
  rawCode?: string;
  lineCount: number;
  theme?: CodeViewerTheme;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
  maxHeight?: string;
  isLoading?: boolean;
  showCopyButton?: boolean;
  copyState?: CopyButtonState;
  onCopyClick?: () => void;
  highlightedLinesSet?: Set<number>;
  focusedLinesSet?: Set<number>;
  processedReferences?: Map<string, ProcessedReference>;
  collapsedRangesState?: Map<string, CollapsedRangeState>;
  lineWidgets?: LineWidgetsInput;
  onReferenceClick?: (reference: ProcessedReference) => void;
  onReferenceHover?: (event: ReferenceHoverEvent) => void;
  onCollapsedRangeToggle?: (range: LineRange) => void;
  onLineWidgetClick?: (event: LineWidgetClickEvent) => void;
}

export const CodeBlock = memo(function CodeBlock({
  content,
  rawCode = '',
  lineCount,
  theme = 'dark',
  showLineNumbers = true,
  wordWrap = false,
  maxHeight = '',
  isLoading = false,
  showCopyButton = true,
  copyState = 'idle',
  onCopyClick,
  highlightedLinesSet = new Set(),
  focusedLinesSet = new Set(),
  processedReferences = new Map(),
  collapsedRangesState = new Map(),
  lineWidgets = [],
  onReferenceClick,
  onReferenceHover,
  onCollapsedRangeToggle,
  onLineWidgetClick,
}: CodeBlockProps) {
  const [hoveredLine, setHoveredLine] = useState(0);
  const [activeInsertWidget, setActiveInsertWidget] = useState<ActiveInsertWidget | null>(null);
  const [insertWidgetHeight, setInsertWidgetHeight] = useState(0);

  const containerStyle = useMemo(() => {
    return maxHeight ? { maxHeight } : {};
  }, [maxHeight]);

  const handleLineHover = useCallback((lineNumber: number) => {
    setHoveredLine(lineNumber);
  }, []);

  const handleLineWidgetClick = useCallback((event: LineWidgetClickEvent) => {
    const currentActive = activeInsertWidget;
    if (
      currentActive &&
      currentActive.lineNumber === event.lineNumber &&
      currentActive.widget === event.widget
    ) {
      setActiveInsertWidget(null);
    } else if (event.widget.insertComponent) {
      setActiveInsertWidget({
        lineNumber: event.lineNumber,
        widget: event.widget,
        line: event.line,
      });
    }

    onLineWidgetClick?.(event);
  }, [activeInsertWidget, onLineWidgetClick]);

  const handleInsertWidgetClose = useCallback(() => {
    setActiveInsertWidget(null);
  }, []);

  const handleInsertWidgetHeightChange = useCallback((height: number) => {
    setInsertWidgetHeight(height);
  }, []);

  return (
    <div className="nx-code-block">
      <div className="code-block-wrapper">
        {showCopyButton && (
          <CopyButton
            state={copyState}
            theme={theme}
            onCopyClick={onCopyClick}
          />
        )}

        <div
          className="code-block-container"
          style={containerStyle}
          onMouseLeave={() => handleLineHover(0)}
        >
          {showLineNumbers && (
            <LineNumbers
              lineCount={lineCount}
              theme={theme}
              hoveredLine={hoveredLine}
              highlightedLinesSet={highlightedLinesSet}
              collapsedRangesState={collapsedRangesState}
              activeInsertWidget={activeInsertWidget}
              insertWidgetHeight={insertWidgetHeight}
              onLineHover={handleLineHover}
              onCollapsedRangeToggle={onCollapsedRangeToggle}
            />
          )}

          <CodeContent
            content={content}
            rawCode={rawCode}
            theme={theme}
            wordWrap={wordWrap}
            isLoading={isLoading}
            hoveredLine={hoveredLine}
            highlightedLinesSet={highlightedLinesSet}
            focusedLinesSet={focusedLinesSet}
            collapsedRangesState={collapsedRangesState}
            processedReferences={processedReferences}
            lineWidgets={lineWidgets}
            activeInsertWidget={activeInsertWidget}
            onLineHover={handleLineHover}
            onReferenceClick={onReferenceClick}
            onReferenceHover={onReferenceHover}
            onCollapsedRangeToggle={onCollapsedRangeToggle}
            onLineWidgetClick={handleLineWidgetClick}
            onInsertWidgetClose={handleInsertWidgetClose}
            onInsertWidgetHeightChange={handleInsertWidgetHeightChange}
          />
        </div>
      </div>
    </div>
  );
});
