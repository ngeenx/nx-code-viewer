import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { WritableSignal, Signal } from '@angular/core';
import type { ClipboardResult, CopyButtonState } from '../types';
import { COPY_FEEDBACK_DURATION_MS } from '../types';

/**
 * Service for handling clipboard operations with reactive state management
 * Follows Single Responsibility Principle - only handles clipboard operations
 */
@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Tracks active copy state timeouts by key
   */
  private readonly stateTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Tracks copy states by key for multiple instances
   */
  private readonly copyStates = new Map<string, WritableSignal<CopyButtonState>>();

  /**
   * Gets or creates a copy state signal for a given key
   * @param key - Unique identifier for the copy state
   * @returns Writable signal for the copy state
   */
  getCopyState(key: string): WritableSignal<CopyButtonState> {
    let state = this.copyStates.get(key);

    if (!state) {
      state = signal<CopyButtonState>('idle');
      this.copyStates.set(key, state);
    }

    return state;
  }

  /**
   * Gets a readonly computed signal for whether content was copied
   * @param key - Unique identifier for the copy state
   * @returns Computed signal indicating copied state
   */
  isCopied(key: string): Signal<boolean> {
    const state = this.getCopyState(key);
    return computed(() => state() === 'copied');
  }

  /**
   * Copies text to clipboard and manages state
   * @param text - Text to copy to clipboard
   * @param stateKey - Optional key to track copy state
   * @returns Promise with clipboard operation result
   */
  async copy(text: string, stateKey?: string): Promise<ClipboardResult> {
    if (!this.isBrowser) {
      return {
        success: false,
        error: new Error('Clipboard not available in server environment'),
      };
    }

    if (!navigator.clipboard) {
      return {
        success: false,
        error: new Error('Clipboard API not supported'),
      };
    }

    try {
      await navigator.clipboard.writeText(text);

      if (stateKey) {
        this.updateCopyState(stateKey, 'copied');
        this.scheduleStateReset(stateKey);
      }

      return { success: true, error: null };
    } catch (error) {
      if (stateKey) {
        this.updateCopyState(stateKey, 'error');
        this.scheduleStateReset(stateKey);
      }

      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to copy to clipboard'),
      };
    }
  }

  /**
   * Updates the copy state for a given key
   * @param key - Unique identifier for the copy state
   * @param state - New state value
   */
  private updateCopyState(key: string, state: CopyButtonState): void {
    const stateSignal = this.getCopyState(key);
    stateSignal.set(state);
  }

  /**
   * Schedules a reset of the copy state back to idle
   * @param key - Unique identifier for the copy state
   */
  private scheduleStateReset(key: string): void {
    const existingTimeout = this.stateTimeouts.get(key);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      this.updateCopyState(key, 'idle');
      this.stateTimeouts.delete(key);
    }, COPY_FEEDBACK_DURATION_MS);

    this.stateTimeouts.set(key, timeout);
  }

  /**
   * Cleans up state for a given key
   * @param key - Unique identifier for the copy state to clean up
   */
  cleanup(key: string): void {
    const timeout = this.stateTimeouts.get(key);

    if (timeout) {
      clearTimeout(timeout);
      this.stateTimeouts.delete(key);
    }

    this.copyStates.delete(key);
  }
}
