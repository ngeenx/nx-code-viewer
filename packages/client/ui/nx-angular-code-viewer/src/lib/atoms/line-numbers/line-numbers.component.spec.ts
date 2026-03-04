import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LineNumbersComponent } from './line-numbers.component';

describe('LineNumbersComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LineNumbersComponent] });
  });

  function create(opts: {
    lineCount?: number;
    theme?: 'dark' | 'light';
    hoveredLine?: number;
    highlightedLinesSet?: Set<number>;
    collapsedRangesState?: Map<string, unknown>;
    activeInsertWidget?: unknown;
    insertWidgetHeight?: number;
  } = {}) {
    const fixture = TestBed.createComponent(LineNumbersComponent);
    fixture.componentRef.setInput('lineCount', opts.lineCount ?? 5);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.hoveredLine !== undefined) fixture.componentRef.setInput('hoveredLine', opts.hoveredLine);
    if (opts.highlightedLinesSet !== undefined) fixture.componentRef.setInput('highlightedLinesSet', opts.highlightedLinesSet);
    if (opts.collapsedRangesState !== undefined) fixture.componentRef.setInput('collapsedRangesState', opts.collapsedRangesState);
    if (opts.activeInsertWidget !== undefined) fixture.componentRef.setInput('activeInsertWidget', opts.activeInsertWidget);
    if (opts.insertWidgetHeight !== undefined) fixture.componentRef.setInput('insertWidgetHeight', opts.insertWidgetHeight);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders the container', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('.line-numbers-container')).not.toBeNull();
  });

  it('renders correct number of line-number elements', () => {
    const { nativeElement } = create({ lineCount: 5 });
    const els = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
    expect(els.length).toBe(5);
  });

  it('renders 1 line number for lineCount of 1', () => {
    const { nativeElement } = create({ lineCount: 1 });
    const els = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
    expect(els.length).toBe(1);
  });

  it('renders 0 line numbers for lineCount of 0', () => {
    const { nativeElement } = create({ lineCount: 0 });
    const els = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
    expect(els.length).toBe(0);
  });

  // ─── aria-hidden ──────────────────────────────────────────────────────────

  it('has aria-hidden="true" on the container', () => {
    const { nativeElement } = create();
    const container = nativeElement.querySelector('.line-numbers-container');
    expect(container.getAttribute('aria-hidden')).toBe('true');
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class', () => {
      const { nativeElement } = create({ theme: 'dark' });
      expect(nativeElement.querySelector('.line-numbers-container').className).toContain('dark');
    });

    it('applies light class', () => {
      const { nativeElement } = create({ theme: 'light' });
      expect(nativeElement.querySelector('.line-numbers-container').className).toContain('light');
    });
  });

  // ─── hoveredLine ─────────────────────────────────────────────────────────

  describe('hoveredLine', () => {
    it('adds hovered class to the hovered line number', () => {
      const { nativeElement } = create({ lineCount: 3, hoveredLine: 2 });
      const lineEls = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
      expect(lineEls[1].classList.contains('hovered')).toBe(true);
    });

    it('does not add hovered class to other lines', () => {
      const { nativeElement } = create({ lineCount: 3, hoveredLine: 2 });
      const lineEls = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
      expect(lineEls[0].classList.contains('hovered')).toBe(false);
      expect(lineEls[2].classList.contains('hovered')).toBe(false);
    });
  });

  // ─── highlightedLinesSet ─────────────────────────────────────────────────

  describe('highlightedLinesSet', () => {
    it('adds highlighted class to highlighted line', () => {
      const { nativeElement } = create({ lineCount: 3, highlightedLinesSet: new Set([2]) });
      const lineEls = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
      expect(lineEls[1].classList.contains('highlighted')).toBe(true);
    });

    it('does not add highlighted class to non-highlighted lines', () => {
      const { nativeElement } = create({ lineCount: 3, highlightedLinesSet: new Set([2]) });
      const lineEls = nativeElement.querySelectorAll('.line-number:not(.collapse-indicator)');
      expect(lineEls[0].classList.contains('highlighted')).toBe(false);
    });
  });

  // ─── lineHover output ────────────────────────────────────────────────────

  describe('lineHover output', () => {
    it('emits line number on mouseenter of a line', () => {
      const fixture = create({ lineCount: 3 });
      const emitted: number[] = [];
      fixture.componentInstance.lineHover.subscribe((n: number) => emitted.push(n));
      const lineEls = fixture.debugElement.queryAll(By.css('.line-number:not(.collapse-indicator)'));
      lineEls[0].triggerEventHandler('mouseenter', null);
      expect(emitted).toEqual([1]);
    });

    it('emits correct line number for second line', () => {
      const fixture = create({ lineCount: 3 });
      const emitted: number[] = [];
      fixture.componentInstance.lineHover.subscribe((n: number) => emitted.push(n));
      const lineEls = fixture.debugElement.queryAll(By.css('.line-number:not(.collapse-indicator)'));
      lineEls[1].triggerEventHandler('mouseenter', null);
      expect(emitted).toEqual([2]);
    });
  });
});
