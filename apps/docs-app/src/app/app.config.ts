import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideLucideIcons } from '@lucide/angular';
import { provideCrylithScrollReset } from '@crylith/shell-angular';
import { appRoutes } from './app.routes';
import { LUCIDE_ICONS } from './icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideCrylithScrollReset(),
    provideHttpClient(withFetch()),
    provideLucideIcons(...LUCIDE_ICONS),
  ],
};
