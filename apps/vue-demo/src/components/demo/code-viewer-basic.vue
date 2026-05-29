<template>
  <CodeViewer
    :class="codeViewerThemeClass"
    :code="sample"
    language="typescript"
    :theme="theme"
    :shikiTheme="shikiTheme"
  />
</template>

<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const sample = `const greet = (name: string): string =>
  \`Hello, \${name}!\`;

console.log(greet('World'));`;
</script>

<style scoped>
.nx-code-viewer {
  width: 500px;
}
</style>
