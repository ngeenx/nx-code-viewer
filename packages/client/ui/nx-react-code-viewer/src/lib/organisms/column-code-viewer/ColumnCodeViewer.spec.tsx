import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ColumnCodeViewer } from './ColumnCodeViewer';
import type { ColumnItem } from '@ngeenx/nx-code-viewer-utils';

const codeColumns: ColumnItem[] = [
  {
    id: 'col-1',
    title: 'Before',
    type: 'code',
    code: 'const x = 1;',
    language: 'plaintext',
  },
  {
    id: 'col-2',
    title: 'After',
    type: 'code',
    code: 'const x = 2;',
    language: 'plaintext',
  },
  {
    id: 'col-3',
    title: 'Final',
    type: 'code',
    code: 'const x = 3;',
    language: 'plaintext',
  },
];

const mixedColumns: ColumnItem[] = [
  {
    id: 'col-code',
    title: 'Code',
    type: 'code',
    code: 'const x = 1;',
    language: 'plaintext',
  },
  {
    id: 'col-diff',
    title: 'Diff',
    type: 'diff',
    oldCode: 'const a = 1;',
    newCode: 'const b = 2;',
    language: 'plaintext',
  },
];

describe('ColumnCodeViewer', () => {
  it('renders the wrapper div with nx-column-code-viewer class', () => {
    const { container } = render(<ColumnCodeViewer columns={codeColumns} />);

    expect(container.querySelector('.nx-column-code-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(<ColumnCodeViewer columns={codeColumns} />);

    expect(container.querySelector('article')).not.toBeNull();
  });

  it('renders columns-container div', () => {
    const { container } = render(<ColumnCodeViewer columns={codeColumns} />);

    expect(container.querySelector('.columns-container')).not.toBeNull();
  });

  it('renders the correct number of columns', () => {
    const { container } = render(<ColumnCodeViewer columns={codeColumns} />);
    const columns = container.querySelectorAll('.column');

    expect(columns.length).toBe(3);
  });

  it('adds column-divider class to all columns except the last', () => {
    const { container } = render(<ColumnCodeViewer columns={codeColumns} />);
    const columns = container.querySelectorAll('.column');

    expect(columns[0]?.className).toContain('column-divider');
    expect(columns[1]?.className).toContain('column-divider');
    expect(columns[2]?.className).not.toContain('column-divider');
  });

  it('applies theme class to article', () => {
    const { container } = render(
      <ColumnCodeViewer columns={codeColumns} theme="dark" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('dark');
  });

  it('applies light theme class', () => {
    const { container } = render(
      <ColumnCodeViewer columns={codeColumns} theme="light" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('light');
  });

  it('applies border style class', () => {
    const { container } = render(
      <ColumnCodeViewer columns={codeColumns} borderStyle="classic" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('border-classic');
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(
      <ColumnCodeViewer columns={codeColumns} borderStyle="grid-cross" />
    );

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(
      <ColumnCodeViewer columns={codeColumns} borderStyle="classic" />
    );

    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('renders code viewers for code column items', () => {
    const { container } = render(<ColumnCodeViewer columns={codeColumns} />);

    expect(container.querySelectorAll('.nx-code-viewer').length).toBe(3);
  });

  it('renders diff viewer for diff column items', () => {
    const { container } = render(<ColumnCodeViewer columns={mixedColumns} />);

    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
    expect(container.querySelector('.nx-diff-viewer')).not.toBeNull();
  });

  it('renders with a single column', () => {
    const singleColumn: ColumnItem[] = [codeColumns[0]];
    const { container } = render(<ColumnCodeViewer columns={singleColumn} />);
    const columns = container.querySelectorAll('.column');

    expect(columns.length).toBe(1);
    expect(columns[0]?.className).not.toContain('column-divider');
  });

  it('renders with default props', () => {
    const { container } = render(<ColumnCodeViewer columns={[]} />);

    expect(container.querySelector('.nx-column-code-viewer')).not.toBeNull();
  });

  it('renders border overlay for corner-intersection style', () => {
    const { container } = render(
      <ColumnCodeViewer columns={codeColumns} borderStyle="corner-intersection" />
    );

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });
});
