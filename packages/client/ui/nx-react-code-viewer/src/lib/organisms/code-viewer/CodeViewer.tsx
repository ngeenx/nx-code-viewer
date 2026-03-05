import React, { memo, useState, useMemo, useEffect, useRef, useCallback, type ComponentType } from 'react';
import {
  DEFAULT_CODE_VIEWER_CONFIG,
  SHIKI_THEME_MAP,
  countLines,
  parseHighlightedLines,
  parseCollapsedRanges,
  createCollapsedRangesState,
  rangeToKey,
  escapeHtml,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
  type CodeViewerTheme,
  type CollapsedLinesInput,
  type CollapsedRangeState,
  type CollapsedRangeToggleEvent,
  type FocusedLinesInput,
  type HighlightedLinesInput,
  type LineRange,
  type LineWidgetClickEvent,
  type LineWidgetsInput,
  type ProcessedReference,
  type ReferenceConfig,
  type ReferenceHoverEvent,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import { useClipboard } from '../../hooks/useClipboard';
import { useCodeHighlighter } from '../../hooks/useCodeHighlighter';
import { processReferences } from '../../hooks/useReferenceProcessor';
import { CodeHeader } from '../../atoms/code-header';
import { ReferencePopover } from '../../atoms/reference-popover';
import { CodeBlock } from '../../molecules/code-block';

interface CodeViewerProps {
  code: string | string[];
  language?: CodeViewerLanguage;
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  title?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  showHeader?: boolean;
  maxHeight?: string;
  wordWrap?: boolean;
  fileExtension?: string;
  highlightedLines?: HighlightedLinesInput;
  focusedLines?: FocusedLinesInput;
  collapsedLines?: CollapsedLinesInput;
  borderStyle?: CodeViewerBorderStyle;
  references?: readonly ReferenceConfig[];
  maxCodeLength?: number;
  lineWidgets?: LineWidgetsInput;
  onCodeCopied?: () => void;
  onReferenceClick?: (reference: ProcessedReference) => void;
  onReferenceHover?: (event: ReferenceHoverEvent) => void;
  onCollapsedRangeToggle?: (event: CollapsedRangeToggleEvent) => void;
  onLineWidgetClick?: (event: LineWidgetClickEvent) => void;
}

export const CodeViewer = memo(function CodeViewer({
  code,
  language = DEFAULT_CODE_VIEWER_CONFIG.language,
  theme = DEFAULT_CODE_VIEWER_CONFIG.theme,
  shikiTheme,
  title = DEFAULT_CODE_VIEWER_CONFIG.title,
  showLineNumbers = DEFAULT_CODE_VIEWER_CONFIG.showLineNumbers,
  showCopyButton = DEFAULT_CODE_VIEWER_CONFIG.showCopyButton,
  showHeader = DEFAULT_CODE_VIEWER_CONFIG.showHeader,
  maxHeight = DEFAULT_CODE_VIEWER_CONFIG.maxHeight,
  wordWrap = DEFAULT_CODE_VIEWER_CONFIG.wordWrap,
  fileExtension = '',
  highlightedLines,
  focusedLines,
  collapsedLines,
  borderStyle = 'classic',
  references = [],
  maxCodeLength = 500_000,
  lineWidgets = [],
  onCodeCopied,
  onReferenceClick,
  onReferenceHover,
  onCollapsedRangeToggle,
  onLineWidgetClick,
}: CodeViewerProps) {
  const { copyState, copy } = useClipboard();
  const highlighter = useCodeHighlighter();

  const [highlightState, setHighlightState] = useState(highlighter.createInitialState());
  const [collapsedRangesState, setCollapsedRangesState] = useState<Map<string, CollapsedRangeState>>(new Map());
  const [activePopover, setActivePopover] = useState<{
    reference: ProcessedReference;
    anchorElement: HTMLElement;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedCode = useMemo(() => {
    return Array.isArray(code) ? code.join('\n') : code;
  }, [code]);

  const lineCount = useMemo(() => countLines(normalizedCode), [normalizedCode]);

  const highlightedLinesSet = useMemo(() => parseHighlightedLines(highlightedLines), [highlightedLines]);
  const focusedLinesSet = useMemo(() => parseHighlightedLines(focusedLines), [focusedLines]);

  // Highlight code when inputs change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!normalizedCode) {
      setHighlightState(highlighter.createInitialState());
      return;
    }

    if (normalizedCode.length > maxCodeLength) {
      setHighlightState(highlighter.createErrorState(
        new Error(`Code exceeds maximum allowed length of ${maxCodeLength} characters`)
      ));
      return;
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setHighlightState(highlighter.createLoadingState());

    highlighter.highlightToHtml({
      code: normalizedCode,
      language,
      theme,
      signal,
      shikiTheme,
    }).then(result => {
      if (!signal.aborted) {
        setHighlightState(result);
      }
    });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [normalizedCode, language, theme, shikiTheme, maxCodeLength]);

  // Initialize collapsed ranges
  useEffect(() => {
    const parsedRanges = parseCollapsedRanges(collapsedLines);
    setCollapsedRangesState(createCollapsedRangesState(parsedRanges));
  }, [collapsedLines]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Computed content
  const rawHtmlString = useMemo(() => {
    if (highlightState.rawHtml) return highlightState.rawHtml;
    if (normalizedCode) return highlighter.buildFallbackHtml(normalizedCode);
    return null;
  }, [highlightState.rawHtml, normalizedCode]);

  const rawHighlightedContent = useMemo(() => {
    if (highlightState.html) return highlightState.html;
    if (normalizedCode) return highlighter.buildFallbackHtml(normalizedCode);
    return null;
  }, [highlightState.html, normalizedCode]);

  const processedReferenceResult = useMemo(() => {
    if (!rawHtmlString || references.length === 0) return null;
    return processReferences(rawHtmlString, references);
  }, [rawHtmlString, references]);

  const processedReferencesMap = useMemo(() => {
    return processedReferenceResult?.processedReferences ?? new Map<string, ProcessedReference>();
  }, [processedReferenceResult]);

  const highlightedContent = useMemo(() => {
    if (!rawHighlightedContent) return null;
    if (processedReferenceResult) return processedReferenceResult.html;
    return rawHighlightedContent;
  }, [rawHighlightedContent, processedReferenceResult]);

  const isLoading = highlightState.isLoading;

  const handleCopyClick = useCallback(() => {
    copy(normalizedCode).then(result => {
      if (result.success) onCodeCopied?.();
    });
  }, [normalizedCode, copy, onCodeCopied]);

  const handleReferenceClick = useCallback((reference: ProcessedReference) => {
    if (reference.handle) {
      const codeString = Array.isArray(code) ? code.join('\n') : code;
      const lines = codeString.split('\n');
      const line = lines[reference.lineNumber - 1] ?? '';
      reference.handle(line);
    }
    onReferenceClick?.(reference);
  }, [code, onReferenceClick]);

  const handleReferenceHover = useCallback((event: ReferenceHoverEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    onReferenceHover?.(event);

    if (!event.reference.types.includes('info')) return;

    if (event.show) {
      hoverTimeoutRef.current = setTimeout(() => {
        setActivePopover({
          reference: event.reference,
          anchorElement: event.element,
        });
      }, 200);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActivePopover(null);
      }, 100);
    }
  }, [onReferenceHover]);

  const handlePopoverMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handlePopoverMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActivePopover(null);
    }, 100);
  }, []);

  const handleCollapsedRangeToggle = useCallback((range: LineRange) => {
    const key = rangeToKey(range);
    setCollapsedRangesState(prev => {
      const rangeState = prev.get(key);
      if (!rangeState) return prev;

      const newIsExpanded = !rangeState.isExpanded;
      const newState = new Map(prev);
      newState.set(key, { ...rangeState, isExpanded: newIsExpanded });

      onCollapsedRangeToggle?.({ range, isExpanded: newIsExpanded });

      return newState;
    });
  }, [onCollapsedRangeToggle]);

  const handleLineWidgetClick = useCallback((event: LineWidgetClickEvent) => {
    onLineWidgetClick?.(event);
  }, [onLineWidgetClick]);

  const borderOverlay = useMemo(() => {
    if (borderStyle === 'grid-cross') {
      return (
        <div className="border-overlay">
          <div className="border-top" />
          <div className="border-bottom" />
          <div className="border-left" />
          <div className="border-right" />
          <div className="corner-cross corner-top-left-h" />
          <div className="corner-cross corner-top-left-v" />
          <div className="corner-cross corner-top-right-h" />
          <div className="corner-cross corner-top-right-v" />
          <div className="corner-cross corner-bottom-left-h" />
          <div className="corner-cross corner-bottom-left-v" />
          <div className="corner-cross corner-bottom-right-h" />
          <div className="corner-cross corner-bottom-right-v" />
        </div>
      );
    }
    if (borderStyle === 'corner-intersection') {
      return (
        <div className="border-overlay">
          <div className="border-top-extended" />
          <div className="border-bottom-extended" />
          <div className="border-left-extended" />
          <div className="border-right-extended" />
        </div>
      );
    }
    return null;
  }, [borderStyle]);

  return (
    <div className="nx-code-viewer">
      <article className={`${theme} border-${borderStyle}`}>
        {borderOverlay}

        {showHeader && (
          <CodeHeader
            language={language}
            title={title}
            theme={theme}
            fileExtension={fileExtension}
          />
        )}

        <CodeBlock
          content={highlightedContent}
          rawCode={normalizedCode}
          lineCount={lineCount}
          theme={theme}
          showLineNumbers={showLineNumbers}
          wordWrap={wordWrap}
          maxHeight={maxHeight}
          isLoading={isLoading}
          showCopyButton={showCopyButton}
          copyState={copyState}
          onCopyClick={handleCopyClick}
          highlightedLinesSet={highlightedLinesSet}
          focusedLinesSet={focusedLinesSet}
          collapsedRangesState={collapsedRangesState}
          processedReferences={processedReferencesMap}
          lineWidgets={lineWidgets}
          onReferenceClick={handleReferenceClick}
          onReferenceHover={handleReferenceHover}
          onCollapsedRangeToggle={handleCollapsedRangeToggle}
          onLineWidgetClick={handleLineWidgetClick}
        />
      </article>

      {activePopover && (
        <ReferencePopover
          content={(activePopover.reference.content ?? '') as string | ComponentType<any>}
          anchorElement={activePopover.anchorElement}
          theme={theme}
          visible={true}
          matchedText={activePopover.reference.matchedText}
          captureGroups={activePopover.reference.captureGroups}
          lineNumber={activePopover.reference.lineNumber}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        />
      )}
    </div>
  );
});
