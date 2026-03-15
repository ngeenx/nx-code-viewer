import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import CodeViewer from './CodeViewer.vue';

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
  };
});

describe('CodeViewer', () => {
  const defaultProps = {
    code: 'const x = 1;',
    language: 'typescript' as const,
    theme: 'dark' as const,
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders the wrapper with nx-code-viewer class', () => {
      const wrapper = shallowMount(CodeViewer, { props: defaultProps });

      expect(wrapper.find('.nx-code-viewer').exists()).toBe(true);
    });

    it('renders an article element', () => {
      const wrapper = shallowMount(CodeViewer, { props: defaultProps });

      expect(wrapper.find('article').exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to article', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, theme: 'dark' },
      });

      expect(wrapper.find('article').classes()).toContain('dark');
    });

    it('applies light theme class to article', () => {
      const wrapper = shallowMount(CodeViewer, {
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
      const wrapper = shallowMount(CodeViewer, { props: defaultProps });

      expect(wrapper.find('article').classes()).toContain('border-classic');
    });

    it('applies border-grid-cross class', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, borderStyle: 'grid-cross' },
      });

      expect(wrapper.find('article').classes()).toContain('border-grid-cross');
    });

    it('applies border-corner-intersection class', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, borderStyle: 'corner-intersection' },
      });

      expect(wrapper.find('article').classes()).toContain('border-corner-intersection');
    });
  });

  // -----------------------------------------------------------------------
  // Header visibility
  // -----------------------------------------------------------------------
  describe('header visibility', () => {
    it('shows header when showHeader is true', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, showHeader: true },
      });

      expect(wrapper.findComponent({ name: 'CodeHeader' }).exists()).toBe(true);
    });

    it('hides header when showHeader is false', () => {
      const wrapper = shallowMount(CodeViewer, {
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
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, borderStyle: 'grid-cross' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
      expect(wrapper.find('.corner-cross').exists()).toBe(true);
    });

    it('renders border overlay for corner-intersection style', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, borderStyle: 'corner-intersection' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(true);
      expect(wrapper.find('.border-top-extended').exists()).toBe(true);
    });

    it('does not render border overlay for classic style', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, borderStyle: 'classic' },
      });

      expect(wrapper.find('.border-overlay').exists()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Code normalization
  // -----------------------------------------------------------------------
  describe('code normalization', () => {
    it('accepts string code', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, code: 'const x = 1;' },
      });

      expect(wrapper.find('article').exists()).toBe(true);
    });

    it('accepts array code', () => {
      const wrapper = shallowMount(CodeViewer, {
        props: { ...defaultProps, code: ['line1', 'line2'] },
      });

      expect(wrapper.find('article').exists()).toBe(true);
    });
  });
});
