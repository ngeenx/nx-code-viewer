import { codeToHtml, type BundledLanguage } from 'shiki';
import {
  resolveShikiTheme,
  extractCodeContent,
  escapeHtml,
  resolveLanguageAlias,
  type HighlightOptions,
} from '@ngeenx/nx-code-viewer-utils';
import type { ReactHighlightedCodeState } from '../types';

export function useCodeHighlighter() {
  function createInitialState(): ReactHighlightedCodeState {
    return { html: null, rawHtml: null, isLoading: false, error: null };
  }

  function createLoadingState(): ReactHighlightedCodeState {
    return { html: null, rawHtml: null, isLoading: true, error: null };
  }

  function createErrorState(error: Error): ReactHighlightedCodeState {
    return { html: null, rawHtml: null, isLoading: false, error };
  }

  function buildFallbackHtml(code: string): string {
    return code.split('\n').map(line => `<span class="line">${escapeHtml(line)}</span>`).join('');
  }

  async function highlightToHtml(options: HighlightOptions): Promise<ReactHighlightedCodeState> {
    const { code, language, theme, signal, shikiTheme: customShikiTheme, shikiThemes } = options;

    if (!code) return createInitialState();

    if (language === 'plaintext') {
      const html = buildFallbackHtml(code);
      return { html, rawHtml: html, isLoading: false, error: null };
    }

    try {
      const resolvedLanguage = resolveLanguageAlias(language);
      const shikiTheme = resolveShikiTheme(theme, customShikiTheme, shikiThemes);

      const html = await codeToHtml(code, {
        lang: resolvedLanguage as BundledLanguage,
        theme: shikiTheme,
      });

      if (signal?.aborted) {
        return createErrorState(new Error('Highlighting aborted'));
      }

      const innerContent = extractCodeContent(html);
      if (innerContent === html) {
        return createErrorState(new Error('Unexpected Shiki output format'));
      }

      return { html: innerContent, rawHtml: innerContent, isLoading: false, error: null };
    } catch (error) {
      return createErrorState(error instanceof Error ? error : new Error('Failed to highlight code'));
    }
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
    const lines: string[] = [];
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
        lines.push(codeContent.slice(contentStart, contentEnd));
        currentPos = contentEnd + lineEndMarker.length;
      } else {
        break;
      }
    }

    return lines;
  }

  return {
    createInitialState,
    createLoadingState,
    createErrorState,
    buildFallbackHtml,
    highlightToHtml,
    highlightLines,
  };
}
