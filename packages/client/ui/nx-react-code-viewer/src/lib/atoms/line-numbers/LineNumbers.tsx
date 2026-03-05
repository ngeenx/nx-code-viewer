import React, { memo, useMemo, useCallback } from 'react';
import {
  generateLineNumbers,
  formatLineNumber,
  isLineInCollapsedRange,
  type CodeViewerTheme,
  type CollapsedRangeState,
  type LineRange,
  type ActiveInsertWidget,
} from '@ngeenx/nx-code-viewer-utils';

interface LineNumbersProps {
  lineCount: number;
  theme?: CodeViewerTheme;
  hoveredLine?: number;
  highlightedLinesSet?: Set<number>;
  collapsedRangesState?: Map<string, CollapsedRangeState>;
  activeInsertWidget?: ActiveInsertWidget | null;
  insertWidgetHeight?: number;
  onLineHover?: (lineNumber: number) => void;
  onCollapsedRangeToggle?: (range: LineRange) => void;
}

export const LineNumbers = memo(function LineNumbers({
  lineCount,
  theme = 'dark',
  hoveredLine = 0,
  highlightedLinesSet = new Set(),
  collapsedRangesState = new Map(),
  activeInsertWidget = null,
  insertWidgetHeight = 0,
  onLineHover,
  onCollapsedRangeToggle,
}: LineNumbersProps) {
  const lineNumbers = useMemo(() => generateLineNumbers(lineCount), [lineCount]);

  const formatLine = useCallback(
    (lineNumber: number) => formatLineNumber(lineNumber, lineCount),
    [lineCount]
  );

  return (
    <div className="nx-line-numbers">
      <div className={`line-numbers-container ${theme}`} aria-hidden="true">
        {lineNumbers.map((lineNumber) => {
          const collapseInfo = isLineInCollapsedRange(lineNumber, collapsedRangesState);
          const isVisible = !collapseInfo.isCollapsed || collapseInfo.isFirstLine;

          if (!isVisible) return null;

          const isHovered = hoveredLine === lineNumber;
          const isHighlighted = highlightedLinesSet.has(lineNumber);
          const classes = [
            'line-number',
            isHovered ? 'hovered' : '',
            isHighlighted ? 'highlighted' : '',
            collapseInfo.isFirstLine ? 'collapsed-first' : '',
          ].filter(Boolean).join(' ');

          return (
            <React.Fragment key={lineNumber}>
              <div
                className={classes}
                onMouseEnter={() => onLineHover?.(lineNumber)}
              >
                {formatLine(lineNumber)}
              </div>
              {collapseInfo.isFirstLine && collapseInfo.range && (
                <div
                  className="line-number collapse-indicator"
                  role="button"
                  tabIndex={0}
                  aria-label={`Expand ${collapseInfo.hiddenCount} hidden ${collapseInfo.hiddenCount === 1 ? 'line' : 'lines'}`}
                  onClick={() => onCollapsedRangeToggle?.(collapseInfo.range!)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCollapsedRangeToggle?.(collapseInfo.range!);
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                  </svg>
                </div>
              )}
              {activeInsertWidget !== null && activeInsertWidget.lineNumber === lineNumber && (
                <div className="insert-widget-placeholder" style={{ height: `${insertWidgetHeight}px` }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});
