import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset clipboard mock for each test
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up states between tests
    const { cleanup } = useClipboard();
    cleanup('test-key');
    cleanup('another-key');
    vi.useRealTimers();
  });

  // -----------------------------------------------------------------------
  // copy
  // -----------------------------------------------------------------------
  describe('copy', () => {
    it('calls navigator.clipboard.writeText with the provided text', async () => {
      const { copy } = useClipboard();
      await copy('hello world');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
    });

    it('returns success: true on successful copy', async () => {
      const { copy } = useClipboard();
      const result = await copy('test text');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('returns success: false when clipboard API throws', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Permission denied')
      );

      const { copy } = useClipboard();
      const result = await copy('test text');

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('returns success: false when clipboard API is not available', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });

      const { copy } = useClipboard();
      const result = await copy('test text');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Clipboard API not supported');
    });
  });

  // -----------------------------------------------------------------------
  // getCopyState
  // -----------------------------------------------------------------------
  describe('getCopyState', () => {
    it('returns idle state initially', () => {
      const { getCopyState } = useClipboard();
      const state = getCopyState('test-key');

      expect(state.value).toBe('idle');
    });

    it('transitions to copied after a successful copy with stateKey', async () => {
      const { copy, getCopyState } = useClipboard();
      await copy('text', 'test-key');
      const state = getCopyState('test-key');

      expect(state.value).toBe('copied');
    });

    it('transitions to error when copy fails with stateKey', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('fail')
      );

      const { copy, getCopyState } = useClipboard();
      await copy('text', 'test-key');
      const state = getCopyState('test-key');

      expect(state.value).toBe('error');
    });

    it('returns the same ref for the same key', () => {
      const { getCopyState } = useClipboard();
      const state1 = getCopyState('test-key');
      const state2 = getCopyState('test-key');

      expect(state1).toBe(state2);
    });
  });

  // -----------------------------------------------------------------------
  // cleanup
  // -----------------------------------------------------------------------
  describe('cleanup', () => {
    it('resets state so a new ref is created on next access', async () => {
      const { copy, getCopyState, cleanup } = useClipboard();

      await copy('text', 'test-key');
      expect(getCopyState('test-key').value).toBe('copied');

      cleanup('test-key');

      // After cleanup, a fresh state should be idle
      const freshState = getCopyState('test-key');
      expect(freshState.value).toBe('idle');
    });
  });

  // -----------------------------------------------------------------------
  // State auto-reset
  // -----------------------------------------------------------------------
  describe('state auto-reset', () => {
    it('resets state to idle after feedback duration', async () => {
      const { copy, getCopyState } = useClipboard();
      await copy('text', 'test-key');
      const state = getCopyState('test-key');

      expect(state.value).toBe('copied');

      // Fast-forward past COPY_FEEDBACK_DURATION_MS (2000)
      vi.advanceTimersByTime(2500);

      expect(state.value).toBe('idle');
    });
  });
});
