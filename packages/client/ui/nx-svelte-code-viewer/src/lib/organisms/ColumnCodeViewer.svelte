<script lang="ts">
  import {
    DEFAULT_COLUMN_CODE_VIEWER_CONFIG,
    isColumnCodeItem,
    isColumnDiffItem,
    type CodeViewerBorderStyle,
    type CodeViewerTheme,
    type ColumnItem,
    type ShikiThemeName,
  } from '@ngeenx/nx-code-viewer-utils';
  import CodeViewer from './CodeViewer.svelte';
  import DiffViewer from './DiffViewer.svelte';

  interface Props {
    columns: readonly ColumnItem[];
    theme?: CodeViewerTheme;
    shikiTheme?: ShikiThemeName;
    borderStyle?: CodeViewerBorderStyle;
    showColumnHeaders?: boolean;
    maxHeight?: string;
    enableLineHover?: boolean;
    onCodeCopied?: (columnId: string) => void;
  }

  let {
    columns,
    theme = DEFAULT_COLUMN_CODE_VIEWER_CONFIG.theme,
    shikiTheme = undefined,
    borderStyle = DEFAULT_COLUMN_CODE_VIEWER_CONFIG.borderStyle,
    showColumnHeaders = DEFAULT_COLUMN_CODE_VIEWER_CONFIG.showColumnHeaders,
    maxHeight = '',
    enableLineHover = true,
    onCodeCopied = () => {},
  }: Props = $props();
</script>

<div class="nx-column-code-viewer">
  <article class="{theme} border-{borderStyle}">
    {#if borderStyle === 'grid-cross'}
      <div class="border-overlay">
        <div class="border-top"></div><div class="border-bottom"></div><div class="border-left"></div><div class="border-right"></div>
        <div class="corner-cross corner-top-left-h"></div><div class="corner-cross corner-top-left-v"></div>
        <div class="corner-cross corner-top-right-h"></div><div class="corner-cross corner-top-right-v"></div>
        <div class="corner-cross corner-bottom-left-h"></div><div class="corner-cross corner-bottom-left-v"></div>
        <div class="corner-cross corner-bottom-right-h"></div><div class="corner-cross corner-bottom-right-v"></div>
      </div>
    {/if}

    {#if borderStyle === 'corner-intersection'}
      <div class="border-overlay">
        <div class="border-top-extended"></div><div class="border-bottom-extended"></div><div class="border-left-extended"></div><div class="border-right-extended"></div>
      </div>
    {/if}

    <div class="columns-container">
      {#each columns as column, index (column.id)}
        <div class="column{index < columns.length - 1 ? ' column-divider' : ''}">
          {#if isColumnCodeItem(column)}
            <CodeViewer
              code={column.code}
              language={column.language || 'plaintext'}
              {theme}
              {shikiTheme}
              showHeader={showColumnHeaders}
              title={column.title || ''}
              fileExtension={column.fileExtension || ''}
              showLineNumbers={column.showLineNumbers ?? true}
              showCopyButton={column.showCopyButton ?? true}
              {maxHeight}
              wordWrap={column.wordWrap ?? false}
              {enableLineHover}
              highlightedLines={column.highlightedLines}
              borderStyle="none"
              onCodeCopied={() => onCodeCopied(column.id)}
            />
          {/if}

          {#if isColumnDiffItem(column)}
            <DiffViewer
              diff={column.diff || ''}
              oldCode={column.oldCode || ''}
              newCode={column.newCode || ''}
              language={column.language || 'plaintext'}
              {theme}
              {shikiTheme}
              showHeader={showColumnHeaders}
              showLineNumbers={column.showLineNumbers ?? true}
              viewMode={column.viewMode || 'unified'}
              {maxHeight}
              oldFileName={column.oldFileName || ''}
              newFileName={column.newFileName || ''}
              fileExtension={column.fileExtension || ''}
              borderStyle="none"
            />
          {/if}
        </div>
      {/each}
    </div>
  </article>
</div>
