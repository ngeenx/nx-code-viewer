import type { Routes } from '@angular/router';
import { categoryRoutes, CrylithLayoutComponent } from '@crylith/shell-angular';
import { DocPageComponent } from './doc-page.component';
import { ThemeBuilderPageComponent } from './theme-builder/theme-builder-page.component';
import { PlaygroundLayoutComponent } from './theme-builder/playground-layout.component';
import { HomeComponent } from './home/home.component';
import { HomeLayoutComponent } from './home/home-layout.component';
import contentConfig from '../../crylith.config';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [{ path: '', pathMatch: 'full', component: HomeComponent }],
  },
  ...categoryRoutes(contentConfig, 'docs', {
    layoutComponent: CrylithLayoutComponent,
    pageComponent: DocPageComponent,
  }),
  ...categoryRoutes(contentConfig, 'examples', {
    layoutComponent: CrylithLayoutComponent,
    pageComponent: DocPageComponent,
  }),
  {
    path: 'theme-builder',
    component: PlaygroundLayoutComponent,
    children: [{ path: '', component: ThemeBuilderPageComponent }],
  },
];
