import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import DiffViewer from './DiffViewer.vue';

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
    parseDiff: vi.fn(() => ({ hunks: [] })),
    computeDiff: vi.fn((oldCode: string, newCode: string) => {
      if (oldCode === newCode) return { hunks: [] };
      return {
        hunks: [
          {
            header: '@@ -1 +1 @@',
            lines: [
              { type: 'removed', content: oldCode, oldLineNumber: 1 },
              { type: 'added', content: newCode, newLineNumber: 1 },
            ],
          },
        ],
      };
    }),
    getDiffStats: vi.fn((parsed: any) => {
      if (!parsed.hunks.length) return { added: 0, removed: 0, unchanged: 0 };
      return { added: 1, removed: 1, unchanged: 0 };
    }),
    parseDiffCollapsedRanges: vi.fn(() => []),
    createDiffCollapsedRangesState: vi.fn(() => new Map()),
  };
});

describe('DiffViewer', () => {
  const defaultProps = {
    oldCode: 'const x = 1;',
    newCode: 'const x = 2;',
    language: 'typescript' as const,
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-diff-viewer class', () => {
      const wrapper = shallowMount(DiffViewer, { props: defaultProps });

      expect(wrapper.find('.nx-diff-viewer').exists()).toBe(true);
    });

    it('renders an article element', () => {
      const wrapper = shallowMount(DiffViewer, { props: defaultProps });

      expect(wrapper.find('article').exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to article', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('article').classes()).toContain('dark');
    });

    it('applies light theme class to article', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, theme: 'light' },
      });

      expect(wrapper.find('article').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Border style
  // -----------------------------------------------------------------------
  describe('border style', () => {
    it('applies border-classic class by default', () => {
      const wrapper = shallowMount(DiffViewer, { props: defaultProps });

      expect(wrapper.find('article').classes()).toContain('border-classic');
    });

    it('applies border-grid-cross class', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, borderStyle: 'grid-cross' },
      });

      expect(wrapper.find('article').classes()).toContain('border-grid-cross');
    });
  });

  // -----------------------------------------------------------------------
  // No changes
  // -----------------------------------------------------------------------
  describe('no changes', () => {
    it('shows "No changes" when old and new code are identical', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: {
          ...defaultProps,
          oldCode: 'same code',
          newCode: 'same code',
        },
      });

      expect(wrapper.find('.no-changes').exists()).toBe(true);
      expect(wrapper.find('.no-changes').text()).toContain('No changes');
    });

    it('does not show "No changes" when there are differences', () => {
      const wrapper = shallowMount(DiffViewer, { props: defaultProps });

      expect(wrapper.find('.no-changes').exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Header visibility
  // -----------------------------------------------------------------------
  describe('header visibility', () => {
    it('shows header when showHeader is true', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, showHeader: true },
      });

      expect(wrapper.findComponent({ name: 'CodeHeader' }).exists()).toBe(true);
    });

    it('hides header when showHeader is false', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, showHeader: false },
      });

      expect(wrapper.findComponent({ name: 'CodeHeader' }).exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Border overlay
  // -----------------------------------------------------------------------
  describe('border overlay', () => {
    it('renders border overlay for grid-cross style', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, borderStyle: 'grid-cross' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
      expect(wrapper.find('.corner-cross').exists()).toBe(true);
    });

    it('does not render border overlay for classic style', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, borderStyle: 'classic' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Diff stats
  // -----------------------------------------------------------------------
  describe('diff stats', () => {
    it('renders diff stats when there are changes', () => {
      const wrapper = shallowMount(DiffViewer, { props: defaultProps });

      expect(wrapper.find('.diff-stats').exists()).toBe(true);
    });

    it('does not render diff stats when there are no changes', () => {
      const wrapper = shallowMount(DiffViewer, {
        props: { ...defaultProps, oldCode: 'same', newCode: 'same' },
      });

      expect(wrapper.find('.diff-stats').exists()).toBe(false);
    });
  });
});
