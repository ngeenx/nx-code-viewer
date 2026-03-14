<script lang="ts">
  import {
    getDiffLinePrefix,
    type CodeViewerTheme,
    type DiffLine,
  } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    line: DiffLine;
    theme?: CodeViewerTheme;
    showLineNumbers?: boolean;
    showPrefix?: boolean;
    isHighlighted?: boolean;
    lineIndex?: number;
    onLineHover?: (lineIndex: number) => void;
  }

  let {
    line,
    theme = 'dark',
    showLineNumbers = true,
    showPrefix = true,
    isHighlighted = false,
    lineIndex = 0,
    onLineHover = () => {},
  }: Props = $props();

  const lineClasses = $derived(
    `diff-line ${line.type} ${theme} ${isHighlighted ? 'highlighted' : ''}`.trim()
  );
  const prefix = $derived(getDiffLinePrefix(line.type));
  const oldLineNum = $derived(line.oldLineNumber !== undefined ? String(line.oldLineNumber) : '');
  const newLineNum = $derived(line.newLineNumber !== undefined ? String(line.newLineNumber) : '');
  const hasHighlightedContent = $derived(!!line.highlightedContent);
</script>

<div class="nx-diff-line">
  <div class={lineClasses} onmouseenter={() => onLineHover(lineIndex)}>
    {#if showLineNumbers}
      <span class="line-number old">{oldLineNum}</span>
      <span class="line-number new">{newLineNum}</span>
    {/if}
    {#if showPrefix}
      <span class="prefix">{prefix}</span>
    {/if}
    {#if hasHighlightedContent}
      <span class="content">{@html line.highlightedContent}</span>
    {:else}
      <span class="content">{line.content}</span>
    {/if}
  </div>
</div>
