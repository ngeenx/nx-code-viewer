import { Component, inject } from '@angular/core';
import { LINE_WIDGET_CONTEXT } from '@ngeenx/nx-angular-code-viewer';

/**
 * Sample comment button widget for demonstrating line widgets.
 * Shows a comment icon that can trigger an insert component.
 */
@Component({
  selector: 'app-comment-widget',
  standalone: true,
  template: `
    <button class="comment-btn" [title]="'Add comment to line ' + context.lineNumber">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="12" y1="12" x2="15" y2="12" />
      </svg>
    </button>
  `,
  styles: [
    `
      .comment-btn {
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

      .comment-btn:hover {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
      }
    `,
  ],
})
export class CommentWidgetComponent {
  protected readonly context = inject(LINE_WIDGET_CONTEXT);
}
