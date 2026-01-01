import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { LineNumbersComponent } from './line-numbers.component';

// Action handler for story interactions
const logAction = (name: string) => (value?: unknown) => {
  console.log(`[${name}]`, value);
};

const meta: Meta<LineNumbersComponent> = {
  title: 'Atoms/LineNumbers',
  component: LineNumbersComponent,
  tags: ['autodocs'],
  argTypes: {
    lineCount: {
      control: 'number',
      description: 'Total number of lines to display',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Theme for styling',
    },
    hoveredLine: {
      control: 'number',
      description: 'Currently hovered line (1-based, 0 = no line hovered)',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<LineNumbersComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const LightTheme: Story = {
  args: {
    lineCount: 10,
    theme: 'light',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Line Count Variants
// ════════════════════════════════════════════════════════════════════════════

export const SingleLine: Story = {
  args: {
    lineCount: 1,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const FewLines: Story = {
  args: {
    lineCount: 5,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const TenLines: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const HundredLines: Story = {
  args: {
    lineCount: 100,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const ThousandLines: Story = {
  args: {
    lineCount: 1000,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Hovered Line
// ════════════════════════════════════════════════════════════════════════════

export const HoveredFirstLine: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 1,
    highlightedLinesSet: new Set(),
  },
};

export const HoveredMiddleLine: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 5,
    highlightedLinesSet: new Set(),
  },
};

export const HoveredLastLine: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 10,
    highlightedLinesSet: new Set(),
  },
};

export const HoveredLineLightTheme: Story = {
  args: {
    lineCount: 10,
    theme: 'light',
    hoveredLine: 5,
    highlightedLinesSet: new Set(),
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Highlighted Lines (Pre-configured)
// ════════════════════════════════════════════════════════════════════════════

export const SingleHighlightedLine: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set([5]),
  },
};

export const MultipleHighlightedLines: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set([2, 3, 4, 8]),
  },
};

export const ConsecutiveHighlightedLines: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set([4, 5, 6, 7]),
  },
};

export const HighlightedLinesLightTheme: Story = {
  args: {
    lineCount: 10,
    theme: 'light',
    hoveredLine: 0,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Combined States
// ════════════════════════════════════════════════════════════════════════════

export const HoveredAndHighlighted: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 6,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
};

export const HoveredOnHighlightedLine: Story = {
  args: {
    lineCount: 10,
    theme: 'dark',
    hoveredLine: 4,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Interactive Examples
// ════════════════════════════════════════════════════════════════════════════

export const Interactive: Story = {
  args: {
    lineCount: 15,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set([5, 6, 7]),
  },
  render: args => ({
    props: {
      ...args,
      onLineHover: logAction('lineHover'),
    },
    template: `
      <nx-line-numbers
        [lineCount]="lineCount"
        [theme]="theme"
        [hoveredLine]="hoveredLine"
        [highlightedLinesSet]="highlightedLinesSet"
        (lineHover)="onLineHover($event)"
      />
    `,
  }),
};

export const InteractiveLight: Story = {
  args: {
    lineCount: 15,
    theme: 'light',
    hoveredLine: 0,
    highlightedLinesSet: new Set([5, 6, 7]),
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: args => ({
    props: {
      ...args,
      onLineHover: logAction('lineHover'),
    },
    template: `
      <nx-line-numbers
        [lineCount]="lineCount"
        [theme]="theme"
        [hoveredLine]="hoveredLine"
        [highlightedLinesSet]="highlightedLinesSet"
        (lineHover)="onLineHover($event)"
      />
    `,
  }),
};

// ════════════════════════════════════════════════════════════════════════════
// Formatting Examples
// ════════════════════════════════════════════════════════════════════════════

export const TwoDigitNumbers: Story = {
  args: {
    lineCount: 50,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const ThreeDigitNumbers: Story = {
  args: {
    lineCount: 500,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const FourDigitNumbers: Story = {
  args: {
    lineCount: 2000,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const ZeroLines: Story = {
  args: {
    lineCount: 0,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set(),
  },
};

export const AllLinesHighlighted: Story = {
  args: {
    lineCount: 5,
    theme: 'dark',
    hoveredLine: 0,
    highlightedLinesSet: new Set([1, 2, 3, 4, 5]),
  },
};

// ════════════════════════════════════════════════════════════════════════════
// In Context
// ════════════════════════════════════════════════════════════════════════════

export const InCodeBlockContext: Story = {
  render: () => ({
    template: `
      <div style="display: flex; background: #161b22; border-radius: 8px; overflow: hidden; font-family: monospace;">
        <nx-line-numbers
          [lineCount]="7"
          [theme]="'dark'"
          [hoveredLine]="3"
          [highlightedLinesSet]="highlightedLines"
        />
        <div style="flex: 1; padding: 12px 16px; color: #e6edf3; white-space: pre;">import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '&lt;h1&gt;Hello&lt;/h1&gt;',
})
export class ExampleComponent {}</div>
      </div>
    `,
    props: {
      highlightedLines: new Set([3, 4, 5]),
    },
  }),
};

export const InCodeBlockContextLight: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => ({
    template: `
      <div style="display: flex; background: #f6f8fa; border-radius: 8px; overflow: hidden; font-family: monospace; border: 1px solid #d0d7de;">
        <nx-line-numbers
          [lineCount]="7"
          [theme]="'light'"
          [hoveredLine]="3"
          [highlightedLinesSet]="highlightedLines"
        />
        <div style="flex: 1; padding: 12px 16px; color: #24292f; white-space: pre;">import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '&lt;h1&gt;Hello&lt;/h1&gt;',
})
export class ExampleComponent {}</div>
      </div>
    `,
    props: {
      highlightedLines: new Set([3, 4, 5]),
    },
  }),
};
