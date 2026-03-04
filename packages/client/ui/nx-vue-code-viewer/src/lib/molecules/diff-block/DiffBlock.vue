<template>
  <div
    class="diff-block-container"
    :class="theme"
    :style="containerStyle"
    @mouseleave="onMouseLeave"
  >
    <!-- Unified View -->
    <template v-if="isUnifiedView">
      <div v-for="hunk in unifiedViewData" :key="hunk.header" class="hunk">
        <div class="hunk-header">{{ hunk.header }}</div>
        <template v-for="item in hunk.lines" :key="item.globalIndex">
          <template v-if="isLineVisible(item.globalIndex)">
            <DiffLine
              :line="item.line"
              :theme="theme"
              :showLineNumbers="showLineNumbers"
              :showPrefix="true"
              :lineIndex="item.globalIndex"
              :isHighlighted="hoveredLineIndex === item.globalIndex"
              :lineWidgets="lineWidgets"
              @line-hover="onLineHover"
              @line-widget-click="(e) => onLineWidgetClick(e, item.line)"
            />

            <component
              v-if="shouldShowInsertWidget(item.line.newLineNumber ?? item.line.oldLineNumber ?? 0) && activeInsertWidget?.widget.insertComponent"
              :is="activeInsertWidget.widget.insertComponent"
              v-bind="getInsertWidgetContext()"
              @close="activeInsertWidget = null"
            />

            <DiffCollapsedIndicator
              v-if="getLineCollapseInfo(item.globalIndex).isFirstLine && getLineCollapseInfo(item.globalIndex).range"
              :theme="theme"
              :range="getLineCollapseInfo(item.globalIndex).range!"
              :hiddenCount="getLineCollapseInfo(item.globalIndex).hiddenCount"
              :showLineNumbers="showLineNumbers"
              :showPrefix="true"
              @toggle="onCollapsedRangeToggle(getLineCollapseInfo(item.globalIndex).range!)"
            />
          </template>
        </template>
      </div>
    </template>

    <!-- Split View -->
    <template v-else>
      <div v-for="(hunk, hi) in splitViewHunks" :key="hi" class="hunk">
        <div class="hunk-header">{{ hunk.header }}</div>
        <div class="split-container">
          <div class="split-pane left">
            <template v-for="pair in hunk.lines" :key="pair.globalIndex">
              <template v-if="isLineVisible(pair.globalIndex)">
                <template v-if="pair.left">
                  <DiffLine
                    :line="pair.left"
                    :theme="theme"
                    :showLineNumbers="showLineNumbers"
                    :showPrefix="false"
                    :lineIndex="pair.globalIndex"
                    :isHighlighted="hoveredLineIndex === pair.globalIndex"
                    :lineWidgets="lineWidgets"
                    @line-hover="onLineHover"
                    @line-widget-click="(e) => onLineWidgetClick(e, pair.left!)"
                  />

                  <component
                    v-if="shouldShowInsertWidget(pair.left.oldLineNumber ?? 0) && activeInsertWidget?.widget.insertComponent"
                    :is="activeInsertWidget.widget.insertComponent"
                    v-bind="getInsertWidgetContext()"
                    @close="activeInsertWidget = null"
                  />
                </template>
                <div v-else class="empty-line" />

                <DiffCollapsedIndicator
                  v-if="getLineCollapseInfo(pair.globalIndex).isFirstLine && getLineCollapseInfo(pair.globalIndex).range"
                  :theme="theme"
                  :range="getLineCollapseInfo(pair.globalIndex).range!"
                  :hiddenCount="getLineCollapseInfo(pair.globalIndex).hiddenCount"
                  :showLineNumbers="showLineNumbers"
                  :showPrefix="false"
                  @toggle="onCollapsedRangeToggle(getLineCollapseInfo(pair.globalIndex).range!)"
                />
              </template>
            </template>
          </div>
          <div class="split-pane right">
            <template v-for="pair in hunk.lines" :key="pair.globalIndex">
              <template v-if="isLineVisible(pair.globalIndex)">
                <template v-if="pair.right">
                  <DiffLine
                    :line="pair.right"
                    :theme="theme"
                    :showLineNumbers="showLineNumbers"
                    :showPrefix="false"
                    :lineIndex="pair.globalIndex"
                    :isHighlighted="hoveredLineIndex === pair.globalIndex"
                    :lineWidgets="lineWidgets"
                    @line-hover="onLineHover"
                    @line-widget-click="(e) => onLineWidgetClick(e, pair.right!)"
                  />

                  <component
                    v-if="shouldShowInsertWidget(pair.right.newLineNumber ?? 0) && activeInsertWidget?.widget.insertComponent"
                    :is="activeInsertWidget.widget.insertComponent"
                    v-bind="getInsertWidgetContext()"
                    @close="activeInsertWidget = null"
                  />
                </template>
                <div v-else class="empty-line" />

                <DiffCollapsedIndicator
                  v-if="getLineCollapseInfo(pair.globalIndex).isFirstLine && getLineCollapseInfo(pair.globalIndex).range"
                  :theme="theme"
                  :range="getLineCollapseInfo(pair.globalIndex).range!"
                  :hiddenCount="getLineCollapseInfo(pair.globalIndex).hiddenCount"
                  :showLineNumbers="showLineNumbers"
                  :showPrefix="false"
                  @toggle="onCollapsedRangeToggle(getLineCollapseInfo(pair.globalIndex).range!)"
                />
              </template>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  toSplitViewLines,
  isDiffLineInCollapsedRange,
  type CodeViewerTheme,
  type DiffCollapsedRange,
  type DiffCollapsedRangeState,
  type DiffHunk,
  type DiffLine as DiffLineType,
  type DiffViewMode,
  type LineWidgetContext,
} from '@ngeenx/nx-code-viewer-utils';
import type { VueLineWidgetsInput, VueLineWidgetConfig, VueLineWidgetClickEvent } from '../../types/vue-code-viewer.types';
import { DiffLine } from '../../atoms/diff-line';
import { DiffCollapsedIndicator } from '../../atoms/diff-collapsed-indicator';

interface Props {
  hunks: readonly DiffHunk[];
  theme?: CodeViewerTheme;
  viewMode?: DiffViewMode;
  showLineNumbers?: boolean;
  maxHeight?: string;
  collapsedRangesState?: Map<string, DiffCollapsedRangeState>;
  lineWidgets?: VueLineWidgetsInput;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  viewMode: 'unified',
  showLineNumbers: true,
  maxHeight: '',
  collapsedRangesState: () => new Map(),
  lineWidgets: () => [],
});

const emit = defineEmits<{
  collapsedRangeToggle: [range: DiffCollapsedRange];
  lineWidgetClick: [event: VueLineWidgetClickEvent];
}>();

const hoveredLineIndex = ref<number>(-1);
const activeInsertWidget = ref<{ lineNumber: number; widget: VueLineWidgetConfig; line: string } | null>(null);

const containerStyle = computed(() => props.maxHeight ? { 'max-height': props.maxHeight } : {});
const isUnifiedView = computed(() => props.viewMode === 'unified');

const unifiedViewData = computed(() => {
  const result: { header: string; lines: { line: DiffLineType; globalIndex: number }[] }[] = [];
  let globalIndex = 0;

  for (const hunk of props.hunks) {
    const lines: { line: DiffLineType; globalIndex: number }[] = [];
    for (const line of hunk.lines) {
      lines.push({ line, globalIndex });
      globalIndex++;
    }
    result.push({ header: hunk.header, lines });
  }

  return result;
});

const splitViewHunks = computed(() => {
  let globalIndex = 0;
  return props.hunks.map(hunk => {
    const lines = toSplitViewLines(hunk.lines).map(pair => {
      const result = { ...pair, globalIndex };
      globalIndex++;
      return result;
    });
    return { header: hunk.header, lines };
  });
});

function getLineCollapseInfo(globalIndex: number) {
  return isDiffLineInCollapsedRange(globalIndex, props.collapsedRangesState);
}

function isLineVisible(globalIndex: number): boolean {
  const info = getLineCollapseInfo(globalIndex);
  return !info.isCollapsed || info.isFirstLine;
}

function onLineHover(lineIndex: number): void {
  hoveredLineIndex.value = lineIndex;
}

function onMouseLeave(): void {
  hoveredLineIndex.value = -1;
}

function onCollapsedRangeToggle(range: DiffCollapsedRange): void {
  emit('collapsedRangeToggle', range);
}

function onLineWidgetClick(event: VueLineWidgetClickEvent, line: DiffLineType): void {
  emit('lineWidgetClick', event);

  if (event.widget.insertComponent) {
    const current = activeInsertWidget.value;
    if (current?.lineNumber === event.lineNumber && current.widget === event.widget) {
      activeInsertWidget.value = null;
    } else {
      activeInsertWidget.value = { lineNumber: event.lineNumber, widget: event.widget, line: line.content };
    }
  }
}

function shouldShowInsertWidget(lineNumber: number): boolean {
  return activeInsertWidget.value !== null && activeInsertWidget.value.lineNumber === lineNumber;
}

function getInsertWidgetContext(): LineWidgetContext {
  const active = activeInsertWidget.value;
  return {
    line: active?.line ?? '',
    lineNumber: active?.lineNumber ?? 0,
    theme: props.theme,
  };
}
</script>
