import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LineNumbers from './LineNumbers.vue';

// ---------------------------------------------------------------------------
// Mock utils
// ---------------------------------------------------------------------------
vi.mock('@ngeenx/nx-code-viewer-utils', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    generateLineNumbers: vi.fn((count: number) =>
      Array.from({ length: count }, (_, i) => i + 1)
    ),
    formatLineNumber: vi.fn((lineNumber: number) => String(lineNumber)),
    isLineInCollapsedRange: vi.fn(() => ({
      isCollapsed: false,
      isFirstLine: false,
      hiddenCount: 0,
      range: null,
    })),
  };
});

describe('LineNumbers', () => {
  const defaultProps = {
    lineCount: 5,
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-line-numbers class', () => {
      const wrapper = mount(LineNumbers, { props: defaultProps });

      expect(wrapper.find('.nx-line-numbers').exists()).toBe(true);
    });

    it('renders correct number of line number elements', () => {
      const wrapper = mount(LineNumbers, { props: defaultProps });
      const lineNumberEls = wrapper.findAll('.line-number');

      expect(lineNumberEls).toHaveLength(5);
    });

    it('renders line numbers with correct text', () => {
      const wrapper = mount(LineNumbers, { props: defaultProps });
      const lineNumberEls = wrapper.findAll('.line-number');

      expect(lineNumberEls[0].text()).toBe('1');
      expect(lineNumberEls[4].text()).toBe('5');
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to container', () => {
      const wrapper = mount(LineNumbers, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('.line-numbers-container').classes()).toContain('dark');
    });

    it('applies light theme class to container', () => {
      const wrapper = mount(LineNumbers, {
        props: { ...defaultProps, theme: 'light' },
      });

      expect(wrapper.find('.line-numbers-container').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Hovered state
  // -----------------------------------------------------------------------
  describe('hovered state', () => {
    it('applies hovered class to the correct line', () => {
      const wrapper = mount(LineNumbers, {
        props: { ...defaultProps, hoveredLine: 3 },
      });

      const lineNumberEls = wrapper.findAll('.line-number');
      expect(lineNumberEls[2].classes()).toContain('hovered');
    });

    it('does not apply hovered class to other lines', () => {
      const wrapper = mount(LineNumbers, {
        props: { ...defaultProps, hoveredLine: 3 },
      });

      const lineNumberEls = wrapper.findAll('.line-number');
      expect(lineNumberEls[0].classes()).not.toContain('hovered');
      expect(lineNumberEls[1].classes()).not.toContain('hovered');
    });
  });

  // -----------------------------------------------------------------------
  // Highlighted state
  // -----------------------------------------------------------------------
  describe('highlighted state', () => {
    it('applies highlighted class to lines in the highlighted set', () => {
      const wrapper = mount(LineNumbers, {
        props: {
          ...defaultProps,
          highlightedLinesSet: new Set([1, 3]),
        },
      });

      const lineNumberEls = wrapper.findAll('.line-number');
      expect(lineNumberEls[0].classes()).toContain('highlighted');
      expect(lineNumberEls[2].classes()).toContain('highlighted');
    });

    it('does not apply highlighted class to non-highlighted lines', () => {
      const wrapper = mount(LineNumbers, {
        props: {
          ...defaultProps,
          highlightedLinesSet: new Set([1]),
        },
      });

      const lineNumberEls = wrapper.findAll('.line-number');
      expect(lineNumberEls[1].classes()).not.toContain('highlighted');
      expect(lineNumberEls[3].classes()).not.toContain('highlighted');
    });
  });

  // -----------------------------------------------------------------------
  // Accessibility
  // -----------------------------------------------------------------------
  describe('accessibility', () => {
    it('sets aria-hidden on the container', () => {
      const wrapper = mount(LineNumbers, { props: defaultProps });

      expect(wrapper.find('.line-numbers-container').attributes('aria-hidden')).toBe('true');
    });
  });

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------
  describe('events', () => {
    it('emits lineHover with line number on mouseenter', async () => {
      const wrapper = mount(LineNumbers, { props: defaultProps });
      const lineNumberEls = wrapper.findAll('.line-number');

      await lineNumberEls[2].trigger('mouseenter');

      expect(wrapper.emitted('lineHover')).toHaveLength(1);
      expect(wrapper.emitted('lineHover')![0]).toEqual([3]);
    });
  });
});
