import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CopyButton from './CopyButton.svelte';

describe('CopyButton', () => {
  it('renders a button element', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.type).toBe('button');
  });

  it('applies theme class to the button', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'light' },
    });
    const button = container.querySelector('button');
    expect(button?.classList.contains('light')).toBe(true);
  });

  it('applies nx-copy-button class', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.classList.contains('nx-copy-button')).toBe(true);
  });

  it('shows "Copy code" aria-label in idle state', () => {
    const { container } = render(CopyButton, {
      props: { state: 'idle', theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Copy code');
  });

  it('shows "Copied!" aria-label in copied state', () => {
    const { container } = render(CopyButton, {
      props: { state: 'copied', theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Copied!');
  });

  it('shows "Copy failed" aria-label in error state', () => {
    const { container } = render(CopyButton, {
      props: { state: 'error', theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Copy failed');
  });

  it('sets disabled attribute when disabled prop is true', () => {
    const { container } = render(CopyButton, {
      props: { disabled: true, theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('is not disabled by default', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark' },
    });
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(false);
  });

  it('calls onCopyClick when clicked', async () => {
    const onCopyClick = vi.fn();
    const { container } = render(CopyButton, {
      props: { theme: 'dark', onCopyClick },
    });
    const button = container.querySelector('button')!;
    await fireEvent.click(button);
    expect(onCopyClick).toHaveBeenCalledTimes(1);
  });

  it('is marked disabled when disabled prop is true', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark', disabled: true },
    });
    const button = container.querySelector('button')!;
    // Verify the disabled attribute is set, which prevents clicks in real browsers
    expect(button.disabled).toBe(true);
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('renders SVG icon', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark', state: 'idle' },
    });
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('applies state class to button', () => {
    const { container } = render(CopyButton, {
      props: { theme: 'dark', state: 'copied' },
    });
    const button = container.querySelector('button');
    expect(button?.classList.contains('copied')).toBe(true);
  });
});
