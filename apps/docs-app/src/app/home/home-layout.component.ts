import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellHeaderComponent } from '@crylith/shell-angular';

/**
 * Landing-page chrome.
 *
 * Wraps the home route with `<crylith-shell-header>` only. No navbar
 * row, no sidebar, no TOC, so the marketing layout stays full-bleed
 * while still inheriting the brand area, version selector, and any
 * shell-registered action slots.
 */
@Component({
  selector: 'app-home-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ShellHeaderComponent],
  template: `
    <div class="home-layout">
      <crylith-shell-header class="home-layout__header" />
      <main class="home-layout__main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .home-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .home-layout__header {
        position: sticky;
        top: 0;
        z-index: 50;
      }

      /* Home-only chrome. The shell header is rendered by the
         crylith-shell-header component, so ::ng-deep reaches into its
         zone markup, while :host keeps the override scoped to this
         layout (the home route) and never leaks to the docs shell. */
      :host ::ng-deep .crylith-zone-header {
        max-width: 72rem;
        margin: 0.75rem auto;
        border-radius: 1rem;
      }

      .home-layout__main {
        flex: 1;
        display: block;
      }
    `,
  ],
})
export class HomeLayoutComponent {}
