import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeHeader } from './CodeHeader';

describe('CodeHeader', () => {
  it('renders a header element', () => {
    const { container } = render(<CodeHeader language="typescript" theme="dark" />);

    expect(container.querySelector('header')).not.toBeNull();
  });

  it('renders the wrapper div with nx-code-header class', () => {
    const { container } = render(<CodeHeader />);

    expect(container.querySelector('.nx-code-header')).not.toBeNull();
  });

  it('applies dark theme class to header', () => {
    const { container } = render(<CodeHeader theme="dark" />);
    const header = container.querySelector('header');

    expect(header?.className).toBe('dark');
  });

  it('applies light theme class to header', () => {
    const { container } = render(<CodeHeader theme="light" />);
    const header = container.querySelector('header');

    expect(header?.className).toBe('light');
  });

  it('shows the title when provided', () => {
    render(<CodeHeader title="My Component" />);

    expect(screen.getByText('My Component')).not.toBeNull();
  });

  it('shows language display name when no title is provided', () => {
    render(<CodeHeader language="typescript" />);
    const titleEl = screen.getByText(/typescript/i);

    expect(titleEl).not.toBeNull();
  });

  it('renders a file icon img when fileExtension is provided', () => {
    const { container } = render(<CodeHeader fileExtension=".ts" />);
    const img = container.querySelector('img.file-icon');

    expect(img).not.toBeNull();
  });

  it('renders a file icon img for known language extensions', () => {
    const { container } = render(<CodeHeader language="typescript" />);
    const img = container.querySelector('img.file-icon');

    expect(img).not.toBeNull();
  });

  it('renders title-container div', () => {
    const { container } = render(<CodeHeader />);
    const titleContainer = container.querySelector('.title-container');

    expect(titleContainer).not.toBeNull();
  });

  it('renders title in a span with class title', () => {
    const { container } = render(<CodeHeader title="Test" />);
    const titleSpan = container.querySelector('span.title');

    expect(titleSpan).not.toBeNull();
    expect(titleSpan?.textContent).toBe('Test');
  });
});
