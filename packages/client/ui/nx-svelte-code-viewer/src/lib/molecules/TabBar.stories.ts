import type { Meta, StoryObj } from '@storybook/svelte';
import TabBar from './TabBar.svelte';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';

const sampleTabs: MultiCodeViewerTabItem[] = [
  { id: 'ts', type: 'code', fileName: 'component.ts', fileExtension: '.ts', code: 'const x = 1;', language: 'typescript' },
  { id: 'html', type: 'code', fileName: 'template.html', fileExtension: '.html', code: '<div>Hello</div>', language: 'html' },
  { id: 'css', type: 'code', fileName: 'styles.css', fileExtension: '.css', code: '.class { color: red; }', language: 'css' },
];

const manyTabs: MultiCodeViewerTabItem[] = [
  { id: 'ts', type: 'code', fileName: 'Counter.svelte', fileExtension: '.svelte', code: '' },
  { id: 'store', type: 'code', fileName: 'counter.svelte.ts', fileExtension: '.ts', code: '' },
  { id: 'css', type: 'code', fileName: 'counter.css', fileExtension: '.css', code: '' },
  { id: 'spec', type: 'code', fileName: 'counter.spec.ts', fileExtension: '.ts', code: '' },
  { id: 'layout', type: 'code', fileName: 'Layout.svelte', fileExtension: '.svelte', code: '' },
  { id: 'app', type: 'code', fileName: 'App.svelte', fileExtension: '.svelte', code: '' },
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  { id: 'code', type: 'code', fileName: 'counter.svelte.ts', fileExtension: '.ts', code: 'let count = $state(0);', language: 'typescript' },
  { id: 'diff', type: 'diff', fileName: 'changes.ts', fileExtension: '.ts', oldCode: 'const a = 1;', newCode: 'const a = 2;', language: 'typescript' },
];

const meta: Meta<TabBar> = {
  title: 'Molecules/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: 'object' },
    activeTabId: { control: 'text' },
    theme: { control: 'radio', options: ['dark', 'light'] },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<TabBar>;

// ═══════════════ Basic ═══════════════

export const Default: Story = { args: { tabs: sampleTabs, activeTabId: 'ts', theme: 'dark' } };
export const SecondTabActive: Story = { args: { tabs: sampleTabs, activeTabId: 'html', theme: 'dark' } };

export const LightTheme: Story = {
  args: { tabs: sampleTabs, activeTabId: 'ts', theme: 'light' },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Tab Counts ═══════════════

export const TwoTabs: Story = { args: { tabs: sampleTabs.slice(0, 2), activeTabId: 'ts', theme: 'dark' } };
export const ManyTabs: Story = { args: { tabs: manyTabs, activeTabId: 'ts', theme: 'dark' } };

// ═══════════════ Mixed Content ═══════════════

export const MixedCodeAndDiff: Story = { args: { tabs: mixedTabs, activeTabId: 'code', theme: 'dark' } };
