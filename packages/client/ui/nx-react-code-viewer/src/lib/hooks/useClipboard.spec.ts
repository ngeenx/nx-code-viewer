import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
      writable: true,
    });
  });

  it('starts with idle state', () => {
    const { result } = renderHook(() => useClipboard());

    expect(result.current.copyState).toBe('idle');
  });

  it('copy calls navigator.clipboard.writeText with the provided text', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });

  it('copy returns success result on successful copy', async () => {
    const { result } = renderHook(() => useClipboard());

    let copyResult: { success: boolean; error: Error | null };
    await act(async () => {
      copyResult = await result.current.copy('test text');
    });

    expect(copyResult!.success).toBe(true);
    expect(copyResult!.error).toBeNull();
  });

  it('sets copyState to copied on success', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(result.current.copyState).toBe('copied');
  });

  it('copy returns error result on failure', async () => {
    const writeError = new Error('Write failed');
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(writeError);

    const { result } = renderHook(() => useClipboard());

    let copyResult: { success: boolean; error: Error | null };
    await act(async () => {
      copyResult = await result.current.copy('test text');
    });

    expect(copyResult!.success).toBe(false);
    expect(copyResult!.error).toBeInstanceOf(Error);
  });

  it('sets copyState to error on failure', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(result.current.copyState).toBe('error');
  });

  it('returns error when clipboard API is not supported', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useClipboard());

    let copyResult: { success: boolean; error: Error | null };
    await act(async () => {
      copyResult = await result.current.copy('test text');
    });

    expect(copyResult!.success).toBe(false);
    expect(copyResult!.error?.message).toBe('Clipboard API not supported');
  });
});
