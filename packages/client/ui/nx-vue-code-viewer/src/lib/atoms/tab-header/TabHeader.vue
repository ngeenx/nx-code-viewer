<template>
  <button
    type="button"
    role="tab"
    :aria-selected="isActive"
    :aria-controls="`panel-${tabId}`"
    :id="`tab-${tabId}`"
    :tabindex="isActive ? 0 : -1"
    :class="[theme, { active: isActive }]"
    @click="onClick"
    @keydown="onKeydown"
  >
    <img v-if="iconUrl" :src="iconUrl" class="file-icon" :alt="fileName" />
    <span class="file-name">{{ fileName }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getFileIconUrl, type CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

interface Props {
  tabId: string;
  fileName: string;
  fileExtension?: string;
  isActive?: boolean;
  theme?: CodeViewerTheme;
}

const props = withDefaults(defineProps<Props>(), {
  fileExtension: '',
  isActive: false,
  theme: 'dark',
});

const emit = defineEmits<{
  tabClick: [tabId: string];
  tabKeydown: [event: KeyboardEvent];
}>();

const iconUrl = computed<string | null>(() => {
  return props.fileExtension ? getFileIconUrl(props.fileExtension) : null;
});

function onClick(): void {
  emit('tabClick', props.tabId);
}

function onKeydown(event: KeyboardEvent): void {
  emit('tabKeydown', event);
}
</script>
