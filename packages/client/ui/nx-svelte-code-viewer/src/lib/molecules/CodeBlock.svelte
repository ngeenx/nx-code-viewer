<script lang="ts">
  import type {
    CodeViewerTheme,
    CollapsedRangeState,
    LineRange,
    ProcessedReference,
    ReferenceHoverEvent,
    CopyButtonState,
  } from '@ngeenx/nx-code-viewer-utils';
  import type { SvelteLineWidgetsInput, SvelteLineWidgetClickEvent, SvelteActiveInsertWidget } from '../types/svelte-code-viewer.types';
  import CopyButton from '../atoms/CopyButton.svelte';
  import LineNumbers from '../atoms/LineNumbers.svelte';
  import CodeContent from '../atoms/CodeContent.svelte';

  interface Props {
    content: string | null;
    rawCode?: string;
    lineCount: number;
    theme?: CodeViewerTheme;
    showLineNumbers?: boolean;
    wordWrap?: boolean;
    maxHeight?: string;
    isLoading?: boolean;
    showCopyButton?: boolean;
    copyState?: CopyButtonState;
    copyClick?: () => void;
    highlightedLinesSet?: Set<number>;
    focusedLinesSet?: Set<number>;
    collapsedRangesState?: Map<string, CollapsedRangeState>;
    processedReferences?: Map<string, ProcessedReference>;
    lineWidgets?: SvelteLineWidgetsInput;
    onReferenceClick?: (reference: ProcessedReference) => void;
    onReferenceHover?: (event: ReferenceHoverEvent) => void;
    onCollapsedRangeToggle?: (range: LineRange) => void;
    onLineWidgetClick?: (event: SvelteLineWidgetClickEvent) => void;
  }

  let {
    content,
    rawCode = '',
    lineCount,
    theme = 'dark',
    showLineNumbers = true,
    wordWrap = false,
    maxHeight = '',
    isLoading = false,
    showCopyButton = true,
    copyState = 'idle',
    copyClick = () => {},
    highlightedLinesSet = new Set<number>(),
    focusedLinesSet = new Set<number>(),
    collapsedRangesState = new Map(),
    processedReferences = new Map(),
    lineWidgets = [],
    onReferenceClick = () => {},
    onReferenceHover = () => {},
    onCollapsedRangeToggle = () => {},
    onLineWidgetClick = () => {},
  }: Props = $props();

  let hoveredLine = $state(0);
  let activeInsertWidget: SvelteActiveInsertWidget | null = $state(null);
  let insertWidgetHeight = $state(0);

  const containerStyle = $derived(
    maxHeight ? `max-height: ${maxHeight}; overflow: auto;` : ''
  );

  function onLineHover(lineNumber: number): void {
    hoveredLine = lineNumber;
  }

  function handleLineWidgetClick(event: SvelteLineWidgetClickEvent): void {
    const currentActive = activeInsertWidget;

    if (
      currentActive &&
      currentActive.lineNumber === event.lineNumber &&
      currentActive.widget === event.widget
    ) {
      // Same widget clicked, close it
      activeInsertWidget = null;
    } else if (event.widget.insertComponent) {
      // Different widget with insert component, open it
      activeInsertWidget = {
        lineNumber: event.lineNumber,
        widget: event.widget,
        line: event.line,
      };
    }

    onLineWidgetClick(event);
  }

  function handleInsertWidgetClose(): void {
    activeInsertWidget = null;
  }

  function handleInsertWidgetHeightChange(height: number): void {
    insertWidgetHeight = height;
  }
</script>

<div class="nx-code-block">
  <div class="code-block-wrapper">
    {#if showCopyButton}
      <div class="copy-button">
        <CopyButton
          state={copyState}
          {theme}
          disabled={isLoading}
          onCopyClick={copyClick}
        />
      </div>
    {/if}

    <div class="code-block-container" style={containerStyle} onmouseleave={() => onLineHover(0)}>
      {#if showLineNumbers}
        <LineNumbers
          {lineCount}
          {theme}
          {hoveredLine}
          {highlightedLinesSet}
          {collapsedRangesState}
          {activeInsertWidget}
          {insertWidgetHeight}
          {onLineHover}
          {onCollapsedRangeToggle}
        />
      {/if}

      <CodeContent
        {content}
        {rawCode}
        {theme}
        {wordWrap}
        {isLoading}
        {hoveredLine}
        {highlightedLinesSet}
        {focusedLinesSet}
        {collapsedRangesState}
        {processedReferences}
        {lineWidgets}
        {activeInsertWidget}
        {onReferenceClick}
        {onReferenceHover}
        {onCollapsedRangeToggle}
        onLineWidgetClick={handleLineWidgetClick}
        onInsertWidgetClose={handleInsertWidgetClose}
        onInsertWidgetHeightChange={handleInsertWidgetHeightChange}
        onLineHover={onLineHover}
      />
    </div>
  </div>
</div>
