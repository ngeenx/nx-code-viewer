<script lang="ts">
  import { onDestroy, mount, unmount, type Component } from 'svelte';
  import {
    isLineInCollapsedRange,
    isLineHighlighted,
    getMatchingWidgets,
    type CodeViewerTheme,
    type CollapsedRangeState,
    type LineRange,
    type LineWidgetContext,
    type ProcessedReference,
    type ReferenceHoverEvent,
  } from '@ngeenx/nx-code-viewer-utils';
  import type {
    SvelteLineWidgetsInput,
    SvelteLineWidgetConfig,
    SvelteLineWidgetClickEvent,
    SvelteActiveInsertWidget,
  } from '../types/svelte-code-viewer.types';

  interface LineWidgetRenderData {
    readonly lineNumber: number;
    readonly lineText: string;
    readonly lineElement: Element;
    readonly widgets: SvelteLineWidgetConfig[];
    readonly context: LineWidgetContext;
    readonly top: number;
    readonly height: number;
  }

  interface Props {
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
    lineWidgets?: SvelteLineWidgetsInput;
    activeInsertWidget?: SvelteActiveInsertWidget | null;
    onLineHover?: (lineNumber: number) => void;
    onReferenceClick?: (reference: ProcessedReference) => void;
    onReferenceHover?: (event: ReferenceHoverEvent) => void;
    onCollapsedRangeToggle?: (range: LineRange) => void;
    onLineWidgetClick?: (event: SvelteLineWidgetClickEvent) => void;
    onInsertWidgetClose?: () => void;
    onInsertWidgetHeightChange?: (height: number) => void;
  }

  let {
    content,
    rawCode = '',
    theme = 'dark',
    wordWrap = false,
    isLoading = false,
    hoveredLine = 0,
    highlightedLinesSet = new Set<number>(),
    focusedLinesSet = new Set<number>(),
    collapsedRangesState = new Map(),
    processedReferences = new Map(),
    lineWidgets = [],
    activeInsertWidget = null,
    onLineHover = () => {},
    onReferenceClick = () => {},
    onReferenceHover = () => {},
    onCollapsedRangeToggle = () => {},
    onLineWidgetClick = () => {},
    onInsertWidgetClose = () => {},
    onInsertWidgetHeightChange = () => {},
  }: Props = $props();

  let wrapperRef: HTMLElement | null = $state(null);
  let codeRef: HTMLElement | null = $state(null);
  let currentBlurGroup: string | null = null;
  let hoverWidgetData: LineWidgetRenderData | null = $state(null);
  let alwaysWidgetData: LineWidgetRenderData[] = $state([]);

  // Insert widget state
  let insertWidgetInstance: Record<string, any> | null = null;
  let insertWidgetContainer: HTMLElement | null = null;
  let insertWidgetResizeObserver: ResizeObserver | null = null;

  const containerClasses = $derived(
    `${theme} ${wordWrap ? 'wrap' : 'nowrap'}`
  );

  const leftHoverWidgets = $derived(
    hoverWidgetData
      ? hoverWidgetData.widgets.filter(w => w.position === 'left' && w.display === 'hover')
      : []
  );

  const rightHoverWidgets = $derived(
    hoverWidgetData
      ? hoverWidgetData.widgets.filter(w => w.position === 'right' && w.display === 'hover')
      : []
  );

  // Effect: update line styles
  $effect(() => {
    if (!codeRef || !content) return;
    const _hovered = hoveredLine;
    const _highlighted = highlightedLinesSet;
    const _focused = focusedLinesSet;
    const _collapsed = collapsedRangesState;
    const _theme = theme;

    requestAnimationFrame(() => {
      updateLineStyles();
    });
  });

  // Effect: update hover widgets
  $effect(() => {
    if (!codeRef || !content) return;
    const _line = hoveredLine;
    const _widgets = lineWidgets;
    const _raw = rawCode;
    const _theme = theme;
    const _insert = activeInsertWidget;

    requestAnimationFrame(() => {
      updateHoverWidgets();
    });
  });

  // Effect: update always-visible widgets
  $effect(() => {
    if (!codeRef || !content) return;
    const _widgets = lineWidgets;
    const _raw = rawCode;
    const _theme = theme;
    const _insert = activeInsertWidget;

    requestAnimationFrame(() => {
      updateAlwaysWidgets();
    });
  });

  // Effect: update inline insert widget
  $effect(() => {
    if (!codeRef) return;
    const _insert = activeInsertWidget;
    const _theme = theme;
    const _content = content;

    requestAnimationFrame(() => {
      updateInlineInsertWidget();
    });
  });

  function updateLineStyles(): void {
    if (!codeRef) return;

    const lines = codeRef.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)');
    const hasFocused = focusedLinesSet && focusedLinesSet.size > 0;
    const hasCollapsed = collapsedRangesState && collapsedRangesState.size > 0;

    codeRef.querySelectorAll('.nx-collapse-indicator').forEach(el => el.remove());

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const el = line as HTMLElement;
      el.style.position = 'relative';

      if (hasCollapsed) {
        const collapseInfo = isLineInCollapsedRange(lineNumber, collapsedRangesState);
        if (collapseInfo.isCollapsed && !collapseInfo.isFirstLine) {
          el.classList.add('collapsed-hidden');
          return;
        } else {
          el.classList.remove('collapsed-hidden');
        }
        if (collapseInfo.isFirstLine && collapseInfo.range) {
          insertCollapseIndicator(el, collapseInfo.range, collapseInfo.hiddenCount);
        }
      } else {
        el.classList.remove('collapsed-hidden');
      }

      el.classList.toggle('hovered', lineNumber === hoveredLine);
      el.classList.toggle('highlighted', isLineHighlighted(lineNumber, highlightedLinesSet));

      const isUnfocused = hasFocused && !focusedLinesSet.has(lineNumber);
      el.classList.toggle('unfocused', isUnfocused);
    });

    // Assign blur groups
    let blurGroupId = 0;
    let inBlurGroup = false;
    lines.forEach((line) => {
      const el = line as HTMLElement;
      if (el.classList.contains('collapsed-hidden')) return;
      if (el.classList.contains('unfocused')) {
        if (!inBlurGroup) { blurGroupId++; inBlurGroup = true; }
        el.dataset.blurGroup = String(blurGroupId);
      } else {
        inBlurGroup = false;
        delete el.dataset.blurGroup;
      }
    });
  }

  function insertCollapseIndicator(afterLine: Element, range: LineRange, hiddenCount: number): void {
    const linesText = hiddenCount === 1 ? 'line' : 'lines';
    const indicator = document.createElement('div');
    indicator.className = `line nx-collapse-indicator ${theme}`;
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');
    indicator.setAttribute('aria-label', `Expand ${hiddenCount} hidden ${linesText}`);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'expand-icon';
    iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4" /></svg>`;

    const textSpan = document.createElement('span');
    textSpan.className = 'collapse-text';
    textSpan.textContent = `... ${hiddenCount} ${linesText}`;

    indicator.appendChild(iconSpan);
    indicator.appendChild(textSpan);
    indicator.addEventListener('click', () => onCollapsedRangeToggle(range));
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCollapsedRangeToggle(range); }
    });

    afterLine.insertAdjacentElement('afterend', indicator);
  }

  function updateHoverWidgets(): void {
    if (!hoveredLine || !lineWidgets || lineWidgets.length === 0) {
      hoverWidgetData = null;
      return;
    }

    if (activeInsertWidget && activeInsertWidget.lineNumber === hoveredLine) {
      hoverWidgetData = null;
      return;
    }

    if (!wrapperRef || !codeRef) { hoverWidgetData = null; return; }

    const lines = Array.from(codeRef.querySelectorAll('.line:not(.nx-collapse-indicator)'));
    const lineElement = lines[hoveredLine - 1];
    if (!lineElement) { hoverWidgetData = null; return; }

    const codeLines = rawCode.split('\n');
    const lineText = codeLines[hoveredLine - 1] || '';

    const matchingWidgets = getMatchingWidgets(lineWidgets as any, lineText, hoveredLine) as SvelteLineWidgetConfig[];
    const hoverWidgets = matchingWidgets.filter(w => w.display === 'hover');

    if (hoverWidgets.length === 0) { hoverWidgetData = null; return; }

    const rect = lineElement.getBoundingClientRect();
    const wrapperRect = wrapperRef.getBoundingClientRect();

    hoverWidgetData = {
      lineNumber: hoveredLine,
      lineText,
      lineElement,
      widgets: hoverWidgets,
      context: { line: lineText, lineNumber: hoveredLine, theme },
      top: rect.top - wrapperRect.top,
      height: rect.height,
    };
  }

  function updateAlwaysWidgets(): void {
    if (!lineWidgets || lineWidgets.length === 0) { alwaysWidgetData = []; return; }

    const alwaysW = lineWidgets.filter(w => w.display === 'always');
    if (alwaysW.length === 0) { alwaysWidgetData = []; return; }

    const activeInsertLineNumber = activeInsertWidget?.lineNumber;
    if (!wrapperRef || !codeRef) { alwaysWidgetData = []; return; }

    const lines = Array.from(codeRef.querySelectorAll('.line:not(.nx-collapse-indicator)'));
    const codeLines = rawCode.split('\n');
    const wrapperRect = wrapperRef.getBoundingClientRect();
    const renderData: LineWidgetRenderData[] = [];

    lines.forEach((lineElement, index) => {
      const lineNumber = index + 1;
      if (activeInsertLineNumber === lineNumber) return;

      const lineText = codeLines[index] || '';
      const matchingWidgets = getMatchingWidgets(alwaysW as any, lineText, lineNumber) as SvelteLineWidgetConfig[];
      if (matchingWidgets.length === 0) return;

      const rect = lineElement.getBoundingClientRect();
      renderData.push({
        lineNumber, lineText, lineElement, widgets: matchingWidgets,
        context: { line: lineText, lineNumber, theme },
        top: rect.top - wrapperRect.top,
        height: rect.height,
      });
    });

    alwaysWidgetData = renderData;
  }

  function updateInlineInsertWidget(): void {
    cleanupInsertWidget();

    if (!activeInsertWidget?.widget.insertComponent) return;
    if (!codeRef) return;

    const lines = Array.from(
      codeRef.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)')
    );
    const lineElement = lines[activeInsertWidget.lineNumber - 1];
    if (!lineElement) return;

    const safeTheme = theme === 'dark' || theme === 'light' ? theme : 'dark';
    insertWidgetContainer = document.createElement('div');
    insertWidgetContainer.className = `line nx-insert-widget-container ${safeTheme}`;
    lineElement.insertAdjacentElement('afterend', insertWidgetContainer);

    const context: LineWidgetContext = {
      line: activeInsertWidget.line,
      lineNumber: activeInsertWidget.lineNumber,
      theme,
    };

    insertWidgetInstance = mount(activeInsertWidget.widget.insertComponent, {
      target: insertWidgetContainer,
      props: {
        ...context,
        onClose: () => onInsertWidgetClose(),
      },
    });

    insertWidgetResizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        onInsertWidgetHeightChange(height);
      }
    });
    insertWidgetResizeObserver.observe(insertWidgetContainer);
  }

  function cleanupInsertWidget(): void {
    if (insertWidgetResizeObserver) {
      insertWidgetResizeObserver.disconnect();
      insertWidgetResizeObserver = null;
    }
    if (insertWidgetInstance) {
      unmount(insertWidgetInstance);
      insertWidgetInstance = null;
    }
    if (insertWidgetContainer) {
      insertWidgetContainer.remove();
      insertWidgetContainer = null;
      onInsertWidgetHeightChange(0);
    }
  }

  function onWidgetClick(widget: SvelteLineWidgetConfig, data: LineWidgetRenderData): void {
    onLineWidgetClick({
      lineNumber: data.lineNumber,
      line: data.lineText,
      widget,
    });
  }

  function onMouseMove(event: MouseEvent): void {
    if (!codeRef) return;

    const target = event.target as HTMLElement;
    const lineElement = target.closest('.line') as HTMLElement | null;

    if (lineElement?.classList.contains('nx-insert-widget-container')) return;

    if (lineElement) {
      const lines = Array.from(
        codeRef.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)')
      );
      const lineIndex = lines.indexOf(lineElement);
      if (lineIndex !== -1) {
        onLineHover(lineIndex + 1);
      }
    }

    updateBlurGroupHover(lineElement?.dataset.blurGroup ?? null);
  }

  function onMouseLeave(): void {
    onLineHover(0);
    updateBlurGroupHover(null);
  }

  function updateBlurGroupHover(blurGroup: string | null): void {
    if (blurGroup === currentBlurGroup) return;
    if (!codeRef) return;

    if (currentBlurGroup) {
      codeRef.querySelectorAll(`[data-blur-group="${currentBlurGroup}"]`)
        .forEach(el => el.classList.remove('blur-group-hover'));
    }
    if (blurGroup) {
      codeRef.querySelectorAll(`[data-blur-group="${blurGroup}"]`)
        .forEach(el => el.classList.add('blur-group-hover'));
    }
    currentBlurGroup = blurGroup;
  }

  function onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;
    if (!refElement) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (!refId) return;

    const reference = processedReferences.get(refId);
    if (!reference) return;

    if (reference.types.includes('link') && !refElement.hasAttribute('href')) {
      onReferenceClick(reference);
    } else if (!reference.types.includes('link')) {
      onReferenceClick(reference);
    }
  }

  function onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;
    if (!refElement) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (!refId) return;

    const reference = processedReferences.get(refId);
    if (!reference) return;

    onReferenceHover({ reference, element: refElement, show: true });
  }

  function onMouseOut(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;
    if (!refElement) return;

    if (relatedTarget && refElement.contains(relatedTarget)) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (!refId) return;

    const reference = processedReferences.get(refId);
    if (!reference) return;

    onReferenceHover({ reference, element: refElement, show: false });
  }

  onDestroy(() => {
    cleanupInsertWidget();
    codeRef = null;
    wrapperRef = null;
  });
</script>

<div class="nx-code-content">
  <div class="code-content-wrapper" bind:this={wrapperRef}>
    <code
      bind:this={codeRef}
      class={containerClasses}
      onmousemove={onMouseMove}
      onmouseleave={onMouseLeave}
      onclick={onClick}
      onmouseover={onMouseOver}
      onmouseout={onMouseOut}
    >
      {#if content}
        {@html content}
      {/if}
    </code>

    <!-- Hover widgets overlay -->
    {#if hoverWidgetData}
      {#each leftHoverWidgets as widget, i}
        <div
          class="line-widget-overlay left"
          style="top: {hoverWidgetData.top}px; height: {hoverWidgetData.height}px;"
          onclick={(e) => { e.stopPropagation(); onWidgetClick(widget, hoverWidgetData); }}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onWidgetClick(widget, hoverWidgetData); } }}
          role="button"
          tabindex="0"
        >
          <svelte:component this={widget.lineComponent} {...hoverWidgetData.context} />
        </div>
      {/each}
      {#each rightHoverWidgets as widget, i}
        <div
          class="line-widget-overlay right"
          style="top: {hoverWidgetData.top}px; height: {hoverWidgetData.height}px;"
          onclick={(e) => { e.stopPropagation(); onWidgetClick(widget, hoverWidgetData); }}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onWidgetClick(widget, hoverWidgetData); } }}
          role="button"
          tabindex="0"
        >
          <svelte:component this={widget.lineComponent} {...hoverWidgetData.context} />
        </div>
      {/each}
    {/if}

    <!-- Always-visible widgets overlay -->
    {#each alwaysWidgetData as data (data.lineNumber)}
      {#each data.widgets as widget, i}
        <div
          class="line-widget-overlay"
          class:left={widget.position === 'left'}
          class:right={widget.position === 'right'}
          style="top: {data.top}px; height: {data.height}px;"
          onclick={(e) => { e.stopPropagation(); onWidgetClick(widget, data); }}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onWidgetClick(widget, data); } }}
          role="button"
          tabindex="0"
        >
          <svelte:component this={widget.lineComponent} {...data.context} />
        </div>
      {/each}
    {/each}
  </div>
</div>
