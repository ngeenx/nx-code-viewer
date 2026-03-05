import { memo, useMemo, useCallback } from 'react';
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
  onLineHover?: (lineNumber: number) => void;
  onCollapsedRangeToggle?: (range: LineRange) => void;
  activeInsertWidget?: ActiveInsertWidget | null;
  insertWidgetHeight?: number;
}

export const LineNumbers = memo(function LineNumbers({
  lineCount,
  theme = 'dark',
  hoveredLine = 0,
  highlightedLinesSet = new Set(),
  collapsedRangesState = new Map(),
  onLineHover,
  onCollapsedRangeToggle,
  activeInsertWidget = null,
  insertWidgetHeight = 0,
}: LineNumbersProps) {
  const lineNumbers = useMemo(() => generateLineNumbers(lineCount), [lineCount]);

  const getCollapseInfo = useCallback((lineNumber: number) => {
    return isLineInCollapsedRange(lineNumber, collapsedRangesState);
  }, [collapsedRangesState]);

  return (
    <div className="nx-line-numbers">
      <div className={`line-numbers-container ${theme}`} aria-hidden="true">
        {lineNumbers.map(lineNumber => {
          const collapseInfo = getCollapseInfo(lineNumber);
          const isCollapsed = collapseInfo.isCollapsed && !collapseInfo.isFirstLine;

          if (isCollapsed) return null;

          return (
            <div key={lineNumber}>
              <div
                className={`line-number${hoveredLine === lineNumber ? ' hovered' : ''}${highlightedLinesSet.has(lineNumber) ? ' highlighted' : ''}${collapseInfo.isFirstLine ? ' collapsed-first' : ''}`}
                onMouseEnter={() => onLineHover?.(lineNumber)}
              >
                {formatLineNumber(lineNumber, lineCount)}
              </div>
              {collapseInfo.isFirstLine && collapseInfo.range && (
                <div
                  className="line-number collapse-indicator"
                  role="button"
                  tabIndex={0}
                  aria-label={`Expand ${collapseInfo.hiddenCount} hidden ${collapseInfo.hiddenCount === 1 ? 'line' : 'lines'}`}
                  onClick={() => onCollapsedRangeToggle?.(collapseInfo.range!)}
                  onKeyDown={e => {
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
              {activeInsertWidget && activeInsertWidget.lineNumber === lineNumber && (
                <div className="insert-widget-placeholder" style={{ height: `${insertWidgetHeight}px` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
