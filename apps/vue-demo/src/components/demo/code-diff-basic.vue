<template>
  <div class="wrapper">
    <button class="toggle" type="button" @click="toggleViewMode">
      Switch to {{ viewMode === 'unified' ? 'Split' : 'Unified' }} View
    </button>
    <DiffViewer
      :class="codeViewerThemeClass"
      :oldCode="oldCode"
      :newCode="newCode"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :viewMode="viewMode"
      :showLineNumbers="true"
      :showHeader="true"
      fileExtension="ts"
      oldFileName="user.ts"
      newFileName="user.ts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DiffViewer,
  type CodeViewerLanguage,
  type DiffViewMode,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';
const viewMode = ref<DiffViewMode>('unified');

function toggleViewMode(): void {
  viewMode.value = viewMode.value === 'unified' ? 'split' : 'unified';
}

const oldCode = `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: 'John' };
}`;

const newCode = `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com',
    createdAt: new Date()
  };
}`;
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 720px;
}
.wrapper > :deep(*:not(.toggle)) {
  width: 100%;
}
.toggle {
  align-self: flex-start;
  padding: 0.4rem 0.8rem;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  opacity: 0.85;
}
.toggle:hover {
  opacity: 1;
}
</style>
