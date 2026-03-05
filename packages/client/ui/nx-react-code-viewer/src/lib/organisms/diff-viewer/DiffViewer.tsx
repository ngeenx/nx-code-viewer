import React, { memo, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  DEFAULT_DIFF_VIEWER_CONFIG,
  parseDiff,
  computeDiff,
  getDiffStats,
  parseDiffCollapsedRanges,
  createDiffCollapsedRangesState,
  diffRangeToKey,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
  type CodeViewerTheme,
  type DiffCollapsedLinesInput,
  type DiffCollapsedRange,
  type DiffCollapsedRangeState,
  type DiffCollapsedRangeToggleEvent,
  type DiffHunk,
  type DiffLine,
  type DiffViewMode,
  type LineWidgetClickEvent,
  type LineWidgetsInput,
  type ParsedDiff,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import { useCodeHighlighter } from '../../hooks/useCodeHighlighter';
import { CodeHeader } from '../../atoms/code-header';
import { DiffBlock } from '../../molecules/diff-block';

interface DiffViewerProps {
  diff?: string;
  oldCode?: string;
  newCode?: string;
  viewMode?: DiffViewMode;
  language?: CodeViewerLanguage;
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  maxHeight?: string;
  oldFileName?: string;
  newFileName?: string;
  fileExtension?: string;
  borderStyle?: CodeViewerBorderStyle;
  collapsedLines?: DiffCollapsedLinesInput;
  lineWidgets?: LineWidgetsInput;
  onCollapsedRangeToggle?: (event: DiffCollapsedRangeToggleEvent) => void;
  onLineWidgetClick?: (event: LineWidgetClickEvent) => void;
}

export const DiffViewer = memo(function DiffViewer({
  diff = '',
  oldCode = '',
  newCode = '',
  viewMode = DEFAULT_DIFF_VIEWER_CONFIG.viewMode,
  language = DEFAULT_DIFF_VIEWER_CONFIG.language,
  theme = DEFAULT_DIFF_VIEWER_CONFIG.theme,
  shikiTheme,
  showLineNumbers = DEFAULT_DIFF_VIEWER_CONFIG.showLineNumbers,
  showHeader = DEFAULT_DIFF_VIEWER_CONFIG.showHeader,
  maxHeight = '',
  oldFileName = '',
  newFileName = '',
  fileExtension = '',
  borderStyle = 'classic',
  collapsedLines,
  lineWidgets,
  onCollapsedRangeToggle,
  onLineWidgetClick,
}: DiffViewerProps) {
  const highlighter = useCodeHighlighter();
  const [parsedDiff, setParsedDiff] = useState<ParsedDiff>({ hunks: [] });
  const [collapsedRangesState, setCollapsedRangesState] = useState<Map<string, DiffCollapsedRangeState>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const hunks = useMemo(() => parsedDiff.hunks, [parsedDiff]);
  const hasChanges = useMemo(() => parsedDiff.hunks.length > 0, [parsedDiff]);

  const displayTitle = useMemo(() => {
    const newFile = newFileName || parsedDiff.newFileName;
    const oldFile = oldFileName || parsedDiff.oldFileName;

    if (newFile && oldFile && newFile !== oldFile) {
      return `${oldFile} → ${newFile}`;
    }
    return newFile || oldFile || '';
  }, [newFileName, oldFileName, parsedDiff]);

  const stats = useMemo(() => getDiffStats(parsedDiff), [parsedDiff]);

  // Process diff
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let parsed: ParsedDiff;

    if (diff) {
      parsed = parseDiff(diff);
    } else if (oldCode || newCode) {
      parsed = computeDiff(oldCode, newCode);
    } else {
      setParsedDiff({ hunks: [] });
      return;
    }

    setParsedDiff(parsed);

    if (language === 'plaintext') return;

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const oldLines: string[] = [];
    const newLines: string[] = [];

    for (const hunk of parsed.hunks) {
      for (const line of hunk.lines) {
        if (line.type === 'removed' || line.type === 'unchanged') {
          oldLines.push(line.content);
        }
        if (line.type === 'added' || line.type === 'unchanged') {
          newLines.push(line.content);
        }
      }
    }

    Promise.all([
      highlighter.highlightLines({ code: oldLines.join('\n'), language, theme, signal, shikiTheme }),
      highlighter.highlightLines({ code: newLines.join('\n'), language, theme, signal, shikiTheme }),
    ]).then(([highlightedOldLines, highlightedNewLines]) => {
      if (signal.aborted) return;

      let oldIndex = 0;
      let newIndex = 0;

      const highlightedHunks: DiffHunk[] = parsed.hunks.map(hunk => ({
        ...hunk,
        lines: hunk.lines.map((line): DiffLine => {
          let highlightedContent: string | undefined;

          if (line.type === 'removed') {
            highlightedContent = highlightedOldLines[oldIndex++];
          } else if (line.type === 'added') {
            highlightedContent = highlightedNewLines[newIndex++];
          } else if (line.type === 'unchanged') {
            highlightedContent = highlightedOldLines[oldIndex++];
            newIndex++;
          }

          return highlightedContent ? { ...line, highlightedContent } : line;
        }),
      }));

      setParsedDiff({ ...parsed, hunks: highlightedHunks });
    });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [diff, oldCode, newCode, language, theme, shikiTheme]);

  // Initialize collapsed ranges
  useEffect(() => {
    const parsedRanges = parseDiffCollapsedRanges(collapsedLines);
    setCollapsedRangesState(createDiffCollapsedRangesState(parsedRanges));
  }, [collapsedLines]);

  const handleCollapsedRangeToggle = useCallback((range: DiffCollapsedRange) => {
    const key = diffRangeToKey(range);
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
    <div className="nx-diff-viewer">
      <article className={`${theme} border-${borderStyle}`}>
        {borderOverlay}

        {showHeader && (
          <CodeHeader
            language={language}
            title={displayTitle}
            theme={theme}
            fileExtension={fileExtension}
          />
        )}

        {hasChanges ? (
          <>
            <div className={`diff-stats ${theme}`}>
              <span className="stat added">+{stats.added}</span>
              <span className="stat removed">-{stats.removed}</span>
            </div>

            <DiffBlock
              hunks={hunks}
              theme={theme}
              viewMode={viewMode}
              showLineNumbers={showLineNumbers}
              maxHeight={maxHeight}
              collapsedRangesState={collapsedRangesState}
              lineWidgets={lineWidgets}
              onCollapsedRangeToggle={handleCollapsedRangeToggle}
              onLineWidgetClick={handleLineWidgetClick}
            />
          </>
        ) : (
          <div className={`no-changes ${theme}`}>No changes to display</div>
        )}
      </article>
    </div>
  );
});
