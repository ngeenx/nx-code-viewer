<template>
  <div class="border-styles-demo" :data-theme="theme">
    <figure v-for="style in borderStyles" :key="style" class="item">
      <figcaption class="caption">{{ style }}</figcaption>

      <CodeViewer
        :class="codeViewerThemeClass"
        :code="sample"
        :language="language"
        :theme="theme"
        :shikiTheme="shikiTheme"
        :borderStyle="style"
        :showHeader="false"
        :showLineNumbers="false"
      />
    </figure>
  </div>
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';
const borderStyles: CodeViewerBorderStyle[] = [
  'classic',
  'grid-cross',
  'corner-intersection',
  'none',
];

const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;
</script>

<style scoped>
.border-styles-demo {
  margin: 5rem;
  display: grid;
  gap: 1.25rem;
}

.item {
  margin: 0;
}

.caption {
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 1rem;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  color: color-mix(in oklab, currentColor 65%, transparent);
}
</style>
