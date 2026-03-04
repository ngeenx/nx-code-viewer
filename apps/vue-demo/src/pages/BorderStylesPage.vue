<template>
  <div class="page-container" :class="theme">
    <div class="page-header">
      <h1 class="page-title">Border Styles</h1>
      <p class="page-description">
        Choose from different border styles to match your application's design language.
      </p>
    </div>

    <div
      v-for="borderStyle in borderStyles"
      :key="borderStyle"
      class="demo-section"
    >
      <h2 class="demo-section-title">{{ formatBorderStyle(borderStyle) }}</h2>
      <CodeViewer
        :code="borderStyleExample.code"
        :language="borderStyleExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :borderStyle="borderStyle"
        :showLineNumbers="true"
        :showHeader="true"
        :title="`border-style: ${borderStyle}`"
      />
    </div>
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

function formatBorderStyle(style: CodeViewerBorderStyle): string {
  return style.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
</script>
