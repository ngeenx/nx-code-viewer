import {
  COPY_FEEDBACK_DURATION_MS,
  type ClipboardResult,
  type CopyButtonState,
} from '@ngeenx/nx-code-viewer-utils';

/**
 * Module-level state for singleton clipboard management
 */
const copyStates = new Map<string, { state: CopyButtonState }>();
const stateTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Composable for clipboard operations with state management
 * Provides multi-instance state tracking via unique keys
 */
export function useClipboard() {
  function getCopyState(key: string): CopyButtonState {
    const entry = copyStates.get(key);
    if (!entry) {
      copyStates.set(key, { state: 'idle' });
      return 'idle';
    }
    return entry.state;
  }

  function isCopied(key: string): boolean {
    return getCopyState(key) === 'copied';
  }

  async function copy(text: string, stateKey?: string): Promise<ClipboardResult> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return {
        success: false,
        error: new Error('Clipboard API not supported'),
      };
    }

    try {
      await navigator.clipboard.writeText(text);

      if (stateKey) {
        updateCopyState(stateKey, 'copied');
        scheduleStateReset(stateKey);
      }

      return { success: true, error: null };
    } catch (error) {
      if (stateKey) {
        updateCopyState(stateKey, 'error');
        scheduleStateReset(stateKey);
      }

      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to copy to clipboard'),
      };
    }
  }

  function updateCopyState(key: string, state: CopyButtonState): void {
    copyStates.set(key, { state });
  }

  function scheduleStateReset(key: string): void {
    const existing = stateTimeouts.get(key);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      if (copyStates.has(key)) {
        updateCopyState(key, 'idle');
        stateTimeouts.delete(key);
      }
    }, COPY_FEEDBACK_DURATION_MS);

    stateTimeouts.set(key, timeout);
  }

  function cleanup(key: string): void {
    const timeout = stateTimeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
      stateTimeouts.delete(key);
    }
    copyStates.delete(key);
  }

  return { getCopyState, isCopied, copy, cleanup };
}
