import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiffViewer } from './DiffViewer';

describe('DiffViewer', () => {
  it('renders the wrapper div with nx-diff-viewer class', () => {
    const { container } = render(<DiffViewer />);

    expect(container.querySelector('.nx-diff-viewer')).not.toBeNull();
  });

  it('renders an article element', () => {
    const { container } = render(<DiffViewer />);

    expect(container.querySelector('article')).not.toBeNull();
  });

  it('applies dark theme class', () => {
    const { container } = render(<DiffViewer theme="dark" />);
    const article = container.querySelector('article');

    expect(article?.className).toContain('dark');
  });

  it('applies light theme class', () => {
    const { container } = render(<DiffViewer theme="light" />);
    const article = container.querySelector('article');

    expect(article?.className).toContain('light');
  });

  it('applies border style class', () => {
    const { container } = render(<DiffViewer borderStyle="classic" />);
    const article = container.querySelector('article');

    expect(article?.className).toContain('border-classic');
  });

  it('shows no changes message when no code is provided', () => {
    render(<DiffViewer />);

    expect(screen.getByText('No changes to display')).not.toBeNull();
  });

  it('shows no changes message with empty strings', () => {
    render(<DiffViewer oldCode="" newCode="" />);

    expect(screen.getByText('No changes to display')).not.toBeNull();
  });

  it('renders border overlay for grid-cross style', () => {
    const { container } = render(<DiffViewer borderStyle="grid-cross" />);

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('renders border overlay for corner-intersection style', () => {
    const { container } = render(<DiffViewer borderStyle="corner-intersection" />);

    expect(container.querySelector('.border-overlay')).not.toBeNull();
  });

  it('does not render border overlay for classic style', () => {
    const { container } = render(<DiffViewer borderStyle="classic" />);

    expect(container.querySelector('.border-overlay')).toBeNull();
  });

  it('renders header when showHeader is true', () => {
    const { container } = render(<DiffViewer showHeader={true} />);

    expect(container.querySelector('.nx-code-header')).not.toBeNull();
  });

  it('does not render header when showHeader is false', () => {
    const { container } = render(<DiffViewer showHeader={false} />);

    expect(container.querySelector('.nx-code-header')).toBeNull();
  });

  it('renders diff content when old and new code differ', () => {
    const { container } = render(
      <DiffViewer oldCode="line1" newCode="line2" language="plaintext" />
    );

    // Should have diff stats when there are changes
    expect(container.querySelector('.diff-stats')).not.toBeNull();
  });

  it('renders with default props', () => {
    const { container } = render(<DiffViewer />);

    expect(container.querySelector('.nx-diff-viewer')).not.toBeNull();
  });
});
