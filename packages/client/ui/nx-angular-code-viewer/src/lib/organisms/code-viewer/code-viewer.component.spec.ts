import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CodeViewerComponent } from './code-viewer.component';

describe('CodeViewerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CodeViewerComponent] });
  });

  function create(opts: {
    code?: string;
    theme?: 'dark' | 'light';
    borderStyle?: 'classic' | 'grid-cross' | 'corner-intersection' | 'none';
    showHeader?: boolean;
    showLineNumbers?: boolean;
    showCopyButton?: boolean;
    title?: string;
    language?: string;
    maxHeight?: string;
    wordWrap?: boolean;
  } = {}) {
    const fixture = TestBed.createComponent(CodeViewerComponent);
    fixture.componentRef.setInput('code', opts.code ?? 'const x = 1;');
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.borderStyle !== undefined) fixture.componentRef.setInput('borderStyle', opts.borderStyle);
    if (opts.showHeader !== undefined) fixture.componentRef.setInput('showHeader', opts.showHeader);
    if (opts.showLineNumbers !== undefined) fixture.componentRef.setInput('showLineNumbers', opts.showLineNumbers);
    if (opts.showCopyButton !== undefined) fixture.componentRef.setInput('showCopyButton', opts.showCopyButton);
    if (opts.title !== undefined) fixture.componentRef.setInput('title', opts.title);
    if (opts.language !== undefined) fixture.componentRef.setInput('language', opts.language);
    if (opts.maxHeight !== undefined) fixture.componentRef.setInput('maxHeight', opts.maxHeight);
    if (opts.wordWrap !== undefined) fixture.componentRef.setInput('wordWrap', opts.wordWrap);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders an article element', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('article')).not.toBeNull();
  });

  it('always renders nx-code-block', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('nx-code-block')).not.toBeNull();
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

    it('applies border-grid-cross class', () => {
      const { nativeElement } = create({ borderStyle: 'grid-cross' });
      expect(nativeElement.querySelector('article').className).toContain('border-grid-cross');
    });

    it('applies border-corner-intersection class', () => {
      const { nativeElement } = create({ borderStyle: 'corner-intersection' });
      expect(nativeElement.querySelector('article').className).toContain('border-corner-intersection');
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

    it('does not render border-overlay for none', () => {
      const { nativeElement } = create({ borderStyle: 'none' });
      expect(nativeElement.querySelector('.border-overlay')).toBeNull();
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

  // ─── multiline code ───────────────────────────────────────────────────────

  describe('multiline code', () => {
    it('accepts an array of strings as code', () => {
      const fixture = TestBed.createComponent(CodeViewerComponent);
      fixture.componentRef.setInput('code', ['line 1', 'line 2', 'line 3']);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('nx-code-block')).not.toBeNull();
    });
  });

  // ─── outputs ──────────────────────────────────────────────────────────────

  describe('outputs', () => {
    it('exposes codeCopied output', () => {
      const fixture = create();
      expect(fixture.componentInstance.codeCopied).toBeDefined();
    });

    it('exposes referenceClick output', () => {
      const fixture = create();
      expect(fixture.componentInstance.referenceClick).toBeDefined();
    });

    it('exposes collapsedRangeToggle output', () => {
      const fixture = create();
      expect(fixture.componentInstance.collapsedRangeToggle).toBeDefined();
    });

    it('exposes lineWidgetClick output', () => {
      const fixture = create();
      expect(fixture.componentInstance.lineWidgetClick).toBeDefined();
    });
  });

  // ─── collapsedRangeToggle output ─────────────────────────────────────────

  describe('collapsedRangeToggle output', () => {
    it('exposes collapsedRangeToggle output', () => {
      const fixture = create();
      expect(fixture.componentInstance.collapsedRangeToggle).toBeDefined();
    });
  });
});
