import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CollapsedIndicatorComponent } from './collapsed-indicator.component';

describe('CollapsedIndicatorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CollapsedIndicatorComponent],
    });
  });

  function createFixture(
    range: [number, number] = [5, 10],
    hiddenCount = 6,
    theme: 'dark' | 'light' = 'dark',
    isExpanded = false
  ) {
    const fixture = TestBed.createComponent(CollapsedIndicatorComponent);
    fixture.componentRef.setInput('range', range);
    fixture.componentRef.setInput('hiddenCount', hiddenCount);
    fixture.componentRef.setInput('theme', theme);
    fixture.componentRef.setInput('isExpanded', isExpanded);
    fixture.detectChanges();
    return fixture;
  }

  // ─── host element ──────────────────────────────────────────────────────────

  describe('host element', () => {
    it('renders a div with class "collapsed-indicator"', () => {
      const { nativeElement } = createFixture();
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el).not.toBeNull();
    });

    it('has role="button"', () => {
      const { nativeElement } = createFixture();
      const el = nativeElement.querySelector('[role="button"]');
      expect(el).not.toBeNull();
    });

    it('has tabindex="0"', () => {
      const { nativeElement } = createFixture();
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.getAttribute('tabindex')).toBe('0');
    });
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme input', () => {
    it('applies dark class by default', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark');
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.classList.contains('dark')).toBe(true);
    });

    it('applies light class when theme is light', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'light');
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.classList.contains('light')).toBe(true);
    });
  });

  // ─── isExpanded ───────────────────────────────────────────────────────────

  describe('isExpanded input', () => {
    it('does not add expanded class when collapsed', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark', false);
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.classList.contains('expanded')).toBe(false);
    });

    it('adds expanded class when isExpanded is true', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark', true);
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.classList.contains('expanded')).toBe(true);
    });

    it('sets aria-expanded to false when collapsed', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark', false);
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.getAttribute('aria-expanded')).toBe('false');
    });

    it('sets aria-expanded to true when expanded', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark', true);
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.getAttribute('aria-expanded')).toBe('true');
    });
  });

  // ─── displayText ─────────────────────────────────────────────────────────

  describe('displayText', () => {
    it('shows "1 line" for hiddenCount of 1', () => {
      const { nativeElement } = createFixture([1, 2], 1);
      expect(nativeElement.textContent).toContain('1 line');
    });

    it('shows "N lines" for hiddenCount > 1', () => {
      const { nativeElement } = createFixture([1, 10], 9);
      expect(nativeElement.textContent).toContain('9 lines');
    });

    it('shows "0 lines" for hiddenCount of 0', () => {
      const { nativeElement } = createFixture([1, 1], 0);
      expect(nativeElement.textContent).toContain('0 lines');
    });
  });

  // ─── ariaLabel ───────────────────────────────────────────────────────────

  describe('ariaLabel', () => {
    it('says "Expand N hidden lines" when collapsed', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark', false);
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.getAttribute('aria-label')).toContain('Expand');
      expect(el.getAttribute('aria-label')).toContain('4');
    });

    it('says "Collapse N lines" when expanded', () => {
      const { nativeElement } = createFixture([1, 5], 4, 'dark', true);
      const el = nativeElement.querySelector('.collapsed-indicator');
      expect(el.getAttribute('aria-label')).toContain('Collapse');
    });

    it('uses singular "line" for hiddenCount of 1', () => {
      const { nativeElement } = createFixture([1, 2], 1, 'dark', false);
      const el = nativeElement.querySelector('.collapsed-indicator');
      const label = el.getAttribute('aria-label');
      expect(label).toMatch(/1 (hidden )?line/);
    });
  });

  // ─── toggle output ────────────────────────────────────────────────────────

  describe('toggle output', () => {
    it('emits toggle when clicked', () => {
      const fixture = createFixture();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('.collapsed-indicator')).triggerEventHandler('click', null);
      expect(emitted).toHaveLength(1);
    });

    it('emits toggle on Enter keydown', () => {
      const fixture = createFixture();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('.collapsed-indicator')).triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(emitted).toHaveLength(1);
    });

    it('emits toggle on Space keydown', () => {
      const fixture = createFixture();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('.collapsed-indicator')).triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: ' ' }));
      expect(emitted).toHaveLength(1);
    });

    it('does not emit toggle on other key presses', () => {
      const fixture = createFixture();
      const emitted: undefined[] = [];
      fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('.collapsed-indicator')).triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(emitted).toHaveLength(0);
    });
  });
});
