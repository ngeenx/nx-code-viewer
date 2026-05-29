<template>
  <div class="home">
    <h1 class="title">nx-vue-code-viewer in Nuxt</h1>
    <p class="lead">
      A standalone Nuxt app that consumes the published
      <code>@ngeenx/nx-vue-code-viewer</code> package to prove it renders on
      the server and hydrates on the client. The
      <NuxtLink to="/ssr">SSR</NuxtLink> page uses universal rendering; the
      <NuxtLink to="/ssg">SSG</NuxtLink> page is prerendered to static HTML
      at build time.
    </p>

    <CodeViewer
      :code="install"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :showLineNumbers="false"
    />

    <p class="hint">
      View source on either page and confirm the highlighted markup is
      present in the initial HTML response (no client round-trip needed).
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerLanguage,
} from '@ngeenx/nx-vue-code-viewer';
import { useChromeTheme } from '../composables/useChromeTheme';
import { computed } from 'vue';

const { theme } = useChromeTheme();
const shikiTheme = computed(() =>
  theme.value === 'dark' ? 'github-dark' : 'github-light'
);

const language: CodeViewerLanguage = 'bash';
const install = `pnpm add @ngeenx/nx-vue-code-viewer`;

useHead({
  title: 'nx-vue-code-viewer · Nuxt showcase',
});
</script>

<style scoped>
.home {
  display: grid;
  gap: 1.5rem;
}
.title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.lead {
  margin: 0;
  line-height: 1.6;
  opacity: 0.85;
}
.lead code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9em;
}
.hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
