import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { MultiCodeViewerComponent } from './multi-code-viewer.component';
import type { MultiCodeViewerTabItem } from '../../types';

const sampleTypescript = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
}`;

const sampleHtml = `<div class="user-card">
  <h2>{{ name() }}</h2>
  <p>{{ email() }}</p>
  <button (click)="edit()">Edit Profile</button>
</div>`;

const sampleCss = `.user-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.user-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}`;

const basicTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'ts',
    type: 'code',
    fileName: 'user.component.ts',
    fileExtension: '.ts',
    code: sampleTypescript,
    language: 'typescript',
  },
  {
    id: 'html',
    type: 'code',
    fileName: 'user.component.html',
    fileExtension: '.html',
    code: sampleHtml,
    language: 'html',
  },
  {
    id: 'css',
    type: 'code',
    fileName: 'user.component.css',
    fileExtension: '.css',
    code: sampleCss,
    language: 'css',
  },
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'code',
    type: 'code',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    code: `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }
}`,
    language: 'typescript',
  },
  {
    id: 'diff',
    type: 'diff',
    fileName: 'user.model.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `interface User {
  id: number;
  name: string;
}`,
    newCode: `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}`,
  },
];

const diffOnlyTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'service',
    type: 'diff',
    fileName: 'api.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class ApiService {
  get(url: string) {
    return fetch(url);
  }
}`,
    newCode: `export class ApiService {
  get<T>(url: string): Promise<T> {
    return fetch(url).then(r => r.json());
  }

  post<T>(url: string, data: unknown): Promise<T> {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(r => r.json());
  }
}`,
  },
  {
    id: 'config',
    type: 'diff',
    fileName: 'config.json',
    fileExtension: '.json',
    language: 'json',
    oldCode: `{
  "apiUrl": "http://localhost:3000"
}`,
    newCode: `{
  "apiUrl": "https://api.example.com",
  "timeout": 5000
}`,
  },
];

const meta: Meta<MultiCodeViewerComponent> = {
  title: 'Organisms/MultiCodeViewer',
  component: MultiCodeViewerComponent,
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Array of tab items (code or diff)',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color theme',
    },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
      description: 'Border style variant',
    },
    showContentHeader: {
      control: 'boolean',
      description: 'Whether to show header in content viewers',
    },
    initialActiveTabId: {
      control: 'text',
      description: 'Initial active tab ID',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<MultiCodeViewerComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const LightTheme: Story = {
  args: {
    tabs: basicTabs,
    theme: 'light',
    borderStyle: 'classic',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const InitialActiveTab: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'classic',
    initialActiveTabId: 'html',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Border Styles
// ════════════════════════════════════════════════════════════════════════════

export const BorderStyleClassic: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const BorderStyleGridCross: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'grid-cross',
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleCornerIntersection: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'corner-intersection',
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleNone: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'none',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Mixed Content Types
// ════════════════════════════════════════════════════════════════════════════

export const MixedCodeAndDiff: Story = {
  args: {
    tabs: mixedTabs,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const DiffOnly: Story = {
  args: {
    tabs: diffOnlyTabs,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// With Content Header
// ════════════════════════════════════════════════════════════════════════════

export const WithContentHeader: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'classic',
    showContentHeader: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Theme Comparisons
// ════════════════════════════════════════════════════════════════════════════

export const DarkThemeGridCross: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'grid-cross',
  },
  parameters: {
    layout: 'centered',
  },
};

export const LightThemeGridCross: Story = {
  args: {
    tabs: basicTabs,
    theme: 'light',
    borderStyle: 'grid-cross',
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

export const DarkThemeCornerIntersection: Story = {
  args: {
    tabs: basicTabs,
    theme: 'dark',
    borderStyle: 'corner-intersection',
  },
  parameters: {
    layout: 'centered',
  },
};

export const LightThemeCornerIntersection: Story = {
  args: {
    tabs: basicTabs,
    theme: 'light',
    borderStyle: 'corner-intersection',
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const SingleTab: Story = {
  args: {
    tabs: [basicTabs[0]],
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: basicTabs.slice(0, 2),
    theme: 'dark',
    borderStyle: 'classic',
  },
};
