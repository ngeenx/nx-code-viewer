import type { Meta, StoryObj } from '@storybook/svelte';
import TabHeader from './TabHeader.svelte';

const meta: Meta<TabHeader> = {
  title: 'Atoms/TabHeader',
  component: TabHeader,
  tags: ['autodocs'],
  argTypes: {
    tabId: { control: 'text' },
    fileName: { control: 'text' },
    fileExtension: { control: 'text' },
    isActive: { control: 'boolean' },
    theme: { control: 'radio', options: ['dark', 'light'] },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<TabHeader>;

// ═══════════════ Basic ═══════════════

export const Default: Story = { args: { tabId: 'tab-1', fileName: 'example.ts', fileExtension: '.ts', isActive: false, theme: 'dark' } };
export const Active: Story = { args: { tabId: 'tab-1', fileName: 'example.ts', fileExtension: '.ts', isActive: true, theme: 'dark' } };

export const LightTheme: Story = {
  args: { tabId: 'tab-1', fileName: 'example.ts', fileExtension: '.ts', isActive: false, theme: 'light' },
  parameters: { backgrounds: { default: 'light' } },
};

export const LightThemeActive: Story = {
  args: { tabId: 'tab-1', fileName: 'example.ts', fileExtension: '.ts', isActive: true, theme: 'light' },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ File Types ═══════════════

export const TypeScriptFile: Story = { args: { tabId: 'ts', fileName: 'component.ts', fileExtension: '.ts', isActive: true, theme: 'dark' } };
export const JavaScriptFile: Story = { args: { tabId: 'js', fileName: 'script.js', fileExtension: '.js', isActive: true, theme: 'dark' } };
export const HtmlFile: Story = { args: { tabId: 'html', fileName: 'template.html', fileExtension: '.html', isActive: true, theme: 'dark' } };
export const CssFile: Story = { args: { tabId: 'css', fileName: 'styles.css', fileExtension: '.css', isActive: true, theme: 'dark' } };
export const JsonFile: Story = { args: { tabId: 'json', fileName: 'package.json', fileExtension: '.json', isActive: true, theme: 'dark' } };
export const PythonFile: Story = { args: { tabId: 'py', fileName: 'main.py', fileExtension: '.py', isActive: true, theme: 'dark' } };
export const SvelteFile: Story = { args: { tabId: 'svelte', fileName: 'Counter.svelte', fileExtension: '.svelte', isActive: true, theme: 'dark' } };

// ═══════════════ Edge Cases ═══════════════

export const LongFileName: Story = { args: { tabId: 'long', fileName: 'very-long-filename-that-might-need-truncation.component.ts', fileExtension: '.ts', isActive: false, theme: 'dark' } };
export const NoExtension: Story = { args: { tabId: 'no-ext', fileName: 'Dockerfile', fileExtension: '', isActive: false, theme: 'dark' } };
