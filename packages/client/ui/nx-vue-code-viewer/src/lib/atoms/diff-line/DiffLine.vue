<template>
  <div class="nx-diff-line">
  <div :class="lineClasses" @mouseenter="onMouseEnter">
    <!-- Left widgets -->
    <div v-if="leftWidgets.length > 0" class="line-widgets-left">
      <div
        v-for="(widget, i) in leftWidgets"
        :key="`left-${i}`"
        @click="onWidgetClick(widget)"
      >
        <component :is="widget.lineComponent" v-bind="widgetContext" />
      </div>
    </div>

    <span v-if="showLineNumbers" class="line-number old">{{ oldLineNum }}</span>
    <span v-if="showLineNumbers" class="line-number new">{{ newLineNum }}</span>
    <span v-if="showPrefix" class="prefix">{{ prefix }}</span>
    <span v-if="hasHighlightedContent" class="content" v-html="highlightedContent" />
    <span v-else class="content">{{ content }}</span>

    <!-- Right widgets -->
    <div v-if="rightWidgets.length > 0" class="line-widgets-right">
      <div
        v-for="(widget, i) in rightWidgets"
        :key="`right-${i}`"
        @click="onWidgetClick(widget)"
      >
        <component :is="widget.lineComponent" v-bind="widgetContext" />
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  getDiffLinePrefix,
  getMatchingWidgets,
  type CodeViewerTheme,
  type DiffLine,
  type LineWidgetContext,
} from '@ngeenx/nx-code-viewer-utils';
import type { VueLineWidgetsInput, VueLineWidgetConfig, VueLineWidgetClickEvent } from '../../types/vue-code-viewer.types';

interface Props {
  line: DiffLine;
  theme?: CodeViewerTheme;
  showLineNumbers?: boolean;
  showPrefix?: boolean;
  isHighlighted?: boolean;
  lineIndex?: number;
  lineWidgets?: VueLineWidgetsInput;
  showWidgets?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  showLineNumbers: true,
  showPrefix: true,
  isHighlighted: false,
  lineIndex: 0,
  lineWidgets: () => [],
  showWidgets: false,
});

const emit = defineEmits<{
  lineHover: [lineIndex: number];
  lineWidgetClick: [event: VueLineWidgetClickEvent];
}>();

const lineClasses = computed(() => {
  const highlighted = props.isHighlighted ? 'highlighted' : '';
  return `diff-line ${props.line.type} ${props.theme} ${highlighted}`.trim();
});

const prefix = computed(() => getDiffLinePrefix(props.line.type));
const oldLineNum = computed(() => props.line.oldLineNumber !== undefined ? String(props.line.oldLineNumber) : '');
const newLineNum = computed(() => props.line.newLineNumber !== undefined ? String(props.line.newLineNumber) : '');
const content = computed(() => props.line.content);
const hasHighlightedContent = computed(() => !!props.line.highlightedContent);
const highlightedContent = computed(() => props.line.highlightedContent ?? '');
const lineNumber = computed(() => props.line.newLineNumber ?? props.line.oldLineNumber ?? 0);

const alwaysWidgets = computed<VueLineWidgetConfig[]>(() => {
  if (!props.lineWidgets?.length) return [];
  return (getMatchingWidgets(props.lineWidgets as any, content.value, lineNumber.value) as VueLineWidgetConfig[]).filter(w => w.display === 'always');
});

const hoverWidgets = computed<VueLineWidgetConfig[]>(() => {
  if (!props.lineWidgets?.length) return [];
  return (getMatchingWidgets(props.lineWidgets as any, content.value, lineNumber.value) as VueLineWidgetConfig[]).filter(w => w.display === 'hover');
});

const leftWidgets = computed(() => {
  const always = alwaysWidgets.value.filter(w => w.position === 'left');
  const hover = (props.showWidgets || props.isHighlighted) ? hoverWidgets.value.filter(w => w.position === 'left') : [];
  return [...always, ...hover];
});

const rightWidgets = computed(() => {
  const always = alwaysWidgets.value.filter(w => w.position === 'right');
  const hover = (props.showWidgets || props.isHighlighted) ? hoverWidgets.value.filter(w => w.position === 'right') : [];
  return [...always, ...hover];
});

const widgetContext = computed<LineWidgetContext>(() => ({
  line: content.value,
  lineNumber: lineNumber.value,
  theme: props.theme,
}));

function onMouseEnter(): void {
  emit('lineHover', props.lineIndex);
}

function onWidgetClick(widget: VueLineWidgetConfig): void {
  emit('lineWidgetClick', {
    lineNumber: lineNumber.value,
    line: content.value,
    widget,
  });
}
</script>
