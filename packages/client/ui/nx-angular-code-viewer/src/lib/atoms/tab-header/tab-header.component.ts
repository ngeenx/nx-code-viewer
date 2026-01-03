import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { CodeViewerTheme } from '../../types';
import { getFileIconUrl } from '../../utils';

/**
 * TabHeader Atom Component
 *
 * Renders a single tab header with file icon, name, and active state.
 * Used within TabBarComponent for tab navigation.
 *
 * @example
 * ```html
 * <nx-tab-header
 *   tabId="file-1"
 *   fileName="app.component.ts"
 *   fileExtension=".ts"
 *   [isActive]="true"
 *   [theme]="'dark'"
 *   (tabClick)="onTabClick($event)"
 * />
 * ```
 */
@Component({
  selector: 'nx-tab-header',
  standalone: true,
  imports: [],
  templateUrl: './tab-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-tab-header' },
})
export class TabHeaderComponent {
  /**
   * Unique identifier for the tab
   */
  readonly tabId = input.required<string>();

  /**
   * Display name for the tab
   */
  readonly fileName = input.required<string>();

  /**
   * File extension for icon display
   */
  readonly fileExtension = input<string>('');

  /**
   * Whether this tab is currently active
   */
  readonly isActive = input<boolean>(false);

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Emits when the tab is clicked
   */
  readonly tabClick = output<string>();

  /**
   * Emits when keyboard navigation occurs
   */
  readonly tabKeydown = output<KeyboardEvent>();

  /**
   * Computed icon URL from file extension
   */
  protected readonly iconUrl = computed(() => {
    const ext = this.fileExtension();
    return ext ? getFileIconUrl(ext) : null;
  });

  /**
   * Handle click events
   */
  protected onClick(): void {
    this.tabClick.emit(this.tabId());
  }

  /**
   * Handle keyboard events
   */
  protected onKeydown(event: KeyboardEvent): void {
    this.tabKeydown.emit(event);
  }
}
