import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import ColumnCodeViewer from './ColumnCodeViewer.vue';

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
    isColumnCodeItem: vi.fn((col: any) => col.type === 'code'),
    isColumnDiffItem: vi.fn((col: any) => col.type === 'diff'),
  };
});

describe('ColumnCodeViewer', () => {
  const codeColumns = [
    {
      id: 'col-1',
      title: 'Before',
      type: 'code' as const,
      code: 'const a = 1;',
      language: 'typescript',
    },
    {
      id: 'col-2',
      title: 'After',
      type: 'code' as const,
      code: 'const a = 2;',
      language: 'typescript',
    },
  ];

  const mixedColumns = [
    ...codeColumns,
    {
      id: 'col-3',
      title: 'Diff',
      type: 'diff' as const,
      oldCode: 'old',
      newCode: 'new',
      language: 'typescript',
    },
  ];

  const defaultProps = {
    columns: codeColumns,
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-column-code-viewer class', () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });

      expect(wrapper.find('.nx-column-code-viewer').exists()).toBe(true);
    });

    it('renders an article element', () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });

      expect(wrapper.find('article').exists()).toBe(true);
    });

    it('renders columns container', () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });

      expect(wrapper.find('.columns-container').exists()).toBe(true);
    });

    it('renders one column div per item', () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });
      const columns = wrapper.findAll('.column');

      expect(columns).toHaveLength(2);
    });
  });

  // -----------------------------------------------------------------------
  // Column dividers
  // -----------------------------------------------------------------------
  describe('column dividers', () => {
    it('applies column-divider class to all except last column', () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });
      const columns = wrapper.findAll('.column');

      expect(columns[0].classes()).toContain('column-divider');
      expect(columns[1].classes()).not.toContain('column-divider');
    });

    it('does not apply column-divider when there is a single column', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, columns: [codeColumns[0]] },
      });
      const columns = wrapper.findAll('.column');

      expect(columns).toHaveLength(1);
      expect(columns[0].classes()).not.toContain('column-divider');
    });

    it('applies column-divider to all but last with three columns', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, columns: mixedColumns },
      });
      const columns = wrapper.findAll('.column');

      expect(columns[0].classes()).toContain('column-divider');
      expect(columns[1].classes()).toContain('column-divider');
      expect(columns[2].classes()).not.toContain('column-divider');
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to article', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('article').classes()).toContain('dark');
    });

    it('applies light theme class to article', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
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
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, borderStyle: 'grid-cross' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
      expect(wrapper.find('.corner-cross').exists()).toBe(true);
    });

    it('renders border overlay for corner-intersection', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, borderStyle: 'corner-intersection' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
      expect(wrapper.find('.border-top-extended').exists()).toBe(true);
    });

    it('does not render border overlay for classic', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, borderStyle: 'classic' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Column content types
  // -----------------------------------------------------------------------
  describe('column content types', () => {
    it('renders CodeViewer for code columns', () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });

      expect(wrapper.findComponent({ name: 'CodeViewer' }).exists()).toBe(true);
    });

    it('renders DiffViewer for diff columns', () => {
      const wrapper = shallowMount(ColumnCodeViewer, {
        props: { ...defaultProps, columns: mixedColumns },
      });

      expect(wrapper.findComponent({ name: 'DiffViewer' }).exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------
  describe('events', () => {
    it('emits codeCopied when a code viewer emits code-copied', async () => {
      const wrapper = shallowMount(ColumnCodeViewer, { props: defaultProps });
      const codeViewer = wrapper.findComponent({ name: 'CodeViewer' });

      await codeViewer.vm.$emit('codeCopied');

      expect(wrapper.emitted('codeCopied')).toBeTruthy();
    });
  });
});
