import type { Meta, StoryObj } from '@storybook/react';
import { MultiCodeViewer } from './MultiCodeViewer';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';

const basicTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'ts',
    type: 'code',
    fileName: 'user.component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
}`,
  },
  {
    id: 'html',
    type: 'code',
    fileName: 'user.component.html',
    fileExtension: '.html',
    language: 'html',
    code: `<div class="user-card">
  <h2>{{ name() }}</h2>
  <p>{{ email() }}</p>
  <button (click)="edit()">Edit Profile</button>
</div>`,
  },
  {
    id: 'css',
    type: 'code',
    fileName: 'user.component.css',
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
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  basicTabs[0],
  {
    id: 'diff',
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
}`,
  },
];

const meta: Meta<typeof MultiCodeViewer> = {
  title: 'Organisms/MultiCodeViewer',
  component: MultiCodeViewer,
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: 'object' },
    theme: { control: 'radio', options: ['dark', 'light'] },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
    },
    showContentHeader: { control: 'boolean' },
    initialActiveTabId: { control: 'text' },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof MultiCodeViewer>;

export const Default: Story = {
  args: { tabs: basicTabs, theme: 'dark', borderStyle: 'classic' },
};

export const LightTheme: Story = {
  args: { tabs: basicTabs, theme: 'light', borderStyle: 'classic' },
  parameters: { backgrounds: { default: 'light' } },
};

export const MixedCodeAndDiff: Story = {
  args: { tabs: mixedTabs, theme: 'dark', borderStyle: 'classic' },
};

export const WithContentHeader: Story = {
  args: { tabs: basicTabs, theme: 'dark', borderStyle: 'classic', showContentHeader: true },
};

export const InitialActiveTab: Story = {
  args: { tabs: basicTabs, theme: 'dark', borderStyle: 'classic', initialActiveTabId: 'html' },
};

export const BorderStyleGridCross: Story = {
  args: { tabs: basicTabs, theme: 'dark', borderStyle: 'grid-cross' },
  parameters: { layout: 'centered' },
};

export const BorderStyleCornerIntersection: Story = {
  args: { tabs: basicTabs, theme: 'dark', borderStyle: 'corner-intersection' },
  parameters: { layout: 'centered' },
};

export const SingleTab: Story = {
  args: { tabs: [basicTabs[0]], theme: 'dark', borderStyle: 'classic' },
};

export const CustomShikiTheme: Story = {
  args: { tabs: basicTabs, theme: 'dark', borderStyle: 'classic', shikiTheme: 'dracula' },
};
