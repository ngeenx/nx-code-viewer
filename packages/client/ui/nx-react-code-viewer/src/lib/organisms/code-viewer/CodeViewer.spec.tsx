import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CodeViewer } from './CodeViewer';

describe('CodeViewer', () => {
  it('renders the wrapper div with nx-code-viewer class', () => {
    const { container } = render(<CodeViewer code="const x = 1;" />);

    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(<CodeViewer code="const x = 1;" />);

    expect(container.querySelector('article')).not.toBeNull();
  });

  it('applies dark theme class to article', () => {
    const { container } = render(<CodeViewer code="const x = 1;" theme="dark" />);
    const article = container.querySelector('article');

    expect(article?.className).toContain('dark');
  });

  it('applies light theme class to article', () => {
    const { container } = render(<CodeViewer code="const x = 1;" theme="light" />);
    const article = container.querySelector('article');

    expect(article?.className).toContain('light');
  });

  it('applies border style class to article', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" borderStyle="classic" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('border-classic');
  });

  it('applies grid-cross border style class', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" borderStyle="grid-cross" />
    );
    const article = container.querySelector('article');

    expect(article?.className).toContain('border-grid-cross');
  });

  it('renders header when showHeader is true', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" showHeader={true} />
    );

    expect(container.querySelector('.nx-code-header')).not.toBeNull();
  });

  it('does not render header when showHeader is false', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" showHeader={false} />
    );

    expect(container.querySelector('.nx-code-header')).toBeNull();
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" borderStyle="grid-cross" />
    );

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('renders border overlay for corner-intersection style', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" borderStyle="corner-intersection" />
    );

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" borderStyle="classic" />
    );

    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('does not render border overlay for none style', () => {
    const { container } = render(
      <CodeViewer code="const x = 1;" borderStyle="none" />
    );

    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('accepts string array as code prop', () => {
    const { container } = render(
      <CodeViewer code={['const x = 1;', 'const y = 2;']} />
    );

    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
  });

  it('renders with default props', () => {
    const { container } = render(<CodeViewer code="" />);

    expect(container.querySelector('.nx-code-viewer')).not.toBeNull();
  });
});
