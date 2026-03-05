import { memo, useMemo } from 'react';
import {
  getDiffLinePrefix,
  getMatchingWidgets,
  type CodeViewerTheme,
  type DiffLine as DiffLineType,
  type LineWidgetClickEvent,
  type LineWidgetConfig,
  type LineWidgetContext,
  type LineWidgetsInput,
} from '@ngeenx/nx-code-viewer-utils';
import { LineWidgetHost } from '../line-widget-host';

interface DiffLineProps {
  line: DiffLineType;
  theme?: CodeViewerTheme;
  showLineNumbers?: boolean;
  showPrefix?: boolean;
  isHighlighted?: boolean;
  lineIndex?: number;
  lineWidgets?: LineWidgetsInput;
  showWidgets?: boolean;
  onLineHover?: (lineIndex: number) => void;
  onLineWidgetClick?: (event: LineWidgetClickEvent) => void;
}

export const DiffLine = memo(function DiffLine({
  line,
  theme = 'dark',
  showLineNumbers = true,
  showPrefix = true,
  isHighlighted = false,
  lineIndex = 0,
  lineWidgets,
  showWidgets = false,
  onLineHover,
  onLineWidgetClick,
}: DiffLineProps) {
  const lineClasses = useMemo(() => {
    const highlighted = isHighlighted ? 'highlighted' : '';
    return `diff-line ${line.type} ${theme} ${highlighted}`.trim();
  }, [line.type, theme, isHighlighted]);

  const prefix = useMemo(() => getDiffLinePrefix(line.type), [line.type]);

  const oldLineNum = useMemo(() => {
    return line.oldLineNumber !== undefined ? String(line.oldLineNumber) : '';
  }, [line.oldLineNumber]);

  const newLineNum = useMemo(() => {
    return line.newLineNumber !== undefined ? String(line.newLineNumber) : '';
  }, [line.newLineNumber]);

  const lineNumber = useMemo(() => {
    return line.newLineNumber ?? line.oldLineNumber ?? 0;
  }, [line.newLineNumber, line.oldLineNumber]);

  const widgetContext = useMemo<LineWidgetContext>(() => ({
    line: line.content,
    lineNumber,
    theme,
  }), [line.content, lineNumber, theme]);

  const alwaysWidgets = useMemo(() => {
    if (!lineWidgets) return [];
    return getMatchingWidgets(lineWidgets, line.content, lineNumber).filter(
      w => w.display === 'always'
    );
  }, [lineWidgets, line.content, lineNumber]);

  const hoverWidgets = useMemo(() => {
    if (!lineWidgets) return [];
    return getMatchingWidgets(lineWidgets, line.content, lineNumber).filter(
      w => w.display === 'hover'
    );
  }, [lineWidgets, line.content, lineNumber]);

  const leftWidgets = useMemo(() => {
    const always = alwaysWidgets.filter(w => w.position === 'left');
    const hover = (showWidgets || isHighlighted)
      ? hoverWidgets.filter(w => w.position === 'left')
      : [];
    return [...always, ...hover];
  }, [alwaysWidgets, hoverWidgets, showWidgets, isHighlighted]);

  const rightWidgets = useMemo(() => {
    const always = alwaysWidgets.filter(w => w.position === 'right');
    const hover = (showWidgets || isHighlighted)
      ? hoverWidgets.filter(w => w.position === 'right')
      : [];
    return [...always, ...hover];
  }, [alwaysWidgets, hoverWidgets, showWidgets, isHighlighted]);

  const handleWidgetClick = (widget: LineWidgetConfig) => {
    onLineWidgetClick?.({
      lineNumber,
      line: line.content,
      widget,
    });
  };

  return (
    <div className="nx-diff-line">
      <div className={lineClasses} onMouseEnter={() => onLineHover?.(lineIndex)}>
        {leftWidgets.length > 0 && (
          <div className="line-widgets-left">
            {leftWidgets.map((widget, i) => (
              <LineWidgetHost
                key={i}
                component={widget.lineComponent}
                context={widgetContext}
                position="left"
                theme={theme}
                onWidgetClick={() => handleWidgetClick(widget)}
              />
            ))}
          </div>
        )}

        {showLineNumbers && (
          <>
            <span className="line-number old">{oldLineNum}</span>
            <span className="line-number new">{newLineNum}</span>
          </>
        )}
        {showPrefix && <span className="prefix">{prefix}</span>}
        {line.highlightedContent ? (
          <span className="content" dangerouslySetInnerHTML={{ __html: line.highlightedContent }} />
        ) : (
          <span className="content">{line.content}</span>
        )}

        {rightWidgets.length > 0 && (
          <div className="line-widgets-right">
            {rightWidgets.map((widget, i) => (
              <LineWidgetHost
                key={i}
                component={widget.lineComponent}
                context={widgetContext}
                position="right"
                theme={theme}
                onWidgetClick={() => handleWidgetClick(widget)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
