<template>
  <div class="page-container" :class="theme">
    <div class="page-header">
      <h1 class="page-title">Basic Examples</h1>
      <p class="page-description">
        Code viewer examples with various programming languages and syntax
        highlighting.
      </p>
    </div>

    <div class="demo-section" v-for="example in examples" :key="example.title">
      <h2 class="demo-section-title">{{ example.title }}</h2>
      <CodeViewer
        :code="example.code"
        :language="example.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :showHeader="true"
        :title="example.title + example.fileExtension"
        :fileExtension="example.fileExtension"
        :showLineNumbers="true"
        :showCopyButton="true"
        @code-copied="onCodeCopied(example.title)" />
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Handwritten Theme</h2>
      <p class="demo-section-description">
        A playful theme using the Delius Swash Caps handwritten font.
      </p>
      <div class="theme-handwritten">
        <CodeViewer
          :code="handwrittenExample"
          language="typescript"
          :theme="theme"
          :shikiTheme="getResolvedShikiTheme()"
          :showHeader="true"
          title="notes.ts"
          fileExtension=".ts"
          :showLineNumbers="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';

const { theme, getResolvedShikiTheme } = useTheme();

const examples: {
  title: string;
  code: string;
  language: CodeViewerLanguage;
  fileExtension: string;
}[] = [
  {
    title: 'TypeScript',
    language: 'typescript',
    fileExtension: '.ts',
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

console.log(greetUser(user));`,
  },
  {
    title: 'JavaScript',
    language: 'javascript',
    fileExtension: '.js',
    code: `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

fetchData('https://api.example.com/users')
  .then(users => console.log(users));`,
  },
  {
    title: 'HTML',
    language: 'html',
    fileExtension: '.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello, World!</p>
  </main>
</body>
</html>`,
  },
  {
    title: 'CSS',
    language: 'css',
    fileExtension: '.css',
    code: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}`,
  },
  {
    title: 'JSON',
    language: 'json',
    fileExtension: '.json',
    code: `{
  "name": "nx-code-viewer",
  "version": "1.0.0",
  "description": "A syntax highlighting code viewer component",
  "keywords": ["vue", "code", "viewer", "syntax-highlighting"],
  "dependencies": {
    "vue": "^3.0.0",
    "shiki": "^1.0.0"
  }
}`,
  },
];

const handwrittenExample = `// A simple note-taking app
interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

function createNote(title: string, content: string): Note {
  return {
    id: Date.now(),
    title,
    content,
    createdAt: new Date(),
  };
}

const myNote = createNote(
  'Shopping List',
  'Milk, Eggs, Bread, Coffee'
);`;

function onCodeCopied(title: string): void {
  console.log(`Code copied from: ${title}`);
}
</script>
