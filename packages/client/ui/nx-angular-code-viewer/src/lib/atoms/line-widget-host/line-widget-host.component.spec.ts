import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { LineWidgetHostComponent } from './line-widget-host.component';
import type { LineWidgetContext } from '@ngeenx/nx-code-viewer-utils';

@Component({
  standalone: true,
  template: '<span class="test-widget">Widget</span>',
})
class MockWidgetComponent {}

describe('LineWidgetHostComponent', () => {
  const defaultContext: LineWidgetContext = {
    line: 'const x = 1;',
    lineNumber: 5,
    theme: 'dark',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LineWidgetHostComponent],
    });
  });

  function create(opts: {
    component?: unknown;
    context?: LineWidgetContext;
    position?: 'left' | 'right';
    theme?: 'dark' | 'light';
  } = {}) {
    const fixture = TestBed.createComponent(LineWidgetHostComponent);
    fixture.componentRef.setInput('component', opts.component ?? MockWidgetComponent);
    fixture.componentRef.setInput('context', opts.context ?? defaultContext);
    fixture.componentRef.setInput('position', opts.position ?? 'left');
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders a div with role="button"', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('[role="button"]')).not.toBeNull();
    });

    it('renders with tabindex="0"', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('[tabindex="0"]')).not.toBeNull();
    });

    it('has host class nx-line-widget-host', () => {
      const { nativeElement } = create();
      expect(nativeElement.classList.contains('nx-line-widget-host')).toBe(true);
    });
  });

  // ─── hostClasses ──────────────────────────────────────────────────────────

  describe('hostClasses', () => {
    it('includes left position class', () => {
      const { nativeElement } = create({ position: 'left' });
      const div = nativeElement.querySelector('[role="button"]');
      expect(div.className).toContain('left');
    });

    it('includes right position class', () => {
      const { nativeElement } = create({ position: 'right' });
      const div = nativeElement.querySelector('[role="button"]');
      expect(div.className).toContain('right');
    });

    it('includes dark theme class by default', () => {
      const { nativeElement } = create();
      const div = nativeElement.querySelector('[role="button"]');
      expect(div.className).toContain('dark');
    });

    it('includes light theme class when set', () => {
      const { nativeElement } = create({ theme: 'light' });
      const div = nativeElement.querySelector('[role="button"]');
      expect(div.className).toContain('light');
    });

    it('includes line-widget-host class', () => {
      const { nativeElement } = create();
      const div = nativeElement.querySelector('[role="button"]');
      expect(div.className).toContain('line-widget-host');
    });
  });

  // ─── widgetClick output ───────────────────────────────────────────────────

  describe('widgetClick output', () => {
    it('emits on click', () => {
      const fixture = create();
      let emitCount = 0;
      fixture.componentInstance.widgetClick.subscribe(() => { emitCount++; });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).onClick(new MouseEvent('click'));
      expect(emitCount).toBe(1);
    });

    it('emits on Enter keydown', () => {
      const fixture = create();
      let emitCount = 0;
      fixture.componentInstance.widgetClick.subscribe(() => { emitCount++; });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(emitCount).toBe(1);
    });

    it('emits on Space keydown', () => {
      const fixture = create();
      let emitCount = 0;
      fixture.componentInstance.widgetClick.subscribe(() => { emitCount++; });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).onKeydown(new KeyboardEvent('keydown', { key: ' ' }));
      expect(emitCount).toBe(1);
    });

    it('does not emit on other key presses', () => {
      const fixture = create();
      let emitCount = 0;
      fixture.componentInstance.widgetClick.subscribe(() => { emitCount++; });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).onKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(emitCount).toBe(0);
    });

    it('does not emit on Escape key', () => {
      const fixture = create();
      let emitCount = 0;
      fixture.componentInstance.widgetClick.subscribe(() => { emitCount++; });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).onKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(emitCount).toBe(0);
    });
  });

  // ─── default inputs ───────────────────────────────────────────────────────

  describe('default inputs', () => {
    it('defaults theme to dark', () => {
      const fixture = create();
      expect(fixture.componentInstance.theme()).toBe('dark');
    });
  });
});
