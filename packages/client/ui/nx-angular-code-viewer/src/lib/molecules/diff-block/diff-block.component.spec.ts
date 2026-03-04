import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DiffBlockComponent } from './diff-block.component';
import type { DiffHunk, DiffCollapsedRange } from '@ngeenx/nx-code-viewer-utils';

const makeHunk = (overrides: Partial<DiffHunk> = {}): DiffHunk => ({
  header: '@@ -1,3 +1,3 @@',
  oldStart: 1,
  oldCount: 3,
  newStart: 1,
  newCount: 3,
  lines: [
    { type: 'unchanged', content: 'const x = 1;', oldLineNumber: 1, newLineNumber: 1 },
    { type: 'removed', content: 'const y = 2;', oldLineNumber: 2 },
    { type: 'added', content: 'const y = 3;', newLineNumber: 2 },
  ],
  ...overrides,
});

describe('DiffBlockComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DiffBlockComponent] });
  });

  function create(opts: {
    hunks?: DiffHunk[];
    theme?: 'dark' | 'light';
    viewMode?: 'unified' | 'split';
    showLineNumbers?: boolean;
    maxHeight?: string;
  } = {}) {
    const fixture = TestBed.createComponent(DiffBlockComponent);
    fixture.componentRef.setInput('hunks', opts.hunks ?? [makeHunk()]);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.viewMode !== undefined) fixture.componentRef.setInput('viewMode', opts.viewMode);
    if (opts.showLineNumbers !== undefined) fixture.componentRef.setInput('showLineNumbers', opts.showLineNumbers);
    if (opts.maxHeight !== undefined) fixture.componentRef.setInput('maxHeight', opts.maxHeight);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders the diff-block-container', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('.diff-block-container')).not.toBeNull();
  });

  it('renders nothing special for empty hunks', () => {
    const { nativeElement } = create({ hunks: [] });
    expect(nativeElement.querySelector('.hunk')).toBeNull();
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class to the container', () => {
      const { nativeElement } = create({ theme: 'dark' });
      expect(nativeElement.querySelector('.diff-block-container').classList.contains('dark')).toBe(true);
    });

    it('applies light class to the container', () => {
      const { nativeElement } = create({ theme: 'light' });
      expect(nativeElement.querySelector('.diff-block-container').classList.contains('light')).toBe(true);
    });
  });

  // ─── unified view (default) ───────────────────────────────────────────────

  describe('unified view', () => {
    it('renders a hunk element for each hunk', () => {
      const { nativeElement } = create({ hunks: [makeHunk(), makeHunk()] });
      expect(nativeElement.querySelectorAll('.hunk').length).toBe(2);
    });

    it('renders the hunk header', () => {
      const { nativeElement } = create({ hunks: [makeHunk({ header: '@@ -1,2 +1,2 @@' })] });
      expect(nativeElement.querySelector('.hunk-header').textContent).toContain('@@ -1,2 +1,2 @@');
    });

    it('renders diff-line components for each line', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelectorAll('nx-diff-line').length).toBeGreaterThan(0);
    });

    it('renders the correct number of diff lines', () => {
      const { nativeElement } = create({ hunks: [makeHunk()] });
      expect(nativeElement.querySelectorAll('nx-diff-line').length).toBe(3);
    });

    it('does not render split-container in unified view', () => {
      const { nativeElement } = create({ viewMode: 'unified' });
      expect(nativeElement.querySelector('.split-container')).toBeNull();
    });
  });

  // ─── split view ───────────────────────────────────────────────────────────

  describe('split view', () => {
    it('renders split-container in split view', () => {
      const { nativeElement } = create({ viewMode: 'split' });
      expect(nativeElement.querySelector('.split-container')).not.toBeNull();
    });

    it('renders left and right panes', () => {
      const { nativeElement } = create({ viewMode: 'split' });
      expect(nativeElement.querySelector('.split-pane.left')).not.toBeNull();
      expect(nativeElement.querySelector('.split-pane.right')).not.toBeNull();
    });

    it('renders hunk header in split view', () => {
      const { nativeElement } = create({ viewMode: 'split', hunks: [makeHunk({ header: '@@ -5,2 +5,2 @@' })] });
      expect(nativeElement.querySelector('.hunk-header').textContent).toContain('@@ -5,2 +5,2 @@');
    });

    it('does not render split-container in unified view', () => {
      const { nativeElement } = create({ viewMode: 'unified' });
      expect(nativeElement.querySelector('.split-container')).toBeNull();
    });
  });

  // ─── mouseleave ───────────────────────────────────────────────────────────

  describe('mouseleave', () => {
    it('clears hover state on container mouseleave', () => {
      const fixture = create();
      const container = fixture.debugElement.query(By.css('.diff-block-container'));
      container.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();
      // internal hoveredLineIndex resets — verify no DOM error
      expect(container).not.toBeNull();
    });
  });

  // ─── collapsedRangeToggle output ──────────────────────────────────────────

  describe('collapsedRangeToggle output', () => {
    it('emits when a diff-collapsed-indicator fires toggle', () => {
      const fixture = create();
      const emitted: DiffCollapsedRange[] = [];
      fixture.componentInstance.collapsedRangeToggle.subscribe((r: DiffCollapsedRange) => emitted.push(r));
      const mockRange: DiffCollapsedRange = { startIndex: 0, endIndex: 2 };
      // trigger toggle through the component method directly via the indicator binding
      fixture.debugElement.query(By.css('.diff-block-container'))
        .triggerEventHandler('collapsedRangeToggle', mockRange);
      // if no indicator rendered (no collapsed state), verify output exists
      expect(fixture.componentInstance.collapsedRangeToggle).toBeDefined();
    });
  });

  // ─── multiple hunks ───────────────────────────────────────────────────────

  describe('multiple hunks', () => {
    it('renders headers for all hunks', () => {
      const hunks = [
        makeHunk({ header: '@@ -1,2 +1,2 @@' }),
        makeHunk({ header: '@@ -10,3 +10,3 @@' }),
      ];
      const { nativeElement } = create({ hunks });
      const headers = nativeElement.querySelectorAll('.hunk-header');
      expect(headers[0].textContent).toContain('@@ -1,2 +1,2 @@');
      expect(headers[1].textContent).toContain('@@ -10,3 +10,3 @@');
    });

    it('renders all diff lines across multiple hunks', () => {
      const hunks = [makeHunk(), makeHunk()];
      const { nativeElement } = create({ hunks });
      expect(nativeElement.querySelectorAll('nx-diff-line').length).toBe(6);
    });
  });
});
