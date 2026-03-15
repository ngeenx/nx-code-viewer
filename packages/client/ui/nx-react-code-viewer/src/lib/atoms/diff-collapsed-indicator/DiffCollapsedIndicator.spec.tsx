import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiffCollapsedIndicator } from './DiffCollapsedIndicator';
import type { DiffCollapsedRange } from '@ngeenx/nx-code-viewer-utils';

describe('DiffCollapsedIndicator', () => {
  const defaultRange: DiffCollapsedRange = {
    startLine: 5,
    endLine: 15,
    type: 'unchanged',
  };

  it('renders the indicator wrapper', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={10} />
    );

    expect(container.querySelector('.nx-diff-collapsed-indicator')).not.toBeNull();
  });

  it('shows the hidden count text for singular', () => {
    render(<DiffCollapsedIndicator range={defaultRange} hiddenCount={1} />);

    expect(screen.getByText(/1 line/)).not.toBeNull();
  });

  it('shows the hidden count text for plural', () => {
    render(<DiffCollapsedIndicator range={defaultRange} hiddenCount={10} />);

    expect(screen.getByText(/10 lines/)).not.toBeNull();
  });

  it('applies theme class', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} theme="dark" />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    expect(indicator?.className).toContain('dark');
  });

  it('applies light theme class', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} theme="light" />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    expect(indicator?.className).toContain('light');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} onToggle={onToggle} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    fireEvent.click(indicator!);

    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('calls onToggle on Enter key press', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} onToggle={onToggle} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    fireEvent.keyDown(indicator!, { key: 'Enter' });

    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('calls onToggle on Space key press', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} onToggle={onToggle} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    fireEvent.keyDown(indicator!, { key: ' ' });

    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('has role=button', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    expect(indicator?.getAttribute('role')).toBe('button');
  });

  it('has tabIndex=0 for keyboard accessibility', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    expect(indicator?.getAttribute('tabindex')).toBe('0');
  });

  it('sets aria-expanded based on isExpanded prop', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} isExpanded={true} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    expect(indicator?.getAttribute('aria-expanded')).toBe('true');
  });

  it('sets aria-expanded to false when collapsed', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} isExpanded={false} />
    );
    const indicator = container.querySelector('.diff-collapsed-indicator');

    expect(indicator?.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows line number elements when showLineNumbers is true', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} showLineNumbers={true} />
    );
    const lineNumbers = container.querySelectorAll('.line-number');

    expect(lineNumbers.length).toBe(2);
  });

  it('hides line number elements when showLineNumbers is false', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} showLineNumbers={false} />
    );
    const lineNumbers = container.querySelectorAll('.line-number');

    expect(lineNumbers.length).toBe(0);
  });

  it('shows prefix svg when showPrefix is true', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} showPrefix={true} />
    );
    const prefix = container.querySelector('.prefix svg');

    expect(prefix).not.toBeNull();
  });

  it('hides prefix when showPrefix is false', () => {
    const { container } = render(
      <DiffCollapsedIndicator range={defaultRange} hiddenCount={5} showPrefix={false} />
    );
    const prefix = container.querySelector('.prefix');

    expect(prefix).toBeNull();
  });
});
