import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { CopyButtonComponent } from './copy-button.component';

// Action handler for story interactions
const logAction = (name: string) => (value?: unknown) => {
  console.log(`[${name}]`, value);
};

const meta: Meta<CopyButtonComponent> = {
  title: 'Atoms/CopyButton',
  component: CopyButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'radio',
      options: ['idle', 'copied', 'error'],
      description: 'Current state of the copy button',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Theme for styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: var(--bg-color, #24292e); border-radius: 8px;">${story().template}</div>`,
      styles: [':host { --bg-color: #24292e; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<CopyButtonComponent>;

// ════════════════════════════════════════════════════════════════════════════
// State Variants - Dark Theme
// ════════════════════════════════════════════════════════════════════════════

export const Idle: Story = {
  args: {
    state: 'idle',
    theme: 'dark',
    disabled: false,
  },
};

export const Copied: Story = {
  args: {
    state: 'copied',
    theme: 'dark',
    disabled: false,
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    theme: 'dark',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    state: 'idle',
    theme: 'dark',
    disabled: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// State Variants - Light Theme
// ════════════════════════════════════════════════════════════════════════════

export const IdleLight: Story = {
  args: {
    state: 'idle',
    theme: 'light',
    disabled: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: #f6f8fa; border-radius: 8px;">${story().template}</div>`,
    }),
  ],
};

export const CopiedLight: Story = {
  args: {
    state: 'copied',
    theme: 'light',
    disabled: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: #f6f8fa; border-radius: 8px;">${story().template}</div>`,
    }),
  ],
};

export const ErrorLight: Story = {
  args: {
    state: 'error',
    theme: 'light',
    disabled: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: #f6f8fa; border-radius: 8px;">${story().template}</div>`,
    }),
  ],
};

export const DisabledLight: Story = {
  args: {
    state: 'idle',
    theme: 'light',
    disabled: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: #f6f8fa; border-radius: 8px;">${story().template}</div>`,
    }),
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// Interactive Examples
// ════════════════════════════════════════════════════════════════════════════

export const Interactive: Story = {
  args: {
    state: 'idle',
    theme: 'dark',
    disabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      onCopyClick: logAction('copyClick'),
    },
    template: `
      <nx-copy-button
        [state]="state"
        [theme]="theme"
        [disabled]="disabled"
        (copyClick)="onCopyClick()"
      />
    `,
  }),
};

export const InteractiveLight: Story = {
  args: {
    state: 'idle',
    theme: 'light',
    disabled: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: #f6f8fa; border-radius: 8px;">${story().template}</div>`,
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
      onCopyClick: logAction('copyClick'),
    },
    template: `
      <nx-copy-button
        [state]="state"
        [theme]="theme"
        [disabled]="disabled"
        (copyClick)="onCopyClick()"
      />
    `,
  }),
};

// ════════════════════════════════════════════════════════════════════════════
// All States Comparison
// ════════════════════════════════════════════════════════════════════════════

export const AllStatesDark: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <nx-copy-button [state]="'idle'" [theme]="'dark'" />
          <div style="color: #8b949e; font-size: 12px; margin-top: 8px;">Idle</div>
        </div>
        <div style="text-align: center;">
          <nx-copy-button [state]="'copied'" [theme]="'dark'" />
          <div style="color: #8b949e; font-size: 12px; margin-top: 8px;">Copied</div>
        </div>
        <div style="text-align: center;">
          <nx-copy-button [state]="'error'" [theme]="'dark'" />
          <div style="color: #8b949e; font-size: 12px; margin-top: 8px;">Error</div>
        </div>
        <div style="text-align: center;">
          <nx-copy-button [state]="'idle'" [theme]="'dark'" [disabled]="true" />
          <div style="color: #8b949e; font-size: 12px; margin-top: 8px;">Disabled</div>
        </div>
      </div>
    `,
  }),
};

export const AllStatesLight: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (story) => ({
      template: `<div style="padding: 20px; background: #f6f8fa; border-radius: 8px;">${story().template}</div>`,
    }),
  ],
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <nx-copy-button [state]="'idle'" [theme]="'light'" />
          <div style="color: #57606a; font-size: 12px; margin-top: 8px;">Idle</div>
        </div>
        <div style="text-align: center;">
          <nx-copy-button [state]="'copied'" [theme]="'light'" />
          <div style="color: #57606a; font-size: 12px; margin-top: 8px;">Copied</div>
        </div>
        <div style="text-align: center;">
          <nx-copy-button [state]="'error'" [theme]="'light'" />
          <div style="color: #57606a; font-size: 12px; margin-top: 8px;">Error</div>
        </div>
        <div style="text-align: center;">
          <nx-copy-button [state]="'idle'" [theme]="'light'" [disabled]="true" />
          <div style="color: #57606a; font-size: 12px; margin-top: 8px;">Disabled</div>
        </div>
      </div>
    `,
  }),
};

// ════════════════════════════════════════════════════════════════════════════
// Use Case Examples
// ════════════════════════════════════════════════════════════════════════════

export const InCodeBlockContext: Story = {
  render: () => ({
    template: `
      <div style="position: relative; background: #161b22; border-radius: 8px; padding: 16px 48px 16px 16px; font-family: monospace; color: #e6edf3;">
        <div style="position: absolute; top: 8px; right: 8px;">
          <nx-copy-button [state]="'idle'" [theme]="'dark'" />
        </div>
        <pre style="margin: 0;">const greeting = "Hello, World!";
console.log(greeting);</pre>
      </div>
    `,
  }),
};

export const InCodeBlockContextLight: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => ({
    template: `
      <div style="position: relative; background: #f6f8fa; border-radius: 8px; padding: 16px 48px 16px 16px; font-family: monospace; color: #24292f; border: 1px solid #d0d7de;">
        <div style="position: absolute; top: 8px; right: 8px;">
          <nx-copy-button [state]="'idle'" [theme]="'light'" />
        </div>
        <pre style="margin: 0;">const greeting = "Hello, World!";
console.log(greeting);</pre>
      </div>
    `,
  }),
};
