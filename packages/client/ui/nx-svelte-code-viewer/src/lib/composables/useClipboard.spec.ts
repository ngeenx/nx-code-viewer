import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    // Reset the mock that was set up in test-setup.ts
    vi.mocked(navigator.clipboard.writeText).mockReset();
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);
  });

  describe('copy', () => {
    it('calls navigator.clipboard.writeText with the provided text', async () => {
      const clipboard = useClipboard();
      await clipboard.copy('hello world');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
    });

    it('returns success on successful copy', async () => {
      const clipboard = useClipboard();
      const result = await clipboard.copy('test');
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('returns error on clipboard failure', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Clipboard write failed')
      );

      const clipboard = useClipboard();
      const result = await clipboard.copy('test');
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Clipboard write failed');
    });

    it('wraps non-Error thrown values in an Error', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce('string error');

      const clipboard = useClipboard();
      const result = await clipboard.copy('test');
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Failed to copy to clipboard');
    });
  });

  describe('getCopyState', () => {
    it('returns idle for unknown keys', () => {
      const clipboard = useClipboard();
      expect(clipboard.getCopyState('unknown-key-' + Math.random())).toBe('idle');
    });

    it('returns copied after successful copy with stateKey', async () => {
      const clipboard = useClipboard();
      const key = 'test-key-' + Math.random();
      await clipboard.copy('text', key);
      expect(clipboard.getCopyState(key)).toBe('copied');
      clipboard.cleanup(key);
    });

    it('returns error after failed copy with stateKey', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('fail'));

      const clipboard = useClipboard();
      const key = 'error-key-' + Math.random();
      await clipboard.copy('text', key);
      expect(clipboard.getCopyState(key)).toBe('error');
      clipboard.cleanup(key);
    });
  });

  describe('isCopied', () => {
    it('returns false for unknown keys', () => {
      const clipboard = useClipboard();
      expect(clipboard.isCopied('unknown-' + Math.random())).toBe(false);
    });

    it('returns true after successful copy', async () => {
      const clipboard = useClipboard();
      const key = 'copied-key-' + Math.random();
      await clipboard.copy('text', key);
      expect(clipboard.isCopied(key)).toBe(true);
      clipboard.cleanup(key);
    });
  });

  describe('cleanup', () => {
    it('removes state for the given key', async () => {
      const clipboard = useClipboard();
      const key = 'cleanup-key-' + Math.random();
      await clipboard.copy('text', key);
      expect(clipboard.getCopyState(key)).toBe('copied');

      clipboard.cleanup(key);
      expect(clipboard.getCopyState(key)).toBe('idle');
    });

    it('does not throw for unknown keys', () => {
      const clipboard = useClipboard();
      expect(() => clipboard.cleanup('nonexistent-' + Math.random())).not.toThrow();
    });
  });
});
