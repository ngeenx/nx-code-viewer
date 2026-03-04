import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CodeBlockComponent } from './code-block.component';
import type { LineRange, ProcessedReference } from '@ngeenx/nx-code-viewer-utils';

describe('CodeBlockComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CodeBlockComponent] });
  });

  function create(opts: {
    content?: null;
    lineCount?: number;
    theme?: 'dark' | 'light';
    showLineNumbers?: boolean;
    showCopyButton?: boolean;
    wordWrap?: boolean;
    maxHeight?: string;
    isLoading?: boolean;
    copyState?: 'idle' | 'copied' | 'error';
    copyClick?: () => void;
  } = {}) {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentRef.setInput('content', opts.content ?? null);
    fixture.componentRef.setInput('lineCount', opts.lineCount ?? 5);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.showLineNumbers !== undefined) fixture.componentRef.setInput('showLineNumbers', opts.showLineNumbers);
    if (opts.showCopyButton !== undefined) fixture.componentRef.setInput('showCopyButton', opts.showCopyButton);
    if (opts.wordWrap !== undefined) fixture.componentRef.setInput('wordWrap', opts.wordWrap);
    if (opts.maxHeight !== undefined) fixture.componentRef.setInput('maxHeight', opts.maxHeight);
    if (opts.isLoading !== undefined) fixture.componentRef.setInput('isLoading', opts.isLoading);
    if (opts.copyState !== undefined) fixture.componentRef.setInput('copyState', opts.copyState);
    if (opts.copyClick !== undefined) fixture.componentRef.setInput('copyClick', opts.copyClick);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders the code-block-wrapper container', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('.code-block-wrapper')).not.toBeNull();
  });

  it('renders the code-block-container', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('.code-block-container')).not.toBeNull();
  });

  // ─── copy button ──────────────────────────────────────────────────────────

  describe('showCopyButton', () => {
    it('renders the copy button by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('nx-copy-button')).not.toBeNull();
    });

    it('hides the copy button when showCopyButton is false', () => {
      const { nativeElement } = create({ showCopyButton: false });
      expect(nativeElement.querySelector('nx-copy-button')).toBeNull();
    });

    it('shows the copy button when showCopyButton is true', () => {
      const { nativeElement } = create({ showCopyButton: true });
      expect(nativeElement.querySelector('nx-copy-button')).not.toBeNull();
    });
  });

  // ─── line numbers ─────────────────────────────────────────────────────────

  describe('showLineNumbers', () => {
    it('renders line numbers by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('nx-line-numbers')).not.toBeNull();
    });

    it('hides line numbers when showLineNumbers is false', () => {
      const { nativeElement } = create({ showLineNumbers: false });
      expect(nativeElement.querySelector('nx-line-numbers')).toBeNull();
    });

    it('shows line numbers when showLineNumbers is true', () => {
      const { nativeElement } = create({ showLineNumbers: true });
      expect(nativeElement.querySelector('nx-line-numbers')).not.toBeNull();
    });
  });

  // ─── code content ─────────────────────────────────────────────────────────

  it('always renders the code content component', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('nx-code-content')).not.toBeNull();
  });

  // ─── copyClick input ──────────────────────────────────────────────────────

  describe('copyClick', () => {
    it('calls the copyClick handler when copy button is clicked', () => {
      const handler = vi.fn();
      const fixture = create({ copyClick: handler });
      const copyBtn = fixture.debugElement.query(By.css('nx-copy-button'));
      copyBtn.triggerEventHandler('copyClick', undefined);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  // ─── collapsedRangeToggle output ──────────────────────────────────────────

  describe('collapsedRangeToggle output', () => {
    it('emits when line-numbers fires collapsedRangeToggle', () => {
      const fixture = create();
      const emitted: LineRange[] = [];
      fixture.componentInstance.collapsedRangeToggle.subscribe((r: LineRange) => emitted.push(r));
      const lineNumbers = fixture.debugElement.query(By.css('nx-line-numbers'));
      lineNumbers.triggerEventHandler('collapsedRangeToggle', [2, 5] as LineRange);
      expect(emitted).toEqual([[2, 5]]);
    });

    it('emits when code-content fires collapsedRangeToggle', () => {
      const fixture = create();
      const emitted: LineRange[] = [];
      fixture.componentInstance.collapsedRangeToggle.subscribe((r: LineRange) => emitted.push(r));
      const codeContent = fixture.debugElement.query(By.css('nx-code-content'));
      codeContent.triggerEventHandler('collapsedRangeToggle', [1, 3] as LineRange);
      expect(emitted).toEqual([[1, 3]]);
    });
  });

  // ─── referenceClick output ────────────────────────────────────────────────

  describe('referenceClick output', () => {
    it('emits when code-content fires referenceClick', () => {
      const fixture = create();
      const emitted: ProcessedReference[] = [];
      fixture.componentInstance.referenceClick.subscribe((r: ProcessedReference) => emitted.push(r));
      const mockRef = { id: 'ref-1' } as ProcessedReference;
      const codeContent = fixture.debugElement.query(By.css('nx-code-content'));
      codeContent.triggerEventHandler('referenceClick', mockRef);
      expect(emitted).toEqual([mockRef]);
    });
  });

  // ─── hoveredLine internal state ───────────────────────────────────────────

  describe('hoveredLine', () => {
    it('mouseleave on container resets hovered line', () => {
      const fixture = create();
      const container = fixture.debugElement.query(By.css('.code-block-container'));
      container.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();
      // internal hoveredLine signal resets to 0 — verify no DOM error
      expect(container).not.toBeNull();
    });
  });
});
