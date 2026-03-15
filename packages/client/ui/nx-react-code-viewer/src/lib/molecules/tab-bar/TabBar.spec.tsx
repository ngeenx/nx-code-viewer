import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabBar } from './TabBar';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';

const createTabs = (count: number): MultiCodeViewerTabItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `tab-${i + 1}`,
    fileName: `file${i + 1}.ts`,
    type: 'code' as const,
    code: `const x${i + 1} = ${i + 1};`,
  }));

describe('TabBar', () => {
  const tabs = createTabs(3);

  it('renders a tablist', () => {
    render(<TabBar tabs={tabs} activeTabId="tab-1" />);

    expect(screen.getByRole('tablist')).not.toBeNull();
  });

  it('renders wrapper div with nx-tab-bar class', () => {
    const { container } = render(<TabBar tabs={tabs} activeTabId="tab-1" />);

    expect(container.querySelector('.nx-tab-bar')).not.toBeNull();
  });

  it('renders the correct number of tabs', () => {
    render(<TabBar tabs={tabs} activeTabId="tab-1" />);
    const tabElements = screen.getAllByRole('tab');

    expect(tabElements.length).toBe(3);
  });

  it('applies theme class to tab-list', () => {
    const { container } = render(
      <TabBar tabs={tabs} activeTabId="tab-1" theme="dark" />
    );
    const tabList = container.querySelector('.tab-list');

    expect(tabList?.className).toContain('dark');
  });

  it('applies light theme class', () => {
    const { container } = render(
      <TabBar tabs={tabs} activeTabId="tab-1" theme="light" />
    );
    const tabList = container.querySelector('.tab-list');

    expect(tabList?.className).toContain('light');
  });

  it('calls onTabChange when an inactive tab is clicked', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-1" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.click(tabElements[1]); // click tab-2

    expect(onTabChange).toHaveBeenCalledWith('tab-2');
  });

  it('does not call onTabChange when the active tab is clicked', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-1" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.click(tabElements[0]); // click tab-1 (already active)

    expect(onTabChange).not.toHaveBeenCalled();
  });

  it('navigates to next tab on ArrowRight key', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-1" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.keyDown(tabElements[0], { key: 'ArrowRight' });

    expect(onTabChange).toHaveBeenCalledWith('tab-2');
  });

  it('navigates to previous tab on ArrowLeft key', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-2" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.keyDown(tabElements[1], { key: 'ArrowLeft' });

    expect(onTabChange).toHaveBeenCalledWith('tab-1');
  });

  it('wraps around to last tab on ArrowLeft from first tab', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-1" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.keyDown(tabElements[0], { key: 'ArrowLeft' });

    expect(onTabChange).toHaveBeenCalledWith('tab-3');
  });

  it('wraps around to first tab on ArrowRight from last tab', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-3" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.keyDown(tabElements[2], { key: 'ArrowRight' });

    expect(onTabChange).toHaveBeenCalledWith('tab-1');
  });

  it('navigates to first tab on Home key', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-2" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.keyDown(tabElements[1], { key: 'Home' });

    expect(onTabChange).toHaveBeenCalledWith('tab-1');
  });

  it('navigates to last tab on End key', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar tabs={tabs} activeTabId="tab-1" onTabChange={onTabChange} />
    );
    const tabElements = screen.getAllByRole('tab');

    fireEvent.keyDown(tabElements[0], { key: 'End' });

    expect(onTabChange).toHaveBeenCalledWith('tab-3');
  });

  it('renders with a single tab', () => {
    const singleTab = createTabs(1);
    render(<TabBar tabs={singleTab} activeTabId="tab-1" />);

    expect(screen.getAllByRole('tab').length).toBe(1);
  });
});
