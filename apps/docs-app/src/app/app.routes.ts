import type { Routes } from '@angular/router';
import { categoryRoutes, CrylithLayoutComponent } from '@crylith/shell-angular';
import { DocPageComponent } from './doc-page.component';
import contentConfig from '../../crylith.config';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'docs' },
  ...categoryRoutes(contentConfig, 'docs', {
    layoutComponent: CrylithLayoutComponent,
    pageComponent: DocPageComponent,
  }),
  ...categoryRoutes(contentConfig, 'examples', {
    layoutComponent: CrylithLayoutComponent,
    pageComponent: DocPageComponent,
  }),
];
