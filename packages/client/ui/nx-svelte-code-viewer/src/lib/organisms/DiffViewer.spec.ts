import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import DiffViewer from './DiffViewer.svelte';

describe('DiffViewer', () => {
  const defaultProps = {
    oldCode: 'const x = 1;',
    newCode: 'const x = 2;',
    language: 'plaintext' as const,
    theme: 'dark' as const,
  };

  it('renders the wrapper div with nx-diff-viewer class', () => {
    const { container } = render(DiffViewer, { props: defaultProps });
    expect(container.querySelector('.nx-diff-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(DiffViewer, { props: defaultProps });
    expect(container.querySelector('article')).not.toBeNull();
  });

  it('applies dark theme class to article', () => {
    const { container } = render(DiffViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class to article', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, theme: 'light' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('light')).toBe(true);
  });

  it('applies classic border style by default', () => {
    const { container } = render(DiffViewer, { props: defaultProps });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-classic')).toBe(true);
  });

  it('applies grid-cross border style', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-grid-cross')).toBe(true);
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, borderStyle: 'grid-cross' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('renders border overlay for corner-intersection style', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, borderStyle: 'corner-intersection' },
    });
    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(DiffViewer, { props: defaultProps });
    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('renders header when showHeader is true', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, showHeader: true },
    });
    expect(container.querySelector('.nx-code-header')).not.toBeNull();
  });

  it('does not render header when showHeader is false', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, showHeader: false },
    });
    expect(container.querySelector('.nx-code-header')).toBeNull();
  });

  it('shows "No changes to display" when there are no changes', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, oldCode: '', newCode: '', diff: '' },
    });
    const noChanges = container.querySelector('.no-changes');
    expect(noChanges?.textContent).toContain('No changes to display');
  });

  it('renders diff stats when there are changes', () => {
    const { container } = render(DiffViewer, { props: defaultProps });
    const stats = container.querySelector('.diff-stats');
    expect(stats).not.toBeNull();
  });

  it('renders with diff string input', () => {
    const diffString = `--- a/file.ts
+++ b/file.ts
@@ -1 +1 @@
-const x = 1;
+const x = 2;`;
    const { container } = render(DiffViewer, {
      props: { diff: diffString, language: 'plaintext', theme: 'dark' },
    });
    expect(container.querySelector('.nx-diff-viewer')).not.toBeNull();
  });

  it('applies none border style', () => {
    const { container } = render(DiffViewer, {
      props: { ...defaultProps, borderStyle: 'none' },
    });
    const article = container.querySelector('article');
    expect(article?.classList.contains('border-none')).toBe(true);
  });
});
