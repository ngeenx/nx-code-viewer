import { memo, useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  type ParsedDiff,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import type { ReactLineWidgetsInput, ReactLineWidgetClickEvent } from '../../types';
import { useCodeHighlighter } from '../../hooks/useCodeHighlighter';
import { CodeHeader } from '../../atoms/code-header';
import { DiffBlock } from '../../molecules/diff-block';
import { BorderOverlay } from '../code-viewer';

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
  lineWidgets?: ReactLineWidgetsInput;
  onCollapsedRangeToggle?: (event: DiffCollapsedRangeToggleEvent) => void;
  onLineWidgetClick?: (event: ReactLineWidgetClickEvent) => void;
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const [parsedDiff, setParsedDiff] = useState<ParsedDiff>({ hunks: [] });
  const [collapsedRangesState, setCollapsedRangesState] = useState<Map<string, DiffCollapsedRangeState>>(new Map());

  const hunks = parsedDiff.hunks;
  const hasChanges = hunks.length > 0;

  const displayTitle = useMemo(() => {
    const nf = newFileName || parsedDiff.newFileName;
    const of = oldFileName || parsedDiff.oldFileName;
    if (nf && of && nf !== of) return `${of} → ${nf}`;
    return nf || of || '';
  }, [newFileName, oldFileName, parsedDiff]);

  const stats = useMemo(() => getDiffStats(parsedDiff), [parsedDiff]);

  // Process diff
  useEffect(() => {
    abortControllerRef.current?.abort();

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

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const oldLines: string[] = [];
    const newLines: string[] = [];
    for (const hunk of parsed.hunks) {
      for (const line of hunk.lines) {
        if (line.type === 'removed' || line.type === 'unchanged') oldLines.push(line.content);
        if (line.type === 'added' || line.type === 'unchanged') newLines.push(line.content);
      }
    }

    Promise.all([
      highlighter.highlightLines({ code: oldLines.join('\n'), language, theme, signal: controller.signal, shikiTheme }),
      highlighter.highlightLines({ code: newLines.join('\n'), language, theme, signal: controller.signal, shikiTheme }),
    ]).then(([highlightedOldLines, highlightedNewLines]) => {
      if (controller.signal.aborted) return;

      let oldIndex = 0;
      let newIndex = 0;

      const highlightedHunks: DiffHunk[] = parsed.hunks.map(hunk => ({
        ...hunk,
        lines: hunk.lines.map((line): DiffLine => {
          let highlightedContent: string | undefined;
          if (line.type === 'removed') highlightedContent = highlightedOldLines[oldIndex++];
          else if (line.type === 'added') highlightedContent = highlightedNewLines[newIndex++];
          else if (line.type === 'unchanged') { highlightedContent = highlightedOldLines[oldIndex++]; newIndex++; }
          return highlightedContent ? { ...line, highlightedContent } : line;
        }),
      }));

      setParsedDiff({ ...parsed, hunks: highlightedHunks });
    });

    return () => controller.abort();
  }, [diff, oldCode, newCode, language, theme, shikiTheme]);

  // Initialize collapsed ranges
  useEffect(() => {
    const parsed = parseDiffCollapsedRanges(collapsedLines);
    setCollapsedRangesState(createDiffCollapsedRangesState(parsed));
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

  useEffect(() => () => { abortControllerRef.current?.abort(); }, []);

  return (
    <div className="nx-diff-viewer">
      <article className={`${theme} border-${borderStyle}`}>
        <BorderOverlay borderStyle={borderStyle} />

        {showHeader && (
          <CodeHeader language={language} title={displayTitle} theme={theme} fileExtension={fileExtension} />
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
              onLineWidgetClick={onLineWidgetClick}
            />
          </>
        ) : (
          <div className={`no-changes ${theme}`}>No changes to display</div>
        )}
      </article>
    </div>
  );
});
