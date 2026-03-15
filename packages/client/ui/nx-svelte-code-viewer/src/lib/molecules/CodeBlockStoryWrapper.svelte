<script lang="ts">
  import { countLines, type CodeViewerTheme, type CopyButtonState } from '@ngeenx/nx-code-viewer-utils';
  import { useCodeHighlighter } from '../composables';
  import CodeBlock from './CodeBlock.svelte';

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

  let {
    code = '',
    theme = 'dark',
    showLineNumbers = true,
    wordWrap = false,
    maxHeight = '',
    isLoading = false,
    showCopyButton = true,
    copyState = 'idle',
    highlightedLinesSet = new Set<number>(),
  }: Props = $props();

  const highlighter = useCodeHighlighter();
  let highlightedHtml: string | null = $state(null);
  let lineCount = $derived(countLines(code));

  function handleCopyClick() {
    console.log('Copy clicked');
  }

  $effect(() => {
    if (!code) {
      highlightedHtml = null;
      return;
    }
    highlighter.highlightToHtml({ code, language: 'typescript', theme }).then(result => {
      highlightedHtml = result.html;
    });
  });
</script>

<CodeBlock
  content={highlightedHtml}
  {lineCount}
  {theme}
  {showLineNumbers}
  {wordWrap}
  {maxHeight}
  {isLoading}
  {showCopyButton}
  {copyState}
  copyClick={handleCopyClick}
  {highlightedLinesSet}
/>
