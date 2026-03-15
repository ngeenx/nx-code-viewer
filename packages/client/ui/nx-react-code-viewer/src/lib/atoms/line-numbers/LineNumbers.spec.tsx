import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { LineNumbers } from './LineNumbers';

describe('LineNumbers', () => {
  it('renders the correct number of line number elements', () => {
    const { container } = render(<LineNumbers lineCount={5} />);
    const lineElements = container.querySelectorAll('.line-number');

    expect(lineElements.length).toBe(5);
  });

  it('renders wrapper div with nx-line-numbers class', () => {
    const { container } = render(<LineNumbers lineCount={3} />);

    expect(container.querySelector('.nx-line-numbers')).not.toBeNull();
  });

  it('applies theme class to line-numbers-container', () => {
    const { container } = render(<LineNumbers lineCount={3} theme="dark" />);
    const containerEl = container.querySelector('.line-numbers-container');

    expect(containerEl?.className).toContain('dark');
  });

  it('applies light theme class', () => {
    const { container } = render(<LineNumbers lineCount={3} theme="light" />);
    const containerEl = container.querySelector('.line-numbers-container');

    expect(containerEl?.className).toContain('light');
  });

  it('marks the hovered line with hovered class', () => {
    const { container } = render(<LineNumbers lineCount={5} hoveredLine={3} />);
    const lineElements = container.querySelectorAll('.line-number');
    const hoveredElements = container.querySelectorAll('.line-number.hovered');

    expect(hoveredElements.length).toBe(1);
    // Line 3 is the third element (0-indexed: index 2)
    expect(lineElements[2]?.className).toContain('hovered');
  });

  it('marks highlighted lines with highlighted class', () => {
    const highlightedSet = new Set([1, 3]);
    const { container } = render(
      <LineNumbers lineCount={5} highlightedLinesSet={highlightedSet} />
    );
    const highlightedElements = container.querySelectorAll('.line-number.highlighted');

    expect(highlightedElements.length).toBe(2);
  });

  it('sets aria-hidden on the container', () => {
    const { container } = render(<LineNumbers lineCount={3} />);
    const containerEl = container.querySelector('.line-numbers-container');

    expect(containerEl?.getAttribute('aria-hidden')).toBe('true');
  });

  it('calls onLineHover when a line is hovered', () => {
    const onLineHover = vi.fn();
    const { container } = render(
      <LineNumbers lineCount={3} onLineHover={onLineHover} />
    );
    const lineElements = container.querySelectorAll('.line-number');

    fireEvent.mouseEnter(lineElements[1]);

    expect(onLineHover).toHaveBeenCalledWith(2);
  });

  it('renders zero line elements for lineCount of 0', () => {
    const { container } = render(<LineNumbers lineCount={0} />);
    const lineElements = container.querySelectorAll('.line-number');

    expect(lineElements.length).toBe(0);
  });

  it('displays formatted line numbers', () => {
    const { container } = render(<LineNumbers lineCount={3} />);
    const lineElements = container.querySelectorAll('.line-number');

    expect(lineElements[0]?.textContent).toBe('1');
    expect(lineElements[1]?.textContent).toBe('2');
    expect(lineElements[2]?.textContent).toBe('3');
  });
});
