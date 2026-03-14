<script lang="ts">
  import type { CodeViewerTheme, MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';
  import TabHeader from '../atoms/TabHeader.svelte';

  interface Props {
    tabs: readonly MultiCodeViewerTabItem[];
    activeTabId: string;
    theme?: CodeViewerTheme;
    onTabChange?: (tabId: string) => void;
  }

  let {
    tabs,
    activeTabId,
    theme = 'dark',
    onTabChange = () => {},
  }: Props = $props();

  function onTabClick(tabId: string): void {
    if (tabId !== activeTabId) {
      onTabChange(tabId);
    }
  }

  function onTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
    }

    if (newIndex !== null) {
      event.preventDefault();
      onTabChange(tabs[newIndex].id);
    }
  }
</script>

<div class="nx-tab-bar">
  <div role="tablist" class="tab-list {theme}">
    {#each tabs as tab, i (tab.id)}
      <TabHeader
        tabId={tab.id}
        fileName={tab.fileName}
        fileExtension={tab.fileExtension || ''}
        isActive={tab.id === activeTabId}
        {theme}
        {onTabClick}
        onTabKeydown={(event) => onTabKeydown(event, i)}
      />
    {/each}
  </div>
</div>
