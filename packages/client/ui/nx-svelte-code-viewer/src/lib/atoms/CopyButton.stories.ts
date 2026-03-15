import type { Meta, StoryObj } from '@storybook/svelte';
import CopyButton from './CopyButton.svelte';

const meta: Meta<CopyButton> = {
  title: 'Atoms/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'radio', options: ['idle', 'copied', 'error'] },
    theme: { control: 'radio', options: ['dark', 'light'] },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<CopyButton>;

// ═══════════════ Dark Theme States ═══════════════

export const Idle: Story = { args: { state: 'idle', theme: 'dark', disabled: false } };
export const Copied: Story = { args: { state: 'copied', theme: 'dark', disabled: false } };
export const Error: Story = { args: { state: 'error', theme: 'dark', disabled: false } };
export const Disabled: Story = { args: { state: 'idle', theme: 'dark', disabled: true } };

// ═══════════════ Light Theme States ═══════════════

export const IdleLight: Story = {
  args: { state: 'idle', theme: 'light', disabled: false },
  parameters: { backgrounds: { default: 'light' } },
};

export const CopiedLight: Story = {
  args: { state: 'copied', theme: 'light', disabled: false },
  parameters: { backgrounds: { default: 'light' } },
};

export const ErrorLight: Story = {
  args: { state: 'error', theme: 'light', disabled: false },
  parameters: { backgrounds: { default: 'light' } },
};

export const DisabledLight: Story = {
  args: { state: 'idle', theme: 'light', disabled: true },
  parameters: { backgrounds: { default: 'light' } },
};
