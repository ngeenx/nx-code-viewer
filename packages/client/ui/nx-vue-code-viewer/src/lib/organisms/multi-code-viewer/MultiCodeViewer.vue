<template>
  <article :class="`${theme} border-${borderStyle}`" class="nx-multi-code-viewer">
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

    <TabBar
      :tabs="tabs"
      :activeTabId="activeTabId"
      :theme="theme"
      @tab-change="onTabChange"
    />

    <div class="tab-panels">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        role="tabpanel"
        :id="`panel-${tab.id}`"
        :aria-labelledby="`tab-${tab.id}`"
        :class="{ hidden: tab.id !== activeTabId, active: tab.id === activeTabId }"
      >
        <CodeViewer
          v-if="isCodeTab(tab)"
          :code="tab.code"
          :language="tab.language || 'plaintext'"
          :theme="theme"
          :shikiTheme="shikiTheme"
          :showHeader="showContentHeader"
          :title="tab.fileName"
          :fileExtension="tab.fileExtension || ''"
          :showLineNumbers="tab.showLineNumbers ?? true"
          :showCopyButton="tab.showCopyButton ?? true"
          :maxHeight="tab.maxHeight || ''"
          :wordWrap="tab.wordWrap ?? false"
          :highlightedLines="tab.highlightedLines"
          borderStyle="none"
          @code-copied="onCodeCopied(tab.id)"
        />

        <DiffViewer
          v-if="isDiffTab(tab)"
          :diff="tab.diff || ''"
          :oldCode="tab.oldCode || ''"
          :newCode="tab.newCode || ''"
          :language="tab.language || 'plaintext'"
          :theme="theme"
          :shikiTheme="shikiTheme"
          :showHeader="showContentHeader"
          :showLineNumbers="tab.showLineNumbers ?? true"
          :viewMode="tab.viewMode || 'unified'"
          :maxHeight="tab.maxHeight || ''"
          :oldFileName="tab.oldFileName || ''"
          :newFileName="tab.newFileName || ''"
          :fileExtension="tab.fileExtension || ''"
          borderStyle="none"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
import { TabBar } from '../../molecules/tab-bar';
import { CodeViewer } from '../code-viewer';
import { DiffViewer } from '../diff-viewer';

interface Props {
  tabs: readonly MultiCodeViewerTabItem[];
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  borderStyle?: CodeViewerBorderStyle;
  showContentHeader?: boolean;
  initialActiveTabId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => DEFAULT_MULTI_CODE_VIEWER_CONFIG.theme,
  borderStyle: () => DEFAULT_MULTI_CODE_VIEWER_CONFIG.borderStyle,
  showContentHeader: () => DEFAULT_MULTI_CODE_VIEWER_CONFIG.showContentHeader,
  initialActiveTabId: '',
});

const emit = defineEmits<{
  activeTabChange: [event: TabChangeEvent];
  codeCopied: [tabId: string];
}>();

const activeTabIdInternal = ref<string>('');

const activeTabId = computed(() => {
  if (activeTabIdInternal.value) return activeTabIdInternal.value;
  if (props.initialActiveTabId) return props.initialActiveTabId;
  return props.tabs.length > 0 ? props.tabs[0].id : '';
});

watch(
  () => props.initialActiveTabId,
  (initial) => {
    if (initial) activeTabIdInternal.value = initial;
  },
  { immediate: true }
);

const isCodeTab = isCodeTabItem;
const isDiffTab = isDiffTabItem;

function onTabChange(tabId: string): void {
  const previousId = activeTabId.value;
  const tabs = props.tabs;
  const newIndex = tabs.findIndex(tab => tab.id === tabId);

  if (newIndex >= 0 && tabId !== previousId) {
    activeTabIdInternal.value = tabId;
    emit('activeTabChange', {
      previousTabId: previousId || null,
      currentTabId: tabId,
      currentIndex: newIndex,
    });
  }
}

function onCodeCopied(tabId: string): void {
  emit('codeCopied', tabId);
}
</script>
