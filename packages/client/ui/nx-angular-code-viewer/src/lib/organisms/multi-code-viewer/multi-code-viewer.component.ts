import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import type {
  CodeViewerBorderStyle,
  CodeViewerTheme,
  MultiCodeViewerTabItem,
  TabChangeEvent,
} from '../../types';
import {
  DEFAULT_MULTI_CODE_VIEWER_CONFIG,
  isCodeTabItem,
  isDiffTabItem,
} from '../../types';
import { TabBarComponent } from '../../molecules/tab-bar';
import { CodeViewerComponent } from '../code-viewer';
import { DiffViewerComponent } from '../diff-viewer';

/**
 * MultiCodeViewer Organism Component
 *
 * Provides a tabbed interface for displaying multiple code viewers
 * and/or diff viewers. Each tab has its own file name, icon, and content.
 *
 * @example
 * ```html
 * <nx-multi-code-viewer
 *   [tabs]="[
 *     { id: 'ts', type: 'code', fileName: 'app.ts', code: tsCode, language: 'typescript' },
 *     { id: 'html', type: 'code', fileName: 'app.html', code: htmlCode, language: 'html' }
 *   ]"
 *   [theme]="'dark'"
 *   [borderStyle]="'classic'"
 *   (activeTabChange)="onTabChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'nx-multi-code-viewer',
  standalone: true,
  imports: [TabBarComponent, CodeViewerComponent, DiffViewerComponent],
  templateUrl: './multi-code-viewer.component.html',
  styleUrl: './multi-code-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiCodeViewerComponent {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Array of tab items (code or diff)
   */
  readonly tabs = input.required<readonly MultiCodeViewerTabItem[]>();

  /**
   * Color theme
   */
  readonly theme = input<CodeViewerTheme>(
    DEFAULT_MULTI_CODE_VIEWER_CONFIG.theme
  );

  /**
   * Border style variant
   */
  readonly borderStyle = input<CodeViewerBorderStyle>(
    DEFAULT_MULTI_CODE_VIEWER_CONFIG.borderStyle
  );

  /**
   * Whether to show individual content headers inside tabs
   */
  readonly showContentHeader = input<boolean>(
    DEFAULT_MULTI_CODE_VIEWER_CONFIG.showContentHeader
  );

  /**
   * Initial active tab ID (defaults to first tab)
   */
  readonly initialActiveTabId = input<string>('');

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Emits when the active tab changes
   */
  readonly activeTabChange = output<TabChangeEvent>();

  /**
   * Emits when code is copied from a code tab
   */
  readonly codeCopied = output<string>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Currently active tab ID
   */
  private readonly activeTabIdInternal = signal<string>('');

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Current active tab ID (internal or from first tab)
   */
  protected readonly activeTabId = computed(() => {
    const internal = this.activeTabIdInternal();
    if (internal) return internal;

    const initial = this.initialActiveTabId();
    if (initial) return initial;

    const tabs = this.tabs();
    return tabs.length > 0 ? tabs[0].id : '';
  });

  /**
   * Currently active tab item
   */
  protected readonly activeTab = computed(() => {
    const tabs = this.tabs();
    const activeId = this.activeTabId();
    return tabs.find(tab => tab.id === activeId) ?? null;
  });

  /**
   * Type guards for template
   */
  protected readonly isCodeTab = isCodeTabItem;
  protected readonly isDiffTab = isDiffTabItem;

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  constructor() {
    // Initialize active tab from initialActiveTabId input
    effect(() => {
      const initial = this.initialActiveTabId();
      if (initial) {
        untracked(() => {
          this.activeTabIdInternal.set(initial);
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle tab change from tab bar
   */
  protected onTabChange(tabId: string): void {
    const previousId = this.activeTabId();
    const tabs = this.tabs();
    const newIndex = tabs.findIndex(tab => tab.id === tabId);

    if (newIndex >= 0 && tabId !== previousId) {
      this.activeTabIdInternal.set(tabId);
      this.activeTabChange.emit({
        previousTabId: previousId || null,
        currentTabId: tabId,
        currentIndex: newIndex,
      });
    }
  }

  /**
   * Handle code copied event from code viewer
   */
  protected onCodeCopied(tabId: string): void {
    this.codeCopied.emit(tabId);
  }
}
