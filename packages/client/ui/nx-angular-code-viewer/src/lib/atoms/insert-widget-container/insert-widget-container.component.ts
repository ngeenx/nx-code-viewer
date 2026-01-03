import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  output,
  Type,
  ViewContainerRef,
} from '@angular/core';
import type { CodeViewerTheme, LineWidgetContext } from '../../types';
import { LINE_WIDGET_CONTEXT } from '../../types';

/**
 * InsertWidgetContainer Atom Component
 *
 * Container for insert components shown between lines.
 * Dynamically renders a component with context injection.
 *
 * @example
 * ```html
 * <nx-insert-widget-container
 *   [component]="CommentFormComponent"
 *   [context]="{ line: 'const x = 1;', lineNumber: 5, theme: 'dark' }"
 *   [theme]="'dark'"
 *   (close)="onClose()"
 * />
 * ```
 */
@Component({
  selector: 'nx-insert-widget-container',
  standalone: true,
  imports: [],
  templateUrl: './insert-widget-container.component.html',
  styleUrl: './insert-widget-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsertWidgetContainerComponent {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly parentInjector = inject(Injector);

  /**
   * The component type to render
   */
  readonly component = input.required<Type<unknown>>();

  /**
   * Context to inject into the component
   */
  readonly context = input.required<LineWidgetContext>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Emitted when the container requests to be closed
   */
  readonly close = output<void>();

  /**
   * Computed CSS classes for the container
   */
  protected readonly containerClasses = computed(() => {
    const themeValue = this.theme();
    return `insert-widget-container ${themeValue}`;
  });

  constructor() {
    // Effect to create/update the component when inputs change
    effect(() => {
      const componentType = this.component();
      const contextValue = this.context();

      // Clear existing component
      this.viewContainerRef.clear();

      // Create injector with context
      const injector = Injector.create({
        providers: [
          {
            provide: LINE_WIDGET_CONTEXT,
            useValue: contextValue,
          },
        ],
        parent: this.parentInjector,
      });

      // Create the component
      this.viewContainerRef.createComponent(componentType, { injector });
    });
  }

  /**
   * Handles close action
   */
  protected onClose(): void {
    this.close.emit();
  }
}
