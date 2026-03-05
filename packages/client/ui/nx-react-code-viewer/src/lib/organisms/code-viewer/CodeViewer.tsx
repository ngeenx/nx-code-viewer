import { memo, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DEFAULT_CODE_VIEWER_CONFIG,
  countLines,
  parseHighlightedLines,
  parseCollapsedRanges,
  createCollapsedRangesState,
  rangeToKey,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
  type CodeViewerTheme,
  type CollapsedLinesInput,
  type CollapsedRangeState,
  type CollapsedRangeToggleEvent,
  type FocusedLinesInput,
  type HighlightedLinesInput,
  type LineRange,
  type ProcessedReference,
  type ReferenceConfig,
  type ReferenceHoverEvent,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import type { ReactLineWidgetsInput, ReactLineWidgetClickEvent } from '../../types';
import { useClipboard } from '../../hooks/useClipboard';
import { useCodeHighlighter } from '../../hooks/useCodeHighlighter';
import { processReferences } from '../../hooks/useReferenceProcessor';
import { CodeHeader } from '../../atoms/code-header';
import { CodeBlock } from '../../molecules/code-block';
import { ReferencePopover } from '../../atoms/reference-popover';
import type { ReactHighlightedCodeState } from '../../types';

// Border overlay component used by code-viewer, diff-viewer, multi-code-viewer
export function BorderOverlay({ borderStyle }: { borderStyle: CodeViewerBorderStyle }) {
  if (borderStyle === 'grid-cross') {
    return (
      <div className="border-overlay">
        <div className="border-top" /><div className="border-bottom" /><div className="border-left" /><div className="border-right" />
        <div className="corner-cross corner-top-left-h" /><div className="corner-cross corner-top-left-v" />
        <div className="corner-cross corner-top-right-h" /><div className="corner-cross corner-top-right-v" />
        <div className="corner-cross corner-bottom-left-h" /><div className="corner-cross corner-bottom-left-v" />
        <div className="corner-cross corner-bottom-right-h" /><div className="corner-cross corner-bottom-right-v" />
      </div>
    );
  }
  if (borderStyle === 'corner-intersection') {
    return (
      <div className="border-overlay">
        <div className="border-top-extended" /><div className="border-bottom-extended" />
        <div className="border-left-extended" /><div className="border-right-extended" />
      </div>
    );
  }
  return null;
}

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
  lineWidgets?: ReactLineWidgetsInput;
  onCodeCopied?: () => void;
  onReferenceClick?: (reference: ProcessedReference) => void;
  onReferenceHover?: (event: ReferenceHoverEvent) => void;
  onCollapsedRangeToggle?: (event: CollapsedRangeToggleEvent) => void;
  onLineWidgetClick?: (event: ReactLineWidgetClickEvent) => void;
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [highlightState, setHighlightState] = useState<ReactHighlightedCodeState>(highlighter.createInitialState());
  const [collapsedRangesState, setCollapsedRangesState] = useState<Map<string, CollapsedRangeState>>(new Map());
  const [activePopover, setActivePopover] = useState<{ reference: ProcessedReference; anchorElement: HTMLElement } | null>(null);

  const normalizedCode = useMemo(() => Array.isArray(code) ? code.join('\n') : code, [code]);
  const lineCount = useMemo(() => countLines(normalizedCode), [normalizedCode]);
  const highlightedLinesSet = useMemo(() => parseHighlightedLines(highlightedLines), [highlightedLines]);
  const focusedLinesSet = useMemo(() => parseHighlightedLines(focusedLines), [focusedLines]);

  // Highlight code
  useEffect(() => {
    abortControllerRef.current?.abort();

    if (!normalizedCode) {
      setHighlightState(highlighter.createInitialState());
      return;
    }

    if (normalizedCode.length > maxCodeLength) {
      setHighlightState(highlighter.createErrorState(new Error(`Code exceeds maximum allowed length of ${maxCodeLength} characters`)));
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setHighlightState(highlighter.createLoadingState());

    highlighter.highlightToHtml({
      code: normalizedCode,
      language,
      theme,
      signal: controller.signal,
      shikiTheme,
    }).then(result => {
      if (!controller.signal.aborted) setHighlightState(result);
    });

    return () => controller.abort();
  }, [normalizedCode, language, theme, shikiTheme, maxCodeLength]);

  // Initialize collapsed ranges
  useEffect(() => {
    const parsed = parseCollapsedRanges(collapsedLines);
    setCollapsedRangesState(createCollapsedRangesState(parsed));
  }, [collapsedLines]);

  // Process references
  const processedReferenceResult = useMemo(() => {
    const rawHtml = highlightState.rawHtml;
    if (!rawHtml || references.length === 0) return null;
    return processReferences(rawHtml, references);
  }, [highlightState.rawHtml, references]);

  const processedReferencesMap = useMemo(() => {
    return processedReferenceResult?.processedReferences ?? new Map<string, ProcessedReference>();
  }, [processedReferenceResult]);

  // Highlighted content with references
  const highlightedContent = useMemo(() => {
    if (processedReferenceResult) return processedReferenceResult.html;
    if (highlightState.html) return highlightState.html;
    if (normalizedCode) return highlighter.buildFallbackHtml(normalizedCode);
    return null;
  }, [highlightState.html, processedReferenceResult, normalizedCode]);

  const handleCopyClick = useCallback(async () => {
    const result = await copy(normalizedCode);
    if (result.success) onCodeCopied?.();
  }, [normalizedCode, copy, onCodeCopied]);

  const handleReferenceClick = useCallback((reference: ProcessedReference) => {
    if (reference.handle) {
      const lines = normalizedCode.split('\n');
      const line = lines[reference.lineNumber - 1] ?? '';
      reference.handle(line);
    }
    onReferenceClick?.(reference);
  }, [normalizedCode, onReferenceClick]);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleReferenceHover = useCallback((event: ReferenceHoverEvent) => {
    clearHoverTimeout();
    onReferenceHover?.(event);

    if (!event.reference.types.includes('info')) return;

    if (event.show) {
      hoverTimeoutRef.current = setTimeout(() => {
        setActivePopover({ reference: event.reference, anchorElement: event.element });
      }, 200);
    } else {
      hoverTimeoutRef.current = setTimeout(() => setActivePopover(null), 100);
    }
  }, [clearHoverTimeout, onReferenceHover]);

  const handlePopoverMouseEnter = useCallback(() => clearHoverTimeout(), [clearHoverTimeout]);
  const handlePopoverMouseLeave = useCallback(() => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => setActivePopover(null), 100);
  }, [clearHoverTimeout]);

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

  // Cleanup
  useEffect(() => () => { clearHoverTimeout(); abortControllerRef.current?.abort(); }, [clearHoverTimeout]);

  return (
    <div className="nx-code-viewer">
      <article className={`${theme} border-${borderStyle}`}>
        <BorderOverlay borderStyle={borderStyle} />

        {showHeader && (
          <CodeHeader language={language} title={title} theme={theme} fileExtension={fileExtension} />
        )}

        <CodeBlock
          content={highlightedContent}
          rawCode={normalizedCode}
          lineCount={lineCount}
          theme={theme}
          showLineNumbers={showLineNumbers}
          wordWrap={wordWrap}
          maxHeight={maxHeight}
          isLoading={highlightState.isLoading}
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
          onLineWidgetClick={onLineWidgetClick}
        />
      </article>

      {activePopover && (
        <ReferencePopover
          content={activePopover.reference.content ?? ''}
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
