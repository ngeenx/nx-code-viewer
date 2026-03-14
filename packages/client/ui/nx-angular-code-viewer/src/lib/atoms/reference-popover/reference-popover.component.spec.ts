import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReferencePopoverComponent } from './reference-popover.component';

@Component({
  standalone: true,
  template: '<span class="mock-popover-content">Custom Content</span>',
})
class MockPopoverContentComponent {}

describe('ReferencePopoverComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReferencePopoverComponent],
    });
  });

  function create(opts: {
    content?: string | unknown;
    anchorElement?: HTMLElement;
    theme?: 'dark' | 'light';
    visible?: boolean;
    matchedText?: string;
    captureGroups?: readonly string[];
    lineNumber?: number;
  } = {}) {
    const fixture = TestBed.createComponent(ReferencePopoverComponent);
    fixture.componentRef.setInput('content', opts.content ?? 'test tooltip');
    fixture.componentRef.setInput('anchorElement', opts.anchorElement ?? document.createElement('span'));
    if (opts.theme !== undefined) fixture.componentRef.setInput('theme', opts.theme);
    if (opts.visible !== undefined) fixture.componentRef.setInput('visible', opts.visible);
    if (opts.matchedText !== undefined) fixture.componentRef.setInput('matchedText', opts.matchedText);
    if (opts.captureGroups !== undefined) fixture.componentRef.setInput('captureGroups', opts.captureGroups);
    if (opts.lineNumber !== undefined) fixture.componentRef.setInput('lineNumber', opts.lineNumber);
    fixture.detectChanges();
    return fixture;
  }

  // ─── rendering ────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders a popover-content div', () => {
      const { nativeElement } = create();
      expect(nativeElement.querySelector('.popover-content')).not.toBeNull();
    });

    it('has host class nx-reference-popover', () => {
      const { nativeElement } = create();
      expect(nativeElement.classList.contains('nx-reference-popover')).toBe(true);
    });
  });

  // ─── string content ──────────────────────────────────────────────────────

  describe('string content', () => {
    it('renders string content as text', () => {
      const { nativeElement } = create({ content: 'Hello Tooltip' });
      expect(nativeElement.querySelector('.popover-content span').textContent).toContain('Hello Tooltip');
    });

    it('isStringContent returns true for string', () => {
      const fixture = create({ content: 'text content' });
      expect(fixture.componentInstance['isStringContent']()).toBe(true);
    });

    it('stringContent returns the string value', () => {
      const fixture = create({ content: 'my tooltip' });
      expect(fixture.componentInstance['stringContent']()).toBe('my tooltip');
    });
  });

  // ─── component content ────────────────────────────────────────────────────

  describe('component content', () => {
    it('isStringContent returns false for component type', () => {
      const fixture = create({ content: MockPopoverContentComponent });
      expect(fixture.componentInstance['isStringContent']()).toBe(false);
    });

    it('componentType returns the component class', () => {
      const fixture = create({ content: MockPopoverContentComponent });
      expect(fixture.componentInstance['componentType']()).toBe(MockPopoverContentComponent);
    });

    it('stringContent returns empty string for component type', () => {
      const fixture = create({ content: MockPopoverContentComponent });
      expect(fixture.componentInstance['stringContent']()).toBe('');
    });

    it('componentType returns null for string content', () => {
      const fixture = create({ content: 'text' });
      expect(fixture.componentInstance['componentType']()).toBeNull();
    });
  });

  // ─── componentInputs ─────────────────────────────────────────────────────

  describe('componentInputs', () => {
    it('includes matchedText', () => {
      const fixture = create({ content: MockPopoverContentComponent, matchedText: 'found text' });
      expect(fixture.componentInstance['componentInputs']().matchedText).toBe('found text');
    });

    it('includes captureGroups', () => {
      const groups = ['group1', 'group2'] as const;
      const fixture = create({ content: MockPopoverContentComponent, captureGroups: groups });
      expect(fixture.componentInstance['componentInputs']().captureGroups).toEqual(groups);
    });

    it('includes lineNumber', () => {
      const fixture = create({ content: MockPopoverContentComponent, lineNumber: 42 });
      expect(fixture.componentInstance['componentInputs']().lineNumber).toBe(42);
    });
  });

  // ─── default inputs ───────────────────────────────────────────────────────

  describe('default inputs', () => {
    it('defaults theme to dark', () => {
      const fixture = create();
      expect(fixture.componentInstance.theme()).toBe('dark');
    });

    it('defaults visible to false', () => {
      const fixture = create();
      expect(fixture.componentInstance.visible()).toBe(false);
    });

    it('defaults matchedText to empty string', () => {
      const fixture = create();
      expect(fixture.componentInstance.matchedText()).toBe('');
    });

    it('defaults captureGroups to empty array', () => {
      const fixture = create();
      expect(fixture.componentInstance.captureGroups()).toEqual([]);
    });

    it('defaults lineNumber to 0', () => {
      const fixture = create();
      expect(fixture.componentInstance.lineNumber()).toBe(0);
    });
  });

  // ─── outputs ──────────────────────────────────────────────────────────────

  describe('outputs', () => {
    it('exposes mouseEnter output', () => {
      const fixture = create();
      expect(fixture.componentInstance.mouseEnter).toBeDefined();
    });

    it('exposes mouseLeave output', () => {
      const fixture = create();
      expect(fixture.componentInstance.mouseLeave).toBeDefined();
    });
  });

  // ─── cleanup on destroy ───────────────────────────────────────────────────

  describe('cleanup on destroy', () => {
    it('does not throw when destroyed without tippy instance', () => {
      const fixture = create({ visible: false });
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
