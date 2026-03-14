import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { CollapsedIndicatorComponent } from './collapsed-indicator.component';

const meta: Meta<CollapsedIndicatorComponent> = {
  title: 'Atoms/CollapsedIndicator',
  component: CollapsedIndicatorComponent,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'radio', options: ['dark', 'light'] },
    hiddenCount: { control: 'number' },
    isExpanded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CollapsedIndicatorComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    range: [4, 8] as const,
    hiddenCount: 4,
    theme: 'dark',
    isExpanded: false,
  },
};

export const Light: Story = {
  args: {
    range: [4, 8] as const,
    hiddenCount: 4,
    theme: 'light',
    isExpanded: false,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// States
// ════════════════════════════════════════════════════════════════════════════

export const Expanded: Story = {
  args: {
    range: [10, 20] as const,
    hiddenCount: 10,
    theme: 'dark',
    isExpanded: true,
  },
};

export const SingleLine: Story = {
  args: {
    range: [5, 5] as const,
    hiddenCount: 1,
    theme: 'dark',
    isExpanded: false,
  },
};

export const ManyLines: Story = {
  args: {
    range: [10, 60] as const,
    hiddenCount: 50,
    theme: 'dark',
    isExpanded: false,
  },
};

export const ExpandedLight: Story = {
  args: {
    range: [3, 12] as const,
    hiddenCount: 9,
    theme: 'light',
    isExpanded: true,
  },
};
