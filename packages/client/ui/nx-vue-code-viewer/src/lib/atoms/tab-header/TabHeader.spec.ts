import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TabHeader from './TabHeader.vue';

// ---------------------------------------------------------------------------
// Mock icon utils
// ---------------------------------------------------------------------------
vi.mock('@ngeenx/nx-code-viewer-utils', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFileIconUrl: vi.fn((ext: string) =>
      ext ? `https://icons.test/${ext}.svg` : null
    ),
  };
});

describe('TabHeader', () => {
  const defaultProps = {
    tabId: 'tab-1',
    fileName: 'index.ts',
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders a button with role=tab', () => {
      const wrapper = mount(TabHeader, { props: defaultProps });
      const button = wrapper.find('button');

      expect(button.exists()).toBe(true);
      expect(button.attributes('role')).toBe('tab');
    });

    it('renders the wrapper div with nx-tab-header class', () => {
      const wrapper = mount(TabHeader, { props: defaultProps });

      expect(wrapper.find('.nx-tab-header').exists()).toBe(true);
    });

    it('shows fileName text', () => {
      const wrapper = mount(TabHeader, { props: defaultProps });

      expect(wrapper.find('.file-name').text()).toBe('index.ts');
    });
  });

  // -----------------------------------------------------------------------
  // Active state
  // -----------------------------------------------------------------------
  describe('active state', () => {
    it('sets aria-selected to true when active', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, isActive: true },
      });

      expect(wrapper.find('button').attributes('aria-selected')).toBe('true');
    });

    it('sets aria-selected to false when not active', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, isActive: false },
      });

      expect(wrapper.find('button').attributes('aria-selected')).toBe('false');
    });

    it('applies active class when isActive is true', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, isActive: true },
      });

      expect(wrapper.find('button').classes()).toContain('active');
    });

    it('does not apply active class when isActive is false', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, isActive: false },
      });

      expect(wrapper.find('button').classes()).not.toContain('active');
    });

    it('sets tabindex to 0 when active', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, isActive: true },
      });

      expect(wrapper.find('button').attributes('tabindex')).toBe('0');
    });

    it('sets tabindex to -1 when not active', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, isActive: false },
      });

      expect(wrapper.find('button').attributes('tabindex')).toBe('-1');
    });
  });

  // -----------------------------------------------------------------------
  // File icon
  // -----------------------------------------------------------------------
  describe('file icon', () => {
    it('renders file icon when fileExtension is provided', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, fileExtension: '.ts' },
      });

      const img = wrapper.find('img.file-icon');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://icons.test/.ts.svg');
    });

    it('does not render file icon when no fileExtension', () => {
      const wrapper = mount(TabHeader, {
        props: defaultProps,
      });

      expect(wrapper.find('img.file-icon').exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('button').classes()).toContain('dark');
    });

    it('applies light theme class', () => {
      const wrapper = mount(TabHeader, {
        props: { ...defaultProps, theme: 'light' },
      });

      expect(wrapper.find('button').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------
  describe('events', () => {
    it('emits tabClick with tabId on click', async () => {
      const wrapper = mount(TabHeader, { props: defaultProps });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('tabClick')).toHaveLength(1);
      expect(wrapper.emitted('tabClick')![0]).toEqual(['tab-1']);
    });

    it('emits tabKeydown with KeyboardEvent on keydown', async () => {
      const wrapper = mount(TabHeader, { props: defaultProps });

      await wrapper.find('button').trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('tabKeydown')).toHaveLength(1);
      expect(wrapper.emitted('tabKeydown')![0][0]).toBeInstanceOf(Event);
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------
  describe('ARIA attributes', () => {
    it('sets aria-controls to panel-{tabId}', () => {
      const wrapper = mount(TabHeader, { props: defaultProps });

      expect(wrapper.find('button').attributes('aria-controls')).toBe('panel-tab-1');
    });

    it('sets id to tab-{tabId}', () => {
      const wrapper = mount(TabHeader, { props: defaultProps });

      expect(wrapper.find('button').attributes('id')).toBe('tab-tab-1');
    });
  });
});
