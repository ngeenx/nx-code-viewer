<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      title="greet.ts"
      fileExtension="ts"
    />
  </div>
</template>

<script setup lang="ts">
import { CodeViewer, type CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';
const sample = `export const greet = (name: string): string =>
  \`Hello, \${name}!\`;
`;
</script>

<style scoped>
.stage {
  width: 500px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
