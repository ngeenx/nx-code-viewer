import { codeToHtml, type BundledLanguage } from 'shiki';
import {
  resolveShikiTheme,
  extractCodeContent,
  escapeHtml,
  resolveLanguageAlias,
  type HighlightOptions,
  type HighlightResult,
} from '@ngeenx/nx-code-viewer-utils';
import type { SvelteHighlightedCodeState } from '../types/svelte-code-viewer.types';

/**
 * Composable for syntax highlighting using Shiki
 * Returns pure functions — no persistent reactive state
 */
export function useCodeHighlighter() {
  function createInitialState(): SvelteHighlightedCodeState {
    return { html: null, rawHtml: null, isLoading: false, error: null };
  }

  function createLoadingState(): SvelteHighlightedCodeState {
    return { html: null, rawHtml: null, isLoading: true, error: null };
  }

  function createSuccessState(html: string, rawHtml: string): SvelteHighlightedCodeState {
    return { html, rawHtml, isLoading: false, error: null };
  }

  function createErrorState(error: Error): SvelteHighlightedCodeState {
    return { html: null, rawHtml: null, isLoading: false, error };
  }

  function buildFallbackHtmlString(code: string): string {
    return code
      .split('\n')
      .map(line => `<span class="line">${escapeHtml(line)}</span>`)
      .join('');
  }

  function createFallbackHtml(code: string): string {
    return buildFallbackHtmlString(code);
  }

  async function highlight(options: HighlightOptions): Promise<HighlightResult> {
    const { code, language, theme, signal, shikiTheme: customShikiTheme, shikiThemes } = options;

    if (!code) {
      return { success: true, html: '', error: null };
    }

    if (language === 'plaintext') {
      const html = code
        .split('\n')
        .map(line => `<span class="line">${escapeHtml(line)}</span>`)
        .join('');
      return { success: true, html, error: null };
    }

    try {
      const resolvedLanguage = resolveLanguageAlias(language);
      const shikiTheme = resolveShikiTheme(theme, customShikiTheme, shikiThemes);

      const html = await codeToHtml(code, {
        lang: resolvedLanguage as BundledLanguage,
        theme: shikiTheme,
      });

      if (signal?.aborted) {
        return { success: false, html: null, error: new Error('Highlighting aborted') };
      }

      const innerContent = extractCodeContent(html);

      if (innerContent === html) {
        console.warn(
          '[useCodeHighlighter] Shiki output format did not match expected pre/code wrapper.'
        );
        return { success: false, html: null, error: new Error('Unexpected Shiki output format') };
      }

      return { success: true, html: innerContent, error: null };
    } catch (error) {
      return {
        success: false,
        html: null,
        error: error instanceof Error ? error : new Error('Failed to highlight code'),
      };
    }
  }

  async function highlightToHtml(options: HighlightOptions): Promise<SvelteHighlightedCodeState> {
    const result = await highlight(options);

    if (!result.success || result.html === null) {
      return createErrorState(result.error ?? new Error('Unknown error during highlighting'));
    }

    return createSuccessState(result.html, result.html);
  }

  async function highlightLines(options: HighlightOptions): Promise<string[]> {
    const { code, language, theme, signal, shikiTheme: customShikiTheme, shikiThemes } = options;

    if (!code) return [];

    const lines = code.split('\n');

    if (language === 'plaintext') {
      return lines.map(line => escapeHtml(line));
    }

    try {
      const resolvedLanguage = resolveLanguageAlias(language);
      const shikiTheme = resolveShikiTheme(theme, customShikiTheme, shikiThemes);

      const html = await codeToHtml(code, {
        lang: resolvedLanguage as BundledLanguage,
        theme: shikiTheme,
      });

      if (signal?.aborted) {
        return lines.map(line => escapeHtml(line));
      }

      return extractHighlightedLines(html);
    } catch {
      return lines.map(line => escapeHtml(line));
    }
  }

  function extractHighlightedLines(html: string): string[] {
    const codeContent = extractCodeContent(html);
    const resultLines: string[] = [];
    const lineStartMarker = '<span class="line">';
    const lineEndMarker = '</span>';
    let currentPos = 0;

    while (currentPos < codeContent.length) {
      const lineStart = codeContent.indexOf(lineStartMarker, currentPos);
      if (lineStart === -1) break;

      const contentStart = lineStart + lineStartMarker.length;
      let depth = 1;
      let searchPos = contentStart;
      let contentEnd = -1;

      while (searchPos < codeContent.length && depth > 0) {
        const nextOpen = codeContent.indexOf('<span', searchPos);
        const nextClose = codeContent.indexOf('</span>', searchPos);
        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          searchPos = nextOpen + 5;
        } else {
          depth--;
          if (depth === 0) contentEnd = nextClose;
          searchPos = nextClose + 7;
        }
      }

      if (contentEnd !== -1) {
        resultLines.push(codeContent.slice(contentStart, contentEnd));
        currentPos = contentEnd + lineEndMarker.length;
      } else {
        break;
      }
    }

    return resultLines;
  }

  return {
    createInitialState,
    createLoadingState,
    createSuccessState,
    createErrorState,
    buildFallbackHtmlString,
    createFallbackHtml,
    highlight,
    highlightToHtml,
    highlightLines,
  };
}
