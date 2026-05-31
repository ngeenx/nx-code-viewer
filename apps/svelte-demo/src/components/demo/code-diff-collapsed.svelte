<script lang="ts">
  import { DiffViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerLanguage,
    DiffCollapsedLinesInput,
    DiffViewMode,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  let viewMode = $state<DiffViewMode>('unified');

  const collapsedLines: DiffCollapsedLinesInput = [
    { startIndex: 2, endIndex: 5 },
    { startIndex: 10, endIndex: 13 },
  ];

  function toggleViewMode(): void {
    viewMode = viewMode === 'unified' ? 'split' : 'unified';
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

<div class="wrapper {options.codeViewerThemeClass}">
  <button class="toggle" type="button" onclick={toggleViewMode}>
    Switch to {viewMode === 'unified' ? 'Split' : 'Unified'} View
  </button>
  <DiffViewer
    {oldCode}
    {newCode}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    {viewMode}
    showLineNumbers={true}
    showHeader={true}
    {collapsedLines}
    fileExtension="ts"
    oldFileName="user.component.ts"
    newFileName="user.component.ts"
  />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 720px;
  }
  .wrapper > :global(:not(.toggle)) {
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
