<template>
  <div class="line-numbers-container" :class="theme" aria-hidden="true">
    <template v-for="lineNumber in lineNumbers" :key="lineNumber">
      <template v-if="isLineVisible(lineNumber)">
        <div
          class="line-number"
          :class="{
            hovered: isHovered(lineNumber),
            highlighted: isHighlighted(lineNumber),
            'collapsed-first': getLineCollapseInfo(lineNumber).isFirstLine,
          }"
          @mouseenter="onMouseEnter(lineNumber)"
        >
          {{ formatLine(lineNumber) }}
        </div>

        <div
          v-if="getLineCollapseInfo(lineNumber).isFirstLine && getLineCollapseInfo(lineNumber).range"
          class="line-number collapse-indicator"
          role="button"
          tabindex="0"
          :aria-label="`Expand ${getLineCollapseInfo(lineNumber).hiddenCount} hidden ${getLineCollapseInfo(lineNumber).hiddenCount === 1 ? 'line' : 'lines'}`"
          @click="onExpandToggle(getLineCollapseInfo(lineNumber).range!)"
          @keydown.enter="onExpandToggle(getLineCollapseInfo(lineNumber).range!)"
          @keydown.space.prevent="onExpandToggle(getLineCollapseInfo(lineNumber).range!)"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </div>

        <div
          v-if="hasInsertWidgetAfter(lineNumber)"
          class="insert-widget-placeholder"
          :style="{ height: insertWidgetHeight + 'px' }"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  generateLineNumbers,
  formatLineNumber,
  isLineInCollapsedRange,
  type CodeViewerTheme,
  type CollapsedRangeState,
  type LineRange,
} from '@ngeenx/nx-code-viewer-utils';
import type { VueActiveInsertWidget } from '../../types/vue-code-viewer.types';

interface Props {
  lineCount: number;
  theme?: CodeViewerTheme;
  hoveredLine?: number;
  highlightedLinesSet?: Set<number>;
  collapsedRangesState?: Map<string, CollapsedRangeState>;
  activeInsertWidget?: VueActiveInsertWidget | null;
  insertWidgetHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  hoveredLine: 0,
  highlightedLinesSet: () => new Set(),
  collapsedRangesState: () => new Map(),
  activeInsertWidget: null,
  insertWidgetHeight: 0,
});

const emit = defineEmits<{
  lineHover: [lineNumber: number];
  collapsedRangeToggle: [range: LineRange];
}>();

const lineNumbers = computed(() => generateLineNumbers(props.lineCount));

function formatLine(lineNumber: number): string {
  return formatLineNumber(lineNumber, props.lineCount);
}

function isHovered(lineNumber: number): boolean {
  return props.hoveredLine === lineNumber;
}

function isHighlighted(lineNumber: number): boolean {
  return props.highlightedLinesSet.has(lineNumber);
}

function getLineCollapseInfo(lineNumber: number) {
  return isLineInCollapsedRange(lineNumber, props.collapsedRangesState);
}

function isLineVisible(lineNumber: number): boolean {
  const info = getLineCollapseInfo(lineNumber);
  return !info.isCollapsed || info.isFirstLine;
}

function hasInsertWidgetAfter(lineNumber: number): boolean {
  return props.activeInsertWidget !== null && props.activeInsertWidget?.lineNumber === lineNumber;
}

function onMouseEnter(lineNumber: number): void {
  emit('lineHover', lineNumber);
}

function onExpandToggle(range: LineRange): void {
  emit('collapsedRangeToggle', range);
}
</script>
