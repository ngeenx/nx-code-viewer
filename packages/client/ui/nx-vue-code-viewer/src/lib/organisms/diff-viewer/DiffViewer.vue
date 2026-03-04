<template>
  <div class="nx-diff-viewer">
  <article :class="`${theme} border-${borderStyle}`">
    <div v-if="borderStyle === 'grid-cross'" class="border-overlay">
      <div class="border-top" /><div class="border-bottom" /><div class="border-left" /><div class="border-right" />
      <div class="corner-cross corner-top-left-h" /><div class="corner-cross corner-top-left-v" />
      <div class="corner-cross corner-top-right-h" /><div class="corner-cross corner-top-right-v" />
      <div class="corner-cross corner-bottom-left-h" /><div class="corner-cross corner-bottom-left-v" />
      <div class="corner-cross corner-bottom-right-h" /><div class="corner-cross corner-bottom-right-v" />
    </div>
    <div v-if="borderStyle === 'corner-intersection'" class="border-overlay">
      <div class="border-top-extended" /><div class="border-bottom-extended" /><div class="border-left-extended" /><div class="border-right-extended" />
    </div>

    <CodeHeader
      v-if="showHeader"
      :language="language"
      :title="displayTitle"
      :theme="theme"
      :fileExtension="fileExtension"
    />

    <template v-if="hasChanges">
      <div class="diff-stats" :class="theme">
        <span class="stat added">+{{ stats.added }}</span>
        <span class="stat removed">-{{ stats.removed }}</span>
      </div>

      <DiffBlock
        :hunks="hunks"
        :theme="theme"
        :viewMode="viewMode"
        :showLineNumbers="showLineNumbers"
        :maxHeight="maxHeight"
        :collapsedRangesState="collapsedRangesState"
        :lineWidgets="lineWidgets"
        @collapsed-range-toggle="onCollapsedRangeToggle"
        @line-widget-click="onLineWidgetClick"
      />
    </template>
    <div v-else class="no-changes" :class="theme">No changes to display</div>
  </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import {
  DEFAULT_DIFF_VIEWER_CONFIG,
  parseDiff,
  computeDiff,
  getDiffStats,
  parseDiffCollapsedRanges,
  createDiffCollapsedRangesState,
  diffRangeToKey,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
  type CodeViewerTheme,
  type DiffCollapsedLinesInput,
  type DiffCollapsedRange,
  type DiffCollapsedRangeState,
  type DiffCollapsedRangeToggleEvent,
  type DiffViewMode,
  type ParsedDiff,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import type { VueLineWidgetsInput, VueLineWidgetClickEvent } from '../../types/vue-code-viewer.types';
import { useCodeHighlighter } from '../../composables/useCodeHighlighter';
import { CodeHeader } from '../../atoms/code-header';
import { DiffBlock } from '../../molecules/diff-block';

interface Props {
  diff?: string;
  oldCode?: string;
  newCode?: string;
  viewMode?: DiffViewMode;
  language?: CodeViewerLanguage;
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  maxHeight?: string;
  oldFileName?: string;
  newFileName?: string;
  fileExtension?: string;
  borderStyle?: CodeViewerBorderStyle;
  collapsedLines?: DiffCollapsedLinesInput;
  lineWidgets?: VueLineWidgetsInput;
}

const props = withDefaults(defineProps<Props>(), {
  diff: '',
  oldCode: '',
  newCode: '',
  viewMode: () => DEFAULT_DIFF_VIEWER_CONFIG.viewMode,
  language: () => DEFAULT_DIFF_VIEWER_CONFIG.language,
  theme: () => DEFAULT_DIFF_VIEWER_CONFIG.theme,
  showLineNumbers: () => DEFAULT_DIFF_VIEWER_CONFIG.showLineNumbers,
  showHeader: () => DEFAULT_DIFF_VIEWER_CONFIG.showHeader,
  maxHeight: '',
  oldFileName: '',
  newFileName: '',
  fileExtension: '',
  borderStyle: 'classic',
  lineWidgets: () => [],
});

const emit = defineEmits<{
  collapsedRangeToggle: [event: DiffCollapsedRangeToggleEvent];
  lineWidgetClick: [event: VueLineWidgetClickEvent];
}>();

const highlighter = useCodeHighlighter();
const parsedDiff = ref<ParsedDiff>({ hunks: [] });
const collapsedRangesState = ref<Map<string, DiffCollapsedRangeState>>(new Map());
let highlightAbortController: AbortController | null = null;

const hunks = computed(() => parsedDiff.value.hunks);
const hasChanges = computed(() => parsedDiff.value.hunks.length > 0);

const displayTitle = computed(() => {
  const newFile = props.newFileName || parsedDiff.value.newFileName;
  const oldFile = props.oldFileName || parsedDiff.value.oldFileName;
  if (newFile && oldFile && newFile !== oldFile) return `${oldFile} → ${newFile}`;
  return newFile || oldFile || '';
});

const stats = computed(() => getDiffStats(parsedDiff.value));

watch(
  [() => props.diff, () => props.oldCode, () => props.newCode, () => props.language, () => props.theme, () => props.shikiTheme],
  ([diffValue, oldCode, newCode, language, theme, shikiTheme]) => {
    void processDiff(diffValue, oldCode, newCode, language, theme, shikiTheme);
  },
  { immediate: true }
);

watch(
  () => props.collapsedLines,
  (collapsedInput) => {
    const parsedRanges = parseDiffCollapsedRanges(collapsedInput);
    collapsedRangesState.value = createDiffCollapsedRangesState(parsedRanges);
  },
  { immediate: true }
);

onUnmounted(() => {
  abortPendingHighlight();
});

async function processDiff(
  diffValue: string,
  oldCodeValue: string,
  newCodeValue: string,
  language: CodeViewerLanguage,
  theme: CodeViewerTheme,
  shikiTheme?: ShikiThemeName
): Promise<void> {
  abortPendingHighlight();

  let parsed: ParsedDiff;

  if (diffValue) {
    parsed = parseDiff(diffValue);
  } else if (oldCodeValue || newCodeValue) {
    parsed = computeDiff(oldCodeValue, newCodeValue);
  } else {
    parsedDiff.value = { hunks: [] };
    return;
  }

  parsedDiff.value = parsed;

  if (language === 'plaintext') return;

  highlightAbortController = new AbortController();
  const { signal } = highlightAbortController;

  const oldLines: string[] = [];
  const newLines: string[] = [];

  for (const hunk of parsed.hunks) {
    for (const line of hunk.lines) {
      if (line.type === 'removed' || line.type === 'unchanged') oldLines.push(line.content);
      if (line.type === 'added' || line.type === 'unchanged') newLines.push(line.content);
    }
  }

  const [highlightedOldLines, highlightedNewLines] = await Promise.all([
    highlighter.highlightLines({ code: oldLines.join('\n'), language, theme, signal, shikiTheme }),
    highlighter.highlightLines({ code: newLines.join('\n'), language, theme, signal, shikiTheme }),
  ]);

  if (signal.aborted) return;

  parsedDiff.value = {
    ...parsed,
    hunks: applyHighlighting(parsed.hunks, highlightedOldLines, highlightedNewLines),
  };
}

function applyHighlighting(hunks: any[], oldLines: string[], newLines: string[]): any[] {
  let oldIndex = 0;
  let newIndex = 0;

  return hunks.map(hunk => ({
    ...hunk,
    lines: hunk.lines.map((line: any) => {
      let highlightedContent: string | undefined;

      if (line.type === 'removed') highlightedContent = oldLines[oldIndex++];
      else if (line.type === 'added') highlightedContent = newLines[newIndex++];
      else if (line.type === 'unchanged') {
        highlightedContent = oldLines[oldIndex++];
        newIndex++;
      }

      return highlightedContent ? { ...line, highlightedContent } : line;
    }),
  }));
}

function abortPendingHighlight(): void {
  if (highlightAbortController) {
    highlightAbortController.abort();
    highlightAbortController = null;
  }
}

function onCollapsedRangeToggle(range: DiffCollapsedRange): void {
  const key = diffRangeToKey(range);
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
