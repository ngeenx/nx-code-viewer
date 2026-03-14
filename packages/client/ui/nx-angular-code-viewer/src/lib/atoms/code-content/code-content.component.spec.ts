import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { CodeContentComponent } from './code-content.component';
import type { ProcessedReference } from '@ngeenx/nx-code-viewer-utils';

describe('CodeContentComponent', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CodeContentComponent] });
    sanitizer = TestBed.inject(DomSanitizer);
  });

  function createHtml(raw: string) {
    return sanitizer.bypassSecurityTrustHtml(raw);
  }

  function create(opts: {
    content?: string;
    theme?: 'dark' | 'light';
    wordWrap?: boolean;
    rawCode?: string;
    hoveredLine?: number;
    highlightedLinesSet?: Set<number>;
    focusedLinesSet?: Set<number>;
    isLoading?: boolean;
  } = {}) {
    const fixture = TestBed.createComponent(CodeContentComponent);
    const html = opts.content ?? '<span class="line">line 1</span>\n<span class="line">line 2</span>';
    fixture.componentRef.setInput('content', createHtml(html));
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.wordWrap !== undefined) fixture.componentRef.setInput('wordWrap', opts.wordWrap);
    if (opts.rawCode !== undefined) fixture.componentRef.setInput('rawCode', opts.rawCode);
    if (opts.hoveredLine !== undefined) fixture.componentRef.setInput('hoveredLine', opts.hoveredLine);
    if (opts.highlightedLinesSet !== undefined) fixture.componentRef.setInput('highlightedLinesSet', opts.highlightedLinesSet);
    if (opts.focusedLinesSet !== undefined) fixture.componentRef.setInput('focusedLinesSet', opts.focusedLinesSet);
    if (opts.isLoading !== undefined) fixture.componentRef.setInput('isLoading', opts.isLoading);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders a code-content-wrapper div', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.code-content-wrapper')).not.toBeNull();
    });

    it('renders a code element inside the wrapper', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.code-content-wrapper code')).not.toBeNull();
    });

    it('renders innerHTML content', () => {
      const { nativeElement } = create({ content: '<span class="line">hello</span>' });
      expect(nativeElement.querySelector('code').innerHTML).toContain('hello');
    });

    it('has host class nx-code-content', () => {
      const { nativeElement } = create();
      expect(nativeElement.classList.contains('nx-code-content')).toBe(true);
    });
  });

  // ─── containerClasses ─────────────────────────────────────────────────────

  describe('containerClasses', () => {
    it('applies dark theme class by default', () => {
      const { nativeElement } = create({ theme: 'dark' });
      expect(nativeElement.querySelector('code').className).toContain('dark');
    });

    it('applies light theme class', () => {
      const { nativeElement } = create({ theme: 'light' });
      expect(nativeElement.querySelector('code').className).toContain('light');
    });

    it('applies nowrap class by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('code').className).toContain('nowrap');
    });

    it('applies wrap class when wordWrap is true', () => {
      const { nativeElement } = create({ wordWrap: true });
      expect(nativeElement.querySelector('code').className).toContain('wrap');
    });

    it('applies nowrap class when wordWrap is false', () => {
      const { nativeElement } = create({ wordWrap: false });
      expect(nativeElement.querySelector('code').className).toContain('nowrap');
    });
  });

  // ─── null content ─────────────────────────────────────────────────────────

  describe('null content', () => {
    it('renders code element even with null content', () => {
      const fixture = TestBed.createComponent(CodeContentComponent);
      fixture.componentRef.setInput('content', null);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('code')).not.toBeNull();
    });
  });

  // ─── outputs ──────────────────────────────────────────────────────────────

  describe('outputs', () => {
    it('exposes lineHover output', () => {
      const fixture = create();
      expect(fixture.componentInstance.lineHover).toBeDefined();
    });

    it('exposes referenceClick output', () => {
      const fixture = create();
      expect(fixture.componentInstance.referenceClick).toBeDefined();
    });

    it('exposes referenceHover output', () => {
      const fixture = create();
      expect(fixture.componentInstance.referenceHover).toBeDefined();
    });

    it('exposes collapsedRangeToggle output', () => {
      const fixture = create();
      expect(fixture.componentInstance.collapsedRangeToggle).toBeDefined();
    });

    it('exposes lineWidgetClick output', () => {
      const fixture = create();
      expect(fixture.componentInstance.lineWidgetClick).toBeDefined();
    });

    it('exposes insertWidgetClose output', () => {
      const fixture = create();
      expect(fixture.componentInstance.insertWidgetClose).toBeDefined();
    });

    it('exposes insertWidgetHeightChange output', () => {
      const fixture = create();
      expect(fixture.componentInstance.insertWidgetHeightChange).toBeDefined();
    });
  });

  // ─── onClick reference handling ───────────────────────────────────────────

  describe('onClick - reference click', () => {
    it('emits referenceClick when clicking a .nx-ref element with matching reference', () => {
      const refId = 'ref-test-1';
      const html = `<span class="line"><span class="nx-ref" data-ref-id="${refId}" data-ref-types="info">hello</span></span>`;
      const fixture = create({ content: html });

      const mockRef: ProcessedReference = {
        id: refId,
        matchedText: 'hello',
        captureGroups: [],
        target: '_blank',
        types: ['info'],
        lineNumber: 1,
      };
      fixture.componentRef.setInput('processedReferences', new Map([[refId, mockRef]]));
      fixture.detectChanges();

      const emitted: ProcessedReference[] = [];
      fixture.componentInstance.referenceClick.subscribe((r: ProcessedReference) => emitted.push(r));

      const refEl = fixture.nativeElement.querySelector('.nx-ref') as HTMLElement;
      refEl.click();

      expect(emitted).toHaveLength(1);
      expect(emitted[0].id).toBe(refId);
    });

    it('does not emit referenceClick when no matching reference', () => {
      const html = `<span class="line"><span class="nx-ref" data-ref-id="unknown">hello</span></span>`;
      const fixture = create({ content: html });

      const emitted: ProcessedReference[] = [];
      fixture.componentInstance.referenceClick.subscribe((r: ProcessedReference) => emitted.push(r));

      const refEl = fixture.nativeElement.querySelector('.nx-ref') as HTMLElement;
      refEl.click();

      expect(emitted).toHaveLength(0);
    });

    it('does not emit when clicking non-reference element', () => {
      const fixture = create();

      const emitted: ProcessedReference[] = [];
      fixture.componentInstance.referenceClick.subscribe((r: ProcessedReference) => emitted.push(r));

      const codeEl = fixture.nativeElement.querySelector('code') as HTMLElement;
      codeEl.click();

      expect(emitted).toHaveLength(0);
    });
  });

  // ─── onMouseOver / onMouseOut - reference hover ───────────────────────────

  describe('reference hover', () => {
    function createWithRef() {
      const refId = 'ref-hover-1';
      const html = `<span class="line"><span class="nx-ref" data-ref-id="${refId}">text</span></span>`;
      const fixture = create({ content: html });

      const mockRef: ProcessedReference = {
        id: refId,
        matchedText: 'text',
        captureGroups: [],
        target: '_blank',
        types: ['info'],
        lineNumber: 1,
      };
      fixture.componentRef.setInput('processedReferences', new Map([[refId, mockRef]]));
      fixture.detectChanges();
      return { fixture, refId, mockRef };
    }

    it('emits referenceHover with show:true on mouseover', () => {
      const { fixture, mockRef } = createWithRef();
      const emitted: unknown[] = [];
      fixture.componentInstance.referenceHover.subscribe((e: unknown) => emitted.push(e));

      const refEl = fixture.nativeElement.querySelector('.nx-ref') as HTMLElement;
      refEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

      expect(emitted).toHaveLength(1);
      expect((emitted[0] as { show: boolean }).show).toBe(true);
    });

    it('emits referenceHover with show:false on mouseout', () => {
      const { fixture } = createWithRef();
      const emitted: unknown[] = [];
      fixture.componentInstance.referenceHover.subscribe((e: unknown) => emitted.push(e));

      const refEl = fixture.nativeElement.querySelector('.nx-ref') as HTMLElement;
      refEl.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));

      expect(emitted).toHaveLength(1);
      expect((emitted[0] as { show: boolean }).show).toBe(false);
    });
  });

  // ─── lineHover on mousemove ───────────────────────────────────────────────

  describe('lineHover on mousemove', () => {
    it('emits lineHover with line number when hovering over a line', () => {
      const html = '<span class="line">line 1</span><span class="line">line 2</span>';
      const fixture = create({ content: html });

      const emitted: number[] = [];
      fixture.componentInstance.lineHover.subscribe((n: number) => emitted.push(n));

      const lines = fixture.nativeElement.querySelectorAll('.line');
      lines[0].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toBe(1);
    });

    it('emits correct line number for second line', () => {
      const html = '<span class="line">line 1</span><span class="line">line 2</span>';
      const fixture = create({ content: html });

      const emitted: number[] = [];
      fixture.componentInstance.lineHover.subscribe((n: number) => emitted.push(n));

      const lines = fixture.nativeElement.querySelectorAll('.line');
      lines[1].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toBe(2);
    });
  });

  // ─── cleanup on destroy ───────────────────────────────────────────────────

  describe('cleanup on destroy', () => {
    it('does not throw when destroyed', () => {
      const fixture = create();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  // ─── default inputs ───────────────────────────────────────────────────────

  describe('default inputs', () => {
    it('defaults rawCode to empty string', () => {
      const fixture = create();
      expect(fixture.componentInstance.rawCode()).toBe('');
    });

    it('defaults theme to dark', () => {
      const fixture = create();
      expect(fixture.componentInstance.theme()).toBe('dark');
    });

    it('defaults wordWrap to false', () => {
      const fixture = create();
      expect(fixture.componentInstance.wordWrap()).toBe(false);
    });

    it('defaults isLoading to false', () => {
      const fixture = create();
      expect(fixture.componentInstance.isLoading()).toBe(false);
    });

    it('defaults hoveredLine to 0', () => {
      const fixture = create();
      expect(fixture.componentInstance.hoveredLine()).toBe(0);
    });

    it('defaults highlightedLinesSet to empty set', () => {
      const fixture = create();
      expect(fixture.componentInstance.highlightedLinesSet().size).toBe(0);
    });

    it('defaults focusedLinesSet to empty set', () => {
      const fixture = create();
      expect(fixture.componentInstance.focusedLinesSet().size).toBe(0);
    });

    it('defaults collapsedRangesState to empty map', () => {
      const fixture = create();
      expect(fixture.componentInstance.collapsedRangesState().size).toBe(0);
    });

    it('defaults processedReferences to empty map', () => {
      const fixture = create();
      expect(fixture.componentInstance.processedReferences().size).toBe(0);
    });

    it('defaults lineWidgets to empty array', () => {
      const fixture = create();
      expect(fixture.componentInstance.lineWidgets()).toEqual([]);
    });

    it('defaults activeInsertWidget to null', () => {
      const fixture = create();
      expect(fixture.componentInstance.activeInsertWidget()).toBeNull();
    });
  });
});
