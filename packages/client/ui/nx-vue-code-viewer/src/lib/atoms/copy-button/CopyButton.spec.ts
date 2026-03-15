import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CopyButton from './CopyButton.vue';

describe('CopyButton', () => {
  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders a button element', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('renders the wrapper span with nx-copy-button class', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      expect(wrapper.find('.nx-copy-button').exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to button', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      expect(wrapper.find('button').classes()).toContain('dark');
    });

    it('applies light theme class to button', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'light' },
      });

      expect(wrapper.find('button').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // State classes
  // -----------------------------------------------------------------------
  describe('state classes', () => {
    it('adds copied class when state is copied', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'copied', theme: 'dark' },
      });

      expect(wrapper.find('button').classes()).toContain('copied');
    });

    it('adds error class when state is error', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'error', theme: 'dark' },
      });

      expect(wrapper.find('button').classes()).toContain('error');
    });

    it('does not add state class when idle', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      const classes = wrapper.find('button').classes();
      expect(classes).not.toContain('idle');
      expect(classes).not.toContain('copied');
      expect(classes).not.toContain('error');
    });
  });

  // -----------------------------------------------------------------------
  // Aria labels
  // -----------------------------------------------------------------------
  describe('aria-label', () => {
    it('shows "Copy to clipboard" when idle', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      expect(wrapper.find('button').attributes('aria-label')).toBe('Copy to clipboard');
    });

    it('shows "Copied to clipboard" when copied', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'copied', theme: 'dark' },
      });

      expect(wrapper.find('button').attributes('aria-label')).toBe('Copied to clipboard');
    });

    it('shows "Failed to copy" when error', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'error', theme: 'dark' },
      });

      expect(wrapper.find('button').attributes('aria-label')).toBe('Failed to copy');
    });
  });

  // -----------------------------------------------------------------------
  // Disabled state
  // -----------------------------------------------------------------------
  describe('disabled', () => {
    it('sets disabled attribute when disabled prop is true', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark', disabled: true },
      });

      expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    });

    it('does not set disabled attribute by default', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------
  describe('events', () => {
    it('emits copyClick on click when not disabled', async () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('copyClick')).toHaveLength(1);
    });

    it('does not emit copyClick when disabled', async () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark', disabled: true },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('copyClick')).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // SVG icons
  // -----------------------------------------------------------------------
  describe('SVG icons', () => {
    it('renders check icon when state is copied', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'copied', theme: 'dark' },
      });

      expect(wrapper.find('polyline').exists()).toBe(true);
    });

    it('renders X icon when state is error', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'error', theme: 'dark' },
      });

      expect(wrapper.findAll('line').length).toBe(2);
    });

    it('renders copy icon when state is idle', () => {
      const wrapper = mount(CopyButton, {
        props: { state: 'idle', theme: 'dark' },
      });

      expect(wrapper.find('rect').exists()).toBe(true);
      expect(wrapper.find('path').exists()).toBe(true);
    });
  });
});
