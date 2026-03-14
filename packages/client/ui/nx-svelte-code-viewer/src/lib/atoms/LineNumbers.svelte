<script lang="ts">
  import {
    generateLineNumbers,
    formatLineNumber,
    isLineHighlighted,
    isLineInCollapsedRange,
    type CodeViewerTheme,
    type CollapsedRangeState,
    type LineRange,
  } from '@ngeenx/nx-code-viewer-utils';
  import type { SvelteActiveInsertWidget } from '../types/svelte-code-viewer.types';

  interface Props {
    lineCount: number;
    theme?: CodeViewerTheme;
    hoveredLine?: number;
    highlightedLinesSet?: Set<number>;
    collapsedRangesState?: Map<string, CollapsedRangeState>;
    activeInsertWidget?: SvelteActiveInsertWidget | null;
    insertWidgetHeight?: number;
    onLineHover?: (lineNumber: number) => void;
    onCollapsedRangeToggle?: (range: LineRange) => void;
  }

  let {
    lineCount,
    theme = 'dark',
    hoveredLine = 0,
    highlightedLinesSet = new Set<number>(),
    collapsedRangesState = new Map(),
    activeInsertWidget = null,
    insertWidgetHeight = 0,
    onLineHover = () => {},
    onCollapsedRangeToggle = () => {},
  }: Props = $props();

  const lineNumbers = $derived(generateLineNumbers(lineCount));

  function getLineCollapseInfo(lineNumber: number) {
    return isLineInCollapsedRange(lineNumber, collapsedRangesState);
  }

  function isLineVisible(lineNumber: number): boolean {
    const info = getLineCollapseInfo(lineNumber);
    return !info.isCollapsed || info.isFirstLine;
  }

  function isHovered(lineNumber: number): boolean {
    return lineNumber === hoveredLine;
  }

  function isHighlighted(lineNumber: number): boolean {
    return isLineHighlighted(lineNumber, highlightedLinesSet);
  }

  function hasInsertWidgetAfter(lineNumber: number): boolean {
    return activeInsertWidget?.lineNumber === lineNumber;
  }
</script>

<div class="line-numbers-container {theme}" aria-hidden="true">
  {#each lineNumbers as lineNumber (lineNumber)}
    {@const collapseInfo = getLineCollapseInfo(lineNumber)}
    {#if isLineVisible(lineNumber)}
      <div
        class="line-number"
        class:hovered={isHovered(lineNumber)}
        class:highlighted={isHighlighted(lineNumber)}
        class:collapsed-first={collapseInfo.isFirstLine}
        onmouseenter={() => onLineHover(lineNumber)}
      >
        {formatLineNumber(lineNumber, lineCount)}
      </div>

      {#if collapseInfo.isFirstLine && collapseInfo.range}
        <div
          class="line-number collapse-indicator"
          role="button"
          tabindex="0"
          aria-label="Expand {collapseInfo.hiddenCount} hidden lines"
          onclick={() => onCollapsedRangeToggle(collapseInfo.range)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCollapsedRangeToggle(collapseInfo.range);
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      {/if}

      {#if hasInsertWidgetAfter(lineNumber)}
        <div
          class="insert-widget-placeholder"
          style="height: {insertWidgetHeight}px"
        ></div>
      {/if}
    {/if}
  {/each}
</div>
