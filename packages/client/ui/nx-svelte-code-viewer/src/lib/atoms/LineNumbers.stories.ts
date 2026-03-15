import type { Meta, StoryObj } from '@storybook/svelte';
import LineNumbers from './LineNumbers.svelte';

const meta: Meta<LineNumbers> = {
  title: 'Atoms/LineNumbers',
  component: LineNumbers,
  tags: ['autodocs'],
  argTypes: {
    lineCount: { control: 'number' },
    theme: { control: 'radio', options: ['dark', 'light'] },
    hoveredLine: { control: 'number' },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<LineNumbers>;

// ═══════════════ Basic ═══════════════

export const Default: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };

export const LightTheme: Story = {
  args: { lineCount: 10, theme: 'light', hoveredLine: 0, highlightedLinesSet: new Set() },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Line Count Variants ═══════════════

export const SingleLine: Story = { args: { lineCount: 1, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };
export const FewLines: Story = { args: { lineCount: 5, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };
export const HundredLines: Story = { args: { lineCount: 100, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };
export const ThousandLines: Story = { args: { lineCount: 1000, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };

// ═══════════════ Hovered Line ═══════════════

export const HoveredFirstLine: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 1, highlightedLinesSet: new Set() } };
export const HoveredMiddleLine: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 5, highlightedLinesSet: new Set() } };
export const HoveredLastLine: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 10, highlightedLinesSet: new Set() } };

export const HoveredLineLightTheme: Story = {
  args: { lineCount: 10, theme: 'light', hoveredLine: 5, highlightedLinesSet: new Set() },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Highlighted Lines ═══════════════

export const SingleHighlightedLine: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set([5]) } };
export const MultipleHighlightedLines: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set([2, 3, 4, 8]) } };
export const ConsecutiveHighlightedLines: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set([4, 5, 6, 7]) } };

export const HighlightedLinesLightTheme: Story = {
  args: { lineCount: 10, theme: 'light', hoveredLine: 0, highlightedLinesSet: new Set([3, 4, 5]) },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Combined States ═══════════════

export const HoveredAndHighlighted: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 6, highlightedLinesSet: new Set([3, 4, 5]) } };
export const HoveredOnHighlightedLine: Story = { args: { lineCount: 10, theme: 'dark', hoveredLine: 4, highlightedLinesSet: new Set([3, 4, 5]) } };

// ═══════════════ Formatting ═══════════════

export const TwoDigitNumbers: Story = { args: { lineCount: 50, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };
export const ThreeDigitNumbers: Story = { args: { lineCount: 500, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };
export const FourDigitNumbers: Story = { args: { lineCount: 2000, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };

// ═══════════════ Edge Cases ═══════════════

export const ZeroLines: Story = { args: { lineCount: 0, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set() } };
export const AllLinesHighlighted: Story = { args: { lineCount: 5, theme: 'dark', hoveredLine: 0, highlightedLinesSet: new Set([1, 2, 3, 4, 5]) } };
