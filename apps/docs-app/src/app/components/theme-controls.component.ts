import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { getThemeMode, toggleTheme } from '@crylith/theme-default';

/**
 * Floating dark/light toggle for the docs chrome. Standalone so it can
 * be mounted as a custom element from `main.ts` and dropped onto
 * `document.body` without touching the shell-angular templates.
 *
 * Built as a quick UX prototype; if we keep the broader theme work the
 * button should migrate into a proper navbar-action slot inside
 * `@crylith/shell-angular` so other consumers benefit too.
 */
@Component({
  selector: 'app-theme-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="theme-controls"
      (click)="onToggle()"
      [attr.aria-label]="
        mode() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      ">
      {{ mode() === 'dark' ? '☀' : '☾' }}
    </button>
  `,
  styles: [
    `
      :host {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1000;
      }
      .theme-controls {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
        border: 1px solid color-mix(in oklab, currentColor 20%, transparent);
        background: color-mix(in oklab, Canvas 92%, transparent);
        color: CanvasText;
        cursor: pointer;
        font-size: 1.125rem;
        box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
        transition: transform 0.15s ease;
      }
      .theme-controls:hover {
        transform: translateY(-1px);
      }
    `,
  ],
})
export class ThemeControlsComponent implements OnInit {
  protected readonly mode = signal<'light' | 'dark'>('light');

  ngOnInit(): void {
    this.mode.set(getThemeMode());
  }

  protected onToggle(): void {
    this.mode.set(toggleTheme());
  }
}
