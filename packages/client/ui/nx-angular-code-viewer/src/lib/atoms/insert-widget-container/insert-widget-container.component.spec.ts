import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { InsertWidgetContainerComponent } from './insert-widget-container.component';
import type { LineWidgetContext } from '@ngeenx/nx-code-viewer-utils';

@Component({
  standalone: true,
  template: '<div class="mock-insert-widget">Insert Widget</div>',
})
class MockInsertWidgetComponent {}

describe('InsertWidgetContainerComponent', () => {
  const defaultContext: LineWidgetContext = {
    line: 'const x = 1;',
    lineNumber: 5,
    theme: 'dark',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InsertWidgetContainerComponent],
    });
  });

  function create(opts: {
    component?: unknown;
    context?: LineWidgetContext;
    theme?: 'dark' | 'light';
  } = {}) {
    const fixture = TestBed.createComponent(InsertWidgetContainerComponent);
    fixture.componentRef.setInput('component', opts.component ?? MockInsertWidgetComponent);
    fixture.componentRef.setInput('context', opts.context ?? defaultContext);
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders a container div', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.insert-widget-container')).not.toBeNull();
    });

    it('has host class nx-insert-widget-container', () => {
      const { nativeElement } = create();
      expect(nativeElement.classList.contains('nx-insert-widget-container')).toBe(true);
    });
  });

  // ─── containerClasses ─────────────────────────────────────────────────────

  describe('containerClasses', () => {
    it('includes insert-widget-container class', () => {
      const { nativeElement } = create();
      const div = nativeElement.querySelector('div');
      expect(div.className).toContain('insert-widget-container');
    });

    it('includes dark theme class by default', () => {
      const { nativeElement } = create();
      const div = nativeElement.querySelector('div');
      expect(div.className).toContain('dark');
    });

    it('includes light theme class when set', () => {
      const { nativeElement } = create({ theme: 'light' });
      const div = nativeElement.querySelector('div');
      expect(div.className).toContain('light');
    });
  });

  // ─── close output ────────────────────────────────────────────────────────

  describe('close output', () => {
    it('exposes close output', () => {
      const fixture = create();
      expect(fixture.componentInstance.close).toBeDefined();
    });

    it('emits when onClose is called', () => {
      const fixture = create();
      let emitCount = 0;
      fixture.componentInstance.close.subscribe(() => { emitCount++; });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).onClose();
      expect(emitCount).toBe(1);
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
