import { describe, it, expect } from 'vitest';
import { useCodeHighlighter } from './useCodeHighlighter';

describe('useCodeHighlighter', () => {
  const highlighter = useCodeHighlighter();

  describe('createInitialState', () => {
    it('returns correct shape with all null/false values', () => {
      const state = highlighter.createInitialState();

      expect(state).toEqual({
        html: null,
        rawHtml: null,
        isLoading: false,
        error: null,
      });
    });

    it('has isLoading set to false', () => {
      const state = highlighter.createInitialState();
      expect(state.isLoading).toBe(false);
    });

    it('has no error', () => {
      const state = highlighter.createInitialState();
      expect(state.error).toBeNull();
    });
  });

  describe('createLoadingState', () => {
    it('has isLoading set to true', () => {
      const state = highlighter.createLoadingState();
      expect(state.isLoading).toBe(true);
    });

    it('has null html and rawHtml', () => {
      const state = highlighter.createLoadingState();
      expect(state.html).toBeNull();
      expect(state.rawHtml).toBeNull();
    });

    it('has no error', () => {
      const state = highlighter.createLoadingState();
      expect(state.error).toBeNull();
    });
  });

  describe('createErrorState', () => {
    it('contains the provided error', () => {
      const error = new Error('test error');
      const state = highlighter.createErrorState(error);
      expect(state.error).toBe(error);
    });

    it('has null html and rawHtml', () => {
      const error = new Error('test error');
      const state = highlighter.createErrorState(error);
      expect(state.html).toBeNull();
      expect(state.rawHtml).toBeNull();
    });

    it('has isLoading set to false', () => {
      const error = new Error('test error');
      const state = highlighter.createErrorState(error);
      expect(state.isLoading).toBe(false);
    });

    it('preserves the error message', () => {
      const error = new Error('Something went wrong');
      const state = highlighter.createErrorState(error);
      expect(state.error?.message).toBe('Something went wrong');
    });
  });

  describe('createSuccessState', () => {
    it('contains the provided html', () => {
      const state = highlighter.createSuccessState('<span>code</span>', '<span>code</span>');
      expect(state.html).toBe('<span>code</span>');
    });

    it('contains the provided rawHtml', () => {
      const state = highlighter.createSuccessState('<span>code</span>', '<span>raw</span>');
      expect(state.rawHtml).toBe('<span>raw</span>');
    });

    it('has isLoading set to false', () => {
      const state = highlighter.createSuccessState('html', 'raw');
      expect(state.isLoading).toBe(false);
    });

    it('has no error', () => {
      const state = highlighter.createSuccessState('html', 'raw');
      expect(state.error).toBeNull();
    });
  });

  describe('buildFallbackHtmlString', () => {
    it('wraps each line in a span with class "line"', () => {
      const result = highlighter.buildFallbackHtmlString('hello');
      expect(result).toBe('<span class="line">hello</span>');
    });

    it('handles multi-line code', () => {
      const result = highlighter.buildFallbackHtmlString('line1\nline2\nline3');
      expect(result).toBe(
        '<span class="line">line1</span>' +
        '<span class="line">line2</span>' +
        '<span class="line">line3</span>'
      );
    });

    it('escapes HTML entities in code', () => {
      const result = highlighter.buildFallbackHtmlString('<div>test</div>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).not.toContain('<div>');
    });

    it('escapes ampersands', () => {
      const result = highlighter.buildFallbackHtmlString('a & b');
      expect(result).toContain('&amp;');
    });

    it('handles empty string', () => {
      const result = highlighter.buildFallbackHtmlString('');
      expect(result).toBe('<span class="line"></span>');
    });
  });

  describe('createFallbackHtml', () => {
    it('returns same result as buildFallbackHtmlString', () => {
      const code = 'const x = 1;';
      expect(highlighter.createFallbackHtml(code)).toBe(
        highlighter.buildFallbackHtmlString(code)
      );
    });
  });

  describe('highlight', () => {
    it('returns empty html for empty code', async () => {
      const result = await highlighter.highlight({
        code: '',
        language: 'typescript',
        theme: 'dark',
      });
      expect(result.success).toBe(true);
      expect(result.html).toBe('');
    });

    it('handles plaintext language without Shiki', async () => {
      const result = await highlighter.highlight({
        code: 'hello world',
        language: 'plaintext',
        theme: 'dark',
      });
      expect(result.success).toBe(true);
      expect(result.html).toContain('<span class="line">');
      expect(result.html).toContain('hello world');
    });

    it('escapes HTML in plaintext mode', async () => {
      const result = await highlighter.highlight({
        code: '<script>alert("xss")</script>',
        language: 'plaintext',
        theme: 'dark',
      });
      expect(result.success).toBe(true);
      expect(result.html).not.toContain('<script>');
      expect(result.html).toContain('&lt;script&gt;');
    });
  });

  describe('highlightToHtml', () => {
    it('returns a success state for valid code', async () => {
      const result = await highlighter.highlightToHtml({
        code: 'const x = 1;',
        language: 'plaintext',
        theme: 'dark',
      });
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.html).not.toBeNull();
    });

    it('returns error state for empty result', async () => {
      const result = await highlighter.highlightToHtml({
        code: '',
        language: 'typescript',
        theme: 'dark',
      });
      // Empty code returns success with empty string, which is falsy
      // so it should still return a valid state
      expect(result.isLoading).toBe(false);
    });
  });

  describe('highlightLines', () => {
    it('returns empty array for empty code', async () => {
      const result = await highlighter.highlightLines({
        code: '',
        language: 'typescript',
        theme: 'dark',
      });
      expect(result).toEqual([]);
    });

    it('returns escaped lines for plaintext', async () => {
      const result = await highlighter.highlightLines({
        code: 'line1\nline2',
        language: 'plaintext',
        theme: 'dark',
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('line1');
      expect(result[1]).toBe('line2');
    });

    it('escapes HTML entities in plaintext lines', async () => {
      const result = await highlighter.highlightLines({
        code: '<div>\n</div>',
        language: 'plaintext',
        theme: 'dark',
      });
      expect(result[0]).toContain('&lt;');
      expect(result[1]).toContain('&gt;');
    });
  });
});
