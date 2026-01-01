import { Injectable, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { codeToHtml, type BundledLanguage } from 'shiki';
import type {
  HighlightOptions,
  HighlightResult,
  HighlightedCodeState,
  CodeViewerTheme,
} from '../types';
import { SHIKI_THEME_MAP } from '../types';
import { extractCodeContent, escapeHtml, resolveLanguageAlias } from '../utils';

/**
 * Service for syntax highlighting code using Shiki
 * Follows Single Responsibility Principle - only handles code highlighting
 */
@Injectable({
  providedIn: 'root',
})
export class CodeHighlighterService {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Creates initial state for highlighted code
   * @returns Initial highlighted code state
   */
  createInitialState(): HighlightedCodeState {
    return {
      html: null,
      isLoading: false,
      error: null,
    };
  }

  /**
   * Creates loading state for highlighted code
   * @returns Loading state
   */
  createLoadingState(): HighlightedCodeState {
    return {
      html: null,
      isLoading: true,
      error: null,
    };
  }

  /**
   * Creates success state with highlighted HTML
   * @param html - Sanitized HTML content
   * @returns Success state
   */
  createSuccessState(html: SafeHtml): HighlightedCodeState {
    return {
      html,
      isLoading: false,
      error: null,
    };
  }

  /**
   * Creates error state
   * @param error - Error that occurred
   * @returns Error state
   */
  createErrorState(error: Error): HighlightedCodeState {
    return {
      html: null,
      isLoading: false,
      error,
    };
  }

  /**
   * Highlights code using Shiki
   * @param options - Highlighting options
   * @returns Promise with highlight result
   */
  async highlight(options: HighlightOptions): Promise<HighlightResult> {
    const { code, language, theme, signal } = options;

    if (!code) {
      return {
        success: true,
        html: '',
        error: null,
      };
    }

    // Handle plaintext specially - no highlighting needed
    if (language === 'plaintext') {
      const lines = code.split('\n');
      const html = lines
        .map((line) => `<span class="line">${escapeHtml(line)}</span>`)
        .join('');
      return {
        success: true,
        html,
        error: null,
      };
    }

    try {
      const resolvedLanguage = resolveLanguageAlias(language);
      const shikiTheme = this.getShikiTheme(theme);

      const html = await codeToHtml(code, {
        lang: resolvedLanguage as BundledLanguage,
        theme: shikiTheme,
      });

      if (signal?.aborted) {
        return {
          success: false,
          html: null,
          error: new Error('Highlighting aborted'),
        };
      }

      const innerContent = extractCodeContent(html);

      return {
        success: true,
        html: innerContent,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        html: null,
        error: error instanceof Error ? error : new Error('Failed to highlight code'),
      };
    }
  }

  /**
   * Highlights code and returns sanitized SafeHtml
   * @param options - Highlighting options
   * @returns Promise with HighlightedCodeState
   */
  async highlightToSafeHtml(options: HighlightOptions): Promise<HighlightedCodeState> {
    const result = await this.highlight(options);

    if (!result.success || result.html === null) {
      return this.createErrorState(
        result.error ?? new Error('Unknown error during highlighting')
      );
    }

    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(result.html);
    return this.createSuccessState(safeHtml);
  }

  /**
   * Creates fallback HTML for when highlighting fails
   * @param code - Raw code to escape
   * @returns Sanitized SafeHtml with escaped content
   */
  createFallbackHtml(code: string): SafeHtml {
    const lines = code.split('\n');
    const html = lines
      .map((line) => `<span class="line">${escapeHtml(line)}</span>`)
      .join('');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Highlights code and returns an array of highlighted lines
   * @param options - Highlighting options
   * @returns Promise with array of highlighted line HTML strings
   */
  async highlightLines(options: HighlightOptions): Promise<string[]> {
    const { code, language, theme, signal } = options;

    if (!code) {
      return [];
    }

    const lines = code.split('\n');

    // Handle plaintext specially - no highlighting needed
    if (language === 'plaintext') {
      return lines.map((line) => escapeHtml(line));
    }

    try {
      const resolvedLanguage = resolveLanguageAlias(language);
      const shikiTheme = this.getShikiTheme(theme);

      const html = await codeToHtml(code, {
        lang: resolvedLanguage as BundledLanguage,
        theme: shikiTheme,
      });

      if (signal?.aborted) {
        return lines.map((line) => escapeHtml(line));
      }

      // Extract lines from the highlighted HTML
      return this.extractHighlightedLines(html);
    } catch {
      // Fallback to escaped plain text
      return lines.map((line) => escapeHtml(line));
    }
  }

  /**
   * Extracts individual highlighted lines from Shiki HTML output
   * @param html - Full Shiki HTML output
   * @returns Array of line HTML strings
   */
  private extractHighlightedLines(html: string): string[] {
    // Extract content from pre/code wrapper first
    const codeContent = extractCodeContent(html);

    // Split by line spans - Shiki outputs each line as <span class="line">...</span>
    // We need to handle nested spans, so we can't use a simple regex
    const lines: string[] = [];
    const lineStartMarker = '<span class="line">';
    const lineEndMarker = '</span>';

    let currentPos = 0;
    while (currentPos < codeContent.length) {
      const lineStart = codeContent.indexOf(lineStartMarker, currentPos);
      if (lineStart === -1) break;

      const contentStart = lineStart + lineStartMarker.length;

      // Find the matching closing </span> by counting nested spans
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
          if (depth === 0) {
            contentEnd = nextClose;
          }
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

  /**
   * Gets the Shiki theme name for a given viewer theme
   * @param theme - Code viewer theme
   * @returns Shiki theme name
   */
  private getShikiTheme(theme: CodeViewerTheme): string {
    return SHIKI_THEME_MAP[theme];
  }
}
