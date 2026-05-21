import { createCustomElement } from '@angular/elements';
import { bootstrapApplication } from '@angular/platform-browser';
import { initTheme } from '@crylith/theme-default';
import {
  createIframeThemeProvider,
  registerCrylithLiveDemo,
} from '@crylith/live-demos/runtime';
import { createLiveDemoFrameworkSource } from '@crylith/shell-core';
import crylithConfig from '../crylith.config';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ThemeControlsComponent } from './app/components/theme-controls.component';
import { registerDemoElements } from './app/register-demo-elements';

initTheme();

// Wire the sidebar select (key: 'framework') as the global source of
// truth for every `<crylith-live-demo>` mount. Each demo reads the
// current value at attach time and re-activates whenever the user
// changes the dropdown. The per-element framework tab row is hidden
// while a source is wired - the sidebar select is the only switch.
registerCrylithLiveDemo({
  frameworkSource: createLiveDemoFrameworkSource(),
  // Iframe palette comes from `liveDemoIframeTheme` in crylith.config.ts.
  themeProvider: createIframeThemeProvider(crylithConfig),
});

bootstrapApplication(App, appConfig)
  .then(app => {
    registerDemoElements(app);
    // Mount the floating theme controls without touching shell-angular's
    // templates. If we keep this widget long-term it should move into
    // a real navbar-action slot inside @crylith/shell-angular so other
    // consumers benefit; for now it's a docs-app-local prototype.
    if (!customElements.get('app-theme-controls')) {
      customElements.define(
        'app-theme-controls',
        createCustomElement(ThemeControlsComponent, { injector: app.injector })
      );
    }
    if (!document.querySelector('app-theme-controls')) {
      document.body.appendChild(document.createElement('app-theme-controls'));
    }
  })
  .catch(err => console.error(err));
