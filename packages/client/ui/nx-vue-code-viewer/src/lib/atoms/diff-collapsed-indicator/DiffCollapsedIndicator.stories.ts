import type { Meta, StoryObj } from '@storybook/vue3';
import DiffCollapsedIndicator from './DiffCollapsedIndicator.vue';

const meta: Meta<typeof DiffCollapsedIndicator> = {
  title: 'Atoms/DiffCollapsedIndicator',
  component: DiffCollapsedIndicator,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'radio', options: ['dark', 'light'] },
    hiddenCount: { control: 'number' },
    isExpanded: { control: 'boolean' },
    showLineNumbers: { control: 'boolean' },
    showPrefix: { control: 'boolean' },
  },
  render: (args) => ({
    components: { DiffCollapsedIndicator },
    setup() { return { args }; },
    template: `<DiffCollapsedIndicator v-bind="args" />`,
  }),
};

export default meta;
type Story = StoryObj<typeof DiffCollapsedIndicator>;

// ═══════════════ Basic ═══════════════

export const Default: Story = {
  args: { range: { oldStart: 4, oldEnd: 8, newStart: 4, newEnd: 8 }, hiddenCount: 4, theme: 'dark', isExpanded: false },
};

export const Light: Story = {
  args: { range: { oldStart: 4, oldEnd: 8, newStart: 4, newEnd: 8 }, hiddenCount: 4, theme: 'light', isExpanded: false },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ States ═══════════════

export const Expanded: Story = {
  args: { range: { oldStart: 10, oldEnd: 20, newStart: 10, newEnd: 20 }, hiddenCount: 10, theme: 'dark', isExpanded: true },
};

export const SingleLine: Story = {
  args: { range: { oldStart: 5, oldEnd: 5, newStart: 5, newEnd: 5 }, hiddenCount: 1, theme: 'dark', isExpanded: false },
};

export const ManyLines: Story = {
  args: { range: { oldStart: 10, oldEnd: 60, newStart: 10, newEnd: 60 }, hiddenCount: 50, theme: 'dark', isExpanded: false },
};

// ═══════════════ Variants ═══════════════

export const WithoutLineNumbers: Story = {
  args: { range: { oldStart: 4, oldEnd: 8, newStart: 4, newEnd: 8 }, hiddenCount: 4, theme: 'dark', isExpanded: false, showLineNumbers: false },
};

export const WithoutPrefix: Story = {
  args: { range: { oldStart: 4, oldEnd: 8, newStart: 4, newEnd: 8 }, hiddenCount: 4, theme: 'dark', isExpanded: false, showPrefix: false },
};

export const Minimal: Story = {
  args: { range: { oldStart: 4, oldEnd: 8, newStart: 4, newEnd: 8 }, hiddenCount: 4, theme: 'dark', isExpanded: false, showLineNumbers: false, showPrefix: false },
};

export const ExpandedLight: Story = {
  args: { range: { oldStart: 3, oldEnd: 12, newStart: 3, newEnd: 12 }, hiddenCount: 9, theme: 'light', isExpanded: true },
  parameters: { backgrounds: { default: 'light' } },
};
