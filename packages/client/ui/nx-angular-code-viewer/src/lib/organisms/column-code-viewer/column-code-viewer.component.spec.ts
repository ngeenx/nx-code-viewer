import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ColumnCodeViewerComponent } from './column-code-viewer.component';
import type { ColumnCodeItem, ColumnDiffItem, ColumnItem } from '@ngeenx/nx-code-viewer-utils';

const makeCodeColumn = (id: string, title: string, code = 'const x = 1;'): ColumnCodeItem => ({
  id,
  type: 'code',
  title,
  code,
  language: 'typescript',
  fileExtension: '.ts',
});

const makeDiffColumn = (id: string, title: string): ColumnDiffItem => ({
  id,
  type: 'diff',
  title,
  fileExtension: '.ts',
  language: 'typescript',
  oldCode: 'const x = 1;',
  newCode: 'const x = 2;',
});

describe('ColumnCodeViewerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ColumnCodeViewerComponent] });
  });

  function create(opts: {
    columns?: ColumnItem[];
    theme?: 'dark' | 'light';
    borderStyle?: 'classic' | 'grid-cross' | 'corner-intersection' | 'none';
    showColumnHeaders?: boolean;
    maxHeight?: string;
  } = {}) {
    const fixture = TestBed.createComponent(ColumnCodeViewerComponent);
    fixture.componentRef.setInput('columns', opts.columns ?? [makeCodeColumn('col-1', 'File A'), makeCodeColumn('col-2', 'File B')]);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.borderStyle !== undefined) fixture.componentRef.setInput('borderStyle', opts.borderStyle);
    if (opts.showColumnHeaders !== undefined) fixture.componentRef.setInput('showColumnHeaders', opts.showColumnHeaders);
    if (opts.maxHeight !== undefined) fixture.componentRef.setInput('maxHeight', opts.maxHeight);
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders an article element', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('article')).not.toBeNull();
  });

  it('renders columns-container', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('.columns-container')).not.toBeNull();
  });

  it('renders one column per item', () => {
    const columns = [makeCodeColumn('c1', 'A'), makeCodeColumn('c2', 'B'), makeCodeColumn('c3', 'C')];
    const { nativeElement } = create({ columns });
    expect(nativeElement.querySelectorAll('.column').length).toBe(3);
  });

  it('renders nx-code-viewer for code columns', () => {
    const columns = [makeCodeColumn('c1', 'A'), makeCodeColumn('c2', 'B')];
    const { nativeElement } = create({ columns });
    expect(nativeElement.querySelectorAll('nx-code-viewer').length).toBe(2);
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class to article by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('article').className).toContain('dark');
    });

    it('applies light class to article', () => {
      const { nativeElement } = create({ theme: 'light' });
      expect(nativeElement.querySelector('article').className).toContain('light');
    });
  });

  // ─── borderStyle ──────────────────────────────────────────────────────────

  describe('borderStyle', () => {
    it('applies default border class', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('article').className).toContain('border-');
    });

    it('renders border-overlay for grid-cross', () => {
      const { nativeElement } = create({ borderStyle: 'grid-cross' });
      expect(nativeElement.querySelector('.border-overlay')).not.toBeNull();
    });

    it('renders border-overlay for corner-intersection', () => {
      const { nativeElement } = create({ borderStyle: 'corner-intersection' });
      expect(nativeElement.querySelector('.border-overlay')).not.toBeNull();
    });

    it('does not render border-overlay for classic', () => {
      const { nativeElement } = create({ borderStyle: 'classic' });
      expect(nativeElement.querySelector('.border-overlay')).toBeNull();
    });
  });

  // ─── column dividers ──────────────────────────────────────────────────────

  describe('column dividers', () => {
    it('adds column-divider class to all columns except the last', () => {
      const columns = [makeCodeColumn('c1', 'A'), makeCodeColumn('c2', 'B'), makeCodeColumn('c3', 'C')];
      const { nativeElement } = create({ columns });
      const cols = nativeElement.querySelectorAll('.column');
      expect(cols[0].classList.contains('column-divider')).toBe(true);
      expect(cols[1].classList.contains('column-divider')).toBe(true);
      expect(cols[2].classList.contains('column-divider')).toBe(false);
    });

    it('single column has no divider', () => {
      const { nativeElement } = create({ columns: [makeCodeColumn('c1', 'A')] });
      const cols = nativeElement.querySelectorAll('.column');
      expect(cols[0].classList.contains('column-divider')).toBe(false);
    });
  });

  // ─── diff columns ─────────────────────────────────────────────────────────

  describe('diff columns', () => {
    it('renders nx-diff-viewer for diff columns', () => {
      const columns = [makeDiffColumn('d1', 'Changes')];
      const { nativeElement } = create({ columns });
      expect(nativeElement.querySelector('nx-diff-viewer')).not.toBeNull();
    });

    it('renders both code and diff viewers in mixed columns', () => {
      const columns: ColumnItem[] = [makeCodeColumn('c1', 'Code'), makeDiffColumn('d1', 'Diff')];
      const { nativeElement } = create({ columns });
      expect(nativeElement.querySelector('nx-code-viewer')).not.toBeNull();
      expect(nativeElement.querySelector('nx-diff-viewer')).not.toBeNull();
    });

    it('renders correct number of columns for mixed types', () => {
      const columns: ColumnItem[] = [makeCodeColumn('c1', 'A'), makeDiffColumn('d1', 'B'), makeCodeColumn('c2', 'C')];
      const { nativeElement } = create({ columns });
      expect(nativeElement.querySelectorAll('.column').length).toBe(3);
    });
  });

  // ─── codeCopied output ────────────────────────────────────────────────────

  describe('codeCopied output', () => {
    it('exposes codeCopied output', () => {
      const fixture = create();
      expect(fixture.componentInstance.codeCopied).toBeDefined();
    });
  });
});
