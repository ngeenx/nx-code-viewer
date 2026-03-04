<template>
  <div class="nx-tab-bar">
  <div role="tablist" class="tab-list" :class="theme">
    <TabHeader
      v-for="(tab, i) in tabs"
      :key="tab.id"
      :tabId="tab.id"
      :fileName="tab.fileName"
      :fileExtension="tab.fileExtension || ''"
      :isActive="tab.id === activeTabId"
      :theme="theme"
      @tab-click="onTabClick"
      @tab-keydown="(event) => onTabKeydown(event, i)"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import type { CodeViewerTheme, MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';
import { TabHeader } from '../../atoms/tab-header';

interface Props {
  tabs: readonly MultiCodeViewerTabItem[];
  activeTabId: string;
  theme?: CodeViewerTheme;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
});

const emit = defineEmits<{
  tabChange: [tabId: string];
}>();

function onTabClick(tabId: string): void {
  if (tabId !== props.activeTabId) {
    emit('tabChange', tabId);
  }
}

function onTabKeydown(event: KeyboardEvent, currentIndex: number): void {
  const tabs = props.tabs;
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
    emit('tabChange', tabs[newIndex].id);
  }
}
</script>
