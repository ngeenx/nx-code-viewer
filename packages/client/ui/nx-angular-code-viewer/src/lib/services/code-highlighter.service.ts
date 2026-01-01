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
   * Gets the Shiki theme name for a given viewer theme
   * @param theme - Code viewer theme
   * @returns Shiki theme name
   */
  private getShikiTheme(theme: CodeViewerTheme): string {
    return SHIKI_THEME_MAP[theme];
  }
}
