import { memo, useState, useMemo, useCallback } from 'react';
import {
  toSplitViewLines,
  isDiffLineInCollapsedRange,
  type CodeViewerTheme,
  type DiffCollapsedRange,
  type DiffCollapsedRangeState,
  type DiffHunk,
  type DiffLine as DiffLineType,
  type DiffViewMode,
  type LineWidgetContext,
} from '@ngeenx/nx-code-viewer-utils';
import type { ReactLineWidgetsInput, ReactLineWidgetClickEvent, ReactLineWidgetConfig } from '../../types';
import { DiffLine } from '../../atoms/diff-line';
import { DiffCollapsedIndicator } from '../../atoms/diff-collapsed-indicator';

interface DiffBlockProps {
  hunks: readonly DiffHunk[];
  theme?: CodeViewerTheme;
  viewMode?: DiffViewMode;
  showLineNumbers?: boolean;
  maxHeight?: string;
  collapsedRangesState?: Map<string, DiffCollapsedRangeState>;
  lineWidgets?: ReactLineWidgetsInput;
  onCollapsedRangeToggle?: (range: DiffCollapsedRange) => void;
  onLineWidgetClick?: (event: ReactLineWidgetClickEvent) => void;
}

export const DiffBlock = memo(function DiffBlock({
  hunks,
  theme = 'dark',
  viewMode = 'unified',
  showLineNumbers = true,
  maxHeight = '',
  collapsedRangesState = new Map(),
  lineWidgets,
  onCollapsedRangeToggle,
  onLineWidgetClick,
}: DiffBlockProps) {
  const [hoveredLineIndex, setHoveredLineIndex] = useState(-1);
  const [activeInsertWidget, setActiveInsertWidget] = useState<{ lineNumber: number; widget: ReactLineWidgetConfig; line: string } | null>(null);
  const containerStyle = useMemo(() => maxHeight ? { maxHeight } : {}, [maxHeight]);
  const isUnifiedView = viewMode === 'unified';

  const unifiedViewData = useMemo(() => {
    const result: { header: string; lines: { line: DiffLineType; globalIndex: number }[] }[] = [];
    let globalIndex = 0;
    for (const hunk of hunks) {
      const lines: { line: DiffLineType; globalIndex: number }[] = [];
      for (const line of hunk.lines) {
        lines.push({ line, globalIndex });
        globalIndex++;
      }
      result.push({ header: hunk.header, lines });
    }
    return result;
  }, [hunks]);

  const splitViewHunks = useMemo(() => {
    let globalIndex = 0;
    return hunks.map(hunk => {
      const lines = toSplitViewLines(hunk.lines).map(pair => {
        const result = { ...pair, globalIndex };
        globalIndex++;
        return result;
      });
      return { header: hunk.header, lines };
    });
  }, [hunks]);

  const getCollapseInfo = useCallback((globalIndex: number) => {
    return isDiffLineInCollapsedRange(globalIndex, collapsedRangesState);
  }, [collapsedRangesState]);

  const isLineVisible = useCallback((globalIndex: number) => {
    const info = getCollapseInfo(globalIndex);
    return !info.isCollapsed || info.isFirstLine;
  }, [getCollapseInfo]);

  const handleLineWidgetClick = useCallback((event: ReactLineWidgetClickEvent, line: DiffLineType) => {
    onLineWidgetClick?.(event);
    if (event.widget.insertComponent) {
      const current = activeInsertWidget;
      if (current?.lineNumber === event.lineNumber && current.widget === event.widget) {
        setActiveInsertWidget(null);
      } else {
        setActiveInsertWidget({ lineNumber: event.lineNumber, widget: event.widget, line: line.content });
      }
    }
  }, [activeInsertWidget, onLineWidgetClick]);

  const shouldShowInsertWidget = useCallback((lineNumber: number) => {
    return activeInsertWidget !== null && activeInsertWidget.lineNumber === lineNumber;
  }, [activeInsertWidget]);

  const getInsertWidgetContext = useCallback((): LineWidgetContext => ({
    line: activeInsertWidget?.line ?? '',
    lineNumber: activeInsertWidget?.lineNumber ?? 0,
    theme,
  }), [activeInsertWidget, theme]);

  return (
    <div className="nx-diff-block">
      <div className={`diff-block-container ${theme}`} style={containerStyle} onMouseLeave={() => setHoveredLineIndex(-1)}>
        {isUnifiedView ? (
          unifiedViewData.map((hunk, hunkIdx) => (
            <div key={hunkIdx} className="hunk">
              <div className="hunk-header">{hunk.header}</div>
              {hunk.lines.map(item => {
                const collapseInfo = getCollapseInfo(item.globalIndex);
                if (!isLineVisible(item.globalIndex)) return null;
                const lineNum = item.line.newLineNumber ?? item.line.oldLineNumber ?? 0;

                return (
                  <div key={item.globalIndex}>
                    <DiffLine
                      line={item.line}
                      theme={theme}
                      showLineNumbers={showLineNumbers}
                      showPrefix={true}
                      lineIndex={item.globalIndex}
                      isHighlighted={hoveredLineIndex === item.globalIndex}
                      lineWidgets={lineWidgets}
                      onLineHover={setHoveredLineIndex}
                      onLineWidgetClick={e => handleLineWidgetClick(e, item.line)}
                    />
                    {shouldShowInsertWidget(lineNum) && activeInsertWidget?.widget.insertComponent && (
                      <div className={`nx-insert-widget-container ${theme}`}>
                        {(() => {
                          const InsertComp = activeInsertWidget.widget.insertComponent!;
                          const ctx = getInsertWidgetContext();
                          return <InsertComp line={ctx.line} lineNumber={ctx.lineNumber} theme={ctx.theme} onClose={() => setActiveInsertWidget(null)} />;
                        })()}
                      </div>
                    )}
                    {collapseInfo.isFirstLine && collapseInfo.range && (
                      <DiffCollapsedIndicator
                        theme={theme}
                        range={collapseInfo.range}
                        hiddenCount={collapseInfo.hiddenCount}
                        showLineNumbers={showLineNumbers}
                        showPrefix={true}
                        onToggle={() => onCollapsedRangeToggle?.(collapseInfo.range!)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          splitViewHunks.map((hunk, hunkIdx) => (
            <div key={hunkIdx} className="hunk">
              <div className="hunk-header">{hunk.header}</div>
              <div className="split-container">
                <div className="split-pane left">
                  {hunk.lines.map(pair => {
                    const collapseInfo = getCollapseInfo(pair.globalIndex);
                    if (!isLineVisible(pair.globalIndex)) return null;
                    return (
                      <div key={`left-${pair.globalIndex}`}>
                        {pair.left ? (
                          <DiffLine line={pair.left} theme={theme} showLineNumbers={showLineNumbers} showPrefix={false}
                            lineIndex={pair.globalIndex} isHighlighted={hoveredLineIndex === pair.globalIndex}
                            lineWidgets={lineWidgets} onLineHover={setHoveredLineIndex}
                            onLineWidgetClick={e => handleLineWidgetClick(e, pair.left!)} />
                        ) : (
                          <div className="empty-line"></div>
                        )}
                        {collapseInfo.isFirstLine && collapseInfo.range && (
                          <DiffCollapsedIndicator theme={theme} range={collapseInfo.range} hiddenCount={collapseInfo.hiddenCount}
                            showLineNumbers={showLineNumbers} showPrefix={false} onToggle={() => onCollapsedRangeToggle?.(collapseInfo.range!)} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="split-pane right">
                  {hunk.lines.map(pair => {
                    const collapseInfo = getCollapseInfo(pair.globalIndex);
                    if (!isLineVisible(pair.globalIndex)) return null;
                    return (
                      <div key={`right-${pair.globalIndex}`}>
                        {pair.right ? (
                          <DiffLine line={pair.right} theme={theme} showLineNumbers={showLineNumbers} showPrefix={false}
                            lineIndex={pair.globalIndex} isHighlighted={hoveredLineIndex === pair.globalIndex}
                            lineWidgets={lineWidgets} onLineHover={setHoveredLineIndex}
                            onLineWidgetClick={e => handleLineWidgetClick(e, pair.right!)} />
                        ) : (
                          <div className="empty-line"></div>
                        )}
                        {collapseInfo.isFirstLine && collapseInfo.range && (
                          <DiffCollapsedIndicator theme={theme} range={collapseInfo.range} hiddenCount={collapseInfo.hiddenCount}
                            showLineNumbers={showLineNumbers} showPrefix={false} onToggle={() => onCollapsedRangeToggle?.(collapseInfo.range!)} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
