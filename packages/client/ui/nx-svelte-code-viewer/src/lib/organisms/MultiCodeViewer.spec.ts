import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import MultiCodeViewer from './MultiCodeViewer.svelte';

describe('MultiCodeViewer', () => {
  const defaultTabs = [
    {
      id: 'tab-1',
      fileName: 'index.ts',
      fileExtension: 'ts',
      type: 'code' as const,
      code: 'const x = 1;',
      language: 'plaintext' as const,
    },
    {
      id: 'tab-2',
      fileName: 'styles.css',
      fileExtension: 'css',
      type: 'code' as const,
      code: 'body { color: red; }',
      language: 'plaintext' as const,
    },
  ];

  const defaultProps = {
    tabs: defaultTabs,
    theme: 'dark' as const,
  };

  it('renders the wrapper div with nx-multi-code-viewer class', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    expect(container.querySelector('.nx-multi-code-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    expect(container.querySelector('article')).not.toBeNull();
  });

  it('renders the tab bar', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    expect(container.querySelector('.nx-tab-bar')).not.toBeNull();
  });

  it('renders correct number of tabs in the tab bar', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(2);
  });

  it('renders tab panels', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels.length).toBe(2);
  });

  it('applies dark theme class', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class', () => {
    const { container } = render(MultiCodeViewer, {
      props: { ...defaultProps, theme: 'light' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('light')).toBe(true);
  });

  it('applies classic border style by default', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-classic')).toBe(true);
  });

  it('applies grid-cross border style', () => {
    const { container } = render(MultiCodeViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-grid-cross')).toBe(true);
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(MultiCodeViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('first tab is active by default', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    const firstTab = container.querySelector('#tab-tab-1');
    expect(firstTab?.getAttribute('aria-selected')).toBe('true');
  });

  it('sets initialActiveTabId as active tab', () => {
    const { container } = render(MultiCodeViewer, {
      props: { ...defaultProps, initialActiveTabId: 'tab-2' },
    });
    const secondTab = container.querySelector('#tab-tab-2');
    expect(secondTab?.getAttribute('aria-selected')).toBe('true');
  });

  it('renders with single tab', () => {
    const { container } = render(MultiCodeViewer, {
      props: { ...defaultProps, tabs: [defaultTabs[0]] },
    });
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(1);
  });

  it('renders tab-panels container', () => {
    const { container } = render(MultiCodeViewer, { props: defaultProps });
    expect(container.querySelector('.tab-panels')).not.toBeNull();
  });
});
