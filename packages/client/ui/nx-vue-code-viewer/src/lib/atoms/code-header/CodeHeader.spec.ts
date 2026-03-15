import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeHeader from './CodeHeader.vue';

// ---------------------------------------------------------------------------
// Mock icon/language utils so we don't depend on real asset URLs
// ---------------------------------------------------------------------------
vi.mock('@ngeenx/nx-code-viewer-utils', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFileIconUrl: vi.fn((ext: string) =>
      ext ? `https://icons.test/${ext}.svg` : null
    ),
    getLanguageDisplayName: vi.fn((lang: string) =>
      lang === 'typescript' ? 'TypeScript' : lang
    ),
    getExtensionFromLanguage: vi.fn((lang: string) =>
      lang === 'typescript' ? '.ts' : null
    ),
  };
});

describe('CodeHeader', () => {
  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------
  describe('rendering', () => {
    it('renders a header element', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'dark' },
      });

      expect(wrapper.find('header').exists()).toBe(true);
    });

    it('renders the wrapper div with nx-code-header class', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'dark' },
      });

      expect(wrapper.find('.nx-code-header').exists()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Theme
  // -----------------------------------------------------------------------
  describe('theme', () => {
    it('applies dark theme class to header', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'dark' },
      });

      expect(wrapper.find('header').classes()).toContain('dark');
    });

    it('applies light theme class to header', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'light' },
      });

      expect(wrapper.find('header').classes()).toContain('light');
    });
  });

  // -----------------------------------------------------------------------
  // Title display
  // -----------------------------------------------------------------------
  describe('title display', () => {
    it('shows title when provided', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'dark', title: 'my-file.ts' },
      });

      expect(wrapper.find('.title').text()).toBe('my-file.ts');
    });

    it('shows language display name when no title is provided', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'dark' },
      });

      expect(wrapper.find('.title').text()).toBe('TypeScript');
    });
  });

  // -----------------------------------------------------------------------
  // File icon
  // -----------------------------------------------------------------------
  describe('file icon', () => {
    it('renders file icon when fileExtension is provided', () => {
      const wrapper = mount(CodeHeader, {
        props: {
          language: 'typescript',
          theme: 'dark',
          fileExtension: '.ts',
        },
      });

      const img = wrapper.find('img.file-icon');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://icons.test/.ts.svg');
    });

    it('renders file icon inferred from language when no fileExtension', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'typescript', theme: 'dark' },
      });

      const img = wrapper.find('img.file-icon');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://icons.test/.ts.svg');
    });

    it('does not render file icon when extension cannot be resolved', () => {
      const wrapper = mount(CodeHeader, {
        props: { language: 'plaintext', theme: 'dark' },
      });

      expect(wrapper.find('img.file-icon').exists()).toBe(false);
    });
  });
});
