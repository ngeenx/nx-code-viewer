<template>
  <div class="nx-code-viewer">
  <article :class="`${theme} border-${borderStyle}`">
    <!-- Border overlay for grid-cross style -->
    <div v-if="borderStyle === 'grid-cross'" class="border-overlay">
      <div class="border-top" />
      <div class="border-bottom" />
      <div class="border-left" />
      <div class="border-right" />
      <div class="corner-cross corner-top-left-h" />
      <div class="corner-cross corner-top-left-v" />
      <div class="corner-cross corner-top-right-h" />
      <div class="corner-cross corner-top-right-v" />
      <div class="corner-cross corner-bottom-left-h" />
      <div class="corner-cross corner-bottom-left-v" />
      <div class="corner-cross corner-bottom-right-h" />
      <div class="corner-cross corner-bottom-right-v" />
    </div>

    <!-- Border overlay for corner-intersection style -->
    <div v-if="borderStyle === 'corner-intersection'" class="border-overlay">
      <div class="border-top-extended" />
      <div class="border-bottom-extended" />
      <div class="border-left-extended" />
      <div class="border-right-extended" />
    </div>

    <CodeHeader
      v-if="showHeader"
      :language="language"
      :title="title"
      :theme="theme"
      :fileExtension="fileExtension"
    />

    <CodeBlock
      :content="highlightedContent"
      :rawCode="normalizedCode"
      :lineCount="lineCount"
      :theme="theme"
      :showLineNumbers="showLineNumbers"
      :wordWrap="wordWrap"
      :maxHeight="maxHeight"
      :isLoading="isLoading"
      :showCopyButton="showCopyButton"
      :copyState="copyState"
      :copyClick="handleCopyClick"
      :highlightedLinesSet="highlightedLinesSet"
      :focusedLinesSet="focusedLinesSet"
      :collapsedRangesState="collapsedRangesState"
      :processedReferences="processedReferencesMap"
      :lineWidgets="lineWidgets"
      @reference-click="onReferenceClick"
      @reference-hover="onReferenceHover"
      @collapsed-range-toggle="onCollapsedRangeToggle"
      @line-widget-click="onLineWidgetClick"
    />

    <!-- Reference info popover -->
    <ReferencePopover
      v-if="activePopover"
      :content="activePopover.reference.content ?? ''"
      :anchorElement="activePopover.anchorElement"
      :theme="theme"
      :visible="true"
      :matchedText="activePopover.reference.matchedText"
      :captureGroups="activePopover.reference.captureGroups"
      :lineNumber="activePopover.reference.lineNumber"
      @mouse-enter="onPopoverMouseEnter"
      @mouse-leave="onPopoverMouseLeave"
    />
  </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
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
import type {
  VueLineWidgetsInput,
  VueLineWidgetClickEvent,
} from '../../types/vue-code-viewer.types';
import { useClipboard } from '../../composables/useClipboard';
import { useCodeHighlighter } from '../../composables/useCodeHighlighter';
import { processReferences } from '../../composables/referenceProcessor';
import { CodeHeader } from '../../atoms/code-header';
import { ReferencePopover } from '../../atoms/reference-popover';
import { CodeBlock } from '../../molecules/code-block';
import type { VueHighlightedCodeState } from '../../types/vue-code-viewer.types';

let instanceCounter = 0;

interface Props {
  code: string | string[];
  language?: CodeViewerLanguage;
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  title?: string;
  showLineNumbers?: boolean;
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
  lineWidgets?: VueLineWidgetsInput;
}

const props = withDefaults(defineProps<Props>(), {
  language: () => DEFAULT_CODE_VIEWER_CONFIG.language,
  theme: () => DEFAULT_CODE_VIEWER_CONFIG.theme,
  title: () => DEFAULT_CODE_VIEWER_CONFIG.title,
  showLineNumbers: () => DEFAULT_CODE_VIEWER_CONFIG.showLineNumbers,
  showCopyButton: () => DEFAULT_CODE_VIEWER_CONFIG.showCopyButton,
  showHeader: () => DEFAULT_CODE_VIEWER_CONFIG.showHeader,
  maxHeight: () => DEFAULT_CODE_VIEWER_CONFIG.maxHeight,
  wordWrap: () => DEFAULT_CODE_VIEWER_CONFIG.wordWrap,
  fileExtension: '',
  borderStyle: 'classic',
  references: () => [],
  maxCodeLength: 500_000,
  lineWidgets: () => [],
});

const emit = defineEmits<{
  codeCopied: [];
  referenceClick: [reference: ProcessedReference];
  referenceHover: [event: ReferenceHoverEvent];
  collapsedRangeToggle: [event: CollapsedRangeToggleEvent];
  lineWidgetClick: [event: VueLineWidgetClickEvent];
}>();

const instanceId = `code-viewer-${++instanceCounter}`;
const clipboard = useClipboard();
const highlighter = useCodeHighlighter();

const highlightState = ref<VueHighlightedCodeState>(highlighter.createInitialState());
const copyState = clipboard.getCopyState(instanceId);
const activePopover = ref<{ reference: ProcessedReference; anchorElement: HTMLElement } | null>(null);
const collapsedRangesState = ref<Map<string, CollapsedRangeState>>(new Map());
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
let highlightAbortController: AbortController | null = null;

const normalizedCode = computed(() => {
  const codeValue = props.code;
  return Array.isArray(codeValue) ? codeValue.join('\n') : codeValue;
});

const lineCount = computed(() => countLines(normalizedCode.value));

const rawHtmlString = computed<string | null>(() => {
  const state = highlightState.value;
  if (state.rawHtml) return state.rawHtml;
  const codeValue = normalizedCode.value;
  if (codeValue) return highlighter.buildFallbackHtmlString(codeValue);
  return null;
});

const rawHighlightedContent = computed<string | null>(() => {
  const state = highlightState.value;
  if (state.html) return state.html;
  const codeValue = normalizedCode.value;
  if (codeValue) return highlighter.createFallbackHtml(codeValue);
  return null;
});

const processedReferenceResult = computed(() => {
  const htmlString = rawHtmlString.value;
  const refs = props.references;
  if (!htmlString || refs.length === 0) return null;
  return processReferences(htmlString, refs);
});

const processedReferencesMap = computed(() => {
  return processedReferenceResult.value?.processedReferences ?? new Map<string, ProcessedReference>();
});

const highlightedContent = computed<string | null>(() => {
  const rawContent = rawHighlightedContent.value;
  const result = processedReferenceResult.value;
  if (!rawContent) return null;
  if (result) return result.html;
  return rawContent;
});

const isLoading = computed(() => highlightState.value.isLoading);

const highlightedLinesSet = computed(() => parseHighlightedLines(props.highlightedLines));
const focusedLinesSet = computed(() => parseHighlightedLines(props.focusedLines));

// Watch code/language/theme for highlight
watch(
  [normalizedCode, () => props.language, () => props.theme, () => props.shikiTheme],
  ([code, language, theme, shikiTheme]) => {
    void highlightCode(code, language, theme, shikiTheme);
  },
  { immediate: true }
);

// Watch collapsedLines for state init
watch(
  () => props.collapsedLines,
  (collapsedInput) => {
    const parsedRanges = parseCollapsedRanges(collapsedInput);
    collapsedRangesState.value = createCollapsedRangesState(parsedRanges);
  },
  { immediate: true }
);

onUnmounted(() => {
  abortPendingHighlight();
  clearHoverTimeout();
  clipboard.cleanup(instanceId);
});

async function highlightCode(
  code: string,
  language: CodeViewerLanguage,
  theme: CodeViewerTheme,
  shikiTheme?: ShikiThemeName
): Promise<void> {
  abortPendingHighlight();

  if (!code) {
    highlightState.value = highlighter.createInitialState();
    return;
  }

  const limit = props.maxCodeLength;
  if (code.length > limit) {
    highlightState.value = highlighter.createErrorState(
      new Error(`Code exceeds maximum allowed length of ${limit} characters`)
    );
    return;
  }

  highlightAbortController = new AbortController();
  const { signal } = highlightAbortController;

  highlightState.value = highlighter.createLoadingState();

  const result = await highlighter.highlightToHtml({ code, language, theme, signal, shikiTheme });

  if (!signal.aborted) {
    highlightState.value = result;
  }
}

function abortPendingHighlight(): void {
  if (highlightAbortController) {
    highlightAbortController.abort();
    highlightAbortController = null;
  }
}

const handleCopyClick = (): void => {
  void copyCode();
};

async function copyCode(): Promise<void> {
  const result = await clipboard.copy(normalizedCode.value, instanceId);
  if (result.success) {
    emit('codeCopied');
  }
}

function onReferenceClick(reference: ProcessedReference): void {
  if (reference.handle) {
    const codeValue = props.code;
    const codeString = Array.isArray(codeValue) ? codeValue.join('\n') : codeValue;
    const lines = codeString.split('\n');
    const line = lines[reference.lineNumber - 1] ?? '';
    reference.handle(line);
  }
  emit('referenceClick', reference);
}

function onReferenceHover(event: ReferenceHoverEvent): void {
  clearHoverTimeout();
  emit('referenceHover', event);

  if (!event.reference.types.includes('info')) return;

  if (event.show) {
    hoverTimeout = setTimeout(() => {
      activePopover.value = { reference: event.reference, anchorElement: event.element };
    }, 200);
  } else {
    hoverTimeout = setTimeout(() => {
      activePopover.value = null;
    }, 100);
  }
}

function onPopoverMouseEnter(): void {
  clearHoverTimeout();
}

function onPopoverMouseLeave(): void {
  clearHoverTimeout();
  hoverTimeout = setTimeout(() => {
    activePopover.value = null;
  }, 100);
}

function clearHoverTimeout(): void {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
}

function onCollapsedRangeToggle(range: LineRange): void {
  const key = rangeToKey(range);
  const currentState = collapsedRangesState.value;
  const rangeState = currentState.get(key);

  if (rangeState) {
    const newIsExpanded = !rangeState.isExpanded;
    const newState = new Map(currentState);
    newState.set(key, { ...rangeState, isExpanded: newIsExpanded });
    collapsedRangesState.value = newState;
    emit('collapsedRangeToggle', { range, isExpanded: newIsExpanded });
  }
}

function onLineWidgetClick(event: VueLineWidgetClickEvent): void {
  emit('lineWidgetClick', event);
}
</script>
