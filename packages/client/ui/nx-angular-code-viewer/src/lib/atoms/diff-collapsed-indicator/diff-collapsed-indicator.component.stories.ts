import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { DiffCollapsedIndicatorComponent } from './diff-collapsed-indicator.component';

const meta: Meta<DiffCollapsedIndicatorComponent> = {
  title: 'Atoms/DiffCollapsedIndicator',
  component: DiffCollapsedIndicatorComponent,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'radio', options: ['dark', 'light'] },
    hiddenCount: { control: 'number' },
    showLineNumbers: { control: 'boolean' },
    showPrefix: { control: 'boolean' },
    isExpanded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DiffCollapsedIndicatorComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    range: { startIndex: 5, endIndex: 15 },
    hiddenCount: 10,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isExpanded: false,
  },
};

export const Light: Story = {
  args: {
    range: { startIndex: 5, endIndex: 15 },
    hiddenCount: 10,
    theme: 'light',
    showLineNumbers: true,
    showPrefix: true,
    isExpanded: false,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutLineNumbers: Story = {
  args: {
    range: { startIndex: 3, endIndex: 8 },
    hiddenCount: 5,
    theme: 'dark',
    showLineNumbers: false,
    showPrefix: true,
  },
};

export const WithoutPrefix: Story = {
  args: {
    range: { startIndex: 3, endIndex: 8 },
    hiddenCount: 5,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: false,
  },
};

export const Minimal: Story = {
  args: {
    range: { startIndex: 3, endIndex: 8 },
    hiddenCount: 5,
    theme: 'dark',
    showLineNumbers: false,
    showPrefix: false,
  },
};

export const SingleLine: Story = {
  args: {
    range: { startIndex: 7, endIndex: 7 },
    hiddenCount: 1,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
  },
};

export const ManyLines: Story = {
  args: {
    range: { startIndex: 10, endIndex: 60 },
    hiddenCount: 50,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
  },
};

export const Expanded: Story = {
  args: {
    range: { startIndex: 5, endIndex: 15 },
    hiddenCount: 10,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isExpanded: true,
  },
};
