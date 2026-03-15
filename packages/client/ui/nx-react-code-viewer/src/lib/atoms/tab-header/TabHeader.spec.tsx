import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabHeader } from './TabHeader';

describe('TabHeader', () => {
  const defaultProps = {
    tabId: 'tab-1',
    fileName: 'index.ts',
  };

  it('renders a button with role=tab', () => {
    render(<TabHeader {...defaultProps} />);

    expect(screen.getByRole('tab')).not.toBeNull();
  });

  it('renders wrapper div with nx-tab-header class', () => {
    const { container } = render(<TabHeader {...defaultProps} />);

    expect(container.querySelector('.nx-tab-header')).not.toBeNull();
  });

  it('shows the fileName text', () => {
    render(<TabHeader {...defaultProps} />);

    expect(screen.getByText('index.ts')).not.toBeNull();
  });

  it('sets aria-selected to true when isActive', () => {
    render(<TabHeader {...defaultProps} isActive={true} />);
    const tab = screen.getByRole('tab');

    expect(tab.getAttribute('aria-selected')).toBe('true');
  });

  it('sets aria-selected to false when not active', () => {
    render(<TabHeader {...defaultProps} isActive={false} />);
    const tab = screen.getByRole('tab');

    expect(tab.getAttribute('aria-selected')).toBe('false');
  });

  it('sets tabIndex to 0 when active', () => {
    render(<TabHeader {...defaultProps} isActive={true} />);
    const tab = screen.getByRole('tab');

    expect(tab.tabIndex).toBe(0);
  });

  it('sets tabIndex to -1 when not active', () => {
    render(<TabHeader {...defaultProps} isActive={false} />);
    const tab = screen.getByRole('tab');

    expect(tab.tabIndex).toBe(-1);
  });

  it('applies theme and active classes', () => {
    render(<TabHeader {...defaultProps} theme="dark" isActive={true} />);
    const tab = screen.getByRole('tab');

    expect(tab.className).toContain('dark');
    expect(tab.className).toContain('active');
  });

  it('renders a file icon when fileExtension is provided', () => {
    const { container } = render(
      <TabHeader {...defaultProps} fileExtension=".ts" />
    );
    const img = container.querySelector('img.file-icon');

    expect(img).not.toBeNull();
  });

  it('does not render a file icon when no fileExtension', () => {
    const { container } = render(<TabHeader {...defaultProps} />);
    const img = container.querySelector('img.file-icon');

    expect(img).toBeNull();
  });

  it('calls onTabClick with tabId when clicked', () => {
    const onTabClick = vi.fn();
    render(<TabHeader {...defaultProps} onTabClick={onTabClick} />);

    fireEvent.click(screen.getByRole('tab'));

    expect(onTabClick).toHaveBeenCalledWith('tab-1');
  });

  it('sets aria-controls to panel-{tabId}', () => {
    render(<TabHeader {...defaultProps} />);
    const tab = screen.getByRole('tab');

    expect(tab.getAttribute('aria-controls')).toBe('panel-tab-1');
  });

  it('sets id to tab-{tabId}', () => {
    render(<TabHeader {...defaultProps} />);
    const tab = screen.getByRole('tab');

    expect(tab.id).toBe('tab-tab-1');
  });

  it('renders file-name span', () => {
    const { container } = render(<TabHeader {...defaultProps} />);
    const span = container.querySelector('span.file-name');

    expect(span).not.toBeNull();
    expect(span?.textContent).toBe('index.ts');
  });
});
