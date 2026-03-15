import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiCodeViewer } from './MultiCodeViewer';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';

const codeTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'tab-1',
    fileName: 'index.ts',
    type: 'code',
    code: 'const x = 1;',
    language: 'plaintext',
  },
  {
    id: 'tab-2',
    fileName: 'app.ts',
    type: 'code',
    code: 'const y = 2;',
    language: 'plaintext',
  },
];

const mixedTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'tab-code',
    fileName: 'index.ts',
    type: 'code',
    code: 'const x = 1;',
    language: 'plaintext',
  },
  {
    id: 'tab-diff',
    fileName: 'changes.ts',
    type: 'diff',
    oldCode: 'const a = 1;',
    newCode: 'const b = 2;',
    language: 'plaintext',
  },
];

describe('MultiCodeViewer', () => {
  it('renders the wrapper div with nx-multi-code-viewer class', () => {
    const { container } = render(<MultiCodeViewer tabs={codeTabs} />);

    expect(container.querySelector('.nx-multi-code-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(<MultiCodeViewer tabs={codeTabs} />);

    expect(container.querySelector('article')).not.toBeNull();
  });

  it('renders a tab bar with tablist role', () => {
    render(<MultiCodeViewer tabs={codeTabs} />);

    expect(screen.getByRole('tablist')).not.toBeNull();
  });

  it('renders the correct number of tabs', () => {
    render(<MultiCodeViewer tabs={codeTabs} />);

    expect(screen.getAllByRole('tab').length).toBe(2);
  });

  it('renders tab panels', () => {
    render(<MultiCodeViewer tabs={codeTabs} />);
    const panels = screen.getAllByRole('tabpanel');

    expect(panels.length).toBe(2);
  });

  it('first tab is active by default', () => {
    render(<MultiCodeViewer tabs={codeTabs} />);
    const panels = screen.getAllByRole('tabpanel');

    expect(panels[0]?.className).toContain('active');
    expect(panels[1]?.className).toContain('hidden');
  });

  it('respects initialActiveTabId', () => {
    render(<MultiCodeViewer tabs={codeTabs} initialActiveTabId="tab-2" />);
    const panels = screen.getAllByRole('tabpanel');

    expect(panels[0]?.className).toContain('hidden');
    expect(panels[1]?.className).toContain('active');
  });

  it('applies theme class to article', () => {
    const { container } = render(
      <MultiCodeViewer tabs={codeTabs} theme="dark" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('dark');
  });

  it('applies border style class', () => {
    const { container } = render(
      <MultiCodeViewer tabs={codeTabs} borderStyle="classic" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('border-classic');
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(
      <MultiCodeViewer tabs={codeTabs} borderStyle="grid-cross" />
    );

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(
      <MultiCodeViewer tabs={codeTabs} borderStyle="classic" />
    );

    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('renders code viewers for code tab items', () => {
    const { container } = render(<MultiCodeViewer tabs={codeTabs} />);

    expect(container.querySelectorAll('.nx-code-viewer').length).toBe(2);
  });

  it('renders diff viewer for diff tab items', () => {
    const { container } = render(<MultiCodeViewer tabs={mixedTabs} />);

    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
    expect(container.querySelector('.nx-diff-viewer')).not.toBeNull();
  });

  it('renders tab-panels container', () => {
    const { container } = render(<MultiCodeViewer tabs={codeTabs} />);

    expect(container.querySelector('.tab-panels')).not.toBeNull();
  });

  it('sets correct panel ids', () => {
    render(<MultiCodeViewer tabs={codeTabs} />);
    const panels = screen.getAllByRole('tabpanel');

    expect(panels[0]?.id).toBe('panel-tab-1');
    expect(panels[1]?.id).toBe('panel-tab-2');
  });
});
