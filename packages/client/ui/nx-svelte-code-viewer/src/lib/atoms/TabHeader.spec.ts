import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TabHeader from './TabHeader.svelte';

describe('TabHeader', () => {
  const defaultProps = {
    tabId: 'tab-1',
    fileName: 'index.ts',
    theme: 'dark' as const,
  };

  it('renders a button with role="tab"', () => {
    const { container } = render(TabHeader, { props: defaultProps });
    const button = container.querySelector('button[role="tab"]');
    expect(button).not.toBeNull();
  });

  it('shows the fileName', () => {
    const { container } = render(TabHeader, { props: defaultProps });
    const fileNameEl = container.querySelector('.file-name');
    expect(fileNameEl?.textContent).toBe('index.ts');
  });

  it('sets aria-selected to true when isActive is true', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, isActive: true },
    });
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-selected')).toBe('true');
  });

  it('sets aria-selected to false when isActive is false', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, isActive: false },
    });
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-selected')).toBe('false');
  });

  it('sets correct aria-controls attribute', () => {
    const { container } = render(TabHeader, { props: defaultProps });
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-controls')).toBe('panel-tab-1');
  });

  it('sets correct id attribute', () => {
    const { container } = render(TabHeader, { props: defaultProps });
    const button = container.querySelector('button');
    expect(button?.id).toBe('tab-tab-1');
  });

  it('has tabindex=0 when active', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, isActive: true },
    });
    const button = container.querySelector('button');
    expect(button?.tabIndex).toBe(0);
  });

  it('has tabindex=-1 when not active', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, isActive: false },
    });
    const button = container.querySelector('button');
    expect(button?.tabIndex).toBe(-1);
  });

  it('applies theme class to button', () => {
    const { container } = render(TabHeader, { props: defaultProps });
    const button = container.querySelector('button');
    expect(button?.classList.contains('dark')).toBe(true);
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, isActive: true },
    });
    const button = container.querySelector('button');
    expect(button?.classList.contains('active')).toBe(true);
  });

  it('does not apply active class when isActive is false', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, isActive: false },
    });
    const button = container.querySelector('button');
    expect(button?.classList.contains('active')).toBe(false);
  });

  it('renders file icon when fileExtension is provided', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, fileExtension: '.ts' },
    });
    const icon = container.querySelector('.file-icon');
    expect(icon).not.toBeNull();
    expect(icon?.tagName).toBe('IMG');
  });

  it('does not render file icon when fileExtension is empty', () => {
    const { container } = render(TabHeader, {
      props: { ...defaultProps, fileExtension: '' },
    });
    const icon = container.querySelector('.file-icon');
    expect(icon).toBeNull();
  });

  it('calls onTabClick with tabId when clicked', async () => {
    const onTabClick = vi.fn();
    const { container } = render(TabHeader, {
      props: { ...defaultProps, onTabClick },
    });
    const button = container.querySelector('button')!;
    await fireEvent.click(button);
    expect(onTabClick).toHaveBeenCalledWith('tab-1');
  });

  it('renders wrapper div with nx-tab-header class', () => {
    const { container } = render(TabHeader, { props: defaultProps });
    expect(container.querySelector('.nx-tab-header')).not.toBeNull();
  });
});
