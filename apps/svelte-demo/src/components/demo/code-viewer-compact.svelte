<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'bash';
  const sample = `pnpm install @ngeenx/nx-svelte-code-viewer`;
</script>

<div class="stage {options.codeViewerThemeClass}">
  <CodeViewer
    code={sample}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    showHeader={false}
    showLineNumbers={false}
  />
</div>

<style>
  .stage {
    width: 500px;
  }
  .stage :global(.nx-code-viewer) {
    width: 100%;
  }
</style>
