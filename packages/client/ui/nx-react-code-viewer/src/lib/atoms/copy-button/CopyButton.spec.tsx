import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  it('renders a button element', () => {
    render(<CopyButton />);

    expect(screen.getByRole('button')).not.toBeNull();
  });

  it('renders wrapper div with nx-copy-button class', () => {
    const { container } = render(<CopyButton />);

    expect(container.querySelector('.nx-copy-button')).not.toBeNull();
  });

  it('applies theme class to the button', () => {
    render(<CopyButton theme="dark" />);
    const button = screen.getByRole('button');

    expect(button.className).toContain('dark');
  });

  it('applies light theme class', () => {
    render(<CopyButton theme="light" />);
    const button = screen.getByRole('button');

    expect(button.className).toContain('light');
  });

  it('shows "Copy to clipboard" aria-label in idle state', () => {
    render(<CopyButton state="idle" />);
    const button = screen.getByRole('button');

    expect(button.getAttribute('aria-label')).toBe('Copy to clipboard');
  });

  it('shows "Copied to clipboard" aria-label in copied state', () => {
    render(<CopyButton state="copied" />);
    const button = screen.getByRole('button');

    expect(button.getAttribute('aria-label')).toBe('Copied to clipboard');
  });

  it('shows "Failed to copy" aria-label in error state', () => {
    render(<CopyButton state="error" />);
    const button = screen.getByRole('button');

    expect(button.getAttribute('aria-label')).toBe('Failed to copy');
  });

  it('adds state class when not idle', () => {
    render(<CopyButton state="copied" theme="dark" />);
    const button = screen.getByRole('button');

    expect(button.className).toContain('copied');
  });

  it('button is disabled when disabled prop is true', () => {
    render(<CopyButton disabled={true} />);
    const button = screen.getByRole('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('calls onCopyClick when button is clicked', () => {
    const onCopyClick = vi.fn();
    render(<CopyButton onCopyClick={onCopyClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onCopyClick).toHaveBeenCalledOnce();
  });

  it('does not call onCopyClick when disabled', () => {
    const onCopyClick = vi.fn();
    render(<CopyButton disabled={true} onCopyClick={onCopyClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onCopyClick).not.toHaveBeenCalled();
  });

  it('renders an svg icon', () => {
    const { container } = render(<CopyButton />);

    expect(container.querySelector('svg')).not.toBeNull();
  });
});
