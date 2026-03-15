import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DiffCollapsedIndicator from './DiffCollapsedIndicator.svelte';

describe('DiffCollapsedIndicator', () => {
  const defaultProps = {
    range: { startLine: 5, endLine: 15 },
    hiddenCount: 10,
    theme: 'dark' as const,
  };

  it('renders the wrapper div with nx-diff-collapsed-indicator class', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: defaultProps,
    });
    expect(container.querySelector('.nx-diff-collapsed-indicator')).not.toBeNull();
  });

  it('renders the indicator with diff-collapsed-indicator class', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: defaultProps,
    });
    expect(container.querySelector('.diff-collapsed-indicator')).not.toBeNull();
  });

  it('shows hidden count text', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: defaultProps,
    });
    const content = container.querySelector('.content');
    expect(content?.textContent).toContain('10 lines');
  });

  it('shows singular "line" for count of 1', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, hiddenCount: 1 },
    });
    const content = container.querySelector('.content');
    expect(content?.textContent).toContain('1 line');
    expect(content?.textContent).not.toContain('1 lines');
  });

  it('shows plural "lines" for count greater than 1', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, hiddenCount: 5 },
    });
    const content = container.querySelector('.content');
    expect(content?.textContent).toContain('5 lines');
  });

  it('applies dark theme class', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, theme: 'dark' },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator');
    expect(indicator?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, theme: 'light' },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator');
    expect(indicator?.classList.contains('light')).toBe(true);
  });

  it('has role="button" on the indicator', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: defaultProps,
    });
    const indicator = container.querySelector('.diff-collapsed-indicator');
    expect(indicator?.getAttribute('role')).toBe('button');
  });

  it('has tabindex="0" for keyboard accessibility', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: defaultProps,
    });
    const indicator = container.querySelector('.diff-collapsed-indicator');
    expect(indicator?.getAttribute('tabindex')).toBe('0');
  });

  it('sets correct aria-label when collapsed', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, isExpanded: false },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator');
    expect(indicator?.getAttribute('aria-label')).toContain('Expand');
    expect(indicator?.getAttribute('aria-label')).toContain('10');
  });

  it('sets correct aria-label when expanded', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, isExpanded: true },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator');
    expect(indicator?.getAttribute('aria-label')).toContain('Collapse');
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, onToggle },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator')!;
    await fireEvent.click(indicator);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle on Enter keypress', async () => {
    const onToggle = vi.fn();
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, onToggle },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator')!;
    await fireEvent.keyDown(indicator, { key: 'Enter' });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle on Space keypress', async () => {
    const onToggle = vi.fn();
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, onToggle },
    });
    const indicator = container.querySelector('.diff-collapsed-indicator')!;
    await fireEvent.keyDown(indicator, { key: ' ' });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders line number spans when showLineNumbers is true', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, showLineNumbers: true },
    });
    const lineNumbers = container.querySelectorAll('.line-number');
    expect(lineNumbers.length).toBe(2); // old and new
  });

  it('does not render line number spans when showLineNumbers is false', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, showLineNumbers: false },
    });
    const lineNumbers = container.querySelectorAll('.line-number');
    expect(lineNumbers.length).toBe(0);
  });

  it('renders prefix SVG when showPrefix is true', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, showPrefix: true },
    });
    const prefix = container.querySelector('.prefix');
    expect(prefix).not.toBeNull();
    expect(prefix?.querySelector('svg')).not.toBeNull();
  });

  it('does not render prefix when showPrefix is false', () => {
    const { container } = render(DiffCollapsedIndicator, {
      props: { ...defaultProps, showPrefix: false },
    });
    const prefix = container.querySelector('.prefix');
    expect(prefix).toBeNull();
  });
});
