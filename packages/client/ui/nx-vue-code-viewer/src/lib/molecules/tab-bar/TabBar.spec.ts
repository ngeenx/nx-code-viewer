import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TabBar from './TabBar.vue';

// ---------------------------------------------------------------------------
// Mock icon utils used by TabHeader child
// ---------------------------------------------------------------------------
vi.mock('@ngeenx/nx-code-viewer-utils', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFileIconUrl: vi.fn(() => null),
  };
});

describe('TabBar', () => {
  const tabs = [
    { id: 'tab-1', fileName: 'index.ts', type: 'code' as const, code: '', fileExtension: '.ts' },
    { id: 'tab-2', fileName: 'app.vue', type: 'code' as const, code: '', fileExtension: '.vue' },
    { id: 'tab-3', fileName: 'style.css', type: 'code' as const, code: '', fileExtension: '.css' },
  ];

  const defaultProps = {
    tabs,
    activeTabId: 'tab-1',
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-tab-bar class', () => {
      const wrapper = mount(TabBar, { props: defaultProps });

      expect(wrapper.find('.nx-tab-bar').exists()).toBe(true);
    });

    it('renders tablist role element', () => {
      const wrapper = mount(TabBar, { props: defaultProps });

      expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
    });

    it('renders correct number of tab buttons', () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      expect(tabButtons).toHaveLength(3);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to tab list', () => {
      const wrapper = mount(TabBar, { props: defaultProps });

      expect(wrapper.find('.tab-list').classes()).toContain('dark');
    });

    it('applies light theme class to tab list', () => {
      const wrapper = mount(TabBar, {
        props: { ...defaultProps, theme: 'light' },
      });

      expect(wrapper.find('.tab-list').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Tab change events
  // -----------------------------------------------------------------------
  describe('tab change events', () => {
    it('emits tabChange when inactive tab is clicked', async () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      // Click the second tab (inactive)
      await tabButtons[1].trigger('click');

      expect(wrapper.emitted('tabChange')).toHaveLength(1);
      expect(wrapper.emitted('tabChange')![0]).toEqual(['tab-2']);
    });

    it('does not emit tabChange when active tab is clicked', async () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      // Click the first tab (already active)
      await tabButtons[0].trigger('click');

      expect(wrapper.emitted('tabChange')).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard navigation
  // -----------------------------------------------------------------------
  describe('keyboard navigation', () => {
    it('emits tabChange for ArrowRight key', async () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      await tabButtons[0].trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('tabChange')).toHaveLength(1);
      expect(wrapper.emitted('tabChange')![0]).toEqual(['tab-2']);
    });

    it('emits tabChange for ArrowLeft key (wraps to last)', async () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      await tabButtons[0].trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('tabChange')).toHaveLength(1);
      expect(wrapper.emitted('tabChange')![0]).toEqual(['tab-3']);
    });

    it('emits tabChange for Home key (go to first)', async () => {
      const wrapper = mount(TabBar, {
        props: { ...defaultProps, activeTabId: 'tab-3' },
      });
      const tabButtons = wrapper.findAll('[role="tab"]');

      await tabButtons[2].trigger('keydown', { key: 'Home' });

      expect(wrapper.emitted('tabChange')).toHaveLength(1);
      expect(wrapper.emitted('tabChange')![0]).toEqual(['tab-1']);
    });

    it('emits tabChange for End key (go to last)', async () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      await tabButtons[0].trigger('keydown', { key: 'End' });

      expect(wrapper.emitted('tabChange')).toHaveLength(1);
      expect(wrapper.emitted('tabChange')![0]).toEqual(['tab-3']);
    });

    it('wraps ArrowRight from last to first', async () => {
      const wrapper = mount(TabBar, {
        props: { ...defaultProps, activeTabId: 'tab-3' },
      });
      const tabButtons = wrapper.findAll('[role="tab"]');

      await tabButtons[2].trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('tabChange')).toHaveLength(1);
      expect(wrapper.emitted('tabChange')![0]).toEqual(['tab-1']);
    });
  });

  // -----------------------------------------------------------------------
  // Active tab marking
  // -----------------------------------------------------------------------
  describe('active tab marking', () => {
    it('marks the active tab with aria-selected=true', () => {
      const wrapper = mount(TabBar, { props: defaultProps });
      const tabButtons = wrapper.findAll('[role="tab"]');

      expect(tabButtons[0].attributes('aria-selected')).toBe('true');
      expect(tabButtons[1].attributes('aria-selected')).toBe('false');
    });
  });
});
