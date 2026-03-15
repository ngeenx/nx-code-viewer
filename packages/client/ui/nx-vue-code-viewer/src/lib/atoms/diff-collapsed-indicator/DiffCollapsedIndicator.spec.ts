import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DiffCollapsedIndicator from './DiffCollapsedIndicator.vue';

describe('DiffCollapsedIndicator', () => {
  const defaultProps = {
    range: { startLine: 5, endLine: 15 },
    hiddenCount: 10,
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-diff-collapsed-indicator class', () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      expect(wrapper.find('.nx-diff-collapsed-indicator').exists()).toBe(true);
    });

    it('renders the indicator element with role=button', () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      expect(wrapper.find('[role="button"]').exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Display text
  // -----------------------------------------------------------------------
  describe('display text', () => {
    it('shows hidden count with "lines" for plural', () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      expect(wrapper.find('.content').text()).toContain('10 lines');
    });

    it('shows "1 line" for singular', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, hiddenCount: 1 },
      });

      expect(wrapper.find('.content').text()).toContain('1 line');
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('.diff-collapsed-indicator').classes()).toContain('dark');
    });

    it('applies light theme class', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, theme: 'light' },
      });

      expect(wrapper.find('.diff-collapsed-indicator').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Aria labels
  // -----------------------------------------------------------------------
  describe('aria-label', () => {
    it('shows expand label when not expanded', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, isExpanded: false },
      });

      expect(wrapper.find('[role="button"]').attributes('aria-label')).toBe(
        'Expand 10 hidden lines'
      );
    });

    it('shows collapse label when expanded', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, isExpanded: true },
      });

      expect(wrapper.find('[role="button"]').attributes('aria-label')).toBe(
        'Collapse 10 lines'
      );
    });

    it('uses singular "line" for count of 1', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, hiddenCount: 1, isExpanded: false },
      });

      expect(wrapper.find('[role="button"]').attributes('aria-label')).toBe(
        'Expand 1 hidden line'
      );
    });
  });

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------
  describe('events', () => {
    it('emits toggle on click', async () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      await wrapper.find('[role="button"]').trigger('click');

      expect(wrapper.emitted('toggle')).toHaveLength(1);
    });

    it('emits toggle on Enter keydown', async () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      await wrapper.find('[role="button"]').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('toggle')).toHaveLength(1);
    });

    it('emits toggle on Space keydown', async () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      await wrapper.find('[role="button"]').trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('toggle')).toHaveLength(1);
    });

    it('does not emit toggle on other keys', async () => {
      const wrapper = mount(DiffCollapsedIndicator, { props: defaultProps });

      await wrapper.find('[role="button"]').trigger('keydown', { key: 'Tab' });

      expect(wrapper.emitted('toggle')).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Optional elements
  // -----------------------------------------------------------------------
  describe('optional elements', () => {
    it('renders line number spans when showLineNumbers is true', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, showLineNumbers: true },
      });

      expect(wrapper.findAll('.line-number').length).toBeGreaterThanOrEqual(2);
    });

    it('does not render line number spans when showLineNumbers is false', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, showLineNumbers: false },
      });

      expect(wrapper.findAll('.line-number')).toHaveLength(0);
    });

    it('renders prefix icon when showPrefix is true', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, showPrefix: true },
      });

      expect(wrapper.find('.prefix').exists()).toBe(true);
    });

    it('does not render prefix icon when showPrefix is false', () => {
      const wrapper = mount(DiffCollapsedIndicator, {
        props: { ...defaultProps, showPrefix: false },
      });

      expect(wrapper.find('.prefix').exists()).toBe(false);
    });
  });
});
