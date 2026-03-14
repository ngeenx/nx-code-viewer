<script lang="ts">
  import {
    toSplitViewLines,
    isDiffLineInCollapsedRange,
    type CodeViewerTheme,
    type DiffCollapsedRange,
    type DiffCollapsedRangeState,
    type DiffHunk,
    type DiffLine as DiffLineType,
    type DiffViewMode,
  } from '@ngeenx/nx-code-viewer-utils';
  import DiffLine from '../atoms/DiffLine.svelte';
  import DiffCollapsedIndicator from '../atoms/DiffCollapsedIndicator.svelte';

  interface Props {
    hunks: readonly DiffHunk[];
    theme?: CodeViewerTheme;
    viewMode?: DiffViewMode;
    showLineNumbers?: boolean;
    maxHeight?: string;
    collapsedRangesState?: Map<string, DiffCollapsedRangeState>;
    onCollapsedRangeToggle?: (range: DiffCollapsedRange) => void;
  }

  let {
    hunks,
    theme = 'dark',
    viewMode = 'unified',
    showLineNumbers = true,
    maxHeight = '',
    collapsedRangesState = new Map(),
    onCollapsedRangeToggle = () => {},
  }: Props = $props();

  let hoveredLineIndex = $state(-1);

  const containerStyle = $derived(maxHeight ? `max-height: ${maxHeight}; overflow: auto;` : '');
  const isUnifiedView = $derived(viewMode === 'unified');

  const unifiedViewData = $derived.by(() => {
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
  });

  const splitViewHunks = $derived.by(() => {
    let globalIndex = 0;
    return hunks.map(hunk => {
      const lines = toSplitViewLines(hunk.lines).map(pair => {
        const result = { ...pair, globalIndex };
        globalIndex++;
        return result;
      });
      return { header: hunk.header, lines };
    });
  });

  function getLineCollapseInfo(globalIndex: number) {
    return isDiffLineInCollapsedRange(globalIndex, collapsedRangesState);
  }

  function isLineVisible(globalIndex: number): boolean {
    const info = getLineCollapseInfo(globalIndex);
    return !info.isCollapsed || info.isFirstLine;
  }

  function onLineHover(lineIndex: number): void {
    hoveredLineIndex = lineIndex;
  }

  function onMouseLeave(): void {
    hoveredLineIndex = -1;
  }
</script>

<div class="nx-diff-block">
  <div class="diff-block-container {theme}" style={containerStyle} onmouseleave={onMouseLeave}>
    {#if isUnifiedView}
      {#each unifiedViewData as hunk}
        <div class="hunk">
          <div class="hunk-header">{hunk.header}</div>
          {#each hunk.lines as item (item.globalIndex)}
            {#if isLineVisible(item.globalIndex)}
              <DiffLine
                line={item.line}
                {theme}
                {showLineNumbers}
                showPrefix={true}
                lineIndex={item.globalIndex}
                isHighlighted={hoveredLineIndex === item.globalIndex}
                {onLineHover}
              />

              {@const collapseInfo = getLineCollapseInfo(item.globalIndex)}
              {#if collapseInfo.isFirstLine && collapseInfo.range}
                <DiffCollapsedIndicator
                  {theme}
                  range={collapseInfo.range}
                  hiddenCount={collapseInfo.hiddenCount}
                  {showLineNumbers}
                  showPrefix={true}
                  onToggle={() => onCollapsedRangeToggle(collapseInfo.range)}
                />
              {/if}
            {/if}
          {/each}
        </div>
      {/each}
    {:else}
      {#each splitViewHunks as hunk, hi}
        <div class="hunk">
          <div class="hunk-header">{hunk.header}</div>
          <div class="split-container">
            <div class="split-pane left">
              {#each hunk.lines as pair (pair.globalIndex)}
                {#if isLineVisible(pair.globalIndex)}
                  {#if pair.left}
                    <DiffLine
                      line={pair.left}
                      {theme}
                      {showLineNumbers}
                      showPrefix={false}
                      lineIndex={pair.globalIndex}
                      isHighlighted={hoveredLineIndex === pair.globalIndex}
                      {onLineHover}
                    />
                  {:else}
                    <div class="empty-line"></div>
                  {/if}

                  {@const collapseInfo = getLineCollapseInfo(pair.globalIndex)}
                  {#if collapseInfo.isFirstLine && collapseInfo.range}
                    <DiffCollapsedIndicator
                      {theme}
                      range={collapseInfo.range}
                      hiddenCount={collapseInfo.hiddenCount}
                      {showLineNumbers}
                      showPrefix={false}
                      onToggle={() => onCollapsedRangeToggle(collapseInfo.range)}
                    />
                  {/if}
                {/if}
              {/each}
            </div>
            <div class="split-pane right">
              {#each hunk.lines as pair (pair.globalIndex)}
                {#if isLineVisible(pair.globalIndex)}
                  {#if pair.right}
                    <DiffLine
                      line={pair.right}
                      {theme}
                      {showLineNumbers}
                      showPrefix={false}
                      lineIndex={pair.globalIndex}
                      isHighlighted={hoveredLineIndex === pair.globalIndex}
                      {onLineHover}
                    />
                  {:else}
                    <div class="empty-line"></div>
                  {/if}

                  {@const collapseInfo = getLineCollapseInfo(pair.globalIndex)}
                  {#if collapseInfo.isFirstLine && collapseInfo.range}
                    <DiffCollapsedIndicator
                      {theme}
                      range={collapseInfo.range}
                      hiddenCount={collapseInfo.hiddenCount}
                      {showLineNumbers}
                      showPrefix={false}
                      onToggle={() => onCollapsedRangeToggle(collapseInfo.range)}
                    />
                  {/if}
                {/if}
              {/each}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
