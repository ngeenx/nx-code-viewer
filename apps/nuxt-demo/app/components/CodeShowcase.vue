<template>
  <div class="showcase">
    <section class="example">
      <h3 class="example-title">Basic viewer</h3>
      <CodeViewer
        :code="basic"
        :language="tsLanguage"
        :theme="theme"
        :shikiTheme="shikiTheme"
        title="greet.ts"
        fileExtension="ts"
      />
    </section>

    <section class="example">
      <h3 class="example-title">Highlighted lines</h3>
      <CodeViewer
        :code="highlighted"
        :language="tsLanguage"
        :theme="theme"
        :shikiTheme="shikiTheme"
        :highlightedLines="highlightedLines"
        title="counter.ts"
        fileExtension="ts"
      />
    </section>

    <section class="example">
      <h3 class="example-title">Diff viewer</h3>
      <DiffViewer
        :oldCode="diffOld"
        :newCode="diffNew"
        :language="tsLanguage"
        :theme="theme"
        :shikiTheme="shikiTheme"
        :showLineNumbers="true"
        fileExtension="ts"
        oldFileName="user.ts"
        newFileName="user.ts"
      />
    </section>

    <section class="example">
      <h3 class="example-title">Multi-tab viewer</h3>
      <MultiCodeViewer
        :tabs="tabs"
        :theme="theme"
        :shikiTheme="shikiTheme"
        borderStyle="classic"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  CodeViewer,
  DiffViewer,
  MultiCodeViewer,
  type CodeViewerLanguage,
  type HighlightedLinesInput,
  type MultiCodeViewerTabItem,
  type ShikiThemeName,
} from '@ngeenx/nx-vue-code-viewer';
import { useChromeTheme } from '../composables/useChromeTheme';

const { theme } = useChromeTheme();

// Swap the Shiki theme with the chrome mode. A single `shikiTheme` is
// accepted by every viewer (CodeViewer, DiffViewer, MultiCodeViewer),
// so the showcase stays uniform.
const shikiTheme = computed<ShikiThemeName>(() =>
  theme.value === 'dark' ? 'github-dark' : 'github-light'
);

const tsLanguage: CodeViewerLanguage = 'typescript';

const basic = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('Nuxt'));`;

const highlighted = `import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  },
});`;

const highlightedLines: HighlightedLinesInput = [4, [5, 6]];

const diffOld = `interface User {
  id: number;
  name: string;
}`;

const diffNew = `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}`;

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'Counter.vue',
    fileExtension: '.vue',
    language: 'vue',
    code: `<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
<\/script>

<template>
  <button @click="count++">Count: {{ count }}</button>
<\/template>`,
  },
  {
    id: 'usage',
    type: 'code',
    fileName: 'app.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `import { createApp } from 'vue';
import Counter from './Counter.vue';

createApp(Counter).mount('#app');`,
  },
];
</script>

<style scoped>
.showcase {
  display: grid;
  gap: 2rem;
}
.example {
  display: grid;
  gap: 0.75rem;
}
.example-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}
</style>
