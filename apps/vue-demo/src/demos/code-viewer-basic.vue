<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';

const sample = `interface User {
  id: number;
  name: string;
  email: string;
}

const greet = (user: User) => \`Hello, \${user.name}!\`;`;
</script>

<template>
  <CodeViewer :code="sample" language="typescript" fileExtension=".ts" />
</template>
