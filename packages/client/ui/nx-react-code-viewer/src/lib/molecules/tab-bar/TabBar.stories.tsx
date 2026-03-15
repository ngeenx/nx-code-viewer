import type { Meta, StoryObj } from '@storybook/react';
import { TabBar } from './TabBar';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';

const sampleTabs: MultiCodeViewerTabItem[] = [
  { id: 'ts', type: 'code', fileName: 'component.ts', fileExtension: '.ts', code: 'const x = 1;', language: 'typescript' },
  { id: 'html', type: 'code', fileName: 'template.html', fileExtension: '.html', code: '<div>Hello</div>', language: 'html' },
  { id: 'css', type: 'code', fileName: 'styles.css', fileExtension: '.css', code: '.class { color: red; }', language: 'css' },
];

const manyTabs: MultiCodeViewerTabItem[] = [
  { id: 'app', type: 'code', fileName: 'App.tsx', fileExtension: '.tsx', code: '' },
  { id: 'hook', type: 'code', fileName: 'useUser.ts', fileExtension: '.ts', code: '' },
  { id: 'css', type: 'code', fileName: 'app.css', fileExtension: '.css', code: '' },
  { id: 'spec', type: 'code', fileName: 'App.spec.tsx', fileExtension: '.tsx', code: '' },
  { id: 'router', type: 'code', fileName: 'router.ts', fileExtension: '.ts', code: '' },
  { id: 'main', type: 'code', fileName: 'main.ts', fileExtension: '.ts', code: '' },
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  { id: 'code', type: 'code', fileName: 'user.service.ts', fileExtension: '.ts', code: 'export class UserService {}', language: 'typescript' },
  { id: 'diff', type: 'diff', fileName: 'changes.ts', fileExtension: '.ts', oldCode: 'const a = 1;', newCode: 'const a = 2;', language: 'typescript' },
];

const meta: Meta<typeof TabBar> = {
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
type Story = StoryObj<typeof TabBar>;

// ═══════════════ Basic ═══════════════

export const Default: Story = { args: { tabs: sampleTabs, activeTabId: 'ts', theme: 'dark' } };
export const SecondTabActive: Story = { args: { tabs: sampleTabs, activeTabId: 'html', theme: 'dark' } };

export const LightTheme: Story = {
  args: { tabs: sampleTabs, activeTabId: 'ts', theme: 'light' },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Tab Counts ═══════════════

export const TwoTabs: Story = { args: { tabs: sampleTabs.slice(0, 2), activeTabId: 'ts', theme: 'dark' } };
export const ManyTabs: Story = { args: { tabs: manyTabs, activeTabId: 'app', theme: 'dark' } };

// ═══════════════ Mixed Content ═══════════════

export const MixedCodeAndDiff: Story = { args: { tabs: mixedTabs, activeTabId: 'code', theme: 'dark' } };
