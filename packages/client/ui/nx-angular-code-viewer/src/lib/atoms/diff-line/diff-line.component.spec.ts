import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DiffLineComponent } from './diff-line.component';
import type { DiffLine } from '@ngeenx/nx-code-viewer-utils';

const makeLine = (overrides: Partial<DiffLine> = {}): DiffLine => ({
  type: 'unchanged',
  content: 'const x = 1;',
  oldLineNumber: 1,
  newLineNumber: 1,
  ...overrides,
});

describe('DiffLineComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DiffLineComponent] });
  });

  function create(line: DiffLine = makeLine(), opts: { theme?: 'dark' | 'light'; showLineNumbers?: boolean; showPrefix?: boolean; isHighlighted?: boolean } = {}) {
    const fixture = TestBed.createComponent(DiffLineComponent);
    fixture.componentRef.setInput('line', line);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.showLineNumbers !== undefined) fixture.componentRef.setInput('showLineNumbers', opts.showLineNumbers);
    if (opts.showPrefix !== undefined) fixture.componentRef.setInput('showPrefix', opts.showPrefix);
    if (opts.isHighlighted !== undefined) fixture.componentRef.setInput('isHighlighted', opts.isHighlighted);
    fixture.detectChanges();
    return fixture;
  }

  // ─── line classes ─────────────────────────────────────────────────────────

  describe('lineClasses', () => {
    it('includes the line type class', () => {
      const { nativeElement } = create(makeLine({ type: 'added' }));
      expect(nativeElement.querySelector('.diff-line').classList.contains('added')).toBe(true);
    });

    it('includes removed type class', () => {
      const { nativeElement } = create(makeLine({ type: 'removed' }));
      expect(nativeElement.querySelector('.diff-line').classList.contains('removed')).toBe(true);
    });

    it('includes theme class', () => {
      const { nativeElement } = create(makeLine(), { theme: 'light' });
      expect(nativeElement.querySelector('.diff-line').classList.contains('light')).toBe(true);
    });

    it('includes highlighted class when isHighlighted is true', () => {
      const { nativeElement } = create(makeLine(), { isHighlighted: true });
      expect(nativeElement.querySelector('.diff-line').classList.contains('highlighted')).toBe(true);
    });

    it('does not include highlighted class by default', () => {
      const { nativeElement } = create(makeLine());
      expect(nativeElement.querySelector('.diff-line').classList.contains('highlighted')).toBe(false);
    });
  });

  // ─── line numbers ─────────────────────────────────────────────────────────

  describe('showLineNumbers', () => {
    it('renders old and new line number spans by default', () => {
      const { nativeElement } = create(makeLine({ oldLineNumber: 3, newLineNumber: 4 }));
      expect(nativeElement.querySelector('.line-number.old')).not.toBeNull();
      expect(nativeElement.querySelector('.line-number.new')).not.toBeNull();
    });

    it('shows oldLineNumber value', () => {
      const { nativeElement } = create(makeLine({ oldLineNumber: 7, newLineNumber: 8 }));
      expect(nativeElement.querySelector('.line-number.old').textContent).toContain('7');
    });

    it('shows newLineNumber value', () => {
      const { nativeElement } = create(makeLine({ oldLineNumber: 7, newLineNumber: 8 }));
      expect(nativeElement.querySelector('.line-number.new').textContent).toContain('8');
    });

    it('does not render line numbers when showLineNumbers is false', () => {
      const { nativeElement } = create(makeLine(), { showLineNumbers: false });
      expect(nativeElement.querySelector('.line-number')).toBeNull();
    });
  });

  // ─── prefix ──────────────────────────────────────────────────────────────

  describe('showPrefix', () => {
    it('renders prefix span by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.prefix')).not.toBeNull();
    });

    it('shows "+" prefix for added lines', () => {
      const { nativeElement } = create(makeLine({ type: 'added' }));
      expect(nativeElement.querySelector('.prefix').textContent).toContain('+');
    });

    it('shows "-" prefix for removed lines', () => {
      const { nativeElement } = create(makeLine({ type: 'removed' }));
      expect(nativeElement.querySelector('.prefix').textContent).toContain('-');
    });

    it('does not render prefix when showPrefix is false', () => {
      const { nativeElement } = create(makeLine(), { showPrefix: false });
      expect(nativeElement.querySelector('.prefix')).toBeNull();
    });
  });

  // ─── content ─────────────────────────────────────────────────────────────

  describe('content', () => {
    it('renders plain content when no highlightedContent', () => {
      const { nativeElement } = create(makeLine({ content: 'hello world' }));
      expect(nativeElement.querySelector('.content').textContent).toContain('hello world');
    });
  });

  // ─── lineHover output ─────────────────────────────────────────────────────

  describe('lineHover output', () => {
    it('emits lineIndex on mouseenter', () => {
      const fixture = create();
      fixture.componentRef.setInput('lineIndex', 3);
      fixture.detectChanges();
      const emitted: number[] = [];
      fixture.componentInstance.lineHover.subscribe((n: number) => emitted.push(n));
      fixture.debugElement.query(By.css('.diff-line')).triggerEventHandler('mouseenter', null);
      expect(emitted).toEqual([3]);
    });
  });
});
