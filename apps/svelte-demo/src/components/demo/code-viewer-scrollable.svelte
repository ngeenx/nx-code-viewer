<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  const sample = `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(name: string, email: string): User {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date(),
  };
}

function describe(user: User): string {
  return \`\${user.name} <\${user.email}> joined on \${user.createdAt.toISOString()}\`;
}

const alice = createUser('Alice', 'alice@example.com');
const bob = createUser('Bob', 'bob@example.com');

console.log(describe(alice));
console.log(describe(bob));
`;
</script>

<div class="stage {options.codeViewerThemeClass}">
  <CodeViewer
    code={sample}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    title="long-sample.ts"
    maxHeight="180px"
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
