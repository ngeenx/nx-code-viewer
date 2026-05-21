import type { Type } from '@angular/core';
import type { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import {
  BorderStylesDemoComponent,
  CodeViewerBasicDemoComponent,
} from '@docs-app/demo-components';

/**
 * Map of every standalone demo component exposed by `apps/angular-demo`
 * to the custom-element tag name that markdown files reference. The
 * tags must match the ones authored under `apps/docs-app/content/**`.
 *
 * The matching demo files live at
 * `apps/angular-demo/src/app/components/demo/<name>-demo.component.ts`
 * and are also imported by the standalone Angular app itself, so this
 * registry is the only docs-app-side change required when a new demo
 * lands.
 */
const DEMO_ELEMENTS: Array<readonly [string, Type<unknown>]> = [
  ['app-border-styles-demo', BorderStylesDemoComponent],
  ['app-code-viewer-basic-demo', CodeViewerBasicDemoComponent],
];

export function registerDemoElements(app: ApplicationRef): void {
  for (const [tag, component] of DEMO_ELEMENTS) {
    if (customElements.get(tag)) continue;
    const element = createCustomElement(component, {
      injector: app.injector,
    });
    customElements.define(tag, element);
  }
}
