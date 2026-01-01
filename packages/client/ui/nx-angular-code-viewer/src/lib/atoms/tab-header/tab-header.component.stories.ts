import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { TabHeaderComponent } from './tab-header.component';

const meta: Meta<TabHeaderComponent> = {
  title: 'Atoms/TabHeader',
  component: TabHeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    tabId: {
      control: 'text',
      description: 'Unique identifier for the tab',
    },
    fileName: {
      control: 'text',
      description: 'File name to display',
    },
    fileExtension: {
      control: 'text',
      description: 'File extension for icon display',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the tab is currently active',
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
type Story = StoryObj<TabHeaderComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    tabId: 'tab-1',
    fileName: 'example.ts',
    fileExtension: '.ts',
    isActive: false,
    theme: 'dark',
  },
};

export const Active: Story = {
  args: {
    tabId: 'tab-1',
    fileName: 'example.ts',
    fileExtension: '.ts',
    isActive: true,
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  args: {
    tabId: 'tab-1',
    fileName: 'example.ts',
    fileExtension: '.ts',
    isActive: false,
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const LightThemeActive: Story = {
  args: {
    tabId: 'tab-1',
    fileName: 'example.ts',
    fileExtension: '.ts',
    isActive: true,
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Different File Types
// ════════════════════════════════════════════════════════════════════════════

export const TypeScriptFile: Story = {
  args: {
    tabId: 'ts',
    fileName: 'component.ts',
    fileExtension: '.ts',
    isActive: true,
    theme: 'dark',
  },
};

export const JavaScriptFile: Story = {
  args: {
    tabId: 'js',
    fileName: 'script.js',
    fileExtension: '.js',
    isActive: true,
    theme: 'dark',
  },
};

export const HtmlFile: Story = {
  args: {
    tabId: 'html',
    fileName: 'template.html',
    fileExtension: '.html',
    isActive: true,
    theme: 'dark',
  },
};

export const CssFile: Story = {
  args: {
    tabId: 'css',
    fileName: 'styles.css',
    fileExtension: '.css',
    isActive: true,
    theme: 'dark',
  },
};

export const JsonFile: Story = {
  args: {
    tabId: 'json',
    fileName: 'package.json',
    fileExtension: '.json',
    isActive: true,
    theme: 'dark',
  },
};

export const PythonFile: Story = {
  args: {
    tabId: 'py',
    fileName: 'main.py',
    fileExtension: '.py',
    isActive: true,
    theme: 'dark',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const LongFileName: Story = {
  args: {
    tabId: 'long',
    fileName: 'very-long-filename-that-might-need-truncation.component.ts',
    fileExtension: '.ts',
    isActive: false,
    theme: 'dark',
  },
};

export const NoExtension: Story = {
  args: {
    tabId: 'no-ext',
    fileName: 'Dockerfile',
    fileExtension: '',
    isActive: false,
    theme: 'dark',
  },
};
