import type { Meta, StoryObj } from '@storybook/svelte';
import MultiCodeViewer from './MultiCodeViewer.svelte';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';

const basicTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'ts',
    type: 'code',
    fileName: 'counter.svelte.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `let count = $state(0);
const doubled = $derived(count * 2);

export function useCounter() {
  function increment(): void {
    count++;
  }

  function decrement(): void {
    count--;
  }

  return {
    get count() { return count; },
    get doubled() { return doubled; },
    increment,
    decrement,
  };
}`,
  },
  {
    id: 'html',
    type: 'code',
    fileName: 'Counter.svelte',
    fileExtension: '.svelte',
    language: 'html',
    code: `<script lang="ts">
  let count = $state(0);
</script>

<button onclick={() => count++}>
  Count: {count}
</button>`,
  },
  {
    id: 'css',
    type: 'code',
    fileName: 'counter.css',
    fileExtension: '.css',
    language: 'css',
    code: `.counter-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.counter-card button {
  margin: 0 0.5rem;
  font-size: 1.25rem;
}`,
  },
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  basicTabs[0],
  {
    id: 'diff',
    type: 'diff',
    fileName: 'counter.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class CounterService {
  getCount() {
    return fetch('/api/counter');
  }
}`,
    newCode: `export class CounterService {
  async getCount() {
    const response = await fetch('/api/counter');
    return response.json();
  }
}`,
  },
];

const meta: Meta<MultiCodeViewer> = {
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
type Story = StoryObj<MultiCodeViewer>;

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
