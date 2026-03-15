<template>
  <CodeBlock
    :content="highlightedHtml"
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
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { countLines, type CodeViewerTheme, type CopyButtonState } from '@ngeenx/nx-code-viewer-utils';
import { useCodeHighlighter } from '../../composables';
import CodeBlock from './CodeBlock.vue';

interface Props {
  code?: string;
  theme?: CodeViewerTheme;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
  maxHeight?: string;
  isLoading?: boolean;
  showCopyButton?: boolean;
  copyState?: CopyButtonState;
  highlightedLinesSet?: Set<number>;
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  theme: 'dark',
  showLineNumbers: true,
  wordWrap: false,
  maxHeight: '',
  isLoading: false,
  showCopyButton: true,
  copyState: 'idle',
  highlightedLinesSet: () => new Set(),
});

const highlighter = useCodeHighlighter();
const highlightedHtml = ref<string | null>(null);
const lineCount = ref(0);

function handleCopyClick() {
  console.log('Copy clicked');
}

watch(
  [() => props.code, () => props.theme],
  async ([code, theme]) => {
    lineCount.value = countLines(code);
    if (!code) {
      highlightedHtml.value = null;
      return;
    }
    const result = await highlighter.highlightToHtml({ code, language: 'typescript', theme });
    highlightedHtml.value = result.html;
  },
  { immediate: true }
);
</script>
