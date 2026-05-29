<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      title="long-sample.ts"
      maxHeight="180px"
    />
  </div>
</template>

<script setup lang="ts">
import { CodeViewer, type CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

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

<style scoped>
.stage {
  width: 500px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
