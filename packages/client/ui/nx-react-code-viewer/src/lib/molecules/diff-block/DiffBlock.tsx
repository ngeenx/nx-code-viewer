import React, { memo, useState, useMemo, useCallback, type ComponentType } from 'react';
import {
  toSplitViewLines,
  isDiffLineInCollapsedRange,
  type CodeViewerTheme,
  type DiffCollapsedRange,
  type DiffCollapsedRangeState,
  type DiffHunk,
  type DiffLine as DiffLineType,
  type DiffViewMode,
  type LineWidgetClickEvent,
  type LineWidgetConfig,
  type LineWidgetContext,
  type LineWidgetsInput,
} from '@ngeenx/nx-code-viewer-utils';
import { DiffLine } from '../../atoms/diff-line';
import { DiffCollapsedIndicator } from '../../atoms/diff-collapsed-indicator';
import { InsertWidgetContainer } from '../../atoms/insert-widget-container';

interface DiffBlockProps {
  hunks: readonly DiffHunk[];
  theme?: CodeViewerTheme;
  viewMode?: DiffViewMode;
  showLineNumbers?: boolean;
  maxHeight?: string;
  collapsedRangesState?: Map<string, DiffCollapsedRangeState>;
  lineWidgets?: LineWidgetsInput;
  onCollapsedRangeToggle?: (range: DiffCollapsedRange) => void;
  onLineWidgetClick?: (event: LineWidgetClickEvent) => void;
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
  const [activeInsertWidget, setActiveInsertWidget] = useState<{
    lineNumber: number;
    widget: LineWidgetConfig;
    line: string;
  } | null>(null);

  const containerStyle = useMemo(() => {
    return maxHeight ? { maxHeight } : {};
  }, [maxHeight]);

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

  const getLineCollapseInfo = useCallback((globalIndex: number) => {
    return isDiffLineInCollapsedRange(globalIndex, collapsedRangesState);
  }, [collapsedRangesState]);

  const isLineVisible = useCallback((globalIndex: number) => {
    const collapseInfo = getLineCollapseInfo(globalIndex);
    return !collapseInfo.isCollapsed || collapseInfo.isFirstLine;
  }, [getLineCollapseInfo]);

  const handleLineWidgetClick = useCallback((event: LineWidgetClickEvent, line: DiffLineType) => {
    onLineWidgetClick?.(event);

    if (event.widget.insertComponent) {
      const current = activeInsertWidget;
      if (current?.lineNumber === event.lineNumber && current.widget === event.widget) {
        setActiveInsertWidget(null);
      } else {
        setActiveInsertWidget({
          lineNumber: event.lineNumber,
          widget: event.widget,
          line: line.content,
        });
      }
    }
  }, [activeInsertWidget, onLineWidgetClick]);

  const shouldShowInsertWidget = useCallback((lineNumber: number) => {
    return activeInsertWidget !== null && activeInsertWidget.lineNumber === lineNumber;
  }, [activeInsertWidget]);

  const getInsertWidgetContext = useCallback((): LineWidgetContext => {
    return {
      line: activeInsertWidget?.line ?? '',
      lineNumber: activeInsertWidget?.lineNumber ?? 0,
      theme,
    };
  }, [activeInsertWidget, theme]);

  return (
    <div className="nx-diff-block">
      <div
        className={`diff-block-container ${theme}`}
        style={containerStyle}
        onMouseLeave={() => setHoveredLineIndex(-1)}
      >
        {isUnifiedView ? (
          /* Unified View */
          unifiedViewData.map((hunk, hunkIndex) => (
            <div className="hunk" key={hunkIndex}>
              <div className="hunk-header">{hunk.header}</div>
              {hunk.lines.map(({ line, globalIndex }) => {
                const collapseInfo = getLineCollapseInfo(globalIndex);
                if (!isLineVisible(globalIndex)) return null;

                const lineNum = line.newLineNumber ?? line.oldLineNumber ?? 0;

                return (
                  <React.Fragment key={globalIndex}>
                    <DiffLine
                      line={line}
                      theme={theme}
                      showLineNumbers={showLineNumbers}
                      showPrefix={true}
                      lineIndex={globalIndex}
                      isHighlighted={hoveredLineIndex === globalIndex}
                      lineWidgets={lineWidgets}
                      onLineHover={setHoveredLineIndex}
                      onLineWidgetClick={(e) => handleLineWidgetClick(e, line)}
                    />

                    {shouldShowInsertWidget(lineNum) && activeInsertWidget && (
                      <InsertWidgetContainer
                        component={activeInsertWidget.widget.insertComponent as ComponentType<any>}
                        context={getInsertWidgetContext()}
                        theme={theme}
                      />
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
                  </React.Fragment>
                );
              })}
            </div>
          ))
        ) : (
          /* Split View */
          splitViewHunks.map((hunk, hunkIndex) => (
            <div className="hunk" key={hunkIndex}>
              <div className="hunk-header">{hunk.header}</div>
              <div className="split-container">
                <div className="split-pane left">
                  {hunk.lines.map((pair) => {
                    const collapseInfo = getLineCollapseInfo(pair.globalIndex);
                    if (!isLineVisible(pair.globalIndex)) return null;

                    return (
                      <React.Fragment key={`left-${pair.globalIndex}`}>
                        {pair.left ? (
                          <>
                            <DiffLine
                              line={pair.left}
                              theme={theme}
                              showLineNumbers={showLineNumbers}
                              showPrefix={false}
                              lineIndex={pair.globalIndex}
                              isHighlighted={hoveredLineIndex === pair.globalIndex}
                              lineWidgets={lineWidgets}
                              onLineHover={setHoveredLineIndex}
                              onLineWidgetClick={(e) => handleLineWidgetClick(e, pair.left!)}
                            />
                            {shouldShowInsertWidget(pair.left.oldLineNumber ?? 0) && activeInsertWidget && (
                              <InsertWidgetContainer
                                component={activeInsertWidget.widget.insertComponent as ComponentType<any>}
                                context={getInsertWidgetContext()}
                                theme={theme}
                              />
                            )}
                          </>
                        ) : (
                          <div className="empty-line" />
                        )}

                        {collapseInfo.isFirstLine && collapseInfo.range && (
                          <DiffCollapsedIndicator
                            theme={theme}
                            range={collapseInfo.range}
                            hiddenCount={collapseInfo.hiddenCount}
                            showLineNumbers={showLineNumbers}
                            showPrefix={false}
                            onToggle={() => onCollapsedRangeToggle?.(collapseInfo.range!)}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="split-pane right">
                  {hunk.lines.map((pair) => {
                    const collapseInfo = getLineCollapseInfo(pair.globalIndex);
                    if (!isLineVisible(pair.globalIndex)) return null;

                    return (
                      <React.Fragment key={`right-${pair.globalIndex}`}>
                        {pair.right ? (
                          <>
                            <DiffLine
                              line={pair.right}
                              theme={theme}
                              showLineNumbers={showLineNumbers}
                              showPrefix={false}
                              lineIndex={pair.globalIndex}
                              isHighlighted={hoveredLineIndex === pair.globalIndex}
                              lineWidgets={lineWidgets}
                              onLineHover={setHoveredLineIndex}
                              onLineWidgetClick={(e) => handleLineWidgetClick(e, pair.right!)}
                            />
                            {shouldShowInsertWidget(pair.right.newLineNumber ?? 0) && activeInsertWidget && (
                              <InsertWidgetContainer
                                component={activeInsertWidget.widget.insertComponent as ComponentType<any>}
                                context={getInsertWidgetContext()}
                                theme={theme}
                              />
                            )}
                          </>
                        ) : (
                          <div className="empty-line" />
                        )}

                        {collapseInfo.isFirstLine && collapseInfo.range && (
                          <DiffCollapsedIndicator
                            theme={theme}
                            range={collapseInfo.range}
                            hiddenCount={collapseInfo.hiddenCount}
                            showLineNumbers={showLineNumbers}
                            showPrefix={false}
                            onToggle={() => onCollapsedRangeToggle?.(collapseInfo.range!)}
                          />
                        )}
                      </React.Fragment>
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
