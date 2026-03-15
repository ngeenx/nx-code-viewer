import { describe, it, expect, vi } from 'vitest';
import { useCodeHighlighter } from './useCodeHighlighter';

// ---------------------------------------------------------------------------
// Mock shiki so tests don't load real WASM grammars
// ---------------------------------------------------------------------------
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue(
    '<pre class="shiki"><code><span class="line"><span>const x = 1;</span></span></code></pre>'
  ),
}));

describe('useCodeHighlighter', () => {
  // -----------------------------------------------------------------------
  // createInitialState
  // -----------------------------------------------------------------------
  describe('createInitialState', () => {
    it('returns the correct shape with all null/false values', () => {
      const { createInitialState } = useCodeHighlighter();
      const state = createInitialState();

      expect(state).toEqual({
        html: null,
        rawHtml: null,
        isLoading: false,
        error: null,
      });
    });
  });

  // -----------------------------------------------------------------------
  // createLoadingState
  // -----------------------------------------------------------------------
  describe('createLoadingState', () => {
    it('returns state with isLoading set to true', () => {
      const { createLoadingState } = useCodeHighlighter();
      const state = createLoadingState();

      expect(state.isLoading).toBe(true);
      expect(state.html).toBeNull();
      expect(state.rawHtml).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // createErrorState
  // -----------------------------------------------------------------------
  describe('createErrorState', () => {
    it('returns state containing the provided error', () => {
      const { createErrorState } = useCodeHighlighter();
      const error = new Error('test error');
      const state = createErrorState(error);

      expect(state.error).toBe(error);
      expect(state.isLoading).toBe(false);
      expect(state.html).toBeNull();
      expect(state.rawHtml).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // createSuccessState
  // -----------------------------------------------------------------------
  describe('createSuccessState', () => {
    it('returns state containing html and rawHtml', () => {
      const { createSuccessState } = useCodeHighlighter();
      const state = createSuccessState('<span>highlighted</span>', '<span>raw</span>');

      expect(state.html).toBe('<span>highlighted</span>');
      expect(state.rawHtml).toBe('<span>raw</span>');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // buildFallbackHtmlString
  // -----------------------------------------------------------------------
  describe('buildFallbackHtmlString', () => {
    it('escapes HTML entities and wraps lines in span.line', () => {
      const { buildFallbackHtmlString } = useCodeHighlighter();
      const result = buildFallbackHtmlString('<div>hello</div>');

      expect(result).toContain('&lt;div&gt;');
      expect(result).toContain('&lt;/div&gt;');
      expect(result).toContain('<span class="line">');
    });

    it('creates one span per line for multiline code', () => {
      const { buildFallbackHtmlString } = useCodeHighlighter();
      const result = buildFallbackHtmlString('line1\nline2\nline3');
      const lineSpanCount = (result.match(/<span class="line">/g) || []).length;

      expect(lineSpanCount).toBe(3);
    });
  });

  // -----------------------------------------------------------------------
  // highlight
  // -----------------------------------------------------------------------
  describe('highlight', () => {
    it('returns success with empty html for empty code', async () => {
      const { highlight } = useCodeHighlighter();
      const result = await highlight({
        code: '',
        language: 'typescript',
        theme: 'dark',
      });

      expect(result.success).toBe(true);
      expect(result.html).toBe('');
      expect(result.error).toBeNull();
    });

    it('handles plaintext language without calling shiki', async () => {
      const { highlight } = useCodeHighlighter();
      const result = await highlight({
        code: 'hello world',
        language: 'plaintext',
        theme: 'dark',
      });

      expect(result.success).toBe(true);
      expect(result.html).toContain('<span class="line">');
      expect(result.html).toContain('hello world');
    });

    it('escapes HTML entities for plaintext', async () => {
      const { highlight } = useCodeHighlighter();
      const result = await highlight({
        code: '<div>test</div>',
        language: 'plaintext',
        theme: 'dark',
      });

      expect(result.success).toBe(true);
      expect(result.html).toContain('&lt;div&gt;');
    });

    it('returns success for valid code with a known language', async () => {
      const { highlight } = useCodeHighlighter();
      const result = await highlight({
        code: 'const x = 1;',
        language: 'typescript',
        theme: 'dark',
      });

      expect(result.success).toBe(true);
      expect(result.html).not.toBeNull();
    });

    it('returns failure when aborted via signal', async () => {
      const { codeToHtml } = await import('shiki');
      const mockedCodeToHtml = vi.mocked(codeToHtml);

      const abortController = new AbortController();
      abortController.abort();

      // The mock resolves but signal is already aborted
      mockedCodeToHtml.mockResolvedValueOnce(
        '<pre class="shiki"><code><span class="line"><span>x</span></span></code></pre>'
      );

      const { highlight } = useCodeHighlighter();
      const result = await highlight({
        code: 'const x = 1;',
        language: 'typescript',
        theme: 'dark',
        signal: abortController.signal,
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Highlighting aborted');
    });

    it('returns failure when shiki throws an error', async () => {
      const { codeToHtml } = await import('shiki');
      const mockedCodeToHtml = vi.mocked(codeToHtml);
      mockedCodeToHtml.mockRejectedValueOnce(new Error('shiki failure'));

      const { highlight } = useCodeHighlighter();
      const result = await highlight({
        code: 'const x = 1;',
        language: 'typescript',
        theme: 'dark',
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('shiki failure');
    });
  });
});
