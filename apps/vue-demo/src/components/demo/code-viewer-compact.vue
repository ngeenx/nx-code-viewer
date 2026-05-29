<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :showHeader="false"
      :showLineNumbers="false"
    />
  </div>
</template>

<script setup lang="ts">
import { CodeViewer, type CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'bash';
const sample = `pnpm install @ngeenx/nx-vue-code-viewer`;
</script>

<style scoped>
.stage {
  width: 500px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
