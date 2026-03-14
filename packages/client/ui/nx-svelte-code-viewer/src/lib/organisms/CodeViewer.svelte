<script lang="ts">
  import { onDestroy } from 'svelte';
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
  import type { SvelteHighlightedCodeState, SvelteLineWidgetsInput, SvelteLineWidgetClickEvent } from '../types/svelte-code-viewer.types';
  import { useClipboard } from '../composables/useClipboard';
  import { useCodeHighlighter } from '../composables/useCodeHighlighter';
  import { processReferences } from '../composables/referenceProcessor';
  import CodeHeader from '../atoms/CodeHeader.svelte';
  import ReferencePopover from '../atoms/ReferencePopover.svelte';
  import CodeBlock from '../molecules/CodeBlock.svelte';

  interface Props {
    code: string | string[];
    language?: CodeViewerLanguage;
    theme?: CodeViewerTheme;
    shikiTheme?: ShikiThemeName;
    title?: string;
    showLineNumbers?: boolean;
    enableLineHover?: boolean;
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
    lineWidgets?: SvelteLineWidgetsInput;
    onCodeCopied?: () => void;
    onReferenceClick?: (reference: ProcessedReference) => void;
    onReferenceHover?: (event: ReferenceHoverEvent) => void;
    onCollapsedRangeToggle?: (event: CollapsedRangeToggleEvent) => void;
    onLineWidgetClick?: (event: SvelteLineWidgetClickEvent) => void;
  }

  let {
    code,
    language = DEFAULT_CODE_VIEWER_CONFIG.language,
    theme = DEFAULT_CODE_VIEWER_CONFIG.theme,
    shikiTheme = undefined,
    title = DEFAULT_CODE_VIEWER_CONFIG.title,
    showLineNumbers = DEFAULT_CODE_VIEWER_CONFIG.showLineNumbers,
    enableLineHover = DEFAULT_CODE_VIEWER_CONFIG.enableLineHover,
    showCopyButton = DEFAULT_CODE_VIEWER_CONFIG.showCopyButton,
    showHeader = DEFAULT_CODE_VIEWER_CONFIG.showHeader,
    maxHeight = DEFAULT_CODE_VIEWER_CONFIG.maxHeight,
    wordWrap = DEFAULT_CODE_VIEWER_CONFIG.wordWrap,
    fileExtension = '',
    highlightedLines = undefined,
    focusedLines = undefined,
    collapsedLines = undefined,
    borderStyle = 'classic' as CodeViewerBorderStyle,
    references = [] as readonly ReferenceConfig[],
    maxCodeLength = 500_000,
    lineWidgets = [] as SvelteLineWidgetsInput,
    onCodeCopied = () => {},
    onReferenceClick = () => {},
    onReferenceHover = () => {},
    onCollapsedRangeToggle = () => {},
    onLineWidgetClick = () => {},
  }: Props = $props();

  // Instance management
  let instanceCounter = 0;
  const instanceId = `code-viewer-${++instanceCounter}`;
  let highlightAbortController: AbortController | null = null;
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  // Services
  const clipboard = useClipboard();
  const highlighter = useCodeHighlighter();

  // State
  let highlightState: SvelteHighlightedCodeState = $state(highlighter.createInitialState());
  let copyState = $state(clipboard.getCopyState(instanceId));
  let collapsedRangesState: Map<string, CollapsedRangeState> = $state(new Map());
  let activePopover: { reference: ProcessedReference; anchorElement: HTMLElement } | null = $state(null);

  // Computed
  const normalizedCode = $derived(
    Array.isArray(code) ? code.join('\n') : code
  );

  const lineCount = $derived(countLines(normalizedCode));

  const rawHighlightedContent = $derived.by(() => {
    if (highlightState.html) return highlightState.html;
    if (normalizedCode) return highlighter.createFallbackHtml(normalizedCode);
    return null;
  });

  const rawHtmlString = $derived.by(() => {
    if (highlightState.rawHtml) return highlightState.rawHtml;
    if (normalizedCode) return highlighter.buildFallbackHtmlString(normalizedCode);
    return null;
  });

  const processedReferenceResult = $derived.by(() => {
    if (!rawHtmlString || references.length === 0) return null;
    return processReferences(rawHtmlString, references);
  });

  const processedReferencesMap = $derived(
    processedReferenceResult?.processedReferences ?? new Map<string, ProcessedReference>()
  );

  const highlightedContent = $derived.by(() => {
    if (!rawHighlightedContent) return null;
    if (processedReferenceResult) return processedReferenceResult.html;
    return rawHighlightedContent;
  });

  const isLoading = $derived(highlightState.isLoading);

  const highlightedLinesSet = $derived(parseHighlightedLines(highlightedLines));
  const focusedLinesSet = $derived(parseHighlightedLines(focusedLines));

  // Effect: highlight code when inputs change
  $effect(() => {
    const codeValue = normalizedCode;
    const lang = language;
    const themeValue = theme;
    const shikiThemeValue = shikiTheme;

    highlightCode(codeValue, lang, themeValue, shikiThemeValue);
  });

  // Effect: update collapsed ranges when input changes
  $effect(() => {
    const input = collapsedLines;
    const parsedRanges = parseCollapsedRanges(input);
    collapsedRangesState = createCollapsedRangesState(parsedRanges);
  });

  async function highlightCode(
    codeStr: string,
    lang: CodeViewerLanguage,
    themeVal: CodeViewerTheme,
    shikiThemeVal?: ShikiThemeName
  ): Promise<void> {
    abortPendingHighlight();

    if (!codeStr) {
      highlightState = highlighter.createInitialState();
      return;
    }

    if (codeStr.length > maxCodeLength) {
      highlightState = highlighter.createErrorState(
        new Error(`Code exceeds maximum allowed length of ${maxCodeLength} characters`)
      );
      return;
    }

    highlightAbortController = new AbortController();
    const { signal } = highlightAbortController;

    highlightState = highlighter.createLoadingState();

    const result = await highlighter.highlightToHtml({
      code: codeStr,
      language: lang,
      theme: themeVal,
      signal,
      shikiTheme: shikiThemeVal,
    });

    if (!signal.aborted) {
      highlightState = result;
    }
  }

  function abortPendingHighlight(): void {
    if (highlightAbortController) {
      highlightAbortController.abort();
      highlightAbortController = null;
    }
  }

  async function copyCode(): Promise<void> {
    const result = await clipboard.copy(normalizedCode, instanceId);
    copyState = clipboard.getCopyState(instanceId);

    // Schedule reset
    setTimeout(() => {
      copyState = clipboard.getCopyState(instanceId);
    }, 2100);

    if (result.success) {
      onCodeCopied();
    }
  }

  function handleCopyClick(): void {
    void copyCode();
  }

  function handleReferenceClick(reference: ProcessedReference): void {
    if (reference.handle) {
      const codeValue = code;
      const codeString = Array.isArray(codeValue) ? codeValue.join('\n') : codeValue;
      const lines = codeString.split('\n');
      const line = lines[reference.lineNumber - 1] ?? '';
      reference.handle(line);
    }

    onReferenceClick(reference);
  }

  function handleCollapsedRangeToggle(range: LineRange): void {
    const key = rangeToKey(range);
    const rangeState = collapsedRangesState.get(key);

    if (rangeState) {
      const newIsExpanded = !rangeState.isExpanded;
      const newState = new Map(collapsedRangesState);
      newState.set(key, { ...rangeState, isExpanded: newIsExpanded });
      collapsedRangesState = newState;

      onCollapsedRangeToggle({ range, isExpanded: newIsExpanded });
    }
  }

  function handleReferenceHover(event: ReferenceHoverEvent): void {
    clearHoverTimeout();
    onReferenceHover(event);

    if (!event.reference.types.includes('info')) return;

    if (event.show) {
      hoverTimeout = setTimeout(() => {
        activePopover = {
          reference: event.reference,
          anchorElement: event.element,
        };
      }, 200);
    } else {
      hoverTimeout = setTimeout(() => {
        activePopover = null;
      }, 100);
    }
  }

  function onPopoverMouseEnter(): void {
    clearHoverTimeout();
  }

  function onPopoverMouseLeave(): void {
    clearHoverTimeout();
    hoverTimeout = setTimeout(() => {
      activePopover = null;
    }, 100);
  }

  function clearHoverTimeout(): void {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  }

  onDestroy(() => {
    abortPendingHighlight();
    clearHoverTimeout();
    clipboard.cleanup(instanceId);
  });
</script>

<div class="nx-code-viewer">
  <article class="{theme} border-{borderStyle}">
    {#if borderStyle === 'grid-cross'}
      <div class="border-overlay">
        <div class="border-top"></div>
        <div class="border-bottom"></div>
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="corner-cross corner-top-left-h"></div>
        <div class="corner-cross corner-top-left-v"></div>
        <div class="corner-cross corner-top-right-h"></div>
        <div class="corner-cross corner-top-right-v"></div>
        <div class="corner-cross corner-bottom-left-h"></div>
        <div class="corner-cross corner-bottom-left-v"></div>
        <div class="corner-cross corner-bottom-right-h"></div>
        <div class="corner-cross corner-bottom-right-v"></div>
      </div>
    {/if}

    {#if borderStyle === 'corner-intersection'}
      <div class="border-overlay">
        <div class="border-top-extended"></div>
        <div class="border-bottom-extended"></div>
        <div class="border-left-extended"></div>
        <div class="border-right-extended"></div>
      </div>
    {/if}

    {#if showHeader}
      <CodeHeader
        {language}
        {title}
        {theme}
        {fileExtension}
      />
    {/if}

    <CodeBlock
      content={highlightedContent}
      rawCode={normalizedCode}
      {lineCount}
      {theme}
      {showLineNumbers}
      {enableLineHover}
      {wordWrap}
      {maxHeight}
      {isLoading}
      {showCopyButton}
      {copyState}
      copyClick={handleCopyClick}
      {highlightedLinesSet}
      {focusedLinesSet}
      {collapsedRangesState}
      processedReferences={processedReferencesMap}
      {lineWidgets}
      onReferenceClick={handleReferenceClick}
      onReferenceHover={handleReferenceHover}
      onCollapsedRangeToggle={handleCollapsedRangeToggle}
      onLineWidgetClick={onLineWidgetClick}
    />
  </article>

  {#if activePopover}
    <ReferencePopover
      content={activePopover.reference.content ?? ''}
      anchorElement={activePopover.anchorElement}
      {theme}
      visible={true}
      matchedText={activePopover.reference.matchedText}
      captureGroups={activePopover.reference.captureGroups}
      lineNumber={activePopover.reference.lineNumber}
      onMouseEnter={onPopoverMouseEnter}
      onMouseLeave={onPopoverMouseLeave}
    />
  {/if}
</div>
