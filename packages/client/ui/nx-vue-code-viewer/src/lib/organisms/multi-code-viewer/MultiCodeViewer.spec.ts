import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import MultiCodeViewer from './MultiCodeViewer.vue';

// ---------------------------------------------------------------------------
// Mock heavy dependencies
// ---------------------------------------------------------------------------
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue(
    '<pre class="shiki"><code><span class="line"><span>mock</span></span></code></pre>'
  ),
}));

vi.mock('@ngeenx/nx-code-viewer-utils', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFileIconUrl: vi.fn(() => null),
    getLanguageDisplayName: vi.fn((lang: string) => lang),
    getExtensionFromLanguage: vi.fn(() => null),
    isCodeTabItem: vi.fn((tab: any) => tab.type === 'code'),
    isDiffTabItem: vi.fn((tab: any) => tab.type === 'diff'),
  };
});

describe('MultiCodeViewer', () => {
  const codeTabs = [
    {
      id: 'tab-1',
      fileName: 'index.ts',
      fileExtension: '.ts',
      type: 'code' as const,
      code: 'const a = 1;',
      language: 'typescript',
    },
    {
      id: 'tab-2',
      fileName: 'app.vue',
      fileExtension: '.vue',
      type: 'code' as const,
      code: '<template>hello</template>',
      language: 'vue',
    },
  ];

  const mixedTabs = [
    ...codeTabs,
    {
      id: 'tab-3',
      fileName: 'changes.diff',
      fileExtension: '.diff',
      type: 'diff' as const,
      oldCode: 'old',
      newCode: 'new',
      language: 'typescript',
    },
  ];

  const defaultProps = {
    tabs: codeTabs,
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-multi-code-viewer class', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });

      expect(wrapper.find('.nx-multi-code-viewer').exists()).toBe(true);
    });

    it('renders an article element', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });

      expect(wrapper.find('article').exists()).toBe(true);
    });

    it('renders tab bar component', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });

      expect(wrapper.findComponent({ name: 'TabBar' }).exists()).toBe(true);
    });

    it('renders tab panels container', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });

      expect(wrapper.find('.tab-panels').exists()).toBe(true);
    });

    it('renders one panel per tab', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });
      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels).toHaveLength(2);
    });
  });

  // -----------------------------------------------------------------------
  // Active tab
  // -----------------------------------------------------------------------
  describe('active tab', () => {
    it('makes first tab active by default', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });
      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[0].classes()).toContain('active');
      expect(panels[0].classes()).not.toContain('hidden');
    });

    it('hides non-active tabs', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });
      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[1].classes()).toContain('hidden');
      expect(panels[1].classes()).not.toContain('active');
    });

    it('respects initialActiveTabId', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, initialActiveTabId: 'tab-2' },
      });
      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[1].classes()).toContain('active');
      expect(panels[0].classes()).toContain('hidden');
    });
  });

  // -----------------------------------------------------------------------
  // Tab change events
  // -----------------------------------------------------------------------
  describe('tab change events', () => {
    it('emits activeTabChange when tab bar emits tabChange', async () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });
      const tabBar = wrapper.findComponent({ name: 'TabBar' });

      await tabBar.vm.$emit('tabChange', 'tab-2');

      const emitted = wrapper.emitted('activeTabChange');
      expect(emitted).toHaveLength(1);
      expect(emitted![0][0]).toEqual({
        previousTabId: 'tab-1',
        currentTabId: 'tab-2',
        currentIndex: 1,
      });
    });
  });

  // -----------------------------------------------------------------------
  // Tab content types
  // -----------------------------------------------------------------------
  describe('tab content types', () => {
    it('renders CodeViewer for code tabs', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });

      expect(wrapper.findComponent({ name: 'CodeViewer' }).exists()).toBe(true);
    });

    it('renders DiffViewer for diff tabs', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, tabs: mixedTabs },
      });

      expect(wrapper.findComponent({ name: 'DiffViewer' }).exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to article', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('article').classes()).toContain('dark');
    });

    it('applies light theme class to article', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, theme: 'light' },
      });

      expect(wrapper.find('article').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Border style
  // -----------------------------------------------------------------------
  describe('border style', () => {
    it('renders border overlay for grid-cross', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, borderStyle: 'grid-cross' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
    });

    it('renders border overlay for corner-intersection', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, borderStyle: 'corner-intersection' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
    });

    it('does not render border overlay for classic', () => {
      const wrapper = shallowMount(MultiCodeViewer, {
        props: { ...defaultProps, borderStyle: 'classic' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------
  describe('ARIA attributes', () => {
    it('sets correct id on tab panels', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });
      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[0].attributes('id')).toBe('panel-tab-1');
      expect(panels[1].attributes('id')).toBe('panel-tab-2');
    });

    it('sets aria-labelledby on tab panels', () => {
      const wrapper = shallowMount(MultiCodeViewer, { props: defaultProps });
      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[0].attributes('aria-labelledby')).toBe('tab-tab-1');
      expect(panels[1].attributes('aria-labelledby')).toBe('tab-tab-2');
    });
  });
});
