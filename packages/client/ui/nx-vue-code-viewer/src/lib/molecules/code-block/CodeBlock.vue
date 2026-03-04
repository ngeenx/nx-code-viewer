<template>
  <div class="code-block-wrapper">
    <CopyButton
      v-if="showCopyButton"
      class="copy-button"
      :state="copyState"
      :theme="theme"
      @copy-click="onCopyClick"
    />

    <div
      class="code-block-container"
      :style="containerStyle"
      @mouseleave="onLineHover(0)"
    >
      <LineNumbers
        v-if="showLineNumbers"
        :lineCount="lineCount"
        :theme="theme"
        :hoveredLine="hoveredLine"
        :highlightedLinesSet="highlightedLinesSet"
        :collapsedRangesState="collapsedRangesState"
        :activeInsertWidget="activeInsertWidget"
        :insertWidgetHeight="insertWidgetHeight"
        @line-hover="onLineHover"
        @collapsed-range-toggle="onCollapsedRangeToggle"
      />

      <CodeContent
        :content="content"
        :rawCode="rawCode"
        :theme="theme"
        :wordWrap="wordWrap"
        :isLoading="isLoading"
        :hoveredLine="hoveredLine"
        :highlightedLinesSet="highlightedLinesSet"
        :focusedLinesSet="focusedLinesSet"
        :collapsedRangesState="collapsedRangesState"
        :processedReferences="processedReferences"
        :lineWidgets="lineWidgets"
        :activeInsertWidget="activeInsertWidget"
        @line-hover="onLineHover"
        @reference-click="onReferenceClick"
        @reference-hover="onReferenceHover"
        @collapsed-range-toggle="onCollapsedRangeToggle"
        @line-widget-click="onLineWidgetClick"
        @insert-widget-close="onInsertWidgetClose"
        @insert-widget-height-change="onInsertWidgetHeightChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type {
  CodeViewerTheme,
  CollapsedRangeState,
  LineRange,
  ProcessedReference,
  ReferenceHoverEvent,
} from '@ngeenx/nx-code-viewer-utils';
import type {
  VueLineWidgetsInput,
  VueActiveInsertWidget,
  VueLineWidgetClickEvent,
} from '../../types/vue-code-viewer.types';
import type { CopyButtonState } from '@ngeenx/nx-code-viewer-utils';
import { CodeContent } from '../../atoms/code-content';
import { LineNumbers } from '../../atoms/line-numbers';
import { CopyButton } from '../../atoms/copy-button';

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
  processedReferences?: Map<string, ProcessedReference>;
  collapsedRangesState?: Map<string, CollapsedRangeState>;
  lineWidgets?: VueLineWidgetsInput;
}

const props = withDefaults(defineProps<Props>(), {
  rawCode: '',
  theme: 'dark',
  showLineNumbers: true,
  wordWrap: false,
  maxHeight: '',
  isLoading: false,
  showCopyButton: true,
  copyState: 'idle',
  copyClick: () => {},
  highlightedLinesSet: () => new Set(),
  focusedLinesSet: () => new Set(),
  processedReferences: () => new Map(),
  collapsedRangesState: () => new Map(),
  lineWidgets: () => [],
});

const emit = defineEmits<{
  referenceClick: [reference: ProcessedReference];
  referenceHover: [event: ReferenceHoverEvent];
  collapsedRangeToggle: [range: LineRange];
  lineWidgetClick: [event: VueLineWidgetClickEvent];
}>();

const hoveredLine = ref<number>(0);
const activeInsertWidget = ref<VueActiveInsertWidget | null>(null);
const insertWidgetHeight = ref<number>(0);

const containerStyle = computed(() => {
  return props.maxHeight ? { 'max-height': props.maxHeight } : {};
});

function onLineHover(lineNumber: number): void {
  hoveredLine.value = lineNumber;
}

function onCopyClick(): void {
  props.copyClick();
}

function onReferenceClick(reference: ProcessedReference): void {
  emit('referenceClick', reference);
}

function onReferenceHover(event: ReferenceHoverEvent): void {
  emit('referenceHover', event);
}

function onCollapsedRangeToggle(range: LineRange): void {
  emit('collapsedRangeToggle', range);
}

function onLineWidgetClick(event: VueLineWidgetClickEvent): void {
  const current = activeInsertWidget.value;

  if (current && current.lineNumber === event.lineNumber && current.widget === event.widget) {
    activeInsertWidget.value = null;
  } else if (event.widget.insertComponent) {
    activeInsertWidget.value = {
      lineNumber: event.lineNumber,
      widget: event.widget,
      line: event.line,
    };
  }

  emit('lineWidgetClick', event);
}

function onInsertWidgetClose(): void {
  activeInsertWidget.value = null;
}

function onInsertWidgetHeightChange(height: number): void {
  insertWidgetHeight.value = height;
}
</script>
