import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TabBar from './TabBar.svelte';

describe('TabBar', () => {
  const defaultTabs = [
    { id: 'tab-1', fileName: 'index.ts', fileExtension: 'ts', type: 'code' as const, code: '' },
    { id: 'tab-2', fileName: 'styles.css', fileExtension: 'css', type: 'code' as const, code: '' },
    { id: 'tab-3', fileName: 'app.vue', fileExtension: 'vue', type: 'code' as const, code: '' },
  ];

  const defaultProps = {
    tabs: defaultTabs,
    activeTabId: 'tab-1',
    theme: 'dark' as const,
  };

  it('renders the wrapper div with nx-tab-bar class', () => {
    const { container } = render(TabBar, { props: defaultProps });
    expect(container.querySelector('.nx-tab-bar')).not.toBeNull();
  });

  it('renders element with role="tablist"', () => {
    const { container } = render(TabBar, { props: defaultProps });
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).not.toBeNull();
  });

  it('renders correct number of tabs', () => {
    const { container } = render(TabBar, { props: defaultProps });
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
  });

  it('renders single tab when only one tab provided', () => {
    const { container } = render(TabBar, {
      props: {
        ...defaultProps,
        tabs: [defaultTabs[0]],
      },
    });
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(1);
  });

  it('applies theme class to tab-list', () => {
    const { container } = render(TabBar, { props: defaultProps });
    const tabList = container.querySelector('.tab-list');
    expect(tabList?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class', () => {
    const { container } = render(TabBar, {
      props: { ...defaultProps, theme: 'light' },
    });
    const tabList = container.querySelector('.tab-list');
    expect(tabList?.classList.contains('light')).toBe(true);
  });

  it('marks active tab with aria-selected=true', () => {
    const { container } = render(TabBar, { props: defaultProps });
    const activeTab = container.querySelector('#tab-tab-1');
    expect(activeTab?.getAttribute('aria-selected')).toBe('true');
  });

  it('marks inactive tabs with aria-selected=false', () => {
    const { container } = render(TabBar, { props: defaultProps });
    const inactiveTab = container.querySelector('#tab-tab-2');
    expect(inactiveTab?.getAttribute('aria-selected')).toBe('false');
  });

  it('displays file names for each tab', () => {
    const { container } = render(TabBar, { props: defaultProps });
    const fileNames = container.querySelectorAll('.file-name');
    expect(fileNames[0]?.textContent).toBe('index.ts');
    expect(fileNames[1]?.textContent).toBe('styles.css');
    expect(fileNames[2]?.textContent).toBe('app.vue');
  });

  it('calls onTabChange when a non-active tab is clicked', async () => {
    const onTabChange = vi.fn();
    const { container } = render(TabBar, {
      props: { ...defaultProps, onTabChange },
    });
    const inactiveTab = container.querySelector('#tab-tab-2')!;
    await fireEvent.click(inactiveTab);
    expect(onTabChange).toHaveBeenCalledWith('tab-2');
  });

  it('does not call onTabChange when the active tab is clicked', async () => {
    const onTabChange = vi.fn();
    const { container } = render(TabBar, {
      props: { ...defaultProps, onTabChange },
    });
    const activeTab = container.querySelector('#tab-tab-1')!;
    await fireEvent.click(activeTab);
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it('renders empty tablist when no tabs provided', () => {
    const { container } = render(TabBar, {
      props: { ...defaultProps, tabs: [] },
    });
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(0);
  });
});
