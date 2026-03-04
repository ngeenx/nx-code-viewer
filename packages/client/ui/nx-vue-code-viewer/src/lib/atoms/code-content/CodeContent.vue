<template>
  <div class="code-content-wrapper" ref="wrapperRef">
    <code
      ref="codeRef"
      :class="containerClasses"
      v-html="content ?? ''"
      @mousemove="onMouseMove"
      @click="onClick"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    />

    <!-- Hover widgets overlay -->
    <template v-if="hoverWidgetData">
      <div
        v-for="(widget, i) in leftHoverWidgets"
        :key="`left-hover-${i}`"
        class="line-widget-overlay left"
        :style="{ top: `${hoverWidgetData.top}px`, height: `${hoverWidgetData.height}px` }"
        @click="onWidgetClick(widget, hoverWidgetData)"
      >
        <component
          :is="widget.lineComponent"
          v-bind="hoverWidgetData.context"
        />
      </div>
      <div
        v-for="(widget, i) in rightHoverWidgets"
        :key="`right-hover-${i}`"
        class="line-widget-overlay right"
        :style="{ top: `${hoverWidgetData.top}px`, height: `${hoverWidgetData.height}px` }"
        @click="onWidgetClick(widget, hoverWidgetData)"
      >
        <component
          :is="widget.lineComponent"
          v-bind="hoverWidgetData.context"
        />
      </div>
    </template>

    <!-- Always-visible widgets overlay -->
    <template v-for="data in alwaysWidgetData" :key="data.lineNumber">
      <div
        v-for="(widget, i) in data.widgets"
        :key="`always-${data.lineNumber}-${i}`"
        class="line-widget-overlay"
        :class="{ left: widget.position === 'left', right: widget.position === 'right' }"
        :style="{ top: `${data.top}px`, height: `${data.height}px` }"
        @click="onWidgetClick(widget, data)"
      >
        <component
          :is="widget.lineComponent"
          v-bind="data.context"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, createApp, type App } from 'vue';
import {
  isLineInCollapsedRange,
  getMatchingWidgets,
  type CodeViewerTheme,
  type CollapsedRangeState,
  type LineRange,
  type LineWidgetContext,
  type ProcessedReference,
  type ReferenceHoverEvent,
} from '@ngeenx/nx-code-viewer-utils';
import type {
  VueLineWidgetsInput,
  VueLineWidgetConfig,
  VueActiveInsertWidget,
  VueLineWidgetClickEvent,
} from '../../types/vue-code-viewer.types';

interface LineWidgetRenderData {
  readonly lineNumber: number;
  readonly lineText: string;
  readonly lineElement: Element;
  readonly widgets: VueLineWidgetConfig[];
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
  lineWidgets?: VueLineWidgetsInput;
  activeInsertWidget?: VueActiveInsertWidget | null;
}

const props = withDefaults(defineProps<Props>(), {
  rawCode: '',
  theme: 'dark',
  wordWrap: false,
  isLoading: false,
  hoveredLine: 0,
  highlightedLinesSet: () => new Set(),
  focusedLinesSet: () => new Set(),
  collapsedRangesState: () => new Map(),
  processedReferences: () => new Map(),
  lineWidgets: () => [],
  activeInsertWidget: null,
});

const emit = defineEmits<{
  lineHover: [lineNumber: number];
  referenceClick: [reference: ProcessedReference];
  referenceHover: [event: ReferenceHoverEvent];
  collapsedRangeToggle: [range: LineRange];
  lineWidgetClick: [event: VueLineWidgetClickEvent];
  insertWidgetClose: [];
  insertWidgetHeightChange: [height: number];
}>();

const wrapperRef = ref<HTMLElement | null>(null);
const codeRef = ref<HTMLElement | null>(null);
const hoverWidgetData = ref<LineWidgetRenderData | null>(null);
const alwaysWidgetData = ref<LineWidgetRenderData[]>([]);

let insertApp: App | null = null;
let insertWidgetContainer: HTMLElement | null = null;
let insertWidgetResizeObserver: ResizeObserver | null = null;

const VALID_THEMES = new Set<string>(['dark', 'light']);

const containerClasses = computed(() => {
  return `${props.theme} ${props.wordWrap ? 'wrap' : 'nowrap'}`;
});

const leftHoverWidgets = computed(() => {
  if (!hoverWidgetData.value) return [];
  return hoverWidgetData.value.widgets.filter(w => w.position === 'left' && w.display === 'hover');
});

const rightHoverWidgets = computed(() => {
  if (!hoverWidgetData.value) return [];
  return hoverWidgetData.value.widgets.filter(w => w.position === 'right' && w.display === 'hover');
});

// Watch for line style updates
watch(
  [() => props.hoveredLine, () => props.highlightedLinesSet, () => props.focusedLinesSet, () => props.collapsedRangesState, () => props.content, () => props.theme],
  async () => {
    await nextTick();
    updateLineStyles();
  }
);

// Watch for hover widget updates
watch(
  [() => props.hoveredLine, () => props.lineWidgets, () => props.rawCode, () => props.theme, () => props.content, () => props.activeInsertWidget],
  async () => {
    await nextTick();
    updateHoverWidgets();
  }
);

// Watch for always widget updates
watch(
  [() => props.lineWidgets, () => props.rawCode, () => props.theme, () => props.content, () => props.activeInsertWidget],
  async () => {
    await nextTick();
    updateAlwaysWidgets();
  }
);

// Watch for insert widget updates
watch(
  [() => props.activeInsertWidget, () => props.theme, () => props.content],
  async () => {
    await nextTick();
    updateInlineInsertWidget();
  }
);

onUnmounted(() => {
  cleanupInsertWidget();
});

function sanitizeTheme(theme: string): string {
  return VALID_THEMES.has(theme) ? theme : 'dark';
}

function updateLineStyles(): void {
  const codeElement = codeRef.value;
  if (!codeElement) return;

  const hasFocusedLines = props.focusedLinesSet.size > 0;
  const hasCollapsedRanges = props.collapsedRangesState.size > 0;

  codeElement.querySelectorAll('.nx-collapse-indicator').forEach(el => el.remove());

  const lines = codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)');

  lines.forEach((line: Element, index: number) => {
    const lineNumber = index + 1;
    (line as HTMLElement).style.position = 'relative';

    if (hasCollapsedRanges) {
      const collapseInfo = isLineInCollapsedRange(lineNumber, props.collapsedRangesState);

      if (collapseInfo.isCollapsed && !collapseInfo.isFirstLine) {
        line.classList.add('collapsed-hidden');
        return;
      } else {
        line.classList.remove('collapsed-hidden');
      }

      if (collapseInfo.isFirstLine && collapseInfo.range) {
        insertCollapseIndicator(line, collapseInfo.range, collapseInfo.hiddenCount, props.theme);
      }
    } else {
      line.classList.remove('collapsed-hidden');
    }

    const isHovered = lineNumber === props.hoveredLine;
    line.classList.toggle('hovered', isHovered);

    const isHighlighted = props.highlightedLinesSet.has(lineNumber);
    line.classList.toggle('highlighted', isHighlighted);

    const isUnfocused = hasFocusedLines && !props.focusedLinesSet.has(lineNumber);
    line.classList.toggle('unfocused', isUnfocused);
  });
}

function insertCollapseIndicator(afterLine: Element, range: LineRange, hiddenCount: number, theme: CodeViewerTheme): void {
  const indicator = document.createElement('div');
  indicator.className = `line nx-collapse-indicator ${sanitizeTheme(theme)}`;

  const iconSpan = document.createElement('span');
  iconSpan.className = 'expand-icon';
  iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4" /></svg>`;

  const textSpan = document.createElement('span');
  textSpan.className = 'collapse-text';
  textSpan.textContent = `... ${hiddenCount} ${hiddenCount === 1 ? 'line' : 'lines'}`;

  indicator.appendChild(iconSpan);
  indicator.appendChild(textSpan);

  indicator.addEventListener('click', () => emit('collapsedRangeToggle', range));
  indicator.setAttribute('role', 'button');
  indicator.setAttribute('tabindex', '0');
  indicator.setAttribute('aria-label', `Expand ${hiddenCount} hidden ${hiddenCount === 1 ? 'line' : 'lines'}`);
  indicator.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      emit('collapsedRangeToggle', range);
    }
  });

  afterLine.insertAdjacentElement('afterend', indicator);
}

function updateHoverWidgets(): void {
  const lineNumber = props.hoveredLine;
  const widgets = props.lineWidgets;

  if (!lineNumber || !widgets || widgets.length === 0) {
    hoverWidgetData.value = null;
    return;
  }

  if (props.activeInsertWidget && props.activeInsertWidget.lineNumber === lineNumber) {
    hoverWidgetData.value = null;
    return;
  }

  const wrapper = wrapperRef.value;
  const codeElement = codeRef.value;
  if (!wrapper || !codeElement) {
    hoverWidgetData.value = null;
    return;
  }

  const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)'));
  const lineElement = lines[lineNumber - 1];
  if (!lineElement) {
    hoverWidgetData.value = null;
    return;
  }

  const codeLines = props.rawCode.split('\n');
  const lineText = codeLines[lineNumber - 1] || '';

  const matchingWidgets = getMatchingWidgets(widgets as any, lineText, lineNumber) as VueLineWidgetConfig[];
  const hoverWidgets = matchingWidgets.filter(w => w.display === 'hover');

  if (hoverWidgets.length === 0) {
    hoverWidgetData.value = null;
    return;
  }

  const rect = lineElement.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();

  hoverWidgetData.value = {
    lineNumber,
    lineText,
    lineElement,
    widgets: hoverWidgets,
    context: { line: lineText, lineNumber, theme: props.theme },
    top: rect.top - wrapperRect.top,
    height: rect.height,
  };
}

function updateAlwaysWidgets(): void {
  const widgets = props.lineWidgets;

  if (!widgets || widgets.length === 0) {
    alwaysWidgetData.value = [];
    return;
  }

  const alwaysWidgets = widgets.filter(w => w.display === 'always');
  if (alwaysWidgets.length === 0) {
    alwaysWidgetData.value = [];
    return;
  }

  const activeInsertLineNumber = props.activeInsertWidget?.lineNumber;
  const wrapper = wrapperRef.value;
  const codeElement = codeRef.value;
  if (!wrapper || !codeElement) {
    alwaysWidgetData.value = [];
    return;
  }

  const lines = Array.from(codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)'));
  const codeLines = props.rawCode.split('\n');
  const wrapperRect = wrapper.getBoundingClientRect();
  const renderData: LineWidgetRenderData[] = [];

  lines.forEach((lineElement: Element, index: number) => {
    const lineNumber = index + 1;
    if (activeInsertLineNumber === lineNumber) return;

    const lineText = codeLines[index] || '';
    const matchingWidgets = getMatchingWidgets(alwaysWidgets as any, lineText, lineNumber) as VueLineWidgetConfig[];
    if (matchingWidgets.length === 0) return;

    const rect = lineElement.getBoundingClientRect();
    renderData.push({
      lineNumber,
      lineText,
      lineElement,
      widgets: matchingWidgets,
      context: { line: lineText, lineNumber, theme: props.theme },
      top: rect.top - wrapperRect.top,
      height: rect.height,
    });
  });

  alwaysWidgetData.value = renderData;
}

function updateInlineInsertWidget(): void {
  cleanupInsertWidget();

  const insertWidget = props.activeInsertWidget;
  if (!insertWidget?.widget.insertComponent) return;

  const codeElement = codeRef.value;
  if (!codeElement) return;

  const lines = Array.from(
    codeElement.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)')
  );
  const lineElement = lines[insertWidget.lineNumber - 1];
  if (!lineElement) return;

  const safeTheme = sanitizeTheme(props.theme);
  insertWidgetContainer = document.createElement('div');
  insertWidgetContainer.className = `line nx-insert-widget-container ${safeTheme}`;

  lineElement.insertAdjacentElement('afterend', insertWidgetContainer);

  const context: LineWidgetContext = {
    line: insertWidget.line,
    lineNumber: insertWidget.lineNumber,
    theme: props.theme,
  };

  insertApp = createApp(insertWidget.widget.insertComponent, {
    ...context,
    onClose: () => emit('insertWidgetClose'),
  });

  insertApp.mount(insertWidgetContainer);

  insertWidgetResizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      emit('insertWidgetHeightChange', height);
    }
  });
  insertWidgetResizeObserver.observe(insertWidgetContainer);
}

function cleanupInsertWidget(): void {
  if (insertWidgetResizeObserver) {
    insertWidgetResizeObserver.disconnect();
    insertWidgetResizeObserver = null;
  }

  if (insertApp) {
    insertApp.unmount();
    insertApp = null;
  }

  if (insertWidgetContainer) {
    insertWidgetContainer.remove();
    insertWidgetContainer = null;
    emit('insertWidgetHeightChange', 0);
  }
}

function onMouseMove(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const lineElement = target.closest('.line');

  if (lineElement?.classList.contains('nx-insert-widget-container')) return;

  if (lineElement && codeRef.value) {
    const lines = Array.from(
      codeRef.value.querySelectorAll('.line:not(.nx-collapse-indicator):not(.nx-insert-widget-container)')
    );
    const lineIndex = lines.indexOf(lineElement);
    if (lineIndex !== -1) {
      emit('lineHover', lineIndex + 1);
    }
  }
}

function onClick(event: MouseEvent): void {
  if (!wrapperRef.value?.contains(event.target as Node)) return;

  const target = event.target as HTMLElement;
  const refElement = target.closest('.nx-ref');

  if (refElement) {
    const refId = refElement.getAttribute('data-ref-id');
    if (refId) {
      const reference = props.processedReferences.get(refId);
      if (reference) {
        if (reference.types.includes('link') && !refElement.hasAttribute('href')) {
          emit('referenceClick', reference);
        } else if (!reference.types.includes('link')) {
          emit('referenceClick', reference);
        }
      }
    }
  }
}

function onMouseOver(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const refElement = target.closest('.nx-ref') as HTMLElement | null;

  if (refElement) {
    const refId = refElement.getAttribute('data-ref-id');
    if (refId) {
      const reference = props.processedReferences.get(refId);
      if (reference) {
        emit('referenceHover', { reference, element: refElement, show: true });
      }
    }
  }
}

function onMouseOut(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const relatedTarget = event.relatedTarget as HTMLElement | null;
  const refElement = target.closest('.nx-ref') as HTMLElement | null;

  if (refElement) {
    if (relatedTarget && refElement.contains(relatedTarget)) return;

    const refId = refElement.getAttribute('data-ref-id');
    if (refId) {
      const reference = props.processedReferences.get(refId);
      if (reference) {
        emit('referenceHover', { reference, element: refElement, show: false });
      }
    }
  }
}

function onWidgetClick(widget: VueLineWidgetConfig, data: LineWidgetRenderData): void {
  emit('lineWidgetClick', {
    lineNumber: data.lineNumber,
    line: data.lineText,
    widget,
  });
}
</script>
