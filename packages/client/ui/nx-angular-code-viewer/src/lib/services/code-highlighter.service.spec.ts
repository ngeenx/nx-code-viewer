import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { CodeHighlighterService } from './code-highlighter.service';

/** Minimal DomSanitizer mock that passes values through unchanged */
const mockSanitizer = {
  bypassSecurityTrustHtml: (html: string) => html,
  sanitize: (_ctx: SecurityContext, val: string) => val,
};

describe('CodeHighlighterService', () => {
  let service: CodeHighlighterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: mockSanitizer,
        },
      ],
    });
    service = TestBed.inject(CodeHighlighterService);
  });

  // ─── createInitialState ────────────────────────────────────────────────

  describe('createInitialState()', () => {
    it('returns html: null', () => {
      expect(service.createInitialState().html).toBeNull();
    });

    it('returns rawHtml: null', () => {
      expect(service.createInitialState().rawHtml).toBeNull();
    });

    it('returns isLoading: false', () => {
      expect(service.createInitialState().isLoading).toBe(false);
    });

    it('returns error: null', () => {
      expect(service.createInitialState().error).toBeNull();
    });
  });

  // ─── createLoadingState ───────────────────────────────────────────────

  describe('createLoadingState()', () => {
    it('returns html: null', () => {
      expect(service.createLoadingState().html).toBeNull();
    });

    it('returns rawHtml: null', () => {
      expect(service.createLoadingState().rawHtml).toBeNull();
    });

    it('returns isLoading: true', () => {
      expect(service.createLoadingState().isLoading).toBe(true);
    });

    it('returns error: null', () => {
      expect(service.createLoadingState().error).toBeNull();
    });
  });

  // ─── createErrorState ─────────────────────────────────────────────────

  describe('createErrorState()', () => {
    it('returns html: null', () => {
      const err = new Error('boom');
      expect(service.createErrorState(err).html).toBeNull();
    });

    it('returns rawHtml: null', () => {
      const err = new Error('boom');
      expect(service.createErrorState(err).rawHtml).toBeNull();
    });

    it('returns isLoading: false', () => {
      expect(service.createErrorState(new Error()).isLoading).toBe(false);
    });

    it('stores the provided error', () => {
      const err = new Error('highlight failed');
      expect(service.createErrorState(err).error).toBe(err);
    });
  });

  // ─── createSuccessState ───────────────────────────────────────────────

  describe('createSuccessState()', () => {
    it('stores the provided SafeHtml value', () => {
      const safeHtml = '<span>code</span>' as unknown as import('@angular/platform-browser').SafeHtml;
      const rawHtml = '<span>code</span>';
      const state = service.createSuccessState(safeHtml, rawHtml);
      expect(state.html).toBe(safeHtml);
    });

    it('stores the provided rawHtml string', () => {
      const safeHtml = '<span>x</span>' as unknown as import('@angular/platform-browser').SafeHtml;
      const rawHtml = '<span>x</span>';
      const state = service.createSuccessState(safeHtml, rawHtml);
      expect(state.rawHtml).toBe(rawHtml);
    });

    it('returns isLoading: false', () => {
      const safeHtml = '' as unknown as import('@angular/platform-browser').SafeHtml;
      expect(service.createSuccessState(safeHtml, '').isLoading).toBe(false);
    });

    it('returns error: null', () => {
      const safeHtml = '' as unknown as import('@angular/platform-browser').SafeHtml;
      expect(service.createSuccessState(safeHtml, '').error).toBeNull();
    });
  });

  // ─── buildFallbackHtmlString ──────────────────────────────────────────

  describe('buildFallbackHtmlString()', () => {
    it('escapes & in code', () => {
      const result = service.buildFallbackHtmlString('a&b');
      expect(result).toContain('a&amp;b');
    });

    it('escapes < in code', () => {
      const result = service.buildFallbackHtmlString('a<b');
      expect(result).toContain('a&lt;b');
    });

    it('escapes > in code', () => {
      const result = service.buildFallbackHtmlString('a>b');
      expect(result).toContain('a&gt;b');
    });

    it('escapes " in code', () => {
      const result = service.buildFallbackHtmlString('say "hi"');
      expect(result).toContain('say &quot;hi&quot;');
    });

    it("escapes ' in code", () => {
      const result = service.buildFallbackHtmlString("it's");
      expect(result).toContain('it&#039;s');
    });

    it('wraps each line in <span class="line">', () => {
      const result = service.buildFallbackHtmlString('line1\nline2');
      expect(result).toContain('<span class="line">line1</span>');
      expect(result).toContain('<span class="line">line2</span>');
    });

    it('does not contain raw <script> tag in output', () => {
      const result = service.buildFallbackHtmlString('<script>alert(1)</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });
  });

  // ─── createFallbackHtml ───────────────────────────────────────────────

  describe('createFallbackHtml()', () => {
    it('does NOT contain raw <script> tag in output', () => {
      const result = service.createFallbackHtml('<script>alert("xss")</script>');
      // The result is a SafeHtml (mocked as string here)
      const html = result as unknown as string;
      expect(html).not.toContain('<script>');
    });

    it('produces escaped HTML entities for special characters', () => {
      const result = service.createFallbackHtml('a&b<c>d');
      const html = result as unknown as string;
      expect(html).toContain('a&amp;b&lt;c&gt;d');
    });

    it('wraps content in <span class="line"> elements', () => {
      const result = service.createFallbackHtml('hello');
      const html = result as unknown as string;
      expect(html).toContain('<span class="line">hello</span>');
    });
  });
});
