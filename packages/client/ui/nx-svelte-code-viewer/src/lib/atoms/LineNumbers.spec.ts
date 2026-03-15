import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import LineNumbers from './LineNumbers.svelte';

describe('LineNumbers', () => {
  it('renders the wrapper div with nx-line-numbers class', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 5, theme: 'dark' },
    });
    expect(container.querySelector('.nx-line-numbers')).not.toBeNull();
  });

  it('renders correct number of line-number elements', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 5, theme: 'dark' },
    });
    const lineElements = container.querySelectorAll('.line-number');
    expect(lineElements.length).toBe(5);
  });

  it('renders 1 line-number element for lineCount of 1', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 1, theme: 'dark' },
    });
    const lineElements = container.querySelectorAll('.line-number');
    expect(lineElements.length).toBe(1);
  });

  it('renders 10 line-number elements for lineCount of 10', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 10, theme: 'dark' },
    });
    const lineElements = container.querySelectorAll('.line-number');
    expect(lineElements.length).toBe(10);
  });

  it('applies dark theme class to the container', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 3, theme: 'dark' },
    });
    const innerContainer = container.querySelector('.line-numbers-container');
    expect(innerContainer?.classList.contains('dark')).toBe(true);
  });

  it('applies light theme class to the container', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 3, theme: 'light' },
    });
    const innerContainer = container.querySelector('.line-numbers-container');
    expect(innerContainer?.classList.contains('light')).toBe(true);
  });

  it('sets aria-hidden on the line-numbers-container', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 3, theme: 'dark' },
    });
    const innerContainer = container.querySelector('.line-numbers-container');
    expect(innerContainer?.getAttribute('aria-hidden')).toBe('true');
  });

  it('displays formatted line numbers', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 3, theme: 'dark' },
    });
    const lineElements = container.querySelectorAll('.line-number');
    // Line numbers should be displayed as text content
    expect(lineElements[0]?.textContent?.trim()).toBeTruthy();
  });

  it('renders 0 line-number elements for lineCount of 0', () => {
    const { container } = render(LineNumbers, {
      props: { lineCount: 0, theme: 'dark' },
    });
    const lineElements = container.querySelectorAll('.line-number');
    expect(lineElements.length).toBe(0);
  });
});
