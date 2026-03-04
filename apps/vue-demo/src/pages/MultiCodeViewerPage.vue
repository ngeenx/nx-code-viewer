<template>
  <div class="page-container" :class="theme">
    <div class="page-header">
      <h1 class="page-title">Multi-Code Viewer</h1>
      <p class="page-description">
        Display multiple files or code snippets in a tabbed interface.
      </p>
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Multiple Files with Diff Tab</h2>
      <p class="demo-section-description">
        Show multiple code files and a diff comparison in a single tabbed view.
      </p>
      <MultiCodeViewer
        :tabs="multiCodeViewerTabs"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :showContentHeader="true"
        @active-tab-change="onTabChange"
        @code-copied="onCodeCopied"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MultiCodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { MultiCodeViewerTabItem, TabChangeEvent } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';

const { theme, getResolvedShikiTheme } = useTheme();

const multiCodeViewerTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'UserComponent.vue',
    fileExtension: '.vue',
    language: 'typescript',
    code: `<template>
  <div class="user-card">
    <h2>{{ name }}</h2>
    <p>{{ email }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  email: string;
}>();
<\/script>`,
  },
  {
    id: 'composable',
    type: 'code',
    fileName: 'useUser.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `import { ref } from 'vue';

export function useUser() {
  const name = ref('John Doe');
  const email = ref('john@example.com');

  function updateName(newName: string): void {
    name.value = newName;
  }

  return { name, email, updateName };
}`,
  },
  {
    id: 'styles',
    type: 'code',
    fileName: 'user-card.css',
    fileExtension: '.css',
    language: 'css',
    code: `.user-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.user-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}`,
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class UserService {
  getUser(id: number) {
    return fetch('/api/users/' + id);
  }
}`,
    newCode: `export class UserService {
  async getUser(id: number) {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  }

  async updateUser(id: number, data: Partial<User>) {
    const response = await fetch(\`/api/users/\${id}\`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }
}`,
  },
];

function onTabChange(event: TabChangeEvent): void {
  console.log('Tab changed:', event);
}

function onCodeCopied(tabId: string): void {
  console.log('Code copied from tab:', tabId);
}
</script>
