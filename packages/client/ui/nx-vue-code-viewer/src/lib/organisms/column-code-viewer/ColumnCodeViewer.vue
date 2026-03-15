<template>
  <div class="nx-column-code-viewer">
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

    <div class="columns-container">
      <div
        v-for="(column, index) in columns"
        :key="column.id"
        :class="['column', { 'column-divider': index < columns.length - 1 }]"
      >
        <CodeViewer
          v-if="isCodeColumn(column)"
          :code="column.code"
          :language="column.language || 'plaintext'"
          :theme="theme"
          :shikiTheme="shikiTheme"
          :showHeader="showColumnHeaders"
          :title="column.title || ''"
          :fileExtension="column.fileExtension || ''"
          :showLineNumbers="column.showLineNumbers ?? true"
          :showCopyButton="column.showCopyButton ?? true"
          :maxHeight="maxHeight"
          :wordWrap="column.wordWrap ?? false"
          :enableLineHover="enableLineHover"
          :highlightedLines="column.highlightedLines"
          borderStyle="none"
          @code-copied="onCodeCopied(column.id)"
        />

        <DiffViewer
          v-if="isDiffColumn(column)"
          :diff="column.diff || ''"
          :oldCode="column.oldCode || ''"
          :newCode="column.newCode || ''"
          :language="column.language || 'plaintext'"
          :theme="theme"
          :shikiTheme="shikiTheme"
          :showHeader="showColumnHeaders"
          :showLineNumbers="column.showLineNumbers ?? true"
          :viewMode="column.viewMode || 'unified'"
          :maxHeight="maxHeight"
          :oldFileName="column.oldFileName || ''"
          :newFileName="column.newFileName || ''"
          :fileExtension="column.fileExtension || ''"
          borderStyle="none"
        />
      </div>
    </div>
  </article>
  </div>
</template>

<script setup lang="ts">
import {
  DEFAULT_COLUMN_CODE_VIEWER_CONFIG,
  isColumnCodeItem,
  isColumnDiffItem,
  type CodeViewerBorderStyle,
  type CodeViewerTheme,
  type ColumnItem,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import { CodeViewer } from '../code-viewer';
import { DiffViewer } from '../diff-viewer';

interface Props {
  columns: readonly ColumnItem[];
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  borderStyle?: CodeViewerBorderStyle;
  showColumnHeaders?: boolean;
  maxHeight?: string;
  enableLineHover?: boolean;
}

withDefaults(defineProps<Props>(), {
  theme: () => DEFAULT_COLUMN_CODE_VIEWER_CONFIG.theme,
  borderStyle: () => DEFAULT_COLUMN_CODE_VIEWER_CONFIG.borderStyle,
  showColumnHeaders: () => DEFAULT_COLUMN_CODE_VIEWER_CONFIG.showColumnHeaders,
  maxHeight: '',
  enableLineHover: true,
});

const emit = defineEmits<{
  codeCopied: [columnId: string];
}>();

const isCodeColumn = isColumnCodeItem;
const isDiffColumn = isColumnDiffItem;

function onCodeCopied(columnId: string): void {
  emit('codeCopied', columnId);
}
</script>
