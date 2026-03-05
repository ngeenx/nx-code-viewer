import { useState, useCallback, useRef, useEffect } from 'react';
import { COPY_FEEDBACK_DURATION_MS, type CopyButtonState, type ClipboardResult } from '@ngeenx/nx-code-viewer-utils';

export function useClipboard() {
  const [copyState, setCopyState] = useState<CopyButtonState>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const copy = useCallback(async (text: string): Promise<ClipboardResult> => {
    if (!navigator.clipboard) {
      setCopyState('error');
      return { success: false, error: new Error('Clipboard API not supported') };
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');

      cleanup();
      timeoutRef.current = setTimeout(() => {
        setCopyState('idle');
      }, COPY_FEEDBACK_DURATION_MS);

      return { success: true, error: null };
    } catch (error) {
      setCopyState('error');

      cleanup();
      timeoutRef.current = setTimeout(() => {
        setCopyState('idle');
      }, COPY_FEEDBACK_DURATION_MS);

      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to copy to clipboard'),
      };
    }
  }, [cleanup]);

  return { copyState, copy, cleanup };
}
