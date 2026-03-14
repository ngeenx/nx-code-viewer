<script lang="ts">
  import {
    DEFAULT_MULTI_CODE_VIEWER_CONFIG,
    isCodeTabItem,
    isDiffTabItem,
    type CodeViewerBorderStyle,
    type CodeViewerTheme,
    type MultiCodeViewerTabItem,
    type ShikiThemeName,
    type TabChangeEvent,
  } from '@ngeenx/nx-code-viewer-utils';
  import TabBar from '../molecules/TabBar.svelte';
  import CodeViewer from './CodeViewer.svelte';
  import DiffViewer from './DiffViewer.svelte';

  interface Props {
    tabs: readonly MultiCodeViewerTabItem[];
    theme?: CodeViewerTheme;
    shikiTheme?: ShikiThemeName;
    borderStyle?: CodeViewerBorderStyle;
    showContentHeader?: boolean;
    initialActiveTabId?: string;
    onActiveTabChange?: (event: TabChangeEvent) => void;
    onCodeCopied?: (tabId: string) => void;
  }

  let {
    tabs,
    theme = DEFAULT_MULTI_CODE_VIEWER_CONFIG.theme,
    shikiTheme = undefined,
    borderStyle = DEFAULT_MULTI_CODE_VIEWER_CONFIG.borderStyle,
    showContentHeader = DEFAULT_MULTI_CODE_VIEWER_CONFIG.showContentHeader,
    initialActiveTabId = '',
    onActiveTabChange = () => {},
    onCodeCopied = () => {},
  }: Props = $props();

  let activeTabIdInternal = $state('');

  const activeTabId = $derived.by(() => {
    if (activeTabIdInternal) return activeTabIdInternal;
    if (initialActiveTabId) return initialActiveTabId;
    return tabs.length > 0 ? tabs[0].id : '';
  });

  $effect(() => {
    if (initialActiveTabId) {
      activeTabIdInternal = initialActiveTabId;
    }
  });

  function onTabChange(tabId: string): void {
    const previousId = activeTabId;
    const newIndex = tabs.findIndex(tab => tab.id === tabId);

    if (newIndex >= 0 && tabId !== previousId) {
      activeTabIdInternal = tabId;
      onActiveTabChange({
        previousTabId: previousId || null,
        currentTabId: tabId,
        currentIndex: newIndex,
      });
    }
  }
</script>

<div class="nx-multi-code-viewer">
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

    <TabBar
      {tabs}
      {activeTabId}
      {theme}
      {onTabChange}
    />

    <div class="tab-panels">
      {#each tabs as tab (tab.id)}
        <div
          role="tabpanel"
          id="panel-{tab.id}"
          aria-labelledby="tab-{tab.id}"
          class={tab.id !== activeTabId ? 'hidden' : 'active'}
        >
          {#if isCodeTabItem(tab)}
            <CodeViewer
              code={tab.code}
              language={tab.language || 'plaintext'}
              {theme}
              {shikiTheme}
              showHeader={showContentHeader}
              title={tab.fileName}
              fileExtension={tab.fileExtension || ''}
              showLineNumbers={tab.showLineNumbers ?? true}
              showCopyButton={tab.showCopyButton ?? true}
              maxHeight={tab.maxHeight || ''}
              wordWrap={tab.wordWrap ?? false}
              highlightedLines={tab.highlightedLines}
              borderStyle="none"
              onCodeCopied={() => onCodeCopied(tab.id)}
            />
          {/if}

          {#if isDiffTabItem(tab)}
            <DiffViewer
              diff={tab.diff || ''}
              oldCode={tab.oldCode || ''}
              newCode={tab.newCode || ''}
              language={tab.language || 'plaintext'}
              {theme}
              {shikiTheme}
              showHeader={showContentHeader}
              showLineNumbers={tab.showLineNumbers ?? true}
              viewMode={tab.viewMode || 'unified'}
              maxHeight={tab.maxHeight || ''}
              oldFileName={tab.oldFileName || ''}
              newFileName={tab.newFileName || ''}
              fileExtension={tab.fileExtension || ''}
              borderStyle="none"
            />
          {/if}
        </div>
      {/each}
    </div>
  </article>
</div>
