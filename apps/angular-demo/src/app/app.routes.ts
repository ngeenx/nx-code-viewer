import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.page').then(m => m.LandingPage),
      },
      {
        path: 'basic-examples',
        loadComponent: () =>
          import('./pages/basic-examples/basic-examples.page').then(
            m => m.BasicExamplesPage
          ),
      },
      {
        path: 'display-options',
        loadComponent: () =>
          import('./pages/display-options/display-options.page').then(
            m => m.DisplayOptionsPage
          ),
      },
      {
        path: 'line-highlighting',
        loadComponent: () =>
          import('./pages/line-highlighting/line-highlighting.page').then(
            m => m.LineHighlightingPage
          ),
      },
      {
        path: 'interactive-features',
        loadComponent: () =>
          import('./pages/interactive-features/interactive-features.page').then(
            m => m.InteractiveFeaturesPage
          ),
      },
      {
        path: 'border-styles',
        loadComponent: () =>
          import('./pages/border-styles/border-styles.page').then(
            m => m.BorderStylesPage
          ),
      },
      {
        path: 'theming',
        loadComponent: () =>
          import('./pages/theming/theming.page').then(m => m.ThemingPage),
      },
      {
        path: 'diff-viewer',
        loadComponent: () =>
          import('./pages/diff-viewer/diff-viewer.page').then(
            m => m.DiffViewerPage
          ),
      },
      {
        path: 'multi-code-viewer',
        loadComponent: () =>
          import('./pages/multi-code-viewer/multi-code-viewer.page').then(
            m => m.MultiCodeViewerPage
          ),
      },
      {
        path: 'playground',
        loadComponent: () =>
          import('./pages/playground/playground.page').then(
            m => m.PlaygroundPage
          ),
      },
    ],
  },
];
