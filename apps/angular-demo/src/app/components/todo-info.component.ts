import { Component, input } from '@angular/core';

/**
 * Custom info component for TODO references
 * Demonstrates using an Angular component as popover content
 */
@Component({
  selector: 'app-todo-info',
  standalone: true,
  template: `
    <div class="todo-info">
      <div class="todo-header">
        <span class="todo-icon">📝</span>
        <strong>TODO Item</strong>
      </div>
      <p class="todo-text">{{ matchedText() }}</p>
      <p class="todo-description">
        This task needs to be completed. Found on line {{ lineNumber() }}.
      </p>
      <div class="todo-actions">
        <span class="priority-badge">Priority: Medium</span>
      </div>
    </div>
  `,
  styles: `
    .todo-info {
      min-width: 200px;
    }
    .todo-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .todo-icon {
      font-size: 1.25rem;
    }
    .todo-text {
      font-family: monospace;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      margin: 0.5rem 0;
    }
    .todo-description {
      font-size: 0.875rem;
      opacity: 0.8;
      margin: 0.5rem 0;
    }
    .todo-actions {
      margin-top: 0.5rem;
    }
    .priority-badge {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      background: #f59e0b;
      color: #000;
    }
  `,
})
export class TodoInfoComponent {
  readonly matchedText = input<string>('');
  readonly captureGroups = input<readonly string[]>([]);
  readonly lineNumber = input<number>(0);
}
