<script lang="ts">
  import { onDestroy } from 'svelte';
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
    type DiffViewMode,
    type ParsedDiff,
    type ShikiThemeName,
    type ShikiThemePair,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useCodeHighlighter } from '../composables/useCodeHighlighter';
  import CodeHeader from '../atoms/CodeHeader.svelte';
  import DiffBlock from '../molecules/DiffBlock.svelte';

  interface Props {
    diff?: string;
    oldCode?: string;
    newCode?: string;
    viewMode?: DiffViewMode;
    language?: CodeViewerLanguage;
    theme?: CodeViewerTheme;
    shikiTheme?: ShikiThemeName;
    /**
     * Paired Shiki themes for automatic light/dark swapping. Lower
     * precedence than `shikiTheme`; the variant matching the current
     * `theme` is used. Missing slots fall back to `github-dark` /
     * `github-light` defaults.
     */
    shikiThemes?: ShikiThemePair;
    showLineNumbers?: boolean;
    showHeader?: boolean;
    maxHeight?: string;
    oldFileName?: string;
    newFileName?: string;
    fileExtension?: string;
    borderStyle?: CodeViewerBorderStyle;
    collapsedLines?: DiffCollapsedLinesInput;
    onCollapsedRangeToggle?: (event: DiffCollapsedRangeToggleEvent) => void;
  }

  let {
    diff = '',
    oldCode = '',
    newCode = '',
    viewMode = DEFAULT_DIFF_VIEWER_CONFIG.viewMode,
    language = DEFAULT_DIFF_VIEWER_CONFIG.language,
    theme = DEFAULT_DIFF_VIEWER_CONFIG.theme,
    shikiTheme = undefined,
    shikiThemes = undefined,
    showLineNumbers = DEFAULT_DIFF_VIEWER_CONFIG.showLineNumbers,
    showHeader = DEFAULT_DIFF_VIEWER_CONFIG.showHeader,
    maxHeight = '',
    oldFileName = '',
    newFileName = '',
    fileExtension = '',
    borderStyle = 'classic' as CodeViewerBorderStyle,
    collapsedLines = undefined,
    onCollapsedRangeToggle = () => {},
  }: Props = $props();

  const highlighter = useCodeHighlighter();
  let parsedDiff: ParsedDiff = $state({ hunks: [] });
  let collapsedRangesState: Map<string, DiffCollapsedRangeState> = $state(new Map());
  let highlightAbortController: AbortController | null = null;

  const hunks = $derived(parsedDiff.hunks);
  const hasChanges = $derived(parsedDiff.hunks.length > 0);
  const stats = $derived(getDiffStats(parsedDiff));

  const displayTitle = $derived.by(() => {
    const newFile = newFileName || parsedDiff.newFileName;
    const oldFile = oldFileName || parsedDiff.oldFileName;
    if (newFile && oldFile && newFile !== oldFile) return `${oldFile} → ${newFile}`;
    return newFile || oldFile || '';
  });

  $effect(() => {
    const d = diff;
    const oc = oldCode;
    const nc = newCode;
    const lang = language;
    const th = theme;
    const st = shikiTheme;
    const sts = shikiThemes;
    void processDiff(d, oc, nc, lang, th, st, sts);
  });

  $effect(() => {
    const input = collapsedLines;
    const parsedRanges = parseDiffCollapsedRanges(input);
    collapsedRangesState = createDiffCollapsedRangesState(parsedRanges);
  });

  onDestroy(() => {
    abortPendingHighlight();
  });

  async function processDiff(
    diffValue: string,
    oldCodeValue: string,
    newCodeValue: string,
    lang: CodeViewerLanguage,
    th: CodeViewerTheme,
    shikiTh?: ShikiThemeName,
    shikiThs?: ShikiThemePair
  ): Promise<void> {
    abortPendingHighlight();

    let parsed: ParsedDiff;

    if (diffValue) {
      parsed = parseDiff(diffValue);
    } else if (oldCodeValue || newCodeValue) {
      parsed = computeDiff(oldCodeValue, newCodeValue);
    } else {
      parsedDiff = { hunks: [] };
      return;
    }

    parsedDiff = parsed;

    if (lang === 'plaintext') return;

    highlightAbortController = new AbortController();
    const { signal } = highlightAbortController;

    const oldLines: string[] = [];
    const newLines: string[] = [];

    for (const hunk of parsed.hunks) {
      for (const line of hunk.lines) {
        if (line.type === 'removed' || line.type === 'unchanged') oldLines.push(line.content);
        if (line.type === 'added' || line.type === 'unchanged') newLines.push(line.content);
      }
    }

    const [highlightedOldLines, highlightedNewLines] = await Promise.all([
      highlighter.highlightLines({ code: oldLines.join('\n'), language: lang, theme: th, signal, shikiTheme: shikiTh, shikiThemes: shikiThs }),
      highlighter.highlightLines({ code: newLines.join('\n'), language: lang, theme: th, signal, shikiTheme: shikiTh, shikiThemes: shikiThs }),
    ]);

    if (signal.aborted) return;

    parsedDiff = {
      ...parsed,
      hunks: applyHighlighting(parsed.hunks, highlightedOldLines, highlightedNewLines),
    };
  }

  function applyHighlighting(hunksList: any[], oldLines: string[], newLines: string[]): any[] {
    let oldIndex = 0;
    let newIndex = 0;

    return hunksList.map(hunk => ({
      ...hunk,
      lines: hunk.lines.map((line: any) => {
        let highlightedContent: string | undefined;

        if (line.type === 'removed') highlightedContent = oldLines[oldIndex++];
        else if (line.type === 'added') highlightedContent = newLines[newIndex++];
        else if (line.type === 'unchanged') {
          highlightedContent = oldLines[oldIndex++];
          newIndex++;
        }

        return highlightedContent ? { ...line, highlightedContent } : line;
      }),
    }));
  }

  function abortPendingHighlight(): void {
    if (highlightAbortController) {
      highlightAbortController.abort();
      highlightAbortController = null;
    }
  }

  function handleCollapsedRangeToggle(range: DiffCollapsedRange): void {
    const key = diffRangeToKey(range);
    const rangeState = collapsedRangesState.get(key);

    if (rangeState) {
      const newIsExpanded = !rangeState.isExpanded;
      const newState = new Map(collapsedRangesState);
      newState.set(key, { ...rangeState, isExpanded: newIsExpanded });
      collapsedRangesState = newState;
      onCollapsedRangeToggle({ range, isExpanded: newIsExpanded });
    }
  }
</script>

<div class="nx-diff-viewer">
  <article class="{theme} border-{borderStyle}">
    {#if borderStyle === 'grid-cross'}
      <div class="border-overlay">
        <div class="border-top"></div><div class="border-bottom"></div><div class="border-left"></div><div class="border-right"></div>
        <div class="corner-cross corner-top-left-h"></div><div class="corner-cross corner-top-left-v"></div>
        <div class="corner-cross corner-top-right-h"></div><div class="corner-cross corner-top-right-v"></div>
        <div class="corner-cross corner-bottom-left-h"></div><div class="corner-cross corner-bottom-left-v"></div>
        <div class="corner-cross corner-bottom-right-h"></div><div class="corner-cross corner-bottom-right-v"></div>
      </div>
    {/if}

    {#if borderStyle === 'corner-intersection'}
      <div class="border-overlay">
        <div class="border-top-extended"></div><div class="border-bottom-extended"></div><div class="border-left-extended"></div><div class="border-right-extended"></div>
      </div>
    {/if}

    {#if showHeader}
      <CodeHeader
        {language}
        title={displayTitle}
        {theme}
        {fileExtension}
      />
    {/if}

    {#if hasChanges}
      <div class="diff-stats {theme}">
        <span class="stat added">+{stats.added}</span>
        <span class="stat removed">-{stats.removed}</span>
      </div>

      <DiffBlock
        {hunks}
        {theme}
        {viewMode}
        {showLineNumbers}
        {maxHeight}
        {collapsedRangesState}
        onCollapsedRangeToggle={handleCollapsedRangeToggle}
      />
    {:else}
      <div class="no-changes {theme}">No changes to display</div>
    {/if}
  </article>
</div>
