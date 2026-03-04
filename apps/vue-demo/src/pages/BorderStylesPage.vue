<template>
  <div class="page-container" :class="{ dark: theme === 'dark', light: theme === 'light' }">
    <header class="page-header">
      <h1 class="page-title">Border Styles</h1>
      <p class="page-description">
        Choose from different border style variants to match your design aesthetic:
        classic, grid-cross, corner-intersection, and none.
      </p>
    </header>

    <section class="demo-section">
      <h2 class="demo-section-title">Available Border Styles</h2>
      <div v-for="borderStyle in borderStyles" :key="borderStyle" class="demo-item">
        <h3 class="demo-item-subtitle">{{ borderStyle }}</h3>
        <CodeViewer
          :code="borderStyleExample.code"
          :language="borderStyleExample.language"
          :theme="theme"
          :shikiTheme="getResolvedShikiTheme()"
          :borderStyle="borderStyle"
          :showHeader="false"
          :showLineNumbers="false"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { CodeViewerBorderStyle, CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';

const { theme, getResolvedShikiTheme } = useTheme();

const borderStyles: CodeViewerBorderStyle[] = [
  'classic',
  'grid-cross',
  'corner-intersection',
  'none',
];

const borderStyleExample = {
  code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
  language: 'typescript' as CodeViewerLanguage,
};
</script>
