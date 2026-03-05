import { memo, useEffect, useRef, useCallback, useState, useMemo } from 'react';
import {
  isLineInCollapsedRange,
  getMatchingWidgets,
  type CodeViewerTheme,
  type CollapsedRangeState,
  type LineRange,
  type ProcessedReference,
  type ReferenceHoverEvent,
  type ActiveInsertWidget,
} from '@ngeenx/nx-code-viewer-utils';
import type { ReactLineWidgetsInput, ReactLineWidgetClickEvent, ReactLineWidgetConfig } from '../../types';

interface LineWidgetRenderData {
  lineNumber: number;
  lineText: string;
  widgets: ReactLineWidgetConfig[];
  context: { line: string; lineNumber: number; theme: CodeViewerTheme };
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
  lineWidgets?: ReactLineWidgetsInput;
  activeInsertWidget?: ActiveInsertWidget | null;
  onLineHover?: (lineNumber: number) => void;
  onReferenceClick?: (reference: ProcessedReference) => void;
  onReferenceHover?: (event: ReferenceHoverEvent) => void;
  onCollapsedRangeToggle?: (range: LineRange) => void;
  onLineWidgetClick?: (event: ReactLineWidgetClickEvent) => void;
  onInsertWidgetClose?: () => void;
  onInsertWidgetHeightChange?: (height: number) => void;
}

export const CodeContent = memo(function CodeContent({
  content,
  rawCode = '',
  theme = 'dark',
  wordWrap = false,
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
  const [hoverWidgetData, setHoverWidgetData] = useState<LineWidgetRenderData | null>(null);
  const [alwaysWidgetData, setAlwaysWidgetData] = useState<LineWidgetRenderData[]>([]);

  const containerClasses = `${theme} ${wordWrap ? 'wrap' : 'nowrap'}`;

  const VALID_THEMES = useMemo(() => new Set(['dark', 'light']), []);
  const sanitizeTheme = useCallback((t: string) => VALID_THEMES.has(t) ? t : 'dark', [VALID_THEMES]);

  // Update line styles
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
          indicator.className = `line nx-collapse-indicator ${sanitizeTheme(theme)}`;

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

      if (lineNumber === hoveredLine) line.classList.add('hovered');
      else line.classList.remove('hovered');

      if (highlightedLinesSet.has(lineNumber)) line.classList.add('highlighted');
      else line.classList.remove('highlighted');

      if (hasFocusedLines && !focusedLinesSet.has(lineNumber)) line.classList.add('unfocused');
      else line.classList.remove('unfocused');
    });
  }, [content, hoveredLine, highlightedLinesSet, focusedLinesSet, collapsedRangesState, theme, sanitizeTheme, onCollapsedRangeToggle]);

  // Update hover widgets
  useEffect(() => {
    if (!hoveredLine || !lineWidgets || lineWidgets.length === 0 || (activeInsertWidget && activeInsertWidget.lineNumber === hoveredLine)) {
      setHoverWidgetData(null);
      return;
    }

    const wrapperElement = wrapperRef.current;
    const codeElement = codeRef.current;
    if (!wrapperElement || !codeElement) { setHoverWidgetData(null); return; }

    const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)'));
    const lineElement = lines[hoveredLine - 1];
    if (!lineElement) { setHoverWidgetData(null); return; }

    const codeLines = rawCode.split('\n');
    const lineText = codeLines[hoveredLine - 1] || '';

    const matchingWidgets = getMatchingWidgets(lineWidgets as any, lineText, hoveredLine);
    const hoverWidgets = matchingWidgets.filter(w => w.display === 'hover') as unknown as ReactLineWidgetConfig[];

    if (hoverWidgets.length === 0) { setHoverWidgetData(null); return; }

    const rect = lineElement.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    setHoverWidgetData({
      lineNumber: hoveredLine,
      lineText,
      widgets: hoverWidgets,
      context: { line: lineText, lineNumber: hoveredLine, theme },
      top: rect.top - wrapperRect.top,
      height: rect.height,
    });
  }, [hoveredLine, lineWidgets, rawCode, theme, content, activeInsertWidget]);

  // Update always-visible widgets
  useEffect(() => {
    if (!lineWidgets || lineWidgets.length === 0) { setAlwaysWidgetData([]); return; }

    const alwaysWidgets = lineWidgets.filter(w => w.display === 'always');
    if (alwaysWidgets.length === 0) { setAlwaysWidgetData([]); return; }

    const wrapperElement = wrapperRef.current;
    const codeElement = codeRef.current;
    if (!wrapperElement || !codeElement) { setAlwaysWidgetData([]); return; }

    const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)'));
    const codeLines = rawCode.split('\n');
    const wrapperRect = wrapperElement.getBoundingClientRect();
    const activeInsertLineNumber = activeInsertWidget?.lineNumber;

    const renderData: LineWidgetRenderData[] = [];

    lines.forEach((lineElement, index) => {
      const lineNumber = index + 1;
      if (activeInsertLineNumber === lineNumber) return;

      const lineText = codeLines[index] || '';
      const matchingWidgets = getMatchingWidgets(alwaysWidgets as any, lineText, lineNumber) as unknown as ReactLineWidgetConfig[];
      if (matchingWidgets.length === 0) return;

      const rect = lineElement.getBoundingClientRect();
      renderData.push({
        lineNumber,
        lineText,
        widgets: matchingWidgets,
        context: { line: lineText, lineNumber, theme },
        top: rect.top - wrapperRect.top,
        height: rect.height,
      });
    });

    setAlwaysWidgetData(renderData);
  }, [lineWidgets, rawCode, theme, content, activeInsertWidget]);

  // Insert widget rendering
  useEffect(() => {
    // Cleanup previous
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

    const safeTheme = sanitizeTheme(theme);
    const container = document.createElement('div');
    container.className = `line nx-insert-widget-container ${safeTheme}`;
    lineElement.insertAdjacentElement('afterend', container);
    insertWidgetContainerRef.current = container;

    // Use React to render the insert component
    const { createRoot } = require('react-dom/client');
    const { createElement } = require('react');
    const InsertComponent = activeInsertWidget.widget.insertComponent;
    const root = createRoot(container);
    root.render(
      createElement(InsertComponent, {
        line: activeInsertWidget.line,
        lineNumber: activeInsertWidget.lineNumber,
        theme,
        onClose: () => onInsertWidgetClose?.(),
      })
    );

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        onInsertWidgetHeightChange?.(height);
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      root.unmount();
      container.remove();
      insertWidgetContainerRef.current = null;
      onInsertWidgetHeightChange?.(0);
    };
  }, [activeInsertWidget, theme, sanitizeTheme, onInsertWidgetClose, onInsertWidgetHeightChange]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const lineElement = target.closest('.line');
    if (lineElement?.classList.contains('nx-insert-widget-container')) return;

    if (lineElement && codeRef.current) {
      const lines = Array.from(codeRef.current.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)'));
      const lineIndex = lines.indexOf(lineElement);
      if (lineIndex !== -1) onLineHover?.(lineIndex + 1);
    }
  }, [onLineHover]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref');
    if (!refElement) return;

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
  }, [processedReferences, onReferenceClick]);

  const handleMouseOver = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;
    if (refElement) {
      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = processedReferences.get(refId);
        if (reference) onReferenceHover?.({ reference, element: refElement, show: true });
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
        if (reference) onReferenceHover?.({ reference, element: refElement, show: false });
      }
    }
  }, [processedReferences, onReferenceHover]);

  const leftHoverWidgets = useMemo(() => {
    if (!hoverWidgetData) return [];
    return hoverWidgetData.widgets.filter(w => w.position === 'left' && w.display === 'hover');
  }, [hoverWidgetData]);

  const rightHoverWidgets = useMemo(() => {
    if (!hoverWidgetData) return [];
    return hoverWidgetData.widgets.filter(w => w.position === 'right' && w.display === 'hover');
  }, [hoverWidgetData]);

  const handleWidgetClick = useCallback((widget: ReactLineWidgetConfig, data: LineWidgetRenderData) => {
    onLineWidgetClick?.({
      lineNumber: data.lineNumber,
      line: data.lineText,
      widget,
    });
  }, [onLineWidgetClick]);

  return (
    <div className="nx-code-content" ref={wrapperRef}>
      <div className="code-content-wrapper">
        <code
          ref={codeRef}
          className={containerClasses}
          dangerouslySetInnerHTML={content ? { __html: content } : undefined}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />

        {/* Hover widgets */}
        {hoverWidgetData && (
          <>
            {leftHoverWidgets.map((widget, i) => (
              <div
                key={`hover-left-${i}`}
                className="line-widget-overlay left"
                style={{ top: hoverWidgetData.top, height: hoverWidgetData.height }}
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); handleWidgetClick(widget, hoverWidgetData); }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleWidgetClick(widget, hoverWidgetData); } }}
              >
                <widget.lineComponent {...hoverWidgetData.context} />
              </div>
            ))}
            {rightHoverWidgets.map((widget, i) => (
              <div
                key={`hover-right-${i}`}
                className="line-widget-overlay right"
                style={{ top: hoverWidgetData.top, height: hoverWidgetData.height }}
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); handleWidgetClick(widget, hoverWidgetData); }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleWidgetClick(widget, hoverWidgetData); } }}
              >
                <widget.lineComponent {...hoverWidgetData.context} />
              </div>
            ))}
          </>
        )}

        {/* Always-visible widgets */}
        {alwaysWidgetData.map(data => (
          data.widgets.map((widget, i) => (
            <div
              key={`always-${data.lineNumber}-${i}`}
              className={`line-widget-overlay ${widget.position}`}
              style={{ top: data.top, height: data.height }}
              role="button"
              tabIndex={0}
              onClick={e => { e.stopPropagation(); handleWidgetClick(widget, data); }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleWidgetClick(widget, data); } }}
            >
              <widget.lineComponent {...data.context} />
            </div>
          ))
        ))}
      </div>
    </div>
  );
});
