import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DiffViewerComponent } from './diff-viewer.component';

// Minimal unified diff string
const SIMPLE_DIFF = `--- a/file.ts
+++ b/file.ts
@@ -1,3 +1,3 @@
 const x = 1;
-const y = 2;
+const y = 3;
 const z = 4;`;

describe('DiffViewerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DiffViewerComponent] });
  });

  function create(opts: {
    diff?: string;
    oldCode?: string;
    newCode?: string;
    theme?: 'dark' | 'light';
    borderStyle?: 'classic' | 'grid-cross' | 'corner-intersection' | 'none';
    showHeader?: boolean;
    showLineNumbers?: boolean;
    viewMode?: 'unified' | 'split';
    oldFileName?: string;
    newFileName?: string;
  } = {}) {
    const fixture = TestBed.createComponent(DiffViewerComponent);
    if (opts.diff !== undefined) fixture.componentRef.setInput('diff', opts.diff);
    if (opts.oldCode !== undefined) fixture.componentRef.setInput('oldCode', opts.oldCode);
    if (opts.newCode !== undefined) fixture.componentRef.setInput('newCode', opts.newCode);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.borderStyle !== undefined) fixture.componentRef.setInput('borderStyle', opts.borderStyle);
    if (opts.showHeader !== undefined) fixture.componentRef.setInput('showHeader', opts.showHeader);
    if (opts.showLineNumbers !== undefined) fixture.componentRef.setInput('showLineNumbers', opts.showLineNumbers);
    if (opts.viewMode !== undefined) fixture.componentRef.setInput('viewMode', opts.viewMode);
    if (opts.oldFileName !== undefined) fixture.componentRef.setInput('oldFileName', opts.oldFileName);
    if (opts.newFileName !== undefined) fixture.componentRef.setInput('newFileName', opts.newFileName);
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
    it('applies border-classic class by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('article').className).toContain('border-classic');
    });

    it('applies border-none class', () => {
      const { nativeElement } = create({ borderStyle: 'none' });
      expect(nativeElement.querySelector('article').className).toContain('border-none');
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

  // ─── no changes (empty diff) ──────────────────────────────────────────────

  describe('no changes', () => {
    it('shows "No changes to display" when no diff is provided', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.no-changes')).not.toBeNull();
      expect(nativeElement.querySelector('.no-changes').textContent).toContain('No changes to display');
    });

    it('does not render diff-block when there are no changes', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('nx-diff-block')).toBeNull();
    });

    it('does not render diff-stats when there are no changes', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.diff-stats')).toBeNull();
    });
  });

  // ─── with changes (diff string) ───────────────────────────────────────────

  describe('with changes', () => {
    it('renders nx-diff-block when diff has changes', () => {
      const { nativeElement } = create({ diff: SIMPLE_DIFF });
      expect(nativeElement.querySelector('nx-diff-block')).not.toBeNull();
    });

    it('does not show "No changes to display" when diff has changes', () => {
      const { nativeElement } = create({ diff: SIMPLE_DIFF });
      expect(nativeElement.querySelector('.no-changes')).toBeNull();
    });

    it('renders diff-stats when diff has changes', () => {
      const { nativeElement } = create({ diff: SIMPLE_DIFF });
      expect(nativeElement.querySelector('.diff-stats')).not.toBeNull();
    });

    it('shows added lines count in stats', () => {
      const { nativeElement } = create({ diff: SIMPLE_DIFF });
      const addedEl = nativeElement.querySelector('.stat.added');
      expect(addedEl).not.toBeNull();
      expect(addedEl.textContent).toContain('+');
    });

    it('shows removed lines count in stats', () => {
      const { nativeElement } = create({ diff: SIMPLE_DIFF });
      const removedEl = nativeElement.querySelector('.stat.removed');
      expect(removedEl).not.toBeNull();
      expect(removedEl.textContent).toContain('-');
    });
  });

  // ─── oldCode / newCode input mode ─────────────────────────────────────────

  describe('oldCode / newCode input', () => {
    it('renders nx-diff-block when oldCode and newCode differ', () => {
      const { nativeElement } = create({ oldCode: 'const x = 1;', newCode: 'const x = 2;' });
      expect(nativeElement.querySelector('nx-diff-block')).not.toBeNull();
    });

    it('renders article when oldCode and newCode are provided', () => {
      const { nativeElement } = create({ oldCode: 'const x = 1;', newCode: 'const x = 1;' });
      expect(nativeElement.querySelector('article')).not.toBeNull();
    });
  });

  // ─── header ───────────────────────────────────────────────────────────────

  describe('showHeader', () => {
    it('renders header by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('nx-code-header')).not.toBeNull();
    });

    it('renders header when showHeader is true', () => {
      const { nativeElement } = create({ showHeader: true });
      expect(nativeElement.querySelector('nx-code-header')).not.toBeNull();
    });

    it('hides header when showHeader is false', () => {
      const { nativeElement } = create({ showHeader: false });
      expect(nativeElement.querySelector('nx-code-header')).toBeNull();
    });
  });

  // ─── outputs ──────────────────────────────────────────────────────────────

  describe('outputs', () => {
    it('exposes collapsedRangeToggle output', () => {
      const fixture = create();
      expect(fixture.componentInstance.collapsedRangeToggle).toBeDefined();
    });

    it('exposes lineWidgetClick output', () => {
      const fixture = create();
      expect(fixture.componentInstance.lineWidgetClick).toBeDefined();
    });
  });
});
