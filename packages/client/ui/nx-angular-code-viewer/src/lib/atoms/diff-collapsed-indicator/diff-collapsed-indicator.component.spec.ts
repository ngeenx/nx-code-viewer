import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DiffCollapsedIndicatorComponent } from './diff-collapsed-indicator.component';

describe('DiffCollapsedIndicatorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DiffCollapsedIndicatorComponent] });
  });

  function create(opts: {
    range?: { startIndex: number; endIndex: number };
    hiddenCount?: number;
    theme?: 'dark' | 'light';
    showLineNumbers?: boolean;
    showPrefix?: boolean;
    isExpanded?: boolean;
  } = {}) {
    const fixture = TestBed.createComponent(DiffCollapsedIndicatorComponent);
    fixture.componentRef.setInput('range', opts.range ?? { startIndex: 0, endIndex: 5 });
    fixture.componentRef.setInput('hiddenCount', opts.hiddenCount ?? 6);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.showLineNumbers !== undefined) fixture.componentRef.setInput('showLineNumbers', opts.showLineNumbers);
    if (opts.showPrefix !== undefined) fixture.componentRef.setInput('showPrefix', opts.showPrefix);
    if (opts.isExpanded !== undefined) fixture.componentRef.setInput('isExpanded', opts.isExpanded);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders with role="button"', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('[role="button"]')).not.toBeNull();
  });

  it('has tabindex="0"', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('[role="button"]').getAttribute('tabindex')).toBe('0');
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class by default', () => {
      const { nativeElement } = create({ theme: 'dark' });
      const el = nativeElement.querySelector('[role="button"]');
      expect(el.className).toContain('dark');
    });

    it('applies light class when set', () => {
      const { nativeElement } = create({ theme: 'light' });
      const el = nativeElement.querySelector('[role="button"]');
      expect(el.className).toContain('light');
    });
  });

  // ─── displayText ──────────────────────────────────────────────────────────

  describe('displayText', () => {
    it('shows "1 line" for hiddenCount of 1', () => {
      const { nativeElement } = create({ hiddenCount: 1 });
      expect(nativeElement.textContent).toContain('1 line');
    });

    it('shows "N lines" for hiddenCount > 1', () => {
      const { nativeElement } = create({ hiddenCount: 5 });
      expect(nativeElement.textContent).toContain('5 lines');
    });
  });

  // ─── aria-expanded / aria-label ──────────────────────────────────────────

  describe('aria attributes', () => {
    it('sets aria-expanded to false when collapsed', () => {
      const { nativeElement } = create({ isExpanded: false });
      expect(nativeElement.querySelector('[role="button"]').getAttribute('aria-expanded')).toBe('false');
    });

    it('sets aria-expanded to true when expanded', () => {
      const { nativeElement } = create({ isExpanded: true });
      expect(nativeElement.querySelector('[role="button"]').getAttribute('aria-expanded')).toBe('true');
    });

    it('aria-label mentions Expand when collapsed', () => {
      const { nativeElement } = create({ hiddenCount: 3, isExpanded: false });
      const label = nativeElement.querySelector('[role="button"]').getAttribute('aria-label');
      expect(label).toContain('Expand');
    });

    it('aria-label mentions Collapse when expanded', () => {
      const { nativeElement } = create({ hiddenCount: 3, isExpanded: true });
      const label = nativeElement.querySelector('[role="button"]').getAttribute('aria-label');
      expect(label).toContain('Collapse');
    });
  });

  // ─── showLineNumbers ─────────────────────────────────────────────────────

  describe('showLineNumbers', () => {
    it('renders line number spans when showLineNumbers is true', () => {
      const { nativeElement } = create({ showLineNumbers: true });
      expect(nativeElement.querySelectorAll('.line-number').length).toBeGreaterThan(0);
    });

    it('does not render line number spans when showLineNumbers is false', () => {
      const { nativeElement } = create({ showLineNumbers: false });
      expect(nativeElement.querySelectorAll('.line-number').length).toBe(0);
    });
  });

  // ─── showPrefix ──────────────────────────────────────────────────────────

  describe('showPrefix', () => {
    it('renders prefix span when showPrefix is true', () => {
      const { nativeElement } = create({ showPrefix: true });
      expect(nativeElement.querySelector('.prefix')).not.toBeNull();
    });

    it('does not render prefix span when showPrefix is false', () => {
      const { nativeElement } = create({ showPrefix: false });
      expect(nativeElement.querySelector('.prefix')).toBeNull();
    });
  });

  // ─── toggle output ────────────────────────────────────────────────────────

  describe('toggle output', () => {
    it('emits on click', () => {
      const fixture = create();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('[role="button"]')).triggerEventHandler('click', null);
      expect(emitted).toHaveLength(1);
    });

    it('emits on Enter keydown', () => {
      const fixture = create();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('[role="button"]')).triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(emitted).toHaveLength(1);
    });

    it('emits on Space keydown', () => {
      const fixture = create();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('[role="button"]')).triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: ' ' }));
      expect(emitted).toHaveLength(1);
    });

    it('does not emit on other keys', () => {
      const fixture = create();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('[role="button"]')).triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(emitted).toHaveLength(0);
    });
  });
});
