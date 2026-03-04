<template>
  <header :class="theme" class="nx-code-header">
    <div class="title-container">
      <img v-if="iconUrl" :src="iconUrl" class="file-icon" :alt="title" />
      <span class="title">{{ displayText }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  getLanguageDisplayName,
  getFileIconUrl,
  getExtensionFromLanguage,
  type CodeViewerLanguage,
  type CodeViewerTheme,
} from '@ngeenx/nx-code-viewer-utils';

interface Props {
  language?: CodeViewerLanguage;
  title?: string;
  theme?: CodeViewerTheme;
  fileExtension?: string;
}

const props = withDefaults(defineProps<Props>(), {
  language: 'plaintext',
  title: '',
  theme: 'dark',
  fileExtension: '',
});

const displayText = computed(() => {
  if (props.title) return props.title;
  return getLanguageDisplayName(props.language);
});

const iconUrl = computed<string | null>(() => {
  if (props.fileExtension) return getFileIconUrl(props.fileExtension);
  const langExt = getExtensionFromLanguage(props.language);
  if (langExt) return getFileIconUrl(langExt);
  return null;
});
</script>
