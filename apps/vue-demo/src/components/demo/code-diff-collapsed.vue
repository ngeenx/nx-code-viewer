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
      :collapsedLines="collapsedLines"
      fileExtension="ts"
      oldFileName="user.component.ts"
      newFileName="user.component.ts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DiffViewer,
  type CodeViewerLanguage,
  type DiffCollapsedLinesInput,
  type DiffViewMode,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';
const viewMode = ref<DiffViewMode>('unified');

const collapsedLines: DiffCollapsedLinesInput = [
  { startIndex: 2, endIndex: 5 },
  { startIndex: 10, endIndex: 13 },
];

function toggleViewMode(): void {
  viewMode.value = viewMode.value === 'unified' ? 'split' : 'unified';
}

const oldCode = `import { Component } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name }}</div>',
})
export class UserComponent {
  name = 'John Doe';
  email = 'john@example.com';
}`;

const newCode = `import { Component, signal } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 * Updated with signals support.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name() }}</div>',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
  readonly isActive = signal(true);
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
