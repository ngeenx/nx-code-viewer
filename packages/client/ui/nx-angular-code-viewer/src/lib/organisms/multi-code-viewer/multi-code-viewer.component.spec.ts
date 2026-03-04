import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MultiCodeViewerComponent } from './multi-code-viewer.component';
import type { CodeTabItem, DiffTabItem, TabChangeEvent } from '@ngeenx/nx-code-viewer-utils';

const makeCodeTab = (id: string, fileName: string, code = 'const x = 1;'): CodeTabItem => ({
  id,
  type: 'code',
  fileName,
  fileExtension: '.ts',
  code,
});

const makeDiffTab = (id: string, fileName: string): DiffTabItem => ({
  id,
  type: 'diff',
  fileName,
  fileExtension: '.ts',
  oldCode: 'const x = 1;',
  newCode: 'const x = 2;',
});

describe('MultiCodeViewerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MultiCodeViewerComponent] });
  });

  function create(opts: {
    tabs?: (CodeTabItem | DiffTabItem)[];
    theme?: 'dark' | 'light';
    borderStyle?: 'classic' | 'grid-cross' | 'corner-intersection' | 'none';
    initialActiveTabId?: string;
    showContentHeader?: boolean;
  } = {}) {
    const fixture = TestBed.createComponent(MultiCodeViewerComponent);
    fixture.componentRef.setInput('tabs', opts.tabs ?? [makeCodeTab('tab-1', 'app.ts'), makeCodeTab('tab-2', 'main.ts')]);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.borderStyle !== undefined) fixture.componentRef.setInput('borderStyle', opts.borderStyle);
    if (opts.initialActiveTabId !== undefined) fixture.componentRef.setInput('initialActiveTabId', opts.initialActiveTabId);
    if (opts.showContentHeader !== undefined) fixture.componentRef.setInput('showContentHeader', opts.showContentHeader);
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

  it('renders nx-tab-bar', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('nx-tab-bar')).not.toBeNull();
  });

  it('renders tab-panels container', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('.tab-panels')).not.toBeNull();
  });

  it('renders one tabpanel per tab', () => {
    const { nativeElement } = create({ tabs: [makeCodeTab('t1', 'a.ts'), makeCodeTab('t2', 'b.ts'), makeCodeTab('t3', 'c.ts')] });
    expect(nativeElement.querySelectorAll('[role="tabpanel"]').length).toBe(3);
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

  // ─── active tab ───────────────────────────────────────────────────────────

  describe('active tab', () => {
    it('first tab is active by default', () => {
      const { nativeElement } = create({ tabs: [makeCodeTab('t1', 'a.ts'), makeCodeTab('t2', 'b.ts')] });
      const panels = nativeElement.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].classList.contains('active')).toBe(true);
      expect(panels[1].classList.contains('hidden')).toBe(true);
    });

    it('respects initialActiveTabId', () => {
      const tabs = [makeCodeTab('t1', 'a.ts'), makeCodeTab('t2', 'b.ts')];
      const { nativeElement } = create({ tabs, initialActiveTabId: 't2' });
      const panels = nativeElement.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].classList.contains('hidden')).toBe(true);
      expect(panels[1].classList.contains('active')).toBe(true);
    });
  });

  // ─── aria attributes ──────────────────────────────────────────────────────

  describe('aria attributes', () => {
    it('sets role="tabpanel" on each panel', () => {
      const { nativeElement } = create({ tabs: [makeCodeTab('my-tab', 'a.ts')] });
      const panel = nativeElement.querySelector('[role="tabpanel"]');
      expect(panel.getAttribute('role')).toBe('tabpanel');
    });

    it('sets correct id on panel', () => {
      const { nativeElement } = create({ tabs: [makeCodeTab('my-tab', 'a.ts')] });
      const panel = nativeElement.querySelector('[role="tabpanel"]');
      expect(panel.getAttribute('id')).toBe('panel-my-tab');
    });

    it('sets aria-labelledby on panel', () => {
      const { nativeElement } = create({ tabs: [makeCodeTab('my-tab', 'a.ts')] });
      const panel = nativeElement.querySelector('[role="tabpanel"]');
      expect(panel.getAttribute('aria-labelledby')).toBe('tab-my-tab');
    });
  });

  // ─── activeTabChange output ───────────────────────────────────────────────

  describe('activeTabChange output', () => {
    it('emits when a different tab is clicked', () => {
      const tabs = [makeCodeTab('t1', 'a.ts'), makeCodeTab('t2', 'b.ts')];
      const fixture = create({ tabs });
      const emitted: TabChangeEvent[] = [];
      fixture.componentInstance.activeTabChange.subscribe((e: TabChangeEvent) => emitted.push(e));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[1].triggerEventHandler('click', null);
      expect(emitted).toHaveLength(1);
      expect(emitted[0].currentTabId).toBe('t2');
    });

    it('does not emit when clicking the active tab', () => {
      const tabs = [makeCodeTab('t1', 'a.ts'), makeCodeTab('t2', 'b.ts')];
      const fixture = create({ tabs });
      const emitted: TabChangeEvent[] = [];
      fixture.componentInstance.activeTabChange.subscribe((e: TabChangeEvent) => emitted.push(e));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[0].triggerEventHandler('click', null);
      expect(emitted).toHaveLength(0);
    });

    it('updates active panel after tab click', () => {
      const tabs = [makeCodeTab('t1', 'a.ts'), makeCodeTab('t2', 'b.ts')];
      const fixture = create({ tabs });
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[1].triggerEventHandler('click', null);
      fixture.detectChanges();
      const panels = fixture.nativeElement.querySelectorAll('[role="tabpanel"]');
      expect(panels[1].classList.contains('active')).toBe(true);
      expect(panels[0].classList.contains('hidden')).toBe(true);
    });
  });

  // ─── tab content types ────────────────────────────────────────────────────

  describe('tab content types', () => {
    it('renders nx-code-viewer for code tabs', () => {
      const { nativeElement } = create({ tabs: [makeCodeTab('t1', 'app.ts')] });
      expect(nativeElement.querySelector('nx-code-viewer')).not.toBeNull();
    });

    it('renders nx-diff-viewer for diff tabs', () => {
      const { nativeElement } = create({ tabs: [makeDiffTab('t1', 'app.ts')] });
      expect(nativeElement.querySelector('nx-diff-viewer')).not.toBeNull();
    });

    it('renders both code and diff viewers in a mixed tab set', () => {
      const tabs = [makeCodeTab('t1', 'app.ts'), makeDiffTab('t2', 'diff.ts')];
      const { nativeElement } = create({ tabs });
      expect(nativeElement.querySelector('nx-code-viewer')).not.toBeNull();
      expect(nativeElement.querySelector('nx-diff-viewer')).not.toBeNull();
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
