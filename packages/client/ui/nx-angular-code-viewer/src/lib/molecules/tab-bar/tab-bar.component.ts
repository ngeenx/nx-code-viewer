import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { CodeViewerTheme, MultiCodeViewerTabItem } from '../../types';
import { TabHeaderComponent } from '../../atoms/tab-header';

/**
 * TabBar Molecule Component
 *
 * Renders a tab bar with multiple tab headers and keyboard navigation support.
 * Implements WAI-ARIA tabs pattern for accessibility.
 *
 * @example
 * ```html
 * <nx-tab-bar
 *   [tabs]="tabItems"
 *   [activeTabId]="'file-1'"
 *   [theme]="'dark'"
 *   (tabChange)="onTabChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'nx-tab-bar',
  standalone: true,
  imports: [TabHeaderComponent],
  templateUrl: './tab-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-tab-bar' },
})
export class TabBarComponent {
  /**
   * Array of tab items
   */
  readonly tabs = input.required<readonly MultiCodeViewerTabItem[]>();

  /**
   * Currently active tab ID
   */
  readonly activeTabId = input.required<string>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Emits when active tab changes
   */
  readonly tabChange = output<string>();

  /**
   * Handle tab click
   */
  protected onTabClick(tabId: string): void {
    if (tabId !== this.activeTabId()) {
      this.tabChange.emit(tabId);
    }
  }

  /**
   * Handle keyboard navigation (a11y)
   */
  protected onTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    const tabs = this.tabs();
    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
    }

    if (newIndex !== null) {
      event.preventDefault();
      this.tabChange.emit(tabs[newIndex].id);
    }
  }
}
