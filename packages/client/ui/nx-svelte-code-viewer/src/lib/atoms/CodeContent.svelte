<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    isLineInCollapsedRange,
    isLineHighlighted,
    type CodeViewerTheme,
    type CollapsedRangeState,
    type LineRange,
    type ProcessedReference,
    type ReferenceHoverEvent,
  } from '@ngeenx/nx-code-viewer-utils';
  import type { SvelteLineWidgetsInput, SvelteLineWidgetClickEvent, SvelteActiveInsertWidget } from '../types/svelte-code-viewer.types';

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

  let codeRef: HTMLElement | null = $state(null);
  let currentBlurGroup: string | null = null;

  const containerClasses = $derived(
    `${theme} ${wordWrap ? 'wrap' : 'nowrap'}`
  );

  // Update line styles when relevant state changes
  $effect(() => {
    if (!codeRef || !content) return;

    // Access reactive deps
    const _hovered = hoveredLine;
    const _highlighted = highlightedLinesSet;
    const _focused = focusedLinesSet;
    const _collapsed = collapsedRangesState;
    const _theme = theme;

    // Use tick to ensure DOM is updated after content change
    requestAnimationFrame(() => {
      updateLineStyles();
    });
  });

  function updateLineStyles(): void {
    if (!codeRef) return;

    const lines = codeRef.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)');
    const hasFocused = focusedLinesSet && focusedLinesSet.size > 0;

    // Remove existing collapse indicators
    codeRef.querySelectorAll('.nx-collapse-indicator').forEach(el => el.remove());

    let blurGroupIndex = 0;
    let inBlurGroup = false;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const el = line as HTMLElement;

      // Hover
      el.classList.toggle('hovered', lineNumber === hoveredLine);

      // Highlighted
      el.classList.toggle('highlighted', isLineHighlighted(lineNumber, highlightedLinesSet));

      // Focused/unfocused
      if (hasFocused) {
        const isUnfocused = !focusedLinesSet.has(lineNumber);
        el.classList.toggle('unfocused', isUnfocused);

        if (isUnfocused) {
          if (!inBlurGroup) {
            blurGroupIndex++;
            inBlurGroup = true;
          }
          el.setAttribute('data-blur-group', String(blurGroupIndex));
        } else {
          inBlurGroup = false;
          el.removeAttribute('data-blur-group');
        }
      } else {
        el.classList.remove('unfocused');
        el.removeAttribute('data-blur-group');
      }

      // Collapsed
      const collapseInfo = isLineInCollapsedRange(lineNumber, collapsedRangesState);
      if (collapseInfo.isCollapsed && !collapseInfo.isFirstLine) {
        el.classList.add('collapsed-hidden');
      } else {
        el.classList.remove('collapsed-hidden');
      }

      // Insert collapse indicator after first line of range
      if (collapseInfo.isFirstLine && collapseInfo.range) {
        insertCollapseIndicator(el, collapseInfo.range, collapseInfo.hiddenCount);
      }
    });
  }

  function insertCollapseIndicator(afterLine: Element, range: LineRange, hiddenCount: number): void {
    const indicator = document.createElement('div');
    indicator.className = `nx-collapse-indicator line ${theme}`;
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');
    indicator.setAttribute('aria-label', `Expand ${hiddenCount} hidden lines`);
    indicator.innerHTML = `
      <span class="expand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
      <span class="collapse-text">... ${hiddenCount} lines</span>
    `;
    indicator.addEventListener('click', () => onCollapsedRangeToggle(range));
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onCollapsedRangeToggle(range);
      }
    });

    afterLine.after(indicator);
  }

  function onMouseMove(event: MouseEvent): void {
    if (!codeRef) return;

    const target = event.target as HTMLElement;
    const lineElement = target.closest('.line') as HTMLElement | null;

    // Don't trigger hover when over the insert widget container
    if (lineElement?.classList.contains('nx-insert-widget-container')) {
      return;
    }

    if (lineElement) {
      const lines = Array.from(
        codeRef.querySelectorAll(
          '.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)'
        )
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
      codeRef
        .querySelectorAll(`[data-blur-group="${currentBlurGroup}"]`)
        .forEach(el => el.classList.remove('blur-group-hover'));
    }
    if (blurGroup) {
      codeRef
        .querySelectorAll(`[data-blur-group="${blurGroup}"]`)
        .forEach(el => el.classList.add('blur-group-hover'));
    }
    currentBlurGroup = blurGroup;
  }

  function onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('[data-ref-id]') as HTMLElement | null;

    if (!refElement) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (!refId) return;

    const reference = processedReferences.get(refId);
    if (!reference) return;

    // Only prevent default for non-link references
    if (!reference.types.includes('link')) {
      event.preventDefault();
    }

    onReferenceClick(reference);
  }

  function onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('[data-ref-id]') as HTMLElement | null;

    if (!refElement) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (!refId) return;

    const reference = processedReferences.get(refId);
    if (!reference) return;

    onReferenceHover({
      reference,
      element: refElement,
      show: true,
    });
  }

  function onMouseOut(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('[data-ref-id]') as HTMLElement | null;

    if (!refElement) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (!refId) return;

    const reference = processedReferences.get(refId);
    if (!reference) return;

    onReferenceHover({
      reference,
      element: refElement,
      show: false,
    });
  }

  onDestroy(() => {
    codeRef = null;
  });
</script>

<div class="nx-code-content">
  <div class="code-content-wrapper">
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
  </div>
</div>
