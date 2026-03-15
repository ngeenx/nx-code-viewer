import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CodeViewer from './CodeViewer.svelte';

describe('CodeViewer', () => {
  const defaultProps = {
    code: 'const x = 1;',
    language: 'plaintext' as const,
    theme: 'dark' as const,
  };

  it('renders the wrapper div with nx-code-viewer class', () => {
    const { container } = render(CodeViewer, { props: defaultProps });
    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(CodeViewer, { props: defaultProps });
    expect(container.querySelector('article')).not.toBeNull();
  });

  it('applies dark theme class to article', () => {
    const { container } = render(CodeViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class to article', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, theme: 'light' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('light')).toBe(true);
  });

  it('applies classic border style by default', () => {
    const { container } = render(CodeViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-classic')).toBe(true);
  });

  it('applies grid-cross border style', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-grid-cross')).toBe(true);
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
    expect(container.querySelector('.corner-cross')).not.toBeNull();
  });

  it('renders border overlay for corner-intersection style', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, borderStyle: 'corner-intersection' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
    expect(container.querySelector('.border-top-extended')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(CodeViewer, { props: defaultProps });
    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('renders header when showHeader is true', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, showHeader: true },
    });
    expect(container.querySelector('.nx-code-header')).not.toBeNull();
  });

  it('does not render header when showHeader is false', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, showHeader: false },
    });
    expect(container.querySelector('.nx-code-header')).toBeNull();
  });

  it('renders with string code input', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, code: 'hello world' },
    });
    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
  });

  it('renders with array code input', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, code: ['line 1', 'line 2'] },
    });
    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
  });

  it('applies none border style', () => {
    const { container } = render(CodeViewer, {
      props: { ...defaultProps, borderStyle: 'none' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-none')).toBe(true);
  });
});
