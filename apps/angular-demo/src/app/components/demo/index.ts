/**
 * Public barrel for the angular-demo standalone components that
 * docs-app surfaces as live `<app-*-demo>` web components.
 *
 * Each component must:
 *   - Be `standalone: true`
 *   - Carry no injected app-level services (no `ThemeService`, etc.)
 *   - Accept all knobs as signal inputs with sensible defaults so a
 *     bare `<tag></tag>` renders something useful
 */
export { default as BorderStylesDemoComponent } from './border-styles-demo.component';
export { default as CodeViewerBasicDemoComponent } from './code-viewer-basic-demo.component';
