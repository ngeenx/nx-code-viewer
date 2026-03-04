import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabBarComponent } from './tab-bar.component';
import type { CodeTabItem } from '@ngeenx/nx-code-viewer-utils';

const makeTab = (id: string, fileName: string): CodeTabItem => ({
  id,
  type: 'code',
  fileName,
  fileExtension: '.ts',
  code: '',
});

const makeTabs = () => [
  makeTab('tab-1', 'app.ts'),
  makeTab('tab-2', 'main.ts'),
  makeTab('tab-3', 'index.ts'),
];

describe('TabBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TabBarComponent] });
  });

  function create(opts: { tabs?: CodeTabItem[]; activeTabId?: string; theme?: 'dark' | 'light' } = {}) {
    const fixture = TestBed.createComponent(TabBarComponent);
    fixture.componentRef.setInput('tabs', opts.tabs ?? makeTabs());
    fixture.componentRef.setInput('activeTabId', opts.activeTabId ?? 'tab-1');
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders a tablist element', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('[role="tablist"]')).not.toBeNull();
  });

  it('renders the correct number of tab buttons', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelectorAll('button[role="tab"]').length).toBe(3);
  });

  it('renders 1 tab when given a single-item array', () => {
    const { nativeElement } = create({ tabs: [makeTab('tab-1', 'app.ts')], activeTabId: 'tab-1' });
    expect(nativeElement.querySelectorAll('button[role="tab"]').length).toBe(1);
  });

  it('renders 0 tabs when given an empty array', () => {
    const { nativeElement } = create({ tabs: [], activeTabId: '' });
    expect(nativeElement.querySelectorAll('button[role="tab"]').length).toBe(0);
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class to tablist', () => {
      const { nativeElement } = create({ theme: 'dark' });
      expect(nativeElement.querySelector('[role="tablist"]').className).toContain('dark');
    });

    it('applies light class to tablist', () => {
      const { nativeElement } = create({ theme: 'light' });
      expect(nativeElement.querySelector('[role="tablist"]').className).toContain('light');
    });
  });

  // ─── active tab ───────────────────────────────────────────────────────────

  describe('activeTabId', () => {
    it('marks the active tab with aria-selected="true"', () => {
      const { nativeElement } = create({ activeTabId: 'tab-2' });
      const buttons = nativeElement.querySelectorAll('button[role="tab"]');
      expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    });

    it('marks inactive tabs with aria-selected="false"', () => {
      const { nativeElement } = create({ activeTabId: 'tab-1' });
      const buttons = nativeElement.querySelectorAll('button[role="tab"]');
      expect(buttons[1].getAttribute('aria-selected')).toBe('false');
      expect(buttons[2].getAttribute('aria-selected')).toBe('false');
    });

    it('sets tabindex=0 on the active tab', () => {
      const { nativeElement } = create({ activeTabId: 'tab-2' });
      const buttons = nativeElement.querySelectorAll('button[role="tab"]');
      expect(buttons[1].getAttribute('tabindex')).toBe('0');
    });

    it('sets tabindex=-1 on inactive tabs', () => {
      const { nativeElement } = create({ activeTabId: 'tab-1' });
      const buttons = nativeElement.querySelectorAll('button[role="tab"]');
      expect(buttons[1].getAttribute('tabindex')).toBe('-1');
      expect(buttons[2].getAttribute('tabindex')).toBe('-1');
    });
  });

  // ─── tabChange output ─────────────────────────────────────────────────────

  describe('tabChange output', () => {
    it('emits tabId when clicking an inactive tab', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[1].triggerEventHandler('click', null);
      expect(emitted).toEqual(['tab-2']);
    });

    it('does not emit when clicking the active tab', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[0].triggerEventHandler('click', null);
      expect(emitted).toHaveLength(0);
    });

    it('emits the correct tabId for the third tab', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[2].triggerEventHandler('click', null);
      expect(emitted).toEqual(['tab-3']);
    });
  });

  // ─── keyboard navigation ──────────────────────────────────────────────────

  describe('keyboard navigation', () => {
    it('ArrowRight navigates to the next tab', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[0].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(emitted).toEqual(['tab-2']);
    });

    it('ArrowLeft navigates to the previous tab', () => {
      const fixture = create({ activeTabId: 'tab-2' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[1].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(emitted).toEqual(['tab-1']);
    });

    it('Home navigates to the first tab', () => {
      const fixture = create({ activeTabId: 'tab-3' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[2].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Home' }));
      expect(emitted).toEqual(['tab-1']);
    });

    it('End navigates to the last tab', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[0].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'End' }));
      expect(emitted).toEqual(['tab-3']);
    });

    it('ArrowRight wraps from last tab to first', () => {
      const fixture = create({ activeTabId: 'tab-3' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[2].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(emitted).toEqual(['tab-1']);
    });

    it('ArrowLeft wraps from first tab to last', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[0].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(emitted).toEqual(['tab-3']);
    });

    it('other keys do not emit tabChange', () => {
      const fixture = create({ activeTabId: 'tab-1' });
      const emitted: string[] = [];
      fixture.componentInstance.tabChange.subscribe((id: string) => emitted.push(id));
      const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
      buttons[0].triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(emitted).toHaveLength(0);
    });
  });
});
