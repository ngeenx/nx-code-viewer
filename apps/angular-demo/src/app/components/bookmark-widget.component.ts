import { Component, inject, signal } from '@angular/core';
import { LINE_WIDGET_CONTEXT } from '@ngeenx/nx-angular-code-viewer';

/**
 * Sample bookmark widget component for demonstrating line widgets.
 * Shows a bookmark icon that toggles on click.
 */
@Component({
  selector: 'app-bookmark-widget',
  standalone: true,
  template: `
    <button
      class="bookmark-btn"
      [class.bookmarked]="isBookmarked()"
      [title]="isBookmarked() ? 'Remove bookmark' : 'Bookmark line ' + context.lineNumber"
      (click)="toggle($event)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        [attr.fill]="isBookmarked() ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  `,
  styles: [
    `
      .bookmark-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: none;
        background: transparent;
        color: #6b7280;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.15s ease;
      }

      .bookmark-btn:hover {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
      }

      .bookmark-btn.bookmarked {
        color: #eab308;
      }

      .bookmark-btn.bookmarked:hover {
        color: #ca8a04;
        background: rgba(234, 179, 8, 0.1);
      }
    `,
  ],
})
export class BookmarkWidgetComponent {
  protected readonly context = inject(LINE_WIDGET_CONTEXT);
  protected readonly isBookmarked = signal(false);

  toggle(event: Event): void {
    event.stopPropagation();
    this.isBookmarked.update(v => !v);
    console.log(
      `Line ${this.context.lineNumber} ${this.isBookmarked() ? 'bookmarked' : 'unbookmarked'}:`,
      this.context.line
    );
  }
}
