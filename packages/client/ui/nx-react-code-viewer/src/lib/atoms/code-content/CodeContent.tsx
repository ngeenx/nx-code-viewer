import React, { memo, useState, useRef, useEffect, useCallback, useMemo, type ComponentType } from 'react';
import {
  isLineInCollapsedRange,
  getMatchingWidgets,
  type CodeViewerTheme,
  type CollapsedRangeState,
  type LineRange,
  type LineWidgetClickEvent,
  type LineWidgetConfig,
  type LineWidgetContext,
  type LineWidgetsInput,
  type ProcessedReference,
  type ReferenceHoverEvent,
  type ActiveInsertWidget,
} from '@ngeenx/nx-code-viewer-utils';
import { LineWidgetHost } from '../line-widget-host';

interface LineWidgetRenderData {
  lineNumber: number;
  lineText: string;
  lineElement: Element;
  widgets: LineWidgetConfig[];
  context: LineWidgetContext;
  top: number;
  height: number;
}

interface CodeContentProps {
  content: string | null;
  rawCode?: string;
  theme?: CodeViewerTheme;
  wordWrap?: boolean;
  isLoading?: boolean;
  hoveredLine?: number;
  highlightedLinesSet?: Set<number>;
  focusedLinesSet?: Set<number>;
  collapsedRangesState?: Map<string, CollapsedRangeState>;
  processedReferences?: Map<string, ProcessedReference>;
  lineWidgets?: LineWidgetsInput;
  activeInsertWidget?: ActiveInsertWidget | null;
  onLineHover?: (lineNumber: number) => void;
  onReferenceClick?: (reference: ProcessedReference) => void;
  onReferenceHover?: (event: ReferenceHoverEvent) => void;
  onCollapsedRangeToggle?: (range: LineRange) => void;
  onLineWidgetClick?: (event: LineWidgetClickEvent) => void;
  onInsertWidgetClose?: () => void;
  onInsertWidgetHeightChange?: (height: number) => void;
}

const VALID_THEMES = new Set(['dark', 'light']);
function sanitizeTheme(theme: string): string {
  return VALID_THEMES.has(theme) ? theme : 'dark';
}

export const CodeContent = memo(function CodeContent({
  content,
  rawCode = '',
  theme = 'dark',
  wordWrap = false,
  isLoading = false,
  hoveredLine = 0,
  highlightedLinesSet = new Set(),
  focusedLinesSet = new Set(),
  collapsedRangesState = new Map(),
  processedReferences = new Map(),
  lineWidgets = [],
  activeInsertWidget = null,
  onLineHover,
  onReferenceClick,
  onReferenceHover,
  onCollapsedRangeToggle,
  onLineWidgetClick,
  onInsertWidgetClose,
  onInsertWidgetHeightChange,
}: CodeContentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const insertWidgetContainerRef = useRef<HTMLDivElement | null>(null);
  const insertWidgetResizeObserverRef = useRef<ResizeObserver | null>(null);

  const [hoverWidgetData, setHoverWidgetData] = useState<LineWidgetRenderData | null>(null);
  const [alwaysWidgetData, setAlwaysWidgetData] = useState<LineWidgetRenderData[]>([]);

  const containerClasses = useMemo(() => {
    return `${theme} ${wordWrap ? 'wrap' : 'nowrap'}`;
  }, [theme, wordWrap]);

  const leftHoverWidgets = useMemo(() => {
    if (!hoverWidgetData) return [];
    return hoverWidgetData.widgets.filter(w => w.position === 'left' && w.display === 'hover');
  }, [hoverWidgetData]);

  const rightHoverWidgets = useMemo(() => {
    if (!hoverWidgetData) return [];
    return hoverWidgetData.widgets.filter(w => w.position === 'right' && w.display === 'hover');
  }, [hoverWidgetData]);

  // Update line styles effect
  useEffect(() => {
    const codeElement = codeRef.current;
    if (!codeElement) return;

    const hasFocusedLines = focusedLinesSet.size > 0;
    const hasCollapsedRanges = collapsedRangesState.size > 0;

    // Remove existing collapse indicators
    codeElement.querySelectorAll('.nx-collapse-indicator').forEach(el => el.remove());

    const lines = codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      (line as HTMLElement).style.position = 'relative';

      if (hasCollapsedRanges) {
        const collapseInfo = isLineInCollapsedRange(lineNumber, collapsedRangesState);

        if (collapseInfo.isCollapsed && !collapseInfo.isFirstLine) {
          line.classList.add('collapsed-hidden');
          return;
        } else {
          line.classList.remove('collapsed-hidden');
        }

        if (collapseInfo.isFirstLine && collapseInfo.range) {
          const indicator = document.createElement('div');
          const safeTheme = sanitizeTheme(theme);
          indicator.className = `line nx-collapse-indicator ${safeTheme}`;

          const iconSpan = document.createElement('span');
          iconSpan.className = 'expand-icon';
          iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4" /></svg>`;

          const textSpan = document.createElement('span');
          textSpan.className = 'collapse-text';
          const linesText = collapseInfo.hiddenCount === 1 ? 'line' : 'lines';
          textSpan.textContent = `... ${collapseInfo.hiddenCount} ${linesText}`;

          indicator.appendChild(iconSpan);
          indicator.appendChild(textSpan);

          const range = collapseInfo.range;
          indicator.addEventListener('click', () => onCollapsedRangeToggle?.(range));
          indicator.setAttribute('role', 'button');
          indicator.setAttribute('tabindex', '0');
          indicator.setAttribute('aria-label', `Expand ${collapseInfo.hiddenCount} hidden ${linesText}`);
          indicator.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onCollapsedRangeToggle?.(range);
            }
          });

          line.insertAdjacentElement('afterend', indicator);
        }
      } else {
        line.classList.remove('collapsed-hidden');
      }

      // Handle hover state
      if (lineNumber === hoveredLine) {
        line.classList.add('hovered');
      } else {
        line.classList.remove('hovered');
      }

      // Handle highlighting
      if (highlightedLinesSet.has(lineNumber)) {
        line.classList.add('highlighted');
      } else {
        line.classList.remove('highlighted');
      }

      // Handle unfocused state
      if (hasFocusedLines && !focusedLinesSet.has(lineNumber)) {
        line.classList.add('unfocused');
      } else {
        line.classList.remove('unfocused');
      }
    });
  }, [content, hoveredLine, highlightedLinesSet, focusedLinesSet, collapsedRangesState, theme, onCollapsedRangeToggle]);

  // Update hover widgets
  useEffect(() => {
    if (!hoveredLine || !lineWidgets || lineWidgets.length === 0) {
      setHoverWidgetData(null);
      return;
    }

    if (activeInsertWidget && activeInsertWidget.lineNumber === hoveredLine) {
      setHoverWidgetData(null);
      return;
    }

    const wrapperElement = wrapperRef.current;
    const codeElement = codeRef.current;
    if (!wrapperElement || !codeElement) {
      setHoverWidgetData(null);
      return;
    }

    const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)'));
    const lineElement = lines[hoveredLine - 1];
    if (!lineElement) {
      setHoverWidgetData(null);
      return;
    }

    const codeLines = rawCode.split('\n');
    const lineText = codeLines[hoveredLine - 1] || '';

    const matchingWidgets = getMatchingWidgets(lineWidgets, lineText, hoveredLine);
    const hoverWidgets = matchingWidgets.filter(w => w.display === 'hover');

    if (hoverWidgets.length === 0) {
      setHoverWidgetData(null);
      return;
    }

    const rect = lineElement.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    setHoverWidgetData({
      lineNumber: hoveredLine,
      lineText,
      lineElement,
      widgets: hoverWidgets,
      context: { line: lineText, lineNumber: hoveredLine, theme },
      top: rect.top - wrapperRect.top,
      height: rect.height,
    });
  }, [hoveredLine, lineWidgets, rawCode, theme, content, activeInsertWidget]);

  // Update always-visible widgets
  useEffect(() => {
    if (!lineWidgets || lineWidgets.length === 0) {
      setAlwaysWidgetData([]);
      return;
    }

    const alwaysWidgetConfigs = lineWidgets.filter(w => w.display === 'always');
    if (alwaysWidgetConfigs.length === 0) {
      setAlwaysWidgetData([]);
      return;
    }

    const activeInsertLineNumber = activeInsertWidget?.lineNumber;
    const wrapperElement = wrapperRef.current;
    const codeElement = codeRef.current;
    if (!wrapperElement || !codeElement) {
      setAlwaysWidgetData([]);
      return;
    }

    const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)'));
    const codeLines = rawCode.split('\n');
    const wrapperRect = wrapperElement.getBoundingClientRect();

    const renderData: LineWidgetRenderData[] = [];

    lines.forEach((lineElement, index) => {
      const lineNumber = index + 1;
      if (activeInsertLineNumber === lineNumber) return;

      const lineText = codeLines[index] || '';
      const matchingWidgets = getMatchingWidgets(alwaysWidgetConfigs, lineText, lineNumber);
      if (matchingWidgets.length === 0) return;

      const rect = lineElement.getBoundingClientRect();
      renderData.push({
        lineNumber,
        lineText,
        lineElement,
        widgets: matchingWidgets,
        context: { line: lineText, lineNumber, theme },
        top: rect.top - wrapperRect.top,
        height: rect.height,
      });
    });

    setAlwaysWidgetData(renderData);
  }, [lineWidgets, rawCode, theme, content, activeInsertWidget]);

  // Update inline insert widget
  useEffect(() => {
    // Cleanup previous
    if (insertWidgetResizeObserverRef.current) {
      insertWidgetResizeObserverRef.current.disconnect();
      insertWidgetResizeObserverRef.current = null;
    }
    if (insertWidgetContainerRef.current) {
      insertWidgetContainerRef.current.remove();
      insertWidgetContainerRef.current = null;
      onInsertWidgetHeightChange?.(0);
    }

    if (!activeInsertWidget?.widget.insertComponent) return;

    const codeElement = codeRef.current;
    if (!codeElement) return;

    const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)'));
    const lineElement = lines[activeInsertWidget.lineNumber - 1];
    if (!lineElement) return;

    // Create container
    const safeTheme = sanitizeTheme(theme);
    const container = document.createElement('div');
    container.className = `line nx-insert-widget-container ${safeTheme}`;
    lineElement.insertAdjacentElement('afterend', container);
    insertWidgetContainerRef.current = container;

    // We'll use React createRoot for rendering the insert widget
    const { createRoot } = require('react-dom/client');
    const InsertComponent = activeInsertWidget.widget.insertComponent;
    const context: LineWidgetContext = {
      line: activeInsertWidget.line,
      lineNumber: activeInsertWidget.lineNumber,
      theme,
    };

    const root = createRoot(container);
    root.render(
      React.createElement(InsertComponent, {
        ...context,
        onClose: () => onInsertWidgetClose?.(),
      })
    );

    // ResizeObserver for height tracking
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        onInsertWidgetHeightChange?.(height);
      }
    });
    resizeObserver.observe(container);
    insertWidgetResizeObserverRef.current = resizeObserver;

    return () => {
      root.unmount();
      resizeObserver.disconnect();
      if (container.parentNode) {
        container.remove();
      }
      onInsertWidgetHeightChange?.(0);
    };
  }, [activeInsertWidget, theme, content]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const lineElement = target.closest('.line');

    if (lineElement?.classList.contains('nx-insert-widget-container')) return;

    if (lineElement && codeRef.current) {
      const lines = Array.from(
        codeRef.current.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)')
      );
      const lineIndex = lines.indexOf(lineElement);
      if (lineIndex !== -1) {
        onLineHover?.(lineIndex + 1);
      }
    }
  }, [onLineHover]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref');

    if (refElement) {
      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = processedReferences.get(refId);
        if (reference) {
          if (reference.types.includes('link') && !refElement.hasAttribute('href')) {
            onReferenceClick?.(reference);
          } else if (!reference.types.includes('link')) {
            onReferenceClick?.(reference);
          }
        }
      }
    }
  }, [processedReferences, onReferenceClick]);

  const handleMouseOver = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;

    if (refElement) {
      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = processedReferences.get(refId);
        if (reference) {
          onReferenceHover?.({ reference, element: refElement, show: true });
        }
      }
    }
  }, [processedReferences, onReferenceHover]);

  const handleMouseOut = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;

    if (refElement) {
      if (relatedTarget && refElement.contains(relatedTarget)) return;

      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = processedReferences.get(refId);
        if (reference) {
          onReferenceHover?.({ reference, element: refElement, show: false });
        }
      }
    }
  }, [processedReferences, onReferenceHover]);

  const handleWidgetClick = useCallback((widget: LineWidgetConfig, data: LineWidgetRenderData) => {
    onLineWidgetClick?.({
      lineNumber: data.lineNumber,
      line: data.lineText,
      widget,
    });
  }, [onLineWidgetClick]);

  return (
    <div className="nx-code-content">
      <div className="code-content-wrapper" ref={wrapperRef}>
        <code
          ref={codeRef}
          className={containerClasses}
          dangerouslySetInnerHTML={content ? { __html: content } : undefined}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />

        {/* Hover widgets overlay */}
        {hoverWidgetData && (
          <>
            {leftHoverWidgets.map((widget, i) => (
              <div
                key={`left-hover-${i}`}
                className="line-widget-overlay left"
                style={{ top: `${hoverWidgetData.top}px`, height: `${hoverWidgetData.height}px` }}
              >
                <LineWidgetHost
                  component={widget.lineComponent}
                  context={hoverWidgetData.context}
                  position="left"
                  theme={theme}
                  onWidgetClick={() => handleWidgetClick(widget, hoverWidgetData)}
                />
              </div>
            ))}
            {rightHoverWidgets.map((widget, i) => (
              <div
                key={`right-hover-${i}`}
                className="line-widget-overlay right"
                style={{ top: `${hoverWidgetData.top}px`, height: `${hoverWidgetData.height}px` }}
              >
                <LineWidgetHost
                  component={widget.lineComponent}
                  context={hoverWidgetData.context}
                  position="right"
                  theme={theme}
                  onWidgetClick={() => handleWidgetClick(widget, hoverWidgetData)}
                />
              </div>
            ))}
          </>
        )}

        {/* Always-visible widgets overlay */}
        {alwaysWidgetData.map((data) =>
          data.widgets.map((widget, i) => (
            <div
              key={`always-${data.lineNumber}-${i}`}
              className={`line-widget-overlay ${widget.position === 'left' ? 'left' : 'right'}`}
              style={{ top: `${data.top}px`, height: `${data.height}px` }}
            >
              <LineWidgetHost
                component={widget.lineComponent}
                context={data.context}
                position={widget.position}
                theme={theme}
                onWidgetClick={() => handleWidgetClick(widget, data)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
});
