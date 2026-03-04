import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;

  beforeEach(() => {
    vi.useFakeTimers();

    // Reset clipboard mock before each test
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(ClipboardService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ─── copy: basic operation ─────────────────────────────────────────────

  describe('copy()', () => {
    it('calls navigator.clipboard.writeText with the provided text', async () => {
      await service.copy('hello world');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
    });

    it('returns success: true when clipboard write succeeds', async () => {
      const result = await service.copy('test');
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('returns success: false when clipboard write rejects', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Permission denied')
      );
      const result = await service.copy('test');
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Permission denied');
    });

    it('wraps non-Error rejection in an Error object', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce('denied');
      const result = await service.copy('test');
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  // ─── copy: SSR guard ───────────────────────────────────────────────────

  describe('copy() - SSR guard', () => {
    it('returns error when PLATFORM_ID is server', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      const ssrService = TestBed.inject(ClipboardService);
      const result = await ssrService.copy('test');
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('server');
    });
  });

  // ─── copy: state transitions ───────────────────────────────────────────

  describe('copy() - state transitions', () => {
    it('transitions state from idle to copied after successful copy', async () => {
      const state = service.getCopyState('key1');
      expect(state()).toBe('idle');

      await service.copy('text', 'key1');
      expect(state()).toBe('copied');
    });

    it('transitions state from copied back to idle after timeout', async () => {
      const state = service.getCopyState('key1');
      await service.copy('text', 'key1');
      expect(state()).toBe('copied');

      vi.runAllTimers();
      expect(state()).toBe('idle');
    });

    it('transitions state to error when clipboard write fails', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('fail')
      );
      const state = service.getCopyState('key2');
      await service.copy('text', 'key2');
      expect(state()).toBe('error');
    });

    it('does not update state if no stateKey provided', async () => {
      // No stateKey — no state entry should be created implicitly
      await service.copy('text');
      // getCopyState creates a new signal on first access — check it starts idle
      const state = service.getCopyState('unnamed-key');
      expect(state()).toBe('idle');
    });
  });

  // ─── getCopyState ──────────────────────────────────────────────────────

  describe('getCopyState()', () => {
    it('returns same signal instance for the same key', () => {
      const s1 = service.getCopyState('abc');
      const s2 = service.getCopyState('abc');
      expect(s1).toBe(s2);
    });

    it('returns different signals for different keys', () => {
      const s1 = service.getCopyState('key-a');
      const s2 = service.getCopyState('key-b');
      expect(s1).not.toBe(s2);
    });

    it('initial state is idle', () => {
      const state = service.getCopyState('fresh');
      expect(state()).toBe('idle');
    });
  });

  // ─── isCopied ──────────────────────────────────────────────────────────

  describe('isCopied()', () => {
    it('returns false when state is idle', () => {
      const copied = service.isCopied('k1');
      expect(copied()).toBe(false);
    });

    it('returns true after successful copy', async () => {
      await service.copy('text', 'k2');
      const copied = service.isCopied('k2');
      expect(copied()).toBe(true);
    });

    it('returns false again after timeout resets state to idle', async () => {
      await service.copy('text', 'k3');
      vi.runAllTimers();
      const copied = service.isCopied('k3');
      expect(copied()).toBe(false);
    });
  });

  // ─── cleanup ──────────────────────────────────────────────────────────

  describe('cleanup()', () => {
    it('removes state for the given key', async () => {
      service.getCopyState('to-clean');
      service.cleanup('to-clean');
      // After cleanup, getCopyState returns a fresh signal (not the same one)
      const newState = service.getCopyState('to-clean');
      expect(newState()).toBe('idle');
    });

    it('cancels pending timeout so state does NOT update after cleanup', async () => {
      const state = service.getCopyState('timed');
      await service.copy('text', 'timed');
      expect(state()).toBe('copied');

      service.cleanup('timed');

      // Advance timers — the timeout should have been cancelled
      vi.runAllTimers();

      // The original signal still reads 'copied' since cleanup removed the key
      // (the guard in scheduleStateReset checks copyStates.has(key))
      expect(state()).toBe('copied');
    });

    it('is safe to call for a key that does not exist', () => {
      expect(() => service.cleanup('nonexistent')).not.toThrow();
    });
  });
});
