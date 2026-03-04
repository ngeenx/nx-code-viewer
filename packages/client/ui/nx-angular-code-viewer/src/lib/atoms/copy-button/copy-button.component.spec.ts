import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CopyButtonComponent } from './copy-button.component';

describe('CopyButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CopyButtonComponent] });
  });

  function create(state: 'idle' | 'copied' | 'error' = 'idle', theme: 'dark' | 'light' = 'dark', disabled = false) {
    const fixture = TestBed.createComponent(CopyButtonComponent);
    fixture.componentRef.setInput('state', state);
    fixture.componentRef.setInput('theme', theme);
    fixture.componentRef.setInput('disabled', disabled);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  it('renders a button element', () => {
    const { nativeElement } = create();
    expect(nativeElement.querySelector('button')).not.toBeNull();
  });

  // ─── theme ────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('applies dark class', () => {
      const { nativeElement } = create('idle', 'dark');
      expect(nativeElement.querySelector('button').className).toContain('dark');
    });

    it('applies light class', () => {
      const { nativeElement } = create('idle', 'light');
      expect(nativeElement.querySelector('button').className).toContain('light');
    });
  });

  // ─── state classes ────────────────────────────────────────────────────────

  describe('buttonClasses', () => {
    it('does not add state class when idle', () => {
      const { nativeElement } = create('idle');
      const btn = nativeElement.querySelector('button');
      expect(btn.className).not.toContain('idle');
    });

    it('adds copied class when state is copied', () => {
      const { nativeElement } = create('copied');
      expect(nativeElement.querySelector('button').className).toContain('copied');
    });

    it('adds error class when state is error', () => {
      const { nativeElement } = create('error');
      expect(nativeElement.querySelector('button').className).toContain('error');
    });
  });

  // ─── aria-label ───────────────────────────────────────────────────────────

  describe('ariaLabel', () => {
    it('says "Copy to clipboard" when idle', () => {
      const { nativeElement } = create('idle');
      expect(nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Copy to clipboard');
    });

    it('says "Copied to clipboard" when copied', () => {
      const { nativeElement } = create('copied');
      expect(nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Copied to clipboard');
    });

    it('says "Failed to copy" when error', () => {
      const { nativeElement } = create('error');
      expect(nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Failed to copy');
    });
  });

  // ─── disabled ─────────────────────────────────────────────────────────────

  describe('disabled', () => {
    it('button is not disabled by default', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('button').disabled).toBe(false);
    });

    it('button is disabled when disabled input is true', () => {
      const { nativeElement } = create('idle', 'dark', true);
      expect(nativeElement.querySelector('button').disabled).toBe(true);
    });
  });

  // ─── copyClick output ─────────────────────────────────────────────────────

  describe('copyClick output', () => {
    it('emits when button is clicked and not disabled', () => {
      const fixture = create();
      const emitted: undefined[] = [];
      fixture.componentInstance.copyClick.subscribe(() => emitted.push(undefined));
      fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);
      expect(emitted).toHaveLength(1);
    });

    it('does not emit when disabled', () => {
      const fixture = create('idle', 'dark', true);
      const emitted: undefined[] = [];
      fixture.componentInstance.copyClick.subscribe(() => emitted.push(undefined));
      fixture.nativeElement.querySelector('button').click();
      expect(emitted).toHaveLength(0);
    });
  });
});
