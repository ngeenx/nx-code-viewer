import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ReferenceProcessorService } from './reference-processor.service';
import type { ReferenceConfig } from '../types';

function makeLine(content: string): string {
  return `<span class="line">${content}</span>`;
}

describe('ReferenceProcessorService', () => {
  let service: ReferenceProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceProcessorService);
  });

  // ─── processReferences: guard cases ────────────────────────────────────

  describe('processReferences - guard cases', () => {
    it('returns original html and empty map when html is empty', () => {
      const result = service.processReferences('', [
        { textMatch: /foo/g, type: 'link', link: 'https://example.com' },
      ]);
      expect(result.html).toBe('');
      expect(result.processedReferences.size).toBe(0);
    });

    it('returns original html and empty map when references array is empty', () => {
      const html = makeLine('hello world');
      const result = service.processReferences(html, []);
      expect(result.html).toBe(html);
      expect(result.processedReferences.size).toBe(0);
    });

    it('returns original html when no pattern matches', () => {
      const html = makeLine('hello world');
      const result = service.processReferences(html, [
        { textMatch: /nomatch/g, type: 'link', link: 'https://example.com' },
      ]);
      expect(result.html).toBe(html);
      expect(result.processedReferences.size).toBe(0);
    });
  });

  // ─── processReferences: link type ──────────────────────────────────────

  describe('processReferences - link type', () => {
    it('wraps matched text in <a> tag with correct classes', () => {
      const html = makeLine('visit https://example.com today');
      const ref: ReferenceConfig = {
        textMatch: /https:\/\/example\.com/g,
        type: 'link',
        link: 'https://example.com',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('<a class="nx-ref nx-ref-link"');
      expect(result.html).toContain('https://example.com');
    });

    it('always includes rel="noopener noreferrer" on links', () => {
      const html = makeLine('see https://example.com');
      const ref: ReferenceConfig = {
        textMatch: /https:\/\/example\.com/g,
        type: 'link',
        link: 'https://example.com',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('rel="noopener noreferrer"');
    });

    it('adds data-ref-id and data-ref-types attributes', () => {
      const html = makeLine('check https://angular.io');
      const ref: ReferenceConfig = {
        textMatch: /https:\/\/angular\.io/g,
        type: 'link',
        link: 'https://angular.io',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('data-ref-id="ref-');
      expect(result.html).toContain('data-ref-types="link"');
    });

    it('wraps output lines in <span class="line"> tags', () => {
      const html = makeLine('const x = 1;');
      const ref: ReferenceConfig = {
        textMatch: /const/g,
        type: 'link',
        link: 'https://example.com',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('<span class="line">');
    });

    it('populates processedReferences map with matched entry', () => {
      const html = makeLine('import Angular');
      const ref: ReferenceConfig = {
        textMatch: /Angular/g,
        type: 'link',
        link: 'https://angular.io',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.processedReferences.size).toBe(1);
      const [entry] = result.processedReferences.values();
      expect(entry.matchedText).toBe('Angular');
      expect(entry.resolvedLink).toBe('https://angular.io');
    });

    it('uses crypto.randomUUID-based IDs (starts with ref-)', () => {
      const html = makeLine('foo bar');
      const ref: ReferenceConfig = {
        textMatch: /foo/g,
        type: 'link',
        link: 'https://example.com',
      };
      const result = service.processReferences(html, [ref]);
      const [entry] = result.processedReferences.values();
      expect(entry.id).toMatch(/^ref-[0-9a-f-]{36}$/);
    });

    it('generates different IDs for different matches', () => {
      const html =
        makeLine('foo') + makeLine('foo');
      const ref: ReferenceConfig = {
        textMatch: /foo/g,
        type: 'link',
        link: 'https://example.com',
      };
      const result = service.processReferences(html, [ref]);
      const ids = [...result.processedReferences.keys()];
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('uses _blank as default target', () => {
      const html = makeLine('click here');
      const ref: ReferenceConfig = {
        textMatch: /here/g,
        type: 'link',
        link: 'https://example.com',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('target="_blank"');
    });

    it('respects explicit target attribute', () => {
      const html = makeLine('click here');
      const ref: ReferenceConfig = {
        textMatch: /here/g,
        type: 'link',
        link: 'https://example.com',
        target: '_self',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('target="_self"');
    });

    it('resolves $1 capture group in link template', () => {
      const html = makeLine('@angular/core');
      const ref: ReferenceConfig = {
        textMatch: /@angular\/(\w+)/g,
        type: 'link',
        link: 'https://angular.io/api/$1',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('https://angular.io/api/core');
    });
  });

  // ─── processReferences: info type ──────────────────────────────────────

  describe('processReferences - info type', () => {
    it('wraps matched text in <span> for info type', () => {
      const html = makeLine('TODO: fix this');
      const ref: ReferenceConfig = {
        textMatch: /TODO/g,
        type: 'info',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('<span class="nx-ref nx-ref-info"');
      expect(result.html).toContain('data-ref-types="info"');
    });

    it('does not generate an <a> element for info type', () => {
      const html = makeLine('TODO: fix this');
      const ref: ReferenceConfig = {
        textMatch: /TODO/g,
        type: 'info',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).not.toContain('<a ');
    });
  });

  // ─── processReferences: combined type ──────────────────────────────────

  describe('processReferences - combined [link, info] type', () => {
    it('includes both nx-ref-link and nx-ref-info classes', () => {
      const html = makeLine('Component');
      const ref: ReferenceConfig = {
        textMatch: /Component/g,
        type: ['link', 'info'],
        link: 'https://angular.io/api/core/Component',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('nx-ref-link');
      expect(result.html).toContain('nx-ref-info');
    });
  });

  // ─── URL sanitization ──────────────────────────────────────────────────

  describe('URL sanitization', () => {
    it('blocks javascript: URLs by using href="#blocked"', () => {
      const html = makeLine('click here');
      const ref: ReferenceConfig = {
        textMatch: /here/g,
        type: 'link',
        link: 'javascript:alert(1)',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('href="#blocked"');
      expect(result.html).not.toContain('javascript:');
    });

    it('blocks data: URLs by using href="#blocked"', () => {
      const html = makeLine('click here');
      const ref: ReferenceConfig = {
        textMatch: /here/g,
        type: 'link',
        link: 'data:text/html,<h1>test</h1>',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('href="#blocked"');
    });

    it('allows valid https: URLs', () => {
      const html = makeLine('visit');
      const ref: ReferenceConfig = {
        textMatch: /visit/g,
        type: 'link',
        link: 'https://example.com/path',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('href="https://example.com/path"');
    });

    it('allows valid http: URLs', () => {
      const html = makeLine('visit');
      const ref: ReferenceConfig = {
        textMatch: /visit/g,
        type: 'link',
        link: 'http://example.com',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('href="http://example.com"');
    });

    it('blocks relative URLs (no scheme)', () => {
      const html = makeLine('click');
      const ref: ReferenceConfig = {
        textMatch: /click/g,
        type: 'link',
        link: '/relative/path',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.html).toContain('href="#blocked"');
    });
  });

  // ─── target sanitization ───────────────────────────────────────────────

  describe('target attribute allowlist', () => {
    const validTargets: Array<'_blank' | '_self' | '_parent' | '_top'> = [
      '_blank',
      '_self',
      '_parent',
      '_top',
    ];

    for (const target of validTargets) {
      it(`passes through valid target "${target}"`, () => {
        const html = makeLine('link');
        const ref: ReferenceConfig = {
          textMatch: /link/g,
          type: 'link',
          link: 'https://example.com',
          target,
        };
        const result = service.processReferences(html, [ref]);
        expect(result.html).toContain(`target="${target}"`);
      });
    }
  });

  // ─── findMatches: MAX_MATCHES_PER_LINE cap ──────────────────────────────

  describe('findMatches - MAX_MATCHES_PER_LINE cap', () => {
    it('caps matches at 1000 per line per regex', () => {
      // Build a line with 1200 occurrences of "x"
      const words = Array.from({ length: 1200 }, () => 'x').join(' ');
      const html = makeLine(words);
      const ref: ReferenceConfig = {
        textMatch: /x/g,
        type: 'info',
      };
      const result = service.processReferences(html, [ref]);
      // Should have exactly 1000 entries in processedReferences (cap)
      expect(result.processedReferences.size).toBe(1000);
    });
  });

  // ─── multiple lines ─────────────────────────────────────────────────────

  describe('multiple lines', () => {
    it('processes references across multiple lines independently', () => {
      const html =
        makeLine('import Angular') +
        makeLine('export Angular') +
        makeLine('no match here');
      const ref: ReferenceConfig = {
        textMatch: /Angular/g,
        type: 'link',
        link: 'https://angular.io',
      };
      const result = service.processReferences(html, [ref]);
      expect(result.processedReferences.size).toBe(2);
    });
  });
});
