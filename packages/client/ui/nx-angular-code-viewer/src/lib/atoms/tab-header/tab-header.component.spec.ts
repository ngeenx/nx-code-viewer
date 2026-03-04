import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabHeaderComponent } from './tab-header.component';

describe('TabHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TabHeaderComponent] });
  });

  function create(opts: { tabId?: string; fileName?: string; fileExtension?: string; isActive?: boolean; theme?: 'dark' | 'light' } = {}) {
    const fixture = TestBed.createComponent(TabHeaderComponent);
    fixture.componentRef.setInput('tabId', opts.tabId ?? 'tab-1');
    fixture.componentRef.setInput('fileName', opts.fileName ?? 'app.ts');
    if (opts.fileExtension !== undefined) fixture.componentRef.setInput('fileExtension', opts.fileExtension);
    if (opts.isActive !== undefined) fixture.componentRef.setInput('isActive', opts.isActive);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders a button with role="tab"', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('button[role="tab"]')).not.toBeNull();
  });

  it('displays the file name', () => {
    const { nativeElement } = create({ fileName: 'main.ts' });
    expect(nativeElement.querySelector('.file-name').textContent).toContain('main.ts');
  });

  // ─── aria attributes ──────────────────────────────────────────────────────

  describe('aria attributes', () => {
    it('sets aria-selected to false when inactive', () => {
      const { nativeElement } = create({ isActive: false });
      expect(nativeElement.querySelector('button').getAttribute('aria-selected')).toBe('false');
    });

    it('sets aria-selected to true when active', () => {
      const { nativeElement } = create({ isActive: true });
      expect(nativeElement.querySelector('button').getAttribute('aria-selected')).toBe('true');
    });

    it('sets id to "tab-{tabId}"', () => {
      const { nativeElement } = create({ tabId: 'my-tab' });
      expect(nativeElement.querySelector('button').getAttribute('id')).toBe('tab-my-tab');
    });

    it('sets aria-controls to "panel-{tabId}"', () => {
      const { nativeElement } = create({ tabId: 'my-tab' });
      expect(nativeElement.querySelector('button').getAttribute('aria-controls')).toBe('panel-my-tab');
    });
  });

  // ─── tabindex ─────────────────────────────────────────────────────────────

  describe('tabindex', () => {
    it('is 0 when active', () => {
      const { nativeElement } = create({ isActive: true });
      expect(nativeElement.querySelector('button').getAttribute('tabindex')).toBe('0');
    });

    it('is -1 when inactive', () => {
      const { nativeElement } = create({ isActive: false });
      expect(nativeElement.querySelector('button').getAttribute('tabindex')).toBe('-1');
    });
  });

  // ─── active class ─────────────────────────────────────────────────────────

  describe('active class', () => {
    it('does not add active class when inactive', () => {
      const { nativeElement } = create({ isActive: false });
      expect(nativeElement.querySelector('button').classList.contains('active')).toBe(false);
    });

    it('adds active class when isActive is true', () => {
      const { nativeElement } = create({ isActive: true });
      expect(nativeElement.querySelector('button').classList.contains('active')).toBe(true);
    });
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class', () => {
      const { nativeElement } = create({ theme: 'dark' });
      expect(nativeElement.querySelector('button').className).toContain('dark');
    });

    it('applies light class', () => {
      const { nativeElement } = create({ theme: 'light' });
      expect(nativeElement.querySelector('button').className).toContain('light');
    });
  });

  // ─── tabClick output ──────────────────────────────────────────────────────

  describe('tabClick output', () => {
    it('emits the tabId when clicked', () => {
      const fixture = create({ tabId: 'my-tab' });
      const emitted: string[] = [];
      fixture.componentInstance.tabClick.subscribe((id: string) => emitted.push(id));
      fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);
      expect(emitted).toEqual(['my-tab']);
    });
  });

  // ─── tabKeydown output ────────────────────────────────────────────────────

  describe('tabKeydown output', () => {
    it('emits keyboard events from the button', () => {
      const fixture = create();
      const events: KeyboardEvent[] = [];
      fixture.componentInstance.tabKeydown.subscribe((e: KeyboardEvent) => events.push(e));
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      fixture.debugElement.query(By.css('button')).triggerEventHandler('keydown', event);
      expect(events).toHaveLength(1);
      expect(events[0].key).toBe('ArrowRight');
    });
  });
});
