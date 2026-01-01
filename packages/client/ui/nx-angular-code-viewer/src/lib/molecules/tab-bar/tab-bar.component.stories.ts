import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { TabBarComponent } from './tab-bar.component';
import type { MultiCodeViewerTabItem } from '../../types';

const sampleTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'ts',
    type: 'code',
    fileName: 'component.ts',
    fileExtension: '.ts',
    code: 'const x = 1;',
    language: 'typescript',
  },
  {
    id: 'html',
    type: 'code',
    fileName: 'template.html',
    fileExtension: '.html',
    code: '<div>Hello</div>',
    language: 'html',
  },
  {
    id: 'css',
    type: 'code',
    fileName: 'styles.css',
    fileExtension: '.css',
    code: '.class { color: red; }',
    language: 'css',
  },
];

const manyTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'ts',
    type: 'code',
    fileName: 'app.component.ts',
    fileExtension: '.ts',
    code: '',
  },
  {
    id: 'html',
    type: 'code',
    fileName: 'app.component.html',
    fileExtension: '.html',
    code: '',
  },
  {
    id: 'css',
    type: 'code',
    fileName: 'app.component.css',
    fileExtension: '.css',
    code: '',
  },
  {
    id: 'spec',
    type: 'code',
    fileName: 'app.component.spec.ts',
    fileExtension: '.ts',
    code: '',
  },
  {
    id: 'module',
    type: 'code',
    fileName: 'app.module.ts',
    fileExtension: '.ts',
    code: '',
  },
  {
    id: 'routing',
    type: 'code',
    fileName: 'app-routing.module.ts',
    fileExtension: '.ts',
    code: '',
  },
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'code',
    type: 'code',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    code: 'export class UserService {}',
    language: 'typescript',
  },
  {
    id: 'diff',
    type: 'diff',
    fileName: 'changes.ts',
    fileExtension: '.ts',
    oldCode: 'const a = 1;',
    newCode: 'const a = 2;',
    language: 'typescript',
  },
];

const meta: Meta<TabBarComponent> = {
  title: 'Molecules/TabBar',
  component: TabBarComponent,
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Array of tab items',
    },
    activeTabId: {
      control: 'text',
      description: 'ID of the currently active tab',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color theme',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<TabBarComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    activeTabId: 'ts',
    theme: 'dark',
  },
};

export const SecondTabActive: Story = {
  args: {
    tabs: sampleTabs,
    activeTabId: 'html',
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  args: {
    tabs: sampleTabs,
    activeTabId: 'ts',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Different Tab Counts
// ════════════════════════════════════════════════════════════════════════════

export const TwoTabs: Story = {
  args: {
    tabs: sampleTabs.slice(0, 2),
    activeTabId: 'ts',
    theme: 'dark',
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: manyTabs,
    activeTabId: 'ts',
    theme: 'dark',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Mixed Content Types
// ════════════════════════════════════════════════════════════════════════════

export const MixedCodeAndDiff: Story = {
  args: {
    tabs: mixedTabs,
    activeTabId: 'code',
    theme: 'dark',
  },
};
