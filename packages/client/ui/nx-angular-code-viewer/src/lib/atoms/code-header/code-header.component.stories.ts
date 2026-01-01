import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { CodeHeaderComponent } from './code-header.component';

const meta: Meta<CodeHeaderComponent> = {
  title: 'Atoms/CodeHeader',
  component: CodeHeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: [
        'typescript',
        'javascript',
        'python',
        'html',
        'css',
        'json',
        'rust',
        'go',
        'java',
        'bash',
        'sql',
        'yaml',
        'markdown',
        'plaintext',
      ],
      description: 'Programming language of the code',
    },
    title: {
      control: 'text',
      description: 'Optional title to display instead of language',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Theme for styling',
    },
    fileExtension: {
      control: 'text',
      description: 'File extension for icon display',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<CodeHeaderComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    language: 'typescript',
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  args: {
    language: 'typescript',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const WithTitle: Story = {
  args: {
    language: 'typescript',
    title: 'example.component.ts',
    theme: 'dark',
  },
};

export const WithFileExtension: Story = {
  args: {
    language: 'typescript',
    title: 'app.component.ts',
    fileExtension: '.ts',
    theme: 'dark',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Language Variants - Dark Theme
// ════════════════════════════════════════════════════════════════════════════

export const TypeScript: Story = {
  args: {
    language: 'typescript',
    title: 'component.ts',
    fileExtension: '.ts',
    theme: 'dark',
  },
};

export const JavaScript: Story = {
  args: {
    language: 'javascript',
    title: 'script.js',
    fileExtension: '.js',
    theme: 'dark',
  },
};

export const Python: Story = {
  args: {
    language: 'python',
    title: 'main.py',
    fileExtension: '.py',
    theme: 'dark',
  },
};

export const HTML: Story = {
  args: {
    language: 'html',
    title: 'index.html',
    fileExtension: '.html',
    theme: 'dark',
  },
};

export const CSS: Story = {
  args: {
    language: 'css',
    title: 'styles.css',
    fileExtension: '.css',
    theme: 'dark',
  },
};

export const JSON: Story = {
  args: {
    language: 'json',
    title: 'package.json',
    fileExtension: '.json',
    theme: 'dark',
  },
};

export const Rust: Story = {
  args: {
    language: 'rust',
    title: 'main.rs',
    fileExtension: '.rs',
    theme: 'dark',
  },
};

export const Go: Story = {
  args: {
    language: 'go',
    title: 'main.go',
    fileExtension: '.go',
    theme: 'dark',
  },
};

export const Java: Story = {
  args: {
    language: 'java',
    title: 'Application.java',
    fileExtension: '.java',
    theme: 'dark',
  },
};

export const Bash: Story = {
  args: {
    language: 'bash',
    title: 'deploy.sh',
    fileExtension: '.sh',
    theme: 'dark',
  },
};

export const SQL: Story = {
  args: {
    language: 'sql',
    title: 'query.sql',
    fileExtension: '.sql',
    theme: 'dark',
  },
};

export const YAML: Story = {
  args: {
    language: 'yaml',
    title: 'config.yaml',
    fileExtension: '.yaml',
    theme: 'dark',
  },
};

export const Markdown: Story = {
  args: {
    language: 'markdown',
    title: 'README.md',
    fileExtension: '.md',
    theme: 'dark',
  },
};

export const PlainText: Story = {
  args: {
    language: 'plaintext',
    title: 'notes.txt',
    fileExtension: '.txt',
    theme: 'dark',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Language Variants - Light Theme
// ════════════════════════════════════════════════════════════════════════════

export const TypeScriptLight: Story = {
  args: {
    language: 'typescript',
    title: 'component.ts',
    fileExtension: '.ts',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const PythonLight: Story = {
  args: {
    language: 'python',
    title: 'main.py',
    fileExtension: '.py',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const JSONLight: Story = {
  args: {
    language: 'json',
    title: 'package.json',
    fileExtension: '.json',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const LanguageOnly: Story = {
  args: {
    language: 'typescript',
    theme: 'dark',
  },
};

export const TitleOnly: Story = {
  args: {
    language: 'plaintext',
    title: 'My Custom Title',
    theme: 'dark',
  },
};

export const LongTitle: Story = {
  args: {
    language: 'typescript',
    title: 'src/app/features/authentication/guards/auth.guard.ts',
    fileExtension: '.ts',
    theme: 'dark',
  },
};

export const ExtensionWithoutTitle: Story = {
  args: {
    language: 'typescript',
    fileExtension: '.ts',
    theme: 'dark',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Framework-Specific Files
// ════════════════════════════════════════════════════════════════════════════

export const AngularComponent: Story = {
  args: {
    language: 'typescript',
    title: 'app.component.ts',
    fileExtension: '.ts',
    theme: 'dark',
  },
};

export const AngularTemplate: Story = {
  args: {
    language: 'html',
    title: 'app.component.html',
    fileExtension: '.html',
    theme: 'dark',
  },
};

export const AngularStyles: Story = {
  args: {
    language: 'css',
    title: 'app.component.css',
    fileExtension: '.css',
    theme: 'dark',
  },
};

export const VueComponent: Story = {
  args: {
    language: 'vue',
    title: 'App.vue',
    fileExtension: '.vue',
    theme: 'dark',
  },
};

export const ReactComponent: Story = {
  args: {
    language: 'tsx',
    title: 'App.tsx',
    fileExtension: '.tsx',
    theme: 'dark',
  },
};

export const SvelteComponent: Story = {
  args: {
    language: 'svelte',
    title: 'App.svelte',
    fileExtension: '.svelte',
    theme: 'dark',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Config Files
// ════════════════════════════════════════════════════════════════════════════

export const PackageJson: Story = {
  args: {
    language: 'json',
    title: 'package.json',
    fileExtension: '.json',
    theme: 'dark',
  },
};

export const TsConfig: Story = {
  args: {
    language: 'json',
    title: 'tsconfig.json',
    fileExtension: '.json',
    theme: 'dark',
  },
};

export const Dockerfile: Story = {
  args: {
    language: 'dockerfile',
    title: 'Dockerfile',
    fileExtension: 'Dockerfile',
    theme: 'dark',
  },
};

export const GitIgnore: Story = {
  args: {
    language: 'plaintext',
    title: '.gitignore',
    fileExtension: '.gitignore',
    theme: 'dark',
  },
};

export const EnvFile: Story = {
  args: {
    language: 'plaintext',
    title: '.env',
    fileExtension: '.env',
    theme: 'dark',
  },
};
