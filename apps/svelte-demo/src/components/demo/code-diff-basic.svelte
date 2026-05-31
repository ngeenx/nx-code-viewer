<script lang="ts">
  import { DiffViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerLanguage,
    DiffViewMode,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  let viewMode = $state<DiffViewMode>('unified');

  function toggleViewMode(): void {
    viewMode = viewMode === 'unified' ? 'split' : 'unified';
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
    fileExtension="ts"
    oldFileName="user.ts"
    newFileName="user.ts"
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
