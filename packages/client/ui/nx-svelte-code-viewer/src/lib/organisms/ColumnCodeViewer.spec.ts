import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ColumnCodeViewer from './ColumnCodeViewer.svelte';

describe('ColumnCodeViewer', () => {
  const defaultColumns = [
    {
      id: 'col-1',
      type: 'code' as const,
      code: 'const a = 1;',
      language: 'plaintext' as const,
      title: 'Column 1',
    },
    {
      id: 'col-2',
      type: 'code' as const,
      code: 'const b = 2;',
      language: 'plaintext' as const,
      title: 'Column 2',
    },
    {
      id: 'col-3',
      type: 'code' as const,
      code: 'const c = 3;',
      language: 'plaintext' as const,
      title: 'Column 3',
    },
  ];

  const defaultProps = {
    columns: defaultColumns,
    theme: 'dark' as const,
  };

  it('renders the wrapper div with nx-column-code-viewer class', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    expect(container.querySelector('.nx-column-code-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    expect(container.querySelector('article')).not.toBeNull();
  });

  it('renders the columns-container div', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    expect(container.querySelector('.columns-container')).not.toBeNull();
  });

  it('renders correct number of column elements', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    const columns = container.querySelectorAll('.column');
    expect(columns.length).toBe(3);
  });

  it('renders single column', () => {
    const { container } = render(ColumnCodeViewer, {
      props: { ...defaultProps, columns: [defaultColumns[0]] },
    });
    const columns = container.querySelectorAll('.column');
    expect(columns.length).toBe(1);
  });

  it('applies column-divider class to all columns except the last', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    const columns = container.querySelectorAll('.column');
    expect(columns[0]?.classList.contains('column-divider')).toBe(true);
    expect(columns[1]?.classList.contains('column-divider')).toBe(true);
    expect(columns[2]?.classList.contains('column-divider')).toBe(false);
  });

  it('applies dark theme class to article', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class to article', () => {
    const { container } = render(ColumnCodeViewer, {
      props: { ...defaultProps, theme: 'light' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('light')).toBe(true);
  });

  it('applies classic border style by default', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-classic')).toBe(true);
  });

  it('applies grid-cross border style', () => {
    const { container } = render(ColumnCodeViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-grid-cross')).toBe(true);
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(ColumnCodeViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('renders border overlay for corner-intersection style', () => {
    const { container } = render(ColumnCodeViewer, {
      props: { ...defaultProps, borderStyle: 'corner-intersection' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('renders a CodeViewer inside each code column', () => {
    const { container } = render(ColumnCodeViewer, { props: defaultProps });
    const codeViewers = container.querySelectorAll('.nx-code-viewer');
    expect(codeViewers.length).toBe(3);
  });

  it('renders with two columns', () => {
    const { container } = render(ColumnCodeViewer, {
      props: {
        ...defaultProps,
        columns: [defaultColumns[0], defaultColumns[1]],
      },
    });
    const columns = container.querySelectorAll('.column');
    expect(columns.length).toBe(2);
  });
});
